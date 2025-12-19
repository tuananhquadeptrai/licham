import { describe, it, expect } from 'vitest';
import { solarToLunar, lunarToSolar, getCanChi, jdFromDate, dateFromJd } from '../amlich';
import type { SolarDate, LunarDate } from '../types';

describe('Âm Lịch - Ho Ngọc Đức Algorithm', () => {
  
  describe('Julian Day conversion', () => {
    it('converts solar date to Julian Day correctly', () => {
      // 2024-02-10 should be JD 2460351
      expect(jdFromDate(10, 2, 2024)).toBe(2460351);
    });

    it('converts Julian Day back to solar date', () => {
      const result = dateFromJd(2460351);
      expect(result).toEqual({ day: 10, month: 2, year: 2024 });
    });
  });

  describe('Tết Nguyên Đán các năm', () => {
    it('2024-02-10 → 1/1/2024 AL (Giáp Thìn)', () => {
      const solar: SolarDate = { year: 2024, month: 2, day: 10 };
      const lunar = solarToLunar(solar, 7);
      
      expect(lunar.year).toBe(2024);
      expect(lunar.month).toBe(1);
      expect(lunar.day).toBe(1);
      expect(lunar.isLeapMonth).toBe(false);
    });

    it('2023-01-22 → 1/1/2023 AL (Quý Mão)', () => {
      const solar: SolarDate = { year: 2023, month: 1, day: 22 };
      const lunar = solarToLunar(solar, 7);
      
      expect(lunar.year).toBe(2023);
      expect(lunar.month).toBe(1);
      expect(lunar.day).toBe(1);
      expect(lunar.isLeapMonth).toBe(false);
    });

    it('2025-01-29 → 1/1/2025 AL (Ất Tỵ)', () => {
      const solar: SolarDate = { year: 2025, month: 1, day: 29 };
      const lunar = solarToLunar(solar, 7);
      
      expect(lunar.year).toBe(2025);
      expect(lunar.month).toBe(1);
      expect(lunar.day).toBe(1);
      expect(lunar.isLeapMonth).toBe(false);
    });
  });

  describe('Round-trip conversion', () => {
    const testCases: SolarDate[] = [
      { year: 2024, month: 2, day: 10 },
      { year: 2023, month: 1, day: 22 },
      { year: 2025, month: 1, day: 29 },
      { year: 2024, month: 6, day: 15 },
      { year: 2023, month: 12, day: 31 },
    ];

    testCases.forEach((solar) => {
      it(`solar → lunar → solar = original: ${solar.year}-${solar.month}-${solar.day}`, () => {
        const lunar = solarToLunar(solar, 7);
        const backToSolar = lunarToSolar(lunar, 7);
        
        expect(backToSolar.year).toBe(solar.year);
        expect(backToSolar.month).toBe(solar.month);
        expect(backToSolar.day).toBe(solar.day);
      });
    });
  });

  describe('Năm nhuận âm lịch', () => {
    it('2023 có tháng 2 nhuận (tháng 2 xuất hiện 2 lần)', () => {
      // 2023-03-22 is 2/1 leap month in lunar calendar
      const solar: SolarDate = { year: 2023, month: 3, day: 22 };
      const lunar = solarToLunar(solar, 7);
      
      expect(lunar.month).toBe(2);
      expect(lunar.isLeapMonth).toBe(true);
    });

    it('tháng 2 thường và tháng 2 nhuận khác nhau', () => {
      // Regular 2nd month: around 2023-02-20
      const regular: SolarDate = { year: 2023, month: 2, day: 20 };
      const regularLunar = solarToLunar(regular, 7);
      
      // Leap 2nd month: around 2023-03-22
      const leap: SolarDate = { year: 2023, month: 3, day: 22 };
      const leapLunar = solarToLunar(leap, 7);
      
      expect(regularLunar.month).toBe(2);
      expect(regularLunar.isLeapMonth).toBe(false);
      expect(leapLunar.month).toBe(2);
      expect(leapLunar.isLeapMonth).toBe(true);
    });
  });

  describe('Biên tháng: 29/30 Chạp → 1/1 Giêng', () => {
    it('ngày cuối tháng Chạp chuyển sang mùng 1 Tết đúng', () => {
      // 2024-02-09 is 30 Chạp (last day of lunar year 2023)
      const lastDayLunar2023: SolarDate = { year: 2024, month: 2, day: 9 };
      const lunarLast = solarToLunar(lastDayLunar2023, 7);
      
      // 2024-02-10 is mùng 1 Tết (first day of lunar year 2024)
      const firstDayLunar2024: SolarDate = { year: 2024, month: 2, day: 10 };
      const lunarFirst = solarToLunar(firstDayLunar2024, 7);
      
      expect(lunarLast.month).toBe(12);
      expect(lunarLast.year).toBe(2023);
      expect(lunarFirst.month).toBe(1);
      expect(lunarFirst.day).toBe(1);
      expect(lunarFirst.year).toBe(2024);
    });
  });

  describe('Can Chi', () => {
    it('tính đúng can chi cho năm Giáp Thìn 2024', () => {
      const lunar: LunarDate = { year: 2024, month: 1, day: 1, isLeapMonth: false, jd: 2460351 };
      const canchi = getCanChi(lunar);
      
      expect(canchi.year).toBe('Giáp Thìn');
    });

    it('tính đúng can chi cho năm Quý Mão 2023', () => {
      const lunar: LunarDate = { year: 2023, month: 1, day: 1, isLeapMonth: false, jd: 2459966 };
      const canchi = getCanChi(lunar);
      
      expect(canchi.year).toBe('Quý Mão');
    });

    it('tính đúng can chi cho năm Ất Tỵ 2025', () => {
      const lunar: LunarDate = { year: 2025, month: 1, day: 1, isLeapMonth: false, jd: 2460705 };
      const canchi = getCanChi(lunar);
      
      expect(canchi.year).toBe('Ất Tỵ');
    });

    it('can chi ngày phải đúng chu kỳ 60', () => {
      const lunar1: LunarDate = { year: 2024, month: 1, day: 1, isLeapMonth: false, jd: 2460351 };
      const lunar2: LunarDate = { year: 2024, month: 1, day: 1, isLeapMonth: false, jd: 2460351 + 60 };
      
      const canchi1 = getCanChi(lunar1);
      const canchi2 = getCanChi(lunar2);
      
      expect(canchi1.day).toBe(canchi2.day);
    });
  });
});
