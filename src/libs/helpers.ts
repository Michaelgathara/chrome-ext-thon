export const grabContent = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => {
              return new Promise<string>((resolve) => {
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                  const mainElement = document.querySelector('main');
                  resolve(mainElement ? mainElement.innerText : '');
                } else {
                  window.addEventListener('DOMContentLoaded', () => {
                    const mainElement = document.querySelector('main');
                    resolve(mainElement ? mainElement.innerText : '');
                  });
                }
              });
            },
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
