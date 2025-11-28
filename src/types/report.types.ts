import type { Order } from './order.types';

export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  vendorIds?: string[];
  statuses?: string[];
  userIds?: string[];
}

export interface ReportSummary {
  totalOrders: number;
  byStatus: {
    pending: number;
    in_progress: number;
    completed: number;
  };
  byVendor: Record<string, number>;
}

export interface ReportData {
  summary: ReportSummary;
  orders: Order[];
  filters: ReportFilters;
  generatedAt: string;
}
