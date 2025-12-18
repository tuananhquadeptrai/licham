/**
 * Age Compatibility Service
 * Tính tuổi xung hợp theo phong thủy Việt Nam
 */

import {
  CHI_TAM_HOP,
  CHI_TU_HANH_XUNG,
  CHI_LUC_HOP,
  getChiInfo,
  getNguHanhRelation,
  type NguHanh,
} from '../config/canChi';

// ==================== TYPES ====================

export type CompatibilityRelation =
  | 'tam_hop'      // Rất hợp
  | 'luc_hop'      // Hợp
  | 'binh_hoa'     // Bình thường
  | 'tuong_hai'    // Tương hại
  | 'tuong_hinh'   // Tương hình
  | 'tu_hanh_xung'; // Xung (rất xấu)

export interface CompatibilityResult {
  relation: CompatibilityRelation;
  score: number;  // -100 to 100
  description: { vi: string; en: string };
  advice?: { vi: string; en: string };
}

export interface PersonInfo {
  birthYear: number;
  chiIndex: number;
  chiName: string;
  element: string;
}

// ==================== TƯƠNG HẠI & TƯƠNG HÌNH ====================

/**
 * Tương Hại - 6 cặp địa chi tương hại
 * Tý-Mùi, Sửu-Ngọ, Dần-Tỵ, Mão-Thìn, Thân-Hợi, Dậu-Tuất
 */
const CHI_TUONG_HAI: [number, number][] = [
  [0, 7],   // Tý - Mùi
  [1, 6],   // Sửu - Ngọ
  [2, 5],   // Dần - Tỵ
  [3, 4],   // Mão - Thìn
  [8, 11],  // Thân - Hợi
  [9, 10],  // Dậu - Tuất
];

/**
 * Tương Hình - Các nhóm địa chi tương hình
 * Tam hình: Dần-Tỵ-Thân, Sửu-Tuất-Mùi
 * Tự hình: Thìn-Thìn, Ngọ-Ngọ, Dậu-Dậu, Hợi-Hợi
 * Vô ân chi hình: Tý-Mão
 */
const CHI_TUONG_HINH_TAM: number[][] = [
  [2, 5, 8],   // Dần - Tỵ - Thân (Vô ân chi hình)
  [1, 10, 7],  // Sửu - Tuất - Mùi (Trì thế chi hình)
];

const CHI_TUONG_HINH_TU: number[] = [4, 6, 9, 11]; // Thìn, Ngọ, Dậu, Hợi (Tự hình)

const CHI_TUONG_HINH_VO_AN: [number, number] = [0, 3]; // Tý - Mão

// ==================== HELPER FUNCTIONS ====================

/**
 * Lấy Chi index từ năm sinh (dương lịch)
 * Chi của năm = (năm + 8) % 12
 */
export function getChiIndexFromYear(year: number): number {
  return ((year + 8) % 12 + 12) % 12;
}

/**
 * Lấy thông tin người từ năm sinh
 */
export function getPersonInfo(birthYear: number): PersonInfo {
  const chiIndex = getChiIndexFromYear(birthYear);
  const chiInfo = getChiInfo(chiIndex);
  
  return {
    birthYear,
    chiIndex,
    chiName: chiInfo.name,
    element: chiInfo.element,
  };
}

// ==================== RELATION CHECKING ====================

/**
 * Kiểm tra 2 chi có thuộc Tam Hợp không
 */
function isTamHop(chi1: number, chi2: number): boolean {
  for (const group of CHI_TAM_HOP) {
    if (group.includes(chi1) && group.includes(chi2)) {
      return true;
    }
  }
  return false;
}

/**
 * Kiểm tra 2 chi có thuộc Lục Hợp không
 */
function isLucHop(chi1: number, chi2: number): boolean {
  for (const [a, b] of CHI_LUC_HOP) {
    if ((a === chi1 && b === chi2) || (a === chi2 && b === chi1)) {
      return true;
    }
  }
  return false;
}

/**
 * Kiểm tra 2 chi có Tứ Hành Xung không
 */
function isTuHanhXung(chi1: number, chi2: number): boolean {
  for (const [a, b] of CHI_TU_HANH_XUNG) {
    if ((a === chi1 && b === chi2) || (a === chi2 && b === chi1)) {
      return true;
    }
  }
  return false;
}

/**
 * Kiểm tra 2 chi có Tương Hại không
 */
function isTuongHai(chi1: number, chi2: number): boolean {
  for (const [a, b] of CHI_TUONG_HAI) {
    if ((a === chi1 && b === chi2) || (a === chi2 && b === chi1)) {
      return true;
    }
  }
  return false;
}

/**
 * Kiểm tra 2 chi có Tương Hình không
 */
function isTuongHinh(chi1: number, chi2: number): boolean {
  // Kiểm tra Tự hình (cùng chi)
  if (chi1 === chi2 && CHI_TUONG_HINH_TU.includes(chi1)) {
    return true;
  }
  
  // Kiểm tra Vô ân chi hình (Tý-Mão)
  const [a, b] = CHI_TUONG_HINH_VO_AN;
  if ((chi1 === a && chi2 === b) || (chi1 === b && chi2 === a)) {
    return true;
  }
  
  // Kiểm tra Tam hình
  for (const group of CHI_TUONG_HINH_TAM) {
    if (group.includes(chi1) && group.includes(chi2) && chi1 !== chi2) {
      return true;
    }
  }
  
  return false;
}

