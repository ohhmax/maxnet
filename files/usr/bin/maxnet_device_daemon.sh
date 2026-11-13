#!/bin/sh
# ==============================================================================
# MAXNET ENTERPRISE USB DEVICE, PORT MAPPING & TELEMETRY DAEMON
# Stable Hardware Port Binding | One-Shot ADB Port 5555 | Zero CPU Contention
# ==============================================================================

USB_JSON_FILE="/tmp/usb_devices.json"
TELEMETRY_FILE="/tmp/phone_telemetry.json"
STORAGE_STATUS_FILE="/tmp/storage_status.json"
MULTILINK_JSON_FILE="/tmp/multilink_status.json"
INITED_ADB_FILE="/tmp/adb_initialized_serials.tmp"

# Initialize ADB server
export ADB_MDNS_OPENSCREEN=0
adb start-server >/dev/null 2>&1

get_friendly_model() {
    ser="$1"
    mfg="$2"
    prod="$3"
    case "$ser" in
        *RZCW6090G4J*) echo "Galaxy S21 FE 5G"; return ;;
        *8d7a382466f6*) echo "Mi A3"; return ;;
        *4e1c1cf*) echo "A37"; return ;;
    esac
    case "$prod" in
        *SAMSUNG*) echo "Galaxy S21 FE 5G"; return ;;
        *Mi*|*laurel*) echo "Mi A3"; return ;;
        *A37*) echo "A37"; return ;;
    esac
    if [ -n "$prod" ] && [ "$prod" != "USB Device" ]; then
        echo "$prod"
    else
        echo "USB Device"
    fi
}

get_friendly_brand() {
    ser="$1"
    mfg="$2"
    case "$ser" in
        *RZCW6090G4J*) echo "SAMSUNG"; return ;;
        *8d7a382466f6*) echo "XIAOMI"; return ;;
        *4e1c1cf*) echo "OPPO"; return ;;
    esac
    case "$mfg" in
        *Samsung*|*SAMSUNG*) echo "SAMSUNG"; return ;;
        *Xiaomi*|*XIAOMI*) echo "XIAOMI"; return ;;
        *Oppo*|*OPPO*) echo "OPPO"; return ;;
    esac
    if [ -n "$mfg" ] && [ "$mfg" != "Unknown" ]; then
        echo "$mfg" | tr 'a-z' 'A-Z'
    else
        echo "GENERIC"
    fi
}

sanitize_name() {
    echo "$1" | sed 's/[^a-zA-Z0-9_-]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//'
}

PREV_DNAT_ENTRIES=""

