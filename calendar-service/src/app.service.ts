import { Injectable, NotFoundException } from "@nestjs/common";
import { CalendarEntry } from "./models/CalendarEntry";

@Injectable()
export class AppService {
  private entries = new Map<string, CalendarEntry>();

  getAll(): CalendarEntry[] {
    return Array.from(this.entries.values());
  }

  getOne(id: string): CalendarEntry {
    const entry = this.entries.get(id);
    if (!entry) throw new NotFoundException(`Entry ${id} not found`);
    return entry;
  }

  create(entry: Partial<CalendarEntry>): CalendarEntry {
    const id = entry.id || `entry-${Date.now()}`;
    const newEntry: CalendarEntry = { ...entry, id };
    this.entries.set(id, newEntry);
    return newEntry;
  }

  update(id: string, patch: Partial<CalendarEntry>): CalendarEntry {
    const existing = this.entries.get(id);
    if (!existing) throw new NotFoundException(`Entry ${id} not found`);
    const updated = { ...existing, ...patch, id };
    this.entries.set(id, updated);
    return updated;
  }

  delete(id: string): void {
    if (!this.entries.delete(id)) throw new NotFoundException(`Entry ${id} not found`);
  }

  // Lightweight stubs to match client usage
  createPitch(payload: any) {
    return { id: `pitch-${Date.now()}`, ...payload };
  }

  createDraftEntry(payload: any) {
    return { id: `draft-${Date.now()}`, ...payload };
  }
}