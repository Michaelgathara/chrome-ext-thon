import React, { useState } from "react";
import {
  Container,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Switch,
  Box,
} from "@mui/material";
import classes from "./options.module.css";

export const Options: React.FC = () => {
  const [collectData, setCollectData] = useState<boolean>(false);
  const [domainList, setDomainList] = useState<string>("");
  const [isWhitelist, setIsWhitelist] = useState<boolean>(true);

  const handleSave = () => {
    chrome.storage.sync.set({ collectData, domainList, isWhitelist }, () => {
      console.log("Settings saved");
    });
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
            onChange={(e) => setCollectData(e.target.checked)}
          />
        }
        label="Always collect data on page load"
      />

      {!collectData && (
        <Box sx={{ mt: 2 }}>
          <Typography className={classes.domainListLabel} variant="h6">
            Domain List
          </Typography>
          <textarea
            value={domainList}
            onChange={(e) => setDomainList(e.target.value)}
            placeholder="Enter one domain per line"
            rows={4}
            style={{
              width: "100%",
              color: "white",
              backgroundColor: "transparent",
              border: "1px solid white",
              borderRadius: "4px",
              padding: "8px",
              outline: "none",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isWhitelist}
                onChange={(e) => setIsWhitelist(e.target.checked)}
              />
            }
            label="Whitelist Mode (uncheck for Blacklist Mode)"
          />
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSave}
      >
        Save
      </Button>
    </Container>
  );
};
