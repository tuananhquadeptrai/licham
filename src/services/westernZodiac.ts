/**
 * Western Zodiac Service
 * Cung hoàng đạo phương Tây
 */

import type { FamilyProfile } from '../types/profile';
import { hasFullBirthday } from '../types/profile';

// ==================== TYPES ====================

export type WesternZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'scorpio' 
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type ZodiacElement = 'Lửa' | 'Đất' | 'Khí' | 'Nước';

export interface WesternZodiacInfo {
  id: WesternZodiacSign;
  nameVi: string;
  nameEn: string;
  symbol: string;
  dateRange: { 
    start: { day: number; month: number }; 
    end: { day: number; month: number };
  };
  element: ZodiacElement;
  rulingPlanet: string;
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
  overview: string;
  love: string;
  career: string;
  bestMatches: WesternZodiacSign[];
}

// ==================== DATA ====================

export const WESTERN_ZODIAC_SIGNS: WesternZodiacInfo[] = [
  {
    id: 'aries',
    nameVi: 'Bạch Dương',
    nameEn: 'Aries',
    symbol: '♈',
    dateRange: { start: { day: 21, month: 3 }, end: { day: 19, month: 4 } },
    element: 'Lửa',
    rulingPlanet: 'Sao Hỏa',
    keywords: ['Nhiệt huyết', 'Quyết đoán', 'Dũng cảm', 'Năng động'],
    strengths: ['Tự tin', 'Lạc quan', 'Trung thực', 'Đam mê'],
    weaknesses: ['Nóng nảy', 'Thiếu kiên nhẫn', 'Bốc đồng'],
    overview: 'Bạch Dương là cung hoàng đạo đầu tiên, đại diện cho sự khởi đầu mới. Họ có tính cách mạnh mẽ, quyết đoán và luôn sẵn sàng đối mặt với thử thách.',
    love: 'Trong tình yêu, Bạch Dương đam mê và trung thành. Họ thích chinh phục và cần đối phương có thể theo kịp năng lượng của mình.',
    career: 'Phù hợp với công việc đòi hỏi sự lãnh đạo, kinh doanh, thể thao, quân đội.',
    bestMatches: ['leo', 'sagittarius', 'gemini', 'aquarius'],
  },
  {
    id: 'taurus',
    nameVi: 'Kim Ngưu',
    nameEn: 'Taurus',
    symbol: '♉',
    dateRange: { start: { day: 20, month: 4 }, end: { day: 20, month: 5 } },
    element: 'Đất',
    rulingPlanet: 'Sao Kim',
    keywords: ['Kiên định', 'Thực tế', 'Đáng tin cậy', 'Kiên nhẫn'],
    strengths: ['Trung thành', 'Kiên nhẫn', 'Thực tế', 'Đáng tin'],
    weaknesses: ['Cứng đầu', 'Sở hữu', 'Bảo thủ'],
    overview: 'Kim Ngưu là người ổn định, thực tế và đáng tin cậy. Họ yêu thích sự an toàn, vật chất và những thú vui đơn giản trong cuộc sống.',
    love: 'Kim Ngưu tìm kiếm sự ổn định và an toàn trong tình yêu. Họ là người bạn đời trung thành và chu đáo.',
    career: 'Phù hợp với tài chính, ngân hàng, nghệ thuật, ẩm thực, nông nghiệp.',
    bestMatches: ['virgo', 'capricorn', 'cancer', 'pisces'],
  },
  {
    id: 'gemini',
    nameVi: 'Song Tử',
    nameEn: 'Gemini',
    symbol: '♊',
    dateRange: { start: { day: 21, month: 5 }, end: { day: 20, month: 6 } },
    element: 'Khí',
    rulingPlanet: 'Sao Thủy',
    keywords: ['Linh hoạt', 'Tò mò', 'Giao tiếp', 'Thông minh'],
    strengths: ['Thích ứng nhanh', 'Hài hước', 'Giao tiếp tốt', 'Sáng tạo'],
    weaknesses: ['Hay thay đổi', 'Hời hợt', 'Thiếu tập trung'],
    overview: 'Song Tử là cung hoàng đạo của sự giao tiếp và linh hoạt. Họ thông minh, tò mò và luôn tìm kiếm trải nghiệm mới.',
    love: 'Song Tử cần sự kích thích trí tuệ trong tình yêu. Họ thích đối phương thú vị và có thể trò chuyện về mọi chủ đề.',
    career: 'Phù hợp với truyền thông, báo chí, marketing, bán hàng, giáo dục.',
    bestMatches: ['libra', 'aquarius', 'aries', 'leo'],
  },
  {
    id: 'cancer',
    nameVi: 'Cự Giải',
    nameEn: 'Cancer',
    symbol: '♋',
    dateRange: { start: { day: 21, month: 6 }, end: { day: 22, month: 7 } },
    element: 'Nước',
    rulingPlanet: 'Mặt Trăng',
    keywords: ['Nhạy cảm', 'Chu đáo', 'Trực giác', 'Bảo vệ'],
    strengths: ['Giàu tình cảm', 'Trung thành', 'Quan tâm', 'Trực giác tốt'],
    weaknesses: ['Hay lo lắng', 'Nhạy cảm quá', 'Hay hoài nghi'],
    overview: 'Cự Giải là cung hoàng đạo của gia đình và cảm xúc. Họ có trái tim ấm áp, luôn quan tâm và bảo vệ người thân.',
    love: 'Cự Giải là người yêu hết mình và cần cảm giác an toàn. Họ tìm kiếm đối phương có thể xây dựng tổ ấm cùng mình.',
    career: 'Phù hợp với chăm sóc sức khỏe, giáo dục, nấu ăn, bất động sản, tâm lý.',
    bestMatches: ['scorpio', 'pisces', 'taurus', 'virgo'],
  },
  {
    id: 'leo',
    nameVi: 'Sư Tử',
    nameEn: 'Leo',
    symbol: '♌',
    dateRange: { start: { day: 23, month: 7 }, end: { day: 22, month: 8 } },
    element: 'Lửa',
    rulingPlanet: 'Mặt Trời',
    keywords: ['Tự tin', 'Sáng tạo', 'Hào phóng', 'Lãnh đạo'],
    strengths: ['Tự tin', 'Hào phóng', 'Trung thành', 'Có sức hút'],
    weaknesses: ['Kiêu ngạo', 'Thích thể hiện', 'Cứng đầu'],
    overview: 'Sư Tử là vua của hoàng đạo. Họ tự tin, sáng tạo và có khả năng lãnh đạo bẩm sinh. Họ luôn là trung tâm của sự chú ý.',
    love: 'Sư Tử yêu mãnh liệt và cần được tôn trọng, ngưỡng mộ. Họ là người bạn đời hào phóng và bảo vệ.',
    career: 'Phù hợp với nghệ thuật, giải trí, quản lý, chính trị, kinh doanh.',
    bestMatches: ['aries', 'sagittarius', 'gemini', 'libra'],
  },
  {
    id: 'virgo',
    nameVi: 'Xử Nữ',
    nameEn: 'Virgo',
    symbol: '♍',
    dateRange: { start: { day: 23, month: 8 }, end: { day: 22, month: 9 } },
    element: 'Đất',
    rulingPlanet: 'Sao Thủy',
    keywords: ['Tỉ mỉ', 'Phân tích', 'Thực tế', 'Chăm chỉ'],
    strengths: ['Cẩn thận', 'Đáng tin', 'Kiên nhẫn', 'Thực tế'],
    weaknesses: ['Hay lo lắng', 'Cầu toàn quá', 'Hay chỉ trích'],
    overview: 'Xử Nữ là cung hoàng đạo của sự hoàn hảo. Họ tỉ mỉ, chăm chỉ và luôn cố gắng cải thiện mọi thứ xung quanh.',
    love: 'Xử Nữ thể hiện tình yêu qua hành động và sự chăm sóc. Họ tìm kiếm đối phương thông minh và đáng tin.',
    career: 'Phù hợp với y tế, nghiên cứu, phân tích, kế toán, biên tập.',
    bestMatches: ['taurus', 'capricorn', 'cancer', 'scorpio'],
  },
  {
    id: 'libra',
    nameVi: 'Thiên Bình',
    nameEn: 'Libra',
    symbol: '♎',
    dateRange: { start: { day: 23, month: 9 }, end: { day: 22, month: 10 } },
    element: 'Khí',
    rulingPlanet: 'Sao Kim',
    keywords: ['Công bằng', 'Hài hòa', 'Xã giao', 'Thẩm mỹ'],
    strengths: ['Hòa nhã', 'Công bằng', 'Giao tiếp tốt', 'Tinh tế'],
    weaknesses: ['Thiếu quyết đoán', 'Hay né tránh', 'Phụ thuộc'],
    overview: 'Thiên Bình là cung hoàng đạo của sự cân bằng và công lý. Họ yêu thích sự hài hòa, đẹp đẽ và các mối quan hệ.',
    love: 'Thiên Bình là người lãng mạn và tìm kiếm sự cân bằng trong tình yêu. Họ cần đối phương có thể đồng hành lâu dài.',
    career: 'Phù hợp với luật, ngoại giao, thiết kế, nghệ thuật, quan hệ công chúng.',
    bestMatches: ['gemini', 'aquarius', 'leo', 'sagittarius'],
  },
  {
    id: 'scorpio',
    nameVi: 'Bọ Cạp',
    nameEn: 'Scorpio',
    symbol: '♏',
    dateRange: { start: { day: 23, month: 10 }, end: { day: 21, month: 11 } },
    element: 'Nước',
    rulingPlanet: 'Sao Diêm Vương',
    keywords: ['Mãnh liệt', 'Bí ẩn', 'Quyết tâm', 'Trực giác'],
    strengths: ['Kiên cường', 'Trung thành', 'Sâu sắc', 'Quyết đoán'],
    weaknesses: ['Hay ghen', 'Bí mật quá', 'Hay thù hận'],
    overview: 'Bọ Cạp là cung hoàng đạo mãnh liệt và bí ẩn nhất. Họ có ý chí mạnh mẽ, trực giác sắc bén và cảm xúc sâu sắc.',
    love: 'Bọ Cạp yêu với cường độ cao và cần sự trung thành tuyệt đối. Họ là người yêu đam mê và bảo vệ.',
    career: 'Phù hợp với điều tra, tâm lý, y học, tài chính, nghiên cứu.',
    bestMatches: ['cancer', 'pisces', 'virgo', 'capricorn'],
  },
  {
    id: 'sagittarius',
    nameVi: 'Nhân Mã',
    nameEn: 'Sagittarius',
    symbol: '♐',
    dateRange: { start: { day: 22, month: 11 }, end: { day: 21, month: 12 } },
    element: 'Lửa',
    rulingPlanet: 'Sao Mộc',
    keywords: ['Phiêu lưu', 'Lạc quan', 'Tự do', 'Triết học'],
    strengths: ['Lạc quan', 'Hài hước', 'Thành thật', 'Rộng lượng'],
    weaknesses: ['Thiếu kiên nhẫn', 'Hứa nhiều', 'Vô tâm'],
    overview: 'Nhân Mã là nhà thám hiểm của hoàng đạo. Họ yêu thích tự do, phiêu lưu và luôn tìm kiếm ý nghĩa cuộc sống.',
    love: 'Nhân Mã cần tự do trong tình yêu và tìm kiếm đối phương có thể cùng khám phá thế giới.',
    career: 'Phù hợp với du lịch, giáo dục, triết học, xuất bản, thể thao.',
    bestMatches: ['aries', 'leo', 'libra', 'aquarius'],
  },
  {
    id: 'capricorn',
    nameVi: 'Ma Kết',
    nameEn: 'Capricorn',
    symbol: '♑',
    dateRange: { start: { day: 22, month: 12 }, end: { day: 19, month: 1 } },
    element: 'Đất',
    rulingPlanet: 'Sao Thổ',
    keywords: ['Tham vọng', 'Kỷ luật', 'Kiên nhẫn', 'Thực tế'],
    strengths: ['Có trách nhiệm', 'Kỷ luật', 'Kiên trì', 'Thực tế'],
    weaknesses: ['Cứng nhắc', 'Bi quan', 'Hay lo lắng'],
    overview: 'Ma Kết là cung hoàng đạo của sự tham vọng và kiên trì. Họ làm việc chăm chỉ để đạt được mục tiêu và thành công.',
    love: 'Ma Kết tìm kiếm sự ổn định và cam kết lâu dài. Họ thể hiện tình yêu qua hành động và sự chăm sóc.',
    career: 'Phù hợp với quản lý, tài chính, luật, kiến trúc, chính trị.',
    bestMatches: ['taurus', 'virgo', 'scorpio', 'pisces'],
  },
  {
    id: 'aquarius',
    nameVi: 'Bảo Bình',
    nameEn: 'Aquarius',
    symbol: '♒',
    dateRange: { start: { day: 20, month: 1 }, end: { day: 18, month: 2 } },
    element: 'Khí',
    rulingPlanet: 'Sao Thiên Vương',
    keywords: ['Độc lập', 'Sáng tạo', 'Nhân đạo', 'Tiến bộ'],
    strengths: ['Độc lập', 'Sáng tạo', 'Nhân đạo', 'Trí tuệ'],
    weaknesses: ['Xa cách', 'Cứng đầu', 'Khó đoán'],
    overview: 'Bảo Bình là nhà cách mạng của hoàng đạo. Họ độc lập, sáng tạo và luôn hướng tới tương lai.',
    love: 'Bảo Bình cần tự do và kết nối trí tuệ. Họ tìm kiếm đối phương độc đáo và tôn trọng không gian riêng.',
    career: 'Phù hợp với công nghệ, khoa học, nhân đạo, nghệ thuật, phát minh.',
    bestMatches: ['gemini', 'libra', 'aries', 'sagittarius'],
  },
  {
    id: 'pisces',
    nameVi: 'Song Ngư',
    nameEn: 'Pisces',
    symbol: '♓',
    dateRange: { start: { day: 19, month: 2 }, end: { day: 20, month: 3 } },
    element: 'Nước',
    rulingPlanet: 'Sao Hải Vương',
    keywords: ['Nhạy cảm', 'Trực giác', 'Nghệ sĩ', 'Đồng cảm'],
    strengths: ['Giàu tình cảm', 'Sáng tạo', 'Trực giác', 'Nhân ái'],
    weaknesses: ['Hay mơ mộng', 'Dễ bị tổn thương', 'Hay trốn tránh'],
    overview: 'Song Ngư là cung hoàng đạo cuối cùng, kết hợp tất cả. Họ nhạy cảm, trực giác và có tâm hồn nghệ sĩ.',
    love: 'Song Ngư yêu hết mình và cần sự kết nối tâm hồn. Họ là người lãng mạn và sẵn sàng hy sinh vì tình yêu.',
    career: 'Phù hợp với nghệ thuật, âm nhạc, tâm lý, chăm sóc sức khỏe, từ thiện.',
    bestMatches: ['cancer', 'scorpio', 'taurus', 'capricorn'],
  },
];

