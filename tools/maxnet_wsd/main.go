package main

import (
	"bufio"
	"crypto/sha1"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
)

const (
	wsPort     = ":7682"
	wsGUID     = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
	firmwareVer = "v2.2.59"
)

type WSClient struct {
	conn net.Conn
	mu   sync.Mutex
}

type Hub struct {
	clients map[*WSClient]bool
	mu      sync.RWMutex
}

var hub = &Hub{
	clients: make(map[*WSClient]bool),
}

func (h *Hub) Add(c *WSClient) {
	h.mu.Lock()
	h.clients[c] = true
	h.mu.Unlock()
}

func (h *Hub) Remove(c *WSClient) {
	h.mu.Lock()
	if _, ok := h.clients[c]; ok {
		delete(h.clients, c)
		_ = c.conn.Close()
	}
	h.mu.Unlock()
}

func (h *Hub) Broadcast(msg []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for c := range h.clients {
		go func(client *WSClient) {
			client.mu.Lock()
			defer client.mu.Unlock()
			_ = sendWSFrame(client.conn, msg)
		}(c)
	}
}

func sendWSFrame(conn net.Conn, payload []byte) error {
	length := len(payload)
	var header []byte
	header = append(header, 0x81) // FIN + Text frame

	if length <= 125 {
		header = append(header, byte(length))
	} else if length <= 65535 {
		header = append(header, 126, byte(length>>8), byte(length&0xFF))
	} else {
		header = append(header, 127,
			byte(length>>56), byte(length>>48), byte(length>>40), byte(length>>32),
			byte(length>>24), byte(length>>16), byte(length>>8), byte(length&0xFF))
	}

	if _, err := conn.Write(header); err != nil {
		return err
	}
	_, err := conn.Write(payload)
	return err
}

