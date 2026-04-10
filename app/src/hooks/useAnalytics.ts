import { useQuery } from '@tanstack/react-query';
import { apiClient, buildQueryString } from '@/lib/api-client';
import { useAuthToken } from './useAuth';
import type { VisitSummary, ReasonCount, TrendData, AnalyticsFilters } from '@visits/shared';

export function useAnalyticsSummary(filters: Partial<AnalyticsFilters>) {
  const getToken = useAuthToken();
  return useQuery({
    queryKey: ['analytics', 'summary', filters],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<VisitSummary>(`/api/analytics/summary${buildQueryString(filters)}`, { token });
    },
    staleTime: 60 * 1000,
    enabled: !!filters.startDate && !!filters.endDate,
  });
}

export function useCancellationReasons(filters: Partial<AnalyticsFilters>) {
  const getToken = useAuthToken();
  return useQuery({
    queryKey: ['analytics', 'cancellation-reasons', filters],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<ReasonCount[]>(`/api/analytics/cancellation-reasons${buildQueryString(filters)}`, { token });
    },
    staleTime: 60 * 1000,
    enabled: !!filters.startDate && !!filters.endDate,
  });
}

export function useRescheduleReasons(filters: Partial<AnalyticsFilters>) {
  const getToken = useAuthToken();
  return useQuery({
    queryKey: ['analytics', 'reschedule-reasons', filters],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<ReasonCount[]>(`/api/analytics/reschedule-reasons${buildQueryString(filters)}`, { token });
    },
    staleTime: 60 * 1000,
    enabled: !!filters.startDate && !!filters.endDate,
  });
}

export function useTrends(filters: Partial<AnalyticsFilters>) {
  const getToken = useAuthToken();
  return useQuery({
    queryKey: ['analytics', 'trends', filters],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<TrendData[]>(`/api/analytics/trends${buildQueryString(filters)}`, { token });
    },
    staleTime: 60 * 1000,
    enabled: !!filters.startDate && !!filters.endDate,
  });
}
