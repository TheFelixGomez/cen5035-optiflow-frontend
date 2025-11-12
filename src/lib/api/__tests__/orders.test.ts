import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ordersApi } from '../orders';
import apiClient from '../client';
import type { CreateOrderData, UpdateOrderData, OrderFilters } from '@/types/order.types';

vi.mock('../client');

describe('ordersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOrder = {
    id: 'order-1',
    vendorId: 'vendor-1',
    dueDate: '2025-01-15',
    status: 'pending' as const,
    instructions: 'Test instructions',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  };

  describe('getAll', () => {
    it('calls GET /orders without filters', async () => {
      const mockResponse = { data: [mockOrder] };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await ordersApi.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/orders', { params: undefined });
      expect(result).toEqual([mockOrder]);
    });

    it('calls GET /orders with filters', async () => {
      const filters: OrderFilters = {
        status: 'pending',
        vendorId: 'vendor-1',
        dateFrom: '2025-01-01',
        dateTo: '2025-01-31',
      };

      const mockResponse = { data: [mockOrder] };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await ordersApi.getAll(filters);

      expect(apiClient.get).toHaveBeenCalledWith('/orders', { params: filters });
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('getById', () => {
    it('calls GET /orders/:id', async () => {
      const mockResponse = { data: mockOrder };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await ordersApi.getById('order-1');

      expect(apiClient.get).toHaveBeenCalledWith('/orders/order-1');
      expect(result).toEqual(mockOrder);
    });

    it('throws error when order not found', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Order not found'));

      await expect(ordersApi.getById('invalid-id')).rejects.toThrow('Order not found');
    });
  });

  describe('create', () => {
    it('calls POST /orders with order data', async () => {
      const createData: CreateOrderData = {
        vendorId: 'vendor-1',
        dueDate: '2025-01-15',
        status: 'pending',
        instructions: 'Test instructions',
      };

      const mockResponse = { data: mockOrder };
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await ordersApi.create(createData);

      expect(apiClient.post).toHaveBeenCalledWith('/orders', createData);
      expect(result).toEqual(mockOrder);
    });

    it('throws error on validation failure', async () => {
      const createData: CreateOrderData = {
        vendorId: '',
        dueDate: '2025-01-15',
        status: 'pending',
        instructions: 'Test',
      };

      vi.mocked(apiClient.post).mockRejectedValue(new Error('Validation failed'));

      await expect(ordersApi.create(createData)).rejects.toThrow('Validation failed');
    });
  });

  describe('update', () => {
    it('calls PUT /orders/:id with update data', async () => {
      const updateData: UpdateOrderData = {
        status: 'completed',
        instructions: 'Updated instructions',
      };

      const updatedOrder = { ...mockOrder, ...updateData };
      const mockResponse = { data: updatedOrder };
      vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

      const result = await ordersApi.update('order-1', updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/orders/order-1', updateData);
      expect(result).toEqual(updatedOrder);
    });

    it('throws error when order not found', async () => {
      const updateData: UpdateOrderData = { status: 'completed' };

      vi.mocked(apiClient.put).mockRejectedValue(new Error('Order not found'));

      await expect(ordersApi.update('invalid-id', updateData)).rejects.toThrow('Order not found');
    });
  });

  describe('delete', () => {
    it('calls DELETE /orders/:id', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: undefined });

      await ordersApi.delete('order-1');

      expect(apiClient.delete).toHaveBeenCalledWith('/orders/order-1');
    });

    it('throws error when order not found', async () => {
      vi.mocked(apiClient.delete).mockRejectedValue(new Error('Order not found'));

      await expect(ordersApi.delete('invalid-id')).rejects.toThrow('Order not found');
    });
  });
});
