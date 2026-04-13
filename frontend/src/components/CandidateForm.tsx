import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { FilePicker } from "./FilePicker";
import type { CreateCandidateRequest } from "../services/candidateService";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CandidateFormValues = CreateCandidateRequest;

export type CandidateFormProps = {
  onSubmit: (values: CandidateFormValues) => Promise<void>;
  isSubmitting: boolean;
  serverFieldErrors?: Record<string, string>;
  serverError?: string;
};

type FieldName = keyof CandidateFormValues;
type FormErrors = Partial<Record<FieldName, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX = {
  fullName: 200,
  email: 254,
  phone: 32,
  location: 120,
  linkedInUrl: 500,
  notes: 2000,
} as const;

const DEFAULT_VALUES: CandidateFormValues = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedInUrl: "",
  notes: "",
};

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidEmail(value: string): boolean {
  // Intentionally simple (frontend hint); backend is authoritative.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(values: CandidateFormValues): FormErrors {
  const errors: FormErrors = {};

  const fullName = values.fullName.trim();
  const email = values.email.trim();

  if (fullName.length === 0) errors.fullName = "Full name is required.";
  else if (fullName.length < 2)
    errors.fullName = "Full name must be at least 2 characters.";
  else if (fullName.length > MAX.fullName)
    errors.fullName = `Full name must be at most ${MAX.fullName} characters.`;

  if (email.length === 0) errors.email = "Email is required.";
  else if (email.length > MAX.email)
    errors.email = `Email must be at most ${MAX.email} characters.`;
  else if (!isValidEmail(email)) errors.email = "Email format is invalid.";

  const phone = values.phone?.trim() ?? "";
  if (phone.length > MAX.phone)
    errors.phone = `Phone must be at most ${MAX.phone} characters.`;

  const location = values.location?.trim() ?? "";
  if (location.length > MAX.location)
    errors.location = `Location must be at most ${MAX.location} characters.`;

  const linkedInUrl = values.linkedInUrl?.trim() ?? "";
  if (linkedInUrl.length > MAX.linkedInUrl) {
    errors.linkedInUrl = `LinkedIn URL must be at most ${MAX.linkedInUrl} characters.`;
  } else if (linkedInUrl.length > 0) {
    try {
      // eslint-disable-next-line no-new
      new URL(linkedInUrl);
    } catch {
      errors.linkedInUrl = "LinkedIn URL must be a valid URL.";
    }
  }

  const notes = values.notes ?? "";
  if (notes.length > MAX.notes)
    errors.notes = `Notes must be at most ${MAX.notes} characters.`;

  return errors;
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      component="p"
      sx={{
        color: "text.secondary",
        fontWeight: 600,
        letterSpacing: "0.08em",
        lineHeight: 1,
        mb: 0,
      }}
    >
      {children}
    </Typography>
  );
}

// ─── CandidateForm ────────────────────────────────────────────────────────────

