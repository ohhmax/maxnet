#!/bin/sh
# Maxnet Gateway Persistent Traffic & 15-Day Device History Daemon

PERSIST_TSV="/etc/traffic_totals.tsv"
PERSIST_JSON="/etc/traffic_stats.json"
LIFETIME_JSON="/etc/traffic_lifetime.json"
HISTORY_15D_JSON="/etc/device_history_30d.json"

LIVE_TSV="/tmp/traffic_totals.tsv"
LIVE_JSON="/tmp/traffic_stats.json"

# Pre-populate tmp files from persistent storage if available
[ -f "$PERSIST_JSON" ] && [ ! -f "$LIVE_JSON" ] && cp -f "$PERSIST_JSON" "$LIVE_JSON"
[ -f "$PERSIST_TSV" ] && [ ! -f "$LIVE_TSV" ] && cp -f "$PERSIST_TSV" "$LIVE_TSV"

# Initialize lifetime traffic if not present
if [ ! -f "$LIFETIME_JSON" ]; then
    WAN_R=23359818489
    WAN_T=27781118139
    if [ -f "$PERSIST_JSON" ]; then
        R=$(jq -r '.wan.rx_bytes // 0' "$PERSIST_JSON" 2>/dev/null)
        T=$(jq -r '.wan.tx_bytes // 0' "$PERSIST_JSON" 2>/dev/null)
        [ "$R" -gt 0 ] 2>/dev/null && WAN_R=$R
        [ "$T" -gt 0 ] 2>/dev/null && WAN_T=$T
    fi
    cat << EOF > "$LIFETIME_JSON"
{
  "lifetime_rx_bytes": $WAN_R,
  "lifetime_tx_bytes": $WAN_T,
  "lifetime_total_bytes": $(($WAN_R + $WAN_T)),
  "created_at": $(date +%s),
  "last_updated": $(date +%s)
}
EOF
fi

save_and_exit() {
    [ -f "$LIVE_TSV" ] && cp -f "$LIVE_TSV" "$PERSIST_TSV"
    [ -f "$LIVE_JSON" ] && cp -f "$LIVE_JSON" "$PERSIST_JSON"
    sync
    exit 0
}

trap 'save_and_exit' TERM INT HUP QUIT EXIT

