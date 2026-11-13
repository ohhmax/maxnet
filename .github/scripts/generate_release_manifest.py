#!/usr/bin/env python3
"""Generates unified manifest.json and standard sysupgrade filenames for all Jio router models.
Enables instant, model-specific OTA firmware updates from the router WebUI.
"""
import os
import sys
import json
import hashlib
import shutil

DEVICE_REGISTRY = {
    # Qualcomm Family (qualcommbe/ipq95xx)
    "jiorouter,ax6000-jidu6j11-6811": {
        "model": "JioRouter AX6000 JIDU6J11-6811",
        "aliases": ["jio,jidu6811", "JIDU6811", "jidu6811"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6811-sysupgrade.bin",
        "pattern": "jidu6j11-6811.*sysupgrade"
    },
    "jiorouter,ax6000-jidu6j11-6911": {
        "model": "JioRouter AX6000 JIDU6J11-6911",
        "aliases": ["jio,jidu6911", "JIDU6911", "jidu6911"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6911-sysupgrade.bin",
        "pattern": "jidu6j11-6911.*sysupgrade"
    },
    "jiorouter,ax6000-jidu6j11-6611": {
        "model": "JioRouter AX6000 JIDU6J11-6611",
        "aliases": ["jio,jidu6611", "JIDU6611", "jidu6611"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6611-sysupgrade.bin",
        "pattern": "jidu6j11-6611.*sysupgrade"
    },
    "jiorouter,ax6000-jidu6j11-6411": {
        "model": "JioRouter AX6000 JIDU6J11-6411",
        "aliases": ["jio,jidu6411", "JIDU6411", "jidu6411"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6411-sysupgrade.bin",
        "pattern": "jidu6j11-6411.*sysupgrade"
    },
    "jiorouter,ax6000-jidu6j11-6111": {
        "model": "JioRouter AX6000 JIDU6J11-6111",
        "aliases": ["jio,jidu6111", "JIDU6111", "jidu6111"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6111-sysupgrade.bin",
        "pattern": "jidu6j11-6111.*sysupgrade"
    },
    "jio,jidu6811": {
        "model": "Jio JIDU6811",
        "aliases": ["jio_jidu6811"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6811-sysupgrade.bin",
        "pattern": "jidu6811.*sysupgrade"
    },
    # MediaTek Family (mediatek/filogic)
    "jiorouter,ax6000-jidu6j01": {
        "model": "JioRouter AX6000 JIDU6J01",
        "aliases": ["JIDU6J01", "jidu6j01"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6j01-sysupgrade.bin",
        "pattern": "jidu6j01.*sysupgrade"
    },
    "jiorouter,ax6000-jidu6801": {
        "model": "JioRouter AX6000 JIDU6801",
        "aliases": ["jio,jidu6801", "JIDU6801", "jidu6801"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6801-sysupgrade.bin",
        "pattern": "jidu6801.*sysupgrade"
    },
    "jiorouter,ax6000-jidu6401": {
        "model": "JioRouter AX6000 JIDU6401",
        "aliases": ["jio,jidu6401", "JIDU6401", "jidu6401"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6401-sysupgrade.bin",
        "pattern": "jidu6401.*sysupgrade"
    },
    "jiorouter,ax6000-jidu6101": {
        "model": "JioRouter AX6000 JIDU6101",
        "aliases": ["jio,jidu6101", "JIDU6101", "jidu6101"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6101-sysupgrade.bin",
        "pattern": "jidu6101.*sysupgrade"
    }
}

def calc_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def main():
    if len(sys.argv) < 3:
        print("Usage: generate_release_manifest.py <bin_dirs_comma_separated> <out_dir> [tag_name]")
        sys.exit(1)

    bin_dirs = [d.strip() for d in sys.argv[1].split(',') if os.path.isdir(d.strip())]
    out_dir = sys.argv[2]
    tag_name = sys.argv[3] if len(sys.argv) > 3 else "latest"
    os.makedirs(out_dir, exist_ok=True)

    repo_url = os.environ.get("GITHUB_REPOSITORY", "ohhmax/maxnet")
    base_download_url = f"https://github.com/{repo_url}/releases/download/{tag_name}"

    manifest_devices = {}
    sums_lines = []

    # Map discovered files to registered devices
    for bin_dir in bin_dirs:
        for fname in os.listdir(bin_dir):
            fpath = os.path.join(bin_dir, fname)
            if not os.path.isfile(fpath):
                continue

            for board_key, dev in DEVICE_REGISTRY.items():
                import re
                if re.search(dev["pattern"], fname, re.IGNORECASE):
                    target_filename = dev["canonical_name"]
                    target_path = os.path.join(out_dir, target_filename)
                    shutil.copy2(fpath, target_path)

                    c_sum = calc_sha256(target_path)
                    f_size = os.path.getsize(target_path)

                    sums_lines.append(f"{c_sum}  {target_filename}")

                    dev_entry = {
                        "model": dev["model"],
                        "target": dev["target"],
                        "soc": dev["soc"],
                        "filename": target_filename,
                        "download_url": f"{base_download_url}/{target_filename}",
                        "sha256": c_sum,
                        "size": f_size
                    }

                    manifest_devices[board_key] = dev_entry
                    for alias in dev.get("aliases", []):
                        manifest_devices[alias] = dev_entry

    # In case JIDU6801 or JIDU6401 share binary with JIDU6J01, create fallback copies
    if "jiorouter,ax6000-jidu6j01" in manifest_devices:
        j01_info = manifest_devices["jiorouter,ax6000-jidu6j01"]
        for alias_key, alias_fname in [
            ("jiorouter,ax6000-jidu6801", "maxnet-jidu6801-sysupgrade.bin"),
            ("jiorouter,ax6000-jidu6401", "maxnet-jidu6401-sysupgrade.bin")
        ]:
            if alias_key not in manifest_devices:
                alias_path = os.path.join(out_dir, alias_fname)
                src_path = os.path.join(out_dir, j01_info["filename"])
                if os.path.exists(src_path):
                    shutil.copy2(src_path, alias_path)
                    c_sum = calc_sha256(alias_path)
                    f_size = os.path.getsize(alias_path)
                    sums_lines.append(f"{c_sum}  {alias_fname}")
                    manifest_devices[alias_key] = {
                        "model": DEVICE_REGISTRY[alias_key]["model"],
                        "target": "mediatek/filogic",
                        "soc": "MediaTek MT7986A",
                        "filename": alias_fname,
                        "download_url": f"{base_download_url}/{alias_fname}",
                        "sha256": c_sum,
                        "size": f_size
                    }

    manifest = {
        "version": tag_name,
        "tag": tag_name,
        "devices": manifest_devices
    }

    manifest_path = os.path.join(out_dir, "manifest.json")
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    sums_path = os.path.join(out_dir, "sha256sums")
    with open(sums_path, 'w') as f:
        f.write('\n'.join(sums_lines) + '\n')

    print(f"Manifest written to {manifest_path} with {len(manifest_devices)} registered device models.")

if __name__ == "__main__":
    main()
