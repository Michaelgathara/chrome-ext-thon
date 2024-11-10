
export const checkDomainAndPrompt = async (): Promise<{
  currentDomain: string;
  domainList: string[];
  shouldScan: boolean;
  showPopup: boolean;
  currentUrl: string;
  isGoogle: boolean;
  isNews: boolean;
}> => {
  const newsSites = [
    'cnn.com',
    'foxnews.com',
    'nytimes.com',
    'washingtonpost.com',
    'reuters.com',
    'apnews.com',
    'nbcnews.com',
    'cbsnews.com',
    'abcnews.go.com',
    'bbc.com',
    'theguardian.com',
    'wsj.com',
    'bloomberg.com',
    'huffpost.com',
    'usatoday.com',
    'politico.com',
    'thehill.com',
    'npr.org',
    'breitbart.com',
    'dailymail.co.uk'
  ];

  return new Promise((resolve) => {
    console.log("Checking domain and prompting...");
    // Get the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentDomain = new URL(tabs[0].url || "").hostname; // Extract the hostname from the URL
      console.log("Current domain:", currentDomain);
      const currentUrl = tabs[0].url || "";

      const isNews = newsSites.some(site => currentDomain.includes(site));

      // Check if the URL is one of Chrome's internal pages
      if (
        currentUrl.startsWith("chrome://") ||
        currentUrl.startsWith("chrome-extension://")
      ) {
        console.log("Special Chrome URL detected, skipping scan");
        resolve({
          currentDomain,
          domainList: [],
          shouldScan: false,
          showPopup: false,
          currentUrl,
          isGoogle: true,
          isNews: false,
        });
        return;
      }

      // Retrieve the whitelist from Chrome's extension storage
      chrome.storage.sync.get("domainList", (result) => {
        const domainList: string[] = result.domainList || [];
        console.log("Domain list:", domainList);

        // Check if the current domain is in the whitelist
        if (domainList.includes(currentDomain)) {
          resolve({
            currentDomain,
            domainList,
            shouldScan: true,
            showPopup: false,
            currentUrl,
            isGoogle: false,
            isNews,
          });
        } else {
          resolve({
            currentDomain,
            domainList,
            shouldScan: false,
            showPopup: true,
            currentUrl,
            isGoogle: false,
            isNews,
          });
        }
      });
    });
  });
};
