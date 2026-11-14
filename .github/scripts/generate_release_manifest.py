#!/usr/bin/env python3
"""Generates unified manifest.json and standard binaries (sysupgrade.bin & factory.ubi/bin)
for all Jio router models. Completely eliminates obsolete/broken .itb initramfs packaging.
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
        "canonical_factory": "maxnet-jidu6811-factory.ubi",
        "pattern": r"(jidu6j11[-_]6811|jio[-_]jidu6811|[-_]6811).*sysupgrade",
        "factory_pattern": r"(jidu6j11[-_]6811|jio[-_]jidu6811|[-_]6811).*factory\.ubi"
    },
    "jiorouter,ax6000-jidu6j11-6911": {
        "model": "JioRouter AX6000 JIDU6J11-6911",
        "aliases": ["jio,jidu6911", "JIDU6911", "jidu6911"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6911-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6911-factory.ubi",
        "pattern": r"(jidu6j11[-_]6911|jio[-_]jidu6911|[-_]6911).*sysupgrade",
        "factory_pattern": r"(jidu6j11[-_]6911|jio[-_]jidu6911|[-_]6911).*factory\.ubi"
    },
    "jiorouter,ax6000-jidu6j11-6611": {
        "model": "JioRouter AX6000 JIDU6J11-6611",
        "aliases": ["jio,jidu6611", "JIDU6611", "jidu6611"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6611-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6611-factory.ubi",
        "pattern": r"(jidu6j11[-_]6611|jio[-_]jidu6611|[-_]6611).*sysupgrade",
        "factory_pattern": r"(jidu6j11[-_]6611|jio[-_]jidu6611|[-_]6611).*factory\.ubi"
    },
    "jiorouter,ax6000-jidu6j11-6411": {
        "model": "JioRouter AX6000 JIDU6J11-6411",
        "aliases": ["jio,jidu6411", "JIDU6411", "jidu6411"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6411-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6411-factory.ubi",
        "pattern": r"(jidu6j11[-_]6411|jio[-_]jidu6411|[-_]6411).*sysupgrade",
        "factory_pattern": r"(jidu6j11[-_]6411|jio[-_]jidu6411|[-_]6411).*factory\.ubi"
    },
    "jiorouter,ax6000-jidu6j11-6111": {
        "model": "JioRouter AX6000 JIDU6J11-6111",
        "aliases": ["jio,jidu6111", "JIDU6111", "jidu6111"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6111-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6111-factory.ubi",
        "pattern": r"(jidu6j11[-_]6111|jio[-_]jidu6111|[-_]6111).*sysupgrade",
        "factory_pattern": r"(jidu6j11[-_]6111|jio[-_]jidu6111|[-_]6111).*factory\.ubi"
    },
    "jio,jidu6811": {
        "model": "Jio JIDU6811",
        "aliases": ["jio_jidu6811"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6811-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6811-factory.ubi",
        "pattern": r"(jio[-_]jidu6811|[-_]6811).*sysupgrade",
        "factory_pattern": r"(jio[-_]jidu6811|[-_]6811).*factory\.ubi"
    },
    # MediaTek Family (mediatek/filogic)
    "jiorouter,ax6000-jidu6j01": {
        "model": "JioRouter AX6000 JIDU6J01",
        "aliases": ["JIDU6J01", "jidu6j01"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6j01-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6j01-factory.bin",
        "pattern": r"(jidu6j01|[-_]6j01).*sysupgrade",
        "factory_pattern": r"(jidu6j01|[-_]6j01).*factory\.bin"
    },
    "jiorouter,ax6000-jidu6801": {
        "model": "JioRouter AX6000 JIDU6801",
        "aliases": ["jio,jidu6801", "JIDU6801", "jidu6801"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6801-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6801-factory.bin",
        "pattern": r"(jidu6801|[-_]6801).*sysupgrade",
        "factory_pattern": r"(jidu6801|[-_]6801).*factory\.bin"
    },
    "jiorouter,ax6000-jidu6401": {
        "model": "JioRouter AX6000 JIDU6401",
        "aliases": ["jio,jidu6401", "JIDU6401", "jidu6401"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6401-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6401-factory.bin",
        "pattern": r"(jidu6401|[-_]6401).*sysupgrade",
        "factory_pattern": r"(jidu6401|[-_]6401).*factory\.bin"
    },
    "jiorouter,ax6000-jidu6101": {
        "model": "JioRouter AX6000 JIDU6101",
        "aliases": ["jio,jidu6101", "JIDU6101", "jidu6101"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6101-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6101-factory.bin",
        "pattern": r"(jidu6101|[-_]6101).*sysupgrade",
        "factory_pattern": r"(jidu6101|[-_]6101).*factory\.bin"
    }
}

def calc_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def main():
    if len(sys.argv) < 4:
        print("Usage: generate_release_manifest.py <harvest_bin_dirs> <out_dir> <tag_name>")
        sys.exit(1)

    bin_dirs = [d.strip() for d in sys.argv[1].split(",") if d.strip()]
    out_dir = sys.argv[2]
    tag_name = sys.argv[3]

    os.makedirs(out_dir, exist_ok=True)

    repo_url = os.environ.get("GITHUB_REPOSITORY", "ohhmax/maxnet")
    base_download_url = f"https://github.com/{repo_url}/releases/download/{tag_name}"

    manifest_devices = {}
    sums_lines = []

    primary_qcom_bin = None
    primary_mtk_bin = None
    primary_qcom_factory = None
    primary_mtk_factory = None

    # Discovered files across all architecture harvest outputs
    discovered_files = []
    for bin_dir in bin_dirs:
        for root, _, files in os.walk(bin_dir):
            for fname in files:
                fpath = os.path.join(root, fname)
                if not os.path.isfile(fpath):
                    continue
                discovered_files.append((fpath, fname))

                # Identify primary sysupgrade and factory binaries
                if "qualcomm" in fpath.lower():
                    if "sysupgrade" in fname.lower() and fname.endswith(".bin"):
                        primary_qcom_bin = fpath
                    if "factory" in fname.lower() and (fname.endswith(".ubi") or fname.endswith(".bin")):
                        primary_qcom_factory = fpath
                elif "mediatek" in fpath.lower():
                    if "sysupgrade" in fname.lower() and fname.endswith(".bin"):
                        primary_mtk_bin = fpath
                    if "factory" in fname.lower() and fname.endswith(".bin"):
                        primary_mtk_factory = fpath

    # Process each registered device model
    for board_key, dev in DEVICE_REGISTRY.items():
        matched_bin = None
        matched_factory = None

        for fpath, fname in discovered_files:
            if re.search(dev["pattern"], fname, re.IGNORECASE) and fname.endswith(".bin"):
                matched_bin = fpath
            if re.search(dev.get("factory_pattern", ""), fname, re.IGNORECASE):
                matched_factory = fpath

        # Apply fallbacks if model-specific file was not generated
        is_qcom = "qualcomm" in dev["target"]
        if not matched_bin:
            matched_bin = primary_qcom_bin if is_qcom else primary_mtk_bin
        if not matched_factory:
            matched_factory = primary_qcom_factory if is_qcom else primary_mtk_factory

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

        # 2. Copy Factory Image (NAND UBI or MediaTek Factory) - NO ITB!
        if matched_factory and os.path.exists(matched_factory):
            target_factory_name = dev["canonical_factory"]
            target_factory_path = os.path.join(out_dir, target_factory_name)
            if not os.path.exists(target_factory_path) or os.path.getsize(target_factory_path) == 0:
                shutil.copy2(matched_factory, target_factory_path)

            factory_sum = calc_sha256(target_factory_path)
            factory_size = os.path.getsize(target_factory_path)
            sums_lines.append(f"{factory_sum}  {target_factory_name}")

            dev_entry["factory_filename"] = target_factory_name
            dev_entry["factory_download_url"] = f"{base_download_url}/{target_factory_name}"
            dev_entry["factory_sha256"] = factory_sum
            dev_entry["factory_size"] = factory_size

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
