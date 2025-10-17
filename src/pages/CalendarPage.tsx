import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CalendarView from '@/components/calendar/CalendarView';
import CalendarLegend from '@/components/calendar/CalendarLegend';
import CalendarFilters from '@/components/calendar/CalendarFilters';
import OrderDetails from '@/components/orders/OrderDetails';
import OrderForm from '@/components/orders/OrderForm';
import { useCreateOrder } from '@/hooks/useOrders';
import type { Order, OrderStatus } from '@/types/order.types';
import { format } from 'date-fns';

export default function CalendarPage() {
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [vendorId, setVendorId] = useState('all');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const createOrder = useCreateOrder();

  const handleEventClick = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsCreateOpen(true);
  };

  const handleCreate = (data: any) => {
    createOrder.mutate(data, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setSelectedDate(null);
      },
    });
  };

  const handleResetFilters = () => {
    setStatus('all');
    setVendorId('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Schedule and manage production tasks</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <CalendarFilters
        status={status}
        onStatusChange={setStatus}
        vendorId={vendorId}
        onVendorChange={setVendorId}
        onReset={handleResetFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <CalendarView
            statusFilter={status}
            vendorFilter={vendorId}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
          />
        </div>
        <div className="lg:col-span-1">
          <CalendarLegend />
        </div>
      </div>

      {/* View Order Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <OrderForm
            onSubmit={handleCreate}
            onCancel={() => {
              setIsCreateOpen(false);
              setSelectedDate(null);
            }}
            isLoading={createOrder.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
