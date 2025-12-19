/**
 * Hạn Tuổi Configuration - Tam Tai, Kim Lâu, Hoang Ốc
 * Vietnamese traditional age-based restrictions for major life events
 */

// ============================================================================
// Types
// ============================================================================

export interface TamTaiGroup {
  chiGroup: number[];      // Chi indices that share same Tam Tai years
  tamTaiYears: number[];   // Chi indices of Tam Tai years
  groupName: { vi: string; en: string };
}

export type KimLauType = 'than' | 'the' | 'tu' | 'luc_suc';

export interface KimLauRule {
  type: KimLauType;
  label: { vi: string; en: string };
  agePattern: number[];    // First few ages affected (pattern: base + 8n)
  baseAge: number;         // Starting age for pattern
  severity: 'high' | 'medium' | 'low';
  description: { vi: string; en: string };
}

export interface HoangOcRule {
  gender: 'male' | 'female';
  ages: number[];          // Affected ages
  description: { vi: string; en: string };
}

// ============================================================================
// Tam Tai Data (Three Calamities)
// Based on Tam Hợp (Triple Harmony) groups
// ============================================================================

// Chi indices: Tý(0), Sửu(1), Dần(2), Mão(3), Thìn(4), Tỵ(5), 
//              Ngọ(6), Mùi(7), Thân(8), Dậu(9), Tuất(10), Hợi(11)

export const TAM_TAI_GROUPS: TamTaiGroup[] = [
  {
    // Thân-Tý-Thìn: Tam Tai năm Dần-Mão-Thìn
    chiGroup: [8, 0, 4],         // Thân, Tý, Thìn
    tamTaiYears: [2, 3, 4],      // Dần, Mão, Thìn
    groupName: { vi: 'Thân-Tý-Thìn', en: 'Monkey-Rat-Dragon' },
  },
  {
    // Dần-Ngọ-Tuất: Tam Tai năm Thân-Dậu-Tuất
    chiGroup: [2, 6, 10],        // Dần, Ngọ, Tuất
    tamTaiYears: [8, 9, 10],     // Thân, Dậu, Tuất
    groupName: { vi: 'Dần-Ngọ-Tuất', en: 'Tiger-Horse-Dog' },
  },
  {
    // Tỵ-Dậu-Sửu: Tam Tai năm Hợi-Tý-Sửu
    chiGroup: [5, 9, 1],         // Tỵ, Dậu, Sửu
    tamTaiYears: [11, 0, 1],     // Hợi, Tý, Sửu
    groupName: { vi: 'Tỵ-Dậu-Sửu', en: 'Snake-Rooster-Ox' },
  },
  {
    // Hợi-Mão-Mùi: Tam Tai năm Tỵ-Ngọ-Mùi
    chiGroup: [11, 3, 7],        // Hợi, Mão, Mùi
    tamTaiYears: [5, 6, 7],      // Tỵ, Ngọ, Mùi
    groupName: { vi: 'Hợi-Mão-Mùi', en: 'Pig-Rabbit-Goat' },
  },
];

// ============================================================================
// Kim Lâu Data (Golden Tower - affects building/construction)
// Pattern: baseAge + 8n
// ============================================================================

export const KIM_LAU_RULES: KimLauRule[] = [
  {
    type: 'than',
    label: { vi: 'Kim Lâu Thân', en: 'Kim Lau Than (Body)' },
    agePattern: [1, 9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97],
    baseAge: 1,
    severity: 'high',
    description: {
      vi: 'Hại đến bản thân gia chủ, không nên làm nhà, động thổ',
      en: 'Harmful to the homeowner, avoid construction or groundbreaking',
    },
  },
  {
    type: 'the',
    label: { vi: 'Kim Lâu Thê', en: 'Kim Lau The (Spouse)' },
    agePattern: [3, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99],
    baseAge: 3,
    severity: 'high',
    description: {
      vi: 'Hại đến vợ/chồng, không nên làm nhà, cưới hỏi',
      en: 'Harmful to spouse, avoid construction or marriage',
    },
  },
  {
    type: 'tu',
    label: { vi: 'Kim Lâu Tử', en: 'Kim Lau Tu (Children)' },
    agePattern: [6, 14, 22, 30, 38, 46, 54, 62, 70, 78, 86, 94],
    baseAge: 6,
    severity: 'medium',
    description: {
      vi: 'Hại đến con cái, cân nhắc khi làm nhà',
      en: 'Harmful to children, consider carefully before construction',
    },
  },
  {
    type: 'luc_suc',
    label: { vi: 'Kim Lâu Lục Súc', en: 'Kim Lau Luc Suc (Livestock)' },
    agePattern: [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96],
    baseAge: 8,
    severity: 'low',
    description: {
      vi: 'Hại đến gia súc, tài sản, có thể làm nhà nhưng cần hóa giải',
      en: 'Harmful to livestock/property, can build with proper rituals',
    },
  },
];

// ============================================================================
// Hoang Ốc Data (Empty House - affects moving/construction)
// ============================================================================

