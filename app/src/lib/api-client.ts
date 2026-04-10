import type { ApiError } from '@visits/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.statusCode = error.statusCode;
    this.errorCode = error.error;
    this.details = error.details;
  }
}

/**
 * Fetch wrapper that injects Clerk auth token and handles errors.
 */
export async function apiClient<T>(
  path: string,
  options?: RequestInit & { token?: string },
): Promise<T> {
  const { token, ...fetchOptions } = options ?? {};

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'UNKNOWN',
      message: 'An unexpected error occurred',
      statusCode: response.status,
    }));
    throw new ApiClientError(error);
  }

  return response.json();
}

/**
 * Build query string from params object, omitting undefined values.
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}
