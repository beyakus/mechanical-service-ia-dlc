import { describe, it, expect } from 'vitest';
import { extractToken, checkRole } from '../../middleware/auth.js';
import type { UserContext } from '@visits/shared';

describe('extractToken', () => {
  it('should extract Bearer token', () => {
    const token = extractToken({ Authorization: 'Bearer abc123' });
    expect(token).toBe('abc123');
  });

  it('should handle lowercase authorization header', () => {
    const token = extractToken({ authorization: 'Bearer xyz789' });
    expect(token).toBe('xyz789');
  });

  it('should throw UnauthorizedError for missing header', () => {
    expect(() => extractToken({})).toThrow('Missing or invalid');
  });

  it('should throw UnauthorizedError for non-Bearer token', () => {
    expect(() => extractToken({ Authorization: 'Basic abc123' })).toThrow('Missing or invalid');
  });
});

describe('checkRole', () => {
  const techUser: UserContext = {
    userId: 'test-id', role: 'technician', zoneId: null, teamId: null, name: 'Test',
  };

  it('should pass when role is in allowed list', () => {
    expect(() => checkRole(techUser, ['technician', 'admin'])).not.toThrow();
  });

  it('should throw ForbiddenError when role is not allowed', () => {
    expect(() => checkRole(techUser, ['admin'])).toThrow('not authorized');
  });
});
