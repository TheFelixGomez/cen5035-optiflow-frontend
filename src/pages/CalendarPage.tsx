import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DatesSetArg, EventContentArg, EventDropArg } from "@fullcalendar/core";
import { useOrders, useUpdateOrder } from "@/hooks/useOrders";
import type { OrderFilters, OrderStatus } from "@/types/order.types";
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
  const [range, setRange] = useState<{ start?: string; end?: string }>({});

  const filters = useMemo<OrderFilters>(() => ({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    dateFrom: range.start ? range.start.split('T')[0] : undefined,
    dateTo: range.end ? range.end.split('T')[0] : undefined,
  }), [statusFilter, range]);

  const { data: orders = [], isLoading } = useOrders(filters);
  const updateOrder = useUpdateOrder();

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: '#F59E0B',
      in_progress: '#3B82F6',
      completed: '#10B981',
    };
    return colors[status];
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const order = eventInfo.event.extendedProps.order as Order | undefined;
    const status = (order?.status ?? 'pending') as OrderStatus;
    const background = getStatusColor(status);

    return (
      <div
        className="rounded-md px-2 py-1 text-xs font-medium text-white shadow-sm w-full"
        style={{ backgroundColor: background, boxSizing: 'border-box', display: 'block' }}
      >
        <div className="truncate">{eventInfo.event.title}</div>
        {order?.vendor?.name && (
          <div className="text-[10px] opacity-90 truncate">{order.vendor.name}</div>
        )}
      </div>
    );
  };

  // Convert to calendar events
  const events = orders.map((order) => ({
    id: order.id,
    title: `Order #${order.id.slice(0, 8)}`,
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

    updateOrder.mutate(
      {
        id: info.event.id,
        data: {
          dueDate: newDate.toISOString(),
        },
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

  const statusLegend = [
    { label: 'Pending', color: getStatusColor('pending') },
    { label: 'In Progress', color: getStatusColor('in_progress') },
    { label: 'Completed', color: getStatusColor('completed') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Calendar</h1>

        <div className="flex flex-wrap items-center gap-4 justify-between">
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

          <div className="flex flex-wrap gap-3 text-sm">
            {statusLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="inline-flex h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
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
          eventContent={renderEventContent}
        />
      </div>
    </div>
  );
}