export const HOANG_OC_RULES: HoangOcRule[] = [
  {
    gender: 'male',
    ages: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60],
    description: {
      vi: 'Nam giới gặp Hoang Ốc, không nên làm nhà hoặc nhập trạch',
      en: 'Males with Hoang Oc should avoid building or moving into new house',
    },
  },
  {
    gender: 'female',
    ages: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
    description: {
      vi: 'Nữ giới gặp Hoang Ốc, không nên làm nhà hoặc nhập trạch',
      en: 'Females with Hoang Oc should avoid building or moving into new house',
    },
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the Tam Tai group for a given birth Chi index
 */
export function getTamTaiGroupForChi(chiIndex: number): TamTaiGroup | null {
  return TAM_TAI_GROUPS.find(group => group.chiGroup.includes(chiIndex)) || null;
}

/**
 * Check if a year is a Tam Tai year for someone born in a specific Chi
 */
export function isTamTaiYear(birthChiIndex: number, targetYearChiIndex: number): boolean {
  const group = getTamTaiGroupForChi(birthChiIndex);
  if (!group) return false;
  return group.tamTaiYears.includes(targetYearChiIndex);
}

/**
 * Get Tam Tai info for display
 */
export function getTamTaiInfo(birthChiIndex: number, targetYearChiIndex: number): {
  isTamTai: boolean;
  group: TamTaiGroup | null;
  yearInCycle: number; // 1, 2, or 3 (năm đầu, năm giữa, năm cuối)
} {
  const group = getTamTaiGroupForChi(birthChiIndex);
  if (!group) return { isTamTai: false, group: null, yearInCycle: 0 };
  
  const yearIndex = group.tamTaiYears.indexOf(targetYearChiIndex);
  return {
    isTamTai: yearIndex !== -1,
    group,
    yearInCycle: yearIndex !== -1 ? yearIndex + 1 : 0,
  };
}

/**
 * Get Kim Lâu type for a given lunar age (tuổi âm)
 * Returns null if no Kim Lâu applies
 */
export function getKimLauForAge(tuoiAm: number): KimLauType | null {
  if (tuoiAm <= 0) return null;
  
  for (const rule of KIM_LAU_RULES) {
    // Pattern: baseAge + 8n
    if ((tuoiAm - rule.baseAge) % 8 === 0 && tuoiAm >= rule.baseAge) {
      return rule.type;
    }
  }
  return null;
}

/**
 * Get full Kim Lâu rule for an age
 */
export function getKimLauRuleForAge(tuoiAm: number): KimLauRule | null {
  const type = getKimLauForAge(tuoiAm);
  if (!type) return null;
  return KIM_LAU_RULES.find(rule => rule.type === type) || null;
}

/**
 * Check if a target year has Kim Lâu based on birth year
 * Uses lunar age calculation: tuổi âm = targetYear - birthYear + 1
 */
export function isKimLauYear(
  birthYear: number,
  targetYear: number
): { hasKimLau: boolean; type?: KimLauType; rule?: KimLauRule } {
  const tuoiAm = targetYear - birthYear + 1;
  if (tuoiAm <= 0) return { hasKimLau: false };
  
  const type = getKimLauForAge(tuoiAm);
  if (!type) return { hasKimLau: false };
  
  const rule = KIM_LAU_RULES.find(r => r.type === type);
  return { hasKimLau: true, type, rule };
}

/**
 * Check if an age is Hoang Ốc based on gender
 */
export function isHoangOcAge(tuoiAm: number, gender: 'male' | 'female'): boolean {
  const rule = HOANG_OC_RULES.find(r => r.gender === gender);
  if (!rule) return false;
  
  // For male: 3, 6, 9... (multiples of 3)
  // For female: 2, 5, 8... (3n - 1)
  if (gender === 'male') {
    return tuoiAm > 0 && tuoiAm % 3 === 0;
  } else {
    return tuoiAm > 0 && (tuoiAm + 1) % 3 === 0;
  }
}

/**
 * Get Hoang Ốc info for a year
 */
export function getHoangOcInfo(
  birthYear: number,
  targetYear: number,
  gender: 'male' | 'female'
): { isHoangOc: boolean; rule?: HoangOcRule } {
  const tuoiAm = targetYear - birthYear + 1;
  if (tuoiAm <= 0) return { isHoangOc: false };
  
  const isHoangOc = isHoangOcAge(tuoiAm, gender);
  if (!isHoangOc) return { isHoangOc: false };
  
  const rule = HOANG_OC_RULES.find(r => r.gender === gender);
  return { isHoangOc: true, rule };
}

/**
 * Get all age restrictions (hạn tuổi) for a person in a target year
 */
export function getAllHanTuoi(
  birthYear: number,
  birthChiIndex: number,
  targetYear: number,
  targetYearChiIndex: number,
  gender: 'male' | 'female'
): {
  tuoiAm: number;
  tamTai: ReturnType<typeof getTamTaiInfo>;
  kimLau: ReturnType<typeof isKimLauYear>;
  hoangOc: ReturnType<typeof getHoangOcInfo>;
  hasAnyRestriction: boolean;
} {
  const tuoiAm = targetYear - birthYear + 1;
  const tamTai = getTamTaiInfo(birthChiIndex, targetYearChiIndex);
  const kimLau = isKimLauYear(birthYear, targetYear);
  const hoangOc = getHoangOcInfo(birthYear, targetYear, gender);
  
  return {
    tuoiAm,
    tamTai,
    kimLau,
    hoangOc,
    hasAnyRestriction: tamTai.isTamTai || kimLau.hasKimLau || hoangOc.isHoangOc,
  };
}
