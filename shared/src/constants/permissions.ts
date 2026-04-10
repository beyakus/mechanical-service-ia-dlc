import { Role } from '../enums/index.js';

export type Action =
  | 'view_own_visits'
  | 'view_zone_visits'
  | 'view_all_visits'
  | 'create_visit'
  | 'reschedule_own_visit'
  | 'reschedule_zone_visit'
  | 'cancel_visit'
  | 'complete_own_visit'
  | 'finalize_visit'
  | 'reassign_visit'
  | 'view_analytics'
  | 'manage_catalogs';

/**
 * Map of permissions per role.
 * Key: role, Value: set of allowed actions.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Action[]> = {
  [Role.TECHNICIAN]: [
    'view_own_visits',
    'reschedule_own_visit',
    'complete_own_visit',
  ],
  [Role.SUPERVISOR]: [
    'view_own_visits',
    'view_zone_visits',
    'create_visit',
    'reschedule_own_visit',
    'reschedule_zone_visit',
    'cancel_visit',
    'finalize_visit',
    'reassign_visit',
    'view_analytics',
  ],
  [Role.ADMIN]: [
    'view_own_visits',
    'view_zone_visits',
    'view_all_visits',
    'create_visit',
    'reschedule_own_visit',
    'reschedule_zone_visit',
    'cancel_visit',
    'finalize_visit',
    'reassign_visit',
    'view_analytics',
    'manage_catalogs',
  ],
} as const;

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: Role, action: Action): boolean {
  return (ROLE_PERMISSIONS[role] as readonly Action[]).includes(action);
}
