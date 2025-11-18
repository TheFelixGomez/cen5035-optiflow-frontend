import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { calendarApi, type CalendarRange } from '@/lib/api/calendar';

export const useCalendarEvents = (range?: CalendarRange) => {
  const query = useQuery({
    queryKey: ['calendar', range?.start, range?.end],
    queryFn: () => {
      if (!range?.start || !range?.end) {
        throw new Error('Calendar range is required');
      }
      return calendarApi.getRange(range);
    },
    enabled: Boolean(range?.start && range?.end),
  });

  return useMemo(
    () => ({
      ...query,
      data: query.data ?? [],
    }),
    [query]
  );
};

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dueDate }: { id: string; dueDate: string }) =>
      calendarApi.updateDueDate(id, dueDate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
};
