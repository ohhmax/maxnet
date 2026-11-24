/**
 * Maxnet Firmware Portal
 * Dynamic Real-Time Discovery • Tested Release Asset Checking
 * Monochromatic 3D Aesthetic • Floating Backdrop UI • Light & Dark Mode
 */

const KNOWN_MODELS = [
  { id: "jidu6911", name: "JIDU6911", platform: "Qualcomm", soc: "Qualcomm IPQ9574", hasFactory: true },
  { id: "jidu6811", name: "JIDU6811", platform: "Qualcomm", soc: "Qualcomm IPQ9574", hasFactory: true },
  { id: "jidu6611", name: "JIDU6611", platform: "Qualcomm", soc: "Qualcomm IPQ9554", hasFactory: true },
  { id: "jidu6411", name: "JIDU6411", platform: "Qualcomm", soc: "Qualcomm IPQ9554", hasFactory: true },
  { id: "jidu6111", name: "JIDU6111", platform: "Qualcomm", soc: "Qualcomm IPQ9554", hasFactory: true },
  { id: "jidu6801", name: "JIDU6801", platform: "MediaTek", soc: "MediaTek MT7986A", hasFactory: false },
  { id: "jidu6401", name: "JIDU6401", platform: "MediaTek", soc: "MediaTek MT7986A", hasFactory: false },
  { id: "jidu6601", name: "JIDU6601", platform: "MediaTek", soc: "MediaTek MT7986A", hasFactory: false },
  { id: "jidu6701", name: "JIDU6701", platform: "MediaTek", soc: "MediaTek MT7986A", hasFactory: false },
  { id: "jidu6101", name: "JIDU6101", platform: "MediaTek", soc: "MediaTek MT7986A", hasFactory: false },
  { id: "jidu6j01", name: "JIDU6J01", platform: "MediaTek", soc: "MediaTek MT7986A", hasFactory: false }
];

const QUALCOMM_MODELS = ["jidu6911", "jidu6811", "jidu6611", "jidu6411", "jidu6111"];
const STORAGE_KEY_MODEL = "maxnet_selected_model";
const DEFAULT_MODEL = "jidu6911";

// Known verified factory UBI checksums per release tag (Qualcomm IPQ9574 factory image)
const KNOWN_FACTORY_CHECKSUMS = {
  "v2.2.54-b54": "f89b68c6339bf1109ca1676645e7606d25980faa64d6c4278e858cc442d7f8e7",
  "v2.2.53-b53": "f0a6338826f01b81f0f3b7c81082f3497a77d5defbf8d59ba9121214ed819746",
  "v2.2.52-b52": "74ad4501af9c73644eceb43127dcc1ac0aef1881bdfa22de8a5c217abf24fc62",
  "v2.2.51-b51": "7a12fa41254682f0a3c7ee7301bf92aa94db8123a345a707d6407d9506f0dea3",
  "v2.2.48-b48": "64a6acf2977ab6f2994ae1f43c4e9d0f76aa4c9a343f135d08d656235a5cc27e"
};

const ICONS = {
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  sha256: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  cpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`,
  disk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
  binary: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  tools: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
  plug: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"></path></svg>`,
  key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-1.5 1.5L16 7l-1.5-1.5-2 2 1.5 1.5L11 12m-1-1.5L8.5 9 6 11.5l1.5 1.5L6 14.5 4.5 13 2 15.5l5 5c3.87 0 7-3.13 7-7 0-.58-.07-1.15-.21-1.69z"></path></svg>`,
  ram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
  wifi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  debian: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"></circle><path d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5c0 2.2-1.1 3.7-2.6 4.6-1.5.9-3.4.8-4.6-.4-1.1-1.1-1.1-2.8 0-3.9 1.1-1.1 2.8-1.1 3.9 0 .8.8.8 2 0 2.8"></path></svg>`,
  arch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L3 21h4.5l2-4.2c1.6.8 3.4.8 5 0l2 4.2H21L12 3z"></path><path d="M10 14c1.3-.7 2.7-.7 4 0"></path></svg>`
};

let currentTheme = localStorage.getItem("maxnet_theme") || "dark";
let selectedModelId = getInitialModel();
let selectedVersionTag = null;
let availableModels = [];
let modelDataCache = {};
let releaseAssetsCache = new Set();
let releaseAssetsFetched = false;

// 1. Initial Model Determination (URL Hash > LocalStorage > Default jidu6911)
function getInitialModel() {
  if (window.location.hash) {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (KNOWN_MODELS.some(m => m.id === hash)) {
      return hash;
    }
  }
  const saved = localStorage.getItem(STORAGE_KEY_MODEL);
  if (saved && KNOWN_MODELS.some(m => m.id === saved.toLowerCase())) {
    return saved.toLowerCase();
  }
  return DEFAULT_MODEL;
}

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("maxnet_theme", theme);

  const toggleBtn = document.getElementById("themeToggleBtn");
  if (toggleBtn) {
    toggleBtn.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
    toggleBtn.setAttribute("title", theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode");
  }

  // Synchronize desktop showcase screenshots with the main site theme
  updateShowcaseScreenshots(theme);
}

function toggleTheme() {
  applyTheme(currentTheme === "dark" ? "light" : "dark");
}

function updateShowcaseScreenshots(theme) {
  const showcaseImgs = document.querySelectorAll(".desktop-screen-img");
  showcaseImgs.forEach(img => {
    const targetSrc = theme === "light" ? img.dataset.light : img.dataset.dark;
    if (targetSrc && img.getAttribute("src") !== targetSrc) {
      img.setAttribute("src", targetSrc);
    }
  });
}

