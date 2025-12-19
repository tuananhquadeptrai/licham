/**
 * Auspicious Rules Configuration for Vietnamese Lunar Calendar
 * Rules based on Can Chi (Sexagenary Cycle) and Hoàng Đạo days
 */

import type { ActivityType, AuspiciousRule } from '../types/auspicious';

// Chi indices: Tý(0), Sửu(1), Dần(2), Mão(3), Thìn(4), Tỵ(5), Ngọ(6), Mùi(7), Thân(8), Dậu(9), Tuất(10), Hợi(11)

export const AUSPICIOUS_RULES: Record<ActivityType, AuspiciousRule> = {
  wedding: {
    activity: 'wedding',
    preferHoangDao: true,
    goodChi: [2, 4, 6, 8], // Dần, Thìn, Ngọ, Thân - ngày tốt cho cưới hỏi
    badChi: [3, 9], // Mão, Dậu - ngày xung khắc
    goodCanChi: ['Giáp Tý', 'Bính Dần', 'Mậu Thìn', 'Canh Ngọ'],
    badCanChi: ['Canh Thân', 'Tân Dậu'],
    notes: {
      vi: 'Tránh tháng 7 âm lịch (tháng cô hồn)',
      en: 'Avoid 7th lunar month (ghost month)',
    },
  },
  move_house: {
    activity: 'move_house',
    preferHoangDao: true,
    goodChi: [2, 4, 7, 10], // Dần, Thìn, Mùi, Tuất
    badChi: [5, 11], // Tỵ, Hợi
    notes: {
      vi: 'Nên nhập trạch vào giờ hoàng đạo',
      en: 'Should move in during auspicious hours',
    },
  },
  start_business: {
    activity: 'start_business',
    preferHoangDao: true,
    goodChi: [2, 4, 6, 8], // Dần, Thìn, Ngọ, Thân - ngày tốt cho khai trương
    badChi: [1, 7], // Sửu, Mùi
    goodCanChi: ['Giáp Tý', 'Giáp Ngọ', 'Bính Dần', 'Mậu Thìn'],
    notes: {
      vi: 'Chọn ngày Thành, Khai trong 12 Trực',
      en: 'Choose Thanh or Khai in 12 Truc',
    },
  },
  sign_contract: {
    activity: 'sign_contract',
    preferHoangDao: true,
    goodChi: [4, 6, 8, 10], // Thìn, Ngọ, Thân, Tuất
    badChi: [3, 9], // Mão, Dậu
    notes: {
      vi: 'Tránh ngày Phá trong 12 Trực',
      en: 'Avoid Pha days in 12 Truc',
    },
  },
  travel: {
    activity: 'travel',
    preferHoangDao: true,
    goodChi: [2, 4, 6, 8, 10], // Dần, Thìn, Ngọ, Thân, Tuất
    badChi: [1, 7, 11], // Sửu, Mùi, Hợi
    notes: {
      vi: 'Xuất hành nên chọn giờ Dần, Mão, Thìn',
      en: 'Best departure hours: Dan, Mao, Thin',
    },
  },
  haircut: {
    activity: 'haircut',
    preferHoangDao: false,
    goodChi: [0, 2, 4, 6, 8, 10], // Tý, Dần, Thìn, Ngọ, Thân, Tuất
    badChi: [1, 5], // Sửu, Tỵ - ngày Tóc Lão
    notes: {
      vi: 'Tránh ngày mùng 1 và rằm',
      en: 'Avoid 1st and 15th of lunar month',
    },
  },
  funeral: {
    activity: 'funeral',
    preferHoangDao: false,
    goodChi: [1, 3, 5, 7, 9, 11], // Sửu, Mão, Tỵ, Mùi, Dậu, Hợi
    badChi: [0, 6], // Tý, Ngọ - ngày Trùng tang
    badCanChi: ['Canh Dần', 'Tân Mão', 'Mậu Thân', 'Kỷ Dậu'],
    notes: {
      vi: 'Tránh ngày trùng với tuổi người mất',
      en: 'Avoid days clashing with deceased zodiac',
    },
  },
  construction: {
    activity: 'construction',
    preferHoangDao: true,
    goodChi: [2, 4, 6, 8], // Dần, Thìn, Ngọ, Thân
    badChi: [1, 3, 7, 9], // Sửu, Mão, Mùi, Dậu
    goodCanChi: ['Giáp Tý', 'Giáp Ngọ', 'Bính Dần', 'Mậu Thìn', 'Canh Ngọ'],
    notes: {
      vi: 'Chọn ngày Định hoặc Thành trong 12 Trực',
      en: 'Choose Dinh or Thanh in 12 Truc',
    },
  },
  general: {
    activity: 'general',
    preferHoangDao: true,
    goodChi: [2, 4, 5, 7, 10, 11], // Hoàng đạo chi: Dần, Thìn, Tỵ, Mùi, Tuất, Hợi
    badChi: [0, 1, 3, 6, 8, 9], // Hắc đạo chi: Tý, Sửu, Mão, Ngọ, Thân, Dậu
    notes: {
      vi: 'Ngày hoàng đạo tốt cho mọi việc',
      en: 'Hoang Dao days are good for all activities',
    },
  },
};

// Chi names for display
export const CHI_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// Score weights
export const SCORE_WEIGHTS = {
  hoangDao: 30,
  goodChi: 25,
  badChi: -35,
  goodCanChi: 20,
  badCanChi: -25,
  baseScore: 50,
};
