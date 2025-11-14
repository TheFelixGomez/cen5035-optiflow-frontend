import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";

type Vendor = {
  id?: string;
  company: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

export default function VendorsPage() {

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filtered, setFiltered] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;


  // FETCH VENDORS FROM BACKEND

  useEffect(() => {
    async function loadVendors() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/vendors/`
        );
        setVendors(res.data || []);
        setFiltered(res.data || []);
      } catch {
        console.log("No vendors yet — backend not ready");
        setVendors([]);
        setFiltered([]);
      }
    }

    loadVendors();
  }, []);


  // SEARCH FILTER

  useEffect(() => {
    const results = vendors.filter((v) =>
      v.company?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
    setCurrentPage(1);
  }, [search, vendors]);

  // PAGINATION CALC

  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentItems = filtered.slice(startIdx, startIdx + pageSize);


  // UI

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendors</h1>
      </div>

      {/* SEARCH BAR */}
      <Input
        placeholder="Search vendors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm"
      />

      {/* TABLE */}
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Company</th>
              <th className="py-2 text-left">Contact Person</th>
              <th className="py-2 text-left">Email</th>
              <th className="py-2 text-left">Phone</th>
              <th className="py-2 text-left">Address</th>
              <th className="py-2 text-left">Notes</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No vendors available.
                </td>
              </tr>
            ) : (
              currentItems.map((vendor) => (
                <tr key={vendor.id} className="border-b">
                  <td className="py-2">{vendor.company}</td>
                  <td className="py-2">{vendor.contact_person}</td>
                  <td className="py-2">{vendor.email}</td>
                  <td className="py-2">{vendor.phone}</td>
                  <td className="py-2">{vendor.address}</td>
                  <td className="py-2">{vendor.notes}</td>
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
    </div>
  );
}