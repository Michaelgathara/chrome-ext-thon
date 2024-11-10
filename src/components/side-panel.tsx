import React, { useEffect, useState, useRef } from "react";
import { checkDomainAndPrompt, grabContent } from "../libs";
import { SearchResult } from "./search-result";
import classes from "./side-panel.module.css";
import { ApiService } from "../services/api-service";
import { ScanPopup } from "./scan-popup";
import { aiService } from "../services/ai-service";
import { NewsBiasService } from "./news-sites/news-bias";
import ReactMarkdown from "react-markdown";
import { BiasRating } from "./news-sites/news-bias-list";

const SidePanel: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<string>("");
  const [domainList, setDomainList] = useState<string[]>([]);
  const [webpagesSummary, setWebpagesSummary] = useState<string>("");
  const [newsBias, setNewsBias] = useState<BiasRating | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const runScan = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    const { collectData } = await chrome.storage.sync.get("collectData");
    const { currentDomain, domainList, shouldScan, showPopup, isGoogle, isNews } =
      await checkDomainAndPrompt();

    if (!collectData) {
      setShowPopup(showPopup);
      setDomainList(domainList);
      setCurrentDomain(currentDomain);
    }

    if (!shouldScan || !collectData || isGoogle) {
      setWebpagesSummary("");
    }

    if (isNews) {
      const biasRating = NewsBiasService.getBiasRating(currentDomain);
      console.log("Found News Site with bias of: " + biasRating);
      setNewsBias(biasRating);
    } else {
      setNewsBias(null);
    }

    if ((shouldScan || collectData) && !isGoogle) {
      setIsLoading(true);
      const content = await grabContent();
      const query = await aiService.prompt(content.slice(0, 2000));

      try {
        const results = await ApiService.search(query!, signal);
        setSearchResults(results.searchResults);
        console.log(results.searchResults);
        const compiledDescription = results.searchResults.reduce(
          (acc: string, result: any) => {
            return acc + result.description + "\n";
          },
          ""
        );

        const summary = await aiService.summarizeContent(compiledDescription);

        setWebpagesSummary(summary);
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
      <>
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
                favicon={result.favicon}
                highlighted={index < 2}
              />
            ))
          ) : (
            <p>No recommendations found.</p>
          )}
        </div>
        {!isLoading && webpagesSummary && searchResults.length > 0 && (
          <div className={classes.summary}>
            <ReactMarkdown>{webpagesSummary}</ReactMarkdown>
          </div>
        )}
      </>
    );
  };

  const SidePanelHeader = ({ className }: { className: string }) => {
    return !isLoading && searchResults?.length > 0 ? (
      <div className={className}>
        <h1>Recommended Pages</h1>
        {newsBias && (
          <div className={classes.newsBias}>
            <p>{newsBias.name} Source Bias: {newsBias.bias}</p>
            <p>Reliability Score: {newsBias.reliability}/10</p>
          </div>
        )}
        <p className={classes.recommendedPages}>
          Gemini has recommended these pages for you.
        </p>
      </div>
    ) : (
      <div className={className}>
        <div className={classes.geminiHeader}>
          <h1>Gemini Search</h1>
          <img
            className={classes.geminiIcon}
            src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png"
            alt="gemini-summarize"
          />
        </div>
        <p className={classes.recommendedPages}>
          {isLoading
            ? "Currently loading recommendations."
            : "Visit a website or allow access to site to get started."}
        </p>
      </div>
    );
  };

  return (
    <div className={classes.sidePanel}>
      <SidePanelHeader className={classes.header} />
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
