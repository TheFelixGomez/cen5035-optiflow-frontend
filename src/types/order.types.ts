import { Vendor } from './vendor.types';

export type OrderStatus = 'pending' | 'in_progress' | 'completed';

export interface Order {
  id: string;
  vendorId: string;
  vendor?: Vendor;
  dueDate: string;
  status: OrderStatus;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  vendorId: string;
  dueDate: string;
  status: OrderStatus;
  instructions: string;
}

export interface UpdateOrderData extends Partial<CreateOrderData> {}

export interface OrderFilters {
  vendorId?: string;
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
