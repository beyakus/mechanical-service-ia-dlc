import { describe, it, expect } from 'vitest';
import * as analyticsService from '../../services/analytics.service.js';
import type { UserContext } from '@visits/shared';

const adminUser: UserContext = {
  userId: 'd0000000-0000-4000-8000-000000000005',
  role: 'admin',
  zoneId: null,
  teamId: null,
  name: 'Miguel Ramírez',
};

describe('AnalyticsService.getSummary', () => {
  it('should return summary with total equal to sum of statuses', () => {
    const summary = analyticsService.getSummary(adminUser, '2026-01-01', '2026-12-31');
    expect(summary.total).toBe(
      summary.scheduled + summary.completed + summary.cancelled + summary.rescheduled + summary.finalized,
    );
  });

  it('should return zero counts for empty date range', () => {
    const summary = analyticsService.getSummary(adminUser, '2020-01-01', '2020-01-02');
    expect(summary.total).toBe(0);
  });
});

describe('AnalyticsService.getCancellationReasons', () => {
  it('should return reason counts sorted by frequency', () => {
    const reasons = analyticsService.getCancellationReasons(adminUser, '2026-01-01', '2026-12-31');
    for (let i = 1; i < reasons.length; i++) {
      expect(reasons[i - 1].count).toBeGreaterThanOrEqual(reasons[i].count);
    }
  });
});

describe('AnalyticsService.getTrends', () => {
  it('should return trends sorted by date', () => {
    const trends = analyticsService.getTrends(adminUser, '2026-01-01', '2026-12-31');
    for (let i = 1; i < trends.length; i++) {
      expect(trends[i - 1].period <= trends[i].period).toBe(true);
    }
  });
});
