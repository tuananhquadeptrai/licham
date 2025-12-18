import type { YearOverview, YearFestivalItem } from '../types/yearOverview';
import type { CalendarEvent } from '../types/events';
import type { LunarDate } from '../lib/amlich/types';
import { isGioEvent } from '../types/events';
import { solarHolidays, lunarHolidays } from '../config/holidays';
import { getLunarService } from './LunarServiceImpl';

function mapHolidayType(type: string): YearFestivalItem['type'] {
  if (type === 'international') return 'commemorative';
  if (['public', 'traditional', 'religious', 'commemorative'].includes(type)) {
    return type as YearFestivalItem['type'];
  }
  return 'commemorative';
}

export function getYearOverview(year: number, events: CalendarEvent[]): YearOverview {
  const items: YearFestivalItem[] = [];
  const lunarService = getLunarService();

  for (const holiday of solarHolidays) {
    const solarDate = { year, month: holiday.month, day: holiday.day };
    const lunarDate = lunarService.getLunarDate(solarDate);

    items.push({
      date: new Date(year, holiday.month - 1, holiday.day),
      solarDate,
      lunarDate: { year: lunarDate.year, month: lunarDate.month, day: lunarDate.day },
      name: holiday.name,
      type: mapHolidayType(holiday.type),
      description: holiday.description,
    });
  }

  for (const holiday of lunarHolidays) {
    const lunarInput: LunarDate = { year, month: holiday.month, day: holiday.day, isLeapMonth: false, jd: 0 };
    const solarDate = lunarService.lunarToSolar(lunarInput);

    if (solarDate.year === 0) continue;

    items.push({
      date: new Date(solarDate.year, solarDate.month - 1, solarDate.day),
      solarDate,
      lunarDate: { year, month: holiday.month, day: holiday.day },
      name: holiday.name,
      type: mapHolidayType(holiday.type),
      description: holiday.description,
    });
  }

  for (const event of events) {
    if (event.recurrence.frequency === 'none' && event.dateType === 'solar' && event.solarDate) {
      if (event.solarDate.year !== year) continue;
    }

    let solarDate: { year: number; month: number; day: number };
    let lunarDate: { year: number; month: number; day: number };

    if (event.dateType === 'solar' && event.solarDate) {
      solarDate = { ...event.solarDate, year };
      const lunar = lunarService.getLunarDate(solarDate);
      lunarDate = { year: lunar.year, month: lunar.month, day: lunar.day };
    } else if (event.dateType === 'lunar' && event.lunarDate) {
      const lunarInput: LunarDate = {
        year,
        month: event.lunarDate.month,
        day: event.lunarDate.day,
        isLeapMonth: event.lunarDate.isLeapMonth ?? false,
        jd: 0,
      };
      const solar = lunarService.lunarToSolar(lunarInput);
      if (solar.year === 0) continue;
      solarDate = solar;
      lunarDate = { year, month: event.lunarDate.month, day: event.lunarDate.day };
    } else {
      continue;
    }

    const eventType = isGioEvent(event) ? 'gio' : 'personal';
    const eventName = isGioEvent(event)
      ? `Giỗ ${event.personName}${event.relationship ? ` (${event.relationship})` : ''}`
      : event.title;

    items.push({
      date: new Date(solarDate.year, solarDate.month - 1, solarDate.day),
      solarDate,
      lunarDate,
      name: eventName,
      type: eventType,
      description: event.notes,
    });
  }

  items.sort((a, b) => a.date.getTime() - b.date.getTime());

  return { year, items };
}
