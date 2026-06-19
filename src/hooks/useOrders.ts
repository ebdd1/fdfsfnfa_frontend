import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/api/order.service';
import { useAuthStore } from '../stores/authStore';
import type { PaymentMethod } from '../types';

const invalidateOrders = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ['orders'] });
  qc.invalidateQueries({ queryKey: ['admin-orders'] });
  qc.invalidateQueries({ queryKey: ['admin-stats'] });
  qc.invalidateQueries({ queryKey: ['properties'] });
};

/** Orders where the logged-in user is seeker or owner. */
export const useMyOrders = () => {
  const { user } = useAuthStore();
  const query = useQuery({
    queryKey: ['orders', 'mine', user?.id],
    queryFn: orderService.mine,
    enabled: !!user?.id,
  });
  return { orders: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
};

export const useOrderActions = () => {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: (data: { roomId: string; startDate: string; durationMonths: number; paymentMethod: PaymentMethod }) =>
      orderService.create(data),
    onSuccess: () => invalidateOrders(qc),
  });
  const accept = useMutation({ mutationFn: orderService.accept, onSuccess: () => invalidateOrders(qc) });
  const reject = useMutation({ mutationFn: orderService.reject, onSuccess: () => invalidateOrders(qc) });
  const submitPayment = useMutation({
    mutationFn: ({ id, paymentProofUrl }: { id: string; paymentProofUrl: string }) =>
      orderService.submitPayment(id, paymentProofUrl),
    onSuccess: () => invalidateOrders(qc),
  });
  const confirmPayment = useMutation({ mutationFn: orderService.confirmPayment, onSuccess: () => invalidateOrders(qc) });
  const rejectPayment = useMutation({ mutationFn: orderService.rejectPayment, onSuccess: () => invalidateOrders(qc) });
  const cancel = useMutation({ mutationFn: orderService.cancel, onSuccess: () => invalidateOrders(qc) });
  const complete = useMutation({ mutationFn: orderService.complete, onSuccess: () => invalidateOrders(qc) });

  return {
    createOrder: create.mutateAsync,
    isCreating: create.isPending,
    acceptOrder: accept.mutate,
    rejectOrder: reject.mutate,
    submitPayment: submitPayment.mutateAsync,
    isSubmittingPayment: submitPayment.isPending,
    confirmPayment: confirmPayment.mutate,
    rejectPayment: rejectPayment.mutate,
    cancelOrder: cancel.mutate,
    completeOrder: complete.mutate,
    isMutating:
      accept.isPending ||
      reject.isPending ||
      submitPayment.isPending ||
      confirmPayment.isPending ||
      rejectPayment.isPending ||
      cancel.isPending ||
      complete.isPending,
  };
};

/** Admin: all orders. */
export const useAdminOrders = () => {
  const query = useQuery({ queryKey: ['admin-orders'], queryFn: orderService.all });
  return { orders: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
};
