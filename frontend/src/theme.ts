import { createTheme } from "@mui/material/styles";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Source of truth: README.md "Branding & UI" section
// Primary  : Pastel blue     #A7C7E7
// Secondary: Pastel lavender #CDB4DB
// Background: #FAFAFF  |  Surface: #FFFFFF
// Text: #1F2937 (primary) / #6B7280 (muted)
// ─────────────────────────────────────────────────────────────────────────────

const theme = createTheme({
  palette: {
    primary: {
      main: "#A7C7E7",
      light: "#C8DCF0",
      dark: "#7AAFD3",
      contrastText: "#1F2937",
    },
    secondary: {
      main: "#CDB4DB",
      light: "#DECAE8",
      dark: "#B09CC8",
      contrastText: "#1F2937",
    },
    success: {
      main: "#B7E4C7",
      light: "#CEEEDD",
      dark: "#8ECFAC",
      contrastText: "#1F2937",
    },
    error: {
      main: "#FFADAD",
      light: "#FFCCCC",
      dark: "#FF8080",
      contrastText: "#1F2937",
    },
    warning: {
      main: "#FFF3B0",
      light: "#FFF8D0",
      dark: "#FFE870",
      contrastText: "#1F2937",
    },
    background: {
      default: "#FAFAFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
    divider: "#E5E7EB",
  },

  // ─── Typography ────────────────────────────────────────────────────────────
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.025em" },
    h2: { fontWeight: 700, letterSpacing: "-0.025em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 600, letterSpacing: "-0.015em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },

  // ─── Shape ─────────────────────────────────────────────────────────────────
  shape: { borderRadius: 8 },

  // ─── Component overrides ───────────────────────────────────────────────────
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: 0,
          padding: "10px 20px",
          transition: "all 0.2s ease",
          "&:focus-visible": {
            outline: "3px solid #7AAFD3",
            outlineOffset: "2px",
          },
          "&.MuiButton-containedPrimary": {
            boxShadow: "0 1px 3px rgba(122, 175, 211, 0.35)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(122, 175, 211, 0.5)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 1px 3px rgba(122, 175, 211, 0.35)",
            },
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            transition: "box-shadow 0.15s ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#A7C7E7",
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 3px rgba(167, 199, 231, 0.35)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#7AAFD3",
            },
            "&.Mui-error.Mui-focused": {
              boxShadow: "0 0 0 3px rgba(255, 173, 173, 0.35)",
            },
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1F2937",
          borderBottom: "1px solid #E5E7EB",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
});

export default theme;