// ==================== HELPER FUNCTIONS ====================

function isDateInRange(
  day: number, 
  month: number, 
  start: { day: number; month: number }, 
  end: { day: number; month: number }
): boolean {
  const dateValue = month * 100 + day;
  const startValue = start.month * 100 + start.day;
  const endValue = end.month * 100 + end.day;
  
  if (startValue <= endValue) {
    return dateValue >= startValue && dateValue <= endValue;
  } else {
    return dateValue >= startValue || dateValue <= endValue;
  }
}

// ==================== MAIN FUNCTIONS ====================

export function getWesternZodiacSign(day: number, month: number): WesternZodiacSign | null {
  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return null;
  }
  
  for (const sign of WESTERN_ZODIAC_SIGNS) {
    if (isDateInRange(day, month, sign.dateRange.start, sign.dateRange.end)) {
      return sign.id;
    }
  }
  
  return null;
}

export function getWesternZodiacInfo(sign: WesternZodiacSign): WesternZodiacInfo | null {
  return WESTERN_ZODIAC_SIGNS.find(s => s.id === sign) || null;
}

export function getProfileWesternZodiac(profile: FamilyProfile): { 
  sign: WesternZodiacSign; 
  info: WesternZodiacInfo;
} | null {
  if (!hasFullBirthday(profile) || !profile.birthDay || !profile.birthMonth) {
    return null;
  }
  
  const sign = getWesternZodiacSign(profile.birthDay, profile.birthMonth);
  if (!sign) return null;
  
  const info = getWesternZodiacInfo(sign);
  if (!info) return null;
  
  return { sign, info };
}

