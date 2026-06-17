import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerService, type RoomStatus } from '../services/api/owner.service';

/**
 * Mutation to change a room's status (available/occupied/renovation).
 * Invalidates the properties query so occupancy & revenue recompute.
 */
export const useUpdateRoomStatus = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ roomId, status }: { roomId: string; status: RoomStatus }) =>
      ownerService.updateRoomStatus(roomId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
  return {
    updateRoomStatus: mutation.mutate,
    isUpdating: mutation.isPending,
    pendingRoomId: (mutation.variables as { roomId: string } | undefined)?.roomId,
  };
};
