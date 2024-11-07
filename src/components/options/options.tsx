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

export const Options: React.FC = () => {
  const [collectData, setCollectData] = useState<boolean>(false);
  const [domainList, setDomainList] = useState<string[]>([]);

  useEffect(() => {
    const fetchStoredData = async () => {
      const result = await chrome.storage.sync.get("collectData");
      setCollectData(result.collectData || false);
    };

    fetchStoredData();
  }, []);

  useEffect(() => {
    chrome.storage.sync.get("domainList", (result) => {
      setDomainList(result.domainList || []);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ collectData, domainList }, () => {
      console.log("Settings saved");
    });
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
