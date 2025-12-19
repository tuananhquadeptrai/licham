import type { LunarDate } from '../lib/amlich/types';
import {
  KienTruDay,
  NhiThapBatTu,
  getKienTruByIndex,
  getNhiThapBatTuByIndex,
} from '../config/auspiciousStars';

/**
 * Chi của tháng âm lịch
 * Tháng Giêng = Dần (index 2), Tháng 2 = Mão (3), ...
 * Tháng 11 = Tý (0), Tháng 12 = Sửu (1)
 */
export function getMonthChiIndex(lunarMonth: number): number {
  // Tháng 1 (Giêng) = Dần (chi index 2)
  // Tháng 2 = Mão (3), Tháng 3 = Thìn (4), ...
  // Formula: (lunarMonth + 1) % 12
  return (lunarMonth + 1) % 12;
}

/**
 * Tính chỉ số Kiến Trừ (Trực) cho ngày âm lịch
 * Công thức: Kiến (index 0) rơi vào ngày có Chi giống Chi của tháng
 * Ví dụ: Tháng Dần (chi=2), ngày có chi=2 là ngày Kiến
 * 
 * @param lunarDate - Ngày âm lịch
 * @param monthChiIndex - Chỉ số Chi của tháng (0-11)
 * @returns Chỉ số Kiến Trừ (0-11)
 */
export function getKienTruIndex(lunarDate: LunarDate, monthChiIndex: number): number {
  // Chi của ngày = (JD + 1) % 12
  const dayChiIndex = (lunarDate.jd + 1) % 12;
  
  // Kiến là ngày có Chi = Chi của tháng
  // Khoảng cách từ ngày Kiến = (dayChiIndex - monthChiIndex + 12) % 12
  const kienTruIndex = ((dayChiIndex - monthChiIndex) % 12 + 12) % 12;
  
  return kienTruIndex;
}

/**
 * Tính sao Nhị Thập Bát Tú cho ngày
 * Dựa trên Julian Day Number, cycle 28 ngày
 * Reference: JD 2451934 (2001-01-01) là ngày sao Giác (index 0)
 * 
 * @param jd - Julian Day Number
 * @returns Chỉ số sao (0-27)
 */
export function getNhiThapBatTuIndex(jd: number): number {
  // JD 2451934 (2001-01-01) là ngày sao Giác (index 0)
  const referenceJD = 2451911;
  const offset = Math.floor(jd) - referenceJD;
  return ((offset % 28) + 28) % 28;
}

/**
 * Lấy thông tin Kiến Trừ cho ngày
 */
export function getKienTruForDate(lunarDate: LunarDate, monthChiIndex: number): KienTruDay {
  const index = getKienTruIndex(lunarDate, monthChiIndex);
  return getKienTruByIndex(index);
}

/**
 * Lấy thông tin Nhị Thập Bát Tú cho ngày
 */
export function getNhiThapBatTuForDate(jd: number): NhiThapBatTu {
  const index = getNhiThapBatTuIndex(jd);
  return getNhiThapBatTuByIndex(index);
}

export interface DayStarsInfo {
  kienTru: KienTruDay;
  nhiThapBatTu: NhiThapBatTu;
}

/**
 * Lấy thông tin sao đầy đủ cho ngày
 */
export function getDayStars(lunarDate: LunarDate, monthChiIndex: number): DayStarsInfo {
  return {
    kienTru: getKienTruForDate(lunarDate, monthChiIndex),
    nhiThapBatTu: getNhiThapBatTuForDate(lunarDate.jd),
  };
}
