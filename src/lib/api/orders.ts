import apiClient from './client';
import type { Order, CreateOrderData, UpdateOrderData, OrderFilters } from '@/types/order.types';

export const ordersApi = {
  getAll: async (filters?: OrderFilters): Promise<Order[]> => {
    const response = await apiClient.get('/orders', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  update: async (id: string, data: UpdateOrderData): Promise<Order> => {
    const response = await apiClient.put(`/orders/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/orders/${id}`);
  },
};
