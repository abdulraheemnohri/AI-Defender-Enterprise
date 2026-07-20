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
      default: "#0B1020",
      paper: "#131B31",
    },
    text: {
      primary: "#E7ECF7",
      secondary: "#9CA8C3",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          backgroundColor: "rgba(19, 27, 49, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.22)",
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "999px",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});
