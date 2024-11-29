export const handleTabUpdate = async (
  tabId: number,
  setter: (value: string[]) => void,
  scan: () => void
) => {
  setter([]);
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url) {
      scan();
    }
  });
};