awk '
BEGIN {
  persist_tsv = "/etc/traffic_totals.tsv";
  persist_json = "/etc/traffic_stats.json";
  lifetime_json = "/etc/traffic_lifetime.json";
  history_json = "/etc/device_history_30d.json";
  live_tsv = "/tmp/traffic_totals.tsv";
  live_json = "/tmp/traffic_stats.json";
  tick = 0;
  has_saved_wan = 0;
  RETENTION_30D = 30 * 86400; # 1,296,000 seconds

  # Load Lifetime WAN accumulator
  lifetime_rx = 23359818489;
  lifetime_tx = 27781118139;
  while ((getline line < lifetime_json) > 0) {
    if (line ~ /"lifetime_rx_bytes":/) {
      gsub(/[^0-9]/, "", line);
      if (line + 0 > 0) lifetime_rx = line + 0;
    }
    if (line ~ /"lifetime_tx_bytes":/) {
      gsub(/[^0-9]/, "", line);
      if (line + 0 > 0) lifetime_tx = line + 0;
    }
  }
  close(lifetime_json);

  # 1. Load baseline totals if exists
  if ((getline < persist_tsv) > 0) {
    close(persist_tsv);
    while ((getline line < persist_tsv) > 0) {
      if (line ~ /^#/ || length(line) < 5) continue;
      split(line, parts, " ");
      id = parts[1];
      saved_rx[id] = parts[3] + 0;
      saved_tx[id] = parts[4] + 0;
      saved_name[id] = parts[5];
    }
    close(persist_tsv);
  }

  if ("WAN" in saved_rx) {
    wan_base_rx = saved_rx["WAN"] + 0;
    wan_base_tx = saved_tx["WAN"] + 0;
    has_saved_wan = 1;
  } else {
    wan_base_rx = 0;
    wan_base_tx = 0;
  }

  # Known friendly device names
  known_name["10:65:30:7a:9c:02"] = "maxos";
  known_name["00:11:32:92:02:1b"] = "Synology NAS";
  known_name["a8:1b:5a:c3:01:13"] = "Asus Router";
  known_name["8c:a3:99:7b:81:2b"] = "maxnet-b";
  known_name["f2:82:95:8f:db:29"] = "Vivo V2153";
  known_name["76:74:c6:67:5a:89"] = "POCO-X6-5G";
  known_name["f6:93:15:10:10:d2"] = "POCO-X6-5G";

  # Known ports
  known_port["10:65:30:7a:9c:02"] = "LAN 2";
  known_port["00:11:32:92:02:1b"] = "LAN 3";
  known_port["a8:1b:5a:c3:01:13"] = "LAN 3";
  known_port["8c:a3:99:7b:81:2b"] = "LAN 3";
  known_port["f2:82:95:8f:db:29"] = "LAN 3";
  known_port["76:74:c6:67:5a:89"] = "LAN 3";

  last_raw_rx = 0;
  last_raw_tx = 0;
  initialized = 0;

  now = systime();
  # Pre-seed initial device history timestamps
  for (m in saved_rx) {
    if (m != "WAN" && m != "") {
      dev_first_seen[m] = now - 86400;
      dev_last_seen[m] = now;
    }
  }

  while (1) {
    tick++;
    now = systime();

    # Read ARP mapping (IP -> MAC)
    delete ip_to_mac;
    delete mac_to_ip;
    while ((getline line < "/proc/net/arp") > 0) {
      if (line ~ /^IP/) continue;
      split(line, parts, " ");
      if (parts[6] == "br-lan" && parts[4] != "00:00:00:00:00:00") {
        m = tolower(parts[4]);
        ip_to_mac[parts[1]] = m;
        mac_to_ip[m] = parts[1];
        if (!(m in dev_first_seen)) dev_first_seen[m] = now;
        dev_last_seen[m] = now;
      }
    }
    close("/proc/net/arp");

    # Read DHCP leases (MAC -> Name)
    while ((getline line < "/tmp/dhcp.leases") > 0) {
      split(line, parts, " ");
      m = tolower(parts[2]);
      h = parts[4];
      if (h != "" && h != "*") mac_to_name[m] = h;
    }
    close("/tmp/dhcp.leases");

    # Read raw interface bytes from usb0
    raw_rx = 0; raw_tx = 0;
    if ((getline line < "/sys/class/net/usb0/statistics/rx_bytes") > 0) raw_rx = line + 0;
    close("/sys/class/net/usb0/statistics/rx_bytes");
    if ((getline line < "/sys/class/net/usb0/statistics/tx_bytes") > 0) raw_tx = line + 0;
    close("/sys/class/net/usb0/statistics/tx_bytes");

    if (!initialized) {
      if (!has_saved_wan) {
        wan_base_rx = raw_rx;
        wan_base_tx = raw_tx;
      }
      last_raw_rx = raw_rx;
      last_raw_tx = raw_tx;
      initialized = 1;
    } else {
      d_rx = (raw_rx >= last_raw_rx) ? (raw_rx - last_raw_rx) : raw_rx;
      d_tx = (raw_tx >= last_raw_tx) ? (raw_tx - last_raw_tx) : raw_tx;
      wan_base_rx += d_rx;
      wan_base_tx += d_tx;
      lifetime_rx += d_rx;
      lifetime_tx += d_tx;
      last_raw_rx = raw_rx;
      last_raw_tx = raw_tx;
    }

    # Track conntrack deltas
    delete curr_flow_tx;
    delete curr_flow_rx;

    while ((getline line < "/proc/net/nf_conntrack") > 0) {
      if (line !~ /src=10\.0\.0\./) continue;
      n = split(line, f, " ");
      src_ip = ""; dst_ip = ""; sport = ""; dport = "";
      b1 = 0; b2 = 0; bc = 0;
      for (i = 1; i <= n; i++) {
        if (f[i] ~ /^src=10\.0\.0\./ && src_ip == "") src_ip = substr(f[i], 5);
        else if (f[i] ~ /^dst=/ && dst_ip == "") dst_ip = substr(f[i], 5);
        else if (f[i] ~ /^sport=/ && sport == "") sport = substr(f[i], 7);
        else if (f[i] ~ /^dport=/ && dport == "") dport = substr(f[i], 7);
        else if (f[i] ~ /^bytes=/) {
          bc++;
          val = substr(f[i], 7) + 0;
          if (bc == 1) b1 = val;
          else if (bc == 2) b2 = val;
        }
      }

      if (src_ip != "" && src_ip != "10.0.0.1") {
        fk = src_ip ":" sport ":" dst_ip ":" dport;
        curr_flow_tx[fk] = b1;
        curr_flow_rx[fk] = b2;

        p_tx = (fk in prev_flow_tx) ? prev_flow_tx[fk] : 0;
        p_rx = (fk in prev_flow_rx) ? prev_flow_rx[fk] : 0;
        d_tx = (b1 >= p_tx) ? (b1 - p_tx) : b1;
        d_rx = (b2 >= p_rx) ? (b2 - p_rx) : b2;

        mac = (src_ip in ip_to_mac) ? ip_to_mac[src_ip] : src_ip;
        saved_tx[mac] += d_tx;
        saved_rx[mac] += d_rx;

        if (d_tx > 0 || d_rx > 0) {
          dev_last_seen[mac] = now;
        }
      }
    }
    close("/proc/net/nf_conntrack");

    delete prev_flow_tx;
    delete prev_flow_rx;
    for (k in curr_flow_tx) {
      prev_flow_tx[k] = curr_flow_tx[k];
      prev_flow_rx[k] = curr_flow_rx[k];
    }

    # Write /tmp/traffic_stats.json atomically
    tmp_json = "/tmp/traffic_stats.tmp";
    wan_rx_mb = sprintf("%.2f", wan_base_rx / 1048576);
    wan_tx_mb = sprintf("%.2f", wan_base_tx / 1048576);
    wan_tot_mb = sprintf("%.2f", (wan_base_rx + wan_base_tx) / 1048576);

    printf "{\n" > tmp_json;
    printf "  \"updated_at\": %.0f,\n", now >> tmp_json;
    printf "  \"wan\": {\"rx_bytes\": %.0f, \"tx_bytes\": %.0f, \"rx_mb\": \"%s\", \"tx_mb\": \"%s\", \"total_mb\": \"%s\"},\n",
      wan_base_rx, wan_base_tx, wan_rx_mb, wan_tx_mb, wan_tot_mb >> tmp_json;
    printf "  \"devices\": {\n" >> tmp_json;

    first = 1;
    for (m in saved_rx) {
      if (m == "WAN" || m == "") continue;
      # 15-day pruning check
      if ((m in dev_last_seen) && (now - dev_last_seen[m] > RETENTION_30D)) {
        continue;
      }

      tot_b = saved_rx[m] + saved_tx[m];
      rx_mb = sprintf("%.2f", saved_rx[m] / 1048576);
      tx_mb = sprintf("%.2f", saved_tx[m] / 1048576);
      tot_mb = sprintf("%.2f", tot_b / 1048576);
      ip = (m in mac_to_ip) ? mac_to_ip[m] : "";
      name = (m in known_name) ? known_name[m] : ((m in mac_to_name) ? mac_to_name[m] : "Device");

      if (!first) printf ",\n" >> tmp_json;
      first = 0;
      printf "    \"%s\": {\"ip\": \"%s\", \"mac\": \"%s\", \"name\": \"%s\", \"rx_bytes\": %.0f, \"tx_bytes\": %.0f, \"total_bytes\": %.0f, \"rx_mb\": \"%s\", \"tx_mb\": \"%s\", \"total_mb\": \"%s\"}",
        m, ip, m, name, saved_rx[m], saved_tx[m], tot_b, rx_mb, tx_mb, tot_mb >> tmp_json;
    }
    printf "\n  }\n}\n" >> tmp_json;
    close(tmp_json);
    system("mv /tmp/traffic_stats.tmp /tmp/traffic_stats.json");

    # Write /tmp/traffic_totals.tsv every tick
    tmp_tsv = "/tmp/traffic_totals.tmp";
    printf "# MAC IP RX_BYTES TX_BYTES NAME\n" > tmp_tsv;
    printf "WAN 10.43.99.139 %.0f %.0f Gateway\n", wan_base_rx, wan_base_tx >> tmp_tsv;
    for (m in saved_rx) {
      if (m == "WAN" || m == "") continue;
      if ((m in dev_last_seen) && (now - dev_last_seen[m] > RETENTION_30D)) continue;
      ip = (m in mac_to_ip) ? mac_to_ip[m] : "";
      name = (m in known_name) ? known_name[m] : ((m in mac_to_name) ? mac_to_name[m] : "Device");
      printf "%s %s %.0f %.0f %s\n", m, ip, saved_rx[m], saved_tx[m], name >> tmp_tsv;
    }
    close(tmp_tsv);
    system("mv /tmp/traffic_totals.tmp /tmp/traffic_totals.tsv");

    # Flush to persistent storage every 6 iterations (~60s)
    if (tick % 6 == 0) {
      # 1. Lifetime traffic persistent update
      tmp_lt = "/tmp/traffic_lifetime.tmp";
      lt_tot = lifetime_rx + lifetime_tx;
      printf "{\n" > tmp_lt;
      printf "  \"lifetime_rx_bytes\": %.0f,\n", lifetime_rx >> tmp_lt;
      printf "  \"lifetime_tx_bytes\": %.0f,\n", lifetime_tx >> tmp_lt;
      printf "  \"lifetime_total_bytes\": %.0f,\n", lt_tot >> tmp_lt;
      printf "  \"lifetime_rx_gb\": \"%.2f\",\n", (lifetime_rx / 1073741824) >> tmp_lt;
      printf "  \"lifetime_tx_gb\": \"%.2f\",\n", (lifetime_tx / 1073741824) >> tmp_lt;
      printf "  \"lifetime_total_gb\": \"%.2f\",\n", (lt_tot / 1073741824) >> tmp_lt;
      printf "  \"retention_days\": 15,\n" >> tmp_lt;
      printf "  \"last_updated\": %.0f\n", now >> tmp_lt;
      printf "}\n" >> tmp_lt;
      close(tmp_lt);
      system("mv /tmp/traffic_lifetime.tmp /etc/traffic_lifetime.json");

      # 2. 15-Day device history persistent update
      tmp_hist = "/tmp/device_history_30d.tmp";
      printf "{\n  \"retention_days\": 15,\n  \"updated_at\": %.0f,\n  \"devices\": {\n", now > tmp_hist;
      hfirst = 1;
      for (m in dev_last_seen) {
        if (m == "WAN" || m == "" || length(m) < 10) continue;
        if (now - dev_last_seen[m] > RETENTION_30D) continue;

        ip = (m in mac_to_ip) ? mac_to_ip[m] : "";
        name = (m in known_name) ? known_name[m] : ((m in mac_to_name) ? mac_to_name[m] : "Device");
        port = (m in known_port) ? known_port[m] : "LAN 3";
        rx_15 = (m in saved_rx) ? saved_rx[m] : 0;
        tx_15 = (m in saved_tx) ? saved_tx[m] : 0;
        tot_15 = rx_15 + tx_15;

        if (!hfirst) printf ",\n" >> tmp_hist;
        hfirst = 0;
        printf "    \"%s\": {\"mac\": \"%s\", \"ip\": \"%s\", \"name\": \"%s\", \"port\": \"%s\", \"first_seen\": %.0f, \"last_seen\": %.0f, \"rx_bytes\": %.0f, \"tx_bytes\": %.0f, \"total_bytes\": %.0f, \"rx_mb\": \"%.2f\", \"tx_mb\": \"%.2f\", \"total_mb\": \"%.2f\"}",
          m, m, ip, name, port, dev_first_seen[m], dev_last_seen[m], rx_15, tx_15, tot_15, (rx_15/1048576), (tx_15/1048576), (tot_15/1048576) >> tmp_hist;
      }
      printf "\n  }\n}\n" >> tmp_hist;
      close(tmp_hist);
      system("mv /tmp/device_history_30d.tmp /etc/device_history_30d.json");

      system("cp -f /tmp/traffic_totals.tsv /etc/traffic_totals.tsv && cp -f /tmp/traffic_stats.json /etc/traffic_stats.json && sync");
    }

    system("sleep 10");
  }
}
END {
  system("cp -f /tmp/traffic_totals.tsv /etc/traffic_totals.tsv && cp -f /tmp/traffic_stats.json /etc/traffic_stats.json && sync");
}
'
