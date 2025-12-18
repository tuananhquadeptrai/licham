import ICAL from 'ical.js';
import type { CalendarEvent, RecurrenceFrequency } from '../types/events';

export interface ParsedEvent {
  uid: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  isAllDay: boolean;
  recurrence: RecurrenceFrequency;
  description?: string;
}

export async function parseICSFile(file: File): Promise<ParsedEvent[]> {
  const text = await file.text();
  const jcalData = ICAL.parse(text);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents('vevent');

  const parsedEvents: ParsedEvent[] = [];

  for (const vevent of vevents) {
    try {
      const uid = vevent.getFirstPropertyValue('uid') as string || crypto.randomUUID();
      const summary = vevent.getFirstPropertyValue('summary') as string || 'Sự kiện không tên';
      const description = vevent.getFirstPropertyValue('description') as string | undefined;
      
      const dtstart = vevent.getFirstProperty('dtstart');
      if (!dtstart) continue;

      const dtstartValue = dtstart.getFirstValue() as ICAL.Time;
      const isAllDay = dtstartValue.isDate;
      const startDate = dtstartValue.toJSDate();

      let endDate: Date | undefined;
      const dtend = vevent.getFirstProperty('dtend');
      if (dtend) {
        const dtendValue = dtend.getFirstValue() as ICAL.Time;
        endDate = dtendValue.toJSDate();
      }

      let recurrence: RecurrenceFrequency = 'none';
      const rrule = vevent.getFirstPropertyValue('rrule') as { freq?: string } | null;
      if (rrule && typeof rrule === 'object' && rrule.freq) {
        const freq = rrule.freq.toUpperCase();
        if (freq === 'YEARLY') {
          recurrence = 'yearly';
        } else if (freq === 'MONTHLY') {
          recurrence = 'monthly';
        }
      }

      parsedEvents.push({
        uid,
        title: summary,
        startDate,
        endDate,
        isAllDay,
        recurrence,
        description,
      });
    } catch (err) {
      console.warn('Error parsing event:', err);
    }
  }

  return parsedEvents;
}

export function convertToCalendarEvents(parsedEvents: ParsedEvent[]): CalendarEvent[] {
  const now = new Date().toISOString();

  return parsedEvents.map((parsed) => {
    const startDate = parsed.startDate;

    const calendarEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: parsed.title,
      notes: parsed.description,
      dateType: 'solar',
      solarDate: {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        day: startDate.getDate(),
      },
      allDay: parsed.isAllDay,
      startTime: parsed.isAllDay
        ? undefined
        : `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
      endTime:
        !parsed.isAllDay && parsed.endDate
          ? `${parsed.endDate.getHours().toString().padStart(2, '0')}:${parsed.endDate.getMinutes().toString().padStart(2, '0')}`
          : undefined,
      recurrence: { frequency: parsed.recurrence },
      reminder: 'none',
      kind: 'general',
      createdAt: now,
      updatedAt: now,
    };

    return calendarEvent;
  });
}
