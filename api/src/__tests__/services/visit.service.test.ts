import { describe, it, expect } from 'vitest';
import * as visitService from '../../services/visit.service.js';
import type { UserContext } from '@visits/shared';

const techUser: UserContext = {
  userId: 'd0000000-0000-4000-8000-000000000001',
  role: 'technician',
  zoneId: 'a0000000-0000-4000-8000-000000000001',
  teamId: 'e0000000-0000-4000-8000-000000000001',
  name: 'Carlos Méndez',
};

const supervisorUser: UserContext = {
  userId: 'd0000000-0000-4000-8000-000000000004',
  role: 'supervisor',
  zoneId: 'a0000000-0000-4000-8000-000000000001',
  teamId: null,
  name: 'Laura Torres',
};

const adminUser: UserContext = {
  userId: 'd0000000-0000-4000-8000-000000000005',
  role: 'admin',
  zoneId: null,
  teamId: null,
  name: 'Miguel Ramírez',
};

describe('VisitService.list', () => {
  it('should return paginated results for admin', () => {
    const result = visitService.list({ page: 1, pageSize: 20 }, adminUser);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
    expect(result.page).toBe(1);
  });

  it('should filter by role for technician', () => {
    const result = visitService.list({ page: 1, pageSize: 20 }, techUser);
    for (const visit of result.data) {
      expect(
        visit.technicianId === techUser.userId || visit.teamId === techUser.teamId,
      ).toBe(true);
    }
  });

  it('should filter by zone for supervisor', () => {
    const result = visitService.list({ page: 1, pageSize: 20 }, supervisorUser);
    for (const visit of result.data) {
      expect(visit.zoneId).toBe(supervisorUser.zoneId);
    }
  });
});

describe('VisitService.getById', () => {
  it('should return visit for admin', () => {
    const visit = visitService.getById('f0000000-0000-4000-8000-000000000001', adminUser);
    expect(visit.id).toBe('f0000000-0000-4000-8000-000000000001');
  });

  it('should throw NotFoundError for non-existent visit', () => {
    expect(() =>
      visitService.getById('00000000-0000-0000-0000-000000000000', adminUser),
    ).toThrow('not found');
  });

  it('should throw ForbiddenError for technician accessing other visit', () => {
    // Visit 3 is assigned to Roberto (different technician, different team)
    expect(() =>
      visitService.getById('f0000000-0000-4000-8000-000000000003', techUser),
    ).toThrow();
  });
});

describe('VisitService.reschedule', () => {
  it('should throw ConflictError for non-scheduled visit', () => {
    expect(() =>
      visitService.reschedule(
        'f0000000-0000-4000-8000-000000000004', // cancelled visit
        { newDate: '2026-05-01', newTime: '10:00', reasonId: 'c0000000-0000-4000-8000-000000000004' },
        adminUser,
      ),
    ).toThrow('Cannot reschedule');
  });
});
