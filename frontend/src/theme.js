import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f8f9fa",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },
    },

    typography: {
      fontFamily: "Inter, Roboto, sans-serif",
    },

    shape: {
      borderRadius: 12,
    },
  });