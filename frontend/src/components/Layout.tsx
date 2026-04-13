import React from "react";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type LayoutProps = {
  children: React.ReactNode;
};

/**
 * App shell: sticky header with brand mark, main content area, and footer.
 * The AppBar brand text is a styled span (not a heading) so each page can
 * own its own <h1> without conflicting heading hierarchy.
 */
export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Skip navigation link for keyboard / screen-reader users */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <AppBar position="sticky" component="header" role="banner">
        <Toolbar sx={{ gap: 1.5 }}>
          {/* Brand mark — navigates to home */}
          <Box
            component={RouterLink}
            to="/"
            aria-label="Talent Tracker — go to home"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              color: "text.primary",
              "&:focus-visible": {
                outline: "3px solid",
                outlineColor: "primary.light",
                outlineOffset: "4px",
                borderRadius: 1,
              },
            }}
          >
            {/* Logo tile */}
            <Box
              aria-hidden="true"
              sx={{
                width: 34,
                height: 34,
                bgcolor: "primary.main",
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  lineHeight: 1,
                  letterSpacing: "0.05em",
                }}
              >
                TT
              </Typography>
            </Box>

            {/* Brand name — intentionally a span, not a heading */}
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: "1.0625rem",
                color: "primary.main",
                letterSpacing: "-0.01em",
              }}
            >
              Talent Tracker
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <Box
        id="main-content"
        component="main"
        sx={{ flex: 1, py: { xs: 4, md: 6 } }}
      >
        {children}
      </Box>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{
          py: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Talent Tracker — ATS Platform
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
