/**
 * Can Chi (Thiên Can - Địa Chi) và Ngũ Hành
 * Hệ thống lịch Can Chi truyền thống Việt Nam
 */

// ==================== TYPES ====================

/** Ngũ Hành - Five Elements */
export type NguHanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

/** Âm Dương - Yin Yang */
export type YinYang = 'Dương' | 'Âm';

/** Thông tin Thiên Can */
export interface CanInfo {
  index: number;        // 0-9
  name: string;         // Tên thiên can
  element: NguHanh;     // Ngũ hành
  yinYang: YinYang;     // Âm/Dương
}

/** Thông tin Địa Chi */
export interface ChiInfo {
  index: number;        // 0-11
  name: string;         // Tên địa chi
  element: NguHanh;     // Ngũ hành
  yinYang: YinYang;     // Âm/Dương
  animal: string;       // Con giáp
}

// ==================== DATA ====================

/**
 * 10 Thiên Can (Heavenly Stems)
 * Giáp/Ất = Mộc, Bính/Đinh = Hỏa, Mậu/Kỷ = Thổ, Canh/Tân = Kim, Nhâm/Quý = Thủy
 * Lẻ = Dương, Chẵn = Âm
 */
export const CAN_INFO: CanInfo[] = [
  { index: 0, name: 'Giáp', element: 'Mộc', yinYang: 'Dương' },
  { index: 1, name: 'Ất', element: 'Mộc', yinYang: 'Âm' },
  { index: 2, name: 'Bính', element: 'Hỏa', yinYang: 'Dương' },
  { index: 3, name: 'Đinh', element: 'Hỏa', yinYang: 'Âm' },
  { index: 4, name: 'Mậu', element: 'Thổ', yinYang: 'Dương' },
  { index: 5, name: 'Kỷ', element: 'Thổ', yinYang: 'Âm' },
  { index: 6, name: 'Canh', element: 'Kim', yinYang: 'Dương' },
  { index: 7, name: 'Tân', element: 'Kim', yinYang: 'Âm' },
  { index: 8, name: 'Nhâm', element: 'Thủy', yinYang: 'Dương' },
  { index: 9, name: 'Quý', element: 'Thủy', yinYang: 'Âm' },
];

/**
 * 12 Địa Chi (Earthly Branches)
 * Tý/Hợi = Thủy, Sửu/Thìn/Mùi/Tuất = Thổ, Dần/Mão = Mộc, Tỵ/Ngọ = Hỏa, Thân/Dậu = Kim
 */
export const CHI_INFO: ChiInfo[] = [
  { index: 0, name: 'Tý', element: 'Thủy', yinYang: 'Dương', animal: 'Chuột' },
  { index: 1, name: 'Sửu', element: 'Thổ', yinYang: 'Âm', animal: 'Trâu' },
  { index: 2, name: 'Dần', element: 'Mộc', yinYang: 'Dương', animal: 'Hổ' },
  { index: 3, name: 'Mão', element: 'Mộc', yinYang: 'Âm', animal: 'Mèo' },
  { index: 4, name: 'Thìn', element: 'Thổ', yinYang: 'Dương', animal: 'Rồng' },
  { index: 5, name: 'Tỵ', element: 'Hỏa', yinYang: 'Âm', animal: 'Rắn' },
  { index: 6, name: 'Ngọ', element: 'Hỏa', yinYang: 'Dương', animal: 'Ngựa' },
  { index: 7, name: 'Mùi', element: 'Thổ', yinYang: 'Âm', animal: 'Dê' },
  { index: 8, name: 'Thân', element: 'Kim', yinYang: 'Dương', animal: 'Khỉ' },
  { index: 9, name: 'Dậu', element: 'Kim', yinYang: 'Âm', animal: 'Gà' },
  { index: 10, name: 'Tuất', element: 'Thổ', yinYang: 'Dương', animal: 'Chó' },
  { index: 11, name: 'Hợi', element: 'Thủy', yinYang: 'Âm', animal: 'Lợn' },
];

// ==================== XUNG HỢP RELATIONS ====================

/**
 * Tam Hợp - 3 chi cách nhau 4 vị trí, hợp thành cục ngũ hành
 * Thân-Tý-Thìn (Thủy), Dậu-Sửu-Tỵ (Kim), Tuất-Dần-Ngọ (Hỏa), Hợi-Mão-Mùi (Mộc)
 */
export const CHI_TAM_HOP: number[][] = [
  [0, 4, 8],   // Tý - Thìn - Thân (Thủy cục)
  [1, 5, 9],   // Sửu - Tỵ - Dậu (Kim cục)
  [2, 6, 10],  // Dần - Ngọ - Tuất (Hỏa cục)
  [3, 7, 11],  // Mão - Mùi - Hợi (Mộc cục)
];

