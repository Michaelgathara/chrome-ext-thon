import React, { useEffect, useState, useRef } from "react";
import { extensionHandler } from "../libs";
import { SearchResult } from "./search-result";
import classes from "./side-panel.module.css";
import { ScanPopup } from "./scan-popup";
import ReactMarkdown from "react-markdown";
import { BIAS_TO_COLOR } from "../services/news-service/data";
import { runScan } from "./helpers";
import { useTheme } from "@mui/material/styles";

const SidePanel: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<string>("");
  const [domainList, setDomainList] = useState<string[]>([]);
  const [webpagesSummary, setWebpagesSummary] = useState<string>("");
  const [newsBias, setNewsBias] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const theme = useTheme();

  const handleScan = async () => {
    await runScan(
      abortControllerRef,
      setIsLoading,
      setShowPopup,
      setDomainList,
      setCurrentDomain,
      setWebpagesSummary,
      setNewsBias,
      setSearchResults
    );
  };

  useEffect(() => {
    extensionHandler(handleScan, setSearchResults);
  }, []);

  const SidePanelContent = () => {
    if (showPopup) {
      return null;
    }

    return (
      <>
        <div
          className={classes.searchResults}
          style={{
            backgroundColor:
              searchResults.length > 0 ? theme.palette.background.default : "",
          }}
        >
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
            <p className={classes.noRecommendations}>
              No recommendations found.
            </p>
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
            <p>
              {currentDomain} Source Bias:{" "}
              <span
                style={{
                  backgroundColor:
                    BIAS_TO_COLOR[
                      newsBias.toLowerCase() as keyof typeof BIAS_TO_COLOR
                    ],
                }}
              >
                {newsBias}
              </span>
            </p>
            {/* <p>Reliability Score: {newsBias.reliability}/10</p>
            {/* <p>Desc: {newsBias.description}</p> */}
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
          onConfirm={handleScan}
          setShowPopup={setShowPopup}
        />
      )}
    </div>
  );
};

export default SidePanel;
