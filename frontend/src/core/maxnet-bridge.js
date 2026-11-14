/* ==============================================================================
   MAXNET CONTROLLER WINDOW BRIDGE
   Exposes all verified controller functions to global window for HTML event handlers
   ============================================================================== */
import {
  submitLogin,
  logoutSession,
  hideLogoutConfirm,
  switchTab,
  toggleTheme,
  setThemeMode,
  toggleSettingsMenu,
  toggleNotificationCenter,
  toggleCyberGlow,
  toggleDenseMode,
  toggleHapticFeedback,
  toggleAutoRefresh,
  openSettingModal,
  closeSettingModal,
  saveSettingModal,
  openSettingPage,
  handleSettingsBack,
  filterSettingsSearch,
  clearSettingsSearch,
  toggleAccordion,
  onModalOverlayClick,
  resetTopologyZoom,
  fitTopologyToScreen,
  zoomTopology,
  closeTopoNodeDetail,
  openTopoNodeClientPage,
  openTopoNodeSettings,
  closeTopoJsonModal,
  copyTopoJsonToClipboard,
  applyImportedTopoJson,
  openExportTopologyModal,
  openImportTopologyModal,
  closeTopoEvidenceModal,
  resetTopologyLayersConfig,
  autoMapNetworkTopology,
  toggleAnimFlow,
  switchAdbSubView,
  fetchAdbSmsPage,
  filterAdbSmsPage,
  closeAdbSmsModal,
  fetchAdbCallsPage,
  filterAdbCallsPage,
  closeAdbCallLogsModal,
  fetchAdbContactsPage,
  filterAdbContactsPage,
  closeAdbContactsModal,
  captureAdbScreenshot,
  closeAdbScreenshotModal,
  runDeviceWake,
  runDeviceSleep,
  runDeviceReboot,
  runDeviceAirplane,
  togglePhoneTorch,
  volumePhone,
  enableWirelessAdb,
  copyAdbSerial,
  saveUsbWanConfig,
  restartNetworkAndMultilink,
  scheduleNetworkAutoSave,
  saveSecurityPolicy,
  saveWanInterfaceConfig,
  loadWanInterfaceConfig,
  toggleDhcpControls,
  toggleIpv6Master,
  saveWebhooksConfig,
  testWebhookProvider,
  loadPppoeConfig,
  togglePppoeClient,
  togglePppoeServer,
  toggleSmbService,
  copySmbPath,
  toggleDufsService,
  toggleTailscaleService,
  startTailscaleWebLogin,
  logoutTailscale,
  restartTailscale,
  applyTailscalePrefs,
  copyTsAuthUrl,
  switchDiagTool,
  toggleDiagExecution,
  toggleDiagRawLog,
  clearDiagResults,
  setPortScanMode,
  setDnsQueryType,
  confirmRebootRouter,
  showFactoryResetModal,
  closeFactoryResetModal,
  openFirmwareFlashModal,
  closeFirmwareFlashModal,
  openRamBootModal,
  closeRamBootModal,
  executeDirectRamBoot,
  startFirmwareFlash,
  executeFactoryReset,
  downloadBackupArchive,
  handleRestoreFileChosen,
  uploadRestoreArchive,
  clearDnsAndConntrack,
  checkLatestFirmwareUpdate,
  switchLogType,
  refreshLogViewer,
  downloadActiveLog,
  switchPackageTab,
  handlePackageSearchInput,
  updatePackageRepositories,
  copyUpi,
  closeSslHelpModal,
  onSearchClients,
  clearDhcpClientSearch,
  showToast,
  apiFetch,
  fetchDeviceInfo,
  fetchTailscale,
  fetchAdbLiveTelemetry,
  fetchWifiConfig,
  renderWifiClients,
  saveWifiSettings,
  toggleWifiMasterPower,
  togglePasswordVisibility
} from './maxnet-engine.js';

