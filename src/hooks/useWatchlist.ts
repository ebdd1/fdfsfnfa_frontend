import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistService } from '../services/api/watchlist.service';
import { useAuthStore } from '../stores/authStore';

/**
 * Watchlist for the currently logged-in seeker.
 * Maps backend records (keyed by record id) to a set of propertyIds for the UI,
 * while keeping the record id needed for deletion.
 */
export const useWatchlist = () => {
  const { user } = useAuthStore();
  const seekerId = user?.id;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['watchlist', seekerId],
    queryFn: () => watchlistService.getBySeeker(seekerId as string),
    enabled: !!seekerId,
  });

  const records = query.data || [];
  const watchlistIds = records.map((r) => r.propertyId);
  const recordIdByProperty = new Map(records.map((r) => [r.propertyId, r.id]));

  const addMutation = useMutation({
    mutationFn: (propertyId: string) => watchlistService.add(seekerId as string, propertyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist', seekerId] }),
  });

  const removeMutation = useMutation({
    mutationFn: (recordId: string) => watchlistService.remove(recordId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist', seekerId] }),
  });

  const toggleWatchlist = (propertyId: string) => {
    if (!seekerId) return;
    const existingRecordId = recordIdByProperty.get(propertyId);
    if (existingRecordId) {
      removeMutation.mutate(existingRecordId);
    } else {
      addMutation.mutate(propertyId);
    }
  };

  return {
    ...query,
    records,
    watchlistIds,
    toggleWatchlist,
    isAuthenticated: !!seekerId,
  };
};
