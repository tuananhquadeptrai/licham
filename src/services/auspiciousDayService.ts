/**
 * Auspicious Day Service
 * Calculate auspiciousness for dates based on Vietnamese lunar calendar traditions
 */

import type { ActivityType, DayAuspiciousness } from '../types/auspicious';
import { AUSPICIOUS_RULES, CHI_NAMES, SCORE_WEIGHTS } from '../config/auspiciousRules';
import { getLunarService } from './LunarServiceImpl';
import type { SolarDate, LunarDateExtended } from '../lib/amlich/types';

/**
 * Get auspiciousness score and details for a specific date and activity
 */
export function getAuspiciousnessForDate(
  date: Date,
  activity: ActivityType
): DayAuspiciousness {
  const service = getLunarService();
  const solarDate: SolarDate = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };

  const lunarDate: LunarDateExtended = service.getLunarDate(solarDate);
  const rule = AUSPICIOUS_RULES[activity];

  let score = SCORE_WEIGHTS.baseScore;
  const tags: string[] = [];
  const reasons: string[] = [];

  const canChi = lunarDate.canChi;
  const dayChiIndex = canChi.ngay.chiIndex;
  const dayCanChi = `${canChi.ngay.can} ${canChi.ngay.chi}`;

  // Check Hoàng Đạo day
  if (lunarDate.ngayHoangDao) {
    if (rule.preferHoangDao) {
      score += SCORE_WEIGHTS.hoangDao;
      tags.push('hoangDao');
      reasons.push(`Ngày Hoàng Đạo (${CHI_NAMES[dayChiIndex]})`);
    }
  } else {
    if (rule.preferHoangDao) {
      reasons.push(`Ngày Hắc Đạo (${CHI_NAMES[dayChiIndex]})`);
    }
  }

  // Check good Chi
  if (rule.goodChi.includes(dayChiIndex)) {
    score += SCORE_WEIGHTS.goodChi;
    tags.push('goodChi');
    reasons.push(`Chi ${CHI_NAMES[dayChiIndex]} tốt cho ${activity}`);
  }

  // Check bad Chi
  if (rule.badChi.includes(dayChiIndex)) {
    score += SCORE_WEIGHTS.badChi;
    tags.push('badChi');
    reasons.push(`Chi ${CHI_NAMES[dayChiIndex]} không tốt cho ${activity}`);
  }

  // Check good Can Chi combinations
  if (rule.goodCanChi?.includes(dayCanChi)) {
    score += SCORE_WEIGHTS.goodCanChi;
    tags.push('goodCanChi');
    reasons.push(`${dayCanChi} là ngày đại cát`);
  }

  // Check bad Can Chi combinations
  if (rule.badCanChi?.includes(dayCanChi)) {
    score += SCORE_WEIGHTS.badCanChi;
    tags.push('badCanChi');
    reasons.push(`${dayCanChi} nên tránh`);
  }

  // Add lunar day specific checks
  if (lunarDate.day === 1 || lunarDate.day === 15) {
    if (activity === 'haircut') {
      score -= 15;
      tags.push('lunarDayBad');
      reasons.push('Tránh cắt tóc ngày mùng 1 và rằm');
    } else if (activity === 'wedding' || activity === 'start_business') {
      score += 10;
      tags.push('lunarDayGood');
      reasons.push('Ngày đầu tháng/rằm tốt cho việc lớn');
    }
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    date,
    score,
    isGoodDay: score >= 60,
    tags,
    reasons,
  };
}

/**
 * Find all auspicious days within a date range for a specific activity
 */
export function findAuspiciousDays(
  from: Date,
  to: Date,
  activity: ActivityType
): DayAuspiciousness[] {
  const results: DayAuspiciousness[] = [];
  const current = new Date(from.getTime());
  current.setHours(0, 0, 0, 0);
  const endDate = new Date(to.getTime());
  endDate.setHours(23, 59, 59, 999);

  while (current <= endDate) {
    const auspiciousness = getAuspiciousnessForDate(current, activity);
    if (auspiciousness.isGoodDay) {
      results.push(auspiciousness);
    }
    current.setDate(current.getDate() + 1);
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Get the best days in a month for an activity
 */
export function getBestDaysInMonth(
  year: number,
  month: number,
  activity: ActivityType,
  limit: number = 5
): DayAuspiciousness[] {
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0); // Last day of month

  const allGoodDays = findAuspiciousDays(from, to, activity);
  return allGoodDays.slice(0, limit);
}

/**
 * Check if a specific date is good for a specific activity
 */
export function isGoodDayFor(date: Date, activity: ActivityType): boolean {
  const auspiciousness = getAuspiciousnessForDate(date, activity);
  return auspiciousness.isGoodDay;
}
