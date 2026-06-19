import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerService, type RoomStatus } from '../services/api/owner.service';
import { propertyService } from '../services/api/property.service';

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

/**
 * Mutation to add rooms to an existing property.
 */
export const useAddRooms = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ propertyId, count, priceMonthly }: { propertyId: string; count: number; priceMonthly: number }) =>
      propertyService.addRooms(propertyId, count, priceMonthly),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
  return {
    addRooms: mutation.mutateAsync,
    isAdding: mutation.isPending,
    pendingPropertyId: (mutation.variables as { propertyId: string } | undefined)?.propertyId,
  };
};

/**
 * Mutation to delete a single room from a property.
 */
export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ propertyId, roomId }: { propertyId: string; roomId: string }) =>
      propertyService.deleteRoom(propertyId, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
  return {
    deleteRoom: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    pendingRoomId: (mutation.variables as { roomId: string } | undefined)?.roomId,
  };
};

/**
 * Mutation to delete a single property.
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (propertyId: string) => propertyService.deleteProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
  return {
    deleteProperty: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    deletingId: (mutation.variables as string | undefined),
  };
};

/**
 * Mutation to bulk delete multiple properties.
 */
export const useDeletePropertiesBulk = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (propertyIds: string[]) => propertyService.deletePropertiesBulk(propertyIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
  return {
    deletePropertiesBulk: mutation.mutateAsync,
    isBulkDeleting: mutation.isPending,
  };
};
