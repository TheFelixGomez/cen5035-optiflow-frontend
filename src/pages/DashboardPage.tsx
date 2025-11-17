import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  Clock,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = {
  pending: "#F59E0B",
  in_progress: "#3B82F6",
  completed: "#10B981",
};

// TYPES
type Order = {
  id: string;
  vendor_id: string;
  status: string;
  order_date: string;
  total_amount: number;
};

type Vendor = {
  id: string;
  company: string;
};

// Response types from backend
type RawOrder = {
  _id: string;
  vendor_id: string;
  status: string;
  order_date: string;
  total_amount?: number;
};

type RawVendor = {
  _id: string;
  company: string;
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    async function loadData() {
      // ---------- FETCH ORDERS ----------
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/`);
        const data: RawOrder[] = await res.json();

        const normalized: Order[] = data.map((o) => ({
          id: o._id,
          vendor_id: o.vendor_id,
          status: o.status,
          order_date: o.order_date,
          total_amount: o.total_amount ?? 0,
        }));

        setOrders(normalized);
      } catch {
        setOrders([]);
      }

      // ---------- FETCH VENDORS (if backend not ready, stays empty) ----------
      try {
        const resV = await fetch(`${import.meta.env.VITE_API_URL}/vendors/`);
        const dataV: RawVendor[] = await resV.json();

        const normalizedV: Vendor[] = dataV.map((v) => ({
          id: v._id,
          company: v.company,
        }));

        setVendors(normalizedV);
      } catch {
        setVendors([]);
      }
    }

    loadData();
  }, []);

  // ----------- COMPUTED VALUES -----------
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const inProgress = orders.filter((o) => o.status === "in_progress").length;
  const completed = orders.filter((o) => o.status === "completed").length;

  const statusData = [
    { name: "Pending", value: pending, color: COLORS.pending },
    { name: "In Progress", value: inProgress, color: COLORS.in_progress },
    { name: "Completed", value: completed, color: COLORS.completed },
  ];

  const ordersByVendor = vendors.map((v) => ({
    name: v.company,
    count: orders.filter((o) => o.vendor_id === v.id).length,
  }));

  const trend = [
    { week: "Week 1", orders: totalOrders },
    { week: "Week 2", orders: totalOrders },
    { week: "Week 3", orders: totalOrders },
    { week: "Week 4", orders: totalOrders },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-primary/10 to-amber-50 rounded-lg p-6 border-l-4 border-primary">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-700 font-medium">
          Overview of your production workflow
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Orders */}
        <Card className="border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all">
          <CardHeader className="pb-3 bg-gradient-to-br from-primary/10 to-amber-50">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-4xl text-primary">
              {totalOrders}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-green-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" /> Live production
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="border-2 border-gray-200 hover:border-yellow-500 hover:shadow-xl transition-all">
          <CardHeader className="pb-3 bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-4xl text-yellow-600">{pending}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            Awaiting action
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all">
          <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-4xl text-blue-600">
              {inProgress}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">Active</CardContent>
        </Card>

        {/* Completed */}
        <Card className="border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all">
          <CardHeader className="pb-3 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-4xl text-green-600">
              {completed}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            Delivered
          </CardContent>
        </Card>
      </div>

      {/* TWO CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of orders by status
            </CardDescription>
          </CardHeader>

          <CardContent>
            {totalOrders === 0 ? (
              <p className="text-center text-gray-500 py-20">
                No orders found.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(props) => {
                      const name = props.name as string;
                      const percent = props.percent as number;
                      return `${name}: ${(percent * 100).toFixed(0)}%`;
                    }}
                    dataKey="value"
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* ORDERS BY VENDOR */}
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Orders by Vendor</CardTitle>
            <CardDescription>Total orders per vendor</CardDescription>
          </CardHeader>

          <CardContent>
            {vendors.length === 0 ? (
              <p className="text-center text-gray-500 py-20">
                No vendors available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersByVendor}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D97706" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TREND CHART */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle>Order Trend (Last 4 Weeks)</CardTitle>
          <CardDescription>Weekly volume</CardDescription>
        </CardHeader>

        <CardContent>
          {totalOrders === 0 ? (
            <p className="text-center text-gray-500 py-20">
              Not enough data for trend analysis.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3B82F6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
