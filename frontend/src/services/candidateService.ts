import axios from 'axios';

import { apiClient } from './apiClient';

export type CreateCandidateRequest = {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedInUrl?: string;
  notes?: string;
};

export type Candidate = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  linkedInUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiError = {
  status: number;
  message: string;
  validationErrors?: Record<string, string>;
};

type ErrorDetailsItem = { field?: string; message?: string };
type WrappedSuccess<T> = { success: true; data: T; message?: string };
type WrappedError = {
  success: false;
  error?: {
    message?: string;
    code?: string;
    details?: Array<ErrorDetailsItem>;
  };
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isWrappedSuccess<T>(data: unknown): data is WrappedSuccess<T> {
  return (
    isObject(data) &&
    (data as { success?: unknown }).success === true &&
    'data' in data
  );
}

function isWrappedError(data: unknown): data is WrappedError {
  return isObject(data) && (data as { success?: unknown }).success === false;
}

function toValidationErrors(details: unknown): Record<string, string> | undefined {
  if (!Array.isArray(details)) return undefined;

  const entries = details
    .map((item): [string, string] | null => {
      if (!isObject(item)) return null;
      const maybe = item as ErrorDetailsItem;
      if (!maybe.field || !maybe.message) return null;
      return [maybe.field, maybe.message];
    })
    .filter((x): x is [string, string] => x !== null);

  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries);
}

function normalizeApiError(error: unknown): ApiError {
  const fallback: ApiError = {
    status: 0,
    message: 'Something went wrong. Please try again.',
  };

  if (!axios.isAxiosError(error)) return fallback;

  const status = error.response?.status;
  const data = error.response?.data;
  if (typeof status !== 'number') return fallback;

  if (isWrappedError(data)) {
    const message =
      (typeof data.error?.message === 'string' && data.error.message) ||
      fallback.message;
    const validationErrors = toValidationErrors(data.error?.details);
    return { status, message, validationErrors };
  }

  if (isObject(data)) {
    const message =
      (typeof data.message === 'string' && data.message) || fallback.message;
    const validationErrors = toValidationErrors((data as Record<string, unknown>).details);
    return { status, message, validationErrors };
  }

  return { ...fallback, status };
}

function unwrapCandidateResponse(payload: unknown): Candidate {
  if (isWrappedSuccess<Candidate>(payload)) return payload.data;
  return payload as Candidate;
}

export async function createCandidate(
  request: CreateCandidateRequest
): Promise<Candidate> {
  try {
    const response = await apiClient.post('/candidates', request);
    return unwrapCandidateResponse(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

