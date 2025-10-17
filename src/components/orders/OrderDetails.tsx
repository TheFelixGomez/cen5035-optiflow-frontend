import { Calendar, FileText, User, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OrderStatusBadge from './OrderStatusBadge';
import type { Order } from '@/types/order.types';
import { format } from 'date-fns';

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
              <CardDescription>Order Details</CardDescription>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Vendor</p>
              <p className="text-base">{order.vendor?.name || 'Unknown Vendor'}</p>
              {order.vendor && (
                <p className="text-sm text-gray-600">{order.vendor.contactPerson}</p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Due Date</p>
              <p className="text-base">{format(new Date(order.dueDate), 'MMMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Special Instructions</p>
              <p className="text-base whitespace-pre-line">{order.instructions}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>
                Created on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
