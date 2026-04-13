import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AddCandidatePage from '../../pages/AddCandidatePage';
import { createCandidate } from '../../services/candidateService';

jest.mock('../../services/candidateService', () => ({
  createCandidate: jest.fn(),
}));

const createCandidateMock = createCandidate as unknown as jest.Mock;

test('calls service with typed payload and shows success', async () => {
  createCandidateMock.mockResolvedValueOnce({
    id: '1',
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  render(<AddCandidatePage />);

  await userEvent.type(screen.getByLabelText(/full name/i), ' Ada Lovelace ');
  await userEvent.type(screen.getByLabelText(/email/i), ' ada@example.com ');
  await userEvent.click(screen.getByRole('button', { name: /create candidate/i }));

  expect(createCandidateMock).toHaveBeenCalledWith({
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: undefined,
    location: undefined,
    linkedInUrl: undefined,
    notes: undefined,
  });

  expect(
    await screen.findByText(/candidate created: ada lovelace \(ada@example\.com\)/i)
  ).toBeInTheDocument();
});

test('renders duplicate email message for 409', async () => {
  createCandidateMock.mockRejectedValueOnce({
    status: 409,
    message: 'Conflict',
  });

  render(<AddCandidatePage />);

  await userEvent.type(screen.getByLabelText(/full name/i), 'Ada Lovelace');
  await userEvent.type(screen.getByLabelText(/email/i), 'ada@example.com');
  await userEvent.click(screen.getByRole('button', { name: /create candidate/i }));

  expect(
    await screen.findByText(/a candidate with this email already exists/i)
  ).toBeInTheDocument();
});

test('renders server field errors from a mocked 400', async () => {
  createCandidateMock.mockRejectedValueOnce({
    status: 400,
    message: 'Validation error',
    validationErrors: { email: 'Email is invalid.' },
  });

  render(<AddCandidatePage />);

  await userEvent.type(screen.getByLabelText(/full name/i), 'Ada Lovelace');
  await userEvent.type(screen.getByLabelText(/email/i), 'ada@example.com');
  await userEvent.click(screen.getByRole('button', { name: /create candidate/i }));

  expect(await screen.findByText(/email is invalid\./i)).toBeInTheDocument();
});

