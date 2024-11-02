export const checkDomainAndPrompt = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log("Checking domain and prompting...");
    // Get the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentDomain = new URL(tabs[0].url || "").hostname; // Extract the hostname from the URL
      console.log("Current domain:", currentDomain);

      // Retrieve the whitelist from Chrome's extension storage
      chrome.storage.sync.get("domainList", (result) => {
        const domainList: string[] = result.domainList || [];
        console.log("Domain list:", domainList);

        // Check if the current domain is in the whitelist
        if (domainList.includes(currentDomain)) {
          console.log("Domain is in the whitelist, skipping scan");
          resolve(true);
        } else {
          // Create a simple popup asking if the page should be scanned
          console.log("Domain is not in the whitelist, prompting user");
          const popup = document.createElement("div");
          popup.style.position = "fixed";
          popup.style.bottom = "0";
          popup.style.left = "0";
          popup.style.right = "0";
          popup.style.padding = "10px";
          popup.style.backgroundColor = "var(--background-color)";
          popup.style.borderTop = "1px solid #ccc";
          popup.style.boxShadow = "0 -2px 4px rgba(0, 0, 0, 0.1)";
          popup.style.zIndex = "10000";

          popup.innerHTML = `
  <p style="margin: 0;">Would you like to scan this page for the domain <strong>${currentDomain}</strong>?</p>
  <div style="margin-top: 5px; display: flex; justify-content: flex-end;">
    <button id="scan-yes" style="margin-right: 5px;">Yes</button>
    <button id="scan-no">No</button>
  </div>
`;

          document.body.appendChild(popup);

          const yesButton = document.getElementById(
            "scan-yes"
          ) as HTMLButtonElement;
          const noButton = document.getElementById(
            "scan-no"
          ) as HTMLButtonElement;

          yesButton.onclick = () => {
            chrome.storage.sync.set(
              { domainList: [...domainList, currentDomain] },
              () => {
                popup.remove();
                resolve(true);
              }
            );
          };

          noButton.onclick = () => {
            popup.remove();
            resolve(false);
          };
        }
      });
    });
  });
};
