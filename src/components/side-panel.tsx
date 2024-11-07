import React, { useEffect, useState, useRef } from "react";
import { checkDomainAndPrompt, grabContent } from "../libs";
import { SearchResult } from "./search-result";
import classes from "./side-panel.module.css";
import { ApiService } from "../services/api-service";
import { ScanPopup } from "./scan-popup";
import { aiService } from "../services/ai-service";

const SidePanel: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<string>("");
  const [domainList, setDomainList] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const runScan = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    const { collectData } = await chrome.storage.sync.get("collectData");
    const { currentDomain, domainList, shouldScan, showPopup } =
      await checkDomainAndPrompt();

    if (!collectData) {
      setShowPopup(showPopup);
      setDomainList(domainList);
      setCurrentDomain(currentDomain);
    }

    if (shouldScan || collectData) {
      setIsLoading(true);
      const content = await grabContent();
      const query = await aiService.prompt(content.slice(0, 2000));

      try {
        const results = await ApiService.search(query!, signal);
        setSearchResults(results.searchResults);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          // Request was aborted, no need to log
        } else {
          console.error("Search request failed", error);
          setIsLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    // Run once when the sidebar opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab?.url) {
        runScan();
      }
    });

    // Listen for tab changes
    const handleTabChange = async (activeInfo: chrome.tabs.TabActiveInfo) => {
      setSearchResults([]);

      chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
          runScan();
        }
      });
    };

    const handleTabUpdate = async (tabId: number) => {
      setSearchResults([]);

      chrome.tabs.get(tabId, (tab) => {
        if (tab.url) {
          runScan();
        }
      });
    };

    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    chrome.tabs.onActivated.addListener(handleTabChange);

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
      chrome.tabs.onActivated.removeListener(handleTabChange);
    };
  }, []);

  const SidePanelContent = () => {
    if (showPopup) {
      return null;
    }

    return (
      <div className={classes.searchResults}>
        {isLoading ? (
          <div className={classes.loaderContainer}>
            <p>Loading recommendations...</p>
            <div className={classes.loader}></div>
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <SearchResult
              key={index}
              url={result.url}
              title={result.title}
              description={result.description}
              highlighted={index < 2}
            />
          ))
        ) : (
          <p>No recommendations found.</p>
        )}
      </div>
    );
  };

  const SidePanelHeader = () => {
    return searchResults?.length > 0 ? (
      <>
        <h1>Recommended Pages</h1>
        <p>These recommended sites were found based on your current page.</p>
      </>
    ) : (
      <>
        <h1>Gemini Search</h1>
        <p>Visit a website or allow access to site to get started.</p>
      </>
    );
  };

  return (
    <div className={classes.sidePanel}>
      <SidePanelHeader />
      <hr className={classes.separator} />
      <SidePanelContent />
      {showPopup && (
        <ScanPopup
          currentDomain={currentDomain}
          domainList={domainList}
          onConfirm={runScan}
          setShowPopup={setShowPopup}
        />
      )}
    </div>
  );
};

export default SidePanel;
