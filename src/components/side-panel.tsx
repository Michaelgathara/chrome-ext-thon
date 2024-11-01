import React, { useState } from "react";
import { grabContent } from "../libs";

const SidePanel: React.FC = () => {
  const [pageContent, setPageContent] = useState<string>("");

  const handleGrabContent = async () => {
    const content = await grabContent();
    setPageContent(content);
  };

  return (
    <div>
      <h1>Side Panel</h1>
      <p>This is a side panel displayed using React.</p>
      <button onClick={handleGrabContent}>Grab Content</button>
      <div>{pageContent}</div>
    </div>
  );
};

export default SidePanel;
