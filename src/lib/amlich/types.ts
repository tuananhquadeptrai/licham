/**
 * Core types for Vietnamese Lunar Calendar
 */

export interface SolarDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export interface LunarDate {
  year: number;
  month: number;     // 1-12
  day: number;       // 1-30
  isLeapMonth: boolean;
  jd: number;        // Julian Day Number
}

export interface CanChi {
  can: string;       // Thiên can: Giáp, Ất, Bính, ...
  chi: string;       // Địa chi: Tý, Sửu, Dần, ...
  canIndex: number;  // 0-9
  chiIndex: number;  // 0-11
}

export interface CanChiDetail {
  ngay: CanChi;      // Can chi ngày
  thang: CanChi;     // Can chi tháng
  nam: CanChi;       // Can chi năm
  gio: CanChi;       // Can chi giờ (optional, dựa trên giờ Tý)
}

export interface LunarDateExtended extends LunarDate {
  canChi: CanChiDetail;
  tietKhi?: string;
  gioHoangDao: string[];
  ngayHoangDao: boolean;
  spitrituralHour?: GioHoangDao[];
}

export interface GioHoangDao {
  ten: string;       // Tên giờ: Tý, Sửu, ...
  start: string;     // "23:00"
  end: string;       // "01:00"
  isHoangDao: boolean;
}

// Enum cho các ngày trong tuần
export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export const DayOfWeekNames = {
  [DayOfWeek.Sunday]: 'Chủ Nhật',
  [DayOfWeek.Monday]: 'Thứ Hai',
  [DayOfWeek.Tuesday]: 'Thứ Ba',
  [DayOfWeek.Wednesday]: 'Thứ Tư',
  [DayOfWeek.Thursday]: 'Thứ Năm',
  [DayOfWeek.Friday]: 'Thứ Sáu',
  [DayOfWeek.Saturday]: 'Thứ Bảy',
} as const;

export interface CanChiSimple {
  day: string;
  month: string;
  year: string;
}
