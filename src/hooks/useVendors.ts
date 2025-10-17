import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { vendorsApi } from '@/lib/api/vendors';
import type { Vendor } from '@/types/vendor.types';
import { toast } from './useToast';
import { mockVendors } from '@/lib/mockData';

export function useVendors(search?: string) {
  // MOCK DATA - Comment out for real API
  return useQuery({
    queryKey: ['vendors', search],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      if (search) {
        return mockVendors.filter(v => 
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      return mockVendors;
    },
  });

  // REAL API - Uncomment when backend is ready
  // return useQuery({
  //   queryKey: ['vendors', search],
  //   queryFn: () => vendorsApi.getAll(search),
  // });
};

export const useVendor = (id: string) => {
  // MOCK DATA
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockVendors.find(v => v.id === id) || null;
    },
    enabled: !!id,
  });
  
  // REAL API - Uncomment when backend is ready
  // return useQuery({
  //   queryKey: ['vendor', id],
  //   queryFn: () => vendorsApi.getById(id),
  //   enabled: !!id,
  // });
};

export function useCreateVendor() {
  const queryClient = useQueryClient();

  // MOCK DATA - Comment out for real API
  return useMutation({
    mutationFn: async (data: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newVendor: Vendor = {
        ...data,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockVendors.push(newVendor);
      return newVendor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Success',
        description: 'Vendor created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create vendor',
        variant: 'destructive',
      });
    },
  });

  // REAL API - Uncomment when backend is ready
  // return useMutation({
  //   mutationFn: vendorsApi.create,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['vendors'] });
  //     toast({
  //       title: 'Success',
  //       description: 'Vendor created successfully',
  //     });
  //   },
  //   onError: () => {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to create vendor',
  //       variant: 'destructive',
  //     });
  //   },
  // });
};

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  // MOCK DATA - Comment out for real API
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Vendor> }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockVendors.findIndex(v => v.id === id);
      if (index !== -1) {
        mockVendors[index] = { ...mockVendors[index], ...data, updatedAt: new Date().toISOString() };
        return mockVendors[index];
      }
      throw new Error('Vendor not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Success',
        description: 'Vendor updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update vendor',
        variant: 'destructive',
      });
    },
  });

  // REAL API - Uncomment when backend is ready
  // return useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: Partial<Vendor> }) =>
  //     vendorsApi.update(id, data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['vendors'] });
  //     toast({
  //       title: 'Success',
  //       description: 'Vendor updated successfully',
  //     });
  //   },
  //   onError: () => {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to update vendor',
  //       variant: 'destructive',
  //     });
  //   },
  // });
};

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  // MOCK DATA - Comment out for real API
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockVendors.findIndex(v => v.id === id);
      if (index !== -1) {
        mockVendors.splice(index, 1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Success',
        description: 'Vendor deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete vendor',
        variant: 'destructive',
      });
    },
  });

  // REAL API - Uncomment when backend is ready
  // return useMutation({
  //   mutationFn: vendorsApi.delete,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['vendors'] });
  //     toast({
  //       title: 'Success',
  //       description: 'Vendor deleted successfully',
  //     });
  //   },
  //   onError: () => {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to delete vendor',
  //       variant: 'destructive',
  //     });
  //   },
  // });
};
