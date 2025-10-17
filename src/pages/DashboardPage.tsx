import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, CheckCircle, Package } from 'lucide-react';

export default function DashboardPage() {
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
            <CardTitle className="text-4xl text-primary font-bold">24</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3 from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="pb-3 bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="flex items-center justify-between">
              <CardDescription className="text-gray-700 font-medium">Pending</CardDescription>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <CardTitle className="text-4xl text-yellow-600 font-bold">8</CardTitle>
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
            <CardTitle className="text-4xl text-blue-600 font-bold">10</CardTitle>
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
            <CardTitle className="text-4xl text-green-600 font-bold">6</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 font-medium">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="text-gray-900">Welcome to OptiFlow</CardTitle>
          <CardDescription className="text-gray-700 font-medium">All Features Ready - Start Managing Your Production</CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="space-y-3">
            <p className="text-gray-800 font-medium">
              Your complete production management system is ready to use. Navigate through all features seamlessly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-800 font-medium">Vendor Management</span>
              </div>
              <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-800 font-medium">Order Tracking</span>
              </div>
              <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-800 font-medium">Calendar Scheduling</span>
              </div>
              <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-800 font-medium">Report Generation</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
