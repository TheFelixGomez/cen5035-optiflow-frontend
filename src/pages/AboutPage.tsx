import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Target, Zap, Shield, Users } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: 'Efficiency',
      description: 'Streamline your production workflow and eliminate redundant manual processes.',
    },
    {
      icon: Zap,
      title: 'Productivity',
      description: 'Save time and resources while improving overall operational productivity.',
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Reduce errors and ensure accurate tracking of all vendor and order information.',
    },
    {
      icon: Users,
      title: 'Centralized',
      description: 'Single platform for all your vendor management and scheduling needs.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About OptiFlow</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              A comprehensive production order management and scheduling software system
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-gray-700 space-y-4">
              <p>
                OptiFlow is designed to improve efficiency in handling vendor orders and daily
                production tasks. Our system provides a centralized platform to manage vendor and
                order information, eliminating redundancy in manual entry processes.
              </p>
              <p>
                With our calendar-based scheduling feature, businesses can effectively manage
                workload and ensure unique order requirements are met. The integrated reporting
                system generates comprehensive summaries of vendor interactions and order activity,
                helping businesses maintain strong relationships with vendors and customers.
              </p>
              <p>
                By integrating these essential features into a single software tool, OptiFlow helps
                businesses reduce errors, streamline workflows, save resources, and improve overall
                productivity.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">
              What drives us to deliver the best solution for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Centralized platform to manage all vendor information, track interactions, and
                maintain comprehensive vendor profiles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Complete order lifecycle management with status tracking, special requirements, and
                real-time updates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Calendar-based scheduling system to manage workload, set deadlines, and ensure
                timely completion of orders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reporting System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Generate detailed reports and summaries with PDF and CSV export capabilities for
                analysis and record-keeping.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join businesses that are optimizing their production workflows with OptiFlow
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="text-lg px-8 py-6"
          >
            Start Using OptiFlow
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