/**
 * Tứ Hành Xung - 2 chi đối diện (cách 6 vị trí) xung khắc nhau
 * Tý-Ngọ, Sửu-Mùi, Dần-Thân, Mão-Dậu, Thìn-Tuất, Tỵ-Hợi
 */
export const CHI_TU_HANH_XUNG: [number, number][] = [
  [0, 6],   // Tý - Ngọ
  [1, 7],   // Sửu - Mùi
  [2, 8],   // Dần - Thân
  [3, 9],   // Mão - Dậu
  [4, 10],  // Thìn - Tuất
  [5, 11],  // Tỵ - Hợi
];

/**
 * Lục Hợp - 6 cặp địa chi hợp nhau
 * Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
 */
export const CHI_LUC_HOP: [number, number][] = [
  [0, 1],   // Tý - Sửu (Thổ)
  [2, 11],  // Dần - Hợi (Mộc)
  [3, 10],  // Mão - Tuất (Hỏa)
  [4, 9],   // Thìn - Dậu (Kim)
  [5, 8],   // Tỵ - Thân (Thủy)
  [6, 7],   // Ngọ - Mùi (Thái Dương/Thái Âm)
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Lấy thông tin Thiên Can theo index
 * @param index - Chỉ số 0-9 (sẽ được mod 10)
 */
export function getCanInfo(index: number): CanInfo {
  const normalizedIndex = ((index % 10) + 10) % 10;
  return CAN_INFO[normalizedIndex];
}

/**
 * Lấy thông tin Địa Chi theo index
 * @param index - Chỉ số 0-11 (sẽ được mod 12)
 */
export function getChiInfo(index: number): ChiInfo {
  const normalizedIndex = ((index % 12) + 12) % 12;
  return CHI_INFO[normalizedIndex];
}

/**
 * Lấy thông tin xung hợp của một Địa Chi
 * @param chiIndex - Chỉ số địa chi (0-11)
 * @returns Đối tượng chứa: chi xung, tam hợp, lục hợp
 */
export function getChiXungHop(chiIndex: number): {
  xung: number[];
  tamHop: number[];
  lucHop: number | null;
} {
  const normalizedIndex = ((chiIndex % 12) + 12) % 12;

  // Tìm chi xung (cách 6 vị trí)
  const xungChi = (normalizedIndex + 6) % 12;
  const xung = [xungChi];

  // Tìm tam hợp
  let tamHop: number[] = [];
  for (const group of CHI_TAM_HOP) {
    if (group.includes(normalizedIndex)) {
      tamHop = group.filter(i => i !== normalizedIndex);
      break;
    }
  }

  // Tìm lục hợp
  let lucHop: number | null = null;
  for (const [a, b] of CHI_LUC_HOP) {
    if (a === normalizedIndex) {
      lucHop = b;
      break;
    }
    if (b === normalizedIndex) {
      lucHop = a;
      break;
    }
  }

  return { xung, tamHop, lucHop };
}

/**
 * Quan hệ tương sinh tương khắc giữa 2 ngũ hành
 * Sinh: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc
 * Khắc: Mộc → Thổ → Thủy → Hỏa → Kim → Mộc
 * @param element1 - Ngũ hành thứ nhất
 * @param element2 - Ngũ hành thứ hai
 * @returns 'sinh' (element1 sinh element2), 'khắc' (element1 khắc element2), 'bình' (cùng hành hoặc không sinh khắc)
 */
export function getNguHanhRelation(
  element1: NguHanh,
  element2: NguHanh
): 'sinh' | 'khắc' | 'bình' {
  if (element1 === element2) {
    return 'bình';
  }

  // Thứ tự ngũ hành trong vòng tương sinh: Mộc → Hỏa → Thổ → Kim → Thủy
  const sinhOrder: NguHanh[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
  const idx1 = sinhOrder.indexOf(element1);
  const idx2 = sinhOrder.indexOf(element2);

  // Tương sinh: element1 sinh element2 nếu idx2 = (idx1 + 1) % 5
  if ((idx1 + 1) % 5 === idx2) {
    return 'sinh';
  }

  // Tương khắc: element1 khắc element2 nếu idx2 = (idx1 + 2) % 5
  // Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc
  if ((idx1 + 2) % 5 === idx2) {
    return 'khắc';
  }

  return 'bình';
}

/**
 * Lấy màu sắc đại diện cho ngũ hành (Tailwind classes)
 */
export function getNguHanhColor(element: NguHanh): string {
  switch (element) {
    case 'Kim':
      return 'text-gray-500 dark:text-gray-300';
    case 'Mộc':
      return 'text-green-600 dark:text-green-400';
    case 'Thủy':
      return 'text-blue-600 dark:text-blue-400';
    case 'Hỏa':
      return 'text-red-600 dark:text-red-400';
    case 'Thổ':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

