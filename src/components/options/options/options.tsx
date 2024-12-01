import React, { useEffect } from "react";
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
import { useOptionsContext } from "../provider/provider";
import { OptionsData } from "./data";

export const Options: React.FC = () => {
  const { state, setState } = useOptionsContext();

  // Dynamically set Options state on load
  useEffect(() => {
    const fetchStoredData = async () => {
      const storedData = await chrome.storage.sync.get(
        OptionsData.map((option) => option.id)
      );

      const newState = { ...state };
      OptionsData.forEach((option) => {
        const value = storedData[option.id];
        newState[option.id as keyof typeof newState] = value;
      });
      setState(newState);
    };

    fetchStoredData();
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ ...state }, () => {
      window.alert("Settings saved");
    });
  };

  const handleDeleteDomain = (domain: string) => {
    const updatedList = state.domainList.filter((d) => d !== domain);
    setState({ ...state, domainList: updatedList });
    chrome.storage.sync.set({ domainList: updatedList });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Extension Options
      </Typography>

      <div className={classes.options}>
        {OptionsData.filter((option) => option.type === "boolean").map(
          (option) => (
            <>
              <FormControlLabel
                key={option.id}
                control={
                  <Switch
                    checked={state[option.id as keyof typeof state] as boolean}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setState({ ...state, [option.id]: e.target.checked })
                    }
                  />
                }
                label={option.label}
              />
              <Typography variant="body2" className={classes.description}>
                {option.description}
              </Typography>
            </>
          )
        )}
      </div>

      {!state.collectData && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Domain List</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {state.domainList &&
              state.domainList.map((domain) => (
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
