/**
 * Test file for LunarService and Holidays
 * Run with: npx tsx src/services/__tests__/LunarService.test.ts
 */

import { LunarServiceImpl } from '../LunarServiceImpl';
import { solarHolidays, lunarHolidays } from '../../config/holidays';
import { solarTerms } from '../../config/solarTerms';

const service = new LunarServiceImpl();

console.log('=== LunarService Tests ===\n');

// Test 1: Solar to Lunar conversion
console.log('1. Solar to Lunar Conversion:');
const testDates = [
  { year: 2025, month: 1, day: 29 },  // Tết Nguyên Đán 2025 (Ất Tỵ)
  { year: 2025, month: 2, day: 12 },  // Rằm tháng Giêng
  { year: 2024, month: 2, day: 10 },  // Mùng 1 Tết 2024
  { year: 2025, month: 12, day: 18 }, // Hôm nay
];

testDates.forEach(solar => {
  const lunar = service.getLunarDate(solar);
  console.log(`  ${solar.day}/${solar.month}/${solar.year} → `
    + `${lunar.day}/${lunar.month}${lunar.isLeapMonth ? ' (nhuận)' : ''}/${lunar.year} `
    + `- ${lunar.canChi.ngay.can} ${lunar.canChi.ngay.chi}`
    + (lunar.tietKhi ? ` [${lunar.tietKhi}]` : ''));
});

// Test 2: Holidays mapping
console.log('\n2. Holidays Mapping:');
console.log(`  Solar holidays: ${solarHolidays.length}`);
console.log(`  Lunar holidays: ${lunarHolidays.length}`);

// Test ngày 1/1/2025 (Tết Dương lịch)
const jan1 = { year: 2025, month: 1, day: 1 };
const jan1Lunar = service.solarToLunar(jan1);
const jan1Holidays = service.getHolidaysForDate(jan1, jan1Lunar);
console.log(`  1/1/2025 holidays: ${jan1Holidays.map(h => h.name).join(', ') || 'none'}`);

// Test ngày 29/1/2025 (Mùng 1 Tết Ất Tỵ)
const tet2025 = { year: 2025, month: 1, day: 29 };
const tet2025Lunar = service.solarToLunar(tet2025);
const tet2025Holidays = service.getHolidaysForDate(tet2025, tet2025Lunar);
console.log(`  29/1/2025 (Mùng 1 Tết): ${tet2025Holidays.map(h => h.name).join(', ')}`);

// Test 3: Month view
console.log('\n3. Month View (December 2025):');
const monthView = service.getMonthView(2025, 12);
console.log(`  Total cells: ${monthView.cells.length}`);
console.log(`  Days in month: ${monthView.totalDays}`);
console.log(`  Lunar month: ${monthView.lunarMonthInfo.lunarMonth}/${monthView.lunarMonthInfo.lunarYear}`);

const cellsWithHolidays = monthView.cells.filter(c => c.holidays.length > 0 && !c.isOutsideCurrentMonth);
console.log(`  Days with holidays: ${cellsWithHolidays.length}`);
cellsWithHolidays.forEach(c => {
  console.log(`    ${c.solarDate.day}/12: ${c.holidays.map(h => h.name).join(', ')}`);
});

// Test 4: Solar terms
console.log('\n4. Solar Terms (24 Tiết Khí):');
console.log(`  Total: ${solarTerms.length}`);
solarTerms.slice(0, 6).forEach(term => {
  console.log(`    ${term.name} (${term.chineseName}) - ${term.approximateDate} - ${term.sunLongitude}°`);
});
console.log('    ...');

// Test 5: Lunar to Solar conversion
console.log('\n5. Lunar to Solar Conversion:');
const lunarDates = [
  { year: 2025, month: 1, day: 1, isLeapMonth: false, jd: 0 },  // Tết 2025
  { year: 2025, month: 8, day: 15, isLeapMonth: false, jd: 0 }, // Trung Thu 2025
];

lunarDates.forEach(lunar => {
  const solar = service.lunarToSolar(lunar);
  console.log(`  ${lunar.day}/${lunar.month}/${lunar.year} (âm) → ${solar.day}/${solar.month}/${solar.year} (dương)`);
});

// Test 6: Leap year
console.log('\n6. Leap Year Check:');
[2023, 2024, 2025, 2026].forEach(year => {
  const isLeap = service.isLeapYear(year);
  const leapMonth = service.getLeapMonth(year);
  console.log(`  ${year}: ${isLeap ? `Năm nhuận (tháng ${leapMonth})` : 'Không nhuận'}`);
});

console.log('\n=== All tests completed ===');
