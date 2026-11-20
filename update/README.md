# MAXNET OTA Firmware Update Control Center

This directory controls all Over-The-Air (OTA) firmware update broadcasts to live MAXNET routers.

---

## ⚡ How It Works

1. **Zero Unwanted Builds**:
   - The entire `update/` folder is excluded from GitHub Actions CI triggers (`paths-ignore: 'update/**'`).
   - You can edit any file here directly on GitHub (or locally via git) without triggering firmware build workflows!

2. **Default Safe Mode (`pushed: false`)**:
   - Whenever a new firmware build is compiled by CI, its binary URL and SHA-256 are automatically prepared, but the release setting defaults to **`"pushed": false`**.
   - No router will see the update until you explicitly approve it.

3. **How to Push an Update to Live Routers**:
   - Open [`update/updates.json`](updates.json) directly on GitHub.
   - Find your router's model (e.g. `"jidu6911"`, `"jidu6811"`, `"jidu6401"`, etc.).
   - Change `"pushed": false` to **`"pushed": true`**.
   - Commit changes to `main`.
   - Live routers of that model will instantly detect the update on their next check and display the upgrade prompt!

4. **How to Withhold / Stop an Update**:
   - Change `"pushed": true` back to **`"pushed": false`**.
   - Commit changes. Routers will immediately report "Router is Up to Date".

---

## 📁 Directory Structure

```
update/
├── updates.json              # Master aggregated manifest fetched by routers
├── manifest.schema.json      # JSON validation schema
├── sync.py                   # Helper script to sync models/ into updates.json
├── README.md                 # This guide
└── models/                   # Per-model manifest directories
    ├── jidu6911/manifest.json
    ├── jidu6811/manifest.json
    ├── jidu6611/manifest.json
    ├── jidu6411/manifest.json
    ├── jidu6111/manifest.json
    ├── jidu6801/manifest.json
    ├── jidu6401/manifest.json
    ├── jidu6601/manifest.json
    ├── jidu6701/manifest.json
    ├── jidu6101/manifest.json
    └── jidu6j01/manifest.json
```

---

## 🔒 Security Safeguards

- **Exact Model Matching**: The router validates its internal board ID against the manifest before downloading or flashing. Mismatched images are aborted before touching flash storage.
- **SHA-256 Hash Pre-Check**: Mandatory cryptographic checksum verification. Flashing will fail if the downloaded image does not match the manifest hash.
- **Anti-Rollback Guard**: The router rejects flashing builds with lower build numbers than the running firmware.
