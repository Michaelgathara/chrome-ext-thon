import { chromeService } from "../../services/chrome-service";
export const extensionHandler = (
  runScan: () => void,
  setter: (value: string[]) => void
) => {
  chromeService.handleSideBarOpen(runScan);

  const tabUpdateListener = async (tabId: number) => {
    chromeService.handleTabUpdate(tabId, setter, runScan);
  };

  const tabChangeListener = async (activeInfo: chrome.tabs.TabActiveInfo) => {
    chromeService.handleTabChange(activeInfo, setter, runScan);
  };

  chrome.tabs.onUpdated.addListener(tabUpdateListener);
  chrome.tabs.onActivated.addListener(tabChangeListener);

  return () => {
    chrome.tabs.onUpdated.removeListener(tabUpdateListener);
    chrome.tabs.onActivated.removeListener(tabChangeListener);
  };
};
