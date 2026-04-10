import { ZodError, type ZodSchema } from 'zod';

/**
 * Parse and validate input using a Zod schema.
 * Throws ValidationError with field-level details on failure.
 */
export function validateInput<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const details: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const path = issue.path.join('.') || '_root';
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      }
      throw new ValidationError('Invalid input', details);
    }
    throw error;
  }
}

export class ValidationError extends Error {
  public readonly details: Record<string, string[]>;

  constructor(message: string, details: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}
