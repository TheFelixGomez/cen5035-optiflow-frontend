import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrderList from '@/components/orders/OrderList';
import OrderForm from '@/components/orders/OrderForm';
import OrderDetails from '@/components/orders/OrderDetails';
import OrderFilters from '@/components/orders/OrderFilters';
import { useCreateOrder, useUpdateOrder } from '@/hooks/useOrders';
import { useDebounce } from '@/hooks/useDebounce';
import type { Order, OrderStatus, OrderFilters as OrderFiltersType } from '@/types/order.types';

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [vendorId, setVendorId] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();

  const filters: OrderFiltersType = {
    search: debouncedSearch || undefined,
    status: status !== 'all' ? status : undefined,
    vendorId: vendorId !== 'all' ? vendorId : undefined,
  };

  const handleCreate = (data: any) => {
    createOrder.mutate(data, {
      onSuccess: () => {
        setIsCreateOpen(false);
      },
    });
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsEditOpen(true);
  };

  const handleUpdate = (data: any) => {
    if (selectedOrder) {
      updateOrder.mutate(
        { id: selectedOrder.id, data },
        {
          onSuccess: () => {
            setIsEditOpen(false);
            setSelectedOrder(null);
          },
        }
      );
    }
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('all');
    setVendorId('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage production orders</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <OrderFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        vendorId={vendorId}
        onVendorChange={setVendorId}
        onReset={handleResetFilters}
      />

      <OrderList filters={filters} onEdit={handleEdit} onView={handleView} />

      {/* Create Order Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <OrderForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={createOrder.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderForm
              order={selectedOrder}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedOrder(null);
              }}
              isLoading={updateOrder.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
