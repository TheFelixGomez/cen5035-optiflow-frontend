import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Users,
  FileText,
  ShoppingCart,
  CheckCircle,
  ArrowRight,
  BarChart3,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Vendor Management',
      description: 'Centralized platform to manage vendor information and eliminate redundancy.',
    },
    {
      icon: ShoppingCart,
      title: 'Order Management',
      description: 'Track and manage production orders with status updates and special requirements.',
    },
    {
      icon: Calendar,
      title: 'Task Scheduling',
      description: 'Calendar-based scheduling to manage workload and ensure timely delivery.',
    },
    {
      icon: FileText,
      title: 'Reporting & Analytics',
      description: 'Generate summaries of vendor interactions and order activity with PDF/CSV export.',
    },
  ];

  const benefits = [
    'Reduce errors in manual entry processes',
    'Streamline workflows and operations',
    'Save time and resources',
    'Improve overall productivity',
    'Centralized information management',
    'Real-time order tracking',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-primary drop-shadow-sm">OptiFlow</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 font-semibold mb-8 max-w-3xl mx-auto">
              Production Order Management & Scheduling Software
            </p>
            <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
              Streamline your production workflow with our comprehensive platform for managing
              vendors, orders, and scheduling tasks efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="text-lg px-8 py-6"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/about')}
                className="text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-xl text-gray-600">
            Everything you need to manage production orders efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-2 border-gray-200 hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-amber-500 rounded-lg flex items-center justify-center mb-4 shadow-md">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-700">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose OptiFlow?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                OptiFlow integrates all essential features into a single software tool, helping
                businesses reduce errors, streamline workflows, and improve productivity.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-amber-50 transition-colors">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800 text-lg font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/30 to-amber-200 rounded-2xl p-8 shadow-xl">
                <BarChart3 className="h-64 w-64 mx-auto text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-primary via-amber-500 to-orange-500 border-0 shadow-2xl">
          <CardContent className="py-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-md">
              Ready to Optimize Your Production?
            </h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Start managing your vendors, orders, and schedules more efficiently today.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/register')}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">OptiFlow</h3>
            <p className="text-gray-400 mb-4">Production Order Management System</p>
            <p className="text-gray-500 text-sm">© 2025 OptiFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
