import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

/* -----------------------------
   TYPES
----------------------------- */

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type RawOrder = {
  _id: string;
  vendor_id: string;
  order_date: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
};

type Order = {
  id: string;
  vendor_id: string;
  order_date: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
};

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    vendor: string;
    total: number;
  };
};

/* -----------------------------
   COMPONENT
----------------------------- */

export default function CalendarPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [vendorFilter, setVendorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* -----------------------------
     LOAD ORDERS
  ----------------------------- */
  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/`
        );

        const normalized: Order[] = (res.data as RawOrder[]).map((o) => ({
          id: o._id,
          vendor_id: o.vendor_id,
          order_date: o.order_date,
          status: o.status,
          total_amount: o.total_amount,
          items: o.items,
        }));

        setOrders(normalized);
      } catch {
        console.log("Could not load orders");
      }
    }

    loadOrders();
  }, []);

  /* -----------------------------
     APPLY FILTERS
  ----------------------------- */
  useEffect(() => {
    let filtered = [...orders];

    // Filter by vendor
    if (vendorFilter.trim() !== "") {
      filtered = filtered.filter((o) =>
        o.vendor_id.toLowerCase().includes(vendorFilter.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Convert to Calendar Events
    const calendarEvents: CalendarEvent[] = filtered.map((o) => ({
      id: o.id,
      title: o.status.replace("_", " ").toUpperCase(),
      date: o.order_date,
      backgroundColor:
        o.status === "pending"
          ? "#fcd34d"
          : o.status === "in_progress"
          ? "#60a5fa"
          : "#4ade80",
      borderColor: "transparent",
      extendedProps: {
        vendor: o.vendor_id,
        total: o.total_amount,
      },
    }));

    setEvents(calendarEvents);
  }, [orders, vendorFilter, statusFilter]);

  /* -----------------------------
     UI
  ----------------------------- */

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Calendar</h1>

      {/* --------------------------
          FILTER BAR (IDENTICAL TO ORDERSPAGE)
      --------------------------- */}
      <div className="flex gap-4 items-center flex-wrap">

        {/* SEARCH BAR – same as OrdersPage */}
        <Input
          placeholder="Search by vendor..."
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
          className="w-full max-w-sm"
        />

        {/* STATUS FILTER – same width, same styling */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* --------------------------
          CALENDAR
      --------------------------- */}
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          selectable
          events={events}
        />
      </div>
    </div>
  );
}