// Helper aliases and inline handler adapters
function filterAdbSms(val) {
  if (typeof filterAdbSmsPage === 'function') filterAdbSmsPage(val);
}

function filterAdbContacts(val) {
  if (typeof filterAdbContactsPage === 'function') filterAdbContactsPage(val);
}

function showNotificationToast(msg, isError) {
  if (typeof showToast === 'function') showToast(msg, isError ? 'error' : 'info');
}

function saveSmbGuestSetting(checked) {
  if (typeof saveSettingModal === 'function') saveSettingModal();
}

async function powerCycleUsbHub() {
  if (typeof showToast === 'function') showToast('Power cycling USB hub (VBUS reset)...', 'warning');
  try {
    await apiFetch('/cgi-bin/usb_wan?action=power_cycle');
    if (typeof showToast === 'function') showToast('USB Hub power cycled successfully!', 'success');
  } catch (e) {
    if (typeof showToast === 'function') showToast('USB power cycle trigger completed', 'info');
  }
}

if (typeof window !== 'undefined') {
  // Explicit window property assignments for high performance & legacy compatibility
  window.submitLogin = submitLogin;
  window.logoutSession = logoutSession;
  window.hideLogoutConfirm = hideLogoutConfirm;
  window.switchTab = switchTab;
  window.toggleTheme = toggleTheme;
  window.setThemeMode = setThemeMode;
  window.toggleSettingsMenu = toggleSettingsMenu;
  window.toggleNotificationCenter = toggleNotificationCenter;
  window.toggleCyberGlow = toggleCyberGlow;
  window.toggleDenseMode = toggleDenseMode;
  window.toggleHapticFeedback = toggleHapticFeedback;
  window.toggleAutoRefresh = toggleAutoRefresh;
  window.openSettingModal = openSettingModal;
  window.closeSettingModal = closeSettingModal;
  window.saveSettingModal = saveSettingModal;
  window.openSettingPage = openSettingPage;
  window.handleSettingsBack = handleSettingsBack;
  window.filterSettingsSearch = filterSettingsSearch;
  window.clearSettingsSearch = clearSettingsSearch;
  window.toggleAccordion = toggleAccordion;
  window.onModalOverlayClick = onModalOverlayClick;
  window.resetTopologyZoom = resetTopologyZoom;
  window.fitTopologyToScreen = fitTopologyToScreen;
  window.zoomTopology = zoomTopology;
  window.closeTopoNodeDetail = closeTopoNodeDetail;
  window.openTopoNodeClientPage = openTopoNodeClientPage;
  window.openTopoNodeSettings = openTopoNodeSettings;
  window.closeTopoJsonModal = closeTopoJsonModal;
  window.copyTopoJsonToClipboard = copyTopoJsonToClipboard;
  window.applyImportedTopoJson = applyImportedTopoJson;
  window.openExportTopologyModal = openExportTopologyModal;
  window.openImportTopologyModal = openImportTopologyModal;
  window.closeTopoEvidenceModal = closeTopoEvidenceModal;
  window.resetTopologyLayersConfig = resetTopologyLayersConfig;
  window.autoMapNetworkTopology = autoMapNetworkTopology;
  window.toggleAnimFlow = toggleAnimFlow;
  window.switchAdbSubView = switchAdbSubView;
  window.fetchAdbSmsPage = fetchAdbSmsPage;
  window.filterAdbSmsPage = filterAdbSmsPage;
  window.closeAdbSmsModal = closeAdbSmsModal;
  window.fetchAdbCallsPage = fetchAdbCallsPage;
  window.filterAdbCallsPage = filterAdbCallsPage;
  window.closeAdbCallLogsModal = closeAdbCallLogsModal;
  window.fetchAdbContactsPage = fetchAdbContactsPage;
  window.filterAdbContactsPage = filterAdbContactsPage;
  window.closeAdbContactsModal = closeAdbContactsModal;
  window.captureAdbScreenshot = captureAdbScreenshot;
  window.closeAdbScreenshotModal = closeAdbScreenshotModal;
  window.runDeviceWake = runDeviceWake;
  window.runDeviceSleep = runDeviceSleep;
  window.runDeviceReboot = runDeviceReboot;
  window.runDeviceAirplane = runDeviceAirplane;
  window.togglePhoneTorch = togglePhoneTorch;
  window.volumePhone = volumePhone;
  window.enableWirelessAdb = enableWirelessAdb;
  window.copyAdbSerial = copyAdbSerial;
  window.saveUsbWanConfig = saveUsbWanConfig;
  window.restartNetworkAndMultilink = restartNetworkAndMultilink;
  window.scheduleNetworkAutoSave = scheduleNetworkAutoSave;
  window.saveSecurityPolicy = saveSecurityPolicy;
  window.saveWanInterfaceConfig = saveWanInterfaceConfig;
  window.loadWanInterfaceConfig = loadWanInterfaceConfig;
  window.toggleDhcpControls = toggleDhcpControls;
  window.toggleIpv6Master = toggleIpv6Master;
  window.saveWebhooksConfig = saveWebhooksConfig;
  window.testWebhookProvider = testWebhookProvider;
  window.loadPppoeConfig = loadPppoeConfig;
  window.togglePppoeClient = togglePppoeClient;
  window.togglePppoeServer = togglePppoeServer;
  window.toggleSmbService = toggleSmbService;
  window.copySmbPath = copySmbPath;
  window.toggleDufsService = toggleDufsService;
  window.toggleTailscaleService = toggleTailscaleService;
  window.startTailscaleWebLogin = startTailscaleWebLogin;
  window.logoutTailscale = logoutTailscale;
  window.restartTailscale = restartTailscale;
  window.applyTailscalePrefs = applyTailscalePrefs;
  window.copyTsAuthUrl = copyTsAuthUrl;
  window.switchDiagTool = switchDiagTool;
  window.toggleDiagExecution = toggleDiagExecution;
  window.toggleDiagRawLog = toggleDiagRawLog;
  window.clearDiagResults = clearDiagResults;
  window.setPortScanMode = setPortScanMode;
  window.setDnsQueryType = setDnsQueryType;
  window.confirmRebootRouter = confirmRebootRouter;
  window.showFactoryResetModal = showFactoryResetModal;
  window.closeFactoryResetModal = closeFactoryResetModal;
  window.openFirmwareFlashModal = openFirmwareFlashModal;
  window.closeFirmwareFlashModal = closeFirmwareFlashModal;
  window.openRamBootModal = openRamBootModal;
  window.closeRamBootModal = closeRamBootModal;
  window.executeDirectRamBoot = executeDirectRamBoot;
  window.startFirmwareFlash = startFirmwareFlash;
  window.executeFactoryReset = executeFactoryReset;
  window.downloadBackupArchive = downloadBackupArchive;
  window.handleRestoreFileChosen = handleRestoreFileChosen;
  window.uploadRestoreArchive = uploadRestoreArchive;
  window.clearDnsAndConntrack = clearDnsAndConntrack;
  window.checkLatestFirmwareUpdate = checkLatestFirmwareUpdate;
  window.switchLogType = switchLogType;
  window.refreshLogViewer = refreshLogViewer;
  window.downloadActiveLog = downloadActiveLog;
  window.switchPackageTab = switchPackageTab;
  window.handlePackageSearchInput = handlePackageSearchInput;
  window.updatePackageRepositories = updatePackageRepositories;
  window.copyUpi = copyUpi;
  window.closeSslHelpModal = closeSslHelpModal;
  window.onSearchClients = onSearchClients;
  window.clearDhcpClientSearch = clearDhcpClientSearch;
  window.showToast = showToast;
  window.apiFetch = apiFetch;
  window.fetchDeviceInfo = fetchDeviceInfo;
  window.fetchTailscale = fetchTailscale;
  window.fetchAdbLiveTelemetry = fetchAdbLiveTelemetry;
  window.filterAdbSms = filterAdbSms;
  window.filterAdbContacts = filterAdbContacts;
  window.showNotificationToast = showNotificationToast;
  window.saveSmbGuestSetting = saveSmbGuestSetting;
  window.powerCycleUsbHub = powerCycleUsbHub;
  window.fetchWifiConfig = fetchWifiConfig;
  window.renderWifiClients = renderWifiClients;
  window.saveWifiSettings = saveWifiSettings;
  window.toggleWifiMasterPower = toggleWifiMasterPower;
  window.togglePasswordVisibility = togglePasswordVisibility;

  // Mass object assign
  Object.assign(window, {
    fetchWifiConfig,
    renderWifiClients,
    saveWifiSettings,
    toggleWifiMasterPower,
    togglePasswordVisibility,
    submitLogin,
    logoutSession,
    hideLogoutConfirm,
    switchTab,
    toggleTheme,
    setThemeMode,
    toggleSettingsMenu,
    toggleNotificationCenter,
    toggleCyberGlow,
    toggleDenseMode,
    toggleHapticFeedback,
    toggleAutoRefresh,
    openSettingModal,
    closeSettingModal,
    saveSettingModal,
    openSettingPage,
    handleSettingsBack,
    filterSettingsSearch,
    clearSettingsSearch,
    toggleAccordion,
    onModalOverlayClick,
    resetTopologyZoom,
    fitTopologyToScreen,
    zoomTopology,
    closeTopoNodeDetail,
    openTopoNodeClientPage,
    openTopoNodeSettings,
    closeTopoJsonModal,
    copyTopoJsonToClipboard,
    applyImportedTopoJson,
    openExportTopologyModal,
    openImportTopologyModal,
    closeTopoEvidenceModal,
    resetTopologyLayersConfig,
    autoMapNetworkTopology,
    toggleAnimFlow,
    switchAdbSubView,
    fetchAdbSmsPage,
    filterAdbSmsPage,
    closeAdbSmsModal,
    fetchAdbCallsPage,
    filterAdbCallsPage,
    closeAdbCallLogsModal,
    fetchAdbContactsPage,
    filterAdbContactsPage,
    closeAdbContactsModal,
    captureAdbScreenshot,
    closeAdbScreenshotModal,
    runDeviceWake,
    runDeviceSleep,
    runDeviceReboot,
    runDeviceAirplane,
    togglePhoneTorch,
    volumePhone,
    enableWirelessAdb,
    copyAdbSerial,
    saveUsbWanConfig,
    restartNetworkAndMultilink,
    scheduleNetworkAutoSave,
    saveSecurityPolicy,
    saveWanInterfaceConfig,
    loadWanInterfaceConfig,
    toggleDhcpControls,
    toggleIpv6Master,
    saveWebhooksConfig,
    testWebhookProvider,
    loadPppoeConfig,
    togglePppoeClient,
    togglePppoeServer,
    toggleSmbService,
    copySmbPath,
    toggleDufsService,
    toggleTailscaleService,
    startTailscaleWebLogin,
    logoutTailscale,
    restartTailscale,
    applyTailscalePrefs,
    copyTsAuthUrl,
    switchDiagTool,
    toggleDiagExecution,
    toggleDiagRawLog,
    clearDiagResults,
    setPortScanMode,
    setDnsQueryType,
    confirmRebootRouter,
    showFactoryResetModal,
    closeFactoryResetModal,
    executeFactoryReset,
    downloadBackupArchive,
    handleRestoreFileChosen,
    uploadRestoreArchive,
    clearDnsAndConntrack,
    checkLatestFirmwareUpdate,
    switchLogType,
    refreshLogViewer,
    downloadActiveLog,
    switchPackageTab,
    handlePackageSearchInput,
    updatePackageRepositories,
    copyUpi,
    closeSslHelpModal,
    onSearchClients,
    clearDhcpClientSearch,
    showToast,
    apiFetch,
    fetchDeviceInfo,
    fetchTailscale,
    fetchAdbLiveTelemetry,
    filterAdbSms,
    filterAdbContacts,
    showNotificationToast,
    saveSmbGuestSetting,
    powerCycleUsbHub
  });
}