function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return "";
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1) + " MB";
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Fetch tested versions directly from GitHub raw updates/*.json (Zero GitHub API, No files created in docs/)
async function fetchTestedFirmware(modelId) {
  if (modelDataCache[modelId]) return modelDataCache[modelId];

  let versions = [];
  try {
    const localRes = await fetch(`./updates/${modelId}.json`).catch(() => null);
    if (localRes && localRes.ok) {
      const data = await localRes.json();
      if (data && Array.isArray(data.versions)) {
        versions = data.versions;
      }
    }
  } catch (e) {}

  if (versions.length === 0) {
    const rawUrl = `https://raw.githubusercontent.com/ohhmax/maxnet/refs/heads/main/updates/${modelId}.json`;
    try {
      const res = await fetch(rawUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.versions)) {
          versions = data.versions;
        }
      }
    } catch (e) {
      console.error(`Failed to fetch updates/${modelId}.json from GitHub:`, e);
    }
  }

  // Filter ONLY tested === true
  const testedVersions = versions.filter(v => v.tested === true);
  if (testedVersions.length === 0) {
    modelDataCache[modelId] = [];
    return [];
  }

  // Sort by build descending to guarantee latest tested release first
  testedVersions.sort((a, b) => Number(b.build) - Number(a.build));
  modelDataCache[modelId] = testedVersions;
  return testedVersions;
}

// Toggle and close handlers for Custom Dropdown Model Selector
function toggleCustomModelDropdown() {
  closeCustomVersionDropdown();
  const dropdown = document.getElementById("customModelDropdown");
  const trigger = document.getElementById("customModelTrigger");
  if (!dropdown || !trigger) return;

  const isOpen = dropdown.classList.toggle("open");
  trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");

  if (isOpen) {
    const selectedItem = dropdown.querySelector(".custom-dropdown-item.selected");
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: "nearest" });
      selectedItem.focus();
    }
  }
}

function closeCustomModelDropdown() {
  const dropdown = document.getElementById("customModelDropdown");
  const trigger = document.getElementById("customModelTrigger");
  if (dropdown && dropdown.classList.contains("open")) {
    dropdown.classList.remove("open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }
}

// Toggle and close handlers for Custom Dropdown Version Selector (Right side of Model)
function toggleCustomVersionDropdown() {
  closeCustomModelDropdown();
  const dropdown = document.getElementById("customVersionDropdown");
  const trigger = document.getElementById("customVersionTrigger");
  if (!dropdown || !trigger) return;

  const isOpen = dropdown.classList.toggle("open");
  trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");

  if (isOpen) {
    const selectedItem = dropdown.querySelector(".custom-dropdown-item.selected");
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: "nearest" });
      selectedItem.focus();
    }
  }
}

function closeCustomVersionDropdown() {
  const dropdown = document.getElementById("customVersionDropdown");
  const trigger = document.getElementById("customVersionTrigger");
  if (dropdown && dropdown.classList.contains("open")) {
    dropdown.classList.remove("open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }
}

// Version Selection Change Handler
function selectVersion(ver) {
  if (!ver) return;
  selectedVersionTag = ver;
  closeCustomVersionDropdown();
  updateFirmwareView();
}

// Populate Custom Model Dropdown with All Known Models & Preserved Active Value
function populateModelDropdown() {
  const menu = document.getElementById("customModelMenu");
  const label = document.getElementById("customModelLabel");
  const hiddenInput = document.getElementById("modelSelect");
  if (!menu) return;

  const activeModel = KNOWN_MODELS.find(m => m.id === selectedModelId) || KNOWN_MODELS[0];
  if (label && activeModel) {
    label.textContent = `${activeModel.name} (${activeModel.platform})`;
  }
  if (hiddenInput && activeModel) {
    hiddenInput.value = activeModel.id;
  }

  menu.innerHTML = KNOWN_MODELS.map(m => {
    const isSelected = m.id === selectedModelId;
    return `
      <div class="custom-dropdown-item ${isSelected ? "selected" : ""}" role="option" aria-selected="${isSelected}" data-value="${m.id}" tabindex="0">
        <div class="dropdown-item-details">
          <span class="dropdown-item-name">${escapeHtml(m.name)}</span>
          <span class="dropdown-item-sub">${escapeHtml(m.soc)}</span>
        </div>
        <span class="dropdown-item-badge ${m.platform.toLowerCase()}">${escapeHtml(m.platform)}</span>
        <svg class="dropdown-item-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    `;
  }).join("");

  menu.querySelectorAll(".custom-dropdown-item").forEach(item => {
    const selectThis = () => {
      const modelId = item.getAttribute("data-value");
      handleModelChange(modelId);
      closeCustomModelDropdown();
    };
    item.addEventListener("click", selectThis);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectThis();
      }
    });
  });
}

// Real-time discovery of available models from raw updates/*.json
async function discoverAvailableModels() {
  const testedPromises = KNOWN_MODELS.map(async (model) => {
    const versions = await fetchTestedFirmware(model.id);
    const latestVersion = versions && versions.length > 0 ? versions[0] : null;
    return { model, versions, latestVersion };
  });

  const results = await Promise.all(testedPromises);

  availableModels = results
    .filter(item => item.versions && item.versions.length > 0)
    .map(item => item.model);

  // Sync footer version with the latest tested firmware build
  const allTestedVersions = results.flatMap(item => item.versions || []);
  if (allTestedVersions.length > 0) {
    allTestedVersions.sort((a, b) => Number(b.build) - Number(a.build));
    const highestVer = allTestedVersions[0]?.version;
    const footerVer = document.getElementById("footerVersion");
    if (footerVer && highestVer) {
      footerVer.textContent = highestVer.startsWith("v") ? highestVer : `v${highestVer}`;
    }
  }

  updateFirmwareView();
}

function compareSemver(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

// Render a clean, minimalist single-line file row: Label on left, size + SHA icon + Download icon on right
function renderFileRow({
  label,
  sizeStr,
  downloadUrl,
  sha256
}) {
  return `
    <div class="file-row">
      <span class="file-title">${escapeHtml(label)}</span>

      <div class="file-actions">
        ${sizeStr ? `<span class="file-size-tag">${escapeHtml(sizeStr)}</span>` : ""}
        ${sha256 ? `
          <button class="btn-icon-sha" onclick="copyChecksum('${escapeHtml(sha256)}', this)" title="Copy SHA-256">
            ${ICONS.sha256}
          </button>
        ` : ""}
        <a href="${downloadUrl}" class="btn-icon-download" download title="Download ${escapeHtml(label)}${sizeStr ? ` (${escapeHtml(sizeStr)})` : ''}">
          ${ICONS.download}
        </a>
      </div>
    </div>
  `;
}

const ROUTER_M_SVG_HTML = `
<svg class="maxnet-router-mark" style="width:46px;height:auto;" viewBox="85 50 310 245" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Loading MAXNET">
  <g class="router-m-group">
    <g fill="none" stroke-linecap="round">
      <circle class="wifi-dot mono-fill" cx="240" cy="144" r="6" />
      <path class="wifi-arc-1 mono-stroke" d="M 223 127 A 24 24 0 0 1 257 127" stroke-width="6.5" />
      <path class="wifi-arc-2 mono-stroke" d="M 210 114 A 42 42 0 0 1 270 114" stroke-width="6.5" />
      <path class="wifi-arc-3 mono-stroke" d="M 197 101 A 60 60 0 0 1 283 101" stroke-width="6.5" />
    </g>
    <rect class="mono-fill" x="126" y="56" width="17" height="48" rx="8.5" transform="rotate(-9 134.5 104)" />
    <rect class="mono-fill" x="337" y="56" width="17" height="48" rx="8.5" transform="rotate(9 345.5 104)" />
    <path class="mono-fill" d="M 108 248 L 130 112 L 160 112 L 240 196 L 320 112 L 350 112 L 372 248 L 340 248 L 324 148 L 240 230 L 156 148 L 140 248 Z" />
    <polygon class="cutout-fill" points="107,204 152,177 150,186 105,213" />
    <path class="data-pulse" d="M 144 126 L 240 214 L 336 126" />
    <rect class="mono-fill" x="94" y="244" width="292" height="38" rx="19" />
    <rect class="cutout-fill" x="122" y="259" width="36" height="8" rx="4" />
    <circle class="cutout-fill led-1" cx="314" cy="263" r="2.8" />
    <circle class="cutout-fill led-2" cx="327" cy="263" r="2.8" />
    <circle class="cutout-fill led-3" cx="340" cy="263" r="2.8" />
    <circle class="cutout-fill led-pwr" cx="356" cy="263" r="4.2" />
    <rect class="mono-fill" x="128" y="285" width="26" height="4" rx="2" />
    <rect class="mono-fill" x="326" y="285" width="26" height="4" rx="2" />
  </g>
</svg>`;

// Render active model details in Firmware tab: Open, simple firmware download flow
async function updateFirmwareView() {
  const container = document.getElementById("firmwareContainer");
  if (!container) return;

  const model = KNOWN_MODELS.find(m => m.id === selectedModelId) || { id: selectedModelId, name: selectedModelId.toUpperCase(), soc: "IDU Router", hasFactory: false };
  const isQualcomm = QUALCOMM_MODELS.includes(model.id.toLowerCase());

  container.innerHTML = `
    <div class="inline-logo-loader">
      ${ROUTER_M_SVG_HTML}
      <span style="font-size: 11px; font-family: ui-monospace, monospace; letter-spacing: 2px; color: var(--text-muted); font-weight: 700;">FETCHING FIRMWARE...</span>
    </div>
  `;

  const testedVersions = await fetchTestedFirmware(selectedModelId);

  if (!testedVersions || testedVersions.length === 0) {
    container.innerHTML = `
      <div class="empty-unavailable-wrap">
        <span class="empty-unavailable-text">Unavailable</span>
      </div>
    `;
    return;
  }

  // Active version is selectedVersionTag or index 0 (latest)
  if (!selectedVersionTag || !testedVersions.some(v => v.version === selectedVersionTag)) {
    selectedVersionTag = testedVersions[0].version;
  }
  const version = testedVersions.find(v => v.version === selectedVersionTag) || testedVersions[0];
  const isLatest = testedVersions.indexOf(version) === 0;

  // Release base URL & individual file resolution
  const baseReleaseUrl = version.url ? version.url.substring(0, version.url.lastIndexOf("/")) : "";
  const releaseTagMatch = version.url ? version.url.match(/releases\/download\/([^/]+)/) : null;
  const releaseTag = releaseTagMatch ? releaseTagMatch[1] : "";

  // Each file has its OWN distinct SHA-256 hash
  const sysupgradeName = version.url ? version.url.split("/").pop() : `maxnet-${model.id}-sysupgrade.bin`;
  const sysupgradeSha = version.sha256 || "";
  const sizeStr = formatBytes(version.size);

  const factoryName = `maxnet-${model.id}-factory.ubi`;
  const factorySha = version.factory_sha256 || KNOWN_FACTORY_CHECKSUMS[releaseTag] || "";
  const ubiUrl = version.factory_url || `${baseReleaseUrl}/${factoryName}`;
  const hasFactory = Boolean(model.hasFactory && version.url);

  container.innerHTML = `
    <div class="firmware-open-flow">

      <!-- Clean Firmware Header: Version Selector only -->
      <div class="firmware-open-header">
        <!-- Custom Dropdown Version Selector (Inside Firmware Section) -->
        <div class="custom-model-dropdown custom-version-dropdown" id="customVersionDropdown">
          <button type="button" class="custom-dropdown-trigger" id="customVersionTrigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Select Firmware Version">
            <svg class="model-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span class="custom-dropdown-label" id="customVersionLabel">v${escapeHtml(version.version)}${isLatest ? " (Latest)" : ""}</span>
            <svg class="custom-dropdown-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="custom-dropdown-menu" id="customVersionMenu" role="listbox" aria-label="Firmware Versions">
            ${testedVersions.map((v, idx) => {
              const isSel = v.version === version.version;
              const isVerLatest = idx === 0;
              return `
                <div class="custom-dropdown-item ${isSel ? "selected" : ""}" 
                     data-value="${escapeHtml(v.version)}" 
                     role="option" 
                     aria-selected="${isSel ? "true" : "false"}" 
                     tabindex="0">
                  <div class="dropdown-item-details">
                    <span class="dropdown-item-name">v${escapeHtml(v.version)}</span>
                    <span class="dropdown-item-sub">Tested &bull; ${formatBytes(v.size)}</span>
                  </div>
                  <span class="dropdown-item-badge ${isVerLatest ? "qualcomm" : ""}">${isVerLatest ? "Latest" : "Build #" + v.build}</span>
                  <svg class="dropdown-item-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              `;
            }).join("")}
          </div>
          <input type="hidden" id="versionSelect" value="${escapeHtml(version.version)}" />
        </div>
      </div>

      <!-- Open Files Section: Icon-Only Action Buttons for SHA Copy & Download -->
      <div class="firmware-open-files">

        <!-- File 1: Sysupgrade Firmware -->
        <div class="firmware-file-block">
          <div class="firmware-file-main">
            <div class="firmware-file-meta">
              <span class="firmware-file-title">Sysupgrade Firmware</span>
              <span class="firmware-file-name">${escapeHtml(sysupgradeName)}</span>
              <span class="firmware-file-size">${sizeStr}</span>
            </div>
            <div class="firmware-file-actions">
              ${sysupgradeSha ? `
              <button type="button" class="btn-file-action-icon btn-icon-sha" onclick="copyChecksum('${escapeHtml(sysupgradeSha)}', this)" title="Copy SHA-256 Checksum" aria-label="Copy SHA-256 Checksum">
                ${ICONS.sha256}
              </button>
              ` : ''}
              <a href="${version.url}" class="btn-file-action-icon btn-file-dl-icon" download title="Download ${escapeHtml(sysupgradeName)}" aria-label="Download ${escapeHtml(sysupgradeName)}">
                ${ICONS.download}
              </a>
            </div>
          </div>
        </div>

        ${hasFactory ? `
        <!-- File 2: Factory Installation UBI (Stock Migration) -->
        <div class="firmware-file-block">
          <div class="firmware-file-main">
            <div class="firmware-file-meta">
              <span class="firmware-file-title">Factory Installation Image (UBI)</span>
              <span class="firmware-file-name">${escapeHtml(factoryName)}</span>
              <span class="firmware-file-size">Stock Migration</span>
            </div>
            <div class="firmware-file-actions">
              ${factorySha ? `
              <button type="button" class="btn-file-action-icon btn-icon-sha" onclick="copyChecksum('${escapeHtml(factorySha)}', this)" title="Copy SHA-256 Checksum" aria-label="Copy SHA-256 Checksum">
                ${ICONS.sha256}
              </button>
              ` : ''}
              <a href="${ubiUrl}" class="btn-file-action-icon btn-file-dl-icon" download title="Download ${escapeHtml(factoryName)}" aria-label="Download ${escapeHtml(factoryName)}">
                ${ICONS.download}
              </a>
            </div>
          </div>
        </div>
        ` : ''}

      </div>
    </div>
  `;

  // Attach event listener for Version Dropdown Trigger
  const trigger = document.getElementById("customVersionTrigger");
  if (trigger) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCustomVersionDropdown();
    });
  }

  // Attach event listeners for Version Dropdown Items
  const menu = document.getElementById("customVersionMenu");
  if (menu) {
    menu.querySelectorAll(".custom-dropdown-item").forEach(item => {
      const selectThis = () => {
        const ver = item.getAttribute("data-value");
        selectVersion(ver);
      };
      item.addEventListener("click", selectThis);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectThis();
        }
      });
    });
  }
}

// Render Flashing Guide: All Qualcomm models share the verified IPQ9574 guide, MediaTek is Coming Soon
function renderFlashingGuide(modelId) {
  const guideArea = document.getElementById("guideContentArea");
  if (!guideArea) return;

  const model = KNOWN_MODELS.find(m => m.id === modelId) || { id: modelId, name: modelId.toUpperCase() };
  const isQualcomm = QUALCOMM_MODELS.includes(model.id.toLowerCase());

  // All Qualcomm devices (JIDU6911, JIDU6811, JIDU6611, JIDU6411, JIDU6111) share the verified IPQ9574 flashing method
  if (isQualcomm) {
    guideArea.innerHTML = `
      <div class="guide-flow">
        <!-- Step 1: Prerequisites & PC Setup -->
        <div class="guide-step-section">
          <div class="step-head-hero">
            <span class="step-giant-num">1</span>
            <div class="step-hero-title">
              <h2 class="step-heading">
                <span>PREREQUISITES</span>
                ${ICONS.tools}
              </h2>
            </div>
          </div>
          
          <p class="step-desc-mono">Required Hardware:</p>
          <ul class="clean-list">
            <li>Jio AirFiber IDU Router (<strong>${escapeHtml(model.name)}</strong>)</li>
            <li>USB-to-UART 3.3V Serial Adapter (CP2102, CH340, FT232, PL2303)</li>
            <li>Ethernet Cable (Cat5e / Cat6)</li>
            <li>Linux PC (Ubuntu / Debian / Fedora / Arch)</li>
          </ul>

          <p class="step-desc-mono" style="margin-top: 14px;">Install Required Tools:</p>
          
          <div class="distro-badge">
            ${ICONS.debian}
            <span>Ubuntu / Debian</span>
          </div>
          <div class="cmd-box-3d">
            <code>sudo apt update &amp;&amp; sudo apt install -y minicom tftpd-hpa curl</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <div class="distro-badge">
            ${ICONS.arch}
            <span>Arch Linux</span>
          </div>
          <div class="cmd-box-3d">
            <code>sudo pacman -Syu --needed minicom tftp-hpa curl</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <p class="step-desc-mono" style="margin-top: 14px;">Grant Permanent Serial Port Permissions:</p>

          <div class="distro-badge">
            ${ICONS.debian}
            <span>Ubuntu / Debian</span>
          </div>
          <div class="cmd-box-3d">
            <code>echo 'KERNEL=="ttyUSB*", MODE="0666", GROUP="dialout"' | sudo tee /etc/udev/rules.d/99-ttyusb.rules &amp;&amp; sudo usermod -aG dialout,tty $USER &amp;&amp; sudo udevadm control --reload-rules &amp;&amp; sudo udevadm trigger</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <div class="distro-badge">
            ${ICONS.arch}
            <span>Arch Linux</span>
          </div>
          <div class="cmd-box-3d">
            <code>echo 'KERNEL=="ttyUSB*", MODE="0666", GROUP="uucp"' | sudo tee /etc/udev/rules.d/99-ttyusb.rules &amp;&amp; sudo usermod -aG uucp,tty $USER &amp;&amp; sudo udevadm control --reload-rules &amp;&amp; sudo udevadm trigger</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <div class="step-indicator-bar" aria-hidden="true"></div>
        </div>

        <!-- Step 2: Hardware Serial UART Connection -->
        <div class="guide-step-section">
          <div class="step-head-hero">
            <span class="step-giant-num">2</span>
            <div class="step-hero-title">
              <h2 class="step-heading">
                <span>SERIAL UART</span>
                ${ICONS.plug}
              </h2>
            </div>
          </div>

          <p class="step-desc-mono">Header Pin Connections (Mobile-Fit Matrix):</p>
          <div class="uart-pin-matrix">
            <div class="pin-pair">
              <span class="pin-badge usb">USB GND</span>
              <span class="pin-connector">&harr;</span>
              <span class="pin-badge router">ROUTER GND</span>
            </div>
            <div class="pin-pair">
              <span class="pin-badge usb">USB TX</span>
              <span class="pin-connector">&rarr;</span>
              <span class="pin-badge router">ROUTER RX</span>
            </div>
            <div class="pin-pair">
              <span class="pin-badge usb">USB RX</span>
              <span class="pin-connector">&larr;</span>
              <span class="pin-badge router">ROUTER TX</span>
            </div>
          </div>

          <div class="notice-3d">
            <strong>Critical:</strong> Do NOT connect the VCC (3.3V / 5V) pin. Power router using its original 12V DC wall adapter only.
          </div>

          <p class="step-desc-mono" style="margin-top: 10px;">Open Serial Console:</p>
          <div class="cmd-box-3d">
            <code>minicom -D /dev/ttyUSB0 -b 115200</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <div class="step-indicator-bar" aria-hidden="true"></div>
        </div>

        <!-- Step 3: U-Boot Credentials Retrieval -->
        <div class="guide-step-section">
          <div class="step-head-hero">
            <span class="step-giant-num">3</span>
            <div class="step-hero-title">
              <h2 class="step-heading">
                <span>U-BOOT AUTH</span>
                ${ICONS.key}
              </h2>
            </div>
          </div>

          <p class="step-desc-mono">Console Login Formula:</p>
          <ul class="clean-list">
            <li><strong>Username</strong>: Last 8 digits of RSN printed on router barcode sticker.</li>
            <li><strong>Password</strong>: Reverse of username digits + 8-character suffix (e.g. <code>9rOL8bjr</code> or <code>pYunNk45</code>).</li>
          </ul>

          <p class="step-desc-mono" style="margin-top: 10px;">Extract Directly from Stock SSH (if accessible):</p>
          <div class="cmd-box-3d">
            <code>gm_factory_init.sh get uboot_passwd</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>
          <div class="cmd-box-3d">
            <code>/usr/bin/jioMfgData get ubootPasswd</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>
          <div class="cmd-box-3d">
            <code>strings /dev/mtd7 | grep -i pass</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <div class="step-indicator-bar" aria-hidden="true"></div>
        </div>

        <!-- Step 4: Safe RAM Boot via TFTP -->
        <div class="guide-step-section">
          <div class="step-head-hero">
            <span class="step-giant-num">4</span>
            <div class="step-hero-title">
              <h2 class="step-heading">
                <span>TFTP RAMBOOT</span>
                ${ICONS.ram}
              </h2>
            </div>
          </div>

          <p class="step-desc-mono">Configure Static IP on PC (Connect Ethernet to LAN port):</p>
          <div class="cmd-box-3d">
            <code>sudo ip addr flush dev eth0 &amp;&amp; sudo ip addr add 192.168.1.2/24 dev eth0 &amp;&amp; sudo ip link set eth0 up</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <p class="step-desc-mono" style="margin-top: 14px;">Download RAM Boot Image to PC TFTP Server:</p>
          
          <div class="distro-badge">
            ${ICONS.debian}
            <span>Ubuntu / Debian</span>
          </div>
          <div class="cmd-box-3d">
            <code>sudo mkdir -p /srv/tftp &amp;&amp; sudo chmod -R 777 /srv/tftp &amp;&amp; sudo curl -sL https://github.com/ohhmax/maxnet/releases/latest/download/maxnet-${escapeHtml(model.id)}-initramfs.itb -o /srv/tftp/initramfs.itb &amp;&amp; sudo systemctl restart tftpd-hpa</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <div class="distro-badge">
            ${ICONS.arch}
            <span>Arch Linux</span>
          </div>
          <div class="cmd-box-3d">
            <code>sudo mkdir -p /srv/tftp &amp;&amp; sudo chmod -R 777 /srv/tftp &amp;&amp; sudo curl -sL https://github.com/ohhmax/maxnet/releases/latest/download/maxnet-${escapeHtml(model.id)}-initramfs.itb -o /srv/tftp/initramfs.itb &amp;&amp; sudo systemctl restart tftpd.service</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <p class="step-desc-mono" style="margin-top: 14px;">At the <code>IPQ9574#</code> prompt, enter commands one by one:</p>
          <div class="cmd-box-3d">
            <code>setenv ipaddr 192.168.1.10</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>
          <div class="cmd-box-3d">
            <code>setenv serverip 192.168.1.2</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>
          <div class="cmd-box-3d">
            <code>dcache off; icache off</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>
          <div class="cmd-box-3d">
            <code>setenv fdt_high</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>
          <div class="cmd-box-3d">
            <code>setenv initrd_high</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>
          <div class="cmd-box-3d">
            <code>setenv bootargs "console=ttyMSM0,115200n8 earlycon"</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>
          <div class="cmd-box-3d">
            <code>tftpboot 0x46000000 initramfs.itb</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>
          <div class="cmd-box-3d">
            <code>bootm 0x46000000</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <div class="step-indicator-bar" aria-hidden="true"></div>
        </div>

        <!-- Step 5: Accessing Maxnet -->
        <div class="guide-step-section">
          <div class="step-head-hero">
            <span class="step-giant-num">5</span>
            <div class="step-hero-title">
              <h2 class="step-heading">
                <span>SYSTEM ACCESS</span>
                ${ICONS.wifi}
              </h2>
            </div>
          </div>

          <p class="step-desc-mono">Within 10 seconds of RAM booting:</p>
          <ul class="clean-list">
            <li><strong>Web Interface</strong>: <a href="http://10.0.0.1" target="_blank" style="text-decoration: underline; color: var(--text-main);">http://10.0.0.1</a> (or <code>http://10.0.0.254</code>) &bull; No password</li>
            <li><strong>SSH Terminal</strong>: <code>ssh root@10.0.0.1</code> (no password)</li>
            <li><strong>Wi-Fi SSIDs</strong>: <code>MAXNET</code> (2.4 GHz) and <code>MAXNET-5G</code> (5 GHz) (No Password)</li>
          </ul>

          <div class="step-indicator-bar" aria-hidden="true"></div>
        </div>

        <!-- Step 6: Permanent Flash Installation -->
        <div class="guide-step-section">
          <div class="step-head-hero">
            <span class="step-giant-num">6</span>
            <div class="step-hero-title">
              <h2 class="step-heading">
                <span>FLASH INSTALL</span>
                ${ICONS.shield}
              </h2>
            </div>
          </div>

          <p class="step-desc-mono">Transfer Sysupgrade from PC to Router:</p>
          <div class="cmd-box-3d">
            <code>cat maxnet-${escapeHtml(model.id)}-sysupgrade.bin | ssh root@10.0.0.1 "cat > /tmp/sysupgrade.bin"</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <p class="step-desc-mono" style="margin-top: 10px;">Execute Sysupgrade on Router Terminal:</p>
          <div class="cmd-box-3d">
            <code>sysupgrade -F -v -n /tmp/sysupgrade.bin</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <div class="notice-3d" style="margin-top: 12px;">
            <strong>Warning:</strong> Always verify model matches before flashing. Never execute <code>sysupgrade -F</code> using an image built for a different board model.
          </div>

          <p class="step-desc-mono" style="margin-top: 16px;">Configure Permanent U-Boot Autoboot (At <code>IPQ9574#</code> prompt):</p>
          <div class="cmd-box-3d">
            <code>setenv bootcmd "ubi part ubi; ubi read 0x44000000 kernel; bootm 0x44000000"</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>
          <div class="cmd-box-3d">
            <code>setenv fdt_high &amp;&amp; setenv initrd_high &amp;&amp; saveenv &amp;&amp; reset</code>
            <button class="cmd-copy-3d" onclick="copySnippet(this)">
              ${ICONS.copy}
              <span>Copy</span>
            </button>
          </div>

          <div class="step-indicator-bar" aria-hidden="true"></div>
        </div>
      </div>
    `;
  } else {
    // Unsupported / Unreleased Guide: Simply show "Unavailable" and nothing else
    guideArea.innerHTML = `
      <div class="empty-unavailable-wrap">
        <span class="empty-unavailable-text">Unavailable</span>
      </div>
    `;
  }
}

// Universal snippet text copy (for UPI ID, specific tokens, etc.)
window.copySnippetText = function(text, btn) {
  if (!text) return;
  const originalHtml = btn.innerHTML;
  const doFeedback = () => {
    btn.innerHTML = `${ICONS.check} <span>Copied</span>`;
    btn.classList.add("copied");
    setTimeout(() => {
      btn.innerHTML = originalHtml;
      btn.classList.remove("copied");
    }, 2000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(doFeedback).catch(() => {
      fallbackCopy(text);
      doFeedback();
    });
  } else {
    fallbackCopy(text);
    doFeedback();
  }
};

// Copy SHA-256 Checksum (Icon-only button)
window.copyChecksum = function(text, btn) {
  const original = btn.innerHTML;
  const originalTitle = btn.getAttribute("title") || "";
  const doFeedback = () => {
    btn.innerHTML = ICONS.check;
    btn.classList.add("copied");
    btn.setAttribute("title", "Copied SHA-256!");
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove("copied");
      btn.setAttribute("title", originalTitle);
    }, 2000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(doFeedback).catch(() => {
      fallbackCopy(text);
      doFeedback();
    });
  } else {
    fallbackCopy(text);
    doFeedback();
  }
}

// Universal command copy button handler
window.copySnippet = function(btn) {
  const box = btn.closest(".cmd-box-3d") || btn.closest(".cmd-box");
  const codeEl = box ? box.querySelector("code") : null;
  const text = codeEl ? codeEl.innerText.trim() : "";
  if (!text) return;

  const originalContent = btn.innerHTML;
  const doFeedback = () => {
    btn.innerHTML = `${ICONS.check} <span>Copied</span>`;
    btn.classList.add("copied");
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.classList.remove("copied");
    }, 2000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(doFeedback).catch(() => {
      fallbackCopy(text);
      doFeedback();
    });
  } else {
    fallbackCopy(text);
    doFeedback();
  }
};

function fallbackCopy(text) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand("copy");
  } catch (e) {}
  document.body.removeChild(input);
}

// Tab Switching (What is Maxnet? | Firmware | Flashing Guide)
window.switchTab = function(tabId) {
  const tabBtnWhatIs = document.getElementById("tabBtnWhatIs");
  const tabBtnDownloads = document.getElementById("tabBtnDownloads");
  const tabBtnGuide = document.getElementById("tabBtnGuide");
  
  const secWhatIs = document.getElementById("sectionWhatIs");
  const secDownloads = document.getElementById("sectionDownloads");
  const secGuide = document.getElementById("sectionGuide");

  // Deactivate all tabs and contents
  [tabBtnWhatIs, tabBtnDownloads, tabBtnGuide].forEach(btn => btn && btn.classList.remove("active"));
  [secWhatIs, secDownloads, secGuide].forEach(sec => sec && sec.classList.remove("active"));

  if (tabId === "guide") {
    if (tabBtnGuide) tabBtnGuide.classList.add("active");
    if (secGuide) secGuide.classList.add("active");
    window.location.hash = "guide";
  } else if (tabId === "downloads" || tabId === "firmware") {
    if (tabBtnDownloads) tabBtnDownloads.classList.add("active");
    if (secDownloads) secDownloads.classList.add("active");
    window.location.hash = selectedModelId || "firmware";
  } else {
    // Default: Overview
    if (tabBtnWhatIs) tabBtnWhatIs.classList.add("active");
    if (secWhatIs) secWhatIs.classList.add("active");
    window.location.hash = "overview";
  }

  // Smooth scroll adjustment if viewport is scrolled down past toolbar
  const navToolbar = document.querySelector(".top-nav-toolbar");
  if (navToolbar && window.scrollY > navToolbar.offsetTop + 40) {
    window.scrollTo({
      top: Math.max(0, navToolbar.offsetTop - 12),
      behavior: "smooth"
    });
  }
};

// Model Selection Change Handler
function handleModelChange(newModelId) {
  if (!newModelId) return;
  selectedModelId = newModelId.toLowerCase();
  selectedVersionTag = null; // Default to latest version of new model
  localStorage.setItem(STORAGE_KEY_MODEL, selectedModelId);

  // Sync hidden input for backwards compatibility
  const modelSelect = document.getElementById("modelSelect");
  if (modelSelect && modelSelect.value !== selectedModelId) {
    modelSelect.value = selectedModelId;
  }

  // Sync custom dropdown trigger label
  const activeModel = KNOWN_MODELS.find(m => m.id === selectedModelId);
  const label = document.getElementById("customModelLabel");
  if (label && activeModel) {
    label.textContent = `${activeModel.name} (${activeModel.platform})`;
  }

  // Sync custom dropdown menu item states
  const menu = document.getElementById("customModelMenu");
  if (menu) {
    menu.querySelectorAll(".custom-dropdown-item").forEach(item => {
      const isSel = item.getAttribute("data-value") === selectedModelId;
      item.classList.toggle("selected", isSel);
      item.setAttribute("aria-selected", isSel ? "true" : "false");
    });
  }

  // Update hash only if on downloads tab
  const secDownloads = document.getElementById("sectionDownloads");
  if (secDownloads && secDownloads.classList.contains("active")) {
    window.location.hash = selectedModelId;
  }

  updateFirmwareView();
  renderFlashingGuide(selectedModelId);
}

// Convert timestamp or ISO date to clean relative string ("1 day ago", "2 days ago", "1 week ago", "1 month ago")
function formatTimeAgo(timeVal) {
  if (!timeVal) return "1 day ago";
  let epochSec = 0;
  if (typeof timeVal === "number") {
    epochSec = timeVal > 1e11 ? Math.floor(timeVal / 1000) : timeVal;
  } else {
    epochSec = Math.floor(new Date(timeVal).getTime() / 1000);
  }
  if (isNaN(epochSec) || epochSec <= 0) return "1 day ago";

  const nowSec = Math.floor(Date.now() / 1000);
  const diff = Math.max(0, nowSec - epochSec);

  if (diff < 60) return "just now";
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return `${m} min${m > 1 ? "s" : ""} ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h} hour${h > 1 ? "s" : ""} ago`;
  }
  if (diff < 7 * 86400) {
    const d = Math.floor(diff / 86400);
    return `${d} ${d === 1 ? "day" : "days"} ago`;
  }
  if (diff < 30 * 86400) {
    const w = Math.floor(diff / (7 * 86400));
    return `${w} ${w === 1 ? "week" : "weeks"} ago`;
  }
  if (diff < 365 * 86400) {
    const mo = Math.floor(diff / (30 * 86400));
    return `${mo} ${mo === 1 ? "month" : "months"} ago`;
  }
  const y = Math.floor(diff / (365 * 86400));
  return `${y} ${y === 1 ? "year" : "years"} ago`;
}

// Fetch GitHub activity last seen timestamp & version from raw seen.json (No api.github.com)
async function fetchLastSeenActivity() {
  const lastSeenEl = document.getElementById("lastSeenValue");
  const footerVersionEl = document.getElementById("footerVersion");
  const footerYearEl = document.getElementById("footerYear");

  if (footerYearEl) {
    footerYearEl.textContent = new Date().getFullYear();
  }

  const applySeenData = (data) => {
    if (!data) return;
    const timeVal = data.timestamp || data.last_seen;
    if (lastSeenEl && timeVal) {
      lastSeenEl.textContent = formatTimeAgo(timeVal);
      if (data.last_seen_formatted) {
        lastSeenEl.setAttribute("title", data.last_seen_formatted);
      }
    }
    if (footerVersionEl && data.latest_version) {
      const v = data.latest_version.startsWith("v") ? data.latest_version : `v${data.latest_version}`;
      footerVersionEl.textContent = v;
    }
  };

  const rawUrl = "https://raw.githubusercontent.com/ohhmax/maxnet/refs/heads/main/seen.json";
  try {
    const res = await fetch(rawUrl);
    if (res.ok) {
      const data = await res.json();
      applySeenData(data);
      return;
    }
  } catch (e) {
    console.warn("Could not fetch remote seen.json:", e);
  }

  // Fallback to local seen.json if remote fails
  try {
    const localRes = await fetch("./seen.json");
    if (localRes.ok) {
      const data = await localRes.json();
      applySeenData(data);
      return;
    }
  } catch (e) {}

  if (lastSeenEl && !lastSeenEl.textContent) {
    lastSeenEl.textContent = "1 day ago";
  }
}

// Modern interactive custom cursor (mouse/trackpad only, disabled on touchscreens)
function initCustomCursor() {
  if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  let dot = document.querySelector(".custom-cursor-dot");
  let ring = document.querySelector(".custom-cursor-ring");

  if (!dot) {
    dot = document.createElement("div");
    dot.className = "custom-cursor-dot";
    document.body.appendChild(dot);
  }

  if (!ring) {
    ring = document.createElement("div");
    ring.className = "custom-cursor-ring";
    document.body.appendChild(ring);
  }

  document.documentElement.classList.add("custom-cursor-active");

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovered = false;
  let isTextHover = false;
  let isMouseDown = false;
  let isVisible = false;

  function renderCursor() {
    if (isVisible) {
      // 0ms input lag direct translation for the precision center dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) ${isMouseDown ? "scale(1.4)" : isHovered ? "scale(0.6)" : "scale(1)"}`;

      // Smooth physics lerp interpolation for the follower ring
      const lerp = 0.22;
      ringX += (mouseX - ringX) * lerp;
      ringY += (mouseY - ringY) * lerp;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      ringX = mouseX;
      ringY = mouseY;
      dot.classList.add("visible");
      ring.classList.add("visible");
    }

    const target = e.target;
    if (target) {
      const isInput = target.closest("input[type='text'], input[type='search'], input[type='password'], textarea");
      const isInteractive = target.closest("a, button, input[type='button'], input[type='submit'], [role='button'], .custom-dropdown-trigger, .custom-dropdown-item, .tab-btn, .btn-firmware-dl, .btn-copy-sha-inline, .cmd-box-3d, .btn-theme-toggle, .footer-icon-link");

      if (isInput) {
        if (!isTextHover) {
          isTextHover = true;
          isHovered = false;
          ring.classList.add("text-hover");
          dot.classList.add("text-hover");
          ring.classList.remove("hovered");
          dot.classList.remove("hovered");
        }
      } else if (isInteractive) {
        if (!isHovered) {
          isHovered = true;
          isTextHover = false;
          ring.classList.add("hovered");
          dot.classList.add("hovered");
          ring.classList.remove("text-hover");
          dot.classList.remove("text-hover");
        }
      } else {
        if (isHovered || isTextHover) {
          isHovered = false;
          isTextHover = false;
          ring.classList.remove("hovered", "text-hover");
          dot.classList.remove("hovered", "text-hover");
        }
      }
    }
  }, { passive: true });

  window.addEventListener("mousedown", () => {
    isMouseDown = true;
    ring.classList.add("active");
    dot.classList.add("active");
  });

  window.addEventListener("mouseup", () => {
    isMouseDown = false;
    ring.classList.remove("active");
    dot.classList.remove("active");
  });

  document.addEventListener("mouseleave", () => {
    isVisible = false;
    dot.classList.remove("visible");
    ring.classList.remove("visible");
  });

  document.addEventListener("mouseenter", () => {
    isVisible = true;
    dot.classList.add("visible");
    ring.classList.add("visible");
  });
}

// Initialization
async function initApp() {
  applyTheme(currentTheme);
  initCustomCursor();

  // Set current auto-updating year
  const footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Legal Modal Dialog controls
  const legalModal = document.getElementById("legalModal");
  const legalTrigger = document.getElementById("legalModalTrigger");
  const legalClose = document.getElementById("legalModalCloseBtn");
  const legalUnderstood = document.getElementById("legalModalUnderstoodBtn");

  if (legalModal) {
    if (legalTrigger) {
      legalTrigger.addEventListener("click", () => legalModal.showModal());
    }
    if (legalClose) {
      legalClose.addEventListener("click", () => legalModal.close());
    }
    if (legalUnderstood) {
      legalUnderstood.addEventListener("click", () => legalModal.close());
    }
    legalModal.addEventListener("click", (e) => {
      const rect = legalModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        legalModal.close();
      }
    });
  }

  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  // Smooth scroll to top when clicking brand
  const brandEl = document.querySelector(".brand");
  if (brandEl) {
    brandEl.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    brandEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Populate custom model dropdown with persistent selected model
  populateModelDropdown();

  // Custom Dropdown Trigger Toggle
  const customTrigger = document.getElementById("customModelTrigger");
  if (customTrigger) {
    customTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCustomModelDropdown();
    });
  }

  // Close custom dropdown when clicking outside
  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("customModelDropdown");
    if (dropdown && !dropdown.contains(e.target)) {
      closeCustomModelDropdown();
    }
  });

  // Close custom dropdown on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCustomModelDropdown();
      closeCustomVersionDropdown();
    }
  });

  // Close custom version dropdown when clicking outside
  document.addEventListener("click", (e) => {
    const vDropdown = document.getElementById("customVersionDropdown");
    if (vDropdown && !vDropdown.contains(e.target)) {
      closeCustomVersionDropdown();
    }
  });

  const modelSelect = document.getElementById("modelSelect");
  if (modelSelect) {
    modelSelect.value = selectedModelId;
  }

  // Attach tab navigation button listeners
  const tabBtnWhatIs = document.getElementById("tabBtnWhatIs");
  const tabBtnDownloads = document.getElementById("tabBtnDownloads");
  const tabBtnGuide = document.getElementById("tabBtnGuide");

  if (tabBtnWhatIs) {
    tabBtnWhatIs.addEventListener("click", () => switchTab("overview"));
  }
  if (tabBtnDownloads) {
    tabBtnDownloads.addEventListener("click", () => switchTab("downloads"));
  }
  if (tabBtnGuide) {
    tabBtnGuide.addEventListener("click", () => switchTab("guide"));
  }

  // Smooth scroll handler for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href").replace("#", "");
      if (!targetId || targetId === "overview" || targetId === "downloads" || targetId === "guide") return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Determine initial tab: Default is always "overview" unless hash explicitly asks for another tab/model
  let initialTab = "overview";
  if (window.location.hash) {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash === "guide") {
      initialTab = "guide";
    } else if (hash === "downloads" || hash === "firmware") {
      initialTab = "downloads";
    } else if (KNOWN_MODELS.some(m => m.id === hash)) {
      selectedModelId = hash;
      localStorage.setItem(STORAGE_KEY_MODEL, selectedModelId);
      if (modelSelect) modelSelect.value = selectedModelId;
      initialTab = "downloads";
    } else if (hash === "overview" || hash === "whatis" || hash === "about") {
      initialTab = "overview";
    }
  }

  // Initial renders
  renderFlashingGuide(selectedModelId);
  updateFirmwareView();

  // Set active tab (Default is "whatis")
  switchTab(initialTab);

  // Fetch GitHub activity last seen timestamp from raw seen.json
  fetchLastSeenActivity();

  // Discover real-time available models from GitHub raw updates/*.json
  await discoverAvailableModels();

  // Dismiss page loader once initialized
  dismissPageLoader();
}

// Page loader dismiss helper
function dismissPageLoader() {
  const loader = document.getElementById("maxnetPageLoader");
  if (loader && !loader.classList.contains("loaded")) {
    loader.classList.add("loaded");
  }
}

window.addEventListener("load", () => {
  setTimeout(dismissPageLoader, 200);
});
setTimeout(dismissPageLoader, 1400);

document.addEventListener("DOMContentLoaded", initApp);