export function getZodiacCompatibilityScore(sign1: WesternZodiacSign, sign2: WesternZodiacSign): {
  score: number;
  description: string;
} {
  const info1 = getWesternZodiacInfo(sign1);
  const info2 = getWesternZodiacInfo(sign2);
  
  if (!info1 || !info2) {
    return { score: 50, description: 'Không xác định' };
  }
  
  if (info1.bestMatches.includes(sign2)) {
    return { score: 90, description: 'Rất hợp nhau' };
  }
  
  if (info2.bestMatches.includes(sign1)) {
    return { score: 85, description: 'Hợp nhau' };
  }
  
  if (info1.element === info2.element) {
    return { score: 75, description: 'Tương đồng nguyên tố' };
  }
  
  const compatibleElements: Record<ZodiacElement, ZodiacElement[]> = {
    'Lửa': ['Khí'],
    'Đất': ['Nước'],
    'Khí': ['Lửa'],
    'Nước': ['Đất'],
  };
  
  if (compatibleElements[info1.element].includes(info2.element)) {
    return { score: 70, description: 'Nguyên tố hỗ trợ' };
  }
  
  return { score: 50, description: 'Bình thường' };
}

export function getDailyMessage(sign: WesternZodiacSign, date: Date = new Date()): string {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const signIndex = WESTERN_ZODIAC_SIGNS.findIndex(s => s.id === sign);
  
  const messages = [
    'Hôm nay là ngày tốt để bắt đầu dự án mới.',
    'Hãy chú ý đến sức khỏe và nghỉ ngơi đầy đủ.',
    'Cơ hội tài chính có thể xuất hiện bất ngờ.',
    'Tình cảm có nhiều tiến triển tích cực.',
    'Nên cẩn thận trong giao tiếp hôm nay.',
    'Đây là thời điểm tốt để học hỏi điều mới.',
    'Hãy dành thời gian cho người thân yêu.',
    'Sự kiên nhẫn sẽ mang lại kết quả tốt.',
    'Hôm nay phù hợp cho các hoạt động sáng tạo.',
    'Nên tránh đưa ra quyết định quan trọng.',
    'May mắn sẽ đến với bạn trong công việc.',
    'Hãy lắng nghe trực giác của mình.',
  ];
  
  const messageIndex = (dayOfYear + signIndex) % messages.length;
  return messages[messageIndex];
}
