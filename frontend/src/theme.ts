import { createTheme } from "@mui/material/styles";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Primary  : Indigo  – trust, reliability, professionalism
// Secondary: Cyan    – modern tech accent
// Semantics: standard success / error / warning tokens
// ─────────────────────────────────────────────────────────────────────────────

const theme = createTheme({
  palette: {
    primary: {
      main: "#4338CA",
      light: "#818CF8",
      dark: "#3730A3",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0891B2",
      light: "#67E8F9",
      dark: "#0E7490",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#16A34A",
      light: "#4ADE80",
      dark: "#15803D",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#DC2626",
      light: "#F87171",
      dark: "#B91C1C",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#D97706",
      light: "#FCD34D",
      dark: "#B45309",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
      disabled: "#94A3B8",
    },
    divider: "#E2E8F0",
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
            outline: "3px solid #818CF8",
            outlineOffset: "2px",
          },
          "&.MuiButton-containedPrimary": {
            boxShadow: "0 1px 3px rgba(67, 56, 202, 0.25)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(67, 56, 202, 0.35)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 1px 3px rgba(67, 56, 202, 0.25)",
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
              borderColor: "#818CF8",
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 3px rgba(67, 56, 202, 0.12)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4338CA",
            },
            "&.Mui-error.Mui-focused": {
              boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.12)",
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
          color: "#0F172A",
          borderBottom: "1px solid #E2E8F0",
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
