import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsApi } from '@/lib/api/vendors';
import type { CreateVendorData, UpdateVendorData } from '@/types/vendor.types';
import { toast } from './useToast';

export const useVendors = (search?: string) => {
  return useQuery({
    queryKey: ['vendors', search],
    queryFn: () => vendorsApi.getAll(search),
  });
};

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: () => vendorsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVendorData) => vendorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Vendor created',
        description: 'The vendor has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create vendor. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVendorData }) =>
      vendorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Vendor updated',
        description: 'The vendor has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update vendor. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vendorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Vendor deleted',
        description: 'The vendor has been deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete vendor. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
