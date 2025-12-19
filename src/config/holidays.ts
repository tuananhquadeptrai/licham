/**
 * Vietnamese Holidays Configuration
 * Cấu hình các ngày lễ Việt Nam
 */

export type HolidayType = 'public' | 'traditional' | 'commemorative' | 'international' | 'religious';

export interface Holiday {
  month: number;
  day: number;
  name: string;
  type: HolidayType;
  duration?: number; // Số ngày nghỉ (mặc định 1)
  description?: string;
}

// ==========================================
// Ngày lễ Dương lịch (Solar Holidays)
// ==========================================
export const solarHolidays: Holiday[] = [
  // Ngày lễ chính thức (public holidays)
  { month: 1, day: 1, name: "Tết Dương lịch", type: "public", description: "Năm mới dương lịch" },
  { month: 4, day: 30, name: "Ngày Giải phóng miền Nam", type: "public", description: "Thống nhất đất nước 1975" },
  { month: 5, day: 1, name: "Quốc tế Lao động", type: "public", description: "International Workers' Day" },
  { month: 9, day: 2, name: "Quốc khánh", type: "public", description: "Độc lập 1945" },

  // Ngày kỷ niệm (commemorative days)
  { month: 2, day: 3, name: "Ngày thành lập Đảng", type: "commemorative" },
  { month: 2, day: 14, name: "Lễ Tình nhân", type: "international", description: "Valentine's Day" },
  { month: 2, day: 27, name: "Ngày Thầy thuốc VN", type: "commemorative" },
  { month: 3, day: 8, name: "Quốc tế Phụ nữ", type: "international" },
  { month: 3, day: 26, name: "Ngày thành lập Đoàn TNCS", type: "commemorative" },
  { month: 4, day: 21, name: "Ngày Sách VN", type: "commemorative" },
  { month: 5, day: 7, name: "Chiến thắng Điện Biên Phủ", type: "commemorative" },
  { month: 5, day: 13, name: "Ngày của Mẹ", type: "international", description: "Mother's Day (CN thứ 2 tháng 5)" },
  { month: 5, day: 15, name: "Ngày thành lập Công an", type: "commemorative" },
  { month: 5, day: 19, name: "Ngày sinh Chủ tịch HCM", type: "commemorative" },
  { month: 6, day: 1, name: "Quốc tế Thiếu nhi", type: "international" },
  { month: 6, day: 17, name: "Ngày của Cha", type: "international", description: "Father's Day (CN thứ 3 tháng 6)" },
  { month: 6, day: 21, name: "Ngày Báo chí VN", type: "commemorative" },
  { month: 6, day: 28, name: "Ngày Gia đình VN", type: "commemorative" },
  { month: 7, day: 27, name: "Ngày Thương binh Liệt sĩ", type: "commemorative" },
  { month: 7, day: 28, name: "Ngày thành lập Công đoàn VN", type: "commemorative" },
  { month: 8, day: 19, name: "Cách mạng Tháng Tám", type: "commemorative" },
  { month: 10, day: 1, name: "Ngày Quốc tế Người cao tuổi", type: "international" },
  { month: 10, day: 10, name: "Ngày Giải phóng Thủ đô", type: "commemorative" },
  { month: 10, day: 13, name: "Ngày Doanh nhân VN", type: "commemorative" },
  { month: 10, day: 20, name: "Ngày Phụ nữ VN", type: "commemorative" },
  { month: 10, day: 31, name: "Halloween", type: "international" },
  { month: 11, day: 9, name: "Ngày Pháp luật VN", type: "commemorative" },
  { month: 11, day: 20, name: "Ngày Nhà giáo VN", type: "commemorative" },
  { month: 11, day: 23, name: "Ngày thành lập MTDTGPMNVN", type: "commemorative" },
  { month: 12, day: 1, name: "Ngày thế giới phòng chống AIDS", type: "international" },
  { month: 12, day: 22, name: "Ngày thành lập QĐNDVN", type: "commemorative" },
  { month: 12, day: 24, name: "Đêm Giáng sinh", type: "international" },
  { month: 12, day: 25, name: "Giáng sinh", type: "international", description: "Christmas" },
];

