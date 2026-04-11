import type { ServiceType, Reason, Zone } from '@visits/shared';
import * as catalogRepo from '../repositories/mock-catalog.repository.js';

export function listServiceTypes(includeInactive = false): ServiceType[] {
  return catalogRepo.getServiceTypes(includeInactive);
}

export function listReasons(type?: string, includeInactive = false): Reason[] {
  return catalogRepo.getReasons(type, includeInactive);
}

export function listZones(includeInactive = false): Zone[] {
  return catalogRepo.getZones(includeInactive);
}

// Create/Update/Toggle operations would mutate the store in a real implementation.
// With static seed data, these return mock responses.

export function createServiceType(input: { name: string; description?: string }): ServiceType {
  return {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description ?? null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createReason(input: { name: string; type: string }): Reason {
  return {
    id: crypto.randomUUID(),
    name: input.name,
    type: input.type as 'cancellation' | 'reschedule',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createZone(input: { name: string; description?: string }): Zone {
  return {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description ?? null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
