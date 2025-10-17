import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, EventDropArg, DateSelectArg } from '@fullcalendar/core';
import { useOrders, useUpdateOrder } from '@/hooks/useOrders';
import type { Order, OrderStatus } from '@/types/order.types';
import { toast } from '@/hooks/useToast';

interface CalendarViewProps {
  statusFilter?: OrderStatus | 'all';
  vendorFilter?: string;
  onEventClick: (order: Order) => void;
  onDateClick: (date: Date) => void;
}

export default function CalendarView({
  statusFilter,
  vendorFilter,
  onEventClick,
  onDateClick,
}: CalendarViewProps) {
  const filters = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    vendorId: vendorFilter !== 'all' ? vendorFilter : undefined,
  };

  const { data: orders, isLoading } = useOrders(filters);
  const updateOrder = useUpdateOrder();

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: '#F59E0B', // Yellow
      in_progress: '#3B82F6', // Blue
      completed: '#10B981', // Green
    };
    return colors[status];
  };

  const events = orders?.map((order) => ({
    id: order.id,
    title: `${order.vendor?.name || 'Unknown'} - #${order.id.slice(0, 8)}`,
    start: order.dueDate,
    backgroundColor: getStatusColor(order.status),
    borderColor: getStatusColor(order.status),
    extendedProps: {
      order,
    },
  })) || [];

  const handleEventClick = (info: EventClickArg) => {
    const order = info.event.extendedProps.order as Order;
    onEventClick(order);
  };

  const handleEventDrop = (info: EventDropArg) => {
    const order = info.event.extendedProps.order as Order;
    const newDate = info.event.start;

    if (!newDate) return;

    // Optimistic update
    updateOrder.mutate(
      {
        id: order.id,
        data: {
          dueDate: newDate.toISOString().split('T')[0],
        },
      },
      {
        onError: () => {
          // Revert on error
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

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    onDateClick(selectInfo.start);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        select={handleDateSelect}
        height="auto"
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
      />
    </div>
  );
}
