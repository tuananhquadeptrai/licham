/**
 * FengShuiService - Consolidated Feng Shui Features
 * Tổng hợp tất cả các tính năng phong thủy
 */

import type { SolarDate, LunarDate, LunarDateExtended, CanChiDetail } from '../lib/amlich/types';
import { getCanInfo, getChiInfo, getChiXungHop, getNguHanhRelation, type NguHanh } from '../config/canChi';
import { getDayStars, getMonthChiIndex, type DayStarsInfo } from './starsCalculator';
import { getAgeCompatibility, isAgeCompatibleWithDay, getPersonInfo, getChiIndexFromYear } from './ageCompatibility';
import { isTamTaiYear, isKimLauYear, getAllHanTuoi } from '../config/hanTuoi';
import { getSolarTermByIndex, getNextSolarTerm } from '../config/solarTerms';
import { getLunarService } from './LunarServiceImpl';

// ==================== EXTENDED TYPES ====================

export interface CanChiDetailExtended extends CanChiDetail {
  ngayElement: NguHanh;
  thangElement: NguHanh;
  namElement: NguHanh;
  ngayXungHop: { xung: string[]; tamHop: string[]; lucHop: string | null };
}

export interface FengShuiDayInfo {
  canChi: CanChiDetailExtended;
  stars: DayStarsInfo;
  tietKhi?: { current?: string; next?: { name: string; date: Date } };
  ngayHoangDao: boolean;
  gioHoangDao: string[];
  overallScore: number;  // 0-100
  tags: string[];
  recommendations: string[];
}

export interface PersonalFengShui {
  birthYear: number;
  chiIndex: number;
  chiName: string;
  element: NguHanh;
  hanTuoi: Array<{ year: number; type: string; description: string }>;
}

// ==================== MAIN SERVICE CLASS ====================

export class FengShuiService {
  private lunarService = getLunarService();

  /**
   * Enrich Can Chi with elements and xung/hop relationships
   */
  enrichCanChi(canChi: CanChiDetail): CanChiDetailExtended {
    const ngayCanInfo = getCanInfo(canChi.ngay.canIndex);
    const thangCanInfo = getCanInfo(canChi.thang.canIndex);
    const namCanInfo = getCanInfo(canChi.nam.canIndex);

    const xungHop = getChiXungHop(canChi.ngay.chiIndex);
    const xungNames = xungHop.xung.map(idx => getChiInfo(idx).name);
    const tamHopNames = xungHop.tamHop.map(idx => getChiInfo(idx).name);
    const lucHopName = xungHop.lucHop !== null ? getChiInfo(xungHop.lucHop).name : null;

    return {
      ...canChi,
      ngayElement: ngayCanInfo.element,
      thangElement: thangCanInfo.element,
      namElement: namCanInfo.element,
      ngayXungHop: {
        xung: xungNames,
        tamHop: tamHopNames,
        lucHop: lucHopName,
      },
    };
  }

  /**
   * Get full feng shui info for a date
   */
  getFengShuiForDate(solar: SolarDate): FengShuiDayInfo {
    const lunarExtended = this.lunarService.getLunarDate(solar);
    const canChi = this.enrichCanChi(lunarExtended.canChi);
    
    const monthChiIndex = getMonthChiIndex(lunarExtended.month);
    const stars = getDayStars(lunarExtended, monthChiIndex);

    const tietKhiCurrent = lunarExtended.tietKhi;
    const nextTerm = getNextSolarTerm(new Date(solar.year, solar.month - 1, solar.day));

    const tietKhi = {
      current: tietKhiCurrent,
      next: { name: nextTerm.term.nameVi, date: nextTerm.date },
    };

    const ngayHoangDao = lunarExtended.ngayHoangDao;
    const gioHoangDao = lunarExtended.gioHoangDao;

    const overallScore = this.calculateDayScore(stars, ngayHoangDao);
    const tags = this.generateDayTags(stars, ngayHoangDao, canChi);
    const recommendations = this.generateRecommendations(stars, ngayHoangDao);

    return {
      canChi,
      stars,
      tietKhi,
      ngayHoangDao,
      gioHoangDao,
      overallScore,
      tags,
      recommendations,
    };
  }

  /**
   * Get personal feng shui info based on birth year
   */
  getPersonalFengShui(birthYear: number, targetYear?: number): PersonalFengShui {
    const personInfo = getPersonInfo(birthYear);
    const chiInfo = getChiInfo(personInfo.chiIndex);

    const currentYear = targetYear ?? new Date().getFullYear();
    const hanTuoi: Array<{ year: number; type: string; description: string }> = [];

    // Check next 10 years for age restrictions
    for (let y = currentYear; y <= currentYear + 10; y++) {
      const yearChiIndex = getChiIndexFromYear(y);
      
      if (isTamTaiYear(personInfo.chiIndex, yearChiIndex)) {
        hanTuoi.push({
          year: y,
          type: 'Tam Tai',
          description: 'Năm Tam Tai - tránh động thổ, xây nhà',
        });
      }

      const kimLau = isKimLauYear(birthYear, y);
      if (kimLau.hasKimLau && kimLau.rule) {
        hanTuoi.push({
          year: y,
          type: `Kim Lâu ${kimLau.type}`,
          description: kimLau.rule.description.vi,
        });
      }
    }

    return {
      birthYear,
      chiIndex: personInfo.chiIndex,
      chiName: personInfo.chiName,
      element: chiInfo.element,
      hanTuoi,
    };
  }

