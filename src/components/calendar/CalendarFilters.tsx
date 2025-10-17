import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVendors } from '@/hooks/useVendors';
import type { OrderStatus } from '@/types/order.types';

interface CalendarFiltersProps {
  status: OrderStatus | 'all';
  onStatusChange: (value: OrderStatus | 'all') => void;
  vendorId: string;
  onVendorChange: (value: string) => void;
  onReset: () => void;
}

export default function CalendarFilters({
  status,
  onStatusChange,
  vendorId,
  onVendorChange,
  onReset,
}: CalendarFiltersProps) {
  const { data: vendors } = useVendors();

  const hasActiveFilters = status !== 'all' || vendorId !== 'all';

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={vendorId} onValueChange={onVendorChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Vendor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Vendors</SelectItem>
          {vendors?.map((vendor) => (
            <SelectItem key={vendor.id} value={vendor.id}>
              {vendor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="outline" onClick={onReset}>
          <Filter className="h-4 w-4 mr-2" />
          Reset
        </Button>
      )}
    </div>
  );
}
