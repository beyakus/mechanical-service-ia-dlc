import type { UserContext } from '@visits/shared';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import type { Logger } from '../utils/logger.js';

const DEV_MODE = process.env.NODE_ENV !== 'production';

/** Default dev user when no token is provided in dev mode. */
const DEV_USER: UserContext = {
  userId: 'd0000000-0000-4000-8000-000000000005',
  role: 'admin',
  zoneId: null,
  teamId: null,
  name: 'Dev Admin',
};

/**
 * Extract Bearer token from Authorization header.
 * In dev mode, returns empty string if no token (allows bypass).
 */
export function extractToken(headers: Record<string, string>): string {
  const authHeader = headers['authorization'] || headers['Authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    if (DEV_MODE) return '';
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }
  return authHeader.slice(7);
}

/**
 * Verify JWT token with Clerk and extract user context.
 * In dev mode with empty token, returns a default admin user.
 */
export async function verifyAndExtractUser(
  token: string,
  _logger: Logger,
): Promise<UserContext> {
  // Dev bypass: no token = default admin user
  if (DEV_MODE && !token) {
    return DEV_USER;
  }

  // TODO: Replace with actual Clerk Backend SDK verification
  // For now, use a mock token format: base64({ userId, role, zoneId, teamId, name })
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return {
      userId: decoded.userId,
      role: decoded.role,
      zoneId: decoded.zoneId ?? null,
      teamId: decoded.teamId ?? null,
      name: decoded.name,
    };
  } catch {
    throw new UnauthorizedError('Invalid token');
  }
}

/**
 * Check if user's role is in the allowed roles list.
 */
export function checkRole(user: UserContext, allowedRoles: string[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(`Role '${user.role}' is not authorized for this action`);
  }
}
