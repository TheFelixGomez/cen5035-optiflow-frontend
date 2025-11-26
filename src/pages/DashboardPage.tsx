// import {useEffect, useState} from "react";
// import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
// import {TrendingUp} from "lucide-react";
// import { useAuth } from "@/stores/auth.store";
// import {
//     Bar,
//     BarChart,
//     CartesianGrid,
//     Cell,
//     Legend,
//     Line,
//     LineChart,
//     Pie,
//     PieChart,
//     ResponsiveContainer,
//     Tooltip,
//     XAxis,
//     YAxis,
// } from "recharts";

// const COLORS = {
//   pending: "#F59E0B",
//   in_progress: "#3B82F6",
//   completed: "#10B981",
// };

// type Order = {
//   id: string;
//   vendor_id: string;
//   status: string;
//   order_date: string;
//   total_amount: number;
// };

// type Vendor = {
//   id: string;
//   company: string;
// };

// type RawOrder = {
//   _id: string;
//   vendor_id: string;
//   status: string;
//   order_date: string;
//   total_amount?: number;
// };

// type RawVendor = {
//   _id: string;
//   company: string;
// };

// export default function DashboardPage() {
//   const { role } = useAuth();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [userCount, setUserCount] = useState<number | null>(null);

//   useEffect(() => {
//     async function loadData() {
//       // Orders
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/`);
//         const data: RawOrder[] = await res.json();
//         const normalized: Order[] = data.map((o) => ({
//           id: o._id,
//           vendor_id: o.vendor_id,
//           status: o.status,
//           order_date: o.order_date,
//           total_amount: o.total_amount ?? 0,
//         }));
//         setOrders(normalized);
//       } catch {
//         setOrders([]);
//       }

//       // Vendors
//       try {
//         const resV = await fetch(`${import.meta.env.VITE_API_URL}/vendors/`);
//         const dataV: RawVendor[] = await resV.json();
//         const normalizedV: Vendor[] = dataV.map((v) => ({
//           id: v._id,
//           company: v.company,
//         }));
//         setVendors(normalizedV);
//       } catch {
//         setVendors([]);
//       }

//       // User Count (Admin)
//       if (role === "admin") {
//         try {
//           const resC = await fetch(`${import.meta.env.VITE_API_URL}/users/count`);
//           const dataC = await resC.json();
//           setUserCount(dataC.count ?? 0);
//         } catch {
//           setUserCount(null);
//         }
//       } else {
//         setUserCount(null);
//       }
//     }

//     loadData();
//   }, [role]);

//   const totalOrders = orders.length;
//   const pending = orders.filter((o) => o.status === "pending").length;
//   const inProgress = orders.filter((o) => o.status === "in_progress").length;
//   const completed = orders.filter((o) => o.status === "completed").length;

//   const statusData = [
//     { name: "Pending", value: pending, color: COLORS.pending },
//     { name: "In Progress", value: inProgress, color: COLORS.in_progress },
//     { name: "Completed", value: completed, color: COLORS.completed },
//   ];

//   const ordersByVendor = vendors.map((v) => ({
//     name: v.company,
//     count: orders.filter((o) => o.vendor_id === v.id).length,
//   }));

//   const trend = [
//     { week: "Week 1", orders: totalOrders },
//     { week: "Week 2", orders: totalOrders },
//     { week: "Week 3", orders: totalOrders },
//     { week: "Week 4", orders: totalOrders },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-primary/10 to-amber-50 rounded-lg p-6 border-l-4 border-primary">
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//         <p className="text-gray-700 font-medium">
//           Overview of your production workflow
//         </p>
//       </div>

//       {/* STAT CARDS — 3 on first row, 2 on second */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

//         {/* Total Orders */}
//         <Card className="border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all">
//           <CardHeader className="pb-3 bg-gradient-to-br from-primary/10 to-amber-50">
//             <CardDescription>Total Orders</CardDescription>
//             <CardTitle className="text-4xl text-primary">
//               {totalOrders}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="text-sm text-green-600 flex items-center">
//             <TrendingUp className="h-4 w-4 mr-1" /> Live production
//           </CardContent>
//         </Card>

//         {/* Pending */}
//         <Card className="border-2 border-gray-200 hover:border-yellow-500 hover:shadow-xl transition-all">
//           <CardHeader className="pb-3 bg-gradient-to-br from-yellow-50 to-amber-50">
//             <CardDescription>Pending</CardDescription>
//             <CardTitle className="text-4xl text-yellow-600">{pending}</CardTitle>
//           </CardHeader>
//           <CardContent className="text-sm text-gray-700">
//             Awaiting action
//           </CardContent>
//         </Card>

//         {/* In Progress */}
//         <Card className="border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all">
//           <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-indigo-50">
//             <CardDescription>In Progress</CardDescription>
//             <CardTitle className="text-4xl text-blue-600">
//               {inProgress}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="text-sm text-gray-700">Active</CardContent>
//         </Card>

//         {/* Completed */}
//         <Card className="border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all">
//           <CardHeader className="pb-3 bg-gradient-to-br from-green-50 to-emerald-50">
//             <CardDescription>Completed</CardDescription>
//             <CardTitle className="text-4xl text-green-600">
//               {completed}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="text-sm text-gray-700">
//             Delivered
//           </CardContent>
//         </Card>

//         {/* ADMIN ONLY — PURPLE CARD (same size) */}
//         {role === "admin" && (
//           <Card className="border-2 border-purple-400 hover:border-purple-600 hover:shadow-xl transition-all">
//             <CardHeader className="pb-3 bg-gradient-to-br from-purple-50 to-purple-100 flex flex-row justify-between">
//               <CardTitle className="text-sm font-medium text-purple-700">
//                 Total Users
//               </CardTitle>
//               <TrendingUp className="h-5 w-5 text-purple-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-4xl font-bold text-purple-700">
//                 {userCount !== null ? userCount : "--"}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Registered accounts
//               </p>
//             </CardContent>
//           </Card>
//         )}

//       </div>

//       {/* TWO CHARTS ROW */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         {/* PIE CHART */}
//         <Card className="border-2 border-gray-200 shadow-lg">
//           <CardHeader>
//             <CardTitle>Order Status Distribution</CardTitle>
//             <CardDescription>
//               Breakdown of orders by status
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             {totalOrders === 0 ? (
//               <p className="text-center text-gray-500 py-20">
//                 No orders found.
//               </p>
//             ) : (
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={statusData}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     dataKey="value"
//                   >
//                     {statusData.map((entry, i) => (
//                       <Cell key={i} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </CardContent>
//         </Card>

//         {/* ORDERS BY VENDOR */}
//         <Card className="border-2 border-gray-200 shadow-lg">
//           <CardHeader>
//             <CardTitle>Orders by Vendor</CardTitle>
//             <CardDescription>Total orders per vendor</CardDescription>
//           </CardHeader>

//           <CardContent>
//             {vendors.length === 0 ? (
//               <p className="text-center text-gray-500 py-20">
//                 No vendors available.
//               </p>
//             ) : (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={ordersByVendor}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis allowDecimals={false} />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#D97706" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* TREND CHART */}
//       <Card className="border-2 border-gray-200 shadow-lg">
//         <CardHeader>
//           <CardTitle>Order Trend (Last 4 Weeks)</CardTitle>
//           <CardDescription>Weekly volume</CardDescription>
//         </CardHeader>

//         <CardContent>
//           {totalOrders === 0 ? (
//             <p className="text-center text-gray-500 py-20">
//               Not enough data for trend analysis.
//             </p>
//           ) : (
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={trend}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="week" />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="orders"
//                   stroke="#3B82F6"
//                   strokeWidth={3}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/stores/auth.store";
import apiClient from "@/lib/api/client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type Order = {
  id: string;
  vendor_id: string;
  user_id: string;
  status: string;
  order_date: string;
  total_amount: number;
};

type Vendor = {
  id: string;
  name: string;
};

type RawOrder = {
  id: string;
  vendor_id: string;
  user_id: string;
  status: string;
  order_date: string;
  total_amount: number;
};

type RawVendor = {
  id: string;
  name: string;
};

// --------------------------------------------------

const COLORS = {
  pending: "#F59E0B",
  in_progress: "#3B82F6",
  completed: "#10B981",
};

// Custom vendor bar colors:
const VENDOR_COLORS = [
  "#D97706", // amber
  "#3B82F6", // blue
  "#10B981", // green
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
];

export default function DashboardPage() {
  const { role, user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [userCount, setUserCount] = useState<number>(0);

  // --------------------------------------------------
  // LOAD DATA (ORDERS, VENDORS, USERS)
  // --------------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        // -----------------------
        // ORDERS (AUTH REQUIRED)
        // -----------------------
        const resOrders = await apiClient.get(
          `${import.meta.env.VITE_API_URL}/orders`
        );

        const normalizedOrders: Order[] = resOrders.data.map(
          (o: RawOrder): Order => ({
            id: o.id,
            vendor_id: o.vendor_id,
            status: o.status,
            user_id: o.user_id,
            order_date: o.order_date,
            total_amount: o.total_amount ?? 0,
          })
        );

        // Admin sees ALL orders — customer sees only THEIR orders
        const visibleOrders =
          role === "admin"
            ? normalizedOrders
            : normalizedOrders.filter((o) => o.user_id === user?.username);

        setOrders(visibleOrders);
      } catch {
        setOrders([]);
      }

      try {
        // -----------------------
        // VENDORS
        // -----------------------
        const resV = await apiClient.get(
          `${import.meta.env.VITE_API_URL}/vendors`
        );

        const normalizedV: Vendor[] = resV.data.map(
          (v: RawVendor): Vendor => ({
            id: v.id,
            name: v.name,
          })
        );

        setVendors(normalizedV);
      } catch {
        setVendors([]);
      }

      try {
        if (role === "admin") {
          const resC = await apiClient.get(
            `${import.meta.env.VITE_API_URL}/users/count`
          );
          setUserCount(resC.data.count ?? 0);
        }
      } catch {
        setUserCount(0);
      }
    }

    loadData();
  }, [role, user?.username]);

  // --------------------------------------------------
  // METRICS
  // --------------------------------------------------
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const inProgress = orders.filter((o) => o.status === "in_progress").length;
  const completed = orders.filter((o) => o.status === "completed").length;

  // PIE CHART
  const statusData = [
    { name: "Pending", value: pending, color: COLORS.pending },
    { name: "In Progress", value: inProgress, color: COLORS.in_progress },
    { name: "Completed", value: completed, color: COLORS.completed },
  ];

  // BAR CHART — ORDERS BY VENDOR
  const ordersByVendor = vendors.map((v) => ({
    name: v.name,
    count: orders.filter((o) => o.vendor_id === v.id).length,
  }));

  // TREND — last 4 weeks (simple representation)
  const trend = [
    { week: "Week 1", orders: Math.round(totalOrders * 0.25) },
    { week: "Week 2", orders: Math.round(totalOrders * 0.5) },
    { week: "Week 3", orders: Math.round(totalOrders * 0.75) },
    { week: "Week 4", orders: totalOrders },
  ];

  // --------------------------------------------------

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* TOTAL ORDERS */}
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

        {/* PENDING */}
        <Card className="border-2 border-gray-200 hover:border-yellow-500 hover:shadow-xl transition-all">
          <CardHeader className="pb-3 bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-4xl text-yellow-600">
              {pending}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">Awaiting action</CardContent>
        </Card>

        {/* IN PROGRESS */}
        <Card className="border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all">
          <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-4xl text-blue-600">
              {inProgress}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">Active</CardContent>
        </Card>

        {/* COMPLETED */}
        <Card className="border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all">
          <CardHeader className="pb-3 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-4xl text-green-600">
              {completed}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">Delivered</CardContent>
        </Card>

        {/* ADMIN ONLY */}
        {role === "admin" && (
          <Card className="border-2 border-purple-400 hover:border-purple-600 hover:shadow-xl transition-all">
            <CardHeader className="pb-3 bg-purple-50 flex flex-row justify-between">
              <CardTitle className="text-sm font-medium text-purple-700">
                Total Users
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-700">
                {userCount}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STATUS PIE CHART */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
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
                    dataKey="value"
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* ORDERS BY VENDOR */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Orders by Vendor</CardTitle>
          </CardHeader>

          <CardContent>
            {vendors.length === 0 ? (
              <p className="text-center text-gray-500 py-20">
                No vendors found.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersByVendor}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />

                  {/* MULTI-COLOR BARS */}
                  <Bar dataKey="count">
                    {ordersByVendor.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={VENDOR_COLORS[idx % VENDOR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TREND */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Order Trend (Last 4 Weeks)</CardTitle>
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
