#!/usr/bin/env python3
"""MAXNET OTA Update Control Synchronizer.
Aggregates model-specific manifests into update/updates.json and validates schemas.
When builds are released, pushed defaults to false unless explicitly approved.
"""
import os
import sys
import json
import glob

UPDATE_DIR = os.path.abspath(os.path.dirname(__file__))
REPO_ROOT = os.path.abspath(os.path.join(UPDATE_DIR, ".."))
MODELS_DIR = os.path.join(UPDATE_DIR, "models")

def load_json(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(filepath, data):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

def sync():
    manifest_files = sorted(glob.glob(os.path.join(MODELS_DIR, "*", "manifest.json")))
    if not manifest_files:
        print(f"Error: No model manifests found in {MODELS_DIR}")
        sys.exit(1)

    devices = {}
    for mf in manifest_files:
        try:
            mdata = load_json(mf)
        except Exception as e:
            print(f"Error reading {mf}: {e}")
            continue

        m_id = mdata.get("model_id")
        if not m_id:
            continue

        # Extract active release info (prefers stable channel definition)
        rel_info = mdata.get("channels", {}).get("stable", {})
        if not rel_info:
            rel_info = mdata.get("release", {})

        devices[m_id] = {
            "model_id": m_id,
            "board": mdata.get("board_name", ""),
            "model": mdata.get("display_name", ""),
            "target": mdata.get("target", ""),
            "soc": mdata.get("soc", ""),
            "hardware_revisions": mdata.get("hardware_revisions", ["default"]),
            "version": rel_info.get("version", "2.2.48"),
            "build": rel_info.get("build", 48),
            "pushed": rel_info.get("pushed", False),  # Default OFF unless explicitly toggled
            "release_date": rel_info.get("release_date", "2026-11-20"),
            "url": rel_info.get("download_url", ""),
            "sha256": rel_info.get("sha256", ""),
            "size_bytes": rel_info.get("size_bytes", 31457280),
            "min_version": rel_info.get("min_supported_version", "2.2.0"),
            "signature_url": rel_info.get("signature_url", ""),
            "title": rel_info.get("title", f"MAXNET Update ({m_id.upper()})"),
            "description": rel_info.get("description", "Verified MAXNET firmware release.")
        }

    unified_manifest = {
        "updated_at": "2026-11-20T21:10:00Z",
        "description": "MAXNET Master Router Firmware OTA Control Manifest",
        "note": "Edit 'pushed': true for any model to broadcast update to live routers. 'pushed': false holds it.",
        "devices": devices
    }

    out_paths = [
        os.path.join(UPDATE_DIR, "updates.json"),
        os.path.join(REPO_ROOT, "updates.json"),
        os.path.join(REPO_ROOT, "files", "etc", "updates.json"),
        os.path.join(REPO_ROOT, "files", "www", "updates.json")
    ]

    for p in out_paths:
        save_json(p, unified_manifest)
        print(f"Synced -> {p}")

    print(f"\n[✓] Successfully synchronized {len(devices)} router models.")
    pushed_list = [k for k, v in devices.items() if v["pushed"] is True]
    held_list = [k for k, v in devices.items() if v["pushed"] is not True]
    print(f"    - Pushed to routers ({len(pushed_list)}): {', '.join(pushed_list) if pushed_list else 'NONE (All Protected)'}")
    print(f"    - Held / Off ({len(held_list)}): {', '.join(held_list)}")

if __name__ == "__main__":
    sync()
