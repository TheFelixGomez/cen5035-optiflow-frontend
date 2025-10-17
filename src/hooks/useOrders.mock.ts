import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Order, OrderStatus } from '@/types/order.types';
import { toast } from './useToast';
import { mockOrders } from '@/lib/mockData';

interface OrderFilters {
  status?: OrderStatus;
  vendorId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      let filtered = [...mockOrders];

      if (filters?.status) {
        filtered = filtered.filter(o => o.status === filters.status);
      }
      if (filters?.vendorId) {
        filtered = filtered.filter(o => o.vendorId === filters.vendorId);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(o => 
          o.id.toLowerCase().includes(search) ||
          o.vendor?.name.toLowerCase().includes(search) ||
          o.instructions.toLowerCase().includes(search)
        );
      }
      if (filters?.dateFrom) {
        filtered = filtered.filter(o => o.dueDate >= filters.dateFrom!);
      }
      if (filters?.dateTo) {
        filtered = filtered.filter(o => o.dueDate <= filters.dateTo!);
      }

      return filtered;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'vendor'>) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const vendor = mockOrders[0].vendor; // Get vendor from mockData
      const newOrder: Order = {
        ...data,
        id: String(Date.now()),
        vendor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockOrders.push(newOrder);
      return newOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Success',
        description: 'Order created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create order',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Order> }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockOrders.findIndex(o => o.id === id);
      if (index !== -1) {
        mockOrders[index] = { ...mockOrders[index], ...data, updatedAt: new Date().toISOString() };
        return mockOrders[index];
      }
      throw new Error('Order not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Success',
        description: 'Order updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockOrders.findIndex(o => o.id === id);
      if (index !== -1) {
        mockOrders.splice(index, 1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete order',
        variant: 'destructive',
      });
    },
  });
}
