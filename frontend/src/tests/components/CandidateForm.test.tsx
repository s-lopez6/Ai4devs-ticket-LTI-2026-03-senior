import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CandidateForm } from '../../components/CandidateForm';

test('shows required errors when submitting empty form', async () => {
  const onSubmit = jest.fn(async () => {});

  render(
    <CandidateForm
      onSubmit={onSubmit}
      isSubmitting={false}
      serverError={undefined}
      serverFieldErrors={undefined}
    />
  );

  await userEvent.click(screen.getByRole('button', { name: /create candidate/i }));

  expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
  expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test('validates invalid email format', async () => {
  const onSubmit = jest.fn(async () => {});

  render(
    <CandidateForm
      onSubmit={onSubmit}
      isSubmitting={false}
      serverError={undefined}
      serverFieldErrors={undefined}
    />
  );

  await userEvent.type(screen.getByLabelText(/full name/i), 'Ada Lovelace');
  await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
  await userEvent.click(screen.getByRole('button', { name: /create candidate/i }));

  expect(await screen.findByText(/email format is invalid/i)).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

