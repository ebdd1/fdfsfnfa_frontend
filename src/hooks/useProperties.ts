import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services/api/property.service';
import type { Property } from '../types';

export interface PropertyQueryParams {
  city?: string;
  status?: string;
  ownerId?: string;
  skip?: number;
  take?: number;
}

export const useProperties = (params?: PropertyQueryParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['properties', params],
    queryFn: () => propertyService.getAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Property>) => propertyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  return {
    ...query,
    properties: query.data?.data || [],
    meta: query.data?.meta,
    createProperty: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};

export const useProperty = (id: string | undefined) => {
  const query = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getById(id as string),
    enabled: !!id,
  });

  return {
    ...query,
    property: query.data,
  };
};
