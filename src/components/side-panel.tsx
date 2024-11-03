import React, { useEffect, useState } from "react";
import { checkDomainAndPrompt, grabContent } from "../libs";
import { testData } from "../data";
import { SearchResult } from "./search-result";
import classes from "./side-panel.module.css";
import { ApiService } from "../services/api-service";
import { ScanPopup } from "./scan-popup";

const SidePanel: React.FC = () => {
  const [currentURL, setCurrentURL] = useState<string>();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldScan, setShouldScan] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<string>("");
  const [domainList, setDomainList] = useState<string[]>([]);

  const handleGrabContent = async () => {
    const content = await grabContent();
    console.log(content);
    return content;
  };

  const handleConfirm = () => {
    setShouldScan(true);
  };

  const handleCancel = () => {
    setShouldScan(false);
  };

  const runScan = async (url: string) => {
    setCurrentURL(url);
    const { currentDomain, domainList, shouldScan, showPopup } =
      await checkDomainAndPrompt();

    setShouldScan(shouldScan);
    setShowPopup(showPopup);
    setDomainList(domainList);
    setCurrentDomain(currentDomain);

    if (shouldScan) {
      setIsLoading(true);
      console.log("Scanning the page...");
      const pageContent = await handleGrabContent();
      ApiService.search(pageContent)
        .then((data) => {
          console.log("Raw data: ", data);
          let parsedData;

          // Parse the data
          if (typeof data === "string") {
            try {
              parsedData = JSON.parse(data);
            } catch (error) {
              console.error("Error parsing data:", error);
              parsedData = null;
            }
          } else {
            parsedData = data;
          }

          console.log("Parsed data: ", parsedData);

          let results = [];

          if (Array.isArray(parsedData)) {
            results = parsedData;
          } else if (parsedData && Array.isArray(parsedData.searchResults)) {
            results = parsedData.searchResults;
          } else {
            console.warn("No valid search results found in the parsed data.");
          }

          setSearchResults(results);
        })
        .catch((error) => {
          console.error("Error processing search results:", error);
          setSearchResults([]);
        })
        .finally(() => {
          setIsLoading(false);
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
  }, [shouldScan]);

  return (
    <div className={classes.sidePanel}>
      <h1>Recommended Pages</h1>
      <p>These recommended sites were found based on your current page.</p>
      <hr className={classes.separator} />
      <div className={classes.searchResults}>
        {isLoading ? (
          <p>Loading recommendations...</p>
        ) : searchResults?.length > 0 ? (
          searchResults.map((result, index) => (
            <SearchResult
              key={index}
              url={result.url}
              title={result.title}
              description={result.description}
            />
          ))
        ) : (
          <p>No recommendations found.</p>
        )}
      </div>
      {showPopup && (
        <ScanPopup
          currentDomain={currentDomain}
          domainList={domainList}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          setShowPopup={setShowPopup}
          setShouldScan={setShouldScan}
        />
      )}
    </div>
  );
};

export default SidePanel;
