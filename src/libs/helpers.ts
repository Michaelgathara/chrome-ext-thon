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
                if (
                  document.readyState === "complete" ||
                  document.readyState === "interactive"
                ) {
                  const mainElement = document.querySelector("main");
                  resolve(mainElement ? mainElement.innerText : "");
                } else {
                  window.addEventListener("DOMContentLoaded", () => {
                    const mainElement = document.querySelector("main");
                    resolve(mainElement ? mainElement.innerText : "");
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
        resolve("");
      }
    });
  });
};

export function stripNonEnglishCharacters(input: string): string {
  // Testing to see if non-english text inside the text is messing with our output
  // This gives more successes but not always guranteed
  return input.replace(/[^a-zA-Z\s]/g, "");
}

export const sliceContent = (content: string, sliceMiddle: boolean = false) => {
  if (sliceMiddle) {
    return content.slice(
      Math.max(0, Math.floor(content.length / 2) - 2000),
      Math.min(content.length, Math.floor(content.length / 2) + 2000)
    );
  }

  return content.slice(0, 2000);
};

type SearchResult = {
  description: string;
};

export const compileContent = (content: SearchResult[]) => {
  return content.reduce((acc, curr) => {
    return acc + curr.description + "\n";
  }, "");
};
