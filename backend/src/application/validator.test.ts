import { validateCreateCandidatePayload } from './validator';
import { ValidationError } from './errors';

describe('validateCreateCandidatePayload', () => {
  it('should return normalized payload when valid input provided', () => {
    const result = validateCreateCandidatePayload({
      fullName: ' Ada Lovelace ',
      email: ' Ada@Example.com ',
      phone: '123',
      location: 'London',
      linkedInUrl: 'https://www.linkedin.com/in/adalovelace',
      notes: 'Notes',
    });

    expect(result.fullName).toBe('Ada Lovelace');
    expect(result.email).toBe('Ada@Example.com');
    expect(result.emailNormalized).toBe('ada@example.com');
  });

  it('should throw ValidationError when required fields missing', () => {
    expect(() => validateCreateCandidatePayload({})).toThrow(ValidationError);
  });

  it('should throw ValidationError when email invalid', () => {
    expect(() =>
      validateCreateCandidatePayload({
        fullName: 'Ada Lovelace',
        email: 'not-an-email',
      }),
    ).toThrow(ValidationError);
  });
});
