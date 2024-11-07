import React, { useState } from "react";
import classes from "./search-result.module.css";
import { Tooltip } from "@mui/material";
import { aiService } from "../../services/ai-service";
import { ApiService } from "../../services/api-service";

export type SearchResultProps = {
  url: string;
  title: string;
  description: string;
  highlighted?: boolean;
};

export const SearchResult = ({
  url,
  title,
  description,
  highlighted = false,
}: SearchResultProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);

    const pageContent = await ApiService.summarize(url);
    const summary = await aiService.summarizeContent(pageContent.content);

    setSummary(summary);
    setLoading(false);
  };

  return (
    <div
      className={`${classes.searchResult} ${
        highlighted ? classes.highlighted : ""
      }`}
    >
      <div className={classes.searchResultHeader}>
        <h3>{title}</h3>
        {loading ? (
          <div className={classes.loader} />
        ) : (
          <Tooltip
            title="Summarize with Gemini"
            placement="left"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "var(--google-blue)",
                  "& .MuiTooltip-arrow": {
                    color: "white",
                  },
                },
              },
            }}
          >
            <img
              onClick={handleSummarize}
              className={classes.geminiIcon}
              src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png"
              alt="gemini-summarize"
            />
          </Tooltip>
        )}
      </div>
      <p>{description}</p>
      <a target="_blank" rel="noreferrer" href={url}>
        {url}
      </a>
      {summary && (
        <>
          <hr className={classes.summarySeparator} />
          {summary.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </>
      )}
    </div>
  );
};
