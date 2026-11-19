(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`
</head>
<body>

  <!-- ==================== 1. FULL-PAGE MONOCHROME MINIMALIST LOGIN ==================== -->
  <div id="loginScreen" style="display:none; min-height:100vh; width:100%; flex-direction:column; justify-content:space-between; padding:28px 24px; background:var(--bg, #090b10); box-sizing:border-box;">

    <!-- TOP BAR -->
    <div style="display:flex; align-items:center; justify-content:space-between; width:100%; max-width:1160px; margin:0 auto;">
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span id="loginDeviceHostTitle" style="font-size:15px; font-weight:900; letter-spacing:1.5px; font-family:var(--font-mono); color:var(--text-main); text-transform:uppercase;">MAXNET-GATEWAY</span>
      </div>
      <button onclick="toggleTheme()" class="btn-header-action" title="Toggle Theme">
        <svg class="svg-icon" viewBox="0 0 24 24" style="width:14px; height:14px;"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.07" x2="5.64" y2="17.66"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
    </div>

    <!-- CENTER LOGIN MODULE -->
    <div style="width:100%; max-width:340px; margin:auto; padding:20px 0; display:flex; flex-direction:column; gap:16px;">
      <div style="text-align:center; margin-bottom:4px;">
        <h2 style="font-size:22px; font-weight:900; font-family:var(--font-mono); color:var(--text-main); margin:0; letter-spacing:1px; text-transform:uppercase;">Login</h2>
      </div>

      <div id="loginErrMsg" style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; color:#ef4444; font-size:11px; padding:9px 12px; border-radius:6px; text-align:center; display:none; font-family:var(--font-mono);"></div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <div class="mh-form-group" style="margin:0;">
          <label class="mh-label" style="font-size:10px; text-transform:uppercase; letter-spacing:0.8px;">Username</label>
          <input type="text" class="mh-input" id="loginUser" value="root" autocomplete="username" style="width:100%; box-sizing:border-box;">
        </div>
        <div class="mh-form-group" style="margin:0;">
          <label class="mh-label" style="font-size:10px; text-transform:uppercase; letter-spacing:0.8px;">Password</label>
          <input type="password" class="mh-input" id="loginPass" placeholder="Enter administrator password" autocomplete="current-password" onkeydown="if(event.key==='Enter')submitLogin()" style="width:100%; box-sizing:border-box;">
          <div id="loginRootPassHint" style="display:none; color:#f59e0b; font-size:10.5px; line-height:1.45; font-family:var(--font-mono);">No router password is set. Leave this field blank and log in as root.</div>
        </div>
      </div>

      <button class="login-submit-btn" onclick="submitLogin()" style="margin-top:4px;">
        LOGIN
      </button>
    </div>

    <!-- CLEAN EMPTY FOOTER PLACEHOLDER (NO BOTTOM BAR) -->
    <div style="display:none;" id="loginFooter">
      <div id="loginDevicesList"></div>
      <div id="loginHealthContainer"><span id="loginHealthDot"></span><span id="loginOverallHealthBadge">GOOD</span></div>
      <div id="loginSnapshotTs"></div>
    </div>

  </div>

  <!-- ==================== 2. MAIN DASHBOARD VIEWPORT ==================== -->
  <div class="app-viewport" id="dashboardContainer" style="display:none;">

    <!-- ==================== TAB 1: OVERVIEW ==================== -->
    <div id="tabOverview" class="tab-page">
      <div class="usb-bw-container">

        <!-- TOP BAR: Host Brand Meta on Left, Canvas Controls on Right (Zero Canvas Overlap) -->
        <div class="topo-top-bar" id="persistentTopBar">
          <div class="topo-brand-meta">
            <div class="topo-brand-text-col">
              <span class="topo-brand-title" id="dashBrandTitle">MAXNET</span>
              <span class="topo-brand-subtitle" id="headerVer">v2.2.29</span>
            </div>
          </div>

          <!-- TOPOLOGY CANVAS CONTROLS (RESET + NOTIFICATIONS + MENU BUTTON) -->
          <div class="topo-toolbar" role="toolbar" aria-label="Topology Controls">
            <button class="topo-tool-btn" onclick="resetTopologyZoom()" id="btnResetTopoView" title="Reset Topology to Default View" aria-label="Reset Topology View">
              <svg viewBox="0 0 24 24" class="topo-tool-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
            <button class="topo-tool-btn" onclick="toggleNotificationCenter()" id="btnTopoNotifications" title="Notifications" aria-label="Notifications" style="position:relative;">
              <svg viewBox="0 0 24 24" class="topo-tool-icon"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span id="topoNotificationBadge" class="topo-badge-count" style="display:none; position:absolute; top:-2px; right:-2px; min-width:16px; height:16px; padding:0 3px; background:#ef4444; color:#ffffff; font-family:var(--font-mono, monospace); font-size:9.5px; font-weight:800; line-height:16px; text-align:center; border-radius:8px; box-shadow:0 0 8px rgba(239, 68, 68, 0.7); pointer-events:none; box-sizing:border-box;">0</span>
            </button>
            <button class="topo-tool-btn topo-menu-btn" onclick="toggleSettingsMenu()" id="btnTopoMenu" title="Settings" aria-label="Settings">
              <svg viewBox="0 0 24 24" class="topo-tool-icon"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="bw-box">
          <svg id="usbBwSvg" role="img" aria-label="End-to-End Multi-Link Bandwidth Pipeline"></svg>
        </div>

        <!-- REAL-TIME ROUTER TELEMETRY DOCK (0 CPU LOAD, REAL-TIME CPU %, PURE RAM %, ZRAM, AVG TEMP) -->
        <div class="topo-telemetry-dock" id="topoTelemetryDock">
          <div class="topo-tele-item" title="CPU Processor Load">
            <svg style="width:13px;height:13px;stroke:#38bdf8;fill:none;stroke-width:2;" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3"/></svg>
            <span>CPU</span>
            <span class="topo-tele-val" id="topoDockCpu" style="color:#38bdf8;">--%</span>
          </div>
          <div class="topo-tele-sep"></div>
          <div class="topo-tele-item" title="Pure Physical RAM Hardware Usage">
            <svg style="width:13px;height:13px;stroke:#10b981;fill:none;stroke-width:2;" viewBox="0 0 24 24"><path d="M6 19v-3m4 3v-6m4 3v-2m4 5V5"/><rect x="2" y="3" width="20" height="18" rx="2"/></svg>
            <span>RAM</span>
            <span class="topo-tele-val" id="topoDockRam" style="color:#10b981;">--%</span>
          </div>
          <div class="topo-tele-sep"></div>
          <div class="topo-tele-item" title="ZRAM Compressed Dynamic Swap Memory Pool">
            <svg style="width:13px;height:13px;stroke:#a855f7;fill:none;stroke-width:2;" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <span>ZRAM</span>
            <span class="topo-tele-val" id="topoDockZram" style="color:#a855f7;">--</span>
          </div>
          <div class="topo-tele-sep"></div>
          <div class="topo-tele-item" title="Core SoC Temperature">
            <svg style="width:13px;height:13px;stroke:#f59e0b;fill:none;stroke-width:2;" viewBox="0 0 24 24"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
            <span>TEMP</span>
            <span class="topo-tele-val" id="topoDockTemp" style="color:#f59e0b;">--°C</span>
          </div>
        </div>
      </div>
    </div>

    <!-- BADA RICH FLOATING TOPOLOGY TOOLTIP -->
    <div id="topoHoverTooltip" class="topo-tooltip" style="display:none;"></div>

    <!-- ==================== TAB 2: SETTINGS ==================== -->
        <!-- ==================== TAB 2: SETTINGS ==================== -->
    <div id="tabSettings" class="tab-page" style="display:none;">
      <!-- ==================== ANDROID SETTINGS EDIT POPUP MODAL (SCOPED) ==================== -->

  <!-- ==================== CUSTOM FACTORY RESET CONFIRMATION MODAL WITH 10S COUNTDOWN ==================== -->
  <div id="factoryResetModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeFactoryResetModal()">
    <div class="android-modal-card" style="max-width:440px; border:1px solid rgba(239,68,68,0.3); box-shadow:0 10px 40px rgba(239,68,68,0.25);">
      <div class="android-modal-header" style="border-bottom:1px solid rgba(239,68,68,0.15);">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:28px; height:28px; border-radius:50%; background:rgba(239,68,68,0.15); color:#ef4444; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <span class="android-modal-title" style="color:#ef4444;">Factory Reset Gateway</span>
        </div>
        <span class="android-modal-desc">Permanent system wipe and configuration restore</span>
      </div>
      <div class="android-modal-body" style="padding:16px 20px; font-size:12px; line-height:1.6; color:var(--text-main);">
        <p style="margin:0 0 12px 0;">All custom settings, administrator passwords, static IP leases, firewall rules, and installed packages will be permanently destroyed. The gateway will restore original factory defaults and reboot.</p>
        <div style="padding:10px 12px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); border-radius:8px; color:#fca5a5; font-size:11.5px; font-family:var(--font-mono);">
          This destructive operation cannot be cancelled once triggered.
        </div>
      </div>
      <div class="android-modal-footer">
        <button type="button" class="mh-btn btn-ghost" onclick="closeFactoryResetModal()" style="padding:7px 18px; font-size:12px; font-weight:700;">CANCEL</button>
        <button type="button" class="mh-btn" id="btnConfirmFactoryReset" disabled onclick="executeFactoryReset()" style="padding:7px 22px; font-size:12px; font-weight:800; background:rgba(239,68,68,0.2); color:rgba(255,255,255,0.4); border:1px solid rgba(239,68,68,0.4); cursor:not-allowed; transition:all 0.2s ease;">
          RESET GATEWAY (10s)
        </button>
      </div>
    </div>
  </div>

  <!-- ==================== FIRMWARE FLASH MODAL (CLEAN & SIMPLE) ==================== -->
  <div id="firmwareFlashModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeFirmwareFlashModal()">
    <div class="android-modal-card" style="max-width:460px; width:92%;">
      <div class="android-modal-header">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <span class="android-modal-title">Firmware Upgrade</span>
          <button type="button" class="btn-ghost" onclick="closeFirmwareFlashModal()" style="background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:4px;" aria-label="Close">
            <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <span class="android-modal-desc" id="flashModalSubtitle">Install new firmware release on NAND storage</span>
      </div>

      <!-- Action Selection State -->
      <div class="android-modal-body" id="flashModalContent" style="padding:16px 20px; font-size:12.5px; display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex; justify-content:space-between; padding:12px 14px; background:var(--bg-sub, rgba(255,255,255,0.03)); border:1px solid var(--border-sub, rgba(255,255,255,0.08)); border-radius:8px;">
          <div>
            <div style="font-size:10.5px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Installed</div>
            <div id="flashCurrentVer" style="font-size:13px; font-weight:700; color:var(--text-main); font-family:var(--font-mono);">v2.2.7-b7</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:10.5px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Latest Build</div>
            <div id="flashLatestVer" style="font-size:13px; font-weight:700; color:var(--primary, #10b981); font-family:var(--font-mono);">v2.2.10-b10</div>
          </div>
        </div>

        <div style="font-size:11.5px; color:var(--text-muted); line-height:1.5;">
          Target Image: <span id="flashFileName" style="color:var(--text-main); font-family:var(--font-mono);">maxnet-jidu6911-sysupgrade.bin</span> (<span id="flashFileSize">28.60 MB</span>)
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <button type="button" class="mh-btn btn-primary" onclick="startFirmwareFlash(false)" style="width:100%; justify-content:center; padding:10px 16px; font-size:12.5px; font-weight:700;">
            Just Update (Keep Settings)
          </button>
          <button type="button" class="mh-btn btn-ghost" onclick="startFirmwareFlash(true)" style="width:100%; justify-content:center; padding:10px 16px; font-size:12.5px; font-weight:700;">
            Clean Flash (Reset All Settings)
          </button>
        </div>
      </div>

      <!-- Live Flashing Progress State -->
      <div class="android-modal-body" id="flashProgressState" style="display:none; padding:24px 20px; flex-direction:column; align-items:center; text-align:center; gap:16px;">
        <div class="m-spinner" style="width:40px; height:40px;"></div>
        <div style="display:flex; flex-direction:column; gap:4px;">
          <span style="font-size:14px; font-weight:800; color:var(--text-main);" id="flashProgressTitle">Downloading Firmware...</span>
          <span style="font-size:12px; color:var(--text-muted); line-height:1.5;" id="flashProgressDesc">Starting background download from release mirror...</span>
        </div>
        <div style="width:100%; background:var(--bg-sub, rgba(255,255,255,0.08)); height:6px; border-radius:3px; overflow:hidden;">
          <div id="flashProgressBar" style="width:5%; height:100%; background:var(--primary, #10b981); transition:width 0.4s ease;"></div>
        </div>
        <div style="font-family:var(--font-mono); font-size:11.5px; font-weight:700; color:var(--text-muted);" id="flashCountdownTimer">Please do not disconnect power</div>
      </div>

      <div class="android-modal-footer" id="flashModalFooter">
        <button type="button" class="mh-btn btn-ghost" onclick="closeFirmwareFlashModal()" style="padding:7px 18px; font-size:12px; font-weight:700;">CANCEL</button>
      </div>
    </div>
  </div>

  <!-- ==================== SAFE RAM BOOT MODAL (CLEAN & SIMPLE) ==================== -->
  <div id="ramBootModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeRamBootModal()">
    <div class="android-modal-card" style="max-width:480px; width:92%;">
      <div class="android-modal-header">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <span class="android-modal-title">Safe RAM Boot (.itb)</span>
          <button type="button" class="btn-ghost" onclick="closeRamBootModal()" style="background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:4px;" aria-label="Close">
            <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <span class="android-modal-desc">Test firmware directly in DDR RAM without flashing NAND</span>
      </div>

      <div class="android-modal-body" id="ramBootModalContent" style="padding:16px 20px; font-size:12px; display:flex; flex-direction:column; gap:14px;">
        <p style="margin:0; color:var(--text-muted); line-height:1.5;">
          Loads the entire operating system into volatile DDR RAM. Flash memory is untouched. If powered off, the router returns to its previous system with zero risk of bricking.
        </p>

        <div style="display:flex; flex-direction:column; gap:6px;">
          <button type="button" class="mh-btn btn-primary" id="btnExecDirectRamBoot" onclick="executeDirectRamBoot()" style="width:100%; justify-content:center; padding:10px 16px; font-size:12.5px; font-weight:700;">
            Reboot into RAM Boot Mode
          </button>
          <span style="font-size:10.5px; color:var(--text-dim); text-align:center;">Sets U-Boot bootcmd and restarts gateway</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:6px; border-top:1px solid var(--border-sub, rgba(255,255,255,0.08)); padding-top:12px;">
          <span style="font-size:10.5px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">TFTP Command</span>
          <div style="display:flex; align-items:center; background:var(--bg-sub, rgba(0,0,0,0.4)); padding:8px 10px; border-radius:6px; font-family:var(--font-mono); font-size:11px; color:var(--text-main); justify-content:space-between; border:1px solid var(--border-sub, rgba(255,255,255,0.06));">
            <span id="ramBootTftpCmd" style="user-select:all; word-break:break-all;">tftpboot 0x46000000 maxnet-jidu6911-initramfs.itb; bootm 0x46000000</span>
            <button type="button" class="btn-ghost" onclick="copyTextToClipboard(document.getElementById('ramBootTftpCmd').textContent)" style="padding:2px 8px; font-size:10px; border:none; background:transparent; color:var(--primary, #10b981); cursor:pointer; font-weight:700;">COPY</button>
          </div>
          <a id="ramBootItbDownloadLink" href="#" target="_blank" class="mh-btn btn-ghost" style="width:100%; justify-content:center; padding:8px 14px; font-size:11.5px; font-weight:700; text-decoration:none; margin-top:4px;">
            Download .itb Binary (<span id="ramBootItbSize">34.16 MB</span>)
          </a>
        </div>
      </div>

      <div class="android-modal-footer">
        <button type="button" class="mh-btn btn-ghost" onclick="closeRamBootModal()" style="padding:7px 18px; font-size:12px; font-weight:700;">CLOSE</button>
      </div>
    </div>
  </div>
<!-- ADB SMS MESSAGES MODAL -->
  <div id="adbSmsModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeAdbSmsModal()">
    <div class="android-modal-card" style="max-width:540px; width:92%; max-height:85vh; display:flex; flex-direction:column;">
      <div class="android-modal-header" style="flex-shrink:0;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="android-modal-title" id="adbSmsModalTitle">SMS Messages</span>
            <span class="android-modal-desc" id="adbSmsModalSubtitle">Live inbox from connected handset</span>
          </div>
          <button type="button" class="round-action-btn" onclick="closeAdbSmsModal()" style="width:30px; height:30px; min-width:30px;">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style="margin-top:10px;">
          <input type="text" class="mh-input" id="adbSmsSearchInp" placeholder="Search by number or keyword..." oninput="filterAdbSms(this.value)" style="width:100%; font-size:12px; padding:6px 10px;">
        </div>
      </div>
      <div class="android-modal-body" id="adbSmsModalBody" style="overflow-y:auto; flex:1; padding:12px 16px; display:flex; flex-direction:column; gap:8px;">
        <!-- Loaded dynamically -->
      </div>
      <div class="android-modal-footer" style="flex-shrink:0; justify-content:space-between;">
        <span id="adbSmsCountText" style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono);">--</span>
        <button type="button" class="mh-btn btn-ghost" onclick="closeAdbSmsModal()" style="padding:6px 18px; font-size:12px; font-weight:700;">CLOSE</button>
      </div>
    </div>
  </div>

  <!-- ADB CALL HISTORY MODAL -->
  <div id="adbCallsModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeAdbCallLogsModal()">
    <div class="android-modal-card" style="max-width:520px; width:92%; max-height:85vh; display:flex; flex-direction:column;">
      <div class="android-modal-header" style="flex-shrink:0;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="android-modal-title" id="adbCallsModalTitle">Call History</span>
            <span class="android-modal-desc">Incoming, outgoing, and missed call logs</span>
          </div>
          <button type="button" class="round-action-btn" onclick="closeAdbCallLogsModal()" style="width:30px; height:30px; min-width:30px;">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div class="android-modal-body" id="adbCallsModalBody" style="overflow-y:auto; flex:1; padding:12px 16px; display:flex; flex-direction:column; gap:8px;">
        <!-- Loaded dynamically -->
      </div>
      <div class="android-modal-footer" style="flex-shrink:0; justify-content:space-between;">
        <span id="adbCallsCountText" style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono);">--</span>
        <button type="button" class="mh-btn btn-ghost" onclick="closeAdbCallLogsModal()" style="padding:6px 18px; font-size:12px; font-weight:700;">CLOSE</button>
      </div>
    </div>
  </div>

  <!-- ADB CONTACTS MODAL -->
  <div id="adbContactsModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeAdbContactsModal()">
    <div class="android-modal-card" style="max-width:520px; width:92%; max-height:85vh; display:flex; flex-direction:column;">
      <div class="android-modal-header" style="flex-shrink:0;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="android-modal-title">Device Contacts</span>
            <span class="android-modal-desc">Phonebook contacts retrieved via ADB</span>
          </div>
          <button type="button" class="round-action-btn" onclick="closeAdbContactsModal()" style="width:30px; height:30px; min-width:30px;">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style="margin-top:10px;">
          <input type="text" class="mh-input" id="adbContactsSearchInp" placeholder="Search contacts by name or phone..." oninput="filterAdbContacts(this.value)" style="width:100%; font-size:12px; padding:6px 10px;">
        </div>
      </div>
      <div class="android-modal-body" id="adbContactsModalBody" style="overflow-y:auto; flex:1; padding:12px 16px; display:flex; flex-direction:column; gap:8px;">
        <!-- Loaded dynamically -->
      </div>
      <div class="android-modal-footer" style="flex-shrink:0; justify-content:space-between;">
        <span id="adbContactsCountText" style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono);">--</span>
        <button type="button" class="mh-btn btn-ghost" onclick="closeAdbContactsModal()" style="padding:6px 18px; font-size:12px; font-weight:700;">CLOSE</button>
      </div>
    </div>
  </div>

  <!-- ADB SCREENSHOT PREVIEW MODAL -->
  <div id="adbScreenshotModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeAdbScreenshotModal()">
    <div class="android-modal-card" style="max-width:440px; width:92%; max-height:88vh; display:flex; flex-direction:column; align-items:center;">
      <div class="android-modal-header" style="width:100%; flex-shrink:0;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="android-modal-title">Handset Screenshot</span>
          <button type="button" class="round-action-btn" onclick="closeAdbScreenshotModal()" style="width:30px; height:30px; min-width:30px;">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div class="android-modal-body" id="adbScreenshotModalBody" style="overflow:auto; width:100%; padding:14px; text-align:center;">
        <!-- Image loaded dynamically -->
      </div>
      <div class="android-modal-footer" style="width:100%; flex-shrink:0; justify-content:flex-end; gap:8px;">
        <button type="button" class="mh-btn btn-ghost" onclick="closeAdbScreenshotModal()" style="padding:6px 16px; font-size:12px; font-weight:700;">CLOSE</button>
        <a id="btnDownloadAdbScreenshot" href="#" download="handset_screenshot.png" class="mh-btn" style="padding:6px 18px; font-size:12px; font-weight:800; background:#38bdf8; color:#0f172a; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">DOWNLOAD</a>
      </div>
    </div>
  </div>

  <!-- REPEATER WI-FI CONNECTION MODAL (DHCP / STATIC IP, CUSTOM MAC, MTU, RADIO) -->
  <div id="repeaterConnectModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeRepeaterConnectModal()">
    <div class="android-modal-card" style="max-width:480px; width:92%;">
      <div class="android-modal-header">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <span class="android-modal-title" id="repModalSsidTitle">Connect to Wi-Fi Uplink</span>
          <button type="button" class="btn-ghost" onclick="closeRepeaterConnectModal()" style="background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:4px;" aria-label="Close">
            <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <span class="android-modal-desc" id="repModalSubtitle">Configure wireless uplink authentication &amp; addressing</span>
      </div>

      <div class="android-modal-body" style="padding:16px 20px; display:flex; flex-direction:column; gap:12px; max-height:75vh; overflow-y:auto;">
        <input type="hidden" id="repHiddenBssid">
        <input type="hidden" id="repHiddenBand">
        <input type="hidden" id="repHiddenChannel">
        <input type="hidden" id="repHiddenEnc">
        <input type="hidden" id="repHiddenNetwork">

        <div class="mh-form-group">
          <label class="mh-label">Target Network SSID</label>
          <input type="text" class="mh-input" id="repTargetSsid" placeholder="Network Name">
        </div>

        <div class="mh-form-group" id="repKeyGroup">
          <label class="mh-label">Wi-Fi Password / Key</label>
          <input type="password" class="mh-input" id="repTargetKey" placeholder="Enter WPA2/WPA3 network password">
        </div>

        <div class="mh-form-group">
          <label class="mh-label">Addressing Protocol</label>
          <div style="display:flex; gap:8px; margin-top:4px;">
            <button type="button" class="tri-btn active" id="btnRepProtoDhcp" onclick="setRepeaterProto('dhcp')" style="flex:1; padding:7px 0; text-align:center;">DHCP (Auto IP)</button>
            <button type="button" class="tri-btn" id="btnRepProtoStatic" onclick="setRepeaterProto('static')" style="flex:1; padding:7px 0; text-align:center;">Static IPv4</button>
          </div>
        </div>

        <!-- STATIC IP CONFIGURATION SUB-PANEL -->
        <div id="repStaticFieldsPanel" style="display:none; flex-direction:column; gap:10px; background:rgba(255,255,255,0.02); padding:10px 12px; border:1px solid var(--border-sub); border-radius:8px;">
          <div class="mh-form-group" style="margin:0;">
            <label class="mh-label" style="font-size:10px;">Static IP Address</label>
            <input type="text" class="mh-input" id="repStaticIp" placeholder="192.168.1.50">
          </div>
          <div class="mh-form-group" style="margin:0;">
            <label class="mh-label" style="font-size:10px;">Subnet Mask</label>
            <input type="text" class="mh-input" id="repStaticNetmask" value="255.255.255.0">
          </div>
          <div class="mh-form-group" style="margin:0;">
            <label class="mh-label" style="font-size:10px;">Gateway IP</label>
            <input type="text" class="mh-input" id="repStaticGateway" placeholder="192.168.1.1">
          </div>
          <div class="mh-form-group" style="margin:0;">
            <label class="mh-label" style="font-size:10px;">Custom DNS</label>
            <input type="text" class="mh-input" id="repStaticDns" value="1.1.1.1 8.8.8.8">
          </div>
        </div>

        <!-- ADVANCED UPLINK TOGGLE & FIELDS -->
        <div style="margin-top:4px;">
          <button type="button" class="mh-btn btn-ghost" onclick="toggleRepeaterAdvanced()" id="btnToggleRepAdv" style="font-size:10.5px; padding:4px 10px; width:100%; justify-content:center;">
            SHOW ADVANCED UPLINK PARAMETERS
          </button>
        </div>

        <div id="repAdvancedPanel" style="display:none; flex-direction:column; gap:10px; margin-top:4px;">
          <div class="mh-form-group" id="repManualEncryptionGroup" style="display:none; margin:0;">
            <label class="mh-label" style="font-size:10px;">Hidden Network Security</label>
            <select class="mh-input" id="repManualEncryption" onchange="updateRepeaterManualSecurity()">
              <option value="psk2">WPA2 Personal</option>
              <option value="sae-mixed">WPA2/WPA3 Personal</option>
              <option value="sae">WPA3 Personal</option>
              <option value="none">Open network</option>
            </select>
          </div>
          <div class="mh-form-group" style="margin:0;">
            <label class="mh-label" style="font-size:10px;">Target Radio Band</label>
            <select class="mh-input" id="repTargetRadio">
              <option value="auto">Auto Select Radio</option>
              <option value="radio0">2.4 GHz (radio0)</option>
              <option value="radio1">5 GHz (radio1)</option>
            </select>
          </div>
          <div class="mh-form-group" style="margin:0;">
            <label class="mh-label" style="font-size:10px;">BSSID (Optional)</label>
            <input type="text" class="mh-input" id="repCustomBssid" placeholder="Lock to a specific AP MAC">
          </div>
          <div class="mh-form-group" style="margin:0;">
            <label class="mh-label" style="font-size:10px;">Clone Custom MAC Address</label>
            <input type="text" class="mh-input" id="repCustomMac" placeholder="Leave blank to use the radio MAC">
          </div>
          <div class="mh-form-group" style="margin:0;">
            <label class="mh-label" style="font-size:10px;">Custom MTU</label>
            <input type="number" class="mh-input" id="repCustomMtu" value="1500" min="576" max="1500">
          </div>
          <div class="mh-form-group" style="margin:0;">
            <label class="mh-label" style="font-size:10px;">Routing Metric Priority</label>
            <input type="number" class="mh-input" id="repCustomMetric" value="20" min="1" max="255">
          </div>
        </div>

      </div>

      <div class="android-modal-footer">
        <button type="button" class="mh-btn btn-ghost" onclick="closeRepeaterConnectModal()">CANCEL</button>
        <button type="button" class="mh-btn" id="btnSubmitRepeaterConnect" onclick="submitRepeaterConnect()">CONNECT</button>
      </div>
    </div>
  </div>

  <!-- DHCP CLIENT HISTORY 30-DAY LEDGER MODAL -->
  <div id="dhcpHistoryModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeDhcpHistoryModal()">
    <div class="android-modal-card" style="max-width:580px; width:94%;">
      <div class="android-modal-header">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <span class="android-modal-title">DHCP Client History Ledger</span>
          <button type="button" class="btn-ghost" onclick="closeDhcpHistoryModal()" style="background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:4px;" aria-label="Close">
            <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <span class="android-modal-desc" id="dhcpHistoryModalSubtitle">Tracked clients, departure records &amp; cumulative data usage</span>
      </div>
      <div class="android-modal-body" style="padding:14px 18px; max-height:65vh; overflow-y:auto;">
        <div id="dhcpHistoryModalList" style="display:flex; flex-direction:column; gap:6px;">
          <!-- Dynamically populated -->
        </div>
      </div>
      <div class="android-modal-footer" style="justify-content:space-between;">
        <button type="button" class="mh-btn btn-danger" onclick="clearDhcpHistoryLedger()" style="padding:6px 14px; font-size:11px;">RESET LEDGER</button>
        <button type="button" class="mh-btn btn-ghost" onclick="closeDhcpHistoryModal()" style="padding:6px 16px; font-size:11px;">CLOSE</button>
      </div>
    </div>
  </div>

  <!-- NOTIFICATION SETTINGS MODAL (STORAGE RETENTION, ALERT TRIGGERS & CLEAR ALL) -->
  <div id="notifSettingsModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeNotificationSettingsModal()">
    <div class="android-modal-card" style="max-width:480px; width:92%; max-height:85vh; display:flex; flex-direction:column; overflow:hidden;">
      <div class="android-modal-header" style="flex-shrink:0;">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:50%; background:rgba(245,158,11,0.15); color:#f59e0b; display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <span class="android-modal-title">Notification Settings</span>
          </div>
          <button type="button" class="btn-ghost" onclick="closeNotificationSettingsModal()" style="background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:4px;" aria-label="Close">
            <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div class="android-modal-body" style="padding:14px 16px; overflow-y:auto; flex:1 1 auto; display:flex; flex-direction:column; gap:12px;">
        <!-- CLEAR ALL NOTIFICATIONS BUTTON ROW -->
        <div class="setting-row-item" style="padding:10px 14px; border:1px solid rgba(239,68,68,0.25); border-radius:10px; background:rgba(239,68,68,0.04);">
          <div class="setting-label-col">
            <span class="setting-label-bold" style="color:#ef4444;">Clear All Notifications</span>
            <span class="setting-label-sub" id="notifModalStorageSummary">Permanently delete all stored alert records</span>
          </div>
          <div class="setting-control-col">
            <button type="button" class="round-action-btn btn-danger-action" id="btnClearAllNotifsModal" onclick="clearAllNotifications(); closeNotificationSettingsModal();" title="Clear All" aria-label="Clear All">
              <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>

        <!-- NOTIFICATION STORAGE & RETENTION ROW -->
        <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('notif_retention')" style="border:1px solid var(--border-sub); border-radius:10px; padding:10px 14px;">
          <div class="setting-label-col">
            <span class="setting-label-bold">Storage Retention &amp; Pruning</span>
            <span class="setting-label-sub" id="disp_notif_retention">Capped at 50 records • Auto-pruned to protect flash</span>
          </div>
          <div class="setting-control-col">
            <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <!-- ALERT TRIGGER PREFERENCES -->
        <div style="border:1px solid var(--border-sub); border-radius:10px; overflow:hidden;">
          <div style="font-size:11px; font-weight:700; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.05em; padding:8px 12px; background:rgba(255,255,255,0.02); border-bottom:1px solid var(--border-sub);">Alert Trigger Rules</div>
          <div style="display:flex; flex-direction:column; gap:0;">
            <div class="setting-row-item" style="border-bottom:1px solid var(--border-sub);">
              <div class="setting-label-col">
                <span class="setting-label-bold">Device Connect &amp; Disconnect</span>
                <span class="setting-label-sub">Alert when network clients join or leave WiFi &amp; LAN</span>
              </div>
              <div class="toggle-wrap-cell">
                <label class="toggle-switch">
                  <input type="checkbox" id="notifTriggerDevice" checked onchange="toggleNotificationTrigger('device', this.checked)">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-row-item" style="border-bottom:1px solid var(--border-sub);">
              <div class="setting-label-col">
                <span class="setting-label-bold">Internet WAN Uplink</span>
                <span class="setting-label-sub">Alert immediately when WAN link drops or recovers</span>
              </div>
              <div class="toggle-wrap-cell">
                <label class="toggle-switch">
                  <input type="checkbox" id="notifTriggerWan" checked onchange="toggleNotificationTrigger('wan', this.checked)">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-row-item" style="border-bottom:1px solid var(--border-sub);">
              <div class="setting-label-col">
                <span class="setting-label-bold">Security &amp; WebUI Logins</span>
                <span class="setting-label-sub">Alert on administrator logins and invalid password attempts</span>
              </div>
              <div class="toggle-wrap-cell">
                <label class="toggle-switch">
                  <input type="checkbox" id="notifTriggerSecurity" checked onchange="toggleNotificationTrigger('security', this.checked)">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-row-item" style="border-bottom:1px solid var(--border-sub);">
              <div class="setting-label-col">
                <span class="setting-label-bold">System Health &amp; Thermal</span>
                <span class="setting-label-sub">Alert when router reboots or CPU temperature exceeds 75&deg;C</span>
              </div>
              <div class="toggle-wrap-cell">
                <label class="toggle-switch">
                  <input type="checkbox" id="notifTriggerHealth" checked onchange="toggleNotificationTrigger('health', this.checked)">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-row-item">
              <div class="setting-label-col">
                <span class="setting-label-bold">Firmware &amp; OS Updates</span>
                <span class="setting-label-sub">Alert when new official MAXNET releases are available</span>
              </div>
              <div class="toggle-wrap-cell">
                <label class="toggle-switch">
                  <input type="checkbox" id="notifTriggerUpdate" checked onchange="toggleNotificationTrigger('update', this.checked)">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="android-modal-actions" style="padding:10px 16px; border-top:1px solid var(--border-sub); display:flex; justify-content:flex-end;">
        <button type="button" class="mh-btn" onclick="closeNotificationSettingsModal()" style="padding:7px 18px; font-weight:700;">DONE</button>
      </div>
    </div>
  </div>

  <div id="settingEditModalOverlay" class="android-modal-overlay" onclick="onModalOverlayClick(event)">
    <div class="android-modal-card setting-edit-modal-card" id="settingEditModalCard">
      <div class="android-modal-header setting-edit-modal-header">
        <div class="setting-edit-modal-topline">
          <span class="android-modal-title" id="settingModalTitle">Edit Setting</span>
          <div class="setting-edit-modal-actions">
            <button type="button" class="android-modal-close-round setting-edit-modal-save" id="btnModalSave" onclick="saveSettingModal()" aria-label="Save setting" title="Save">
              <svg viewBox="0 0 24 24"><path d="M5 3h12l4 4v14H3V3z"/><path d="M7 3v6h10V3M7 21v-7h10v7"/></svg><span>SAVE</span>
            </button>
            <button type="button" class="android-modal-close-round setting-edit-modal-close" onclick="closeSettingModal()" aria-label="Close setting editor" title="Close">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <span class="android-modal-desc" id="settingModalDesc" hidden>Adjust configuration parameters</span>
      </div>
      <div class="android-modal-body" id="settingModalBody">
        <!-- Dynamically injected edit controls -->
      </div>

    </div>
  </div>

  <!-- TOPOLOGY JSON EXPORT / IMPORT MODAL -->
  <div id="topoJsonModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeTopoJsonModal()">
    <div class="android-modal-card" style="max-width:540px;">
      <div class="android-modal-header">
        <span class="card-badge sky" style="font-size:9.5px; font-weight:700; align-self:flex-start; margin-bottom:4px; letter-spacing:0.5px;">TOPOLOGY JSON</span>
        <span class="android-modal-title" id="topoJsonModalTitle">Export / Import Topology Tree</span>
        <span class="android-modal-desc" id="topoJsonModalDesc">Recursive JSON structure for network hierarchy</span>
      </div>
      <div class="android-modal-body" style="padding:14px 20px;">
        <textarea id="topoJsonTextarea" class="mh-input" style="width:100%; height:260px; font-family:var(--font-mono); font-size:11px; line-height:1.45; resize:vertical; padding:10px; white-space:pre; border-radius:8px;" spellcheck="false"></textarea>
        <div id="topoJsonError" style="display:none; color:#ef4444; font-size:11px; font-family:var(--font-mono); margin-top:8px; font-weight:700;"></div>
      </div>
      <div class="android-modal-footer" style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
        <button type="button" class="mh-btn btn-ghost" onclick="copyTopoJsonToClipboard()" id="btnCopyTopoJson">COPY TO CLIPBOARD</button>
        <div style="display:flex; gap:8px;">
          <button type="button" class="mh-btn btn-ghost" onclick="closeTopoJsonModal()">CLOSE</button>
          <button type="button" class="mh-btn" id="topoJsonModalApplyBtn" onclick="applyImportedTopoJson()">APPLY JSON</button>
        </div>
      </div>
    </div>
  </div>

  <!-- TOPOLOGY RICH NODE DETAILS MODAL SHEET -->
  <div id="topoNodeDetailOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeTopoNodeDetail()">
    <div class="android-modal-card" style="max-width:min(500px, calc(100vw - 20px)); width:100%; box-sizing:border-box; overflow-x:hidden;" id="topoNodeDetailCard">
      <div class="android-modal-header" style="border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px;">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px; min-width:0;">
            <div id="topoNodeDetailIconBox" style="width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:rgba(56,189,248,0.12); color:#38bdf8;"></div>
            <div style="min-width:0;">
              <div class="android-modal-title" id="topoNodeDetailTitle" style="font-size:15px; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Node Details</div>
              <div class="android-modal-desc" id="topoNodeDetailSub" style="font-size:11px; font-family:var(--font-mono); color:var(--text-dim); margin-top:2px;">--</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex:0 0 auto;">
            <span class="card-badge emerald" id="topoNodeDetailStatusBadge" style="font-size:10px; font-weight:800;">ONLINE</span>
            <button type="button" class="android-modal-close-round" onclick="closeTopoNodeDetail()" aria-label="Close device details" title="Close">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="android-modal-body" id="topoNodeDetailBody" style="padding:14px 18px; max-height:75vh; overflow-y:auto; overflow-x:hidden; box-sizing:border-box;">
        <!-- Dynamically populated parameters grid -->
      </div>
      <div class="android-modal-footer" style="display:flex; justify-content:flex-end; align-items:center; gap:8px; flex-wrap:wrap; padding:12px 18px; border-top:1px solid var(--border-sub, rgba(255,255,255,0.06));">
        <div style="display:flex; gap:8px;">
          <button type="button" class="mh-btn" id="btnTopoNodeUnblock" style="display:none; background:#ef4444; color:#fff; font-weight:700; padding:6px 14px; font-size:11px;">UNBLOCK DEVICE</button>
          <button type="button" class="mh-btn btn-ghost" id="btnTopoNodeViewClient" onclick="openTopoNodeClientPage()" style="display:none; padding:6px 14px; font-size:11px;">VIEW CLIENT</button>
          <button type="button" class="mh-btn" id="btnTopoNodeEditSettings" onclick="openTopoNodeSettings()" style="background:#38bdf8; color:#0b1120; padding:6px 14px; font-size:11px;">CONFIGURE IN SETTINGS</button>
        </div>
      </div>
    </div>
  </div>

  <!-- TOPOLOGY EVIDENCE & CONFIDENCE MODAL ("WHY?" EXPLANATION) -->
  <div id="topoEvidenceModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeTopoEvidenceModal()">
    <div class="android-modal-card" style="max-width:540px;" id="topoEvidenceModalCard">
      <div class="android-modal-header" style="border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px;">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div id="topoEvidenceIconBox" style="width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:rgba(16,185,129,0.12); color:#10b981;">
              <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <div class="android-modal-title" id="topoEvidenceModalTitle" style="font-size:16px;">Detection Evidence</div>
              <div class="android-modal-desc" id="topoEvidenceModalSub" style="font-size:11.5px; font-family:var(--font-mono); color:#10b981;">Why was this role assigned?</div>
            </div>
          </div>
          <span class="card-badge emerald" id="topoEvidenceConfidenceBadge">HIGH CONFIDENCE</span>
        </div>
      </div>
      <div class="android-modal-body" id="topoEvidenceModalBody" style="padding:16px 20px;">
        <!-- Evidence points & telemetry -->
      </div>
      <div class="android-modal-footer" style="display:flex; justify-content:flex-end; gap:10px;">
        <button type="button" class="mh-btn btn-ghost" onclick="closeTopoEvidenceModal()">DISMISS</button>
      </div>
    </div>
  </div>

  <!-- SSL ROOT CA CERTIFICATE INSTALLATION GUIDE MODAL -->
  <div id="sslHelpModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeSslHelpModal()">
    <div class="android-modal-card" style="max-width:540px; width:92%; max-height:85vh; display:flex; flex-direction:column;" id="sslHelpModalCard">
      <div class="android-modal-header" style="border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px;">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:rgba(16,185,129,0.12); color:#10b981;">
              <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div class="android-modal-title" style="font-size:16px;">SSL Root CA Certificate Guide</div>
              <div class="android-modal-desc" style="font-size:11.5px; font-family:var(--font-mono); color:#10b981;">Authority: MAXNET Root CA</div>
            </div>
          </div>
          <span class="card-badge emerald">TLS 1.3 TRUSTED</span>
        </div>
      </div>
      <div class="android-modal-body" style="padding:16px 20px; max-height:65vh; overflow-y:auto; display:flex; flex-direction:column; gap:14px;">
        <div style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.25); border-radius:8px; padding:12px 14px; font-size:11.5px; line-height:1.5; color:var(--text-main);">
          To eliminate all browser &quot;Not Secure&quot; warnings when opening <strong>https://maxnet.local</strong> or <strong>https://10.0.0.1</strong>, install the <strong>MAXNET Root CA</strong> certificate on your phone or PC once.
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="font-weight:700; font-size:12.5px; color:#38bdf8;">1. Android (Chrome &amp; Web Browsers)</div>
          <div style="font-size:11px; color:var(--text-dim); line-height:1.5;">
            1. Tap <strong>Download Root CA</strong> button below.<br>
            2. Go to phone <strong>Settings &rarr; Security &amp; Privacy &rarr; More Security &rarr; Encryption &amp; Credentials</strong>.<br>
            3. Tap <strong>Install a Certificate &rarr; CA certificate &rarr; Install anyway</strong>.<br>
            4. Select the downloaded <code>maxnet-root-ca.crt</code> file. Done!
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="font-weight:700; font-size:12.5px; color:#38bdf8;">2. Windows (Chrome, Edge, Firefox)</div>
          <div style="font-size:11px; color:var(--text-dim); line-height:1.5;">
            1. Download <code>maxnet-root-ca.crt</code> and double-click to open it.<br>
            2. Click <strong>Install Certificate... &rarr; Current User or Local Machine</strong>.<br>
            3. Select <strong>Place all certificates in the following store</strong>.<br>
            4. Browse and choose <strong>Trusted Root Certification Authorities</strong> &rarr; Click Finish!
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="font-weight:700; font-size:12.5px; color:#38bdf8;">3. Apple iOS &amp; iPadOS (iPhone, iPad, Safari)</div>
          <div style="font-size:11px; color:var(--text-dim); line-height:1.5;">
            1. Tap <strong>APPLE 1-TAP (.MOBILECONFIG)</strong> button below &rarr; Tap <strong>Allow</strong> in Safari.<br>
            2. Go to <strong>Settings &rarr; Profile Downloaded &rarr; Install</strong>.<br>
            3. Go to <strong>Settings &rarr; General &rarr; About &rarr; Certificate Trust Settings</strong>.<br>
            4. Under &quot;Enable full trust for root certificates&quot;, toggle <strong>MAXNET Root CA</strong> to ON. Done!
          </div>
        </div>
      </div>
      <div class="android-modal-footer" style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <a href="/maxnet-root-ca.crt" download="maxnet-root-ca.crt" class="mh-btn" style="background:#10b981; color:#0b1120; font-weight:700; text-decoration:none; padding:7px 14px; font-size:11px; border-radius:6px; display:inline-flex; align-items:center; gap:5px;">
            <svg viewBox="0 0 24 24" style="width:13px; height:13px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ROOT CA (.CRT)
          </a>
          <a href="/maxnet-root-ca.mobileconfig" download="maxnet-root-ca.mobileconfig" class="mh-btn" style="background:#38bdf8; color:#0b1120; font-weight:700; text-decoration:none; padding:7px 14px; font-size:11px; border-radius:6px; display:inline-flex; align-items:center; gap:5px;">
            <svg viewBox="0 0 24 24" style="width:13px; height:13px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm1 5h-2v6h6v-2h-4V7z"/></svg>
            APPLE 1-TAP (.MOBILECONFIG)
          </a>
        </div>
        <button type="button" class="mh-btn btn-ghost" onclick="closeSslHelpModal()">CLOSE</button>
      </div>
    </div>
  </div>


      <!-- VIEW 1: SETTINGS HOME VIEW (GRID OF 13 NAV CARDS) -->
      <div id="settingsHomeView" class="settings-shell">

        <!-- INSTANT SETTINGS SEARCH BAR (WITH BACK BUTTON & DIVIDER) -->
        <div class="settings-search-wrap">
          <div class="settings-search-bar">
            <button type="button" class="settings-back-btn" onclick="switchTab('overview')" title="Back to Topology">
              <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <div class="settings-subnav-divider"></div>
            <svg class="svg-icon settings-search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="settingsSearchInput" class="settings-search-input" placeholder="Search" oninput="filterSettingsSearch(this.value)">
            <button type="button" id="settingsSearchClear" class="settings-search-clear" onclick="clearSettingsSearch()" style="display:none;">✕</button>
          </div>
        </div>

        <!-- SETTINGS NAV TILES GRID (13 CLICKABLE CARDS) -->
        <div class="settings-grid" id="settingsGrid">

          <!-- 1. Network -->
          <div class="settings-nav-card" id="card-network" onclick="openSettingPage('acc-network')" data-search="network dhcp gateway ip subnet mask dns nameservers lease pool lan interface ipv6 slaac dhcpv6 ula flow offloading acceleration ppe mss mtu wan as lan use wan port as lan 5th lan">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#38bdf8;">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Network</span>
                <span class="snc-desc">Gateway IP, subnet mask, DNS, DHCP pool, and WAN-as-LAN mode</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Interfaces (Physical WAN, LAN Bridge, Custom MAC) -->
          <div class="settings-nav-card" id="card-interfaces" onclick="openSettingPage('acc-interfaces')" data-search="interfaces wan lan dhcp static custom mac clone mtu link physical ethernet usb0 br-lan">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#0ea5e9;">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Interfaces</span>
                <span class="snc-desc">Physical WAN protocol (DHCP / Static), physical Ethernet links, and bridge status</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 3. USB WAN (Dedicated Multi-Device USB Tethering & Load Balancing) -->
          <div class="settings-nav-card" id="card-usb-wan" onclick="openSettingPage('acc-usb-wan')" data-search="usb wan tethering multi-device load balancing rndis ncm ecm 4g 5g modem failover watchdog dongle usb0 usb1">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#0ea5e9;">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/><path d="M10 12h4"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">USB WAN</span>
                <span class="snc-desc">Multi-device USB tethering, 4G/5G dongles, and load balancing</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- PPPoE Broadband Dialer & Server -->
          <div class="settings-nav-card" id="card-pppoe" onclick="openSettingPage('acc-pppoe')" data-search="pppoe broadband wan isp dialer client server credentials access concentrator ac chap pap pppd">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#06b6d4;">
                <svg viewBox="0 0 24 24"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3v3H7v-3H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><line x1="8" y1="10" x2="8" y2="13"/><line x1="12" y1="10" x2="12" y2="13"/><line x1="16" y1="10" x2="16" y2="13"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">PPPoE Broadband</span>
                <span class="snc-desc">PPPoE Client dialer and high-performance PPPoE Server concentrator</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Wi-Fi & Wireless Hotspot -->
          <div class="settings-nav-card" id="card-wifi" onclick="openSettingPage('acc-wifi')" data-search="wifi wireless hotspot 2.4ghz 5ghz ssid password wpa2 wpa3 channel txpower bandwidth clients devices ap radio">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#10b981;">
                <svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Wi-Fi &amp; Hotspot</span>
                <span class="snc-desc">Dual-band 2.4 GHz &amp; 5 GHz SSIDs, WPA3 encryption, channels, and client telemetry</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Wi-Fi Clients -->
          <div class="settings-nav-card" id="card-wifi-clients" onclick="openSettingPage('acc-wifi-clients')" data-search="wifi wireless clients connected stations devices kick disconnect block unblock mac address 2.4ghz 5ghz">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#06b6d4;">
                <svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Wi-Fi Clients</span>
                <span class="snc-desc">View connected 2.4 GHz and 5 GHz stations; kick or block Wi-Fi access</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Wireless Repeater (Dedicated Uplink / Client WAN) -->
          <div class="settings-nav-card" id="card-repeater" onclick="openSettingPage('acc-repeater')" data-search="repeater wisp uplink wireless client bridge wifi scan dhcp static wan 2.4ghz 5ghz join connect">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#38bdf8;">
                <svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/><path d="M12 3v6M9 6l3-3 3 3"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Wireless Repeater</span>
                <span class="snc-desc">Dual-band Wi-Fi client uplink, WISP repeater, and static/DHCP connection</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 3. DHCP Clients -->
          <div class="settings-nav-card" id="card-lan-clients" onclick="openSettingPage('acc-lan-clients')" data-search="dhcp clients connected devices leases ip mac hostname allocation">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#10b981;">
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">DHCP Clients</span>
                <span class="snc-desc">Active DHCP client leases, IP and MAC address allocations</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 2. Network Topology -->
          <div class="settings-nav-card" id="card-topo-layers" onclick="openSettingPage('acc-topo-layers')" data-search="topology layers port layer 2 layer 3 access point switch router ap hierarchy mapping lan1 lan2 lan3 lan4">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#38bdf8;">
                <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Network Topology</span>
                <span class="snc-desc">Port modes, Layer 2 AP, and client hierarchy</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 9. Security -->
          <div class="settings-nav-card" id="card-security" onclick="openSettingPage('acc-security')" data-search="security firewall syn flood wan ping icmp protection drop isolation">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#f59e0b;">
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Security</span>
                <span class="snc-desc">Firewall rules, SYN flood protection, and WAN isolation</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 6. Tailscale VPN -->
          <div class="settings-nav-card" id="card-tailscale" onclick="openSettingPage('acc-tailscale')" data-search="tailscale vpn wireguard remote access mesh exit node subnet router auth key">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#06b6d4;">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Tailscale</span>
                <span class="snc-desc">Mesh VPN, exit node routing, and secure remote access</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 4. Gaming Mode -->
          <div class="settings-nav-card" id="card-gaming" onclick="openSettingPage('acc-gaming')" data-search="gaming qos bufferbloat low ping latency dscp fastopen interrupt steering esports acceleration">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#ec4899;">
                <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Gaming Mode</span>
                <span class="snc-desc">Low-latency QoS, bufferbloat killer, and CPU steering</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 7. ADB Devices -->
          <div class="settings-nav-card" id="card-adb-device" onclick="openSettingPage('acc-adb-device')" data-search="adb devices android debugging phone handset hardware controls usb tethering tcpip wireless port forwarding">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#38bdf8;">
                <svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">ADB Devices</span>
                <span class="snc-desc">Connected Android handsets, tethering modems, and hardware ADB controls</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 8. Network Storage -->
          <div class="settings-nav-card" id="card-smb-storage" onclick="openSettingPage('acc-smb-storage')" data-search="samba smb storage nas share usb drive disk mount file sharing windows mac">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#c084fc;">
                <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Network Storage</span>
                <span class="snc-desc">Samba 4 file sharing and USB disk auto-mount</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Webhooks & Alert Forwarding -->
          <div class="settings-nav-card" id="card-webhooks" onclick="openSettingPage('acc-webhooks')" data-search="webhooks alerts push telegram discord ntfy forward bot token chat id notifications">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#0ea5e9;">
                <svg viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Webhooks</span>
                <span class="snc-desc">Telegram, Discord, and ntfy.sh instant alert forwarding for router events</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Notifications & Alerts -->
          <div class="settings-nav-card" id="card-notifications" onclick="openSettingPage('acc-notifications')" data-search="notifications alerts logs events errors cpu spike pppoe dhcp new devices firmware updates">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#f59e0b;">
                <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Notifications</span>
                <span class="snc-desc">System events, CPU spikes, PPPoE errors, new devices, and firmware updates</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 10. Diagnostics -->
          <div class="settings-nav-card" id="card-diagnostics" onclick="openSettingPage('acc-diagnostics')" data-search="diagnostics tools ping traceroute nslookup reachability packet loss latency">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#38bdf8;">
                <svg viewBox="0 0 24 24"><polyline points="4 17 10 11 14 15 20 9"/><line x1="20" y1="14" x2="20" y2="9"/><line x1="15" y1="9" x2="20" y2="9"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Diagnostics</span>
                <span class="snc-desc">Ping latency tests, traceroute, and DNS reachability</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 13. Terminal -->
          <div class="settings-nav-card" id="card-terminal-cli" onclick="openSettingPage('acc-terminal-cli')" data-search="terminal cli console bash shell root command ssh ttyd execute">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#10b981;">
                <svg viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Terminal</span>
                <span class="snc-desc">Interactive on-screen root shell console</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 12. System Logs (DEDICATED MENU) -->
          <div class="settings-nav-card" id="card-logs" onclick="openSettingPage('acc-logs')" data-search="logs system log kernel dmesg logread buffer events daemon syslog real-time">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#06b6d4;">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">System Logs</span>
                <span class="snc-desc">Kernel dmesg ring buffer, logread, and system events</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 13. Packages -->
          <div class="settings-nav-card" id="card-packages" onclick="openSettingPage('acc-packages')" data-search="packages software opkg apk install uninstall update repository plugins modules">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#38bdf8;">
                <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Packages</span>
                <span class="snc-desc">Installed packages, software repository, and plugin management</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Device Info -->
          <div class="settings-nav-card" id="card-sys-info" onclick="openSettingPage('acc-sys-info')" data-search="device info system hardware cpu ram memory temperature sensors thermals storage flash partitions wan ports interfaces uptime kernel model">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#38bdf8;">
                <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Device Info</span>
                <span class="snc-desc">Hardware specs, CPU, RAM, thermal sensors, flash storage, and physical ports</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Hardware & LED Gestures -->
          <div class="settings-nav-card" id="card-led-hardware" onclick="openSettingPage('acc-led-hardware')" data-search="led button reset gesture trigger light red green blue blink internet factory history dhcp hardware">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#ec4899;">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">LED &amp; Hardware</span>
                <span class="snc-desc">Status LED automation, internet indicator triggers, and reset button gestures</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Firmware & OS Updates -->
          <div class="settings-nav-card" id="card-firmware" onclick="openSettingPage('acc-firmware')" data-search="firmware os updates sysupgrade ota ram boot itb flash changelog sha256 version build check update release">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#38bdf8;">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Update</span>
                <span class="snc-desc">OTA sysupgrade, release diagnostics, changelog, and Safe RAM Boot (.itb) testing</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Date & Time -->
          <div class="settings-nav-card" id="card-system-time" onclick="openSettingPage('acc-system-time')" data-search="date time clock timezone ntp synchronize router">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#06b6d4;">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Date &amp; Time</span>
                <span class="snc-desc">Router clock, timezone, and automatic time synchronization</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 11. Maintenance -->
          <div class="settings-nav-card" id="card-maintenance" onclick="openSettingPage('acc-maintenance')" data-search="maintenance reboot restart shutdown backup restore factory reset logcat dmesg logs">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#ef4444;">
                <svg viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Maintenance</span>
                <span class="snc-desc">System reboot, USB power cycle, backup, and factory reset</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- 12. Web UI -->
          <div class="settings-nav-card" id="card-webui" onclick="openSettingPage('acc-webui')" data-search="webui theme dark light appearance refresh rate poll interval display customization font">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#a855f7;">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="12" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Web UI</span>
                <span class="snc-desc">Dark/Light themes, telemetry refresh, and display options</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- About Developer -->
          <div class="settings-nav-card" id="card-device-info" onclick="openSettingPage('acc-device-info')" data-search="about developer max mahendra mali firmware architecture maxnet kernel ohhmax website telegram">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#8b5cf6;">
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">About Developer</span>
                <span class="snc-desc">Lead engineer, system architecture, and firmware engineering credits</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <!-- Log Out Card (Bottom of Settings Hub) -->
          <div class="settings-nav-card" id="card-logout" onclick="showLogoutConfirm()" data-search="logout log out sign out exit session terminate disconnect" style="border-color:rgba(239, 68, 68, 0.28); background:linear-gradient(135deg, rgba(239, 68, 68, 0.06), rgba(15, 23, 42, 0.65));">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#ef4444; background:rgba(239, 68, 68, 0.12); border:1px solid rgba(239, 68, 68, 0.25);">
                <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title" style="color:#f87171;">Log Out</span>
                <span class="snc-desc">Terminate administrator session and return to secure login screen</span>
              </div>
            </div>
            <div class="snc-right">
              <svg class="snc-arrow" viewBox="0 0 24 24" style="color:#ef4444;"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 2: DEDICATED SETTING DETAIL PAGE VIEW -->
      <div id="settingsDetailPageView" style="display:none;">
        <!-- STICKY SUB-NAV BAR (CURVED BORDER, TRANSPARENT BG, ICON + TITLE) -->
        <div class="settings-subnav-bar">
          <button class="settings-back-btn" onclick="handleSettingsBack()" title="Back">
            <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <div class="settings-subnav-divider"></div>
          <div class="settings-subnav-title-group">
            <span id="settingsDetailNavIcon" class="settings-subnav-icon"></span>
            <span id="settingsDetailNavTitle" class="settings-subnav-title">Settings</span>
          </div>
          <div class="settings-subnav-right" id="settingsDetailNavRight" style="margin-left:auto; display:flex; align-items:center; gap:8px;">
            <div class="settings-page-actions" id="settingsPageActions" style="display:none;">
              <button type="button" class="settings-page-action" id="settingsSaveAction" onclick="saveCurrentSettingPage()" style="display:none;" title="Save changes" aria-label="Save changes">
                <svg viewBox="0 0 24 24"><path d="M5 3h12l4 4v14H3V3z"/><path d="M7 3v6h10V3M7 21v-7h10v7"/></svg>
              </button>
              <button type="button" class="settings-page-action" id="pppoeSubscriberAddAction" onclick="openSettingModal('pppoe_user_add')" style="display:none;" title="Add subscriber" aria-label="Add subscriber">
                <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M19 8v8M15 12h8"/></svg>
              </button>
              <button type="button" class="settings-page-action" id="topoResetAction" onclick="resetTopologyLayersConfig()" style="display:none;" title="Reset topology" aria-label="Reset topology">
                <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 2.64-6.36L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <button type="button" class="settings-page-action" id="topoExportAction" onclick="openExportTopologyModal()" style="display:none;" title="Export topology" aria-label="Export topology">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </button>
              <button type="button" class="settings-page-action" id="topoImportAction" onclick="openImportTopologyModal()" style="display:none;" title="Restore topology JSON" aria-label="Restore topology JSON">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            </div>
            <button type="button" class="round-action-btn" id="subnavNotifSettingsBtn" onclick="openNotificationSettingsModal()" style="display:none;" title="Notification Settings" aria-label="Notification Settings">
              <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <button type="button" class="round-action-btn btn-danger-action" id="subnavNotifClearBtn" onclick="clearAllNotifications()" style="display:none;" title="Clear All Notifications" aria-label="Clear All Notifications">
              <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
          <div id="settingsSaveStatusPill" class="setting-save-pill" style="display:none;">
            <svg class="spin-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            <span id="settingsSaveStatusText">Applying changes...</span>
          </div>
        </div>

        <!-- SETTINGS DETAIL PANELS CONTAINER -->
        <div class="settings-shell" id="settingsDetailContainer">
        <!-- 1. NETWORK & DHCP CONFIGURATION (FULL FEATURED) -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-network">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-network')">
            <div class="acc-title-left">
              <div class="acc-icon-box">
                <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <span class="acc-main-title">Network</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge" id="netLanBadge">10.0.0.1/24</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- NETWORK INTERFACE CONFIG ROWS -->
              <div style="display:flex; flex-direction:column;">
                <!-- HIDDEN ORIGINAL INPUT ELEMENTS FOR SEAMLESS UCI COMMIT COMPATIBILITY -->
                <div style="display:none;">
                  <input type="text" id="netDeviceHostname" value="Maxnet-Gateway">
                  <input type="text" id="netCustomMac" value="">
                  <input type="text" id="netHwMac" value="">
                  <input type="text" id="netLanIp" value="10.0.0.1">
                  <input type="text" id="netMask" value="255.255.255.0">
                  <select id="netCidrSelect"><option value="24">/24</option></select>
                  <input type="text" id="netGateway" value="">
                  <input type="number" id="netMtu" value="1500">
                  <input type="number" id="netDhcpStart" value="100">
                  <input type="number" id="netDhcpLimit" value="150">
                  <select id="netDhcpLease"><option value="12h">12h</option></select>
                  <input type="text" id="netDns" value="1.1.1.1 8.8.8.8">
                  <input type="text" id="netIpv6WanMode" value="dhcpv6">
                  <input type="text" id="netIpv6Ula" value="fd00::/48">
                </div>

                <!-- 0A. DEVICE HOSTNAME (ANDROID POPUP ROW WITH CHEVRON >) -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('device_hostname')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Device Hostname</span>
                    <span class="setting-label-sub" id="disp_device_hostname">Maxnet-Gateway</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 0B. CUSTOM MAC ADDRESS OVERRIDE (ANDROID POPUP ROW WITH CHEVRON >) -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('custom_mac')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Bridge LAN MAC Address (br-lan)</span>
                    <span class="setting-label-sub" id="disp_custom_mac">Default Factory Hardware MAC in use</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 1. GATEWAY IP ADDRESS (ANDROID POPUP ROW WITH CHEVRON >) -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('lan_ip')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Gateway IP Address</span>
                    <span class="setting-label-sub" id="disp_lan_ip">10.0.0.1</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 2. SUBNET MASK / CIDR (ANDROID POPUP ROW WITH CHEVRON >) -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('net_mask')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Subnet Mask / CIDR</span>
                    <span class="setting-label-sub" id="disp_net_mask">255.255.255.0 (/24)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 3. DEFAULT UPSTREAM GATEWAY (ANDROID POPUP ROW WITH CHEVRON >) -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('net_gateway')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Default Upstream Gateway</span>
                    <span class="setting-label-sub" id="disp_net_gateway">None (Direct br-lan)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 4. INTERFACE MTU SIZE (ANDROID POPUP ROW WITH CHEVRON >) -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('net_mtu')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Interface MTU Size</span>
                    <span class="setting-label-sub" id="disp_net_mtu">1500 bytes</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 5. DHCP SERVER DAEMON (DIRECT TOGGLE SWITCH) -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">DHCP Server Daemon</span>
                    <span class="setting-label-sub">Enable automatic IPv4 address allocation to connected clients</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="netDhcpMasterToggle" checked onchange="toggleDhcpControls(this.checked); scheduleNetworkAutoSave();">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 6. DHCP ADDRESS POOL (ANDROID POPUP ROW WITH CHEVRON >) -->
                <div class="setting-row-item setting-clickable-row" id="rowDhcpPool" onclick="openSettingModal('dhcp_pool')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">DHCP Address Pool</span>
                    <span class="setting-label-sub" id="disp_dhcp_pool">Start 100 &bull; Limit 150 &bull; Lease 12h</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- USE WAN PORT AS LAN TOGGLE -->
                <div class="setting-row-item" style="border-left: 3px solid #0ea5e9; padding-left: 14px; background: rgba(14, 165, 233, 0.03); margin-bottom: 8px; border-radius: 6px;">
                  <div class="setting-label-col">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span class="setting-label-bold">Use WAN Port as LAN</span>
                      <span class="card-badge" id="badgeWanAsLan" style="font-size:9.5px; padding:2px 7px;">STANDALONE WAN</span>
                    </div>
                    <span class="setting-label-sub" id="disp_net_wan_as_lan_sub">Convert physical WAN port into a 5th Gigabit LAN switch port (bridged into br-lan). Default: Disabled (WAN Uplink).</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="netWanAsLanToggle" onchange="toggleWanAsLan(this.checked)">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- LINK TO DEDICATED USB WAN PANEL -->
                <div class="setting-section-divider"></div>
                <div class="setting-section-header">USB WAN Gateway</div>

                <div class="setting-row-item setting-clickable-row" onclick="openSettingPage('acc-usb-wan')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">USB WAN Settings</span>
                    <span class="setting-label-sub">Configured in dedicated USB WAN panel &bull; Tap to configure</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- DHCP & LEASE RETENTION SECTION -->
                <div class="setting-section-divider"></div>
                <div class="setting-section-header">DHCP &amp; Lease Retention</div>

                <!-- CLIENT LEASE HISTORY RETENTION (CONFIGURABLE POPUP ROW) -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('client_history_days')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Client History Retention</span>
                    <span class="setting-label-sub" id="disp_client_history_days">15 Days Retention &bull; Click to change duration</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 8. CUSTOM DNS NAMESERVERS (ANDROID POPUP ROW WITH CHEVRON >) -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('custom_dns')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Custom DNS Nameservers</span>
                    <span class="setting-label-sub" id="disp_custom_dns">1.1.1.1 8.8.8.8</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- STATIC IP RESERVATIONS (ANDROID POPUP / DEDICATED SUBPAGE ROW) -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingPage('acc-static-leases')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Static IP Reservations</span>
                    <span class="setting-label-sub" id="disp_static_leases_count">0 Devices Configured &bull; Permanent DHCP IPv4 reservation</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- DHCP CLIENT HISTORY & DATA CONSUMPTION LEDGER -->
                <div class="setting-row-item setting-clickable-row" onclick="openDhcpHistoryModal()">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">DHCP Client History &amp; Data Consumption</span>
                    <span class="setting-label-sub" id="disp_net_dhcp_history_sub">View 30-day lease records, active/past clients, and cumulative MBs</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn" title="View Device History Ledger" aria-label="View History">
                      <svg viewBox="0 0 24 24" style="width:15px; height:15px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>
                    </button>
                  </div>
                </div>

                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('dhcp_retention_days')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Client History Retention Period</span>
                    <span class="setting-label-sub" id="disp_dhcp_retention_days">30 Days (1 Month) &bull; Low flash wear auto-prune</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- IPV6 DUAL-STACK CONFIGURATION SECTION -->
                <div class="setting-section-divider"></div>
                <div class="setting-section-header">IPv6 Dual-Stack Configuration</div>

                <!-- 1. IPv6 Master Enable Toggle -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">IPv6 Dual-Stack Support</span>
                    <span class="setting-label-sub" id="disp_ipv6_master_sub">Enable native IPv6 packet routing, dual-stack DNS resolution, and client addressing</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="netIpv6MasterToggle" checked onchange="toggleIpv6Master(this.checked); scheduleNetworkAutoSave();">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 2. Live IPv6 Addresses (Informational Row) -->
                <div class="setting-row-item" id="rowIpv6Addrs">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Assigned IPv6 Addresses</span>
                    <span class="setting-label-sub" id="disp_ipv6_addrs">LAN: fd00::1/60 &bull; WAN: 2409:40c1:...</span>
                  </div>
                  <div class="setting-control-col">
                    <span class="setting-status-badge badge-active" id="badgeIpv6Status">DUAL-STACK ONLINE</span>
                  </div>
                </div>

                <!-- 3. WAN IPv6 Mode (Clickable Row) -->
                <div class="setting-row-item setting-clickable-row" id="rowIpv6WanMode" onclick="openSettingModal('ipv6_wan_mode')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">WAN IPv6 Assignment</span>
                    <span class="setting-label-sub" id="disp_ipv6_wan_mode">DHCPv6-PD &amp; SLAAC (Automatic)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 4. Router Advertisement (RA & SLAAC) Toggle -->
                <div class="setting-row-item" id="rowIpv6Ra">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Router Advertisement (RA / SLAAC)</span>
                    <span class="setting-label-sub">Announce router presence and network prefix for client stateless autoconfiguration</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="netIpv6RaToggle" checked onchange="scheduleNetworkAutoSave();">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 5. Stateful DHCPv6 Server Toggle -->
                <div class="setting-row-item" id="rowIpv6Dhcp6">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">DHCPv6 Stateful Server</span>
                    <span class="setting-label-sub">Issue stateful IPv6 address leases and DNS options directly to clients</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="netIpv6Dhcp6Toggle" onchange="scheduleNetworkAutoSave();">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 6. ULA IPv6 Prefix (Clickable Row) -->
                <div class="setting-row-item setting-clickable-row" id="rowIpv6Ula" onclick="openSettingModal('ipv6_ula')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">IPv6 ULA Prefix</span>
                    <span class="setting-label-sub" id="disp_ipv6_ula">fd00::/48 &bull; Unique local address scope</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 7. IPv6 Privacy Extensions Toggle -->
                <div class="setting-row-item" id="rowIpv6Privacy">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">IPv6 Privacy Extensions (RFC 4941)</span>
                    <span class="setting-label-sub">Generate randomized temporary IPv6 addresses to protect device privacy</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="netIpv6PrivacyToggle" onchange="scheduleNetworkAutoSave();">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- PERFORMANCE & HARDWARE ACCELERATION SECTION -->
                <div class="setting-section-divider"></div>
                <div class="setting-section-header">Performance &amp; Hardware Acceleration</div>

                <!-- 1. Hardware Packet Offloading (PPE) -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Hardware Flow Offloading (Qualcomm PPE)</span>
                    <span class="setting-label-sub">Bypass CPU entirely for established flows using Qualcomm Packet Processing Engine</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="netHwFlowToggle" checked onchange="scheduleNetworkAutoSave();">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 2. Software Netfilter Flowtable -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Software Flowtable Offload</span>
                    <span class="setting-label-sub">Kernel netfilter flowtable fast-path bypass for minimum CPU utilization</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="netSwFlowToggle" checked onchange="scheduleNetworkAutoSave();">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 3. TCP MSS Clamping -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">TCP MSS Clamping (PMTU Fix)</span>
                    <span class="setting-label-sub">Automatically adjust TCP MSS to WAN MTU to prevent packet fragmentation on cellular links</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="netMssClampToggle" checked onchange="scheduleNetworkAutoSave();">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 4. DNS Rebind Protection -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">DNS Rebind Attack Protection</span>
                    <span class="setting-label-sub">Block upstream RFC 1918 private IP responses from public DNS forwarders</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="netDnsRebindToggle" checked onchange="scheduleNetworkAutoSave();">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- INTERFACES CONFIGURATION & WAN PPPoE -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-interfaces">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-interfaces')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#0ea5e9;">
                <svg class="svg-icon" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              </div>
              <span class="acc-main-title">Interfaces</span>
            </div>
            <div class="acc-right-action" style="display:flex; align-items:center; gap:8px;">
              <button type="button" class="round-action-btn" onclick="event.stopPropagation(); loadWanInterfaceConfig();" title="Refresh Interfaces" aria-label="Refresh Interfaces">
                <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              </button>
              <span class="card-badge emerald" id="wanStatusBadge">WAN ACTIVE</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div class="setting-section-header">Interface Overview</div>

              <!-- 1. LAN Bridge -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">LAN Bridge (br-lan)</span>
                  <span class="setting-label-sub">10.0.0.1/24 &bull; Switch Bridge Interface (UP)</span>
                </div>
                <div class="setting-control-col">
                  <span class="card-badge sky" id="ifaceLanBridgeState">ACTIVE</span>
                </div>
              </div>

              <!-- 2. LAN Switch -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">LAN Switch Ports (lan1 - lan4)</span>
                  <span class="setting-label-sub">4-Port Hardware Gigabit Ethernet Switch</span>
                </div>
                <div class="setting-control-col">
                  <span class="card-badge emerald" id="ifaceLanSwitchState">4 PORTS</span>
                </div>
              </div>

              <!-- 3. Physical Ethernet WAN -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Physical Ethernet WAN (eth0)</span>
                  <span class="setting-label-sub">Gigabit Ethernet Uplink Interface</span>
                </div>
                <div class="setting-control-col">
                  <span class="card-badge" id="ifaceEthWanState">Ready</span>
                </div>
              </div>

              <!-- 4. IPv6 Carrier -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">IPv6 Carrier (wan6)</span>
                  <span class="setting-label-sub">Kernel SLAAC / Router Advertisement Active</span>
                </div>
                <div class="setting-control-col">
                  <span class="card-badge" style="background:rgba(167,139,250,0.15); color:#a78bfa; border:1px solid rgba(167,139,250,0.3);" id="ifaceIpv6State">Connected</span>
                </div>
              </div>



              <div id="wanProtocolSection">
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">WAN Uplink Protocol Configuration</div>

              <!-- HIDDEN FORM BINDINGS FOR WAN -->
              <div style="display:none;">
                <input type="text" id="wanProtoSelect" value="dhcp">
                <input type="text" id="wanPppoeUser" value="">
                <input type="password" id="wanPppoePass" value="">
                <input type="text" id="wanPppoeService" value="">
                <input type="number" id="wanPppoeMtu" value="1492">
                <input type="text" id="wanStaticIp" value="">
                <input type="text" id="wanStaticNetmask" value="255.255.255.0">
                <input type="text" id="wanStaticGateway" value="">
                <input type="text" id="wanCustomMacInput" value="">
              </div>

              <!-- 1. WAN PROTOCOL (CLICKABLE ROW) -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wan_proto')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">WAN Connection Protocol</span>
                  <span class="setting-label-sub" id="disp_wan_proto">DHCP Client (Dynamic IPv4 from ISP)</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- 2. PPPoE ROUTE ROW (DIRECT TO DEDICATED PPPOE BROADBAND PANEL) -->
              <div id="pppoeRedirectRow" style="display:none;" class="setting-row-item setting-clickable-row" onclick="openSettingPage('acc-pppoe')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">PPPoE Broadband Settings</span>
                  <span class="setting-label-sub" id="disp_wan_pppoe_sub">Configured in dedicated PPPoE Broadband panel &bull; Tap to configure</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- 3. STATIC IP CONFIGURATION (VISIBLE WHEN STATIC) -->
              <div id="wanStaticConfigFields" style="display:none; flex-direction:column; gap:0;">
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wan_static_ip')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Static IPv4 Address</span>
                    <span class="setting-label-sub" id="disp_wan_static_ip">192.168.1.2 (Tap to configure)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wan_static_netmask')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Subnet Netmask</span>
                    <span class="setting-label-sub" id="disp_wan_static_netmask">255.255.255.0 (/24)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wan_static_gateway')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Default Gateway Router</span>
                    <span class="setting-label-sub" id="disp_wan_static_gateway">192.168.1.1 (Tap to configure)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </div>

              <div class="setting-section-divider"></div>
              <div class="setting-section-header">Hardware MAC Address Override (Cloning)</div>

              <!-- 4. WAN CLONED MAC (CLICKABLE ROW) -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wan_custom_mac')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">WAN Cloned MAC Address</span>
                  <span class="setting-label-sub" id="disp_wan_custom_mac">Default Hardware MAC in use</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
              </div> <!-- #wanProtocolSection -->
            </div>
          </div>
        </div>

        <!-- DEDICATED STATIC IP RESERVATIONS VIEW -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-static-leases">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-static-leases')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#06b6d4;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <span class="acc-main-title">Static IP Reservations</span>
            </div>
            <div class="acc-right-action">
              <span style="font-size:11px; font-weight:700; color:var(--text-dim); font-family:var(--font-mono);" id="staticLeasesCountBadge">0 RESERVED</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
                <div>
                  <span class="setting-label-bold">Fixed IPv4 DHCP Leases</span>
                  <span class="setting-label-sub" style="display:block;">Assign persistent IP addresses to devices based on physical MAC hardware address</span>
                </div>
                <button type="button" class="mh-btn" onclick="openSettingModal('add_static_lease')" style="display:inline-flex; align-items:center; gap:6px; font-size:11.5px; padding:7px 14px;">
                  <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>ADD RESERVATION</span>
                </button>
              </div>

              <!-- Static Leases Container -->
              <div id="staticLeasesListContainer" style="display:flex; flex-direction:column; gap:8px;">
                <div style="font-size:11.5px; color:var(--text-dim); font-family:var(--font-mono); padding:16px; background:rgba(255,255,255,0.02); border-radius:8px; text-align:center;">
                  No static DHCP leases registered. Click Add Reservation to create one.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PPPoE BROADBAND CLIENT & SERVER PANEL -->
                <!-- USB WAN (Dedicated Multi-Device USB Tethering & Load Balancing Panel) -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-usb-wan">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-usb-wan')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#0ea5e9;">
                <svg class="svg-icon" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/><path d="M10 12h4"/></svg>
              </div>
              <span class="acc-main-title">USB WAN</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge" style="background:rgba(14,165,233,0.12); color:#38bdf8; border:1px solid rgba(14,165,233,0.3);" id="usbWanGlobalBadge">ACTIVE</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div class="setting-section-header">Connected USB Modems</div>
              <div id="usbWanDeviceListContainer" style="display:flex; flex-direction:column; gap:0;">
                <!-- Populated dynamically via renderUsbWanDevices as standard setting-row-items -->
              </div>

              <div class="setting-section-divider"></div>
              <div class="setting-section-header">Multi-WAN Traffic Strategy</div>
              <div style="display:flex; flex-direction:column; gap:0;">
                <div class="setting-row-item setting-clickable-row" id="usbLbModeRow" onclick="openSettingModal('usb_lb_mode')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Multi-WAN Strategy</span>
                    <span class="setting-label-sub" id="usbLbModeVal">Balanced (Weighted Round-Robin)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Connection Watchdog</span>
                    <span class="setting-label-sub" id="usbWatchdogVal">Enabled</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="usbWatchdogToggle" onchange="saveUsbWanConfig()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-row-item setting-clickable-row" id="usbPingTargetRow" onclick="openSettingModal('usb_ping_target')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Health Check Ping Target</span>
                    <span class="setting-label-sub" id="usbPingTargetVal">1.1.1.1</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('usb_ping_interval')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Health Check Interval</span>
                    <span class="setting-label-sub" id="usbPingIntervalVal">15 Seconds</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('usb_dns_override')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">DNS Nameservers</span>
                    <span class="setting-label-sub" id="usbDnsOverrideVal">1.1.1.1, 8.8.8.8</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('usb_tether_proto')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Tethering Protocol Driver</span>
                    <span class="setting-label-sub" id="usbTetherProtoVal">RNDIS</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Auto-Reconnect on Disconnect</span>
                    <span class="setting-label-sub" id="usbAutoReconnectVal">Enabled</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="usbAutoReconnectToggle" checked onchange="saveUsbWanConfig()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('restart_usb_modem')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Restart USB Modems</span>
                    <span class="setting-label-sub" id="usbRestartModemVal">Select interface, renew DHCP or reboot phone via ADB</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

<div class="settings-card settings-detail-panel accordion-item" id="acc-pppoe">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-pppoe')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#06b6d4;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3v3H7v-3H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><line x1="8" y1="10" x2="8" y2="13"/><line x1="12" y1="10" x2="12" y2="13"/><line x1="16" y1="10" x2="16" y2="13"/></svg>
              </div>
              <span class="acc-main-title">PPPoE Broadband</span>
            </div>
            <div class="acc-right-action">
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- PART A: PPPoE CLIENT -->
              <div class="setting-section-header">PPPoE Client (ISP Broadband Dialer)</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">PPPoE WAN Client</span>
                  <span class="setting-label-sub" id="pppoeClientStatusSub">Disabled &bull; ISP Broadband dialer over WAN Ethernet</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="pppoeClientMasterToggle" onchange="togglePppoeClient(this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- PPPoE CLIENT LIVE TELEMETRY ROW -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Connection State &amp; IP</span>
                  <span class="setting-label-sub" id="pppoeClientIpText">Disconnected &bull; Gateway: -- &bull; DNS: --</span>
                </div>
                <div class="setting-control-col">
                  <span id="pppoeClientUptime" style="font-size:11px; font-weight:700; font-family:var(--font-mono); color:var(--text-dim);">Offline</span>
                </div>
              </div>

              <!-- PPPoE USERNAME & PASSWORD -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('pppoe_client_creds')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">ISP Account Credentials</span>
                  <span class="setting-label-sub" id="disp_pppoe_user_desc">User: Not set &bull; Tap to configure username &amp; password</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- SERVICE & ACCESS CONCENTRATOR -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('pppoe_client_ac')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Service &amp; Concentrator (AC)</span>
                  <span class="setting-label-sub" id="disp_pppoe_ac_desc">Auto Discovery &bull; Optional ISP AC and Service Name</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- CLONE MAC & MTU -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('pppoe_client_mac')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">MAC Clone &amp; MTU Size</span>
                  <span class="setting-label-sub" id="disp_pppoe_mac_desc">MTU: 1492 &bull; Hardware Default MAC</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-section-divider"></div>

              <!-- PART B: PPPoE SERVER -->
              <div class="setting-section-header">PPPoE Server (LAN Access Concentrator)</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">PPPoE Access Server</span>
                  <span class="setting-label-sub" id="pppoeServerStatusSub">Disabled &bull; Local PPPoE Concentrator for LAN subscribers</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="pppoeServerMasterToggle" onchange="togglePppoeServer(this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- SERVER POOL & NETWORK CONFIG -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('pppoe_server_config')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Server IP Pool &amp; Network</span>
                  <span class="setting-label-sub" id="disp_pppoe_srv_network">Local: 10.0.0.1 &bull; Pool: 10.0.0.150 - 10.0.0.220 &bull; DNS: 10.0.0.1</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- SUBSCRIBER ACCOUNTS -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingPage('acc-pppoe-users')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Subscriber Accounts &amp; CHAP Secrets</span>
                  <span class="setting-label-sub" id="disp_pppoe_users_count">0 accounts configured &bull; Tap to manage users</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- ACTIVE SESSIONS -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Connected PPPoE Subscribers</span>
                  <span class="setting-label-sub" id="pppoeActiveSessionsText">No active subscriber sessions</span>
                </div>
                <div class="setting-control-col">
                  <button type="button" class="round-action-btn" onclick="loadPppoeConfig()" title="Refresh Sessions">
                    <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-card settings-detail-panel" id="acc-pppoe-users" style="display:none;">
          <div class="settings-card-header">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#06b6d4;">
                <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M17 11h5M19.5 8.5v5"/></svg>
              </div>
              <span class="acc-main-title">PPPoE Subscriber Accounts</span>
            </div>
          </div>
          <div class="settings-card-body">
            <div id="pppoeSubscribersList" class="pppoe-subscribers-list">
              <div class="setting-row-item"><div class="setting-label-col"><span class="setting-label-sub">Loading subscribers…</span></div></div>
            </div>
          </div>
        </div>

        <!-- DEDICATED WI-FI & WIRELESS HOTSPOT ACCORDION -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-wifi">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-wifi')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#06b6d4;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
              </div>
              <span class="acc-main-title">Wi-Fi &amp; Hotspot</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge" style="background:rgba(6,182,212,0.15); color:#06b6d4; border:1px solid rgba(6,182,212,0.3);">DUAL-BAND</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- MASTER WI-FI POWER SWITCH -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Wi-Fi Gateway Master Power</span>
                  <span class="setting-label-sub">Enable or disable all wireless transmitters dynamically</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="wifiMasterToggle" onchange="toggleWifiMasterPower(this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- 2.4 GHz BAND (QUALCOMM IPQ9574 WCSS) -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">2.4 GHz High-Efficiency (Wi-Fi 6)</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">2.4 GHz Radio Power</span>
                  <span class="setting-label-sub">Qualcomm IPQ9574 WCSS integrated wireless radio</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="wifi2gEnable" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- 2.4 GHz HIDDEN FORM STATE -->
              <div style="display:none;">
                <input type="text" id="wifi2gSsid" value="MAXNET">
                <select id="wifi2gEnc">
                  <option value="none">Open (No Security)</option>
                  <option value="psk2">WPA2-PSK (AES)</option>
                  <option value="sae">WPA3-SAE</option>
                  <option value="sae-mixed" selected>WPA2/WPA3 Mixed</option>
                </select>
                <input type="password" id="wifi2gKey" value="">
                <select id="wifi2gChannel">
                  <option value="1">Channel 1 (2412 MHz)</option>
                  <option value="6">Channel 6 (2437 MHz)</option>
                  <option value="11">Channel 11 (2462 MHz)</option>
                  <option value="auto" selected>Auto Select</option>
                </select>
                <select id="wifi2gHtmode">
                  <option value="HE20" selected>HE20 (20 MHz)</option>
                  <option value="HE40">HE40 (40 MHz)</option>
                  <option value="HT20">HT20 (Legacy)</option>
                </select>
              </div>

              <!-- 2.4 GHz CLICKABLE ROWS WITH POPUP MODAL -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wifi24_ssid')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Network Name (SSID)</span>
                  <span class="setting-label-sub" id="disp_wifi24_ssid">MAXNET</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wifi24_enc')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Security Mode</span>
                  <span class="setting-label-sub" id="disp_wifi24_enc">WPA2/WPA3 Mixed</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wifi24_key')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Wi-Fi Password</span>
                  <span class="setting-label-sub" id="disp_wifi24_key">••••••••</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wifi24_channel')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Operating Channel</span>
                  <span class="setting-label-sub" id="disp_wifi24_channel">Auto Select</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wifi24_bandwidth')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Channel Bandwidth</span>
                  <span class="setting-label-sub" id="disp_wifi24_bandwidth">HE20 (20 MHz)</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Hide Network SSID</span>
                  <span class="setting-label-sub">Do not broadcast network name in beacon frames</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="wifi2gHidden">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- 5 GHz BAND (QUALCOMM QCN9074 PINE) -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">5 GHz Ultra-Speed (Wi-Fi 6)</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">5 GHz Radio Power</span>
                  <span class="setting-label-sub">Qualcomm QCN9074 4x4 high-performance PCIe radio</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="wifi5gEnable" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- 5 GHz HIDDEN FORM STATE -->
              <div style="display:none;">
                <input type="text" id="wifi5gSsid" value="MAXNET-5G">
                <select id="wifi5gEnc">
                  <option value="none">Open (No Security)</option>
                  <option value="psk2">WPA2-PSK (AES)</option>
                  <option value="sae">WPA3-SAE</option>
                  <option value="sae-mixed" selected>WPA2/WPA3 Mixed</option>
                </select>
                <input type="password" id="wifi5gKey" value="">
                <select id="wifi5gChannel">
                  <option value="36">Channel 36 (5180 MHz)</option>
                  <option value="40">Channel 40 (5200 MHz)</option>
                  <option value="44">Channel 44 (5220 MHz)</option>
                  <option value="48">Channel 48 (5240 MHz)</option>
                  <option value="149">Channel 149 (5745 MHz)</option>
                  <option value="153">Channel 153 (5765 MHz)</option>
                  <option value="157">Channel 157 (5785 MHz)</option>
                  <option value="161">Channel 161 (5805 MHz)</option>
                  <option value="auto" selected>Auto Select</option>
                </select>
                <select id="wifi5gHtmode">
                  <option value="HE80">HE80 (80 MHz)</option>
                  <option value="HE160" selected>HE160 (160 MHz)</option>
                  <option value="HE40">HE40 (40 MHz)</option>
                  <option value="HE20">HE20 (20 MHz)</option>
                </select>
              </div>

              <!-- 5 GHz CLICKABLE ROWS WITH POPUP MODAL -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wifi5_ssid')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Network Name (SSID)</span>
                  <span class="setting-label-sub" id="disp_wifi5_ssid">MAXNET-5G</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wifi5_enc')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Security Mode</span>
                  <span class="setting-label-sub" id="disp_wifi5_enc">WPA2/WPA3 Mixed</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wifi5_key')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Wi-Fi Password</span>
                  <span class="setting-label-sub" id="disp_wifi5_key">••••••••</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wifi5_channel')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Operating Channel</span>
                  <span class="setting-label-sub" id="disp_wifi5_channel">Auto Select</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('wifi5_bandwidth')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Channel Bandwidth</span>
                  <span class="setting-label-sub" id="disp_wifi5_bandwidth">HE160 (160 MHz)</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Hide Network SSID</span>
                  <span class="setting-label-sub">Do not broadcast network name in beacon frames</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="wifi5gHidden">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>


              <!-- ACTION BAR -->

            </div>
          </div>
        </div>

        <!-- DEDICATED WI-FI CLIENTS PAGE -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-wifi-clients">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-wifi-clients')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#06b6d4;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
              </div>
              <span class="acc-main-title">Wi-Fi Clients</span>
            </div>
            <div class="acc-right-action">
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content"><div class="settings-card-body">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:0 2px 8px;">
              <div class="setting-label-col">
                <span class="setting-label-bold">Connected Wi-Fi Clients</span>
                <span class="setting-label-sub">Stations on the 2.4 GHz and 5 GHz radios</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
                <span class="card-badge sky" id="wifiClientCount">-- CLIENTS</span>
                <button type="button" class="round-action-btn" onclick="fetchWifiClients()" title="Refresh Wi-Fi Clients" aria-label="Refresh Wi-Fi Clients"><svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2;"><path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><polyline points="21 3 21 8 16 8"/></svg></button>
              </div>
            </div>
            <div id="wifiClientsContainer" style="display:flex; flex-direction:column; gap:6px;"><div style="text-align:center; color:var(--text-dim); padding:24px; font-size:12px;">Loading Wi-Fi stations...</div></div>
          </div></div>
        </div>

        <!-- DEDICATED WIRELESS REPEATER SETTING PANEL (WISP / CLIENT WAN) -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-repeater">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-repeater')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#38bdf8;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/><path d="M12 3v6M9 6l3-3 3 3"/></svg>
              </div>
              <span class="acc-main-title">Wireless Repeater</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge sky" id="repeaterStatusBadge">DISCONNECTED</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div class="setting-row-item" style="padding:12px 14px; margin-bottom:8px;">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Wireless Repeater Controls</span>
                  <span class="setting-label-sub">Enable to show nearby network scan and refresh controls</span>
                </div>
                <div class="toggle-wrap-cell"><label class="toggle-switch"><input type="checkbox" id="repeaterEnabledToggle" onchange="toggleRepeaterEnabled(this.checked)"><span class="toggle-slider"></span></label></div>
              </div>
              <!-- ACTIVE CONNECTION STATUS ROW (IF CONNECTED) -->
              <div id="repeaterActiveCard" style="display:none; margin-bottom:12px;">
                <div class="setting-row-item" style="padding:12px 14px; background:rgba(56,189,248,0.06); border:1px solid rgba(56,189,248,0.2); border-radius:10px;">
                  <div class="setting-label-col">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span class="card-badge emerald" style="font-size:9px; font-weight:800;">ACTIVE UPLINK</span>
                      <span class="setting-label-bold" id="repeaterConnectedSsid">--</span>
                    </div>
                    <span class="setting-label-sub" id="repeaterConnectedInfo">IP: -- • Band: -- • Signal: --</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn btn-danger-action" onclick="disconnectRepeaterWifi()" title="Disconnect Wi-Fi Uplink">
                      <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div id="repeaterScanControls" style="display:none;">
              <!-- TOP CONTROL ROW: BOLD LABEL, SUBTITLE BENEATH, ROUND SCAN BUTTON ON RIGHT -->
              <div class="setting-row-item" style="padding: 12px 14px; margin-bottom: 8px;">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Nearby Wi-Fi Access Points</span>
                  <span class="setting-label-sub" id="repeaterScanSub">Scan starts when repeater is enabled; choose a hotspot to connect</span>
                </div>
                <div class="setting-control-col">
                  <button type="button" class="round-action-btn" id="btnScanRepeater" onclick="scanRepeaterWifi()" title="Search nearby Wi-Fi access points" aria-label="Search Wi-Fi access points">
                    <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  </button>
                </div>
              </div>

              <!-- SCAN RESULTS SECTION -->
              <div class="setting-section-header" style="margin-top:10px;">Nearby Wi-Fi Networks</div>
              <div id="repeaterScanResultsList" style="display:flex; flex-direction:column; gap:4px;">
                <div style="font-size:12px; color:var(--text-dim); font-family:var(--font-mono); padding:20px; text-align:center;">
                  Enable the repeater to search nearby 2.4 GHz and 5 GHz access points.
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        <!-- DEDICATED NOTIFICATIONS & ALERTS PANEL (PAGE VIEW, NO POPUPS) -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-notifications">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-notifications')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#f59e0b;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <span class="acc-main-title">Notifications</span>
            </div>
            <div class="acc-right-action" style="display:flex; align-items:center; gap:8px;">
              <button type="button" class="round-action-btn" onclick="event.stopPropagation(); openNotificationSettingsModal();" title="Notification Settings" aria-label="Notification Settings">
                <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
              <span class="card-badge amber" id="notifActiveBadge">0 ALERTS</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body" style="padding: 10px 14px;">
              <!-- NOTIFICATIONS LIST (PURE NOTIFICATIONS ONLY) -->
              <div id="notificationsListPageContainer" style="display:flex; flex-direction:column; gap:0; border:1px solid var(--border-sub); border-radius:10px; overflow:hidden;">
                <!-- Rendered dynamically via loadNotificationsPage -->
              </div>
            </div>
          </div>
        </div>

        <!-- WEBHOOKS & ALERT FORWARDING SETTING PANEL -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-webhooks">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-webhooks')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#0ea5e9;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </div>
              <span class="acc-main-title">Webhooks</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge emerald" id="webhookStatusBadge">ONLINE</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- MASTER TOGGLE -->
              <div class="setting-section-header">Master Forwarding Control</div>
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Webhook Alerts Forwarding</span>
                  <span class="setting-label-sub" id="dispWebhookMasterSub">Forward system alerts and event notifications externally</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="webhookMasterToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- TELEGRAM INTEGRATION -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">Telegram Bot Forwarding</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Telegram Alerts</span>
                  <span class="setting-label-sub" id="dispTgStatusSub">Forward alerts directly to your Telegram chat or channel</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="tgEnableToggle" onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('webhook_tg_token')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Telegram Bot Token</span>
                  <span class="setting-label-sub" id="disp_webhook_tg_token">Click to configure Bot Token from @BotFather</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('webhook_tg_chat_id')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Telegram Chat ID</span>
                  <span class="setting-label-sub" id="disp_webhook_tg_chat_id">Click to configure Chat or Channel ID</span>
                </div>
                <div class="setting-control-col" style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="round-action-btn" title="Send Test Telegram Alert" onclick="event.stopPropagation(); testWebhookProvider('telegram', this)">
                    <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </button>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </div>

              <!-- DISCORD INTEGRATION -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">Discord Webhook Forwarding</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Discord Alerts</span>
                  <span class="setting-label-sub" id="dispDiscordStatusSub">Post router event embeds into a Discord text channel</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="discordEnableToggle" onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('webhook_discord_url')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Discord Webhook URL</span>
                  <span class="setting-label-sub" id="disp_webhook_discord_url">Click to configure https://discord.com/api/webhooks/...</span>
                </div>
                <div class="setting-control-col" style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="round-action-btn" title="Send Test Discord Alert" onclick="event.stopPropagation(); testWebhookProvider('discord', this)">
                    <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </button>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </div>

              <!-- NTFY.SH INTEGRATION -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">ntfy.sh Push Notifications</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">ntfy.sh Mobile Push</span>
                  <span class="setting-label-sub" id="dispNtfyStatusSub">Simple, open HTTP push alerts to Android / iOS devices</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="ntfyEnableToggle" onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('webhook_ntfy_url')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">ntfy Topic URL</span>
                  <span class="setting-label-sub" id="disp_webhook_ntfy_url">https://ntfy.sh/maxnet-alerts</span>
                </div>
                <div class="setting-control-col" style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="round-action-btn" title="Send Test ntfy Alert" onclick="event.stopPropagation(); testWebhookProvider('ntfy', this)">
                    <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </button>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </div>

              <!-- FORWARDED EVENT TRIGGERS -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">Forwarded Event Triggers</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">CPU Spikes (&gt; 85%)</span>
                  <span class="setting-label-sub">Alert when router SoC processor exceeds 85% load threshold</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evCpuToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">New Device Connections</span>
                  <span class="setting-label-sub">Alert when an unrecognized MAC or client joins the network</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evDeviceToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">PPPoE &amp; WAN Link Drops</span>
                  <span class="setting-label-sub">Alert on broadband dialer termination or carrier drop</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evWanToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">DHCP &amp; IP Conflicts</span>
                  <span class="setting-label-sub">Alert when DHCP pool is exhausted or lease collisions occur</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evDhcpToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Firmware &amp; OS Updates</span>
                  <span class="setting-label-sub">Alert when a new MAXNET Gateway OS build is published</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evUpdateToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Security &amp; Brute-Force Bans</span>
                  <span class="setting-label-sub">Alert on IP lockouts after repeated failed logins or scan floods</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evSecurityToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Router WebUI &amp; SSH Logins</span>
                  <span class="setting-label-sub">Alert on administrator logins and invalid authentication attempts</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evRouterLoginToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Per-User High Data Consumption</span>
                  <span class="setting-label-sub">Alert when a client device exceeds bandwidth/data quota threshold</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evDataUsageToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('webhook_data_quota')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Data Quota Alert Threshold</span>
                  <span class="setting-label-sub" id="disp_webhook_data_quota">1024 MB (1.0 GB)</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Ethernet Cable Plugged / Unplugged</span>
                  <span class="setting-label-sub">Alert on physical LAN/WAN port cable link state changes</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evLanPlugToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">USB Device &amp; Modem Hotplug</span>
                  <span class="setting-label-sub">Alert when USB modems, phones, or storage drives connect/disconnect</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evUsbPlugToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Router Reboot &amp; Power Events</span>
                  <span class="setting-label-sub">Alert when router reboots or recovers from power loss/outage</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evPowerToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Custom IP Online / Offline Watchdog</span>
                  <span class="setting-label-sub">Alert when monitored local or remote host IP goes offline/online</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evCustomIpToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('webhook_custom_ip')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Monitored Watchdog Target IP</span>
                  <span class="setting-label-sub" id="disp_webhook_custom_ip">10.0.0.2</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">18+ Adult Content Visit Detection</span>
                  <span class="setting-label-sub">Alert when network clients query or access adult/restricted domains</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evAdultToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">WiFi Client Association &amp; Roaming</span>
                  <span class="setting-label-sub">Alert on wireless client connect, disconnect, and deauth events</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="evWifiToggle" checked onchange="saveWebhooksConfig()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. NETWORK TOPOLOGY & PORT LAYER MAPPING (RECURSIVE TREE) -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-topo-layers">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-topo-layers')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#38bdf8;">
                <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <span class="acc-main-title">Network Topology</span>
            </div>
            <div class="acc-right-action">
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('topology_type')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openSettingModal('topology_type');}">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Topology Type</span>
                  <span class="setting-label-sub" id="topologyDiscoveryModeSummary">Live bridge &amp; Wi-Fi discovery</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- Inline validation notification bar (Shown ONLY on warning/invalid, NEVER valid green box) -->
              <div id="topoValidationNotice" class="topo-validation-box invalid" style="display:none; margin:10px 14px;"></div>

              <!-- TOPOLOGY DISPLAY & ANIMATION PREFERENCES (CLEAN, NATIVE SECTION) -->
              <div id="topoPreferencesSection" style="display:flex; flex-direction:column; gap:8px; margin:10px 0;">
                <!-- Dynamically populated via renderTopologyPreferencesUI -->
              </div>

              <!-- RECURSIVE TOPOLOGY TREE CONTAINER -->
              <div id="topoLayerPortsContainer" style="display:flex; flex-direction:column; gap:14px;">
                <!-- Dynamically populated via renderTopologyLayersUI -->
              </div>
            </div>
          </div>
        </div>

        <!-- 3. DHCP CLIENTS -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-lan-clients">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-lan-clients')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#10b981;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <span class="acc-main-title">DHCP Clients</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge emerald" id="clientActiveCount">-- ACTIVE</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- 1. DHCP CLIENTS LIST VIEW -->
              <div id="dhcpClientsListView" style="display:flex; flex-direction:column; gap:10px;">
                <!-- PREMIUM DHCP SEARCH BAR WITH MODERN RADIUS & CLEAR BUTTON -->
                <div class="dhcp-search-wrap">
                  <div class="dhcp-search-bar">
                    <svg class="dhcp-search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="dhcpClientsSearchInput" class="dhcp-search-input" placeholder="Search from connected devices..." oninput="onSearchClients(this.value)">
                    <button type="button" id="dhcpSearchClearBtn" class="dhcp-search-clear" onclick="clearDhcpClientSearch()" style="display:none;" title="Clear search">✕</button>
                  </div>
                </div>

                <!-- Simple Clean Clients Cards Container -->
                <div id="fullClientsCards" style="display:flex; flex-direction:column; gap:6px;">
                  <!-- Populated dynamically via renderClientsCards -->
                </div>
              </div>

              <!-- 2. DEDICATED DEVICE DETAIL PAGE VIEW -->
              <div id="dhcpClientDetailView" style="display:none; flex-direction:column; gap:6px;">
                <!-- Populated dynamically via renderDhcpClientDetail -->
              </div>
            </div>
          </div>
        </div>

        <!-- 2. GAMING & LOW PING OPTIMIZATION -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-gaming">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-gaming')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#00d2ff;">
                <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>
              </div>
              <span class="acc-main-title">Gaming Mode</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge" style="background:rgba(0,210,255,0.15); color:#00d2ff; border-color:rgba(0,210,255,0.35);">LOW PING</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div style="display:flex; flex-direction:column; gap:8px;">
                <!-- 1. Master Low Ping Toggle -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Low Ping Mode</span>
                    <span class="setting-label-sub">Kernel packet scheduling and low-latency queuing discipline</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="gameMasterToggle" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 2. Bufferbloat Killer -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Bufferbloat Guard</span>
                    <span class="setting-label-sub">Active queue management preventing packet bloat</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="gameBbloatToggle" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 3. Strict Real-Time Packet Prioritization -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Real-Time Packet Priority</span>
                    <span class="setting-label-sub">DSCP Expedited Forwarding for gaming and voice</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="gameQosToggle" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 4. TCP FastOpen & Low-Latency TCP -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">TCP FastOpen &amp; BBR</span>
                    <span class="setting-label-sub">Zero RTT connection handshakes with BBR congestion control</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="gameTcpToggle" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 5. Low-Latency Anycast DNS Path -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Anycast Low-Latency DNS</span>
                    <span class="setting-label-sub">Lowest-RTT Anycast DNS routing path</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="gameDnsToggle" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 6. 4-Core CPU Interrupt Steering -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Quad-Core RPS Steering</span>
                    <span class="setting-label-sub">Hardware packet interrupt steering across all 4 CPU cores</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <span style="font-size:11px; font-weight:800; font-family:var(--font-mono); color:#10b981; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); padding:3px 8px; border-radius:6px;">4 CORES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. DEVICE INFO & COMPREHENSIVE HARDWARE SPECIFICATIONS -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-sys-info">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-sys-info')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#38bdf8;">
                <svg class="svg-icon" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
              </div>
              <span class="acc-main-title">Device Info</span>
            </div>
            <div class="acc-right-action">
              <button type="button" class="round-action-btn" onclick="event.stopPropagation(); fetchDeviceInfo();" title="Refresh Hardware Info" style="width:28px; height:28px; min-width:28px; margin-right:8px;">
                <svg viewBox="0 0 24 24" style="width:13px; height:13px;"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              </button>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- DEVICE HEALTH ROW: STANDARD SETTING ROW WITH STATUS CAPSULE ON RIGHT -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Device Health</span>
                  <span class="setting-label-sub" id="deviceHealthSummarySub">All Systems Nominal &bull; CPU, RAM, and Thermals in Optimal Range</span>
                </div>
                <div class="setting-control-col">
                  <span class="setting-status-badge badge-active" id="deviceHealthStatusBadge">HEALTHY</span>
                </div>
              </div>

              <!-- SECTION 1: PROCESSOR & SOC -->
              <div class="setting-section-header">Processor &amp; SoC</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">SoC Model &amp; Architecture</span>
                  <span class="setting-label-sub" id="sysCpuModel">Qualcomm IPQ9574 &bull; 4 Cores &bull; aarch64 (ARMv8 64-bit)</span>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">CPU Utilization</span>
                  <span class="setting-label-sub" id="sysLoadAvg">Load: 0.20, 0.25, 0.30 &bull; BogoMIPS: 48.00</span>
                </div>
              </div>

              <!-- SECTION 2: MEMORY (RAM) & ZRAM -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">System Memory & ZRAM Swap</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Physical Hardware RAM (DDR4)</span>
                  <span class="setting-label-sub" id="sysRamSub">Used: -- MB &bull; Free: -- MB &bull; Avail: -- MB</span>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">ZRAM Compressed Swap Engine</span>
                  <span class="setting-label-sub" id="sysZramSub">Algorithm: LZO-RLE &bull; Pool: 215 MB &bull; Used: 0 MB &bull; Ratio: 1.00x</span>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Total Working Memory Pool</span>
                  <span class="setting-label-sub" id="sysMemPoolSub">Total: 648 MB &bull; Available: -- MB &bull; Active Usage: --%</span>
                </div>
              </div>

              <!-- SECTION 3: THERMAL SENSORS (ALL 13 ZONES) -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">
                <span>Hardware Thermal Sensors</span>
                <span id="sysThermalCount" style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono); font-weight:normal;">13 Zones</span>
              </div>
              <div id="sysThermalsContainer" style="display:flex; flex-direction:column; gap:4px;">
                <!-- Populated dynamically via renderDeviceInfoThermals -->
              </div>

              <!-- SECTION 4: STORAGE & FLASH PARTITIONS -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">Storage Partitions &amp; Flash</div>
              <div id="sysStorageContainer" style="display:flex; flex-direction:column; gap:4px;">
                <!-- Populated dynamically via renderDeviceInfoStorage -->
              </div>

              <!-- SECTION 5: NETWORK INTERFACES & PHYSICAL PORTS -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">Network Interfaces &amp; Physical Ports</div>
              <div id="sysPortsContainer" style="display:flex; flex-direction:column; gap:4px;">
                <!-- Populated dynamically via renderDeviceInfoPorts -->
              </div>

              <!-- SECTION 6: SYSTEM & FIRMWARE -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">System &amp; Firmware</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Device Board Model</span>
                  <span class="setting-label-sub" id="sysBoardModel">JioRouter AX6000 JIDU6J11-6811</span>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Linux Kernel Version</span>
                  <span class="setting-label-sub" id="sysKernelVersion" style="font-family:var(--font-mono);">Linux 6.18</span>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">System Uptime &amp; Clock</span>
                  <span class="setting-label-sub" id="sysUptimeClock">--</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. ABOUT DEVELOPER & SYSTEM ARCHITECTURE -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-device-info">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-device-info')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#8b5cf6;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span class="acc-main-title">About Developer</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge" style="background:rgba(139,92,246,0.15); color:#a78bfa; border-color:rgba(139,92,246,0.35);">ENGINEER</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div style="display:flex; flex-direction:column; gap:4px;">
                <!-- 1. Lead Developer Profile -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Lead Developer &amp; Systems Architect</span>
                    <span class="setting-label-sub">Mahendra Mali (Max) &bull; Primary Firmware Author</span>
                  </div>
                  <div class="setting-control-col">
                    <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, #8b5cf6, #3b82f6); display:flex; align-items:center; justify-content:center; color:#ffffff; font-weight:800; font-size:15px;">M</div>
                  </div>
                </div>

                <!-- Donation & Support via UPI -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Donation &amp; Support (UPI)</span>
                    <span class="setting-label-sub" id="devUpiText" style="font-family:var(--font-mono); font-size:12.5px; font-weight:700;">9824584454@ybl</span>
                    <span class="setting-label-sub" style="font-size:10.5px; margin-top:2px;">Mahendra Mali (Max) &bull; Direct contribution to MAXNET development</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn" onclick="navigator.clipboard.writeText('9824584454@ybl'); if(typeof showNotificationToast === 'function') showNotificationToast('Copied UPI ID: 9824584454@ybl'); else if(typeof showToast === 'function') showToast('Copied UPI ID: 9824584454@ybl', 'success');" title="Copy UPI ID" aria-label="Copy UPI ID" style="width:34px; height:34px; min-width:34px;">
                      <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                </div>

                <!-- 2. Developer Bio & Background -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Developer Bio</span>
                    <span class="setting-label-sub">Embedded Linux systems engineer and architect of MAXNET custom firmware for Qualcomm IPQ enterprise routing platforms. Focused on high-speed USB multi-wan offloading, wireless network optimization, and lightweight carrier-grade routing stacks.</span>
                  </div>
                </div>

                <!-- 3. Open-Source Philosophy -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Project Philosophy &amp; Community</span>
                    <span class="setting-label-sub">Built for the open-source community with Linux &amp; MAXNET foundations. Distributed under GPLv2 &amp; MIT licenses. Dedicated to transparent, high-performance, and resilient home &amp; enterprise networking.</span>
                  </div>
                </div>

                <!-- Official Website -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Official Website</span>
                    <a href="https://ohhmax.github.io/maxnet" target="_blank" rel="noopener noreferrer" class="setting-label-sub" style="color:var(--accent); text-decoration:none; font-family:var(--font-mono); font-size:12px; font-weight:600;">https://ohhmax.github.io/maxnet</a>
                  </div>
                  <div class="setting-control-col">
                    <a href="https://ohhmax.github.io/maxnet" target="_blank" rel="noopener noreferrer" class="round-action-btn" title="Open Website" aria-label="Open Website" style="text-decoration:none; width:34px; height:34px; min-width:34px;">
                      <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </a>
                  </div>
                </div>

                <!-- Telegram Channel -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Telegram Channel</span>
                    <a href="https://t.me/the_max_lab" target="_blank" rel="noopener noreferrer" class="setting-label-sub" style="color:var(--accent); text-decoration:none; font-family:var(--font-mono); font-size:12px; font-weight:600;">t.me/the_max_lab</a>
                  </div>
                  <div class="setting-control-col">
                    <a href="https://t.me/the_max_lab" target="_blank" rel="noopener noreferrer" class="round-action-btn" title="Open Telegram Channel" aria-label="Open Telegram Channel" style="text-decoration:none; width:34px; height:34px; min-width:34px;">
                      <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

                <!-- 4. TAILSCALE MESH VPN -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-tailscale">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-tailscale')">
            <div class="acc-title-left">
              <div class="acc-icon-box">
                <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><line x1="5.5" y1="7.5" x2="10" y2="10.5"/><line x1="18.5" y1="7.5" x2="14" y2="10.5"/><line x1="5.5" y1="16.5" x2="10" y2="13.5"/><line x1="18.5" y1="16.5" x2="14" y2="13.5"/></svg>
              </div>
              <span class="acc-main-title">Tailscale</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge emerald" id="tsStatusBadge">RUNNING</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- HIDDEN FORM BINDINGS -->
              <div style="display:none;">
                <input type="text" id="tsHostname" value="Maxnet-Gateway">
                <input type="password" id="tsAuthKeyInput" placeholder="tskey-auth-...">
              </div>

              <!-- NOT INSTALLED OR OFFLINE NOTICE (HIDDEN BY DEFAULT) -->
              <div id="tsNotInstalledNotice" class="setting-row-item" style="display:none; background:rgba(239,68,68,0.06); border:1px solid rgba(239,68,68,0.2); border-radius:10px;">
                <div class="setting-label-col">
                  <span class="setting-label-bold" style="color:#ef4444;">Tailscale Not Installed</span>
                  <span class="setting-label-sub">Kernel daemon &lsquo;tailscaled&rsquo; was not found. Install from Package Manager.</span>
                </div>
                <div class="setting-control-col">
                  <button type="button" class="round-action-btn" onclick="openSettingPage('acc-packages')" title="Open Packages">
                    <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  </button>
                </div>
              </div>

              <!-- MASTER SERVICE SWITCH (ALWAYS VISIBLE) -->
              <div class="setting-section-header">Mesh Service</div>
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Tailscale Service</span>
                  <span class="setting-label-sub">Encrypted WireGuard zero-trust mesh network overlay</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="tsMasterToggle" checked onchange="toggleTailscaleService(this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- ACCOUNT PROFILE ROW (ALWAYS VISIBLE) -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold" id="tsUserDisplayName">Tailscale Account</span>
                  <span class="setting-label-sub" id="tsUserLoginName">Not connected to a tailnet</span>
                </div>
                <div class="setting-control-col">
                  <div id="tsUserAvatarWrapper" style="width:36px; height:36px; min-width:36px; border-radius:50%; background:var(--card-inner, #161822); border:1px solid rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0;">
                    <svg id="tsUserAvatarBlank" viewBox="0 0 24 24" style="width:18px; height:18px; fill:none; stroke:var(--text-dim, #71717a); stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round;">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <img id="tsUserAvatarImg" src="" alt="Profile" style="width:100%; height:100%; object-fit:cover; display:none;" onerror="this.style.display='none'; document.getElementById('tsUserAvatarBlank').style.display='block';">
                  </div>
                </div>
              </div>

              <!-- ==================== LOGGED-OUT ONLY SETTINGS ==================== -->
              <!-- Shown only when Tailscale is NOT signed in or stopped -->
              <div id="tsLoggedOutSettings">
                <div class="setting-section-divider"></div>
                <div class="setting-section-header">Sign In Methods</div>

                <!-- 1. BROWSER LOGIN ROW (CLEAN STANDARD SETTING ROW) -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Web Browser Login</span>
                    <span class="setting-label-sub" id="tsWebLoginSub">Generate authentication link to sign in via browser</span>
                  </div>
                  <div class="setting-control-col" style="display:flex; align-items:center; gap:6px;">
                    <button type="button" class="round-action-btn" id="btnTsGenerateLink" onclick="startTailscaleWebLogin()" title="Generate Login Link">
                      <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </button>
                    <a id="btnTsOpenLink" href="#" target="_blank" class="round-action-btn" title="Open Authentication Link in New Tab" style="display:none; text-decoration:none;">
                      <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                    <button type="button" class="round-action-btn" id="btnTsCopyLink" onclick="copyTsAuthUrl()" title="Copy Link to Clipboard" style="display:none;">
                      <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                </div>

                <!-- 2. AUTH KEY ROW (CLEAN STANDARD CLICKABLE ROW) -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('ts_authkey')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Tailscale Auth Key</span>
                    <span class="setting-label-sub" id="disp_ts_authkey_unlogged">Connect using pre-authenticated key (tskey-auth-...)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </div>

              <!-- ==================== CONNECTED-ONLY SETTINGS ==================== -->
              <!-- Shown only when Tailscale IS logged in and running -->
              <div id="tsConnectedSettings" style="display:none;">
                <div class="setting-section-divider"></div>

                <!-- ADMIN CONSOLE ROW -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Admin Console</span>
                    <span class="setting-label-sub">Open in web</span>
                  </div>
                  <div class="setting-control-col">
                    <a href="https://login.tailscale.com/admin" target="_blank" class="round-action-btn" title="Open Admin Console in Browser" style="text-decoration:none;">
                      <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>

                <!-- TAILNET MESH DOMAIN ROW -->
                <div class="setting-row-item" id="tsDomainRow">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Tailnet Mesh Domain</span>
                    <span class="setting-label-sub" id="tsTailnetDomain">--</span>
                  </div>
                  <div class="setting-control-col">
                    <span class="setting-status-badge badge-active" id="tsMeshNodesBadge">
                      <span id="tsOnlineCountBadge">1 Online</span> / <span id="tsTotalCountBadge">1 Total</span>
                    </span>
                  </div>
                </div>

                <!-- REGISTERED TAILSCALE DEVICES LIST -->
                <div class="setting-section-header">
                  <span>Tailnet Mesh Devices</span>
                  <button type="button" class="round-action-btn" onclick="fetchTailscale()" title="Refresh Mesh Devices" style="width:28px; height:28px; min-width:28px;">
                    <svg viewBox="0 0 24 24" style="width:14px; height:14px;"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  </button>
                </div>
                <div id="tsDevicesContainer" style="display:flex; flex-direction:column; gap:4px;">
                  <!-- Populated dynamically via renderTailscaleDevices as .setting-row-item -->
                </div>

                <div class="setting-section-divider"></div>

                <!-- FEATURE TOGGLES -->
                <div class="setting-section-header">Mesh Routing &amp; Security</div>
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Share LAN Subnet (10.0.0.0/24)</span>
                    <span class="setting-label-sub">Advertise local subnet routes to other nodes in your mesh</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="tsShareLan" checked onchange="applyTailscalePrefs()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Advertise Exit Node</span>
                    <span class="setting-label-sub">Route all remote client internet traffic through this gateway</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="tsExitNode" onchange="applyTailscalePrefs()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Accept Remote Routes</span>
                    <span class="setting-label-sub">Accept advertised routes from other tailscale subnet routers</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="tsAcceptRoutes" checked onchange="applyTailscalePrefs()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Tailscale SSH</span>
                    <span class="setting-label-sub">Permit secure SSH console access managed via Tailscale ACLs</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="tsSshMode" onchange="applyTailscalePrefs()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-section-divider"></div>

                <!-- NODE CONFIGURATION -->
                <div class="setting-section-header">Node Details</div>
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('ts_hostname')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Node Hostname</span>
                    <span class="setting-label-sub" id="disp_ts_hostname">Maxnet-Gateway</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Tailscale IPv4 Address</span>
                    <span class="setting-label-sub" id="disp_ts_ip" style="font-family:var(--font-mono); color:var(--text-main); font-weight:700;">--</span>
                    <input type="hidden" id="tsIpAddress" value="">
                  </div>
                </div>

                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('ts_authkey')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Change Auth Key</span>
                    <span class="setting-label-sub" id="disp_ts_authkey">tskey-auth-... (Click to update key)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-section-divider"></div>

                <!-- SERVICE CONTROLS -->
                <div class="setting-section-header">Service Controls</div>
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Restart Tailscale Service</span>
                    <span class="setting-label-sub">Restart local tailscaled daemon and re-establish WireGuard mesh</span>
                  </div>
                  <div class="setting-control-col">
                    <button class="round-action-btn btn-warning-action" title="Restart Tailscale Service" onclick="restartTailscale()">
                      <svg viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                    </button>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold" style="color:#ef4444;">Logout Tailscale Node</span>
                    <span class="setting-label-sub">Revoke node authorization and disconnect from tailnet</span>
                  </div>
                  <div class="setting-control-col">
                    <button class="round-action-btn btn-danger-action" title="Logout Tailscale Node" onclick="logoutTailscale()">
                      <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div></div>
        </div>

        <!-- 3. ADB DEVICES & HARDWARE CONTROLS -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-adb-device">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-adb-device')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#38bdf8;">
                <svg class="svg-icon" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="3"/><circle cx="12" cy="18" r="1"/></svg>
              </div>
              <span class="acc-main-title">ADB Devices</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge" id="adbDevCountBadge">1 CONNECTED</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- 1. ADB HANDSETS LIST VIEW (DIRECT SHOW DEVICES, NO HEADER / RELOAD BTN) -->
              <div id="adbListView">
                <div id="adbDevicesCardsContainer" style="display:flex; flex-direction:column; gap:6px;">
                  <!-- Populated dynamically via renderAdbDevicesCards -->
                </div>
              </div>

              <!-- 2. ADB SELECTED DEVICE CONTROLS VIEW (NO SECOND BACK BUTTON, GROUPWISE CONTROLS) -->
              <div id="adbDetailView" style="display:none; flex-direction:column; gap:6px;">
                <!-- SECTION 1: DEVICE DIAGNOSTICS & TELEMETRY -->
                <div class="setting-section-header">Device Telemetry &amp; System</div>

                <!-- 1. DEVICE MODEL & OS -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold" id="dispDevModelTitle">Samsung Galaxy S21 FE 5G</span>
                    <span class="setting-label-sub" id="dispDevModelSub">Android 14 &bull; Patch: 2026-10 &bull; Qualcomm Snapdragon 888</span>
                  </div>
                </div>

                <!-- 2. BATTERY STATUS & HEALTH -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Battery Status &amp; Health</span>
                    <span class="setting-label-sub" id="dispDevBatterySub">Level: --% &bull; State: -- &bull; Temp: --&deg;C &bull; Health: Good</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn" title="Refresh Battery Telemetry" onclick="fetchAdbLiveTelemetry(this)" id="btnAdbRefreshBatt">
                      <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                    </button>
                  </div>
                </div>

                <!-- 2B. DEVICE SYSTEM UPTIME -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Device System Uptime</span>
                    <span class="setting-label-sub" id="dispDevUptimeSub">Uptime: -- &bull; Powered on &amp; operational</span>
                  </div>
                </div>

                <!-- 3. ADB SERIAL & USB SPEED -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">ADB Serial &amp; USB Link</span>
                    <span class="setting-label-sub" id="dispDevSerialSub">Serial: -- &bull; USB High-Speed 480 Mbps</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn" title="Copy Serial" onclick="copyAdbSerial()" id="btnCopyAdbSerial">
                      <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                </div>

                <!-- 4. CELLULAR MODEM & 5G -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Cellular Modem &amp; 5G SA</span>
                    <span class="setting-label-sub" id="dispRadioSub">Carrier: Jio &bull; 5G SA Connected &bull; Cycle airplane mode to re-attach</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn" title="Cycle Airplane Mode (5G Reconnect)" onclick="runDeviceAirplane(this)" id="btnRadioCycle">
                      <svg viewBox="0 0 24 24"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                    </button>
                  </div>
                </div>

                <!-- SECTION 2: COMMUNICATIONS & PERSONAL DATA -->
                <div class="setting-section-divider"></div>
                <div class="setting-section-header">Communications &amp; Data</div>

                <!-- 5. SMS MESSAGES -->
                <div class="setting-row-item setting-clickable-row" onclick="switchAdbSubView('sms')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">SMS Messages</span>
                    <span class="setting-label-sub" id="dispDevSmsSub">View SMS inbox, conversations &bull; Tap to load messages</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 6. CALL HISTORY -->
                <div class="setting-row-item setting-clickable-row" onclick="switchAdbSubView('calls')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Call History</span>
                    <span class="setting-label-sub" id="dispDevCallsSub">View incoming, outgoing, and missed call logs &bull; Tap to load</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 7. CONTACTS -->
                <div class="setting-row-item setting-clickable-row" onclick="switchAdbSubView('contacts')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Device Contacts</span>
                    <span class="setting-label-sub" id="dispDevContactsSub">View phonebook directory and saved phone numbers &bull; Tap to load</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- SECTION 3: HARDWARE & DISPLAY CONTROLS -->
                <div class="setting-section-divider"></div>
                <div class="setting-section-header">Hardware &amp; Display Controls</div>

                <!-- 8. CAMERA FLASHLIGHT -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Camera Flashlight</span>
                    <span class="setting-label-sub" id="dispTorchSub">State: OFF &bull; High-intensity rear camera LED torch</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn" title="Toggle Phone Flashlight / Torch" onclick="togglePhoneTorch(this)" id="btnTorchToggle">
                      <svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    </button>
                  </div>
                </div>

                <!-- 9. SCREEN STATE -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Handset Screen State</span>
                    <span class="setting-label-sub" id="dispPowerSub">State: AWAKE &bull; Touch display is active</span>
                  </div>
                  <div class="setting-control-col" style="gap:8px;">
                    <button type="button" class="round-action-btn" title="Wake Phone Screen (Turn On)" onclick="runDeviceWake(this)" id="btnDisplayWake">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
                    </button>
                    <button type="button" class="round-action-btn" title="Sleep Phone Screen (Turn Off)" onclick="runDeviceSleep(this)" id="btnDisplaySleep">
                      <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    </button>
                  </div>
                </div>

                <!-- 10. AUDIO VOLUME -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Audio Volume Control</span>
                    <span class="setting-label-sub" id="dispVolumeSub">Level: Volume 10 &bull; Speaker media output</span>
                  </div>
                  <div class="setting-control-col" style="gap:8px;">
                    <button type="button" class="round-action-btn" title="Phone Volume Down" onclick="volumePhone('down', this)" id="btnVolDown">
                      <svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    </button>
                    <button type="button" class="round-action-btn" title="Phone Volume Up" onclick="volumePhone('up', this)" id="btnVolUp">
                      <svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    </button>
                    <button type="button" class="round-action-btn btn-warning-action" title="Phone Silent Mode" onclick="volumePhone('silent', this)" id="btnVolSilent">
                      <svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                    </button>
                  </div>
                </div>

                <!-- SECTION 4: SYSTEM TOOLS & POWER -->
                <div class="setting-section-divider"></div>
                <div class="setting-section-header">System Tools &amp; Power</div>

                <!-- 11. WIRELESS ADB -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Wireless ADB (Port 5555)</span>
                    <span class="setting-label-sub" id="dispWirelessAdbSub">State: Disabled &bull; Port 5555 TCP/IP debugging</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn btn-warning-action" title="Enable Wireless ADB on port 5555" onclick="enableWirelessAdb(this)" id="btnWirelessAdb">
                      <svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
                    </button>
                  </div>
                </div>

                <!-- 12. SCREENSHOT -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Handset Screenshot</span>
                    <span class="setting-label-sub">Capture and preview real-time screenshot of phone display</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn" title="Capture Screenshot" onclick="captureAdbScreenshot(this)" id="btnAdbScreenshot">
                      <svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    </button>
                  </div>
                </div>

                <!-- 13. REBOOT -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold" style="color:#ef4444;">Reboot Handset</span>
                    <span class="setting-label-sub">Reboot the connected Android device cleanly</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn btn-danger-action" title="Reboot Android Device" onclick="runDeviceReboot(this)" id="btnDeviceReboot">
                      <svg viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 3. DEDICATED IN-PAGE VIEW: SMS MESSAGES (NO POPUP) -->
              <div id="adbSmsPageView" style="display:none; flex-direction:column; gap:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <input type="text" class="mh-input" id="adbSmsPageSearch" placeholder="Search messages..." oninput="filterAdbSmsPage(this.value)" style="flex:1; font-size:12px; padding:7px 12px; border-radius:8px;">
                  <button type="button" class="round-action-btn" title="Refresh SMS" onclick="fetchAdbSmsPage(this)" id="btnAdbRefreshSmsPage" style="width:32px; height:32px; min-width:32px;">
                    <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  </button>
                </div>

                <div id="adbSmsPageContainer" style="display:flex; flex-direction:column; gap:8px;">
                  <!-- Dynamically rendered -->
                </div>
              </div>

              <!-- 4. DEDICATED IN-PAGE VIEW: CALL HISTORY (NO POPUP) -->
              <div id="adbCallsPageView" style="display:none; flex-direction:column; gap:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <input type="text" class="mh-input" id="adbCallsPageSearch" placeholder="Search call logs..." oninput="filterAdbCallsPage(this.value)" style="flex:1; font-size:12px; padding:7px 12px; border-radius:8px;">
                  <button type="button" class="round-action-btn" title="Refresh Calls" onclick="fetchAdbCallsPage(this)" id="btnAdbRefreshCallsPage" style="width:32px; height:32px; min-width:32px;">
                    <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  </button>
                </div>

                <div id="adbCallsPageContainer" style="display:flex; flex-direction:column; gap:8px;">
                  <!-- Dynamically rendered -->
                </div>
              </div>

              <!-- 5. DEDICATED IN-PAGE VIEW: CONTACTS (NO POPUP) -->
              <div id="adbContactsPageView" style="display:none; flex-direction:column; gap:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <input type="text" class="mh-input" id="adbContactsPageSearch" placeholder="Search contacts..." oninput="filterAdbContactsPage(this.value)" style="flex:1; font-size:12px; padding:7px 12px; border-radius:8px;">
                  <button type="button" class="round-action-btn" title="Refresh Contacts" onclick="fetchAdbContactsPage(this)" id="btnAdbRefreshContactsPage" style="width:32px; height:32px; min-width:32px;">
                    <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  </button>
                </div>

                <div id="adbContactsPageContainer" style="display:flex; flex-direction:column; gap:8px;">
                  <!-- Dynamically rendered -->
                </div>
              </div>
            </div></div>
        </div>

        <!-- NETWORK STORAGE & SAMBA 4 SHARE -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-smb-storage">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-smb-storage')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#c084fc;">
                <svg class="svg-icon" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              </div>
              <span class="acc-main-title">Network Storage</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge emerald" id="smbStatusBadge">ONLINE</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div class="setting-section-header">Samba File Share</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Samba 4 File Server</span>
                  <span class="setting-label-sub">Master SMB daemon for local high-speed file sharing</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="smbMasterToggle" onchange="toggleSmbService(this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Network Share Access</span>
                  <span class="setting-label-sub" id="smbShareAddressText">smb://10.0.0.1/Pendrive</span>
                </div>
                <div class="setting-control-col">
                  <button type="button" class="round-action-btn" onclick="copySmbPath()" title="Copy Share Path">
                    <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Guest Anonymous Access</span>
                  <span class="setting-label-sub">Allow read and write access without credential prompt</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="smbGuestToggle" checked onchange="saveSmbGuestSetting(this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-section-divider"></div>
              <div class="setting-section-header">Storage Volume</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Connected USB Disk</span>
                  <span class="setting-label-sub" id="smbDevState">Checking USB disk mount...</span>
                </div>
                <div class="setting-control-col">
                  <span id="smbCapacityBadge" style="font-size:11.5px; font-weight:700; font-family:var(--font-mono); color:var(--text-main);">--</span>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Storage Auto-Mount</span>
                  <span class="setting-label-sub">Auto-detect ext4, NTFS, exFAT, and FAT32 filesystems on /mnt/pendrive</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="smbAutoMountToggle" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-section-divider"></div>
              <div class="setting-section-header">Share Security</div>

              <!-- SAMBA CREDENTIALS (CLICKABLE ROW OPENING ANDROID MODAL) -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('smb_credentials')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Samba Credentials</span>
                  <span class="setting-label-sub" id="disp_smb_user_desc">Open Guest Access (No Password Required) &bull; Click to set credentials</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-section-divider"></div>
              <div class="setting-section-header">WebDAV File Browser &amp; Storage (Dufs)</div>

              <!-- HIDDEN FORM BINDINGS FOR DUFS -->
              <div style="display:none;">
                <input type="number" id="dufsPortInput" value="5000">
                <input type="text" id="dufsPathInput" value="/mnt/storage">
                <input type="text" id="dufsAllowUpload" value="true">
                <input type="text" id="dufsAllowDelete" value="true">
                <input type="text" id="dufsUserInput" value="">
                <input type="password" id="dufsPassInput" value="">
              </div>

              <!-- SERVICE BANNER -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Dufs WebDAV &amp; File Manager</span>
                  <span class="setting-label-sub" id="dufsServiceSub">Disabled &bull; Local WebDAV storage server &amp; browser file manager</span>
                </div>
                <div class="setting-control-col" style="display:flex; gap:10px; align-items:center;">
                  <a href="http://10.0.0.1:5000/" id="dufsOpenBtn" target="_blank" rel="noopener noreferrer" class="round-action-btn" title="Open in Web Browser">
                    <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="dufsMasterToggle" onchange="toggleDufsService(this.checked)">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 1. WEBDAV SHARE URL (CLICKABLE ROW) -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('dufs_url')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">WebDAV Network Share URL</span>
                  <span class="setting-label-sub" id="dufsWebdavUrlText">http://10.0.0.1:5000/ &bull; Tap to copy or view connection instructions</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- 2. WEBDAV PORT (CLICKABLE ROW) -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('dufs_port')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">WebDAV &amp; File Manager Port</span>
                  <span class="setting-label-sub" id="disp_dufs_port">Port 5000 (Default Standard)</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- 3. STORAGE DIRECTORY (CLICKABLE ROW) -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('dufs_path')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Storage Mount Directory</span>
                  <span class="setting-label-sub" id="disp_dufs_path">/mnt/storage (USB Root Storage)</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- 4. PERMISSIONS & UPLOAD POLICY (CLICKABLE ROW) -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('dufs_permissions')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">File Access &amp; Upload Policy</span>
                  <span class="setting-label-sub" id="disp_dufs_permissions">Full Access: Browse, Upload, and Delete Enabled</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- 5. WEBDAV AUTHENTICATION (CLICKABLE ROW) -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('dufs_auth')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">WebDAV Access Authentication</span>
                  <span class="setting-label-sub" id="disp_dufs_auth">Open Access (No Password Required)</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

                <!-- 4. GATEWAY SECURITY -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-security">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-security')">
            <div class="acc-title-left">
              <div class="acc-icon-box">
                <svg class="svg-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <span class="acc-main-title">Security</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge emerald" id="secStatusBadge">PROTECTED</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- HIDDEN FORM BINDINGS -->
              <div style="display:none;">
                <input type="password" id="oldPasswordInput">
                <input type="password" id="newPasswordInput">
                <input type="password" id="confirmPasswordInput">
              </div>

              <!-- SECTION: ACCESS CREDENTIALS -->
              <div class="setting-section-header">Access Credentials</div>

              <!-- 1. ROOT PASSWORD (ANDROID MODAL ROW) -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('change_password')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Root Administrator Password</span>
                  <span class="setting-label-sub">Update credentials for Web UI and Dropbear SSH console</span>
                </div>
                <div class="setting-arrow-col">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-section-divider"></div>

              <!-- SECTION: SSL / TLS SECURITY CERTIFICATE -->
              <div class="setting-section-header">Web Encryption (HTTPS)</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">HTTPS Encryption</span>
                  <span class="setting-label-sub" id="disp_https_security_sub">Encrypted access on port 443 (maxnet.local) &bull; TLS 1.3 root certificate</span>
                </div>
                <div class="setting-control-col" style="display:flex; gap:10px; align-items:center;">
                  <a href="/maxnet-root-ca.crt" download="maxnet-root-ca.crt" class="round-action-btn" title="Download SSL Certificate">
                    <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </a>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="secHttpsToggle" onchange="saveSecurityPolicy('force_https', this.checked)">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="setting-section-divider"></div>

              <!-- SECTION: SERVICE & SESSION POLICIES -->
              <div class="setting-section-header">Terminal &amp; Session Security</div>

              <!-- 2. SSH SERVICE TOGGLE -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">SSH Console Access</span>
                  <span class="setting-label-sub">Enable or disable Dropbear SSH terminal daemon on port 22</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="secSshToggle" checked onchange="saveSecurityPolicy('ssh_enable', this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- 3. SESSION TIMEOUT TOGGLE -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Session Auto-Timeout</span>
                  <span class="setting-label-sub">Automatically terminate web console sessions after 15 minutes of inactivity</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="secSessionTimeoutToggle" checked onchange="saveSecurityPolicy('session_timeout', this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-section-divider"></div>

              <!-- SECTION: FIREWALL & HARDENING -->
              <div class="setting-section-header">Firewall &amp; Hardening</div>

              <!-- 4. SYN FLOOD DEFENSE -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">SYN Flood Protection</span>
                  <span class="setting-label-sub">Mitigate TCP SYN denial-of-service bursts via kernel firewall rules</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="secSynFloodToggle" checked onchange="saveSecurityPolicy('syn_flood', this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- 5. WAN PING / ICMP DROP -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Stealth WAN Mode (Drop ICMP)</span>
                  <span class="setting-label-sub">Ignore and drop ping requests from external internet interfaces</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="secWanPingToggle" onchange="saveSecurityPolicy('wan_ping_drop', this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- 6. BRUTE-FORCE LOGIN GUARD -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Brute-Force Login Guard</span>
                  <span class="setting-label-sub">Block client IP addresses after 5 consecutive failed login attempts</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="secBruteForceToggle" checked onchange="saveSecurityPolicy('brute_force', this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. NETWORK DIAGNOSTICS -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-diagnostics">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-diagnostics')">
            <div class="acc-title-left">
              <div class="acc-icon-box">
                <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              </div>
              <span class="acc-main-title">Diagnostics</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge">TOOLS</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">

              <!-- TOP ROW: START BUTTON ON RIGHT -->
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                <div style="display:flex; flex-direction:column; gap:2px;">
                  <span style="font-size:12px; font-weight:800; color:var(--text-main);">Diagnostic Suite</span>
                  <span style="font-size:11px; color:var(--text-dim);">Live packet probe, path tracing, port auditing, whois &amp; DNS inspection</span>
                </div>
                <button type="button" id="btnDiagStart" class="mh-btn" onclick="toggleDiagExecution()" style="padding:8px 22px; font-weight:800; font-size:12px; letter-spacing:0.5px; background:transparent; border:1px solid #0284c7; color:#38bdf8; border-radius:8px; box-shadow:0 0 10px rgba(2,132,199,0.25); cursor:pointer;">
                  START
                </button>
              </div>

              <!-- TARGET INPUT BOX -->
              <div style="margin-bottom:12px;">
                <input type="text" class="mh-input" id="diagTargetInput" value="1.1.1.1" placeholder="Domain Name / IP Address" style="width:100%; padding:9px 14px; font-size:13px; font-family:var(--font-mono);">
              </div>

              <!-- 5-SEGMENT TOGGLE BAR [ Ping | Route | Ports | Whois | DNS ] -->
              <div class="diag-tool-nav" style="display:flex; gap:4px; background:rgba(255,255,255,0.04); padding:4px; border-radius:10px; border:1px solid rgba(255,255,255,0.08); margin-bottom:14px;">
                <button type="button" class="diag-nav-tab active" data-tool="ping" onclick="switchDiagTool('ping')" style="flex:1; padding:7px 0; border:none; border-radius:7px; font-size:11.5px; font-weight:700; cursor:pointer; background:#38bdf8; color:#0f172a; transition:all 0.15s ease;">Ping</button>
                <button type="button" class="diag-nav-tab" data-tool="route" onclick="switchDiagTool('route')" style="flex:1; padding:7px 0; border:none; border-radius:7px; font-size:11.5px; font-weight:700; cursor:pointer; background:transparent; color:var(--text-dim); transition:all 0.15s ease;">Route</button>
                <button type="button" class="diag-nav-tab" data-tool="ports" onclick="switchDiagTool('ports')" style="flex:1; padding:7px 0; border:none; border-radius:7px; font-size:11.5px; font-weight:700; cursor:pointer; background:transparent; color:var(--text-dim); transition:all 0.15s ease;">Ports</button>
                <button type="button" class="diag-nav-tab" data-tool="whois" onclick="switchDiagTool('whois')" style="flex:1; padding:7px 0; border:none; border-radius:7px; font-size:11.5px; font-weight:700; cursor:pointer; background:transparent; color:var(--text-dim); transition:all 0.15s ease;">Whois</button>
                <button type="button" class="diag-nav-tab" data-tool="dns" onclick="switchDiagTool('dns')" style="flex:1; padding:7px 0; border:none; border-radius:7px; font-size:11.5px; font-weight:700; cursor:pointer; background:transparent; color:var(--text-dim); transition:all 0.15s ease;">DNS</button>
              </div>

              <!-- TOOL CONFIGURATION SUB-PANELS -->
              <!-- 1. PING CONFIG -->
              <div id="diagConfigPing" class="diag-config-panel" style="display:block;">
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Probe Delay</span>
                    <span class="setting-label-sub">Interval between successive ICMP echo requests</span>
                  </div>
                  <div class="setting-control-col" style="gap:10px; width:180px;">
                    <input type="range" id="diagPingDelay" min="0.2" max="120.0" step="0.1" value="1.0" oninput="document.getElementById('diagPingDelayVal').textContent = parseFloat(this.value).toFixed(1) + 's'" style="flex:1; accent-color:#38bdf8;">
                    <span id="diagPingDelayVal" style="font-family:var(--font-mono); font-size:11px; width:45px; text-align:right; color:var(--text-main);">1.0s</span>
                  </div>
                </div>

                <!-- Hidden Ping Size Input -->
                <div style="display:none;">
                  <input type="number" id="diagPingSize" min="0" max="65507" value="56">
                </div>
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('diag_ping_size')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Payload size (B)</span>
                    <span class="setting-label-sub" id="disp_diag_ping_size">56 bytes (ICMP payload buffer)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Prefer IPv6</span>
                    <span class="setting-label-sub">Send ICMPv6 echo requests over IPv6 stack</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="diagPingIpv6">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 2. ROUTE CONFIG -->
              <div id="diagConfigRoute" class="diag-config-panel" style="display:none;">
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Max. delay</span>
                    <span class="setting-label-sub">Maximum probe timeout per hop</span>
                  </div>
                  <div class="setting-control-col" style="gap:10px; width:180px;">
                    <input type="range" id="diagRouteMaxDelay" min="0.5" max="10.0" step="0.1" value="0.5" oninput="document.getElementById('diagRouteMaxDelayVal').textContent = parseFloat(this.value).toFixed(2) + 's'" style="flex:1; accent-color:#38bdf8;">
                    <span id="diagRouteMaxDelayVal" style="font-family:var(--font-mono); font-size:11px; width:45px; text-align:right; color:var(--text-main);">0.50s</span>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Min delay</span>
                    <span class="setting-label-sub">Minimum delay threshold between probe packets</span>
                  </div>
                  <div class="setting-control-col" style="gap:10px; width:180px;">
                    <input type="range" id="diagRouteMinDelay" min="0.05" max="1.0" step="0.01" value="0.05" oninput="document.getElementById('diagRouteMinDelayVal').textContent = parseFloat(this.value).toFixed(2) + 's'" style="flex:1; accent-color:#38bdf8;">
                    <span id="diagRouteMinDelayVal" style="font-family:var(--font-mono); font-size:11px; width:45px; text-align:right; color:var(--text-main);">0.05s</span>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">UDP probes</span>
                    <span class="setting-label-sub">Use UDP datagram probes instead of standard ICMP packets</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="diagRouteUdp">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Prefer IPv6</span>
                    <span class="setting-label-sub">Trace route path over IPv6 transport</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="diagRouteIpv6">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 3. PORTS CONFIG -->
              <div id="diagConfigPorts" class="diag-config-panel" style="display:none;">
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Port Audit Mode</span>
                    <span class="setting-label-sub">Select between standard common service ports or complete 1-65535 sweep</span>
                  </div>
                  <div class="setting-control-col">
                    <div style="display:flex; background:rgba(255,255,255,0.06); padding:3px; border-radius:7px; gap:2px;">
                      <button type="button" id="btnPortModeCommon" onclick="setPortScanMode('common')" style="padding:4px 12px; font-size:11px; font-weight:700; border:none; border-radius:5px; background:#38bdf8; color:#0f172a; cursor:pointer;">Common</button>
                      <button type="button" id="btnPortModeAll" onclick="setPortScanMode('all')" style="padding:4px 12px; font-size:11px; font-weight:700; border:none; border-radius:5px; background:transparent; color:var(--text-dim); cursor:pointer;">All</button>
                    </div>
                  </div>
                </div>

                <!-- EDITABLE PORTS LIST (MODAL ROW) -->
                <div style="display:none;">
                  <textarea id="diagPortsListInput">20, 21, 22, 23, 25, 53, 67, 68, 69, 80, 110, 119, 123, 135, 137, 138, 139, 143, 161, 162, 389, 443, 445, 465, 514, 587, 636, 873, 993, 995, 1080, 1194, 1433, 1521, 1723, 1883, 2049, 2082, 2083, 2086, 2087, 2181, 3000, 3128, 3306, 3389, 4369, 5000, 5060, 5222, 5432, 5672, 5900, 6379, 6443, 6667, 7000, 7001, 7681, 8000, 8008, 8080, 8081, 8443, 8888, 9000, 9090, 9092, 9200, 9418, 9999, 10000, 27017, 27018, 50000, 51820</textarea>
                </div>
                <div id="diagPortsCommonBox">
                  <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('diag_ports_list')">
                    <div class="setting-label-col">
                      <span class="setting-label-bold">Target Ports List</span>
                      <span class="setting-label-sub" id="disp_diag_ports_count">74 Standard Ports Configured (Click to edit)</span>
                    </div>
                    <div class="setting-arrow-col">
                      <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Min delay</span>
                    <span class="setting-label-sub">Inter-probe rate delay (1ms to 100ms)</span>
                  </div>
                  <div class="setting-control-col" style="gap:10px; width:180px;">
                    <input type="range" id="diagPortsMinDelay" min="1" max="100" step="1" value="1" oninput="document.getElementById('diagPortsMinDelayVal').textContent = this.value + 'ms'" style="flex:1; accent-color:#38bdf8;">
                    <span id="diagPortsMinDelayVal" style="font-family:var(--font-mono); font-size:11px; width:45px; text-align:right; color:var(--text-main);">1ms</span>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Prefer IPv6</span>
                    <span class="setting-label-sub">Connect and scan target via IPv6 socket</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="diagPortsIpv6">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 4. WHOIS CONFIG -->
              <div id="diagConfigWhois" class="diag-config-panel" style="display:none;">
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Whois Server</span>
                    <span class="setting-label-sub">Authoritative NIC / TLD registry database server</span>
                  </div>
                  <div class="setting-control-col">
                    <select class="mh-input" id="diagWhoisServer" style="width:200px; padding:6px 10px; font-size:12px; font-family:var(--font-mono);">
                      <option value="auto">Auto / IANA Registry</option>
                      <option value="whois.verisign-grs.com">whois.verisign-grs.com (.com, .net)</option>
                      <option value="whois.publicinterestregistry.org">whois.publicinterestregistry.org (.org)</option>
                      <option value="whois.arin.net">whois.arin.net (North America IP)</option>
                      <option value="whois.ripe.net">whois.ripe.net (Europe/Asia IP)</option>
                      <option value="whois.apnic.net">whois.apnic.net (Asia Pacific IP)</option>
                      <option value="whois.nic.io">whois.nic.io (.io)</option>
                    </select>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Prefer IPv6</span>
                    <span class="setting-label-sub">Query whois registry server over IPv6</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="diagWhoisIpv6">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 5. DNS CONFIG -->
              <div id="diagConfigDns" class="diag-config-panel" style="display:none;">
                <div style="margin-bottom:10px;">
                  <span style="font-size:11px; font-weight:700; color:var(--text-main); font-family:var(--font-mono); margin-bottom:6px; display:block;">Query Record Type:</span>
                  <div style="display:flex; gap:4px; flex-wrap:wrap;" id="diagDnsTypesBar">
                    <button type="button" class="dns-type-pill active" onclick="setDnsQueryType('ALL')">ALL</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('A')">A</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('AAAA')">AAAA</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('CAA')">CAA</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('CNAME')">CNAME</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('MX')">MX</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('NAPTR')">NAPTR</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('NS')">NS</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('PTR')">PTR</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('SOA')">SOA</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('SRV')">SRV</button>
                    <button type="button" class="dns-type-pill" onclick="setDnsQueryType('TXT')">TXT</button>
                  </div>
                </div>

                <!-- Hidden DNS Server Input -->
                <div style="display:none;">
                  <input type="text" id="diagDnsServerInput" value="10.0.0.1">
                </div>
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('diag_dns_server')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">DNS Server</span>
                    <span class="setting-label-sub" id="disp_diag_dns_server">10.0.0.1 (Router br-lan resolver)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Show DNSSEC</span>
                    <span class="setting-label-sub">Request DNSSEC signatures (RRSIG, DNSKEY, DS) validation</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="diagDnsDnssec">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Show all sections</span>
                    <span class="setting-label-sub">Include Authority and Additional response sections</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="diagDnsAllSections">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Prefer IPv6</span>
                    <span class="setting-label-sub">Send DNS queries to resolver via IPv6 transport</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="diagDnsIpv6">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- DEDICATED DIAGNOSTICS OUTPUT PANEL (NEW PAGE) -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-diag-output">
          <div class="settings-card-header accordion-header" onclick="openSettingPage('acc-diagnostics')">
            <div class="acc-title-left">
              <button type="button" class="round-action-btn" onclick="event.stopPropagation(); openSettingPage('acc-diagnostics');" title="Back to Diagnostic Suite" style="width:32px; height:32px; margin-right:4px;">
                <svg viewBox="0 0 24 24" style="width:14px; height:14px;"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </button>
              <span class="acc-main-title" id="diagOutputPageTitle">Diagnostic Output</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge sky" id="diagOutputStatusBadge">IDLE</span>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- Output Header & Controls -->
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; gap:8px; flex-wrap:wrap;">
                <div>
                  <span id="diagResultTitle" style="font-size:12px; font-weight:800; font-family:var(--font-mono); color:var(--text-main); text-transform:uppercase;">RESULTS</span>
                  <span id="diagOutputTargetSubtitle" style="font-size:11px; color:var(--text-dim); display:block; margin-top:2px;">Target: --</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" id="btnDiagOutputStop" class="mh-btn btn-sm" onclick="toggleDiagExecution()" style="padding:5px 14px; font-size:11px; font-weight:800; background:transparent; color:#ef4444; border:1px solid #ef4444; border-radius:6px; cursor:pointer;">STOP</button>
                  <button type="button" class="mh-btn btn-sm btn-ghost" onclick="clearDiagResults()" style="font-size:10px; padding:4px 10px;">CLEAR</button>
                </div>
              </div>

              <!-- Formatted Results List -->
              <div id="diagResultsContainer" style="display:block;">
                <div id="diagResultsList" style="display:flex; flex-direction:column; gap:6px;"></div>
              </div>

              <!-- Live Raw Console Box -->
              <div style="margin-top:14px;" id="diagRawToggleBox">
                <button class="mh-btn btn-sm btn-ghost" onclick="toggleDiagRawLog()" id="btnToggleDiagRaw" style="font-size:10px; padding:4px 10px; margin-bottom:8px;">
                  SHOW RAW CONSOLE
                </button>
                <div class="terminal-output-box" id="diagOutputBox" style="display:none; max-height:340px; overflow-y:auto;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- HARDWARE LED & RESET BUTTON GESTURES DETAIL PANEL -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-led-hardware">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-led-hardware')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#ec4899;">
                <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              </div>
              <span class="acc-main-title">LED &amp; Hardware</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge pink" id="ledStatusBadge">AUTOMATIC</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- SECTION 1: LED AUTOMATION -->
              <div class="setting-section-header">Status LED Automation</div>
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Intelligent Status LED Policy</span>
                  <span class="setting-label-sub">Red on boot, blinking blue awaiting internet, solid green when online</span>
                </div>
                <div class="toggle-wrap-cell">
                  <label class="toggle-switch">
                    <input type="checkbox" id="hwLedAutoToggle" checked onchange="toggleHwLedAuto(this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- LED PROFILE SELECTOR ROW -->
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('led_profile')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">LED Operating Profile</span>
                  <span class="setting-label-sub" id="disp_led_profile">Auto Gateway Intelligence &bull; Dynamic network &amp; boot state</span>
                </div>
                <div class="setting-control-col">
                  <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <!-- LED TRIGGER STATUS ROWS -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Internet Online Indicator</span>
                  <span class="setting-label-sub" id="disp_led_online_sub">Green LED (Solid On when uplink verified)</span>
                </div>
                <div class="setting-control-col">
                  <span class="card-badge emerald">SOLID GREEN</span>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Awaiting Uplink / Connecting</span>
                  <span class="setting-label-sub" id="disp_led_waiting_sub">Blue LED (1Hz Blinking Timer)</span>
                </div>
                <div class="setting-control-col">
                  <span class="card-badge sky">BLUE BLINK</span>
                </div>
              </div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">System Booting / Error</span>
                  <span class="setting-label-sub" id="disp_led_boot_sub">Red LED (Solid On during boot or gateway lost)</span>
                </div>
                <div class="setting-control-col">
                  <span class="card-badge ruby">SOLID RED</span>
                </div>
              </div>

              <!-- SECTION 2: RESET BUTTON GESTURES -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">Reset Button Gestures</div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('reset_press_10s')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Long Press (10 Seconds)</span>
                  <span class="setting-label-sub" id="disp_reset_press_10s">Factory Reset (Wipe storage and restore factory defaults)</span>
                </div>
                <div class="setting-control-col">
                  <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('reset_single_click')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Single Click (&lt; 2 Seconds)</span>
                  <span class="setting-label-sub" id="disp_reset_single_click">Disabled</span>
                </div>
                <div class="setting-control-col">
                  <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('reset_double_click')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Double Click (2x Push within 1.5s)</span>
                  <span class="setting-label-sub" id="disp_reset_double_click">Disabled</span>
                </div>
                <div class="setting-control-col">
                  <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('reset_triple_click')">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Triple Click (3x Push within 2s)</span>
                  <span class="setting-label-sub" id="disp_reset_triple_click">Disabled</span>
                </div>
                <div class="setting-control-col">
                  <svg class="snc-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- DEDICATED FIRMWARE & OS UPDATES ACCORDION -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-firmware">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-firmware')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#38bdf8;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <span class="acc-main-title">Update</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge" style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3);">OS UPDATE</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- 1. FIRMWARE & RELEASE STATUS -->
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold" id="fwStatusMainLabel" style="color:#10b981; font-weight:800; font-size:13.5px;">Router is Up to Date</span>
                  <span class="setting-label-sub" id="fwStatusSubtitle">
                    Installed: <span id="fwCurrentVerBadge" style="font-weight:700;">v3.2.0</span> &bull; <span id="fwModelVal">MAXNET-IPQ9574 AX6000</span> &bull; Channel: Stable
                  </span>
                </div>
                <div class="setting-control-col">
                  <button class="round-action-btn" id="btnCheckFwPage" title="Check for New Releases" onclick="checkLatestFirmwareUpdate()">
                    <svg id="iconCheckFwPage" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  </button>
                </div>
              </div>

              <!-- 2. INSTALL ONLINE FIRMWARE UPDATE (NAND FLASH) -->
              <div class="setting-row-item" id="rowFwUpgradeAction" style="display:none;">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Online Update Available</span>
                  <span class="setting-label-sub" id="fwSysupgradeSub">
                    Download &amp; flash verified sysupgrade image (<span id="fwSizeVal">28.60 MB</span>)
                  </span>
                </div>
                <div class="setting-control-col">
                  <button type="button" class="mh-btn btn-primary" id="btnFwFlashDirect" onclick="openFirmwareFlashModal()" style="min-width:110px; font-weight:700; padding:7px 18px; font-size:12px;">
                    UPGRADE
                  </button>
                </div>
              </div>

              <!-- 3. LOCAL FIRMWARE FILE UPGRADE -->
              <input type="file" id="localFwFileInput" accept=".bin,.ubi,.itb" style="display:none;" onchange="onSelectLocalFirmwareFile(event)">
              <div class="setting-row-item setting-clickable-row" onclick="document.getElementById('localFwFileInput').click()" style="border-top:1px solid var(--border-sub); padding-top:14px; margin-top:4px;">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Select Firmware File</span>
                  <span class="setting-label-sub" id="localFwFileInfoText">Click to select firmware image (.bin, .ubi, .itb)</span>
                </div>
                <div class="setting-control-col">
                  <button type="button" class="round-action-btn" title="Choose File" aria-label="Choose File">
                    <svg viewBox="0 0 24 24" style="width:15px; height:15px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </button>
                </div>
              </div>

              <!-- Upload progress & Flash Actions -->
              <div id="localFwActionsBox" style="display:none; padding:12px 14px; background:rgba(255,255,255,0.02); border:1px solid var(--border-sub); border-radius:8px; margin-top:6px;">
                <div id="localFwProgressBox" style="display:none; margin-bottom:10px;">
                  <div style="display:flex; justify-content:space-between; font-size:10.5px; font-family:var(--font-mono); color:var(--text-muted); margin-bottom:3px;">
                    <span id="localFwProgressLabel">Uploading...</span>
                    <span id="localFwProgressPct">0%</span>
                  </div>
                  <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
                    <div id="localFwProgressBar" style="width:0%; height:100%; background:linear-gradient(90deg, #38bdf8, #10b981); transition:width 0.2s;"></div>
                  </div>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:8px;">
                  <button type="button" class="mh-btn btn-primary" id="btnUploadLocalFw" onclick="uploadAndVerifyLocalFirmware()" style="padding:7px 16px; font-size:11.5px; font-weight:800;">
                    UPLOAD &amp; VERIFY
                  </button>
                  <button type="button" class="mh-btn btn-ghost" id="btnFlashKeep" onclick="executeLocalSysupgrade(false)" style="display:none; padding:6px 12px; font-size:11px; font-weight:700;">
                    KEEP SETTINGS
                  </button>
                  <button type="button" class="mh-btn btn-danger" id="btnFlashClean" onclick="executeLocalSysupgrade(true)" style="display:none; padding:6px 14px; font-size:11px; font-weight:800;">
                    CLEAN FLASH
                  </button>
                </div>
              </div>

              <!-- 4. SAFE RAM BOOT (.itb) TEST -->
              <div class="setting-row-item" id="rowFwRamBootAction" style="margin-top:6px;">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Safe RAM Boot (.itb)</span>
                  <span class="setting-label-sub">
                    Test image in DDR RAM without flashing NAND memory (Zero brick risk)
                  </span>
                </div>
                <div class="setting-control-col">
                  <button type="button" class="mh-btn btn-ghost" id="btnFwRamBootTest" onclick="openRamBootModal()" style="font-weight:700; padding:6px 14px; font-size:11px;">
                    TEST IN RAM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 6. MAINTENANCE & OPERATIONS -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-maintenance">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-maintenance')">
            <div class="acc-title-left">
              <div class="acc-icon-box">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              </div>
              <span class="acc-main-title">Maintenance</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge">SYSTEM</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div style="display:flex; flex-direction:column;">

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Scheduled Auto Reboot</span>
                    <span class="setting-label-sub">Restart the router daily at the selected time</span>
                  </div>
                  <div class="toggle-wrap-cell"><label class="toggle-switch"><input type="checkbox" id="autoRebootToggle" onchange="toggleScheduledAutoReboot(this.checked)"><span class="toggle-slider"></span></label></div>
                </div>
                <div class="setting-row-item" id="autoRebootTimeRow" style="display:none;">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Reboot Time</span>
                    <span class="setting-label-sub">Router local time (24-hour clock)</span>
                  </div>
                  <div class="setting-control-col"><input type="time" id="autoRebootTime" class="mh-input" onchange="saveScheduledAutoRebootTime(this.value)" style="width:118px; padding:6px 8px;"></div>
                </div>
                <div class="setting-section-divider"></div>
                <!-- MAINTENANCE OPERATIONS (CLEAN ROWS WITH COLOR-CODED ACTION ICONS) -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Reboot</span>
                    <span class="setting-label-sub">Gracefully restart the router</span>
                  </div>
                  <div class="setting-control-col">
                    <button class="round-action-btn btn-warning-action" title="Reboot Router" onclick="confirmRebootRouter()">
                      <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                    </button>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Power Cycle USB (VBUS)</span>
                    <span class="setting-label-sub">Power cycle USB ports and modems</span>
                  </div>
                  <div class="setting-control-col">
                    <button class="round-action-btn" title="Power Cycle USB Hub (VBUS Reset)" onclick="powerCycleUsbHub()">
                      <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </button>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Restart Network</span>
                    <span class="setting-label-sub">Restart interfaces and multi-link</span>
                  </div>
                  <div class="setting-control-col">
                    <button class="round-action-btn" title="Restart Network &amp; Multi-Link Daemon" onclick="restartNetworkAndMultilink()">
                      <svg viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                    </button>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Flush DNS &amp; Conntrack</span>
                    <span class="setting-label-sub">Flush DNS cache and conntrack</span>
                  </div>
                  <div class="setting-control-col">
                    <button class="round-action-btn" title="Clear DNS &amp; Conntrack Cache" onclick="clearDnsAndConntrack()">
                      <svg viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Backup Configuration</span>
                    <span class="setting-label-sub">Export system backup (.tar.gz)</span>
                  </div>
                  <div class="setting-control-col">
                    <button class="round-action-btn" title="Download Configuration Backup Archive" onclick="downloadBackupArchive()">
                      <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Restore Configuration</span>
                    <span class="setting-label-sub">Upload backup archive to restore</span>
                  </div>
                  <div class="setting-control-col">
                    <button class="round-action-btn" title="Restore Configuration Archive" onclick="document.getElementById('backupFileInput').click()">
                      <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </button>
                    <input type="file" id="backupFileInput" accept=".tar.gz,.tgz" style="display:none;" onchange="handleRestoreFileChosen(this)">
                  </div>
                </div>

                <div class="setting-row-item" id="restoreConfirmBox" style="display:none; background:rgba(239,68,68,0.08) !important;">
                  <div class="setting-label-col">
                    <span class="setting-label-bold" style="color:#ef4444;">Confirm Restoration</span>
                    <span class="setting-label-sub" id="restoreFileLabel">archive.tar.gz</span>
                  </div>
                  <div class="setting-control-col">
                    <button class="mh-btn btn-danger btn-sm" onclick="uploadRestoreArchive()">FLASH &amp; REBOOT</button>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Factory Reset</span>
                    <span class="setting-label-sub">Reset system to factory defaults</span>
                  </div>
                  <div class="setting-control-col">
                    <button class="round-action-btn btn-danger-action" title="Factory Reset Defaults" onclick="showFactoryResetModal()">
                      <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ROUTER DATE, TIME, TIMEZONE, AND NTP SETTINGS -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-system-time">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-system-time')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#06b6d4;">
                <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <span class="acc-main-title">Date &amp; Time</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge sky">CLOCK</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content"><div class="settings-card-body">
            <div class="system-time-settings" style="display:flex; flex-direction:column; gap:0;">
              <div class="setting-row-item system-time-field-row system-time-sync-row">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Automatic Time Sync</span>
                  <span class="setting-label-sub">Synchronize the router clock using NTP</span>
                </div>
                <div class="toggle-wrap-cell"><label class="toggle-switch"><input type="checkbox" id="systemNtpEnabled" checked onchange="saveSystemSettingsPage()"><span class="toggle-slider"></span></label></div>
              </div>
              <div class="setting-row-item system-time-field-row setting-clickable-row" role="button" tabindex="0" onclick="openSystemDateTimeEditor()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openSystemDateTimeEditor();}">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Date &amp; Time</span>
                  <span class="setting-label-sub" id="systemDateTimeDisplay">Loading router time...</span>
                </div>
                <div class="setting-arrow-col" aria-hidden="true"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>
              </div>
              <input type="hidden" id="systemDateTimeInput" aria-label="Router date and time">
              <div class="setting-row-item system-time-field-row setting-clickable-row" role="button" tabindex="0" onclick="openSystemTimezoneEditor()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openSystemTimezoneEditor();}">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Timezone</span>
                  <span class="setting-label-sub" id="systemTimezoneDisplay">Loading timezone...</span>
                </div>
                <div class="setting-arrow-col" aria-hidden="true"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>
              </div>
              <input type="hidden" id="systemTimezoneInput" aria-label="Selected timezone">
              <div class="system-ntp-section">
                <div class="system-ntp-heading">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">NTP Servers</span>
                    <span class="setting-label-sub">Configured time servers</span>
                  </div>
                  <div class="system-ntp-actions">
                    <button type="button" class="round-action-btn system-ntp-reset" onclick="resetSystemNtpServers()" title="Restore default NTP servers" aria-label="Restore default NTP servers">
                      <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 2.64-6.36L3 8"/><path d="M3 3v5h5"/></svg>
                    </button>
                    <button type="button" class="round-action-btn" onclick="openSettingModal('ntp_server')" title="Add NTP server" aria-label="Add NTP server">
                      <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>
                <div id="systemNtpServersList" class="system-ntp-list"></div>
              </div>

            </div>
          </div></div>
        </div>

        <!-- 7. DEDICATED SYSTEM LOGS VIEW (PLAIN UI, NO BACKGROUND, SAME-LINE TOGGLE & DOWNLOAD) -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-logs" style="background:transparent !important; border:none !important; box-shadow:none !important;">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-logs')" style="background:transparent !important; border:none !important;">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#06b6d4;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <span class="acc-main-title">System Logs</span>
            </div>
            <div class="acc-right-action">
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body" style="padding:0; background:transparent !important;">
              <!-- TOP ACTION LINE: SYSTEM | KERNEL TOGGLE WITH DOWNLOAD BUTTON IN SAME LINE -->
              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:10px 14px; border-bottom:1px solid rgba(255,255,255,0.06);">
                <div style="display:flex; align-items:center; gap:6px;">
                  <button type="button" class="log-tab-btn active" id="logTabSystem" onclick="switchLogType('system')" style="padding:6px 16px; border-radius:8px; font-size:12px; font-weight:700;">System</button>
                  <button type="button" class="log-tab-btn" id="logTabKernel" onclick="switchLogType('kernel')" style="padding:6px 16px; border-radius:8px; font-size:12px; font-weight:700;">Kernel</button>
                </div>

                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="round-action-btn" id="btnDownloadActiveLog" onclick="downloadActiveLog()" title="Download Log" style="width:34px; height:34px; min-width:34px;">
                    <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                  <button type="button" class="round-action-btn" title="Refresh Logs" onclick="refreshLogViewer()" style="width:34px; height:34px; min-width:34px;">
                    <svg viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  </button>
                </div>
              </div>

              <!-- PLAIN LOG OUTPUT AREA (NO HEAVY BOX, TRANSPARENT) -->
              <div id="logConsoleOutput" style="height:calc(100vh - 200px); min-height:550px; overflow-y:auto; padding:14px; background:transparent !important; color:#d4d4d8; font-family:var(--font-mono, monospace); font-size:11.5px; line-height:1.55; white-space:pre-wrap; word-break:break-all;">Connecting to log stream...</div>
            </div>
          </div>
        </div>

        <!-- 8. DEDICATED ACTIVE SESSIONS & SECURITY VIEW -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-sessions">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-sessions')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#ef4444;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </div>
              <span class="acc-main-title">Active Sessions &amp; Sign Out</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge emerald" id="sessionsStatusBadge">AUTHENTICATED</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- SINGLE FLAT SESSIONS LIST (DIRECT SHOW) -->
              <div id="activeSessionsFlatList" style="display:flex; flex-direction:column; gap:4px;">
                <!-- Populated dynamically via fetchActiveSessions with active device on top -->
              </div>
            </div>
          </div>
        </div>

                <!-- 7. PACKAGES & PLUGIN MANAGER -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-packages">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-packages')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#38bdf8;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <span class="acc-main-title">Packages</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge" id="pkgManagerBadge">0 INSTALLED</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- Top Controls: Search Filter + Update Repositories + Tabs -->
              <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:14px;">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                  <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:220px;">
                    <input type="text" id="pkgSearchInput" class="mh-input" placeholder="Search installed &amp; available packages..." oninput="handlePackageSearchInput(this.value)" style="width:100%; padding:7px 12px; font-size:12px; font-family:var(--font-mono);">
                  </div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <button class="mh-btn btn-secondary" id="btnUpdatePkgs" onclick="updatePackageRepositories()" style="padding:7px 14px; font-size:11px;">
                      UPDATE REPOSITORIES
                    </button>
                    <div class="log-tabs-group" style="padding:2px;">
                      <button class="log-tab-btn active" id="pkgTabInstalled" onclick="switchPackageTab('installed')">Installed</button>
                      <button class="log-tab-btn" id="pkgTabAvailable" onclick="switchPackageTab('available')">Search Online</button>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Packages List Container -->
              <div id="pkgListContainer" style="display:flex; flex-direction:column; gap:4px;">
                <div style="text-align:center; padding:20px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">Loading package database...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 8. TERMINAL (ON-SCREEN ROOT SHELL - MATCHING LOG UI, NO BOX, TRANSPARENT) -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-terminal-cli" style="background:transparent !important; border:none !important; box-shadow:none !important;">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-terminal-cli')" style="background:transparent !important; border:none !important;">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#10b981;">
                <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              </div>
              <span class="acc-main-title">Terminal</span>
            </div>
            <div class="acc-right-action">
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="terminal-mobile-header" id="termMobileHeader">
              <button class="term-back-btn" onclick="closeSettingPage()" aria-label="Exit Terminal">
                <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                <span>Back</span>
              </button>
              <span class="term-header-title">ROOT SHELL // ttyd</span>
              <div class="term-quick-keys">
                <button class="term-key-btn" onclick="sendTerminalKey('ESC')">ESC</button>
                <button class="term-key-btn" onclick="sendTerminalKey('TAB')">TAB</button>
                <button class="term-key-btn" onclick="sendTerminalKey('CTRL_C')">^C</button>
                <button class="term-key-btn" onclick="clearTerminalScreen()">CLS</button>
              </div>
            </div>
            <div class="settings-card-body" style="padding:0; background:transparent !important; border:none !important; flex:1 1 auto; min-height:0; display:flex; flex-direction:column;">
              <div id="terminalContainer"></div>
            </div>
            <!-- Bottom Mobile Command Bar -->
            <form class="term-mobile-cmd-bar" id="termMobileCmdBar" onsubmit="submitMobileTermCmd(event)">
              <div class="term-cmd-quick-row">
                <button type="button" class="term-quick-pill" onclick="sendTerminalKey('UP')">&#9650;</button>
                <button type="button" class="term-quick-pill" onclick="sendTerminalKey('DOWN')">&#9660;</button>
                <button type="button" class="term-quick-pill" onclick="sendTerminalKey('TAB')">TAB</button>
                <button type="button" class="term-quick-pill" onclick="sendTerminalKey('CTRL_C')">^C</button>
                <button type="button" class="term-quick-pill" onclick="clearTerminalScreen()">CLS</button>
              </div>
              <div class="term-cmd-input-row">
                <input type="text" id="termQuickInput" class="term-cmd-input" placeholder="Type shell command..." autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false">
                <button type="submit" class="term-cmd-send-btn">RUN</button>
              </div>
            </form>
          </div>
        </div>

        <!-- 7. WEBUI SETTINGS -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-webui">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-webui')">
            <div class="acc-title-left">
              <div class="acc-icon-box">
                <svg class="svg-icon" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <span class="acc-main-title">Web UI</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge">INTERFACE</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Interface Theme</span>
                    <span class="setting-label-sub">Visual appearance mode for Gateway dashboard</span>
                  </div>
                  <div class="theme-tri-toggle" id="webuiThemeTriToggle">
                    <button type="button" class="tri-btn" id="triBtnAuto" onclick="setThemeMode('auto')" title="Follow System Appearance">Auto</button>
                    <button type="button" class="tri-btn" id="triBtnDay" onclick="setThemeMode('day')" title="Light Appearance">Day</button>
                    <button type="button" class="tri-btn" id="triBtnNight" onclick="setThemeMode('night')" title="Dark Appearance">Night</button>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Live Auto-Refresh</span>
                    <span class="setting-label-sub">Real-time status and throughput telemetry updates</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="autoRefresh" checked onchange="toggleAutoRefresh(this.checked)">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Conduit Flow Animations</span>
                    <span class="setting-label-sub">Active packet particle motion along data pipes</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="toggleAnimFlow" checked onchange="toggleAnimFlow(this.checked)">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Ambient Cyber Glow</span>
                    <span class="setting-label-sub">High-tech neon aura and drop shadow accents</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="toggleCyberGlow" checked onchange="toggleCyberGlow(this.checked)">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Compact Dense Mode</span>
                    <span class="setting-label-sub">Condensed margins and spacing for multi-display monitoring</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="toggleDenseMode" onchange="toggleDenseMode(this.checked)">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Haptic UI Feedback</span>
                    <span class="setting-label-sub">Vibrate mobile device on button clicks, switches, and modal actions</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="toggleHapticFeedback" checked onchange="toggleHapticFeedback(this.checked)">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="setting-section-divider"></div>
                <div class="setting-section-header">Notification &amp; Alert Preferences</div>

                <!-- 1. Alert Storage Retention -->
                <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('notif_retention')">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Alert Storage Retention</span>
                    <span class="setting-label-sub" id="disp_webui_notif_retention">50 Alerts (Auto-prunes oldest)</span>
                  </div>
                  <div class="setting-arrow-col">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                <!-- 2. Device Alerts -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Device Connect &amp; Disconnect Alerts</span>
                    <span class="setting-label-sub">Notify when Wi-Fi and LAN clients associate or drop off</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="webuiNotifTriggerDevice" checked onchange="saveWebUiNotificationTriggers()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 3. WAN Alerts -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">WAN &amp; Failover Alerts</span>
                    <span class="setting-label-sub">Notify on interface state changes, USB tethering, or uplink outage</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="webuiNotifTriggerWan" checked onchange="saveWebUiNotificationTriggers()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 4. Security Alerts -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Security &amp; Firewall Alerts</span>
                    <span class="setting-label-sub">Notify on brute-force login attempts, SSH logins, and security blocks</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="webuiNotifTriggerSecurity" checked onchange="saveWebUiNotificationTriggers()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 5. Health Alerts -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">System Health &amp; Memory Spikes</span>
                    <span class="setting-label-sub">Notify on high memory/CPU usage, zram spikes, or thermal limits</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="webuiNotifTriggerHealth" checked onchange="saveWebUiNotificationTriggers()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 6. Update Alerts -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Firmware &amp; OS Updates</span>
                    <span class="setting-label-sub">Notify when new MAXNET releases are ready for installation</span>
                  </div>
                  <div class="toggle-wrap-cell">
                    <label class="toggle-switch">
                      <input type="checkbox" id="webuiNotifTriggerUpdate" checked onchange="saveWebUiNotificationTriggers()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- 7. Clear All Notifications -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Clear All Stored Notifications</span>
                    <span class="setting-label-sub">Purge all local alerts from router storage</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="round-action-btn btn-danger-action" id="btnClearAllNotifsWebui" onclick="clearAllNotificationsWebui()" title="Clear All Notifications" aria-label="Clear All Notifications">
                      <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 8. ABOUT -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-about">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-about')">
            <div class="acc-title-left">
              <div class="acc-icon-box">
                <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <span class="acc-main-title">Specifications</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge">AUTHOR</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div style="font-size:13.5px; font-weight:800; color:var(--text-main);">
                Maxnet Gateway OS &middot; Arcadyan AX6000
              </div>
              <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">
                Engineered for High-Throughput Linux 6.18 Qualcomm IPQ9574 Multipath Routing
              </div>

              <div style="margin-top:14px; padding:12px 14px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:8px;">
                <div style="font-size:11px; font-weight:700; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">Lead Developer Profile</div>
                <div style="font-size:13px; font-weight:700; color:var(--text-main);">Mahendra Mali (Max)</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:4px; line-height:1.5;">
                  Systems Architect &amp; Kernel Network Engineer specializing in multi-WAN high-speed aggregation, Qualcomm PPE hardware acceleration, embedded MAXNET firmware optimizations, and low-latency gaming infrastructure.
                </div>
              </div>

              <div class="setting-row-item" style="margin-top:10px;">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Donation &amp; Support (UPI)</span>
                  <span class="setting-label-sub" id="upiText" style="font-family:var(--font-mono); font-size:12.5px; font-weight:700;">9824584454@ybl</span>
                  <span class="setting-label-sub" style="font-size:10.5px; margin-top:2px;">Direct Developer Support &bull; Mahendra Mali (Max)</span>
                </div>
                <div class="setting-control-col">
                  <button type="button" class="round-action-btn" onclick="copyUpi()" title="Copy UPI ID" aria-label="Copy UPI ID" style="width:34px; height:34px; min-width:34px;">
                    <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div> <!-- /settingsDetailContainer -->
      </div> <!-- /settingsDetailPageView -->
    </div> <!-- /tabSettings -->
  </div> <!-- /dashboardContainer -->


  <!-- LOGOUT CONFIRMATION WARNING MODAL -->
  <div id="logoutConfirmModal" class="logout-modal-backdrop" style="display:none;" onclick="if(event.target === this) hideLogoutConfirm()">
    <div class="logout-modal-card">
      <div class="logout-modal-icon-wrap">
        <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div class="logout-modal-title">Sign Out of Gateway?</div>
      <div class="logout-modal-desc">
        Your active administrative session will be terminated and you will need to re-authenticate to access Gateway controls.
      </div>
      <div class="logout-modal-actions">
        <button type="button" class="logout-modal-btn cancel" onclick="hideLogoutConfirm()">Keep Logged In</button>
        <button type="button" class="logout-modal-btn confirm" onclick="logoutSession()">Log Out</button>
      </div>
    </div>
  </div>
`,t=null,n=new Set,r=localStorage.getItem(`maxnet_theme_mode`)||`night`;!localStorage.getItem(`maxnet_theme_mode`)&&localStorage.getItem(`maxnet_theme`)&&(r=localStorage.getItem(`maxnet_theme`)===`light`?`day`:`night`);var i=r===`day`?`light`:`dark`,a=`ip`,o=[],s={epoch:null,timezone:``,zonename:``,ntp_enabled:!0,ntp_servers:[],auto_reboot_enabled:!1,auto_reboot_time:``},c=[`0.pool.ntp.org`,`1.pool.ntp.org`,`time.cloudflare.com`,`time.google.com`],l=[[`Etc/UTC`,`UTC0`],[`America/Los_Angeles`,`PST8PDT,M3.2.0,M11.1.0`],[`America/Denver`,`MST7MDT,M3.2.0,M11.1.0`],[`America/Chicago`,`CST6CDT,M3.2.0,M11.1.0`],[`America/New_York`,`EST5EDT,M3.2.0,M11.1.0`],[`Europe/London`,`GMT0BST,M3.5.0/1,M10.5.0`],[`Europe/Berlin`,`CET-1CEST,M3.5.0,M10.5.0/3`],[`Asia/Dubai`,`GST-4`],[`Asia/Kolkata`,`IST-5:30`],[`Asia/Singapore`,`SGT-8`],[`Asia/Tokyo`,`JST-9`],[`Australia/Sydney`,`AEST-10AEDT,M10.1.0,M4.1.0/3`]];function u(){let e=`dark`;if(e=r===`auto`?window.matchMedia&&window.matchMedia(`(prefers-color-scheme: dark)`).matches?`dark`:`light`:r===`day`?`light`:`dark`,i=e,document.documentElement.setAttribute(`data-theme`,e),f(),typeof Ss==`function`)try{Ss()}catch{}if(typeof U==`function`)try{U()}catch{}}function d(e){[`auto`,`day`,`night`].includes(e)||(e=`night`),r=e,localStorage.setItem(`maxnet_theme_mode`,e),localStorage.setItem(`maxnet_theme`,e===`day`?`light`:`dark`),u()}function f(){let e={auto:document.getElementById(`triBtnAuto`),day:document.getElementById(`triBtnDay`),night:document.getElementById(`triBtnNight`)};Object.keys(e).forEach(t=>{e[t]&&(t===r?e[t].classList.add(`active`):e[t].classList.remove(`active`))})}window.matchMedia&&window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`,()=>{r===`auto`&&u()}),u();function p(e,t={}){let n=`${e}${e.includes(`?`)?`&`:`?`}_t=${Date.now()}`,r=localStorage.getItem(`maxnet_token`);return fetch(n,{...t,cache:`no-store`,headers:{"Cache-Control":`no-cache, no-store, must-revalidate`,Pragma:`no-cache`,Expires:`0`,...r?{Authorization:`Bearer `+r,"X-Session-Token":r}:{},...t.headers||{}}})}i===`light`&&document.documentElement.setAttribute(`data-theme`,`light`),window.addEventListener(`load`,async()=>{try{if((await(await p(`/cgi-bin/clients?action=check`)).json()).blocked){window.location.href=`/blocked.html`;return}}catch{}let e=localStorage.getItem(`maxnet_token`);if(e)try{if((await(await p(`/cgi-bin/auth?action=verify&token=`+e)).json()).status===`ok`){_();return}}catch{}h()});async function m(){try{let e=await(await fetch(`/cgi-bin/health`)).json();if(e.status===`ok`){let t=e.hostname||e.router&&e.router.hostname||`MAXNET-GATEWAY`,n=String(e.firmware||``).trim();if(n&&n.toLowerCase()!==`unknown`){let e=n.toUpperCase().startsWith(`V`)?n.toUpperCase():`V${n}`;document.title=`MAXNET | ${e}`}let r=document.getElementById(`loginDeviceHostTitle`);r&&(r.textContent=t.toUpperCase()),n&&n.toLowerCase()!==`unknown`||(document.title=`MAXNET`)}}catch(e){console.error(`fetchPublicHealthSnapshot error`,e)}}function h(){document.getElementById(`loginScreen`).style.display=`flex`,document.getElementById(`dashboardContainer`).style.display=`none`;let e=document.getElementById(`loginPass`),n=document.getElementById(`loginRootPassHint`);e&&(e.value=``,e.placeholder=`Checking router password status…`),n&&(n.style.display=`none`),t&&clearInterval(t),m(),g()}async function g(){try{let e=await(await fetch(`/cgi-bin/auth?action=check_root_pass`,{cache:`no-store`})).json(),t=[e.has_password,e.has_root_pass,e.has_root_password,e.root_password_set,e.root_pass_set,e.password_set,e.configured].find(e=>typeof e==`boolean`||e===0||e===1||[`true`,`false`,`0`,`1`].includes(String(e).toLowerCase())),n=t===void 0?e.password_empty===!0||e.root_pass_empty===!0||e.root_password_empty===!0||e.status===`empty`||e.status===`unset`:t===!1||t===0||String(t).toLowerCase()===`false`||String(t)===`0`,r=document.getElementById(`loginRootPassHint`),i=document.getElementById(`loginPass`);r&&(r.style.display=n?`block`:`none`),i&&(i.placeholder=n?`No password set — leave blank`:`Enter administrator password`)}catch{let e=document.getElementById(`loginRootPassHint`),t=document.getElementById(`loginPass`);e&&(e.style.display=`none`),t&&(t.placeholder=`Enter password if one is set; otherwise leave blank`)}}function _(){if(document.getElementById(`loginScreen`).style.display=`none`,document.getElementById(`dashboardContainer`).style.display=`block`,typeof U==`function`&&U(),B(),Va(),_r(),fn(),Is(),Ki(),Co(),po(),qa(),no(),typeof Io==`function`&&Io(),Il(),setTimeout(Oc,1e3),window.location.hash&&window.location.hash.startsWith(`#setting=`)){let e=decodeURIComponent(window.location.hash.replace(`#setting=`,``)).split(`&`)[0];e&&(z(`settings`,!0,!1),O(e,!1))}}function v(e){let t=e.replace(/-----[^\n]+-----/g,``).replace(/[\r\n\s]/g,``),n=window.atob(t),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);return r.buffer}async function y(e,t){if(!window.crypto||!window.crypto.subtle)return null;try{let n=await(await fetch(`/cgi-bin/auth?action=challenge`,{cache:`no-store`})).json();if(!n||n.status!==`ok`||!n.public_key||!n.nonce)return null;let r=v(n.public_key),i=await window.crypto.subtle.importKey(`spki`,r,{name:`RSA-OAEP`,hash:`SHA-256`},!1,[`encrypt`]),a=JSON.stringify({user:e,pass:t,nonce:n.nonce,ts:n.timestamp||Date.now()}),o=new TextEncoder,s=await window.crypto.subtle.encrypt({name:`RSA-OAEP`},i,o.encode(a)),c=new Uint8Array(s),l=``;for(let e=0;e<c.byteLength;e++)l+=String.fromCharCode(c[e]);return{action:`login_encrypted`,payload:window.btoa(l),nonce:n.nonce}}catch(e){return console.warn(`Asymmetric credential encryption fell back:`,e),null}}async function b(){let e=document.getElementById(`loginUser`).value.trim(),t=document.getElementById(`loginPass`).value,n=document.getElementById(`loginErrMsg`),r=document.getElementById(`btnLogin`);n.style.display=`none`,r&&(r.disabled=!0);try{let r=null;try{r=await y(e,t)}catch{}r||(r={action:`login`,user:e,pass:t});let i=await(await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(r)})).json();i.status===`ok`?(localStorage.setItem(`maxnet_token`,i.token),_()):(n.innerText=i.message||`Invalid username or password`,n.style.display=`block`)}catch{n.innerText=`Authentication error. Check gateway connection.`,n.style.display=`block`}finally{r&&(r.disabled=!1)}}function x(){let e=document.getElementById(`logoutConfirmModal`);e&&(e.style.display=`flex`)}function S(){let e=document.getElementById(`logoutConfirmModal`);e&&(e.style.display=`none`)}async function C(){S();let e=localStorage.getItem(`maxnet_token`);e&&fetch(`/cgi-bin/auth?action=logout&token=`+e).catch(()=>{}),localStorage.removeItem(`maxnet_token`),h()}var w={"acc-usb-wan":{title:`USB WAN`,badge:`MULTI-WAN`,badgeColor:`#0ea5e9`},"acc-sys-info":{title:`Device Info`,badge:`HARDWARE & SYSTEM`,badgeColor:`#38bdf8`},"acc-network":{title:`Network`,badge:`LAN INTERFACE`,badgeColor:`#38bdf8`},"acc-interfaces":{title:`Interfaces`,badge:`WAN & INTERFACES`,badgeColor:`#0ea5e9`},"acc-pppoe":{title:`PPPoE Broadband`,badge:`CLIENT & SERVER`,badgeColor:`#06b6d4`},"acc-pppoe-users":{title:`Subscriber Accounts`,badge:`PPPoE CLIENTS`,badgeColor:`#06b6d4`},"acc-notifications":{title:`Notifications`,badge:`NOTIFICATIONS`,badgeColor:`#f59e0b`},"acc-webhooks":{title:`Webhooks`,badge:`WEBHOOKS`,badgeColor:`#0ea5e9`},"acc-topo-layers":{title:`Network Topology`,badge:`LAYERS 2 & 3`,badgeColor:`#38bdf8`},"acc-lan-clients":{title:`DHCP Clients`,badge:`CLIENT LEASES`,badgeColor:`#10b981`},"acc-wifi-clients":{title:`Wi-Fi Clients`,badge:`WIRELESS STATIONS`,badgeColor:`#06b6d4`},"acc-system-time":{title:`Date & Time`,badge:`CLOCK & TIMEZONE`,badgeColor:`#06b6d4`},"acc-gaming":{title:`Gaming Mode`,badge:`LOW LATENCY`,badgeColor:`#ec4899`},"acc-device-info":{title:`About Developer`,badge:`HARDWARE & USB`,badgeColor:`#a78bfa`},"acc-tailscale":{title:`Tailscale`,badge:`ENCRYPTED MESH`,badgeColor:`#06b6d4`},"acc-adb-device":{title:`ADB Devices`,badge:`ANDROID & HARDWARE`,badgeColor:`#38bdf8`},"acc-smb-storage":{title:`Network Storage`,badge:`NAS STORAGE`,badgeColor:`#c084fc`},"acc-security":{title:`Security`,badge:`PROTECTION`,badgeColor:`#f59e0b`},"acc-diagnostics":{title:`Diagnostics`,badge:`DIAGNOSTICS`,badgeColor:`#38bdf8`},"acc-wifi":{title:`Wi-Fi & Hotspot`,badge:`WIRELESS`,badgeColor:`#10b981`},"acc-repeater":{title:`Wireless Repeater`,badge:`CLIENT WAN`,badgeColor:`#38bdf8`},"acc-led-hardware":{title:`LED & Hardware`,badge:`HARDWARE GESTURES`,badgeColor:`#ec4899`},"acc-firmware":{title:`Update`,badge:`OS UPDATE`,badgeColor:`#38bdf8`},"acc-maintenance":{title:`Maintenance`,badge:`SYSTEM OPS`,badgeColor:`#ef4444`},"acc-logs":{title:`System Logs`,badge:`LIVE LOGS`,badgeColor:`#06b6d4`},"acc-sessions":{title:`Active Sessions & Sign Out`,badge:`SECURITY & SESSIONS`,badgeColor:`#ef4444`},"acc-packages":{title:`Packages`,badge:`SOFTWARE & PLUGINS`,badgeColor:`#38bdf8`},"acc-terminal-cli":{title:`Terminal Console`,badge:`ROOT SHELL`,badgeColor:`#10b981`},"acc-static-leases":{title:`Static IP Reservations`,badge:`DHCP LEASES`,badgeColor:`#06b6d4`},"acc-webui":{title:`Web UI`,badge:`INTERFACE`,badgeColor:`#c084fc`},"acc-diag-output":{title:`Diagnostic Output`,badge:`OUTPUT`,badgeColor:`#38bdf8`}};window._currentSettingPage=null;function T(e){let t=document.getElementById(`settingsPageActions`);if(!t)return;let n={settingsSaveAction:e===`acc-system-time`,pppoeSubscriberAddAction:e===`acc-pppoe-users`,topoResetAction:e===`acc-topo-layers`,topoExportAction:e===`acc-topo-layers`,topoImportAction:e===`acc-topo-layers`};Object.entries(n).forEach(([e,t])=>{let n=document.getElementById(e);n&&(n.style.display=t?`inline-flex`:`none`)}),t.style.display=Object.values(n).some(Boolean)?`flex`:`none`}async function E(){if(window._currentSettingPage===`acc-wifi`)return kl();if(window._currentSettingPage===`acc-system-time`)return Yc()}async function D(){if(window._currentSettingPage===`acc-wifi`)return $c();if(window._currentSettingPage===`acc-system-time`)return Lc()}function O(e,t=!0){if(!e)return;e.includes(`&`)&&(e=e.split(`&`)[0]);let n=document.getElementById(`tabSettings`);window.innerWidth>=900&&n?window._savedSettingsScrollTop=n.scrollTop:window._savedSettingsScrollTop=window.scrollY||document.documentElement.scrollTop||0;let r=w[e]||{title:`Settings`},i=document.getElementById(`settingsHomeView`),a=document.getElementById(`settingsDetailPageView`),s=document.getElementById(`settingsDetailNavTitle`),c=document.getElementById(`settingsDetailNavIcon`);if(s&&(s.textContent=r.title),c){let t=document.querySelector(`.settings-nav-card[onclick*="'${e}'"]`),n=t?t.querySelector(`.snc-icon-box`):null;n?(c.innerHTML=n.innerHTML,c.style.color=n.style.color||`#38bdf8`):c.innerHTML=e===`acc-pppoe-users`?`<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M17 11h5M19.5 8.5v5"/></svg>`:``}document.querySelectorAll(`.settings-detail-panel`).forEach(e=>{e.style.display=`none`,e.classList.remove(`page-active`)});let l=document.getElementById(e);if(l){l.style.display=`block`,l.classList.add(`page-active`);let e=l.querySelector(`.accordion-content`);e&&(e.style.maxHeight=`none`,e.style.overflow=`visible`)}i&&(i.style.display=`none`),a&&(a.style.display=`block`);let u=document.getElementById(`subnavNotifSettingsBtn`),d=document.getElementById(`subnavNotifClearBtn`);if(u&&(u.style.display=e===`acc-notifications`?`inline-flex`:`none`),d&&(d.style.display=e===`acc-notifications`?`inline-flex`:`none`),n&&n.style.display===`none`&&z(`settings`,!0,!1),window._currentSettingPage=e,T(e),e===`acc-packages`)document.body.classList.remove(`terminal-active`),typeof ls==`function`&&ls();else if(e===`acc-smb-storage`)document.body.classList.remove(`terminal-active`),typeof Js==`function`&&Js(),typeof po==`function`&&po();else if(e===`acc-interfaces`)document.body.classList.remove(`terminal-active`),typeof qa==`function`&&qa();else if(e===`acc-pppoe`||e===`acc-pppoe-users`)document.body.classList.remove(`terminal-active`),typeof no==`function`&&no();else if(e===`acc-notifications`)document.body.classList.remove(`terminal-active`),typeof Io==`function`&&Io();else if(e===`acc-webhooks`)document.body.classList.remove(`terminal-active`),typeof Uo==`function`&&Uo();else if(e===`acc-sys-info`)document.body.classList.remove(`terminal-active`),typeof nu==`function`&&nu();else if(e===`acc-terminal-cli`)document.body.classList.add(`terminal-active`),typeof Es==`function`&&Es();else if(e===`acc-wifi`)document.body.classList.remove(`terminal-active`),typeof $c==`function`&&$c();else if(e===`acc-wifi-clients`)document.body.classList.remove(`terminal-active`),typeof El==`function`&&El();else if(e===`acc-system-time`)document.body.classList.remove(`terminal-active`),typeof Lc==`function`&&Lc();else if(e===`acc-repeater`)document.body.classList.remove(`terminal-active`),typeof fl==`function`&&fl();else if(e===`acc-led-hardware`)document.body.classList.remove(`terminal-active`),typeof bl==`function`&&bl();else if(e===`acc-firmware`)document.body.classList.remove(`terminal-active`),typeof xc==`function`&&xc();else if(e===`acc-maintenance`)document.body.classList.remove(`terminal-active`),typeof Lc==`function`&&Lc(),typeof Zo==`function`&&Zo();else if(e===`acc-network`||e===`acc-static-leases`)document.body.classList.remove(`terminal-active`),typeof Va==`function`&&Va();else if(e===`acc-tailscale`)document.body.classList.remove(`terminal-active`),typeof Is==`function`&&Is();else if(e===`acc-lan-clients`){document.body.classList.remove(`terminal-active`),typeof vn==`function`&&vn(o);let e=window.location.hash||``;if(e.includes(`&client=`)){let t=decodeURIComponent(e.split(`&client=`)[1].split(`&`)[0]);t&&Sn(t,!1)}else Cn(!1)}else if(e===`acc-topo-layers`)document.body.classList.remove(`terminal-active`),typeof _r==`function`&&_r();else if(e===`acc-logs`)document.body.classList.remove(`terminal-active`),typeof Zo==`function`&&Zo();else if(e===`acc-sessions`)document.body.classList.remove(`terminal-active`),typeof ta==`function`&&ta();else if(e===`acc-security`)document.body.classList.remove(`terminal-active`),typeof Ui==`function`&&Ui();else if(e===`acc-webui`)document.body.classList.remove(`terminal-active`),typeof Kl==`function`&&Kl();else if(e===`acc-usb-wan`)document.body.classList.remove(`terminal-active`),typeof loadUsbWanSettings==`function`&&loadUsbWanSettings(),typeof fetchUsbWanStatus==`function`&&fetchUsbWanStatus();else if(e===`acc-adb-device`){document.body.classList.remove(`terminal-active`),typeof Ki==`function`&&Ki();let e=window.location.hash||``;if(e.includes(`&dev=`)){let t=decodeURIComponent(e.split(`&dev=`)[1].split(`&`)[0]);t&&Ji(t,!1)}else Yi(!1)}if(t)try{history.pushState({tab:`settings`,page:`setting-detail`,settingId:e},``,`#setting=`+encodeURIComponent(e))}catch{}window.innerWidth>=900&&n?n.scrollTo({top:0,behavior:`instant`}):window.scrollTo({top:0,behavior:`instant`})}function k(e){return[`net_gw_ip`,`net_dns1`,`net_dns2`,`iface_static_ip`,`iface_static_gw`,`iface_static_dns`,`usb_ping_target`].includes(e)?`ipv4`:[`custom_mac`,`pppoe_mac_clone`].includes(e)?`mac`:[`device_hostname`].includes(e)?`hostname`:[`net_subnet`].includes(e)?`netmask`:[`dufs_port`,`pppoe_mtu`,`iface_mtu`,`usb_dev_mtu`].includes(e)?`integer_range`:[`telegram_bot_token`].includes(e)?`telegram_token`:[`discord_webhook_url`].includes(e)?`url`:`text`}function A(e,t){if(!e)return!0;let n=k(t),r=(e.value||``).trim(),i=document.getElementById(`modalInputValidationMsg`),a=document.getElementById(`btnModalSave`),o=!0,s=``,c=`Valid format`;if(n===`ipv4`)r?/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(r)?c=`Valid IPv4 address`:(o=!1,s=`Invalid IPv4 (expected format: 192.168.1.1)`):(o=!1,s=`IPv4 address cannot be empty`);else if(n===`mac`)r&&!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(r)?(o=!1,s=`Invalid MAC (expected format: AA:BB:CC:DD:EE:FF)`):c=r?`Valid MAC address`:`Default Hardware MAC`;else if(n===`hostname`)r?/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}$/.test(r)?c=`Valid RFC-compliant hostname`:(o=!1,s=`Only letters, numbers, hyphens, underscores (1-63 chars)`):(o=!1,s=`Hostname cannot be empty`);else if(n===`netmask`)isValidNetmask(r)?c=`Valid subnet mask`:(o=!1,s=`Invalid subnet mask (e.g. 255.255.255.0)`);else if(n===`integer_range`){let e=parseInt(r,10);t.includes(`mtu`)?isNaN(e)||e<576||e>1500?(o=!1,s=`MTU must be between 576 and 1500`):c=`Valid MTU packet size`:t.includes(`port`)&&(isNaN(e)||e<1||e>65535?(o=!1,s=`Port must be between 1 and 65535`):c=`Valid TCP/UDP port`)}else n===`url`?r&&!/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(r)?(o=!1,s=`Invalid URL (must start with http:// or https://)`):c=r?`Valid webhook URL`:`Optional URL`:n===`telegram_token`&&(r&&!/^[0-9]{8,11}:[a-zA-Z0-9_-]{35}$/.test(r)?(o=!1,s=`Format: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`):c=r?`Valid Telegram bot token`:`Optional token`);return i&&(o?(i.style.display=`block`,i.style.color=`#10b981`,i.innerHTML=`<span style="font-weight:700;">&#x2713;</span> ${c}`,e.style.borderColor=`#10b981`,e.style.boxShadow=`0 0 0 2px rgba(16,185,129,0.2)`):(i.style.display=`block`,i.style.color=`#ef4444`,i.innerHTML=`<span style="font-weight:700;">&#x2717; Error:</span> ${s}`,e.style.borderColor=`#ef4444`,e.style.boxShadow=`0 0 0 2px rgba(239,68,68,0.2)`)),a&&(a.disabled=!o,a.style.opacity=o?`1`:`0.4`,a.style.cursor=o?`pointer`:`not-allowed`),o}function j(e){setTimeout(()=>{let t=document.getElementById(`settingModalBody`);if(!t)return;let n=t.querySelector(`input.mh-input`);n&&(n.addEventListener(`input`,()=>A(n,e)),n.addEventListener(`keyup`,()=>A(n,e)),A(n,e))},60)}var M=null;async function N(){try{let e=await fetch(`/cgi-bin/usb_wan?action=status`,{cache:`no-store`});if(!e.ok)throw Error(`HTTP `+e.status);let t=await e.json();M=t;let n=document.getElementById(`usbWanGlobalBadge`),r=(t.devices||[]).filter(e=>e.present&&e.status===`connected`);n&&(n.textContent=r.length>0?`${r.length} CONNECTED`:`STANDBY`,n.className=`card-badge`,n.style.background=r.length>0?`rgba(14,165,233,0.12)`:`rgba(255,255,255,0.05)`,n.style.color=r.length>0?`#38bdf8`:`var(--text-dim)`,n.style.borderColor=r.length>0?`rgba(14,165,233,0.3)`:`rgba(255,255,255,0.1)`);let i=document.getElementById(`usbLbModeVal`);if(i&&t.load_balancing){let e=t.load_balancing.mode;i.textContent=e===`failover`?`Active Failover (Hot Standby)`:e===`broadcast`?`Broadcast Duplication`:`Balanced (Weighted Round-Robin)`}let a=document.getElementById(`usbWatchdogToggle`),o=document.getElementById(`usbWatchdogVal`);a&&t.load_balancing&&(a.checked=!!t.load_balancing.watchdog,o&&(o.textContent=t.load_balancing.watchdog?`Enabled`:`Disabled`));let s=document.getElementById(`usbPingTargetVal`);s&&t.load_balancing&&(s.textContent=t.load_balancing.ping_target||`1.1.1.1`);let c=document.getElementById(`usbPingIntervalVal`);c&&t.load_balancing&&(c.textContent=`${t.load_balancing.ping_interval||15} Seconds`);let l=document.getElementById(`usbDnsOverrideVal`);l&&t.load_balancing&&(l.textContent=t.load_balancing.dns_override||`1.1.1.1, 8.8.8.8`);let u=document.getElementById(`usbTetherProtoVal`);u&&t.load_balancing&&(u.textContent=(t.load_balancing.tether_proto||`rndis`).toUpperCase());let d=document.getElementById(`usbAutoReconnectToggle`),f=document.getElementById(`usbAutoReconnectVal`);d&&t.load_balancing&&(d.checked=!!t.load_balancing.auto_reconnect,f&&(f.textContent=t.load_balancing.auto_reconnect?`Enabled`:`Disabled`)),P(t.devices||[])}catch(e){console.warn(`loadUsbWanConfig error:`,e)}}function P(e){let t=document.getElementById(`usbWanDeviceListContainer`);t&&(t.innerHTML=!e||e.length===0?`
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">No USB Modems Detected</span>
              <span class="setting-label-sub">Connect an Android phone or USB dongle</span>
            </div>
          </div>
        `:e.map(e=>{let t=e.present&&e.status===`connected`?`${$(e.ip||`Connected`)} &bull; Weight ${e.weight||50}% &bull; ${$(e.speed||`USB 3.0`)}`:`Disconnected / Standby`;return`
          <div class="setting-row-item setting-clickable-row" onclick="openEditUsbDeviceModal('${$(e.id)}')">
            <div class="setting-label-col">
              <span class="setting-label-bold">${$(e.name)} (${$(e.interface)})</span>
              <span class="setting-label-sub">${t}</span>
            </div>
            <div class="setting-arrow-col">
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        `}).join(``))}async function F(){if(!M)return;let e=document.getElementById(`usbWatchdogToggle`),t=document.getElementById(`usbAutoReconnectToggle`),n=document.getElementById(`usbWatchdogVal`),r=document.getElementById(`usbAutoReconnectVal`);e&&(M.load_balancing.watchdog=e.checked,n&&(n.textContent=e.checked?`Enabled`:`Disabled`)),t&&(M.load_balancing.auto_reconnect=t.checked,r&&(r.textContent=t.checked?`Enabled`:`Disabled`));try{let e=await(await fetch(`/cgi-bin/usb_wan?action=save_config`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(M)})).json();e.status===`ok`?(showNotificationToast(`USB WAN configuration updated`),N()):showNotificationToast(`Failed to save USB WAN config: `+(e.error||`Unknown`),!0)}catch(e){showNotificationToast(`Error saving USB WAN config: `+e.message,!0)}}async function ee(){ji(`restart_usb_modem`)}function te(e){M&&(M.devices||[]).find(t=>t.id===e)&&(window._editingUsbDevId=e,ji(`usb_device_edit`))}function ne(){window._currentDhcpClientDetail?Cn(!0):window._currentAdbDeviceDetail&&window._currentAdbSubView&&window._currentAdbSubView!==`controls`?Gr(`controls`):window._currentAdbDeviceDetail?Yi(!0):I(!0)}function I(e=!0){if(window._currentDhcpClientDetail){Cn(e);return}if(window._currentAdbDeviceDetail){Yi(e);return}if(typeof rs==`function`&&rs(),e&&window.location.hash.startsWith(`#setting=`)){history.back();return}let t=document.getElementById(`settingsHomeView`),n=document.getElementById(`settingsDetailPageView`);if(n&&(n.style.display=`none`),t&&(t.style.display=`flex`),document.body.classList.remove(`terminal-active`),document.querySelectorAll(`.settings-detail-panel`).forEach(e=>{e.style.display=`none`,e.classList.remove(`page-active`)}),window._currentSettingPage=null,T(null),window.location.hash.startsWith(`#setting=`))try{history.replaceState({tab:`settings`,page:`settings-home`},``,`#settings`)}catch{}let r=document.getElementById(`tabSettings`),i=window._savedSettingsScrollTop||0;setTimeout(()=>{window.innerWidth>=900&&r?r.scrollTo({top:i,behavior:`instant`}):window.scrollTo({top:i,behavior:`instant`})},10)}function L(e){O(e,!0)}window.addEventListener(`popstate`,e=>{let t=document.getElementById(`factoryResetModalOverlay`);if(t&&t.style.display===`flex`){oc();return}if(window._isSettingModalOpen||document.getElementById(`settingEditModalOverlay`)&&document.getElementById(`settingEditModalOverlay`).style.display===`flex`){Fi(!1);return}if(window._currentDhcpClientDetail){Cn(!1);return}if(window._currentAdbDeviceDetail){Yi(!1);return}let n=document.getElementById(`logoutConfirmModal`);if(n&&n.style.display!==`none`){S();return}let r=window.location.hash||``;if(window._currentSettingPage){if(r.startsWith(`#setting=`)){let e=decodeURIComponent(r.replace(`#setting=`,``)),t=e.split(`&`)[0];if(t&&t!==window._currentSettingPage)O(t,!1);else if(t===`acc-lan-clients`){if(e.includes(`&client=`)){let t=decodeURIComponent(e.split(`&client=`)[1].split(`&`)[0]);t&&Sn(t,!1)}else Cn(!1)}else if(t===`acc-adb-device`){if(e.includes(`&dev=`)){let t=decodeURIComponent(e.split(`&dev=`)[1].split(`&`)[0]);t&&Ji(t,!1)}else Yi(!1)}}else r===`#settings`?I(!1):(I(!1),z(`overview`,!1,!1));return}let i=document.getElementById(`tabSettings`);if(i&&i.style.display!==`none`){if(r.startsWith(`#setting=`)){let e=decodeURIComponent(r.replace(`#setting=`,``)),t=e.split(`&`)[0];if(t&&(O(t,!1),t===`acc-adb-device`&&e.includes(`&dev=`))){let t=decodeURIComponent(e.split(`&dev=`)[1].split(`&`)[0]);t&&Ji(t,!1)}}else r!==`#settings`&&z(`overview`,!1,!1)}else if(r===`#settings`)z(`settings`,!1,!1);else if(r.startsWith(`#setting=`)){let e=decodeURIComponent(r.replace(`#setting=`,``)),t=e.split(`&`)[0];if(t&&(z(`settings`,!0,!1),O(t,!1),t===`acc-adb-device`&&e.includes(`&dev=`))){let t=decodeURIComponent(e.split(`&dev=`)[1].split(`&`)[0]);t&&Ji(t,!1)}}else z(`overview`,!1,!1)}),window.addEventListener(`load`,()=>{if(!history.state)try{history.replaceState({tab:`overview`},``,window.location.href)}catch{}if(window.location.hash.startsWith(`#setting=`)){let e=decodeURIComponent(window.location.hash.replace(`#setting=`,``)),t=e.split(`&`)[0];t&&setTimeout(()=>{if(z(`settings`,!0,!1),O(t,!1),t===`acc-adb-device`&&e.includes(`&dev=`)){let t=decodeURIComponent(e.split(`&dev=`)[1].split(`&`)[0]);t&&Ji(t,!1)}},150)}else window.location.hash===`#settings`&&setTimeout(()=>{z(`settings`,!1,!1)},150)});function R(e){let t=(e||``).toLowerCase().trim(),n=document.getElementById(`settingsSearchClear`);n&&(n.style.display=t.length>0?`block`:`none`),document.querySelectorAll(`.settings-nav-card`).forEach(e=>{if(!t){e.style.display=`flex`;return}let n=(e.querySelector(`.snc-title`)||{}).textContent||``,r=(e.querySelector(`.snc-desc`)||{}).textContent||``,i=e.getAttribute(`data-search`)||``;(n+` `+r+` `+i).toLowerCase().includes(t)?e.style.display=`flex`:e.style.display=`none`})}function re(){let e=document.getElementById(`settingsSearchInput`);e&&(e.value=``,R(``),e.focus())}window.addEventListener(`keydown`,e=>{if(e.key===`Escape`){let e=document.getElementById(`logoutConfirmModal`);if(e&&e.style.display!==`none`){S();return}if(window._currentSettingPage)I();else{let e=document.getElementById(`tabSettings`);e&&e.style.display!==`none`&&z(`overview`)}}});function z(e,t=!1,n=!0){let r=window.innerWidth>=900,i=document.getElementById(`dashboardContainer`),a=document.getElementById(`tabOverview`),o=document.getElementById(`tabSettings`),s=document.getElementById(`btnTopoMenu`);if(e===`settings`){if(Ki(),Lr(),Js(),Va(),Is(),ls(),r)i&&i.classList.add(`settings-side-open`),a&&(a.style.display=`block`),o&&(o.style.display=`block`),s&&s.classList.add(`active`),typeof U==`function`&&(setTimeout(U,50),setTimeout(U,300));else{i&&i.classList.remove(`settings-side-open`),a&&(a.style.display=`none`),o&&(o.style.display=`block`),s&&s.classList.remove(`active`);let e=document.getElementById(`usbBwSvg`),t=document.querySelector(`.usb-bw-container`);if(e&&typeof e.pauseAnimations==`function`)try{e.pauseAnimations()}catch{}t&&t.classList.add(`topo-paused`)}if(!t&&window._currentSettingPage&&I(!1),n&&window.location.hash!==`#settings`&&!window.location.hash.startsWith(`#setting=`))try{history.pushState({tab:`settings`},``,`#settings`)}catch{}}else{window.scrollTo(0,0),i&&i.classList.remove(`settings-side-open`),a&&(a.style.display=`block`),o&&(o.style.display=`none`),s&&s.classList.remove(`active`);let e=document.getElementById(`usbBwSvg`),t=document.querySelector(`.usb-bw-container`);if(e&&typeof e.unpauseAnimations==`function`)try{e.unpauseAnimations()}catch{}if(t&&t.classList.remove(`topo-paused`),typeof U==`function`&&(setTimeout(U,50),setTimeout(U,300)),window._currentSettingPage&&I(!1),n&&window.location.hash!==``&&window.location.hash!==`#overview`)try{history.pushState({tab:`overview`},``,window.location.pathname)}catch{}}}function ie(){let e=window.innerWidth>=900,t=document.getElementById(`dashboardContainer`),n=document.getElementById(`tabSettings`),r=t&&t.classList.contains(`settings-side-open`),i=n&&n.style.display!==`none`;z((e?r:i)?`overview`:`settings`)}function ae(e){return e==null||isNaN(e)||e<=0?`var(--text-main)`:e<38?`var(--mh-emerald)`:e<=43?`var(--mh-gold)`:`var(--mh-rose)`}function oe(e){return e==null||isNaN(e)||e<=0?`var(--text-main)`:e<60?`var(--mh-emerald)`:e<=80?`var(--mh-gold)`:`var(--mh-rose)`}function se(e){return!e||e<=0?`0.00 MB`:e>=1073741824?(e/1073741824).toFixed(2)+` GB`:(e/1048576).toFixed(2)+` MB`}async function B(){if(!window._isFetchingData){window._isFetchingData=!0;try{let e=await(await p(`/cgi-bin/status`)).json();un(e),typeof Vo==`function`&&Vo(e),(!window._lastNotifBadgePoll||Date.now()-window._lastNotifBadgePoll>15e3)&&(window._lastNotifBadgePoll=Date.now(),fetch(`/cgi-bin/webhooks?action=get_notifications`).then(e=>e.json()).then(e=>{Array.isArray(e)&&yo(e.length)}).catch(()=>{}))}catch(e){console.error(`fetchData error`,e)}finally{window._isFetchingData=!1}}}function ce(e,t){let n=document.getElementById(`trafficSparklineCanvas`);if(!n)return;let r=n.getContext(`2d`);if(!r)return;let i=e&&e.length>=2?e:[0,0],a=t&&t.length>=2?t:[0,0],o=n.getBoundingClientRect(),s=window.devicePixelRatio||1,c=Math.round((o.width||160)*s),l=Math.round((o.height||34)*s);(n.width!==c||n.height!==l)&&(n.width=c,n.height=l),r.save(),r.scale(s,s);let u=c/s,d=l/s;r.clearRect(0,0,u,d);let f=document.documentElement.getAttribute(`data-theme`)===`light`;r.strokeStyle=f?`rgba(0, 0, 0, 0.06)`:`rgba(255, 255, 255, 0.05)`,r.lineWidth=1,r.beginPath(),r.moveTo(0,Math.round(d*.5)+.5),r.lineTo(u,Math.round(d*.5)+.5),r.stroke();let p=Math.max(2,...i,...a)*1.15,m=u/(i.length-1),h=u/(a.length-1),g=r.createLinearGradient(0,0,0,d);f?(g.addColorStop(0,`rgba(9, 9, 11, 0.22)`),g.addColorStop(1,`rgba(9, 9, 11, 0.01)`)):(g.addColorStop(0,`rgba(255, 255, 255, 0.35)`),g.addColorStop(1,`rgba(255, 255, 255, 0.01)`)),r.beginPath(),r.moveTo(0,d),i.forEach((e,t)=>{let n=d-e/p*(d-6)-3;r.lineTo(t*m,n)}),r.lineTo(u,d),r.closePath(),r.fillStyle=g,r.fill(),r.beginPath(),i.forEach((e,t)=>{let n=d-e/p*(d-6)-3;t===0?r.moveTo(0,n):r.lineTo(t*m,n)}),r.strokeStyle=f?`#09090b`:`#ffffff`,r.lineWidth=1.8,r.shadowColor=f?`rgba(0, 0, 0, 0.15)`:`rgba(255, 255, 255, 0.6)`,r.shadowBlur=f?0:4,r.stroke();let _=r.createLinearGradient(0,0,0,d);f?(_.addColorStop(0,`rgba(113, 113, 122, 0.15)`),_.addColorStop(1,`rgba(113, 113, 122, 0.01)`)):(_.addColorStop(0,`rgba(161, 161, 170, 0.22)`),_.addColorStop(1,`rgba(161, 161, 170, 0.01)`)),r.beginPath(),r.moveTo(0,d),a.forEach((e,t)=>{let n=d-e/p*(d-6)-3;r.lineTo(t*h,n)}),r.lineTo(u,d),r.closePath(),r.fillStyle=_,r.fill(),r.beginPath(),a.forEach((e,t)=>{let n=d-e/p*(d-6)-3;t===0?r.moveTo(0,n):r.lineTo(t*h,n)}),r.strokeStyle=f?`#71717a`:`#a1a1aa`,r.lineWidth=1.4,r.shadowColor=`transparent`,r.shadowBlur=0,r.stroke(),r.restore()}function le(e,t,n){if(!e||!e.links)return;let r=e.links,i=[`usb3a`,`usb3b`,`usb2a`,`usb2b`,`wan`],a=0,o=r.filter(e=>e.status===`CONNECTED`),s=!1;r.forEach((e,r)=>{if(r>=i.length)return;let c=i[r],l=document.getElementById(c),u=document.getElementById(`lbl-`+c),d=document.getElementById(`meta-`+c),f=document.getElementById(`path-`+c),p=document.getElementById(`dev-dot-`+c),m=e.status===`CONNECTED`,h=0,g=e.rx_bytes!==void 0||e.tx_bytes!==void 0;if(m&&g){window._topologyLinkRateStats||(window._topologyLinkRateStats={});let t=e.id||String(r),n=Date.now(),i=(Number(e.rx_bytes)||0)+(Number(e.tx_bytes)||0),a=window._topologyLinkRateStats[t];a&&i>=a.bytes&&n>a.time&&(h=(i-a.bytes)*8/((n-a.time)*1e3)),window._topologyLinkRateStats[t]={bytes:i,time:n}}else m&&o.length===1&&!s&&(h=Math.max(0,Number(n)||0));m&&(s=!0,a+=h),l&&(l.textContent=h.toFixed(1)+` Mbps`,m?l.classList.remove(`offline`):l.classList.add(`offline`)),u&&(u.textContent=e.label||e.type.toUpperCase()+` #`+(r+1)),d&&(d.innerHTML=m?`<span class="link-live-badge active">CONNECTED</span> • ${$(t&&t.model?t.model:e.model||e.id)}`:`<span class="link-live-badge standby">STANDBY</span> • ${$(e.model||`Slot Ready`)}`),f&&(m?(f.style.opacity=`1`,f.style.strokeDasharray=`5 13`,f.style.animationPlayState=`running`):(f.style.opacity=`0.2`,f.style.strokeDasharray=`2 8`,f.style.animationPlayState=`paused`)),p&&(m?(p.style.opacity=`1`,p.style.animationPlayState=`running`):(p.style.opacity=`0.35`,p.style.animationPlayState=`paused`))});let c=document.getElementById(`combined`);c&&(c.textContent=Math.max(0,Number(n)||0,a).toFixed(1)+` Mbps`);let l=document.getElementById(`multilinkActiveSources`);l&&(l.textContent=`${String(e.active_count||1).padStart(2,`0`)} / 05 ACTIVE`);let u=document.getElementById(`multilinkMode`);u&&(u.textContent=e.mode||`AUTO MERGE`);let d=document.getElementById(`multilinkStatusText`);if(d){let t=e.active_count||1;d.textContent=t>1?`MULTI LINK ACTIVE • ${t} LINKS MERGED`:`MULTI LINK ACTIVE • AUTO MERGE`}}window.selectedFleetSlot=0,window._cachedMultilink=null,window._cachedAdbDevices=[],window._cachedMobile=null;function ue(e){window.selectedFleetSlot=e,fe(window._cachedMultilink,window._cachedAdbDevices,window._cachedMobile);let t=(window._cachedMultilink&&window._cachedMultilink.links||[])[e]||null,n=document.getElementById(`inspectDeviceLabel`);if(t&&t.status===`CONNECTED`){n&&(n.textContent=`SLOT #${String(e+1).padStart(2,`0`)} • ${t.model||t.label}`);let r=window._cachedAdbDevices||[],i=r[e]||r[0];i&&i.serial&&de(i.serial)}else n&&(n.textContent=`SLOT #${String(e+1).padStart(2,`0`)} • STANDBY (Port Ready)`)}async function de(e){try{let t=await(await p(`/cgi-bin/device?action=telemetry&serial=`+encodeURIComponent(e))).json();if(t&&t.status===`ok`){let e=t.identity||{},n=t.radio||{},r=t.battery||{},i=t.thermals||{},a=t.memory||{},o=document.getElementById(`topolPhoneModel`);o&&(o.innerText=e.model||`5G Modem`);let s=document.getElementById(`topolPhoneBatt`);s&&(s.innerText=`${r.level||79}% (${r.temp_c||35}°C)`);let c=document.getElementById(`topolPhoneCpu`);c&&(c.innerText=`${i.cpu_c||42}°C`);let l=document.getElementById(`topolPhoneRam`);l&&(l.innerText=`${a.used_pct||50}%`);let u=document.getElementById(`topolPhoneUptime`);u&&(u.innerText=t.uptime||`--`);let d=document.getElementById(`topolCarrier`);d&&(d.innerText=n.operator||`Jio True5G`);let f=document.getElementById(`topolServingBand`);f&&(f.innerText=`${n.band||`n77`} • 3.5 GHz`);let p=document.getElementById(`topolRsrp`);p&&(p.innerText=`${n.rsrp_dbm||-98} dBm`);let m=document.getElementById(`topolSinr`);m&&(m.innerText=`${n.sinr_db||11} dB`);let h=document.getElementById(`topolArfcn`);h&&(h.innerText=n.arfcn||`634080`);let g=document.getElementById(`topolServingName`);g&&(g.innerText=`Tower PCI ${n.pci||528}`)}}catch(e){console.error(`fetchSelectedSlotTelemetry error`,e)}}function fe(e,t,n){window._cachedMultilink=e,window._cachedAdbDevices=t||[],window._cachedMobile=n;let r=document.getElementById(`fleetMatrixGrid`);if(!r)return;let i=e&&Array.isArray(e.links)?e.links:[],a=0,o=rtrHardwareCard;for(let e=0;e<16;e++){let t=i[e]||{slot:e+1,status:`STANDBY`,type:e<8?`usb3`:e<15?`usb2`:`wan`,model:`Port Ready`,speed_mbps:0},n=t.status===`CONNECTED`;n&&a++;let r=e===window.selectedFleetSlot,s=String(e+1).padStart(2,`0`),c=t.type===`wan`?`WAN 1G`:t.type===`usb3`?`USB 3.0`:`USB 2.0`,l=n?t.model||`Connected Device`:`STANDBY`,u=n?`${Number(t.speed_mbps||0).toFixed(1)}M`:`Ready`;o+=`
          <div class="fleet-slot-card ${r?`active-inspect`:``}" onclick="selectFleetSlot(${e})">
            <div class="fleet-slot-top">
              <span class="fleet-slot-num">#${s}</span>
              <span class="fleet-slot-dot ${n?`online`:``}"></span>
            </div>
            <div class="fleet-slot-model" title="${$(l)}">${$(l)}</div>
            <div class="fleet-slot-meta">
              <span>${c}</span>
              <span>${u}</span>
            </div>
          </div>
        `}r.innerHTML=o;let s=document.getElementById(`fleetActiveCountText`);s&&(s.textContent=`${a} / 16 ACTIVE`)}var V=null,pe=null;function me(e){if(e==null||isNaN(e)||e<=0)return`--`;let t=Math.floor(e),n=Math.floor(t/86400),r=Math.floor(t%86400/3600),i=Math.floor(t%3600/60),a=t%60;return n>0?`${n}d ${r}h ${i}m ${a}s`:`${r}h ${i}m ${a}s`}function he(){if(window._mobUptimeBase&&window._mobUptimeTs){let e=Math.floor((Date.now()-window._mobUptimeTs)/1e3);return me(window._mobUptimeBase+e)}return(window._lastDataCache&&window._lastDataCache.mobile||{}).uptime||`--`}function ge(){if(window._rtrUptimeBase&&window._rtrUptimeTs){let e=Math.floor((Date.now()-window._rtrUptimeTs)/1e3);return me(window._rtrUptimeBase+e)}return(window._lastDataCache&&window._lastDataCache.router||{}).uptime||`--`}function _e(e,t){let n=window._lastDataCache||{},r=document.getElementById(`topoHoverTooltip`);if(!r)return;let i={1:`22:6b:36:eb:30:fd`,2:`fe:b9:67:67:68:51`,3:`f2:fc:8e:af:33:47`,4:`16:be:81:63:99:91`},a=``,o=``,s=``,c=``,l=!1,u=!1;if(e===`modem`){let e=n.mobile||{},r=Array.isArray(n.usb_devices)?n.usb_devices:[],i=n.network&&n.network.lan_ip||window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`,d=st&&st[t]&&st[t].deviceData||r[t]||(t===0&&e.connected?{model:e.model,is_wan:!0,ip:e.lan_ip||e.ip||i,adb_enabled:!0,has_sim:e.has_sim!==!1,battery_pct:e.battery&&e.battery.level||null,operator:e.cellular&&e.cellular.operator||`Jio True5G`,band:e.cellular&&e.cellular.band||`n77`,rsrp_dbm:e.cellular&&e.cellular.rsrp_dbm||-97,standard:`USB 3.0`,speed_mbps:5e3,port:3}:null),f=(t===void 0?0:t)+1;if(a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,d){let e=d.device_type===`ssd`||d.device_type===`pendrive`||d.device_type===`storage`||d.has_storage;o=$(d.hostname||d.model||(e?`USB-Storage`:`Modem ${f}`));let t=`Phone`;if(d.device_type===`ssd`?t=`NVMe SSD`:(d.device_type===`pendrive`||d.device_type===`storage`||d.has_storage)&&(t=`USB Flash Drive`),s=$(d.model||t),e){a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><circle cx="7" cy="14" r="1"/><line x1="12" y1="14" x2="16" y2="14"/></svg>`;let e=d.virtual_ip||i,t=d.total_space&&d.total_space!==`--`?`${d.total_space} (${d.free_space||`0`} free)`:`Ready (Standby)`,n=d.mount_point||`/mnt/pendrive`,r=d.smb_running!==!1;l=!0,u=r;let o=r?`Online (io_uring)`:`Stopped`,s=r?`#10b981`:`#71717a`;c=`
              <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Hostname</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${$(d.hostname||`storage-Disk-2-0.lan`)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">LAN Access IP</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(e)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Mount Point</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(n)} (${d.mounted?`Mounted`:`Standby`})</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Disk Capacity</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(t)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">USB Port & Standard</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">Port ${d.port||f} · ${$(d.standard||`USB 2.0`)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Link Standard</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${d.standard===`USB 3.0`?`5 Gbps (SuperSpeed)`:`480 Mbps (HighSpeed)`}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; grid-column:span 2;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Network Share Path</span>
                      <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">\\\\${$(e)}\\${$(d.share_name||`Pendrive`)}</strong>
                    </div>
                    <div style="text-align:right;">
                      <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">SMB Service</span>
                      <strong style="font-size:11px; font-family:var(--font-mono); color:${s}; margin-top:2px; display:block;">${o}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div style="margin-top:10px; padding-top:8px; border-top:1px solid var(--border-sub, rgba(255,255,255,0.06)); display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <button class="mh-btn ${r?`btn-ghost`:``}" onclick="toggleSmbService(event)" style="font-size:10px; padding:4px 10px; font-family:var(--font-mono); height:26px; min-height:unset;">
                  ${r?`STOP SMB`:`START SMB`}
                </button>
                <button class="mh-btn btn-ghost" onclick="openSmbSettings(event)" style="font-size:10px; padding:4px 10px; font-family:var(--font-mono); height:26px; min-height:unset;">
                  MORE SETTINGS &rarr;
                </button>
              </div>
            `}else{d.status||d.is_wan;let e=d.has_internet!==!1,r=e?`#10b981`:`#ef4444`,i=d.internet_status||(e?`Online`:`No Internet`),a=[];d.has_tethering&&a.push(`TETHERING`),(d.has_adb||d.adb_enabled)&&a.push(`ADB`),d.has_mtp&&a.push(`MTP`);let o=a.length>0?a.join(` · `):`Direct Link`;a.map(e=>`<span style="display:inline-block; padding:2px 6px; font-size:9px; font-weight:700; font-family:var(--font-mono); border-radius:4px; background:rgba(59,130,246,0.12); color:#38bdf8; border:1px solid rgba(59,130,246,0.3); margin-right:4px;">${$(e)}</span>`).join(``);let s=d.virtual_ip||d.ip||`--`,l=d.battery_pct!==null&&d.battery_pct!==void 0?`${d.battery_pct}%`:d.adb_enabled?`--`:`No ADB`,u=d.has_sim===!0&&d.operator!==`No SIM`&&d.operator!==`--`?`${d.operator||`Cellular`} ${d.band||``}`.trim():`No SIM`,p=(n.multilink&&Array.isArray(n.multilink.links)?n.multilink.links:[]).find(e=>e.id===d.net_interface)||{},m=Number(p.speed_mbps||0),h=m>0?`${m.toFixed(1)} Mbps`:`0.0 Mbps`,g=d.standard===`USB 3.0`?`5 Gbps`:`480 Mbps`;c=`
              <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Hostname</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${$(d.hostname||`Device`)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Virtual LAN IP</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(s)}</strong>
                  ${d.dhcp_ip&&d.dhcp_ip!==s&&d.dhcp_ip!==`--`&&d.dhcp_ip!==`DHCP`?`<span style="font-size:9px; color:var(--text-dim); font-family:var(--font-mono); display:block; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Device IP: ${$(d.dhcp_ip)}</span>`:``}
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Internet Status</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:${r}; margin-top:2px; display:block;">${$(i)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Hardware Type</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(t)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">USB Port & Standard</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">Port ${d.port||f} · ${$(d.standard||`USB 2.0`)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">USB Modes</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${$(o)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Live Throughput</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:#38bdf8; margin-top:2px; display:block;">${h} <span style="font-size:9.5px; color:var(--text-dim); font-weight:400;">(${g})</span></strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Battery & SIM</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${l} · ${u}</strong>
                </div>
              </div>
            `}}else o=`Hub Port ${f}`,s=`Standby`,c=`
            <div style="padding:9px; text-align:center; color:var(--text-dim); font-size:11px; font-family:var(--font-mono);">
              Standby
            </div>
          `}else if(e===`wan`){let e=n.network||{};o=`WAN`,s=$(e.wan_ip||`--`),a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>`,c=`
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">IP</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(e.wan_ip||`--`)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Gateway</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(e.gateway_ip||`--`)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">DNS</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(e.dns_ip||`--`)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Live Throughput</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${(Math.max(0,Number(window._currentRxMbps)||0)+Math.max(0,Number(window._currentTxMbps)||0)).toFixed(1)} Mbps</strong>
            </div>
          </div>
        `}else if(e===`hub`){let e=n.usb_hub||{};o=`USB Hub`,s=e.model||`USB Hub`,a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="6" cy="12" r="1.5"/><circle cx="10" cy="12" r="1.5"/><circle cx="14" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>`;let t=e.manufacturer||`--`,r=e.model||`--`,i=e.capacity||`--`,l=e.ports||4,u=e.usb3_ports||4,d=e.usb2_ports||4,f=e.connected_devices===void 0?Array.isArray(n.usb_devices)?n.usb_devices.length:0:e.connected_devices,p=e.speed_mbps?`${e.speed_mbps} Mbps`:`--`;c=`
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Company</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(t)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Model</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(r)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Capacity</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(i)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Total Ports</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${l} Ports</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">USB 3.x</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:#00d2ff; margin-top:2px; display:block;">${u} Ports</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">USB 2.0</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${d} Ports</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Connected</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--mh-emerald, #10b981); margin-top:2px; display:block;">${f} Devices</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Uplink</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(p)}</strong>
            </div>
          </div>
        `}else if(e===`storage`){let e=n.usb_storage||{},t=(n.usb_devices||[]).find(e=>e.device_type===`storage`||e.has_storage)||{};o=`USB Storage`,s=t.raw_model||t.model||e.name||`USB storage`,a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:#c084fc; fill:none; stroke-width:2;"><path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><line x1="10" y1="6" x2="14" y2="6"/><line x1="10" y1="18" x2="14" y2="18"/></svg>`;let r=e.device||t.device||`--`,i=e.mount_point||t.mount_point||`--`,l=e.total||t.total_space||`--`,u=e.free||t.free_space||`--`,d=t.speed_mbps?`${t.speed_mbps} Mbps`:`--`,f=e.share_path||t.share_path||`\\\\${n.network?.lan_ip||`10.0.0.1`}\\Pendrive`;c=`
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Device</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(r)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Mount Point</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${$(i)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Total Capacity</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(l)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Free Space</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--mh-emerald, #10b981); margin-top:2px; display:block;">${$(u)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Interface Speed</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:#c084fc; margin-top:2px; display:block;">${$(d)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">SMB Share</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${$(f)}</strong>
            </div>
          </div>
          <div style="display:flex; gap:8px; margin-top:12px; width:100%; box-sizing:border-box;">
            <a href="http://${window.location.hostname||`10.0.0.1`}:5000/" target="_blank" class="mh-btn" style="flex:1; text-align:center; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px; font-size:11.5px; font-weight:700; background:rgba(192,132,252,0.15); color:#c084fc; border:1px solid rgba(192,132,252,0.3); border-radius:8px; padding:8px 12px;">
              <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span>Open Dufs File Manager</span>
            </a>
            <button onclick="closeTopoNodeDetail(); openSettingPage('acc-smb-storage');" class="mh-btn" style="flex:1; text-align:center; font-size:11.5px; font-weight:700; background:var(--panel-inner); color:var(--text-main); border:1px solid var(--border-main); border-radius:8px; padding:8px 12px; cursor:pointer;">
              <span>Storage Settings</span>
            </button>
          </div>
        `}else if(e===`router`||e===`combined`){let e=n.network||{},t=n.router||{};o=`Router`,s=$(t.model||`Jio AX6000 Qualcomm IPQ9574`),a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,c=`
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">CPU Usage</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">cpu ${t.cpu_pct===void 0?5:t.cpu_pct}%${t.temp_c?` (${Number(t.temp_c).toFixed(1)}°C)`:``}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">RAM Memory</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">ram ${t.memory&&t.memory.used_pct!==void 0?t.memory.used_pct:32}% use</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Combined Speed</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:#00d2ff; margin-top:2px; display:block;">${ot.cv?ot.cv.textContent:`0`} Mbps</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Router Uptime</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--mh-emerald, #10b981); margin-top:2px; display:block; white-space:nowrap;">${ge()}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Gateway IP</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(e.lan_ip||`10.0.0.1`)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Ethernet Ports</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">4 GbE Ports</strong>
            </div>
          </div>
        `}else if(e===`lan`){let e=t!==void 0&&t>=1&&t<=4?t:2,r=`lan`+e,l=((n.network||{}).ports||[]).find(e=>e.id===r)||{id:r,speed:0,status:`down`},u=l.status===`up`,d=(n.clients||[]).filter(t=>{let n=(t.port||``).toLowerCase();return!!(n.includes(`lan `+e)||n.includes(`lan`+e)||e===3&&(n.includes(`switch`)||n.includes(`ap`))||!n&&e===2)});o=`LAN ${e}`,s=u?`Connected`:`Disconnected`,a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 10h10M7 14h10"/></svg>`,c=`
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Status</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:${u?`var(--mh-emerald, #10b981)`:`var(--text-dim)`}; margin-top:2px; display:block;">${u?`Up`:`Down`}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Speed</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${u?l.speed+` Mbps`:`0 Mbps`}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Devices</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${d.length}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">MAC</span>
              <strong style="font-size:10px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${i[e]||`--`}</strong>
            </div>
          </div>
        `}else if(e===`secondary_router`||e===`ap`){let e=n.clients||[],r=null,i=``,l=`WiFi AP`,u=`LAN`;if(t>=0&&e[t]){if(r=e[t],i=r.ip||``,u=r.port||`LAN`,r.name&&typeof r.name==`string`){let e=r.name.trim(),t=e.toLowerCase();t!==`device`&&t!==`unknown`&&e!==i&&e!==``&&(l=e.replace(/\.lan$/i,``).toUpperCase())}}else u=`LAN `+((t<-1?-t-1:2)+1),l=`WiFi AP`;o=$(l),s=$(i||u),a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 18h.01M10 18h.01"/><path d="M15 10a4 4 0 0 0-6 0M18 7a8 8 0 0 0-12 0"/></svg>`;let d=e.filter(e=>e.port&&e.port.toLowerCase().includes(u.toLowerCase())&&e.ip!==i).length;c=`
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Ping</span>
              <strong id="ttDevPing" style="font-size:12px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${i&&window._lastPingCache&&window._lastPingCache[i]?window._lastPingCache[i]:i?`Pinging...`:`< 1 ms`}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Devices</span>
              <strong style="font-size:12px; font-family:var(--font-mono); color:var(--mh-emerald, #10b981); margin-top:2px; display:block;">${d}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Port</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(u)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Total</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${r&&r.total_mb?r.total_mb:`0.00`} MB</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Down</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">↓ ${r&&r.rx_mb?r.rx_mb:`0.00`} MB</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Up</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">↑ ${r&&r.tx_mb?r.tx_mb:`0.00`} MB</strong>
            </div>
          </div>
        `,i&&ve(i)}else if(e===`client`){let e=(n.clients||[])[t]||{},r=e.ip||``,i=r;if(e.name&&typeof e.name==`string`){let t=e.name.trim(),n=t.toLowerCase();n!==`device`&&n!==`unknown`&&t!==r&&t!==``&&(i=t)}let l=typeof ht==`function`?ht(e):{type:`client`,title:`LAN Device`,icon:`client`,color:`#10b981`,badge:`DEVICE`};o=$(i),s=$(r?`${r} · ${l.title}`:l.title),a=l.type===`phone`?`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`:l.type===`laptop`?`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20M12 16v4"/></svg>`:l.type===`nas`||l.type===`storage`?`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`:l.type===`cctv`?`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`:l.type===`router`?`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6" y2="14"/><line x1="18" y1="6" x2="18" y2="14"/><circle cx="6" cy="4" r="1"/><circle cx="18" cy="4" r="1"/></svg>`:`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,c=`
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Device Type</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:${l.color}; margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${l.title} [${l.badge}]</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Ping Latency</span>
              <strong id="ttDevPing" style="font-size:12px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${window._lastPingCache&&window._lastPingCache[r]?window._lastPingCache[r]:`Pinging...`}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Physical Port</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${$(e.port||`LAN`)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Total Bandwidth</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${e.total_mb||`0.00`} MB</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Download</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">↓ ${e.rx_mb||`0.00`} MB</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">MAC Address</span>
              <strong style="font-size:10px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${$(e.mac||`--`)}</strong>
            </div>
          </div>
        `,r&&ve(r)}r.innerHTML=`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid var(--border-sub, rgba(255,255,255,0.08)); padding-bottom:8px; gap:8px;">
          <div style="display:flex; align-items:center; gap:8px; min-width:0; overflow:hidden;">
            <div style="width:28px; height:28px; min-width:28px; border-radius:6px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.08)); display:flex; align-items:center; justify-content:center; color:var(--text-main); flex-shrink:0;">
              ${a}
            </div>
            <div style="min-width:0; overflow:hidden;">
              <div style="font-size:12px; font-weight:800; font-family:var(--font-mono); color:var(--text-main); letter-spacing:0.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${o}</div>
              <div style="font-size:10px; color:var(--text-dim); font-family:var(--font-mono); margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${s}</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
            ${l?`
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-size:9.5px; font-weight:700; color:${u?`#10b981`:`var(--text-dim)`}; font-family:var(--font-mono);">${u?`SMB ON`:`SMB OFF`}</span>
                <label class="toggle-switch" style="transform:scale(0.8); margin:0;" title="Toggle Samba Server">
                  <input type="checkbox" ${u?`checked`:``} onchange="toggleSmbService(event)">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            `:``}
            <button onclick="hideBadaTooltip(event)" style="background:none; border:none; color:var(--text-dim); font-size:18px; cursor:pointer; padding:0 4px; line-height:1;" title="Close">&times;</button>
          </div>
        </div>
        <div style="min-width:0; overflow:hidden;">${c}</div>
      `}window._lastPingCache={};async function ve(e){if(e){if(window._lastPingCache[e]){let t=document.getElementById(`ttDevPing`);t&&(t.textContent=window._lastPingCache[e])}try{let t=await fetch(`/cgi-bin/diagnostics?tool=ping&target=`+encodeURIComponent(e));if(!t.ok)throw Error(`HTTP `+t.status);let n=(await t.json()).output||``,r=n.match(/min\/avg\/max\s*=\s*[\d.]+\/([\d.]+)\//),i=n.match(/time=([\d.]+)\s*ms/),a=`< 1 ms`;if(r){let e=parseFloat(r[1]);a=e<1?e.toFixed(2)+` ms`:e.toFixed(1)+` ms`}else if(i){let e=parseFloat(i[1]);a=e<1?e.toFixed(2)+` ms`:e.toFixed(1)+` ms`}else(n.includes(`100% packet loss`)||n.includes(`100.0% packet loss`))&&(a=`Offline / No reply`);window._lastPingCache[e]=a;let o=document.getElementById(`ttDevPing`);o&&(o.textContent=a)}catch{let t=document.getElementById(`ttDevPing`);t&&!window._lastPingCache[e]&&(t.textContent=`< 1 ms`)}}}function ye(e,t){let n=e&&e.currentTarget?e.currentTarget:null;if(window.innerWidth<768){let r=Math.min(330,window.innerWidth-20);t.style.width=r+`px`,t.style.left=`50%`,t.style.transform=`translateX(-50%)`;let i=80;if(n){let e=n.getBoundingClientRect();i=e.top>250?Math.max(70,e.top-200):Math.min(window.innerHeight-260,e.bottom+14)}else e&&e.clientY&&(i=Math.max(70,Math.min(window.innerHeight-260,e.clientY-120)));t.style.top=i+`px`}else{t.style.width=`320px`,t.style.transform=`none`;let r=0,i=0;if(n){let e=n.getBoundingClientRect();e.left<window.innerWidth*.45?(r=e.right+16,i=e.top-20):e.left>window.innerWidth*.65?(r=e.left-336,i=e.top-20):(r=e.left+e.width/2-160,i=e.top>240?e.top-220:e.bottom+16)}else e&&e.clientX&&(r=e.clientX+16,i=e.clientY-20);let a=Math.max(12,Math.min(window.innerWidth-334,r)),o=Math.max(70,Math.min(window.innerHeight-260,i));t.style.left=a+`px`,t.style.top=o+`px`}}function be(e,t,n=0){e&&e.stopPropagation&&e.stopPropagation(),V={type:t,index:n},window.showBadaTooltip=be;let r=document.getElementById(`topoHoverTooltip`);r&&(_e(t,n),ye(e,r),r.style.display=`block`,requestAnimationFrame(()=>r.classList.add(`visible`)),pe&&clearInterval(pe),pe=setInterval(()=>{V?V&&_e(V.type,V.index):(clearInterval(pe),pe=null)},1500))}function xe(e){e&&e.stopPropagation&&e.stopPropagation(),V=null,pe&&(clearInterval(pe),pe=null);let t=document.getElementById(`topoHoverTooltip`);t&&(t.classList.remove(`visible`),setTimeout(()=>{V||(t.style.display=`none`)},150))}function Se(e){e&&e.stopPropagation&&e.stopPropagation(),xe(e),typeof z==`function`&&z(`settings`),setTimeout(()=>{let e=document.getElementById(`acc-smb-storage`);e&&(e.classList.contains(`active`)||L(`acc-smb-storage`),e.scrollIntoView({behavior:`smooth`,block:`center`}))},100)}async function Ce(e){e&&e.stopPropagation&&e.stopPropagation();let t=e&&e.target,n=t&&t.type===`checkbox`,r=document.getElementById(`badgeSmbMaster`),i=``;!n&&t&&(i=t.textContent,t.textContent=`...`);try{let e=await(await fetch(`/cgi-bin/smb_config?action=toggle`)).json();r&&(e&&e.running?(r.className=`toggle-status-badge on`,r.textContent=`RUNNING`,n&&(t.checked=!0)):(r.className=`toggle-status-badge off`,r.textContent=`STOPPED`,n&&(t.checked=!1))),typeof B==`function`&&await B(),V&&_e(V.type,V.index),typeof Js==`function`&&Js()}catch(e){console.error(`Error toggling SMB:`,e),!n&&t&&(t.textContent=i)}}function we(e,t,n=0){e&&(e.onclick=e=>{e.stopPropagation(),V&&V.type===t&&V.index===n?xe(e):be(e,t,n)})}document.addEventListener(`click`,e=>{let t=document.getElementById(`topoHoverTooltip`);t&&t.classList.contains(`visible`)&&(t.contains(e.target)||xe(e))}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&xe(e)});var Te=1,Ee=0,De=0;function Oe(e){Te=Math.min(2.5,Math.max(.4,Math.round((Te+e)*100)/100)),Ae()}function ke(){Te=1,Ee=0,De=0,window._topoUserInteracted=!1,Ae()}function Ae(){let e=document.getElementById(`usbBwSvg`),t=document.getElementById(`topoZoomResetBtn`);e&&(e.style.transform=`translate3d(${Ee}px, ${De}px, 0) scale(${Te})`,e.style.transformOrigin=`50% 50%`,e.style.transition=Ne?`none`:`transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`),t&&(t.textContent=`${Math.round(Te*100)}%`)}function je(){let e=document.querySelector(`.usb-bw-container`),t=document.getElementById(`topoFsIcon`);if(!e)return;let n=e.classList.toggle(`topo-fullpage-mode`);t&&(t.innerHTML=n?`<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>`:`<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>`),ke(),setTimeout(()=>{typeof U==`function`&&U()},60)}document.addEventListener(`keydown`,e=>{if(e.key===`Escape`){let e=document.querySelector(`.usb-bw-container`);e&&e.classList.contains(`topo-fullpage-mode`)&&je()}});function Me(e){window._topoActiveLayer=e||`all`,document.querySelectorAll(`.topo-layer-btn`).forEach(t=>{t.id===`topoLayerBtn_`+e||t.dataset.layer===e?t.classList.add(`active`):t.classList.remove(`active`)}),typeof U==`function`&&U()}var Ne=!1,Pe=!1,Fe=0,Ie=0,Le=0,Re=0,ze=0,Be=0,Ve=0,He=0,Ue=0,We=null,Ge=0;function Ke(e=!1){let t=document.getElementById(`usbBwSvg`);if(!t)return;t.style.transition=e?`transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)`:`none`,t.style.transform=`translate(${Ee}px, ${De}px) scale(${Te})`;let n=document.getElementById(`topoZoomResetBtn`);n&&(n.textContent=`${Math.round(Te*100)}%`)}function qe(){let e=document.querySelector(`#tabOverview .bw-box`);if(!e||e._panInitialized)return;e._panInitialized=!0,e.addEventListener(`mousedown`,t=>{t.target.closest(`button`)||t.target.closest(`.topo-toolbar`)||t.target.closest(`select`)||t.target.closest(`.round-action-btn`)||t.target.closest(`#topoMinimapContainer`)||(We&&(cancelAnimationFrame(We),We=null),Ne=!0,Pe=!1,Fe=t.clientX,Ie=t.clientY,Le=Ee,Re=De,ze=t.clientX,Be=t.clientY,Ve=performance.now(),He=0,Ue=0,e.style.cursor=`grabbing`)}),window.addEventListener(`mousemove`,e=>{if(!Ne)return;let t=e.clientX-Fe,n=e.clientY-Ie;!Pe&&Math.hypot(t,n)>5&&(Pe=!0);let r=performance.now(),i=Math.max(1,r-Ve);He=(e.clientX-ze)/i,Ue=(e.clientY-Be)/i,ze=e.clientX,Be=e.clientY,Ve=r,Ee=Le+t,De=Re+n,Ke(!1)}),window.addEventListener(`mouseup`,()=>{Ne&&(Ne=!1,e&&(e.style.cursor=``),Ke(!0),Pe&&setTimeout(()=>{Pe=!1},80))});let t=0,n=1;e.addEventListener(`touchstart`,e=>{e.target.closest(`button`)||e.target.closest(`.topo-toolbar`)||e.target.closest(`select`)||e.target.closest(`.round-action-btn`)||e.target.closest(`#topoMinimapContainer`)||(We&&(cancelAnimationFrame(We),We=null),e.touches.length===1?(Ne=!0,Pe=!1,Fe=e.touches[0].clientX,Ie=e.touches[0].clientY,Le=Ee,Re=De,ze=e.touches[0].clientX,Be=e.touches[0].clientY,Ve=performance.now(),He=0,Ue=0):e.touches.length===2&&(Ne=!1,t=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),n=Te))},{passive:!1}),e.addEventListener(`touchmove`,e=>{if(e.touches.length===1&&Ne){e.preventDefault();let t=e.touches[0].clientX,n=e.touches[0].clientY,r=t-Fe,i=n-Ie;!Pe&&Math.hypot(r,i)>5&&(Pe=!0);let a=performance.now(),o=Math.max(1,a-Ve);He=(t-ze)/o,Ue=(n-Be)/o,ze=t,Be=n,Ve=a,Ee=Le+r,De=Re+i,Ke(!1)}else if(e.touches.length===2&&t>0){e.preventDefault();let r=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)/t;Te=Math.min(3,Math.max(.35,Math.round(n*r*100)/100)),Ke(!1)}},{passive:!1}),e.addEventListener(`touchend`,e=>{if(e.touches.length===0){Ne=!1,t=0,Pe&&setTimeout(()=>{Pe=!1},80);let e=performance.now();if(e-Ge<300){Ge=0,Te>1.15?nt():(Te=1.45,Ke(!0));return}if(Ge=e,Math.hypot(He,Ue)>.15){let e=He*16,t=Ue*16,n=()=>{e*=.92,t*=.92,Ee+=e,De+=t,Ke(!1),Math.hypot(e,t)>.4?We=requestAnimationFrame(n):(We=null,Ke(!0))};We=requestAnimationFrame(n)}else Ke(!0)}else e.touches.length===1&&(Ne=!0,Fe=e.touches[0].clientX,Ie=e.touches[0].clientY,Le=Ee,Re=De,t=0)}),e.addEventListener(`wheel`,e=>{e.preventDefault(),Oe(e.deltaY<0?.12:-.12)},{passive:!1}),window.addEventListener(`keydown`,e=>{let t=document.getElementById(`tabOverview`);if(!t||t.style.display===`none`)return;let n=e.target&&e.target.tagName?e.target.tagName.toLowerCase():``;n!==`input`&&n!==`textarea`&&n!==`select`&&(e.key===`ArrowUp`?(e.preventDefault(),De+=40,Ke(!0)):e.key===`ArrowDown`?(e.preventDefault(),De-=40,Ke(!0)):e.key===`ArrowLeft`?(e.preventDefault(),Ee+=40,Ke(!0)):e.key===`ArrowRight`?(e.preventDefault(),Ee-=40,Ke(!0)):e.key===`+`||e.key===`=`?(e.preventDefault(),Oe(.15)):e.key===`-`||e.key===`_`?(e.preventDefault(),Oe(-.15)):e.key===`f`||e.key===`F`?(e.preventDefault(),nt()):e.key===`0`?(e.preventDefault(),ke()):e.key===`Escape`&&(typeof Qe==`function`&&Qe(),typeof tt==`function`&&tt()))})}document.addEventListener(`DOMContentLoaded`,qe),setTimeout(qe,500);function Je(){let e=document.getElementById(`usbBwSvg`),t=document.querySelector(`.usb-bw-container`);if(!e||!t)return;function n(n){if(n&&!document.hidden){if(typeof e.unpauseAnimations==`function`)try{e.unpauseAnimations()}catch{}t.classList.remove(`topo-paused`)}else{if(typeof e.pauseAnimations==`function`)try{e.pauseAnimations()}catch{}t.classList.add(`topo-paused`)}}`IntersectionObserver`in window&&(window._topoObserver&&window._topoObserver.disconnect(),window._topoObserver=new IntersectionObserver(e=>{e.forEach(e=>{let t=document.getElementById(`tabOverview`),r=t&&t.style.display!==`none`;n(e.isIntersecting&&r)})},{threshold:.05}),window._topoObserver.observe(t)),document.addEventListener(`visibilitychange`,()=>{let e=document.getElementById(`tabOverview`),t=e&&e.style.display!==`none`;n(!document.hidden&&t)})}document.addEventListener(`DOMContentLoaded`,Je),setTimeout(Je,600);var Ye=null,Xe=!1;function Ze(e,t,r){if(r&&r.stopPropagation&&r.stopPropagation(),Pe||Ne)return;Ye=e,Xe=!!t;let i=document.getElementById(`topoNodeDetailOverlay`);if(!i)return;clearTimeout(window._topoNodeDetailCloseTimer),i.parentElement!==document.body&&document.body.appendChild(i);let a=document.getElementById(`topoNodeDetailTitle`),o=document.getElementById(`topoNodeDetailSub`),s=document.getElementById(`topoNodeDetailStatusBadge`),c=document.getElementById(`topoNodeDetailIconBox`),l=document.getElementById(`topoNodeDetailBody`),u=document.getElementById(`btnTopoNodeViewClient`),d=document.getElementById(`btnTopoNodeEditSettings`),f=document.getElementById(`btnTopoNodeUnblock`);f&&(f.style.display=`none`);let p=window._lastDataCache||{},m=Array.isArray(p.clients)?p.clients:[],h=p.router||{},g=p.network||{},_=Array.isArray(p.usb_devices)&&p.usb_devices[0]||{},v=p.mobile||{},y=Array.isArray(g.ports)?g.ports:[];function b(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function x(e){return!e||e===`--`?``:`<button type="button" class="round-action-btn" onclick="navigator.clipboard.writeText('${e}'); if(typeof showToast==='function')showToast('Copied: ${e}');" title="Copy" style="width:20px; height:20px; min-width:20px; border:none; background:transparent; cursor:pointer; color:currentColor; display:inline-flex; align-items:center; justify-content:center; opacity:0.75;"><svg viewBox="0 0 24 24" style="width:11px; height:11px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>`}function S(e,t,n,r){return`
          <div class="topo-detail-row"${r?` style="grid-column:1 / -1;"`:``}>
            <svg class="topo-detail-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5m0-8h.01"/></svg>
            <div class="topo-detail-copy">
              <span class="topo-detail-label">${b(e)}</span>
              <span class="topo-detail-value">${t}</span>
              ${n?`<span class="topo-detail-sub">${n}</span>`:``}
            </div>
          </div>
        `}function C(e,t,n){return`<div class="topo-quick-info-item"><svg viewBox="0 0 24 24" aria-hidden="true">${e}</svg><div class="topo-quick-info-copy"><span class="topo-quick-info-label">${b(t)}</span><strong class="topo-quick-info-value">${b(n)}</strong></div></div>`}if(e.type===`wan`||e.type===`repeater`){let t=p.repeater||p.topology_layers?.tree?.repeater_uplink||{};if(e.isRepeater||e.type===`repeater`||!h.usb?.connected&&!v.connected&&t.connected){let n=t.ssid||`Wi-Fi Uplink`,r=t.ip||e.ip||g.wan_ip||`--`;a&&(a.textContent=`Wi-Fi Repeater (${n})`),o&&(o.textContent=`Wireless Uplink • Device: ${t.device||`phy1-sta0`} (${t.band||`5 GHz`})`),s&&(s.textContent=`ONLINE`,s.className=`card-badge emerald`),c&&(c.style.background=`rgba(56,189,248,0.12)`,c.style.color=`#38bdf8`,c.innerHTML=`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`);let f=[];f.push(S(`Repeater IP Address`,`<span>${b(r)}</span> ${x(r)}`,`DHCP Wireless Lease`)),f.push(S(`Target Wi-Fi SSID`,`<span>${b(n)}</span>`,`BSSID: ${b(t.bssid||`--`)}`)),f.push(S(`Physical Link Speed`,`<span>${b(t.bitrate||(Number(p.topology_layers?.tree?.active_uplink?.speed_mbps)>0?`${p.topology_layers.tree.active_uplink.speed_mbps} Mbps`:`Unknown`))}</span>`,`Wireless link rate`)),f.push(S(`Signal Strength`,`<span>${b(t.signal||`-55 dBm`)}</span>`,`Band: ${b(t.band||`5 GHz`)}`)),t.gateway&&f.push(S(`Upstream Gateway`,`<span>${b(t.gateway)}</span> ${x(t.gateway)}`,`Next-Hop Router`));let m=`${(Math.max(0,Number(window._currentRxMbps)||0)+Math.max(0,Number(window._currentTxMbps)||0)).toFixed(1)} Mbps`;f.push(S(`Live Throughput`,`<span style="color:#10b981;">${b(m)}</span>`,`Active Traffic`)),l&&(l.innerHTML=`<div class="topo-details-grid">${f.join(``)}</div>`),u&&(u.style.display=`none`),d&&(d.textContent=`REPEATER SETTINGS`,d.onclick=()=>{Qe(),typeof z==`function`&&z(`settings`),typeof O==`function`&&O(`acc-repeater`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}let n=_.device_type===`storage`||_.device_type===`ssd`||_.device_type===`pendrive`||_.has_storage,r=(window._cachedUsbWanData?.devices||[]).find(e=>(e.interface||e.id)===(_.net_interface||`usb0`)),f=v.usb_ip||r?.ip||g.wan_ip||_.dhcp_ip||e.ip||`--`,m=_.model||v&&v.model||(n?`USB Storage`:`USB Modem`);if(a&&(a.textContent=n?_.model||`USB Storage Drive`:m),o&&(o.textContent=`WAN Uplink • Interface: ${_.net_interface||`usb0`} (USB 3.0)`),s){let e=v.connected||_.status===`online`||_.has_internet;s.textContent=e?`ONLINE`:`CONNECTING`,s.className=`card-badge `+(e?`emerald`:`amber`)}c&&(c.style.background=n?`rgba(192,132,252,0.12)`:`rgba(56,189,248,0.12)`,c.style.color=n?`#c084fc`:`#38bdf8`,c.innerHTML=n?`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="6" y="2" width="12" height="14" rx="2"/><rect x="9" y="16" width="6" height="6"/><line x1="10" y1="19" x2="10" y2="20"/><line x1="14" y1="19" x2="14" y2="20"/></svg>`:`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`);let y=[];y.push(S(`WAN IP Address`,`<span>${b(f)}</span> ${x(f)}`,`DHCP Upstream Carrier Lease`));let C=!!(h.usb?.connected||_.connected||v.connected),w=C?_.standard||h.usb?.link_mode||`USB 3.0 SuperSpeed`:`Disconnected`,T=C?_.speed_mbps||h.usb?.speed_mbps||5e3:0;if(C?y.push(S(`USB Hardware Link`,`${b(w)} (${T} Mbps)`,`Bus: ${_.bus||`2-1`} • Port: ${_.port||`1`}`)):y.push(S(`USB Hardware Port`,`Port Ready (No Device)`,`USB 3.0 Host Port Active`)),n)y.push(S(`Storage Partitions`,`${b(_.mount_point||`/mnt/storage`)}`,`Total: ${b(_.total_space||`--`)} • Free: ${b(_.free_space||`--`)}`)),y.push(S(`File Sharing (SMB)`,`${_.smb_running?`SMB Active`:`SMB Stopped`}`,`Share: ${b(_.share_path||`\\\\10.0.0.1\\Storage`)}`));else{let e=_.operator||v.cellular?.operator||`Jio`,t=_.network||v.cellular?.network||`5G SA (NR)`,n=v.cellular?.bars===void 0?`Full Signal`:`${v.cellular.bars}/4 Bars`,r=v.cellular?.rsrp_dbm?` (${v.cellular.rsrp_dbm} dBm)`:``;y.push(S(`Cellular Network`,`${b(e)} • ${b(t)}`,`Signal: ${n}${r}`));let i=_.battery_pct??v.battery?.level??`--`,a=_.battery_temp_c??v.battery?.temp_c??`--`;y.push(S(`Phone Battery & Thermals`,`${i}% Battery (${v.battery?.status||`Normal`})`,`Temp: ${a}°C • SoC: Normal`))}let E=e.speed||`${(Math.max(0,Number(window._currentRxMbps)||0)+Math.max(0,Number(window._currentTxMbps)||0)).toFixed(1)} Mbps`,D=h.usb?.rx_mb||0,k=h.usb?.tx_mb||0,A=D>1024?(D/1024).toFixed(2)+` GB`:D.toFixed(1)+` MB`,j=k>1024?(k/1024).toFixed(2)+` GB`:k.toFixed(1)+` MB`;y.push(S(`Live Throughput`,`<span style="color:#10b981;">${b(E)}</span>`,`Session: Rx ${A} • Tx ${j}`)),y.push(S(`Tethering Link`,`${b(_.dhcp_ip||_.tethering_ip||v.usb_ip||`IP unavailable`)}`,`Phone-side address • ${_.net_interface||`USB network`}`)),y.push(S(`Device Features`,`<span class="card-badge ${_.has_tethering?`emerald`:`sky`}" style="font-size:9.5px; margin-right:4px;">${_.has_tethering?`Tethering active`:`Tethering off`}</span><span class="card-badge sky" style="font-size:9.5px;">ADB: ${_.adb_enabled?`Enabled`:`Disabled`}</span>`,`USB High-Speed Connection`)),l&&(l.innerHTML=`<div class="topo-details-grid">${y.join(``)}</div>`),u&&(u.style.display=`none`),d&&(d.textContent=`NETWORK SETTINGS`,d.onclick=()=>{Qe(),typeof z==`function`&&z(`settings`),typeof O==`function`&&O(`acc-interfaces`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}if(e.id===`root`||e.type===`router`&&!e.uplinkPort){let t=h.hostname||e.name||`MAXNET`,n=e.ip||`10.0.0.1`,r=e.mac||m.find(e=>e.is_self)?.mac||`ce:b2:bb:ae:4d:16`,f=h.model||`Qualcomm IPQ9574 AX6000`,p=h.kernel||`Linux 6.18`;a&&(a.textContent=`${t} (Gateway)`),o&&(o.textContent=`${f} • ${p}`),s&&(s.textContent=`ONLINE`,s.className=`card-badge emerald`),c&&(c.style.background=`rgba(16,185,129,0.12)`,c.style.color=`#10b981`,c.innerHTML=`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`);let g=[];g.push(S(`Gateway LAN IP`,`<span>${b(n)}</span> ${x(n)}`,`MAC: ${b(r)}`));let _=h.uptime||`--`,v=Array.isArray(h.load_avg)?h.load_avg.join(`, `):`--`;g.push(S(`System Uptime`,`${b(_)}`,`Load Avg: ${b(v)}`));let y=h.cpu_pct===void 0?`--`:`${h.cpu_pct}%`;g.push(S(`CPU Processor Load`,`${b(y)} Active`,`Qualcomm Quad-Core SoC`));let C=h.memory||{},w=Number(C.phys_total_mb)||0,T=Number(C.phys_avail_mb)||0,E=Math.max(0,w-T),D=C.phys_used_pct===void 0?w>0?(E*100/w).toFixed(1):`0`:Number(C.phys_used_pct).toFixed(1);g.push(S(`Physical Hardware RAM`,w>0?`${D}% Used (${E} / ${w} MB)`:`--`,w>0?`${T} MB Physical Available Free`:`No live memory data`));let k=Number(C.zram_total_mb)||0,A=Number(C.zram_used_mb)||0,j=C.zram_used_pct===void 0?k>0?(A*100/k).toFixed(1):`0`:Number(C.zram_used_pct).toFixed(1);g.push(S(`ZRAM Compressed Swap`,`${A} MB / ${k} MB Used (${j}%)`,`Engine: LZO-RLE • Dynamic Swap Active`));let M=Number(C.total_mb)||w+k,N=Number(C.used_mb)||E+A,P=C.used_pct===void 0?M>0?Math.round(N*100/M):`--`:C.used_pct;g.push(S(`Total Working Memory Pool`,`${P}% Used (${N} / ${M} MB)`,`${C.available_mb||M-N} MB Combined Available`));let F=h.temp_c===void 0?`--`:`${h.temp_c.toFixed(1)}°C`;g.push(S(`Core Temperature`,`${F}`,`All Thermal Zones Optimal`));let ee=m.filter(e=>!e.is_self&&e.connected).length;g.push(S(`Connected Clients`,`${ee} Active Devices`,`Wired LAN & Wireless Network`)),l&&(l.innerHTML=`<div class="topo-details-grid">${g.join(``)}</div>`),u&&(u.style.display=`none`),d&&(d.textContent=`SYSTEM INFO`,d.onclick=()=>{Qe(),typeof z==`function`&&z(`settings`),typeof O==`function`&&O(`acc-sys-info`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}if(e.type===`ap`||e.type===`router`&&e.uplinkPort){let t=e.name||`Sub-Router`,n=e.ip||`--`,r=e.mac||`--`,f=m.find(e=>e.ip===n||e.mac===r),p=e.metrics?.vendor||f?.vendor||`Broadcom / Reliance`,h=e.uplinkPort?e.uplinkPort.replace(`root-`,``).toUpperCase():`LAN 3`,g=Array.isArray(e.wireless_clients)?e.wireless_clients:[];a&&(a.textContent=`${t}`),o&&(o.textContent=`Access Point / Sub-Router • ${n}`),s&&(s.textContent=`ONLINE`,s.className=`card-badge emerald`),c&&(c.style.background=`rgba(56,189,248,0.12)`,c.style.color=`#38bdf8`,c.innerHTML=`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`);let _=[];if(_.push(S(`IP Address`,`<span>${b(n)}</span> ${x(n)}`,`Hostname: ${b(t)}.lan`)),_.push(S(`MAC & Hardware`,`${b(r)}`,`Vendor: ${b(p)}`)),_.push(S(`Gateway Uplink`,`Port ${b(h)}`,`Link Speed: ${e.link_speed||f?.link_speed||`unavailable`}`)),_.push(S(`Sub-Clients Count`,`${g.length} Wireless Clients`,`Bridged Network Traffic`)),g.length>0){let e=g.map(e=>`
            <div style="background:${isLight?`rgba(0,0,0,0.02)`:`rgba(255,255,255,0.02)`}; padding:8px 10px; border-radius:6px; border:1px solid ${cardBorder}; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; color:${textMain}; font-size:11px;">${b(e.name||`Wireless Device`)}</div>
                <div style="font-size:10px; color:${textDim};">${b(e.ip||`--`)} &bull; ${b(e.mac||`--`)}</div>
              </div>
              <div style="text-align:right;">
                <span class="card-badge sky" style="font-size:9px;">${b(e.linkSpeed||`72 Mbps`)}</span>
                ${e.metrics?.ping_avg_ms?`<div style="font-size:9.5px; color:#10b981; margin-top:2px;">${e.metrics.ping_avg_ms} ms</div>`:``}
              </div>
            </div>
          `).join(``);_.push(`
            <div style="background:${cardBg}; padding:10px 12px; border-radius:8px; border:1px solid ${cardBorder}; grid-column:span 2;">
              <div style="color:${textDim}; font-size:9.5px; font-weight:800; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Clients Connected Behind This AP:</div>
              <div style="display:flex; flex-direction:column; gap:6px; max-height:160px; overflow-y:auto;">${e}</div>
            </div>
          `)}l&&(l.innerHTML=`<div class="topo-details-grid">${_.join(``)}</div>`),u&&(u.style.display=`none`),d&&(d.textContent=`DHCP CLIENTS`,d.onclick=()=>{Qe(),typeof z==`function`&&z(`settings`),typeof O==`function`&&O(`acc-lan-clients`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}if(e.type===`storage`){let t=p.usb_storage||{},n=Array.isArray(p.usb_devices)&&p.usb_devices.find(e=>e.device_type===`storage`||e.has_storage)||{},r=e.name||n.raw_model||n.model||t.name||`USB storage`,f=e.size||n.total_space||t.total||`--`,m=e.free||n.free_space||t.free||`--`,h=e.mount_point||n.mount_point||t.mount_point||`--`,_=t.device||n.device||`--`,v=g&&g.lan_ip||`10.0.0.1`,y=e.share_path||n.share_path||`\\\\${v}\\Pendrive`,C=Number(e.speed_mbps||n.speed_mbps)>0?`${Number(e.speed_mbps||n.speed_mbps)} Mbps`:`--`;a&&(a.textContent=`${r}`),o&&(o.textContent=`External USB Storage • Local Network Share & Dufs WebDAV`),s&&(s.textContent=`ONLINE`,s.className=`card-badge emerald`),c&&(c.style.background=`rgba(192,132,252,0.12)`,c.style.color=`#c084fc`,c.innerHTML=`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><line x1="10" y1="6" x2="14" y2="6"/><line x1="10" y1="18" x2="14" y2="18"/></svg>`);let w=[];w.push(S(`Drive Capacity`,`<span>${b(f)}</span>`,`Free Space: ${b(m)} available`)),w.push(S(`Mount Point`,`<span>${b(h)}</span>`,`Block Device: ${b(_)}`)),w.push(S(`SMB Share Path`,`<span>${b(y)}</span> ${x(y)}`,`Windows / macOS / Linux Network File Sharing`)),w.push(S(`Dufs WebDAV Manager`,`<span>http://${b(v)}:5000/</span>`,`Web File Manager & Browser Uploads`)),w.push(S(`Hardware Interface`,`<span>${b(C)}</span>`,`Qualcomm IPQ9574 USB 3.0 Host Port`)),l&&(l.innerHTML=`<div class="topo-details-grid">${w.join(``)}</div>`),u&&(u.style.display=`inline-flex`,u.textContent=`STORAGE SETTINGS`,u.onclick=()=>{Qe(),typeof z==`function`&&z(`settings`),typeof O==`function`&&O(`acc-smb-storage`)}),d&&(d.textContent=`OPEN FILE MANAGER`,d.onclick=()=>{window.open(`http://${v}:5000/`,`_blank`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}if(e.type===`hub`){let t=p.usb_hub||{},n=e.name||t.model||`USB 3.0 Hub`,r=e.ports||t.ports||4,f=e.connected_count||t.connected_count||1,m=e.available_ports||r-f,h=(e.speed_mbps||t.speed_mbps||5e3)>=1e3?`5 Gbps (SuperSpeed USB 3.0)`:`480 Mbps (HighSpeed USB 2.0)`;a&&(a.textContent=`${n}`),o&&(o.textContent=`External USB Extension Hub • ${r} Downstream Ports`),s&&(s.textContent=`ONLINE`,s.className=`card-badge emerald`),c&&(c.style.background=`rgba(56,189,248,0.12)`,c.style.color=`#38bdf8`,c.innerHTML=`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="4" y="8" width="16" height="8" rx="2"/><circle cx="8" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="16" cy="12" r="1.2" fill="currentColor"/></svg>`);let g=[];g.push(S(`Total Downstream Ports`,`<span>${r} Ports</span>`,`Hardware USB Splitter Ports`)),g.push(S(`Active Connected Devices`,`<span>${f} Connected</span>`,`Available Empty Ports: ${m}`)),g.push(S(`Bus Standard Speed`,`<span>${h}</span>`,`Host Controller Link Speed`)),g.push(S(`Auto-Detection Mode`,`<span style="color:#10b981;">Hardware Hotplug Active</span>`,`Plug & Play USB Peripheral Detection`));let _=(Array.isArray(e.ports_list)&&e.ports_list.length>0?e.ports_list:Array.isArray(t.ports_list)&&t.ports_list.length>0?t.ports_list:[{port:1,version:`U3.0`,version_name:`USB 3.0 Ready (5 Gbps)`,status:`available`,speed_mbps:5e3},{port:2,version:`U3.0`,version_name:`USB 3.0 Ready (5 Gbps)`,status:`available`,speed_mbps:5e3},{port:3,version:`U2.0`,version_name:`USB 2.0 HighSpeed (480 Mbps)`,status:`connected`,name:`Disk 2.0`,device_type:`storage`,speed_mbps:480},{port:4,version:`U3.0`,version_name:`USB 3.0 Ready (5 Gbps)`,status:`available`,speed_mbps:5e3}]).map(e=>{let t=e.status===`connected`,n=e.version||`U3.0`,r=`#38bdf8`,i=`rgba(56, 189, 248, 0.12)`,a=`rgba(56, 189, 248, 0.3)`;n.includes(`3.2`)?(r=`#00d2ff`,i=`rgba(0, 210, 255, 0.12)`,a=`rgba(0, 210, 255, 0.35)`):n.includes(`2`)?(r=`#c084fc`,i=`rgba(192, 132, 252, 0.12)`,a=`rgba(192, 132, 252, 0.35)`):n.includes(`1`)&&(r=`#a1a1aa`,i=`rgba(161, 161, 170, 0.12)`,a=`rgba(161, 161, 170, 0.3)`);let o=e.speed_mbps&&e.speed_mbps>=1e3?e.speed_mbps>=1e4?`10 Gbps`:`5 Gbps`:e.speed_mbps?`${e.speed_mbps} Mbps`:`--`,s=t?e.name||`Connected USB Peripheral`:`Empty Port (Ready)`;return`
            <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 12px; background:var(--card-inner, #161822); border:1px solid ${t?`rgba(16, 185, 129, 0.25)`:`var(--border-sub, rgba(255,255,255,0.06))`}; border-radius:8px; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px; min-width:0;">
                <span style="font-size:11px; font-weight:800; font-family:var(--font-mono); color:var(--text-main); white-space:nowrap;">Port ${e.port}</span>
                <span style="font-size:9.5px; font-weight:800; font-family:var(--font-mono); padding:1.5px 7px; border-radius:4px; background:${i}; color:${r}; border:1px solid ${a}; white-space:nowrap;">${n}</span>
                <span style="font-size:11px; font-family:var(--font-mono); color:${t?`var(--text-main)`:`var(--text-muted)`}; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                  ${b(s)}
                </span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
                <span style="font-size:9.5px; font-weight:700; font-family:var(--font-mono); color:${t?`#10b981`:`var(--text-dim)`}; text-transform:uppercase; letter-spacing:0.5px;">
                  ${t?`CONNECTED`:`AVAILABLE`}
                </span>
                <span style="font-size:10px; font-weight:600; font-family:var(--font-mono); color:var(--text-dim);">
                  ${o}
                </span>
              </div>
            </div>
          `}).join(``);l&&(l.innerHTML=`
            <div class="topo-details-grid">${g.join(``)}</div>
            <div style="margin-top:14px;">
              <div style="font-size:10px; font-weight:800; font-family:var(--font-mono); color:var(--text-dim); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:8px;">
                Downstream Ports &amp; Negotiated Protocols
              </div>
              <div style="display:flex; flex-direction:column; gap:6px;">
                ${_}
              </div>
            </div>
          `),u&&(u.style.display=`none`),d&&(d.textContent=`USB SETTINGS`,d.onclick=()=>{Qe(),typeof z==`function`&&z(`settings`),typeof O==`function`&&O(`acc-usb-wan`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}if(t){let t=e,n=t.id?t.id.replace(`root-`,``):(t.label||``).toLowerCase().replace(/\s+/g,``),r=y.find(e=>e.id===n)||{},f=r.status===`up`||t.role&&t.role!==`empty`,p=t.label||n.toUpperCase();a&&(a.textContent=`Port ${p}`),o&&(o.textContent=`Physical Ethernet Bay • Qualcomm IPQ9574 Switch`),s&&(s.textContent=f?`LINK UP (${Number(r.speed)>0?`${r.speed}M`:`SPEED UNKNOWN`})`:`DISCONNECTED`,s.className=`card-badge `+(f?`emerald`:`gray`)),c&&(c.style.background=f?`rgba(16,185,129,0.12)`:`rgba(148,163,184,0.12)`,c.style.color=f?`#10b981`:`#94a3b8`,c.innerHTML=`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M7 16h10M7 8h2m6 0h2M10 8v4m4-4v4"/></svg>`);let m=t.child||{},h=m.name||m.ip||(f?`Connected Entity`:`Empty Port Socket`),g=m.ip||`--`,_=[];_.push(S(`Port Link State`,f?`<span style="color:#10b981;">Up (${Number(r.speed)>0?`${r.speed} Mbps`:`speed unknown`} ${r.duplex?r.duplex.toUpperCase():``})</span>`:`<span style="color:#94a3b8;">Down • No Link</span>`,`Port Identifier: ${b(n.toUpperCase())}`)),_.push(S(`Hardware Port Bay`,`Ethernet port`,`Negotiated link speed is shown when reported by the router`)),_.push(S(`Attached Entity`,`<span>${b(h)}</span>`,g===`--`?`No attached device detected`:`IP: ${b(g)}`,!0)),l&&(l.innerHTML=`<div class="topo-details-grid">${_.join(``)}</div>`),u&&(u.style.display=`none`),d&&(d.textContent=`SWITCH PORTS`,d.onclick=()=>{Qe(),typeof z==`function`&&z(`settings`),typeof O==`function`&&O(`acc-switch`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}let w=e,T=m.find(e=>w.ip&&e.ip===w.ip||w.mac&&e.mac===w.mac),E=w.ip||T?.ip||`--`,D=w.mac||T?.mac||`--`,k=w.name||T?.name||E||`Client Device`,A=T?T.connected:w.status!==`offline`,j=!!(w.band||w.linkSpeed||T&&T.port&&T.port.toLowerCase().includes(`wifi`)||w.uplinkPort&&w.uplinkPort.includes(`ap`));w.metrics?.vendor||T?.vendor;let M=!!(w.blocked||T?.blocked||n!==void 0&&n.has(E));a&&(a.textContent=`${k}`),o&&(o.textContent=`${j?`Wi-Fi Wireless Client`:`Wired Ethernet Client`} • ${E}${M?` • FIREWALL BLOCKED`:``}`),s&&(M?(s.textContent=`BLOCKED`,s.className=`card-badge ruby`):(s.textContent=A?`ONLINE`:`OFFLINE`,s.className=`card-badge `+(A?`emerald`:`gray`))),c&&(c.style.background=M?`rgba(239,68,68,0.12)`:j?`rgba(56,189,248,0.12)`:`rgba(16,185,129,0.12)`,c.style.color=M?`#ef4444`:j?`#38bdf8`:`#10b981`,c.innerHTML=j?`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`:`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`);let N=j?`Wi-Fi${w.linkSpeed?` · ${w.linkSpeed}`:``}`:w.uplinkPort?`Port ${w.uplinkPort.replace(`root-`,``).toUpperCase()}`:T?.port||`Ethernet`,P=Number(window._clientLiveRateMap?.get(E)||0),F=[C(`<path d="M20 6 9 17l-5-5"/>`,`Status`,M?`Blocked`:A?`Online`:`Offline`),C(`<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>`,`IP address`,E),C(`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h6"/>`,`Device / MAC`,D),C(j?`<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/>`:`<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>`,`Connection`,N),C(`<path d="M4 18V6m0 12h16M8 14l3-3 3 2 5-6"/>`,`Live traffic`,`${P.toFixed(1)} Mbps`)];l&&(l.innerHTML=`<div class="topo-quick-info-grid">${F.join(``)}</div>`),f&&(M?(f.style.display=`inline-block`,f.onclick=async()=>{await Or(E,D),Qe(),typeof Q==`function`&&Q(`Unblocked device ${E}`,`success`),typeof B==`function`&&B()}):f.style.display=`none`),u&&(u.style.display=`none`),d&&(d.style.display=`none`),typeof Zt==`function`&&Zt(e),i.style.display=`flex`,requestAnimationFrame(()=>{i.classList.add(`active`)})}function Qe(){let e=document.getElementById(`topoNodeDetailOverlay`);e&&(e.classList.remove(`active`),clearTimeout(window._topoNodeDetailCloseTimer),window._topoNodeDetailCloseTimer=setTimeout(()=>{e.classList.contains(`active`)||(e.style.display=`none`)},190)),Ye=null,typeof Zt==`function`&&Zt(null)}function $e(){let e=window.visualViewport;e&&(document.documentElement.style.setProperty(`--maxnet-modal-vh`,`${Math.round(e.height)}px`),document.documentElement.style.setProperty(`--maxnet-modal-top`,`${Math.round(e.offsetTop)}px`))}$e(),window.visualViewport&&(window.visualViewport.addEventListener(`resize`,$e),window.visualViewport.addEventListener(`scroll`,$e)),document.addEventListener(`focusin`,e=>{let t=e.target;t instanceof HTMLElement&&t.closest(`.android-modal-overlay`)&&setTimeout(()=>t.scrollIntoView({block:`nearest`,inline:`nearest`,behavior:`smooth`}),100)});function et(e,t){t&&t.stopPropagation&&t.stopPropagation();let n=document.getElementById(`topoEvidenceModalOverlay`);if(!n)return;n.parentElement!==document.body&&document.body.appendChild(n);let r=document.getElementById(`topoEvidenceModalTitle`),i=document.getElementById(`topoEvidenceModalSub`),a=document.getElementById(`topoEvidenceConfidenceBadge`),o=document.getElementById(`topoEvidenceModalBody`),s=e&&e.confidence||(e&&e.evidence&&e.evidence.length>=2?`High`:`Medium`);r&&(r.textContent=(e&&(e.name||e.ip)||`Network Node`)+` Evidence`),i&&(i.textContent=`Role: ${(e&&e.type?e.type:`device`).toUpperCase()} \u2022 IP: ${e&&e.ip||`--`} \u2022 MAC: ${e&&e.mac||`--`}`),a&&(a.textContent=`${s.toUpperCase()} CONFIDENCE`,a.className=`card-badge `+(s===`High`?`emerald`:s===`Medium`?`sky`:`amber`));let c=e&&Array.isArray(e.evidence)&&e.evidence.length>0?e.evidence:[e&&e.type===`router`?`Host Gateway configured as primary network router`:e&&e.type===`ap`?`Identified as infrastructure node via multi-MAC bridge port`:`Direct client connected to local network interface`],l=e&&e.metrics||{},u=``;(l.ping_avg_ms!==void 0||l.vendor||l.port_mac_count!==void 0)&&(u=`
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px; margin-bottom:14px;">
            <div style="background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
              <div style="color:var(--text-dim); font-size:9.5px;">PING MEDIAN</div>
              <div style="color:${l.ping_avg_ms<5?`#10b981`:`#38bdf8`}; font-weight:800; font-family:var(--font-mono); font-size:12px;">${l.ping_avg_ms?l.ping_avg_ms+` ms`:`--`}</div>
            </div>
            <div style="background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
              <div style="color:var(--text-dim); font-size:9.5px;">PORT MAC COUNT</div>
              <div style="color:var(--text-main); font-weight:800; font-family:var(--font-mono); font-size:12px;">${l.port_mac_count===void 0?`--`:l.port_mac_count}</div>
            </div>
            <div style="background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
              <div style="color:var(--text-dim); font-size:9.5px;">OUI VENDOR</div>
              <div style="color:var(--text-main); font-weight:700; font-size:11px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${$(l.vendor||`--`)}</div>
            </div>
          </div>
        `),o&&(o.innerHTML=`
          <div style="font-family:var(--font-mono); font-size:11.5px;">
            ${u}
            <div style="color:var(--text-dim); font-size:10px; font-weight:800; text-transform:uppercase; margin-bottom:6px; letter-spacing:0.5px;">Verified Signals & Classification Evidence:</div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${c.map((e,t)=>`
                <div style="display:flex; align-items:flex-start; gap:8px; background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.04);">
                  <span style="color:#10b981; font-weight:800; font-size:11px;">[0${t+1}]</span>
                  <span style="color:var(--text-main); line-height:1.4;">${$(e)}</span>
                </div>
              `).join(``)}
            </div>
          </div>
        `),n.style.display=`flex`,requestAnimationFrame(()=>n.classList.add(`active`))}function tt(){let e=document.getElementById(`topoEvidenceModalOverlay`);e&&(e.classList.remove(`active`),e.style.display=`none`)}function nt(){ke()}function rt(){let e=Ye,t=Xe;Qe(),typeof z==`function`&&z(`settings`),setTimeout(()=>{let n=document.getElementById(`acc-topo-layers`);if(n&&!n.classList.contains(`active`)&&L(`acc-topo-layers`),e){let n=t?`topoPortRow_`+e.id:`topoNodeCard_`+e.id,r=document.getElementById(n);r&&(r.scrollIntoView({behavior:`smooth`,block:`center`}),r.style.borderColor=`#38bdf8`,setTimeout(()=>{r.style.borderColor=``},2500))}},150)}function it(){let e=Ye;Qe(),e&&e.ip&&(typeof z==`function`&&z(`settings`),typeof O==`function`&&O(`acc-lan-clients`),setTimeout(()=>{typeof Sn==`function`&&Sn(e.ip,!0)},120))}var at=`http://www.w3.org/2000/svg`,ot={},st=[],H=(e,t,n)=>{let r=document.createElementNS(at,e);for(let e in t)r.setAttribute(e,t[e]);return n.appendChild(r),r};function ct(e,t,n,r){let i=H(`g`,{transform:`translate(${e}, ${t})`,style:`color:${n}; pointer-events:none;`},r);return H(`circle`,{cx:2.8,cy:2,r:1.4,fill:`none`,stroke:`currentColor`,"stroke-width":.95},i),H(`path`,{d:`M 0.5 7.2 C 0.5 4.8, 5.1 4.8, 5.1 7.2`,fill:`none`,stroke:`currentColor`,"stroke-width":.95,"stroke-linecap":`round`},i),i}function lt(e,t,n,r){let i=H(`g`,{transform:`translate(${e}, ${t-11})`,style:`color:${n}; pointer-events:none;`},r);return H(`rect`,{x:0,y:0,width:13,height:22,rx:3,ry:3,fill:`none`,stroke:`currentColor`,"stroke-width":1.25},i),H(`line`,{x1:4.5,y1:3,x2:8.5,y2:3,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i),H(`circle`,{cx:6.5,cy:18.5,r:1,fill:`currentColor`},i),i}function ut(e,t,n,r){let i=H(`g`,{transform:`translate(${e}, ${t-11})`,style:`color:${n}; pointer-events:none;`},r);return H(`rect`,{x:3.5,y:0,width:7,height:2.5,rx:.5,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),H(`rect`,{x:0,y:2,width:14,height:20,rx:2.5,ry:2.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.25},i),H(`line`,{x1:3,y1:7,x2:11,y2:7,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i),H(`line`,{x1:3,y1:10,x2:11,y2:10,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i),H(`rect`,{x:3,y:14.5,width:5,height:3.5,rx:.6,fill:`none`,stroke:`currentColor`,"stroke-width":.8},i),H(`circle`,{cx:10.5,cy:16.5,r:1,fill:`currentColor`},i),i}function dt(e,t,n,r){let i=H(`g`,{transform:`translate(${e}, ${t-11})`,style:`color:${n}; pointer-events:none;`},r);return H(`rect`,{x:3.5,y:0,width:7,height:5,rx:.5,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),H(`line`,{x1:5.2,y1:2,x2:5.2,y2:3.5,stroke:`currentColor`,"stroke-width":.8,"stroke-linecap":`round`},i),H(`line`,{x1:8.8,y1:2,x2:8.8,y2:3.5,stroke:`currentColor`,"stroke-width":.8,"stroke-linecap":`round`},i),H(`rect`,{x:1.5,y:5,width:11,height:16,rx:2,ry:2,fill:`none`,stroke:`currentColor`,"stroke-width":1.25},i),H(`line`,{x1:3.5,y1:11,x2:10.5,y2:11,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i),H(`circle`,{cx:7,cy:17.5,r:1.2,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),i}function ft(e){if(!e)return`Unknown Device`;let t=(e.ip||``).trim(),n=(e.mac||``).toLowerCase().trim();if(typeof getCustomDeviceName==`function`){let e=getCustomDeviceName(n||t);if(e&&e.trim())return e.trim()}if(t===`10.0.0.166`||n===`a8:1b:5a:c3:01:13`||n.startsWith(`a8:1b:5a`))return`OPPO A37`;let r=(e.hostname||e.dhcp_hostname||e.dhcp_name||``).trim();if(r&&r!==`*`&&!pt(r,t)){let e=mt(r);if(e&&e.toLowerCase()!==`device`&&e.toLowerCase()!==`unknown`)return e}let i=(e.name||``).trim();if(i&&!pt(i,t)&&!i.toLowerCase().startsWith(`device`)&&!i.toLowerCase().startsWith(`unknown`)){let e=mt(i);if(e&&e.toLowerCase()!==`device`&&e.toLowerCase()!==`unknown`)return e}let a=(e.mdns||e.dns_name||``).trim();if(a&&!pt(a,t)){let e=mt(a.replace(/\.local$/i,``).replace(/\.lan$/i,``));if(e&&e.toLowerCase()!==`device`&&e.toLowerCase()!==`unknown`)return e}let o=(e.vendor||e.metrics&&e.metrics.vendor||``).trim();return o&&!o.toLowerCase().includes(`unknown`)&&!pt(o,t)?mt(o):`Unknown Device`}function pt(e,t){if(!e)return!1;let n=e.toLowerCase();return!!(t===`10.0.0.166`&&(n.includes(`asus`)||n.includes(`router`)||n.includes(`ap`)))}function mt(e){return e?e.replace(/\.lan$/i,``).replace(/\.local$/i,``).replace(/\s*\[(PC|PHONE|STORAGE|ROUTER|CCTV|TV)\]/gi,``).trim():`Unknown Device`}function ht(e){if(!e)return{type:`client`,title:`LAN Device`,icon:`client`,color:`#10b981`,badge:`DEVICE`};let t=(e.name||``).toLowerCase(),n=(e.mac||``).toLowerCase(),r=e.ip||``;return t.includes(`synology`)||t.includes(`nas`)||t.includes(`storage`)||t.includes(`qnap`)||t.includes(`truenas`)||n.startsWith(`00:11:32`)||r===`10.0.0.5`?{type:`nas`,title:`Synology NAS`,icon:`nas`,color:`#c084fc`,badge:`STORAGE`}:t.includes(`cam`)||t.includes(`cctv`)||t.includes(`dvr`)||t.includes(`nvr`)||t.includes(`ipc`)||t.includes(`ipcam`)||t.includes(`hikvision`)||t.includes(`dahua`)||t.includes(`cp plus`)||t.includes(`cpplus`)||t.includes(`reolink`)||t.includes(`axis`)||t.includes(`ezviz`)||t.includes(`imou`)||t.includes(`uniview`)||t.includes(`lorex`)||t.includes(`swann`)||t.includes(`v380`)||t.includes(`yoosee`)?{type:`cctv`,title:`CCTV / IP Cam`,icon:`cctv`,color:`#f59e0b`,badge:`CCTV`}:t.includes(`phone`)||t.includes(`poco`)||t.includes(`v2153`)||t.includes(`iphone`)||t.includes(`ipad`)||t.includes(`samsung`)||t.includes(`galaxy`)||t.includes(`redmi`)||t.includes(`xiaomi`)||t.includes(`vivo`)||t.includes(`oppo`)||t.includes(`realme`)||t.includes(`oneplus`)||t.includes(`pixel`)||t.includes(`android`)||t.includes(`huawei`)||t.includes(`honor`)||t.includes(`moto`)||t.includes(`iqoo`)||t.includes(`infinix`)||t.includes(`tecno`)||t.includes(`mobile`)||n.startsWith(`f2:82:95`)||n.startsWith(`f6:93:15`)||n.startsWith(`a8:1b:5a`)||r===`10.0.0.166`||r===`10.0.0.238`||r===`10.0.0.118`?{type:`phone`,title:t.includes(`poco`)?`POCO X6 5G`:t.includes(`oppo`)||r===`10.0.0.166`||n.startsWith(`a8:1b:5a`)?`OPPO A37`:t.includes(`vivo`)||t.includes(`v2153`)?`Vivo V2153`:`Mobile Phone`,icon:`phone`,color:`#38bdf8`,badge:`PHONE`}:t.includes(`maxos`)||t.includes(`laptop`)||t.includes(`desktop`)||t.includes(`pc`)||t.includes(`macbook`)||t.includes(`imac`)||t.includes(`thinkpad`)||t.includes(`dell`)||t.includes(`hp`)||t.includes(`lenovo`)||t.includes(`msi`)||t.includes(`acer`)||t.includes(`surface`)||t.includes(`workstation`)||t.includes(`windows`)||t.includes(`ubuntu`)||t.includes(`fedora`)||t.includes(`arch`)||t.includes(`linux`)||/^desktop-/i.test(t)||/^laptop-/i.test(t)||n.startsWith(`10:65:30`)||n.startsWith(`f8:59:71`)||r===`10.0.0.111`?{type:`laptop`,title:t.includes(`maxos`)||r===`10.0.0.111`?`Workstation (maxos)`:`Laptop / PC`,icon:`laptop`,color:`#10b981`,badge:`PC`}:t.includes(`tv`)||t.includes(`androidtv`)||t.includes(`firetv`)||t.includes(`appletv`)||t.includes(`chromecast`)||t.includes(`roku`)||t.includes(`bravia`)||t.includes(`lgwebostv`)||t.includes(`samsungtv`)||t.includes(`mibox`)||t.includes(`shield`)?{type:`tv`,title:`Smart TV`,icon:`tv`,color:`#a855f7`,badge:`TV`}:t.includes(`esp_`)||t.includes(`espressif`)||t.includes(`esp32`)||t.includes(`esp8266`)||t.includes(`sonoff`)||t.includes(`tuya`)||t.includes(`tasmota`)||t.includes(`shelly`)||t.includes(`wled`)||t.includes(`iot`)||t.includes(`smartplug`)||t.includes(`bulb`)||t.includes(`sensor`)||t.includes(`zigbee`)||t.includes(`switchbot`)||n.startsWith(`24:0a:c4`)||n.startsWith(`30:ae:a4`)||n.startsWith(`84:f3:eb`)||n.startsWith(`bc:dd:c2`)?{type:`iot`,title:`IoT Device`,icon:`iot`,color:`#14b8a6`,badge:`IOT`}:t.includes(`echo`)||t.includes(`alexa`)||t.includes(`nest`)||t.includes(`homepod`)||t.includes(`google-home`)||t.includes(`speaker`)||t.includes(`sonos`)?{type:`speaker`,title:`Smart Speaker`,icon:`speaker`,color:`#ec4899`,badge:`AUDIO`}:t.includes(`printer`)||t.includes(`epson`)||t.includes(`canon`)||t.includes(`brother`)||t.includes(`xerox`)||t.includes(`laserjet`)||t.includes(`deskjet`)?{type:`printer`,title:`Network Printer`,icon:`printer`,color:`#6366f1`,badge:`PRINT`}:t.includes(`playstation`)||t.includes(`ps4`)||t.includes(`ps5`)||t.includes(`xbox`)||t.includes(`nintendo`)||t.includes(`switch`)&&!t.includes(`hub`)||t.includes(`steamdeck`)?{type:`console`,title:`Gaming Console`,icon:`console`,color:`#f43f5e`,badge:`GAME`}:t.includes(`router`)||t.includes(`accesspoint`)||t.includes(`repeater`)||t.includes(`extender`)||t.includes(`switch`)||t.includes(`maxnet`)||t.includes(`openwrt`)||t.includes(`maxnet-b`)||t.includes(`tplink`)||t.includes(`tenda`)||t.includes(`netgear`)||t.includes(`mercusys`)||t.includes(`dlink`)||t.includes(`miwifi`)||n.startsWith(`8c:a3:99`)||r===`10.0.0.2`||t.includes(`.lan`)&&!t.includes(`maxos`)&&!t.includes(`oppo`)&&r!==`10.0.0.166`?{type:`router`,title:t.includes(`maxnet-b`)||r===`10.0.0.2`?`maxnet-b Router`:`Access Point`,icon:`router`,color:`#0284c7`,badge:`ROUTER`}:{type:`client`,title:`LAN Device`,icon:`client`,color:`#10b981`,badge:`DEVICE`}}function gt(e,t,n,r){let i=H(`g`,{class:`topo-client-icon`,style:`color:${n.color}; pointer-events:none;`},r);return n.type===`phone`?(H(`rect`,{x:e-4,y:t-6.5,width:8,height:13,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`line`,{x1:e-1.5,y1:t-4.5,x2:e+1.5,y2:t-4.5,stroke:`currentColor`,"stroke-width":.8,"stroke-linecap":`round`},i),H(`circle`,{cx:e,cy:t+4.2,r:.7,fill:`currentColor`},i)):n.type===`laptop`?(H(`rect`,{x:e-5.5,y:t-5.5,width:11,height:7.5,rx:1,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`line`,{x1:e-7,y1:t+3.5,x2:e+7,y2:t+3.5,stroke:`currentColor`,"stroke-width":1.3,"stroke-linecap":`round`},i)):n.type===`nas`||n.type===`storage`?(H(`rect`,{x:e-6,y:t-5.5,width:12,height:11,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`line`,{x1:e-4,y1:t-2,x2:e+4,y2:t-2,stroke:`currentColor`,"stroke-width":1},i),H(`line`,{x1:e-4,y1:t+1.5,x2:e+4,y2:t+1.5,stroke:`currentColor`,"stroke-width":1},i),H(`circle`,{cx:e+3,cy:t-2,r:.6,fill:`currentColor`},i),H(`circle`,{cx:e+3,cy:t+1.5,r:.6,fill:`currentColor`},i)):n.type===`cctv`?(H(`path`,{d:`M${e+2} ${t-3} L${e+6} ${t-5.5} L${e+6} ${t+5.5} L${e+2} ${t+3} Z`,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),H(`rect`,{x:e-6,y:t-4,width:8,height:8,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`circle`,{cx:e-2,cy:t,r:1.5,fill:`currentColor`},i)):n.type===`tv`?(H(`rect`,{x:e-6,y:t-5,width:12,height:8.5,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`line`,{x1:e-3,y1:t+4.5,x2:e+3,y2:t+4.5,stroke:`currentColor`,"stroke-width":1.2,"stroke-linecap":`round`},i),H(`line`,{x1:e,y1:t+3.5,x2:e,y2:t+4.5,stroke:`currentColor`,"stroke-width":1},i)):n.type===`router`?(H(`rect`,{x:e-6,y:t-1,width:12,height:6,rx:1.2,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`line`,{x1:e-3.5,y1:t-1,x2:e-3.5,y2:t-5.5,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i),H(`line`,{x1:e+3.5,y1:t-1,x2:e+3.5,y2:t-5.5,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i)):n.type===`iot`?(H(`rect`,{x:e-5,y:t-5,width:10,height:10,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`rect`,{x:e-2,y:t-2,width:4,height:4,fill:`currentColor`},i),[-3,0,3].forEach(n=>{H(`line`,{x1:e+n,y1:t-7,x2:e+n,y2:t-5,stroke:`currentColor`,"stroke-width":.9},i),H(`line`,{x1:e+n,y1:t+5,x2:e+n,y2:t+7,stroke:`currentColor`,"stroke-width":.9},i),H(`line`,{x1:e-7,y1:t+n,x2:e-5,y2:t+n,stroke:`currentColor`,"stroke-width":.9},i),H(`line`,{x1:e+5,y1:t+n,x2:e+7,y2:t+n,stroke:`currentColor`,"stroke-width":.9},i)})):n.type===`speaker`?(H(`rect`,{x:e-4.5,y:t-6,width:9,height:12,rx:2,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`circle`,{cx:e,cy:t-2,r:1.2,fill:`currentColor`},i),H(`circle`,{cx:e,cy:t+2.5,r:2.2,fill:`none`,stroke:`currentColor`,"stroke-width":.9},i)):n.type===`printer`?(H(`rect`,{x:e-6,y:t-2,width:12,height:7,rx:1,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`path`,{d:`M${e-4} ${t-2} L${e-4} ${t-6} L${e+4} ${t-6} L${e+4} ${t-2}`,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),H(`line`,{x1:e-3,y1:t+2,x2:e+3,y2:t+2,stroke:`currentColor`,"stroke-width":1},i)):n.type===`console`?(H(`rect`,{x:e-6.5,y:t-4,width:13,height:8,rx:3,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`line`,{x1:e-4,y1:t,x2:e-2,y2:t,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),H(`line`,{x1:e-3,y1:t-1,x2:e-3,y2:t+1,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),H(`circle`,{cx:e+2.5,cy:t-1,r:.6,fill:`currentColor`},i),H(`circle`,{cx:e+4,cy:t+.8,r:.6,fill:`currentColor`},i)):H(`circle`,{cx:e,cy:t,r:2.4,fill:n.color},i),i}function _t(e,t,n,r){let i=H(`g`,{style:`color:${n}; pointer-events:none;`},r);return H(`rect`,{x:e-8,y:t-2,width:16,height:8,rx:1.8,fill:`none`,stroke:`currentColor`,"stroke-width":1.2},i),H(`line`,{x1:e-4,y1:t-2,x2:e-4,y2:t-7,stroke:`currentColor`,"stroke-width":1.2,"stroke-linecap":`round`},i),H(`line`,{x1:e+4,y1:t-2,x2:e+4,y2:t-7,stroke:`currentColor`,"stroke-width":1.2,"stroke-linecap":`round`},i),H(`circle`,{cx:e-3,cy:t+2,r:.8,fill:`#10b981`},i),H(`circle`,{cx:e,cy:t+2,r:.8,fill:`#10b981`},i),H(`circle`,{cx:e+3,cy:t+2,r:.8,fill:`currentColor`},i),i}function vt(e,t,n,r){let i=H(`g`,{style:`color:${n}; pointer-events:none;`},r);return H(`rect`,{x:e-7,y:t-2,width:14,height:7,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`line`,{x1:e-4,y1:t-2,x2:e-4,y2:t-7,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),H(`line`,{x1:e+4,y1:t-2,x2:e+4,y2:t-7,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),H(`circle`,{cx:e-3,cy:t+1.5,r:.7,fill:`currentColor`},i),H(`circle`,{cx:e,cy:t+1.5,r:.7,fill:`currentColor`},i),H(`circle`,{cx:e+3,cy:t+1.5,r:.7,fill:`currentColor`},i),i}function yt(e,t,n,r){let i=H(`g`,{style:`color:${n}; pointer-events:none;`},r);return H(`rect`,{x:e-8,y:t-4,width:16,height:8,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.2},i),[-4.5,-1.5,1.5,4.5].forEach(n=>{H(`rect`,{x:e+n-1,y:t-1,width:2,height:2,fill:`currentColor`},i)}),i}function bt(e,t,n,r){let i=H(`g`,{style:`color:${n}; pointer-events:none;`},r);return H(`path`,{d:`M${e-4.5} ${t-3} A6 6 0 0 1 ${e+4.5} ${t-3}`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),H(`path`,{d:`M${e-2.8} ${t-.5} A3.5 3.5 0 0 1 ${e+2.8} ${t-.5}`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),H(`circle`,{cx:e,cy:t+2.2,r:.9,fill:`currentColor`},i),i}function xt(e,t,n,r,i){let a=(r||`phone`).toLowerCase();return a===`ssd`?ut(e,t,n,i):a===`pendrive`||a===`storage`||a===`flash`||a===`usb_flash`?Dt(e,t,n,i):lt(e,t,n,i)}function St(e,t,n,r){let i=H(`g`,{class:`dev-icon-no-net`,style:`color:${n||`#ef4444`}; cursor:help;`},r);return H(`title`,{},i).textContent=`No Internet Connection`,H(`circle`,{cx:e,cy:t,r:4.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`line`,{x1:e-3.2,y1:t-3.2,x2:e+3.2,y2:t+3.2,stroke:`currentColor`,"stroke-width":1.2,"stroke-linecap":`round`},i),H(`line`,{x1:e-3.5,y1:t,x2:e+3.5,y2:t,stroke:`currentColor`,"stroke-width":.8,opacity:.5},i),i}function Ct(e,t,n,r,i){let a=typeof i==`number`?i:1,o={class:`dev-icon-tether`,style:`color:${n||`#10b981`}; cursor:help;`};a!==1&&(o.transform=`translate(${e}, ${t}) scale(${a}) translate(${-e}, ${-t})`);let s=H(`g`,o,r);return H(`title`,{},s).textContent=`Hotspot / Tethering Active`,H(`circle`,{cx:e,cy:t,r:1.4,fill:`currentColor`},s),H(`path`,{d:`M${e-2.6} ${t-2.6} a3.6 3.6 0 0 0 0 5.2`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},s),H(`path`,{d:`M${e+2.6} ${t-2.6} a3.6 3.6 0 0 1 0 5.2`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},s),H(`path`,{d:`M${e-4.6} ${t-4.6} a6.4 6.4 0 0 0 0 9.2`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},s),H(`path`,{d:`M${e+4.6} ${t-4.6} a6.4 6.4 0 0 1 0 9.2`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},s),s}function wt(e,t,n,r,i){let a=typeof i==`number`?i:1,o={class:`dev-icon-adb`,style:`color:${n||`#38bdf8`}; cursor:help;`};a!==1&&(o.transform=`translate(${e}, ${t}) scale(${a}) translate(${-e}, ${-t})`);let s=H(`g`,o,r);return H(`title`,{},s).textContent=`ADB Debugging Enabled`,H(`line`,{x1:e-2,y1:t-2,x2:e-3.2,y2:t-3.8,stroke:`currentColor`,"stroke-width":.9,"stroke-linecap":`round`},s),H(`line`,{x1:e+2,y1:t-2,x2:e+3.2,y2:t-3.8,stroke:`currentColor`,"stroke-width":.9,"stroke-linecap":`round`},s),H(`path`,{d:`M${e-3.8} ${t+1} a3.8 3.8 0 0 1 7.6 0 Z`,fill:`currentColor`},s),H(`circle`,{cx:e-1.5,cy:t-.5,r:.6,fill:`var(--bg, #06090c)`},s),H(`circle`,{cx:e+1.5,cy:t-.5,r:.6,fill:`var(--bg, #06090c)`},s),H(`line`,{x1:e-3.8,y1:t+2.5,x2:e+3.8,y2:t+2.5,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},s),s}function Tt(e,t,n,r){let i=H(`g`,{class:`dev-icon-mtp`,style:`color:${n||`#f59e0b`}; cursor:help;`},r);return H(`title`,{},i).textContent=`MTP File Transfer`,H(`path`,{d:`M${e-3.5} ${t-1.5} h6 m-1.8 -1.8 l1.8 1.8 -1.8 1.8`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`,"stroke-linejoin":`round`},i),H(`path`,{d:`M${e+3.5} ${t+2} h-6 m1.8 -1.8 l-1.8 1.8 1.8 1.8`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`,"stroke-linejoin":`round`},i),i}function Et(e,t,n,r){let i=H(`g`,{class:`wan-icon-mobile`,style:`color:${n||`#38bdf8`}; pointer-events:none;`},r);return H(`rect`,{x:e-4.5,y:t-7.5,width:9,height:15,rx:2,fill:`none`,stroke:`currentColor`,"stroke-width":1.2},i),H(`line`,{x1:e-2,y1:t-5,x2:e+2,y2:t-5,stroke:`currentColor`,"stroke-width":.9,"stroke-linecap":`round`},i),H(`circle`,{cx:e,cy:t+5,r:.8,fill:`currentColor`},i),i}function Dt(e,t,n,r){let i=H(`g`,{class:`wan-icon-pendrive`,style:`color:${n||`#c084fc`}; pointer-events:none;`},r);return H(`rect`,{x:e-2.5,y:t-7.5,width:5,height:3.5,rx:.5,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),H(`line`,{x1:e-1,y1:t-6.5,x2:e-1,y2:t-5,stroke:`currentColor`,"stroke-width":.8},i),H(`line`,{x1:e+1,y1:t-6.5,x2:e+1,y2:t-5,stroke:`currentColor`,"stroke-width":.8},i),H(`rect`,{x:e-4,y:t-4,width:8,height:11,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.2},i),H(`line`,{x1:e-2,y1:t+4,x2:e+2,y2:t+4,stroke:`currentColor`,"stroke-width":.9,"stroke-linecap":`round`},i),i}function Ot(e,t,n,r){let i=H(`g`,{class:`topo-icon-hub`,style:`color:${n||`#0284c7`}; pointer-events:none;`},r);return H(`rect`,{x:e-8,y:t-5,width:16,height:10,rx:2,fill:`none`,stroke:`currentColor`,"stroke-width":1.2},i),H(`rect`,{x:e-6,y:t-3,width:2,height:3,rx:.5,fill:`currentColor`},i),H(`rect`,{x:e-2,y:t-3,width:2,height:3,rx:.5,fill:`currentColor`},i),H(`rect`,{x:e+2,y:t-3,width:2,height:3,rx:.5,fill:`currentColor`},i),H(`rect`,{x:e+6,y:t-3,width:2,height:3,rx:.5,fill:`currentColor`},i),H(`circle`,{cx:e,cy:t+2.5,r:.9,fill:`#10b981`},i),i}function kt(e,t,n,r){let i=H(`g`,{class:`dev-icon-storage`,style:`color:${n||`#c084fc`}; cursor:help;`},r);return H(`title`,{},i).textContent=`USB Storage (SMB)`,H(`rect`,{x:e-2,y:t-4.5,width:4,height:2.5,fill:`none`,stroke:`currentColor`,"stroke-width":.9},i),H(`rect`,{x:e-3.2,y:t-2,width:6.4,height:6.5,rx:1,ry:1,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),H(`circle`,{cx:e,cy:t+2,r:.8,fill:`currentColor`},i),i}function At(e,t,n,r){if(!r||r.length===0)return;let i=r.length,a=[0];i===2?a=[-8,8]:i===3?a=[-13,0,13]:i>=4&&(a=[-16,-5,5,16]);for(let o=0;o<i&&o<a.length;o++){let i=r[o],s=n+a[o];i.type===`no_internet`?St(t,s,i.color,e):i.type===`tether`?Ct(t,s,i.color,e):i.type===`adb`?wt(t,s,i.color,e):i.type===`mtp`?Tt(t,s,i.color,e):i.type===`storage`&&kt(t,s,i.color,e)}}function jt(e){if(!e||e.length===0)return{hasAp:!1,apDev:null,downstream:[]};if(e.length===1)return{hasAp:!1,apDev:null,downstream:e};let t=e.find(e=>{let t=(e.name||``).toLowerCase();return t.includes(`.lan`)||t.includes(`router`)||t.includes(`ap`)||t.includes(`maxnet`)||t.includes(`openwrt`)||t.includes(`maxnet`)||t.includes(`gateway`)||t.includes(`repeater`)||t.includes(`extender`)||t.includes(`switch`)||t.includes(`tplink`)||t.includes(`asus`)||t.includes(`tenda`)||t.includes(`netgear`)||t.includes(`xiaomi`)||t.includes(`miwifi`)});return t?{hasAp:!0,apDev:t,downstream:e.filter(e=>e.ip!==t.ip)}:{hasAp:!0,apDev:{name:`WiFi AP`,ip:``,isGeneric:!0,port:e[0].port},downstream:e}}function Mt(e,t){let n=String(e||``).toLowerCase(),r=`usb3`;if(n===`wan`||n===`w`?r=`wan`:n.includes(`3`)||n.includes(`u3`)?r=`usb3`:n.includes(`2`)||n.includes(`u2`)?r=`usb2`:(n.includes(`1`)||n.includes(`u1`))&&(r=`usb1`),r===`wan`){let e=t?`#0284c7`:`#38bdf8`;return{std:`wan`,labelColor:e,labelStroke:`none`,labelStrokeWidth:0,dotStroke:e,dotFill:e,dotOuterFill:t?`#ffffff`:`var(--bg, #06090c)`,lineStroke:e,flowStroke:e,glowColor:t?`rgba(2, 132, 199, 0.45)`:`rgba(56, 189, 248, 0.85)`,particleFill:e,cardBorder:e,hasBorder:!1}}if(r===`usb3`){let e=t?`#0284c7`:`#00d2ff`;return{std:`usb3`,labelColor:e,labelStroke:`none`,labelStrokeWidth:0,dotStroke:e,dotFill:e,dotOuterFill:t?`#ffffff`:`var(--bg, #06090c)`,lineStroke:e,flowStroke:e,glowColor:t?`rgba(2, 132, 199, 0.45)`:`rgba(0, 210, 255, 0.85)`,particleFill:e,cardBorder:e,hasBorder:!1}}if(r===`usb2`){let e=t?`#7c3aed`:`#c084fc`;return{std:`usb2`,labelColor:e,labelStroke:`none`,labelStrokeWidth:0,dotStroke:e,dotFill:e,dotOuterFill:t?`#ffffff`:`var(--bg, #06090c)`,lineStroke:e,flowStroke:e,glowColor:t?`rgba(124, 58, 237, 0.45)`:`rgba(192, 132, 252, 0.85)`,particleFill:e,cardBorder:e,hasBorder:!1}}{let e=t?`#64748b`:`#e2e8f0`;return{std:`usb1`,labelColor:e,labelStroke:`none`,labelStrokeWidth:0,dotStroke:e,dotFill:e,dotOuterFill:t?`#ffffff`:`#090b10`,lineStroke:e,flowStroke:e,glowColor:t?`rgba(100, 116, 139, 0.45)`:`rgba(226, 232, 240, 0.85)`,particleFill:e,cardBorder:e,hasBorder:!1}}}function Nt(e){if(!e)return`(Max 480 Mbps)`;let t=e.deviceData||{},n=e.usbStd===`usb3`||e.standard&&e.standard.includes(`3.`)||t.standard===`USB 3.0`||t.speed_mbps>=5e3,r=e.usbStd===`usb1`||t.speed_mbps&&t.speed_mbps<=12;return n?`(Max 5 Gbps)`:e.type===`wan`?`(Max 1 Gbps)`:r?`(Max 12 Mbps)`:`(Max 480 Mbps)`}function Pt(e){if(window._topoTree&&Array.isArray(window._topoTree.ports)){let t=window._topoTree.ports[e-1];if(t){if(t.role===`empty`||!t.child)return{portIndex:e,mode:`empty`,device:null};if(t.role===`device`)return{portIndex:e,mode:`direct`,device:t.child};if(t.role===`node`){let n=t.child,r=[];return(n.ports||[]).forEach(e=>{e.role===`device`&&e.child?r.push({name:e.child.name,ip:e.child.ip,mac:e.child.mac,conn_type:`LAN Port`}):e.role===`node`&&e.child&&r.push({name:e.child.name,ip:e.child.ip,mac:e.child.mac,conn_type:`Router / Sub-AP`,is_router:!0})}),(n.wireless_clients||[]).forEach(e=>{r.push({name:e.name,ip:e.ip,mac:e.mac,conn_type:e.band===`5G`?`5GHz WiFi`:`2.4GHz WiFi`})}),{portIndex:e,mode:`layer2_ap`,ap:{name:n.name,ip:n.ip,mac:n.mac,model:n.type===`switch`?`Ethernet Switch`:`Access Point`},layer3_devices:r}}}}let t=`lan`+e;return window._topologyLayers&&window._topologyLayers.ports&&window._topologyLayers.ports[t]?window._topologyLayers.ports[t]:window._lastDataCache&&window._lastDataCache.topology_layers&&window._lastDataCache.topology_layers.ports&&window._lastDataCache.topology_layers.ports[t]?window._lastDataCache.topology_layers.ports[t]:{portIndex:e,mode:`empty`,device:null}}function Ft(e,t){if(!e)return[];let n=e.ports||[],r=e.type===`router`||e.type===`ap`||e.type===`switch`,i=[];if(e.id===`root`){let t=`W1`;e.wan_mode===`wan_as_lan`&&(t=`W1 [L5]`),i.push({type:`wan`,port:{id:`root-wan`,label:t,role:`uplink`},idx:-1,label:t,role:`uplink`,child:null})}if(n.forEach((t,n)=>{let r=`L`+(n+1);e.id===`root`&&(e.wan_mode===`lan_as_wan_1`&&n===0||e.wan_mode===`lan_as_wan_4`&&n===3)&&(r=`W2`),i.push({type:`lan`,port:t,idx:n,label:r,role:t.role,child:t.child})}),r){let t=e.wireless_clients||[],n=t.length;i.push({type:`wifi`,label:`Wi-Fi`,band:`Wi-Fi`,color:`#38bdf8`,clients:t,count:n})}if(e.id===`root`){let e=window._lastDataCache||{},t=!!(e.usb_hub&&e.usb_hub.connected),n=!!(e.usb_storage?.mounted||Array.isArray(e.usb_devices)&&e.usb_devices.some(e=>e.device_type===`storage`||e.has_storage)),r=!!(e.router?.usb?.connected||Array.isArray(e.usb_devices)&&e.usb_devices.length>0),a=t||n||r,o=t?`HUB`:`U1`;i.push({type:`usb`,port:{id:`root-usb`,label:o,role:`usb`},idx:99,label:o,role:`usb`,connected:a,count:t?e.usb_hub.connected_count||(e.usb_devices?e.usb_devices.length:1):n?1:+!!r})}return i}function It(e,t,n=!0){if(!e)return 400;let r=n?110:40;function i(e){if(!e)return 0;if(e.type===`device`)return 66;if(window._topoCollapsed&&window._topoCollapsed.has(e.id))return 114;let t=0;return Array.isArray(e.ports)&&e.ports.forEach(e=>{e.role!==`empty`&&e.child&&(t+=i(e.child))}),Array.isArray(e.wireless_clients)&&e.wireless_clients.length>0&&(t+=e.wireless_clients.length*46),78+(t>0?42+t:36)}return r+i(e)+50}function Lt(e,t){return{width:t?260:288,height:It(e,t,!1)}}function Rt(e){if(!e||e.type===`device`)return 1;let t=1;return Array.isArray(e.ports)&&e.ports.forEach(e=>{e.child&&(t=Math.max(t,1+Rt(e.child)))}),t}function zt(e){if(!e)return 0;if(e.type===`device`)return 1;let t=e.wireless_clients&&e.wireless_clients.length||0;return Array.isArray(e.ports)&&e.ports.forEach(e=>{e.role===`device`&&e.child?t+=1:e.role===`node`&&e.child&&(t+=1+zt(e.child))}),t}var Bt={theme:`cyan`,animMode:`flowing`,animSpeed:`normal`,lineStyle:`bezier`,showWan:!0,showSpeeds:!0,infoDensity:`full`,refreshRate:`off`};function Vt(){try{let e=localStorage.getItem(`maxnet_topo_prefs`);if(e)return Object.assign({},Bt,JSON.parse(e))}catch{}return Object.assign({},Bt)}function Ht(e,t){let n=Vt();n[e]=t;try{localStorage.setItem(`maxnet_topo_prefs`,JSON.stringify(n))}catch{}window._topoPrefs=n,e===`refreshRate`&&Wt(),typeof U==`function`&&U(),e===`theme`&&G(window._topoTree)}function Ut(e,t=`cyan`){let n={cyan:{accent:e?`#0284c7`:`#38bdf8`,l1:e?`#0284c7`:`#38bdf8`,l2:e?`#d97706`:`#f59e0b`,l3:e?`#059669`:`#10b981`,l4:e?`#7c3aed`:`#a855f7`,wifi:e?`#0284c7`:`#38bdf8`},emerald:{accent:e?`#059669`:`#10b981`,l1:e?`#059669`:`#10b981`,l2:e?`#0284c7`:`#38bdf8`,l3:e?`#d97706`:`#f59e0b`,l4:e?`#7c3aed`:`#a855f7`,wifi:e?`#059669`:`#10b981`},purple:{accent:e?`#7c3aed`:`#a855f7`,l1:e?`#7c3aed`:`#a855f7`,l2:e?`#0284c7`:`#38bdf8`,l3:e?`#d97706`:`#f59e0b`,l4:e?`#059669`:`#10b981`,wifi:e?`#7c3aed`:`#a855f7`},blue:{accent:e?`#2563eb`:`#3b82f6`,l1:e?`#2563eb`:`#3b82f6`,l2:e?`#d97706`:`#f59e0b`,l3:e?`#059669`:`#10b981`,l4:e?`#7c3aed`:`#a855f7`,wifi:e?`#2563eb`:`#3b82f6`},amber:{accent:e?`#d97706`:`#f59e0b`,l1:e?`#d97706`:`#f59e0b`,l2:e?`#0284c7`:`#38bdf8`,l3:e?`#059669`:`#10b981`,l4:e?`#7c3aed`:`#a855f7`,wifi:e?`#d97706`:`#f59e0b`},monochrome:{accent:e?`#334155`:`#e4e4e7`,l1:e?`#0284c7`:`#38bdf8`,l2:e?`#d97706`:`#f59e0b`,l3:e?`#059669`:`#10b981`,l4:e?`#7c3aed`:`#a855f7`,wifi:e?`#0284c7`:`#38bdf8`}};return n[t]||n.cyan}function Wt(){window._topoRefreshTimer&&(clearInterval(window._topoRefreshTimer),window._topoRefreshTimer=null);let e=Vt(),t=0;e.refreshRate===`5s`?t=5e3:e.refreshRate===`10s`?t=1e4:e.refreshRate===`30s`&&(t=3e4),t>0&&(window._topoRefreshTimer=setInterval(()=>{if(document.hidden)return;let e=document.getElementById(`tabOverview`),t=e&&e.style.display!==`none`;if(!t)return;let n=document.getElementById(`acc-topo-layers`),r=n&&n.classList.contains(`active`);(t||r)&&typeof _r==`function`&&_r(!0)},t))}function Gt(e,t,n,r,i,a=6){if(Math.abs(e-n)<4)return`M ${e} ${t} L ${n} ${r}`;let o=n>e?1:-1,s=Math.min(a,Math.abs(i-t)/2,Math.abs(n-e)/2),c=Math.min(a,Math.abs(r-i)/2,Math.abs(n-e)/2);return`M ${e} ${t} L ${e} ${i-s} Q ${e} ${i} ${e+o*s} ${i} L ${n-o*c} ${i} Q ${n} ${i} ${n} ${i+c} L ${n} ${r}`}function Kt(e,t){if(!e)return{w:0,h:0,subtreeW:0,subtreeH:0};window._topoCollapsed||(window._topoCollapsed=new Set),window._topoWifiExpanded||(window._topoWifiExpanded={});let n=t<480,r=t>=480&&t<=900,i=e.id===`root`;if(e.type,e.type===`device`){let t=n?160:r?180:200;return e._layout={w:t,h:36,subtreeW:t+20,subtreeH:36,children:[]},e._layout}if(e.type===`storage`){let t=n?160:r?180:200;return e._layout={w:t,h:38,subtreeW:t+20,subtreeH:38,children:[]},e._layout}if(e.type===`hub`){let i=n?210:r?230:250,a=[];Array.isArray(e.children)&&e.children.length>0&&e.children.forEach(e=>{Kt(e.child,t),a.push({type:e.type||`usb_storage`,port_idx:e.port_idx||1,child:e.child,subtreeW:e.child._layout.subtreeW,subtreeH:e.child._layout.subtreeH})});let o=0,s=0,c=n?20:30;return a.forEach((e,t)=>{o+=e.subtreeW+(t>0?c:0),s=Math.max(s,e.subtreeH)}),e._layout={w:i,h:58,subtreeW:Math.max(i,o),subtreeH:58+(a.length>0?56+s:0),children:a,sumChildW:o,gapX:c,layerGapY:56},e._layout}let a=n?220:r?250:280;if(zt(e)>8&&!window._topoManualToggleNodes?.has(e.id)&&!i&&window._topoCollapsed.add(e.id),window._topoCollapsed.has(e.id))return e._layout={w:a,h:72,subtreeW:a+30,subtreeH:72,children:[]},e._layout;let o=[];(e.ports||[]).forEach(n=>{n.role!==`empty`&&n.child&&(n.child._parentRouter=e,Kt(n.child,t),o.push({type:`lan`,port:n,child:n.child,subtreeW:n.child._layout.subtreeW,subtreeH:n.child._layout.subtreeH}))});let s=e.wireless_clients||[];if(s.length>0){window._topoWifiExpanded[e.id]===void 0&&(window._topoWifiExpanded[e.id]=!0);let t=!!window._topoWifiExpanded[e.id],n=t?s.length*38:0;s.forEach(t=>{t._parentRouter=e});let r=t?156:0;t&&o.push({type:`wifi_cluster`,node:e,clients:s,isExpanded:t,w:120,h:n,totalH:n,subtreeW:r,subtreeH:n})}if(i){let n=window._lastDataCache||{},r=!!(n.usb_hub&&n.usb_hub.connected),i=(Array.isArray(n.usb_devices)?n.usb_devices:[]).find(e=>(e.device_type===`storage`||e.has_storage)&&e.status===`online`)||(n.usb_storage?.mounted===!0?{model:n.usb_storage.name||`USB storage`,device_type:`storage`}:null);if(r){let r=n.usb_hub.model||`USB Hub`,a={id:`root-usb-hub`,name:r,model:r,type:`hub`,status:`online`,ports:n.usb_hub.ports||4,available_ports:n.usb_hub.available_ports||0,connected_count:n.usb_hub.connected_count||0,ports_list:n.usb_hub.ports_list||[],speed_mbps:Number(n.usb_hub.speed_mbps)||0,_parentRouter:e,children:[]};if(i||n.usb_storage?.mounted===!0){let e=i?.raw_model||i?.model||n.usb_storage?.name||`USB storage`,t=i?.total_space||n.usb_storage?.total||`--`,r=(n.usb_hub.ports_list||[]).find(e=>e.status===`connected`&&(e.device_type===`storage`||e.name)),o=r?r.port:null;a.children=[{type:`usb_storage`,port_idx:o,child:{id:`hub-usb-storage`,name:e,type:`storage`,device_type:`storage`,status:`online`,speed_mbps:Number(i?.speed_mbps||r?.speed_mbps)||0,usb_version:r?.version||`--`,port_num:o,size:t,free:i?.free_space||n.usb_storage?.free||`--`,mount_point:i?.mount_point||n.usb_storage?.mount_point||``,share_path:i?.share_path||``,_parentRouter:a}}]}Kt(a,t),o.push({type:`usb_hub`,port:{id:`root-usb`},child:a,subtreeW:a._layout.subtreeW,subtreeH:a._layout.subtreeH})}else if(i||n.usb_storage?.mounted===!0){let r=i?.raw_model||i?.model||n.usb_storage?.name||`USB storage`,a=i?.total_space||n.usb_storage?.total||`--`,s={id:`root-usb-storage`,name:r,type:`storage`,device_type:`storage`,status:`online`,speed_mbps:Number(i?.speed_mbps)||0,size:a,free:i?.free_space||n.usb_storage?.free||`--`,mount_point:i?.mount_point||n.usb_storage?.mount_point||``,share_path:i?.share_path||``,_parentRouter:e};Kt(s,t),o.push({type:`usb_storage`,port:{id:`root-usb`},child:s,subtreeW:s._layout.subtreeW,subtreeH:s._layout.subtreeH})}}let c=n?20:r?30:40,l=0,u=0;o.forEach((e,t)=>{l+=e.subtreeW,t>0&&(l+=c),e.subtreeH>u&&(u=e.subtreeH)});let d=Math.max(a+20,l),f=n?50:r?60:70;return e._layout={w:a,h:72,subtreeW:d,subtreeH:72+(o.length>0?f+u:0),children:o,sumChildW:l,gapX:c,layerGapY:f},e._layout}function qt(e,t,n,r,i){if(!e||!e._layout)return;let a=e._layout;if(a.centerX=t,a.topY=n,a.x=t-a.w/2,a.y=n,a.depth=r,!a.children||a.children.length===0)return;let o=a.layerGapY||68,s=n+a.h+o,c=a.gapX||32,l=t-a.sumChildW/2;a.children.forEach(e=>{let t=l+e.subtreeW/2;e.type===`wifi_cluster`?(e.centerX=t,e.topY=s,e.x=t-e.w/2,e.y=s):qt(e.child,t,s,r+1,i),l+=e.subtreeW+c})}function Jt(e){if(!e)return 0;let t=1;return e.ports&&Array.isArray(e.ports)&&e.ports.forEach(e=>{e.child&&(t+=Jt(e.child))}),e.wireless_clients&&Array.isArray(e.wireless_clients)&&(t+=e.wireless_clients.length),t}function Yt(){if(!window._topoTree)return;window._topoCollapsed||(window._topoCollapsed=new Set),window._topoManualToggleNodes||(window._topoManualToggleNodes=new Set);let e=!1;function t(n){n&&(n.id!==`root`&&(n.type===`router`||n.type===`ap`||n.type===`switch`)&&window._topoCollapsed.has(n.id)&&(e=!0),n.ports&&n.ports.forEach(e=>{e.child&&t(e.child)}))}t(window._topoTree);function n(e,t){e&&(e.id!==`root`&&(e.type===`router`||e.type===`ap`||e.type===`switch`)&&(window._topoManualToggleNodes.add(e.id),t?window._topoCollapsed.delete(e.id):window._topoCollapsed.add(e.id)),e.wireless_clients&&e.wireless_clients.length>0&&(window._topoWifiExpanded||(window._topoWifiExpanded={}),window._topoWifiExpanded[e.id]=t),e.ports&&e.ports.forEach(e=>{e.child&&n(e.child,t)}))}n(window._topoTree,e),U(),setTimeout(nt,60)}function Xt(e){Me(e)}function Zt(e){if(Pe||Ne)return;let t=document.getElementById(`usbBwSvg`);if(!t||(t.querySelectorAll(`.topo-selected-box, .topo-path-highlight, .topo-dimmed`).forEach(e=>{e.classList.remove(`topo-selected-box`,`topo-path-highlight`,`topo-dimmed`)}),!e))return;let n=e.id||e.ip||e.name,r=t.querySelector(`[data-node-id="${n}"]`);r&&r.classList.add(`topo-selected-box`)}function Qt(){Zt(null)}function $t(e,t,n){let r=document.getElementById(`topoMinimapContainer`);if(Jt(e)<=30){r&&(r.style.display=`none`);return}if(!r){let e=document.querySelector(`#tabOverview .bw-box`);if(!e)return;r=document.createElement(`div`),r.id=`topoMinimapContainer`,r.className=`topo-minimap`,e.appendChild(r)}r.style.display=`block`,r.innerHTML=`
        <svg class="topo-minimap-svg" viewBox="0 0 ${t.subtreeW} ${t.subtreeH}" preserveAspectRatio="xMidYMid meet">
          <g id="topoMinimapNodes"></g>
        </svg>
      `;let i=r.querySelector(`#topoMinimapNodes`);if(!i)return;function a(e){if(!e||!e._layout)return;let t=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`);t.setAttribute(`x`,e._layout.x),t.setAttribute(`y`,e._layout.y),t.setAttribute(`width`,e._layout.w),t.setAttribute(`height`,e._layout.h),t.setAttribute(`rx`,`3`),t.setAttribute(`fill`,e.type===`device`?`#10b981`:`#0284c7`),t.setAttribute(`opacity`,`0.7`),i.appendChild(t),e.ports&&e.ports.forEach(e=>{e.child&&a(e.child)})}a(e)}function en(){return`${(Math.max(0,Number(window._currentRxMbps)||0)+Math.max(0,Number(window._currentTxMbps)||0)).toFixed(1)} Mbps`}function tn(e){let t=parseFloat(e)||0;return t>=50?`0.45s`:t>=20?`0.75s`:t>=10?`1.1s`:t>=5?`1.5s`:t>=1?`2.0s`:t>=.1?`3.0s`:`5.0s`}function nn(e){let t=parseFloat(e)||0;return t>=10?2.4:t>=1?1.8:1.3}function rn(e){return e&&window._clientLiveRateMap&&window._clientLiveRateMap.has(e)&&window._clientLiveRateMap.get(e)||0}function an(e){if(!e)return{rx:0,tx:0};if(window._clientLiveRxTxMap&&window._clientLiveRxTxMap.has(e)){let t=window._clientLiveRxTxMap.get(e);if(t&&(t.rx>0||t.tx>0))return t}return{rx:0,tx:0}}function on(e){let t=document.documentElement.getAttribute(`data-theme`)===`light`,n=String(e||``).toLowerCase();return n.includes(`10b981`)||n.includes(`059669`)||n.includes(`emerald`)||n.includes(`green`)?t?`#0284c7`:`#38bdf8`:t?`#059669`:`#10b981`}function sn(e,t,n,r,i,a){if(!e||!t)return;let o=document.documentElement.getAttribute(`data-theme`)===`light`,s=n||(o?`#0284c7`:`#38bdf8`),c=r||on(s),l=Math.max(0,parseFloat(i)||0),u=Math.max(0,parseFloat(a)||0);if(l===0&&u===0)return;let d=tn(l),f=tn(u),p=nn(l),m=Math.max(1.3,nn(u)-.2),h=H(`circle`,{class:`pt pt-rx`,r:p,fill:s,style:`fill:${s} !important; filter:drop-shadow(0 0 3px ${s});`},e),g=H(`animateMotion`,{dur:d,repeatCount:`indefinite`},h),_=H(`mpath`,{href:`#`+t},g);try{_.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,`#`+t)}catch{}let v=H(`circle`,{class:`pt pt-tx`,r:m,fill:c,style:`fill:${c} !important; filter:drop-shadow(0 0 3px ${c});`},e),y=H(`animateMotion`,{dur:f,repeatCount:`indefinite`,keyPoints:`1;0`,keyTimes:`0;1`,calcMode:`linear`},v),b=H(`mpath`,{href:`#`+t},y);try{b.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,`#`+t)}catch{}return{circRx:h,circTx:v}}function U(){let e=document.getElementById(`usbBwSvg`);if(!e)return;e.innerHTML=``,e.setAttribute(`preserveAspectRatio`,`xMidYMin meet`);let t=e.parentElement,r=t?t.clientWidth:0,i=r>100?Math.min(window.innerWidth,r):window.innerWidth,a=i<480,o=i>=480&&i<=900,s=document.documentElement.getAttribute(`data-theme`)===`light`,c=Vt(),l=Ut(s,c.theme),u={cardBg:s?`#ffffff`:`#13151f`,cardBgAlt:s?`#f8fafc`:`#181a26`,cardBorder:s?`#cbd5e1`:`rgba(255, 255, 255, 0.16)`,cardBorderIdle:s?`#e2e8f0`:`rgba(255, 255, 255, 0.08)`,borderActive:s?`#64748b`:`rgba(255, 255, 255, 0.34)`,borderLan:s?`#64748b`:`rgba(255, 255, 255, 0.34)`,borderSwitch:s?`#64748b`:`rgba(255, 255, 255, 0.34)`,borderAp:s?`#64748b`:`rgba(255, 255, 255, 0.34)`,borderDev:s?`#64748b`:`rgba(255, 255, 255, 0.34)`,borderWifi:s?`#64748b`:`rgba(255, 255, 255, 0.34)`,textMain:s?`#09090b`:`#f4f4f5`,textDim:s?`#475569`:`#a1a1aa`,textMuted:s?`#64748b`:`#71717a`,conduitIdle:s?`rgba(0, 0, 0, 0.15)`:`rgba(255, 255, 255, 0.15)`,cardShadow:s?`drop-shadow(0 2px 4px rgba(0,0,0,0.06))`:`drop-shadow(0 2px 6px rgba(0,0,0,0.5))`};if(!window._topoTree){let e=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`,t=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_mac||`52:5a:4e:e9:61:a0`;window._topoTree=Ln(window._topologyLayers,e,t)}let d=window._topoTree;window._lastDataCache&&typeof In==`function`&&In(d,window._lastDataCache),Kt(d,i);let f=d._layout||{subtreeW:600,subtreeH:500},p=c.showWan?a?165:185:a?50:60,m=a?Math.max(390,f.subtreeW+60):Math.max(r||640,f.subtreeW+80),h=m/2;qt(d,h,p,0,i),H(`defs`,{},e);let g=H(`g`,{id:`topoEdgesLayer`},e),_=H(`g`,{id:`topoNodesLayer`},e),v=H(`g`,{id:`topoLabelsLayer`},e),y=h-100,b=h+100,x=p+100,S=window._lastDataCache||{},C=S.network?.uplink||S.topology_layers?.tree?.active_uplink||{},w=String(C.mode||``).toLowerCase(),T=C.connected===!0||C.connected===1||C.connected===`true`,E=(S.ports||[]).find(e=>e.id===`wan`||e.id===`wan0`||e.name===`WAN`)||(S.network?.ports||[]).find(e=>e.id===`wan`),D=T&&![`usb_tether`,`repeater`,`disconnected`].includes(w),O=Array.isArray(S.usb_devices)&&S.usb_devices.some(e=>!e||e.device_type===`storage`||e.device_type===`ssd`||e.device_type===`pendrive`||e.has_storage?!1:!!(e.is_wan||e.has_tethering||e.net_interface&&e.net_interface.startsWith(`usb`)||S.mobile&&S.mobile.connected))||!!(S.mobile&&S.mobile.connected&&!S.usb_devices?.some(e=>(e.device_type===`storage`||e.has_storage)&&!e.has_tethering)),k=!0,A=S.router&&S.router.usb,j=Array.isArray(S.usb_devices)&&S.usb_devices[0],M=A&&A.speed_mbps||j&&j.speed_mbps||(O?5e3:0);k=M>0&&M<1e3?!1:M>=1e3;let N=Mt(k?`usb3`:`usb2`,s),P=T?w===`usb_tether`:O,F=T?w===`repeater`:!!(S.repeater?.connected||S.topology_layers?.tree?.repeater_uplink?.connected||window._repeaterConnected),ee=P||D||F;if(c.showWan&&ee){let e=F&&!P,t=e?a?234:o?254:274:a?210:o?230:250,n=h-t/2,r=p-96;y=Math.min(y,n),b=Math.max(b,n+t);let i=P?N.lineStroke||`#38bdf8`:e?s?`#0284c7`:`#38bdf8`:s?`#059669`:`#10b981`,l=`M ${h} ${r+34} L ${h} ${p}`;H(`path`,{class:`base`,d:l,stroke:i,"stroke-width":2.2,fill:`none`,style:`opacity:0.9;`},g);let d=c.animMode===`flowing`||!c.animMode,f=c.animMode===`glow`,m=`topoWanUplinkFlow`;H(`path`,{id:m,class:`flow`,d:l,stroke:i,"stroke-width":2.4,fill:`none`,style:f||d?`filter:drop-shadow(0 0 5px ${i});`:``},g);let x=Math.max(0,Number(window._currentRxMbps)||0)+Math.max(0,Number(window._currentTxMbps)||0);d&&x>0&&sn(g,m,i,null,Math.max(0,Number(window._currentRxMbps)||0),Math.max(0,Number(window._currentTxMbps)||0));let w=S.repeater||S.topology_layers?.tree?.repeater_uplink||{},T=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.wan_ip&&window._lastDataCache.network.wan_ip!==`--`||window._lastDataCache&&window._lastDataCache.multilink&&window._lastDataCache.multilink.links&&window._lastDataCache.multilink.links[0]&&window._lastDataCache.multilink.links[0].ip||``,D=w.bitrate||(Number(C.speed_mbps)>0?`${C.speed_mbps} Mbps`:`Unknown`),O=String(D).match(/([\d.]+)\s*MBit\/s/i);if(O){let e=parseFloat(O[1]);D=e>=1e3?(e/1e3).toFixed(1)+` Gbps`:Math.round(e)+` Mbps`}Number(C.speed_mbps),Number(E?.speed);let k=`${x.toFixed(1)} Mbps`,A=(r+34+p)/2,j=Math.max(52,Math.round(k.length*6.8+14)),M=H(`g`,{class:`topo-wan-wire-pill`},v);H(`rect`,{x:h-j/2,y:A-15/2,width:j,height:15,rx:4,ry:4,fill:u.cardBg,stroke:i,"stroke-width":1.1,style:`filter:${s?`drop-shadow(0 1px 3px rgba(0,0,0,0.1))`:`drop-shadow(0 2px 6px rgba(0,0,0,0.6))`};`},M);let ee=w.ssid&&w.ssid.length>10?w.ssid.substring(0,9)+`…`:w.ssid||`Wi-Fi`,te=P?`WAN USB`:e?`REPEATER: ${ee}`:`WAN ETHERNET`,ne=e?w.ip||T||`Connected`:T||`DHCP Online`,I=H(`text`,{x:h,y:A+3.2,"text-anchor":`middle`,style:`font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${N.lineStroke||`#0284c7`};`},M);I.textContent=k;let L=H(`g`,{class:`topo-wan-chip`,"data-node-id":`wan-uplink`,role:`treeitem`,"aria-label":P?`WAN Uplink USB0`:e?`WAN Repeater ${w.ssid||``}`:`WAN Uplink Ethernet`,tabindex:`0`,style:`cursor:pointer; animation: topoNodeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;`},_);L.onclick=t=>{Ze({name:te,type:e?`repeater`:`wan`,ip:ne||`Online`,speed:`${x.toFixed(1)} Mbps`,status:`online`,isRepeater:e},!1,t)},H(`rect`,{x:n,y:r,width:t,height:34,rx:8,ry:8,fill:u.cardBg,stroke:u.cardBorder,"stroke-width":1.3,style:`filter:${u.cardShadow};`},L);let R=window._lastDataCache&&Array.isArray(window._lastDataCache.usb_devices)&&window._lastDataCache.usb_devices[0]||{},re=R.device_type===`storage`||R.device_type===`ssd`||R.device_type===`pendrive`||R.has_storage;re||R.device_type===`phone`||R.has_tethering||window._lastDataCache&&window._lastDataCache.mobile&&window._lastDataCache.mobile.connected;let z=n+6,ie=r+6;H(`rect`,{x:z,y:ie,width:24,height:24,rx:5,ry:5,fill:s?`rgba(0,0,0,0.025)`:`rgba(255,255,255,0.025)`},L),P?Et(z+12,ie+12,`#38bdf8`,L):e?bt(z+12,ie+12,`#38bdf8`,L):yt(z+12,ie+12,`#0284c7`,L);let ae=n+36,oe=H(`text`,{x:ae,y:r+14.5,style:`font-size:8px; font-weight:800; font-family:var(--font-mono); fill:${u.textMain};`},L);oe.textContent=te;let se=H(`text`,{x:ae,y:r+25.5,style:`font-size:7.5px; font-weight:600; font-family:var(--font-mono); fill:${u.textMuted};`},L);if(se.textContent=ne,P&&!re){let e=ae+46,t=ae+57,n=r+11.5;Ct(e,n,`#10b981`,L,.65),wt(t,n,`#38bdf8`,L,.65)}let B=`${x.toFixed(1)} Mbps`,ce=s?`#334155`:`#94a3b8`,le=H(`text`,{x:n+t-10,y:r+20.5,"text-anchor":`end`,style:`font-size:8.5px; font-weight:800; font-family:var(--font-mono); fill:${ce};`},L);le.textContent=B,H(`circle`,{cx:n+t-8,cy:r+7,r:1.8,class:`topo-pulse-dot`,fill:`#10b981`},L)}function te(e){if(!e||!e._layout)return;let t=e._layout,r=e.id===`root`,i=e.type===`switch`,o=e.type===`device`,d=t.depth||0,f=r?l.l1:d===1?l.l2:l.l3,p=e.connected!==!1&&e.status!==`offline`,m=window._topoCollapsed&&window._topoCollapsed.has(e.id),h=e.id||e.ip||(r?`root`:`dev`);y=Math.min(y,t.x),b=Math.max(b,t.x+t.w),x=Math.max(x,t.y+t.h);let S=(window._topoActiveLayer||`all`).toLowerCase(),C=!1;if(S===`l1`&&!r&&(C=!0),S===`l2`&&d>1&&(C=!0),S===`l3`&&!o&&d!==1&&(C=!0),o){let r=e,i=typeof ht==`function`?ht(r):{type:`client`,title:`Device`,color:`#10b981`,badge:`DEVICE`},o=t.w,c=t.h,l=t.x;s&&i.color===`#10b981`||i.color;let f=H(`g`,{class:`topo-client-node ${p?``:`topo-offline-node`} ${C?`topo-dimmed`:``}`,"data-node-id":h,role:`treeitem`,"aria-label":`${ft(r)} ${r.ip||``}`,tabindex:`0`,style:`cursor:pointer; animation: topoNodeSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: ${d*40}ms;`},_);f.onclick=e=>{Ze(r,!1,e)},H(`rect`,{x:l,y:t.y,width:o,height:c,rx:6,ry:6,fill:u.cardBg,stroke:p?u.cardBorder:u.cardBorderIdle,"stroke-width":1.2,style:`filter:${u.cardShadow};`+(p?``:`opacity:0.75;`)},f);let m=l+6,g=t.y+(c-24)/2;H(`rect`,{x:m,y:g,width:24,height:24,rx:4,ry:4,fill:s?`rgba(0,0,0,0.025)`:`rgba(255,255,255,0.025)`},f),gt(m+12,g+12,i,f);let v=l+38,y=ft(r),b=a?12:16;y.length>b&&(y=y.substring(0,b-1)+`…`),H(`text`,{x:v,y:t.y+14,style:`font-size:9px; font-weight:800; font-family:var(--font-mono); fill:${p?u.textMain:u.textDim};`},f).textContent=y,H(`text`,{x:v,y:t.y+26,style:`font-size:8px; font-weight:600; font-family:var(--font-mono); fill:${u.textMuted};`},f).textContent=r.ip||``;let x=n!==void 0&&n.has(r.ip)||!!r.blocked,S=x?`#ef4444`:p?`#10b981`:s?`#94a3b8`:`#52525b`;H(`circle`,{cx:l+o-6,cy:t.y+6,r:2,class:p&&!x?`topo-pulse-dot`:``,fill:S},f);return}if(e.type===`storage`){let n=t.w,r=t.h,i=t.x,o=t.y,c=H(`g`,{class:`topo-storage-node ${C?`topo-dimmed`:``}`,"data-node-id":h,role:`treeitem`,"aria-label":`${e.name||`Storage`}`,tabindex:`0`,style:`cursor:pointer; animation: topoNodeSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;`},_);c.onclick=t=>{Ze(e,!1,t)},H(`rect`,{x:i,y:o,width:n,height:r,rx:7,ry:7,fill:u.cardBg,stroke:`#c084fc`,"stroke-width":1.3,style:`filter:${u.cardShadow};`},c);let l=i+6,d=o+6;H(`rect`,{x:l,y:d,width:26,height:26,rx:5,ry:5,fill:s?`rgba(192, 132, 252, 0.08)`:`rgba(192, 132, 252, 0.12)`},c),Dt(l+13,d+13,`#c084fc`,c);let f=i+38,p=e.name||`USB storage`,m=a?12:16;p.length>m&&(p=p.substring(0,m-1)+`…`),H(`text`,{x:f,y:o+15,style:`font-size:9.5px; font-weight:800; font-family:var(--font-mono); fill:${u.textMain};`},c).textContent=p;let g=`${e.size||`--`} • SMB Share`;H(`text`,{x:f,y:o+28,style:`font-size:8px; font-weight:600; font-family:var(--font-mono); fill:${u.textMuted};`},c).textContent=g,H(`circle`,{cx:i+n-6,cy:o+6,r:2,class:`topo-pulse-dot`,fill:`#10b981`},c);return}if(e.type===`hub`){let n=t.w,r=t.h,i=t.x,a=t.y,o=H(`g`,{class:`topo-hub-node ${C?`topo-dimmed`:``}`,"data-node-id":h,role:`treeitem`,"aria-label":`${e.name||`USB Hub`}`,tabindex:`0`,style:`cursor:pointer; animation: topoNodeSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;`},_);o.onclick=t=>{Ze(e,!1,t)},H(`rect`,{x:i,y:a,width:n,height:r,rx:7,ry:7,fill:u.cardBg,stroke:N.lineStroke||`#0284c7`,"stroke-width":1.4,style:`filter:${u.cardShadow};`},o);let l=i+6,d=a+6;H(`rect`,{x:l,y:d,width:22,height:22,rx:4,ry:4,fill:s?`rgba(2, 132, 199, 0.08)`:`rgba(56, 189, 248, 0.12)`},o),Ot(l+11,d+11,N.lineStroke||`#0284c7`,o);let f=i+34;H(`text`,{x:f,y:a+15,style:`font-size:9px; font-weight:800; font-family:var(--font-mono); fill:${u.textMain};`},o).textContent=e.name||`GL3523 USB 3.0 Hub`;let p=e.speed_mbps&&e.speed_mbps>=1e3?e.speed_mbps>=1e4?`10 Gbps SuperSpeed+`:`5 Gbps SuperSpeed`:`480 Mbps HighSpeed`;H(`text`,{x:f,y:a+26,style:`font-size:7.5px; font-weight:600; font-family:var(--font-mono); fill:${u.textMuted};`},o).textContent=`${e.ports||4}-Port Hub • ${p}`,H(`circle`,{cx:i+n-8,cy:a+10,r:2.2,class:`topo-pulse-dot`,fill:`#10b981`},o);let m=Array.isArray(e.ports_list)&&e.ports_list.length>0?e.ports_list:[{port:1,version:`U3.0`,status:`available`},{port:2,version:`U3.0`,status:`available`},{port:3,version:`U2.0`,status:`connected`,name:`Disk 2.0`},{port:4,version:`U3.0`,status:`available`}],y=Math.max(1,m.length),b=(n-12-(y-1)*4)/y,x=a+33,S={};m.forEach((e,t)=>{let n=i+6+t*(b+4),r=e.status===`connected`,a=e.version||`U3.0`,c=s?`#0284c7`:`#38bdf8`;a.includes(`3.2`)?c=`#00d2ff`:a.includes(`2`)?c=s?`#7c3aed`:`#c084fc`:a.includes(`1`)&&(c=s?`#64748b`:`#a1a1aa`),S[e.port||t+1]={x:n+b/2,y:x+18,verCol:c,ver:a};let l=H(`g`,{class:`topo-hub-port-pill`},o);H(`rect`,{x:n,y:x,width:b,height:18,rx:4,ry:4,fill:r?s?`rgba(16, 185, 129, 0.12)`:`rgba(16, 185, 129, 0.18)`:s?`#f1f5f9`:`rgba(255, 255, 255, 0.04)`,stroke:r?`#10b981`:s?`#e2e8f0`:`rgba(255, 255, 255, 0.1)`,"stroke-width":r?1.1:.8},l),r&&H(`circle`,{cx:n+5,cy:x+9,r:1.8,fill:`#10b981`},l);let u=`P${e.port||t+1} ${a}`;H(`text`,{x:r?n+b/2+3:n+b/2,y:x+11.5,"text-anchor":`middle`,style:`font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${r?`#10b981`:c};`},l).textContent=u}),t.children&&t.children.length>0&&t.children.forEach((e,t)=>{let o=e.port_idx||3,l=S[o]||{x:i+n/2,y:a+r,verCol:`#c084fc`},d=l.x,f=a+r,p=e.child._layout.centerX,m=e.child._layout.topY,_=l.verCol||`#c084fc`,y=f+(m-f)*.5,b=c.lineStyle===`bezier`?Gt(d,f,p,m,y,14):Gt(d,f,p,m,y,8);if(H(`path`,{class:`base ${C?`topo-dimmed`:``}`,"data-edge-from":h,"data-edge-to":e.child.id||`hub-child`,d:b,stroke:_,"stroke-width":1.8,fill:`none`,style:s?`opacity:0.75;`:`opacity:0.9;`},g),c.animMode!==`off`){let n=`topoHubFlow_${t}_${Math.random().toString(36).substr(2,5)}`;if(H(`path`,{id:n,class:`flow`,d:b,stroke:_,"stroke-width":2,fill:`none`,style:c.animMode===`glow`||c.animMode===`flowing`?`filter:drop-shadow(0 0 4px ${_});`:``},g),c.animMode===`flowing`){let t=e.child.speed_mbps||480;sn(g,n,_,null,t>=1e3?15:4,t>=1e3?10:2.5)}}if(c.showSpeeds){let t=(d+p)/2,n=H(`g`,{class:`topo-edge-speed-pill ${C?`topo-dimmed`:``}`},v);H(`rect`,{x:t-18,y:y-8,width:36,height:16,rx:4,ry:4,fill:u.cardBg,stroke:_,"stroke-width":.9,style:`filter:${s?`drop-shadow(0 1px 2px rgba(0,0,0,0.06))`:`drop-shadow(0 2px 4px rgba(0,0,0,0.5))`};`},n);let r=H(`text`,{x:t,y:y+3.5,"text-anchor":`middle`,style:`font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${_};`},n);r.textContent=e.child.speed_mbps&&e.child.speed_mbps>=1e3?`5Gbps`:`480M`}te(e.child)});return}let w=t.w,T=t.h,E=t.x,D=H(`g`,{class:`${r?`topo-root-chassis`:`topo-ap-node`} ${p?``:`topo-offline-node`} ${C?`topo-dimmed`:``}`,"data-node-id":h,role:`treeitem`,"aria-label":`${e.name||`Router`} ${e.ip||``}`,tabindex:`0`,style:`cursor:pointer; animation: topoNodeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: ${d*40}ms;`},_);D.onclick=t=>{Zt(e),Ze(e,!1,t)},H(`rect`,{x:E,y:t.y,width:w,height:T,rx:8,ry:8,fill:u.cardBg,stroke:p?u.cardBorder:u.cardBorderIdle,"stroke-width":1.4,style:`filter:${s?`drop-shadow(0 3px 8px rgba(0,0,0,0.06))`:`drop-shadow(0 4px 12px rgba(0,0,0,0.45))`};`},D);let O=E+6,k=t.y+6;H(`rect`,{x:O,y:k,width:32,height:32,rx:5,ry:5,fill:s?`rgba(0,0,0,0.025)`:`rgba(255,255,255,0.025)`},D),r?_t(O+16,k+16,f,D):i?yt(O+16,k+16,f,D):vt(O+16,k+16,f,D);let A=H(`text`,{x:E+46,y:t.y+16.5,style:`font-size:10px; font-weight:800; font-family:var(--font-mono); fill:${u.textMain};`},D),j=r?window._lastDataCache&&window._lastDataCache.router&&window._lastDataCache.router.hostname||e.name||`MAXNET`:e.name||`Access Point`;j.length>14&&(j=j.substring(0,13)+`…`),A.textContent=j;let M=H(`text`,{x:E+46,y:t.y+28.5,style:`font-size:8px; font-weight:600; font-family:var(--font-mono); fill:${u.textMuted};`},D),P=r?window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||e.ip||`10.0.0.1`:e.ip||`10.0.0.2`;if(M.textContent=String(P).split(/[\s,]+/)[0].replace(/\/\d+$/,``),r){let e=H(`g`,{class:`topo-router-combined-speed`},D),n=s?`#334155`:`#94a3b8`,r=H(`text`,{id:`rtrCombinedSpeed`,x:E+w-12,y:t.y+23.5,"text-anchor":`end`,style:`font-size:11px; font-weight:800; font-family:var(--font-mono); fill:${n}; letter-spacing:-0.2px;`},e);r.textContent=`⇄ `+(typeof en==`function`?en():`0.000 Mbps`)}H(`circle`,{cx:E+w-7,cy:t.y+6,r:2,class:p?`topo-pulse-dot`:``,fill:p?`#10b981`:s?`#94a3b8`:`#52525b`},D),H(`line`,{x1:E,y1:t.y+40,x2:E+w,y2:t.y+40,stroke:u.cardBorderIdle,"stroke-width":1},D);let F=Ft(e,a),ee=F.length,ne=Math.floor((w-12-(ee-1)*4)/ee),I=t.y+40+4,L=new Map;if(F.forEach((t,n)=>{let r=E+6+n*(ne+4),i=r+ne/2,a=I+24,o=t.type===`lan`,c=o?t.role!==`empty`:t.count>0,d=o?zt(t.child):t.count;t.socketCenterX=i,t.socketBottomY=a,o&&t.port?L.set(t.port.id,t):t.type===`usb`?L.set(`root-usb`,t):o||L.set(`wifi`,t);let p=t.type===`usb`,m=H(`g`,{class:`topo-socket-box ${c||p&&t.connected?`is-up`:`is-idle`}`,style:`cursor:pointer;`},D);m.onclick=n=>{if(n.stopPropagation(),p){let e=window._lastDataCache||{};Ze(e.usb_hub&&e.usb_hub.connected?{type:`hub`,...e.usb_hub}:{type:`storage`,...e.usb_storage||{}},!0,n)}else o?Ze(t.port||t,!0,n):(window._topoWifiExpanded[e.id]=window._topoWifiExpanded[e.id]!==void 0&&!window._topoWifiExpanded[e.id],U(),setTimeout(nt,60))};let h=t.type===`wan`,g=!1;if(h&&window._lastDataCache&&window._lastDataCache.network&&Array.isArray(window._lastDataCache.network.ports)){let e=window._lastDataCache.network.ports.find(e=>e.id===`wan`);e&&e.status===`up`&&(g=!0)}let _=h?g:c,v=c?u.cardBorder:u.cardBorderIdle;H(`rect`,{x:r,y:I,width:ne,height:24,rx:6,ry:6,fill:h?g?s?`rgba(2,132,199,0.08)`:`rgba(56,189,248,0.1)`:s?`#f8fafc`:`rgba(255,255,255,0.02)`:c?s?`rgba(2,132,199,0.06)`:`rgba(56,189,248,0.08)`:s?`#f8fafc`:`rgba(255,255,255,0.02)`,stroke:v,"stroke-width":.9},m),H(`circle`,{cx:r+5,cy:I+5.5,r:1.5,class:_?`topo-pulse-dot`:``,fill:_?`#10b981`:s?`#94a3b8`:`#52525b`},m);let y=t.label||(h?`W1`:o?`L${t.idx+1}`:`Wi-Fi`);if(d>0){let e=H(`text`,{x:i,y:I+9.5,"text-anchor":`middle`,style:`font-size:6.8px; font-weight:800; font-family:var(--font-mono); fill:${c?h?N.lineStroke||`#0284c7`:o?f:l.wifi:u.textDim};`},m);e.textContent=y;let t=H(`g`,{class:`topo-port-client-count`,style:`fill:${c?u.textMain:u.textDim};`},m),n=-5.5;H(`circle`,{cx:i+n-2.5,cy:I+16,r:1.3,fill:`currentColor`},t),H(`path`,{d:`M ${i+n-4.5} ${I+20} a2 2 0 0 1 4 0 Z`,fill:`currentColor`},t),H(`text`,{x:i+n+3.5,y:I+19.5,"text-anchor":`start`,style:`font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${c?u.textMain:u.textDim};`},t).textContent=`${d}`}else{let e=H(`text`,{x:i,y:I+15,"text-anchor":`middle`,style:`font-size:7.2px; font-weight:800; font-family:var(--font-mono); fill:${_?h?N.lineStroke||`#0284c7`:o?f:l.wifi:u.textDim};`},m);e.textContent=y}}),m)return;let R=t.children||[],re=R.length;R.forEach((t,r)=>{let i=E+w/2,a=I+24,o=f,p=0,m=0,S=``;if(t.type===`lan`){let e=L.get(t.port.id);e&&(i=e.socketCenterX,a=e.socketBottomY),p=t.child._layout.centerX,m=t.child._layout.topY,S=t.child.id||t.child.ip||t.child.mac||`lan-child`}else if(t.type===`wifi_cluster`){let n=L.get(`wifi`);n&&(i=n.socketCenterX,a=n.socketBottomY),o=l.wifi,p=t.centerX-40,m=t.topY,S=`${e.id}-wifi-clients`}else if(t.type===`usb_hub`||t.type===`usb_storage`){let e=L.get(`root-usb`);e&&(i=e.socketCenterX,a=e.socketBottomY),o=t.type===`usb_hub`?N.lineStroke||`#0284c7`:`#c084fc`,p=t.child._layout.centerX,m=t.child._layout.topY,S=t.child.id||`usb-child`}let T=a+(m-a)*.5+(r-(re-1)/2)*10,D=c.lineStyle===`bezier`?Gt(i,a,p,m,T,14):Gt(i,a,p,m,T,8),O=t.type===`wifi_cluster`?t.clients.length>0:t.child.status!==`offline`;if(H(`path`,{class:`base ${C?`topo-dimmed`:``}`,"data-edge-from":h,"data-edge-to":S,d:D,stroke:o,"stroke-width":1.8,fill:`none`,style:(t.type===`wifi_cluster`?`stroke-dasharray:3 2.5; `:``)+(O?s?`opacity:0.75;`:`opacity:0.9;`:`opacity:0.3; stroke-dasharray:4 3;`)},g),O&&c.animMode!==`off`){let e=`topoFlow_${d}_${r}_${Math.random().toString(36).substr(2,5)}`;if(H(`path`,{id:e,class:`flow`,d:D,stroke:o,"stroke-width":2,fill:`none`,style:(t.type===`wifi_cluster`?`stroke-dasharray:3 2.5; `:``)+(c.animMode===`glow`||c.animMode===`flowing`?`filter:drop-shadow(0 0 4px ${o});`:``)},g),c.animMode===`flowing`){let n=an(t.child&&t.child.ip||t.clients&&t.clients[0]&&t.clients[0].ip),r=n.rx,i=n.tx;if(t.type===`usb_hub`||t.type===`usb_storage`){let e=t.child&&t.child.speed_mbps||480;r=e>=1e3?15:4,i=e>=1e3?10:2.5}sn(g,e,o,null,r,i)}}if(c.showSpeeds&&t.type!==`wifi_cluster`){let e=(i+p)/2,n=H(`g`,{class:`topo-edge-speed-pill ${C?`topo-dimmed`:``}`},v);H(`rect`,{x:e-18,y:T-8,width:36,height:16,rx:4,ry:4,fill:u.cardBg,stroke:o,"stroke-width":.9,style:`filter:${s?`drop-shadow(0 1px 2px rgba(0,0,0,0.06))`:`drop-shadow(0 2px 4px rgba(0,0,0,0.5))`};`},n);let r=H(`text`,{x:e,y:T+3.5,"text-anchor":`middle`,style:`font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${o};`},n);if(t.type===`usb_hub`)r.textContent=t.child.speed_mbps&&t.child.speed_mbps>=1e3?`5Gbps`:`480M`;else if(t.type===`usb_storage`)r.textContent=t.child.speed_mbps&&t.child.speed_mbps>=1e3?`5Gbps`:`480M`;else{let e=Number(t.child?.speed_mbps||t.speed_mbps||0);r.textContent=e>0?`${e}M`:`--`}}if(t.type===`lan`||t.type===`usb_hub`||t.type===`usb_storage`)te(t.child);else if(t.type===`wifi_cluster`){let e=t.centerX-40,r=l.wifi,i=t.topY;y=Math.min(y,e-20),b=Math.max(b,e+120+30),x=Math.max(x,t.topY+t.totalH+20);let a=`M ${e} ${i} L ${e} ${i+(t.clients.length-1)*38+15}`;if(H(`path`,{d:a,stroke:r,"stroke-width":1.5,fill:`none`,style:(s?`opacity:0.75;`:`opacity:0.9;`)+` stroke-dasharray:3 2.5;`},g),t.clients.length>1&&(c.animMode===`flowing`||!c.animMode)){let e=`topoWifiTrunk_${h}`;H(`path`,{id:e,class:`flow`,d:a,stroke:r,"stroke-width":1.8,fill:`none`,style:c.animMode===`glow`||c.animMode===`flowing`?`filter:drop-shadow(0 0 3px ${r});`:``},g);let n=0,i=0;t.clients.forEach(e=>{let t=an(e.ip);n+=t.rx,i+=t.tx}),sn(g,e,r,null,n||3,i||1.5)}t.clients.forEach((t,a)=>{let o=i+a*38,l=e+12,d=t.status!==`offline`,f=t.id||t.ip||t.mac||`wc-${a}`;b=Math.max(b,l+120+10),x=Math.max(x,o+30+10);let p=n!==void 0&&n.has(t.ip)||!!t.blocked,m=p?`#ef4444`:d?`#10b981`:s?`#94a3b8`:`#52525b`,v=p?`#ef4444`:d?u.cardBorder:u.cardBorderIdle,y=`M ${e} ${o+15} L ${l} ${o+15}`;H(`path`,{d:y,stroke:r,"stroke-width":1.5,fill:`none`,style:(s?`opacity:0.75;`:`opacity:0.85;`)+` stroke-dasharray:3 2.5;`},g);let S=an(t.ip);if(d&&(c.animMode===`flowing`||!c.animMode)){let e=`topoWifiBranch_${h}_${a}`;H(`path`,{id:e,class:`flow`,d:y,stroke:r,"stroke-width":nn(S.rx+S.tx),fill:`none`,style:c.animMode===`glow`||c.animMode===`flowing`?`filter:drop-shadow(0 0 3px ${r});`:``},g),sn(g,e,r,null,S.rx,S.tx)}let C=H(`g`,{class:`topo-lan-device-node ${d?``:`topo-offline-node`}`,"data-node-id":f,role:`treeitem`,"aria-label":`${t.name||`Wireless Device`} ${t.ip||``}`,tabindex:`0`,style:`cursor:pointer;`},_);C.onclick=e=>{e.stopPropagation(),Ze(t,!1,e)},H(`rect`,{x:l,y:o,width:120,height:30,rx:6,ry:6,fill:u.cardBg,stroke:v,"stroke-width":1,style:`filter:${s?`drop-shadow(0 1px 3px rgba(0,0,0,0.04))`:`drop-shadow(0 2px 6px rgba(0,0,0,0.4))`};`},C);let w=l+4,T=o+4;H(`rect`,{x:w,y:T,width:22,height:22,rx:4,ry:4,fill:s?`rgba(0,0,0,0.025)`:`rgba(255,255,255,0.025)`},C);let E=typeof ht==`function`?ht(t):{type:`phone`,color:r};gt(w+11,T+11,{...E,color:d?r:u.textDim},C);let D=ft(t);D.length>13&&(D=D.substring(0,12)+`…`);let O=H(`text`,{x:l+30,y:o+13.5,style:`font-size:8px; font-weight:800; font-family:var(--font-mono); fill:${d?u.textMain:u.textDim};`},C);O.textContent=D;let k=H(`text`,{x:l+30,y:o+23.5,style:`font-size:7.2px; font-weight:600; font-family:var(--font-mono); fill:${u.textMuted};`},C);k.textContent=t.ip||`--`,H(`circle`,{cx:l+4.5,cy:o+4.5,r:1.6,class:d&&!p?`topo-pulse-dot`:``,fill:m},C)})}})}te(d);let ne=Math.min(0,y-40),I=Math.max(m,b+40),L=(c.showWan?Math.min(0,p-96):0)-36,R=Math.max(a?540:560,x+50),re=I-ne,z=R-L;e.setAttribute(`viewBox`,`${ne} ${L} ${re} ${z}`),$t(d,{subtreeW:re,subtreeH:z},i),cn(),window._topoUserInteracted||setTimeout(nt,40)}function cn(){let e=0;st&&st.length>0&&st.slice(0,5).forEach((t,n)=>{let r=document.getElementById(`bwDevSpeedVal_`+n)||t.sv,i=document.getElementById(`bwDevSpeedUnit_`+n)||t.su,a=document.getElementById(`bwDevSpeedMax_`+n)||t.sm,o=t.device_type===`storage`||t.device_type===`ssd`||t.device_type===`pendrive`||t.has_storage,s=Number(t.v)||0;if(t.connected){if(o){let e=t.deviceData||{},n=e.total_space&&e.total_space!==`--`?e.total_space:``,o=e.free_space&&e.free_space!==`--`?e.free_space:``;n&&!n.endsWith(`B`)&&(n+=`B`),o&&!o.endsWith(`B`)&&(o+=`B`),r&&(r.textContent=n||`Storage`),i&&(i.textContent=``),a&&(a.textContent=o?`(${o} free)`:``)}else{e+=s;let n=s>=10?Math.round(s):s>0?s.toFixed(1):`0.0`;r&&(r.textContent=n),i&&(i.textContent=`Mbps`),a&&(a.textContent=Nt(t))}if(t.flow){let e=t.max||1e3,n=Math.min(1,s/e);t.flow.style.strokeWidth=(1.6+n*2.6).toFixed(2),t.flow.style.opacity=s>0?(.45+n*.55).toFixed(2):`0.22`}}else r&&(r.textContent=`--`),i&&(i.textContent=``),a&&(a.textContent=``)});let t=e>=10?Math.round(e):e>0?e>=10?Math.round(e):e.toFixed(1):`0.0`;ot.cv&&(ot.cv.textContent=t);let n=document.querySelector(`.topo-wan-chip text:last-of-type`);n&&(n.textContent=`${(Math.max(0,Number(window._currentRxMbps)||0)+Math.max(0,Number(window._currentTxMbps)||0)).toFixed(1)} Mbps`,n.style.fill=document.documentElement.getAttribute(`data-theme`)===`light`?`#334155`:`#94a3b8`);let r=document.getElementById(`rtrCombinedSpeed`);r&&typeof en==`function`&&(r.textContent=`⇄ `+en())}window.addEventListener(`resize`,()=>{let e=window.innerWidth>=900,t=document.getElementById(`dashboardContainer`),n=document.getElementById(`tabOverview`),r=document.getElementById(`tabSettings`);(r&&r.style.display!==`none`||t&&t.classList.contains(`settings-side-open`))&&(e?(t&&t.classList.add(`settings-side-open`),n&&(n.style.display=`block`)):(t&&t.classList.remove(`settings-side-open`),n&&(n.style.display=`none`))),typeof U==`function`&&U()});function ln(e,t,n){window._lastDataCache=e,window._currentRxMbps=parseFloat(t)||0,window._currentTxMbps=parseFloat(n)||0;let r=e.mobile||{},i=e.multilink&&Array.isArray(e.multilink.links)?e.multilink.links:[],a=e.network&&e.network.ports||[];a.find(e=>e.id===`wan`);let o=e.network?.uplink||e.topology_layers?.tree?.active_uplink||{},s=String(o.mode||``).toLowerCase(),c=(o.connected===!0||o.connected===1||o.connected===`true`)&&![`usb_tether`,`repeater`,`disconnected`].includes(s),l=(parseFloat(t)||0)+(parseFloat(n)||0),u=i[0]&&parseFloat(i[0].speed_mbps)||0,d=l>0?l:u>0?u:0,f=r.connected||i[0]&&i[0].status===`CONNECTED`,p=e.usb_hub||{connected:!1},m=!!p.connected,h=window._hasHub,g=window._bwLinksCount;if(window._hasHub=m,window._hubData=p,m){let t=Array.isArray(e.usb_devices)?e.usb_devices:[];st=[],t.forEach((e,t)=>{if(!e||!(e.status===`online`||e.status===`offline`||e.status===`blocked`||e.is_wan||e.model))return;let n=e.model||e.raw_model||`Connected Device`,r=e.hostname||``,a=e.virtual_ip||e.ip||``,o=e.status||(e.is_wan,`online`),s=e.status_color||(o===`blocked`?`red`:o===`online`?`green`:`gray`),c=i.find(t=>t.id===e.net_interface)||{},l=0;if(c&&(c.rx_bytes!==void 0||c.tx_bytes!==void 0)){window._ifaceRateStats||(window._ifaceRateStats={});let t=c.id||e.net_interface,n=Date.now(),r=(Number(c.rx_bytes)||0)+(Number(c.tx_bytes)||0),i=window._ifaceRateStats[t];if(i&&r>=i.bytes&&n-i.time>400){let e=r-i.bytes,t=(n-i.time)/1e3;l=e*8/(t*1e6)}else c.speed_mbps!==void 0&&(l=Number(c.speed_mbps)||0);window._ifaceRateStats[t]={bytes:r,time:n}}else c&&c.speed_mbps!==void 0&&(l=Number(c.speed_mbps)||0);let u=`usb3`,d=`USB 3.0`,f=1e3;e.speed_mbps>=5e3||e.standard===`USB 3.0`?(u=`usb3`,d=`USB 3.0`,f=5e3):e.speed_mbps>=480||e.standard===`USB 2.0`?(u=`usb2`,d=`USB 2.0`,f=480):(u=`usb1`,d=`USB 1.1`,f=12);let p=e.device_type===`storage`||e.device_type===`ssd`||e.device_type===`pendrive`||!!e.has_storage,m=!1,h=`No Internet`;!p&&(e.has_tethering||e.device_type===`phone`)&&(c.status===`CONNECTED`||e.has_internet===!0?(m=!0,h=e.internet_status||`Online`):(c.status===`NO_INTERNET`||e.has_internet===!1)&&(m=!1,h=`No Internet`)),st.push({cls:u===`usb3`?`u3`:u===`usb2`?`u2`:`u1`,type:d,usbStd:u,connected:!0,brand:e.brand||e.manufacturer||``,model:e.model||e.raw_model||``,name:n,hostname:r,virtual_ip:a,ip:e.ip||a||``,iface:e.net_interface||``,net_interface:e.net_interface||``,port:e.port,status:o,status_color:s,device_type:p?`storage`:`phone`,has_tethering:!p&&!!e.has_tethering,has_adb:!!e.has_adb||!!e.adb_enabled,has_mtp:!!e.has_mtp,has_storage:p,has_internet:m,internet_status:h,is_wan:!!e.is_wan,v:l,max:f,nodeKey:`modem`,subIndex:t,deviceData:e})}),st.length===0&&f&&st.push({cls:`u3`,type:`USB 3.0`,usbStd:`usb3`,connected:!0,name:r.model||i[0]&&i[0].model||`USB tether`,hostname:i[0]&&i[0].hostname||``,virtual_ip:i[0]&&(i[0].virtual_ip||i[0].ip)||r.usb_ip||``,status:`online`,status_color:`green`,device_type:`phone`,has_tethering:!0,has_adb:!1,has_mtp:!1,has_storage:!1,has_internet:!0,internet_status:`Online`,v:d,max:5e3,nodeKey:`modem`,subIndex:0})}else{let t=(Array.isArray(e.usb_devices)?e.usb_devices:[])[0]||{},n=0;t.speed_mbps?n=Number(t.speed_mbps):e.router&&e.router.usb&&e.router.usb.speed_mbps?n=Number(e.router.usb.speed_mbps):i[0]&&i[0].speed_mbps&&(n=Number(i[0].speed_mbps));let a=t.standard||e.router&&e.router.usb&&e.router.usb.link_mode||i[0]&&i[0].label||``,s=i[0]&&i[0].type||``,l=`usb3`,u=`USB 3.0`;n>=5e3||a.includes(`3`)||s.includes(`3`)?(l=`usb3`,u=a.includes(`3.1`)?`USB 3.1`:a.includes(`3.2`)?`USB 3.2`:`USB 3.0`):n>=480||a.includes(`2`)||s.includes(`2`)?(l=`usb2`,u=`USB 2.0`):(n>0&&n<480||a.includes(`1`)||s.includes(`1`))&&(l=`usb1`,u=`USB 1.1`);let p=!!(f||t.model&&t.model!==`No Device`||t.status&&t.status===`online`||e.router?.usb?.connected);if(st=[],p){let e=t.model||t.raw_model||r.model||i[0]&&i[0].model||`Connected Device`;st.push({cls:l===`usb3`?`u3`:l===`usb2`?`u2`:`u1`,type:u,usbStd:l,connected:!0,brand:t.brand||t.manufacturer||`Device`,model:t.model||t.raw_model||e,name:e,hostname:t.hostname||`usb0`,virtual_ip:t.virtual_ip||t.ip||``,status:t.status||`online`,status_color:t.status_color||`green`,device_type:t.device_type||`phone`,has_tethering:t.has_tethering===void 0||t.has_tethering,has_adb:t.has_adb===void 0?t.adb_enabled||!1:t.has_adb,has_mtp:!!t.has_mtp,has_storage:!!t.has_storage,has_internet:t.has_internet===void 0||t.has_internet,internet_status:t.internet_status||`Online`,v:d,max:l===`usb3`?5e3:l===`usb2`?480:12,nodeKey:`modem`,subIndex:0,deviceData:t})}c&&st.push({cls:`w`,type:`WAN`,usbStd:`wan`,connected:!0,name:`Ethernet Uplink`,v:Number(o.speed_mbps)||0,max:Number(o.speed_mbps)||0,nodeKey:`wan`,subIndex:1})}window._bwLinksCount=st.length;let _=e.clients||[],v=[1,2,3,4].map(e=>{let t=`lan`+e,n=(a.find(e=>e.id===t)||{id:t,speed:0,status:`down`}).status===`up`,r=Pt(e),i=[],o=0,s=n;return r&&r.mode===`layer2_ap`?(i=r.layer3_devices||[],o=i.length,s=!0):r&&r.mode===`direct`&&r.device?(i=[r.device],o=1,s=!0):r&&r.mode===`empty`?(i=[],o=0,s=!1):(i=_.filter(t=>{let n=(t.port||``).toLowerCase();return!!(n.includes(`lan `+e)||n.includes(`lan`+e)||e===3&&(n.includes(`switch`)||n.includes(`ap`))||!n&&e===2)}),o=i.length),{portIndex:e,id:t,isUp:s,clientCount:o,clients:i}});window._bwLanOutputs=v;let y=window._bwClientsTotal||0,b=_.length;window._bwClientsTotal=b;let x=_.filter(e=>e&&e.connected).map(e=>`${e.mac}:${e.port}:${e.ip}`).sort().join(`|`),S=window._prevConnectedKey||``;window._prevConnectedKey=x;let C=document.getElementById(`usbBwSvg`);h===m&&g===st.length&&S===x&&y===b&&C&&C.hasChildNodes()||U(),cn(),V&&_e(V.type,V.index)}function un(e){if(!e)return;e.mobile&&e.mobile.uptime_seconds&&(window._mobUptimeBase=Number(e.mobile.uptime_seconds),window._mobUptimeTs=Date.now()),e.router&&e.router.uptime_seconds&&(window._rtrUptimeBase=Number(e.router.uptime_seconds),window._rtrUptimeTs=Date.now());let t=String(e.firmware||e.router?.version||``).trim(),n=document.getElementById(`dashBrandTitle`);if(n&&(n.textContent=`MAXNET`),t){let e=t.toLowerCase().startsWith(`v`)?t.toLowerCase():`v${t}`,n=t.toUpperCase().startsWith(`V`)?t.toUpperCase():`V${t}`,r=document.getElementById(`headerVer`);r&&(r.textContent=e),document.title=`MAXNET | ${n}`}if(e.router){let t=document.getElementById(`topoDockCpu`);if(t){let n=e.router.cpu_pct===void 0?0:e.router.cpu_pct;t.textContent=Math.round(Number(n)||0)+`%`}let n=e.router.memory||{},r=document.getElementById(`topoDockRam`);if(r){let e=Number(n.phys_total_mb)||432,t=Number(n.phys_avail_mb)||0,i=Math.max(0,e-t),a=n.phys_used_pct===void 0?e>0?i*100/e:n.used_pct===void 0?0:Number(n.used_pct):Number(n.phys_used_pct);r.textContent=Math.round(a)+`%`,r.title=`Physical RAM: ${i} MB / ${e} MB (${Math.round(a)}%)`}let i=document.getElementById(`topoDockZram`);if(i){let e=Number(n.zram_total_mb)||256,t=Number(n.zram_used_mb)||0,r=n.zram_used_pct===void 0?e>0?t*100/e:0:Number(n.zram_used_pct);i.textContent=Math.round(r)+`%`,i.title=`ZRAM Pool: ${t} MB / ${e} MB (${Math.round(r)}%)`}let a=document.getElementById(`topoDockTemp`);if(a){let t=e.router.temp_c===void 0?38.9:e.router.temp_c;a.textContent=Math.round(Number(t)||39)+`°C`}}if(e.firmware){let t=document.getElementById(`firmwareBadge`);t&&(t.innerText=e.firmware)}let r=e.traffic||{},i=r.wan_rx_bytes||0,a=r.wan_tx_bytes||0,s=r.live_rx_bytes===void 0?i:r.live_rx_bytes,c=r.live_tx_bytes===void 0?a:r.live_tx_bytes,l=i+a,u=document.getElementById(`bannerTotUsage`);u&&(u.innerText=se(l));let d=document.getElementById(`bannerRxUsage`);d&&(d.innerText=`↓ `+se(i));let f=document.getElementById(`bannerTxUsage`);f&&(f.innerText=`↑ `+se(a));let p=document.getElementById(`bannerWanMode`),m=e.mobile&&e.mobile.cellular&&e.mobile.cellular.operator||`Jio True5G`;p&&(p.innerText=`USB 3.0 Tether (${m})`);let h=Date.now(),g=`0.0`,_=`0.0`;if(window._lastRxBytes!==void 0&&window._lastTxBytes!==void 0&&window._lastTs!==void 0){let e=(h-window._lastTs)/1e3;if(e>.3){let t=s>=window._lastRxBytes?s-window._lastRxBytes:0,n=c>=window._lastTxBytes?c-window._lastTxBytes:0;g=(t*8/(e*1e6)).toFixed(1),_=(n*8/(e*1e6)).toFixed(1)}}window._lastRxBytes=s,window._lastTxBytes=c,window._lastTs=h,window._clientRatePrev||(window._clientRatePrev=new Map),window._clientLiveRateMap||(window._clientLiveRateMap=new Map),window._clientLiveRxTxMap||(window._clientLiveRxTxMap=new Map),e.clients&&Array.isArray(e.clients)&&e.clients.forEach(e=>{if(!e||!e.ip)return;let t=Number(e.rx_bytes)||(parseFloat(e.rx_mb)||0)*1048576,n=Number(e.tx_bytes)||(parseFloat(e.tx_mb)||0)*1048576,r=t+n,i=window._clientRatePrev.get(e.ip);if(i&&i.ts){let a=(h-i.ts)/1e3;if(a>.3){let o=t>=i.rx?(t-i.rx)*8/(a*1e6):0,s=n>=i.tx?(n-i.tx)*8/(a*1e6):0,c=(r-i.bytes)*8/(a*1e6);window._clientLiveRateMap.set(e.ip,c),window._clientLiveRxTxMap.set(e.ip,{rx:o,tx:s}),window._clientRatePrev.set(e.ip,{bytes:r,rx:t,tx:n,ts:h})}}else{window._clientRatePrev.set(e.ip,{bytes:r,rx:t,tx:n,ts:h});let i=parseFloat(e.rx_mb)||0,a=parseFloat(e.tx_mb)||0;window._clientLiveRxTxMap.set(e.ip,{rx:i>500?12:i>50?4:i>5?1.5:.6,tx:a>500?8:a>50?2.5:a>5?1:.4})}});let v=document.getElementById(`bannerLiveRxSpeed`);v&&(v.innerText=`↓ ${g} Mbps`);let y=document.getElementById(`bannerLiveTxSpeed`);y&&(y.innerText=`↑ ${_} Mbps`),window._rxHistory||(window._rxHistory=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),window._txHistory||(window._txHistory=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),window._rxHistory.push(parseFloat(g)||0),window._txHistory.push(parseFloat(_)||0),window._rxHistory.length>20&&window._rxHistory.shift(),window._txHistory.length>20&&window._txHistory.shift(),ln(e,g,_),ce(window._rxHistory,window._txHistory),le(e.multilink,e.mobile,(parseFloat(g)||0)+(parseFloat(_)||0)),fe(e.multilink,e.adb_devices,e.mobile);let b=e.mobile||{},x=!!b.connected,S=b.cellular||{},C=Array.isArray(e.towers)?e.towers:[],w=document.getElementById(`backupDotsRow`),T=document.getElementById(`backupDotsCount`),E=document.getElementById(`topolServingName`),D=document.getElementById(`topolServingBand`),O=document.getElementById(`topolRsrp`),k=document.getElementById(`topolSinr`),A=document.getElementById(`topolCarrier`),j=document.getElementById(`topolArfcn`),M=document.getElementById(`topolTowerBadge`),N=document.getElementById(`conduitTowerPhone`),P=C.find(e=>e.is_serving)||{pci:S.pci||528,band:S.band||`n77`,freq:S.frequency||`3.5 GHz (C-Band)`,arfcn:S.arfcn||`634080`,rsrp_dbm:S.rsrp_dbm===void 0?-98:S.rsrp_dbm,sinr_db:S.sinr_db===void 0?11:S.sinr_db,carrier:S.operator||`Jio True5G`},F=C.filter(e=>!e.is_serving);if(x){T&&(T.innerText=F.length);function e(e,t){let n=parseFloat(e)||-104,r=String(t).includes(`28`)||String(t).includes(`700`),i;return i=r?1.2*10**((Math.abs(n)-95)/32):.8*10**((Math.abs(n)-95)/28),i<.4&&(i=.4),i>5.5&&(i=5.2),i.toFixed(1)+` km`}w&&(w.innerHTML=F.length>0?F.map((t,n)=>{let r=t.rsrp_dbm,i=t.sinr_db;if(r==null||r===0){let e=String(t.band).includes(`28`);r=e?-100-n%3*2:-104-n%4*3,i=e?10-n%3*2:7-n%3}let a=e(r,t.band);return`
                <div class="backup-dot-node" tabindex="0" title="Backup Tower PCI ${$(String(t.pci))} | ${$(String(t.band))} | ~${a}">
                  <span class="backup-dot-core"></span>
                  <div class="backup-dot-tooltip">
                    <div class="btt-header">
                      <span>PCI ${$(String(t.pci))}</span> • BACKUP
                    </div>
                    <div class="btt-line">
                      <span>BAND:</span>
                      <strong>${$(String(t.band))}</strong>
                    </div>
                    <div class="btt-line">
                      <span>ARFCN:</span>
                      <strong>${$(String(t.arfcn||`--`))}</strong>
                    </div>
                    <div class="btt-line">
                      <span>RSRP:</span>
                      <strong>${r} dBm</strong>
                    </div>
                    <div class="btt-line">
                      <span>SINR:</span>
                      <strong>${i} dB</strong>
                    </div>
                    <div class="btt-line">
                      <span>EST. DISTANCE:</span>
                      <strong style="color:var(--mh-emerald);">~${a}</strong>
                    </div>
                    <div class="btt-line">
                      <span>STATUS:</span>
                      <strong style="color:var(--mh-emerald);">${$(String(t.status||`Available`))}</strong>
                    </div>
                  </div>
                </div>
              `}).join(``):`<span style="color:var(--text-dim); font-size:9px;">None</span>`),E&&(E.innerText=`Tower PCI `+P.pci),D&&(D.innerText=P.band+` • `+(P.freq||`3.5 GHz`)),O&&(O.innerText=P.rsrp_dbm+` dBm`),k&&(k.innerText=P.sinr_db+` dB`),A&&(A.innerText=P.carrier||`Jio True5G`),j&&(j.innerText=P.arfcn||`634080`);let t=document.getElementById(`topolPaTemp`),n=P.pa_temp_c||S.pa_temp_c||49;t&&(t.innerHTML=`<span style="color:${ae(n)}">${n}°C</span>`);function r(e,t){let n=parseFloat(e)||-105,r=parseFloat(t)||8;return n>=-85&&r>=13?{label:`BEST`,cls:`emerald`}:n>=-99&&r>=10?{label:`STRONG`,cls:`emerald`}:n>=-106&&r>=5?{label:`GOOD`,cls:`cyan`}:n>=-114&&r>=0?{label:`NORMAL`,cls:`gold`}:{label:`LOW`,cls:`rose`}}if(M){let e=r(P.rsrp_dbm,P.sinr_db);M.className=`card-badge `+e.cls,M.innerHTML=`<span class="p-led" style="background:currentColor; box-shadow:0 0 6px currentColor; margin-right:4px;"></span><span>${e.label}</span>`}N&&(N.style.opacity=`1`)}else T&&(T.innerText=`0`),w&&(w.innerHTML=`<span style="color:var(--text-dim); font-size:9px;">--</span>`),E&&(E.innerText=`No Serving Cell`),D&&(D.innerText=`--`),O&&(O.innerText=`--`),k&&(k.innerText=`--`),A&&(A.innerText=`--`),j&&(j.innerText=`--`),M&&(M.className=`card-badge`,M.innerText=`OFFLINE`),N&&(N.style.opacity=`0.35`);let ee=b.battery||{},te=b.cpu||{},ne=b.memory||{},I=document.getElementById(`topolPhoneModel`),L=document.getElementById(`cellBandBadge`),R=document.getElementById(`topolPhoneCpu`),re=document.getElementById(`topolPhoneRam`),z=document.getElementById(`topolPhoneBatt`),ie=document.getElementById(`topolPhoneOs`),B=document.getElementById(`topolPhoneState`),ue=document.getElementById(`conduitPhoneRouter`);if(x){I&&(I.innerText=b.model||`5G Smartphone Modem`);let e=te.temp_c||36.6,t=ee.level===void 0?79:ee.level,n=ee.temp_c===void 0?32:ee.temp_c,r=`emerald`,i=`HEALTHY`;n>=44||e>=65?(r=`rose`,i=`CRITICAL`):(n>=39||e>=50)&&(r=`gold`,i=`WARM`),L&&(L.className=`card-badge `+r,L.innerText=i),R&&(R.innerHTML=`<span style="color:${ae(e)}">${e}°C</span>`);let a=ne.used_pct||48;re&&(re.innerHTML=`<span style="color:${oe(a)}">${a}%</span>`),z&&(z.innerHTML=`${t}% (<span style="color:${ae(n)}">${n}°C</span>)`);let o=document.getElementById(`topolPhoneUptime`);o&&(o.innerText=b.uptime||`--`);let s=document.getElementById(`topolPhoneLanIp`);s&&(s.innerText=b.lan_ip||window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`);let c=document.getElementById(`topolPhoneUsbIp`);c&&(c.innerText=b.usb_ip||`10.43.99.79`),ie&&(ie.innerText=b.os||`Android 16`),B&&(B.innerText=b.screen_state||`Online`),ue&&(ue.style.opacity=`1`)}else I&&(I.innerText=`Disabled / Disconnected`),L&&(L.className=`card-badge`,L.innerText=`DISABLED`),R&&(R.innerText=`--`),re&&(re.innerText=`--`),z&&(z.innerText=`--`),ie&&(ie.innerText=`--`),B&&(B.innerText=`Offline`),ue&&(ue.style.opacity=`0.35`);let de=e.router||{},V=e.network||{},pe=de.memory||{},me=de.storage||{},he=document.getElementById(`topolWanIp`);he&&(he.innerText=V.wan_ip||`10.43.99.139`);let ge=document.getElementById(`topolRouterIp`);ge&&(ge.innerText=V.lan_ip||`10.0.0.1`);let _e=document.getElementById(`topolRouterCpu`),ve=de.cpu_pct===void 0?14:de.cpu_pct;_e&&(_e.innerHTML=`<span style="color:${oe(ve)}">${ve}%</span>`);let ye=document.getElementById(`topolRouterRam`),be=pe.used_pct===void 0?47:pe.used_pct;ye&&(ye.innerHTML=`<span style="color:${oe(be)}">${be}%</span>`);let xe=document.getElementById(`topolRouterStorage`),Se=me.used_pct===void 0?16:me.used_pct;xe&&(xe.innerHTML=`<span style="color:${oe(Se)}">${Se}%</span>`);let Ce=document.getElementById(`topolRouterTemp`),we=de.temp_c||40.6;Ce&&(Ce.innerHTML=`<span style="color:${ae(we)}">${we}°C</span>`);let Te=document.getElementById(`topolRouterUptime`);Te&&(Te.innerText=de.uptime||`7h 5m`);let Ee=e.tailscale||{},De=document.getElementById(`topolTsBadge`),Oe=document.getElementById(`topolTsIp`);if(Ee.online||Ee.backend_state===`Running`?(De&&(De.className=`card-badge emerald`,De.innerText=`RUNNING`),Oe&&(Oe.innerText=Ee.ip||`100.107.94.6`)):(De&&(De.className=`card-badge`,De.innerText=(Ee.backend_state||`STOPPED`).toUpperCase()),Oe&&(Oe.innerText=`Offline`)),dn(V.ports||[]),e.lifetime_traffic){let t=e.lifetime_traffic,n=document.getElementById(`lifetimeDataVal`),r=document.getElementById(`lifetimeDownVal`),i=document.getElementById(`lifetimeUpVal`);n&&(n.textContent=t.lifetime_total_gb?t.lifetime_total_gb+` GB`:se(t.lifetime_total_bytes)),r&&(r.textContent=t.lifetime_rx_gb?t.lifetime_rx_gb+` GB`:se(t.lifetime_rx_bytes)),i&&(i.textContent=t.lifetime_tx_gb?t.lifetime_tx_gb+` GB`:se(t.lifetime_tx_bytes))}e.topology_layers&&!window._topologyLayersSavedLocally&&(window._topologyLayers=e.topology_layers,window._topoUiInitialized||(window._topoUiInitialized=!0,G(e.topology_layers))),o=e.clients||[],vn(o)}function dn(e){e&&e.length&&e.forEach(e=>{let t=e.id,n=document.getElementById(`mini-port-`+t),r=document.getElementById(`spd-`+t);if(n){if(e.status===`up`){if(n.classList.add(`active`),r){let t=e.speed||1e3;r.innerText=t>=1e3?`${t/1e3}G`:`${t}M`}}else n.classList.remove(`active`),r&&(r.innerText=`Down`)}})}async function fn(){try{let e=await(await p(`/cgi-bin/clients?action=list`)).json();n=new Set(Array.isArray(e)?e.map(e=>e.ip):[]),Tr(Array.isArray(e)?e:[])}catch(e){console.error(`fetchBlockedList error`,e)}}async function pn(){await fn(),B()}function mn(e){a=e,document.querySelectorAll(`#btnSortIp, #btnSortData, #btnSortName, .btn-sort`).forEach(e=>e.classList.remove(`active`)),e===`ip`&&document.getElementById(`btnSortIp`)?.classList.add(`active`),e===`data`&&document.getElementById(`btnSortData`)?.classList.add(`active`),e===`name`&&document.getElementById(`btnSortName`)?.classList.add(`active`),vn(o)}var hn=``;function gn(e){hn=(e||``).toLowerCase().trim();let t=document.getElementById(`dhcpSearchClearBtn`);t&&(t.style.display=hn?`inline-flex`:`none`),vn(o)}function _n(){let e=document.getElementById(`dhcpClientsSearchInput`);e&&(e.value=``,gn(``),e.focus())}function vn(e){let t=document.getElementById(`fullClientsCards`);if(!t)return;let r=(e||[]).length,i=document.getElementById(`dhcpClientsSearchInput`);if(i&&(i.placeholder=`Search from ${r} connected devices...`),!e||e.length===0){t.innerHTML=`<div style="text-align:center; color:var(--text-dim); padding:30px; font-size:12px;">No clients currently online or cached.</div>`;return}let o=e.filter(e=>e.connected!==!1).length,s=e.filter(e=>e.connected===!1).length,c=document.getElementById(`clientActiveCount`);c&&(c.innerText=`${o} ACTIVE`);let l=document.getElementById(`clientOfflineCount`);l&&(l.innerText=`${s} OFFLINE`);let u=document.getElementById(`clientBlockedCount`);u&&(u.innerText=`${n.size} BLOCKED`);let d=[...e];if(hn&&(d=d.filter(e=>{let t=(e.ip||``).toLowerCase(),n=(e.name||``).toLowerCase(),r=(e.mac||``).toLowerCase(),i=(e.port||``).toLowerCase();return t.includes(hn)||n.includes(hn)||r.includes(hn)||i.includes(hn)})),d.length===0){t.innerHTML=`<div style="text-align:center; color:var(--text-dim); padding:24px; font-size:12px;">No matching clients found for "`+$(hn)+`".</div>`;return}let f=d;if(a===`data`?f.sort((e,t)=>(t.total_bytes||0)-(e.total_bytes||0)):a===`name`?f.sort((e,t)=>(e.name||``).localeCompare(t.name||``)):a===`ip`?f.sort((e,t)=>{let n=(e.ip||``).split(`.`).map(e=>parseInt(e,10)||0),r=(t.ip||``).split(`.`).map(e=>parseInt(e,10)||0);for(let e=0;e<4;e++)if((n[e]||0)!==(r[e]||0))return(n[e]||0)-(r[e]||0);return 0}):f.sort((e,t)=>{let n=e.connected===!1?0:1,r=t.connected===!1?0:1;if(n!==r)return r-n;let i=e.timestamp||e.last_seen||e.time||e.expires||0,a=t.timestamp||t.last_seen||t.time||t.expires||0;if(i&&a&&i!==a)return a-i;let o=parseInt((e.ip||``).split(`.`)[3]||`0`,10);return parseInt((t.ip||``).split(`.`)[3]||`0`,10)-o}),window._currentDhcpClientDetail){let e=f.find(e=>e.ip===window._currentDhcpClientDetail);e&&wn(e)}t.innerHTML=f.map(e=>{let t=bn(e),n=yn(e),r=(e.vendor||``).trim();r&&r.toLowerCase()!==`unknown`&&r!==`NULL`||(r=`N/A`);let i=t.status===`Blocked`,a=n?`<div class="setting-label-bold" style="font-size:13.5px; line-height:1.3; display:flex; align-items:center; gap:6px; flex-wrap:wrap;"><span>${$(n)}</span>${i?`<span class="card-badge ruby" style="font-size:9px; font-weight:800; padding:2px 6px;">BLOCKED</span>`:``}</div>`:i?`<div style="margin-bottom:2px;"><span class="card-badge ruby" style="font-size:9px; font-weight:800; padding:2px 6px;">BLOCKED</span></div>`:``;return`
          <div class="setting-row-item setting-clickable-row" onclick="openDhcpClientDetail('${$(e.ip)}')" style="cursor:pointer; display:flex; align-items:center; gap:12px; padding:11px 14px;">
            <div style="display:flex; align-items:center; justify-content:center; width:18px; min-width:18px;">
              <span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:${t.color}; box-shadow:0 0 7px ${t.glow};" title="${t.status}"></span>
            </div>
            <div class="setting-label-col" style="flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;">
              ${a}
              <div style="font-size:12px; font-family:var(--font-mono); color:var(--text-muted); line-height:1.3;">${$(e.ip||`--`)}</div>
              <div style="font-size:11px; color:var(--text-dim); line-height:1.3;">${$(r)}</div>
            </div>
            <div class="setting-arrow-col" style="display:flex; align-items:center; gap:8px;">
              ${i?`<button type="button" class="mh-btn btn-sm" onclick="event.stopPropagation(); unblockDevice('${$(e.ip)}', '${$(e.mac)}');" style="background:#ef4444; color:#fff; font-weight:700; font-size:10.5px; padding:4px 9px; border-radius:5px;">UNBLOCK</button>`:``}
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        `}).join(``)}window.renderClientCards=vn,window._currentDhcpClientDetail=null;function yn(e){if(!e)return``;let t=[e.name,e.dns_name,e.mdns,e.netbios,e.llmnr];for(let n of t){if(!n)continue;let t=String(n).trim();if(t!==`*`&&t!==`?`&&t!==`NULL`&&t.toLowerCase()!==`device`&&t.toLowerCase()!==`unknown`&&t!==e.ip&&t!==`${e.ip}.lan`&&t!==`${e.ip}.local`)return t}return``}function bn(e){return e?n.has(e.ip)||e.blocked?{status:`Blocked`,color:`#ef4444`,glow:`rgba(239,68,68,0.4)`}:e.status===`conflict`||e.conflict?{status:`Conflict`,color:`#a855f7`,glow:`rgba(168,85,247,0.4)`}:e.is_static||e.is_reserved||e.reserved||window._staticLeases&&window._staticLeases.some(t=>t.ip===e.ip||t.mac&&e.mac&&t.mac.toLowerCase()===e.mac.toLowerCase())?{status:`Reserved`,color:`#3b82f6`,glow:`rgba(59,130,246,0.4)`}:e.status===`renewing`||e.renewing?{status:`Renewing`,color:`#f97316`,glow:`rgba(249,115,22,0.4)`}:e.status===`requesting`||e.requesting?{status:`Requesting`,color:`#eab308`,glow:`rgba(234,179,8,0.4)`}:e.connected===!1||e.status===`offline`?{status:`Offline`,color:`#71717a`,glow:`rgba(113,113,122,0.3)`}:{status:`Online`,color:`#10b981`,glow:`rgba(16,185,129,0.4)`}:{status:`Offline`,color:`#71717a`,glow:`rgba(113,113,122,0.3)`}}function xn(e){if(!e)return!1;let t=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||window.location.hostname||`10.0.0.1`,n=(window._lastDataCache&&Array.isArray(window._lastDataCache.clients)?window._lastDataCache.clients:o).find(e=>e&&(e.is_self||e.port&&e.port.toLowerCase().includes(`local`))),r=n&&n.mac?n.mac.toLowerCase():``;return!!(e.is_self||e.ip&&(e.ip===t||e.ip===window.location.hostname||e.ip===`127.0.0.1`||n&&e.ip===n.ip)||e.mac&&r&&e.mac.toLowerCase()===r||e.port&&e.port.toLowerCase().includes(`local`)||e.name&&e.name.toLowerCase().includes(`gateway (host)`))}function Sn(e,t=!0){if(!e)return;window._currentDhcpClientDetail=e;let n=document.getElementById(`dhcpClientsListView`),r=document.getElementById(`dhcpClientDetailView`);n&&(n.style.display=`none`),r&&(r.style.display=`flex`);let i=(o||[]).find(t=>t.ip===e)||{ip:e},a=yn(i)||i.ip,s=document.getElementById(`settingsDetailNavTitle`);if(s&&(s.textContent=a),wn(i),t)try{history.pushState({tab:`settings`,page:`dhcp-client-detail`,clientIp:e},``,`#setting=acc-lan-clients&client=`+encodeURIComponent(e))}catch{}}function Cn(e=!0){if(!window._currentDhcpClientDetail)return;window._currentDhcpClientDetail=null;let t=document.getElementById(`dhcpClientsListView`),n=document.getElementById(`dhcpClientDetailView`);n&&(n.style.display=`none`),t&&(t.style.display=`flex`);let r=document.getElementById(`settingsDetailNavTitle`);if(r&&(r.textContent=`DHCP Clients`),e&&window.location.hash.includes(`&client=`))try{history.back()}catch{}}function wn(e){let t=document.getElementById(`dhcpClientDetailView`);if(!t)return;let r=xn(e),i=bn(e),a=yn(e),o=(e.vendor||``).trim();o&&o.toLowerCase()!==`unknown`&&o!==`NULL`||(o=`N/A`);let s=se(e.total_bytes),c=se(e.rx_bytes),l=se(e.tx_bytes),u=n.has(e.ip)||e.blocked;t.innerHTML=`
        <!-- SUMMARY STRIP (MATCHING SYSTEM INFO SINGLE ROW TELEMETRY) -->
        <div class="setting-row-item" style="padding:10px 14px;">
          <div class="setting-label-col">
            <span class="setting-label-bold" style="font-size:13.5px;">${$(a||e.ip)}</span>
            <span class="setting-label-sub">${$(o)} &bull; ${$(e.port||`LAN Interface`)}</span>
          </div>
          <div class="setting-control-col">
            <span style="color:${i.color}; font-size:11px; font-weight:700; font-family:var(--font-mono); display:inline-flex; align-items:center; gap:5px;">
              <span style="width:6px; height:6px; border-radius:50%; background:${i.color}; display:inline-block;"></span>
              ${i.status.toUpperCase()}
            </span>
          </div>
        </div>

        <!-- SECTION 1: INTERNET & DATA USAGE -->
        <div class="setting-section-header">Internet &amp; Data Traffic</div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Total Data Consumption</span>
            <span class="setting-label-sub">Cumulative gateway transfer recorded for this client</span>
          </div>
          <div class="setting-control-col">
            <span style="font-size:12.5px; font-weight:700; font-family:var(--font-mono); color:var(--text-main);">${s}</span>
          </div>
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Download Traffic (Rx)</span>
            <span class="setting-label-sub">Packets received from internet through router</span>
          </div>
          <div class="setting-control-col">
            <span style="font-size:12px; font-family:var(--font-mono); color:var(--text-dim);">&darr; ${c}</span>
          </div>
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Upload Traffic (Tx)</span>
            <span class="setting-label-sub">Packets transmitted to internet through router</span>
          </div>
          <div class="setting-control-col">
            <span style="font-size:12px; font-family:var(--font-mono); color:var(--text-dim);">&uarr; ${l}</span>
          </div>
        </div>

        <!-- SECTION 2: DEVICE TELEMETRY & ADDRESSING -->
        <div class="setting-section-divider"></div>
        <div class="setting-section-header">Network Addressing &amp; Identifiers</div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">IPv4 Address</span>
            <span class="setting-label-sub">${$(e.ip)} &bull; Subnet mask: 255.255.255.0</span>
          </div>
          <div class="setting-control-col">
            <button type="button" class="round-action-btn" title="Copy IPv4 Address" onclick="copyClientText('${$(e.ip)}')">
              <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">IPv6 Global / Link-Local</span>
            <span class="setting-label-sub">${e.ipv6?$(e.ipv6):`Not Assigned (IPv4 Only)`}</span>
          </div>
          ${e.ipv6?`
          <div class="setting-control-col">
            <button type="button" class="round-action-btn" title="Copy IPv6 Address" onclick="copyClientText('${$(e.ipv6)}')">
              <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>`:``}
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">MAC Address &amp; Hardware</span>
            <span class="setting-label-sub">${$(e.mac||`--`)} &bull; Vendor: ${$(o)}</span>
          </div>
          <div class="setting-control-col">
            <button type="button" class="round-action-btn" title="Copy MAC Address" onclick="copyClientText('${$(e.mac||``)}')">
              <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Network Discovery Names</span>
            <span class="setting-label-sub">DNS: ${$(e.dns_name||`N/A`)} &bull; mDNS: ${$(e.mdns||`N/A`)} &bull; NetBIOS: ${$(e.netbios||`N/A`)}</span>
          </div>
        </div>

        <!-- SECTION 3: ACCESS CONTROLS & RESERVATION -->
        <div class="setting-section-divider"></div>
        <div class="setting-section-header">Access Policies &amp; Static Lease</div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Internet Access Policy</span>
            <span class="setting-label-sub">${r?`Core router system gateway (Protected host, cannot be blocked)`:u?`Device is blocked by firewall from routing traffic`:`Device has unrestricted LAN and internet access`}</span>
          </div>
          <div class="setting-control-col">
            ${r?``:u?`<button class="mh-btn btn-sm btn-ghost" onclick="unblockDevice('${$(e.ip)}', '${$(e.mac)}'); setTimeout(() => openDhcpClientDetail('${$(e.ip)}', false), 600);">UNBLOCK</button>`:`<button class="mh-btn btn-sm btn-danger" onclick="blockDevice('${$(e.ip)}', '${$(e.mac)}', '${$(a||e.ip)}'); setTimeout(() => openDhcpClientDetail('${$(e.ip)}', false), 600);">BLOCK</button>`}
          </div>
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Static IP Reservation</span>
            <span class="setting-label-sub">${r?`Permanently bound to master network bridge interface (br-lan)`:`Bind ${$(e.ip)} to MAC ${$(e.mac||`--`)} permanently`}</span>
          </div>
          <div class="setting-control-col">
            ${r?``:`<button type="button" class="round-action-btn" title="Reserve Static Lease" onclick="reserveClientStaticLease('${$(e.ip)}', '${$(e.mac)}', '${$(a||``)}')">
                   <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                 </button>`}
          </div>
        </div>
      `}function Tn(e){e&&(navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(e).then(()=>{Q(`Copied ${e} to clipboard`,`success`)}):Qs(e))}async function En(e,t,n){if(xn({ip:e,mac:t,name:n}))typeof Q==`function`&&Q(`Gateway IP is already statically assigned to br-lan.`,`info`);else if(e&&t)try{let r=await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`add_lease`,name:n||`client`,mac:t,ip:e})})).json();r.status===`ok`?(Q(`Reserved ${e} for ${n||t}`,`success`),typeof Va==`function`&&Va(),typeof B==`function`&&B()):Q(`Failed to reserve IP: `+(r.message||`error`),`error`)}catch(e){Q(`Reservation error: `+e.message,`error`)}}function Dn(){let e=(window._lastDataCache&&Array.isArray(window._lastDataCache.clients)?window._lastDataCache.clients:Array.isArray(window._lastClientsCache)?window._lastClientsCache:[]).filter(e=>e&&e.ip&&!xn(e)&&!e.is_tether&&(!e.port||!e.port.toLowerCase().includes(`tether`))),t=new Map;return e.forEach(e=>{t.has(e.ip)||t.set(e.ip,e)}),Array.from(t.values())}window._topoTree=null,window._topoCollapsed=new Set,window._topoActiveLayer=`all`;var On={live:`Live bridge & Wi-Fi discovery`,mac:`MAC address map`,ip:`IP / DHCP neighbor map`,wireless:`Wi-Fi associations only`,manual:`Manual topology`};function kn(e=window._topoTree){let t=localStorage.getItem(`maxnet_topo_auto_mode`)===`false`?`manual`:`live`,n=e?.discovery_mode||localStorage.getItem(`maxnet_topology_discovery_mode`)||t;return Object.prototype.hasOwnProperty.call(On,n)?n:`live`}function An(){let e=document.getElementById(`topologyDiscoveryModeSummary`);e&&(e.textContent=On[kn()]||On.live)}function jn(e){Object.prototype.hasOwnProperty.call(On,e)&&(window._topoTree||(window._topoTree=Fn()),window._topoTree.discovery_mode=e,localStorage.setItem(`maxnet_topology_discovery_mode`,e),localStorage.removeItem(`maxnet_topo_auto_mode`),An(),e!==`manual`&&In(window._topoTree,window._lastDataCache),G(window._topoTree),typeof U==`function`&&U(),W(),typeof Q==`function`&&Q(`Topology type: ${On[e]}`,`success`))}window.setTopologyDiscoveryMode=jn;function Mn(e){e&&(e.locked=!0,e.child&&(e.child.manual=!0))}function Nn(e){function t(n){for(let r of n?.ports||[]){if(r.child?.id===e)return Mn(r),!0;if(r.child&&r.child.type!==`device`&&t(r.child))return!0}return!1}window._topoTree&&t(window._topoTree)}function Pn(e,t){let n=String(t?.mac||t?.ip||``).trim().toLowerCase();n&&(Array.isArray(e.discovery_exclusions)||(e.discovery_exclusions=[]),e.discovery_exclusions.includes(n)||e.discovery_exclusions.push(n))}function Fn(e,t){return{id:`root`,type:`router`,name:`MAXNET`,ip:e||`10.0.0.1`,mac:t||`52:5a:4e:e9:61:a0`,uplinkPort:null,numPorts:4,wan_mode:`standard`,wan_speed:`1000`,usb_config:{mode:`hub`,num_ports:0,speed_std:`usb3`,ports:[]},ports:[{id:`root-lan1`,label:`LAN 1`,role:`empty`,child:null},{id:`root-lan2`,label:`LAN 2`,role:`empty`,child:null},{id:`root-lan3`,label:`LAN 3`,role:`empty`,child:null},{id:`root-lan4`,label:`LAN 4`,role:`empty`,child:null}],wireless_clients:[]}}function In(e,t){if(!e||!t)return;let n=Array.isArray(t.clients)?t.clients.filter(e=>!e.is_self):[],r=Array.isArray(t.wifi_clients)?t.wifi_clients:[],i=Array.isArray(t.usb_devices)?t.usb_devices:[];t.network&&(t.network.wan_speed&&(e.wan_speed=String(t.network.wan_speed)),t.network.ports&&t.network.ports.wan&&(e.wan_carrier=!!t.network.ports.wan.carrier,e.wan_speed=String(t.network.ports.wan.speed||e.wan_speed||`1000`)));let a=kn(e);if(a===`manual`)return;a!==`wireless`&&Array.isArray(e.ports)&&e.ports.forEach((e,t)=>{if(e.locked||e.child&&(e.child.manual||e.child.isCustom))return;let r=t+1,i=`LAN ${r}`,o=n.filter(e=>e.connected&&(e.port===i||e.port===`lan${r}`)),s=a===`mac`?o.filter(e=>e.mac):o,c=e.child?a===`ip`?e.child.ip:e.child.mac:``,l=s.find(e=>c&&String(a===`ip`?e.ip:e.mac||``).toLowerCase()===String(c).toLowerCase())||s[0];l?l.device_type===`router`||l.device_type===`switch`||l.device_type===`ap`||/router|switch|repeater|access point|mesh|gateway|maxnet/i.test(l.name||``)||/router|switch|repeater/i.test(l.model||``)?(e.role=`node`,!e.child||e.child.mac!==l.mac?e.child={id:`node-lan${r}-${(l.mac||``).replace(/[:]/g,``)}`,type:l.device_type||(/switch/i.test(l.name)?`switch`:`router`),name:l.name||l.dns_name||`Sub-Switch`,ip:l.ip||``,mac:l.mac||``,uplinkPort:e.id,numPorts:4,ports:[{id:`node-lan${r}-p1`,label:`Port 1`,role:`empty`,child:null},{id:`node-lan${r}-p2`,label:`Port 2`,role:`empty`,child:null},{id:`node-lan${r}-p3`,label:`Port 3`,role:`empty`,child:null},{id:`node-lan${r}-p4`,label:`Port 4`,role:`empty`,child:null}]}:(e.child.name=l.name||l.dns_name||e.child.name,e.child.ip=l.ip||e.child.ip)):(e.role=`device`,!e.child||e.child.mac!==l.mac?e.child={id:`dev-lan${r}-${(l.mac||``).replace(/[:]/g,``)}`,type:`device`,name:l.name||l.dns_name||`Device`,ip:l.ip||``,mac:l.mac||``,status:`online`,uplinkPort:e.id}:(e.child.name=l.name||l.dns_name||e.child.name,e.child.ip=l.ip||e.child.ip,e.child.status=`online`)):e.role!==`device`&&e.role!==`node`||e.child&&e.child.isCustom||(e.role=`empty`,e.child=null)}),Array.isArray(e.wireless_clients)||(e.wireless_clients=[]);let o=[];if(n.forEach(e=>{(e.port===`WiFi`||e.conn_type&&e.conn_type.includes(`WiFi`)||e.is_wifi||!e.port?.startsWith(`LAN `)&&e.port!==`LOCAL (Router)`)&&e.connected===!0&&o.push(e)}),r.forEach(e=>{o.some(t=>t.mac&&t.mac.toLowerCase()===(e.mac||``).toLowerCase())||o.push(e)}),o.forEach(t=>{let n=String(t.mac||t.ip||``).toLowerCase();if(Array.isArray(e.discovery_exclusions)&&e.discovery_exclusions.includes(n))return;let r=e.wireless_clients.find(e=>t.mac&&e.mac&&e.mac.toLowerCase()===t.mac.toLowerCase()||!t.mac&&t.ip&&e.ip===t.ip);r?(r.status=`online`,r.manual||(r.name=t.name||r.name||`Wi-Fi Device`,r.ip=t.ip||r.ip,r.band=t.band||r.band||`2.4G`,r.linkSpeed=t.link_speed||r.linkSpeed||`144 Mbps`)):e.wireless_clients.push({id:`wdev-${(t.mac||``).replace(/[:]/g,``)}`,name:t.name||`Wi-Fi Device`,ip:t.ip||``,mac:t.mac||``,status:`online`,band:t.band||`2.4G`,linkSpeed:t.link_speed||`144 Mbps`,discovered:!0})}),e.wireless_clients=e.wireless_clients.filter(e=>e.manual?!0:o.some(t=>t.mac&&e.mac&&t.mac.toLowerCase()===e.mac.toLowerCase()||!t.mac&&t.ip&&e.ip===t.ip)),e.usb_config&&!e.usb_config.locked){let t=[];i.forEach((e,n)=>{if(e.status===`online`||e.product||e.connected){let r=e.device_type===`storage`||e.device_type===`ssd`||e.device_type===`pendrive`||e.has_storage;t.push({id:`usb-${n+1}`,label:`USB ${n+1}`,role:r?`storage`:`phone`,name:e.product||(r?`NVMe SSD Storage`:`USB 3.0 Mobile Modem`),speed:e.speed_mbps&&e.speed_mbps<1e3?`usb2`:`usb3`})}}),e.usb_config.ports=t,e.usb_config.num_ports=t.length}}function Ln(e,t,n){if(!e)return Fn(t,n);if(e.tree&&e.tree.id===`root`){let t=JSON.parse(JSON.stringify(e.tree));return t.ip&&(t.ip=String(t.ip).split(/[\s,]+/)[0].replace(/\/\d+$/,``)),Rn(t),t}if(e.id===`root`&&Array.isArray(e.ports)){let t=JSON.parse(JSON.stringify(e));return t.ip&&(t.ip=String(t.ip).split(/[\s,]+/)[0].replace(/\/\d+$/,``)),Rn(t),t}let r=e.ports||e,i=Fn(t,n);return r&&typeof r==`object`&&[1,2,3,4].forEach(e=>{let t=`lan`+e,n=r[t];if(!n)return;let a=i.ports[e-1];if(a){if(n.mode===`empty`)a.role=`empty`,a.child=null;else if(n.mode===`direct`&&n.device)a.role=`device`,a.child={id:`dev-`+e+`-`+Date.now().toString(36),type:`device`,name:n.device.name||`Device`,ip:n.device.ip||``,mac:n.device.mac||``,uplinkPort:a.id};else if(n.mode===`layer2_ap`){a.role=`node`;let t=n.ap||{},r={id:`node-`+(t.name?t.name.replace(/\s+/g,`-`).toLowerCase():`ap-`+e),type:`ap`,name:t.name||`Access Point`,ip:t.ip||`10.0.0.2`,mac:t.mac||``,uplinkPort:a.id,numPorts:4,ports:[],wireless_clients:[]};for(let e=1;e<=4;e++)r.ports.push({id:r.id+`-lan`+e,label:`LAN `+e,role:`empty`,child:null});let i=Array.isArray(n.layer3_devices)?n.layer3_devices:[],o=0;i.forEach((e,t)=>{let n=e.conn_type&&(e.conn_type.includes(`WiFi`)||e.conn_type.includes(`wifi`)||e.conn_type.includes(`GHz`)),i=!!(e.is_router||e.name&&e.name.toLowerCase().includes(`router`)||e.conn_type===`Router / Sub-AP`);if(n&&!i)r.wireless_clients.push({name:e.name||`Wireless Client`,ip:e.ip||``,mac:e.mac||``,band:e.conn_type&&e.conn_type.includes(`5G`)?`5G`:`2.4G`,linkSpeed:e.link_speed||(e.conn_type&&e.conn_type.includes(`5G`)?`433 Mbps`:`72 Mbps`)});else if(i){if(o<r.ports.length){let n=r.ports[o++];n.role=`node`;let i={id:`node-sub-`+t,type:`router`,name:e.name||`Sub-Router`,ip:e.ip||``,mac:e.mac||``,uplinkPort:n.id,numPorts:4,ports:[],wireless_clients:[]};for(let e=1;e<=4;e++)i.ports.push({id:i.id+`-lan`+e,label:`LAN `+e,role:`empty`,child:null});n.child=i}}else if(o<r.ports.length){let n=r.ports[o++];n.role=`device`,n.child={id:`dev-l3-`+t,type:`device`,name:e.name||`Wired Client`,ip:e.ip||``,mac:e.mac||``,uplinkPort:n.id}}}),a.child=r}}}),Rn(i),i}function Rn(e){if(e&&typeof e==`object`&&(e.id||(e.id=`node-`+Math.random().toString(36).substr(2,6)),e.type||(e.type=e.id===`root`?`router`:`device`),e.id===`root`&&(e.wan_mode||(e.wan_mode=`standard`),e.wan_speed||(e.wan_speed=`1000`),e.usb_config&&typeof e.usb_config==`object`||(e.usb_config={mode:`hub`,num_ports:0,speed_std:`usb3`,ports:[]})),e.type!==`device`)){for((!e.numPorts||typeof e.numPorts!=`number`||e.numPorts<1)&&(e.numPorts=Array.isArray(e.ports)&&e.ports.length>0?e.ports.length:4),e.numPorts>48&&(e.numPorts=48),Array.isArray(e.ports)||(e.ports=[]);e.ports.length<e.numPorts;){let t=e.ports.length+1;e.ports.push({id:e.id+`-lan`+t,label:`LAN `+t,role:`empty`,child:null})}e.ports.length>e.numPorts&&(e.ports=e.ports.slice(0,e.numPorts)),e.ports.forEach((t,n)=>{t.id||(t.id=e.id+`-lan`+(n+1)),t.label||(t.label=`LAN `+(n+1)),t.role||(t.role=t.child?t.child.type===`device`?`device`:`node`:`empty`),t.child&&(t.child.uplinkPort=t.id,Rn(t.child))}),Array.isArray(e.wireless_clients)||(e.wireless_clients=[])}}function zn(e,t){let n=new Set;function r(e){e&&(e.ip&&e.id!==t&&n.add(e.ip.trim()),Array.isArray(e.wireless_clients)&&e.wireless_clients.forEach((r,i)=>{let a=e.id+`-wifi-`+i;r.ip&&a!==t&&n.add(r.ip.trim())}),Array.isArray(e.ports)&&e.ports.forEach(e=>{e.child&&(e.child.type===`device`?e.child.ip&&e.id!==t&&e.child.id!==t&&n.add(e.child.ip.trim()):r(e.child))}))}return r(e),n}function Bn(e,t){if(!e)return null;if(e.id===t)return e;if(Array.isArray(e.ports)){for(let n of e.ports)if(n.child){if(n.child.id===t)return n.child;let e=Bn(n.child,t);if(e)return e}}return null}function Vn(e,t){if(!e)return null;if(Array.isArray(e.ports))for(let n of e.ports){if(n.id===t)return{port:n,parentNode:e};if(n.child&&n.child.type!==`device`){let e=Vn(n.child,t);if(e)return e}}return null}function Hn(e){if(!e)return{valid:!1,error:`Empty topology tree`};let t=new Map,n=null;function r(e,r){if(!e)return;let i=e.trim();if(i)return t.has(i)?(n=`Duplicate IP address ${i} used by "${r}" and "${t.get(i)}"`,!1):(t.set(i,r),!0)}function i(e,t){if(n||!e)return;let a=`${e.name||e.type} (${t})`;e.ip&&r(e.ip,a),n||(Array.isArray(e.wireless_clients)&&e.wireless_clients.forEach((i,a)=>{n||r(i.ip,`Wireless Client ${i.name||a+1} on ${e.name||t}`)}),n||Array.isArray(e.ports)&&e.ports.forEach((e,a)=>{n||(e.role===`device`&&e.child?r(e.child.ip,`Device ${e.child.name||`Device`} on ${t} -> ${e.label}`):e.role===`node`&&e.child&&i(e.child,`${t} -> ${e.label}`))}))}return i(e,e.name||`Root Router`),n?{valid:!1,error:n}:{valid:!0}}function Un(e){let t={};return[1,2,3,4].forEach(n=>{let r=`lan`+n,i=e&&e.ports&&e.ports[n-1]||null;if(!i||i.role===`empty`||!i.child)t[r]={portIndex:n,mode:`empty`,device:null};else if(i.role===`device`)t[r]={portIndex:n,mode:`direct`,device:{name:i.child.name||`Direct Client`,ip:i.child.ip||``,mac:i.child.mac||``}};else if(i.role===`node`){let e=i.child,a=[];Array.isArray(e.ports)&&e.ports.forEach(e=>{e.role===`device`&&e.child?a.push({name:e.child.name||`Wired Device`,ip:e.child.ip||``,mac:e.child.mac||``,conn_type:`LAN Port`}):e.role===`node`&&e.child&&a.push({name:e.child.name||`Cascaded Router`,ip:e.child.ip||``,mac:e.child.mac||``,conn_type:`Router / Sub-AP`,is_router:!0})}),Array.isArray(e.wireless_clients)&&e.wireless_clients.forEach(e=>{a.push({name:e.name||`Wireless Device`,ip:e.ip||``,mac:e.mac||``,conn_type:e.band===`5G`?`5GHz WiFi`:`2.4GHz WiFi`})}),t[r]={portIndex:n,mode:`layer2_ap`,ap:{name:e.name||`Access Point`,ip:e.ip||``,mac:e.mac||``,model:e.type===`switch`?`Ethernet Switch`:`Access Point`},layer3_devices:a}}}),t}function Wn(e,t){return!e.usb_config||!Array.isArray(e.usb_config.ports)||e.usb_config.ports.length===0?`
          <div style="font-size:11.5px; color:var(--text-dim); padding:10px 14px; font-style:italic; background:rgba(255,255,255,0.02); border-radius:6px; margin:6px 0;">
            No external USB devices detected on host port.
          </div>
        `:e.usb_config.ports.map((e,t)=>{let n=e.role&&e.role!==`empty`,r=e.role===`phone`,i=e.role===`storage`,a=e.role===`tailscale`,o=e.speed===`usb3`||!e.speed&&t!==1,s=o?`5 Gbps (SuperSpeed)`:`480 Mbps (HighSpeed)`,c=`Empty / Disconnected Port`;return r?c=`Tethered Phone / 5G Modem &bull; ${$(e.name||`Cellular Modem`)} &bull; ${s}`:i?c=`External NVMe/SSD Storage &bull; ${$(e.name||`Storage Drive`)} &bull; ${s}`:a?c=`Remote Tailscale / WireGuard Node &bull; ${$(e.name||`Mesh Peer`)}`:n&&(c=`Connected USB Peripheral &bull; ${$(e.name||`USB Device`)} &bull; ${s}`),`
          <div class="setting-row-item" id="topoUsbRow_${$(e.id||`usb-`+(t+1))}" style="flex-direction:column; align-items:stretch; gap:8px; border-bottom:1px solid rgba(255,255,255,0.035); padding:10px 14px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <div class="setting-label-col" style="flex:1; min-width:0;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="setting-label-bold" style="color:#38bdf8; font-weight:700;">${$(e.label||`USB `+(t+1))}</span>
                  <span class="card-badge" style="font-size:8.5px; ${o?`color:#38bdf8; border-color:#38bdf8;`:`color:#a1a1aa; border-color:#a1a1aa;`}">${o?`USB 3.0 (5 Gbps)`:`USB 2.0 (480 Mbps)`}</span>
                </div>
                <span class="setting-label-sub">${c}</span>
              </div>
              ${n?`
                <button type="button" class="topo-remove-btn" onclick="onUsbPortChange(${t}, 'role', 'empty')" title="Disconnect USB Port">
                  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span>Remove</span>
                </button>
              `:``}
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; width:100%;">
              <select class="mh-input" onchange="onUsbPortChange(${t}, 'role', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                <option value="empty" ${e.role===`empty`?`selected`:``}>Empty (Disconnected)</option>
                <option value="phone" ${e.role===`phone`?`selected`:``}>Tethered Phone / 5G Modem (5 Gbps)</option>
                <option value="storage" ${e.role===`storage`?`selected`:``}>External NVMe/SSD Storage (5 Gbps)</option>
                <option value="tailscale" ${e.role===`tailscale`?`selected`:``}>Tailscale / WireGuard Remote Node</option>
                <option value="device" ${e.role===`device`||e.role===`custom`?`selected`:``}>Custom USB Peripheral</option>
              </select>

              ${n?`
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; width:100%;">
                  <input type="text" class="mh-input" placeholder="Device Label" value="${$(e.name||``)}" oninput="onUsbPortChange(${t}, 'name', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                  <select class="mh-input" onchange="onUsbPortChange(${t}, 'speed', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                    <option value="usb3" ${o?`selected`:``}>USB 3.0 (5 Gbps SuperSpeed)</option>
                    <option value="usb2" ${o?``:`selected`}>USB 2.0 (480 Mbps HighSpeed)</option>
                  </select>
                </div>
              `:``}
            </div>
          </div>
        `}).join(``)}function Gn(e){window._topoTree&&(window._topoTree.wan_mode=e,W(),G(window._topoTree),typeof U==`function`&&U())}function Kn(e){window._topoTree&&(window._topoTree.wan_speed=e,W(),G(window._topoTree),typeof U==`function`&&U())}function qn(e){window._topoTree&&(window._topoTree.usb_config||(window._topoTree.usb_config={mode:e,num_ports:4,ports:[]}),window._topoTree.usb_config.mode=e,W(),G(window._topoTree),typeof U==`function`&&U())}function Jn(e){if(!window._topoTree)return;(isNaN(e)||e<0)&&(e=0),e>8&&(e=8),window._topoTree.usb_config||(window._topoTree.usb_config={mode:`hub`,num_ports:e,ports:[]});let t=window._topoTree.usb_config;for(t.locked=!0,t.num_ports=e,t.ports=t.ports||[];t.ports.length<e;){let e=t.ports.length+1;t.ports.push({id:`usb-`+e,label:`USB `+e,role:`empty`,name:``,speed:`usb3`})}t.ports.length>e&&(t.ports=t.ports.slice(0,e)),W(),G(window._topoTree),typeof U==`function`&&U()}function Yn(e,t,n){if(!window._topoTree||!window._topoTree.usb_config)return;let r=window._topoTree.usb_config;Array.isArray(r.ports)&&r.ports[e]&&(r.locked=!0,r.ports[e][t]=n,t===`role`&&n===`empty`?r.ports[e].name=``:t===`role`&&n===`phone`&&!r.ports[e].name?(r.ports[e].name=`Samsung Galaxy S21 FE 5G`,r.ports[e].speed=`usb3`):t===`role`&&n===`storage`&&!r.ports[e].name&&(r.ports[e].name=`NVMe SSD Storage`,r.ports[e].speed=`usb3`),W(),G(window._topoTree),typeof U==`function`&&U())}var Xn=null;function W(){clearTimeout(Xn),Xn=setTimeout(()=>{hr(!0)},350)}function Zn(e,t){if(!window._topoTree)return;let n=Bn(window._topoTree,e);if(!n||n.type===`device`)return;let r=parseInt(t,10);(isNaN(r)||r<1)&&(r=1),r>48&&(r=48),n.numPorts=r,n.manual=!0,Nn(e),Rn(n),W(),G(window._topoTree),typeof U==`function`&&U()}function Qn(e,t){if(!window._topoTree)return;let n=Vn(window._topoTree,e);if(!n)return;let{port:r}=n;if(r.role=t,r.locked=!0,t===`empty`)r.child=null;else if(t===`device`)r.child={id:`dev-`+Date.now().toString(36),type:`device`,manual:!0,name:`New device`,ip:``,mac:``,uplinkPort:r.id};else if(t===`node`){let e={id:`node-`+Date.now().toString(36),type:`router`,manual:!0,name:`New router`,ip:``,mac:``,uplinkPort:r.id,numPorts:4,ports:[],wireless_clients:[]};for(let t=1;t<=4;t++)e.ports.push({id:e.id+`-lan`+t,label:`LAN `+t,role:`empty`,child:null});r.child=e}Mn(r),W(),G(window._topoTree),typeof U==`function`&&U()}function $n(e,t){if(!window._topoTree)return;let n=Vn(window._topoTree,e);if(!n||!n.port.child)return;let r=n.port.child;if(t===`__manual__`){Mn(n.port),G(window._topoTree);return}let i=Dn().find(e=>e.ip===t);i?(r.name=i.name||i.model||`Device`,r.ip=i.ip||``,r.mac=i.mac||``):t&&(r.ip=t),Mn(n.port),W(),G(window._topoTree),typeof U==`function`&&U()}function er(e,t,n){if(!window._topoTree)return;let r=Vn(window._topoTree,e);r&&r.port.child&&(r.port.child[t]=n,Mn(r.port),or(),W(),typeof U==`function`&&U())}function tr(e,t){if(!window._topoTree)return;let n=Vn(window._topoTree,e);if(!n||!n.port.child)return;let r=n.port.child,i=Dn().find(e=>e.ip===t);i?(r.name=i.name||`Access Point`,r.ip=i.ip||``,r.mac=i.mac||``):t&&(r.ip=t),Mn(n.port),W(),G(window._topoTree),typeof U==`function`&&U()}function nr(e,t,n){if(!window._topoTree)return;let r=Bn(window._topoTree,e);r&&(r[t]=n,r.manual=!0,Nn(e),or(),W(),typeof U==`function`&&U())}function rr(e){if(!window._topoTree)return;let t=Bn(window._topoTree,e);if(!t)return;Array.isArray(t.wireless_clients)||(t.wireless_clients=[]);let n=Dn(),r=zn(window._topoTree),i=n.find(e=>!r.has(e.ip))||{name:`WiFi Device`,ip:``,mac:``};t.wireless_clients.push({name:i.name||`Wireless Device`,ip:i.ip||``,mac:i.mac||``,band:`5G`,linkSpeed:`433 Mbps`,manual:!0}),W(),G(window._topoTree),typeof U==`function`&&U()}function ir(e,t){if(!window._topoTree)return;let n=Bn(window._topoTree,e);n&&Array.isArray(n.wireless_clients)&&(Pn(n,n.wireless_clients[t]),n.wireless_clients.splice(t,1),W(),G(window._topoTree),typeof U==`function`&&U())}function ar(e,t,n,r){if(!window._topoTree)return;let i=Bn(window._topoTree,e);if(!i||!Array.isArray(i.wireless_clients)||!i.wireless_clients[t])return;let a=i.wireless_clients[t];if(a.manual=!0,a[n]=r,n===`ip`){let e=Dn().find(e=>e.ip===r);e&&(a.name&&a.name!==`Wireless Device`||(a.name=e.name||`WiFi Device`),a.mac=e.mac||``)}or(),W(),typeof U==`function`&&U()}function or(){let e=document.getElementById(`topoValidationNotice`),t=document.getElementById(`btnSaveTopo`);if(!e||!window._topoTree)return;let n=Hn(window._topoTree);n.valid?(e.style.display=`none`,e.innerHTML=``,t&&(t.disabled=!1)):(e.style.display=`flex`,e.className=`topo-validation-box invalid`,e.innerHTML=`
          <svg class="svg-icon" viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span><strong>Validation Warning:</strong> ${$(n.error||`Duplicate or invalid IP address detected.`)}</span>
        `,t&&(t.disabled=!0))}function sr(){let e=document.getElementById(`topoPreferencesSection`);if(!e)return;let t=Vt();e.innerHTML=`
        <div class="setting-section-header" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="toggleTopoPreferences()">
          <div style="display:flex; align-items:center; gap:8px;">
            <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Topology Preferences</span>
          </div>
          <svg id="topoPrefsChevron" class="svg-icon acc-chevron" viewBox="0 0 24 24" style="width:14px; height:14px; transition:transform 0.2s; ${window._topoPrefsOpen?`transform:rotate(180deg);`:``}"><polyline points="6 9 12 15 18 9"/></svg>
        </div>

        <div id="topoPrefsBody" style="display:${window._topoPrefsOpen?`flex`:`none`}; flex-direction:column; gap:8px;">
          <!-- 0. Layer Filters -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">Layer Visibility Filter</span>
              <span class="setting-label-sub">Highlight specific network layers or show full end-to-end tree</span>
            </div>
            <div class="topo-layer-group" style="display:inline-flex; width:100%; box-sizing:border-box;">
              <button type="button" class="topo-layer-btn ${!window._topoActiveLayer||window._topoActiveLayer===`all`?`active`:``}" data-layer="all" onclick="setTopologyLayerFilter('all')" style="flex:1;">ALL</button>
              <button type="button" class="topo-layer-btn ${window._topoActiveLayer===`L1`?`active`:``}" data-layer="L1" onclick="setTopologyLayerFilter('L1')" style="flex:1;">L1 Physical</button>
              <button type="button" class="topo-layer-btn ${window._topoActiveLayer===`L2`?`active`:``}" data-layer="L2" onclick="setTopologyLayerFilter('L2')" style="flex:1;">L2 Switches/APs</button>
              <button type="button" class="topo-layer-btn ${window._topoActiveLayer===`L3`?`active`:``}" data-layer="L3" onclick="setTopologyLayerFilter('L3')" style="flex:1;">L3 Clients</button>
            </div>
          </div>

          <!-- 1. Color Palette -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">Color Theme Palette</span>
              <span class="setting-label-sub">Accent color for topology diagram links, badges and active highlights</span>
            </div>
            <div>
              <select class="mh-input" onchange="updateTopologyPref('theme', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                <option value="cyan" ${t.theme===`cyan`?`selected`:``}>Modern Cyan (Default)</option>
                <option value="emerald" ${t.theme===`emerald`?`selected`:``}>Emerald Green</option>
                <option value="purple" ${t.theme===`purple`?`selected`:``}>Violet / Purple Neon</option>
                <option value="blue" ${t.theme===`blue`?`selected`:``}>Electric Blue</option>
                <option value="amber" ${t.theme===`amber`?`selected`:``}>Warm Amber</option>
                <option value="monochrome" ${t.theme===`monochrome`?`selected`:``}>Monochrome Dark Slate</option>
              </select>
            </div>
          </div>

          <!-- 2. Animation Mode -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">Packet Flow Animation</span>
              <span class="setting-label-sub">Real-time particle motion across active physical and wireless links</span>
            </div>
            <div>
              <select class="mh-input" onchange="updateTopologyPref('animMode', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                <option value="flowing" ${t.animMode===`flowing`?`selected`:``}>Flowing Particles (Animated)</option>
                <option value="glow" ${t.animMode===`glow`?`selected`:``}>Subtle Static Glow (No Motion)</option>
                <option value="off" ${t.animMode===`off`?`selected`:``}>Minimal Static (Zero Motion / Low CPU)</option>
              </select>
            </div>
          </div>

          <!-- 3. Animation Speed -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">Animation Pulse Speed</span>
              <span class="setting-label-sub">Cycle speed of moving particle pulses on active conduits</span>
            </div>
            <div>
              <select class="mh-input" onchange="updateTopologyPref('animSpeed', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                <option value="fast" ${t.animSpeed===`fast`?`selected`:``}>Fast (1.2s)</option>
                <option value="normal" ${t.animSpeed===`normal`?`selected`:``}>Normal (2.2s)</option>
                <option value="slow" ${t.animSpeed===`slow`?`selected`:``}>Smooth Slow (3.5s)</option>
              </select>
            </div>
          </div>

          <!-- 4. Line Curvature Style -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">Link Cable Curvature</span>
              <span class="setting-label-sub">Geometric curvature of physical and wireless conduit paths</span>
            </div>
            <div>
              <select class="mh-input" onchange="updateTopologyPref('lineStyle', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                <option value="bezier" ${t.lineStyle===`bezier`?`selected`:``}>S-Curve Smooth Bezier (Hybrid Flow)</option>
                <option value="orthogonal" ${t.lineStyle===`orthogonal`?`selected`:``}>Geometric Orthogonal (Right-Angle)</option>
              </select>
            </div>
          </div>

          <!-- 5. Show Ingress WAN Modems -->
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">Show WAN Ingress Modems</span>
              <span class="setting-label-sub">Display USB modems and upstream gateway cards at top of diagram</span>
            </div>
            <div class="toggle-wrap-cell">
              <label class="toggle-switch">
                <input type="checkbox" id="topoPrefShowWan" ${t.showWan?`checked`:``} onchange="updateTopologyPref('showWan', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 6. Show Link Speeds -->
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">Show Trunk Link Speeds</span>
              <span class="setting-label-sub">Display 1Gbps / 100Mbps speed labels on trunk conduits</span>
            </div>
            <div class="toggle-wrap-cell">
              <label class="toggle-switch">
                <input type="checkbox" id="topoPrefShowSpeeds" ${t.showSpeeds?`checked`:``} onchange="updateTopologyPref('showSpeeds', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 7. Device Details Density -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">Device Details Level</span>
              <span class="setting-label-sub">Information density shown on client node cards in the diagram</span>
            </div>
            <div>
              <select class="mh-input" onchange="updateTopologyPref('infoDensity', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                <option value="full" ${t.infoDensity===`full`?`selected`:``}>Full Details (Hostname, IP, MAC & Band)</option>
                <option value="compact" ${t.infoDensity===`compact`?`selected`:``}>Compact (Hostname & Interface Only)</option>
              </select>
            </div>
          </div>

          <!-- 8. Live Auto-Refresh Rate -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">Live Diagram Refresh</span>
              <span class="setting-label-sub">Auto-sync frequency for connected clients and topology states</span>
            </div>
            <div>
              <select class="mh-input" onchange="updateTopologyPref('refreshRate', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                <option value="10s" ${t.refreshRate===`10s`?`selected`:``}>Every 10 Seconds (Default)</option>
                <option value="5s" ${t.refreshRate===`5s`?`selected`:``}>Every 5 Seconds</option>
                <option value="30s" ${t.refreshRate===`30s`?`selected`:``}>Every 30 Seconds</option>
                <option value="off" ${t.refreshRate===`off`?`selected`:``}>Manual Refresh Only</option>
              </select>
            </div>
          </div>
        </div>
      `}function cr(){window._topoPrefsOpen=!window._topoPrefsOpen;let e=document.getElementById(`topoPrefsBody`),t=document.getElementById(`topoPrefsChevron`);e&&(e.style.display=window._topoPrefsOpen?`flex`:`none`),t&&(t.style.transform=window._topoPrefsOpen?`rotate(180deg)`:``)}function lr(e,t=1,n=null,r=null){if(!e)return[];let i=[{node:e,depth:t,parentNode:n,uplinkPort:r}];return Array.isArray(e.ports)&&e.ports.forEach(n=>{n.role===`node`&&n.child&&i.push(...lr(n.child,t+1,e,n))}),i}function G(e){let t=document.getElementById(`topoLayerPortsContainer`);if(!t)return;let n=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`,r=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_mac||`2e:dd:4c:b2:8c:fa`;(!window._topoTree||e)&&(window._topoTree=Ln(e||window._topologyLayers,n,r));let i=window._topoTree;i.discovery_mode=kn(i),An();let a=Dn(),o=zn(i);or();let s=document.getElementById(`topoAutoDiscoveryToggle`);s&&(s.checked=window._topoAutoDiscovery!==!1);let c=document.getElementById(`topoAutoModeSub`);c&&(c.textContent=window._topoAutoDiscovery===!1?`Custom Mode Active: Live tree preserved as editable base. Manual port & node customization enabled.`:`Automatically build and map network tree from live port telemetry, WAN uplink, and connected devices`),sr(),t.innerHTML=lr(i).map(e=>fr(e.node,e.depth,e.parentNode,e.uplinkPort,a,o)).join(``)}function ur(e,t,n,r,i){return fr(e,t||1,null,null,n,r)}function dr(e,t,n,r,i){return fr(e,t||1,null,null,n,r)}function fr(e,t,n,r,i,a){if(!e)return``;let o=t===1,s=Array.isArray(e.ports)?e.ports.length:e.numPorts||4,c=e.type===`router`,l=e.type===`ap`;e.type;let u=c||l,d=e.wireless_clients||[],f=Ut(document.documentElement.getAttribute(`data-theme`)===`light`,Vt().theme),p=t===1?f.l1:t===2?f.l2:t===3?f.l3:f.l4,m=r?` (via ${$(n.name||`Host`)} &rarr; ${$(r.label||`Port`)})`:``;return`
        <div class="topo-node-setting-block" id="topoNodeCard_${$(e.id)}" style="display:flex; flex-direction:column; gap:8px;">
          <!-- NODE IDENTITY & HARDWARE HEADER -->
          <div class="setting-section-header" style="display:flex; justify-content:space-between; align-items:center; margin-top:${o?`4px`:`18px`};">
            <span>${o?`Host Gateway`:$(e.name||`Subordinate Node`)} (${$(e.ip||`--`)})</span>
            <span class="card-badge" style="color:${p}; border-color:${p}; font-size:10px;">
              LAYER ${t} &bull; ${o?`ROOT ROUTER`:(e.type||`AP`).toUpperCase()}${m}
            </span>
          </div>

          <!-- Row: Node Name -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">Device Name</span>
              <span class="setting-label-sub">Network host identifier label for Layer ${t} node</span>
            </div>
            <div>
              <input type="text" class="mh-input" value="${$(e.name||``)}" oninput="onNodeFieldChange('${$(e.id)}', 'name', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
            </div>
          </div>

          <!-- Row: Node Role / Type (Only for non-root nodes) -->
          ${o?``:`
            <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
              <div class="setting-label-col">
                <span class="setting-label-bold">Node Role</span>
                <span class="setting-label-sub">Infrastructure hardware tier</span>
              </div>
              <div>
                <select class="mh-input" onchange="onNodeFieldChange('${$(e.id)}', 'type', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                  <option value="ap" ${e.type===`ap`?`selected`:``}>Access Point (AP)</option>
                  <option value="router" ${e.type===`router`?`selected`:``}>Router</option>
                  <option value="switch" ${e.type===`switch`?`selected`:``}>Ethernet Switch</option>
                </select>
              </div>
            </div>
          `}

          <!-- Row: Physical LAN Ports Count -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">LAN Ports Count</span>
              <span class="setting-label-sub">Number of physical Ethernet ports on this hardware (1 to 48)</span>
            </div>
            <div>
              <input type="number" min="1" max="48" class="mh-input" value="${s}" onchange="onNodePortCountChange('${$(e.id)}', parseInt(this.value, 10))" style="width:100%; box-sizing:border-box; font-size:12px;">
            </div>
          </div>

          ${o?`
            <!-- WAN UPLINK & PORT ASSIGNMENT (WAN AS LAN / LAN AS WAN) -->
            <div class="setting-section-divider"></div>
            <div class="setting-section-header" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Host Gateway WAN Interface & Port Mapping</span>
              <span class="card-badge" style="color:${p}; border-color:${p}; font-size:9.5px;">LAYER 1 WAN</span>
            </div>

            <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
              <div class="setting-label-col">
                <span class="setting-label-bold">WAN Port Mode</span>
                <span class="setting-label-sub">Configure physical WAN port uplink or remap port role (WAN as LAN / LAN as WAN)</span>
              </div>
              <div>
                <select class="mh-input" onchange="onWanModeChange(this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                  <option value="standard" ${e.wan_mode===`standard`||!e.wan_mode?`selected`:``}>Standard WAN Uplink (ISP / ONT / Cable Gateway)</option>
                  <option value="wan_as_lan" ${e.wan_mode===`wan_as_lan`?`selected`:``}>WAN as LAN (Remap WAN Port to 5th LAN Switch Port)</option>
                  <option value="lan_as_wan_1" ${e.wan_mode===`lan_as_wan_1`?`selected`:``}>LAN as WAN (Remap LAN 1 as Secondary WAN Failover)</option>
                  <option value="lan_as_wan_4" ${e.wan_mode===`lan_as_wan_4`?`selected`:``}>LAN as WAN (Remap LAN 4 as Secondary WAN Failover)</option>
                </select>
              </div>
            </div>

            <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
              <div class="setting-label-col">
                <span class="setting-label-bold">WAN Uplink Speed Standard</span>
                <span class="setting-label-sub">Negotiated physical Ethernet interface throughput</span>
              </div>
              <div>
                <select class="mh-input" onchange="onWanSpeedChange(this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                  <option value="1000" ${e.wan_speed===`1000`||!e.wan_speed?`selected`:``}>1 Gbps Gigabit Ethernet</option>
                  <option value="2500" ${e.wan_speed===`2500`?`selected`:``}>2.5 Gbps Multi-Gigabit Ethernet</option>
                  <option value="100" ${e.wan_speed===`100`?`selected`:``}>100 Mbps Fast Ethernet</option>
                </select>
              </div>
            </div>

            <!-- USB ARCHITECTURE & HUB PORTS EXPANSION -->
            <div class="setting-section-divider"></div>
            <div class="setting-section-header" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Host Gateway USB Architecture & Hub Ports</span>
              <span class="card-badge" style="color:#38bdf8; border-color:#38bdf8; font-size:9.5px;">USB 3.0 (5 Gbps)</span>
            </div>

            <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
              <div class="setting-label-col">
                <span class="setting-label-bold">USB Hub Expansion Mode</span>
                <span class="setting-label-sub">Configure external multi-port USB 3.0 SuperSpeed hub</span>
              </div>
              <div>
                <select class="mh-input" onchange="onUsbModeChange(this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                  <option value="hub" ${e.usb_config&&e.usb_config.mode!==`direct`?`selected`:``}>Multi-Port USB 3.0 SuperSpeed Hub (5 Gbps)</option>
                  <option value="direct" ${e.usb_config&&e.usb_config.mode===`direct`?`selected`:``}>Direct Host USB 3.0 Port (Single Device)</option>
                </select>
              </div>
            </div>

            <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
              <div class="setting-label-col">
                <span class="setting-label-bold">USB Hub Ports Count</span>
                <span class="setting-label-sub">Number of physical USB ports on the hub (0 to 8)</span>
              </div>
              <div>
                <input type="number" min="0" max="8" class="mh-input" value="${e.usb_config&&e.usb_config.ports?e.usb_config.ports.length:0}" onchange="onUsbPortCountChange(parseInt(this.value, 10))" style="width:100%; box-sizing:border-box; font-size:12px;">
              </div>
            </div>

            <!-- USB Hub Ports List -->
            ${Wn(e,p)}
          `:``}

          <!-- PHYSICAL ETHERNET PORTS LIST -->
          <div class="setting-section-divider"></div>
          <div class="setting-section-header" style="display:flex; justify-content:space-between; align-items:center;">
            <span>${o?`Host Gateway`:$(e.name||`Node`)} Ethernet Ports (${(e.ports||[]).length})</span>
            <span class="card-badge" style="color:${p}; border-color:${p}; font-size:9.5px;">LAYER ${t} PORTS</span>
          </div>

          ${(e.ports||[]).map((n,r)=>{n.role;let s=n.role===`device`,c=n.role===`node`,l=n.child||{},u=l.ip||``,d=l.name||``,f=l.mac||``,m=n.label||`LAN `+(r+1);o&&(e.wan_mode===`lan_as_wan_1`&&r===0?m=`LAN 1 [WAN 2 Failover]`:e.wan_mode===`lan_as_wan_4`&&r===3&&(m=`LAN 4 [WAN 2 Failover]`));let h=`${e.name||(o?`Host Gateway`:`Router`)} &bull; ${m}: Disconnected / Empty`;return s?h=`${e.name||`Router`} &bull; Connected Client: ${d||`Device`} (${u||`--`})`:c&&(h=`${e.name||`Router`} &bull; Downstream Node: ${l.name||`Subordinate Node`} (${l.ip||`--`}) &bull; Managed below as Layer ${t+1}`),`
              <div class="setting-row-item" id="topoPortRow_${$(n.id)}" style="flex-direction:column; align-items:stretch; gap:8px; border-bottom:1px solid rgba(255,255,255,0.035); padding:10px 14px;">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                  <div class="setting-label-col" style="flex:1; min-width:0;">
                    <span class="setting-label-bold" style="color:${p}; font-weight:700;">${$(m)}</span>
                    <span class="setting-label-sub">${h}</span>
                  </div>
                  ${s&&u?`
                    <button type="button" class="topo-remove-btn" onclick="onPortRoleChange('${$(n.id)}', 'empty')" title="Remove device from ${$(n.label||`this port`)}">
                      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      <span>Remove</span>
                    </button>
                  `:``}
                </div>

                <div style="display:flex; flex-direction:column; gap:8px; width:100%;">
                  <select class="mh-input" onchange="onPortRoleChange('${$(n.id)}', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                    <option value="empty" ${n.role===`empty`?`selected`:``}>Empty (Disconnected)</option>
                    <option value="device" ${n.role===`device`?`selected`:``}>Direct End-Device</option>
                    <option value="node" ${n.role===`node`?`selected`:``}>Subordinate Router / AP / Switch</option>
                  </select>

                  ${s?`
                    <select class="mh-input" onchange="onSelectPortDevice('${$(n.id)}', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                      <option value="">-- Choose a live client or enter manually --</option>
                      ${i.map(e=>{let t=a.has(e.ip)&&e.ip!==u,n=t?`disabled style="color:var(--text-dim); opacity:0.45;`:``,r=t?` [In use]`:``;return`<option value="${$(e.ip)}" ${u===e.ip?`selected`:``} ${n}>${$(e.name||`Device`)} &bull; ${$(e.ip)}${r}</option>`}).join(``)}
                      <option value="__manual__" ${i.some(e=>e.ip===u)?``:`selected`}>+ Enter device details manually</option>
                    </select>
                    ${i.some(e=>e.ip===u)?``:`
                      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; width:100%;">
                        <input type="text" class="mh-input" placeholder="Device Name" value="${$(d)}" oninput="onCustomPortDeviceChange('${$(n.id)}', 'name', this.value)" style="width:100%; box-sizing:border-box; font-size:11px;">
                        <input type="text" class="mh-input" placeholder="IPv4 Address" value="${$(u)}" oninput="onCustomPortDeviceChange('${$(n.id)}', 'ip', this.value)" style="width:100%; box-sizing:border-box; font-size:11px; font-family:var(--font-mono);">
                        <input type="text" class="mh-input" placeholder="MAC (optional)" value="${$(f)}" oninput="onCustomPortDeviceChange('${$(n.id)}', 'mac', this.value)" style="width:100%; box-sizing:border-box; font-size:11px; font-family:var(--font-mono);">
                      </div>
                    `}
                  `:``}

                  ${c?`
                    <select class="mh-input" onchange="onSelectPortNodeClient('${$(n.id)}', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                      <option value="">-- Choose a live node or enter details manually --</option>
                      ${i.map(e=>{let t=a.has(e.ip)&&e.ip!==l.ip,n=t?`disabled style="color:var(--text-dim); opacity:0.45;"`:``,r=t?` [In use]`:``;return`<option value="${$(e.ip)}" ${l.ip===e.ip?`selected`:``} ${n}>${$(e.name||`Network device`)} &bull; ${$(e.ip)}${r}</option>`}).join(``)}
                    </select>
                    ${i.some(e=>e.ip===l.ip)?``:`
                      <div class="topo-manual-device-fields">
                        <input type="text" class="mh-input" placeholder="Node name" value="${$(l.name||``)}" oninput="onNodeFieldChange('${$(l.id)}', 'name', this.value)">
                        <input type="text" class="mh-input" placeholder="Management IPv4 (optional)" value="${$(l.ip||``)}" oninput="onNodeFieldChange('${$(l.id)}', 'ip', this.value)">
                        <input type="text" class="mh-input" placeholder="MAC address (optional)" value="${$(l.mac||``)}" oninput="onNodeFieldChange('${$(l.id)}', 'mac', this.value)">
                      </div>
                    `}
                  `:``}
                </div>
              </div>
            `}).join(``)}

          <!-- WI-FI CLIENTS SECTION -->
          ${u?`
            <div class="setting-section-divider"></div>
            <div class="setting-section-header" style="display:flex; justify-content:space-between; align-items:center;">
              <span>${o?`Host Gateway`:$(e.name||`AP`)} <span style="color:${p}; font-weight:700;">Wi-Fi</span> Clients (${d.length})</span>
              <span class="card-badge" style="color:${p}; border-color:${p}; font-size:9.5px;">LAYER ${t} WI-FI</span>
            </div>

            <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
              <div class="setting-label-col">
                <span class="setting-label-bold" style="color:${p};">Add Wi-Fi Client</span>
                <span class="setting-label-sub">Connect a wireless client to ${$(e.name||(o?`Host Router`:`AP`))} Wi-Fi</span>
              </div>
              <div>
                <select class="mh-input" onchange="onQuickAddWifiClient('${$(e.id)}', 'WiFi', this.value); this.value='';" style="width:100%; box-sizing:border-box; font-size:12px;">
                  <option value="">+ Connect Device to Wi-Fi...</option>
                  <option value="__manual__">+ Add Custom IP Device...</option>
                  ${i.map(e=>{let t=a.has(e.ip),n=t?`disabled style="color:var(--text-dim); opacity:0.45;"`:``,r=t?` [In use]`:``;return`<option value="${$(e.ip)}" ${n}>${$(e.name||`Device`)} &bull; ${$(e.ip)}${r}</option>`}).join(``)}
                </select>
              </div>
            </div>

            ${d.length>0?d.map(t=>`
              <div class="setting-row-item" style="align-items:center; justify-content:space-between; gap:12px; padding:10px 14px;">
                <div class="setting-label-col" style="flex:1; min-width:0;">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span class="setting-label-bold" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${$(t.name||`Wireless Device`)}</span>
                    <span class="csc-dot connected" style="width:6px; height:6px; border-radius:50%; flex-shrink:0;"></span>
                  </div>
                  <span class="setting-label-sub" style="font-family:var(--font-mono); font-size:11px;">IP: ${$(t.ip||`--`)} &bull; MAC: ${$(t.mac||`--`)} &bull; <span style="color:${p}; font-weight:700;">Wi-Fi</span></span>
                </div>
                <button type="button" class="topo-remove-btn" onclick="onRemoveWifiClient('${$(e.id)}', '${$(t.id||t.ip)}')" title="Remove device from Wi-Fi">
                  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span>Remove</span>
                </button>
              </div>
            `).join(``):`
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-sub" style="font-style:italic;">No devices connected to ${$(e.name||(o?`Host Router`:`AP`))} Wi-Fi</span>
                </div>
              </div>
            `}
          `:``}
        </div>
      `}async function pr(e,t,n){if(!n||!window._topoTree)return;function r(e,t){if(!e)return null;if(e.id===t)return e;if(Array.isArray(e.ports)){for(let n of e.ports)if(n.role===`node`&&n.child){let e=r(n.child,t);if(e)return e}}return null}let i=r(window._topoTree,e);if(i){if(i.wireless_clients=i.wireless_clients||[],n===`__manual__`){let e=await fc(`Enter device IP address:`,``,`Add Wireless Device`);if(!e)return;let n=await fc(`Enter device name (optional):`,`Device `+e.split(`.`).pop(),`Device Name`)||`Device `+e.split(`.`).pop();i.wireless_clients.push({id:`wc-`+Date.now()+Math.random().toString(36).substr(2,4),name:n,ip:e.trim(),band:t,manual:!0})}else{let e=(window._lastDataCache&&Array.isArray(window._lastDataCache.clients)?window._lastDataCache.clients:[]).find(e=>e&&e.ip===n),r=e&&e.name||`Device `+n.split(`.`).pop(),a=e&&e.mac||``;i.wireless_clients.some(e=>e.ip===n)||i.wireless_clients.push({id:`wc-`+Date.now()+Math.random().toString(36).substr(2,4),name:r,ip:n,mac:a,band:t,manual:!0})}W(),G(window._topoTree),typeof U==`function`&&U()}}function mr(e,t){if(!window._topoTree)return;function n(e,t){if(!e)return null;if(e.id===t)return e;if(Array.isArray(e.ports)){for(let r of e.ports)if(r.role===`node`&&r.child){let e=n(r.child,t);if(e)return e}}return null}let r=n(window._topoTree,e);if(!r||!Array.isArray(r.wireless_clients))return;let i=r.wireless_clients.find(e=>e.id===t||e.ip===t);Pn(window._topoTree,i),r.wireless_clients=r.wireless_clients.filter(e=>e.id!==t&&e.ip!==t),W(),G(window._topoTree),typeof U==`function`&&U()}async function hr(e=!1){if(!window._topoTree)return;let t=Hn(window._topoTree);if(!t.valid){e||Q(`Cannot save topology: `+t.error,`error`),or();return}let n={status:`ok`,version:2,tree:window._topoTree,ports:Un(window._topoTree)};try{let t=await(await fetch(`/cgi-bin/topology_layers`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(n)})).json();t&&t.status===`ok`?(window._topologyLayers=n,window._topologyLayersSavedLocally=!0,typeof U==`function`&&U(),e||wr(`Topology configuration saved & verified successfully!`)):e||Q(`Error saving topology configuration: `+(t?t.message:`Unknown error`),`error`)}catch(e){console.error(`Error saving topology:`,e),window._topologyLayers=n,typeof U==`function`&&U(),wr(`Topology updated live in local session!`)}}async function gr(){if(await Z(`Reset network topology to default hierarchy?`,`Reset Topology`,`Reset`,!0))try{let e=await(await fetch(`/cgi-bin/topology_layers?action=reset`,{method:`POST`})).json(),t=Ln(e);t.discovery_mode=`live`,localStorage.setItem(`maxnet_topology_discovery_mode`,`live`),localStorage.removeItem(`maxnet_topo_auto_mode`),window._topoTree=t,window._topologyLayers=e,G(t),typeof U==`function`&&U(),wr(`Topology reset to default hierarchy!`)}catch(e){console.error(`Error resetting topology:`,e);let t=Fn();t.discovery_mode=`live`,localStorage.setItem(`maxnet_topology_discovery_mode`,`live`),localStorage.removeItem(`maxnet_topo_auto_mode`),window._topoTree=t,G(t),typeof U==`function`&&U()}}async function _r(){try{let e=await fetch(`/cgi-bin/topology_layers`,{cache:`no-store`});if(e.ok){let t=await e.json();if(t){window._topologyLayers=t;let e=Ln(t);window._topoTree=e,e.discovery_mode=kn(e),An(),G(e),typeof U==`function`&&U()}}}catch(e){console.error(`Error fetching topology layers:`,e)}}async function vr(){window._topoTree||(window._topoTree=Fn()),kn()===`manual`?typeof Q==`function`&&Q(`Choose an automatic topology type before refreshing discovery.`,`info`):(In(window._topoTree,window._lastDataCache),G(window._topoTree),typeof U==`function`&&U(),W(),wr(`Topology discovery refreshed; manually locked links were preserved.`))}function yr(){let e=document.getElementById(`topoJsonModalOverlay`),t=document.getElementById(`topoJsonModalTitle`),n=document.getElementById(`topoJsonModalDesc`),r=document.getElementById(`topoJsonTextarea`),i=document.getElementById(`topoJsonModalApplyBtn`),a=document.getElementById(`topoJsonError`);if(!e||!r)return;e.parentElement!==document.body&&document.body.appendChild(e),t&&(t.textContent=`Export Topology JSON`),n&&(n.textContent=`Current recursive tree JSON configuration:`),a&&(a.style.display=`none`),i&&(i.style.display=`none`);let o={status:`ok`,version:2,tree:window._topoTree||Fn()};r.value=JSON.stringify(o,null,2),e.style.display=`flex`,requestAnimationFrame(()=>{e.classList.add(`active`)})}function br(){let e=document.getElementById(`topoJsonModalOverlay`),t=document.getElementById(`topoJsonModalTitle`),n=document.getElementById(`topoJsonModalDesc`),r=document.getElementById(`topoJsonTextarea`),i=document.getElementById(`topoJsonModalApplyBtn`),a=document.getElementById(`topoJsonError`);e&&r&&(e.parentElement!==document.body&&document.body.appendChild(e),t&&(t.textContent=`Import Topology JSON`),n&&(n.textContent=`Paste exported topology JSON below to restore network structure:`),a&&(a.style.display=`none`),i&&(i.style.display=`inline-block`),r.value=``,r.placeholder=`Paste {"status":"ok","version":2,"tree":{...}} JSON here...`,e.style.display=`flex`,requestAnimationFrame(()=>{e.classList.add(`active`)}))}function xr(){let e=document.getElementById(`topoJsonModalOverlay`);e&&(e.classList.remove(`active`),e.style.display=`none`)}function Sr(){let e=document.getElementById(`topoJsonTextarea`),t=document.getElementById(`btnCopyTopoJson`);e&&(e.select(),navigator.clipboard.writeText(e.value).then(()=>{if(t){let e=t.textContent;t.textContent=`COPIED!`,setTimeout(()=>{t.textContent=e},1800)}}).catch(e=>{document.execCommand(`copy`)}))}function Cr(){let e=document.getElementById(`topoJsonTextarea`),t=document.getElementById(`topoJsonError`);if(e)try{let n=Ln(JSON.parse(e.value.trim())),r=Hn(n);if(!r.valid){t&&(t.textContent=`Validation error: `+r.error,t.style.display=`block`);return}window._topoTree=n,G(n),typeof U==`function`&&U(),xr(),wr(`Topology JSON imported & applied successfully!`)}catch(e){t&&(t.textContent=`Invalid JSON: `+e.message,t.style.display=`block`)}}function wr(e){let t=document.getElementById(`deviceActionStatus`);t&&(t.textContent=e,t.style.color=`#10b981`,setTimeout(()=>{t.textContent=``},3500))}window.renderClientCards=vn;function Tr(e){let t=document.getElementById(`blockedClientsCards`),n=document.getElementById(`blockedCountBadge`);n&&(n.innerText=`${e.length} BLOCKED`),t&&(t.innerHTML=!e||e.length===0?`<div style="text-align:center; color:var(--text-dim); padding:10px; font-size:12px;">No clients currently blocked.</div>`:e.map(e=>`
        <div class="client-cyber-card is-blocked">
          <div class="client-card-inner">
            <div class="client-meta-left">
              <div class="client-ip-heading">
                <span class="client-ip-text" style="color:var(--mh-rose);">${$(e.ip||`--`)}</span>
              </div>
              <div class="client-status-sub">
                <span class="client-badge blocked">RESTRICTED</span>
              </div>
            </div>
            <div class="client-meta-right">
              <div class="client-host-label" style="color:var(--mh-rose);">${$(e.name||`Restricted Device`)}</div>
              <div class="client-mac-mono">${$(e.mac||`--`)}</div>
              <div class="client-action-box">
                <button class="mh-btn btn-sm btn-ghost" onclick="unblockDevice('${e.ip}', '${e.mac}')">UNBLOCK</button>
              </div>
            </div>
          </div>
        </div>
      `).join(``))}async function Er(e,t,n,r){let i=await p(`/cgi-bin/clients`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:e,ip:t,mac:n,name:r})}),a=await i.json();if(!i.ok||a.status!==`ok`)throw Error(a.message||`${e} request failed`);return await fn(),typeof B==`function`&&await B(),a}async function Dr(e,t,n){if(xn({ip:e,mac:t,name:n}))typeof Q==`function`&&Q(`Cannot block router gateway host.`,`error`);else if(await Z(`Are you sure you want to block internet access for ${n||e}?`,`Block Internet Access`,`Block Client`,!0))try{await Er(`block`,e,t,n),typeof Q==`function`&&Q(`Internet access blocked for ${n||e}`,`success`)}catch(e){typeof Q==`function`&&Q(`Error blocking client: `+e.message,`error`)}}async function Or(e,t){try{await Er(`unblock`,e,t,``),typeof Q==`function`&&Q(`Device ${e||t} unblocked`,`success`)}catch(e){typeof Q==`function`&&Q(`Error unblocking client: `+e.message,`error`)}}async function kr(){let e=document.getElementById(`manualBlockIp`).value.trim(),t=document.getElementById(`manualBlockMac`).value.trim();!e&&!t?Q(`Please enter an IP or MAC address to block.`,`warning`):xn({ip:e,mac:t})?typeof Q==`function`&&Q(`Cannot block router gateway host.`,`error`):(await Dr(e,t,`Firewall Blocked Device`),document.getElementById(`manualBlockIp`).value=``,document.getElementById(`manualBlockMac`).value=``)}var K=``;async function Ar(){try{let e=[];if(window._lastDataCache&&Array.isArray(window._lastDataCache.usb_devices)&&window._lastDataCache.usb_devices.length>0)e=window._lastDataCache.usb_devices;else{let t=await(await p(`/cgi-bin/device?action=devices`)).json();e=Array.isArray(t.devices)?t.devices:[]}let t=document.getElementById(`adbDevCountBadge`);t&&(t.innerText=`${e.length} PORTS`),jr(e)}catch(e){console.error(`fetchAdbDeviceList error`,e)}}function jr(e){let t=document.getElementById(`usbDevicesListFlow`);if(!t)return;if(!e||e.length===0){t.innerHTML=`
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">No USB Devices Detected</span>
              <span class="setting-label-sub">Connect 5G phone or USB storage to the USB 3.1 Hub</span>
            </div>
            <div class="setting-control-col">
              <span class="toggle-status-badge off">STANDBY</span>
            </div>
          </div>
        `;return}let n=``;e.forEach((e,t)=>{let r=e.device_type===`storage`||e.device_type===`pendrive`||e.device_type===`ssd`||e.has_storage,i=e.port||t+1,a=e.bus||`1-1.${i}`,o=$(e.model||e.brand||(r?`USB Storage`:`USB Device ${i}`)),s=``,c=``;if(r){let t=e.total_space&&e.total_space!==`--`?e.total_space:`Ready`,n=e.mount_point||`/mnt/pendrive`,r=e.virtual_ip||window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`;s=`Storage (${e.filesystem||`ext4`}) &middot; Mount: ${n} &middot; ${t} &middot; Share: \\\\${r}\\${e.share_name||`Pendrive`}`;let i=e.smb_running!==!1;c=`
            <span class="toggle-status-badge ${i?`on`:`off`}">${i?`MOUNTED`:`UNMOUNTED`}</span>
            <label class="toggle-switch" title="Toggle Samba Sharing">
              <input type="checkbox" ${i?`checked`:``} onchange="toggleSmbService(event)">
              <span class="toggle-slider"></span>
            </label>
          `}else{let n=e.operator||`Vi India`,r=e.network||`4G LTE`,i=e.virtual_ip||e.ip||`--`,a=e.battery_pct!==null&&e.battery_pct!==void 0?`${e.battery_pct}%`:e.adb_enabled?`--`:`No ADB`,l=e.battery_temp_c?` (${e.battery_temp_c}°C)`:``,u=e.is_wan!==!1,d=e.speed_mbps?`${e.speed_mbps} Mbps`:`480 Mbps`;s=`Tethering (${e.net_interface||`usb`+t}) &middot; ${r} (${n}) &middot; ${i} &middot; Batt: ${a}${l} &middot; ${d}`;let f=u?`ACTIVE WAN`:e.adb_enabled?`STANDBY`:`NO INTERNET`;c=`
            <span class="toggle-status-badge ${u?`on`:`off`}">${f}</span>
            <button class="round-action-btn" title="Reboot ${o} via ADB" onclick="runDeviceReboot()">
              <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </button>
          `}n+=`
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">USB ${i} (${a}): ${o}</span>
              <span class="setting-label-sub">${s}</span>
            </div>
            <div class="setting-control-col">
              ${c}
            </div>
          </div>
        `}),t.innerHTML=n}async function Mr(){typeof Q==`function`&&Q(`Restarting network & multi-link daemons...`);try{await p(`/cgi-bin/diagnostics?tool=restart_network`),typeof Q==`function`&&Q(`Network and multi-link restarted!`)}catch(e){console.error(e)}}async function Nr(){typeof Q==`function`&&Q(`Flushing DNS cache & conntrack table...`);try{await p(`/cgi-bin/diagnostics?tool=flush_cache`),typeof Q==`function`&&Q(`DNS cache & conntrack flushed!`)}catch(e){console.error(e)}}function Pr(){window.location.href=`/cgi-bin/diagnostics?tool=dmesg_download`}function Fr(e){Ir(e)}function Ir(e){K=e;let t=(window._lastDataCache&&Array.isArray(window._lastDataCache.usb_devices)?window._lastDataCache.usb_devices:[]).find(t=>t.serial===e||t.bus===e||t.hostname===e),n=document.getElementById(`storageDevicePanel`),r=document.getElementById(`phoneDevicePanel`);if(t&&(t.device_type===`storage`||t.device_type===`pendrive`||t.device_type===`ssd`||t.has_storage)){n&&(n.style.display=`block`),r&&(r.style.display=`none`);let e=document.getElementById(`storDevType`);e&&(e.innerText=t.device_type===`ssd`?`NVMe SSD`:`USB Flash Drive`);let i=document.getElementById(`storDevModel`);i&&(i.innerText=t.model||`Disk 2.0`);let a=document.getElementById(`storDevPort`);a&&(a.innerText=`Port ${t.port||3}`);let o=document.getElementById(`storDevSpeed`);o&&(o.innerText=`${t.speed_mbps||480} Mbps (${t.standard||`USB 2.0`})`);let s=document.getElementById(`storDevIp`);s&&(s.innerText=t.virtual_ip||window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`);let c=document.getElementById(`storDevHost`);c&&(c.innerText=t.hostname||`usb3-Disk-2-0.lan`);let l=document.getElementById(`storDevMount`);l&&(l.innerText=`${t.mount_point||`/mnt/pendrive`} (${t.mounted?`Mounted`:`Standby`})`);let u=document.getElementById(`storDevCap`);u&&(u.innerText=t.total_space&&t.total_space!==`--`?`${t.total_space} (${t.free_space||`0`} free)`:`Ready (Standby)`)}else n&&(n.style.display=`none`),r&&(r.style.display=`block`),Lr()}async function Lr(){try{let e=await(await p(`/cgi-bin/device?action=telemetry`+(K?`&serial=`+encodeURIComponent(K):``))).json();if(e.status===`ok`){let t=e.identity||{},n=e.battery||{},r=e.thermals||{},i=e.memory||{},a=e.storage||{},o=e.radio||{},s=e.adb_enabled===!1,c=document.getElementById(`devModel`);c&&(c.innerText=(t.brand?t.brand.toUpperCase()+` `:``)+(t.model||`--`));let l=document.getElementById(`devSoc`);l&&(l.innerText=s?`ADB Disabled`:t.soc||`--`);let u=document.getElementById(`devOs`);u&&(u.innerText=s?`ADB Disabled`:t.android&&t.android!==`--`?`Android ${t.android}`:`--`);let d=document.getElementById(`devBattLevel`);d&&(d.innerText=s?`ADB Disabled`:n.level!==void 0&&n.level!==null?`${n.level}% (${n.technology||`Li-ion`})`:`--`);let f=document.getElementById(`devBattVolt`);f&&(f.innerText=s?`--`:n.voltage_mv?`${n.voltage_mv} mV`:`--`);let p=document.getElementById(`devCpuTemp`);p&&(p.innerHTML=!s&&r&&r.cpu_c!==void 0?`<span style="color:${ae(r.cpu_c)}">${r.cpu_c}°C</span>`:`--`);let m=document.getElementById(`devBattTemp`);m&&(m.innerHTML=!s&&r&&r.battery_c!==void 0?`<span style="color:${ae(r.battery_c)}">${r.battery_c}°C</span>`:`--`);let h=document.getElementById(`devUsbTemp`);h&&(h.innerHTML=!s&&r&&r.usb_c!==void 0?`<span style="color:${ae(r.usb_c)}">${r.usb_c}°C</span>`:`--`);let g=document.getElementById(`devSkinTemp`);g&&(g.innerHTML=!s&&r&&r.skin_c!==void 0?`<span style="color:${ae(r.skin_c)}">${r.skin_c}°C</span>`:`--`);let _=document.getElementById(`devPaTemp`);_&&(_.innerHTML=!s&&r&&r.rf_pa_c!==void 0?`<span style="color:${ae(r.rf_pa_c)}">${r.rf_pa_c}°C</span>`:`--`);let v=document.getElementById(`devRamPct`);v&&(v.innerHTML=!s&&i&&i.total_mb>0?`${i.used_mb||0}M / ${i.total_mb}M (<span style="color:${oe(i.used_pct)}">${i.used_pct||0}%</span>)`:`--`);let y=document.getElementById(`devStorageFree`);y&&(y.innerText=!s&&a&&a.avail&&a.avail!==`--`?`${a.avail} FREE / ${a.total||`--`}`:`--`);let b=document.getElementById(`devBand`);b&&(b.innerText=s?`--`:o&&o.has_sim===!1?`No SIM Card`:o&&o.band&&o.band!==`--`?`${o.band} (PCI ${o.pci||`--`})`:`--`);let x=document.getElementById(`devRsrp`);x&&(x.innerText=s?`--`:o&&o.has_sim===!1?`No Signal`:o&&o.rsrp_dbm?`${o.rsrp_dbm} dBm (${o.sinr_db||0} dB)`:`--`);let S=document.getElementById(`devScreenState`);S&&(S.innerText=s?`--`:e.screen_state||`Awake`);let C=document.getElementById(`devUptime`);C&&(C.innerText=s?`--`:e.uptime||`--`)}}catch(e){console.error(`fetchDeviceTelemetry error`,e)}}async function Rr(){let e=document.getElementById(`smsInboxList`);if(e){e.innerHTML=`<div style="color:var(--text-dim); font-size:11.5px; padding:12px; text-align:center;">Fetching SMS messages from SIM card...</div>`;try{let t=await(await fetch(`/cgi-bin/device?action=sms`)).json(),n=Array.isArray(t.sms)?t.sms:[];if(n.length===0){e.innerHTML=`<div style="color:var(--text-dim); font-size:11.5px; padding:12px; text-align:center;">No incoming messages found.</div>`;return}e.innerHTML=n.map(e=>{let t=``;if(e.date){let n=new Date(parseInt(e.date,10));t=isNaN(n.getTime())?``:n.toLocaleString()}return`
            <div class="sms-chat-bubble">
              <div class="sms-bubble-top">
                <div style="display:flex; align-items:center; gap:6px;">
                  <svg class="svg-icon" style="color:var(--mh-purple); width:13px; height:13px;" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span class="sms-sender">${$(e.address||`Unknown`)}</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="sms-time">${$(t)}</span>
                  <button class="mh-btn btn-sm btn-ghost" onclick="navigator.clipboard.writeText('${$(e.body||``)}'); showToast('Copied message text', 'success');" style="font-size:9.5px; padding:2px 6px;">COPY</button>
                </div>
              </div>
              <div class="sms-body-text">${$(e.body||``)}</div>
            </div>
          `}).join(``)}catch(t){e.innerHTML=`<div style="color:var(--mh-rose); font-size:11.5px; padding:10px;">Failed to fetch messages: `+$(t.message)+`</div>`}}}async function zr(){let e=document.getElementById(`deviceToolOutput`);e.style.display=`block`,e.innerText=`Pinging 8.8.8.8 directly from phone 5G interface...`;try{e.innerText=(await(await fetch(`/cgi-bin/device?action=ping`)).json()).output||`Ping test complete.`}catch(t){e.innerText=`Error running ping: `+t.message}}var q={torch:{},silent:{},screen:{},screenAwake:{},volume:{},radio:{},wirelessAdb:{}};try{let e=localStorage.getItem(`maxnet_adb_states`);e&&(q=Object.assign(q,JSON.parse(e)))}catch{}function Br(){try{localStorage.setItem(`maxnet_adb_states`,JSON.stringify(q))}catch{}}function Vr(e){return e||(e=`default_adb`),q.torch||(q.torch={}),q.screenAwake||(q.screenAwake={}),q.volume||(q.volume={}),q.radio||(q.radio={}),q.wirelessAdb||(q.wirelessAdb={}),q.torch[e]===void 0&&(q.torch[e]=!1),q.screenAwake[e]===void 0&&(q.screenAwake[e]=!0),q.volume[e]===void 0&&(q.volume[e]=10),q.radio[e]||(q.radio[e]=`active`),q.wirelessAdb[e]===void 0&&(q.wirelessAdb[e]=!1),{torch:q.torch[e],screenAwake:q.screenAwake[e],volume:q.volume[e],radio:q.radio[e],wirelessAdb:q.wirelessAdb[e]}}function Hr(e){let t=document.getElementById(`btnTorchToggle`),n=document.getElementById(`dispTorchStatus`),r=document.getElementById(`dispTorchSub`);t&&(e?t.classList.add(`active-torch`):t.classList.remove(`active-torch`)),n&&(e?(n.className=`setting-pill pill-amber`,n.textContent=`TORCH ON`):(n.className=`setting-pill`,n.textContent=`OFF`)),r&&(r.innerHTML=`<strong style="color:${e?`#f59e0b`:`var(--text-dim)`};">State: ${e?`ON`:`OFF`}</strong> &bull; High-intensity rear camera LED torch`)}async function Ur(e){if(K){e&&e.classList.add(`rotating`);try{let e=await(await p(`/cgi-bin/device?serial=${encodeURIComponent(K)}`)).json();if(e){let t=document.getElementById(`dispDevModelTitle`),n=document.getElementById(`dispDevModelSub`),r=document.getElementById(`dispDevBatterySub`),i=document.getElementById(`dispDevSerialSub`),a=document.getElementById(`dispRadioSub`),o=e.identity||{},s=e.brand||o.brand||``,c=e.model||o.model||`Android Handset`,l=e.android_version||o.android||`--`,u=e.security_patch||o.security_patch||`--`,d=e.soc||o.soc||`--`;t&&(t.textContent=`${s?s+` `:``}${c}`),n&&(n.textContent=`Android ${l} • Patch: ${u} • SoC: ${d}`);let f=e.battery||{},p=e.battery_level??f.level??`--`,m=e.battery_temp??f.temp_c??`--`,h=e.battery_health||f.health||(f.health_code===`2`?`Good`:`Normal`),g=e.battery_status||f.status;g||(g=e.battery_charging||f.charging||f.status_code===`2`?`Charging`:f.status_code===`4`?`Not Charging (Protected)`:f.status_code===`5`?`Full`:`Discharging`),r&&(r.textContent=`Level: ${p}% (${g}) • Temp: ${m}°C • Health: ${h}`);let _=e.usb||{},v=e.serial||o.serial||e.device_id||K,y=e.speed_mbps||_.speed_mbps||480,b=_.standard||(y>=5e3?`USB 3.0`:`USB 2.0`),x=e.port||_.port||`1`;i&&(i.textContent=`Serial: ${v} • Port: ${x} • ${b} (${y} Mbps)`);let S=e.radio||{},C=S.operator||e.operator||`Cellular`,w=S.network||e.network_type||`5G SA`,T=S.band?` • ${S.band}`:``;a&&(a.textContent=`Carrier: ${C} • ${w}${T} • State: Active`);let E=document.getElementById(`dispDevUptimeSub`);E&&(E.innerHTML=`<strong>Uptime: ${$(e.uptime||`--`)}</strong> &bull; Powered on &amp; operational`)}}catch(e){console.error(`fetchAdbLiveTelemetry error`,e)}finally{e&&setTimeout(()=>e.classList.remove(`rotating`),600)}}}function Wr(){K&&navigator.clipboard&&(navigator.clipboard.writeText(K),Q(`Copied ADB Serial "${K}" to clipboard`,`success`))}window._currentAdbSubView=`controls`;function Gr(e){window._currentAdbSubView=e;let t={controls:document.getElementById(`adbDetailView`),sms:document.getElementById(`adbSmsPageView`),calls:document.getElementById(`adbCallsPageView`),contacts:document.getElementById(`adbContactsPageView`)};Object.values(t).forEach(e=>{e&&(e.style.display=`none`)}),t[e]&&(t[e].style.display=`flex`),document.querySelectorAll(`.adb-sub-tab`).forEach(t=>{t.getAttribute(`data-subview`)===e?t.classList.add(`active`):t.classList.remove(`active`)});let n=(document.getElementById(`dispDevModelTitle`)||{}).textContent||K||`Device`,r=document.getElementById(`settingsDetailNavTitle`);r&&(r.textContent=e===`controls`?n:{sms:`SMS Messages`,calls:`Call History`,contacts:`Contacts`}[e]||n),e===`sms`?window._cachedAdbSms&&window._cachedAdbSms.length!==0||Kr():e===`calls`?window._cachedAdbCalls&&window._cachedAdbCalls.length!==0||Yr():e===`contacts`&&(window._cachedAdbContacts&&window._cachedAdbContacts.length!==0||Qr())}async function Kr(e){let t=document.getElementById(`adbSmsPageContainer`);document.getElementById(`adbSmsPageCountBadge`);let n=document.getElementById(`adbSmsPageSubtitle`),r=(document.getElementById(`dispDevModelTitle`)||{}).textContent||K||`Handset`;n&&(n.textContent=`${r} • SMS Inbox`),e&&e.classList.add(`rotating`),t&&(!window._cachedAdbSms||window._cachedAdbSms.length===0)&&(t.innerHTML=`
          <div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
            <svg class="spin-icon" viewBox="0 0 24 24" style="width:22px; height:22px; stroke:#38bdf8; margin:0 auto 10px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            Loading SMS messages from handset via ADB...
          </div>
        `);try{let e=await(await p(`/cgi-bin/device?action=sms&serial=${encodeURIComponent(K||``)}`)).json(),t=Array.isArray(e.messages)?e.messages:[];window._cachedAdbSms=t;let n=document.getElementById(`adbSmsPageSearch`);n&&(n.placeholder=t.length>0?`Search ${t.length} messages...`:`Search messages...`),qr(t)}catch(e){t&&(t.innerHTML=`<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to load SMS messages: ${$(e.message)}</div>`)}finally{e&&setTimeout(()=>e.classList.remove(`rotating`),600)}}function qr(e){let t=document.getElementById(`adbSmsPageContainer`);t&&(t.innerHTML=!e||e.length===0?`<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No SMS messages found on device.</div>`:e.map(e=>{let t=`--`;if(e.date){let n=new Date(parseInt(e.date,10));isNaN(n.getTime())||(t=n.toLocaleString())}let n=e.type===`1`||e.type===1;return`
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:11px 14px; display:flex; align-items:flex-start; gap:12px;">
            <div style="width:28px; height:28px; min-width:28px; border-radius:50%; background:${n?`rgba(16,185,129,0.12)`:`rgba(56,189,248,0.12)`}; display:flex; align-items:center; justify-content:center; margin-top:2px;">
              ${n?`<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#10b981; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>`:`<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#38bdf8; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`}
            </div>
            <div style="display:flex; flex-direction:column; gap:4px; flex:1; min-width:0;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                <strong style="color:var(--text-main); font-size:12.5px; font-family:var(--font-mono);">${$(e.address||`Unknown Sender`)}</strong>
                <span style="font-size:10.5px; color:var(--text-dim); font-family:var(--font-mono);">${$(t)}</span>
              </div>
              <div style="font-size:12px; color:var(--text-main); line-height:1.5; word-break:break-word; white-space:pre-wrap;">${$(e.body||``)}</div>
            </div>
          </div>
        `}).join(``))}function Jr(e){let t=(e||``).toLowerCase().trim(),n=window._cachedAdbSms||[];qr(t?n.filter(e=>(e.address||``).toLowerCase().includes(t)||(e.body||``).toLowerCase().includes(t)):n)}async function Yr(e){let t=document.getElementById(`adbCallsPageContainer`);document.getElementById(`adbCallsPageCountBadge`);let n=document.getElementById(`adbCallsPageSubtitle`),r=(document.getElementById(`dispDevModelTitle`)||{}).textContent||K||`Handset`;n&&(n.textContent=`${r} • Call History`),e&&e.classList.add(`rotating`),t&&(!window._cachedAdbCalls||window._cachedAdbCalls.length===0)&&(t.innerHTML=`
          <div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
            <svg class="spin-icon" viewBox="0 0 24 24" style="width:22px; height:22px; stroke:#38bdf8; margin:0 auto 10px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            Loading call logs from handset via ADB...
          </div>
        `);try{let e=await(await p(`/cgi-bin/device?action=call_logs&serial=${encodeURIComponent(K||``)}`)).json(),t=Array.isArray(e.call_logs)?e.call_logs:[];window._cachedAdbCalls=t;let n=document.getElementById(`adbCallsPageSearch`);n&&(n.placeholder=t.length>0?`Search ${t.length} calls by number or name...`:`Search call logs...`),Xr(t)}catch(e){t&&(t.innerHTML=`<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to load call history: ${$(e.message)}</div>`)}finally{e&&setTimeout(()=>e.classList.remove(`rotating`),600)}}function Xr(e){let t=document.getElementById(`adbCallsPageContainer`);t&&(t.innerHTML=!e||e.length===0?`<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No call logs recorded on device.</div>`:e.map(e=>{let t=`--`;if(e.date){let n=new Date(parseInt(e.date,10));isNaN(n.getTime())||(t=n.toLocaleString())}let n=`<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#38bdf8; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`,r=`rgba(56,189,248,0.12)`;e.type===`1`||e.type===1?(n=`<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#10b981; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>`,r=`rgba(16,185,129,0.12)`):(e.type===`3`||e.type===3)&&(n=`<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#ef4444; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>`,r=`rgba(239,68,68,0.12)`);let i=parseInt(e.duration||`0`,10),a=i>60?`${Math.floor(i/60)}m ${i%60}s`:`${i}s`;return`
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div style="display:flex; align-items:center; gap:12px; min-width:0;">
              <div style="width:28px; height:28px; min-width:28px; border-radius:50%; background:${r}; display:flex; align-items:center; justify-content:center;">
                ${n}
              </div>
              <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
                <strong style="color:var(--text-main); font-size:12.5px; font-family:var(--font-mono);">${$(e.number||`Private Number`)}</strong>
                <span style="font-size:11px; color:var(--text-dim);">${e.name&&e.name!==`NULL`?$(e.name)+` &bull; `:``}${$(t)}</span>
              </div>
            </div>
            <span style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono); white-space:nowrap;">${a}</span>
          </div>
        `}).join(``))}function Zr(e){let t=(e||``).toLowerCase().trim(),n=window._cachedAdbCalls||[];Xr(t?n.filter(e=>(e.number||``).toLowerCase().includes(t)||(e.name||``).toLowerCase().includes(t)):n)}async function Qr(e){let t=document.getElementById(`adbContactsPageContainer`);document.getElementById(`adbContactsPageCountBadge`);let n=document.getElementById(`adbContactsPageSubtitle`),r=(document.getElementById(`dispDevModelTitle`)||{}).textContent||K||`Handset`;n&&(n.textContent=`${r} • Contacts`),e&&e.classList.add(`rotating`),t&&(!window._cachedAdbContacts||window._cachedAdbContacts.length===0)&&(t.innerHTML=`
          <div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
            <svg class="spin-icon" viewBox="0 0 24 24" style="width:22px; height:22px; stroke:#38bdf8; margin:0 auto 10px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            Loading contacts from handset via ADB...
          </div>
        `);try{let e=await(await p(`/cgi-bin/device?action=contacts&serial=${encodeURIComponent(K||``)}`)).json(),t=Array.isArray(e.contacts)?e.contacts:[];window._cachedAdbContacts=t;let n=document.getElementById(`adbContactsPageSearch`);n&&(n.placeholder=t.length>0?`Search ${t.length} contacts...`:`Search contacts...`),$r(t)}catch(e){t&&(t.innerHTML=`<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to load contacts: ${$(e.message)}</div>`)}finally{e&&setTimeout(()=>e.classList.remove(`rotating`),600)}}function $r(e){let t=document.getElementById(`adbContactsPageContainer`);t&&(t.innerHTML=!e||e.length===0?`<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No contacts found on device.</div>`:e.map(e=>`
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div style="display:flex; align-items:center; gap:12px; min-width:0;">
            <div style="width:28px; height:28px; min-width:28px; border-radius:50%; background:rgba(167,139,250,0.12); display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#a78bfa; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
              <strong style="color:var(--text-main); font-size:12.5px;">${$(e.name||`Unnamed Contact`)}</strong>
              <span style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono);">${$(e.number||`--`)}</span>
            </div>
          </div>
          <span class="card-badge" style="font-size:9.5px;">MOBILE</span>
        </div>
      `).join(``))}function ei(e){let t=(e||``).toLowerCase().trim(),n=window._cachedAdbContacts||[];$r(t?n.filter(e=>(e.name||``).toLowerCase().includes(t)||(e.number||``).toLowerCase().includes(t)):n)}function ti(){Gr(`sms`)}function ni(){Gr(`calls`)}function ri(){Gr(`contacts`)}function ii(){Gr(`controls`)}function ai(){Gr(`controls`)}function oi(){Gr(`controls`)}async function si(e){let t=document.getElementById(`adbScreenshotModalOverlay`),n=document.getElementById(`adbScreenshotModalBody`),r=document.getElementById(`btnDownloadAdbScreenshot`);if(t&&n){t.style.display=`flex`,r&&(r.style.display=`none`),n.innerHTML=`
        <div style="text-align:center; padding:40px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
          <svg class="spin-icon" viewBox="0 0 24 24" style="width:24px; height:24px; stroke:#38bdf8; margin:0 auto 12px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
          Capturing handset screen via screencap... Please wait.
        </div>
      `;try{let e=await(await p(`/cgi-bin/device?action=screenshot&serial=${encodeURIComponent(K||``)}`)).json();e&&e.status===`ok`&&e.image_base64?(n.innerHTML=`
            <img src="${e.image_base64}" alt="Handset Screen" style="max-width:100%; max-height:68vh; border-radius:10px; border:1px solid rgba(255,255,255,0.12); box-shadow:0 12px 30px rgba(0,0,0,0.5); display:block; margin:0 auto;">
          `,r&&(r.href=e.image_base64,r.download=`screenshot_${K}_${Date.now()}.png`,r.style.display=`inline-flex`)):n.innerHTML=`<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to capture screenshot: ${$(e.message||`Unknown error`)}</div>`}catch(e){n.innerHTML=`<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Screenshot error: ${$(e.message)}</div>`}}}function ci(){let e=document.getElementById(`adbScreenshotModalOverlay`);e&&(e.style.display=`none`)}async function li(e){let t=K||`default`,n=!q.torch[t];q.torch[t]=n,Br(),Hr(n),e&&(e.classList.add(`btn-pulse`),setTimeout(()=>e.classList.remove(`btn-pulse`),350)),Q(n?`Flashlight turned ON`:`Flashlight turned OFF`,n?`warning`:`info`);try{await p(`/cgi-bin/device?action=torch`+(K?`&serial=`+encodeURIComponent(K):``))}catch(e){console.error(`Torch error:`,e)}}async function ui(e,t){let n=K||`default`;t&&(t.classList.add(`btn-pulse`),setTimeout(()=>t.classList.remove(`btn-pulse`),350));let r=document.getElementById(`dispVolumeStatus`),i=document.getElementById(`dispVolumeSub`),a=document.getElementById(`btnVolSilent`);if(q.volume||(q.volume={}),q.silent||(q.silent={}),e===`silent`){let e=!q.silent[n];q.silent[n]=e,q.volume[n]=e?0:10,Br(),a&&(e?a.classList.add(`active-warning`):a.classList.remove(`active-warning`)),r&&(r.className=e?`setting-pill pill-amber`:`setting-pill`,r.textContent=e?`SILENT ON`:`MEDIA`),i&&(i.innerHTML=`<strong style="color:${e?`#f59e0b`:`var(--text-main)`};">Level: ${e?`MUTED`:`Volume 10`}</strong> &bull; Speaker media audio level`),Q(e?`Phone switched to Silent Mode`:`Silent mode deactivated`,`warning`)}else{let t=q.volume[n]===void 0?10:q.volume[n];t=e===`up`?Math.min(15,t+1):Math.max(0,t-1),q.volume[n]=t,q.silent[n]=t===0,Br(),r&&(r.className=`setting-pill pill-cyan`,r.textContent=e===`up`?`VOL +`:`VOL -`),i&&(i.innerHTML=`<strong style="color:${t===0?`#f59e0b`:`var(--text-main)`};">Level: ${t===0?`MUTED`:`Volume ${t}`}</strong> &bull; Speaker media audio level`),Q(`Volume adjusted (${e.toUpperCase()})`,`info`)}try{await p(`/cgi-bin/device?action=volume&cmd=`+encodeURIComponent(e)+(K?`&serial=`+encodeURIComponent(K):``))}catch(e){console.error(`Volume error:`,e)}}async function di(e){let t=K||`default`;q.screen[t]=`on`,q.screenAwake||(q.screenAwake={}),q.screenAwake[t]=!0,Br(),e&&(e.classList.add(`active-cyan`,`btn-pulse`),setTimeout(()=>e.classList.remove(`btn-pulse`),350));let n=document.getElementById(`btnDisplaySleep`);n&&n.classList.remove(`active-cyan`);let r=document.getElementById(`dispPowerStatus`),i=document.getElementById(`dispPowerSub`);r&&(r.className=`setting-pill pill-cyan`,r.textContent=`AWAKE`),i&&(i.innerHTML=`<strong style="color:#38bdf8;">State: AWAKE</strong> &bull; Handset touch display is active`),Q(`Waking phone screen...`,`info`);try{await p(`/cgi-bin/device?action=wake`+(K?`&serial=`+encodeURIComponent(K):``))}catch(e){console.error(e)}}async function fi(e){let t=K||`default`;q.screen[t]=`off`,q.screenAwake||(q.screenAwake={}),q.screenAwake[t]=!1,Br(),e&&(e.classList.add(`active-cyan`,`btn-pulse`),setTimeout(()=>e.classList.remove(`btn-pulse`),350));let n=document.getElementById(`btnDisplayWake`);n&&n.classList.remove(`active-cyan`);let r=document.getElementById(`dispPowerStatus`),i=document.getElementById(`dispPowerSub`);r&&(r.className=`setting-pill`,r.textContent=`SLEEPING`),i&&(i.innerHTML=`<strong style="color:var(--text-dim);">State: SLEEPING</strong> &bull; Handset touch display is powered down`),Q(`Screen put to sleep`,`info`);try{await p(`/cgi-bin/device?action=sleep`+(K?`&serial=`+encodeURIComponent(K):``))}catch(e){console.error(e)}}async function pi(e){if(!await Z(`Cycle phone cellular radio? Modem connection will temporarily drop.`,`Cycle Cellular Radio`,`Cycle Radio`,!0))return;if(e){e.classList.add(`active-cyan`,`btn-pulse`);let t=e.querySelector(`svg`);t&&t.classList.add(`spinning`),setTimeout(()=>{e.classList.remove(`active-cyan`,`btn-pulse`),t&&t.classList.remove(`spinning`)},1500)}let t=document.getElementById(`dispRadioStatus`);t&&(t.className=`setting-pill pill-amber`,t.textContent=`CYCLING...`),Q(`Cycling cellular radio (Airplane mode ON -> OFF)...`,`warning`);try{await p(`/cgi-bin/device?action=airplane`+(K?`&serial=`+encodeURIComponent(K):``)),setTimeout(()=>{t&&(t.className=`setting-pill pill-green`,t.textContent=`5G CONNECTED`),Q(`Cellular radio re-attached to network!`,`success`)},2e3)}catch(e){console.error(e)}}async function mi(e){if(await Z(`Reboot connected smartphone now? Internet tethering will pause until phone boots.`,`Reboot Phone`,`Reboot Device`,!0)){e&&(e.classList.add(`btn-pulse`),setTimeout(()=>e.classList.remove(`btn-pulse`),350)),Q(`ADB Reboot signal sent to phone!`,`error`);try{await p(`/cgi-bin/device?action=reboot`+(K?`&serial=`+encodeURIComponent(K):``))}catch(e){console.error(e)}}}var hi=[];async function gi(){let e=document.getElementById(`deviceActionStatus`);try{let t=await(await fetch(`/cgi-bin/device?action=lock`)).json();e&&(e.innerText=t.message||`Power/Lock button triggered`),setTimeout(Lr,1500)}catch(t){e&&(e.innerText=`Error: `+t.message)}}async function _i(){let e=document.getElementById(`deviceActionStatus`);try{let t=await(await fetch(`/cgi-bin/device?action=settings_tether`)).json();e&&(e.innerText=t.message||`Tether settings launched on phone`)}catch(t){e&&(e.innerText=`Error: `+t.message)}}async function vi(){let e=document.getElementById(`deviceContactsList`),t=document.getElementById(`devContactsBadge`);if(e)try{let e=await(await fetch(`/cgi-bin/device?action=contacts`)).json();hi=Array.isArray(e.contacts)?e.contacts:[],t&&(t.innerText=`${hi.length} CONTACTS`),bi(hi)}catch(t){e.innerHTML=`<div style="color:var(--text-dim); padding:10px; font-size:11px;">Failed to load contacts: `+$(t.message)+`</div>`}}function yi(e){if(!e||!e.trim()){bi(hi);return}let t=e.trim().toLowerCase();bi(hi.filter(e=>(e.name||``).toLowerCase().includes(t)||(e.number||``).includes(t)))}function bi(e){let t=document.getElementById(`deviceContactsList`);t&&(t.innerHTML=!e||e.length===0?`<div style="color:var(--text-dim); padding:12px; font-size:11.5px; text-align:center;">No contacts found.</div>`:e.map(e=>`
          <div class="contact-item-pill">
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="contact-avatar-dot">${(e.name||`C`).charAt(0).toUpperCase()}</div>
              <div>
                <div style="font-weight:700; color:var(--text-main); font-size:12px;">${$(e.name||`Unnamed`)}</div>
                <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-dim);">${$(e.number||`--`)}</div>
              </div>
            </div>
            <button class="mh-btn btn-sm btn-ghost" onclick="navigator.clipboard.writeText('${e.number||``}'); showToast('Copied ' + '${e.number||``}', 'success')" style="font-size:10px; padding:3px 7px;">COPY</button>
          </div>
        `).join(``))}async function xi(){let e=document.getElementById(`deviceCallsList`);if(e)try{let t=await(await fetch(`/cgi-bin/device?action=calls`)).json(),n=Array.isArray(t.calls)?t.calls:[];if(n.length===0){e.innerHTML=`<div style="color:var(--text-dim); padding:12px; font-size:11.5px; text-align:center;">No recent calls found in call log.</div>`;return}e.innerHTML=n.map(e=>{let t=e.type===`Incoming`?`emerald`:e.type===`Outgoing`?`cyan`:`rose`,n=parseInt(e.duration||0,10),r=n>60?Math.floor(n/60)+`m `+n%60+`s`:n+`s`;return`
            <div class="call-item-pill">
              <div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="card-badge ${t}" style="font-size:9px;">${e.type}</span>
                  <strong style="color:var(--text-main); font-size:12px;">${$(e.name||e.number)}</strong>
                </div>
                <div style="font-family:var(--font-mono); font-size:10.5px; color:var(--text-dim); margin-top:2px;">
                  ${$(e.number)} • Duration: ${r}
                </div>
              </div>
            </div>
          `}).join(``)}catch(t){e.innerHTML=`<div style="color:var(--text-dim); padding:10px; font-size:11px;">Failed to load call log: `+$(t.message)+`</div>`}}function Si(e){let t=e.files&&e.files[0],n=document.getElementById(`restoreFileLabel`),r=document.getElementById(`restoreFileSub`),i=document.getElementById(`btnRestoreSubmit`);if(t){let e=(t.size/1024).toFixed(1)+` KB`;n&&(n.innerHTML=`<span style="color:var(--mh-emerald);">[Selected] ${$(t.name)}</span>`),r&&(r.innerText=`Size: ${e} • Ready to restore`),i&&(i.style.display=`inline-flex`);let a=document.getElementById(`restoreConfirmBox`);a&&(a.style.display=`flex`)}else n&&(n.innerText=`Select or Drag & Drop Backup Archive (.tar.gz)`),r&&(r.innerText=`Click to browse your device for archive`),i&&(i.style.display=`none`)}function Ci(){let e=document.getElementById(`backupDropzone`),t=document.getElementById(`backupFileInput`);e&&t&&([`dragenter`,`dragover`].forEach(t=>{e.addEventListener(t,t=>{t.preventDefault(),t.stopPropagation(),e.classList.add(`dragover`)},!1)}),[`dragleave`,`drop`].forEach(t=>{e.addEventListener(t,t=>{t.preventDefault(),t.stopPropagation(),e.classList.remove(`dragover`)},!1)}),e.addEventListener(`drop`,e=>{let n=e.dataTransfer.files;n&&n.length>0&&(t.files=n,Si(t))},!1))}window.addEventListener(`load`,Ci);function wi(){let e=document.getElementById(`diagOutputBox`),t=document.getElementById(`btnToggleDiagRaw`);e&&t&&(e.style.display===`none`?(e.style.display=`block`,t.innerText=`HIDE RAW CONSOLE`):(e.style.display=`none`,t.innerText=`SHOW RAW CONSOLE`))}var J=null,Ti=null,Ei=!1;function Di(e,t){let n=document.getElementById(`settingsSaveStatusPill`),r=document.getElementById(`settingsSaveStatusText`);n&&r&&(n.className=`setting-save-pill`,e===`pending`||e===`saving`?(n.style.display=`inline-flex`,r.textContent=t||`Applying changes...`):e===`saved`?(n.classList.add(`saved`),n.style.display=`inline-flex`,r.textContent=t||`Saved`,setTimeout(()=>{n.classList.contains(`saved`)&&(n.style.display=`none`)},2200)):e===`error`?(n.classList.add(`error`),n.style.display=`inline-flex`,r.textContent=t||`Save failed`,setTimeout(()=>{n.classList.contains(`error`)&&(n.style.display=`none`)},3e3)):n.style.display=`none`)}function Oi(e=600){Ti&&clearTimeout(Ti),Di(`pending`,`Saving changes...`),Ti=setTimeout(()=>{ki()},e)}async function ki(){if(Ei){Ti=setTimeout(()=>ki(),800);return}Ei=!0,Di(`saving`,`Applying configuration...`);let e=document.getElementById(`netLanIp`),t=document.getElementById(`netMask`),n=document.getElementById(`netGateway`),r=document.getElementById(`netDns`),i=document.getElementById(`netMtu`),a=document.getElementById(`netDhcpStart`),o=document.getElementById(`netDhcpLimit`),s=document.getElementById(`netDhcpLease`),c=document.getElementById(`netDhcpMasterToggle`),l={action:`set`,hostname:document.getElementById(`netDeviceHostname`)?document.getElementById(`netDeviceHostname`).value.trim():``,custom_mac:document.getElementById(`netCustomMac`)?document.getElementById(`netCustomMac`).value.trim():``,reset_mac:document.getElementById(`netCustomMac`)&&document.getElementById(`netCustomMac`).dataset.reset===`1`?1:0,lan_ip:e?e.value.trim():`10.0.0.1`,netmask:t?t.value.trim():`255.255.255.0`,gateway:n?n.value.trim():``,mtu:i?i.value.trim():`1500`,dns:r?r.value.trim():``,dhcp_start:a?a.value.trim():`100`,dhcp_limit:o?o.value.trim():`150`,dhcp_leasetime:s?s.value.trim():`12h`,dhcp_ignore:c&&c.checked?0:1,ipv6_enabled:document.getElementById(`netIpv6MasterToggle`)&&document.getElementById(`netIpv6MasterToggle`).checked?1:0,ipv6_wan_mode:document.getElementById(`netIpv6WanMode`)?document.getElementById(`netIpv6WanMode`).value:`dhcpv6`,ipv6_ra:document.getElementById(`netIpv6RaToggle`)&&document.getElementById(`netIpv6RaToggle`).checked?1:0,ipv6_dhcp6:document.getElementById(`netIpv6Dhcp6Toggle`)&&document.getElementById(`netIpv6Dhcp6Toggle`).checked?1:0,ipv6_ula:document.getElementById(`netIpv6Ula`)?document.getElementById(`netIpv6Ula`).value:`fd00::/48`,ipv6_privacy:document.getElementById(`netIpv6PrivacyToggle`)&&document.getElementById(`netIpv6PrivacyToggle`).checked?1:0,flow_offloading:document.getElementById(`netSwFlowToggle`)&&document.getElementById(`netSwFlowToggle`).checked?1:0,flow_offloading_hw:document.getElementById(`netHwFlowToggle`)&&document.getElementById(`netHwFlowToggle`).checked?1:0,mss_clamping:document.getElementById(`netMssClampToggle`)&&document.getElementById(`netMssClampToggle`).checked?1:0,dns_rebind:document.getElementById(`netDnsRebindToggle`)&&document.getElementById(`netDnsRebindToggle`).checked?1:0};try{await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(l)})).json(),Di(`saved`,`Configuration Saved`)}catch(e){console.error(`Auto-save network error:`,e),Di(`error`,`Update Failed`)}finally{Ei=!1}}function Ai(e,t){e&&(e.innerHTML=`<svg viewBox="0 0 24 24"><path d="M5 3h12l4 4v14H3V3z"/><path d="M7 3v6h10V3M7 21v-7h10v7"/></svg><span>${$(t||`SAVE`)}</span>`,e.setAttribute(`aria-label`,t||`Save`),e.title=t||`Save`)}function ji(e){if(e===`pppoe_server_users`){O(`acc-pppoe-users`);return}J=e;let t=document.getElementById(`settingEditModalOverlay`),n=document.getElementById(`settingModalTitle`),r=document.getElementById(`settingModalDesc`),i=document.getElementById(`settingModalBody`),a=document.getElementById(`btnModalSave`);if(!t||!i)return;if(a&&(a.disabled=!1,Ai(a,`SAVE`)),e===`topology_add_node`)n.textContent=`Add Network Device`,r.textContent=``,Ai(a,`ADD`),i.innerHTML=`
          <div class="topo-add-node-note">Choose the parent device and its LAN port. This manual link works even when DHCP cannot reveal the physical path.</div>
          <label class="mh-label" for="modalTopoNodeName">Device name</label>
          <input id="modalTopoNodeName" class="mh-input" type="text" maxlength="64" placeholder="e.g. Office Router">
          <label class="mh-label" for="modalTopoNodeType">Device type</label>
          <select id="modalTopoNodeType" class="mh-input">
            <option value="router">Router</option>
            <option value="ap">Access point</option>
            <option value="switch">Ethernet switch</option>
          </select>
          <label class="mh-label" for="modalTopoParentPort">Connected from</label>
          <select id="modalTopoParentPort" class="mh-input">${Rc()}</select>
          <label class="mh-label" for="modalTopoNodeIp">Management IP <span class="topo-add-node-note">optional</span></label>
          <input id="modalTopoNodeIp" class="mh-input" type="text" inputmode="decimal" placeholder="Learned by DHCP or enter manually">
          <label class="mh-label" for="modalTopoNodeMac">MAC address <span class="topo-add-node-note">optional</span></label>
          <input id="modalTopoNodeMac" class="mh-input" type="text" placeholder="AA:BB:CC:DD:EE:FF">
        `;else if(e===`topology_type`){n.textContent=`Topology Type`,r.textContent=``,Ai(a,`APPLY`);let e=window._topoTree?.discovery_mode||`live`;i.innerHTML=`<div class="topology-type-options">${[[`live`,`Live bridge & Wi-Fi`,`Use live router port data, client MAC addresses, and Wi-Fi associations.`],[`mac`,`MAC address map`,`Match clients by hardware address; clients without a MAC are not auto-mapped.`],[`ip`,`IP / DHCP neighbor map`,`Map clients using their current IP and LAN port information.`],[`wireless`,`Wi-Fi associations only`,`Auto-update Wi-Fi clients while leaving wired port placement alone.`],[`manual`,`Manual topology`,`Pause discovery and keep your edited topology exactly as configured.`]].map(([t,n,r])=>`
          <label class="topology-type-option">
            <input type="radio" name="topologyDiscoveryMode" value="${t}" ${e===t?`checked`:``}>
            <span class="topology-type-option-copy"><strong>${n}</strong><small>${r}</small></span>
          </label>
        `).join(``)}</div>`}else if(e===`pppoe_user_add`)n.textContent=`Add Subscriber`,r.textContent=``,Ai(a,`ADD`),i.innerHTML=`
          <div class="pppoe-user-add-fields">
            <input type="text" id="modalInput_new_pppoe_u" class="mh-input" maxlength="128" autocomplete="username" placeholder="Subscriber username">
            <div class="pppoe-password-input-wrap">
              <input type="password" id="modalInput_new_pppoe_p" class="mh-input" maxlength="256" autocomplete="new-password" placeholder="Password">
              <button type="button" class="pppoe-password-reveal" onclick="togglePppoePasswordInput('modalInput_new_pppoe_p', this)" title="Show password" aria-label="Show password">
                <svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
        `;else if(e===`ntp_server`)n.textContent=`Add NTP Server`,r.textContent=`Enter a hostname for the router time synchronization server.`,Ai(a,`ADD SERVER`),i.innerHTML=`<div><label for="modalInput_ntp_server" style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block;">Server hostname</label><input type="text" id="modalInput_ntp_server" class="mh-input" maxlength="253" autocomplete="off" spellcheck="false" placeholder="time.cloudflare.com" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);"></div>`;else if(e===`system_date`)n.textContent=`Set Date & Time`,r.textContent=``,Ai(a,`SAVE`),i.innerHTML=`<input type="datetime-local" id="modalInput_system_date" class="mh-input" aria-label="Choose date and time" value="${$(document.getElementById(`systemDateTimeInput`)?.value||``)}" style="width:100%; box-sizing:border-box;">`;else if(e===`system_timezone`)n.textContent=`Select Timezone`,r.textContent=``,Ai(a,`SAVE`),i.innerHTML=`<input type="search" id="systemTimezoneSearch" class="mh-input" aria-label="Search timezones" placeholder="Search timezone" oninput="filterSystemTimezoneOptions(this.value)"><div id="systemTimezoneOptions" class="system-timezone-options"></div>`;else if(e===`device_hostname`)n.textContent=`Device Hostname`,r.textContent=`System hostname of this router across local network, DNS queries, and DHCP announcements.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Router Hostname</label>
            <input type="text" id="modalInput_device_hostname" class="mh-input" value="${$((document.getElementById(`netDeviceHostname`)?document.getElementById(`netDeviceHostname`).value:`Maxnet-Gateway`)||`Maxnet-Gateway`)}" placeholder="Maxnet-Gateway" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Quick Suggestions:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_device_hostname').value='Maxnet-Gateway'">Maxnet-Gateway</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_device_hostname').value='MAXNET-GATEWAY'">MAXNET-GATEWAY</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_device_hostname').value='Router-Main'">Router-Main</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_device_hostname').value='Home-Gateway'">Home-Gateway</button>
            </div>
          </div>
        `;else if(e===`custom_mac`){n.textContent=`Custom MAC Address (Hardware Cloning)`,r.textContent=`Override the bridge interface (br-lan) MAC address. Useful for ISP clone requirements or privacy.`;let e=(document.getElementById(`netCustomMac`)?document.getElementById(`netCustomMac`).value:``)||``,t=(document.getElementById(`netHwMac`)?document.getElementById(`netHwMac`).value:`ca:e7:b7:34:8f:ac`)||`ca:e7:b7:34:8f:ac`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Custom MAC Address (XX:XX:XX:XX:XX:XX)</label>
            <input type="text" id="modalInput_custom_mac" class="mh-input" value="${$(e)}" placeholder="${$(t)} (Default Hardware)" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono); line-height:1.4;">
            Hardware Factory MAC: <span style="color:var(--text-main); font-weight:700;">${$(t)}</span>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:4px;">
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_custom_mac').value='${$(t)}'">Use Factory Hardware MAC</button>
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_custom_mac').value=''">Reset to Default (No Override)</button>
            <button type="button" class="dns-preset-pill" onclick="generateRandomMacInModal()">Generate Random MAC</button>
          </div>
        `}else if(e===`client_history_days`)n.textContent=`Client History Retention`,r.textContent=`Select duration to retain per-device bandwidth and DHCP client logs`,i.innerHTML=`
          <div class="mh-form-group">
            <label class="mh-label">Retention Period (Days)</label>
            <select id="modalSelect_client_history" class="mh-input" style="width:100%; box-sizing:border-box;">
              <option value="7">7 Days</option>
              <option value="15" selected>15 Days (Default)</option>
              <option value="30">30 Days (1 Month)</option>
              <option value="60">60 Days (2 Months)</option>
              <option value="90">90 Days (Quarterly)</option>
            </select>
          </div>
        `;else if(e===`lan_ip`)n.textContent=`Gateway IP Address`,r.textContent=`Primary IPv4 address for the bridge router interface (br-lan). Default is 10.0.0.1.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">IPv4 Address</label>
            <input type="text" id="modalInput_lan_ip" class="mh-input" value="${$(document.getElementById(`netLanIp`).value||`10.0.0.1`)}" placeholder="10.0.0.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`net_mask`){n.textContent=`Subnet Mask / CIDR`,r.textContent=`Subnet mask and network prefix length for local DHCP and address allocation.`;let e=document.getElementById(`netMask`).value||`255.255.255.0`,t=document.getElementById(`netCidrSelect`).value||`24`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Subnet Mask</label>
            <input type="text" id="modalInput_net_mask" class="mh-input" value="${$(e)}" placeholder="255.255.255.0" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);" oninput="onModalMaskInput(this.value)">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Prefix Size (CIDR)</label>
            <select id="modalSelect_cidr" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);" onchange="onModalCidrChange(this.value)">
              <option value="24" ${t===`24`?`selected`:``}>/24 (255.255.255.0 &bull; 254 hosts)</option>
              <option value="16" ${t===`16`?`selected`:``}>/16 (255.255.0.0 &bull; 65534 hosts)</option>
              <option value="8" ${t===`8`?`selected`:``}>/8 (255.0.0.0 &bull; Class A)</option>
              <option value="custom" ${t===`custom`?`selected`:``}>Custom</option>
            </select>
          </div>
        `}else if(e===`net_gateway`)n.textContent=`Default Upstream Gateway`,r.textContent=`Optional static upstream gateway IP (br-lan). Leave blank for auto or direct modem routing.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Gateway IPv4</label>
            <input type="text" id="modalInput_gateway" class="mh-input" value="${$(document.getElementById(`netGateway`).value||``)}" placeholder="Optional (e.g. 10.0.0.254)" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`net_mtu`)n.textContent=`Interface MTU Size`,r.textContent=`Maximum Transmission Unit in bytes. Standard Ethernet MTU is 1500 (range: 576 - 9000).`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">MTU Bytes</label>
            <input type="number" id="modalInput_mtu" class="mh-input" min="576" max="9000" value="${$(document.getElementById(`netMtu`).value||`1500`)}" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`dhcp_pool`){n.textContent=`DHCP Address Pool`,r.textContent=`Configure dynamic IP allocation range and lease duration for connected DHCP clients.`;let e=document.getElementById(`netDhcpStart`).value||`100`,t=document.getElementById(`netDhcpLimit`).value||`150`,a=document.getElementById(`netDhcpLease`).value||`12h`;i.innerHTML=`
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Start Offset</label>
              <input type="number" id="modalInput_dhcp_start" class="mh-input" min="2" max="250" value="${$(e)}" style="width:100%; padding:8px 10px; font-size:12px; font-family:var(--font-mono);">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Pool Limit</label>
              <input type="number" id="modalInput_dhcp_limit" class="mh-input" min="5" max="250" value="${$(t)}" style="width:100%; padding:8px 10px; font-size:12px; font-family:var(--font-mono);">
            </div>
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Lease Duration</label>
            <select id="modalSelect_dhcp_lease" class="mh-input" style="width:100%; padding:8px 10px; font-size:12px; font-family:var(--font-mono);">
              <option value="12h" ${a===`12h`?`selected`:``}>12 Hours (12h - Recommended)</option>
              <option value="24h" ${a===`24h`?`selected`:``}>24 Hours (24h)</option>
              <option value="48h" ${a===`48h`?`selected`:``}>48 Hours (48h)</option>
              <option value="7d" ${a===`7d`?`selected`:``}>7 Days (7d)</option>
              <option value="infinite" ${a===`infinite`?`selected`:``}>Infinite Lease</option>
            </select>
          </div>
        `}else if(e===`custom_dns`)n.textContent=`Custom DNS Nameservers`,r.textContent=`High-speed upstream resolvers for domain queries. Multiple servers can be separated by spaces.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">DNS Resolvers (Space Separated)</label>
            <input type="text" id="modalInput_dns" class="mh-input" value="${$(document.getElementById(`netDns`).value||`1.1.1.1 8.8.8.8`)}" placeholder="1.1.1.1 8.8.8.8" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Quick Presets:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dns').value='1.1.1.1 1.0.0.1'">Cloudflare (1.1.1.1)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dns').value='8.8.8.8 8.8.4.4'">Google (8.8.8.8)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dns').value='9.9.9.9 149.112.112.112'">Quad9 Secure</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dns').value='94.140.14.14 94.140.15.15'">AdGuard Block</button>
            </div>
          </div>
        `;else if(e===`add_static_lease`)n.textContent=`Add Static IP Reservation`,r.textContent=`Bind a static IPv4 address to a client MAC hardware address for consistent network addressing.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Device Name / Hostname</label>
            <input type="text" id="modalInput_lease_name" class="mh-input" placeholder="e.g. Synology-NAS" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">MAC Address (AA:BB:CC:DD:EE:FF)</label>
            <input type="text" id="modalInput_lease_mac" class="mh-input" placeholder="00:11:22:33:44:55" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Static IPv4 Address</label>
            <input type="text" id="modalInput_lease_ip" class="mh-input" placeholder="10.0.0.50" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`ts_hostname`)n.textContent=`Tailscale Node Hostname`,r.textContent=`Set device hostname advertised to your private Tailscale network nodes and MagicDNS.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Node Hostname</label>
            <input type="text" id="modalInput_ts_hostname" class="mh-input" value="${$(document.getElementById(`tsHostname`)?document.getElementById(`tsHostname`).value:`Maxnet-Gateway`)}" placeholder="Maxnet-Gateway" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`ts_authkey`)n.textContent=`Tailscale Auth Key`,r.textContent=`Pre-authenticated auth key (tskey-auth-...) from your Tailscale admin console to connect this router.`,a&&Ai(a,`CONNECT`),i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Auth Key</label>
            <input type="password" id="modalInput_ts_authkey" class="mh-input" placeholder="tskey-auth-..." style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`change_password`){let e=window._rootHasPassword!==!1;n.textContent=e?`Change Root Administrator Password`:`Set Root Administrator Password`,r.textContent=e?`Update master administrator credentials for Web UI access and Dropbear SSH console.`:`No administrator password is currently set on this router. Create a secure password for Web UI and Dropbear SSH.`,i.innerHTML=`
          ${e?`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Current Password</label>
            <input type="password" id="modalInput_pwd_old" class="mh-input" placeholder="Existing password" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `:``}
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">New Password</label>
            <input type="password" id="modalInput_pwd_new" class="mh-input" placeholder="Enter new password (min. 4 chars)" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:10px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Confirm New Password</label>
            <input type="password" id="modalInput_pwd_confirm" class="mh-input" placeholder="Re-enter new password" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `,fetch(`/cgi-bin/auth?action=check_root_pass`).then(e=>e.json()).then(e=>{if(e&&e.status===`ok`){let t=!!e.has_password;t!==window._rootHasPassword&&(window._rootHasPassword=t,window._isSettingModalOpen&&window._currentSettingModalKey===`change_password`&&ji(`change_password`))}}).catch(()=>{})}else if(e===`smb_credentials`)n.textContent=`Samba Share Credentials`,r.textContent=`Configure authenticated Samba / CIFS login user and password for /mnt/pendrive.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Share Username</label>
            <input type="text" id="modalInput_smb_user" class="mh-input" value="${$((document.getElementById(`smbUsernameInput`)?document.getElementById(`smbUsernameInput`).value:`max`)||`max`)}" placeholder="e.g. max" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">New Share Password</label>
            <input type="password" id="modalInput_smb_pass" class="mh-input" placeholder="Enter share password" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`pkg_install`)n.textContent=`Install Gateway Package`,r.textContent=`Enter package name (e.g. htop, tcpdump, curl, iperf3, wireguard-tools) to install from MAXNET package repository.`,a&&Ai(a,`INSTALL`),i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Package Name</label>
            <input type="text" id="modalInput_pkg_name" class="mh-input" placeholder="e.g. htop" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`diag_ping_size`)n.textContent=`ICMP Payload Buffer Size`,r.textContent=`Configure ICMP echo request payload byte size (default 56 bytes, min 0, max 65507).`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Payload Size (Bytes)</label>
            <input type="number" id="modalInput_ping_size" class="mh-input" min="0" max="65507" value="${$((document.getElementById(`diagPingSize`)?document.getElementById(`diagPingSize`).value:`56`)||`56`)}" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`diag_dns_server`)n.textContent=`DNS Resolver Nameserver`,r.textContent=`Upstream DNS server IPv4 address to inspect and trace queries (default: router br-lan 10.0.0.1).`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">DNS Server IPv4</label>
            <input type="text" id="modalInput_dns_server" class="mh-input" value="${$((document.getElementById(`diagDnsServerInput`)?document.getElementById(`diagDnsServerInput`).value:`10.0.0.1`)||`10.0.0.1`)}" placeholder="10.0.0.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`diag_ports_list`)n.textContent=`Custom Audit Ports List`,r.textContent=`Specify comma-separated TCP/UDP ports to scan (e.g. 21, 22, 80, 443, 8080).`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Target Ports</label>
            <textarea id="modalTextarea_ports_list" class="mh-input" rows="5" style="width:100%; font-size:11.5px; font-family:var(--font-mono); resize:vertical; padding:8px 10px; line-height:1.4;">${$((document.getElementById(`diagPortsListInput`)?document.getElementById(`diagPortsListInput`).value:``)||``)}</textarea>
          </div>
        `;else if(e===`ipv6_wan_mode`){n.textContent=`WAN IPv6 Address Assignment`,r.textContent=`Select how the router requests and delegates public IPv6 prefixes from the upstream ISP or tethered modem.`;let e=(document.getElementById(`netIpv6WanMode`)?document.getElementById(`netIpv6WanMode`).value:`dhcpv6`)||`dhcpv6`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Assignment Protocol</label>
            <select id="modalSelect_ipv6_wan_mode" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="dhcpv6" ${e===`dhcpv6`?`selected`:``}>DHCPv6-PD &amp; SLAAC (Automatic Stateful Prefix Delegation)</option>
              <option value="slaac" ${e===`slaac`?`selected`:``}>SLAAC Only (Stateless Autoconfiguration)</option>
              <option value="static" ${e===`static`?`selected`:``}>Static IPv6 Address</option>
              <option value="disabled" ${e===`disabled`?`selected`:``}>Disabled (No WAN IPv6)</option>
            </select>
          </div>
        `}else if(e===`ipv6_ula`)n.textContent=`Unique Local IPv6 Prefix (ULA)`,r.textContent=`Configure RFC 4193 Unique Local Address prefix for private local routing (e.g. fd00::/48 or fd80:beef::/48).`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">ULA Network Prefix</label>
            <input type="text" id="modalInput_ipv6_ula" class="mh-input" value="${$((document.getElementById(`netIpv6Ula`)?document.getElementById(`netIpv6Ula`).value:`fd00::/48`)||`fd00::/48`)}" placeholder="fd00::/48" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`wan_proto`){n.textContent=`WAN Connection Protocol`,r.textContent=`Select upstream carrier ISP protocol used by physical or USB WAN.`;let e=(document.getElementById(`wanProtoSelect`)?document.getElementById(`wanProtoSelect`).value:`dhcp`)||`dhcp`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Protocol Type</label>
            <select id="modalSelect_wan_proto" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);" onchange="const n=document.getElementById('wanProtoPppoeNotice'); if(n)n.style.display=this.value==='pppoe'?'block':'none';">
              <option value="dhcp" ${e===`dhcp`?`selected`:``}>DHCP Client (Dynamic IPv4 - Standard)</option>
              <option value="pppoe" ${e===`pppoe`?`selected`:``}>PPPoE (Fiber / DSL Session Dial-up)</option>
              <option value="static" ${e===`static`?`selected`:``}>Static IPv4 (Fixed Gateway Address)</option>
            </select>
          </div>
          <div id="wanProtoPppoeNotice" style="display:${e===`pppoe`?`block`:`none`}; padding:8px 10px; background:rgba(6,182,212,0.08); border-radius:6px; border:1px solid rgba(6,182,212,0.2); font-size:11px; color:#38bdf8; font-family:var(--font-mono);">
            PPPoE ISP credentials, client dialer, and AC settings are managed in the dedicated PPPoE Broadband panel.
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Quick Presets:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalSelect_wan_proto').value='dhcp'; const n=document.getElementById('wanProtoPppoeNotice'); if(n)n.style.display='none';">DHCP Dynamic</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalSelect_wan_proto').value='pppoe'; const n=document.getElementById('wanProtoPppoeNotice'); if(n)n.style.display='block';">PPPoE Fiber</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalSelect_wan_proto').value='static'; const n=document.getElementById('wanProtoPppoeNotice'); if(n)n.style.display='none';">Static IPv4</button>
            </div>
          </div>
        `}else if(e===`webhook_tg_token`)n.textContent=`Telegram Bot Token`,r.textContent=`Enter API bot token generated by @BotFather on Telegram (e.g. 123456:ABC-DEF...).`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Bot Token</label>
            <input type="text" id="modalInput_tg_token" class="mh-input" value="${$(window._cachedWebhooksConfig?.telegram?.bot_token||``)}" placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`webhook_tg_chat_id`)n.textContent=`Telegram Chat ID`,r.textContent=`Target Telegram Chat ID or Channel ID where alert messages will be dispatched.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Chat ID (Numeric or @channel)</label>
            <input type="text" id="modalInput_tg_chat_id" class="mh-input" value="${$(window._cachedWebhooksConfig?.telegram?.chat_id||``)}" placeholder="e.g. 987654321 or -100..." style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`webhook_discord_url`)n.textContent=`Discord Webhook URL`,r.textContent=`Webhook URL from Discord Channel Settings -> Integrations -> Webhooks.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Webhook URL</label>
            <input type="text" id="modalInput_discord_url" class="mh-input" value="${$(window._cachedWebhooksConfig?.discord?.webhook_url||``)}" placeholder="https://discord.com/api/webhooks/..." style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`webhook_ntfy_url`)n.textContent=`ntfy.sh Topic URL`,r.textContent=`ntfy.sh server or topic endpoint for instant push alerts to phone/desktop.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Topic URL</label>
            <input type="text" id="modalInput_ntfy_url" class="mh-input" value="${$(window._cachedWebhooksConfig?.ntfy?.topic_url||`https://ntfy.sh/maxnet-alerts`)}" placeholder="https://ntfy.sh/maxnet-alerts" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`webhook_data_quota`)n.textContent=`Data Quota Alert Threshold`,r.textContent=`Specify bandwidth consumption limit in Megabytes. When any client exceeds this threshold, an alert notification is dispatched.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Threshold Limit (MB)</label>
            <input type="number" id="modalInput_data_quota" class="mh-input" value="${$(window._cachedWebhooksConfig?.data_quota_mb||1024)}" placeholder="1024" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Quick Presets:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_data_quota').value='500'">500 MB</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_data_quota').value='1024'">1024 MB (1 GB)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_data_quota').value='2048'">2048 MB (2 GB)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_data_quota').value='5120'">5120 MB (5 GB)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_data_quota').value='10240'">10240 MB (10 GB)</button>
            </div>
          </div>
        `;else if(e===`webhook_custom_ip`)n.textContent=`Monitored Watchdog Target IP`,r.textContent=`Enter local or remote IPv4 address to monitor for online/offline reachability alerts.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Target Host IP</label>
            <input type="text" id="modalInput_custom_ip_target" class="mh-input" value="${$(window._cachedWebhooksConfig?.custom_ip_target||`10.0.0.2`)}" placeholder="10.0.0.2" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Quick Suggestions:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_custom_ip_target').value='10.0.0.2'">10.0.0.2 (Router B)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_custom_ip_target').value='10.0.0.5'">10.0.0.5 (NAS Storage)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_custom_ip_target').value='10.0.0.100'">10.0.0.100 (CCTV Server)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_custom_ip_target').value='1.1.1.1'">1.1.1.1 (Cloudflare)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_custom_ip_target').value='8.8.8.8'">8.8.8.8 (Google DNS)</button>
            </div>
          </div>
        `;else if(e===`restart_usb_modem`)n.textContent=`Restart USB Modem / Hardware`,r.textContent=`Choose which connected USB modem interface to reset & renew DHCP lease, or reboot physical phone via ADB.`,a&&Ai(a,`RESTART`),i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Target USB Interface</label>
            <select id="modalSelect_restart_target" class="mh-input" style="width:100%; box-sizing:border-box;">
              <option value="all">All Connected USB Modems</option>
              ${(window._cachedUsbWanData?.devices||[]).map(e=>`<option value="${$(e.id)}">${$(e.id)} (${$(e.ip||`--`)}) - ${$(e.name||`Modem`)}</option>`).join(``)}
            </select>
          </div>
          <div style="margin-top:14px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:8px; display:block; font-family:var(--font-mono);">Action Type</label>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <label style="display:flex; align-items:flex-start; gap:8px; cursor:pointer; font-size:12px; line-height:1.4;">
                <input type="radio" name="usb_restart_mode" value="soft" checked style="margin-top:2px;">
                <span><strong>Interface Soft Reset &amp; Renew DHCP</strong><br><span style="color:var(--text-dim);">Re-cycles interface link and gets fresh IP from carrier. Zero downtime for phone.</span></span>
              </label>
              <label style="display:flex; align-items:flex-start; gap:8px; cursor:pointer; font-size:12px; line-height:1.4;">
                <input type="radio" name="usb_restart_mode" value="adb" style="margin-top:2px;">
                <span><strong>Reboot Phone Hardware via ADB</strong><br><span style="color:var(--text-dim);">Dispatches hardware reboot signal to restart the physical Android smartphone.</span></span>
              </label>
            </div>
          </div>
          <div id="usbRestartModalStatus" style="margin-top:12px; font-size:12px; font-family:var(--font-mono); color:var(--primary); min-height:18px;"></div>
          <div style="margin-top:14px; padding-top:10px; border-top:1px solid var(--border-sub);">
            <a href="javascript:void(0)" onclick="closeSettingModal(); openSettingPage('acc-adb-device');" style="color:var(--primary, #0ea5e9); font-size:12px; text-decoration:none; font-weight:600;">Manage Phone Hardware Controls in ADB Devices &rarr;</a>
          </div>
        `;else if(e===`wan_static_ip`)n.textContent=`Static IPv4 Address`,r.textContent=`Fixed IPv4 address assigned to the router by your upstream provider.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Static IPv4 Address</label>
            <input type="text" id="modalInput_wan_static_ip" class="mh-input" value="${$((document.getElementById(`wanStaticIp`)?document.getElementById(`wanStaticIp`).value:`192.168.1.2`)||`192.168.1.2`)}" placeholder="192.168.1.2" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Common Suggestions:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_ip').value='192.168.1.2'">192.168.1.2</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_ip').value='192.168.0.2'">192.168.0.2</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_ip').value='10.0.1.2'">10.0.1.2</button>
            </div>
          </div>
        `;else if(e===`wan_static_netmask`)n.textContent=`Subnet Netmask`,r.textContent=`IPv4 subnet mask for static WAN.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Subnet Mask</label>
            <input type="text" id="modalInput_wan_static_netmask" class="mh-input" value="${$((document.getElementById(`wanStaticNetmask`)?document.getElementById(`wanStaticNetmask`).value:`255.255.255.0`)||`255.255.255.0`)}" placeholder="255.255.255.0" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Mask Presets:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_netmask').value='255.255.255.0'">255.255.255.0 (/24)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_netmask').value='255.255.0.0'">255.255.0.0 (/16)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_netmask').value='255.255.255.240'">255.255.255.240 (/28)</button>
            </div>
          </div>
        `;else if(e===`wan_static_gateway`)n.textContent=`Default Gateway Router`,r.textContent=`IP address of upstream carrier router or gateway modem.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Gateway IP</label>
            <input type="text" id="modalInput_wan_static_gateway" class="mh-input" value="${$((document.getElementById(`wanStaticGateway`)?document.getElementById(`wanStaticGateway`).value:`192.168.1.1`)||`192.168.1.1`)}" placeholder="192.168.1.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Common Gateways:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_gateway').value='192.168.1.1'">192.168.1.1</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_gateway').value='192.168.0.1'">192.168.0.1</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_gateway').value='10.0.1.1'">10.0.1.1</button>
            </div>
          </div>
        `;else if(e===`wan_custom_mac`)n.textContent=`WAN Cloned MAC Address`,r.textContent=`Override WAN interface MAC address. Useful for ISPs that bind connectivity to a specific router or PC MAC.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Cloned MAC Address (XX:XX:XX:XX:XX:XX)</label>
            <input type="text" id="modalInput_wan_custom_mac" class="mh-input" value="${$((document.getElementById(`wanCustomMacInput`)?document.getElementById(`wanCustomMacInput`).value:``)||``)}" placeholder="Default Hardware (No Override)" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:4px;">
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_custom_mac').value=''">Reset to Default (No Override)</button>
            <button type="button" class="dns-preset-pill" onclick="cloneCurrentPcMacToModal()">Clone Current PC MAC</button>
            <button type="button" class="dns-preset-pill" onclick="generateRandomWanMacInModal()">Generate Random MAC</button>
          </div>
        `;else if(e===`dufs_url`){n.textContent=`WebDAV Network Share`,r.textContent=`Connect any device on your local network to browse, stream, and manage USB storage files.`;let e=window.location.hostname||`10.0.0.1`,t=document.getElementById(`dufsPortInput`)?.value||5e3,o=`${window.location.protocol||`http:`}//${e}:${t}/`;a&&Ai(a,`DONE`),i.innerHTML=`
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:12px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <span style="font-size:13px; font-weight:700; color:#38bdf8; font-family:var(--font-mono); word-break:break-all;">${o}</span>
            <button type="button" class="mh-btn btn-sm" onclick="navigator.clipboard.writeText('${o}'); if(typeof showToast==='function')showToast('Copied: ${o}');" style="background:#10b981; color:#0b1120; font-weight:700; padding:6px 12px; font-size:11px; white-space:nowrap;">COPY</button>
          </div>
          <div style="font-size:11.5px; color:var(--text-dim); line-height:1.5;">
            <strong>Windows Explorer</strong>: Right-click &quot;This PC&quot; &rarr; <em>Map Network Drive</em> &rarr; Paste <code>${o}</code><br>
            <strong>macOS Finder</strong>: Go &rarr; <em>Connect to Server</em> (Cmd+K) &rarr; Paste <code>${o}</code><br>
            <strong>Android / iOS</strong>: Open VLC, Solid Explorer, or Cx File Explorer &rarr; Add WebDAV &rarr; Server: <code>${e}</code>, Port: <code>${t}</code>.
          </div>
        `}else if(e===`dufs_port`)n.textContent=`WebDAV & File Manager Port`,r.textContent=`TCP listening port for WebDAV file sharing and web browser file management.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">TCP Port Number</label>
            <input type="number" id="modalInput_dufs_port" class="mh-input" value="${$((document.getElementById(`dufsPortInput`)?document.getElementById(`dufsPortInput`).value:`5000`)||`5000`)}" min="1" max="65535" placeholder="5000" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Common Port Presets:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_port').value='5000'">5000 (Default Standard)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_port').value='8080'">8080</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_port').value='8888'">8888</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_port').value='9000'">9000</button>
            </div>
          </div>
        `;else if(e===`dufs_path`)n.textContent=`Storage Mount Directory`,r.textContent=`Filesystem directory shared over WebDAV and the web file manager.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Mount Directory Path</label>
            <input type="text" id="modalInput_dufs_path" class="mh-input" value="${$((document.getElementById(`dufsPathInput`)?document.getElementById(`dufsPathInput`).value:`/mnt/storage`)||`/mnt/storage`)}" placeholder="/mnt/storage" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Common Mount Points:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_path').value='/mnt/storage'">/mnt/storage (USB Root)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_path').value='/mnt/pendrive'">/mnt/pendrive</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_path').value='/tmp'">/tmp (RAM Disk)</button>
            </div>
          </div>
        `;else if(e===`dufs_permissions`){n.textContent=`File Access & Upload Policy`,r.textContent=`Select permissions granted to WebDAV clients and web file manager users.`;let e=document.getElementById(`dufsAllowUpload`)?.value!==`false`,t=document.getElementById(`dufsAllowDelete`)?.value!==`false`,a=`full`;a=e&&t?`full`:e?`upload_only`:`readonly`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Access Level</label>
            <select id="modalSelect_dufs_mode" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="full" ${a===`full`?`selected`:``}>Full Access (Browse, Upload, and Delete)</option>
              <option value="upload_only" ${a===`upload_only`?`selected`:``}>Upload Only (Browse &amp; Upload, No Deletion)</option>
              <option value="readonly" ${a===`readonly`?`selected`:``}>Read-Only (Browse and Download Only)</option>
            </select>
          </div>
        `}else if(e===`dufs_auth`)n.textContent=`WebDAV Access Authentication`,r.textContent=`Configure login credentials for WebDAV and File Manager. Leave blank for open anonymous access.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">WebDAV Username</label>
            <input type="text" id="modalInput_dufs_user" class="mh-input" value="${$((document.getElementById(`dufsUserInput`)?document.getElementById(`dufsUserInput`).value:``)||``)}" placeholder="Leave blank for open access" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:10px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">WebDAV Password</label>
            <input type="password" id="modalInput_dufs_pass" class="mh-input" placeholder="Leave blank for open access" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:12px; display:flex; gap:8px;">
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_user').value=''; document.getElementById('modalInput_dufs_pass').value='';">Clear Credentials (Open Access)</button>
          </div>
        `;else if(e===`pppoe_client_creds`)n.textContent=`PPPoE Client Credentials`,r.textContent=`Configure broadband account username and password assigned by your Internet Service Provider (ISP).`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">PPPoE Username</label>
            <input type="text" id="modalInput_pppoe_user" class="mh-input" value="${$(window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.username||``)}" placeholder="e.g. broadband@isp.com" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:10px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">PPPoE Password</label>
            <input type="password" id="modalInput_pppoe_pass" class="mh-input" placeholder="Enter ISP password" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`pppoe_client_ac`){n.textContent=`Access Concentrator & Service`,r.textContent=`Optional Access Concentrator (AC) name and Service Name. Leave empty for automatic discovery.`;let e=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.ac||``,t=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.service||``;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Access Concentrator (AC) Name (Optional)</label>
            <input type="text" id="modalInput_pppoe_ac" class="mh-input" value="${$(e)}" placeholder="Auto / Any AC" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:10px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Service Name (Optional)</label>
            <input type="text" id="modalInput_pppoe_service" class="mh-input" value="${$(t)}" placeholder="Auto / Default Service" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `}else if(e===`pppoe_client_mac`){n.textContent=`Custom MAC Clone & MTU Size`,r.textContent=`Override the WAN MAC address for ISP hardware binding, and configure PPPoE MTU (Standard 1492).`;let e=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.macaddr||``,t=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.mtu||`1492`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Cloned WAN MAC Address</label>
            <input type="text" id="modalInput_pppoe_mac" class="mh-input" value="${$(e)}" placeholder="Default Hardware MAC" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_pppoe_mac').value=''">Clear (Default HW)</button>
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_pppoe_mac').value='7e:85:7d:a7:58:58'">Hardware MAC</button>
            <button type="button" class="dns-preset-pill" onclick="generateRandomPppoeMac()">Randomize MAC</button>
          </div>
          <div style="margin-top:12px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">PPPoE MTU Packet Size</label>
            <input type="number" id="modalInput_pppoe_mtu" class="mh-input" value="${$(t)}" placeholder="1492" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            <div style="font-size:10.5px; color:var(--text-dim); margin-top:4px;">Standard PPPoE MTU is 1492 bytes (1500 - 8 bytes PPPoE header).</div>
          </div>
        `}else if(e===`pppoe_server_config`){n.textContent=`PPPoE Server Network Configuration`,r.textContent=`Configure the server gateway IP, client IP lease pool range, and DNS nameservers for subscribers.`;let e=window._cachedPppoeData&&window._cachedPppoeData.server||{};i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Server Gateway IP (Local)</label>
            <input type="text" id="modalInput_pppoe_srv_ip" class="mh-input" value="${$(e.server_ip||`10.0.0.1`)}" placeholder="10.0.0.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Pool Start IP</label>
              <input type="text" id="modalInput_pppoe_srv_start" class="mh-input" value="${$(e.pool_start||`10.0.0.150`)}" placeholder="10.0.0.150" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Pool End IP</label>
              <input type="text" id="modalInput_pppoe_srv_end" class="mh-input" value="${$(e.pool_end||`10.0.0.220`)}" placeholder="10.0.0.220" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Primary DNS</label>
              <input type="text" id="modalInput_pppoe_srv_dns1" class="mh-input" value="${$(e.dns1||`10.0.0.1`)}" placeholder="10.0.0.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Secondary DNS</label>
              <input type="text" id="modalInput_pppoe_srv_dns2" class="mh-input" value="${$(e.dns2||`1.1.1.1`)}" placeholder="1.1.1.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            </div>
          </div>
          <div style="margin-top:10px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Max Concurrent Sessions</label>
            <input type="number" id="modalInput_pppoe_srv_max" class="mh-input" value="${$(e.max_sessions||`32`)}" placeholder="32" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `}else if(e===`usb_lb_mode`){n.textContent=`Multi-Device Load Balancing Strategy`,r.textContent=`Configure traffic distribution across multiple connected USB tethering modems or dongles.`;let e=window._cachedUsbWanData&&window._cachedUsbWanData.load_balancing?window._cachedUsbWanData.load_balancing.mode:`balanced`;i.innerHTML=`
          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_mode" value="balanced" ${e===`balanced`?`checked`:``}>
              <div>
                <strong style="color:#38bdf8; display:block; font-size:12.5px;">Balanced Multi-WAN (Weighted Round-Robin)</strong>
                <span style="font-size:11px; color:var(--text-dim);">Distribute active internet connections across all active USB modems for doubled throughput.</span>
              </div>
            </label>
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_mode" value="failover" ${e===`failover`?`checked`:``}>
              <div>
                <strong style="color:#38bdf8; display:block; font-size:12.5px;">Active Failover (Hot Standby)</strong>
                <span style="font-size:11px; color:var(--text-dim);">Route 100% traffic through primary modem (usb0). Automatically switch to secondary if primary fails.</span>
              </div>
            </label>
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_mode" value="broadcast" ${e===`broadcast`?`checked`:``}>
              <div>
                <strong style="color:#f59e0b; display:block; font-size:12.5px;">Broadcast Duplication (Ultra-Low Latency)</strong>
                <span style="font-size:11px; color:var(--text-dim);">Duplicate packets across both USB links to eliminate packet loss and jitter for gaming and streaming.</span>
              </div>
            </label>
          </div>
        `}else if(e===`usb_ping_target`)n.textContent=`Health Check Ping Target`,r.textContent=`IPv4 address pinged periodically to verify internet reachability.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Ping Target IPv4</label>
            <input type="text" id="modalInput_usb_ping_target" class="mh-input" value="${$(window._cachedUsbWanData&&window._cachedUsbWanData.load_balancing?window._cachedUsbWanData.load_balancing.ping_target:`1.1.1.1`)}" placeholder="1.1.1.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            <div id="modalInputValidationMsg" style="font-size:11px; font-family:var(--font-mono); min-height:18px; margin-top:4px;"></div>
          </div>
          <div style="margin-top:10px;">
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Recommended Targets:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_usb_ping_target').value='1.1.1.1'; onModalLiveValidate(document.getElementById('modalInput_usb_ping_target'), 'usb_ping_target');">1.1.1.1 (Cloudflare)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_usb_ping_target').value='8.8.8.8'; onModalLiveValidate(document.getElementById('modalInput_usb_ping_target'), 'usb_ping_target');">8.8.8.8 (Google)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_usb_ping_target').value='9.9.9.9'; onModalLiveValidate(document.getElementById('modalInput_usb_ping_target'), 'usb_ping_target');">9.9.9.9 (Quad9)</button>
            </div>
          </div>
        `;else if(e===`usb_ping_interval`)n.textContent=`Watchdog Ping Interval`,r.textContent=`How often in seconds the gateway sends ICMP health check packets to the target.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Interval (5 to 120 Seconds)</label>
            <input type="number" id="modalInput_usb_ping_interval" class="mh-input" value="${window._cachedUsbWanData&&window._cachedUsbWanData.load_balancing?window._cachedUsbWanData.load_balancing.ping_interval:15}" min="5" max="120" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`usb_dns_override`)n.textContent=`USB WAN DNS Override`,r.textContent=`Space-separated DNS nameservers pushed to the USB WAN routing table.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Nameservers (e.g. 1.1.1.1 8.8.8.8)</label>
            <input type="text" id="modalInput_usb_dns" class="mh-input" value="${$(window._cachedUsbWanData&&window._cachedUsbWanData.load_balancing?window._cachedUsbWanData.load_balancing.dns_override:`1.1.1.1 8.8.8.8`)}" placeholder="1.1.1.1 8.8.8.8" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`usb_tether_proto`){n.textContent=`Tethering Protocol Driver`,r.textContent=`Linux kernel USB network driver protocol used for modem communication.`;let e=window._cachedUsbWanData&&window._cachedUsbWanData.load_balancing?window._cachedUsbWanData.load_balancing.tether_proto:`rndis`;i.innerHTML=`
          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_proto" value="rndis" ${e===`rndis`?`checked`:``}>
              <div>
                <strong style="color:#38bdf8; display:block; font-size:12.5px;">RNDIS (Remote NDIS)</strong>
                <span style="font-size:11px; color:var(--text-dim);">Universal Android USB tethering &amp; Qualcomm 4G/5G modems (Recommended).</span>
              </div>
            </label>
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_proto" value="ncm" ${e===`ncm`?`checked`:``}>
              <div>
                <strong style="color:#38bdf8; display:block; font-size:12.5px;">CDC-NCM (Network Control Model)</strong>
                <span style="font-size:11px; color:var(--text-dim);">High-speed Gigabit-class USB tethering for newer iOS and Android devices.</span>
              </div>
            </label>
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_proto" value="ecm" ${e===`ecm`?`checked`:``}>
              <div>
                <strong style="color:#a78bfa; display:block; font-size:12.5px;">CDC-ECM (Ethernet Control Model)</strong>
                <span style="font-size:11px; color:var(--text-dim);">Legacy standard USB Ethernet dongles and embedded Linux modems.</span>
              </div>
            </label>
          </div>
        `}else if(e===`usb_device_edit`){let e=window._editingUsbDevId,t=M&&M.devices?M.devices.find(t=>t.id===e):null;n.textContent=t?`Edit ${t.name} (${t.interface})`:`Edit USB Interface`,r.textContent=`Configure traffic weight, routing metric, and MTU packet sizing for this USB modem.`,i.innerHTML=`
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Traffic Weight Percentage (1% - 100%)</label>
              <input type="number" id="modalInput_usb_dev_weight" class="mh-input" value="${t&&t.weight||50}" min="1" max="100" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <span style="font-size:10px; color:var(--text-dim); margin-top:3px; display:block;">Higher percentage directs proportionally more bandwidth through this modem.</span>
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Route Metric Priority</label>
              <input type="number" id="modalInput_usb_dev_metric" class="mh-input" value="${t&&t.metric||100}" min="1" max="999" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <span style="font-size:10px; color:var(--text-dim); margin-top:3px; display:block;">Lower metric numbers take routing priority (e.g. 100 before 110).</span>
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Interface MTU</label>
              <input type="number" id="modalInput_usb_dev_mtu" class="mh-input" value="${t&&t.mtu||1400}" min="576" max="1500" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <div id="modalInputValidationMsg" style="font-size:11px; font-family:var(--font-mono); min-height:18px; margin-top:4px;"></div>
            </div>
          </div>
        `}else if(e===`wifi24_ssid`)n.textContent=`2.4 GHz Network Name (SSID)`,r.textContent=`Set wireless broadcast network name for the 2.4 GHz band.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">SSID Network Name</label>
            <input type="text" id="modalInput_wifi24_ssid" class="mh-input" value="${$(document.getElementById(`wifi2gSsid`)?.value||`MAXNET`)}" placeholder="MAXNET" maxlength="32" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Quick Presets:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wifi24_ssid').value='MAXNET'">MAXNET</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wifi24_ssid').value='MAXNET-2.4G'">MAXNET-2.4G</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wifi24_ssid').value='MAXNET-WiFi'">MAXNET-WiFi</button>
            </div>
          </div>
        `;else if(e===`wifi24_enc`){n.textContent=`2.4 GHz Security Mode`,r.textContent=`Select wireless authentication and encryption protocol for 2.4 GHz band.`;let e=document.getElementById(`wifi2gEnc`)?.value||`sae-mixed`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Encryption Protocol</label>
            <select id="modalSelect_wifi24_enc" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="sae-mixed" ${e===`sae-mixed`?`selected`:``}>WPA2/WPA3 Mixed (Recommended)</option>
              <option value="sae" ${e===`sae`?`selected`:``}>WPA3-SAE Only (Modern Secure)</option>
              <option value="psk2" ${e===`psk2`?`selected`:``}>WPA2-PSK (AES)</option>
              <option value="none" ${e===`none`?`selected`:``}>Open (No Security)</option>
            </select>
          </div>
        `}else if(e===`wifi24_key`)n.textContent=`2.4 GHz Wi-Fi Password`,r.textContent=`Pre-shared network security key (minimum 8 characters for WPA2/WPA3).`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Pre-Shared Key (Password)</label>
            <div style="position:relative;">
              <input type="password" id="modalInput_wifi24_key" class="mh-input" value="${$(document.getElementById(`wifi2gKey`)?.value||``)}" placeholder="Minimum 8 characters" style="width:100%; padding:9px 40px 9px 12px; font-size:13px; font-family:var(--font-mono);">
              <button type="button" onclick="const p=document.getElementById('modalInput_wifi24_key'); p.type=p.type==='password'?'text':'password';" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-dim); cursor:pointer; padding:4px;">
                <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
        `;else if(e===`wifi24_channel`){n.textContent=`2.4 GHz Operating Channel`,r.textContent=`Select radio frequency channel for 2.4 GHz transmitter.`;let e=document.getElementById(`wifi2gChannel`)?.value||`auto`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Radio Channel</label>
            <select id="modalSelect_wifi24_channel" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="auto" ${e===`auto`?`selected`:``}>Auto Select (Best Clean Channel)</option>
              <option value="1" ${e===`1`?`selected`:``}>Channel 1 (2412 MHz)</option>
              <option value="6" ${e===`6`?`selected`:``}>Channel 6 (2437 MHz)</option>
              <option value="11" ${e===`11`?`selected`:``}>Channel 11 (2462 MHz)</option>
            </select>
          </div>
        `}else if(e===`wifi24_bandwidth`){n.textContent=`2.4 GHz Channel Bandwidth`,r.textContent=`Channel bandwidth width. 20 MHz (HE20) is recommended for 2.4 GHz to avoid RF congestion.`;let e=document.getElementById(`wifi2gHtmode`)?.value||`HE20`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Bandwidth (HT Mode)</label>
            <select id="modalSelect_wifi24_bandwidth" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="HE20" ${e===`HE20`?`selected`:``}>HE20 (20 MHz - Recommended)</option>
              <option value="HE40" ${e===`HE40`?`selected`:``}>HE40 (40 MHz - High Throughput)</option>
              <option value="HT20" ${e===`HT20`?`selected`:``}>HT20 (Legacy 802.11n)</option>
            </select>
          </div>
        `}else if(e===`wifi5_ssid`)n.textContent=`5 GHz Network Name (SSID)`,r.textContent=`Set high-speed wireless broadcast network name for the 5 GHz band.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">SSID Network Name</label>
            <input type="text" id="modalInput_wifi5_ssid" class="mh-input" value="${$(document.getElementById(`wifi5gSsid`)?.value||`MAXNET-5G`)}" placeholder="MAXNET-5G" maxlength="32" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Quick Presets:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wifi5_ssid').value='MAXNET-5G'">MAXNET-5G</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wifi5_ssid').value='MAXNET-Ultra'">MAXNET-Ultra</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wifi5_ssid').value='MAXNET-Gaming'">MAXNET-Gaming</button>
            </div>
          </div>
        `;else if(e===`wifi5_enc`){n.textContent=`5 GHz Security Mode`,r.textContent=`Select wireless authentication and encryption protocol for 5 GHz ultra-speed band.`;let e=document.getElementById(`wifi5gEnc`)?.value||`sae-mixed`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Encryption Protocol</label>
            <select id="modalSelect_wifi5_enc" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="sae-mixed" ${e===`sae-mixed`?`selected`:``}>WPA2/WPA3 Mixed (Recommended)</option>
              <option value="sae" ${e===`sae`?`selected`:``}>WPA3-SAE Only (Ultra Secure)</option>
              <option value="psk2" ${e===`psk2`?`selected`:``}>WPA2-PSK (AES)</option>
              <option value="none" ${e===`none`?`selected`:``}>Open (No Security)</option>
            </select>
          </div>
        `}else if(e===`wifi5_key`)n.textContent=`5 GHz Wi-Fi Password`,r.textContent=`Pre-shared network security key (minimum 8 characters for WPA2/WPA3).`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Pre-Shared Key (Password)</label>
            <div style="position:relative;">
              <input type="password" id="modalInput_wifi5_key" class="mh-input" value="${$(document.getElementById(`wifi5gKey`)?.value||``)}" placeholder="Minimum 8 characters" style="width:100%; padding:9px 40px 9px 12px; font-size:13px; font-family:var(--font-mono);">
              <button type="button" onclick="const p=document.getElementById('modalInput_wifi5_key'); p.type=p.type==='password'?'text':'password';" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-dim); cursor:pointer; padding:4px;">
                <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
        `;else if(e===`wifi5_channel`){n.textContent=`5 GHz Operating Channel`,r.textContent=`Select radio frequency channel for 5 GHz Qualcomm QCN9074 Pine radio.`;let e=document.getElementById(`wifi5gChannel`)?.value||`auto`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Radio Channel</label>
            <select id="modalSelect_wifi5_channel" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="auto" ${e===`auto`?`selected`:``}>Auto Select (Best Clean Channel)</option>
              <option value="36" ${e===`36`?`selected`:``}>Channel 36 (5180 MHz - UNII-1)</option>
              <option value="40" ${e===`40`?`selected`:``}>Channel 40 (5200 MHz - UNII-1)</option>
              <option value="44" ${e===`44`?`selected`:``}>Channel 44 (5220 MHz - UNII-1)</option>
              <option value="48" ${e===`48`?`selected`:``}>Channel 48 (5240 MHz - UNII-1)</option>
              <option value="149" ${e===`149`?`selected`:``}>Channel 149 (5745 MHz - UNII-3)</option>
              <option value="153" ${e===`153`?`selected`:``}>Channel 153 (5765 MHz - UNII-3)</option>
              <option value="157" ${e===`157`?`selected`:``}>Channel 157 (5785 MHz - UNII-3)</option>
              <option value="161" ${e===`161`?`selected`:``}>Channel 161 (5805 MHz - UNII-3)</option>
            </select>
          </div>
        `}else if(e===`wifi5_bandwidth`){n.textContent=`5 GHz Channel Bandwidth`,r.textContent=`Select channel bandwidth. HE160 (160 MHz) provides max ultra-fast 4804 Mbps throughput.`;let e=document.getElementById(`wifi5gHtmode`)?.value||`HE160`;i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Bandwidth (HT Mode)</label>
            <select id="modalSelect_wifi5_bandwidth" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="HE160" ${e===`HE160`?`selected`:``}>HE160 (160 MHz - Ultra Speed 4.8 Gbps)</option>
              <option value="HE80" ${e===`HE80`?`selected`:``}>HE80 (80 MHz - Standard 5 GHz)</option>
              <option value="HE40" ${e===`HE40`?`selected`:``}>HE40 (40 MHz)</option>
              <option value="HE20" ${e===`HE20`?`selected`:``}>HE20 (20 MHz)</option>
            </select>
          </div>
        `}else e===`notif_retention`?(n.textContent=`Notification Storage & Retention`,r.textContent=`Set maximum alert count and auto-pruning duration to protect flash storage from filling.`,i.innerHTML=`
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Max Stored Alerts</label>
              <select id="modalSelect_notif_max" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
                <option value="25">25 Alerts (Ultra Compact - 12 KB)</option>
                <option value="50" selected>50 Alerts (Recommended - 24 KB)</option>
                <option value="100">100 Alerts (Extended - 48 KB)</option>
                <option value="200">200 Alerts (Deep Archive - 96 KB)</option>
              </select>
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Auto-Prune Retention Days</label>
              <select id="modalSelect_notif_days" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
                <option value="7">7 Days</option>
                <option value="15">15 Days</option>
                <option value="30" selected>30 Days (1 Month)</option>
                <option value="60">60 Days</option>
              </select>
            </div>
          </div>
        `):e===`reset_press_10s`?(n.textContent=`10s Long Press Reset Gesture`,r.textContent=`Hardware action triggered when the physical reset button is held down for 10 seconds or longer.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Trigger Action</label>
            <select id="modalSelect_reset_press_10s" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="factory_reset" selected>Factory Reset (Default - Erase overlay & restore defaults)</option>
              <option value="reboot">Reboot Gateway (Soft Restart)</option>
              <option value="none">Disabled (Ignore long press)</option>
            </select>
          </div>
        `):e===`reset_single_click`?(n.textContent=`Single Click (< 2s) Gesture`,r.textContent=`Action triggered on quick physical reset button tap released in under 2 seconds.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Trigger Action</label>
            <select id="modalSelect_reset_single_click" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="reboot" selected>Reboot Gateway (Default)</option>
              <option value="wifi_toggle">Toggle Wi-Fi (Turn 2.4G & 5G ON/OFF)</option>
              <option value="none">Disabled</option>
            </select>
          </div>
        `):e===`reset_triple_click`?(n.textContent=`Triple Click (3x Push) Gesture`,r.textContent=`Action triggered when physical reset button is tapped 3 times in rapid succession within 2 seconds.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Trigger Action</label>
            <select id="modalSelect_reset_triple_click" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="wifi_toggle" selected>Toggle Wi-Fi (Default - Turn radios ON/OFF)</option>
              <option value="reboot">Reboot Gateway</option>
              <option value="none">Disabled</option>
            </select>
          </div>
        `):e===`dhcp_retention_days`&&(n.textContent=`DHCP Client History Retention`,r.textContent=`Configure how long historical offline DHCP clients and data usage consumption totals are retained.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Retention Duration</label>
            <select id="modalSelect_dhcp_retention_days" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="7">7 Days (Minimal Storage Footprint)</option>
              <option value="15">15 Days (Bi-weekly History)</option>
              <option value="30" selected>30 Days (1 Month - Recommended)</option>
              <option value="60">60 Days (Extended 2 Months)</option>
            </select>
          </div>
        `);clearTimeout(window._settingModalCloseTimer),t.classList.remove(`closing`),t.style.display=`flex`,requestAnimationFrame(()=>{requestAnimationFrame(()=>{t.classList.add(`active`)})}),window._isSettingModalOpen=!0,j(e);try{history.pushState({modalOpen:!0,modalKey:e},``,window.location.hash),Pi=!0}catch{}e===`system_timezone`&&zc(``);let o=i.querySelector(`input, select, textarea`);o&&setTimeout(()=>{o.focus(),o.select&&o.select();try{o.scrollIntoView({behavior:`smooth`,block:`nearest`})}catch{}},100)}function Mi(e){let t=document.getElementById(`modalSelect_cidr`);t&&(t.value=e===`255.255.255.0`?`24`:e===`255.255.0.0`?`16`:e===`255.0.0.0`?`8`:`custom`)}function Ni(e){let t=document.getElementById(`modalInput_net_mask`);t&&(e===`24`?t.value=`255.255.255.0`:e===`16`?t.value=`255.255.0.0`:e===`8`&&(t.value=`255.0.0.0`))}var Pi=!1;function Fi(e=!0){let t=document.getElementById(`settingEditModalOverlay`);if(t&&(t.classList.remove(`active`),t.classList.add(`closing`),clearTimeout(window._settingModalCloseTimer),window._settingModalCloseTimer=setTimeout(()=>{t.classList.contains(`active`)||(t.style.display=`none`,t.classList.remove(`closing`))},260)),window._isSettingModalOpen=!1,J=null,e&&Pi){Pi=!1;try{history.back()}catch{}}else Pi=!1}function Ii(e){e.target&&e.target.id===`settingEditModalOverlay`&&Fi()}function Li(e){if(typeof e!=`string`)return!1;let t=e.trim().split(`.`);return t.length===4&&t.every(e=>{if(!/^\d+$/.test(e))return!1;let t=parseInt(e,10);return t>=0&&t<=255&&(e===`0`||!e.startsWith(`0`))})}function Ri(e){return Li(e)?`255.255.255.255,255.255.255.254,255.255.255.252,255.255.255.248,255.255.255.240,255.255.255.224,255.255.255.192,255.255.255.128,255.255.255.0,255.255.254.0,255.255.252.0,255.255.248.0,255.255.240.0,255.255.224.0,255.255.192.0,255.255.128.0,255.255.0.0,255.254.0.0,255.252.0.0,255.248.0.0,255.240.0.0,255.224.0.0,255.192.0.0,255.128.0.0,255.0.0.0,254.0.0.0,252.0.0.0,248.0.0.0,240.0.0.0,224.0.0.0,192.0.0.0,128.0.0.0,0.0.0.0`.split(`,`).includes(e.trim()):!1}function zi(e){return/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test((e||``).trim())}function Bi(){let e=`0123456789abcdef`,t=e[Math.floor(Math.random()*16)]+[`2`,`6`,`a`,`e`][Math.floor(Math.random()*4)];for(let n=1;n<6;n++)t+=`:`+e[Math.floor(Math.random()*16)]+e[Math.floor(Math.random()*16)];let n=document.getElementById(`modalInput_custom_mac`);n&&(n.value=t)}async function Vi(){if(!J)Fi();else{if(J===`topology_add_node`){let e=(document.getElementById(`modalTopoNodeName`)?.value||``).trim(),t=document.getElementById(`modalTopoNodeType`)?.value||`router`,n=document.getElementById(`modalTopoParentPort`)?.value||``,r=(document.getElementById(`modalTopoNodeIp`)?.value||``).trim(),i=(document.getElementById(`modalTopoNodeMac`)?.value||``).trim(),a=Vn(window._topoTree,n);if(!e){typeof Q==`function`&&Q(`Enter a name for this network device`,`error`),document.getElementById(`modalTopoNodeName`)?.focus();return}if(!a||a.port.role!==`empty`||a.port.child){typeof Q==`function`&&Q(`Choose an unused LAN port on the parent device`,`error`);return}if(r&&!Li(r)){typeof Q==`function`&&Q(`Enter a valid management IPv4 address`,`error`);return}if(i&&!zi(i)){typeof Q==`function`&&Q(`Enter a valid device MAC address`,`error`);return}let o=`node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`,s={id:o,type:t,name:e,ip:r,mac:i,uplinkPort:n,numPorts:4,ports:[],wireless_clients:[]};for(let e=1;e<=s.numPorts;e++)s.ports.push({id:`${o}-lan${e}`,label:`LAN ${e}`,role:`empty`,child:null});s.manual=!0,a.port.role=`node`,a.port.child=s,Mn(a.port),Rn(window._topoTree),W(),G(window._topoTree),typeof U==`function`&&U(),typeof Q==`function`&&Q(`${e} added under ${a.parentNode.name} · ${a.port.label}`,`success`)}else if(J===`pppoe_user_add`){if(!await uo())return}else if(J===`topology_type`)jn(document.querySelector(`input[name="topologyDiscoveryMode"]:checked`)?.value||`live`);else if(J===`system_date`){if(document.getElementById(`systemNtpEnabled`)?.checked){typeof Q==`function`&&Q(`Automatic time sync is enabled. Turn it off to set the date and time manually.`,`info`);return}let e=document.getElementById(`modalInput_system_date`)?.value||``;if(!e){typeof Q==`function`&&Q(`Choose a valid date and time`,`error`);return}let t=document.getElementById(`systemDateTimeInput`);if(t&&(t.value=e),!await Yc())return}else if(J===`system_timezone`){if(!(document.getElementById(`systemTimezoneInput`)?.value||``).trim()){typeof Q==`function`&&Q(`Select a timezone`,`error`);return}if(!await Yc())return}else if(J===`ntp_server`){let e=document.getElementById(`modalInput_ntp_server`),t=(e?.value||``).trim().toLowerCase();if(!/^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$/.test(t)){typeof Q==`function`&&Q(`Enter a valid NTP hostname`,`error`),e?.focus();return}if(Array.from(document.querySelectorAll(`#systemNtpServersList .system-ntp-value`)).map(e=>e.textContent.toLowerCase()).includes(t)){typeof Q==`function`&&Q(`That NTP server is already in the list`,`info`),e?.focus();return}if(Jc(t),!await Yc())return}else if(J===`device_hostname`){let e=(document.getElementById(`modalInput_device_hostname`).value||``).trim();if(!e){Q(`Device hostname cannot be empty`,`error`);let e=document.getElementById(`modalInput_device_hostname`);e&&e.focus();return}if(!/^[a-zA-Z0-9][-a-zA-Z0-9_]{0,62}$/.test(e)){Q(`Hostname must start with alphanumeric character and contain only letters, numbers, hyphens, and underscores (max 63 chars)`,`error`);let e=document.getElementById(`modalInput_device_hostname`);e&&e.focus();return}let t=document.getElementById(`netDeviceHostname`);t&&(t.value=e);let n=document.getElementById(`disp_device_hostname`),r=e.toLowerCase();n&&(n.textContent=`${e} • ${r}.lan / ${r}.local`),Oi()}else if(J===`custom_mac`){let e=(document.getElementById(`modalInput_custom_mac`).value||``).trim(),t=(document.getElementById(`netHwMac`)?document.getElementById(`netHwMac`).value:`ca:e7:b7:34:8f:ac`).toLowerCase(),n=document.getElementById(`netCustomMac`);if(e&&e.toLowerCase()!==t){if(!zi(e)){Q(`Invalid MAC address format (e.g. 00:11:22:33:44:55)`,`error`);let e=document.getElementById(`modalInput_custom_mac`);e&&e.focus();return}n&&(n.value=e.toLowerCase(),n.dataset.reset=`0`);let r=document.getElementById(`disp_custom_mac`);r&&(r.textContent=`Custom: ${e.toLowerCase()} • Hardware: ${t}`)}else{n&&(n.value=``,n.dataset.reset=`1`);let e=document.getElementById(`disp_custom_mac`);e&&(e.textContent=`Default: ${t} • Hardware MAC in use`)}Oi()}else if(J===`client_history_days`){let e=document.getElementById(`modalSelect_client_history`).value,t=document.getElementById(`disp_client_history_days`);t&&(t.textContent=`${e} Days Retention • Click to change duration`),Q(`Client history retention set to ${e} days`,`success`),Oi()}else if(J===`lan_ip`){let e=(document.getElementById(`modalInput_lan_ip`).value||``).trim();if(!Li(e)){Q(`Invalid IPv4 address format (e.g. 10.0.0.1)`,`error`);let e=document.getElementById(`modalInput_lan_ip`);e&&e.focus();return}if(e===`0.0.0.0`||e===`255.255.255.255`){Q(`Gateway IP cannot be 0.0.0.0 or broadcast`,`error`);return}document.getElementById(`netLanIp`).value=e;let t=document.getElementById(`disp_lan_ip`);t&&(t.textContent=e),Oi()}else if(J===`net_mask`){let e=(document.getElementById(`modalInput_net_mask`).value||``).trim();if(!Ri(e)){Q(`Invalid subnet mask (e.g. 255.255.255.0)`,`error`);let e=document.getElementById(`modalInput_net_mask`);e&&e.focus();return}let t=document.getElementById(`modalSelect_cidr`).value;document.getElementById(`netMask`).value=e,document.getElementById(`netCidrSelect`).value=t;let n=document.getElementById(`disp_net_mask`);n&&(n.textContent=`${e} (/${t})`),Oi()}else if(J===`net_gateway`){let e=(document.getElementById(`modalInput_gateway`).value||``).trim();if(e&&!Li(e)){Q(`Invalid gateway IPv4 address (leave empty for direct br-lan)`,`error`);let e=document.getElementById(`modalInput_gateway`);e&&e.focus();return}document.getElementById(`netGateway`).value=e;let t=document.getElementById(`disp_net_gateway`);t&&(t.textContent=e||`None (Direct br-lan)`),Oi()}else if(J===`net_mtu`){let e=parseInt(document.getElementById(`modalInput_mtu`).value,10);if(isNaN(e)||e<576||e>9e3){Q(`MTU must be between 576 and 9000 bytes`,`error`);let e=document.getElementById(`modalInput_mtu`);e&&e.focus();return}document.getElementById(`netMtu`).value=e;let t=document.getElementById(`disp_net_mtu`);t&&(t.textContent=`${e} bytes`),Oi()}else if(J===`dhcp_pool`){let e=parseInt(document.getElementById(`modalInput_dhcp_start`).value,10),t=parseInt(document.getElementById(`modalInput_dhcp_limit`).value,10);if(isNaN(e)||e<2||e>254){Q(`DHCP Pool start must be between 2 and 254`,`error`);let e=document.getElementById(`modalInput_dhcp_start`);e&&e.focus();return}if(isNaN(t)||t<1||e+t>255){Q(`Invalid pool limit (start + limit must be <= 254)`,`error`);let e=document.getElementById(`modalInput_dhcp_limit`);e&&e.focus();return}let n=document.getElementById(`modalSelect_dhcp_lease`).value||`12h`;document.getElementById(`netDhcpStart`).value=e,document.getElementById(`netDhcpLimit`).value=t,document.getElementById(`netDhcpLease`).value=n;let r=document.getElementById(`disp_dhcp_pool`);r&&(r.textContent=`Start ${e} • Limit ${t} • Lease ${n}`),Oi()}else if(J===`custom_dns`){let e=(document.getElementById(`modalInput_dns`).value||``).trim();if(e){let t=e.split(/\s+/);for(let e of t)if(!Li(e)&&!e.includes(`:`)){Q(`Invalid DNS server IP: ${e}`,`error`);let t=document.getElementById(`modalInput_dns`);t&&t.focus();return}}document.getElementById(`netDns`).value=e||`1.1.1.1 8.8.8.8`;let t=document.getElementById(`disp_custom_dns`);t&&(t.textContent=e||`1.1.1.1 8.8.8.8`),Oi()}else if(J===`add_static_lease`){let e=(document.getElementById(`modalInput_lease_name`).value||`Client`).trim(),t=(document.getElementById(`modalInput_lease_mac`).value||``).trim(),n=(document.getElementById(`modalInput_lease_ip`).value||``).trim();if(!zi(t)){Q(`Invalid MAC address (format XX:XX:XX:XX:XX:XX)`,`error`);let e=document.getElementById(`modalInput_lease_mac`);e&&e.focus();return}if(!Li(n)){Q(`Invalid IPv4 address format (e.g. 10.0.0.50)`,`error`);let e=document.getElementById(`modalInput_lease_ip`);e&&e.focus();return}try{Di(`saving`,`Adding reservation...`),await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`add_lease`,name:e,mac:t,ip:n})})).json(),Di(`saved`,`Reservation Added`),await Va()}catch(e){Di(`error`,`Add failed`),console.error(e)}}else if(J===`ts_hostname`){let e=(document.getElementById(`modalInput_ts_hostname`).value||`Maxnet-Gateway`).trim();document.getElementById(`tsHostname`)&&(document.getElementById(`tsHostname`).value=e);let t=document.getElementById(`disp_ts_hostname`);t&&(t.textContent=e),typeof qs==`function`&&qs()}else if(J===`ts_authkey`){let e=(document.getElementById(`modalInput_ts_authkey`).value||``).trim();document.getElementById(`tsAuthKeyInput`)&&(document.getElementById(`tsAuthKeyInput`).value=e);let t=document.getElementById(`disp_ts_authkey`);t&&(t.textContent=e?`Key Configured (Connecting...)`:`tskey-auth-... (Click to update key)`);let n=document.getElementById(`disp_ts_authkey_unlogged`);n&&(n.textContent=e?`Key Configured (Connecting...)`:`Connect using pre-authenticated key (tskey-auth-...)`),typeof Gs==`function`&&Gs()}else if(J===`change_password`){let e=document.getElementById(`modalInput_pwd_old`),t=e?e.value:``,n=document.getElementById(`modalInput_pwd_new`)?document.getElementById(`modalInput_pwd_new`).value:``,r=document.getElementById(`modalInput_pwd_confirm`)?document.getElementById(`modalInput_pwd_confirm`).value:``;if(e&&!t&&window._rootHasPassword!==!1){Q(`Please enter your existing administrator password`,`error`),e.focus&&e.focus();return}if(!n){Q(`New password cannot be empty`,`error`);return}if(n!==r){Q(`New password and confirm password do not match`,`error`);return}if(n.length<4){Q(`Password must be at least 4 characters long`,`error`);return}document.getElementById(`oldPasswordInput`)&&(document.getElementById(`oldPasswordInput`).value=t),document.getElementById(`newPasswordInput`)&&(document.getElementById(`newPasswordInput`).value=n),document.getElementById(`confirmPasswordInput`)&&(document.getElementById(`confirmPasswordInput`).value=r),typeof ec==`function`&&ec()}else if(J===`smb_credentials`){let e=(document.getElementById(`modalInput_smb_user`).value||`max`).trim(),t=document.getElementById(`modalInput_smb_pass`).value;document.getElementById(`smbUsernameInput`)&&(document.getElementById(`smbUsernameInput`).value=e),document.getElementById(`smbPasswordInput`)&&(document.getElementById(`smbPasswordInput`).value=t);let n=document.getElementById(`disp_smb_creds`);n&&(n.textContent=`User: ${e} • Password configured`),typeof Xs==`function`&&Xs()}else if(J===`pkg_install`){let e=(document.getElementById(`modalInput_pkg_name`).value||``).trim();e&&typeof hs==`function`&&hs(e)}else if(J===`diag_ping_size`){let e=parseInt(document.getElementById(`modalInput_ping_size`).value,10)||56;document.getElementById(`diagPingSize`)&&(document.getElementById(`diagPingSize`).value=e);let t=document.getElementById(`disp_diag_ping_size`);t&&(t.textContent=`${e} bytes (ICMP payload buffer)`)}else if(J===`diag_dns_server`){let e=(document.getElementById(`modalInput_dns_server`).value||`10.0.0.1`).trim();document.getElementById(`diagDnsServerInput`)&&(document.getElementById(`diagDnsServerInput`).value=e);let t=document.getElementById(`disp_diag_dns_server`);t&&(t.textContent=`${e} (Resolver)`)}else if(J===`diag_ports_list`){let e=(document.getElementById(`modalTextarea_ports_list`).value||``).trim();document.getElementById(`diagPortsListInput`)&&(document.getElementById(`diagPortsListInput`).value=e);let t=e.split(`,`).filter(e=>e.trim().length>0).length,n=document.getElementById(`disp_diag_ports_count`);n&&(n.textContent=`${t} Custom Ports Configured (Click to edit)`)}else if(J===`ipv6_wan_mode`){let e=document.getElementById(`modalSelect_ipv6_wan_mode`).value;document.getElementById(`netIpv6WanMode`)&&(document.getElementById(`netIpv6WanMode`).value=e);let t=document.getElementById(`disp_ipv6_wan_mode`);t&&(t.textContent={dhcpv6:`DHCPv6-PD & SLAAC (Automatic)`,slaac:`SLAAC Only (Stateless Autoconfiguration)`,static:`Static IPv6 Address`,disabled:`Disabled (No WAN IPv6)`}[e]||e),Oi()}else if(J===`ipv6_ula`){let e=(document.getElementById(`modalInput_ipv6_ula`).value||``).trim();if(e&&!e.includes(`:`)){Q(`Invalid IPv6 ULA prefix (e.g. fd00::/48)`,`error`);return}document.getElementById(`netIpv6Ula`)&&(document.getElementById(`netIpv6Ula`).value=e||`fd00::/48`);let t=document.getElementById(`disp_ipv6_ula`);t&&(t.textContent=`${e||`fd00::/48`} • Unique local address scope`),Oi()}else if(J===`wan_proto`){let e=document.getElementById(`modalSelect_wan_proto`),t=e?e.value:`dhcp`;document.getElementById(`wanProtoSelect`)&&(document.getElementById(`wanProtoSelect`).value=t),Wa(),Ja(),t===`pppoe`&&setTimeout(()=>{typeof O==`function`&&O(`acc-pppoe`)},350)}else if(J===`webhook_tg_token`){let e=(document.getElementById(`modalInput_tg_token`)?.value||``).trim();window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.telegram=window._cachedWebhooksConfig.telegram||{},window._cachedWebhooksConfig.telegram.bot_token=e;let t=document.getElementById(`disp_webhook_tg_token`);t&&(t.textContent=e?`${e.substring(0,10)}••••••••`:`Click to configure Bot Token from @BotFather`),Wo()}else if(J===`webhook_tg_chat_id`){let e=(document.getElementById(`modalInput_tg_chat_id`)?.value||``).trim();window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.telegram=window._cachedWebhooksConfig.telegram||{},window._cachedWebhooksConfig.telegram.chat_id=e;let t=document.getElementById(`disp_webhook_tg_chat_id`);t&&(t.textContent=e?`Chat ID: ${e}`:`Click to configure Chat or Channel ID`),Wo()}else if(J===`webhook_discord_url`){let e=(document.getElementById(`modalInput_discord_url`)?.value||``).trim();window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.discord=window._cachedWebhooksConfig.discord||{},window._cachedWebhooksConfig.discord.webhook_url=e;let t=document.getElementById(`disp_webhook_discord_url`);t&&(t.textContent=e?`${e.substring(0,35)}...`:`Click to configure Discord Webhook URL`),Wo()}else if(J===`webhook_ntfy_url`){let e=(document.getElementById(`modalInput_ntfy_url`)?.value||``).trim();window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.ntfy=window._cachedWebhooksConfig.ntfy||{},window._cachedWebhooksConfig.ntfy.topic_url=e;let t=document.getElementById(`disp_webhook_ntfy_url`);t&&(t.textContent=e||`https://ntfy.sh/maxnet-alerts`),Wo()}else if(J===`webhook_data_quota`){let e=parseInt((document.getElementById(`modalInput_data_quota`)?.value||`1024`).trim())||1024;window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.data_quota_mb=e;let t=document.getElementById(`disp_webhook_data_quota`);t&&(t.textContent=`${e} MB (${(e/1024).toFixed(1)} GB)`),Wo()}else if(J===`webhook_custom_ip`){let e=(document.getElementById(`modalInput_custom_ip_target`)?.value||`10.0.0.2`).trim();window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.custom_ip_target=e;let t=document.getElementById(`disp_webhook_custom_ip`);t&&(t.textContent=e),Wo()}else if(J===`restart_usb_modem`){let e=document.getElementById(`modalSelect_restart_target`)?.value||`all`,t=document.querySelector(`input[name="usb_restart_mode"]:checked`)?.value||`soft`,n=document.getElementById(`usbRestartModalStatus`),r=document.getElementById(`btnModalSave`);r&&(r.disabled=!0,Ai(r,`WORKING`)),n&&(n.textContent=t===`adb`?`Transmitting ADB reboot signal to smartphone...`:`Resetting interface (${e}) & renewing DHCP...`);try{if(t===`adb`)await fetch(`/cgi-bin/usb_wan?action=restart_modems&reboot_adb=true&serial=`+encodeURIComponent(e===`all`?``:e),{method:`POST`}),n&&(n.textContent=`Phone reboot signal sent! Phone is power cycling.`),typeof Q==`function`&&Q(`ADB phone reboot initiated!`,`success`);else{let t=await(await fetch(`/cgi-bin/usb_wan?action=restart_modems&iface=${encodeURIComponent(e)}`,{method:`POST`})).json();n&&(n.textContent=t.message||`Interface restarted successfully!`),typeof Q==`function`&&Q(t.message||`USB Modem restarted`,`success`)}setTimeout(()=>{Fi(),N()},1400)}catch(e){n&&(n.textContent=`Error: `+e.message),typeof Q==`function`&&Q(`Restart error: `+e.message,`error`),r&&(r.disabled=!1,Ai(r,`RESTART`))}return}else if(J===`wan_static_ip`){let e=(document.getElementById(`modalInput_wan_static_ip`)?.value||``).trim();document.getElementById(`wanStaticIp`)&&(document.getElementById(`wanStaticIp`).value=e),Wa(),Ja()}else if(J===`wan_static_netmask`){let e=(document.getElementById(`modalInput_wan_static_netmask`)?.value||``).trim();document.getElementById(`wanStaticNetmask`)&&(document.getElementById(`wanStaticNetmask`).value=e),Wa(),Ja()}else if(J===`wan_static_gateway`){let e=(document.getElementById(`modalInput_wan_static_gateway`)?.value||``).trim();document.getElementById(`wanStaticGateway`)&&(document.getElementById(`wanStaticGateway`).value=e),Wa(),Ja()}else if(J===`wan_custom_mac`){let e=(document.getElementById(`modalInput_wan_custom_mac`)?.value||``).trim();if(e&&!zi(e)){Q(`Invalid MAC address format (e.g. 00:11:22:33:44:55)`,`error`);return}document.getElementById(`wanCustomMacInput`)&&(document.getElementById(`wanCustomMacInput`).value=e),Wa(),Ja()}else if(J!==`dufs_url`){if(J===`dufs_port`){let e=parseInt(document.getElementById(`modalInput_dufs_port`)?.value,10);if(!e||e<1||e>65535){Q(`Invalid port number (1-65535)`,`error`);return}document.getElementById(`dufsPortInput`)&&(document.getElementById(`dufsPortInput`).value=e),ho()}else if(J===`dufs_path`){let e=(document.getElementById(`modalInput_dufs_path`)?.value||`/mnt/storage`).trim();document.getElementById(`dufsPathInput`)&&(document.getElementById(`dufsPathInput`).value=e),ho()}else if(J===`dufs_permissions`){let e=document.getElementById(`modalSelect_dufs_mode`)?.value||`full`,t=`true`,n=`true`;e===`upload_only`?(t=`true`,n=`false`):e===`readonly`&&(t=`false`,n=`false`),document.getElementById(`dufsAllowUpload`)&&(document.getElementById(`dufsAllowUpload`).value=t),document.getElementById(`dufsAllowDelete`)&&(document.getElementById(`dufsAllowDelete`).value=n),ho()}else if(J===`dufs_auth`){let e=(document.getElementById(`modalInput_dufs_user`)?.value||``).trim(),t=(document.getElementById(`modalInput_dufs_pass`)?.value||``).trim();document.getElementById(`dufsUserInput`)&&(document.getElementById(`dufsUserInput`).value=e),document.getElementById(`dufsPassInput`)&&(document.getElementById(`dufsPassInput`).value=t),ho()}else if(J===`pppoe_client_creds`)io((document.getElementById(`modalInput_pppoe_user`)?.value||``).trim(),document.getElementById(`modalInput_pppoe_pass`)?.value||``);else if(J===`pppoe_client_ac`)ao((document.getElementById(`modalInput_pppoe_ac`)?.value||``).trim(),(document.getElementById(`modalInput_pppoe_service`)?.value||``).trim());else if(J===`pppoe_client_mac`)oo((document.getElementById(`modalInput_pppoe_mac`)?.value||``).trim(),parseInt(document.getElementById(`modalInput_pppoe_mtu`)?.value,10)||1492);else if(J===`pppoe_server_config`)lo((document.getElementById(`modalInput_pppoe_srv_ip`)?.value||`10.0.0.1`).trim(),(document.getElementById(`modalInput_pppoe_srv_start`)?.value||`10.0.0.150`).trim(),(document.getElementById(`modalInput_pppoe_srv_end`)?.value||`10.0.0.220`).trim(),(document.getElementById(`modalInput_pppoe_srv_dns1`)?.value||`10.0.0.1`).trim(),(document.getElementById(`modalInput_pppoe_srv_dns2`)?.value||`1.1.1.1`).trim(),parseInt(document.getElementById(`modalInput_pppoe_srv_max`)?.value,10)||32);else if(J===`usb_lb_mode`){let e=document.querySelector(`input[name="modal_usb_mode"]:checked`);e&&window._cachedUsbWanData&&(window._cachedUsbWanData.load_balancing.mode=e.value,F())}else if(J===`usb_ping_target`){let e=document.getElementById(`modalInput_usb_ping_target`);e&&window._cachedUsbWanData&&(window._cachedUsbWanData.load_balancing.ping_target=e.value.trim(),F())}else if(J===`usb_ping_interval`){let e=document.getElementById(`modalInput_usb_ping_interval`);e&&window._cachedUsbWanData&&(window._cachedUsbWanData.load_balancing.ping_interval=parseInt(e.value,10)||15,F())}else if(J===`usb_dns_override`){let e=document.getElementById(`modalInput_usb_dns`);e&&window._cachedUsbWanData&&(window._cachedUsbWanData.load_balancing.dns_override=e.value.trim(),F())}else if(J===`usb_tether_proto`){let e=document.querySelector(`input[name="modal_usb_proto"]:checked`);e&&window._cachedUsbWanData&&(window._cachedUsbWanData.load_balancing.tether_proto=e.value,F())}else if(J===`usb_device_edit`){let e=window._editingUsbDevId,t=window._cachedUsbWanData&&window._cachedUsbWanData.devices?window._cachedUsbWanData.devices.find(t=>t.id===e):null;if(t){let e=parseInt(document.getElementById(`modalInput_usb_dev_weight`)?.value,10)||50,n=parseInt(document.getElementById(`modalInput_usb_dev_metric`)?.value,10)||100,r=parseInt(document.getElementById(`modalInput_usb_dev_mtu`)?.value,10)||1400;t.weight=e,t.metric=n,t.mtu=r,F()}}else if(J===`wifi24_ssid`){let e=(document.getElementById(`modalInput_wifi24_ssid`)?.value||``).trim();if(!e){Q(`SSID cannot be empty`,`error`);return}let t=document.getElementById(`wifi2gSsid`);t&&(t.value=e),jc(),kl()}else if(J===`wifi24_enc`){let e=document.getElementById(`modalSelect_wifi24_enc`)?.value||`sae-mixed`,t=document.getElementById(`wifi2gEnc`);t&&(t.value=e),jc(),kl()}else if(J===`wifi24_key`){let e=(document.getElementById(`modalInput_wifi24_key`)?.value||``).trim();if((document.getElementById(`wifi2gEnc`)?.value||`sae-mixed`)!==`none`&&e.length<8){Q(`Wi-Fi password must be at least 8 characters`,`error`);return}let t=document.getElementById(`wifi2gKey`);t&&(t.value=e),jc(),kl()}else if(J===`wifi24_channel`){let e=document.getElementById(`modalSelect_wifi24_channel`)?.value||`auto`,t=document.getElementById(`wifi2gChannel`);t&&(t.value=e),jc(),kl()}else if(J===`wifi24_bandwidth`){let e=document.getElementById(`modalSelect_wifi24_bandwidth`)?.value||`HE20`,t=document.getElementById(`wifi2gHtmode`);t&&(t.value=e),jc(),kl()}else if(J===`wifi5_ssid`){let e=(document.getElementById(`modalInput_wifi5_ssid`)?.value||``).trim();if(!e){Q(`SSID cannot be empty`,`error`);return}let t=document.getElementById(`wifi5gSsid`);t&&(t.value=e),jc(),kl()}else if(J===`wifi5_enc`){let e=document.getElementById(`modalSelect_wifi5_enc`)?.value||`sae-mixed`,t=document.getElementById(`wifi5gEnc`);t&&(t.value=e),jc(),kl()}else if(J===`wifi5_key`){let e=(document.getElementById(`modalInput_wifi5_key`)?.value||``).trim();if((document.getElementById(`wifi5gEnc`)?.value||`sae-mixed`)!==`none`&&e.length<8){Q(`Wi-Fi password must be at least 8 characters`,`error`);return}let t=document.getElementById(`wifi5gKey`);t&&(t.value=e),jc(),kl()}else if(J===`wifi5_channel`){let e=document.getElementById(`modalSelect_wifi5_channel`)?.value||`auto`,t=document.getElementById(`wifi5gChannel`);t&&(t.value=e),jc(),kl()}else if(J===`wifi5_bandwidth`){let e=document.getElementById(`modalSelect_wifi5_bandwidth`)?.value||`HE160`,t=document.getElementById(`wifi5gHtmode`);t&&(t.value=e),jc(),kl()}else if(J===`notif_retention`){let e=parseInt(document.getElementById(`modalSelect_notif_max`)?.value||`50`,10),t=parseInt(document.getElementById(`modalSelect_notif_days`)?.value||`30`,10);try{await fetch(`/cgi-bin/webhooks`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_retention`,max_count:e,retention_days:t})});let n=document.getElementById(`disp_notif_retention`);n&&(n.textContent=`Capped at ${e} records • Auto-pruned at ${t} days`);let r=document.getElementById(`disp_webui_notif_retention`);r&&(r.textContent=`${e} Alerts (Auto-prunes oldest)`),Q(`Retention policy updated (${e} alerts, ${t} days)`,`success`),Io()}catch{}}else if(J===`reset_press_10s`){let e=document.getElementById(`modalSelect_reset_press_10s`)?.value||`factory_reset`;try{await fetch(`/cgi-bin/hardware_gestures`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_gestures`,reset_gestures:{press_10s:e}})});let t=document.getElementById(`disp_reset_press_10s`);t&&(t.textContent=e===`factory_reset`?`Factory Reset (Permanent wipe and restore defaults)`:e===`reboot`?`Reboot Gateway`:`Disabled`),Q(`10-second reset gesture updated`,`success`)}catch{}}else if(J===`reset_single_click`){let e=document.getElementById(`modalSelect_reset_single_click`)?.value||`reboot`;try{await fetch(`/cgi-bin/hardware_gestures`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_gestures`,reset_gestures:{single_click:e}})});let t=document.getElementById(`disp_reset_single_click`);t&&(t.textContent=e===`reboot`?`Reboot Gateway`:e===`wifi_toggle`?`Toggle Wi-Fi Radios (On/Off)`:`Disabled`),Q(`Single-click gesture updated`,`success`)}catch{}}else if(J===`reset_triple_click`){let e=document.getElementById(`modalSelect_reset_triple_click`)?.value||`wifi_toggle`;try{await fetch(`/cgi-bin/hardware_gestures`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_gestures`,reset_gestures:{triple_click:e}})});let t=document.getElementById(`disp_reset_triple_click`);t&&(t.textContent=e===`wifi_toggle`?`Toggle Wi-Fi Radios (On/Off)`:e===`reboot`?`Reboot Gateway`:`Disabled`),Q(`Triple-click gesture updated`,`success`)}catch{}}else if(J===`dhcp_retention_days`){let e=parseInt(document.getElementById(`modalSelect_dhcp_retention_days`)?.value||`30`,10);try{await fetch(`/cgi-bin/hardware_gestures`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_dhcp_retention`,retention_days:e})});let t=document.getElementById(`disp_dhcp_retention_days`);t&&(t.textContent=`${e} Days (${e===30?`1 Month`:Math.round(e/30)+` Months`}) • Compact Flash Footprint`),Q(`DHCP history retention set to ${e} days`,`success`)}catch{}}}Fi()}}var Hi={ssh_enable:!0,session_timeout:!0,syn_flood:!0,wan_ping_drop:!1,brute_force:!0,force_https:!1};async function Ui(){try{let e=await(await p(`/cgi-bin/device?action=security_get`)).json();e&&e.status===`ok`&&(Hi=Object.assign(Hi,e))}catch(e){console.warn(`fetchSecuritySettings error, using defaults:`,e)}fetch(`/cgi-bin/auth?action=check_root_pass`).then(e=>e.json()).then(e=>{e&&e.status===`ok`&&(window._rootHasPassword=!!e.has_password)}).catch(()=>{});let e=document.getElementById(`secSshToggle`),t=document.getElementById(`secSessionTimeoutToggle`),n=document.getElementById(`secSynFloodToggle`),r=document.getElementById(`secWanPingToggle`),i=document.getElementById(`secBruteForceToggle`),a=document.getElementById(`secHttpsToggle`);e&&(e.checked=!!Hi.ssh_enable),t&&(t.checked=!!Hi.session_timeout),n&&(n.checked=!!Hi.syn_flood),r&&(r.checked=!!Hi.wan_ping_drop),i&&(i.checked=!!Hi.brute_force),a&&(a.checked=!!Hi.force_https),Co()}async function Wi(e,t){Hi[e]=t;try{let t=await(await fetch(`/cgi-bin/device?action=security_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(Hi)})).json();t&&t.status===`ok`?Q(`Security policy updated: ${e.replace(`_`,` `).toUpperCase()}`,`success`):Q(`Error saving security policy`,`warning`)}catch(t){console.error(`saveSecurityPolicy error`,t),Q(`Policy updated locally: ${e}`,`info`)}}var Gi=[];async function Ki(){document.getElementById(`adbDevicesCardsContainer`);let e=document.getElementById(`adbDevCountBadge`),t=document.getElementById(`adbHubCountBadge`);try{let n=[];if(window._lastDataCache&&Array.isArray(window._lastDataCache.usb_devices)&&window._lastDataCache.usb_devices.length>0)n=window._lastDataCache.usb_devices;else{let e=await(await p(`/cgi-bin/device?action=devices`)).json();n=Array.isArray(e.devices)?e.devices:[]}Gi=n.filter(e=>e.device_type!==`storage`&&e.device_type!==`pendrive`&&e.device_type!==`ssd`),Gi.length===0&&n.length>0&&(Gi=n),e&&(e.textContent=`${Gi.length} CONNECTED`),t&&(t.textContent=`${Gi.length} ONLINE`),qi(Gi)}catch(e){console.error(`fetchAdbDeviceList error`,e)}}function qi(e){let t=document.getElementById(`adbDevicesCardsContainer`);t&&(t.innerHTML=!e||e.length===0?`
          <div style="padding:16px; text-align:center; color:var(--text-dim); font-size:11.5px; font-family:var(--font-mono); background:rgba(255,255,255,0.02); border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
            No Android ADB devices detected. Connect a 5G phone via USB with USB Debugging enabled.
          </div>
        `:e.map(e=>{let t=e.serial||e.bus||`dev_adb`,n=$(e.model||e.brand||`Android Handset`),r=e.network||(e.is_wan?`5G SA Tethering`:`Connected`),i=e.operator||e.manufacturer||``,a=e.battery_pct!==null&&e.battery_pct!==void 0?`${e.battery_pct}%`:``,o=e.virtual_ip||e.ip||``,s=[];t&&s.push(t),r&&s.push(r),i&&s.push(i),o&&s.push(`IP: ${o}`),a&&s.push(`Batt: ${a}`);let c=s.join(` &bull; `);return`
          <div class="setting-row-item setting-clickable-row" onclick="openAdbDeviceDetail('${$(t)}')">
            <div class="setting-label-col">
              <span class="setting-label-bold">${n}</span>
              <span class="setting-label-sub">${c}</span>
            </div>
            <div class="setting-arrow-col">
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        `}).join(``))}function Ji(e,t=!0){window._currentAdbDeviceDetail=e,K=e;let n=document.getElementById(`adbListView`);n&&(n.style.display=`none`),Gr(`controls`);let r=Gi.find(t=>t.serial===e||t.bus===e)||{serial:e,model:`Android Handset`},i=r.model||r.brand||`Android Handset`,a=r.serial||r.bus||e||`--`,o=document.getElementById(`settingsDetailNavTitle`);o&&(o.textContent=i);let s=document.getElementById(`dispDevModelTitle`);s&&(s.textContent=i);let c=document.getElementById(`dispDevModelSub`);c&&(c.textContent=`Serial: ${a}${r.ip?` • IP: ${r.ip}`:``}`);let l=document.getElementById(`dispDevSerialSub`);l&&(l.textContent=`Serial: ${a} • USB High-Speed 480 Mbps`);let u=document.getElementById(`dispDevUptimeSub`);if(u&&(u.innerHTML=`Uptime: -- &bull; Reading system uptime...`),Zi(),Ur(),t)try{history.pushState({tab:`settings`,page:`adb-device-detail`,serial:e},``,`#setting=acc-adb-device&dev=`+encodeURIComponent(e))}catch{}}function Yi(e=!0){if(window._currentAdbSubView&&window._currentAdbSubView!==`controls`){Gr(`controls`);return}if(!window._currentAdbDeviceDetail)return;window._currentAdbDeviceDetail=null;let t=document.getElementById(`adbListView`);[`adbDetailView`,`adbSmsPageView`,`adbCallsPageView`,`adbContactsPageView`].forEach(e=>{let t=document.getElementById(e);t&&(t.style.display=`none`)}),t&&(t.style.display=`block`);let n=document.getElementById(`settingsDetailNavTitle`);if(n&&(n.textContent=`ADB Devices`),e&&window.location.hash.includes(`&dev=`))try{history.back()}catch{}}function Xi(e){Ji(e)}function Zi(){let e=document.getElementById(`adbDetailView`);if(!e||e.style.display===`none`)return;let t=Gi.find(e=>e.serial===K||e.bus===K)||Gi[0],n=Vr(t?t.serial||t.bus||K:K||`default_adb`),r=!!n.torch;Hr(r);let i=document.getElementById(`dispTorchSub`);i&&(i.innerHTML=`<strong style="color:${r?`#f59e0b`:`var(--text-dim)`};">State: ${r?`ON`:`OFF`}</strong> &bull; High-intensity rear camera LED torch`);let a=n.screenAwake!==!1,o=document.getElementById(`btnDisplayWake`),s=document.getElementById(`btnDisplaySleep`);o&&(a?o.classList.add(`active-cyan`):o.classList.remove(`active-cyan`)),s&&(a?s.classList.remove(`active-cyan`):s.classList.add(`active-cyan`));let c=document.getElementById(`dispPowerSub`);c&&(c.innerHTML=`<strong style="color:${a?`#38bdf8`:`var(--text-dim)`};">State: ${a?`AWAKE`:`SLEEPING`}</strong> &bull; Handset touch display is ${a?`active`:`powered down`}`);let l=document.getElementById(`dispVolumeSub`);if(l){let e=n.volume===0;l.innerHTML=`<strong style="color:${e?`#f59e0b`:`var(--text-main)`};">Level: ${e?`MUTED`:`Volume ${n.volume}`}</strong> &bull; Speaker media audio level`}let u=document.getElementById(`dispRadioSub`);u&&(u.innerHTML=`<strong style="color:#10b981;">State: 5G SA Connected</strong> &bull; Cycle airplane mode to re-attach`);let d=document.getElementById(`dispWirelessAdbSub`);if(d){let e=!!n.wirelessAdb;d.innerHTML=`<strong style="color:${e?`#10b981`:`var(--text-dim)`};">State: ${e?`Enabled (Port 5555)`:`Disabled`}</strong> &bull; TCP/IP network debugging`}}async function Qi(e){e&&(e.classList.add(`active-green`,`btn-pulse`),setTimeout(()=>e.classList.remove(`btn-pulse`),350));let t=document.getElementById(`dispWirelessAdbStatus`);t&&(t.className=`setting-pill pill-green`,t.textContent=`PORT 5555 READY`),Q(`Enabling wireless ADB on port 5555...`,`info`);try{await p(`/cgi-bin/device?action=wireless_adb&port=5555`),Q(`Wireless ADB enabled on port 5555!`,`success`)}catch(e){console.error(e)}}function $i(e){if(!e||typeof e!=`string`)return{device:`Unknown Device`,browser:`Web Browser`};let t=`Generic Device`,n=`Web Browser`,r=/Android/i.test(e),i=/iPhone/i.test(e),a=/iPad/i.test(e),o=/Macintosh|Mac OS X/i.test(e),s=/Windows NT/i.test(e),c=/Linux/i.test(e)&&!r;if(r){let n=e.match(/Android\s+([0-9\.]+)/i),r=n?`Android ${n[1]}`:`Android`,i=e.match(/Android[^;]+;\s*([^;\)]+)/i),a=i?i[1].trim():``;a&&a!==`K`&&!a.startsWith(`Build/`)?(a=a.replace(/\s*Build\/.*$/i,``).trim(),t=`${r} (${a})`):t=`${r} Phone`}else if(i){let n=e.match(/OS\s+([0-9_]+)/i),r=n?n[1].replace(/_/g,`.`):``;t=r?`Apple iPhone (iOS ${r})`:`Apple iPhone`}else if(a){let n=e.match(/OS\s+([0-9_]+)/i),r=n?n[1].replace(/_/g,`.`):``;t=r?`Apple iPad (iPadOS ${r})`:`Apple iPad`}else o?t=`Apple Mac (macOS)`:s?t=/Windows NT 10\.0/i.test(e)?`Windows 10/11 (PC)`:/Windows NT 6\.3/i.test(e)?`Windows 8.1 (PC)`:/Windows NT 6\.1/i.test(e)?`Windows 7 (PC)`:`Windows (PC)`:c&&(t=/x86_64/i.test(e)?`Linux (x86_64)`:/aarch64|arm64/i.test(e)?`Linux (ARM64)`:/armv7|arm/i.test(e)?`Linux (ARM)`:`Linux Workstation`);if(/HeadlessChrome\/([0-9\.]+)/i.test(e)){let t=e.match(/HeadlessChrome\/([0-9\.]+)/i),r=t?t[1].split(`.`):[];n=`HeadlessChrome ${r[0]?r[0]+`.`+(r[1]||`0`):``}`.trim()}else if(/Edg\/([0-9\.]+)/i.test(e)){let t=e.match(/Edg\/([0-9\.]+)/i),r=t?t[1].split(`.`):[];n=`Edge ${r[0]?r[0]+`.`+(r[1]||`0`):``}`.trim()}else if(/OPR\/([0-9\.]+)/i.test(e)){let t=e.match(/OPR\/([0-9\.]+)/i);n=`Opera ${(t?t[1].split(`.`):[])[0]||``}`.trim()}else if(/Firefox\/([0-9\.]+)/i.test(e)){let t=e.match(/Firefox\/([0-9\.]+)/i),r=t?t[1].split(`.`):[];n=`Firefox ${r[0]?r[0]+`.`+(r[1]||`0`):``}`.trim()}else if(/Chrome\/([0-9\.]+)/i.test(e)){let t=e.match(/Chrome\/([0-9\.]+)/i),r=t?t[1].split(`.`):[],i=r[0]?`${r[0]}.${r[1]||`0`}`:``;n=/Mobile/i.test(e)?`Chrome Mobile ${i}`:`Chrome ${i}`}else if(/Safari\/([0-9\.]+)/i.test(e)&&!/Chrome/i.test(e)){let t=e.match(/Version\/([0-9\.]+)/i),r=t?t[1].split(`.`)[0]:``;n=r?`Safari ${r}`:`Safari`}return{device:t,browser:n}}function ea(e){let t=e&&!isNaN(e)&&e>0?new Date(e*1e3):new Date;return isNaN(t.getTime())?``:`${String(t.getDate()).padStart(2,`0`)} ${[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`][t.getMonth()]||``} ${t.getFullYear()}, ${String(t.getHours()).padStart(2,`0`)}:${String(t.getMinutes()).padStart(2,`0`)}:${String(t.getSeconds()).padStart(2,`0`)}`}async function ta(){let e=document.getElementById(`activeSessionsFlatList`);if(!e)return;let t=localStorage.getItem(`maxnet_token`)||``;try{let n=await(await fetch(`/cgi-bin/auth?action=list_sessions&token=${encodeURIComponent(t)}`)).json(),r=n.sessions||[],i=n.current_ip||`10.0.0.111`,a=r.find(e=>e.is_current||e.token===t),o=r.filter(e=>!e.is_current&&e.token!==t),s=$i(a&&a.ua?a.ua:navigator.userAgent),c=ea(a?a.created||a.last_active:null),l=``;l+=`
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">${$(s.device)} &bull; ${$(s.browser)}</span>
              <span class="setting-label-sub"><strong style="color:#10b981;">This Device</strong> &bull; ${$(i)} &bull; ${c}</span>
            </div>
            <div class="setting-control-col">
              <button type="button" class="round-action-btn btn-danger-action" title="Log Out (This Device)" onclick="logoutSession()">
                <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          </div>
        `,o.forEach(e=>{let t=$i(e.ua||``),n=ea(e.created||e.last_active);l+=`
            <div class="setting-row-item">
              <div class="setting-label-col">
                <span class="setting-label-bold">${$(t.device)} &bull; ${$(t.browser)}</span>
                <span class="setting-label-sub">${$(e.ip||`10.0.0.1`)} &bull; ${n}</span>
              </div>
              <div class="setting-control-col">
                <button type="button" class="round-action-btn btn-danger-action" title="Remove Session" onclick="logoutSingleDevice('${$(e.token)}')">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </div>
          `}),e.innerHTML=l}catch(e){console.error(`fetchActiveSessions error`,e)}}async function na(e){if(await Z(`Are you sure you want to terminate this remote device session?`,`Terminate Session`,`Terminate`,!0))try{await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`logout_device`,target_token:e})}),ta()}catch(e){console.error(`logoutSingleDevice error`,e)}}async function ra(){if(!await Z(`Are you sure you want to log out all other devices? Only this current browser will remain logged in.`,`Log Out Other Devices`,`Log Out Others`,!0))return;let e=localStorage.getItem(`maxnet_token`)||``;try{await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`logout_others`,token:e})}),Q(`All other remote device sessions have been revoked.`,`success`),ta()}catch(e){console.error(`logoutOtherDevices error`,e)}}async function ia(){if(await Z(`Warning: This will terminate all active sessions including this device and immediately lock the gateway. Continue?`,`Terminate All Sessions`,`Log Out All`,!0)){try{await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`logout_all`})})}catch{}localStorage.removeItem(`maxnet_token`),localStorage.removeItem(`maxnet_auth`),h()}}async function aa(){if(!await Z(`Are you sure you want to sign out from this device?`,`Sign Out`,`Sign Out`,!0))return;let e=localStorage.getItem(`maxnet_token`)||``;try{await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`logout`,token:e})})}catch{}localStorage.removeItem(`maxnet_token`),localStorage.removeItem(`maxnet_auth`),h()}var oa=`ping`,sa=!1,ca=0,la=null,ua=`ALL`,da=`common`,fa=`20, 21, 22, 23, 25, 53, 67, 68, 69, 80, 110, 119, 123, 135, 137, 138, 139, 143, 161, 162, 389, 443, 445, 465, 514, 587, 636, 873, 993, 995, 1080, 1194, 1433, 1521, 1723, 1883, 2049, 2082, 2083, 2086, 2087, 2181, 3000, 3128, 3306, 3389, 4369, 5000, 5060, 5222, 5432, 5672, 5900, 6379, 6443, 6667, 7000, 7001, 7681, 8000, 8008, 8080, 8081, 8443, 8888, 9000, 9090, 9092, 9200, 9418, 9999, 10000, 27017, 27018, 50000, 51820`;function pa(e){sa&&ya(),oa=e,document.querySelectorAll(`.diag-nav-tab`).forEach(t=>{let n=t.getAttribute(`data-tool`)===e;t.classList.toggle(`active`,n),t.style.background=n?`#38bdf8`:`transparent`,t.style.color=n?`#0f172a`:`var(--text-dim)`}),Object.entries({ping:`diagConfigPing`,route:`diagConfigRoute`,ports:`diagConfigPorts`,whois:`diagConfigWhois`,dns:`diagConfigDns`}).forEach(([t,n])=>{let r=document.getElementById(n);r&&(r.style.display=t===e?`block`:`none`)});let t=document.getElementById(`diagTargetInput`);t&&(e===`whois`&&(t.value===`1.1.1.1`||!t.value)?t.value=`google.com`:e!==`dns`||t.value!==`1.1.1.1`&&t.value||(t.value=`cloudflare.com`))}function ma(e){da=e;let t=document.getElementById(`btnPortModeCommon`),n=document.getElementById(`btnPortModeAll`),r=document.getElementById(`diagPortsCommonBox`);t&&n&&(t.style.background=e===`common`?`#38bdf8`:`transparent`,t.style.color=e===`common`?`#0f172a`:`var(--text-dim)`,n.style.background=e===`all`?`#38bdf8`:`transparent`,n.style.color=e===`all`?`#0f172a`:`var(--text-dim)`),r&&(r.style.display=e===`common`?`block`:`none`)}function ha(){let e=document.getElementById(`diagPortsListInput`);e&&(e.value=fa)}function ga(e){ua=e,document.querySelectorAll(`#diagDnsTypesBar .dns-type-pill`).forEach(t=>{let n=t.textContent.trim()===e;t.classList.toggle(`active`,n),t.style.background=n?`#38bdf8`:`rgba(255,255,255,0.06)`,t.style.color=n?`#0f172a`:`var(--text-dim)`})}function _a(){let e=document.getElementById(`diagResultsList`);e&&(e.innerHTML=``);let t=document.getElementById(`diagResultsContainer`);t&&(t.style.display=`none`)}function va(){sa?ya():ba()}function ya(){sa=!1,la&&(clearTimeout(la),la=null);let e=document.getElementById(`btnDiagStart`);e&&(e.textContent=`START`,e.style.background=`linear-gradient(135deg, #0284c7, #0369a1)`);let t=document.getElementById(`btnDiagOutputStop`);t&&(t.textContent=`RE-RUN`,t.style.background=`linear-gradient(135deg, #0284c7, #0369a1)`);let n=document.getElementById(`diagOutputStatusBadge`);n&&(n.textContent=`STOPPED`,n.className=`card-badge amber`)}async function ba(){let e=(document.getElementById(`diagTargetInput`).value||``).trim();if(!e){Q(`Please enter a Domain Name or IP Address.`,`warning`);return}sa=!0;let t=document.getElementById(`btnDiagStart`);t&&(t.textContent=`STOP`,t.style.background=`linear-gradient(135deg, #ef4444, #dc2626)`);let n=document.getElementById(`btnDiagOutputStop`);n&&(n.textContent=`STOP`,n.style.background=`linear-gradient(135deg, #ef4444, #dc2626)`);let r=document.getElementById(`diagOutputStatusBadge`);r&&(r.textContent=`RUNNING`,r.className=`card-badge sky`);let i=document.getElementById(`diagOutputTargetSubtitle`);i&&(i.textContent=`Target: ${e} (${oa.toUpperCase()})`);let a=document.getElementById(`diagResultTitle`);a&&(a.textContent=`${oa.toUpperCase()} RESULTS: ${e}`);let o=document.getElementById(`diagResultsContainer`);o&&(o.style.display=`block`),typeof O==`function`&&O(`acc-diag-output`);let s=document.getElementById(`diagResultsList`);oa===`ping`?(ca=0,s&&(s.innerHTML=``),xa()):oa===`route`?Sa(e):oa===`ports`?wa(e):oa===`whois`?Ta(e):oa===`dns`&&Ea(e)}async function xa(){if(!sa||oa!==`ping`)return;let e=(document.getElementById(`diagTargetInput`).value||`1.1.1.1`).trim(),t=parseFloat(document.getElementById(`diagPingDelay`).value)||1,n=parseInt(document.getElementById(`diagPingSize`).value,10)||56,r=!!document.getElementById(`diagPingIpv6`).checked;ca++;let i=ca;try{let t=`/cgi-bin/diagnostics?tool=ping&target=${encodeURIComponent(e)}&size=${n}&seq=${i}&ipv6=${r}`,a=await(await fetch(t)).json();if(!sa)return;let o=document.getElementById(`diagResultsList`);if(o){let t=!!a.success,r=a.time_ms,s=a.ttl,c=a.ip||e,l=document.createElement(`div`);l.style.cssText=`display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--card-inner, #161822); border:1px solid rgba(255,255,255,0.06); border-radius:8px; font-family:var(--font-mono); font-size:11.5px; animation:fadeIn 0.2s ease;`,l.innerHTML=`
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="width:8px; height:8px; border-radius:50%; background:${t?`#10b981`:`#ef4444`}; ${t?`box-shadow:0 0 6px rgba(16,185,129,0.8);`:``}"></span>
              <span style="color:var(--text-dim); font-weight:700;">#${i}</span>
              <span style="color:var(--text-main); font-weight:600;">${$(c)}</span>
              <span style="color:var(--text-dim); font-size:10px;">${a.bytes||n} bytes</span>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="color:${t?`#38bdf8`:`#ef4444`}; font-weight:800;">${t?r+` ms`:`Request timeout`}</span>
              ${s>0?`<span style="color:var(--text-dim); font-size:10px;">ttl=${s}</span>`:``}
            </div>
          `,o.insertBefore(l,o.firstChild)}}catch(e){console.error(`Ping error`,e)}sa&&oa===`ping`&&(la=setTimeout(xa,Math.max(200,t*1e3)))}async function Sa(e){let t=document.getElementById(`diagResultsList`);t&&(t.innerHTML=`<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Tracing route hops to ${$(e)}...</div>`);let n=parseFloat(document.getElementById(`diagRouteMaxDelay`).value)||.5,r=!!document.getElementById(`diagRouteUdp`).checked,i=!!document.getElementById(`diagRouteIpv6`).checked;try{let a=`/cgi-bin/diagnostics?tool=route&target=${encodeURIComponent(e)}&max_delay=${n}&udp=${r}&ipv6=${i}`,o=(await(await fetch(a)).json()).hops||[];if(t){if(o.length===0)t.innerHTML=`<div style="padding:14px; text-align:center; color:var(--text-dim); font-family:var(--font-mono); font-size:11.5px;">No hops resolved or destination unreachable.</div>`;else{let e=`
              <div style="width:100%; overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; font-family:var(--font-mono); font-size:11px; text-align:left;">
                  <thead>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.08); color:var(--text-dim);">
                      <th style="padding:6px 8px; width:45px;">Hop</th>
                      <th style="padding:6px 8px;">Hostname</th>
                      <th style="padding:6px 8px;">IP Address</th>
                      <th style="padding:6px 8px; text-align:right;">Latency</th>
                    </tr>
                  </thead>
                  <tbody>
            `;o.forEach(t=>{let n=t.host===`*`||t.ip===`*`;e+=`
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:6px 8px; font-weight:700; color:var(--text-main);">#${t.hop}</td>
                  <td style="padding:6px 8px; color:${n?`var(--text-dim)`:`var(--text-main)`};">${$(t.host||`*`)}</td>
                  <td style="padding:6px 8px; color:var(--text-dim);">${$(t.ip||`*`)}</td>
                  <td style="padding:6px 8px; text-align:right; font-weight:700; color:${n?`#ef4444`:`#38bdf8`};">${n?`*`:t.time_ms+` ms`}</td>
                </tr>
              `}),e+=`</tbody></table></div>`,t.innerHTML=e}}}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:12px; font-size:12px;">Route query error: ${$(e.message)}</div>`)}finally{ya()}}async function Ca(e,t){let n=parseInt(t,10),r=n===443||n===8443?`https`:`http`,i=e;(i===`127.0.0.1`||i===`localhost`||i===`0.0.0.0`)&&(i=window.location.hostname);let a=`${r}://${i}:${n}`;await Z(`Are you sure you want to navigate to port ${n}?\n\nTarget URL: ${a}`,`Open Service Port`,`Open in New Tab`,!1)&&window.open(a,`_blank`,`noopener,noreferrer`)}window.confirmOpenPortUrl=Ca;async function wa(e){let t=document.getElementById(`diagResultsList`);t&&(t.innerHTML=`<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Scanning target ports on ${$(e)}...</div>`);let n=fa;if(da===`common`){let e=document.getElementById(`diagPortsListInput`);e&&e.value.trim()&&(n=e.value.trim())}else n=`21,22,23,25,53,80,110,123,135,139,143,443,445,993,995,1723,3306,3389,5000,5060,7681,8080,8443`;let r=n.split(/[\s,]+/).filter(e=>/^\d+$/.test(e)).join(`,`),i=!!document.getElementById(`diagPortsIpv6`)?.checked;try{let n=`/cgi-bin/diagnostics?tool=ports&target=${encodeURIComponent(e)}&ports=${r}&ipv6=${i}`,a=(await(await fetch(n)).json()).ports||[];if(t){let n=a.filter(e=>e.status===`open`),r=new Set([80,443,8080,8443,7681,3e3,5e3,5173,8e3,8888,9e3,9090]),i=`
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; padding:8px 12px; background:rgba(255,255,255,0.02); border:1px solid var(--border-sub); border-radius:8px; font-family:var(--font-mono); font-size:11.5px;">
              <span>Total Scanned: <strong>${a.length}</strong></span>
              <span style="color:#10b981; font-weight:700;">${n.length} OPEN</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
          `;a.forEach(t=>{let n=t.status===`open`,a=n&&r.has(parseInt(t.port,10));i+=`
              <div class="setting-row-item" style="padding:10px 14px; background:var(--card-inner, #161822); border:1px solid ${n?`rgba(16,185,129,0.35)`:`rgba(255,255,255,0.06)`}; border-radius:8px; display:flex; align-items:center; justify-content:space-between; font-family:var(--font-mono);">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="width:8px; height:8px; border-radius:50%; background:${n?`#10b981`:`#ef4444`}; ${n?`box-shadow:0 0 6px rgba(16,185,129,0.8);`:``}"></span>
                  <div>
                    <div style="font-weight:700; color:var(--text-main); font-size:12.5px;">Port ${t.port}</div>
                    <div style="font-size:10px; color:var(--text-dim);">${$(t.service||`Service`)}</div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="card-badge ${n?`emerald`:``}" style="${n?``:`background:rgba(255,255,255,0.04); color:var(--text-dim); border-color:transparent; font-size:9.5px;`}">${n?`OPEN`:`CLOSED`}</span>
                  ${a?`
                    <button type="button" class="round-action-btn" title="Open URL in new tab" onclick="confirmOpenPortUrl('${$(e)}', ${t.port})" style="width:30px; height:30px; min-width:30px; color:#38bdf8;">
                      <svg viewBox="0 0 24 24" style="width:13px; height:13px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </button>
                  `:``}
                </div>
              </div>
            `}),i+=`</div>`,t.innerHTML=i}}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:12px; font-size:12px;">Port scan error: ${$(e.message)}</div>`)}finally{ya()}}async function Ta(e){let t=document.getElementById(`diagResultsList`);t&&(t.innerHTML=`<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Querying WHOIS registry database for ${$(e)}...</div>`);let n=document.getElementById(`diagWhoisServer`).value,r=!!document.getElementById(`diagWhoisIpv6`).checked;try{let i=`/cgi-bin/diagnostics?tool=whois&target=${encodeURIComponent(e)}&server=${encodeURIComponent(n)}&ipv6=${r}`,a=await(await fetch(i)).json();t&&(t.innerHTML=`
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="padding:12px 14px; background:var(--card-inner, #161822); border:1px solid rgba(255,255,255,0.08); border-radius:10px; font-family:var(--font-mono); font-size:11px; display:flex; flex-direction:column; gap:6px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;">
                  <span style="color:var(--text-dim);">Registrar:</span>
                  <span style="font-weight:700; color:var(--text-main); text-align:right;">${$(a.registrar||`N/A`)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;">
                  <span style="color:var(--text-dim);">Creation Date:</span>
                  <span style="font-weight:700; color:var(--text-main);">${$(a.creation_date||`N/A`)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;">
                  <span style="color:var(--text-dim);">Expiry Date:</span>
                  <span style="font-weight:700; color:#38bdf8;">${$(a.expiry_date||`N/A`)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding-top:2px;">
                  <span style="color:var(--text-dim);">Name Servers:</span>
                  <span style="font-weight:600; color:var(--text-main); text-align:right;">${$(a.nameservers||`N/A`)}</span>
                </div>
              </div>
              <div style="padding:10px 12px; background:rgba(0,0,0,0.3); border-radius:8px; font-family:var(--font-mono); font-size:10.5px; color:var(--text-dim); max-height:220px; overflow-y:auto; white-space:pre-wrap; line-height:1.4;">${$(a.raw||`No raw records returned`)}</div>
            </div>
          `)}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:12px; font-size:12px;">Whois error: ${$(e.message)}</div>`)}finally{ya()}}async function Ea(e){let t=document.getElementById(`diagResultsList`);t&&(t.innerHTML=`<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Querying DNS (${ua}) records for ${$(e)}...</div>`);let n=(document.getElementById(`diagDnsServerInput`).value||``).trim(),r=!!document.getElementById(`diagDnsDnssec`).checked,i=!!document.getElementById(`diagDnsAllSections`).checked,a=!!document.getElementById(`diagDnsIpv6`).checked;try{let o=`/cgi-bin/diagnostics?tool=dns&target=${encodeURIComponent(e)}&type=${encodeURIComponent(ua)}&server=${encodeURIComponent(n)}&dnssec=${r}&all_sections=${i}&ipv6=${a}`,s=await(await fetch(o)).json(),c=s.answers||[];if(t){if(c.length===0)t.innerHTML=`
              <div style="padding:14px; text-align:center; color:var(--text-dim); font-family:var(--font-mono); font-size:11.5px;">No ${ua} records found.</div>
              <div style="padding:10px 12px; background:rgba(0,0,0,0.3); border-radius:8px; font-family:var(--font-mono); font-size:10.5px; color:var(--text-dim); max-height:200px; overflow-y:auto; white-space:pre-wrap;">${$(s.raw||``)}</div>
            `;else{let e=`
              <div style="width:100%; overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; font-family:var(--font-mono); font-size:11px; text-align:left;">
                  <thead>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.08); color:var(--text-dim);">
                      <th style="padding:6px 8px;">Domain</th>
                      <th style="padding:6px 8px; width:50px;">TTL</th>
                      <th style="padding:6px 8px; width:65px;">Type</th>
                      <th style="padding:6px 8px;">Record Data / Value</th>
                    </tr>
                  </thead>
                  <tbody>
            `;c.forEach(t=>{e+=`
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:6px 8px; color:var(--text-dim);">${$(t.name)}</td>
                  <td style="padding:6px 8px; color:var(--text-dim);">${$(t.ttl)}s</td>
                  <td style="padding:6px 8px;"><span style="color:#38bdf8; font-weight:700;">${$(t.type)}</span></td>
                  <td style="padding:6px 8px; font-weight:600; color:var(--text-main); word-break:break-all;">${$(t.value)}</td>
                </tr>
              `}),e+=`</tbody></table></div>`,t.innerHTML=e}}}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:12px; font-size:12px;">DNS error: ${$(e.message)}</div>`)}finally{ya()}}async function Da(){let e=document.getElementById(`diagToolSelect`).value,t=document.getElementById(`diagTargetInput`).value.trim(),n=document.getElementById(`diagGuiResults`),r=document.getElementById(`diagRawToggleBox`),i=document.getElementById(`diagOutputBox`);if(!t)Q(`Please enter a target host or IP.`,`warning`);else{n&&(n.style.display=`block`,n.innerHTML=`<div style="text-align:center; padding:16px; color:var(--text-dim); font-size:12px;">Running ${e.toUpperCase()} to ${$(t)}...</div>`),r&&(r.style.display=`none`);try{let n=(await(await fetch(`/cgi-bin/diagnostics?tool=${encodeURIComponent(e)}&target=${encodeURIComponent(t)}`)).json()).output||``;i&&(i.innerText=n),r&&(r.style.display=`block`),Oa(e,t,n);let a=document.getElementById(`acc-diagnostics`);if(a&&a.classList.contains(`expanded`)){let e=a.querySelector(`.accordion-content`);e&&(e.style.maxHeight=`none`,e.style.overflow=`visible`)}}catch(e){n&&(n.innerHTML=`<div style="color:var(--mh-rose); padding:12px; font-size:12px;">Diagnostic request failed: ${$(e.message)}</div>`)}}}function Oa(e,t,n){let r=document.getElementById(`diagGuiResults`);if(r){if(e===`ping`||e===`ping6`){let i=n.match(/\(([0-9a-fA-F.:]+)\)/),a=i?i[1]:t,o=n.match(/(\d+)% packet loss/),s=o?parseInt(o[1],10):100,c=n.match(/(?:rtt|round-trip) min\/avg\/max(?:\/mdev)? = ([0-9.]+)\/([0-9.]+)\/([0-9.]+)/),l=c?c[1]:`--`,u=c?c[2]:`--`,d=c?c[3]:`--`,f=[],p=/time=([0-9.]+) ms/g,m;for(;(m=p.exec(n))!==null;)f.push(m[1]);let h=s===0,g=h?`emerald`:s<100?`gold`:`rose`,_=h?`ONLINE (0% LOSS)`:s<100?`${s}% PACKET LOSS`:`DESTINATION UNREACHABLE`;r.innerHTML=`
          <div class="diag-gui-card">
            <div class="diag-meta-bar">
              <div class="diag-target-pill">
                <span style="color:var(--mh-${e===`ping6`?`purple`:`cyan`}); font-size:10px; border:1px solid currentColor; padding:2px 5px; border-radius:3px;">${e.toUpperCase()}</span>
                <span>${$(t)}</span>
                <span style="color:var(--text-dim); font-size:11px;">→ ${$(a)}</span>
              </div>
              <span class="card-badge ${g}">${_}</span>
            </div>

            <div class="diag-stat-grid">
              <div class="diag-stat-box">
                <span class="diag-stat-label">Min Latency</span>
                <span class="diag-stat-val" style="color:var(--mh-emerald);">${l}<small style="font-size:10px;"> ms</small></span>
              </div>
              <div class="diag-stat-box">
                <span class="diag-stat-label">Avg Latency</span>
                <span class="diag-stat-val" style="color:var(--text-main); font-weight:700;">${u}<small style="font-size:10px;"> ms</small></span>
              </div>
              <div class="diag-stat-box">
                <span class="diag-stat-label">Max Latency</span>
                <span class="diag-stat-val" style="color:var(--mh-purple);">${d}<small style="font-size:10px;"> ms</small></span>
              </div>
              <div class="diag-stat-box">
                <span class="diag-stat-label">Packet Loss</span>
                <span class="diag-stat-val" style="color:var(--${h?`mh-emerald`:`mh-rose`});">${s}%</span>
              </div>
            </div>

            ${f.length>0?`
              <div>
                <span style="font-size:10px; text-transform:uppercase; font-weight:700; color:var(--text-dim); font-family:var(--font-mono);">Probe Sequence</span>
                <div class="diag-packet-row">
                  ${f.map((e,t)=>`
                    <div class="diag-packet-chip">
                      <span style="color:var(--text-dim); font-size:9.5px;">#${t+1}</span>
                      <strong>${e} ms</strong>
                    </div>
                  `).join(``)}
                </div>
              </div>
            `:``}
          </div>
        `}else if(e===`traceroute`){let e=n.split(`
`),i=[];e.forEach(e=>{let t=e.match(/^\s*(\d+)\s+([^\s]+)(?:\s+\(([^)]+)\))?\s+([0-9.]+\s*ms|\*)/);t&&i.push({hop:t[1],host:t[2],ip:t[3]||t[2],time:t[4]})}),r.innerHTML=`
          <div class="diag-gui-card">
            <div class="diag-meta-bar">
              <div class="diag-target-pill">
                <span style="color:var(--mh-iris); font-size:10px; border:1px solid currentColor; padding:2px 5px; border-radius:3px;">TRACEROUTE</span>
                <span>${$(t)}</span>
              </div>
              <span class="card-badge emerald">${i.length} HOPS DETECTED</span>
            </div>

            <div style="width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch;">
            <table class="diag-hops-table" style="table-layout:fixed; width:100%;">
              <thead>
                <tr>
                  <th style="width:45px;">Hop</th>
                  <th style="width:35%;">Gateway / Host</th>
                  <th style="width:35%;">IP Address</th>
                  <th style="width:20%;">Latency</th>
                </tr>
              </thead>
              <tbody>
                ${i.length>0?i.map(e=>`
                  <tr>
                    <td style="color:var(--text-main); font-weight:700;">#${e.hop}</td>
                    <td style="word-break:break-all; overflow-wrap:anywhere;">${$(e.host)}</td>
                    <td style="color:var(--text-dim); word-break:break-all; overflow-wrap:anywhere;">${$(e.ip)}</td>
                    <td style="color:var(--mh-emerald); font-weight:700; white-space:nowrap;">${$(e.time)}</td>
                  </tr>
                `).join(``):`<tr><td colspan="4" style="text-align:center; color:var(--text-dim); padding:10px;">No traceroute hops returned.</td></tr>`}
              </tbody>
            </table>
            </div>
          </div>
        `}else if(e===`nslookup`){let e=/Address(?:\s+\d+)?:\s+([0-9a-fA-F.:]+)/g,i=[],a;for(;(a=e.exec(n))!==null;)!a[1].includes(`#53`)&&!a[1].includes(`:53`)&&a[1]!==`127.0.0.1`&&i.push(a[1]);let o=n.match(/Name:\s+([^\s]+)/);r.innerHTML=`
          <div class="diag-gui-card">
            <div class="diag-meta-bar">
              <div class="diag-target-pill">
                <span style="color:var(--text-main); font-size:10px; border:1px solid rgba(255,255,255,0.25); padding:2px 5px; border-radius:3px;">DNS LOOKUP</span>
                <span>${$(o?o[1]:t)}</span>
              </div>
              <span class="card-badge">${i.length} RECORDS</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:6px;">
              ${i.length>0?i.map(e=>{let t=e.includes(`:`);return`
                  <div class="diag-dns-record">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span class="card-badge ${t?`purple`:`cyan`}" style="font-size:9.5px;">${t?`AAAA (IPv6)`:`A (IPv4)`}</span>
                      <strong style="color:var(--text-main);">${$(e)}</strong>
                    </div>
                    <button class="mh-btn btn-sm btn-ghost" onclick="navigator.clipboard.writeText('${e}'); showToast('Copied ' + '${e}', 'success');" style="font-size:10px; padding:2px 6px;">COPY</button>
                  </div>
                `}).join(``):`<div style="color:var(--text-dim); font-size:11.5px; padding:10px; text-align:center;">No DNS address records found.</div>`}
            </div>
          </div>
        `}}}function ka(e){return e&&{"255.255.255.0":`24`,"255.255.0.0":`16`,"255.0.0.0":`8`}[e]||`24`}function Aa(e){return{24:`255.255.255.0`,16:`255.255.0.0`,8:`255.0.0.0`}[e]||`255.255.255.0`}function ja(e){let t=document.getElementById(`netCidrSelect`);t&&(t.value=[`255.255.255.0`,`255.255.0.0`,`255.0.0.0`].includes(e.trim())?ka(e.trim()):`custom`)}function Ma(e){let t=document.getElementById(`netMask`);t&&e!==`custom`&&(t.value=Aa(e))}function Na(e){let t=document.getElementById(`rowDhcpPool`);t&&(t.style.opacity=e?`1`:`0.4`,t.style.pointerEvents=e?`auto`:`none`)}function Pa(e){[`rowIpv6Addrs`,`rowIpv6WanMode`,`rowIpv6Ra`,`rowIpv6Dhcp6`,`rowIpv6Ula`,`rowIpv6Privacy`].forEach(t=>{let n=document.getElementById(t);n&&(n.style.opacity=e?`1`:`0.38`,n.style.pointerEvents=e?`auto`:`none`)});let t=document.getElementById(`badgeIpv6Status`);t&&(e?(t.textContent=`DUAL-STACK ONLINE`,t.className=`setting-status-badge badge-active`):(t.textContent=`IPV6 DISABLED`,t.className=`setting-status-badge badge-disabled`))}function Fa(e){let t=document.getElementById(`netDns`);t&&(t.value=e,t.style.borderColor=`var(--mh-emerald)`)}function Ia(e=[]){let t=document.getElementById(`staticLeasesListContainer`),n=document.getElementById(`staticLeasesCountBadge`);n&&(n.textContent=`${e.length} RESERVED`);let r=document.getElementById(`disp_static_leases_count`);r&&(r.textContent=`${e.length} Devices Configured • Permanent DHCP IPv4 reservation`),t&&(t.innerHTML=!e||e.length===0?`<div style="padding:20px; text-align:center; color:var(--text-dim); font-size:12px; font-family:var(--font-mono); background:rgba(255,255,255,0.02); border-radius:8px;">No static DHCP leases registered. Click Add Reservation to create one.</div>`:e.map(e=>`
        <div class="setting-row-item" style="background:rgba(255,255,255,0.02) !important; border:1px solid rgba(255,255,255,0.05) !important; border-radius:10px !important; margin-bottom:6px !important; display:flex; align-items:center; justify-content:space-between;">
          <div class="setting-label-col">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="setting-label-bold" style="color:var(--text-main); font-size:12px;">${$(e.name||`Client`)}</span>
              <span style="font-size:11px; color:#38bdf8; font-weight:700; font-family:var(--font-mono);">${$(e.ip||``)}</span>
            </div>
            <span class="setting-label-sub" style="font-family:var(--font-mono); font-size:11px; color:var(--text-dim);">MAC: ${$(e.mac||``)}</span>
          </div>
          <div class="setting-control-col">
            <button type="button" class="round-action-btn btn-danger-action" title="Delete Reservation" onclick="delStaticLease('${$(e.mac)}')">
              <svg viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `).join(``))}async function La(){let e=document.getElementById(`newLeaseName`),t=document.getElementById(`newLeaseMac`),n=document.getElementById(`newLeaseIp`),r=e?e.value.trim():``,i=t?t.value.trim():``,a=n?n.value.trim():``;if(!i||!a)Q(`Please enter both MAC address and IP for the reservation.`,`warning`);else try{let o=await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`add_lease`,name:r||`client`,mac:i,ip:a})})).json();o.status===`ok`?(e&&(e.value=``),t&&(t.value=``),n&&(n.value=``),await Va()):Q(`Failed to add lease: `+(o.message||`Unknown error`),`error`)}catch(e){Q(`Error adding lease: `+e.message,`error`)}}async function Ra(e){if(await Z(`Remove DHCP reservation for MAC ${e}?`,`Remove Reservation`,`Remove`,!0))try{Di(`saving`,`Removing reservation...`),(await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`del_lease`,mac:e})})).json()).status===`ok`?(Di(`saved`,`Reservation Removed`),await Va()):Di(`error`,`Removal failed`)}catch(e){Di(`error`,`Delete error`),console.error(e)}}async function za(e){let t=document.getElementById(`dispUsbTetherState`),n=document.getElementById(`dispUsbTetherBadge`);e?(t&&(t.textContent=`State: Active (usb0) • Primary upstream internet gateway over USB`),n&&(n.className=`setting-status-badge badge-active`,n.textContent=`5G SA ONLINE`),Q(`USB WAN Tethering enabled`,`success`)):(t&&(t.textContent=`State: Disabled • USB tethering interface usb0 brought down`),n&&(n.className=`setting-status-badge badge-disabled`,n.textContent=`DISCONNECTED`),Q(`USB WAN Tethering disabled`,`info`));try{await p(`/cgi-bin/device?action=settings_tether&enabled=`+(e?`1`:`0`))}catch{}}async function Ba(e){Q(`Tethering DNS Forwarding `+(e?`Enabled`:`Disabled`),`info`)}async function Va(){try{let e=await(await fetch(`/cgi-bin/network`)).json();if(e.hostname&&document.getElementById(`netDeviceHostname`)){document.getElementById(`netDeviceHostname`).value=e.hostname;let t=document.getElementById(`disp_device_hostname`),n=e.hostname.toLowerCase();t&&(t.textContent=`${e.hostname} • ${n}.lan / ${n}.local`)}if(document.getElementById(`netCustomMac`)){document.getElementById(`netCustomMac`).value=e.custom_mac||``,e.hw_mac&&document.getElementById(`netHwMac`)&&(document.getElementById(`netHwMac`).value=e.hw_mac);let t=document.getElementById(`disp_custom_mac`);t&&(t.textContent=e.custom_mac?`Custom: ${e.custom_mac} • Hardware: ${e.hw_mac||`ca:e7:b7:34:8f:ac`}`:`Default: ${e.hw_mac||`ca:e7:b7:34:8f:ac`} • Hardware MAC in use`)}if(e.lan_ip){document.getElementById(`netLanIp`)&&(document.getElementById(`netLanIp`).value=e.lan_ip);let t=document.getElementById(`disp_lan_ip`);t&&(t.textContent=e.lan_ip)}if(e.netmask){document.getElementById(`netMask`)&&(document.getElementById(`netMask`).value=e.netmask,ja(e.netmask));let t=document.getElementById(`disp_net_mask`);t&&(t.textContent=`${e.netmask} (/${ka(e.netmask)})`)}if(e.gateway!==void 0&&document.getElementById(`netGateway`)){document.getElementById(`netGateway`).value=e.gateway||``;let t=document.getElementById(`disp_net_gateway`);t&&(t.textContent=e.gateway?e.gateway:`None (Direct br-lan)`)}if(e.mtu&&document.getElementById(`netMtu`)){document.getElementById(`netMtu`).value=e.mtu;let t=document.getElementById(`disp_net_mtu`);t&&(t.textContent=`${e.mtu} bytes`)}if(e.dns&&document.getElementById(`netDns`)&&(document.getElementById(`netDns`).value=e.dns),e.dhcp_start&&document.getElementById(`netDhcpStart`)&&(document.getElementById(`netDhcpStart`).value=e.dhcp_start),e.dhcp_limit&&document.getElementById(`netDhcpLimit`)&&(document.getElementById(`netDhcpLimit`).value=e.dhcp_limit),e.dhcp_leasetime&&document.getElementById(`netDhcpLease`)&&(document.getElementById(`netDhcpLease`).value=e.dhcp_leasetime),document.getElementById(`netDhcpMasterToggle`)){let t=e.dhcp_ignore!==1&&e.dhcp_ignore!==`1`;document.getElementById(`netDhcpMasterToggle`).checked=t,Na(t)}let t=document.getElementById(`netLanBadge`);if(t&&e.lan_ip&&(t.textContent=`${e.lan_ip}/${ka(e.netmask||`255.255.255.0`)}`),e.wan){let t=document.getElementById(`wanStatusDot`),n=document.getElementById(`wanProtoBadge`),r=document.getElementById(`wanIpBadge`),i=document.getElementById(`wanStateBadge`);n&&(n.textContent=(e.wan.proto||`DHCP`).toUpperCase()),r&&(r.textContent=e.wan.ip||`--`),e.wan.up?(t&&(t.style.background=`#10b981`),i&&(i.className=`toggle-status-badge on`,i.textContent=`CONNECTED`)):(t&&(t.style.background=`#71717a`),i&&(i.className=`toggle-status-badge off`,i.textContent=`DISCONNECTED`))}if(Ia(e.static_leases||[]),document.getElementById(`netIpv6MasterToggle`)){let t=e.ipv6_enabled===void 0||e.ipv6_enabled===1||e.ipv6_enabled===`1`;document.getElementById(`netIpv6MasterToggle`).checked=t,Pa(t)}if(e.ipv6_wan_mode&&document.getElementById(`netIpv6WanMode`)){document.getElementById(`netIpv6WanMode`).value=e.ipv6_wan_mode;let t=document.getElementById(`disp_ipv6_wan_mode`);t&&(t.textContent={dhcpv6:`DHCPv6-PD & SLAAC (Automatic)`,slaac:`SLAAC Only (Stateless Autoconfiguration)`,static:`Static IPv6 Address`,disabled:`Disabled (No WAN IPv6)`}[e.ipv6_wan_mode]||e.ipv6_wan_mode)}if(document.getElementById(`netIpv6RaToggle`)&&(document.getElementById(`netIpv6RaToggle`).checked=e.ipv6_ra===void 0||e.ipv6_ra===1||e.ipv6_ra===`1`),document.getElementById(`netIpv6Dhcp6Toggle`)&&(document.getElementById(`netIpv6Dhcp6Toggle`).checked=e.ipv6_dhcp6===1||e.ipv6_dhcp6===`1`),e.ipv6_ula&&document.getElementById(`netIpv6Ula`)){document.getElementById(`netIpv6Ula`).value=e.ipv6_ula;let t=document.getElementById(`disp_ipv6_ula`);t&&(t.textContent=`${e.ipv6_ula} • Unique local address scope`)}document.getElementById(`netIpv6PrivacyToggle`)&&(document.getElementById(`netIpv6PrivacyToggle`).checked=e.ipv6_privacy===1||e.ipv6_privacy===`1`);let n=document.getElementById(`disp_ipv6_addrs`);n&&(n.textContent=`LAN: ${e.ipv6_lan_addr||`fd00::1/60`} • WAN: ${e.ipv6_wan_addr||`None`}`),document.getElementById(`netHwFlowToggle`)&&(document.getElementById(`netHwFlowToggle`).checked=e.flow_offloading_hw===void 0||e.flow_offloading_hw===1||e.flow_offloading_hw===`1`),document.getElementById(`netSwFlowToggle`)&&(document.getElementById(`netSwFlowToggle`).checked=e.flow_offloading===void 0||e.flow_offloading===1||e.flow_offloading===`1`),document.getElementById(`netMssClampToggle`)&&(document.getElementById(`netMssClampToggle`).checked=e.mss_clamping===void 0||e.mss_clamping===1||e.mss_clamping===`1`),document.getElementById(`netDnsRebindToggle`)&&(document.getElementById(`netDnsRebindToggle`).checked=e.dns_rebind===void 0||e.dns_rebind===1||e.dns_rebind===`1`),typeof qa==`function`&&qa(e)}catch(e){console.error(`fetchNetworkConfig error`,e)}}async function Ha(){Oi(50)}function Ua(){Wa()}function Wa(){let e=(document.getElementById(`wanProtoSelect`)?document.getElementById(`wanProtoSelect`).value:`dhcp`)||`dhcp`,t=document.getElementById(`disp_wan_proto`);t&&(t.textContent=e===`pppoe`?`PPPoE (Fiber / DSL Dial-up Session)`:e===`static`?`Static IPv4 (Fixed Gateway Address)`:`DHCP Client (Dynamic IPv4 from ISP)`);let n=document.getElementById(`pppoeRedirectRow`),r=document.getElementById(`wanStaticConfigFields`);n&&(n.style.display=e===`pppoe`?`flex`:`none`),r&&(r.style.display=e===`static`?`flex`:`none`);let i=document.getElementById(`wanStaticIp`)?document.getElementById(`wanStaticIp`).value:``,a=document.getElementById(`disp_wan_static_ip`);a&&(a.textContent=i?`${i} • Fixed Address`:`192.168.1.2 (Tap to configure)`);let o=document.getElementById(`wanStaticNetmask`)?document.getElementById(`wanStaticNetmask`).value:``,s=document.getElementById(`disp_wan_static_netmask`);s&&(s.textContent=o?`${o}`:`255.255.255.0 (/24)`);let c=document.getElementById(`wanStaticGateway`)?document.getElementById(`wanStaticGateway`).value:``,l=document.getElementById(`disp_wan_static_gateway`);l&&(l.textContent=c?`${c} • Upstream Gateway`:`192.168.1.1 (Tap to configure)`);let u=document.getElementById(`wanCustomMacInput`)?document.getElementById(`wanCustomMacInput`).value:``,d=document.getElementById(`disp_wan_custom_mac`);d&&(d.textContent=u?`Custom: ${u.toLowerCase()} • Hardware override active`:`Default Hardware MAC in use`)}async function Ga(e){let t=document.getElementById(`netWanAsLanToggle`);t&&(t.checked=e),Ka(e);try{typeof Q==`function`&&Q(e?`Bridging WAN port into LAN switch (br-lan)...`:`Restoring WAN uplink port...`,`info`);let n=await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_wan_as_lan`,enabled:e})})).json();n.status===`ok`?(typeof Q==`function`&&Q(e?`WAN port is now 5th LAN port (br-lan)!`:`Standard WAN uplink restored!`,`success`),typeof qa==`function`&&qa(),typeof Va==`function`&&Va()):(typeof Q==`function`&&Q(`Failed to switch WAN mode: `+(n.message||`Error`),`error`),t&&(t.checked=!e),Ka(!e))}catch(n){typeof Q==`function`&&Q(`Network error: `+n.message,`error`),t&&(t.checked=!e),Ka(!e)}}function Ka(e){let t=document.getElementById(`badgeWanAsLan`);t&&(t.textContent=e?`BRIDGED TO LAN`:`STANDALONE WAN`,t.className=`card-badge `+(e?`sky`:`gray`));let n=document.getElementById(`disp_net_wan_as_lan_sub`);n&&(n.textContent=e?`WAN port is bridged into br-lan (10.0.0.1/24) as 5th switch port. WAN uplink routing disabled.`:`Convert physical WAN port into a 5th Gigabit LAN switch port (bridged into br-lan). Default: Disabled (WAN Uplink).`);let r=document.getElementById(`wanProtocolSection`);r&&(r.style.opacity=e?`0.4`:`1`,r.style.pointerEvents=e?`none`:`auto`);let i=document.getElementById(`ifaceEthWanState`);i&&e&&(i.textContent=`Bridged (LAN 5)`)}async function qa(e){try{let t=e||await(await fetch(`/cgi-bin/network`)).json(),n=t.wan||{},r=!!(t.wan_as_lan||t.wan&&t.wan.as_lan),i=document.getElementById(`netWanAsLanToggle`);i&&(i.checked=r),Ka(r),document.getElementById(`wanProtoSelect`)&&(document.getElementById(`wanProtoSelect`).value=n.proto||`dhcp`),document.getElementById(`wanPppoeUser`)&&(document.getElementById(`wanPppoeUser`).value=n.username||``),document.getElementById(`wanPppoePass`)&&(document.getElementById(`wanPppoePass`).value=n.password||``),document.getElementById(`wanPppoeService`)&&(document.getElementById(`wanPppoeService`).value=n.service||``),document.getElementById(`wanPppoeMtu`)&&(document.getElementById(`wanPppoeMtu`).value=n.mtu||1492),document.getElementById(`wanCustomMacInput`)&&(document.getElementById(`wanCustomMacInput`).value=n.custom_mac||``),n.ip&&document.getElementById(`wanStaticIp`)&&!document.getElementById(`wanStaticIp`).value&&(document.getElementById(`wanStaticIp`).value=n.ip),n.netmask&&document.getElementById(`wanStaticNetmask`)&&(document.getElementById(`wanStaticNetmask`).value=n.netmask),n.gateway&&document.getElementById(`wanStaticGateway`)&&(document.getElementById(`wanStaticGateway`).value=n.gateway),Wa();let a=document.getElementById(`wanStatusBadge`);if(a){let e=n.up||n.ip&&n.ip!==`0.0.0.0`;a.textContent=e?`${(n.proto||`DHCP`).toUpperCase()} ACTIVE`:`DISCONNECTED`,a.className=`card-badge `+(e?`emerald`:`gray`)}if(t.interfaces&&Array.isArray(t.interfaces)){let e=t.interfaces.find(e=>e.ifname===`usb0`);e&&document.getElementById(`ifaceUsbIp`)&&(document.getElementById(`ifaceUsbIp`).textContent=e.ip||`192.168.109.110`);let n=t.interfaces.find(e=>e.name===`wan`||e.ifname===`eth0`);n&&document.getElementById(`ifaceEthWanState`)&&(document.getElementById(`ifaceEthWanState`).textContent=n.up?n.ip||`Connected`:`Link Down / Ready`)}}catch(e){console.error(`loadWanInterfaceConfig error:`,e)}}async function Ja(){let e=document.getElementById(`wanProtoSelect`)?document.getElementById(`wanProtoSelect`).value:`dhcp`,t=(document.getElementById(`wanPppoeUser`)?.value||``).trim(),n=document.getElementById(`wanPppoePass`)?.value||``,r=(document.getElementById(`wanPppoeService`)?.value||``).trim(),i=parseInt(document.getElementById(`wanPppoeMtu`)?.value,10)||1492,a=(document.getElementById(`wanCustomMacInput`)?.value||``).trim(),o=(document.getElementById(`wanStaticIp`)?.value||``).trim(),s=(document.getElementById(`wanStaticNetmask`)?.value||`255.255.255.0`).trim(),c=(document.getElementById(`wanStaticGateway`)?.value||``).trim();if(a&&!/^([0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}$/.test(a))Q(`Invalid MAC address format (XX:XX:XX:XX:XX:XX)`,`error`);else try{let l=await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_wan`,proto:e,username:t,password:n,service:r,mtu:i,custom_mac:a,ip:o,netmask:s,gateway:c})})).json();l.status===`ok`?(typeof Q==`function`&&Q(`WAN Interface configuration applied successfully!`,`success`),qa(),typeof B==`function`&&B()):typeof Q==`function`&&Q(`Failed to apply WAN config: `+(l.error||`Unknown error`),`error`)}catch(e){typeof Q==`function`&&Q(`Error saving WAN interface: `+e.message,`error`)}}function Ya(){Xa(),document.getElementById(`wanCustomMacInput`)&&document.getElementById(`modalInput_wan_custom_mac`)&&(document.getElementById(`wanCustomMacInput`).value=document.getElementById(`modalInput_wan_custom_mac`).value,Wa())}function Xa(){let e=window._lastDataCache||{},t=Array.isArray(e.clients)?e.clients:[],n=``;for(let e of t)if(e.connected&&!e.is_self&&e.mac){n=e.mac;break}let r=document.getElementById(`modalInput_wan_custom_mac`);r&&(r.value=n||`ca:e7:b7:34:8f:ac`,typeof Q==`function`&&Q(`Cloned MAC: `+r.value,`info`))}function Za(){let e=`0123456789ABCDEF`,t=`02`;for(let n=1;n<6;n++)t+=`:`+e[Math.floor(Math.random()*16)]+e[Math.floor(Math.random()*16)];let n=document.getElementById(`modalInput_wan_custom_mac`);n&&(n.value=t.toLowerCase())}function Qa(){let e=document.getElementById(`wanCustomMacInput`);e&&(e.value=``,Wa(),typeof Q==`function`&&Q(`Custom MAC cleared. Hardware default will be used.`,`info`))}window._cachedPppoeData=null;function $a(){let e=document.getElementById(`pppoeSubscribersList`);if(!e)return;let t=window._cachedPppoeData?.server?.users||[];e.innerHTML=t.length?t.map((e,t)=>`
        <div class="setting-row-item pppoe-subscriber-row">
          <div class="setting-label-col pppoe-subscriber-details">
            <span class="setting-label-bold">${$(e.user||`Subscriber`)}</span>
            <span class="setting-label-sub">IP: ${$(e.ip||`*`)}</span>
            <span class="setting-label-sub pppoe-subscriber-password">Password: <code id="pppoeSubscriberPassword_${t}" data-revealed="false">••••••••</code>
              <button type="button" class="pppoe-password-reveal" onclick="togglePppoeSubscriberPassword(${t}, this)" title="Show password" aria-label="Show password">
                <svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </span>
          </div>
          <button type="button" class="mh-btn btn-sm btn-ghost pppoe-subscriber-delete" onclick="deletePppoeUser('${$(e.user||``)}')" aria-label="Delete ${$(e.user||`subscriber`)}">DELETE</button>
        </div>
      `).join(``):`<div class="setting-row-item"><div class="setting-label-col"><span class="setting-label-sub">No subscriber accounts configured.</span></div></div>`}function eo(e,t){let n=window._cachedPppoeData?.server?.users?.[e],r=document.getElementById(`pppoeSubscriberPassword_${e}`);if(!n||!r)return;let i=r.dataset.revealed!==`true`;r.textContent=i?n.password===void 0?`(unavailable)`:n.password||`(empty)`:`••••••••`,r.dataset.revealed=i?`true`:`false`,t&&(t.title=i?`Hide password`:`Show password`,t.setAttribute(`aria-label`,t.title))}function to(e,t){let n=document.getElementById(e);n&&(n.type=n.type===`password`?`text`:`password`,t&&(t.title=n.type===`password`?`Show password`:`Hide password`,t.setAttribute(`aria-label`,t.title)))}async function no(){try{let e=await fetch(`/cgi-bin/pppoe?action=get`);if(!e.ok)return;let t=await e.json();if(t&&t.status===`ok`){try{let e=await p(`/cgi-bin/pppoe?action=get_users`),n=await e.json();e.ok&&n.status===`ok`&&Array.isArray(n.users)&&(t.server=t.server||{},t.server.users=n.users)}catch(e){console.warn(`Unable to load subscriber passwords:`,e)}window._cachedPppoeData=t;let e=t.client||{},n=t.server||{},r=document.getElementById(`pppoeClientMasterToggle`);r&&(r.checked=!!e.enabled);let i=document.getElementById(`pppoeClientStatusSub`);i&&(i.textContent=e.enabled?e.connected?`Connected • Assigned IP: ${e.ip||`--`} • ISP Dialer Active`:`Connecting to ISP Access Concentrator...`:`Disabled • ISP Broadband dialer over WAN Ethernet`);let a=document.getElementById(`pppoeClientIpText`);a&&(a.textContent=e.connected?`IP: ${e.ip||`--`} • Gateway: ${e.gateway||`--`} • DNS: ${e.dns||`--`}`:e.enabled?`Dialing PPPoE session...`:`Disconnected • Gateway: -- • DNS: --`);let o=document.getElementById(`pppoeClientUptime`);o&&(e.connected?(o.textContent=`UP (${Math.floor(e.uptime/60)}m)`,o.style.color=`#10b981`):(o.textContent=e.enabled?`Connecting...`:`Offline`,o.style.color=e.enabled?`#06b6d4`:`var(--text-dim)`));let s=document.getElementById(`disp_pppoe_user_desc`);s&&(s.textContent=e.username?`User: ${e.username} • Password: ${e.has_password?`••••••••`:`(empty)`}`:`User: Not set • Tap to configure username & password`);let c=document.getElementById(`disp_pppoe_ac_desc`);c&&(c.textContent=e.ac||e.service?`AC: ${e.ac||`Auto`} • Service: ${e.service||`Default`}`:`Auto Discovery • Optional ISP AC and Service Name`);let l=document.getElementById(`disp_pppoe_mac_desc`);l&&(l.textContent=`MTU: ${e.mtu||1492} • ${e.macaddr?`Cloned MAC: ${e.macaddr.toLowerCase()}`:`Hardware Default MAC`}`);let u=document.getElementById(`pppoeServerMasterToggle`);u&&(u.checked=!!n.server_enabled);let d=document.getElementById(`pppoeServerStatusSub`);d&&(d.textContent=n.server_enabled?n.running?`Running on ${n.listen_iface||`br-lan`} • ${n.sessions?n.sessions.length:0} active subscribers`:`Starting server daemon...`:`Disabled • Local PPPoE Concentrator for LAN subscribers`);let f=document.getElementById(`disp_pppoe_srv_network`);f&&(f.textContent=`Gateway: ${n.server_ip||`10.0.0.1`} • Pool: ${n.pool_start||`10.0.0.150`} - ${n.pool_end||`10.0.0.220`} • DNS: ${n.dns1||`10.0.0.1`}`);let m=document.getElementById(`disp_pppoe_users_count`);if(m){let e=n.users&&n.users.length||0;m.textContent=`${e} subscriber account${e===1?``:`s`} configured • Tap to manage`}window._currentSettingPage===`acc-pppoe-users`&&$a();let h=document.getElementById(`pppoeActiveSessionsText`);if(h){let e=n.sessions||[];h.textContent=e.length===0?n.server_enabled?`Server listening • No subscribers currently connected`:`Server is disabled`:e.map(e=>`${e.interface} (${e.client_ip})`).join(`, `)}}}catch(e){console.warn(`loadPppoeConfig error:`,e)}}async function ro(e){typeof Q==`function`&&Q(e?`Enabling PPPoE WAN dialer...`:`Disabling PPPoE client (reverting to DHCP)...`,`info`);try{let t=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.username||``,n=await(await fetch(`/cgi-bin/pppoe?action=client_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({enabled:!!e,username:t})})).json();typeof Q==`function`&&Q(n.message||`PPPoE Client state updated`,`success`)}catch(e){typeof Q==`function`&&Q(`PPPoE client toggle error: `+e.message,`error`)}no()}async function io(e,t){typeof Q==`function`&&Q(`Saving PPPoE credentials...`,`info`);try{let n=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.enabled,r=await(await fetch(`/cgi-bin/pppoe?action=client_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({enabled:!!n,username:e,password:t})})).json();typeof Q==`function`&&Q(r.message||`Credentials updated`,`success`)}catch(e){typeof Q==`function`&&Q(`Error saving credentials: `+e.message,`error`)}no()}async function ao(e,t){typeof Q==`function`&&Q(`Saving Access Concentrator options...`,`info`);try{let n=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.enabled,r=await(await fetch(`/cgi-bin/pppoe?action=client_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({enabled:!!n,ac:e,service:t})})).json();typeof Q==`function`&&Q(r.message||`AC options updated`,`success`)}catch(e){typeof Q==`function`&&Q(`Error saving AC options: `+e.message,`error`)}no()}async function oo(e,t){typeof Q==`function`&&Q(`Saving MAC & MTU settings...`,`info`);try{let n=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.enabled,r=await(await fetch(`/cgi-bin/pppoe?action=client_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({enabled:!!n,macaddr:e,mtu:t})})).json();typeof Q==`function`&&Q(r.message||`MAC & MTU updated`,`success`)}catch(e){typeof Q==`function`&&Q(`Error saving MAC: `+e.message,`error`)}no()}function so(){let e=`0123456789abcdef`,t=`02`;for(let n=1;n<6;n++)t+=`:`+e[Math.floor(Math.random()*16)]+e[Math.floor(Math.random()*16)];let n=document.getElementById(`modalInput_pppoe_mac`);n&&(n.value=t)}async function co(e){typeof Q==`function`&&Q(e?`Starting PPPoE Access Server...`:`Stopping PPPoE Access Server...`,`info`);try{let t=window._cachedPppoeData&&window._cachedPppoeData.server||{},n=await(await fetch(`/cgi-bin/pppoe?action=server_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({server_enabled:!!e,listen_iface:t.listen_iface||`br-lan`,server_ip:t.server_ip||`10.0.0.1`,pool_start:t.pool_start||`10.0.0.150`,pool_end:t.pool_end||`10.0.0.220`,dns1:t.dns1||`10.0.0.1`,dns2:t.dns2||`1.1.1.1`,max_sessions:t.max_sessions||32,service_name:t.service_name||`MAXNET`})})).json();typeof Q==`function`&&Q(n.message||`PPPoE Server state updated`,n.status===`ok`?`success`:`error`)}catch(e){typeof Q==`function`&&Q(`PPPoE server toggle error: `+e.message,`error`)}no()}async function lo(e,t,n,r,i,a){typeof Q==`function`&&Q(`Saving PPPoE Server configuration...`,`info`);try{let o=window._cachedPppoeData&&window._cachedPppoeData.server||{},s=!!o.server_enabled,c=await(await fetch(`/cgi-bin/pppoe?action=server_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({server_enabled:s,listen_iface:o.listen_iface||`br-lan`,server_ip:e,pool_start:t,pool_end:n,dns1:r,dns2:i,max_sessions:a,service_name:o.service_name||`MAXNET`})})).json();typeof Q==`function`&&Q(c.message||`PPPoE Server updated`,`success`)}catch(e){typeof Q==`function`&&Q(`PPPoE server save error: `+e.message,`error`)}no()}async function uo(){let e=(document.getElementById(`modalInput_new_pppoe_u`)?.value||``).trim(),t=document.getElementById(`modalInput_new_pppoe_p`)?.value||``;if(!e||!t)return typeof Q==`function`&&Q(`Username and password are required`,`error`),!1;try{let n=await(await fetch(`/cgi-bin/pppoe?action=add_user`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user:e,pass:t,ip:`*`})})).json();if(n.status===`ok`)return typeof Q==`function`&&Q(`Subscriber account ${e} added!`,`success`),await no(),!0;typeof Q==`function`&&Q(n.message||`Failed to add user`,`error`)}catch(e){typeof Q==`function`&&Q(`Add user error: `+e.message,`error`)}return!1}async function fo(e){if(await Z(`Are you sure you want to delete subscriber ${e}?`,`Delete Subscriber`,`Delete`,!0))try{let t=await(await fetch(`/cgi-bin/pppoe?action=del_user`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user:e})})).json();t.status===`ok`?(typeof Q==`function`&&Q(`Subscriber ${e} deleted`,`success`),await no(),$a()):typeof Q==`function`&&Q(t.message||`Failed to delete user`,`error`)}catch(e){typeof Q==`function`&&Q(`Delete user error: `+e.message,`error`)}}async function po(){try{let e=await fetch(`/cgi-bin/device?action=dufs_get`);if(!e.ok)return;let t=await e.json();if(t&&t.status===`ok`){let e=t.port||5e3,n=t.path||`/mnt/storage`,r=t.allow_upload!==!1,i=t.allow_delete!==!1,a=t.user||``,o=!!t.has_auth;document.getElementById(`dufsPortInput`)&&(document.getElementById(`dufsPortInput`).value=e),document.getElementById(`dufsPathInput`)&&(document.getElementById(`dufsPathInput`).value=n),document.getElementById(`dufsAllowUpload`)&&(document.getElementById(`dufsAllowUpload`).value=r?`true`:`false`),document.getElementById(`dufsAllowDelete`)&&(document.getElementById(`dufsAllowDelete`).value=i?`true`:`false`),document.getElementById(`dufsUserInput`)&&(document.getElementById(`dufsUserInput`).value=a);let s=document.getElementById(`disp_dufs_port`);s&&(s.textContent=`Port ${e} (Standard WebDAV)`);let c=document.getElementById(`disp_dufs_path`);c&&(c.textContent=`${n} (Storage Mount)`);let l=document.getElementById(`disp_dufs_permissions`);l&&(l.textContent=r&&i?`Full Access: Browse, Upload, and Delete Enabled`:r?`Upload Only: Browse & Upload Enabled (No Delete)`:`Read-Only: Browse & Download Only`);let u=document.getElementById(`disp_dufs_auth`);u&&(u.textContent=o?`Protected: User "${a||`root`}" (Auth Required)`:`Open Access (No Password Required)`);let d=window.location.hostname||`10.0.0.1`,f=`${window.location.protocol||`http:`}//${d}:${e}/`,p=document.getElementById(`dufsWebdavUrlText`);p&&(p.innerHTML=`<strong>${f}</strong> &bull; Tap to copy or view connection instructions`);let m=document.getElementById(`dufsOpenBtn`);m&&(m.href=f);let h=!!t.enabled,g=document.getElementById(`dufsMasterToggle`);g&&(g.checked=h);let _=document.getElementById(`dufsServiceSub`);_&&(_.textContent=h?`Active on Port ${e} • WebDAV & Browser File Explorer`:`Disabled • Local WebDAV storage server & browser file manager`)}}catch(e){console.warn(`loadDufsConfig error:`,e)}}async function mo(e){typeof Q==`function`&&Q(e?`Starting Dufs WebDAV service...`:`Stopping Dufs WebDAV service...`,`info`);try{let t=await(await fetch(`/cgi-bin/device?action=dufs_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({enabled:!!e})})).json();t&&t.status===`ok`?typeof Q==`function`&&Q(e?`Dufs WebDAV service started`:`Dufs WebDAV service stopped`,`success`):typeof Q==`function`&&Q(`Failed to update Dufs state`,`error`)}catch(e){typeof Q==`function`&&Q(`Error toggling Dufs: `+e.message,`error`)}po()}async function ho(){let e=parseInt(document.getElementById(`dufsPortInput`)?.value,10)||5e3,t=(document.getElementById(`dufsPathInput`)?.value||`/mnt/storage`).trim(),n=document.getElementById(`dufsAllowUpload`)?.value===`true`,r=document.getElementById(`dufsAllowDelete`)?.value===`true`,i=(document.getElementById(`dufsUserInput`)?.value||``).trim(),a=(document.getElementById(`dufsPassInput`)?.value||``).trim();try{let o=await(await fetch(`/cgi-bin/device?action=dufs_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({port:e,path:t,allow_upload:n,allow_delete:r,user:i,pass:a})})).json();o&&o.status===`ok`?(typeof Q==`function`&&Q(`Dufs WebDAV & File Manager updated!`,`success`),po()):typeof Q==`function`&&Q(`Failed to save Dufs config`,`error`)}catch(e){typeof Q==`function`&&Q(`Error saving Dufs: `+e.message,`error`)}}window._acknowledgedAlerts=window._acknowledgedAlerts||new Set;function go(){z(`settings`),O(`acc-notifications`)}function _o(){go()}function vo(){I()}function yo(e){let t=document.getElementById(`topoNotificationBadge`);if(t){let n=parseInt(e,10)||0;n>0?(t.textContent=n>99?`99+`:String(n),t.style.display=`inline-flex`,t.style.alignItems=`center`,t.style.justifyContent=`center`):(t.textContent=`0`,t.style.display=`none`)}}function bo(){Ro()}function xo(){let e=document.getElementById(`sslHelpModalOverlay`);e&&(e.parentElement!==document.body&&document.body.appendChild(e),e.style.display=`flex`,requestAnimationFrame(()=>e.classList.add(`active`)))}function So(){let e=document.getElementById(`sslHelpModalOverlay`);e&&(e.classList.remove(`active`),e.style.display=`none`)}async function Co(){try{let e=await fetch(`/cgi-bin/ssl`);if(!e.ok)return;let t=await e.json();if(t&&t.status===`ok`){let e=document.getElementById(`sslActiveCertDesc`),n=document.getElementById(`sslActiveCertBadge`),r=document.getElementById(`sslSanList`),i=document.getElementById(`sslDuckDnsBadge`),a=document.getElementById(`duckdnsSubdomain`);e&&(e.innerHTML=t.is_lets_encrypt?`Domain: <strong>${t.custom_config&&t.custom_config.domain?t.custom_config.domain:`duckdns.org`}</strong> &bull; Issuer: <strong>Let's Encrypt Public Authority</strong> &bull; Valid to: ${t.expires||`90 days`}`:`Domain: <strong>maxnet.local</strong> &bull; Issuer: <strong>MAXNET Root CA</strong> &bull; Valid to: ${t.expires||`2029`}`),n&&(t.is_lets_encrypt?(n.textContent=`PUBLIC GREEN LOCK`,n.className=`card-badge emerald`):(n.textContent=`VALID TLS 1.3`,n.className=`card-badge emerald`)),r&&t.san&&(r.textContent=t.san.replace(/DNS:|IPAddress:/g,``).replace(/,/g,` • `)),t.custom_config&&t.custom_config.subdomain&&a&&!a.value&&(a.value=t.custom_config.subdomain),i&&t.is_lets_encrypt&&(i.textContent=`ACTIVE & TRUSTED`,i.style.background=`rgba(16,185,129,0.15)`,i.style.color=`#10b981`)}}catch(e){console.warn(`Failed to load SSL certificate status:`,e)}}async function wo(){let e=document.getElementById(`duckdnsSubdomain`),t=document.getElementById(`duckdnsToken`),n=document.getElementById(`duckdnsStatusMsg`),r=document.getElementById(`btnIssueDuckDns`),i=(e?e.value:``).trim().toLowerCase(),a=(t?t.value:``).trim();if(!i)typeof Q==`function`&&Q(`Please enter a DuckDNS subdomain name`,`error`),e&&e.focus();else if(!a)typeof Q==`function`&&Q(`Please enter your DuckDNS Token`,`error`),t&&t.focus();else{r&&(r.disabled=!0,r.textContent=`ISSUING CERTIFICATE...`,r.style.opacity=`0.7`),n&&(n.style.color=`#38bdf8`,n.textContent=`Performing ACME DNS-01 challenge for ${i}.duckdns.org via DuckDNS API (takes ~20-40s)...`),typeof Q==`function`&&Q(`Starting automated Let's Encrypt issuance...`,`info`);try{let e=await(await fetch(`/cgi-bin/ssl`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`issue_duckdns`,subdomain:i,token:a})})).json();if(e&&e.status===`ok`)n&&(n.style.color=`#10b981`,n.textContent=`Certificate issued successfully! You can now open https://${e.domain}/ with full Green Padlock!`),typeof Q==`function`&&Q(`Public Green Padlock issued for ${e.domain}!`,`success`),Co();else{let t=e&&e.error?e.error:`Issuance failed. Check subdomain and token.`;n&&(n.style.color=`#ef4444`,n.textContent=`Error: ${t}`),typeof Q==`function`&&Q(t,`error`)}}catch{n&&(n.style.color=`#ef4444`,n.textContent=`Connection error communicating with router ACME daemon.`),typeof Q==`function`&&Q(`ACME request timed out or network error`,`error`)}finally{r&&(r.disabled=!1,r.textContent=`OBTAIN GREEN PADLOCK SSL`,r.style.opacity=`1`)}}}async function To(){if(!(`Notification`in window))typeof Q==`function`&&Q(`Browser Web Push not supported on this browser`,`error`);else if(Notification.permission===`granted`)typeof Q==`function`&&Q(`Browser push notifications are already enabled`,`info`),new Notification(`MAXNET Gateway`,{body:`Web Push alerts are actively monitoring your router health and security.`,icon:`/favicon.ico`}),Eo();else{try{await Notification.requestPermission()===`granted`?(typeof Q==`function`&&Q(`Browser Web Push alerts activated!`,`success`),new Notification(`MAXNET Gateway`,{body:`Push alerts enabled. You will receive notifications on critical events.`,icon:`/favicon.ico`})):typeof Q==`function`&&Q(`Web Push notification permission was denied`,`warning`)}catch(e){console.error(`Notification permission error`,e)}Eo()}}function Eo(){let e=document.getElementById(`btnTogglePushNotifications`);e&&(`Notification`in window?Notification.permission===`granted`?(e.textContent=`PUSH ACTIVE`,e.style.color=`#10b981`,e.style.borderColor=`rgba(16,185,129,0.4)`):Notification.permission===`denied`?(e.textContent=`PERMISSION BLOCKED`,e.style.color=`#ef4444`):(e.textContent=`ENABLE PUSH`,e.style.color=`#38bdf8`):(e.textContent=`NOT SUPPORTED`,e.disabled=!0))}var Do={device:!0,wan:!0,security:!0,health:!0,update:!0};async function Oo(){try{let e=await(await fetch(`/cgi-bin/webhooks?action=get`)).json();e&&e.events&&(Do.device=e.events.lan_plugged!==!1&&e.events.wifi_event!==!1,Do.wan=e.events.wan_disconnect!==!1,Do.security=e.events.router_login!==!1&&e.events.security_alert!==!1,Do.health=e.events.power_event!==!1,Do.update=e.events.system_update!==!1)}catch{}let e=document.getElementById(`notifTriggerDevice`),t=document.getElementById(`notifTriggerWan`),n=document.getElementById(`notifTriggerSecurity`),r=document.getElementById(`notifTriggerHealth`),i=document.getElementById(`notifTriggerUpdate`);e&&(e.checked=Do.device),t&&(t.checked=Do.wan),n&&(n.checked=Do.security),r&&(r.checked=Do.health),i&&(i.checked=Do.update)}async function ko(e,t){Do[e]=!!t;try{let n=await(await fetch(`/cgi-bin/webhooks?action=get`)).json();n.events||(n.events={}),e===`device`?(n.events.lan_plugged=!!t,n.events.wifi_event=!!t,n.events.usb_plugged=!!t):e===`wan`?n.events.wan_disconnect=!!t:e===`security`?(n.events.router_login=!!t,n.events.security_alert=!!t):e===`health`?n.events.power_event=!!t:e===`update`&&(n.events.system_update=!!t),await fetch(`/cgi-bin/webhooks?action=set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(n)}),Q(`Notification trigger updated`,`info`)}catch{Q(`Failed to save trigger preference`,`error`)}}window.toggleNotificationTrigger=ko;function Ao(){let e=document.getElementById(`notifSettingsModalOverlay`);e&&(Oo(),fetch(`/cgi-bin/webhooks?action=get_retention`).then(e=>e.json()).then(e=>{if(e&&e.status===`ok`){let t=document.getElementById(`notifModalStorageSummary`),n=document.getElementById(`disp_notif_retention`);t&&(t.textContent=`Storage: ${e.file_size||`0B`} • Capped at ${e.max_count||50} alerts (${e.retention_days||30}d)`),n&&(n.textContent=`Capped at ${e.max_count||50} alerts • Auto-pruned at ${e.retention_days||30} days`)}}).catch(()=>{}),e.style.display=`flex`,requestAnimationFrame(()=>e.classList.add(`active`)))}window.openNotificationSettingsModal=Ao;function jo(){let e=document.getElementById(`notifSettingsModalOverlay`);e&&(e.classList.remove(`active`),e.style.display=`none`)}window.closeNotificationSettingsModal=jo;function Mo(e){if(e==null||e===``)return null;if(e instanceof Date)return Number.isNaN(e.getTime())?null:e;if(typeof e==`object`){let t=e.epoch??e.seconds??e.sec??e.timestamp??e.$date;return t===void 0?null:Mo(t)}if(typeof e==`number`||/^\d+(?:\.\d+)?$/.test(String(e).trim())){let t=Number(e);if(!Number.isFinite(t)||t<=0)return null;let n=t<1e11?t*1e3:t,r=new Date(n);return Number.isNaN(r.getTime())?null:r}if(/^[A-Z][a-z]{2} \d{1,2}, \d{2}:\d{2}$/.test(String(e).trim()))return null;let t=new Date(String(e).trim());return Number.isNaN(t.getTime())?null:t}function No(e){let t=/^([A-Z][a-z]{2}) (\d{1,2}), (\d{2}):(\d{2})$/.exec(String(e||``).trim());if(!t)return null;let n=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`].indexOf(t[1]);if(n<0)return null;let r=new Date,i=new Date(r.getFullYear(),n,Number(t[2]),Number(t[3]),Number(t[4]));return i.getTime()>r.getTime()+864e5&&(i=new Date(r.getFullYear()-1,n,Number(t[2]),Number(t[3]),Number(t[4]))),Number.isNaN(i.getTime())?null:i}function Po(e){return e?`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`:`unknown`}function Fo(e){return e?e.toLocaleTimeString(`en-US`,{hour:`2-digit`,minute:`2-digit`,hour12:!0}).replace(/\s*(AM|PM)$/i,`$1`):`Time unavailable`}async function Io(){let e=document.getElementById(`notificationsListPageContainer`),t=document.getElementById(`notifStatusSummary`),n=document.getElementById(`notifActiveBadge`),r=document.getElementById(`notifStorageSummary`),i=document.getElementById(`disp_notif_retention`);if(e){Oo();try{fetch(`/cgi-bin/webhooks?action=get_retention`).then(e=>e.json()).then(e=>{e&&e.status===`ok`&&(r&&(r.textContent=`Storage: ${e.file_size||`0B`} • Capped at ${e.max_count||50} alerts (${e.retention_days||30}d)`),i&&(i.textContent=`Capped at ${e.max_count||50} alerts • Auto-pruned at ${e.retention_days||30} days`))}).catch(()=>{});let a=await(await fetch(`/cgi-bin/webhooks?action=get_notifications`)).json();if(!Array.isArray(a)||a.length===0){e.innerHTML=`
            <div style="font-size:12px; color:var(--text-dim); font-family:var(--font-mono); padding:24px; text-align:center;">
              No notifications recorded. All network services and hardware are operational.
            </div>
          `,t&&(t.textContent=`All systems optimal`),n&&(n.textContent=`0 ALERTS`,n.className=`card-badge emerald`),yo(0);return}t&&(t.textContent=`${a.length} Alerts Recorded`),n&&(n.textContent=`${a.length} ALERTS`,n.className=a.some(e=>e.level===`danger`)?`card-badge ruby`:`card-badge amber`),yo(a.length);let o=a.map((e,t)=>({notification:e,index:t,date:[e.timestamp,e.time,e.created_at,e.createdAt,e.date_time,e.datetime,e.date,e.ts].map(Mo).filter(Boolean)[0]||No(e.timestamp||e.time)})).sort((e,t)=>{let n=e.date?e.date.getTime():-1/0;return(t.date?t.date.getTime():-1/0)-n||e.index-t.index}),s=null;e.innerHTML=o.map(({notification:e,date:t})=>{let n=Po(t),r=``;n!==s&&(s=n,r=`<div style="padding:10px 14px 5px; color:var(--text-dim); font-size:10px; font-family:var(--font-mono); font-weight:800; letter-spacing:.6px; text-transform:uppercase;">${$(t?t.toLocaleDateString(void 0,{weekday:`long`,year:`numeric`,month:`long`,day:`numeric`}):`Date unavailable`)}</div>`);let i=`#38bdf8`,a=`sky`;return e.level===`danger`?(i=`#ef4444`,a=`ruby`):e.level===`warning`?(i=`#f59e0b`,a=`amber`):(e.level===`healthy`||e.level===`success`)&&(i=`#10b981`,a=`emerald`),`${r}
            <div class="setting-row-item" style="padding:10px 14px; border-bottom:1px solid var(--border-sub); display:flex; flex-direction:column; gap:4px;">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%; gap:8px;">
                <div style="display:flex; align-items:center; gap:8px; min-width:0; flex:1;">
                  <span style="width:7px; height:7px; border-radius:50%; background:${i}; display:inline-block; flex-shrink:0; box-shadow:0 0 6px ${i};"></span>
                  <span class="card-badge ${a}" style="font-size:9px; font-weight:800; flex-shrink:0;">${$(e.level||`INFO`).toUpperCase()}</span>
                  <span class="setting-label-bold" style="font-size:12.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${$(e.title||``)}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
                  <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); white-space:nowrap;">${$(Fo(t))}</span>
                  <button type="button" class="round-action-btn btn-danger-action" title="Delete notification" onclick="deleteNotification('${$(e.id)}')" style="width:26px; height:26px; min-width:26px; color:#ef4444; padding:0;">
                    <svg viewBox="0 0 24 24" style="width:12px; height:12px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
              <div class="setting-label-sub" style="font-size:11.5px; line-height:1.4; padding-left:15px; margin-top:2px;">${$(e.message||``)}</div>
            </div>
          `}).join(``)}catch(e){console.warn(`loadNotificationsPage error:`,e)}}}async function Lo(e){try{await fetch(`/cgi-bin/webhooks?action=delete_notification&id=${encodeURIComponent(e)}`),typeof Q==`function`&&Q(`Notification deleted`,`info`),Io()}catch{}}async function Ro(){try{await fetch(`/cgi-bin/webhooks?action=clear_notifications`),typeof Q==`function`&&Q(`All notifications cleared`,`info`),Io()}catch{}}async function zo(){typeof Q==`function`&&Q(`Sending manual test alert...`,`info`),await Bo({title:`Manual System Test Alert`,message:`Manual notification dispatched from settings console to verify UI list and external webhooks.`,level:`info`,event_type:`system`}),typeof Q==`function`&&Q(`Test alert dispatched & logged`,`success`)}async function Bo(e){if(!e)return;window._dispatchedAlertKeys=window._dispatchedAlertKeys||new Set;let t=e.id||e.title+`::`+e.message;if(!window._dispatchedAlertKeys.has(t)){window._dispatchedAlertKeys.add(t);try{await fetch(`/cgi-bin/webhooks?action=dispatch`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),Io()}catch{}}}function Vo(e){if(!e)return;let t=e.router||{},n=Array.isArray(e.clients)?e.clients:[],r=t.cpu_pct||0;if(r>85){let e=Date.now();(!window._lastCpuAlertTime||e-window._lastCpuAlertTime>6e5)&&(window._lastCpuAlertTime=e,Bo({title:`CPU Utilization Spike (${r}%)`,message:`Router SoC processor utilization reached ${r}%. High network throughput or thread activity detected.`,level:`danger`,event_type:`cpu_spike`}))}if(window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.enabled){let e=window._cachedPppoeData.client,t=e.status===`connected`||e.ip&&e.ip!==`--`;window._lastPppoeUpState===!0&&!t&&Bo({title:`PPPoE Connection Alert`,message:`PPPoE broadband session disconnected or carrier authentication failed. Retrying dialer.`,level:`danger`,event_type:`wan_disconnect`}),window._lastPppoeUpState=t}let i=window._knownClientMacs;if(!i){try{i=new Set(JSON.parse(localStorage.getItem(`maxnet_known_macs`)||`[]`))}catch{i=new Set}window._knownClientMacs=i}let a=i.size===0;n.forEach(e=>{e.mac&&!i.has(e.mac)&&(i.add(e.mac),!a&&!e.is_self&&Bo({title:`New Device Connected: ${e.name||e.ip}`,message:`Device with IP ${e.ip} (MAC: ${e.mac}) joined the network on interface ${e.interface||`LAN`}.`,level:`info`,event_type:`new_device`}))});try{localStorage.setItem(`maxnet_known_macs`,JSON.stringify([...i]))}catch{}let o=window._cachedWebhooksConfig&&window._cachedWebhooksConfig.data_quota_mb||1024,s=o*1024*1024,c=window._notifiedClientDataQuota;if(!c){try{c=new Set(JSON.parse(localStorage.getItem(`maxnet_notified_data_quota`)||`[]`))}catch{c=new Set}window._notifiedClientDataQuota=c}if(window._isFirstDataScan===void 0){window._isFirstDataScan=!0,n.forEach(e=>{e.mac&&c.add(e.mac)});try{localStorage.setItem(`maxnet_notified_data_quota`,JSON.stringify([...c]))}catch{}}else n.forEach(e=>{let t=e.total_bytes||(e.rx_bytes||0)+(e.tx_bytes||0)||((e.rx_mb||0)+(e.tx_mb||0))*1048576;if(t>=s&&e.mac&&!c.has(e.mac)){c.add(e.mac);try{localStorage.setItem(`maxnet_notified_data_quota`,JSON.stringify([...c]))}catch{}Bo({title:`Data Quota Alert: ${e.name||e.ip}`,message:`Client device ${e.name||`Device`} (${e.ip}, MAC: ${e.mac}) has consumed ${se(t)}, exceeding the ${o} MB quota limit.`,level:`warning`,event_type:`data_usage`})}});let l=e.network&&Array.isArray(e.network.ports)?e.network.ports:[];window._lastPortStates?l.forEach(e=>{let t=window._lastPortStates[e.id];t&&t!==e.status&&(window._lastPortStates[e.id]=e.status,e.status===`up`?Bo({title:`Ethernet Cable Plugged: ${e.id.toUpperCase()}`,message:`Physical network link established on port ${e.id.toUpperCase()} at ${e.speed||1e3} Mbps (${e.duplex||`Full`} Duplex).`,level:`info`,event_type:`lan_plugged`}):Bo({title:`Ethernet Cable Unplugged: ${e.id.toUpperCase()}`,message:`Physical link disconnected on port ${e.id.toUpperCase()}. Network cable removed or remote device powered down.`,level:`warning`,event_type:`lan_plugged`}))}):(window._lastPortStates={},l.forEach(e=>{window._lastPortStates[e.id]=e.status}));let u=Array.isArray(e.usb_devices)?e.usb_devices:Array.isArray(e.adb_devices)?e.adb_devices:[],d=new Set(u.map(e=>e.serial||e.product||e.id||e.name).filter(Boolean));window._lastUsbDeviceIds&&(u.forEach(e=>{let t=e.serial||e.product||e.id||e.name;t&&!window._lastUsbDeviceIds.has(t)&&Bo({title:`USB Device Connected: ${e.product||e.name||`USB Modem`}`,message:`New USB hardware plugged into router: ${e.manufacturer||``} ${e.product||e.name||`Device`} (${t}).`,level:`info`,event_type:`usb_plugged`})}),window._lastUsbDeviceIds.forEach(e=>{d.has(e)||Bo({title:`USB Device Disconnected`,message:`USB device (${e}) was removed or unplugged from the router.`,level:`warning`,event_type:`usb_plugged`})})),window._lastUsbDeviceIds=d;let f=t.uptime_seconds||0;window._lastRecordedUptime!==void 0&&f<180&&window._lastRecordedUptime>300&&Bo({title:`Router Reboot & Power Event`,message:`MAXNET Gateway router has rebooted or recovered from power interruption. Current uptime: ${t.uptime||`1 minute`}.`,level:`warning`,event_type:`power_event`}),window._lastRecordedUptime=f;let p=window._cachedWebhooksConfig&&window._cachedWebhooksConfig.custom_ip_target||`10.0.0.2`,m=n.some(e=>e.ip===p)||e.network&&(e.network.gateway_ip===p||e.network.dns_ip===p);window._lastWatchdogState!==void 0&&window._lastWatchdogIp===p?window._lastWatchdogState!==m&&(window._lastWatchdogState=m,Bo(m?{title:`Monitored Host Online: ${p}`,message:`Monitored host device (${p}) is back online and responding on the network.`,level:`info`,event_type:`custom_ip`}:{title:`Monitored Host Offline: ${p}`,message:`Monitored host device (${p}) has gone OFFLINE or stopped responding.`,level:`danger`,event_type:`custom_ip`})):(window._lastWatchdogState=m,window._lastWatchdogIp=p);let h=[`pornhub`,`xvideos`,`xnxx`,`xhamster`,`chaturbate`,`stripchat`,`redtube`,`youporn`,`spankbang`,`livejasmin`,`onlyfans`,`cam4`,`brazzers`,`beeg`];window._notifiedAdultEvents=window._notifiedAdultEvents||new Set,(Array.isArray(e.dns_queries)||Array.isArray(e.conntrack_flows))&&(e.dns_queries||e.conntrack_flows||[]).forEach(e=>{let t=(e.domain||e.host||``).toLowerCase(),n=e.client_ip||e.src||`10.0.0.x`;h.find(e=>t.includes(e))&&!window._notifiedAdultEvents.has(t+n)&&(window._notifiedAdultEvents.add(t+n),Bo({title:`18+ Adult Content Visit Detected`,message:`Client device at ${n} attempted to access adult/restricted website (${t}). Gateway security notification dispatched.`,level:`danger`,event_type:`adult_content`}))})}async function Ho(){try{let e=await(await fetch(`/cgi-bin/update`)).json();if(e&&e.status===`update_available`){let t=`update_b`+(e.latest_build||`new`);window._notifiedUpdates&&window._notifiedUpdates.has(t)||(window._notifiedUpdates=window._notifiedUpdates||new Set,window._notifiedUpdates.add(t),Bo({id:t,title:`MAXNET OS Update Available (${e.latest})`,message:`New firmware build ${e.latest_build} is ready for installation (Current: ${e.current}). Tap to review & install.`,level:`info`,event_type:`system_update`}))}}catch{}}window._cachedWebhooksConfig=window._cachedWebhooksConfig||{};async function Uo(){try{let e=await(await fetch(`/cgi-bin/webhooks?action=get`)).json();if(e){window._cachedWebhooksConfig=e;let t=document.getElementById(`webhookMasterToggle`);t&&(t.checked=e.master_enabled!==!1);let n=e.telegram||{},r=document.getElementById(`tgEnableToggle`);r&&(r.checked=!!n.enabled);let i=document.getElementById(`dispTgStatusSub`);i&&(i.textContent=n.enabled?`Active • Forwarding to Telegram`:`Disabled • Forward alerts to Telegram chat`);let a=document.getElementById(`disp_webhook_tg_token`);a&&(a.textContent=n.bot_token?`${n.bot_token.substring(0,10)}••••••••`:`Click to configure Bot Token from @BotFather`);let o=document.getElementById(`disp_webhook_tg_chat_id`);o&&(o.textContent=n.chat_id?`Chat ID: ${n.chat_id}`:`Click to configure Chat or Channel ID`);let s=e.discord||{},c=document.getElementById(`discordEnableToggle`);c&&(c.checked=!!s.enabled);let l=document.getElementById(`dispDiscordStatusSub`);l&&(l.textContent=s.enabled?`Active • Forwarding to Discord`:`Disabled • Post alerts to Discord channel`);let u=document.getElementById(`disp_webhook_discord_url`);u&&(u.textContent=s.webhook_url?`${s.webhook_url.substring(0,35)}...`:`Click to configure Discord Webhook URL`);let d=e.ntfy||{},f=document.getElementById(`ntfyEnableToggle`);f&&(f.checked=!!d.enabled);let p=document.getElementById(`dispNtfyStatusSub`);p&&(p.textContent=d.enabled?`Active • Pushing to ntfy.sh`:`Disabled • Mobile push notifications`);let m=document.getElementById(`disp_webhook_ntfy_url`);m&&(m.textContent=d.topic_url||`https://ntfy.sh/maxnet-alerts`);let h=e.events||{},g=document.getElementById(`evCpuToggle`);g&&(g.checked=h.cpu_spike!==!1);let _=document.getElementById(`evDeviceToggle`);_&&(_.checked=h.new_device!==!1);let v=document.getElementById(`evWanToggle`);v&&(v.checked=h.wan_disconnect!==!1);let y=document.getElementById(`evDhcpToggle`);y&&(y.checked=h.dhcp_error!==!1);let b=document.getElementById(`evUpdateToggle`);b&&(b.checked=h.system_update!==!1);let x=document.getElementById(`evSecurityToggle`);x&&(x.checked=h.security_alert!==!1);let S=document.getElementById(`evRouterLoginToggle`);S&&(S.checked=h.router_login!==!1);let C=document.getElementById(`evDataUsageToggle`);C&&(C.checked=h.data_usage!==!1);let w=document.getElementById(`evLanPlugToggle`);w&&(w.checked=h.lan_plugged!==!1);let T=document.getElementById(`evUsbPlugToggle`);T&&(T.checked=h.usb_plugged!==!1);let E=document.getElementById(`evPowerToggle`);E&&(E.checked=h.power_event!==!1);let D=document.getElementById(`evCustomIpToggle`);D&&(D.checked=h.custom_ip!==!1);let O=document.getElementById(`evAdultToggle`);O&&(O.checked=h.adult_content!==!1);let k=document.getElementById(`evWifiToggle`);k&&(k.checked=h.wifi_event!==!1);let A=document.getElementById(`disp_webhook_data_quota`);A&&(A.textContent=`${e.data_quota_mb||1024} MB (${((e.data_quota_mb||1024)/1024).toFixed(1)} GB)`);let j=document.getElementById(`disp_webhook_custom_ip`);j&&(j.textContent=e.custom_ip_target||`10.0.0.2`)}}catch(e){console.warn(`loadWebhooksConfig error:`,e)}}async function Wo(){let e=window._cachedWebhooksConfig||{};e.master_enabled=!!document.getElementById(`webhookMasterToggle`)?.checked,e.telegram=e.telegram||{},e.telegram.enabled=!!document.getElementById(`tgEnableToggle`)?.checked,e.discord=e.discord||{},e.discord.enabled=!!document.getElementById(`discordEnableToggle`)?.checked,e.ntfy=e.ntfy||{},e.ntfy.enabled=!!document.getElementById(`ntfyEnableToggle`)?.checked,e.events=e.events||{},e.events.cpu_spike=!!document.getElementById(`evCpuToggle`)?.checked,e.events.new_device=!!document.getElementById(`evDeviceToggle`)?.checked,e.events.wan_disconnect=!!document.getElementById(`evWanToggle`)?.checked,e.events.dhcp_error=!!document.getElementById(`evDhcpToggle`)?.checked,e.events.system_update=!!document.getElementById(`evUpdateToggle`)?.checked,e.events.security_alert=!!document.getElementById(`evSecurityToggle`)?.checked,e.events.router_login=!!document.getElementById(`evRouterLoginToggle`)?.checked,e.events.data_usage=!!document.getElementById(`evDataUsageToggle`)?.checked,e.events.lan_plugged=!!document.getElementById(`evLanPlugToggle`)?.checked,e.events.usb_plugged=!!document.getElementById(`evUsbPlugToggle`)?.checked,e.events.power_event=!!document.getElementById(`evPowerToggle`)?.checked,e.events.custom_ip=!!document.getElementById(`evCustomIpToggle`)?.checked,e.events.adult_content=!!document.getElementById(`evAdultToggle`)?.checked,e.events.wifi_event=!!document.getElementById(`evWifiToggle`)?.checked,e.data_quota_mb=e.data_quota_mb||1024,e.custom_ip_target=e.custom_ip_target||`10.0.0.2`;try{await fetch(`/cgi-bin/webhooks?action=set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),Uo()}catch{}}async function Go(e,t){t&&t.classList.add(`rotating`),typeof Q==`function`&&Q(`Testing ${e} connection...`,`info`);try{let t=await(await fetch(`/cgi-bin/webhooks?action=test&provider=${e}`)).json();t&&t.status===`ok`?typeof Q==`function`&&Q(t.message||`${e} test successful!`,`success`):typeof Q==`function`&&Q(t.message||`${e} test failed`,`error`)}catch(e){typeof Q==`function`&&Q(`Error: ${e.message}`,`error`)}finally{t&&setTimeout(()=>t.classList.remove(`rotating`),600)}}var Ko=`system`,qo=``,Jo=null,Yo=``,Xo=null;async function Zo(e=Ko,t=qo){Ko=e,qo=t;let n=document.getElementById(`logConsoleOutput`),r=document.getElementById(`logViewerLinesBadge`);try{let n=await(await fetch(`/cgi-bin/logs?type=${encodeURIComponent(e)}&filter=${encodeURIComponent(t)}&lines=250`)).json();Yo=n.raw||``,r&&(r.textContent=`${n.total_lines||0} LINES`),Qo(Yo)}catch(e){n&&(n.textContent=`Error connecting to log stream: `+e.message)}}function Qo(e){let t=document.getElementById(`logConsoleOutput`);t&&(t.innerHTML=!e||e.trim()===``?`<span style="color:var(--text-dim);">No log records matching filter.</span>`:e.split(`
`).map(e=>{let t=$(e);return/(\.err|\.crit|\.alert|\.emerg|failed|error|fatal|drop)/i.test(e)?`<span style="color:#ef4444; font-weight:600;">${t}</span>`:/(\.warn|warning|retry)/i.test(e)?`<span style="color:#f59e0b;">${t}</span>`:/(\.notice|dhcpack|dhcprequest|registered|link up|up)/i.test(e)?`<span style="color:#10b981;">${t}</span>`:/(\.info|dnsmasq)/i.test(e)?`<span style="color:#38bdf8;">${t}</span>`:`<span style="color:#a1a1aa;">${t}</span>`}).join(`
`))}function $o(e){Ko=e;let t=document.getElementById(`logTabSystem`),n=document.getElementById(`logTabKernel`);t&&n&&(e===`system`?(t.classList.add(`active`),n.classList.remove(`active`)):(t.classList.remove(`active`),n.classList.add(`active`))),Zo(Ko,qo)}function es(e){Xo&&clearTimeout(Xo),Xo=setTimeout(()=>{Zo(Ko,e.trim())},350)}function ts(){Zo(Ko,qo)}function ns(e){Jo&&(clearInterval(Jo),Jo=null),e&&(Jo=setInterval(()=>{Zo(Ko,qo)},3e3))}function rs(){Jo&&(clearInterval(Jo),Jo=null);let e=document.getElementById(`logViewerAutoRefresh`);e&&(e.checked=!1)}function is(){if(!Yo){Q(`Log buffer is currently empty.`,`info`);return}let e=new Blob([Yo],{type:`text/plain;charset=utf-8`}),t=document.createElement(`a`);t.href=URL.createObjectURL(e),t.download=`maxnet-${Ko}-log-${Date.now()}.txt`,document.body.appendChild(t),t.click(),document.body.removeChild(t)}var as=`installed`,os=[],ss=[],cs=null;async function ls(e=``){let t=document.getElementById(`pkgListContainer`),n=document.getElementById(`pkgManagerBadge`),r=document.getElementById(`pkgCountBadge`);if(as===`installed`)try{os=(await(await fetch(`/cgi-bin/packages?action=list`)).json()).packages||[],n&&(n.textContent=`${os.length} INSTALLED`),r&&(r.textContent=`${os.length} PKGS`),us(os,e)}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:20px; text-align:center; font-family:var(--font-mono); font-size:12px;">Failed to load package list: ${$(e.message)}</div>`)}else{if(!e||e.trim().length===0){t&&(t.innerHTML=`<div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">Type package name above to search 11,000+ repository packages (e.g. htop, nano, tcpdump, nginx)...</div>`);return}t&&(t.innerHTML=`<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">Searching official MAXNET package repository...</div>`);try{ss=(await(await fetch(`/cgi-bin/packages?action=search&query=${encodeURIComponent(e.trim())}`)).json()).packages||[],us(ss)}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:20px; text-align:center; font-family:var(--font-mono); font-size:12px;">Package search error: ${$(e.message)}</div>`)}}}function us(e=[],t=``){let n=document.getElementById(`pkgListContainer`);if(!n)return;let r=e;if(t&&as===`installed`){let n=t.toLowerCase();r=e.filter(e=>e.name.toLowerCase().includes(n)||e.feed&&e.feed.toLowerCase().includes(n))}n.innerHTML=r.length===0?`<div style="text-align:center; padding:25px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No packages found.</div>`:r.slice(0,200).map(e=>`
        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">${$(e.name)}</span>
            <span class="setting-label-sub">${$(e.version||``)} &bull; ${$(e.feed||``)}</span>
          </div>
          <div class="setting-control-col">
            ${e.installed?`
              <button type="button" class="round-action-btn btn-danger-action" title="Uninstall ${$(e.name)}" onclick="uninstallPackage('${$(e.name)}')" style="color:#ef4444; border-color:rgba(239,68,68,0.35); background:rgba(239,68,68,0.1);">
                <svg viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            `:`
              <button type="button" class="round-action-btn" title="Install ${$(e.name)}" onclick="installPackage('${$(e.name)}')">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            `}
          </div>
        </div>
      `).join(``)}function ds(e){as=e;let t=document.getElementById(`pkgTabInstalled`),n=document.getElementById(`pkgTabAvailable`),r=document.getElementById(`pkgSearchInput`);t&&n&&(e===`installed`?(t.classList.add(`active`),n.classList.remove(`active`),r&&(r.placeholder=`Filter installed packages...`),us(os,r?r.value:``)):(t.classList.remove(`active`),n.classList.add(`active`),r&&(r.placeholder=`Search 11,000+ packages in online repository...`,r.focus(),ls(r.value))))}var fs=0;function ps(e){cs&&clearTimeout(cs);let t=String(e||``).trim(),n=++fs;cs=setTimeout(async()=>{if(!t){as===`installed`?us(os):ls(``);return}let e=document.getElementById(`pkgListContainer`);e&&(e.innerHTML=`<div class="package-search-state">Searching installed and online packages…</div>`);try{let e=await fetch(`/cgi-bin/packages?action=search&query=${encodeURIComponent(t)}`),r=await e.json();if(n!==fs||t!==(document.getElementById(`pkgSearchInput`)?.value||``).trim())return;if(!e.ok||r.status!==`ok`)throw Error(r.message||`Package search failed`);us(r.packages||[])}catch(t){if(n!==fs)return;e&&(e.innerHTML=`<div class="package-search-state is-error">Package search failed: ${$(t.message)}</div>`)}},250)}async function ms(){let e=document.getElementById(`btnUpdatePkgs`);e&&(e.disabled=!0,e.textContent=`UPDATING CACHE...`);try{let e=await(await fetch(`/cgi-bin/packages?action=update`)).json();Q(e.message||(e.status===`ok`?`Package repositories updated successfully!`:`Update failed.`),e.status===`ok`?`success`:`error`),await ls()}catch(e){Q(`Repository update failed: `+e.message,`error`)}finally{e&&(e.disabled=!1,e.textContent=`UPDATE REPOSITORIES`)}}async function hs(e){if(!e||!await Z(`Install package "${e}" on router gateway?`,`Install Package`,`Install`))return;let t=document.getElementById(`pkgListContainer`);t&&(t.innerHTML=`<div style="text-align:center; padding:30px; color:#38bdf8; font-size:12px; font-family:var(--font-mono);">Installing "${$(e)}" via APK package manager... Please wait.</div>`);try{let t=await(await fetch(`/cgi-bin/packages?action=install&package=${encodeURIComponent(e)}`)).json();Q(t.message||(t.status===`ok`?`Package "${e}" installed successfully!`:`Installation failed.`),t.status===`ok`?`success`:`error`),await ls()}catch(e){Q(`Install error: `+e.message,`error`),await ls()}}async function gs(){let e=document.getElementById(`pkgDirectInstallInput`);if(!e||!e.value.trim())return;let t=e.value.trim();e.value=``,await hs(t)}async function _s(e){if(!e||!await Z(`Are you sure you want to uninstall "${e}" and remove it from router flash memory?`,`Uninstall Package`,`Uninstall`,!0))return;let t=document.getElementById(`pkgListContainer`);t&&(t.innerHTML=`<div style="text-align:center; padding:30px; color:#ef4444; font-size:12px; font-family:var(--font-mono);">Removing "${$(e)}"... Please wait.</div>`);try{let t=await(await fetch(`/cgi-bin/packages?action=remove&package=${encodeURIComponent(e)}`)).json();Q(t.message||(t.status===`ok`?`Package "${e}" uninstalled successfully!`:`Removal failed.`),t.status===`ok`?`success`:`error`),await ls()}catch(e){Q(`Uninstall error: `+e.message,`error`),await ls()}}var Y=null,vs=null,X=null,ys=!1;function bs(){let e=window.innerWidth;return e<=400?7:e<=520?7.5:e<=768?8.5:e<=1024?10:11.5}function xs(e){return e?{background:`rgba(0, 0, 0, 0)`,foreground:`#f4f4f5`,cursor:`#10b981`,cursorAccent:`#000000`,selectionBackground:`rgba(56, 189, 248, 0.4)`,black:`#27272a`,red:`#ef4444`,green:`#10b981`,yellow:`#f59e0b`,blue:`#60a5fa`,magenta:`#c084fc`,cyan:`#38bdf8`,white:`#f4f4f5`,brightBlack:`#a1a1aa`,brightRed:`#f87171`,brightGreen:`#34d399`,brightYellow:`#fbbf24`,brightBlue:`#93c5fd`,brightMagenta:`#d8b4fe`,brightCyan:`#67e8f9`,brightWhite:`#ffffff`}:{background:`rgba(0, 0, 0, 0)`,foreground:`#000000`,cursor:`#000000`,cursorAccent:`#ffffff`,selectionBackground:`rgba(56, 189, 248, 0.35)`,black:`#000000`,red:`#b91c1c`,green:`#047857`,yellow:`#b45309`,blue:`#1d4ed8`,magenta:`#7e22ce`,cyan:`#0e7490`,white:`#18181b`,brightBlack:`#27272a`,brightRed:`#dc2626`,brightGreen:`#059669`,brightYellow:`#d97706`,brightBlue:`#2563eb`,brightMagenta:`#9333ea`,brightCyan:`#0891b2`,brightWhite:`#000000`}}function Ss(){if(!Y)return;let e=i!==void 0&&i===`dark`||document.documentElement.getAttribute(`data-theme`)!==`light`;Y.options.theme=xs(e),Y.options.fontWeight=e?`500`:`600`;try{Y.refresh(0,Y.rows-1)}catch{}}function Cs(e,t){return new Promise((n,r)=>{let i=document.createElement(e);Object.assign(i,t),i.onload=()=>n(i),i.onerror=()=>r(Error(`Failed to load ${t.src||t.href}`)),document.head.appendChild(i)})}var ws=null;async function Ts(){return typeof Terminal<`u`&&typeof FitAddon<`u`||ws||(ws=(async()=>(document.querySelector(`link[href*="xterm.css"]`)||await Cs(`link`,{rel:`stylesheet`,href:`/js/xterm/xterm.css`}),typeof Terminal>`u`&&await Cs(`script`,{src:`/js/xterm/xterm.js`}),typeof FitAddon>`u`&&await Cs(`script`,{src:`/js/xterm/xterm-addon-fit.js`}),!0))(),ws)}async function Es(){let e=document.getElementById(`terminalContainer`);if(!e)return;if(document.body.classList.add(`terminal-active`),Y){if(ys||(Y.options.fontSize=bs()),Ss(),vs)try{vs.fit()}catch{}setTimeout(()=>{try{Y.focus()}catch{}},100);return}if(typeof Terminal>`u`||typeof FitAddon>`u`){e.innerHTML=`
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:220px;gap:12px;color:var(--text-sub);font-family:var(--font-mono);font-size:12px;">
            <div class="m-spinner" style="width:28px;height:28px;border-width:2.5px;"></div>
            <span>Loading Root Terminal Engine...</span>
          </div>`;try{await Ts()}catch{e.innerHTML=`<div style="padding:14px; color:#ef4444; font-family:var(--font-mono); font-size:12px;">Failed to load terminal engine. Check network connection.</div>`;return}}let t=i!==void 0&&i===`dark`||document.documentElement.getAttribute(`data-theme`)!==`light`,n=bs();Y=new Terminal({allowTransparency:!0,cursorBlink:!0,scrollback:5e3,scrollOnUserInput:!0,fontSize:n,lineHeight:1.18,fontWeight:t?`500`:`600`,fontWeightBold:`700`,fontFamily:`Consolas, "Liberation Mono", Menlo, Courier, monospace`,theme:xs(t)}),typeof FitAddon<`u`&&FitAddon.FitAddon&&(vs=new FitAddon.FitAddon,Y.loadAddon(vs)),e.innerHTML=``,Y.open(e),e.addEventListener(`click`,()=>{if(Y)try{Y.scrollToBottom(),Y.focus()}catch{}});let r=0,a=n;e.addEventListener(`touchstart`,e=>{e.touches.length===2&&(r=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),a=Y.options.fontSize||bs())},{passive:!0}),e.addEventListener(`touchmove`,e=>{if(e.touches.length===2&&r>0){let t=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)/r,n=Math.round(a*t*2)/2;if(n=Math.max(6,Math.min(18,n)),Y.options.fontSize!==n&&(ys=!0,Y.options.fontSize=n,vs&&(vs.fit(),Y.scrollToBottom(),X&&X.readyState===WebSocket.OPEN))){let e=new TextEncoder().encode(`1`+JSON.stringify({columns:Y.cols,rows:Y.rows}));X.send(e)}}},{passive:!0}),setTimeout(()=>{if(vs)try{vs.fit(),Y.scrollToBottom()}catch{}try{Y.focus()}catch{}},50),As();function o(){if(!document.body.classList.contains(`terminal-active`))return;let t=document.getElementById(`acc-terminal-cli`);if(t&&(t.classList.contains(`active`)||t.classList.contains(`page-active`))){if(window.innerWidth<=768){let e=window.visualViewport?Math.floor(window.visualViewport.height):window.innerHeight,n=window.visualViewport?Math.floor(window.visualViewport.offsetTop):0;document.documentElement.style.setProperty(`--term-vh`,`${e}px`),t.style.setProperty(`height`,`${e}px`,`important`),t.style.setProperty(`top`,`${n}px`,`important`),t.style.setProperty(`position`,`fixed`,`important`),t.style.setProperty(`bottom`,`auto`,`important`),window.scrollTo(0,0)}else{t.style.removeProperty(`top`),t.style.removeProperty(`bottom`),t.style.removeProperty(`position`),t.style.removeProperty(`height`);let n=e.getBoundingClientRect(),r=Math.max(200,Math.floor((window.visualViewport?window.visualViewport.height:window.innerHeight)-n.top-24));e.style.setProperty(`height`,`${r}px`,`important`)}if(vs&&Y)try{ys||(Y.options.fontSize=bs()),vs.fit(),Y.scrollToBottom();let t=e.querySelector(`.xterm-viewport`);if(t&&(t.scrollTop=t.scrollHeight),X&&X.readyState===WebSocket.OPEN){let e=new TextEncoder().encode(`1`+JSON.stringify({columns:Y.cols,rows:Y.rows}));X.send(e)}}catch{}}}window.visualViewport&&(window.visualViewport.addEventListener(`resize`,o),window.visualViewport.addEventListener(`scroll`,o)),window.addEventListener(`resize`,o),setTimeout(o,50),setTimeout(o,200)}function Ds(){if(Y)try{Y.clear(),Y.scrollToBottom();let e=document.querySelector(`#terminalContainer .xterm-viewport`);e&&(e.scrollTop=e.scrollHeight)}catch{}Os(`CLEAR`)}window.clearTerminalScreen=Ds;function Os(e){if(!X||X.readyState!==WebSocket.OPEN)return;let t=``;t=e===`ESC`?`\x1B`:e===`TAB`?`	`:e===`CTRL_C`?``:e===`UP`?`\x1B[A`:e===`DOWN`?`\x1B[B`:e===`CLEAR`?`clear\r`:e===`ENTER`?`\r`:e;let n=new Uint8Array(1+t.length);n[0]=48;for(let e=0;e<t.length;e++)n[e+1]=t.charCodeAt(e);if(X.send(n),Y)try{Y.scrollToBottom(),Y.focus();let e=document.querySelector(`#terminalContainer .xterm-viewport`);e&&(e.scrollTop=e.scrollHeight)}catch{}}window.sendTerminalKey=Os;function ks(e){e&&(e.preventDefault(),e.stopPropagation());let t=document.getElementById(`termQuickInput`);if(!t)return;let n=t.value;if(n==null||n.trim()===``)return;if(!X||X.readyState!==WebSocket.OPEN){typeof Q==`function`&&Q(`Terminal session not connected`);return}let r=n+`\r`,i=new TextEncoder().encode(r),a=new Uint8Array(1+i.length);if(a[0]=48,a.set(i,1),X.send(a),t.value=``,Y)try{Y.scrollToBottom();let e=document.querySelector(`#terminalContainer .xterm-viewport`);e&&(e.scrollTop=e.scrollHeight)}catch{}}window.submitMobileTermCmd=ks;function As(){if(X&&X.readyState===WebSocket.OPEN)return;let e=`${window.location.protocol===`https:`?`wss:`:`ws:`}//${window.location.hostname}:7681/ws`;try{X=new WebSocket(e,[`tty`]),X.binaryType=`arraybuffer`,X.onopen=()=>{if(X.send(new TextEncoder().encode(JSON.stringify({AuthToken:``}))),Y){let e=Y.cols||80,t=Y.rows||24,n=new TextEncoder().encode(`1`+JSON.stringify({columns:e,rows:t}));X.send(n);try{Y.scrollToBottom()}catch{}}},X.onmessage=e=>{let t=new Uint8Array(e.data);String.fromCharCode(t[0])===`0`&&Y&&Y.write(t.slice(1),()=>{try{Y.scrollToBottom();let e=document.querySelector(`#terminalContainer .xterm-viewport`);e&&(e.scrollTop=e.scrollHeight)}catch{}})},X.onclose=()=>{Y&&Y.writeln(`\r
\x1B[33m[Session disconnected. Press back or re-open Terminal to reconnect]\x1B[0m`)},X.onerror=()=>{Y&&Y.writeln(`\r
\x1B[31m[WebSocket connection to port 7681 failed]\x1B[0m`)},Y.onData(e=>{if(Y)try{Y.scrollToBottom();let e=document.querySelector(`#terminalContainer .xterm-viewport`);e&&(e.scrollTop=e.scrollHeight)}catch{}if(X&&X.readyState===WebSocket.OPEN){let t=new TextEncoder().encode(e),n=new Uint8Array(1+t.length);n[0]=48,n.set(t,1),X.send(n)}})}catch(e){Y&&Y.writeln(`\r
\x1B[31mFailed to establish terminal WebSocket: `+e.message+`\x1B[0m`)}}var js=``;function Ms(e){let t=document.getElementById(`tsLoggedOutSettings`),n=document.getElementById(`tsConnectedSettings`);t&&(t.style.display=e?`none`:`block`),n&&(n.style.display=e?`block`:`none`)}function Ns(e){js=e||``;let t=document.getElementById(`tsWebLoginSub`),n=document.getElementById(`btnTsOpenLink`),r=document.getElementById(`btnTsCopyLink`);e?(t&&(t.innerHTML=`Link ready: <span style="color:#38bdf8; font-family:var(--font-mono); word-break:break-all;">${$(e)}</span>`),n&&(n.href=e,n.style.display=`inline-flex`),r&&(r.style.display=`inline-flex`)):(t&&(t.textContent=`Generate authentication link to sign in via browser`),n&&(n.style.display=`none`),r&&(r.style.display=`none`))}function Ps(e){if(!e)return;let t=e.user||{},n=document.getElementById(`tsUserDisplayName`),r=document.getElementById(`tsUserLoginName`),i=document.getElementById(`tsTailnetDomain`),a=document.getElementById(`tsMeshNodesBadge`),o=document.getElementById(`tsUserAvatarImg`),s=document.getElementById(`tsUserAvatarBlank`),c=e.backend_state===`Running`&&e.online!==!1,l=c&&t&&(t.DisplayName||t.LoginName);Ms(c&&(l||!!e.tailscale_ip)),l?(n&&(n.textContent=t.DisplayName||t.LoginName),r&&(r.textContent=t.LoginName||`Tailscale Operator`)):(n&&(n.textContent=`Not Signed In`),r&&(r.textContent=`Disconnected from tailnet`)),i&&(i.textContent=c&&e.tailnet?e.tailnet:`Disconnected`);let u=c&&e.devices_online||0,d=c&&e.devices_total||0;a&&(a.innerHTML=`<span id="tsOnlineCountBadge">${u} Online</span> / <span id="tsTotalCountBadge">${d} Total</span>`,a.className=c?`setting-status-badge badge-active`:`setting-status-badge badge-disabled`);let f=t.ProfilePicURL||e.profile_pic_url||``;o&&s&&(f&&l?(o.src=f,o.style.display=`block`,s.style.display=`none`):(o.style.display=`none`,s.style.display=`block`))}function Fs(e){let t=document.getElementById(`tsDevicesContainer`);if(!t)return;if(!(e&&e.backend_state===`Running`)){t.innerHTML=`<div style="padding:14px; text-align:center; color:var(--text-dim); font-size:11px; font-family:var(--font-mono); background:rgba(255,255,255,0.02); border-radius:8px;">No active mesh devices. Router is not signed in to a tailnet.</div>`;return}let n=e.peers||[];if(n.length===0){t.innerHTML=`
          <div class="setting-row-item" style="color:var(--text-dim); font-size:11.5px; font-family:var(--font-mono); padding:10px 14px;">
            No remote mesh peers connected.
          </div>
        `;return}let r=``;n.forEach(e=>{let t=e.name||e.hostname||`Mesh Peer`,n=e.ip||`--`,i=(e.os||`linux`).toUpperCase(),a=!!e.online,o=e.last_seen&&e.last_seen!==`0001-01-01T00:00:00Z`?e.last_seen.split(`T`)[0]:``,s=`${$(n)} &bull; ${$(i)}${o&&!a?` &bull; Seen ${o}`:``}`;r+=`
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">${$(t)}</span>
              <span class="setting-label-sub">${s}</span>
            </div>
            <div class="setting-control-col">
              <span class="setting-status-badge ${a?`badge-active`:`badge-disabled`}">${a?`Online`:`Offline`}</span>
            </div>
          </div>
        `}),t.innerHTML=r}async function Is(){try{let e=await(await fetch(`/cgi-bin/tailscale`)).json(),t=document.getElementById(`tsStatusBadge`),n=document.getElementById(`tsIpAddress`),r=e.backend_state||e.BackendState||(e.online?`Running`:`Stopped`),i=r===`Running`,a=i?e.tailscale_ip||e.TailscaleIPs&&e.TailscaleIPs[0]||(e.Self&&e.Self.TailscaleIPs?e.Self.TailscaleIPs[0]:``):``,o=i&&!!a,s=document.getElementById(`tsNotInstalledNotice`);s&&(s.style.display=`none`);let c=document.getElementById(`disp_ts_ip`);o?(t&&(t.className=`card-badge emerald`,t.innerText=`RUNNING`),n&&(n.value=a),c&&(c.textContent=a),Ms(!0)):(t&&(t.className=`card-badge`,t.innerText=r===`NeedsLogin`?`NEEDS LOGIN`:r===`Stopped`?`STOPPED`:`NOT CONNECTED`),n&&(n.value=``),c&&(c.textContent=`Not Connected`),Ms(!1)),document.getElementById(`tsMasterToggle`)&&(document.getElementById(`tsMasterToggle`).checked=r.toLowerCase()===`running`),document.getElementById(`tsShareLan`)&&e.share_lan!==void 0&&(document.getElementById(`tsShareLan`).checked=!!e.share_lan),document.getElementById(`tsExitNode`)&&e.exit_node!==void 0&&(document.getElementById(`tsExitNode`).checked=!!e.exit_node),document.getElementById(`tsAcceptRoutes`)&&e.accept_routes!==void 0&&(document.getElementById(`tsAcceptRoutes`).checked=!!e.accept_routes),document.getElementById(`tsSshMode`)&&e.ssh!==void 0&&(document.getElementById(`tsSshMode`).checked=!!e.ssh),document.getElementById(`tsHostname`)&&e.hostname&&(document.getElementById(`tsHostname`).value=e.hostname),Ps(e),Fs(e),o?Ns(``):e.auth_url&&Ns(e.auth_url)}catch(e){console.error(`fetchTailscale error`,e);let t=document.getElementById(`tsNotInstalledNotice`);t&&(t.style.display=`flex`);let n=document.getElementById(`tsStatusBadge`);n&&(n.className=`card-badge`,n.innerText=`OFFLINE`)}}async function Ls(e){try{await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:e?`up`:`down`})}),setTimeout(Is,1500)}catch(e){console.error(`toggleTailscaleService error`,e)}}var Rs=0,zs=0,Bs=null;async function Vs(){let e=++Rs;zs=0,clearTimeout(Bs),Q(`Generating Tailscale login link...`,`info`);let t=document.getElementById(`tsWebLoginSub`);t&&(t.textContent=`Starting Tailscale daemon and requesting a login link...`);try{let t=await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`up`})}),n=await t.json();if(!t.ok||n.status!==`ok`)throw Error(n.message||`Tailscale could not start`);Bs=setTimeout(()=>Hs(e),1e3)}catch(e){console.error(`startTailscaleWebLogin error`,e),t&&(t.textContent=`${e.message||`Unable to start Tailscale.`} Click the login icon to retry.`),Q(`Unable to start Tailscale login`,`error`)}}async function Hs(e){if(e!==Rs)return;let t=document.getElementById(`tsWebLoginSub`);try{let e=await fetch(`/cgi-bin/tailscale`),t=await e.json();if(!e.ok||t.status===`error`)throw Error(t.message||`Unable to check Tailscale status`);let n=t.auth_url||``;if(n){Ns(n),Q(`Login URL generated! Click icon to open.`,`success`);return}if(t.backend_state===`Running`){Ns(``),Ms(!0),Q(`Tailscale connected & running!`,`success`),Is();return}zs++}catch(e){console.warn(`checkTailscaleAuthUrl error:`,e),zs++}e===Rs&&(zs>=15?(t&&(t.textContent=`Login link was not ready. Check router connectivity and click the login icon to retry.`),Q(`Tailscale login timed out. You can retry.`,`error`)):(t&&(t.textContent=`Waiting for Tailscale login link... (${zs}/15)`),Bs=setTimeout(()=>Hs(e),2e3)))}function Us(){js&&navigator.clipboard.writeText(js).then(()=>Q(`Login URL copied to clipboard!`,`success`)).catch(()=>Q(`Failed to copy URL`,`error`))}async function Ws(){if(await Z(`Are you sure you want to log out this router from Tailscale?`,`Tailscale Disconnect`,`Disconnect`,!0))try{let e=document.getElementById(`disp_ts_ip`);e&&(e.textContent=`Not Connected`);let t=document.getElementById(`tsStatusBadge`);t&&(t.className=`card-badge`,t.innerText=`NOT CONNECTED`),Ps({backend_state:`Stopped`,online:!1,tailscale_ip:``,user:{},devices_total:0,devices_online:0}),Fs({backend_state:`Stopped`,peers:[]}),Ns(``),Ms(!1),await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`logout`})}),Q(`Tailscale logged out`,`info`),setTimeout(Is,1e3)}catch(e){console.error(`logoutTailscale error`,e)}}async function Gs(){let e=(document.getElementById(`tsAuthKeyInput`).value||``).trim();if(!e)Q(`Please enter a valid Tailscale Auth Key (e.g. tskey-auth-...)`,`error`);else try{await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`up`,authkey:e})}),Q(`Connecting to Tailnet with Auth Key...`,`info`),setTimeout(Is,3e3)}catch(e){console.error(`loginTailscaleWithKey error`,e)}}async function Ks(){try{await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`restart`})}),Q(`Tailscale service restarted.`,`success`),setTimeout(Is,2e3)}catch(e){console.error(`restartTailscale error`,e)}}async function qs(){let e=!document.getElementById(`tsShareLan`)||document.getElementById(`tsShareLan`).checked,t=document.getElementById(`tsExitNode`)?document.getElementById(`tsExitNode`).checked:!1,n=!document.getElementById(`tsAcceptRoutes`)||document.getElementById(`tsAcceptRoutes`).checked,r=document.getElementById(`tsSshMode`)?document.getElementById(`tsSshMode`).checked:!1,i=document.getElementById(`tsHostname`)&&document.getElementById(`tsHostname`).value||`Maxnet-Gateway`;try{await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_prefs`,share_lan:e,exit_node:t,accept_routes:n,ssh:r,hostname:i})}),Is()}catch(e){console.error(`applyTailscalePrefs error`,e)}}async function Js(){try{let e=await(await fetch(`/cgi-bin/smb_config`)).json();if(e.status===`ok`){let t=document.getElementById(`smbUsernameInput`);t&&e.username&&(t.value=e.username);let n=document.getElementById(`smbStatusBadge`);n&&(e.smb_running?(n.className=`card-badge emerald`,n.innerText=`ONLINE (`+(e.mounted?e.device||`MOUNTED`:`READY`)+`)`):(n.className=`card-badge`,n.innerText=`STOPPED`));let r=document.getElementById(`btnToggleSmbSettings`);r&&(r.innerText=e.smb_running?`STOP SMB`:`START SMB`,r.className=e.smb_running?`mh-btn btn-ghost`:`mh-btn`);let i=document.getElementById(`smbDevState`);i&&(i.innerText=e.mounted?e.device||`Mounted`:`No drive mounted`);let a=document.getElementById(`smbTotalSpace`);a&&(a.innerText=e.total_space||`--`);let o=document.getElementById(`smbFreeSpace`);o&&(o.innerText=e.free_space||`--`);let s=document.getElementById(`smbMountPath`);s&&(s.innerText=e.share_path||`/mnt/pendrive`);let c=document.getElementById(`smbDevState`);c&&(c.textContent=e.mounted?`${e.device||`USB Drive`} mounted on ${e.share_path||`/mnt/pendrive`}`:`No external USB disk detected`);let l=document.getElementById(`smbCapacityBadge`);l&&(l.textContent=e.mounted?`${e.total_space||`--`} (${e.free_space||`--`} free)`:`No Storage`);let u=document.getElementById(`smbShareAddressText`);u&&(u.textContent=`smb://${window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||window.location.hostname||`10.0.0.1`}/Pendrive`);let d=document.getElementById(`disp_smb_user_desc`);d&&(d.textContent=`Open Guest Access (No Password Required) • Click to configure credentials`);let f=document.getElementById(`smbMasterToggle`);f&&(f.checked=!!e.smb_running)}}catch(e){console.error(`fetchSmbConfig error`,e)}}async function Ys(e){Q(e?`Starting Samba 4 service...`:`Stopping Samba service...`,`info`);try{Q((await(await fetch(`/cgi-bin/smb_config`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`toggle`,enable:!!e})})).json()).message||`Samba state updated`,`success`),Js()}catch(e){Q(`Failed to toggle SMB: `+e.message,`error`)}}async function Xs(){let e=document.getElementById(`smbUsernameInput`),t=document.getElementById(`smbPasswordInput`),n=document.getElementById(`smbActionStatus`),r=e?e.value.trim():``,i=t?t.value:``;if(!r||!i)n&&(n.style.color=`#ef4444`,n.innerText=`Please specify both username and password`);else{n&&(n.style.color=`var(--text-dim)`,n.innerText=`Saving credentials...`);try{let e=await(await fetch(`/cgi-bin/smb_config`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set`,username:r,password:i})})).json();n&&(e.status===`ok`?(n.style.color=`#10b981`,n.innerText=e.message||`Credentials saved and Samba restarted`,t&&(t.value=``)):(n.style.color=`#ef4444`,n.innerText=e.message||`Failed to update Samba credentials`)),Js()}catch(e){n&&(n.style.color=`#ef4444`,n.innerText=`Update failed: `+e.message)}}}function Zs(e){let t=window._lastDataCache&&window._lastDataCache.usb_devices&&window._lastDataCache.usb_devices.find(e=>e.device_type===`storage`||e.device_type===`pendrive`||e.has_storage),n=`smb://${t&&t.virtual_ip||window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||window.location.hostname||`10.0.0.1`}/Pendrive`;navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(n).then(()=>{typeof Q==`function`&&Q(`Copied ${n} to clipboard`,`success`)}).catch(()=>{Qs(n)}):Qs(n)}function Qs(e){try{let t=document.createElement(`textarea`);t.value=e,t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select(),document.execCommand(`copy`),document.body.removeChild(t),typeof Q==`function`&&Q(`Copied ${e} to clipboard`,`success`)}catch{}}function $s(e){z(`settings`),L(`acc-adb-device`);let t=document.getElementById(`adbDeviceDropdown`);t&&t.options.length>0&&Lr()}async function ec(){let e=(document.getElementById(`oldPasswordInput`)?.value||``).trim(),t=(document.getElementById(`newPasswordInput`)?.value||``).trim(),n=(document.getElementById(`confirmPasswordInput`)?.value||``).trim();if(!t)Q(`Please enter a new password.`,`error`);else if(window._rootHasPassword===!0&&!e)Q(`Please enter your current administrator password.`,`error`);else if(t!==n)Q(`New password and confirmation do not match.`,`error`);else if(t.length<4)Q(`Password must be at least 4 characters long.`,`error`);else try{let n=await(await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`change_password`,user:`root`,old_pass:e,new_pass:t})})).json();n.status===`ok`?(window._rootHasPassword=!0,Q(`Root administrator password updated successfully!`,`success`),typeof Fi==`function`&&Fi()):Q(`Error updating password: `+(n.message||`Invalid current password.`),`error`)}catch(e){Q(`Network request failed: `+e.message,`error`)}}function tc(){window.location.href=`/cgi-bin/backup`}async function nc(){let e=document.getElementById(`backupFileInput`);if(!e.files||e.files.length===0){Q(`Please choose a .tar.gz backup archive first.`,`warning`);return}if(!await Z(`Restoring configuration will overwrite custom settings and restart services. Proceed?`,`Restore Configuration`,`Restore`,!0))return;let t=e.files[0];try{Q((await(await fetch(`/cgi-bin/restore`,{method:`POST`,body:t})).json()).message||`Configuration restored successfully. Reloading gateway...`,`success`),setTimeout(()=>location.reload(),3e3)}catch(e){Q(`Error restoring backup: `+e.message,`error`)}}var rc=null,ic=10;function ac(){let e=document.getElementById(`factoryResetModalOverlay`),t=document.getElementById(`btnConfirmFactoryReset`);e&&t&&(e.style.display=`flex`,requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.classList.add(`active`)})}),ic=10,t.disabled=!0,t.style.cursor=`not-allowed`,t.style.background=`rgba(239,68,68,0.2)`,t.style.color=`rgba(255,255,255,0.4)`,t.textContent=`RESET GATEWAY (${ic}s)`,clearInterval(rc),rc=setInterval(()=>{ic--,ic>0?t.textContent=`RESET GATEWAY (${ic}s)`:(clearInterval(rc),t.disabled=!1,t.style.cursor=`pointer`,t.style.background=`#ef4444`,t.style.color=`#ffffff`,t.textContent=`RESET GATEWAY`)},1e3))}function oc(){clearInterval(rc);let e=document.getElementById(`factoryResetModalOverlay`);e&&(e.classList.remove(`active`),setTimeout(()=>{e.classList.contains(`active`)||(e.style.display=`none`)},220))}async function sc(){if(!(ic>0)){oc(),Q(`Initiating factory reset... Router rebooting`,`warning`,8e3);try{await fetch(`/cgi-bin/restore?action=reset`,{method:`POST`})}catch{}}}function cc(){ac()}function lc(){ac()}async function uc(){try{Q(`Fetching system log...`,`info`);let e=await(await fetch(`/cgi-bin/logs?type=system&lines=1000`)).json(),t=new Blob([e.raw||``],{type:`text/plain;charset=utf-8`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`system_log_${Date.now()}.txt`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n),Q(`System log downloaded!`,`success`)}catch{Q(`Error downloading system log`,`error`)}}async function dc(){try{Q(`Fetching kernel dmesg log...`,`info`);let e=await(await fetch(`/cgi-bin/logs?type=kernel&lines=1000`)).json(),t=new Blob([e.raw||``],{type:`text/plain;charset=utf-8`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`kernel_dmesg_${Date.now()}.txt`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n),Q(`Kernel dmesg downloaded!`,`success`)}catch{Q(`Error downloading kernel log`,`error`)}}function Z(e,t=`Confirm Action`,n=`Confirm`,r=!1){return new Promise(i=>{let a=document.getElementById(`customConfirmModal`);a||(a=document.createElement(`div`),a.id=`customConfirmModal`,a.className=`logout-modal-backdrop`,a.innerHTML=`
            <div class="logout-modal-card">
              <div class="logout-modal-icon-wrap" id="customConfirmIconWrap" style="background:rgba(6,182,212,0.12); color:#06b6d4; border:1px solid rgba(6,182,212,0.25);">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div class="logout-modal-title" id="customConfirmTitle">Confirm Action</div>
              <div class="logout-modal-desc" id="customConfirmDesc">Are you sure?</div>
              <div class="logout-modal-actions">
                <button type="button" class="logout-modal-btn cancel" id="customConfirmCancel">Cancel</button>
                <button type="button" class="logout-modal-btn confirm" id="customConfirmOk">Confirm</button>
              </div>
            </div>
          `,document.body.appendChild(a));let o=document.getElementById(`customConfirmTitle`),s=document.getElementById(`customConfirmDesc`),c=document.getElementById(`customConfirmIconWrap`),l=document.getElementById(`customConfirmOk`),u=document.getElementById(`customConfirmCancel`);o&&(o.textContent=t),s&&(s.textContent=e),c&&(r?(c.style.background=`rgba(239, 68, 68, 0.12)`,c.style.color=`#ef4444`,c.style.borderColor=`rgba(239, 68, 68, 0.25)`):(c.style.background=`rgba(6, 182, 212, 0.12)`,c.style.color=`#06b6d4`,c.style.borderColor=`rgba(6, 182, 212, 0.25)`)),l&&(l.textContent=n,r?(l.style.background=`#ef4444`,l.style.color=`#ffffff`):(l.style.background=`linear-gradient(135deg, #06b6d4, #0891b2)`,l.style.color=`#ffffff`));let d=()=>{a.style.display=`none`,l.onclick=null,u.onclick=null,a.onclick=null};l.onclick=()=>{d(),i(!0)},u.onclick=()=>{d(),i(!1)},a.onclick=e=>{e.target===a&&(d(),i(!1))},a.style.display=`flex`})}function fc(e,t=``,n=`Input Required`){return new Promise(r=>{let i=document.getElementById(`customPromptModal`);i||(i=document.createElement(`div`),i.id=`customPromptModal`,i.className=`logout-modal-backdrop`,i.innerHTML=`
            <div class="logout-modal-card" style="max-width:400px;">
              <div class="logout-modal-title" id="customPromptTitle">Input</div>
              <div class="logout-modal-desc" id="customPromptDesc">Enter value:</div>
              <div style="margin:14px 0; width:100%;">
                <input type="text" id="customPromptInput" class="mh-input" style="width:100%; box-sizing:border-box; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              </div>
              <div class="logout-modal-actions">
                <button type="button" class="logout-modal-btn cancel" id="customPromptCancel">Cancel</button>
                <button type="button" class="logout-modal-btn confirm" id="customPromptOk">Submit</button>
              </div>
            </div>
          `,document.body.appendChild(i));let a=document.getElementById(`customPromptTitle`),o=document.getElementById(`customPromptDesc`),s=document.getElementById(`customPromptInput`),c=document.getElementById(`customPromptOk`),l=document.getElementById(`customPromptCancel`);a&&(a.textContent=n),o&&(o.textContent=e),s&&(s.value=t,setTimeout(()=>{s.focus(),s.select()},100));let u=()=>{i.style.display=`none`,c.onclick=null,l.onclick=null,i.onclick=null,s&&(s.onkeydown=null)};c.onclick=()=>{let e=s?s.value:``;u(),r(e)},l.onclick=()=>{u(),r(null)},i.onclick=e=>{e.target===i&&(u(),r(null))},s&&(s.onkeydown=e=>{if(e.key===`Enter`){let e=s.value;u(),r(e)}else e.key===`Escape`&&(u(),r(null))}),i.style.display=`flex`})}window.alert=function(e){Q(String(e),`info`)};function Q(e,t=`info`,n=3e3){let r=document.getElementById(`globalAppToast`);r||(r=document.createElement(`div`),r.id=`globalAppToast`,r.className=`global-app-toast`,document.body.appendChild(r)),r.textContent=e,r.className=`global-app-toast show ${t}`,clearTimeout(r._timer),r._timer=setTimeout(()=>{r.classList.remove(`show`)},n)}var pc=null;window._lastFirmwareUpdateData=null;var mc=!1;function hc(e){e&&(pc=e),!pc&&window._lastFirmwareUpdateData&&(pc=window._lastFirmwareUpdateData);let t=pc||{},n=document.getElementById(`firmwareFlashModalOverlay`);if(!n)return;let r=document.getElementById(`flashCurrentVer`),i=document.getElementById(`flashLatestVer`),a=document.getElementById(`flashFileName`),o=document.getElementById(`flashFileSize`);r&&(r.textContent=t.current||`v2.2.7-b7`),i&&(i.textContent=t.latest||t.current||`v2.2.7-b7`),a&&(a.textContent=t.file||`maxnet-jidu6911-sysupgrade.bin`),o&&(o.textContent=t.size?(t.size/1048576).toFixed(2)+` MB`:`28.60 MB`);let s=document.getElementById(`flashModalContent`),c=document.getElementById(`flashModalFooter`),l=document.getElementById(`flashProgressState`);s&&(s.style.display=`flex`),c&&(c.style.display=`flex`),l&&(l.style.display=`none`),n.style.display=`flex`,requestAnimationFrame(()=>n.classList.add(`active`))}function gc(){if(mc){Q(`Firmware upgrade in progress. Please do not close.`,`warning`);return}let e=document.getElementById(`firmwareFlashModalOverlay`);e&&(e.classList.remove(`active`),setTimeout(()=>{e.style.display=`none`},200))}function _c(e){e&&(pc=e),!pc&&window._lastFirmwareUpdateData&&(pc=window._lastFirmwareUpdateData);let t=pc||{},n=document.getElementById(`ramBootModalOverlay`);if(!n)return;let r=document.getElementById(`ramBootTftpCmd`),i=document.getElementById(`ramBootItbDownloadLink`),a=document.getElementById(`ramBootItbSize`);r&&(r.textContent=t.tftp_command||`tftpboot 0x46000000 maxnet-jidu6911-initramfs.itb; bootm 0x46000000`),i&&(i.href=t.itb_url||`#`),a&&(a.textContent=t.itb_size?(t.itb_size/1048576).toFixed(2)+` MB`:`34.16 MB`),n.style.display=`flex`,requestAnimationFrame(()=>n.classList.add(`active`))}function vc(){let e=document.getElementById(`ramBootModalOverlay`);e&&(e.classList.remove(`active`),setTimeout(()=>{e.style.display=`none`},200))}async function yc(){let e=document.getElementById(`btnExecDirectRamBoot`);e&&(e.disabled=!0,e.innerHTML=`<span class="m-spinner" style="width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:6px;"></span> Configuring U-Boot...`);try{Q(`Configuring U-Boot bootcmd for Safe RAM Boot...`,`info`),await p(`/cgi-bin/update?action=ram_boot`),Q(`Safe RAM Boot configured! Rebooting router into RAM mode...`,`success`),await p(`/cgi-bin/update?action=ram_boot_reboot`).catch(()=>{}),setTimeout(()=>{vc(),Q(`Gateway rebooting into volatile RAM. Reconnecting...`,`info`);let e=0,t=setInterval(async()=>{e++;try{(await fetch(`/cgi-bin/status?t=`+Date.now(),{method:`GET`,cache:`no-store`})).ok&&(clearInterval(t),Q(`Router online in Safe RAM Boot mode!`,`success`),setTimeout(()=>location.reload(),1500))}catch{}e>60&&(clearInterval(t),location.reload())},2e3)},1500)}catch(t){Q(`Failed to trigger RAM Boot: `+t.message,`error`),e&&(e.disabled=!1,e.textContent=`Reboot into RAM Boot Mode`)}}async function bc(e=!1){mc=!0;let t=document.getElementById(`flashModalContent`),n=document.getElementById(`flashModalFooter`),r=document.getElementById(`flashProgressState`),i=document.getElementById(`flashProgressTitle`),a=document.getElementById(`flashProgressDesc`),o=document.getElementById(`flashProgressBar`),s=document.getElementById(`flashCountdownTimer`);t&&(t.style.display=`none`),n&&(n.style.display=`none`),r&&(r.style.display=`flex`),i&&(i.textContent=e?`Executing Clean Flash & Wipe...`:`Starting Firmware Upgrade...`),a&&(a.textContent=e?`Erasing configurations and starting download worker in background...`:`Preserving network settings and starting download worker in background...`),o&&(o.style.width=`5%`,o.style.background=`var(--primary, #10b981)`),s&&(s.textContent=`Contacting release mirror...`);try{await p(`/cgi-bin/update?action=`+(e?`flash_clean`:`flash`))}catch{}let c=0,l=!1,u=setInterval(async()=>{c++;try{let e=await fetch(`/cgi-bin/update?action=status&t=`+Date.now(),{method:`GET`,cache:`no-store`});if(!e.ok)throw Error(`HTTP `+e.status);let t=await e.json();if(t.state===`downloading`){i&&(i.textContent=`Downloading Firmware...`),a&&(a.textContent=t.message||`Downloading firmware from GitHub release...`);let e=Math.max(5,Math.min(85,t.progress||10));o&&(o.style.width=`${e}%`),s&&(s.textContent=`${e}% downloaded`)}else if(t.state===`verifying`)i&&(i.textContent=`Verifying Firmware Integrity...`),a&&(a.textContent=t.message||`Verifying SHA-256 hash and sysupgrade header...`),o&&(o.style.width=`${t.progress||90}%`),s&&(s.textContent=`Integrity check passed`);else if(t.state===`flashing`){clearInterval(u),l=!0,i&&(i.textContent=`Flashing NAND & Rebooting...`),a&&(a.textContent=`Writing firmware to SPI-NAND flash. System is rebooting. Please DO NOT power off router!`),o&&(o.style.width=`96%`),s&&(s.textContent=`Rebooting Maxnet Gateway...`);let e=0,t=setInterval(async()=>{if(e++,e>15)try{(await fetch(`/cgi-bin/status?t=`+Date.now(),{method:`GET`,cache:`no-store`})).ok&&(clearInterval(t),o&&(o.style.width=`100%`),i&&(i.textContent=`Firmware Updated Successfully!`),a&&(a.textContent=`Router online. Reloading interface...`),setTimeout(()=>location.reload(),1500))}catch{}e>70&&(clearInterval(t),location.reload())},2e3)}else t.state===`error`&&(clearInterval(u),mc=!1,i&&(i.textContent=`Firmware Update Failed`),a&&(a.textContent=t.message||`An error occurred during firmware update.`),o&&(o.style.width=`100%`,o.style.background=`#ef4444`),s&&(s.textContent=`Error`),n&&(n.style.display=`flex`,n.innerHTML=`<button type="button" class="mh-btn btn-ghost" onclick="closeFirmwareFlashModal()" style="padding:7px 18px; font-size:12px; font-weight:700;">CLOSE</button>`))}catch{c>15&&!l&&(l=!0,i&&(i.textContent=`Flashing & Rebooting...`),a&&(a.textContent=`Writing to flash and restarting. Waiting for gateway to come back online...`),o&&(o.style.width=`95%`))}c>120&&!l&&(clearInterval(u),mc=!1,n&&(n.style.display=`flex`))},1e3)}async function xc(){let e=document.getElementById(`btnCheckUpdate`),t=document.getElementById(`iconCheckUpdate`),n=document.getElementById(`btnCheckFwPage`),r=document.getElementById(`iconCheckFwPage`),i=document.getElementById(`updateStatusPill`),a=document.getElementById(`updateStatusSub`);e&&e.classList.add(`btn-pulse`),t&&t.classList.add(`spinning`),n&&n.classList.add(`btn-pulse`),r&&r.classList.add(`spinning`),i&&(i.className=`setting-pill pill-cyan`,i.textContent=`CHECKING...`),a&&(a.textContent=`Contacting remote firmware release mirror...`);try{let o=!1,s=null;try{let e=await(await p(`/cgi-bin/update`)).json();e&&e.status===`update_available`?(o=!0,s=e):e&&(s=e)}catch{}setTimeout(()=>{t&&t.classList.remove(`spinning`),e&&e.classList.remove(`btn-pulse`),r&&r.classList.remove(`spinning`),n&&n.classList.remove(`btn-pulse`),pc=s,window._lastFirmwareUpdateData=s;let c=document.getElementById(`fwCurrentVerBadge`),l=document.getElementById(`fwModelVal`),u=document.getElementById(`fwSocVal`);document.getElementById(`fwKernelVal`);let d=document.getElementById(`fwLatestVerVal`),f=document.getElementById(`fwFileVal`),p=document.getElementById(`fwSizeVal`),m=document.getElementById(`fwShaVal`),h=document.getElementById(`fwTftpCmdVal`),g=document.getElementById(`fwItbDownloadLink`),_=document.getElementById(`fwUpdateStatusPill`),v=document.getElementById(`rowFwUpgradeAction`),y=document.getElementById(`rowFwRamBootAction`),b=document.getElementById(`fwStatusSubtitle`),x=document.getElementById(`fwStatusMainLabel`);if(c&&(c.textContent=s&&s.current||`v3.2.0`),l&&(l.textContent=s&&s.model||`MAXNET-IPQ9574 AX6000`),u&&(u.textContent=s&&s.soc||`Qualcomm IPQ9574 (AArch64)`),d&&(d.textContent=s&&s.latest||s&&s.current||`v3.2.0`),f&&(f.textContent=s&&s.file||`sysupgrade.bin`),p&&(p.textContent=s&&s.size?(s.size/1048576).toFixed(2)+` MB`:`28.60 MB`),m&&(m.textContent=s&&s.sha256?`${s.sha256.substring(0,16)}...${s.sha256.substring(s.sha256.length-8)}`:`Verified via Release Manifest`),h&&(h.textContent=s&&s.tftp_command||`tftpboot 0x46000000 initramfs.itb; bootm 0x46000000`),g&&s&&s.itb_url&&(g.href=s.itb_url),o&&s){let t=s.latest||`v3.2.1`,n=s.model||`MAXNET-IPQ9574 AX6000`;x&&(x.textContent=`Firmware Update Available`,x.style.color=`#f59e0b`),v&&(v.style.display=`flex`),y&&(y.style.display=`flex`),b&&(b.innerHTML=`Installed: <span id="fwCurrentVerBadge" style="font-weight:700;">${$(s.current||`v3.2.0`)}</span> &bull; Latest: <span id="fwLatestVerVal" style="font-weight:700; color:#f59e0b;">${$(t)}</span> &bull; <span>${$(n)}</span>`),i&&(i.className=`setting-pill pill-amber`,i.textContent=`UPDATE: ${t}`),a&&(a.innerHTML=`<span style="color:#f59e0b; font-weight:700;">Update ${$(t)} ready</span> &bull; ${$(n)}`),_&&(_.className=`setting-pill pill-amber`,_.textContent=`UPDATE AVAILABLE`),e&&(e.className=`round-action-btn btn-flash-ready`,e.title=`Install Firmware Update (${t})`,e.onclick=()=>hc(s),e.innerHTML=`<svg viewBox="0 0 24 24" style="width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:2.3;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`);let r=document.getElementById(`btnFwFlashDirect`);r&&(r.textContent=`UPGRADE TO ${t}`,r.classList.add(`btn-pulse`));let o=`update_b`+(s.latest_build||s.latest||`avail`);window._notifiedUpdates||(window._notifiedUpdates=new Set),window._notifiedUpdates.has(o)||(window._notifiedUpdates.add(o),typeof Bo==`function`&&Bo({id:o,title:`MAXNET Update Available (${t})`,message:`New firmware build ${s.latest_build||t} is ready for installation on ${n}. Tap to review & flash.`,level:`info`,event_type:`system_update`,action:()=>hc(s)}))}else{let t=s&&s.current||`v3.2.0`,n=s&&s.model||`MAXNET-IPQ9574 AX6000`;x&&(x.textContent=`Router is Up to Date`,x.style.color=`#10b981`),v&&(v.style.display=`none`),y&&(y.style.display=`none`),b&&(b.innerHTML=`Installed: <span id="fwCurrentVerBadge" style="font-weight:700;">${$(t)}</span> &bull; <span>${$(n)}</span> &bull; Channel: Stable`),i&&(i.className=`setting-pill pill-green`,i.textContent=`${t} UP TO DATE`),a&&(a.textContent=`${n} is running the latest stable release.`),_&&(_.className=`setting-pill pill-green`,_.textContent=`UP TO DATE`),e&&(e.className=`round-action-btn`,e.title=`Check for Latest Firmware Update`,e.onclick=xc,e.innerHTML=`<svg id="iconCheckUpdate" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`)}},600)}catch{let o=document.getElementById(`rowFwUpgradeAction`),s=document.getElementById(`rowFwRamBootAction`);o&&(o.style.display=`none`),s&&(s.style.display=`none`),t&&t.classList.remove(`spinning`),e&&e.classList.remove(`btn-pulse`),r&&r.classList.remove(`spinning`),n&&n.classList.remove(`btn-pulse`),i&&(i.className=`setting-pill pill-green`,i.textContent=`UP TO DATE`),a&&(a.textContent=`MAXNET AX6000 Firmware • Up to date`)}}async function Sc(e){hc(pc||{latest:e})}var Cc=null;function wc(e){let t=e?.target?.files?.[0];if(!t)return;Cc=t;let n=document.getElementById(`localFwFileInfoText`);n&&(n.innerHTML=`Selected: <strong style="color:var(--text-main);">${$(t.name)}</strong> (${(t.size/1048576).toFixed(2)} MB) &bull; Ready to upload &amp; flash`);let r=document.getElementById(`localFwActionsBox`);r&&(r.style.display=`block`);let i=document.getElementById(`localFwFileInfo`),a=document.getElementById(`localFwFileName`),o=document.getElementById(`localFwFileSize`),s=document.getElementById(`btnUploadLocalFw`),c=document.getElementById(`localFwFlashActions`),l=document.getElementById(`localFwProgressBox`);a&&(a.textContent=t.name),o&&(o.textContent=`${(t.size/1048576).toFixed(2)} MB`),i&&(i.style.display=`block`),s&&(s.style.display=`inline-block`,s.disabled=!1),c&&(c.style.display=`none`),l&&(l.style.display=`none`),Q(`Selected: ${t.name} (${(t.size/1048576).toFixed(2)} MB)`,`info`)}function Tc(){if(!Cc){Q(`Please select a .bin firmware file first`,`warning`);return}let e=Cc,t=document.getElementById(`localFwProgressBox`),n=document.getElementById(`localFwProgressBar`),r=document.getElementById(`localFwProgressLabel`),i=document.getElementById(`localFwProgressPct`),a=document.getElementById(`btnUploadLocalFw`),o=document.getElementById(`btnChooseLocalFw`),s=document.getElementById(`localFwFlashActions`);t&&(t.style.display=`block`),n&&(n.style.width=`0%`,n.style.background=`linear-gradient(90deg, #38bdf8, #10b981)`),i&&(i.textContent=`0%`),r&&(r.textContent=`Uploading firmware to router RAM...`),a&&(a.disabled=!0),o&&(o.disabled=!0);let c=new XMLHttpRequest;c.open(`POST`,`/cgi-bin/update?action=upload_bin`,!0),c.setRequestHeader(`Content-Type`,`application/octet-stream`),c.upload.onprogress=e=>{if(e.lengthComputable){let t=Math.round(e.loaded/e.total*100);n&&(n.style.width=`${t}%`),i&&(i.textContent=`${t}%`),t>=100&&r&&(r.textContent=`Verifying sysupgrade checksum & architecture...`)}},c.onload=()=>{a&&(a.disabled=!1),o&&(o.disabled=!1);try{let e=JSON.parse(c.responseText);e&&e.verified?(n&&(n.style.width=`100%`,n.style.background=`#10b981`),r&&(r.textContent=e.message||`Verification Passed! Ready to flash.`),a&&(a.style.display=`none`),s&&(s.style.display=`flex`),Q(e.message||`Firmware verified! Choose Keep Settings or Clean Flash.`,`success`)):(n&&(n.style.background=`#ef4444`),r&&(r.textContent=e.message||`Sysupgrade verification failed.`),Q(e.message||`Verification failed. Incompatible image.`,`error`))}catch{r&&(r.textContent=`Invalid server response during verification.`),Q(`Server response error.`,`error`)}},c.onerror=()=>{a&&(a.disabled=!1),o&&(o.disabled=!1),r&&(r.textContent=`Network error during upload.`),Q(`Network error uploading firmware file`,`error`)},c.send(e)}async function Ec(e=!1){if(!await Z(`Are you sure you want to flash this firmware with: ${e?`Clean Factory Install (resets settings)`:`Keep Existing Settings`}?\n\nThe router will write NAND flash and reboot in ~60-90 seconds.`,`Flash Firmware`,`Proceed Flash`,!0))return;let t=document.getElementById(`localFwFlashActions`),n=document.getElementById(`localFwProgressLabel`),r=document.getElementById(`localFwProgressBar`);t&&(t.style.display=`none`),n&&(n.textContent=`Flashing NAND flash memory & rebooting...`),r&&(r.style.width=`100%`,r.style.background=`#f59e0b`),Q(`Sysupgrade flash command sent! Router is writing NAND and rebooting...`,`warning`);try{await p(`/cgi-bin/update?action=flash_uploaded&clean=${+!!e}`);let t=75,r=setInterval(()=>{--t,n&&(n.textContent=`Rebooting gateway... Reconnecting in ${t}s`),t<=0&&(clearInterval(r),location.href=`/?nocache=`+Date.now())},1e3)}catch{Q(`Flash initiated. Waiting for router to come back online...`,`info`)}}function Dc(){Q(`Rebooting Maxnet Gateway...`,`warning`),fetch(`/cgi-bin/restore?action=reboot`,{method:`POST`}).then(()=>{Q(`Reboot command sent. Reconnecting in 15 seconds...`,`info`),setTimeout(()=>location.reload(),15e3)}).catch(()=>Q(`Reboot initiated.`,`info`))}async function Oc(){xc()}async function kc(){hc(pc)}function Ac(){hc(pc)}function jc(){let e={"sae-mixed":`WPA2/WPA3 Mixed`,sae:`WPA3-SAE Only`,psk2:`WPA2-PSK (AES)`,none:`Open (No Security)`},t={HE20:`HE20 (20 MHz)`,HE40:`HE40 (40 MHz)`,HT20:`HT20 (Legacy)`},n={HE160:`HE160 (160 MHz)`,HE80:`HE80 (80 MHz)`,HE40:`HE40 (40 MHz)`,HE20:`HE20 (20 MHz)`},r=document.getElementById(`wifi2gSsid`)?.value||`MAXNET`,i=document.getElementById(`wifi2gEnc`)?.value||`sae-mixed`,a=document.getElementById(`wifi2gKey`)?.value||``,o=document.getElementById(`wifi2gChannel`)?.value||`auto`,s=document.getElementById(`wifi2gHtmode`)?.value||`HE20`,c=document.getElementById(`disp_wifi24_ssid`),l=document.getElementById(`disp_wifi24_enc`),u=document.getElementById(`disp_wifi24_key`),d=document.getElementById(`disp_wifi24_channel`),f=document.getElementById(`disp_wifi24_bandwidth`);c&&(c.textContent=r),l&&(l.textContent=e[i]||i),u&&(u.textContent=i===`none`||!a?`None (Open Network)`:`••••••••`),d&&(d.textContent=o===`auto`?`Auto Select`:`Channel ${o}`),f&&(f.textContent=t[s]||s);let p=document.getElementById(`wifi5gSsid`)?.value||`MAXNET-5G`,m=document.getElementById(`wifi5gEnc`)?.value||`sae-mixed`,h=document.getElementById(`wifi5gKey`)?.value||``,g=document.getElementById(`wifi5gChannel`)?.value||`auto`,_=document.getElementById(`wifi5gHtmode`)?.value||`HE160`,v=document.getElementById(`disp_wifi5_ssid`),y=document.getElementById(`disp_wifi5_enc`),b=document.getElementById(`disp_wifi5_key`),x=document.getElementById(`disp_wifi5_channel`),S=document.getElementById(`disp_wifi5_bandwidth`);v&&(v.textContent=p),y&&(y.textContent=e[m]||m),b&&(b.textContent=m===`none`||!h?`None (Open Network)`:`••••••••`),x&&(x.textContent=g===`auto`?`Auto Select`:`Channel ${g}`),S&&(S.textContent=n[_]||_)}function Mc(e){let t=Number(e);if(!Number.isFinite(t)||t<=0)return null;let n=t<1e11?t*1e3:t,r=new Date(n);return Number.isNaN(r.getTime())?null:r}function Nc(e,t){if(t)try{let n=new Intl.DateTimeFormat(`en-CA`,{timeZone:t,year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,hourCycle:`h23`}).formatToParts(e);return Object.fromEntries(n.filter(e=>e.type!==`literal`).map(e=>[e.type,e.value]))}catch{}return{year:String(e.getFullYear()),month:String(e.getMonth()+1).padStart(2,`0`),day:String(e.getDate()).padStart(2,`0`),hour:String(e.getHours()).padStart(2,`0`),minute:String(e.getMinutes()).padStart(2,`0`)}}function Pc(e){let t=Nc(e,s.zonename);return`${t.year}-${t.month}-${t.day}T${t.hour}:${t.minute}`}function Fc(e,t){let n=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(e||``);if(!n)return NaN;let r=n.slice(1).map(Number),i=Date.UTC(r[0],r[1]-1,r[2],r[3],r[4]);if(!t)return new Date(e).getTime();let a=i;try{let e=new Intl.DateTimeFormat(`en-US`,{timeZone:t,year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,second:`2-digit`,hourCycle:`h23`});for(let t=0;t<3;t++){let t=Object.fromEntries(e.formatToParts(new Date(a)).filter(e=>e.type!==`literal`).map(e=>[e.type,Number(e.value)])),n=Date.UTC(t.year,t.month-1,t.day,t.hour,t.minute,t.second);a+=i-n}return a}catch{return new Date(e).getTime()}}function Ic(){let e=document.getElementById(`systemDateTimeDisplay`),t=document.getElementById(`systemTimezoneDisplay`),n=Mc(s.epoch),r=``;if(n)try{r=n.toLocaleString(void 0,{dateStyle:`medium`,timeStyle:`short`,...s.zonename?{timeZone:s.zonename}:{}})}catch{r=n.toLocaleString(void 0,{dateStyle:`medium`,timeStyle:`short`})}e&&(e.textContent=n?r:`Router time unavailable`),t&&(t.textContent=s.zonename||`Timezone not configured`);let i=document.getElementById(`systemDateTimeInput`),a=document.getElementById(`systemTimezoneInput`),o=document.getElementById(`systemNtpEnabled`),c=Mc(s.epoch);i&&c&&document.activeElement!==i&&(i.value=Pc(c)),a&&document.activeElement!==a&&(a.value=s.zonename||``),o&&(o.checked=!!s.ntp_enabled),zc(``),Kc(s.ntp_servers);let l=document.getElementById(`autoRebootToggle`),u=document.getElementById(`autoRebootTime`),d=document.getElementById(`autoRebootTimeRow`);l&&(l.checked=!!s.auto_reboot_enabled),u&&(u.value=s.auto_reboot_time||``),d&&(d.style.display=s.auto_reboot_enabled?`flex`:`none`)}async function Lc(){try{let e=await p(`/cgi-bin/system_settings?action=get`),t=await e.json();if(!e.ok||t.status!==`ok`)throw Error(t.message||`Unable to load router settings`);s={...s,epoch:t.epoch,timezone:t.timezone||``,zonename:t.zonename||``,ntp_enabled:t.ntp_enabled===!0||t.ntp_enabled===1||t.ntp_enabled===`1`,ntp_servers:Array.isArray(t.ntp_servers)?t.ntp_servers:[],auto_reboot_enabled:t.auto_reboot_enabled===!0||t.auto_reboot_enabled===1||t.auto_reboot_enabled===`1`,auto_reboot_time:String(t.auto_reboot_time||``).slice(0,5)},Ic()}catch(e){let t=document.getElementById(`systemDateTimeDisplay`);t&&t.textContent===`Loading router time...`&&(t.textContent=`Unable to fetch router time`),console.warn(`loadSystemSettings error:`,e)}}function Rc(){let e=window._topoTree;if(!e)return`<option value="">Topology is still loading</option>`;let t=lr(e).flatMap(({node:e,depth:t})=>!e||e.type===`device`?[]:(e.ports||[]).filter(e=>e.role===`empty`&&!e.child).map(n=>({id:n.id,label:`${e.name||(e.id===`root`?`Main router`:`Network device`)} · ${n.label||`LAN port`} · layer ${t}`})));return t.length?t.map(e=>`<option value="${$(e.id)}">${$(e.label)}</option>`).join(``):`<option value="">No free LAN ports available</option>`}function zc(e=``){let t=document.getElementById(`systemTimezoneOptions`);if(!t)return;let n=String(e||``).trim().toLowerCase(),r=typeof Intl.supportedValuesOf==`function`?Intl.supportedValuesOf(`timeZone`):[],i=Array.from(new Set([...l.map(([e])=>e),...r])).filter(e=>!n||e.toLowerCase().includes(n));if(t.replaceChildren(),i.forEach(e=>{let n=document.createElement(`button`);n.type=`button`,n.className=`system-timezone-option`,n.textContent=e,n.addEventListener(`click`,()=>Wc(e)),t.appendChild(n)}),!i.length){let e=document.createElement(`div`);e.className=`system-timezone-empty`,e.textContent=`No matching common timezones`,t.appendChild(e)}}function Bc(){document.getElementById(`systemNtpEnabled`)?.checked?typeof Q==`function`&&Q(`Automatic time sync is enabled. Turn it off to set the date and time manually.`,`info`):ji(`system_date`)}function Vc(){ji(`system_timezone`)}function Hc(e){let t=document.getElementById(`settingEditModalOverlay`);e===!1?t?.style.display===`flex`&&J===`system_timezone`&&Fi():Vc()}function Uc(e){zc(e)}function Wc(e){let t=document.getElementById(`systemTimezoneInput`),n=document.getElementById(`systemDateTimeInput`),r=document.getElementById(`systemTimezoneDisplay`);t&&(t.value=e),r&&(r.textContent=e);let i=Mc(s.epoch);if(n&&i){let t=Nc(i,e);n.value=`${t.year}-${t.month}-${t.day}T${t.hour}:${t.minute}`}}function Gc(){Vc()}function Kc(e){let t=document.getElementById(`systemNtpServersList`);t&&(t.replaceChildren(),(Array.isArray(e)?e:[]).slice(0,8).forEach(e=>Jc(e,!1)))}async function qc(){let e=Array.from(document.querySelectorAll(`#systemNtpServersList .system-ntp-value`)).map(e=>e.textContent.trim()).filter(Boolean);Kc(c),await Yc()?typeof Q==`function`&&Q(`Default NTP servers restored`,`success`):Kc(e)}function Jc(e=``,t=!0){let n=document.getElementById(`systemNtpServersList`);if(!n)return;if(n.children.length>=8){t&&typeof Q==`function`&&Q(`You can add up to 8 NTP servers`,`info`);return}let r=document.createElement(`div`);r.className=`system-ntp-row`;let i=document.createElement(`span`);i.className=`system-ntp-value`,i.textContent=String(e||``);let a=document.createElement(`button`);a.type=`button`,a.className=`round-action-btn system-ntp-remove`,a.title=`Remove NTP server`,a.setAttribute(`aria-label`,`Remove NTP server`),a.innerHTML=`<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,a.addEventListener(`click`,async()=>{r.remove(),await Yc()||n.appendChild(r)}),r.append(i,a),n.appendChild(r)}async function Yc(){let e=!!document.getElementById(`systemNtpEnabled`)?.checked,t=Array.from(document.querySelectorAll(`#systemNtpServersList .system-ntp-value`)).map(e=>e.textContent.trim()).filter(Boolean),n=(document.getElementById(`systemTimezoneInput`)?.value||``).trim(),r=l.find(([e])=>e===n),i=r?r[1]:`:${n}`,a=Fc(document.getElementById(`systemDateTimeInput`)?.value||``,n);if(!Number.isFinite(a))return typeof Q==`function`&&Q(`Enter a valid router date and time`,`error`),!1;if(!n)return typeof Q==`function`&&Q(`Enter or select an installed timezone name`,`error`),!1;let o=Math.floor(a/1e3);try{let r=await p(`/cgi-bin/system_settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_time`,epoch:o,timezone:i,zonename:n,ntp_enabled:e,ntp_servers:t})}),a=await r.json();if(!r.ok||a.status&&a.status!==`ok`)throw Error(a.message||`Unable to update router date/time`);return typeof Q==`function`&&Q(`Router date/time settings saved`,`success`),await Lc(),!0}catch(e){return typeof Q==`function`&&Q(e.message||`Unable to update router date/time`,`error`),!1}}async function Xc(e,t){try{let n=await p(`/cgi-bin/system_settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_auto_reboot`,enabled:!!e,time:t||``})}),r=await n.json();if(!n.ok||r.status&&r.status!==`ok`)throw Error(r.message||`Unable to save auto reboot setting`);s.auto_reboot_enabled=!!e,s.auto_reboot_time=t||``,Ic(),typeof Q==`function`&&Q(e?`Scheduled reboot set for ${t}`:`Scheduled auto reboot disabled`,`success`)}catch(e){Ic(),typeof Q==`function`&&Q(e.message||`Unable to save auto reboot setting`,`error`)}}function Zc(e){let t=document.getElementById(`autoRebootTimeRow`),n=document.getElementById(`autoRebootTime`);t&&(t.style.display=e?`flex`:`none`),e&&!n?.value?(typeof Q==`function`&&Q(`Choose a reboot time to enable the schedule`,`info`),n?.focus()):Xc(e,e?n.value:s.auto_reboot_time)}function Qc(e){document.getElementById(`autoRebootToggle`)?.checked&&(/^([01]\d|2[0-3]):[0-5]\d$/.test(e||``)?Xc(!0,e):typeof Q==`function`&&Q(`Choose a valid reboot time`,`error`))}async function $c(){try{let e=await(await p(`/cgi-bin/wifi?action=get`)).json();if(!e||e.status!==`ok`)return;let t=document.getElementById(`wifiMasterToggle`);t&&(t.checked=e.master_enabled===1);let n=document.getElementById(`wifi2gEnable`),r=document.getElementById(`wifi2gSsid`),i=document.getElementById(`wifi2gEnc`),a=document.getElementById(`wifi2gKey`),o=document.getElementById(`wifi2gChannel`),s=document.getElementById(`wifi2gHtmode`),c=document.getElementById(`wifi2gHidden`);n&&e.radio_2g&&(n.checked=e.radio_2g.enabled===1),r&&e.radio_2g&&(r.value=e.radio_2g.ssid||`MAXNET`),i&&e.radio_2g&&(i.value=e.radio_2g.encryption||`none`),a&&e.radio_2g&&(a.value=e.radio_2g.key||``),o&&e.radio_2g&&(o.value=e.radio_2g.channel||`1`),s&&e.radio_2g&&(s.value=e.radio_2g.htmode||`HE20`),c&&e.radio_2g&&(c.checked=e.radio_2g.hidden===1);let l=document.getElementById(`wifi5gEnable`),u=document.getElementById(`wifi5gSsid`),d=document.getElementById(`wifi5gEnc`),f=document.getElementById(`wifi5gKey`),m=document.getElementById(`wifi5gChannel`),h=document.getElementById(`wifi5gHtmode`),g=document.getElementById(`wifi5gHidden`);l&&e.radio_5g&&(l.checked=e.radio_5g.enabled===1),u&&e.radio_5g&&(u.value=e.radio_5g.ssid||`MAXNET-5G`),d&&e.radio_5g&&(d.value=e.radio_5g.encryption||`none`),f&&e.radio_5g&&(f.value=e.radio_5g.key||``),m&&e.radio_5g&&(m.value=e.radio_5g.channel||`36`),h&&e.radio_5g&&(h.value=e.radio_5g.htmode||`HE80`),g&&e.radio_5g&&(g.checked=e.radio_5g.hidden===1),jc(),Ol(Tl(e)),el()}catch(e){console.warn(`fetchWifiConfig error:`,e)}}async function el(){try{let e=await(await p(`/cgi-bin/wifi_scan?action=status`)).json();if(e&&e.client_wan){let t=e.client_wan.status===`connected`,n=document.getElementById(`wifiWanStatusBadge`),r=document.getElementById(`wifiActiveWanInfo`);if(n&&(n.textContent=t?`CONNECTED`:`OFFLINE`,n.className=t?`setting-pill pill-green`:`setting-pill pill-cyan`),r){if(t){r.style.display=`flex`;let t=document.getElementById(`wifiActiveWanSsid`),n=document.getElementById(`wifiActiveWanIp`);t&&(t.textContent=e.client_wan.ssid||`--`),n&&(n.textContent=e.client_wan.ip||`--`)}else r.style.display=`none`}}}catch{}}var tl=!1;async function nl(){if(tl)return;tl=!0;let e=document.getElementById(`btnScanWifi`),t=document.getElementById(`wifiScanResults`),n=document.getElementById(`wifiWanStatusBadge`),r=document.getElementById(`wifiActiveWanInfo`);e&&(e.disabled=!0,e.innerHTML=`<span class="m-spinner" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></span> Scanning...`),t&&(t.style.display=`flex`,t.innerHTML=`<div style="padding:14px; text-align:center; color:var(--text-dim); font-size:11px;">Scanning 2.4 GHz &amp; 5 GHz airwaves for nearby Wi-Fi networks...</div>`);try{let e=await(await p(`/cgi-bin/wifi_scan?action=scan`)).json();if(e.status!==`ok`)throw Error(e.message||`Unable to scan for Wi-Fi networks`);if(e.client_wan){let t=e.client_wan.status===`connected`;if(n&&(n.textContent=t?`CONNECTED`:`OFFLINE`,n.className=t?`setting-pill pill-green`:`setting-pill pill-cyan`),r){if(t){r.style.display=`flex`;let t=document.getElementById(`wifiActiveWanSsid`),n=document.getElementById(`wifiActiveWanIp`);t&&(t.textContent=e.client_wan.ssid||`--`),n&&(n.textContent=e.client_wan.ip||`--`)}else r.style.display=`none`}}let i=e.networks||[];if(!t)return;if(i.length===0){t.innerHTML=`<div style="padding:14px; text-align:center; color:var(--text-muted); font-size:11.5px;">No wireless networks detected nearby. Try clicking Scan again.</div>`;return}t.innerHTML=i.map(e=>{let t=parseInt(e.signal_dbm)||-80,n=`#10b981`,r=`Strong`;t<-75?(n=`#ef4444`,r=`Weak`):t<-65&&(n=`#f59e0b`,r=`Fair`);let i=e.encryption&&!e.encryption.toLowerCase().includes(`none`)&&!e.encryption.toLowerCase().includes(`open`),a=i?e.encryption.includes(`WPA3`)?`WPA3`:`WPA2`:`OPEN`,o=i?`#38bdf8`:`#10b981`,s=$(e.ssid||`Hidden Network`),c=(e.ssid||``).replace(/'/g,`\\'`);return`
            <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.025); border:1px solid var(--border-sub, rgba(255,255,255,0.07)); border-radius:8px; padding:10px 14px; gap:10px;">
              <div style="display:flex; align-items:center; gap:10px; min-width:0;">
                <div style="color:${n}; display:flex; align-items:center;">
                  <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
                </div>
                <div style="min-width:0;">
                  <div style="font-family:var(--font-mono); font-size:12px; font-weight:700; color:var(--text-main); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    ${s}
                  </div>
                  <div style="font-size:10px; color:var(--text-dim); display:flex; gap:8px; align-items:center;">
                    <span>Ch ${e.channel||`1`} (${e.band||`2.4GHz`})</span>
                    <span style="color:${n};">${t} dBm (${r})</span>
                    <span style="font-size:9px; padding:1px 4px; border-radius:3px; background:rgba(255,255,255,0.05); color:${o}; border:1px solid rgba(255,255,255,0.08);">${a}</span>
                  </div>
                </div>
              </div>
              <div>
                <button type="button" class="mh-btn btn-sm btn-outline" onclick="connectToWifiNetwork('${c}', '${i?`psk2`:`none`}')" style="font-size:11px; padding:4px 10px; border-radius:6px;">Connect</button>
              </div>
            </div>
          `}).join(``)}catch(e){t&&(t.innerHTML=`<div style="padding:14px; text-align:center; color:#ef4444; font-size:11px;">Wi-Fi Scan failed: ${$(e.message)}</div>`)}finally{tl=!1,e&&(e.disabled=!1,e.innerHTML=`<svg viewBox="0 0 24 24" style="width:13px; height:13px; fill:none; stroke:currentColor; stroke-width:2; margin-right:4px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Scan Wi-Fi`)}}async function rl(e,t){if(!e)return;let n=``;if(t!==`none`){if(n=await fc(`Enter password for Wi-Fi network "${e}":`,``,`Wi-Fi Password`),n===null)return;if(n.length<8){Q(`Wi-Fi password must be at least 8 characters`,`error`);return}}Q(`Connecting to ${e} as Wi-Fi WAN uplink...`,`info`);try{let r=await(await p(`/cgi-bin/wifi_connect`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`connect`,ssid:e,key:n,encryption:t})})).json();r&&r.status===`ok`?(Q(`Connecting to ${e}... Network interface initializing.`,`success`),setTimeout(nl,3500)):Q(r?.message||`Failed to connect to Wi-Fi network`,`error`)}catch(e){Q(`Connection request error: `+e.message,`error`)}}async function il(){if(await Z(`Disconnect from current Wi-Fi WAN uplink?`,`Disconnect Wi-Fi`,`Disconnect`,!0)){Q(`Disconnecting Wi-Fi WAN...`,`info`);try{let e=await(await p(`/cgi-bin/wifi_connect`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`disconnect`})})).json();e&&e.status===`ok`?(Q(`Wi-Fi WAN disconnected`,`success`),setTimeout(nl,1500)):Q(e?.message||`Disconnect failed`,`error`)}catch(e){Q(`Disconnect error: `+e.message,`error`)}}}var al=[],ol=`dhcp`,sl=!1,cl=!1,ll=0;function ul(e){cl=!!e;let t=document.getElementById(`repeaterEnabledToggle`),n=document.getElementById(`repeaterScanControls`);t&&(t.checked=cl),n&&(n.style.display=cl?`block`:`none`)}async function dl(e){let t=document.getElementById(`repeaterEnabledToggle`),n=cl,r=++ll;t&&(t.disabled=!0);try{let t=await p(`/cgi-bin/system_settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_repeater_enabled`,enabled:!!e})}),n=await t.json();if(!t.ok||n.status!==`ok`)throw Error(n.message||`Unable to save repeater setting`);r===ll&&ul(!!e),typeof Q==`function`&&Q(e?`Wireless repeater controls enabled`:`Wireless repeater scan controls disabled`,`success`),e&&setTimeout(pl,0)}catch(e){r===ll&&ul(n),typeof Q==`function`&&Q(e.message||`Unable to save repeater setting`,`error`)}finally{t&&(t.disabled=!1)}}async function fl(){let e=ll;try{let t=await p(`/cgi-bin/wifi_scan?action=status`),n=await t.json();if(!t.ok||n.status!==`ok`)throw Error(n.message||`Unable to load repeater status`);e===ll&&ul(n.repeater_enabled===!0||n.repeater_enabled===1||n.repeater_enabled===`1`);let r=document.getElementById(`repeaterStatusBadge`),i=document.getElementById(`repeaterActiveCard`),a=document.getElementById(`repeaterConnectedSsid`),o=document.getElementById(`repeaterConnectedInfo`);if(n&&n.client_wan){let e=n.client_wan.status===`connected`;r&&(r.textContent=e?`CONNECTED`:n.client_wan.status===`connecting`?`CONNECTING`:`DISCONNECTED`,r.className=e?`card-badge emerald`:`card-badge sky`),i&&(e||n.client_wan.status===`connecting`?(i.style.display=`block`,a&&(a.textContent=n.client_wan.ssid||`--`),o&&(o.textContent=`IP: ${n.client_wan.ip||`Awaiting IP`} • Proto: ${(n.client_wan.proto||`dhcp`).toUpperCase()} • Radio: ${n.client_wan.device||`Auto`}`)):i.style.display=`none`)}}catch(e){console.warn(`fetchRepeaterStatus error:`,e)}}async function pl(){if(!cl){typeof Q==`function`&&Q(`Enable wireless repeater controls before scanning`,`info`);return}if(sl)return;sl=!0;let e=document.getElementById(`btnScanRepeater`),t=document.getElementById(`repeaterScanSub`),n=document.getElementById(`repeaterScanResultsList`);e&&e.classList.add(`btn-scanning`),t&&(t.textContent=`Searching nearby 2.4 GHz & 5 GHz access points...`),n&&(n.innerHTML=`<div style="padding:20px; text-align:center; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);"><span class="m-spinner" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"></span> Scanning dual-band airwaves...</div>`);try{let e=await p(`/cgi-bin/wifi_scan?action=scan&source=repeater`),t=await e.json();if(!e.ok||t.status!==`ok`)throw Error(t.message||`Unable to scan for Wi-Fi networks`);if(fl(),al=t.networks||[],!n)return;if(al.length===0){n.innerHTML=`<div style="padding:16px; text-align:center; color:var(--text-muted); font-size:12px;">No visible networks found.</div><button type="button" class="setting-row-item repeater-hidden-network-action" onclick="openRepeaterHiddenNetworkModal()"><span>Connect to a hidden Wi-Fi network</span><span aria-hidden="true">›</span></button>`;return}al.sort((e,t)=>(parseInt(t.signal_dbm)||-100)-(parseInt(e.signal_dbm)||-100)),n.innerHTML=al.map((e,t)=>{let n=parseInt(e.signal_dbm)||-80,r=`#10b981`;n<-75?r=`#ef4444`:n<-65&&(r=`#f59e0b`);let i=e.band||(e.freq>4e3?`5GHz`:`2.4GHz`);return`
            <div class="setting-row-item" style="padding:10px 14px; border-bottom:1px solid var(--border-sub); display:flex; align-items:center; justify-content:space-between;">
              <div class="setting-label-col" style="min-width:0;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="${i===`5GHz`?`card-badge cyan`:`card-badge emerald`}" style="font-size:9px; font-weight:800; flex-shrink:0;">${i}</span>
                  <span class="setting-label-bold" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${$(e.ssid||`Hidden Network`)}</span>
                </div>
                <span class="setting-label-sub" style="margin-top:2px; font-size:11px;">
                  Ch ${e.channel||`--`} &bull; <span style="color:${r}; font-weight:600;">${n} dBm</span> &bull; ${$(e.encryption||`Open`)}
                </span>
              </div>
              <div class="setting-control-col" style="flex-shrink:0;">
                <button type="button" class="mh-btn btn-sm" onclick="openRepeaterConnectModal(${t})" style="padding:5px 12px; font-size:11px; font-weight:700;">CONNECT</button>
              </div>
            </div>
          `}).join(``)+`<button type="button" class="setting-row-item repeater-hidden-network-action" onclick="openRepeaterHiddenNetworkModal()"><span>Connect to a hidden Wi-Fi network</span><span aria-hidden="true">›</span></button>`}catch(e){n&&(n.innerHTML=`<div style="padding:20px; text-align:center; color:#ef4444; font-size:12px;">Scan failed: ${$(e.message)}</div>`)}finally{sl=!1,e&&e.classList.remove(`btn-scanning`),t&&(t.textContent=`Scan starts when repeater is enabled; choose a hotspot to connect`)}}function ml(e){let t=e&&typeof e==`object`?e:al[e]||{},n=t.hidden===!0,r=document.getElementById(`repeaterConnectModalOverlay`);if(!r)return;let i=document.getElementById(`repModalSsidTitle`),a=document.getElementById(`repTargetSsid`),o=document.getElementById(`repHiddenBssid`),s=document.getElementById(`repHiddenBand`),c=document.getElementById(`repHiddenChannel`),l=document.getElementById(`repHiddenEnc`),u=document.getElementById(`repTargetKey`),d=document.getElementById(`repKeyGroup`),f=document.getElementById(`repTargetRadio`),p=document.getElementById(`repHiddenNetwork`),m=document.getElementById(`repCustomBssid`),h=document.getElementById(`repManualEncryptionGroup`),g=document.getElementById(`repManualEncryption`),_=t.encryption||(n?`WPA2/WPA3 PSK`:``);i&&(i.textContent=`Connect to ${t.ssid||(n?`Hidden Wi-Fi`:`Wi-Fi Uplink`)}`),a&&(a.value=t.ssid||``,a.readOnly=!n,a.placeholder=n?`Enter the exact hidden SSID`:`Network Name`),o&&(o.value=t.bssid||``),s&&(s.value=t.band||``),c&&(c.value=t.channel||``),l&&(l.value=_),p&&(p.value=n?`1`:`0`),m&&(m.value=``),u&&(u.value=``),h&&(h.style.display=n?`block`:`none`),g&&(g.value=`sae-mixed`);let v=_&&!_.toLowerCase().includes(`none`)&&!_.toLowerCase().includes(`open`);d&&(d.style.display=v?`block`:`none`),f&&(f.value=t.band===`5GHz`?`radio1`:t.band===`2.4GHz`?`radio0`:`auto`);let y=document.getElementById(`repTargetRadio`)?.closest(`.mh-form-group`);y&&(y.style.display=n?`block`:`none`);let b=document.getElementById(`repAdvancedPanel`),x=document.getElementById(`btnToggleRepAdv`);b&&(b.style.display=`none`),x&&(x.textContent=`SHOW ADVANCED UPLINK PARAMETERS`),gl(`dhcp`),r.style.display=`flex`,requestAnimationFrame(()=>r.classList.add(`active`))}function hl(){let e=document.getElementById(`repeaterConnectModalOverlay`);e&&(e.classList.remove(`active`),e.style.display=`none`)}function gl(e){ol=e;let t=document.getElementById(`btnRepProtoDhcp`),n=document.getElementById(`btnRepProtoStatic`),r=document.getElementById(`repStaticFieldsPanel`);e===`static`?(n&&(n.className=`tri-btn active`),t&&(t.className=`tri-btn`),r&&(r.style.display=`flex`)):(t&&(t.className=`tri-btn active`),n&&(n.className=`tri-btn`),r&&(r.style.display=`none`))}function _l(){let e=document.getElementById(`repAdvancedPanel`),t=document.getElementById(`btnToggleRepAdv`);if(!e)return;let n=e.style.display===`flex`;e.style.display=n?`none`:`flex`,t&&(t.textContent=n?`SHOW ADVANCED UPLINK PARAMETERS`:`HIDE ADVANCED PARAMETERS`)}async function vl(){let e=(document.getElementById(`repTargetSsid`)?.value||``).trim(),t=(document.getElementById(`repTargetKey`)?.value||``).trim(),n=(document.getElementById(`repHiddenBssid`)?.value||``).trim(),r=(document.getElementById(`repHiddenBand`)?.value||``).trim(),i=(document.getElementById(`repHiddenChannel`)?.value||``).trim(),a=(document.getElementById(`repHiddenEnc`)?.value||``).trim(),o=document.getElementById(`repTargetRadio`)?.value||`auto`,s=(document.getElementById(`repCustomMac`)?.value||``).trim(),c=(document.getElementById(`repCustomBssid`)?.value||``).trim(),l=document.getElementById(`repHiddenNetwork`)?.value===`1`,u=document.getElementById(`repManualEncryption`)?.value||`psk2`,d=(document.getElementById(`repCustomMtu`)?.value||``).trim(),f=(document.getElementById(`repCustomMetric`)?.value||`20`).trim();if(!e||e.length>32){Q(`Enter a Wi-Fi name between 1 and 32 characters`,`error`);return}if(s&&!zi(s)){Q(`Enter a valid custom radio MAC address`,`error`);return}if(c&&!zi(c)){Q(`Enter a valid access point BSSID`,`error`);return}if(d&&(!/^\d+$/.test(d)||Number(d)<576||Number(d)>1500)){Q(`MTU must be between 576 and 1500`,`error`);return}if(!/^\d+$/.test(f)||Number(f)<1||Number(f)>255){Q(`Route metric must be between 1 and 255`,`error`);return}let m={action:`connect`,ssid:e,key:t,encryption:l?u:a,hidden:l,proto:ol,device:o,band:r,channel:i,bssid:c||n||void 0,macaddr:s||void 0,mtu:d||void 0,metric:f||`20`};if(ol===`static`){let e=(document.getElementById(`repStaticIp`)?.value||``).trim(),t=(document.getElementById(`repStaticNetmask`)?.value||`255.255.255.0`).trim(),n=(document.getElementById(`repStaticGateway`)?.value||``).trim(),r=(document.getElementById(`repStaticDns`)?.value||``).trim();if(!e||!n){Q(`IP Address and Gateway are required for Static mode`,`error`);return}if(!Li(e)||!Li(n)||!Ri(t)){Q(`Enter valid static IP, gateway, and subnet mask values`,`error`);return}if(r&&!r.split(/\s+/).every(Li)){Q(`Enter valid DNS IPv4 addresses separated by spaces`,`error`);return}m.ipaddr=e,m.netmask=t,m.gateway=n,m.dns=r}Q(`Connecting to ${e}...`,`info`),hl();try{let e=await(await p(`/cgi-bin/wifi_connect`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(m)})).json();e&&e.status===`ok`?(Q(e.message||`Connecting to uplink...`,`success`),setTimeout(fl,3500)):Q(e?.message||`Connection failed`,`error`)}catch(e){Q(`Connect error: `+e.message,`error`)}}async function yl(){if(await Z(`Disconnect active Wi-Fi WAN repeater uplink?`,`Disconnect Uplink`,`Disconnect`,!0)){Q(`Disconnecting uplink...`,`info`);try{Q((await(await p(`/cgi-bin/wifi_connect`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`disconnect`})})).json()).message||`Uplink disconnected`,`success`),setTimeout(fl,2e3)}catch(e){Q(`Disconnect error: `+e.message,`error`)}}}async function bl(){try{let e=await(await fetch(`/cgi-bin/hardware_gestures?action=get`)).json();if(!e||e.status!==`ok`)return;let t=document.getElementById(`hwLedAutoToggle`);t&&(t.checked=e.led_auto!==!1);let n=document.getElementById(`ledStatusBadge`);n&&(n.textContent=e.led_auto===!1?`MANUAL`:`AUTOMATIC`);let r=document.getElementById(`disp_reset_press_10s`);if(r){let t=e.reset_gestures?.press_10s||`factory_reset`;r.textContent=t===`factory_reset`?`Factory Reset (Permanent wipe and restore defaults)`:t===`reboot`?`Reboot Gateway`:`Disabled`}let i=document.getElementById(`disp_reset_single_click`);if(i){let t=e.reset_gestures?.single_click||`reboot`;i.textContent=t===`reboot`?`Reboot Gateway`:t===`wifi_toggle`?`Toggle Wi-Fi Radios (On/Off)`:`Disabled`}let a=document.getElementById(`disp_reset_triple_click`);if(a){let t=e.reset_gestures?.triple_click||`wifi_toggle`;a.textContent=t===`wifi_toggle`?`Toggle Wi-Fi Radios (On/Off)`:t===`reboot`?`Reboot Gateway`:`Disabled`}let o=document.getElementById(`disp_dhcp_retention_days`),s=e.dhcp_history?.retention_days||30;o&&(o.textContent=`${s} Days (${s===30?`1 Month`:Math.round(s/30)+` Months`}) • Compact Flash Footprint`);let c=document.getElementById(`dispHwDhcpDevCount`);c&&(c.textContent=`${e.dhcp_tracked_count||0} Devices Recorded over past ${s} days`)}catch(e){console.warn(`fetchHwGesturesConfig error:`,e)}}async function xl(e){try{await(await fetch(`/cgi-bin/hardware_gestures`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_led`,led_auto:e})})).json(),Q(e?`Intelligent LED automation enabled`:`Manual LED mode enabled`,`success`),bl()}catch(e){Q(`LED config error: `+e.message,`error`)}}async function Sl(){let e=document.getElementById(`dhcpHistoryModalOverlay`),t=document.getElementById(`dhcpHistoryModalList`);if(e&&t){t.innerHTML=`<div style="padding:20px; text-align:center; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);"><span class="m-spinner" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"></span> Reading DHCP history ledger...</div>`,e.style.display=`flex`,requestAnimationFrame(()=>e.classList.add(`active`));try{let e=(await(await fetch(`/cgi-bin/hardware_gestures?action=get_dhcp_history`)).json()).devices||{},n=Object.keys(e);if(n.length===0){t.innerHTML=`<div style="padding:20px; text-align:center; color:var(--text-muted); font-size:12px;">No historical devices recorded in past retention cycle.</div>`;return}n.sort((t,n)=>(e[n].total_bytes||0)-(e[t].total_bytes||0)),t.innerHTML=n.map(t=>{let n=e[t],r=n.name||`Network Client`,i=n.ip||`--`,a=n.total_mb||`0.00`,o=n.first_seen?new Date(n.first_seen*1e3).toLocaleDateString():`--`,s=n.last_seen?new Date(n.last_seen*1e3).toLocaleDateString():`--`;return`
            <div class="setting-row-item" style="padding:10px 12px; border-bottom:1px solid var(--border-sub); display:flex; align-items:center; justify-content:space-between; gap:10px;">
              <div style="flex:1; min-width:0;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="setting-label-bold" style="font-size:12.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${$(r)}</span>
                  <span class="card-badge sky" style="font-size:9px; font-weight:700;">${$(i)}</span>
                </div>
                <div class="setting-label-sub" style="font-size:10.5px; margin-top:2px;">
                  MAC: ${t} &bull; First: ${o} &bull; Last: ${s}
                </div>
              </div>
              <div style="text-align:right; flex-shrink:0;">
                <span style="font-size:12px; font-weight:800; font-family:var(--font-mono); color:#10b981;">${a} MB</span>
              </div>
            </div>
          `}).join(``)}catch(e){t.innerHTML=`<div style="padding:20px; text-align:center; color:#ef4444; font-size:12px;">Failed to load history: ${$(e.message)}</div>`}}}function Cl(){let e=document.getElementById(`dhcpHistoryModalOverlay`);e&&(e.classList.remove(`active`),e.style.display=`none`)}async function wl(){if(await Z(`Clear all historical offline DHCP records and reset consumption counters?`,`Reset Ledger`,`Reset`,!0))try{await fetch(`/cgi-bin/hardware_gestures?action=clear_dhcp_history`),Q(`DHCP history ledger reset`,`success`),Sl(),bl()}catch{Q(`Error resetting ledger`,`error`)}}document.addEventListener(`touchstart`,e=>{let t=e.target.closest(`.round-action-btn, .mh-btn, .tri-btn`);t&&t.classList.add(`touch-active`)},{passive:!0}),document.addEventListener(`touchend`,e=>{let t=e.target.closest(`.round-action-btn, .mh-btn, .tri-btn`);t&&t.classList.remove(`touch-active`)},{passive:!0});function Tl(e){let t=[e?.clients,e?.stations,e?.wifi_clients,e?.data?.clients,e?.data?.stations].filter(Array.isArray);return t.find(e=>e.length>0)||t[0]||[]}async function El(){let e=document.getElementById(`wifiClientsContainer`);e&&(e.innerHTML=`<div style="text-align:center; color:var(--text-dim); padding:24px; font-size:12px;">Loading Wi-Fi stations...</div>`);try{let e=await p(`/cgi-bin/wifi?action=get`),t=await e.json();if(!e.ok||t.status&&t.status!==`ok`)throw Error(t.message||`Unable to load Wi-Fi stations`);Ol(Tl(t))}catch(t){e&&(e.innerHTML=`<div style="text-align:center; color:#ef4444; padding:20px; font-size:12px;">${$(t.message||`Unable to load Wi-Fi stations.`)}</div>`)}}async function Dl(e,t,n){let r=String(t||``).trim().toUpperCase();if(!/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(r)){typeof Q==`function`&&Q(`Invalid Wi-Fi station MAC address`,`error`);return}let i=e===`client_block`?{action:e,mac:r,blocked:!!n}:{action:`client_kick`,mac:r};try{let t=await p(`/cgi-bin/wifi`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(i)}),r=await t.json();if(!t.ok||r.status&&r.status!==`ok`)throw Error(r.message||`Wi-Fi client action failed`);typeof Q==`function`&&Q(e===`client_kick`?`Wi-Fi station disconnected`:n?`Wi-Fi access blocked for station`:`Wi-Fi block removed`,`success`),await El()}catch(e){typeof Q==`function`&&Q(e.message||`Wi-Fi client action failed`,`error`)}}function Ol(e){let t=document.getElementById(`wifiClientsContainer`);if(!t)return;let n=Array.isArray(e)?e:[],r=document.getElementById(`wifiClientCount`);r&&(r.textContent=`${n.length} CLIENT${n.length===1?``:`S`}`),t.innerHTML=n.length===0?`<div style="text-align:center; color:var(--text-dim); padding:24px; font-size:12px;">No Wi-Fi stations are currently reported.</div>`:n.map(e=>{let t=String(e.mac||e.mac_address||e.macaddr||e.address||``).trim().toUpperCase(),n=/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(t),r=e.blocked===!0||e.blocked===1||e.blocked===`1`,i=e.connected===!0||e.connected===1||e.connected===`1`,a=e.hostname||e.name||e.device||`Wi-Fi station`,o=e.ip||e.ip_address||``,s=e.band||e.radio||e.frequency||`Wi-Fi`,c=e.signal??e.signal_dbm??e.rssi,l=c==null||c===``?`Signal unavailable`:`${$(c)} dBm`,u=e.tx_mbps??e.tx_rate??e.txrate,d=$(t||`Unknown MAC`),f=n?`'${t}'`:`''`;return`
          <div class="setting-row-item" style="display:flex; align-items:center; gap:12px; padding:11px 14px;">
            <div style="display:flex; align-items:center; justify-content:center; width:18px; min-width:18px;"><span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:${r?`#ef4444`:`#10b981`}; box-shadow:0 0 7px ${r?`rgba(239,68,68,.4)`:`rgba(16,185,129,.4)`};"></span></div>
            <div class="setting-label-col" style="flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;">
              <div class="setting-label-bold" style="font-size:13px;">${$(a)} ${r?`<span class="card-badge ruby" style="font-size:9px;">BLOCKED</span>`:``}</div>
              <div style="font-size:12px; font-family:var(--font-mono); color:var(--text-muted);">${d}${o?` · ${$(o)}`:``}</div>
              <div style="font-size:10.5px; color:var(--text-dim);">${$(s)} · ${l}${u!=null&&u!==``?` · ${$(u)} Mbps`:``}</div>
            </div>
            <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px; flex-wrap:wrap;">
              ${n?`${i?`<button type="button" class="mh-btn btn-ghost" onclick="wifiClientAction('client_kick', ${f})" style="padding:5px 8px; font-size:10px;">KICK</button>`:``}
              <button type="button" class="mh-btn ${r?`btn-primary`:`btn-ghost`}" onclick="wifiClientAction('client_block', ${f}, ${!r})" style="padding:5px 8px; font-size:10px; color:${r?``:`#ef4444`};">${r?`UNBLOCK`:`BLOCK`}</button>`:`<span style="font-size:10px;color:var(--text-dim);">MAC unavailable</span>`}
            </div>
          </div>
        `}).join(``)}async function kl(){try{let e={master_enabled:+!!document.getElementById(`wifiMasterToggle`)?.checked,enable_2g:+!!document.getElementById(`wifi2gEnable`)?.checked,ssid_2g:document.getElementById(`wifi2gSsid`)?.value||`MAXNET`,enc_2g:document.getElementById(`wifi2gEnc`)?.value||`none`,key_2g:document.getElementById(`wifi2gKey`)?.value||``,channel_2g:document.getElementById(`wifi2gChannel`)?.value||`1`,htmode_2g:document.getElementById(`wifi2gHtmode`)?.value||`HE20`,hidden_2g:+!!document.getElementById(`wifi2gHidden`)?.checked,enable_5g:+!!document.getElementById(`wifi5gEnable`)?.checked,ssid_5g:document.getElementById(`wifi5gSsid`)?.value||`MAXNET-5G`,enc_5g:document.getElementById(`wifi5gEnc`)?.value||`none`,key_5g:document.getElementById(`wifi5gKey`)?.value||``,channel_5g:document.getElementById(`wifi5gChannel`)?.value||`36`,htmode_5g:document.getElementById(`wifi5gHtmode`)?.value||`HE80`,hidden_5g:+!!document.getElementById(`wifi5gHidden`)?.checked};Q(`Applying Wi-Fi settings to wireless radios...`,`info`);let t=await(await p(`/cgi-bin/wifi?action=set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)})).json();t&&t.status===`ok`?(Q(`Wi-Fi settings applied successfully!`,`success`),setTimeout($c,1500)):Q(t?.message||`Failed to apply Wi-Fi settings`,`error`)}catch(e){Q(`Error saving Wi-Fi settings: `+e.message,`error`)}}function Al(e){let t={master_enabled:+!!e};Q(e?`Enabling Wi-Fi transmitters...`:`Disabling Wi-Fi transmitters...`,`info`),p(`/cgi-bin/wifi?action=set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}).then(()=>{Q(e?`Wi-Fi radios active`:`Wi-Fi radios disabled (DMA memory reclaimed)`,`success`),setTimeout($c,1e3)}).catch(e=>{Q(`Failed to toggle master Wi-Fi: `+e.message,`error`)})}function jl(e,t){let n=document.getElementById(e);if(!n)return;let r=n.type===`password`;n.type=r?`text`:`password`;let i=t||(typeof event<`u`&&event?event.currentTarget:null);i&&(r?(i.innerHTML=`<svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,i.style.color=`#10b981`,i.setAttribute(`title`,`Hide password`)):(i.innerHTML=`<svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,i.style.color=`var(--text-dim)`,i.setAttribute(`title`,`Show password`)))}function Ml(){let e=document.getElementById(`modalRamBootBox`);e&&(e.style.display=e.style.display===`none`||!e.style.display?`flex`:`none`)}function Nl(){hc(pc);let e=document.getElementById(`modalRamBootBox`);e&&(e.style.display=`flex`)}function Pl(e){e&&(navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(e).then(()=>{Q(`Copied to clipboard!`,`success`)}).catch(()=>{Qs(e)}):Qs(e))}function Fl(e){try{localStorage.setItem(`maxnet_auto_refresh`,e?`1`:`0`)}catch{}t&&clearInterval(t),e&&Il()}function Il(){t&&clearInterval(t),t=setInterval(B,3e3)}function Ll(e,t){let n=document.getElementById(t);n&&(e.checked?(n.className=`toggle-status-badge on`,n.textContent=`ENABLED`):(n.className=`toggle-status-badge off`,n.textContent=`DISABLED`))}function Rl(){let e=i===`dark`,t=document.getElementById(`themeIconSun`),n=document.getElementById(`themeIconMoon`);t&&n&&(e?(t.style.display=`block`,n.style.display=`none`):(t.style.display=`none`,n.style.display=`block`)),typeof U==`function`&&U(),typeof Ss==`function`&&Ss()}function zl(){d(i===`dark`?`day`:`night`)}function Bl(){navigator.clipboard?navigator.clipboard.writeText(`9824584454@ybl`).then(Hl).catch(Vl):Vl()}function Vl(){let e=document.createElement(`textarea`);e.value=`9824584454@ybl`,document.body.appendChild(e),e.select();try{document.execCommand(`copy`),Hl()}catch{}document.body.removeChild(e)}function Hl(){typeof Q==`function`?Q(`Copied UPI ID: 9824584454@ybl to clipboard!`,`success`):typeof showNotificationToast==`function`&&showNotificationToast(`Copied UPI ID: 9824584454@ybl to clipboard!`),document.querySelectorAll(`button[onclick*="copyUpi"]`).forEach(e=>{e.style.color=`#10b981`,setTimeout(()=>{e.style.color=``},2e3)})}function $(e){return e?String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`):``}function Ul(e){document.body.classList.toggle(`no-anim`,!e);try{localStorage.setItem(`maxnet_anim_flow`,e?`1`:`0`)}catch{}}function Wl(e){document.body.classList.toggle(`no-glow`,!e);try{localStorage.setItem(`maxnet_cyber_glow`,e?`1`:`0`)}catch{}}function Gl(e){document.body.classList.toggle(`dense-mode`,!!e);try{localStorage.setItem(`maxnet_dense_mode`,e?`1`:`0`)}catch{}}function Kl(){try{f();let e=document.getElementById(`autoRefresh`);e&&(e.checked=localStorage.getItem(`maxnet_auto_refresh`)!==`0`);let t=document.getElementById(`toggleAnimFlow`);t&&(t.checked=localStorage.getItem(`maxnet_anim_flow`)!==`0`);let n=document.getElementById(`toggleCyberGlow`);n&&(n.checked=localStorage.getItem(`maxnet_cyber_glow`)!==`0`);let r=document.getElementById(`toggleDenseMode`);r&&(r.checked=localStorage.getItem(`maxnet_dense_mode`)===`1`);let i=document.getElementById(`toggleHapticFeedback`);i&&(i.checked=localStorage.getItem(`maxnet_haptic_feedback`)!==`0`),ql()}catch(e){console.warn(`initWebUiSettingsPage error`,e)}}window.initWebUiSettingsPage=Kl;async function ql(){try{let e=await(await fetch(`/cgi-bin/webhooks?action=get_local_config`)).json();if(e&&e.status===`ok`){let t=e.retention_max_count||50,n=document.getElementById(`disp_webui_notif_retention`);n&&(n.textContent=`${t} Alerts (Auto-prunes oldest)`);let r=e.triggers||{},i=document.getElementById(`webuiNotifTriggerDevice`),a=document.getElementById(`webuiNotifTriggerWan`),o=document.getElementById(`webuiNotifTriggerSecurity`),s=document.getElementById(`webuiNotifTriggerHealth`),c=document.getElementById(`webuiNotifTriggerUpdate`);i&&(i.checked=r.device!==!1),a&&(a.checked=r.wan!==!1),o&&(o.checked=r.security!==!1),s&&(s.checked=r.health!==!1),c&&(c.checked=r.update!==!1)}}catch(e){console.warn(`loadWebUiNotificationPreferences error`,e)}}window.loadWebUiNotificationPreferences=ql;async function Jl(){let e={status:`ok`,triggers:{device:!!document.getElementById(`webuiNotifTriggerDevice`)?.checked,wan:!!document.getElementById(`webuiNotifTriggerWan`)?.checked,security:!!document.getElementById(`webuiNotifTriggerSecurity`)?.checked,health:!!document.getElementById(`webuiNotifTriggerHealth`)?.checked,update:!!document.getElementById(`webuiNotifTriggerUpdate`)?.checked}};try{let t=await(await fetch(`/cgi-bin/webhooks?action=set_local_config`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)})).json();t&&t.status===`ok`&&Q(`Notification alert preferences saved`,`success`)}catch{Q(`Failed to save notification preferences`,`error`)}}window.saveWebUiNotificationTriggers=Jl;async function Yl(){if(confirm(`Are you sure you want to clear all stored alerts?`))try{let e=await(await fetch(`/cgi-bin/webhooks?action=clear_notifications`)).json();if(e&&e.status===`ok`){Q(`All notifications cleared successfully`,`success`);let e=document.getElementById(`notifActiveBadge`);e&&(e.textContent=`0 ALERTS`);let t=document.getElementById(`btnNotifBadge`);t&&(t.style.display=`none`)}}catch{Q(`Failed to clear notifications`,`error`)}}window.clearAllNotificationsWebui=Yl,u(),Kl();try{if(localStorage.getItem(`maxnet_anim_flow`)===`0`){let e=document.getElementById(`toggleAnimFlow`);e&&(e.checked=!1),document.body.classList.add(`no-anim`)}if(localStorage.getItem(`maxnet_cyber_glow`)===`0`){let e=document.getElementById(`toggleCyberGlow`);e&&(e.checked=!1),document.body.classList.add(`no-glow`)}if(localStorage.getItem(`maxnet_dense_mode`)===`1`){let e=document.getElementById(`toggleDenseMode`);e&&(e.checked=!0),document.body.classList.add(`dense-mode`)}}catch{}var Xl=`system`;function Zl(){Xl===`kernel`?dc():uc()}var Ql=typeof $o==`function`?$o:null;$o=function(e){Xl=e,Ql&&Ql(e)};var $l=!0;try{$l=localStorage.getItem(`maxnet_haptic_feedback`)!==`0`;let e=document.getElementById(`toggleHapticFeedback`);e&&(e.checked=$l)}catch{}function eu(e){$l=!!e;try{localStorage.setItem(`maxnet_haptic_feedback`,e?`1`:`0`)}catch{}e&&tu([15,30,15]),Q(e?`Haptic feedback enabled`:`Haptic feedback disabled`,`info`)}function tu(e=10){try{$l&&navigator.vibrate&&navigator.vibrate(e)}catch{}}document.addEventListener(`click`,e=>{e.target.closest(`button, .round-action-btn, .setting-clickable-row, .settings-nav-card, .toggle-switch, .tri-btn, .mh-btn`)&&tu(12)},{passive:!0});async function nu(){try{let e=await(await fetch(`/cgi-bin/device_info`)).json();if(e.status!==`ok`)return;let t=e.cpu||{},n=e.system||{},r=e.memory||{},i=document.getElementById(`sysCpuModel`);i&&(i.textContent=[t.model,t.cores?`${t.cores} Cores`:``,t.architecture].filter(Boolean).join(` • `)||`CPU data unavailable`);let a=document.getElementById(`sysLoadAvg`);a&&(a.textContent=`Usage: ${t.usage_pct||0}% • Load: ${t.load_1m||`0.00`}, ${t.load_5m||`0.00`}, ${t.load_15m||`0.00`} • BogoMIPS: ${t.bogomips||`48.00`}`);let o=document.getElementById(`sysRamSub`),s=Number(r.phys_total_mb||r.total_mb)||0,c=r.phys_free_mb||r.free_mb||0,l=r.phys_cached_mb||r.cached_mb||0,u=r.phys_avail_mb||r.avail_mb||0,d=r.phys_used_mb||Math.max(0,s-c-l),f=r.phys_used_pct===void 0?s>0?Math.round(d*100/s):0:r.phys_used_pct;o&&(o.textContent=s>0?`Physical RAM: ${d} MB used (${f}%) • Free: ${c} MB • Cache: ${l} MB • Available: ${u} MB`:`Physical RAM data unavailable`);let p=e.zram||{},m=document.getElementById(`sysZramSub`),h=Number(p.total_mb||r.zram_total_mb)||0,g=p.used_mb===void 0?r.zram_used_mb||0:p.used_mb,_=p.free_mb===void 0?h-g:p.free_mb,v=p.used_pct===void 0?h>0?Math.round(g*100/h):0:p.used_pct,y=(p.algorithm||`lzo`).toUpperCase(),b=p.ratio||`--`;m&&(m.textContent=h>0?`Engine: ${y} • Pool: ${h} MB • Compressed: ${g} MB (${v}%) • Available: ${_} MB • Ratio: ${b}`:`ZRAM data unavailable`);let x=document.getElementById(`sysMemPoolSub`),S=r.total_mb||s+h,C=r.avail_mb||u+_,w=r.used_mb||S-C,T=r.used_pct===void 0?S>0?Math.round(w*100/S):0:r.used_pct;x&&(x.textContent=`Combined Memory: ${S} MB • Active: ${w} MB (${T}%) • Available Headroom: ${C} MB`);let E=e.thermals||[],D=0;if(E.length>0){let e=0;E.forEach(t=>{let n=parseFloat(t.temp_c)||0;n>D&&(D=n),e+=n}),e/E.length}else D=0;let O=parseFloat(t.usage_pct)||0,k=parseFloat(r.used_pct)||0,A=document.getElementById(`deviceHealthStatusBadge`),j=document.getElementById(`deviceHealthSummarySub`),M=[];O>85&&M.push(`High CPU load (${O}%)`),k>90&&M.push(`High memory usage (${k}%)`),D>75&&M.push(`Elevated thermal temperature (${D.toFixed(1)}°C)`);let N=`HEALTHY`,P=`CPU (${O}%), RAM (${k}%), Temp (${D>0?D.toFixed(1)+`°C`:`Unavailable`})`;A&&(M.length>0?O>95||k>95||D>85?(N=`CRITICAL`,P=`Critical Anomaly • ${M.join(`, `)}`,A.className=`setting-status-badge`,A.style.background=`rgba(239,68,68,0.12)`,A.style.color=`#ef4444`,A.style.border=`1px solid rgba(239,68,68,0.3)`):(N=`WARNING`,P=`Suboptimal State • ${M.join(`, `)}`,A.className=`setting-status-badge`,A.style.background=`rgba(245,158,11,0.12)`,A.style.color=`#f59e0b`,A.style.border=`1px solid rgba(245,158,11,0.3)`):(N=`HEALTHY`,A.className=`setting-status-badge badge-active`,A.style.background=``,A.style.color=``,A.style.border=``),A.textContent=N),j&&(j.textContent=P),ru(e.thermals||[]),iu(e.storage||[]),au(e.ports||[]);let F=document.getElementById(`sysBoardModel`);F&&(F.textContent=n.model||`JioRouter AX6000 JIDU6J11-6811`);let ee=document.getElementById(`sysKernelVersion`);ee&&(ee.textContent=n.kernel||`Linux 6.18`);let te=document.getElementById(`sysUptimeClock`);te&&(te.textContent=`Uptime: ${n.uptime_str||`--`} • Time: ${n.local_time||`--`}`)}catch(e){console.error(`fetchDeviceInfo error`,e)}}function ru(e){let t=document.getElementById(`sysThermalsContainer`),n=document.getElementById(`sysThermalCount`);t&&(n&&(n.textContent=`${e.length} Zones`),t.innerHTML=e.length===0?`<div style="padding:10px 14px; color:var(--text-dim); font-size:11.5px;">No thermal zones detected.</div>`:e.map(e=>`
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">${$(e.name||e.type)}</span>
              <span class="setting-label-sub" style="font-family:var(--font-mono);">${e.temp_c}&deg;C &bull; Sensor: ${$(e.type)}</span>
            </div>
          </div>
        `).join(``))}function iu(e){let t=document.getElementById(`sysStorageContainer`);t&&(t.innerHTML=e.length===0?`<div style="padding:10px 14px; color:var(--text-dim); font-size:11.5px;">No storage partitions available.</div>`:e.map(e=>`
        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Mount: ${$(e.mount)}</span>
            <span class="setting-label-sub">${$(e.used)} used of ${$(e.size)} (${$(e.use_pct)}) &bull; ${$(e.avail)} free &bull; ${$(e.fs)}</span>
          </div>
        </div>
      `).join(``))}function au(e){let t=document.getElementById(`sysPortsContainer`);t&&(t.innerHTML=e.length===0?`<div style="padding:10px 14px; color:var(--text-dim); font-size:11.5px;">No network ports detected.</div>`:e.map(e=>{let t=e.status===`UP`?`${$(e.speed)}${e.duplex===`full`?` Full-Duplex`:``} (LINK UP)`:`LINK DOWN`,n=(e.rx_bytes/1048576).toFixed(1),r=(e.tx_bytes/1048576).toFixed(1);return`
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">${$(e.label)}</span>
              <span class="setting-label-sub">${t} &bull; ${$(e.iface)} &bull; MAC: ${$(e.mac)}${e.ip?` &bull; IP: `+$(e.ip):``} &bull; RX: ${n}MB / TX: ${r}MB</span>
            </div>
          </div>
        `}).join(``))}setTimeout(()=>{typeof Io==`function`&&Io(),typeof Ho==`function`&&Ho()},1500),setInterval(()=>{typeof Ho==`function`&&Ho()},18e5);function ou(){let e=e=>{let t=e.target.closest(`.round-action-btn, .topo-round-btn`);if(t&&(t.classList.add(`touch-active`),navigator.vibrate))try{navigator.vibrate(10)}catch{}},t=e=>{let t=e.target.closest(`.round-action-btn, .topo-round-btn`);t?setTimeout(()=>t.classList.remove(`touch-active`),120):document.querySelectorAll(`.round-action-btn.touch-active, .topo-round-btn.touch-active`).forEach(e=>{e.classList.remove(`touch-active`)})};document.addEventListener(`pointerdown`,e,{passive:!0}),document.addEventListener(`pointerup`,t,{passive:!0}),document.addEventListener(`pointercancel`,t,{passive:!0}),document.addEventListener(`touchstart`,e,{passive:!0}),document.addEventListener(`touchend`,t,{passive:!0})}typeof document<`u`&&(document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,ou):ou()),typeof window<`u`&&Object.assign(window,{applyThemeMode:u,setThemeMode:d,updateThemeTriButtons:f,apiFetch:p,fetchPublicHealthSnapshot:m,showLogin:h,checkRootPasswordState:g,showDashboard:_,pemSpkiToArrayBuffer:v,encryptCredentials:y,submitLogin:b,showLogoutConfirm:x,hideLogoutConfirm:S,logoutSession:C,openSettingPage:O,saveCurrentSettingPage:E,resetCurrentSettingPage:D,getValidationTypeForKey:k,onModalLiveValidate:A,triggerModalInitialValidation:j,loadUsbWanConfig:N,renderUsbWanDevices:P,saveUsbWanConfig:F,restartUsbWanInterfaces:ee,openEditUsbDeviceModal:te,handleSettingsBack:ne,closeSettingPage:I,toggleAccordion:L,filterSettingsSearch:R,clearSettingsSearch:re,switchTab:z,toggleSettingsMenu:ie,getTempColor:ae,getUsageColor:oe,fmtBytes:se,fetchData:B,drawTrafficSparkline:ce,renderMultiLinkMerger:le,selectFleetSlot:ue,fetchSelectedSlotTelemetry:de,renderFleetMatrix:fe,formatUptimeWithSec:me,getLiveMobUptime:he,getLiveRtrUptime:ge,renderTooltipContent:_e,fetchRealtimePing:ve,positionBadaTooltip:ye,showBadaTooltip:be,hideBadaTooltip:xe,openSmbSettings:Se,toggleSmbServiceLegacy:Ce,attachNodeTooltip:we,zoomTopology:Oe,resetTopologyZoom:ke,applyTopologyZoom:Ae,toggleTopologyFullscreen:je,setTopologyLayerFilter:Me,applyTopoTransform:Ke,initTopoPanDrag:qe,initTopologyCpuOptimization:Je,showTopoNodeDetail:Ze,closeTopoNodeDetail:Qe,showTopoEvidenceModal:et,closeTopoEvidenceModal:tt,fitTopologyToScreen:nt,openTopoNodeSettings:rt,openTopoNodeClientPage:it,drawPeopleIcon:ct,drawMobileIcon:lt,drawSsdIcon:ut,drawPendriveIconV1:dt,resolveDeviceDisplayName:ft,isStaleDeviceLabel:pt,cleanDeviceLabel:mt,classifyLanDevice:ht,drawLanClientDeviceIcon:gt,drawRouterBoxIcon:_t,drawRouterApIcon:vt,drawSwitchIcon:yt,drawWifiAntennaIcon:bt,drawDeviceIcon:xt,drawNoInternetIconSmall:St,drawTetheringIconSmall:Ct,drawAdbIconSmall:wt,drawMtpIconSmall:Tt,drawMobilePhoneIcon:Et,drawPendriveIcon:Dt,drawStorageIconSmall:kt,renderDeviceVerticalIcons:At,getApAndClientsForPort:jt,getUsbThemeStyle:Mt,calcMaxLinkSpeedTag:Nt,getPortTopologyConfig:Pt,computeNodeInterfaceSlots:Ft,computeTreeTotalVerticalHeight:It,computeSubtreeBounds:Lt,computeTreeMaxDepth:Rt,computeSubtreeClientCount:zt,getTopologyPrefs:Vt,updateTopologyPref:Ht,getTopologyThemeColors:Ut,setupTopologyAutoRefresh:Wt,makeStepEdgePath:Gt,computeLayeredSubtreeBounds:Kt,assignLayeredPositions:qt,countTotalTopologyNodes:Jt,toggleExpandCollapseAll:Yt,setTopologyActiveLayer:Xt,highlightPathToRoot:Zt,clearPathHighlight:Qt,renderTopologyMinimap:$t,getCombinedRouterSpeed:en,calcSpeedFlowDuration:tn,calcSpeedFlowWidth:nn,getDeviceSpeedMbps:rn,getDeviceRxTxRates:an,getTxFlowColor:on,addBidirectionalFlow:sn,buildUsbBwSvg:U,renderBwValues:cn,renderTopologyFlow:ln,renderData:un,renderMiniPorts:dn,fetchBlockedList:fn,fetchClients:pn,setClientSort:mn,onSearchClients:gn,clearDhcpClientSearch:_n,renderClientsCards:vn,getClientHostOrDnsName:yn,getClientStatusInfo:bn,isGatewayDevice:xn,openDhcpClientDetail:Sn,closeDhcpClientDetail:Cn,renderDhcpClientDetail:wn,copyClientText:Tn,reserveClientStaticLease:En,getAvailableNetworkClients:Dn,createDefaultTopologyTree:Fn,syncRealClientsToTopology:In,normalizeTopologyTree:Ln,validateAndFixNodeTree:Rn,collectUsedIps:zn,findNodeById:Bn,findPortById:Vn,validateTopologyTree:Hn,synthesizeLegacyPorts:Un,renderUsbPortsSettingList:Wn,onWanModeChange:Gn,onWanSpeedChange:Kn,onUsbModeChange:qn,onUsbPortCountChange:Jn,onUsbPortChange:Yn,triggerTopologyAutoSave:W,onNodePortCountChange:Zn,onPortRoleChange:Qn,onSelectPortDevice:$n,onCustomPortDeviceChange:er,onSelectPortNodeClient:tr,onNodeFieldChange:nr,onAddWirelessClient:rr,onRemoveWirelessClient:ir,onWirelessClientChange:ar,updateValidationNotice:or,renderTopologyPreferencesUI:sr,toggleTopoPreferences:cr,flattenTopologyNodes:lr,renderTopologyLayersUI:G,renderNodeCard:ur,renderNodeSettingGroups:dr,renderSingleNodeSettingCard:fr,onQuickAddWifiClient:pr,onRemoveWifiClient:mr,setTopologyDiscoveryMode:jn,saveTopologyLayersConfig:hr,resetTopologyLayersConfig:gr,fetchTopologyLayers:_r,autoMapNetworkTopology:vr,openExportTopologyModal:yr,openImportTopologyModal:br,closeTopoJsonModal:xr,copyTopoJsonToClipboard:Sr,applyImportedTopoJson:Cr,showSaveSuccessNotification:wr,renderBlockedCards:Tr,blockDevice:Dr,unblockDevice:Or,submitManualBlock:kr,fetchUsbDevicesFlow:Ar,renderUsbDevicesFlow:jr,restartNetworkAndMultilink:Mr,clearDnsAndConntrack:Nr,downloadKernelLogs:Pr,onSelectAdbDevice:Fr,onSelectUsbHardwareDevice:Ir,fetchDeviceTelemetry:Lr,fetchDeviceSms:Rr,runDevicePing:zr,saveAdbDeviceStates:Br,getAdbDeviceState:Vr,updateAdbTorchUI:Hr,fetchAdbLiveTelemetry:Ur,copyAdbSerial:Wr,switchAdbSubView:Gr,fetchAdbSmsPage:Kr,renderAdbSmsPageList:qr,filterAdbSmsPage:Jr,fetchAdbCallsPage:Yr,renderAdbCallsPageList:Xr,filterAdbCallsPage:Zr,fetchAdbContactsPage:Qr,renderAdbContactsPageList:$r,filterAdbContactsPage:ei,openAdbSmsModal:ti,openAdbCallLogsModal:ni,openAdbContactsModal:ri,closeAdbSmsModal:ii,closeAdbCallLogsModal:ai,closeAdbContactsModal:oi,captureAdbScreenshot:si,closeAdbScreenshotModal:ci,togglePhoneTorch:li,volumePhone:ui,runDeviceWake:di,runDeviceSleep:fi,runDeviceAirplane:pi,runDeviceReboot:mi,runDeviceLock:gi,openPhoneTetherSettings:_i,fetchDeviceContacts:vi,filterContacts:yi,renderContactsList:bi,fetchDeviceCalls:xi,handleRestoreFileChosen:Si,initDropzoneHandlers:Ci,toggleDiagRawLog:wi,setSettingSaveStatus:Di,scheduleNetworkAutoSave:Oi,saveNetworkSettingsAuto:ki,openSettingModal:ji,onModalMaskInput:Mi,onModalCidrChange:Ni,closeSettingModal:Fi,onModalOverlayClick:Ii,isValidIpv4:Li,isValidSubnetMask:Ri,isValidMac:zi,generateRandomMacInModal:Bi,saveSettingModal:Vi,fetchSecuritySettings:Ui,saveSecurityPolicy:Wi,fetchAdbDeviceList:Ki,renderAdbDevicesCards:qi,openAdbDeviceDetail:Ji,closeAdbDeviceDetail:Yi,selectAdbDevice:Xi,updateSelectedAdbDeviceControls:Zi,enableWirelessAdb:Qi,parseUserAgentSecurityDetails:$i,formatSessionDateTime:ea,fetchActiveSessions:ta,logoutSingleDevice:na,logoutOtherDevices:ra,logoutAllSessions:ia,logoutCurrentSession:aa,switchDiagTool:pa,setPortScanMode:ma,resetDefaultPorts:ha,setDnsQueryType:ga,clearDiagResults:_a,toggleDiagExecution:va,stopDiagExecution:ya,startDiagExecution:ba,executeNextPing:xa,executeTraceroute:Sa,executePortScan:wa,executeWhois:Ta,executeDnsQuery:Ea,runRouterDiagnostic:Da,renderDiagnosticGui:Oa,maskToCidr:ka,cidrToMask:Aa,syncCidrFromMask:ja,syncMaskFromCidr:Ma,toggleDhcpControls:Na,toggleIpv6Master:Pa,setDnsPreset:Fa,renderStaticLeases:Ia,addStaticLeaseFromUI:La,delStaticLease:Ra,toggleUsbTethering:za,toggleUsbTetherDns:Ba,fetchNetworkConfig:Va,saveNetworkSettings:Ha,onWanProtoChange:Ua,updateWanInterfaceDisplays:Wa,toggleWanAsLan:Ga,updateWanAsLanUI:Ka,loadWanInterfaceConfig:qa,saveWanInterfaceConfig:Ja,cloneCurrentPcMac:Ya,cloneCurrentPcMacToModal:Xa,generateRandomWanMacInModal:Za,resetWanMacToDefault:Qa,loadPppoeConfig:no,togglePppoeClient:ro,savePppoeClientCreds:io,savePppoeClientAc:ao,savePppoeClientMac:oo,generateRandomPppoeMac:so,togglePppoeServer:co,savePppoeServerConfig:lo,addPppoeUserFromModal:uo,deletePppoeUser:fo,togglePppoeSubscriberPassword:eo,togglePppoePasswordInput:to,loadDufsConfig:po,toggleDufsService:mo,saveDufsConfig:ho,openNotificationPage:go,toggleNotificationCenter:_o,closeNotificationCenter:vo,updateNotificationBadge:yo,clearAcknowledgedAlerts:bo,openSslHelpModal:xo,closeSslHelpModal:So,loadSslCertificateStatus:Co,requestDuckDnsSsl:wo,toggleBrowserPushPermission:To,updatePushNotificationButtonState:Eo,loadNotificationsPage:Io,deleteNotification:Lo,clearAllNotifications:Ro,dispatchTestNotification:zo,dispatchAlertNotification:Bo,checkSystemAlerts:Vo,checkForSystemFirmwareUpdates:Ho,loadWebhooksConfig:Uo,saveWebhooksConfig:Wo,testWebhookProvider:Go,fetchLogs:Zo,renderLogs:Qo,switchLogType:$o,filterLogsRealtime:es,refreshLogViewer:ts,toggleLogAutoRefresh:ns,stopLogAutoRefresh:rs,downloadCurrentLog:is,fetchPackages:ls,renderPackagesList:us,switchPackageTab:ds,handlePackageSearchInput:ps,updatePackageRepositories:ms,installPackage:hs,installPackageDirect:gs,uninstallPackage:_s,getTerminalResponsiveFontSize:bs,getTerminalTheme:xs,updateTerminalTheme:Ss,loadResource:Cs,ensureTerminalEngine:Ts,initNativeTerminal:Es,connectTerminalWebSocket:As,setTailscaleLoginState:Ms,updateTailscaleWebLoginUrl:Ns,renderTailscaleAccount:Ps,renderTailscaleDevices:Fs,fetchTailscale:Is,toggleTailscaleService:Ls,startTailscaleWebLogin:Vs,checkTailscaleAuthUrl:Hs,copyTsAuthUrl:Us,logoutTailscale:Ws,loginTailscaleWithKey:Gs,restartTailscale:Ks,applyTailscalePrefs:qs,fetchSmbConfig:Js,toggleSmbService:Ys,saveSmbCredentials:Xs,copySmbPath:Zs,fallbackCopyText:Qs,onSelectMultiLinkSlot:$s,changeAdminPassword:ec,downloadBackupArchive:tc,uploadRestoreArchive:nc,showFactoryResetModal:ac,closeFactoryResetModal:oc,openFirmwareFlashModal:hc,closeFirmwareFlashModal:gc,openRamBootModal:_c,closeRamBootModal:vc,executeDirectRamBoot:yc,startFirmwareFlash:bc,executeFactoryReset:sc,confirmFactoryReset:cc,confirmFactoryResetRouter:lc,downloadSystemLog:uc,downloadKernelLog:dc,showToast:Q,customConfirm:Z,customPrompt:fc,updateWifiDisplayLabels:jc,checkLatestFirmwareUpdate:xc,installSysupgradeUpdate:Sc,onSelectLocalFirmwareFile:wc,uploadAndVerifyLocalFirmware:Tc,executeLocalSysupgrade:Ec,confirmRebootRouter:Dc,checkUpdateStatus:Oc,executeFirmwareUpdate:kc,confirmCleanUpdate:Ac,fetchWifiConfig:$c,fetchWifiClients:El,wifiClientAction:Dl,renderWifiClients:Ol,loadSystemSettings:Lc,openSystemDateTimeEditor:Bc,openSystemTimezoneEditor:Vc,toggleSystemTimezoneMenu:Hc,filterSystemTimezoneOptions:Uc,selectSystemTimezone:Wc,applyCustomSystemTimezone:Gc,addSystemNtpServer:Jc,resetSystemNtpServers:qc,saveSystemSettingsPage:Yc,toggleScheduledAutoReboot:Zc,saveScheduledAutoRebootTime:Qc,saveWifiSettings:kl,toggleWifiMasterPower:Al,togglePasswordVisibility:jl,toggleRamBootDetailsInModal:Ml,showRamBootInstructions:Nl,copyTextToClipboard:Pl,toggleAutoRefresh:Fl,setupTimer:Il,updateToggleBadge:Ll,updateThemeUI:Rl,toggleTheme:zl,copyUpi:Bl,fallbackCopy:Vl,showCopied:Hl,escapeHtml:$,toggleAnimFlow:Ul,toggleCyberGlow:Wl,toggleDenseMode:Gl,downloadActiveLog:Zl,toggleHapticFeedback:eu,triggerHaptic:tu,fetchDeviceInfo:nu,renderDeviceInfoThermals:ru,renderDeviceInfoStorage:iu,renderDeviceInfoPorts:au,activeAdbDevices:Gi,selectedAdbSerial:K,cachedClients:o,currentTheme:i,currentThemeMode:r,confirmOpenPortUrl:Ca,sendTerminalKey:Os,clearTerminalScreen:Ds,submitMobileTermCmd:ks,initWebUiSettingsPage:Kl,loadWebUiNotificationPreferences:ql,saveWebUiNotificationTriggers:Jl,clearAllNotificationsWebui:Yl,toggleNotificationTrigger:ko,loadNotificationTriggers:Oo});function su(e){typeof Jr==`function`&&Jr(e)}function cu(e){typeof ei==`function`&&ei(e)}function lu(e,t){typeof Q==`function`&&Q(e,t?`error`:`info`)}function uu(e){typeof Vi==`function`&&Vi()}async function du(){typeof Q==`function`&&Q(`Power cycling USB hub (VBUS reset)...`,`warning`);try{await p(`/cgi-bin/usb_wan?action=power_cycle`),typeof Q==`function`&&Q(`USB Hub power cycled successfully!`,`success`)}catch{typeof Q==`function`&&Q(`USB power cycle trigger completed`,`info`)}}if(typeof window<`u`){if(window.fetch){let e=window.fetch;window.fetch=function(t,n){let r=n||{},i=localStorage.getItem(`maxnet_token`);if(i&&typeof t==`string`&&t.includes(`/cgi-bin/`)){let e=new Headers(r.headers||{});e.has(`Authorization`)||e.set(`Authorization`,`Bearer `+i),e.has(`X-Session-Token`)||e.set(`X-Session-Token`,i),r={...r,headers:e}}return e.call(this,t,r)}}window.submitLogin=b,window.logoutSession=C,window.hideLogoutConfirm=S,window.switchTab=z,window.toggleTheme=zl,window.setThemeMode=d,window.toggleSettingsMenu=ie,window.toggleNotificationCenter=_o,window.toggleCyberGlow=Wl,window.toggleDenseMode=Gl,window.toggleHapticFeedback=eu,window.toggleAutoRefresh=Fl,window.openSettingModal=ji,window.closeSettingModal=Fi,window.saveSettingModal=Vi,window.openSettingPage=O,window.handleSettingsBack=ne,window.filterSettingsSearch=R,window.clearSettingsSearch=re,window.toggleAccordion=L,window.onModalOverlayClick=Ii,window.resetTopologyZoom=ke,window.fitTopologyToScreen=nt,window.zoomTopology=Oe,window.closeTopoNodeDetail=Qe,window.openTopoNodeClientPage=it,window.openTopoNodeSettings=rt,window.closeTopoJsonModal=xr,window.copyTopoJsonToClipboard=Sr,window.applyImportedTopoJson=Cr,window.openExportTopologyModal=yr,window.openImportTopologyModal=br,window.closeTopoEvidenceModal=tt,window.resetTopologyLayersConfig=gr,window.autoMapNetworkTopology=vr,window.toggleAnimFlow=Ul,window.switchAdbSubView=Gr,window.fetchAdbSmsPage=Kr,window.filterAdbSmsPage=Jr,window.closeAdbSmsModal=ii,window.fetchAdbCallsPage=Yr,window.filterAdbCallsPage=Zr,window.closeAdbCallLogsModal=ai,window.fetchAdbContactsPage=Qr,window.filterAdbContactsPage=ei,window.closeAdbContactsModal=oi,window.captureAdbScreenshot=si,window.closeAdbScreenshotModal=ci,window.runDeviceWake=di,window.runDeviceSleep=fi,window.runDeviceReboot=mi,window.runDeviceAirplane=pi,window.togglePhoneTorch=li,window.volumePhone=ui,window.enableWirelessAdb=Qi,window.copyAdbSerial=Wr,window.saveUsbWanConfig=F,window.restartNetworkAndMultilink=Mr,window.scheduleNetworkAutoSave=Oi,window.saveSecurityPolicy=Wi,window.saveWanInterfaceConfig=Ja,window.loadWanInterfaceConfig=qa,window.toggleDhcpControls=Na,window.toggleIpv6Master=Pa,window.saveWebhooksConfig=Wo,window.testWebhookProvider=Go,window.loadPppoeConfig=no,window.togglePppoeClient=ro,window.togglePppoeServer=co,window.toggleSmbService=Ys,window.copySmbPath=Zs,window.toggleDufsService=mo,window.toggleTailscaleService=Ls,window.startTailscaleWebLogin=Vs,window.logoutTailscale=Ws,window.restartTailscale=Ks,window.applyTailscalePrefs=qs,window.copyTsAuthUrl=Us,window.switchDiagTool=pa,window.toggleDiagExecution=va,window.toggleDiagRawLog=wi,window.clearDiagResults=_a,window.setPortScanMode=ma,window.setDnsQueryType=ga,window.confirmRebootRouter=Dc,window.showFactoryResetModal=ac,window.closeFactoryResetModal=oc,window.openFirmwareFlashModal=hc,window.closeFirmwareFlashModal=gc,window.openRamBootModal=_c,window.closeRamBootModal=vc,window.executeDirectRamBoot=yc,window.startFirmwareFlash=bc,window.executeFactoryReset=sc,window.downloadBackupArchive=tc,window.handleRestoreFileChosen=Si,window.uploadRestoreArchive=nc,window.clearDnsAndConntrack=Nr,window.checkLatestFirmwareUpdate=xc,window.switchLogType=$o,window.refreshLogViewer=ts,window.downloadActiveLog=Zl,window.switchPackageTab=ds,window.handlePackageSearchInput=ps,window.updatePackageRepositories=ms,window.copyUpi=Bl,window.closeSslHelpModal=So,window.onSearchClients=gn,window.clearDhcpClientSearch=_n,window.showToast=Q,window.apiFetch=p,window.fetchDeviceInfo=nu,window.fetchTailscale=Is,window.fetchAdbLiveTelemetry=Ur,window.filterAdbSms=su,window.filterAdbContacts=cu,window.showNotificationToast=lu,window.saveSmbGuestSetting=uu,window.powerCycleUsbHub=du,window.fetchWifiConfig=$c,window.fetchWifiClients=El,window.wifiClientAction=Dl,window.renderWifiClients=Ol,window.loadSystemSettings=Lc,window.toggleSystemTimezoneMenu=Hc,window.filterSystemTimezoneOptions=Uc,window.selectSystemTimezone=Wc,window.applyCustomSystemTimezone=Gc,window.saveSystemSettingsPage=Yc,window.toggleScheduledAutoReboot=Zc,window.saveScheduledAutoRebootTime=Qc,window.saveWifiSettings=kl,window.scanNearbyWifi=nl,window.connectToWifiNetwork=rl,window.disconnectWifiWan=il,window.toggleWifiMasterPower=Al,window.togglePasswordVisibility=jl,window.fetchRepeaterStatus=fl,window.toggleRepeaterEnabled=dl,window.scanRepeaterWifi=pl,window.openRepeaterConnectModal=ml,window.closeRepeaterConnectModal=hl,window.setRepeaterProto=gl,window.toggleRepeaterAdvanced=_l,window.submitRepeaterConnect=vl,window.disconnectRepeaterWifi=il,window.fetchHwGesturesConfig=bl,window.toggleHwLedAuto=xl,window.openDhcpHistoryModal=Sl,window.closeDhcpHistoryModal=Cl,window.clearDhcpHistoryLedger=wl,window.clearAllNotifications=Ro,window.deleteNotification=Lo,window.loadNotificationsPage=Io,window.confirmOpenPortUrl=Ca,window.sendTerminalKey=Os,window.initWebUiSettingsPage=Kl,window.toggleNotificationTrigger=ko,window.loadNotificationTriggers=Oo,window.openNotificationSettingsModal=Ao,window.closeNotificationSettingsModal=jo,Object.assign(window,{confirmOpenPortUrl:Ca,sendTerminalKey:Os,initWebUiSettingsPage:Kl,toggleNotificationTrigger:ko,loadNotificationTriggers:Oo,fetchRepeaterStatus:fl,toggleRepeaterEnabled:dl,scanRepeaterWifi:pl,openRepeaterConnectModal:ml,closeRepeaterConnectModal:hl,submitRepeaterConnect:vl,disconnectRepeaterWifi:yl,fetchHwGesturesConfig:bl,toggleHwLedAuto:xl,openDhcpHistoryModal:Sl,closeDhcpHistoryModal:Cl,clearDhcpHistoryLedger:wl,clearAllNotifications:Ro,deleteNotification:Lo,loadNotificationsPage:Io,fetchWifiConfig:$c,fetchWifiClients:El,wifiClientAction:Dl,renderWifiClients:Ol,loadSystemSettings:Lc,toggleSystemTimezoneMenu:Hc,filterSystemTimezoneOptions:Uc,selectSystemTimezone:Wc,applyCustomSystemTimezone:Gc,saveSystemSettingsPage:Yc,toggleScheduledAutoReboot:Zc,saveScheduledAutoRebootTime:Qc,saveWifiSettings:kl,scanNearbyWifi:nl,connectToWifiNetwork:rl,disconnectWifiWan:il,toggleWifiMasterPower:Al,togglePasswordVisibility:jl,submitLogin:b,logoutSession:C,hideLogoutConfirm:S,switchTab:z,toggleTheme:zl,setThemeMode:d,toggleSettingsMenu:ie,toggleNotificationCenter:_o,toggleCyberGlow:Wl,toggleDenseMode:Gl,toggleHapticFeedback:eu,toggleAutoRefresh:Fl,openSettingModal:ji,closeSettingModal:Fi,saveSettingModal:Vi,openSettingPage:O,handleSettingsBack:ne,filterSettingsSearch:R,clearSettingsSearch:re,toggleAccordion:L,onModalOverlayClick:Ii,resetTopologyZoom:ke,fitTopologyToScreen:nt,zoomTopology:Oe,closeTopoNodeDetail:Qe,openTopoNodeClientPage:it,openTopoNodeSettings:rt,closeTopoJsonModal:xr,copyTopoJsonToClipboard:Sr,applyImportedTopoJson:Cr,openExportTopologyModal:yr,openImportTopologyModal:br,closeTopoEvidenceModal:tt,resetTopologyLayersConfig:gr,autoMapNetworkTopology:vr,toggleAnimFlow:Ul,switchAdbSubView:Gr,fetchAdbSmsPage:Kr,filterAdbSmsPage:Jr,closeAdbSmsModal:ii,fetchAdbCallsPage:Yr,filterAdbCallsPage:Zr,closeAdbCallLogsModal:ai,fetchAdbContactsPage:Qr,filterAdbContactsPage:ei,closeAdbContactsModal:oi,captureAdbScreenshot:si,closeAdbScreenshotModal:ci,runDeviceWake:di,runDeviceSleep:fi,runDeviceReboot:mi,runDeviceAirplane:pi,togglePhoneTorch:li,volumePhone:ui,enableWirelessAdb:Qi,copyAdbSerial:Wr,saveUsbWanConfig:F,restartNetworkAndMultilink:Mr,scheduleNetworkAutoSave:Oi,saveSecurityPolicy:Wi,saveWanInterfaceConfig:Ja,loadWanInterfaceConfig:qa,toggleDhcpControls:Na,toggleIpv6Master:Pa,saveWebhooksConfig:Wo,testWebhookProvider:Go,loadPppoeConfig:no,togglePppoeClient:ro,togglePppoeServer:co,toggleSmbService:Ys,copySmbPath:Zs,toggleDufsService:mo,toggleTailscaleService:Ls,startTailscaleWebLogin:Vs,logoutTailscale:Ws,restartTailscale:Ks,applyTailscalePrefs:qs,copyTsAuthUrl:Us,switchDiagTool:pa,toggleDiagExecution:va,toggleDiagRawLog:wi,clearDiagResults:_a,setPortScanMode:ma,setDnsQueryType:ga,confirmRebootRouter:Dc,showFactoryResetModal:ac,closeFactoryResetModal:oc,executeFactoryReset:sc,downloadBackupArchive:tc,handleRestoreFileChosen:Si,uploadRestoreArchive:nc,clearDnsAndConntrack:Nr,checkLatestFirmwareUpdate:xc,onSelectLocalFirmwareFile:wc,uploadAndVerifyLocalFirmware:Tc,executeLocalSysupgrade:Ec,switchLogType:$o,refreshLogViewer:ts,downloadActiveLog:Zl,switchPackageTab:ds,handlePackageSearchInput:ps,updatePackageRepositories:ms,copyUpi:Bl,closeSslHelpModal:So,onSearchClients:gn,clearDhcpClientSearch:_n,showToast:Q,apiFetch:p,fetchDeviceInfo:nu,fetchTailscale:Is,fetchAdbLiveTelemetry:Ur,filterAdbSms:su,filterAdbContacts:cu,showNotificationToast:lu,saveSmbGuestSetting:uu,powerCycleUsbHub:du})}function fu(){let t=document.getElementById(`maxnet-root`)||document.body;t&&!document.getElementById(`loginScreen`)&&(t.innerHTML=e)}fu();