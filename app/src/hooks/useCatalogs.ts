import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthToken } from './useAuth';
import type { ServiceType, Reason, Zone, CreateServiceTypeInput, CreateReasonInput, CreateZoneInput } from '@visits/shared';

export function useServiceTypes(includeInactive = false) {
  const getToken = useAuthToken();
  return useQuery({
    queryKey: ['catalogs', 'service-types', includeInactive],
    queryFn: async () => {
      const token = await getToken();
      const qs = includeInactive ? '?includeInactive=true' : '';
      return apiClient<ServiceType[]>(`/api/catalogs/service-types${qs}`, { token });
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useReasons(type?: string) {
  const getToken = useAuthToken();
  return useQuery({
    queryKey: ['catalogs', 'reasons', type],
    queryFn: async () => {
      const token = await getToken();
      const qs = type ? `?type=${type}` : '';
      return apiClient<Reason[]>(`/api/catalogs/reasons${qs}`, { token });
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useZones(includeInactive = false) {
  const getToken = useAuthToken();
  return useQuery({
    queryKey: ['catalogs', 'zones', includeInactive],
    queryFn: async () => {
      const token = await getToken();
      const qs = includeInactive ? '?includeInactive=true' : '';
      return apiClient<Zone[]>(`/api/catalogs/zones${qs}`, { token });
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateServiceType() {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateServiceTypeInput) => {
      const token = await getToken();
      return apiClient<ServiceType>('/api/catalogs/service-types', {
        method: 'POST', body: JSON.stringify(data), token,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalogs', 'service-types'] }),
  });
}

export function useCreateReason() {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReasonInput) => {
      const token = await getToken();
      return apiClient<Reason>('/api/catalogs/reasons', {
        method: 'POST', body: JSON.stringify(data), token,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalogs', 'reasons'] }),
  });
}

export function useCreateZone() {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateZoneInput) => {
      const token = await getToken();
      return apiClient<Zone>('/api/catalogs/zones', {
        method: 'POST', body: JSON.stringify(data), token,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalogs', 'zones'] }),
  });
}
