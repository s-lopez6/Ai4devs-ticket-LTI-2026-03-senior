import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

// Feature cards data — kept out of JSX for readability
const FEATURES = [
  {
    title: "Capture",
    color: "primary.main",
    description:
      "Register candidate profiles in seconds: key contact details, LinkedIn references, and free-form notes — all in one place.",
  },
  {
    title: "Track",
    color: "secondary.main",
    description:
      "Follow every candidate through your pipeline with a clear, real-time view of each stage and interview round.",
  },
  {
    title: "Hire",
    color: "success.main",
    description:
      "Move your best talent to offer faster with data-informed decisions and a streamlined approval workflow.",
  },
] as const;

export default function HomePage(): JSX.Element {
  return (
    <Container maxWidth="lg">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Stack
        spacing={3}
        sx={{
          mb: { xs: 7, md: 10 },
          pt: { xs: 2, md: 4 },
          textAlign: "center",
          alignItems: "center",
        }}
      >
        {/* Page title — satisfies getByRole('heading', { name: /talent tracker/i }) */}
        <Typography variant="h3" component="h1">
          Talent Tracker
        </Typography>

        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{ fontWeight: 400, maxWidth: 520 }}
        >
          A streamlined applicant tracking system that takes your best
          candidates from first contact to offer — without the overhead.
        </Typography>

        {/* Primary CTA — satisfies getByRole('link', { name: /add candidate/i }) */}
        <Button
          component={RouterLink}
          to="/candidates/new"
          variant="contained"
          size="large"
          sx={{ px: 5, py: 1.5 }}
        >
          Add Candidate
        </Button>
      </Stack>

      {/* ── Feature cards ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {FEATURES.map(({ title, color, description }) => (
          <Card key={title} variant="outlined" sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3.5 }}>
              {/* Coloured accent bar */}
              <Box
                aria-hidden="true"
                sx={{
                  width: 36,
                  height: 4,
                  bgcolor: color,
                  borderRadius: 2,
                  mb: 2,
                }}
              />

              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                {title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                {description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
