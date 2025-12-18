export type ActivityType = 
  | 'wedding'
  | 'move_house'
  | 'start_business'
  | 'sign_contract'
  | 'travel'
  | 'haircut'
  | 'funeral'
  | 'construction'
  | 'general';

export interface DayAuspiciousness {
  date: Date;
  score: number;
  isGoodDay: boolean;
  tags: string[];
  reasons: string[];
}

export interface AuspiciousRule {
  activity: ActivityType;
  preferHoangDao: boolean;
  goodChi: number[];
  badChi: number[];
  goodCanChi?: string[];
  badCanChi?: string[];
  notes?: { vi: string; en: string };
}

export const ACTIVITY_LABELS: Record<ActivityType, { vi: string; en: string }> = {
  wedding: { vi: 'Cưới hỏi', en: 'Wedding' },
  move_house: { vi: 'Nhập trạch', en: 'Move House' },
  start_business: { vi: 'Khai trương', en: 'Start Business' },
  sign_contract: { vi: 'Ký hợp đồng', en: 'Sign Contract' },
  travel: { vi: 'Xuất hành', en: 'Travel' },
  haircut: { vi: 'Cắt tóc', en: 'Haircut' },
  funeral: { vi: 'Tang lễ', en: 'Funeral' },
  construction: { vi: 'Động thổ', en: 'Construction' },
  general: { vi: 'Chung', en: 'General' },
};
