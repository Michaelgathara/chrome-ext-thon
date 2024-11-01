export const grabContent = () => {
  console.log("grabContent");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab.id) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => document.body.innerText,
        },
        (result) => {
          console.log("Page content:", result[0].result);
        }
      );
    }
  });
};
