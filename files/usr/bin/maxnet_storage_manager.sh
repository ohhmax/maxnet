#!/bin/sh
# ==============================================================================
# MAXNET ENTERPRISE MULTI-DRIVE AUTO-MOUNT & DYNAMIC SAMBA EXPORTER
# Automatically mounts ANY number of Pendrives, Hard Drives & SSDs
# Generates Dynamic Samba Shares for \\10.0.0.1\<Share> and \\smb.lan\<Share>
# Supports on-demand fallback local storage when enabled without external drive
# ==============================================================================

STORAGE_BASE="/mnt/storage"
LEGACY_BASE="/mnt/pendrive"
SMB_CONF="/etc/samba/smb.conf"
SMB_TEMPLATE="/etc/samba/smb.conf.template"
STATUS_FILE="/tmp/storage_status.json"
PREV_DISKS_FILE="/tmp/storage_prev_disks.tmp"

mkdir -p "$STORAGE_BASE" "$LEGACY_BASE"

# Ensure FUSE kernel module is loaded for high-speed NTFS
lsmod | grep -q fuse || insmod /lib/modules/6.18.60/fuse.ko 2>/dev/null || modprobe fuse 2>/dev/null

update_samba_shares() {
    # Generate base smb.conf
    cat << 'EOF' > "$SMB_CONF.tmp"
[global]
	netbios name = MAXNET-GATEWAY
	server string = MAXNET High-Speed Multi-Drive Storage
	workgroup = WORKGROUP
	security = user
	passdb backend = smbpasswd
	null passwords = yes
	guest account = root
	force user = root
	force group = root
	smb encrypt = disabled
	map to guest = Bad User
	max connections = 0
	socket options = TCP_NODELAY IPTOS_LOWDELAY SO_KEEPALIVE SO_RCVBUF=131072 SO_SNDBUF=131072
	aio read size = 16384
	aio write size = 16384
	use sendfile = yes
	min receivefile size = 16384
	deadtime = 15
	local master = yes
	os level = 65
	preferred master = yes
EOF

    has_shares=0
    # Add each mounted drive share using its exact volume label / mount folder
    for m in "$STORAGE_BASE"/*; do
        [ -d "$m" ] || continue
        sname=$(basename "$m")
        has_shares=1
        cat << EOF >> "$SMB_CONF.tmp"

[$sname]
	comment = Fast USB Storage ($sname)
	path = $m
	browseable = yes
	read only = no
	guest ok = yes
	create mask = 0777
	directory mask = 0777
EOF
    done

    # If no external drives mounted, provide fallback [Pendrive] share for local storage
    if [ "$has_shares" -eq 0 ]; then
        mkdir -p "$LEGACY_BASE"
        if [ -z "$(ls -A "$LEGACY_BASE" 2>/dev/null)" ]; then
            cat << 'INFO' > "$LEGACY_BASE/README_STORAGE.txt"
MAXNET ENTERPRISE ROUTER - USB STORAGE & SMB
============================================
Status: Local fallback storage active (No external USB drive mounted).

To use high-speed external storage:
1. Plug any USB 3.0 Pendrive, Hard Disk, or SSD into the router USB port.
2. The router will automatically mount it here.
INFO
        fi
        cat << EOF >> "$SMB_CONF.tmp"

[Pendrive]
	comment = Fast USB Storage (Pendrive)
	path = $LEGACY_BASE
	browseable = yes
	read only = no
	guest ok = yes
	create mask = 0777
	directory mask = 0777
EOF
    fi

    mv "$SMB_CONF.tmp" "$SMB_CONF"

    samba_user_enabled=0
    if /etc/init.d/samba4 enabled 2>/dev/null; then
        samba_user_enabled=1
    fi

    # Reload or restart Samba without dropping active sessions
    if [ -n "$CURR_DISKS" ] || [ "$samba_user_enabled" -eq 1 ]; then
        if pgrep smbd >/dev/null; then
            killall -HUP smbd 2>/dev/null
        else
            /etc/init.d/samba4 start 2>/dev/null || smbd -D
        fi
    else
        # No disks mounted and user has not enabled samba: stop smbd to conserve ~20MB RAM
        if pgrep smbd >/dev/null; then
            /etc/init.d/samba4 stop 2>/dev/null || killall smbd 2>/dev/null
        fi
    fi
}

if [ "$1" = "--update" ] || [ "$1" = "-u" ]; then
    CURR_DISKS=""
    for disk in /dev/sd[a-z]; do
        [ -b "$disk" ] || continue
        parts=$(ls ${disk}[0-9]* 2>/dev/null)
        if [ -n "$parts" ]; then
            CURR_DISKS="$CURR_DISKS $parts"
        else
            CURR_DISKS="$CURR_DISKS $disk"
        fi
    done
    CURR_DISKS=$(echo "$CURR_DISKS" | xargs)
    update_samba_shares
    exit 0
fi

while true; do
    CURR_DISKS=""
    DISKS_JSON="["
    first=1
    primary_mounted=0

    # Discover all storage block devices (partitions or whole disks if unpartitioned)
    DEV_LIST=""
    for disk in /dev/sd[a-z]; do
        [ -b "$disk" ] || continue
        parts=$(ls ${disk}[0-9]* 2>/dev/null)
        if [ -n "$parts" ]; then
            DEV_LIST="$DEV_LIST $parts"
        else
            DEV_LIST="$DEV_LIST $disk"
        fi
    done

    # Self-healing USB VBUS recovery: if pendrive is stuck in descriptor timeout
    if [ -z "$DEV_LIST" ] && dmesg | tail -n 25 | grep -qs "unable to enumerate USB device"; then
        [ -d /sys/class/gpio/gpio576 ] || echo 576 > /sys/class/gpio/export 2>/dev/null
        echo out > /sys/class/gpio/gpio576/direction 2>/dev/null
        echo 0 > /sys/class/gpio/gpio576/value 2>/dev/null
        sleep 2
        echo 1 > /sys/class/gpio/gpio576/value 2>/dev/null
        sleep 3
    fi

    for part in $DEV_LIST; do
        [ -b "$part" ] || continue
        pname=$(basename "$part")
        CURR_DISKS="$CURR_DISKS $pname"

        label="Drive-$pname"
        [ "$pname" = "sda" ] || [ "$pname" = "sda1" ] && label="Pendrive"

        mount_target="$STORAGE_BASE/$label"
        mkdir -p "$mount_target"

        # Check if already mounted
        if ! grep -qs "$mount_target" /proc/mounts; then
            mount -t ext4 -o rw,noatime "$part" "$mount_target" 2>/dev/null || \
            ntfs-3g -o rw,big_writes,noatime,async "$part" "$mount_target" 2>/dev/null || \
            mount -t vfat -o rw,noatime,utf8=1 "$part" "$mount_target" 2>/dev/null || \
            mount -t exfat -o rw,noatime "$part" "$mount_target" 2>/dev/null || \
            mount "$part" "$mount_target" 2>/dev/null
        fi
        chmod 777 "$mount_target" 2>/dev/null

        # Maintain legacy /mnt/pendrive symlink / bind for the primary drive
        if [ "$primary_mounted" -eq 0 ] && grep -qs "$mount_target" /proc/mounts; then
            if ! grep -qs "$LEGACY_BASE" /proc/mounts; then
                mount --bind "$mount_target" "$LEGACY_BASE" 2>/dev/null
            fi
            primary_mounted=1
        fi

        # Drive statistics
        df_out=$(df -h "$mount_target" 2>/dev/null | tail -n 1)
        tot_sp=$(echo "$df_out" | awk '{print $2}')
        used_sp=$(echo "$df_out" | awk '{print $3}')
        free_sp=$(echo "$df_out" | awk '{print $4}')
        used_pct=$(echo "$df_out" | awk '{print $5}' | tr -d '%')
        [ -z "$tot_sp" ] && tot_sp="--"
        [ -z "$free_sp" ] && free_sp="--"

        LAN_IP=$(ip -4 a show dev br-lan 2>/dev/null | awk '/inet / {print $2}' | awk -F/ '{print $1}' | head -n 1)
        [ -z "$LAN_IP" ] && LAN_IP="10.0.0.1"
        share_unc="\\\\${LAN_IP}\\$label"
        safe_unc=$(echo "$share_unc" | sed 's/\\/\\\\/g')
        item="{\"partition\":\"$pname\",\"label\":\"$label\",\"mount\":\"$mount_target\",\"fs\":\"${fstype:-unknown}\",\"total_space\":\"$tot_sp\",\"free_space\":\"$free_sp\",\"used_pct\":\"${used_pct:-0}\",\"share_name\":\"$label\",\"share_path\":\"$safe_unc\"}"

        [ "$first" -eq 0 ] && DISKS_JSON="$DISKS_JSON,"
        DISKS_JSON="$DISKS_JSON$item"
        first=0
    done

    CURR_DISKS=$(echo "$CURR_DISKS" | xargs)

    if [ -z "$CURR_DISKS" ]; then
        df_out=$(df -h "$LEGACY_BASE" 2>/dev/null | tail -n 1)
        [ -z "$df_out" ] && df_out=$(df -h / 2>/dev/null | tail -n 1)
        tot_sp=$(echo "$df_out" | awk '{print $2}')
        used_sp=$(echo "$df_out" | awk '{print $3}')
        free_sp=$(echo "$df_out" | awk '{print $4}')
        used_pct=$(echo "$df_out" | awk '{print $5}' | tr -d '%')
        [ -z "$tot_sp" ] && tot_sp="--"
        [ -z "$free_sp" ] && free_sp="--"
        LAN_IP=$(ip -4 a show dev br-lan 2>/dev/null | awk '/inet / {print $2}' | awk -F/ '{print $1}' | head -n 1)
        [ -z "$LAN_IP" ] && LAN_IP="10.0.0.1"
        share_unc="\\\\${LAN_IP}\\Pendrive"
        safe_unc=$(echo "$share_unc" | sed 's/\\/\\\\/g')
        DISKS_JSON="[{\"partition\":\"local\",\"label\":\"Pendrive\",\"mount\":\"$LEGACY_BASE\",\"fs\":\"local\",\"total_space\":\"$tot_sp\",\"free_space\":\"$free_sp\",\"used_pct\":\"${used_pct:-0}\",\"share_name\":\"Pendrive\",\"share_path\":\"$safe_unc\"}]"
    else
        DISKS_JSON="$DISKS_JSON]"
    fi

    # Check if disk state or samba user-enabled state changed
    PREV_STATE_KEY=""
    [ -f "$PREV_DISKS_FILE" ] && PREV_STATE_KEY=$(cat "$PREV_DISKS_FILE" 2>/dev/null)
    samba_user_enabled=$(/etc/init.d/samba4 enabled 2>/dev/null && echo 1 || echo 0)
    STATE_KEY="${CURR_DISKS}__${samba_user_enabled}"

    if [ "$STATE_KEY" != "$PREV_STATE_KEY" ]; then
        echo "$STATE_KEY" > "$PREV_DISKS_FILE"
        PREV_STATE_KEY="$STATE_KEY"
        update_samba_shares
        if jq -e '.enabled == true' /etc/dufs.json >/dev/null 2>&1; then
            /etc/init.d/dufs restart >/dev/null 2>&1 || true
        fi
    fi

    # Write atomic storage status JSON in RAM
    cat << JSON > "$STATUS_FILE.tmp"
{
  "updated_at": $(date +%s),
  "total_drives": $([ -n "$CURR_DISKS" ] && echo "$CURR_DISKS" | wc -w || echo 0),
  "drives": $DISKS_JSON
}
JSON
    mv "$STATUS_FILE.tmp" "$STATUS_FILE"

    sleep 5
done
