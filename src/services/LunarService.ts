/**
 * LunarService Interface
 * Service cho việc chuyển đổi và xử lý lịch âm dương
 */

import type { SolarDate, LunarDate, LunarDateExtended, CanChiDetail } from '../lib/amlich/types';
import type { Holiday } from '../config/holidays';
import type { MoonPhaseInfo } from '../types/moonPhase';

/**
 * Calendar cell hiển thị trong grid view
 */
export interface CalendarDayCell {
  // Dates
  solarDate: SolarDate;
  lunarDate: LunarDate;
  
  // Can Chi
  canChi: CanChiDetail;
  
  // UI states
  isToday: boolean;
  isSelected: boolean;
  isOutsideCurrentMonth: boolean;
  isWeekend: boolean;
  
  // Events & holidays
  holidays: Holiday[];
  
  // Additional info
  tietKhi?: string;           // Solar term nếu có
  dayOfWeek: number;          // 0-6 (CN-T7)
  weekOfMonth: number;        // 1-6
}

/**
 * Thông tin tháng để render calendar grid
 */
export interface MonthViewData {
  year: number;
  month: number;
  cells: CalendarDayCell[];     // 42 cells (6 weeks x 7 days)
  firstDayOfMonth: Date;
  lastDayOfMonth: Date;
  totalDays: number;
  lunarMonthInfo: {
    lunarMonth: number;
    lunarYear: number;
    isLeapMonth: boolean;
  };
}

/**
 * Options cho month view
 */
export interface MonthViewOptions {
  selectedDate?: SolarDate;
  includeOutsideDays?: boolean;  // Hiển thị ngày của tháng trước/sau
  startOfWeek?: 0 | 1;           // 0: Sunday, 1: Monday
}

/**
 * LunarService Interface
 */
export interface LunarService {
  /**
   * Chuyển đổi ngày dương sang âm với đầy đủ thông tin
   */
  getLunarDate(solar: SolarDate): LunarDateExtended;
  
  /**
   * Lấy dữ liệu để render calendar grid cho tháng
   * Trả về 42 cells (6 tuần x 7 ngày)
   */
  getMonthView(year: number, month: number, options?: MonthViewOptions): MonthViewData;
  
  /**
   * Lấy danh sách ngày lễ cho một ngày cụ thể
   * Tra cứu cả ngày lễ dương lịch và âm lịch
   */
  getHolidaysForDate(solar: SolarDate, lunar: LunarDate): Holiday[];
  
  /**
   * Lấy tiết khí cho một ngày dương lịch
   */
  getSolarTermForDate(solar: SolarDate): string | undefined;
  
  /**
   * Chuyển đổi ngày âm sang dương
   */
  lunarToSolar(lunar: LunarDate): SolarDate;
  
  /**
   * Lấy Can Chi cho một ngày
   */
  getCanChi(solar: SolarDate): CanChiDetail;
  
  /**
   * Kiểm tra năm nhuận âm lịch
   */
  isLeapYear(lunarYear: number): boolean;
  
  /**
   * Lấy tháng nhuận của năm âm lịch (0 nếu không có)
   */
  getLeapMonth(lunarYear: number): number;
  
  /**
   * Lấy thông tin pha mặt trăng cho một ngày dương lịch
   */
  getMoonPhase(solar: SolarDate): MoonPhaseInfo;
}
