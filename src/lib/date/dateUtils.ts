import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay,
  isWeekend,
} from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

export type LocaleCode = 'vi' | 'en';

const localeMap = {
  vi: vi,
  en: enUS,
};

export function getLocale(code: LocaleCode) {
  return localeMap[code] || vi;
}

export function getCalendarDays(year: number, month: number): Date[] {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function formatDate(date: Date, formatStr: string, locale: LocaleCode = 'vi'): string {
  return format(date, formatStr, { locale: getLocale(locale) });
}

export function getMonthName(month: number, locale: LocaleCode = 'vi'): string {
  const date = new Date(2024, month);
  return format(date, 'MMMM', { locale: getLocale(locale) });
}

export function getWeekdayNames(locale: LocaleCode = 'vi', short = true): string[] {
  if (locale === 'vi') {
    return short 
      ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
      : ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
  }
  return short
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
}

export function getDayOfWeek(date: Date): number {
  const day = getDay(date);
  return day === 0 ? 6 : day - 1;
}

export { isSameMonth, isSameDay, isToday, addMonths, subMonths, isWeekend };
