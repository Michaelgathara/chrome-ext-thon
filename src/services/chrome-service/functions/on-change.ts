export const handleTabChange = async (
  activeInfo: chrome.tabs.TabActiveInfo,
  setter: (value: string[]) => void,
  runScan: () => void
) => {
  setter([]);
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      runScan();
    }
  });
};
