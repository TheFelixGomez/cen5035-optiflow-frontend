import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/order.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants = {
    pending: { variant: 'warning' as const, label: 'Pending' },
    in_progress: { variant: 'info' as const, label: 'In Progress' },
    completed: { variant: 'success' as const, label: 'Completed' },
  };

  const { variant, label } = variants[status];

  return <Badge variant={variant}>{label}</Badge>;
}
