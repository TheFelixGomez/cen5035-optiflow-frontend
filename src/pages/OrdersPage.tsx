import { useEffect, useState } from "react";
import { useAuth } from "@/stores/auth.store";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/api/client";

// TYPES
type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type RawOrder = {
  _id: string;
  vendor_id: string;
  user_id?: string;
  order_date: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
};

type Order = {
  id: string;
  vendor_id: string;
  user_id?: string;
  order_date: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
};

type RawVendor = {
  _id: string;
  company: string;
};

export default function OrdersPage() {
  const { role, user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<RawVendor[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;


  // LOAD VENDORS + ORDERS
  useEffect(() => {
    async function loadData() {
      try {
        // FETCH vendors first
        const vendorsRes = await apiClient.get(
          `${import.meta.env.VITE_API_URL}/vendors`
        );
        setVendors(vendorsRes.data);

        // FETCH orders
        const ordersRes = await apiClient.get(
          `${import.meta.env.VITE_API_URL}/orders`
        );

        const normalized: Order[] = (ordersRes.data as RawOrder[]).map((o) => ({
          id: o._id,
          vendor_id: o.vendor_id,
          user_id: o.user_id,
          order_date: o.order_date,
          status: o.status,
          total_amount: o.total_amount,
          items: o.items,
        }));

        const finalData =
          role === "admin"
            ? normalized
            : normalized.filter((o) => o.user_id === user?.id);

        setOrders(finalData);
        setFiltered(finalData);
      } catch {
        setOrders([]);
        setFiltered([]);
        setVendors([]);
      }
    }

    loadData();
  }, [role, user?.id]);

  // ---------------------------------------------
  // FILTERS
  // ---------------------------------------------
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

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



  // CREATE ORDER (REAL VENDOR REQUIRED)
  async function handleCreateOrder() {
    try {
      // If NO vendors → stop and show message
      if (vendors.length === 0) {
        alert("No vendors found. Please create vendors first!");
        return;
      }

      // Use FIRST vendor in the DB
      const vendorId = vendors[0]._id;

      await apiClient.post(`${import.meta.env.VITE_API_URL}/orders`, {
        vendor_id: vendorId,
        status: "pending",
        order_date: new Date().toISOString(),
        items: [{ name: "New Item", price: 10, quantity: 1 }],
      });

      window.location.reload();
    } catch {
      alert("Failed to create order — check backend and vendor list.");
    }
  }

  return (
    <div className="space-y-6">

      {/* HEADER + CREATE BUTTON */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Orders</h1>

        <button
          onClick={handleCreateOrder}
          className="px-4 py-2 bg-white text-black border border-gray-300 rounded shadow hover:bg-gray-100 transition"
        >
          + Create Order
        </button>
      </div>

      {/* SEARCH + STATUS FILTER */}
      <div className="flex gap-4 items-center flex-wrap">
        {/* SEARCH */}
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm text-black"
        />

        {/* STATUS FILTER */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] text-black">
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
        <table className="w-full text-sm text-black">
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
                  <td className="py-2 capitalize">
                    {order.status.replace("_", " ")}
                  </td>
                  <td className="py-2">
                    ${order.total_amount.toFixed(2)}
                  </td>
                  <td className="py-2">{order.items.length} items</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-4 space-x-3 text-black">
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
