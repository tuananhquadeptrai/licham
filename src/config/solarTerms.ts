/**
 * 24 Solar Terms (Nhị Thập Tứ Tiết Khí)
 * Góc kinh độ Mặt Trời tương ứng với mỗi tiết khí
 */

// ============================================================
// INTERFACES
// ============================================================

/**
 * Legacy interface for backward compatibility
 */
export interface SolarTerm {
  index: number;           // 0-23
  name: string;            // Tên tiếng Việt
  chineseName: string;     // Tên Hán Việt
  sunLongitude: number;    // Góc kinh độ Mặt Trời (0-360°)
  approximateDate: string; // Ngày dương lịch gần đúng
  description?: string;
}

/**
 * Extended interface with full details
 */
export interface SolarTermInfo {
  index: number;         // 0-23
  nameVi: string;        // Tên tiếng Việt
  nameEn: string;        // Tên tiếng Anh
  nameChinese: string;   // Tên chữ Hán
  sunLongitude: number;  // Góc kinh độ Mặt Trời (0, 15, 30, 45, ...)
  approxDate: string;    // Ngày xấp xỉ (e.g., "Feb 4")
  description: { vi: string; en: string };
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

// ============================================================
// 24 SOLAR TERMS DATA - Ordered by sun longitude (0° to 345°)
// ============================================================

/**
 * Complete 24 Solar Terms with detailed information
 * Ordered by sun longitude starting from Xuân Phân (0°)
 */
export const solarTermsInfo: SolarTermInfo[] = [
  // === MÙA XUÂN (SPRING) ===
  {
    index: 0,
    nameVi: "Xuân Phân",
    nameEn: "Spring Equinox",
    nameChinese: "春分",
    sunLongitude: 0,
    approxDate: "Mar 20",
    description: {
      vi: "Ngày và đêm dài bằng nhau. Mặt Trời chiếu thẳng xích đạo, đánh dấu giữa mùa xuân.",
      en: "Day and night are of equal length. The Sun shines directly on the equator, marking mid-spring."
    },
    season: 'spring'
  },
  {
    index: 1,
    nameVi: "Thanh Minh",
    nameEn: "Pure Brightness",
    nameChinese: "清明",
    sunLongitude: 15,
    approxDate: "Apr 4",
    description: {
      vi: "Trời trong sáng, cây cỏ xanh tươi. Lễ Tảo mộ - viếng mộ tổ tiên.",
      en: "Clear and bright weather. Traditional time for tomb sweeping and honoring ancestors."
    },
    season: 'spring'
  },
  {
    index: 2,
    nameVi: "Cốc Vũ",
    nameEn: "Grain Rain",
    nameChinese: "穀雨",
    sunLongitude: 30,
    approxDate: "Apr 20",
    description: {
      vi: "Mưa rào nuôi dưỡng ngũ cốc. Thời điểm tốt để gieo trồng.",
      en: "Spring rains nourish grain crops. Ideal time for planting."
    },
    season: 'spring'
  },

  // === MÙA HẠ (SUMMER) ===
  {
    index: 3,
    nameVi: "Lập Hạ",
    nameEn: "Start of Summer",
    nameChinese: "立夏",
    sunLongitude: 45,
    approxDate: "May 5",
    description: {
      vi: "Bắt đầu mùa hạ. Thời tiết ấm dần, cây cối tươi tốt.",
      en: "Beginning of summer. Weather warms up, plants flourish."
    },
    season: 'summer'
  },
  {
    index: 4,
    nameVi: "Tiểu Mãn",
    nameEn: "Grain Buds",
    nameChinese: "小滿",
    sunLongitude: 60,
    approxDate: "May 21",
    description: {
      vi: "Lúa bắt đầu trổ bông, hạt còn non. Mùa màng đang phát triển.",
      en: "Grain crops begin to ripen but are not yet full. Crops are developing."
    },
    season: 'summer'
  },
  {
    index: 5,
    nameVi: "Mang Chủng",
    nameEn: "Grain in Ear",
    nameChinese: "芒種",
    sunLongitude: 75,
    approxDate: "Jun 5",
    description: {
      vi: "Thời điểm gieo mạ, cấy lúa. Lúa mì chín, bắt đầu gặt.",
      en: "Time for sowing millet and transplanting rice. Wheat ripens and harvest begins."
    },
    season: 'summer'
  },
  {
    index: 6,
    nameVi: "Hạ Chí",
    nameEn: "Summer Solstice",
    nameChinese: "夏至",
    sunLongitude: 90,
    approxDate: "Jun 21",
    description: {
      vi: "Ngày dài nhất năm ở Bắc bán cầu. Mặt Trời ở vị trí cao nhất.",
      en: "Longest day of the year in the Northern Hemisphere. The Sun reaches its highest position."
    },
    season: 'summer'
  },
  {
    index: 7,
    nameVi: "Tiểu Thử",
    nameEn: "Minor Heat",
    nameChinese: "小暑",
    sunLongitude: 105,
    approxDate: "Jul 7",
    description: {
      vi: "Bắt đầu nóng, nhưng chưa phải nóng nhất. Mùa hè đang cao điểm.",
      en: "Weather starts getting hot, but not yet the hottest. Peak of summer approaches."
    },
    season: 'summer'
  },
  {
    index: 8,
    nameVi: "Đại Thử",
    nameEn: "Major Heat",
    nameChinese: "大暑",
    sunLongitude: 120,
    approxDate: "Jul 22",
    description: {
      vi: "Thời điểm nóng nhất trong năm. Cần chú ý giữ gìn sức khỏe.",
      en: "Hottest period of the year. Important to take care of health."
    },
    season: 'summer'
  },

  // === MÙA THU (AUTUMN) ===
  {
    index: 9,
    nameVi: "Lập Thu",
    nameEn: "Start of Autumn",
    nameChinese: "立秋",
    sunLongitude: 135,
    approxDate: "Aug 7",
    description: {
      vi: "Bắt đầu mùa thu. Thời tiết mát dần, lá bắt đầu đổi màu.",
      en: "Beginning of autumn. Weather cools down, leaves start changing color."
    },
    season: 'autumn'
  },
  {
    index: 10,
    nameVi: "Xử Thử",
    nameEn: "End of Heat",
    nameChinese: "處暑",
    sunLongitude: 150,
    approxDate: "Aug 23",
    description: {
      vi: "Kết thúc thời kỳ nóng bức. Thời tiết dịu mát hơn.",
      en: "End of the hot season. Weather becomes milder."
    },
    season: 'autumn'
  },
  {
    index: 11,
    nameVi: "Bạch Lộ",
    nameEn: "White Dew",
    nameChinese: "白露",
    sunLongitude: 165,
    approxDate: "Sep 7",
    description: {
      vi: "Sương trắng xuất hiện buổi sáng. Đêm lạnh hơn, chênh lệch nhiệt độ ngày đêm lớn.",
      en: "White dew appears in the morning. Nights get colder, temperature difference increases."
    },
    season: 'autumn'
  },
  {
    index: 12,
    nameVi: "Thu Phân",
    nameEn: "Autumn Equinox",
    nameChinese: "秋分",
    sunLongitude: 180,
    approxDate: "Sep 23",
    description: {
      vi: "Ngày và đêm dài bằng nhau. Mặt Trời chiếu thẳng xích đạo, giữa mùa thu.",
      en: "Day and night are equal in length. The Sun shines directly on the equator, mid-autumn."
    },
    season: 'autumn'
  },
  {
    index: 13,
    nameVi: "Hàn Lộ",
    nameEn: "Cold Dew",
    nameChinese: "寒露",
    sunLongitude: 195,
    approxDate: "Oct 8",
    description: {
      vi: "Sương lạnh. Thời tiết se lạnh, chuẩn bị cho mùa đông.",
      en: "Cold dew forms. Weather gets chilly, preparing for winter."
    },
    season: 'autumn'
  },
  {
    index: 14,
    nameVi: "Sương Giáng",
    nameEn: "Frost Descent",
    nameChinese: "霜降",
    sunLongitude: 210,
    approxDate: "Oct 23",
    description: {
      vi: "Sương muối bắt đầu rơi. Tiết cuối thu, chuẩn bị vào đông.",
      en: "First frost of the season. Late autumn, transitioning to winter."
    },
    season: 'autumn'
  },

  // === MÙA ĐÔNG (WINTER) ===
  {
    index: 15,
    nameVi: "Lập Đông",
    nameEn: "Start of Winter",
    nameChinese: "立冬",
    sunLongitude: 225,
    approxDate: "Nov 7",
    description: {
      vi: "Bắt đầu mùa đông. Thời tiết lạnh, cây cối ngủ đông.",
      en: "Beginning of winter. Cold weather, plants enter dormancy."
    },
    season: 'winter'
  },
  {
    index: 16,
    nameVi: "Tiểu Tuyết",
    nameEn: "Minor Snow",
    nameChinese: "小雪",
    sunLongitude: 240,
    approxDate: "Nov 22",
    description: {
      vi: "Tuyết nhẹ bắt đầu rơi ở vùng cao. Thời tiết lạnh hơn.",
      en: "Light snow begins in highland areas. Weather gets colder."
    },
    season: 'winter'
  },
  {
    index: 17,
    nameVi: "Đại Tuyết",
    nameEn: "Major Snow",
    nameChinese: "大雪",
    sunLongitude: 255,
    approxDate: "Dec 7",
    description: {
      vi: "Tuyết rơi nhiều. Mùa đông đang sâu.",
      en: "Heavy snowfall. Deep winter season."
    },
    season: 'winter'
  },
  {
    index: 18,
    nameVi: "Đông Chí",
    nameEn: "Winter Solstice",
    nameChinese: "冬至",
    sunLongitude: 270,
    approxDate: "Dec 21",
    description: {
      vi: "Đêm dài nhất năm ở Bắc bán cầu. Mặt Trời ở vị trí thấp nhất.",
      en: "Longest night of the year in Northern Hemisphere. Sun at its lowest position."
    },
    season: 'winter'
  },
  {
    index: 19,
    nameVi: "Tiểu Hàn",
    nameEn: "Minor Cold",
    nameChinese: "小寒",
    sunLongitude: 285,
    approxDate: "Jan 5",
    description: {
      vi: "Bắt đầu lạnh giá. Thời kỳ lạnh đang đến.",
      en: "Beginning of severe cold. The coldest period approaches."
    },
    season: 'winter'
  },
  {
    index: 20,
    nameVi: "Đại Hàn",
    nameEn: "Major Cold",
    nameChinese: "大寒",
    sunLongitude: 300,
    approxDate: "Jan 20",
    description: {
      vi: "Thời điểm lạnh nhất trong năm. Chuẩn bị đón xuân mới.",
      en: "Coldest period of the year. Preparing for the new spring."
    },
    season: 'winter'
  },
  {
    index: 21,
    nameVi: "Lập Xuân",
    nameEn: "Start of Spring",
    nameChinese: "立春",
    sunLongitude: 315,
    approxDate: "Feb 4",
    description: {
      vi: "Bắt đầu mùa xuân. Vạn vật hồi sinh, năm mới bắt đầu theo lịch cổ.",
      en: "Beginning of spring. All things revive, new year begins in traditional calendar."
    },
    season: 'spring'
  },
  {
    index: 22,
    nameVi: "Vũ Thủy",
    nameEn: "Rain Water",
    nameChinese: "雨水",
    sunLongitude: 330,
    approxDate: "Feb 18",
    description: {
      vi: "Mưa xuân bắt đầu. Băng tan, thời tiết ấm dần.",
      en: "Spring rain begins. Ice melts, weather gradually warms."
    },
    season: 'spring'
  },
  {
    index: 23,
    nameVi: "Kinh Trập",
    nameEn: "Awakening of Insects",
    nameChinese: "驚蟄",
    sunLongitude: 345,
    approxDate: "Mar 5",
    description: {
      vi: "Sấm xuân đánh thức côn trùng ngủ đông. Thiên nhiên hồi sinh.",
      en: "Spring thunder awakens hibernating insects. Nature comes back to life."
    },
    season: 'spring'
  }
];

// ============================================================
// LEGACY DATA (for backward compatibility)
// ============================================================

/**
 * Legacy solar terms array - preserves original ordering and format
 * @deprecated Use solarTermsInfo instead for new code
 */
export const solarTerms: SolarTerm[] = solarTermsInfo.map((info, idx) => ({
  index: idx,
  name: info.nameVi,
  chineseName: info.nameChinese,
  sunLongitude: info.sunLongitude,
  approximateDate: info.approxDate.replace('Jan', '01').replace('Feb', '02').replace('Mar', '03')
    .replace('Apr', '04').replace('May', '05').replace('Jun', '06')
    .replace('Jul', '07').replace('Aug', '08').replace('Sep', '09')
    .replace('Oct', '10').replace('Nov', '11').replace('Dec', '12')
    .replace(/(\d+)\s+(\d+)/, '$2/$1'),
  description: info.description.vi
}));

// ============================================================
// LOOKUP TABLES
// ============================================================

/**
 * Quick lookup by sun longitude (exact match)
 */
const longitudeToTermMap = new Map<number, SolarTermInfo>(
  solarTermsInfo.map(term => [term.sunLongitude, term])
);

/**
 * Ordered list of sun longitudes for binary search
 */
const sortedLongitudes = [...solarTermsInfo]
  .sort((a, b) => a.sunLongitude - b.sunLongitude)
  .map(t => t.sunLongitude);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get solar term by index (0-23)
 * Returns the term at the given index, wrapping around if necessary
 */
export function getSolarTermByIndex(index: number): SolarTermInfo {
  const normalizedIndex = ((index % 24) + 24) % 24;
  return solarTermsInfo[normalizedIndex];
}

/**
 * Get solar term by exact sun longitude
 * @param longitude - Sun longitude in degrees (0, 15, 30, ..., 345)
 * @returns SolarTermInfo if exact match found, null otherwise
 */
export function getSolarTermByLongitude(longitude: number): SolarTermInfo | null {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  return longitudeToTermMap.get(normalizedLong) ?? null;
}

/**
 * Get the current solar term containing a given sun longitude
 * @param sunLongitude - Current sun longitude (0-360)
 * @returns The solar term that the sun is currently in
 */
export function getCurrentSolarTerm(sunLongitude: number): SolarTermInfo {
  const normalizedLong = ((sunLongitude % 360) + 360) % 360;
  
  // Find the term whose longitude is <= current, but next term's longitude is > current
  for (let i = sortedLongitudes.length - 1; i >= 0; i--) {
    if (normalizedLong >= sortedLongitudes[i]) {
      return longitudeToTermMap.get(sortedLongitudes[i])!;
    }
  }
  // Wrap around: if longitude is less than all terms, we're in the last term (Kinh Trập @ 345°)
  return longitudeToTermMap.get(345)!;
}

/**
 * Calculate approximate date for a solar term in a given year
 * Uses a simple algorithm based on the sun longitude
 */
function calculateSolarTermDate(sunLongitude: number, year: number): Date {
  // Solar terms are evenly spaced roughly 15.22 days apart
  // Xuân Phân (0°) typically falls around March 20
  const marchEquinox = new Date(year, 2, 20, 12, 0, 0); // March 20 noon
  
  // Days per degree of sun longitude
  const daysPerDegree = 365.25 / 360;
  
  // Calculate days from March equinox
  const daysFromEquinox = sunLongitude * daysPerDegree;
  
  const termDate = new Date(marchEquinox);
  termDate.setDate(termDate.getDate() + Math.round(daysFromEquinox));
  
  return termDate;
}

/**
 * Get all 24 solar terms with their approximate dates for a given year
 * @param year - The year to calculate for
 * @returns Array of objects with term info and calculated date
 */
export function getAllSolarTermsForYear(year: number): Array<{ term: SolarTermInfo; date: Date }> {
  return solarTermsInfo
    .slice()
    .sort((a, b) => {
      // Sort by date order within a year (Tiểu Hàn in Jan comes first)
      const dateA = calculateSolarTermDate(a.sunLongitude, year);
      const dateB = calculateSolarTermDate(b.sunLongitude, year);
      return dateA.getTime() - dateB.getTime();
    })
    .map(term => ({
      term,
      date: calculateSolarTermDate(term.sunLongitude, year)
    }));
}

/**
 * Get solar terms for a specific season
 * @param season - The season to filter by
 */
export function getSolarTermsBySeason(season: SolarTermInfo['season']): SolarTermInfo[] {
  return solarTermsInfo.filter(term => term.season === season);
}

/**
 * Get the next solar term from a given date
 * @param fromDate - The starting date
 * @returns Object with the next term and its approximate date
 */
export function getNextSolarTerm(fromDate: Date = new Date()): { term: SolarTermInfo; date: Date } {
  const year = fromDate.getFullYear();
  
  // Get terms for current year and next year
  const termsThisYear = getAllSolarTermsForYear(year);
  const termsNextYear = getAllSolarTermsForYear(year + 1);
  
  const allTerms = [...termsThisYear, ...termsNextYear];
  
  for (const item of allTerms) {
    if (item.date > fromDate) {
      return item;
    }
  }
  
  // Fallback (should not reach here)
  return termsNextYear[0];
}

// ============================================================
// LEGACY FUNCTION COMPATIBILITY
// ============================================================

/**
 * Legacy function - Get solar term by sun longitude (returns range match)
 * @deprecated Use getSolarTermByLongitude or getCurrentSolarTerm instead
 */
export function getSolarTermByLongitudeLegacy(sunLongitude: number): SolarTerm | undefined {
  const term = getCurrentSolarTerm(sunLongitude);
  return solarTerms.find(t => t.sunLongitude === term.sunLongitude);
}

/**
 * Legacy function - Get solar term by index
 * @deprecated Use getSolarTermByIndex (returns SolarTermInfo) instead
 */
export function getSolarTermByIndexLegacy(index: number): SolarTerm | undefined {
  return solarTerms[index % 24];
}

/**
 * Lấy tên tiết khí theo góc kinh độ
 */
export function getSolarTermName(sunLongitude: number): string | undefined {
  const term = getCurrentSolarTerm(sunLongitude);
  return term?.nameVi;
}

/**
 * Kiểm tra xem một ngày có phải là ngày tiết khí không
 * (Ngày mà Mặt Trời đạt đúng góc 0°, 15°, 30°, ... 345°)
 */
export function isSolarTermDay(sunLongitudeAtNoon: number, previousDaySunLongitude: number): SolarTerm | undefined {
  for (const term of solarTerms) {
    // Kiểm tra xem góc tiết khí có nằm giữa 2 ngày không
    const termLong = term.sunLongitude;
    
    // Xử lý wrap around (vd: từ 359° sang 1°)
    let prev = previousDaySunLongitude;
    let curr = sunLongitudeAtNoon;
    let target = termLong;
    
    if (prev > curr) {
      // Crossing 360°
      if (target <= curr) target += 360;
      curr += 360;
    }
    
    if (prev < target && target <= curr) {
      return term;
    }
  }
  return undefined;
}

/**
 * Check if a date is a solar term day (extended version)
 * Returns detailed SolarTermInfo instead of legacy SolarTerm
 */
export function isSolarTermDayDetailed(
  sunLongitudeAtNoon: number, 
  previousDaySunLongitude: number
): SolarTermInfo | undefined {
  const legacyResult = isSolarTermDay(sunLongitudeAtNoon, previousDaySunLongitude);
  if (!legacyResult) return undefined;
  
  return solarTermsInfo.find(t => t.sunLongitude === legacyResult.sunLongitude);
}
