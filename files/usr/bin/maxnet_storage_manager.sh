#!/bin/sh
# ==============================================================================
# MAXNET ENTERPRISE MULTI-DRIVE AUTO-MOUNT & DYNAMIC SAMBA EXPORTER
# Automatically mounts ANY number of Pendrives, Hard Drives & SSDs
# Generates Dynamic Samba Shares for \\10.0.0.203\<Share> and \\smb.lan\<Share>
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

    # Add each mounted drive share using its exact volume label / mount folder
    for m in "$STORAGE_BASE"/*; do
        [ -d "$m" ] || continue
        sname=$(basename "$m")
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

    mv "$SMB_CONF.tmp" "$SMB_CONF"

    # Reload or restart Samba without dropping active sessions
    if pgrep smbd >/dev/null; then
        killall -HUP smbd 2>/dev/null
    else
        /etc/init.d/samba start 2>/dev/null || smbd -D
    fi
}

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
    DISKS_JSON="$DISKS_JSON]"

    # If connected disks set changed, rebuild Samba configuration
    PREV_DISKS=""
    [ -f "$PREV_DISKS_FILE" ] && PREV_DISKS=$(cat "$PREV_DISKS_FILE" 2>/dev/null)
    CURR_DISKS=$(echo "$CURR_DISKS" | xargs)

    if [ "$CURR_DISKS" != "$PREV_DISKS" ]; then
        echo "$CURR_DISKS" > "$PREV_DISKS_FILE"
        update_samba_shares
    fi

    # Write atomic storage status JSON in RAM
    cat << JSON > "$STATUS_FILE.tmp"
{
  "updated_at": $(date +%s),
  "total_drives": $(echo "$CURR_DISKS" | wc -w),
  "drives": $DISKS_JSON
}
JSON
    mv "$STATUS_FILE.tmp" "$STATUS_FILE"

    sleep 5
done