export {
  submitLogin,
  logoutSession,
  hideLogoutConfirm,
  switchTab,
  toggleTheme,
  setThemeMode,
  toggleSettingsMenu,
  toggleNotificationCenter,
  toggleCyberGlow,
  toggleDenseMode,
  toggleHapticFeedback,
  toggleAutoRefresh,
  openSettingModal,
  closeSettingModal,
  saveSettingModal,
  openSettingPage,
  handleSettingsBack,
  filterSettingsSearch,
  clearSettingsSearch,
  toggleAccordion,
  onModalOverlayClick,
  resetTopologyZoom,
  fitTopologyToScreen,
  zoomTopology,
  closeTopoNodeDetail,
  openTopoNodeClientPage,
  openTopoNodeSettings,
  closeTopoJsonModal,
  copyTopoJsonToClipboard,
  applyImportedTopoJson,
  openExportTopologyModal,
  openImportTopologyModal,
  closeTopoEvidenceModal,
  resetTopologyLayersConfig,
  autoMapNetworkTopology,
  toggleAnimFlow,
  switchAdbSubView,
  fetchAdbSmsPage,
  filterAdbSmsPage,
  closeAdbSmsModal,
  fetchAdbCallsPage,
  filterAdbCallsPage,
  closeAdbCallLogsModal,
  fetchAdbContactsPage,
  filterAdbContactsPage,
  closeAdbContactsModal,
  captureAdbScreenshot,
  closeAdbScreenshotModal,
  runDeviceWake,
  runDeviceSleep,
  runDeviceReboot,
  runDeviceAirplane,
  togglePhoneTorch,
  volumePhone,
  enableWirelessAdb,
  copyAdbSerial,
  saveUsbWanConfig,
  restartNetworkAndMultilink,
  scheduleNetworkAutoSave,
  saveSecurityPolicy,
  saveWanInterfaceConfig,
  loadWanInterfaceConfig,
  toggleDhcpControls,
  toggleIpv6Master,
  saveWebhooksConfig,
  testWebhookProvider,
  loadPppoeConfig,
  togglePppoeClient,
  togglePppoeServer,
  toggleSmbService,
  copySmbPath,
  toggleDufsService,
  toggleTailscaleService,
  startTailscaleWebLogin,
  logoutTailscale,
  restartTailscale,
  applyTailscalePrefs,
  copyTsAuthUrl,
  switchDiagTool,
  toggleDiagExecution,
  toggleDiagRawLog,
  clearDiagResults,
  setPortScanMode,
  setDnsQueryType,
  confirmRebootRouter,
  showFactoryResetModal,
  closeFactoryResetModal,
  openFirmwareFlashModal,
  closeFirmwareFlashModal,
  openRamBootModal,
  closeRamBootModal,
  executeDirectRamBoot,
  startFirmwareFlash,
  executeFactoryReset,
  downloadBackupArchive,
  handleRestoreFileChosen,
  uploadRestoreArchive,
  clearDnsAndConntrack,
  checkLatestFirmwareUpdate,
  switchLogType,
  refreshLogViewer,
  downloadActiveLog,
  switchPackageTab,
  handlePackageSearchInput,
  updatePackageRepositories,
  copyUpi,
  closeSslHelpModal,
  onSearchClients,
  clearDhcpClientSearch,
  showToast,
  apiFetch,
  fetchDeviceInfo,
  fetchTailscale,
  fetchAdbLiveTelemetry,
  filterAdbSms,
  filterAdbContacts,
  showNotificationToast,
  saveSmbGuestSetting,
  powerCycleUsbHub,
  fetchWifiConfig,
  renderWifiClients,
  saveWifiSettings,
  toggleWifiMasterPower,
  togglePasswordVisibility
};
