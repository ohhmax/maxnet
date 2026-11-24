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
        "aliases": ["jio,jidu6811", "jio_jidu6811", "JIDU6811", "jidu6811"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6811-sysupgrade.bin",
        "canonical_initramfs": "maxnet-jidu6811-initramfs.itb",
        "canonical_factory": "maxnet-jidu6811-factory.ubi",
        "pattern": r"(jidu6j11[-_]6811|jio[-_]jidu6811|[-_]6811).*sysupgrade",
        "initramfs_pattern": r"(jidu6j11[-_]6811|jio[-_]jidu6811|[-_]6811).*initramfs",
        "factory_pattern": r"(jidu6j11[-_]6811|jio[-_]jidu6811|[-_]6811).*factory\.ubi",
        "factory_required": True
    },
    "jiorouter,ax6000-jidu6j11-6911": {
        "model": "JioRouter AX6000 JIDU6J11-6911",
        "aliases": ["jio,jidu6911", "jio_jidu6911", "JIDU6911", "jidu6911"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6911-sysupgrade.bin",
        "canonical_initramfs": "maxnet-jidu6911-initramfs.itb",
        "canonical_factory": "maxnet-jidu6911-factory.ubi",
        "pattern": r"(jidu6j11[-_]6911|jio[-_]jidu6911|[-_]6911).*sysupgrade",
        "initramfs_pattern": r"(jidu6j11[-_]6911|jio[-_]jidu6911|[-_]6911).*initramfs",
        "factory_pattern": r"(jidu6j11[-_]6911|jio[-_]jidu6911|[-_]6911).*factory\.ubi",
        "factory_required": True
    },
    "jiorouter,ax6000-jidu6j11-6611": {
        "model": "JioRouter AX6000 JIDU6J11-6611",
        "aliases": ["jio,jidu6611", "jio_jidu6611", "JIDU6611", "jidu6611"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6611-sysupgrade.bin",
        "canonical_initramfs": "maxnet-jidu6611-initramfs.itb",
        "canonical_factory": "maxnet-jidu6611-factory.ubi",
        "pattern": r"(jidu6j11[-_]6611|jio[-_]jidu6611|[-_]6611).*sysupgrade",
        "initramfs_pattern": r"(jidu6j11[-_]6611|jio[-_]jidu6611|[-_]6611).*initramfs",
        "factory_pattern": r"(jidu6j11[-_]6611|jio[-_]jidu6611|[-_]6611).*factory\.ubi",
        "factory_required": True
    },
    "jiorouter,ax6000-jidu6j11-6411": {
        "model": "JioRouter AX6000 JIDU6J11-6411",
        "aliases": ["jio,jidu6411", "jio_jidu6411", "JIDU6411", "jidu6411"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6411-sysupgrade.bin",
        "canonical_initramfs": "maxnet-jidu6411-initramfs.itb",
        "canonical_factory": "maxnet-jidu6411-factory.ubi",
        "pattern": r"(jidu6j11[-_]6411|jio[-_]jidu6411|[-_]6411).*sysupgrade",
        "initramfs_pattern": r"(jidu6j11[-_]6411|jio[-_]jidu6411|[-_]6411).*initramfs",
        "factory_pattern": r"(jidu6j11[-_]6411|jio[-_]jidu6411|[-_]6411).*factory\.ubi",
        "factory_required": True
    },
    "jiorouter,ax6000-jidu6j11-6111": {
        "model": "JioRouter AX6000 JIDU6J11-6111",
        "aliases": ["jio,jidu6111", "jio_jidu6111", "JIDU6111", "jidu6111"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "canonical_name": "maxnet-jidu6111-sysupgrade.bin",
        "canonical_initramfs": "maxnet-jidu6111-initramfs.itb",
        "canonical_factory": "maxnet-jidu6111-factory.ubi",
        "pattern": r"(jidu6j11[-_]6111|jio[-_]jidu6111|[-_]6111).*sysupgrade",
        "initramfs_pattern": r"(jidu6j11[-_]6111|jio[-_]jidu6111|[-_]6111).*initramfs",
        "factory_pattern": r"(jidu6j11[-_]6111|jio[-_]jidu6111|[-_]6111).*factory\.ubi",
        "factory_required": True
    },
    # MediaTek Family (mediatek/filogic)
    "jiorouter,ax6000-jidu6j01": {
        "model": "JioRouter AX6000 JIDU6J01",
        "aliases": [
            "JIDU6J01", "jidu6j01",
            "jidu6601", "JIDU6601", "jio,jidu6601", "jiorouter,ax6000-jidu6601",
            "jidu6701", "JIDU6701", "jio,jidu6701", "jiorouter,ax6000-jidu6701",
            "jidu6201", "JIDU6201", "jio,jidu6201", "jiorouter,ax6000-jidu6201"
        ],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6j01-sysupgrade.bin",
        "canonical_initramfs": "maxnet-jidu6j01-initramfs.itb",
        "canonical_factory": "maxnet-jidu6j01-factory.bin",
        "pattern": r"(jidu6j01|[-_]6j01).*sysupgrade",
        "initramfs_pattern": r"(jidu6j01|[-_]6j01).*initramfs",
        "factory_pattern": r"(jidu6j01|[-_]6j01).*factory\.bin",
        "factory_required": False
    },
    "jiorouter,ax6000-jidu6801": {
        "model": "JioRouter AX6000 JIDU6801",
        "aliases": ["jio,jidu6801", "JIDU6801", "jidu6801"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6801-sysupgrade.bin",
        "canonical_initramfs": "maxnet-jidu6801-initramfs.itb",
        "canonical_factory": "maxnet-jidu6801-factory.bin",
        "pattern": r"(jidu6801|[-_]6801).*sysupgrade",
        "initramfs_pattern": r"(jidu6801|[-_]6801).*initramfs",
        "factory_pattern": r"(jidu6801|[-_]6801).*factory\.bin",
        "factory_required": False
    },
    "jiorouter,ax6000-jidu6401": {
        "model": "JioRouter AX6000 JIDU6401",
        "aliases": ["jio,jidu6401", "JIDU6401", "jidu6401"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6401-sysupgrade.bin",
        "canonical_initramfs": "maxnet-jidu6401-initramfs.itb",
        "canonical_factory": "maxnet-jidu6401-factory.bin",
        "pattern": r"(jidu6401|[-_]6401).*sysupgrade",
        "initramfs_pattern": r"(jidu6401|[-_]6401).*initramfs",
        "factory_pattern": r"(jidu6401|[-_]6401).*factory\.bin",
        "factory_required": False
    },
    "jiorouter,ax6000-jidu6101": {
        "model": "JioRouter AX6000 JIDU6101",
        "aliases": ["jio,jidu6101", "JIDU6101", "jidu6101"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A",
        "canonical_name": "maxnet-jidu6101-sysupgrade.bin",
        "canonical_initramfs": "maxnet-jidu6101-initramfs.itb",
        "canonical_factory": "maxnet-jidu6101-factory.bin",
        "pattern": r"(jidu6101|[-_]6101).*sysupgrade",
        "initramfs_pattern": r"(jidu6101|[-_]6101).*initramfs",
        "factory_pattern": r"(jidu6101|[-_]6101).*factory\.bin",
        "factory_required": False
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
    primary_qcom_initramfs = None
    primary_mtk_initramfs = None

    # Discovered files across all architecture harvest outputs
    discovered_files = []
    for bin_dir in bin_dirs:
        for root, _, files in os.walk(bin_dir):
            for fname in files:
                fpath = os.path.join(root, fname)
                if not os.path.isfile(fpath):
                    continue
                discovered_files.append((fpath, fname))

                # Identify primary sysupgrade, factory, and initramfs binaries
                if "qualcomm" in fpath.lower():
                    if "sysupgrade" in fname.lower() and fname.endswith(".bin"):
                        primary_qcom_bin = fpath
                    if "factory" in fname.lower() and (fname.endswith(".ubi") or fname.endswith(".bin")):
                        primary_qcom_factory = fpath
                    if "initramfs" in fname.lower() and (fname.endswith(".itb") or fname.endswith(".bin")):
                        primary_qcom_initramfs = fpath
                elif "mediatek" in fpath.lower():
                    if "sysupgrade" in fname.lower() and fname.endswith(".bin"):
                        primary_mtk_bin = fpath
                    if "factory" in fname.lower() and fname.endswith(".bin"):
                        primary_mtk_factory = fpath
                    if "initramfs" in fname.lower() and (fname.endswith(".itb") or fname.endswith(".bin")):
                        primary_mtk_initramfs = fpath

    # Process each registered device model
    for board_key, dev in DEVICE_REGISTRY.items():
        matched_bin = None
        matched_factory = None
        matched_initramfs = None

        is_qcom = "qualcomm" in dev["target"]
        arch_filter = "qualcomm" if is_qcom else "mediatek"

        for fpath, fname in discovered_files:
            if arch_filter not in fpath.lower():
                continue
            if re.search(dev["pattern"], fname, re.IGNORECASE) and fname.endswith(".bin"):
                matched_bin = fpath
            if dev.get("factory_pattern") and re.search(dev["factory_pattern"], fname, re.IGNORECASE):
                matched_factory = fpath
            if dev.get("initramfs_pattern") and re.search(dev["initramfs_pattern"], fname, re.IGNORECASE):
                matched_initramfs = fpath

        # Apply architecture-level fallback if model-specific build was not generated
        if not matched_bin:
            matched_bin = primary_qcom_bin if is_qcom else primary_mtk_bin
        if not matched_factory:
            matched_factory = primary_qcom_factory if is_qcom else primary_mtk_factory
        if not matched_initramfs:
            matched_initramfs = primary_qcom_initramfs if is_qcom else primary_mtk_initramfs

        # Fail explicitly if neither model-specific nor architecture-level sysupgrade binary exists
        if not matched_bin or not os.path.exists(matched_bin):
            print(
                f"Error: Neither model-specific nor architecture-level sysupgrade binary found for {dev['model']} "
                f"(expected pattern: {dev['pattern']}) in harvested outputs.",
                file=sys.stderr
            )
            sys.exit(1)

        # Fail explicitly if factory image is required (e.g. Qualcomm) and was not built
        if dev.get("factory_required", False):
            if not matched_factory or not os.path.exists(matched_factory):
                print(
                    f"Error: Required factory image not found for {dev['model']} "
                    f"(expected pattern: {dev.get('factory_pattern')}) in harvested outputs.",
                    file=sys.stderr
                )
                sys.exit(1)

        # 1. Copy Sysupgrade Binary
        target_filename = dev["canonical_name"]
        target_path = os.path.join(out_dir, target_filename)
        if not os.path.exists(target_path) or os.path.getsize(target_path) == 0:
            shutil.copy2(matched_bin, target_path)

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

        # 2. Copy Factory Image only if it actually exists
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

        # 3. Copy Initramfs FIT Image (.itb) only if it actually exists
        if matched_initramfs and os.path.exists(matched_initramfs):
            target_itb_name = dev["canonical_initramfs"]
            target_itb_path = os.path.join(out_dir, target_itb_name)
            if not os.path.exists(target_itb_path) or os.path.getsize(target_itb_path) == 0:
                shutil.copy2(matched_initramfs, target_itb_path)

            itb_sum = calc_sha256(target_itb_path)
            itb_size = os.path.getsize(target_itb_path)
            sums_lines.append(f"{itb_sum}  {target_itb_name}")

            dev_entry["initramfs_filename"] = target_itb_name
            dev_entry["initramfs_download_url"] = f"{base_download_url}/{target_itb_name}"
            dev_entry["initramfs_sha256"] = itb_sum
            dev_entry["initramfs_size"] = itb_size

        manifest_devices[board_key] = dev_entry
        for alias in dev.get("aliases", []):
            manifest_devices[alias] = dev_entry

    # Check for duplicate SHA-256 across distinct models (copies, not separate builds)
    model_hashes = {}
    for board_key, dev in DEVICE_REGISTRY.items():
        c_name = dev["canonical_name"]
        target_path = os.path.join(out_dir, c_name)
        if os.path.exists(target_path):
            sha = calc_sha256(target_path)
            model_hashes.setdefault(sha, []).append((dev["model"], c_name))

    for sha, models in model_hashes.items():
        if len(models) > 1:
            model_names = [f"'{m[0]}' ({m[1]})" for m in models]
            print(
                f"WARNING: Multiple models share identical SHA-256 ({sha}): {', '.join(model_names)}! "
                f"They are copies, not separate builds.",
                file=sys.stderr
            )

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
