import apiClient from './client';
import type { Order, OrderStatus } from '@/types/order.types';

export interface CalendarRange {
  start: string;
  end: string;
}

interface CalendarApiResponse {
  id: string;
  vendor_id: string;
  order_date: string;
  status: OrderStatus;
  total_amount: number;
  special_instructions?: string | null;
  due_at?: string | null;
}

export const calendarApi = {
  async getRange(range: CalendarRange): Promise<Order[]> {
    const { data } = await apiClient.get<CalendarApiResponse[]>('/calendar', {
      params: {
        start: range.start,
        end: range.end,
      },
    });
    return data.map((order) => ({
      id: order.id,
      vendorId: order.vendor_id,
      vendor: undefined,
      dueDate: order.due_at ?? order.order_date,
      status: order.status,
      instructions: order.special_instructions ?? '',
      createdAt: order.order_date,
      updatedAt: order.order_date,
    }));
  },

  async updateDueDate(orderId: string, newDueAt: string) {
    await apiClient.put(`/calendar/${orderId}`, {
      new_due_at: newDueAt,
    });
  },
};
