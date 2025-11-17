// import { useState } from 'react';
// import { Plus } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import OrderList from '@/components/orders/OrderList';
// import OrderForm from '@/components/orders/OrderForm';
// import OrderDetails from '@/components/orders/OrderDetails';
// import OrderFilters from '@/components/orders/OrderFilters';
// import { useCreateOrder, useUpdateOrder } from '@/hooks/useOrders';
// import { useDebounce } from '@/hooks/useDebounce';
// import type { Order, OrderStatus, OrderFilters as OrderFiltersType } from '@/types/order.types';

// export default function OrdersPage() {
//   const [search, setSearch] = useState('');
//   const [status, setStatus] = useState<OrderStatus | 'all'>('all');
//   const [vendorId, setVendorId] = useState('all');
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   const debouncedSearch = useDebounce(search, 300);
//   const createOrder = useCreateOrder();
//   const updateOrder = useUpdateOrder();

//   const filters: OrderFiltersType = {
//     search: debouncedSearch || undefined,
//     status: status !== 'all' ? status : undefined,
//     vendorId: vendorId !== 'all' ? vendorId : undefined,
//   };

//   const handleCreate = (data: any) => {
//     createOrder.mutate(data, {
//       onSuccess: () => {
//         setIsCreateOpen(false);
//       },
//     });
//   };

//   const handleEdit = (order: Order) => {
//     setSelectedOrder(order);
//     setIsEditOpen(true);
//   };

//   const handleUpdate = (data: any) => {
//     if (selectedOrder) {
//       updateOrder.mutate(
//         { id: selectedOrder.id, data },
//         {
//           onSuccess: () => {
//             setIsEditOpen(false);
//             setSelectedOrder(null);
//           },
//         }
//       );
//     }
//   };

//   const handleView = (order: Order) => {
//     setSelectedOrder(order);
//     setIsViewOpen(true);
//   };

//   const handleResetFilters = () => {
//     setSearch('');
//     setStatus('all');
//     setVendorId('all');
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
//           <p className="text-gray-600">Manage production orders</p>
//         </div>
//         <Button onClick={() => setIsCreateOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Create Order
//         </Button>
//       </div>

//       <OrderFilters
//         search={search}
//         onSearchChange={setSearch}
//         status={status}
//         onStatusChange={setStatus}
//         vendorId={vendorId}
//         onVendorChange={setVendorId}
//         onReset={handleResetFilters}
//       />

//       <OrderList filters={filters} onEdit={handleEdit} onView={handleView} />

//       {/* Create Order Dialog */}
//       <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Create New Order</DialogTitle>
//           </DialogHeader>
//           <OrderForm
//             onSubmit={handleCreate}
//             onCancel={() => setIsCreateOpen(false)}
//             isLoading={createOrder.isPending}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Edit Order Dialog */}
//       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Edit Order</DialogTitle>
//           </DialogHeader>
//           {selectedOrder && (
//             <OrderForm
//               order={selectedOrder}
//               onSubmit={handleUpdate}
//               onCancel={() => {
//                 setIsEditOpen(false);
//                 setSelectedOrder(null);
//               }}
//               isLoading={updateOrder.isPending}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* View Order Dialog */}
//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Order Details</DialogTitle>
//           </DialogHeader>
//           {selectedOrder && <OrderDetails order={selectedOrder} />}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import axios from "axios";

// TYPES
type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type RawOrder = {
  _id: string;
  vendor_id: string;
  order_date: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
};

type Order = {
  id: string;
  vendor_id: string;
  order_date: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // FETCH orders
  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/`
        );

        const normalized: Order[] = (res.data as RawOrder[]).map((o) => ({
          id: o._id,
          vendor_id: o.vendor_id,
          order_date: o.order_date,
          status: o.status,
          total_amount: o.total_amount,
          items: o.items,
        }));

        setOrders(normalized);
        setFiltered(normalized);
      } catch {
        console.log("No orders or backend not ready");
        setOrders([]);
        setFiltered([]);
      }
    }

    loadOrders();
  }, []);

  // SEARCH + STATUS FILTER
  useEffect(() => {
    let result = [...orders];

    // STATUS FILTER
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // TEXT SEARCH
    const q = search.toLowerCase();
    result = result.filter(
      (o) =>
        o.vendor_id.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
    );

    setFiltered(result);
    setCurrentPage(1);
  }, [search, statusFilter, orders]);

  // Pagination calc
  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">Orders</h1>

      {/* CONTROLS: Search + Status filter */}
      <div className="flex gap-4 items-center flex-wrap">

        {/* SEARCH BAR */}
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm"
        />

        {/* STATUS FILTER DROPDOWN */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Order ID</th>
              <th className="py-2 text-left">Vendor</th>
              <th className="py-2 text-left">Order Date</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Total</th>
              <th className="py-2 text-left">Items</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              pageItems.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-2">{order.id}</td>
                  <td className="py-2">{order.vendor_id}</td>
                  <td className="py-2">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="py-2 capitalize">{order.status.replace("_", " ")}</td>
                  <td className="py-2">${order.total_amount.toFixed(2)}</td>
                  <td className="py-2">{order.items.length} items</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-4 space-x-3">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
