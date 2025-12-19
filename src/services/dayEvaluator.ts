/**
 * Day Evaluator Service
 * Đánh giá ngày theo mục đích cụ thể
 */

import type { SolarDate } from '../lib/amlich/types';
import type { ActivityType, AuspiciousRule } from '../types/auspicious';
import type { OwnerParticipant } from '../types/profile';
import { getLunarService } from './LunarServiceImpl';
import { getDayStars, getMonthChiIndex } from './starsCalculator';
import { AUSPICIOUS_RULES, SCORE_WEIGHTS, CHI_NAMES } from '../config/auspiciousRules';
import { getChiIndexFromYear, isAgeCompatibleWithDay, getAgeCompatibility } from './ageCompatibility';
import type { KienTruNature } from '../config/auspiciousStars';

// ==================== TYPES ====================

export interface DayEvaluationResult {
  date: SolarDate;
  activity: ActivityType;
  score: number;  // 0-100
  isGoodDay: boolean;
  tags: string[];
  reasons: string[];
  warnings: string[];  // Những điều cần lưu ý
}

export interface DaySearchOptions {
  activity: ActivityType;
  fromDate: SolarDate;
  toDate: SolarDate;
  birthYear?: number;
  owners?: OwnerParticipant[];
  minScore?: number;
  limit?: number;
}

// ==================== CONSTANTS ====================

const KIEN_TRU_SCORE_MAP: Record<KienTruNature, number> = {
  very_good: 25,
  good: 15,
  neutral: 0,
  bad: -15,
  very_bad: -25,
};

const NHI_THAP_BAT_TU_SCORE_MAP: Record<KienTruNature, number> = {
  very_good: 15,
  good: 10,
  neutral: 0,
  bad: -10,
  very_bad: -15,
};

const TAM_TAI_CHI_GROUPS: number[][] = [
  [2, 6, 10],   // Dần-Ngọ-Tuất: Tam tai năm Thân-Dậu-Tuất
  [8, 0, 4],    // Thân-Tý-Thìn: Tam tai năm Dần-Mão-Thìn
  [5, 9, 1],    // Tỵ-Dậu-Sửu: Tam tai năm Hợi-Tý-Sửu
  [11, 3, 7],   // Hợi-Mão-Mùi: Tam tai năm Tỵ-Ngọ-Mùi
];

const TAM_TAI_AFFECTED_YEARS: Record<number, number[]> = {
  // Nhóm Dần-Ngọ-Tuất bị Tam Tai năm Thân(8), Dậu(9), Tuất(10)
  2: [8, 9, 10],
  6: [8, 9, 10],
  10: [8, 9, 10],
  // Nhóm Thân-Tý-Thìn bị Tam Tai năm Dần(2), Mão(3), Thìn(4)
  8: [2, 3, 4],
  0: [2, 3, 4],
  4: [2, 3, 4],
  // Nhóm Tỵ-Dậu-Sửu bị Tam Tai năm Hợi(11), Tý(0), Sửu(1)
  5: [11, 0, 1],
  9: [11, 0, 1],
  1: [11, 0, 1],
  // Nhóm Hợi-Mão-Mùi bị Tam Tai năm Tỵ(5), Ngọ(6), Mùi(7)
  11: [5, 6, 7],
  3: [5, 6, 7],
  7: [5, 6, 7],
};

const KIM_LAU_OFFSETS = [1, 3, 6, 8]; // Tuổi Kim Lâu: 1, 3, 6, 8 (modulo 9)

// ==================== HELPER FUNCTIONS ====================

function getYearChiIndex(year: number): number {
  return ((year + 8) % 12 + 12) % 12;
}

function isTamTaiYear(birthYear: number, currentYear: number): boolean {
  const birthChi = getChiIndexFromYear(birthYear);
  const currentChi = getYearChiIndex(currentYear);
  
  const affectedYears = TAM_TAI_AFFECTED_YEARS[birthChi];
  return affectedYears?.includes(currentChi) ?? false;
}

