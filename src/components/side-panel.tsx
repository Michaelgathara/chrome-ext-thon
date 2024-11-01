import React, { useEffect, useState } from "react";
import { checkDomainAndPrompt, grabContent } from "../libs";
import { testData } from "../data";
import { SearchResult } from "./search-result";
import classes from "./side-panel.module.css";
import { ApiService } from "../services/api-service";

const SidePanel: React.FC = () => {
  const handleGrabContent = async () => {
    const content = await grabContent();
    console.log(content);
    return content;
  };

  useEffect(() => {
    const getPageContent = async () => {
      console.log("Checking domain and prompting");
      checkDomainAndPrompt().then(async (shouldScan) => {
        if (shouldScan) {
          console.log("Scanning the page...");
          const pageContent = await handleGrabContent();
          ApiService.search(pageContent).then((data) => {
            console.log(data);
          });
        }
      });
    };
    getPageContent();
  }, []);

  return (
    <div className={classes.sidePanel}>
      <h1>Recommended Pages</h1>
      <p>These recommended sites were found based on your current page.</p>
      <hr className={classes.separator} />

      <div className={classes.searchResults}>
        {testData.map((item) => (
          <SearchResult
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
