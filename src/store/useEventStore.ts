import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarEvent, GioEvent } from '../types/events';
import { isGioEvent } from '../types/events';
import { getLunarService } from '../services/LunarServiceImpl';

interface EventState {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  addEventsBulk: (events: CalendarEvent[], deduplicate?: boolean) => { added: number; skipped: number };
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getGioEvents: () => GioEvent[];
  getUpcomingEvents: (days: number) => CalendarEvent[];
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: (event: CalendarEvent) =>
        set((state) => ({
          events: [...state.events, event],
        })),

      addEventsBulk: (events: CalendarEvent[], deduplicate = true) => {
        const state = get();
        let added = 0;
        let skipped = 0;
        const newEvents: CalendarEvent[] = [];

        for (const event of events) {
          if (deduplicate) {
            const exists = state.events.some(
              (e) =>
                e.title === event.title &&
                e.dateType === event.dateType &&
                e.solarDate?.year === event.solarDate?.year &&
                e.solarDate?.month === event.solarDate?.month &&
                e.solarDate?.day === event.solarDate?.day
            );
            if (exists) {
              skipped++;
              continue;
            }
          }
          newEvents.push(event);
          added++;
        }

        if (newEvents.length > 0) {
          set((s) => ({ events: [...s.events, ...newEvents] }));
        }

        return { added, skipped };
      },

      updateEvent: (id: string, updates: Partial<CalendarEvent>) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id
              ? { ...event, ...updates, updatedAt: new Date().toISOString() }
              : event
          ),
        })),

      deleteEvent: (id: string) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),

      getEventsForDate: (date: Date): CalendarEvent[] => {
        const { events } = get();
        const lunarService = getLunarService();
        
        const targetSolar = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        };
        const lunarDateExtended = lunarService.getLunarDate(targetSolar);
        const targetLunar = {
          year: lunarDateExtended.year,
          month: lunarDateExtended.month,
          day: lunarDateExtended.day,
          isLeapMonth: lunarDateExtended.isLeapMonth,
        };

        return events.filter((event) => {
          if (event.dateType === 'solar' && event.solarDate) {
            return checkDateMatch(
              event.solarDate,
              targetSolar,
              event.recurrence.frequency
            );
          }

          if (event.dateType === 'lunar' && event.lunarDate) {
            return checkLunarDateMatch(
              event.lunarDate,
              targetLunar,
              event.recurrence.frequency
            );
          }

          return false;
        });
      },

      getGioEvents: (): GioEvent[] => {
        const { events } = get();
        return events.filter(isGioEvent);
      },

      getUpcomingEvents: (days: number): CalendarEvent[] => {
        const { getEventsForDate } = get();
        const upcomingEvents: CalendarEvent[] = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const eventsForDay = getEventsForDate(date);
          upcomingEvents.push(...eventsForDay);
        }

        const seen = new Set<string>();
        return upcomingEvents.filter((event) => {
          if (seen.has(event.id)) return false;
          seen.add(event.id);
          return true;
        });
      },
    }),
    {
      name: 'event-storage',
    }
  )
);

function checkDateMatch(
  eventDate: { year: number; month: number; day: number },
  targetDate: { year: number; month: number; day: number },
  frequency: string
): boolean {
  if (frequency === 'none') {
    return (
      eventDate.year === targetDate.year &&
      eventDate.month === targetDate.month &&
      eventDate.day === targetDate.day
    );
  }

  if (frequency === 'yearly') {
    return (
      eventDate.month === targetDate.month &&
      eventDate.day === targetDate.day
    );
  }

  if (frequency === 'monthly') {
    return eventDate.day === targetDate.day;
  }

  return false;
}

function checkLunarDateMatch(
  eventDate: { year: number; month: number; day: number; isLeapMonth?: boolean },
  targetDate: { year: number; month: number; day: number; isLeapMonth?: boolean },
  frequency: string
): boolean {
  if (frequency === 'none') {
    return (
      eventDate.year === targetDate.year &&
      eventDate.month === targetDate.month &&
      eventDate.day === targetDate.day &&
      (eventDate.isLeapMonth ?? false) === (targetDate.isLeapMonth ?? false)
    );
  }

  if (frequency === 'yearly') {
    return (
      eventDate.month === targetDate.month &&
      eventDate.day === targetDate.day &&
      (eventDate.isLeapMonth ?? false) === (targetDate.isLeapMonth ?? false)
    );
  }

  if (frequency === 'monthly') {
    return eventDate.day === targetDate.day;
  }

  return false;
}
