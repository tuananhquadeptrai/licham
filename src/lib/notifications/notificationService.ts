import type { CalendarEvent, ReminderOffset } from '../../types/events';
import type { LunarService } from '../../services/LunarService';

const scheduledTimers: Map<string, number> = new Map();

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
}

export function canNotify(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function showNotification(title: string, body: string, options?: NotificationOptions): void {
  if (!canNotify()) {
    console.warn('Notifications not permitted');
    return;
  }
  
  const notification = new Notification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'lunar-calendar-reminder',
    ...options,
  });
  
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
  
  setTimeout(() => notification.close(), 10000);
}

function getReminderOffsetMs(offset: ReminderOffset): number {
  switch (offset) {
    case 'at_time':
      return 0;
    case '5m':
      return 5 * 60 * 1000;
    case '1h':
      return 60 * 60 * 1000;
    case '1d':
      return 24 * 60 * 60 * 1000;
    case '3d':
      return 3 * 24 * 60 * 60 * 1000;
    case 'none':
    default:
      return -1;
  }
}

function getEventDateTime(
  event: CalendarEvent,
  lunarService: LunarService
): Date | null {
  let solarDate: { year: number; month: number; day: number } | null = null;
  
  if (event.dateType === 'solar' && event.solarDate) {
    const currentYear = new Date().getFullYear();
    if (event.recurrence.frequency === 'yearly') {
      const thisYear = { ...event.solarDate, year: currentYear };
      const nextYear = { ...event.solarDate, year: currentYear + 1 };
      const now = new Date();
      const thisYearDate = new Date(thisYear.year, thisYear.month - 1, thisYear.day);
      solarDate = thisYearDate >= now ? thisYear : nextYear;
    } else {
      solarDate = event.solarDate;
    }
  } else if (event.dateType === 'lunar' && event.lunarDate) {
    const currentYear = new Date().getFullYear();
    const lunarDate = event.recurrence.frequency === 'yearly'
      ? { ...event.lunarDate, year: currentYear }
      : event.lunarDate;
    
    const solar = lunarService.lunarToSolar({
      ...lunarDate,
      isLeapMonth: lunarDate.isLeapMonth ?? false,
      jd: 0,
    });
    if (solar.year === 0) return null;
    
    const now = new Date();
    const eventDate = new Date(solar.year, solar.month - 1, solar.day);
    
    if (event.recurrence.frequency === 'yearly' && eventDate < now) {
      const nextYearLunar = { ...event.lunarDate, year: currentYear + 1 };
      const nextSolar = lunarService.lunarToSolar({
        ...nextYearLunar,
        isLeapMonth: nextYearLunar.isLeapMonth ?? false,
        jd: 0,
      });
      if (nextSolar.year !== 0) {
        solarDate = nextSolar;
      }
    } else {
      solarDate = solar;
    }
  }
  
  if (!solarDate) return null;
  
  const date = new Date(solarDate.year, solarDate.month - 1, solarDate.day);
  
  if (!event.allDay && event.startTime) {
    const [hours, minutes] = event.startTime.split(':').map(Number);
    date.setHours(hours || 0, minutes || 0, 0, 0);
  } else {
    date.setHours(9, 0, 0, 0);
  }
  
  return date;
}

export function scheduleEventReminders(
  events: CalendarEvent[],
  lunarService: LunarService
): void {
  clearScheduledReminders();
  
  if (!canNotify()) return;
  
  const now = Date.now();
  const maxScheduleTime = 7 * 24 * 60 * 60 * 1000;
  
  for (const event of events) {
    if (event.reminder === 'none') continue;
    
    const eventDateTime = getEventDateTime(event, lunarService);
    if (!eventDateTime) continue;
    
    const offsetMs = getReminderOffsetMs(event.reminder);
    if (offsetMs < 0) continue;
    
    const reminderTime = eventDateTime.getTime() - offsetMs;
    const delay = reminderTime - now;
    
    if (delay > 0 && delay <= maxScheduleTime) {
      const timerId = window.setTimeout(() => {
        const reminderText = offsetMs === 0
          ? 'Đã đến giờ!'
          : formatReminderText(offsetMs);
        
        showNotification(
          `📅 ${event.title}`,
          reminderText,
          { tag: `reminder-${event.id}` }
        );
        
        scheduledTimers.delete(event.id);
      }, delay);
      
      scheduledTimers.set(event.id, timerId);
    }
  }
}

function formatReminderText(offsetMs: number): string {
  const minutes = offsetMs / (60 * 1000);
  if (minutes < 60) return `Còn ${minutes} phút`;
  
  const hours = minutes / 60;
  if (hours < 24) return `Còn ${hours} giờ`;
  
  const days = hours / 24;
  return `Còn ${days} ngày`;
}

export function clearScheduledReminders(): void {
  for (const timerId of scheduledTimers.values()) {
    clearTimeout(timerId);
  }
  scheduledTimers.clear();
}

export function getScheduledReminderCount(): number {
  return scheduledTimers.size;
}
