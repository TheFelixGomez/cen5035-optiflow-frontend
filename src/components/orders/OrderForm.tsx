import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVendors } from '@/hooks/useVendors';
import type { Order } from '@/types/order.types';
import { format } from 'date-fns';

const orderSchema = z.object({
  vendorId: z.string().min(1, 'Please select a vendor'),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.enum(['pending', 'in_progress', 'completed']),
  instructions: z.string().min(5, 'Instructions must be at least 5 characters'),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function OrderForm({ order, onSubmit, onCancel, isLoading }: OrderFormProps) {
  const { data: vendors } = useVendors();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: order
      ? {
          vendorId: order.vendorId,
          dueDate: format(new Date(order.dueDate), 'yyyy-MM-dd'),
          status: order.status,
          instructions: order.instructions,
        }
      : {
          status: 'pending',
        },
  });

  const selectedVendorId = watch('vendorId');
  const selectedStatus = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vendorId">Vendor *</Label>
        <Select
          value={selectedVendorId}
          onValueChange={(value) => setValue('vendorId', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendors?.map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id}>
                {vendor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.vendorId && <p className="text-sm text-red-500">{errors.vendorId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date *</Label>
        <Input
          id="dueDate"
          type="date"
          {...register('dueDate')}
          disabled={isLoading}
        />
        {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={selectedStatus}
          onValueChange={(value: any) => setValue('status', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Special Instructions *</Label>
        <Textarea
          id="instructions"
          placeholder="Enter any special requirements or notes..."
          {...register('instructions')}
          disabled={isLoading}
          rows={4}
        />
        {errors.instructions && (
          <p className="text-sm text-red-500">{errors.instructions.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : order ? 'Update Order' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
}
