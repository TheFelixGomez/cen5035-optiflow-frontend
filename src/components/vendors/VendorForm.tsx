import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Vendor } from '@/types/vendor.types';

const vendorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

type VendorFormData = z.infer<typeof vendorSchema>;

interface VendorFormProps {
  vendor?: Vendor;
  onSubmit: (data: VendorFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function VendorForm({ vendor, onSubmit, onCancel, isLoading }: VendorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: vendor
      ? {
          name: vendor.name,
          contactPerson: vendor.contactPerson,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address,
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Vendor Name *</Label>
        <Input
          id="name"
          placeholder="ABC Manufacturing Co."
          {...register('name')}
          disabled={isLoading}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPerson">Contact Person *</Label>
        <Input
          id="contactPerson"
          placeholder="John Doe"
          {...register('contactPerson')}
          disabled={isLoading}
        />
        {errors.contactPerson && (
          <p className="text-sm text-red-500">{errors.contactPerson.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="contact@vendor.com"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          {...register('phone')}
          disabled={isLoading}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          placeholder="123 Main St, City, State, ZIP"
          {...register('address')}
          disabled={isLoading}
          rows={3}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : vendor ? 'Update Vendor' : 'Create Vendor'}
        </Button>
      </div>
    </form>
  );
}
