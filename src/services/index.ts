import { getLunarService } from './LunarServiceImpl';
import type { SolarDate } from '../lib/amlich/types';
import type { Holiday } from '../config/holidays';

const service = getLunarService();

export interface LunarInfo {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
}

export interface CanChiInfo {
  day: string;
  month: string;
  year: string;
}

export interface SolarTermInfo {
  name: string;
}

export const LunarService = {
  getLunarDate(date: Date): LunarInfo {
    const solar: SolarDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    const lunar = service.getLunarDate(solar);
    return {
      day: lunar.day,
      month: lunar.month,
      year: lunar.year,
      isLeapMonth: lunar.isLeapMonth,
    };
  },

  getCanChiInfo(date: Date): CanChiInfo {
    const solar: SolarDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    const canChi = service.getCanChi(solar);
    return {
      day: `${canChi.ngay.can} ${canChi.ngay.chi}`,
      month: `${canChi.thang.can} ${canChi.thang.chi}`,
      year: `${canChi.nam.can} ${canChi.nam.chi}`,
    };
  },

  getHolidayInfo(date: Date): Holiday | null {
    const solar: SolarDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    const lunar = service.getLunarDate(solar);
    const holidays = service.getHolidaysForDate(solar, lunar);
    return holidays.length > 0 ? holidays[0] : null;
  },

  getSolarTerm(date: Date): SolarTermInfo | null {
    const solar: SolarDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    const term = service.getSolarTermForDate(solar);
    return term ? { name: term } : null;
  },

  getGoodHours(date: Date): string[] {
    const solar: SolarDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    const lunar = service.getLunarDate(solar);
    return lunar.gioHoangDao || [];
  },
};
