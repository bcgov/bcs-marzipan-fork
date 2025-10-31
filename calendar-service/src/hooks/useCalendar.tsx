// /hooks/useCalendar.ts (TanStack Query v5)
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchCalendarEntries,
  fetchCalendarEntry,
  createCalendarEntry,
  updateCalendarEntry,
  deleteCalendarEntry,
} from "../api/calendarApi";
import { CalendarEntry } from "../models/CalendarEntry";

// List
export function useCalendarEntries() {
  return useQuery<CalendarEntry[]>({
    queryKey: ["calendarEntries"],
    queryFn: fetchCalendarEntries,
    staleTime: 30_000, // optional: 30s freshness
  });
}

// Single by id
export function useCalendarEntry(id: string | undefined) {
  return useQuery<CalendarEntry>({
    queryKey: ["calendarEntry", id],
    queryFn: () => fetchCalendarEntry(id as string),
    enabled: !!id, // don't run until id exists
  });
}

// Create
export function useCreateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCalendarEntry,
    onSuccess: () => {
      // v5: invalidate with an options object
      qc.invalidateQueries({ queryKey: ["calendarEntries"] });
    },
  });
}

// Update
export function useUpdateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CalendarEntry> }) =>
      updateCalendarEntry(id, data),
    onSuccess: (_, vars) => {
      // refresh list and the specific item cache (if used)
      qc.invalidateQueries({ queryKey: ["calendarEntries"] });
      qc.invalidateQueries({ queryKey: ["calendarEntry", vars.id] });
    },
  });
}

// Delete
export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCalendarEntry(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["calendarEntries"] });
      qc.invalidateQueries({ queryKey: ["calendarEntry", id] });
    },
  });
}
