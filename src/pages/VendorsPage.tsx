import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VendorList from '@/components/vendors/VendorList';
import VendorForm from '@/components/vendors/VendorForm';
import VendorDetails from '@/components/vendors/VendorDetails';
import { useCreateVendor, useUpdateVendor } from '@/hooks/useVendors';
import { useDebounce } from '@/hooks/useDebounce';
import type { Vendor } from '@/types/vendor.types';

export default function VendorsPage() {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();

  const handleCreate = (data: any) => {
    createVendor.mutate(data, {
      onSuccess: () => {
        setIsCreateOpen(false);
      },
    });
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsEditOpen(true);
  };

  const handleUpdate = (data: any) => {
    if (selectedVendor) {
      updateVendor.mutate(
        { id: selectedVendor.id, data },
        {
          onSuccess: () => {
            setIsEditOpen(false);
            setSelectedVendor(null);
          },
        }
      );
    }
  };

  const handleView = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsViewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600">Manage your vendor relationships</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <VendorList search={debouncedSearch} onEdit={handleEdit} onView={handleView} />

      {/* Create Vendor Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Vendor</DialogTitle>
          </DialogHeader>
          <VendorForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={createVendor.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <VendorForm
              vendor={selectedVendor}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedVendor(null);
              }}
              isLoading={updateVendor.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Vendor Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
          </DialogHeader>
          {selectedVendor && <VendorDetails vendor={selectedVendor} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
