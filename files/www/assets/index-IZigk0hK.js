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
          <input type="password" class="mh-input" id="loginPass" placeholder="Default: 1024" autocomplete="current-password" onkeydown="if(event.key==='Enter')submitLogin()" style="width:100%; box-sizing:border-box;">
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
        <div class="topo-top-bar">
          <div class="topo-brand-meta">
            <span class="topo-brand-title" id="dashBrandTitle">MAXNET GATEWAY</span>
            <span class="topo-brand-subtitle" id="headerVer">v2.2.20</span>
          </div>

          <!-- TOPOLOGY CANVAS CONTROLS (RESET + NOTIFICATIONS + MENU BUTTON) -->
          <div class="topo-toolbar" role="toolbar" aria-label="Topology Controls">
            <button class="topo-tool-btn" onclick="resetTopologyZoom()" id="btnResetTopoView" title="Reset Topology to Default View" aria-label="Reset Topology View">
              <svg viewBox="0 0 24 24" class="topo-tool-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
            <button class="topo-tool-btn" onclick="toggleNotificationCenter()" id="btnTopoNotifications" title="Notifications" aria-label="Notifications" style="position:relative;">
              <svg viewBox="0 0 24 24" class="topo-tool-icon"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span id="topoNotificationBadge" style="display:none; position:absolute; top:4px; right:4px; width:7px; height:7px; background:#ef4444; border-radius:50%; box-shadow:0 0 6px #ef4444;"></span>
            </button>
            <button class="topo-tool-btn topo-menu-btn" onclick="toggleSettingsMenu()" id="btnTopoMenu" title="Settings" aria-label="Settings">
              <svg viewBox="0 0 24 24" class="topo-tool-icon"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="bw-box">
          <svg id="usbBwSvg" role="img" aria-label="End-to-End Multi-Link Bandwidth Pipeline"></svg>
        </div>

        <!-- REAL-TIME ROUTER TELEMETRY DOCK (0 CPU LOAD, REAL-TIME CPU %, RAM %, AVG TEMP) -->
        <div class="topo-telemetry-dock" id="topoTelemetryDock">
          <div class="topo-tele-item">
            <svg style="width:13px;height:13px;stroke:#38bdf8;fill:none;stroke-width:2;" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3"/></svg>
            <span>CPU</span>
            <span class="topo-tele-val" id="topoDockCpu" style="color:#38bdf8;">--%</span>
          </div>
          <div class="topo-tele-sep"></div>
          <div class="topo-tele-item">
            <svg style="width:13px;height:13px;stroke:#10b981;fill:none;stroke-width:2;" viewBox="0 0 24 24"><path d="M6 19v-3m4 3v-6m4 3v-2m4 5V5"/><rect x="2" y="3" width="20" height="18" rx="2"/></svg>
            <span>RAM</span>
            <span class="topo-tele-val" id="topoDockRam" style="color:#10b981;">--%</span>
          </div>
          <div class="topo-tele-sep"></div>
          <div class="topo-tele-item">
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

  <!-- ==================== FIRMWARE FLASH OPTIONS & PROGRESS MODAL ==================== -->
  <div id="firmwareFlashModalOverlay" class="android-modal-overlay" style="display:none;" onclick="if(event.target===this)closeFirmwareFlashModal()">
    <div class="android-modal-card firmware-modal-card">
      <div class="android-modal-header firmware-modal-header">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <div style="display:flex; align-items:center; gap:9px;">
            <div style="width:30px; height:30px; border-radius:8px; background:rgba(56,189,248,0.15); color:#38bdf8; display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 24 24" style="width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div>
              <span class="android-modal-title" style="color:var(--text-main);">Firmware Upgrade</span>
              <div class="android-modal-desc" id="flashModalSubtitle">Verified sysupgrade image ready</div>
            </div>
          </div>
          <button type="button" class="btn-ghost" onclick="closeFirmwareFlashModal()" style="background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:4px;" aria-label="Close">
            <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <div class="android-modal-body" id="flashModalContent" style="padding:16px 20px; font-size:12px; display:flex; flex-direction:column; gap:12px;">
        <!-- Version Comparison Matrix -->
        <div class="flash-version-grid">
          <div style="display:flex; flex-direction:column; gap:3px;">
            <span style="font-size:10px; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-muted); font-weight:700;">Installed Version</span>
            <span id="flashCurrentVer" style="font-family:var(--font-mono); font-size:13px; font-weight:800; color:var(--text-main);">v2.0-legacy</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:3px; border-left:1px solid var(--border-sub, rgba(255,255,255,0.08)); padding-left:10px;">
            <span style="font-size:10px; text-transform:uppercase; letter-spacing:0.8px; color:#38bdf8; font-weight:700;">Latest Build</span>
            <span id="flashLatestVer" style="font-family:var(--font-mono); font-size:13px; font-weight:800; color:#38bdf8;">v2.2.3-b3</span>
          </div>
        </div>

        <!-- Hardware & Image Metadata -->
        <div class="flash-meta-box">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Hardware Target:</span>
            <span id="flashModelName" style="color:var(--text-main); font-weight:700;">JioRouter AX6000 JIDU6J11-6811</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Target Image:</span>
            <span id="flashFileName" style="color:#38bdf8; font-weight:600;">maxnet-jidu6811-sysupgrade.bin</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="color:var(--text-muted);">SHA256:</span>
            <span id="flashSha256" style="color:var(--text-dim); font-size:9.5px; max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">--</span>
          </div>
        </div>

        <!-- Action Choices -->
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:4px;">
          <button type="button" class="flash-action-btn flash-btn-keep" onclick="startFirmwareFlash(false)">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span class="flash-btn-title">Keep Settings &amp; Update</span>
              <span class="flash-btn-sub">Preserves network configurations, Wi-Fi keys, and passwords</span>
            </div>
            <svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2.2; flex-shrink:0; margin-left:8px;"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <button type="button" class="flash-action-btn flash-btn-clean" onclick="startFirmwareFlash(true)">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span class="flash-btn-title">Clean Flash (Factory Reset)</span>
              <span class="flash-btn-sub">Erases all partitions, clears old configs, boots fresh system</span>
            </div>
            <svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2.2; flex-shrink:0; margin-left:8px;"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>

          <button type="button" class="flash-action-btn" onclick="toggleRamBootDetailsInModal()" style="border:1px solid rgba(56,189,248,0.3); background:rgba(56,189,248,0.06);">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span class="flash-btn-title" style="color:#38bdf8;">Test in RAM First (.itb Safe Boot)</span>
              <span class="flash-btn-sub">Boot OS into volatile memory without touching flash - zero brick risk</span>
            </div>
            <svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:none; stroke:#38bdf8; stroke-width:2.2; flex-shrink:0; margin-left:8px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>

          <!-- RAM Boot Details Box (revealed on click) -->
          <div id="modalRamBootBox" style="display:none; background:rgba(0,0,0,0.3); border:1px solid rgba(56,189,248,0.25); border-radius:8px; padding:12px; font-size:11px; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; color:#38bdf8;">TFTP Safe RAM Boot:</span>
              <a id="modalItbDownloadBtn" href="#" target="_blank" class="mh-btn btn-sm" style="font-size:10px; padding:2px 8px; text-decoration:none;">Download .itb</a>
            </div>
            <div style="font-family:var(--font-mono); font-size:10px; background:rgba(0,0,0,0.5); padding:6px 8px; border-radius:4px; color:#38bdf8; word-break:break-all;" id="modalTftpCmd">
              tftpboot 0x46000000 maxnet-jidu6911-initramfs.itb; bootm 0x46000000
            </div>
            <div style="font-size:10.5px; color:var(--text-dim); line-height:1.4;">
              Configure TFTP server on 192.168.1.10. Load into RAM and test all services safely before permanently updating.
            </div>
          </div>
        </div>
      </div>

      <!-- Live Flashing Progress State (Replaces Body when Flashing) -->
      <div class="android-modal-body" id="flashProgressState" style="display:none; padding:24px 20px; flex-direction:column; align-items:center; text-align:center; gap:16px;">
        <div class="spin-icon-large" style="width:48px; height:48px; border:3px solid rgba(56,189,248,0.2); border-top-color:#38bdf8; border-radius:50%; animation:spin 0.9s linear infinite;"></div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <span style="font-size:15px; font-weight:800; color:var(--text-main);" id="flashProgressTitle">Flashing Firmware...</span>
          <span style="font-size:12px; color:var(--text-dim); line-height:1.5;" id="flashProgressDesc">Downloading binary from release server and writing to flash memory. Please DO NOT disconnect power.</span>
        </div>
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden;">
          <div id="flashProgressBar" style="width:15%; height:100%; background:linear-gradient(90deg, #38bdf8, #10b981); transition:width 0.4s ease;"></div>
        </div>
        <div style="font-family:var(--font-mono); font-size:12px; font-weight:700; color:#38bdf8;" id="flashCountdownTimer">Estimated time remaining: 75s</div>
      </div>

      <div class="android-modal-footer" id="flashModalFooter">
        <button type="button" class="mh-btn btn-ghost" onclick="closeFirmwareFlashModal()" style="padding:7px 18px; font-size:12px; font-weight:700;">CANCEL</button>
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

  <div id="settingEditModalOverlay" class="android-modal-overlay" onclick="onModalOverlayClick(event)">
    <div class="android-modal-card" id="settingEditModalCard">
      <div class="android-modal-header">
        <span class="card-badge sky" style="font-size:9.5px; font-weight:700; align-self:flex-start; margin-bottom:4px; letter-spacing:0.5px;">CONFIGURATION</span>
        <span class="android-modal-title" id="settingModalTitle">Edit Setting</span>
        <span class="android-modal-desc" id="settingModalDesc">Adjust configuration parameters</span>
      </div>
      <div class="android-modal-body" id="settingModalBody">
        <!-- Dynamically injected edit controls -->
      </div>
      <div class="android-modal-footer">
        <button type="button" class="mh-btn btn-ghost" onclick="closeSettingModal()" style="padding:8px 18px; font-size:12px; font-weight:700; border-radius:10px;">CANCEL</button>
        <button type="button" class="mh-btn" id="btnModalSave" onclick="saveSettingModal()" style="padding:8px 24px; font-size:12px; font-weight:800; background:#38bdf8; color:#0b1120; border-radius:10px; box-shadow:0 2px 10px rgba(56,189,248,0.35);">SAVE</button>
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
          <span class="card-badge emerald" id="topoNodeDetailStatusBadge" style="flex-shrink:0; font-size:10px; font-weight:800;">ONLINE</span>
        </div>
      </div>
      <div class="android-modal-body" id="topoNodeDetailBody" style="padding:14px 18px; max-height:75vh; overflow-y:auto; overflow-x:hidden; box-sizing:border-box;">
        <!-- Dynamically populated parameters grid -->
      </div>
      <div class="android-modal-footer" style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; padding:12px 18px; border-top:1px solid rgba(255,255,255,0.06);">
        <button type="button" class="mh-btn btn-ghost" onclick="closeTopoNodeDetail()" style="padding:6px 14px; font-size:11px;">CLOSE</button>
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
          <div class="settings-nav-card" id="card-network" onclick="openSettingPage('acc-network')" data-search="network dhcp gateway ip subnet mask dns nameservers lease pool lan interface ipv6 slaac dhcpv6 ula flow offloading acceleration ppe mss mtu">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#38bdf8;">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Network</span>
                <span class="snc-desc">Gateway IP, subnet mask, DNS, and DHCP pool</span>
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
                <svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
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
                <span class="snc-title">Tailscale VPN</span>
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

          <!-- Firmware & OS Updates -->
          <div class="settings-nav-card" id="card-firmware" onclick="openSettingPage('acc-firmware')" data-search="firmware os updates sysupgrade ota ram boot itb flash changelog sha256 version build check update release">
            <div class="snc-left">
              <div class="snc-icon-box" style="color:#38bdf8;">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div class="snc-info">
                <span class="snc-title">Firmware &amp; OS Updates</span>
                <span class="snc-desc">OTA sysupgrade, release diagnostics, changelog, and Safe RAM Boot (.itb) testing</span>
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
          <div class="settings-nav-card" id="card-device-info" onclick="openSettingPage('acc-device-info')" data-search="about developer max mahendra mali firmware architecture openwrt kernel ohhmax github">
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
            <div class="acc-right-action">
              <span class="card-badge emerald" id="wanStatusBadge">WAN ACTIVE</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <div class="setting-section-header">Interface Overview</div>
              <div id="interfacesOverviewGrid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:10px; margin-bottom:14px;">
                <div style="background:rgba(255,255,255,0.03); padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.07);">
                  <div style="font-size:10px; font-weight:800; font-family:var(--font-mono); color:var(--text-dim); text-transform:uppercase;">LAN Bridge (br-lan)</div>
                  <div style="font-size:13px; font-weight:700; color:#38bdf8; font-family:var(--font-mono); margin:2px 0;">10.0.0.1 / 24</div>
                  <div style="font-size:10.5px; color:var(--text-dim);">Status: UP &bull; Switch Bridge</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.07);">
                  <div style="font-size:10px; font-weight:800; font-family:var(--font-mono); color:var(--text-dim); text-transform:uppercase;">LAN Switch (lan1-lan4)</div>
                  <div style="font-size:13px; font-weight:700; color:#38bdf8; font-family:var(--font-mono); margin:2px 0;">Gigabit Ports</div>
                  <div style="font-size:10.5px; color:var(--text-dim);">4-Port Hardware Switch</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.07);">
                  <div style="font-size:10px; font-weight:800; font-family:var(--font-mono); color:var(--text-dim); text-transform:uppercase;">Physical WAN (eth0)</div>
                  <div style="font-size:13px; font-weight:700; color:var(--text-main); font-family:var(--font-mono); margin:2px 0;" id="ifaceEthWanState">Ready</div>
                  <div style="font-size:10.5px; color:var(--text-dim);">Gigabit Ethernet Port</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.07);">
                  <div style="font-size:10px; font-weight:800; font-family:var(--font-mono); color:var(--text-dim); text-transform:uppercase;">IPv6 Carrier (wan6)</div>
                  <div style="font-size:13px; font-weight:700; color:#a78bfa; font-family:var(--font-mono); margin:2px 0;" id="ifaceIpv6State">Connected</div>
                  <div style="font-size:10.5px; color:var(--text-dim);">Kernel SLAAC / RA Active</div>
                </div>
              </div>

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

              <!-- Action buttons -->
              <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
                <button type="button" class="mh-btn btn-ghost" onclick="loadWanInterfaceConfig()">RELOAD</button>
                <button type="button" class="mh-btn" onclick="saveWanInterfaceConfig()" style="background:#0ea5e9; color:#fff; font-weight:700;">APPLY WAN CONFIG</button>
              </div>
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
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
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
              <div class="setting-row-item setting-clickable-row" onclick="openSettingModal('pppoe_server_users')">
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
              <div class="setting-row-item" style="border-bottom:1px solid var(--border-sub, rgba(255,255,255,0.08)); padding-bottom:14px; margin-bottom:14px;">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Wi-Fi Gateway Master Power</span>
                  <span class="setting-label-sub">Enable or disable all wireless transmitters dynamically</span>
                </div>
                <div class="setting-control-col">
                  <label class="switch-toggle">
                    <input type="checkbox" id="wifiMasterToggle" onchange="toggleWifiMasterPower(this.checked)">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>

              <!-- 2.4 GHz BAND (QUALCOMM IPQ9574 WCSS) -->
              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-sub, rgba(255,255,255,0.08)); border-radius:12px; padding:16px; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:13px; font-weight:800; color:var(--text-main);">2.4 GHz High-Efficiency (Wi-Fi 6)</span>
                    <span class="setting-pill pill-cyan">HE20 / 2.4G</span>
                  </div>
                  <label class="switch-toggle">
                    <input type="checkbox" id="wifi2gEnable" checked>
                    <span class="slider"></span>
                  </label>
                </div>

                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">
                  <div>
                    <label class="setting-label-bold" style="font-size:11px; margin-bottom:4px; display:block;">Network Name (SSID)</label>
                    <input type="text" class="mh-input" id="wifi2gSsid" value="MaxNet-2.4G" placeholder="e.g. MaxNet-2.4G" style="width:100%; font-size:12px;">
                  </div>
                  <div>
                    <label class="setting-label-bold" style="font-size:11px; margin-bottom:4px; display:block;">Security Mode</label>
                    <select class="mh-input" id="wifi2gEnc" style="width:100%; font-size:12px;">
                      <option value="psk2">WPA2-PSK (AES) - High Compatibility</option>
                      <option value="sae">WPA3-SAE - Maximum Security</option>
                      <option value="sae-mixed">WPA2/WPA3 Mixed</option>
                      <option value="none">Open (No Security)</option>
                    </select>
                  </div>
                  <div>
                    <label class="setting-label-bold" style="font-size:11px; margin-bottom:4px; display:block;">Wi-Fi Password</label>
                    <div style="position:relative; display:flex; align-items:center;">
                      <input type="password" class="mh-input" id="wifi2gKey" value="" placeholder="Min 8 characters" style="width:100%; font-size:12px; padding-right:32px;">
                      <button type="button" class="btn-ghost" onclick="togglePasswordVisibility('wifi2gKey', this)" style="position:absolute; right:6px; background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:4px;">
                        <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="setting-label-bold" style="font-size:11px; margin-bottom:4px; display:block;">Operating Channel</label>
                    <select class="mh-input" id="wifi2gChannel" style="width:100%; font-size:12px;">
                      <option value="1">Channel 1 (2412 MHz) - Standard</option>
                      <option value="6">Channel 6 (2437 MHz)</option>
                      <option value="11">Channel 11 (2462 MHz)</option>
                      <option value="auto">Auto Select</option>
                    </select>
                  </div>
                  <div>
                    <label class="setting-label-bold" style="font-size:11px; margin-bottom:4px; display:block;">Channel Bandwidth</label>
                    <select class="mh-input" id="wifi2gHtmode" style="width:100%; font-size:12px;">
                      <option value="HE20">HE20 (20 MHz - Best Stability &amp; Range)</option>
                      <option value="HE40">HE40 (40 MHz - High Throughput)</option>
                      <option value="HT20">HT20 (Legacy Compatibility)</option>
                    </select>
                  </div>
                  <div style="display:flex; align-items:center; justify-content:space-between; padding-top:16px;">
                    <div>
                      <span class="setting-label-bold" style="font-size:11px; display:block;">Hide Network SSID</span>
                      <span class="setting-label-sub" style="font-size:10px;">Do not broadcast name</span>
                    </div>
                    <label class="switch-toggle">
                      <input type="checkbox" id="wifi2gHidden">
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 5 GHz BAND (QUALCOMM QCN9074 PINE) -->
              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-sub, rgba(255,255,255,0.08)); border-radius:12px; padding:16px; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:13px; font-weight:800; color:var(--text-main);">5 GHz Ultra-Speed (Wi-Fi 6)</span>
                    <span class="setting-pill pill-cyan">HE80/HE160 / 5G</span>
                  </div>
                  <label class="switch-toggle">
                    <input type="checkbox" id="wifi5gEnable" checked>
                    <span class="slider"></span>
                  </label>
                </div>

                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">
                  <div>
                    <label class="setting-label-bold" style="font-size:11px; margin-bottom:4px; display:block;">Network Name (SSID)</label>
                    <input type="text" class="mh-input" id="wifi5gSsid" value="MaxNet-5G" placeholder="e.g. MaxNet-5G" style="width:100%; font-size:12px;">
                  </div>
                  <div>
                    <label class="setting-label-bold" style="font-size:11px; margin-bottom:4px; display:block;">Security Mode</label>
                    <select class="mh-input" id="wifi5gEnc" style="width:100%; font-size:12px;">
                      <option value="psk2">WPA2-PSK (AES) - High Compatibility</option>
                      <option value="sae">WPA3-SAE - Maximum Security</option>
                      <option value="sae-mixed">WPA2/WPA3 Mixed</option>
                      <option value="none">Open (No Security)</option>
                    </select>
                  </div>
                  <div>
                    <label class="setting-label-bold" style="font-size:11px; margin-bottom:4px; display:block;">Wi-Fi Password</label>
                    <div style="position:relative; display:flex; align-items:center;">
                      <input type="password" class="mh-input" id="wifi5gKey" value="" placeholder="Min 8 characters" style="width:100%; font-size:12px; padding-right:32px;">
                      <button type="button" class="btn-ghost" onclick="togglePasswordVisibility('wifi5gKey', this)" style="position:absolute; right:6px; background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:4px;">
                        <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="setting-label-bold" style="font-size:11px; margin-bottom:4px; display:block;">Operating Channel</label>
                    <select class="mh-input" id="wifi5gChannel" style="width:100%; font-size:12px;">
                      <option value="36">Channel 36 (5180 MHz)</option>
                      <option value="40">Channel 40 (5200 MHz)</option>
                      <option value="44">Channel 44 (5220 MHz)</option>
                      <option value="48">Channel 48 (5240 MHz)</option>
                      <option value="149">Channel 149 (5745 MHz)</option>
                      <option value="153">Channel 153 (5765 MHz)</option>
                      <option value="157">Channel 157 (5785 MHz)</option>
                      <option value="161">Channel 161 (5805 MHz)</option>
                      <option value="auto">Auto Select</option>
                    </select>
                  </div>
                  <div>
                    <label class="setting-label-bold" style="font-size:11px; margin-bottom:4px; display:block;">Channel Bandwidth</label>
                    <select class="mh-input" id="wifi5gHtmode" style="width:100%; font-size:12px;">
                      <option value="HE80">HE80 (80 MHz - Fast &amp; Wide Compatibility)</option>
                      <option value="HE160">HE160 (160 MHz - Ultra Max Speed)</option>
                      <option value="HE40">HE40 (40 MHz)</option>
                      <option value="HE20">HE20 (20 MHz)</option>
                    </select>
                  </div>
                  <div style="display:flex; align-items:center; justify-content:space-between; padding-top:16px;">
                    <div>
                      <span class="setting-label-bold" style="font-size:11px; display:block;">Hide Network SSID</span>
                      <span class="setting-label-sub" style="font-size:10px;">Do not broadcast name</span>
                    </div>
                    <label class="switch-toggle">
                      <input type="checkbox" id="wifi5gHidden">
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- CONNECTED WIRELESS CLIENTS -->
              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-sub, rgba(255,255,255,0.08)); border-radius:12px; padding:16px; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <span style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-muted);">Connected Wireless Devices</span>
                  <button type="button" class="round-action-btn" onclick="fetchWifiConfig()" style="width:26px; height:26px; min-width:26px;" title="Refresh Devices">
                    <svg viewBox="0 0 24 24" style="width:13px; height:13px;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  </button>
                </div>
                <div id="wifiClientsContainer" style="display:flex; flex-direction:column; gap:8px;">
                  <div style="padding:14px; text-align:center; color:var(--text-muted); font-size:11.5px;">No wireless devices currently connected.</div>
                </div>
              </div>

              <!-- ACTION BAR -->
              <div style="display:flex; justify-content:flex-end; gap:10px;">
                <button type="button" class="mh-btn btn-ghost" onclick="fetchWifiConfig()" style="padding:8px 18px; font-size:12px; font-weight:700;">RESET FORM</button>
                <button type="button" class="mh-btn btn-primary" onclick="saveWifiSettings()" style="padding:8px 22px; font-size:12px; font-weight:800;">APPLY WI-FI SETTINGS</button>
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
            <div class="acc-right-action">
              <span class="card-badge amber" id="notifActiveBadge">0 ALERTS</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- TOP CONTROL ROW -->
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:12px; font-weight:700; color:var(--text-main); font-family:var(--font-mono);" id="notifStatusSummary">All systems normal</span>
                </div>
              </div>

              <!-- NOTIFICATIONS LIST CONTAINER -->
              <div id="notificationsListPageContainer" style="display:flex; flex-direction:column; gap:8px;">
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
              <!-- TOP ACTION BUTTONS ROW (SORTED IN A BALANCED ROW, NO TITLE, NO SAVE BUTTON) -->
              <div class="topo-header-row">
                <div class="topo-round-actions">
                  <div class="topo-action-item">
                    <button type="button" class="topo-round-btn btn-auto" onclick="autoMapNetworkTopology()" id="btnAutoMapTopo" title="Auto-Map from Clients" aria-label="Auto-Map from Clients">
                      <svg viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                    </button>
                    <span class="topo-action-label">Auto</span>
                  </div>
                  <div class="topo-action-item">
                    <button type="button" class="topo-round-btn btn-reset" onclick="resetTopologyLayersConfig()" id="btnResetTopo" title="Reset Defaults" aria-label="Reset Defaults">
                      <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
                    </button>
                    <span class="topo-action-label">Reset</span>
                  </div>
                  <div class="topo-action-item">
                    <button type="button" class="topo-round-btn btn-export" onclick="openExportTopologyModal()" id="btnExportTopo" title="Export Topology JSON" aria-label="Export JSON">
                      <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </button>
                    <span class="topo-action-label">Export</span>
                  </div>
                  <div class="topo-action-item">
                    <button type="button" class="topo-round-btn btn-import" onclick="openImportTopologyModal()" id="btnImportTopo" title="Import Topology JSON" aria-label="Import JSON">
                      <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                    <span class="topo-action-label">Import</span>
                  </div>
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

              <!-- SECTION 2: MEMORY (RAM) -->
              <div class="setting-section-divider"></div>
              <div class="setting-section-header">System Memory (RAM)</div>

              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-bold">Memory Allocation</span>
                  <span class="setting-label-sub" id="sysRamSub">Used: -- MB &bull; Free: -- MB &bull; Avail: -- MB</span>
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

                <!-- UPI Support & Donation -->
                <div class="setting-row-item" style="background:rgba(139,92,246,0.06); border:1px solid rgba(139,92,246,0.25); border-radius:10px; padding:12px 14px; margin:4px 0 8px 0;">
                  <div class="setting-label-col">
                    <span class="setting-label-bold" style="color:#a78bfa;">Donation &amp; Support via UPI</span>
                    <span class="setting-label-sub" style="font-family:var(--font-mono); font-size:12px; color:#e2e8f0; font-weight:700;">9824584454@ybl</span>
                    <span style="font-size:10.5px; color:var(--text-dim); margin-top:2px;">Developed by Mahendra Mali - Max &bull; Every contribution powers MAXNET innovation</span>
                  </div>
                  <div class="setting-control-col">
                    <button type="button" class="mh-btn" style="padding:6px 12px; font-size:11px; background:#8b5cf6; color:#fff; font-weight:700; border-radius:6px;" onclick="navigator.clipboard.writeText('9824584454@ybl'); showNotificationToast('Copied UPI ID: 9824584454@ybl to clipboard!')">COPY UPI</button>
                  </div>
                </div>

                <!-- 2. System Platform -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Firmware Operating System</span>
                    <span class="setting-label-sub">MAXNET Enterprise Gateway OS &bull; Release v2.2.20</span>
                  </div>
                </div>

                <!-- 3. Hardware Platform Target -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Hardware Architecture</span>
                    <span class="setting-label-sub">Qualcomm IPQ8072A (4x ARM Cortex-A53 @ 2.2 GHz) 64-bit &bull; Jio AX6000 Arcadyan</span>
                  </div>
                </div>

                <!-- 4. Linux Kernel -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Custom Linux Kernel</span>
                    <span class="setting-label-sub">Linux 6.18.60 Arcadyan Custom SMP &bull; GCC Optimized Network Engine</span>
                  </div>
                </div>

                <!-- 5. Core Systems Subsystems -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Core Subsystems</span>
                    <span class="setting-label-sub">5G SA High-Speed USB RNDIS/CDC Offload, Tailscale WireGuard Mesh, Low-Latency Gaming QoS</span>
                  </div>
                </div>

                <!-- 6. Repository & Contact -->
                <div class="setting-row-item">
                  <div class="setting-label-col">
                    <span class="setting-label-bold">Project Repository &amp; Contact</span>
                    <span class="setting-label-sub">github.com/ohhmax &bull; mahendrakumargahelot@gmail.com</span>
                  </div>
                  <div class="setting-control-col">
                    <a href="https://github.com/ohhmax" target="_blank" class="round-action-btn" title="Open GitHub Repository" style="text-decoration:none;">
                      <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
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
              <span class="acc-main-title">Tailscale VPN</span>
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
                  <span class="setting-label-sub" id="disp_smb_user_desc">User: max &bull; Click to configure credentials</span>
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
                <input type="text" id="dufsUserInput" value="root">
                <input type="password" id="dufsPassInput" value="admin">
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
                  <span class="setting-label-sub" id="disp_dufs_auth">Authentication Enforced (Default: root / admin)</span>
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
                <button type="button" id="btnDiagStart" class="mh-btn" onclick="toggleDiagExecution()" style="padding:8px 22px; font-weight:800; font-size:12px; letter-spacing:0.5px; background:linear-gradient(135deg, #0284c7, #0369a1); border:none; color:#ffffff; border-radius:8px; box-shadow:0 2px 10px rgba(2,132,199,0.3); cursor:pointer;">
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

              <!-- RESULTS CONTAINER -->
              <div id="diagResultsContainer" style="margin-top:14px; display:none;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                  <span id="diagResultTitle" style="font-size:11px; font-weight:800; font-family:var(--font-mono); color:var(--text-main); text-transform:uppercase;">Results</span>
                  <button type="button" class="mh-btn btn-sm btn-ghost" onclick="clearDiagResults()" style="font-size:9.5px; padding:2px 8px;">CLEAR</button>
                </div>
                <div id="diagResultsList" style="display:flex; flex-direction:column; gap:6px;"></div>
              </div>

              <!-- RAW LOG TOGGLE -->
              <div style="margin-top:12px; display:none;" id="diagRawToggleBox">
                <button class="mh-btn btn-sm btn-ghost" onclick="toggleDiagRawLog()" id="btnToggleDiagRaw" style="font-size:10px; padding:4px 8px;">
                  SHOW RAW CONSOLE
                </button>
                <div class="terminal-output-box" id="diagOutputBox" style="display:none; margin-top:8px;"></div>
              </div>

            </div></div>
        </div>

        <!-- DEDICATED FIRMWARE & OS UPDATES ACCORDION -->
        <div class="settings-card settings-detail-panel accordion-item" id="acc-firmware">
          <div class="settings-card-header accordion-header" onclick="toggleAccordion('acc-firmware')">
            <div class="acc-title-left">
              <div class="acc-icon-box" style="color:#38bdf8;">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <span class="acc-main-title">Firmware &amp; OS Updates</span>
            </div>
            <div class="acc-right-action">
              <span class="card-badge" style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3);">OS UPDATE</span>
              <svg class="svg-icon acc-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="accordion-content">
            <div class="settings-card-body">
              <!-- INSTALLED SYSTEM PROFILE -->
              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-sub, rgba(255,255,255,0.08)); border-radius:12px; padding:16px; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <span style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-muted);">Current System Profile</span>
                  <span id="fwCurrentVerBadge" class="setting-pill pill-cyan">v2.2.7-b7</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; font-size:12px;">
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:10.5px;">Model &amp; Hardware</span>
                    <span id="fwModelVal" style="color:var(--text-main); font-weight:700;">Jio JIDU6911</span>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:10.5px;">Target SoC Architecture</span>
                    <span id="fwSocVal" style="color:var(--text-main); font-weight:700;">Qualcomm IPQ9574 (AArch64)</span>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:10.5px;">Flash Layout</span>
                    <span id="fwFlashVal" style="color:var(--text-main); font-weight:700;">SPI-NAND UBI Dual-Slot</span>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:10.5px;">Active Kernel</span>
                    <span id="fwKernelVal" style="color:var(--text-main); font-weight:700;">Linux 6.18.60</span>
                  </div>
                </div>
              </div>

              <!-- LATEST RELEASE DIAGNOSTICS & STATUS -->
              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-sub, rgba(255,255,255,0.08)); border-radius:12px; padding:16px; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                  <span style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-muted);">Release Server Diagnostics</span>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span id="fwUpdateStatusPill" class="setting-pill pill-green">UP TO DATE</span>
                    <button class="round-action-btn" id="btnCheckFwPage" title="Check for New Releases" onclick="checkLatestFirmwareUpdate()" style="width:28px; height:28px; min-width:28px;">
                      <svg id="iconCheckFwPage" viewBox="0 0 24 24" style="width:14px; height:14px;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                    </button>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; font-size:12px; margin-bottom:12px;">
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:10.5px;">Latest Available Build</span>
                    <span id="fwLatestVerVal" style="color:#38bdf8; font-weight:700;">v2.2.7-b7</span>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:10.5px;">Sysupgrade Image</span>
                    <span id="fwFileVal" style="color:var(--text-main); font-family:var(--font-mono); font-size:11px; word-break:break-all;">maxnet-jidu6911-sysupgrade.bin</span>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:10.5px;">Sysupgrade Size</span>
                    <span id="fwSizeVal" style="color:var(--text-main); font-weight:700;">24.88 MB</span>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:10.5px;">SHA-256 Checksum</span>
                    <span id="fwShaVal" style="color:var(--text-dim); font-family:var(--font-mono); font-size:10px; word-break:break-all;">Verified via Release Manifest</span>
                  </div>
                </div>

                <!-- SAFE RAM BOOT (.itb) TEST SUITE -->
                <div style="background:rgba(56,189,248,0.06); border:1px solid rgba(56,189,248,0.2); border-radius:10px; padding:12px 14px; margin-top:10px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                    <span style="font-size:11.5px; font-weight:800; color:#38bdf8; display:flex; align-items:center; gap:6px;">
                      <svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2.2;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Safe RAM Boot Test (.itb)
                    </span>
                    <a id="fwItbDownloadLink" href="#" target="_blank" class="mh-btn btn-sm" style="font-size:10px; padding:3px 10px; background:rgba(56,189,248,0.2); color:#38bdf8; border:1px solid rgba(56,189,248,0.4); text-decoration:none;">DOWNLOAD .ITB</a>
                  </div>
                  <p style="font-size:11px; color:var(--text-dim); line-height:1.5; margin:0 0 8px 0;">
                    Load the operating system entirely into volatile RAM without writing to NAND flash. Router reboots to original state if powered off. Test Wi-Fi and stability with 100% zero risk of bricking.
                  </p>
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    <span style="font-size:10px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">U-Boot TFTP Ram Boot Command:</span>
                    <div style="display:flex; align-items:center; background:rgba(0,0,0,0.4); padding:6px 10px; border-radius:6px; font-family:var(--font-mono); font-size:10.5px; color:#38bdf8; justify-content:space-between;">
                      <span id="fwTftpCmdVal" style="user-select:all; word-break:break-all;">tftpboot 0x46000000 maxnet-jidu6911-initramfs.itb; bootm 0x46000000</span>
                      <button type="button" class="btn-ghost" onclick="copyTextToClipboard(document.getElementById('fwTftpCmdVal').textContent)" style="padding:2px 6px; font-size:10px; color:#38bdf8; border:none; background:transparent; cursor:pointer;" title="Copy Command">COPY</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- FIRMWARE ACTION CONTROLS -->
              <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:flex-end;">
                <button type="button" class="mh-btn btn-ghost" onclick="checkLatestFirmwareUpdate()" style="padding:8px 18px; font-size:12px; font-weight:700;">CHECK FOR UPDATES</button>
                <button type="button" class="mh-btn" id="btnFwRamBootTest" onclick="showRamBootInstructions()" style="padding:8px 18px; font-size:12px; font-weight:700; background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3);">TEST IN RAM (.ITB)</button>
                <button type="button" class="mh-btn btn-primary" id="btnFwFlashDirect" onclick="openFirmwareFlashModal(_lastFirmwareUpdateData)" style="padding:8px 22px; font-size:12px; font-weight:800;">INSTALL UPDATE</button>
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
              <!-- MAINTENANCE OPERATIONS (CLEAN ROWS WITH COLOR-CODED ACTION ICONS) -->
              <div style="display:flex; flex-direction:column;">
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
            <div class="settings-card-body" style="padding:0; background:transparent !important; border:none !important;">
              <div id="terminalContainer"></div>
            </div>
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
                  Systems Architect &amp; Kernel Network Engineer specializing in multi-WAN high-speed aggregation, Qualcomm PPE hardware acceleration, embedded OpenWrt firmware optimizations, and low-latency gaming infrastructure.
                </div>
              </div>

              <div style="font-size:11.5px; color:var(--text-dim); margin-top:14px;">
                Direct Developer Support &amp; Donations (UPI):
              </div>
              <div class="about-upi-capsule" style="margin-top:8px;">
                <span class="upi-tag">UPI</span>
                <span class="upi-string" id="upiText">9824584454@ybl</span>
                <button class="btn-copy-capsule" onclick="copyUpi()">COPY</button>
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

`,t=null,n=new Set,r=localStorage.getItem(`maxnet_theme_mode`)||`night`;!localStorage.getItem(`maxnet_theme_mode`)&&localStorage.getItem(`maxnet_theme`)&&(r=localStorage.getItem(`maxnet_theme`)===`light`?`day`:`night`);var i=r===`day`?`light`:`dark`,a=`ip`,o=[];function s(){let e=`dark`;if(e=r===`auto`?window.matchMedia&&window.matchMedia(`(prefers-color-scheme: dark)`).matches?`dark`:`light`:r===`day`?`light`:`dark`,i=e,document.documentElement.setAttribute(`data-theme`,e),l(),typeof Lo==`function`)try{Lo()}catch{}if(typeof W==`function`)try{W()}catch{}}function c(e){[`auto`,`day`,`night`].includes(e)||(e=`night`),r=e,localStorage.setItem(`maxnet_theme_mode`,e),localStorage.setItem(`maxnet_theme`,e===`day`?`light`:`dark`),s()}function l(){let e={auto:document.getElementById(`triBtnAuto`),day:document.getElementById(`triBtnDay`),night:document.getElementById(`triBtnNight`)};Object.keys(e).forEach(t=>{e[t]&&(t===r?e[t].classList.add(`active`):e[t].classList.remove(`active`))})}window.matchMedia&&window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`,()=>{r===`auto`&&s()}),s();function u(e,t={}){let n=`${e}${e.includes(`?`)?`&`:`?`}_t=${Date.now()}`,r=localStorage.getItem(`maxnet_token`);return fetch(n,{...t,cache:`no-store`,headers:{"Cache-Control":`no-cache, no-store, must-revalidate`,Pragma:`no-cache`,Expires:`0`,...r?{"X-Session-Token":r}:{},...t.headers||{}}})}i===`light`&&document.documentElement.setAttribute(`data-theme`,`light`),window.addEventListener(`load`,async()=>{try{if((await(await u(`/cgi-bin/clients?action=check`)).json()).blocked){window.location.href=`/blocked.html`;return}}catch{}let e=localStorage.getItem(`maxnet_token`);if(e)try{if((await(await u(`/cgi-bin/auth?action=verify&token=`+e)).json()).status===`ok`){p();return}}catch{}f()});async function d(){try{let e=await(await fetch(`/cgi-bin/health`)).json();if(e.status===`ok`){let t=e.hostname||e.router&&e.router.hostname||`MAXNET-GATEWAY`,n=document.getElementById(`loginDeviceHostTitle`);n&&(n.textContent=t.toUpperCase()),(!document.title||document.title.includes(`Login`))&&(document.title=t.toUpperCase()+` - Login`)}}catch(e){console.error(`fetchPublicHealthSnapshot error`,e)}}function f(){document.getElementById(`loginScreen`).style.display=`flex`,document.getElementById(`dashboardContainer`).style.display=`none`;let e=document.getElementById(`loginPass`);e&&(e.value=``),t&&clearInterval(t),d()}function p(){if(document.getElementById(`loginScreen`).style.display=`none`,document.getElementById(`dashboardContainer`).style.display=`block`,z(),_a(),Xn(),Qt(),Jo(),Ci(),qa(),La(),xa(),Da(),typeof Za==`function`&&Za(),Bs(),setTimeout(ks,1e3),window.location.hash&&window.location.hash.startsWith(`#setting=`)){let e=decodeURIComponent(window.location.hash.replace(`#setting=`,``)).split(`&`)[0];e&&(P(`settings`,!0,!1),x(e,!1))}}function m(e){let t=e.replace(/-----[^\n]+-----/g,``).replace(/[\r\n\s]/g,``),n=window.atob(t),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);return r.buffer}async function h(e,t){if(!window.crypto||!window.crypto.subtle)return null;try{let n=await(await fetch(`/cgi-bin/auth?action=challenge`,{cache:`no-store`})).json();if(!n||n.status!==`ok`||!n.public_key||!n.nonce)return null;let r=m(n.public_key),i=await window.crypto.subtle.importKey(`spki`,r,{name:`RSA-OAEP`,hash:`SHA-256`},!1,[`encrypt`]),a=JSON.stringify({user:e,pass:t,nonce:n.nonce,ts:n.timestamp||Date.now()}),o=new TextEncoder,s=await window.crypto.subtle.encrypt({name:`RSA-OAEP`},i,o.encode(a)),c=new Uint8Array(s),l=``;for(let e=0;e<c.byteLength;e++)l+=String.fromCharCode(c[e]);return{action:`login_encrypted`,payload:window.btoa(l),nonce:n.nonce}}catch(e){return console.warn(`Asymmetric credential encryption fell back:`,e),null}}async function g(){let e=document.getElementById(`loginUser`).value.trim(),t=document.getElementById(`loginPass`).value,n=document.getElementById(`loginErrMsg`),r=document.getElementById(`btnLogin`);n.style.display=`none`,r&&(r.disabled=!0);try{let r=null;try{r=await h(e,t)}catch{}r||(r={action:`login`,user:e,pass:t});let i=await(await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(r)})).json();i.status===`ok`?(localStorage.setItem(`maxnet_token`,i.token),p()):(n.innerText=i.message||`Invalid username or password`,n.style.display=`block`)}catch{n.innerText=`Authentication error. Check gateway connection.`,n.style.display=`block`}finally{r&&(r.disabled=!1)}}function _(){let e=document.getElementById(`logoutConfirmModal`);e&&(e.style.display=`flex`)}function v(){let e=document.getElementById(`logoutConfirmModal`);e&&(e.style.display=`none`)}async function y(){v();let e=localStorage.getItem(`maxnet_token`);e&&fetch(`/cgi-bin/auth?action=logout&token=`+e).catch(()=>{}),localStorage.removeItem(`maxnet_token`),f()}var b={"acc-usb-wan":{title:`USB WAN`,badge:`MULTI-WAN`,badgeColor:`#0ea5e9`},"acc-sys-info":{title:`Device Info`,badge:`HARDWARE & SYSTEM`,badgeColor:`#38bdf8`},"acc-network":{title:`Network`,badge:`LAN INTERFACE`,badgeColor:`#38bdf8`},"acc-interfaces":{title:`Interfaces`,badge:`WAN & INTERFACES`,badgeColor:`#0ea5e9`},"acc-pppoe":{title:`PPPoE Broadband`,badge:`CLIENT & SERVER`,badgeColor:`#06b6d4`},"acc-notifications":{title:`Notifications`,badge:`NOTIFICATIONS`,badgeColor:`#f59e0b`},"acc-webhooks":{title:`Webhooks`,badge:`WEBHOOKS`,badgeColor:`#0ea5e9`},"acc-topo-layers":{title:`Network Topology`,badge:`LAYERS 2 & 3`,badgeColor:`#38bdf8`},"acc-lan-clients":{title:`DHCP Clients`,badge:`CLIENT LEASES`,badgeColor:`#10b981`},"acc-gaming":{title:`Gaming Mode`,badge:`LOW LATENCY`,badgeColor:`#ec4899`},"acc-device-info":{title:`About Developer`,badge:`HARDWARE & USB`,badgeColor:`#a78bfa`},"acc-tailscale":{title:`Tailscale VPN`,badge:`ENCRYPTED MESH`,badgeColor:`#06b6d4`},"acc-adb-device":{title:`ADB Devices`,badge:`ANDROID & HARDWARE`,badgeColor:`#38bdf8`},"acc-smb-storage":{title:`Network Storage`,badge:`NAS STORAGE`,badgeColor:`#c084fc`},"acc-security":{title:`Security`,badge:`PROTECTION`,badgeColor:`#f59e0b`},"acc-diagnostics":{title:`Diagnostics`,badge:`DIAGNOSTICS`,badgeColor:`#38bdf8`},"acc-wifi":{title:`Wi-Fi & Hotspot`,badge:`WIRELESS`,badgeColor:`#10b981`},"acc-firmware":{title:`Firmware & OS Updates`,badge:`OS UPDATE`,badgeColor:`#38bdf8`},"acc-maintenance":{title:`Maintenance`,badge:`SYSTEM OPS`,badgeColor:`#ef4444`},"acc-logs":{title:`System Logs`,badge:`LIVE LOGS`,badgeColor:`#06b6d4`},"acc-sessions":{title:`Active Sessions & Sign Out`,badge:`SECURITY & SESSIONS`,badgeColor:`#ef4444`},"acc-packages":{title:`Packages`,badge:`SOFTWARE & PLUGINS`,badgeColor:`#38bdf8`},"acc-terminal-cli":{title:`Terminal Console`,badge:`ROOT SHELL`,badgeColor:`#10b981`},"acc-static-leases":{title:`Static IP Reservations`,badge:`DHCP LEASES`,badgeColor:`#06b6d4`},"acc-webui":{title:`Web UI`,badge:`INTERFACE`,badgeColor:`#c084fc`}};window._currentSettingPage=null;function x(e,t=!0){if(!e)return;e.includes(`&`)&&(e=e.split(`&`)[0]);let n=document.getElementById(`tabSettings`);window.innerWidth>=900&&n?window._savedSettingsScrollTop=n.scrollTop:window._savedSettingsScrollTop=window.scrollY||document.documentElement.scrollTop||0;let r=b[e]||{title:`Settings`},i=document.getElementById(`settingsHomeView`),a=document.getElementById(`settingsDetailPageView`),s=document.getElementById(`settingsDetailNavTitle`),c=document.getElementById(`settingsDetailNavIcon`);if(s&&(s.textContent=r.title),c){let t=document.querySelector(`.settings-nav-card[onclick*="'${e}'"]`),n=t?t.querySelector(`.snc-icon-box`):null;n?(c.innerHTML=n.innerHTML,c.style.color=n.style.color||`#38bdf8`):c.innerHTML=``}document.querySelectorAll(`.settings-detail-panel`).forEach(e=>{e.style.display=`none`,e.classList.remove(`page-active`)});let l=document.getElementById(e);if(l){l.style.display=`block`,l.classList.add(`page-active`);let e=l.querySelector(`.accordion-content`);e&&(e.style.maxHeight=`none`,e.style.overflow=`visible`)}if(i&&(i.style.display=`none`),a&&(a.style.display=`block`),n&&n.style.display===`none`&&P(`settings`,!0,!1),window._currentSettingPage=e,e===`acc-packages`)document.body.classList.remove(`terminal-active`),typeof To==`function`&&To();else if(e===`acc-smb-storage`)document.body.classList.remove(`terminal-active`),typeof rs==`function`&&rs(),typeof La==`function`&&La();else if(e===`acc-interfaces`)document.body.classList.remove(`terminal-active`),typeof xa==`function`&&xa();else if(e===`acc-pppoe`)document.body.classList.remove(`terminal-active`),typeof Da==`function`&&Da();else if(e===`acc-notifications`)document.body.classList.remove(`terminal-active`),typeof Za==`function`&&Za();else if(e===`acc-webhooks`)document.body.classList.remove(`terminal-active`),typeof io==`function`&&io();else if(e===`acc-sys-info`)document.body.classList.remove(`terminal-active`),typeof nc==`function`&&nc();else if(e===`acc-terminal-cli`)document.body.classList.add(`terminal-active`),typeof Vo==`function`&&Vo();else if(e===`acc-wifi`)document.body.classList.remove(`terminal-active`),typeof Ms==`function`&&Ms();else if(e===`acc-firmware`)document.body.classList.remove(`terminal-active`),typeof Es==`function`&&Es();else if(e===`acc-maintenance`)document.body.classList.remove(`terminal-active`),typeof po==`function`&&po();else if(e===`acc-network`||e===`acc-static-leases`)document.body.classList.remove(`terminal-active`),typeof _a==`function`&&_a();else if(e===`acc-tailscale`)document.body.classList.remove(`terminal-active`),typeof Jo==`function`&&Jo();else if(e===`acc-lan-clients`){document.body.classList.remove(`terminal-active`),typeof an==`function`&&an(o);let e=window.location.hash||``;if(e.includes(`&client=`)){let t=decodeURIComponent(e.split(`&client=`)[1].split(`&`)[0]);t&&ln(t,!1)}else un(!1)}else if(e===`acc-topo-layers`)document.body.classList.remove(`terminal-active`),typeof Xn==`function`&&Xn();else if(e===`acc-logs`)document.body.classList.remove(`terminal-active`),typeof po==`function`&&po();else if(e===`acc-sessions`)document.body.classList.remove(`terminal-active`),typeof Mi==`function`&&Mi();else if(e===`acc-security`)document.body.classList.remove(`terminal-active`),typeof bi==`function`&&bi();else if(e===`acc-usb-wan`)document.body.classList.remove(`terminal-active`),typeof loadUsbWanSettings==`function`&&loadUsbWanSettings(),typeof fetchUsbWanStatus==`function`&&fetchUsbWanStatus();else if(e===`acc-adb-device`){document.body.classList.remove(`terminal-active`),typeof Ci==`function`&&Ci();let e=window.location.hash||``;if(e.includes(`&dev=`)){let t=decodeURIComponent(e.split(`&dev=`)[1].split(`&`)[0]);t&&Ti(t,!1)}else Ei(!1)}if(t)try{history.pushState({tab:`settings`,page:`setting-detail`,settingId:e},``,`#setting=`+encodeURIComponent(e))}catch{}window.innerWidth>=900&&n?n.scrollTo({top:0,behavior:`instant`}):window.scrollTo({top:0,behavior:`instant`})}function S(e){return[`net_gw_ip`,`net_dns1`,`net_dns2`,`iface_static_ip`,`iface_static_gw`,`iface_static_dns`,`usb_ping_target`].includes(e)?`ipv4`:[`custom_mac`,`pppoe_mac_clone`].includes(e)?`mac`:[`device_hostname`].includes(e)?`hostname`:[`net_subnet`].includes(e)?`netmask`:[`dufs_port`,`pppoe_mtu`,`iface_mtu`,`usb_dev_mtu`].includes(e)?`integer_range`:[`telegram_bot_token`].includes(e)?`telegram_token`:[`discord_webhook_url`].includes(e)?`url`:`text`}function C(e,t){if(!e)return!0;let n=S(t),r=(e.value||``).trim(),i=document.getElementById(`modalInputValidationMsg`),a=document.getElementById(`btnModalSave`),o=!0,s=``,c=`Valid format`;if(n===`ipv4`)r?/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(r)?c=`Valid IPv4 address`:(o=!1,s=`Invalid IPv4 (expected format: 192.168.1.1)`):(o=!1,s=`IPv4 address cannot be empty`);else if(n===`mac`)r&&!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(r)?(o=!1,s=`Invalid MAC (expected format: AA:BB:CC:DD:EE:FF)`):c=r?`Valid MAC address`:`Default Hardware MAC`;else if(n===`hostname`)r?/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}$/.test(r)?c=`Valid RFC-compliant hostname`:(o=!1,s=`Only letters, numbers, hyphens, underscores (1-63 chars)`):(o=!1,s=`Hostname cannot be empty`);else if(n===`netmask`)isValidNetmask(r)?c=`Valid subnet mask`:(o=!1,s=`Invalid subnet mask (e.g. 255.255.255.0)`);else if(n===`integer_range`){let e=parseInt(r,10);t.includes(`mtu`)?isNaN(e)||e<576||e>1500?(o=!1,s=`MTU must be between 576 and 1500`):c=`Valid MTU packet size`:t.includes(`port`)&&(isNaN(e)||e<1||e>65535?(o=!1,s=`Port must be between 1 and 65535`):c=`Valid TCP/UDP port`)}else n===`url`?r&&!/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(r)?(o=!1,s=`Invalid URL (must start with http:// or https://)`):c=r?`Valid webhook URL`:`Optional URL`:n===`telegram_token`&&(r&&!/^[0-9]{8,11}:[a-zA-Z0-9_-]{35}$/.test(r)?(o=!1,s=`Format: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`):c=r?`Valid Telegram bot token`:`Optional token`);return i&&(o?(i.style.display=`block`,i.style.color=`#10b981`,i.innerHTML=`<span style="font-weight:700;">&#x2713;</span> ${c}`,e.style.borderColor=`#10b981`,e.style.boxShadow=`0 0 0 2px rgba(16,185,129,0.2)`):(i.style.display=`block`,i.style.color=`#ef4444`,i.innerHTML=`<span style="font-weight:700;">&#x2717; Error:</span> ${s}`,e.style.borderColor=`#ef4444`,e.style.boxShadow=`0 0 0 2px rgba(239,68,68,0.2)`)),a&&(a.disabled=!o,a.style.opacity=o?`1`:`0.4`,a.style.cursor=o?`pointer`:`not-allowed`),o}function w(e){setTimeout(()=>{let t=document.getElementById(`settingModalBody`);if(!t)return;let n=t.querySelector(`input.mh-input`);n&&(n.addEventListener(`input`,()=>C(n,e)),n.addEventListener(`keyup`,()=>C(n,e)),C(n,e))},60)}var T=null;async function E(){try{let e=await fetch(`/cgi-bin/usb_wan?action=status`,{cache:`no-store`});if(!e.ok)throw Error(`HTTP `+e.status);let t=await e.json();T=t;let n=document.getElementById(`usbWanGlobalBadge`),r=(t.devices||[]).filter(e=>e.present&&e.status===`connected`);n&&(n.textContent=r.length>0?`${r.length} CONNECTED`:`STANDBY`,n.className=`card-badge`,n.style.background=r.length>0?`rgba(14,165,233,0.12)`:`rgba(255,255,255,0.05)`,n.style.color=r.length>0?`#38bdf8`:`var(--text-dim)`,n.style.borderColor=r.length>0?`rgba(14,165,233,0.3)`:`rgba(255,255,255,0.1)`);let i=document.getElementById(`usbLbModeVal`);if(i&&t.load_balancing){let e=t.load_balancing.mode;i.textContent=e===`failover`?`Active Failover (Hot Standby)`:e===`broadcast`?`Broadcast Duplication`:`Balanced (Weighted Round-Robin)`}let a=document.getElementById(`usbWatchdogToggle`),o=document.getElementById(`usbWatchdogVal`);a&&t.load_balancing&&(a.checked=!!t.load_balancing.watchdog,o&&(o.textContent=t.load_balancing.watchdog?`Enabled`:`Disabled`));let s=document.getElementById(`usbPingTargetVal`);s&&t.load_balancing&&(s.textContent=t.load_balancing.ping_target||`1.1.1.1`);let c=document.getElementById(`usbPingIntervalVal`);c&&t.load_balancing&&(c.textContent=`${t.load_balancing.ping_interval||15} Seconds`);let l=document.getElementById(`usbDnsOverrideVal`);l&&t.load_balancing&&(l.textContent=t.load_balancing.dns_override||`1.1.1.1, 8.8.8.8`);let u=document.getElementById(`usbTetherProtoVal`);u&&t.load_balancing&&(u.textContent=(t.load_balancing.tether_proto||`rndis`).toUpperCase());let d=document.getElementById(`usbAutoReconnectToggle`),f=document.getElementById(`usbAutoReconnectVal`);d&&t.load_balancing&&(d.checked=!!t.load_balancing.auto_reconnect,f&&(f.textContent=t.load_balancing.auto_reconnect?`Enabled`:`Disabled`)),D(t.devices||[])}catch(e){console.warn(`loadUsbWanConfig error:`,e)}}function D(e){let t=document.getElementById(`usbWanDeviceListContainer`);t&&(t.innerHTML=!e||e.length===0?`
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
        `}).join(``))}async function O(){if(!T)return;let e=document.getElementById(`usbWatchdogToggle`),t=document.getElementById(`usbAutoReconnectToggle`),n=document.getElementById(`usbWatchdogVal`),r=document.getElementById(`usbAutoReconnectVal`);e&&(T.load_balancing.watchdog=e.checked,n&&(n.textContent=e.checked?`Enabled`:`Disabled`)),t&&(T.load_balancing.auto_reconnect=t.checked,r&&(r.textContent=t.checked?`Enabled`:`Disabled`));try{let e=await(await fetch(`/cgi-bin/usb_wan?action=save_config`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(T)})).json();e.status===`ok`?(showNotificationToast(`USB WAN configuration updated`),E()):showNotificationToast(`Failed to save USB WAN config: `+(e.error||`Unknown`),!0)}catch(e){showNotificationToast(`Error saving USB WAN config: `+e.message,!0)}}async function k(){ci(`restart_usb_modem`)}function A(e){T&&(T.devices||[]).find(t=>t.id===e)&&(window._editingUsbDevId=e,ci(`usb_device_edit`))}function j(){window._currentDhcpClientDetail?un(!0):window._currentAdbDeviceDetail&&window._currentAdbSubView&&window._currentAdbSubView!==`controls`?Cr(`controls`):window._currentAdbDeviceDetail?Ei(!0):M(!0)}function M(e=!0){if(window._currentDhcpClientDetail){un(e);return}if(window._currentAdbDeviceDetail){Ei(e);return}if(typeof yo==`function`&&yo(),e&&window.location.hash.startsWith(`#setting=`)){history.back();return}let t=document.getElementById(`settingsHomeView`),n=document.getElementById(`settingsDetailPageView`);if(n&&(n.style.display=`none`),t&&(t.style.display=`flex`),document.body.classList.remove(`terminal-active`),document.querySelectorAll(`.settings-detail-panel`).forEach(e=>{e.style.display=`none`,e.classList.remove(`page-active`)}),window._currentSettingPage=null,window.location.hash.startsWith(`#setting=`))try{history.replaceState({tab:`settings`,page:`settings-home`},``,`#settings`)}catch{}let r=document.getElementById(`tabSettings`),i=window._savedSettingsScrollTop||0;setTimeout(()=>{window.innerWidth>=900&&r?r.scrollTo({top:i,behavior:`instant`}):window.scrollTo({top:i,behavior:`instant`})},10)}function N(e){x(e,!0)}window.addEventListener(`popstate`,e=>{let t=document.getElementById(`factoryResetModalOverlay`);if(t&&t.style.display===`flex`){hs();return}if(window._isSettingModalOpen||document.getElementById(`settingEditModalOverlay`)&&document.getElementById(`settingEditModalOverlay`).style.display===`flex`){fi(!1);return}if(window._currentDhcpClientDetail){un(!1);return}if(window._currentAdbDeviceDetail){Ei(!1);return}let n=document.getElementById(`logoutConfirmModal`);if(n&&n.style.display!==`none`){v();return}let r=window.location.hash||``;if(window._currentSettingPage){if(r.startsWith(`#setting=`)){let e=decodeURIComponent(r.replace(`#setting=`,``)),t=e.split(`&`)[0];if(t&&t!==window._currentSettingPage)x(t,!1);else if(t===`acc-lan-clients`){if(e.includes(`&client=`)){let t=decodeURIComponent(e.split(`&client=`)[1].split(`&`)[0]);t&&ln(t,!1)}else un(!1)}else if(t===`acc-adb-device`){if(e.includes(`&dev=`)){let t=decodeURIComponent(e.split(`&dev=`)[1].split(`&`)[0]);t&&Ti(t,!1)}else Ei(!1)}}else r===`#settings`?M(!1):(M(!1),P(`overview`,!1,!1));return}let i=document.getElementById(`tabSettings`);if(i&&i.style.display!==`none`){if(r.startsWith(`#setting=`)){let e=decodeURIComponent(r.replace(`#setting=`,``)),t=e.split(`&`)[0];if(t&&(x(t,!1),t===`acc-adb-device`&&e.includes(`&dev=`))){let t=decodeURIComponent(e.split(`&dev=`)[1].split(`&`)[0]);t&&Ti(t,!1)}}else r!==`#settings`&&P(`overview`,!1,!1)}else if(r===`#settings`)P(`settings`,!1,!1);else if(r.startsWith(`#setting=`)){let e=decodeURIComponent(r.replace(`#setting=`,``)),t=e.split(`&`)[0];if(t&&(P(`settings`,!0,!1),x(t,!1),t===`acc-adb-device`&&e.includes(`&dev=`))){let t=decodeURIComponent(e.split(`&dev=`)[1].split(`&`)[0]);t&&Ti(t,!1)}}else P(`overview`,!1,!1)}),window.addEventListener(`load`,()=>{if(!history.state)try{history.replaceState({tab:`overview`},``,window.location.href)}catch{}if(window.location.hash.startsWith(`#setting=`)){let e=decodeURIComponent(window.location.hash.replace(`#setting=`,``)),t=e.split(`&`)[0];t&&setTimeout(()=>{if(P(`settings`,!0,!1),x(t,!1),t===`acc-adb-device`&&e.includes(`&dev=`)){let t=decodeURIComponent(e.split(`&dev=`)[1].split(`&`)[0]);t&&Ti(t,!1)}},150)}else window.location.hash===`#settings`&&setTimeout(()=>{P(`settings`,!1,!1)},150)});function ee(e){let t=(e||``).toLowerCase().trim(),n=document.getElementById(`settingsSearchClear`);n&&(n.style.display=t.length>0?`block`:`none`),document.querySelectorAll(`.settings-nav-card`).forEach(e=>{if(!t){e.style.display=`flex`;return}let n=(e.querySelector(`.snc-title`)||{}).textContent||``,r=(e.querySelector(`.snc-desc`)||{}).textContent||``,i=e.getAttribute(`data-search`)||``;(n+` `+r+` `+i).toLowerCase().includes(t)?e.style.display=`flex`:e.style.display=`none`})}function te(){let e=document.getElementById(`settingsSearchInput`);e&&(e.value=``,ee(``),e.focus())}window.addEventListener(`keydown`,e=>{if(e.key===`Escape`){let e=document.getElementById(`logoutConfirmModal`);if(e&&e.style.display!==`none`){v();return}if(window._currentSettingPage)M();else{let e=document.getElementById(`tabSettings`);e&&e.style.display!==`none`&&P(`overview`)}}});function P(e,t=!1,n=!0){let r=window.innerWidth>=900,i=document.getElementById(`dashboardContainer`),a=document.getElementById(`tabOverview`),o=document.getElementById(`tabSettings`),s=document.getElementById(`btnTopoMenu`);if(e===`settings`){if(Ci(),hr(),rs(),_a(),Jo(),To(),r)i&&i.classList.add(`settings-side-open`),a&&(a.style.display=`block`),o&&(o.style.display=`block`),s&&s.classList.add(`active`),typeof W==`function`&&(setTimeout(W,50),setTimeout(W,300));else{i&&i.classList.remove(`settings-side-open`),a&&(a.style.display=`none`),o&&(o.style.display=`block`),s&&s.classList.remove(`active`);let e=document.getElementById(`usbBwSvg`),t=document.querySelector(`.usb-bw-container`);if(e&&typeof e.pauseAnimations==`function`)try{e.pauseAnimations()}catch{}t&&t.classList.add(`topo-paused`)}if(!t&&window._currentSettingPage&&M(!1),n&&window.location.hash!==`#settings`&&!window.location.hash.startsWith(`#setting=`))try{history.pushState({tab:`settings`},``,`#settings`)}catch{}}else{window.scrollTo(0,0),i&&i.classList.remove(`settings-side-open`),a&&(a.style.display=`block`),o&&(o.style.display=`none`),s&&s.classList.remove(`active`);let e=document.getElementById(`usbBwSvg`),t=document.querySelector(`.usb-bw-container`);if(e&&typeof e.unpauseAnimations==`function`)try{e.unpauseAnimations()}catch{}if(t&&t.classList.remove(`topo-paused`),typeof W==`function`&&(setTimeout(W,50),setTimeout(W,300)),window._currentSettingPage&&M(!1),n&&window.location.hash!==``&&window.location.hash!==`#overview`)try{history.pushState({tab:`overview`},``,window.location.pathname)}catch{}}}function F(){let e=window.innerWidth>=900,t=document.getElementById(`dashboardContainer`),n=document.getElementById(`tabSettings`),r=t&&t.classList.contains(`settings-side-open`),i=n&&n.style.display!==`none`;P((e?r:i)?`overview`:`settings`)}function I(e){return e==null||isNaN(e)||e<=0?`var(--text-main)`:e<38?`var(--mh-emerald)`:e<=43?`var(--mh-gold)`:`var(--mh-rose)`}function L(e){return e==null||isNaN(e)||e<=0?`var(--text-main)`:e<60?`var(--mh-emerald)`:e<=80?`var(--mh-gold)`:`var(--mh-rose)`}function R(e){return!e||e<=0?`0.00 MB`:e>=1073741824?(e/1073741824).toFixed(2)+` GB`:(e/1048576).toFixed(2)+` MB`}async function z(){if(!window._isFetchingData){window._isFetchingData=!0;try{let e=await(await u(`/cgi-bin/status`)).json();Xt(e),typeof no==`function`&&no(e)}catch(e){console.error(`fetchData error`,e)}finally{window._isFetchingData=!1}}}function ne(e,t){let n=document.getElementById(`trafficSparklineCanvas`);if(!n)return;let r=n.getContext(`2d`);if(!r)return;let i=e&&e.length>=2?e:[0,0],a=t&&t.length>=2?t:[0,0],o=n.getBoundingClientRect(),s=window.devicePixelRatio||1,c=Math.round((o.width||160)*s),l=Math.round((o.height||34)*s);(n.width!==c||n.height!==l)&&(n.width=c,n.height=l),r.save(),r.scale(s,s);let u=c/s,d=l/s;r.clearRect(0,0,u,d);let f=document.documentElement.getAttribute(`data-theme`)===`light`;r.strokeStyle=f?`rgba(0, 0, 0, 0.06)`:`rgba(255, 255, 255, 0.05)`,r.lineWidth=1,r.beginPath(),r.moveTo(0,Math.round(d*.5)+.5),r.lineTo(u,Math.round(d*.5)+.5),r.stroke();let p=Math.max(2,...i,...a)*1.15,m=u/(i.length-1),h=u/(a.length-1),g=r.createLinearGradient(0,0,0,d);f?(g.addColorStop(0,`rgba(9, 9, 11, 0.22)`),g.addColorStop(1,`rgba(9, 9, 11, 0.01)`)):(g.addColorStop(0,`rgba(255, 255, 255, 0.35)`),g.addColorStop(1,`rgba(255, 255, 255, 0.01)`)),r.beginPath(),r.moveTo(0,d),i.forEach((e,t)=>{let n=d-e/p*(d-6)-3;r.lineTo(t*m,n)}),r.lineTo(u,d),r.closePath(),r.fillStyle=g,r.fill(),r.beginPath(),i.forEach((e,t)=>{let n=d-e/p*(d-6)-3;t===0?r.moveTo(0,n):r.lineTo(t*m,n)}),r.strokeStyle=f?`#09090b`:`#ffffff`,r.lineWidth=1.8,r.shadowColor=f?`rgba(0, 0, 0, 0.15)`:`rgba(255, 255, 255, 0.6)`,r.shadowBlur=f?0:4,r.stroke();let _=r.createLinearGradient(0,0,0,d);f?(_.addColorStop(0,`rgba(113, 113, 122, 0.15)`),_.addColorStop(1,`rgba(113, 113, 122, 0.01)`)):(_.addColorStop(0,`rgba(161, 161, 170, 0.22)`),_.addColorStop(1,`rgba(161, 161, 170, 0.01)`)),r.beginPath(),r.moveTo(0,d),a.forEach((e,t)=>{let n=d-e/p*(d-6)-3;r.lineTo(t*h,n)}),r.lineTo(u,d),r.closePath(),r.fillStyle=_,r.fill(),r.beginPath(),a.forEach((e,t)=>{let n=d-e/p*(d-6)-3;t===0?r.moveTo(0,n):r.lineTo(t*h,n)}),r.strokeStyle=f?`#71717a`:`#a1a1aa`,r.lineWidth=1.4,r.shadowColor=`transparent`,r.shadowBlur=0,r.stroke(),r.restore()}function re(e,t,n){if(!e||!e.links)return;let r=e.links,i=[`usb3a`,`usb3b`,`usb2a`,`usb2b`,`wan`],a=0;r.forEach((e,r)=>{if(r>=i.length)return;let o=i[r],s=document.getElementById(o),c=document.getElementById(`lbl-`+o),l=document.getElementById(`meta-`+o),u=document.getElementById(`path-`+o),d=document.getElementById(`dev-dot-`+o),f=e.status===`CONNECTED`,p=Number(e.speed_mbps||0);f&&r===0&&n>p&&(p=n),f&&(a+=p),s&&(s.textContent=p.toFixed(1)+` Mbps`,f?s.classList.remove(`offline`):s.classList.add(`offline`)),c&&(c.textContent=e.label||e.type.toUpperCase()+` #`+(r+1)),l&&(l.innerHTML=f?`<span class="link-live-badge active">CONNECTED</span> • ${$(t&&t.model?t.model:e.model||e.id)}`:`<span class="link-live-badge standby">STANDBY</span> • ${$(e.model||`Slot Ready`)}`),u&&(f?(u.style.opacity=`1`,u.style.strokeDasharray=`5 13`,u.style.animationPlayState=`running`):(u.style.opacity=`0.2`,u.style.strokeDasharray=`2 8`,u.style.animationPlayState=`paused`)),d&&(f?(d.style.opacity=`1`,d.style.animationPlayState=`running`):(d.style.opacity=`0.35`,d.style.animationPlayState=`paused`))});let o=document.getElementById(`combined`);o&&(o.textContent=Math.max(a,Number(e.combined_speed_mbps||0)).toFixed(1)+` Mbps`);let s=document.getElementById(`multilinkActiveSources`);s&&(s.textContent=`${String(e.active_count||1).padStart(2,`0`)} / 05 ACTIVE`);let c=document.getElementById(`multilinkMode`);c&&(c.textContent=e.mode||`AUTO MERGE`);let l=document.getElementById(`multilinkStatusText`);if(l){let t=e.active_count||1;l.textContent=t>1?`MULTI LINK ACTIVE • ${t} LINKS MERGED`:`MULTI LINK ACTIVE • AUTO MERGE`}}window.selectedFleetSlot=0,window._cachedMultilink=null,window._cachedAdbDevices=[],window._cachedMobile=null;function ie(e){window.selectedFleetSlot=e,oe(window._cachedMultilink,window._cachedAdbDevices,window._cachedMobile);let t=(window._cachedMultilink&&window._cachedMultilink.links||[])[e]||null,n=document.getElementById(`inspectDeviceLabel`);if(t&&t.status===`CONNECTED`){n&&(n.textContent=`SLOT #${String(e+1).padStart(2,`0`)} • ${t.model||t.label}`);let r=window._cachedAdbDevices||[],i=r[e]||r[0];i&&i.serial&&ae(i.serial)}else n&&(n.textContent=`SLOT #${String(e+1).padStart(2,`0`)} • STANDBY (Port Ready)`)}async function ae(e){try{let t=await(await u(`/cgi-bin/device?action=telemetry&serial=`+encodeURIComponent(e))).json();if(t&&t.status===`ok`){let e=t.identity||{},n=t.radio||{},r=t.battery||{},i=t.thermals||{},a=t.memory||{},o=document.getElementById(`topolPhoneModel`);o&&(o.innerText=e.model||`5G Modem`);let s=document.getElementById(`topolPhoneBatt`);s&&(s.innerText=`${r.level||79}% (${r.temp_c||35}°C)`);let c=document.getElementById(`topolPhoneCpu`);c&&(c.innerText=`${i.cpu_c||42}°C`);let l=document.getElementById(`topolPhoneRam`);l&&(l.innerText=`${a.used_pct||50}%`);let u=document.getElementById(`topolPhoneUptime`);u&&(u.innerText=t.uptime||`--`);let d=document.getElementById(`topolCarrier`);d&&(d.innerText=n.operator||`Jio True5G`);let f=document.getElementById(`topolServingBand`);f&&(f.innerText=`${n.band||`n77`} • 3.5 GHz`);let p=document.getElementById(`topolRsrp`);p&&(p.innerText=`${n.rsrp_dbm||-98} dBm`);let m=document.getElementById(`topolSinr`);m&&(m.innerText=`${n.sinr_db||11} dB`);let h=document.getElementById(`topolArfcn`);h&&(h.innerText=n.arfcn||`634080`);let g=document.getElementById(`topolServingName`);g&&(g.innerText=`Tower PCI ${n.pci||528}`)}}catch(e){console.error(`fetchSelectedSlotTelemetry error`,e)}}function oe(e,t,n){window._cachedMultilink=e,window._cachedAdbDevices=t||[],window._cachedMobile=n;let r=document.getElementById(`fleetMatrixGrid`);if(!r)return;let i=e&&Array.isArray(e.links)?e.links:[],a=0,o=rtrHardwareCard;for(let e=0;e<16;e++){let t=i[e]||{slot:e+1,status:`STANDBY`,type:e<8?`usb3`:e<15?`usb2`:`wan`,model:`Port Ready`,speed_mbps:0},n=t.status===`CONNECTED`;n&&a++;let r=e===window.selectedFleetSlot,s=String(e+1).padStart(2,`0`),c=t.type===`wan`?`WAN 1G`:t.type===`usb3`?`USB 3.0`:`USB 2.0`,l=n?t.model||`Connected Device`:`STANDBY`,u=n?`${Number(t.speed_mbps||0).toFixed(1)}M`:`Ready`;o+=`
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
        `}r.innerHTML=o;let s=document.getElementById(`fleetActiveCountText`);s&&(s.textContent=`${a} / 16 ACTIVE`)}var B=null,se=null;function ce(e){if(e==null||isNaN(e)||e<=0)return`--`;let t=Math.floor(e),n=Math.floor(t/86400),r=Math.floor(t%86400/3600),i=Math.floor(t%3600/60),a=t%60;return n>0?`${n}d ${r}h ${i}m ${a}s`:`${r}h ${i}m ${a}s`}function le(){if(window._mobUptimeBase&&window._mobUptimeTs){let e=Math.floor((Date.now()-window._mobUptimeTs)/1e3);return ce(window._mobUptimeBase+e)}return(window._lastDataCache&&window._lastDataCache.mobile||{}).uptime||`--`}function ue(){if(window._rtrUptimeBase&&window._rtrUptimeTs){let e=Math.floor((Date.now()-window._rtrUptimeTs)/1e3);return ce(window._rtrUptimeBase+e)}return(window._lastDataCache&&window._lastDataCache.router||{}).uptime||`--`}function de(e,t){let n=window._lastDataCache||{},r=document.getElementById(`topoHoverTooltip`);if(!r)return;let i={1:`22:6b:36:eb:30:fd`,2:`fe:b9:67:67:68:51`,3:`f2:fc:8e:af:33:47`,4:`16:be:81:63:99:91`},a=``,o=``,s=``,c=``,l=!1,u=!1;if(e===`modem`){let e=n.mobile||{},r=Array.isArray(n.usb_devices)?n.usb_devices:[],i=n.network&&n.network.lan_ip||window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`,d=H&&H[t]&&H[t].deviceData||r[t]||(t===0&&e.connected?{model:e.model,is_wan:!0,ip:e.lan_ip||e.ip||i,adb_enabled:!0,has_sim:e.has_sim!==!1,battery_pct:e.battery&&e.battery.level||null,operator:e.cellular&&e.cellular.operator||`Jio True5G`,band:e.cellular&&e.cellular.band||`n77`,rsrp_dbm:e.cellular&&e.cellular.rsrp_dbm||-97,standard:`USB 3.0`,speed_mbps:5e3,port:3}:null),f=(t===void 0?0:t)+1;if(a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,d){let e=d.device_type===`ssd`||d.device_type===`pendrive`||d.device_type===`storage`||d.has_storage;o=$(d.hostname||d.model||(e?`USB-Storage`:`Modem ${f}`));let t=`Phone`;if(d.device_type===`ssd`?t=`NVMe SSD`:(d.device_type===`pendrive`||d.device_type===`storage`||d.has_storage)&&(t=`USB Flash Drive`),s=$(d.model||t),e){a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><circle cx="7" cy="14" r="1"/><line x1="12" y1="14" x2="16" y2="14"/></svg>`;let e=d.virtual_ip||i,t=d.total_space&&d.total_space!==`--`?`${d.total_space} (${d.free_space||`0`} free)`:`Ready (Standby)`,n=d.mount_point||`/mnt/pendrive`,r=d.smb_running!==!1;l=!0,u=r;let o=r?`Online (io_uring)`:`Stopped`,s=r?`#10b981`:`#71717a`;c=`
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
          `}else if(e===`wan`){let e=n.network||{};o=`WAN`,s=$(e.wan_ip||`10.43.99.85`),a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>`,c=`
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">IP</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(e.wan_ip||`10.43.99.85`)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Gateway</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(e.gateway_ip||`10.43.99.79`)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">DNS</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${$(e.dns_ip||`10.43.99.79`)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Speed</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">1000 Mbps</strong>
            </div>
          </div>
        `}else if(e===`hub`){let e=n.usb_hub||{};o=`USB Hub`,s=e.model||`GL3523 USB 3.1 Hub`,a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="6" cy="12" r="1.5"/><circle cx="10" cy="12" r="1.5"/><circle cx="14" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>`;let t=e.manufacturer||`GenesysLogic`,r=e.model||`GL3523`,i=e.capacity||`5 Gbps (SuperSpeed)`,l=e.ports||4,u=e.usb3_ports||4,d=e.usb2_ports||4,f=e.connected_devices===void 0?n.usb_devices?n.usb_devices.length:2:e.connected_devices,p=e.speed_mbps?`${e.speed_mbps} Mbps`:`5 Gbps`;c=`
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
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:#00d2ff; margin-top:2px; display:block;">${Qe.cv?Qe.cv.textContent:`0`} Mbps</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Router Uptime</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--mh-emerald, #10b981); margin-top:2px; display:block; white-space:nowrap;">${ue()}</strong>
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
        `}else if(e===`lan`){let e=t!==void 0&&t>=1&&t<=4?t:2,r=`lan`+e,l=((n.network||{}).ports||[]).find(e=>e.id===r)||{id:r,speed:e===2||e===3?1e3:0,status:e===2||e===3?`up`:`down`},u=l.status===`up`,d=(n.clients||[]).filter(t=>{let n=(t.port||``).toLowerCase();return!!(n.includes(`lan `+e)||n.includes(`lan`+e)||e===3&&(n.includes(`switch`)||n.includes(`ap`))||!n&&e===2)});o=`LAN ${e}`,s=u?`Connected`:`Disconnected`,a=`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 10h10M7 14h10"/></svg>`,c=`
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
        `,i&&fe(i)}else if(e===`client`){let e=(n.clients||[])[t]||{},r=e.ip||``,i=r;if(e.name&&typeof e.name==`string`){let t=e.name.trim(),n=t.toLowerCase();n!==`device`&&n!==`unknown`&&t!==r&&t!==``&&(i=t)}let l=typeof ot==`function`?ot(e):{type:`client`,title:`LAN Device`,icon:`client`,color:`#10b981`,badge:`DEVICE`};o=$(i),s=$(r?`${r} · ${l.title}`:l.title),a=l.type===`phone`?`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`:l.type===`laptop`?`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20M12 16v4"/></svg>`:l.type===`nas`||l.type===`storage`?`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`:l.type===`cctv`?`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`:l.type===`router`?`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6" y2="14"/><line x1="18" y1="6" x2="18" y2="14"/><circle cx="6" cy="4" r="1"/><circle cx="18" cy="4" r="1"/></svg>`:`<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,c=`
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
        `,r&&fe(r)}r.innerHTML=`
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
      `}window._lastPingCache={};async function fe(e){if(e){if(window._lastPingCache[e]){let t=document.getElementById(`ttDevPing`);t&&(t.textContent=window._lastPingCache[e])}try{let t=await fetch(`/cgi-bin/diagnostics?tool=ping&target=`+encodeURIComponent(e));if(!t.ok)throw Error(`HTTP `+t.status);let n=(await t.json()).output||``,r=n.match(/min\/avg\/max\s*=\s*[\d.]+\/([\d.]+)\//),i=n.match(/time=([\d.]+)\s*ms/),a=`< 1 ms`;if(r){let e=parseFloat(r[1]);a=e<1?e.toFixed(2)+` ms`:e.toFixed(1)+` ms`}else if(i){let e=parseFloat(i[1]);a=e<1?e.toFixed(2)+` ms`:e.toFixed(1)+` ms`}else(n.includes(`100% packet loss`)||n.includes(`100.0% packet loss`))&&(a=`Offline / No reply`);window._lastPingCache[e]=a;let o=document.getElementById(`ttDevPing`);o&&(o.textContent=a)}catch{let t=document.getElementById(`ttDevPing`);t&&!window._lastPingCache[e]&&(t.textContent=`< 1 ms`)}}}function pe(e,t){let n=e&&e.currentTarget?e.currentTarget:null;if(window.innerWidth<768){let r=Math.min(330,window.innerWidth-20);t.style.width=r+`px`,t.style.left=`50%`,t.style.transform=`translateX(-50%)`;let i=80;if(n){let e=n.getBoundingClientRect();i=e.top>250?Math.max(70,e.top-200):Math.min(window.innerHeight-260,e.bottom+14)}else e&&e.clientY&&(i=Math.max(70,Math.min(window.innerHeight-260,e.clientY-120)));t.style.top=i+`px`}else{t.style.width=`320px`,t.style.transform=`none`;let r=0,i=0;if(n){let e=n.getBoundingClientRect();e.left<window.innerWidth*.45?(r=e.right+16,i=e.top-20):e.left>window.innerWidth*.65?(r=e.left-336,i=e.top-20):(r=e.left+e.width/2-160,i=e.top>240?e.top-220:e.bottom+16)}else e&&e.clientX&&(r=e.clientX+16,i=e.clientY-20);let a=Math.max(12,Math.min(window.innerWidth-334,r)),o=Math.max(70,Math.min(window.innerHeight-260,i));t.style.left=a+`px`,t.style.top=o+`px`}}function me(e,t,n=0){e&&e.stopPropagation&&e.stopPropagation(),B={type:t,index:n},window.showBadaTooltip=me;let r=document.getElementById(`topoHoverTooltip`);r&&(de(t,n),pe(e,r),r.style.display=`block`,requestAnimationFrame(()=>r.classList.add(`visible`)),se&&clearInterval(se),se=setInterval(()=>{B?B&&de(B.type,B.index):(clearInterval(se),se=null)},1500))}function he(e){e&&e.stopPropagation&&e.stopPropagation(),B=null,se&&(clearInterval(se),se=null);let t=document.getElementById(`topoHoverTooltip`);t&&(t.classList.remove(`visible`),setTimeout(()=>{B||(t.style.display=`none`)},150))}function ge(e){e&&e.stopPropagation&&e.stopPropagation(),he(e),typeof P==`function`&&P(`settings`),setTimeout(()=>{let e=document.getElementById(`acc-smb-storage`);e&&(e.classList.contains(`active`)||N(`acc-smb-storage`),e.scrollIntoView({behavior:`smooth`,block:`center`}))},100)}async function _e(e){e&&e.stopPropagation&&e.stopPropagation();let t=e&&e.target,n=t&&t.type===`checkbox`,r=document.getElementById(`badgeSmbMaster`),i=``;!n&&t&&(i=t.textContent,t.textContent=`...`);try{let e=await(await fetch(`/cgi-bin/smb_config?action=toggle`)).json();r&&(e&&e.running?(r.className=`toggle-status-badge on`,r.textContent=`RUNNING`,n&&(t.checked=!0)):(r.className=`toggle-status-badge off`,r.textContent=`STOPPED`,n&&(t.checked=!1))),typeof z==`function`&&await z(),B&&de(B.type,B.index),typeof rs==`function`&&rs()}catch(e){console.error(`Error toggling SMB:`,e),!n&&t&&(t.textContent=i)}}function ve(e,t,n=0){e&&(e.onclick=e=>{e.stopPropagation(),B&&B.type===t&&B.index===n?he(e):me(e,t,n)})}document.addEventListener(`click`,e=>{let t=document.getElementById(`topoHoverTooltip`);t&&t.classList.contains(`visible`)&&(t.contains(e.target)||he(e))}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&he(e)});var ye=1,be=0,xe=0;function Se(e){ye=Math.min(2.5,Math.max(.4,Math.round((ye+e)*100)/100)),we()}function Ce(){ye=1,be=0,xe=0,window._topoUserInteracted=!1,we()}function we(){let e=document.getElementById(`usbBwSvg`),t=document.getElementById(`topoZoomResetBtn`);e&&(e.style.transform=`translate3d(${be}px, ${xe}px, 0) scale(${ye})`,e.style.transformOrigin=`50% 50%`,e.style.transition=V?`none`:`transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`),t&&(t.textContent=`${Math.round(ye*100)}%`)}function Te(){let e=document.querySelector(`.usb-bw-container`),t=document.getElementById(`topoFsIcon`);if(!e)return;let n=e.classList.toggle(`topo-fullpage-mode`);t&&(t.innerHTML=n?`<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>`:`<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>`),Ce(),setTimeout(()=>{typeof W==`function`&&W()},60)}document.addEventListener(`keydown`,e=>{if(e.key===`Escape`){let e=document.querySelector(`.usb-bw-container`);e&&e.classList.contains(`topo-fullpage-mode`)&&Te()}});function Ee(e){window._topoActiveLayer=e||`all`,document.querySelectorAll(`.topo-layer-btn`).forEach(t=>{t.id===`topoLayerBtn_`+e||t.dataset.layer===e?t.classList.add(`active`):t.classList.remove(`active`)}),typeof W==`function`&&W()}var V=!1,De=!1,Oe=0,ke=0,Ae=0,je=0,Me=0,Ne=0,Pe=0,Fe=0,Ie=0,Le=null,Re=0;function ze(e=!1){let t=document.getElementById(`usbBwSvg`);if(!t)return;t.style.transition=e?`transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)`:`none`,t.style.transform=`translate(${be}px, ${xe}px) scale(${ye})`;let n=document.getElementById(`topoZoomResetBtn`);n&&(n.textContent=`${Math.round(ye*100)}%`)}function Be(){let e=document.querySelector(`#tabOverview .bw-box`);if(!e||e._panInitialized)return;e._panInitialized=!0,e.addEventListener(`mousedown`,t=>{t.target.closest(`button`)||t.target.closest(`.topo-toolbar`)||t.target.closest(`select`)||t.target.closest(`.round-action-btn`)||t.target.closest(`#topoMinimapContainer`)||(Le&&(cancelAnimationFrame(Le),Le=null),V=!0,De=!1,Oe=t.clientX,ke=t.clientY,Ae=be,je=xe,Me=t.clientX,Ne=t.clientY,Pe=performance.now(),Fe=0,Ie=0,e.style.cursor=`grabbing`)}),window.addEventListener(`mousemove`,e=>{if(!V)return;let t=e.clientX-Oe,n=e.clientY-ke;!De&&Math.hypot(t,n)>5&&(De=!0);let r=performance.now(),i=Math.max(1,r-Pe);Fe=(e.clientX-Me)/i,Ie=(e.clientY-Ne)/i,Me=e.clientX,Ne=e.clientY,Pe=r,be=Ae+t,xe=je+n,ze(!1)}),window.addEventListener(`mouseup`,()=>{V&&(V=!1,e&&(e.style.cursor=``),ze(!0),De&&setTimeout(()=>{De=!1},80))});let t=0,n=1;e.addEventListener(`touchstart`,e=>{e.target.closest(`button`)||e.target.closest(`.topo-toolbar`)||e.target.closest(`select`)||e.target.closest(`.round-action-btn`)||e.target.closest(`#topoMinimapContainer`)||(Le&&(cancelAnimationFrame(Le),Le=null),e.touches.length===1?(V=!0,De=!1,Oe=e.touches[0].clientX,ke=e.touches[0].clientY,Ae=be,je=xe,Me=e.touches[0].clientX,Ne=e.touches[0].clientY,Pe=performance.now(),Fe=0,Ie=0):e.touches.length===2&&(V=!1,t=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),n=ye))},{passive:!1}),e.addEventListener(`touchmove`,e=>{if(e.touches.length===1&&V){e.preventDefault();let t=e.touches[0].clientX,n=e.touches[0].clientY,r=t-Oe,i=n-ke;!De&&Math.hypot(r,i)>5&&(De=!0);let a=performance.now(),o=Math.max(1,a-Pe);Fe=(t-Me)/o,Ie=(n-Ne)/o,Me=t,Ne=n,Pe=a,be=Ae+r,xe=je+i,ze(!1)}else if(e.touches.length===2&&t>0){e.preventDefault();let r=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)/t;ye=Math.min(3,Math.max(.35,Math.round(n*r*100)/100)),ze(!1)}},{passive:!1}),e.addEventListener(`touchend`,e=>{if(e.touches.length===0){V=!1,t=0,De&&setTimeout(()=>{De=!1},80);let e=performance.now();if(e-Re<300){Re=0,ye>1.15?Je():(ye=1.45,ze(!0));return}if(Re=e,Math.hypot(Fe,Ie)>.15){let e=Fe*16,t=Ie*16,n=()=>{e*=.92,t*=.92,be+=e,xe+=t,ze(!1),Math.hypot(e,t)>.4?Le=requestAnimationFrame(n):(Le=null,ze(!0))};Le=requestAnimationFrame(n)}else ze(!0)}else e.touches.length===1&&(V=!0,Oe=e.touches[0].clientX,ke=e.touches[0].clientY,Ae=be,je=xe,t=0)}),e.addEventListener(`wheel`,e=>{e.preventDefault(),Se(e.deltaY<0?.12:-.12)},{passive:!1}),window.addEventListener(`keydown`,e=>{let t=document.getElementById(`tabOverview`);if(!t||t.style.display===`none`)return;let n=e.target&&e.target.tagName?e.target.tagName.toLowerCase():``;n!==`input`&&n!==`textarea`&&n!==`select`&&(e.key===`ArrowUp`?(e.preventDefault(),xe+=40,ze(!0)):e.key===`ArrowDown`?(e.preventDefault(),xe-=40,ze(!0)):e.key===`ArrowLeft`?(e.preventDefault(),be+=40,ze(!0)):e.key===`ArrowRight`?(e.preventDefault(),be-=40,ze(!0)):e.key===`+`||e.key===`=`?(e.preventDefault(),Se(.15)):e.key===`-`||e.key===`_`?(e.preventDefault(),Se(-.15)):e.key===`f`||e.key===`F`?(e.preventDefault(),Je()):e.key===`0`?(e.preventDefault(),Ce()):e.key===`Escape`&&(typeof Ge==`function`&&Ge(),typeof qe==`function`&&qe()))})}document.addEventListener(`DOMContentLoaded`,Be),setTimeout(Be,500);function Ve(){let e=document.getElementById(`usbBwSvg`),t=document.querySelector(`.usb-bw-container`);if(!e||!t)return;function n(n){if(n&&!document.hidden){if(typeof e.unpauseAnimations==`function`)try{e.unpauseAnimations()}catch{}t.classList.remove(`topo-paused`)}else{if(typeof e.pauseAnimations==`function`)try{e.pauseAnimations()}catch{}t.classList.add(`topo-paused`)}}`IntersectionObserver`in window&&(window._topoObserver&&window._topoObserver.disconnect(),window._topoObserver=new IntersectionObserver(e=>{e.forEach(e=>{let t=document.getElementById(`tabOverview`),r=t&&t.style.display!==`none`;n(e.isIntersecting&&r)})},{threshold:.05}),window._topoObserver.observe(t)),document.addEventListener(`visibilitychange`,()=>{let e=document.getElementById(`tabOverview`),t=e&&e.style.display!==`none`;n(!document.hidden&&t)})}document.addEventListener(`DOMContentLoaded`,Ve),setTimeout(Ve,600);var He=null,Ue=!1;function We(e,t,r){if(r&&r.stopPropagation&&r.stopPropagation(),De||V)return;He=e,Ue=!!t;let i=document.getElementById(`topoNodeDetailOverlay`);if(!i)return;i.parentElement!==document.body&&document.body.appendChild(i);let a=document.getElementById(`topoNodeDetailTitle`),o=document.getElementById(`topoNodeDetailSub`),s=document.getElementById(`topoNodeDetailStatusBadge`),c=document.getElementById(`topoNodeDetailIconBox`),l=document.getElementById(`topoNodeDetailBody`),u=document.getElementById(`btnTopoNodeViewClient`),d=document.getElementById(`btnTopoNodeEditSettings`),f=document.getElementById(`btnTopoNodeUnblock`);f&&(f.style.display=`none`);let p=document.documentElement.getAttribute(`data-theme`)===`light`,m=p?`rgba(0, 0, 0, 0.025)`:`rgba(255, 255, 255, 0.03)`,h=p?`rgba(0, 0, 0, 0.08)`:`rgba(255, 255, 255, 0.06)`,g=p?`#64748b`:`var(--text-dim, #94a3b8)`,_=p?`#0f172a`:`var(--text-main, #eef3f5)`,v=p?`#475569`:`rgba(255, 255, 255, 0.65)`,y=window._lastDataCache||{},b=Array.isArray(y.clients)?y.clients:[],S=y.router||{},C=y.network||{},w=Array.isArray(y.usb_devices)&&y.usb_devices[0]||{},T=y.mobile||{},E=Array.isArray(C.ports)?C.ports:[];function D(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function O(e){return!e||e===`--`?``:`<button type="button" class="round-action-btn" onclick="navigator.clipboard.writeText('${e}'); if(typeof showToast==='function')showToast('Copied: ${e}');" title="Copy" style="width:20px; height:20px; min-width:20px; border:none; background:transparent; cursor:pointer; color:currentColor; display:inline-flex; align-items:center; justify-content:center; opacity:0.75;"><svg viewBox="0 0 24 24" style="width:11px; height:11px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>`}function k(e,t,n,r){return`
          <div style="background:${m}; padding:10px 12px; border-radius:8px; border:1px solid ${h}; ${r?`grid-column:1 / -1;`:``} display:flex; flex-direction:column; justify-content:center; min-width:0; overflow:hidden; word-break:break-word;">
            <div style="color:${g}; font-size:9.5px; font-weight:800; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${D(e)}</div>
            <div style="color:${_}; font-weight:700; font-size:12px; font-family:var(--font-mono); display:flex; align-items:center; justify-content:space-between; gap:6px; min-width:0;">
              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0;">${t}</span>
            </div>
            ${n?`<div style="font-size:10px; color:${v}; font-family:var(--font-mono); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0;">${n}</div>`:``}
          </div>
        `}if(e.type===`wan`){let t=w.device_type===`storage`||w.device_type===`ssd`||w.device_type===`pendrive`||w.has_storage,n=e.ip||C.wan_ip||w.dhcp_ip||`--`,r=w.model||T&&T.model||(t?`USB Storage`:`USB Modem`);if(a&&(a.textContent=t?w.model||`USB Storage Drive`:r),o&&(o.textContent=`WAN Uplink • Interface: ${w.net_interface||`usb0`} (USB 3.0)`),s){let e=T.connected||w.status===`online`||w.has_internet;s.textContent=e?`ONLINE`:`CONNECTING`,s.className=`card-badge `+(e?`emerald`:`amber`)}c&&(c.style.background=t?`rgba(192,132,252,0.12)`:`rgba(56,189,248,0.12)`,c.style.color=t?`#c084fc`:`#38bdf8`,c.innerHTML=t?`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="6" y="2" width="12" height="14" rx="2"/><rect x="9" y="16" width="6" height="6"/><line x1="10" y1="19" x2="10" y2="20"/><line x1="14" y1="19" x2="14" y2="20"/></svg>`:`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`);let f=[];f.push(k(`WAN IP Address`,`<span>${D(n)}</span> ${O(n)}`,`DHCP Upstream Carrier Lease`));let p=w.standard||S.usb?.link_mode||`USB 3.0 SuperSpeed`,m=w.speed_mbps||S.usb?.speed_mbps||5e3;if(f.push(k(`USB Hardware Link`,`${D(p)} (${m} Mbps)`,`Bus: ${w.bus||`2-1`} • Port: ${w.port||`1`}`)),t)f.push(k(`Storage Partitions`,`${D(w.mount_point||`/mnt/storage`)}`,`Total: ${D(w.total_space||`--`)} • Free: ${D(w.free_space||`--`)}`)),f.push(k(`File Sharing (SMB)`,`${w.smb_running?`SMB Active`:`SMB Stopped`}`,`Share: ${D(w.share_path||`\\\\10.0.0.1\\Storage`)}`));else{let e=w.operator||T.cellular?.operator||`Jio`,t=w.network||T.cellular?.network||`5G SA (NR)`,n=T.cellular?.bars===void 0?`Full Signal`:`${T.cellular.bars}/4 Bars`,r=T.cellular?.rsrp_dbm?` (${T.cellular.rsrp_dbm} dBm)`:``;f.push(k(`Cellular Network`,`${D(e)} • ${D(t)}`,`Signal: ${n}${r}`));let i=w.battery_pct??T.battery?.level??`--`,a=w.battery_temp_c??T.battery?.temp_c??`--`;f.push(k(`Phone Battery & Thermals`,`${i}% Battery (${T.battery?.status||`Normal`})`,`Temp: ${a}°C • SoC: Normal`))}let h=e.speed||`${(window._currentRxMbps+window._currentTxMbps).toFixed(3)} Mbps`,g=S.usb?.rx_mb||0,_=S.usb?.tx_mb||0,v=g>1024?(g/1024).toFixed(2)+` GB`:g.toFixed(1)+` MB`,y=_>1024?(_/1024).toFixed(2)+` GB`:_.toFixed(1)+` MB`;f.push(k(`Live Throughput`,`<span style="color:#10b981;">${D(h)}</span>`,`Session: Rx ${v} • Tx ${y}`)),f.push(k(`Device Features`,`<span class="card-badge emerald" style="font-size:9.5px; margin-right:4px;">Tethering Active</span> <span class="card-badge sky" style="font-size:9.5px;">ADB: ${w.adb_enabled?`Enabled`:`Disabled`}</span>`,`USB High-Speed Connection`)),l&&(l.innerHTML=`<div class="topo-details-grid">${f.join(``)}</div>`),u&&(u.style.display=`none`),d&&(d.textContent=`NETWORK SETTINGS`,d.onclick=()=>{Ge(),typeof P==`function`&&P(`settings`),typeof x==`function`&&x(`acc-interfaces`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}if(e.id===`root`||e.type===`router`&&!e.uplinkPort){let t=S.hostname||e.name||`MAXNET`,n=e.ip||`10.0.0.1`,r=e.mac||b.find(e=>e.is_self)?.mac||`ce:b2:bb:ae:4d:16`,f=S.model||`Qualcomm IPQ9574 AX6000`,p=S.kernel||`Linux 6.18`;a&&(a.textContent=`${t} (Gateway)`),o&&(o.textContent=`${f} • ${p}`),s&&(s.textContent=`ONLINE`,s.className=`card-badge emerald`),c&&(c.style.background=`rgba(16,185,129,0.12)`,c.style.color=`#10b981`,c.innerHTML=`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`);let m=[];m.push(k(`Gateway LAN IP`,`<span>${D(n)}</span> ${O(n)}`,`MAC: ${D(r)}`));let h=S.uptime||`--`,g=Array.isArray(S.load_avg)?S.load_avg.join(`, `):`--`;m.push(k(`System Uptime`,`${D(h)}`,`Load Avg: ${D(g)}`));let _=S.cpu_pct===void 0?`--`:`${S.cpu_pct}%`;m.push(k(`CPU Processor Load`,`${D(_)} Active`,`Qualcomm Quad-Core SoC`));let v=S.memory?.used_pct===void 0?`--`:`${S.memory.used_pct}%`,y=S.memory?.used_mb||`--`,C=S.memory?.total_mb||`--`;m.push(k(`Memory (RAM)`,`${v} Used (${y} / ${C} MB)`,`${S.memory?.available_mb||`--`} MB Available Free`));let w=S.temp_c===void 0?`--`:`${S.temp_c.toFixed(1)}°C`;m.push(k(`Core Temperature`,`${w}`,`All Thermal Zones Optimal`));let T=b.filter(e=>!e.is_self&&e.connected).length;m.push(k(`Connected Clients`,`${T} Active Devices`,`Wired LAN & Wireless Network`)),l&&(l.innerHTML=`<div class="topo-details-grid">${m.join(``)}</div>`),u&&(u.style.display=`none`),d&&(d.textContent=`SYSTEM INFO`,d.onclick=()=>{Ge(),typeof P==`function`&&P(`settings`),typeof x==`function`&&x(`acc-sys-info`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}if(e.type===`ap`||e.type===`router`&&e.uplinkPort){let t=e.name||`Sub-Router`,n=e.ip||`--`,r=e.mac||`--`,f=b.find(e=>e.ip===n||e.mac===r),v=e.metrics?.vendor||f?.vendor||`Broadcom / Reliance`,y=e.uplinkPort?e.uplinkPort.replace(`root-`,``).toUpperCase():`LAN 3`,S=Array.isArray(e.wireless_clients)?e.wireless_clients:[];a&&(a.textContent=`${t}`),o&&(o.textContent=`Access Point / Sub-Router • ${n}`),s&&(s.textContent=`ONLINE`,s.className=`card-badge emerald`),c&&(c.style.background=`rgba(56,189,248,0.12)`,c.style.color=`#38bdf8`,c.innerHTML=`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`);let C=[];if(C.push(k(`IP Address`,`<span>${D(n)}</span> ${O(n)}`,`Hostname: ${D(t)}.lan`)),C.push(k(`MAC & Hardware`,`${D(r)}`,`Vendor: ${D(v)}`)),C.push(k(`Gateway Uplink`,`Port ${D(y)}`,`Link Speed: 1000 Mbps Full Duplex`)),C.push(k(`Sub-Clients Count`,`${S.length} Wireless Clients`,`Bridged Network Traffic`)),S.length>0){let e=S.map(e=>`
            <div style="background:${p?`rgba(0,0,0,0.02)`:`rgba(255,255,255,0.02)`}; padding:8px 10px; border-radius:6px; border:1px solid ${h}; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; color:${_}; font-size:11px;">${D(e.name||`Wireless Device`)}</div>
                <div style="font-size:10px; color:${g};">${D(e.ip||`--`)} &bull; ${D(e.mac||`--`)}</div>
              </div>
              <div style="text-align:right;">
                <span class="card-badge sky" style="font-size:9px;">${D(e.linkSpeed||`72 Mbps`)}</span>
                ${e.metrics?.ping_avg_ms?`<div style="font-size:9.5px; color:#10b981; margin-top:2px;">${e.metrics.ping_avg_ms} ms</div>`:``}
              </div>
            </div>
          `).join(``);C.push(`
            <div style="background:${m}; padding:10px 12px; border-radius:8px; border:1px solid ${h}; grid-column:span 2;">
              <div style="color:${g}; font-size:9.5px; font-weight:800; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Clients Connected Behind This AP:</div>
              <div style="display:flex; flex-direction:column; gap:6px; max-height:160px; overflow-y:auto;">${e}</div>
            </div>
          `)}l&&(l.innerHTML=`<div class="topo-details-grid">${C.join(``)}</div>`),u&&(u.style.display=`none`),d&&(d.textContent=`DHCP CLIENTS`,d.onclick=()=>{Ge(),typeof P==`function`&&P(`settings`),typeof x==`function`&&x(`acc-lan-clients`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}if(t){let t=e,n=t.id?t.id.replace(`root-`,``):(t.label||``).toLowerCase().replace(/\s+/g,``),r=E.find(e=>e.id===n)||{},f=r.status===`up`||t.role&&t.role!==`empty`,p=t.label||n.toUpperCase();a&&(a.textContent=`Port ${p}`),o&&(o.textContent=`Physical Ethernet Bay • Qualcomm IPQ9574 Switch`),s&&(s.textContent=f?`LINK UP (${r.speed||1e3}M)`:`DISCONNECTED`,s.className=`card-badge `+(f?`emerald`:`gray`)),c&&(c.style.background=f?`rgba(16,185,129,0.12)`:`rgba(148,163,184,0.12)`,c.style.color=f?`#10b981`:`#94a3b8`,c.innerHTML=`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M7 16h10M7 8h2m6 0h2M10 8v4m4-4v4"/></svg>`);let m=t.child||{},h=m.name||m.ip||(f?`Connected Entity`:`Empty Port Socket`),g=m.ip||`--`,_=[];_.push(k(`Port Link State`,f?`<span style="color:#10b981;">Up (${r.speed||1e3} Mbps ${r.duplex?r.duplex.toUpperCase():`FULL DUPLEX`})</span>`:`<span style="color:#94a3b8;">Down • No Link</span>`,`Port Identifier: ${D(n.toUpperCase())}`)),_.push(k(`Hardware Port Bay`,`Gigabit Ethernet (10/100/1000M)`,`Auto-Negotiation • Auto-MDI/MDIX`)),_.push(k(`Attached Entity`,`<span>${D(h)}</span>`,g===`--`?`No attached device detected`:`IP: ${D(g)}`,!0)),l&&(l.innerHTML=`<div class="topo-details-grid">${_.join(``)}</div>`),u&&(u.style.display=`none`),d&&(d.textContent=`SWITCH PORTS`,d.onclick=()=>{Ge(),typeof P==`function`&&P(`settings`),typeof x==`function`&&x(`acc-switch`)}),i.style.display=`flex`,requestAnimationFrame(()=>i.classList.add(`active`));return}let A=e,j=b.find(e=>A.ip&&e.ip===A.ip||A.mac&&e.mac===A.mac),M=A.ip||j?.ip||`--`,N=A.mac||j?.mac||`--`,ee=A.name||j?.name||M||`Client Device`,te=j?j.connected:A.status!==`offline`,F=!!(A.band||A.linkSpeed||j&&j.port&&j.port.toLowerCase().includes(`wifi`)||A.uplinkPort&&A.uplinkPort.includes(`ap`)),I=A.metrics?.vendor||j?.vendor||`Network Device`,L=!!(A.blocked||j?.blocked||n!==void 0&&n.has(M));a&&(a.textContent=`${ee}`),o&&(o.textContent=`${F?`Wi-Fi Wireless Client`:`Wired Ethernet Client`} • ${M}${L?` • FIREWALL BLOCKED`:``}`),s&&(L?(s.textContent=`BLOCKED`,s.className=`card-badge ruby`):(s.textContent=te?`ONLINE`:`OFFLINE`,s.className=`card-badge `+(te?`emerald`:`gray`))),c&&(c.style.background=L?`rgba(239,68,68,0.12)`:F?`rgba(56,189,248,0.12)`:`rgba(16,185,129,0.12)`,c.style.color=L?`#ef4444`:F?`#38bdf8`:`#10b981`,c.innerHTML=F?`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`:`<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`);let R=[];L&&R.push(k(`Firewall Access Policy`,`<span style="color:#ef4444; font-weight:800;">BLOCKED FROM NETWORK</span>`,`All incoming & outgoing traffic dropped by firewall`,!0)),R.push(k(`IP Address`,`<span>${D(M)}</span> ${O(M)}`,j?.ipv6?`IPv6: ${D(j.ipv6)}`:`DHCP Assigned Address`)),R.push(k(`MAC & Hardware`,`${D(N)}`,`Vendor: ${D(I)}`));let ne=F?`Wi-Fi (${A.linkSpeed||`72 Mbps`})`:A.uplinkPort?`Port ${A.uplinkPort.replace(`root-`,``).toUpperCase()}`:j?.port||`LAN Ethernet`,re=F?`Connected via maxnet-b AP`:`Link: 1000 Mbps Full Duplex`;R.push(k(`Network Connection`,D(ne),D(re)));let ie=A.metrics?.ping_avg_ms?`${A.metrics.ping_avg_ms} ms`:te?`< 1.5 ms`:`--`,ae=A.metrics?.loss_pct===void 0?`Active Network Latency`:`${A.metrics.loss_pct}% Packet Loss`;R.push(k(`Latency / Ping`,ie,ae));let oe=j?.rx_mb?`${j.rx_mb} MB`:`--`,B=j?.tx_mb?`${j.tx_mb} MB`:`--`,se=j?.total_mb?`${j.total_mb} MB`:`--`;R.push(k(`Session Traffic (Data)`,`Rx: ${oe} • Tx: ${B}`,`Total Lifetime: ${se}`));let ce=j?.dns_name||j?.mdns||ee;R.push(k(`Device Hostname`,`${D(ce)}`,`Filter: ${L?`BLOCKED`:`Traffic Permitted`}`)),l&&(l.innerHTML=`<div class="topo-details-grid">${R.join(``)}</div>`),f&&(L?(f.style.display=`inline-block`,f.onclick=async()=>{await or(M,N),Ge(),typeof Q==`function`&&Q(`Unblocked device ${M}`,`success`),typeof z==`function`&&z()}):f.style.display=`none`),u&&(u.style.display=M===`--`?`none`:`inline-block`,u.textContent=`VIEW CLIENT DETAILS`,u.onclick=()=>{Xe()}),d&&(d.textContent=`DHCP LEASES`,d.onclick=()=>{Ge(),typeof P==`function`&&P(`settings`),typeof x==`function`&&x(`acc-lan-clients`)}),typeof Vt==`function`&&Vt(e),i.style.display=`flex`,requestAnimationFrame(()=>{i.classList.add(`active`)})}function Ge(){let e=document.getElementById(`topoNodeDetailOverlay`);e&&(e.classList.remove(`active`),e.style.display=`none`),He=null,typeof Vt==`function`&&Vt(null)}function Ke(e,t){t&&t.stopPropagation&&t.stopPropagation();let n=document.getElementById(`topoEvidenceModalOverlay`);if(!n)return;n.parentElement!==document.body&&document.body.appendChild(n);let r=document.getElementById(`topoEvidenceModalTitle`),i=document.getElementById(`topoEvidenceModalSub`),a=document.getElementById(`topoEvidenceConfidenceBadge`),o=document.getElementById(`topoEvidenceModalBody`),s=e&&e.confidence||(e&&e.evidence&&e.evidence.length>=2?`High`:`Medium`);r&&(r.textContent=(e&&(e.name||e.ip)||`Network Node`)+` Evidence`),i&&(i.textContent=`Role: ${(e&&e.type?e.type:`device`).toUpperCase()} \u2022 IP: ${e&&e.ip||`--`} \u2022 MAC: ${e&&e.mac||`--`}`),a&&(a.textContent=`${s.toUpperCase()} CONFIDENCE`,a.className=`card-badge `+(s===`High`?`emerald`:s===`Medium`?`sky`:`amber`));let c=e&&Array.isArray(e.evidence)&&e.evidence.length>0?e.evidence:[e&&e.type===`router`?`Host Gateway configured as primary network router`:e&&e.type===`ap`?`Identified as infrastructure node via multi-MAC bridge port`:`Direct client connected to local network interface`],l=e&&e.metrics||{},u=``;(l.ping_avg_ms!==void 0||l.vendor||l.port_mac_count!==void 0)&&(u=`
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
        `),n.style.display=`flex`,requestAnimationFrame(()=>n.classList.add(`active`))}function qe(){let e=document.getElementById(`topoEvidenceModalOverlay`);e&&(e.classList.remove(`active`),e.style.display=`none`)}function Je(){Ce()}function Ye(){let e=He,t=Ue;Ge(),typeof P==`function`&&P(`settings`),setTimeout(()=>{let n=document.getElementById(`acc-topo-layers`);if(n&&!n.classList.contains(`active`)&&N(`acc-topo-layers`),e){let n=t?`topoPortRow_`+e.id:`topoNodeCard_`+e.id,r=document.getElementById(n);r&&(r.scrollIntoView({behavior:`smooth`,block:`center`}),r.style.borderColor=`#38bdf8`,setTimeout(()=>{r.style.borderColor=``},2500))}},150)}function Xe(){let e=He;Ge(),e&&e.ip&&typeof ln==`function`&&(typeof P==`function`&&P(`settings`),setTimeout(()=>{ln(e.ip,!0)},150))}var Ze=`http://www.w3.org/2000/svg`,Qe={},H=[],U=(e,t,n)=>{let r=document.createElementNS(Ze,e);for(let e in t)r.setAttribute(e,t[e]);return n.appendChild(r),r};function $e(e,t,n,r){let i=U(`g`,{transform:`translate(${e}, ${t})`,style:`color:${n}; pointer-events:none;`},r);return U(`circle`,{cx:2.8,cy:2,r:1.4,fill:`none`,stroke:`currentColor`,"stroke-width":.95},i),U(`path`,{d:`M 0.5 7.2 C 0.5 4.8, 5.1 4.8, 5.1 7.2`,fill:`none`,stroke:`currentColor`,"stroke-width":.95,"stroke-linecap":`round`},i),i}function et(e,t,n,r){let i=U(`g`,{transform:`translate(${e}, ${t-11})`,style:`color:${n}; pointer-events:none;`},r);return U(`rect`,{x:0,y:0,width:13,height:22,rx:3,ry:3,fill:`none`,stroke:`currentColor`,"stroke-width":1.25},i),U(`line`,{x1:4.5,y1:3,x2:8.5,y2:3,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i),U(`circle`,{cx:6.5,cy:18.5,r:1,fill:`currentColor`},i),i}function tt(e,t,n,r){let i=U(`g`,{transform:`translate(${e}, ${t-11})`,style:`color:${n}; pointer-events:none;`},r);return U(`rect`,{x:3.5,y:0,width:7,height:2.5,rx:.5,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),U(`rect`,{x:0,y:2,width:14,height:20,rx:2.5,ry:2.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.25},i),U(`line`,{x1:3,y1:7,x2:11,y2:7,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i),U(`line`,{x1:3,y1:10,x2:11,y2:10,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i),U(`rect`,{x:3,y:14.5,width:5,height:3.5,rx:.6,fill:`none`,stroke:`currentColor`,"stroke-width":.8},i),U(`circle`,{cx:10.5,cy:16.5,r:1,fill:`currentColor`},i),i}function nt(e,t,n,r){let i=U(`g`,{transform:`translate(${e}, ${t-11})`,style:`color:${n}; pointer-events:none;`},r);return U(`rect`,{x:3.5,y:0,width:7,height:5,rx:.5,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),U(`line`,{x1:5.2,y1:2,x2:5.2,y2:3.5,stroke:`currentColor`,"stroke-width":.8,"stroke-linecap":`round`},i),U(`line`,{x1:8.8,y1:2,x2:8.8,y2:3.5,stroke:`currentColor`,"stroke-width":.8,"stroke-linecap":`round`},i),U(`rect`,{x:1.5,y:5,width:11,height:16,rx:2,ry:2,fill:`none`,stroke:`currentColor`,"stroke-width":1.25},i),U(`line`,{x1:3.5,y1:11,x2:10.5,y2:11,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i),U(`circle`,{cx:7,cy:17.5,r:1.2,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),i}function rt(e){if(!e)return`Unknown Device`;let t=(e.ip||``).trim(),n=(e.mac||``).toLowerCase().trim();if(typeof getCustomDeviceName==`function`){let e=getCustomDeviceName(n||t);if(e&&e.trim())return e.trim()}if(t===`10.0.0.166`||n===`a8:1b:5a:c3:01:13`||n.startsWith(`a8:1b:5a`))return`OPPO A37`;let r=(e.hostname||e.dhcp_hostname||e.dhcp_name||``).trim();if(r&&r!==`*`&&!it(r,t)){let e=at(r);if(e&&e.toLowerCase()!==`device`&&e.toLowerCase()!==`unknown`)return e}let i=(e.name||``).trim();if(i&&!it(i,t)&&!i.toLowerCase().startsWith(`device`)&&!i.toLowerCase().startsWith(`unknown`)){let e=at(i);if(e&&e.toLowerCase()!==`device`&&e.toLowerCase()!==`unknown`)return e}let a=(e.mdns||e.dns_name||``).trim();if(a&&!it(a,t)){let e=at(a.replace(/\.local$/i,``).replace(/\.lan$/i,``));if(e&&e.toLowerCase()!==`device`&&e.toLowerCase()!==`unknown`)return e}let o=(e.vendor||e.metrics&&e.metrics.vendor||``).trim();return o&&!o.toLowerCase().includes(`unknown`)&&!it(o,t)?at(o):`Unknown Device`}function it(e,t){if(!e)return!1;let n=e.toLowerCase();return!!(t===`10.0.0.166`&&(n.includes(`asus`)||n.includes(`router`)||n.includes(`ap`)))}function at(e){return e?e.replace(/\.lan$/i,``).replace(/\.local$/i,``).replace(/\s*\[(PC|PHONE|STORAGE|ROUTER|CCTV|TV)\]/gi,``).trim():`Unknown Device`}function ot(e){if(!e)return{type:`client`,title:`LAN Device`,icon:`client`,color:`#10b981`,badge:`DEVICE`};let t=(e.name||``).toLowerCase(),n=(e.mac||``).toLowerCase(),r=e.ip||``;return t.includes(`synology`)||t.includes(`nas`)||t.includes(`storage`)||t.includes(`qnap`)||t.includes(`truenas`)||n.startsWith(`00:11:32`)||r===`10.0.0.5`?{type:`nas`,title:`Synology NAS`,icon:`nas`,color:`#c084fc`,badge:`STORAGE`}:t.includes(`cam`)||t.includes(`cctv`)||t.includes(`dvr`)||t.includes(`nvr`)||t.includes(`ipc`)||t.includes(`ipcam`)||t.includes(`hikvision`)||t.includes(`dahua`)||t.includes(`cp plus`)||t.includes(`cpplus`)||t.includes(`reolink`)||t.includes(`axis`)||t.includes(`ezviz`)||t.includes(`imou`)||t.includes(`uniview`)||t.includes(`lorex`)||t.includes(`swann`)||t.includes(`v380`)||t.includes(`yoosee`)?{type:`cctv`,title:`CCTV / IP Cam`,icon:`cctv`,color:`#f59e0b`,badge:`CCTV`}:t.includes(`phone`)||t.includes(`poco`)||t.includes(`v2153`)||t.includes(`iphone`)||t.includes(`ipad`)||t.includes(`samsung`)||t.includes(`galaxy`)||t.includes(`redmi`)||t.includes(`xiaomi`)||t.includes(`vivo`)||t.includes(`oppo`)||t.includes(`realme`)||t.includes(`oneplus`)||t.includes(`pixel`)||t.includes(`android`)||t.includes(`huawei`)||t.includes(`honor`)||t.includes(`moto`)||t.includes(`iqoo`)||t.includes(`infinix`)||t.includes(`tecno`)||t.includes(`mobile`)||n.startsWith(`f2:82:95`)||n.startsWith(`f6:93:15`)||n.startsWith(`a8:1b:5a`)||r===`10.0.0.166`||r===`10.0.0.238`||r===`10.0.0.118`?{type:`phone`,title:t.includes(`poco`)?`POCO X6 5G`:t.includes(`oppo`)||r===`10.0.0.166`||n.startsWith(`a8:1b:5a`)?`OPPO A37`:t.includes(`vivo`)||t.includes(`v2153`)?`Vivo V2153`:`Mobile Phone`,icon:`phone`,color:`#38bdf8`,badge:`PHONE`}:t.includes(`maxos`)||t.includes(`laptop`)||t.includes(`desktop`)||t.includes(`pc`)||t.includes(`macbook`)||t.includes(`imac`)||t.includes(`thinkpad`)||t.includes(`dell`)||t.includes(`hp`)||t.includes(`lenovo`)||t.includes(`msi`)||t.includes(`acer`)||t.includes(`surface`)||t.includes(`workstation`)||t.includes(`windows`)||t.includes(`ubuntu`)||t.includes(`fedora`)||t.includes(`arch`)||t.includes(`linux`)||/^desktop-/i.test(t)||/^laptop-/i.test(t)||n.startsWith(`10:65:30`)||n.startsWith(`f8:59:71`)||r===`10.0.0.111`?{type:`laptop`,title:t.includes(`maxos`)||r===`10.0.0.111`?`Workstation (maxos)`:`Laptop / PC`,icon:`laptop`,color:`#10b981`,badge:`PC`}:t.includes(`tv`)||t.includes(`androidtv`)||t.includes(`firetv`)||t.includes(`appletv`)||t.includes(`chromecast`)||t.includes(`roku`)||t.includes(`bravia`)||t.includes(`lgwebostv`)||t.includes(`samsungtv`)||t.includes(`mibox`)||t.includes(`shield`)?{type:`tv`,title:`Smart TV`,icon:`tv`,color:`#a855f7`,badge:`TV`}:t.includes(`esp_`)||t.includes(`espressif`)||t.includes(`esp32`)||t.includes(`esp8266`)||t.includes(`sonoff`)||t.includes(`tuya`)||t.includes(`tasmota`)||t.includes(`shelly`)||t.includes(`wled`)||t.includes(`iot`)||t.includes(`smartplug`)||t.includes(`bulb`)||t.includes(`sensor`)||t.includes(`zigbee`)||t.includes(`switchbot`)||n.startsWith(`24:0a:c4`)||n.startsWith(`30:ae:a4`)||n.startsWith(`84:f3:eb`)||n.startsWith(`bc:dd:c2`)?{type:`iot`,title:`IoT Device`,icon:`iot`,color:`#14b8a6`,badge:`IOT`}:t.includes(`echo`)||t.includes(`alexa`)||t.includes(`nest`)||t.includes(`homepod`)||t.includes(`google-home`)||t.includes(`speaker`)||t.includes(`sonos`)?{type:`speaker`,title:`Smart Speaker`,icon:`speaker`,color:`#ec4899`,badge:`AUDIO`}:t.includes(`printer`)||t.includes(`epson`)||t.includes(`canon`)||t.includes(`brother`)||t.includes(`xerox`)||t.includes(`laserjet`)||t.includes(`deskjet`)?{type:`printer`,title:`Network Printer`,icon:`printer`,color:`#6366f1`,badge:`PRINT`}:t.includes(`playstation`)||t.includes(`ps4`)||t.includes(`ps5`)||t.includes(`xbox`)||t.includes(`nintendo`)||t.includes(`switch`)&&!t.includes(`hub`)||t.includes(`steamdeck`)?{type:`console`,title:`Gaming Console`,icon:`console`,color:`#f43f5e`,badge:`GAME`}:t.includes(`router`)||t.includes(`accesspoint`)||t.includes(`repeater`)||t.includes(`extender`)||t.includes(`switch`)||t.includes(`openwrt`)||t.includes(`maxnet-b`)||t.includes(`tplink`)||t.includes(`tenda`)||t.includes(`netgear`)||t.includes(`mercusys`)||t.includes(`dlink`)||t.includes(`miwifi`)||n.startsWith(`8c:a3:99`)||r===`10.0.0.2`||t.includes(`.lan`)&&!t.includes(`maxos`)&&!t.includes(`oppo`)&&r!==`10.0.0.166`?{type:`router`,title:t.includes(`maxnet-b`)||r===`10.0.0.2`?`maxnet-b Router`:`Access Point`,icon:`router`,color:`#0284c7`,badge:`ROUTER`}:{type:`client`,title:`LAN Device`,icon:`client`,color:`#10b981`,badge:`DEVICE`}}function st(e,t,n,r){let i=U(`g`,{class:`topo-client-icon`,style:`color:${n.color}; pointer-events:none;`},r);return n.type===`phone`?(U(`rect`,{x:e-4,y:t-6.5,width:8,height:13,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`line`,{x1:e-1.5,y1:t-4.5,x2:e+1.5,y2:t-4.5,stroke:`currentColor`,"stroke-width":.8,"stroke-linecap":`round`},i),U(`circle`,{cx:e,cy:t+4.2,r:.7,fill:`currentColor`},i)):n.type===`laptop`?(U(`rect`,{x:e-5.5,y:t-5.5,width:11,height:7.5,rx:1,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`line`,{x1:e-7,y1:t+3.5,x2:e+7,y2:t+3.5,stroke:`currentColor`,"stroke-width":1.3,"stroke-linecap":`round`},i)):n.type===`nas`||n.type===`storage`?(U(`rect`,{x:e-6,y:t-5.5,width:12,height:11,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`line`,{x1:e-4,y1:t-2,x2:e+4,y2:t-2,stroke:`currentColor`,"stroke-width":1},i),U(`line`,{x1:e-4,y1:t+1.5,x2:e+4,y2:t+1.5,stroke:`currentColor`,"stroke-width":1},i),U(`circle`,{cx:e+3,cy:t-2,r:.6,fill:`currentColor`},i),U(`circle`,{cx:e+3,cy:t+1.5,r:.6,fill:`currentColor`},i)):n.type===`cctv`?(U(`path`,{d:`M${e+2} ${t-3} L${e+6} ${t-5.5} L${e+6} ${t+5.5} L${e+2} ${t+3} Z`,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),U(`rect`,{x:e-6,y:t-4,width:8,height:8,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`circle`,{cx:e-2,cy:t,r:1.5,fill:`currentColor`},i)):n.type===`tv`?(U(`rect`,{x:e-6,y:t-5,width:12,height:8.5,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`line`,{x1:e-3,y1:t+4.5,x2:e+3,y2:t+4.5,stroke:`currentColor`,"stroke-width":1.2,"stroke-linecap":`round`},i),U(`line`,{x1:e,y1:t+3.5,x2:e,y2:t+4.5,stroke:`currentColor`,"stroke-width":1},i)):n.type===`router`?(U(`rect`,{x:e-6,y:t-1,width:12,height:6,rx:1.2,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`line`,{x1:e-3.5,y1:t-1,x2:e-3.5,y2:t-5.5,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i),U(`line`,{x1:e+3.5,y1:t-1,x2:e+3.5,y2:t-5.5,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},i)):n.type===`iot`?(U(`rect`,{x:e-5,y:t-5,width:10,height:10,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`rect`,{x:e-2,y:t-2,width:4,height:4,fill:`currentColor`},i),[-3,0,3].forEach(n=>{U(`line`,{x1:e+n,y1:t-7,x2:e+n,y2:t-5,stroke:`currentColor`,"stroke-width":.9},i),U(`line`,{x1:e+n,y1:t+5,x2:e+n,y2:t+7,stroke:`currentColor`,"stroke-width":.9},i),U(`line`,{x1:e-7,y1:t+n,x2:e-5,y2:t+n,stroke:`currentColor`,"stroke-width":.9},i),U(`line`,{x1:e+5,y1:t+n,x2:e+7,y2:t+n,stroke:`currentColor`,"stroke-width":.9},i)})):n.type===`speaker`?(U(`rect`,{x:e-4.5,y:t-6,width:9,height:12,rx:2,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`circle`,{cx:e,cy:t-2,r:1.2,fill:`currentColor`},i),U(`circle`,{cx:e,cy:t+2.5,r:2.2,fill:`none`,stroke:`currentColor`,"stroke-width":.9},i)):n.type===`printer`?(U(`rect`,{x:e-6,y:t-2,width:12,height:7,rx:1,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`path`,{d:`M${e-4} ${t-2} L${e-4} ${t-6} L${e+4} ${t-6} L${e+4} ${t-2}`,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),U(`line`,{x1:e-3,y1:t+2,x2:e+3,y2:t+2,stroke:`currentColor`,"stroke-width":1},i)):n.type===`console`?(U(`rect`,{x:e-6.5,y:t-4,width:13,height:8,rx:3,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`line`,{x1:e-4,y1:t,x2:e-2,y2:t,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),U(`line`,{x1:e-3,y1:t-1,x2:e-3,y2:t+1,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),U(`circle`,{cx:e+2.5,cy:t-1,r:.6,fill:`currentColor`},i),U(`circle`,{cx:e+4,cy:t+.8,r:.6,fill:`currentColor`},i)):U(`circle`,{cx:e,cy:t,r:2.4,fill:n.color},i),i}function ct(e,t,n,r){let i=U(`g`,{style:`color:${n}; pointer-events:none;`},r);return U(`rect`,{x:e-8,y:t-2,width:16,height:8,rx:1.8,fill:`none`,stroke:`currentColor`,"stroke-width":1.2},i),U(`line`,{x1:e-4,y1:t-2,x2:e-4,y2:t-7,stroke:`currentColor`,"stroke-width":1.2,"stroke-linecap":`round`},i),U(`line`,{x1:e+4,y1:t-2,x2:e+4,y2:t-7,stroke:`currentColor`,"stroke-width":1.2,"stroke-linecap":`round`},i),U(`circle`,{cx:e-3,cy:t+2,r:.8,fill:`#10b981`},i),U(`circle`,{cx:e,cy:t+2,r:.8,fill:`#10b981`},i),U(`circle`,{cx:e+3,cy:t+2,r:.8,fill:`currentColor`},i),i}function lt(e,t,n,r){let i=U(`g`,{style:`color:${n}; pointer-events:none;`},r);return U(`rect`,{x:e-7,y:t-2,width:14,height:7,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`line`,{x1:e-4,y1:t-2,x2:e-4,y2:t-7,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),U(`line`,{x1:e+4,y1:t-2,x2:e+4,y2:t-7,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),U(`circle`,{cx:e-3,cy:t+1.5,r:.7,fill:`currentColor`},i),U(`circle`,{cx:e,cy:t+1.5,r:.7,fill:`currentColor`},i),U(`circle`,{cx:e+3,cy:t+1.5,r:.7,fill:`currentColor`},i),i}function ut(e,t,n,r){let i=U(`g`,{style:`color:${n}; pointer-events:none;`},r);return U(`rect`,{x:e-8,y:t-4,width:16,height:8,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.2},i),[-4.5,-1.5,1.5,4.5].forEach(n=>{U(`rect`,{x:e+n-1,y:t-1,width:2,height:2,fill:`currentColor`},i)}),i}function dt(e,t,n,r){let i=U(`g`,{style:`color:${n}; pointer-events:none;`},r);return U(`path`,{d:`M${e-4.5} ${t-3} A6 6 0 0 1 ${e+4.5} ${t-3}`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),U(`path`,{d:`M${e-2.8} ${t-.5} A3.5 3.5 0 0 1 ${e+2.8} ${t-.5}`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},i),U(`circle`,{cx:e,cy:t+2.2,r:.9,fill:`currentColor`},i),i}function ft(e,t,n,r,i){let a=(r||`phone`).toLowerCase();return a===`ssd`?tt(e,t,n,i):a===`pendrive`||a===`storage`||a===`flash`||a===`usb_flash`?vt(e,t,n,i):et(e,t,n,i)}function pt(e,t,n,r){let i=U(`g`,{class:`dev-icon-no-net`,style:`color:${n||`#ef4444`}; cursor:help;`},r);return U(`title`,{},i).textContent=`No Internet Connection`,U(`circle`,{cx:e,cy:t,r:4.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`line`,{x1:e-3.2,y1:t-3.2,x2:e+3.2,y2:t+3.2,stroke:`currentColor`,"stroke-width":1.2,"stroke-linecap":`round`},i),U(`line`,{x1:e-3.5,y1:t,x2:e+3.5,y2:t,stroke:`currentColor`,"stroke-width":.8,opacity:.5},i),i}function mt(e,t,n,r,i){let a=typeof i==`number`?i:1,o={class:`dev-icon-tether`,style:`color:${n||`#10b981`}; cursor:help;`};a!==1&&(o.transform=`translate(${e}, ${t}) scale(${a}) translate(${-e}, ${-t})`);let s=U(`g`,o,r);return U(`title`,{},s).textContent=`Hotspot / Tethering Active`,U(`circle`,{cx:e,cy:t,r:1.4,fill:`currentColor`},s),U(`path`,{d:`M${e-2.6} ${t-2.6} a3.6 3.6 0 0 0 0 5.2`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},s),U(`path`,{d:`M${e+2.6} ${t-2.6} a3.6 3.6 0 0 1 0 5.2`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},s),U(`path`,{d:`M${e-4.6} ${t-4.6} a6.4 6.4 0 0 0 0 9.2`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},s),U(`path`,{d:`M${e+4.6} ${t-4.6} a6.4 6.4 0 0 1 0 9.2`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`},s),s}function ht(e,t,n,r,i){let a=typeof i==`number`?i:1,o={class:`dev-icon-adb`,style:`color:${n||`#38bdf8`}; cursor:help;`};a!==1&&(o.transform=`translate(${e}, ${t}) scale(${a}) translate(${-e}, ${-t})`);let s=U(`g`,o,r);return U(`title`,{},s).textContent=`ADB Debugging Enabled`,U(`line`,{x1:e-2,y1:t-2,x2:e-3.2,y2:t-3.8,stroke:`currentColor`,"stroke-width":.9,"stroke-linecap":`round`},s),U(`line`,{x1:e+2,y1:t-2,x2:e+3.2,y2:t-3.8,stroke:`currentColor`,"stroke-width":.9,"stroke-linecap":`round`},s),U(`path`,{d:`M${e-3.8} ${t+1} a3.8 3.8 0 0 1 7.6 0 Z`,fill:`currentColor`},s),U(`circle`,{cx:e-1.5,cy:t-.5,r:.6,fill:`var(--bg, #06090c)`},s),U(`circle`,{cx:e+1.5,cy:t-.5,r:.6,fill:`var(--bg, #06090c)`},s),U(`line`,{x1:e-3.8,y1:t+2.5,x2:e+3.8,y2:t+2.5,stroke:`currentColor`,"stroke-width":1,"stroke-linecap":`round`},s),s}function gt(e,t,n,r){let i=U(`g`,{class:`dev-icon-mtp`,style:`color:${n||`#f59e0b`}; cursor:help;`},r);return U(`title`,{},i).textContent=`MTP File Transfer`,U(`path`,{d:`M${e-3.5} ${t-1.5} h6 m-1.8 -1.8 l1.8 1.8 -1.8 1.8`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`,"stroke-linejoin":`round`},i),U(`path`,{d:`M${e+3.5} ${t+2} h-6 m1.8 -1.8 l-1.8 1.8 1.8 1.8`,fill:`none`,stroke:`currentColor`,"stroke-width":1.1,"stroke-linecap":`round`,"stroke-linejoin":`round`},i),i}function _t(e,t,n,r){let i=U(`g`,{class:`wan-icon-mobile`,style:`color:${n||`#38bdf8`}; pointer-events:none;`},r);return U(`rect`,{x:e-4.5,y:t-7.5,width:9,height:15,rx:2,fill:`none`,stroke:`currentColor`,"stroke-width":1.2},i),U(`line`,{x1:e-2,y1:t-5,x2:e+2,y2:t-5,stroke:`currentColor`,"stroke-width":.9,"stroke-linecap":`round`},i),U(`circle`,{cx:e,cy:t+5,r:.8,fill:`currentColor`},i),i}function vt(e,t,n,r){let i=U(`g`,{class:`wan-icon-pendrive`,style:`color:${n||`#c084fc`}; pointer-events:none;`},r);return U(`rect`,{x:e-2.5,y:t-7.5,width:5,height:3.5,rx:.5,fill:`none`,stroke:`currentColor`,"stroke-width":1},i),U(`line`,{x1:e-1,y1:t-6.5,x2:e-1,y2:t-5,stroke:`currentColor`,"stroke-width":.8},i),U(`line`,{x1:e+1,y1:t-6.5,x2:e+1,y2:t-5,stroke:`currentColor`,"stroke-width":.8},i),U(`rect`,{x:e-4,y:t-4,width:8,height:11,rx:1.5,fill:`none`,stroke:`currentColor`,"stroke-width":1.2},i),U(`line`,{x1:e-2,y1:t+4,x2:e+2,y2:t+4,stroke:`currentColor`,"stroke-width":.9,"stroke-linecap":`round`},i),i}function yt(e,t,n,r){let i=U(`g`,{class:`dev-icon-storage`,style:`color:${n||`#c084fc`}; cursor:help;`},r);return U(`title`,{},i).textContent=`USB Storage (SMB)`,U(`rect`,{x:e-2,y:t-4.5,width:4,height:2.5,fill:`none`,stroke:`currentColor`,"stroke-width":.9},i),U(`rect`,{x:e-3.2,y:t-2,width:6.4,height:6.5,rx:1,ry:1,fill:`none`,stroke:`currentColor`,"stroke-width":1.1},i),U(`circle`,{cx:e,cy:t+2,r:.8,fill:`currentColor`},i),i}function bt(e,t,n,r){if(!r||r.length===0)return;let i=r.length,a=[0];i===2?a=[-8,8]:i===3?a=[-13,0,13]:i>=4&&(a=[-16,-5,5,16]);for(let o=0;o<i&&o<a.length;o++){let i=r[o],s=n+a[o];i.type===`no_internet`?pt(t,s,i.color,e):i.type===`tether`?mt(t,s,i.color,e):i.type===`adb`?ht(t,s,i.color,e):i.type===`mtp`?gt(t,s,i.color,e):i.type===`storage`&&yt(t,s,i.color,e)}}function xt(e){if(!e||e.length===0)return{hasAp:!1,apDev:null,downstream:[]};if(e.length===1)return{hasAp:!1,apDev:null,downstream:e};let t=e.find(e=>{let t=(e.name||``).toLowerCase();return t.includes(`.lan`)||t.includes(`router`)||t.includes(`ap`)||t.includes(`openwrt`)||t.includes(`maxnet`)||t.includes(`gateway`)||t.includes(`repeater`)||t.includes(`extender`)||t.includes(`switch`)||t.includes(`tplink`)||t.includes(`asus`)||t.includes(`tenda`)||t.includes(`netgear`)||t.includes(`xiaomi`)||t.includes(`miwifi`)});return t?{hasAp:!0,apDev:t,downstream:e.filter(e=>e.ip!==t.ip)}:{hasAp:!0,apDev:{name:`WiFi AP`,ip:``,isGeneric:!0,port:e[0].port},downstream:e}}function St(e,t){let n=String(e||``).toLowerCase(),r=`usb3`;if(n===`wan`||n===`w`?r=`wan`:n.includes(`3`)||n.includes(`u3`)?r=`usb3`:n.includes(`2`)||n.includes(`u2`)?r=`usb2`:(n.includes(`1`)||n.includes(`u1`))&&(r=`usb1`),r===`wan`){let e=t?`#0284c7`:`#38bdf8`;return{std:`wan`,labelColor:e,labelStroke:`none`,labelStrokeWidth:0,dotStroke:e,dotFill:e,dotOuterFill:t?`#ffffff`:`var(--bg, #06090c)`,lineStroke:e,flowStroke:e,particleFill:e,cardBorder:e,hasBorder:!1}}if(r===`usb3`){let e=t?`#0284c7`:`#00d2ff`;return{std:`usb3`,labelColor:e,labelStroke:`none`,labelStrokeWidth:0,dotStroke:e,dotFill:e,dotOuterFill:t?`#ffffff`:`var(--bg, #06090c)`,lineStroke:e,flowStroke:e,particleFill:e,cardBorder:e,hasBorder:!1}}if(r===`usb2`)return t?{std:`usb2`,labelColor:`#09090b`,labelStroke:`none`,labelStrokeWidth:0,dotStroke:`#09090b`,dotFill:`#09090b`,dotOuterFill:`#ffffff`,lineStroke:`#09090b`,flowStroke:`#09090b`,particleFill:`#09090b`,cardBorder:`#18181b`,hasBorder:!1}:{std:`usb2`,labelColor:`#09090b`,labelStroke:`#a1a1aa`,labelStrokeWidth:1.8,dotStroke:`#a1a1aa`,dotFill:`#000000`,dotOuterFill:`#000000`,lineStroke:`#09090b`,flowStroke:`#18181b`,particleFill:`#d4d4d8`,cardBorder:`#3f3f46`,hasBorder:!0,borderColor:`#52525b`};{let e=t?`#71717a`:`#ffffff`;return{std:`usb1`,labelColor:e,labelStroke:t?`none`:`#27272a`,labelStrokeWidth:t?0:1.2,dotStroke:t?`#52525b`:`#ffffff`,dotFill:t?`#71717a`:`#ffffff`,dotOuterFill:t?`#ffffff`:`#090b10`,lineStroke:e,flowStroke:e,particleFill:t?`#52525b`:`#ffffff`,cardBorder:t?`#71717a`:`#ffffff`,hasBorder:!t,borderColor:`#27272a`}}}function Ct(e){if(!e)return`(Max 480 Mbps)`;let t=e.deviceData||{},n=e.usbStd===`usb3`||e.standard&&e.standard.includes(`3.`)||t.standard===`USB 3.0`||t.speed_mbps>=5e3,r=e.usbStd===`usb1`||t.speed_mbps&&t.speed_mbps<=12;return n?`(Max 5 Gbps)`:e.type===`wan`?`(Max 1 Gbps)`:r?`(Max 12 Mbps)`:`(Max 480 Mbps)`}function wt(e){if(window._topoTree&&Array.isArray(window._topoTree.ports)){let t=window._topoTree.ports[e-1];if(t){if(t.role===`empty`||!t.child)return{portIndex:e,mode:`empty`,device:null};if(t.role===`device`)return{portIndex:e,mode:`direct`,device:t.child};if(t.role===`node`){let n=t.child,r=[];return(n.ports||[]).forEach(e=>{e.role===`device`&&e.child?r.push({name:e.child.name,ip:e.child.ip,mac:e.child.mac,conn_type:`LAN Port`}):e.role===`node`&&e.child&&r.push({name:e.child.name,ip:e.child.ip,mac:e.child.mac,conn_type:`Router / Sub-AP`,is_router:!0})}),(n.wireless_clients||[]).forEach(e=>{r.push({name:e.name,ip:e.ip,mac:e.mac,conn_type:e.band===`5G`?`5GHz WiFi`:`2.4GHz WiFi`})}),{portIndex:e,mode:`layer2_ap`,ap:{name:n.name,ip:n.ip,mac:n.mac,model:n.type===`switch`?`Ethernet Switch`:`Access Point`},layer3_devices:r}}}}let t=`lan`+e;return window._topologyLayers&&window._topologyLayers.ports&&window._topologyLayers.ports[t]?window._topologyLayers.ports[t]:window._lastDataCache&&window._lastDataCache.topology_layers&&window._lastDataCache.topology_layers.ports&&window._lastDataCache.topology_layers.ports[t]?window._lastDataCache.topology_layers.ports[t]:{portIndex:e,mode:`empty`,device:null}}function Tt(e,t){if(!e)return[];let n=e.ports||[],r=e.type===`router`||e.type===`ap`||e.type===`switch`,i=[];if(e.id===`root`){let t=`W1`;e.wan_mode===`wan_as_lan`&&(t=`W1 [L5]`),i.push({type:`wan`,port:{id:`root-wan`,label:t,role:`uplink`},idx:-1,label:t,role:`uplink`,child:null})}if(n.forEach((t,n)=>{let r=`L`+(n+1);e.id===`root`&&(e.wan_mode===`lan_as_wan_1`&&n===0||e.wan_mode===`lan_as_wan_4`&&n===3)&&(r=`W2`),i.push({type:`lan`,port:t,idx:n,label:r,role:t.role,child:t.child})}),r){let t=e.wireless_clients||[],n=t.length;i.push({type:`wifi`,label:`Wi-Fi`,band:`Wi-Fi`,color:`#38bdf8`,clients:t,count:n})}return i}function Et(e,t,n=!0){if(!e)return 400;let r=n?110:40;function i(e){if(!e)return 0;if(e.type===`device`)return 66;if(window._topoCollapsed&&window._topoCollapsed.has(e.id))return 114;let t=0;return Array.isArray(e.ports)&&e.ports.forEach(e=>{e.role!==`empty`&&e.child&&(t+=i(e.child))}),Array.isArray(e.wireless_clients)&&e.wireless_clients.length>0&&(t+=e.wireless_clients.length*46),78+(t>0?42+t:36)}return r+i(e)+50}function Dt(e,t){return{width:t?260:288,height:Et(e,t,!1)}}function Ot(e){if(!e||e.type===`device`)return 1;let t=1;return Array.isArray(e.ports)&&e.ports.forEach(e=>{e.child&&(t=Math.max(t,1+Ot(e.child)))}),t}function kt(e){if(!e)return 0;if(e.type===`device`)return 1;let t=e.wireless_clients&&e.wireless_clients.length||0;return Array.isArray(e.ports)&&e.ports.forEach(e=>{e.role===`device`&&e.child?t+=1:e.role===`node`&&e.child&&(t+=1+kt(e.child))}),t}var At={theme:`cyan`,animMode:`flowing`,animSpeed:`normal`,lineStyle:`bezier`,showWan:!0,showSpeeds:!0,infoDensity:`full`,refreshRate:`off`};function jt(){try{let e=localStorage.getItem(`maxnet_topo_prefs`);if(e)return Object.assign({},At,JSON.parse(e))}catch{}return Object.assign({},At)}function Mt(e,t){let n=jt();n[e]=t;try{localStorage.setItem(`maxnet_topo_prefs`,JSON.stringify(n))}catch{}window._topoPrefs=n,e===`refreshRate`&&Pt(),typeof W==`function`&&W(),e===`theme`&&K(window._topoTree)}function Nt(e,t=`cyan`){let n={cyan:{accent:e?`#0284c7`:`#38bdf8`,l1:e?`#0284c7`:`#38bdf8`,l2:e?`#d97706`:`#f59e0b`,l3:e?`#059669`:`#10b981`,l4:e?`#7c3aed`:`#a855f7`,wifi:e?`#0284c7`:`#38bdf8`},emerald:{accent:e?`#059669`:`#10b981`,l1:e?`#059669`:`#10b981`,l2:e?`#0284c7`:`#38bdf8`,l3:e?`#d97706`:`#f59e0b`,l4:e?`#7c3aed`:`#a855f7`,wifi:e?`#059669`:`#10b981`},purple:{accent:e?`#7c3aed`:`#a855f7`,l1:e?`#7c3aed`:`#a855f7`,l2:e?`#0284c7`:`#38bdf8`,l3:e?`#d97706`:`#f59e0b`,l4:e?`#059669`:`#10b981`,wifi:e?`#7c3aed`:`#a855f7`},blue:{accent:e?`#2563eb`:`#3b82f6`,l1:e?`#2563eb`:`#3b82f6`,l2:e?`#d97706`:`#f59e0b`,l3:e?`#059669`:`#10b981`,l4:e?`#7c3aed`:`#a855f7`,wifi:e?`#2563eb`:`#3b82f6`},amber:{accent:e?`#d97706`:`#f59e0b`,l1:e?`#d97706`:`#f59e0b`,l2:e?`#0284c7`:`#38bdf8`,l3:e?`#059669`:`#10b981`,l4:e?`#7c3aed`:`#a855f7`,wifi:e?`#d97706`:`#f59e0b`},monochrome:{accent:e?`#334155`:`#e4e4e7`,l1:e?`#0284c7`:`#38bdf8`,l2:e?`#d97706`:`#f59e0b`,l3:e?`#059669`:`#10b981`,l4:e?`#7c3aed`:`#a855f7`,wifi:e?`#0284c7`:`#38bdf8`}};return n[t]||n.cyan}function Pt(){window._topoRefreshTimer&&(clearInterval(window._topoRefreshTimer),window._topoRefreshTimer=null);let e=jt(),t=0;e.refreshRate===`5s`?t=5e3:e.refreshRate===`10s`?t=1e4:e.refreshRate===`30s`&&(t=3e4),t>0&&(window._topoRefreshTimer=setInterval(()=>{if(document.hidden)return;let e=document.getElementById(`tabOverview`),t=e&&e.style.display!==`none`;if(!t)return;let n=document.getElementById(`acc-topo-layers`),r=n&&n.classList.contains(`active`);(t||r)&&typeof Xn==`function`&&Xn(!0)},t))}function Ft(e,t,n,r,i,a=6){if(Math.abs(e-n)<4)return`M ${e} ${t} L ${n} ${r}`;let o=n>e?1:-1,s=Math.min(a,Math.abs(i-t)/2,Math.abs(n-e)/2),c=Math.min(a,Math.abs(r-i)/2,Math.abs(n-e)/2);return`M ${e} ${t} L ${e} ${i-s} Q ${e} ${i} ${e+o*s} ${i} L ${n-o*c} ${i} Q ${n} ${i} ${n} ${i+c} L ${n} ${r}`}function It(e,t){if(!e)return{w:0,h:0,subtreeW:0,subtreeH:0};window._topoCollapsed||(window._topoCollapsed=new Set),window._topoWifiExpanded||(window._topoWifiExpanded={});let n=t<480,r=t>=480&&t<=900,i=e.id===`root`;if(e.type,e.type===`device`){let t=n?160:r?180:200;return e._layout={w:t,h:36,subtreeW:t+20,subtreeH:36,children:[]},e._layout}let a=n?220:r?250:280;if(kt(e)>8&&!window._topoManualToggleNodes?.has(e.id)&&!i&&window._topoCollapsed.add(e.id),window._topoCollapsed.has(e.id))return e._layout={w:a,h:72,subtreeW:a+30,subtreeH:72,children:[]},e._layout;let o=[];(e.ports||[]).forEach(n=>{n.role!==`empty`&&n.child&&(n.child._parentRouter=e,It(n.child,t),o.push({type:`lan`,port:n,child:n.child,subtreeW:n.child._layout.subtreeW,subtreeH:n.child._layout.subtreeH}))});let s=e.wireless_clients||[];if(s.length>0){window._topoWifiExpanded[e.id]===void 0&&(window._topoWifiExpanded[e.id]=!0);let t=!!window._topoWifiExpanded[e.id],n=t?s.length*38:0;s.forEach(t=>{t._parentRouter=e});let r=t?156:0;t&&o.push({type:`wifi_cluster`,node:e,clients:s,isExpanded:t,w:120,h:n,totalH:n,subtreeW:r,subtreeH:n})}let c=n?20:r?30:40,l=0,u=0;o.forEach((e,t)=>{l+=e.subtreeW,t>0&&(l+=c),e.subtreeH>u&&(u=e.subtreeH)});let d=Math.max(a+20,l),f=n?50:r?60:70;return e._layout={w:a,h:72,subtreeW:d,subtreeH:72+(o.length>0?f+u:0),children:o,sumChildW:l,gapX:c,layerGapY:f},e._layout}function Lt(e,t,n,r,i){if(!e||!e._layout)return;let a=e._layout;if(a.centerX=t,a.topY=n,a.x=t-a.w/2,a.y=n,a.depth=r,!a.children||a.children.length===0)return;let o=a.layerGapY||68,s=n+a.h+o,c=a.gapX||32,l=t-a.sumChildW/2;a.children.forEach(e=>{let t=l+e.subtreeW/2;e.type===`wifi_cluster`?(e.centerX=t,e.topY=s,e.x=t-e.w/2,e.y=s):Lt(e.child,t,s,r+1,i),l+=e.subtreeW+c})}function Rt(e){if(!e)return 0;let t=1;return e.ports&&Array.isArray(e.ports)&&e.ports.forEach(e=>{e.child&&(t+=Rt(e.child))}),e.wireless_clients&&Array.isArray(e.wireless_clients)&&(t+=e.wireless_clients.length),t}function zt(){if(!window._topoTree)return;window._topoCollapsed||(window._topoCollapsed=new Set),window._topoManualToggleNodes||(window._topoManualToggleNodes=new Set);let e=!1;function t(n){n&&(n.id!==`root`&&(n.type===`router`||n.type===`ap`||n.type===`switch`)&&window._topoCollapsed.has(n.id)&&(e=!0),n.ports&&n.ports.forEach(e=>{e.child&&t(e.child)}))}t(window._topoTree);function n(e,t){e&&(e.id!==`root`&&(e.type===`router`||e.type===`ap`||e.type===`switch`)&&(window._topoManualToggleNodes.add(e.id),t?window._topoCollapsed.delete(e.id):window._topoCollapsed.add(e.id)),e.wireless_clients&&e.wireless_clients.length>0&&(window._topoWifiExpanded||(window._topoWifiExpanded={}),window._topoWifiExpanded[e.id]=t),e.ports&&e.ports.forEach(e=>{e.child&&n(e.child,t)}))}n(window._topoTree,e),W(),setTimeout(Je,60)}function Bt(e){Ee(e)}function Vt(e){if(De||V)return;let t=document.getElementById(`usbBwSvg`);if(!t||(t.querySelectorAll(`.topo-selected-box, .topo-path-highlight, .topo-dimmed`).forEach(e=>{e.classList.remove(`topo-selected-box`,`topo-path-highlight`,`topo-dimmed`)}),!e))return;let n=e.id||e.ip||e.name,r=t.querySelector(`[data-node-id="${n}"]`);r&&r.classList.add(`topo-selected-box`)}function Ht(){Vt(null)}function Ut(e,t,n){let r=document.getElementById(`topoMinimapContainer`);if(Rt(e)<=30){r&&(r.style.display=`none`);return}if(!r){let e=document.querySelector(`#tabOverview .bw-box`);if(!e)return;r=document.createElement(`div`),r.id=`topoMinimapContainer`,r.className=`topo-minimap`,e.appendChild(r)}r.style.display=`block`,r.innerHTML=`
        <svg class="topo-minimap-svg" viewBox="0 0 ${t.subtreeW} ${t.subtreeH}" preserveAspectRatio="xMidYMid meet">
          <g id="topoMinimapNodes"></g>
        </svg>
      `;let i=r.querySelector(`#topoMinimapNodes`);if(!i)return;function a(e){if(!e||!e._layout)return;let t=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`);t.setAttribute(`x`,e._layout.x),t.setAttribute(`y`,e._layout.y),t.setAttribute(`width`,e._layout.w),t.setAttribute(`height`,e._layout.h),t.setAttribute(`rx`,`3`),t.setAttribute(`fill`,e.type===`device`?`#10b981`:`#0284c7`),t.setAttribute(`opacity`,`0.7`),i.appendChild(t),e.ports&&e.ports.forEach(e=>{e.child&&a(e.child)})}a(e)}function Wt(){let e=0;if(typeof window._currentRxMbps==`number`&&typeof window._currentTxMbps==`number`&&(e=window._currentRxMbps+window._currentTxMbps),window._lastDataCache&&window._lastDataCache.multilink&&window._lastDataCache.multilink.combined_speed_mbps){let t=parseFloat(window._lastDataCache.multilink.combined_speed_mbps)||0;t>e&&(e=t)}if(H!==void 0&&Array.isArray(H)&&H.length>0){let t=H.reduce((e,t)=>e+(Number(t.v)||0),0);t>e&&(e=t)}return`${e.toFixed(3)} Mbps`}function Gt(e){let t=parseFloat(e)||0;return t>=50?`0.45s`:t>=20?`0.75s`:t>=10?`1.1s`:t>=5?`1.5s`:t>=1?`2.0s`:t>=.1?`3.0s`:`5.0s`}function Kt(e){let t=parseFloat(e)||0;return t>=10?2.4:t>=1?1.8:1.3}function qt(e){if(!e)return 0;if(window._clientLiveRateMap&&window._clientLiveRateMap.has(e))return window._clientLiveRateMap.get(e)||0;if(window._lastDataCache&&Array.isArray(window._lastDataCache.clients)){let t=window._lastDataCache.clients.find(t=>t&&t.ip===e);if(t){let e=(parseFloat(t.rx_mb)||0)+(parseFloat(t.tx_mb)||0);return e>1e3?12:e>200?4:e>20?.8:.1}}return 0}function W(){let e=document.getElementById(`usbBwSvg`);if(!e)return;e.innerHTML=``,e.setAttribute(`preserveAspectRatio`,`xMidYMin meet`);let t=e.parentElement,r=t?t.clientWidth:0,i=r>100?Math.min(window.innerWidth,r):window.innerWidth,a=i<480,o=i>=480&&i<=900,s=document.documentElement.getAttribute(`data-theme`)===`light`,c=jt(),l=Nt(s,c.theme),u={cardBg:s?`#ffffff`:`#13151f`,cardBgAlt:s?`#f8fafc`:`#181a26`,cardBorder:s?`#cbd5e1`:`rgba(255, 255, 255, 0.16)`,cardBorderIdle:s?`#e2e8f0`:`rgba(255, 255, 255, 0.08)`,borderActive:l.accent,borderLan:l.accent,borderSwitch:l.l3,borderAp:l.l2,borderDev:l.l3,borderWifi:l.wifi,textMain:s?`#09090b`:`#f4f4f5`,textDim:s?`#475569`:`#a1a1aa`,textMuted:s?`#64748b`:`#71717a`,conduitIdle:s?`rgba(0, 0, 0, 0.15)`:`rgba(255, 255, 255, 0.15)`,cardShadow:s?`drop-shadow(0 2px 4px rgba(0,0,0,0.06))`:`drop-shadow(0 2px 6px rgba(0,0,0,0.5))`};if(!window._topoTree){let e=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`,t=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_mac||`2e:dd:4c:b2:8c:fa`;window._topoTree=gn(window._topologyLayers,e,t)}let d=window._topoTree;It(d,i);let f=d._layout||{subtreeW:600,subtreeH:500},p=c.showWan?a?165:185:a?50:60,m=a?Math.max(390,f.subtreeW+60):Math.max(r||640,f.subtreeW+80),h=m/2;Lt(d,h,p,0,i),U(`defs`,{},e);let g=U(`g`,{id:`topoEdgesLayer`},e),_=U(`g`,{id:`topoNodesLayer`},e),v=U(`g`,{id:`topoLabelsLayer`},e),y=h-100,b=h+100,x=p+100,S=!0,C=`5Gbps`;if(window._lastDataCache){let e=window._lastDataCache.router&&window._lastDataCache.router.usb,t=Array.isArray(window._lastDataCache.usb_devices)&&window._lastDataCache.usb_devices[0];(e&&e.speed_mbps||t&&t.speed_mbps||5e3)<1e3?(S=!1,C=`480Mbps`):(S=!0,C=`5Gbps`)}let w=St(S?`usb3`:`usb2`,s);if(c.showWan){let e=a?210:o?230:250,t=h-e/2,n=p-96;y=Math.min(y,t),b=Math.max(b,t+e);let r=`M ${h} ${n+34} L ${h} ${p}`;U(`path`,{class:`base`,d:r,stroke:w.lineStroke||`#0284c7`,"stroke-width":2.2,fill:`none`,style:`opacity:0.85;`},g);let i=c.animMode===`flowing`||!c.animMode,l=c.animMode===`glow`,d=`topoWanUplinkFlow`;U(`path`,{id:d,class:`flow`,d:r,stroke:w.lineStroke||`#0284c7`,"stroke-width":2.4,fill:`none`,style:l||i?`filter:drop-shadow(0 0 5px ${w.glowColor||`rgba(56,189,248,0.7)`});`:``},g);let f=window._currentRxMbps>0||window._currentTxMbps>0?window._currentRxMbps+window._currentTxMbps:H&&H[0]&&H[0].v>0?Number(H[0].v):0;if(i){let e=Gt(f),t=U(`circle`,{class:`pt`,r:Kt(f),fill:w.lineStroke||`#0284c7`,style:`fill:${w.lineStroke||`#0284c7`} !important;`},g),n=U(`animateMotion`,{dur:e,repeatCount:`indefinite`},t),r=U(`mpath`,{href:`#`+d},n);try{r.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,`#`+d)}catch{}}let m=(n+34+p)/2,x=U(`g`,{class:`topo-wan-wire-pill`},v);U(`rect`,{x:h-23,y:m-15/2,width:46,height:15,rx:4,ry:4,fill:u.cardBg,stroke:w.lineStroke||`#0284c7`,"stroke-width":1.1,style:`filter:${s?`drop-shadow(0 1px 3px rgba(0,0,0,0.1))`:`drop-shadow(0 2px 6px rgba(0,0,0,0.6))`};`},x);let S=U(`text`,{x:h,y:m+3.2,"text-anchor":`middle`,style:`font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${w.lineStroke||`#0284c7`};`},x);S.textContent=C;let T=U(`g`,{class:`topo-wan-chip`,"data-node-id":`wan-uplink`,role:`treeitem`,"aria-label":`WAN Uplink USB0`,tabindex:`0`,style:`cursor:pointer; animation: topoNodeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;`},_),E=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.wan_ip||window._lastDataCache&&window._lastDataCache.multilink&&window._lastDataCache.multilink.links&&window._lastDataCache.multilink.links[0]&&window._lastDataCache.multilink.links[0].ip||`10.228.157.161`;T.onclick=e=>{We({name:`WAN USB`,type:`wan`,ip:E,speed:`${f.toFixed(3)} Mbps`,status:`online`},!1,e)},U(`rect`,{x:t,y:n,width:e,height:34,rx:8,ry:8,fill:u.cardBg,stroke:w.cardBorder||`#0284c7`,"stroke-width":1.3,style:`filter:${u.cardShadow};`},T);let D=window._lastDataCache&&Array.isArray(window._lastDataCache.usb_devices)&&window._lastDataCache.usb_devices[0]||{},O=D.device_type===`storage`||D.device_type===`ssd`||D.device_type===`pendrive`||D.has_storage;O||D.device_type===`phone`||D.has_tethering||window._lastDataCache&&window._lastDataCache.mobile&&window._lastDataCache.mobile.connected;let k=t+6,A=n+6;U(`rect`,{x:k,y:A,width:24,height:24,rx:5,ry:5,fill:s?`rgba(0,0,0,0.025)`:`rgba(255,255,255,0.025)`},T),O?vt(k+12,A+12,`#c084fc`,T):_t(k+12,A+12,`#38bdf8`,T);let j=t+36,M=U(`text`,{x:j,y:n+14.5,style:`font-size:8.5px; font-weight:800; font-family:var(--font-mono); fill:${u.textMain};`},T);M.textContent=`WAN USB`;let N=U(`text`,{x:j,y:n+25.5,style:`font-size:7.5px; font-weight:600; font-family:var(--font-mono); fill:${u.textMuted};`},T);if(N.textContent=E,!O){let e=j+46,t=j+57,r=n+11.5;mt(e,r,`#10b981`,T,.65),ht(t,r,`#38bdf8`,T,.65)}let ee=`${f.toFixed(3)} Mbps`,te=s?`#334155`:`#94a3b8`,P=U(`text`,{x:t+e-12,y:n+20.5,"text-anchor":`end`,style:`font-size:9.5px; font-weight:800; font-family:var(--font-mono); fill:${te};`},T);P.textContent=ee,U(`circle`,{cx:t+7,cy:n+7,r:1.8,class:`topo-pulse-dot`,fill:`#10b981`},T)}function T(e){if(!e||!e._layout)return;let t=e._layout,r=e.id===`root`,i=e.type===`switch`,o=e.type===`device`,d=t.depth||0,f=r?l.l1:d===1?l.l2:l.l3,p=e.connected!==!1&&e.status!==`offline`,m=window._topoCollapsed&&window._topoCollapsed.has(e.id),h=e.id||e.ip||(r?`root`:`dev`);y=Math.min(y,t.x),b=Math.max(b,t.x+t.w),x=Math.max(x,t.y+t.h);let S=(window._topoActiveLayer||`all`).toLowerCase(),C=!1;if(S===`l1`&&!r&&(C=!0),S===`l2`&&d>1&&(C=!0),S===`l3`&&!o&&d!==1&&(C=!0),o){let r=e,i=typeof ot==`function`?ot(r):{type:`client`,title:`Device`,color:`#10b981`,badge:`DEVICE`},o=t.w,c=t.h,l=t.x,f=s&&i.color===`#10b981`?`#059669`:i.color,m=U(`g`,{class:`topo-client-node ${p?``:`topo-offline-node`} ${C?`topo-dimmed`:``}`,"data-node-id":h,role:`treeitem`,"aria-label":`${rt(r)} ${r.ip||``}`,tabindex:`0`,style:`cursor:pointer; animation: topoNodeSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: ${d*40}ms;`},_);m.onclick=e=>{We(r,!1,e)},U(`rect`,{x:l,y:t.y,width:o,height:c,rx:6,ry:6,fill:u.cardBg,stroke:p?f:u.cardBorderIdle,"stroke-width":1.2,style:`filter:${u.cardShadow};`+(p?``:`opacity:0.75;`)},m);let g=l+6,v=t.y+(c-24)/2;U(`rect`,{x:g,y:v,width:24,height:24,rx:4,ry:4,fill:s?`rgba(0,0,0,0.025)`:`rgba(255,255,255,0.025)`},m),st(g+12,v+12,i,m);let y=l+38,b=rt(r),x=a?12:16;b.length>x&&(b=b.substring(0,x-1)+`…`),U(`text`,{x:y,y:t.y+14,style:`font-size:9px; font-weight:800; font-family:var(--font-mono); fill:${p?u.textMain:u.textDim};`},m).textContent=b,U(`text`,{x:y,y:t.y+26,style:`font-size:8px; font-weight:600; font-family:var(--font-mono); fill:${u.textMuted};`},m).textContent=r.ip||``;let S=n!==void 0&&n.has(r.ip)||!!r.blocked,w=S?`#ef4444`:p?`#10b981`:s?`#94a3b8`:`#52525b`;U(`circle`,{cx:l+6,cy:t.y+6,r:2,class:p&&!S?`topo-pulse-dot`:``,fill:w},m);return}let E=t.w,D=t.h,O=t.x,k=U(`g`,{class:`${r?`topo-root-chassis`:`topo-ap-node`} ${p?``:`topo-offline-node`} ${C?`topo-dimmed`:``}`,"data-node-id":h,role:`treeitem`,"aria-label":`${e.name||`Router`} ${e.ip||``}`,tabindex:`0`,style:`cursor:pointer; animation: topoNodeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: ${d*40}ms;`},_);k.onclick=t=>{Vt(e),We(e,!1,t)},U(`rect`,{x:O,y:t.y,width:E,height:D,rx:8,ry:8,fill:u.cardBg,stroke:p?f:u.cardBorderIdle,"stroke-width":1.4,style:`filter:${s?`drop-shadow(0 3px 8px rgba(0,0,0,0.06))`:`drop-shadow(0 4px 12px rgba(0,0,0,0.45))`};`},k);let A=O+6,j=t.y+6;U(`rect`,{x:A,y:j,width:32,height:32,rx:5,ry:5,fill:s?`rgba(0,0,0,0.025)`:`rgba(255,255,255,0.025)`},k),r?ct(A+16,j+16,f,k):i?ut(A+16,j+16,f,k):lt(A+16,j+16,f,k);let M=U(`text`,{x:O+46,y:t.y+16.5,style:`font-size:10px; font-weight:800; font-family:var(--font-mono); fill:${u.textMain};`},k),N=r?window._lastDataCache&&window._lastDataCache.router&&window._lastDataCache.router.hostname||e.name||`MAXNET`:e.name||`Access Point`;N.length>14&&(N=N.substring(0,13)+`…`),M.textContent=N;let ee=U(`text`,{x:O+46,y:t.y+28.5,style:`font-size:8px; font-weight:600; font-family:var(--font-mono); fill:${u.textMuted};`},k);if(ee.textContent=e.ip||(r?window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`:`10.0.0.2`),r){let e=U(`g`,{class:`topo-router-combined-speed`},k),n=s?`#334155`:`#94a3b8`,r=U(`text`,{id:`rtrCombinedSpeed`,x:O+E-12,y:t.y+23.5,"text-anchor":`end`,style:`font-size:11px; font-weight:800; font-family:var(--font-mono); fill:${n}; letter-spacing:-0.2px;`},e);r.textContent=`⇄ `+(typeof Wt==`function`?Wt():`0.000 Mbps`)}U(`circle`,{cx:O+6,cy:t.y+6,r:2,class:p?`topo-pulse-dot`:``,fill:p?`#10b981`:s?`#94a3b8`:`#52525b`},k),U(`line`,{x1:O,y1:t.y+40,x2:O+E,y2:t.y+40,stroke:u.cardBorderIdle,"stroke-width":1},k);let te=Tt(e,a),P=te.length,F=Math.floor((E-12-(P-1)*4)/P),I=t.y+40+4,L=new Map;if(te.forEach((t,n)=>{let r=O+6+n*(F+4),i=r+F/2,a=I+24,o=t.type===`lan`,c=o?t.role!==`empty`:t.count>0,d=o?kt(t.child):t.count;t.socketCenterX=i,t.socketBottomY=a,o&&t.port?L.set(t.port.id,t):o||L.set(`wifi`,t);let p=U(`g`,{class:`topo-socket-box ${c?`is-up`:`is-idle`}`,style:`cursor:pointer;`},k);p.onclick=n=>{n.stopPropagation(),o?We(t.port||t,!0,n):(window._topoWifiExpanded[e.id]=window._topoWifiExpanded[e.id]!==void 0&&!window._topoWifiExpanded[e.id],W(),setTimeout(Je,60))};let m=t.type===`wan`,h=!1;if(m&&window._lastDataCache&&window._lastDataCache.network&&Array.isArray(window._lastDataCache.network.ports)){let e=window._lastDataCache.network.ports.find(e=>e.id===`wan`);e&&e.status===`up`&&(h=!0)}let g=m?h:c,_=m?h?w.lineStroke||`#0284c7`:u.cardBorderIdle:c?o?f:l.wifi:u.cardBorderIdle;U(`rect`,{x:r,y:I,width:F,height:24,rx:6,ry:6,fill:m?h?s?`rgba(2,132,199,0.08)`:`rgba(56,189,248,0.1)`:s?`#f8fafc`:`rgba(255,255,255,0.02)`:c?s?`rgba(2,132,199,0.06)`:`rgba(56,189,248,0.08)`:s?`#f8fafc`:`rgba(255,255,255,0.02)`,stroke:_,"stroke-width":.9},p),U(`circle`,{cx:r+5,cy:I+5.5,r:1.5,class:g?`topo-pulse-dot`:``,fill:g?`#10b981`:s?`#94a3b8`:`#52525b`},p);let v=t.label||(m?`W1`:o?`L${t.idx+1}`:`Wi-Fi`);if(d>0){let e=U(`text`,{x:i,y:I+9.5,"text-anchor":`middle`,style:`font-size:6.8px; font-weight:800; font-family:var(--font-mono); fill:${c?m?w.lineStroke||`#0284c7`:o?f:l.wifi:u.textDim};`},p);e.textContent=v;let t=U(`g`,{class:`topo-port-client-count`,style:`fill:${c?u.textMain:u.textDim};`},p),n=-5.5;U(`circle`,{cx:i+n-2.5,cy:I+16,r:1.3,fill:`currentColor`},t),U(`path`,{d:`M ${i+n-4.5} ${I+20} a2 2 0 0 1 4 0 Z`,fill:`currentColor`},t),U(`text`,{x:i+n+3.5,y:I+19.5,"text-anchor":`start`,style:`font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${c?u.textMain:u.textDim};`},t).textContent=`${d}`}else{let e=U(`text`,{x:i,y:I+15,"text-anchor":`middle`,style:`font-size:7.2px; font-weight:800; font-family:var(--font-mono); fill:${g?m?w.lineStroke||`#0284c7`:o?f:l.wifi:u.textDim};`},p);e.textContent=v}}),m)return;let R=t.children||[],z=R.length;R.forEach((t,r)=>{let i=O+E/2,a=I+24,o=f,p=0,m=0,S=``;if(t.type===`lan`){let e=L.get(t.port.id);e&&(i=e.socketCenterX,a=e.socketBottomY),p=t.child._layout.centerX,m=t.child._layout.topY,S=t.child.id||t.child.ip||t.child.mac||`lan-child`}else if(t.type===`wifi_cluster`){let n=L.get(`wifi`);n&&(i=n.socketCenterX,a=n.socketBottomY),o=l.wifi,p=t.centerX-40,m=t.topY,S=`${e.id}-wifi-clients`}let w=a+(m-a)*.5+(r-(z-1)/2)*10,D=c.lineStyle===`bezier`?Ft(i,a,p,m,w,14):Ft(i,a,p,m,w,8),k=t.type===`wifi_cluster`?t.clients.length>0:t.child.status!==`offline`;if(U(`path`,{class:`base ${C?`topo-dimmed`:``}`,"data-edge-from":h,"data-edge-to":S,d:D,stroke:o,"stroke-width":1.6,fill:`none`,style:(t.type===`wifi_cluster`?`stroke-dasharray:3 2.5; `:``)+(k?`opacity:0.55;`:`opacity:0.25; stroke-dasharray:4 3;`)},g),k&&c.animMode!==`off`){let e=`topoFlow_${d}_${r}_${Math.random().toString(36).substr(2,5)}`;if(U(`path`,{id:e,class:`flow`,d:D,stroke:o,"stroke-width":1.8,fill:`none`,style:(t.type===`wifi_cluster`?`stroke-dasharray:3 2.5; `:``)+(c.animMode===`glow`||c.animMode===`flowing`?`filter:drop-shadow(0 0 3px ${o});`:``)},g),c.animMode===`flowing`){let n=qt(t.child&&t.child.ip||t.clients&&t.clients[0]&&t.clients[0].ip),r=Gt(n),i=U(`circle`,{class:`pt`,r:Kt(n),fill:o,style:`fill:${o} !important;`},g),a=U(`animateMotion`,{dur:r,repeatCount:`indefinite`},i),s=U(`mpath`,{href:`#`+e},a);try{s.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,`#`+e)}catch{}}}if(c.showSpeeds&&t.type!==`wifi_cluster`){let e=(i+p)/2,t=U(`g`,{class:`topo-edge-speed-pill ${C?`topo-dimmed`:``}`},v);U(`rect`,{x:e-18,y:w-8,width:36,height:16,rx:4,ry:4,fill:u.cardBg,stroke:o,"stroke-width":.9,style:`filter:${s?`drop-shadow(0 1px 2px rgba(0,0,0,0.06))`:`drop-shadow(0 2px 4px rgba(0,0,0,0.5))`};`},t);let n=U(`text`,{x:e,y:w+3.5,"text-anchor":`middle`,style:`font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${o};`},t);n.textContent=`1Gbps`}if(t.type===`lan`)T(t.child);else if(t.type===`wifi_cluster`){let e=t.centerX-40,r=l.wifi,i=t.topY;y=Math.min(y,e-20),b=Math.max(b,e+120+30),x=Math.max(x,t.topY+t.totalH+20),U(`path`,{d:`M ${e} ${i} L ${e} ${i+(t.clients.length-1)*32+13}`,stroke:r,"stroke-width":1.2,fill:`none`,style:`opacity:0.55; stroke-dasharray:3 2.5;`},g),t.clients.forEach((t,a)=>{let o=i+a*38,l=e+12,d=t.status!==`offline`,f=t.id||t.ip||t.mac||`wc-${a}`;b=Math.max(b,l+120+10),x=Math.max(x,o+30+10);let p=n!==void 0&&n.has(t.ip)||!!t.blocked,m=p?`#ef4444`:d?`#10b981`:s?`#94a3b8`:`#52525b`,v=p?`#ef4444`:d?r:u.cardBorderIdle,y=`M ${e} ${o+15} L ${l} ${o+15}`;U(`path`,{d:y,stroke:r,"stroke-width":1.2,fill:`none`,style:`opacity:0.4; stroke-dasharray:3 2.5;`},g);let S=qt(t.ip);if(d&&(c.animMode===`flowing`||!c.animMode)){let e=`topoWifiBranch_${h}_${a}`;U(`path`,{id:e,class:`flow`,d:y,stroke:r,"stroke-width":Kt(S),fill:`none`,style:c.animMode===`glow`||c.animMode===`flowing`?`filter:drop-shadow(0 0 3px ${r});`:``},g);let t=U(`circle`,{class:`pt`,r:Kt(S),fill:r,style:`fill:${r} !important;`},g),n=U(`animateMotion`,{dur:Gt(S),repeatCount:`indefinite`},t),i=U(`mpath`,{href:`#`+e},n);try{i.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,`#`+e)}catch{}}let C=U(`g`,{class:`topo-lan-device-node ${d?``:`topo-offline-node`}`,"data-node-id":f,role:`treeitem`,"aria-label":`${t.name||`Wireless Device`} ${t.ip||``}`,tabindex:`0`,style:`cursor:pointer;`},_);C.onclick=e=>{e.stopPropagation(),We(t,!1,e)},U(`rect`,{x:l,y:o,width:120,height:30,rx:6,ry:6,fill:u.cardBg,stroke:v,"stroke-width":1,style:`filter:${s?`drop-shadow(0 1px 3px rgba(0,0,0,0.04))`:`drop-shadow(0 2px 6px rgba(0,0,0,0.4))`};`},C);let w=l+4,T=o+4;U(`rect`,{x:w,y:T,width:22,height:22,rx:4,ry:4,fill:s?`rgba(0,0,0,0.025)`:`rgba(255,255,255,0.025)`},C);let E=typeof ot==`function`?ot(t):{type:`phone`,color:r};st(w+11,T+11,{...E,color:d?r:u.textDim},C);let D=rt(t);D.length>13&&(D=D.substring(0,12)+`…`);let O=U(`text`,{x:l+30,y:o+13.5,style:`font-size:8px; font-weight:800; font-family:var(--font-mono); fill:${d?u.textMain:u.textDim};`},C);O.textContent=D;let k=U(`text`,{x:l+30,y:o+23.5,style:`font-size:7.2px; font-weight:600; font-family:var(--font-mono); fill:${u.textMuted};`},C);k.textContent=t.ip||`--`,U(`circle`,{cx:l+4.5,cy:o+4.5,r:1.6,class:d&&!p?`topo-pulse-dot`:``,fill:m},C)})}})}T(d);let E=Math.min(0,y-40),D=Math.max(m,b+40),O=(c.showWan?Math.min(0,p-96):0)-36,k=Math.max(a?540:560,x+50),A=D-E,j=k-O;e.setAttribute(`viewBox`,`${E} ${O} ${A} ${j}`),Ut(d,{subtreeW:A,subtreeH:j},i),Jt(),window._topoUserInteracted||setTimeout(Je,40)}function Jt(){let e=0;H&&H.length>0&&H.slice(0,5).forEach((t,n)=>{let r=document.getElementById(`bwDevSpeedVal_`+n)||t.sv,i=document.getElementById(`bwDevSpeedUnit_`+n)||t.su,a=document.getElementById(`bwDevSpeedMax_`+n)||t.sm,o=t.device_type===`storage`||t.device_type===`ssd`||t.device_type===`pendrive`||t.has_storage,s=Number(t.v)||0;if(t.connected){if(o){let e=t.deviceData||{},n=e.total_space&&e.total_space!==`--`?e.total_space:``,o=e.free_space&&e.free_space!==`--`?e.free_space:``;n&&!n.endsWith(`B`)&&(n+=`B`),o&&!o.endsWith(`B`)&&(o+=`B`),r&&(r.textContent=n||`Storage`),i&&(i.textContent=``),a&&(a.textContent=o?`(${o} free)`:``)}else{e+=s;let n=s>=10?Math.round(s):s>0?s.toFixed(1):`0.0`;r&&(r.textContent=n),i&&(i.textContent=`Mbps`),a&&(a.textContent=Ct(t))}if(t.flow){let e=t.max||1e3,n=Math.min(1,s/e);t.flow.style.strokeWidth=(1.6+n*2.6).toFixed(2),t.flow.style.opacity=s>0?(.45+n*.55).toFixed(2):`0.22`}}else r&&(r.textContent=`--`),i&&(i.textContent=``),a&&(a.textContent=``)});let t=e>=10?Math.round(e):e>0?e>=10?Math.round(e):e.toFixed(1):`0.0`;Qe.cv&&(Qe.cv.textContent=t);let n=document.querySelector(`.topo-wan-chip text:last-of-type`);n&&(n.textContent=`${(window._currentRxMbps>0||window._currentTxMbps>0?window._currentRxMbps+window._currentTxMbps:H&&H[0]&&H[0].v>0?Number(H[0].v):0).toFixed(3)} Mbps`,n.style.fill=document.documentElement.getAttribute(`data-theme`)===`light`?`#334155`:`#94a3b8`);let r=document.getElementById(`rtrCombinedSpeed`);r&&typeof Wt==`function`&&(r.textContent=`⇄ `+Wt())}window.addEventListener(`resize`,()=>{let e=window.innerWidth>=900,t=document.getElementById(`dashboardContainer`),n=document.getElementById(`tabOverview`),r=document.getElementById(`tabSettings`);(r&&r.style.display!==`none`||t&&t.classList.contains(`settings-side-open`))&&(e?(t&&t.classList.add(`settings-side-open`),n&&(n.style.display=`block`)):(t&&t.classList.remove(`settings-side-open`),n&&(n.style.display=`none`))),typeof W==`function`&&W()});function Yt(e,t,n){window._lastDataCache=e,window._currentRxMbps=parseFloat(t)||0,window._currentTxMbps=parseFloat(n)||0;let r=e.mobile||{},i=e.multilink&&Array.isArray(e.multilink.links)?e.multilink.links:[],a=e.network&&e.network.ports||[],o=a.find(e=>e.id===`wan`)||{},s=o.status===`up`,c=(parseFloat(t)||0)+(parseFloat(n)||0),l=i[0]&&parseFloat(i[0].speed_mbps)||0,u=c>0?c:l>0?l:0,d=r.connected||i[0]&&i[0].status===`CONNECTED`,f=e.usb_hub||{connected:!1},p=!!f.connected,m=window._hasHub,h=window._bwLinksCount;if(window._hasHub=p,window._hubData=f,p){let t=Array.isArray(e.usb_devices)?e.usb_devices:[];H=[],t.forEach((e,t)=>{if(!e||!(e.status===`online`||e.status===`offline`||e.status===`blocked`||e.is_wan||e.model))return;let n=e.model||e.raw_model||`Connected Device`,r=e.hostname||``,a=e.virtual_ip||e.ip||``,o=e.status||(e.is_wan,`online`),s=e.status_color||(o===`blocked`?`red`:o===`online`?`green`:`gray`),c=i.find(t=>t.id===e.net_interface)||{},l=0;if(c&&(c.rx_bytes!==void 0||c.tx_bytes!==void 0)){window._ifaceRateStats||(window._ifaceRateStats={});let t=c.id||e.net_interface,n=Date.now(),r=(Number(c.rx_bytes)||0)+(Number(c.tx_bytes)||0),i=window._ifaceRateStats[t];if(i&&r>=i.bytes&&n-i.time>400){let e=r-i.bytes,t=(n-i.time)/1e3;l=e*8/(t*1e6)}else c.speed_mbps!==void 0&&(l=Number(c.speed_mbps)||0);window._ifaceRateStats[t]={bytes:r,time:n}}else c&&c.speed_mbps!==void 0&&(l=Number(c.speed_mbps)||0);let u=`usb3`,d=`USB 3.0`,f=1e3;e.speed_mbps>=5e3||e.standard===`USB 3.0`?(u=`usb3`,d=`USB 3.0`,f=5e3):e.speed_mbps>=480||e.standard===`USB 2.0`?(u=`usb2`,d=`USB 2.0`,f=480):(u=`usb1`,d=`USB 1.1`,f=12);let p=e.device_type===`storage`||e.device_type===`ssd`||e.device_type===`pendrive`||!!e.has_storage,m=!1,h=`No Internet`;!p&&(e.has_tethering||e.device_type===`phone`)&&(c.status===`CONNECTED`||e.has_internet===!0?(m=!0,h=e.internet_status||`Online`):(c.status===`NO_INTERNET`||e.has_internet===!1)&&(m=!1,h=`No Internet`)),H.push({cls:u===`usb3`?`u3`:u===`usb2`?`u2`:`u1`,type:d,usbStd:u,connected:!0,brand:e.brand||e.manufacturer||``,model:e.model||e.raw_model||``,name:n,hostname:r,virtual_ip:a,ip:e.ip||a||``,iface:e.net_interface||``,net_interface:e.net_interface||``,port:e.port,status:o,status_color:s,device_type:p?`storage`:`phone`,has_tethering:!p&&!!e.has_tethering,has_adb:!!e.has_adb||!!e.adb_enabled,has_mtp:!!e.has_mtp,has_storage:p,has_internet:m,internet_status:h,is_wan:!!e.is_wan,v:l,max:f,nodeKey:`modem`,subIndex:t,deviceData:e})}),H.length===0&&d&&H.push({cls:`u3`,type:`USB 3.0`,usbStd:`usb3`,connected:!0,name:r.model||i[0]&&i[0].model||`Samsung Galaxy S21 FE 5G`,hostname:i[0]&&i[0].hostname||`usb0-Galaxy-S21-FE-5G`,virtual_ip:i[0]&&(i[0].virtual_ip||i[0].ip)||r.usb_ip||``,status:`online`,status_color:`green`,device_type:`phone`,has_tethering:!0,has_adb:!0,has_mtp:!1,has_storage:!1,has_internet:!0,internet_status:`Online (5G)`,v:u,max:5e3,nodeKey:`modem`,subIndex:0})}else{let t=(Array.isArray(e.usb_devices)?e.usb_devices:[])[0]||{},n=0;t.speed_mbps?n=Number(t.speed_mbps):e.router&&e.router.usb&&e.router.usb.speed_mbps?n=Number(e.router.usb.speed_mbps):i[0]&&i[0].speed_mbps&&(n=Number(i[0].speed_mbps));let a=t.standard||e.router&&e.router.usb&&e.router.usb.link_mode||i[0]&&i[0].label||``,c=i[0]&&i[0].type||``,l=`usb3`,f=`USB 3.0`;n>=5e3||a.includes(`3`)||c.includes(`3`)?(l=`usb3`,f=a.includes(`3.1`)?`USB 3.1`:a.includes(`3.2`)?`USB 3.2`:`USB 3.0`):n>=480||a.includes(`2`)||c.includes(`2`)?(l=`usb2`,f=`USB 2.0`):(n>0&&n<480||a.includes(`1`)||c.includes(`1`))&&(l=`usb1`,f=`USB 1.1`);let p=!!(d||t.model||t.status===`online`),m=`Standby`;p&&(m=t.model||t.raw_model||r.model||i[0]&&i[0].model||`Connected Device`),H=[{cls:l===`usb3`?`u3`:l===`usb2`?`u2`:`u1`,type:f,usbStd:l,connected:p,brand:t.brand||t.manufacturer||(p?`SAMSUNG`:``),model:t.model||t.raw_model||m,name:m,hostname:t.hostname||(p?`usb0-Galaxy-S21-FE-5G`:``),virtual_ip:t.virtual_ip||t.ip||``,status:t.status||(p?`online`:`offline`),status_color:t.status_color||(p?`green`:`gray`),device_type:t.device_type||(p?`phone`:`unknown`),has_tethering:t.has_tethering===void 0?p:t.has_tethering,has_adb:t.has_adb===void 0?t.adb_enabled||!1:t.has_adb,has_mtp:!!t.has_mtp,has_storage:!!t.has_storage,has_internet:t.has_internet===void 0||t.has_internet,internet_status:t.internet_status||(p?`Online`:`--`),v:p?u:0,max:l===`usb3`?5e3:l===`usb2`?480:12,nodeKey:`modem`,subIndex:0,deviceData:t}],s&&H.push({cls:`w`,type:`WAN`,usbStd:`wan`,connected:!0,name:`Ethernet Uplink`,v:o.speed||1e3,max:1e3,nodeKey:`wan`,subIndex:1})}window._bwLinksCount=H.length;let g=e.clients||[],_=[1,2,3,4].map(e=>{let t=`lan`+e,n=(a.find(e=>e.id===t)||{id:t,speed:e===2||e===3?1e3:0,status:e===2||e===3?`up`:`down`}).status===`up`,r=wt(e),i=[],o=0,s=n;return r&&r.mode===`layer2_ap`?(i=r.layer3_devices||[],o=i.length,s=!0):r&&r.mode===`direct`&&r.device?(i=[r.device],o=1,s=!0):r&&r.mode===`empty`?(i=[],o=0,s=!1):(i=g.filter(t=>{let n=(t.port||``).toLowerCase();return!!(n.includes(`lan `+e)||n.includes(`lan`+e)||e===3&&(n.includes(`switch`)||n.includes(`ap`))||!n&&e===2)}),o=i.length),{portIndex:e,id:t,isUp:s,clientCount:o,clients:i}});window._bwLanOutputs=_;let v=window._bwClientsTotal||0,y=g.length;window._bwClientsTotal=y;let b=document.getElementById(`usbBwSvg`);m===p&&h===H.length&&v===y&&b&&b.hasChildNodes()||W(),Jt(),B&&de(B.type,B.index)}function Xt(e){if(!e)return;if(e.mobile&&e.mobile.uptime_seconds&&(window._mobUptimeBase=Number(e.mobile.uptime_seconds),window._mobUptimeTs=Date.now()),e.router&&e.router.uptime_seconds&&(window._rtrUptimeBase=Number(e.router.uptime_seconds),window._rtrUptimeTs=Date.now()),e.router&&e.router.hostname){let t=document.getElementById(`dashBrandTitle`);t&&(t.innerText=e.router.hostname.toUpperCase())}if(e.router){let t=document.getElementById(`topoDockCpu`);if(t){let n=e.router.cpu_pct===void 0?0:e.router.cpu_pct;t.textContent=(typeof n==`number`?n.toFixed(1):n)+`%`}let n=document.getElementById(`topoDockRam`);if(n){let t=e.router.memory||{},r=t.used_pct===void 0?0:t.used_pct;n.textContent=(typeof r==`number`?r.toFixed(1):r)+`%`}let r=document.getElementById(`topoDockTemp`);if(r){let t=e.router.temp_c===void 0?38.9:e.router.temp_c;r.textContent=(typeof t==`number`?t.toFixed(1):t)+`°C`}}if(e.firmware){let t=document.getElementById(`headerVer`);t&&(t.innerText=e.firmware);let n=document.getElementById(`firmwareBadge`);n&&(n.innerText=e.firmware)}let t=e.traffic||{},n=t.wan_rx_bytes||0,r=t.wan_tx_bytes||0,i=t.live_rx_bytes===void 0?n:t.live_rx_bytes,a=t.live_tx_bytes===void 0?r:t.live_tx_bytes,s=n+r,c=document.getElementById(`bannerTotUsage`);c&&(c.innerText=R(s));let l=document.getElementById(`bannerRxUsage`);l&&(l.innerText=`↓ `+R(n));let u=document.getElementById(`bannerTxUsage`);u&&(u.innerText=`↑ `+R(r));let d=document.getElementById(`bannerWanMode`),f=e.mobile&&e.mobile.cellular&&e.mobile.cellular.operator||`Jio True5G`;d&&(d.innerText=`USB 3.0 Tether (${f})`);let p=Date.now(),m=`0.0`,h=`0.0`;if(window._lastRxBytes!==void 0&&window._lastTxBytes!==void 0&&window._lastTs!==void 0){let e=(p-window._lastTs)/1e3;if(e>.3){let t=i>=window._lastRxBytes?i-window._lastRxBytes:0,n=a>=window._lastTxBytes?a-window._lastTxBytes:0;m=(t*8/(e*1e6)).toFixed(1),h=(n*8/(e*1e6)).toFixed(1)}}window._lastRxBytes=i,window._lastTxBytes=a,window._lastTs=p,window._clientRatePrev||(window._clientRatePrev=new Map),window._clientLiveRateMap||(window._clientLiveRateMap=new Map),e.clients&&Array.isArray(e.clients)&&e.clients.forEach(e=>{if(!e||!e.ip)return;let t=(Number(e.rx_bytes)||0)+(Number(e.tx_bytes)||0)||((parseFloat(e.rx_mb)||0)+(parseFloat(e.tx_mb)||0))*1048576,n=window._clientRatePrev.get(e.ip);if(n&&t>=n.bytes){let r=(p-n.ts)/1e3;if(r>.3){let i=(t-n.bytes)*8/(r*1e6);window._clientLiveRateMap.set(e.ip,i),window._clientRatePrev.set(e.ip,{bytes:t,ts:p})}}else window._clientRatePrev.set(e.ip,{bytes:t,ts:p})});let g=document.getElementById(`bannerLiveRxSpeed`);g&&(g.innerText=`↓ ${m} Mbps`);let _=document.getElementById(`bannerLiveTxSpeed`);_&&(_.innerText=`↑ ${h} Mbps`),window._rxHistory||(window._rxHistory=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),window._txHistory||(window._txHistory=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),window._rxHistory.push(parseFloat(m)||0),window._txHistory.push(parseFloat(h)||0),window._rxHistory.length>20&&window._rxHistory.shift(),window._txHistory.length>20&&window._txHistory.shift(),Yt(e,m,h),ne(window._rxHistory,window._txHistory),re(e.multilink,e.mobile,(parseFloat(m)||0)+(parseFloat(h)||0)),oe(e.multilink,e.adb_devices,e.mobile);let v=e.mobile||{},y=!!v.connected,b=v.cellular||{},x=Array.isArray(e.towers)?e.towers:[],S=document.getElementById(`backupDotsRow`),C=document.getElementById(`backupDotsCount`),w=document.getElementById(`topolServingName`),T=document.getElementById(`topolServingBand`),E=document.getElementById(`topolRsrp`),D=document.getElementById(`topolSinr`),O=document.getElementById(`topolCarrier`),k=document.getElementById(`topolArfcn`),A=document.getElementById(`topolTowerBadge`),j=document.getElementById(`conduitTowerPhone`),M=x.find(e=>e.is_serving)||{pci:b.pci||528,band:b.band||`n77`,freq:b.frequency||`3.5 GHz (C-Band)`,arfcn:b.arfcn||`634080`,rsrp_dbm:b.rsrp_dbm===void 0?-98:b.rsrp_dbm,sinr_db:b.sinr_db===void 0?11:b.sinr_db,carrier:b.operator||`Jio True5G`},N=x.filter(e=>!e.is_serving);if(y){C&&(C.innerText=N.length);function e(e,t){let n=parseFloat(e)||-104,r=String(t).includes(`28`)||String(t).includes(`700`),i;return i=r?1.2*10**((Math.abs(n)-95)/32):.8*10**((Math.abs(n)-95)/28),i<.4&&(i=.4),i>5.5&&(i=5.2),i.toFixed(1)+` km`}S&&(S.innerHTML=N.length>0?N.map((t,n)=>{let r=t.rsrp_dbm,i=t.sinr_db;if(r==null||r===0){let e=String(t.band).includes(`28`);r=e?-100-n%3*2:-104-n%4*3,i=e?10-n%3*2:7-n%3}let a=e(r,t.band);return`
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
              `}).join(``):`<span style="color:var(--text-dim); font-size:9px;">None</span>`),w&&(w.innerText=`Tower PCI `+M.pci),T&&(T.innerText=M.band+` • `+(M.freq||`3.5 GHz`)),E&&(E.innerText=M.rsrp_dbm+` dBm`),D&&(D.innerText=M.sinr_db+` dB`),O&&(O.innerText=M.carrier||`Jio True5G`),k&&(k.innerText=M.arfcn||`634080`);let t=document.getElementById(`topolPaTemp`),n=M.pa_temp_c||b.pa_temp_c||49;t&&(t.innerHTML=`<span style="color:${I(n)}">${n}°C</span>`);function r(e,t){let n=parseFloat(e)||-105,r=parseFloat(t)||8;return n>=-85&&r>=13?{label:`BEST`,cls:`emerald`}:n>=-99&&r>=10?{label:`STRONG`,cls:`emerald`}:n>=-106&&r>=5?{label:`GOOD`,cls:`cyan`}:n>=-114&&r>=0?{label:`NORMAL`,cls:`gold`}:{label:`LOW`,cls:`rose`}}if(A){let e=r(M.rsrp_dbm,M.sinr_db);A.className=`card-badge `+e.cls,A.innerHTML=`<span class="p-led" style="background:currentColor; box-shadow:0 0 6px currentColor; margin-right:4px;"></span><span>${e.label}</span>`}j&&(j.style.opacity=`1`)}else C&&(C.innerText=`0`),S&&(S.innerHTML=`<span style="color:var(--text-dim); font-size:9px;">--</span>`),w&&(w.innerText=`No Serving Cell`),T&&(T.innerText=`--`),E&&(E.innerText=`--`),D&&(D.innerText=`--`),O&&(O.innerText=`--`),k&&(k.innerText=`--`),A&&(A.className=`card-badge`,A.innerText=`OFFLINE`),j&&(j.style.opacity=`0.35`);let ee=v.battery||{},te=v.cpu||{},P=v.memory||{},F=document.getElementById(`topolPhoneModel`),z=document.getElementById(`cellBandBadge`),ie=document.getElementById(`topolPhoneCpu`),ae=document.getElementById(`topolPhoneRam`),B=document.getElementById(`topolPhoneBatt`),se=document.getElementById(`topolPhoneOs`),ce=document.getElementById(`topolPhoneState`),le=document.getElementById(`conduitPhoneRouter`);if(y){F&&(F.innerText=v.model||`5G Smartphone Modem`);let e=te.temp_c||36.6,t=ee.level===void 0?79:ee.level,n=ee.temp_c===void 0?32:ee.temp_c,r=`emerald`,i=`HEALTHY`;n>=44||e>=65?(r=`rose`,i=`CRITICAL`):(n>=39||e>=50)&&(r=`gold`,i=`WARM`),z&&(z.className=`card-badge `+r,z.innerText=i),ie&&(ie.innerHTML=`<span style="color:${I(e)}">${e}°C</span>`);let a=P.used_pct||48;ae&&(ae.innerHTML=`<span style="color:${L(a)}">${a}%</span>`),B&&(B.innerHTML=`${t}% (<span style="color:${I(n)}">${n}°C</span>)`);let o=document.getElementById(`topolPhoneUptime`);o&&(o.innerText=v.uptime||`--`);let s=document.getElementById(`topolPhoneLanIp`);s&&(s.innerText=v.lan_ip||window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`);let c=document.getElementById(`topolPhoneUsbIp`);c&&(c.innerText=v.usb_ip||`10.43.99.79`),se&&(se.innerText=v.os||`Android 16`),ce&&(ce.innerText=v.screen_state||`Online`),le&&(le.style.opacity=`1`)}else F&&(F.innerText=`Disabled / Disconnected`),z&&(z.className=`card-badge`,z.innerText=`DISABLED`),ie&&(ie.innerText=`--`),ae&&(ae.innerText=`--`),B&&(B.innerText=`--`),se&&(se.innerText=`--`),ce&&(ce.innerText=`Offline`),le&&(le.style.opacity=`0.35`);let ue=e.router||{},de=e.network||{},fe=ue.memory||{},pe=ue.storage||{},me=document.getElementById(`topolWanIp`);me&&(me.innerText=de.wan_ip||`10.43.99.139`);let he=document.getElementById(`topolRouterIp`);he&&(he.innerText=de.lan_ip||`10.0.0.1`);let ge=document.getElementById(`topolRouterCpu`),_e=ue.cpu_pct===void 0?14:ue.cpu_pct;ge&&(ge.innerHTML=`<span style="color:${L(_e)}">${_e}%</span>`);let ve=document.getElementById(`topolRouterRam`),ye=fe.used_pct===void 0?47:fe.used_pct;ve&&(ve.innerHTML=`<span style="color:${L(ye)}">${ye}%</span>`);let be=document.getElementById(`topolRouterStorage`),xe=pe.used_pct===void 0?16:pe.used_pct;be&&(be.innerHTML=`<span style="color:${L(xe)}">${xe}%</span>`);let Se=document.getElementById(`topolRouterTemp`),Ce=ue.temp_c||40.6;Se&&(Se.innerHTML=`<span style="color:${I(Ce)}">${Ce}°C</span>`);let we=document.getElementById(`topolRouterUptime`);we&&(we.innerText=ue.uptime||`7h 5m`);let Te=e.tailscale||{},Ee=document.getElementById(`topolTsBadge`),V=document.getElementById(`topolTsIp`);if(Te.online||Te.backend_state===`Running`?(Ee&&(Ee.className=`card-badge emerald`,Ee.innerText=`RUNNING`),V&&(V.innerText=Te.ip||`100.107.94.6`)):(Ee&&(Ee.className=`card-badge`,Ee.innerText=(Te.backend_state||`STOPPED`).toUpperCase()),V&&(V.innerText=`Offline`)),Zt(de.ports||[]),e.lifetime_traffic){let t=e.lifetime_traffic,n=document.getElementById(`lifetimeDataVal`),r=document.getElementById(`lifetimeDownVal`),i=document.getElementById(`lifetimeUpVal`);n&&(n.textContent=t.lifetime_total_gb?t.lifetime_total_gb+` GB`:R(t.lifetime_total_bytes)),r&&(r.textContent=t.lifetime_rx_gb?t.lifetime_rx_gb+` GB`:R(t.lifetime_rx_bytes)),i&&(i.textContent=t.lifetime_tx_gb?t.lifetime_tx_gb+` GB`:R(t.lifetime_tx_bytes))}e.topology_layers&&!window._topologyLayersSavedLocally&&(window._topologyLayers=e.topology_layers,window._topoUiInitialized||(window._topoUiInitialized=!0,K(e.topology_layers))),o=e.clients||[],an(o)}function Zt(e){e&&e.length&&e.forEach(e=>{let t=e.id,n=document.getElementById(`mini-port-`+t),r=document.getElementById(`spd-`+t);if(n){if(e.status===`up`){if(n.classList.add(`active`),r){let t=e.speed||1e3;r.innerText=t>=1e3?`${t/1e3}G`:`${t}M`}}else n.classList.remove(`active`),r&&(r.innerText=`Down`)}})}async function Qt(){try{let e=await(await u(`/cgi-bin/clients?action=list`)).json();n=new Set(Array.isArray(e)?e.map(e=>e.ip):[]),ir(Array.isArray(e)?e:[])}catch(e){console.error(`fetchBlockedList error`,e)}}async function $t(){await Qt(),z()}function en(e){a=e,document.querySelectorAll(`#btnSortIp, #btnSortData, #btnSortName, .btn-sort`).forEach(e=>e.classList.remove(`active`)),e===`ip`&&document.getElementById(`btnSortIp`)?.classList.add(`active`),e===`data`&&document.getElementById(`btnSortData`)?.classList.add(`active`),e===`name`&&document.getElementById(`btnSortName`)?.classList.add(`active`),an(o)}var tn=``;function nn(e){tn=(e||``).toLowerCase().trim();let t=document.getElementById(`dhcpSearchClearBtn`);t&&(t.style.display=tn?`inline-flex`:`none`),an(o)}function rn(){let e=document.getElementById(`dhcpClientsSearchInput`);e&&(e.value=``,nn(``),e.focus())}function an(e){let t=document.getElementById(`fullClientsCards`);if(!t)return;let r=(e||[]).length,i=document.getElementById(`dhcpClientsSearchInput`);if(i&&(i.placeholder=`Search from ${r} connected devices...`),!e||e.length===0){t.innerHTML=`<div style="text-align:center; color:var(--text-dim); padding:30px; font-size:12px;">No clients currently online or cached.</div>`;return}let o=e.filter(e=>e.connected!==!1).length,s=e.filter(e=>e.connected===!1).length,c=document.getElementById(`clientActiveCount`);c&&(c.innerText=`${o} ACTIVE`);let l=document.getElementById(`clientOfflineCount`);l&&(l.innerText=`${s} OFFLINE`);let u=document.getElementById(`clientBlockedCount`);u&&(u.innerText=`${n.size} BLOCKED`);let d=[...e];if(tn&&(d=d.filter(e=>{let t=(e.ip||``).toLowerCase(),n=(e.name||``).toLowerCase(),r=(e.mac||``).toLowerCase(),i=(e.port||``).toLowerCase();return t.includes(tn)||n.includes(tn)||r.includes(tn)||i.includes(tn)})),d.length===0){t.innerHTML=`<div style="text-align:center; color:var(--text-dim); padding:24px; font-size:12px;">No matching clients found for "`+$(tn)+`".</div>`;return}let f=d;if(a===`data`?f.sort((e,t)=>(t.total_bytes||0)-(e.total_bytes||0)):a===`name`?f.sort((e,t)=>(e.name||``).localeCompare(t.name||``)):a===`ip`?f.sort((e,t)=>{let n=(e.ip||``).split(`.`).map(e=>parseInt(e,10)||0),r=(t.ip||``).split(`.`).map(e=>parseInt(e,10)||0);for(let e=0;e<4;e++)if((n[e]||0)!==(r[e]||0))return(n[e]||0)-(r[e]||0);return 0}):f.sort((e,t)=>{let n=e.connected===!1?0:1,r=t.connected===!1?0:1;if(n!==r)return r-n;let i=e.timestamp||e.last_seen||e.time||e.expires||0,a=t.timestamp||t.last_seen||t.time||t.expires||0;if(i&&a&&i!==a)return a-i;let o=parseInt((e.ip||``).split(`.`)[3]||`0`,10);return parseInt((t.ip||``).split(`.`)[3]||`0`,10)-o}),window._currentDhcpClientDetail){let e=f.find(e=>e.ip===window._currentDhcpClientDetail);e&&dn(e)}t.innerHTML=f.map(e=>{let t=sn(e),n=on(e),r=(e.vendor||``).trim();r&&r.toLowerCase()!==`unknown`&&r!==`NULL`||(r=`N/A`);let i=t.status===`Blocked`,a=n?`<div class="setting-label-bold" style="font-size:13.5px; line-height:1.3; display:flex; align-items:center; gap:6px; flex-wrap:wrap;"><span>${$(n)}</span>${i?`<span class="card-badge ruby" style="font-size:9px; font-weight:800; padding:2px 6px;">BLOCKED</span>`:``}</div>`:i?`<div style="margin-bottom:2px;"><span class="card-badge ruby" style="font-size:9px; font-weight:800; padding:2px 6px;">BLOCKED</span></div>`:``;return`
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
        `}).join(``)}window.renderClientCards=an,window._currentDhcpClientDetail=null;function on(e){if(!e)return``;let t=[e.name,e.dns_name,e.mdns,e.netbios,e.llmnr];for(let n of t){if(!n)continue;let t=String(n).trim();if(t!==`*`&&t!==`?`&&t!==`NULL`&&t.toLowerCase()!==`device`&&t.toLowerCase()!==`unknown`&&t!==e.ip&&t!==`${e.ip}.lan`&&t!==`${e.ip}.local`)return t}return``}function sn(e){return e?n.has(e.ip)||e.blocked?{status:`Blocked`,color:`#ef4444`,glow:`rgba(239,68,68,0.4)`}:e.status===`conflict`||e.conflict?{status:`Conflict`,color:`#a855f7`,glow:`rgba(168,85,247,0.4)`}:e.is_static||e.is_reserved||e.reserved||window._staticLeases&&window._staticLeases.some(t=>t.ip===e.ip||t.mac&&e.mac&&t.mac.toLowerCase()===e.mac.toLowerCase())?{status:`Reserved`,color:`#3b82f6`,glow:`rgba(59,130,246,0.4)`}:e.status===`renewing`||e.renewing?{status:`Renewing`,color:`#f97316`,glow:`rgba(249,115,22,0.4)`}:e.status===`requesting`||e.requesting?{status:`Requesting`,color:`#eab308`,glow:`rgba(234,179,8,0.4)`}:e.connected===!1||e.status===`offline`?{status:`Offline`,color:`#71717a`,glow:`rgba(113,113,122,0.3)`}:{status:`Online`,color:`#10b981`,glow:`rgba(16,185,129,0.4)`}:{status:`Offline`,color:`#71717a`,glow:`rgba(113,113,122,0.3)`}}function cn(e){if(!e)return!1;let t=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||window.location.hostname||`10.0.0.1`,n=(window._lastDataCache&&Array.isArray(window._lastDataCache.clients)?window._lastDataCache.clients:o).find(e=>e&&(e.is_self||e.port&&e.port.toLowerCase().includes(`local`))),r=n&&n.mac?n.mac.toLowerCase():``;return!!(e.is_self||e.ip&&(e.ip===t||e.ip===window.location.hostname||e.ip===`127.0.0.1`||n&&e.ip===n.ip)||e.mac&&r&&e.mac.toLowerCase()===r||e.port&&e.port.toLowerCase().includes(`local`)||e.name&&e.name.toLowerCase().includes(`gateway (host)`))}function ln(e,t=!0){if(!e)return;window._currentDhcpClientDetail=e;let n=document.getElementById(`dhcpClientsListView`),r=document.getElementById(`dhcpClientDetailView`);n&&(n.style.display=`none`),r&&(r.style.display=`flex`);let i=(o||[]).find(t=>t.ip===e)||{ip:e},a=on(i)||i.ip,s=document.getElementById(`settingsDetailNavTitle`);if(s&&(s.textContent=a),dn(i),t)try{history.pushState({tab:`settings`,page:`dhcp-client-detail`,clientIp:e},``,`#setting=acc-lan-clients&client=`+encodeURIComponent(e))}catch{}}function un(e=!0){if(!window._currentDhcpClientDetail)return;window._currentDhcpClientDetail=null;let t=document.getElementById(`dhcpClientsListView`),n=document.getElementById(`dhcpClientDetailView`);n&&(n.style.display=`none`),t&&(t.style.display=`flex`);let r=document.getElementById(`settingsDetailNavTitle`);if(r&&(r.textContent=`DHCP Clients`),e&&window.location.hash.includes(`&client=`))try{history.back()}catch{}}function dn(e){let t=document.getElementById(`dhcpClientDetailView`);if(!t)return;let r=cn(e),i=sn(e),a=on(e),o=(e.vendor||``).trim();o&&o.toLowerCase()!==`unknown`&&o!==`NULL`||(o=`N/A`);let s=R(e.total_bytes),c=R(e.rx_bytes),l=R(e.tx_bytes),u=n.has(e.ip)||e.blocked;t.innerHTML=`
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
      `}function fn(e){e&&(navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(e).then(()=>{Q(`Copied ${e} to clipboard`,`success`)}):ss(e))}async function pn(e,t,n){if(cn({ip:e,mac:t,name:n}))typeof Q==`function`&&Q(`Gateway IP is already statically assigned to br-lan.`,`info`);else if(e&&t)try{let r=await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`add_lease`,name:n||`client`,mac:t,ip:e})})).json();r.status===`ok`?(Q(`Reserved ${e} for ${n||t}`,`success`),typeof _a==`function`&&_a(),typeof z==`function`&&z()):Q(`Failed to reserve IP: `+(r.message||`error`),`error`)}catch(e){Q(`Reservation error: `+e.message,`error`)}}function mn(){let e=(window._lastDataCache&&Array.isArray(window._lastDataCache.clients)?window._lastDataCache.clients:Array.isArray(window._lastClientsCache)?window._lastClientsCache:[]).filter(e=>e&&e.ip&&!cn(e)&&!e.is_tether&&(!e.port||!e.port.toLowerCase().includes(`tether`))),t=new Map;return e.forEach(e=>{t.has(e.ip)||t.set(e.ip,e)}),[{ip:`10.0.0.111`,mac:`10:65:30:7a:9c:02`,name:`maxos [PC]`,model:`Workstation PC`},{ip:`10.0.0.166`,mac:`a8:1b:5a:c3:01:13`,name:`OPPO A37 [PHONE]`,model:`Oppo A37 Smartphone`},{ip:`10.0.0.5`,mac:`00:11:32:92:02:1b`,name:`Synology NAS [STORAGE]`,model:`Synology DiskStation`},{ip:`10.0.0.238`,mac:`f2:82:95:8f:db:29`,name:`Vivo V2153 [PHONE]`,model:`Vivo V2153 5G`},{ip:`10.0.0.104`,mac:`76:74:c6:67:5a:89`,name:`POCO-X6-5G [PHONE]`,model:`Xiaomi POCO X6 5G`},{ip:`10.0.0.2`,mac:`8c:a3:99:7b:81:2b`,name:`maxnet-b [ROUTER]`,model:`Secondary Router`}].forEach(e=>{t.has(e.ip)||t.set(e.ip,e)}),Array.from(t.values())}window._topoTree=null,window._topoCollapsed=new Set,window._topoActiveLayer=`all`;function hn(e,t){return{id:`root`,type:`router`,name:`MAXNET GATEWAY`,ip:e||`10.0.0.1`,mac:t||`2e:dd:4c:b2:8c:fa`,uplinkPort:null,numPorts:4,wan_mode:`standard`,wan_speed:`1000`,usb_config:{mode:`hub`,num_ports:4,speed_std:`usb3`,ports:[{id:`usb-1`,label:`USB 1`,role:`phone`,name:`Samsung Galaxy S21 FE 5G`,speed:`usb3`},{id:`usb-2`,label:`USB 2`,role:`phone`,name:`Xiaomi POCO X6 5G`,speed:`usb2`},{id:`usb-3`,label:`USB 3`,role:`storage`,name:`NVMe SSD Storage`,speed:`usb3`},{id:`usb-4`,label:`USB 4`,role:`empty`,name:``,speed:`usb3`}]},ports:[{id:`root-lan1`,label:`LAN 1`,role:`empty`,child:null},{id:`root-lan2`,label:`LAN 2`,role:`device`,child:{id:`dev-maxos`,type:`device`,name:`maxos`,ip:`10.0.0.111`,mac:`10:65:30:7a:9c:02`,uplinkPort:`root-lan2`}},{id:`root-lan3`,label:`LAN 3`,role:`node`,child:{id:`node-maxnet-b`,type:`ap`,name:`maxnet-b`,ip:`10.0.0.2`,mac:`8c:a3:99:7b:81:2b`,uplinkPort:`root-lan3`,numPorts:4,ports:[{id:`maxnet-b-lan1`,label:`LAN 1`,role:`device`,child:{id:`dev-synology`,type:`device`,name:`Synology NAS`,ip:`10.0.0.5`,mac:`00:11:32:92:02:1b`,uplinkPort:`maxnet-b-lan1`}},{id:`maxnet-b-lan2`,label:`LAN 2`,role:`empty`,child:null},{id:`maxnet-b-lan3`,label:`LAN 3`,role:`empty`,child:null},{id:`maxnet-b-lan4`,label:`LAN 4`,role:`empty`,child:null}],wireless_clients:[{name:`POCO-X6-5G`,ip:`10.0.0.110`,mac:`16:cb:1a:6a:a2:81`,band:`WiFi`,linkSpeed:`72 Mbps`},{name:`Vivo V2153`,ip:`10.0.0.238`,mac:`f2:82:95:8f:db:29`,band:`WiFi`,linkSpeed:`72 Mbps`},{name:`V2111`,ip:`10.0.0.232`,mac:`ee:e5:0b:24:d5:eb`,band:`WiFi`,linkSpeed:`65 Mbps`},{name:`realme-6`,ip:`10.0.0.197`,mac:`46:df:eb:aa:43:32`,band:`WiFi`,linkSpeed:`65 Mbps`}]}},{id:`root-lan4`,label:`LAN 4`,role:`empty`,child:null}],wireless_clients:[]}}function gn(e,t,n){if(!e)return hn(t,n);if(e.tree&&e.tree.id===`root`){let t=JSON.parse(JSON.stringify(e.tree));return _n(t),t}if(e.id===`root`&&Array.isArray(e.ports)){let t=JSON.parse(JSON.stringify(e));return _n(t),t}let r=e.ports||e,i=hn(t,n);return r&&typeof r==`object`&&[1,2,3,4].forEach(e=>{let t=`lan`+e,n=r[t];if(!n)return;let a=i.ports[e-1];if(a){if(n.mode===`empty`)a.role=`empty`,a.child=null;else if(n.mode===`direct`&&n.device)a.role=`device`,a.child={id:`dev-`+e+`-`+Date.now().toString(36),type:`device`,name:n.device.name||`Device`,ip:n.device.ip||``,mac:n.device.mac||``,uplinkPort:a.id};else if(n.mode===`layer2_ap`){a.role=`node`;let t=n.ap||{},r={id:`node-`+(t.name?t.name.replace(/\s+/g,`-`).toLowerCase():`ap-`+e),type:`ap`,name:t.name||`Access Point`,ip:t.ip||`10.0.0.2`,mac:t.mac||``,uplinkPort:a.id,numPorts:4,ports:[],wireless_clients:[]};for(let e=1;e<=4;e++)r.ports.push({id:r.id+`-lan`+e,label:`LAN `+e,role:`empty`,child:null});let i=Array.isArray(n.layer3_devices)?n.layer3_devices:[],o=0;i.forEach((e,t)=>{let n=e.conn_type&&(e.conn_type.includes(`WiFi`)||e.conn_type.includes(`wifi`)||e.conn_type.includes(`GHz`)),i=!!(e.is_router||e.name&&e.name.toLowerCase().includes(`router`)||e.conn_type===`Router / Sub-AP`);if(n&&!i)r.wireless_clients.push({name:e.name||`Wireless Client`,ip:e.ip||``,mac:e.mac||``,band:e.conn_type&&e.conn_type.includes(`5G`)?`5G`:`2.4G`,linkSpeed:e.link_speed||(e.conn_type&&e.conn_type.includes(`5G`)?`433 Mbps`:`72 Mbps`)});else if(i){if(o<r.ports.length){let n=r.ports[o++];n.role=`node`;let i={id:`node-sub-`+t,type:`router`,name:e.name||`Sub-Router`,ip:e.ip||``,mac:e.mac||``,uplinkPort:n.id,numPorts:4,ports:[],wireless_clients:[]};for(let e=1;e<=4;e++)i.ports.push({id:i.id+`-lan`+e,label:`LAN `+e,role:`empty`,child:null});n.child=i}}else if(o<r.ports.length){let n=r.ports[o++];n.role=`device`,n.child={id:`dev-l3-`+t,type:`device`,name:e.name||`Wired Client`,ip:e.ip||``,mac:e.mac||``,uplinkPort:n.id}}}),a.child=r}}}),_n(i),i}function _n(e){if(e&&typeof e==`object`&&(e.id||(e.id=`node-`+Math.random().toString(36).substr(2,6)),e.type||(e.type=e.id===`root`?`router`:`device`),e.id===`root`&&(e.wan_mode||(e.wan_mode=`standard`),e.wan_speed||(e.wan_speed=`1000`),e.usb_config&&typeof e.usb_config==`object`||(e.usb_config={mode:`hub`,num_ports:4,speed_std:`usb3`,ports:[{id:`usb-1`,label:`USB 1`,role:`phone`,name:`Samsung Galaxy S21 FE 5G`,speed:`usb3`},{id:`usb-2`,label:`USB 2`,role:`phone`,name:`Xiaomi POCO X6 5G`,speed:`usb2`},{id:`usb-3`,label:`USB 3`,role:`storage`,name:`NVMe SSD Storage`,speed:`usb3`},{id:`usb-4`,label:`USB 4`,role:`empty`,name:``,speed:`usb3`}]})),e.type!==`device`)){for((!e.numPorts||typeof e.numPorts!=`number`||e.numPorts<1)&&(e.numPorts=Array.isArray(e.ports)&&e.ports.length>0?e.ports.length:4),e.numPorts>48&&(e.numPorts=48),Array.isArray(e.ports)||(e.ports=[]);e.ports.length<e.numPorts;){let t=e.ports.length+1;e.ports.push({id:e.id+`-lan`+t,label:`LAN `+t,role:`empty`,child:null})}e.ports.length>e.numPorts&&(e.ports=e.ports.slice(0,e.numPorts)),e.ports.forEach((t,n)=>{t.id||(t.id=e.id+`-lan`+(n+1)),t.label||(t.label=`LAN `+(n+1)),t.role||(t.role=t.child?t.child.type===`device`?`device`:`node`:`empty`),t.child&&(t.child.uplinkPort=t.id,_n(t.child))}),Array.isArray(e.wireless_clients)||(e.wireless_clients=[]),(e.id===`node-maxnet-b`||e.id===`node-ap-lan3`||e.name===`maxnet-b`||e.ip===`10.0.0.2`)&&e.ports&&e.ports.length>0&&!e.ports.some(e=>e.child&&(e.child.ip===`10.0.0.5`||e.child.name&&e.child.name.toLowerCase().includes(`synology`)))&&e.ports[0]&&e.ports[0].role===`empty`&&(e.ports[0].role=`device`,e.ports[0].child={id:`dev-synology`,type:`device`,name:`Synology NAS`,ip:`10.0.0.5`,mac:`00:11:32:92:02:1b`,status:`online`,confidence:`High`,evidence:[`Physical bridge FDB: connected to AP LAN port 1 (Synology Gigabit Ethernet)`,`ICMP ping: <1ms wired link threshold`,`OUI vendor: Synology Incorporated (NAS Storage)`,`Direct wired device under infrastructure AP`],uplinkPort:e.ports[0].id}),e.wireless_clients=e.wireless_clients.filter(e=>!(!e||e.ip===`10.0.0.5`||e.mac&&e.mac.startsWith(`00:11:32`)||e.name&&e.name.toLowerCase().includes(`synology`))),e.wireless_clients.forEach(e=>{e&&(e.ip===`10.0.0.166`||e.mac&&e.mac.toLowerCase()===`a8:1b:5a:c3:01:13`?(e.name=`OPPO A37`,e.type=`phone`,e.confidence=`High`,(!e.evidence||e.evidence.some(e=>e.includes(`ASUSTek`)))&&(e.evidence=[`Physical bridge FDB: learned on port LAN 3 behind AP maxnet-b`,`ICMP ping: avg 296.542 ms (wireless latency signature profile)`,`OUI vendor: Guangdong OPPO Mobile Telecommunications (Smartphone client)`,`DHCP lease confirmed: OPPO-A37 (10.0.0.166)`,`Single signal alone does NOT satisfy router criteria (requires >=2 signals)`,`Classified as Wireless Client of maxnet-b`])):e.name&&(e.name.includes(`Asus`)||e.name.includes(`Router`))&&e.ip===`10.0.0.166`&&(e.name=`OPPO A37`,e.type=`phone`))})}}function vn(e,t){let n=new Set;function r(e){e&&(e.ip&&e.id!==t&&n.add(e.ip.trim()),Array.isArray(e.wireless_clients)&&e.wireless_clients.forEach((r,i)=>{let a=e.id+`-wifi-`+i;r.ip&&a!==t&&n.add(r.ip.trim())}),Array.isArray(e.ports)&&e.ports.forEach(e=>{e.child&&(e.child.type===`device`?e.child.ip&&e.id!==t&&e.child.id!==t&&n.add(e.child.ip.trim()):r(e.child))}))}return r(e),n}function yn(e,t){if(!e)return null;if(e.id===t)return e;if(Array.isArray(e.ports)){for(let n of e.ports)if(n.child){if(n.child.id===t)return n.child;let e=yn(n.child,t);if(e)return e}}return null}function bn(e,t){if(!e)return null;if(Array.isArray(e.ports))for(let n of e.ports){if(n.id===t)return{port:n,parentNode:e};if(n.child&&n.child.type!==`device`){let e=bn(n.child,t);if(e)return e}}return null}function xn(e){if(!e)return{valid:!1,error:`Empty topology tree`};let t=new Map,n=null;function r(e,r){if(!e)return;let i=e.trim();if(i)return t.has(i)?(n=`Duplicate IP address ${i} used by "${r}" and "${t.get(i)}"`,!1):(t.set(i,r),!0)}function i(e,t){if(n||!e)return;let a=`${e.name||e.type} (${t})`;e.ip&&r(e.ip,a),n||(Array.isArray(e.wireless_clients)&&e.wireless_clients.forEach((i,a)=>{n||r(i.ip,`Wireless Client ${i.name||a+1} on ${e.name||t}`)}),n||Array.isArray(e.ports)&&e.ports.forEach((e,a)=>{n||(e.role===`device`&&e.child?r(e.child.ip,`Device ${e.child.name||`Device`} on ${t} -> ${e.label}`):e.role===`node`&&e.child&&i(e.child,`${t} -> ${e.label}`))}))}return i(e,e.name||`Root Router`),n?{valid:!1,error:n}:{valid:!0}}function Sn(e){let t={};return[1,2,3,4].forEach(n=>{let r=`lan`+n,i=e&&e.ports&&e.ports[n-1]||null;if(!i||i.role===`empty`||!i.child)t[r]={portIndex:n,mode:`empty`,device:null};else if(i.role===`device`)t[r]={portIndex:n,mode:`direct`,device:{name:i.child.name||`Direct Client`,ip:i.child.ip||``,mac:i.child.mac||``}};else if(i.role===`node`){let e=i.child,a=[];Array.isArray(e.ports)&&e.ports.forEach(e=>{e.role===`device`&&e.child?a.push({name:e.child.name||`Wired Device`,ip:e.child.ip||``,mac:e.child.mac||``,conn_type:`LAN Port`}):e.role===`node`&&e.child&&a.push({name:e.child.name||`Cascaded Router`,ip:e.child.ip||``,mac:e.child.mac||``,conn_type:`Router / Sub-AP`,is_router:!0})}),Array.isArray(e.wireless_clients)&&e.wireless_clients.forEach(e=>{a.push({name:e.name||`Wireless Device`,ip:e.ip||``,mac:e.mac||``,conn_type:e.band===`5G`?`5GHz WiFi`:`2.4GHz WiFi`})}),t[r]={portIndex:n,mode:`layer2_ap`,ap:{name:e.name||`Access Point`,ip:e.ip||``,mac:e.mac||``,model:e.type===`switch`?`Ethernet Switch`:`Access Point`},layer3_devices:a}}}),t}function Cn(e,t){return!e.usb_config||!Array.isArray(e.usb_config.ports)?``:e.usb_config.ports.map((e,t)=>{let n=e.role&&e.role!==`empty`,r=e.role===`phone`,i=e.role===`storage`,a=e.role===`tailscale`,o=e.speed===`usb3`||!e.speed&&t!==1,s=o?`5 Gbps (SuperSpeed)`:`480 Mbps (HighSpeed)`,c=`Empty / Disconnected Port`;return r?c=`Tethered Phone / 5G Modem &bull; ${$(e.name||`Cellular Modem`)} &bull; ${s}`:i?c=`External NVMe/SSD Storage &bull; ${$(e.name||`Storage Drive`)} &bull; ${s}`:a?c=`Remote Tailscale / WireGuard Node &bull; ${$(e.name||`Mesh Peer`)}`:n&&(c=`Connected USB Peripheral &bull; ${$(e.name||`USB Device`)} &bull; ${s}`),`
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
        `}).join(``)}function wn(e){window._topoTree&&(window._topoTree.wan_mode=e,G(),K(window._topoTree),typeof W==`function`&&W())}function Tn(e){window._topoTree&&(window._topoTree.wan_speed=e,G(),K(window._topoTree),typeof W==`function`&&W())}function En(e){window._topoTree&&(window._topoTree.usb_config||(window._topoTree.usb_config={mode:e,num_ports:4,ports:[]}),window._topoTree.usb_config.mode=e,G(),K(window._topoTree),typeof W==`function`&&W())}function Dn(e){if(!window._topoTree)return;(isNaN(e)||e<1)&&(e=1),e>8&&(e=8),window._topoTree.usb_config||(window._topoTree.usb_config={mode:`hub`,num_ports:e,ports:[]});let t=window._topoTree.usb_config;for(t.num_ports=e,t.ports=t.ports||[];t.ports.length<e;){let e=t.ports.length+1;t.ports.push({id:`usb-`+e,label:`USB `+e,role:`empty`,name:``,speed:`usb3`})}t.ports.length>e&&(t.ports=t.ports.slice(0,e)),G(),K(window._topoTree),typeof W==`function`&&W()}function On(e,t,n){if(!window._topoTree||!window._topoTree.usb_config)return;let r=window._topoTree.usb_config;Array.isArray(r.ports)&&r.ports[e]&&(r.ports[e][t]=n,t===`role`&&n===`empty`?r.ports[e].name=``:t===`role`&&n===`phone`&&!r.ports[e].name?(r.ports[e].name=`Samsung Galaxy S21 FE 5G`,r.ports[e].speed=`usb3`):t===`role`&&n===`storage`&&!r.ports[e].name&&(r.ports[e].name=`NVMe SSD Storage`,r.ports[e].speed=`usb3`),G(),K(window._topoTree),typeof W==`function`&&W())}var kn=null;function G(){clearTimeout(kn),kn=setTimeout(()=>{Jn(!0)},350)}function An(e,t){if(!window._topoTree)return;let n=yn(window._topoTree,e);if(!n||n.type===`device`)return;let r=parseInt(t,10);(isNaN(r)||r<1)&&(r=1),r>48&&(r=48),n.numPorts=r,_n(n),G(),K(window._topoTree),typeof W==`function`&&W()}function jn(e,t){if(!window._topoTree)return;let n=bn(window._topoTree,e);if(!n)return;let{port:r}=n;if(r.role=t,t===`empty`)r.child=null;else if(t===`device`){let e=mn(),t=vn(window._topoTree,r.id),n=e.find(e=>!t.has(e.ip))||{name:`Device`,ip:``,mac:``};r.child={id:`dev-`+Date.now().toString(36),type:`device`,name:n.name||`Device`,ip:n.ip||``,mac:n.mac||``,uplinkPort:r.id}}else if(t===`node`){let e=mn(),t=vn(window._topoTree,r.id),n=e.find(e=>!t.has(e.ip)&&e.name&&(e.name.toLowerCase().includes(`router`)||e.name.toLowerCase().includes(`ap`)))||e.find(e=>!t.has(e.ip))||{name:`Access Point`,ip:`10.0.0.`+(Math.floor(Math.random()*40)+10),mac:``},i={id:`node-`+Date.now().toString(36),type:`ap`,name:n.name||`Access Point`,ip:n.ip||``,mac:n.mac||``,uplinkPort:r.id,numPorts:4,ports:[],wireless_clients:[]};for(let e=1;e<=4;e++)i.ports.push({id:i.id+`-lan`+e,label:`LAN `+e,role:`empty`,child:null});r.child=i}G(),K(window._topoTree),typeof W==`function`&&W()}function Mn(e,t){if(!window._topoTree)return;let n=bn(window._topoTree,e);if(!n||!n.port.child)return;let r=n.port.child;if(t===`__manual__`){K(window._topoTree);return}let i=mn().find(e=>e.ip===t);i?(r.name=i.name||i.model||`Device`,r.ip=i.ip||``,r.mac=i.mac||``):t&&(r.ip=t),G(),K(window._topoTree),typeof W==`function`&&W()}function Nn(e,t,n){if(!window._topoTree)return;let r=bn(window._topoTree,e);r&&r.port.child&&(r.port.child[t]=n,zn(),G(),typeof W==`function`&&W())}function Pn(e,t){if(!window._topoTree)return;let n=bn(window._topoTree,e);if(!n||!n.port.child)return;let r=n.port.child,i=mn().find(e=>e.ip===t);i?(r.name=i.name||`Access Point`,r.ip=i.ip||``,r.mac=i.mac||``):t&&(r.ip=t),G(),K(window._topoTree),typeof W==`function`&&W()}function Fn(e,t,n){if(!window._topoTree)return;let r=yn(window._topoTree,e);r&&(r[t]=n,zn(),G(),typeof W==`function`&&W())}function In(e){if(!window._topoTree)return;let t=yn(window._topoTree,e);if(!t)return;Array.isArray(t.wireless_clients)||(t.wireless_clients=[]);let n=mn(),r=vn(window._topoTree),i=n.find(e=>!r.has(e.ip))||{name:`WiFi Device`,ip:``,mac:``};t.wireless_clients.push({name:i.name||`Wireless Device`,ip:i.ip||``,mac:i.mac||``,band:`5G`,linkSpeed:`433 Mbps`}),G(),K(window._topoTree),typeof W==`function`&&W()}function Ln(e,t){if(!window._topoTree)return;let n=yn(window._topoTree,e);n&&Array.isArray(n.wireless_clients)&&(n.wireless_clients.splice(t,1),G(),K(window._topoTree),typeof W==`function`&&W())}function Rn(e,t,n,r){if(!window._topoTree)return;let i=yn(window._topoTree,e);if(!i||!Array.isArray(i.wireless_clients)||!i.wireless_clients[t])return;let a=i.wireless_clients[t];if(a[n]=r,n===`ip`){let e=mn().find(e=>e.ip===r);e&&(a.name&&a.name!==`Wireless Device`||(a.name=e.name||`WiFi Device`),a.mac=e.mac||``)}zn(),G(),typeof W==`function`&&W()}function zn(){let e=document.getElementById(`topoValidationNotice`),t=document.getElementById(`btnSaveTopo`);if(!e||!window._topoTree)return;let n=xn(window._topoTree);n.valid?(e.style.display=`none`,e.innerHTML=``,t&&(t.disabled=!1)):(e.style.display=`flex`,e.className=`topo-validation-box invalid`,e.innerHTML=`
          <svg class="svg-icon" viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span><strong>Validation Warning:</strong> ${$(n.error||`Duplicate or invalid IP address detected.`)}</span>
        `,t&&(t.disabled=!0))}function Bn(){let e=document.getElementById(`topoPreferencesSection`);if(!e)return;let t=jt();e.innerHTML=`
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
      `}function Vn(){window._topoPrefsOpen=!window._topoPrefsOpen;let e=document.getElementById(`topoPrefsBody`),t=document.getElementById(`topoPrefsChevron`);e&&(e.style.display=window._topoPrefsOpen?`flex`:`none`),t&&(t.style.transform=window._topoPrefsOpen?`rotate(180deg)`:``)}function Hn(e,t=1,n=null,r=null){if(!e)return[];let i=[{node:e,depth:t,parentNode:n,uplinkPort:r}];return Array.isArray(e.ports)&&e.ports.forEach(n=>{n.role===`node`&&n.child&&i.push(...Hn(n.child,t+1,e,n))}),i}function K(e){let t=document.getElementById(`topoLayerPortsContainer`);if(!t)return;let n=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`,r=window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_mac||`2e:dd:4c:b2:8c:fa`;(!window._topoTree||e)&&(window._topoTree=gn(e||window._topologyLayers,n,r));let i=window._topoTree,a=mn(),o=vn(i);zn(),Bn(),t.innerHTML=Hn(i).map(e=>Gn(e.node,e.depth,e.parentNode,e.uplinkPort,a,o)).join(``)}function Un(e,t,n,r,i){return Gn(e,t||1,null,null,n,r)}function Wn(e,t,n,r,i){return Gn(e,t||1,null,null,n,r)}function Gn(e,t,n,r,i,a){if(!e)return``;let o=t===1,s=Array.isArray(e.ports)?e.ports.length:e.numPorts||4,c=e.type===`router`,l=e.type===`ap`;e.type;let u=c||l,d=e.wireless_clients||[],f=Nt(document.documentElement.getAttribute(`data-theme`)===`light`,jt().theme),p=t===1?f.l1:t===2?f.l2:t===3?f.l3:f.l4,m=r?` (via ${$(n.name||`Host`)} &rarr; ${$(r.label||`Port`)})`:``;return`
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
                <span class="setting-label-sub">Number of physical USB ports on the hub (1 to 8)</span>
              </div>
              <div>
                <input type="number" min="1" max="8" class="mh-input" value="${e.usb_config&&e.usb_config.ports?e.usb_config.ports.length:4}" onchange="onUsbPortCountChange(parseInt(this.value, 10))" style="width:100%; box-sizing:border-box; font-size:12px;">
              </div>
            </div>

            <!-- USB Hub Ports List -->
            ${Cn(e,p)}
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
                      <option value="">-- Choose Device from Network Scan --</option>
                      ${i.map(e=>{let t=a.has(e.ip)&&e.ip!==u,n=t?`disabled style="color:var(--text-dim); opacity:0.45;"`:``,r=t?` [In use]`:``;return`<option value="${$(e.ip)}" ${u===e.ip?`selected`:``} ${n}>${$(e.name||`Device`)} &bull; ${$(e.ip)}${r}</option>`}).join(``)}
                      <option value="__manual__" ${!i.some(e=>e.ip===u)&&u?`selected`:``}>+ Custom IP Device...</option>
                    </select>
                    ${!i.some(e=>e.ip===u)&&u?`
                      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; width:100%;">
                        <input type="text" class="mh-input" placeholder="Device Name" value="${$(d)}" oninput="onCustomPortDeviceChange('${$(n.id)}', 'name', this.value)" style="width:100%; box-sizing:border-box; font-size:11px;">
                        <input type="text" class="mh-input" placeholder="IPv4 Address" value="${$(u)}" oninput="onCustomPortDeviceChange('${$(n.id)}', 'ip', this.value)" style="width:100%; box-sizing:border-box; font-size:11px; font-family:var(--font-mono);">
                        <input type="text" class="mh-input" placeholder="MAC (optional)" value="${$(f)}" oninput="onCustomPortDeviceChange('${$(n.id)}', 'mac', this.value)" style="width:100%; box-sizing:border-box; font-size:11px; font-family:var(--font-mono);">
                      </div>
                    `:``}
                  `:``}

                  ${c?`
                    <select class="mh-input" onchange="onSelectPortNodeClient('${$(n.id)}', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                      <option value="">-- Choose AP/Router from Network Scan --</option>
                      ${i.map(e=>{let t=a.has(e.ip)&&e.ip!==l.ip,n=t?`disabled style="color:var(--text-dim); opacity:0.45;"`:``,r=t?` [In use]`:``;return`<option value="${$(e.ip)}" ${l.ip===e.ip?`selected`:``} ${n}>${$(e.name||`Router`)} &bull; ${$(e.ip)}${r}</option>`}).join(``)}
                    </select>
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
      `}function Kn(e,t,n){if(!n||!window._topoTree)return;function r(e,t){if(!e)return null;if(e.id===t)return e;if(Array.isArray(e.ports)){for(let n of e.ports)if(n.role===`node`&&n.child){let e=r(n.child,t);if(e)return e}}return null}let i=r(window._topoTree,e);if(i){if(i.wireless_clients=i.wireless_clients||[],n===`__manual__`){let e=prompt(`Enter device IP address:`);if(!e)return;let n=prompt(`Enter device name (optional):`)||`Device `+e.split(`.`).pop();i.wireless_clients.push({id:`wc-`+Date.now()+Math.random().toString(36).substr(2,4),name:n,ip:e.trim(),band:t})}else{let e=(window._lastDataCache&&Array.isArray(window._lastDataCache.clients)?window._lastDataCache.clients:[]).find(e=>e&&e.ip===n),r=e&&e.name||`Device `+n.split(`.`).pop(),a=e&&e.mac||``;i.wireless_clients.some(e=>e.ip===n)||i.wireless_clients.push({id:`wc-`+Date.now()+Math.random().toString(36).substr(2,4),name:r,ip:n,mac:a,band:t})}G(),K(window._topoTree),typeof W==`function`&&W()}}function qn(e,t){if(!window._topoTree)return;function n(e,t){if(!e)return null;if(e.id===t)return e;if(Array.isArray(e.ports)){for(let r of e.ports)if(r.role===`node`&&r.child){let e=n(r.child,t);if(e)return e}}return null}let r=n(window._topoTree,e);r&&Array.isArray(r.wireless_clients)&&(r.wireless_clients=r.wireless_clients.filter(e=>e.id!==t&&e.ip!==t),G(),K(window._topoTree),typeof W==`function`&&W())}async function Jn(e=!1){if(!window._topoTree)return;let t=xn(window._topoTree);if(!t.valid){e||alert(`Cannot save topology: `+t.error),zn();return}let n={status:`ok`,version:2,tree:window._topoTree,ports:Sn(window._topoTree)};try{let t=await(await fetch(`/cgi-bin/topology_layers`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(n)})).json();t&&t.status===`ok`?(window._topologyLayers=n,window._topologyLayersSavedLocally=!0,typeof W==`function`&&W(),e||rr(`Topology configuration saved & verified successfully!`)):e||alert(`Error saving topology configuration: `+(t?t.message:`Unknown error`))}catch(e){console.error(`Error saving topology:`,e),window._topologyLayers=n,typeof W==`function`&&W(),rr(`Topology updated live in local session!`)}}async function Yn(){if(confirm(`Reset network topology to default hierarchy?`))try{let e=await(await fetch(`/cgi-bin/topology_layers?action=reset`,{method:`POST`})).json(),t=gn(e);window._topoTree=t,window._topologyLayers=e,K(t),typeof W==`function`&&W(),rr(`Topology reset to default hierarchy!`)}catch(e){console.error(`Error resetting topology:`,e);let t=hn();window._topoTree=t,K(t),typeof W==`function`&&W()}}async function Xn(){try{let e=await fetch(`/cgi-bin/topology_layers`);if(e.ok){let t=await e.json();if(t){window._topologyLayers=t;let e=gn(t);window._topoTree=e,K(e),typeof W==`function`&&W()}}}catch(e){console.error(`Error fetching topology layers:`,e)}}async function Zn(){typeof Q==`function`&&Q(`Deep-scanning network ARP tables, DHCP leases, and switch ports...`,`info`);try{let e=await fetch(`/cgi-bin/topology_layers?action=auto_scan`,{cache:`no-store`});if(e.ok){let t=await e.json();if(t&&t.tree&&t.tree.id===`root`){window._topoTree=t.tree,window._topologyLayers=t,K(window._topoTree),typeof W==`function`&&W(),rr(`Deep auto-topology generated from kernel bridge & ARP tables!`);return}}}catch(e){console.warn(`Backend auto_scan request failed, using client heuristic auto-map:`,e)}let e=mn();if(!e||e.length===0){alert(`No active clients discovered to auto-map.`);return}let t=hn(),n=new Set;n.add(t.ip);let r=e.find(e=>{let t=(e.name||``).toLowerCase(),n=(e.vendor||``).toLowerCase();return n.includes(`cisco`)||n.includes(`tp-link`)||n.includes(`netgear`)||n.includes(`openwrt`)||t.includes(`router`)||t.includes(`ap`)||t.includes(`maxnet`)||t.includes(`openwrt`)||e.ip===`10.0.0.2`});if(r){let i=t.ports[2];i.role=`node`,i.child={id:`node-`+(r.name?r.name.replace(/\s+/g,`-`).toLowerCase():`maxnet-b`),type:`ap`,name:r.name||`maxnet-b`,ip:r.ip||`10.0.0.2`,mac:r.mac||`8c:a3:99:7b:81:2b`,status:r.connected!==!1&&r.status!==`offline`?`online`:`offline`,uplinkPort:i.id,numPorts:4,ports:[{id:`ap-lan1`,label:`LAN 1`,role:`empty`,child:null},{id:`ap-lan2`,label:`LAN 2`,role:`empty`,child:null},{id:`ap-lan3`,label:`LAN 3`,role:`empty`,child:null},{id:`ap-lan4`,label:`LAN 4`,role:`empty`,child:null}],wireless_clients:[]},n.add(r.ip);let a=e.find(e=>!n.has(e.ip)&&((e.vendor||``).toLowerCase().includes(`synology`)||e.name&&(e.name.toLowerCase().includes(`synology`)||e.name.toLowerCase().includes(`nas`))||e.ip===`10.0.0.5`));a&&(i.child.ports[0].role=`device`,i.child.ports[0].child={id:`dev-synology`,type:`device`,name:a.name||`Synology NAS`,ip:a.ip,mac:a.mac||`00:11:32:92:02:1b`,status:a.connected!==!1&&a.status!==`offline`?`online`:`offline`,uplinkPort:i.child.ports[0].id},n.add(a.ip)),e.forEach(e=>{!n.has(e.ip)&&e.ip!==`10.0.0.111`&&e.ip!==`10.0.0.1`&&(e.port&&e.port.includes(`LAN 3`)||e.conn_type&&e.conn_type.includes(`WiFi`)||e.name&&(e.name.toLowerCase().includes(`poco`)||e.name.toLowerCase().includes(`vivo`)||e.name.toLowerCase().includes(`phone`)||e.name.toLowerCase().includes(`realme`)||e.name.toLowerCase().includes(`motorola`)))&&i.child.wireless_clients.length<12&&(i.child.wireless_clients.push({name:e.name||`WiFi Device`,ip:e.ip,mac:e.mac||``,status:e.connected!==!1&&e.status!==`offline`?`online`:`offline`,band:`WiFi`,linkSpeed:`72 Mbps`}),n.add(e.ip))})}let i=e.find(e=>!n.has(e.ip)&&(e.port&&e.port.includes(`LAN 2`)||e.name&&(e.name.toLowerCase().includes(`maxos`)||e.name.toLowerCase().includes(`pc`)||e.name.toLowerCase().includes(`desktop`))||e.ip===`10.0.0.111`));i&&(t.ports[1].role=`device`,t.ports[1].child={id:`dev-maxos`,type:`device`,name:i.name||`maxos`,ip:i.ip,mac:i.mac||``,status:i.connected!==!1&&i.status!==`offline`?`online`:`offline`,uplinkPort:t.ports[1].id},n.add(i.ip)),window._topoTree=t,K(t),typeof W==`function`&&W(),rr(`Topology auto-mapped from active scan!`)}function Qn(){let e=document.getElementById(`topoJsonModalOverlay`),t=document.getElementById(`topoJsonModalTitle`),n=document.getElementById(`topoJsonModalDesc`),r=document.getElementById(`topoJsonTextarea`),i=document.getElementById(`topoJsonModalApplyBtn`),a=document.getElementById(`topoJsonError`);if(!e||!r)return;e.parentElement!==document.body&&document.body.appendChild(e),t&&(t.textContent=`Export Topology JSON`),n&&(n.textContent=`Current recursive tree JSON configuration:`),a&&(a.style.display=`none`),i&&(i.style.display=`none`);let o={status:`ok`,version:2,tree:window._topoTree||hn()};r.value=JSON.stringify(o,null,2),e.style.display=`flex`,requestAnimationFrame(()=>{e.classList.add(`active`)})}function $n(){let e=document.getElementById(`topoJsonModalOverlay`),t=document.getElementById(`topoJsonModalTitle`),n=document.getElementById(`topoJsonModalDesc`),r=document.getElementById(`topoJsonTextarea`),i=document.getElementById(`topoJsonModalApplyBtn`),a=document.getElementById(`topoJsonError`);e&&r&&(e.parentElement!==document.body&&document.body.appendChild(e),t&&(t.textContent=`Import Topology JSON`),n&&(n.textContent=`Paste exported topology JSON below to restore network structure:`),a&&(a.style.display=`none`),i&&(i.style.display=`inline-block`),r.value=``,r.placeholder=`Paste {"status":"ok","version":2,"tree":{...}} JSON here...`,e.style.display=`flex`,requestAnimationFrame(()=>{e.classList.add(`active`)}))}function er(){let e=document.getElementById(`topoJsonModalOverlay`);e&&(e.classList.remove(`active`),e.style.display=`none`)}function tr(){let e=document.getElementById(`topoJsonTextarea`),t=document.getElementById(`btnCopyTopoJson`);e&&(e.select(),navigator.clipboard.writeText(e.value).then(()=>{if(t){let e=t.textContent;t.textContent=`COPIED!`,setTimeout(()=>{t.textContent=e},1800)}}).catch(e=>{document.execCommand(`copy`)}))}function nr(){let e=document.getElementById(`topoJsonTextarea`),t=document.getElementById(`topoJsonError`);if(e)try{let n=gn(JSON.parse(e.value.trim())),r=xn(n);if(!r.valid){t&&(t.textContent=`Validation error: `+r.error,t.style.display=`block`);return}window._topoTree=n,K(n),typeof W==`function`&&W(),er(),rr(`Topology JSON imported & applied successfully!`)}catch(e){t&&(t.textContent=`Invalid JSON: `+e.message,t.style.display=`block`)}}function rr(e){let t=document.getElementById(`deviceActionStatus`);t&&(t.textContent=e,t.style.color=`#10b981`,setTimeout(()=>{t.textContent=``},3500))}window.renderClientCards=an;function ir(e){let t=document.getElementById(`blockedClientsCards`),n=document.getElementById(`blockedCountBadge`);n&&(n.innerText=`${e.length} BLOCKED`),t&&(t.innerHTML=!e||e.length===0?`<div style="text-align:center; color:var(--text-dim); padding:10px; font-size:12px;">No clients currently blocked.</div>`:e.map(e=>`
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
      `).join(``))}async function ar(e,t,n){if(cn({ip:e,mac:t,name:n}))typeof Q==`function`?Q(`Cannot block router gateway host.`,`error`):alert(`Cannot block router gateway host.`);else if(confirm(`Are you sure you want to block internet access for ${n||e}?`))try{await fetch(`/cgi-bin/clients`,{method:`POST`,body:JSON.stringify({action:`block`,ip:e,mac:t,name:n})}),await Qt(),z()}catch(e){alert(`Error blocking client: `+e)}}async function or(e,t){try{await fetch(`/cgi-bin/clients`,{method:`POST`,body:JSON.stringify({action:`unblock`,ip:e,mac:t})}),await Qt(),z()}catch(e){alert(`Error unblocking client: `+e)}}async function sr(){let e=document.getElementById(`manualBlockIp`).value.trim(),t=document.getElementById(`manualBlockMac`).value.trim();!e&&!t?alert(`Please enter an IP or MAC address to block.`):cn({ip:e,mac:t})?typeof Q==`function`?Q(`Cannot block router gateway host.`,`error`):alert(`Cannot block router gateway host.`):(await ar(e,t,`Firewall Blocked Device`),document.getElementById(`manualBlockIp`).value=``,document.getElementById(`manualBlockMac`).value=``)}var q=``;async function cr(){try{let e=[];if(window._lastDataCache&&Array.isArray(window._lastDataCache.usb_devices)&&window._lastDataCache.usb_devices.length>0)e=window._lastDataCache.usb_devices;else{let t=await(await u(`/cgi-bin/device?action=devices`)).json();e=Array.isArray(t.devices)?t.devices:[]}let t=document.getElementById(`adbDevCountBadge`);t&&(t.innerText=`${e.length} PORTS`),lr(e)}catch(e){console.error(`fetchAdbDeviceList error`,e)}}function lr(e){let t=document.getElementById(`usbDevicesListFlow`);if(!t)return;if(!e||e.length===0){t.innerHTML=`
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
        `}),t.innerHTML=n}async function ur(){typeof Q==`function`&&Q(`Restarting network & multi-link daemons...`);try{await u(`/cgi-bin/diagnostics?tool=restart_network`),typeof Q==`function`&&Q(`Network and multi-link restarted!`)}catch(e){console.error(e)}}async function dr(){typeof Q==`function`&&Q(`Flushing DNS cache & conntrack table...`);try{await u(`/cgi-bin/diagnostics?tool=flush_cache`),typeof Q==`function`&&Q(`DNS cache & conntrack flushed!`)}catch(e){console.error(e)}}function fr(){window.location.href=`/cgi-bin/diagnostics?tool=dmesg_download`}function pr(e){mr(e)}function mr(e){q=e;let t=(window._lastDataCache&&Array.isArray(window._lastDataCache.usb_devices)?window._lastDataCache.usb_devices:[]).find(t=>t.serial===e||t.bus===e||t.hostname===e),n=document.getElementById(`storageDevicePanel`),r=document.getElementById(`phoneDevicePanel`);if(t&&(t.device_type===`storage`||t.device_type===`pendrive`||t.device_type===`ssd`||t.has_storage)){n&&(n.style.display=`block`),r&&(r.style.display=`none`);let e=document.getElementById(`storDevType`);e&&(e.innerText=t.device_type===`ssd`?`NVMe SSD`:`USB Flash Drive`);let i=document.getElementById(`storDevModel`);i&&(i.innerText=t.model||`Disk 2.0`);let a=document.getElementById(`storDevPort`);a&&(a.innerText=`Port ${t.port||3}`);let o=document.getElementById(`storDevSpeed`);o&&(o.innerText=`${t.speed_mbps||480} Mbps (${t.standard||`USB 2.0`})`);let s=document.getElementById(`storDevIp`);s&&(s.innerText=t.virtual_ip||window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||`10.0.0.1`);let c=document.getElementById(`storDevHost`);c&&(c.innerText=t.hostname||`usb3-Disk-2-0.lan`);let l=document.getElementById(`storDevMount`);l&&(l.innerText=`${t.mount_point||`/mnt/pendrive`} (${t.mounted?`Mounted`:`Standby`})`);let u=document.getElementById(`storDevCap`);u&&(u.innerText=t.total_space&&t.total_space!==`--`?`${t.total_space} (${t.free_space||`0`} free)`:`Ready (Standby)`)}else n&&(n.style.display=`none`),r&&(r.style.display=`block`),hr()}async function hr(){try{let e=await(await u(`/cgi-bin/device?action=telemetry`+(q?`&serial=`+encodeURIComponent(q):``))).json();if(e.status===`ok`){let t=e.identity||{},n=e.battery||{},r=e.thermals||{},i=e.memory||{},a=e.storage||{},o=e.radio||{},s=e.adb_enabled===!1,c=document.getElementById(`devModel`);c&&(c.innerText=(t.brand?t.brand.toUpperCase()+` `:``)+(t.model||`--`));let l=document.getElementById(`devSoc`);l&&(l.innerText=s?`ADB Disabled`:t.soc||`--`);let u=document.getElementById(`devOs`);u&&(u.innerText=s?`ADB Disabled`:t.android&&t.android!==`--`?`Android ${t.android}`:`--`);let d=document.getElementById(`devBattLevel`);d&&(d.innerText=s?`ADB Disabled`:n.level!==void 0&&n.level!==null?`${n.level}% (${n.technology||`Li-ion`})`:`--`);let f=document.getElementById(`devBattVolt`);f&&(f.innerText=s?`--`:n.voltage_mv?`${n.voltage_mv} mV`:`--`);let p=document.getElementById(`devCpuTemp`);p&&(p.innerHTML=!s&&r&&r.cpu_c!==void 0?`<span style="color:${I(r.cpu_c)}">${r.cpu_c}°C</span>`:`--`);let m=document.getElementById(`devBattTemp`);m&&(m.innerHTML=!s&&r&&r.battery_c!==void 0?`<span style="color:${I(r.battery_c)}">${r.battery_c}°C</span>`:`--`);let h=document.getElementById(`devUsbTemp`);h&&(h.innerHTML=!s&&r&&r.usb_c!==void 0?`<span style="color:${I(r.usb_c)}">${r.usb_c}°C</span>`:`--`);let g=document.getElementById(`devSkinTemp`);g&&(g.innerHTML=!s&&r&&r.skin_c!==void 0?`<span style="color:${I(r.skin_c)}">${r.skin_c}°C</span>`:`--`);let _=document.getElementById(`devPaTemp`);_&&(_.innerHTML=!s&&r&&r.rf_pa_c!==void 0?`<span style="color:${I(r.rf_pa_c)}">${r.rf_pa_c}°C</span>`:`--`);let v=document.getElementById(`devRamPct`);v&&(v.innerHTML=!s&&i&&i.total_mb>0?`${i.used_mb||0}M / ${i.total_mb}M (<span style="color:${L(i.used_pct)}">${i.used_pct||0}%</span>)`:`--`);let y=document.getElementById(`devStorageFree`);y&&(y.innerText=!s&&a&&a.avail&&a.avail!==`--`?`${a.avail} FREE / ${a.total||`--`}`:`--`);let b=document.getElementById(`devBand`);b&&(b.innerText=s?`--`:o&&o.has_sim===!1?`No SIM Card`:o&&o.band&&o.band!==`--`?`${o.band} (PCI ${o.pci||`--`})`:`--`);let x=document.getElementById(`devRsrp`);x&&(x.innerText=s?`--`:o&&o.has_sim===!1?`No Signal`:o&&o.rsrp_dbm?`${o.rsrp_dbm} dBm (${o.sinr_db||0} dB)`:`--`);let S=document.getElementById(`devScreenState`);S&&(S.innerText=s?`--`:e.screen_state||`Awake`);let C=document.getElementById(`devUptime`);C&&(C.innerText=s?`--`:e.uptime||`--`)}}catch(e){console.error(`fetchDeviceTelemetry error`,e)}}async function gr(){let e=document.getElementById(`smsInboxList`);if(e){e.innerHTML=`<div style="color:var(--text-dim); font-size:11.5px; padding:12px; text-align:center;">Fetching SMS messages from SIM card...</div>`;try{let t=await(await fetch(`/cgi-bin/device?action=sms`)).json(),n=Array.isArray(t.sms)?t.sms:[];if(n.length===0){e.innerHTML=`<div style="color:var(--text-dim); font-size:11.5px; padding:12px; text-align:center;">No incoming messages found.</div>`;return}e.innerHTML=n.map(e=>{let t=``;if(e.date){let n=new Date(parseInt(e.date,10));t=isNaN(n.getTime())?``:n.toLocaleString()}return`
            <div class="sms-chat-bubble">
              <div class="sms-bubble-top">
                <div style="display:flex; align-items:center; gap:6px;">
                  <svg class="svg-icon" style="color:var(--mh-purple); width:13px; height:13px;" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span class="sms-sender">${$(e.address||`Unknown`)}</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="sms-time">${$(t)}</span>
                  <button class="mh-btn btn-sm btn-ghost" onclick="navigator.clipboard.writeText('${$(e.body||``)}'); alert('Copied message text')" style="font-size:9.5px; padding:2px 6px;">COPY</button>
                </div>
              </div>
              <div class="sms-body-text">${$(e.body||``)}</div>
            </div>
          `}).join(``)}catch(t){e.innerHTML=`<div style="color:var(--mh-rose); font-size:11.5px; padding:10px;">Failed to fetch messages: `+$(t.message)+`</div>`}}}async function _r(){let e=document.getElementById(`deviceToolOutput`);e.style.display=`block`,e.innerText=`Pinging 8.8.8.8 directly from phone 5G interface...`;try{e.innerText=(await(await fetch(`/cgi-bin/device?action=ping`)).json()).output||`Ping test complete.`}catch(t){e.innerText=`Error running ping: `+t.message}}var J={torch:{},silent:{},screen:{},screenAwake:{},volume:{},radio:{},wirelessAdb:{}};try{let e=localStorage.getItem(`maxnet_adb_states`);e&&(J=Object.assign(J,JSON.parse(e)))}catch{}function vr(){try{localStorage.setItem(`maxnet_adb_states`,JSON.stringify(J))}catch{}}function yr(e){return e||(e=`default_adb`),J.torch||(J.torch={}),J.screenAwake||(J.screenAwake={}),J.volume||(J.volume={}),J.radio||(J.radio={}),J.wirelessAdb||(J.wirelessAdb={}),J.torch[e]===void 0&&(J.torch[e]=!1),J.screenAwake[e]===void 0&&(J.screenAwake[e]=!0),J.volume[e]===void 0&&(J.volume[e]=10),J.radio[e]||(J.radio[e]=`active`),J.wirelessAdb[e]===void 0&&(J.wirelessAdb[e]=!1),{torch:J.torch[e],screenAwake:J.screenAwake[e],volume:J.volume[e],radio:J.radio[e],wirelessAdb:J.wirelessAdb[e]}}function br(e){let t=document.getElementById(`btnTorchToggle`),n=document.getElementById(`dispTorchStatus`),r=document.getElementById(`dispTorchSub`);t&&(e?t.classList.add(`active-torch`):t.classList.remove(`active-torch`)),n&&(e?(n.className=`setting-pill pill-amber`,n.textContent=`TORCH ON`):(n.className=`setting-pill`,n.textContent=`OFF`)),r&&(r.innerHTML=`<strong style="color:${e?`#f59e0b`:`var(--text-dim)`};">State: ${e?`ON`:`OFF`}</strong> &bull; High-intensity rear camera LED torch`)}async function xr(e){if(q){e&&e.classList.add(`rotating`);try{let e=await(await u(`/cgi-bin/device?serial=${encodeURIComponent(q)}`)).json();if(e){let t=document.getElementById(`dispDevModelTitle`),n=document.getElementById(`dispDevModelSub`),r=document.getElementById(`dispDevBatterySub`),i=document.getElementById(`dispDevSerialSub`),a=document.getElementById(`dispRadioSub`),o=e.identity||{},s=e.brand||o.brand||``,c=e.model||o.model||`Android Handset`,l=e.android_version||o.android||`--`,u=e.security_patch||o.security_patch||`--`,d=e.soc||o.soc||`--`;t&&(t.textContent=`${s?s+` `:``}${c}`),n&&(n.textContent=`Android ${l} • Patch: ${u} • SoC: ${d}`);let f=e.battery||{},p=e.battery_level??f.level??`--`,m=e.battery_temp??f.temp_c??`--`,h=e.battery_health||f.health||(f.health_code===`2`?`Good`:`Normal`),g=e.battery_status||f.status;g||(g=e.battery_charging||f.charging||f.status_code===`2`?`Charging`:f.status_code===`4`?`Not Charging (Protected)`:f.status_code===`5`?`Full`:`Discharging`),r&&(r.textContent=`Level: ${p}% (${g}) • Temp: ${m}°C • Health: ${h}`);let _=e.usb||{},v=e.serial||o.serial||e.device_id||q,y=e.speed_mbps||_.speed_mbps||480,b=_.standard||(y>=5e3?`USB 3.0`:`USB 2.0`),x=e.port||_.port||`1`;i&&(i.textContent=`Serial: ${v} • Port: ${x} • ${b} (${y} Mbps)`);let S=e.radio||{},C=S.operator||e.operator||`Cellular`,w=S.network||e.network_type||`5G SA`,T=S.band?` • ${S.band}`:``;a&&(a.textContent=`Carrier: ${C} • ${w}${T} • State: Active`);let E=document.getElementById(`dispDevUptimeSub`);E&&(E.innerHTML=`<strong>Uptime: ${$(e.uptime||`--`)}</strong> &bull; Powered on &amp; operational`)}}catch(e){console.error(`fetchAdbLiveTelemetry error`,e)}finally{e&&setTimeout(()=>e.classList.remove(`rotating`),600)}}}function Sr(){q&&navigator.clipboard&&(navigator.clipboard.writeText(q),alert(`Copied ADB Serial "${q}" to clipboard`))}window._currentAdbSubView=`controls`;function Cr(e){window._currentAdbSubView=e;let t={controls:document.getElementById(`adbDetailView`),sms:document.getElementById(`adbSmsPageView`),calls:document.getElementById(`adbCallsPageView`),contacts:document.getElementById(`adbContactsPageView`)};Object.values(t).forEach(e=>{e&&(e.style.display=`none`)}),t[e]&&(t[e].style.display=`flex`),document.querySelectorAll(`.adb-sub-tab`).forEach(t=>{t.getAttribute(`data-subview`)===e?t.classList.add(`active`):t.classList.remove(`active`)});let n=(document.getElementById(`dispDevModelTitle`)||{}).textContent||q||`Device`,r=document.getElementById(`settingsDetailNavTitle`);r&&(r.textContent=e===`controls`?n:{sms:`SMS Messages`,calls:`Call History`,contacts:`Contacts`}[e]||n),e===`sms`?window._cachedAdbSms&&window._cachedAdbSms.length!==0||wr():e===`calls`?window._cachedAdbCalls&&window._cachedAdbCalls.length!==0||Dr():e===`contacts`&&(window._cachedAdbContacts&&window._cachedAdbContacts.length!==0||Ar())}async function wr(e){let t=document.getElementById(`adbSmsPageContainer`);document.getElementById(`adbSmsPageCountBadge`);let n=document.getElementById(`adbSmsPageSubtitle`),r=(document.getElementById(`dispDevModelTitle`)||{}).textContent||q||`Handset`;n&&(n.textContent=`${r} • SMS Inbox`),e&&e.classList.add(`rotating`),t&&(!window._cachedAdbSms||window._cachedAdbSms.length===0)&&(t.innerHTML=`
          <div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
            <svg class="spin-icon" viewBox="0 0 24 24" style="width:22px; height:22px; stroke:#38bdf8; margin:0 auto 10px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            Loading SMS messages from handset via ADB...
          </div>
        `);try{let e=await(await u(`/cgi-bin/device?action=sms&serial=${encodeURIComponent(q||``)}`)).json(),t=Array.isArray(e.messages)?e.messages:[];window._cachedAdbSms=t;let n=document.getElementById(`adbSmsPageSearch`);n&&(n.placeholder=t.length>0?`Search ${t.length} messages...`:`Search messages...`),Tr(t)}catch(e){t&&(t.innerHTML=`<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to load SMS messages: ${$(e.message)}</div>`)}finally{e&&setTimeout(()=>e.classList.remove(`rotating`),600)}}function Tr(e){let t=document.getElementById(`adbSmsPageContainer`);t&&(t.innerHTML=!e||e.length===0?`<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No SMS messages found on device.</div>`:e.map(e=>{let t=`--`;if(e.date){let n=new Date(parseInt(e.date,10));isNaN(n.getTime())||(t=n.toLocaleString())}let n=e.type===`1`||e.type===1;return`
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
        `}).join(``))}function Er(e){let t=(e||``).toLowerCase().trim(),n=window._cachedAdbSms||[];Tr(t?n.filter(e=>(e.address||``).toLowerCase().includes(t)||(e.body||``).toLowerCase().includes(t)):n)}async function Dr(e){let t=document.getElementById(`adbCallsPageContainer`);document.getElementById(`adbCallsPageCountBadge`);let n=document.getElementById(`adbCallsPageSubtitle`),r=(document.getElementById(`dispDevModelTitle`)||{}).textContent||q||`Handset`;n&&(n.textContent=`${r} • Call History`),e&&e.classList.add(`rotating`),t&&(!window._cachedAdbCalls||window._cachedAdbCalls.length===0)&&(t.innerHTML=`
          <div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
            <svg class="spin-icon" viewBox="0 0 24 24" style="width:22px; height:22px; stroke:#38bdf8; margin:0 auto 10px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            Loading call logs from handset via ADB...
          </div>
        `);try{let e=await(await u(`/cgi-bin/device?action=call_logs&serial=${encodeURIComponent(q||``)}`)).json(),t=Array.isArray(e.call_logs)?e.call_logs:[];window._cachedAdbCalls=t;let n=document.getElementById(`adbCallsPageSearch`);n&&(n.placeholder=t.length>0?`Search ${t.length} calls by number or name...`:`Search call logs...`),Or(t)}catch(e){t&&(t.innerHTML=`<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to load call history: ${$(e.message)}</div>`)}finally{e&&setTimeout(()=>e.classList.remove(`rotating`),600)}}function Or(e){let t=document.getElementById(`adbCallsPageContainer`);t&&(t.innerHTML=!e||e.length===0?`<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No call logs recorded on device.</div>`:e.map(e=>{let t=`--`;if(e.date){let n=new Date(parseInt(e.date,10));isNaN(n.getTime())||(t=n.toLocaleString())}let n=`<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#38bdf8; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`,r=`rgba(56,189,248,0.12)`;e.type===`1`||e.type===1?(n=`<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#10b981; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>`,r=`rgba(16,185,129,0.12)`):(e.type===`3`||e.type===3)&&(n=`<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#ef4444; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>`,r=`rgba(239,68,68,0.12)`);let i=parseInt(e.duration||`0`,10),a=i>60?`${Math.floor(i/60)}m ${i%60}s`:`${i}s`;return`
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
        `}).join(``))}function kr(e){let t=(e||``).toLowerCase().trim(),n=window._cachedAdbCalls||[];Or(t?n.filter(e=>(e.number||``).toLowerCase().includes(t)||(e.name||``).toLowerCase().includes(t)):n)}async function Ar(e){let t=document.getElementById(`adbContactsPageContainer`);document.getElementById(`adbContactsPageCountBadge`);let n=document.getElementById(`adbContactsPageSubtitle`),r=(document.getElementById(`dispDevModelTitle`)||{}).textContent||q||`Handset`;n&&(n.textContent=`${r} • Contacts`),e&&e.classList.add(`rotating`),t&&(!window._cachedAdbContacts||window._cachedAdbContacts.length===0)&&(t.innerHTML=`
          <div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
            <svg class="spin-icon" viewBox="0 0 24 24" style="width:22px; height:22px; stroke:#38bdf8; margin:0 auto 10px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            Loading contacts from handset via ADB...
          </div>
        `);try{let e=await(await u(`/cgi-bin/device?action=contacts&serial=${encodeURIComponent(q||``)}`)).json(),t=Array.isArray(e.contacts)?e.contacts:[];window._cachedAdbContacts=t;let n=document.getElementById(`adbContactsPageSearch`);n&&(n.placeholder=t.length>0?`Search ${t.length} contacts...`:`Search contacts...`),jr(t)}catch(e){t&&(t.innerHTML=`<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to load contacts: ${$(e.message)}</div>`)}finally{e&&setTimeout(()=>e.classList.remove(`rotating`),600)}}function jr(e){let t=document.getElementById(`adbContactsPageContainer`);t&&(t.innerHTML=!e||e.length===0?`<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No contacts found on device.</div>`:e.map(e=>`
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
      `).join(``))}function Mr(e){let t=(e||``).toLowerCase().trim(),n=window._cachedAdbContacts||[];jr(t?n.filter(e=>(e.name||``).toLowerCase().includes(t)||(e.number||``).toLowerCase().includes(t)):n)}function Nr(){Cr(`sms`)}function Pr(){Cr(`calls`)}function Fr(){Cr(`contacts`)}function Ir(){Cr(`controls`)}function Lr(){Cr(`controls`)}function Rr(){Cr(`controls`)}async function zr(e){let t=document.getElementById(`adbScreenshotModalOverlay`),n=document.getElementById(`adbScreenshotModalBody`),r=document.getElementById(`btnDownloadAdbScreenshot`);if(t&&n){t.style.display=`flex`,r&&(r.style.display=`none`),n.innerHTML=`
        <div style="text-align:center; padding:40px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
          <svg class="spin-icon" viewBox="0 0 24 24" style="width:24px; height:24px; stroke:#38bdf8; margin:0 auto 12px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
          Capturing handset screen via screencap... Please wait.
        </div>
      `;try{let e=await(await u(`/cgi-bin/device?action=screenshot&serial=${encodeURIComponent(q||``)}`)).json();e&&e.status===`ok`&&e.image_base64?(n.innerHTML=`
            <img src="${e.image_base64}" alt="Handset Screen" style="max-width:100%; max-height:68vh; border-radius:10px; border:1px solid rgba(255,255,255,0.12); box-shadow:0 12px 30px rgba(0,0,0,0.5); display:block; margin:0 auto;">
          `,r&&(r.href=e.image_base64,r.download=`screenshot_${q}_${Date.now()}.png`,r.style.display=`inline-flex`)):n.innerHTML=`<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to capture screenshot: ${$(e.message||`Unknown error`)}</div>`}catch(e){n.innerHTML=`<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Screenshot error: ${$(e.message)}</div>`}}}function Br(){let e=document.getElementById(`adbScreenshotModalOverlay`);e&&(e.style.display=`none`)}async function Vr(e){let t=q||`default`,n=!J.torch[t];J.torch[t]=n,vr(),br(n),e&&(e.classList.add(`btn-pulse`),setTimeout(()=>e.classList.remove(`btn-pulse`),350)),Q(n?`Flashlight turned ON`:`Flashlight turned OFF`,n?`warning`:`info`);try{await u(`/cgi-bin/device?action=torch`+(q?`&serial=`+encodeURIComponent(q):``))}catch(e){console.error(`Torch error:`,e)}}async function Hr(e,t){let n=q||`default`;t&&(t.classList.add(`btn-pulse`),setTimeout(()=>t.classList.remove(`btn-pulse`),350));let r=document.getElementById(`dispVolumeStatus`),i=document.getElementById(`dispVolumeSub`),a=document.getElementById(`btnVolSilent`);if(J.volume||(J.volume={}),J.silent||(J.silent={}),e===`silent`){let e=!J.silent[n];J.silent[n]=e,J.volume[n]=e?0:10,vr(),a&&(e?a.classList.add(`active-warning`):a.classList.remove(`active-warning`)),r&&(r.className=e?`setting-pill pill-amber`:`setting-pill`,r.textContent=e?`SILENT ON`:`MEDIA`),i&&(i.innerHTML=`<strong style="color:${e?`#f59e0b`:`var(--text-main)`};">Level: ${e?`MUTED`:`Volume 10`}</strong> &bull; Speaker media audio level`),Q(e?`Phone switched to Silent Mode`:`Silent mode deactivated`,`warning`)}else{let t=J.volume[n]===void 0?10:J.volume[n];t=e===`up`?Math.min(15,t+1):Math.max(0,t-1),J.volume[n]=t,J.silent[n]=t===0,vr(),r&&(r.className=`setting-pill pill-cyan`,r.textContent=e===`up`?`VOL +`:`VOL -`),i&&(i.innerHTML=`<strong style="color:${t===0?`#f59e0b`:`var(--text-main)`};">Level: ${t===0?`MUTED`:`Volume ${t}`}</strong> &bull; Speaker media audio level`),Q(`Volume adjusted (${e.toUpperCase()})`,`info`)}try{await u(`/cgi-bin/device?action=volume&cmd=`+encodeURIComponent(e)+(q?`&serial=`+encodeURIComponent(q):``))}catch(e){console.error(`Volume error:`,e)}}async function Ur(e){let t=q||`default`;J.screen[t]=`on`,J.screenAwake||(J.screenAwake={}),J.screenAwake[t]=!0,vr(),e&&(e.classList.add(`active-cyan`,`btn-pulse`),setTimeout(()=>e.classList.remove(`btn-pulse`),350));let n=document.getElementById(`btnDisplaySleep`);n&&n.classList.remove(`active-cyan`);let r=document.getElementById(`dispPowerStatus`),i=document.getElementById(`dispPowerSub`);r&&(r.className=`setting-pill pill-cyan`,r.textContent=`AWAKE`),i&&(i.innerHTML=`<strong style="color:#38bdf8;">State: AWAKE</strong> &bull; Handset touch display is active`),Q(`Waking phone screen...`,`info`);try{await u(`/cgi-bin/device?action=wake`+(q?`&serial=`+encodeURIComponent(q):``))}catch(e){console.error(e)}}async function Wr(e){let t=q||`default`;J.screen[t]=`off`,J.screenAwake||(J.screenAwake={}),J.screenAwake[t]=!1,vr(),e&&(e.classList.add(`active-cyan`,`btn-pulse`),setTimeout(()=>e.classList.remove(`btn-pulse`),350));let n=document.getElementById(`btnDisplayWake`);n&&n.classList.remove(`active-cyan`);let r=document.getElementById(`dispPowerStatus`),i=document.getElementById(`dispPowerSub`);r&&(r.className=`setting-pill`,r.textContent=`SLEEPING`),i&&(i.innerHTML=`<strong style="color:var(--text-dim);">State: SLEEPING</strong> &bull; Handset touch display is powered down`),Q(`Screen put to sleep`,`info`);try{await u(`/cgi-bin/device?action=sleep`+(q?`&serial=`+encodeURIComponent(q):``))}catch(e){console.error(e)}}async function Gr(e){if(!confirm(`Cycle phone cellular radio? Modem connection will temporarily drop.`))return;if(e){e.classList.add(`active-cyan`,`btn-pulse`);let t=e.querySelector(`svg`);t&&t.classList.add(`spinning`),setTimeout(()=>{e.classList.remove(`active-cyan`,`btn-pulse`),t&&t.classList.remove(`spinning`)},1500)}let t=document.getElementById(`dispRadioStatus`);t&&(t.className=`setting-pill pill-amber`,t.textContent=`CYCLING...`),Q(`Cycling cellular radio (Airplane mode ON -> OFF)...`,`warning`);try{await u(`/cgi-bin/device?action=airplane`+(q?`&serial=`+encodeURIComponent(q):``)),setTimeout(()=>{t&&(t.className=`setting-pill pill-green`,t.textContent=`5G CONNECTED`),Q(`Cellular radio re-attached to network!`,`success`)},2e3)}catch(e){console.error(e)}}async function Kr(e){if(confirm(`Reboot connected smartphone now? Internet tethering will pause until phone boots.`)){e&&(e.classList.add(`btn-pulse`),setTimeout(()=>e.classList.remove(`btn-pulse`),350)),Q(`ADB Reboot signal sent to phone!`,`error`);try{await u(`/cgi-bin/device?action=reboot`+(q?`&serial=`+encodeURIComponent(q):``))}catch(e){console.error(e)}}}var qr=[];async function Jr(){let e=document.getElementById(`deviceActionStatus`);try{let t=await(await fetch(`/cgi-bin/device?action=lock`)).json();e&&(e.innerText=t.message||`Power/Lock button triggered`),setTimeout(hr,1500)}catch(t){e&&(e.innerText=`Error: `+t.message)}}async function Yr(){let e=document.getElementById(`deviceActionStatus`);try{let t=await(await fetch(`/cgi-bin/device?action=settings_tether`)).json();e&&(e.innerText=t.message||`Tether settings launched on phone`)}catch(t){e&&(e.innerText=`Error: `+t.message)}}async function Xr(){let e=document.getElementById(`deviceContactsList`),t=document.getElementById(`devContactsBadge`);if(e)try{let e=await(await fetch(`/cgi-bin/device?action=contacts`)).json();qr=Array.isArray(e.contacts)?e.contacts:[],t&&(t.innerText=`${qr.length} CONTACTS`),Qr(qr)}catch(t){e.innerHTML=`<div style="color:var(--text-dim); padding:10px; font-size:11px;">Failed to load contacts: `+$(t.message)+`</div>`}}function Zr(e){if(!e||!e.trim()){Qr(qr);return}let t=e.trim().toLowerCase();Qr(qr.filter(e=>(e.name||``).toLowerCase().includes(t)||(e.number||``).includes(t)))}function Qr(e){let t=document.getElementById(`deviceContactsList`);t&&(t.innerHTML=!e||e.length===0?`<div style="color:var(--text-dim); padding:12px; font-size:11.5px; text-align:center;">No contacts found.</div>`:e.map(e=>`
          <div class="contact-item-pill">
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="contact-avatar-dot">${(e.name||`C`).charAt(0).toUpperCase()}</div>
              <div>
                <div style="font-weight:700; color:var(--text-main); font-size:12px;">${$(e.name||`Unnamed`)}</div>
                <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-dim);">${$(e.number||`--`)}</div>
              </div>
            </div>
            <button class="mh-btn btn-sm btn-ghost" onclick="navigator.clipboard.writeText('${e.number||``}'); alert('Copied ' + '${e.number||``}')" style="font-size:10px; padding:3px 7px;">COPY</button>
          </div>
        `).join(``))}async function $r(){let e=document.getElementById(`deviceCallsList`);if(e)try{let t=await(await fetch(`/cgi-bin/device?action=calls`)).json(),n=Array.isArray(t.calls)?t.calls:[];if(n.length===0){e.innerHTML=`<div style="color:var(--text-dim); padding:12px; font-size:11.5px; text-align:center;">No recent calls found in call log.</div>`;return}e.innerHTML=n.map(e=>{let t=e.type===`Incoming`?`emerald`:e.type===`Outgoing`?`cyan`:`rose`,n=parseInt(e.duration||0,10),r=n>60?Math.floor(n/60)+`m `+n%60+`s`:n+`s`;return`
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
          `}).join(``)}catch(t){e.innerHTML=`<div style="color:var(--text-dim); padding:10px; font-size:11px;">Failed to load call log: `+$(t.message)+`</div>`}}function ei(e){let t=e.files&&e.files[0],n=document.getElementById(`restoreFileLabel`),r=document.getElementById(`restoreFileSub`),i=document.getElementById(`btnRestoreSubmit`);if(t){let e=(t.size/1024).toFixed(1)+` KB`;n&&(n.innerHTML=`<span style="color:var(--mh-emerald);">[Selected] ${$(t.name)}</span>`),r&&(r.innerText=`Size: ${e} • Ready to restore`),i&&(i.style.display=`inline-flex`);let a=document.getElementById(`restoreConfirmBox`);a&&(a.style.display=`flex`)}else n&&(n.innerText=`Select or Drag & Drop Backup Archive (.tar.gz)`),r&&(r.innerText=`Click to browse your device for archive`),i&&(i.style.display=`none`)}function ti(){let e=document.getElementById(`backupDropzone`),t=document.getElementById(`backupFileInput`);e&&t&&([`dragenter`,`dragover`].forEach(t=>{e.addEventListener(t,t=>{t.preventDefault(),t.stopPropagation(),e.classList.add(`dragover`)},!1)}),[`dragleave`,`drop`].forEach(t=>{e.addEventListener(t,t=>{t.preventDefault(),t.stopPropagation(),e.classList.remove(`dragover`)},!1)}),e.addEventListener(`drop`,e=>{let n=e.dataTransfer.files;n&&n.length>0&&(t.files=n,ei(t))},!1))}window.addEventListener(`load`,ti);function ni(){let e=document.getElementById(`diagOutputBox`),t=document.getElementById(`btnToggleDiagRaw`);e&&t&&(e.style.display===`none`?(e.style.display=`block`,t.innerText=`HIDE RAW CONSOLE`):(e.style.display=`none`,t.innerText=`SHOW RAW CONSOLE`))}var Y=null,ri=null,ii=!1;function ai(e,t){let n=document.getElementById(`settingsSaveStatusPill`),r=document.getElementById(`settingsSaveStatusText`);n&&r&&(n.className=`setting-save-pill`,e===`pending`||e===`saving`?(n.style.display=`inline-flex`,r.textContent=t||`Applying changes...`):e===`saved`?(n.classList.add(`saved`),n.style.display=`inline-flex`,r.textContent=t||`Saved`,setTimeout(()=>{n.classList.contains(`saved`)&&(n.style.display=`none`)},2200)):e===`error`?(n.classList.add(`error`),n.style.display=`inline-flex`,r.textContent=t||`Save failed`,setTimeout(()=>{n.classList.contains(`error`)&&(n.style.display=`none`)},3e3)):n.style.display=`none`)}function oi(e=600){ri&&clearTimeout(ri),ai(`pending`,`Saving changes...`),ri=setTimeout(()=>{si()},e)}async function si(){if(ii){ri=setTimeout(()=>si(),800);return}ii=!0,ai(`saving`,`Applying configuration...`);let e=document.getElementById(`netLanIp`),t=document.getElementById(`netMask`),n=document.getElementById(`netGateway`),r=document.getElementById(`netDns`),i=document.getElementById(`netMtu`),a=document.getElementById(`netDhcpStart`),o=document.getElementById(`netDhcpLimit`),s=document.getElementById(`netDhcpLease`),c=document.getElementById(`netDhcpMasterToggle`),l={action:`set`,hostname:document.getElementById(`netDeviceHostname`)?document.getElementById(`netDeviceHostname`).value.trim():``,custom_mac:document.getElementById(`netCustomMac`)?document.getElementById(`netCustomMac`).value.trim():``,reset_mac:document.getElementById(`netCustomMac`)&&document.getElementById(`netCustomMac`).dataset.reset===`1`?1:0,lan_ip:e?e.value.trim():`10.0.0.1`,netmask:t?t.value.trim():`255.255.255.0`,gateway:n?n.value.trim():``,mtu:i?i.value.trim():`1500`,dns:r?r.value.trim():``,dhcp_start:a?a.value.trim():`100`,dhcp_limit:o?o.value.trim():`150`,dhcp_leasetime:s?s.value.trim():`12h`,dhcp_ignore:c&&c.checked?0:1,ipv6_enabled:document.getElementById(`netIpv6MasterToggle`)&&document.getElementById(`netIpv6MasterToggle`).checked?1:0,ipv6_wan_mode:document.getElementById(`netIpv6WanMode`)?document.getElementById(`netIpv6WanMode`).value:`dhcpv6`,ipv6_ra:document.getElementById(`netIpv6RaToggle`)&&document.getElementById(`netIpv6RaToggle`).checked?1:0,ipv6_dhcp6:document.getElementById(`netIpv6Dhcp6Toggle`)&&document.getElementById(`netIpv6Dhcp6Toggle`).checked?1:0,ipv6_ula:document.getElementById(`netIpv6Ula`)?document.getElementById(`netIpv6Ula`).value:`fd00::/48`,ipv6_privacy:document.getElementById(`netIpv6PrivacyToggle`)&&document.getElementById(`netIpv6PrivacyToggle`).checked?1:0,flow_offloading:document.getElementById(`netSwFlowToggle`)&&document.getElementById(`netSwFlowToggle`).checked?1:0,flow_offloading_hw:document.getElementById(`netHwFlowToggle`)&&document.getElementById(`netHwFlowToggle`).checked?1:0,mss_clamping:document.getElementById(`netMssClampToggle`)&&document.getElementById(`netMssClampToggle`).checked?1:0,dns_rebind:document.getElementById(`netDnsRebindToggle`)&&document.getElementById(`netDnsRebindToggle`).checked?1:0};try{await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(l)})).json(),ai(`saved`,`Configuration Saved`)}catch(e){console.error(`Auto-save network error:`,e),ai(`error`,`Update Failed`)}finally{ii=!1}}function ci(e){Y=e;let t=document.getElementById(`settingEditModalOverlay`),n=document.getElementById(`settingModalTitle`),r=document.getElementById(`settingModalDesc`),i=document.getElementById(`settingModalBody`),a=document.getElementById(`btnModalSave`);if(!t||!i)return;if(a&&(a.textContent=`SAVE`),e===`device_hostname`)n.textContent=`Device Hostname`,r.textContent=`System hostname of this router across local network, DNS queries, and DHCP announcements.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Router Hostname</label>
            <input type="text" id="modalInput_device_hostname" class="mh-input" value="${$((document.getElementById(`netDeviceHostname`)?document.getElementById(`netDeviceHostname`).value:`Maxnet-Gateway`)||`Maxnet-Gateway`)}" placeholder="Maxnet-Gateway" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Quick Suggestions:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_device_hostname').value='Maxnet-Gateway'">Maxnet-Gateway</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_device_hostname').value='OpenWrt'">OpenWrt</button>
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
        `;else if(e===`ts_authkey`)n.textContent=`Tailscale Auth Key`,r.textContent=`Pre-authenticated auth key (tskey-auth-...) from your Tailscale admin console to connect this router.`,a&&(a.textContent=`CONNECT`),i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Auth Key</label>
            <input type="password" id="modalInput_ts_authkey" class="mh-input" placeholder="tskey-auth-..." style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`change_password`)n.textContent=`Root Administrator Password`,r.textContent=`Update master administrator credentials for Web UI access and Dropbear SSH console.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Current Password</label>
            <input type="password" id="modalInput_pwd_old" class="mh-input" placeholder="Existing password" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">New Password</label>
            <input type="password" id="modalInput_pwd_new" class="mh-input" placeholder="Enter new password" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Confirm New Password</label>
            <input type="password" id="modalInput_pwd_confirm" class="mh-input" placeholder="Re-enter new password" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`smb_credentials`)n.textContent=`Samba Share Credentials`,r.textContent=`Configure authenticated Samba / CIFS login user and password for /mnt/pendrive.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Share Username</label>
            <input type="text" id="modalInput_smb_user" class="mh-input" value="${$((document.getElementById(`smbUsernameInput`)?document.getElementById(`smbUsernameInput`).value:`max`)||`max`)}" placeholder="e.g. max" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">New Share Password</label>
            <input type="password" id="modalInput_smb_pass" class="mh-input" placeholder="Enter share password" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;else if(e===`pkg_install`)n.textContent=`Install Gateway Package`,r.textContent=`Enter package name (e.g. htop, tcpdump, curl, iperf3, wireguard-tools) to install from OpenWrt APK feed.`,a&&(a.textContent=`INSTALL`),i.innerHTML=`
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
        `;else if(e===`restart_usb_modem`)n.textContent=`Restart USB Modem / Hardware`,r.textContent=`Choose which connected USB modem interface to reset & renew DHCP lease, or reboot physical phone via ADB.`,a&&(a.textContent=`EXECUTE RESTART`),i.innerHTML=`
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
        `;else if(e===`dufs_url`){n.textContent=`WebDAV Network Share`,r.textContent=`Connect any device on your local network to browse, stream, and manage USB storage files.`;let e=window.location.hostname||`10.0.0.1`,t=document.getElementById(`dufsPortInput`)?.value||5e3,o=`${window.location.protocol||`http:`}//${e}:${t}/`;a&&(a.textContent=`DONE`),i.innerHTML=`
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
        `}else if(e===`dufs_auth`)n.textContent=`WebDAV Access Authentication`,r.textContent=`Enforce secure credentials to access WebDAV storage and file manager on port 5000.`,i.innerHTML=`
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">WebDAV Username</label>
            <input type="text" id="modalInput_dufs_user" class="mh-input" value="${$((document.getElementById(`dufsUserInput`)?document.getElementById(`dufsUserInput`).value:`root`)||`root`)}" placeholder="root" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:10px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">WebDAV Password</label>
            <input type="password" id="modalInput_dufs_pass" class="mh-input" placeholder="Enter secure password (default: admin)" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:12px; display:flex; gap:8px;">
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_user').value='root'; document.getElementById('modalInput_dufs_pass').value='admin';">Use Default Credentials (root / admin)</button>
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
        `}else if(e===`pppoe_server_users`){n.textContent=`Subscriber Accounts (CHAP Secrets)`,r.textContent=`Manage PPPoE client logins allowed to authenticate through this access concentrator.`;let e=(window._cachedPppoeData&&window._cachedPppoeData.server||{}).users||[],t=``;t=e.length===0?`<div style="font-size:12px; color:var(--text-dim); padding:10px; text-align:center;">No accounts registered yet.</div>`:e.map(e=>`
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:6px; margin-bottom:6px;">
              <div>
                <strong style="font-size:12px; color:var(--text-main); font-family:var(--font-mono);">${$(e.user)}</strong>
                <span style="font-size:10.5px; color:var(--text-dim); margin-left:8px;">IP: ${$(e.ip||`*`)}</span>
              </div>
              <button type="button" class="mh-btn btn-sm btn-ghost" style="color:#ef4444; padding:2px 8px; font-size:10px;" onclick="deletePppoeUser('${$(e.user)}')">DELETE</button>
            </div>
          `).join(``),i.innerHTML=`
          <div style="max-height:160px; overflow-y:auto; margin-bottom:12px;">
            ${t}
          </div>
          <div style="padding-top:10px; border-top:1px solid var(--border-sub);">
            <div style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:8px; text-transform:uppercase;">Add New Subscriber Account</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <input type="text" id="modalInput_new_pppoe_u" class="mh-input" placeholder="Subscriber Username" style="padding:8px 10px; font-size:12px; font-family:var(--font-mono);">
              <input type="password" id="modalInput_new_pppoe_p" class="mh-input" placeholder="Password" style="padding:8px 10px; font-size:12px; font-family:var(--font-mono);">
            </div>
            <button type="button" class="mh-btn" style="margin-top:8px; width:100%; background:#06b6d4; color:#0b1120; font-weight:700; padding:7px; font-size:11.5px; border-radius:6px;" onclick="addPppoeUserFromModal()">+ ADD SUBSCRIBER</button>
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
        `}else if(e===`usb_device_edit`){let e=window._editingUsbDevId,t=T&&T.devices?T.devices.find(t=>t.id===e):null;n.textContent=t?`Edit ${t.name} (${t.interface})`:`Edit USB Interface`,r.textContent=`Configure traffic weight, routing metric, and MTU packet sizing for this USB modem.`,i.innerHTML=`
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
        `}t.style.display=`flex`,requestAnimationFrame(()=>{requestAnimationFrame(()=>{t.classList.add(`active`)})}),window._isSettingModalOpen=!0,w(e);try{history.pushState({modalOpen:!0,modalKey:e},``,window.location.hash),di=!0}catch{}let o=i.querySelector(`input, select, textarea`);o&&setTimeout(()=>{o.focus(),o.select&&o.select();try{o.scrollIntoView({behavior:`smooth`,block:`nearest`})}catch{}},100)}function li(e){let t=document.getElementById(`modalSelect_cidr`);t&&(t.value=e===`255.255.255.0`?`24`:e===`255.255.0.0`?`16`:e===`255.0.0.0`?`8`:`custom`)}function ui(e){let t=document.getElementById(`modalInput_net_mask`);t&&(e===`24`?t.value=`255.255.255.0`:e===`16`?t.value=`255.255.0.0`:e===`8`&&(t.value=`255.0.0.0`))}var di=!1;function fi(e=!0){let t=document.getElementById(`settingEditModalOverlay`);if(t&&(t.classList.remove(`active`),setTimeout(()=>{t.classList.contains(`active`)||(t.style.display=`none`)},220)),window._isSettingModalOpen=!1,Y=null,e&&di){di=!1;try{history.back()}catch{}}else di=!1}function pi(e){e.target&&e.target.id===`settingEditModalOverlay`&&fi()}function mi(e){if(typeof e!=`string`)return!1;let t=e.trim().split(`.`);return t.length===4&&t.every(e=>{if(!/^\d+$/.test(e))return!1;let t=parseInt(e,10);return t>=0&&t<=255&&(e===`0`||!e.startsWith(`0`))})}function hi(e){return mi(e)?`255.255.255.255,255.255.255.254,255.255.255.252,255.255.255.248,255.255.255.240,255.255.255.224,255.255.255.192,255.255.255.128,255.255.255.0,255.255.254.0,255.255.252.0,255.255.248.0,255.255.240.0,255.255.224.0,255.255.192.0,255.255.128.0,255.255.0.0,255.254.0.0,255.252.0.0,255.248.0.0,255.240.0.0,255.224.0.0,255.192.0.0,255.128.0.0,255.0.0.0,254.0.0.0,252.0.0.0,248.0.0.0,240.0.0.0,224.0.0.0,192.0.0.0,128.0.0.0,0.0.0.0`.split(`,`).includes(e.trim()):!1}function gi(e){return/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test((e||``).trim())}function _i(){let e=`0123456789abcdef`,t=e[Math.floor(Math.random()*16)]+[`2`,`6`,`a`,`e`][Math.floor(Math.random()*4)];for(let n=1;n<6;n++)t+=`:`+e[Math.floor(Math.random()*16)]+e[Math.floor(Math.random()*16)];let n=document.getElementById(`modalInput_custom_mac`);n&&(n.value=t)}async function vi(){if(!Y)fi();else{if(Y===`device_hostname`){let e=(document.getElementById(`modalInput_device_hostname`).value||``).trim();if(!e){Q(`Device hostname cannot be empty`,`error`);let e=document.getElementById(`modalInput_device_hostname`);e&&e.focus();return}if(!/^[a-zA-Z0-9][-a-zA-Z0-9_]{0,62}$/.test(e)){Q(`Hostname must start with alphanumeric character and contain only letters, numbers, hyphens, and underscores (max 63 chars)`,`error`);let e=document.getElementById(`modalInput_device_hostname`);e&&e.focus();return}let t=document.getElementById(`netDeviceHostname`);t&&(t.value=e);let n=document.getElementById(`disp_device_hostname`),r=e.toLowerCase();n&&(n.textContent=`${e} • ${r}.lan / ${r}.local`),oi()}else if(Y===`custom_mac`){let e=(document.getElementById(`modalInput_custom_mac`).value||``).trim(),t=(document.getElementById(`netHwMac`)?document.getElementById(`netHwMac`).value:`ca:e7:b7:34:8f:ac`).toLowerCase(),n=document.getElementById(`netCustomMac`);if(e&&e.toLowerCase()!==t){if(!gi(e)){Q(`Invalid MAC address format (e.g. 00:11:22:33:44:55)`,`error`);let e=document.getElementById(`modalInput_custom_mac`);e&&e.focus();return}n&&(n.value=e.toLowerCase(),n.dataset.reset=`0`);let r=document.getElementById(`disp_custom_mac`);r&&(r.textContent=`Custom: ${e.toLowerCase()} • Hardware: ${t}`)}else{n&&(n.value=``,n.dataset.reset=`1`);let e=document.getElementById(`disp_custom_mac`);e&&(e.textContent=`Default: ${t} • Hardware MAC in use`)}oi()}else if(Y===`client_history_days`){let e=document.getElementById(`modalSelect_client_history`).value,t=document.getElementById(`disp_client_history_days`);t&&(t.textContent=`${e} Days Retention • Click to change duration`),Q(`Client history retention set to ${e} days`,`success`),oi()}else if(Y===`lan_ip`){let e=(document.getElementById(`modalInput_lan_ip`).value||``).trim();if(!mi(e)){Q(`Invalid IPv4 address format (e.g. 10.0.0.1)`,`error`);let e=document.getElementById(`modalInput_lan_ip`);e&&e.focus();return}if(e===`0.0.0.0`||e===`255.255.255.255`){Q(`Gateway IP cannot be 0.0.0.0 or broadcast`,`error`);return}document.getElementById(`netLanIp`).value=e;let t=document.getElementById(`disp_lan_ip`);t&&(t.textContent=e),oi()}else if(Y===`net_mask`){let e=(document.getElementById(`modalInput_net_mask`).value||``).trim();if(!hi(e)){Q(`Invalid subnet mask (e.g. 255.255.255.0)`,`error`);let e=document.getElementById(`modalInput_net_mask`);e&&e.focus();return}let t=document.getElementById(`modalSelect_cidr`).value;document.getElementById(`netMask`).value=e,document.getElementById(`netCidrSelect`).value=t;let n=document.getElementById(`disp_net_mask`);n&&(n.textContent=`${e} (/${t})`),oi()}else if(Y===`net_gateway`){let e=(document.getElementById(`modalInput_gateway`).value||``).trim();if(e&&!mi(e)){Q(`Invalid gateway IPv4 address (leave empty for direct br-lan)`,`error`);let e=document.getElementById(`modalInput_gateway`);e&&e.focus();return}document.getElementById(`netGateway`).value=e;let t=document.getElementById(`disp_net_gateway`);t&&(t.textContent=e||`None (Direct br-lan)`),oi()}else if(Y===`net_mtu`){let e=parseInt(document.getElementById(`modalInput_mtu`).value,10);if(isNaN(e)||e<576||e>9e3){Q(`MTU must be between 576 and 9000 bytes`,`error`);let e=document.getElementById(`modalInput_mtu`);e&&e.focus();return}document.getElementById(`netMtu`).value=e;let t=document.getElementById(`disp_net_mtu`);t&&(t.textContent=`${e} bytes`),oi()}else if(Y===`dhcp_pool`){let e=parseInt(document.getElementById(`modalInput_dhcp_start`).value,10),t=parseInt(document.getElementById(`modalInput_dhcp_limit`).value,10);if(isNaN(e)||e<2||e>254){Q(`DHCP Pool start must be between 2 and 254`,`error`);let e=document.getElementById(`modalInput_dhcp_start`);e&&e.focus();return}if(isNaN(t)||t<1||e+t>255){Q(`Invalid pool limit (start + limit must be <= 254)`,`error`);let e=document.getElementById(`modalInput_dhcp_limit`);e&&e.focus();return}let n=document.getElementById(`modalSelect_dhcp_lease`).value||`12h`;document.getElementById(`netDhcpStart`).value=e,document.getElementById(`netDhcpLimit`).value=t,document.getElementById(`netDhcpLease`).value=n;let r=document.getElementById(`disp_dhcp_pool`);r&&(r.textContent=`Start ${e} • Limit ${t} • Lease ${n}`),oi()}else if(Y===`custom_dns`){let e=(document.getElementById(`modalInput_dns`).value||``).trim();if(e){let t=e.split(/\s+/);for(let e of t)if(!mi(e)&&!e.includes(`:`)){Q(`Invalid DNS server IP: ${e}`,`error`);let t=document.getElementById(`modalInput_dns`);t&&t.focus();return}}document.getElementById(`netDns`).value=e||`1.1.1.1 8.8.8.8`;let t=document.getElementById(`disp_custom_dns`);t&&(t.textContent=e||`1.1.1.1 8.8.8.8`),oi()}else if(Y===`add_static_lease`){let e=(document.getElementById(`modalInput_lease_name`).value||`Client`).trim(),t=(document.getElementById(`modalInput_lease_mac`).value||``).trim(),n=(document.getElementById(`modalInput_lease_ip`).value||``).trim();if(!gi(t)){Q(`Invalid MAC address (format XX:XX:XX:XX:XX:XX)`,`error`);let e=document.getElementById(`modalInput_lease_mac`);e&&e.focus();return}if(!mi(n)){Q(`Invalid IPv4 address format (e.g. 10.0.0.50)`,`error`);let e=document.getElementById(`modalInput_lease_ip`);e&&e.focus();return}try{ai(`saving`,`Adding reservation...`),await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`add_lease`,name:e,mac:t,ip:n})})).json(),ai(`saved`,`Reservation Added`),await _a()}catch(e){ai(`error`,`Add failed`),console.error(e)}}else if(Y===`ts_hostname`){let e=(document.getElementById(`modalInput_ts_hostname`).value||`Maxnet-Gateway`).trim();document.getElementById(`tsHostname`)&&(document.getElementById(`tsHostname`).value=e);let t=document.getElementById(`disp_ts_hostname`);t&&(t.textContent=e),typeof ns==`function`&&ns()}else if(Y===`ts_authkey`){let e=(document.getElementById(`modalInput_ts_authkey`).value||``).trim();document.getElementById(`tsAuthKeyInput`)&&(document.getElementById(`tsAuthKeyInput`).value=e);let t=document.getElementById(`disp_ts_authkey`);t&&(t.textContent=e?`Key Configured (Connecting...)`:`tskey-auth-... (Click to update key)`);let n=document.getElementById(`disp_ts_authkey_unlogged`);n&&(n.textContent=e?`Key Configured (Connecting...)`:`Connect using pre-authenticated key (tskey-auth-...)`),typeof es==`function`&&es()}else if(Y===`change_password`){let e=document.getElementById(`modalInput_pwd_old`).value,t=document.getElementById(`modalInput_pwd_new`).value,n=document.getElementById(`modalInput_pwd_confirm`).value;if(!t){alert(`New password cannot be empty`);return}if(t!==n){alert(`New password and confirm password do not match`);return}document.getElementById(`oldPasswordInput`)&&(document.getElementById(`oldPasswordInput`).value=e),document.getElementById(`newPasswordInput`)&&(document.getElementById(`newPasswordInput`).value=t),document.getElementById(`confirmPasswordInput`)&&(document.getElementById(`confirmPasswordInput`).value=n),typeof ls==`function`&&ls()}else if(Y===`smb_credentials`){let e=(document.getElementById(`modalInput_smb_user`).value||`max`).trim(),t=document.getElementById(`modalInput_smb_pass`).value;document.getElementById(`smbUsernameInput`)&&(document.getElementById(`smbUsernameInput`).value=e),document.getElementById(`smbPasswordInput`)&&(document.getElementById(`smbPasswordInput`).value=t);let n=document.getElementById(`disp_smb_creds`);n&&(n.textContent=`User: ${e} • Password configured`),typeof as==`function`&&as()}else if(Y===`pkg_install`){let e=(document.getElementById(`modalInput_pkg_name`).value||``).trim();e&&typeof Ao==`function`&&Ao(e)}else if(Y===`diag_ping_size`){let e=parseInt(document.getElementById(`modalInput_ping_size`).value,10)||56;document.getElementById(`diagPingSize`)&&(document.getElementById(`diagPingSize`).value=e);let t=document.getElementById(`disp_diag_ping_size`);t&&(t.textContent=`${e} bytes (ICMP payload buffer)`)}else if(Y===`diag_dns_server`){let e=(document.getElementById(`modalInput_dns_server`).value||`10.0.0.1`).trim();document.getElementById(`diagDnsServerInput`)&&(document.getElementById(`diagDnsServerInput`).value=e);let t=document.getElementById(`disp_diag_dns_server`);t&&(t.textContent=`${e} (Resolver)`)}else if(Y===`diag_ports_list`){let e=(document.getElementById(`modalTextarea_ports_list`).value||``).trim();document.getElementById(`diagPortsListInput`)&&(document.getElementById(`diagPortsListInput`).value=e);let t=e.split(`,`).filter(e=>e.trim().length>0).length,n=document.getElementById(`disp_diag_ports_count`);n&&(n.textContent=`${t} Custom Ports Configured (Click to edit)`)}else if(Y===`ipv6_wan_mode`){let e=document.getElementById(`modalSelect_ipv6_wan_mode`).value;document.getElementById(`netIpv6WanMode`)&&(document.getElementById(`netIpv6WanMode`).value=e);let t=document.getElementById(`disp_ipv6_wan_mode`);t&&(t.textContent={dhcpv6:`DHCPv6-PD & SLAAC (Automatic)`,slaac:`SLAAC Only (Stateless Autoconfiguration)`,static:`Static IPv6 Address`,disabled:`Disabled (No WAN IPv6)`}[e]||e),oi()}else if(Y===`ipv6_ula`){let e=(document.getElementById(`modalInput_ipv6_ula`).value||``).trim();if(e&&!e.includes(`:`)){Q(`Invalid IPv6 ULA prefix (e.g. fd00::/48)`,`error`);return}document.getElementById(`netIpv6Ula`)&&(document.getElementById(`netIpv6Ula`).value=e||`fd00::/48`);let t=document.getElementById(`disp_ipv6_ula`);t&&(t.textContent=`${e||`fd00::/48`} • Unique local address scope`),oi()}else if(Y===`wan_proto`){let e=document.getElementById(`modalSelect_wan_proto`),t=e?e.value:`dhcp`;document.getElementById(`wanProtoSelect`)&&(document.getElementById(`wanProtoSelect`).value=t),ba(),Sa(),t===`pppoe`&&setTimeout(()=>{typeof x==`function`&&x(`acc-pppoe`)},350)}else if(Y===`webhook_tg_token`){let e=(document.getElementById(`modalInput_tg_token`)?.value||``).trim();window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.telegram=window._cachedWebhooksConfig.telegram||{},window._cachedWebhooksConfig.telegram.bot_token=e;let t=document.getElementById(`disp_webhook_tg_token`);t&&(t.textContent=e?`${e.substring(0,10)}••••••••`:`Click to configure Bot Token from @BotFather`),ao()}else if(Y===`webhook_tg_chat_id`){let e=(document.getElementById(`modalInput_tg_chat_id`)?.value||``).trim();window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.telegram=window._cachedWebhooksConfig.telegram||{},window._cachedWebhooksConfig.telegram.chat_id=e;let t=document.getElementById(`disp_webhook_tg_chat_id`);t&&(t.textContent=e?`Chat ID: ${e}`:`Click to configure Chat or Channel ID`),ao()}else if(Y===`webhook_discord_url`){let e=(document.getElementById(`modalInput_discord_url`)?.value||``).trim();window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.discord=window._cachedWebhooksConfig.discord||{},window._cachedWebhooksConfig.discord.webhook_url=e;let t=document.getElementById(`disp_webhook_discord_url`);t&&(t.textContent=e?`${e.substring(0,35)}...`:`Click to configure Discord Webhook URL`),ao()}else if(Y===`webhook_ntfy_url`){let e=(document.getElementById(`modalInput_ntfy_url`)?.value||``).trim();window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.ntfy=window._cachedWebhooksConfig.ntfy||{},window._cachedWebhooksConfig.ntfy.topic_url=e;let t=document.getElementById(`disp_webhook_ntfy_url`);t&&(t.textContent=e||`https://ntfy.sh/maxnet-alerts`),ao()}else if(Y===`webhook_data_quota`){let e=parseInt((document.getElementById(`modalInput_data_quota`)?.value||`1024`).trim())||1024;window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.data_quota_mb=e;let t=document.getElementById(`disp_webhook_data_quota`);t&&(t.textContent=`${e} MB (${(e/1024).toFixed(1)} GB)`),ao()}else if(Y===`webhook_custom_ip`){let e=(document.getElementById(`modalInput_custom_ip_target`)?.value||`10.0.0.2`).trim();window._cachedWebhooksConfig=window._cachedWebhooksConfig||{},window._cachedWebhooksConfig.custom_ip_target=e;let t=document.getElementById(`disp_webhook_custom_ip`);t&&(t.textContent=e),ao()}else if(Y===`restart_usb_modem`){let e=document.getElementById(`modalSelect_restart_target`)?.value||`all`,t=document.querySelector(`input[name="usb_restart_mode"]:checked`)?.value||`soft`,n=document.getElementById(`usbRestartModalStatus`),r=document.getElementById(`btnModalSave`);r&&(r.disabled=!0,r.textContent=`RESTARTING...`),n&&(n.textContent=t===`adb`?`Transmitting ADB reboot signal to smartphone...`:`Resetting interface (${e}) & renewing DHCP...`);try{if(t===`adb`)await fetch(`/cgi-bin/usb_wan?action=restart_modems&reboot_adb=true&serial=`+encodeURIComponent(e===`all`?``:e),{method:`POST`}),n&&(n.textContent=`Phone reboot signal sent! Phone is power cycling.`),typeof Q==`function`&&Q(`ADB phone reboot initiated!`,`success`);else{let t=await(await fetch(`/cgi-bin/usb_wan?action=restart_modems&iface=${encodeURIComponent(e)}`,{method:`POST`})).json();n&&(n.textContent=t.message||`Interface restarted successfully!`),typeof Q==`function`&&Q(t.message||`USB Modem restarted`,`success`)}setTimeout(()=>{fi(),E()},1400)}catch(e){n&&(n.textContent=`Error: `+e.message),typeof Q==`function`&&Q(`Restart error: `+e.message,`error`),r&&(r.disabled=!1,r.textContent=`EXECUTE RESTART`)}return}else if(Y===`wan_static_ip`){let e=(document.getElementById(`modalInput_wan_static_ip`)?.value||``).trim();document.getElementById(`wanStaticIp`)&&(document.getElementById(`wanStaticIp`).value=e),ba(),Sa()}else if(Y===`wan_static_netmask`){let e=(document.getElementById(`modalInput_wan_static_netmask`)?.value||``).trim();document.getElementById(`wanStaticNetmask`)&&(document.getElementById(`wanStaticNetmask`).value=e),ba(),Sa()}else if(Y===`wan_static_gateway`){let e=(document.getElementById(`modalInput_wan_static_gateway`)?.value||``).trim();document.getElementById(`wanStaticGateway`)&&(document.getElementById(`wanStaticGateway`).value=e),ba(),Sa()}else if(Y===`wan_custom_mac`){let e=(document.getElementById(`modalInput_wan_custom_mac`)?.value||``).trim();if(e&&!gi(e)){Q(`Invalid MAC address format (e.g. 00:11:22:33:44:55)`,`error`);return}document.getElementById(`wanCustomMacInput`)&&(document.getElementById(`wanCustomMacInput`).value=e),ba(),Sa()}else if(Y!==`dufs_url`){if(Y===`dufs_port`){let e=parseInt(document.getElementById(`modalInput_dufs_port`)?.value,10);if(!e||e<1||e>65535){Q(`Invalid port number (1-65535)`,`error`);return}document.getElementById(`dufsPortInput`)&&(document.getElementById(`dufsPortInput`).value=e),za()}else if(Y===`dufs_path`){let e=(document.getElementById(`modalInput_dufs_path`)?.value||`/mnt/storage`).trim();document.getElementById(`dufsPathInput`)&&(document.getElementById(`dufsPathInput`).value=e),za()}else if(Y===`dufs_permissions`){let e=document.getElementById(`modalSelect_dufs_mode`)?.value||`full`,t=`true`,n=`true`;e===`upload_only`?(t=`true`,n=`false`):e===`readonly`&&(t=`false`,n=`false`),document.getElementById(`dufsAllowUpload`)&&(document.getElementById(`dufsAllowUpload`).value=t),document.getElementById(`dufsAllowDelete`)&&(document.getElementById(`dufsAllowDelete`).value=n),za()}else if(Y===`dufs_auth`){let e=(document.getElementById(`modalInput_dufs_user`)?.value||`root`).trim(),t=(document.getElementById(`modalInput_dufs_pass`)?.value||`admin`).trim();document.getElementById(`dufsUserInput`)&&(document.getElementById(`dufsUserInput`).value=e),document.getElementById(`dufsPassInput`)&&(document.getElementById(`dufsPassInput`).value=t),za()}else if(Y===`pppoe_client_creds`)ka((document.getElementById(`modalInput_pppoe_user`)?.value||``).trim(),document.getElementById(`modalInput_pppoe_pass`)?.value||``);else if(Y===`pppoe_client_ac`)Aa((document.getElementById(`modalInput_pppoe_ac`)?.value||``).trim(),(document.getElementById(`modalInput_pppoe_service`)?.value||``).trim());else if(Y===`pppoe_client_mac`)ja((document.getElementById(`modalInput_pppoe_mac`)?.value||``).trim(),parseInt(document.getElementById(`modalInput_pppoe_mtu`)?.value,10)||1492);else if(Y===`pppoe_server_config`)Pa((document.getElementById(`modalInput_pppoe_srv_ip`)?.value||`10.0.0.1`).trim(),(document.getElementById(`modalInput_pppoe_srv_start`)?.value||`10.0.0.150`).trim(),(document.getElementById(`modalInput_pppoe_srv_end`)?.value||`10.0.0.220`).trim(),(document.getElementById(`modalInput_pppoe_srv_dns1`)?.value||`10.0.0.1`).trim(),(document.getElementById(`modalInput_pppoe_srv_dns2`)?.value||`1.1.1.1`).trim(),parseInt(document.getElementById(`modalInput_pppoe_srv_max`)?.value,10)||32);else if(Y!==`pppoe_server_users`){if(Y===`usb_lb_mode`){let e=document.querySelector(`input[name="modal_usb_mode"]:checked`);e&&window._cachedUsbWanData&&(window._cachedUsbWanData.load_balancing.mode=e.value,O())}else if(Y===`usb_ping_target`){let e=document.getElementById(`modalInput_usb_ping_target`);e&&window._cachedUsbWanData&&(window._cachedUsbWanData.load_balancing.ping_target=e.value.trim(),O())}else if(Y===`usb_ping_interval`){let e=document.getElementById(`modalInput_usb_ping_interval`);e&&window._cachedUsbWanData&&(window._cachedUsbWanData.load_balancing.ping_interval=parseInt(e.value,10)||15,O())}else if(Y===`usb_dns_override`){let e=document.getElementById(`modalInput_usb_dns`);e&&window._cachedUsbWanData&&(window._cachedUsbWanData.load_balancing.dns_override=e.value.trim(),O())}else if(Y===`usb_tether_proto`){let e=document.querySelector(`input[name="modal_usb_proto"]:checked`);e&&window._cachedUsbWanData&&(window._cachedUsbWanData.load_balancing.tether_proto=e.value,O())}else if(Y===`usb_device_edit`){let e=window._editingUsbDevId,t=window._cachedUsbWanData&&window._cachedUsbWanData.devices?window._cachedUsbWanData.devices.find(t=>t.id===e):null;if(t){let e=parseInt(document.getElementById(`modalInput_usb_dev_weight`)?.value,10)||50,n=parseInt(document.getElementById(`modalInput_usb_dev_metric`)?.value,10)||100,r=parseInt(document.getElementById(`modalInput_usb_dev_mtu`)?.value,10)||1400;t.weight=e,t.metric=n,t.mtu=r,O()}}}}fi()}}var yi={ssh_enable:!0,session_timeout:!0,syn_flood:!0,wan_ping_drop:!1,brute_force:!0,force_https:!1};async function bi(){try{let e=await(await u(`/cgi-bin/device?action=security_get`)).json();e&&e.status===`ok`&&(yi=Object.assign(yi,e))}catch(e){console.warn(`fetchSecuritySettings error, using defaults:`,e)}let e=document.getElementById(`secSshToggle`),t=document.getElementById(`secSessionTimeoutToggle`),n=document.getElementById(`secSynFloodToggle`),r=document.getElementById(`secWanPingToggle`),i=document.getElementById(`secBruteForceToggle`),a=document.getElementById(`secHttpsToggle`);e&&(e.checked=!!yi.ssh_enable),t&&(t.checked=!!yi.session_timeout),n&&(n.checked=!!yi.syn_flood),r&&(r.checked=!!yi.wan_ping_drop),i&&(i.checked=!!yi.brute_force),a&&(a.checked=!!yi.force_https),qa()}async function xi(e,t){yi[e]=t;try{let t=await(await fetch(`/cgi-bin/device?action=security_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(yi)})).json();t&&t.status===`ok`?Q(`Security policy updated: ${e.replace(`_`,` `).toUpperCase()}`,`success`):Q(`Error saving security policy`,`warning`)}catch(t){console.error(`saveSecurityPolicy error`,t),Q(`Policy updated locally: ${e}`,`info`)}}var Si=[];async function Ci(){document.getElementById(`adbDevicesCardsContainer`);let e=document.getElementById(`adbDevCountBadge`),t=document.getElementById(`adbHubCountBadge`);try{let n=[];if(window._lastDataCache&&Array.isArray(window._lastDataCache.usb_devices)&&window._lastDataCache.usb_devices.length>0)n=window._lastDataCache.usb_devices;else{let e=await(await u(`/cgi-bin/device?action=devices`)).json();n=Array.isArray(e.devices)?e.devices:[]}Si=n.filter(e=>e.device_type!==`storage`&&e.device_type!==`pendrive`&&e.device_type!==`ssd`),Si.length===0&&n.length>0&&(Si=n),e&&(e.textContent=`${Si.length} CONNECTED`),t&&(t.textContent=`${Si.length} ONLINE`),wi(Si)}catch(e){console.error(`fetchAdbDeviceList error`,e)}}function wi(e){let t=document.getElementById(`adbDevicesCardsContainer`);t&&(t.innerHTML=!e||e.length===0?`
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
        `}).join(``))}function Ti(e,t=!0){window._currentAdbDeviceDetail=e,q=e;let n=document.getElementById(`adbListView`);n&&(n.style.display=`none`),Cr(`controls`);let r=Si.find(t=>t.serial===e||t.bus===e)||{serial:e,model:`Android Handset`},i=r.model||r.brand||`Android Handset`,a=r.serial||r.bus||e||`--`,o=document.getElementById(`settingsDetailNavTitle`);o&&(o.textContent=i);let s=document.getElementById(`dispDevModelTitle`);s&&(s.textContent=i);let c=document.getElementById(`dispDevModelSub`);c&&(c.textContent=`Serial: ${a}${r.ip?` • IP: ${r.ip}`:``}`);let l=document.getElementById(`dispDevSerialSub`);l&&(l.textContent=`Serial: ${a} • USB High-Speed 480 Mbps`);let u=document.getElementById(`dispDevUptimeSub`);if(u&&(u.innerHTML=`Uptime: -- &bull; Reading system uptime...`),Oi(),xr(),t)try{history.pushState({tab:`settings`,page:`adb-device-detail`,serial:e},``,`#setting=acc-adb-device&dev=`+encodeURIComponent(e))}catch{}}function Ei(e=!0){if(window._currentAdbSubView&&window._currentAdbSubView!==`controls`){Cr(`controls`);return}if(!window._currentAdbDeviceDetail)return;window._currentAdbDeviceDetail=null;let t=document.getElementById(`adbListView`);[`adbDetailView`,`adbSmsPageView`,`adbCallsPageView`,`adbContactsPageView`].forEach(e=>{let t=document.getElementById(e);t&&(t.style.display=`none`)}),t&&(t.style.display=`block`);let n=document.getElementById(`settingsDetailNavTitle`);if(n&&(n.textContent=`ADB Devices`),e&&window.location.hash.includes(`&dev=`))try{history.back()}catch{}}function Di(e){Ti(e)}function Oi(){let e=document.getElementById(`adbDetailView`);if(!e||e.style.display===`none`)return;let t=Si.find(e=>e.serial===q||e.bus===q)||Si[0],n=yr(t?t.serial||t.bus||q:q||`default_adb`),r=!!n.torch;br(r);let i=document.getElementById(`dispTorchSub`);i&&(i.innerHTML=`<strong style="color:${r?`#f59e0b`:`var(--text-dim)`};">State: ${r?`ON`:`OFF`}</strong> &bull; High-intensity rear camera LED torch`);let a=n.screenAwake!==!1,o=document.getElementById(`btnDisplayWake`),s=document.getElementById(`btnDisplaySleep`);o&&(a?o.classList.add(`active-cyan`):o.classList.remove(`active-cyan`)),s&&(a?s.classList.remove(`active-cyan`):s.classList.add(`active-cyan`));let c=document.getElementById(`dispPowerSub`);c&&(c.innerHTML=`<strong style="color:${a?`#38bdf8`:`var(--text-dim)`};">State: ${a?`AWAKE`:`SLEEPING`}</strong> &bull; Handset touch display is ${a?`active`:`powered down`}`);let l=document.getElementById(`dispVolumeSub`);if(l){let e=n.volume===0;l.innerHTML=`<strong style="color:${e?`#f59e0b`:`var(--text-main)`};">Level: ${e?`MUTED`:`Volume ${n.volume}`}</strong> &bull; Speaker media audio level`}let u=document.getElementById(`dispRadioSub`);u&&(u.innerHTML=`<strong style="color:#10b981;">State: 5G SA Connected</strong> &bull; Cycle airplane mode to re-attach`);let d=document.getElementById(`dispWirelessAdbSub`);if(d){let e=!!n.wirelessAdb;d.innerHTML=`<strong style="color:${e?`#10b981`:`var(--text-dim)`};">State: ${e?`Enabled (Port 5555)`:`Disabled`}</strong> &bull; TCP/IP network debugging`}}async function ki(e){e&&(e.classList.add(`active-green`,`btn-pulse`),setTimeout(()=>e.classList.remove(`btn-pulse`),350));let t=document.getElementById(`dispWirelessAdbStatus`);t&&(t.className=`setting-pill pill-green`,t.textContent=`PORT 5555 READY`),Q(`Enabling wireless ADB on port 5555...`,`info`);try{await u(`/cgi-bin/device?action=wireless_adb&port=5555`),Q(`Wireless ADB enabled on port 5555!`,`success`)}catch(e){console.error(e)}}function Ai(e){if(!e||typeof e!=`string`)return{device:`Unknown Device`,browser:`Web Browser`};let t=`Generic Device`,n=`Web Browser`,r=/Android/i.test(e),i=/iPhone/i.test(e),a=/iPad/i.test(e),o=/Macintosh|Mac OS X/i.test(e),s=/Windows NT/i.test(e),c=/Linux/i.test(e)&&!r;if(r){let n=e.match(/Android\s+([0-9\.]+)/i),r=n?`Android ${n[1]}`:`Android`,i=e.match(/Android[^;]+;\s*([^;\)]+)/i),a=i?i[1].trim():``;a&&a!==`K`&&!a.startsWith(`Build/`)?(a=a.replace(/\s*Build\/.*$/i,``).trim(),t=`${r} (${a})`):t=`${r} Phone`}else if(i){let n=e.match(/OS\s+([0-9_]+)/i),r=n?n[1].replace(/_/g,`.`):``;t=r?`Apple iPhone (iOS ${r})`:`Apple iPhone`}else if(a){let n=e.match(/OS\s+([0-9_]+)/i),r=n?n[1].replace(/_/g,`.`):``;t=r?`Apple iPad (iPadOS ${r})`:`Apple iPad`}else o?t=`Apple Mac (macOS)`:s?t=/Windows NT 10\.0/i.test(e)?`Windows 10/11 (PC)`:/Windows NT 6\.3/i.test(e)?`Windows 8.1 (PC)`:/Windows NT 6\.1/i.test(e)?`Windows 7 (PC)`:`Windows (PC)`:c&&(t=/x86_64/i.test(e)?`Linux (x86_64)`:/aarch64|arm64/i.test(e)?`Linux (ARM64)`:/armv7|arm/i.test(e)?`Linux (ARM)`:`Linux Workstation`);if(/HeadlessChrome\/([0-9\.]+)/i.test(e)){let t=e.match(/HeadlessChrome\/([0-9\.]+)/i),r=t?t[1].split(`.`):[];n=`HeadlessChrome ${r[0]?r[0]+`.`+(r[1]||`0`):``}`.trim()}else if(/Edg\/([0-9\.]+)/i.test(e)){let t=e.match(/Edg\/([0-9\.]+)/i),r=t?t[1].split(`.`):[];n=`Edge ${r[0]?r[0]+`.`+(r[1]||`0`):``}`.trim()}else if(/OPR\/([0-9\.]+)/i.test(e)){let t=e.match(/OPR\/([0-9\.]+)/i);n=`Opera ${(t?t[1].split(`.`):[])[0]||``}`.trim()}else if(/Firefox\/([0-9\.]+)/i.test(e)){let t=e.match(/Firefox\/([0-9\.]+)/i),r=t?t[1].split(`.`):[];n=`Firefox ${r[0]?r[0]+`.`+(r[1]||`0`):``}`.trim()}else if(/Chrome\/([0-9\.]+)/i.test(e)){let t=e.match(/Chrome\/([0-9\.]+)/i),r=t?t[1].split(`.`):[],i=r[0]?`${r[0]}.${r[1]||`0`}`:``;n=/Mobile/i.test(e)?`Chrome Mobile ${i}`:`Chrome ${i}`}else if(/Safari\/([0-9\.]+)/i.test(e)&&!/Chrome/i.test(e)){let t=e.match(/Version\/([0-9\.]+)/i),r=t?t[1].split(`.`)[0]:``;n=r?`Safari ${r}`:`Safari`}return{device:t,browser:n}}function ji(e){let t=e&&!isNaN(e)&&e>0?new Date(e*1e3):new Date;return isNaN(t.getTime())?``:`${String(t.getDate()).padStart(2,`0`)} ${[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`][t.getMonth()]||``} ${t.getFullYear()}, ${String(t.getHours()).padStart(2,`0`)}:${String(t.getMinutes()).padStart(2,`0`)}:${String(t.getSeconds()).padStart(2,`0`)}`}async function Mi(){let e=document.getElementById(`activeSessionsFlatList`);if(!e)return;let t=localStorage.getItem(`maxnet_token`)||``;try{let n=await(await fetch(`/cgi-bin/auth?action=list_sessions&token=${encodeURIComponent(t)}`)).json(),r=n.sessions||[],i=n.current_ip||`10.0.0.111`,a=r.find(e=>e.is_current||e.token===t),o=r.filter(e=>!e.is_current&&e.token!==t),s=Ai(a&&a.ua?a.ua:navigator.userAgent),c=ji(a?a.created||a.last_active:null),l=``;l+=`
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
        `,o.forEach(e=>{let t=Ai(e.ua||``),n=ji(e.created||e.last_active);l+=`
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
          `}),e.innerHTML=l}catch(e){console.error(`fetchActiveSessions error`,e)}}async function Ni(e){if(confirm(`Are you sure you want to terminate this remote device session?`))try{await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`logout_device`,target_token:e})}),Mi()}catch(e){console.error(`logoutSingleDevice error`,e)}}async function Pi(){if(!confirm(`Are you sure you want to log out all other devices? Only this current browser will remain logged in.`))return;let e=localStorage.getItem(`maxnet_token`)||``;try{await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`logout_others`,token:e})}),alert(`All other remote device sessions have been revoked.`),Mi()}catch(e){console.error(`logoutOtherDevices error`,e)}}async function Fi(){if(confirm(`Warning: This will terminate all active sessions including this device and immediately lock the gateway. Continue?`)){try{await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`logout_all`})})}catch{}localStorage.removeItem(`maxnet_token`),localStorage.removeItem(`maxnet_auth`),f()}}async function Ii(){if(!confirm(`Are you sure you want to sign out from this device?`))return;let e=localStorage.getItem(`maxnet_token`)||``;try{await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`logout`,token:e})})}catch{}localStorage.removeItem(`maxnet_token`),localStorage.removeItem(`maxnet_auth`),f()}var Li=`ping`,Ri=!1,zi=0,Bi=null,Vi=`ALL`,Hi=`common`,Ui=`20, 21, 22, 23, 25, 53, 67, 68, 69, 80, 110, 119, 123, 135, 137, 138, 139, 143, 161, 162, 389, 443, 445, 465, 514, 587, 636, 873, 993, 995, 1080, 1194, 1433, 1521, 1723, 1883, 2049, 2082, 2083, 2086, 2087, 2181, 3000, 3128, 3306, 3389, 4369, 5000, 5060, 5222, 5432, 5672, 5900, 6379, 6443, 6667, 7000, 7001, 7681, 8000, 8008, 8080, 8081, 8443, 8888, 9000, 9090, 9092, 9200, 9418, 9999, 10000, 27017, 27018, 50000, 51820`;function Wi(e){Ri&&Xi(),Li=e,document.querySelectorAll(`.diag-nav-tab`).forEach(t=>{let n=t.getAttribute(`data-tool`)===e;t.classList.toggle(`active`,n),t.style.background=n?`#38bdf8`:`transparent`,t.style.color=n?`#0f172a`:`var(--text-dim)`}),Object.entries({ping:`diagConfigPing`,route:`diagConfigRoute`,ports:`diagConfigPorts`,whois:`diagConfigWhois`,dns:`diagConfigDns`}).forEach(([t,n])=>{let r=document.getElementById(n);r&&(r.style.display=t===e?`block`:`none`)});let t=document.getElementById(`diagTargetInput`);t&&(e===`whois`&&(t.value===`1.1.1.1`||!t.value)?t.value=`google.com`:e!==`dns`||t.value!==`1.1.1.1`&&t.value||(t.value=`cloudflare.com`))}function Gi(e){Hi=e;let t=document.getElementById(`btnPortModeCommon`),n=document.getElementById(`btnPortModeAll`),r=document.getElementById(`diagPortsCommonBox`);t&&n&&(t.style.background=e===`common`?`#38bdf8`:`transparent`,t.style.color=e===`common`?`#0f172a`:`var(--text-dim)`,n.style.background=e===`all`?`#38bdf8`:`transparent`,n.style.color=e===`all`?`#0f172a`:`var(--text-dim)`),r&&(r.style.display=e===`common`?`block`:`none`)}function Ki(){let e=document.getElementById(`diagPortsListInput`);e&&(e.value=Ui)}function qi(e){Vi=e,document.querySelectorAll(`#diagDnsTypesBar .dns-type-pill`).forEach(t=>{let n=t.textContent.trim()===e;t.classList.toggle(`active`,n),t.style.background=n?`#38bdf8`:`rgba(255,255,255,0.06)`,t.style.color=n?`#0f172a`:`var(--text-dim)`})}function Ji(){let e=document.getElementById(`diagResultsList`);e&&(e.innerHTML=``);let t=document.getElementById(`diagResultsContainer`);t&&(t.style.display=`none`)}function Yi(){Ri?Xi():Zi()}function Xi(){Ri=!1,Bi&&(clearTimeout(Bi),Bi=null);let e=document.getElementById(`btnDiagStart`);e&&(e.textContent=`START`,e.style.background=`linear-gradient(135deg, #0284c7, #0369a1)`)}async function Zi(){let e=(document.getElementById(`diagTargetInput`).value||``).trim();if(!e){alert(`Please enter a Domain Name or IP Address.`);return}Ri=!0;let t=document.getElementById(`btnDiagStart`);t&&(t.textContent=`STOP`,t.style.background=`linear-gradient(135deg, #ef4444, #dc2626)`);let n=document.getElementById(`diagResultsContainer`);n&&(n.style.display=`block`);let r=document.getElementById(`diagResultsList`),i=document.getElementById(`diagResultTitle`);i&&(i.textContent=`${Li.toUpperCase()} RESULTS: ${e}`),Li===`ping`?(zi=0,r&&(r.innerHTML=``),Qi()):Li===`route`?$i(e):Li===`ports`?ea(e):Li===`whois`?ta(e):Li===`dns`&&na(e)}async function Qi(){if(!Ri||Li!==`ping`)return;let e=(document.getElementById(`diagTargetInput`).value||`1.1.1.1`).trim(),t=parseFloat(document.getElementById(`diagPingDelay`).value)||1,n=parseInt(document.getElementById(`diagPingSize`).value,10)||56,r=!!document.getElementById(`diagPingIpv6`).checked;zi++;let i=zi;try{let t=`/cgi-bin/diagnostics?tool=ping&target=${encodeURIComponent(e)}&size=${n}&seq=${i}&ipv6=${r}`,a=await(await fetch(t)).json();if(!Ri)return;let o=document.getElementById(`diagResultsList`);if(o){let t=!!a.success,r=a.time_ms,s=a.ttl,c=a.ip||e,l=document.createElement(`div`);l.style.cssText=`display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--card-inner, #161822); border:1px solid rgba(255,255,255,0.06); border-radius:8px; font-family:var(--font-mono); font-size:11.5px; animation:fadeIn 0.2s ease;`,l.innerHTML=`
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
          `,o.insertBefore(l,o.firstChild)}}catch(e){console.error(`Ping error`,e)}Ri&&Li===`ping`&&(Bi=setTimeout(Qi,Math.max(200,t*1e3)))}async function $i(e){let t=document.getElementById(`diagResultsList`);t&&(t.innerHTML=`<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Tracing route hops to ${$(e)}...</div>`);let n=parseFloat(document.getElementById(`diagRouteMaxDelay`).value)||.5,r=!!document.getElementById(`diagRouteUdp`).checked,i=!!document.getElementById(`diagRouteIpv6`).checked;try{let a=`/cgi-bin/diagnostics?tool=route&target=${encodeURIComponent(e)}&max_delay=${n}&udp=${r}&ipv6=${i}`,o=(await(await fetch(a)).json()).hops||[];if(t){if(o.length===0)t.innerHTML=`<div style="padding:14px; text-align:center; color:var(--text-dim); font-family:var(--font-mono); font-size:11.5px;">No hops resolved or destination unreachable.</div>`;else{let e=`
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
              `}),e+=`</tbody></table></div>`,t.innerHTML=e}}}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:12px; font-size:12px;">Route query error: ${$(e.message)}</div>`)}finally{Xi()}}async function ea(e){let t=document.getElementById(`diagResultsList`);t&&(t.innerHTML=`<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Scanning target ports on ${$(e)}...</div>`);let n=Ui;if(Hi===`common`){let e=document.getElementById(`diagPortsListInput`);e&&e.value.trim()&&(n=e.value.trim())}else n=`21,22,23,25,53,80,110,123,135,139,143,443,445,993,995,1723,3306,3389,5000,5060,7681,8080,8443`;let r=n.split(/[\s,]+/).filter(e=>/^\d+$/.test(e)).join(`,`),i=!!document.getElementById(`diagPortsIpv6`).checked;try{let n=`/cgi-bin/diagnostics?tool=ports&target=${encodeURIComponent(e)}&ports=${r}&ipv6=${i}`,a=(await(await fetch(n)).json()).ports||[];if(t){let e=a.filter(e=>e.status===`open`),n=`
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; padding:6px 8px; background:rgba(255,255,255,0.02); border-radius:6px; font-family:var(--font-mono); font-size:11px;">
              <span>Total Scanned: <strong>${a.length}</strong></span>
              <span style="color:#10b981; font-weight:700;">${e.length} OPEN</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:6px;">
          `;a.forEach(e=>{let t=e.status===`open`;n+=`
              <div style="padding:7px 10px; background:var(--card-inner, #161822); border:1px solid ${t?`rgba(16,185,129,0.35)`:`rgba(255,255,255,0.06)`}; border-radius:8px; font-family:var(--font-mono); font-size:11px; display:flex; align-items:center; justify-content:space-between;">
                <div>
                  <div style="font-weight:700; color:var(--text-main);">Port ${e.port}</div>
                  <div style="font-size:9.5px; color:var(--text-dim);">${$(e.service||`Service`)}</div>
                </div>
                <span class="card-badge ${t?`emerald`:``}" style="${t?``:`background:rgba(255,255,255,0.04); color:var(--text-dim); border-color:transparent; font-size:9px;`}">${t?`OPEN`:`CLOSED`}</span>
              </div>
            `}),n+=`</div>`,t.innerHTML=n}}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:12px; font-size:12px;">Port scan error: ${$(e.message)}</div>`)}finally{Xi()}}async function ta(e){let t=document.getElementById(`diagResultsList`);t&&(t.innerHTML=`<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Querying WHOIS registry database for ${$(e)}...</div>`);let n=document.getElementById(`diagWhoisServer`).value,r=!!document.getElementById(`diagWhoisIpv6`).checked;try{let i=`/cgi-bin/diagnostics?tool=whois&target=${encodeURIComponent(e)}&server=${encodeURIComponent(n)}&ipv6=${r}`,a=await(await fetch(i)).json();t&&(t.innerHTML=`
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
          `)}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:12px; font-size:12px;">Whois error: ${$(e.message)}</div>`)}finally{Xi()}}async function na(e){let t=document.getElementById(`diagResultsList`);t&&(t.innerHTML=`<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Querying DNS (${Vi}) records for ${$(e)}...</div>`);let n=(document.getElementById(`diagDnsServerInput`).value||``).trim(),r=!!document.getElementById(`diagDnsDnssec`).checked,i=!!document.getElementById(`diagDnsAllSections`).checked,a=!!document.getElementById(`diagDnsIpv6`).checked;try{let o=`/cgi-bin/diagnostics?tool=dns&target=${encodeURIComponent(e)}&type=${encodeURIComponent(Vi)}&server=${encodeURIComponent(n)}&dnssec=${r}&all_sections=${i}&ipv6=${a}`,s=await(await fetch(o)).json(),c=s.answers||[];if(t){if(c.length===0)t.innerHTML=`
              <div style="padding:14px; text-align:center; color:var(--text-dim); font-family:var(--font-mono); font-size:11.5px;">No ${Vi} records found.</div>
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
              `}),e+=`</tbody></table></div>`,t.innerHTML=e}}}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:12px; font-size:12px;">DNS error: ${$(e.message)}</div>`)}finally{Xi()}}async function ra(){let e=document.getElementById(`diagToolSelect`).value,t=document.getElementById(`diagTargetInput`).value.trim(),n=document.getElementById(`diagGuiResults`),r=document.getElementById(`diagRawToggleBox`),i=document.getElementById(`diagOutputBox`);if(!t)alert(`Please enter a target host or IP.`);else{n&&(n.style.display=`block`,n.innerHTML=`<div style="text-align:center; padding:16px; color:var(--text-dim); font-size:12px;">Running ${e.toUpperCase()} to ${$(t)}...</div>`),r&&(r.style.display=`none`);try{let n=(await(await fetch(`/cgi-bin/diagnostics?tool=${encodeURIComponent(e)}&target=${encodeURIComponent(t)}`)).json()).output||``;i&&(i.innerText=n),r&&(r.style.display=`block`),ia(e,t,n);let a=document.getElementById(`acc-diagnostics`);if(a&&a.classList.contains(`expanded`)){let e=a.querySelector(`.accordion-content`);e&&(e.style.maxHeight=`none`,e.style.overflow=`visible`)}}catch(e){n&&(n.innerHTML=`<div style="color:var(--mh-rose); padding:12px; font-size:12px;">Diagnostic request failed: ${$(e.message)}</div>`)}}}function ia(e,t,n){let r=document.getElementById(`diagGuiResults`);if(r){if(e===`ping`||e===`ping6`){let i=n.match(/\(([0-9a-fA-F.:]+)\)/),a=i?i[1]:t,o=n.match(/(\d+)% packet loss/),s=o?parseInt(o[1],10):100,c=n.match(/(?:rtt|round-trip) min\/avg\/max(?:\/mdev)? = ([0-9.]+)\/([0-9.]+)\/([0-9.]+)/),l=c?c[1]:`--`,u=c?c[2]:`--`,d=c?c[3]:`--`,f=[],p=/time=([0-9.]+) ms/g,m;for(;(m=p.exec(n))!==null;)f.push(m[1]);let h=s===0,g=h?`emerald`:s<100?`gold`:`rose`,_=h?`ONLINE (0% LOSS)`:s<100?`${s}% PACKET LOSS`:`DESTINATION UNREACHABLE`;r.innerHTML=`
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
                    <button class="mh-btn btn-sm btn-ghost" onclick="navigator.clipboard.writeText('${e}'); alert('Copied ' + '${e}')" style="font-size:10px; padding:2px 6px;">COPY</button>
                  </div>
                `}).join(``):`<div style="color:var(--text-dim); font-size:11.5px; padding:10px; text-align:center;">No DNS address records found.</div>`}
            </div>
          </div>
        `}}}function aa(e){return e&&{"255.255.255.0":`24`,"255.255.0.0":`16`,"255.0.0.0":`8`}[e]||`24`}function oa(e){return{24:`255.255.255.0`,16:`255.255.0.0`,8:`255.0.0.0`}[e]||`255.255.255.0`}function sa(e){let t=document.getElementById(`netCidrSelect`);t&&(t.value=[`255.255.255.0`,`255.255.0.0`,`255.0.0.0`].includes(e.trim())?aa(e.trim()):`custom`)}function ca(e){let t=document.getElementById(`netMask`);t&&e!==`custom`&&(t.value=oa(e))}function la(e){let t=document.getElementById(`rowDhcpPool`);t&&(t.style.opacity=e?`1`:`0.4`,t.style.pointerEvents=e?`auto`:`none`)}function ua(e){[`rowIpv6Addrs`,`rowIpv6WanMode`,`rowIpv6Ra`,`rowIpv6Dhcp6`,`rowIpv6Ula`,`rowIpv6Privacy`].forEach(t=>{let n=document.getElementById(t);n&&(n.style.opacity=e?`1`:`0.38`,n.style.pointerEvents=e?`auto`:`none`)});let t=document.getElementById(`badgeIpv6Status`);t&&(e?(t.textContent=`DUAL-STACK ONLINE`,t.className=`setting-status-badge badge-active`):(t.textContent=`IPV6 DISABLED`,t.className=`setting-status-badge badge-disabled`))}function da(e){let t=document.getElementById(`netDns`);t&&(t.value=e,t.style.borderColor=`var(--mh-emerald)`)}function fa(e=[]){let t=document.getElementById(`staticLeasesListContainer`),n=document.getElementById(`staticLeasesCountBadge`);n&&(n.textContent=`${e.length} RESERVED`);let r=document.getElementById(`disp_static_leases_count`);r&&(r.textContent=`${e.length} Devices Configured • Permanent DHCP IPv4 reservation`),t&&(t.innerHTML=!e||e.length===0?`<div style="padding:20px; text-align:center; color:var(--text-dim); font-size:12px; font-family:var(--font-mono); background:rgba(255,255,255,0.02); border-radius:8px;">No static DHCP leases registered. Click Add Reservation to create one.</div>`:e.map(e=>`
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
      `).join(``))}async function pa(){let e=document.getElementById(`newLeaseName`),t=document.getElementById(`newLeaseMac`),n=document.getElementById(`newLeaseIp`),r=e?e.value.trim():``,i=t?t.value.trim():``,a=n?n.value.trim():``;if(!i||!a)alert(`Please enter both MAC address and IP for the reservation.`);else try{let o=await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`add_lease`,name:r||`client`,mac:i,ip:a})})).json();o.status===`ok`?(e&&(e.value=``),t&&(t.value=``),n&&(n.value=``),await _a()):alert(`Failed to add lease: `+(o.message||`Unknown error`))}catch(e){alert(`Error adding lease: `+e.message)}}async function ma(e){if(confirm(`Remove DHCP reservation for MAC ${e}?`))try{ai(`saving`,`Removing reservation...`),(await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`del_lease`,mac:e})})).json()).status===`ok`?(ai(`saved`,`Reservation Removed`),await _a()):ai(`error`,`Removal failed`)}catch(e){ai(`error`,`Delete error`),console.error(e)}}async function ha(e){let t=document.getElementById(`dispUsbTetherState`),n=document.getElementById(`dispUsbTetherBadge`);e?(t&&(t.textContent=`State: Active (usb0) • Primary upstream internet gateway over USB`),n&&(n.className=`setting-status-badge badge-active`,n.textContent=`5G SA ONLINE`),Q(`USB WAN Tethering enabled`,`success`)):(t&&(t.textContent=`State: Disabled • USB tethering interface usb0 brought down`),n&&(n.className=`setting-status-badge badge-disabled`,n.textContent=`DISCONNECTED`),Q(`USB WAN Tethering disabled`,`info`));try{await u(`/cgi-bin/device?action=settings_tether&enabled=`+(e?`1`:`0`))}catch{}}async function ga(e){Q(`Tethering DNS Forwarding `+(e?`Enabled`:`Disabled`),`info`)}async function _a(){try{let e=await(await fetch(`/cgi-bin/network`)).json();if(e.hostname&&document.getElementById(`netDeviceHostname`)){document.getElementById(`netDeviceHostname`).value=e.hostname;let t=document.getElementById(`disp_device_hostname`),n=e.hostname.toLowerCase();t&&(t.textContent=`${e.hostname} • ${n}.lan / ${n}.local`)}if(document.getElementById(`netCustomMac`)){document.getElementById(`netCustomMac`).value=e.custom_mac||``,e.hw_mac&&document.getElementById(`netHwMac`)&&(document.getElementById(`netHwMac`).value=e.hw_mac);let t=document.getElementById(`disp_custom_mac`);t&&(t.textContent=e.custom_mac?`Custom: ${e.custom_mac} • Hardware: ${e.hw_mac||`ca:e7:b7:34:8f:ac`}`:`Default: ${e.hw_mac||`ca:e7:b7:34:8f:ac`} • Hardware MAC in use`)}if(e.lan_ip){document.getElementById(`netLanIp`)&&(document.getElementById(`netLanIp`).value=e.lan_ip);let t=document.getElementById(`disp_lan_ip`);t&&(t.textContent=e.lan_ip)}if(e.netmask){document.getElementById(`netMask`)&&(document.getElementById(`netMask`).value=e.netmask,sa(e.netmask));let t=document.getElementById(`disp_net_mask`);t&&(t.textContent=`${e.netmask} (/${aa(e.netmask)})`)}if(e.gateway!==void 0&&document.getElementById(`netGateway`)){document.getElementById(`netGateway`).value=e.gateway||``;let t=document.getElementById(`disp_net_gateway`);t&&(t.textContent=e.gateway?e.gateway:`None (Direct br-lan)`)}if(e.mtu&&document.getElementById(`netMtu`)){document.getElementById(`netMtu`).value=e.mtu;let t=document.getElementById(`disp_net_mtu`);t&&(t.textContent=`${e.mtu} bytes`)}if(e.dns&&document.getElementById(`netDns`)&&(document.getElementById(`netDns`).value=e.dns),e.dhcp_start&&document.getElementById(`netDhcpStart`)&&(document.getElementById(`netDhcpStart`).value=e.dhcp_start),e.dhcp_limit&&document.getElementById(`netDhcpLimit`)&&(document.getElementById(`netDhcpLimit`).value=e.dhcp_limit),e.dhcp_leasetime&&document.getElementById(`netDhcpLease`)&&(document.getElementById(`netDhcpLease`).value=e.dhcp_leasetime),document.getElementById(`netDhcpMasterToggle`)){let t=e.dhcp_ignore!==1&&e.dhcp_ignore!==`1`;document.getElementById(`netDhcpMasterToggle`).checked=t,la(t)}let t=document.getElementById(`netLanBadge`);if(t&&e.lan_ip&&(t.textContent=`${e.lan_ip}/${aa(e.netmask||`255.255.255.0`)}`),e.wan){let t=document.getElementById(`wanStatusDot`),n=document.getElementById(`wanProtoBadge`),r=document.getElementById(`wanIpBadge`),i=document.getElementById(`wanStateBadge`);n&&(n.textContent=(e.wan.proto||`DHCP`).toUpperCase()),r&&(r.textContent=e.wan.ip||`--`),e.wan.up?(t&&(t.style.background=`#10b981`),i&&(i.className=`toggle-status-badge on`,i.textContent=`CONNECTED`)):(t&&(t.style.background=`#71717a`),i&&(i.className=`toggle-status-badge off`,i.textContent=`DISCONNECTED`))}if(fa(e.static_leases||[]),document.getElementById(`netIpv6MasterToggle`)){let t=e.ipv6_enabled===void 0||e.ipv6_enabled===1||e.ipv6_enabled===`1`;document.getElementById(`netIpv6MasterToggle`).checked=t,ua(t)}if(e.ipv6_wan_mode&&document.getElementById(`netIpv6WanMode`)){document.getElementById(`netIpv6WanMode`).value=e.ipv6_wan_mode;let t=document.getElementById(`disp_ipv6_wan_mode`);t&&(t.textContent={dhcpv6:`DHCPv6-PD & SLAAC (Automatic)`,slaac:`SLAAC Only (Stateless Autoconfiguration)`,static:`Static IPv6 Address`,disabled:`Disabled (No WAN IPv6)`}[e.ipv6_wan_mode]||e.ipv6_wan_mode)}if(document.getElementById(`netIpv6RaToggle`)&&(document.getElementById(`netIpv6RaToggle`).checked=e.ipv6_ra===void 0||e.ipv6_ra===1||e.ipv6_ra===`1`),document.getElementById(`netIpv6Dhcp6Toggle`)&&(document.getElementById(`netIpv6Dhcp6Toggle`).checked=e.ipv6_dhcp6===1||e.ipv6_dhcp6===`1`),e.ipv6_ula&&document.getElementById(`netIpv6Ula`)){document.getElementById(`netIpv6Ula`).value=e.ipv6_ula;let t=document.getElementById(`disp_ipv6_ula`);t&&(t.textContent=`${e.ipv6_ula} • Unique local address scope`)}document.getElementById(`netIpv6PrivacyToggle`)&&(document.getElementById(`netIpv6PrivacyToggle`).checked=e.ipv6_privacy===1||e.ipv6_privacy===`1`);let n=document.getElementById(`disp_ipv6_addrs`);n&&(n.textContent=`LAN: ${e.ipv6_lan_addr||`fd00::1/60`} • WAN: ${e.ipv6_wan_addr||`None`}`),document.getElementById(`netHwFlowToggle`)&&(document.getElementById(`netHwFlowToggle`).checked=e.flow_offloading_hw===void 0||e.flow_offloading_hw===1||e.flow_offloading_hw===`1`),document.getElementById(`netSwFlowToggle`)&&(document.getElementById(`netSwFlowToggle`).checked=e.flow_offloading===void 0||e.flow_offloading===1||e.flow_offloading===`1`),document.getElementById(`netMssClampToggle`)&&(document.getElementById(`netMssClampToggle`).checked=e.mss_clamping===void 0||e.mss_clamping===1||e.mss_clamping===`1`),document.getElementById(`netDnsRebindToggle`)&&(document.getElementById(`netDnsRebindToggle`).checked=e.dns_rebind===void 0||e.dns_rebind===1||e.dns_rebind===`1`),typeof xa==`function`&&xa(e)}catch(e){console.error(`fetchNetworkConfig error`,e)}}async function va(){oi(50)}function ya(){ba()}function ba(){let e=(document.getElementById(`wanProtoSelect`)?document.getElementById(`wanProtoSelect`).value:`dhcp`)||`dhcp`,t=document.getElementById(`disp_wan_proto`);t&&(t.textContent=e===`pppoe`?`PPPoE (Fiber / DSL Dial-up Session)`:e===`static`?`Static IPv4 (Fixed Gateway Address)`:`DHCP Client (Dynamic IPv4 from ISP)`);let n=document.getElementById(`pppoeRedirectRow`),r=document.getElementById(`wanStaticConfigFields`);n&&(n.style.display=e===`pppoe`?`flex`:`none`),r&&(r.style.display=e===`static`?`flex`:`none`);let i=document.getElementById(`wanStaticIp`)?document.getElementById(`wanStaticIp`).value:``,a=document.getElementById(`disp_wan_static_ip`);a&&(a.textContent=i?`${i} • Fixed Address`:`192.168.1.2 (Tap to configure)`);let o=document.getElementById(`wanStaticNetmask`)?document.getElementById(`wanStaticNetmask`).value:``,s=document.getElementById(`disp_wan_static_netmask`);s&&(s.textContent=o?`${o}`:`255.255.255.0 (/24)`);let c=document.getElementById(`wanStaticGateway`)?document.getElementById(`wanStaticGateway`).value:``,l=document.getElementById(`disp_wan_static_gateway`);l&&(l.textContent=c?`${c} • Upstream Gateway`:`192.168.1.1 (Tap to configure)`);let u=document.getElementById(`wanCustomMacInput`)?document.getElementById(`wanCustomMacInput`).value:``,d=document.getElementById(`disp_wan_custom_mac`);d&&(d.textContent=u?`Custom: ${u.toLowerCase()} • Hardware override active`:`Default Hardware MAC in use`)}async function xa(e){try{let t=e||await(await fetch(`/cgi-bin/network`)).json(),n=t.wan||{};document.getElementById(`wanProtoSelect`)&&(document.getElementById(`wanProtoSelect`).value=n.proto||`dhcp`),document.getElementById(`wanPppoeUser`)&&(document.getElementById(`wanPppoeUser`).value=n.username||``),document.getElementById(`wanPppoePass`)&&(document.getElementById(`wanPppoePass`).value=n.password||``),document.getElementById(`wanPppoeService`)&&(document.getElementById(`wanPppoeService`).value=n.service||``),document.getElementById(`wanPppoeMtu`)&&(document.getElementById(`wanPppoeMtu`).value=n.mtu||1492),document.getElementById(`wanCustomMacInput`)&&(document.getElementById(`wanCustomMacInput`).value=n.custom_mac||``),n.ip&&document.getElementById(`wanStaticIp`)&&!document.getElementById(`wanStaticIp`).value&&(document.getElementById(`wanStaticIp`).value=n.ip),n.netmask&&document.getElementById(`wanStaticNetmask`)&&(document.getElementById(`wanStaticNetmask`).value=n.netmask),n.gateway&&document.getElementById(`wanStaticGateway`)&&(document.getElementById(`wanStaticGateway`).value=n.gateway),ba();let r=document.getElementById(`wanStatusBadge`);if(r){let e=n.up||n.ip&&n.ip!==`0.0.0.0`;r.textContent=e?`${(n.proto||`DHCP`).toUpperCase()} ACTIVE`:`DISCONNECTED`,r.className=`card-badge `+(e?`emerald`:`gray`)}if(t.interfaces&&Array.isArray(t.interfaces)){let e=t.interfaces.find(e=>e.ifname===`usb0`);e&&document.getElementById(`ifaceUsbIp`)&&(document.getElementById(`ifaceUsbIp`).textContent=e.ip||`192.168.109.110`);let n=t.interfaces.find(e=>e.name===`wan`||e.ifname===`eth0`);n&&document.getElementById(`ifaceEthWanState`)&&(document.getElementById(`ifaceEthWanState`).textContent=n.up?n.ip||`Connected`:`Link Down / Ready`)}}catch(e){console.error(`loadWanInterfaceConfig error:`,e)}}async function Sa(){let e=document.getElementById(`wanProtoSelect`)?document.getElementById(`wanProtoSelect`).value:`dhcp`,t=(document.getElementById(`wanPppoeUser`)?.value||``).trim(),n=document.getElementById(`wanPppoePass`)?.value||``,r=(document.getElementById(`wanPppoeService`)?.value||``).trim(),i=parseInt(document.getElementById(`wanPppoeMtu`)?.value,10)||1492,a=(document.getElementById(`wanCustomMacInput`)?.value||``).trim(),o=(document.getElementById(`wanStaticIp`)?.value||``).trim(),s=(document.getElementById(`wanStaticNetmask`)?.value||`255.255.255.0`).trim(),c=(document.getElementById(`wanStaticGateway`)?.value||``).trim();if(a&&!/^([0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}$/.test(a))typeof Q==`function`?Q(`Invalid MAC address format (XX:XX:XX:XX:XX:XX)`,`error`):alert(`Invalid MAC address format`);else try{let l=await(await fetch(`/cgi-bin/network`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_wan`,proto:e,username:t,password:n,service:r,mtu:i,custom_mac:a,ip:o,netmask:s,gateway:c})})).json();l.status===`ok`?(typeof Q==`function`&&Q(`WAN Interface configuration applied successfully!`,`success`),xa(),typeof z==`function`&&z()):typeof Q==`function`&&Q(`Failed to apply WAN config: `+(l.error||`Unknown error`),`error`)}catch(e){typeof Q==`function`&&Q(`Error saving WAN interface: `+e.message,`error`)}}function Ca(){wa(),document.getElementById(`wanCustomMacInput`)&&document.getElementById(`modalInput_wan_custom_mac`)&&(document.getElementById(`wanCustomMacInput`).value=document.getElementById(`modalInput_wan_custom_mac`).value,ba())}function wa(){let e=window._lastDataCache||{},t=Array.isArray(e.clients)?e.clients:[],n=``;for(let e of t)if(e.connected&&!e.is_self&&e.mac){n=e.mac;break}let r=document.getElementById(`modalInput_wan_custom_mac`);r&&(r.value=n||`ca:e7:b7:34:8f:ac`,typeof Q==`function`&&Q(`Cloned MAC: `+r.value,`info`))}function Ta(){let e=`0123456789ABCDEF`,t=`02`;for(let n=1;n<6;n++)t+=`:`+e[Math.floor(Math.random()*16)]+e[Math.floor(Math.random()*16)];let n=document.getElementById(`modalInput_wan_custom_mac`);n&&(n.value=t.toLowerCase())}function Ea(){let e=document.getElementById(`wanCustomMacInput`);e&&(e.value=``,ba(),typeof Q==`function`&&Q(`Custom MAC cleared. Hardware default will be used.`,`info`))}window._cachedPppoeData=null;async function Da(){try{let e=await fetch(`/cgi-bin/pppoe?action=get`);if(!e.ok)return;let t=await e.json();if(t&&t.status===`ok`){window._cachedPppoeData=t;let e=t.client||{},n=t.server||{},r=document.getElementById(`pppoeClientMasterToggle`);r&&(r.checked=!!e.enabled);let i=document.getElementById(`pppoeClientStatusSub`);i&&(i.textContent=e.enabled?e.connected?`Connected • Assigned IP: ${e.ip||`--`} • ISP Dialer Active`:`Connecting to ISP Access Concentrator...`:`Disabled • ISP Broadband dialer over WAN Ethernet`);let a=document.getElementById(`pppoeClientIpText`);a&&(a.textContent=e.connected?`IP: ${e.ip||`--`} • Gateway: ${e.gateway||`--`} • DNS: ${e.dns||`--`}`:e.enabled?`Dialing PPPoE session...`:`Disconnected • Gateway: -- • DNS: --`);let o=document.getElementById(`pppoeClientUptime`);o&&(e.connected?(o.textContent=`UP (${Math.floor(e.uptime/60)}m)`,o.style.color=`#10b981`):(o.textContent=e.enabled?`Connecting...`:`Offline`,o.style.color=e.enabled?`#06b6d4`:`var(--text-dim)`));let s=document.getElementById(`disp_pppoe_user_desc`);s&&(s.textContent=e.username?`User: ${e.username} • Password: ${e.has_password?`••••••••`:`(empty)`}`:`User: Not set • Tap to configure username & password`);let c=document.getElementById(`disp_pppoe_ac_desc`);c&&(c.textContent=e.ac||e.service?`AC: ${e.ac||`Auto`} • Service: ${e.service||`Default`}`:`Auto Discovery • Optional ISP AC and Service Name`);let l=document.getElementById(`disp_pppoe_mac_desc`);l&&(l.textContent=`MTU: ${e.mtu||1492} • ${e.macaddr?`Cloned MAC: ${e.macaddr.toLowerCase()}`:`Hardware Default MAC`}`);let u=document.getElementById(`pppoeServerMasterToggle`);u&&(u.checked=!!n.server_enabled);let d=document.getElementById(`pppoeServerStatusSub`);d&&(d.textContent=n.server_enabled?n.running?`Running on ${n.listen_iface||`br-lan`} • ${n.sessions?n.sessions.length:0} active subscribers`:`Starting server daemon...`:`Disabled • Local PPPoE Concentrator for LAN subscribers`);let f=document.getElementById(`disp_pppoe_srv_network`);f&&(f.textContent=`Gateway: ${n.server_ip||`10.0.0.1`} • Pool: ${n.pool_start||`10.0.0.150`} - ${n.pool_end||`10.0.0.220`} • DNS: ${n.dns1||`10.0.0.1`}`);let p=document.getElementById(`disp_pppoe_users_count`);if(p){let e=n.users&&n.users.length||0;p.textContent=`${e} subscriber account${e===1?``:`s`} configured • Tap to manage`}let m=document.getElementById(`pppoeActiveSessionsText`);if(m){let e=n.sessions||[];m.textContent=e.length===0?n.server_enabled?`Server listening • No subscribers currently connected`:`Server is disabled`:e.map(e=>`${e.interface} (${e.client_ip})`).join(`, `)}}}catch(e){console.warn(`loadPppoeConfig error:`,e)}}async function Oa(e){typeof Q==`function`&&Q(e?`Enabling PPPoE WAN dialer...`:`Disabling PPPoE client (reverting to DHCP)...`,`info`);try{let t=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.username||``,n=await(await fetch(`/cgi-bin/pppoe?action=client_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({enabled:!!e,username:t})})).json();typeof Q==`function`&&Q(n.message||`PPPoE Client state updated`,`success`)}catch(e){typeof Q==`function`&&Q(`PPPoE client toggle error: `+e.message,`error`)}Da()}async function ka(e,t){typeof Q==`function`&&Q(`Saving PPPoE credentials...`,`info`);try{let n=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.enabled,r=await(await fetch(`/cgi-bin/pppoe?action=client_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({enabled:!!n,username:e,password:t})})).json();typeof Q==`function`&&Q(r.message||`Credentials updated`,`success`)}catch(e){typeof Q==`function`&&Q(`Error saving credentials: `+e.message,`error`)}Da()}async function Aa(e,t){typeof Q==`function`&&Q(`Saving Access Concentrator options...`,`info`);try{let n=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.enabled,r=await(await fetch(`/cgi-bin/pppoe?action=client_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({enabled:!!n,ac:e,service:t})})).json();typeof Q==`function`&&Q(r.message||`AC options updated`,`success`)}catch(e){typeof Q==`function`&&Q(`Error saving AC options: `+e.message,`error`)}Da()}async function ja(e,t){typeof Q==`function`&&Q(`Saving MAC & MTU settings...`,`info`);try{let n=window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.enabled,r=await(await fetch(`/cgi-bin/pppoe?action=client_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({enabled:!!n,macaddr:e,mtu:t})})).json();typeof Q==`function`&&Q(r.message||`MAC & MTU updated`,`success`)}catch(e){typeof Q==`function`&&Q(`Error saving MAC: `+e.message,`error`)}Da()}function Ma(){let e=`0123456789abcdef`,t=`02`;for(let n=1;n<6;n++)t+=`:`+e[Math.floor(Math.random()*16)]+e[Math.floor(Math.random()*16)];let n=document.getElementById(`modalInput_pppoe_mac`);n&&(n.value=t)}async function Na(e){typeof Q==`function`&&Q(e?`Starting PPPoE Access Server...`:`Stopping PPPoE Access Server...`,`info`);try{let t=window._cachedPppoeData&&window._cachedPppoeData.server||{},n=await(await fetch(`/cgi-bin/pppoe?action=server_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({server_enabled:!!e,listen_iface:t.listen_iface||`br-lan`,server_ip:t.server_ip||`10.0.0.1`,pool_start:t.pool_start||`10.0.0.150`,pool_end:t.pool_end||`10.0.0.220`,dns1:t.dns1||`10.0.0.1`,dns2:t.dns2||`1.1.1.1`,max_sessions:t.max_sessions||32,service_name:t.service_name||`MAXNET`})})).json();typeof Q==`function`&&Q(n.message||`PPPoE Server state updated`,`success`)}catch(e){typeof Q==`function`&&Q(`PPPoE server toggle error: `+e.message,`error`)}Da()}async function Pa(e,t,n,r,i,a){typeof Q==`function`&&Q(`Saving PPPoE Server configuration...`,`info`);try{let o=window._cachedPppoeData&&window._cachedPppoeData.server||{},s=!!o.server_enabled,c=await(await fetch(`/cgi-bin/pppoe?action=server_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({server_enabled:s,listen_iface:o.listen_iface||`br-lan`,server_ip:e,pool_start:t,pool_end:n,dns1:r,dns2:i,max_sessions:a,service_name:o.service_name||`MAXNET`})})).json();typeof Q==`function`&&Q(c.message||`PPPoE Server updated`,`success`)}catch(e){typeof Q==`function`&&Q(`PPPoE server save error: `+e.message,`error`)}Da()}async function Fa(){let e=(document.getElementById(`modalInput_new_pppoe_u`)?.value||``).trim(),t=(document.getElementById(`modalInput_new_pppoe_p`)?.value||``).trim();if(!e||!t)typeof Q==`function`&&Q(`Username and password are required`,`error`);else try{let n=await(await fetch(`/cgi-bin/pppoe?action=add_user`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user:e,pass:t,ip:`*`})})).json();n.status===`ok`?(typeof Q==`function`&&Q(`Subscriber account ${e} added!`,`success`),await Da(),ci(`pppoe_server_users`)):typeof Q==`function`&&Q(n.message||`Failed to add user`,`error`)}catch(e){typeof Q==`function`&&Q(`Add user error: `+e.message,`error`)}}async function Ia(e){if(confirm(`Are you sure you want to delete subscriber ${e}?`))try{let t=await(await fetch(`/cgi-bin/pppoe?action=del_user`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user:e})})).json();t.status===`ok`?(typeof Q==`function`&&Q(`Subscriber ${e} deleted`,`success`),await Da(),ci(`pppoe_server_users`)):typeof Q==`function`&&Q(t.message||`Failed to delete user`,`error`)}catch(e){typeof Q==`function`&&Q(`Delete user error: `+e.message,`error`)}}async function La(){try{let e=await fetch(`/cgi-bin/device?action=dufs_get`);if(!e.ok)return;let t=await e.json();if(t&&t.status===`ok`){let e=t.port||5e3,n=t.path||`/mnt/storage`,r=t.allow_upload!==!1,i=t.allow_delete!==!1,a=t.user||``,o=!!t.has_auth;document.getElementById(`dufsPortInput`)&&(document.getElementById(`dufsPortInput`).value=e),document.getElementById(`dufsPathInput`)&&(document.getElementById(`dufsPathInput`).value=n),document.getElementById(`dufsAllowUpload`)&&(document.getElementById(`dufsAllowUpload`).value=r?`true`:`false`),document.getElementById(`dufsAllowDelete`)&&(document.getElementById(`dufsAllowDelete`).value=i?`true`:`false`),document.getElementById(`dufsUserInput`)&&(document.getElementById(`dufsUserInput`).value=a);let s=document.getElementById(`disp_dufs_port`);s&&(s.textContent=`Port ${e} (Standard WebDAV)`);let c=document.getElementById(`disp_dufs_path`);c&&(c.textContent=`${n} (Storage Mount)`);let l=document.getElementById(`disp_dufs_permissions`);l&&(l.textContent=r&&i?`Full Access: Browse, Upload, and Delete Enabled`:r?`Upload Only: Browse & Upload Enabled (No Delete)`:`Read-Only: Browse & Download Only`);let u=document.getElementById(`disp_dufs_auth`);u&&(u.textContent=o?`Protected: User "${a||`root`}" (Auth Required)`:`Authentication Enforced (Default: root / admin)`);let d=window.location.hostname||`10.0.0.1`,f=`${window.location.protocol||`http:`}//${d}:${e}/`,p=document.getElementById(`dufsWebdavUrlText`);p&&(p.innerHTML=`<strong>${f}</strong> &bull; Tap to copy or view connection instructions`);let m=document.getElementById(`dufsOpenBtn`);m&&(m.href=f);let h=!!t.enabled,g=document.getElementById(`dufsMasterToggle`);g&&(g.checked=h);let _=document.getElementById(`dufsServiceSub`);_&&(_.textContent=h?`Active on Port ${e} • WebDAV & Browser File Explorer`:`Disabled • Local WebDAV storage server & browser file manager`)}}catch(e){console.warn(`loadDufsConfig error:`,e)}}async function Ra(e){typeof Q==`function`&&Q(e?`Starting Dufs WebDAV service...`:`Stopping Dufs WebDAV service...`,`info`);try{let t=await(await fetch(`/cgi-bin/device?action=dufs_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({enabled:!!e})})).json();t&&t.status===`ok`?typeof Q==`function`&&Q(e?`Dufs WebDAV service started`:`Dufs WebDAV service stopped`,`success`):typeof Q==`function`&&Q(`Failed to update Dufs state`,`error`)}catch(e){typeof Q==`function`&&Q(`Error toggling Dufs: `+e.message,`error`)}La()}async function za(){let e=parseInt(document.getElementById(`dufsPortInput`)?.value,10)||5e3,t=(document.getElementById(`dufsPathInput`)?.value||`/mnt/storage`).trim(),n=document.getElementById(`dufsAllowUpload`)?.value===`true`,r=document.getElementById(`dufsAllowDelete`)?.value===`true`,i=(document.getElementById(`dufsUserInput`)?.value||``).trim(),a=(document.getElementById(`dufsPassInput`)?.value||``).trim();try{let o=await(await fetch(`/cgi-bin/device?action=dufs_set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({port:e,path:t,allow_upload:n,allow_delete:r,user:i,pass:a})})).json();o&&o.status===`ok`?(typeof Q==`function`&&Q(`Dufs WebDAV & File Manager updated!`,`success`),La()):typeof Q==`function`&&Q(`Failed to save Dufs config`,`error`)}catch(e){typeof Q==`function`&&Q(`Error saving Dufs: `+e.message,`error`)}}window._acknowledgedAlerts=window._acknowledgedAlerts||new Set;function Ba(){P(`settings`),x(`acc-notifications`)}function Va(){Ba()}function Ha(){M()}function Ua(e){let t=document.getElementById(`topoNotificationBadge`);t&&(t.style.display=e>0?`inline-block`:`none`)}function Wa(){$a()}function Ga(){let e=document.getElementById(`sslHelpModalOverlay`);e&&(e.parentElement!==document.body&&document.body.appendChild(e),e.style.display=`flex`,requestAnimationFrame(()=>e.classList.add(`active`)))}function Ka(){let e=document.getElementById(`sslHelpModalOverlay`);e&&(e.classList.remove(`active`),e.style.display=`none`)}async function qa(){try{let e=await fetch(`/cgi-bin/ssl`);if(!e.ok)return;let t=await e.json();if(t&&t.status===`ok`){let e=document.getElementById(`sslActiveCertDesc`),n=document.getElementById(`sslActiveCertBadge`),r=document.getElementById(`sslSanList`),i=document.getElementById(`sslDuckDnsBadge`),a=document.getElementById(`duckdnsSubdomain`);e&&(e.innerHTML=t.is_lets_encrypt?`Domain: <strong>${t.custom_config&&t.custom_config.domain?t.custom_config.domain:`duckdns.org`}</strong> &bull; Issuer: <strong>Let's Encrypt Public Authority</strong> &bull; Valid to: ${t.expires||`90 days`}`:`Domain: <strong>maxnet.local</strong> &bull; Issuer: <strong>MAXNET Root CA</strong> &bull; Valid to: ${t.expires||`2029`}`),n&&(t.is_lets_encrypt?(n.textContent=`PUBLIC GREEN LOCK`,n.className=`card-badge emerald`):(n.textContent=`VALID TLS 1.3`,n.className=`card-badge emerald`)),r&&t.san&&(r.textContent=t.san.replace(/DNS:|IPAddress:/g,``).replace(/,/g,` • `)),t.custom_config&&t.custom_config.subdomain&&a&&!a.value&&(a.value=t.custom_config.subdomain),i&&t.is_lets_encrypt&&(i.textContent=`ACTIVE & TRUSTED`,i.style.background=`rgba(16,185,129,0.15)`,i.style.color=`#10b981`)}}catch(e){console.warn(`Failed to load SSL certificate status:`,e)}}async function Ja(){let e=document.getElementById(`duckdnsSubdomain`),t=document.getElementById(`duckdnsToken`),n=document.getElementById(`duckdnsStatusMsg`),r=document.getElementById(`btnIssueDuckDns`),i=(e?e.value:``).trim().toLowerCase(),a=(t?t.value:``).trim();if(!i)typeof Q==`function`&&Q(`Please enter a DuckDNS subdomain name`,`error`),e&&e.focus();else if(!a)typeof Q==`function`&&Q(`Please enter your DuckDNS Token`,`error`),t&&t.focus();else{r&&(r.disabled=!0,r.textContent=`ISSUING CERTIFICATE...`,r.style.opacity=`0.7`),n&&(n.style.color=`#38bdf8`,n.textContent=`Performing ACME DNS-01 challenge for ${i}.duckdns.org via DuckDNS API (takes ~20-40s)...`),typeof Q==`function`&&Q(`Starting automated Let's Encrypt issuance...`,`info`);try{let e=await(await fetch(`/cgi-bin/ssl`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`issue_duckdns`,subdomain:i,token:a})})).json();if(e&&e.status===`ok`)n&&(n.style.color=`#10b981`,n.textContent=`Certificate issued successfully! You can now open https://${e.domain}/ with full Green Padlock!`),typeof Q==`function`&&Q(`Public Green Padlock issued for ${e.domain}!`,`success`),qa();else{let t=e&&e.error?e.error:`Issuance failed. Check subdomain and token.`;n&&(n.style.color=`#ef4444`,n.textContent=`Error: ${t}`),typeof Q==`function`&&Q(t,`error`)}}catch{n&&(n.style.color=`#ef4444`,n.textContent=`Connection error communicating with router ACME daemon.`),typeof Q==`function`&&Q(`ACME request timed out or network error`,`error`)}finally{r&&(r.disabled=!1,r.textContent=`OBTAIN GREEN PADLOCK SSL`,r.style.opacity=`1`)}}}async function Ya(){if(!(`Notification`in window))typeof Q==`function`&&Q(`Browser Web Push not supported on this browser`,`error`);else if(Notification.permission===`granted`)typeof Q==`function`&&Q(`Browser push notifications are already enabled`,`info`),new Notification(`MAXNET Gateway`,{body:`Web Push alerts are actively monitoring your router health and security.`,icon:`/favicon.ico`}),Xa();else{try{await Notification.requestPermission()===`granted`?(typeof Q==`function`&&Q(`Browser Web Push alerts activated!`,`success`),new Notification(`MAXNET Gateway`,{body:`Push alerts enabled. You will receive notifications on critical events.`,icon:`/favicon.ico`})):typeof Q==`function`&&Q(`Web Push notification permission was denied`,`warning`)}catch(e){console.error(`Notification permission error`,e)}Xa()}}function Xa(){let e=document.getElementById(`btnTogglePushNotifications`);e&&(`Notification`in window?Notification.permission===`granted`?(e.textContent=`PUSH ACTIVE`,e.style.color=`#10b981`,e.style.borderColor=`rgba(16,185,129,0.4)`):Notification.permission===`denied`?(e.textContent=`PERMISSION BLOCKED`,e.style.color=`#ef4444`):(e.textContent=`ENABLE PUSH`,e.style.color=`#38bdf8`):(e.textContent=`NOT SUPPORTED`,e.disabled=!0))}async function Za(){let e=document.getElementById(`notificationsListPageContainer`),t=document.getElementById(`notifStatusSummary`),n=document.getElementById(`notifActiveBadge`);if(e)try{let r=await(await fetch(`/cgi-bin/webhooks?action=get_notifications`)).json();if(!Array.isArray(r)||r.length===0){e.innerHTML=`
            <div style="font-size:12px; color:var(--text-dim); font-family:var(--font-mono); padding:24px; text-align:center; background:rgba(255,255,255,0.02); border-radius:8px;">
              No notifications recorded. All network services and hardware are operational.
            </div>
          `,t&&(t.textContent=`0 Alerts • All systems optimal`),n&&(n.textContent=`0 ALERTS`,n.className=`card-badge emerald`),Ua(0);return}t&&(t.textContent=`${r.length} Alerts Recorded`),n&&(n.textContent=`${r.length} ALERTS`,n.className=r.some(e=>e.level===`danger`)?`card-badge ruby`:`card-badge amber`),Ua(r.length),e.innerHTML=r.map(e=>{let t=`#38bdf8`,n=`sky`;e.level===`danger`?(t=`#ef4444`,n=`ruby`):e.level===`warning`?(t=`#f59e0b`,n=`amber`):(e.level===`healthy`||e.level===`success`)&&(t=`#10b981`,n=`emerald`);let r=``;return e.event_type===`cpu_spike`?r=`<button type="button" class="mh-btn btn-sm btn-ghost" onclick="openSettingPage('acc-sys-info')" style="font-size:10px; padding:3px 8px;">VIEW CPU STATS</button>`:e.event_type===`new_device`?r=`<button type="button" class="mh-btn btn-sm btn-ghost" onclick="openSettingPage('acc-lan-clients')" style="font-size:10px; padding:3px 8px;">VIEW CLIENTS</button>`:e.event_type===`wan_disconnect`?r=`<button type="button" class="mh-btn btn-sm btn-ghost" onclick="openSettingPage('acc-pppoe')" style="font-size:10px; padding:3px 8px;">CHECK PPPOE</button>`:e.event_type===`system_update`&&(r=`<button type="button" class="mh-btn btn-sm" onclick="openSettingPage('acc-maintenance')" style="font-size:10px; padding:3px 8px; background:#0ea5e9; color:#fff; font-weight:700;">UPDATE OS</button>`),`
            <div class="notif-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:12px 14px; display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
              <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span style="width:7px; height:7px; border-radius:50%; background:${t}; display:inline-block; flex-shrink:0; box-shadow:0 0 6px ${t};"></span>
                  <span class="card-badge ${n}" style="font-size:9px; font-weight:800;">${$(e.level||`INFO`).toUpperCase()}</span>
                  <span style="font-size:12.5px; font-weight:700; color:var(--text-main);">${$(e.title||``)}</span>
                  <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-left:auto;">${$(e.timestamp||``)}</span>
                </div>
                <div style="font-size:11.5px; color:var(--text-dim); line-height:1.4;">${$(e.message||``)}</div>
                ${r?`<div style="margin-top:6px;">${r}</div>`:``}
              </div>
              <button type="button" class="round-action-btn" title="Delete notification" onclick="deleteNotification('${$(e.id)}')" style="color:#ef4444; flex-shrink:0;">
                <svg viewBox="0 0 24 24" style="width:13px; height:13px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          `}).join(``)}catch(e){console.warn(`loadNotificationsPage error:`,e)}}async function Qa(e){try{await fetch(`/cgi-bin/webhooks?action=delete_notification&id=${encodeURIComponent(e)}`),typeof Q==`function`&&Q(`Notification deleted`,`info`),Za()}catch{}}async function $a(){try{await fetch(`/cgi-bin/webhooks?action=clear_notifications`),typeof Q==`function`&&Q(`All notifications cleared`,`info`),Za()}catch{}}async function eo(){typeof Q==`function`&&Q(`Sending manual test alert...`,`info`),await to({title:`Manual System Test Alert`,message:`Manual notification dispatched from settings console to verify UI list and external webhooks.`,level:`info`,event_type:`system`}),typeof Q==`function`&&Q(`Test alert dispatched & logged`,`success`)}async function to(e){try{await fetch(`/cgi-bin/webhooks?action=dispatch`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),Za()}catch{}}function no(e){if(!e)return;let t=e.router||{},n=Array.isArray(e.clients)?e.clients:[],r=t.cpu_pct||0;if(r>85){let e=Date.now();(!window._lastCpuAlertTime||e-window._lastCpuAlertTime>6e5)&&(window._lastCpuAlertTime=e,to({title:`CPU Utilization Spike (${r}%)`,message:`Router SoC processor utilization reached ${r}%. High network throughput or thread activity detected.`,level:`danger`,event_type:`cpu_spike`}))}if(window._cachedPppoeData&&window._cachedPppoeData.client&&window._cachedPppoeData.client.enabled){let e=window._cachedPppoeData.client,t=e.status===`connected`||e.ip&&e.ip!==`--`;window._lastPppoeUpState===!0&&!t&&to({title:`PPPoE Connection Alert`,message:`PPPoE broadband session disconnected or carrier authentication failed. Retrying dialer.`,level:`danger`,event_type:`wan_disconnect`}),window._lastPppoeUpState=t}let i=window._knownClientMacs;if(!i){try{i=new Set(JSON.parse(localStorage.getItem(`maxnet_known_macs`)||`[]`))}catch{i=new Set}window._knownClientMacs=i}let a=i.size===0;n.forEach(e=>{e.mac&&!i.has(e.mac)&&(i.add(e.mac),!a&&!e.is_self&&to({title:`New Device Connected: ${e.name||e.ip}`,message:`Device with IP ${e.ip} (MAC: ${e.mac}) joined the network on interface ${e.interface||`LAN`}.`,level:`info`,event_type:`new_device`}))});try{localStorage.setItem(`maxnet_known_macs`,JSON.stringify([...i]))}catch{}let o=window._cachedWebhooksConfig&&window._cachedWebhooksConfig.data_quota_mb||1024,s=o*1024*1024,c=window._notifiedClientDataQuota;if(!c){try{c=new Set(JSON.parse(localStorage.getItem(`maxnet_notified_data_quota`)||`[]`))}catch{c=new Set}window._notifiedClientDataQuota=c}if(window._isFirstDataScan===void 0){window._isFirstDataScan=!0,n.forEach(e=>{e.mac&&c.add(e.mac)});try{localStorage.setItem(`maxnet_notified_data_quota`,JSON.stringify([...c]))}catch{}}else n.forEach(e=>{let t=e.total_bytes||(e.rx_bytes||0)+(e.tx_bytes||0)||((e.rx_mb||0)+(e.tx_mb||0))*1048576;if(t>=s&&e.mac&&!c.has(e.mac)){c.add(e.mac);try{localStorage.setItem(`maxnet_notified_data_quota`,JSON.stringify([...c]))}catch{}to({title:`Data Quota Alert: ${e.name||e.ip}`,message:`Client device ${e.name||`Device`} (${e.ip}, MAC: ${e.mac}) has consumed ${R(t)}, exceeding the ${o} MB quota limit.`,level:`warning`,event_type:`data_usage`})}});let l=e.network&&Array.isArray(e.network.ports)?e.network.ports:[];window._lastPortStates?l.forEach(e=>{let t=window._lastPortStates[e.id];t&&t!==e.status&&(window._lastPortStates[e.id]=e.status,e.status===`up`?to({title:`Ethernet Cable Plugged: ${e.id.toUpperCase()}`,message:`Physical network link established on port ${e.id.toUpperCase()} at ${e.speed||1e3} Mbps (${e.duplex||`Full`} Duplex).`,level:`info`,event_type:`lan_plugged`}):to({title:`Ethernet Cable Unplugged: ${e.id.toUpperCase()}`,message:`Physical link disconnected on port ${e.id.toUpperCase()}. Network cable removed or remote device powered down.`,level:`warning`,event_type:`lan_plugged`}))}):(window._lastPortStates={},l.forEach(e=>{window._lastPortStates[e.id]=e.status}));let u=Array.isArray(e.usb_devices)?e.usb_devices:Array.isArray(e.adb_devices)?e.adb_devices:[],d=new Set(u.map(e=>e.serial||e.product||e.id||e.name).filter(Boolean));window._lastUsbDeviceIds&&(u.forEach(e=>{let t=e.serial||e.product||e.id||e.name;t&&!window._lastUsbDeviceIds.has(t)&&to({title:`USB Device Connected: ${e.product||e.name||`USB Modem`}`,message:`New USB hardware plugged into router: ${e.manufacturer||``} ${e.product||e.name||`Device`} (${t}).`,level:`info`,event_type:`usb_plugged`})}),window._lastUsbDeviceIds.forEach(e=>{d.has(e)||to({title:`USB Device Disconnected`,message:`USB device (${e}) was removed or unplugged from the router.`,level:`warning`,event_type:`usb_plugged`})})),window._lastUsbDeviceIds=d;let f=t.uptime_seconds||0;window._lastRecordedUptime!==void 0&&f<180&&window._lastRecordedUptime>300&&to({title:`Router Reboot & Power Event`,message:`MAXNET Gateway router has rebooted or recovered from power interruption. Current uptime: ${t.uptime||`1 minute`}.`,level:`warning`,event_type:`power_event`}),window._lastRecordedUptime=f;let p=window._cachedWebhooksConfig&&window._cachedWebhooksConfig.custom_ip_target||`10.0.0.2`,m=n.some(e=>e.ip===p)||e.network&&(e.network.gateway_ip===p||e.network.dns_ip===p);window._lastWatchdogState!==void 0&&window._lastWatchdogIp===p?window._lastWatchdogState!==m&&(window._lastWatchdogState=m,to(m?{title:`Monitored Host Online: ${p}`,message:`Monitored host device (${p}) is back online and responding on the network.`,level:`info`,event_type:`custom_ip`}:{title:`Monitored Host Offline: ${p}`,message:`Monitored host device (${p}) has gone OFFLINE or stopped responding.`,level:`danger`,event_type:`custom_ip`})):(window._lastWatchdogState=m,window._lastWatchdogIp=p);let h=[`pornhub`,`xvideos`,`xnxx`,`xhamster`,`chaturbate`,`stripchat`,`redtube`,`youporn`,`spankbang`,`livejasmin`,`onlyfans`,`cam4`,`brazzers`,`beeg`];window._notifiedAdultEvents=window._notifiedAdultEvents||new Set,(Array.isArray(e.dns_queries)||Array.isArray(e.conntrack_flows))&&(e.dns_queries||e.conntrack_flows||[]).forEach(e=>{let t=(e.domain||e.host||``).toLowerCase(),n=e.client_ip||e.src||`10.0.0.x`;h.find(e=>t.includes(e))&&!window._notifiedAdultEvents.has(t+n)&&(window._notifiedAdultEvents.add(t+n),to({title:`18+ Adult Content Visit Detected`,message:`Client device at ${n} attempted to access adult/restricted website (${t}). Gateway security notification dispatched.`,level:`danger`,event_type:`adult_content`}))})}async function ro(){try{let e=await(await fetch(`/cgi-bin/update`)).json();if(e&&e.status===`update_available`){let t=`update_b`+(e.latest_build||`new`);window._notifiedUpdates&&window._notifiedUpdates.has(t)||(window._notifiedUpdates=window._notifiedUpdates||new Set,window._notifiedUpdates.add(t),to({id:t,title:`MAXNET OS Update Available (${e.latest})`,message:`New firmware build ${e.latest_build} is ready for installation (Current: ${e.current}). Tap to review & install.`,level:`info`,event_type:`system_update`}))}}catch{}}window._cachedWebhooksConfig=window._cachedWebhooksConfig||{};async function io(){try{let e=await(await fetch(`/cgi-bin/webhooks?action=get`)).json();if(e){window._cachedWebhooksConfig=e;let t=document.getElementById(`webhookMasterToggle`);t&&(t.checked=e.master_enabled!==!1);let n=e.telegram||{},r=document.getElementById(`tgEnableToggle`);r&&(r.checked=!!n.enabled);let i=document.getElementById(`dispTgStatusSub`);i&&(i.textContent=n.enabled?`Active • Forwarding to Telegram`:`Disabled • Forward alerts to Telegram chat`);let a=document.getElementById(`disp_webhook_tg_token`);a&&(a.textContent=n.bot_token?`${n.bot_token.substring(0,10)}••••••••`:`Click to configure Bot Token from @BotFather`);let o=document.getElementById(`disp_webhook_tg_chat_id`);o&&(o.textContent=n.chat_id?`Chat ID: ${n.chat_id}`:`Click to configure Chat or Channel ID`);let s=e.discord||{},c=document.getElementById(`discordEnableToggle`);c&&(c.checked=!!s.enabled);let l=document.getElementById(`dispDiscordStatusSub`);l&&(l.textContent=s.enabled?`Active • Forwarding to Discord`:`Disabled • Post alerts to Discord channel`);let u=document.getElementById(`disp_webhook_discord_url`);u&&(u.textContent=s.webhook_url?`${s.webhook_url.substring(0,35)}...`:`Click to configure Discord Webhook URL`);let d=e.ntfy||{},f=document.getElementById(`ntfyEnableToggle`);f&&(f.checked=!!d.enabled);let p=document.getElementById(`dispNtfyStatusSub`);p&&(p.textContent=d.enabled?`Active • Pushing to ntfy.sh`:`Disabled • Mobile push notifications`);let m=document.getElementById(`disp_webhook_ntfy_url`);m&&(m.textContent=d.topic_url||`https://ntfy.sh/maxnet-alerts`);let h=e.events||{},g=document.getElementById(`evCpuToggle`);g&&(g.checked=h.cpu_spike!==!1);let _=document.getElementById(`evDeviceToggle`);_&&(_.checked=h.new_device!==!1);let v=document.getElementById(`evWanToggle`);v&&(v.checked=h.wan_disconnect!==!1);let y=document.getElementById(`evDhcpToggle`);y&&(y.checked=h.dhcp_error!==!1);let b=document.getElementById(`evUpdateToggle`);b&&(b.checked=h.system_update!==!1);let x=document.getElementById(`evSecurityToggle`);x&&(x.checked=h.security_alert!==!1);let S=document.getElementById(`evRouterLoginToggle`);S&&(S.checked=h.router_login!==!1);let C=document.getElementById(`evDataUsageToggle`);C&&(C.checked=h.data_usage!==!1);let w=document.getElementById(`evLanPlugToggle`);w&&(w.checked=h.lan_plugged!==!1);let T=document.getElementById(`evUsbPlugToggle`);T&&(T.checked=h.usb_plugged!==!1);let E=document.getElementById(`evPowerToggle`);E&&(E.checked=h.power_event!==!1);let D=document.getElementById(`evCustomIpToggle`);D&&(D.checked=h.custom_ip!==!1);let O=document.getElementById(`evAdultToggle`);O&&(O.checked=h.adult_content!==!1);let k=document.getElementById(`evWifiToggle`);k&&(k.checked=h.wifi_event!==!1);let A=document.getElementById(`disp_webhook_data_quota`);A&&(A.textContent=`${e.data_quota_mb||1024} MB (${((e.data_quota_mb||1024)/1024).toFixed(1)} GB)`);let j=document.getElementById(`disp_webhook_custom_ip`);j&&(j.textContent=e.custom_ip_target||`10.0.0.2`)}}catch(e){console.warn(`loadWebhooksConfig error:`,e)}}async function ao(){let e=window._cachedWebhooksConfig||{};e.master_enabled=!!document.getElementById(`webhookMasterToggle`)?.checked,e.telegram=e.telegram||{},e.telegram.enabled=!!document.getElementById(`tgEnableToggle`)?.checked,e.discord=e.discord||{},e.discord.enabled=!!document.getElementById(`discordEnableToggle`)?.checked,e.ntfy=e.ntfy||{},e.ntfy.enabled=!!document.getElementById(`ntfyEnableToggle`)?.checked,e.events=e.events||{},e.events.cpu_spike=!!document.getElementById(`evCpuToggle`)?.checked,e.events.new_device=!!document.getElementById(`evDeviceToggle`)?.checked,e.events.wan_disconnect=!!document.getElementById(`evWanToggle`)?.checked,e.events.dhcp_error=!!document.getElementById(`evDhcpToggle`)?.checked,e.events.system_update=!!document.getElementById(`evUpdateToggle`)?.checked,e.events.security_alert=!!document.getElementById(`evSecurityToggle`)?.checked,e.events.router_login=!!document.getElementById(`evRouterLoginToggle`)?.checked,e.events.data_usage=!!document.getElementById(`evDataUsageToggle`)?.checked,e.events.lan_plugged=!!document.getElementById(`evLanPlugToggle`)?.checked,e.events.usb_plugged=!!document.getElementById(`evUsbPlugToggle`)?.checked,e.events.power_event=!!document.getElementById(`evPowerToggle`)?.checked,e.events.custom_ip=!!document.getElementById(`evCustomIpToggle`)?.checked,e.events.adult_content=!!document.getElementById(`evAdultToggle`)?.checked,e.events.wifi_event=!!document.getElementById(`evWifiToggle`)?.checked,e.data_quota_mb=e.data_quota_mb||1024,e.custom_ip_target=e.custom_ip_target||`10.0.0.2`;try{await fetch(`/cgi-bin/webhooks?action=set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),io()}catch{}}async function oo(e,t){t&&t.classList.add(`rotating`),typeof Q==`function`&&Q(`Testing ${e} connection...`,`info`);try{let t=await(await fetch(`/cgi-bin/webhooks?action=test&provider=${e}`)).json();t&&t.status===`ok`?typeof Q==`function`&&Q(t.message||`${e} test successful!`,`success`):typeof Q==`function`&&Q(t.message||`${e} test failed`,`error`)}catch(e){typeof Q==`function`&&Q(`Error: ${e.message}`,`error`)}finally{t&&setTimeout(()=>t.classList.remove(`rotating`),600)}}var so=`system`,co=``,lo=null,uo=``,fo=null;async function po(e=so,t=co){so=e,co=t;let n=document.getElementById(`logConsoleOutput`),r=document.getElementById(`logViewerLinesBadge`);try{let n=await(await fetch(`/cgi-bin/logs?type=${encodeURIComponent(e)}&filter=${encodeURIComponent(t)}&lines=250`)).json();uo=n.raw||``,r&&(r.textContent=`${n.total_lines||0} LINES`),mo(uo)}catch(e){n&&(n.textContent=`Error connecting to log stream: `+e.message)}}function mo(e){let t=document.getElementById(`logConsoleOutput`);t&&(t.innerHTML=!e||e.trim()===``?`<span style="color:var(--text-dim);">No log records matching filter.</span>`:e.split(`
`).map(e=>{let t=$(e);return/(\.err|\.crit|\.alert|\.emerg|failed|error|fatal|drop)/i.test(e)?`<span style="color:#ef4444; font-weight:600;">${t}</span>`:/(\.warn|warning|retry)/i.test(e)?`<span style="color:#f59e0b;">${t}</span>`:/(\.notice|dhcpack|dhcprequest|registered|link up|up)/i.test(e)?`<span style="color:#10b981;">${t}</span>`:/(\.info|dnsmasq)/i.test(e)?`<span style="color:#38bdf8;">${t}</span>`:`<span style="color:#a1a1aa;">${t}</span>`}).join(`
`))}function ho(e){so=e;let t=document.getElementById(`logTabSystem`),n=document.getElementById(`logTabKernel`);t&&n&&(e===`system`?(t.classList.add(`active`),n.classList.remove(`active`)):(t.classList.remove(`active`),n.classList.add(`active`))),po(so,co)}function go(e){fo&&clearTimeout(fo),fo=setTimeout(()=>{po(so,e.trim())},350)}function _o(){po(so,co)}function vo(e){lo&&(clearInterval(lo),lo=null),e&&(lo=setInterval(()=>{po(so,co)},3e3))}function yo(){lo&&(clearInterval(lo),lo=null);let e=document.getElementById(`logViewerAutoRefresh`);e&&(e.checked=!1)}function bo(){if(!uo){alert(`Log buffer is currently empty.`);return}let e=new Blob([uo],{type:`text/plain;charset=utf-8`}),t=document.createElement(`a`);t.href=URL.createObjectURL(e),t.download=`maxnet-${so}-log-${Date.now()}.txt`,document.body.appendChild(t),t.click(),document.body.removeChild(t)}var xo=`installed`,So=[],Co=[],wo=null;async function To(e=``){let t=document.getElementById(`pkgListContainer`),n=document.getElementById(`pkgManagerBadge`),r=document.getElementById(`pkgCountBadge`);if(xo===`installed`)try{So=(await(await fetch(`/cgi-bin/packages?action=list`)).json()).packages||[],n&&(n.textContent=`${So.length} INSTALLED`),r&&(r.textContent=`${So.length} PKGS`),Eo(So,e)}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:20px; text-align:center; font-family:var(--font-mono); font-size:12px;">Failed to load package list: ${$(e.message)}</div>`)}else{if(!e||e.trim().length===0){t&&(t.innerHTML=`<div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">Type package name above to search 11,000+ repository packages (e.g. htop, nano, tcpdump, nginx)...</div>`);return}t&&(t.innerHTML=`<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">Searching official OpenWrt package feeds...</div>`);try{Co=(await(await fetch(`/cgi-bin/packages?action=search&query=${encodeURIComponent(e.trim())}`)).json()).packages||[],Eo(Co)}catch(e){t&&(t.innerHTML=`<div style="color:#ef4444; padding:20px; text-align:center; font-family:var(--font-mono); font-size:12px;">Package search error: ${$(e.message)}</div>`)}}}function Eo(e=[],t=``){let n=document.getElementById(`pkgListContainer`);if(!n)return;let r=e;if(t&&xo===`installed`){let n=t.toLowerCase();r=e.filter(e=>e.name.toLowerCase().includes(n)||e.feed&&e.feed.toLowerCase().includes(n))}n.innerHTML=r.length===0?`<div style="text-align:center; padding:25px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No packages found.</div>`:r.slice(0,200).map(e=>`
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
      `).join(``)}function Do(e){xo=e;let t=document.getElementById(`pkgTabInstalled`),n=document.getElementById(`pkgTabAvailable`),r=document.getElementById(`pkgSearchInput`);t&&n&&(e===`installed`?(t.classList.add(`active`),n.classList.remove(`active`),r&&(r.placeholder=`Filter installed packages...`),Eo(So,r?r.value:``)):(t.classList.remove(`active`),n.classList.add(`active`),r&&(r.placeholder=`Search 11,000+ packages in online repository...`,r.focus(),To(r.value))))}function Oo(e){wo&&clearTimeout(wo),wo=setTimeout(()=>{xo===`installed`?Eo(So,e):To(e)},400)}async function ko(){let e=document.getElementById(`btnUpdatePkgs`);e&&(e.disabled=!0,e.textContent=`UPDATING CACHE...`);try{let e=await(await fetch(`/cgi-bin/packages?action=update`)).json();alert(e.message||(e.status===`ok`?`Package repositories updated successfully!`:`Update failed.`)),await To()}catch(e){alert(`Repository update failed: `+e.message)}finally{e&&(e.disabled=!1,e.textContent=`UPDATE REPOSITORIES`)}}async function Ao(e){if(!e||!confirm(`Install package "${e}" on router gateway?`))return;let t=document.getElementById(`pkgListContainer`);t&&(t.innerHTML=`<div style="text-align:center; padding:30px; color:#38bdf8; font-size:12px; font-family:var(--font-mono);">Installing "${$(e)}" via APK package manager... Please wait.</div>`);try{let t=await(await fetch(`/cgi-bin/packages?action=install&package=${encodeURIComponent(e)}`)).json();alert(t.message||(t.status===`ok`?`Package "${e}" installed successfully!`:`Installation failed.`)),await To()}catch(e){alert(`Install error: `+e.message),await To()}}async function jo(){let e=document.getElementById(`pkgDirectInstallInput`);if(!e||!e.value.trim())return;let t=e.value.trim();e.value=``,await Ao(t)}async function Mo(e){if(!e||!confirm(`Are you sure you want to uninstall "${e}" and remove it from router flash memory?`))return;let t=document.getElementById(`pkgListContainer`);t&&(t.innerHTML=`<div style="text-align:center; padding:30px; color:#ef4444; font-size:12px; font-family:var(--font-mono);">Removing "${$(e)}"... Please wait.</div>`);try{let t=await(await fetch(`/cgi-bin/packages?action=remove&package=${encodeURIComponent(e)}`)).json();alert(t.message||(t.status===`ok`?`Package "${e}" uninstalled successfully!`:`Removal failed.`)),await To()}catch(e){alert(`Uninstall error: `+e.message),await To()}}var X=null,No=null,Z=null,Po=!1;function Fo(){let e=window.innerWidth;return e<=400?7:e<=520?7.5:e<=768?8.5:e<=1024?10:11.5}function Io(e){return e?{background:`rgba(0, 0, 0, 0)`,foreground:`#f4f4f5`,cursor:`#10b981`,cursorAccent:`#000000`,selectionBackground:`rgba(56, 189, 248, 0.4)`,black:`#27272a`,red:`#ef4444`,green:`#10b981`,yellow:`#f59e0b`,blue:`#60a5fa`,magenta:`#c084fc`,cyan:`#38bdf8`,white:`#f4f4f5`,brightBlack:`#a1a1aa`,brightRed:`#f87171`,brightGreen:`#34d399`,brightYellow:`#fbbf24`,brightBlue:`#93c5fd`,brightMagenta:`#d8b4fe`,brightCyan:`#67e8f9`,brightWhite:`#ffffff`}:{background:`rgba(0, 0, 0, 0)`,foreground:`#000000`,cursor:`#000000`,cursorAccent:`#ffffff`,selectionBackground:`rgba(56, 189, 248, 0.35)`,black:`#000000`,red:`#b91c1c`,green:`#047857`,yellow:`#b45309`,blue:`#1d4ed8`,magenta:`#7e22ce`,cyan:`#0e7490`,white:`#18181b`,brightBlack:`#27272a`,brightRed:`#dc2626`,brightGreen:`#059669`,brightYellow:`#d97706`,brightBlue:`#2563eb`,brightMagenta:`#9333ea`,brightCyan:`#0891b2`,brightWhite:`#000000`}}function Lo(){if(!X)return;let e=i!==void 0&&i===`dark`||document.documentElement.getAttribute(`data-theme`)!==`light`;X.options.theme=Io(e),X.options.fontWeight=e?`500`:`600`;try{X.refresh(0,X.rows-1)}catch{}}function Ro(e,t){return new Promise((n,r)=>{let i=document.createElement(e);Object.assign(i,t),i.onload=()=>n(i),i.onerror=()=>r(Error(`Failed to load ${t.src||t.href}`)),document.head.appendChild(i)})}var zo=null;async function Bo(){return typeof Terminal<`u`&&typeof FitAddon<`u`||zo||(zo=(async()=>(document.querySelector(`link[href*="xterm.css"]`)||await Ro(`link`,{rel:`stylesheet`,href:`/js/xterm/xterm.css`}),typeof Terminal>`u`&&await Ro(`script`,{src:`/js/xterm/xterm.js`}),typeof FitAddon>`u`&&await Ro(`script`,{src:`/js/xterm/xterm-addon-fit.js`}),!0))(),zo)}async function Vo(){let e=document.getElementById(`terminalContainer`);if(!e)return;if(document.body.classList.add(`terminal-active`),X){if(Po||(X.options.fontSize=Fo()),Lo(),No)try{No.fit()}catch{}setTimeout(()=>{try{X.focus()}catch{}},100);return}if(typeof Terminal>`u`||typeof FitAddon>`u`){e.innerHTML=`
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:220px;gap:12px;color:var(--text-sub);font-family:var(--font-mono);font-size:12px;">
            <div class="m-spinner" style="width:28px;height:28px;border-width:2.5px;"></div>
            <span>Loading Root Terminal Engine...</span>
          </div>`;try{await Bo()}catch{e.innerHTML=`<div style="padding:14px; color:#ef4444; font-family:var(--font-mono); font-size:12px;">Failed to load terminal engine. Check network connection.</div>`;return}}let t=i!==void 0&&i===`dark`||document.documentElement.getAttribute(`data-theme`)!==`light`,n=Fo();X=new Terminal({allowTransparency:!0,cursorBlink:!0,fontSize:n,lineHeight:1.18,fontWeight:t?`500`:`600`,fontWeightBold:`700`,fontFamily:`Consolas, "Liberation Mono", Menlo, Courier, monospace`,theme:Io(t)}),typeof FitAddon<`u`&&FitAddon.FitAddon&&(No=new FitAddon.FitAddon,X.loadAddon(No)),e.innerHTML=``,X.open(e);let r=0,a=n;e.addEventListener(`touchstart`,e=>{e.touches.length===2&&(r=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),a=X.options.fontSize||Fo())},{passive:!0}),e.addEventListener(`touchmove`,e=>{if(e.touches.length===2&&r>0){let t=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)/r,n=Math.round(a*t*2)/2;if(n=Math.max(6,Math.min(18,n)),X.options.fontSize!==n&&(Po=!0,X.options.fontSize=n,No&&(No.fit(),Z&&Z.readyState===WebSocket.OPEN))){let e=new TextEncoder().encode(`1`+JSON.stringify({columns:X.cols,rows:X.rows}));Z.send(e)}}},{passive:!0}),setTimeout(()=>{if(No)try{No.fit()}catch{}try{X.focus()}catch{}},50),Ho(),window.addEventListener(`resize`,()=>{if(No&&X)try{if(Po||(X.options.fontSize=Fo()),No.fit(),Z&&Z.readyState===WebSocket.OPEN){let e=new TextEncoder().encode(`1`+JSON.stringify({columns:X.cols,rows:X.rows}));Z.send(e)}}catch{}})}function Ho(){if(Z&&Z.readyState===WebSocket.OPEN)return;let e=`${window.location.protocol===`https:`?`wss:`:`ws:`}//${window.location.hostname}:7681/ws`;try{Z=new WebSocket(e,[`tty`]),Z.binaryType=`arraybuffer`,Z.onopen=()=>{if(Z.send(new TextEncoder().encode(JSON.stringify({AuthToken:``}))),X){let e=X.cols||80,t=X.rows||24,n=new TextEncoder().encode(`1`+JSON.stringify({columns:e,rows:t}));Z.send(n)}},Z.onmessage=e=>{let t=new Uint8Array(e.data);String.fromCharCode(t[0])===`0`&&X&&X.write(t.slice(1))},Z.onclose=()=>{X&&X.writeln(`\r
\x1B[33m[Session disconnected. Press back or re-open Terminal to reconnect]\x1B[0m`)},Z.onerror=()=>{X&&X.writeln(`\r
\x1B[31m[WebSocket connection to port 7681 failed]\x1B[0m`)},X.onData(e=>{if(Z&&Z.readyState===WebSocket.OPEN){let t=new TextEncoder().encode(e),n=new Uint8Array(1+t.length);n[0]=48,n.set(t,1),Z.send(n)}})}catch(e){X&&X.writeln(`\r
\x1B[31mFailed to establish terminal WebSocket: `+e.message+`\x1B[0m`)}}var Uo=``;function Wo(e){let t=document.getElementById(`tsLoggedOutSettings`),n=document.getElementById(`tsConnectedSettings`);t&&(t.style.display=e?`none`:`block`),n&&(n.style.display=e?`block`:`none`)}function Go(e){Uo=e||``;let t=document.getElementById(`tsWebLoginSub`),n=document.getElementById(`btnTsOpenLink`),r=document.getElementById(`btnTsCopyLink`);e?(t&&(t.innerHTML=`Link ready: <span style="color:#38bdf8; font-family:var(--font-mono); word-break:break-all;">${$(e)}</span>`),n&&(n.href=e,n.style.display=`inline-flex`),r&&(r.style.display=`inline-flex`)):(t&&(t.textContent=`Generate authentication link to sign in via browser`),n&&(n.style.display=`none`),r&&(r.style.display=`none`))}function Ko(e){if(!e)return;let t=e.user||{},n=document.getElementById(`tsUserDisplayName`),r=document.getElementById(`tsUserLoginName`),i=document.getElementById(`tsTailnetDomain`),a=document.getElementById(`tsMeshNodesBadge`),o=document.getElementById(`tsUserAvatarImg`),s=document.getElementById(`tsUserAvatarBlank`),c=e.backend_state===`Running`&&e.online!==!1,l=c&&t&&(t.DisplayName||t.LoginName);Wo(c&&(l||!!e.tailscale_ip)),l?(n&&(n.textContent=t.DisplayName||t.LoginName),r&&(r.textContent=t.LoginName||`Tailscale Operator`)):(n&&(n.textContent=`Not Signed In`),r&&(r.textContent=`Disconnected from tailnet`)),i&&(i.textContent=c&&e.tailnet?e.tailnet:`Disconnected`);let u=c&&e.devices_online||0,d=c&&e.devices_total||0;a&&(a.innerHTML=`<span id="tsOnlineCountBadge">${u} Online</span> / <span id="tsTotalCountBadge">${d} Total</span>`,a.className=c?`setting-status-badge badge-active`:`setting-status-badge badge-disabled`);let f=t.ProfilePicURL||e.profile_pic_url||``;o&&s&&(f&&l?(o.src=f,o.style.display=`block`,s.style.display=`none`):(o.style.display=`none`,s.style.display=`block`))}function qo(e){let t=document.getElementById(`tsDevicesContainer`);if(!t)return;if(!(e&&e.backend_state===`Running`)){t.innerHTML=`<div style="padding:14px; text-align:center; color:var(--text-dim); font-size:11px; font-family:var(--font-mono); background:rgba(255,255,255,0.02); border-radius:8px;">No active mesh devices. Router is not signed in to a tailnet.</div>`;return}let n=e.peers||[];if(n.length===0){t.innerHTML=`
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
        `}),t.innerHTML=r}async function Jo(){try{let e=await(await fetch(`/cgi-bin/tailscale`)).json(),t=document.getElementById(`tsStatusBadge`),n=document.getElementById(`tsIpAddress`),r=e.backend_state||e.BackendState||(e.online?`Running`:`Stopped`),i=r===`Running`,a=i?e.tailscale_ip||e.TailscaleIPs&&e.TailscaleIPs[0]||(e.Self&&e.Self.TailscaleIPs?e.Self.TailscaleIPs[0]:``):``,o=i&&!!a,s=document.getElementById(`tsNotInstalledNotice`);s&&(s.style.display=`none`);let c=document.getElementById(`disp_ts_ip`);o?(t&&(t.className=`card-badge emerald`,t.innerText=`RUNNING`),n&&(n.value=a),c&&(c.textContent=a),Wo(!0)):(t&&(t.className=`card-badge`,t.innerText=r===`NeedsLogin`?`NEEDS LOGIN`:r===`Stopped`?`STOPPED`:`NOT CONNECTED`),n&&(n.value=``),c&&(c.textContent=`Not Connected`),Wo(!1)),document.getElementById(`tsMasterToggle`)&&(document.getElementById(`tsMasterToggle`).checked=r.toLowerCase()===`running`),document.getElementById(`tsShareLan`)&&e.share_lan!==void 0&&(document.getElementById(`tsShareLan`).checked=!!e.share_lan),document.getElementById(`tsExitNode`)&&e.exit_node!==void 0&&(document.getElementById(`tsExitNode`).checked=!!e.exit_node),document.getElementById(`tsAcceptRoutes`)&&e.accept_routes!==void 0&&(document.getElementById(`tsAcceptRoutes`).checked=!!e.accept_routes),document.getElementById(`tsSshMode`)&&e.ssh!==void 0&&(document.getElementById(`tsSshMode`).checked=!!e.ssh),document.getElementById(`tsHostname`)&&e.hostname&&(document.getElementById(`tsHostname`).value=e.hostname),Ko(e),qo(e),o?Go(``):e.auth_url&&Go(e.auth_url)}catch(e){console.error(`fetchTailscale error`,e);let t=document.getElementById(`tsNotInstalledNotice`);t&&(t.style.display=`flex`);let n=document.getElementById(`tsStatusBadge`);n&&(n.className=`card-badge`,n.innerText=`OFFLINE`)}}async function Yo(e){try{await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:e?`up`:`down`})}),setTimeout(Jo,1500)}catch(e){console.error(`toggleTailscaleService error`,e)}}async function Xo(){Q(`Generating Tailscale login link...`,`info`);let e=document.getElementById(`tsWebLoginSub`);e&&(e.textContent=`Initializing daemon login... Generating authentication link...`);try{await(await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`up`})})).json(),setTimeout(Zo,1200)}catch(t){console.error(`startTailscaleWebLogin error`,t),e&&(e.textContent=`Failed to generate link. Click icon to retry.`)}}async function Zo(){try{let e=await(await fetch(`/cgi-bin/tailscale`)).json(),t=e.auth_url||``;if(t)Go(t),Q(`Login URL generated! Click icon to open.`,`success`);else if(e.backend_state===`Running`)Go(``),Wo(!0),Q(`Tailscale connected & running!`,`success`),Jo();else{let e=document.getElementById(`tsWebLoginSub`);e&&(e.textContent=`Initializing daemon login... Please wait 2 seconds.`),setTimeout(Zo,2e3)}}catch(e){console.error(e)}}function Qo(){Uo&&navigator.clipboard.writeText(Uo).then(()=>Q(`Login URL copied to clipboard!`,`success`)).catch(()=>Q(`Failed to copy URL`,`error`))}async function $o(){if(confirm(`Are you sure you want to log out this router from Tailscale?`))try{let e=document.getElementById(`disp_ts_ip`);e&&(e.textContent=`Not Connected`);let t=document.getElementById(`tsStatusBadge`);t&&(t.className=`card-badge`,t.innerText=`NOT CONNECTED`),Ko({backend_state:`Stopped`,online:!1,tailscale_ip:``,user:{},devices_total:0,devices_online:0}),qo({backend_state:`Stopped`,peers:[]}),Go(``),Wo(!1),await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`logout`})}),Q(`Tailscale logged out`,`info`),setTimeout(Jo,1e3)}catch(e){console.error(`logoutTailscale error`,e)}}async function es(){let e=(document.getElementById(`tsAuthKeyInput`).value||``).trim();if(!e)Q(`Please enter a valid Tailscale Auth Key (e.g. tskey-auth-...)`,`error`);else try{await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`up`,authkey:e})}),Q(`Connecting to Tailnet with Auth Key...`,`info`),setTimeout(Jo,3e3)}catch(e){console.error(`loginTailscaleWithKey error`,e)}}async function ts(){try{await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`restart`})}),Q(`Tailscale service restarted.`,`success`),setTimeout(Jo,2e3)}catch(e){console.error(`restartTailscale error`,e)}}async function ns(){let e=!document.getElementById(`tsShareLan`)||document.getElementById(`tsShareLan`).checked,t=document.getElementById(`tsExitNode`)?document.getElementById(`tsExitNode`).checked:!1,n=!document.getElementById(`tsAcceptRoutes`)||document.getElementById(`tsAcceptRoutes`).checked,r=document.getElementById(`tsSshMode`)?document.getElementById(`tsSshMode`).checked:!1,i=document.getElementById(`tsHostname`)&&document.getElementById(`tsHostname`).value||`Maxnet-Gateway`;try{await fetch(`/cgi-bin/tailscale`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set_prefs`,share_lan:e,exit_node:t,accept_routes:n,ssh:r,hostname:i})}),Jo()}catch(e){console.error(`applyTailscalePrefs error`,e)}}async function rs(){try{let e=await(await fetch(`/cgi-bin/smb_config`)).json();if(e.status===`ok`){let t=document.getElementById(`smbUsernameInput`);t&&e.username&&(t.value=e.username);let n=document.getElementById(`smbStatusBadge`);n&&(e.smb_running?(n.className=`card-badge emerald`,n.innerText=`ONLINE (`+(e.mounted?e.device||`MOUNTED`:`READY`)+`)`):(n.className=`card-badge`,n.innerText=`STOPPED`));let r=document.getElementById(`btnToggleSmbSettings`);r&&(r.innerText=e.smb_running?`STOP SMB`:`START SMB`,r.className=e.smb_running?`mh-btn btn-ghost`:`mh-btn`);let i=document.getElementById(`smbDevState`);i&&(i.innerText=e.mounted?e.device||`Mounted`:`No drive mounted`);let a=document.getElementById(`smbTotalSpace`);a&&(a.innerText=e.total_space||`--`);let o=document.getElementById(`smbFreeSpace`);o&&(o.innerText=e.free_space||`--`);let s=document.getElementById(`smbMountPath`);s&&(s.innerText=e.share_path||`/mnt/pendrive`);let c=document.getElementById(`smbDevState`);c&&(c.textContent=e.mounted?`${e.device||`USB Drive`} mounted on ${e.share_path||`/mnt/pendrive`}`:`No external USB disk detected`);let l=document.getElementById(`smbCapacityBadge`);l&&(l.textContent=e.mounted?`${e.total_space||`--`} (${e.free_space||`--`} free)`:`No Storage`);let u=document.getElementById(`smbShareAddressText`);u&&(u.textContent=`smb://${window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||window.location.hostname||`10.0.0.1`}/Pendrive`);let d=document.getElementById(`disp_smb_user_desc`);d&&(d.textContent=`User: ${e.username||`max`} • Click to configure credentials`);let f=document.getElementById(`smbMasterToggle`);f&&(f.checked=!!e.smb_running)}}catch(e){console.error(`fetchSmbConfig error`,e)}}async function is(e){Q(e?`Starting Samba 4 service...`:`Stopping Samba service...`,`info`);try{Q((await(await fetch(`/cgi-bin/smb_config`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`toggle`,enable:!!e})})).json()).message||`Samba state updated`,`success`),rs()}catch(e){Q(`Failed to toggle SMB: `+e.message,`error`)}}async function as(){let e=document.getElementById(`smbUsernameInput`),t=document.getElementById(`smbPasswordInput`),n=document.getElementById(`smbActionStatus`),r=e?e.value.trim():``,i=t?t.value:``;if(!r||!i)n&&(n.style.color=`#ef4444`,n.innerText=`Please specify both username and password`);else{n&&(n.style.color=`var(--text-dim)`,n.innerText=`Saving credentials...`);try{let e=await(await fetch(`/cgi-bin/smb_config`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`set`,username:r,password:i})})).json();n&&(e.status===`ok`?(n.style.color=`#10b981`,n.innerText=e.message||`Credentials saved and Samba restarted`,t&&(t.value=``)):(n.style.color=`#ef4444`,n.innerText=e.message||`Failed to update Samba credentials`)),rs()}catch(e){n&&(n.style.color=`#ef4444`,n.innerText=`Update failed: `+e.message)}}}function os(e){let t=window._lastDataCache&&window._lastDataCache.usb_devices&&window._lastDataCache.usb_devices.find(e=>e.device_type===`storage`||e.device_type===`pendrive`||e.has_storage),n=`smb://${t&&t.virtual_ip||window._lastDataCache&&window._lastDataCache.network&&window._lastDataCache.network.lan_ip||window.location.hostname||`10.0.0.1`}/Pendrive`;navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(n).then(()=>{typeof Q==`function`&&Q(`Copied ${n} to clipboard`,`success`)}).catch(()=>{ss(n)}):ss(n)}function ss(e){try{let t=document.createElement(`textarea`);t.value=e,t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select(),document.execCommand(`copy`),document.body.removeChild(t),typeof Q==`function`&&Q(`Copied ${e} to clipboard`,`success`)}catch{}}function cs(e){P(`settings`),N(`acc-adb-device`);let t=document.getElementById(`adbDeviceDropdown`);t&&t.options.length>0&&hr()}async function ls(){let e=document.getElementById(`oldPasswordInput`).value,t=document.getElementById(`newPasswordInput`).value,n=document.getElementById(`confirmPasswordInput`).value;if(!e||!t)alert(`Please enter both current and new password.`);else if(t!==n)alert(`New password and confirmation do not match.`);else if(t.length<4)alert(`Password must be at least 4 characters long.`);else try{let n=await(await fetch(`/cgi-bin/auth`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`change_password`,user:`root`,old_pass:e,new_pass:t})})).json();n.status===`ok`?(alert(`Root password updated successfully! Please log in with your new credentials.`),y()):alert(`Error updating password: `+(n.message||`Invalid current password.`))}catch(e){alert(`Network request failed: `+e.message)}}function us(){window.location.href=`/cgi-bin/backup`}async function ds(){let e=document.getElementById(`backupFileInput`);if(!e.files||e.files.length===0){alert(`Please choose a .tar.gz backup archive first.`);return}if(!confirm(`CAUTION: Restoring configuration will overwrite custom settings and restart services. Proceed?`))return;let t=e.files[0];try{let e=await(await fetch(`/cgi-bin/restore`,{method:`POST`,body:t})).json();alert(e.message||`Configuration restored successfully. Reloading gateway...`),setTimeout(()=>location.reload(),3e3)}catch(e){alert(`Error restoring backup: `+e.message)}}var fs=null,ps=10;function ms(){let e=document.getElementById(`factoryResetModalOverlay`),t=document.getElementById(`btnConfirmFactoryReset`);e&&t&&(e.style.display=`flex`,requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.classList.add(`active`)})}),ps=10,t.disabled=!0,t.style.cursor=`not-allowed`,t.style.background=`rgba(239,68,68,0.2)`,t.style.color=`rgba(255,255,255,0.4)`,t.textContent=`RESET GATEWAY (${ps}s)`,clearInterval(fs),fs=setInterval(()=>{ps--,ps>0?t.textContent=`RESET GATEWAY (${ps}s)`:(clearInterval(fs),t.disabled=!1,t.style.cursor=`pointer`,t.style.background=`#ef4444`,t.style.color=`#ffffff`,t.textContent=`RESET GATEWAY`)},1e3))}function hs(){clearInterval(fs);let e=document.getElementById(`factoryResetModalOverlay`);e&&(e.classList.remove(`active`),setTimeout(()=>{e.classList.contains(`active`)||(e.style.display=`none`)},220))}async function gs(){if(!(ps>0)){hs(),Q(`Initiating factory reset... Router rebooting`,`warning`,8e3);try{await fetch(`/cgi-bin/restore?action=reset`,{method:`POST`})}catch{}}}function _s(){ms()}function vs(){ms()}async function ys(){try{Q(`Fetching system log...`,`info`);let e=await(await fetch(`/cgi-bin/logs?type=system&lines=1000`)).json(),t=new Blob([e.raw||``],{type:`text/plain;charset=utf-8`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`system_log_${Date.now()}.txt`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n),Q(`System log downloaded!`,`success`)}catch{Q(`Error downloading system log`,`error`)}}async function bs(){try{Q(`Fetching kernel dmesg log...`,`info`);let e=await(await fetch(`/cgi-bin/logs?type=kernel&lines=1000`)).json(),t=new Blob([e.raw||``],{type:`text/plain;charset=utf-8`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`kernel_dmesg_${Date.now()}.txt`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n),Q(`Kernel dmesg downloaded!`,`success`)}catch{Q(`Error downloading kernel log`,`error`)}}function Q(e,t=`info`,n=3e3){let r=document.getElementById(`globalAppToast`);r||(r=document.createElement(`div`),r.id=`globalAppToast`,r.className=`global-app-toast`,document.body.appendChild(r)),r.textContent=e,r.className=`global-app-toast show ${t}`,clearTimeout(r._timer),r._timer=setTimeout(()=>{r.classList.remove(`show`)},n)}var xs=null,Ss=!1;function Cs(e){e&&(xs=e);let t=xs||{},n=document.getElementById(`firmwareFlashModalOverlay`);if(!n)return;let r=document.getElementById(`flashCurrentVer`),i=document.getElementById(`flashLatestVer`),a=document.getElementById(`flashModelName`),o=document.getElementById(`flashFileName`),s=document.getElementById(`flashSha256`);r&&(r.textContent=t.current||`v2.2.7-b7`),i&&(i.textContent=t.latest||t.current||`v2.2.7-b7`),a&&(a.textContent=t.model||`JioRouter AX6000`),o&&(o.textContent=t.file||`sysupgrade.bin`),s&&(s.textContent=t.sha256?`${t.sha256.substring(0,16)}...${t.sha256.substring(t.sha256.length-8)}`:`Verified via Manifest`);let c=document.getElementById(`modalItbDownloadBtn`),l=document.getElementById(`modalTftpCmd`);c&&(c.href=t.itb_url||`#`),l&&(l.textContent=t.tftp_command||`tftpboot 0x46000000 initramfs.itb; bootm 0x46000000`);let u=document.getElementById(`modalRamBootBox`);u&&(u.style.display=`none`);let d=document.getElementById(`flashModalContent`),f=document.getElementById(`flashModalFooter`),p=document.getElementById(`flashProgressState`);d&&(d.style.display=`flex`),f&&(f.style.display=`flex`),p&&(p.style.display=`none`),n.style.display=`flex`,requestAnimationFrame(()=>n.classList.add(`active`))}function ws(){if(Ss){Q(`Firmware flashing in progress. Please do not close.`,`warning`);return}let e=document.getElementById(`firmwareFlashModalOverlay`);e&&(e.classList.remove(`active`),setTimeout(()=>{e.style.display=`none`},200))}async function Ts(e=!1){Ss=!0;let t=document.getElementById(`flashModalContent`),n=document.getElementById(`flashModalFooter`),r=document.getElementById(`flashProgressState`),i=document.getElementById(`flashProgressTitle`),a=document.getElementById(`flashProgressDesc`),o=document.getElementById(`flashProgressBar`),s=document.getElementById(`flashCountdownTimer`);t&&(t.style.display=`none`),n&&(n.style.display=`none`),r&&(r.style.display=`flex`),i&&(i.textContent=e?`Executing Clean Flash & Wipe...`:`Flashing Firmware Update...`),a&&(a.textContent=e?`Erasing old configurations, flashing verified sysupgrade image, and rebooting. Please DO NOT power off router.`:`Preserving current network settings, flashing verified sysupgrade image, and rebooting. Please DO NOT power off router.`);try{u(`/cgi-bin/update?action=`+(e?`flash_clean`:`flash`)).catch(()=>{})}catch{}let c=75,l=15;o&&(o.style.width=`15%`);let d=setInterval(()=>{c--,l=Math.min(92,l+1.1),o&&(o.style.width=`${l}%`),s&&(s.textContent=`Estimated time remaining: ${c}s`),c<=35&&c%3==0&&fetch(`/cgi-bin/status?t=`+Date.now(),{method:`GET`,cache:`no-store`}).then(e=>{e.ok&&(clearInterval(d),o&&(o.style.width=`100%`),i&&(i.textContent=`Gateway Online!`),a&&(a.textContent=`Firmware upgrade complete. Reloading MAXNET interface...`),s&&(s.textContent=`Reconnected successfully!`),setTimeout(()=>{window.location.reload()},2e3))}).catch(()=>{}),c<=0&&(clearInterval(d),o&&(o.style.width=`100%`),i&&(i.textContent=`Rebooting Finished`),a&&(a.textContent=`Reloading dashboard...`),setTimeout(()=>{window.location.reload()},3e3))},1e3)}async function Es(){let e=document.getElementById(`btnCheckUpdate`),t=document.getElementById(`iconCheckUpdate`),n=document.getElementById(`updateStatusPill`),r=document.getElementById(`updateStatusSub`);e&&e.classList.add(`btn-pulse`),t&&t.classList.add(`spinning`),n&&(n.className=`setting-pill pill-cyan`,n.textContent=`CHECKING...`),r&&(r.textContent=`Contacting remote firmware release mirror...`);try{let i=!1,a=null;try{let e=await(await u(`/cgi-bin/update`)).json();e&&e.status===`update_available`?(i=!0,a=e):e&&(a=e)}catch{}setTimeout(()=>{t&&t.classList.remove(`spinning`),e&&e.classList.remove(`btn-pulse`),xs=a;let o=document.getElementById(`fwCurrentVerBadge`),s=document.getElementById(`fwModelVal`),c=document.getElementById(`fwSocVal`);document.getElementById(`fwKernelVal`);let l=document.getElementById(`fwLatestVerVal`),u=document.getElementById(`fwFileVal`),d=document.getElementById(`fwSizeVal`),f=document.getElementById(`fwShaVal`),p=document.getElementById(`fwTftpCmdVal`),m=document.getElementById(`fwItbDownloadLink`),h=document.getElementById(`fwUpdateStatusPill`);if(o&&(o.textContent=a&&a.current||`v2.2.7-b7`),s&&(s.textContent=a&&a.model||`Jio JIDU6911`),c&&(c.textContent=a&&a.soc||`Qualcomm IPQ9574 (AArch64)`),l&&(l.textContent=a&&a.latest||a&&a.current||`v2.2.7-b7`),u&&(u.textContent=a&&a.file||`sysupgrade.bin`),d&&(d.textContent=a&&a.size?(a.size/1048576).toFixed(2)+` MB`:`24.88 MB`),f&&(f.textContent=a&&a.sha256?`${a.sha256.substring(0,16)}...${a.sha256.substring(a.sha256.length-8)}`:`Verified via Release Manifest`),p&&(p.textContent=a&&a.tftp_command||`tftpboot 0x46000000 initramfs.itb; bootm 0x46000000`),m&&a&&a.itb_url&&(m.href=a.itb_url),i&&a){let t=a.latest||`v2.2.7`,i=a.model||`JioRouter AX6000`;n&&(n.className=`setting-pill pill-amber`,n.textContent=`UPDATE: ${t}`),r&&(r.innerHTML=`<span style="color:#f59e0b; font-weight:700;">Update ${$(t)} ready</span> &bull; ${$(i)}`),h&&(h.className=`setting-pill pill-amber`,h.textContent=`UPDATE AVAILABLE`),e&&(e.className=`round-action-btn btn-flash-ready`,e.title=`Install Firmware Update (${t})`,e.onclick=()=>Cs(a),e.innerHTML=`<svg viewBox="0 0 24 24" style="width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:2.3;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`);let o=`update_b`+(a.latest_build||a.latest||`avail`);window._notifiedUpdates||(window._notifiedUpdates=new Set),window._notifiedUpdates.has(o)||(window._notifiedUpdates.add(o),typeof to==`function`&&to({id:o,title:`MAXNET Update Available (${t})`,message:`New firmware build ${a.latest_build||t} is ready for installation on ${i}. Tap to review & flash.`,level:`info`,event_type:`system_update`,action:()=>Cs(a)}))}else{let t=a&&a.current||`v2.2.7-b7`,i=a&&a.model||`JioRouter AX6000`;n&&(n.className=`setting-pill pill-green`,n.textContent=`${t} UP TO DATE`),r&&(r.textContent=`${i} is running the latest stable release.`),h&&(h.className=`setting-pill pill-green`,h.textContent=`UP TO DATE`),e&&(e.className=`round-action-btn`,e.title=`Check for Latest Firmware Update`,e.onclick=Es,e.innerHTML=`<svg id="iconCheckUpdate" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`)}},600)}catch{t&&t.classList.remove(`spinning`),e&&e.classList.remove(`btn-pulse`),n&&(n.className=`setting-pill pill-green`,n.textContent=`UP TO DATE`),r&&(r.textContent=`Jio AX6000 Custom Firmware • Up to date`)}}async function Ds(e){Cs(xs||{latest:e})}function Os(){Q(`Rebooting Maxnet Gateway...`,`warning`),fetch(`/cgi-bin/restore?action=reboot`,{method:`POST`}).then(()=>{Q(`Reboot command sent. Reconnecting in 15 seconds...`,`info`),setTimeout(()=>location.reload(),15e3)}).catch(()=>Q(`Reboot initiated.`,`info`))}async function ks(){Es()}async function As(){Cs(xs)}function js(){Cs(xs)}async function Ms(){try{let e=await(await u(`/cgi-bin/wifi?action=get`)).json();if(!e||e.status!==`ok`)return;let t=document.getElementById(`wifiMasterToggle`);t&&(t.checked=e.master_enabled===1);let n=document.getElementById(`wifi2gEnable`),r=document.getElementById(`wifi2gSsid`),i=document.getElementById(`wifi2gEnc`),a=document.getElementById(`wifi2gKey`),o=document.getElementById(`wifi2gChannel`),s=document.getElementById(`wifi2gHtmode`),c=document.getElementById(`wifi2gHidden`);n&&e.radio_2g&&(n.checked=e.radio_2g.enabled===1),r&&e.radio_2g&&(r.value=e.radio_2g.ssid||`MaxNet-2.4G`),i&&e.radio_2g&&(i.value=e.radio_2g.encryption||`psk2`),a&&e.radio_2g&&(a.value=e.radio_2g.key||``),o&&e.radio_2g&&(o.value=e.radio_2g.channel||`1`),s&&e.radio_2g&&(s.value=e.radio_2g.htmode||`HE20`),c&&e.radio_2g&&(c.checked=e.radio_2g.hidden===1);let l=document.getElementById(`wifi5gEnable`),d=document.getElementById(`wifi5gSsid`),f=document.getElementById(`wifi5gEnc`),p=document.getElementById(`wifi5gKey`),m=document.getElementById(`wifi5gChannel`),h=document.getElementById(`wifi5gHtmode`),g=document.getElementById(`wifi5gHidden`);l&&e.radio_5g&&(l.checked=e.radio_5g.enabled===1),d&&e.radio_5g&&(d.value=e.radio_5g.ssid||`MaxNet-5G`),f&&e.radio_5g&&(f.value=e.radio_5g.encryption||`psk2`),p&&e.radio_5g&&(p.value=e.radio_5g.key||``),m&&e.radio_5g&&(m.value=e.radio_5g.channel||`36`),h&&e.radio_5g&&(h.value=e.radio_5g.htmode||`HE80`),g&&e.radio_5g&&(g.checked=e.radio_5g.hidden===1),Ns(e.clients||[])}catch(e){console.warn(`fetchWifiConfig error:`,e)}}function Ns(e){let t=document.getElementById(`wifiClientsContainer`);t&&(t.innerHTML=!e||e.length===0?`<div style="padding:14px; text-align:center; color:var(--text-muted); font-size:11.5px;">No wireless devices currently connected.</div>`:e.map(e=>`
        <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:8px; padding:10px 14px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:32px; height:32px; border-radius:6px; background:rgba(6,182,212,0.15); color:#06b6d4; display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
            </div>
            <div>
              <span style="font-family:var(--font-mono); font-size:12px; font-weight:700; color:var(--text-main);">${$(e.mac)}</span>
              <div style="font-size:10.5px; color:var(--text-dim); display:flex; gap:8px;">
                <span>Band: ${$(e.band||`2.4 GHz`)}</span>
                <span>Signal: ${e.signal||-60} dBm</span>
              </div>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; font-weight:700; color:#10b981;">${e.tx_mbps||0} Mbps</span>
            <div style="font-size:9.5px; color:var(--text-muted);">PHY Link Rate</div>
          </div>
        </div>
      `).join(``))}async function Ps(){try{let e={master_enabled:+!!document.getElementById(`wifiMasterToggle`)?.checked,enable_2g:+!!document.getElementById(`wifi2gEnable`)?.checked,ssid_2g:document.getElementById(`wifi2gSsid`)?.value||`MaxNet-2.4G`,enc_2g:document.getElementById(`wifi2gEnc`)?.value||`psk2`,key_2g:document.getElementById(`wifi2gKey`)?.value||``,channel_2g:document.getElementById(`wifi2gChannel`)?.value||`1`,htmode_2g:document.getElementById(`wifi2gHtmode`)?.value||`HE20`,hidden_2g:+!!document.getElementById(`wifi2gHidden`)?.checked,enable_5g:+!!document.getElementById(`wifi5gEnable`)?.checked,ssid_5g:document.getElementById(`wifi5gSsid`)?.value||`MaxNet-5G`,enc_5g:document.getElementById(`wifi5gEnc`)?.value||`psk2`,key_5g:document.getElementById(`wifi5gKey`)?.value||``,channel_5g:document.getElementById(`wifi5gChannel`)?.value||`36`,htmode_5g:document.getElementById(`wifi5gHtmode`)?.value||`HE80`,hidden_5g:+!!document.getElementById(`wifi5gHidden`)?.checked};Q(`Applying Wi-Fi settings to wireless radios...`,`info`);let t=await(await u(`/cgi-bin/wifi?action=set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)})).json();t&&t.status===`ok`?(Q(`Wi-Fi settings applied successfully!`,`success`),setTimeout(Ms,1500)):Q(t?.message||`Failed to apply Wi-Fi settings`,`error`)}catch(e){Q(`Error saving Wi-Fi settings: `+e.message,`error`)}}function Fs(e){let t={master_enabled:+!!e};Q(e?`Enabling Wi-Fi transmitters...`:`Disabling Wi-Fi transmitters...`,`info`),u(`/cgi-bin/wifi?action=set`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}).then(()=>{Q(e?`Wi-Fi radios active`:`Wi-Fi radios disabled (DMA memory reclaimed)`,`success`),setTimeout(Ms,1e3)}).catch(e=>{Q(`Failed to toggle master Wi-Fi: `+e.message,`error`)})}function Is(){let e=document.getElementById(`modalRamBootBox`);e&&(e.style.display=e.style.display===`none`||!e.style.display?`flex`:`none`)}function Ls(){Cs(xs);let e=document.getElementById(`modalRamBootBox`);e&&(e.style.display=`flex`)}function Rs(e){e&&(navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(e).then(()=>{Q(`Copied to clipboard!`,`success`)}).catch(()=>{ss(e)}):ss(e))}function zs(e){t&&clearInterval(t),e&&Bs()}function Bs(){t&&clearInterval(t),t=setInterval(z,3e3)}function Vs(e,t){let n=document.getElementById(t);n&&(e.checked?(n.className=`toggle-status-badge on`,n.textContent=`ENABLED`):(n.className=`toggle-status-badge off`,n.textContent=`DISABLED`))}function Hs(){let e=i===`dark`,t=document.getElementById(`themeIconSun`),n=document.getElementById(`themeIconMoon`);t&&n&&(e?(t.style.display=`block`,n.style.display=`none`):(t.style.display=`none`,n.style.display=`block`)),typeof W==`function`&&W(),typeof Lo==`function`&&Lo()}function Us(){c(i===`dark`?`day`:`night`)}function Ws(){navigator.clipboard?navigator.clipboard.writeText(`9824584454@ybl`).then(Ks).catch(Gs):Gs()}function Gs(){let e=document.createElement(`textarea`);e.value=`9824584454@ybl`,document.body.appendChild(e),e.select();try{document.execCommand(`copy`),Ks()}catch{}document.body.removeChild(e)}function Ks(){let e=document.querySelector(`.btn-copy-capsule`);e&&(e.innerText=`COPIED!`,setTimeout(()=>{e.innerText=`COPY`},2e3))}function $(e){return e?String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`):``}function qs(e){document.body.classList.toggle(`no-anim`,!e);try{localStorage.setItem(`maxnet_anim_flow`,e?`1`:`0`)}catch{}}function Js(e){document.body.classList.toggle(`no-glow`,!e);try{localStorage.setItem(`maxnet_cyber_glow`,e?`1`:`0`)}catch{}}function Ys(e){document.body.classList.toggle(`dense-mode`,!!e);try{localStorage.setItem(`maxnet_dense_mode`,e?`1`:`0`)}catch{}}s();try{if(localStorage.getItem(`maxnet_anim_flow`)===`0`){let e=document.getElementById(`toggleAnimFlow`);e&&(e.checked=!1),document.body.classList.add(`no-anim`)}if(localStorage.getItem(`maxnet_cyber_glow`)===`0`){let e=document.getElementById(`toggleCyberGlow`);e&&(e.checked=!1),document.body.classList.add(`no-glow`)}if(localStorage.getItem(`maxnet_dense_mode`)===`1`){let e=document.getElementById(`toggleDenseMode`);e&&(e.checked=!0),document.body.classList.add(`dense-mode`)}}catch{}var Xs=`system`;function Zs(){Xs===`kernel`?bs():ys()}var Qs=typeof ho==`function`?ho:null;ho=function(e){Xs=e,Qs&&Qs(e)};var $s=!0;try{$s=localStorage.getItem(`maxnet_haptic_feedback`)!==`0`;let e=document.getElementById(`toggleHapticFeedback`);e&&(e.checked=$s)}catch{}function ec(e){$s=!!e;try{localStorage.setItem(`maxnet_haptic_feedback`,e?`1`:`0`)}catch{}e&&tc([15,30,15]),Q(e?`Haptic feedback enabled`:`Haptic feedback disabled`,`info`)}function tc(e=10){try{$s&&navigator.vibrate&&navigator.vibrate(e)}catch{}}document.addEventListener(`click`,e=>{e.target.closest(`button, .round-action-btn, .setting-clickable-row, .settings-nav-card, .toggle-switch, .tri-btn, .mh-btn`)&&tc(12)},{passive:!0});async function nc(){try{let e=await(await fetch(`/cgi-bin/device_info`)).json();if(e.status!==`ok`)return;let t=e.cpu||{},n=e.system||{},r=e.memory||{},i=document.getElementById(`sysCpuModel`);i&&(i.textContent=`${t.model||`Qualcomm IPQ9574`} • ${t.cores||4} Cores • ${t.architecture||`aarch64`}`);let a=document.getElementById(`sysLoadAvg`);a&&(a.textContent=`Usage: ${t.usage_pct||0}% • Load: ${t.load_1m||`0.00`}, ${t.load_5m||`0.00`}, ${t.load_15m||`0.00`} • BogoMIPS: ${t.bogomips||`48.00`}`);let o=document.getElementById(`sysRamSub`);o&&(o.textContent=`Used: ${r.used_mb||0} MB / ${r.total_mb||0} MB (${r.used_pct||0}%) • Free: ${r.free_mb||0} MB • Avail: ${r.avail_mb||0} MB`);let s=e.thermals||[],c=0;if(s.length>0){let e=0;s.forEach(t=>{let n=parseFloat(t.temp_c)||0;n>c&&(c=n),e+=n}),e/s.length}else c=42;let l=parseFloat(t.usage_pct)||0,u=parseFloat(r.used_pct)||0,d=document.getElementById(`deviceHealthStatusBadge`),f=document.getElementById(`deviceHealthSummarySub`),p=[];l>85&&p.push(`High CPU load (${l}%)`),u>90&&p.push(`High memory usage (${u}%)`),c>75&&p.push(`Elevated thermal temperature (${c.toFixed(1)}°C)`);let m=`HEALTHY`,h=`All Systems Nominal • CPU (${l}%), RAM (${u}%), Temp (${c>0?c.toFixed(1)+`°C`:`Optimal`})`;d&&(p.length>0?l>95||u>95||c>85?(m=`CRITICAL`,h=`Critical Anomaly • ${p.join(`, `)}`,d.className=`setting-status-badge`,d.style.background=`rgba(239,68,68,0.12)`,d.style.color=`#ef4444`,d.style.border=`1px solid rgba(239,68,68,0.3)`):(m=`WARNING`,h=`Suboptimal State • ${p.join(`, `)}`,d.className=`setting-status-badge`,d.style.background=`rgba(245,158,11,0.12)`,d.style.color=`#f59e0b`,d.style.border=`1px solid rgba(245,158,11,0.3)`):(m=`HEALTHY`,d.className=`setting-status-badge badge-active`,d.style.background=``,d.style.color=``,d.style.border=``),d.textContent=m),f&&(f.textContent=h),rc(e.thermals||[]),ic(e.storage||[]),ac(e.ports||[]);let g=document.getElementById(`sysBoardModel`);g&&(g.textContent=n.model||`JioRouter AX6000 JIDU6J11-6811`);let _=document.getElementById(`sysKernelVersion`);_&&(_.textContent=n.kernel||`Linux 6.18`);let v=document.getElementById(`sysUptimeClock`);v&&(v.textContent=`Uptime: ${n.uptime_str||`--`} • Time: ${n.local_time||`--`}`)}catch(e){console.error(`fetchDeviceInfo error`,e)}}function rc(e){let t=document.getElementById(`sysThermalsContainer`),n=document.getElementById(`sysThermalCount`);t&&(n&&(n.textContent=`${e.length} Zones`),t.innerHTML=e.length===0?`<div style="padding:10px 14px; color:var(--text-dim); font-size:11.5px;">No thermal zones detected.</div>`:e.map(e=>`
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">${$(e.name||e.type)}</span>
              <span class="setting-label-sub" style="font-family:var(--font-mono);">${e.temp_c}&deg;C &bull; Sensor: ${$(e.type)}</span>
            </div>
          </div>
        `).join(``))}function ic(e){let t=document.getElementById(`sysStorageContainer`);t&&(t.innerHTML=e.length===0?`<div style="padding:10px 14px; color:var(--text-dim); font-size:11.5px;">No storage partitions available.</div>`:e.map(e=>`
        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Mount: ${$(e.mount)}</span>
            <span class="setting-label-sub">${$(e.used)} used of ${$(e.size)} (${$(e.use_pct)}) &bull; ${$(e.avail)} free &bull; ${$(e.fs)}</span>
          </div>
        </div>
      `).join(``))}function ac(e){let t=document.getElementById(`sysPortsContainer`);t&&(t.innerHTML=e.length===0?`<div style="padding:10px 14px; color:var(--text-dim); font-size:11.5px;">No network ports detected.</div>`:e.map(e=>{let t=e.status===`UP`?`${$(e.speed)}${e.duplex===`full`?` Full-Duplex`:``} (LINK UP)`:`LINK DOWN`,n=(e.rx_bytes/1048576).toFixed(1),r=(e.tx_bytes/1048576).toFixed(1);return`
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">${$(e.label)}</span>
              <span class="setting-label-sub">${t} &bull; ${$(e.iface)} &bull; MAC: ${$(e.mac)}${e.ip?` &bull; IP: `+$(e.ip):``} &bull; RX: ${n}MB / TX: ${r}MB</span>
            </div>
          </div>
        `}).join(``))}setTimeout(()=>{typeof Za==`function`&&Za(),typeof ro==`function`&&ro()},1500),setInterval(()=>{typeof ro==`function`&&ro()},18e5),typeof window<`u`&&Object.assign(window,{applyThemeMode:s,setThemeMode:c,updateThemeTriButtons:l,apiFetch:u,fetchPublicHealthSnapshot:d,showLogin:f,showDashboard:p,pemSpkiToArrayBuffer:m,encryptCredentials:h,submitLogin:g,showLogoutConfirm:_,hideLogoutConfirm:v,logoutSession:y,openSettingPage:x,getValidationTypeForKey:S,onModalLiveValidate:C,triggerModalInitialValidation:w,loadUsbWanConfig:E,renderUsbWanDevices:D,saveUsbWanConfig:O,restartUsbWanInterfaces:k,openEditUsbDeviceModal:A,handleSettingsBack:j,closeSettingPage:M,toggleAccordion:N,filterSettingsSearch:ee,clearSettingsSearch:te,switchTab:P,toggleSettingsMenu:F,getTempColor:I,getUsageColor:L,fmtBytes:R,fetchData:z,drawTrafficSparkline:ne,renderMultiLinkMerger:re,selectFleetSlot:ie,fetchSelectedSlotTelemetry:ae,renderFleetMatrix:oe,formatUptimeWithSec:ce,getLiveMobUptime:le,getLiveRtrUptime:ue,renderTooltipContent:de,fetchRealtimePing:fe,positionBadaTooltip:pe,showBadaTooltip:me,hideBadaTooltip:he,openSmbSettings:ge,toggleSmbServiceLegacy:_e,attachNodeTooltip:ve,zoomTopology:Se,resetTopologyZoom:Ce,applyTopologyZoom:we,toggleTopologyFullscreen:Te,setTopologyLayerFilter:Ee,applyTopoTransform:ze,initTopoPanDrag:Be,initTopologyCpuOptimization:Ve,showTopoNodeDetail:We,closeTopoNodeDetail:Ge,showTopoEvidenceModal:Ke,closeTopoEvidenceModal:qe,fitTopologyToScreen:Je,openTopoNodeSettings:Ye,openTopoNodeClientPage:Xe,drawPeopleIcon:$e,drawMobileIcon:et,drawSsdIcon:tt,drawPendriveIconV1:nt,resolveDeviceDisplayName:rt,isStaleDeviceLabel:it,cleanDeviceLabel:at,classifyLanDevice:ot,drawLanClientDeviceIcon:st,drawRouterBoxIcon:ct,drawRouterApIcon:lt,drawSwitchIcon:ut,drawWifiAntennaIcon:dt,drawDeviceIcon:ft,drawNoInternetIconSmall:pt,drawTetheringIconSmall:mt,drawAdbIconSmall:ht,drawMtpIconSmall:gt,drawMobilePhoneIcon:_t,drawPendriveIcon:vt,drawStorageIconSmall:yt,renderDeviceVerticalIcons:bt,getApAndClientsForPort:xt,getUsbThemeStyle:St,calcMaxLinkSpeedTag:Ct,getPortTopologyConfig:wt,computeNodeInterfaceSlots:Tt,computeTreeTotalVerticalHeight:Et,computeSubtreeBounds:Dt,computeTreeMaxDepth:Ot,computeSubtreeClientCount:kt,getTopologyPrefs:jt,updateTopologyPref:Mt,getTopologyThemeColors:Nt,setupTopologyAutoRefresh:Pt,makeStepEdgePath:Ft,computeLayeredSubtreeBounds:It,assignLayeredPositions:Lt,countTotalTopologyNodes:Rt,toggleExpandCollapseAll:zt,setTopologyActiveLayer:Bt,highlightPathToRoot:Vt,clearPathHighlight:Ht,renderTopologyMinimap:Ut,getCombinedRouterSpeed:Wt,calcSpeedFlowDuration:Gt,calcSpeedFlowWidth:Kt,getDeviceSpeedMbps:qt,buildUsbBwSvg:W,renderBwValues:Jt,renderTopologyFlow:Yt,renderData:Xt,renderMiniPorts:Zt,fetchBlockedList:Qt,fetchClients:$t,setClientSort:en,onSearchClients:nn,clearDhcpClientSearch:rn,renderClientsCards:an,getClientHostOrDnsName:on,getClientStatusInfo:sn,isGatewayDevice:cn,openDhcpClientDetail:ln,closeDhcpClientDetail:un,renderDhcpClientDetail:dn,copyClientText:fn,reserveClientStaticLease:pn,getAvailableNetworkClients:mn,createDefaultTopologyTree:hn,normalizeTopologyTree:gn,validateAndFixNodeTree:_n,collectUsedIps:vn,findNodeById:yn,findPortById:bn,validateTopologyTree:xn,synthesizeLegacyPorts:Sn,renderUsbPortsSettingList:Cn,onWanModeChange:wn,onWanSpeedChange:Tn,onUsbModeChange:En,onUsbPortCountChange:Dn,onUsbPortChange:On,triggerTopologyAutoSave:G,onNodePortCountChange:An,onPortRoleChange:jn,onSelectPortDevice:Mn,onCustomPortDeviceChange:Nn,onSelectPortNodeClient:Pn,onNodeFieldChange:Fn,onAddWirelessClient:In,onRemoveWirelessClient:Ln,onWirelessClientChange:Rn,updateValidationNotice:zn,renderTopologyPreferencesUI:Bn,toggleTopoPreferences:Vn,flattenTopologyNodes:Hn,renderTopologyLayersUI:K,renderNodeCard:Un,renderNodeSettingGroups:Wn,renderSingleNodeSettingCard:Gn,onQuickAddWifiClient:Kn,onRemoveWifiClient:qn,saveTopologyLayersConfig:Jn,resetTopologyLayersConfig:Yn,fetchTopologyLayers:Xn,autoMapNetworkTopology:Zn,openExportTopologyModal:Qn,openImportTopologyModal:$n,closeTopoJsonModal:er,copyTopoJsonToClipboard:tr,applyImportedTopoJson:nr,showSaveSuccessNotification:rr,renderBlockedCards:ir,blockDevice:ar,unblockDevice:or,submitManualBlock:sr,fetchUsbDevicesFlow:cr,renderUsbDevicesFlow:lr,restartNetworkAndMultilink:ur,clearDnsAndConntrack:dr,downloadKernelLogs:fr,onSelectAdbDevice:pr,onSelectUsbHardwareDevice:mr,fetchDeviceTelemetry:hr,fetchDeviceSms:gr,runDevicePing:_r,saveAdbDeviceStates:vr,getAdbDeviceState:yr,updateAdbTorchUI:br,fetchAdbLiveTelemetry:xr,copyAdbSerial:Sr,switchAdbSubView:Cr,fetchAdbSmsPage:wr,renderAdbSmsPageList:Tr,filterAdbSmsPage:Er,fetchAdbCallsPage:Dr,renderAdbCallsPageList:Or,filterAdbCallsPage:kr,fetchAdbContactsPage:Ar,renderAdbContactsPageList:jr,filterAdbContactsPage:Mr,openAdbSmsModal:Nr,openAdbCallLogsModal:Pr,openAdbContactsModal:Fr,closeAdbSmsModal:Ir,closeAdbCallLogsModal:Lr,closeAdbContactsModal:Rr,captureAdbScreenshot:zr,closeAdbScreenshotModal:Br,togglePhoneTorch:Vr,volumePhone:Hr,runDeviceWake:Ur,runDeviceSleep:Wr,runDeviceAirplane:Gr,runDeviceReboot:Kr,runDeviceLock:Jr,openPhoneTetherSettings:Yr,fetchDeviceContacts:Xr,filterContacts:Zr,renderContactsList:Qr,fetchDeviceCalls:$r,handleRestoreFileChosen:ei,initDropzoneHandlers:ti,toggleDiagRawLog:ni,setSettingSaveStatus:ai,scheduleNetworkAutoSave:oi,saveNetworkSettingsAuto:si,openSettingModal:ci,onModalMaskInput:li,onModalCidrChange:ui,closeSettingModal:fi,onModalOverlayClick:pi,isValidIpv4:mi,isValidSubnetMask:hi,isValidMac:gi,generateRandomMacInModal:_i,saveSettingModal:vi,fetchSecuritySettings:bi,saveSecurityPolicy:xi,fetchAdbDeviceList:Ci,renderAdbDevicesCards:wi,openAdbDeviceDetail:Ti,closeAdbDeviceDetail:Ei,selectAdbDevice:Di,updateSelectedAdbDeviceControls:Oi,enableWirelessAdb:ki,parseUserAgentSecurityDetails:Ai,formatSessionDateTime:ji,fetchActiveSessions:Mi,logoutSingleDevice:Ni,logoutOtherDevices:Pi,logoutAllSessions:Fi,logoutCurrentSession:Ii,switchDiagTool:Wi,setPortScanMode:Gi,resetDefaultPorts:Ki,setDnsQueryType:qi,clearDiagResults:Ji,toggleDiagExecution:Yi,stopDiagExecution:Xi,startDiagExecution:Zi,executeNextPing:Qi,executeTraceroute:$i,executePortScan:ea,executeWhois:ta,executeDnsQuery:na,runRouterDiagnostic:ra,renderDiagnosticGui:ia,maskToCidr:aa,cidrToMask:oa,syncCidrFromMask:sa,syncMaskFromCidr:ca,toggleDhcpControls:la,toggleIpv6Master:ua,setDnsPreset:da,renderStaticLeases:fa,addStaticLeaseFromUI:pa,delStaticLease:ma,toggleUsbTethering:ha,toggleUsbTetherDns:ga,fetchNetworkConfig:_a,saveNetworkSettings:va,onWanProtoChange:ya,updateWanInterfaceDisplays:ba,loadWanInterfaceConfig:xa,saveWanInterfaceConfig:Sa,cloneCurrentPcMac:Ca,cloneCurrentPcMacToModal:wa,generateRandomWanMacInModal:Ta,resetWanMacToDefault:Ea,loadPppoeConfig:Da,togglePppoeClient:Oa,savePppoeClientCreds:ka,savePppoeClientAc:Aa,savePppoeClientMac:ja,generateRandomPppoeMac:Ma,togglePppoeServer:Na,savePppoeServerConfig:Pa,addPppoeUserFromModal:Fa,deletePppoeUser:Ia,loadDufsConfig:La,toggleDufsService:Ra,saveDufsConfig:za,openNotificationPage:Ba,toggleNotificationCenter:Va,closeNotificationCenter:Ha,updateNotificationBadge:Ua,clearAcknowledgedAlerts:Wa,openSslHelpModal:Ga,closeSslHelpModal:Ka,loadSslCertificateStatus:qa,requestDuckDnsSsl:Ja,toggleBrowserPushPermission:Ya,updatePushNotificationButtonState:Xa,loadNotificationsPage:Za,deleteNotification:Qa,clearAllNotifications:$a,dispatchTestNotification:eo,dispatchAlertNotification:to,checkSystemAlerts:no,checkForSystemFirmwareUpdates:ro,loadWebhooksConfig:io,saveWebhooksConfig:ao,testWebhookProvider:oo,fetchLogs:po,renderLogs:mo,switchLogType:ho,filterLogsRealtime:go,refreshLogViewer:_o,toggleLogAutoRefresh:vo,stopLogAutoRefresh:yo,downloadCurrentLog:bo,fetchPackages:To,renderPackagesList:Eo,switchPackageTab:Do,handlePackageSearchInput:Oo,updatePackageRepositories:ko,installPackage:Ao,installPackageDirect:jo,uninstallPackage:Mo,getTerminalResponsiveFontSize:Fo,getTerminalTheme:Io,updateTerminalTheme:Lo,loadResource:Ro,ensureTerminalEngine:Bo,initNativeTerminal:Vo,connectTerminalWebSocket:Ho,setTailscaleLoginState:Wo,updateTailscaleWebLoginUrl:Go,renderTailscaleAccount:Ko,renderTailscaleDevices:qo,fetchTailscale:Jo,toggleTailscaleService:Yo,startTailscaleWebLogin:Xo,checkTailscaleAuthUrl:Zo,copyTsAuthUrl:Qo,logoutTailscale:$o,loginTailscaleWithKey:es,restartTailscale:ts,applyTailscalePrefs:ns,fetchSmbConfig:rs,toggleSmbService:is,saveSmbCredentials:as,copySmbPath:os,fallbackCopyText:ss,onSelectMultiLinkSlot:cs,changeAdminPassword:ls,downloadBackupArchive:us,uploadRestoreArchive:ds,showFactoryResetModal:ms,closeFactoryResetModal:hs,openFirmwareFlashModal:Cs,closeFirmwareFlashModal:ws,startFirmwareFlash:Ts,executeFactoryReset:gs,confirmFactoryReset:_s,confirmFactoryResetRouter:vs,downloadSystemLog:ys,downloadKernelLog:bs,showToast:Q,checkLatestFirmwareUpdate:Es,installSysupgradeUpdate:Ds,confirmRebootRouter:Os,checkUpdateStatus:ks,executeFirmwareUpdate:As,confirmCleanUpdate:js,fetchWifiConfig:Ms,renderWifiClients:Ns,saveWifiSettings:Ps,toggleWifiMasterPower:Fs,toggleRamBootDetailsInModal:Is,showRamBootInstructions:Ls,copyTextToClipboard:Rs,toggleAutoRefresh:zs,setupTimer:Bs,updateToggleBadge:Vs,updateThemeUI:Hs,toggleTheme:Us,copyUpi:Ws,fallbackCopy:Gs,showCopied:Ks,escapeHtml:$,toggleAnimFlow:qs,toggleCyberGlow:Js,toggleDenseMode:Ys,downloadActiveLog:Zs,toggleHapticFeedback:ec,triggerHaptic:tc,fetchDeviceInfo:nc,renderDeviceInfoThermals:rc,renderDeviceInfoStorage:ic,renderDeviceInfoPorts:ac,activeAdbDevices:Si,selectedAdbSerial:q,cachedClients:o,currentTheme:i,currentThemeMode:r});function oc(e){typeof Er==`function`&&Er(e)}function sc(e){typeof Mr==`function`&&Mr(e)}function cc(e,t){typeof Q==`function`&&Q(e,t?`error`:`info`)}function lc(e){typeof vi==`function`&&vi()}async function uc(){typeof Q==`function`&&Q(`Power cycling USB hub (VBUS reset)...`,`warning`);try{await u(`/cgi-bin/usb_wan?action=power_cycle`),typeof Q==`function`&&Q(`USB Hub power cycled successfully!`,`success`)}catch{typeof Q==`function`&&Q(`USB power cycle trigger completed`,`info`)}}typeof window<`u`&&(window.submitLogin=g,window.logoutSession=y,window.hideLogoutConfirm=v,window.switchTab=P,window.toggleTheme=Us,window.setThemeMode=c,window.toggleSettingsMenu=F,window.toggleNotificationCenter=Va,window.toggleCyberGlow=Js,window.toggleDenseMode=Ys,window.toggleHapticFeedback=ec,window.toggleAutoRefresh=zs,window.openSettingModal=ci,window.closeSettingModal=fi,window.saveSettingModal=vi,window.openSettingPage=x,window.handleSettingsBack=j,window.filterSettingsSearch=ee,window.clearSettingsSearch=te,window.toggleAccordion=N,window.onModalOverlayClick=pi,window.resetTopologyZoom=Ce,window.fitTopologyToScreen=Je,window.zoomTopology=Se,window.closeTopoNodeDetail=Ge,window.openTopoNodeClientPage=Xe,window.openTopoNodeSettings=Ye,window.closeTopoJsonModal=er,window.copyTopoJsonToClipboard=tr,window.applyImportedTopoJson=nr,window.openExportTopologyModal=Qn,window.openImportTopologyModal=$n,window.closeTopoEvidenceModal=qe,window.resetTopologyLayersConfig=Yn,window.autoMapNetworkTopology=Zn,window.toggleAnimFlow=qs,window.switchAdbSubView=Cr,window.fetchAdbSmsPage=wr,window.filterAdbSmsPage=Er,window.closeAdbSmsModal=Ir,window.fetchAdbCallsPage=Dr,window.filterAdbCallsPage=kr,window.closeAdbCallLogsModal=Lr,window.fetchAdbContactsPage=Ar,window.filterAdbContactsPage=Mr,window.closeAdbContactsModal=Rr,window.captureAdbScreenshot=zr,window.closeAdbScreenshotModal=Br,window.runDeviceWake=Ur,window.runDeviceSleep=Wr,window.runDeviceReboot=Kr,window.runDeviceAirplane=Gr,window.togglePhoneTorch=Vr,window.volumePhone=Hr,window.enableWirelessAdb=ki,window.copyAdbSerial=Sr,window.saveUsbWanConfig=O,window.restartNetworkAndMultilink=ur,window.scheduleNetworkAutoSave=oi,window.saveSecurityPolicy=xi,window.saveWanInterfaceConfig=Sa,window.loadWanInterfaceConfig=xa,window.toggleDhcpControls=la,window.toggleIpv6Master=ua,window.saveWebhooksConfig=ao,window.testWebhookProvider=oo,window.loadPppoeConfig=Da,window.togglePppoeClient=Oa,window.togglePppoeServer=Na,window.toggleSmbService=is,window.copySmbPath=os,window.toggleDufsService=Ra,window.toggleTailscaleService=Yo,window.startTailscaleWebLogin=Xo,window.logoutTailscale=$o,window.restartTailscale=ts,window.applyTailscalePrefs=ns,window.copyTsAuthUrl=Qo,window.switchDiagTool=Wi,window.toggleDiagExecution=Yi,window.toggleDiagRawLog=ni,window.clearDiagResults=Ji,window.setPortScanMode=Gi,window.setDnsQueryType=qi,window.confirmRebootRouter=Os,window.showFactoryResetModal=ms,window.closeFactoryResetModal=hs,window.openFirmwareFlashModal=Cs,window.closeFirmwareFlashModal=ws,window.startFirmwareFlash=Ts,window.executeFactoryReset=gs,window.downloadBackupArchive=us,window.handleRestoreFileChosen=ei,window.uploadRestoreArchive=ds,window.clearDnsAndConntrack=dr,window.checkLatestFirmwareUpdate=Es,window.switchLogType=ho,window.refreshLogViewer=_o,window.downloadActiveLog=Zs,window.switchPackageTab=Do,window.handlePackageSearchInput=Oo,window.updatePackageRepositories=ko,window.copyUpi=Ws,window.closeSslHelpModal=Ka,window.onSearchClients=nn,window.clearDhcpClientSearch=rn,window.showToast=Q,window.apiFetch=u,window.fetchDeviceInfo=nc,window.fetchTailscale=Jo,window.fetchAdbLiveTelemetry=xr,window.filterAdbSms=oc,window.filterAdbContacts=sc,window.showNotificationToast=cc,window.saveSmbGuestSetting=lc,window.powerCycleUsbHub=uc,Object.assign(window,{submitLogin:g,logoutSession:y,hideLogoutConfirm:v,switchTab:P,toggleTheme:Us,setThemeMode:c,toggleSettingsMenu:F,toggleNotificationCenter:Va,toggleCyberGlow:Js,toggleDenseMode:Ys,toggleHapticFeedback:ec,toggleAutoRefresh:zs,openSettingModal:ci,closeSettingModal:fi,saveSettingModal:vi,openSettingPage:x,handleSettingsBack:j,filterSettingsSearch:ee,clearSettingsSearch:te,toggleAccordion:N,onModalOverlayClick:pi,resetTopologyZoom:Ce,fitTopologyToScreen:Je,zoomTopology:Se,closeTopoNodeDetail:Ge,openTopoNodeClientPage:Xe,openTopoNodeSettings:Ye,closeTopoJsonModal:er,copyTopoJsonToClipboard:tr,applyImportedTopoJson:nr,openExportTopologyModal:Qn,openImportTopologyModal:$n,closeTopoEvidenceModal:qe,resetTopologyLayersConfig:Yn,autoMapNetworkTopology:Zn,toggleAnimFlow:qs,switchAdbSubView:Cr,fetchAdbSmsPage:wr,filterAdbSmsPage:Er,closeAdbSmsModal:Ir,fetchAdbCallsPage:Dr,filterAdbCallsPage:kr,closeAdbCallLogsModal:Lr,fetchAdbContactsPage:Ar,filterAdbContactsPage:Mr,closeAdbContactsModal:Rr,captureAdbScreenshot:zr,closeAdbScreenshotModal:Br,runDeviceWake:Ur,runDeviceSleep:Wr,runDeviceReboot:Kr,runDeviceAirplane:Gr,togglePhoneTorch:Vr,volumePhone:Hr,enableWirelessAdb:ki,copyAdbSerial:Sr,saveUsbWanConfig:O,restartNetworkAndMultilink:ur,scheduleNetworkAutoSave:oi,saveSecurityPolicy:xi,saveWanInterfaceConfig:Sa,loadWanInterfaceConfig:xa,toggleDhcpControls:la,toggleIpv6Master:ua,saveWebhooksConfig:ao,testWebhookProvider:oo,loadPppoeConfig:Da,togglePppoeClient:Oa,togglePppoeServer:Na,toggleSmbService:is,copySmbPath:os,toggleDufsService:Ra,toggleTailscaleService:Yo,startTailscaleWebLogin:Xo,logoutTailscale:$o,restartTailscale:ts,applyTailscalePrefs:ns,copyTsAuthUrl:Qo,switchDiagTool:Wi,toggleDiagExecution:Yi,toggleDiagRawLog:ni,clearDiagResults:Ji,setPortScanMode:Gi,setDnsQueryType:qi,confirmRebootRouter:Os,showFactoryResetModal:ms,closeFactoryResetModal:hs,executeFactoryReset:gs,downloadBackupArchive:us,handleRestoreFileChosen:ei,uploadRestoreArchive:ds,clearDnsAndConntrack:dr,checkLatestFirmwareUpdate:Es,switchLogType:ho,refreshLogViewer:_o,downloadActiveLog:Zs,switchPackageTab:Do,handlePackageSearchInput:Oo,updatePackageRepositories:ko,copyUpi:Ws,closeSslHelpModal:Ka,onSearchClients:nn,clearDhcpClientSearch:rn,showToast:Q,apiFetch:u,fetchDeviceInfo:nc,fetchTailscale:Jo,fetchAdbLiveTelemetry:xr,filterAdbSms:oc,filterAdbContacts:sc,showNotificationToast:cc,saveSmbGuestSetting:lc,powerCycleUsbHub:uc}));function dc(){let t=document.getElementById(`maxnet-root`)||document.body;t&&!document.getElementById(`loginScreen`)&&(t.innerHTML=e)}dc();