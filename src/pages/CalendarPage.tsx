import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DatesSetArg, EventDropArg } from "@fullcalendar/core";
import { useCalendarEvents, useUpdateCalendarEvent } from "@/hooks/useCalendar";
import type { CalendarRange } from "@/lib/api/calendar";
import type { OrderStatus } from "@/types/order.types";
import { toast } from "@/hooks/useToast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";


/* -----------------------------
   COMPONENT
----------------------------- */

export default function CalendarPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [range, setRange] = useState<CalendarRange>();

  const { data: orders, isLoading } = useCalendarEvents(range);
  const updateEvent = useUpdateCalendarEvent();

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: '#F59E0B',
      in_progress: '#3B82F6',
      completed: '#10B981',
    };
    return colors[status];
  };

  // Filter orders by status
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  // Convert to calendar events
  const events = filteredOrders.map((order) => ({
    id: order.id,
    title: `Order #${order.id.slice(0, 8)} - ${order.status.replace('_', ' ').toUpperCase()}`,
    start: order.dueDate,
    backgroundColor: getStatusColor(order.status),
    borderColor: getStatusColor(order.status),
    extendedProps: { order },
  }));

  const handleDatesSet = (arg: DatesSetArg) => {
    setRange({
      start: arg.startStr,
      end: arg.endStr,
    });
  };

  const handleEventDrop = (info: EventDropArg) => {
    const newDate = info.event.start;
    if (!newDate) return;

    updateEvent.mutate(
      {
        id: info.event.id,
        dueDate: newDate.toISOString(),
      },
      {
        onError: () => {
          info.revert();
          toast({
            title: 'Error',
            description: 'Failed to reschedule order',
            variant: 'destructive',
          });
        },
      }
    );
  };

  /* -----------------------------
     UI
  ----------------------------- */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>

      <div className="flex gap-4 items-center flex-wrap">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          editable
          selectable
          events={events}
          datesSet={handleDatesSet}
          eventDrop={handleEventDrop}
        />
      </div>
    </div>
  );
}

