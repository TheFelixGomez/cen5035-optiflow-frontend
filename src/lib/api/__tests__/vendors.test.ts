import { describe, it, expect, vi, beforeEach } from 'vitest';
import { vendorsApi } from '../vendors';
import apiClient from '../client';
import type { CreateVendorData, UpdateVendorData } from '@/types/vendor.types';

vi.mock('../client');

describe('vendorsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockVendor = {
    id: 'vendor-1',
    name: 'Test Vendor',
    contactPerson: 'John Doe',
    email: 'john@vendor.com',
    phone: '555-1234',
    address: '123 Main St',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  };

  describe('getAll', () => {
    it('calls GET /vendors without search', async () => {
      const mockResponse = { data: [mockVendor] };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await vendorsApi.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/vendors', { params: { search: undefined } });
      expect(result).toEqual([mockVendor]);
    });

    it('calls GET /vendors with search query', async () => {
      const mockResponse = { data: [mockVendor] };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await vendorsApi.getAll('Test');

      expect(apiClient.get).toHaveBeenCalledWith('/vendors', { params: { search: 'Test' } });
      expect(result).toEqual([mockVendor]);
    });
  });

  describe('getById', () => {
    it('calls GET /vendors/:id', async () => {
      const mockResponse = { data: mockVendor };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await vendorsApi.getById('vendor-1');

      expect(apiClient.get).toHaveBeenCalledWith('/vendors/vendor-1');
      expect(result).toEqual(mockVendor);
    });

    it('throws error when vendor not found', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Vendor not found'));

      await expect(vendorsApi.getById('invalid-id')).rejects.toThrow('Vendor not found');
    });
  });

  describe('create', () => {
    it('calls POST /vendors with vendor data', async () => {
      const createData: CreateVendorData = {
        name: 'New Vendor',
        contactPerson: 'Jane Smith',
        email: 'jane@vendor.com',
        phone: '555-5678',
        address: '456 Oak Ave',
      };

      const mockResponse = { data: { ...mockVendor, ...createData } };
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await vendorsApi.create(createData);

      expect(apiClient.post).toHaveBeenCalledWith('/vendors', createData);
      expect(result).toEqual(mockResponse.data);
    });

    it('throws error on validation failure', async () => {
      const createData: CreateVendorData = {
        name: '',
        contactPerson: 'Test',
        email: 'invalid-email',
        phone: '123',
        address: 'Test',
      };

      vi.mocked(apiClient.post).mockRejectedValue(new Error('Validation failed'));

      await expect(vendorsApi.create(createData)).rejects.toThrow('Validation failed');
    });
  });

  describe('update', () => {
    it('calls PUT /vendors/:id with update data', async () => {
      const updateData: UpdateVendorData = {
        phone: '555-9999',
        address: '789 Pine Rd',
      };

      const updatedVendor = { ...mockVendor, ...updateData };
      const mockResponse = { data: updatedVendor };
      vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

      const result = await vendorsApi.update('vendor-1', updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/vendors/vendor-1', updateData);
      expect(result).toEqual(updatedVendor);
    });

    it('throws error when vendor not found', async () => {
      const updateData: UpdateVendorData = { phone: '555-0000' };

      vi.mocked(apiClient.put).mockRejectedValue(new Error('Vendor not found'));

      await expect(vendorsApi.update('invalid-id', updateData)).rejects.toThrow('Vendor not found');
    });
  });

  describe('delete', () => {
    it('calls DELETE /vendors/:id', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: undefined });

      await vendorsApi.delete('vendor-1');

      expect(apiClient.delete).toHaveBeenCalledWith('/vendors/vendor-1');
    });

    it('throws error when vendor not found', async () => {
      vi.mocked(apiClient.delete).mockRejectedValue(new Error('Vendor not found'));

      await expect(vendorsApi.delete('invalid-id')).rejects.toThrow('Vendor not found');
    });
  });
});
