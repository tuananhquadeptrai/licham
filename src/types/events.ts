export type EventId = string;
export type EventDateType = 'solar' | 'lunar';
export type RecurrenceFrequency = 'none' | 'yearly' | 'monthly';
export type ReminderOffset = 'none' | 'at_time' | '5m' | '1h' | '1d' | '3d';
export type EventKind = 'general' | 'gio';

export interface EventBase {
  id: EventId;
  title: string;
  notes?: string;
  dateType: EventDateType;
  solarDate?: { year: number; month: number; day: number };
  lunarDate?: { year: number; month: number; day: number; isLeapMonth?: boolean };
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  recurrence: { frequency: RecurrenceFrequency };
  reminder: ReminderOffset;
  kind: EventKind;
  createdAt: string;
  updatedAt: string;
}

export interface GioEvent extends EventBase {
  kind: 'gio';
  personName: string;
  relationship?: string;
  yearOfDeath?: number;
}

export type CalendarEvent = EventBase | GioEvent;

export function isGioEvent(event: CalendarEvent): event is GioEvent {
  return event.kind === 'gio';
}