// ==========================================
// Ngày lễ Âm lịch (Lunar Holidays)
// ==========================================
export const lunarHolidays: Holiday[] = [
  // Tết Nguyên Đán và các ngày quan trọng tháng Giêng
  { month: 1, day: 1, name: "Tết Nguyên Đán", type: "public", duration: 5, description: "Mùng 1 Tết" },
  { month: 1, day: 2, name: "Mùng 2 Tết", type: "public", description: "Thăm họ hàng" },
  { month: 1, day: 3, name: "Mùng 3 Tết", type: "public", description: "Thăm thầy cô" },
  { month: 1, day: 4, name: "Mùng 4 Tết", type: "traditional", description: "Cúng Thần Tài" },
  { month: 1, day: 5, name: "Mùng 5 Tết", type: "traditional", description: "Ngày khai hạ" },
  { month: 1, day: 7, name: "Khai hạ", type: "traditional", description: "Hạ nêu" },
  { month: 1, day: 9, name: "Vía Ngọc Hoàng", type: "religious" },
  { month: 1, day: 10, name: "Vía Thần Tài", type: "traditional" },
  { month: 1, day: 15, name: "Rằm tháng Giêng", type: "traditional", description: "Tết Nguyên Tiêu" },

  // Tháng 2 Âm lịch
  { month: 2, day: 2, name: "Vía Thổ Địa", type: "religious" },
  { month: 2, day: 15, name: "Rằm tháng Hai", type: "traditional" },

  // Tháng 3 Âm lịch - Tết Thanh Minh
  { month: 3, day: 3, name: "Tết Hàn Thực", type: "traditional", description: "Bánh trôi bánh chay" },
  { month: 3, day: 10, name: "Giỗ Tổ Hùng Vương", type: "public", description: "10/3 Âm lịch" },
  { month: 3, day: 15, name: "Rằm tháng Ba", type: "traditional" },

  // Tháng 4 Âm lịch - Phật Đản
  { month: 4, day: 8, name: "Phật Đản", type: "religious", description: "Đức Phật ra đời" },
  { month: 4, day: 15, name: "Rằm tháng Tư", type: "religious", description: "Lễ Phật Đản (Vesak)" },

  // Tháng 5 Âm lịch - Đoan Ngọ
  { month: 5, day: 5, name: "Tết Đoan Ngọ", type: "traditional", description: "Tết diệt sâu bọ" },
  { month: 5, day: 15, name: "Rằm tháng Năm", type: "traditional" },

  // Tháng 6 Âm lịch
  { month: 6, day: 15, name: "Rằm tháng Sáu", type: "traditional" },
  { month: 6, day: 24, name: "Vía Quan Thánh", type: "religious" },

  // Tháng 7 Âm lịch - Vu Lan
  { month: 7, day: 1, name: "Mở cửa Âm phủ", type: "religious", description: "Tháng cô hồn bắt đầu" },
  { month: 7, day: 15, name: "Lễ Vu Lan", type: "traditional", description: "Rằm tháng 7 - Xá tội vong nhân" },
  { month: 7, day: 30, name: "Đóng cửa Âm phủ", type: "religious" },

  // Tháng 8 Âm lịch - Trung Thu
  { month: 8, day: 15, name: "Tết Trung Thu", type: "traditional", description: "Rằm tháng Tám" },

  // Tháng 9 Âm lịch - Trùng Dương
  { month: 9, day: 9, name: "Tết Trùng Dương", type: "traditional", description: "Tết người cao tuổi" },
  { month: 9, day: 15, name: "Rằm tháng Chín", type: "traditional" },

  // Tháng 10 Âm lịch
  { month: 10, day: 1, name: "Tết Hạ Nguyên", type: "traditional" },
  { month: 10, day: 15, name: "Rằm tháng Mười", type: "traditional", description: "Tết Hạ Nguyên" },

  // Tháng 11 Âm lịch
  { month: 11, day: 15, name: "Rằm tháng Một", type: "traditional" },

  // Tháng 12 (Chạp) Âm lịch
  { month: 12, day: 8, name: "Lễ Phật Thích Ca thành đạo", type: "religious" },
  { month: 12, day: 15, name: "Rằm tháng Chạp", type: "traditional" },
  { month: 12, day: 23, name: "Ông Táo chầu trời", type: "traditional", description: "Tiễn Táo Quân" },
  { month: 12, day: 25, name: "Đưa ông Táo", type: "traditional" },
  { month: 12, day: 30, name: "Tất Niên", type: "traditional", description: "Đêm Giao thừa" },
];

// Helper function để tra cứu ngày lễ
export function getSolarHoliday(month: number, day: number): Holiday | undefined {
  return solarHolidays.find(h => h.month === month && h.day === day);
}

export function getLunarHoliday(month: number, day: number): Holiday | undefined {
  return lunarHolidays.find(h => h.month === month && h.day === day);
}

export function getAllHolidaysForSolarDate(month: number, day: number): Holiday[] {
  return solarHolidays.filter(h => h.month === month && h.day === day);
}

export function getAllHolidaysForLunarDate(month: number, day: number): Holiday[] {
  return lunarHolidays.filter(h => h.month === month && h.day === day);
}
