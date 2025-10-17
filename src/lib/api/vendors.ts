import apiClient from './client';
import type { Vendor, CreateVendorData, UpdateVendorData } from '@/types/vendor.types';

export const vendorsApi = {
  getAll: async (search?: string): Promise<Vendor[]> => {
    const response = await apiClient.get('/vendors', { params: { search } });
    return response.data;
  },

  getById: async (id: string): Promise<Vendor> => {
    const response = await apiClient.get(`/vendors/${id}`);
    return response.data;
  },

  create: async (data: CreateVendorData): Promise<Vendor> => {
    const response = await apiClient.post('/vendors', data);
    return response.data;
  },

  update: async (id: string, data: UpdateVendorData): Promise<Vendor> => {
    const response = await apiClient.put(`/vendors/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/vendors/${id}`);
  },
};
