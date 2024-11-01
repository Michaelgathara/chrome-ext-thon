import React, { useState } from "react";
import { grabContent } from "../libs";
import { testData } from "../data";
import { SearchResult } from "./search-result";
import classes from "./side-panel.module.css";

const SidePanel: React.FC = () => {
  const [pageContent, setPageContent] = useState<string>("");

  const handleGrabContent = async () => {
    const content = await grabContent();
    setPageContent(content);
  };
  console.log(testData);
  console.log(SearchResult);

  return (
    <div className={classes.sidePanel}>
      <h1>Recommended Pages</h1>
      <p>These recommended sites were found based on your current page.</p>
      <hr className={classes.separator} />
      {/* <button onClick={handleGrabContent}>Grab Content</button>
      <div>{pageContent}</div> */}

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
