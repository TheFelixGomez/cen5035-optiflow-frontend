import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your production orders and activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-3xl text-primary">24</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-blue-600">10</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">6</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to OptiFlow</CardTitle>
          <CardDescription>Phase 2 Complete - Authentication UI Ready</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-gray-700">
              The authentication system is now in place. You can navigate freely without login requirements.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Login and Register pages functional</li>
              <li>Auth store with Zustand configured</li>
              <li>API client with JWT interceptors ready</li>
              <li>No auth guards - free navigation enabled</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
