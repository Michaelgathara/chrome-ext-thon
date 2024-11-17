import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  FormControlLabel,
  Button,
  Switch,
  Box,
  Chip,
} from "@mui/material";
import classes from "./options.module.css";

export const Options: React.FC = () => {
  const [collectData, setCollectData] = useState<boolean>(false);
  const [newsSiteIntegration, setNewsSiteIntegration] =
    useState<boolean>(false);
  const [domainList, setDomainList] = useState<string[]>([]);

  useEffect(() => {
    const fetchStoredData = async () => {
      const { collectData } = await chrome.storage.sync.get("collectData");
      const { newsSiteIntegration } = await chrome.storage.sync.get(
        "newsSiteIntegration"
      );

      setCollectData(collectData || false);
      setNewsSiteIntegration(newsSiteIntegration || false);
    };

    fetchStoredData();
  }, []);

  useEffect(() => {
    chrome.storage.sync.get("domainList", (result) => {
      setDomainList(result.domainList || []);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set(
      { collectData, domainList, newsSiteIntegration },
      () => {
        window.alert("Settings saved");
      }
    );
  };

  const handleDeleteDomain = (domain: string) => {
    const updatedList = domainList.filter((d) => d !== domain);
    setDomainList(updatedList);
    chrome.storage.sync.set({ domainList: updatedList });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Extension Options
      </Typography>

      <div className={classes.options}>
        <FormControlLabel
          control={
            <Switch
              checked={collectData}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCollectData(e.target.checked)
              }
            />
          }
          label="Always collect data on page load"
        />

        <FormControlLabel
          control={
            <Switch
              checked={newsSiteIntegration}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewsSiteIntegration(e.target.checked)
              }
            />
          }
          label="Integrate with news sites"
        />
      </div>

      {!collectData && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Domain List</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {domainList.map((domain) => (
              <Chip
                key={domain}
                label={domain}
                onDelete={() => handleDeleteDomain(domain)}
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};