function isKimLauAge(birthYear: number, currentYear: number): boolean {
  const age = currentYear - birthYear + 1; // Tuổi mụ
  const ageModulo = age % 9;
  return KIM_LAU_OFFSETS.includes(ageModulo);
}

function addDays(date: SolarDate, days: number): SolarDate {
  const d = new Date(date.year, date.month - 1, date.day);
  d.setDate(d.getDate() + days);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  };
}

function compareDates(a: SolarDate, b: SolarDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

function isDateInRange(date: SolarDate, from: SolarDate, to: SolarDate): boolean {
  return compareDates(date, from) >= 0 && compareDates(date, to) <= 0;
}

// ==================== MAIN FUNCTIONS ====================

/**
 * Đánh giá ngày cho một hoạt động cụ thể
 */
export function evaluateDayForActivity(
  date: SolarDate,
  activity: ActivityType,
  birthYear?: number,
  owners?: OwnerParticipant[]
): DayEvaluationResult {
  const lunarService = getLunarService();
  const lunarDate = lunarService.getLunarDate(date);
  const rule = AUSPICIOUS_RULES[activity];
  
  const monthChiIndex = getMonthChiIndex(lunarDate.month);
  const dayStars = getDayStars(lunarDate, monthChiIndex);
  
  const dayChiIndex = lunarDate.canChi.ngay.chiIndex;
  const dayCanChi = `${lunarDate.canChi.ngay.can} ${lunarDate.canChi.ngay.chi}`;
  
  let score = SCORE_WEIGHTS.baseScore;
  const tags: string[] = [];
  const reasons: string[] = [];
  const warnings: string[] = [];
  
  // 1. Score từ Kiến Trừ
  const kienTruScore = KIEN_TRU_SCORE_MAP[dayStars.kienTru.nature];
  score += kienTruScore;
  
  if (dayStars.kienTru.nature === 'very_good' || dayStars.kienTru.nature === 'good') {
    tags.push(dayStars.kienTru.name);
    reasons.push(`Trực ${dayStars.kienTru.name}: ${dayStars.kienTru.keywords.vi}`);
  } else if (dayStars.kienTru.nature === 'bad' || dayStars.kienTru.nature === 'very_bad') {
    warnings.push(`Trực ${dayStars.kienTru.name}: Không thuận lợi`);
  }
  
  // 2. Score từ 28 Tú
  const nhiThapBatTuScore = NHI_THAP_BAT_TU_SCORE_MAP[dayStars.nhiThapBatTu.nature];
  score += nhiThapBatTuScore;
  
  if (dayStars.nhiThapBatTu.nature === 'very_good') {
    tags.push(`Sao ${dayStars.nhiThapBatTu.name}`);
    reasons.push(`Sao ${dayStars.nhiThapBatTu.name}: Cát tinh`);
  } else if (dayStars.nhiThapBatTu.nature === 'bad' || dayStars.nhiThapBatTu.nature === 'very_bad') {
    warnings.push(`Sao ${dayStars.nhiThapBatTu.name}: Hung tinh`);
  }
  
  // 3. Kiểm tra ngày Hoàng Đạo
  if (lunarDate.ngayHoangDao) {
    if (rule.preferHoangDao) {
      score += SCORE_WEIGHTS.hoangDao;
      tags.push('Hoàng Đạo');
      reasons.push('Ngày Hoàng Đạo: Tốt cho mọi việc');
    }
  } else {
    if (rule.preferHoangDao) {
      warnings.push('Ngày Hắc Đạo: Cần cẩn thận');
    }
  }
  
  // 4. Kiểm tra Chi ngày theo rule
  if (rule.goodChi.includes(dayChiIndex)) {
    score += SCORE_WEIGHTS.goodChi;
    reasons.push(`Ngày ${CHI_NAMES[dayChiIndex]}: Phù hợp cho ${getActivityLabel(activity)}`);
  }
  
  if (rule.badChi.includes(dayChiIndex)) {
    score += SCORE_WEIGHTS.badChi;
    warnings.push(`Ngày ${CHI_NAMES[dayChiIndex]}: Không phù hợp cho ${getActivityLabel(activity)}`);
  }
  
  // 5. Kiểm tra Can Chi đặc biệt
  if (rule.goodCanChi?.includes(dayCanChi)) {
    score += SCORE_WEIGHTS.goodCanChi;
    tags.push(dayCanChi);
    reasons.push(`${dayCanChi}: Ngày đại cát`);
  }
  
  if (rule.badCanChi?.includes(dayCanChi)) {
    score += SCORE_WEIGHTS.badCanChi;
    warnings.push(`${dayCanChi}: Ngày cần tránh`);
  }
  
  // 6. Kiểm tra xung tuổi (nếu có birthYear)
  if (birthYear) {
    const ageCompat = isAgeCompatibleWithDay(birthYear, dayChiIndex);
    
    if (ageCompat.relation === 'tu_hanh_xung') {
      score -= 30;
      warnings.push(`Ngày xung với tuổi ${CHI_NAMES[getChiIndexFromYear(birthYear)]}`);
    } else if (ageCompat.relation === 'tuong_hinh' || ageCompat.relation === 'tuong_hai') {
      score -= 15;
      warnings.push(`Ngày không hợp tuổi: ${ageCompat.description.vi}`);
    } else if (ageCompat.relation === 'tam_hop' || ageCompat.relation === 'luc_hop') {
      score += 10;
      reasons.push(`Ngày hợp tuổi: ${ageCompat.description.vi}`);
    }
    
    // 7. Kiểm tra Tam Tai / Kim Lâu cho các việc lớn
    const majorActivities: ActivityType[] = ['wedding', 'construction', 'move_house', 'start_business'];
    
    if (majorActivities.includes(activity)) {
      if (isTamTaiYear(birthYear, date.year)) {
        score -= 25;
        tags.push('Năm Tam Tai');
        warnings.push('Năm Tam Tai: Không nên làm việc lớn như cưới hỏi, xây nhà');
      }
      
      if (isKimLauAge(birthYear, date.year)) {
        score -= 20;
        tags.push('Tuổi Kim Lâu');
        warnings.push('Tuổi Kim Lâu: Cần cân nhắc kỹ trước khi làm việc lớn');
      }
    }
  }
  
  // 8. Thêm lưu ý từ rule
  if (rule.notes) {
    warnings.push(rule.notes.vi);
  }
  
  // 9. Kiểm tra tương hợp giữa 2 chủ (nếu có owners)
  if (owners && owners.length === 2) {
    const [owner1, owner2] = owners;
    
    // 9a. Kiểm tra từng người với ngày
    for (const owner of owners) {
      const ownerCompat = isAgeCompatibleWithDay(owner.birth.year, dayChiIndex);
      
      if (ownerCompat.relation === 'tu_hanh_xung') {
        score -= 20;
        warnings.push(`Ngày xung với tuổi ${owner.name}`);
      } else if (ownerCompat.relation === 'tuong_hinh' || ownerCompat.relation === 'tuong_hai') {
        score -= 10;
        warnings.push(`Ngày không hợp tuổi ${owner.name}`);
      } else if (ownerCompat.relation === 'tam_hop' || ownerCompat.relation === 'luc_hop') {
        score += 5;
        reasons.push(`Ngày hợp tuổi ${owner.name}`);
      }
      
      // Kiểm tra Tam Tai / Kim Lâu
      const majorActivities: ActivityType[] = ['wedding', 'construction', 'move_house', 'start_business'];
      if (majorActivities.includes(activity)) {
        if (isTamTaiYear(owner.birth.year, date.year)) {
          score -= 15;
          warnings.push(`${owner.name}: Năm Tam Tai`);
        }
        if (isKimLauAge(owner.birth.year, date.year)) {
          score -= 10;
          warnings.push(`${owner.name}: Tuổi Kim Lâu`);
        }
      }
    }
    
    // 9b. Kiểm tra tương hợp giữa 2 người với nhau
    const pairCompat = getAgeCompatibility(owner1.birth.year, owner2.birth.year);
    
    if (pairCompat.relation === 'tam_hop') {
      score += 15;
      tags.push('Đôi Tam Hợp');
      reasons.push(`${owner1.name} & ${owner2.name}: Tam Hợp - Rất hợp nhau`);
    } else if (pairCompat.relation === 'luc_hop') {
      score += 10;
      tags.push('Đôi Lục Hợp');
      reasons.push(`${owner1.name} & ${owner2.name}: Lục Hợp - Hợp nhau`);
    } else if (pairCompat.relation === 'tu_hanh_xung') {
      score -= 20;
      tags.push('Đôi Xung');
      warnings.push(`${owner1.name} & ${owner2.name}: Tứ Hành Xung - Cần hóa giải`);
    } else if (pairCompat.relation === 'tuong_hinh' || pairCompat.relation === 'tuong_hai') {
      score -= 10;
      warnings.push(`${owner1.name} & ${owner2.name}: ${pairCompat.description.vi}`);
    }
  }
  
  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, score));
  
  return {
    date,
    activity,
    score,
    isGoodDay: score >= 60,
    tags,
    reasons,
    warnings,
  };
}

