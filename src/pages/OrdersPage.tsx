
import { useEffect, useState, type ChangeEvent } from "react";
import { useAuth } from "@/stores/auth.store";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import apiClient from "@/lib/api/client";

// BACKEND TYPES
type OrderItem = {
  product_name: string;
  price: number;
  quantity: number;
};

type RawOrder = {
  id: string;
  vendor_id: string;
  user_id?: string;
  order_date: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
  special_instructions?: string | null;
  due_at?: string | null;
};

type Order = RawOrder;

type Vendor = {
  id: string;
  name: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
};

export default function OrdersPage() {
  const { role } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const apiBase = import.meta.env.VITE_API_URL;

  const getVendorName = (vendorId: string): string => {
    const vendor = vendors.find((v) => v.id === vendorId);
    return vendor ? vendor.name : "Unknown vendor";
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [vendorsRes, productsRes, ordersRes] = await Promise.all([
          apiClient.get(`${apiBase}/vendors`),
          apiClient.get(`${apiBase}/products`),
          apiClient.get(`${apiBase}/orders`),
        ]);

        setVendors(vendorsRes.data as Vendor[]);
        setProducts(productsRes.data as Product[]);
        setOrders(ordersRes.data as Order[]);
      } catch {
        setVendors([]);
        setProducts([]);
        setOrders([]);
      }
    }

    loadData();
  }, [apiBase, role]);

  const filteredOrders = orders.filter((o) => {
    const vendorName = getVendorName(o.vendor_id).toLowerCase();
    const searchLower = search.toLowerCase();

    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;
    const matchesSearch =
      vendorName.includes(searchLower) ||
      o.status.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filteredOrders.slice(start, start + pageSize);

  const toggleProductSelection = (id: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const buildItems = (): OrderItem[] | null => {
    if (selectedProductIds.length === 0) {
      alert("Please select at least one product.");
      return null;
    }

    const items: OrderItem[] = selectedProductIds
      .map((pid) => {
        const product = products.find((p) => p.id === pid);
        if (!product) return null;
        return {
          product_name: product.title,
          price: product.price,
          quantity: 1,
        };
      })
      .filter((item): item is OrderItem => item !== null);

    if (items.length === 0) {
      alert("Selected products are invalid.");
      return null;
    }

    return items;
  };

  async function handleCreateOrder() {
    if (!selectedVendorId) {
      alert("Please select a vendor first.");
      return;
    }

    const items = buildItems();
    if (!items) return;

    const now = new Date();
    const dueAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    try {
      await apiClient.post(`${apiBase}/orders`, {
        vendor_id: selectedVendorId,
        status: "pending",
        items,
        special_instructions: specialInstructions.trim()
          ? specialInstructions.trim()
          : undefined,
        due_at: dueAt.toISOString(),
      });

      setShowProductsModal(false);
      setShowVendorModal(false);
      setSelectedVendorId("");
      setSelectedProductIds([]);
      setSpecialInstructions("");
      setEditingOrderId(null);
      window.location.reload();
    } catch {
      alert("Failed to create/update order. Backend rejected payload.");
    }
  }

  async function handleUpdateOrder() {
    if (!editingOrderId) return;

    const items = buildItems();
    if (!items) return;

    try {
      await apiClient.put(`${apiBase}/orders/${editingOrderId}`, {
        items,
        special_instructions: specialInstructions.trim()
          ? specialInstructions.trim()
          : undefined,
      });

      setShowProductsModal(false);
      setEditingOrderId(null);
      setSelectedProductIds([]);
      setSpecialInstructions("");
      window.location.reload();
    } catch {
      alert("Failed to create/update order. Backend rejected payload.");
    }
  }

  async function handleDeleteOrder(orderId: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      await apiClient.delete(`${apiBase}/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch {
      alert("Failed to delete order.");
    }
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      await apiClient.put(`${apiBase}/orders/${orderId}`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch {
      alert("Failed to update status.");
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER + CREATE BUTTON */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Orders</h1>

        <button
          onClick={() => {
            setEditingOrderId(null);
            setSelectedProductIds([]);
            setSpecialInstructions("");
            setShowVendorModal(true);
          }}
          className="px-4 py-2 bg-white text-black border border-gray-300 rounded shadow hover:bg-gray-100 transition"
        >
          + Create Order
        </button>
      </div>

      {/* SEARCH + STATUS FILTER */}
      <div className="flex gap-4 items-center flex-wrap">
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="w-full max-w-sm text-black"
        />

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
              {role === "admin" && (
                <th className="py-2 text-left">User</th>
              )}
              <th className="py-2 text-left">Order ID</th>
              <th className="py-2 text-left">Vendor</th>
              <th className="py-2 text-left">Items</th>
              <th className="py-2 text-left">Order Date</th>
              <th className="py-2 text-left">Due Date</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Total</th>
              <th className="py-2 text-left">Notes</th>
              <th className="py-2 text-left">Edit</th>
              <th className="py-2 text-left">Delete</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={role === "admin" ? 11 : 10}
                  className="py-4 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              pageItems.map((order) => (
                <tr key={order.id} className="border-b">

                  {role === "admin" && (
                    <td className="py-2">
                      {order.user_id ?? "-"}
                    </td>
                  )}

                  <td className="py-2">{order.id}</td>
                  <td className="py-2">
                    {getVendorName(order.vendor_id)}
                  </td>
                  <td className="py-2">{order.items.length}</td>
                  <td className="py-2">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>

                  <td className="py-2">
                    {order.due_at
                      ? new Date(order.due_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="py-2 capitalize">
                    {role === "admin" ? (
                      <Select
                        value={order.status}
                        onValueChange={(val) =>
                          handleStatusChange(order.id, val)
                        }
                      >
                        <SelectTrigger className="w-[140px] text-black">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      order.status.replace("_", " ")
                    )}
                  </td>

                  <td className="py-2">
                    ${order.total_amount.toFixed(2)}
                  </td>

                  <td className="py-2">
                    {order.special_instructions
                      ? order.special_instructions
                      : "-"}
                  </td>

                  {/* ✅ EDIT DISABLED IF COMPLETED */}
                  <td className="py-2">
                    {order.status === "completed" ? (
                      <Pencil
                        size={16}
                        className="text-gray-400 cursor-not-allowed opacity-40"
                      />
                    ) : (
                      <Pencil
                        size={16}
                        className="text-gray-600 cursor-pointer hover:text-gray-900"
                        onClick={() => {
                          setEditingOrderId(order.id);
                          setSelectedVendorId(order.vendor_id);
                          const selectedIds = products
                            .filter((p) =>
                              order.items.some(
                                (item) => item.product_name === p.title
                              )
                            )
                            .map((p) => p.id);
                          setSelectedProductIds(selectedIds);
                          setSpecialInstructions(
                            order.special_instructions ?? ""
                          );
                          setShowProductsModal(true);
                        }}
                      />
                    )}
                  </td>

                  {/* DELETE DISABLED IF COMPLETED */}
                  <td className="py-2">
                    {order.status === "completed" ? (
                      <Trash2
                        size={16}
                        className="text-gray-400 cursor-not-allowed opacity-40"
                      />
                    ) : (
                      <Trash2
                        size={16}
                        className="text-gray-600 cursor-pointer hover:text-gray-900"
                        onClick={() => handleDeleteOrder(order.id)}
                      />
                    )}
                  </td>
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

      {/* MODAL: SELECT VENDOR */}
      {showVendorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-md w-[380px] space-y-4">
            <h2 className="text-lg font-bold text-black">Select Vendor</h2>

            <Select
              value={selectedVendorId}
              onValueChange={setSelectedVendorId}
            >
              <SelectTrigger className="w-full text-black">
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowVendorModal(false);
                  setSelectedVendorId("");
                  setSelectedProductIds([]);
                  setSpecialInstructions("");
                  setEditingOrderId(null);
                }}
                className="px-3 py-1 border rounded text-black hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedVendorId) {
                    alert("Please select a vendor first.");
                    return;
                  }
                  setShowVendorModal(false);
                  setShowProductsModal(true);
                }}
                className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SELECT PRODUCTS + NOTES */}
      {showProductsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-md w-[420px] space-y-4">
            <h2 className="text-lg font-bold text-black">
              Select Products
            </h2>

            <div className="max-h-56 overflow-y-auto border rounded p-2 space-y-2">
              {products.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No products available.
                </p>
              ) : (
                products.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center justify-between text-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(p.id)}
                        onChange={() => toggleProductSelection(p.id)}
                      />
                      <span className="text-black">{p.title}</span>
                    </div>
                    <span className="text-gray-600">
                      ${p.price.toFixed(2)}
                    </span>
                  </label>
                ))
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-black">
                Notes (optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) =>
                  setSpecialInstructions(e.target.value)
                }
                className="w-full border rounded p-2 text-sm text-black"
                rows={3}
                maxLength={500}
                placeholder="Special instructions (up to ~50 words)..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  if (editingOrderId) {
                    setShowProductsModal(false);
                    setEditingOrderId(null);
                    setSelectedProductIds([]);
                    setSpecialInstructions("");
                  } else {
                    setShowProductsModal(false);
                    setShowVendorModal(true);
                  }
                }}
                className="px-3 py-1 border rounded text-black hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (editingOrderId) {
                    handleUpdateOrder();
                  } else {
                    handleCreateOrder();
                  }
                }}
                className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
