import React, { useEffect, useState } from "react";
import { checkDomainAndPrompt, grabContent } from "../libs";
import { testData } from "../data";
import { SearchResult } from "./search-result";
import classes from "./side-panel.module.css";
import { ApiService } from "../services/api-service";

const SidePanel: React.FC = () => {
  const [currentURL, setCurrentURL] = useState<string>();

  const handleGrabContent = async () => {
    const content = await grabContent();
    console.log(content);
    return content;
  };

  const runScan = async (url: string) => {
    setCurrentURL(url);
    const shouldScan = await checkDomainAndPrompt();
    if (shouldScan) {
      console.log("Scanning the page...");
      const pageContent = await handleGrabContent();
      ApiService.search(pageContent).then((data) => {
        console.log(data);
      });
    }
  };

  useEffect(() => {
    // Run once when the sidebar opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab?.url) {
        runScan(currentTab.url);
      }
    });

    // Listen for tab changes
    const handleTabChange = async (activeInfo: chrome.tabs.TabActiveInfo) => {
      console.log("running scan on tab change");
      chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
          runScan(tab.url);
        }
      });
    };

    // Listen for page loads on any website
    const handlePageLoad = (
      details: chrome.webNavigation.WebNavigationFramedCallbackDetails
    ) => {
      console.log("running scan on page load");
      if (details.frameId === 0) {
        chrome.tabs.get(details.tabId, (tab) => {
          if (tab.url) {
            runScan(tab.url);
          }
        });
      }
    };

    chrome.webNavigation.onCompleted.addListener(handlePageLoad);
    chrome.tabs.onActivated.addListener(handleTabChange);

    return () => {
      chrome.webNavigation.onCompleted.removeListener(handlePageLoad);
      chrome.tabs.onActivated.removeListener(handleTabChange);
    };
  }, []);

  return (
    <div className={classes.sidePanel}>
      <h1>Recommended Pages</h1>
      <p>These recommended sites were found based on your current page.</p>
      <hr className={classes.separator} />
      <div className={classes.searchResults}>
        {testData.map((item) => (
          <SearchResult
            key={item.url}
            url={item.url}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default SidePanel;
