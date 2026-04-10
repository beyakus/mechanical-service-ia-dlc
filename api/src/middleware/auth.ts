import type { UserContext } from '../../../shared/src/index.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import type { Logger } from '../utils/logger.js';

/**
 * Extract Bearer token from Authorization header.
 */
export function extractToken(headers: Record<string, string>): string {
  const authHeader = headers['authorization'] || headers['Authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }
  return authHeader.slice(7);
}

/**
 * Verify JWT token with Clerk and extract user context.
 * In mock mode, parses a simplified token format for development.
 */
export async function verifyAndExtractUser(
  token: string,
  _logger: Logger,
): Promise<UserContext> {
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
