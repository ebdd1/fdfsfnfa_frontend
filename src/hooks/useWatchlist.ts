import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistService } from '../services/api/watchlist.service';
import { useAuthStore } from '../stores/authStore';

/**
 * Watchlist for the currently logged-in seeker.
 * Maps backend records (keyed by record id) to a set of propertyIds for the UI,
 * while keeping the record id needed for deletion.
 *
 * FIX: Backend now uses JWT user.id — no need to pass seekerId [SEC-001]
 */
export const useWatchlist = () => {
  const { user } = useAuthStore();
  const seekerId = user?.id;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['watchlist'],
    // FIX: getBySeeker no longer takes seekerId param [SEC-001]
    queryFn: () => watchlistService.getBySeeker(),
    enabled: !!seekerId,
  });

  const records = query.data || [];
  const watchlistIds = records.map((r) => r.propertyId);
  const recordIdByProperty = new Map(records.map((r) => [r.propertyId, r.id]));

  const addMutation = useMutation({
    // FIX: add no longer takes seekerId param [SEC-001]
    mutationFn: (propertyId: string) => watchlistService.add(propertyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] }),
  });

  const removeMutation = useMutation({
    mutationFn: (recordId: string) => watchlistService.remove(recordId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] }),
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
