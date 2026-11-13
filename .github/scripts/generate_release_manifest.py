#!/usr/bin/env python3
"""Generates unified manifest.json and standard sysupgrade filenames for all Jio router models.
Enables instant, model-specific OTA firmware updates from the router WebUI.
"""
import os
import sys
import json
import hashlib
import shutil
import re

DEVICE_REGISTRY = {
    # Qualcomm Family (qualcommbe/ipq95xx)
    "jiorouter,ax6000-jidu6j11-6811": {
        "model": "JioRouter AX6000 JIDU6J11-6811",
        "aliases": ["jio,jidu6811", "JIDU6811", "jidu6811"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6811-sysupgrade.bin",
        "pattern": r"(jidu6j11[-_]6811|jio[-_]jidu6811|[-_]6811).*sysupgrade"
    },
    "jiorouter,ax6000-jidu6j11-6911": {
        "model": "JioRouter AX6000 JIDU6J11-6911",
        "aliases": ["jio,jidu6911", "JIDU6911", "jidu6911"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6911-sysupgrade.bin",
        "pattern": r"(jidu6j11[-_]6911|jio[-_]jidu6911|[-_]6911).*sysupgrade"
    },
    "jiorouter,ax6000-jidu6j11-6611": {
        "model": "JioRouter AX6000 JIDU6J11-6611",
        "aliases": ["jio,jidu6611", "JIDU6611", "jidu6611"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6611-sysupgrade.bin",
        "pattern": r"(jidu6j11[-_]6611|jio[-_]jidu6611|[-_]6611).*sysupgrade"
    },
    "jiorouter,ax6000-jidu6j11-6411": {
        "model": "JioRouter AX6000 JIDU6J11-6411",
        "aliases": ["jio,jidu6411", "JIDU6411", "jidu6411"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6411-sysupgrade.bin",
        "pattern": r"(jidu6j11[-_]6411|jio[-_]jidu6411|[-_]6411).*sysupgrade"
    },
    "jiorouter,ax6000-jidu6j11-6111": {
        "model": "JioRouter AX6000 JIDU6J11-6111",
        "aliases": ["jio,jidu6111", "JIDU6111", "jidu6111"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6111-sysupgrade.bin",
        "pattern": r"(jidu6j11[-_]6111|jio[-_]jidu6111|[-_]6111).*sysupgrade"
    },
    "jio,jidu6811": {
        "model": "Jio JIDU6811",
        "aliases": ["jio_jidu6811"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6811-sysupgrade.bin",
        "pattern": r"(jio[-_]jidu6811|[-_]6811).*sysupgrade"
    },
    # MediaTek Family (mediatek/filogic)
    "jiorouter,ax6000-jidu6j01": {
        "model": "JioRouter AX6000 JIDU6J01",
        "aliases": ["JIDU6J01", "jidu6j01"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6j01-sysupgrade.bin",
        "pattern": r"(jidu6j01|[-_]6j01).*sysupgrade"
    },
    "jiorouter,ax6000-jidu6801": {
        "model": "JioRouter AX6000 JIDU6801",
        "aliases": ["jio,jidu6801", "JIDU6801", "jidu6801"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6801-sysupgrade.bin",
        "pattern": r"(jidu6801|[-_]6801).*sysupgrade"
    },
    "jiorouter,ax6000-jidu6401": {
        "model": "JioRouter AX6000 JIDU6401",
        "aliases": ["jio,jidu6401", "JIDU6401", "jidu6401"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6401-sysupgrade.bin",
        "pattern": r"(jidu6401|[-_]6401).*sysupgrade"
    },
    "jiorouter,ax6000-jidu6101": {
        "model": "JioRouter AX6000 JIDU6101",
        "aliases": ["jio,jidu6101", "JIDU6101", "jidu6101"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6101-sysupgrade.bin",
        "pattern": r"(jidu6101|[-_]6101).*sysupgrade"
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

    primary_qcom_bin = None
    primary_mtk_bin = None

    # Map discovered files to registered devices
    for bin_dir in bin_dirs:
        for root, _, files in os.walk(bin_dir):
            for fname in files:
                fpath = os.path.join(root, fname)
                if not os.path.isfile(fpath):
                    continue

                if "qualcomm" in fpath.lower() and "sysupgrade" in fname.lower() and fname.endswith(".bin"):
                    primary_qcom_bin = fpath
                if "mediatek" in fpath.lower() and "sysupgrade" in fname.lower() and fname.endswith(".bin"):
                    primary_mtk_bin = fpath

                for board_key, dev in DEVICE_REGISTRY.items():
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

    # Provide Qualcomm Universal fallbacks if some models did not generate distinct binaries
    if primary_qcom_bin and os.path.exists(primary_qcom_bin):
        qcom_targets = [
            ("jiorouter,ax6000-jidu6j11-6811", "maxnet-jidu6811-sysupgrade.bin"),
            ("jiorouter,ax6000-jidu6j11-6911", "maxnet-jidu6911-sysupgrade.bin"),
            ("jiorouter,ax6000-jidu6j11-6611", "maxnet-jidu6611-sysupgrade.bin"),
            ("jiorouter,ax6000-jidu6j11-6411", "maxnet-jidu6411-sysupgrade.bin"),
            ("jiorouter,ax6000-jidu6j11-6111", "maxnet-jidu6111-sysupgrade.bin"),
        ]
        for b_key, c_fname in qcom_targets:
            if b_key not in manifest_devices:
                target_path = os.path.join(out_dir, c_fname)
                if not os.path.exists(target_path):
                    shutil.copy2(primary_qcom_bin, target_path)
                c_sum = calc_sha256(target_path)
                f_size = os.path.getsize(target_path)
                sums_lines.append(f"{c_sum}  {c_fname}")
                dev_info = DEVICE_REGISTRY[b_key]
                dev_entry = {
                    "model": dev_info["model"],
                    "target": dev_info["target"],
                    "soc": dev_info["soc"],
                    "filename": c_fname,
                    "download_url": f"{base_download_url}/{c_fname}",
                    "sha256": c_sum,
                    "size": f_size
                }
                manifest_devices[b_key] = dev_entry
                for alias in dev_info.get("aliases", []):
                    manifest_devices[alias] = dev_entry

    # Provide MediaTek Universal fallbacks
    if primary_mtk_bin and os.path.exists(primary_mtk_bin):
        mtk_targets = [
            ("jiorouter,ax6000-jidu6801", "maxnet-jidu6801-sysupgrade.bin"),
            ("jiorouter,ax6000-jidu6401", "maxnet-jidu6401-sysupgrade.bin"),
            ("jiorouter,ax6000-jidu6101", "maxnet-jidu6101-sysupgrade.bin"),
            ("jiorouter,ax6000-jidu6j01", "maxnet-jidu6j01-sysupgrade.bin"),
        ]
        for b_key, c_fname in mtk_targets:
            if b_key not in manifest_devices:
                target_path = os.path.join(out_dir, c_fname)
                if not os.path.exists(target_path):
                    shutil.copy2(primary_mtk_bin, target_path)
                c_sum = calc_sha256(target_path)
                f_size = os.path.getsize(target_path)
                sums_lines.append(f"{c_sum}  {c_fname}")
                dev_info = DEVICE_REGISTRY[b_key]
                dev_entry = {
                    "model": dev_info["model"],
                    "target": dev_info["target"],
                    "soc": dev_info["soc"],
                    "filename": c_fname,
                    "download_url": f"{base_download_url}/{c_fname}",
                    "sha256": c_sum,
                    "size": f_size
                }
                manifest_devices[b_key] = dev_entry
                for alias in dev_info.get("aliases", []):
                    manifest_devices[alias] = dev_entry

    # Remove duplicates from sha256sums
    unique_sums = list(dict.fromkeys(sums_lines))

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
        f.write('\n'.join(unique_sums) + '\n')

    print(f"Manifest written to {manifest_path} with {len(manifest_devices)} registered device models.")

if __name__ == "__main__":
    main()
