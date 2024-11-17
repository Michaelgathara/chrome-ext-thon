export const handleTabOpen = async (runScan: () => void) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab?.url) {
      runScan();
    }
  });
};