// ==================== DESCRIPTIONS ====================

const COMPATIBILITY_DESCRIPTIONS: Record<CompatibilityRelation, { vi: string; en: string }> = {
  tam_hop: {
    vi: 'Tam Hợp - Rất hợp nhau, tương sinh tương trợ',
    en: 'Trinity Harmony - Very compatible, mutual support',
  },
  luc_hop: {
    vi: 'Lục Hợp - Hợp nhau, quan hệ tốt đẹp',
    en: 'Six Harmony - Compatible, good relationship',
  },
  binh_hoa: {
    vi: 'Bình Hòa - Quan hệ bình thường, không xung không hợp',
    en: 'Neutral - Normal relationship, no conflict or harmony',
  },
  tuong_hai: {
    vi: 'Tương Hại - Có thể gây tổn hại cho nhau',
    en: 'Mutual Harm - May cause harm to each other',
  },
  tuong_hinh: {
    vi: 'Tương Hình - Có xung đột, cần cẩn thận',
    en: 'Mutual Punishment - Has conflicts, be careful',
  },
  tu_hanh_xung: {
    vi: 'Tứ Hành Xung - Xung khắc mạnh, rất không hợp',
    en: 'Four Clash - Strong conflict, very incompatible',
  },
};

const COMPATIBILITY_ADVICE: Record<CompatibilityRelation, { vi: string; en: string }> = {
  tam_hop: {
    vi: 'Đây là mối quan hệ rất tốt, nên tận dụng để hợp tác và phát triển.',
    en: 'This is a very good relationship, utilize it for cooperation and growth.',
  },
  luc_hop: {
    vi: 'Quan hệ thuận lợi, có thể tin tưởng và hỗ trợ lẫn nhau.',
    en: 'Favorable relationship, can trust and support each other.',
  },
  binh_hoa: {
    vi: 'Quan hệ trung tính, cần nỗ lực để xây dựng sự gắn kết.',
    en: 'Neutral relationship, effort needed to build connection.',
  },
  tuong_hai: {
    vi: 'Cần thận trọng trong giao tiếp, tránh xung đột không cần thiết.',
    en: 'Be cautious in communication, avoid unnecessary conflicts.',
  },
  tuong_hinh: {
    vi: 'Nên giữ khoảng cách phù hợp, tránh tranh cãi và đối đầu.',
    en: 'Keep appropriate distance, avoid arguments and confrontations.',
  },
  tu_hanh_xung: {
    vi: 'Quan hệ rất khó khăn, cần có người trung gian hóa giải.',
    en: 'Very difficult relationship, need mediator to resolve.',
  },
};

const COMPATIBILITY_SCORES: Record<CompatibilityRelation, number> = {
  tam_hop: 90,
  luc_hop: 70,
  binh_hoa: 50,
  tuong_hai: -30,
  tuong_hinh: -50,
  tu_hanh_xung: -80,
};

// ==================== MAIN FUNCTIONS ====================

/**
 * Tính tương hợp giữa 2 người dựa trên năm sinh
 */
export function getAgeCompatibility(year1: number, year2: number): CompatibilityResult {
  const chi1 = getChiIndexFromYear(year1);
  const chi2 = getChiIndexFromYear(year2);
  
  return calculateCompatibility(chi1, chi2);
}

/**
 * Kiểm tra tuổi có hợp với ngày không
 */
export function isAgeCompatibleWithDay(birthYear: number, dayChiIndex: number): CompatibilityResult {
  const personChi = getChiIndexFromYear(birthYear);
  
  return calculateCompatibility(personChi, dayChiIndex);
}

/**
 * Tính toán tương hợp giữa 2 địa chi
 */
function calculateCompatibility(chi1: number, chi2: number): CompatibilityResult {
  let relation: CompatibilityRelation;
  
  // Kiểm tra theo thứ tự ưu tiên: xung > hình > hại > hợp > bình
  if (isTuHanhXung(chi1, chi2)) {
    relation = 'tu_hanh_xung';
  } else if (isTuongHinh(chi1, chi2)) {
    relation = 'tuong_hinh';
  } else if (isTuongHai(chi1, chi2)) {
    relation = 'tuong_hai';
  } else if (isTamHop(chi1, chi2)) {
    relation = 'tam_hop';
  } else if (isLucHop(chi1, chi2)) {
    relation = 'luc_hop';
  } else {
    relation = 'binh_hoa';
  }
  
  // Điều chỉnh score dựa trên ngũ hành
  let score = COMPATIBILITY_SCORES[relation];
  const element1 = getChiInfo(chi1).element as NguHanh;
  const element2 = getChiInfo(chi2).element as NguHanh;
  const elementRelation = getNguHanhRelation(element1, element2);
  
  // Bonus/penalty từ ngũ hành
  if (elementRelation === 'sinh') {
    score = Math.min(100, score + 10);
  } else if (elementRelation === 'khắc') {
    score = Math.max(-100, score - 10);
  }
  
  return {
    relation,
    score,
    description: COMPATIBILITY_DESCRIPTIONS[relation],
    advice: COMPATIBILITY_ADVICE[relation],
  };
}
