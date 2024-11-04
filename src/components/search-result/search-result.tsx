import React from "react";
import classes from "./search-result.module.css";

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
  console.log(url, title, description);
  return (
    <div className={`${classes.searchResult} ${highlighted ? classes.highlighted : ""}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={url}>{url}</a>
    </div>
  );
};
