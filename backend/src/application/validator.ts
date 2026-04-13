import { ValidationError, type FieldError } from './errors';

export type CreateCandidateInput = {
  fullName: string;
  email: string;
  emailNormalized: string;
  phone?: string;
  location?: string;
  linkedInUrl?: string;
  notes?: string;
};

const EMAIL_MAX_LENGTH = 254;
const FULL_NAME_MAX_LENGTH = 200;
const LOCATION_MAX_LENGTH = 120;
const LINKEDIN_URL_MAX_LENGTH = 500;
const NOTES_MAX_LENGTH = 2000;
const PHONE_MAX_LENGTH = 32;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asTrimmedString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.trim();
}

function isValidEmail(value: string): boolean {
  // Intentionally simple: good enough for UX + basic server validation.
  // Source of truth remains server-side + uniqueness constraint.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function optionalStringField(
  field: string,
  raw: unknown,
  maxLength: number,
  errors: FieldError[],
): string | undefined {
  if (raw === undefined || raw === null || raw === '') return undefined;
  const value = asTrimmedString(raw);
  if (value === undefined) {
    errors.push({ field, message: 'Must be a string' });
    return undefined;
  }
  if (value.length > maxLength) {
    errors.push({ field, message: `Must be at most ${maxLength} characters` });
    return undefined;
  }
  return value;
}

export function validateCreateCandidatePayload(
  payload: unknown,
): CreateCandidateInput {
  if (!isRecord(payload)) {
    throw new ValidationError('Validation failed', [
      { field: 'body', message: 'Request body must be an object' },
    ]);
  }

  const errors: FieldError[] = [];

  const fullName = asTrimmedString(payload.fullName);
  if (!fullName) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  } else {
    if (fullName.length < 2)
      errors.push({
        field: 'fullName',
        message: 'Must be at least 2 characters',
      });
    if (fullName.length > FULL_NAME_MAX_LENGTH) {
      errors.push({
        field: 'fullName',
        message: `Must be at most ${FULL_NAME_MAX_LENGTH} characters`,
      });
    }
  }

  const email = asTrimmedString(payload.email);
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    if (email.length > EMAIL_MAX_LENGTH) {
      errors.push({
        field: 'email',
        message: `Must be at most ${EMAIL_MAX_LENGTH} characters`,
      });
    }
    if (!isValidEmail(email)) {
      errors.push({ field: 'email', message: 'Must be a valid email address' });
    }
  }

  const phone = optionalStringField(
    'phone',
    payload.phone,
    PHONE_MAX_LENGTH,
    errors,
  );
  const location = optionalStringField(
    'location',
    payload.location,
    LOCATION_MAX_LENGTH,
    errors,
  );
  const linkedInUrl = optionalStringField(
    'linkedInUrl',
    payload.linkedInUrl,
    LINKEDIN_URL_MAX_LENGTH,
    errors,
  );
  const notes = optionalStringField(
    'notes',
    payload.notes,
    NOTES_MAX_LENGTH,
    errors,
  );

  if (linkedInUrl && !isValidUrl(linkedInUrl)) {
    errors.push({ field: 'linkedInUrl', message: 'Must be a valid URL' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }

  const normalizedEmail = email!.toLowerCase();

  return {
    fullName: fullName!,
    email: email!,
    emailNormalized: normalizedEmail,
    ...(phone ? { phone } : {}),
    ...(location ? { location } : {}),
    ...(linkedInUrl ? { linkedInUrl } : {}),
    ...(notes ? { notes } : {}),
  };
}
