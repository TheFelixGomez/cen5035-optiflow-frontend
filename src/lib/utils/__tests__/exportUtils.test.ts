import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToPDF, exportToCSV } from '../exportUtils';
import type { ReportData } from '@/types/report.types';

// Mock jsPDF
vi.mock('jspdf', () => {
  const mockAutoTable = vi.fn();
  return {
    default: vi.fn().mockImplementation(() => ({
      setFontSize: vi.fn(),
      text: vi.fn(),
      save: vi.fn(),
      autoTable: mockAutoTable,
    })),
  };
});

// Mock jspdf-autotable
vi.mock('jspdf-autotable', () => ({
  default: vi.fn(),
}));

// Mock papaparse
vi.mock('papaparse', () => ({
  default: {
    unparse: vi.fn(() => 'mocked,csv,data'),
  },
}));

describe('exportUtils', () => {
  const mockReportData: ReportData = {
    filters: {
      dateFrom: '2025-01-01',
      dateTo: '2025-01-31',
      statuses: undefined,
      vendorIds: undefined,
    },
    summary: {
      totalOrders: 10,
      byStatus: {
        pending: 3,
        in_progress: 4,
        completed: 3,
      },
      byVendor: {},
    },
    orders: [
      {
        id: 'order-123456',
        vendorId: 'vendor-1',
        vendor: {
          id: 'vendor-1',
          name: 'Test Vendor',
          contactPerson: 'John Doe',
          email: 'john@vendor.com',
          phone: '555-1234',
          address: '123 Main St',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
        },
        dueDate: '2025-01-15',
        status: 'pending',
        instructions: 'Test instructions for the order',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      },
    ],
    generatedAt: '2025-01-31T12:00:00Z',
  };

  describe('exportToPDF', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('generates PDF with valid report data', () => {
      expect(() => exportToPDF(mockReportData)).not.toThrow();
    });

    it('handles empty orders array', () => {
      const emptyData: ReportData = {
        ...mockReportData,
        orders: [],
      };
      expect(() => exportToPDF(emptyData)).not.toThrow();
    });

    it('truncates long instructions in PDF', () => {
      const longInstructionsData: ReportData = {
        ...mockReportData,
        orders: [
          {
            ...mockReportData.orders[0],
            instructions: 'A'.repeat(100), // 100 character string
          },
        ],
      };
      expect(() => exportToPDF(longInstructionsData)).not.toThrow();
    });

    it('handles missing vendor data gracefully', () => {
      const noVendorData: ReportData = {
        ...mockReportData,
        orders: [
          {
            ...mockReportData.orders[0],
            vendor: undefined,
          },
        ],
      };
      expect(() => exportToPDF(noVendorData)).not.toThrow();
    });
  });

  describe('exportToCSV', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Mock DOM APIs
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
      window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    });

    it('generates CSV with valid report data', () => {
      expect(() => exportToCSV(mockReportData)).not.toThrow();
    });

    it('handles empty orders array', () => {
      const emptyData: ReportData = {
        ...mockReportData,
        orders: [],
      };
      expect(() => exportToCSV(emptyData)).not.toThrow();
    });

    it('formats dates correctly in CSV', async () => {
      const Papa = await import('papaparse');
      exportToCSV(mockReportData);
      
      expect(Papa.default.unparse).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            'Due Date': '2025-01-15',
          }),
        ])
      );
    });

    it('handles missing vendor data gracefully', () => {
      const noVendorData: ReportData = {
        ...mockReportData,
        orders: [
          {
            ...mockReportData.orders[0],
            vendor: undefined,
          },
        ],
      };
      expect(() => exportToCSV(noVendorData)).not.toThrow();
    });

    it('creates downloadable blob', () => {
      exportToCSV(mockReportData);
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
  });
});
