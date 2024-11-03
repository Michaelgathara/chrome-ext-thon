import React from "react";

export const ScanPopup = ({
  currentDomain,
  onConfirm,
  onCancel,
  domainList,
  setShowPopup,
  setShouldScan,
}: {
  currentDomain: string;
  onConfirm: () => void;
  onCancel: () => void;
  setShowPopup: (showPopup: boolean) => void;
  setShouldScan: (shouldScan: boolean) => void;
  domainList: string[];
}) => {
  const handleYes = () => {
    console.log("adding domain to list", currentDomain);
    chrome.storage.sync.set(
      { domainList: [...domainList, currentDomain] },
      () => {
        onConfirm();
        setShowPopup(false);
        setShouldScan(true);
      }
    );
  };

  const handleNo = () => {
    onCancel();
    setShowPopup(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        padding: "10px",
        backgroundColor: "var(--background-color)",
        borderTop: "1px solid #ccc",
        boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
        zIndex: "10000",
      }}
    >
      <p style={{ margin: 0 }}>
        Would you like to scan this page for the domain{" "}
        <strong>{currentDomain}</strong>?
      </p>
      <div
        style={{
          marginTop: "5px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button onClick={handleYes} style={{ marginRight: "5px" }}>
          Yes
        </button>
        <button onClick={handleNo}>No</button>
      </div>
    </div>
  );
};
