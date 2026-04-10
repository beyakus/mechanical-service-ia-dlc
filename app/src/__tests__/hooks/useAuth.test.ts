import { describe, it, expect } from 'vitest';
import { ROLE_PERMISSIONS, hasPermission } from '@visits/shared';

// Testing the role permission logic used by useUserRole
describe('Role Permissions', () => {
  it('technician should only have limited permissions', () => {
    expect(hasPermission('technician', 'view_own_visits')).toBe(true);
    expect(hasPermission('technician', 'complete_own_visit')).toBe(true);
    expect(hasPermission('technician', 'create_visit')).toBe(false);
    expect(hasPermission('technician', 'cancel_visit')).toBe(false);
    expect(hasPermission('technician', 'manage_catalogs')).toBe(false);
    expect(hasPermission('technician', 'view_analytics')).toBe(false);
  });

  it('supervisor should have zone-level permissions', () => {
    expect(hasPermission('supervisor', 'view_zone_visits')).toBe(true);
    expect(hasPermission('supervisor', 'create_visit')).toBe(true);
    expect(hasPermission('supervisor', 'cancel_visit')).toBe(true);
    expect(hasPermission('supervisor', 'reassign_visit')).toBe(true);
    expect(hasPermission('supervisor', 'view_analytics')).toBe(true);
    expect(hasPermission('supervisor', 'manage_catalogs')).toBe(false);
    expect(hasPermission('supervisor', 'view_all_visits')).toBe(false);
  });

  it('admin should have all permissions', () => {
    expect(hasPermission('admin', 'view_all_visits')).toBe(true);
    expect(hasPermission('admin', 'manage_catalogs')).toBe(true);
    expect(hasPermission('admin', 'view_analytics')).toBe(true);
    expect(hasPermission('admin', 'create_visit')).toBe(true);
  });
});
