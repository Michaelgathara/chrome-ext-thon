export const grabContent = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => document.body.innerText,
          },
          (result) => {
            resolve(result[0].result);
          }
        );
      } else {
        resolve('');
      }
    });
  });
};
