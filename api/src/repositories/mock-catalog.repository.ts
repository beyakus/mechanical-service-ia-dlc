import type { ServiceType, Reason, Zone, UserContext } from '@visits/shared';
import seedData from './seed-data.json' assert { type: 'json' };

const store = Object.freeze({
  serviceTypes: seedData.serviceTypes as ServiceType[],
  reasons: seedData.reasons as Reason[],
  zones: seedData.zones as Zone[],
  technicians: seedData.technicians as UserContext[],
});

export function getServiceTypes(includeInactive = false): ServiceType[] {
  return includeInactive
    ? [...store.serviceTypes]
    : store.serviceTypes.filter((st) => st.isActive);
}

export function getServiceTypeById(id: string): ServiceType | undefined {
  return store.serviceTypes.find((st) => st.id === id);
}

export function getReasons(type?: string, includeInactive = false): Reason[] {
  let results = [...store.reasons];
  if (!includeInactive) {
    results = results.filter((r) => r.isActive);
  }
  if (type) {
    results = results.filter((r) => r.type === type);
  }
  return results;
}

export function getReasonById(id: string): Reason | undefined {
  return store.reasons.find((r) => r.id === id);
}

export function getZones(includeInactive = false): Zone[] {
  return includeInactive
    ? [...store.zones]
    : store.zones.filter((z) => z.isActive);
}

export function getZoneById(id: string): Zone | undefined {
  return store.zones.find((z) => z.id === id);
}

export function getTechnicianById(id: string): UserContext | undefined {
  return store.technicians.find((t) => t.userId === id);
}
