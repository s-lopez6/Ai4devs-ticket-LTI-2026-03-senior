import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { CandidateForm } from "../components/CandidateForm";
import {
  createCandidate,
  type ApiError,
  type Candidate,
  type CreateCandidateRequest,
} from "../services/candidateService";

// Tip items displayed in the side panel
const TIPS = [
  "Full name and email are the only required fields.",
  "Use the LinkedIn URL field to link the candidate social profile.",
  "Add structured notes to help the hiring team during review.",
  "Attach a CV using the file picker — it will be saved with the profile.",
] as const;

export default function AddCandidatePage(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | undefined>();
  const [serverFieldErrors, setServerFieldErrors] = React.useState<
    Record<string, string> | undefined
  >();
  const [success, setSuccess] = React.useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  const handleSubmit = async (values: CreateCandidateRequest) => {
    setServerError(undefined);
    setServerFieldErrors(undefined);
    setIsSubmitting(true);

    try {
      const created: Candidate = await createCandidate(values);
      setSuccess({
        open: true,
        message: `Candidate created: ${created.fullName} (${created.email})`,
      });
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.status === 400 && apiError.validationErrors) {
        setServerFieldErrors(apiError.validationErrors);
      } else if (apiError.status === 409) {
        setServerError("A candidate with this email already exists.");
      } else {
        setServerError(
          apiError.message || "Something went wrong. Please try again.",
        );
      }
      throw apiError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <Stack spacing={0.5} sx={{ mb: 4 }}>
        {/* Back navigation — uses history API; no Router dependency needed here */}
        <Button
          variant="text"
          size="small"
          onClick={() => window.history.back()}
          aria-label="Go back to previous page"
          sx={{
            alignSelf: "flex-start",
            px: 0,
            color: "text.secondary",
            minWidth: "auto",
            "&:hover": { bgcolor: "transparent", color: "text.primary" },
          }}
        >
          ← Back
        </Button>

        <Typography variant="h4" component="h1">
          Add Candidate
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Create a new candidate profile. Fields marked with * are required.
        </Typography>
      </Stack>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "3fr 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Main form card */}
        <Card variant="outlined">
          <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
            <CandidateForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              serverError={serverError}
              serverFieldErrors={serverFieldErrors}
            />
          </CardContent>
        </Card>

        {/* Tips side panel */}
        <Card
          variant="outlined"
          sx={{
            bgcolor: "rgba(167, 199, 231, 0.08)",
            borderColor: "rgba(167, 199, 231, 0.35)",
            // On small screens the tips panel stacks below the form
            display: { xs: "none", md: "block" },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}
            >
              Tips
            </Typography>

            <Stack spacing={1.5}>
              {TIPS.map((tip) => (
                <Box
                  key={tip}
                  sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "primary.light",
                      mt: "7px",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {tip}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* ── Success toast ─────────────────────────────────────────────────── */}
      <Snackbar
        open={success.open}
        autoHideDuration={5000}
        onClose={() => setSuccess((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess((prev) => ({ ...prev, open: false }))}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {success.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