/**
 * Tìm các ngày tốt trong khoảng thời gian
 */
export function findGoodDays(options: DaySearchOptions): DayEvaluationResult[] {
  const {
    activity,
    fromDate,
    toDate,
    birthYear,
    owners,
    minScore = 60,
    limit = 30,
  } = options;
  
  const results: DayEvaluationResult[] = [];
  let currentDate = { ...fromDate };
  
  while (isDateInRange(currentDate, fromDate, toDate) && results.length < limit) {
    const evaluation = evaluateDayForActivity(currentDate, activity, birthYear, owners);
    
    if (evaluation.score >= minScore) {
      results.push(evaluation);
    }
    
    currentDate = addDays(currentDate, 1);
  }
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, limit);
}

/**
 * Gợi ý ngày tốt gần nhất cho một hoạt động
 */
export function suggestNextGoodDay(
  activity: ActivityType,
  fromDate: SolarDate,
  birthYear?: number,
  maxDays: number = 60
): DayEvaluationResult | null {
  let currentDate = { ...fromDate };
  let bestResult: DayEvaluationResult | null = null;
  let daysChecked = 0;
  
  while (daysChecked < maxDays) {
    const evaluation = evaluateDayForActivity(currentDate, activity, birthYear);
    
    if (evaluation.isGoodDay) {
      if (!bestResult || evaluation.score > bestResult.score) {
        bestResult = evaluation;
        
        // Nếu tìm được ngày rất tốt (score >= 80), trả về ngay
        if (evaluation.score >= 80) {
          return bestResult;
        }
      }
      
      // Nếu đã tìm được ngày tốt và đã kiểm tra thêm 7 ngày, dừng
      if (bestResult && daysChecked >= 7) {
        return bestResult;
      }
    }
    
    currentDate = addDays(currentDate, 1);
    daysChecked++;
  }
  
  return bestResult;
}

// ==================== UTILITY FUNCTIONS ====================

function getActivityLabel(activity: ActivityType): string {
  const labels: Record<ActivityType, string> = {
    wedding: 'cưới hỏi',
    move_house: 'nhập trạch',
    start_business: 'khai trương',
    sign_contract: 'ký kết',
    travel: 'xuất hành',
    haircut: 'cắt tóc',
    funeral: 'tang lễ',
    construction: 'động thổ',
    general: 'việc chung',
  };
  return labels[activity];
}
