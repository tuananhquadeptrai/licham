/**
 * LunarService Implementation
 * Sử dụng amlich library để chuyển đổi lịch
 */

import type {
  LunarService,
  CalendarDayCell,
  MonthViewData,
  MonthViewOptions,
} from './LunarService';
import type {
  SolarDate,
  LunarDate,
  LunarDateExtended,
  CanChiDetail,
  CanChi,
} from '../lib/amlich/types';
import type { Holiday } from '../config/holidays';
import { solarHolidays, lunarHolidays } from '../config/holidays';
import { solarTerms, isSolarTermDay } from '../config/solarTerms';
import type { MoonPhaseInfo, MoonPhase } from '../types/moonPhase';
import { MOON_PHASE_INFO } from '../types/moonPhase';

// Can và Chi arrays
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

/**
 * LunarService Implementation
 */
export class LunarServiceImpl implements LunarService {
  
  /**
   * Tính Julian Day Number từ ngày dương lịch
   */
  private jdFromDate(day: number, month: number, year: number): number {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4);
    
    if (year > 1582 || (year === 1582 && (month > 10 || (month === 10 && day > 14)))) {
      jd = jd - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    } else {
      jd = jd - 32083;
    }
    return jd;
  }

  /**
   * Chuyển Julian Day về ngày dương lịch
   */
  private jdToDate(jd: number): SolarDate {
    let b, c;
    if (jd > 2299160) {
      const a = Math.floor((jd - 1867216.25) / 36524.25);
      b = jd + 1 + a - Math.floor(a / 4);
    } else {
      b = jd;
    }
    
    c = b + 32082;
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);
    
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = d - 4800 + Math.floor(m / 10);
    
    return { year, month, day };
  }

  /**
   * Tính góc kinh độ Mặt Trời tại thời điểm Julian Day
   */
  private sunLongitude(jdn: number): number {
    const T = (jdn - 2451545.0) / 36525;
    const T2 = T * T;
    const dr = Math.PI / 180;
    const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    const DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    const L = L0 + DL;
    return ((L * 10000) % 3600000) / 10000;
  }

  /**
   * Tìm ngày bắt đầu tháng âm lịch thứ k (tháng 11 âm năm 1899 là k = 0)
   */
  private getNewMoonDay(k: number): number {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = Math.PI / 180;
    
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * Mpr * dr);
    C1 = C1 - 0.0004 * Math.sin(3 * Mpr * dr);
    C1 = C1 + 0.0104 * Math.sin(2 * F * dr) - 0.0051 * Math.sin((M + Mpr) * dr);
    C1 = C1 - 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
    C1 = C1 - 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
    C1 = C1 + 0.0010 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);
    
    let deltaT: number;
    if (T < -11) {
      deltaT = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
      deltaT = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    
    return Math.floor(Jd1 + C1 - deltaT + 0.5 + 0.5);
  }

  /**
   * Tính tháng âm lịch bắt đầu vào ngày Sóc có JD = jd
   */
  private getSunLongitudeAtMidnight(jd: number): number {
    return Math.floor(this.sunLongitude(jd + 0.5 - 7.0 / 24) / 30);
  }

  /**
   * Tìm tháng nhuận
   */
  private getLeapMonthOffset(a11: number): number {
    let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = this.getSunLongitudeAtMidnight(this.getNewMoonDay(k + i));
    
    do {
      last = arc;
      i++;
      arc = this.getSunLongitudeAtMidnight(this.getNewMoonDay(k + i));
    } while (arc !== last && i < 14);
    
    return i - 1;
  }

  /**
   * Chuyển ngày dương sang âm
   */
  solarToLunar(solar: SolarDate): LunarDate {
    const { year: yy, month: mm, day: dd } = solar;
    const dayNumber = this.jdFromDate(dd, mm, yy);
    
    let k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = this.getNewMoonDay(k + 1);
    
    if (monthStart > dayNumber) {
      monthStart = this.getNewMoonDay(k);
    }
    
    let a11 = this.getLunarMonth11(yy);
    let b11 = a11;
    
    let lunarYear: number;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = this.getLunarMonth11(yy - 1);
    } else {
      lunarYear = yy + 1;
      b11 = this.getLunarMonth11(yy + 1);
    }
    
    const lunarDay = dayNumber - monthStart + 1;
    const diff = Math.floor((monthStart - a11) / 29);
    
    let lunarLeap = false;
    let lunarMonth = diff + 11;
    
    if (b11 - a11 > 365) {
      const leapMonthDiff = this.getLeapMonthOffset(a11);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) {
          lunarLeap = true;
        }
      }
    }
    
    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1;
    }
    
    return {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay,
      isLeapMonth: lunarLeap,
      jd: dayNumber,
    };
  }

  /**
   * Tìm ngày Sóc tháng 11 âm lịch
   */
  private getLunarMonth11(yy: number): number {
    const off = this.jdFromDate(31, 12, yy) - 2415021;
    const k = Math.floor(off / 29.530588853);
    let nm = this.getNewMoonDay(k);
    const sunLong = Math.floor(this.sunLongitude(nm + 0.5 - 7.0 / 24) / 30);
    
    if (sunLong >= 9) {
      nm = this.getNewMoonDay(k - 1);
    }
    return nm;
  }

  /**
   * Chuyển ngày âm sang dương
   */
  lunarToSolar(lunar: LunarDate): SolarDate {
    let a11: number, b11: number;
    
    if (lunar.month < 11) {
      a11 = this.getLunarMonth11(lunar.year - 1);
      b11 = this.getLunarMonth11(lunar.year);
    } else {
      a11 = this.getLunarMonth11(lunar.year);
      b11 = this.getLunarMonth11(lunar.year + 1);
    }
    
    let off = lunar.month - 11;
    if (off < 0) {
      off += 12;
    }
    
    if (b11 - a11 > 365) {
      const leapOff = this.getLeapMonthOffset(a11);
      let leapMonth = leapOff - 2;
      if (leapMonth < 0) {
        leapMonth += 12;
      }
      
      if (lunar.isLeapMonth && lunar.month !== leapMonth) {
        return { year: 0, month: 0, day: 0 }; // Invalid
      } else if (lunar.isLeapMonth || off >= leapOff) {
        off += 1;
      }
    }
    
    const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    const monthStart = this.getNewMoonDay(k + off);
    
    return this.jdToDate(monthStart + lunar.day - 1);
  }

  /**
   * Tính Can Chi cho ngày
   */
  getCanChi(solar: SolarDate): CanChiDetail {
    const jd = this.jdFromDate(solar.day, solar.month, solar.year);
    
    // Can chi ngày
    const dayCanIndex = (jd + 9) % 10;
    const dayChiIndex = (jd + 1) % 12;
    
    // Can chi năm
    const yearCanIndex = (solar.year + 6) % 10;
    const yearChiIndex = (solar.year + 8) % 12;
    
    // Can chi tháng: Can tháng = (Can năm % 5) * 2 + tháng âm lịch
    // Đơn giản hóa: dùng công thức gần đúng
    const monthCanIndex = (yearCanIndex * 2 + solar.month) % 10;
    const monthChiIndex = (solar.month + 1) % 12;
    
    // Can chi giờ (Tý = 23:00-01:00)
    const hourCanIndex = (dayCanIndex * 2) % 10;
    const hourChiIndex = 0; // Mặc định giờ Tý
    
    const createCanChi = (canIdx: number, chiIdx: number): CanChi => ({
      can: CAN[canIdx],
      chi: CHI[chiIdx],
      canIndex: canIdx,
      chiIndex: chiIdx,
    });
    
    return {
      ngay: createCanChi(dayCanIndex, dayChiIndex),
      thang: createCanChi(monthCanIndex, monthChiIndex),
      nam: createCanChi(yearCanIndex, yearChiIndex),
      gio: createCanChi(hourCanIndex, hourChiIndex),
    };
  }

  /**
   * Implement LunarService interface
   */
  getLunarDate(solar: SolarDate): LunarDateExtended {
    const lunar = this.solarToLunar(solar);
    const canChi = this.getCanChi(solar);
    const tietKhi = this.getSolarTermForDate(solar);
    
    // Tính giờ hoàng đạo (đơn giản hóa)
    const gioHoangDao = this.calculateGioHoangDao(canChi.ngay.chiIndex);
    
    return {
      ...lunar,
      canChi,
      tietKhi,
      gioHoangDao,
      ngayHoangDao: this.isNgayHoangDao(canChi.ngay),
    };
  }

  /**
   * Tính giờ hoàng đạo theo Chi của ngày
   */
  private calculateGioHoangDao(dayChiIndex: number): string[] {
    // Quy tắc giờ hoàng đạo theo địa chi ngày
    const hoangDaoMap: Record<number, number[]> = {
      0: [0, 1, 4, 5, 6, 7],      // Tý
      1: [2, 3, 4, 5, 8, 9],      // Sửu
      2: [0, 1, 4, 5, 6, 7],      // Dần
      3: [2, 3, 4, 5, 8, 9],      // Mão
      4: [0, 1, 4, 5, 6, 7],      // Thìn
      5: [2, 3, 4, 5, 8, 9],      // Tỵ
      6: [0, 1, 4, 5, 6, 7],      // Ngọ
      7: [2, 3, 4, 5, 8, 9],      // Mùi
      8: [0, 1, 4, 5, 6, 7],      // Thân
      9: [2, 3, 4, 5, 8, 9],      // Dậu
      10: [0, 1, 4, 5, 6, 7],     // Tuất
      11: [2, 3, 4, 5, 8, 9],     // Hợi
    };
    
    const indices = hoangDaoMap[dayChiIndex] || [];
    return indices.map(i => CHI[i]);
  }

  /**
   * Kiểm tra ngày hoàng đạo (đơn giản hóa)
   */
  private isNgayHoangDao(ngayChi: CanChi): boolean {
    // Các ngày hoàng đạo là các ngày có Chi thuộc nhóm: Dần, Thìn, Tỵ, Mùi, Tuất, Hợi
    const hoangDaoChi = [2, 4, 5, 7, 10, 11];
    return hoangDaoChi.includes(ngayChi.chiIndex);
  }

  getMonthView(year: number, month: number, options?: MonthViewOptions): MonthViewData {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const totalDays = lastDay.getDate();
    
    // Ngày đầu tiên của tuần chứa ngày 1
    const startOfWeek = options?.startOfWeek ?? 0;
    let firstDayOfWeek = firstDay.getDay();
    
    // Điều chỉnh nếu tuần bắt đầu từ thứ 2
    if (startOfWeek === 1) {
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    }
    
    const cells: CalendarDayCell[] = [];
    const today = new Date();
    const todaySolar: SolarDate = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
    
    // Lấy thông tin tháng âm lịch
    const midMonthLunar = this.solarToLunar({ year, month, day: 15 });
    
    // Tạo 42 cells
    for (let i = 0; i < 42; i++) {
      const dayOffset = i - firstDayOfWeek;
      const currentDate = new Date(year, month - 1, 1 + dayOffset);
      
      const solarDate: SolarDate = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
      };
      
      const lunarDate = this.solarToLunar(solarDate);
      const canChi = this.getCanChi(solarDate);
      const holidays = this.getHolidaysForDate(solarDate, lunarDate);
      const tietKhi = this.getSolarTermForDate(solarDate);
      
      const isToday = 
        solarDate.year === todaySolar.year &&
        solarDate.month === todaySolar.month &&
        solarDate.day === todaySolar.day;
      
      const isSelected = options?.selectedDate
        ? solarDate.year === options.selectedDate.year &&
          solarDate.month === options.selectedDate.month &&
          solarDate.day === options.selectedDate.day
        : false;
      
      const dayOfWeek = currentDate.getDay();
      
      cells.push({
        solarDate,
        lunarDate,
        canChi,
        isToday,
        isSelected,
        isOutsideCurrentMonth: solarDate.month !== month,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        holidays,
        tietKhi,
        dayOfWeek,
        weekOfMonth: Math.floor(i / 7) + 1,
      });
    }
    
    return {
      year,
      month,
      cells,
      firstDayOfMonth: firstDay,
      lastDayOfMonth: lastDay,
      totalDays,
      lunarMonthInfo: {
        lunarMonth: midMonthLunar.month,
        lunarYear: midMonthLunar.year,
        isLeapMonth: midMonthLunar.isLeapMonth,
      },
    };
  }

  getHolidaysForDate(solar: SolarDate, lunar: LunarDate): Holiday[] {
    const holidays: Holiday[] = [];
    
    // Tra cứu ngày lễ dương lịch
    for (const h of solarHolidays) {
      if (h.month === solar.month && h.day === solar.day) {
        holidays.push(h);
      }
    }
    
    // Tra cứu ngày lễ âm lịch
    for (const h of lunarHolidays) {
      if (h.month === lunar.month && h.day === lunar.day) {
        holidays.push(h);
      }
    }
    
    return holidays;
  }

  getSolarTermForDate(solar: SolarDate): string | undefined {
    const jd = this.jdFromDate(solar.day, solar.month, solar.year);
    const currentLong = this.sunLongitude(jd + 0.5 - 7.0 / 24);
    const prevLong = this.sunLongitude(jd - 0.5 - 7.0 / 24);
    
    const term = isSolarTermDay(currentLong, prevLong);
    return term?.name;
  }

  isLeapYear(lunarYear: number): boolean {
    return this.getLeapMonth(lunarYear) > 0;
  }

  getLeapMonth(lunarYear: number): number {
    const a11 = this.getLunarMonth11(lunarYear - 1);
    const b11 = this.getLunarMonth11(lunarYear);
    
    if (b11 - a11 > 365) {
      const leapOffset = this.getLeapMonthOffset(a11);
      let leapMonth = leapOffset - 2;
      if (leapMonth < 0) leapMonth += 12;
      return leapMonth;
    }
    
    return 0;
  }

  getMoonPhase(solar: SolarDate): MoonPhaseInfo {
    const jd = this.jdFromDate(solar.day, solar.month, solar.year);
    const SYNODIC_MONTH = 29.53058868;
    
    // Find the nearest new moon by calculating k
    let k = Math.floor((jd - 2415021.076998695) / SYNODIC_MONTH);
    let newMoonJd = this.getNewMoonDay(k);
    
    // Adjust if the new moon is after current date
    if (newMoonJd > jd) {
      k--;
      newMoonJd = this.getNewMoonDay(k);
    }
    
    // Moon age in days since last new moon
    const age = jd - newMoonJd;
    
    // Calculate illumination (approximate using cosine)
    const illumination = (1 - Math.cos((age / SYNODIC_MONTH) * 2 * Math.PI)) / 2;
    
    // Determine phase based on age
    let phase: MoonPhase;
    if (age < 1.85) {
      phase = 'new';
    } else if (age < 7.38) {
      phase = 'waxing_crescent';
    } else if (age < 11.08) {
      phase = 'first_quarter';
    } else if (age < 14.77) {
      phase = 'waxing_gibbous';
    } else if (age < 18.46) {
      phase = 'full';
    } else if (age < 22.15) {
      phase = 'waning_gibbous';
    } else if (age < 25.84) {
      phase = 'last_quarter';
    } else {
      phase = 'waning_crescent';
    }
    
    const info = MOON_PHASE_INFO[phase];
    
    return {
      phase,
      age: Math.round(age * 100) / 100,
      illumination: Math.round(illumination * 100),
      labelVi: info.labelVi,
      labelEn: info.labelEn,
      icon: info.icon,
    };
  }
}

// Singleton instance
let instance: LunarServiceImpl | null = null;

export function getLunarService(): LunarService {
  if (!instance) {
    instance = new LunarServiceImpl();
  }
  return instance;
}

export default LunarServiceImpl;
