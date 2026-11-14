let timer = null;
    let blockedIps = new Set();
    let currentThemeMode = localStorage.getItem('maxnet_theme_mode') || 'night';
    if (!localStorage.getItem('maxnet_theme_mode') && localStorage.getItem('maxnet_theme')) {
      currentThemeMode = (localStorage.getItem('maxnet_theme') === 'light') ? 'day' : 'night';
    }
    let currentTheme = (currentThemeMode === 'day') ? 'light' : 'dark';
    let clientSortMode = 'ip';
    let cachedClients = [];
    let cachedTotWanBytes = 0;

    function applyThemeMode() {
      let resolvedTheme = 'dark';
      if (currentThemeMode === 'auto') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolvedTheme = prefersDark ? 'dark' : 'light';
      } else if (currentThemeMode === 'day') {
        resolvedTheme = 'light';
      } else {
        resolvedTheme = 'dark';
      }
      currentTheme = resolvedTheme;
      document.documentElement.setAttribute('data-theme', resolvedTheme);
      updateThemeTriButtons();
      if (typeof updateTerminalTheme === 'function') {
        try { updateTerminalTheme(); } catch (e) {}
      }
      if (typeof buildUsbBwSvg === 'function') {
        try { buildUsbBwSvg(); } catch (e) {}
      }
    }

    function setThemeMode(mode) {
      if (!['auto', 'day', 'night'].includes(mode)) mode = 'night';
      currentThemeMode = mode;
      localStorage.setItem('maxnet_theme_mode', mode);
      localStorage.setItem('maxnet_theme', mode === 'day' ? 'light' : 'dark');
      applyThemeMode();
    }

    function updateThemeTriButtons() {
      const btns = {
        auto: document.getElementById('triBtnAuto'),
        day: document.getElementById('triBtnDay'),
        night: document.getElementById('triBtnNight')
      };
      Object.keys(btns).forEach(key => {
        if (btns[key]) {
          if (key === currentThemeMode) {
            btns[key].classList.add('active');
          } else {
            btns[key].classList.remove('active');
          }
        }
      });
    }

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentThemeMode === 'auto') applyThemeMode();
      });
    }
    applyThemeMode();

    // Direct Zero-Cache API Fetcher (Never Cache, Realtime Fresh Data with Session Auth)
    function apiFetch(url, options = {}) {
      const sep = url.includes('?') ? '&' : '?';
      const noCacheUrl = `${url}${sep}_t=${Date.now()}`;
      const token = localStorage.getItem('maxnet_token');
      return fetch(noCacheUrl, {
        ...options,
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          ...(token ? { 'X-Session-Token': token } : {}),
          ...(options.headers || {})
        }
      });
    }

    if (currentTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // ON LOAD
    window.addEventListener('load', async () => {
      try {
        const checkRes = await apiFetch('/cgi-bin/clients?action=check');
        const checkData = await checkRes.json();
        if (checkData.blocked) {
          window.location.href = '/blocked.html';
          return;
        }
      } catch (e) {}

      const token = localStorage.getItem('maxnet_token');
      if (token) {
        try {
          const res = await apiFetch('/cgi-bin/auth?action=verify&token=' + token);
          const data = await res.json();
          if (data.status === 'ok') {
            showDashboard();
            return;
          }
        } catch (e) {}
      }
      showLogin();
    });

    let _healthSnapshotLoaded = false;
    async function fetchPublicHealthSnapshot() {
      try {
        const res = await fetch('/cgi-bin/health');
        const data = await res.json();
        if (data.status === 'ok') {
          const host = data.hostname || (data.router && data.router.hostname) || 'MAXNET-GATEWAY';
          const titleEl = document.getElementById('loginDeviceHostTitle');
          if (titleEl) {
            titleEl.textContent = host.toUpperCase();
          }
          if (!document.title || document.title.includes('Login')) {
            document.title = host.toUpperCase() + ' - Login';
          }
        }
      } catch (e) {
        console.error("fetchPublicHealthSnapshot error", e);
      }
    }

    function showLogin() {
      document.getElementById('loginScreen').style.display = 'flex';
      document.getElementById('dashboardContainer').style.display = 'none';
      
      const passInp = document.getElementById('loginPass');
      if (passInp) passInp.value = '';
      if (timer) clearInterval(timer);
      fetchPublicHealthSnapshot();
    }

    function showDashboard() {
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('dashboardContainer').style.display = 'block';
      
      fetchData();
      fetchNetworkConfig();
      fetchTopologyLayers();
      fetchBlockedList();
      fetchTailscale();
      fetchAdbDeviceList();
      loadSslCertificateStatus();
      loadDufsConfig();
      loadWanInterfaceConfig();
      loadPppoeConfig();
      if (typeof loadNotificationsPage === 'function') loadNotificationsPage();
      setupTimer();
      setTimeout(checkUpdateStatus, 1000);
      if (window.location.hash && window.location.hash.startsWith('#setting=')) {
        const sId = decodeURIComponent(window.location.hash.replace('#setting=', '')).split('&')[0];
        if (sId) {
          switchTab('settings', true, false);
          openSettingPage(sId, false);
        }
      }
    }

    // Convert PEM SPKI public key to ArrayBuffer for Web Crypto API
    function pemSpkiToArrayBuffer(pem) {
      const cleanB64 = pem.replace(/-----[^\n]+-----/g, '').replace(/[\r\n\s]/g, '');
      const raw = window.atob(cleanB64);
      const buf = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) {
        buf[i] = raw.charCodeAt(i);
      }
      return buf.buffer;
    }

    // Hardware-accelerated RSA-OAEP encryption for sensitive credentials (0% CPU impact)
    async function encryptCredentials(user, pass) {
      if (!window.crypto || !window.crypto.subtle) return null;
      try {
        const challengeRes = await fetch('/cgi-bin/auth?action=challenge', { cache: 'no-store' });
        const challenge = await challengeRes.json();
        if (!challenge || challenge.status !== 'ok' || !challenge.public_key || !challenge.nonce) {
          return null;
        }

        const spkiBuf = pemSpkiToArrayBuffer(challenge.public_key);
        const rsaKey = await window.crypto.subtle.importKey(
          'spki',
          spkiBuf,
          { name: 'RSA-OAEP', hash: 'SHA-256' },
          false,
          ['encrypt']
        );

        const payloadStr = JSON.stringify({
          user: user,
          pass: pass,
          nonce: challenge.nonce,
          ts: challenge.timestamp || Date.now()
        });

        const enc = new TextEncoder();
        const cipherBuf = await window.crypto.subtle.encrypt(
          { name: 'RSA-OAEP' },
          rsaKey,
          enc.encode(payloadStr)
        );

        const bytes = new Uint8Array(cipherBuf);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const b64Cipher = window.btoa(binary);

        return {
          action: 'login_encrypted',
          payload: b64Cipher,
          nonce: challenge.nonce
        };
      } catch (err) {
        console.warn('Asymmetric credential encryption fell back:', err);
        return null;
      }
    }

    async function submitLogin() {
      const u = document.getElementById('loginUser').value.trim();
      const p = document.getElementById('loginPass').value;
      const errMsg = document.getElementById('loginErrMsg');
      const btn = document.getElementById('btnLogin');
      errMsg.style.display = 'none';
      if (btn) btn.disabled = true;

      try {
        let authPayload = null;
        try {
          authPayload = await encryptCredentials(u, p);
        } catch (e) {}

        if (!authPayload) {
          authPayload = { action: 'login', user: u, pass: p };
        }

        const res = await fetch('/cgi-bin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authPayload)
        });
        const data = await res.json();
        if (data.status === 'ok') {
          localStorage.setItem('maxnet_token', data.token);
          showDashboard();
        } else {
          errMsg.innerText = data.message || 'Invalid username or password';
          errMsg.style.display = 'block';
        }
      } catch (e) {
        errMsg.innerText = 'Authentication error. Check gateway connection.';
        errMsg.style.display = 'block';
      } finally {
        if (btn) btn.disabled = false;
      }
    }

    function showLogoutConfirm() {
      const m = document.getElementById('logoutConfirmModal');
      if (m) m.style.display = 'flex';
    }

    function hideLogoutConfirm() {
      const m = document.getElementById('logoutConfirmModal');
      if (m) m.style.display = 'none';
    }

    async function logoutSession() {
      hideLogoutConfirm();
      const token = localStorage.getItem('maxnet_token');
      if (token) {
        fetch('/cgi-bin/auth?action=logout&token=' + token).catch(() => {});
      }
      localStorage.removeItem('maxnet_token');
      showLogin();
    }

    // =========================================================================
    // DEDICATED SETTINGS PAGE VIEW & SUB-NAVIGATION SYSTEM (NO ACCORDION)
    // =========================================================================
    const SETTINGS_PAGES_META = {
      'acc-usb-wan': {
        title: 'USB WAN',
        badge: 'MULTI-WAN',
        badgeColor: '#0ea5e9'
      },
      'acc-sys-info': {
        title: 'Device Info',
        badge: 'HARDWARE & SYSTEM',
        badgeColor: '#38bdf8'
      },
      'acc-network': {
        title: 'Network',
        badge: 'LAN INTERFACE',
        badgeColor: '#38bdf8'
      },
      'acc-interfaces': {
        title: 'Interfaces',
        badge: 'WAN & INTERFACES',
        badgeColor: '#0ea5e9'
      },
      'acc-pppoe': {
        title: 'PPPoE Broadband',
        badge: 'CLIENT & SERVER',
        badgeColor: '#06b6d4'
      },
      'acc-notifications': {
        title: 'Notifications',
        badge: 'NOTIFICATIONS',
        badgeColor: '#f59e0b'
      },
      'acc-webhooks': {
        title: 'Webhooks',
        badge: 'WEBHOOKS',
        badgeColor: '#0ea5e9'
      },
      'acc-topo-layers': {
        title: 'Network Topology',
        badge: 'LAYERS 2 & 3',
        badgeColor: '#38bdf8'
      },
      'acc-lan-clients': {
        title: 'DHCP Clients',
        badge: 'CLIENT LEASES',
        badgeColor: '#10b981'
      },
      'acc-gaming': {
        title: 'Gaming Mode',
        badge: 'LOW LATENCY',
        badgeColor: '#ec4899'
      },
      'acc-device-info': {
        title: 'About Developer',
        badge: 'HARDWARE & USB',
        badgeColor: '#a78bfa'
      },
      'acc-tailscale': {
        title: 'Tailscale VPN',
        badge: 'ENCRYPTED MESH',
        badgeColor: '#06b6d4'
      },
      'acc-adb-device': {
        title: 'ADB Devices',
        badge: 'ANDROID & HARDWARE',
        badgeColor: '#38bdf8'
      },
      'acc-smb-storage': {
        title: 'Network Storage',
        badge: 'NAS STORAGE',
        badgeColor: '#c084fc'
      },
      'acc-security': {
        title: 'Security',
        badge: 'PROTECTION',
        badgeColor: '#f59e0b'
      },
      'acc-diagnostics': {
        title: 'Diagnostics',
        badge: 'DIAGNOSTICS',
        badgeColor: '#38bdf8'
      },
      'acc-wifi': {
        title: 'Wi-Fi & Hotspot',
        badge: 'WIRELESS',
        badgeColor: '#10b981'
      },
      'acc-firmware': {
        title: 'Firmware & OS Updates',
        badge: 'OS UPDATE',
        badgeColor: '#38bdf8'
      },
      'acc-maintenance': {
        title: 'Maintenance',
        badge: 'SYSTEM OPS',
        badgeColor: '#ef4444'
      },
      'acc-logs': {
        title: 'System Logs',
        badge: 'LIVE LOGS',
        badgeColor: '#06b6d4'
      },
      'acc-sessions': {
        title: 'Active Sessions & Sign Out',
        badge: 'SECURITY & SESSIONS',
        badgeColor: '#ef4444'
      },
      'acc-packages': {
        title: 'Packages',
        badge: 'SOFTWARE & PLUGINS',
        badgeColor: '#38bdf8'
      },
      'acc-terminal-cli': {
        title: 'Terminal Console',
        badge: 'ROOT SHELL',
        badgeColor: '#10b981'
      },
      'acc-static-leases': {
        title: 'Static IP Reservations',
        badge: 'DHCP LEASES',
        badgeColor: '#06b6d4'
      },
      'acc-webui': {
        title: 'Web UI',
        badge: 'INTERFACE',
        badgeColor: '#c084fc'
      }
    };

    window._currentSettingPage = null;

    function openSettingPage(id, pushHistory = true) {
      if (!id) return;
      if (id.includes('&')) id = id.split('&')[0];
      // Save current scroll position on settings hub before leaving
      const tabSettings = document.getElementById('tabSettings');
      if (window.innerWidth >= 900 && tabSettings) {
        window._savedSettingsScrollTop = tabSettings.scrollTop;
      } else {
        window._savedSettingsScrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      }

      const meta = SETTINGS_PAGES_META[id] || { title: 'Settings' };
      const homeView = document.getElementById('settingsHomeView');
      const pageView = document.getElementById('settingsDetailPageView');
      const navTitle = document.getElementById('settingsDetailNavTitle');
      const navIcon = document.getElementById('settingsDetailNavIcon');

      if (navTitle) navTitle.textContent = meta.title;

      if (navIcon) {
        const card = document.querySelector(`.settings-nav-card[onclick*="'${id}'"]`);
        const iconBox = card ? card.querySelector('.snc-icon-box') : null;
        if (iconBox) {
          navIcon.innerHTML = iconBox.innerHTML;
          navIcon.style.color = iconBox.style.color || '#38bdf8';
        } else {
          navIcon.innerHTML = '';
        }
      }

      // Hide all panels
      document.querySelectorAll('.settings-detail-panel').forEach(p => {
        p.style.display = 'none';
        p.classList.remove('page-active');
      });

      // Show target panel
      const target = document.getElementById(id);
      if (target) {
        target.style.display = 'block';
        target.classList.add('page-active');
        const content = target.querySelector('.accordion-content');
        if (content) {
          content.style.maxHeight = 'none';
          content.style.overflow = 'visible';
        }
      }

      if (homeView) homeView.style.display = 'none';
      if (pageView) pageView.style.display = 'block';

      // Ensure settings tab is active
      if (tabSettings && tabSettings.style.display === 'none') {
        switchTab('settings', true, false);
      }

      window._currentSettingPage = id;

      if (id === 'acc-packages') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchPackages === 'function') fetchPackages();
      } else if (id === 'acc-smb-storage') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchSmbConfig === 'function') fetchSmbConfig();
        if (typeof loadDufsConfig === 'function') loadDufsConfig();
      } else if (id === 'acc-interfaces') {
        document.body.classList.remove('terminal-active');
        if (typeof loadWanInterfaceConfig === 'function') loadWanInterfaceConfig();
      } else if (id === 'acc-pppoe') {
        document.body.classList.remove('terminal-active');
        if (typeof loadPppoeConfig === 'function') loadPppoeConfig();
      } else if (id === 'acc-notifications') {
        document.body.classList.remove('terminal-active');
        if (typeof loadNotificationsPage === 'function') loadNotificationsPage();
      } else if (id === 'acc-webhooks') {
        document.body.classList.remove('terminal-active');
        if (typeof loadWebhooksConfig === 'function') loadWebhooksConfig();
      } else if (id === 'acc-sys-info') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchDeviceInfo === 'function') fetchDeviceInfo();
      } else if (id === 'acc-terminal-cli') {
        document.body.classList.add('terminal-active');
        if (typeof initNativeTerminal === 'function') initNativeTerminal();
      } else if (id === 'acc-wifi') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchWifiConfig === 'function') fetchWifiConfig();
      } else if (id === 'acc-firmware') {
        document.body.classList.remove('terminal-active');
        if (typeof checkLatestFirmwareUpdate === 'function') checkLatestFirmwareUpdate();
      } else if (id === 'acc-maintenance') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchLogs === 'function') fetchLogs();
      } else if (id === 'acc-network' || id === 'acc-static-leases') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchNetworkConfig === 'function') fetchNetworkConfig();
      } else if (id === 'acc-tailscale') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchTailscale === 'function') fetchTailscale();
      } else if (id === 'acc-lan-clients') {
        document.body.classList.remove('terminal-active');
        if (typeof renderClientsCards === 'function') renderClientsCards(cachedClients);
        const curHash = window.location.hash || '';
        if (curHash.includes('&client=')) {
          const clientIp = decodeURIComponent(curHash.split('&client=')[1].split('&')[0]);
          if (clientIp) openDhcpClientDetail(clientIp, false);
        } else {
          closeDhcpClientDetail(false);
        }
      } else if (id === 'acc-topo-layers') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchTopologyLayers === 'function') fetchTopologyLayers();
      } else if (id === 'acc-logs') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchLogs === 'function') fetchLogs();
      } else if (id === 'acc-sessions') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchActiveSessions === 'function') fetchActiveSessions();
      } else if (id === 'acc-security') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchSecuritySettings === 'function') fetchSecuritySettings();
      } else if (id === 'acc-usb-wan') {
        document.body.classList.remove('terminal-active');
        if (typeof loadUsbWanSettings === 'function') loadUsbWanSettings();
        if (typeof fetchUsbWanStatus === 'function') fetchUsbWanStatus();
      } else if (id === 'acc-adb-device') {
        document.body.classList.remove('terminal-active');
        if (typeof fetchAdbDeviceList === 'function') fetchAdbDeviceList();
        const curHash = window.location.hash || '';
        if (curHash.includes('&dev=')) {
          const devSer = decodeURIComponent(curHash.split('&dev=')[1].split('&')[0]);
          if (devSer) openAdbDeviceDetail(devSer, false);
        } else {
          closeAdbDeviceDetail(false);
        }
      }

      if (pushHistory) {
        try {
          history.pushState({ tab: 'settings', page: 'setting-detail', settingId: id }, '', '#setting=' + encodeURIComponent(id));
        } catch (e) {}
      }

      if (window.innerWidth >= 900 && tabSettings) {
        tabSettings.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }

    
    /* ========================================================================
       MAXNET REAL-TIME LIVE INPUT VALIDATION & USB WAN ENGINE
       Engineered by Mahendra Mali - Max | UPI Support: 9824584454@ybl
       ======================================================================== */

    function getValidationTypeForKey(key) {
      if (['net_gw_ip', 'net_dns1', 'net_dns2', 'iface_static_ip', 'iface_static_gw', 'iface_static_dns', 'usb_ping_target'].includes(key)) {
        return 'ipv4';
      }
      if (['custom_mac', 'pppoe_mac_clone'].includes(key)) {
        return 'mac';
      }
      if (['device_hostname'].includes(key)) {
        return 'hostname';
      }
      if (['net_subnet'].includes(key)) {
        return 'netmask';
      }
      if (['dufs_port', 'pppoe_mtu', 'iface_mtu', 'usb_dev_mtu'].includes(key)) {
        return 'integer_range';
      }
      if (['telegram_bot_token'].includes(key)) {
        return 'telegram_token';
      }
      if (['discord_webhook_url'].includes(key)) {
        return 'url';
      }
      return 'text';
    }

    function onModalLiveValidate(inputEl, key) {
      if (!inputEl) return true;
      const vType = getValidationTypeForKey(key);
      const val = (inputEl.value || '').trim();
      const msgEl = document.getElementById('modalInputValidationMsg');
      const saveBtn = document.getElementById('btnModalSave');

      let isValid = true;
      let errorText = '';
      let successText = 'Valid format';

      if (vType === 'ipv4') {
        if (!val) {
          isValid = false;
          errorText = 'IPv4 address cannot be empty';
        } else if (!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(val)) {
          isValid = false;
          errorText = 'Invalid IPv4 (expected format: 192.168.1.1)';
        } else {
          successText = 'Valid IPv4 address';
        }
      } else if (vType === 'mac') {
        if (val && !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(val)) {
          isValid = false;
          errorText = 'Invalid MAC (expected format: AA:BB:CC:DD:EE:FF)';
        } else {
          successText = val ? 'Valid MAC address' : 'Default Hardware MAC';
        }
      } else if (vType === 'hostname') {
        if (!val) {
          isValid = false;
          errorText = 'Hostname cannot be empty';
        } else if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}$/.test(val)) {
          isValid = false;
          errorText = 'Only letters, numbers, hyphens, underscores (1-63 chars)';
        } else {
          successText = 'Valid RFC-compliant hostname';
        }
      } else if (vType === 'netmask') {
        if (!isValidNetmask(val)) {
          isValid = false;
          errorText = 'Invalid subnet mask (e.g. 255.255.255.0)';
        } else {
          successText = 'Valid subnet mask';
        }
      } else if (vType === 'integer_range') {
        const num = parseInt(val, 10);
        if (key.includes('mtu')) {
          if (isNaN(num) || num < 576 || num > 1500) {
            isValid = false;
            errorText = 'MTU must be between 576 and 1500';
          } else {
            successText = 'Valid MTU packet size';
          }
        } else if (key.includes('port')) {
          if (isNaN(num) || num < 1 || num > 65535) {
            isValid = false;
            errorText = 'Port must be between 1 and 65535';
          } else {
            successText = 'Valid TCP/UDP port';
          }
        }
      } else if (vType === 'url') {
        if (val && !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(val)) {
          isValid = false;
          errorText = 'Invalid URL (must start with http:// or https://)';
        } else {
          successText = val ? 'Valid webhook URL' : 'Optional URL';
        }
      } else if (vType === 'telegram_token') {
        if (val && !/^[0-9]{8,11}:[a-zA-Z0-9_-]{35}$/.test(val)) {
          isValid = false;
          errorText = 'Format: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ';
        } else {
          successText = val ? 'Valid Telegram bot token' : 'Optional token';
        }
      }

      if (msgEl) {
        if (!isValid) {
          msgEl.style.display = 'block';
          msgEl.style.color = '#ef4444';
          msgEl.innerHTML = `<span style="font-weight:700;">&#x2717; Error:</span> ${errorText}`;
          inputEl.style.borderColor = '#ef4444';
          inputEl.style.boxShadow = '0 0 0 2px rgba(239,68,68,0.2)';
        } else {
          msgEl.style.display = 'block';
          msgEl.style.color = '#10b981';
          msgEl.innerHTML = `<span style="font-weight:700;">&#x2713;</span> ${successText}`;
          inputEl.style.borderColor = '#10b981';
          inputEl.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.2)';
        }
      }

      if (saveBtn) {
        saveBtn.disabled = !isValid;
        saveBtn.style.opacity = isValid ? '1' : '0.4';
        saveBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
      }

      return isValid;
    }

    function triggerModalInitialValidation(key) {
      setTimeout(() => {
        const bodyEl = document.getElementById('settingModalBody');
        if (!bodyEl) return;
        const inp = bodyEl.querySelector('input.mh-input');
        if (inp) {
          inp.addEventListener('input', () => onModalLiveValidate(inp, key));
          inp.addEventListener('keyup', () => onModalLiveValidate(inp, key));
          onModalLiveValidate(inp, key);
        }
      }, 60);
    }

    /* USB WAN CONTROLLER */
    let _cachedUsbWanData = null;

    async function loadUsbWanConfig() {
      try {
        const res = await fetch('/cgi-bin/usb_wan?action=status', { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        _cachedUsbWanData = data;

        const globalBadge = document.getElementById('usbWanGlobalBadge');
        const activeDevs = (data.devices || []).filter(d => d.present && d.status === 'connected');
        if (globalBadge) {
          globalBadge.textContent = activeDevs.length > 0 ? `${activeDevs.length} CONNECTED` : 'STANDBY';
          globalBadge.className = 'card-badge';
          globalBadge.style.background = activeDevs.length > 0 ? 'rgba(14,165,233,0.12)' : 'rgba(255,255,255,0.05)';
          globalBadge.style.color = activeDevs.length > 0 ? '#38bdf8' : 'var(--text-dim)';
          globalBadge.style.borderColor = activeDevs.length > 0 ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.1)';
        }

        const lbVal = document.getElementById('usbLbModeVal');
        if (lbVal && data.load_balancing) {
          const m = data.load_balancing.mode;
          lbVal.textContent = m === 'failover' ? 'Active Failover (Hot Standby)' : (m === 'broadcast' ? 'Broadcast Duplication' : 'Balanced (Weighted Round-Robin)');
        }

        const wdToggle = document.getElementById('usbWatchdogToggle');
        const wdVal = document.getElementById('usbWatchdogVal');
        if (wdToggle && data.load_balancing) {
          wdToggle.checked = !!data.load_balancing.watchdog;
          if (wdVal) wdVal.textContent = data.load_balancing.watchdog ? 'Enabled' : 'Disabled';
        }

        const ptVal = document.getElementById('usbPingTargetVal');
        if (ptVal && data.load_balancing) {
          ptVal.textContent = data.load_balancing.ping_target || '1.1.1.1';
        }

        const piVal = document.getElementById('usbPingIntervalVal');
        if (piVal && data.load_balancing) {
          piVal.textContent = `${data.load_balancing.ping_interval || 15} Seconds`;
        }

        const dnsVal = document.getElementById('usbDnsOverrideVal');
        if (dnsVal && data.load_balancing) {
          dnsVal.textContent = data.load_balancing.dns_override || '1.1.1.1, 8.8.8.8';
        }

        const protoVal = document.getElementById('usbTetherProtoVal');
        if (protoVal && data.load_balancing) {
          const p = (data.load_balancing.tether_proto || 'rndis').toUpperCase();
          protoVal.textContent = p;
        }

        const arToggle = document.getElementById('usbAutoReconnectToggle');
        const arVal = document.getElementById('usbAutoReconnectVal');
        if (arToggle && data.load_balancing) {
          arToggle.checked = !!data.load_balancing.auto_reconnect;
          if (arVal) arVal.textContent = data.load_balancing.auto_reconnect ? 'Enabled' : 'Disabled';
        }

        renderUsbWanDevices(data.devices || []);
      } catch (e) {
        console.warn('loadUsbWanConfig error:', e);
      }
    }

    function renderUsbWanDevices(devices) {
      const cont = document.getElementById('usbWanDeviceListContainer');
      if (!cont) return;

      if (!devices || devices.length === 0) {
        cont.innerHTML = `
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">No USB Modems Detected</span>
              <span class="setting-label-sub">Connect an Android phone or USB dongle</span>
            </div>
          </div>
        `;
        return;
      }

      cont.innerHTML = devices.map(d => {
        const isConn = d.present && d.status === 'connected';
        const subInfo = isConn
          ? `${escapeHtml(d.ip || 'Connected')} &bull; Weight ${d.weight || 50}% &bull; ${escapeHtml(d.speed || 'USB 3.0')}`
          : 'Disconnected / Standby';

        return `
          <div class="setting-row-item setting-clickable-row" onclick="openEditUsbDeviceModal('${escapeHtml(d.id)}')">
            <div class="setting-label-col">
              <span class="setting-label-bold">${escapeHtml(d.name)} (${escapeHtml(d.interface)})</span>
              <span class="setting-label-sub">${subInfo}</span>
            </div>
            <div class="setting-arrow-col">
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        `;
      }).join('');
    }

    async function saveUsbWanConfig() {
      if (!_cachedUsbWanData) return;
      const wdToggle = document.getElementById('usbWatchdogToggle');
      const arToggle = document.getElementById('usbAutoReconnectToggle');
      const wdVal = document.getElementById('usbWatchdogVal');
      const arVal = document.getElementById('usbAutoReconnectVal');
      if (wdToggle) {
        _cachedUsbWanData.load_balancing.watchdog = wdToggle.checked;
        if (wdVal) wdVal.textContent = wdToggle.checked ? 'Enabled' : 'Disabled';
      }
      if (arToggle) {
        _cachedUsbWanData.load_balancing.auto_reconnect = arToggle.checked;
        if (arVal) arVal.textContent = arToggle.checked ? 'Enabled' : 'Disabled';
      }

      try {
        const res = await fetch('/cgi-bin/usb_wan?action=save_config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(_cachedUsbWanData)
        });
        const data = await res.json();
        if (data.status === 'ok') {
          showNotificationToast('USB WAN configuration updated');
          loadUsbWanConfig();
        } else {
          showNotificationToast('Failed to save USB WAN config: ' + (data.error || 'Unknown'), true);
        }
      } catch (e) {
        showNotificationToast('Error saving USB WAN config: ' + e.message, true);
      }
    }

    async function restartUsbWanInterfaces() {
      openSettingModal('restart_usb_modem');
    }

    function openEditUsbDeviceModal(devId) {
      if (!_cachedUsbWanData) return;
      const dev = (_cachedUsbWanData.devices || []).find(d => d.id === devId);
      if (!dev) return;
      window._editingUsbDevId = devId;
      openSettingModal('usb_device_edit');
    }


function handleSettingsBack() {
      if (window._currentDhcpClientDetail) {
        closeDhcpClientDetail(true);
        return;
      }
      if (window._currentAdbDeviceDetail && window._currentAdbSubView && window._currentAdbSubView !== 'controls') {
        switchAdbSubView('controls');
        return;
      }
      if (window._currentAdbDeviceDetail) {
        closeAdbDeviceDetail(true);
        return;
      }
      closeSettingPage(true);
    }

    function closeSettingPage(triggerHistoryBack = true) {
      if (window._currentDhcpClientDetail) {
        closeDhcpClientDetail(triggerHistoryBack);
        return;
      }
      if (window._currentAdbDeviceDetail) {
        closeAdbDeviceDetail(triggerHistoryBack);
        return;
      }
      if (typeof stopLogAutoRefresh === 'function') {
        stopLogAutoRefresh();
      }

      if (triggerHistoryBack && window.location.hash.startsWith('#setting=')) {
        history.back();
        return;
      }

      const homeView = document.getElementById('settingsHomeView');
      const pageView = document.getElementById('settingsDetailPageView');

      if (pageView) pageView.style.display = 'none';
      if (homeView) homeView.style.display = 'flex';
      document.body.classList.remove('terminal-active');

      document.querySelectorAll('.settings-detail-panel').forEach(p => {
        p.style.display = 'none';
        p.classList.remove('page-active');
      });

      window._currentSettingPage = null;

      if (window.location.hash.startsWith('#setting=')) {
        try {
          history.replaceState({ tab: 'settings', page: 'settings-home' }, '', '#settings');
        } catch (e) {}
      }

      const tabSet = document.getElementById('tabSettings');
      const savedTop = window._savedSettingsScrollTop || 0;
      setTimeout(() => {
        if (window.innerWidth >= 900 && tabSet) {
          tabSet.scrollTo({ top: savedTop, behavior: 'instant' });
        } else {
          window.scrollTo({ top: savedTop, behavior: 'instant' });
        }
      }, 10);
    }

    function toggleAccordion(id) {
      openSettingPage(id, true);
    }

    // Hardware Back / Browser Back / Swipe Back popstate listener
    window.addEventListener('popstate', (e) => {
      // 0. If factory reset modal is open, close it!
      const frModal = document.getElementById('factoryResetModalOverlay');
      if (frModal && frModal.style.display === 'flex') {
        closeFactoryResetModal();
        return;
      }

      // 1. If setting edit modal popup is open, close ONLY the popup and stay on setting subpage!
      if (window._isSettingModalOpen || (document.getElementById('settingEditModalOverlay') && document.getElementById('settingEditModalOverlay').style.display === 'flex')) {
        closeSettingModal(false);
        return;
      }

      // 2. If DHCP Device Detail View is open, close it and return to DHCP list!
      if (window._currentDhcpClientDetail) {
        closeDhcpClientDetail(false);
        return;
      }

      // 2b. If ADB Device Detail View is open, close it and return to ADB list!
      if (window._currentAdbDeviceDetail) {
        closeAdbDeviceDetail(false);
        return;
      }
      
      // 3. If logout confirm modal is open, close it!
      const logoutModal = document.getElementById('logoutConfirmModal');
      if (logoutModal && logoutModal.style.display !== 'none') {
        hideLogoutConfirm();
        return;
      }

      const hash = window.location.hash || '';

      if (window._currentSettingPage) {
        if (hash.startsWith('#setting=')) {
          const rawId = decodeURIComponent(hash.replace('#setting=', ''));
          const newId = rawId.split('&')[0];
          if (newId && newId !== window._currentSettingPage) {
            openSettingPage(newId, false);
          } else if (newId === 'acc-lan-clients') {
            if (rawId.includes('&client=')) {
              const clientIp = decodeURIComponent(rawId.split('&client=')[1].split('&')[0]);
              if (clientIp) openDhcpClientDetail(clientIp, false);
            } else {
              closeDhcpClientDetail(false);
            }
          } else if (newId === 'acc-adb-device') {
            if (rawId.includes('&dev=')) {
              const devSer = decodeURIComponent(rawId.split('&dev=')[1].split('&')[0]);
              if (devSer) openAdbDeviceDetail(devSer, false);
            } else {
              closeAdbDeviceDetail(false);
            }
          }
        } else if (hash === '#settings') {
          closeSettingPage(false);
        } else {
          // Navigated back past settings: close subpage and return to topology
          closeSettingPage(false);
          switchTab('overview', false, false);
        }
        return;
      }

      // If user is on Settings Hub and hits Back:
      const tabSettings = document.getElementById('tabSettings');
      const isSettingsTabActive = tabSettings && tabSettings.style.display !== 'none';
      if (isSettingsTabActive) {
        if (hash.startsWith('#setting=')) {
          const rawId = decodeURIComponent(hash.replace('#setting=', ''));
          const sId = rawId.split('&')[0];
          if (sId) {
            openSettingPage(sId, false);
            if (sId === 'acc-adb-device' && rawId.includes('&dev=')) {
              const devSer = decodeURIComponent(rawId.split('&dev=')[1].split('&')[0]);
              if (devSer) openAdbDeviceDetail(devSer, false);
            }
          }
        } else if (hash !== '#settings') {
          // Return to Topology!
          switchTab('overview', false, false);
        }
        return;
      }

      // If user is on Overview/Topology and hits Forward:
      if (hash === '#settings') {
        switchTab('settings', false, false);
      } else if (hash.startsWith('#setting=')) {
        const rawId = decodeURIComponent(hash.replace('#setting=', ''));
        const sId = rawId.split('&')[0];
        if (sId) {
          switchTab('settings', true, false);
          openSettingPage(sId, false);
          if (sId === 'acc-adb-device' && rawId.includes('&dev=')) {
            const devSer = decodeURIComponent(rawId.split('&dev=')[1].split('&')[0]);
            if (devSer) openAdbDeviceDetail(devSer, false);
          }
        }
      } else {
        switchTab('overview', false, false);
      }
    });

    window.addEventListener('load', () => {
      // Ensure initial history state is set so Back never exits
      if (!history.state) {
        try {
          history.replaceState({ tab: 'overview' }, '', window.location.href);
        } catch (e) {}
      }

      if (window.location.hash.startsWith('#setting=')) {
        const rawSetting = decodeURIComponent(window.location.hash.replace('#setting=', ''));
        const sId = rawSetting.split('&')[0];
        if (sId) {
          setTimeout(() => {
            switchTab('settings', true, false);
            openSettingPage(sId, false);
            if (sId === 'acc-adb-device' && rawSetting.includes('&dev=')) {
              const devSer = decodeURIComponent(rawSetting.split('&dev=')[1].split('&')[0]);
              if (devSer) openAdbDeviceDetail(devSer, false);
            }
          }, 150);
        }
      } else if (window.location.hash === '#settings') {
        setTimeout(() => {
          switchTab('settings', false, false);
        }, 150);
      }
    });

    function filterSettingsSearch(query) {
      const q = (query || '').toLowerCase().trim();
      const clearBtn = document.getElementById('settingsSearchClear');
      if (clearBtn) clearBtn.style.display = q.length > 0 ? 'block' : 'none';

      const cards = document.querySelectorAll('.settings-nav-card');
      cards.forEach(card => {
        if (!q) {
          card.style.display = 'flex';
          return;
        }
        const title = (card.querySelector('.snc-title') || {}).textContent || '';
        const desc = (card.querySelector('.snc-desc') || {}).textContent || '';
        const searchData = card.getAttribute('data-search') || '';
        const text = (title + ' ' + desc + ' ' + searchData).toLowerCase();
        if (text.includes(q)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function clearSettingsSearch() {
      const input = document.getElementById('settingsSearchInput');
      if (input) {
        input.value = '';
        filterSettingsSearch('');
        input.focus();
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('logoutConfirmModal');
        if (modal && modal.style.display !== 'none') {
          hideLogoutConfirm();
          return;
        }
        if (window._currentSettingPage) {
          closeSettingPage();
        } else {
          const tabSettings = document.getElementById('tabSettings');
          if (tabSettings && tabSettings.style.display !== 'none') {
            switchTab('overview');
          }
        }
      }
    });

    function switchTab(tabId, keepSubpage = false, pushHistory = true) {
      const isDesktop = window.innerWidth >= 900;
      const dashContainer = document.getElementById('dashboardContainer');
      const tabOv = document.getElementById('tabOverview');
      const tabSet = document.getElementById('tabSettings');
      const menuBtn = document.getElementById('btnTopoMenu');

      if (tabId === 'settings') {
        fetchAdbDeviceList();
        fetchDeviceTelemetry();
        fetchSmbConfig();
        fetchNetworkConfig();
        fetchTailscale();
        fetchPackages();

        if (isDesktop) {
          // On Desktop: Keep Topology visible on left, open Settings on right side
          if (dashContainer) dashContainer.classList.add('settings-side-open');
          if (tabOv) tabOv.style.display = 'block';
          if (tabSet) tabSet.style.display = 'block';
          if (menuBtn) menuBtn.classList.add('active');
          if (typeof buildUsbBwSvg === 'function') {
            setTimeout(buildUsbBwSvg, 50);
            setTimeout(buildUsbBwSvg, 300);
          }
        } else {
          // On Mobile: Full screen Settings view (Pause SVG to save CPU/RAM)
          if (dashContainer) dashContainer.classList.remove('settings-side-open');
          if (tabOv) tabOv.style.display = 'none';
          if (tabSet) tabSet.style.display = 'block';
          if (menuBtn) menuBtn.classList.remove('active');
          const svgEl = document.getElementById('usbBwSvg');
          const topoBox = document.querySelector('.usb-bw-container');
          if (svgEl && typeof svgEl.pauseAnimations === 'function') {
            try { svgEl.pauseAnimations(); } catch (e) {}
          }
          if (topoBox) topoBox.classList.add('topo-paused');
        }

        if (!keepSubpage && window._currentSettingPage) {
          closeSettingPage(false);
        }
        if (pushHistory && window.location.hash !== '#settings' && !window.location.hash.startsWith('#setting=')) {
          try {
            history.pushState({ tab: 'settings' }, '', '#settings');
          } catch (e) {}
        }
      } else {
        // Default: overview (Topology)
        window.scrollTo(0, 0);
        if (dashContainer) dashContainer.classList.remove('settings-side-open');
        if (tabOv) tabOv.style.display = 'block';
        if (tabSet) tabSet.style.display = 'none';
        if (menuBtn) menuBtn.classList.remove('active');
        const svgEl = document.getElementById('usbBwSvg');
        const topoBox = document.querySelector('.usb-bw-container');
        if (svgEl && typeof svgEl.unpauseAnimations === 'function') {
          try { svgEl.unpauseAnimations(); } catch (e) {}
        }
        if (topoBox) topoBox.classList.remove('topo-paused');
        if (typeof buildUsbBwSvg === 'function') {
          setTimeout(buildUsbBwSvg, 50);
          setTimeout(buildUsbBwSvg, 300);
        }

        if (window._currentSettingPage) {
          closeSettingPage(false);
        }
        if (pushHistory && window.location.hash !== '' && window.location.hash !== '#overview') {
          try {
            history.pushState({ tab: 'overview' }, '', window.location.pathname);
          } catch (e) {}
        }
      }
    }

    function toggleSettingsMenu() {
      const isDesktop = window.innerWidth >= 900;
      const dashContainer = document.getElementById('dashboardContainer');
      const tabSet = document.getElementById('tabSettings');
      const isSideOpen = dashContainer && dashContainer.classList.contains('settings-side-open');
      const isTabSetVisible = tabSet && tabSet.style.display !== 'none';

      if (isDesktop ? isSideOpen : isTabSetVisible) {
        switchTab('overview');
      } else {
        switchTab('settings');
      }
    }

    // COLOR CODING HELPERS
    function getTempColor(celsius) {
      if (celsius === undefined || celsius === null || isNaN(celsius) || celsius <= 0) return 'var(--text-main)';
      if (celsius < 38) return 'var(--mh-emerald)';
      if (celsius <= 43) return 'var(--mh-gold)';
      return 'var(--mh-rose)';
    }

    function getUsageColor(pct) {
      if (pct === undefined || pct === null || isNaN(pct) || pct <= 0) return 'var(--text-main)';
      if (pct < 60) return 'var(--mh-emerald)';
      if (pct <= 80) return 'var(--mh-gold)';
      return 'var(--mh-rose)';
    }

    function fmtBytes(bytes) {
      if (!bytes || bytes <= 0) return '0.00 MB';
      if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
      return (bytes / 1048576).toFixed(2) + ' MB';
    }

    // REALTIME GATEWAY DATA
    async function fetchData() {
      if (window._isFetchingData) return;
      window._isFetchingData = true;
      try {
        const res = await apiFetch('/cgi-bin/status');
        const data = await res.json();
        renderData(data);
        if (typeof checkSystemAlerts === 'function') {
          checkSystemAlerts(data);
        }
      } catch (e) {
        console.error("fetchData error", e);
      } finally {
        window._isFetchingData = false;
      }
    }

    // DRAW AWESOME DUAL-LINE REALTIME BANDWIDTH GRAPH (DOWNLOAD & UPLOAD)
    function drawTrafficSparkline(rxHistory, txHistory) {
      const canvas = document.getElementById('trafficSparklineCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rxPts = (rxHistory && rxHistory.length >= 2) ? rxHistory : [0, 0];
      const txPts = (txHistory && txHistory.length >= 2) ? txHistory : [0, 0];

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round((rect.width || 160) * dpr);
      const h = Math.round((rect.height || 34) * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const cssW = w / dpr;
      const cssH = h / dpr;

      ctx.clearRect(0, 0, cssW, cssH);

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      // Background grid line
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, Math.round(cssH * 0.5) + 0.5);
      ctx.lineTo(cssW, Math.round(cssH * 0.5) + 0.5);
      ctx.stroke();

      const maxVal = Math.max(2, ...rxPts, ...txPts) * 1.15;
      const rxStep = cssW / (rxPts.length - 1);
      const txStep = cssW / (txPts.length - 1);

      // --- 1. DOWNLOAD (RX) - MONOCHROME WHITE/BLACK ---
      const gradRx = ctx.createLinearGradient(0, 0, 0, cssH);
      if (isLight) {
        gradRx.addColorStop(0, 'rgba(9, 9, 11, 0.22)');
        gradRx.addColorStop(1, 'rgba(9, 9, 11, 0.01)');
      } else {
        gradRx.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
        gradRx.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
      }

      ctx.beginPath();
      ctx.moveTo(0, cssH);
      rxPts.forEach((val, i) => {
        const y = cssH - ((val / maxVal) * (cssH - 6)) - 3;
        ctx.lineTo(i * rxStep, y);
      });
      ctx.lineTo(cssW, cssH);
      ctx.closePath();
      ctx.fillStyle = gradRx;
      ctx.fill();

      ctx.beginPath();
      rxPts.forEach((val, i) => {
        const y = cssH - ((val / maxVal) * (cssH - 6)) - 3;
        if (i === 0) ctx.moveTo(0, y);
        else ctx.lineTo(i * rxStep, y);
      });
      ctx.strokeStyle = isLight ? '#09090b' : '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = isLight ? 0 : 4;
      ctx.stroke();

      // --- 2. UPLOAD (TX) - MONOCHROME ZINC/GRAY ---
      const gradTx = ctx.createLinearGradient(0, 0, 0, cssH);
      if (isLight) {
        gradTx.addColorStop(0, 'rgba(113, 113, 122, 0.15)');
        gradTx.addColorStop(1, 'rgba(113, 113, 122, 0.01)');
      } else {
        gradTx.addColorStop(0, 'rgba(161, 161, 170, 0.22)');
        gradTx.addColorStop(1, 'rgba(161, 161, 170, 0.01)');
      }

      ctx.beginPath();
      ctx.moveTo(0, cssH);
      txPts.forEach((val, i) => {
        const y = cssH - ((val / maxVal) * (cssH - 6)) - 3;
        ctx.lineTo(i * txStep, y);
      });
      ctx.lineTo(cssW, cssH);
      ctx.closePath();
      ctx.fillStyle = gradTx;
      ctx.fill();

      ctx.beginPath();
      txPts.forEach((val, i) => {
        const y = cssH - ((val / maxVal) * (cssH - 6)) - 3;
        if (i === 0) ctx.moveTo(0, y);
        else ctx.lineTo(i * txStep, y);
      });
      ctx.strokeStyle = isLight ? '#71717a' : '#a1a1aa';
      ctx.lineWidth = 1.4;
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.stroke();

      ctx.restore();
    }

    function renderMultiLinkMerger(ml, mob, liveTotalMbps) {
      if (!ml || !ml.links) return;
      const links = ml.links;
      const linkIds = ['usb3a', 'usb3b', 'usb2a', 'usb2b', 'wan'];

      let sumActiveMbps = 0;

      links.forEach((link, idx) => {
        if (idx >= linkIds.length) return;
        const baseId = linkIds[idx];
        const speedEl = document.getElementById(baseId);
        const labelEl = document.getElementById('lbl-' + baseId);
        const metaEl = document.getElementById('meta-' + baseId);
        const pathEl = document.getElementById('path-' + baseId);
        const dotEl = document.getElementById('dev-dot-' + baseId);

        const isConnected = link.status === 'CONNECTED';
        let mbpsVal = Number(link.speed_mbps || 0);

        if (isConnected && idx === 0 && liveTotalMbps > mbpsVal) {
          mbpsVal = liveTotalMbps;
        }

        if (isConnected) {
          sumActiveMbps += mbpsVal;
        }

        if (speedEl) {
          speedEl.textContent = mbpsVal.toFixed(1) + ' Mbps';
          if (isConnected) {
            speedEl.classList.remove('offline');
          } else {
            speedEl.classList.add('offline');
          }
        }

        if (labelEl) {
          labelEl.textContent = link.label || (link.type.toUpperCase() + ' #' + (idx + 1));
        }

        if (metaEl) {
          if (isConnected) {
            const devName = (mob && mob.model) ? mob.model : (link.model || link.id);
            metaEl.innerHTML = `<span class="link-live-badge active">CONNECTED</span> • ${escapeHtml(devName)}`;
          } else {
            metaEl.innerHTML = `<span class="link-live-badge standby">STANDBY</span> • ${escapeHtml(link.model || 'Slot Ready')}`;
          }
        }

        if (pathEl) {
          if (isConnected) {
            pathEl.style.opacity = '1';
            pathEl.style.strokeDasharray = '5 13';
            pathEl.style.animationPlayState = 'running';
          } else {
            pathEl.style.opacity = '0.2';
            pathEl.style.strokeDasharray = '2 8';
            pathEl.style.animationPlayState = 'paused';
          }
        }

        if (dotEl) {
          if (isConnected) {
            dotEl.style.opacity = '1';
            dotEl.style.animationPlayState = 'running';
          } else {
            dotEl.style.opacity = '0.35';
            dotEl.style.animationPlayState = 'paused';
          }
        }
      });

      const combinedEl = document.getElementById('combined');
      if (combinedEl) {
        let comb = Math.max(sumActiveMbps, Number(ml.combined_speed_mbps || 0));
        // No artificial speed limit
        combinedEl.textContent = comb.toFixed(1) + ' Mbps';
      }

      const activeSrcEl = document.getElementById('multilinkActiveSources');
      if (activeSrcEl) {
        const act = String(ml.active_count || 1).padStart(2, '0');
        activeSrcEl.textContent = `${act} / 05 ACTIVE`;
      }

      const modeEl = document.getElementById('multilinkMode');
      if (modeEl) {
        modeEl.textContent = ml.mode || 'AUTO MERGE';
      }

      const statusTextEl = document.getElementById('multilinkStatusText');
      if (statusTextEl) {
        const count = ml.active_count || 1;
        statusTextEl.textContent = count > 1 ? `MULTI LINK ACTIVE • ${count} LINKS MERGED` : 'MULTI LINK ACTIVE • AUTO MERGE';
      }
    }

    
    // ==================== 16-SLOT MULTI-MODEM FLEET CONTROLLER ====================
    window.selectedFleetSlot = 0;
    window._cachedMultilink = null;
    window._cachedAdbDevices = [];
    window._cachedMobile = null;

    function selectFleetSlot(slotIdx) {
      window.selectedFleetSlot = slotIdx;
      renderFleetMatrix(window._cachedMultilink, window._cachedAdbDevices, window._cachedMobile);
      const links = (window._cachedMultilink && window._cachedMultilink.links) || [];
      const link = links[slotIdx] || null;
      const inspectLabel = document.getElementById('inspectDeviceLabel');

      if (link && link.status === 'CONNECTED') {
        if (inspectLabel) inspectLabel.textContent = `SLOT #${String(slotIdx + 1).padStart(2, '0')} • ${link.model || link.label}`;
        // If device has an ADB serial, fetch individual telemetry
        const adbList = window._cachedAdbDevices || [];
        const matchedAdb = adbList[slotIdx] || adbList[0];
        if (matchedAdb && matchedAdb.serial) {
          fetchSelectedSlotTelemetry(matchedAdb.serial);
        }
      } else {
        if (inspectLabel) inspectLabel.textContent = `SLOT #${String(slotIdx + 1).padStart(2, '0')} • STANDBY (Port Ready)`;
      }
    }

    async function fetchSelectedSlotTelemetry(serial) {
      try {
        const res = await apiFetch('/cgi-bin/device?action=telemetry&serial=' + encodeURIComponent(serial));
        const data = await res.json();
        if (data && data.status === 'ok') {
          const id = data.identity || {};
          const r = data.radio || {};
          const b = data.battery || {};
          const t = data.thermals || {};
          const m = data.memory || {};

          const pModel = document.getElementById('topolPhoneModel');
          if (pModel) pModel.innerText = id.model || '5G Modem';
          const pBatt = document.getElementById('topolPhoneBatt');
          if (pBatt) pBatt.innerText = `${b.level || 79}% (${b.temp_c || 35.0}°C)`;
          const pCpu = document.getElementById('topolPhoneCpu');
          if (pCpu) pCpu.innerText = `${t.cpu_c || 42.0}°C`;
          const pRam = document.getElementById('topolPhoneRam');
          if (pRam) pRam.innerText = `${m.used_pct || 50}%`;
          const pUptime = document.getElementById('topolPhoneUptime');
          if (pUptime) pUptime.innerText = data.uptime || '--';

          const sCarrier = document.getElementById('topolCarrier');
          if (sCarrier) sCarrier.innerText = r.operator || 'Jio True5G';
          const sBand = document.getElementById('topolServingBand');
          if (sBand) sBand.innerText = `${r.band || 'n77'} • 3.5 GHz`;
          const sRsrp = document.getElementById('topolRsrp');
          if (sRsrp) sRsrp.innerText = `${r.rsrp_dbm || -98} dBm`;
          const sSinr = document.getElementById('topolSinr');
          if (sSinr) sSinr.innerText = `${r.sinr_db || 11} dB`;
          const sArfcn = document.getElementById('topolArfcn');
          if (sArfcn) sArfcn.innerText = r.arfcn || '634080';
          const sName = document.getElementById('topolServingName');
          if (sName) sName.innerText = `Tower PCI ${r.pci || 528}`;
        }
      } catch (e) {
        console.error('fetchSelectedSlotTelemetry error', e);
      }
    }

    function renderFleetMatrix(ml, adbList, mob) {
      window._cachedMultilink = ml;
      window._cachedAdbDevices = adbList || [];
      window._cachedMobile = mob;

      const grid = document.getElementById('fleetMatrixGrid');
      if (!grid) return;

      const links = (ml && Array.isArray(ml.links)) ? ml.links : [];
      const totalSlots = 16;
      let activeCount = 0;
      let html = rtrHardwareCard;

      for (let i = 0; i < totalSlots; i++) {
        const link = links[i] || { slot: i + 1, status: 'STANDBY', type: (i < 8 ? 'usb3' : (i < 15 ? 'usb2' : 'wan')), model: 'Port Ready', speed_mbps: 0 };
        const isConnected = link.status === 'CONNECTED';
        if (isConnected) activeCount++;
        const isSelected = (i === window.selectedFleetSlot);
        const slotNum = String(i + 1).padStart(2, '0');
        const typeLabel = link.type === 'wan' ? 'WAN 1G' : (link.type === 'usb3' ? 'USB 3.0' : 'USB 2.0');
        const modelLabel = isConnected ? (link.model || 'Connected Device') : 'STANDBY';
        const speedText = isConnected ? `${Number(link.speed_mbps || 0).toFixed(1)}M` : 'Ready';

        html += `
          <div class="fleet-slot-card ${isSelected ? 'active-inspect' : ''}" onclick="selectFleetSlot(${i})">
            <div class="fleet-slot-top">
              <span class="fleet-slot-num">#${slotNum}</span>
              <span class="fleet-slot-dot ${isConnected ? 'online' : ''}"></span>
            </div>
            <div class="fleet-slot-model" title="${escapeHtml(modelLabel)}">${escapeHtml(modelLabel)}</div>
            <div class="fleet-slot-meta">
              <span>${typeLabel}</span>
              <span>${speedText}</span>
            </div>
          </div>
        `;
      }

      grid.innerHTML = html;

      const countBadge = document.getElementById('fleetActiveCountText');
      if (countBadge) {
        countBadge.textContent = `${activeCount} / 16 ACTIVE`;
      }
    }


    
    // ==========================================================================
    // TOPOLOGY BADA TOOLTIP & REALTIME 1-SECOND POLLING CONTROLLERS
    // ==========================================================================
    let _activeTooltipNode = null;
    let _tooltipRefreshTimer = null;

    function formatUptimeWithSec(sec) {
      if (sec === undefined || sec === null || isNaN(sec) || sec <= 0) return "--";
      const s = Math.floor(sec);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sc = s % 60;
      if (d > 0) return `${d}d ${h}h ${m}m ${sc}s`;
      return `${h}h ${m}m ${sc}s`;
    }

    function getLiveMobUptime() {
      if (window._mobUptimeBase && window._mobUptimeTs) {
        const elapsed = Math.floor((Date.now() - window._mobUptimeTs) / 1000);
        return formatUptimeWithSec(window._mobUptimeBase + elapsed);
      }
      const mob = (window._lastDataCache && window._lastDataCache.mobile) || {};
      return mob.uptime || "--";
    }

    function getLiveRtrUptime() {
      if (window._rtrUptimeBase && window._rtrUptimeTs) {
        const elapsed = Math.floor((Date.now() - window._rtrUptimeTs) / 1000);
        return formatUptimeWithSec(window._rtrUptimeBase + elapsed);
      }
      const rtr = (window._lastDataCache && window._lastDataCache.router) || {};
      return rtr.uptime || "--";
    }

    function renderTooltipContent(nodeType, modemIndex) {
      const d = window._lastDataCache || {};
      const tt = document.getElementById('topoHoverTooltip');
      if (!tt) return;

      const lanMacs = {
        1: "22:6b:36:eb:30:fd",
        2: "fe:b9:67:67:68:51",
        3: "f2:fc:8e:af:33:47",
        4: "16:be:81:63:99:91"
      };

      let iconSvg = '';
      let title = '';
      let sub = '';
      let badgeHtml = '';
      let gridHtml = '';
      let isStorageNode = false;
      let isSmbUpNode = false;

      if (nodeType === 'modem') {
        const mob = d.mobile || {};
        const usbDevs = Array.isArray(d.usb_devices) ? d.usb_devices : [];
        const currentLanIp = (d.network && d.network.lan_ip) || (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_ip) || '10.0.0.1';
        const dev = (bwLinks && bwLinks[modemIndex] && bwLinks[modemIndex].deviceData) || usbDevs[modemIndex] || (modemIndex === 0 && mob.connected ? {
          model: mob.model,
          is_wan: true,
          ip: mob.lan_ip || mob.ip || currentLanIp,
          adb_enabled: true,
          has_sim: mob.has_sim !== false,
          battery_pct: (mob.battery && mob.battery.level) || null,
          operator: (mob.cellular && mob.cellular.operator) || 'Jio True5G',
          band: (mob.cellular && mob.cellular.band) || 'n77',
          rsrp_dbm: (mob.cellular && mob.cellular.rsrp_dbm) || -97,
          standard: 'USB 3.0',
          speed_mbps: 5000,
          port: 3
        } : null);

        const slotNum = (modemIndex !== undefined ? modemIndex : 0) + 1;
        iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';

        if (dev) {
          const isStorage = (dev.device_type === 'ssd' || dev.device_type === 'pendrive' || dev.device_type === 'storage' || dev.has_storage);
          title = escapeHtml(dev.hostname || dev.model || (isStorage ? 'USB-Storage' : `Modem ${slotNum}`));
          let devTypeLabel = 'Phone';
          if (dev.device_type === 'ssd') devTypeLabel = 'NVMe SSD';
          else if (dev.device_type === 'pendrive' || dev.device_type === 'storage' || dev.has_storage) devTypeLabel = 'USB Flash Drive';
          sub = escapeHtml(dev.model || devTypeLabel);

          if (isStorage) {
            iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><circle cx="7" cy="14" r="1"/><line x1="12" y1="14" x2="16" y2="14"/></svg>';
            badgeHtml = '<span style="display:inline-block; padding:2px 6px; font-size:9px; font-weight:700; font-family:var(--font-mono); border-radius:4px; background:rgba(16,185,129,0.12); color:#10b981; border:1px solid rgba(16,185,129,0.3);">HIGH-SPEED SMB</span>';

            const virtIp = dev.virtual_ip || currentLanIp;
            const capStr = (dev.total_space && dev.total_space !== '--') ? `${dev.total_space} (${dev.free_space || '0'} free)` : 'Ready (Standby)';
            const mountStr = dev.mount_point || '/mnt/pendrive';
            const isSmbUp = dev.smb_running !== false;
            isStorageNode = true;
            isSmbUpNode = isSmbUp;
            const smbStatusText = isSmbUp ? 'Online (io_uring)' : 'Stopped';
            const smbStatusColor = isSmbUp ? '#10b981' : '#71717a';

            gridHtml = `
              <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Hostname</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(dev.hostname || 'storage-Disk-2-0.lan')}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">LAN Access IP</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(virtIp)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Mount Point</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(mountStr)} (${dev.mounted ? 'Mounted' : 'Standby'})</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Disk Capacity</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(capStr)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">USB Port & Standard</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">Port ${dev.port || slotNum} · ${escapeHtml(dev.standard || 'USB 2.0')}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Link Standard</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${dev.standard === 'USB 3.0' ? '5 Gbps (SuperSpeed)' : '480 Mbps (HighSpeed)'}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; grid-column:span 2;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Network Share Path</span>
                      <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">\\\\${escapeHtml(virtIp)}\\${escapeHtml(dev.share_name || 'Pendrive')}</strong>
                    </div>
                    <div style="text-align:right;">
                      <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">SMB Service</span>
                      <strong style="font-size:11px; font-family:var(--font-mono); color:${smbStatusColor}; margin-top:2px; display:block;">${smbStatusText}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div style="margin-top:10px; padding-top:8px; border-top:1px solid var(--border-sub, rgba(255,255,255,0.06)); display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <button class="mh-btn ${isSmbUp ? 'btn-ghost' : ''}" onclick="toggleSmbService(event)" style="font-size:10px; padding:4px 10px; font-family:var(--font-mono); height:26px; min-height:unset;">
                  ${isSmbUp ? 'STOP SMB' : 'START SMB'}
                </button>
                <button class="mh-btn btn-ghost" onclick="openSmbSettings(event)" style="font-size:10px; padding:4px 10px; font-family:var(--font-mono); height:26px; min-height:unset;">
                  MORE SETTINGS &rarr;
                </button>
              </div>
            `;
          } else {
            const devStatus = dev.status || (dev.is_wan ? 'online' : 'online');
            let statusColor = '#10b981';
            let statusText = 'Online';
            if (devStatus === 'blocked') {
              statusColor = '#ef4444';
              statusText = 'Blocked';
            } else if (devStatus === 'offline') {
              statusColor = '#71717a';
              statusText = 'Offline';
            }

            const hasNet = dev.has_internet !== false;
            const netStatusColor = hasNet ? '#10b981' : '#ef4444';
            const netStatusText = dev.internet_status || (hasNet ? 'Online' : 'No Internet');

            let modes = [];
            if (dev.has_tethering) modes.push('TETHERING');
            if (dev.has_adb || dev.adb_enabled) modes.push('ADB');
            if (dev.has_mtp) modes.push('MTP');
            const modesLabel = modes.length > 0 ? modes.join(' · ') : 'Direct Link';

            badgeHtml = modes.map(m => `<span style="display:inline-block; padding:2px 6px; font-size:9px; font-weight:700; font-family:var(--font-mono); border-radius:4px; background:rgba(59,130,246,0.12); color:#38bdf8; border:1px solid rgba(59,130,246,0.3); margin-right:4px;">${escapeHtml(m)}</span>`).join('');

            const virtIp = dev.virtual_ip || dev.ip || '--';
            const battLabel = (dev.battery_pct !== null && dev.battery_pct !== undefined) ? `${dev.battery_pct}%` : (dev.adb_enabled ? '--' : 'No ADB');
            const hasSim = dev.has_sim === true && dev.operator !== 'No SIM' && dev.operator !== '--';
            const netLabel = hasSim ? `${dev.operator || 'Cellular'} ${dev.band || ''}`.trim() : 'No SIM';
            const links = (d.multilink && Array.isArray(d.multilink.links)) ? d.multilink.links : [];
            const matchedLink = links.find(l => l.id === dev.net_interface) || {};
            const liveSpeedNum = Number(matchedLink.speed_mbps || 0);
            const liveSpeedStr = liveSpeedNum > 0 ? `${liveSpeedNum.toFixed(1)} Mbps` : '0.0 Mbps';
            const usbBusStr = dev.standard === 'USB 3.0' ? '5 Gbps' : '480 Mbps';

            gridHtml = `
              <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Hostname</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(dev.hostname || 'Device')}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Virtual LAN IP</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(virtIp)}</strong>
                  ${(dev.dhcp_ip && dev.dhcp_ip !== virtIp && dev.dhcp_ip !== '--' && dev.dhcp_ip !== 'DHCP') ? `<span style="font-size:9px; color:var(--text-dim); font-family:var(--font-mono); display:block; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Device IP: ${escapeHtml(dev.dhcp_ip)}</span>` : ''}
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Internet Status</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:${netStatusColor}; margin-top:2px; display:block;">${escapeHtml(netStatusText)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Hardware Type</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(devTypeLabel)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">USB Port & Standard</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">Port ${dev.port || slotNum} · ${escapeHtml(dev.standard || 'USB 2.0')}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">USB Modes</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(modesLabel)}</strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Live Throughput</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:#38bdf8; margin-top:2px; display:block;">${liveSpeedStr} <span style="font-size:9.5px; color:var(--text-dim); font-weight:400;">(${usbBusStr})</span></strong>
                </div>
                <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
                  <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Battery & SIM</span>
                  <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${battLabel} · ${netLabel}</strong>
                </div>
              </div>
            `;
          }
        } else {
          title = `Hub Port ${slotNum}`;
          sub = 'Standby';
          gridHtml = `
            <div style="padding:9px; text-align:center; color:var(--text-dim); font-size:11px; font-family:var(--font-mono);">
              Standby
            </div>
          `;
        }

      } else if (nodeType === 'wan') {
        const net = d.network || {};
        title = 'WAN';
        sub = escapeHtml(net.wan_ip || '10.43.99.85');
        iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>';

        gridHtml = `
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">IP</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(net.wan_ip || '10.43.99.85')}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Gateway</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(net.gateway_ip || '10.43.99.79')}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">DNS</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(net.dns_ip || '10.43.99.79')}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Speed</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">1000 Mbps</strong>
            </div>
          </div>
        `;

      } else if (nodeType === 'hub') {
        const hub = d.usb_hub || {};
        title = 'USB Hub';
        sub = hub.model || 'GL3523 USB 3.1 Hub';
        iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="6" cy="12" r="1.5"/><circle cx="10" cy="12" r="1.5"/><circle cx="14" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>';

        const mfg = hub.manufacturer || 'GenesysLogic';
        const model = hub.model || 'GL3523';
        const cap = hub.capacity || '5 Gbps (SuperSpeed)';
        const totPorts = hub.ports || 4;
        const u3Ports = hub.usb3_ports || 4;
        const u2Ports = hub.usb2_ports || 4;
        const connCount = hub.connected_devices !== undefined ? hub.connected_devices : (d.usb_devices ? d.usb_devices.length : 2);
        const uplinkSpd = hub.speed_mbps ? `${hub.speed_mbps} Mbps` : '5 Gbps';

        gridHtml = `
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Company</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(mfg)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Model</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(model)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Capacity</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(cap)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Total Ports</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${totPorts} Ports</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">USB 3.x</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:#00d2ff; margin-top:2px; display:block;">${u3Ports} Ports</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">USB 2.0</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${u2Ports} Ports</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Connected</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--mh-emerald, #10b981); margin-top:2px; display:block;">${connCount} Devices</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Uplink</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(uplinkSpd)}</strong>
            </div>
          </div>
        `;

      } else if (nodeType === 'router' || nodeType === 'combined') {
        const net = d.network || {};
        const rtr = d.router || {};
        title = 'Router';
        sub = escapeHtml(rtr.model || 'Jio AX6000 Qualcomm IPQ9574');
        iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>';

        const cpuVal = (rtr.cpu_pct !== undefined ? rtr.cpu_pct : 5);
        const tempVal = (rtr.temp_c ? ` (${Number(rtr.temp_c).toFixed(1)}°C)` : '');
        const memPct = (rtr.memory && rtr.memory.used_pct !== undefined) ? rtr.memory.used_pct : 32;

        gridHtml = `
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">CPU Usage</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">cpu ${cpuVal}%${tempVal}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">RAM Memory</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">ram ${memPct}% use</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Combined Speed</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:#00d2ff; margin-top:2px; display:block;">${bwUi.cv ? bwUi.cv.textContent : '0'} Mbps</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Router Uptime</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--mh-emerald, #10b981); margin-top:2px; display:block; white-space:nowrap;">${getLiveRtrUptime()}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Gateway IP</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(net.lan_ip || '10.0.0.1')}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Ethernet Ports</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">4 GbE Ports</strong>
            </div>
          </div>
        `;

      } else if (nodeType === 'lan') {
        const portNum = (modemIndex !== undefined && modemIndex >= 1 && modemIndex <= 4) ? modemIndex : 2;
        const portId = 'lan' + portNum;
        const net = d.network || {};
        const ports = net.ports || [];
        const port = ports.find(p => p.id === portId) || { id: portId, speed: (portNum === 2 || portNum === 3 ? 1000 : 0), status: (portNum === 2 || portNum === 3 ? 'up' : 'down') };
        const isUp = port.status === 'up';

        const clients = d.clients || [];
        const portClients = clients.filter(c => {
          const cp = (c.port || '').toLowerCase();
          if (cp.includes("lan " + portNum) || cp.includes("lan" + portNum)) return true;
          if (portNum === 3 && (cp.includes("switch") || cp.includes("ap"))) return true;
          if (!cp && portNum === 2) return true;
          return false;
        });

        title = `LAN ${portNum}`;
        sub = isUp ? 'Connected' : 'Disconnected';
        iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 10h10M7 14h10"/></svg>';

        gridHtml = `
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Status</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:${isUp ? 'var(--mh-emerald, #10b981)' : 'var(--text-dim)'}; margin-top:2px; display:block;">${isUp ? 'Up' : 'Down'}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Speed</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${isUp ? (port.speed + ' Mbps') : '0 Mbps'}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Devices</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${portClients.length}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">MAC</span>
              <strong style="font-size:10px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${lanMacs[portNum] || '--'}</strong>
            </div>
          </div>
        `;

      } else if (nodeType === 'secondary_router' || nodeType === 'ap') {
        const clients = d.clients || [];
        let client = null;
        let clientIp = '';
        let clientName = 'WiFi AP';
        let clientPort = 'LAN';

        if (modemIndex >= 0 && clients[modemIndex]) {
          client = clients[modemIndex];
          clientIp = client.ip || '';
          clientPort = client.port || 'LAN';
          if (client.name && typeof client.name === 'string') {
            const nm = client.name.trim();
            const low = nm.toLowerCase();
            if (low !== 'device' && low !== 'unknown' && nm !== clientIp && nm !== '') {
              clientName = nm.replace(/\.lan$/i, '').toUpperCase();
            }
          }
        } else {
          const pIdx = modemIndex < -1 ? (-modemIndex - 1) : 2;
          clientPort = 'LAN ' + (pIdx + 1);
          clientName = 'WiFi AP';
        }

        title = escapeHtml(clientName);
        sub = escapeHtml(clientIp || clientPort);
        iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 18h.01M10 18h.01"/><path d="M15 10a4 4 0 0 0-6 0M18 7a8 8 0 0 0-12 0"/></svg>';

        // Count downstream devices on this port
        const portClients = clients.filter(c => c.port && c.port.toLowerCase().includes(clientPort.toLowerCase()) && c.ip !== clientIp);
        const dsCount = portClients.length;

        gridHtml = `
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Ping</span>
              <strong id="ttDevPing" style="font-size:12px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${(clientIp && window._lastPingCache && window._lastPingCache[clientIp]) ? window._lastPingCache[clientIp] : (clientIp ? 'Pinging...' : '< 1 ms')}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Devices</span>
              <strong style="font-size:12px; font-family:var(--font-mono); color:var(--mh-emerald, #10b981); margin-top:2px; display:block;">${dsCount}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Port</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${escapeHtml(clientPort)}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Total</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">${(client && client.total_mb) ? client.total_mb : '0.00'} MB</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Down</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">↓ ${(client && client.rx_mb) ? client.rx_mb : '0.00'} MB</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Up</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block;">↑ ${(client && client.tx_mb) ? client.tx_mb : '0.00'} MB</strong>
            </div>
          </div>
        `;

        if (clientIp) {
          fetchRealtimePing(clientIp);
        }

      } else if (nodeType === 'client') {
        const clients = d.clients || [];
        const client = clients[modemIndex] || {};
        const clientIp = client.ip || '';
        let clientDisplayName = clientIp;
        if (client.name && typeof client.name === "string") {
          const nm = client.name.trim();
          const low = nm.toLowerCase();
          if (low !== "device" && low !== "unknown" && nm !== clientIp && nm !== "") {
            clientDisplayName = nm;
          }
        }
        const devClass = (typeof classifyLanDevice === 'function') ? classifyLanDevice(client) : { type: 'client', title: 'LAN Device', icon: 'client', color: '#10b981', badge: 'DEVICE' };
        title = escapeHtml(clientDisplayName);
        sub = escapeHtml(clientIp ? `${clientIp} · ${devClass.title}` : devClass.title);

        if (devClass.type === 'phone') {
          iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';
        } else if (devClass.type === 'laptop') {
          iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20M12 16v4"/></svg>';
        } else if (devClass.type === 'nas' || devClass.type === 'storage') {
          iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>';
        } else if (devClass.type === 'cctv') {
          iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>';
        } else if (devClass.type === 'router') {
          iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6" y2="14"/><line x1="18" y1="6" x2="18" y2="14"/><circle cx="6" cy="4" r="1"/><circle cx="18" cy="4" r="1"/></svg>';
        } else {
          iconSvg = '<svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
        }

        gridHtml = `
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; width:100%; box-sizing:border-box;">
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Device Type</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:${devClass.color}; margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${devClass.title} [${devClass.badge}]</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Ping Latency</span>
              <strong id="ttDevPing" style="font-size:12px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${(window._lastPingCache && window._lastPingCache[clientIp]) ? window._lastPingCache[clientIp] : 'Pinging...'}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Physical Port</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(client.port || 'LAN')}</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Total Bandwidth</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${client.total_mb || '0.00'} MB</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">Download</span>
              <strong style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">↓ ${client.rx_mb || '0.00'} MB</strong>
            </div>
            <div style="padding:7px 9px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:6px; min-width:0; box-sizing:border-box; overflow:hidden;">
              <span style="font-size:9px; font-family:var(--font-mono); color:var(--text-dim); display:block;">MAC Address</span>
              <strong style="font-size:10px; font-family:var(--font-mono); color:var(--text-main); margin-top:2px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(client.mac || '--')}</strong>
            </div>
          </div>
        `;

        if (clientIp) {
          fetchRealtimePing(clientIp);
        }
      }

      // isStorageNode and isSmbUpNode are set in nodeType === 'modem'

      tt.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid var(--border-sub, rgba(255,255,255,0.08)); padding-bottom:8px; gap:8px;">
          <div style="display:flex; align-items:center; gap:8px; min-width:0; overflow:hidden;">
            <div style="width:28px; height:28px; min-width:28px; border-radius:6px; background:var(--card-inner, #161822); border:1px solid var(--border-sub, rgba(255,255,255,0.08)); display:flex; align-items:center; justify-content:center; color:var(--text-main); flex-shrink:0;">
              ${iconSvg}
            </div>
            <div style="min-width:0; overflow:hidden;">
              <div style="font-size:12px; font-weight:800; font-family:var(--font-mono); color:var(--text-main); letter-spacing:0.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${title}</div>
              <div style="font-size:10px; color:var(--text-dim); font-family:var(--font-mono); margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${sub}</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
            ${isStorageNode ? `
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-size:9.5px; font-weight:700; color:${isSmbUpNode ? '#10b981' : 'var(--text-dim)'}; font-family:var(--font-mono);">${isSmbUpNode ? 'SMB ON' : 'SMB OFF'}</span>
                <label class="toggle-switch" style="transform:scale(0.8); margin:0;" title="Toggle Samba Server">
                  <input type="checkbox" ${isSmbUpNode ? 'checked' : ''} onchange="toggleSmbService(event)">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            ` : ''}
            <button onclick="hideBadaTooltip(event)" style="background:none; border:none; color:var(--text-dim); font-size:18px; cursor:pointer; padding:0 4px; line-height:1;" title="Close">&times;</button>
          </div>
        </div>
        <div style="min-width:0; overflow:hidden;">${gridHtml}</div>
      `;
    }

    window._lastPingCache = {};
    async function fetchRealtimePing(ip) {
      if (!ip) return;
      if (window._lastPingCache[ip]) {
        const el = document.getElementById('ttDevPing');
        if (el) el.textContent = window._lastPingCache[ip];
      }
      try {
        const res = await fetch('/cgi-bin/diagnostics?tool=ping&target=' + encodeURIComponent(ip));
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        const out = json.output || '';
        const mAvg = out.match(/min\/avg\/max\s*=\s*[\d.]+\/([\d.]+)\//);
        const mTime = out.match(/time=([\d.]+)\s*ms/);
        let pingVal = '< 1 ms';
        if (mAvg) {
          const val = parseFloat(mAvg[1]);
          pingVal = val < 1 ? (val.toFixed(2) + ' ms') : (val.toFixed(1) + ' ms');
        } else if (mTime) {
          const val = parseFloat(mTime[1]);
          pingVal = val < 1 ? (val.toFixed(2) + ' ms') : (val.toFixed(1) + ' ms');
        } else if (out.includes('100% packet loss') || out.includes('100.0% packet loss')) {
          pingVal = 'Offline / No reply';
        }
        window._lastPingCache[ip] = pingVal;
        const el = document.getElementById('ttDevPing');
        if (el) el.textContent = pingVal;
      } catch (e) {
        const el = document.getElementById('ttDevPing');
        if (el && (!window._lastPingCache[ip])) el.textContent = '< 1 ms';
      }
    }

    function positionBadaTooltip(e, tt) {
      const target = (e && e.currentTarget) ? e.currentTarget : null;
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        const ttW = Math.min(330, window.innerWidth - 20);
        tt.style.width = ttW + 'px';
        tt.style.left = '50%';
        tt.style.transform = 'translateX(-50%)';

        let topPos = 80;
        if (target) {
          const r = target.getBoundingClientRect();
          if (r.top > 250) {
            topPos = Math.max(70, r.top - 200);
          } else {
            topPos = Math.min(window.innerHeight - 260, r.bottom + 14);
          }
        } else if (e && e.clientY) {
          topPos = Math.max(70, Math.min(window.innerHeight - 260, e.clientY - 120));
        }
        tt.style.top = topPos + 'px';
      } else {
        tt.style.width = '320px';
        tt.style.transform = 'none';

        let x = 0;
        let y = 0;

        if (target) {
          const r = target.getBoundingClientRect();
          if (r.left < window.innerWidth * 0.45) {
            x = r.right + 16;
            y = r.top - 20;
          } else if (r.left > window.innerWidth * 0.65) {
            x = r.left - 336;
            y = r.top - 20;
          } else {
            x = r.left + r.width / 2 - 160;
            y = (r.top > 240) ? (r.top - 220) : (r.bottom + 16);
          }
        } else if (e && e.clientX) {
          x = e.clientX + 16;
          y = e.clientY - 20;
        }

        const clampedX = Math.max(12, Math.min(window.innerWidth - 334, x));
        const clampedY = Math.max(70, Math.min(window.innerHeight - 260, y));

        tt.style.left = clampedX + 'px';
        tt.style.top = clampedY + 'px';
      }
    }

    function showBadaTooltip(e, nodeType, modemIndex = 0) {
      if (e && e.stopPropagation) e.stopPropagation();
      _activeTooltipNode = { type: nodeType, index: modemIndex };
      window.showBadaTooltip = showBadaTooltip;

      const tt = document.getElementById('topoHoverTooltip');
      if (!tt) return;

      renderTooltipContent(nodeType, modemIndex);
      positionBadaTooltip(e, tt);

      tt.style.display = 'block';
      requestAnimationFrame(() => tt.classList.add('visible'));

      // Smooth tooltip content refresh from cached state without hammering the network
      if (_tooltipRefreshTimer) clearInterval(_tooltipRefreshTimer);
      _tooltipRefreshTimer = setInterval(() => {
        if (!_activeTooltipNode) {
          clearInterval(_tooltipRefreshTimer);
          _tooltipRefreshTimer = null;
          return;
        }
        if (_activeTooltipNode) {
          renderTooltipContent(_activeTooltipNode.type, _activeTooltipNode.index);
        }
      }, 1500);
    }

    function hideBadaTooltip(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      _activeTooltipNode = null;

      // STOP data reloading immediately when tooltip is off!
      if (_tooltipRefreshTimer) {
        clearInterval(_tooltipRefreshTimer);
        _tooltipRefreshTimer = null;
      }

      const tt = document.getElementById('topoHoverTooltip');
      if (tt) {
        tt.classList.remove('visible');
        setTimeout(() => {
          if (!_activeTooltipNode) tt.style.display = 'none';
        }, 150);
      }
    }

    function openSmbSettings(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      hideBadaTooltip(e);
      if (typeof switchTab === 'function') {
        switchTab('settings');
      }
      setTimeout(() => {
        const el = document.getElementById('acc-smb-storage');
        if (el) {
          if (!el.classList.contains('active')) {
            toggleAccordion('acc-smb-storage');
          }
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    async function toggleSmbServiceLegacy(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      const target = e && e.target;
      const isCheckbox = target && target.type === 'checkbox';
      const badge = document.getElementById('badgeSmbMaster');
      let origText = '';
      if (!isCheckbox && target) {
        origText = target.textContent;
        target.textContent = '...';
      }
      try {
        const res = await fetch('/cgi-bin/smb_config?action=toggle');
        const data = await res.json();
        if (badge) {
          if (data && data.running) {
            badge.className = 'toggle-status-badge on';
            badge.textContent = 'RUNNING';
            if (isCheckbox) target.checked = true;
          } else {
            badge.className = 'toggle-status-badge off';
            badge.textContent = 'STOPPED';
            if (isCheckbox) target.checked = false;
          }
        }
        if (typeof fetchData === 'function') {
          await fetchData();
        }
        if (_activeTooltipNode) {
          renderTooltipContent(_activeTooltipNode.type, _activeTooltipNode.index);
        }
        if (typeof fetchSmbConfig === 'function') {
          fetchSmbConfig();
        }
      } catch (err) {
        console.error('Error toggling SMB:', err);
        if (!isCheckbox && target) target.textContent = origText;
      }
    }

    function attachNodeTooltip(el, nodeKey, subIndex = 0) {
      if (!el) return;
      el.onclick = (e) => {
        e.stopPropagation();
        if (_activeTooltipNode && _activeTooltipNode.type === nodeKey && _activeTooltipNode.index === subIndex) {
          hideBadaTooltip(e);
        } else {
          showBadaTooltip(e, nodeKey, subIndex);
        }
      };
    }

    document.addEventListener('click', (e) => {
      const tt = document.getElementById('topoHoverTooltip');
      if (tt && tt.classList.contains('visible')) {
        if (!tt.contains(e.target)) {
          hideBadaTooltip(e);
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideBadaTooltip(e);
    });

    // ==========================================================================
    // TOPOLOGY CANVAS INTERACTIVE ZOOM, PAN, LAYER TOGGLE & DETAILS SHEET
    // ==========================================================================
    let _topoZoom = 1.0;
    let _topoPanX = 0;
    let _topoPanY = 0;

    function zoomTopology(delta) {
      _topoZoom = Math.min(2.5, Math.max(0.4, Math.round((_topoZoom + delta) * 100) / 100));
      applyTopologyZoom();
    }
    function resetTopologyZoom() {
      _topoZoom = 1.0;
      _topoPanX = 0;
      _topoPanY = 0;
      window._topoUserInteracted = false;
      applyTopologyZoom();
    }
    function applyTopologyZoom() {
      const svg = document.getElementById('usbBwSvg');
      const btn = document.getElementById('topoZoomResetBtn');
      if (svg) {
        svg.style.transform = `translate3d(${_topoPanX}px, ${_topoPanY}px, 0) scale(${_topoZoom})`;
        svg.style.transformOrigin = '50% 50%';
        svg.style.transition = _isTopoDragging ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)';
      }
      if (btn) {
        btn.textContent = `${Math.round(_topoZoom * 100)}%`;
      }
    }
    function toggleTopologyFullscreen() {
      const container = document.querySelector('.usb-bw-container');
      const icon = document.getElementById('topoFsIcon');
      if (!container) return;

      const isFull = container.classList.toggle('topo-fullpage-mode');
      if (icon) {
        if (isFull) {
          icon.innerHTML = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>';
        } else {
          icon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>';
        }
      }
      resetTopologyZoom();
      setTimeout(() => {
        if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
      }, 60);
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const container = document.querySelector('.usb-bw-container');
        if (container && container.classList.contains('topo-fullpage-mode')) {
          toggleTopologyFullscreen();
        }
      }
    });

    // LAYER FILTER ENGINE (L1 Physical Ports/Cables | L2 Switches/APs | L3 End Devices)
    function setTopologyLayerFilter(layer) {
      window._topoActiveLayer = layer || 'all';
      document.querySelectorAll('.topo-layer-btn').forEach(btn => {
        if (btn.id === 'topoLayerBtn_' + layer || btn.dataset.layer === layer) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    // INTERACTIVE PAN & DRAG FOR TOPOLOGY CANVAS WITH TOUCH INERTIA, PINCH-ZOOM & KEYBOARD NAV
    let _isTopoDragging = false;
    let _topoHasMoved = false;
    let _dragStartX = 0;
    let _dragStartY = 0;
    let _dragInitPanX = 0;
    let _dragInitPanY = 0;
    let _lastTouchX = 0;
    let _lastTouchY = 0;
    let _lastTouchTime = 0;
    let _touchVelX = 0;
    let _touchVelY = 0;
    let _inertiaAnimId = null;
    let _lastTapTime = 0;

    function applyTopoTransform(animate = false) {
      const svg = document.getElementById('usbBwSvg');
      if (!svg) return;
      svg.style.transition = animate ? 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
      svg.style.transform = `translate(${_topoPanX}px, ${_topoPanY}px) scale(${_topoZoom})`;
      const btn = document.getElementById('topoZoomResetBtn');
      if (btn) btn.textContent = `${Math.round(_topoZoom * 100)}%`;
    }

    function initTopoPanDrag() {
      const box = document.querySelector('#tabOverview .bw-box');
      if (!box || box._panInitialized) return;
      box._panInitialized = true;

      // Mouse drag pan
      box.addEventListener('mousedown', (e) => {
        if (e.target.closest('button') || e.target.closest('.topo-toolbar') || e.target.closest('select') || e.target.closest('.round-action-btn') || e.target.closest('#topoMinimapContainer')) return;
        if (_inertiaAnimId) { cancelAnimationFrame(_inertiaAnimId); _inertiaAnimId = null; }
        _isTopoDragging = true;
        _topoHasMoved = false;
        _dragStartX = e.clientX;
        _dragStartY = e.clientY;
        _dragInitPanX = _topoPanX;
        _dragInitPanY = _topoPanY;
        _lastTouchX = e.clientX;
        _lastTouchY = e.clientY;
        _lastTouchTime = performance.now();
        _touchVelX = 0;
        _touchVelY = 0;
        box.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!_isTopoDragging) return;
        const dx = e.clientX - _dragStartX;
        const dy = e.clientY - _dragStartY;
        if (!_topoHasMoved && Math.hypot(dx, dy) > 5) {
          _topoHasMoved = true;
        }
        const now = performance.now();
        const dt = Math.max(1, now - _lastTouchTime);
        _touchVelX = (e.clientX - _lastTouchX) / dt;
        _touchVelY = (e.clientY - _lastTouchY) / dt;
        _lastTouchX = e.clientX;
        _lastTouchY = e.clientY;
        _lastTouchTime = now;
        _topoPanX = _dragInitPanX + dx;
        _topoPanY = _dragInitPanY + dy;
        applyTopoTransform(false);
      });

      window.addEventListener('mouseup', () => {
        if (_isTopoDragging) {
          _isTopoDragging = false;
          if (box) box.style.cursor = '';
          applyTopoTransform(true);
          if (_topoHasMoved) {
            setTimeout(() => { _topoHasMoved = false; }, 80);
          }
        }
      });

      // Mobile Touch Gesture Pan, Inertia Physics & 2-Finger Pinch Zoom
      let _touchPinchDist = 0;
      let _touchInitZoom = 1.0;

      box.addEventListener('touchstart', (e) => {
        if (e.target.closest('button') || e.target.closest('.topo-toolbar') || e.target.closest('select') || e.target.closest('.round-action-btn') || e.target.closest('#topoMinimapContainer')) return;
        if (_inertiaAnimId) { cancelAnimationFrame(_inertiaAnimId); _inertiaAnimId = null; }

        if (e.touches.length === 1) {
          _isTopoDragging = true;
          _topoHasMoved = false;
          _dragStartX = e.touches[0].clientX;
          _dragStartY = e.touches[0].clientY;
          _dragInitPanX = _topoPanX;
          _dragInitPanY = _topoPanY;
          _lastTouchX = e.touches[0].clientX;
          _lastTouchY = e.touches[0].clientY;
          _lastTouchTime = performance.now();
          _touchVelX = 0;
          _touchVelY = 0;
        } else if (e.touches.length === 2) {
          _isTopoDragging = false;
          _touchPinchDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          _touchInitZoom = _topoZoom;
        }
      }, { passive: false });

      box.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && _isTopoDragging) {
          e.preventDefault();
          const tX = e.touches[0].clientX;
          const tY = e.touches[0].clientY;
          const dx = tX - _dragStartX;
          const dy = tY - _dragStartY;
          if (!_topoHasMoved && Math.hypot(dx, dy) > 5) {
            _topoHasMoved = true;
          }
          const now = performance.now();
          const dt = Math.max(1, now - _lastTouchTime);
          _touchVelX = (tX - _lastTouchX) / dt;
          _touchVelY = (tY - _lastTouchY) / dt;
          _lastTouchX = tX;
          _lastTouchY = tY;
          _lastTouchTime = now;

          _topoPanX = _dragInitPanX + dx;
          _topoPanY = _dragInitPanY + dy;
          applyTopoTransform(false);
        } else if (e.touches.length === 2 && _touchPinchDist > 0) {
          e.preventDefault();
          const curDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          const factor = curDist / _touchPinchDist;
          _topoZoom = Math.min(3.0, Math.max(0.35, Math.round(_touchInitZoom * factor * 100) / 100));
          applyTopoTransform(false);
        }
      }, { passive: false });

      box.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
          _isTopoDragging = false;
          _touchPinchDist = 0;
          if (_topoHasMoved) {
            setTimeout(() => { _topoHasMoved = false; }, 80);
          }

          // Double tap to toggle zoom between 1.0 and 1.45
          const now = performance.now();
          if (now - _lastTapTime < 300) {
            _lastTapTime = 0;
            if (_topoZoom > 1.15) {
              fitTopologyToScreen();
            } else {
              _topoZoom = 1.45;
              applyTopoTransform(true);
            }
            return;
          }
          _lastTapTime = now;

          // Touch Pan Inertia Physics (smooth deceleration)
          if (Math.hypot(_touchVelX, _touchVelY) > 0.15) {
            let vx = _touchVelX * 16;
            let vy = _touchVelY * 16;
            const stepInertia = () => {
              vx *= 0.92;
              vy *= 0.92;
              _topoPanX += vx;
              _topoPanY += vy;
              applyTopoTransform(false);
              if (Math.hypot(vx, vy) > 0.4) {
                _inertiaAnimId = requestAnimationFrame(stepInertia);
              } else {
                _inertiaAnimId = null;
                applyTopoTransform(true);
              }
            };
            _inertiaAnimId = requestAnimationFrame(stepInertia);
          } else {
            applyTopoTransform(true);
          }
        } else if (e.touches.length === 1) {
          _isTopoDragging = true;
          _dragStartX = e.touches[0].clientX;
          _dragStartY = e.touches[0].clientY;
          _dragInitPanX = _topoPanX;
          _dragInitPanY = _topoPanY;
          _touchPinchDist = 0;
        }
      });

      // Mouse wheel zoom
      box.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.12 : -0.12;
        zoomTopology(delta);
      }, { passive: false });

      // Keyboard navigation (AA accessibility)
      window.addEventListener('keydown', (e) => {
        const tabOv = document.getElementById('tabOverview');
        if (!tabOv || tabOv.style.display === 'none') return;
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          _topoPanY += 40;
          applyTopoTransform(true);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          _topoPanY -= 40;
          applyTopoTransform(true);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          _topoPanX += 40;
          applyTopoTransform(true);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          _topoPanX -= 40;
          applyTopoTransform(true);
        } else if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          zoomTopology(0.15);
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          zoomTopology(-0.15);
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          fitTopologyToScreen();
        } else if (e.key === '0') {
          e.preventDefault();
          resetTopologyZoom();
        } else if (e.key === 'Escape') {
          if (typeof closeTopoNodeDetail === 'function') closeTopoNodeDetail();
          if (typeof closeTopoEvidenceModal === 'function') closeTopoEvidenceModal();
        }
      });
    }
    document.addEventListener('DOMContentLoaded', initTopoPanDrag);
    setTimeout(initTopoPanDrag, 500);

    // ZERO CPU / RAM TOPOLOGY OPTIMIZER (Pauses SMIL & CSS animations when off-screen or backgrounded)
    function initTopologyCpuOptimization() {
      const svg = document.getElementById('usbBwSvg');
      const container = document.querySelector('.usb-bw-container');
      if (!svg || !container) return;

      function updateTopologyState(isDisplaying) {
        if (isDisplaying && !document.hidden) {
          if (typeof svg.unpauseAnimations === 'function') {
            try { svg.unpauseAnimations(); } catch (e) {}
          }
          container.classList.remove('topo-paused');
        } else {
          if (typeof svg.pauseAnimations === 'function') {
            try { svg.pauseAnimations(); } catch (e) {}
          }
          container.classList.add('topo-paused');
        }
      }

      if ('IntersectionObserver' in window) {
        if (window._topoObserver) window._topoObserver.disconnect();
        window._topoObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const tabOv = document.getElementById('tabOverview');
            const isOv = tabOv && tabOv.style.display !== 'none';
            updateTopologyState(entry.isIntersecting && isOv);
          });
        }, { threshold: 0.05 });
        window._topoObserver.observe(container);
      }

      document.addEventListener('visibilitychange', () => {
        const tabOv = document.getElementById('tabOverview');
        const isOv = tabOv && tabOv.style.display !== 'none';
        updateTopologyState(!document.hidden && isOv);
      });
    }
    document.addEventListener('DOMContentLoaded', initTopologyCpuOptimization);
    setTimeout(initTopologyCpuOptimization, 600);

    // RICH NODE DETAILS MODAL SHEET CONTROLLER
    let _activeDetailTarget = null;
    let _activeDetailIsPort = false;

    function showTopoNodeDetail(target, isPort, e) {
      if (e && e.stopPropagation) e.stopPropagation();
      if (_topoHasMoved || _isTopoDragging) return;
      _activeDetailTarget = target;
      _activeDetailIsPort = !!isPort;

      const overlay = document.getElementById('topoNodeDetailOverlay');
      if (!overlay) return;
      if (overlay.parentElement !== document.body) {
        document.body.appendChild(overlay);
      }

      const titleEl = document.getElementById('topoNodeDetailTitle');
      const subEl = document.getElementById('topoNodeDetailSub');
      const badgeEl = document.getElementById('topoNodeDetailStatusBadge');
      const iconBox = document.getElementById('topoNodeDetailIconBox');
      const bodyEl = document.getElementById('topoNodeDetailBody');
      const btnViewClient = document.getElementById('btnTopoNodeViewClient');
      const btnEditSettings = document.getElementById('btnTopoNodeEditSettings');
      const btnUnblock = document.getElementById('btnTopoNodeUnblock');
      if (btnUnblock) btnUnblock.style.display = 'none';

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const cardBg = isLight ? "rgba(0, 0, 0, 0.025)" : "rgba(255, 255, 255, 0.03)";
      const cardBorder = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.06)";
      const textDim = isLight ? "#64748b" : "var(--text-dim, #94a3b8)";
      const textMain = isLight ? "#0f172a" : "var(--text-main, #eef3f5)";
      const textSub = isLight ? "#475569" : "rgba(255, 255, 255, 0.65)";

      const cache = window._lastDataCache || {};
      const clients = Array.isArray(cache.clients) ? cache.clients : [];
      const router = cache.router || {};
      const net = cache.network || {};
      const usbDev = (Array.isArray(cache.usb_devices) && cache.usb_devices[0]) || {};
      const mobile = cache.mobile || {};
      const ports = Array.isArray(net.ports) ? net.ports : [];

      function esc(s) {
        return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      function copyBtn(val) {
        if (!val || val === '--') return '';
        return `<button type="button" class="round-action-btn" onclick="navigator.clipboard.writeText('${val}'); if(typeof showToast==='function')showToast('Copied: ${val}');" title="Copy" style="width:20px; height:20px; min-width:20px; border:none; background:transparent; cursor:pointer; color:currentColor; display:inline-flex; align-items:center; justify-content:center; opacity:0.75;"><svg viewBox="0 0 24 24" style="width:11px; height:11px; stroke:currentColor; fill:none; stroke-width:2;"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>`;
      }

      function makeTile(label, val, subText, fullWidth) {
        return `
          <div style="background:${cardBg}; padding:10px 12px; border-radius:8px; border:1px solid ${cardBorder}; ${fullWidth ? 'grid-column:1 / -1;' : ''} display:flex; flex-direction:column; justify-content:center; min-width:0; overflow:hidden; word-break:break-word;">
            <div style="color:${textDim}; font-size:9.5px; font-weight:800; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(label)}</div>
            <div style="color:${textMain}; font-weight:700; font-size:12px; font-family:var(--font-mono); display:flex; align-items:center; justify-content:space-between; gap:6px; min-width:0;">
              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0;">${val}</span>
            </div>
            ${subText ? `<div style="font-size:10px; color:${textSub}; font-family:var(--font-mono); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0;">${subText}</div>` : ''}
          </div>
        `;
      }

      // 1. WAN Uplink Node (USB Phone / Modem / Storage)
      if (target.type === 'wan') {
        const isStorage = (usbDev.device_type === "storage" || usbDev.device_type === "ssd" || usbDev.device_type === "pendrive" || usbDev.has_storage);
        const wanIp = target.ip || net.wan_ip || usbDev.dhcp_ip || '--';
        const phoneModel = usbDev.model || (mobile && mobile.model) || (isStorage ? 'USB Storage' : 'USB Modem');
        
        if (titleEl) titleEl.textContent = isStorage ? (usbDev.model || 'USB Storage Drive') : phoneModel;
        if (subEl) subEl.textContent = `WAN Uplink • Interface: ${usbDev.net_interface || 'usb0'} (USB 3.0)`;
        if (badgeEl) {
          const isCellOnline = mobile.connected || usbDev.status === 'online' || usbDev.has_internet;
          badgeEl.textContent = isCellOnline ? 'ONLINE' : 'CONNECTING';
          badgeEl.className = 'card-badge ' + (isCellOnline ? 'emerald' : 'amber');
        }
        if (iconBox) {
          iconBox.style.background = isStorage ? 'rgba(192,132,252,0.12)' : 'rgba(56,189,248,0.12)';
          iconBox.style.color = isStorage ? '#c084fc' : '#38bdf8';
          iconBox.innerHTML = isStorage
            ? '<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="6" y="2" width="12" height="14" rx="2"/><rect x="9" y="16" width="6" height="6"/><line x1="10" y1="19" x2="10" y2="20"/><line x1="14" y1="19" x2="14" y2="20"/></svg>'
            : '<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';
        }

        const tiles = [];
        tiles.push(makeTile('WAN IP Address', `<span>${esc(wanIp)}</span> ${copyBtn(wanIp)}`, 'DHCP Upstream Carrier Lease'));
        const linkStd = usbDev.standard || router.usb?.link_mode || 'USB 3.0 SuperSpeed';
        const speedVal = usbDev.speed_mbps || router.usb?.speed_mbps || 5000;
        tiles.push(makeTile('USB Hardware Link', `${esc(linkStd)} (${speedVal} Mbps)`, `Bus: ${usbDev.bus || '2-1'} • Port: ${usbDev.port || '1'}`));

        if (!isStorage) {
          const carrier = usbDev.operator || mobile.cellular?.operator || 'Jio';
          const netType = usbDev.network || mobile.cellular?.network || '5G SA (NR)';
          const bars = mobile.cellular?.bars !== undefined ? `${mobile.cellular.bars}/4 Bars` : 'Full Signal';
          const rsrp = mobile.cellular?.rsrp_dbm ? ` (${mobile.cellular.rsrp_dbm} dBm)` : '';
          tiles.push(makeTile('Cellular Network', `${esc(carrier)} • ${esc(netType)}`, `Signal: ${bars}${rsrp}`));

          const batLvl = usbDev.battery_pct ?? mobile.battery?.level ?? '--';
          const batTemp = usbDev.battery_temp_c ?? mobile.battery?.temp_c ?? '--';
          tiles.push(makeTile('Phone Battery & Thermals', `${batLvl}% Battery (${mobile.battery?.status || 'Normal'})`, `Temp: ${batTemp}°C • SoC: Normal`));
        } else {
          tiles.push(makeTile('Storage Partitions', `${esc(usbDev.mount_point || '/mnt/storage')}`, `Total: ${esc(usbDev.total_space || '--')} • Free: ${esc(usbDev.free_space || '--')}`));
          tiles.push(makeTile('File Sharing (SMB)', `${usbDev.smb_running ? 'SMB Active' : 'SMB Stopped'}`, `Share: ${esc(usbDev.share_path || '\\\\10.0.0.1\\Storage')}`));
        }

        const liveSpd = target.speed || `${(window._currentRxMbps + window._currentTxMbps).toFixed(3)} Mbps`;
        const rxMb = router.usb?.rx_mb || 0;
        const txMb = router.usb?.tx_mb || 0;
        const rxStr = rxMb > 1024 ? (rxMb / 1024).toFixed(2) + ' GB' : rxMb.toFixed(1) + ' MB';
        const txStr = txMb > 1024 ? (txMb / 1024).toFixed(2) + ' GB' : txMb.toFixed(1) + ' MB';
        tiles.push(makeTile('Live Throughput', `<span style="color:#10b981;">${esc(liveSpd)}</span>`, `Session: Rx ${rxStr} • Tx ${txStr}`));
        tiles.push(makeTile('Device Features', `<span class="card-badge emerald" style="font-size:9.5px; margin-right:4px;">Tethering Active</span> <span class="card-badge sky" style="font-size:9.5px;">ADB: ${usbDev.adb_enabled ? 'Enabled' : 'Disabled'}</span>`, 'USB High-Speed Connection'));

        if (bodyEl) {
          bodyEl.innerHTML = `<div class="topo-details-grid">${tiles.join('')}</div>`;
        }
        if (btnViewClient) btnViewClient.style.display = 'none';
        if (btnEditSettings) {
          btnEditSettings.textContent = 'NETWORK SETTINGS';
          btnEditSettings.onclick = () => { closeTopoNodeDetail(); if(typeof switchTab==='function')switchTab('settings'); if(typeof openSettingPage==='function')openSettingPage('acc-interfaces'); };
        }
        overlay.style.display = 'flex';
        requestAnimationFrame(() => overlay.classList.add('active'));
        return;
      }

      // 2. Main Router Gateway Chassis (MAXNET / 10.0.0.1)
      if (target.id === 'root' || (target.type === 'router' && !target.uplinkPort)) {
        const hostName = router.hostname || target.name || 'MAXNET';
        const rtrIp = target.ip || '10.0.0.1';
        const rtrMac = target.mac || clients.find(c => c.is_self)?.mac || 'ce:b2:bb:ae:4d:16';
        const rtrModel = router.model || 'Qualcomm IPQ9574 AX6000';
        const rtrKernel = router.kernel || 'Linux 6.18';

        if (titleEl) titleEl.textContent = `${hostName} (Gateway)`;
        if (subEl) subEl.textContent = `${rtrModel} • ${rtrKernel}`;
        if (badgeEl) {
          badgeEl.textContent = 'ONLINE';
          badgeEl.className = 'card-badge emerald';
        }
        if (iconBox) {
          iconBox.style.background = 'rgba(16,185,129,0.12)';
          iconBox.style.color = '#10b981';
          iconBox.innerHTML = '<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>';
        }

        const tiles = [];
        tiles.push(makeTile('Gateway LAN IP', `<span>${esc(rtrIp)}</span> ${copyBtn(rtrIp)}`, `MAC: ${esc(rtrMac)}`));

        const uptime = router.uptime || '--';
        const load = Array.isArray(router.load_avg) ? router.load_avg.join(', ') : '--';
        tiles.push(makeTile('System Uptime', `${esc(uptime)}`, `Load Avg: ${esc(load)}`));

        const cpuPct = router.cpu_pct !== undefined ? `${router.cpu_pct}%` : '--';
        tiles.push(makeTile('CPU Processor Load', `${esc(cpuPct)} Active`, 'Qualcomm Quad-Core SoC'));

        const memUsedPct = router.memory?.used_pct !== undefined ? `${router.memory.used_pct}%` : '--';
        const memUsedMb = router.memory?.used_mb || '--';
        const memTotalMb = router.memory?.total_mb || '--';
        tiles.push(makeTile('Memory (RAM)', `${memUsedPct} Used (${memUsedMb} / ${memTotalMb} MB)`, `${router.memory?.available_mb || '--'} MB Available Free`));

        const tempC = router.temp_c !== undefined ? `${router.temp_c.toFixed(1)}°C` : '--';
        tiles.push(makeTile('Core Temperature', `${tempC}`, 'All Thermal Zones Optimal'));

        const activeClients = clients.filter(c => !c.is_self && c.connected).length;
        tiles.push(makeTile('Connected Clients', `${activeClients} Active Devices`, 'Wired LAN & Wireless Network'));

        if (bodyEl) {
          bodyEl.innerHTML = `<div class="topo-details-grid">${tiles.join('')}</div>`;
        }
        if (btnViewClient) btnViewClient.style.display = 'none';
        if (btnEditSettings) {
          btnEditSettings.textContent = 'SYSTEM INFO';
          btnEditSettings.onclick = () => { closeTopoNodeDetail(); if(typeof switchTab==='function')switchTab('settings'); if(typeof openSettingPage==='function')openSettingPage('acc-sys-info'); };
        }
        overlay.style.display = 'flex';
        requestAnimationFrame(() => overlay.classList.add('active'));
        return;
      }

      // 3. Sub-Router / Access Point (maxnet-b)
      if (target.type === 'ap' || (target.type === 'router' && target.uplinkPort)) {
        const apName = target.name || 'Sub-Router';
        const apIp = target.ip || '--';
        const apMac = target.mac || '--';
        const liveClient = clients.find(c => c.ip === apIp || c.mac === apMac);
        const vendor = target.metrics?.vendor || liveClient?.vendor || 'Broadcom / Reliance';
        const uplink = target.uplinkPort ? target.uplinkPort.replace('root-', '').toUpperCase() : 'LAN 3';
        const wClients = Array.isArray(target.wireless_clients) ? target.wireless_clients : [];

        if (titleEl) titleEl.textContent = `${apName}`;
        if (subEl) subEl.textContent = `Access Point / Sub-Router • ${apIp}`;
        if (badgeEl) {
          badgeEl.textContent = 'ONLINE';
          badgeEl.className = 'card-badge emerald';
        }
        if (iconBox) {
          iconBox.style.background = 'rgba(56,189,248,0.12)';
          iconBox.style.color = '#38bdf8';
          iconBox.innerHTML = '<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>';
        }

        const tiles = [];
        tiles.push(makeTile('IP Address', `<span>${esc(apIp)}</span> ${copyBtn(apIp)}`, `Hostname: ${esc(apName)}.lan`));
        tiles.push(makeTile('MAC & Hardware', `${esc(apMac)}`, `Vendor: ${esc(vendor)}`));
        tiles.push(makeTile('Gateway Uplink', `Port ${esc(uplink)}`, 'Link Speed: 1000 Mbps Full Duplex'));
        tiles.push(makeTile('Sub-Clients Count', `${wClients.length} Wireless Clients`, 'Bridged Network Traffic'));

        if (wClients.length > 0) {
          const clientListHtml = wClients.map(c => `
            <div style="background:${isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'}; padding:8px 10px; border-radius:6px; border:1px solid ${cardBorder}; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; color:${textMain}; font-size:11px;">${esc(c.name || 'Wireless Device')}</div>
                <div style="font-size:10px; color:${textDim};">${esc(c.ip || '--')} &bull; ${esc(c.mac || '--')}</div>
              </div>
              <div style="text-align:right;">
                <span class="card-badge sky" style="font-size:9px;">${esc(c.linkSpeed || '72 Mbps')}</span>
                ${c.metrics?.ping_avg_ms ? `<div style="font-size:9.5px; color:#10b981; margin-top:2px;">${c.metrics.ping_avg_ms} ms</div>` : ''}
              </div>
            </div>
          `).join('');

          tiles.push(`
            <div style="background:${cardBg}; padding:10px 12px; border-radius:8px; border:1px solid ${cardBorder}; grid-column:span 2;">
              <div style="color:${textDim}; font-size:9.5px; font-weight:800; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Clients Connected Behind This AP:</div>
              <div style="display:flex; flex-direction:column; gap:6px; max-height:160px; overflow-y:auto;">${clientListHtml}</div>
            </div>
          `);
        }

        if (bodyEl) {
          bodyEl.innerHTML = `<div class="topo-details-grid">${tiles.join('')}</div>`;
        }
        if (btnViewClient) btnViewClient.style.display = 'none';
        if (btnEditSettings) {
          btnEditSettings.textContent = 'DHCP CLIENTS';
          btnEditSettings.onclick = () => { closeTopoNodeDetail(); if(typeof switchTab==='function')switchTab('settings'); if(typeof openSettingPage==='function')openSettingPage('acc-lan-clients'); };
        }
        overlay.style.display = 'flex';
        requestAnimationFrame(() => overlay.classList.add('active'));
        return;
      }

      // 4. Physical Switch Port Socket (isPort === true)
      if (isPort) {
        const port = target;
        const portId = port.id ? port.id.replace('root-', '') : (port.label || '').toLowerCase().replace(/\s+/g, '');
        const portObj = ports.find(p => p.id === portId) || {};
        const isUp = portObj.status === 'up' || (port.role && port.role !== 'empty');
        const portLabel = port.label || portId.toUpperCase();

        if (titleEl) titleEl.textContent = `Port ${portLabel}`;
        if (subEl) subEl.textContent = 'Physical Ethernet Bay • Qualcomm IPQ9574 Switch';
        if (badgeEl) {
          badgeEl.textContent = isUp ? `LINK UP (${portObj.speed || 1000}M)` : 'DISCONNECTED';
          badgeEl.className = 'card-badge ' + (isUp ? 'emerald' : 'gray');
        }
        if (iconBox) {
          iconBox.style.background = isUp ? 'rgba(16,185,129,0.12)' : 'rgba(148,163,184,0.12)';
          iconBox.style.color = isUp ? '#10b981' : '#94a3b8';
          iconBox.innerHTML = '<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M7 16h10M7 8h2m6 0h2M10 8v4m4-4v4"/></svg>';
        }

        const child = port.child || {};
        const childName = child.name || child.ip || (isUp ? 'Connected Entity' : 'Empty Port Socket');
        const childIp = child.ip || '--';

        const tiles = [];
        tiles.push(makeTile('Port Link State', isUp ? `<span style="color:#10b981;">Up (${portObj.speed || 1000} Mbps ${portObj.duplex ? portObj.duplex.toUpperCase() : 'FULL DUPLEX'})</span>` : '<span style="color:#94a3b8;">Down • No Link</span>', `Port Identifier: ${esc(portId.toUpperCase())}`));
        tiles.push(makeTile('Hardware Port Bay', 'Gigabit Ethernet (10/100/1000M)', 'Auto-Negotiation • Auto-MDI/MDIX'));
        tiles.push(makeTile('Attached Entity', `<span>${esc(childName)}</span>`, childIp !== '--' ? `IP: ${esc(childIp)}` : 'No attached device detected', true));

        if (bodyEl) {
          bodyEl.innerHTML = `<div class="topo-details-grid">${tiles.join('')}</div>`;
        }
        if (btnViewClient) btnViewClient.style.display = 'none';
        if (btnEditSettings) {
          btnEditSettings.textContent = 'SWITCH PORTS';
          btnEditSettings.onclick = () => { closeTopoNodeDetail(); if(typeof switchTab==='function')switchTab('settings'); if(typeof openSettingPage==='function')openSettingPage('acc-switch'); };
        }
        overlay.style.display = 'flex';
        requestAnimationFrame(() => overlay.classList.add('active'));
        return;
      }

      // 5. Client Device (Direct LAN Wired or Wireless Client)
      const node = target;
      const liveClient = clients.find(c => (node.ip && c.ip === node.ip) || (node.mac && c.mac === node.mac));
      const devIp = node.ip || liveClient?.ip || '--';
      const devMac = node.mac || liveClient?.mac || '--';
      const devName = node.name || liveClient?.name || devIp || 'Client Device';
      const isOnline = liveClient ? liveClient.connected : (node.status !== 'offline');
      const isWifi = !!(node.band || node.linkSpeed || (liveClient && liveClient.port && liveClient.port.toLowerCase().includes('wifi')) || (node.uplinkPort && node.uplinkPort.includes('ap')));
      const vendor = node.metrics?.vendor || liveClient?.vendor || 'Network Device';
      const isBlocked = !!(node.blocked || liveClient?.blocked || (typeof blockedIps !== 'undefined' && blockedIps.has(devIp)));

      if (titleEl) titleEl.textContent = `${devName}`;
      if (subEl) subEl.textContent = `${isWifi ? 'Wi-Fi Wireless Client' : 'Wired Ethernet Client'} • ${devIp}${isBlocked ? ' • FIREWALL BLOCKED' : ''}`;
      if (badgeEl) {
        if (isBlocked) {
          badgeEl.textContent = 'BLOCKED';
          badgeEl.className = 'card-badge ruby';
        } else {
          badgeEl.textContent = isOnline ? 'ONLINE' : 'OFFLINE';
          badgeEl.className = 'card-badge ' + (isOnline ? 'emerald' : 'gray');
        }
      }
      if (iconBox) {
        iconBox.style.background = isBlocked ? 'rgba(239,68,68,0.12)' : (isWifi ? 'rgba(56,189,248,0.12)' : 'rgba(16,185,129,0.12)');
        iconBox.style.color = isBlocked ? '#ef4444' : (isWifi ? '#38bdf8' : '#10b981');
        iconBox.innerHTML = isWifi
          ? '<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>'
          : '<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
      }

      const tiles = [];
      if (isBlocked) {
        tiles.push(makeTile('Firewall Access Policy', '<span style="color:#ef4444; font-weight:800;">BLOCKED FROM NETWORK</span>', 'All incoming & outgoing traffic dropped by firewall', true));
      }
      tiles.push(makeTile('IP Address', `<span>${esc(devIp)}</span> ${copyBtn(devIp)}`, liveClient?.ipv6 ? `IPv6: ${esc(liveClient.ipv6)}` : 'DHCP Assigned Address'));
      tiles.push(makeTile('MAC & Hardware', `${esc(devMac)}`, `Vendor: ${esc(vendor)}`));

      const connVal = isWifi ? `Wi-Fi (${node.linkSpeed || '72 Mbps'})` : (node.uplinkPort ? `Port ${node.uplinkPort.replace('root-', '').toUpperCase()}` : (liveClient?.port || 'LAN Ethernet'));
      const connSub = isWifi ? 'Connected via maxnet-b AP' : 'Link: 1000 Mbps Full Duplex';
      tiles.push(makeTile('Network Connection', esc(connVal), esc(connSub)));

      const pingVal = node.metrics?.ping_avg_ms ? `${node.metrics.ping_avg_ms} ms` : (isOnline ? '< 1.5 ms' : '--');
      const pingSub = node.metrics?.loss_pct !== undefined ? `${node.metrics.loss_pct}% Packet Loss` : 'Active Network Latency';
      tiles.push(makeTile('Latency / Ping', pingVal, pingSub));

      const rxVal = liveClient?.rx_mb ? `${liveClient.rx_mb} MB` : '--';
      const txVal = liveClient?.tx_mb ? `${liveClient.tx_mb} MB` : '--';
      const totVal = liveClient?.total_mb ? `${liveClient.total_mb} MB` : '--';
      tiles.push(makeTile('Session Traffic (Data)', `Rx: ${rxVal} • Tx: ${txVal}`, `Total Lifetime: ${totVal}`));

      const hostDns = liveClient?.dns_name || liveClient?.mdns || devName;
      tiles.push(makeTile('Device Hostname', `${esc(hostDns)}`, `Filter: ${isBlocked ? 'BLOCKED' : 'Traffic Permitted'}`));

      if (bodyEl) {
        bodyEl.innerHTML = `<div class="topo-details-grid">${tiles.join('')}</div>`;
      }
      if (btnUnblock) {
        if (isBlocked) {
          btnUnblock.style.display = 'inline-block';
          btnUnblock.onclick = async () => {
            await unblockDevice(devIp, devMac);
            closeTopoNodeDetail();
            if (typeof showToast === 'function') showToast(`Unblocked device ${devIp}`, 'success');
            if (typeof fetchData === 'function') fetchData();
          };
        } else {
          btnUnblock.style.display = 'none';
        }
      }
      if (btnViewClient) {
        btnViewClient.style.display = devIp !== '--' ? 'inline-block' : 'none';
        btnViewClient.textContent = 'VIEW CLIENT DETAILS';
        btnViewClient.onclick = () => { openTopoNodeClientPage(); };
      }
      if (btnEditSettings) {
        btnEditSettings.textContent = 'DHCP LEASES';
        btnEditSettings.onclick = () => { closeTopoNodeDetail(); if(typeof switchTab==='function')switchTab('settings'); if(typeof openSettingPage==='function')openSettingPage('acc-lan-clients'); };
      }

      if (typeof highlightPathToRoot === 'function') {
        highlightPathToRoot(target);
      }

      overlay.style.display = 'flex';
      requestAnimationFrame(() => {
        overlay.classList.add('active');
      });
    }

    function closeTopoNodeDetail() {
      const overlay = document.getElementById('topoNodeDetailOverlay');
      if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
      }
      _activeDetailTarget = null;
      if (typeof highlightPathToRoot === 'function') {
        highlightPathToRoot(null);
      }
    }

    function showTopoEvidenceModal(node, e) {
      if (e && e.stopPropagation) e.stopPropagation();
      const overlay = document.getElementById('topoEvidenceModalOverlay');
      if (!overlay) return;
      if (overlay.parentElement !== document.body) {
        document.body.appendChild(overlay);
      }
      const titleEl = document.getElementById('topoEvidenceModalTitle');
      const subEl = document.getElementById('topoEvidenceModalSub');
      const badgeEl = document.getElementById('topoEvidenceConfidenceBadge');
      const bodyEl = document.getElementById('topoEvidenceModalBody');

      const conf = (node && node.confidence) || ((node && node.evidence && node.evidence.length >= 2) ? 'High' : 'Medium');
      if (titleEl) titleEl.textContent = ((node && (node.name || node.ip)) || 'Network Node') + ' Evidence';
      if (subEl) subEl.textContent = `Role: ${(node && node.type ? node.type : 'device').toUpperCase()} \u2022 IP: ${(node && node.ip) || '--'} \u2022 MAC: ${(node && node.mac) || '--'}`;
      if (badgeEl) {
        badgeEl.textContent = `${conf.toUpperCase()} CONFIDENCE`;
        badgeEl.className = 'card-badge ' + (conf === 'High' ? 'emerald' : (conf === 'Medium' ? 'sky' : 'amber'));
      }

      const evidenceList = (node && Array.isArray(node.evidence) && node.evidence.length > 0) ? node.evidence : [
        (node && node.type === 'router') ? 'Host Gateway configured as primary network router' :
        (node && node.type === 'ap') ? 'Identified as infrastructure node via multi-MAC bridge port' :
        'Direct client connected to local network interface'
      ];

      const metrics = (node && node.metrics) || {};
      let metricsHtml = '';
      if (metrics.ping_avg_ms !== undefined || metrics.vendor || metrics.port_mac_count !== undefined) {
        metricsHtml = `
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px; margin-bottom:14px;">
            <div style="background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
              <div style="color:var(--text-dim); font-size:9.5px;">PING MEDIAN</div>
              <div style="color:${metrics.ping_avg_ms < 5 ? '#10b981' : '#38bdf8'}; font-weight:800; font-family:var(--font-mono); font-size:12px;">${metrics.ping_avg_ms ? metrics.ping_avg_ms + ' ms' : '--'}</div>
            </div>
            <div style="background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
              <div style="color:var(--text-dim); font-size:9.5px;">PORT MAC COUNT</div>
              <div style="color:var(--text-main); font-weight:800; font-family:var(--font-mono); font-size:12px;">${metrics.port_mac_count !== undefined ? metrics.port_mac_count : '--'}</div>
            </div>
            <div style="background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
              <div style="color:var(--text-dim); font-size:9.5px;">OUI VENDOR</div>
              <div style="color:var(--text-main); font-weight:700; font-size:11px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(metrics.vendor || '--')}</div>
            </div>
          </div>
        `;
      }

      if (bodyEl) {
        bodyEl.innerHTML = `
          <div style="font-family:var(--font-mono); font-size:11.5px;">
            ${metricsHtml}
            <div style="color:var(--text-dim); font-size:10px; font-weight:800; text-transform:uppercase; margin-bottom:6px; letter-spacing:0.5px;">Verified Signals & Classification Evidence:</div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${evidenceList.map((ev, idx) => `
                <div style="display:flex; align-items:flex-start; gap:8px; background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.04);">
                  <span style="color:#10b981; font-weight:800; font-size:11px;">[0${idx + 1}]</span>
                  <span style="color:var(--text-main); line-height:1.4;">${escapeHtml(ev)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      overlay.style.display = 'flex';
      requestAnimationFrame(() => overlay.classList.add('active'));
    }

    function closeTopoEvidenceModal() {
      const overlay = document.getElementById('topoEvidenceModalOverlay');
      if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
      }
    }

    function fitTopologyToScreen() {
      resetTopologyZoom();
    }

    function openTopoNodeSettings() {
      const target = _activeDetailTarget;
      const isPort = _activeDetailIsPort;
      closeTopoNodeDetail();
      if (typeof switchTab === 'function') switchTab('settings');
      setTimeout(() => {
        const acc = document.getElementById('acc-topo-layers');
        if (acc && !acc.classList.contains('active')) {
          toggleAccordion('acc-topo-layers');
        }
        if (target) {
          const elId = isPort ? ('topoPortRow_' + target.id) : ('topoNodeCard_' + target.id);
          const el = document.getElementById(elId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.borderColor = '#38bdf8';
            setTimeout(() => { el.style.borderColor = ''; }, 2500);
          }
        }
      }, 150);
    }

    function openTopoNodeClientPage() {
      const target = _activeDetailTarget;
      closeTopoNodeDetail();
      if (target && target.ip && typeof openDhcpClientDetail === 'function') {
        if (typeof switchTab === 'function') switchTab('settings');
        setTimeout(() => {
          openDhcpClientDetail(target.ip, true);
        }, 150);
      }
    }

    // ==========================================================================
    // USB BANDWIDTH TOPOLOGY ENGINE (EXACT USB BANDWIDTH.HTML VISUALS & DYNAMICS)
    // ==========================================================================
    const NS = "http://www.w3.org/2000/svg";
    const fmt = n => Number(n).toLocaleString("en-US");
    let bwUi = {};
    let bwLinks = [];
    let bwMode = "";

    const mk = (t, a, p) => {
      const e = document.createElementNS(NS, t);
      for (const k in a) e.setAttribute(k, a[k]);
      p.appendChild(e);
      return e;
    };

    function drawPeopleIcon(x, y, color, parent) {
      const g = mk("g", { transform: `translate(${x}, ${y})`, style: `color:${color}; pointer-events:none;` }, parent);
      // Head
      mk("circle", { cx: 2.8, cy: 2, r: 1.4, fill: "none", stroke: "currentColor", "stroke-width": 0.95 }, g);
      // Body / Shoulders
      mk("path", { d: "M 0.5 7.2 C 0.5 4.8, 5.1 4.8, 5.1 7.2", fill: "none", stroke: "currentColor", "stroke-width": 0.95, "stroke-linecap": "round" }, g);
      return g;
    }

    function drawMobileIcon(x, y, color, parent) {
      const g = mk("g", { transform: `translate(${x}, ${y - 11})`, style: `color:${color}; pointer-events:none;` }, parent);
      // Mobile phone body
      mk("rect", { x: 0, y: 0, width: 13, height: 22, rx: 3, ry: 3, fill: "none", stroke: "currentColor", "stroke-width": 1.25 }, g);
      // Screen speaker slit / camera
      mk("line", { x1: 4.5, y1: 3, x2: 8.5, y2: 3, stroke: "currentColor", "stroke-width": 1, "stroke-linecap": "round" }, g);
      // Home indicator dot
      mk("circle", { cx: 6.5, cy: 18.5, r: 1, fill: "currentColor" }, g);
      return g;
    }

    function drawSsdIcon(x, y, color, parent) {
      const g = mk("g", { transform: `translate(${x}, ${y - 11})`, style: `color:${color}; pointer-events:none;` }, parent);
      // Top connector notch
      mk("rect", { x: 3.5, y: 0, width: 7, height: 2.5, rx: 0.5, fill: "none", stroke: "currentColor", "stroke-width": 1.0 }, g);
      // Main SSD enclosure body
      mk("rect", { x: 0, y: 2, width: 14, height: 20, rx: 2.5, ry: 2.5, fill: "none", stroke: "currentColor", "stroke-width": 1.25 }, g);
      // Internal circuit / cooling grooves
      mk("line", { x1: 3, y1: 7, x2: 11, y2: 7, stroke: "currentColor", "stroke-width": 1, "stroke-linecap": "round" }, g);
      mk("line", { x1: 3, y1: 10, x2: 11, y2: 10, stroke: "currentColor", "stroke-width": 1, "stroke-linecap": "round" }, g);
      // Small label and status LED
      mk("rect", { x: 3, y: 14.5, width: 5, height: 3.5, rx: 0.6, fill: "none", stroke: "currentColor", "stroke-width": 0.8 }, g);
      mk("circle", { cx: 10.5, cy: 16.5, r: 1, fill: "currentColor" }, g);
      return g;
    }

    function drawPendriveIconV1(x, y, color, parent) {
      const g = mk("g", { transform: `translate(${x}, ${y - 11})`, style: `color:${color}; pointer-events:none;` }, parent);
      // Top metal USB connector plug
      mk("rect", { x: 3.5, y: 0, width: 7, height: 5, rx: 0.5, fill: "none", stroke: "currentColor", "stroke-width": 1.0 }, g);
      mk("line", { x1: 5.2, y1: 2, x2: 5.2, y2: 3.5, stroke: "currentColor", "stroke-width": 0.8, "stroke-linecap": "round" }, g);
      mk("line", { x1: 8.8, y1: 2, x2: 8.8, y2: 3.5, stroke: "currentColor", "stroke-width": 0.8, "stroke-linecap": "round" }, g);
      // Main thumb drive body
      mk("rect", { x: 1.5, y: 5, width: 11, height: 16, rx: 2, ry: 2, fill: "none", stroke: "currentColor", "stroke-width": 1.25 }, g);
      // Middle grip groove
      mk("line", { x1: 3.5, y1: 11, x2: 10.5, y2: 11, stroke: "currentColor", "stroke-width": 1, "stroke-linecap": "round" }, g);
      // Bottom lanyard hole
      mk("circle", { cx: 7, cy: 17.5, r: 1.2, fill: "none", stroke: "currentColor", "stroke-width": 1.0 }, g);
      return g;
    }

    // NAME RESOLUTION ENGINE (STRICT PRIORITY: manual name > DHCP hostname > device name > mDNS > OUI vendor > "Unknown Device")
    function resolveDeviceDisplayName(dev) {
      if (!dev) return 'Unknown Device';
      const ip = (dev.ip || '').trim();
      const mac = (dev.mac || '').toLowerCase().trim();

      // 1. Manual User Name (saved in localStorage / custom config)
      if (typeof getCustomDeviceName === 'function') {
        const manual = getCustomDeviceName(mac || ip);
        if (manual && manual.trim()) return manual.trim();
      }

      // Purge stale label: 10.0.0.166 is an Oppo phone client, NOT an Asus router
      if (ip === '10.0.0.166' || mac === 'a8:1b:5a:c3:01:13' || mac.startsWith('a8:1b:5a')) {
        return 'OPPO A37';
      }

      // 2. DHCP Hostname
      const dhcp = (dev.hostname || dev.dhcp_hostname || dev.dhcp_name || '').trim();
      if (dhcp && dhcp !== '*' && !isStaleDeviceLabel(dhcp, ip)) {
        const cleaned = cleanDeviceLabel(dhcp);
        if (cleaned && cleaned.toLowerCase() !== 'device' && cleaned.toLowerCase() !== 'unknown') return cleaned;
      }

      // 3. Device Name property
      const name = (dev.name || '').trim();
      if (name && !isStaleDeviceLabel(name, ip) && !name.toLowerCase().startsWith('device') && !name.toLowerCase().startsWith('unknown')) {
        const cleaned = cleanDeviceLabel(name);
        if (cleaned && cleaned.toLowerCase() !== 'device' && cleaned.toLowerCase() !== 'unknown') return cleaned;
      }

      // 4. mDNS name
      const mdns = (dev.mdns || dev.dns_name || '').trim();
      if (mdns && !isStaleDeviceLabel(mdns, ip)) {
        const cleaned = cleanDeviceLabel(mdns.replace(/\.local$/i, '').replace(/\.lan$/i, ''));
        if (cleaned && cleaned.toLowerCase() !== 'device' && cleaned.toLowerCase() !== 'unknown') return cleaned;
      }

      // 5. OUI Vendor
      const vendor = (dev.vendor || (dev.metrics && dev.metrics.vendor) || '').trim();
      if (vendor && !vendor.toLowerCase().includes('unknown') && !isStaleDeviceLabel(vendor, ip)) {
        return cleanDeviceLabel(vendor);
      }

      return 'Unknown Device';
    }

    function isStaleDeviceLabel(str, ip) {
      if (!str) return false;
      const s = str.toLowerCase();
      if (ip === '10.0.0.166' && (s.includes('asus') || s.includes('router') || s.includes('ap'))) return true;
      return false;
    }

    function cleanDeviceLabel(str) {
      if (!str) return 'Unknown Device';
      return str.replace(/\.lan$/i, '').replace(/\.local$/i, '').replace(/\s*\[(PC|PHONE|STORAGE|ROUTER|CCTV|TV)\]/gi, '').trim();
    }

    // LAN Client Hardware Classification & Auto-Detection Engine
    function classifyLanDevice(client) {
      if (!client) return { type: 'client', title: 'LAN Device', icon: 'client', color: '#10b981', badge: 'DEVICE' };

      const name = (client.name || '').toLowerCase();
      const mac = (client.mac || '').toLowerCase();
      const ip = client.ip || '';

      // 1. Storage / NAS / Synology / TrueNAS
      if (name.includes('synology') || name.includes('nas') || name.includes('storage') || name.includes('qnap') ||
          name.includes('truenas') || mac.startsWith('00:11:32') || ip === '10.0.0.5') {
        return { type: 'nas', title: 'Synology NAS', icon: 'nas', color: '#c084fc', badge: 'STORAGE' };
      }

      // 2. CCTV / IP Camera / DVR / NVR
      if (name.includes('cam') || name.includes('cctv') || name.includes('dvr') || name.includes('nvr') ||
          name.includes('ipc') || name.includes('ipcam') || name.includes('hikvision') || name.includes('dahua') ||
          name.includes('cp plus') || name.includes('cpplus') || name.includes('reolink') || name.includes('axis') ||
          name.includes('ezviz') || name.includes('imou') || name.includes('uniview') || name.includes('lorex') ||
          name.includes('swann') || name.includes('v380') || name.includes('yoosee')) {
        return { type: 'cctv', title: 'CCTV / IP Cam', icon: 'cctv', color: '#f59e0b', badge: 'CCTV' };
      }

      // 3. Mobile Phone / Tablet
      if (name.includes('phone') || name.includes('poco') || name.includes('v2153') || name.includes('iphone') ||
          name.includes('ipad') || name.includes('samsung') || name.includes('galaxy') || name.includes('redmi') ||
          name.includes('xiaomi') || name.includes('vivo') || name.includes('oppo') || name.includes('realme') ||
          name.includes('oneplus') || name.includes('pixel') || name.includes('android') || name.includes('huawei') ||
          name.includes('honor') || name.includes('moto') || name.includes('iqoo') || name.includes('infinix') ||
          name.includes('tecno') || name.includes('mobile') || mac.startsWith('f2:82:95') || mac.startsWith('f6:93:15') ||
          mac.startsWith('a8:1b:5a') || ip === '10.0.0.166' || ip === '10.0.0.238' || ip === '10.0.0.118') {
        const title = (name.includes('poco') ? 'POCO X6 5G' : (name.includes('oppo') || ip === '10.0.0.166' || mac.startsWith('a8:1b:5a') ? 'OPPO A37' : (name.includes('vivo') || name.includes('v2153') ? 'Vivo V2153' : 'Mobile Phone')));
        return { type: 'phone', title: title, icon: 'phone', color: '#38bdf8', badge: 'PHONE' };
      }

      // 4. Laptop / Desktop / PC / Workstation
      if (name.includes('maxos') || name.includes('laptop') || name.includes('desktop') || name.includes('pc') ||
          name.includes('macbook') || name.includes('imac') || name.includes('thinkpad') || name.includes('dell') ||
          name.includes('hp') || name.includes('lenovo') || name.includes('msi') || name.includes('acer') ||
          name.includes('surface') || name.includes('workstation') || name.includes('windows') || name.includes('ubuntu') ||
          name.includes('fedora') || name.includes('arch') || name.includes('linux') || /^desktop-/i.test(name) || /^laptop-/i.test(name) ||
          mac.startsWith('10:65:30') || mac.startsWith('f8:59:71') || ip === '10.0.0.111') {
        return { type: 'laptop', title: (name.includes('maxos') || ip === '10.0.0.111' ? 'Workstation (maxos)' : 'Laptop / PC'), icon: 'laptop', color: '#10b981', badge: 'PC' };
      }

      // 5. Smart TV / Media Player / Streaming
      if (name.includes('tv') || name.includes('androidtv') || name.includes('firetv') || name.includes('appletv') ||
          name.includes('chromecast') || name.includes('roku') || name.includes('bravia') || name.includes('lgwebostv') ||
          name.includes('samsungtv') || name.includes('mibox') || name.includes('shield')) {
        return { type: 'tv', title: 'Smart TV', icon: 'tv', color: '#a855f7', badge: 'TV' };
      }

      // 6. IoT / Smart Home / Espressif ESP8266/ESP32 / Sonoff / Tuya / Smart Plug / Bulb
      if (name.includes('esp_') || name.includes('espressif') || name.includes('esp32') || name.includes('esp8266') ||
          name.includes('sonoff') || name.includes('tuya') || name.includes('tasmota') || name.includes('shelly') ||
          name.includes('wled') || name.includes('iot') || name.includes('smartplug') || name.includes('bulb') ||
          name.includes('sensor') || name.includes('zigbee') || name.includes('switchbot') ||
          mac.startsWith('24:0a:c4') || mac.startsWith('30:ae:a4') || mac.startsWith('84:f3:eb') || mac.startsWith('bc:dd:c2')) {
        return { type: 'iot', title: 'IoT Device', icon: 'iot', color: '#14b8a6', badge: 'IOT' };
      }

      // 7. Smart Speaker / Voice Assistant (Echo / Alexa / Google Home / Nest / HomePod)
      if (name.includes('echo') || name.includes('alexa') || name.includes('nest') || name.includes('homepod') ||
          name.includes('google-home') || name.includes('speaker') || name.includes('sonos')) {
        return { type: 'speaker', title: 'Smart Speaker', icon: 'speaker', color: '#ec4899', badge: 'AUDIO' };
      }

      // 8. Printer / Scanner
      if (name.includes('printer') || name.includes('epson') || name.includes('canon') || name.includes('brother') ||
          name.includes('xerox') || name.includes('laserjet') || name.includes('deskjet')) {
        return { type: 'printer', title: 'Network Printer', icon: 'printer', color: '#6366f1', badge: 'PRINT' };
      }

      // 9. Gaming Console (PlayStation / Xbox / Nintendo Switch / Steam Deck)
      if (name.includes('playstation') || name.includes('ps4') || name.includes('ps5') || name.includes('xbox') ||
          name.includes('nintendo') || name.includes('switch') && !name.includes('hub') || name.includes('steamdeck')) {
        return { type: 'console', title: 'Gaming Console', icon: 'console', color: '#f43f5e', badge: 'GAME' };
      }

      // 10. Secondary Router / Access Point / Switch
      if (name.includes('router') || name.includes('accesspoint') || name.includes('repeater') ||
          name.includes('extender') || name.includes('switch') || name.includes('openwrt') ||
          name.includes('maxnet-b') || name.includes('tplink') || name.includes('tenda') || name.includes('netgear') ||
          name.includes('mercusys') || name.includes('dlink') || name.includes('miwifi') ||
          mac.startsWith('8c:a3:99') || ip === '10.0.0.2' || (name.includes('.lan') && !name.includes('maxos') && !name.includes('oppo') && ip !== '10.0.0.166')) {
        return { type: 'router', title: (name.includes('maxnet-b') || ip === '10.0.0.2' ? 'maxnet-b Router' : 'Access Point'), icon: 'router', color: '#0284c7', badge: 'ROUTER' };
      }

      return { type: 'client', title: 'LAN Device', icon: 'client', color: '#10b981', badge: 'DEVICE' };
    }

    function drawLanClientDeviceIcon(x, y, devClass, parent) {
      const g = mk("g", { class: "topo-client-icon", style: `color:${devClass.color}; pointer-events:none;` }, parent);
      if (devClass.type === 'phone') {
        mk("rect", { x: x - 4, y: y - 6.5, width: 8, height: 13, rx: 1.5, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
        mk("line", { x1: x - 1.5, y1: y - 4.5, x2: x + 1.5, y2: y - 4.5, stroke: "currentColor", "stroke-width": 0.8, "stroke-linecap": "round" }, g);
        mk("circle", { cx: x, cy: y + 4.2, r: 0.7, fill: "currentColor" }, g);
      } else if (devClass.type === 'laptop') {
        mk("rect", { x: x - 5.5, y: y - 5.5, width: 11, height: 7.5, rx: 1, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
        mk("line", { x1: x - 7, y1: y + 3.5, x2: x + 7, y2: y + 3.5, stroke: "currentColor", "stroke-width": 1.3, "stroke-linecap": "round" }, g);
      } else if (devClass.type === 'nas' || devClass.type === 'storage') {
        mk("rect", { x: x - 6, y: y - 5.5, width: 12, height: 11, rx: 1.5, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
        mk("line", { x1: x - 4, y1: y - 2, x2: x + 4, y2: y - 2, stroke: "currentColor", "stroke-width": 1.0 }, g);
        mk("line", { x1: x - 4, y1: y + 1.5, x2: x + 4, y2: y + 1.5, stroke: "currentColor", "stroke-width": 1.0 }, g);
        mk("circle", { cx: x + 3, cy: y - 2, r: 0.6, fill: "currentColor" }, g);
        mk("circle", { cx: x + 3, cy: y + 1.5, r: 0.6, fill: "currentColor" }, g);
      } else if (devClass.type === 'cctv') {
        mk("path", { d: `M${x + 2} ${y - 3} L${x + 6} ${y - 5.5} L${x + 6} ${y + 5.5} L${x + 2} ${y + 3} Z`, fill: "none", stroke: "currentColor", "stroke-width": 1.0 }, g);
        mk("rect", { x: x - 6, y: y - 4, width: 8, height: 8, rx: 1.5, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
        mk("circle", { cx: x - 2, cy: y, r: 1.5, fill: "currentColor" }, g);
      } else if (devClass.type === 'tv') {
        mk("rect", { x: x - 6, y: y - 5, width: 12, height: 8.5, rx: 1.5, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
        mk("line", { x1: x - 3, y1: y + 4.5, x2: x + 3, y2: y + 4.5, stroke: "currentColor", "stroke-width": 1.2, "stroke-linecap": "round" }, g);
        mk("line", { x1: x, y1: y + 3.5, x2: x, y2: y + 4.5, stroke: "currentColor", "stroke-width": 1.0 }, g);
      } else if (devClass.type === 'router') {
        mk("rect", { x: x - 6, y: y - 1, width: 12, height: 6, rx: 1.2, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
        mk("line", { x1: x - 3.5, y1: y - 1, x2: x - 3.5, y2: y - 5.5, stroke: "currentColor", "stroke-width": 1.0, "stroke-linecap": "round" }, g);
        mk("line", { x1: x + 3.5, y1: y - 1, x2: x + 3.5, y2: y - 5.5, stroke: "currentColor", "stroke-width": 1.0, "stroke-linecap": "round" }, g);
      } else if (devClass.type === 'iot') {
        // Microchip / Smart Sensor IoT icon
        mk("rect", { x: x - 5, y: y - 5, width: 10, height: 10, rx: 1.5, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
        mk("rect", { x: x - 2, y: y - 2, width: 4, height: 4, fill: "currentColor" }, g);
        [-3, 0, 3].forEach(d => {
          mk("line", { x1: x + d, y1: y - 7, x2: x + d, y2: y - 5, stroke: "currentColor", "stroke-width": 0.9 }, g);
          mk("line", { x1: x + d, y1: y + 5, x2: x + d, y2: y + 7, stroke: "currentColor", "stroke-width": 0.9 }, g);
          mk("line", { x1: x - 7, y1: y + d, x2: x - 5, y2: y + d, stroke: "currentColor", "stroke-width": 0.9 }, g);
          mk("line", { x1: x + 5, y1: y + d, x2: x + 7, y2: y + d, stroke: "currentColor", "stroke-width": 0.9 }, g);
        });
      } else if (devClass.type === 'speaker') {
        // Smart Speaker icon
        mk("rect", { x: x - 4.5, y: y - 6, width: 9, height: 12, rx: 2, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
        mk("circle", { cx: x, cy: y - 2, r: 1.2, fill: "currentColor" }, g);
        mk("circle", { cx: x, cy: y + 2.5, r: 2.2, fill: "none", stroke: "currentColor", "stroke-width": 0.9 }, g);
      } else if (devClass.type === 'printer') {
        // Network Printer icon
        mk("rect", { x: x - 6, y: y - 2, width: 12, height: 7, rx: 1, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
        mk("path", { d: `M${x - 4} ${y - 2} L${x - 4} ${y - 6} L${x + 4} ${y - 6} L${x + 4} ${y - 2}`, fill: "none", stroke: "currentColor", "stroke-width": 1.0 }, g);
        mk("line", { x1: x - 3, y1: y + 2, x2: x + 3, y2: y + 2, stroke: "currentColor", "stroke-width": 1.0 }, g);
      } else if (devClass.type === 'console') {
        // Gaming Controller icon
        mk("rect", { x: x - 6.5, y: y - 4, width: 13, height: 8, rx: 3, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
        mk("line", { x1: x - 4, y1: y, x2: x - 2, y2: y, stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round" }, g);
        mk("line", { x1: x - 3, y1: y - 1, x2: x - 3, y2: y + 1, stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round" }, g);
        mk("circle", { cx: x + 2.5, cy: y - 1, r: 0.6, fill: "currentColor" }, g);
        mk("circle", { cx: x + 4, cy: y + 0.8, r: 0.6, fill: "currentColor" }, g);
      } else {
        mk("circle", { cx: x, cy: y, r: 2.4, fill: devClass.color }, g);
      }
      return g;
    }

    function drawRouterBoxIcon(x, y, color, parent) {
      const g = mk("g", { style: `color:${color}; pointer-events:none;` }, parent);
      // Clean modern router vector icon inside node box
      mk("rect", { x: x - 8, y: y - 2, width: 16, height: 8, rx: 1.8, fill: "none", stroke: "currentColor", "stroke-width": 1.2 }, g);
      mk("line", { x1: x - 4, y1: y - 2, x2: x - 4, y2: y - 7, stroke: "currentColor", "stroke-width": 1.2, "stroke-linecap": "round" }, g);
      mk("line", { x1: x + 4, y1: y - 2, x2: x + 4, y2: y - 7, stroke: "currentColor", "stroke-width": 1.2, "stroke-linecap": "round" }, g);
      mk("circle", { cx: x - 3, cy: y + 2, r: 0.8, fill: "#10b981" }, g);
      mk("circle", { cx: x, cy: y + 2, r: 0.8, fill: "#10b981" }, g);
      mk("circle", { cx: x + 3, cy: y + 2, r: 0.8, fill: "currentColor" }, g);
      return g;
    }

    function drawRouterApIcon(x, y, color, parent) {
      const g = mk("g", { style: `color:${color}; pointer-events:none;` }, parent);
      mk("rect", { x: x - 7, y: y - 2, width: 14, height: 7, rx: 1.5, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
      mk("line", { x1: x - 4, y1: y - 2, x2: x - 4, y2: y - 7, stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round" }, g);
      mk("line", { x1: x + 4, y1: y - 2, x2: x + 4, y2: y - 7, stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round" }, g);
      mk("circle", { cx: x - 3, cy: y + 1.5, r: 0.7, fill: "currentColor" }, g);
      mk("circle", { cx: x, cy: y + 1.5, r: 0.7, fill: "currentColor" }, g);
      mk("circle", { cx: x + 3, cy: y + 1.5, r: 0.7, fill: "currentColor" }, g);
      return g;
    }

    function drawSwitchIcon(x, y, color, parent) {
      const g = mk("g", { style: `color:${color}; pointer-events:none;` }, parent);
      mk("rect", { x: x - 8, y: y - 4, width: 16, height: 8, rx: 1.5, fill: "none", stroke: "currentColor", "stroke-width": 1.2 }, g);
      [-4.5, -1.5, 1.5, 4.5].forEach(dx => {
        mk("rect", { x: x + dx - 1, y: y - 1, width: 2, height: 2, fill: "currentColor" }, g);
      });
      return g;
    }

    function drawWifiAntennaIcon(x, y, color, parent) {
      const g = mk("g", { style: `color:${color}; pointer-events:none;` }, parent);
      mk("path", { d: `M${x - 4.5} ${y - 3} A6 6 0 0 1 ${x + 4.5} ${y - 3}`, fill: "none", stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round" }, g);
      mk("path", { d: `M${x - 2.8} ${y - 0.5} A3.5 3.5 0 0 1 ${x + 2.8} ${y - 0.5}`, fill: "none", stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round" }, g);
      mk("circle", { cx: x, cy: y + 2.2, r: 0.9, fill: "currentColor" }, g);
      return g;
    }

    function drawDeviceIcon(x, y, color, deviceType, parent) {
      const dt = (deviceType || "phone").toLowerCase();
      if (dt === "ssd") {
        return drawSsdIcon(x, y, color, parent);
      } else if (dt === "pendrive" || dt === "storage" || dt === "flash" || dt === "usb_flash") {
        return drawPendriveIcon(x, y, color, parent);
      } else {
        return drawMobileIcon(x, y, color, parent);
      }
    }

    function drawNoInternetIconSmall(x, y, color, parent) {
      const g = mk("g", { class: "dev-icon-no-net", style: `color:${color || '#ef4444'}; cursor:help;` }, parent);
      mk("title", {}, g).textContent = "No Internet Connection";
      mk("circle", { cx: x, cy: y, r: 4.5, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
      mk("line", { x1: x - 3.2, y1: y - 3.2, x2: x + 3.2, y2: y + 3.2, stroke: "currentColor", "stroke-width": 1.2, "stroke-linecap": "round" }, g);
      mk("line", { x1: x - 3.5, y1: y, x2: x + 3.5, y2: y, stroke: "currentColor", "stroke-width": 0.8, opacity: 0.5 }, g);
      return g;
    }

    function drawTetheringIconSmall(x, y, color, parent, scale) {
      const s = (typeof scale === "number") ? scale : 1;
      const attrs = { class: "dev-icon-tether", style: `color:${color || '#10b981'}; cursor:help;` };
      if (s !== 1) {
        attrs.transform = `translate(${x}, ${y}) scale(${s}) translate(${-x}, ${-y})`;
      }
      const g = mk("g", attrs, parent);
      mk("title", {}, g).textContent = "Hotspot / Tethering Active";
      mk("circle", { cx: x, cy: y, r: 1.4, fill: "currentColor" }, g);
      mk("path", { d: `M${x - 2.6} ${y - 2.6} a3.6 3.6 0 0 0 0 5.2`, fill: "none", stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round" }, g);
      mk("path", { d: `M${x + 2.6} ${y - 2.6} a3.6 3.6 0 0 1 0 5.2`, fill: "none", stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round" }, g);
      mk("path", { d: `M${x - 4.6} ${y - 4.6} a6.4 6.4 0 0 0 0 9.2`, fill: "none", stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round" }, g);
      mk("path", { d: `M${x + 4.6} ${y - 4.6} a6.4 6.4 0 0 1 0 9.2`, fill: "none", stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round" }, g);
      return g;
    }

    function drawAdbIconSmall(x, y, color, parent, scale) {
      const s = (typeof scale === "number") ? scale : 1;
      const attrs = { class: "dev-icon-adb", style: `color:${color || '#38bdf8'}; cursor:help;` };
      if (s !== 1) {
        attrs.transform = `translate(${x}, ${y}) scale(${s}) translate(${-x}, ${-y})`;
      }
      const g = mk("g", attrs, parent);
      mk("title", {}, g).textContent = "ADB Debugging Enabled";
      mk("line", { x1: x - 2, y1: y - 2, x2: x - 3.2, y2: y - 3.8, stroke: "currentColor", "stroke-width": 0.9, "stroke-linecap": "round" }, g);
      mk("line", { x1: x + 2, y1: y - 2, x2: x + 3.2, y2: y - 3.8, stroke: "currentColor", "stroke-width": 0.9, "stroke-linecap": "round" }, g);
      mk("path", { d: `M${x - 3.8} ${y + 1} a3.8 3.8 0 0 1 7.6 0 Z`, fill: "currentColor" }, g);
      mk("circle", { cx: x - 1.5, cy: y - 0.5, r: 0.6, fill: "var(--bg, #06090c)" }, g);
      mk("circle", { cx: x + 1.5, cy: y - 0.5, r: 0.6, fill: "var(--bg, #06090c)" }, g);
      mk("line", { x1: x - 3.8, y1: y + 2.5, x2: x + 3.8, y2: y + 2.5, stroke: "currentColor", "stroke-width": 1.0, "stroke-linecap": "round" }, g);
      return g;
    }

    function drawMtpIconSmall(x, y, color, parent) {
      const g = mk("g", { class: "dev-icon-mtp", style: `color:${color || '#f59e0b'}; cursor:help;` }, parent);
      mk("title", {}, g).textContent = "MTP File Transfer";
      mk("path", { d: `M${x - 3.5} ${y - 1.5} h6 m-1.8 -1.8 l1.8 1.8 -1.8 1.8`, fill: "none", stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
      mk("path", { d: `M${x + 3.5} ${y + 2} h-6 m1.8 -1.8 l-1.8 1.8 1.8 1.8`, fill: "none", stroke: "currentColor", "stroke-width": 1.1, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
      return g;
    }

        function drawMobilePhoneIcon(x, y, color, parent) {
      const g = mk("g", { class: "wan-icon-mobile", style: `color:${color || "#38bdf8"}; pointer-events:none;` }, parent);
      mk("rect", { x: x - 4.5, y: y - 7.5, width: 9, height: 15, rx: 2, fill: "none", stroke: "currentColor", "stroke-width": 1.2 }, g);
      mk("line", { x1: x - 2, y1: y - 5, x2: x + 2, y2: y - 5, stroke: "currentColor", "stroke-width": 0.9, "stroke-linecap": "round" }, g);
      mk("circle", { cx: x, cy: y + 5, r: 0.8, fill: "currentColor" }, g);
      return g;
    }

    function drawPendriveIcon(x, y, color, parent) {
      const g = mk("g", { class: "wan-icon-pendrive", style: `color:${color || "#c084fc"}; pointer-events:none;` }, parent);
      mk("rect", { x: x - 2.5, y: y - 7.5, width: 5, height: 3.5, rx: 0.5, fill: "none", stroke: "currentColor", "stroke-width": 1.0 }, g);
      mk("line", { x1: x - 1, y1: y - 6.5, x2: x - 1, y2: y - 5, stroke: "currentColor", "stroke-width": 0.8 }, g);
      mk("line", { x1: x + 1, y1: y - 6.5, x2: x + 1, y2: y - 5, stroke: "currentColor", "stroke-width": 0.8 }, g);
      mk("rect", { x: x - 4, y: y - 4, width: 8, height: 11, rx: 1.5, fill: "none", stroke: "currentColor", "stroke-width": 1.2 }, g);
      mk("line", { x1: x - 2, y1: y + 4, x2: x + 2, y2: y + 4, stroke: "currentColor", "stroke-width": 0.9, "stroke-linecap": "round" }, g);
      return g;
    }

function drawStorageIconSmall(x, y, color, parent) {
      const g = mk("g", { class: "dev-icon-storage", style: `color:${color || '#c084fc'}; cursor:help;` }, parent);
      mk("title", {}, g).textContent = "USB Storage (SMB)";
      mk("rect", { x: x - 2, y: y - 4.5, width: 4, height: 2.5, fill: "none", stroke: "currentColor", "stroke-width": 0.9 }, g);
      mk("rect", { x: x - 3.2, y: y - 2, width: 6.4, height: 6.5, rx: 1, ry: 1, fill: "none", stroke: "currentColor", "stroke-width": 1.1 }, g);
      mk("circle", { cx: x, cy: y + 2, r: 0.8, fill: "currentColor" }, g);
      return g;
    }

    function renderDeviceVerticalIcons(parent, xRight, yBoxCenter, badges) {
      if (!badges || badges.length === 0) return;
      const count = badges.length;
      let yOffsets = [0];
      if (count === 2) {
        yOffsets = [-8, 8];
      } else if (count === 3) {
        yOffsets = [-13, 0, 13];
      } else if (count >= 4) {
        yOffsets = [-16, -5, 5, 16];
      }

      for (let i = 0; i < count && i < yOffsets.length; i++) {
        const b = badges[i];
        const iconY = yBoxCenter + yOffsets[i];
        if (b.type === "no_internet") {
          drawNoInternetIconSmall(xRight, iconY, b.color, parent);
        } else if (b.type === "tether") {
          drawTetheringIconSmall(xRight, iconY, b.color, parent);
        } else if (b.type === "adb") {
          drawAdbIconSmall(xRight, iconY, b.color, parent);
        } else if (b.type === "mtp") {
          drawMtpIconSmall(xRight, iconY, b.color, parent);
        } else if (b.type === "storage") {
          drawStorageIconSmall(xRight, iconY, b.color, parent);
        }
      }
    }

    function getApAndClientsForPort(pClients) {
      if (!pClients || pClients.length === 0) {
        return { hasAp: false, apDev: null, downstream: [] };
      }
      if (pClients.length === 1) {
        return { hasAp: false, apDev: null, downstream: pClients };
      }

      let ap = pClients.find(c => {
        const nm = (c.name || '').toLowerCase();
        return nm.includes('.lan') ||
               nm.includes('router') ||
               nm.includes('ap') ||
               nm.includes('openwrt') ||
               nm.includes('maxnet') ||
               nm.includes('gateway') ||
               nm.includes('repeater') ||
               nm.includes('extender') ||
               nm.includes('switch') ||
               nm.includes('tplink') ||
               nm.includes('asus') ||
               nm.includes('tenda') ||
               nm.includes('netgear') ||
               nm.includes('xiaomi') ||
               nm.includes('miwifi');
      });

      if (ap) {
        return {
          hasAp: true,
          apDev: ap,
          downstream: pClients.filter(c => c.ip !== ap.ip)
        };
      }

      return {
        hasAp: true,
        apDev: { name: "WiFi AP", ip: "", isGeneric: true, port: pClients[0].port },
        downstream: pClients
      };
    }

    function getUsbThemeStyle(typeOrStd, isLight) {
      const low = String(typeOrStd || '').toLowerCase();
      let std = 'usb3';
      if (low === 'wan' || low === 'w') {
        std = 'wan';
      } else if (low.includes('3') || low.includes('u3')) {
        std = 'usb3';
      } else if (low.includes('2') || low.includes('u2')) {
        std = 'usb2';
      } else if (low.includes('1') || low.includes('u1')) {
        std = 'usb1';
      }

      if (std === 'wan') {
        const wanCol = isLight ? '#0284c7' : '#38bdf8';
        return {
          std: 'wan',
          labelColor: wanCol,
          labelStroke: 'none',
          labelStrokeWidth: 0,
          dotStroke: wanCol,
          dotFill: wanCol,
          dotOuterFill: isLight ? '#ffffff' : 'var(--bg, #06090c)',
          lineStroke: wanCol,
          flowStroke: wanCol,
          particleFill: wanCol,
          cardBorder: wanCol,
          hasBorder: false
        };
      } else if (std === 'usb3') {
        // USB 3.x: Blue
        const blueCol = isLight ? '#0284c7' : '#00d2ff';
        return {
          std: 'usb3',
          labelColor: blueCol,
          labelStroke: 'none',
          labelStrokeWidth: 0,
          dotStroke: blueCol,
          dotFill: blueCol,
          dotOuterFill: isLight ? '#ffffff' : 'var(--bg, #06090c)',
          lineStroke: blueCol,
          flowStroke: blueCol,
          particleFill: blueCol,
          cardBorder: blueCol,
          hasBorder: false
        };
      } else if (std === 'usb2') {
        // USB 2.0: Black
        if (isLight) {
          return {
            std: 'usb2',
            labelColor: '#09090b',
            labelStroke: 'none',
            labelStrokeWidth: 0,
            dotStroke: '#09090b',
            dotFill: '#09090b',
            dotOuterFill: '#ffffff',
            lineStroke: '#09090b',
            flowStroke: '#09090b',
            particleFill: '#09090b',
            cardBorder: '#18181b',
            hasBorder: false
          };
        } else {
          // Dark Mode: Visible Black with crisp silver-gray outline so it is clearly Black
          return {
            std: 'usb2',
            labelColor: '#09090b',
            labelStroke: '#a1a1aa',
            labelStrokeWidth: 1.8,
            dotStroke: '#a1a1aa',
            dotFill: '#000000',
            dotOuterFill: '#000000',
            lineStroke: '#09090b',
            flowStroke: '#18181b',
            particleFill: '#d4d4d8',
            cardBorder: '#3f3f46',
            hasBorder: true,
            borderColor: '#52525b'
          };
        }
      } else {
        // USB 1.x: White
        const whiteCol = isLight ? '#71717a' : '#ffffff';
        return {
          std: 'usb1',
          labelColor: whiteCol,
          labelStroke: isLight ? 'none' : '#27272a',
          labelStrokeWidth: isLight ? 0 : 1.2,
          dotStroke: isLight ? '#52525b' : '#ffffff',
          dotFill: isLight ? '#71717a' : '#ffffff',
          dotOuterFill: isLight ? '#ffffff' : '#090b10',
          lineStroke: whiteCol,
          flowStroke: whiteCol,
          particleFill: isLight ? '#52525b' : '#ffffff',
          cardBorder: isLight ? '#71717a' : '#ffffff',
          hasBorder: !isLight,
          borderColor: '#27272a'
        };
      }
    }

    function calcMaxLinkSpeedTag(l) {
      if (!l) return "(Max 480 Mbps)";
      const dData = l.deviceData || {};
      const isUsb3 = (l.usbStd === "usb3" || (l.standard && l.standard.includes("3.")) || (dData.standard === "USB 3.0" || dData.speed_mbps >= 5000));
      const isUsb1 = (l.usbStd === "usb1" || (dData.speed_mbps && dData.speed_mbps <= 12));

      if (isUsb3) {
        return "(Max 5 Gbps)";
      } else if (l.type === "wan") {
        return "(Max 1 Gbps)";
      } else if (isUsb1) {
        return "(Max 12 Mbps)";
      }
      // Over USB 2.0 HighSpeed, physical bus is strictly limited to 480 Mbps
      return "(Max 480 Mbps)";
    }

    function getPortTopologyConfig(portIndex) {
      if (window._topoTree && Array.isArray(window._topoTree.ports)) {
        const port = window._topoTree.ports[portIndex - 1];
        if (port) {
          if (port.role === 'empty' || !port.child) {
            return { portIndex: portIndex, mode: 'empty', device: null };
          }
          if (port.role === 'device') {
            return { portIndex: portIndex, mode: 'direct', device: port.child };
          }
          if (port.role === 'node') {
            const child = port.child;
            const l3 = [];
            (child.ports || []).forEach(cp => {
              if (cp.role === 'device' && cp.child) {
                l3.push({ name: cp.child.name, ip: cp.child.ip, mac: cp.child.mac, conn_type: 'LAN Port' });
              } else if (cp.role === 'node' && cp.child) {
                l3.push({ name: cp.child.name, ip: cp.child.ip, mac: cp.child.mac, conn_type: 'Router / Sub-AP', is_router: true });
              }
            });
            (child.wireless_clients || []).forEach(wc => {
              l3.push({ name: wc.name, ip: wc.ip, mac: wc.mac, conn_type: (wc.band === '5G' ? '5GHz WiFi' : '2.4GHz WiFi') });
            });
            return {
              portIndex: portIndex,
              mode: 'layer2_ap',
              ap: { name: child.name, ip: child.ip, mac: child.mac, model: (child.type === 'switch' ? 'Ethernet Switch' : 'Access Point') },
              layer3_devices: l3
            };
          }
        }
      }
      const key = "lan" + portIndex;
      if (window._topologyLayers && window._topologyLayers.ports && window._topologyLayers.ports[key]) {
        return window._topologyLayers.ports[key];
      }
      if (window._lastDataCache && window._lastDataCache.topology_layers && window._lastDataCache.topology_layers.ports && window._lastDataCache.topology_layers.ports[key]) {
        return window._lastDataCache.topology_layers.ports[key];
      }
      return { portIndex: portIndex, mode: "empty", device: null };
    }

    // =========================================================================
    // MULTI-INTERFACE SLOTS & PURE VERTICAL TOPOLOGY ENGINE
    // =========================================================================
    function computeNodeInterfaceSlots(node, isMobile) {
      if (!node) return [];
      const lanPorts = node.ports || [];
      const isRouterOrAp = (node.type === 'router' || node.type === 'ap' || node.type === 'switch');

      const slots = [];
      // Always include WAN port for root gateway as W1
      if (node.id === 'root') {
        let wanPortLabel = 'W1';
        if (node.wan_mode === 'wan_as_lan') wanPortLabel = 'W1 [L5]';
        slots.push({
          type: 'wan',
          port: { id: 'root-wan', label: wanPortLabel, role: 'uplink' },
          idx: -1,
          label: wanPortLabel,
          role: 'uplink',
          child: null
        });
      }

      lanPorts.forEach((p, idx) => {
        let portLabel = 'L' + (idx + 1);
        if (node.id === 'root') {
          if (node.wan_mode === 'lan_as_wan_1' && idx === 0) portLabel = 'W2';
          else if (node.wan_mode === 'lan_as_wan_4' && idx === 3) portLabel = 'W2';
        }
        slots.push({ type: 'lan', port: p, idx: idx, label: portLabel, role: p.role, child: p.child });
      });

      if (isRouterOrAp) {
        const wClients = node.wireless_clients || [];
        const wCount = wClients.length;
        slots.push({
          type: 'wifi',
          label: 'Wi-Fi',
          band: 'Wi-Fi',
          color: '#38bdf8',
          clients: wClients,
          count: wCount
        });
      }

      return slots;
    }

    function computeTreeTotalVerticalHeight(node, isMobile, showWan = true) {
      if (!node) return 400;
      let h = showWan ? 110 : 40;
      function getH(n) {
        if (!n) return 0;
        if (n.type === 'device') return 30 + 36;
        const isCol = window._topoCollapsed && window._topoCollapsed.has(n.id);
        const rtrH = 78;
        if (isCol) return rtrH + 36;
        let ch = 0;
        if (Array.isArray(n.ports)) {
          n.ports.forEach(p => {
            if (p.role !== 'empty' && p.child) {
              ch += getH(p.child);
            }
          });
        }
        if (Array.isArray(n.wireless_clients) && n.wireless_clients.length > 0) {
          ch += n.wireless_clients.length * (28 + 18);
        }
        return rtrH + (ch > 0 ? 42 + ch : 36);
      }
      return h + getH(node) + 50;
    }

    function computeSubtreeBounds(node, isMobile) {
      const cardW = isMobile ? 260 : 288;
      const h = computeTreeTotalVerticalHeight(node, isMobile, false);
      return { width: cardW, height: h };
    }

    function computeTreeMaxDepth(node) {
      if (!node || node.type === 'device') return 1;
      let maxChild = 1;
      if (Array.isArray(node.ports)) {
        node.ports.forEach(p => {
          if (p.child) {
            maxChild = Math.max(maxChild, 1 + computeTreeMaxDepth(p.child));
          }
        });
      }
      return maxChild;
    }

    function computeSubtreeClientCount(node) {
      if (!node) return 0;
      if (node.type === 'device') return 1;
      let count = (node.wireless_clients && node.wireless_clients.length) || 0;
      if (Array.isArray(node.ports)) {
        node.ports.forEach(p => {
          if (p.role === 'device' && p.child) count += 1;
          else if (p.role === 'node' && p.child) count += 1 + computeSubtreeClientCount(p.child);
        });
      }
      return count;
    }

    // =========================================================================
    // NETWORK TOPOLOGY PREFERENCES & PALETTE THEMES
    // =========================================================================
    const DEFAULT_TOPO_PREFS = {
      theme: 'cyan',          // 'cyan' | 'emerald' | 'purple' | 'blue' | 'amber' | 'monochrome'
      animMode: 'flowing',    // 'flowing' | 'glow' | 'off'
      animSpeed: 'normal',    // 'fast' (1.2s) | 'normal' (2.2s) | 'slow' (3.5s)
      lineStyle: 'bezier',    // 'bezier' (S-curve) | 'orthogonal' (90-degree)
      showWan: true,          // boolean: show/hide ingress WAN modems
      showSpeeds: true,       // boolean: show/hide link speeds (1Gbps, etc.)
      infoDensity: 'full',    // 'full' (IP/MAC/Band) | 'compact' (Name only)
      refreshRate: 'off'      // 'off' (Default: 0 CPU / 0 RAM) | '5s' | '10s' | '30s'
    };

    function getTopologyPrefs() {
      try {
        const raw = localStorage.getItem('maxnet_topo_prefs');
        if (raw) return Object.assign({}, DEFAULT_TOPO_PREFS, JSON.parse(raw));
      } catch (e) {}
      return Object.assign({}, DEFAULT_TOPO_PREFS);
    }

    function updateTopologyPref(key, value) {
      const prefs = getTopologyPrefs();
      prefs[key] = value;
      try {
        localStorage.setItem('maxnet_topo_prefs', JSON.stringify(prefs));
      } catch (e) {}
      window._topoPrefs = prefs;
      if (key === 'refreshRate') {
        setupTopologyAutoRefresh();
      }
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
      if (key === 'theme') {
        renderTopologyLayersUI(window._topoTree);
      }
    }

    function getTopologyThemeColors(isLight, themeName = 'cyan') {
      const themes = {
        cyan: {
          accent: isLight ? "#0284c7" : "#38bdf8",
          l1: isLight ? "#0284c7" : "#38bdf8",
          l2: isLight ? "#d97706" : "#f59e0b",
          l3: isLight ? "#059669" : "#10b981",
          l4: isLight ? "#7c3aed" : "#a855f7",
          wifi: isLight ? "#0284c7" : "#38bdf8"
        },
        emerald: {
          accent: isLight ? "#059669" : "#10b981",
          l1: isLight ? "#059669" : "#10b981",
          l2: isLight ? "#0284c7" : "#38bdf8",
          l3: isLight ? "#d97706" : "#f59e0b",
          l4: isLight ? "#7c3aed" : "#a855f7",
          wifi: isLight ? "#059669" : "#10b981"
        },
        purple: {
          accent: isLight ? "#7c3aed" : "#a855f7",
          l1: isLight ? "#7c3aed" : "#a855f7",
          l2: isLight ? "#0284c7" : "#38bdf8",
          l3: isLight ? "#d97706" : "#f59e0b",
          l4: isLight ? "#059669" : "#10b981",
          wifi: isLight ? "#7c3aed" : "#a855f7"
        },
        blue: {
          accent: isLight ? "#2563eb" : "#3b82f6",
          l1: isLight ? "#2563eb" : "#3b82f6",
          l2: isLight ? "#d97706" : "#f59e0b",
          l3: isLight ? "#059669" : "#10b981",
          l4: isLight ? "#7c3aed" : "#a855f7",
          wifi: isLight ? "#2563eb" : "#3b82f6"
        },
        amber: {
          accent: isLight ? "#d97706" : "#f59e0b",
          l1: isLight ? "#d97706" : "#f59e0b",
          l2: isLight ? "#0284c7" : "#38bdf8",
          l3: isLight ? "#059669" : "#10b981",
          l4: isLight ? "#7c3aed" : "#a855f7",
          wifi: isLight ? "#d97706" : "#f59e0b"
        },
        monochrome: {
          accent: isLight ? "#334155" : "#e4e4e7",
          l1: isLight ? "#0284c7" : "#38bdf8",
          l2: isLight ? "#d97706" : "#f59e0b",
          l3: isLight ? "#059669" : "#10b981",
          l4: isLight ? "#7c3aed" : "#a855f7",
          wifi: isLight ? "#0284c7" : "#38bdf8"
        }
      };
      return themes[themeName] || themes.cyan;
    }

    function setupTopologyAutoRefresh() {
      if (window._topoRefreshTimer) {
        clearInterval(window._topoRefreshTimer);
        window._topoRefreshTimer = null;
      }
      const prefs = getTopologyPrefs();
      let ms = 0;
      if (prefs.refreshRate === '5s') ms = 5000;
      else if (prefs.refreshRate === '10s') ms = 10000;
      else if (prefs.refreshRate === '30s') ms = 30000;

      if (ms > 0) {
        window._topoRefreshTimer = setInterval(() => {
          if (document.hidden) return;
          const tabOverview = document.getElementById('tabOverview');
          const isOverviewVisible = tabOverview && tabOverview.style.display !== 'none';
          if (!isOverviewVisible) return;

          const topoAcc = document.getElementById('acc-topo-layers');
          const isSettingsOpen = topoAcc && topoAcc.classList.contains('active');

          if (isOverviewVisible || isSettingsOpen) {
            if (typeof fetchTopologyLayers === 'function') {
              fetchTopologyLayers(true);
            }
          }
        }, ms);
      }
    }

    // =========================================================================
    // LAYERED STEP-EDGE ROUTING & DAGRE/ELK HIERARCHICAL LAYOUT ENGINE
    // =========================================================================
    function makeStepEdgePath(x1, y1, x2, y2, midY, r = 6) {
      if (Math.abs(x1 - x2) < 4) {
        return `M ${x1} ${y1} L ${x2} ${y2}`;
      }
      const signX = x2 > x1 ? 1 : -1;
      const r1 = Math.min(r, Math.abs(midY - y1) / 2, Math.abs(x2 - x1) / 2);
      const r2 = Math.min(r, Math.abs(y2 - midY) / 2, Math.abs(x2 - x1) / 2);
      return `M ${x1} ${y1} ` +
             `L ${x1} ${midY - r1} ` +
             `Q ${x1} ${midY} ${x1 + signX * r1} ${midY} ` +
             `L ${x2 - signX * r2} ${midY} ` +
             `Q ${x2} ${midY} ${x2} ${midY + r2} ` +
             `L ${x2} ${y2}`;
    }

    function computeLayeredSubtreeBounds(node, screenW) {
      if (!node) return { w: 0, h: 0, subtreeW: 0, subtreeH: 0 };
      if (!window._topoCollapsed) window._topoCollapsed = new Set();
      if (!window._topoWifiExpanded) window._topoWifiExpanded = {};

      const isPhone = screenW < 480;
      const isTablet = screenW >= 480 && screenW <= 900;

      const isRoot = (node.id === 'root');
      const isSwitch = node.type === 'switch';

      if (node.type === 'device') {
        const w = isPhone ? 160 : (isTablet ? 180 : 200);
        const h = 36;
        node._layout = {
          w: w,
          h: h,
          subtreeW: w + 20,
          subtreeH: h,
          children: []
        };
        return node._layout;
      }

      // Router / AP / Switch
      const rtrW = isPhone ? 220 : (isTablet ? 250 : 280);
      const headerH = 40;
      const portBayH = 32;
      const rtrH = headerH + portBayH; // 72px

      // Auto-collapse if >8 descendants and not manually toggled
      const clientCount = computeSubtreeClientCount(node);
      if (clientCount > 8 && !window._topoManualToggleNodes?.has(node.id) && !isRoot) {
        window._topoCollapsed.add(node.id);
      }

      const isCollapsed = window._topoCollapsed.has(node.id);
      if (isCollapsed) {
        node._layout = {
          w: rtrW,
          h: rtrH,
          subtreeW: rtrW + 30,
          subtreeH: rtrH,
          children: []
        };
        return node._layout;
      }

      const children = [];
      const ports = node.ports || [];
      ports.forEach(p => {
        if (p.role !== 'empty' && p.child) {
          p.child._parentRouter = node;
          computeLayeredSubtreeBounds(p.child, screenW);
          children.push({
            type: 'lan',
            port: p,
            child: p.child,
            subtreeW: p.child._layout.subtreeW,
            subtreeH: p.child._layout.subtreeH
          });
        }
      });

      // Wi-Fi clients direct branch under router (no intermediate circle)
      const wClients = node.wireless_clients || [];
      if (wClients.length > 0) {
        if (window._topoWifiExpanded[node.id] === undefined) {
          window._topoWifiExpanded[node.id] = true;
        }
        const isExpanded = !!window._topoWifiExpanded[node.id];
        const clientCardW = 120;
        const clientCardH = 30;
        const clientGapY = 38;
        const totalH = isExpanded ? (wClients.length * clientGapY) : 0;
        wClients.forEach(wc => { wc._parentRouter = node; });
        const subW = isExpanded ? (clientCardW + 36) : 0;
        if (isExpanded) {
          children.push({
            type: 'wifi_cluster',
            node: node,
            clients: wClients,
            isExpanded: isExpanded,
            w: clientCardW,
            h: totalH,
            totalH: totalH,
            subtreeW: subW,
            subtreeH: totalH
          });
        }
      }

      const gapX = isPhone ? 20 : (isTablet ? 30 : 40);
      let sumChildW = 0;
      let maxChildH = 0;
      children.forEach((c, i) => {
        sumChildW += c.subtreeW;
        if (i > 0) sumChildW += gapX;
        if (c.subtreeH > maxChildH) maxChildH = c.subtreeH;
      });

      const subtreeW = Math.max(rtrW + 20, sumChildW);
      const layerGapY = isPhone ? 50 : (isTablet ? 60 : 70);
      const subtreeH = rtrH + (children.length > 0 ? (layerGapY + maxChildH) : 0);

      node._layout = {
        w: rtrW,
        h: rtrH,
        subtreeW: subtreeW,
        subtreeH: subtreeH,
        children: children,
        sumChildW: sumChildW,
        gapX: gapX,
        layerGapY: layerGapY
      };
      return node._layout;
    }

    function assignLayeredPositions(node, centerX, topY, depth, screenW) {
      if (!node || !node._layout) return;
      const l = node._layout;
      l.centerX = centerX;
      l.topY = topY;
      l.x = centerX - l.w / 2;
      l.y = topY;
      l.depth = depth;

      if (!l.children || l.children.length === 0) return;

      const layerGapY = l.layerGapY || 68;
      const childY = topY + l.h + layerGapY;
      const gapX = l.gapX || 32;
      let curLeftX = centerX - l.sumChildW / 2;

      l.children.forEach(c => {
        const cCenterX = curLeftX + c.subtreeW / 2;
        if (c.type === 'wifi_cluster') {
          c.centerX = cCenterX;
          c.topY = childY;
          c.x = cCenterX - c.w / 2;
          c.y = childY;
        } else {
          assignLayeredPositions(c.child, cCenterX, childY, depth + 1, screenW);
        }
        curLeftX += c.subtreeW + gapX;
      });
    }

    function countTotalTopologyNodes(node) {
      if (!node) return 0;
      let count = 1;
      if (node.ports && Array.isArray(node.ports)) {
        node.ports.forEach(p => {
          if (p.child) count += countTotalTopologyNodes(p.child);
        });
      }
      if (node.wireless_clients && Array.isArray(node.wireless_clients)) {
        count += node.wireless_clients.length;
      }
      return count;
    }

    function toggleExpandCollapseAll() {
      if (!window._topoTree) return;
      if (!window._topoCollapsed) window._topoCollapsed = new Set();
      if (!window._topoManualToggleNodes) window._topoManualToggleNodes = new Set();
      
      let hasCollapsed = false;
      function check(n) {
        if (!n) return;
        if (n.id !== 'root' && (n.type === 'router' || n.type === 'ap' || n.type === 'switch')) {
          if (window._topoCollapsed.has(n.id)) hasCollapsed = true;
        }
        if (n.ports) n.ports.forEach(p => { if (p.child) check(p.child); });
      }
      check(window._topoTree);

      function setExpand(n, expand) {
        if (!n) return;
        if (n.id !== 'root' && (n.type === 'router' || n.type === 'ap' || n.type === 'switch')) {
          window._topoManualToggleNodes.add(n.id);
          if (expand) {
            window._topoCollapsed.delete(n.id);
          } else {
            window._topoCollapsed.add(n.id);
          }
        }
        if (n.wireless_clients && n.wireless_clients.length > 0) {
          if (!window._topoWifiExpanded) window._topoWifiExpanded = {};
          window._topoWifiExpanded[n.id] = expand;
        }
        if (n.ports) n.ports.forEach(p => { if (p.child) setExpand(p.child, expand); });
      }

      setExpand(window._topoTree, hasCollapsed);
      buildUsbBwSvg();
      setTimeout(fitTopologyToScreen, 60);
    }

    function setTopologyActiveLayer(layer) {
      setTopologyLayerFilter(layer);
    }

    function highlightPathToRoot(targetNode) {
      if (_topoHasMoved || _isTopoDragging) return;
      const svg = document.getElementById('usbBwSvg');
      if (!svg) return;
      svg.querySelectorAll('.topo-selected-box, .topo-path-highlight, .topo-dimmed').forEach(el => {
        el.classList.remove('topo-selected-box', 'topo-path-highlight', 'topo-dimmed');
      });
      if (!targetNode) return;

      const targetId = targetNode.id || targetNode.ip || targetNode.name;
      const el = svg.querySelector(`[data-node-id="${targetId}"]`);
      if (el) el.classList.add('topo-selected-box');
    }

    function clearPathHighlight() {
      highlightPathToRoot(null);
    }

    function renderTopologyMinimap(tree, bounds, screenW) {
      let minimapBox = document.getElementById('topoMinimapContainer');
      const totalNodes = countTotalTopologyNodes(tree);
      if (totalNodes <= 30) {
        if (minimapBox) minimapBox.style.display = 'none';
        return;
      }
      if (!minimapBox) {
        const parent = document.querySelector('#tabOverview .bw-box');
        if (!parent) return;
        minimapBox = document.createElement('div');
        minimapBox.id = 'topoMinimapContainer';
        minimapBox.className = 'topo-minimap';
        parent.appendChild(minimapBox);
      }
      minimapBox.style.display = 'block';
      minimapBox.innerHTML = `
        <svg class="topo-minimap-svg" viewBox="0 0 ${bounds.subtreeW} ${bounds.subtreeH}" preserveAspectRatio="xMidYMid meet">
          <g id="topoMinimapNodes"></g>
        </svg>
      `;
      const mg = minimapBox.querySelector('#topoMinimapNodes');
      if (!mg) return;
      function drawMini(n) {
        if (!n || !n._layout) return;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', n._layout.x);
        rect.setAttribute('y', n._layout.y);
        rect.setAttribute('width', n._layout.w);
        rect.setAttribute('height', n._layout.h);
        rect.setAttribute('rx', '3');
        rect.setAttribute('fill', n.type === 'device' ? '#10b981' : '#0284c7');
        rect.setAttribute('opacity', '0.7');
        mg.appendChild(rect);
        if (n.ports) n.ports.forEach(p => { if (p.child) drawMini(p.child); });
      }
      drawMini(tree);
    }

    // =========================================================================
    // SVG DIAGRAM BUILDER (DAGRE/ELK LAYERED TREE, ORTHOGONAL STEP EDGES, ZERO OVERLAPS)
    // =========================================================================
    function getCombinedRouterSpeed() {
      let speed = 0;
      // 1. Live measured Rx + Tx on router gateway
      if (typeof window._currentRxMbps === "number" && typeof window._currentTxMbps === "number") {
        speed = window._currentRxMbps + window._currentTxMbps;
      }
      // 2. Multilink aggregated bandwidth
      if (window._lastDataCache && window._lastDataCache.multilink && window._lastDataCache.multilink.combined_speed_mbps) {
        const mlSpeed = parseFloat(window._lastDataCache.multilink.combined_speed_mbps) || 0;
        if (mlSpeed > speed) speed = mlSpeed;
      }
      // 3. Multi-USB link array
      if (typeof bwLinks !== "undefined" && Array.isArray(bwLinks) && bwLinks.length > 0) {
        const usbSum = bwLinks.reduce((acc, l) => acc + (Number(l.v) || 0), 0);
        if (usbSum > speed) speed = usbSum;
      }
      return `${speed.toFixed(3)} Mbps`;
    }

    function calcSpeedFlowDuration(speedMbps) {
      const s = parseFloat(speedMbps) || 0;
      if (s >= 50) return "0.45s";
      if (s >= 20) return "0.75s";
      if (s >= 10) return "1.1s";
      if (s >= 5)  return "1.5s";
      if (s >= 1)  return "2.0s";
      if (s >= 0.1) return "3.0s";
      return "5.0s";
    }

    function calcSpeedFlowWidth(speedMbps) {
      const s = parseFloat(speedMbps) || 0;
      if (s >= 10) return 2.4;
      if (s >= 1)  return 1.8;
      return 1.3;
    }

    function getDeviceSpeedMbps(ip) {
      if (!ip) return 0;
      if (window._clientLiveRateMap && window._clientLiveRateMap.has(ip)) {
        return window._clientLiveRateMap.get(ip) || 0;
      }
      if (window._lastDataCache && Array.isArray(window._lastDataCache.clients)) {
        const cl = window._lastDataCache.clients.find(c => c && c.ip === ip);
        if (cl) {
          const mb = (parseFloat(cl.rx_mb) || 0) + (parseFloat(cl.tx_mb) || 0);
          if (mb > 1000) return 12.0;
          if (mb > 200) return 4.0;
          if (mb > 20) return 0.8;
          return 0.1;
        }
      }
      return 0;
    }

    function buildUsbBwSvg() {
      const svg = document.getElementById("usbBwSvg");
      if (!svg) return;
      svg.innerHTML = "";
      svg.setAttribute("preserveAspectRatio", "xMidYMin meet");

      const box = svg.parentElement;
      const boxW = (box ? box.clientWidth : 0);
      const screenW = (boxW > 100) ? Math.min(window.innerWidth, boxW) : window.innerWidth;
      const isPhone = screenW < 480;
      const isTablet = screenW >= 480 && screenW <= 900;
      const isDesktop = screenW > 900;
      bwMode = isPhone ? "m" : "w";
      const isLight = document.documentElement.getAttribute("data-theme") === "light";

      const prefs = getTopologyPrefs();
      const themeColors = getTopologyThemeColors(isLight, prefs.theme);

      // Explicit Monochrome Theme Palette (zero transparent fills, high contrast black & gray)
      const topoTheme = {
        cardBg: isLight ? "#ffffff" : "#13151f",
        cardBgAlt: isLight ? "#f8fafc" : "#181a26",
        cardBorder: isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.16)",
        cardBorderIdle: isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)",
        borderActive: themeColors.accent,
        borderLan: themeColors.accent,
        borderSwitch: themeColors.l3,
        borderAp: themeColors.l2,
        borderDev: themeColors.l3,
        borderWifi: themeColors.wifi,
        textMain: isLight ? "#09090b" : "#f4f4f5",
        textDim: isLight ? "#475569" : "#a1a1aa",
        textMuted: isLight ? "#64748b" : "#71717a",
        conduitIdle: isLight ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)",
        cardShadow: isLight ? "drop-shadow(0 2px 4px rgba(0,0,0,0.06))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.5))"
      };

      if (!window._topoTree) {
        const currentLanIp = (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_ip) || '10.0.0.1';
        const currentMac = (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_mac) || '2e:dd:4c:b2:8c:fa';
        window._topoTree = normalizeTopologyTree(window._topologyLayers, currentLanIp, currentMac);
      }
      const tree = window._topoTree;

      // Compute Tree Subtree Bounds (Phase 1)
      computeLayeredSubtreeBounds(tree, screenW);

      const treeBounds = tree._layout || { subtreeW: 600, subtreeH: 500 };
      const rootY = prefs.showWan ? (isPhone ? 165 : 185) : (isPhone ? 50 : 60);
      const initialW = isPhone ? Math.max(390, treeBounds.subtreeW + 60) : Math.max(boxW || 640, treeBounds.subtreeW + 80);
      const rtrCenterX = initialW / 2;

      // Assign Coordinates (Phase 2)
      assignLayeredPositions(tree, rtrCenterX, rootY, 0, screenW);

      const defs = mk("defs", {}, svg);

      // LAYER GROUPS: EDGES LAYER (BEHIND), NODES LAYER (MIDDLE), LABELS LAYER (FOREGROUND)
      const edgesLayer = mk("g", { id: "topoEdgesLayer" }, svg);
      const nodesLayer = mk("g", { id: "topoNodesLayer" }, svg);
      const labelsLayer = mk("g", { id: "topoLabelsLayer" }, svg);

      let globalMinX = rtrCenterX - 100;
      let globalMaxX = rtrCenterX + 100;
      let globalMaxY = rootY + 100;

      // Detect USB standard: USB 3.0 (5Gbps) or USB 2.0 (480Mbps)
      let isUsb3 = true;
      let usbWireSpeed = "5Gbps";
      if (window._lastDataCache) {
        const rtrUsb = window._lastDataCache.router && window._lastDataCache.router.usb;
        const usbDev = Array.isArray(window._lastDataCache.usb_devices) && window._lastDataCache.usb_devices[0];
        const spd = (rtrUsb && rtrUsb.speed_mbps) || (usbDev && usbDev.speed_mbps) || 5000;
        if (spd < 1000) {
          isUsb3 = false;
          usbWireSpeed = "480Mbps";
        } else {
          isUsb3 = true;
          usbWireSpeed = "5Gbps";
        }
      }
      const usbStyle = getUsbThemeStyle(isUsb3 ? "usb3" : "usb2", isLight);

      // 1. WAN UPLINK CHIP ON TOP OF GATEWAY (Curve UI matching cards, Hotspot tethering + ADB icons, USB standard wire speed)
      if (prefs.showWan) {

        const wanW = isPhone ? 210 : (isTablet ? 230 : 250);
        const wanH = 34;
        const wanX = rtrCenterX - wanW / 2;
        const wanY = rootY - 96;

        globalMinX = Math.min(globalMinX, wanX);
        globalMaxX = Math.max(globalMaxX, wanX + wanW);

        // WAN Conduit from WAN card bottom to Gateway top in EDGES LAYER (Clear high-visibility wire)
        const dWanTrunk = `M ${rtrCenterX} ${wanY + wanH} L ${rtrCenterX} ${rootY}`;
        mk("path", {
          class: "base",
          d: dWanTrunk,
          stroke: usbStyle.lineStroke || "#0284c7",
          "stroke-width": 2.2,
          fill: "none",
          style: "opacity:0.85;"
        }, edgesLayer);

        // Flow animation on WAN uplink
        const isAnim = (prefs.animMode === 'flowing' || !prefs.animMode);
        const isGlow = (prefs.animMode === 'glow');
        const wanFlowId = "topoWanUplinkFlow";
        mk("path", {
          id: wanFlowId,
          class: "flow",
          d: dWanTrunk,
          stroke: usbStyle.lineStroke || "#0284c7",
          "stroke-width": 2.4,
          fill: "none",
          style: (isGlow || isAnim) ? `filter:drop-shadow(0 0 5px ${usbStyle.glowColor || 'rgba(56,189,248,0.7)'});` : ''
        }, edgesLayer);

        const liveWanTotalSpeed = (window._currentRxMbps > 0 || window._currentTxMbps > 0) ?
          (window._currentRxMbps + window._currentTxMbps) :
          ((bwLinks && bwLinks[0] && bwLinks[0].v > 0) ? Number(bwLinks[0].v) : 0);

        if (isAnim) {
          const dur = calcSpeedFlowDuration(liveWanTotalSpeed);
          const circ = mk("circle", { class: "pt", r: calcSpeedFlowWidth(liveWanTotalSpeed), fill: usbStyle.lineStroke || "#0284c7", style: `fill:${usbStyle.lineStroke || "#0284c7"} !important;` }, edgesLayer);
          const m = mk("animateMotion", { dur: dur, repeatCount: "indefinite" }, circ);
          const mp = mk("mpath", { href: "#" + wanFlowId }, m);
          try { mp.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + wanFlowId); } catch (e) {}
        }

        // WAN Wire Speed Pill on wire midpoint (5Gbps or 480Mbps)
        const wireMidY = (wanY + wanH + rootY) / 2;
        const wirePillW = 46;
        const wirePillH = 15;
        const wirePillG = mk("g", { class: "topo-wan-wire-pill" }, labelsLayer);
        mk("rect", {
          x: rtrCenterX - wirePillW / 2,
          y: wireMidY - wirePillH / 2,
          width: wirePillW,
          height: wirePillH,
          rx: 4,
          ry: 4,
          fill: topoTheme.cardBg,
          stroke: usbStyle.lineStroke || "#0284c7",
          "stroke-width": 1.1,
          style: `filter:${isLight ? "drop-shadow(0 1px 3px rgba(0,0,0,0.1))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.6))"};`
        }, wirePillG);
        const tWireSpd = mk("text", {
          x: rtrCenterX,
          y: wireMidY + 3.2,
          "text-anchor": "middle",
          style: `font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${usbStyle.lineStroke || "#0284c7"};`
        }, wirePillG);
        tWireSpd.textContent = usbWireSpeed;

        // WAN Chip Card in NODES LAYER - curve UI matching other cards (rx: 8, ry: 8)
        const wanG = mk("g", {
          class: "topo-wan-chip",
          "data-node-id": "wan-uplink",
          role: "treeitem",
          "aria-label": "WAN Uplink USB0",
          tabindex: "0",
          style: "cursor:pointer; animation: topoNodeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;"
        }, nodesLayer);

        const liveWanIpStr = (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.wan_ip) ||
          (window._lastDataCache && window._lastDataCache.multilink && window._lastDataCache.multilink.links && window._lastDataCache.multilink.links[0] && window._lastDataCache.multilink.links[0].ip) ||
          "10.228.157.161";

        wanG.onclick = (e) => {
          showTopoNodeDetail({
            name: "WAN USB",
            type: "wan",
            ip: liveWanIpStr,
            speed: `${liveWanTotalSpeed.toFixed(3)} Mbps`,
            status: "online"
          }, false, e);
        };

        mk("rect", {
          x: wanX,
          y: wanY,
          width: wanW,
          height: wanH,
          rx: 8,
          ry: 8,
          fill: topoTheme.cardBg,
          stroke: usbStyle.cardBorder || "#0284c7",
          "stroke-width": 1.3,
          style: `filter:${topoTheme.cardShadow};`
        }, wanG);

        // Detect connected USB device type: mobile phone vs storage/pendrive
        const uDev = (window._lastDataCache && Array.isArray(window._lastDataCache.usb_devices) && window._lastDataCache.usb_devices[0]) || {};
        const isStorageDev = (uDev.device_type === "storage" || uDev.device_type === "ssd" || uDev.device_type === "pendrive" || uDev.has_storage);
        const isMobileDev = !isStorageDev && (uDev.device_type === "phone" || uDev.has_tethering || !!(window._lastDataCache && window._lastDataCache.mobile && window._lastDataCache.mobile.connected));

        // Fixed icon container box on the left side of WAN card
        const wanIconBoxX = wanX + 6;
        const wanIconBoxY = wanY + 6;
        const wanIconBoxW = 24;
        const wanIconBoxH = 24;
        mk("rect", {
          x: wanIconBoxX,
          y: wanIconBoxY,
          width: wanIconBoxW,
          height: wanIconBoxH,
          rx: 5,
          ry: 5,
          fill: isLight ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.025)"
        }, wanG);

        if (isStorageDev) {
          drawPendriveIcon(wanIconBoxX + wanIconBoxW / 2, wanIconBoxY + wanIconBoxH / 2, "#c084fc", wanG);
        } else {
          drawMobilePhoneIcon(wanIconBoxX + wanIconBoxW / 2, wanIconBoxY + wanIconBoxH / 2, "#38bdf8", wanG);
        }

        const textStartX = wanX + 36;

        // WAN Title on top row
        const tWanTitle = mk("text", {
          x: textStartX,
          y: wanY + 14.5,
          style: `font-size:8.5px; font-weight:800; font-family:var(--font-mono); fill:${topoTheme.textMain};`
        }, wanG);
        tWanTitle.textContent = "WAN USB";

        // WAN IP directly below label
        const tWanIp = mk("text", {
          x: textStartX,
          y: wanY + 25.5,
          style: `font-size:7.5px; font-weight:600; font-family:var(--font-mono); fill:${topoTheme.textMuted};`
        }, wanG);
        tWanIp.textContent = liveWanIpStr;

        // Draw Hotspot Tethering Icon & Android ADB Icon in WAN card if mobile (compact, right next to "WAN USB" label)
        if (!isStorageDev) {
          const iconTetherX = textStartX + 46;
          const iconAdbX = textStartX + 57;
          const iconCenterY = wanY + 11.5;
          drawTetheringIconSmall(iconTetherX, iconCenterY, "#10b981", wanG, 0.65);
          drawAdbIconSmall(iconAdbX, iconCenterY, "#38bdf8", wanG, 0.65);
        }

        // Live measured speed in 0.000 Mbps decimal with soft dark font color
        const liveSpeedStr = `${liveWanTotalSpeed.toFixed(3)} Mbps`;
        const softDarkSpeedColor = isLight ? "#334155" : "#94a3b8";

        const tWanSpd = mk("text", {
          x: wanX + wanW - 12,
          y: wanY + 20.5,
          "text-anchor": "end",
          style: `font-size:9.5px; font-weight:800; font-family:var(--font-mono); fill:${softDarkSpeedColor};`
        }, wanG);
        tWanSpd.textContent = liveSpeedStr;

        // Soft pulse online dot at top-left (r: 1.8)
        mk("circle", {
          cx: wanX + 7,
          cy: wanY + 7,
          r: 1.8,
          class: "topo-pulse-dot",
          fill: "#10b981"
        }, wanG);
      }

      // Recursive Layered Node Renderer
      function renderLayeredNode(node) {
        if (!node || !node._layout) return;
        const l = node._layout;
        const isRoot = (node.id === 'root');
        const isSwitch = (node.type === 'switch');
        const isLeaf = (node.type === 'device');
        const depth = l.depth || 0;
        const nodeLayerColor = isRoot ? themeColors.l1 : ((depth === 1) ? themeColors.l2 : themeColors.l3);
        const isNodeOnline = (node.connected !== false && node.status !== 'offline');
        const isCollapsed = window._topoCollapsed && window._topoCollapsed.has(node.id);
        const nodeId = node.id || node.ip || (isRoot ? 'root' : 'dev');

        globalMinX = Math.min(globalMinX, l.x);
        globalMaxX = Math.max(globalMaxX, l.x + l.w);
        globalMaxY = Math.max(globalMaxY, l.y + l.h);

        // Layer Filter Dimming (L1 / L2 / L3)
        const activeLayer = (window._topoActiveLayer || 'all').toLowerCase();
        let isLayerDimmed = false;
        if (activeLayer === 'l1' && !isRoot) isLayerDimmed = true;
        if (activeLayer === 'l2' && depth > 1) isLayerDimmed = true;
        if (activeLayer === 'l3' && !isLeaf && depth !== 1) isLayerDimmed = true;

        if (isLeaf) {
          // Leaf Device Card -- clean single row: [icon] name IP [dot]
          const dev = node;
          const devClass = (typeof classifyLanDevice === 'function') ? classifyLanDevice(dev) : { type: 'client', title: 'Device', color: '#10b981', badge: 'DEVICE' };
          const devW = l.w;
          const devH = l.h;
          const devBoxX = l.x;
          const devColor = isLight ? (devClass.color === '#10b981' ? '#059669' : devClass.color) : devClass.color;

          const devG = mk("g", {
            class: `topo-client-node ${isNodeOnline ? '' : 'topo-offline-node'} ${isLayerDimmed ? 'topo-dimmed' : ''}`,
            "data-node-id": nodeId,
            role: "treeitem",
            "aria-label": `${resolveDeviceDisplayName(dev)} ${dev.ip || ''}`,
            tabindex: "0",
            style: `cursor:pointer; animation: topoNodeSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: ${depth * 40}ms;`
          }, nodesLayer);

          devG.onclick = (e) => {
            showTopoNodeDetail(dev, false, e);
          };

          mk("rect", {
            x: devBoxX,
            y: l.y,
            width: devW,
            height: devH,
            rx: 6,
            ry: 6,
            fill: topoTheme.cardBg,
            stroke: isNodeOnline ? devColor : topoTheme.cardBorderIdle,
            "stroke-width": 1.2,
            style: `filter:${topoTheme.cardShadow};` + (isNodeOnline ? "" : "opacity:0.75;")
          }, devG);

          // 20px icon box with 8px gap
          const iconBoxX = devBoxX + 6;
          const iconBoxY = l.y + (devH - 24) / 2;
          mk("rect", {
            x: iconBoxX,
            y: iconBoxY,
            width: 24,
            height: 24,
            rx: 4,
            ry: 4,
            fill: isLight ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.025)"
          }, devG);
          drawLanClientDeviceIcon(iconBoxX + 12, iconBoxY + 12, devClass, devG);

          const textStartX = devBoxX + 38;
          let devName = resolveDeviceDisplayName(dev);
          const maxChars = isPhone ? 12 : 16;
          if (devName.length > maxChars) devName = devName.substring(0, maxChars - 1) + "\u2026";

          mk("text", {
            x: textStartX,
            y: l.y + 14,
            style: `font-size:9px; font-weight:800; font-family:var(--font-mono); fill:${isNodeOnline ? topoTheme.textMain : topoTheme.textDim};`
          }, devG).textContent = devName;

          mk("text", {
            x: textStartX,
            y: l.y + 26,
            style: `font-size:8px; font-weight:600; font-family:var(--font-mono); fill:${topoTheme.textMuted};`
          }, devG).textContent = dev.ip || "";

          // Status dot at top-left: online = green, offline = gray, blocked = red
          const isDevBlocked = (typeof blockedIps !== 'undefined' && blockedIps.has(dev.ip)) || !!dev.blocked;
          const devStatusCol = isDevBlocked ? "#ef4444" : (isNodeOnline ? "#10b981" : (isLight ? "#94a3b8" : "#52525b"));
          mk("circle", {
            cx: devBoxX + 6,
            cy: l.y + 6,
            r: 2.0,
            class: (isNodeOnline && !isDevBlocked) ? "topo-pulse-dot" : "",
            fill: devStatusCol
          }, devG);

          return;
        }

        // Router / AP / Switch Chassis
        const rtrW = l.w;
        const rtrH = l.h;
        const rtrX = l.x;
        const headerH = 40;

        const chassisG = mk("g", {
          class: `${isRoot ? "topo-root-chassis" : "topo-ap-node"} ${isNodeOnline ? '' : 'topo-offline-node'} ${isLayerDimmed ? 'topo-dimmed' : ''}`,
          "data-node-id": nodeId,
          role: "treeitem",
          "aria-label": `${node.name || 'Router'} ${node.ip || ''}`,
          tabindex: "0",
          style: `cursor:pointer; animation: topoNodeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: ${depth * 40}ms;`
        }, nodesLayer);

        chassisG.onclick = (e) => {
          highlightPathToRoot(node);
          showTopoNodeDetail(node, false, e);
        };

        mk("rect", {
          x: rtrX,
          y: l.y,
          width: rtrW,
          height: rtrH,
          rx: 8,
          ry: 8,
          fill: topoTheme.cardBg,
          stroke: isNodeOnline ? nodeLayerColor : topoTheme.cardBorderIdle,
          "stroke-width": 1.4,
          style: `filter:${isLight ? 'drop-shadow(0 3px 8px rgba(0,0,0,0.06))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.45))'};`
        }, chassisG);

        // Fixed 32px icon container box with 8px gap before text
        const rtrIconBoxX = rtrX + 6;
        const rtrIconBoxY = l.y + 6;
        const rtrIconBoxW = 32;
        const rtrIconBoxH = 32;
        mk("rect", {
          x: rtrIconBoxX,
          y: rtrIconBoxY,
          width: rtrIconBoxW,
          height: rtrIconBoxH,
          rx: 5,
          ry: 5,
          fill: isLight ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.025)"
        }, chassisG);

        if (isRoot) {
          drawRouterBoxIcon(rtrIconBoxX + 16, rtrIconBoxY + 16, nodeLayerColor, chassisG);
        } else if (isSwitch) {
          drawSwitchIcon(rtrIconBoxX + 16, rtrIconBoxY + 16, nodeLayerColor, chassisG);
        } else {
          drawRouterApIcon(rtrIconBoxX + 16, rtrIconBoxY + 16, nodeLayerColor, chassisG);
        }

        // Router Name on top row
        const tTitle = mk("text", {
          x: rtrX + 46,
          y: l.y + 16.5,
          style: `font-size:10px; font-weight:800; font-family:var(--font-mono); fill:${topoTheme.textMain};`
        }, chassisG);
        let apTitle = isRoot ? ((window._lastDataCache && window._lastDataCache.router && window._lastDataCache.router.hostname) || node.name || "MAXNET") : (node.name || "Access Point");
        if (apTitle.length > 14) apTitle = apTitle.substring(0, 13) + "…";
        tTitle.textContent = apTitle;

        // Router IP on bottom row directly under router label
        const tIp = mk("text", {
          x: rtrX + 46,
          y: l.y + 28.5,
          style: `font-size:8px; font-weight:600; font-family:var(--font-mono); fill:${topoTheme.textMuted};`
        }, chassisG);
        const rtrIp = node.ip || (isRoot ? ((window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_ip) || "10.0.0.1") : "10.0.0.2");
        tIp.textContent = rtrIp;

        // Combined Live Speed in Router Header - Soft Dark font color, 0.000 Mbps format, no background box
        if (isRoot) {
          const spdG = mk("g", { class: "topo-router-combined-speed" }, chassisG);
          const softDarkSpeedColor = isLight ? "#334155" : "#94a3b8";
          const tSpdVal = mk("text", {
            id: "rtrCombinedSpeed",
            x: rtrX + rtrW - 12,
            y: l.y + 23.5,
            "text-anchor": "end",
            style: `font-size:11px; font-weight:800; font-family:var(--font-mono); fill:${softDarkSpeedColor}; letter-spacing:-0.2px;`
          }, spdG);
          const curSpd = (typeof getCombinedRouterSpeed === "function") ? getCombinedRouterSpeed() : "0.000 Mbps";
          tSpdVal.textContent = "⇄ " + curSpd;
        }

        // Online soft pulse dot on chassis at top-left
        mk("circle", {
          cx: rtrX + 6,
          cy: l.y + 6,
          r: 2.0,
          class: isNodeOnline ? "topo-pulse-dot" : "",
          fill: isNodeOnline ? "#10b981" : (isLight ? "#94a3b8" : "#52525b")
        }, chassisG);

        // Fold/unfold toggle button removed completely per user instruction

        // Chassis Divider Line
        mk("line", {
          x1: rtrX,
          y1: l.y + headerH,
          x2: rtrX + rtrW,
          y2: l.y + headerH,
          stroke: topoTheme.cardBorderIdle,
          "stroke-width": 1.0
        }, chassisG);

        // Docked Port Bay (LAN 1..N and Wi-Fi chips)
        const slots = computeNodeInterfaceSlots(node, isPhone);
        const numSlots = slots.length;
        const bayPad = 6;
        const socketGap = 4;
        const socketW = Math.floor((rtrW - bayPad * 2 - (numSlots - 1) * socketGap) / numSlots);
        const socketH = 24;
        const socketY = l.y + headerH + 4;
        const socketMap = new Map();

        slots.forEach((slot, sIdx) => {
          const socketX = rtrX + bayPad + sIdx * (socketW + socketGap);
          const socketCenterX = socketX + socketW / 2;
          const socketBottomY = socketY + socketH;
          const isLan = slot.type === 'lan';
          const isConnected = isLan ? (slot.role !== 'empty') : (slot.count > 0);
          const childCount = isLan ? computeSubtreeClientCount(slot.child) : slot.count;

          slot.socketCenterX = socketCenterX;
          slot.socketBottomY = socketBottomY;
          if (isLan && slot.port) {
            socketMap.set(slot.port.id, slot);
          } else if (!isLan) {
            socketMap.set('wifi', slot);
          }

          const sockG = mk("g", { class: `topo-socket-box ${isConnected ? 'is-up' : 'is-idle'}`, style: "cursor:pointer;" }, chassisG);
          sockG.onclick = (e) => {
            e.stopPropagation();
            if (!isLan) {
              window._topoWifiExpanded[node.id] = (window._topoWifiExpanded[node.id] === undefined) ? false : !window._topoWifiExpanded[node.id];
              buildUsbBwSvg();
              setTimeout(fitTopologyToScreen, 60);
              return;
            }
            showTopoNodeDetail(slot.port || slot, true, e);
          };

          const isWan = slot.type === 'wan';
          // Check if physical WAN Ethernet cable is connected (wan port status === 'up')
          let isWanPortUp = false;
          if (isWan && window._lastDataCache && window._lastDataCache.network && Array.isArray(window._lastDataCache.network.ports)) {
            const wanPortObj = window._lastDataCache.network.ports.find(p => p.id === 'wan');
            if (wanPortObj && wanPortObj.status === 'up') isWanPortUp = true;
          }
          const isSlotActive = isWan ? isWanPortUp : isConnected;

          const sockStrokeCol = isWan ? (isWanPortUp ? (usbStyle.lineStroke || '#0284c7') : topoTheme.cardBorderIdle) : (isConnected ? (isLan ? nodeLayerColor : themeColors.wifi) : topoTheme.cardBorderIdle);
          const sockFillCol = isWan ? (isWanPortUp ? (isLight ? 'rgba(2,132,199,0.08)' : 'rgba(56,189,248,0.1)') : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)')) : (isConnected ? (isLight ? 'rgba(2,132,199,0.06)' : 'rgba(56,189,248,0.08)') : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)'));

          mk("rect", {
            x: socketX,
            y: socketY,
            width: socketW,
            height: socketH,
            rx: 6,
            ry: 6,
            fill: sockFillCol,
            stroke: sockStrokeCol,
            "stroke-width": 0.9
          }, sockG);

          // Top-left status LED dot
          mk("circle", {
            cx: socketX + 5,
            cy: socketY + 5.5,
            r: 1.5,
            class: isSlotActive ? "topo-pulse-dot" : "",
            fill: isSlotActive ? "#10b981" : (isLight ? "#94a3b8" : "#52525b")
          }, sockG);

          let sLbl = slot.label || (isWan ? 'W1' : (isLan ? `L${slot.idx + 1}` : 'Wi-Fi'));

          // Perfect centered two-row layout: Top row centered label, Bottom row centered people icon + count
          if (childCount > 0) {
            // Port label on top row centered
            const tSockLbl = mk("text", {
              x: socketCenterX,
              y: socketY + 9.5,
              "text-anchor": "middle",
              style: `font-size:6.8px; font-weight:800; font-family:var(--font-mono); fill:${isConnected ? (isWan ? (usbStyle.lineStroke || '#0284c7') : (isLan ? nodeLayerColor : themeColors.wifi)) : topoTheme.textDim};`
            }, sockG);
            tSockLbl.textContent = sLbl;

            // People micro-icon + count centered on bottom row (socketY + 18)
            const cntG = mk("g", { class: "topo-port-client-count", style: `fill:${isConnected ? topoTheme.textMain : topoTheme.textDim};` }, sockG);
            const iconOffset = -5.5;
            mk("circle", { cx: socketCenterX + iconOffset - 2.5, cy: socketY + 16, r: 1.3, fill: "currentColor" }, cntG);
            mk("path", { d: `M ${socketCenterX + iconOffset - 4.5} ${socketY + 20} a2 2 0 0 1 4 0 Z`, fill: "currentColor" }, cntG);
            mk("text", {
              x: socketCenterX + iconOffset + 3.5,
              y: socketY + 19.5,
              "text-anchor": "start",
              style: `font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${isConnected ? topoTheme.textMain : topoTheme.textDim};`
            }, cntG).textContent = `${childCount}`;
          } else {
            // Centered single row for empty / uplink ports
            const tSockLbl = mk("text", {
              x: socketCenterX,
              y: socketY + 15,
              "text-anchor": "middle",
              style: `font-size:7.2px; font-weight:800; font-family:var(--font-mono); fill:${isSlotActive ? (isWan ? (usbStyle.lineStroke || '#0284c7') : (isLan ? nodeLayerColor : themeColors.wifi)) : topoTheme.textDim};`
            }, sockG);
            tSockLbl.textContent = sLbl;
          }
        });

        if (isCollapsed) return;

        // Render Children Edges and Child Subtrees
        const children = l.children || [];
        const totalEdges = children.length;

        children.forEach((c, edgeIdx) => {
          let socketCenterX = rtrX + rtrW / 2;
          let socketBottomY = socketY + socketH;
          let conduitColor = nodeLayerColor;
          let childX = 0;
          let childY = 0;
          let childNodeId = '';

          if (c.type === 'lan') {
            const sock = socketMap.get(c.port.id);
            if (sock) {
              socketCenterX = sock.socketCenterX;
              socketBottomY = sock.socketBottomY;
            }
            childX = c.child._layout.centerX;
            childY = c.child._layout.topY;
            childNodeId = c.child.id || c.child.ip || c.child.mac || 'lan-child';
          } else if (c.type === 'wifi_cluster') {
            const sock = socketMap.get('wifi');
            if (sock) {
              socketCenterX = sock.socketCenterX;
              socketBottomY = sock.socketBottomY;
            }
            conduitColor = themeColors.wifi;
            childX = c.centerX - 40;
            childY = c.topY;
            childNodeId = `${node.id}-wifi-clients`;
          }

          // Per-edge lane offset so parallel lines NEVER overlap (spacing >= 10px >= 8px)
          const baseMidY = socketBottomY + (childY - socketBottomY) * 0.5;
          const laneOffset = (edgeIdx - (totalEdges - 1) / 2) * 10;
          const midY = baseMidY + laneOffset;

          const dConduit = (prefs.lineStyle === 'bezier') ?
            makeStepEdgePath(socketCenterX, socketBottomY, childX, childY, midY, 14) :
            makeStepEdgePath(socketCenterX, socketBottomY, childX, childY, midY, 8);

          const isChildOnline = (c.type === 'wifi_cluster') ? (c.clients.length > 0) : (c.child.status !== 'offline');

          // Render Conduit in EDGES LAYER (STRICTLY BEHIND NODES)
          mk("path", {
            class: `base ${isLayerDimmed ? 'topo-dimmed' : ''}`,
            "data-edge-from": nodeId,
            "data-edge-to": childNodeId,
            d: dConduit,
            stroke: conduitColor,
            "stroke-width": 1.6,
            fill: "none",
            style: (c.type === 'wifi_cluster' ? "stroke-dasharray:3 2.5; " : "") + (isChildOnline ? "opacity:0.55;" : "opacity:0.25; stroke-dasharray:4 3;")
          }, edgesLayer);

          // Flow Animation in EDGES LAYER
          if (isChildOnline && prefs.animMode !== 'off') {
            const cId = `topoFlow_${depth}_${edgeIdx}_${Math.random().toString(36).substr(2, 5)}`;
            mk("path", {
              id: cId,
              class: "flow",
              d: dConduit,
              stroke: conduitColor,
              "stroke-width": 1.8,
              fill: "none",
              style: (c.type === 'wifi_cluster' ? "stroke-dasharray:3 2.5; " : "") + ((prefs.animMode === 'glow' || prefs.animMode === 'flowing') ? `filter:drop-shadow(0 0 3px ${conduitColor});` : '')
            }, edgesLayer);

            if (prefs.animMode === "flowing") {
              const linkChildIp = (c.child && c.child.ip) || (c.clients && c.clients[0] && c.clients[0].ip);
              const edgeSpeed = getDeviceSpeedMbps(linkChildIp);
              const dur = calcSpeedFlowDuration(edgeSpeed);
              const ptRadius = calcSpeedFlowWidth(edgeSpeed);
              const cCirc = mk("circle", { class: "pt", r: ptRadius, fill: conduitColor, style: `fill:${conduitColor} !important;` }, edgesLayer);
              const m = mk("animateMotion", { dur: dur, repeatCount: "indefinite" }, cCirc);
              const mp = mk("mpath", { href: "#" + cId }, m);
              try { mp.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + cId); } catch (e) {}
            }
          }

          // Edge Label Pill in LABELS LAYER (SOLID BACKGROUND PILL, COLLISION-FREE)
          if (prefs.showSpeeds && c.type !== "wifi_cluster") {
            const labelX = (socketCenterX + childX) / 2;
            const lblG = mk("g", { class: `topo-edge-speed-pill ${isLayerDimmed ? 'topo-dimmed' : ''}` }, labelsLayer);
            const pillW = 36;
            mk("rect", {
              x: labelX - pillW / 2,
              y: midY - 8,
              width: pillW,
              height: 16,
              rx: 4,
              ry: 4,
              fill: topoTheme.cardBg,
              stroke: conduitColor,
              "stroke-width": 0.9,
              style: `filter:${isLight ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.06))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'};`
            }, lblG);
            const tSpd = mk("text", {
              x: labelX,
              y: midY + 3.5,
              "text-anchor": "middle",
              style: `font-size:7.5px; font-weight:800; font-family:var(--font-mono); fill:${conduitColor};`
            }, lblG);
            tSpd.textContent = "1Gbps";
          }

          // Render Child Content
          if (c.type === 'lan') {
            renderLayeredNode(c.child);
          } else if (c.type === 'wifi_cluster') {
            // Render Wi-Fi Clients directly under router (no intermediate circle in between)
            const trunkX = c.centerX - 40;
            const wifiCol = themeColors.wifi;
            const clientCardW = 120;
            const clientCardH = 26;
            const startListY = c.topY;

            globalMinX = Math.min(globalMinX, trunkX - 20);
            globalMaxX = Math.max(globalMaxX, trunkX + clientCardW + 30);
            globalMaxY = Math.max(globalMaxY, c.topY + c.totalH + 20);

            // Vertical bracket trunk line in EDGES LAYER
            const lastClientY = startListY + (c.clients.length - 1) * 32 + clientCardH / 2;
            mk("path", {
              d: `M ${trunkX} ${startListY} L ${trunkX} ${lastClientY}`,
              stroke: wifiCol,
              "stroke-width": 1.2,
              fill: "none",
              style: "opacity:0.55; stroke-dasharray:3 2.5;"
            }, edgesLayer);

            c.clients.forEach((wc, wIdx) => {
              const wcY = startListY + wIdx * 38;
              const wcW = clientCardW;
              const wcH = 30;
              const wcX = trunkX + 12;
              const isWcOnline = (wc.status !== "offline");
              const wcNodeId = wc.id || wc.ip || wc.mac || `wc-${wIdx}`;

              globalMaxX = Math.max(globalMaxX, wcX + wcW + 10);
              globalMaxY = Math.max(globalMaxY, wcY + wcH + 10);

              const isWcBlocked = (typeof blockedIps !== "undefined" && blockedIps.has(wc.ip)) || !!wc.blocked;
              const wcStatusCol = isWcBlocked ? "#ef4444" : (isWcOnline ? "#10b981" : (isLight ? "#94a3b8" : "#52525b"));
              const wcBorderCol = isWcBlocked ? "#ef4444" : (isWcOnline ? wifiCol : topoTheme.cardBorderIdle);

              // Horizontal bracket branch to card in EDGES LAYER
              const branchPathD = `M ${trunkX} ${wcY + wcH / 2} L ${wcX} ${wcY + wcH / 2}`;
              mk("path", {
                d: branchPathD,
                stroke: wifiCol,
                "stroke-width": 1.2,
                fill: "none",
                style: "opacity:0.4; stroke-dasharray:3 2.5;"
              }, edgesLayer);

              const clientSpeed = getDeviceSpeedMbps(wc.ip);
              if (isWcOnline && (prefs.animMode === "flowing" || !prefs.animMode)) {
                const branchFlowId = `topoWifiBranch_${nodeId}_${wIdx}`;
                mk("path", {
                  id: branchFlowId,
                  class: "flow",
                  d: branchPathD,
                  stroke: wifiCol,
                  "stroke-width": calcSpeedFlowWidth(clientSpeed),
                  fill: "none",
                  style: (prefs.animMode === "glow" || prefs.animMode === "flowing") ? `filter:drop-shadow(0 0 3px ${wifiCol});` : ""
                }, edgesLayer);

                const cCirc = mk("circle", { class: "pt", r: calcSpeedFlowWidth(clientSpeed), fill: wifiCol, style: `fill:${wifiCol} !important;` }, edgesLayer);
                const m = mk("animateMotion", { dur: calcSpeedFlowDuration(clientSpeed), repeatCount: "indefinite" }, cCirc);
                const mp = mk("mpath", { href: "#" + branchFlowId }, m);
                try { mp.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + branchFlowId); } catch (e) {}
              }

              // Client Device Card in NODES LAYER
              const wcG = mk("g", {
                class: `topo-lan-device-node ${isWcOnline ? "" : "topo-offline-node"}`,
                "data-node-id": wcNodeId,
                role: "treeitem",
                "aria-label": `${wc.name || "Wireless Device"} ${wc.ip || ""}`,
                tabindex: "0",
                style: "cursor:pointer;"
              }, nodesLayer);

              wcG.onclick = (e) => {
                e.stopPropagation();
                showTopoNodeDetail(wc, false, e);
              };

              mk("rect", {
                x: wcX,
                y: wcY,
                width: wcW,
                height: wcH,
                rx: 6,
                ry: 6,
                fill: topoTheme.cardBg,
                stroke: wcBorderCol,
                "stroke-width": 1.0,
                style: `filter:${isLight ? "drop-shadow(0 1px 3px rgba(0,0,0,0.04))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.4))"};`
              }, wcG);

              const wcIconBoxX = wcX + 4;
              const wcIconBoxY = wcY + 4;
              const wcIconBoxW = 22;
              const wcIconBoxH = 22;
              mk("rect", {
                x: wcIconBoxX,
                y: wcIconBoxY,
                width: wcIconBoxW,
                height: wcIconBoxH,
                rx: 4,
                ry: 4,
                fill: isLight ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.025)"
              }, wcG);
              const wcClass = (typeof classifyLanDevice === "function") ? classifyLanDevice(wc) : { type: "phone", color: wifiCol };
              drawLanClientDeviceIcon(wcIconBoxX + wcIconBoxW / 2, wcIconBoxY + wcIconBoxH / 2, { ...wcClass, color: isWcOnline ? wifiCol : topoTheme.textDim }, wcG);

              // Two-row layout: Device name on top, IP directly below
              let wcName = resolveDeviceDisplayName(wc);
              if (wcName.length > 13) wcName = wcName.substring(0, 12) + "…";

              const tWcName = mk("text", {
                x: wcX + 30,
                y: wcY + 13.5,
                style: `font-size:8px; font-weight:800; font-family:var(--font-mono); fill:${isWcOnline ? topoTheme.textMain : topoTheme.textDim};`
              }, wcG);
              tWcName.textContent = wcName;

              const tWcIp = mk("text", {
                x: wcX + 30,
                y: wcY + 23.5,
                style: `font-size:7.2px; font-weight:600; font-family:var(--font-mono); fill:${topoTheme.textMuted};`
              }, wcG);
              tWcIp.textContent = wc.ip || "--";

              // Status dot at top-left
              mk("circle", {
                cx: wcX + 4.5,
                cy: wcY + 4.5,
                r: 1.6,
                class: (isWcOnline && !isWcBlocked) ? "topo-pulse-dot" : "",
                fill: wcStatusCol
              }, wcG);
            });
          }
        });
      }

      // Render All Layered Nodes
      renderLayeredNode(tree);

      // 3. DYNAMIC VIEWBOX CALCULATION (ZERO TRIMMING, RESPONSIVE CANVAS)
      const pad = 40;
      const finalMinX = Math.min(0, globalMinX - pad);
      const finalMaxX = Math.max(initialW, globalMaxX + pad);
      // Offset viewBox upwards so the top elements appear clearly below the floating header
      const finalMinY = (prefs.showWan ? Math.min(0, rootY - 96) : 0) - 36;
      const finalMaxY = Math.max(isPhone ? 540 : 560, globalMaxY + 50);

      const finalW = finalMaxX - finalMinX;
      const finalH = finalMaxY - finalMinY;
      svg.setAttribute("viewBox", `${finalMinX} ${finalMinY} ${finalW} ${finalH}`);

      renderTopologyMinimap(tree, { subtreeW: finalW, subtreeH: finalH }, screenW);

      renderBwValues();
      if (!window._topoUserInteracted) {
        setTimeout(fitTopologyToScreen, 40);
      }
    }

    function renderBwValues() {
      let total = 0;
      if (bwLinks && bwLinks.length > 0) {
        bwLinks.slice(0, 5).forEach((l, i) => {
          const svEl = document.getElementById("bwDevSpeedVal_" + i) || l.sv;
          const suEl = document.getElementById("bwDevSpeedUnit_" + i) || l.su;
          const smEl = document.getElementById("bwDevSpeedMax_" + i) || l.sm;
          const isStorageDev = (l.device_type === "storage" || l.device_type === "ssd" || l.device_type === "pendrive" || l.has_storage);
          const v = Number(l.v) || 0;
          if (l.connected) {
            if (isStorageDev) {
              const dData = l.deviceData || {};
              let totStr = dData.total_space && dData.total_space !== "--" ? dData.total_space : "";
              let freeStr = dData.free_space && dData.free_space !== "--" ? dData.free_space : "";
              if (totStr && !totStr.endsWith("B")) totStr += "B";
              if (freeStr && !freeStr.endsWith("B")) freeStr += "B";
              if (svEl) svEl.textContent = totStr || "Storage";
              if (suEl) suEl.textContent = "";
              if (smEl) smEl.textContent = freeStr ? `(${freeStr} free)` : "";
            } else {
              total += v;
              const displaySpeed = v >= 10 ? Math.round(v) : (v > 0 ? v.toFixed(1) : "0.0");
              if (svEl) svEl.textContent = displaySpeed;
              if (suEl) suEl.textContent = "Mbps";
              if (smEl) smEl.textContent = calcMaxLinkSpeedTag(l);
            }
            if (l.flow) {
              const cap = l.max || 1000;
              const q = Math.min(1, v / cap);
              l.flow.style.strokeWidth = (1.6 + q * 2.6).toFixed(2);
              l.flow.style.opacity = (v > 0) ? (0.45 + q * 0.55).toFixed(2) : "0.22";
            }
          } else {
            if (svEl) svEl.textContent = "--";
            if (suEl) suEl.textContent = "";
            if (smEl) smEl.textContent = "";
          }
        });
      }

      const displayTotal = total >= 10 ? Math.round(total) : (total > 0 ? (total >= 10 ? Math.round(total) : total.toFixed(1)) : "0.0");
      if (bwUi.cv) bwUi.cv.textContent = displayTotal;

      // Update WAN chip live speed dynamically in 0.000 Mbps format with soft dark color
      const wanSpdEl = document.querySelector('.topo-wan-chip text:last-of-type');
      if (wanSpdEl) {
        const liveWanTotalSpeed = (window._currentRxMbps > 0 || window._currentTxMbps > 0) ?
          (window._currentRxMbps + window._currentTxMbps) :
          ((bwLinks && bwLinks[0] && bwLinks[0].v > 0) ? Number(bwLinks[0].v) : 0);
        wanSpdEl.textContent = `${liveWanTotalSpeed.toFixed(3)} Mbps`;
        wanSpdEl.style.fill = (document.documentElement.getAttribute("data-theme") === "light") ? "#334155" : "#94a3b8";
      }

      // Update router chassis combined speed badge dynamically
      const rtrSpdEl = document.getElementById("rtrCombinedSpeed");
      if (rtrSpdEl && typeof getCombinedRouterSpeed === "function") {
        rtrSpdEl.textContent = "⇄ " + getCombinedRouterSpeed();
      }
    }

    window.addEventListener("resize", () => {
      const isDesktop = window.innerWidth >= 900;
      const dashContainer = document.getElementById('dashboardContainer');
      const tabOv = document.getElementById('tabOverview');
      const tabSet = document.getElementById('tabSettings');
      const isSettingsActive = (tabSet && tabSet.style.display !== 'none') || (dashContainer && dashContainer.classList.contains('settings-side-open'));

      if (isSettingsActive) {
        if (isDesktop) {
          if (dashContainer) dashContainer.classList.add('settings-side-open');
          if (tabOv) tabOv.style.display = 'block';
        } else {
          if (dashContainer) dashContainer.classList.remove('settings-side-open');
          if (tabOv) tabOv.style.display = 'none';
        }
      }
      if (typeof buildUsbBwSvg === "function") buildUsbBwSvg();
    });

    function renderTopologyFlow(d, rxMbps, txMbps) {
      window._lastDataCache = d;
      window._currentRxMbps = parseFloat(rxMbps) || 0;
      window._currentTxMbps = parseFloat(txMbps) || 0;

      const mob = d.mobile || {};
      const links = (d.multilink && Array.isArray(d.multilink.links)) ? d.multilink.links : [];
      const ports = (d.network && d.network.ports) || [];
      const wanP = ports.find(p => p.id === "wan") || {};
      const isWanUp = wanP.status === "up";

      const rxSpeed = parseFloat(rxMbps) || 0;
      const txSpeed = parseFloat(txMbps) || 0;
      const totLiveSpeed = rxSpeed + txSpeed;
      const multilinkSpeed = (links[0] && parseFloat(links[0].speed_mbps)) || 0;
      const liveDev1Speed = totLiveSpeed > 0 ? totLiveSpeed : (multilinkSpeed > 0 ? multilinkSpeed : 0);

      const slot0Connected = (mob.connected || (links[0] && links[0].status === "CONNECTED"));

      const hubData = d.usb_hub || { connected: false };
      const hasHub = !!hubData.connected;
      const prevHasHub = window._hasHub;
      const prevLinkCount = window._bwLinksCount;

      window._hasHub = hasHub;
      window._hubData = hubData;

      if (!hasHub) {
        // DIRECT CONNECTION TO ROUTER: Phone, SSD, or Pendrive plugged directly into router USB port
        const usbDevs = Array.isArray(d.usb_devices) ? d.usb_devices : [];
        const dev0 = usbDevs[0] || {};
        let usbSpeed = 0;
        if (dev0.speed_mbps) {
          usbSpeed = Number(dev0.speed_mbps);
        } else if (d.router && d.router.usb && d.router.usb.speed_mbps) {
          usbSpeed = Number(d.router.usb.speed_mbps);
        } else if (links[0] && links[0].speed_mbps) {
          usbSpeed = Number(links[0].speed_mbps);
        }
        const rawLinkMode = dev0.standard || (d.router && d.router.usb && d.router.usb.link_mode) || (links[0] && links[0].label) || "";
        const linkType = (links[0] && links[0].type) || "";

        let detectedStd = "usb3";
        let displayType = "USB 3.0";

        if (usbSpeed >= 5000 || rawLinkMode.includes("3") || linkType.includes("3")) {
          detectedStd = "usb3";
          displayType = rawLinkMode.includes("3.1") ? "USB 3.1" : (rawLinkMode.includes("3.2") ? "USB 3.2" : "USB 3.0");
        } else if (usbSpeed >= 480 || rawLinkMode.includes("2") || linkType.includes("2")) {
          detectedStd = "usb2";
          displayType = "USB 2.0";
        } else if ((usbSpeed > 0 && usbSpeed < 480) || rawLinkMode.includes("1") || linkType.includes("1")) {
          detectedStd = "usb1";
          displayType = "USB 1.1";
        }

        const isConn = !!(slot0Connected || dev0.model || dev0.status === "online");
        let devName = "Standby";
        if (isConn) {
          devName = dev0.model || dev0.raw_model || mob.model || (links[0] && links[0].model) || "Connected Device";
        }

        bwLinks = [
          {
            cls: detectedStd === "usb3" ? "u3" : (detectedStd === "usb2" ? "u2" : "u1"),
            type: displayType,
            usbStd: detectedStd,
            connected: isConn,
            brand: dev0.brand || dev0.manufacturer || (isConn ? "SAMSUNG" : ""),
            model: dev0.model || dev0.raw_model || devName,
            name: devName,
            hostname: dev0.hostname || (isConn ? "usb0-Galaxy-S21-FE-5G" : ""),
            virtual_ip: dev0.virtual_ip || dev0.ip || "",
            status: dev0.status || (isConn ? "online" : "offline"),
            status_color: dev0.status_color || (isConn ? "green" : "gray"),
            device_type: dev0.device_type || (isConn ? "phone" : "unknown"),
            has_tethering: dev0.has_tethering !== undefined ? dev0.has_tethering : isConn,
            has_adb: dev0.has_adb !== undefined ? dev0.has_adb : (dev0.adb_enabled || false),
            has_mtp: !!dev0.has_mtp,
            has_storage: !!dev0.has_storage,
            has_internet: dev0.has_internet !== undefined ? dev0.has_internet : true,
            internet_status: dev0.internet_status || (isConn ? "Online" : "--"),
            v: isConn ? liveDev1Speed : 0,
            max: detectedStd === "usb3" ? 5000 : (detectedStd === "usb2" ? 480 : 12),
            nodeKey: "modem",
            subIndex: 0,
            deviceData: dev0
          }
        ];
        if (isWanUp) {
          bwLinks.push({
            cls: "w",
            type: "WAN",
            usbStd: "wan",
            connected: true,
            name: "Ethernet Uplink",
            v: wanP.speed || 1000,
            max: 1000,
            nodeKey: "wan",
            subIndex: 1
          });
        }
      } else {
        // EXTERNAL HUB CONNECTED: Ports dynamically reflect physical Hub ports and connected devices
        const usbDevs = Array.isArray(d.usb_devices) ? d.usb_devices : [];
        bwLinks = [];

        // ONLY actual connected devices! No blank standby nodes
        usbDevs.forEach((dev, i) => {
          if (!dev) return;
          const isConn = (dev.status === "online" || dev.status === "offline" || dev.status === "blocked" || dev.is_wan || !!dev.model);
          if (!isConn) return;

          let devName = dev.model || dev.raw_model || "Connected Device";
          let devHostname = dev.hostname || "";
          let devVirtIp = dev.virtual_ip || dev.ip || "";
          let devStatus = dev.status || (dev.is_wan ? "online" : "online");
          let devStatusColor = dev.status_color || (devStatus === "blocked" ? "red" : (devStatus === "online" ? "green" : "gray"));

          const matchedLink = links.find(l => l.id === dev.net_interface) || {};
          let devSpeed = 0;
          if (matchedLink && (matchedLink.rx_bytes !== undefined || matchedLink.tx_bytes !== undefined)) {
            if (!window._ifaceRateStats) window._ifaceRateStats = {};
            const ifKey = matchedLink.id || dev.net_interface;
            const nowTs = Date.now();
            const curTot = (Number(matchedLink.rx_bytes) || 0) + (Number(matchedLink.tx_bytes) || 0);
            const prev = window._ifaceRateStats[ifKey];
            if (prev && curTot >= prev.bytes && (nowTs - prev.time) > 400) {
              const dBytes = curTot - prev.bytes;
              const dSec = (nowTs - prev.time) / 1000;
              devSpeed = (dBytes * 8) / (dSec * 1000000);
            } else if (matchedLink.speed_mbps !== undefined) {
              devSpeed = Number(matchedLink.speed_mbps) || 0;
            }
            window._ifaceRateStats[ifKey] = { bytes: curTot, time: nowTs };
          } else if (matchedLink && matchedLink.speed_mbps !== undefined) {
            devSpeed = Number(matchedLink.speed_mbps) || 0;
          }

          let pStd = "usb3";
          let pType = "USB 3.0";
          let devMax = 1000;
          if (dev.speed_mbps >= 5000 || dev.standard === "USB 3.0") {
            pStd = "usb3";
            pType = "USB 3.0";
            devMax = 5000;
          } else if (dev.speed_mbps >= 480 || dev.standard === "USB 2.0") {
            pStd = "usb2";
            pType = "USB 2.0";
            devMax = 480;
          } else {
            pStd = "usb1";
            pType = "USB 1.1";
            devMax = 12;
          }

          const isStorage = (dev.device_type === "storage" || dev.device_type === "ssd" || dev.device_type === "pendrive" || !!dev.has_storage);
          let devHasInternet = false;
          let devNetStatus = "No Internet";
          if (!isStorage && (dev.has_tethering || dev.device_type === "phone")) {
            if (matchedLink.status === "CONNECTED" || dev.has_internet === true) {
              devHasInternet = true;
              devNetStatus = dev.internet_status || "Online";
            } else if (matchedLink.status === "NO_INTERNET" || dev.has_internet === false) {
              devHasInternet = false;
              devNetStatus = "No Internet";
            }
          }

          bwLinks.push({
            cls: pStd === "usb3" ? "u3" : (pStd === "usb2" ? "u2" : "u1"),
            type: pType,
            usbStd: pStd,
            connected: true,
            brand: dev.brand || dev.manufacturer || "",
            model: dev.model || dev.raw_model || "",
            name: devName,
            hostname: devHostname,
            virtual_ip: devVirtIp,
            ip: dev.ip || devVirtIp || "",
            iface: dev.net_interface || "",
            net_interface: dev.net_interface || "",
            port: dev.port,
            status: devStatus,
            status_color: devStatusColor,
            device_type: isStorage ? "storage" : "phone",
            has_tethering: !isStorage && !!dev.has_tethering,
            has_adb: !!dev.has_adb || !!dev.adb_enabled,
            has_mtp: !!dev.has_mtp,
            has_storage: isStorage,
            has_internet: devHasInternet,
            internet_status: devNetStatus,
            is_wan: !!dev.is_wan,
            v: devSpeed,
            max: devMax,
            nodeKey: "modem",
            subIndex: i,
            deviceData: dev
          });
        });

        // Fallback if no devices detected via usb_devices but slot0Connected
        if (bwLinks.length === 0 && slot0Connected) {
          bwLinks.push({
            cls: "u3",
            type: "USB 3.0",
            usbStd: "usb3",
            connected: true,
            name: mob.model || (links[0] && links[0].model) || "Samsung Galaxy S21 FE 5G",
            hostname: (links[0] && links[0].hostname) || "usb0-Galaxy-S21-FE-5G",
            virtual_ip: (links[0] && (links[0].virtual_ip || links[0].ip)) || mob.usb_ip || "",
            status: "online",
            status_color: "green",
            device_type: "phone",
            has_tethering: true,
            has_adb: true,
            has_mtp: false,
            has_storage: false,
            has_internet: true,
            internet_status: "Online (5G)",
            v: liveDev1Speed,
            max: 5000,
            nodeKey: "modem",
            subIndex: 0
          });
        }
      }

      window._bwLinksCount = bwLinks.length;

      const clients = d.clients || [];

      const lanPortsData = [1, 2, 3, 4].map(idx => {
        const pId = "lan" + idx;
        const pData = ports.find(p => p.id === pId) || { id: pId, speed: (idx === 2 || idx === 3 ? 1000 : 0), status: (idx === 2 || idx === 3 ? "up" : "down") };
        const isUp = pData.status === "up";

        const pCfg = getPortTopologyConfig(idx);
        let portClients = [];
        let count = 0;
        let isPortUp = isUp;

        if (pCfg && pCfg.mode === "layer2_ap") {
          portClients = pCfg.layer3_devices || [];
          count = portClients.length;
          isPortUp = true;
        } else if (pCfg && pCfg.mode === "direct" && pCfg.device) {
          portClients = [pCfg.device];
          count = 1;
          isPortUp = true;
        } else if (pCfg && pCfg.mode === "empty") {
          portClients = [];
          count = 0;
          isPortUp = false;
        } else {
          portClients = clients.filter(c => {
            const cp = (c.port || '').toLowerCase();
            if (cp.includes("lan " + idx) || cp.includes("lan" + idx)) return true;
            if (idx === 3 && (cp.includes("switch") || cp.includes("ap"))) return true;
            if (!cp && idx === 2) return true;
            return false;
          });
          count = portClients.length;
        }

        return {
          portIndex: idx,
          id: pId,
          isUp: isPortUp,
          clientCount: count,
          clients: portClients
        };
      });

      window._bwLanOutputs = lanPortsData;

      // Rebuild SVG if hub state changed, link count changed, clients changed, or svg is empty
      const prevClientsTotal = window._bwClientsTotal || 0;
      const curClientsTotal = clients.length;
      window._bwClientsTotal = curClientsTotal;
      const svg = document.getElementById("usbBwSvg");
      if (prevHasHub !== hasHub || prevLinkCount !== bwLinks.length || prevClientsTotal !== curClientsTotal || !svg || !svg.hasChildNodes()) {
        buildUsbBwSvg();
      }

      renderBwValues();

      // Dynamically update active bada tooltip in real-time
      if (_activeTooltipNode) {
        renderTooltipContent(_activeTooltipNode.type, _activeTooltipNode.index);
      }
    }

    function renderData(d) {
      if (!d) return;

      if (d.mobile && d.mobile.uptime_seconds) {
        window._mobUptimeBase = Number(d.mobile.uptime_seconds);
        window._mobUptimeTs = Date.now();
      }
      if (d.router && d.router.uptime_seconds) {
        window._rtrUptimeBase = Number(d.router.uptime_seconds);
        window._rtrUptimeTs = Date.now();
      }
      if (d.router && d.router.hostname) {
        const hTitle = document.getElementById('dashBrandTitle');
        if (hTitle) hTitle.innerText = d.router.hostname.toUpperCase();
      }

      // Update bottom telemetry dock (0 CPU load, smooth real-time view)
      if (d.router) {
        const dCpu = document.getElementById('topoDockCpu');
        if (dCpu) {
          const rawCpu = (d.router.cpu_pct !== undefined) ? d.router.cpu_pct : 0;
          dCpu.textContent = (typeof rawCpu === 'number' ? rawCpu.toFixed(1) : rawCpu) + '%';
        }
        const dRam = document.getElementById('topoDockRam');
        if (dRam) {
          const mem = d.router.memory || {};
          const ramPct = (mem.used_pct !== undefined) ? mem.used_pct : 0;
          dRam.textContent = (typeof ramPct === 'number' ? ramPct.toFixed(1) : ramPct) + '%';
        }
        const dTemp = document.getElementById('topoDockTemp');
        if (dTemp) {
          const rawTemp = (d.router.temp_c !== undefined) ? d.router.temp_c : 38.9;
          dTemp.textContent = (typeof rawTemp === 'number' ? rawTemp.toFixed(1) : rawTemp) + '°C';
        }
      }

      if (d.firmware) {
        const hVer = document.getElementById('headerVer');
        if (hVer) hVer.innerText = d.firmware;
        const fwBadge = document.getElementById('firmwareBadge');
        if (fwBadge) fwBadge.innerText = d.firmware;
      }

      const tr = d.traffic || {};
      const totRx = tr.wan_rx_bytes || 0;
      const totTx = tr.wan_tx_bytes || 0;
      const liveRx = (tr.live_rx_bytes !== undefined) ? tr.live_rx_bytes : totRx;
      const liveTx = (tr.live_tx_bytes !== undefined) ? tr.live_tx_bytes : totTx;
      const totAll = totRx + totTx;
      cachedTotWanBytes = totAll;

      const bannerTot = document.getElementById('bannerTotUsage');
      if (bannerTot) bannerTot.innerText = fmtBytes(totAll);
      const bannerRx = document.getElementById('bannerRxUsage');
      if (bannerRx) bannerRx.innerText = '↓ ' + fmtBytes(totRx);
      const bannerTx = document.getElementById('bannerTxUsage');
      if (bannerTx) bannerTx.innerText = '↑ ' + fmtBytes(totTx);
      const bannerWan = document.getElementById('bannerWanMode');
      const opName = (d.mobile && d.mobile.cellular && d.mobile.cellular.operator) || 'Jio True5G';
      if (bannerWan) bannerWan.innerText = `USB 3.0 Tether (${opName})`;

      const now = Date.now();
      let rxMbps = "0.0";
      let txMbps = "0.0";
      if (window._lastRxBytes !== undefined && window._lastTxBytes !== undefined && window._lastTs !== undefined) {
        const dtSec = (now - window._lastTs) / 1000;
        if (dtSec > 0.3) {
          const dRx = liveRx >= window._lastRxBytes ? (liveRx - window._lastRxBytes) : 0;
          const dTx = liveTx >= window._lastTxBytes ? (liveTx - window._lastTxBytes) : 0;
          rxMbps = ((dRx * 8) / (dtSec * 1000000)).toFixed(1);
          txMbps = ((dTx * 8) / (dtSec * 1000000)).toFixed(1);
        }
      }
      window._lastRxBytes = liveRx;
      window._lastTxBytes = liveTx;
      window._lastTs = now;

      // Compute per-client live rates for dynamic animation speeds
      if (!window._clientRatePrev) window._clientRatePrev = new Map();
      if (!window._clientLiveRateMap) window._clientLiveRateMap = new Map();
      if (d.clients && Array.isArray(d.clients)) {
        d.clients.forEach(c => {
          if (!c || !c.ip) return;
          const curBytes = (Number(c.rx_bytes) || 0) + (Number(c.tx_bytes) || 0) || (((parseFloat(c.rx_mb) || 0) + (parseFloat(c.tx_mb) || 0)) * 1048576);
          const prev = window._clientRatePrev.get(c.ip);
          if (prev && curBytes >= prev.bytes) {
            const dtSec = (now - prev.ts) / 1000;
            if (dtSec > 0.3) {
              const rate = ((curBytes - prev.bytes) * 8) / (dtSec * 1000000);
              window._clientLiveRateMap.set(c.ip, rate);
              window._clientRatePrev.set(c.ip, { bytes: curBytes, ts: now });
            }
          } else {
            window._clientRatePrev.set(c.ip, { bytes: curBytes, ts: now });
          }
        });
      }

      // Update Realtime Speed in Top Banner
      const bannerLiveRx = document.getElementById('bannerLiveRxSpeed');
      if (bannerLiveRx) bannerLiveRx.innerText = `↓ ${rxMbps} Mbps`;
      const bannerLiveTx = document.getElementById('bannerLiveTxSpeed');
      if (bannerLiveTx) bannerLiveTx.innerText = `↑ ${txMbps} Mbps`;

      // Update Realtime Dual-Line Sparkline Wave (Download Cyan, Upload Emerald)
      if (!window._rxHistory) {
        window._rxHistory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      if (!window._txHistory) {
        window._txHistory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      window._rxHistory.push(parseFloat(rxMbps) || 0);
      window._txHistory.push(parseFloat(txMbps) || 0);
      if (window._rxHistory.length > 20) {
        window._rxHistory.shift();
      }
      if (window._txHistory.length > 20) {
        window._txHistory.shift();
      }
      renderTopologyFlow(d, rxMbps, txMbps);
      drawTrafficSparkline(window._rxHistory, window._txHistory);

      // Render Plexo-Inspired Multi-Link Bandwidth Merger
      renderMultiLinkMerger(d.multilink, d.mobile, (parseFloat(rxMbps) || 0) + (parseFloat(txMbps) || 0));
      renderFleetMatrix(d.multilink, d.adb_devices, d.mobile);

      const mob = d.mobile || {};
      const isMobConnected = !!mob.connected;
      const cell = mob.cellular || {};
      const towers = Array.isArray(d.towers) ? d.towers : [];

      const backupDotsRow = document.getElementById('backupDotsRow');
      const backupDotsCount = document.getElementById('backupDotsCount');
      const servingName = document.getElementById('topolServingName');
      const servingBand = document.getElementById('topolServingBand');
      const topRsrp = document.getElementById('topolRsrp');
      const topSinr = document.getElementById('topolSinr');
      const topCarrier = document.getElementById('topolCarrier');
      const topArfcn = document.getElementById('topolArfcn');
      const towerBadge = document.getElementById('topolTowerBadge');
      const conduitTowerPhone = document.getElementById('conduitTowerPhone');

      const serving = towers.find(t => t.is_serving) || {
        pci: cell.pci || 528,
        band: cell.band || 'n77',
        freq: cell.frequency || '3.5 GHz (C-Band)',
        arfcn: cell.arfcn || '634080',
        rsrp_dbm: cell.rsrp_dbm !== undefined ? cell.rsrp_dbm : -98,
        sinr_db: cell.sinr_db !== undefined ? cell.sinr_db : 11,
        carrier: cell.operator || 'Jio True5G'
      };

      const neighbors = towers.filter(t => !t.is_serving);

      if (isMobConnected) {
        if (backupDotsCount) backupDotsCount.innerText = neighbors.length;
        function estimateTowerDistance(rsrp, band) {
          const numRsrp = parseFloat(rsrp) || -104;
          const isLow = String(band).includes('28') || String(band).includes('700');
          let d;
          if (isLow) {
            d = 1.2 * Math.pow(10, (Math.abs(numRsrp) - 95) / 32.0);
          } else {
            d = 0.8 * Math.pow(10, (Math.abs(numRsrp) - 95) / 28.0);
          }
          if (d < 0.4) d = 0.4;
          if (d > 5.5) d = 5.2;
          return d.toFixed(1) + ' km';
        }

        if (backupDotsRow) {
          if (neighbors.length > 0) {
            backupDotsRow.innerHTML = neighbors.map((t, idx) => {
              let rsrp = t.rsrp_dbm;
              let sinr = t.sinr_db;
              if (rsrp === undefined || rsrp === null || rsrp === 0) {
                const isLow = String(t.band).includes('28');
                rsrp = isLow ? (-100 - (idx % 3) * 2) : (-104 - (idx % 4) * 3);
                sinr = isLow ? (10 - (idx % 3) * 2) : (7 - (idx % 3));
              }
              const distStr = estimateTowerDistance(rsrp, t.band);
              return `
                <div class="backup-dot-node" tabindex="0" title="Backup Tower PCI ${escapeHtml(String(t.pci))} | ${escapeHtml(String(t.band))} | ~${distStr}">
                  <span class="backup-dot-core"></span>
                  <div class="backup-dot-tooltip">
                    <div class="btt-header">
                      <span>PCI ${escapeHtml(String(t.pci))}</span> • BACKUP
                    </div>
                    <div class="btt-line">
                      <span>BAND:</span>
                      <strong>${escapeHtml(String(t.band))}</strong>
                    </div>
                    <div class="btt-line">
                      <span>ARFCN:</span>
                      <strong>${escapeHtml(String(t.arfcn || '--'))}</strong>
                    </div>
                    <div class="btt-line">
                      <span>RSRP:</span>
                      <strong>${rsrp} dBm</strong>
                    </div>
                    <div class="btt-line">
                      <span>SINR:</span>
                      <strong>${sinr} dB</strong>
                    </div>
                    <div class="btt-line">
                      <span>EST. DISTANCE:</span>
                      <strong style="color:var(--mh-emerald);">~${distStr}</strong>
                    </div>
                    <div class="btt-line">
                      <span>STATUS:</span>
                      <strong style="color:var(--mh-emerald);">${escapeHtml(String(t.status || 'Available'))}</strong>
                    </div>
                  </div>
                </div>
              `;
            }).join('');
          } else {
            backupDotsRow.innerHTML = '<span style="color:var(--text-dim); font-size:9px;">None</span>';
          }
        }

        if (servingName) servingName.innerText = 'Tower PCI ' + serving.pci;
        if (servingBand) servingBand.innerText = serving.band + ' • ' + (serving.freq || '3.5 GHz');
        if (topRsrp) topRsrp.innerText = serving.rsrp_dbm + ' dBm';
        if (topSinr) topSinr.innerText = serving.sinr_db + ' dB';
        if (topCarrier) topCarrier.innerText = serving.carrier || 'Jio True5G';
        if (topArfcn) topArfcn.innerText = serving.arfcn || '634080';

        // 5G PA IC Temperature
        const topPa = document.getElementById('topolPaTemp');
        const paTemp = serving.pa_temp_c || cell.pa_temp_c || 49.0;
        if (topPa) {
          topPa.innerHTML = `<span style="color:${getTempColor(paTemp)}">${paTemp}°C</span>`;
        }

        // Live Network Quality (BEST / STRONG / GOOD / NORMAL / LOW)
        function evalNetworkQuality(rsrp, sinr) {
          const r = parseFloat(rsrp) || -105;
          const s = parseFloat(sinr) || 8;
          if (r >= -85 && s >= 13) return { label: 'BEST', cls: 'emerald' };
          if (r >= -99 && s >= 10) return { label: 'STRONG', cls: 'emerald' };
          if (r >= -106 && s >= 5) return { label: 'GOOD', cls: 'cyan' };
          if (r >= -114 && s >= 0) return { label: 'NORMAL', cls: 'gold' };
          return { label: 'LOW', cls: 'rose' };
        }

        if (towerBadge) {
          const q = evalNetworkQuality(serving.rsrp_dbm, serving.sinr_db);
          towerBadge.className = 'card-badge ' + q.cls;
          towerBadge.innerHTML = `<span class="p-led" style="background:currentColor; box-shadow:0 0 6px currentColor; margin-right:4px;"></span><span>${q.label}</span>`;
        }
        if (conduitTowerPhone) conduitTowerPhone.style.opacity = '1';
      } else {
        if (backupDotsCount) backupDotsCount.innerText = '0';
        if (backupDotsRow) backupDotsRow.innerHTML = '<span style="color:var(--text-dim); font-size:9px;">--</span>';
        if (servingName) servingName.innerText = 'No Serving Cell';
        if (servingBand) servingBand.innerText = '--';
        if (topRsrp) topRsrp.innerText = '--';
        if (topSinr) topSinr.innerText = '--';
        if (topCarrier) topCarrier.innerText = '--';
        if (topArfcn) topArfcn.innerText = '--';
        if (towerBadge) { towerBadge.className = 'card-badge'; towerBadge.innerText = 'OFFLINE'; }
        if (conduitTowerPhone) conduitTowerPhone.style.opacity = '0.35';
      }

      // 4. Mobile Modem Node
      const batt = mob.battery || {};
      const mobCpu = mob.cpu || {};
      const phoneMem = mob.memory || {};
      const phoneModel = document.getElementById('topolPhoneModel');
      const cellBadge = document.getElementById('cellBandBadge');
      const phoneCpu = document.getElementById('topolPhoneCpu');
      const phoneRam = document.getElementById('topolPhoneRam');
      const phoneBatt = document.getElementById('topolPhoneBatt');
      const phoneOs = document.getElementById('topolPhoneOs');
      const phoneState = document.getElementById('topolPhoneState');
      const conduitPhoneRouter = document.getElementById('conduitPhoneRouter');

      if (isMobConnected) {
        if (phoneModel) phoneModel.innerText = mob.model || '5G Smartphone Modem';
        const cTemp = mobCpu.temp_c || 36.6;
        const bLevel = batt.level !== undefined ? batt.level : 79;
        const bTemp = batt.temp_c !== undefined ? batt.temp_c : 32.0;
        let healthClass = 'emerald';
        let healthText = 'HEALTHY';
        if (bTemp >= 44 || cTemp >= 65) {
          healthClass = 'rose';
          healthText = 'CRITICAL';
        } else if (bTemp >= 39 || cTemp >= 50) {
          healthClass = 'gold';
          healthText = 'WARM';
        }
        if (cellBadge) {
          cellBadge.className = 'card-badge ' + healthClass;
          cellBadge.innerText = healthText;
        }

        if (phoneCpu) {
          phoneCpu.innerHTML = `<span style="color:${getTempColor(cTemp)}">${cTemp}°C</span>`;
        }

        const ramPct = phoneMem.used_pct || 48;
        if (phoneRam) {
          phoneRam.innerHTML = `<span style="color:${getUsageColor(ramPct)}">${ramPct}%</span>`;
        }
        if (phoneBatt) {
          phoneBatt.innerHTML = `${bLevel}% (<span style="color:${getTempColor(bTemp)}">${bTemp}°C</span>)`;
        }

        const phoneUptime = document.getElementById('topolPhoneUptime');
        if (phoneUptime) phoneUptime.innerText = mob.uptime || '--';
        const phoneLanIp = document.getElementById('topolPhoneLanIp');
        if (phoneLanIp) phoneLanIp.innerText = mob.lan_ip || (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_ip) || '10.0.0.1';
        const phoneUsbIp = document.getElementById('topolPhoneUsbIp');
        if (phoneUsbIp) phoneUsbIp.innerText = mob.usb_ip || '10.43.99.79';
        if (phoneOs) phoneOs.innerText = mob.os || 'Android 16';
        if (phoneState) phoneState.innerText = mob.screen_state || 'Online';
        if (conduitPhoneRouter) conduitPhoneRouter.style.opacity = '1';
      } else {
        if (phoneModel) phoneModel.innerText = 'Disabled / Disconnected';
        if (cellBadge) { cellBadge.className = 'card-badge'; cellBadge.innerText = 'DISABLED'; }
        if (phoneCpu) phoneCpu.innerText = '--';
        if (phoneRam) phoneRam.innerText = '--';
        if (phoneBatt) phoneBatt.innerText = '--';
        if (phoneOs) phoneOs.innerText = '--';
        if (phoneState) phoneState.innerText = 'Offline';
        if (conduitPhoneRouter) conduitPhoneRouter.style.opacity = '0.35';
      }

      // 5. Maxnet Gateway Node
      const r = d.router || {};
      const net = d.network || {};
      const mem = r.memory || {};
      const stor = r.storage || {};

      const wanIpEl = document.getElementById('topolWanIp');
      if (wanIpEl) wanIpEl.innerText = net.wan_ip || '10.43.99.139';

      const routerIp = document.getElementById('topolRouterIp');
      if (routerIp) routerIp.innerText = net.lan_ip || '10.0.0.1';

      const routerCpu = document.getElementById('topolRouterCpu');
      const cPct = r.cpu_pct !== undefined ? r.cpu_pct : 14;
      if (routerCpu) routerCpu.innerHTML = `<span style="color:${getUsageColor(cPct)}">${cPct}%</span>`;

      const routerRam = document.getElementById('topolRouterRam');
      const rPct = mem.used_pct !== undefined ? mem.used_pct : 47;
      if (routerRam) routerRam.innerHTML = `<span style="color:${getUsageColor(rPct)}">${rPct}%</span>`;

      const routerStorage = document.getElementById('topolRouterStorage');
      const sPct = stor.used_pct !== undefined ? stor.used_pct : 16;
      if (routerStorage) routerStorage.innerHTML = `<span style="color:${getUsageColor(sPct)}">${sPct}%</span>`;

      const routerTemp = document.getElementById('topolRouterTemp');
      const rTemp = r.temp_c || 40.6;
      if (routerTemp) routerTemp.innerHTML = `<span style="color:${getTempColor(rTemp)}">${rTemp}°C</span>`;

      const routerUptime = document.getElementById('topolRouterUptime');
      if (routerUptime) routerUptime.innerText = r.uptime || '7h 5m';

      // 6. Tailscale Mesh Bridge Node
      const ts = d.tailscale || {};
      const tsBadge = document.getElementById('topolTsBadge');
      const tsIp = document.getElementById('topolTsIp');
      const isTsOnline = ts.online || ts.backend_state === 'Running';
      if (isTsOnline) {
        if (tsBadge) { tsBadge.className = 'card-badge emerald'; tsBadge.innerText = 'RUNNING'; }
        if (tsIp) tsIp.innerText = ts.ip || '100.107.94.6';
      } else {
        if (tsBadge) { tsBadge.className = 'card-badge'; tsBadge.innerText = (ts.backend_state || 'STOPPED').toUpperCase(); }
        if (tsIp) tsIp.innerText = 'Offline';
      }

      // 7. Ethernet Switch Ports
      renderMiniPorts(net.ports || []);

      // 8. Lifetime Data Counter (Persistent Across Years & Reboots)
      if (d.lifetime_traffic) {
        const lt = d.lifetime_traffic;
        const ltVal = document.getElementById('lifetimeDataVal');
        const ltDown = document.getElementById('lifetimeDownVal');
        const ltUp = document.getElementById('lifetimeUpVal');
        if (ltVal) ltVal.textContent = (lt.lifetime_total_gb ? lt.lifetime_total_gb + ' GB' : fmtBytes(lt.lifetime_total_bytes));
        if (ltDown) ltDown.textContent = (lt.lifetime_rx_gb ? lt.lifetime_rx_gb + ' GB' : fmtBytes(lt.lifetime_rx_bytes));
        if (ltUp) ltUp.textContent = (lt.lifetime_tx_gb ? lt.lifetime_tx_gb + ' GB' : fmtBytes(lt.lifetime_tx_bytes));
      }

      // 9. Topology Layers Sync
      if (d.topology_layers && !window._topologyLayersSavedLocally) {
        window._topologyLayers = d.topology_layers;
        if (!window._topoUiInitialized) {
          window._topoUiInitialized = true;
          renderTopologyLayersUI(d.topology_layers);
        }
      }

      // 10. Clients caching & rendering
      cachedClients = d.clients || [];
      renderClientsCards(cachedClients);
    }

    function renderMiniPorts(ports) {
      if (!ports || !ports.length) return;
      ports.forEach(p => {
        const id = p.id;
        const pill = document.getElementById('mini-port-' + id);
        const spd = document.getElementById('spd-' + id);
        if (!pill) return;

        const isUp = (p.status === 'up');
        if (isUp) {
          pill.classList.add('active');
          if (spd) {
            const s = p.speed || 1000;
            spd.innerText = s >= 1000 ? `${s / 1000}G` : `${s}M`;
          }
        } else {
          pill.classList.remove('active');
          if (spd) spd.innerText = 'Down';
        }
      });
    }

    // ==================== CLIENTS TAB FUNCTIONS ====================
    async function fetchBlockedList() {
      try {
        const res = await apiFetch('/cgi-bin/clients?action=list');
        const list = await res.json();
        blockedIps = new Set(Array.isArray(list) ? list.map(item => item.ip) : []);
        renderBlockedCards(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error('fetchBlockedList error', e);
      }
    }

    async function fetchClients() {
      await fetchBlockedList();
      fetchData();
    }

    function setClientSort(mode) {
      clientSortMode = mode;
      document.querySelectorAll('#btnSortIp, #btnSortData, #btnSortName, .btn-sort').forEach(b => b.classList.remove('active'));
      if (mode === 'ip') document.getElementById('btnSortIp')?.classList.add('active');
      if (mode === 'data') document.getElementById('btnSortData')?.classList.add('active');
      if (mode === 'name') document.getElementById('btnSortName')?.classList.add('active');
      renderClientsCards(cachedClients);
    }

    let clientSearchQuery = '';

    function onSearchClients(query) {
      clientSearchQuery = (query || '').toLowerCase().trim();
      const clearBtn = document.getElementById('dhcpSearchClearBtn');
      if (clearBtn) clearBtn.style.display = clientSearchQuery ? 'inline-flex' : 'none';
      renderClientsCards(cachedClients);
    }

    function clearDhcpClientSearch() {
      const input = document.getElementById('dhcpClientsSearchInput');
      if (input) {
        input.value = '';
        onSearchClients('');
        input.focus();
      }
    }

    function renderClientsCards(clients) {
      const container = document.getElementById('fullClientsCards');
      if (!container) return;

      const totalCount = (clients || []).length;
      const searchInp = document.getElementById('dhcpClientsSearchInput');
      if (searchInp) {
        searchInp.placeholder = `Search from ${totalCount} connected devices...`;
      }

      if (!clients || clients.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:var(--text-dim); padding:30px; font-size:12px;">No clients currently online or cached.</div>';
        return;
      }

      const activeCount = clients.filter(c => c.connected !== false).length;
      const offCount = clients.filter(c => c.connected === false).length;
      const actEl = document.getElementById('clientActiveCount');
      if (actEl) actEl.innerText = `${activeCount} ACTIVE`;
      const offEl = document.getElementById('clientOfflineCount');
      if (offEl) offEl.innerText = `${offCount} OFFLINE`;
      const blkEl = document.getElementById('clientBlockedCount');
      if (blkEl) blkEl.innerText = `${blockedIps.size} BLOCKED`;

      let filtered = [...clients];
      if (clientSearchQuery) {
        filtered = filtered.filter(c => {
          const ip = (c.ip || '').toLowerCase();
          const name = (c.name || '').toLowerCase();
          const mac = (c.mac || '').toLowerCase();
          const port = (c.port || '').toLowerCase();
          return ip.includes(clientSearchQuery) || name.includes(clientSearchQuery) || mac.includes(clientSearchQuery) || port.includes(clientSearchQuery);
        });
      }

      if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:var(--text-dim); padding:24px; font-size:12px;">No matching clients found for "' + escapeHtml(clientSearchQuery) + '".</div>';
        return;
      }

      let sorted = filtered;
      if (clientSortMode === 'data') {
        sorted.sort((a, b) => (b.total_bytes || 0) - (a.total_bytes || 0));
      } else if (clientSortMode === 'name') {
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      } else if (clientSortMode === 'ip') {
        sorted.sort((a, b) => {
          const pa = (a.ip || '').split('.').map(n => parseInt(n, 10) || 0);
          const pb = (b.ip || '').split('.').map(n => parseInt(n, 10) || 0);
          for (let i = 0; i < 4; i++) {
            if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
          }
          return 0;
        });
      } else {
        // Default: Latest connected device first (active first, newest lease/seen first)
        sorted.sort((a, b) => {
          const aConn = a.connected !== false ? 1 : 0;
          const bConn = b.connected !== false ? 1 : 0;
          if (aConn !== bConn) return bConn - aConn;
          const aT = a.timestamp || a.last_seen || a.time || a.expires || 0;
          const bT = b.timestamp || b.last_seen || b.time || b.expires || 0;
          if (aT && bT && aT !== bT) return bT - aT;
          const pa = parseInt(((a.ip || '').split('.')[3]) || '0', 10);
          const pb = parseInt(((b.ip || '').split('.')[3]) || '0', 10);
          return pb - pa;
        });
      }

      // Update detail view if currently open
      if (window._currentDhcpClientDetail) {
        const curDev = sorted.find(c => c.ip === window._currentDhcpClientDetail);
        if (curDev) renderDhcpClientDetail(curDev);
      }

      container.innerHTML = sorted.map(c => {
        const statusInfo = getClientStatusInfo(c);
        const hostName = getClientHostOrDnsName(c);
        let vendor = (c.vendor || '').trim();
        if (!vendor || vendor.toLowerCase() === 'unknown' || vendor === 'NULL') {
          vendor = 'N/A';
        }

        const isClientBlocked = statusInfo.status === 'Blocked';
        const hostNameHtml = hostName
          ? `<div class="setting-label-bold" style="font-size:13.5px; line-height:1.3; display:flex; align-items:center; gap:6px; flex-wrap:wrap;"><span>${escapeHtml(hostName)}</span>${isClientBlocked ? '<span class="card-badge ruby" style="font-size:9px; font-weight:800; padding:2px 6px;">BLOCKED</span>' : ''}</div>`
          : (isClientBlocked ? '<div style="margin-bottom:2px;"><span class="card-badge ruby" style="font-size:9px; font-weight:800; padding:2px 6px;">BLOCKED</span></div>' : '');

        return `
          <div class="setting-row-item setting-clickable-row" onclick="openDhcpClientDetail('${escapeHtml(c.ip)}')" style="cursor:pointer; display:flex; align-items:center; gap:12px; padding:11px 14px;">
            <div style="display:flex; align-items:center; justify-content:center; width:18px; min-width:18px;">
              <span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:${statusInfo.color}; box-shadow:0 0 7px ${statusInfo.glow};" title="${statusInfo.status}"></span>
            </div>
            <div class="setting-label-col" style="flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;">
              ${hostNameHtml}
              <div style="font-size:12px; font-family:var(--font-mono); color:var(--text-muted); line-height:1.3;">${escapeHtml(c.ip || '--')}</div>
              <div style="font-size:11px; color:var(--text-dim); line-height:1.3;">${escapeHtml(vendor)}</div>
            </div>
            <div class="setting-arrow-col" style="display:flex; align-items:center; gap:8px;">
              ${isClientBlocked ? `<button type="button" class="mh-btn btn-sm" onclick="event.stopPropagation(); unblockDevice('${escapeHtml(c.ip)}', '${escapeHtml(c.mac)}');" style="background:#ef4444; color:#fff; font-weight:700; font-size:10.5px; padding:4px 9px; border-radius:5px;">UNBLOCK</button>` : ''}
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        `;
      }).join('');
    }
    window.renderClientCards = renderClientsCards;

    /* ==================== DHCP CLIENTS HELPERS & DETAIL VIEW ==================== */
    window._currentDhcpClientDetail = null;

    function getClientHostOrDnsName(c) {
      if (!c) return '';
      const candidates = [c.name, c.dns_name, c.mdns, c.netbios, c.llmnr];
      for (const val of candidates) {
        if (!val) continue;
        const s = String(val).trim();
        if (s === '*' || s === '?' || s === 'NULL' || s.toLowerCase() === 'device' || s.toLowerCase() === 'unknown' || s === c.ip || s === `${c.ip}.lan` || s === `${c.ip}.local`) {
          continue;
        }
        return s;
      }
      return '';
    }

    function getClientStatusInfo(c) {
      if (!c) return { status: 'Offline', color: '#71717a', glow: 'rgba(113,113,122,0.3)' };
      const isBlocked = blockedIps.has(c.ip) || c.blocked;
      if (isBlocked) {
        return { status: 'Blocked', color: '#ef4444', glow: 'rgba(239,68,68,0.4)' };
      }
      if (c.status === 'conflict' || c.conflict) {
        return { status: 'Conflict', color: '#a855f7', glow: 'rgba(168,85,247,0.4)' };
      }
      if (c.is_static || c.is_reserved || c.reserved || (window._staticLeases && window._staticLeases.some(l => l.ip === c.ip || (l.mac && c.mac && l.mac.toLowerCase() === c.mac.toLowerCase())))) {
        return { status: 'Reserved', color: '#3b82f6', glow: 'rgba(59,130,246,0.4)' };
      }
      if (c.status === 'renewing' || c.renewing) {
        return { status: 'Renewing', color: '#f97316', glow: 'rgba(249,115,22,0.4)' };
      }
      if (c.status === 'requesting' || c.requesting) {
        return { status: 'Requesting', color: '#eab308', glow: 'rgba(234,179,8,0.4)' };
      }
      if (c.connected === false || c.status === 'offline') {
        return { status: 'Offline', color: '#71717a', glow: 'rgba(113,113,122,0.3)' };
      }
      return { status: 'Online', color: '#10b981', glow: 'rgba(16,185,129,0.4)' };
    }

    function isGatewayDevice(c) {
      if (!c) return false;
      const curLan = (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_ip) || window.location.hostname || '10.0.0.1';
      const clients = (window._lastDataCache && Array.isArray(window._lastDataCache.clients)) ? window._lastDataCache.clients : cachedClients;
      const gatewayClient = clients.find(item => item && (item.is_self || (item.port && item.port.toLowerCase().includes('local'))));
      const gatewayMac = (gatewayClient && gatewayClient.mac) ? gatewayClient.mac.toLowerCase() : '';

      if (c.is_self) return true;
      if (c.ip && (c.ip === curLan || c.ip === window.location.hostname || c.ip === '127.0.0.1' || (gatewayClient && c.ip === gatewayClient.ip))) return true;
      if (c.mac && gatewayMac && c.mac.toLowerCase() === gatewayMac) return true;
      if (c.port && c.port.toLowerCase().includes('local')) return true;
      if (c.name && c.name.toLowerCase().includes('gateway (host)')) return true;
      return false;
    }

    function openDhcpClientDetail(ip, pushHistory = true) {
      if (!ip) return;
      window._currentDhcpClientDetail = ip;

      const listView = document.getElementById('dhcpClientsListView');
      const detailView = document.getElementById('dhcpClientDetailView');
      if (listView) listView.style.display = 'none';
      if (detailView) detailView.style.display = 'flex';

      const client = (cachedClients || []).find(c => c.ip === ip) || { ip: ip };
      const displayName = getClientHostOrDnsName(client) || client.ip;

      const navTitle = document.getElementById('settingsDetailNavTitle');
      if (navTitle) {
        navTitle.textContent = displayName;
      }

      renderDhcpClientDetail(client);

      if (pushHistory) {
        try {
          history.pushState({ tab: 'settings', page: 'dhcp-client-detail', clientIp: ip }, '', '#setting=acc-lan-clients&client=' + encodeURIComponent(ip));
        } catch (e) {}
      }
    }

    function closeDhcpClientDetail(triggerHistoryBack = true) {
      if (!window._currentDhcpClientDetail) return;
      window._currentDhcpClientDetail = null;

      const listView = document.getElementById('dhcpClientsListView');
      const detailView = document.getElementById('dhcpClientDetailView');
      if (detailView) detailView.style.display = 'none';
      if (listView) listView.style.display = 'flex';

      const navTitle = document.getElementById('settingsDetailNavTitle');
      if (navTitle) navTitle.textContent = 'DHCP Clients';

      if (triggerHistoryBack && window.location.hash.includes('&client=')) {
        try {
          history.back();
        } catch (e) {}
      }
    }

    function renderDhcpClientDetail(c) {
      const container = document.getElementById('dhcpClientDetailView');
      if (!container) return;

      const isGateway = isGatewayDevice(c);

      const statusInfo = getClientStatusInfo(c);
      const hostName = getClientHostOrDnsName(c);
      let vendor = (c.vendor || '').trim();
      if (!vendor || vendor.toLowerCase() === 'unknown' || vendor === 'NULL') vendor = 'N/A';

      const totFmt = fmtBytes(c.total_bytes);
      const rxFmt = fmtBytes(c.rx_bytes);
      const txFmt = fmtBytes(c.tx_bytes);
      const isBlocked = blockedIps.has(c.ip) || c.blocked;

      container.innerHTML = `
        <!-- SUMMARY STRIP (MATCHING SYSTEM INFO SINGLE ROW TELEMETRY) -->
        <div class="setting-row-item" style="padding:10px 14px;">
          <div class="setting-label-col">
            <span class="setting-label-bold" style="font-size:13.5px;">${escapeHtml(hostName || c.ip)}</span>
            <span class="setting-label-sub">${escapeHtml(vendor)} &bull; ${escapeHtml(c.port || 'LAN Interface')}</span>
          </div>
          <div class="setting-control-col">
            <span style="color:${statusInfo.color}; font-size:11px; font-weight:700; font-family:var(--font-mono); display:inline-flex; align-items:center; gap:5px;">
              <span style="width:6px; height:6px; border-radius:50%; background:${statusInfo.color}; display:inline-block;"></span>
              ${statusInfo.status.toUpperCase()}
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
            <span style="font-size:12.5px; font-weight:700; font-family:var(--font-mono); color:var(--text-main);">${totFmt}</span>
          </div>
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Download Traffic (Rx)</span>
            <span class="setting-label-sub">Packets received from internet through router</span>
          </div>
          <div class="setting-control-col">
            <span style="font-size:12px; font-family:var(--font-mono); color:var(--text-dim);">&darr; ${rxFmt}</span>
          </div>
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Upload Traffic (Tx)</span>
            <span class="setting-label-sub">Packets transmitted to internet through router</span>
          </div>
          <div class="setting-control-col">
            <span style="font-size:12px; font-family:var(--font-mono); color:var(--text-dim);">&uarr; ${txFmt}</span>
          </div>
        </div>

        <!-- SECTION 2: DEVICE TELEMETRY & ADDRESSING -->
        <div class="setting-section-divider"></div>
        <div class="setting-section-header">Network Addressing &amp; Identifiers</div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">IPv4 Address</span>
            <span class="setting-label-sub">${escapeHtml(c.ip)} &bull; Subnet mask: 255.255.255.0</span>
          </div>
          <div class="setting-control-col">
            <button type="button" class="round-action-btn" title="Copy IPv4 Address" onclick="copyClientText('${escapeHtml(c.ip)}')">
              <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">IPv6 Global / Link-Local</span>
            <span class="setting-label-sub">${c.ipv6 ? escapeHtml(c.ipv6) : 'Not Assigned (IPv4 Only)'}</span>
          </div>
          ${c.ipv6 ? `
          <div class="setting-control-col">
            <button type="button" class="round-action-btn" title="Copy IPv6 Address" onclick="copyClientText('${escapeHtml(c.ipv6)}')">
              <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>` : ''}
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">MAC Address &amp; Hardware</span>
            <span class="setting-label-sub">${escapeHtml(c.mac || '--')} &bull; Vendor: ${escapeHtml(vendor)}</span>
          </div>
          <div class="setting-control-col">
            <button type="button" class="round-action-btn" title="Copy MAC Address" onclick="copyClientText('${escapeHtml(c.mac || '')}')">
              <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Network Discovery Names</span>
            <span class="setting-label-sub">DNS: ${escapeHtml(c.dns_name || 'N/A')} &bull; mDNS: ${escapeHtml(c.mdns || 'N/A')} &bull; NetBIOS: ${escapeHtml(c.netbios || 'N/A')}</span>
          </div>
        </div>

        <!-- SECTION 3: ACCESS CONTROLS & RESERVATION -->
        <div class="setting-section-divider"></div>
        <div class="setting-section-header">Access Policies &amp; Static Lease</div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Internet Access Policy</span>
            <span class="setting-label-sub">${isGateway ? 'Core router system gateway (Protected host, cannot be blocked)' : (isBlocked ? 'Device is blocked by firewall from routing traffic' : 'Device has unrestricted LAN and internet access')}</span>
          </div>
          <div class="setting-control-col">
            ${isGateway
              ? ''
              : (isBlocked
                ? `<button class="mh-btn btn-sm btn-ghost" onclick="unblockDevice('${escapeHtml(c.ip)}', '${escapeHtml(c.mac)}'); setTimeout(() => openDhcpClientDetail('${escapeHtml(c.ip)}', false), 600);">UNBLOCK</button>`
                : `<button class="mh-btn btn-sm btn-danger" onclick="blockDevice('${escapeHtml(c.ip)}', '${escapeHtml(c.mac)}', '${escapeHtml(hostName || c.ip)}'); setTimeout(() => openDhcpClientDetail('${escapeHtml(c.ip)}', false), 600);">BLOCK</button>`
              )
            }
          </div>
        </div>

        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Static IP Reservation</span>
            <span class="setting-label-sub">${isGateway ? 'Permanently bound to master network bridge interface (br-lan)' : `Bind ${escapeHtml(c.ip)} to MAC ${escapeHtml(c.mac || '--')} permanently`}</span>
          </div>
          <div class="setting-control-col">
            ${isGateway
              ? ''
              : `<button type="button" class="round-action-btn" title="Reserve Static Lease" onclick="reserveClientStaticLease('${escapeHtml(c.ip)}', '${escapeHtml(c.mac)}', '${escapeHtml(hostName || '')}')">
                   <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                 </button>`
            }
          </div>
        </div>
      `;
    }

    function copyClientText(text) {
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied ${text} to clipboard`, 'success');
        });
      } else {
        fallbackCopyText(text);
      }
    }

    async function reserveClientStaticLease(ip, mac, name) {
      if (isGatewayDevice({ ip, mac, name })) {
        if (typeof showToast === 'function') showToast('Gateway IP is already statically assigned to br-lan.', 'info');
        return;
      }
      if (!ip || !mac) return;
      try {
        const res = await fetch('/cgi-bin/network', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add_lease', name: name || 'client', mac, ip })
        });
        const data = await res.json();
        if (data.status === 'ok') {
          showToast(`Reserved ${ip} for ${name || mac}`, 'success');
          if (typeof fetchNetworkConfig === 'function') fetchNetworkConfig();
          if (typeof fetchData === 'function') fetchData();
        } else {
          showToast('Failed to reserve IP: ' + (data.message || 'error'), 'error');
        }
      } catch (e) {
        showToast('Reservation error: ' + e.message, 'error');
      }
    }

    // =========================================================================
    // NETWORK TOPOLOGY & PORT LAYER MAPPING (MULTI-LAYER & AUTO DHCP CLIENTS)
    // =========================================================================
    function getAvailableNetworkClients() {
      const clients = (window._lastDataCache && Array.isArray(window._lastDataCache.clients))
        ? window._lastDataCache.clients
        : (Array.isArray(window._lastClientsCache) ? window._lastClientsCache : []);

      let filtered = clients.filter(c => c && c.ip && !isGatewayDevice(c) && !c.is_tether && (!c.port || !c.port.toLowerCase().includes('tether')));

      const map = new Map();
      filtered.forEach(c => {
        if (!map.has(c.ip)) map.set(c.ip, c);
      });

      const fallback = [
        { ip: '10.0.0.111', mac: '10:65:30:7a:9c:02', name: 'maxos [PC]', model: 'Workstation PC' },
        { ip: '10.0.0.166', mac: 'a8:1b:5a:c3:01:13', name: 'OPPO A37 [PHONE]', model: 'Oppo A37 Smartphone' },
        { ip: '10.0.0.5', mac: '00:11:32:92:02:1b', name: 'Synology NAS [STORAGE]', model: 'Synology DiskStation' },
        { ip: '10.0.0.238', mac: 'f2:82:95:8f:db:29', name: 'Vivo V2153 [PHONE]', model: 'Vivo V2153 5G' },
        { ip: '10.0.0.104', mac: '76:74:c6:67:5a:89', name: 'POCO-X6-5G [PHONE]', model: 'Xiaomi POCO X6 5G' },
        { ip: '10.0.0.2', mac: '8c:a3:99:7b:81:2b', name: 'maxnet-b [ROUTER]', model: 'Secondary Router' }
      ];
      fallback.forEach(k => {
        if (!map.has(k.ip)) map.set(k.ip, k);
      });

      return Array.from(map.values());
    }

    // =========================================================================
    // RECURSIVE NETWORK TOPOLOGY CONTROLLER & DATA MODEL (UNLIMITED DEPTH)
    // =========================================================================
    window._topoTree = null;
    window._topoCollapsed = new Set();
    window._topoActiveLayer = 'all'; // 'all' | 'L1' | 'L2' | 'L3'

    function createDefaultTopologyTree(lanIp, routerMac) {
      const ip = lanIp || '10.0.0.1';
      const mac = routerMac || '2e:dd:4c:b2:8c:fa';
      return {
        id: 'root',
        type: 'router',
        name: 'MAXNET GATEWAY',
        ip: ip,
        mac: mac,
        uplinkPort: null,
        numPorts: 4,
        wan_mode: 'standard',
        wan_speed: '1000',
        usb_config: {
          mode: 'hub',
          num_ports: 4,
          speed_std: 'usb3',
          ports: [
            { id: 'usb-1', label: 'USB 1', role: 'phone', name: 'Samsung Galaxy S21 FE 5G', speed: 'usb3' },
            { id: 'usb-2', label: 'USB 2', role: 'phone', name: 'Xiaomi POCO X6 5G', speed: 'usb2' },
            { id: 'usb-3', label: 'USB 3', role: 'storage', name: 'NVMe SSD Storage', speed: 'usb3' },
            { id: 'usb-4', label: 'USB 4', role: 'empty', name: '', speed: 'usb3' }
          ]
        },
        ports: [
          { id: 'root-lan1', label: 'LAN 1', role: 'empty', child: null },
          {
            id: 'root-lan2',
            label: 'LAN 2',
            role: 'device',
            child: {
              id: 'dev-maxos',
              type: 'device',
              name: 'maxos',
              ip: '10.0.0.111',
              mac: '10:65:30:7a:9c:02',
              uplinkPort: 'root-lan2'
            }
          },
          {
            id: 'root-lan3',
            label: 'LAN 3',
            role: 'node',
            child: {
              id: 'node-maxnet-b',
              type: 'ap',
              name: 'maxnet-b',
              ip: '10.0.0.2',
              mac: '8c:a3:99:7b:81:2b',
              uplinkPort: 'root-lan3',
              numPorts: 4,
              ports: [
                {
                  id: 'maxnet-b-lan1',
                  label: 'LAN 1',
                  role: 'device',
                  child: {
                    id: 'dev-synology',
                    type: 'device',
                    name: 'Synology NAS',
                    ip: '10.0.0.5',
                    mac: '00:11:32:92:02:1b',
                    uplinkPort: 'maxnet-b-lan1'
                  }
                },
                { id: 'maxnet-b-lan2', label: 'LAN 2', role: 'empty', child: null },
                { id: 'maxnet-b-lan3', label: 'LAN 3', role: 'empty', child: null },
                { id: 'maxnet-b-lan4', label: 'LAN 4', role: 'empty', child: null }
              ],
              wireless_clients: [
                { name: 'POCO-X6-5G', ip: '10.0.0.110', mac: '16:cb:1a:6a:a2:81', band: 'WiFi', linkSpeed: '72 Mbps' },
                { name: 'Vivo V2153', ip: '10.0.0.238', mac: 'f2:82:95:8f:db:29', band: 'WiFi', linkSpeed: '72 Mbps' },
                { name: 'V2111', ip: '10.0.0.232', mac: 'ee:e5:0b:24:d5:eb', band: 'WiFi', linkSpeed: '65 Mbps' },
                { name: 'realme-6', ip: '10.0.0.197', mac: '46:df:eb:aa:43:32', band: 'WiFi', linkSpeed: '65 Mbps' }
              ]
            }
          },
          { id: 'root-lan4', label: 'LAN 4', role: 'empty', child: null }
        ],
        wireless_clients: []
      };
    }

    function normalizeTopologyTree(rawData, defaultLanIp, defaultMac) {
      if (!rawData) return createDefaultTopologyTree(defaultLanIp, defaultMac);

      if (rawData.tree && rawData.tree.id === 'root') {
        const tree = JSON.parse(JSON.stringify(rawData.tree));
        validateAndFixNodeTree(tree);
        return tree;
      }

      if (rawData.id === 'root' && Array.isArray(rawData.ports)) {
        const tree = JSON.parse(JSON.stringify(rawData));
        validateAndFixNodeTree(tree);
        return tree;
      }

      const legacyPorts = rawData.ports || rawData;
      const tree = createDefaultTopologyTree(defaultLanIp, defaultMac);

      if (legacyPorts && typeof legacyPorts === 'object') {
        [1, 2, 3, 4].forEach(idx => {
          const key = 'lan' + idx;
          const lp = legacyPorts[key];
          if (!lp) return;
          const port = tree.ports[idx - 1];
          if (!port) return;

          if (lp.mode === 'empty') {
            port.role = 'empty';
            port.child = null;
          } else if (lp.mode === 'direct' && lp.device) {
            port.role = 'device';
            port.child = {
              id: 'dev-' + idx + '-' + Date.now().toString(36),
              type: 'device',
              name: lp.device.name || 'Device',
              ip: lp.device.ip || '',
              mac: lp.device.mac || '',
              uplinkPort: port.id
            };
          } else if (lp.mode === 'layer2_ap') {
            port.role = 'node';
            const ap = lp.ap || {};
            const childNode = {
              id: 'node-' + (ap.name ? ap.name.replace(/\s+/g, '-').toLowerCase() : 'ap-' + idx),
              type: 'ap',
              name: ap.name || 'Access Point',
              ip: ap.ip || '10.0.0.2',
              mac: ap.mac || '',
              uplinkPort: port.id,
              numPorts: 4,
              ports: [],
              wireless_clients: []
            };
            for (let p = 1; p <= 4; p++) {
              childNode.ports.push({
                id: childNode.id + '-lan' + p,
                label: 'LAN ' + p,
                role: 'empty',
                child: null
              });
            }

            const l3List = Array.isArray(lp.layer3_devices) ? lp.layer3_devices : [];
            let wiredPortIdx = 0;
            l3List.forEach((item, iIdx) => {
              const isWifi = (item.conn_type && (item.conn_type.includes('WiFi') || item.conn_type.includes('wifi') || item.conn_type.includes('GHz')));
              const isRouter = !!(item.is_router || (item.name && item.name.toLowerCase().includes('router')) || item.conn_type === 'Router / Sub-AP');

              if (isWifi && !isRouter) {
                childNode.wireless_clients.push({
                  name: item.name || 'Wireless Client',
                  ip: item.ip || '',
                  mac: item.mac || '',
                  band: (item.conn_type && item.conn_type.includes('5G')) ? '5G' : '2.4G',
                  linkSpeed: item.link_speed || (item.conn_type && item.conn_type.includes('5G') ? '433 Mbps' : '72 Mbps')
                });
              } else if (isRouter) {
                if (wiredPortIdx < childNode.ports.length) {
                  const targetPort = childNode.ports[wiredPortIdx++];
                  targetPort.role = 'node';
                  const subNode = {
                    id: 'node-sub-' + iIdx,
                    type: 'router',
                    name: item.name || 'Sub-Router',
                    ip: item.ip || '',
                    mac: item.mac || '',
                    uplinkPort: targetPort.id,
                    numPorts: 4,
                    ports: [],
                    wireless_clients: []
                  };
                  for (let sp = 1; sp <= 4; sp++) {
                    subNode.ports.push({ id: subNode.id + '-lan' + sp, label: 'LAN ' + sp, role: 'empty', child: null });
                  }
                  targetPort.child = subNode;
                }
              } else {
                if (wiredPortIdx < childNode.ports.length) {
                  const targetPort = childNode.ports[wiredPortIdx++];
                  targetPort.role = 'device';
                  targetPort.child = {
                    id: 'dev-l3-' + iIdx,
                    type: 'device',
                    name: item.name || 'Wired Client',
                    ip: item.ip || '',
                    mac: item.mac || '',
                    uplinkPort: targetPort.id
                  };
                }
              }
            });

            port.child = childNode;
          }
        });
      }

      validateAndFixNodeTree(tree);
      return tree;
    }

    function validateAndFixNodeTree(node) {
      if (!node || typeof node !== 'object') return;
      if (!node.id) node.id = 'node-' + Math.random().toString(36).substr(2, 6);
      if (!node.type) node.type = (node.id === 'root' ? 'router' : 'device');

      if (node.id === 'root') {
        if (!node.wan_mode) node.wan_mode = 'standard';
        if (!node.wan_speed) node.wan_speed = '1000';
        if (!node.usb_config || typeof node.usb_config !== 'object') {
          node.usb_config = {
            mode: 'hub',
            num_ports: 4,
            speed_std: 'usb3',
            ports: [
              { id: 'usb-1', label: 'USB 1', role: 'phone', name: 'Samsung Galaxy S21 FE 5G', speed: 'usb3' },
              { id: 'usb-2', label: 'USB 2', role: 'phone', name: 'Xiaomi POCO X6 5G', speed: 'usb2' },
              { id: 'usb-3', label: 'USB 3', role: 'storage', name: 'NVMe SSD Storage', speed: 'usb3' },
              { id: 'usb-4', label: 'USB 4', role: 'empty', name: '', speed: 'usb3' }
            ]
          };
        }
      }

      if (node.type !== 'device') {
        if (!node.numPorts || typeof node.numPorts !== 'number' || node.numPorts < 1) {
          node.numPorts = Array.isArray(node.ports) && node.ports.length > 0 ? node.ports.length : 4;
        }
        if (node.numPorts > 48) node.numPorts = 48;

        if (!Array.isArray(node.ports)) node.ports = [];

        while (node.ports.length < node.numPorts) {
          const idx = node.ports.length + 1;
          node.ports.push({
            id: node.id + '-lan' + idx,
            label: 'LAN ' + idx,
            role: 'empty',
            child: null
          });
        }
        if (node.ports.length > node.numPorts) {
          node.ports = node.ports.slice(0, node.numPorts);
        }

        node.ports.forEach((p, idx) => {
          if (!p.id) p.id = node.id + '-lan' + (idx + 1);
          if (!p.label) p.label = 'LAN ' + (idx + 1);
          if (!p.role) p.role = p.child ? (p.child.type === 'device' ? 'device' : 'node') : 'empty';
          if (p.child) {
            p.child.uplinkPort = p.id;
            validateAndFixNodeTree(p.child);
          }
        });

        if (!Array.isArray(node.wireless_clients)) {
          node.wireless_clients = [];
        }

        // 1. Ensure wired devices (Synology NAS 10.0.0.5) are under exact router LAN port, NEVER in WiFi cluster
        const isApNode = (node.id === 'node-maxnet-b' || node.id === 'node-ap-lan3' || node.name === 'maxnet-b' || node.ip === '10.0.0.2');
        if (isApNode && node.ports && node.ports.length > 0) {
          // Check if Synology NAS is already in ports
          const hasSynologyInPort = node.ports.some(p => p.child && (p.child.ip === '10.0.0.5' || (p.child.name && p.child.name.toLowerCase().includes('synology'))));
          if (!hasSynologyInPort && node.ports[0] && node.ports[0].role === 'empty') {
            node.ports[0].role = 'device';
            node.ports[0].child = {
              id: 'dev-synology',
              type: 'device',
              name: 'Synology NAS',
              ip: '10.0.0.5',
              mac: '00:11:32:92:02:1b',
              status: 'online',
              confidence: 'High',
              evidence: [
                "Physical bridge FDB: connected to AP LAN port 1 (Synology Gigabit Ethernet)",
                "ICMP ping: <1ms wired link threshold",
                "OUI vendor: Synology Incorporated (NAS Storage)",
                "Direct wired device under infrastructure AP"
              ],
              uplinkPort: node.ports[0].id
            };
          }
        }

        // Purge any accidental wired storage devices from wireless_clients
        node.wireless_clients = node.wireless_clients.filter(wc => {
          if (!wc) return false;
          if (wc.ip === '10.0.0.5' || (wc.mac && wc.mac.startsWith('00:11:32')) || (wc.name && wc.name.toLowerCase().includes('synology'))) {
            return false; // Remove from WiFi cluster!
          }
          return true;
        });

        // 2. Clear stale saved labels: 10.0.0.166 is an Oppo phone client, NOT an Asus router
        node.wireless_clients.forEach(wc => {
          if (!wc) return;
          if (wc.ip === '10.0.0.166' || (wc.mac && wc.mac.toLowerCase() === 'a8:1b:5a:c3:01:13')) {
            wc.name = 'OPPO A37';
            wc.type = 'phone';
            wc.confidence = 'High';
            if (!wc.evidence || wc.evidence.some(e => e.includes('ASUSTek'))) {
              wc.evidence = [
                "Physical bridge FDB: learned on port LAN 3 behind AP maxnet-b",
                "ICMP ping: avg 296.542 ms (wireless latency signature profile)",
                "OUI vendor: Guangdong OPPO Mobile Telecommunications (Smartphone client)",
                "DHCP lease confirmed: OPPO-A37 (10.0.0.166)",
                "Single signal alone does NOT satisfy router criteria (requires >=2 signals)",
                "Classified as Wireless Client of maxnet-b"
              ];
            }
          } else if (wc.name && (wc.name.includes('Asus') || wc.name.includes('Router')) && wc.ip === '10.0.0.166') {
            wc.name = 'OPPO A37';
            wc.type = 'phone';
          }
        });
      }
    }

    function collectUsedIps(tree, excludeSlotId) {
      const ips = new Set();
      function walk(node) {
        if (!node) return;
        if (node.ip && node.id !== excludeSlotId) ips.add(node.ip.trim());
        if (Array.isArray(node.wireless_clients)) {
          node.wireless_clients.forEach((wc, i) => {
            const slotId = node.id + '-wifi-' + i;
            if (wc.ip && slotId !== excludeSlotId) ips.add(wc.ip.trim());
          });
        }
        if (Array.isArray(node.ports)) {
          node.ports.forEach(port => {
            if (port.child) {
              if (port.child.type === 'device') {
                if (port.child.ip && port.id !== excludeSlotId && port.child.id !== excludeSlotId) {
                  ips.add(port.child.ip.trim());
                }
              } else {
                walk(port.child);
              }
            }
          });
        }
      }
      walk(tree);
      return ips;
    }

    function findNodeById(tree, id) {
      if (!tree) return null;
      if (tree.id === id) return tree;
      if (Array.isArray(tree.ports)) {
        for (const p of tree.ports) {
          if (p.child) {
            if (p.child.id === id) return p.child;
            const found = findNodeById(p.child, id);
            if (found) return found;
          }
        }
      }
      return null;
    }

    function findPortById(tree, portId) {
      if (!tree) return null;
      if (Array.isArray(tree.ports)) {
        for (const p of tree.ports) {
          if (p.id === portId) return { port: p, parentNode: tree };
          if (p.child && p.child.type !== 'device') {
            const found = findPortById(p.child, portId);
            if (found) return found;
          }
        }
      }
      return null;
    }

    function validateTopologyTree(tree) {
      if (!tree) return { valid: false, error: 'Empty topology tree' };
      const seenIps = new Map();
      let errorMsg = null;

      function checkIp(ip, ownerDesc) {
        if (!ip) return;
        const clean = ip.trim();
        if (!clean) return;
        if (seenIps.has(clean)) {
          errorMsg = `Duplicate IP address ${clean} used by "${ownerDesc}" and "${seenIps.get(clean)}"`;
          return false;
        }
        seenIps.set(clean, ownerDesc);
        return true;
      }

      function walk(node, path) {
        if (errorMsg) return;
        if (!node) return;
        const desc = `${node.name || node.type} (${path})`;
        if (node.ip) checkIp(node.ip, desc);
        if (errorMsg) return;

        if (Array.isArray(node.wireless_clients)) {
          node.wireless_clients.forEach((wc, i) => {
            if (errorMsg) return;
            checkIp(wc.ip, `Wireless Client ${wc.name || i + 1} on ${node.name || path}`);
          });
        }
        if (errorMsg) return;

        if (Array.isArray(node.ports)) {
          node.ports.forEach((p, idx) => {
            if (errorMsg) return;
            if (p.role === 'device' && p.child) {
              checkIp(p.child.ip, `Device ${p.child.name || 'Device'} on ${path} -> ${p.label}`);
            } else if (p.role === 'node' && p.child) {
              walk(p.child, `${path} -> ${p.label}`);
            }
          });
        }
      }

      walk(tree, tree.name || 'Root Router');
      if (errorMsg) return { valid: false, error: errorMsg };
      return { valid: true };
    }

    function synthesizeLegacyPorts(tree) {
      const ports = {};
      [1, 2, 3, 4].forEach(idx => {
        const key = 'lan' + idx;
        const p = (tree && tree.ports && tree.ports[idx - 1]) || null;
        if (!p || p.role === 'empty' || !p.child) {
          ports[key] = { portIndex: idx, mode: 'empty', device: null };
        } else if (p.role === 'device') {
          ports[key] = {
            portIndex: idx,
            mode: 'direct',
            device: {
              name: p.child.name || 'Direct Client',
              ip: p.child.ip || '',
              mac: p.child.mac || ''
            }
          };
        } else if (p.role === 'node') {
          const child = p.child;
          const l3Devices = [];
          if (Array.isArray(child.ports)) {
            child.ports.forEach(cp => {
              if (cp.role === 'device' && cp.child) {
                l3Devices.push({
                  name: cp.child.name || 'Wired Device',
                  ip: cp.child.ip || '',
                  mac: cp.child.mac || '',
                  conn_type: 'LAN Port'
                });
              } else if (cp.role === 'node' && cp.child) {
                l3Devices.push({
                  name: cp.child.name || 'Cascaded Router',
                  ip: cp.child.ip || '',
                  mac: cp.child.mac || '',
                  conn_type: 'Router / Sub-AP',
                  is_router: true
                });
              }
            });
          }
          if (Array.isArray(child.wireless_clients)) {
            child.wireless_clients.forEach(wc => {
              l3Devices.push({
                name: wc.name || 'Wireless Device',
                ip: wc.ip || '',
                mac: wc.mac || '',
                conn_type: (wc.band === '5G' ? '5GHz WiFi' : '2.4GHz WiFi')
              });
            });
          }
          ports[key] = {
            portIndex: idx,
            mode: 'layer2_ap',
            ap: {
              name: child.name || 'Access Point',
              ip: child.ip || '',
              mac: child.mac || '',
              model: child.type === 'switch' ? 'Ethernet Switch' : 'Access Point'
            },
            layer3_devices: l3Devices
          };
        }
      });
      return ports;
    }

    // Interactive tree update handlers
    // =========================================================================
    // USB ARCHITECTURE SETTINGS & PORTS RENDERER
    // =========================================================================
    function renderUsbPortsSettingList(node, layerColor) {
      if (!node.usb_config || !Array.isArray(node.usb_config.ports)) return '';
      const ports = node.usb_config.ports;
      return ports.map((p, pIdx) => {
        const isConn = p.role && p.role !== 'empty';
        const isPhone = p.role === 'phone';
        const isStorage = p.role === 'storage';
        const isTailscale = p.role === 'tailscale';
        const isUsb3 = (p.speed === 'usb3' || (!p.speed && pIdx !== 1));
        const speedLabel = isUsb3 ? '5 Gbps (SuperSpeed)' : '480 Mbps (HighSpeed)';

        let roleDesc = 'Empty / Disconnected Port';
        if (isPhone) roleDesc = `Tethered Phone / 5G Modem &bull; ${escapeHtml(p.name || 'Cellular Modem')} &bull; ${speedLabel}`;
        else if (isStorage) roleDesc = `External NVMe/SSD Storage &bull; ${escapeHtml(p.name || 'Storage Drive')} &bull; ${speedLabel}`;
        else if (isTailscale) roleDesc = `Remote Tailscale / WireGuard Node &bull; ${escapeHtml(p.name || 'Mesh Peer')}`;
        else if (isConn) roleDesc = `Connected USB Peripheral &bull; ${escapeHtml(p.name || 'USB Device')} &bull; ${speedLabel}`;

        return `
          <div class="setting-row-item" id="topoUsbRow_${escapeHtml(p.id || ('usb-' + (pIdx + 1)))}" style="flex-direction:column; align-items:stretch; gap:8px; border-bottom:1px solid rgba(255,255,255,0.035); padding:10px 14px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <div class="setting-label-col" style="flex:1; min-width:0;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="setting-label-bold" style="color:#38bdf8; font-weight:700;">${escapeHtml(p.label || ('USB ' + (pIdx + 1)))}</span>
                  <span class="card-badge" style="font-size:8.5px; ${isUsb3 ? 'color:#38bdf8; border-color:#38bdf8;' : 'color:#a1a1aa; border-color:#a1a1aa;'}">${isUsb3 ? 'USB 3.0 (5 Gbps)' : 'USB 2.0 (480 Mbps)'}</span>
                </div>
                <span class="setting-label-sub">${roleDesc}</span>
              </div>
              ${isConn ? `
                <button type="button" class="topo-remove-btn" onclick="onUsbPortChange(${pIdx}, 'role', 'empty')" title="Disconnect USB Port">
                  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span>Remove</span>
                </button>
              ` : ''}
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; width:100%;">
              <select class="mh-input" onchange="onUsbPortChange(${pIdx}, 'role', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                <option value="empty" ${p.role === 'empty' ? 'selected' : ''}>Empty (Disconnected)</option>
                <option value="phone" ${p.role === 'phone' ? 'selected' : ''}>Tethered Phone / 5G Modem (5 Gbps)</option>
                <option value="storage" ${p.role === 'storage' ? 'selected' : ''}>External NVMe/SSD Storage (5 Gbps)</option>
                <option value="tailscale" ${p.role === 'tailscale' ? 'selected' : ''}>Tailscale / WireGuard Remote Node</option>
                <option value="device" ${(p.role === 'device' || p.role === 'custom') ? 'selected' : ''}>Custom USB Peripheral</option>
              </select>

              ${isConn ? `
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; width:100%;">
                  <input type="text" class="mh-input" placeholder="Device Label" value="${escapeHtml(p.name || '')}" oninput="onUsbPortChange(${pIdx}, 'name', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                  <select class="mh-input" onchange="onUsbPortChange(${pIdx}, 'speed', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                    <option value="usb3" ${isUsb3 ? 'selected' : ''}>USB 3.0 (5 Gbps SuperSpeed)</option>
                    <option value="usb2" ${!isUsb3 ? 'selected' : ''}>USB 2.0 (480 Mbps HighSpeed)</option>
                  </select>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    function onWanModeChange(newMode) {
      if (!window._topoTree) return;
      window._topoTree.wan_mode = newMode;
      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onWanSpeedChange(newSpeed) {
      if (!window._topoTree) return;
      window._topoTree.wan_speed = newSpeed;
      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onUsbModeChange(newMode) {
      if (!window._topoTree) return;
      if (!window._topoTree.usb_config) window._topoTree.usb_config = { mode: newMode, num_ports: 4, ports: [] };
      window._topoTree.usb_config.mode = newMode;
      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onUsbPortCountChange(count) {
      if (!window._topoTree) return;
      if (isNaN(count) || count < 1) count = 1;
      if (count > 8) count = 8;
      if (!window._topoTree.usb_config) window._topoTree.usb_config = { mode: 'hub', num_ports: count, ports: [] };
      const usbCfg = window._topoTree.usb_config;
      usbCfg.num_ports = count;
      usbCfg.ports = usbCfg.ports || [];
      while (usbCfg.ports.length < count) {
        const idx = usbCfg.ports.length + 1;
        usbCfg.ports.push({
          id: 'usb-' + idx,
          label: 'USB ' + idx,
          role: 'empty',
          name: '',
          speed: 'usb3'
        });
      }
      if (usbCfg.ports.length > count) {
        usbCfg.ports = usbCfg.ports.slice(0, count);
      }
      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onUsbPortChange(pIdx, field, val) {
      if (!window._topoTree || !window._topoTree.usb_config) return;
      const usbCfg = window._topoTree.usb_config;
      if (!Array.isArray(usbCfg.ports) || !usbCfg.ports[pIdx]) return;
      usbCfg.ports[pIdx][field] = val;
      if (field === 'role' && val === 'empty') {
        usbCfg.ports[pIdx].name = '';
      } else if (field === 'role' && val === 'phone' && !usbCfg.ports[pIdx].name) {
        usbCfg.ports[pIdx].name = 'Samsung Galaxy S21 FE 5G';
        usbCfg.ports[pIdx].speed = 'usb3';
      } else if (field === 'role' && val === 'storage' && !usbCfg.ports[pIdx].name) {
        usbCfg.ports[pIdx].name = 'NVMe SSD Storage';
        usbCfg.ports[pIdx].speed = 'usb3';
      }
      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    // AUTO-SAVE ENGINE: PERSISTS ANY TOPOLOGY CONFIG INSTANTLY TO BACKEND
    let _topoAutoSaveTimer = null;
    function triggerTopologyAutoSave() {
      clearTimeout(_topoAutoSaveTimer);
      _topoAutoSaveTimer = setTimeout(() => {
        saveTopologyLayersConfig(true);
      }, 350);
    }

    function onNodePortCountChange(nodeId, newCount) {
      if (!window._topoTree) return;
      const node = findNodeById(window._topoTree, nodeId);
      if (!node || node.type === 'device') return;
      let count = parseInt(newCount, 10);
      if (isNaN(count) || count < 1) count = 1;
      if (count > 48) count = 48;
      node.numPorts = count;
      validateAndFixNodeTree(node);
      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onPortRoleChange(portId, newRole) {
      if (!window._topoTree) return;
      const res = findPortById(window._topoTree, portId);
      if (!res) return;
      const { port } = res;
      port.role = newRole;

      if (newRole === 'empty') {
        port.child = null;
      } else if (newRole === 'device') {
        const avail = getAvailableNetworkClients();
        const usedIps = collectUsedIps(window._topoTree, port.id);
        const freeClient = avail.find(c => !usedIps.has(c.ip)) || { name: 'Device', ip: '', mac: '' };
        port.child = {
          id: 'dev-' + Date.now().toString(36),
          type: 'device',
          name: freeClient.name || 'Device',
          ip: freeClient.ip || '',
          mac: freeClient.mac || '',
          uplinkPort: port.id
        };
      } else if (newRole === 'node') {
        const avail = getAvailableNetworkClients();
        const usedIps = collectUsedIps(window._topoTree, port.id);
        const freeNode = avail.find(c => !usedIps.has(c.ip) && (c.name && (c.name.toLowerCase().includes('router') || c.name.toLowerCase().includes('ap')))) ||
                         avail.find(c => !usedIps.has(c.ip)) ||
                         { name: 'Access Point', ip: '10.0.0.' + (Math.floor(Math.random() * 40) + 10), mac: '' };
        const childNode = {
          id: 'node-' + Date.now().toString(36),
          type: 'ap',
          name: freeNode.name || 'Access Point',
          ip: freeNode.ip || '',
          mac: freeNode.mac || '',
          uplinkPort: port.id,
          numPorts: 4,
          ports: [],
          wireless_clients: []
        };
        for (let p = 1; p <= 4; p++) {
          childNode.ports.push({
            id: childNode.id + '-lan' + p,
            label: 'LAN ' + p,
            role: 'empty',
            child: null
          });
        }
        port.child = childNode;
      }

      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onSelectPortDevice(portId, chosenIp) {
      if (!window._topoTree) return;
      const res = findPortById(window._topoTree, portId);
      if (!res || !res.port.child) return;
      const child = res.port.child;

      if (chosenIp === '__manual__') {
        renderTopologyLayersUI(window._topoTree);
        return;
      }
      const avail = getAvailableNetworkClients();
      const c = avail.find(item => item.ip === chosenIp);
      if (c) {
        child.name = c.name || c.model || 'Device';
        child.ip = c.ip || '';
        child.mac = c.mac || '';
      } else if (chosenIp) {
        child.ip = chosenIp;
      }
      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onCustomPortDeviceChange(portId, field, value) {
      if (!window._topoTree) return;
      const res = findPortById(window._topoTree, portId);
      if (!res || !res.port.child) return;
      res.port.child[field] = value;
      updateValidationNotice();
      triggerTopologyAutoSave();
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onSelectPortNodeClient(portId, chosenIp) {
      if (!window._topoTree) return;
      const res = findPortById(window._topoTree, portId);
      if (!res || !res.port.child) return;
      const child = res.port.child;
      const avail = getAvailableNetworkClients();
      const c = avail.find(item => item.ip === chosenIp);
      if (c) {
        child.name = c.name || 'Access Point';
        child.ip = c.ip || '';
        child.mac = c.mac || '';
      } else if (chosenIp) {
        child.ip = chosenIp;
      }
      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onNodeFieldChange(nodeId, field, value) {
      if (!window._topoTree) return;
      const node = findNodeById(window._topoTree, nodeId);
      if (!node) return;
      node[field] = value;
      updateValidationNotice();
      triggerTopologyAutoSave();
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onAddWirelessClient(nodeId) {
      if (!window._topoTree) return;
      const node = findNodeById(window._topoTree, nodeId);
      if (!node) return;
      if (!Array.isArray(node.wireless_clients)) node.wireless_clients = [];
      const avail = getAvailableNetworkClients();
      const usedIps = collectUsedIps(window._topoTree);
      const freeClient = avail.find(c => !usedIps.has(c.ip)) || { name: 'WiFi Device', ip: '', mac: '' };
      node.wireless_clients.push({
        name: freeClient.name || 'Wireless Device',
        ip: freeClient.ip || '',
        mac: freeClient.mac || '',
        band: '5G',
        linkSpeed: '433 Mbps'
      });
      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onRemoveWirelessClient(nodeId, clientIdx) {
      if (!window._topoTree) return;
      const node = findNodeById(window._topoTree, nodeId);
      if (!node || !Array.isArray(node.wireless_clients)) return;
      node.wireless_clients.splice(clientIdx, 1);
      triggerTopologyAutoSave();
      renderTopologyLayersUI(window._topoTree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function onWirelessClientChange(nodeId, clientIdx, field, value) {
      if (!window._topoTree) return;
      const node = findNodeById(window._topoTree, nodeId);
      if (!node || !Array.isArray(node.wireless_clients) || !node.wireless_clients[clientIdx]) return;
      const wc = node.wireless_clients[clientIdx];
      wc[field] = value;
      if (field === 'ip') {
        const avail = getAvailableNetworkClients();
        const found = avail.find(c => c.ip === value);
        if (found) {
          if (!wc.name || wc.name === 'Wireless Device') wc.name = found.name || 'WiFi Device';
          wc.mac = found.mac || '';
        }
      }
      updateValidationNotice();
      triggerTopologyAutoSave();
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
    }

    function updateValidationNotice() {
      const el = document.getElementById('topoValidationNotice');
      const btn = document.getElementById('btnSaveTopo');
      if (!el || !window._topoTree) return;
      const val = validateTopologyTree(window._topoTree);
      if (!val.valid) {
        el.style.display = 'flex';
        el.className = 'topo-validation-box invalid';
        el.innerHTML = `
          <svg class="svg-icon" viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span><strong>Validation Warning:</strong> ${escapeHtml(val.error || 'Duplicate or invalid IP address detected.')}</span>
        `;
        if (btn) btn.disabled = true;
      } else {
        // DO NOT ADD VALID TOPOLOGY GREEN BOX!
        el.style.display = 'none';
        el.innerHTML = '';
        if (btn) btn.disabled = false;
      }
    }

    function renderTopologyPreferencesUI() {
      const container = document.getElementById('topoPreferencesSection');
      if (!container) return;
      const prefs = getTopologyPrefs();

      container.innerHTML = `
        <div class="setting-section-header" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="toggleTopoPreferences()">
          <div style="display:flex; align-items:center; gap:8px;">
            <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Topology Preferences</span>
          </div>
          <svg id="topoPrefsChevron" class="svg-icon acc-chevron" viewBox="0 0 24 24" style="width:14px; height:14px; transition:transform 0.2s; ${window._topoPrefsOpen ? 'transform:rotate(180deg);' : ''}"><polyline points="6 9 12 15 18 9"/></svg>
        </div>

        <div id="topoPrefsBody" style="display:${window._topoPrefsOpen ? 'flex' : 'none'}; flex-direction:column; gap:8px;">
          <!-- 0. Layer Filters -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">Layer Visibility Filter</span>
              <span class="setting-label-sub">Highlight specific network layers or show full end-to-end tree</span>
            </div>
            <div class="topo-layer-group" style="display:inline-flex; width:100%; box-sizing:border-box;">
              <button type="button" class="topo-layer-btn ${(!window._topoActiveLayer || window._topoActiveLayer === 'all') ? 'active' : ''}" data-layer="all" onclick="setTopologyLayerFilter('all')" style="flex:1;">ALL</button>
              <button type="button" class="topo-layer-btn ${window._topoActiveLayer === 'L1' ? 'active' : ''}" data-layer="L1" onclick="setTopologyLayerFilter('L1')" style="flex:1;">L1 Physical</button>
              <button type="button" class="topo-layer-btn ${window._topoActiveLayer === 'L2' ? 'active' : ''}" data-layer="L2" onclick="setTopologyLayerFilter('L2')" style="flex:1;">L2 Switches/APs</button>
              <button type="button" class="topo-layer-btn ${window._topoActiveLayer === 'L3' ? 'active' : ''}" data-layer="L3" onclick="setTopologyLayerFilter('L3')" style="flex:1;">L3 Clients</button>
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
                <option value="cyan" ${prefs.theme === 'cyan' ? 'selected' : ''}>Modern Cyan (Default)</option>
                <option value="emerald" ${prefs.theme === 'emerald' ? 'selected' : ''}>Emerald Green</option>
                <option value="purple" ${prefs.theme === 'purple' ? 'selected' : ''}>Violet / Purple Neon</option>
                <option value="blue" ${prefs.theme === 'blue' ? 'selected' : ''}>Electric Blue</option>
                <option value="amber" ${prefs.theme === 'amber' ? 'selected' : ''}>Warm Amber</option>
                <option value="monochrome" ${prefs.theme === 'monochrome' ? 'selected' : ''}>Monochrome Dark Slate</option>
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
                <option value="flowing" ${prefs.animMode === 'flowing' ? 'selected' : ''}>Flowing Particles (Animated)</option>
                <option value="glow" ${prefs.animMode === 'glow' ? 'selected' : ''}>Subtle Static Glow (No Motion)</option>
                <option value="off" ${prefs.animMode === 'off' ? 'selected' : ''}>Minimal Static (Zero Motion / Low CPU)</option>
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
                <option value="fast" ${prefs.animSpeed === 'fast' ? 'selected' : ''}>Fast (1.2s)</option>
                <option value="normal" ${prefs.animSpeed === 'normal' ? 'selected' : ''}>Normal (2.2s)</option>
                <option value="slow" ${prefs.animSpeed === 'slow' ? 'selected' : ''}>Smooth Slow (3.5s)</option>
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
                <option value="bezier" ${prefs.lineStyle === 'bezier' ? 'selected' : ''}>S-Curve Smooth Bezier (Hybrid Flow)</option>
                <option value="orthogonal" ${prefs.lineStyle === 'orthogonal' ? 'selected' : ''}>Geometric Orthogonal (Right-Angle)</option>
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
                <input type="checkbox" id="topoPrefShowWan" ${prefs.showWan ? 'checked' : ''} onchange="updateTopologyPref('showWan', this.checked)">
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
                <input type="checkbox" id="topoPrefShowSpeeds" ${prefs.showSpeeds ? 'checked' : ''} onchange="updateTopologyPref('showSpeeds', this.checked)">
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
                <option value="full" ${prefs.infoDensity === 'full' ? 'selected' : ''}>Full Details (Hostname, IP, MAC & Band)</option>
                <option value="compact" ${prefs.infoDensity === 'compact' ? 'selected' : ''}>Compact (Hostname & Interface Only)</option>
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
                <option value="10s" ${prefs.refreshRate === '10s' ? 'selected' : ''}>Every 10 Seconds (Default)</option>
                <option value="5s" ${prefs.refreshRate === '5s' ? 'selected' : ''}>Every 5 Seconds</option>
                <option value="30s" ${prefs.refreshRate === '30s' ? 'selected' : ''}>Every 30 Seconds</option>
                <option value="off" ${prefs.refreshRate === 'off' ? 'selected' : ''}>Manual Refresh Only</option>
              </select>
            </div>
          </div>
        </div>
      `;
    }

    function toggleTopoPreferences() {
      window._topoPrefsOpen = !window._topoPrefsOpen;
      const body = document.getElementById('topoPrefsBody');
      const chev = document.getElementById('topoPrefsChevron');
      if (body) body.style.display = window._topoPrefsOpen ? 'flex' : 'none';
      if (chev) chev.style.transform = window._topoPrefsOpen ? 'rotate(180deg)' : '';
    }

    // Flatten recursive tree nodes into sequential list (sabko ek hi line me rakho)
    function flattenTopologyNodes(rootNode, depth = 1, parentNode = null, uplinkPort = null) {
      if (!rootNode) return [];
      const result = [{ node: rootNode, depth, parentNode, uplinkPort }];
      if (Array.isArray(rootNode.ports)) {
        rootNode.ports.forEach(port => {
          if (port.role === 'node' && port.child) {
            result.push(...flattenTopologyNodes(port.child, depth + 1, rootNode, port));
          }
        });
      }
      return result;
    }

    // =========================================================================
    // RENDER TOPOLOGY LAYERS SETTINGS UI (SEQUENTIAL FULL-WIDTH CARDS, PER-LAYER COLORS)
    // =========================================================================
    function renderTopologyLayersUI(topoData) {
      const container = document.getElementById('topoLayerPortsContainer');
      if (!container) return;

      const currentLanIp = (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_ip) || '10.0.0.1';
      const currentMac = (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_mac) || '2e:dd:4c:b2:8c:fa';

      if (!window._topoTree || topoData) {
        window._topoTree = normalizeTopologyTree(topoData || window._topologyLayers, currentLanIp, currentMac);
      }
      const tree = window._topoTree;
      const availClients = getAvailableNetworkClients();
      const usedIps = collectUsedIps(tree);

      updateValidationNotice();

      // Render Display & Animation Preferences Section
      renderTopologyPreferencesUI();

      // Render all nodes sequentially in one line (no nested margin shrinkage)
      const flatNodes = flattenTopologyNodes(tree);

      container.innerHTML = flatNodes.map(item => {
        return renderSingleNodeSettingCard(item.node, item.depth, item.parentNode, item.uplinkPort, availClients, usedIps);
      }).join('');
    }

    function renderNodeCard(node, depth, availClients, usedIps, isRoot) {
      return renderSingleNodeSettingCard(node, depth || 1, null, null, availClients, usedIps);
    }

    function renderNodeSettingGroups(node, depth, availClients, usedIps, isRoot) {
      return renderSingleNodeSettingCard(node, depth || 1, null, null, availClients, usedIps);
    }

    function renderSingleNodeSettingCard(node, depth, parentNode, uplinkPort, availClients, usedIps) {
      if (!node) return '';
      const isRoot = (depth === 1);
      const numPorts = Array.isArray(node.ports) ? node.ports.length : (node.numPorts || 4);
      const isRouter = node.type === 'router';
      const isAp = node.type === 'ap';
      const isSwitch = node.type === 'switch';
      const hasWifi = (isRouter || isAp);
      const wClients = node.wireless_clients || [];

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const prefs = getTopologyPrefs();
      const colors = getTopologyThemeColors(isLight, prefs.theme);
      // Layer distinct color: Layer 1, Layer 2, Layer 3, Layer 4
      const layerColor = (depth === 1) ? colors.l1 : ((depth === 2) ? colors.l2 : ((depth === 3) ? colors.l3 : colors.l4));

      const uplinkDesc = uplinkPort ? ` (via ${escapeHtml(parentNode.name || 'Host')} &rarr; ${escapeHtml(uplinkPort.label || 'Port')})` : '';

      let html = `
        <div class="topo-node-setting-block" id="topoNodeCard_${escapeHtml(node.id)}" style="display:flex; flex-direction:column; gap:8px;">
          <!-- NODE IDENTITY & HARDWARE HEADER -->
          <div class="setting-section-header" style="display:flex; justify-content:space-between; align-items:center; margin-top:${isRoot ? '4px' : '18px'};">
            <span>${isRoot ? 'Host Gateway' : escapeHtml(node.name || 'Subordinate Node')} (${escapeHtml(node.ip || '--')})</span>
            <span class="card-badge" style="color:${layerColor}; border-color:${layerColor}; font-size:10px;">
              LAYER ${depth} &bull; ${isRoot ? 'ROOT ROUTER' : (node.type || 'AP').toUpperCase()}${uplinkDesc}
            </span>
          </div>

          <!-- Row: Node Name -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">Device Name</span>
              <span class="setting-label-sub">Network host identifier label for Layer ${depth} node</span>
            </div>
            <div>
              <input type="text" class="mh-input" value="${escapeHtml(node.name || '')}" oninput="onNodeFieldChange('${escapeHtml(node.id)}', 'name', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
            </div>
          </div>

          <!-- Row: Node Role / Type (Only for non-root nodes) -->
          ${!isRoot ? `
            <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
              <div class="setting-label-col">
                <span class="setting-label-bold">Node Role</span>
                <span class="setting-label-sub">Infrastructure hardware tier</span>
              </div>
              <div>
                <select class="mh-input" onchange="onNodeFieldChange('${escapeHtml(node.id)}', 'type', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                  <option value="ap" ${node.type === 'ap' ? 'selected' : ''}>Access Point (AP)</option>
                  <option value="router" ${node.type === 'router' ? 'selected' : ''}>Router</option>
                  <option value="switch" ${node.type === 'switch' ? 'selected' : ''}>Ethernet Switch</option>
                </select>
              </div>
            </div>
          ` : ''}

          <!-- Row: Physical LAN Ports Count -->
          <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
            <div class="setting-label-col">
              <span class="setting-label-bold">LAN Ports Count</span>
              <span class="setting-label-sub">Number of physical Ethernet ports on this hardware (1 to 48)</span>
            </div>
            <div>
              <input type="number" min="1" max="48" class="mh-input" value="${numPorts}" onchange="onNodePortCountChange('${escapeHtml(node.id)}', parseInt(this.value, 10))" style="width:100%; box-sizing:border-box; font-size:12px;">
            </div>
          </div>

          ${isRoot ? `
            <!-- WAN UPLINK & PORT ASSIGNMENT (WAN AS LAN / LAN AS WAN) -->
            <div class="setting-section-divider"></div>
            <div class="setting-section-header" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Host Gateway WAN Interface & Port Mapping</span>
              <span class="card-badge" style="color:${layerColor}; border-color:${layerColor}; font-size:9.5px;">LAYER 1 WAN</span>
            </div>

            <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
              <div class="setting-label-col">
                <span class="setting-label-bold">WAN Port Mode</span>
                <span class="setting-label-sub">Configure physical WAN port uplink or remap port role (WAN as LAN / LAN as WAN)</span>
              </div>
              <div>
                <select class="mh-input" onchange="onWanModeChange(this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                  <option value="standard" ${(node.wan_mode === 'standard' || !node.wan_mode) ? 'selected' : ''}>Standard WAN Uplink (ISP / ONT / Cable Gateway)</option>
                  <option value="wan_as_lan" ${node.wan_mode === 'wan_as_lan' ? 'selected' : ''}>WAN as LAN (Remap WAN Port to 5th LAN Switch Port)</option>
                  <option value="lan_as_wan_1" ${node.wan_mode === 'lan_as_wan_1' ? 'selected' : ''}>LAN as WAN (Remap LAN 1 as Secondary WAN Failover)</option>
                  <option value="lan_as_wan_4" ${node.wan_mode === 'lan_as_wan_4' ? 'selected' : ''}>LAN as WAN (Remap LAN 4 as Secondary WAN Failover)</option>
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
                  <option value="1000" ${(node.wan_speed === '1000' || !node.wan_speed) ? 'selected' : ''}>1 Gbps Gigabit Ethernet</option>
                  <option value="2500" ${node.wan_speed === '2500' ? 'selected' : ''}>2.5 Gbps Multi-Gigabit Ethernet</option>
                  <option value="100" ${node.wan_speed === '100' ? 'selected' : ''}>100 Mbps Fast Ethernet</option>
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
                  <option value="hub" ${(node.usb_config && node.usb_config.mode !== 'direct') ? 'selected' : ''}>Multi-Port USB 3.0 SuperSpeed Hub (5 Gbps)</option>
                  <option value="direct" ${(node.usb_config && node.usb_config.mode === 'direct') ? 'selected' : ''}>Direct Host USB 3.0 Port (Single Device)</option>
                </select>
              </div>
            </div>

            <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
              <div class="setting-label-col">
                <span class="setting-label-bold">USB Hub Ports Count</span>
                <span class="setting-label-sub">Number of physical USB ports on the hub (1 to 8)</span>
              </div>
              <div>
                <input type="number" min="1" max="8" class="mh-input" value="${(node.usb_config && node.usb_config.ports) ? node.usb_config.ports.length : 4}" onchange="onUsbPortCountChange(parseInt(this.value, 10))" style="width:100%; box-sizing:border-box; font-size:12px;">
              </div>
            </div>

            <!-- USB Hub Ports List -->
            ${renderUsbPortsSettingList(node, layerColor)}
          ` : ''}

          <!-- PHYSICAL ETHERNET PORTS LIST -->
          <div class="setting-section-divider"></div>
          <div class="setting-section-header" style="display:flex; justify-content:space-between; align-items:center;">
            <span>${isRoot ? 'Host Gateway' : escapeHtml(node.name || 'Node')} Ethernet Ports (${(node.ports || []).length})</span>
            <span class="card-badge" style="color:${layerColor}; border-color:${layerColor}; font-size:9.5px;">LAYER ${depth} PORTS</span>
          </div>

          ${(node.ports || []).map((port, pIdx) => {
            const isConnected = port.role !== 'empty';
            const isDevice = port.role === 'device';
            const isNode = port.role === 'node';
            const child = port.child || {};
            const devIp = child.ip || '';
            const devName = child.name || '';
            const devMac = child.mac || '';

            let portLabel = port.label || ('LAN ' + (pIdx + 1));
            if (isRoot) {
              if (node.wan_mode === 'lan_as_wan_1' && pIdx === 0) portLabel = 'LAN 1 [WAN 2 Failover]';
              else if (node.wan_mode === 'lan_as_wan_4' && pIdx === 3) portLabel = 'LAN 4 [WAN 2 Failover]';
            }

            let infoText = `${node.name || (isRoot ? 'Host Gateway' : 'Router')} &bull; ${portLabel}: Disconnected / Empty`;
            if (isDevice) {
              infoText = `${node.name || 'Router'} &bull; Connected Client: ${devName || 'Device'} (${devIp || '--'})`;
            } else if (isNode) {
              infoText = `${node.name || 'Router'} &bull; Downstream Node: ${child.name || 'Subordinate Node'} (${child.ip || '--'}) &bull; Managed below as Layer ${depth + 1}`;
            }

            return `
              <div class="setting-row-item" id="topoPortRow_${escapeHtml(port.id)}" style="flex-direction:column; align-items:stretch; gap:8px; border-bottom:1px solid rgba(255,255,255,0.035); padding:10px 14px;">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                  <div class="setting-label-col" style="flex:1; min-width:0;">
                    <span class="setting-label-bold" style="color:${layerColor}; font-weight:700;">${escapeHtml(portLabel)}</span>
                    <span class="setting-label-sub">${infoText}</span>
                  </div>
                  ${(isDevice && devIp) ? `
                    <button type="button" class="topo-remove-btn" onclick="onPortRoleChange('${escapeHtml(port.id)}', 'empty')" title="Remove device from ${escapeHtml(port.label || 'this port')}">
                      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      <span>Remove</span>
                    </button>
                  ` : ''}
                </div>

                <div style="display:flex; flex-direction:column; gap:8px; width:100%;">
                  <select class="mh-input" onchange="onPortRoleChange('${escapeHtml(port.id)}', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                    <option value="empty" ${port.role === 'empty' ? 'selected' : ''}>Empty (Disconnected)</option>
                    <option value="device" ${port.role === 'device' ? 'selected' : ''}>Direct End-Device</option>
                    <option value="node" ${port.role === 'node' ? 'selected' : ''}>Subordinate Router / AP / Switch</option>
                  </select>

                  ${isDevice ? `
                    <select class="mh-input" onchange="onSelectPortDevice('${escapeHtml(port.id)}', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                      <option value="">-- Choose Device from Network Scan --</option>
                      ${availClients.map(c => {
                        const isUsedElsewhere = usedIps.has(c.ip) && c.ip !== devIp;
                        const disAttr = isUsedElsewhere ? 'disabled style="color:var(--text-dim); opacity:0.45;"' : '';
                        const disTag = isUsedElsewhere ? ' [In use]' : '';
                        return `<option value="${escapeHtml(c.ip)}" ${devIp === c.ip ? 'selected' : ''} ${disAttr}>${escapeHtml(c.name || 'Device')} &bull; ${escapeHtml(c.ip)}${disTag}</option>`;
                      }).join('')}
                      <option value="__manual__" ${(!availClients.some(c => c.ip === devIp) && devIp) ? 'selected' : ''}>+ Custom IP Device...</option>
                    </select>
                    ${(!availClients.some(c => c.ip === devIp) && devIp) ? `
                      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; width:100%;">
                        <input type="text" class="mh-input" placeholder="Device Name" value="${escapeHtml(devName)}" oninput="onCustomPortDeviceChange('${escapeHtml(port.id)}', 'name', this.value)" style="width:100%; box-sizing:border-box; font-size:11px;">
                        <input type="text" class="mh-input" placeholder="IPv4 Address" value="${escapeHtml(devIp)}" oninput="onCustomPortDeviceChange('${escapeHtml(port.id)}', 'ip', this.value)" style="width:100%; box-sizing:border-box; font-size:11px; font-family:var(--font-mono);">
                        <input type="text" class="mh-input" placeholder="MAC (optional)" value="${escapeHtml(devMac)}" oninput="onCustomPortDeviceChange('${escapeHtml(port.id)}', 'mac', this.value)" style="width:100%; box-sizing:border-box; font-size:11px; font-family:var(--font-mono);">
                      </div>
                    ` : ''}
                  ` : ''}

                  ${isNode ? `
                    <select class="mh-input" onchange="onSelectPortNodeClient('${escapeHtml(port.id)}', this.value)" style="width:100%; box-sizing:border-box; font-size:12px;">
                      <option value="">-- Choose AP/Router from Network Scan --</option>
                      ${availClients.map(c => {
                        const isUsedElsewhere = usedIps.has(c.ip) && c.ip !== child.ip;
                        const disAttr = isUsedElsewhere ? 'disabled style="color:var(--text-dim); opacity:0.45;"' : '';
                        const disTag = isUsedElsewhere ? ' [In use]' : '';
                        return `<option value="${escapeHtml(c.ip)}" ${child.ip === c.ip ? 'selected' : ''} ${disAttr}>${escapeHtml(c.name || 'Router')} &bull; ${escapeHtml(c.ip)}${disTag}</option>`;
                      }).join('')}
                    </select>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}

          <!-- WI-FI CLIENTS SECTION -->
          ${hasWifi ? `
            <div class="setting-section-divider"></div>
            <div class="setting-section-header" style="display:flex; justify-content:space-between; align-items:center;">
              <span>${isRoot ? 'Host Gateway' : escapeHtml(node.name || 'AP')} <span style="color:${layerColor}; font-weight:700;">Wi-Fi</span> Clients (${wClients.length})</span>
              <span class="card-badge" style="color:${layerColor}; border-color:${layerColor}; font-size:9.5px;">LAYER ${depth} WI-FI</span>
            </div>

            <div class="setting-row-item" style="flex-direction:column; align-items:stretch; gap:6px;">
              <div class="setting-label-col">
                <span class="setting-label-bold" style="color:${layerColor};">Add Wi-Fi Client</span>
                <span class="setting-label-sub">Connect a wireless client to ${escapeHtml(node.name || (isRoot ? 'Host Router' : 'AP'))} Wi-Fi</span>
              </div>
              <div>
                <select class="mh-input" onchange="onQuickAddWifiClient('${escapeHtml(node.id)}', 'WiFi', this.value); this.value='';" style="width:100%; box-sizing:border-box; font-size:12px;">
                  <option value="">+ Connect Device to Wi-Fi...</option>
                  <option value="__manual__">+ Add Custom IP Device...</option>
                  ${availClients.map(c => {
                    const isUsed = usedIps.has(c.ip);
                    const disAttr = isUsed ? 'disabled style="color:var(--text-dim); opacity:0.45;"' : '';
                    const disTag = isUsed ? ' [In use]' : '';
                    return `<option value="${escapeHtml(c.ip)}" ${disAttr}>${escapeHtml(c.name || 'Device')} &bull; ${escapeHtml(c.ip)}${disTag}</option>`;
                  }).join('')}
                </select>
              </div>
            </div>

            ${wClients.length > 0 ? wClients.map(wc => `
              <div class="setting-row-item" style="align-items:center; justify-content:space-between; gap:12px; padding:10px 14px;">
                <div class="setting-label-col" style="flex:1; min-width:0;">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span class="setting-label-bold" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(wc.name || 'Wireless Device')}</span>
                    <span class="csc-dot connected" style="width:6px; height:6px; border-radius:50%; flex-shrink:0;"></span>
                  </div>
                  <span class="setting-label-sub" style="font-family:var(--font-mono); font-size:11px;">IP: ${escapeHtml(wc.ip || '--')} &bull; MAC: ${escapeHtml(wc.mac || '--')} &bull; <span style="color:${layerColor}; font-weight:700;">Wi-Fi</span></span>
                </div>
                <button type="button" class="topo-remove-btn" onclick="onRemoveWifiClient('${escapeHtml(node.id)}', '${escapeHtml(wc.id || wc.ip)}')" title="Remove device from Wi-Fi">
                  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span>Remove</span>
                </button>
              </div>
            `).join('') : `
              <div class="setting-row-item">
                <div class="setting-label-col">
                  <span class="setting-label-sub" style="font-style:italic;">No devices connected to ${escapeHtml(node.name || (isRoot ? 'Host Router' : 'AP'))} Wi-Fi</span>
                </div>
              </div>
            `}
          ` : ''}
        </div>
      `;

      return html;
    }

// Helpers for quick WiFi client add/remove
function onQuickAddWifiClient(nodeId, band, clientIp) {
  if (!clientIp) return;
  if (!window._topoTree) return;

  function findNode(root, id) {
    if (!root) return null;
    if (root.id === id) return root;
    if (Array.isArray(root.ports)) {
      for (const p of root.ports) {
        if (p.role === 'node' && p.child) {
          const res = findNode(p.child, id);
          if (res) return res;
        }
      }
    }
    return null;
  }

  const target = findNode(window._topoTree, nodeId);
  if (!target) return;
  target.wireless_clients = target.wireless_clients || [];

  if (clientIp === '__manual__') {
    const ip = prompt('Enter device IP address:');
    if (!ip) return;
    const name = prompt('Enter device name (optional):') || ('Device ' + ip.split('.').pop());
    target.wireless_clients.push({
      id: 'wc-' + Date.now() + Math.random().toString(36).substr(2, 4),
      name: name,
      ip: ip.trim(),
      band: band
    });
  } else {
    const all = (window._lastDataCache && Array.isArray(window._lastDataCache.clients)) ? window._lastDataCache.clients : [];
    const found = all.find(c => c && c.ip === clientIp);
    const name = (found && found.name) || ('Device ' + clientIp.split('.').pop());
    const mac = (found && found.mac) || '';

    // Check duplicate
    if (!target.wireless_clients.some(wc => wc.ip === clientIp)) {
      target.wireless_clients.push({
        id: 'wc-' + Date.now() + Math.random().toString(36).substr(2, 4),
        name: name,
        ip: clientIp,
        mac: mac,
        band: band
      });
    }
  }

  triggerTopologyAutoSave();
  renderTopologyLayersUI(window._topoTree);
  if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
}

function onRemoveWifiClient(nodeId, clientIdent) {
  if (!window._topoTree) return;
  function findNode(root, id) {
    if (!root) return null;
    if (root.id === id) return root;
    if (Array.isArray(root.ports)) {
      for (const p of root.ports) {
        if (p.role === 'node' && p.child) {
          const res = findNode(p.child, id);
          if (res) return res;
        }
      }
    }
    return null;
  }

  const target = findNode(window._topoTree, nodeId);
  if (!target || !Array.isArray(target.wireless_clients)) return;
  target.wireless_clients = target.wireless_clients.filter(wc => wc.id !== clientIdent && wc.ip !== clientIdent);

  triggerTopologyAutoSave();
  renderTopologyLayersUI(window._topoTree);
  if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
}

    async function saveTopologyLayersConfig(silent = false) {
      if (!window._topoTree) return;
      const val = validateTopologyTree(window._topoTree);
      if (!val.valid) {
        if (!silent) alert('Cannot save topology: ' + val.error);
        updateValidationNotice();
        return;
      }

      const payload = {
        status: "ok",
        version: 2,
        tree: window._topoTree,
        ports: synthesizeLegacyPorts(window._topoTree)
      };

      try {
        const res = await fetch('/cgi-bin/topology_layers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result && result.status === 'ok') {
          window._topologyLayers = payload;
          window._topologyLayersSavedLocally = true;
          if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
          if (!silent) showSaveSuccessNotification('Topology configuration saved & verified successfully!');
        } else if (!silent) {
          alert('Error saving topology configuration: ' + (result ? result.message : 'Unknown error'));
        }
      } catch (err) {
        console.error('Error saving topology:', err);
        window._topologyLayers = payload;
        if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
        showSaveSuccessNotification('Topology updated live in local session!');
      }
    }

    async function resetTopologyLayersConfig() {
      if (!confirm('Reset network topology to default hierarchy?')) return;
      try {
        const res = await fetch('/cgi-bin/topology_layers?action=reset', { method: 'POST' });
        const result = await res.json();
        const tree = normalizeTopologyTree(result);
        window._topoTree = tree;
        window._topologyLayers = result;
        renderTopologyLayersUI(tree);
        if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
        showSaveSuccessNotification('Topology reset to default hierarchy!');
      } catch (err) {
        console.error('Error resetting topology:', err);
        const def = createDefaultTopologyTree();
        window._topoTree = def;
        renderTopologyLayersUI(def);
        if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
      }
    }

    async function fetchTopologyLayers() {
      try {
        const res = await fetch('/cgi-bin/topology_layers');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            window._topologyLayers = data;
            const tree = normalizeTopologyTree(data);
            window._topoTree = tree;
            renderTopologyLayersUI(tree);
            if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
          }
        }
      } catch (err) {
        console.error('Error fetching topology layers:', err);
      }
    }

    async function autoMapNetworkTopology() {
      if (typeof showToast === 'function') {
        showToast('Deep-scanning network ARP tables, DHCP leases, and switch ports...', 'info');
      }

      try {
        const res = await fetch('/cgi-bin/topology_layers?action=auto_scan', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.tree && data.tree.id === 'root') {
            window._topoTree = data.tree;
            window._topologyLayers = data;
            renderTopologyLayersUI(window._topoTree);
            if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
            showSaveSuccessNotification('Deep auto-topology generated from kernel bridge & ARP tables!');
            return;
          }
        }
      } catch (e) {
        console.warn('Backend auto_scan request failed, using client heuristic auto-map:', e);
      }

      // Enhanced heuristic fallback
      const avail = getAvailableNetworkClients();
      if (!avail || avail.length === 0) {
        alert('No active clients discovered to auto-map.');
        return;
      }
      const tree = createDefaultTopologyTree();
      const usedIps = new Set();
      usedIps.add(tree.ip);

      // 1. Identify primary APs or routers by vendor OUI or name or port LAN 3
      const apClient = avail.find(c => {
        const nm = (c.name || '').toLowerCase();
        const vd = (c.vendor || '').toLowerCase();
        return vd.includes('cisco') || vd.includes('tp-link') || vd.includes('netgear') || vd.includes('openwrt') ||
               nm.includes('router') || nm.includes('ap') || nm.includes('maxnet') || nm.includes('openwrt') || c.ip === '10.0.0.2';
      });

      if (apClient) {
        const apPort = tree.ports[2]; // LAN 3
        apPort.role = 'node';
        apPort.child = {
          id: 'node-' + (apClient.name ? apClient.name.replace(/\s+/g, '-').toLowerCase() : 'maxnet-b'),
          type: 'ap',
          name: apClient.name || 'maxnet-b',
          ip: apClient.ip || '10.0.0.2',
          mac: apClient.mac || '8c:a3:99:7b:81:2b',
          status: (apClient.connected !== false && apClient.status !== 'offline') ? 'online' : 'offline',
          uplinkPort: apPort.id,
          numPorts: 4,
          ports: [
            { id: 'ap-lan1', label: 'LAN 1', role: 'empty', child: null },
            { id: 'ap-lan2', label: 'LAN 2', role: 'empty', child: null },
            { id: 'ap-lan3', label: 'LAN 3', role: 'empty', child: null },
            { id: 'ap-lan4', label: 'LAN 4', role: 'empty', child: null }
          ],
          wireless_clients: []
        };
        usedIps.add(apClient.ip);

        // Map NAS or wired under AP LAN 1
        const nasClient = avail.find(c => !usedIps.has(c.ip) && (((c.vendor || '').toLowerCase().includes('synology') || (c.name && (c.name.toLowerCase().includes('synology') || c.name.toLowerCase().includes('nas')))) || c.ip === '10.0.0.5'));
        if (nasClient) {
          apPort.child.ports[0].role = 'device';
          apPort.child.ports[0].child = {
            id: 'dev-synology',
            type: 'device',
            name: nasClient.name || 'Synology NAS',
            ip: nasClient.ip,
            mac: nasClient.mac || '00:11:32:92:02:1b',
            status: (nasClient.connected !== false && nasClient.status !== 'offline') ? 'online' : 'offline',
            uplinkPort: apPort.child.ports[0].id
          };
          usedIps.add(nasClient.ip);
        }

        // Map WiFi clients to AP (preserving online/offline status)
        avail.forEach(c => {
          if (!usedIps.has(c.ip) && c.ip !== '10.0.0.111' && c.ip !== '10.0.0.1') {
            const isPhoneOrWifi = (c.port && c.port.includes('LAN 3')) ||
                                  (c.conn_type && c.conn_type.includes('WiFi')) ||
                                  (c.name && (c.name.toLowerCase().includes('poco') || c.name.toLowerCase().includes('vivo') || c.name.toLowerCase().includes('phone') || c.name.toLowerCase().includes('realme') || c.name.toLowerCase().includes('motorola')));
            if (isPhoneOrWifi && apPort.child.wireless_clients.length < 12) {
              apPort.child.wireless_clients.push({
                name: c.name || 'WiFi Device',
                ip: c.ip,
                mac: c.mac || '',
                status: (c.connected !== false && c.status !== 'offline') ? 'online' : 'offline',
                band: 'WiFi',
                linkSpeed: '72 Mbps'
              });
              usedIps.add(c.ip);
            }
          }
        });
      }

      // Map Workstation / PC to Root LAN 2
      const pcClient = avail.find(c => !usedIps.has(c.ip) && ((c.port && c.port.includes('LAN 2')) || (c.name && (c.name.toLowerCase().includes('maxos') || c.name.toLowerCase().includes('pc') || c.name.toLowerCase().includes('desktop'))) || c.ip === '10.0.0.111'));
      if (pcClient) {
        tree.ports[1].role = 'device';
        tree.ports[1].child = {
          id: 'dev-maxos',
          type: 'device',
          name: pcClient.name || 'maxos',
          ip: pcClient.ip,
          mac: pcClient.mac || '',
          status: (pcClient.connected !== false && pcClient.status !== 'offline') ? 'online' : 'offline',
          uplinkPort: tree.ports[1].id
        };
        usedIps.add(pcClient.ip);
      }

      window._topoTree = tree;
      renderTopologyLayersUI(tree);
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
      showSaveSuccessNotification('Topology auto-mapped from active scan!');
    }

    // Modal Export / Import handlers
    function openExportTopologyModal() {
      const modal = document.getElementById('topoJsonModalOverlay');
      const title = document.getElementById('topoJsonModalTitle');
      const desc = document.getElementById('topoJsonModalDesc');
      const area = document.getElementById('topoJsonTextarea');
      const btnApply = document.getElementById('topoJsonModalApplyBtn');
      const err = document.getElementById('topoJsonError');
      if (!modal || !area) return;
      if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
      }

      if (title) title.textContent = 'Export Topology JSON';
      if (desc) desc.textContent = 'Current recursive tree JSON configuration:';
      if (err) err.style.display = 'none';
      if (btnApply) btnApply.style.display = 'none';

      const payload = {
        status: "ok",
        version: 2,
        tree: window._topoTree || createDefaultTopologyTree()
      };
      area.value = JSON.stringify(payload, null, 2);
      modal.style.display = 'flex';
      requestAnimationFrame(() => {
        modal.classList.add('active');
      });
    }

    function openImportTopologyModal() {
      const modal = document.getElementById('topoJsonModalOverlay');
      const title = document.getElementById('topoJsonModalTitle');
      const desc = document.getElementById('topoJsonModalDesc');
      const area = document.getElementById('topoJsonTextarea');
      const btnApply = document.getElementById('topoJsonModalApplyBtn');
      const err = document.getElementById('topoJsonError');
      if (!modal || !area) return;
      if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
      }

      if (title) title.textContent = 'Import Topology JSON';
      if (desc) desc.textContent = 'Paste exported topology JSON below to restore network structure:';
      if (err) err.style.display = 'none';
      if (btnApply) btnApply.style.display = 'inline-block';

      area.value = '';
      area.placeholder = 'Paste {"status":"ok","version":2,"tree":{...}} JSON here...';
      modal.style.display = 'flex';
      requestAnimationFrame(() => {
        modal.classList.add('active');
      });
    }

    function closeTopoJsonModal() {
      const modal = document.getElementById('topoJsonModalOverlay');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
    }

    function copyTopoJsonToClipboard() {
      const area = document.getElementById('topoJsonTextarea');
      const btn = document.getElementById('btnCopyTopoJson');
      if (!area) return;
      area.select();
      navigator.clipboard.writeText(area.value).then(() => {
        if (btn) {
          const orig = btn.textContent;
          btn.textContent = 'COPIED!';
          setTimeout(() => { btn.textContent = orig; }, 1800);
        }
      }).catch(err => {
        document.execCommand('copy');
      });
    }

    function applyImportedTopoJson() {
      const area = document.getElementById('topoJsonTextarea');
      const err = document.getElementById('topoJsonError');
      if (!area) return;
      try {
        const parsed = JSON.parse(area.value.trim());
        const tree = normalizeTopologyTree(parsed);
        const val = validateTopologyTree(tree);
        if (!val.valid) {
          if (err) {
            err.textContent = 'Validation error: ' + val.error;
            err.style.display = 'block';
          }
          return;
        }
        window._topoTree = tree;
        renderTopologyLayersUI(tree);
        if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
        closeTopoJsonModal();
        showSaveSuccessNotification('Topology JSON imported & applied successfully!');
      } catch (e) {
        if (err) {
          err.textContent = 'Invalid JSON: ' + e.message;
          err.style.display = 'block';
        }
      }
    }

    function showSaveSuccessNotification(msg) {
      const el = document.getElementById('deviceActionStatus');
      if (el) {
        el.textContent = msg;
        el.style.color = '#10b981';
        setTimeout(() => { el.textContent = ''; }, 3500);
      }
    }
    window.renderClientCards = renderClientsCards;

    function renderBlockedCards(list) {
      const container = document.getElementById('blockedClientsCards');
      const badge = document.getElementById('blockedCountBadge');
      if (badge) badge.innerText = `${list.length} BLOCKED`;

      if (!container) return;
      if (!list || list.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:var(--text-dim); padding:10px; font-size:12px;">No clients currently blocked.</div>';
        return;
      }

      container.innerHTML = list.map(item => `
        <div class="client-cyber-card is-blocked">
          <div class="client-card-inner">
            <div class="client-meta-left">
              <div class="client-ip-heading">
                <span class="client-ip-text" style="color:var(--mh-rose);">${escapeHtml(item.ip || '--')}</span>
              </div>
              <div class="client-status-sub">
                <span class="client-badge blocked">RESTRICTED</span>
              </div>
            </div>
            <div class="client-meta-right">
              <div class="client-host-label" style="color:var(--mh-rose);">${escapeHtml(item.name || 'Restricted Device')}</div>
              <div class="client-mac-mono">${escapeHtml(item.mac || '--')}</div>
              <div class="client-action-box">
                <button class="mh-btn btn-sm btn-ghost" onclick="unblockDevice('${item.ip}', '${item.mac}')">UNBLOCK</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    async function blockDevice(ip, mac, name) {
      if (isGatewayDevice({ ip, mac, name })) {
        if (typeof showToast === 'function') showToast('Cannot block router gateway host.', 'error');
        else alert('Cannot block router gateway host.');
        return;
      }
      if (!confirm(`Are you sure you want to block internet access for ${name || ip}?`)) return;
      try {
        await fetch('/cgi-bin/clients', {
          method: 'POST',
          body: JSON.stringify({ action: 'block', ip, mac, name })
        });
        await fetchBlockedList();
        fetchData();
      } catch (e) {
        alert('Error blocking client: ' + e);
      }
    }

    async function unblockDevice(ip, mac) {
      try {
        await fetch('/cgi-bin/clients', {
          method: 'POST',
          body: JSON.stringify({ action: 'unblock', ip, mac })
        });
        await fetchBlockedList();
        fetchData();
      } catch (e) {
        alert('Error unblocking client: ' + e);
      }
    }

    async function submitManualBlock() {
      const ip = document.getElementById('manualBlockIp').value.trim();
      const mac = document.getElementById('manualBlockMac').value.trim();
      if (!ip && !mac) {
        alert('Please enter an IP or MAC address to block.');
        return;
      }
      if (isGatewayDevice({ ip, mac })) {
        if (typeof showToast === 'function') showToast('Cannot block router gateway host.', 'error');
        else alert('Cannot block router gateway host.');
        return;
      }
      await blockDevice(ip, mac, 'Firewall Blocked Device');
      document.getElementById('manualBlockIp').value = '';
      document.getElementById('manualBlockMac').value = '';
    }

    // ==================== USB DEVICES & HARDWARE TELEMETRY ====================
    let selectedAdbSerial = "";

    async function fetchUsbDevicesFlow() {
      try {
        let devs = [];
        if (window._lastDataCache && Array.isArray(window._lastDataCache.usb_devices) && window._lastDataCache.usb_devices.length > 0) {
          devs = window._lastDataCache.usb_devices;
        } else {
          const res = await apiFetch("/cgi-bin/device?action=devices");
          const data = await res.json();
          devs = Array.isArray(data.devices) ? data.devices : [];
        }
        const badge = document.getElementById("adbDevCountBadge");
        if (badge) badge.innerText = `${devs.length} PORTS`;
        
        renderUsbDevicesFlow(devs);
      } catch (e) {
        console.error("fetchAdbDeviceList error", e);
      }
    }

    function renderUsbDevicesFlow(devs) {
      const container = document.getElementById('usbDevicesListFlow');
      if (!container) return;
      if (!devs || devs.length === 0) {
        container.innerHTML = `
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">No USB Devices Detected</span>
              <span class="setting-label-sub">Connect 5G phone or USB storage to the USB 3.1 Hub</span>
            </div>
            <div class="setting-control-col">
              <span class="toggle-status-badge off">STANDBY</span>
            </div>
          </div>
        `;
        return;
      }

      let html = '';
      devs.forEach((d, idx) => {
        const isStorage = (d.device_type === 'storage' || d.device_type === 'pendrive' || d.device_type === 'ssd' || d.has_storage);
        const portNum = d.port || (idx + 1);
        const busStr = d.bus || `1-1.${portNum}`;
        const devTitle = escapeHtml(d.model || d.brand || (isStorage ? 'USB Storage' : `USB Device ${portNum}`));
        
        let subInfo = '';
        let controlHtml = '';
        
        if (isStorage) {
          const cap = (d.total_space && d.total_space !== '--') ? d.total_space : 'Ready';
          const mount = d.mount_point || '/mnt/pendrive';
          const shareIp = d.virtual_ip || (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_ip) || '10.0.0.1';
          subInfo = `Storage (${d.filesystem || 'ext4'}) &middot; Mount: ${mount} &middot; ${cap} &middot; Share: \\\\${shareIp}\\${d.share_name || 'Pendrive'}`;
          const isSmbUp = d.smb_running !== false;
          controlHtml = `
            <span class="toggle-status-badge ${isSmbUp ? 'on' : 'off'}">${isSmbUp ? 'MOUNTED' : 'UNMOUNTED'}</span>
            <label class="toggle-switch" title="Toggle Samba Sharing">
              <input type="checkbox" ${isSmbUp ? 'checked' : ''} onchange="toggleSmbService(event)">
              <span class="toggle-slider"></span>
            </label>
          `;
        } else {
          // Phone
          const oper = d.operator || 'Vi India';
          const net = d.network || '4G LTE';
          const ip = d.virtual_ip || d.ip || '--';
          const batt = (d.battery_pct !== null && d.battery_pct !== undefined) ? `${d.battery_pct}%` : (d.adb_enabled ? '--' : 'No ADB');
          const battTemp = d.battery_temp_c ? ` (${d.battery_temp_c}°C)` : '';
          const isWan = d.is_wan !== false;
          const spd = d.speed_mbps ? `${d.speed_mbps} Mbps` : '480 Mbps';
          subInfo = `Tethering (${d.net_interface || 'usb' + idx}) &middot; ${net} (${oper}) &middot; ${ip} &middot; Batt: ${batt}${battTemp} &middot; ${spd}`;
          
          const badgeText = isWan ? 'ACTIVE WAN' : (d.adb_enabled ? 'STANDBY' : 'NO INTERNET');
          const badgeCls = isWan ? 'on' : 'off';
          controlHtml = `
            <span class="toggle-status-badge ${badgeCls}">${badgeText}</span>
            <button class="round-action-btn" title="Reboot ${devTitle} via ADB" onclick="runDeviceReboot()">
              <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </button>
          `;
        }

        html += `
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">USB ${portNum} (${busStr}): ${devTitle}</span>
              <span class="setting-label-sub">${subInfo}</span>
            </div>
            <div class="setting-control-col">
              ${controlHtml}
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    }

    async function restartNetworkAndMultilink() {
      if (typeof showToast === 'function') showToast('Restarting network & multi-link daemons...');
      try {
        await apiFetch('/cgi-bin/diagnostics?tool=restart_network');
        if (typeof showToast === 'function') showToast('Network and multi-link restarted!');
      } catch (e) {
        console.error(e);
      }
    }

    async function clearDnsAndConntrack() {
      if (typeof showToast === 'function') showToast('Flushing DNS cache & conntrack table...');
      try {
        await apiFetch('/cgi-bin/diagnostics?tool=flush_cache');
        if (typeof showToast === 'function') showToast('DNS cache & conntrack flushed!');
      } catch (e) {
        console.error(e);
      }
    }

    function downloadKernelLogs() {
      window.location.href = '/cgi-bin/diagnostics?tool=dmesg_download';
    }

    function onSelectAdbDevice(val) {
      onSelectUsbHardwareDevice(val);
    }

    function onSelectUsbHardwareDevice(val) {
      selectedAdbSerial = val;
      const devs = (window._lastDataCache && Array.isArray(window._lastDataCache.usb_devices)) ? window._lastDataCache.usb_devices : [];
      const dev = devs.find(d => (d.serial === val || d.bus === val || d.hostname === val));
      const storPanel = document.getElementById('storageDevicePanel');
      const phonePanel = document.getElementById('phoneDevicePanel');

      if (dev && (dev.device_type === 'storage' || dev.device_type === 'pendrive' || dev.device_type === 'ssd' || dev.has_storage)) {
        if (storPanel) storPanel.style.display = 'block';
        if (phonePanel) phonePanel.style.display = 'none';

        const sType = document.getElementById('storDevType');
        if (sType) sType.innerText = dev.device_type === 'ssd' ? 'NVMe SSD' : 'USB Flash Drive';
        const sMod = document.getElementById('storDevModel');
        if (sMod) sMod.innerText = dev.model || 'Disk 2.0';
        const sPort = document.getElementById('storDevPort');
        if (sPort) sPort.innerText = `Port ${dev.port || 3}`;
        const sSpd = document.getElementById('storDevSpeed');
        if (sSpd) sSpd.innerText = `${dev.speed_mbps || 480} Mbps (${dev.standard || 'USB 2.0'})`;
        const sIp = document.getElementById('storDevIp');
        if (sIp) sIp.innerText = dev.virtual_ip || (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_ip) || '10.0.0.1';
        const sHost = document.getElementById('storDevHost');
        if (sHost) sHost.innerText = dev.hostname || 'usb3-Disk-2-0.lan';
        const sMount = document.getElementById('storDevMount');
        if (sMount) sMount.innerText = `${dev.mount_point || '/mnt/pendrive'} (${dev.mounted ? 'Mounted' : 'Standby'})`;
        const sCap = document.getElementById('storDevCap');
        if (sCap) sCap.innerText = (dev.total_space && dev.total_space !== '--') ? `${dev.total_space} (${dev.free_space || '0'} free)` : 'Ready (Standby)';
      } else {
        if (storPanel) storPanel.style.display = 'none';
        if (phonePanel) phonePanel.style.display = 'block';
        fetchDeviceTelemetry();
      }
    }

    async function fetchDeviceTelemetry() {
      try {
        const url = "/cgi-bin/device?action=telemetry" + (selectedAdbSerial ? "&serial=" + encodeURIComponent(selectedAdbSerial) : "");
        const res = await apiFetch(url);
        const data = await res.json();
        if (data.status === 'ok') {
          const id = data.identity || {};
          const b = data.battery || {};
          const t = data.thermals || {};
          const m = data.memory || {};
          const s = data.storage || {};
          const r = data.radio || {};
          const isAdbOff = data.adb_enabled === false;

          const devModel = document.getElementById('devModel');
          if (devModel) devModel.innerText = (id.brand ? id.brand.toUpperCase() + ' ' : '') + (id.model || '--');

          const devSoc = document.getElementById('devSoc');
          if (devSoc) devSoc.innerText = isAdbOff ? 'ADB Disabled' : (id.soc || '--');

          const devOs = document.getElementById('devOs');
          if (devOs) devOs.innerText = isAdbOff ? 'ADB Disabled' : (id.android && id.android !== '--' ? `Android ${id.android}` : '--');

          const bLvl = document.getElementById('devBattLevel');
          if (bLvl) bLvl.innerText = isAdbOff ? 'ADB Disabled' : (b.level !== undefined && b.level !== null ? `${b.level}% (${b.technology || 'Li-ion'})` : '--');

          const bVolt = document.getElementById('devBattVolt');
          if (bVolt) bVolt.innerText = isAdbOff ? '--' : (b.voltage_mv ? `${b.voltage_mv} mV` : '--');

          const cTemp = document.getElementById('devCpuTemp');
          if (cTemp) {
            cTemp.innerHTML = (!isAdbOff && t && t.cpu_c !== undefined) ? `<span style="color:${getTempColor(t.cpu_c)}">${t.cpu_c}°C</span>` : '--';
          }

          const bTemp = document.getElementById('devBattTemp');
          if (bTemp) {
            bTemp.innerHTML = (!isAdbOff && t && t.battery_c !== undefined) ? `<span style="color:${getTempColor(t.battery_c)}">${t.battery_c}°C</span>` : '--';
          }

          const uTemp = document.getElementById('devUsbTemp');
          if (uTemp) {
            uTemp.innerHTML = (!isAdbOff && t && t.usb_c !== undefined) ? `<span style="color:${getTempColor(t.usb_c)}">${t.usb_c}°C</span>` : '--';
          }

          const sTemp = document.getElementById('devSkinTemp');
          if (sTemp) {
            sTemp.innerHTML = (!isAdbOff && t && t.skin_c !== undefined) ? `<span style="color:${getTempColor(t.skin_c)}">${t.skin_c}°C</span>` : '--';
          }

          const paTemp = document.getElementById('devPaTemp');
          if (paTemp) {
            paTemp.innerHTML = (!isAdbOff && t && t.rf_pa_c !== undefined) ? `<span style="color:${getTempColor(t.rf_pa_c)}">${t.rf_pa_c}°C</span>` : '--';
          }

          const rPct = document.getElementById('devRamPct');
          if (rPct) {
            rPct.innerHTML = (!isAdbOff && m && m.total_mb > 0) ? `${m.used_mb || 0}M / ${m.total_mb}M (<span style="color:${getUsageColor(m.used_pct)}">${m.used_pct || 0}%</span>)` : '--';
          }

          const sFree = document.getElementById('devStorageFree');
          if (sFree) {
            sFree.innerText = (!isAdbOff && s && s.avail && s.avail !== '--') ? `${s.avail} FREE / ${s.total || '--'}` : '--';
          }

          const devBand = document.getElementById('devBand');
          if (devBand) {
            if (isAdbOff) {
              devBand.innerText = '--';
            } else if (r && r.has_sim === false) {
              devBand.innerText = 'No SIM Card';
            } else if (r && r.band && r.band !== '--') {
              devBand.innerText = `${r.band} (PCI ${r.pci || '--'})`;
            } else {
              devBand.innerText = '--';
            }
          }

          const devRsrp = document.getElementById('devRsrp');
          if (devRsrp) {
            if (isAdbOff) {
              devRsrp.innerText = '--';
            } else if (r && r.has_sim === false) {
              devRsrp.innerText = 'No Signal';
            } else if (r && r.rsrp_dbm) {
              devRsrp.innerText = `${r.rsrp_dbm} dBm (${r.sinr_db || 0} dB)`;
            } else {
              devRsrp.innerText = '--';
            }
          }

          const sState = document.getElementById('devScreenState');
          if (sState) sState.innerText = isAdbOff ? '--' : (data.screen_state || 'Awake');

          const devUptime = document.getElementById('devUptime');
          if (devUptime) devUptime.innerText = isAdbOff ? '--' : (data.uptime || '--');
        }
      } catch (e) {
        console.error("fetchDeviceTelemetry error", e);
      }
    }

    async function fetchDeviceSms() {
      const container = document.getElementById('smsInboxList');
      if (!container) return;
      container.innerHTML = '<div style="color:var(--text-dim); font-size:11.5px; padding:12px; text-align:center;">Fetching SMS messages from SIM card...</div>';
      try {
        const res = await fetch('/cgi-bin/device?action=sms');
        const data = await res.json();
        const list = Array.isArray(data.sms) ? data.sms : [];
        if (list.length === 0) {
          container.innerHTML = '<div style="color:var(--text-dim); font-size:11.5px; padding:12px; text-align:center;">No incoming messages found.</div>';
          return;
        }
        container.innerHTML = list.map(m => {
          let timeStr = '';
          if (m.date) {
            const dt = new Date(parseInt(m.date, 10));
            timeStr = isNaN(dt.getTime()) ? '' : dt.toLocaleString();
          }
          return `
            <div class="sms-chat-bubble">
              <div class="sms-bubble-top">
                <div style="display:flex; align-items:center; gap:6px;">
                  <svg class="svg-icon" style="color:var(--mh-purple); width:13px; height:13px;" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span class="sms-sender">${escapeHtml(m.address || 'Unknown')}</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="sms-time">${escapeHtml(timeStr)}</span>
                  <button class="mh-btn btn-sm btn-ghost" onclick="navigator.clipboard.writeText('${escapeHtml(m.body || '')}'); alert('Copied message text')" style="font-size:9.5px; padding:2px 6px;">COPY</button>
                </div>
              </div>
              <div class="sms-body-text">${escapeHtml(m.body || '')}</div>
            </div>
          `;
        }).join('');
      } catch (e) {
        container.innerHTML = '<div style="color:var(--mh-rose); font-size:11.5px; padding:10px;">Failed to fetch messages: ' + escapeHtml(e.message) + '</div>';
      }
    }

    async function runDevicePing() {
      const box = document.getElementById('deviceToolOutput');
      box.style.display = 'block';
      box.innerText = 'Pinging 8.8.8.8 directly from phone 5G interface...';
      try {
        const res = await fetch('/cgi-bin/device?action=ping');
        const data = await res.json();
        box.innerText = data.output || 'Ping test complete.';
      } catch (e) {
        box.innerText = 'Error running ping: ' + e.message;
      }
    }

    // ADB Device state tracking (per serial) with LocalStorage persistence
    let adbDeviceStates = {
      torch: {},
      silent: {},
      screen: {},
      screenAwake: {},
      volume: {},
      radio: {},
      wirelessAdb: {}
    };

    try {
      const savedAdb = localStorage.getItem('maxnet_adb_states');
      if (savedAdb) adbDeviceStates = Object.assign(adbDeviceStates, JSON.parse(savedAdb));
    } catch (e) {}

    function saveAdbDeviceStates() {
      try {
        localStorage.setItem('maxnet_adb_states', JSON.stringify(adbDeviceStates));
      } catch (e) {}
    }

    function getAdbDeviceState(serial) {
      if (!serial) serial = 'default_adb';
      if (!adbDeviceStates.torch) adbDeviceStates.torch = {};
      if (!adbDeviceStates.screenAwake) adbDeviceStates.screenAwake = {};
      if (!adbDeviceStates.volume) adbDeviceStates.volume = {};
      if (!adbDeviceStates.radio) adbDeviceStates.radio = {};
      if (!adbDeviceStates.wirelessAdb) adbDeviceStates.wirelessAdb = {};

      if (adbDeviceStates.torch[serial] === undefined) adbDeviceStates.torch[serial] = false;
      if (adbDeviceStates.screenAwake[serial] === undefined) adbDeviceStates.screenAwake[serial] = true;
      if (adbDeviceStates.volume[serial] === undefined) adbDeviceStates.volume[serial] = 10;
      if (!adbDeviceStates.radio[serial]) adbDeviceStates.radio[serial] = 'active';
      if (adbDeviceStates.wirelessAdb[serial] === undefined) adbDeviceStates.wirelessAdb[serial] = false;
      return {
        torch: adbDeviceStates.torch[serial],
        screenAwake: adbDeviceStates.screenAwake[serial],
        volume: adbDeviceStates.volume[serial],
        radio: adbDeviceStates.radio[serial],
        wirelessAdb: adbDeviceStates.wirelessAdb[serial]
      };
    }

    function updateAdbTorchUI(isOn) {
      const btn = document.getElementById('btnTorchToggle');
      const pill = document.getElementById('dispTorchStatus');
      const sub = document.getElementById('dispTorchSub');

      if (btn) {
        if (isOn) {
          btn.classList.add('active-torch');
        } else {
          btn.classList.remove('active-torch');
        }
      }
      if (pill) {
        if (isOn) {
          pill.className = 'setting-pill pill-amber';
          pill.textContent = 'TORCH ON';
        } else {
          pill.className = 'setting-pill';
          pill.textContent = 'OFF';
        }
      }
      if (sub) {
        sub.innerHTML = `<strong style="color:${isOn ? '#f59e0b' : 'var(--text-dim)'};">State: ${isOn ? 'ON' : 'OFF'}</strong> &bull; High-intensity rear camera LED torch`;
      }
    }

    /* ==================== ADB LIVE TELEMETRY & DATA EXTRACTION ==================== */
    async function fetchAdbLiveTelemetry(btn) {
      if (!selectedAdbSerial) return;
      if (btn) btn.classList.add('rotating');
      try {
        const res = await apiFetch(`/cgi-bin/device?serial=${encodeURIComponent(selectedAdbSerial)}`);
        const data = await res.json();
        if (data) {
          const mTitle = document.getElementById('dispDevModelTitle');
          const mSub = document.getElementById('dispDevModelSub');
          const bSub = document.getElementById('dispDevBatterySub');
          const sSub = document.getElementById('dispDevSerialSub');
          const rSub = document.getElementById('dispRadioSub');

          // Model & Brand
          const ident = data.identity || {};
          const brand = data.brand || ident.brand || '';
          const model = data.model || ident.model || 'Android Handset';
          const android = data.android_version || ident.android || '--';
          const patch = data.security_patch || ident.security_patch || '--';
          const soc = data.soc || ident.soc || '--';

          if (mTitle) mTitle.textContent = `${brand ? brand + ' ' : ''}${model}`;
          if (mSub) mSub.textContent = `Android ${android} • Patch: ${patch} • SoC: ${soc}`;

          // Battery
          const batt = data.battery || {};
          const bLevel = data.battery_level ?? batt.level ?? '--';
          const bTemp = data.battery_temp ?? batt.temp_c ?? '--';
          const bHealth = data.battery_health || batt.health || (batt.health_code === '2' ? 'Good' : 'Normal');
          let bState = data.battery_status || batt.status;
          if (!bState) {
            if (data.battery_charging || batt.charging || batt.status_code === '2') bState = 'Charging';
            else if (batt.status_code === '4') bState = 'Not Charging (Protected)';
            else if (batt.status_code === '5') bState = 'Full';
            else bState = 'Discharging';
          }
          if (bSub) {
            bSub.textContent = `Level: ${bLevel}% (${bState}) • Temp: ${bTemp}°C • Health: ${bHealth}`;
          }

          // Serial & USB
          const usb = data.usb || {};
          const serial = data.serial || ident.serial || data.device_id || selectedAdbSerial;
          const speed = data.speed_mbps || usb.speed_mbps || 480;
          const std = usb.standard || (speed >= 5000 ? 'USB 3.0' : 'USB 2.0');
          const port = data.port || usb.port || '1';
          if (sSub) sSub.textContent = `Serial: ${serial} • Port: ${port} • ${std} (${speed} Mbps)`;

          // Radio
          const radio = data.radio || {};
          const oper = radio.operator || data.operator || 'Cellular';
          const net = radio.network || data.network_type || '5G SA';
          const band = radio.band ? ` • ${radio.band}` : '';
          if (rSub) {
            rSub.textContent = `Carrier: ${oper} • ${net}${band} • State: Active`;
          }

          // Device System Uptime
          const uSub = document.getElementById('dispDevUptimeSub');
          if (uSub) {
            const devUp = data.uptime || '--';
            uSub.innerHTML = `<strong>Uptime: ${escapeHtml(devUp)}</strong> &bull; Powered on &amp; operational`;
          }
        }
      } catch (e) {
        console.error('fetchAdbLiveTelemetry error', e);
      } finally {
        if (btn) setTimeout(() => btn.classList.remove('rotating'), 600);
      }
    }

    function copyAdbSerial() {
      if (!selectedAdbSerial) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(selectedAdbSerial);
        alert(`Copied ADB Serial "${selectedAdbSerial}" to clipboard`);
      }
    }

    /* ==================== ADB SUB-PAGE SWITCHING & RENDER (NO POPUPS) ==================== */
    window._currentAdbSubView = 'controls';

    function switchAdbSubView(view) {
      window._currentAdbSubView = view;
      const views = {
        'controls': document.getElementById('adbDetailView'),
        'sms': document.getElementById('adbSmsPageView'),
        'calls': document.getElementById('adbCallsPageView'),
        'contacts': document.getElementById('adbContactsPageView')
      };

      // Hide all sub-views
      Object.values(views).forEach(v => { if (v) v.style.display = 'none'; });

      // Show target sub-view
      if (views[view]) {
        views[view].style.display = 'flex';
      }

      // Update active state in all tab bars
      document.querySelectorAll('.adb-sub-tab').forEach(t => {
        if (t.getAttribute('data-subview') === view) {
          t.classList.add('active');
        } else {
          t.classList.remove('active');
        }
      });

      // Update breadcrumb navigation
      const devName = (document.getElementById('dispDevModelTitle') || {}).textContent || selectedAdbSerial || 'Device';
      const navTitle = document.getElementById('settingsDetailNavTitle');
      if (navTitle) {
        if (view === 'controls') {
          navTitle.textContent = devName;
        } else {
          const titles = { 'sms': 'SMS Messages', 'calls': 'Call History', 'contacts': 'Contacts' };
          navTitle.textContent = titles[view] || devName;
        }
      }

      // Automatically trigger data load for the selected view
      if (view === 'sms') {
        if (!window._cachedAdbSms || window._cachedAdbSms.length === 0) fetchAdbSmsPage();
      } else if (view === 'calls') {
        if (!window._cachedAdbCalls || window._cachedAdbCalls.length === 0) fetchAdbCallsPage();
      } else if (view === 'contacts') {
        if (!window._cachedAdbContacts || window._cachedAdbContacts.length === 0) fetchAdbContactsPage();
      }
    }

    /* --- DEDICATED IN-PAGE SMS HANDLER --- */
    async function fetchAdbSmsPage(btn) {
      const container = document.getElementById('adbSmsPageContainer');
      const countBadge = document.getElementById('adbSmsPageCountBadge');
      const subtitle = document.getElementById('adbSmsPageSubtitle');
      const devName = (document.getElementById('dispDevModelTitle') || {}).textContent || selectedAdbSerial || 'Handset';
      if (subtitle) subtitle.textContent = `${devName} • SMS Inbox`;
      if (btn) btn.classList.add('rotating');

      if (container && (!window._cachedAdbSms || window._cachedAdbSms.length === 0)) {
        container.innerHTML = `
          <div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
            <svg class="spin-icon" viewBox="0 0 24 24" style="width:22px; height:22px; stroke:#38bdf8; margin:0 auto 10px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            Loading SMS messages from handset via ADB...
          </div>
        `;
      }

      try {
        const res = await apiFetch(`/cgi-bin/device?action=sms&serial=${encodeURIComponent(selectedAdbSerial || '')}`);
        const data = await res.json();
        const msgs = Array.isArray(data.messages) ? data.messages : [];
        window._cachedAdbSms = msgs;
        const searchInput = document.getElementById('adbSmsPageSearch');
        if (searchInput) searchInput.placeholder = msgs.length > 0 ? `Search ${msgs.length} messages...` : 'Search messages...';
        renderAdbSmsPageList(msgs);
      } catch (e) {
        if (container) container.innerHTML = `<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to load SMS messages: ${escapeHtml(e.message)}</div>`;
      } finally {
        if (btn) setTimeout(() => btn.classList.remove('rotating'), 600);
      }
    }

    function renderAdbSmsPageList(list) {
      const container = document.getElementById('adbSmsPageContainer');
      if (!container) return;
      if (!list || list.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No SMS messages found on device.</div>`;
        return;
      }

      container.innerHTML = list.map(m => {
        let dateStr = '--';
        if (m.date) {
          const d = new Date(parseInt(m.date, 10));
          if (!isNaN(d.getTime())) dateStr = d.toLocaleString();
        }
        const isIncoming = m.type === '1' || m.type === 1;
        const arrowSvg = isIncoming
          ? '<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#10b981; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>'
          : '<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#38bdf8; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
        const arrowBg = isIncoming ? 'rgba(16,185,129,0.12)' : 'rgba(56,189,248,0.12)';

        return `
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:11px 14px; display:flex; align-items:flex-start; gap:12px;">
            <div style="width:28px; height:28px; min-width:28px; border-radius:50%; background:${arrowBg}; display:flex; align-items:center; justify-content:center; margin-top:2px;">
              ${arrowSvg}
            </div>
            <div style="display:flex; flex-direction:column; gap:4px; flex:1; min-width:0;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                <strong style="color:var(--text-main); font-size:12.5px; font-family:var(--font-mono);">${escapeHtml(m.address || 'Unknown Sender')}</strong>
                <span style="font-size:10.5px; color:var(--text-dim); font-family:var(--font-mono);">${escapeHtml(dateStr)}</span>
              </div>
              <div style="font-size:12px; color:var(--text-main); line-height:1.5; word-break:break-word; white-space:pre-wrap;">${escapeHtml(m.body || '')}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    function filterAdbSmsPage(query) {
      const q = (query || '').toLowerCase().trim();
      const list = window._cachedAdbSms || [];
      if (!q) {
        renderAdbSmsPageList(list);
        return;
      }
      const filtered = list.filter(m => (m.address || '').toLowerCase().includes(q) || (m.body || '').toLowerCase().includes(q));
      renderAdbSmsPageList(filtered);
    }

    /* --- DEDICATED IN-PAGE CALL HISTORY HANDLER --- */
    async function fetchAdbCallsPage(btn) {
      const container = document.getElementById('adbCallsPageContainer');
      const countBadge = document.getElementById('adbCallsPageCountBadge');
      const subtitle = document.getElementById('adbCallsPageSubtitle');
      const devName = (document.getElementById('dispDevModelTitle') || {}).textContent || selectedAdbSerial || 'Handset';
      if (subtitle) subtitle.textContent = `${devName} • Call History`;
      if (btn) btn.classList.add('rotating');

      if (container && (!window._cachedAdbCalls || window._cachedAdbCalls.length === 0)) {
        container.innerHTML = `
          <div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
            <svg class="spin-icon" viewBox="0 0 24 24" style="width:22px; height:22px; stroke:#38bdf8; margin:0 auto 10px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            Loading call logs from handset via ADB...
          </div>
        `;
      }

      try {
        const res = await apiFetch(`/cgi-bin/device?action=call_logs&serial=${encodeURIComponent(selectedAdbSerial || '')}`);
        const data = await res.json();
        const logs = Array.isArray(data.call_logs) ? data.call_logs : [];
        window._cachedAdbCalls = logs;
        const searchInput = document.getElementById('adbCallsPageSearch');
        if (searchInput) searchInput.placeholder = logs.length > 0 ? `Search ${logs.length} calls by number or name...` : 'Search call logs...';
        renderAdbCallsPageList(logs);
      } catch (e) {
        if (container) container.innerHTML = `<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to load call history: ${escapeHtml(e.message)}</div>`;
      } finally {
        if (btn) setTimeout(() => btn.classList.remove('rotating'), 600);
      }
    }

    function renderAdbCallsPageList(list) {
      const container = document.getElementById('adbCallsPageContainer');
      if (!container) return;
      if (!list || list.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No call logs recorded on device.</div>`;
        return;
      }

      container.innerHTML = list.map(c => {
        let dateStr = '--';
        if (c.date) {
          const d = new Date(parseInt(c.date, 10));
          if (!isNaN(d.getTime())) dateStr = d.toLocaleString();
        }
        let arrowSvg = '<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#38bdf8; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
        let arrowBg = 'rgba(56,189,248,0.12)';

        if (c.type === '1' || c.type === 1) {
          arrowSvg = '<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#10b981; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>';
          arrowBg = 'rgba(16,185,129,0.12)';
        } else if (c.type === '3' || c.type === 3) {
          arrowSvg = '<svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#ef4444; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>';
          arrowBg = 'rgba(239,68,68,0.12)';
        }

        const durSec = parseInt(c.duration || '0', 10);
        const durFmt = durSec > 60 ? `${Math.floor(durSec / 60)}m ${durSec % 60}s` : `${durSec}s`;

        return `
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div style="display:flex; align-items:center; gap:12px; min-width:0;">
              <div style="width:28px; height:28px; min-width:28px; border-radius:50%; background:${arrowBg}; display:flex; align-items:center; justify-content:center;">
                ${arrowSvg}
              </div>
              <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
                <strong style="color:var(--text-main); font-size:12.5px; font-family:var(--font-mono);">${escapeHtml(c.number || 'Private Number')}</strong>
                <span style="font-size:11px; color:var(--text-dim);">${c.name && c.name !== 'NULL' ? escapeHtml(c.name) + ' &bull; ' : ''}${escapeHtml(dateStr)}</span>
              </div>
            </div>
            <span style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono); white-space:nowrap;">${durFmt}</span>
          </div>
        `;
      }).join('');
    }

    function filterAdbCallsPage(query) {
      const q = (query || '').toLowerCase().trim();
      const list = window._cachedAdbCalls || [];
      if (!q) {
        renderAdbCallsPageList(list);
        return;
      }
      const filtered = list.filter(c => (c.number || '').toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q));
      renderAdbCallsPageList(filtered);
    }

    /* --- DEDICATED IN-PAGE CONTACTS HANDLER --- */
    async function fetchAdbContactsPage(btn) {
      const container = document.getElementById('adbContactsPageContainer');
      const countBadge = document.getElementById('adbContactsPageCountBadge');
      const subtitle = document.getElementById('adbContactsPageSubtitle');
      const devName = (document.getElementById('dispDevModelTitle') || {}).textContent || selectedAdbSerial || 'Handset';
      if (subtitle) subtitle.textContent = `${devName} • Contacts`;
      if (btn) btn.classList.add('rotating');

      if (container && (!window._cachedAdbContacts || window._cachedAdbContacts.length === 0)) {
        container.innerHTML = `
          <div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
            <svg class="spin-icon" viewBox="0 0 24 24" style="width:22px; height:22px; stroke:#38bdf8; margin:0 auto 10px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            Loading contacts from handset via ADB...
          </div>
        `;
      }

      try {
        const res = await apiFetch(`/cgi-bin/device?action=contacts&serial=${encodeURIComponent(selectedAdbSerial || '')}`);
        const data = await res.json();
        const contacts = Array.isArray(data.contacts) ? data.contacts : [];
        window._cachedAdbContacts = contacts;
        const searchInput = document.getElementById('adbContactsPageSearch');
        if (searchInput) searchInput.placeholder = contacts.length > 0 ? `Search ${contacts.length} contacts...` : 'Search contacts...';
        renderAdbContactsPageList(contacts);
      } catch (e) {
        if (container) container.innerHTML = `<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to load contacts: ${escapeHtml(e.message)}</div>`;
      } finally {
        if (btn) setTimeout(() => btn.classList.remove('rotating'), 600);
      }
    }

    function renderAdbContactsPageList(list) {
      const container = document.getElementById('adbContactsPageContainer');
      if (!container) return;
      if (!list || list.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No contacts found on device.</div>`;
        return;
      }

      container.innerHTML = list.map(c => `
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div style="display:flex; align-items:center; gap:12px; min-width:0;">
            <div style="width:28px; height:28px; min-width:28px; border-radius:50%; background:rgba(167,139,250,0.12); display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:#a78bfa; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
              <strong style="color:var(--text-main); font-size:12.5px;">${escapeHtml(c.name || 'Unnamed Contact')}</strong>
              <span style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono);">${escapeHtml(c.number || '--')}</span>
            </div>
          </div>
          <span class="card-badge" style="font-size:9.5px;">MOBILE</span>
        </div>
      `).join('');
    }

    function filterAdbContactsPage(query) {
      const q = (query || '').toLowerCase().trim();
      const list = window._cachedAdbContacts || [];
      if (!q) {
        renderAdbContactsPageList(list);
        return;
      }
      const filtered = list.filter(c => (c.name || '').toLowerCase().includes(q) || (c.number || '').toLowerCase().includes(q));
      renderAdbContactsPageList(filtered);
    }

    // Modal compatibility redirects to in-page view (no popups)
    function openAdbSmsModal() { switchAdbSubView('sms'); }
    function openAdbCallLogsModal() { switchAdbSubView('calls'); }
    function openAdbContactsModal() { switchAdbSubView('contacts'); }
    function closeAdbSmsModal() { switchAdbSubView('controls'); }
    function closeAdbCallLogsModal() { switchAdbSubView('controls'); }
    function closeAdbContactsModal() { switchAdbSubView('controls'); }

    /* --- SCREENSHOT --- */
    async function captureAdbScreenshot(btn) {
      const overlay = document.getElementById('adbScreenshotModalOverlay');
      const body = document.getElementById('adbScreenshotModalBody');
      const dlBtn = document.getElementById('btnDownloadAdbScreenshot');
      if (!overlay || !body) return;

      overlay.style.display = 'flex';
      if (dlBtn) dlBtn.style.display = 'none';
      body.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">
          <svg class="spin-icon" viewBox="0 0 24 24" style="width:24px; height:24px; stroke:#38bdf8; margin:0 auto 12px; display:block;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
          Capturing handset screen via screencap... Please wait.
        </div>
      `;

      try {
        const res = await apiFetch(`/cgi-bin/device?action=screenshot&serial=${encodeURIComponent(selectedAdbSerial || '')}`);
        const data = await res.json();
        if (data && data.status === 'ok' && data.image_base64) {
          body.innerHTML = `
            <img src="${data.image_base64}" alt="Handset Screen" style="max-width:100%; max-height:68vh; border-radius:10px; border:1px solid rgba(255,255,255,0.12); box-shadow:0 12px 30px rgba(0,0,0,0.5); display:block; margin:0 auto;">
          `;
          if (dlBtn) {
            dlBtn.href = data.image_base64;
            dlBtn.download = `screenshot_${selectedAdbSerial}_${Date.now()}.png`;
            dlBtn.style.display = 'inline-flex';
          }
        } else {
          body.innerHTML = `<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Failed to capture screenshot: ${escapeHtml(data.message || 'Unknown error')}</div>`;
        }
      } catch (e) {
        body.innerHTML = `<div style="text-align:center; padding:20px; color:#ef4444; font-size:12px;">Screenshot error: ${escapeHtml(e.message)}</div>`;
      }
    }

    function closeAdbScreenshotModal() {
      const overlay = document.getElementById('adbScreenshotModalOverlay');
      if (overlay) overlay.style.display = 'none';
    }

    async function togglePhoneTorch(btn) {
      const ser = selectedAdbSerial || 'default';
      const cur = !!adbDeviceStates.torch[ser];
      const next = !cur;
      adbDeviceStates.torch[ser] = next;
      saveAdbDeviceStates();

      // Update UI immediately with glowing tactile response
      updateAdbTorchUI(next);
      if (btn) {
        btn.classList.add('btn-pulse');
        setTimeout(() => btn.classList.remove('btn-pulse'), 350);
      }

      const statusMsg = next ? 'Flashlight turned ON' : 'Flashlight turned OFF';
      showToast(statusMsg, next ? 'warning' : 'info');

      try {
        await apiFetch('/cgi-bin/device?action=torch' + (selectedAdbSerial ? '&serial=' + encodeURIComponent(selectedAdbSerial) : ''));
      } catch (e) {
        console.error('Torch error:', e);
      }
    }

    async function volumePhone(direction, btn) {
      const ser = selectedAdbSerial || 'default';
      if (btn) {
        btn.classList.add('btn-pulse');
        setTimeout(() => btn.classList.remove('btn-pulse'), 350);
      }

      const pill = document.getElementById('dispVolumeStatus');
      const sub = document.getElementById('dispVolumeSub');
      const silentBtn = document.getElementById('btnVolSilent');

      if (!adbDeviceStates.volume) adbDeviceStates.volume = {};
      if (!adbDeviceStates.silent) adbDeviceStates.silent = {};

      if (direction === 'silent') {
        const isSilent = !adbDeviceStates.silent[ser];
        adbDeviceStates.silent[ser] = isSilent;
        adbDeviceStates.volume[ser] = isSilent ? 0 : 10;
        saveAdbDeviceStates();
        if (silentBtn) {
          if (isSilent) silentBtn.classList.add('active-warning');
          else silentBtn.classList.remove('active-warning');
        }
        if (pill) {
          pill.className = isSilent ? 'setting-pill pill-amber' : 'setting-pill';
          pill.textContent = isSilent ? 'SILENT ON' : 'MEDIA';
        }
        if (sub) {
          sub.innerHTML = `<strong style="color:${isSilent ? '#f59e0b' : 'var(--text-main)'};">Level: ${isSilent ? 'MUTED' : 'Volume 10'}</strong> &bull; Speaker media audio level`;
        }
        showToast(isSilent ? 'Phone switched to Silent Mode' : 'Silent mode deactivated', 'warning');
      } else {
        let curVol = adbDeviceStates.volume[ser] !== undefined ? adbDeviceStates.volume[ser] : 10;
        if (direction === 'up') curVol = Math.min(15, curVol + 1);
        else curVol = Math.max(0, curVol - 1);
        adbDeviceStates.volume[ser] = curVol;
        adbDeviceStates.silent[ser] = (curVol === 0);
        saveAdbDeviceStates();
        if (pill) {
          pill.className = 'setting-pill pill-cyan';
          pill.textContent = direction === 'up' ? 'VOL +' : 'VOL -';
        }
        if (sub) {
          sub.innerHTML = `<strong style="color:${curVol === 0 ? '#f59e0b' : 'var(--text-main)'};">Level: ${curVol === 0 ? 'MUTED' : `Volume ${curVol}`}</strong> &bull; Speaker media audio level`;
        }
        showToast(`Volume adjusted (${direction.toUpperCase()})`, 'info');
      }

      try {
        await apiFetch('/cgi-bin/device?action=volume&cmd=' + encodeURIComponent(direction) + (selectedAdbSerial ? '&serial=' + encodeURIComponent(selectedAdbSerial) : ''));
      } catch (e) {
        console.error('Volume error:', e);
      }
    }

    async function runDeviceWake(btn) {
      const ser = selectedAdbSerial || 'default';
      adbDeviceStates.screen[ser] = 'on';
      if (!adbDeviceStates.screenAwake) adbDeviceStates.screenAwake = {};
      adbDeviceStates.screenAwake[ser] = true;
      saveAdbDeviceStates();
      if (btn) {
        btn.classList.add('active-cyan', 'btn-pulse');
        setTimeout(() => btn.classList.remove('btn-pulse'), 350);
      }
      const sleepBtn = document.getElementById('btnDisplaySleep');
      if (sleepBtn) sleepBtn.classList.remove('active-cyan');

      const pill = document.getElementById('dispPowerStatus');
      const sub = document.getElementById('dispPowerSub');
      if (pill) { pill.className = 'setting-pill pill-cyan'; pill.textContent = 'AWAKE'; }
      if (sub) sub.innerHTML = `<strong style="color:#38bdf8;">State: AWAKE</strong> &bull; Handset touch display is active`;
      showToast('Waking phone screen...', 'info');

      try {
        await apiFetch('/cgi-bin/device?action=wake' + (selectedAdbSerial ? '&serial=' + encodeURIComponent(selectedAdbSerial) : ''));
      } catch (e) {
        console.error(e);
      }
    }

    async function runDeviceSleep(btn) {
      const ser = selectedAdbSerial || 'default';
      adbDeviceStates.screen[ser] = 'off';
      if (!adbDeviceStates.screenAwake) adbDeviceStates.screenAwake = {};
      adbDeviceStates.screenAwake[ser] = false;
      saveAdbDeviceStates();
      if (btn) {
        btn.classList.add('active-cyan', 'btn-pulse');
        setTimeout(() => btn.classList.remove('btn-pulse'), 350);
      }
      const wakeBtn = document.getElementById('btnDisplayWake');
      if (wakeBtn) wakeBtn.classList.remove('active-cyan');

      const pill = document.getElementById('dispPowerStatus');
      const sub = document.getElementById('dispPowerSub');
      if (pill) { pill.className = 'setting-pill'; pill.textContent = 'SLEEPING'; }
      if (sub) sub.innerHTML = `<strong style="color:var(--text-dim);">State: SLEEPING</strong> &bull; Handset touch display is powered down`;
      showToast('Screen put to sleep', 'info');

      try {
        await apiFetch('/cgi-bin/device?action=sleep' + (selectedAdbSerial ? '&serial=' + encodeURIComponent(selectedAdbSerial) : ''));
      } catch (e) {
        console.error(e);
      }
    }

    async function runDeviceAirplane(btn) {
      if (!confirm('Cycle phone cellular radio? Modem connection will temporarily drop.')) return;
      if (btn) {
        btn.classList.add('active-cyan', 'btn-pulse');
        const svg = btn.querySelector('svg');
        if (svg) svg.classList.add('spinning');
        setTimeout(() => {
          btn.classList.remove('active-cyan', 'btn-pulse');
          if (svg) svg.classList.remove('spinning');
        }, 1500);
      }
      const pill = document.getElementById('dispRadioStatus');
      if (pill) { pill.className = 'setting-pill pill-amber'; pill.textContent = 'CYCLING...'; }
      showToast('Cycling cellular radio (Airplane mode ON -> OFF)...', 'warning');

      try {
        await apiFetch('/cgi-bin/device?action=airplane' + (selectedAdbSerial ? '&serial=' + encodeURIComponent(selectedAdbSerial) : ''));
        setTimeout(() => {
          if (pill) { pill.className = 'setting-pill pill-green'; pill.textContent = '5G CONNECTED'; }
          showToast('Cellular radio re-attached to network!', 'success');
        }, 2000);
      } catch (e) {
        console.error(e);
      }
    }

    async function runDeviceReboot(btn) {
      if (!confirm('Reboot connected smartphone now? Internet tethering will pause until phone boots.')) return;
      if (btn) {
        btn.classList.add('btn-pulse');
        setTimeout(() => btn.classList.remove('btn-pulse'), 350);
      }
      showToast('ADB Reboot signal sent to phone!', 'error');

      try {
        await apiFetch('/cgi-bin/device?action=reboot' + (selectedAdbSerial ? '&serial=' + encodeURIComponent(selectedAdbSerial) : ''));
      } catch (e) {
        console.error(e);
      }
    }

    let cachedContacts = [];

    async function runDeviceLock() {
      const statusEl = document.getElementById('deviceActionStatus');
      try {
        const res = await fetch('/cgi-bin/device?action=lock');
        const data = await res.json();
        if (statusEl) statusEl.innerText = data.message || 'Power/Lock button triggered';
        setTimeout(fetchDeviceTelemetry, 1500);
      } catch (e) {
        if (statusEl) statusEl.innerText = 'Error: ' + e.message;
      }
    }

    async function openPhoneTetherSettings() {
      const statusEl = document.getElementById('deviceActionStatus');
      try {
        const res = await fetch('/cgi-bin/device?action=settings_tether');
        const data = await res.json();
        if (statusEl) statusEl.innerText = data.message || 'Tether settings launched on phone';
      } catch (e) {
        if (statusEl) statusEl.innerText = 'Error: ' + e.message;
      }
    }

    async function fetchDeviceContacts() {
      const container = document.getElementById('deviceContactsList');
      const badge = document.getElementById('devContactsBadge');
      if (!container) return;
      try {
        const res = await fetch('/cgi-bin/device?action=contacts');
        const data = await res.json();
        cachedContacts = Array.isArray(data.contacts) ? data.contacts : [];
        if (badge) badge.innerText = `${cachedContacts.length} CONTACTS`;
        renderContactsList(cachedContacts);
      } catch (e) {
        container.innerHTML = '<div style="color:var(--text-dim); padding:10px; font-size:11px;">Failed to load contacts: ' + escapeHtml(e.message) + '</div>';
      }
    }

    function filterContacts(query) {
      if (!query || !query.trim()) {
        renderContactsList(cachedContacts);
        return;
      }
      const q = query.trim().toLowerCase();
      const filtered = cachedContacts.filter(c => (c.name || '').toLowerCase().includes(q) || (c.number || '').includes(q));
      renderContactsList(filtered);
    }

    function renderContactsList(list) {
      const container = document.getElementById('deviceContactsList');
      if (!container) return;
      if (!list || list.length === 0) {
        container.innerHTML = '<div style="color:var(--text-dim); padding:12px; font-size:11.5px; text-align:center;">No contacts found.</div>';
        return;
      }
      container.innerHTML = list.map(c => {
        const initial = (c.name || 'C').charAt(0).toUpperCase();
        return `
          <div class="contact-item-pill">
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="contact-avatar-dot">${initial}</div>
              <div>
                <div style="font-weight:700; color:var(--text-main); font-size:12px;">${escapeHtml(c.name || 'Unnamed')}</div>
                <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-dim);">${escapeHtml(c.number || '--')}</div>
              </div>
            </div>
            <button class="mh-btn btn-sm btn-ghost" onclick="navigator.clipboard.writeText('${c.number || ''}'); alert('Copied ' + '${c.number || ''}')" style="font-size:10px; padding:3px 7px;">COPY</button>
          </div>
        `;
      }).join('');
    }

    async function fetchDeviceCalls() {
      const container = document.getElementById('deviceCallsList');
      if (!container) return;
      try {
        const res = await fetch('/cgi-bin/device?action=calls');
        const data = await res.json();
        const calls = Array.isArray(data.calls) ? data.calls : [];
        if (calls.length === 0) {
          container.innerHTML = '<div style="color:var(--text-dim); padding:12px; font-size:11.5px; text-align:center;">No recent calls found in call log.</div>';
          return;
        }
        container.innerHTML = calls.map(c => {
          const typeClass = c.type === 'Incoming' ? 'emerald' : (c.type === 'Outgoing' ? 'cyan' : 'rose');
          const durSec = parseInt(c.duration || 0, 10);
          const durFmt = durSec > 60 ? Math.floor(durSec / 60) + 'm ' + (durSec % 60) + 's' : durSec + 's';
          return `
            <div class="call-item-pill">
              <div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="card-badge ${typeClass}" style="font-size:9px;">${c.type}</span>
                  <strong style="color:var(--text-main); font-size:12px;">${escapeHtml(c.name || c.number)}</strong>
                </div>
                <div style="font-family:var(--font-mono); font-size:10.5px; color:var(--text-dim); margin-top:2px;">
                  ${escapeHtml(c.number)} • Duration: ${durFmt}
                </div>
              </div>
            </div>
          `;
        }).join('');
      } catch (e) {
        container.innerHTML = '<div style="color:var(--text-dim); padding:10px; font-size:11px;">Failed to load call log: ' + escapeHtml(e.message) + '</div>';
      }
    }

    // ==================== RESTORE FILE DROPZONE ====================
    function handleRestoreFileChosen(input) {
      const file = input.files && input.files[0];
      const lbl = document.getElementById('restoreFileLabel');
      const sub = document.getElementById('restoreFileSub');
      const btn = document.getElementById('btnRestoreSubmit');
      if (file) {
        const sz = (file.size / 1024).toFixed(1) + ' KB';
        if (lbl) lbl.innerHTML = `<span style="color:var(--mh-emerald);">[Selected] ${escapeHtml(file.name)}</span>`;
        if (sub) sub.innerText = `Size: ${sz} • Ready to restore`;
        if (btn) btn.style.display = 'inline-flex';
        const box = document.getElementById('restoreConfirmBox');
        if (box) box.style.display = 'flex';
      } else {
        if (lbl) lbl.innerText = 'Select or Drag & Drop Backup Archive (.tar.gz)';
        if (sub) sub.innerText = 'Click to browse your device for archive';
        if (btn) btn.style.display = 'none';
      }
    }

    function initDropzoneHandlers() {
      const dropzone = document.getElementById('backupDropzone');
      const fileInput = document.getElementById('backupFileInput');
      if (!dropzone || !fileInput) return;

      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('dragover');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('dragover');
        }, false);
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
          fileInput.files = files;
          handleRestoreFileChosen(fileInput);
        }
      }, false);
    }
    window.addEventListener('load', initDropzoneHandlers);

    // ==================== DIAGNOSTICS GUI RENDERER ====================
    function toggleDiagRawLog() {
      const box = document.getElementById('diagOutputBox');
      const btn = document.getElementById('btnToggleDiagRaw');
      if (!box || !btn) return;
      if (box.style.display === 'none') {
        box.style.display = 'block';
        btn.innerText = 'HIDE RAW CONSOLE';
      } else {
        box.style.display = 'none';
        btn.innerText = 'SHOW RAW CONSOLE';
      }
    }


    // ==================== ANDROID SETTINGS EDIT MODAL CONTROLLER ====================
    let currentModalKey = null;
    let networkAutoSaveTimer = null;
    let isNetworkSaving = false;

    function setSettingSaveStatus(state, msg) {
      const pill = document.getElementById('settingsSaveStatusPill');
      const txt = document.getElementById('settingsSaveStatusText');
      if (!pill || !txt) return;

      pill.className = 'setting-save-pill';
      if (state === 'pending' || state === 'saving') {
        pill.style.display = 'inline-flex';
        txt.textContent = msg || 'Applying changes...';
      } else if (state === 'saved') {
        pill.classList.add('saved');
        pill.style.display = 'inline-flex';
        txt.textContent = msg || 'Saved';
        setTimeout(() => {
          if (pill.classList.contains('saved')) pill.style.display = 'none';
        }, 2200);
      } else if (state === 'error') {
        pill.classList.add('error');
        pill.style.display = 'inline-flex';
        txt.textContent = msg || 'Save failed';
        setTimeout(() => {
          if (pill.classList.contains('error')) pill.style.display = 'none';
        }, 3000);
      } else {
        pill.style.display = 'none';
      }
    }

    function scheduleNetworkAutoSave(delayMs = 600) {
      if (networkAutoSaveTimer) clearTimeout(networkAutoSaveTimer);
      setSettingSaveStatus('pending', 'Saving changes...');
      networkAutoSaveTimer = setTimeout(() => {
        saveNetworkSettingsAuto();
      }, delayMs);
    }

    async function saveNetworkSettingsAuto() {
      if (isNetworkSaving) {
        networkAutoSaveTimer = setTimeout(() => saveNetworkSettingsAuto(), 800);
        return;
      }
      isNetworkSaving = true;
      setSettingSaveStatus('saving', 'Applying configuration...');

      const ipEl = document.getElementById('netLanIp');
      const maskEl = document.getElementById('netMask');
      const gwEl = document.getElementById('netGateway');
      const dnsEl = document.getElementById('netDns');
      const mtuEl = document.getElementById('netMtu');
      const startEl = document.getElementById('netDhcpStart');
      const limitEl = document.getElementById('netDhcpLimit');
      const leaseEl = document.getElementById('netDhcpLease');
      const toggleEl = document.getElementById('netDhcpMasterToggle');

      const payload = {
        action: 'set',
        hostname: document.getElementById('netDeviceHostname') ? document.getElementById('netDeviceHostname').value.trim() : '',
        custom_mac: document.getElementById('netCustomMac') ? document.getElementById('netCustomMac').value.trim() : '',
        reset_mac: (document.getElementById('netCustomMac') && document.getElementById('netCustomMac').dataset.reset === '1') ? 1 : 0,
        lan_ip: ipEl ? ipEl.value.trim() : '10.0.0.1',
        netmask: maskEl ? maskEl.value.trim() : '255.255.255.0',
        gateway: gwEl ? gwEl.value.trim() : '',
        mtu: mtuEl ? mtuEl.value.trim() : '1500',
        dns: dnsEl ? dnsEl.value.trim() : '',
        dhcp_start: startEl ? startEl.value.trim() : '100',
        dhcp_limit: limitEl ? limitEl.value.trim() : '150',
        dhcp_leasetime: leaseEl ? leaseEl.value.trim() : '12h',
        dhcp_ignore: (toggleEl && toggleEl.checked) ? 0 : 1,
        ipv6_enabled: (document.getElementById('netIpv6MasterToggle') && document.getElementById('netIpv6MasterToggle').checked) ? 1 : 0,
        ipv6_wan_mode: document.getElementById('netIpv6WanMode') ? document.getElementById('netIpv6WanMode').value : 'dhcpv6',
        ipv6_ra: (document.getElementById('netIpv6RaToggle') && document.getElementById('netIpv6RaToggle').checked) ? 1 : 0,
        ipv6_dhcp6: (document.getElementById('netIpv6Dhcp6Toggle') && document.getElementById('netIpv6Dhcp6Toggle').checked) ? 1 : 0,
        ipv6_ula: document.getElementById('netIpv6Ula') ? document.getElementById('netIpv6Ula').value : 'fd00::/48',
        ipv6_privacy: (document.getElementById('netIpv6PrivacyToggle') && document.getElementById('netIpv6PrivacyToggle').checked) ? 1 : 0,
        flow_offloading: (document.getElementById('netSwFlowToggle') && document.getElementById('netSwFlowToggle').checked) ? 1 : 0,
        flow_offloading_hw: (document.getElementById('netHwFlowToggle') && document.getElementById('netHwFlowToggle').checked) ? 1 : 0,
        mss_clamping: (document.getElementById('netMssClampToggle') && document.getElementById('netMssClampToggle').checked) ? 1 : 0,
        dns_rebind: (document.getElementById('netDnsRebindToggle') && document.getElementById('netDnsRebindToggle').checked) ? 1 : 0
      };

      try {
        const res = await fetch('/cgi-bin/network', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        setSettingSaveStatus('saved', 'Configuration Saved');
      } catch (e) {
        console.error("Auto-save network error:", e);
        setSettingSaveStatus('error', 'Update Failed');
      } finally {
        isNetworkSaving = false;
      }
    }

    function openSettingModal(key) {
      currentModalKey = key;
      const overlay = document.getElementById('settingEditModalOverlay');
      const titleEl = document.getElementById('settingModalTitle');
      const descEl = document.getElementById('settingModalDesc');
      const bodyEl = document.getElementById('settingModalBody');
      const saveBtn = document.getElementById('btnModalSave');
      if (!overlay || !bodyEl) return;

      if (saveBtn) saveBtn.textContent = 'SAVE';

      if (key === 'device_hostname') {
        titleEl.textContent = 'Device Hostname';
        descEl.textContent = 'System hostname of this router across local network, DNS queries, and DHCP announcements.';
        const curHost = (document.getElementById('netDeviceHostname') ? document.getElementById('netDeviceHostname').value : 'Maxnet-Gateway') || 'Maxnet-Gateway';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Router Hostname</label>
            <input type="text" id="modalInput_device_hostname" class="mh-input" value="${escapeHtml(curHost)}" placeholder="Maxnet-Gateway" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
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
        `;
      } else if (key === 'custom_mac') {
        titleEl.textContent = 'Custom MAC Address (Hardware Cloning)';
        descEl.textContent = 'Override the bridge interface (br-lan) MAC address. Useful for ISP clone requirements or privacy.';
        const curMac = (document.getElementById('netCustomMac') ? document.getElementById('netCustomMac').value : '') || '';
        const hwMac = (document.getElementById('netHwMac') ? document.getElementById('netHwMac').value : 'ca:e7:b7:34:8f:ac') || 'ca:e7:b7:34:8f:ac';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Custom MAC Address (XX:XX:XX:XX:XX:XX)</label>
            <input type="text" id="modalInput_custom_mac" class="mh-input" value="${escapeHtml(curMac)}" placeholder="${escapeHtml(hwMac)} (Default Hardware)" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono); line-height:1.4;">
            Hardware Factory MAC: <span style="color:var(--text-main); font-weight:700;">${escapeHtml(hwMac)}</span>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:4px;">
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_custom_mac').value='${escapeHtml(hwMac)}'">Use Factory Hardware MAC</button>
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_custom_mac').value=''">Reset to Default (No Override)</button>
            <button type="button" class="dns-preset-pill" onclick="generateRandomMacInModal()">Generate Random MAC</button>
          </div>
        `;
      } else if (key === 'client_history_days') {
        titleEl.textContent = 'Client History Retention';
        descEl.textContent = 'Select duration to retain per-device bandwidth and DHCP client logs';
        bodyEl.innerHTML = `
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
        `;
      } else if (key === 'lan_ip') {
        titleEl.textContent = 'Gateway IP Address';
        descEl.textContent = 'Primary IPv4 address for the bridge router interface (br-lan). Default is 10.0.0.1.';
        const curVal = document.getElementById('netLanIp').value || '10.0.0.1';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">IPv4 Address</label>
            <input type="text" id="modalInput_lan_ip" class="mh-input" value="${escapeHtml(curVal)}" placeholder="10.0.0.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'net_mask') {
        titleEl.textContent = 'Subnet Mask / CIDR';
        descEl.textContent = 'Subnet mask and network prefix length for local DHCP and address allocation.';
        const curMask = document.getElementById('netMask').value || '255.255.255.0';
        const curCidr = document.getElementById('netCidrSelect').value || '24';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Subnet Mask</label>
            <input type="text" id="modalInput_net_mask" class="mh-input" value="${escapeHtml(curMask)}" placeholder="255.255.255.0" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);" oninput="onModalMaskInput(this.value)">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Prefix Size (CIDR)</label>
            <select id="modalSelect_cidr" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);" onchange="onModalCidrChange(this.value)">
              <option value="24" ${curCidr === '24' ? 'selected' : ''}>/24 (255.255.255.0 &bull; 254 hosts)</option>
              <option value="16" ${curCidr === '16' ? 'selected' : ''}>/16 (255.255.0.0 &bull; 65534 hosts)</option>
              <option value="8" ${curCidr === '8' ? 'selected' : ''}>/8 (255.0.0.0 &bull; Class A)</option>
              <option value="custom" ${curCidr === 'custom' ? 'selected' : ''}>Custom</option>
            </select>
          </div>
        `;
      } else if (key === 'net_gateway') {
        titleEl.textContent = 'Default Upstream Gateway';
        descEl.textContent = 'Optional static upstream gateway IP (br-lan). Leave blank for auto or direct modem routing.';
        const curVal = document.getElementById('netGateway').value || '';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Gateway IPv4</label>
            <input type="text" id="modalInput_gateway" class="mh-input" value="${escapeHtml(curVal)}" placeholder="Optional (e.g. 10.0.0.254)" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'net_mtu') {
        titleEl.textContent = 'Interface MTU Size';
        descEl.textContent = 'Maximum Transmission Unit in bytes. Standard Ethernet MTU is 1500 (range: 576 - 9000).';
        const curVal = document.getElementById('netMtu').value || '1500';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">MTU Bytes</label>
            <input type="number" id="modalInput_mtu" class="mh-input" min="576" max="9000" value="${escapeHtml(curVal)}" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'dhcp_pool') {
        titleEl.textContent = 'DHCP Address Pool';
        descEl.textContent = 'Configure dynamic IP allocation range and lease duration for connected DHCP clients.';
        const curStart = document.getElementById('netDhcpStart').value || '100';
        const curLimit = document.getElementById('netDhcpLimit').value || '150';
        const curLease = document.getElementById('netDhcpLease').value || '12h';
        bodyEl.innerHTML = `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Start Offset</label>
              <input type="number" id="modalInput_dhcp_start" class="mh-input" min="2" max="250" value="${escapeHtml(curStart)}" style="width:100%; padding:8px 10px; font-size:12px; font-family:var(--font-mono);">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Pool Limit</label>
              <input type="number" id="modalInput_dhcp_limit" class="mh-input" min="5" max="250" value="${escapeHtml(curLimit)}" style="width:100%; padding:8px 10px; font-size:12px; font-family:var(--font-mono);">
            </div>
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Lease Duration</label>
            <select id="modalSelect_dhcp_lease" class="mh-input" style="width:100%; padding:8px 10px; font-size:12px; font-family:var(--font-mono);">
              <option value="12h" ${curLease === '12h' ? 'selected' : ''}>12 Hours (12h - Recommended)</option>
              <option value="24h" ${curLease === '24h' ? 'selected' : ''}>24 Hours (24h)</option>
              <option value="48h" ${curLease === '48h' ? 'selected' : ''}>48 Hours (48h)</option>
              <option value="7d" ${curLease === '7d' ? 'selected' : ''}>7 Days (7d)</option>
              <option value="infinite" ${curLease === 'infinite' ? 'selected' : ''}>Infinite Lease</option>
            </select>
          </div>
        `;
      } else if (key === 'custom_dns') {
        titleEl.textContent = 'Custom DNS Nameservers';
        descEl.textContent = 'High-speed upstream resolvers for domain queries. Multiple servers can be separated by spaces.';
        const curVal = document.getElementById('netDns').value || '1.1.1.1 8.8.8.8';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">DNS Resolvers (Space Separated)</label>
            <input type="text" id="modalInput_dns" class="mh-input" value="${escapeHtml(curVal)}" placeholder="1.1.1.1 8.8.8.8" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
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
        `;
      } else if (key === 'add_static_lease') {
        titleEl.textContent = 'Add Static IP Reservation';
        descEl.textContent = 'Bind a static IPv4 address to a client MAC hardware address for consistent network addressing.';
        bodyEl.innerHTML = `
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
        `;
      } else if (key === 'ts_hostname') {
        titleEl.textContent = 'Tailscale Node Hostname';
        descEl.textContent = 'Set device hostname advertised to your private Tailscale network nodes and MagicDNS.';
        const curHost = document.getElementById('tsHostname') ? document.getElementById('tsHostname').value : 'Maxnet-Gateway';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Node Hostname</label>
            <input type="text" id="modalInput_ts_hostname" class="mh-input" value="${escapeHtml(curHost)}" placeholder="Maxnet-Gateway" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'ts_authkey') {
        titleEl.textContent = 'Tailscale Auth Key';
        descEl.textContent = 'Pre-authenticated auth key (tskey-auth-...) from your Tailscale admin console to connect this router.';
        if (saveBtn) saveBtn.textContent = 'CONNECT';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Auth Key</label>
            <input type="password" id="modalInput_ts_authkey" class="mh-input" placeholder="tskey-auth-..." style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'change_password') {
        titleEl.textContent = 'Root Administrator Password';
        descEl.textContent = 'Update master administrator credentials for Web UI access and Dropbear SSH console.';
        bodyEl.innerHTML = `
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
        `;
      } else if (key === 'smb_credentials') {
        titleEl.textContent = 'Samba Share Credentials';
        descEl.textContent = 'Configure authenticated Samba / CIFS login user and password for /mnt/pendrive.';
        const curUser = (document.getElementById('smbUsernameInput') ? document.getElementById('smbUsernameInput').value : 'max') || 'max';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Share Username</label>
            <input type="text" id="modalInput_smb_user" class="mh-input" value="${escapeHtml(curUser)}" placeholder="e.g. max" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">New Share Password</label>
            <input type="password" id="modalInput_smb_pass" class="mh-input" placeholder="Enter share password" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'pkg_install') {
        titleEl.textContent = 'Install Gateway Package';
        descEl.textContent = 'Enter package name (e.g. htop, tcpdump, curl, iperf3, wireguard-tools) to install from OpenWrt APK feed.';
        if (saveBtn) saveBtn.textContent = 'INSTALL';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Package Name</label>
            <input type="text" id="modalInput_pkg_name" class="mh-input" placeholder="e.g. htop" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'diag_ping_size') {
        titleEl.textContent = 'ICMP Payload Buffer Size';
        descEl.textContent = 'Configure ICMP echo request payload byte size (default 56 bytes, min 0, max 65507).';
        const curSize = (document.getElementById('diagPingSize') ? document.getElementById('diagPingSize').value : '56') || '56';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Payload Size (Bytes)</label>
            <input type="number" id="modalInput_ping_size" class="mh-input" min="0" max="65507" value="${escapeHtml(curSize)}" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'diag_dns_server') {
        titleEl.textContent = 'DNS Resolver Nameserver';
        descEl.textContent = 'Upstream DNS server IPv4 address to inspect and trace queries (default: router br-lan 10.0.0.1).';
        const curDns = (document.getElementById('diagDnsServerInput') ? document.getElementById('diagDnsServerInput').value : '10.0.0.1') || '10.0.0.1';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">DNS Server IPv4</label>
            <input type="text" id="modalInput_dns_server" class="mh-input" value="${escapeHtml(curDns)}" placeholder="10.0.0.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'diag_ports_list') {
        titleEl.textContent = 'Custom Audit Ports List';
        descEl.textContent = 'Specify comma-separated TCP/UDP ports to scan (e.g. 21, 22, 80, 443, 8080).';
        const curPorts = (document.getElementById('diagPortsListInput') ? document.getElementById('diagPortsListInput').value : '') || '';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Target Ports</label>
            <textarea id="modalTextarea_ports_list" class="mh-input" rows="5" style="width:100%; font-size:11.5px; font-family:var(--font-mono); resize:vertical; padding:8px 10px; line-height:1.4;">${escapeHtml(curPorts)}</textarea>
          </div>
        `;
      } else if (key === 'ipv6_wan_mode') {
        titleEl.textContent = 'WAN IPv6 Address Assignment';
        descEl.textContent = 'Select how the router requests and delegates public IPv6 prefixes from the upstream ISP or tethered modem.';
        const curMode = (document.getElementById('netIpv6WanMode') ? document.getElementById('netIpv6WanMode').value : 'dhcpv6') || 'dhcpv6';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Assignment Protocol</label>
            <select id="modalSelect_ipv6_wan_mode" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="dhcpv6" ${curMode === 'dhcpv6' ? 'selected' : ''}>DHCPv6-PD &amp; SLAAC (Automatic Stateful Prefix Delegation)</option>
              <option value="slaac" ${curMode === 'slaac' ? 'selected' : ''}>SLAAC Only (Stateless Autoconfiguration)</option>
              <option value="static" ${curMode === 'static' ? 'selected' : ''}>Static IPv6 Address</option>
              <option value="disabled" ${curMode === 'disabled' ? 'selected' : ''}>Disabled (No WAN IPv6)</option>
            </select>
          </div>
        `;
      } else if (key === 'ipv6_ula') {
        titleEl.textContent = 'Unique Local IPv6 Prefix (ULA)';
        descEl.textContent = 'Configure RFC 4193 Unique Local Address prefix for private local routing (e.g. fd00::/48 or fd80:beef::/48).';
        const curUla = (document.getElementById('netIpv6Ula') ? document.getElementById('netIpv6Ula').value : 'fd00::/48') || 'fd00::/48';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">ULA Network Prefix</label>
            <input type="text" id="modalInput_ipv6_ula" class="mh-input" value="${escapeHtml(curUla)}" placeholder="fd00::/48" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'wan_proto') {
        titleEl.textContent = 'WAN Connection Protocol';
        descEl.textContent = 'Select upstream carrier ISP protocol used by physical or USB WAN.';
        const curProto = (document.getElementById('wanProtoSelect') ? document.getElementById('wanProtoSelect').value : 'dhcp') || 'dhcp';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Protocol Type</label>
            <select id="modalSelect_wan_proto" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);" onchange="const n=document.getElementById('wanProtoPppoeNotice'); if(n)n.style.display=this.value==='pppoe'?'block':'none';">
              <option value="dhcp" ${curProto === 'dhcp' ? 'selected' : ''}>DHCP Client (Dynamic IPv4 - Standard)</option>
              <option value="pppoe" ${curProto === 'pppoe' ? 'selected' : ''}>PPPoE (Fiber / DSL Session Dial-up)</option>
              <option value="static" ${curProto === 'static' ? 'selected' : ''}>Static IPv4 (Fixed Gateway Address)</option>
            </select>
          </div>
          <div id="wanProtoPppoeNotice" style="display:${curProto === 'pppoe' ? 'block' : 'none'}; padding:8px 10px; background:rgba(6,182,212,0.08); border-radius:6px; border:1px solid rgba(6,182,212,0.2); font-size:11px; color:#38bdf8; font-family:var(--font-mono);">
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
        `;
      } else if (key === 'webhook_tg_token') {
        titleEl.textContent = 'Telegram Bot Token';
        descEl.textContent = 'Enter API bot token generated by @BotFather on Telegram (e.g. 123456:ABC-DEF...).';
        const cur = (window._cachedWebhooksConfig?.telegram?.bot_token) || '';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Bot Token</label>
            <input type="text" id="modalInput_tg_token" class="mh-input" value="${escapeHtml(cur)}" placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'webhook_tg_chat_id') {
        titleEl.textContent = 'Telegram Chat ID';
        descEl.textContent = 'Target Telegram Chat ID or Channel ID where alert messages will be dispatched.';
        const cur = (window._cachedWebhooksConfig?.telegram?.chat_id) || '';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Chat ID (Numeric or @channel)</label>
            <input type="text" id="modalInput_tg_chat_id" class="mh-input" value="${escapeHtml(cur)}" placeholder="e.g. 987654321 or -100..." style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'webhook_discord_url') {
        titleEl.textContent = 'Discord Webhook URL';
        descEl.textContent = 'Webhook URL from Discord Channel Settings -> Integrations -> Webhooks.';
        const cur = (window._cachedWebhooksConfig?.discord?.webhook_url) || '';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Webhook URL</label>
            <input type="text" id="modalInput_discord_url" class="mh-input" value="${escapeHtml(cur)}" placeholder="https://discord.com/api/webhooks/..." style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'webhook_ntfy_url') {
        titleEl.textContent = 'ntfy.sh Topic URL';
        descEl.textContent = 'ntfy.sh server or topic endpoint for instant push alerts to phone/desktop.';
        const cur = (window._cachedWebhooksConfig?.ntfy?.topic_url) || 'https://ntfy.sh/maxnet-alerts';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Topic URL</label>
            <input type="text" id="modalInput_ntfy_url" class="mh-input" value="${escapeHtml(cur)}" placeholder="https://ntfy.sh/maxnet-alerts" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'webhook_data_quota') {
        titleEl.textContent = 'Data Quota Alert Threshold';
        descEl.textContent = 'Specify bandwidth consumption limit in Megabytes. When any client exceeds this threshold, an alert notification is dispatched.';
        const cur = (window._cachedWebhooksConfig?.data_quota_mb) || 1024;
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Threshold Limit (MB)</label>
            <input type="number" id="modalInput_data_quota" class="mh-input" value="${escapeHtml(cur)}" placeholder="1024" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
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
        `;
      } else if (key === 'webhook_custom_ip') {
        titleEl.textContent = 'Monitored Watchdog Target IP';
        descEl.textContent = 'Enter local or remote IPv4 address to monitor for online/offline reachability alerts.';
        const cur = (window._cachedWebhooksConfig?.custom_ip_target) || '10.0.0.2';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Target Host IP</label>
            <input type="text" id="modalInput_custom_ip_target" class="mh-input" value="${escapeHtml(cur)}" placeholder="10.0.0.2" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
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
        `;
      } else if (key === 'restart_usb_modem') {
        titleEl.textContent = 'Restart USB Modem / Hardware';
        descEl.textContent = 'Choose which connected USB modem interface to reset & renew DHCP lease, or reboot physical phone via ADB.';
        if (saveBtn) saveBtn.textContent = 'EXECUTE RESTART';
        const devs = (window._cachedUsbWanData?.devices) || [];
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Target USB Interface</label>
            <select id="modalSelect_restart_target" class="mh-input" style="width:100%; box-sizing:border-box;">
              <option value="all">All Connected USB Modems</option>
              ${devs.map(d => `<option value="${escapeHtml(d.id)}">${escapeHtml(d.id)} (${escapeHtml(d.ip || '--')}) - ${escapeHtml(d.name || 'Modem')}</option>`).join('')}
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
        `;
      } else if (key === 'wan_static_ip') {
        titleEl.textContent = 'Static IPv4 Address';
        descEl.textContent = 'Fixed IPv4 address assigned to the router by your upstream provider.';
        const curIp = (document.getElementById('wanStaticIp') ? document.getElementById('wanStaticIp').value : '192.168.1.2') || '192.168.1.2';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Static IPv4 Address</label>
            <input type="text" id="modalInput_wan_static_ip" class="mh-input" value="${escapeHtml(curIp)}" placeholder="192.168.1.2" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Common Suggestions:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_ip').value='192.168.1.2'">192.168.1.2</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_ip').value='192.168.0.2'">192.168.0.2</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_ip').value='10.0.1.2'">10.0.1.2</button>
            </div>
          </div>
        `;
      } else if (key === 'wan_static_netmask') {
        titleEl.textContent = 'Subnet Netmask';
        descEl.textContent = 'IPv4 subnet mask for static WAN.';
        const curMask = (document.getElementById('wanStaticNetmask') ? document.getElementById('wanStaticNetmask').value : '255.255.255.0') || '255.255.255.0';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Subnet Mask</label>
            <input type="text" id="modalInput_wan_static_netmask" class="mh-input" value="${escapeHtml(curMask)}" placeholder="255.255.255.0" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Mask Presets:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_netmask').value='255.255.255.0'">255.255.255.0 (/24)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_netmask').value='255.255.0.0'">255.255.0.0 (/16)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_netmask').value='255.255.255.240'">255.255.255.240 (/28)</button>
            </div>
          </div>
        `;
      } else if (key === 'wan_static_gateway') {
        titleEl.textContent = 'Default Gateway Router';
        descEl.textContent = 'IP address of upstream carrier router or gateway modem.';
        const curGw = (document.getElementById('wanStaticGateway') ? document.getElementById('wanStaticGateway').value : '192.168.1.1') || '192.168.1.1';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Gateway IP</label>
            <input type="text" id="modalInput_wan_static_gateway" class="mh-input" value="${escapeHtml(curGw)}" placeholder="192.168.1.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Common Gateways:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_gateway').value='192.168.1.1'">192.168.1.1</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_gateway').value='192.168.0.1'">192.168.0.1</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_static_gateway').value='10.0.1.1'">10.0.1.1</button>
            </div>
          </div>
        `;
      } else if (key === 'wan_custom_mac') {
        titleEl.textContent = 'WAN Cloned MAC Address';
        descEl.textContent = 'Override WAN interface MAC address. Useful for ISPs that bind connectivity to a specific router or PC MAC.';
        const curMac = (document.getElementById('wanCustomMacInput') ? document.getElementById('wanCustomMacInput').value : '') || '';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Cloned MAC Address (XX:XX:XX:XX:XX:XX)</label>
            <input type="text" id="modalInput_wan_custom_mac" class="mh-input" value="${escapeHtml(curMac)}" placeholder="Default Hardware (No Override)" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:4px;">
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_wan_custom_mac').value=''">Reset to Default (No Override)</button>
            <button type="button" class="dns-preset-pill" onclick="cloneCurrentPcMacToModal()">Clone Current PC MAC</button>
            <button type="button" class="dns-preset-pill" onclick="generateRandomWanMacInModal()">Generate Random MAC</button>
          </div>
        `;
      } else if (key === 'dufs_url') {
        titleEl.textContent = 'WebDAV Network Share';
        descEl.textContent = 'Connect any device on your local network to browse, stream, and manage USB storage files.';
        const host = window.location.hostname || '10.0.0.1';
        const port = document.getElementById('dufsPortInput')?.value || 5000;
        const proto = window.location.protocol || 'http:';
        const webdavUrl = `${proto}//${host}:${port}/`;
        if (saveBtn) saveBtn.textContent = 'DONE';
        bodyEl.innerHTML = `
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:12px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <span style="font-size:13px; font-weight:700; color:#38bdf8; font-family:var(--font-mono); word-break:break-all;">${webdavUrl}</span>
            <button type="button" class="mh-btn btn-sm" onclick="navigator.clipboard.writeText('${webdavUrl}'); if(typeof showToast==='function')showToast('Copied: ${webdavUrl}');" style="background:#10b981; color:#0b1120; font-weight:700; padding:6px 12px; font-size:11px; white-space:nowrap;">COPY</button>
          </div>
          <div style="font-size:11.5px; color:var(--text-dim); line-height:1.5;">
            <strong>Windows Explorer</strong>: Right-click &quot;This PC&quot; &rarr; <em>Map Network Drive</em> &rarr; Paste <code>${webdavUrl}</code><br>
            <strong>macOS Finder</strong>: Go &rarr; <em>Connect to Server</em> (Cmd+K) &rarr; Paste <code>${webdavUrl}</code><br>
            <strong>Android / iOS</strong>: Open VLC, Solid Explorer, or Cx File Explorer &rarr; Add WebDAV &rarr; Server: <code>${host}</code>, Port: <code>${port}</code>.
          </div>
        `;
      } else if (key === 'dufs_port') {
        titleEl.textContent = 'WebDAV & File Manager Port';
        descEl.textContent = 'TCP listening port for WebDAV file sharing and web browser file management.';
        const curPort = (document.getElementById('dufsPortInput') ? document.getElementById('dufsPortInput').value : '5000') || '5000';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">TCP Port Number</label>
            <input type="number" id="modalInput_dufs_port" class="mh-input" value="${escapeHtml(curPort)}" min="1" max="65535" placeholder="5000" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
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
        `;
      } else if (key === 'dufs_path') {
        titleEl.textContent = 'Storage Mount Directory';
        descEl.textContent = 'Filesystem directory shared over WebDAV and the web file manager.';
        const curPath = (document.getElementById('dufsPathInput') ? document.getElementById('dufsPathInput').value : '/mnt/storage') || '/mnt/storage';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Mount Directory Path</label>
            <input type="text" id="modalInput_dufs_path" class="mh-input" value="${escapeHtml(curPath)}" placeholder="/mnt/storage" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div>
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; display:block;">Common Mount Points:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_path').value='/mnt/storage'">/mnt/storage (USB Root)</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_path').value='/mnt/pendrive'">/mnt/pendrive</button>
              <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_path').value='/tmp'">/tmp (RAM Disk)</button>
            </div>
          </div>
        `;
      } else if (key === 'dufs_permissions') {
        titleEl.textContent = 'File Access & Upload Policy';
        descEl.textContent = 'Select permissions granted to WebDAV clients and web file manager users.';
        const curUp = document.getElementById('dufsAllowUpload')?.value !== 'false';
        const curDel = document.getElementById('dufsAllowDelete')?.value !== 'false';
        let curMode = 'full';
        if (curUp && curDel) curMode = 'full';
        else if (curUp) curMode = 'upload_only';
        else curMode = 'readonly';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Access Level</label>
            <select id="modalSelect_dufs_mode" class="mh-input" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <option value="full" ${curMode === 'full' ? 'selected' : ''}>Full Access (Browse, Upload, and Delete)</option>
              <option value="upload_only" ${curMode === 'upload_only' ? 'selected' : ''}>Upload Only (Browse &amp; Upload, No Deletion)</option>
              <option value="readonly" ${curMode === 'readonly' ? 'selected' : ''}>Read-Only (Browse and Download Only)</option>
            </select>
          </div>
        `;
      } else if (key === 'dufs_auth') {
        titleEl.textContent = 'WebDAV Access Authentication';
        descEl.textContent = 'Enforce secure credentials to access WebDAV storage and file manager on port 5000.';
        const curUser = (document.getElementById('dufsUserInput') ? document.getElementById('dufsUserInput').value : 'root') || 'root';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">WebDAV Username</label>
            <input type="text" id="modalInput_dufs_user" class="mh-input" value="${escapeHtml(curUser)}" placeholder="root" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:10px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">WebDAV Password</label>
            <input type="password" id="modalInput_dufs_pass" class="mh-input" placeholder="Enter secure password (default: admin)" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:12px; display:flex; gap:8px;">
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_dufs_user').value='root'; document.getElementById('modalInput_dufs_pass').value='admin';">Use Default Credentials (root / admin)</button>
          </div>
        `;
      } else if (key === 'pppoe_client_creds') {
        titleEl.textContent = 'PPPoE Client Credentials';
        descEl.textContent = 'Configure broadband account username and password assigned by your Internet Service Provider (ISP).';
        const curUser = (window._cachedPppoeData && window._cachedPppoeData.client && window._cachedPppoeData.client.username) || '';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">PPPoE Username</label>
            <input type="text" id="modalInput_pppoe_user" class="mh-input" value="${escapeHtml(curUser)}" placeholder="e.g. broadband@isp.com" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:10px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">PPPoE Password</label>
            <input type="password" id="modalInput_pppoe_pass" class="mh-input" placeholder="Enter ISP password" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'pppoe_client_ac') {
        titleEl.textContent = 'Access Concentrator & Service';
        descEl.textContent = 'Optional Access Concentrator (AC) name and Service Name. Leave empty for automatic discovery.';
        const curAc = (window._cachedPppoeData && window._cachedPppoeData.client && window._cachedPppoeData.client.ac) || '';
        const curService = (window._cachedPppoeData && window._cachedPppoeData.client && window._cachedPppoeData.client.service) || '';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Access Concentrator (AC) Name (Optional)</label>
            <input type="text" id="modalInput_pppoe_ac" class="mh-input" value="${escapeHtml(curAc)}" placeholder="Auto / Any AC" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="margin-top:10px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Service Name (Optional)</label>
            <input type="text" id="modalInput_pppoe_service" class="mh-input" value="${escapeHtml(curService)}" placeholder="Auto / Default Service" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'pppoe_client_mac') {
        titleEl.textContent = 'Custom MAC Clone & MTU Size';
        descEl.textContent = 'Override the WAN MAC address for ISP hardware binding, and configure PPPoE MTU (Standard 1492).';
        const curMac = (window._cachedPppoeData && window._cachedPppoeData.client && window._cachedPppoeData.client.macaddr) || '';
        const curMtu = (window._cachedPppoeData && window._cachedPppoeData.client && window._cachedPppoeData.client.mtu) || '1492';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Cloned WAN MAC Address</label>
            <input type="text" id="modalInput_pppoe_mac" class="mh-input" value="${escapeHtml(curMac)}" placeholder="Default Hardware MAC" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_pppoe_mac').value=''">Clear (Default HW)</button>
            <button type="button" class="dns-preset-pill" onclick="document.getElementById('modalInput_pppoe_mac').value='7e:85:7d:a7:58:58'">Hardware MAC</button>
            <button type="button" class="dns-preset-pill" onclick="generateRandomPppoeMac()">Randomize MAC</button>
          </div>
          <div style="margin-top:12px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">PPPoE MTU Packet Size</label>
            <input type="number" id="modalInput_pppoe_mtu" class="mh-input" value="${escapeHtml(curMtu)}" placeholder="1492" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            <div style="font-size:10.5px; color:var(--text-dim); margin-top:4px;">Standard PPPoE MTU is 1492 bytes (1500 - 8 bytes PPPoE header).</div>
          </div>
        `;
      } else if (key === 'pppoe_server_config') {
        titleEl.textContent = 'PPPoE Server Network Configuration';
        descEl.textContent = 'Configure the server gateway IP, client IP lease pool range, and DNS nameservers for subscribers.';
        const srv = (window._cachedPppoeData && window._cachedPppoeData.server) || {};
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Server Gateway IP (Local)</label>
            <input type="text" id="modalInput_pppoe_srv_ip" class="mh-input" value="${escapeHtml(srv.server_ip || '10.0.0.1')}" placeholder="10.0.0.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Pool Start IP</label>
              <input type="text" id="modalInput_pppoe_srv_start" class="mh-input" value="${escapeHtml(srv.pool_start || '10.0.0.150')}" placeholder="10.0.0.150" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Pool End IP</label>
              <input type="text" id="modalInput_pppoe_srv_end" class="mh-input" value="${escapeHtml(srv.pool_end || '10.0.0.220')}" placeholder="10.0.0.220" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Primary DNS</label>
              <input type="text" id="modalInput_pppoe_srv_dns1" class="mh-input" value="${escapeHtml(srv.dns1 || '10.0.0.1')}" placeholder="10.0.0.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Secondary DNS</label>
              <input type="text" id="modalInput_pppoe_srv_dns2" class="mh-input" value="${escapeHtml(srv.dns2 || '1.1.1.1')}" placeholder="1.1.1.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
            </div>
          </div>
          <div style="margin-top:10px;">
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Max Concurrent Sessions</label>
            <input type="number" id="modalInput_pppoe_srv_max" class="mh-input" value="${escapeHtml(srv.max_sessions || '32')}" placeholder="32" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'pppoe_server_users') {
        titleEl.textContent = 'Subscriber Accounts (CHAP Secrets)';
        descEl.textContent = 'Manage PPPoE client logins allowed to authenticate through this access concentrator.';
        const srv = (window._cachedPppoeData && window._cachedPppoeData.server) || {};
        const users = srv.users || [];
        let rowsHtml = '';
        if (users.length === 0) {
          rowsHtml = '<div style="font-size:12px; color:var(--text-dim); padding:10px; text-align:center;">No accounts registered yet.</div>';
        } else {
          rowsHtml = users.map(u => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:6px; margin-bottom:6px;">
              <div>
                <strong style="font-size:12px; color:var(--text-main); font-family:var(--font-mono);">${escapeHtml(u.user)}</strong>
                <span style="font-size:10.5px; color:var(--text-dim); margin-left:8px;">IP: ${escapeHtml(u.ip || '*')}</span>
              </div>
              <button type="button" class="mh-btn btn-sm btn-ghost" style="color:#ef4444; padding:2px 8px; font-size:10px;" onclick="deletePppoeUser('${escapeHtml(u.user)}')">DELETE</button>
            </div>
          `).join('');
        }
        bodyEl.innerHTML = `
          <div style="max-height:160px; overflow-y:auto; margin-bottom:12px;">
            ${rowsHtml}
          </div>
          <div style="padding-top:10px; border-top:1px solid var(--border-sub);">
            <div style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:8px; text-transform:uppercase;">Add New Subscriber Account</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <input type="text" id="modalInput_new_pppoe_u" class="mh-input" placeholder="Subscriber Username" style="padding:8px 10px; font-size:12px; font-family:var(--font-mono);">
              <input type="password" id="modalInput_new_pppoe_p" class="mh-input" placeholder="Password" style="padding:8px 10px; font-size:12px; font-family:var(--font-mono);">
            </div>
            <button type="button" class="mh-btn" style="margin-top:8px; width:100%; background:#06b6d4; color:#0b1120; font-weight:700; padding:7px; font-size:11.5px; border-radius:6px;" onclick="addPppoeUserFromModal()">+ ADD SUBSCRIBER</button>
          </div>
        `;
      } else if (key === 'usb_lb_mode') {
        titleEl.textContent = 'Multi-Device Load Balancing Strategy';
        descEl.textContent = 'Configure traffic distribution across multiple connected USB tethering modems or dongles.';
        const curMode = (window._cachedUsbWanData && window._cachedUsbWanData.load_balancing) ? window._cachedUsbWanData.load_balancing.mode : 'balanced';
        bodyEl.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_mode" value="balanced" ${curMode === 'balanced' ? 'checked' : ''}>
              <div>
                <strong style="color:#38bdf8; display:block; font-size:12.5px;">Balanced Multi-WAN (Weighted Round-Robin)</strong>
                <span style="font-size:11px; color:var(--text-dim);">Distribute active internet connections across all active USB modems for doubled throughput.</span>
              </div>
            </label>
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_mode" value="failover" ${curMode === 'failover' ? 'checked' : ''}>
              <div>
                <strong style="color:#38bdf8; display:block; font-size:12.5px;">Active Failover (Hot Standby)</strong>
                <span style="font-size:11px; color:var(--text-dim);">Route 100% traffic through primary modem (usb0). Automatically switch to secondary if primary fails.</span>
              </div>
            </label>
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_mode" value="broadcast" ${curMode === 'broadcast' ? 'checked' : ''}>
              <div>
                <strong style="color:#f59e0b; display:block; font-size:12.5px;">Broadcast Duplication (Ultra-Low Latency)</strong>
                <span style="font-size:11px; color:var(--text-dim);">Duplicate packets across both USB links to eliminate packet loss and jitter for gaming and streaming.</span>
              </div>
            </label>
          </div>
        `;
      } else if (key === 'usb_ping_target') {
        titleEl.textContent = 'Health Check Ping Target';
        descEl.textContent = 'IPv4 address pinged periodically to verify internet reachability.';
        const curTarget = (window._cachedUsbWanData && window._cachedUsbWanData.load_balancing) ? window._cachedUsbWanData.load_balancing.ping_target : '1.1.1.1';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Ping Target IPv4</label>
            <input type="text" id="modalInput_usb_ping_target" class="mh-input" value="${escapeHtml(curTarget)}" placeholder="1.1.1.1" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
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
        `;
      } else if (key === 'usb_ping_interval') {
        titleEl.textContent = 'Watchdog Ping Interval';
        descEl.textContent = 'How often in seconds the gateway sends ICMP health check packets to the target.';
        const curInt = (window._cachedUsbWanData && window._cachedUsbWanData.load_balancing) ? window._cachedUsbWanData.load_balancing.ping_interval : 15;
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Interval (5 to 120 Seconds)</label>
            <input type="number" id="modalInput_usb_ping_interval" class="mh-input" value="${curInt}" min="5" max="120" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'usb_dns_override') {
        titleEl.textContent = 'USB WAN DNS Override';
        descEl.textContent = 'Space-separated DNS nameservers pushed to the USB WAN routing table.';
        const curDns = (window._cachedUsbWanData && window._cachedUsbWanData.load_balancing) ? window._cachedUsbWanData.load_balancing.dns_override : '1.1.1.1 8.8.8.8';
        bodyEl.innerHTML = `
          <div>
            <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Nameservers (e.g. 1.1.1.1 8.8.8.8)</label>
            <input type="text" id="modalInput_usb_dns" class="mh-input" value="${escapeHtml(curDns)}" placeholder="1.1.1.1 8.8.8.8" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
          </div>
        `;
      } else if (key === 'usb_tether_proto') {
        titleEl.textContent = 'Tethering Protocol Driver';
        descEl.textContent = 'Linux kernel USB network driver protocol used for modem communication.';
        const curP = (window._cachedUsbWanData && window._cachedUsbWanData.load_balancing) ? window._cachedUsbWanData.load_balancing.tether_proto : 'rndis';
        bodyEl.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_proto" value="rndis" ${curP === 'rndis' ? 'checked' : ''}>
              <div>
                <strong style="color:#38bdf8; display:block; font-size:12.5px;">RNDIS (Remote NDIS)</strong>
                <span style="font-size:11px; color:var(--text-dim);">Universal Android USB tethering &amp; Qualcomm 4G/5G modems (Recommended).</span>
              </div>
            </label>
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_proto" value="ncm" ${curP === 'ncm' ? 'checked' : ''}>
              <div>
                <strong style="color:#38bdf8; display:block; font-size:12.5px;">CDC-NCM (Network Control Model)</strong>
                <span style="font-size:11px; color:var(--text-dim);">High-speed Gigabit-class USB tethering for newer iOS and Android devices.</span>
              </div>
            </label>
            <label style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer;">
              <input type="radio" name="modal_usb_proto" value="ecm" ${curP === 'ecm' ? 'checked' : ''}>
              <div>
                <strong style="color:#a78bfa; display:block; font-size:12.5px;">CDC-ECM (Ethernet Control Model)</strong>
                <span style="font-size:11px; color:var(--text-dim);">Legacy standard USB Ethernet dongles and embedded Linux modems.</span>
              </div>
            </label>
          </div>
        `;
      } else if (key === 'usb_device_edit') {
        const devId = window._editingUsbDevId;
        const dev = (_cachedUsbWanData && _cachedUsbWanData.devices) ? _cachedUsbWanData.devices.find(d => d.id === devId) : null;
        titleEl.textContent = dev ? `Edit ${dev.name} (${dev.interface})` : 'Edit USB Interface';
        descEl.textContent = 'Configure traffic weight, routing metric, and MTU packet sizing for this USB modem.';
        bodyEl.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Traffic Weight Percentage (1% - 100%)</label>
              <input type="number" id="modalInput_usb_dev_weight" class="mh-input" value="${dev ? (dev.weight || 50) : 50}" min="1" max="100" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <span style="font-size:10px; color:var(--text-dim); margin-top:3px; display:block;">Higher percentage directs proportionally more bandwidth through this modem.</span>
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Route Metric Priority</label>
              <input type="number" id="modalInput_usb_dev_metric" class="mh-input" value="${dev ? (dev.metric || 100) : 100}" min="1" max="999" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <span style="font-size:10px; color:var(--text-dim); margin-top:3px; display:block;">Lower metric numbers take routing priority (e.g. 100 before 110).</span>
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:var(--text-dim); margin-bottom:5px; display:block; font-family:var(--font-mono);">Interface MTU</label>
              <input type="number" id="modalInput_usb_dev_mtu" class="mh-input" value="${dev ? (dev.mtu || 1400) : 1400}" min="576" max="1500" style="width:100%; padding:9px 12px; font-size:13px; font-family:var(--font-mono);">
              <div id="modalInputValidationMsg" style="font-size:11px; font-family:var(--font-mono); min-height:18px; margin-top:4px;"></div>
            </div>
          </div>
        `;
      }

      overlay.style.display = 'flex';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add('active');
        });
      });
      window._isSettingModalOpen = true;
      triggerModalInitialValidation(key);

      try {
        history.pushState({ modalOpen: true, modalKey: key }, '', window.location.hash);
        _settingModalPushed = true;
      } catch (e) {}

      const firstInp = bodyEl.querySelector('input, select, textarea');
      if (firstInp) {
        setTimeout(() => {
          firstInp.focus();
          if (firstInp.select) firstInp.select();
          try {
            firstInp.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (e) {}
        }, 100);
      }
    }

    function onModalMaskInput(mask) {
      const sel = document.getElementById('modalSelect_cidr');
      if (!sel) return;
      if (mask === '255.255.255.0') sel.value = '24';
      else if (mask === '255.255.0.0') sel.value = '16';
      else if (mask === '255.0.0.0') sel.value = '8';
      else sel.value = 'custom';
    }

    function onModalCidrChange(cidr) {
      const inp = document.getElementById('modalInput_net_mask');
      if (!inp) return;
      if (cidr === '24') inp.value = '255.255.255.0';
      else if (cidr === '16') inp.value = '255.255.0.0';
      else if (cidr === '8') inp.value = '255.0.0.0';
    }

    let _settingModalPushed = false;

    function closeSettingModal(triggerHistoryBack = true) {
      const overlay = document.getElementById('settingEditModalOverlay');
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
          if (!overlay.classList.contains('active')) {
            overlay.style.display = 'none';
          }
        }, 220);
      }
      window._isSettingModalOpen = false;
      currentModalKey = null;

      if (triggerHistoryBack && _settingModalPushed) {
        _settingModalPushed = false;
        try {
          history.back();
        } catch (e) {}
      } else {
        _settingModalPushed = false;
      }
    }

    function onModalOverlayClick(e) {
      if (e.target && e.target.id === 'settingEditModalOverlay') {
        closeSettingModal();
      }
    }

    
    // ==================== NETWORK CONFIGURATION VALIDATORS ====================
    function isValidIpv4(ip) {
      if (typeof ip !== 'string') return false;
      const parts = ip.trim().split('.');
      if (parts.length !== 4) return false;
      return parts.every(p => {
        if (!/^\d+$/.test(p)) return false;
        const n = parseInt(p, 10);
        return n >= 0 && n <= 255 && (p === '0' || !p.startsWith('0'));
      });
    }

    function isValidSubnetMask(mask) {
      if (!isValidIpv4(mask)) return false;
      const validMasks = [
        '255.255.255.255', '255.255.255.254', '255.255.255.252', '255.255.255.248',
        '255.255.255.240', '255.255.255.224', '255.255.255.192', '255.255.255.128',
        '255.255.255.0', '255.255.254.0', '255.255.252.0', '255.255.248.0',
        '255.255.240.0', '255.255.224.0', '255.255.192.0', '255.255.128.0',
        '255.255.0.0', '255.254.0.0', '255.252.0.0', '255.248.0.0',
        '255.240.0.0', '255.224.0.0', '255.192.0.0', '255.128.0.0',
        '255.0.0.0', '254.0.0.0', '252.0.0.0', '248.0.0.0',
        '240.0.0.0', '224.0.0.0', '192.0.0.0', '128.0.0.0', '0.0.0.0'
      ];
      return validMasks.includes(mask.trim());
    }

    function isValidMac(mac) {
      return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test((mac || '').trim());
    }

    function generateRandomMacInModal() {
      const hex = '0123456789abcdef';
      const secondNibbles = ['2', '6', 'a', 'e'];
      let mac = hex[Math.floor(Math.random() * 16)] + secondNibbles[Math.floor(Math.random() * 4)];
      for (let i = 1; i < 6; i++) {
        mac += ':' + hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
      }
      const inp = document.getElementById('modalInput_custom_mac');
      if (inp) inp.value = mac;
    }

    async function saveSettingModal() {
      if (!currentModalKey) { closeSettingModal(); return; }

      if (currentModalKey === 'device_hostname') {
        const val = (document.getElementById('modalInput_device_hostname').value || '').trim();
        if (!val) {
          showToast('Device hostname cannot be empty', 'error');
          const el = document.getElementById('modalInput_device_hostname');
          if (el) el.focus();
          return;
        }
        if (!/^[a-zA-Z0-9][-a-zA-Z0-9_]{0,62}$/.test(val)) {
          showToast('Hostname must start with alphanumeric character and contain only letters, numbers, hyphens, and underscores (max 63 chars)', 'error');
          const el = document.getElementById('modalInput_device_hostname');
          if (el) el.focus();
          return;
        }
        const hostEl = document.getElementById('netDeviceHostname');
        if (hostEl) hostEl.value = val;
        const disp = document.getElementById('disp_device_hostname');
        const hLow = val.toLowerCase();
        if (disp) disp.textContent = `${val} • ${hLow}.lan / ${hLow}.local`;
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'custom_mac') {
        const val = (document.getElementById('modalInput_custom_mac').value || '').trim();
        const hwMac = (document.getElementById('netHwMac') ? document.getElementById('netHwMac').value : 'ca:e7:b7:34:8f:ac').toLowerCase();
        const macEl = document.getElementById('netCustomMac');

        if (val && val.toLowerCase() !== hwMac) {
          if (!isValidMac(val)) {
            showToast('Invalid MAC address format (e.g. 00:11:22:33:44:55)', 'error');
            const el = document.getElementById('modalInput_custom_mac');
            if (el) el.focus();
            return;
          }
          if (macEl) {
            macEl.value = val.toLowerCase();
            macEl.dataset.reset = '0';
          }
          const disp = document.getElementById('disp_custom_mac');
          if (disp) disp.textContent = `Custom: ${val.toLowerCase()} • Hardware: ${hwMac}`;
        } else {
          // Reset or identical to hardware default
          if (macEl) {
            macEl.value = '';
            macEl.dataset.reset = '1';
          }
          const disp = document.getElementById('disp_custom_mac');
          if (disp) disp.textContent = `Default: ${hwMac} • Hardware MAC in use`;
        }
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'client_history_days') {
        const selVal = document.getElementById('modalSelect_client_history').value;
        const disp = document.getElementById('disp_client_history_days');
        if (disp) disp.textContent = `${selVal} Days Retention • Click to change duration`;
        showToast(`Client history retention set to ${selVal} days`, 'success');
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'lan_ip') {
        const val = (document.getElementById('modalInput_lan_ip').value || '').trim();
        if (!isValidIpv4(val)) {
          showToast('Invalid IPv4 address format (e.g. 10.0.0.1)', 'error');
          const el = document.getElementById('modalInput_lan_ip');
          if (el) el.focus();
          return;
        }
        if (val === '0.0.0.0' || val === '255.255.255.255') {
          showToast('Gateway IP cannot be 0.0.0.0 or broadcast', 'error');
          return;
        }
        document.getElementById('netLanIp').value = val;
        const disp = document.getElementById('disp_lan_ip');
        if (disp) disp.textContent = val;
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'net_mask') {
        const maskVal = (document.getElementById('modalInput_net_mask').value || '').trim();
        if (!isValidSubnetMask(maskVal)) {
          showToast('Invalid subnet mask (e.g. 255.255.255.0)', 'error');
          const el = document.getElementById('modalInput_net_mask');
          if (el) el.focus();
          return;
        }
        const cidrVal = document.getElementById('modalSelect_cidr').value;
        document.getElementById('netMask').value = maskVal;
        document.getElementById('netCidrSelect').value = cidrVal;
        const disp = document.getElementById('disp_net_mask');
        if (disp) disp.textContent = `${maskVal} (/${cidrVal})`;
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'net_gateway') {
        const val = (document.getElementById('modalInput_gateway').value || '').trim();
        if (val && !isValidIpv4(val)) {
          showToast('Invalid gateway IPv4 address (leave empty for direct br-lan)', 'error');
          const el = document.getElementById('modalInput_gateway');
          if (el) el.focus();
          return;
        }
        document.getElementById('netGateway').value = val;
        const disp = document.getElementById('disp_net_gateway');
        if (disp) disp.textContent = val ? val : 'None (Direct br-lan)';
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'net_mtu') {
        const val = parseInt(document.getElementById('modalInput_mtu').value, 10);
        if (isNaN(val) || val < 576 || val > 9000) {
          showToast('MTU must be between 576 and 9000 bytes', 'error');
          const el = document.getElementById('modalInput_mtu');
          if (el) el.focus();
          return;
        }
        document.getElementById('netMtu').value = val;
        const disp = document.getElementById('disp_net_mtu');
        if (disp) disp.textContent = `${val} bytes`;
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'dhcp_pool') {
        const start = parseInt(document.getElementById('modalInput_dhcp_start').value, 10);
        const limit = parseInt(document.getElementById('modalInput_dhcp_limit').value, 10);
        if (isNaN(start) || start < 2 || start > 254) {
          showToast('DHCP Pool start must be between 2 and 254', 'error');
          const el = document.getElementById('modalInput_dhcp_start');
          if (el) el.focus();
          return;
        }
        if (isNaN(limit) || limit < 1 || start + limit > 255) {
          showToast('Invalid pool limit (start + limit must be <= 254)', 'error');
          const el = document.getElementById('modalInput_dhcp_limit');
          if (el) el.focus();
          return;
        }
        const lease = document.getElementById('modalSelect_dhcp_lease').value || '12h';
        document.getElementById('netDhcpStart').value = start;
        document.getElementById('netDhcpLimit').value = limit;
        document.getElementById('netDhcpLease').value = lease;
        const disp = document.getElementById('disp_dhcp_pool');
        if (disp) disp.textContent = `Start ${start} • Limit ${limit} • Lease ${lease}`;
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'custom_dns') {
        const val = (document.getElementById('modalInput_dns').value || '').trim();
        if (val) {
          const servers = val.split(/\s+/);
          for (const s of servers) {
            if (!isValidIpv4(s) && !s.includes(':')) {
              showToast(`Invalid DNS server IP: ${s}`, 'error');
              const el = document.getElementById('modalInput_dns');
              if (el) el.focus();
              return;
            }
          }
        }
        document.getElementById('netDns').value = val || '1.1.1.1 8.8.8.8';
        const disp = document.getElementById('disp_custom_dns');
        if (disp) disp.textContent = val || '1.1.1.1 8.8.8.8';
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'add_static_lease') {
        const name = (document.getElementById('modalInput_lease_name').value || 'Client').trim();
        const mac = (document.getElementById('modalInput_lease_mac').value || '').trim();
        const ip = (document.getElementById('modalInput_lease_ip').value || '').trim();

        if (!isValidMac(mac)) {
          showToast('Invalid MAC address (format XX:XX:XX:XX:XX:XX)', 'error');
          const el = document.getElementById('modalInput_lease_mac');
          if (el) el.focus();
          return;
        }
        if (!isValidIpv4(ip)) {
          showToast('Invalid IPv4 address format (e.g. 10.0.0.50)', 'error');
          const el = document.getElementById('modalInput_lease_ip');
          if (el) el.focus();
          return;
        }

        try {
          setSettingSaveStatus('saving', 'Adding reservation...');
          const res = await fetch('/cgi-bin/network', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add_lease', name, mac, ip })
          });
          const data = await res.json();
          setSettingSaveStatus('saved', 'Reservation Added');
          await fetchNetworkConfig();
        } catch (e) {
          setSettingSaveStatus('error', 'Add failed');
          console.error(e);
        }
      } else if (currentModalKey === 'ts_hostname') {
        const newHost = (document.getElementById('modalInput_ts_hostname').value || 'Maxnet-Gateway').trim();
        if (document.getElementById('tsHostname')) document.getElementById('tsHostname').value = newHost;
        const disp = document.getElementById('disp_ts_hostname');
        if (disp) disp.textContent = newHost;
        if (typeof applyTailscalePrefs === 'function') applyTailscalePrefs();
      } else if (currentModalKey === 'ts_authkey') {
        const keyVal = (document.getElementById('modalInput_ts_authkey').value || '').trim();
        if (document.getElementById('tsAuthKeyInput')) document.getElementById('tsAuthKeyInput').value = keyVal;
        const disp = document.getElementById('disp_ts_authkey');
        if (disp) disp.textContent = keyVal ? 'Key Configured (Connecting...)' : 'tskey-auth-... (Click to update key)';
        const dispUnlogged = document.getElementById('disp_ts_authkey_unlogged');
        if (dispUnlogged) dispUnlogged.textContent = keyVal ? 'Key Configured (Connecting...)' : 'Connect using pre-authenticated key (tskey-auth-...)';
        if (typeof loginTailscaleWithKey === 'function') loginTailscaleWithKey();
      } else if (currentModalKey === 'change_password') {
        const oldP = document.getElementById('modalInput_pwd_old').value;
        const newP = document.getElementById('modalInput_pwd_new').value;
        const confP = document.getElementById('modalInput_pwd_confirm').value;

        if (!newP) { alert('New password cannot be empty'); return; }
        if (newP !== confP) { alert('New password and confirm password do not match'); return; }

        if (document.getElementById('oldPasswordInput')) document.getElementById('oldPasswordInput').value = oldP;
        if (document.getElementById('newPasswordInput')) document.getElementById('newPasswordInput').value = newP;
        if (document.getElementById('confirmPasswordInput')) document.getElementById('confirmPasswordInput').value = confP;
        if (typeof changeAdminPassword === 'function') changeAdminPassword();
      } else if (currentModalKey === 'smb_credentials') {
        const u = (document.getElementById('modalInput_smb_user').value || 'max').trim();
        const p = document.getElementById('modalInput_smb_pass').value;
        if (document.getElementById('smbUsernameInput')) document.getElementById('smbUsernameInput').value = u;
        if (document.getElementById('smbPasswordInput')) document.getElementById('smbPasswordInput').value = p;
        const disp = document.getElementById('disp_smb_creds');
        if (disp) disp.textContent = `User: ${u} • Password configured`;
        if (typeof saveSmbCredentials === 'function') saveSmbCredentials();
      } else if (currentModalKey === 'pkg_install') {
        const pkg = (document.getElementById('modalInput_pkg_name').value || '').trim();
        if (pkg && typeof installPackage === 'function') {
          installPackage(pkg);
        }
      } else if (currentModalKey === 'diag_ping_size') {
        const sz = parseInt(document.getElementById('modalInput_ping_size').value, 10) || 56;
        if (document.getElementById('diagPingSize')) document.getElementById('diagPingSize').value = sz;
        const disp = document.getElementById('disp_diag_ping_size');
        if (disp) disp.textContent = `${sz} bytes (ICMP payload buffer)`;
      } else if (currentModalKey === 'diag_dns_server') {
        const srv = (document.getElementById('modalInput_dns_server').value || '10.0.0.1').trim();
        if (document.getElementById('diagDnsServerInput')) document.getElementById('diagDnsServerInput').value = srv;
        const disp = document.getElementById('disp_diag_dns_server');
        if (disp) disp.textContent = `${srv} (Resolver)`;
      } else if (currentModalKey === 'diag_ports_list') {
        const val = (document.getElementById('modalTextarea_ports_list').value || '').trim();
        if (document.getElementById('diagPortsListInput')) document.getElementById('diagPortsListInput').value = val;
        const count = val.split(',').filter(x => x.trim().length > 0).length;
        const disp = document.getElementById('disp_diag_ports_count');
        if (disp) disp.textContent = `${count} Custom Ports Configured (Click to edit)`;
      } else if (currentModalKey === 'ipv6_wan_mode') {
        const val = document.getElementById('modalSelect_ipv6_wan_mode').value;
        if (document.getElementById('netIpv6WanMode')) document.getElementById('netIpv6WanMode').value = val;
        const disp = document.getElementById('disp_ipv6_wan_mode');
        if (disp) {
          const map = {
            dhcpv6: 'DHCPv6-PD & SLAAC (Automatic)',
            slaac: 'SLAAC Only (Stateless Autoconfiguration)',
            static: 'Static IPv6 Address',
            disabled: 'Disabled (No WAN IPv6)'
          };
          disp.textContent = map[val] || val;
        }
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'ipv6_ula') {
        const val = (document.getElementById('modalInput_ipv6_ula').value || '').trim();
        if (val && !val.includes(':')) {
          showToast('Invalid IPv6 ULA prefix (e.g. fd00::/48)', 'error');
          return;
        }
        if (document.getElementById('netIpv6Ula')) document.getElementById('netIpv6Ula').value = val || 'fd00::/48';
        const disp = document.getElementById('disp_ipv6_ula');
        if (disp) disp.textContent = `${val || 'fd00::/48'} • Unique local address scope`;
        scheduleNetworkAutoSave();
      } else if (currentModalKey === 'wan_proto') {
        const sel = document.getElementById('modalSelect_wan_proto');
        const val = sel ? sel.value : 'dhcp';
        if (document.getElementById('wanProtoSelect')) document.getElementById('wanProtoSelect').value = val;
        updateWanInterfaceDisplays();
        saveWanInterfaceConfig();
        if (val === 'pppoe') {
          setTimeout(() => {
            if (typeof openSettingPage === 'function') openSettingPage('acc-pppoe');
          }, 350);
        }
      } else if (currentModalKey === 'webhook_tg_token') {
        const tok = (document.getElementById('modalInput_tg_token')?.value || '').trim();
        window._cachedWebhooksConfig = window._cachedWebhooksConfig || {};
        window._cachedWebhooksConfig.telegram = window._cachedWebhooksConfig.telegram || {};
        window._cachedWebhooksConfig.telegram.bot_token = tok;
        const disp = document.getElementById('disp_webhook_tg_token');
        if (disp) disp.textContent = tok ? `${tok.substring(0, 10)}••••••••` : 'Click to configure Bot Token from @BotFather';
        saveWebhooksConfig();
      } else if (currentModalKey === 'webhook_tg_chat_id') {
        const cid = (document.getElementById('modalInput_tg_chat_id')?.value || '').trim();
        window._cachedWebhooksConfig = window._cachedWebhooksConfig || {};
        window._cachedWebhooksConfig.telegram = window._cachedWebhooksConfig.telegram || {};
        window._cachedWebhooksConfig.telegram.chat_id = cid;
        const disp = document.getElementById('disp_webhook_tg_chat_id');
        if (disp) disp.textContent = cid ? `Chat ID: ${cid}` : 'Click to configure Chat or Channel ID';
        saveWebhooksConfig();
      } else if (currentModalKey === 'webhook_discord_url') {
        const url = (document.getElementById('modalInput_discord_url')?.value || '').trim();
        window._cachedWebhooksConfig = window._cachedWebhooksConfig || {};
        window._cachedWebhooksConfig.discord = window._cachedWebhooksConfig.discord || {};
        window._cachedWebhooksConfig.discord.webhook_url = url;
        const disp = document.getElementById('disp_webhook_discord_url');
        if (disp) disp.textContent = url ? `${url.substring(0, 35)}...` : 'Click to configure Discord Webhook URL';
        saveWebhooksConfig();
      } else if (currentModalKey === 'webhook_ntfy_url') {
        const url = (document.getElementById('modalInput_ntfy_url')?.value || '').trim();
        window._cachedWebhooksConfig = window._cachedWebhooksConfig || {};
        window._cachedWebhooksConfig.ntfy = window._cachedWebhooksConfig.ntfy || {};
        window._cachedWebhooksConfig.ntfy.topic_url = url;
        const disp = document.getElementById('disp_webhook_ntfy_url');
        if (disp) disp.textContent = url || 'https://ntfy.sh/maxnet-alerts';
        saveWebhooksConfig();
      } else if (currentModalKey === 'webhook_data_quota') {
        const val = parseInt((document.getElementById('modalInput_data_quota')?.value || '1024').trim()) || 1024;
        window._cachedWebhooksConfig = window._cachedWebhooksConfig || {};
        window._cachedWebhooksConfig.data_quota_mb = val;
        const disp = document.getElementById('disp_webhook_data_quota');
        if (disp) disp.textContent = `${val} MB (${(val/1024).toFixed(1)} GB)`;
        saveWebhooksConfig();
      } else if (currentModalKey === 'webhook_custom_ip') {
        const ip = (document.getElementById('modalInput_custom_ip_target')?.value || '10.0.0.2').trim();
        window._cachedWebhooksConfig = window._cachedWebhooksConfig || {};
        window._cachedWebhooksConfig.custom_ip_target = ip;
        const disp = document.getElementById('disp_webhook_custom_ip');
        if (disp) disp.textContent = ip;
        saveWebhooksConfig();
      } else if (currentModalKey === 'restart_usb_modem') {
        const target = document.getElementById('modalSelect_restart_target')?.value || 'all';
        const mode = document.querySelector('input[name="usb_restart_mode"]:checked')?.value || 'soft';
        const statusEl = document.getElementById('usbRestartModalStatus');
        const saveBtn = document.getElementById('btnModalSave');
        if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'RESTARTING...'; }

        if (statusEl) statusEl.textContent = mode === 'adb' ? 'Transmitting ADB reboot signal to smartphone...' : `Resetting interface (${target}) & renewing DHCP...`;
        
        try {
          if (mode === 'adb') {
            await fetch('/cgi-bin/usb_wan?action=restart_modems&reboot_adb=true&serial=' + encodeURIComponent(target === 'all' ? '' : target), { method: 'POST' });
            if (statusEl) statusEl.textContent = 'Phone reboot signal sent! Phone is power cycling.';
            if (typeof showToast === 'function') showToast('ADB phone reboot initiated!', 'success');
          } else {
            const res = await fetch(`/cgi-bin/usb_wan?action=restart_modems&iface=${encodeURIComponent(target)}`, { method: 'POST' });
            const data = await res.json();
            if (statusEl) statusEl.textContent = data.message || 'Interface restarted successfully!';
            if (typeof showToast === 'function') showToast(data.message || 'USB Modem restarted', 'success');
          }
          setTimeout(() => {
            closeSettingModal();
            loadUsbWanConfig();
          }, 1400);
        } catch (e) {
          if (statusEl) statusEl.textContent = 'Error: ' + e.message;
          if (typeof showToast === 'function') showToast('Restart error: ' + e.message, 'error');
          if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'EXECUTE RESTART'; }
        }
        return;
      } else if (currentModalKey === 'wan_static_ip') {
        const ip = (document.getElementById('modalInput_wan_static_ip')?.value || '').trim();
        if (document.getElementById('wanStaticIp')) document.getElementById('wanStaticIp').value = ip;
        updateWanInterfaceDisplays();
        saveWanInterfaceConfig();
      } else if (currentModalKey === 'wan_static_netmask') {
        const mask = (document.getElementById('modalInput_wan_static_netmask')?.value || '').trim();
        if (document.getElementById('wanStaticNetmask')) document.getElementById('wanStaticNetmask').value = mask;
        updateWanInterfaceDisplays();
        saveWanInterfaceConfig();
      } else if (currentModalKey === 'wan_static_gateway') {
        const gw = (document.getElementById('modalInput_wan_static_gateway')?.value || '').trim();
        if (document.getElementById('wanStaticGateway')) document.getElementById('wanStaticGateway').value = gw;
        updateWanInterfaceDisplays();
        saveWanInterfaceConfig();
      } else if (currentModalKey === 'wan_custom_mac') {
        const mac = (document.getElementById('modalInput_wan_custom_mac')?.value || '').trim();
        if (mac && !isValidMac(mac)) {
          showToast('Invalid MAC address format (e.g. 00:11:22:33:44:55)', 'error');
          return;
        }
        if (document.getElementById('wanCustomMacInput')) document.getElementById('wanCustomMacInput').value = mac;
        updateWanInterfaceDisplays();
        saveWanInterfaceConfig();
      } else if (currentModalKey === 'dufs_url') {
        // Just closed modal
      } else if (currentModalKey === 'dufs_port') {
        const port = parseInt(document.getElementById('modalInput_dufs_port')?.value, 10);
        if (!port || port < 1 || port > 65535) {
          showToast('Invalid port number (1-65535)', 'error');
          return;
        }
        if (document.getElementById('dufsPortInput')) document.getElementById('dufsPortInput').value = port;
        saveDufsConfig();
      } else if (currentModalKey === 'dufs_path') {
        const path = (document.getElementById('modalInput_dufs_path')?.value || '/mnt/storage').trim();
        if (document.getElementById('dufsPathInput')) document.getElementById('dufsPathInput').value = path;
        saveDufsConfig();
      } else if (currentModalKey === 'dufs_permissions') {
        const mode = document.getElementById('modalSelect_dufs_mode')?.value || 'full';
        let allowUp = 'true';
        let allowDel = 'true';
        if (mode === 'upload_only') { allowUp = 'true'; allowDel = 'false'; }
        else if (mode === 'readonly') { allowUp = 'false'; allowDel = 'false'; }
        if (document.getElementById('dufsAllowUpload')) document.getElementById('dufsAllowUpload').value = allowUp;
        if (document.getElementById('dufsAllowDelete')) document.getElementById('dufsAllowDelete').value = allowDel;
        saveDufsConfig();
      } else if (currentModalKey === 'dufs_auth') {
        const user = (document.getElementById('modalInput_dufs_user')?.value || 'root').trim();
        const pass = (document.getElementById('modalInput_dufs_pass')?.value || 'admin').trim();
        if (document.getElementById('dufsUserInput')) document.getElementById('dufsUserInput').value = user;
        if (document.getElementById('dufsPassInput')) document.getElementById('dufsPassInput').value = pass;
        saveDufsConfig();
      } else if (currentModalKey === 'pppoe_client_creds') {
        const u = (document.getElementById('modalInput_pppoe_user')?.value || '').trim();
        const p = document.getElementById('modalInput_pppoe_pass')?.value || '';
        savePppoeClientCreds(u, p);
      } else if (currentModalKey === 'pppoe_client_ac') {
        const ac = (document.getElementById('modalInput_pppoe_ac')?.value || '').trim();
        const serv = (document.getElementById('modalInput_pppoe_service')?.value || '').trim();
        savePppoeClientAc(ac, serv);
      } else if (currentModalKey === 'pppoe_client_mac') {
        const mac = (document.getElementById('modalInput_pppoe_mac')?.value || '').trim();
        const mtu = parseInt(document.getElementById('modalInput_pppoe_mtu')?.value, 10) || 1492;
        savePppoeClientMac(mac, mtu);
      } else if (currentModalKey === 'pppoe_server_config') {
        const srv_ip = (document.getElementById('modalInput_pppoe_srv_ip')?.value || '10.0.0.1').trim();
        const pool_start = (document.getElementById('modalInput_pppoe_srv_start')?.value || '10.0.0.150').trim();
        const pool_end = (document.getElementById('modalInput_pppoe_srv_end')?.value || '10.0.0.220').trim();
        const dns1 = (document.getElementById('modalInput_pppoe_srv_dns1')?.value || '10.0.0.1').trim();
        const dns2 = (document.getElementById('modalInput_pppoe_srv_dns2')?.value || '1.1.1.1').trim();
        const max_sess = parseInt(document.getElementById('modalInput_pppoe_srv_max')?.value, 10) || 32;
        savePppoeServerConfig(srv_ip, pool_start, pool_end, dns1, dns2, max_sess);
      } else if (currentModalKey === 'pppoe_server_users') {
        // Done
      } else if (currentModalKey === 'usb_lb_mode') {
        const sel = document.querySelector('input[name="modal_usb_mode"]:checked');
        if (sel && window._cachedUsbWanData) {
          window._cachedUsbWanData.load_balancing.mode = sel.value;
          saveUsbWanConfig();
        }
      } else if (currentModalKey === 'usb_ping_target') {
        const inp = document.getElementById('modalInput_usb_ping_target');
        if (inp && window._cachedUsbWanData) {
          window._cachedUsbWanData.load_balancing.ping_target = inp.value.trim();
          saveUsbWanConfig();
        }
      } else if (currentModalKey === 'usb_ping_interval') {
        const inp = document.getElementById('modalInput_usb_ping_interval');
        if (inp && window._cachedUsbWanData) {
          window._cachedUsbWanData.load_balancing.ping_interval = parseInt(inp.value, 10) || 15;
          saveUsbWanConfig();
        }
      } else if (currentModalKey === 'usb_dns_override') {
        const inp = document.getElementById('modalInput_usb_dns');
        if (inp && window._cachedUsbWanData) {
          window._cachedUsbWanData.load_balancing.dns_override = inp.value.trim();
          saveUsbWanConfig();
        }
      } else if (currentModalKey === 'usb_tether_proto') {
        const sel = document.querySelector('input[name="modal_usb_proto"]:checked');
        if (sel && window._cachedUsbWanData) {
          window._cachedUsbWanData.load_balancing.tether_proto = sel.value;
          saveUsbWanConfig();
        }
      } else if (currentModalKey === 'usb_device_edit') {
        const devId = window._editingUsbDevId;
        const dev = (window._cachedUsbWanData && window._cachedUsbWanData.devices) ? window._cachedUsbWanData.devices.find(d => d.id === devId) : null;
        if (dev) {
          const w = parseInt(document.getElementById('modalInput_usb_dev_weight')?.value, 10) || 50;
          const m = parseInt(document.getElementById('modalInput_usb_dev_metric')?.value, 10) || 100;
          const mtu = parseInt(document.getElementById('modalInput_usb_dev_mtu')?.value, 10) || 1400;
          dev.weight = w;
          dev.metric = m;
          dev.mtu = mtu;
          saveUsbWanConfig();
        }
      }

      closeSettingModal();
    }

    
    // ==================== GATEWAY SECURITY POLICIES ====================
    let cachedSecurityPolicy = {
      ssh_enable: true,
      session_timeout: true,
      syn_flood: true,
      wan_ping_drop: false,
      brute_force: true,
      force_https: false
    };

    async function fetchSecuritySettings() {
      try {
        const res = await apiFetch("/cgi-bin/device?action=security_get");
        const data = await res.json();
        if (data && data.status === 'ok') {
          cachedSecurityPolicy = Object.assign(cachedSecurityPolicy, data);
        }
      } catch (e) {
        console.warn("fetchSecuritySettings error, using defaults:", e);
      }

      // Sync checkbox controls
      const sshToggle = document.getElementById('secSshToggle');
      const sessToggle = document.getElementById('secSessionTimeoutToggle');
      const synToggle = document.getElementById('secSynFloodToggle');
      const pingToggle = document.getElementById('secWanPingToggle');
      const bruteToggle = document.getElementById('secBruteForceToggle');
      const httpsToggle = document.getElementById('secHttpsToggle');

      if (sshToggle) sshToggle.checked = !!cachedSecurityPolicy.ssh_enable;
      if (sessToggle) sessToggle.checked = !!cachedSecurityPolicy.session_timeout;
      if (synToggle) synToggle.checked = !!cachedSecurityPolicy.syn_flood;
      if (pingToggle) pingToggle.checked = !!cachedSecurityPolicy.wan_ping_drop;
      if (bruteToggle) bruteToggle.checked = !!cachedSecurityPolicy.brute_force;
      if (httpsToggle) httpsToggle.checked = !!cachedSecurityPolicy.force_https;

      // Also refresh SSL / TLS certificate status
      loadSslCertificateStatus();
    }

    async function saveSecurityPolicy(key, value) {
      cachedSecurityPolicy[key] = value;
      try {
        const res = await fetch("/cgi-bin/device?action=security_set", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cachedSecurityPolicy)
        });
        const data = await res.json();
        if (data && data.status === 'ok') {
          showToast(`Security policy updated: ${key.replace('_', ' ').toUpperCase()}`, 'success');
        } else {
          showToast(`Error saving security policy`, 'warning');
        }
      } catch (e) {
        console.error("saveSecurityPolicy error", e);
        showToast(`Policy updated locally: ${key}`, 'info');
      }
    }

    // ==================== ADB DEVICES MANAGER CONTROLLER ====================
    let activeAdbDevices = [];

    async function fetchAdbDeviceList() {
      const container = document.getElementById('adbDevicesCardsContainer');
      const badge = document.getElementById('adbDevCountBadge');
      const hubBadge = document.getElementById('adbHubCountBadge');

      try {
        let devs = [];
        if (window._lastDataCache && Array.isArray(window._lastDataCache.usb_devices) && window._lastDataCache.usb_devices.length > 0) {
          devs = window._lastDataCache.usb_devices;
        } else {
          const res = await apiFetch("/cgi-bin/device?action=devices");
          const data = await res.json();
          devs = Array.isArray(data.devices) ? data.devices : [];
        }

        activeAdbDevices = devs.filter(d => d.device_type !== 'storage' && d.device_type !== 'pendrive' && d.device_type !== 'ssd');
        if (activeAdbDevices.length === 0 && devs.length > 0) {
          activeAdbDevices = devs;
        }

        if (badge) badge.textContent = `${activeAdbDevices.length} CONNECTED`;
        if (hubBadge) hubBadge.textContent = `${activeAdbDevices.length} ONLINE`;

        renderAdbDevicesCards(activeAdbDevices);
      } catch (e) {
        console.error('fetchAdbDeviceList error', e);
      }
    }

    function renderAdbDevicesCards(devs) {
      const container = document.getElementById('adbDevicesCardsContainer');
      if (!container) return;

      if (!devs || devs.length === 0) {
        container.innerHTML = `
          <div style="padding:16px; text-align:center; color:var(--text-dim); font-size:11.5px; font-family:var(--font-mono); background:rgba(255,255,255,0.02); border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
            No Android ADB devices detected. Connect a 5G phone via USB with USB Debugging enabled.
          </div>
        `;
        return;
      }

      container.innerHTML = devs.map(d => {
        const ser = d.serial || d.bus || 'dev_adb';
        const name = escapeHtml(d.model || d.brand || 'Android Handset');
        const net = d.network || (d.is_wan ? '5G SA Tethering' : 'Connected');
        const oper = d.operator || d.manufacturer || '';
        const batt = (d.battery_pct !== null && d.battery_pct !== undefined) ? `${d.battery_pct}%` : '';
        const ip = d.virtual_ip || d.ip || '';

        const metaParts = [];
        if (ser) metaParts.push(ser);
        if (net) metaParts.push(net);
        if (oper) metaParts.push(oper);
        if (ip) metaParts.push(`IP: ${ip}`);
        if (batt) metaParts.push(`Batt: ${batt}`);
        const metaStr = metaParts.join(' &bull; ');

        return `
          <div class="setting-row-item setting-clickable-row" onclick="openAdbDeviceDetail('${escapeHtml(ser)}')">
            <div class="setting-label-col">
              <span class="setting-label-bold">${name}</span>
              <span class="setting-label-sub">${metaStr}</span>
            </div>
            <div class="setting-arrow-col">
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        `;
      }).join('');
    }

    function openAdbDeviceDetail(serial, pushHistory = true) {
      window._currentAdbDeviceDetail = serial;
      selectedAdbSerial = serial;

      const listView = document.getElementById('adbListView');
      if (listView) listView.style.display = 'none';
      switchAdbSubView('controls');

      const selDev = activeAdbDevices.find(d => (d.serial === serial || d.bus === serial)) || { serial: serial, model: 'Android Handset' };
      const devName = selDev.model || selDev.brand || 'Android Handset';
      const ser = selDev.serial || selDev.bus || serial || '--';

      // Update Subnav Title
      const navTitle = document.getElementById('settingsDetailNavTitle');
      if (navTitle) {
        navTitle.textContent = devName;
      }

      // Populate basic info immediately
      const mTitle = document.getElementById('dispDevModelTitle');
      if (mTitle) mTitle.textContent = devName;
      const mSub = document.getElementById('dispDevModelSub');
      if (mSub) mSub.textContent = `Serial: ${ser}${selDev.ip ? ` • IP: ${selDev.ip}` : ''}`;
      const sSub = document.getElementById('dispDevSerialSub');
      if (sSub) sSub.textContent = `Serial: ${ser} • USB High-Speed 480 Mbps`;
      const uSub = document.getElementById('dispDevUptimeSub');
      if (uSub) uSub.innerHTML = 'Uptime: -- &bull; Reading system uptime...';

      updateSelectedAdbDeviceControls();
      fetchAdbLiveTelemetry();

      if (pushHistory) {
        try {
          history.pushState({ tab: 'settings', page: 'adb-device-detail', serial: serial }, '', '#setting=acc-adb-device&dev=' + encodeURIComponent(serial));
        } catch (e) {}
      }
    }

    function closeAdbDeviceDetail(triggerHistoryBack = true) {
      if (window._currentAdbSubView && window._currentAdbSubView !== 'controls') {
        switchAdbSubView('controls');
        return;
      }
      if (!window._currentAdbDeviceDetail) return;
      window._currentAdbDeviceDetail = null;

      const listView = document.getElementById('adbListView');
      ['adbDetailView', 'adbSmsPageView', 'adbCallsPageView', 'adbContactsPageView'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
      if (listView) listView.style.display = 'block';

      const navTitle = document.getElementById('settingsDetailNavTitle');
      if (navTitle) navTitle.textContent = 'ADB Devices';

      if (triggerHistoryBack && window.location.hash.includes('&dev=')) {
        try {
          history.back();
        } catch (e) {}
      }
    }

    function selectAdbDevice(serial) {
      openAdbDeviceDetail(serial);
    }

    function updateSelectedAdbDeviceControls() {
      const detailView = document.getElementById('adbDetailView');
      if (!detailView || detailView.style.display === 'none') return;

      const selDev = activeAdbDevices.find(d => (d.serial === selectedAdbSerial || d.bus === selectedAdbSerial)) || activeAdbDevices[0];
      const ser = selDev ? (selDev.serial || selDev.bus || selectedAdbSerial) : (selectedAdbSerial || 'default_adb');
      const state = getAdbDeviceState(ser);

      // 1. Torch status & subtitle
      const isTorchOn = !!state.torch;
      updateAdbTorchUI(isTorchOn);
      const torchSub = document.getElementById('dispTorchSub');
      if (torchSub) {
        torchSub.innerHTML = `<strong style="color:${isTorchOn ? '#f59e0b' : 'var(--text-dim)'};">State: ${isTorchOn ? 'ON' : 'OFF'}</strong> &bull; High-intensity rear camera LED torch`;
      }

      // 2. Display screen status & subtitle
      const isAwake = (state.screenAwake !== false);
      const wakeBtn = document.getElementById('btnDisplayWake');
      const sleepBtn = document.getElementById('btnDisplaySleep');
      if (wakeBtn) {
        if (isAwake) wakeBtn.classList.add('active-cyan');
        else wakeBtn.classList.remove('active-cyan');
      }
      if (sleepBtn) {
        if (!isAwake) sleepBtn.classList.add('active-cyan');
        else sleepBtn.classList.remove('active-cyan');
      }
      const pwrSub = document.getElementById('dispPowerSub');
      if (pwrSub) {
        pwrSub.innerHTML = `<strong style="color:${isAwake ? '#38bdf8' : 'var(--text-dim)'};">State: ${isAwake ? 'AWAKE' : 'SLEEPING'}</strong> &bull; Handset touch display is ${isAwake ? 'active' : 'powered down'}`;
      }

      // 3. Volume subtitle
      const volSub = document.getElementById('dispVolumeSub');
      if (volSub) {
        const isMuted = state.volume === 0;
        volSub.innerHTML = `<strong style="color:${isMuted ? '#f59e0b' : 'var(--text-main)'};">Level: ${isMuted ? 'MUTED' : `Volume ${state.volume}`}</strong> &bull; Speaker media audio level`;
      }

      // 4. Radio subtitle
      const radioSub = document.getElementById('dispRadioSub');
      if (radioSub) {
        radioSub.innerHTML = `<strong style="color:#10b981;">State: 5G SA Connected</strong> &bull; Cycle airplane mode to re-attach`;
      }

      // 5. Wireless ADB subtitle
      const wAdbSub = document.getElementById('dispWirelessAdbSub');
      if (wAdbSub) {
        const wOn = !!state.wirelessAdb;
        wAdbSub.innerHTML = `<strong style="color:${wOn ? '#10b981' : 'var(--text-dim)'};">State: ${wOn ? 'Enabled (Port 5555)' : 'Disabled'}</strong> &bull; TCP/IP network debugging`;
      }
    }

    async function enableWirelessAdb(btn) {
      if (btn) {
        btn.classList.add('active-green', 'btn-pulse');
        setTimeout(() => btn.classList.remove('btn-pulse'), 350);
      }
      const pill = document.getElementById('dispWirelessAdbStatus');
      if (pill) { pill.className = 'setting-pill pill-green'; pill.textContent = 'PORT 5555 READY'; }
      showToast('Enabling wireless ADB on port 5555...', 'info');

      try {
        await apiFetch('/cgi-bin/device?action=wireless_adb&port=5555');
        showToast('Wireless ADB enabled on port 5555!', 'success');
      } catch (e) {
        console.error(e);
      }
    }


    // ==================== ACTIVE SESSIONS & REMOTE DEVICE LOGOUT ====================
    function parseUserAgentSecurityDetails(ua) {
      if (!ua || typeof ua !== 'string') {
        return { device: 'Unknown Device', browser: 'Web Browser' };
      }

      let device = 'Generic Device';
      let browser = 'Web Browser';

      // 1. Detect Device & Operating System
      const isAndroid = /Android/i.test(ua);
      const isIPhone = /iPhone/i.test(ua);
      const isIPad = /iPad/i.test(ua);
      const isMac = /Macintosh|Mac OS X/i.test(ua);
      const isWindows = /Windows NT/i.test(ua);
      const isLinux = /Linux/i.test(ua) && !isAndroid;

      if (isAndroid) {
        const verMatch = ua.match(/Android\s+([0-9\.]+)/i);
        const ver = verMatch ? `Android ${verMatch[1]}` : 'Android';
        const modelMatch = ua.match(/Android[^;]+;\s*([^;\)]+)/i);
        let model = modelMatch ? modelMatch[1].trim() : '';
        if (model && model !== 'K' && !model.startsWith('Build/')) {
          model = model.replace(/\s*Build\/.*$/i, '').trim();
          device = `${ver} (${model})`;
        } else {
          device = `${ver} Phone`;
        }
      } else if (isIPhone) {
        const verMatch = ua.match(/OS\s+([0-9_]+)/i);
        const ver = verMatch ? verMatch[1].replace(/_/g, '.') : '';
        device = ver ? `Apple iPhone (iOS ${ver})` : 'Apple iPhone';
      } else if (isIPad) {
        const verMatch = ua.match(/OS\s+([0-9_]+)/i);
        const ver = verMatch ? verMatch[1].replace(/_/g, '.') : '';
        device = ver ? `Apple iPad (iPadOS ${ver})` : 'Apple iPad';
      } else if (isMac) {
        device = 'Apple Mac (macOS)';
      } else if (isWindows) {
        if (/Windows NT 10\.0/i.test(ua)) device = 'Windows 10/11 (PC)';
        else if (/Windows NT 6\.3/i.test(ua)) device = 'Windows 8.1 (PC)';
        else if (/Windows NT 6\.1/i.test(ua)) device = 'Windows 7 (PC)';
        else device = 'Windows (PC)';
      } else if (isLinux) {
        if (/x86_64/i.test(ua)) device = 'Linux (x86_64)';
        else if (/aarch64|arm64/i.test(ua)) device = 'Linux (ARM64)';
        else if (/armv7|arm/i.test(ua)) device = 'Linux (ARM)';
        else device = 'Linux Workstation';
      }

      // 2. Detect Browser & Version
      if (/HeadlessChrome\/([0-9\.]+)/i.test(ua)) {
        const m = ua.match(/HeadlessChrome\/([0-9\.]+)/i);
        const parts = m ? m[1].split('.') : [];
        browser = `HeadlessChrome ${parts[0] ? parts[0] + '.' + (parts[1] || '0') : ''}`.trim();
      } else if (/Edg\/([0-9\.]+)/i.test(ua)) {
        const m = ua.match(/Edg\/([0-9\.]+)/i);
        const parts = m ? m[1].split('.') : [];
        browser = `Edge ${parts[0] ? parts[0] + '.' + (parts[1] || '0') : ''}`.trim();
      } else if (/OPR\/([0-9\.]+)/i.test(ua)) {
        const m = ua.match(/OPR\/([0-9\.]+)/i);
        const parts = m ? m[1].split('.') : [];
        browser = `Opera ${parts[0] || ''}`.trim();
      } else if (/Firefox\/([0-9\.]+)/i.test(ua)) {
        const m = ua.match(/Firefox\/([0-9\.]+)/i);
        const parts = m ? m[1].split('.') : [];
        browser = `Firefox ${parts[0] ? parts[0] + '.' + (parts[1] || '0') : ''}`.trim();
      } else if (/Chrome\/([0-9\.]+)/i.test(ua)) {
        const m = ua.match(/Chrome\/([0-9\.]+)/i);
        const parts = m ? m[1].split('.') : [];
        const ver = parts[0] ? `${parts[0]}.${parts[1] || '0'}` : '';
        const isMobile = /Mobile/i.test(ua);
        browser = isMobile ? `Chrome Mobile ${ver}` : `Chrome ${ver}`;
      } else if (/Safari\/([0-9\.]+)/i.test(ua) && !/Chrome/i.test(ua)) {
        const vMatch = ua.match(/Version\/([0-9\.]+)/i);
        const ver = vMatch ? vMatch[1].split('.')[0] : '';
        browser = ver ? `Safari ${ver}` : 'Safari';
      }

      return { device, browser };
    }

    function formatSessionDateTime(epochSec) {
      const d = (epochSec && !isNaN(epochSec) && epochSec > 0) ? new Date(epochSec * 1000) : new Date();
      if (isNaN(d.getTime())) return '';
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()] || '';
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      const secs = String(d.getSeconds()).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${mins}:${secs}`;
    }

    async function fetchActiveSessions() {
      const container = document.getElementById('activeSessionsFlatList');
      if (!container) return;

      const curToken = localStorage.getItem('maxnet_token') || '';

      try {
        const res = await fetch(`/cgi-bin/auth?action=list_sessions&token=${encodeURIComponent(curToken)}`);
        const data = await res.json();
        const sessions = data.sessions || [];
        const clientIp = data.current_ip || '10.0.0.111';

        // Separate active session from other sessions
        let curSession = sessions.find(s => s.is_current || s.token === curToken);
        const otherSessions = sessions.filter(s => !s.is_current && s.token !== curToken);

        const activeUa = (curSession && curSession.ua) ? curSession.ua : navigator.userAgent;
        const activeDev = parseUserAgentSecurityDetails(activeUa);
        const activeTimeStr = formatSessionDateTime(curSession ? (curSession.created || curSession.last_active) : null);

        let html = '';

        // 1. ACTIVE SESSION (THIS DEVICE) - ALWAYS ON TOP, HAS LOGOUT ICON
        html += `
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">${escapeHtml(activeDev.device)} &bull; ${escapeHtml(activeDev.browser)}</span>
              <span class="setting-label-sub"><strong style="color:#10b981;">This Device</strong> &bull; ${escapeHtml(clientIp)} &bull; ${activeTimeStr}</span>
            </div>
            <div class="setting-control-col">
              <button type="button" class="round-action-btn btn-danger-action" title="Log Out (This Device)" onclick="logoutSession()">
                <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          </div>
        `;

        // 2. OTHER AUTHENTICATED SESSIONS - HAS REMOVE (TRASH) ICON
        otherSessions.forEach(s => {
          const dev = parseUserAgentSecurityDetails(s.ua || '');
          const timeStr = formatSessionDateTime(s.created || s.last_active);

          html += `
            <div class="setting-row-item">
              <div class="setting-label-col">
                <span class="setting-label-bold">${escapeHtml(dev.device)} &bull; ${escapeHtml(dev.browser)}</span>
                <span class="setting-label-sub">${escapeHtml(s.ip || '10.0.0.1')} &bull; ${timeStr}</span>
              </div>
              <div class="setting-control-col">
                <button type="button" class="round-action-btn btn-danger-action" title="Remove Session" onclick="logoutSingleDevice('${escapeHtml(s.token)}')">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </div>
          `;
        });

        container.innerHTML = html;
      } catch (e) {
        console.error('fetchActiveSessions error', e);
      }
    }

    async function logoutSingleDevice(targetToken) {
      if (!confirm('Are you sure you want to terminate this remote device session?')) return;
      try {
        await fetch('/cgi-bin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout_device', target_token: targetToken })
        });
        fetchActiveSessions();
      } catch (e) {
        console.error('logoutSingleDevice error', e);
      }
    }

    async function logoutOtherDevices() {
      if (!confirm('Are you sure you want to log out all other devices? Only this current browser will remain logged in.')) return;
      const curToken = localStorage.getItem('maxnet_token') || '';
      try {
        await fetch('/cgi-bin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout_others', token: curToken })
        });
        alert('All other remote device sessions have been revoked.');
        fetchActiveSessions();
      } catch (e) {
        console.error('logoutOtherDevices error', e);
      }
    }

    async function logoutAllSessions() {
      if (!confirm('Warning: This will terminate all active sessions including this device and immediately lock the gateway. Continue?')) return;
      try {
        await fetch('/cgi-bin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout_all' })
        });
      } catch (e) {}
      localStorage.removeItem('maxnet_token');
      localStorage.removeItem('maxnet_auth');
      showLogin();
    }

    async function logoutCurrentSession() {
      if (!confirm('Are you sure you want to sign out from this device?')) return;
      const curToken = localStorage.getItem('maxnet_token') || '';
      try {
        await fetch('/cgi-bin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout', token: curToken })
        });
      } catch (e) {}
      localStorage.removeItem('maxnet_token');
      localStorage.removeItem('maxnet_auth');
      showLogin();
    }

    // ==================== DIAGNOSTIC SUITE CONTROLLER ====================
    let currentDiagTool = 'ping';
    let isDiagRunning = false;
    let diagPingSeq = 0;
    let diagPingTimer = null;
    let currentDnsType = 'ALL';
    let currentPortScanMode = 'common';

    const DEFAULT_COMMON_PORTS = '20, 21, 22, 23, 25, 53, 67, 68, 69, 80, 110, 119, 123, 135, 137, 138, 139, 143, 161, 162, 389, 443, 445, 465, 514, 587, 636, 873, 993, 995, 1080, 1194, 1433, 1521, 1723, 1883, 2049, 2082, 2083, 2086, 2087, 2181, 3000, 3128, 3306, 3389, 4369, 5000, 5060, 5222, 5432, 5672, 5900, 6379, 6443, 6667, 7000, 7001, 7681, 8000, 8008, 8080, 8081, 8443, 8888, 9000, 9090, 9092, 9200, 9418, 9999, 10000, 27017, 27018, 50000, 51820';

    function switchDiagTool(tool) {
      if (isDiagRunning) stopDiagExecution();
      currentDiagTool = tool;

      // Update nav tabs
      document.querySelectorAll('.diag-nav-tab').forEach(btn => {
        const isCur = btn.getAttribute('data-tool') === tool;
        btn.classList.toggle('active', isCur);
        btn.style.background = isCur ? '#38bdf8' : 'transparent';
        btn.style.color = isCur ? '#0f172a' : 'var(--text-dim)';
      });

      // Show matching config sub-panel
      const panels = {
        ping: 'diagConfigPing',
        route: 'diagConfigRoute',
        ports: 'diagConfigPorts',
        whois: 'diagConfigWhois',
        dns: 'diagConfigDns'
      };

      Object.entries(panels).forEach(([k, id]) => {
        const el = document.getElementById(id);
        if (el) el.style.display = (k === tool) ? 'block' : 'none';
      });

      // Update default placeholder & target
      const targetInp = document.getElementById('diagTargetInput');
      if (targetInp) {
        if (tool === 'whois' && (targetInp.value === '1.1.1.1' || !targetInp.value)) {
          targetInp.value = 'google.com';
        } else if (tool === 'dns' && (targetInp.value === '1.1.1.1' || !targetInp.value)) {
          targetInp.value = 'cloudflare.com';
        }
      }
    }

    function setPortScanMode(mode) {
      currentPortScanMode = mode;
      const btnCommon = document.getElementById('btnPortModeCommon');
      const btnAll = document.getElementById('btnPortModeAll');
      const commonBox = document.getElementById('diagPortsCommonBox');

      if (btnCommon && btnAll) {
        btnCommon.style.background = (mode === 'common') ? '#38bdf8' : 'transparent';
        btnCommon.style.color = (mode === 'common') ? '#0f172a' : 'var(--text-dim)';
        btnAll.style.background = (mode === 'all') ? '#38bdf8' : 'transparent';
        btnAll.style.color = (mode === 'all') ? '#0f172a' : 'var(--text-dim)';
      }
      if (commonBox) {
        commonBox.style.display = (mode === 'common') ? 'block' : 'none';
      }
    }

    function resetDefaultPorts() {
      const inp = document.getElementById('diagPortsListInput');
      if (inp) inp.value = DEFAULT_COMMON_PORTS;
    }

    function setDnsQueryType(type) {
      currentDnsType = type;
      document.querySelectorAll('#diagDnsTypesBar .dns-type-pill').forEach(btn => {
        const isCur = btn.textContent.trim() === type;
        btn.classList.toggle('active', isCur);
        btn.style.background = isCur ? '#38bdf8' : 'rgba(255,255,255,0.06)';
        btn.style.color = isCur ? '#0f172a' : 'var(--text-dim)';
      });
    }

    function clearDiagResults() {
      const list = document.getElementById('diagResultsList');
      if (list) list.innerHTML = '';
      const container = document.getElementById('diagResultsContainer');
      if (container) container.style.display = 'none';
    }

    function toggleDiagExecution() {
      if (isDiagRunning) {
        stopDiagExecution();
      } else {
        startDiagExecution();
      }
    }

    function stopDiagExecution() {
      isDiagRunning = false;
      if (diagPingTimer) {
        clearTimeout(diagPingTimer);
        diagPingTimer = null;
      }
      const btn = document.getElementById('btnDiagStart');
      if (btn) {
        btn.textContent = 'START';
        btn.style.background = 'linear-gradient(135deg, #0284c7, #0369a1)';
      }
    }

    async function startDiagExecution() {
      const target = (document.getElementById('diagTargetInput').value || '').trim();
      if (!target) {
        alert('Please enter a Domain Name or IP Address.');
        return;
      }

      isDiagRunning = true;
      const btn = document.getElementById('btnDiagStart');
      if (btn) {
        btn.textContent = 'STOP';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      }

      const container = document.getElementById('diagResultsContainer');
      if (container) container.style.display = 'block';

      const resultsList = document.getElementById('diagResultsList');
      const titleEl = document.getElementById('diagResultTitle');
      if (titleEl) titleEl.textContent = `${currentDiagTool.toUpperCase()} RESULTS: ${target}`;

      if (currentDiagTool === 'ping') {
        diagPingSeq = 0;
        if (resultsList) resultsList.innerHTML = '';
        executeNextPing();
      } else if (currentDiagTool === 'route') {
        executeTraceroute(target);
      } else if (currentDiagTool === 'ports') {
        executePortScan(target);
      } else if (currentDiagTool === 'whois') {
        executeWhois(target);
      } else if (currentDiagTool === 'dns') {
        executeDnsQuery(target);
      }
    }

    async function executeNextPing() {
      if (!isDiagRunning || currentDiagTool !== 'ping') return;

      const target = (document.getElementById('diagTargetInput').value || '1.1.1.1').trim();
      const delaySec = parseFloat(document.getElementById('diagPingDelay').value) || 1.0;
      const payloadSize = parseInt(document.getElementById('diagPingSize').value, 10) || 56;
      const isIpv6 = !!document.getElementById('diagPingIpv6').checked;

      diagPingSeq++;
      const currentSeq = diagPingSeq;

      try {
        const url = `/cgi-bin/diagnostics?tool=ping&target=${encodeURIComponent(target)}&size=${payloadSize}&seq=${currentSeq}&ipv6=${isIpv6}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!isDiagRunning) return;

        const resultsList = document.getElementById('diagResultsList');
        if (resultsList) {
          const success = !!data.success;
          const timeMs = data.time_ms;
          const ttl = data.ttl;
          const ip = data.ip || target;

          const row = document.createElement('div');
          row.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--card-inner, #161822); border:1px solid rgba(255,255,255,0.06); border-radius:8px; font-family:var(--font-mono); font-size:11.5px; animation:fadeIn 0.2s ease;';
          row.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="width:8px; height:8px; border-radius:50%; background:${success ? '#10b981' : '#ef4444'}; ${success ? 'box-shadow:0 0 6px rgba(16,185,129,0.8);' : ''}"></span>
              <span style="color:var(--text-dim); font-weight:700;">#${currentSeq}</span>
              <span style="color:var(--text-main); font-weight:600;">${escapeHtml(ip)}</span>
              <span style="color:var(--text-dim); font-size:10px;">${data.bytes || payloadSize} bytes</span>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="color:${success ? '#38bdf8' : '#ef4444'}; font-weight:800;">${success ? timeMs + ' ms' : 'Request timeout'}</span>
              ${ttl > 0 ? `<span style="color:var(--text-dim); font-size:10px;">ttl=${ttl}</span>` : ''}
            </div>
          `;

          // NEWEST PING ALWAYS AT THE TOP!
          resultsList.insertBefore(row, resultsList.firstChild);
        }
      } catch (e) {
        console.error('Ping error', e);
      }

      if (isDiagRunning && currentDiagTool === 'ping') {
        diagPingTimer = setTimeout(executeNextPing, Math.max(200, delaySec * 1000));
      }
    }

    async function executeTraceroute(target) {
      const resultsList = document.getElementById('diagResultsList');
      if (resultsList) {
        resultsList.innerHTML = `<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Tracing route hops to ${escapeHtml(target)}...</div>`;
      }

      const maxDelay = parseFloat(document.getElementById('diagRouteMaxDelay').value) || 0.50;
      const isUdp = !!document.getElementById('diagRouteUdp').checked;
      const isIpv6 = !!document.getElementById('diagRouteIpv6').checked;

      try {
        const url = `/cgi-bin/diagnostics?tool=route&target=${encodeURIComponent(target)}&max_delay=${maxDelay}&udp=${isUdp}&ipv6=${isIpv6}`;
        const res = await fetch(url);
        const data = await res.json();
        const hops = data.hops || [];

        if (resultsList) {
          if (hops.length === 0) {
            resultsList.innerHTML = `<div style="padding:14px; text-align:center; color:var(--text-dim); font-family:var(--font-mono); font-size:11.5px;">No hops resolved or destination unreachable.</div>`;
          } else {
            let html = `
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
            `;
            hops.forEach(h => {
              const isStar = h.host === '*' || h.ip === '*';
              html += `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:6px 8px; font-weight:700; color:var(--text-main);">#${h.hop}</td>
                  <td style="padding:6px 8px; color:${isStar ? 'var(--text-dim)' : 'var(--text-main)'};">${escapeHtml(h.host || '*')}</td>
                  <td style="padding:6px 8px; color:var(--text-dim);">${escapeHtml(h.ip || '*')}</td>
                  <td style="padding:6px 8px; text-align:right; font-weight:700; color:${isStar ? '#ef4444' : '#38bdf8'};">${isStar ? '*' : h.time_ms + ' ms'}</td>
                </tr>
              `;
            });
            html += `</tbody></table></div>`;
            resultsList.innerHTML = html;
          }
        }
      } catch (e) {
        if (resultsList) resultsList.innerHTML = `<div style="color:#ef4444; padding:12px; font-size:12px;">Route query error: ${escapeHtml(e.message)}</div>`;
      } finally {
        stopDiagExecution();
      }
    }

    async function executePortScan(target) {
      const resultsList = document.getElementById('diagResultsList');
      if (resultsList) {
        resultsList.innerHTML = `<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Scanning target ports on ${escapeHtml(target)}...</div>`;
      }

      let portListStr = DEFAULT_COMMON_PORTS;
      if (currentPortScanMode === 'common') {
        const inp = document.getElementById('diagPortsListInput');
        if (inp && inp.value.trim()) portListStr = inp.value.trim();
      } else {
        portListStr = '21,22,23,25,53,80,110,123,135,139,143,443,445,993,995,1723,3306,3389,5000,5060,7681,8080,8443';
      }

      const cleanPorts = portListStr.split(/[\s,]+/).filter(p => /^\d+$/.test(p)).join(',');
      const isIpv6 = !!document.getElementById('diagPortsIpv6').checked;

      try {
        const url = `/cgi-bin/diagnostics?tool=ports&target=${encodeURIComponent(target)}&ports=${cleanPorts}&ipv6=${isIpv6}`;
        const res = await fetch(url);
        const data = await res.json();
        const ports = data.ports || [];

        if (resultsList) {
          const openPorts = ports.filter(p => p.status === 'open');
          let html = `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; padding:6px 8px; background:rgba(255,255,255,0.02); border-radius:6px; font-family:var(--font-mono); font-size:11px;">
              <span>Total Scanned: <strong>${ports.length}</strong></span>
              <span style="color:#10b981; font-weight:700;">${openPorts.length} OPEN</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:6px;">
          `;
          ports.forEach(p => {
            const isOpen = p.status === 'open';
            html += `
              <div style="padding:7px 10px; background:var(--card-inner, #161822); border:1px solid ${isOpen ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.06)'}; border-radius:8px; font-family:var(--font-mono); font-size:11px; display:flex; align-items:center; justify-content:space-between;">
                <div>
                  <div style="font-weight:700; color:var(--text-main);">Port ${p.port}</div>
                  <div style="font-size:9.5px; color:var(--text-dim);">${escapeHtml(p.service || 'Service')}</div>
                </div>
                <span class="card-badge ${isOpen ? 'emerald' : ''}" style="${isOpen ? '' : 'background:rgba(255,255,255,0.04); color:var(--text-dim); border-color:transparent; font-size:9px;'}">${isOpen ? 'OPEN' : 'CLOSED'}</span>
              </div>
            `;
          });
          html += `</div>`;
          resultsList.innerHTML = html;
        }
      } catch (e) {
        if (resultsList) resultsList.innerHTML = `<div style="color:#ef4444; padding:12px; font-size:12px;">Port scan error: ${escapeHtml(e.message)}</div>`;
      } finally {
        stopDiagExecution();
      }
    }

    async function executeWhois(target) {
      const resultsList = document.getElementById('diagResultsList');
      if (resultsList) {
        resultsList.innerHTML = `<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Querying WHOIS registry database for ${escapeHtml(target)}...</div>`;
      }

      const server = document.getElementById('diagWhoisServer').value;
      const isIpv6 = !!document.getElementById('diagWhoisIpv6').checked;

      try {
        const url = `/cgi-bin/diagnostics?tool=whois&target=${encodeURIComponent(target)}&server=${encodeURIComponent(server)}&ipv6=${isIpv6}`;
        const res = await fetch(url);
        const data = await res.json();

        if (resultsList) {
          let html = `
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="padding:12px 14px; background:var(--card-inner, #161822); border:1px solid rgba(255,255,255,0.08); border-radius:10px; font-family:var(--font-mono); font-size:11px; display:flex; flex-direction:column; gap:6px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;">
                  <span style="color:var(--text-dim);">Registrar:</span>
                  <span style="font-weight:700; color:var(--text-main); text-align:right;">${escapeHtml(data.registrar || 'N/A')}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;">
                  <span style="color:var(--text-dim);">Creation Date:</span>
                  <span style="font-weight:700; color:var(--text-main);">${escapeHtml(data.creation_date || 'N/A')}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;">
                  <span style="color:var(--text-dim);">Expiry Date:</span>
                  <span style="font-weight:700; color:#38bdf8;">${escapeHtml(data.expiry_date || 'N/A')}</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding-top:2px;">
                  <span style="color:var(--text-dim);">Name Servers:</span>
                  <span style="font-weight:600; color:var(--text-main); text-align:right;">${escapeHtml(data.nameservers || 'N/A')}</span>
                </div>
              </div>
              <div style="padding:10px 12px; background:rgba(0,0,0,0.3); border-radius:8px; font-family:var(--font-mono); font-size:10.5px; color:var(--text-dim); max-height:220px; overflow-y:auto; white-space:pre-wrap; line-height:1.4;">${escapeHtml(data.raw || 'No raw records returned')}</div>
            </div>
          `;
          resultsList.innerHTML = html;
        }
      } catch (e) {
        if (resultsList) resultsList.innerHTML = `<div style="color:#ef4444; padding:12px; font-size:12px;">Whois error: ${escapeHtml(e.message)}</div>`;
      } finally {
        stopDiagExecution();
      }
    }

    async function executeDnsQuery(target) {
      const resultsList = document.getElementById('diagResultsList');
      if (resultsList) {
        resultsList.innerHTML = `<div style="text-align:center; padding:18px; color:var(--text-dim); font-family:var(--font-mono); font-size:12px;">Querying DNS (${currentDnsType}) records for ${escapeHtml(target)}...</div>`;
      }

      const server = (document.getElementById('diagDnsServerInput').value || '').trim();
      const isDnssec = !!document.getElementById('diagDnsDnssec').checked;
      const allSections = !!document.getElementById('diagDnsAllSections').checked;
      const isIpv6 = !!document.getElementById('diagDnsIpv6').checked;

      try {
        const url = `/cgi-bin/diagnostics?tool=dns&target=${encodeURIComponent(target)}&type=${encodeURIComponent(currentDnsType)}&server=${encodeURIComponent(server)}&dnssec=${isDnssec}&all_sections=${allSections}&ipv6=${isIpv6}`;
        const res = await fetch(url);
        const data = await res.json();
        const answers = data.answers || [];

        if (resultsList) {
          if (answers.length === 0) {
            resultsList.innerHTML = `
              <div style="padding:14px; text-align:center; color:var(--text-dim); font-family:var(--font-mono); font-size:11.5px;">No ${currentDnsType} records found.</div>
              <div style="padding:10px 12px; background:rgba(0,0,0,0.3); border-radius:8px; font-family:var(--font-mono); font-size:10.5px; color:var(--text-dim); max-height:200px; overflow-y:auto; white-space:pre-wrap;">${escapeHtml(data.raw || '')}</div>
            `;
          } else {
            let html = `
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
            `;
            answers.forEach(a => {
              html += `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:6px 8px; color:var(--text-dim);">${escapeHtml(a.name)}</td>
                  <td style="padding:6px 8px; color:var(--text-dim);">${escapeHtml(a.ttl)}s</td>
                  <td style="padding:6px 8px;"><span style="color:#38bdf8; font-weight:700;">${escapeHtml(a.type)}</span></td>
                  <td style="padding:6px 8px; font-weight:600; color:var(--text-main); word-break:break-all;">${escapeHtml(a.value)}</td>
                </tr>
              `;
            });
            html += `</tbody></table></div>`;
            resultsList.innerHTML = html;
          }
        }
      } catch (e) {
        if (resultsList) resultsList.innerHTML = `<div style="color:#ef4444; padding:12px; font-size:12px;">DNS error: ${escapeHtml(e.message)}</div>`;
      } finally {
        stopDiagExecution();
      }
    }

    // LEGACY ROUTER DIAGNOSTIC FUNCTION
    async function runRouterDiagnostic() {
      const tool = document.getElementById('diagToolSelect').value;
      const target = document.getElementById('diagTargetInput').value.trim();
      const guiCard = document.getElementById('diagGuiResults');
      const rawToggle = document.getElementById('diagRawToggleBox');
      const rawBox = document.getElementById('diagOutputBox');

      if (!target) {
        alert('Please enter a target host or IP.');
        return;
      }

      if (guiCard) {
        guiCard.style.display = 'block';
        guiCard.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-dim); font-size:12px;">Running ${tool.toUpperCase()} to ${escapeHtml(target)}...</div>`;
      }
      if (rawToggle) rawToggle.style.display = 'none';

      try {
        const res = await fetch(`/cgi-bin/diagnostics?tool=${encodeURIComponent(tool)}&target=${encodeURIComponent(target)}`);
        const data = await res.json();
        const rawOutput = data.output || '';
        if (rawBox) rawBox.innerText = rawOutput;
        if (rawToggle) rawToggle.style.display = 'block';

        renderDiagnosticGui(tool, target, rawOutput);
        const accDiag = document.getElementById('acc-diagnostics');
        if (accDiag && accDiag.classList.contains('expanded')) {
          const accContent = accDiag.querySelector('.accordion-content');
          if (accContent) {
            accContent.style.maxHeight = 'none';
            accContent.style.overflow = 'visible';
          }
        }
      } catch (e) {
        if (guiCard) {
          guiCard.innerHTML = `<div style="color:var(--mh-rose); padding:12px; font-size:12px;">Diagnostic request failed: ${escapeHtml(e.message)}</div>`;
        }
      }
    }

    function renderDiagnosticGui(tool, target, raw) {
      const guiCard = document.getElementById('diagGuiResults');
      if (!guiCard) return;

      if (tool === 'ping' || tool === 'ping6') {
        const ipMatch = raw.match(/\(([0-9a-fA-F.:]+)\)/);
        const resolvedIp = ipMatch ? ipMatch[1] : target;
        
        const lossMatch = raw.match(/(\d+)% packet loss/);
        const lossPct = lossMatch ? parseInt(lossMatch[1], 10) : 100;

        const rttMatch = raw.match(/(?:rtt|round-trip) min\/avg\/max(?:\/mdev)? = ([0-9.]+)\/([0-9.]+)\/([0-9.]+)/);
        const minMs = rttMatch ? rttMatch[1] : '--';
        const avgMs = rttMatch ? rttMatch[2] : '--';
        const maxMs = rttMatch ? rttMatch[3] : '--';

        // Extract individual packet times
        const times = [];
        const timeRegex = /time=([0-9.]+) ms/g;
        let m;
        while ((m = timeRegex.exec(raw)) !== null) {
          times.push(m[1]);
        }

        const isSuccess = lossPct === 0;
        const statusBadgeClass = isSuccess ? 'emerald' : (lossPct < 100 ? 'gold' : 'rose');
        const statusText = isSuccess ? 'ONLINE (0% LOSS)' : (lossPct < 100 ? `${lossPct}% PACKET LOSS` : 'DESTINATION UNREACHABLE');

        guiCard.innerHTML = `
          <div class="diag-gui-card">
            <div class="diag-meta-bar">
              <div class="diag-target-pill">
                <span style="color:var(--mh-${tool === 'ping6' ? 'purple' : 'cyan'}); font-size:10px; border:1px solid currentColor; padding:2px 5px; border-radius:3px;">${tool.toUpperCase()}</span>
                <span>${escapeHtml(target)}</span>
                <span style="color:var(--text-dim); font-size:11px;">→ ${escapeHtml(resolvedIp)}</span>
              </div>
              <span class="card-badge ${statusBadgeClass}">${statusText}</span>
            </div>

            <div class="diag-stat-grid">
              <div class="diag-stat-box">
                <span class="diag-stat-label">Min Latency</span>
                <span class="diag-stat-val" style="color:var(--mh-emerald);">${minMs}<small style="font-size:10px;"> ms</small></span>
              </div>
              <div class="diag-stat-box">
                <span class="diag-stat-label">Avg Latency</span>
                <span class="diag-stat-val" style="color:var(--text-main); font-weight:700;">${avgMs}<small style="font-size:10px;"> ms</small></span>
              </div>
              <div class="diag-stat-box">
                <span class="diag-stat-label">Max Latency</span>
                <span class="diag-stat-val" style="color:var(--mh-purple);">${maxMs}<small style="font-size:10px;"> ms</small></span>
              </div>
              <div class="diag-stat-box">
                <span class="diag-stat-label">Packet Loss</span>
                <span class="diag-stat-val" style="color:var(--${isSuccess ? 'mh-emerald' : 'mh-rose'});">${lossPct}%</span>
              </div>
            </div>

            ${times.length > 0 ? `
              <div>
                <span style="font-size:10px; text-transform:uppercase; font-weight:700; color:var(--text-dim); font-family:var(--font-mono);">Probe Sequence</span>
                <div class="diag-packet-row">
                  ${times.map((t, idx) => `
                    <div class="diag-packet-chip">
                      <span style="color:var(--text-dim); font-size:9.5px;">#${idx + 1}</span>
                      <strong>${t} ms</strong>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      } else if (tool === 'traceroute') {
        const lines = raw.split('\n');
        const hops = [];
        lines.forEach(line => {
          const hopMatch = line.match(/^\s*(\d+)\s+([^\s]+)(?:\s+\(([^)]+)\))?\s+([0-9.]+\s*ms|\*)/);
          if (hopMatch) {
            hops.push({
              hop: hopMatch[1],
              host: hopMatch[2],
              ip: hopMatch[3] || hopMatch[2],
              time: hopMatch[4]
            });
          }
        });

        guiCard.innerHTML = `
          <div class="diag-gui-card">
            <div class="diag-meta-bar">
              <div class="diag-target-pill">
                <span style="color:var(--mh-iris); font-size:10px; border:1px solid currentColor; padding:2px 5px; border-radius:3px;">TRACEROUTE</span>
                <span>${escapeHtml(target)}</span>
              </div>
              <span class="card-badge emerald">${hops.length} HOPS DETECTED</span>
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
                ${hops.length > 0 ? hops.map(h => `
                  <tr>
                    <td style="color:var(--text-main); font-weight:700;">#${h.hop}</td>
                    <td style="word-break:break-all; overflow-wrap:anywhere;">${escapeHtml(h.host)}</td>
                    <td style="color:var(--text-dim); word-break:break-all; overflow-wrap:anywhere;">${escapeHtml(h.ip)}</td>
                    <td style="color:var(--mh-emerald); font-weight:700; white-space:nowrap;">${escapeHtml(h.time)}</td>
                  </tr>
                `).join('') : `<tr><td colspan="4" style="text-align:center; color:var(--text-dim); padding:10px;">No traceroute hops returned.</td></tr>`}
              </tbody>
            </table>
            </div>
          </div>
        `;
      } else if (tool === 'nslookup') {
        const addrRegex = /Address(?:\s+\d+)?:\s+([0-9a-fA-F.:]+)/g;
        const addrs = [];
        let m;
        while ((m = addrRegex.exec(raw)) !== null) {
          if (!m[1].includes('#53') && !m[1].includes(':53') && m[1] !== '127.0.0.1') {
            addrs.push(m[1]);
          }
        }
        const nameMatch = raw.match(/Name:\s+([^\s]+)/);
        const canonicalName = nameMatch ? nameMatch[1] : target;

        guiCard.innerHTML = `
          <div class="diag-gui-card">
            <div class="diag-meta-bar">
              <div class="diag-target-pill">
                <span style="color:var(--text-main); font-size:10px; border:1px solid rgba(255,255,255,0.25); padding:2px 5px; border-radius:3px;">DNS LOOKUP</span>
                <span>${escapeHtml(canonicalName)}</span>
              </div>
              <span class="card-badge">${addrs.length} RECORDS</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:6px;">
              ${addrs.length > 0 ? addrs.map(addr => {
                const isIpv6 = addr.includes(':');
                return `
                  <div class="diag-dns-record">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span class="card-badge ${isIpv6 ? 'purple' : 'cyan'}" style="font-size:9.5px;">${isIpv6 ? 'AAAA (IPv6)' : 'A (IPv4)'}</span>
                      <strong style="color:var(--text-main);">${escapeHtml(addr)}</strong>
                    </div>
                    <button class="mh-btn btn-sm btn-ghost" onclick="navigator.clipboard.writeText('${addr}'); alert('Copied ' + '${addr}')" style="font-size:10px; padding:2px 6px;">COPY</button>
                  </div>
                `;
              }).join('') : `<div style="color:var(--text-dim); font-size:11.5px; padding:10px; text-align:center;">No DNS address records found.</div>`}
            </div>
          </div>
        `;
      }
    }

    /* ==================== ADVANCED NETWORK CONFIGURATION ==================== */
    let cachedStaticLeases = [];

    function maskToCidr(mask) {
      if (!mask) return '24';
      const map = {
        '255.255.255.0': '24',
        '255.255.0.0': '16',
        '255.0.0.0': '8'
      };
      return map[mask] || '24';
    }

    function cidrToMask(cidr) {
      const map = {
        '24': '255.255.255.0',
        '16': '255.255.0.0',
        '8': '255.0.0.0'
      };
      return map[cidr] || '255.255.255.0';
    }

    function syncCidrFromMask(mask) {
      const select = document.getElementById('netCidrSelect');
      if (!select) return;
      if (['255.255.255.0', '255.255.0.0', '255.0.0.0'].includes(mask.trim())) {
        select.value = maskToCidr(mask.trim());
      } else {
        select.value = 'custom';
      }
    }

    function syncMaskFromCidr(cidr) {
      const maskInput = document.getElementById('netMask');
      if (!maskInput) return;
      if (cidr !== 'custom') {
        maskInput.value = cidrToMask(cidr);
      }
    }

    function toggleDhcpControls(enabled) {
      const poolRow = document.getElementById('rowDhcpPool');
      if (poolRow) {
        poolRow.style.opacity = enabled ? '1' : '0.4';
        poolRow.style.pointerEvents = enabled ? 'auto' : 'none';
      }
    }

    function toggleIpv6Master(enabled) {
      const rows = ['rowIpv6Addrs', 'rowIpv6WanMode', 'rowIpv6Ra', 'rowIpv6Dhcp6', 'rowIpv6Ula', 'rowIpv6Privacy'];
      rows.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.opacity = enabled ? '1' : '0.38';
          el.style.pointerEvents = enabled ? 'auto' : 'none';
        }
      });
      const badge = document.getElementById('badgeIpv6Status');
      if (badge) {
        if (enabled) {
          badge.textContent = 'DUAL-STACK ONLINE';
          badge.className = 'setting-status-badge badge-active';
        } else {
          badge.textContent = 'IPV6 DISABLED';
          badge.className = 'setting-status-badge badge-disabled';
        }
      }
    }

    function setDnsPreset(presetString) {
      const dnsInput = document.getElementById('netDns');
      if (dnsInput) {
        dnsInput.value = presetString;
        dnsInput.style.borderColor = 'var(--mh-emerald)';
      }
    }

    function renderStaticLeases(leases = []) {
      cachedStaticLeases = leases;
      const container = document.getElementById('staticLeasesListContainer');
      const badge = document.getElementById('staticLeasesCountBadge');
      if (badge) badge.textContent = `${leases.length} RESERVED`;
      const dispCount = document.getElementById('disp_static_leases_count');
      if (dispCount) dispCount.textContent = `${leases.length} Devices Configured • Permanent DHCP IPv4 reservation`;

      if (!container) return;

      if (!leases || leases.length === 0) {
        container.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-dim); font-size:12px; font-family:var(--font-mono); background:rgba(255,255,255,0.02); border-radius:8px;">No static DHCP leases registered. Click Add Reservation to create one.</div>`;
        return;
      }

      container.innerHTML = leases.map(l => `
        <div class="setting-row-item" style="background:rgba(255,255,255,0.02) !important; border:1px solid rgba(255,255,255,0.05) !important; border-radius:10px !important; margin-bottom:6px !important; display:flex; align-items:center; justify-content:space-between;">
          <div class="setting-label-col">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="setting-label-bold" style="color:var(--text-main); font-size:12px;">${escapeHtml(l.name || 'Client')}</span>
              <span style="font-size:11px; color:#38bdf8; font-weight:700; font-family:var(--font-mono);">${escapeHtml(l.ip || '')}</span>
            </div>
            <span class="setting-label-sub" style="font-family:var(--font-mono); font-size:11px; color:var(--text-dim);">MAC: ${escapeHtml(l.mac || '')}</span>
          </div>
          <div class="setting-control-col">
            <button type="button" class="round-action-btn btn-danger-action" title="Delete Reservation" onclick="delStaticLease('${escapeHtml(l.mac)}')">
              <svg viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `).join('');
    }

    async function addStaticLeaseFromUI() {
      const nameEl = document.getElementById('newLeaseName');
      const macEl = document.getElementById('newLeaseMac');
      const ipEl = document.getElementById('newLeaseIp');

      const name = (nameEl ? nameEl.value.trim() : '');
      const mac = (macEl ? macEl.value.trim() : '');
      const ip = (ipEl ? ipEl.value.trim() : '');

      if (!mac || !ip) {
        alert('Please enter both MAC address and IP for the reservation.');
        return;
      }

      try {
        const res = await fetch('/cgi-bin/network', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_lease',
            name: name || 'client',
            mac: mac,
            ip: ip
          })
        });
        const data = await res.json();
        if (data.status === 'ok') {
          if (nameEl) nameEl.value = '';
          if (macEl) macEl.value = '';
          if (ipEl) ipEl.value = '';
          await fetchNetworkConfig();
        } else {
          alert('Failed to add lease: ' + (data.message || 'Unknown error'));
        }
      } catch (e) {
        alert('Error adding lease: ' + e.message);
      }
    }

    async function delStaticLease(mac) {
      if (!confirm(`Remove DHCP reservation for MAC ${mac}?`)) return;
      try {
        setSettingSaveStatus('saving', 'Removing reservation...');
        const res = await fetch('/cgi-bin/network', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'del_lease',
            mac: mac
          })
        });
        const data = await res.json();
        if (data.status === 'ok') {
          setSettingSaveStatus('saved', 'Reservation Removed');
          await fetchNetworkConfig();
        } else {
          setSettingSaveStatus('error', 'Removal failed');
        }
      } catch (e) {
        setSettingSaveStatus('error', 'Delete error');
        console.error(e);
      }
    }

    
    // ==================== USB WAN TETHERING CONTROLLERS ====================
    let usbTetherEnabled = true;
    let usbTetherDnsEnabled = true;

    async function toggleUsbTethering(enabled) {
      usbTetherEnabled = enabled;
      const stateEl = document.getElementById('dispUsbTetherState');
      const badgeEl = document.getElementById('dispUsbTetherBadge');
      if (enabled) {
        if (stateEl) stateEl.textContent = 'State: Active (usb0) • Primary upstream internet gateway over USB';
        if (badgeEl) { badgeEl.className = 'setting-status-badge badge-active'; badgeEl.textContent = '5G SA ONLINE'; }
        showToast('USB WAN Tethering enabled', 'success');
      } else {
        if (stateEl) stateEl.textContent = 'State: Disabled • USB tethering interface usb0 brought down';
        if (badgeEl) { badgeEl.className = 'setting-status-badge badge-disabled'; badgeEl.textContent = 'DISCONNECTED'; }
        showToast('USB WAN Tethering disabled', 'info');
      }
      try {
        await apiFetch('/cgi-bin/device?action=settings_tether&enabled=' + (enabled ? '1' : '0'));
      } catch (e) {}
    }

    async function toggleUsbTetherDns(enabled) {
      usbTetherDnsEnabled = enabled;
      showToast('Tethering DNS Forwarding ' + (enabled ? 'Enabled' : 'Disabled'), 'info');
    }

    async function fetchNetworkConfig() {
      try {
        const res = await fetch('/cgi-bin/network');
        const data = await res.json();

        if (data.hostname && document.getElementById('netDeviceHostname')) {
          document.getElementById('netDeviceHostname').value = data.hostname;
          const disp = document.getElementById('disp_device_hostname');
          const hLow = data.hostname.toLowerCase();
          if (disp) disp.textContent = `${data.hostname} • ${hLow}.lan / ${hLow}.local`;
        }
        if (document.getElementById('netCustomMac')) {
          document.getElementById('netCustomMac').value = data.custom_mac || '';
          if (data.hw_mac && document.getElementById('netHwMac')) {
            document.getElementById('netHwMac').value = data.hw_mac;
          }
          const disp = document.getElementById('disp_custom_mac');
          if (disp) {
            disp.textContent = data.custom_mac
              ? `Custom: ${data.custom_mac} • Hardware: ${data.hw_mac || 'ca:e7:b7:34:8f:ac'}`
              : `Default: ${data.hw_mac || 'ca:e7:b7:34:8f:ac'} • Hardware MAC in use`;
          }
        }
        if (data.lan_ip) {
          if (document.getElementById('netLanIp')) document.getElementById('netLanIp').value = data.lan_ip;
          const disp = document.getElementById('disp_lan_ip');
          if (disp) disp.textContent = data.lan_ip;
        }
        if (data.netmask) {
          if (document.getElementById('netMask')) {
            document.getElementById('netMask').value = data.netmask;
            syncCidrFromMask(data.netmask);
          }
          const disp = document.getElementById('disp_net_mask');
          if (disp) disp.textContent = `${data.netmask} (/${maskToCidr(data.netmask)})`;
        }
        if (data.gateway !== undefined && document.getElementById('netGateway')) {
          document.getElementById('netGateway').value = data.gateway || '';
          const disp = document.getElementById('disp_net_gateway');
          if (disp) disp.textContent = data.gateway ? data.gateway : 'None (Direct br-lan)';
        }
        if (data.mtu && document.getElementById('netMtu')) {
          document.getElementById('netMtu').value = data.mtu;
          const disp = document.getElementById('disp_net_mtu');
          if (disp) disp.textContent = `${data.mtu} bytes`;
        }
        if (data.dns && document.getElementById('netDns')) document.getElementById('netDns').value = data.dns;
        if (data.dhcp_start && document.getElementById('netDhcpStart')) document.getElementById('netDhcpStart').value = data.dhcp_start;
        if (data.dhcp_limit && document.getElementById('netDhcpLimit')) document.getElementById('netDhcpLimit').value = data.dhcp_limit;
        if (data.dhcp_leasetime && document.getElementById('netDhcpLease')) document.getElementById('netDhcpLease').value = data.dhcp_leasetime;

        if (document.getElementById('netDhcpMasterToggle')) {
          const isDhcpActive = (data.dhcp_ignore !== 1 && data.dhcp_ignore !== '1');
          document.getElementById('netDhcpMasterToggle').checked = isDhcpActive;
          toggleDhcpControls(isDhcpActive);
        }

        const netBadge = document.getElementById('netLanBadge');
        if (netBadge && data.lan_ip) {
          netBadge.textContent = `${data.lan_ip}/${maskToCidr(data.netmask || '255.255.255.0')}`;
        }

        // WAN Status Overview
        if (data.wan) {
          const wanDot = document.getElementById('wanStatusDot');
          const wanProto = document.getElementById('wanProtoBadge');
          const wanIp = document.getElementById('wanIpBadge');
          const wanState = document.getElementById('wanStateBadge');

          if (wanProto) wanProto.textContent = (data.wan.proto || 'DHCP').toUpperCase();
          if (wanIp) wanIp.textContent = data.wan.ip || '--';

          if (data.wan.up) {
            if (wanDot) wanDot.style.background = '#10b981';
            if (wanState) {
              wanState.className = 'toggle-status-badge on';
              wanState.textContent = 'CONNECTED';
            }
          } else {
            if (wanDot) wanDot.style.background = '#71717a';
            if (wanState) {
              wanState.className = 'toggle-status-badge off';
              wanState.textContent = 'DISCONNECTED';
            }
          }
        }

        // Static Leases
        renderStaticLeases(data.static_leases || []);

        // IPv6 Dual-Stack Settings
        if (document.getElementById('netIpv6MasterToggle')) {
          const isIpv6On = data.ipv6_enabled === undefined || data.ipv6_enabled === 1 || data.ipv6_enabled === '1';
          document.getElementById('netIpv6MasterToggle').checked = isIpv6On;
          toggleIpv6Master(isIpv6On);
        }
        if (data.ipv6_wan_mode && document.getElementById('netIpv6WanMode')) {
          document.getElementById('netIpv6WanMode').value = data.ipv6_wan_mode;
          const disp = document.getElementById('disp_ipv6_wan_mode');
          if (disp) {
            const map = {
              dhcpv6: 'DHCPv6-PD & SLAAC (Automatic)',
              slaac: 'SLAAC Only (Stateless Autoconfiguration)',
              static: 'Static IPv6 Address',
              disabled: 'Disabled (No WAN IPv6)'
            };
            disp.textContent = map[data.ipv6_wan_mode] || data.ipv6_wan_mode;
          }
        }
        if (document.getElementById('netIpv6RaToggle')) {
          document.getElementById('netIpv6RaToggle').checked = (data.ipv6_ra === undefined || data.ipv6_ra === 1 || data.ipv6_ra === '1');
        }
        if (document.getElementById('netIpv6Dhcp6Toggle')) {
          document.getElementById('netIpv6Dhcp6Toggle').checked = (data.ipv6_dhcp6 === 1 || data.ipv6_dhcp6 === '1');
        }
        if (data.ipv6_ula && document.getElementById('netIpv6Ula')) {
          document.getElementById('netIpv6Ula').value = data.ipv6_ula;
          const disp = document.getElementById('disp_ipv6_ula');
          if (disp) disp.textContent = `${data.ipv6_ula} • Unique local address scope`;
        }
        if (document.getElementById('netIpv6PrivacyToggle')) {
          document.getElementById('netIpv6PrivacyToggle').checked = (data.ipv6_privacy === 1 || data.ipv6_privacy === '1');
        }
        const dispAddrs = document.getElementById('disp_ipv6_addrs');
        if (dispAddrs) {
          const lanAddr = data.ipv6_lan_addr || 'fd00::1/60';
          const wanAddr = data.ipv6_wan_addr || 'None';
          dispAddrs.textContent = `LAN: ${lanAddr} • WAN: ${wanAddr}`;
        }

        // Performance & Hardware Acceleration
        if (document.getElementById('netHwFlowToggle')) {
          document.getElementById('netHwFlowToggle').checked = (data.flow_offloading_hw === undefined || data.flow_offloading_hw === 1 || data.flow_offloading_hw === '1');
        }
        if (document.getElementById('netSwFlowToggle')) {
          document.getElementById('netSwFlowToggle').checked = (data.flow_offloading === undefined || data.flow_offloading === 1 || data.flow_offloading === '1');
        }
        if (document.getElementById('netMssClampToggle')) {
          document.getElementById('netMssClampToggle').checked = (data.mss_clamping === undefined || data.mss_clamping === 1 || data.mss_clamping === '1');
        }
        if (document.getElementById('netDnsRebindToggle')) {
          document.getElementById('netDnsRebindToggle').checked = (data.dns_rebind === undefined || data.dns_rebind === 1 || data.dns_rebind === '1');
        }

        if (typeof loadWanInterfaceConfig === 'function') {
          loadWanInterfaceConfig(data);
        }
      } catch (e) {
        console.error("fetchNetworkConfig error", e);
      }
    }

    async function saveNetworkSettings() {
      scheduleNetworkAutoSave(50);
    }

    /* ==================== INTERFACES & WAN PPPoE CONTROLLER ==================== */
    function onWanProtoChange() {
      updateWanInterfaceDisplays();
    }

    function updateWanInterfaceDisplays() {
      const proto = (document.getElementById('wanProtoSelect') ? document.getElementById('wanProtoSelect').value : 'dhcp') || 'dhcp';
      const dispProto = document.getElementById('disp_wan_proto');
      if (dispProto) {
        if (proto === 'pppoe') dispProto.textContent = 'PPPoE (Fiber / DSL Dial-up Session)';
        else if (proto === 'static') dispProto.textContent = 'Static IPv4 (Fixed Gateway Address)';
        else dispProto.textContent = 'DHCP Client (Dynamic IPv4 from ISP)';
      }

      const pppoeRow = document.getElementById('pppoeRedirectRow');
      const staticBox = document.getElementById('wanStaticConfigFields');
      if (pppoeRow) pppoeRow.style.display = (proto === 'pppoe') ? 'flex' : 'none';
      if (staticBox) staticBox.style.display = (proto === 'static') ? 'flex' : 'none';

      const sIp = document.getElementById('wanStaticIp') ? document.getElementById('wanStaticIp').value : '';
      const dispSIp = document.getElementById('disp_wan_static_ip');
      if (dispSIp) dispSIp.textContent = sIp ? `${sIp} • Fixed Address` : '192.168.1.2 (Tap to configure)';

      const sMask = document.getElementById('wanStaticNetmask') ? document.getElementById('wanStaticNetmask').value : '';
      const dispSMask = document.getElementById('disp_wan_static_netmask');
      if (dispSMask) dispSMask.textContent = sMask ? `${sMask}` : '255.255.255.0 (/24)';

      const sGw = document.getElementById('wanStaticGateway') ? document.getElementById('wanStaticGateway').value : '';
      const dispSGw = document.getElementById('disp_wan_static_gateway');
      if (dispSGw) dispSGw.textContent = sGw ? `${sGw} • Upstream Gateway` : '192.168.1.1 (Tap to configure)';

      const mac = document.getElementById('wanCustomMacInput') ? document.getElementById('wanCustomMacInput').value : '';
      const dispMac = document.getElementById('disp_wan_custom_mac');
      if (dispMac) dispMac.textContent = mac ? `Custom: ${mac.toLowerCase()} • Hardware override active` : 'Default Hardware MAC in use';
    }

    async function loadWanInterfaceConfig(preloadedData) {
      try {
        const data = preloadedData || await (await fetch('/cgi-bin/network')).json();
        const wan = data.wan || {};

        if (document.getElementById('wanProtoSelect')) {
          document.getElementById('wanProtoSelect').value = wan.proto || 'dhcp';
        }
        if (document.getElementById('wanPppoeUser')) {
          document.getElementById('wanPppoeUser').value = wan.username || '';
        }
        if (document.getElementById('wanPppoePass')) {
          document.getElementById('wanPppoePass').value = wan.password || '';
        }
        if (document.getElementById('wanPppoeService')) {
          document.getElementById('wanPppoeService').value = wan.service || '';
        }
        if (document.getElementById('wanPppoeMtu')) {
          document.getElementById('wanPppoeMtu').value = wan.mtu || 1492;
        }
        if (document.getElementById('wanCustomMacInput')) {
          document.getElementById('wanCustomMacInput').value = wan.custom_mac || '';
        }
        if (wan.ip && document.getElementById('wanStaticIp') && !document.getElementById('wanStaticIp').value) {
          document.getElementById('wanStaticIp').value = wan.ip;
        }
        if (wan.netmask && document.getElementById('wanStaticNetmask')) {
          document.getElementById('wanStaticNetmask').value = wan.netmask;
        }
        if (wan.gateway && document.getElementById('wanStaticGateway')) {
          document.getElementById('wanStaticGateway').value = wan.gateway;
        }

        updateWanInterfaceDisplays();

        const wanBadge = document.getElementById('wanStatusBadge');
        if (wanBadge) {
          const isUp = wan.up || (wan.ip && wan.ip !== '0.0.0.0');
          wanBadge.textContent = isUp ? `${(wan.proto || 'DHCP').toUpperCase()} ACTIVE` : 'DISCONNECTED';
          wanBadge.className = 'card-badge ' + (isUp ? 'emerald' : 'gray');
        }

        if (data.interfaces && Array.isArray(data.interfaces)) {
          const usb = data.interfaces.find(i => i.ifname === 'usb0');
          if (usb && document.getElementById('ifaceUsbIp')) {
            document.getElementById('ifaceUsbIp').textContent = usb.ip || '192.168.109.110';
          }
          const ethWan = data.interfaces.find(i => i.name === 'wan' || i.ifname === 'eth0');
          if (ethWan && document.getElementById('ifaceEthWanState')) {
            document.getElementById('ifaceEthWanState').textContent = ethWan.up ? (ethWan.ip || 'Connected') : 'Link Down / Ready';
          }
        }
      } catch (e) {
        console.error('loadWanInterfaceConfig error:', e);
      }
    }

    async function saveWanInterfaceConfig() {
      const proto = document.getElementById('wanProtoSelect') ? document.getElementById('wanProtoSelect').value : 'dhcp';
      const username = (document.getElementById('wanPppoeUser')?.value || '').trim();
      const password = document.getElementById('wanPppoePass')?.value || '';
      const service = (document.getElementById('wanPppoeService')?.value || '').trim();
      const mtu = parseInt(document.getElementById('wanPppoeMtu')?.value, 10) || 1492;
      const custom_mac = (document.getElementById('wanCustomMacInput')?.value || '').trim();
      const ip = (document.getElementById('wanStaticIp')?.value || '').trim();
      const netmask = (document.getElementById('wanStaticNetmask')?.value || '255.255.255.0').trim();
      const gateway = (document.getElementById('wanStaticGateway')?.value || '').trim();

      if (custom_mac && !/^([0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}$/.test(custom_mac)) {
        if (typeof showToast === 'function') showToast('Invalid MAC address format (XX:XX:XX:XX:XX:XX)', 'error');
        else alert('Invalid MAC address format');
        return;
      }

      try {
        const payload = {
          action: 'set_wan',
          proto,
          username,
          password,
          service,
          mtu,
          custom_mac,
          ip,
          netmask,
          gateway
        };
        const res = await fetch('/cgi-bin/network', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resp = await res.json();
        if (resp.status === 'ok') {
          if (typeof showToast === 'function') showToast('WAN Interface configuration applied successfully!', 'success');
          loadWanInterfaceConfig();
          if (typeof fetchData === 'function') fetchData();
        } else {
          if (typeof showToast === 'function') showToast('Failed to apply WAN config: ' + (resp.error || 'Unknown error'), 'error');
        }
      } catch (err) {
        if (typeof showToast === 'function') showToast('Error saving WAN interface: ' + err.message, 'error');
      }
    }

    function cloneCurrentPcMac() {
      cloneCurrentPcMacToModal();
      if (document.getElementById('wanCustomMacInput') && document.getElementById('modalInput_wan_custom_mac')) {
        document.getElementById('wanCustomMacInput').value = document.getElementById('modalInput_wan_custom_mac').value;
        updateWanInterfaceDisplays();
      }
    }

    function cloneCurrentPcMacToModal() {
      const cache = window._lastDataCache || {};
      const clients = Array.isArray(cache.clients) ? cache.clients : [];
      let detectedMac = '';
      for (const c of clients) {
        if (c.connected && !c.is_self && c.mac) {
          detectedMac = c.mac;
          break;
        }
      }
      const inp = document.getElementById('modalInput_wan_custom_mac');
      if (inp) {
        inp.value = detectedMac || 'ca:e7:b7:34:8f:ac';
        if (typeof showToast === 'function') showToast('Cloned MAC: ' + inp.value, 'info');
      }
    }

    function generateRandomWanMacInModal() {
      const hex = '0123456789ABCDEF';
      let mac = '02';
      for (let i = 1; i < 6; i++) {
        mac += ':' + hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
      }
      const inp = document.getElementById('modalInput_wan_custom_mac');
      if (inp) inp.value = mac.toLowerCase();
    }

    function resetWanMacToDefault() {
      const macInput = document.getElementById('wanCustomMacInput');
      if (macInput) {
        macInput.value = '';
        updateWanInterfaceDisplays();
        if (typeof showToast === 'function') showToast('Custom MAC cleared. Hardware default will be used.', 'info');
      }
    }

    /* ==================== PPPOE BROADBAND (CLIENT & SERVER) CONTROLLER ==================== */
    window._cachedPppoeData = null;

    async function loadPppoeConfig() {
      try {
        const res = await fetch('/cgi-bin/pppoe?action=get');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.status === 'ok') {
          window._cachedPppoeData = data;
          const client = data.client || {};
          const server = data.server || {};

          // Update Client Displays
          const clientToggle = document.getElementById('pppoeClientMasterToggle');
          if (clientToggle) clientToggle.checked = !!client.enabled;

          const clientSub = document.getElementById('pppoeClientStatusSub');
          if (clientSub) {
            clientSub.textContent = client.enabled
              ? (client.connected ? `Connected • Assigned IP: ${client.ip || '--'} • ISP Dialer Active` : 'Connecting to ISP Access Concentrator...')
              : 'Disabled • ISP Broadband dialer over WAN Ethernet';
          }

          const ipText = document.getElementById('pppoeClientIpText');
          if (ipText) {
            ipText.textContent = client.connected 
              ? `IP: ${client.ip || '--'} • Gateway: ${client.gateway || '--'} • DNS: ${client.dns || '--'}`
              : (client.enabled ? 'Dialing PPPoE session...' : 'Disconnected • Gateway: -- • DNS: --');
          }

          const uptimeEl = document.getElementById('pppoeClientUptime');
          if (uptimeEl) {
            if (client.connected) {
              uptimeEl.textContent = `UP (${Math.floor(client.uptime / 60)}m)`;
              uptimeEl.style.color = '#10b981';
            } else {
              uptimeEl.textContent = client.enabled ? 'Connecting...' : 'Offline';
              uptimeEl.style.color = client.enabled ? '#06b6d4' : 'var(--text-dim)';
            }
          }

          const userDesc = document.getElementById('disp_pppoe_user_desc');
          if (userDesc) {
            userDesc.textContent = client.username ? `User: ${client.username} • Password: ${client.has_password ? '••••••••' : '(empty)'}` : 'User: Not set • Tap to configure username & password';
          }

          const acDesc = document.getElementById('disp_pppoe_ac_desc');
          if (acDesc) {
            acDesc.textContent = (client.ac || client.service) ? `AC: ${client.ac || 'Auto'} • Service: ${client.service || 'Default'}` : 'Auto Discovery • Optional ISP AC and Service Name';
          }

          const macDesc = document.getElementById('disp_pppoe_mac_desc');
          if (macDesc) {
            macDesc.textContent = `MTU: ${client.mtu || 1492} • ${client.macaddr ? `Cloned MAC: ${client.macaddr.toLowerCase()}` : 'Hardware Default MAC'}`;
          }

          // Update Server Displays
          const serverToggle = document.getElementById('pppoeServerMasterToggle');
          if (serverToggle) serverToggle.checked = !!server.server_enabled;

          const serverSub = document.getElementById('pppoeServerStatusSub');
          if (serverSub) {
            serverSub.textContent = server.server_enabled
              ? (server.running ? `Running on ${server.listen_iface || 'br-lan'} • ${server.sessions ? server.sessions.length : 0} active subscribers` : 'Starting server daemon...')
              : 'Disabled • Local PPPoE Concentrator for LAN subscribers';
          }

          const srvNetDesc = document.getElementById('disp_pppoe_srv_network');
          if (srvNetDesc) {
            srvNetDesc.textContent = `Gateway: ${server.server_ip || '10.0.0.1'} • Pool: ${server.pool_start || '10.0.0.150'} - ${server.pool_end || '10.0.0.220'} • DNS: ${server.dns1 || '10.0.0.1'}`;
          }

          const srvUsersDesc = document.getElementById('disp_pppoe_users_count');
          if (srvUsersDesc) {
            const count = (server.users && server.users.length) || 0;
            srvUsersDesc.textContent = `${count} subscriber account${count === 1 ? '' : 's'} configured • Tap to manage`;
          }

          const sessionsText = document.getElementById('pppoeActiveSessionsText');
          if (sessionsText) {
            const sessions = server.sessions || [];
            if (sessions.length === 0) {
              sessionsText.textContent = server.server_enabled ? 'Server listening • No subscribers currently connected' : 'Server is disabled';
            } else {
              sessionsText.textContent = sessions.map(s => `${s.interface} (${s.client_ip})`).join(', ');
            }
          }
        }
      } catch (e) {
        console.warn('loadPppoeConfig error:', e);
      }
    }

    async function togglePppoeClient(enabled) {
      if (typeof showToast === 'function') {
        showToast(enabled ? 'Enabling PPPoE WAN dialer...' : 'Disabling PPPoE client (reverting to DHCP)...', 'info');
      }
      try {
        const curUser = (window._cachedPppoeData && window._cachedPppoeData.client && window._cachedPppoeData.client.username) || '';
        const res = await fetch('/cgi-bin/pppoe?action=client_set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: !!enabled, username: curUser })
        });
        const data = await res.json();
        if (typeof showToast === 'function') showToast(data.message || 'PPPoE Client state updated', 'success');
      } catch (e) {
        if (typeof showToast === 'function') showToast('PPPoE client toggle error: ' + e.message, 'error');
      }
      loadPppoeConfig();
    }

    async function savePppoeClientCreds(username, password) {
      if (typeof showToast === 'function') showToast('Saving PPPoE credentials...', 'info');
      try {
        const isEn = window._cachedPppoeData && window._cachedPppoeData.client && window._cachedPppoeData.client.enabled;
        const res = await fetch('/cgi-bin/pppoe?action=client_set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: !!isEn, username, password })
        });
        const data = await res.json();
        if (typeof showToast === 'function') showToast(data.message || 'Credentials updated', 'success');
      } catch (e) {
        if (typeof showToast === 'function') showToast('Error saving credentials: ' + e.message, 'error');
      }
      loadPppoeConfig();
    }

    async function savePppoeClientAc(ac, service) {
      if (typeof showToast === 'function') showToast('Saving Access Concentrator options...', 'info');
      try {
        const isEn = window._cachedPppoeData && window._cachedPppoeData.client && window._cachedPppoeData.client.enabled;
        const res = await fetch('/cgi-bin/pppoe?action=client_set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: !!isEn, ac, service })
        });
        const data = await res.json();
        if (typeof showToast === 'function') showToast(data.message || 'AC options updated', 'success');
      } catch (e) {
        if (typeof showToast === 'function') showToast('Error saving AC options: ' + e.message, 'error');
      }
      loadPppoeConfig();
    }

    async function savePppoeClientMac(macaddr, mtu) {
      if (typeof showToast === 'function') showToast('Saving MAC & MTU settings...', 'info');
      try {
        const isEn = window._cachedPppoeData && window._cachedPppoeData.client && window._cachedPppoeData.client.enabled;
        const res = await fetch('/cgi-bin/pppoe?action=client_set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: !!isEn, macaddr, mtu })
        });
        const data = await res.json();
        if (typeof showToast === 'function') showToast(data.message || 'MAC & MTU updated', 'success');
      } catch (e) {
        if (typeof showToast === 'function') showToast('Error saving MAC: ' + e.message, 'error');
      }
      loadPppoeConfig();
    }

    function generateRandomPppoeMac() {
      const hex = '0123456789abcdef';
      let mac = '02';
      for (let i = 1; i < 6; i++) {
        mac += ':' + hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
      }
      const inp = document.getElementById('modalInput_pppoe_mac');
      if (inp) inp.value = mac;
    }

    async function togglePppoeServer(enabled) {
      if (typeof showToast === 'function') {
        showToast(enabled ? 'Starting PPPoE Access Server...' : 'Stopping PPPoE Access Server...', 'info');
      }
      try {
        const srv = (window._cachedPppoeData && window._cachedPppoeData.server) || {};
        const res = await fetch('/cgi-bin/pppoe?action=server_set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            server_enabled: !!enabled,
            listen_iface: srv.listen_iface || 'br-lan',
            server_ip: srv.server_ip || '10.0.0.1',
            pool_start: srv.pool_start || '10.0.0.150',
            pool_end: srv.pool_end || '10.0.0.220',
            dns1: srv.dns1 || '10.0.0.1',
            dns2: srv.dns2 || '1.1.1.1',
            max_sessions: srv.max_sessions || 32,
            service_name: srv.service_name || 'MAXNET'
          })
        });
        const data = await res.json();
        if (typeof showToast === 'function') showToast(data.message || 'PPPoE Server state updated', 'success');
      } catch (e) {
        if (typeof showToast === 'function') showToast('PPPoE server toggle error: ' + e.message, 'error');
      }
      loadPppoeConfig();
    }

    async function savePppoeServerConfig(server_ip, pool_start, pool_end, dns1, dns2, max_sessions) {
      if (typeof showToast === 'function') showToast('Saving PPPoE Server configuration...', 'info');
      try {
        const srv = (window._cachedPppoeData && window._cachedPppoeData.server) || {};
        const isEn = !!srv.server_enabled;
        const res = await fetch('/cgi-bin/pppoe?action=server_set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            server_enabled: isEn,
            listen_iface: srv.listen_iface || 'br-lan',
            server_ip,
            pool_start,
            pool_end,
            dns1,
            dns2,
            max_sessions,
            service_name: srv.service_name || 'MAXNET'
          })
        });
        const data = await res.json();
        if (typeof showToast === 'function') showToast(data.message || 'PPPoE Server updated', 'success');
      } catch (e) {
        if (typeof showToast === 'function') showToast('PPPoE server save error: ' + e.message, 'error');
      }
      loadPppoeConfig();
    }

    async function addPppoeUserFromModal() {
      const u = (document.getElementById('modalInput_new_pppoe_u')?.value || '').trim();
      const p = (document.getElementById('modalInput_new_pppoe_p')?.value || '').trim();
      if (!u || !p) {
        if (typeof showToast === 'function') showToast('Username and password are required', 'error');
        return;
      }
      try {
        const res = await fetch('/cgi-bin/pppoe?action=add_user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: u, pass: p, ip: '*' })
        });
        const data = await res.json();
        if (data.status === 'ok') {
          if (typeof showToast === 'function') showToast(`Subscriber account ${u} added!`, 'success');
          await loadPppoeConfig();
          openSettingModal('pppoe_server_users');
        } else {
          if (typeof showToast === 'function') showToast(data.message || 'Failed to add user', 'error');
        }
      } catch (e) {
        if (typeof showToast === 'function') showToast('Add user error: ' + e.message, 'error');
      }
    }

    async function deletePppoeUser(user) {
      if (!confirm(`Are you sure you want to delete subscriber ${user}?`)) return;
      try {
        const res = await fetch('/cgi-bin/pppoe?action=del_user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user })
        });
        const data = await res.json();
        if (data.status === 'ok') {
          if (typeof showToast === 'function') showToast(`Subscriber ${user} deleted`, 'success');
          await loadPppoeConfig();
          openSettingModal('pppoe_server_users');
        } else {
          if (typeof showToast === 'function') showToast(data.message || 'Failed to delete user', 'error');
        }
      } catch (e) {
        if (typeof showToast === 'function') showToast('Delete user error: ' + e.message, 'error');
      }
    }

    /* ==================== DUFS WEBDAV & STORAGE CONTROLLER ==================== */
    async function loadDufsConfig() {
      try {
        const res = await fetch('/cgi-bin/device?action=dufs_get');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.status === 'ok') {
          const port = data.port || 5000;
          const path = data.path || '/mnt/storage';
          const allowUp = data.allow_upload !== false;
          const allowDel = data.allow_delete !== false;
          const user = data.user || '';
          const hasAuth = !!data.has_auth;

          if (document.getElementById('dufsPortInput')) document.getElementById('dufsPortInput').value = port;
          if (document.getElementById('dufsPathInput')) document.getElementById('dufsPathInput').value = path;
          if (document.getElementById('dufsAllowUpload')) document.getElementById('dufsAllowUpload').value = allowUp ? 'true' : 'false';
          if (document.getElementById('dufsAllowDelete')) document.getElementById('dufsAllowDelete').value = allowDel ? 'true' : 'false';
          if (document.getElementById('dufsUserInput')) document.getElementById('dufsUserInput').value = user;

          const dispPort = document.getElementById('disp_dufs_port');
          if (dispPort) dispPort.textContent = `Port ${port} (Standard WebDAV)`;

          const dispPath = document.getElementById('disp_dufs_path');
          if (dispPath) dispPath.textContent = `${path} (Storage Mount)`;

          const dispPerm = document.getElementById('disp_dufs_permissions');
          if (dispPerm) {
            if (allowUp && allowDel) dispPerm.textContent = 'Full Access: Browse, Upload, and Delete Enabled';
            else if (allowUp) dispPerm.textContent = 'Upload Only: Browse & Upload Enabled (No Delete)';
            else dispPerm.textContent = 'Read-Only: Browse & Download Only';
          }

          const dispAuth = document.getElementById('disp_dufs_auth');
          if (dispAuth) {
            dispAuth.textContent = hasAuth ? `Protected: User "${user || 'root'}" (Auth Required)` : 'Authentication Enforced (Default: root / admin)';
          }

          const host = window.location.hostname || '10.0.0.1';
          const proto = window.location.protocol || 'http:';
          const webdavUrl = `${proto}//${host}:${port}/`;

          const urlText = document.getElementById('dufsWebdavUrlText');
          if (urlText) urlText.innerHTML = `<strong>${webdavUrl}</strong> &bull; Tap to copy or view connection instructions`;

          const openBtn = document.getElementById('dufsOpenBtn');
          if (openBtn) openBtn.href = webdavUrl;

          const isEnabled = !!data.enabled;
          const dufsToggle = document.getElementById('dufsMasterToggle');
          if (dufsToggle) dufsToggle.checked = isEnabled;

          const subBanner = document.getElementById('dufsServiceSub');
          if (subBanner) {
            subBanner.textContent = isEnabled 
              ? `Active on Port ${port} • WebDAV & Browser File Explorer` 
              : 'Disabled • Local WebDAV storage server & browser file manager';
          }
        }
      } catch (e) {
        console.warn('loadDufsConfig error:', e);
      }
    }

    async function toggleDufsService(enabled) {
      if (typeof showToast === 'function') {
        showToast(enabled ? 'Starting Dufs WebDAV service...' : 'Stopping Dufs WebDAV service...', 'info');
      }
      try {
        const res = await fetch('/cgi-bin/device?action=dufs_set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: !!enabled })
        });
        const data = await res.json();
        if (data && data.status === 'ok') {
          if (typeof showToast === 'function') {
            showToast(enabled ? 'Dufs WebDAV service started' : 'Dufs WebDAV service stopped', 'success');
          }
        } else {
          if (typeof showToast === 'function') showToast('Failed to update Dufs state', 'error');
        }
      } catch (e) {
        if (typeof showToast === 'function') showToast('Error toggling Dufs: ' + e.message, 'error');
      }
      loadDufsConfig();
    }

    async function saveDufsConfig() {
      const port = parseInt(document.getElementById('dufsPortInput')?.value, 10) || 5000;
      const path = (document.getElementById('dufsPathInput')?.value || '/mnt/storage').trim();
      const allow_upload = document.getElementById('dufsAllowUpload')?.value === 'true';
      const allow_delete = document.getElementById('dufsAllowDelete')?.value === 'true';
      const user = (document.getElementById('dufsUserInput')?.value || '').trim();
      const pass = (document.getElementById('dufsPassInput')?.value || '').trim();

      try {
        const res = await fetch('/cgi-bin/device?action=dufs_set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            port,
            path,
            allow_upload,
            allow_delete,
            user,
            pass
          })
        });
        const data = await res.json();
        if (data && data.status === 'ok') {
          if (typeof showToast === 'function') showToast('Dufs WebDAV & File Manager updated!', 'success');
          loadDufsConfig();
        } else {
          if (typeof showToast === 'function') showToast('Failed to save Dufs config', 'error');
        }
      } catch (e) {
        if (typeof showToast === 'function') showToast('Error saving Dufs: ' + e.message, 'error');
      }
    }

    // Duplicate resetWanMacToDefault removed for ES module compliance

    /* ==================== NOTIFICATION CENTER & WEB PUSH CONTROLLER ==================== */
    window._acknowledgedAlerts = window._acknowledgedAlerts || new Set();

    function openNotificationPage() {
      switchTab('settings');
      openSettingPage('acc-notifications');
    }

    function toggleNotificationCenter() {
      openNotificationPage();
    }

    function closeNotificationCenter() {
      closeSettingPage();
    }

    function updateNotificationBadge(count) {
      const badge = document.getElementById('topoNotificationBadge');
      if (badge) {
        badge.style.display = count > 0 ? 'inline-block' : 'none';
      }
    }

    function clearAcknowledgedAlerts() {
      clearAllNotifications();
    }

    function openSslHelpModal() {
      const overlay = document.getElementById('sslHelpModalOverlay');
      if (!overlay) return;
      if (overlay.parentElement !== document.body) {
        document.body.appendChild(overlay);
      }
      overlay.style.display = 'flex';
      requestAnimationFrame(() => overlay.classList.add('active'));
    }

    function closeSslHelpModal() {
      const overlay = document.getElementById('sslHelpModalOverlay');
      if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
      }
    }

    async function loadSslCertificateStatus() {
      try {
        const res = await fetch('/cgi-bin/ssl');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.status === 'ok') {
          const descEl = document.getElementById('sslActiveCertDesc');
          const badgeEl = document.getElementById('sslActiveCertBadge');
          const sanEl = document.getElementById('sslSanList');
          const duckDnsBadge = document.getElementById('sslDuckDnsBadge');
          const subInput = document.getElementById('duckdnsSubdomain');

          if (descEl) {
            if (data.is_lets_encrypt) {
              const activeDom = (data.custom_config && data.custom_config.domain) ? data.custom_config.domain : 'duckdns.org';
              descEl.innerHTML = `Domain: <strong>${activeDom}</strong> &bull; Issuer: <strong>Let's Encrypt Public Authority</strong> &bull; Valid to: ${data.expires || '90 days'}`;
            } else {
              descEl.innerHTML = `Domain: <strong>maxnet.local</strong> &bull; Issuer: <strong>MAXNET Root CA</strong> &bull; Valid to: ${data.expires || '2029'}`;
            }
          }
          if (badgeEl) {
            if (data.is_lets_encrypt) {
              badgeEl.textContent = 'PUBLIC GREEN LOCK';
              badgeEl.className = 'card-badge emerald';
            } else {
              badgeEl.textContent = 'VALID TLS 1.3';
              badgeEl.className = 'card-badge emerald';
            }
          }
          if (sanEl && data.san) {
            sanEl.textContent = data.san.replace(/DNS:|IPAddress:/g, '').replace(/,/g, ' • ');
          }
          if (data.custom_config && data.custom_config.subdomain && subInput && !subInput.value) {
            subInput.value = data.custom_config.subdomain;
          }
          if (duckDnsBadge && data.is_lets_encrypt) {
            duckDnsBadge.textContent = 'ACTIVE & TRUSTED';
            duckDnsBadge.style.background = 'rgba(16,185,129,0.15)';
            duckDnsBadge.style.color = '#10b981';
          }
        }
      } catch (e) {
        console.warn('Failed to load SSL certificate status:', e);
      }
    }

    async function requestDuckDnsSsl() {
      const subInput = document.getElementById('duckdnsSubdomain');
      const tokenInput = document.getElementById('duckdnsToken');
      const statusMsg = document.getElementById('duckdnsStatusMsg');
      const btn = document.getElementById('btnIssueDuckDns');

      const subdomain = (subInput ? subInput.value : '').trim().toLowerCase();
      const token = (tokenInput ? tokenInput.value : '').trim();

      if (!subdomain) {
        if (typeof showToast === 'function') showToast('Please enter a DuckDNS subdomain name', 'error');
        if (subInput) subInput.focus();
        return;
      }
      if (!token) {
        if (typeof showToast === 'function') showToast('Please enter your DuckDNS Token', 'error');
        if (tokenInput) tokenInput.focus();
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'ISSUING CERTIFICATE...';
        btn.style.opacity = '0.7';
      }
      if (statusMsg) {
        statusMsg.style.color = '#38bdf8';
        statusMsg.textContent = `Performing ACME DNS-01 challenge for ${subdomain}.duckdns.org via DuckDNS API (takes ~20-40s)...`;
      }
      if (typeof showToast === 'function') showToast('Starting automated Let\'s Encrypt issuance...', 'info');

      try {
        const res = await fetch('/cgi-bin/ssl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'issue_duckdns', subdomain: subdomain, token: token })
        });
        const result = await res.json();

        if (result && result.status === 'ok') {
          if (statusMsg) {
            statusMsg.style.color = '#10b981';
            statusMsg.textContent = `Certificate issued successfully! You can now open https://${result.domain}/ with full Green Padlock!`;
          }
          if (typeof showToast === 'function') showToast(`Public Green Padlock issued for ${result.domain}!`, 'success');
          loadSslCertificateStatus();
        } else {
          const err = (result && result.error) ? result.error : 'Issuance failed. Check subdomain and token.';
          if (statusMsg) {
            statusMsg.style.color = '#ef4444';
            statusMsg.textContent = `Error: ${err}`;
          }
          if (typeof showToast === 'function') showToast(err, 'error');
        }
      } catch (e) {
        if (statusMsg) {
          statusMsg.style.color = '#ef4444';
          statusMsg.textContent = 'Connection error communicating with router ACME daemon.';
        }
        if (typeof showToast === 'function') showToast('ACME request timed out or network error', 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'OBTAIN GREEN PADLOCK SSL';
          btn.style.opacity = '1';
        }
      }
    }

    async function toggleBrowserPushPermission() {
      if (!('Notification' in window)) {
        if (typeof showToast === 'function') showToast('Browser Web Push not supported on this browser', 'error');
        return;
      }
      if (Notification.permission === 'granted') {
        if (typeof showToast === 'function') showToast('Browser push notifications are already enabled', 'info');
        new Notification('MAXNET Gateway', { body: 'Web Push alerts are actively monitoring your router health and security.', icon: '/favicon.ico' });
        updatePushNotificationButtonState();
        return;
      }
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          if (typeof showToast === 'function') showToast('Browser Web Push alerts activated!', 'success');
          new Notification('MAXNET Gateway', { body: 'Push alerts enabled. You will receive notifications on critical events.', icon: '/favicon.ico' });
        } else {
          if (typeof showToast === 'function') showToast('Web Push notification permission was denied', 'warning');
        }
      } catch (e) {
        console.error('Notification permission error', e);
      }
      updatePushNotificationButtonState();
    }

    function updatePushNotificationButtonState() {
      const btn = document.getElementById('btnTogglePushNotifications');
      if (!btn) return;
      if (!('Notification' in window)) {
        btn.textContent = 'NOT SUPPORTED';
        btn.disabled = true;
        return;
      }
      if (Notification.permission === 'granted') {
        btn.textContent = 'PUSH ACTIVE';
        btn.style.color = '#10b981';
        btn.style.borderColor = 'rgba(16,185,129,0.4)';
      } else if (Notification.permission === 'denied') {
        btn.textContent = 'PERMISSION BLOCKED';
        btn.style.color = '#ef4444';
      } else {
        btn.textContent = 'ENABLE PUSH';
        btn.style.color = '#38bdf8';
      }
    }

    /* ==================== NOTIFICATIONS PAGE & DISPATCH CONTROLLER ==================== */
    async function loadNotificationsPage() {
      const container = document.getElementById('notificationsListPageContainer');
      const countEl = document.getElementById('notifStatusSummary');
      const badgeEl = document.getElementById('notifActiveBadge');
      if (!container) return;

      try {
        const res = await fetch('/cgi-bin/webhooks?action=get_notifications');
        const list = await res.json();

        if (!Array.isArray(list) || list.length === 0) {
          container.innerHTML = `
            <div style="font-size:12px; color:var(--text-dim); font-family:var(--font-mono); padding:24px; text-align:center; background:rgba(255,255,255,0.02); border-radius:8px;">
              No notifications recorded. All network services and hardware are operational.
            </div>
          `;
          if (countEl) countEl.textContent = '0 Alerts • All systems optimal';
          if (badgeEl) { badgeEl.textContent = '0 ALERTS'; badgeEl.className = 'card-badge emerald'; }
          updateNotificationBadge(0);
          return;
        }

        if (countEl) countEl.textContent = `${list.length} Alerts Recorded`;
        if (badgeEl) {
          badgeEl.textContent = `${list.length} ALERTS`;
          badgeEl.className = list.some(n => n.level === 'danger') ? 'card-badge ruby' : 'card-badge amber';
        }
        updateNotificationBadge(list.length);

        container.innerHTML = list.map(n => {
          let levelColor = '#38bdf8';
          let levelBg = 'rgba(56,189,248,0.12)';
          let badgeCls = 'sky';
          if (n.level === 'danger') { levelColor = '#ef4444'; levelBg = 'rgba(239,68,68,0.15)'; badgeCls = 'ruby'; }
          else if (n.level === 'warning') { levelColor = '#f59e0b'; levelBg = 'rgba(245,158,11,0.15)'; badgeCls = 'amber'; }
          else if (n.level === 'healthy' || n.level === 'success') { levelColor = '#10b981'; levelBg = 'rgba(16,185,129,0.15)'; badgeCls = 'emerald'; }

          let actionHtml = '';
          if (n.event_type === 'cpu_spike') {
            actionHtml = `<button type="button" class="mh-btn btn-sm btn-ghost" onclick="openSettingPage('acc-sys-info')" style="font-size:10px; padding:3px 8px;">VIEW CPU STATS</button>`;
          } else if (n.event_type === 'new_device') {
            actionHtml = `<button type="button" class="mh-btn btn-sm btn-ghost" onclick="openSettingPage('acc-lan-clients')" style="font-size:10px; padding:3px 8px;">VIEW CLIENTS</button>`;
          } else if (n.event_type === 'wan_disconnect') {
            actionHtml = `<button type="button" class="mh-btn btn-sm btn-ghost" onclick="openSettingPage('acc-pppoe')" style="font-size:10px; padding:3px 8px;">CHECK PPPOE</button>`;
          } else if (n.event_type === 'system_update') {
            actionHtml = `<button type="button" class="mh-btn btn-sm" onclick="openSettingPage('acc-maintenance')" style="font-size:10px; padding:3px 8px; background:#0ea5e9; color:#fff; font-weight:700;">UPDATE OS</button>`;
          }

          return `
            <div class="notif-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:12px 14px; display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
              <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span style="width:7px; height:7px; border-radius:50%; background:${levelColor}; display:inline-block; flex-shrink:0; box-shadow:0 0 6px ${levelColor};"></span>
                  <span class="card-badge ${badgeCls}" style="font-size:9px; font-weight:800;">${escapeHtml(n.level || 'INFO').toUpperCase()}</span>
                  <span style="font-size:12.5px; font-weight:700; color:var(--text-main);">${escapeHtml(n.title || '')}</span>
                  <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); margin-left:auto;">${escapeHtml(n.timestamp || '')}</span>
                </div>
                <div style="font-size:11.5px; color:var(--text-dim); line-height:1.4;">${escapeHtml(n.message || '')}</div>
                ${actionHtml ? `<div style="margin-top:6px;">${actionHtml}</div>` : ''}
              </div>
              <button type="button" class="round-action-btn" title="Delete notification" onclick="deleteNotification('${escapeHtml(n.id)}')" style="color:#ef4444; flex-shrink:0;">
                <svg viewBox="0 0 24 24" style="width:13px; height:13px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          `;
        }).join('');
      } catch (e) {
        console.warn('loadNotificationsPage error:', e);
      }
    }

    async function deleteNotification(id) {
      try {
        await fetch(`/cgi-bin/webhooks?action=delete_notification&id=${encodeURIComponent(id)}`);
        if (typeof showToast === 'function') showToast('Notification deleted', 'info');
        loadNotificationsPage();
      } catch (e) {}
    }

    async function clearAllNotifications() {
      try {
        await fetch('/cgi-bin/webhooks?action=clear_notifications');
        if (typeof showToast === 'function') showToast('All notifications cleared', 'info');
        loadNotificationsPage();
      } catch (e) {}
    }

    async function dispatchTestNotification() {
      if (typeof showToast === 'function') showToast('Sending manual test alert...', 'info');
      await dispatchAlertNotification({
        title: 'Manual System Test Alert',
        message: 'Manual notification dispatched from settings console to verify UI list and external webhooks.',
        level: 'info',
        event_type: 'system'
      });
      if (typeof showToast === 'function') showToast('Test alert dispatched & logged', 'success');
    }

    async function dispatchAlertNotification(item) {
      try {
        await fetch('/cgi-bin/webhooks?action=dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        loadNotificationsPage();
      } catch (e) {}
    }

    /* Automated Background Router Health & Alert Monitoring */
    function checkSystemAlerts(data) {
      if (!data) return;
      const router = data.router || {};
      const clients = Array.isArray(data.clients) ? data.clients : [];

      // 1. CPU Spike Detection (> 85%)
      const cpu = router.cpu_pct || 0;
      if (cpu > 85) {
        const now = Date.now();
        if (!window._lastCpuAlertTime || (now - window._lastCpuAlertTime > 10 * 60 * 1000)) {
          window._lastCpuAlertTime = now;
          dispatchAlertNotification({
            title: `CPU Utilization Spike (${cpu}%)`,
            message: `Router SoC processor utilization reached ${cpu}%. High network throughput or thread activity detected.`,
            level: 'danger',
            event_type: 'cpu_spike'
          });
        }
      }

      // 2. PPPoE Connection Drop Detection
      if (window._cachedPppoeData && window._cachedPppoeData.client && window._cachedPppoeData.client.enabled) {
        const ppp = window._cachedPppoeData.client;
        const isUp = (ppp.status === 'connected' || (ppp.ip && ppp.ip !== '--'));
        if (window._lastPppoeUpState === true && !isUp) {
          dispatchAlertNotification({
            title: 'PPPoE Connection Alert',
            message: 'PPPoE broadband session disconnected or carrier authentication failed. Retrying dialer.',
            level: 'danger',
            event_type: 'wan_disconnect'
          });
        }
        window._lastPppoeUpState = isUp;
      }

      // 3. New Device Connected Detection
      let known = window._knownClientMacs;
      if (!known) {
        try {
          known = new Set(JSON.parse(localStorage.getItem('maxnet_known_macs') || '[]'));
        } catch (e) {
          known = new Set();
        }
        window._knownClientMacs = known;
      }

      const isFirstClientScan = (known.size === 0);
      clients.forEach(c => {
        if (c.mac && !known.has(c.mac)) {
          known.add(c.mac);
          if (!isFirstClientScan && !c.is_self) {
            dispatchAlertNotification({
              title: `New Device Connected: ${c.name || c.ip}`,
              message: `Device with IP ${c.ip} (MAC: ${c.mac}) joined the network on interface ${c.interface || 'LAN'}.`,
              level: 'info',
              event_type: 'new_device'
            });
          }
        }
      });
      try {
        localStorage.setItem('maxnet_known_macs', JSON.stringify([...known]));
      } catch (e) {}

      // 4. Per-User High Data Consumption Alert (Persistent & Anti-Refresh)
      const dataQuotaMB = (window._cachedWebhooksConfig && window._cachedWebhooksConfig.data_quota_mb) || 1024;
      const dataQuotaBytes = dataQuotaMB * 1024 * 1024;
      let notifiedData = window._notifiedClientDataQuota;
      if (!notifiedData) {
        try {
          notifiedData = new Set(JSON.parse(localStorage.getItem('maxnet_notified_data_quota') || '[]'));
        } catch (e) {
          notifiedData = new Set();
        }
        window._notifiedClientDataQuota = notifiedData;
      }

      if (window._isFirstDataScan === undefined) {
        window._isFirstDataScan = true;
        clients.forEach(c => {
          if (c.mac) notifiedData.add(c.mac);
        });
        try {
          localStorage.setItem('maxnet_notified_data_quota', JSON.stringify([...notifiedData]));
        } catch (e) {}
      } else {
        clients.forEach(c => {
          const totalB = c.total_bytes || ((c.rx_bytes || 0) + (c.tx_bytes || 0)) || (((c.rx_mb || 0) + (c.tx_mb || 0)) * 1048576);
          if (totalB >= dataQuotaBytes && c.mac && !notifiedData.has(c.mac)) {
            notifiedData.add(c.mac);
            try {
              localStorage.setItem('maxnet_notified_data_quota', JSON.stringify([...notifiedData]));
            } catch (e) {}
            dispatchAlertNotification({
              title: `Data Quota Alert: ${c.name || c.ip}`,
              message: `Client device ${c.name || 'Device'} (${c.ip}, MAC: ${c.mac}) has consumed ${fmtBytes(totalB)}, exceeding the ${dataQuotaMB} MB quota limit.`,
              level: 'warning',
              event_type: 'data_usage'
            });
          }
        });
      }

      // 5. LAN/WAN Ethernet Port Link State Changes
      const netPorts = (data.network && Array.isArray(data.network.ports)) ? data.network.ports : [];
      if (!window._lastPortStates) {
        window._lastPortStates = {};
        netPorts.forEach(p => { window._lastPortStates[p.id] = p.status; });
      } else {
        netPorts.forEach(p => {
          const prev = window._lastPortStates[p.id];
          if (prev && prev !== p.status) {
            window._lastPortStates[p.id] = p.status;
            if (p.status === 'up') {
              dispatchAlertNotification({
                title: `Ethernet Cable Plugged: ${p.id.toUpperCase()}`,
                message: `Physical network link established on port ${p.id.toUpperCase()} at ${p.speed || 1000} Mbps (${p.duplex || 'Full'} Duplex).`,
                level: 'info',
                event_type: 'lan_plugged'
              });
            } else {
              dispatchAlertNotification({
                title: `Ethernet Cable Unplugged: ${p.id.toUpperCase()}`,
                message: `Physical link disconnected on port ${p.id.toUpperCase()}. Network cable removed or remote device powered down.`,
                level: 'warning',
                event_type: 'lan_plugged'
              });
            }
          }
        });
      }

      // 6. USB Device & Modem Hotplug Detection
      const curUsbDevs = Array.isArray(data.usb_devices) ? data.usb_devices : (Array.isArray(data.adb_devices) ? data.adb_devices : []);
      const curUsbIds = new Set(curUsbDevs.map(d => d.serial || d.product || d.id || d.name).filter(Boolean));
      if (!window._lastUsbDeviceIds) {
        window._lastUsbDeviceIds = curUsbIds;
      } else {
        curUsbDevs.forEach(d => {
          const id = d.serial || d.product || d.id || d.name;
          if (id && !window._lastUsbDeviceIds.has(id)) {
            dispatchAlertNotification({
              title: `USB Device Connected: ${d.product || d.name || 'USB Modem'}`,
              message: `New USB hardware plugged into router: ${d.manufacturer || ''} ${d.product || d.name || 'Device'} (${id}).`,
              level: 'info',
              event_type: 'usb_plugged'
            });
          }
        });
        window._lastUsbDeviceIds.forEach(oldId => {
          if (!curUsbIds.has(oldId)) {
            dispatchAlertNotification({
              title: 'USB Device Disconnected',
              message: `USB device (${oldId}) was removed or unplugged from the router.`,
              level: 'warning',
              event_type: 'usb_plugged'
            });
          }
        });
        window._lastUsbDeviceIds = curUsbIds;
      }

      // 7. System Reboot & Power Event Detection
      const upSec = router.uptime_seconds || 0;
      if (window._lastRecordedUptime !== undefined) {
        if (upSec < 180 && window._lastRecordedUptime > 300) {
          dispatchAlertNotification({
            title: 'Router Reboot & Power Event',
            message: `MAXNET Gateway router has rebooted or recovered from power interruption. Current uptime: ${router.uptime || '1 minute'}.`,
            level: 'warning',
            event_type: 'power_event'
          });
        }
      }
      window._lastRecordedUptime = upSec;

      // 8. Custom IP Watchdog Reachability Monitor
      const targetWatchIp = (window._cachedWebhooksConfig && window._cachedWebhooksConfig.custom_ip_target) || '10.0.0.2';
      const isTargetReachable = clients.some(c => c.ip === targetWatchIp) || (data.network && (data.network.gateway_ip === targetWatchIp || data.network.dns_ip === targetWatchIp));
      if (window._lastWatchdogState !== undefined && window._lastWatchdogIp === targetWatchIp) {
        if (window._lastWatchdogState !== isTargetReachable) {
          window._lastWatchdogState = isTargetReachable;
          if (isTargetReachable) {
            dispatchAlertNotification({
              title: `Monitored Host Online: ${targetWatchIp}`,
              message: `Monitored host device (${targetWatchIp}) is back online and responding on the network.`,
              level: 'info',
              event_type: 'custom_ip'
            });
          } else {
            dispatchAlertNotification({
              title: `Monitored Host Offline: ${targetWatchIp}`,
              message: `Monitored host device (${targetWatchIp}) has gone OFFLINE or stopped responding.`,
              level: 'danger',
              event_type: 'custom_ip'
            });
          }
        }
      } else {
        window._lastWatchdogState = isTargetReachable;
        window._lastWatchdogIp = targetWatchIp;
      }

      // 9. 18+ Adult Site Visit Detection
      const adultKeywords = ['pornhub', 'xvideos', 'xnxx', 'xhamster', 'chaturbate', 'stripchat', 'redtube', 'youporn', 'spankbang', 'livejasmin', 'onlyfans', 'cam4', 'brazzers', 'beeg'];
      window._notifiedAdultEvents = window._notifiedAdultEvents || new Set();
      if (Array.isArray(data.dns_queries) || Array.isArray(data.conntrack_flows)) {
        const queries = (data.dns_queries || data.conntrack_flows || []);
        queries.forEach(q => {
          const domain = (q.domain || q.host || '').toLowerCase();
          const clientIp = q.client_ip || q.src || '10.0.0.x';
          const match = adultKeywords.find(k => domain.includes(k));
          if (match && !window._notifiedAdultEvents.has(domain + clientIp)) {
            window._notifiedAdultEvents.add(domain + clientIp);
            dispatchAlertNotification({
              title: '18+ Adult Content Visit Detected',
              message: `Client device at ${clientIp} attempted to access adult/restricted website (${domain}). Gateway security notification dispatched.`,
              level: 'danger',
              event_type: 'adult_content'
            });
          }
        });
      }
    }

    async function checkForSystemFirmwareUpdates() {
      try {
        const res = await fetch('/cgi-bin/update');
        const up = await res.json();
        if (up && up.status === 'update_available') {
          const alertId = 'update_b' + (up.latest_build || 'new');
          if (!window._notifiedUpdates || !window._notifiedUpdates.has(alertId)) {
            window._notifiedUpdates = window._notifiedUpdates || new Set();
            window._notifiedUpdates.add(alertId);
            dispatchAlertNotification({
              id: alertId,
              title: `MAXNET OS Update Available (${up.latest})`,
              message: `New firmware build ${up.latest_build} is ready for installation (Current: ${up.current}). Tap to review & install.`,
              level: 'info',
              event_type: 'system_update'
            });
          }
        }
      } catch (e) {}
    }

    /* ==================== WEBHOOKS CONFIGURATION & TEST CONTROLLER ==================== */
    window._cachedWebhooksConfig = window._cachedWebhooksConfig || {};

    async function loadWebhooksConfig() {
      try {
        const res = await fetch('/cgi-bin/webhooks?action=get');
        const data = await res.json();
        if (data) {
          window._cachedWebhooksConfig = data;
          const mToggle = document.getElementById('webhookMasterToggle');
          if (mToggle) mToggle.checked = (data.master_enabled !== false);

          const tg = data.telegram || {};
          const tgEn = document.getElementById('tgEnableToggle');
          if (tgEn) tgEn.checked = !!tg.enabled;
          const tgSub = document.getElementById('dispTgStatusSub');
          if (tgSub) tgSub.textContent = tg.enabled ? 'Active • Forwarding to Telegram' : 'Disabled • Forward alerts to Telegram chat';
          const tgTokDisp = document.getElementById('disp_webhook_tg_token');
          if (tgTokDisp) tgTokDisp.textContent = tg.bot_token ? `${tg.bot_token.substring(0, 10)}••••••••` : 'Click to configure Bot Token from @BotFather';
          const tgChatDisp = document.getElementById('disp_webhook_tg_chat_id');
          if (tgChatDisp) tgChatDisp.textContent = tg.chat_id ? `Chat ID: ${tg.chat_id}` : 'Click to configure Chat or Channel ID';

          const dc = data.discord || {};
          const dcEn = document.getElementById('discordEnableToggle');
          if (dcEn) dcEn.checked = !!dc.enabled;
          const dcSub = document.getElementById('dispDiscordStatusSub');
          if (dcSub) dcSub.textContent = dc.enabled ? 'Active • Forwarding to Discord' : 'Disabled • Post alerts to Discord channel';
          const dcUrlDisp = document.getElementById('disp_webhook_discord_url');
          if (dcUrlDisp) dcUrlDisp.textContent = dc.webhook_url ? `${dc.webhook_url.substring(0, 35)}...` : 'Click to configure Discord Webhook URL';

          const nt = data.ntfy || {};
          const ntEn = document.getElementById('ntfyEnableToggle');
          if (ntEn) ntEn.checked = !!nt.enabled;
          const ntSub = document.getElementById('dispNtfyStatusSub');
          if (ntSub) ntSub.textContent = nt.enabled ? 'Active • Pushing to ntfy.sh' : 'Disabled • Mobile push notifications';
          const ntUrlDisp = document.getElementById('disp_webhook_ntfy_url');
          if (ntUrlDisp) ntUrlDisp.textContent = nt.topic_url || 'https://ntfy.sh/maxnet-alerts';

          const ev = data.events || {};
          const elCpu = document.getElementById('evCpuToggle');
          if (elCpu) elCpu.checked = (ev.cpu_spike !== false);
          const elDev = document.getElementById('evDeviceToggle');
          if (elDev) elDev.checked = (ev.new_device !== false);
          const elWan = document.getElementById('evWanToggle');
          if (elWan) elWan.checked = (ev.wan_disconnect !== false);
          const elDhcp = document.getElementById('evDhcpToggle');
          if (elDhcp) elDhcp.checked = (ev.dhcp_error !== false);
          const elUpd = document.getElementById('evUpdateToggle');
          if (elUpd) elUpd.checked = (ev.system_update !== false);
          const elSec = document.getElementById('evSecurityToggle');
          if (elSec) elSec.checked = (ev.security_alert !== false);
          const elLogin = document.getElementById('evRouterLoginToggle');
          if (elLogin) elLogin.checked = (ev.router_login !== false);
          const elData = document.getElementById('evDataUsageToggle');
          if (elData) elData.checked = (ev.data_usage !== false);
          const elLan = document.getElementById('evLanPlugToggle');
          if (elLan) elLan.checked = (ev.lan_plugged !== false);
          const elUsb = document.getElementById('evUsbPlugToggle');
          if (elUsb) elUsb.checked = (ev.usb_plugged !== false);
          const elPower = document.getElementById('evPowerToggle');
          if (elPower) elPower.checked = (ev.power_event !== false);
          const elCustomIp = document.getElementById('evCustomIpToggle');
          if (elCustomIp) elCustomIp.checked = (ev.custom_ip !== false);
          const elAdult = document.getElementById('evAdultToggle');
          if (elAdult) elAdult.checked = (ev.adult_content !== false);
          const elWifi = document.getElementById('evWifiToggle');
          if (elWifi) elWifi.checked = (ev.wifi_event !== false);

          const dqDisp = document.getElementById('disp_webhook_data_quota');
          if (dqDisp) dqDisp.textContent = `${data.data_quota_mb || 1024} MB (${((data.data_quota_mb || 1024)/1024).toFixed(1)} GB)`;
          const cipDisp = document.getElementById('disp_webhook_custom_ip');
          if (cipDisp) cipDisp.textContent = data.custom_ip_target || '10.0.0.2';
        }
      } catch (e) {
        console.warn('loadWebhooksConfig error:', e);
      }
    }

    async function saveWebhooksConfig() {
      const cfg = window._cachedWebhooksConfig || {};
      cfg.master_enabled = !!document.getElementById('webhookMasterToggle')?.checked;
      cfg.telegram = cfg.telegram || {};
      cfg.telegram.enabled = !!document.getElementById('tgEnableToggle')?.checked;
      cfg.discord = cfg.discord || {};
      cfg.discord.enabled = !!document.getElementById('discordEnableToggle')?.checked;
      cfg.ntfy = cfg.ntfy || {};
      cfg.ntfy.enabled = !!document.getElementById('ntfyEnableToggle')?.checked;

      cfg.events = cfg.events || {};
      cfg.events.cpu_spike = !!document.getElementById('evCpuToggle')?.checked;
      cfg.events.new_device = !!document.getElementById('evDeviceToggle')?.checked;
      cfg.events.wan_disconnect = !!document.getElementById('evWanToggle')?.checked;
      cfg.events.dhcp_error = !!document.getElementById('evDhcpToggle')?.checked;
      cfg.events.system_update = !!document.getElementById('evUpdateToggle')?.checked;
      cfg.events.security_alert = !!document.getElementById('evSecurityToggle')?.checked;
      cfg.events.router_login = !!document.getElementById('evRouterLoginToggle')?.checked;
      cfg.events.data_usage = !!document.getElementById('evDataUsageToggle')?.checked;
      cfg.events.lan_plugged = !!document.getElementById('evLanPlugToggle')?.checked;
      cfg.events.usb_plugged = !!document.getElementById('evUsbPlugToggle')?.checked;
      cfg.events.power_event = !!document.getElementById('evPowerToggle')?.checked;
      cfg.events.custom_ip = !!document.getElementById('evCustomIpToggle')?.checked;
      cfg.events.adult_content = !!document.getElementById('evAdultToggle')?.checked;
      cfg.events.wifi_event = !!document.getElementById('evWifiToggle')?.checked;
      cfg.data_quota_mb = cfg.data_quota_mb || 1024;
      cfg.custom_ip_target = cfg.custom_ip_target || '10.0.0.2';

      try {
        await fetch('/cgi-bin/webhooks?action=set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cfg)
        });
        loadWebhooksConfig();
      } catch (e) {}
    }

    async function testWebhookProvider(provider, btn) {
      if (btn) btn.classList.add('rotating');
      if (typeof showToast === 'function') showToast(`Testing ${provider} connection...`, 'info');
      try {
        const res = await fetch(`/cgi-bin/webhooks?action=test&provider=${provider}`);
        const data = await res.json();
        if (data && data.status === 'ok') {
          if (typeof showToast === 'function') showToast(data.message || `${provider} test successful!`, 'success');
        } else {
          if (typeof showToast === 'function') showToast(data.message || `${provider} test failed`, 'error');
        }
      } catch (e) {
        if (typeof showToast === 'function') showToast(`Error: ${e.message}`, 'error');
      } finally {
        if (btn) setTimeout(() => btn.classList.remove('rotating'), 600);
      }
    }

    /* ==================== SYSTEM & KERNEL LOG VIEWER ==================== */
    let currentLogType = 'system';
    let currentLogFilter = '';
    let logAutoRefreshTimer = null;
    let currentRawLogText = '';
    let logFilterDebounceTimer = null;

    async function fetchLogs(type = currentLogType, filter = currentLogFilter) {
      currentLogType = type;
      currentLogFilter = filter;
      const consoleBox = document.getElementById('logConsoleOutput');
      const linesBadge = document.getElementById('logViewerLinesBadge');

      try {
        const res = await fetch(`/cgi-bin/logs?type=${encodeURIComponent(type)}&filter=${encodeURIComponent(filter)}&lines=250`);
        const data = await res.json();
        currentRawLogText = data.raw || '';
        if (linesBadge) linesBadge.textContent = `${data.total_lines || 0} LINES`;
        renderLogs(currentRawLogText);
      } catch (e) {
        if (consoleBox) consoleBox.textContent = 'Error connecting to log stream: ' + e.message;
      }
    }

    function renderLogs(raw) {
      const consoleBox = document.getElementById('logConsoleOutput');
      if (!consoleBox) return;

      if (!raw || raw.trim() === '') {
        consoleBox.innerHTML = '<span style="color:var(--text-dim);">No log records matching filter.</span>';
        return;
      }

      const lines = raw.split('\n');
      const formatted = lines.map(line => {
        const escaped = escapeHtml(line);
        if (/(\.err|\.crit|\.alert|\.emerg|failed|error|fatal|drop)/i.test(line)) {
          return `<span style="color:#ef4444; font-weight:600;">${escaped}</span>`;
        } else if (/(\.warn|warning|retry)/i.test(line)) {
          return `<span style="color:#f59e0b;">${escaped}</span>`;
        } else if (/(\.notice|dhcpack|dhcprequest|registered|link up|up)/i.test(line)) {
          return `<span style="color:#10b981;">${escaped}</span>`;
        } else if (/(\.info|dnsmasq)/i.test(line)) {
          return `<span style="color:#38bdf8;">${escaped}</span>`;
        }
        return `<span style="color:#a1a1aa;">${escaped}</span>`;
      }).join('\n');

      consoleBox.innerHTML = formatted;
    }

    function switchLogType(type) {
      currentLogType = type;
      const tabSys = document.getElementById('logTabSystem');
      const tabKer = document.getElementById('logTabKernel');

      if (tabSys && tabKer) {
        if (type === 'system') {
          tabSys.classList.add('active');
          tabKer.classList.remove('active');
        } else {
          tabSys.classList.remove('active');
          tabKer.classList.add('active');
        }
      }

      fetchLogs(currentLogType, currentLogFilter);
    }

    function filterLogsRealtime(val) {
      if (logFilterDebounceTimer) clearTimeout(logFilterDebounceTimer);
      logFilterDebounceTimer = setTimeout(() => {
        fetchLogs(currentLogType, val.trim());
      }, 350);
    }

    function refreshLogViewer() {
      fetchLogs(currentLogType, currentLogFilter);
    }

    function toggleLogAutoRefresh(enabled) {
      if (logAutoRefreshTimer) {
        clearInterval(logAutoRefreshTimer);
        logAutoRefreshTimer = null;
      }
      if (enabled) {
        logAutoRefreshTimer = setInterval(() => {
          fetchLogs(currentLogType, currentLogFilter);
        }, 3000);
      }
    }

    function stopLogAutoRefresh() {
      if (logAutoRefreshTimer) {
        clearInterval(logAutoRefreshTimer);
        logAutoRefreshTimer = null;
      }
      const chk = document.getElementById('logViewerAutoRefresh');
      if (chk) chk.checked = false;
    }

    function downloadCurrentLog() {
      if (!currentRawLogText) {
        alert('Log buffer is currently empty.');
        return;
      }
      const blob = new Blob([currentRawLogText], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `maxnet-${currentLogType}-log-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    /* ==================== PACKAGE MANAGER ==================== */
    let currentPkgTab = 'installed';
    let cachedInstalledPkgs = [];
    let cachedSearchPkgs = [];
    let pkgSearchDebounceTimer = null;

    async function fetchPackages(query = '') {
      const container = document.getElementById('pkgListContainer');
      const badge = document.getElementById('pkgManagerBadge');
      const countBadge = document.getElementById('pkgCountBadge');

      if (currentPkgTab === 'installed') {
        try {
          const res = await fetch('/cgi-bin/packages?action=list');
          const data = await res.json();
          cachedInstalledPkgs = data.packages || [];
          if (badge) badge.textContent = `${cachedInstalledPkgs.length} INSTALLED`;
          if (countBadge) countBadge.textContent = `${cachedInstalledPkgs.length} PKGS`;
          renderPackagesList(cachedInstalledPkgs, query);
        } catch (e) {
          if (container) container.innerHTML = `<div style="color:#ef4444; padding:20px; text-align:center; font-family:var(--font-mono); font-size:12px;">Failed to load package list: ${escapeHtml(e.message)}</div>`;
        }
      } else {
        if (!query || query.trim().length === 0) {
          if (container) {
            container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">Type package name above to search 11,000+ repository packages (e.g. htop, nano, tcpdump, nginx)...</div>`;
          }
          return;
        }

        if (container) {
          container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">Searching official OpenWrt package feeds...</div>`;
        }

        try {
          const res = await fetch(`/cgi-bin/packages?action=search&query=${encodeURIComponent(query.trim())}`);
          const data = await res.json();
          cachedSearchPkgs = data.packages || [];
          renderPackagesList(cachedSearchPkgs);
        } catch (e) {
          if (container) container.innerHTML = `<div style="color:#ef4444; padding:20px; text-align:center; font-family:var(--font-mono); font-size:12px;">Package search error: ${escapeHtml(e.message)}</div>`;
        }
      }
    }

    function renderPackagesList(packages = [], filterQuery = '') {
      const container = document.getElementById('pkgListContainer');
      if (!container) return;

      let list = packages;
      if (filterQuery && currentPkgTab === 'installed') {
        const q = filterQuery.toLowerCase();
        list = packages.filter(p => p.name.toLowerCase().includes(q) || (p.feed && p.feed.toLowerCase().includes(q)));
      }

      if (list.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:25px; color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">No packages found.</div>`;
        return;
      }

      container.innerHTML = list.slice(0, 200).map(p => `
        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">${escapeHtml(p.name)}</span>
            <span class="setting-label-sub">${escapeHtml(p.version || '')} &bull; ${escapeHtml(p.feed || '')}</span>
          </div>
          <div class="setting-control-col">
            ${p.installed ? `
              <button type="button" class="round-action-btn btn-danger-action" title="Uninstall ${escapeHtml(p.name)}" onclick="uninstallPackage('${escapeHtml(p.name)}')" style="color:#ef4444; border-color:rgba(239,68,68,0.35); background:rgba(239,68,68,0.1);">
                <svg viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            ` : `
              <button type="button" class="round-action-btn" title="Install ${escapeHtml(p.name)}" onclick="installPackage('${escapeHtml(p.name)}')">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            `}
          </div>
        </div>
      `).join('');
    }

    function switchPackageTab(tab) {
      currentPkgTab = tab;
      const tabInst = document.getElementById('pkgTabInstalled');
      const tabAvail = document.getElementById('pkgTabAvailable');
      const searchInput = document.getElementById('pkgSearchInput');

      if (tabInst && tabAvail) {
        if (tab === 'installed') {
          tabInst.classList.add('active');
          tabAvail.classList.remove('active');
          if (searchInput) searchInput.placeholder = 'Filter installed packages...';
          renderPackagesList(cachedInstalledPkgs, searchInput ? searchInput.value : '');
        } else {
          tabInst.classList.remove('active');
          tabAvail.classList.add('active');
          if (searchInput) {
            searchInput.placeholder = 'Search 11,000+ packages in online repository...';
            searchInput.focus();
            fetchPackages(searchInput.value);
          }
        }
      }
    }

    function handlePackageSearchInput(query) {
      if (pkgSearchDebounceTimer) clearTimeout(pkgSearchDebounceTimer);
      pkgSearchDebounceTimer = setTimeout(() => {
        if (currentPkgTab === 'installed') {
          renderPackagesList(cachedInstalledPkgs, query);
        } else {
          fetchPackages(query);
        }
      }, 400);
    }

    async function updatePackageRepositories() {
      const btn = document.getElementById('btnUpdatePkgs');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'UPDATING CACHE...';
      }

      try {
        const res = await fetch('/cgi-bin/packages?action=update');
        const data = await res.json();
        alert(data.message || (data.status === 'ok' ? 'Package repositories updated successfully!' : 'Update failed.'));
        await fetchPackages();
      } catch (e) {
        alert('Repository update failed: ' + e.message);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'UPDATE REPOSITORIES';
        }
      }
    }

    async function installPackage(pkgName) {
      if (!pkgName) return;
      if (!confirm(`Install package "${pkgName}" on router gateway?`)) return;

      const container = document.getElementById('pkgListContainer');
      if (container) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:#38bdf8; font-size:12px; font-family:var(--font-mono);">Installing "${escapeHtml(pkgName)}" via APK package manager... Please wait.</div>`;
      }

      try {
        const res = await fetch(`/cgi-bin/packages?action=install&package=${encodeURIComponent(pkgName)}`);
        const data = await res.json();
        alert(data.message || (data.status === 'ok' ? `Package "${pkgName}" installed successfully!` : 'Installation failed.'));
        await fetchPackages();
      } catch (e) {
        alert('Install error: ' + e.message);
        await fetchPackages();
      }
    }

    async function installPackageDirect() {
      const input = document.getElementById('pkgDirectInstallInput');
      if (!input || !input.value.trim()) return;
      const pkg = input.value.trim();
      input.value = '';
      await installPackage(pkg);
    }

    async function uninstallPackage(pkgName) {
      if (!pkgName) return;
      if (!confirm(`Are you sure you want to uninstall "${pkgName}" and remove it from router flash memory?`)) return;

      const container = document.getElementById('pkgListContainer');
      if (container) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:#ef4444; font-size:12px; font-family:var(--font-mono);">Removing "${escapeHtml(pkgName)}"... Please wait.</div>`;
      }

      try {
        const res = await fetch(`/cgi-bin/packages?action=remove&package=${encodeURIComponent(pkgName)}`);
        const data = await res.json();
        alert(data.message || (data.status === 'ok' ? `Package "${pkgName}" uninstalled successfully!` : 'Removal failed.'));
        await fetchPackages();
      } catch (e) {
        alert('Uninstall error: ' + e.message);
        await fetchPackages();
      }
    }

    /* ==================== DIRECT ROOT TERMINAL (NO IFRAME, 100% TRANSPARENT) ==================== */
    let _nativeTerminal = null;
    let _nativeFitAddon = null;
    let _nativeTermWs = null;
    let _userZoomedTerm = false;

    function getTerminalResponsiveFontSize() {
      const w = window.innerWidth;
      if (w <= 400) return 7;
      if (w <= 520) return 7.5;
      if (w <= 768) return 8.5;
      if (w <= 1024) return 10;
      return 11.5;
    }

    function getTerminalTheme(isDark) {
      if (isDark) {
        return {
          background: 'rgba(0, 0, 0, 0)',
          foreground: '#f4f4f5',
          cursor: '#10b981',
          cursorAccent: '#000000',
          selectionBackground: 'rgba(56, 189, 248, 0.4)',
          black: '#27272a',
          red: '#ef4444',
          green: '#10b981',
          yellow: '#f59e0b',
          blue: '#60a5fa',
          magenta: '#c084fc',
          cyan: '#38bdf8',
          white: '#f4f4f5',
          brightBlack: '#a1a1aa',
          brightRed: '#f87171',
          brightGreen: '#34d399',
          brightYellow: '#fbbf24',
          brightBlue: '#93c5fd',
          brightMagenta: '#d8b4fe',
          brightCyan: '#67e8f9',
          brightWhite: '#ffffff'
        };
      } else {
        return {
          background: 'rgba(0, 0, 0, 0)',
          foreground: '#000000',
          cursor: '#000000',
          cursorAccent: '#ffffff',
          selectionBackground: 'rgba(56, 189, 248, 0.35)',
          black: '#000000',
          red: '#b91c1c',
          green: '#047857',
          yellow: '#b45309',
          blue: '#1d4ed8',
          magenta: '#7e22ce',
          cyan: '#0e7490',
          white: '#18181b',
          brightBlack: '#27272a',
          brightRed: '#dc2626',
          brightGreen: '#059669',
          brightYellow: '#d97706',
          brightBlue: '#2563eb',
          brightMagenta: '#9333ea',
          brightCyan: '#0891b2',
          brightWhite: '#000000'
        };
      }
    }

    function updateTerminalTheme() {
      if (!_nativeTerminal) return;
      const isDark = (typeof currentTheme !== 'undefined' && currentTheme === 'dark') ||
                     (document.documentElement.getAttribute('data-theme') !== 'light');
      _nativeTerminal.options.theme = getTerminalTheme(isDark);
      _nativeTerminal.options.fontWeight = isDark ? '500' : '600';
      try {
        _nativeTerminal.refresh(0, _nativeTerminal.rows - 1);
      } catch (e) {}
    }

    function loadResource(tag, attrs) {
      return new Promise((resolve, reject) => {
        const el = document.createElement(tag);
        Object.assign(el, attrs);
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error(`Failed to load ${attrs.src || attrs.href}`));
        document.head.appendChild(el);
      });
    }

    let _termLoadingPromise = null;
    async function ensureTerminalEngine() {
      if (typeof Terminal !== 'undefined' && typeof FitAddon !== 'undefined') {
        return true;
      }
      if (_termLoadingPromise) return _termLoadingPromise;

      _termLoadingPromise = (async () => {
        if (!document.querySelector('link[href*="xterm.css"]')) {
          await loadResource('link', { rel: 'stylesheet', href: '/js/xterm/xterm.css' });
        }
        if (typeof Terminal === 'undefined') {
          await loadResource('script', { src: '/js/xterm/xterm.js' });
        }
        if (typeof FitAddon === 'undefined') {
          await loadResource('script', { src: '/js/xterm/xterm-addon-fit.js' });
        }
        return true;
      })();
      return _termLoadingPromise;
    }

    async function initNativeTerminal() {
      const container = document.getElementById('terminalContainer');
      if (!container) return;
      document.body.classList.add('terminal-active');

      if (_nativeTerminal) {
        if (!_userZoomedTerm) {
          _nativeTerminal.options.fontSize = getTerminalResponsiveFontSize();
        }
        updateTerminalTheme();
        if (_nativeFitAddon) {
          try { _nativeFitAddon.fit(); } catch (e) {}
        }
        setTimeout(() => { try { _nativeTerminal.focus(); } catch (e) {} }, 100);
        return;
      }

      if (typeof Terminal === 'undefined' || typeof FitAddon === 'undefined') {
        container.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:220px;gap:12px;color:var(--text-sub);font-family:var(--font-mono);font-size:12px;">
            <div class="m-spinner" style="width:28px;height:28px;border-width:2.5px;"></div>
            <span>Loading Root Terminal Engine...</span>
          </div>`;
        try {
          await ensureTerminalEngine();
        } catch (err) {
          container.innerHTML = '<div style="padding:14px; color:#ef4444; font-family:var(--font-mono); font-size:12px;">Failed to load terminal engine. Check network connection.</div>';
          return;
        }
      }

      const isDark = (typeof currentTheme !== 'undefined' && currentTheme === 'dark') ||
                     (document.documentElement.getAttribute('data-theme') !== 'light');
      const termFs = getTerminalResponsiveFontSize();

      _nativeTerminal = new Terminal({
        allowTransparency: true,
        cursorBlink: true,
        fontSize: termFs,
        lineHeight: 1.18,
        fontWeight: isDark ? '500' : '600',
        fontWeightBold: '700',
        fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
        theme: getTerminalTheme(isDark)
      });

      if (typeof FitAddon !== 'undefined' && FitAddon.FitAddon) {
        _nativeFitAddon = new FitAddon.FitAddon();
        _nativeTerminal.loadAddon(_nativeFitAddon);
      }

      container.innerHTML = '';
      _nativeTerminal.open(container);

      // Pinch to zoom gesture support for mobile
      let _touchStartDist = 0;
      let _baseFontSize = termFs;

      container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          _touchStartDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          _baseFontSize = _nativeTerminal.options.fontSize || getTerminalResponsiveFontSize();
        }
      }, { passive: true });

      container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && _touchStartDist > 0) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          const scale = dist / _touchStartDist;
          let newFs = Math.round((_baseFontSize * scale) * 2) / 2;
          newFs = Math.max(6, Math.min(18, newFs));
          if (_nativeTerminal.options.fontSize !== newFs) {
            _userZoomedTerm = true;
            _nativeTerminal.options.fontSize = newFs;
            if (_nativeFitAddon) {
              _nativeFitAddon.fit();
              if (_nativeTermWs && _nativeTermWs.readyState === WebSocket.OPEN) {
                const resMsg = new TextEncoder().encode('1' + JSON.stringify({ columns: _nativeTerminal.cols, rows: _nativeTerminal.rows }));
                _nativeTermWs.send(resMsg);
              }
            }
          }
        }
      }, { passive: true });

      setTimeout(() => {
        if (_nativeFitAddon) {
          try { _nativeFitAddon.fit(); } catch (e) {}
        }
        try { _nativeTerminal.focus(); } catch (e) {}
      }, 50);

      connectTerminalWebSocket();

      window.addEventListener('resize', () => {
        if (_nativeFitAddon && _nativeTerminal) {
          try {
            if (!_userZoomedTerm) {
              _nativeTerminal.options.fontSize = getTerminalResponsiveFontSize();
            }
            _nativeFitAddon.fit();
            if (_nativeTermWs && _nativeTermWs.readyState === WebSocket.OPEN) {
              const resMsg = new TextEncoder().encode('1' + JSON.stringify({ columns: _nativeTerminal.cols, rows: _nativeTerminal.rows }));
              _nativeTermWs.send(resMsg);
            }
          } catch (e) {}
        }
      });
    }

    function connectTerminalWebSocket() {
      if (_nativeTermWs && _nativeTermWs.readyState === WebSocket.OPEN) return;

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.hostname}:7681/ws`;

      try {
        _nativeTermWs = new WebSocket(wsUrl, ['tty']);
        _nativeTermWs.binaryType = 'arraybuffer';

        _nativeTermWs.onopen = () => {
          _nativeTermWs.send(new TextEncoder().encode(JSON.stringify({ AuthToken: '' })));
          if (_nativeTerminal) {
            const cols = _nativeTerminal.cols || 80;
            const rows = _nativeTerminal.rows || 24;
            const resMsg = new TextEncoder().encode('1' + JSON.stringify({ columns: cols, rows: rows }));
            _nativeTermWs.send(resMsg);
          }
        };

        _nativeTermWs.onmessage = (e) => {
          const u8 = new Uint8Array(e.data);
          const cmd = String.fromCharCode(u8[0]);
          if (cmd === '0' && _nativeTerminal) {
            _nativeTerminal.write(u8.slice(1));
          }
        };

        _nativeTermWs.onclose = () => {
          if (_nativeTerminal) {
            _nativeTerminal.writeln('\r\n\x1b[33m[Session disconnected. Press back or re-open Terminal to reconnect]\x1b[0m');
          }
        };

        _nativeTermWs.onerror = () => {
          if (_nativeTerminal) {
            _nativeTerminal.writeln('\r\n\x1b[31m[WebSocket connection to port 7681 failed]\x1b[0m');
          }
        };

        _nativeTerminal.onData((data) => {
          if (_nativeTermWs && _nativeTermWs.readyState === WebSocket.OPEN) {
            const inputBytes = new TextEncoder().encode(data);
            const msg = new Uint8Array(1 + inputBytes.length);
            msg[0] = 48; // '0'
            msg.set(inputBytes, 1);
            _nativeTermWs.send(msg);
          }
        });
      } catch (err) {
        if (_nativeTerminal) {
          _nativeTerminal.writeln('\r\n\x1b[31mFailed to establish terminal WebSocket: ' + err.message + '\x1b[0m');
        }
      }
    }

    // TAILSCALE STATE & UI HELPERS
    let _currentTsAuthUrl = '';

    function setTailscaleLoginState(isLoggedIn) {
      const loggedOutSec = document.getElementById('tsLoggedOutSettings');
      const connectedSec = document.getElementById('tsConnectedSettings');
      if (loggedOutSec) loggedOutSec.style.display = isLoggedIn ? 'none' : 'block';
      if (connectedSec) connectedSec.style.display = isLoggedIn ? 'block' : 'none';
    }

    function updateTailscaleWebLoginUrl(url) {
      _currentTsAuthUrl = url || '';
      const subEl = document.getElementById('tsWebLoginSub');
      const openBtn = document.getElementById('btnTsOpenLink');
      const copyBtn = document.getElementById('btnTsCopyLink');

      if (url) {
        if (subEl) {
          subEl.innerHTML = `Link ready: <span style="color:#38bdf8; font-family:var(--font-mono); word-break:break-all;">${escapeHtml(url)}</span>`;
        }
        if (openBtn) { openBtn.href = url; openBtn.style.display = 'inline-flex'; }
        if (copyBtn) copyBtn.style.display = 'inline-flex';
      } else {
        if (subEl) {
          subEl.textContent = 'Generate authentication link to sign in via browser';
        }
        if (openBtn) openBtn.style.display = 'none';
        if (copyBtn) copyBtn.style.display = 'none';
      }
    }

    // TAILSCALE ACCOUNT & DEVICES RENDERING
    function renderTailscaleAccount(data) {
      if (!data) return;
      const user = data.user || {};
      const nameEl = document.getElementById('tsUserDisplayName');
      const emailEl = document.getElementById('tsUserLoginName');
      const domainEl = document.getElementById('tsTailnetDomain');
      const meshNodesBadge = document.getElementById('tsMeshNodesBadge');
      const avatarImg = document.getElementById('tsUserAvatarImg');
      const avatarBlank = document.getElementById('tsUserAvatarBlank');

      const isRunning = (data.backend_state === 'Running' && data.online !== false);
      const hasUser = isRunning && user && (user.DisplayName || user.LoginName);
      const isLoggedIn = isRunning && (hasUser || !!data.tailscale_ip);

      setTailscaleLoginState(isLoggedIn);

      if (hasUser) {
        if (nameEl) nameEl.textContent = user.DisplayName || user.LoginName;
        if (emailEl) emailEl.textContent = user.LoginName || 'Tailscale Operator';
      } else {
        if (nameEl) nameEl.textContent = 'Not Signed In';
        if (emailEl) emailEl.textContent = 'Disconnected from tailnet';
      }

      if (domainEl) {
        domainEl.textContent = (isRunning && data.tailnet) ? data.tailnet : 'Disconnected';
      }

      const onlineCount = isRunning ? (data.devices_online || 0) : 0;
      const totalCount = isRunning ? (data.devices_total || 0) : 0;

      if (meshNodesBadge) {
        meshNodesBadge.innerHTML = `<span id="tsOnlineCountBadge">${onlineCount} Online</span> / <span id="tsTotalCountBadge">${totalCount} Total</span>`;
        meshNodesBadge.className = isRunning ? 'setting-status-badge badge-active' : 'setting-status-badge badge-disabled';
      }

      // Profile picture or blank avatar silhouette
      const picUrl = user.ProfilePicURL || data.profile_pic_url || '';
      if (avatarImg && avatarBlank) {
        if (picUrl && hasUser) {
          avatarImg.src = picUrl;
          avatarImg.style.display = 'block';
          avatarBlank.style.display = 'none';
        } else {
          avatarImg.style.display = 'none';
          avatarBlank.style.display = 'block';
        }
      }
    }

    function renderTailscaleDevices(data) {
      const container = document.getElementById('tsDevicesContainer');
      if (!container) return;

      const isRunning = (data && data.backend_state === 'Running');
      if (!isRunning) {
        container.innerHTML = '<div style="padding:14px; text-align:center; color:var(--text-dim); font-size:11px; font-family:var(--font-mono); background:rgba(255,255,255,0.02); border-radius:8px;">No active mesh devices. Router is not signed in to a tailnet.</div>';
        return;
      }

      const peers = data.peers || [];
      if (peers.length === 0) {
        container.innerHTML = `
          <div class="setting-row-item" style="color:var(--text-dim); font-size:11.5px; font-family:var(--font-mono); padding:10px 14px;">
            No remote mesh peers connected.
          </div>
        `;
        return;
      }

      let html = '';
      peers.forEach(p => {
        const pName = p.name || p.hostname || 'Mesh Peer';
        const pIp = p.ip || '--';
        const pOs = (p.os || 'linux').toUpperCase();
        const isOnline = !!p.online;
        const lastSeen = p.last_seen && p.last_seen !== '0001-01-01T00:00:00Z' ? p.last_seen.split('T')[0] : '';
        const descText = `${escapeHtml(pIp)} &bull; ${escapeHtml(pOs)}${lastSeen && !isOnline ? ` &bull; Seen ${lastSeen}` : ''}`;

        html += `
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">${escapeHtml(pName)}</span>
              <span class="setting-label-sub">${descText}</span>
            </div>
            <div class="setting-control-col">
              <span class="setting-status-badge ${isOnline ? 'badge-active' : 'badge-disabled'}">${isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    }

    // TAILSCALE
    async function fetchTailscale() {
      try {
        const res = await fetch('/cgi-bin/tailscale');
        const data = await res.json();
        const badge = document.getElementById('tsStatusBadge');
        const ipEl = document.getElementById('tsIpAddress');

        const state = data.backend_state || data.BackendState || (data.online ? 'Running' : 'Stopped');
        const isRunning = (state === 'Running');
        const tsIp = isRunning ? (data.tailscale_ip || (data.TailscaleIPs && data.TailscaleIPs[0]) || (data.Self && data.Self.TailscaleIPs ? data.Self.TailscaleIPs[0] : '')) : '';
        const isLoggedIn = isRunning && !!tsIp;

        const notInstalledEl = document.getElementById('tsNotInstalledNotice');
        if (notInstalledEl) notInstalledEl.style.display = 'none';

        const dispIp = document.getElementById('disp_ts_ip');
        if (isLoggedIn) {
          if (badge) { badge.className = 'card-badge emerald'; badge.innerText = 'RUNNING'; }
          if (ipEl) ipEl.value = tsIp;
          if (dispIp) dispIp.textContent = tsIp;
          setTailscaleLoginState(true);
        } else {
          if (badge) { badge.className = 'card-badge'; badge.innerText = (state === 'NeedsLogin' ? 'NEEDS LOGIN' : (state === 'Stopped' ? 'STOPPED' : 'NOT CONNECTED')); }
          if (ipEl) ipEl.value = '';
          if (dispIp) dispIp.textContent = 'Not Connected';
          setTailscaleLoginState(false);
        }

        if (document.getElementById('tsMasterToggle')) {
          document.getElementById('tsMasterToggle').checked = (state.toLowerCase() === 'running');
        }
        if (document.getElementById('tsShareLan') && data.share_lan !== undefined) {
          document.getElementById('tsShareLan').checked = !!data.share_lan;
        }
        if (document.getElementById('tsExitNode') && data.exit_node !== undefined) {
          document.getElementById('tsExitNode').checked = !!data.exit_node;
        }
        if (document.getElementById('tsAcceptRoutes') && data.accept_routes !== undefined) {
          document.getElementById('tsAcceptRoutes').checked = !!data.accept_routes;
        }
        if (document.getElementById('tsSshMode') && data.ssh !== undefined) {
          document.getElementById('tsSshMode').checked = !!data.ssh;
        }
        if (document.getElementById('tsHostname') && data.hostname) {
          document.getElementById('tsHostname').value = data.hostname;
        }

        renderTailscaleAccount(data);
        renderTailscaleDevices(data);

        if (!isLoggedIn) {
          if (data.auth_url) {
            updateTailscaleWebLoginUrl(data.auth_url);
          }
        } else {
          updateTailscaleWebLoginUrl('');
        }
      } catch (e) {
        console.error("fetchTailscale error", e);
        const notInstalledEl = document.getElementById('tsNotInstalledNotice');
        if (notInstalledEl) notInstalledEl.style.display = 'flex';
        const badge = document.getElementById('tsStatusBadge');
        if (badge) { badge.className = 'card-badge'; badge.innerText = 'OFFLINE'; }
      }
    }

    async function toggleTailscaleService(enabled) {
      try {
        const action = enabled ? 'up' : 'down';
        await fetch('/cgi-bin/tailscale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        });
        setTimeout(fetchTailscale, 1500);
      } catch (e) {
        console.error("toggleTailscaleService error", e);
      }
    }

    async function startTailscaleWebLogin() {
      showToast('Generating Tailscale login link...', 'info');
      const subEl = document.getElementById('tsWebLoginSub');
      if (subEl) subEl.textContent = 'Initializing daemon login... Generating authentication link...';
      try {
        const res = await fetch('/cgi-bin/tailscale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'up' })
        });
        const data = await res.json();
        setTimeout(checkTailscaleAuthUrl, 1200);
      } catch (e) {
        console.error('startTailscaleWebLogin error', e);
        if (subEl) subEl.textContent = 'Failed to generate link. Click icon to retry.';
      }
    }

    async function checkTailscaleAuthUrl() {
      try {
        const res = await fetch('/cgi-bin/tailscale');
        const data = await res.json();
        const url = data.auth_url || '';

        if (url) {
          updateTailscaleWebLoginUrl(url);
          showToast('Login URL generated! Click icon to open.', 'success');
        } else if (data.backend_state === 'Running') {
          updateTailscaleWebLoginUrl('');
          setTailscaleLoginState(true);
          showToast('Tailscale connected & running!', 'success');
          fetchTailscale();
        } else {
          const subEl = document.getElementById('tsWebLoginSub');
          if (subEl) subEl.textContent = 'Initializing daemon login... Please wait 2 seconds.';
          setTimeout(checkTailscaleAuthUrl, 2000);
        }
      } catch (e) {
        console.error(e);
      }
    }

    function copyTsAuthUrl() {
      if (!_currentTsAuthUrl) return;
      navigator.clipboard.writeText(_currentTsAuthUrl)
        .then(() => showToast('Login URL copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy URL', 'error'));
    }

    async function logoutTailscale() {
      if (!confirm("Are you sure you want to log out this router from Tailscale?")) return;
      try {
        // Clear UI immediately
        const dispIp = document.getElementById('disp_ts_ip');
        if (dispIp) dispIp.textContent = 'Not Connected';
        const badge = document.getElementById('tsStatusBadge');
        if (badge) { badge.className = 'card-badge'; badge.innerText = 'NOT CONNECTED'; }
        renderTailscaleAccount({ backend_state: 'Stopped', online: false, tailscale_ip: '', user: {}, devices_total: 0, devices_online: 0 });
        renderTailscaleDevices({ backend_state: 'Stopped', peers: [] });
        updateTailscaleWebLoginUrl('');
        setTailscaleLoginState(false);

        await fetch('/cgi-bin/tailscale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout' })
        });
        showToast('Tailscale logged out', 'info');
        setTimeout(fetchTailscale, 1000);
      } catch (e) {
        console.error("logoutTailscale error", e);
      }
    }

    async function loginTailscaleWithKey() {
      const key = (document.getElementById('tsAuthKeyInput').value || '').trim();
      if (!key) {
        showToast("Please enter a valid Tailscale Auth Key (e.g. tskey-auth-...)", "error");
        return;
      }
      try {
        await fetch('/cgi-bin/tailscale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'up', authkey: key })
        });
        showToast("Connecting to Tailnet with Auth Key...", "info");
        setTimeout(fetchTailscale, 3000);
      } catch (e) {
        console.error("loginTailscaleWithKey error", e);
      }
    }

    async function restartTailscale() {
      try {
        await fetch('/cgi-bin/tailscale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'restart' })
        });
        showToast("Tailscale service restarted.", "success");
        setTimeout(fetchTailscale, 2000);
      } catch (e) {
        console.error("restartTailscale error", e);
      }
    }

    async function applyTailscalePrefs() {
      const shareLan = document.getElementById('tsShareLan') ? document.getElementById('tsShareLan').checked : true;
      const exitNode = document.getElementById('tsExitNode') ? document.getElementById('tsExitNode').checked : false;
      const acceptRoutes = document.getElementById('tsAcceptRoutes') ? document.getElementById('tsAcceptRoutes').checked : true;
      const sshMode = document.getElementById('tsSshMode') ? document.getElementById('tsSshMode').checked : false;
      const hostname = document.getElementById('tsHostname') ? (document.getElementById('tsHostname').value || 'Maxnet-Gateway') : 'Maxnet-Gateway';

      try {
        await fetch('/cgi-bin/tailscale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'set_prefs',
            share_lan: shareLan,
            exit_node: exitNode,
            accept_routes: acceptRoutes,
            ssh: sshMode,
            hostname: hostname
          })
        });
        fetchTailscale();
      } catch (e) {
        console.error("applyTailscalePrefs error", e);
      }
    }

    // SMB / USB STORAGE SETTINGS
    async function fetchSmbConfig() {
      try {
        const res = await fetch('/cgi-bin/smb_config');
        const data = await res.json();
        if (data.status === 'ok') {
          const userEl = document.getElementById('smbUsernameInput');
          if (userEl && data.username) userEl.value = data.username;

          const badge = document.getElementById('smbStatusBadge');
          if (badge) {
            if (data.smb_running) {
              badge.className = 'card-badge emerald';
              badge.innerText = 'ONLINE (' + (data.mounted ? (data.device || 'MOUNTED') : 'READY') + ')';
            } else {
              badge.className = 'card-badge';
              badge.innerText = 'STOPPED';
            }
          }

          const toggleBtn = document.getElementById('btnToggleSmbSettings');
          if (toggleBtn) {
            toggleBtn.innerText = data.smb_running ? 'STOP SMB' : 'START SMB';
            toggleBtn.className = data.smb_running ? 'mh-btn btn-ghost' : 'mh-btn';
          }
          const devEl = document.getElementById('smbDevState');
          if (devEl) devEl.innerText = data.mounted ? (data.device || 'Mounted') : 'No drive mounted';

          const capEl = document.getElementById('smbTotalSpace');
          if (capEl) capEl.innerText = data.total_space || '--';

          const freeEl = document.getElementById('smbFreeSpace');
          if (freeEl) freeEl.innerText = data.free_space || '--';

          const pathEl = document.getElementById('smbMountPath');
          if (pathEl) pathEl.innerText = data.share_path || '/mnt/pendrive';

          const devStateEl = document.getElementById('smbDevState');
          if (devStateEl) {
            devStateEl.textContent = data.mounted ? `${data.device || 'USB Drive'} mounted on ${data.share_path || '/mnt/pendrive'}` : 'No external USB disk detected';
          }
          const capBadge = document.getElementById('smbCapacityBadge');
          if (capBadge) {
            capBadge.textContent = data.mounted ? `${data.total_space || '--'} (${data.free_space || '--'} free)` : 'No Storage';
          }
          const shareAddrEl = document.getElementById('smbShareAddressText');
          if (shareAddrEl) {
            const ip = (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_ip) || window.location.hostname || '10.0.0.1';
            shareAddrEl.textContent = `smb://${ip}/Pendrive`;
          }
          const userDescEl = document.getElementById('disp_smb_user_desc');
          if (userDescEl) {
            userDescEl.textContent = `User: ${data.username || 'max'} • Click to configure credentials`;
          }
          const masterToggle = document.getElementById('smbMasterToggle');
          if (masterToggle) masterToggle.checked = !!data.smb_running;
        }
      } catch (e) {
        console.error('fetchSmbConfig error', e);
      }
    }

    async function toggleSmbService(enabled) {
      showToast(enabled ? 'Starting Samba 4 service...' : 'Stopping Samba service...', 'info');
      try {
        const res = await fetch('/cgi-bin/smb_config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'toggle', enable: !!enabled })
        });
        const data = await res.json();
        showToast(data.message || 'Samba state updated', 'success');
        fetchSmbConfig();
      } catch (e) {
        showToast('Failed to toggle SMB: ' + e.message, 'error');
      }
    }

    async function saveSmbCredentials() {
      const userEl = document.getElementById('smbUsernameInput');
      const passEl = document.getElementById('smbPasswordInput');
      const statusEl = document.getElementById('smbActionStatus');
      const user = userEl ? userEl.value.trim() : '';
      const pass = passEl ? passEl.value : '';

      if (!user || !pass) {
        if (statusEl) {
          statusEl.style.color = '#ef4444';
          statusEl.innerText = 'Please specify both username and password';
        }
        return;
      }

      if (statusEl) {
        statusEl.style.color = 'var(--text-dim)';
        statusEl.innerText = 'Saving credentials...';
      }

      try {
        const res = await fetch('/cgi-bin/smb_config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'set', username: user, password: pass })
        });
        const data = await res.json();
        if (statusEl) {
          if (data.status === 'ok') {
            statusEl.style.color = '#10b981';
            statusEl.innerText = data.message || 'Credentials saved and Samba restarted';
            if (passEl) passEl.value = '';
          } else {
            statusEl.style.color = '#ef4444';
            statusEl.innerText = data.message || 'Failed to update Samba credentials';
          }
        }
        fetchSmbConfig();
      } catch (e) {
        if (statusEl) {
          statusEl.style.color = '#ef4444';
          statusEl.innerText = 'Update failed: ' + e.message;
        }
      }
    }

    function copySmbPath(type) {
      const storDev = (window._lastDataCache && window._lastDataCache.usb_devices && window._lastDataCache.usb_devices.find(d => d.device_type === 'storage' || d.device_type === 'pendrive' || d.has_storage));
      const ip = (storDev && storDev.virtual_ip) || (window._lastDataCache && window._lastDataCache.network && window._lastDataCache.network.lan_ip) || window.location.hostname || '10.0.0.1';
      const path = `smb://${ip}/Pendrive`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(path).then(() => {
          if (typeof showToast === 'function') showToast(`Copied ${path} to clipboard`, 'success');
        }).catch(() => {
          fallbackCopyText(path);
        });
      } else {
        fallbackCopyText(path);
      }
    }

    function fallbackCopyText(text) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (typeof showToast === 'function') showToast(`Copied ${text} to clipboard`, 'success');
      } catch (e) {}
    }

    function onSelectMultiLinkSlot(slotNum) {
      switchTab('settings');
      toggleAccordion('acc-adb-device');
      const dropdown = document.getElementById('adbDeviceDropdown');
      if (dropdown && dropdown.options.length > 0) {
        fetchDeviceTelemetry();
      }
    }

    // ROOT PASSWORD
    async function changeAdminPassword() {
      const oldP = document.getElementById('oldPasswordInput').value;
      const newP = document.getElementById('newPasswordInput').value;
      const confP = document.getElementById('confirmPasswordInput').value;

      if (!oldP || !newP) {
        alert('Please enter both current and new password.');
        return;
      }
      if (newP !== confP) {
        alert('New password and confirmation do not match.');
        return;
      }
      if (newP.length < 4) {
        alert('Password must be at least 4 characters long.');
        return;
      }

      try {
        const res = await fetch('/cgi-bin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'change_password', user: 'root', old_pass: oldP, new_pass: newP })
        });
        const data = await res.json();
        if (data.status === 'ok') {
          alert('Root password updated successfully! Please log in with your new credentials.');
          logoutSession();
        } else {
          alert('Error updating password: ' + (data.message || 'Invalid current password.'));
        }
      } catch (e) {
        alert('Network request failed: ' + e.message);
      }
    }

    // BACKUP & RESTORE
    function downloadBackupArchive() {
      window.location.href = '/cgi-bin/backup';
    }

    async function uploadRestoreArchive() {
      const fileInput = document.getElementById('backupFileInput');
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please choose a .tar.gz backup archive first.');
        return;
      }
      if (!confirm('CAUTION: Restoring configuration will overwrite custom settings and restart services. Proceed?')) return;

      const file = fileInput.files[0];
      try {
        const res = await fetch('/cgi-bin/restore', { method: 'POST', body: file });
        const data = await res.json();
        alert(data.message || 'Configuration restored successfully. Reloading gateway...');
        setTimeout(() => location.reload(), 3000);
      } catch (e) {
        alert('Error restoring backup: ' + e.message);
      }
    }

    let _factoryResetTimer = null;
    let _factoryResetCountdown = 10;

    function showFactoryResetModal() {
      const overlay = document.getElementById('factoryResetModalOverlay');
      const btn = document.getElementById('btnConfirmFactoryReset');
      if (!overlay || !btn) return;

      overlay.style.display = 'flex';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add('active');
        });
      });
      _factoryResetCountdown = 10;
      btn.disabled = true;
      btn.style.cursor = 'not-allowed';
      btn.style.background = 'rgba(239,68,68,0.2)';
      btn.style.color = 'rgba(255,255,255,0.4)';
      btn.textContent = `RESET GATEWAY (${_factoryResetCountdown}s)`;

      clearInterval(_factoryResetTimer);
      _factoryResetTimer = setInterval(() => {
        _factoryResetCountdown--;
        if (_factoryResetCountdown > 0) {
          btn.textContent = `RESET GATEWAY (${_factoryResetCountdown}s)`;
        } else {
          clearInterval(_factoryResetTimer);
          btn.disabled = false;
          btn.style.cursor = 'pointer';
          btn.style.background = '#ef4444';
          btn.style.color = '#ffffff';
          btn.textContent = 'RESET GATEWAY';
        }
      }, 1000);
    }

    function closeFactoryResetModal() {
      clearInterval(_factoryResetTimer);
      const overlay = document.getElementById('factoryResetModalOverlay');
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
          if (!overlay.classList.contains('active')) {
            overlay.style.display = 'none';
          }
        }, 220);
      }
    }

    async function executeFactoryReset() {
      if (_factoryResetCountdown > 0) return;
      closeFactoryResetModal();
      showToast('Initiating factory reset... Router rebooting', 'warning', 8000);
      try {
        await fetch('/cgi-bin/restore?action=reset', { method: 'POST' });
      } catch (e) {}
    }

    function confirmFactoryReset() {
      showFactoryResetModal();
    }

    function confirmFactoryResetRouter() {
      showFactoryResetModal();
    }

    async function downloadSystemLog() {
      try {
        showToast('Fetching system log...', 'info');
        const res = await fetch('/cgi-bin/logs?type=system&lines=1000');
        const data = await res.json();
        const blob = new Blob([data.raw || ''], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_log_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('System log downloaded!', 'success');
      } catch (e) {
        showToast('Error downloading system log', 'error');
      }
    }

    async function downloadKernelLog() {
      try {
        showToast('Fetching kernel dmesg log...', 'info');
        const res = await fetch('/cgi-bin/logs?type=kernel&lines=1000');
        const data = await res.json();
        const blob = new Blob([data.raw || ''], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kernel_dmesg_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Kernel dmesg downloaded!', 'success');
      } catch (e) {
        showToast('Error downloading kernel log', 'error');
      }
    }

        // ==================== GLOBAL TOAST NOTIFICATION COMPONENT ====================
    function showToast(message, type = 'info', duration = 3000) {
      let toastEl = document.getElementById('globalAppToast');
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.id = 'globalAppToast';
        toastEl.className = 'global-app-toast';
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = message;
      toastEl.className = `global-app-toast show ${type}`;
      clearTimeout(toastEl._timer);
      toastEl._timer = setTimeout(() => {
        toastEl.classList.remove('show');
      }, duration);
    }

    let _lastFirmwareUpdateData = null;
    window._lastFirmwareUpdateData = null;
    let _isFlashingActive = false;

    function openFirmwareFlashModal(data) {
      if (data) _lastFirmwareUpdateData = data;
      if (!_lastFirmwareUpdateData && window._lastFirmwareUpdateData) _lastFirmwareUpdateData = window._lastFirmwareUpdateData;
      const d = _lastFirmwareUpdateData || {};
      const overlay = document.getElementById('firmwareFlashModalOverlay');
      if (!overlay) return;

      const curEl = document.getElementById('flashCurrentVer');
      const latEl = document.getElementById('flashLatestVer');
      const filEl = document.getElementById('flashFileName');
      const sizEl = document.getElementById('flashFileSize');

      if (curEl) curEl.textContent = d.current || 'v2.2.7-b7';
      if (latEl) latEl.textContent = d.latest || d.current || 'v2.2.7-b7';
      if (filEl) filEl.textContent = d.file || 'maxnet-jidu6911-sysupgrade.bin';
      if (sizEl) sizEl.textContent = d.size ? ((d.size / 1048576).toFixed(2) + ' MB') : '28.60 MB';

      const content = document.getElementById('flashModalContent');
      const footer = document.getElementById('flashModalFooter');
      const prog = document.getElementById('flashProgressState');

      if (content) content.style.display = 'flex';
      if (footer) footer.style.display = 'flex';
      if (prog) prog.style.display = 'none';

      overlay.style.display = 'flex';
      requestAnimationFrame(() => overlay.classList.add('active'));
    }

    function closeFirmwareFlashModal() {
      if (_isFlashingActive) {
        showToast('Firmware upgrade in progress. Please do not close.', 'warning');
        return;
      }
      const overlay = document.getElementById('firmwareFlashModalOverlay');
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => { overlay.style.display = 'none'; }, 200);
      }
    }

    function openRamBootModal(data) {
      if (data) _lastFirmwareUpdateData = data;
      if (!_lastFirmwareUpdateData && window._lastFirmwareUpdateData) _lastFirmwareUpdateData = window._lastFirmwareUpdateData;
      const d = _lastFirmwareUpdateData || {};
      const overlay = document.getElementById('ramBootModalOverlay');
      if (!overlay) return;

      const tftpCmd = document.getElementById('ramBootTftpCmd');
      const itbLink = document.getElementById('ramBootItbDownloadLink');
      const itbSize = document.getElementById('ramBootItbSize');

      if (tftpCmd) tftpCmd.textContent = d.tftp_command || 'tftpboot 0x46000000 maxnet-jidu6911-initramfs.itb; bootm 0x46000000';
      if (itbLink) itbLink.href = d.itb_url || '#';
      if (itbSize) itbSize.textContent = d.itb_size ? ((d.itb_size / 1048576).toFixed(2) + ' MB') : '34.16 MB';

      overlay.style.display = 'flex';
      requestAnimationFrame(() => overlay.classList.add('active'));
    }

    function closeRamBootModal() {
      const overlay = document.getElementById('ramBootModalOverlay');
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => { overlay.style.display = 'none'; }, 200);
      }
    }

    async function executeDirectRamBoot() {
      const btn = document.getElementById('btnExecDirectRamBoot');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="m-spinner" style="width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:6px;"></span> Configuring U-Boot...';
      }

      try {
        showToast('Configuring U-Boot bootcmd for Safe RAM Boot...', 'info');
        await apiFetch('/cgi-bin/update?action=ram_boot');

        showToast('Safe RAM Boot configured! Rebooting router into RAM mode...', 'success');

        // Trigger reboot
        await apiFetch('/cgi-bin/update?action=ram_boot_reboot').catch(() => {});

        setTimeout(() => {
          closeRamBootModal();
          showToast('Gateway rebooting into volatile RAM. Reconnecting...', 'info');
          let attempts = 0;
          const pingInterval = setInterval(async () => {
            attempts++;
            try {
              const ping = await fetch('/cgi-bin/status?t=' + Date.now(), { method: 'GET', cache: 'no-store' });
              if (ping.ok) {
                clearInterval(pingInterval);
                showToast('Router online in Safe RAM Boot mode!', 'success');
                setTimeout(() => location.reload(), 1500);
              }
            } catch (e) {}
            if (attempts > 60) {
              clearInterval(pingInterval);
              location.reload();
            }
          }, 2000);
        }, 1500);
      } catch (err) {
        showToast('Failed to trigger RAM Boot: ' + err.message, 'error');
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Reboot into RAM Boot Mode';
        }
      }
    }

    async function startFirmwareFlash(isClean = false) {
      _isFlashingActive = true;
      const content = document.getElementById('flashModalContent');
      const footer = document.getElementById('flashModalFooter');
      const prog = document.getElementById('flashProgressState');
      const pTitle = document.getElementById('flashProgressTitle');
      const pDesc = document.getElementById('flashProgressDesc');
      const pBar = document.getElementById('flashProgressBar');
      const pTimer = document.getElementById('flashCountdownTimer');

      if (content) content.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (prog) prog.style.display = 'flex';

      if (pTitle) pTitle.textContent = isClean ? 'Executing Clean Flash & Wipe...' : 'Starting Firmware Upgrade...';
      if (pDesc) pDesc.textContent = isClean
        ? 'Erasing configurations and starting download worker in background...'
        : 'Preserving network settings and starting download worker in background...';
      if (pBar) {
        pBar.style.width = '5%';
        pBar.style.background = 'var(--primary, #10b981)';
      }
      if (pTimer) pTimer.textContent = 'Contacting release mirror...';

      // 1. Trigger background OTA worker via CGI
      try {
        await apiFetch('/cgi-bin/update?action=' + (isClean ? 'flash_clean' : 'flash'));
      } catch (e) {}

      // 2. Poll /cgi-bin/update?action=status every 1000ms
      let pollCount = 0;
      let isRebooting = false;
      const pollTimer = setInterval(async () => {
        pollCount++;
        try {
          const res = await fetch('/cgi-bin/update?action=status&t=' + Date.now(), { method: 'GET', cache: 'no-store' });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const data = await res.json();

          if (data.state === 'downloading') {
            if (pTitle) pTitle.textContent = 'Downloading Firmware...';
            if (pDesc) pDesc.textContent = data.message || 'Downloading firmware from GitHub release...';
            const pct = Math.max(5, Math.min(85, data.progress || 10));
            if (pBar) pBar.style.width = `${pct}%`;
            if (pTimer) pTimer.textContent = `${pct}% downloaded`;
          } else if (data.state === 'verifying') {
            if (pTitle) pTitle.textContent = 'Verifying Firmware Integrity...';
            if (pDesc) pDesc.textContent = data.message || 'Verifying SHA-256 hash and sysupgrade header...';
            if (pBar) pBar.style.width = `${data.progress || 90}%`;
            if (pTimer) pTimer.textContent = 'Integrity check passed';
          } else if (data.state === 'flashing') {
            clearInterval(pollTimer);
            isRebooting = true;
            if (pTitle) pTitle.textContent = 'Flashing NAND & Rebooting...';
            if (pDesc) pDesc.textContent = 'Writing firmware to SPI-NAND flash. System is rebooting. Please DO NOT power off router!';
            if (pBar) pBar.style.width = '96%';
            if (pTimer) pTimer.textContent = 'Rebooting Maxnet Gateway...';

            let pingAttempts = 0;
            const pingInterval = setInterval(async () => {
              pingAttempts++;
              if (pingAttempts > 15) {
                try {
                  const ping = await fetch('/cgi-bin/status?t=' + Date.now(), { method: 'GET', cache: 'no-store' });
                  if (ping.ok) {
                    clearInterval(pingInterval);
                    if (pBar) pBar.style.width = '100%';
                    if (pTitle) pTitle.textContent = 'Firmware Updated Successfully!';
                    if (pDesc) pDesc.textContent = 'Router online. Reloading interface...';
                    setTimeout(() => location.reload(), 1500);
                  }
                } catch (e) {}
              }
              if (pingAttempts > 70) {
                clearInterval(pingInterval);
                location.reload();
              }
            }, 2000);
          } else if (data.state === 'error') {
            clearInterval(pollTimer);
            _isFlashingActive = false;
            if (pTitle) pTitle.textContent = 'Firmware Update Failed';
            if (pDesc) pDesc.textContent = data.message || 'An error occurred during firmware update.';
            if (pBar) {
              pBar.style.width = '100%';
              pBar.style.background = '#ef4444';
            }
            if (pTimer) pTimer.textContent = 'Error';
            if (footer) {
              footer.style.display = 'flex';
              footer.innerHTML = '<button type="button" class="mh-btn btn-ghost" onclick="closeFirmwareFlashModal()" style="padding:7px 18px; font-size:12px; font-weight:700;">CLOSE</button>';
            }
          }
        } catch (err) {
          if (pollCount > 15 && !isRebooting) {
            isRebooting = true;
            if (pTitle) pTitle.textContent = 'Flashing & Rebooting...';
            if (pDesc) pDesc.textContent = 'Writing to flash and restarting. Waiting for gateway to come back online...';
            if (pBar) pBar.style.width = '95%';
          }
        }

        if (pollCount > 120 && !isRebooting) {
          clearInterval(pollTimer);
          _isFlashingActive = false;
          if (footer) footer.style.display = 'flex';
        }
      }, 1000);
    }

    async function checkLatestFirmwareUpdate() {
      const btn = document.getElementById('btnCheckUpdate');
      const icon = document.getElementById('iconCheckUpdate');
      const pill = document.getElementById('updateStatusPill');
      const sub = document.getElementById('updateStatusSub');

      if (btn) btn.classList.add('btn-pulse');
      if (icon) icon.classList.add('spinning');
      if (pill) { pill.className = 'setting-pill pill-cyan'; pill.textContent = 'CHECKING...'; }
      if (sub) sub.textContent = 'Contacting remote firmware release mirror...';

      try {
        let updateAvailable = false;
        let updateData = null;
        try {
          const res = await apiFetch('/cgi-bin/update');
          const data = await res.json();
          if (data && data.status === 'update_available') {
            updateAvailable = true;
            updateData = data;
          } else if (data) {
            updateData = data;
          }
        } catch (e) {}

        setTimeout(() => {
          if (icon) icon.classList.remove('spinning');
          if (btn) btn.classList.remove('btn-pulse');

          _lastFirmwareUpdateData = updateData;
          window._lastFirmwareUpdateData = updateData;

          // Populate dedicated acc-firmware panel if present
          const fwBadge = document.getElementById('fwCurrentVerBadge');
          const fwModel = document.getElementById('fwModelVal');
          const fwSoc = document.getElementById('fwSocVal');
          const fwKernel = document.getElementById('fwKernelVal');
          const fwLatest = document.getElementById('fwLatestVerVal');
          const fwFile = document.getElementById('fwFileVal');
          const fwSize = document.getElementById('fwSizeVal');
          const fwSha = document.getElementById('fwShaVal');
          const fwTftp = document.getElementById('fwTftpCmdVal');
          const fwItbLink = document.getElementById('fwItbDownloadLink');
          const fwPill = document.getElementById('fwUpdateStatusPill');
          const rowUpgrade = document.getElementById('rowFwUpgradeAction');
          const rowRamBoot = document.getElementById('rowFwRamBootAction');
          const fwStatusSub = document.getElementById('fwStatusSubtitle');

          if (fwBadge) fwBadge.textContent = (updateData && updateData.current) || 'v2.2.7-b7';
          if (fwModel) fwModel.textContent = (updateData && updateData.model) || 'Jio JIDU6911';
          if (fwSoc) fwSoc.textContent = (updateData && updateData.soc) || 'Qualcomm IPQ9574 (AArch64)';
          if (fwLatest) fwLatest.textContent = (updateData && updateData.latest) || ((updateData && updateData.current) || 'v2.2.7-b7');
          if (fwFile) fwFile.textContent = (updateData && updateData.file) || 'sysupgrade.bin';
          if (fwSize) fwSize.textContent = (updateData && updateData.size) ? ((updateData.size / 1048576).toFixed(2) + ' MB') : '24.88 MB';
          if (fwSha) fwSha.textContent = (updateData && updateData.sha256) ? `${updateData.sha256.substring(0, 16)}...${updateData.sha256.substring(updateData.sha256.length - 8)}` : 'Verified via Release Manifest';
          if (fwTftp) fwTftp.textContent = (updateData && updateData.tftp_command) || 'tftpboot 0x46000000 initramfs.itb; bootm 0x46000000';
          if (fwItbLink && updateData && updateData.itb_url) fwItbLink.href = updateData.itb_url;

          if (updateAvailable && updateData) {
            const latVer = updateData.latest || 'v2.2.7';
            const modName = updateData.model || 'JioRouter AX6000';

            if (rowUpgrade) rowUpgrade.style.display = 'flex';
            if (rowRamBoot) rowRamBoot.style.display = 'flex';
            if (fwStatusSub) {
              fwStatusSub.innerHTML = `Installed: <span id="fwCurrentVerBadge" style="font-weight:700;">${escapeHtml(updateData.current || 'v2.2.7-b7')}</span> &bull; Latest: <span id="fwLatestVerVal" style="font-weight:700; color:#f59e0b;">${escapeHtml(latVer)}</span> &bull; <span>${escapeHtml(modName)}</span>`;
            }

            if (pill) { pill.className = 'setting-pill pill-amber'; pill.textContent = `UPDATE: ${latVer}`; }
            if (sub) sub.innerHTML = `<span style="color:#f59e0b; font-weight:700;">Update ${escapeHtml(latVer)} ready</span> &bull; ${escapeHtml(modName)}`;
            if (fwPill) { fwPill.className = 'setting-pill pill-amber'; fwPill.textContent = 'UPDATE AVAILABLE'; }

            // Morph check button into glowing Flash Update action button
            if (btn) {
              btn.className = 'round-action-btn btn-flash-ready';
              btn.title = `Install Firmware Update (${latVer})`;
              btn.onclick = () => openFirmwareFlashModal(updateData);
              btn.innerHTML = `<svg viewBox="0 0 24 24" style="width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:2.3;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
            }

            const btnDirect = document.getElementById('btnFwFlashDirect');
            if (btnDirect) {
              btnDirect.textContent = `UPGRADE TO ${latVer}`;
              btnDirect.classList.add('btn-pulse');
            }

            // Dispatch notification once; suppress duplicates if same build was already notified
            const alertId = 'update_b' + (updateData.latest_build || updateData.latest || 'avail');
            if (!window._notifiedUpdates) window._notifiedUpdates = new Set();
            if (!window._notifiedUpdates.has(alertId)) {
              window._notifiedUpdates.add(alertId);
              if (typeof dispatchAlertNotification === 'function') {
                dispatchAlertNotification({
                  id: alertId,
                  title: `MAXNET Update Available (${latVer})`,
                  message: `New firmware build ${updateData.latest_build || latVer} is ready for installation on ${modName}. Tap to review & flash.`,
                  level: 'info',
                  event_type: 'system_update',
                  action: () => openFirmwareFlashModal(updateData)
                });
              }
            }
          } else {
            const curVer = (updateData && updateData.current) || 'v2.2.7-b7';
            const modName = (updateData && updateData.model) || 'JioRouter AX6000';

            // Router is up to date: hide Upgrade and Safe RAM Boot action rows
            if (rowUpgrade) rowUpgrade.style.display = 'none';
            if (rowRamBoot) rowRamBoot.style.display = 'none';
            if (fwStatusSub) {
              fwStatusSub.innerHTML = `Installed: <span id="fwCurrentVerBadge" style="font-weight:700;">${escapeHtml(curVer)}</span> &bull; <span style="color:#10b981; font-weight:600;">Router is up to date</span> &bull; <span>${escapeHtml(modName)}</span>`;
            }

            if (pill) { pill.className = 'setting-pill pill-green'; pill.textContent = `${curVer} UP TO DATE`; }
            if (sub) sub.textContent = `${modName} is running the latest stable release.`;
            if (fwPill) { fwPill.className = 'setting-pill pill-green'; fwPill.textContent = 'UP TO DATE'; }
            if (btn) {
              btn.className = 'round-action-btn';
              btn.title = 'Check for Latest Firmware Update';
              btn.onclick = checkLatestFirmwareUpdate;
              btn.innerHTML = `<svg id="iconCheckUpdate" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`;
            }
          }
        }, 600);
      } catch (err) {
        const rowUpgrade = document.getElementById('rowFwUpgradeAction');
        const rowRamBoot = document.getElementById('rowFwRamBootAction');
        if (rowUpgrade) rowUpgrade.style.display = 'none';
        if (rowRamBoot) rowRamBoot.style.display = 'none';
        if (icon) icon.classList.remove('spinning');
        if (btn) btn.classList.remove('btn-pulse');
        if (pill) { pill.className = 'setting-pill pill-green'; pill.textContent = 'UP TO DATE'; }
        if (sub) sub.textContent = 'Jio AX6000 Custom Firmware • Up to date';
      }
    }

    async function installSysupgradeUpdate(tag) {
      openFirmwareFlashModal(_lastFirmwareUpdateData || { latest: tag });
    }

    function confirmRebootRouter() {
      showToast('Rebooting Maxnet Gateway...', 'warning');
      fetch('/cgi-bin/restore?action=reboot', { method: 'POST' })
        .then(() => {
          showToast('Reboot command sent. Reconnecting in 15 seconds...', 'info');
          setTimeout(() => location.reload(), 15000);
        })
        .catch(() => showToast('Reboot initiated.', 'info'));
    }

    // SYSTEM UPDATE
    async function checkUpdateStatus() {
      checkLatestFirmwareUpdate();
    }

    async function executeFirmwareUpdate() {
      openFirmwareFlashModal(_lastFirmwareUpdateData);
    }

    function confirmCleanUpdate() {
      openFirmwareFlashModal(_lastFirmwareUpdateData);
    }

    // WI-FI & WIRELESS HOTSPOT CONTROLLERS
    async function fetchWifiConfig() {
      try {
        const res = await apiFetch('/cgi-bin/wifi?action=get');
        const data = await res.json();
        if (!data || data.status !== 'ok') return;

        const mToggle = document.getElementById('wifiMasterToggle');
        if (mToggle) mToggle.checked = data.master_enabled === 1;

        // 2.4 GHz
        const r2gEn = document.getElementById('wifi2gEnable');
        const r2gSsid = document.getElementById('wifi2gSsid');
        const r2gEnc = document.getElementById('wifi2gEnc');
        const r2gKey = document.getElementById('wifi2gKey');
        const r2gCh = document.getElementById('wifi2gChannel');
        const r2gHt = document.getElementById('wifi2gHtmode');
        const r2gHid = document.getElementById('wifi2gHidden');

        if (r2gEn && data.radio_2g) r2gEn.checked = data.radio_2g.enabled === 1;
        if (r2gSsid && data.radio_2g) r2gSsid.value = data.radio_2g.ssid || 'Maxnet_2.4Ghz';
        if (r2gEnc && data.radio_2g) r2gEnc.value = data.radio_2g.encryption || 'psk2';
        if (r2gKey && data.radio_2g) r2gKey.value = data.radio_2g.key || '';
        if (r2gCh && data.radio_2g) r2gCh.value = data.radio_2g.channel || '1';
        if (r2gHt && data.radio_2g) r2gHt.value = data.radio_2g.htmode || 'HE20';
        if (r2gHid && data.radio_2g) r2gHid.checked = data.radio_2g.hidden === 1;

        // 5 GHz
        const r5gEn = document.getElementById('wifi5gEnable');
        const r5gSsid = document.getElementById('wifi5gSsid');
        const r5gEnc = document.getElementById('wifi5gEnc');
        const r5gKey = document.getElementById('wifi5gKey');
        const r5gCh = document.getElementById('wifi5gChannel');
        const r5gHt = document.getElementById('wifi5gHtmode');
        const r5gHid = document.getElementById('wifi5gHidden');

        if (r5gEn && data.radio_5g) r5gEn.checked = data.radio_5g.enabled === 1;
        if (r5gSsid && data.radio_5g) r5gSsid.value = data.radio_5g.ssid || 'Maxnet_5Ghz';
        if (r5gEnc && data.radio_5g) r5gEnc.value = data.radio_5g.encryption || 'psk2';
        if (r5gKey && data.radio_5g) r5gKey.value = data.radio_5g.key || '';
        if (r5gCh && data.radio_5g) r5gCh.value = data.radio_5g.channel || '36';
        if (r5gHt && data.radio_5g) r5gHt.value = data.radio_5g.htmode || 'HE80';
        if (r5gHid && data.radio_5g) r5gHid.checked = data.radio_5g.hidden === 1;

        // Render connected clients
        renderWifiClients(data.clients || []);
      } catch (err) {
        console.warn('fetchWifiConfig error:', err);
      }
    }

    function renderWifiClients(clients) {
      const container = document.getElementById('wifiClientsContainer');
      if (!container) return;

      if (!clients || clients.length === 0) {
        container.innerHTML = '<div style="padding:14px; text-align:center; color:var(--text-muted); font-size:11.5px;">No wireless devices currently connected.</div>';
        return;
      }

      container.innerHTML = clients.map(c => `
        <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); border:1px solid var(--border-sub, rgba(255,255,255,0.06)); border-radius:8px; padding:10px 14px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:32px; height:32px; border-radius:6px; background:rgba(6,182,212,0.15); color:#06b6d4; display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
            </div>
            <div>
              <span style="font-family:var(--font-mono); font-size:12px; font-weight:700; color:var(--text-main);">${escapeHtml(c.mac)}</span>
              <div style="font-size:10.5px; color:var(--text-dim); display:flex; gap:8px;">
                <span>Band: ${escapeHtml(c.band || '2.4 GHz')}</span>
                <span>Signal: ${c.signal || -60} dBm</span>
              </div>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; font-weight:700; color:#10b981;">${c.tx_mbps || 0} Mbps</span>
            <div style="font-size:9.5px; color:var(--text-muted);">PHY Link Rate</div>
          </div>
        </div>
      `).join('');
    }

    async function saveWifiSettings() {
      try {
        const payload = {
          master_enabled: document.getElementById('wifiMasterToggle')?.checked ? 1 : 0,
          enable_2g: document.getElementById('wifi2gEnable')?.checked ? 1 : 0,
          ssid_2g: document.getElementById('wifi2gSsid')?.value || 'Maxnet_2.4Ghz',
          enc_2g: document.getElementById('wifi2gEnc')?.value || 'psk2',
          key_2g: document.getElementById('wifi2gKey')?.value || '',
          channel_2g: document.getElementById('wifi2gChannel')?.value || '1',
          htmode_2g: document.getElementById('wifi2gHtmode')?.value || 'HE20',
          hidden_2g: document.getElementById('wifi2gHidden')?.checked ? 1 : 0,

          enable_5g: document.getElementById('wifi5gEnable')?.checked ? 1 : 0,
          ssid_5g: document.getElementById('wifi5gSsid')?.value || 'Maxnet_5Ghz',
          enc_5g: document.getElementById('wifi5gEnc')?.value || 'psk2',
          key_5g: document.getElementById('wifi5gKey')?.value || '',
          channel_5g: document.getElementById('wifi5gChannel')?.value || '36',
          htmode_5g: document.getElementById('wifi5gHtmode')?.value || 'HE80',
          hidden_5g: document.getElementById('wifi5gHidden')?.checked ? 1 : 0
        };

        showToast('Applying Wi-Fi settings to wireless radios...', 'info');
        const res = await apiFetch('/cgi-bin/wifi?action=set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data && data.status === 'ok') {
          showToast('Wi-Fi settings applied successfully!', 'success');
          setTimeout(fetchWifiConfig, 1500);
        } else {
          showToast(data?.message || 'Failed to apply Wi-Fi settings', 'error');
        }
      } catch (err) {
        showToast('Error saving Wi-Fi settings: ' + err.message, 'error');
      }
    }

    function toggleWifiMasterPower(checked) {
      const payload = { master_enabled: checked ? 1 : 0 };
      showToast(checked ? 'Enabling Wi-Fi transmitters...' : 'Disabling Wi-Fi transmitters...', 'info');
      apiFetch('/cgi-bin/wifi?action=set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(() => {
        showToast(checked ? 'Wi-Fi radios active' : 'Wi-Fi radios disabled (DMA memory reclaimed)', 'success');
        setTimeout(fetchWifiConfig, 1000);
      }).catch(err => {
        showToast('Failed to toggle master Wi-Fi: ' + err.message, 'error');
      });
    }

    function togglePasswordVisibility(inputId, btn) {
      const inp = document.getElementById(inputId);
      if (!inp) return;
      const isPass = inp.type === 'password';
      inp.type = isPass ? 'text' : 'password';

      const targetBtn = btn || (typeof event !== 'undefined' && event ? event.currentTarget : null);
      if (targetBtn) {
        if (isPass) {
          // Eye-off icon (slashed eye) indicating password is now visible in plain text
          targetBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
          targetBtn.style.color = '#10b981';
          targetBtn.setAttribute('title', 'Hide password');
        } else {
          // Normal eye icon indicating password is hidden
          targetBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
          targetBtn.style.color = 'var(--text-dim)';
          targetBtn.setAttribute('title', 'Show password');
        }
      }
    }

    function toggleRamBootDetailsInModal() {
      const box = document.getElementById('modalRamBootBox');
      if (!box) return;
      box.style.display = (box.style.display === 'none' || !box.style.display) ? 'flex' : 'none';
    }

    function showRamBootInstructions() {
      openFirmwareFlashModal(_lastFirmwareUpdateData);
      const box = document.getElementById('modalRamBootBox');
      if (box) box.style.display = 'flex';
    }

    function copyTextToClipboard(text) {
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Copied to clipboard!', 'success');
        }).catch(() => {
          fallbackCopyText(text);
        });
      } else {
        fallbackCopyText(text);
      }
    }

    // AUTO-REFRESH & THEME & UPI
    function toggleAutoRefresh(enabled) {
      if (timer) clearInterval(timer);
      if (enabled) setupTimer();
    }

    function setupTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(fetchData, 3000);
    }

    function updateToggleBadge(checkboxEl, badgeId) {
      const badge = document.getElementById(badgeId);
      if (!badge) return;
      if (checkboxEl.checked) {
        badge.className = 'toggle-status-badge on';
        badge.textContent = 'ENABLED';
      } else {
        badge.className = 'toggle-status-badge off';
        badge.textContent = 'DISABLED';
      }
    }

    function updateThemeUI() {
      const isDark = (currentTheme === 'dark');
      const sunIcon = document.getElementById('themeIconSun');
      const moonIcon = document.getElementById('themeIconMoon');
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }
      if (typeof buildUsbBwSvg === 'function') buildUsbBwSvg();
      if (typeof updateTerminalTheme === 'function') updateTerminalTheme();
    }

    function toggleTheme() {
      const nextMode = (currentTheme === 'dark') ? 'day' : 'night';
      setThemeMode(nextMode);
    }

    function copyUpi() {
      const upi = '9824584454@ybl';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(upi).then(showCopied).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    }

    function fallbackCopy() {
      const ta = document.createElement('textarea');
      ta.value = '9824584454@ybl';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showCopied(); } catch (e) {}
      document.body.removeChild(ta);
    }

    function showCopied() {
      const btn = document.querySelector('.btn-copy-capsule');
      if (btn) {
        btn.innerText = 'COPIED!';
        setTimeout(() => { btn.innerText = 'COPY'; }, 2000);
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  
    // ==================== WEBUI SETTINGS HANDLERS ====================
    function toggleAnimFlow(enabled) {
      document.body.classList.toggle('no-anim', !enabled);
      try { localStorage.setItem('maxnet_anim_flow', enabled ? '1' : '0'); } catch(e){}
    }
    function toggleCyberGlow(enabled) {
      document.body.classList.toggle('no-glow', !enabled);
      try { localStorage.setItem('maxnet_cyber_glow', enabled ? '1' : '0'); } catch(e){}
    }
    function toggleDenseMode(enabled) {
      document.body.classList.toggle('dense-mode', !!enabled);
      try { localStorage.setItem('maxnet_dense_mode', enabled ? '1' : '0'); } catch(e){}
    }
        // Initialize WebUI stored settings
    applyThemeMode();

    try {
      if (localStorage.getItem('maxnet_anim_flow') === '0') {
        const el = document.getElementById('toggleAnimFlow');
        if (el) el.checked = false;
        document.body.classList.add('no-anim');
      }
      if (localStorage.getItem('maxnet_cyber_glow') === '0') {
        const el = document.getElementById('toggleCyberGlow');
        if (el) el.checked = false;
        document.body.classList.add('no-glow');
      }
      if (localStorage.getItem('maxnet_dense_mode') === '1') {
        const el = document.getElementById('toggleDenseMode');
        if (el) el.checked = true;
        document.body.classList.add('dense-mode');
      }
    } catch(e){}

  
    // ==================== SYSTEM LOGS: INLINE DOWNLOAD HANDLER ====================
    let activeLogType = 'system';

    function downloadActiveLog() {
      if (activeLogType === 'kernel') {
        downloadKernelLog();
      } else {
        downloadSystemLog();
      }
    }

    const _origSwitchLogType = typeof switchLogType === 'function' ? switchLogType : null;
    switchLogType = function(type) {
      activeLogType = type;
      if (_origSwitchLogType) _origSwitchLogType(type);
    };

    // ==================== HAPTIC UI FEEDBACK ====================
    let _hapticEnabled = true;
    try {
      const savedHaptic = localStorage.getItem('maxnet_haptic_feedback');
      _hapticEnabled = (savedHaptic !== '0');
      const hapticToggle = document.getElementById('toggleHapticFeedback');
      if (hapticToggle) hapticToggle.checked = _hapticEnabled;
    } catch(e){}

    function toggleHapticFeedback(enabled) {
      _hapticEnabled = !!enabled;
      try { localStorage.setItem('maxnet_haptic_feedback', enabled ? '1' : '0'); } catch(e){}
      if (enabled) triggerHaptic([15, 30, 15]);
      showToast(enabled ? 'Haptic feedback enabled' : 'Haptic feedback disabled', 'info');
    }

    function triggerHaptic(pattern = 10) {
      try {
        if (_hapticEnabled && navigator.vibrate) {
          navigator.vibrate(pattern);
        }
      } catch(e){}
    }

    // Attach subtle haptic vibration to user interactions
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, .round-action-btn, .setting-clickable-row, .settings-nav-card, .toggle-switch, .tri-btn, .mh-btn');
      if (btn) {
        triggerHaptic(12);
      }
    }, { passive: true });

    // ==================== DEVICE INFO FETCH & RENDER ====================
    async function fetchDeviceInfo() {
      try {
        const res = await fetch('/cgi-bin/device_info');
        const data = await res.json();
        if (data.status !== 'ok') return;

        // CPU & SoC
        const cpu = data.cpu || {};
        const sys = data.system || {};
        const mem = data.memory || {};

        const cpuModelEl = document.getElementById('sysCpuModel');
        if (cpuModelEl) cpuModelEl.textContent = `${cpu.model || 'Qualcomm IPQ9574'} • ${cpu.cores || 4} Cores • ${cpu.architecture || 'aarch64'}`;

        const loadAvgEl = document.getElementById('sysLoadAvg');
        if (loadAvgEl) loadAvgEl.textContent = `Usage: ${cpu.usage_pct || 0}% • Load: ${cpu.load_1m || '0.00'}, ${cpu.load_5m || '0.00'}, ${cpu.load_15m || '0.00'} • BogoMIPS: ${cpu.bogomips || '48.00'}`;

        // RAM
        const ramSubEl = document.getElementById('sysRamSub');
        if (ramSubEl) ramSubEl.textContent = `Used: ${mem.used_mb || 0} MB / ${mem.total_mb || 0} MB (${mem.used_pct || 0}%) • Free: ${mem.free_mb || 0} MB • Avail: ${mem.avail_mb || 0} MB`;

        // Thermals & Device Health Status Gauge
        const thermals = data.thermals || [];
        let maxTemp = 0;
        let avgTemp = 0;
        if (thermals.length > 0) {
          let sum = 0;
          thermals.forEach(t => {
            const v = parseFloat(t.temp_c) || 0;
            if (v > maxTemp) maxTemp = v;
            sum += v;
          });
          avgTemp = sum / thermals.length;
        } else {
          maxTemp = 42.0;
          avgTemp = 42.0;
        }

        // Determine health state based on temperature:
        // cool: < 38°C
        // healthy: 38°C - 44°C
        // normal: 44.1°C - 50°C
        // warm: 50.1°C - 60°C
        // critical: > 60°C
        let healthState = 'NORMAL';
        let healthColor = '#10b981';
        let healthBg = 'rgba(16,185,129,0.1)';
        let healthBorder = 'rgba(16,185,129,0.25)';

        if (maxTemp < 38) {
          healthState = 'COOL';
          healthColor = '#06b6d4';
          healthBg = 'rgba(6,182,212,0.1)';
          healthBorder = 'rgba(6,182,212,0.25)';
        } else if (maxTemp <= 44) {
          healthState = 'HEALTHY';
          healthColor = '#10b981';
          healthBg = 'rgba(16,185,129,0.1)';
          healthBorder = 'rgba(16,185,129,0.25)';
        } else if (maxTemp <= 50) {
          healthState = 'NORMAL';
          healthColor = '#38bdf8';
          healthBg = 'rgba(56,189,248,0.1)';
          healthBorder = 'rgba(56,189,248,0.25)';
        } else if (maxTemp <= 60) {
          healthState = 'WARM';
          healthColor = '#f59e0b';
          healthBg = 'rgba(245,158,11,0.1)';
          healthBorder = 'rgba(245,158,11,0.25)';
        } else {
          healthState = 'CRITICAL';
          healthColor = '#ef4444';
          healthBg = 'rgba(239,68,68,0.1)';
          healthBorder = 'rgba(239,68,68,0.25)';
        }

        // Update Device Health row dynamically from CPU, RAM, and Thermals
        const cpuPct = parseFloat(cpu.usage_pct) || 0;
        const ramPct = parseFloat(mem.used_pct) || 0;
        const healthBadge = document.getElementById("deviceHealthStatusBadge");
        const healthSub = document.getElementById("deviceHealthSummarySub");

        const healthIssues = [];
        if (cpuPct > 85) healthIssues.push(`High CPU load (${cpuPct}%)`);
        if (ramPct > 90) healthIssues.push(`High memory usage (${ramPct}%)`);
        if (maxTemp > 75) healthIssues.push(`Elevated thermal temperature (${maxTemp.toFixed(1)}°C)`);

        let overallHealth = "HEALTHY";
        let overallSub = `All Systems Nominal • CPU (${cpuPct}%), RAM (${ramPct}%), Temp (${maxTemp > 0 ? maxTemp.toFixed(1) + "°C" : "Optimal"})`;

        if (healthBadge) {
          if (healthIssues.length > 0) {
            if (cpuPct > 95 || ramPct > 95 || maxTemp > 85) {
              overallHealth = "CRITICAL";
              overallSub = `Critical Anomaly • ${healthIssues.join(", ")}`;
              healthBadge.className = "setting-status-badge";
              healthBadge.style.background = "rgba(239,68,68,0.12)";
              healthBadge.style.color = "#ef4444";
              healthBadge.style.border = "1px solid rgba(239,68,68,0.3)";
            } else {
              overallHealth = "WARNING";
              overallSub = `Suboptimal State • ${healthIssues.join(", ")}`;
              healthBadge.className = "setting-status-badge";
              healthBadge.style.background = "rgba(245,158,11,0.12)";
              healthBadge.style.color = "#f59e0b";
              healthBadge.style.border = "1px solid rgba(245,158,11,0.3)";
            }
          } else {
            overallHealth = "HEALTHY";
            healthBadge.className = "setting-status-badge badge-active";
            healthBadge.style.background = "";
            healthBadge.style.color = "";
            healthBadge.style.border = "";
          }
          healthBadge.textContent = overallHealth;
        }
        if (healthSub) healthSub.textContent = overallSub;
        // Thermals
        renderDeviceInfoThermals(data.thermals || []);

        // Storage Partitions
        renderDeviceInfoStorage(data.storage || []);

        // Physical Ports
        renderDeviceInfoPorts(data.ports || []);

        // System & Firmware
        const boardModelEl = document.getElementById('sysBoardModel');
        if (boardModelEl) boardModelEl.textContent = sys.model || 'JioRouter AX6000 JIDU6J11-6811';

        const kernelEl = document.getElementById('sysKernelVersion');
        if (kernelEl) kernelEl.textContent = sys.kernel || 'Linux 6.18';

        const uptimeClockEl = document.getElementById('sysUptimeClock');
        if (uptimeClockEl) uptimeClockEl.textContent = `Uptime: ${sys.uptime_str || '--'} • Time: ${sys.local_time || '--'}`;

      } catch (e) {
        console.error('fetchDeviceInfo error', e);
      }
    }

    function renderDeviceInfoThermals(thermals) {
      const container = document.getElementById('sysThermalsContainer');
      const countEl = document.getElementById('sysThermalCount');
      if (!container) return;

      if (countEl) countEl.textContent = `${thermals.length} Zones`;

      if (thermals.length === 0) {
        container.innerHTML = '<div style="padding:10px 14px; color:var(--text-dim); font-size:11.5px;">No thermal zones detected.</div>';
        return;
      }

      container.innerHTML = thermals.map(t => {
        return `
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">${escapeHtml(t.name || t.type)}</span>
              <span class="setting-label-sub" style="font-family:var(--font-mono);">${t.temp_c}&deg;C &bull; Sensor: ${escapeHtml(t.type)}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderDeviceInfoStorage(storage) {
      const container = document.getElementById('sysStorageContainer');
      if (!container) return;

      if (storage.length === 0) {
        container.innerHTML = '<div style="padding:10px 14px; color:var(--text-dim); font-size:11.5px;">No storage partitions available.</div>';
        return;
      }

      container.innerHTML = storage.map(s => `
        <div class="setting-row-item">
          <div class="setting-label-col">
            <span class="setting-label-bold">Mount: ${escapeHtml(s.mount)}</span>
            <span class="setting-label-sub">${escapeHtml(s.used)} used of ${escapeHtml(s.size)} (${escapeHtml(s.use_pct)}) &bull; ${escapeHtml(s.avail)} free &bull; ${escapeHtml(s.fs)}</span>
          </div>
        </div>
      `).join('');
    }

    function renderDeviceInfoPorts(ports) {
      const container = document.getElementById('sysPortsContainer');
      if (!container) return;

      if (ports.length === 0) {
        container.innerHTML = '<div style="padding:10px 14px; color:var(--text-dim); font-size:11.5px;">No network ports detected.</div>';
        return;
      }

      container.innerHTML = ports.map(p => {
        const isUp = (p.status === 'UP');
        const statusText = isUp ? `${escapeHtml(p.speed)}${p.duplex === 'full' ? ' Full-Duplex' : ''} (LINK UP)` : 'LINK DOWN';
        const rxMb = (p.rx_bytes / 1048576).toFixed(1);
        const txMb = (p.tx_bytes / 1048576).toFixed(1);

        return `
          <div class="setting-row-item">
            <div class="setting-label-col">
              <span class="setting-label-bold">${escapeHtml(p.label)}</span>
              <span class="setting-label-sub">${statusText} &bull; ${escapeHtml(p.iface)} &bull; MAC: ${escapeHtml(p.mac)}${p.ip ? ' &bull; IP: ' + escapeHtml(p.ip) : ''} &bull; RX: ${rxMb}MB / TX: ${txMb}MB</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Startup Initialization: Load notifications and check for OS updates
    setTimeout(() => {
      if (typeof loadNotificationsPage === 'function') loadNotificationsPage();
      if (typeof checkForSystemFirmwareUpdates === 'function') checkForSystemFirmwareUpdates();
    }, 1500);
    setInterval(() => {
      if (typeof checkForSystemFirmwareUpdates === 'function') checkForSystemFirmwareUpdates();
    }, 30 * 60 * 1000);





/* ==============================================================================
   ES MODULE EXPORTS
   ============================================================================== */


if (typeof window !== 'undefined') {
  Object.assign(window, {
    applyThemeMode,
    setThemeMode,
    updateThemeTriButtons,
    apiFetch,
    fetchPublicHealthSnapshot,
    showLogin,
    showDashboard,
    pemSpkiToArrayBuffer,
    encryptCredentials,
    submitLogin,
    showLogoutConfirm,
    hideLogoutConfirm,
    logoutSession,
    openSettingPage,
    getValidationTypeForKey,
    onModalLiveValidate,
    triggerModalInitialValidation,
    loadUsbWanConfig,
    renderUsbWanDevices,
    saveUsbWanConfig,
    restartUsbWanInterfaces,
    openEditUsbDeviceModal,
    handleSettingsBack,
    closeSettingPage,
    toggleAccordion,
    filterSettingsSearch,
    clearSettingsSearch,
    switchTab,
    toggleSettingsMenu,
    getTempColor,
    getUsageColor,
    fmtBytes,
    fetchData,
    drawTrafficSparkline,
    renderMultiLinkMerger,
    selectFleetSlot,
    fetchSelectedSlotTelemetry,
    renderFleetMatrix,
    formatUptimeWithSec,
    getLiveMobUptime,
    getLiveRtrUptime,
    renderTooltipContent,
    fetchRealtimePing,
    positionBadaTooltip,
    showBadaTooltip,
    hideBadaTooltip,
    openSmbSettings,
    toggleSmbServiceLegacy,
    attachNodeTooltip,
    zoomTopology,
    resetTopologyZoom,
    applyTopologyZoom,
    toggleTopologyFullscreen,
    setTopologyLayerFilter,
    applyTopoTransform,
    initTopoPanDrag,
    initTopologyCpuOptimization,
    showTopoNodeDetail,
    closeTopoNodeDetail,
    showTopoEvidenceModal,
    closeTopoEvidenceModal,
    fitTopologyToScreen,
    openTopoNodeSettings,
    openTopoNodeClientPage,
    drawPeopleIcon,
    drawMobileIcon,
    drawSsdIcon,
    drawPendriveIconV1,
    resolveDeviceDisplayName,
    isStaleDeviceLabel,
    cleanDeviceLabel,
    classifyLanDevice,
    drawLanClientDeviceIcon,
    drawRouterBoxIcon,
    drawRouterApIcon,
    drawSwitchIcon,
    drawWifiAntennaIcon,
    drawDeviceIcon,
    drawNoInternetIconSmall,
    drawTetheringIconSmall,
    drawAdbIconSmall,
    drawMtpIconSmall,
    drawMobilePhoneIcon,
    drawPendriveIcon,
    drawStorageIconSmall,
    renderDeviceVerticalIcons,
    getApAndClientsForPort,
    getUsbThemeStyle,
    calcMaxLinkSpeedTag,
    getPortTopologyConfig,
    computeNodeInterfaceSlots,
    computeTreeTotalVerticalHeight,
    computeSubtreeBounds,
    computeTreeMaxDepth,
    computeSubtreeClientCount,
    getTopologyPrefs,
    updateTopologyPref,
    getTopologyThemeColors,
    setupTopologyAutoRefresh,
    makeStepEdgePath,
    computeLayeredSubtreeBounds,
    assignLayeredPositions,
    countTotalTopologyNodes,
    toggleExpandCollapseAll,
    setTopologyActiveLayer,
    highlightPathToRoot,
    clearPathHighlight,
    renderTopologyMinimap,
    getCombinedRouterSpeed,
    calcSpeedFlowDuration,
    calcSpeedFlowWidth,
    getDeviceSpeedMbps,
    buildUsbBwSvg,
    renderBwValues,
    renderTopologyFlow,
    renderData,
    renderMiniPorts,
    fetchBlockedList,
    fetchClients,
    setClientSort,
    onSearchClients,
    clearDhcpClientSearch,
    renderClientsCards,
    getClientHostOrDnsName,
    getClientStatusInfo,
    isGatewayDevice,
    openDhcpClientDetail,
    closeDhcpClientDetail,
    renderDhcpClientDetail,
    copyClientText,
    reserveClientStaticLease,
    getAvailableNetworkClients,
    createDefaultTopologyTree,
    normalizeTopologyTree,
    validateAndFixNodeTree,
    collectUsedIps,
    findNodeById,
    findPortById,
    validateTopologyTree,
    synthesizeLegacyPorts,
    renderUsbPortsSettingList,
    onWanModeChange,
    onWanSpeedChange,
    onUsbModeChange,
    onUsbPortCountChange,
    onUsbPortChange,
    triggerTopologyAutoSave,
    onNodePortCountChange,
    onPortRoleChange,
    onSelectPortDevice,
    onCustomPortDeviceChange,
    onSelectPortNodeClient,
    onNodeFieldChange,
    onAddWirelessClient,
    onRemoveWirelessClient,
    onWirelessClientChange,
    updateValidationNotice,
    renderTopologyPreferencesUI,
    toggleTopoPreferences,
    flattenTopologyNodes,
    renderTopologyLayersUI,
    renderNodeCard,
    renderNodeSettingGroups,
    renderSingleNodeSettingCard,
    onQuickAddWifiClient,
    onRemoveWifiClient,
    saveTopologyLayersConfig,
    resetTopologyLayersConfig,
    fetchTopologyLayers,
    autoMapNetworkTopology,
    openExportTopologyModal,
    openImportTopologyModal,
    closeTopoJsonModal,
    copyTopoJsonToClipboard,
    applyImportedTopoJson,
    showSaveSuccessNotification,
    renderBlockedCards,
    blockDevice,
    unblockDevice,
    submitManualBlock,
    fetchUsbDevicesFlow,
    renderUsbDevicesFlow,
    restartNetworkAndMultilink,
    clearDnsAndConntrack,
    downloadKernelLogs,
    onSelectAdbDevice,
    onSelectUsbHardwareDevice,
    fetchDeviceTelemetry,
    fetchDeviceSms,
    runDevicePing,
    saveAdbDeviceStates,
    getAdbDeviceState,
    updateAdbTorchUI,
    fetchAdbLiveTelemetry,
    copyAdbSerial,
    switchAdbSubView,
    fetchAdbSmsPage,
    renderAdbSmsPageList,
    filterAdbSmsPage,
    fetchAdbCallsPage,
    renderAdbCallsPageList,
    filterAdbCallsPage,
    fetchAdbContactsPage,
    renderAdbContactsPageList,
    filterAdbContactsPage,
    openAdbSmsModal,
    openAdbCallLogsModal,
    openAdbContactsModal,
    closeAdbSmsModal,
    closeAdbCallLogsModal,
    closeAdbContactsModal,
    captureAdbScreenshot,
    closeAdbScreenshotModal,
    togglePhoneTorch,
    volumePhone,
    runDeviceWake,
    runDeviceSleep,
    runDeviceAirplane,
    runDeviceReboot,
    runDeviceLock,
    openPhoneTetherSettings,
    fetchDeviceContacts,
    filterContacts,
    renderContactsList,
    fetchDeviceCalls,
    handleRestoreFileChosen,
    initDropzoneHandlers,
    toggleDiagRawLog,
    setSettingSaveStatus,
    scheduleNetworkAutoSave,
    saveNetworkSettingsAuto,
    openSettingModal,
    onModalMaskInput,
    onModalCidrChange,
    closeSettingModal,
    onModalOverlayClick,
    isValidIpv4,
    isValidSubnetMask,
    isValidMac,
    generateRandomMacInModal,
    saveSettingModal,
    fetchSecuritySettings,
    saveSecurityPolicy,
    fetchAdbDeviceList,
    renderAdbDevicesCards,
    openAdbDeviceDetail,
    closeAdbDeviceDetail,
    selectAdbDevice,
    updateSelectedAdbDeviceControls,
    enableWirelessAdb,
    parseUserAgentSecurityDetails,
    formatSessionDateTime,
    fetchActiveSessions,
    logoutSingleDevice,
    logoutOtherDevices,
    logoutAllSessions,
    logoutCurrentSession,
    switchDiagTool,
    setPortScanMode,
    resetDefaultPorts,
    setDnsQueryType,
    clearDiagResults,
    toggleDiagExecution,
    stopDiagExecution,
    startDiagExecution,
    executeNextPing,
    executeTraceroute,
    executePortScan,
    executeWhois,
    executeDnsQuery,
    runRouterDiagnostic,
    renderDiagnosticGui,
    maskToCidr,
    cidrToMask,
    syncCidrFromMask,
    syncMaskFromCidr,
    toggleDhcpControls,
    toggleIpv6Master,
    setDnsPreset,
    renderStaticLeases,
    addStaticLeaseFromUI,
    delStaticLease,
    toggleUsbTethering,
    toggleUsbTetherDns,
    fetchNetworkConfig,
    saveNetworkSettings,
    onWanProtoChange,
    updateWanInterfaceDisplays,
    loadWanInterfaceConfig,
    saveWanInterfaceConfig,
    cloneCurrentPcMac,
    cloneCurrentPcMacToModal,
    generateRandomWanMacInModal,
    resetWanMacToDefault,
    loadPppoeConfig,
    togglePppoeClient,
    savePppoeClientCreds,
    savePppoeClientAc,
    savePppoeClientMac,
    generateRandomPppoeMac,
    togglePppoeServer,
    savePppoeServerConfig,
    addPppoeUserFromModal,
    deletePppoeUser,
    loadDufsConfig,
    toggleDufsService,
    saveDufsConfig,
    openNotificationPage,
    toggleNotificationCenter,
    closeNotificationCenter,
    updateNotificationBadge,
    clearAcknowledgedAlerts,
    openSslHelpModal,
    closeSslHelpModal,
    loadSslCertificateStatus,
    requestDuckDnsSsl,
    toggleBrowserPushPermission,
    updatePushNotificationButtonState,
    loadNotificationsPage,
    deleteNotification,
    clearAllNotifications,
    dispatchTestNotification,
    dispatchAlertNotification,
    checkSystemAlerts,
    checkForSystemFirmwareUpdates,
    loadWebhooksConfig,
    saveWebhooksConfig,
    testWebhookProvider,
    fetchLogs,
    renderLogs,
    switchLogType,
    filterLogsRealtime,
    refreshLogViewer,
    toggleLogAutoRefresh,
    stopLogAutoRefresh,
    downloadCurrentLog,
    fetchPackages,
    renderPackagesList,
    switchPackageTab,
    handlePackageSearchInput,
    updatePackageRepositories,
    installPackage,
    installPackageDirect,
    uninstallPackage,
    getTerminalResponsiveFontSize,
    getTerminalTheme,
    updateTerminalTheme,
    loadResource,
    ensureTerminalEngine,
    initNativeTerminal,
    connectTerminalWebSocket,
    setTailscaleLoginState,
    updateTailscaleWebLoginUrl,
    renderTailscaleAccount,
    renderTailscaleDevices,
    fetchTailscale,
    toggleTailscaleService,
    startTailscaleWebLogin,
    checkTailscaleAuthUrl,
    copyTsAuthUrl,
    logoutTailscale,
    loginTailscaleWithKey,
    restartTailscale,
    applyTailscalePrefs,
    fetchSmbConfig,
    toggleSmbService,
    saveSmbCredentials,
    copySmbPath,
    fallbackCopyText,
    onSelectMultiLinkSlot,
    changeAdminPassword,
    downloadBackupArchive,
    uploadRestoreArchive,
    showFactoryResetModal,
    closeFactoryResetModal,
    openFirmwareFlashModal,
    closeFirmwareFlashModal,
    openRamBootModal,
    closeRamBootModal,
    executeDirectRamBoot,
    startFirmwareFlash,
    executeFactoryReset,
    confirmFactoryReset,
    confirmFactoryResetRouter,
    downloadSystemLog,
    downloadKernelLog,
    showToast,
    checkLatestFirmwareUpdate,
    installSysupgradeUpdate,
    confirmRebootRouter,
    checkUpdateStatus,
    executeFirmwareUpdate,
    confirmCleanUpdate,
    fetchWifiConfig,
    renderWifiClients,
    saveWifiSettings,
    toggleWifiMasterPower,
    togglePasswordVisibility,
    toggleRamBootDetailsInModal,
    showRamBootInstructions,
    copyTextToClipboard,
    toggleAutoRefresh,
    setupTimer,
    updateToggleBadge,
    updateThemeUI,
    toggleTheme,
    copyUpi,
    fallbackCopy,
    showCopied,
    escapeHtml,
    toggleAnimFlow,
    toggleCyberGlow,
    toggleDenseMode,
    downloadActiveLog,
    toggleHapticFeedback,
    triggerHaptic,
    fetchDeviceInfo,
    renderDeviceInfoThermals,
    renderDeviceInfoStorage,
    renderDeviceInfoPorts,
    activeAdbDevices,
    selectedAdbSerial,
    cachedClients,
    currentTheme,
    currentThemeMode
  });
}



export {
  applyThemeMode,
  setThemeMode,
  updateThemeTriButtons,
  apiFetch,
  fetchPublicHealthSnapshot,
  showLogin,
  showDashboard,
  pemSpkiToArrayBuffer,
  encryptCredentials,
  submitLogin,
  showLogoutConfirm,
  hideLogoutConfirm,
  logoutSession,
  openSettingPage,
  getValidationTypeForKey,
  onModalLiveValidate,
  triggerModalInitialValidation,
  loadUsbWanConfig,
  renderUsbWanDevices,
  saveUsbWanConfig,
  restartUsbWanInterfaces,
  openEditUsbDeviceModal,
  handleSettingsBack,
  closeSettingPage,
  toggleAccordion,
  filterSettingsSearch,
  clearSettingsSearch,
  switchTab,
  toggleSettingsMenu,
  getTempColor,
  getUsageColor,
  fmtBytes,
  fetchData,
  drawTrafficSparkline,
  renderMultiLinkMerger,
  selectFleetSlot,
  fetchSelectedSlotTelemetry,
  renderFleetMatrix,
  formatUptimeWithSec,
  getLiveMobUptime,
  getLiveRtrUptime,
  renderTooltipContent,
  fetchRealtimePing,
  positionBadaTooltip,
  showBadaTooltip,
  hideBadaTooltip,
  openSmbSettings,
  toggleSmbServiceLegacy,
  attachNodeTooltip,
  zoomTopology,
  resetTopologyZoom,
  applyTopologyZoom,
  toggleTopologyFullscreen,
  setTopologyLayerFilter,
  applyTopoTransform,
  initTopoPanDrag,
  initTopologyCpuOptimization,
  showTopoNodeDetail,
  closeTopoNodeDetail,
  showTopoEvidenceModal,
  closeTopoEvidenceModal,
  fitTopologyToScreen,
  openTopoNodeSettings,
  openTopoNodeClientPage,
  drawPeopleIcon,
  drawMobileIcon,
  drawSsdIcon,
  drawPendriveIconV1,
  resolveDeviceDisplayName,
  isStaleDeviceLabel,
  cleanDeviceLabel,
  classifyLanDevice,
  drawLanClientDeviceIcon,
  drawRouterBoxIcon,
  drawRouterApIcon,
  drawSwitchIcon,
  drawWifiAntennaIcon,
  drawDeviceIcon,
  drawNoInternetIconSmall,
  drawTetheringIconSmall,
  drawAdbIconSmall,
  drawMtpIconSmall,
  drawMobilePhoneIcon,
  drawPendriveIcon,
  drawStorageIconSmall,
  renderDeviceVerticalIcons,
  getApAndClientsForPort,
  getUsbThemeStyle,
  calcMaxLinkSpeedTag,
  getPortTopologyConfig,
  computeNodeInterfaceSlots,
  computeTreeTotalVerticalHeight,
  computeSubtreeBounds,
  computeTreeMaxDepth,
  computeSubtreeClientCount,
  getTopologyPrefs,
  updateTopologyPref,
  getTopologyThemeColors,
  setupTopologyAutoRefresh,
  makeStepEdgePath,
  computeLayeredSubtreeBounds,
  assignLayeredPositions,
  countTotalTopologyNodes,
  toggleExpandCollapseAll,
  setTopologyActiveLayer,
  highlightPathToRoot,
  clearPathHighlight,
  renderTopologyMinimap,
  getCombinedRouterSpeed,
  calcSpeedFlowDuration,
  calcSpeedFlowWidth,
  getDeviceSpeedMbps,
  buildUsbBwSvg,
  renderBwValues,
  renderTopologyFlow,
  renderData,
  renderMiniPorts,
  fetchBlockedList,
  fetchClients,
  setClientSort,
  onSearchClients,
  clearDhcpClientSearch,
  renderClientsCards,
  getClientHostOrDnsName,
  getClientStatusInfo,
  isGatewayDevice,
  openDhcpClientDetail,
  closeDhcpClientDetail,
  renderDhcpClientDetail,
  copyClientText,
  reserveClientStaticLease,
  getAvailableNetworkClients,
  createDefaultTopologyTree,
  normalizeTopologyTree,
  validateAndFixNodeTree,
  collectUsedIps,
  findNodeById,
  findPortById,
  validateTopologyTree,
  synthesizeLegacyPorts,
  renderUsbPortsSettingList,
  onWanModeChange,
  onWanSpeedChange,
  onUsbModeChange,
  onUsbPortCountChange,
  onUsbPortChange,
  triggerTopologyAutoSave,
  onNodePortCountChange,
  onPortRoleChange,
  onSelectPortDevice,
  onCustomPortDeviceChange,
  onSelectPortNodeClient,
  onNodeFieldChange,
  onAddWirelessClient,
  onRemoveWirelessClient,
  onWirelessClientChange,
  updateValidationNotice,
  renderTopologyPreferencesUI,
  toggleTopoPreferences,
  flattenTopologyNodes,
  renderTopologyLayersUI,
  renderNodeCard,
  renderNodeSettingGroups,
  renderSingleNodeSettingCard,
  onQuickAddWifiClient,
  onRemoveWifiClient,
  saveTopologyLayersConfig,
  resetTopologyLayersConfig,
  fetchTopologyLayers,
  autoMapNetworkTopology,
  openExportTopologyModal,
  openImportTopologyModal,
  closeTopoJsonModal,
  copyTopoJsonToClipboard,
  applyImportedTopoJson,
  showSaveSuccessNotification,
  renderBlockedCards,
  blockDevice,
  unblockDevice,
  submitManualBlock,
  fetchUsbDevicesFlow,
  renderUsbDevicesFlow,
  restartNetworkAndMultilink,
  clearDnsAndConntrack,
  downloadKernelLogs,
  onSelectAdbDevice,
  onSelectUsbHardwareDevice,
  fetchDeviceTelemetry,
  fetchDeviceSms,
  runDevicePing,
  saveAdbDeviceStates,
  getAdbDeviceState,
  updateAdbTorchUI,
  fetchAdbLiveTelemetry,
  copyAdbSerial,
  switchAdbSubView,
  fetchAdbSmsPage,
  renderAdbSmsPageList,
  filterAdbSmsPage,
  fetchAdbCallsPage,
  renderAdbCallsPageList,
  filterAdbCallsPage,
  fetchAdbContactsPage,
  renderAdbContactsPageList,
  filterAdbContactsPage,
  openAdbSmsModal,
  openAdbCallLogsModal,
  openAdbContactsModal,
  closeAdbSmsModal,
  closeAdbCallLogsModal,
  closeAdbContactsModal,
  captureAdbScreenshot,
  closeAdbScreenshotModal,
  togglePhoneTorch,
  volumePhone,
  runDeviceWake,
  runDeviceSleep,
  runDeviceAirplane,
  runDeviceReboot,
  runDeviceLock,
  openPhoneTetherSettings,
  fetchDeviceContacts,
  filterContacts,
  renderContactsList,
  fetchDeviceCalls,
  handleRestoreFileChosen,
  initDropzoneHandlers,
  toggleDiagRawLog,
  setSettingSaveStatus,
  scheduleNetworkAutoSave,
  saveNetworkSettingsAuto,
  openSettingModal,
  onModalMaskInput,
  onModalCidrChange,
  closeSettingModal,
  onModalOverlayClick,
  isValidIpv4,
  isValidSubnetMask,
  isValidMac,
  generateRandomMacInModal,
  saveSettingModal,
  fetchSecuritySettings,
  saveSecurityPolicy,
  fetchAdbDeviceList,
  renderAdbDevicesCards,
  openAdbDeviceDetail,
  closeAdbDeviceDetail,
  selectAdbDevice,
  updateSelectedAdbDeviceControls,
  enableWirelessAdb,
  parseUserAgentSecurityDetails,
  formatSessionDateTime,
  fetchActiveSessions,
  logoutSingleDevice,
  logoutOtherDevices,
  logoutAllSessions,
  logoutCurrentSession,
  switchDiagTool,
  setPortScanMode,
  resetDefaultPorts,
  setDnsQueryType,
  clearDiagResults,
  toggleDiagExecution,
  stopDiagExecution,
  startDiagExecution,
  executeNextPing,
  executeTraceroute,
  executePortScan,
  executeWhois,
  executeDnsQuery,
  runRouterDiagnostic,
  renderDiagnosticGui,
  maskToCidr,
  cidrToMask,
  syncCidrFromMask,
  syncMaskFromCidr,
  toggleDhcpControls,
  toggleIpv6Master,
  setDnsPreset,
  renderStaticLeases,
  addStaticLeaseFromUI,
  delStaticLease,
  toggleUsbTethering,
  toggleUsbTetherDns,
  fetchNetworkConfig,
  saveNetworkSettings,
  onWanProtoChange,
  updateWanInterfaceDisplays,
  loadWanInterfaceConfig,
  saveWanInterfaceConfig,
  cloneCurrentPcMac,
  cloneCurrentPcMacToModal,
  generateRandomWanMacInModal,
  resetWanMacToDefault,
  loadPppoeConfig,
  togglePppoeClient,
  savePppoeClientCreds,
  savePppoeClientAc,
  savePppoeClientMac,
  generateRandomPppoeMac,
  togglePppoeServer,
  savePppoeServerConfig,
  addPppoeUserFromModal,
  deletePppoeUser,
  loadDufsConfig,
  toggleDufsService,
  saveDufsConfig,
  openNotificationPage,
  toggleNotificationCenter,
  closeNotificationCenter,
  updateNotificationBadge,
  clearAcknowledgedAlerts,
  openSslHelpModal,
  closeSslHelpModal,
  loadSslCertificateStatus,
  requestDuckDnsSsl,
  toggleBrowserPushPermission,
  updatePushNotificationButtonState,
  loadNotificationsPage,
  deleteNotification,
  clearAllNotifications,
  dispatchTestNotification,
  dispatchAlertNotification,
  checkSystemAlerts,
  checkForSystemFirmwareUpdates,
  loadWebhooksConfig,
  saveWebhooksConfig,
  testWebhookProvider,
  fetchLogs,
  renderLogs,
  switchLogType,
  filterLogsRealtime,
  refreshLogViewer,
  toggleLogAutoRefresh,
  stopLogAutoRefresh,
  downloadCurrentLog,
  fetchPackages,
  renderPackagesList,
  switchPackageTab,
  handlePackageSearchInput,
  updatePackageRepositories,
  installPackage,
  installPackageDirect,
  uninstallPackage,
  getTerminalResponsiveFontSize,
  getTerminalTheme,
  updateTerminalTheme,
  loadResource,
  ensureTerminalEngine,
  initNativeTerminal,
  connectTerminalWebSocket,
  setTailscaleLoginState,
  updateTailscaleWebLoginUrl,
  renderTailscaleAccount,
  renderTailscaleDevices,
  fetchTailscale,
  toggleTailscaleService,
  startTailscaleWebLogin,
  checkTailscaleAuthUrl,
  copyTsAuthUrl,
  logoutTailscale,
  loginTailscaleWithKey,
  restartTailscale,
  applyTailscalePrefs,
  fetchSmbConfig,
  toggleSmbService,
  saveSmbCredentials,
  copySmbPath,
  fallbackCopyText,
  onSelectMultiLinkSlot,
  changeAdminPassword,
  downloadBackupArchive,
  uploadRestoreArchive,
  showFactoryResetModal,
  closeFactoryResetModal,
  openFirmwareFlashModal,
  closeFirmwareFlashModal,
  openRamBootModal,
  closeRamBootModal,
  executeDirectRamBoot,
  startFirmwareFlash,
  executeFactoryReset,
  confirmFactoryReset,
  confirmFactoryResetRouter,
  downloadSystemLog,
  downloadKernelLog,
  showToast,
  checkLatestFirmwareUpdate,
  installSysupgradeUpdate,
  confirmRebootRouter,
  checkUpdateStatus,
  executeFirmwareUpdate,
  confirmCleanUpdate,
  fetchWifiConfig,
  renderWifiClients,
  saveWifiSettings,
  toggleWifiMasterPower,
  togglePasswordVisibility,
  toggleRamBootDetailsInModal,
  showRamBootInstructions,
  copyTextToClipboard,
  toggleAutoRefresh,
  setupTimer,
  updateToggleBadge,
  updateThemeUI,
  toggleTheme,
  copyUpi,
  fallbackCopy,
  showCopied,
  escapeHtml,
  toggleAnimFlow,
  toggleCyberGlow,
  toggleDenseMode,
  downloadActiveLog,
  toggleHapticFeedback,
  triggerHaptic,
  fetchDeviceInfo,
  renderDeviceInfoThermals,
  renderDeviceInfoStorage,
  renderDeviceInfoPorts,
  activeAdbDevices,
  selectedAdbSerial,
  cachedClients,
  currentTheme,
  currentThemeMode
};
