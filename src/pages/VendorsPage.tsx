import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/stores/auth.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

type Vendor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at?: string;
};

type VendorForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function VendorsPage() {
  const { role } = useAuth();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filtered, setFiltered] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Dialog + form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formValues, setFormValues] = useState<VendorForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // FETCH VENDORS FROM BACKEND
  useEffect(() => {
    async function loadVendors() {
      try {
        const res = await axios.get<Vendor[]>(
          `${import.meta.env.VITE_API_URL}/vendors/`
        );
        const data = res.data ?? [];
        setVendors(data);
        setFiltered(data);
      } catch {
        setVendors([]);
        setFiltered([]);
      }
    }

    loadVendors();
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const lower = search.toLowerCase();
    const results = vendors.filter((v) =>
      v.name.toLowerCase().includes(lower)
    );
    setFiltered(results);
    setCurrentPage(1);
  }, [search, vendors]);

  // PAGINATION CALC
  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentItems = filtered.slice(startIdx, startIdx + pageSize);

  // OPEN CREATE
  const openCreateDialog = () => {
    setEditingVendor(null);
    setFormValues({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setIsDialogOpen(true);
  };

  // OPEN EDIT
  const openEditDialog = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormValues({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
    });
    setIsDialogOpen(true);
  };

  // HANDLE INPUTS
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SUBMIT (CREATE / EDIT)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: VendorForm = {
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      address: formValues.address,
    };

    try {
      if (editingVendor && editingVendor.id) {
        // UPDATE
        const res = await axios.put<Vendor>(
          `${import.meta.env.VITE_API_URL}/vendors/${editingVendor.id}`,
          payload
        );
        const updated = res.data;
        setVendors((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v))
        );
      } else {
        // CREATE
        const res = await axios.post<Vendor>(
          `${import.meta.env.VITE_API_URL}/vendors/`,
          payload
        );
        const created = res.data;
        setVendors((prev) => [...prev, created]);
      }

      setIsDialogOpen(false);
    } catch {
      // aquí podrías mostrar un toast si quieres
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/vendors/${id}`
      );
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch {
      // aquí podrías mostrar un toast si quieres
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendors</h1>

        {role === "admin" && (
          <button
            type="button"
            onClick={openCreateDialog}
            className="px-4 py-2 bg-white text-black border border-gray-300 rounded shadow hover:bg-gray-100 transition"
          >
            + Create Vendor
          </button>
        )}
      </div>

      {/* SEARCH BAR */}
      <Input
        placeholder="Search vendors..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="w-full max-w-sm"
      />

      {/* TABLE */}
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Email</th>
              <th className="py-2 text-left">Phone</th>
              <th className="py-2 text-left">Address</th>
              {role === "admin" && (
                <>
                  <th className="py-2 text-left">Edit</th>
                  <th className="py-2 text-left">Delete</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={role === "admin" ? 6 : 4}
                  className="py-4 text-center text-gray-500"
                >
                  No vendors available.
                </td>
              </tr>
            ) : (
              currentItems.map((vendor) => (
                <tr key={vendor.id} className="border-b">
                  <td className="py-2">{vendor.name}</td>
                  <td className="py-2">{vendor.email}</td>
                  <td className="py-2">{vendor.phone}</td>
                  <td className="py-2">{vendor.address}</td>
                  {role === "admin" && (
                    <>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => openEditDialog(vendor)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(vendor.id)}
                          className="p-1 rounded hover:bg-red-50 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-4 space-x-3">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* CREATE / EDIT DIALOG */}
      {role === "admin" && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVendor ? "Edit Vendor" : "Create Vendor"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="name"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="address"
                >
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  value={formValues.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Apply</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
