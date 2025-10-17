import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import OrderStatusBadge from './OrderStatusBadge';
import { useOrders, useDeleteOrder } from '@/hooks/useOrders';
import type { Order, OrderFilters } from '@/types/order.types';
import { format } from 'date-fns';

interface OrderListProps {
  filters: OrderFilters;
  onEdit: (order: Order) => void;
  onView: (order: Order) => void;
}

export default function OrderList({ filters, onEdit, onView }: OrderListProps) {
  const { data: orders, isLoading, error } = useOrders(filters);
  const deleteOrder = useDeleteOrder();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleEdit = () => {
    if (selectedOrder) {
      setDetailsOpen(false);
      onEdit(selectedOrder);
    }
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setDetailsOpen(false);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      deleteOrder.mutate(orderToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setOrderToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading orders...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">Error loading orders. Please try again.</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 text-lg mb-2">No orders found</div>
            <p className="text-gray-400 text-sm">
              {Object.keys(filters).length > 0
                ? 'Try adjusting your filters'
                : 'Get started by creating your first order'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow 
                  key={order.id}
                  className="cursor-pointer hover:bg-amber-50 transition-colors"
                  onClick={() => handleRowClick(order)}
                >
                  <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{order.vendor?.name || 'Unknown Vendor'}</TableCell>
                  <TableCell>{format(new Date(order.dueDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Order ID</label>
                  <p className="mt-1 text-gray-900">#{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <OrderStatusBadge status={selectedOrder.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Vendor</label>
                  <p className="mt-1 text-gray-900">{selectedOrder.vendor?.name || 'Unknown Vendor'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <p className="mt-1 text-gray-900">{format(new Date(selectedOrder.dueDate), 'MMM dd, yyyy')}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Instructions</label>
                  <p className="mt-1 text-gray-900">{selectedOrder.instructions}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-gray-600 text-sm">{format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="mt-1 text-gray-600 text-sm">{format(new Date(selectedOrder.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="text-primary hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteClick(selectedOrder)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete order <strong>#{orderToDelete?.id.slice(0, 8)}</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteOrder.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteOrder.isPending}
            >
              {deleteOrder.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
