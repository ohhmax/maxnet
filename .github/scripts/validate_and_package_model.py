#!/usr/bin/env python3
"""Validates and packages firmware binaries for a specific router model.
Computes SHA-256, optionally signs with usign, and updates the model manifest.
"""
import os
import sys
import json
import hashlib
import shutil
import re
import subprocess

def calc_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def main():
    if len(sys.argv) < 6:
        print("Usage: validate_and_package_model.py <model_id> <raw_bin_dir> <out_dir> <tag_name> <channel> [build_num]")
        sys.exit(1)

    model_id = sys.argv[1].lower().strip()
    raw_bin_dir = sys.argv[2]
    out_dir = sys.argv[3]
    tag_name = sys.argv[4]
    channel = sys.argv[5].lower().strip()
    build_num = int(sys.argv[6]) if len(sys.argv) > 6 else 1

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    model_manifest_path = os.path.join(repo_root, "update", "models", model_id, "manifest.json")
    if not os.path.exists(model_manifest_path):
        model_manifest_path = os.path.join(repo_root, "models", model_id, "manifest.json")

    if not os.path.exists(model_manifest_path):
        print(f"Error: Model manifest not found at {model_manifest_path}")
        sys.exit(1)

    with open(model_manifest_path, "r") as f:
        manifest_data = json.load(f)

    os.makedirs(out_dir, exist_ok=True)

    # Search for matching sysupgrade binary in raw_bin_dir
    canonical_name = manifest_data.get("canonical_sysupgrade", f"maxnet-{model_id}-sysupgrade.bin")
    num_suffix = re.sub(r'[^0-9]', '', model_id)

    found_bin = None
    for root, _, files in os.walk(raw_bin_dir):
        for fname in sorted(files):
            fpath = os.path.join(root, fname)
            if "sysupgrade" in fname.lower() and (fname.endswith(".bin") or fname.endswith(".ubi")):
                if num_suffix and num_suffix in fname:
                    found_bin = fpath
                    break
                elif not found_bin:
                    found_bin = fpath

    if not found_bin:
        print(f"Warning: No specific sysupgrade found for {model_id} in {raw_bin_dir}. Searching any sysupgrade binary...")
        for root, _, files in os.walk(raw_bin_dir):
            for fname in files:
                if "sysupgrade.bin" in fname:
                    found_bin = os.path.join(root, fname)
                    break

    if not found_bin:
        print(f"Error: No sysupgrade binary found for model {model_id} in {raw_bin_dir}")
        sys.exit(1)

    out_file = os.path.join(out_dir, canonical_name)
    shutil.copy2(found_bin, out_file)
    file_size = os.path.getsize(out_file)

    if file_size < 10485760: # < 10MB
        print(f"Error: Generated image {out_file} is suspiciously small ({file_size} bytes)")
        sys.exit(1)

    sha256 = calc_sha256(out_file)
    print(f"Successfully packaged {canonical_name}: {file_size} bytes, SHA256={sha256}")

    # Sign binary with usign if secret key is available
    sec_key = os.environ.get("MAXNET_RELEASE_SEC")
    sig_file = out_file + ".sig"
    if sec_key and shutil.which("usign"):
        tmp_sec = "/tmp/maxnet_sec.key"
        with open(tmp_sec, "w") as sf:
            sf.write(sec_key.strip() + "\n")
        try:
            subprocess.run(["usign", "-S", "-m", out_file, "-s", tmp_sec, "-x", sig_file], check=True)
            print(f"Cryptographically signed {canonical_name} with usign -> {sig_file}")
        finally:
            if os.path.exists(tmp_sec):
                os.remove(tmp_sec)

    repo_url = os.environ.get("GITHUB_REPOSITORY", "ohhmax/maxnet")
    download_url = f"https://github.com/{repo_url}/releases/download/{tag_name}/{canonical_name}"
    sig_url = f"https://github.com/{repo_url}/releases/download/{tag_name}/{canonical_name}.sig"

    # Update manifest for the specified channel
    semver = tag_name.lstrip("v").split("-")[0]
    channel_key = "staging" if channel == "staging" else "stable"

    manifest_data["channels"][channel_key].update({
        "channel": channel_key,
        "version": semver,
        "build": build_num,
        "pushed": False,  # Default OFF: Must be explicitly enabled by user in update/
        "release_date": subprocess.getoutput("date -u +'%Y-%m-%d'"),
        "download_url": download_url,
        "sha256": sha256,
        "size_bytes": file_size,
        "signature_url": sig_url,
        "title": f"MAXNET {semver} ({model_id.upper()})",
        "description": f"Automated verified build #{build_num} on {channel_key} channel."
    })

    with open(model_manifest_path, "w") as f:
        json.dump(manifest_data, f, indent=2)
        f.write("\n")

    print(f"Updated {model_manifest_path} for channel {channel_key}")

if __name__ == "__main__":
    main()
