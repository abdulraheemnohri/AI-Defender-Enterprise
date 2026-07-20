# Material UI Theme Configuration
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196F3", // Blue
    },
    secondary: {
      main: "#9C27B0", // Purple
    },
    success: {
      main: "#4CAF50", // Green
    },
    warning: {
      main: "#FF9800", // Orange
    },
    error: {
      main: "#F44336", // Red
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#E0E0E0",
      secondary: "#B0B0B0",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontSize: "2rem", fontWeight: 500 },
    h2: { fontSize: "1.75rem", fontWeight: 500 },
    h3: { fontSize: "1.5rem", fontWeight: 500 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#1E1E1E",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
      },
    },
  },
});