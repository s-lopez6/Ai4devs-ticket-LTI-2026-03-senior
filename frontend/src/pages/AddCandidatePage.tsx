import React from 'react';
import {
  Alert,
  Card,
  CardContent,
  Container,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';

import { CandidateForm } from '../components/CandidateForm';
import {
  createCandidate,
  type ApiError,
  type Candidate,
  type CreateCandidateRequest,
} from '../services/candidateService';

export default function AddCandidatePage(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | undefined>();
  const [serverFieldErrors, setServerFieldErrors] = React.useState<
    Record<string, string> | undefined
  >();
  const [success, setSuccess] = React.useState<{ open: boolean; message: string }>(
    { open: false, message: '' }
  );

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
        setServerError('A candidate with this email already exists.');
      } else {
        setServerError(apiError.message || 'Something went wrong. Please try again.');
      }
      throw apiError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1">
          Add Candidate
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Create a new candidate profile.
        </Typography>

        <Card variant="outlined">
          <CardContent>
            <CandidateForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              serverError={serverError}
              serverFieldErrors={serverFieldErrors}
            />
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={success.open}
        autoHideDuration={4000}
        onClose={() => setSuccess((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccess((prev) => ({ ...prev, open: false }))}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {success.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