export function CandidateForm(props: CandidateFormProps): JSX.Element {
  const [values, setValues] =
    React.useState<CandidateFormValues>(DEFAULT_VALUES);
  const [touched, setTouched] = React.useState<
    Partial<Record<FieldName, boolean>>
  >({});
  const [submitAttempted, setSubmitAttempted] = React.useState(false);

  const clientErrors = validate(values);
  const errors: FormErrors = {
    ...(props.serverFieldErrors ?? {}),
    ...clientErrors,
  };

  const showError = (field: FieldName): boolean =>
    Boolean(errors[field]) && (Boolean(touched[field]) || submitAttempted);

  const handleChange =
    (field: FieldName) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleBlur = (field: FieldName) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);

    const currentErrors = validate(values);
    if (Object.keys(currentErrors).length > 0) return;

    try {
      await props.onSubmit({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || undefined,
        location: values.location?.trim() || undefined,
        linkedInUrl: values.linkedInUrl?.trim() || undefined,
        notes: values.notes || undefined,
      });

      setValues(DEFAULT_VALUES);
      setTouched({});
      setSubmitAttempted(false);
    } catch {
      // Keep current form state so server errors are visible.
    }
  };

  const maxLength = (n: number) => ({ htmlInput: { maxLength: n } });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Add candidate form"
    >
      <Stack spacing={4}>
        {/* ── Server-level error banner ──────────────────────────────────── */}
        {props.serverError ? (
          <Alert severity="error" role="alert">
            {props.serverError}
          </Alert>
        ) : null}

        {/* ── Section: Contact details ───────────────────────────────────── */}
        <Stack spacing={2.5}>
          <Box>
            <SectionLabel>Contact details</SectionLabel>
            <Divider sx={{ mt: 1 }} />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.5,
            }}
          >
            <TextField
              required
              label="Full name"
              value={values.fullName}
              onChange={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
              error={showError("fullName")}
              helperText={showError("fullName") ? errors.fullName : " "}
              slotProps={maxLength(MAX.fullName)}
              autoComplete="name"
              fullWidth
            />

            <TextField
              required
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={showError("email")}
              helperText={showError("email") ? errors.email : " "}
              slotProps={maxLength(MAX.email)}
              autoComplete="email"
              fullWidth
            />

            <TextField
              label="Phone"
              value={values.phone ?? ""}
              onChange={handleChange("phone")}
              onBlur={handleBlur("phone")}
              error={showError("phone")}
              helperText={showError("phone") ? errors.phone : " "}
              slotProps={maxLength(MAX.phone)}
              autoComplete="tel"
              fullWidth
            />

            <TextField
              label="Location"
              value={values.location ?? ""}
              onChange={handleChange("location")}
              onBlur={handleBlur("location")}
              error={showError("location")}
              helperText={showError("location") ? errors.location : " "}
              slotProps={maxLength(MAX.location)}
              autoComplete="address-level2"
              placeholder="City, Country"
              fullWidth
            />
          </Box>
        </Stack>

        {/* ── Section: Profile ───────────────────────────────────────────── */}
        <Stack spacing={2.5}>
          <Box>
            <SectionLabel>Profile</SectionLabel>
            <Divider sx={{ mt: 1 }} />
          </Box>

          <TextField
            label="LinkedIn URL"
            value={values.linkedInUrl ?? ""}
            onChange={handleChange("linkedInUrl")}
            onBlur={handleBlur("linkedInUrl")}
            error={showError("linkedInUrl")}
            helperText={showError("linkedInUrl") ? errors.linkedInUrl : " "}
            slotProps={maxLength(MAX.linkedInUrl)}
            autoComplete="url"
            placeholder="https://linkedin.com/in/…"
            fullWidth
          />

          <TextField
            label="Notes"
            value={values.notes ?? ""}
            onChange={handleChange("notes")}
            onBlur={handleBlur("notes")}
            error={showError("notes")}
            helperText={
              showError("notes")
                ? errors.notes
                : `${(values.notes ?? "").length} / ${MAX.notes}`
            }
            slotProps={maxLength(MAX.notes)}
            multiline
            minRows={4}
            fullWidth
          />
        </Stack>

        {/* ── Section: Documents ─────────────────────────────────────────── */}
        <Stack spacing={2.5}>
          <Box>
            <SectionLabel>Documents</SectionLabel>
            <Divider sx={{ mt: 1 }} />
          </Box>

          <FilePicker
            label="CV / Resume"
            accept=".pdf,.doc,.docx"
            hint="PDF, DOC or DOCX · Max 10 MB"
          />
        </Stack>

        {/* ── Submit ─────────────────────────────────────────────────────── */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={props.isSubmitting}
            aria-busy={props.isSubmitting}
            startIcon={
              props.isSubmitting ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                  aria-hidden="true"
                />
              ) : null
            }
            sx={{ minWidth: 180 }}
          >
            {props.isSubmitting ? "Saving…" : "Create candidate"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
