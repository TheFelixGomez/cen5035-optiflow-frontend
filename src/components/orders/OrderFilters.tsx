import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

interface OrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: OrderStatus | 'all';
  onStatusChange: (value: OrderStatus | 'all') => void;
  vendorId: string;
  onVendorChange: (value: string) => void;
  onReset: () => void;
}

export default function OrderFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  vendorId,
  onVendorChange,
  onReset,
}: OrderFiltersProps) {
  const { data: vendors } = useVendors();

  const hasActiveFilters = search || status !== 'all' || vendorId !== 'all';

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

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
