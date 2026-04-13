export type FieldError = {
  field: string;
  message: string;
};

export class ValidationError extends Error {
  public readonly code = 'VALIDATION_ERROR' as const;
  public readonly details: FieldError[];

  constructor(message: string, details: FieldError[]) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.details = details;
  }
}

export class ConflictError extends Error {
  public readonly code = 'CONFLICT' as const;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
