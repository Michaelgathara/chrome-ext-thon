import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light", // Light mode
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#ffffff",
      paper: "#f4f6f8",
    },
    text: {
      primary: "#000000",
      secondary: "#4f4f4f",
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark", // Dark mode
    primary: {
      main: "#bb86fc",
    },
    secondary: {
      main: "#03dac6",
    },
    background: {
      default: "#1f1f1f",
      paper: "#252835",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
  },
});

export { lightTheme, darkTheme };
