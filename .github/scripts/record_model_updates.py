#!/usr/bin/env python3
"""Records new build version entries into each updates/jidu<model>.json manifest.
Strictly defaults:
  - tested: False (manual toggle required to approve OTA)
  - title: "MAXNET | V<version>"
  - description: "N/A"
"""
import os
import sys
import json
import hashlib
import glob

MODELS = [
    "jidu6911", "jidu6811", "jidu6611", "jidu6411", "jidu6111",
    "jidu6801", "jidu6401", "jidu6601", "jidu6701", "jidu6101", "jidu6j01"
]

def calc_sha256(filepath):
    if not os.path.isfile(filepath):
        return ""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def main():
    if len(sys.argv) < 6:
        print("Usage: record_model_updates.py <release_files_dir> <tag_name> <build_num> <version> <updates_dir> [repo]")
        sys.exit(1)

    release_dir = sys.argv[1]
    tag_name = sys.argv[2]
    build_num = int(sys.argv[3])
    raw_version = sys.argv[4]
    updates_dir = sys.argv[5]
    repo = sys.argv[6] if len(sys.argv) > 6 else os.environ.get("GITHUB_REPOSITORY", "ohhmax/maxnet")

    clean_version = raw_version.lstrip("vV")
    os.makedirs(updates_dir, exist_ok=True)

    print(f"[*] Recording build #{build_num} (version {clean_version}) into {updates_dir}...")

    for model in MODELS:
        json_path = os.path.join(updates_dir, f"{model}.json")
        bin_name = f"maxnet-{model}-sysupgrade.bin"
        bin_path = os.path.join(release_dir, bin_name)

        # Fallback to search recursively if needed
        if not os.path.isfile(bin_path):
            matches = glob.glob(f"{release_dir}/**/{bin_name}", recursive=True)
            if matches:
                bin_path = matches[0]

        file_sha = calc_sha256(bin_path) if os.path.isfile(bin_path) else ""
        download_url = f"https://github.com/{repo}/releases/download/{tag_name}/{bin_name}"

        new_entry = {
            "build": build_num,
            "version": clean_version,
            "tested": False,
            "title": f"MAXNET | V{clean_version}",
            "description": "N/A",
            "url": download_url,
            "sha256": file_sha
        }

        existing_data = {"versions": []}
        if os.path.isfile(json_path):
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                    if isinstance(loaded, dict) and "versions" in loaded:
                        existing_data = loaded
            except Exception as e:
                print(f"[!] Warning reading {json_path}: {e}")

        # Update or prepend entry
        versions = existing_data.get("versions", [])
        updated = False
        for idx, item in enumerate(versions):
            if item.get("build") == build_num:
                # Update hash and url if already exists, retain tested flag if user manually toggled it
                item["version"] = clean_version
                item["url"] = download_url
                if file_sha:
                    item["sha256"] = file_sha
                updated = True
                break

        if not updated:
            versions.insert(0, new_entry)

        # Sort versions by build number descending
        versions.sort(key=lambda x: int(x.get("build", 0)), reverse=True)
        existing_data["versions"] = versions

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, indent=2)

        print(f"  [+] Updated {model}.json: build {build_num}, sha256: {file_sha[:12] if file_sha else 'pending'}...")

    print("[*] All model manifests updated successfully.")

if __name__ == "__main__":
    main()
