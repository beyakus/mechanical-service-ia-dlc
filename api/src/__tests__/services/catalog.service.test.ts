import { describe, it, expect } from 'vitest';
import * as catalogService from '../../services/catalog.service.js';

describe('CatalogService.listServiceTypes', () => {
  it('should return only active service types by default', () => {
    const types = catalogService.listServiceTypes();
    expect(types.every((t) => t.isActive)).toBe(true);
  });

  it('should include inactive when requested', () => {
    const types = catalogService.listServiceTypes(true);
    expect(types.some((t) => !t.isActive)).toBe(true);
  });
});

describe('CatalogService.listReasons', () => {
  it('should return all active reasons', () => {
    const reasons = catalogService.listReasons();
    expect(reasons.length).toBeGreaterThan(0);
    expect(reasons.every((r) => r.isActive)).toBe(true);
  });

  it('should filter by type', () => {
    const cancellations = catalogService.listReasons('cancellation');
    expect(cancellations.every((r) => r.type === 'cancellation')).toBe(true);
  });
});

describe('CatalogService.listZones', () => {
  it('should return active zones', () => {
    const zones = catalogService.listZones();
    expect(zones.length).toBe(3);
  });
});

describe('CatalogService.createServiceType', () => {
  it('should return a new service type with generated id', () => {
    const result = catalogService.createServiceType({ name: 'Test Type' });
    expect(result.id).toBeTruthy();
    expect(result.name).toBe('Test Type');
    expect(result.isActive).toBe(true);
  });
});
