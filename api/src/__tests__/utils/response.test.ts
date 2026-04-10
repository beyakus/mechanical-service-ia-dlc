import { describe, it, expect } from 'vitest';
import { buildResponse, buildErrorResponse } from '../../utils/response.js';

describe('buildResponse', () => {
  it('should include security headers', () => {
    const response = buildResponse(200, { ok: true });
    expect(response.headers!['X-Content-Type-Options']).toBe('nosniff');
    expect(response.headers!['X-Frame-Options']).toBe('DENY');
    expect(response.headers!['Strict-Transport-Security']).toContain('max-age=31536000');
    expect(response.headers!['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(response.headers!['Content-Type']).toBe('application/json');
  });

  it('should serialize body as JSON', () => {
    const response = buildResponse(200, { data: [1, 2, 3] });
    expect(JSON.parse(response.body)).toEqual({ data: [1, 2, 3] });
  });
});

describe('buildErrorResponse', () => {
  it('should include error fields', () => {
    const response = buildErrorResponse(400, 'VALIDATION_ERROR', 'Invalid input', { name: ['Required'] });
    const body = JSON.parse(response.body);
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toBe('Invalid input');
    expect(body.statusCode).toBe(400);
    expect(body.details.name).toEqual(['Required']);
  });

  it('should include security headers', () => {
    const response = buildErrorResponse(500, 'INTERNAL_ERROR', 'Something went wrong');
    expect(response.headers!['X-Content-Type-Options']).toBe('nosniff');
  });
});
