import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, buildQueryString } from '@/lib/api-client';
import { useAuthToken } from './useAuth';
import type {
  Visit, CalendarVisit, PaginatedResult,
  VisitFilters, CalendarFilters,
  RescheduleInput, CancelInput, CompleteInput, FinalizeInput, ReassignInput,
} from '@visits/shared';

export function useVisits(filters: Partial<VisitFilters>) {
  const getToken = useAuthToken();
  return useQuery({
    queryKey: ['visits', filters],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<PaginatedResult<Visit>>(
        `/api/visits${buildQueryString(filters)}`,
        { token },
      );
    },
  });
}

export function useVisit(id: string) {
  const getToken = useAuthToken();
  return useQuery({
    queryKey: ['visits', id],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<Visit>(`/api/visits/${id}`, { token });
    },
    enabled: !!id,
  });
}

export function useCalendarVisits(filters: Partial<CalendarFilters>) {
  const getToken = useAuthToken();
  return useQuery({
    queryKey: ['calendar', filters],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<CalendarVisit[]>(
        `/api/visits/calendar${buildQueryString(filters)}`,
        { token },
      );
    },
    enabled: !!filters.startDate && !!filters.endDate,
  });
}

export function useRescheduleVisit() {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RescheduleInput }) => {
      const token = await getToken();
      return apiClient<Visit>(`/api/visits/${id}/reschedule`, {
        method: 'PUT', body: JSON.stringify(data), token,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useCancelVisit() {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CancelInput }) => {
      const token = await getToken();
      return apiClient<Visit>(`/api/visits/${id}/cancel`, {
        method: 'PUT', body: JSON.stringify(data), token,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useCompleteVisit() {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CompleteInput }) => {
      const token = await getToken();
      return apiClient<Visit>(`/api/visits/${id}/complete`, {
        method: 'PUT', body: JSON.stringify(data), token,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['visits', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useFinalizeVisit() {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FinalizeInput }) => {
      const token = await getToken();
      return apiClient<Visit>(`/api/visits/${id}/finalize`, {
        method: 'PUT', body: JSON.stringify(data), token,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['visits', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useReassignVisit() {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ReassignInput }) => {
      const token = await getToken();
      return apiClient<Visit>(`/api/visits/${id}/reassign`, {
        method: 'PUT', body: JSON.stringify(data), token,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}
