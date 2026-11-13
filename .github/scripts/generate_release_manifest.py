#!/usr/bin/env python3
"""Generates unified manifest.json, standard sysupgrade.bin binaries, and .itb ram-boot images
for all Jio router models. Enables instant OTA updates and U-Boot ram-boot testing.
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
        "canonical_itb": "maxnet-jidu6811-initramfs.itb",
        "pattern": r"(jidu6j11[-_]6811|jio[-_]jidu6811|[-_]6811).*sysupgrade",
        "itb_pattern": r"(jidu6j11[-_]6811|jio[-_]jidu6811|[-_]6811).*(initramfs|recovery|uImage)"
    },
    "jiorouter,ax6000-jidu6j11-6911": {
        "model": "JioRouter AX6000 JIDU6J11-6911",
        "aliases": ["jio,jidu6911", "JIDU6911", "jidu6911"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6911-sysupgrade.bin",
        "canonical_itb": "maxnet-jidu6911-initramfs.itb",
        "pattern": r"(jidu6j11[-_]6911|jio[-_]jidu6911|[-_]6911).*sysupgrade",
        "itb_pattern": r"(jidu6j11[-_]6911|jio[-_]jidu6911|[-_]6911).*(initramfs|recovery|uImage)"
    },
    "jiorouter,ax6000-jidu6j11-6611": {
        "model": "JioRouter AX6000 JIDU6J11-6611",
        "aliases": ["jio,jidu6611", "JIDU6611", "jidu6611"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6611-sysupgrade.bin",
        "canonical_itb": "maxnet-jidu6611-initramfs.itb",
        "pattern": r"(jidu6j11[-_]6611|jio[-_]jidu6611|[-_]6611).*sysupgrade",
        "itb_pattern": r"(jidu6j11[-_]6611|jio[-_]jidu6611|[-_]6611).*(initramfs|recovery|uImage)"
    },
    "jiorouter,ax6000-jidu6j11-6411": {
        "model": "JioRouter AX6000 JIDU6J11-6411",
        "aliases": ["jio,jidu6411", "JIDU6411", "jidu6411"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6411-sysupgrade.bin",
        "canonical_itb": "maxnet-jidu6411-initramfs.itb",
        "pattern": r"(jidu6j11[-_]6411|jio[-_]jidu6411|[-_]6411).*sysupgrade",
        "itb_pattern": r"(jidu6j11[-_]6411|jio[-_]jidu6411|[-_]6411).*(initramfs|recovery|uImage)"
    },
    "jiorouter,ax6000-jidu6j11-6111": {
        "model": "JioRouter AX6000 JIDU6J11-6111",
        "aliases": ["jio,jidu6111", "JIDU6111", "jidu6111"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6111-sysupgrade.bin",
        "canonical_itb": "maxnet-jidu6111-initramfs.itb",
        "pattern": r"(jidu6j11[-_]6111|jio[-_]jidu6111|[-_]6111).*sysupgrade",
        "itb_pattern": r"(jidu6j11[-_]6111|jio[-_]jidu6111|[-_]6111).*(initramfs|recovery|uImage)"
    },
    "jio,jidu6811": {
        "model": "Jio JIDU6811",
        "aliases": ["jio_jidu6811"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6811-sysupgrade.bin",
        "canonical_itb": "maxnet-jidu6811-initramfs.itb",
        "pattern": r"(jio[-_]jidu6811|[-_]6811).*sysupgrade",
        "itb_pattern": r"(jio[-_]jidu6811|[-_]6811).*(initramfs|recovery|uImage)"
    },
    # MediaTek Family (mediatek/filogic)
    "jiorouter,ax6000-jidu6j01": {
        "model": "JioRouter AX6000 JIDU6J01",
        "aliases": ["JIDU6J01", "jidu6j01"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6j01-sysupgrade.bin",
        "canonical_itb": "maxnet-jidu6j01-initramfs.itb",
        "pattern": r"(jidu6j01|[-_]6j01).*sysupgrade",
        "itb_pattern": r"(jidu6j01|[-_]6j01).*(initramfs|recovery|uImage)"
    },
    "jiorouter,ax6000-jidu6801": {
        "model": "JioRouter AX6000 JIDU6801",
        "aliases": ["jio,jidu6801", "JIDU6801", "jidu6801"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6801-sysupgrade.bin",
        "canonical_itb": "maxnet-jidu6801-initramfs.itb",
        "pattern": r"(jidu6801|[-_]6801).*sysupgrade",
        "itb_pattern": r"(jidu6801|[-_]6801).*(initramfs|recovery|uImage)"
    },
    "jiorouter,ax6000-jidu6401": {
        "model": "JioRouter AX6000 JIDU6401",
        "aliases": ["jio,jidu6401", "JIDU6401", "jidu6401"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6401-sysupgrade.bin",
        "canonical_itb": "maxnet-jidu6401-initramfs.itb",
        "pattern": r"(jidu6401|[-_]6401).*sysupgrade",
        "itb_pattern": r"(jidu6401|[-_]6401).*(initramfs|recovery|uImage)"
    },
    "jiorouter,ax6000-jidu6101": {
        "model": "JioRouter AX6000 JIDU6101",
        "aliases": ["jio,jidu6101", "JIDU6101", "jidu6101"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6101-sysupgrade.bin",
        "canonical_itb": "maxnet-jidu6101-initramfs.itb",
        "pattern": r"(jidu6101|[-_]6101).*sysupgrade",
        "itb_pattern": r"(jidu6101|[-_]6101).*(initramfs|recovery|uImage)"
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
    primary_qcom_itb = None
    primary_mtk_itb = None

    # Discovered files across all architecture harvest outputs
    discovered_files = []
    for bin_dir in bin_dirs:
        for root, _, files in os.walk(bin_dir):
            for fname in files:
                fpath = os.path.join(root, fname)
                if not os.path.isfile(fpath):
                    continue
                discovered_files.append((fpath, fname))

                # Identify primary sysupgrade and itb binaries
                if "qualcomm" in fpath.lower():
                    if "sysupgrade" in fname.lower() and fname.endswith(".bin"):
                        primary_qcom_bin = fpath
                    if ("initramfs" in fname.lower() or "recovery" in fname.lower() or "fit" in fname.lower()) and (fname.endswith(".itb") or fname.endswith(".bin")):
                        primary_qcom_itb = fpath
                elif "mediatek" in fpath.lower():
                    if "sysupgrade" in fname.lower() and fname.endswith(".bin"):
                        primary_mtk_bin = fpath
                    if ("initramfs" in fname.lower() or "recovery" in fname.lower()) and (fname.endswith(".itb") or fname.endswith(".bin")):
                        primary_mtk_itb = fpath

    # Process each registered device model
    for board_key, dev in DEVICE_REGISTRY.items():
        matched_bin = None
        matched_itb = None

        for fpath, fname in discovered_files:
            if re.search(dev["pattern"], fname, re.IGNORECASE) and fname.endswith(".bin"):
                matched_bin = fpath
            if re.search(dev.get("itb_pattern", ""), fname, re.IGNORECASE) and (fname.endswith(".itb") or "initramfs" in fname.lower()):
                matched_itb = fpath

        # Apply fallbacks if model-specific file was not generated
        is_qcom = "qualcomm" in dev["target"]
        if not matched_bin:
            matched_bin = primary_qcom_bin if is_qcom else primary_mtk_bin
        if not matched_itb:
            matched_itb = primary_qcom_itb if is_qcom else primary_mtk_itb

        # 1. Copy Sysupgrade Binary
        dev_entry = {
            "model": dev["model"],
            "target": dev["target"],
            "soc": dev["soc"]
        }

        if matched_bin and os.path.exists(matched_bin):
            target_filename = dev["canonical_name"]
            target_path = os.path.join(out_dir, target_filename)
            if not os.path.exists(target_path) or os.path.getsize(target_path) == 0:
                shutil.copy2(matched_bin, target_path)

            c_sum = calc_sha256(target_path)
            f_size = os.path.getsize(target_path)
            sums_lines.append(f"{c_sum}  {target_filename}")

            dev_entry["filename"] = target_filename
            dev_entry["download_url"] = f"{base_download_url}/{target_filename}"
            dev_entry["sha256"] = c_sum
            dev_entry["size"] = f_size

        # 2. Copy ITB (RAM Boot) File
        if matched_itb and os.path.exists(matched_itb):
            target_itb_name = dev["canonical_itb"]
            target_itb_path = os.path.join(out_dir, target_itb_name)
            if not os.path.exists(target_itb_path) or os.path.getsize(target_itb_path) == 0:
                shutil.copy2(matched_itb, target_itb_path)

            itb_sum = calc_sha256(target_itb_path)
            itb_size = os.path.getsize(target_itb_path)
            sums_lines.append(f"{itb_sum}  {target_itb_name}")

            dev_entry["itb_filename"] = target_itb_name
            dev_entry["itb_download_url"] = f"{base_download_url}/{target_itb_name}"
            dev_entry["itb_sha256"] = itb_sum
            dev_entry["itb_size"] = itb_size

        manifest_devices[board_key] = dev_entry
        for alias in dev.get("aliases", []):
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
    print(f"Total checksum entries: {len(unique_sums)}")

if __name__ == "__main__":
    main()
