import axios from "axios";
import { CalendarEntry } from "../models/CalendarEntry";
import api from "./axios.js";

export async function fetchCalendarEntries(): Promise<CalendarEntry[]> {
  const res = await api.get<CalendarEntry[]>(`/calendar`);
  return res.data;
}

export async function fetchCalendarEntry(id: string): Promise<CalendarEntry> {
  const res = await api.get<CalendarEntry>(`/calendar/${id}`);
  return res.data;
}

export async function createCalendarEntry(
  entry: Partial<CalendarEntry>
): Promise<CalendarEntry> {
  const res = await api.post<CalendarEntry>(`/calendar`, entry);
  return res.data;
}

// export async function createCalendarEntry(payload: any) {
//   const res = await axios.post(`${API_BASE}/entries`, payload);
//   return res.data;
// }

export async function updateCalendarEntry(
  id: string,
  entry: Partial<CalendarEntry>
): Promise<CalendarEntry> {
  const res = await api.put<CalendarEntry>(`/calendar/${id}`, entry);
  return res.data;
}

export async function deleteCalendarEntry(id: string): Promise<void> {
  await axios.delete(`/calendar/${id}`);
}

export async function createPitch(payload: any) {
  const { data } = await api.post("/api/pitches", payload);
  return data;
}

export async function createDraftEntry(payload : any) {
  const res = await api.post(`/drafts`, payload);
  return res.data;
}