import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, CheckCircle, Package } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockDashboardStats, mockOrdersByVendor, mockOrdersTrend, mockRecentOrders } from '@/lib/mockData';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { format } from 'date-fns';

const COLORS = {
  pending: '#F59E0B',
  in_progress: '#3B82F6',
  completed: '#10B981',
};

export default function DashboardPage() {
  const statusData = [
    { name: 'Pending', value: mockDashboardStats.pending, color: COLORS.pending },
    { name: 'In Progress', value: mockDashboardStats.inProgress, color: COLORS.in_progress },
    { name: 'Completed', value: mockDashboardStats.completed, color: COLORS.completed },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-amber-50 rounded-lg p-6 border-l-4 border-primary">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-700 font-medium">Overview of your production orders and activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="pb-3 bg-gradient-to-br from-primary/10 to-amber-50">
            <div className="flex items-center justify-between">
              <CardDescription className="text-gray-700 font-medium">Total Orders</CardDescription>
              <Package className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl text-primary font-bold">{mockDashboardStats.totalOrders}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              Active production
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="pb-3 bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="flex items-center justify-between">
              <CardDescription className="text-gray-700 font-medium">Pending</CardDescription>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <CardTitle className="text-4xl text-yellow-600 font-bold">{mockDashboardStats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 font-medium">Awaiting action</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <CardDescription className="text-gray-700 font-medium">In Progress</CardDescription>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-4xl text-blue-600 font-bold">{mockDashboardStats.inProgress}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 font-medium">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="pb-3 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <CardDescription className="text-gray-700 font-medium">Completed</CardDescription>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-4xl text-green-600 font-bold">{mockDashboardStats.completed}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 font-medium">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="text-gray-900">Order Status Distribution</CardTitle>
            <CardDescription className="text-gray-700">Current order breakdown by status</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Vendor */}
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="text-gray-900">Orders by Vendor</CardTitle>
            <CardDescription className="text-gray-700">Total orders per vendor</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockOrdersByVendor}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#D97706" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders Trend */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="text-gray-900">Orders Trend (Last 4 Weeks)</CardTitle>
          <CardDescription className="text-gray-700">Weekly order status progression</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockOrdersTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pending" stroke={COLORS.pending} strokeWidth={2} />
              <Line type="monotone" dataKey="in_progress" stroke={COLORS.in_progress} strokeWidth={2} />
              <Line type="monotone" dataKey="completed" stroke={COLORS.completed} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Orders Table */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="text-gray-900">Recent Orders</CardTitle>
          <CardDescription className="text-gray-700">Latest 5 orders in the system</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {mockRecentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900">#{order.id.slice(0, 8)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{order.vendor?.name}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{order.instructions}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    Due: {format(new Date(order.dueDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {format(new Date(order.createdAt), 'MMM dd')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
