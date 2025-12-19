import type { CalendarEvent } from '../../types/events';
import type { LunarService } from '../../services/LunarService';
import { isGioEvent } from '../../types/events';

function formatICSDate(date: Date, allDay: boolean): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  if (allDay) {
    return `${year}${month}${day}`;
  }
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function generateUID(eventId: string): string {
  return `${eventId}@vietnamese-lunar-calendar`;
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
}

function getSolarDateForEvent(
  event: CalendarEvent,
  lunarService: LunarService,
  targetYear: number
): { year: number; month: number; day: number } | null {
  if (event.dateType === 'solar' && event.solarDate) {
    if (event.recurrence.frequency === 'yearly') {
      return { ...event.solarDate, year: targetYear };
    }
    return event.solarDate;
  }
  
  if (event.dateType === 'lunar' && event.lunarDate) {
    const lunarDate = event.recurrence.frequency === 'yearly'
      ? { ...event.lunarDate, year: targetYear }
      : event.lunarDate;
    
    const solar = lunarService.lunarToSolar({
      ...lunarDate,
      isLeapMonth: lunarDate.isLeapMonth ?? false,
      jd: 0,
    });
    
    if (solar.year === 0) return null;
    return solar;
  }
  
  return null;
}

export function eventToVEvent(
  event: CalendarEvent,
  lunarService: LunarService,
  targetYear?: number
): string {
  const year = targetYear ?? new Date().getFullYear();
  const solarDate = getSolarDateForEvent(event, lunarService, year);
  
  if (!solarDate) return '';
  
  const startDate = new Date(solarDate.year, solarDate.month - 1, solarDate.day);
  
  if (!event.allDay && event.startTime) {
    const { hours, minutes } = parseTime(event.startTime);
    startDate.setHours(hours, minutes, 0, 0);
  }
  
  let endDate = new Date(startDate);
  if (event.allDay) {
    endDate.setDate(endDate.getDate() + 1);
  } else if (event.endTime) {
    const { hours, minutes } = parseTime(event.endTime);
    endDate = new Date(solarDate.year, solarDate.month - 1, solarDate.day, hours, minutes);
  } else {
    endDate.setHours(endDate.getHours() + 1);
  }
  
  const now = new Date();
  const dtstamp = formatICSDate(now, false) + 'Z';
  
  let description = event.notes || '';
  if (isGioEvent(event)) {
    const gioInfo = [`Tên: ${event.personName}`];
    if (event.relationship) gioInfo.push(`Quan hệ: ${event.relationship}`);
    if (event.yearOfDeath) gioInfo.push(`Năm mất: ${event.yearOfDeath}`);
    description = gioInfo.join('\\n') + (description ? `\\n\\n${description}` : '');
  }
  
  if (event.dateType === 'lunar' && event.lunarDate) {
    const lunarInfo = `Âm lịch: ${event.lunarDate.day}/${event.lunarDate.month}${event.lunarDate.isLeapMonth ? ' (nhuận)' : ''}`;
    description = description ? `${lunarInfo}\\n\\n${description}` : lunarInfo;
  }
  
  const lines = [
    'BEGIN:VEVENT',
    `UID:${generateUID(event.id)}`,
    `DTSTAMP:${dtstamp}`,
  ];
  
  if (event.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${formatICSDate(startDate, true)}`);
    lines.push(`DTEND;VALUE=DATE:${formatICSDate(endDate, true)}`);
  } else {
    lines.push(`DTSTART:${formatICSDate(startDate, false)}`);
    lines.push(`DTEND:${formatICSDate(endDate, false)}`);
  }
  
  lines.push(`SUMMARY:${escapeICSText(event.title)}`);
  
  if (description) {
    lines.push(`DESCRIPTION:${escapeICSText(description)}`);
  }
  
  if (event.recurrence.frequency === 'yearly') {
    lines.push('RRULE:FREQ=YEARLY');
  } else if (event.recurrence.frequency === 'monthly') {
    lines.push(`RRULE:FREQ=MONTHLY;BYMONTHDAY=${startDate.getDate()}`);
  }
  
  lines.push('END:VEVENT');
  
  return lines.join('\r\n');
}

export function eventsToICS(
  events: CalendarEvent[],
  lunarService: LunarService
): string {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vietnamese Lunar Calendar//VN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Lịch Âm Dương Việt Nam',
  ].join('\r\n');
  
  const vevents: string[] = [];
  
  for (const event of events) {
    const vevent = eventToVEvent(event, lunarService, currentYear);
    if (vevent) vevents.push(vevent);
    
    if (event.recurrence.frequency === 'none' && event.dateType === 'lunar') {
      const nextYearVevent = eventToVEvent(event, lunarService, nextYear);
      if (nextYearVevent) vevents.push(nextYearVevent);
    }
  }
  
  const footer = 'END:VCALENDAR';
  
  return [header, ...vevents, footer].join('\r\n');
}

export function downloadICS(
  events: CalendarEvent[],
  lunarService: LunarService,
  filename: string = 'lich-am-duong.ics'
): void {
  const icsContent = eventsToICS(events, lunarService);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
