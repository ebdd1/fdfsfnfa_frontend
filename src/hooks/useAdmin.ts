import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type AdminUser, type AdminListing } from '../services/api/admin.service';

export const useAdminUsers = () => {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['admin-users'], queryFn: adminService.listUsers });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pick<AdminUser, 'isVerified' | 'isActive' | 'role'>> }) =>
      adminService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};

export const useAdminListings = () => {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['admin-listings'], queryFn: adminService.listListings });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { isVerified?: boolean; status?: string } }) =>
      adminService.updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  return {
    listings: (query.data ?? []) as AdminListing[],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    updateListing: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};

export const useAdminStats = () => {
  const query = useQuery({ queryKey: ['admin-stats'], queryFn: adminService.getStats });
  return { stats: query.data, isLoading: query.isLoading, isError: query.isError };
};

export const useAdminConversations = () => {
  const query = useQuery({ queryKey: ['admin-conversations'], queryFn: adminService.listConversations });
  return { conversations: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
};

export const useAdminConversationMessages = (conversationId: string | null) => {
  const query = useQuery({
    queryKey: ['admin-conversation-messages', conversationId],
    queryFn: () => adminService.getConversationMessages(conversationId as string),
    enabled: !!conversationId,
  });
  return { messages: query.data ?? [], isLoading: query.isLoading, isError: query.isError };
};