func isTokenValid(token string) bool {
	if token == "" {
		return false
	}
	cleanToken := filepath.Base(token)
	if cleanToken == "." || cleanToken == "/" || len(cleanToken) < 16 {
		return false
	}
	sessionPath := filepath.Join("/tmp/sessions", cleanToken)
	info, err := os.Stat(sessionPath)
	return err == nil && !info.IsDir()
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	if token == "" {
		if c, err := r.Cookie("maxnet_token"); err == nil {
			token = c.Value
		}
	}

	if !isTokenValid(token) {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	if strings.ToLower(r.Header.Get("Upgrade")) != "websocket" {
		http.Error(w, "Expected WebSocket", http.StatusBadRequest)
		return
	}

	key := r.Header.Get("Sec-WebSocket-Key")
	if key == "" {
		http.Error(w, "Missing Sec-WebSocket-Key", http.StatusBadRequest)
		return
	}

	h := sha1.New()
	h.Write([]byte(key + wsGUID))
	accept := base64.StdEncoding.EncodeToString(h.Sum(nil))

	hj, ok := w.(http.Hijacker)
	if !ok {
		http.Error(w, "Webserver doesn't support hijacking", http.StatusInternalServerError)
		return
	}
	conn, bufrw, err := hj.Hijack()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	handshake := "HTTP/1.1 101 Switching Protocols\r\n" +
		"Upgrade: websocket\r\n" +
		"Connection: Upgrade\r\n" +
		"Sec-WebSocket-Accept: " + accept + "\r\n\r\n"

	if _, err := bufrw.WriteString(handshake); err != nil {
		_ = conn.Close()
		return
	}
	_ = bufrw.Flush()

	client := &WSClient{conn: conn}
	hub.Add(client)
	defer hub.Remove(client)

	// Send initial greeting & full status snapshot
	initialData := getTelemetrySnapshot()
	initialJSON, _ := json.Marshal(initialData)
	_ = sendWSFrame(conn, initialJSON)

	// Reader loop for keepalive pings / incoming client commands
	reader := bufio.NewReader(conn)
	for {
		b1, err := reader.ReadByte()
		if err != nil {
			break
		}
		b2, err := reader.ReadByte()
		if err != nil {
			break
		}

		opcode := b1 & 0x0F
		if opcode == 0x08 { // Close frame
			break
		}

		isMasked := (b2 & 0x80) != 0
		payloadLen := int(b2 & 0x7F)

		if payloadLen == 126 {
			var ext [2]byte
			if _, err := io.ReadFull(reader, ext[:]); err != nil {
				break
			}
			payloadLen = int(ext[0])<<8 | int(ext[1])
		} else if payloadLen == 127 {
			var ext [8]byte
			if _, err := io.ReadFull(reader, ext[:]); err != nil {
				break
			}
			payloadLen = int(ext[4])<<24 | int(ext[5])<<16 | int(ext[6])<<8 | int(ext[7])
		}

		var mask [4]byte
		if isMasked {
			if _, err := io.ReadFull(reader, mask[:]); err != nil {
				break
			}
		}

		payload := make([]byte, payloadLen)
		if _, err := io.ReadFull(reader, payload); err != nil {
			break
		}

		if isMasked {
			for i := 0; i < payloadLen; i++ {
				payload[i] ^= mask[i%4]
			}
		}

		if opcode == 0x09 { // Ping
			// Reply Pong (opcode 0x0A)
			pong := []byte{0x8A, 0x00}
			_, _ = conn.Write(pong)
		} else if opcode == 0x01 { // Text
			var req map[string]interface{}
			if err := json.Unmarshal(payload, &req); err == nil {
				if act, ok := req["action"].(string); ok && (act == "status" || act == "sync") {
					fullStatus := getFullStatusSnapshot()
					if len(fullStatus) > 0 {
						_ = sendWSFrame(conn, fullStatus)
					}
				}
			}
		}
	}
}

type TelemetryPayload struct {
	Type          string  `json:"type"`
	Timestamp     int64   `json:"timestamp"`
	Firmware      string  `json:"firmware"`
	CpuPct        float64 `json:"cpu_pct"`
	RamPct        float64 `json:"ram_pct"`
	PhysUsedMb    int     `json:"phys_used_mb"`
	PhysTotalMb   int     `json:"phys_total_mb"`
	ZramUsedPct   float64 `json:"zram_used_pct"`
	TempC         float64 `json:"temp_c"`
	RxMbps        float64 `json:"rx_mbps"`
	TxMbps        float64 `json:"tx_mbps"`
	CombinedMbps  float64 `json:"combined_mbps"`
	WanRxBytes    uint64  `json:"wan_rx_bytes"`
	WanTxBytes    uint64  `json:"wan_tx_bytes"`
	ClientsOnline int     `json:"clients_online"`
	ActiveUplink  string  `json:"active_uplink"`
}

var (
	prevWork  uint64
	prevTotal uint64
	prevRx    uint64
	prevTx    uint64
	prevTime  time.Time
)

func readCPU() float64 {
	f, err := os.Open("/proc/stat")
	if err != nil {
		return 0
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	if scanner.Scan() {
		fields := strings.Fields(scanner.Text())
		if len(fields) >= 5 && fields[0] == "cpu" {
			var user, nice, sys, idle, iowait, irq, softirq uint64
			user, _ = strconv.ParseUint(fields[1], 10, 64)
			nice, _ = strconv.ParseUint(fields[2], 10, 64)
			sys, _ = strconv.ParseUint(fields[3], 10, 64)
			idle, _ = strconv.ParseUint(fields[4], 10, 64)
			if len(fields) >= 6 {
				iowait, _ = strconv.ParseUint(fields[5], 10, 64)
			}
			if len(fields) >= 7 {
				irq, _ = strconv.ParseUint(fields[6], 10, 64)
			}
			if len(fields) >= 8 {
				softirq, _ = strconv.ParseUint(fields[7], 10, 64)
			}

			work := user + nice + sys + irq + softirq
			total := work + idle + iowait

			if prevTotal > 0 && total > prevTotal {
				dWork := float64(work - prevWork)
				dTotal := float64(total - prevTotal)
				prevWork = work
				prevTotal = total
				pct := (dWork / dTotal) * 100
				return math.Round(pct*10) / 10
			}
			prevWork = work
			prevTotal = total
		}
	}
	return 0
}

func readMem() (ramPct float64, usedMb, totalMb int, zramPct float64) {
	f, err := os.Open("/proc/meminfo")
	if err != nil {
		return 0, 0, 0, 0
	}
	defer f.Close()

	var memTotal, memFree, memAvail, buffers, cached, swapTotal, swapFree uint64
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		parts := strings.Fields(scanner.Text())
		if len(parts) >= 2 {
			val, _ := strconv.ParseUint(parts[1], 10, 64)
			switch parts[0] {
			case "MemTotal:":
				memTotal = val
			case "MemFree:":
				memFree = val
			case "MemAvailable:":
				memAvail = val
			case "Buffers:":
				buffers = val
			case "Cached:":
				cached = val
			case "SwapTotal:":
				swapTotal = val
			case "SwapFree:":
				swapFree = val
			}
		}
	}

	if memAvail == 0 {
		memAvail = memFree + buffers + cached
	}
	totalMb = int(memTotal / 1024)
	usedMb = int((memTotal - memAvail) / 1024)
	if memTotal > 0 {
		ramPct = math.Round((float64(usedMb)/float64(totalMb))*1000) / 10
	}
	if swapTotal > 0 {
		zramPct = math.Round((float64(swapTotal-swapFree)/float64(swapTotal))*1000) / 10
	}
	return
}

func readTemp() float64 {
	tempPaths := []string{
		"/sys/class/thermal/thermal_zone0/temp",
		"/sys/class/hwmon/hwmon0/temp1_input",
	}
	for _, p := range tempPaths {
		if data, err := os.ReadFile(p); err == nil {
			str := strings.TrimSpace(string(data))
			if val, err := strconv.ParseFloat(str, 64); err == nil {
				if val > 1000 {
					return math.Round((val/1000)*10) / 10
				}
				return val
			}
		}
	}
	return 39.0
}

func readTraffic() (rxMbps, txMbps float64, totalRx, totalTx uint64, activeIface string) {
	activeIface = "usb0"
	candidateIfaces := []string{"usb0", "wan", "eth0", "ncm0"}
	for _, iface := range candidateIfaces {
		if _, err := os.Stat(filepath.Join("/sys/class/net", iface)); err == nil {
			activeIface = iface
			break
		}
	}

	f, err := os.Open("/proc/net/dev")
	if err != nil {
		return
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	now := time.Now()
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if strings.HasPrefix(line, activeIface+":") {
			parts := strings.Fields(line[len(activeIface)+1:])
			if len(parts) >= 9 {
				totalRx, _ = strconv.ParseUint(parts[0], 10, 64)
				totalTx, _ = strconv.ParseUint(parts[8], 10, 64)

				if prevRx > 0 && !prevTime.IsZero() {
					dt := now.Sub(prevTime).Seconds()
					if dt > 0.3 {
						dRx := float64(totalRx - prevRx)
						dTx := float64(totalTx - prevTx)
						rxMbps = math.Round((dRx*8/(dt*1000000))*100) / 100
						txMbps = math.Round((dTx*8/(dt*1000000))*100) / 100
					}
				}
				prevRx = totalRx
				prevTx = totalTx
				prevTime = now
				break
			}
		}
	}
	return
}

func readClientsCount() int {
	data, err := os.ReadFile("/tmp/dhcp.leases")
	if err != nil {
		return 0
	}
	lines := strings.Split(strings.TrimSpace(string(data)), "\n")
	cnt := 0
	for _, l := range lines {
		if strings.TrimSpace(l) != "" {
			cnt++
		}
	}
	return cnt
}

func getTelemetrySnapshot() TelemetryPayload {
	cpu := readCPU()
	ramPct, usedMb, totalMb, zramPct := readMem()
	temp := readTemp()
	rxM, txM, totRx, totTx, activeIf := readTraffic()
	clients := readClientsCount()

	fw := firmwareVer
	if data, err := os.ReadFile("/etc/maxnet_version"); err == nil {
		lines := strings.Split(string(data), "\n")
		for _, l := range lines {
			if strings.HasPrefix(l, "VERSION=") {
				v := strings.TrimPrefix(l, "VERSION=")
				if v != "" {
					fw = "v" + strings.TrimPrefix(v, "v")
				}
			}
		}
	}

	comb := math.Round((rxM+txM)*100) / 100

	return TelemetryPayload{
		Type:          "telemetry",
		Timestamp:     time.Now().Unix(),
		Firmware:      fw,
		CpuPct:        cpu,
		RamPct:        ramPct,
		PhysUsedMb:    usedMb,
		PhysTotalMb:   totalMb,
		ZramUsedPct:   zramPct,
		TempC:         temp,
		RxMbps:        rxM,
		TxMbps:        txM,
		CombinedMbps:  comb,
		WanRxBytes:    totRx,
		WanTxBytes:    totTx,
		ClientsOnline: clients,
		ActiveUplink:  activeIf,
	}
}

func getFullStatusSnapshot() []byte {
	out, err := exec.Command("/www/cgi-bin/status").Output()
	if err != nil {
		return nil
	}
	parts := strings.SplitN(string(out), "\r\n\r\n", 2)
	if len(parts) < 2 {
		parts = strings.SplitN(string(out), "\n\n", 2)
	}
	if len(parts) >= 2 {
		return []byte(strings.TrimSpace(parts[1]))
	}
	return nil
}

func main() {
	// Initialize CPU and Traffic baselines
	readCPU()
	readTraffic()

	// HTTP handlers
	http.HandleFunc("/ws", handleWebSocket)
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		hostname, _ := os.Hostname()
		if hostname == "" {
			hostname = "MAXNET"
		}
		fw := firmwareVer
		if data, err := os.ReadFile("/etc/maxnet_version"); err == nil {
			for _, l := range strings.Split(string(data), "\n") {
				if strings.HasPrefix(l, "VERSION=") {
					fw = strings.TrimPrefix(l, "VERSION=")
				}
			}
		}
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"status":   "ok",
			"hostname": hostname,
			"firmware": fw,
		})
	})

	// Background 1-second telemetry broadcast loop
	go func() {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()
		counter := 0
		for range ticker.C {
			counter++
			telemetry := getTelemetrySnapshot()
			payload, err := json.Marshal(telemetry)
			if err == nil {
				hub.Broadcast(payload)
			}
			// Every 30 seconds broadcast full topology sync
			if counter%30 == 0 {
				full := getFullStatusSnapshot()
				if len(full) > 0 {
					hub.Broadcast(full)
				}
			}
		}
	}()

	fmt.Printf("[MAXNET-WSD] WebSocket Real-Time Telemetry Engine listening on %s\n", wsPort)
	if err := http.ListenAndServe(wsPort, nil); err != nil {
		fmt.Fprintf(os.Stderr, "Server failed: %v\n", err)
		os.Exit(1)
	}
}
