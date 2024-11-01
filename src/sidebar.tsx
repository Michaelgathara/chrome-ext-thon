import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { grabContent } from "./libs";

const Sidebar = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleSidebar} style={{ position: "fixed", right: "10px", top: "10px", zIndex: 1001 }}>
        {isOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>
      {isOpen && (
        <div style={{ position: "fixed", right: 0, top: 0, width: "300px", height: "100%", backgroundColor: "#fff", boxShadow: "-2px 0 5px rgba(0,0,0,0.5)", zIndex: 1000 }}>
          <ul style={{ minWidth: "100%" }}>
            <li>Current URL: {currentURL}</li>
            <li>Current Time: {new Date().toLocaleTimeString()}</li>
          </ul>
          <button onClick={() => setCount(count + 1)} style={{ marginRight: "5px" }}>
            count up
          </button>
          <button onClick={changeBackground}>change background</button>
          <button onClick={grabContent}>grab content</button>
        </div>
      )}
    </>
  );
};

export default Sidebar; 