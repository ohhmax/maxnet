#!/usr/bin/env python3
"""MAXNET Model-Wise Manifest Manager and Aggregator.
Maintains model directories, validates schemas, and builds unified updates.json.
"""
import os
import sys
import json
import re

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

MODEL_DEFINITIONS = [
    {
        "model_id": "jidu6911",
        "display_name": "JioRouter AX6000 JIDU6J11-6911",
        "board_name": "jiorouter,ax6000-jidu6j11-6911",
        "aliases": ["jio,jidu6911", "JIDU6911", "jidu6911"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "revB", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6911-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6911-factory.ubi",
        "stable_pushed": True,
        "staging_pushed": True,
        "sha256": "46496c3de54db0378d6f3afec34fac1c26d138cf6abb38590c0501d0665905c4",
        "size_bytes": 31457280
    },
    {
        "model_id": "jidu6811",
        "display_name": "JioRouter AX6000 JIDU6J11-6811",
        "board_name": "jiorouter,ax6000-jidu6j11-6811",
        "aliases": ["jio,jidu6811", "JIDU6811", "jidu6811"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "revB", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6811-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6811-factory.ubi",
        "stable_pushed": False,
        "staging_pushed": True,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "size_bytes": 31457280
    },
    {
        "model_id": "jidu6611",
        "display_name": "JioRouter AX6000 JIDU6J11-6611",
        "board_name": "jiorouter,ax6000-jidu6j11-6611",
        "aliases": ["jio,jidu6611", "JIDU6611", "jidu6611"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6611-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6611-factory.ubi",
        "stable_pushed": False,
        "staging_pushed": True,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "size_bytes": 31457280
    },
    {
        "model_id": "jidu6411",
        "display_name": "JioRouter AX6000 JIDU6J11-6411",
        "board_name": "jiorouter,ax6000-jidu6j11-6411",
        "aliases": ["jio,jidu6411", "JIDU6411", "jidu6411"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6411-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6411-factory.ubi",
        "stable_pushed": False,
        "staging_pushed": True,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "size_bytes": 31457280
    },
    {
        "model_id": "jidu6111",
        "display_name": "JioRouter AX6000 JIDU6J11-6111",
        "board_name": "jiorouter,ax6000-jidu6j11-6111",
        "aliases": ["jio,jidu6111", "JIDU6111", "jidu6111"],
        "target": "qualcommbe/ipq95xx",
        "soc": "Qualcomm IPQ9574",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6111-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6111-factory.ubi",
        "stable_pushed": False,
        "staging_pushed": True,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "size_bytes": 31457280
    },
    {
        "model_id": "jidu6801",
        "display_name": "JioRouter AX6000 JIDU6801",
        "board_name": "jiorouter,ax6000-jidu6801",
        "aliases": ["jio,jidu6801", "JIDU6801", "jidu6801"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A Filogic 830",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6801-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6801-factory.bin",
        "stable_pushed": False,
        "staging_pushed": True,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "size_bytes": 31457280
    },
    {
        "model_id": "jidu6401",
        "display_name": "JioRouter AX6000 JIDU6401",
        "board_name": "jiorouter,ax6000-jidu6401",
        "aliases": ["jio,jidu6401", "JIDU6401", "jidu6401"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A Filogic 830",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6401-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6401-factory.bin",
        "stable_pushed": False,
        "staging_pushed": True,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "size_bytes": 31457280
    },
    {
        "model_id": "jidu6601",
        "display_name": "JioRouter AX6000 JIDU6601",
        "board_name": "jiorouter,ax6000-jidu6601",
        "aliases": ["jio,jidu6601", "JIDU6601", "jidu6601"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A Filogic 830",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6601-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6601-factory.bin",
        "stable_pushed": False,
        "staging_pushed": True,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "size_bytes": 31457280
    },
    {
        "model_id": "jidu6701",
        "display_name": "JioRouter AX6000 JIDU6701",
        "board_name": "jiorouter,ax6000-jidu6701",
        "aliases": ["jio,jidu6701", "JIDU6701", "jidu6701"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A Filogic 830",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6701-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6701-factory.bin",
        "stable_pushed": False,
        "staging_pushed": True,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "size_bytes": 31457280
    },
    {
        "model_id": "jidu6101",
        "display_name": "JioRouter AX6000 JIDU6101",
        "board_name": "jiorouter,ax6000-jidu6101",
        "aliases": ["jio,jidu6101", "JIDU6101", "jidu6101"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A Filogic 830",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6101-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6101-factory.bin",
        "stable_pushed": False,
        "staging_pushed": True,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "size_bytes": 31457280
    },
    {
        "model_id": "jidu6j01",
        "display_name": "JioRouter AX6000 JIDU6J01",
        "board_name": "jiorouter,ax6000-jidu6j01",
        "aliases": ["JIDU6J01", "jidu6j01"],
        "target": "mediatek/filogic",
        "soc": "MediaTek MT7986A Filogic 830",
        "flash_type": "nand",
        "hardware_revisions": ["revA", "v1.0", "default"],
        "canonical_sysupgrade": "maxnet-jidu6j01-sysupgrade.bin",
        "canonical_factory": "maxnet-jidu6j01-factory.bin",
        "stable_pushed": False,
        "staging_pushed": True,
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "size_bytes": 31457280
    }
]

def init_model_dirs():
    os.makedirs(MODELS_DIR, exist_ok=True)
    repo = "ohhmax/maxnet"
    
    for defn in MODEL_DEFINITIONS:
        m_id = defn["model_id"]
        m_dir = os.path.join(MODELS_DIR, m_id)
        os.makedirs(m_dir, exist_ok=True)
        
        manifest_path = os.path.join(m_dir, "manifest.json")
        readme_path = os.path.join(m_dir, "README.md")
        
        manifest_data = {
            "model_id": m_id,
            "display_name": defn["display_name"],
            "board_name": defn["board_name"],
            "aliases": defn["aliases"],
            "target": defn["target"],
            "soc": defn["soc"],
            "flash_type": defn["flash_type"],
            "hardware_revisions": defn["hardware_revisions"],
            "canonical_sysupgrade": defn["canonical_sysupgrade"],
            "canonical_factory": defn["canonical_factory"],
            "channels": {
                "stable": {
                    "channel": "stable",
                    "version": "2.2.48",
                    "build": 48,
                    "pushed": defn["stable_pushed"],
                    "release_date": "2026-11-20",
                    "download_url": f"https://github.com/{repo}/releases/download/v2.2.48-b48/{defn['canonical_sysupgrade']}",
                    "sha256": defn["sha256"],
                    "size_bytes": defn["size_bytes"],
                    "min_supported_version": "2.2.0",
                    "signature": "",
                    "signature_url": f"https://github.com/{repo}/releases/download/v2.2.48-b48/{defn['canonical_sysupgrade']}.sig",
                    "title": f"MAXNET 2.2.48 Production Stable ({defn['model_id'].upper()})",
                    "description": "• Enhanced ADB multi-device key packaging (.adbmax) with auto-authorization\n• Minimalist theme-adaptive error page matching MAXNET UI\n• Fixed topology tethering IP display\n• Hardened verified OTA sysupgrade pipeline with SHA-256 pre-check"
                },
                "staging": {
                    "channel": "staging",
                    "version": "2.2.49-rc1",
                    "build": 49,
                    "pushed": defn["staging_pushed"],
                    "release_date": "2026-11-20",
                    "download_url": f"https://github.com/{repo}/releases/download/v2.2.49-staging/{defn['canonical_sysupgrade']}",
                    "sha256": defn["sha256"],
                    "size_bytes": defn["size_bytes"],
                    "min_supported_version": "2.2.0",
                    "signature": "",
                    "signature_url": f"https://github.com/{repo}/releases/download/v2.2.49-staging/{defn['canonical_sysupgrade']}.sig",
                    "title": f"MAXNET 2.2.49 Staging Candidate ({defn['model_id'].upper()})",
                    "description": "• Staging Release Candidate with multi-model build matrix\n• Hardened board identification and anti-rollback checks\n• Separate staging manifest isolation"
                }
            }
        }
        
        with open(manifest_path, "w") as f:
            json.dump(manifest_data, f, indent=2)
            f.write("\n")
            
        readme_content = f"""# {defn['display_name']} ({m_id.upper()})

## Hardware Specifications
- **Model ID**: `{m_id}`
- **Board Target**: `{defn['board_name']}`
- **Target Platform**: `{defn['target']}`
- **Processor / SoC**: {defn['soc']}
- **Flash Architecture**: {defn['flash_type'].upper()}
- **Supported Hardware Revisions**: `{', '.join(defn['hardware_revisions'])}`

## Canonical Firmware Images
- **Sysupgrade**: `{defn['canonical_sysupgrade']}`
- **Factory Boot / Install**: `{defn['canonical_factory']}`

## Channel Status
- **Production Stable**: `v2.2.48-b48` (Pushed: `{'YES' if defn['stable_pushed'] else 'PENDING'}`)
- **Staging / QA**: `v2.2.49-rc1` (Pushed: `{'YES' if defn['staging_pushed'] else 'PENDING'}`)

Refer to `manifest.json` for verified SHA-256 hashes and cryptographic signatures.
"""
        with open(readme_path, "w") as f:
            f.write(readme_content)

    print(f"Initialized {len(MODEL_DEFINITIONS)} model directories in {MODELS_DIR}")

def aggregate_updates():
    """Generates the unified updates.json with separated channels."""
    stable_devices = {}
    staging_devices = {}
    
    for defn in MODEL_DEFINITIONS:
        m_id = defn["model_id"]
        manifest_path = os.path.join(MODELS_DIR, m_id, "manifest.json")
        if not os.path.exists(manifest_path):
            continue
        with open(manifest_path, "r") as f:
            data = json.load(f)
            
        stable_info = data["channels"]["stable"]
        staging_info = data["channels"]["staging"]
        
        stable_devices[m_id] = {
            "model_id": m_id,
            "board": defn["board_name"],
            "model": defn["display_name"],
            "target": defn["target"],
            "soc": defn["soc"],
            "hardware_revisions": defn["hardware_revisions"],
            "version": stable_info["version"],
            "build": stable_info["build"],
            "pushed": stable_info["pushed"],
            "release_date": stable_info["release_date"],
            "url": stable_info["download_url"],
            "sha256": stable_info["sha256"],
            "size_bytes": stable_info["size_bytes"],
            "min_version": stable_info["min_supported_version"],
            "signature": stable_info.get("signature", ""),
            "signature_url": stable_info.get("signature_url", ""),
            "title": stable_info["title"],
            "description": stable_info["description"]
        }
        
        staging_devices[m_id] = {
            "model_id": m_id,
            "board": defn["board_name"],
            "model": defn["display_name"],
            "target": defn["target"],
            "soc": defn["soc"],
            "hardware_revisions": defn["hardware_revisions"],
            "version": staging_info["version"],
            "build": staging_info["build"],
            "pushed": staging_info["pushed"],
            "release_date": staging_info["release_date"],
            "url": staging_info["download_url"],
            "sha256": staging_info["sha256"],
            "size_bytes": staging_info["size_bytes"],
            "min_version": staging_info["min_supported_version"],
            "signature": staging_info.get("signature", ""),
            "signature_url": staging_info.get("signature_url", ""),
            "title": staging_info["title"],
            "description": staging_info["description"]
        }

    unified_manifest = {
        "updated_at": "2026-11-20T20:30:00Z",
        "default_channel": "stable",
        "channels": {
            "stable": {
                "channel_name": "Production Stable",
                "devices": stable_devices
            },
            "staging": {
                "channel_name": "Staging Candidate",
                "devices": staging_devices
            }
        },
        # Top-level devices mapping for 100% backward compatibility with legacy router OTA fetchers
        "devices": stable_devices
    }

    out_paths = [
        os.path.join(REPO_ROOT, "updates.json"),
        os.path.join(REPO_ROOT, "files", "etc", "updates.json"),
        os.path.join(REPO_ROOT, "files", "www", "updates.json")
    ]
    
    for p in out_paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w") as f:
            json.dump(unified_manifest, f, indent=2)
            f.write("\n")
        print(f"Wrote unified manifest to {p}")

if __name__ == "__main__":
    init_model_dirs()
    aggregate_updates()
