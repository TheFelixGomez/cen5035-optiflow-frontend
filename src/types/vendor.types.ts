export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateVendorData extends Partial<CreateVendorData> {}

export interface VendorFilters {
  search?: string;
}