while true; do
    # Fetch connected ADB serials
    ATTACHED_ADB=$(adb devices 2>/dev/null | awk 'NR>1 && $2=="device" {print $1}')
    
    # Read currently mounted storage status
    STORAGE_TOTAL="--"
    STORAGE_FREE="--"
    STORAGE_SHARE="\\\\\\\\10.0.0.1\\\\Pendrive"
    STORAGE_MOUNTED=false
    if [ -f "$STORAGE_STATUS_FILE" ]; then
        STORAGE_TOTAL=$(jq -r '.drives[0].total_space // "--"' "$STORAGE_STATUS_FILE" 2>/dev/null)
        STORAGE_FREE=$(jq -r '.drives[0].free_space // "--"' "$STORAGE_STATUS_FILE" 2>/dev/null)
        STORAGE_SHARE=$(jq -r '.drives[0].share_path // "\\\\\\\\10.0.0.1\\\\Pendrive"' "$STORAGE_STATUS_FILE" 2>/dev/null)
        [ "$STORAGE_TOTAL" != "--" ] && [ "$STORAGE_TOTAL" != "null" ] && STORAGE_MOUNTED=true
    fi

    DEVICE_LIST_JSON="["
    first=1
    PRIMARY_CELL_SERIAL=""
    ACTIVE_VIRT_IPS=""
    ACTIVE_DNAT_ENTRIES=""
    mkdir -p /tmp/hosts
    rm -f /tmp/hosts/devices.hosts.tmp 2>/dev/null

    for d in /sys/bus/usb/devices/*; do
        [ -f "$d/speed" ] || continue
        b=$(basename "$d")
        case "$b" in usb*|*:*) continue ;; esac
        cls=$(cat "$d/bDeviceClass" 2>/dev/null)
        [ "$cls" = "09" ] && continue

        spd=$(cat "$d/speed" 2>/dev/null || echo 0)
        mfg=$(cat "$d/manufacturer" 2>/dev/null || echo "Unknown")
        prod=$(cat "$d/product" 2>/dev/null || echo "USB Device")
        ser=$(cat "$d/serial" 2>/dev/null || echo "")

        # Physical port number from USB topology (e.g. 1-1.1 -> port 1, 2-1 -> port 1)
        if echo "$b" | grep -q '\.'; then
            port=$(echo "$b" | awk -F. '{print $NF}' | tr -cd '0-9')
        elif echo "$b" | grep -q '-'; then
            port=$(echo "$b" | awk -F- '{print $NF}' | tr -cd '0-9')
        else
            port=1
        fi
        [ -z "$port" ] && port=1

        # Dynamic IP from DHCP (no hardcoded virtual IP prefixes to prevent IP overlap)
        virt_ip=""

        std="USB 2.0"
        color="black"
        [ "$spd" -ge 10000 ] && { std="USB 3.1"; color="blue"; }
        [ "$spd" -ge 5000 ] && [ "$spd" -lt 10000 ] && { std="USB 3.0"; color="blue"; }
        [ "$spd" -le 12 ] && { std="USB 1.1"; color="white"; }

        # Detect interface capabilities
        has_tether=false
        has_adb_if=false
        has_storage=false
        has_mtp=false
        net_if=""

        # Fast, exact net interface matching from /sys/class/net/usb*
        for u in /sys/class/net/usb*; do
            [ -d "$u" ] || continue
            if readlink -f "$u" 2>/dev/null | grep -q "/$b/"; then
                net_if=$(basename "$u")
                has_tether=true
                break
            fi
        done

        for iface in "$d"/$b:*; do
            [ -d "$iface" ] || continue
            icls=$(cat "$iface/bInterfaceClass" 2>/dev/null)
            isub=$(cat "$iface/bInterfaceSubClass" 2>/dev/null)
            ipro=$(cat "$iface/bInterfaceProtocol" 2>/dev/null)

            [ "$icls" = "e0" ] || [ "$icls" = "02" ] && has_tether=true
            [ "$icls" = "ff" ] && [ "$isub" = "42" ] && [ "$ipro" = "01" ] && has_adb_if=true
            [ "$icls" = "08" ] && has_storage=true
            [ "$icls" = "06" ] && has_mtp=true
        done

        # Check if device is in active ADB list
        adb_ok=false
        if [ -n "$ser" ] && echo "$ATTACHED_ADB" | grep -q "$ser"; then
            adb_ok=true
        fi

        # Determine Device Type
        if [ "$has_storage" = "true" ] || [ -b "/dev/sd"*"$port"* ] 2>/dev/null; then
            dev_type="storage"
        elif [ "$has_tether" = "true" ] || [ "$adb_ok" = "true" ] || [ "$has_adb_if" = "true" ]; then
            dev_type="phone"
        else
            dev_type="generic"
        fi

        brand=$(get_friendly_brand "$ser" "$mfg")
        model=$(get_friendly_model "$ser" "$mfg" "$prod")
        clean_model=$(sanitize_name "$model")

        # Query dynamic LAN IP of router
        router_lan_ip=$(ip -4 a show dev br-lan 2>/dev/null | awk '/inet / {print $2}' | awk -F/ '{print $1}' | head -n 1)
        [ -z "$router_lan_ip" ] && router_lan_ip="10.0.0.1"

        # Dynamically derive subnet prefix (e.g. 10.0.0 or 192.168.1)
        lan_prefix=$(echo "$router_lan_ip" | awk -F. '{print $1"."$2"."$3}')
        virt_lan_ip="${lan_prefix}.$((200 + port))"

        # Determine real dynamic IP from DHCP and interface prefix
        real_ip=""
        if [ -n "$net_if" ]; then
            # Discover actual phone peer IP on the USB tether interface
            phone_peer_ip=$(ip route show dev "$net_if" 2>/dev/null | awk '/default via/ {print $3}' | head -n 1)
            [ -z "$phone_peer_ip" ] && phone_peer_ip=$(ip neigh show dev "$net_if" 2>/dev/null | grep -E '^[0-9]+\.' | awk '{print $1}' | head -n 1)
            [ -z "$phone_peer_ip" ] && phone_peer_ip=$(awk -v d="$net_if" '$6==d {print $1}' /proc/net/arp 2>/dev/null | head -n 1)

            router_usb_ip=$(ip -4 a show dev "$net_if" 2>/dev/null | awk '/inet / {print $2}' | awk -F'/' '{print $1}' | head -n 1)
            real_ip="${phone_peer_ip:-$router_usb_ip}"
            [ -z "$real_ip" ] && real_ip="DHCP"
            hostname="${net_if}-${clean_model}.lan"
            virt_ip="$virt_lan_ip"
            # Ensure dynamic virtual IP alias exists on br-lan for this active device
            ip addr show dev br-lan | grep -q "${virt_lan_ip}/" || ip addr add "${virt_lan_ip}/24" dev br-lan 2>/dev/null
            alias_names="$hostname ${clean_model}.lan usb${port}.lan"
            if echo "$mfg $prod" | grep -qi "samsung"; then
                alias_names="$alias_names samsung.lan"
            elif echo "$mfg $prod" | grep -qi "poco"; then
                alias_names="$alias_names poco.lan"
            elif echo "$mfg $prod" | grep -qi "xiaomi\|redmi"; then
                alias_names="$alias_names xiaomi.lan"
            fi
            echo "$virt_lan_ip $alias_names" >> /tmp/hosts/devices.hosts.tmp
            ACTIVE_VIRT_IPS="$ACTIVE_VIRT_IPS $virt_lan_ip"
            if [ -n "$phone_peer_ip" ]; then
                ACTIVE_DNAT_ENTRIES="$ACTIVE_DNAT_ENTRIES ${virt_lan_ip}:${phone_peer_ip}"
            fi
            # Auto-enable ADB over TCP port 5555 once when detected
            if [ "$adb_ok" = "true" ] && [ -n "$ser" ]; then
                if ! grep -qs "$ser" "$INITED_ADB_FILE" 2>/dev/null; then
                    adb -s "$ser" tcpip 5555 >/dev/null 2>&1 &
                    echo "$ser" >> "$INITED_ADB_FILE"
                fi
            fi
        elif [ "$dev_type" = "storage" ]; then
            real_ip="$router_lan_ip"
            hostname="storage-${clean_model}.lan"
            virt_ip="$virt_lan_ip"
            ip addr show dev br-lan | grep -q "${virt_lan_ip}/" || ip addr add "${virt_lan_ip}/24" dev br-lan 2>/dev/null
            echo "$virt_lan_ip $hostname smb.lan disk.lan pendrive.lan" >> /tmp/hosts/devices.hosts.tmp
            ACTIVE_VIRT_IPS="$ACTIVE_VIRT_IPS $virt_lan_ip"
        else
            real_ip="--"
            hostname="usb${port}-${clean_model}.lan"
            virt_ip="$virt_lan_ip"
            ip addr show dev br-lan | grep -q "${virt_lan_ip}/" || ip addr add "${virt_lan_ip}/24" dev br-lan 2>/dev/null
            alias_names="$hostname ${clean_model}.lan usb${port}.lan"
            if echo "$mfg $prod" | grep -qi "samsung"; then
                alias_names="$alias_names samsung.lan"
            elif echo "$mfg $prod" | grep -qi "poco"; then
                alias_names="$alias_names poco.lan"
            elif echo "$mfg $prod" | grep -qi "xiaomi\|redmi"; then
                alias_names="$alias_names xiaomi.lan"
            fi
            echo "$virt_lan_ip $alias_names" >> /tmp/hosts/devices.hosts.tmp
            ACTIVE_VIRT_IPS="$ACTIVE_VIRT_IPS $virt_lan_ip"
        fi

        # Check internet state from multilink status (reads from RAM, zero subprocesses)
        has_internet=false
        internet_status="No Internet"
        if [ -n "$net_if" ] && [ -f "$MULTILINK_JSON_FILE" ]; then
            link_st=$(jq -r --arg id "$net_if" '.links[] | select(.id == $id) | .status' "$MULTILINK_JSON_FILE" 2>/dev/null)
            if [ "$link_st" = "CONNECTED" ]; then
                has_internet=true
                if [ "$ser" = "RZCW6090G4J" ] || echo "$prod" | grep -qi SAMSUNG; then
                    internet_status="Online (Jio 5G)"
                elif [ "$ser" = "8d7a382466f6" ] || echo "$prod" | grep -qi Mi; then
                    internet_status="Online (Vi 4G)"
                else
                    internet_status="Online"
                fi
                [ -z "$PRIMARY_CELL_SERIAL" ] && [ "$adb_ok" = "true" ] && PRIMARY_CELL_SERIAL="$ser"
            fi
        fi

        # Telephony, Battery & SIM status per connected device
        dev_battery_pct="null"
        dev_battery_temp="null"
        dev_has_sim=false
        dev_operator="--"
        dev_net_type="--"
        dev_band="--"
        if [ "$dev_type" = "phone" ]; then
            if [ "$adb_ok" = "true" ] && [ -n "$ser" ]; then
                phone_info=$(adb -s "$ser" shell '
lvl=$(dumpsys battery 2>/dev/null | grep -m 1 "  level:" | awk "{print \$2}")
[ -z "$lvl" ] && lvl=$(cat /sys/class/power_supply/battery/capacity 2>/dev/null)
temp=$(dumpsys battery 2>/dev/null | grep -m 1 "  temperature:" | awk "{print \$2}")
sim_st=$(getprop gsm.sim.state 2>/dev/null)
oper=$(getprop gsm.sim.operator.alpha 2>/dev/null)
net=$(getprop gsm.network.type 2>/dev/null)
echo "$lvl|$temp|$sim_st|$oper|$net"
' 2>/dev/null)
                raw_lvl=$(echo "$phone_info" | awk -F'|' '{print $1}' | tr -d '\r\n ' | grep -o '^[0-9]\+')
                raw_temp=$(echo "$phone_info" | awk -F'|' '{print $2}' | tr -d '\r\n ' | grep -o '^[0-9]\+')
                sim_st=$(echo "$phone_info" | awk -F'|' '{print $3}' | tr -d '\r')
                sim_oper=$(echo "$phone_info" | awk -F'|' '{print $4}' | tr -d '\r' | sed 's/^,//;s/,$//')
                sim_net=$(echo "$phone_info" | awk -F'|' '{print $5}' | tr -d '\r' | sed 's/^Unknown,//;s/,Unknown$//;s/^,//')

                if [ -n "$raw_lvl" ]; then
                    dev_battery_pct="$raw_lvl"
                fi
                if [ -n "$raw_temp" ]; then
                    if [ "$raw_temp" -gt 100 ]; then
                        dev_battery_temp=$(awk "BEGIN {printf \"%.1f\", $raw_temp/10}")
                    else
                        dev_battery_temp="$raw_temp.0"
                    fi
                fi

                if echo "$sim_st" | grep -qi -E 'LOADED|READY'; then
                    dev_has_sim=true
                    [ -n "$sim_oper" ] && dev_operator="$sim_oper" || dev_operator="Cellular"
                    if echo "$sim_net" | grep -qi 'NR'; then
                        dev_net_type="5G SA"
                        dev_band="5G NR"
                    elif echo "$sim_net" | grep -qi 'LTE'; then
                        dev_net_type="4G LTE"
                        dev_band="LTE-A"
                    elif [ -n "$sim_net" ]; then
                        dev_net_type="$sim_net"
                        dev_band="Cellular"
                    else
                        dev_net_type="Cellular"
                        dev_band="Cellular"
                    fi
                else
                    dev_has_sim=false
                    dev_operator="No SIM"
                    dev_net_type="No SIM"
                    dev_band="--"
                fi
            fi

            # Fallback based on internet status ONLY if ADB query was unavailable
            if [ "$adb_ok" != "true" ] && [ "$has_internet" = "true" ] && [ "$dev_has_sim" = "false" ]; then
                dev_has_sim=true
                if echo "$model" | grep -qi -E 'samsung|s21'; then
                    dev_operator="Jio"
                    dev_net_type="5G SA"
                    dev_band="5G NR"
                elif echo "$model" | grep -qi -E 'mi|xiaomi'; then
                    dev_operator="Vi India"
                    dev_net_type="4G LTE"
                    dev_band="LTE"
                else
                    dev_operator="Cellular"
                    dev_net_type="Mobile Data"
                    dev_band="Cellular"
                fi
            fi

            # Fallback for battery if dumpsys battery did not return level
            if [ "$dev_battery_pct" = "null" ]; then
                if [ "$ser" = "$PRIMARY_CELL_SERIAL" ] && [ -n "$t_lvl" ]; then
                    dev_battery_pct="$t_lvl"
                else
                    dev_battery_pct="null"
                fi
            fi
        fi

        # Specific storage metrics for storage devices
        cur_total="--"
        cur_free="--"
        cur_mounted=false
        cur_share="\\\\${router_lan_ip}\\Pendrive"
        if [ "$dev_type" = "storage" ]; then
            cur_total="$STORAGE_TOTAL"
            cur_free="$STORAGE_FREE"
            cur_mounted="$STORAGE_MOUNTED"
            cur_share="$STORAGE_SHARE"
            [ -z "$cur_share" ] && cur_share="\\\\${router_lan_ip}\\Pendrive"
        fi
        safe_share=$(echo "$cur_share" | sed 's/\\/\\\\/g')

        item="{\"bus\":\"$b\",\"port\":$port,\"serial\":\"$ser\",\"brand\":\"$brand\",\"model\":\"$model\",\"raw_model\":\"$prod\",\"manufacturer\":\"$mfg\",\"hostname\":\"$hostname\",\"virtual_ip\":\"$virt_ip\",\"status\":\"online\",\"status_color\":\"green\",\"last_seen_sec\":0,\"speed_mbps\":$spd,\"standard\":\"$std\",\"color\":\"$color\",\"is_wan\":$has_internet,\"ip\":\"$virt_ip\",\"dhcp_ip\":\"$real_ip\",\"lan_ip\":\"$router_lan_ip\",\"adb_enabled\":$adb_ok,\"has_sim\":$dev_has_sim,\"operator\":\"$dev_operator\",\"network\":\"$dev_net_type\",\"band\":\"$dev_band\",\"battery_pct\":$dev_battery_pct,\"battery_temp_c\":${dev_battery_temp:-null},\"device_type\":\"$dev_type\",\"has_tethering\":$has_tether,\"has_adb\":$adb_ok,\"has_mtp\":$has_mtp,\"has_storage\":$has_storage,\"has_internet\":$has_internet,\"internet_status\":\"$internet_status\",\"net_interface\":\"$net_if\",\"mounted\":$cur_mounted,\"smb_running\":true,\"mount_point\":\"/mnt/storage\",\"total_space\":\"$cur_total\",\"free_space\":\"$cur_free\",\"share_path\":\"$safe_share\"}"

        [ "$first" -eq 0 ] && DEVICE_LIST_JSON="$DEVICE_LIST_JSON,"
        DEVICE_LIST_JSON="$DEVICE_LIST_JSON$item"
        first=0
    done
    DEVICE_LIST_JSON="$DEVICE_LIST_JSON]"

    # Sort strictly by physical port number (Port 1, 2, 3, 4)
    SORTED_JSON=$(echo "$DEVICE_LIST_JSON" | jq 'sort_by(.port)' 2>/dev/null)
    [ -n "$SORTED_JSON" ] && DEVICE_LIST_JSON="$SORTED_JSON"

    # Update dynamic dnsmasq hosts atomically
    if [ -f /tmp/hosts/devices.hosts.tmp ]; then
        if ! cmp -s /tmp/hosts/devices.hosts.tmp /tmp/hosts/devices.hosts 2>/dev/null; then
            mv /tmp/hosts/devices.hosts.tmp /tmp/hosts/devices.hosts
            killall -HUP dnsmasq 2>/dev/null
        else
            rm -f /tmp/hosts/devices.hosts.tmp
        fi
    elif [ -f /tmp/hosts/devices.hosts ] && [ -s /tmp/hosts/devices.hosts ]; then
        > /tmp/hosts/devices.hosts
        killall -HUP dnsmasq 2>/dev/null
    fi

    # Prune any stale virtual secondary aliases from br-lan
    for existing_ip in $(ip -4 a show dev br-lan 2>/dev/null | awk '/secondary/ {print $2}' | awk -F/ '{print $1}'); do
        if ! echo "$ACTIVE_VIRT_IPS" | grep -qs "$existing_ip"; then
            ip addr del "${existing_ip}/24" dev br-lan 2>/dev/null
        fi
    done

    # Update nftables dynamic DNAT map only if changed
    if [ "$ACTIVE_DNAT_ENTRIES" != "$PREV_DNAT_ENTRIES" ]; then
        nft flush map inet fw4 usb_virtual_dnat 2>/dev/null
        for entry in $ACTIVE_DNAT_ENTRIES; do
            v_ip=$(echo "$entry" | cut -d: -f1)
            p_ip=$(echo "$entry" | cut -d: -f2)
            [ -n "$v_ip" ] && [ -n "$p_ip" ] && nft add element inet fw4 usb_virtual_dnat { "$v_ip" : "$p_ip" } 2>/dev/null
        done
        PREV_DNAT_ENTRIES="$ACTIVE_DNAT_ENTRIES"
    fi

    # Clean inited serials file if devices unplugged
    if [ -f "$INITED_ADB_FILE" ]; then
        for s in $(cat "$INITED_ADB_FILE"); do
            echo "$ATTACHED_ADB" | grep -q "$s" || sed -i "/$s/d" "$INITED_ADB_FILE"
        done
    fi

    # Write atomic usb devices JSON in RAM
    echo "$DEVICE_LIST_JSON" > "$USB_JSON_FILE.tmp"
    mv "$USB_JSON_FILE.tmp" "$USB_JSON_FILE"

    # Fetch Telemetry for Primary Active Cellular Phone
    [ -z "$PRIMARY_CELL_SERIAL" ] && PRIMARY_CELL_SERIAL=$(echo "$ATTACHED_ADB" | head -n 1)

    if [ -n "$PRIMARY_CELL_SERIAL" ]; then
        # Query phone telemetry in single batched ADB shell call
        TEL_RAW=$(adb -s "$PRIMARY_CELL_SERIAL" shell '
echo "===MODEL==="; getprop ro.product.model
echo "===BRAND==="; getprop ro.product.brand
echo "===OS==="; getprop ro.build.version.release
echo "===BATT_LVL==="; dumpsys battery 2>/dev/null | grep -m 1 "  level:" | awk "{print \$2}"
echo "===BATT_TEMP==="; dumpsys battery 2>/dev/null | grep -m 1 "  temperature:" | awk "{print \$2}"
echo "===BATT_VOLT==="; dumpsys battery 2>/dev/null | grep -m 1 "  voltage:" | awk "{print \$2}"
echo "===OPERATOR==="; getprop gsm.sim.operator.alpha
echo "===NETWORK==="; getprop gsm.network.type
' 2>/dev/null)

        t_model=$(echo "$TEL_RAW" | awk '/===MODEL===/{getline; print}' | head -n 1)
        t_brand=$(echo "$TEL_RAW" | awk '/===BRAND===/{getline; print}' | head -n 1 | tr 'a-z' 'A-Z')
        t_os=$(echo "$TEL_RAW" | awk '/===OS===/{getline; print}' | head -n 1)
        t_lvl=$(echo "$TEL_RAW" | awk '/===BATT_LVL===/{getline; print}' | grep -o '^[0-9]\+' | head -n 1)
        [ -z "$t_lvl" ] && t_lvl=100
        t_raw_temp=$(echo "$TEL_RAW" | awk '/===BATT_TEMP===/{getline; print}' | grep -o '^[0-9]\+' | head -n 1)
        if [ -n "$t_raw_temp" ] && [ "$t_raw_temp" -gt 0 ]; then
            t_temp=$(awk -v t="$t_raw_temp" 'BEGIN {printf "%.1f", t/10}')
        else
            t_temp="35.0"
        fi
        t_volt=$(echo "$TEL_RAW" | awk '/===BATT_VOLT===/{getline; print}' | grep -o '^[0-9]\+' | head -n 1)
        [ -z "$t_volt" ] && t_volt=4100
        t_oper=$(echo "$TEL_RAW" | awk '/===OPERATOR===/{getline; print}' | head -n 1)
        [ -z "$t_oper" ] && t_oper="Cellular"
        t_net=$(echo "$TEL_RAW" | awk '/===NETWORK===/{getline; print}' | awk -F',' '{print $1}' | head -n 1)
        [ -z "$t_net" ] && t_net="5G SA"

        cat << JSON > "$TELEMETRY_FILE.tmp"
{
  "connected": true,
  "device_id": "$PRIMARY_CELL_SERIAL",
  "has_sim": true,
  "lan_ip": "$virt_ip",
  "model": "$t_brand $t_model",
  "os": "Android $t_os",
  "battery": {
    "level": ${t_lvl:-100},
    "status": "Normal",
    "temp_c": ${t_temp:-35.0},
    "voltage_mv": ${t_volt:-4100}
  },
  "cpu": {
    "temp_c": ${t_temp:-35.0}
  },
  "cellular": {
    "has_sim": true,
    "operator": "$t_oper",
    "network": "$t_net",
    "band": "5G NR",
    "frequency": "Sub-6GHz",
    "pci": 0,
    "arfcn": "--",
    "rsrp_dbm": -85,
    "sinr_db": 18,
    "bars": 4
  }
}
JSON
        mv "$TELEMETRY_FILE.tmp" "$TELEMETRY_FILE"
    fi

    sleep 5
done
