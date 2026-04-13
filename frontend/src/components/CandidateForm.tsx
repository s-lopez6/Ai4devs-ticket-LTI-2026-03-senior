import React from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from '@mui/material';

import type { CreateCandidateRequest } from '../services/candidateService';

export type CandidateFormValues = CreateCandidateRequest;

export type CandidateFormProps = {
  onSubmit: (values: CandidateFormValues) => Promise<void>;
  isSubmitting: boolean;
  serverFieldErrors?: Record<string, string>;
  serverError?: string;
};

type FieldName = keyof CandidateFormValues;
type FormErrors = Partial<Record<FieldName, string>>;

const MAX = {
  fullName: 200,
  email: 254,
  phone: 32,
  location: 120,
  linkedInUrl: 500,
  notes: 2000,
} as const;

const DEFAULT_VALUES: CandidateFormValues = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedInUrl: '',
  notes: '',
};

function isValidEmail(value: string): boolean {
  // Intentionally simple (frontend hint); backend is authoritative.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(values: CandidateFormValues): FormErrors {
  const errors: FormErrors = {};

  const fullName = values.fullName.trim();
  const email = values.email.trim();

  if (fullName.length === 0) errors.fullName = 'Full name is required.';
  else if (fullName.length < 2)
    errors.fullName = 'Full name must be at least 2 characters.';
  else if (fullName.length > MAX.fullName)
    errors.fullName = `Full name must be at most ${MAX.fullName} characters.`;

  if (email.length === 0) errors.email = 'Email is required.';
  else if (email.length > MAX.email)
    errors.email = `Email must be at most ${MAX.email} characters.`;
  else if (!isValidEmail(email)) errors.email = 'Email format is invalid.';

  const phone = values.phone?.trim() ?? '';
  if (phone.length > MAX.phone)
    errors.phone = `Phone must be at most ${MAX.phone} characters.`;

  const location = values.location?.trim() ?? '';
  if (location.length > MAX.location)
    errors.location = `Location must be at most ${MAX.location} characters.`;

  const linkedInUrl = values.linkedInUrl?.trim() ?? '';
  if (linkedInUrl.length > MAX.linkedInUrl) {
    errors.linkedInUrl = `LinkedIn URL must be at most ${MAX.linkedInUrl} characters.`;
  } else if (linkedInUrl.length > 0) {
    try {
      // eslint-disable-next-line no-new
      new URL(linkedInUrl);
    } catch {
      errors.linkedInUrl = 'LinkedIn URL must be a valid URL.';
    }
  }

  const notes = values.notes ?? '';
  if (notes.length > MAX.notes)
    errors.notes = `Notes must be at most ${MAX.notes} characters.`;

  return errors;
}

export function CandidateForm(props: CandidateFormProps): JSX.Element {
  const [values, setValues] =
    React.useState<CandidateFormValues>(DEFAULT_VALUES);
  const [touched, setTouched] = React.useState<
    Partial<Record<FieldName, boolean>>
  >({});
  const [submitAttempted, setSubmitAttempted] = React.useState(false);

  const clientErrors = validate(values);
  const errors: FormErrors = { ...(props.serverFieldErrors ?? {}), ...clientErrors };

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
      // Keep current form state so server errors can be shown.
    }
  };

  const textFieldMaxLength = (maxLength: number) => ({
    htmlInput: { maxLength },
  });

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        {props.serverError ? <Alert severity="error">{props.serverError}</Alert> : null}

        <TextField
          required
          label="Full name"
          value={values.fullName}
          onChange={handleChange('fullName')}
          onBlur={handleBlur('fullName')}
          error={showError('fullName')}
          helperText={showError('fullName') ? errors.fullName : ' '}
          slotProps={textFieldMaxLength(MAX.fullName)}
          autoComplete="name"
          fullWidth
        />

        <TextField
          required
          label="Email"
          value={values.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          error={showError('email')}
          helperText={showError('email') ? errors.email : ' '}
          slotProps={textFieldMaxLength(MAX.email)}
          autoComplete="email"
          fullWidth
        />

        <TextField
          label="Phone"
          value={values.phone ?? ''}
          onChange={handleChange('phone')}
          onBlur={handleBlur('phone')}
          error={showError('phone')}
          helperText={showError('phone') ? errors.phone : ' '}
          slotProps={textFieldMaxLength(MAX.phone)}
          autoComplete="tel"
          fullWidth
        />

        <TextField
          label="Location"
          value={values.location ?? ''}
          onChange={handleChange('location')}
          onBlur={handleBlur('location')}
          error={showError('location')}
          helperText={showError('location') ? errors.location : ' '}
          slotProps={textFieldMaxLength(MAX.location)}
          autoComplete="address-level2"
          fullWidth
        />

        <TextField
          label="LinkedIn URL"
          value={values.linkedInUrl ?? ''}
          onChange={handleChange('linkedInUrl')}
          onBlur={handleBlur('linkedInUrl')}
          error={showError('linkedInUrl')}
          helperText={showError('linkedInUrl') ? errors.linkedInUrl : ' '}
          slotProps={textFieldMaxLength(MAX.linkedInUrl)}
          autoComplete="url"
          fullWidth
        />

        <TextField
          label="Notes"
          value={values.notes ?? ''}
          onChange={handleChange('notes')}
          onBlur={handleBlur('notes')}
          error={showError('notes')}
          helperText={showError('notes') ? errors.notes : ' '}
          slotProps={textFieldMaxLength(MAX.notes)}
          multiline
          minRows={3}
          fullWidth
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={props.isSubmitting}
            startIcon={
              props.isSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : null
            }
          >
            Create candidate
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