  /**
   * Check compatibility between person and date
   */
  checkDateForPerson(solar: SolarDate, birthYear: number): {
    compatible: boolean;
    score: number;
    reasons: string[];
  } {
    const lunarExtended = this.lunarService.getLunarDate(solar);
    const dayChiIndex = lunarExtended.canChi.ngay.chiIndex;
    
    const compatibility = isAgeCompatibleWithDay(birthYear, dayChiIndex);
    const reasons: string[] = [];

    if (compatibility.score >= 70) {
      reasons.push(compatibility.description.vi);
    } else if (compatibility.score >= 50) {
      reasons.push(compatibility.description.vi);
    } else {
      reasons.push(compatibility.description.vi);
      if (compatibility.advice) {
        reasons.push(compatibility.advice.vi);
      }
    }

    // Check year restrictions
    const yearChiIndex = lunarExtended.canChi.nam.chiIndex;
    const personChiIndex = getChiIndexFromYear(birthYear);

    if (isTamTaiYear(personChiIndex, yearChiIndex)) {
      reasons.push('Năm Tam Tai - cần thận trọng khi làm việc lớn');
    }

    const kimLau = isKimLauYear(birthYear, solar.year);
    if (kimLau.hasKimLau && kimLau.rule) {
      reasons.push(`${kimLau.rule.label.vi}: ${kimLau.rule.description.vi}`);
    }

    // Adjust score based on day quality
    let finalScore = compatibility.score;
    
    if (lunarExtended.ngayHoangDao) {
      finalScore = Math.min(100, finalScore + 10);
      reasons.push('Ngày Hoàng Đạo - thuận lợi cho các việc quan trọng');
    }

    return {
      compatible: finalScore >= 50,
      score: finalScore,
      reasons,
    };
  }

  /**
   * Calculate overall day score (0-100)
   */
  private calculateDayScore(stars: DayStarsInfo, ngayHoangDao: boolean): number {
    let score = 50; // Base score

    // Kiến Trừ score based on nature
    if (stars.kienTru.nature === 'very_good' || stars.kienTru.nature === 'good') {
      score += 20;
    } else if (stars.kienTru.nature === 'bad' || stars.kienTru.nature === 'very_bad') {
      score -= 15;
    }

    // Nhị Thập Bát Tú score based on nature
    const isGoodStar = stars.nhiThapBatTu.nature === 'very_good' || stars.nhiThapBatTu.nature === 'good';
    if (isGoodStar) {
      score += 15;
    } else {
      score -= 10;
    }

    // Hoàng đạo bonus
    if (ngayHoangDao) {
      score += 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate tags for the day
   */
  private generateDayTags(
    stars: DayStarsInfo, 
    ngayHoangDao: boolean, 
    canChi: CanChiDetailExtended
  ): string[] {
    const tags: string[] = [];

    if (ngayHoangDao) {
      tags.push('Hoàng Đạo');
    }

    tags.push(stars.kienTru.name);
    tags.push(`Sao ${stars.nhiThapBatTu.name}`);

    const isGoodDay = stars.kienTru.nature === 'very_good' || stars.kienTru.nature === 'good';
    const isBadDay = stars.kienTru.nature === 'bad' || stars.kienTru.nature === 'very_bad';
    
    if (isGoodDay) {
      tags.push('Ngày Tốt');
    } else if (isBadDay) {
      tags.push('Ngày Xấu');
    }

    tags.push(`Hành ${canChi.ngayElement}`);

    return tags;
  }

  /**
   * Generate recommendations for the day
   */
  private generateRecommendations(stars: DayStarsInfo, ngayHoangDao: boolean): string[] {
    const recommendations: string[] = [];

    // Add Kiến Trừ recommendations
    if (stars.kienTru.goodFor.length > 0) {
      recommendations.push(`Nên: ${stars.kienTru.goodFor.join(', ')}`);
    }

    if (stars.kienTru.avoidFor.length > 0) {
      recommendations.push(`Tránh: ${stars.kienTru.avoidFor.join(', ')}`);
    }

    // Add Nhị Thập Bát Tú recommendations
    const isGoodStar = stars.nhiThapBatTu.nature === 'very_good' || stars.nhiThapBatTu.nature === 'good';
    if (isGoodStar) {
      recommendations.push(`Sao ${stars.nhiThapBatTu.name} (${stars.nhiThapBatTu.animal}) là sao tốt`);
    } else {
      recommendations.push(`Sao ${stars.nhiThapBatTu.name} (${stars.nhiThapBatTu.animal}) xấu, nên tránh việc lớn`);
    }

    if (ngayHoangDao) {
      recommendations.push('Ngày Hoàng Đạo thuận lợi cho khai trương, động thổ');
    }

    return recommendations;
  }
}

// Singleton export
export const fengShuiService = new FengShuiService();
