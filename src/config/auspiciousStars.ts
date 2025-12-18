export type KienTruNature = 'very_good' | 'good' | 'neutral' | 'bad' | 'very_bad';

export interface KienTruDay {
  index: number;
  name: string;
  nature: KienTruNature;
  keywords: { vi: string; en: string };
  goodFor: string[];
  avoidFor: string[];
}

export interface NhiThapBatTu {
  index: number;
  name: string;
  nameHanViet: string;
  animal: string;
  nature: KienTruNature;
  direction: 'Đông' | 'Bắc' | 'Tây' | 'Nam';
}

export const KIEN_TRU_DAYS: KienTruDay[] = [
  {
    index: 0,
    name: 'Kiến',
    nature: 'very_good',
    keywords: { vi: 'Xây dựng, khởi đầu', en: 'Build, begin' },
    goodFor: ['Khởi công', 'Động thổ', 'Khai trương', 'Xuất hành', 'Cầu tài'],
    avoidFor: ['An táng', 'Phá thổ'],
  },
  {
    index: 1,
    name: 'Trừ',
    nature: 'good',
    keywords: { vi: 'Loại bỏ, trừ khử', en: 'Remove, eliminate' },
    goodFor: ['Trị bệnh', 'Tảo mộ', 'Dọn dẹp', 'Giải trừ xui xẻo', 'Cắt may'],
    avoidFor: ['Cưới hỏi', 'Khai trương', 'Ký kết'],
  },
  {
    index: 2,
    name: 'Mãn',
    nature: 'very_good',
    keywords: { vi: 'Đầy đủ, viên mãn', en: 'Full, complete' },
    goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Cầu tài', 'Thu hoạch'],
    avoidFor: ['An táng', 'Động thổ'],
  },
  {
    index: 3,
    name: 'Bình',
    nature: 'neutral',
    keywords: { vi: 'Bình thường, ổn định', en: 'Stable, balanced' },
    goodFor: ['Tu sửa', 'Đường sá', 'Sửa chữa nhà', 'Gieo trồng'],
    avoidFor: ['Cưới hỏi', 'Khai trương', 'Xuất hành xa'],
  },
  {
    index: 4,
    name: 'Định',
    nature: 'neutral',
    keywords: { vi: 'Ổn định, yên ổn', en: 'Settle, stabilize' },
    goodFor: ['Ký kết', 'Giao dịch', 'Nhập học', 'Cầu y', 'Hội họp'],
    avoidFor: ['Xuất hành', 'Kiện tụng', 'Động thổ'],
  },
  {
    index: 5,
    name: 'Chấp',
    nature: 'neutral',
    keywords: { vi: 'Nắm giữ, bảo vệ', en: 'Hold, protect' },
    goodFor: ['Xây dựng', 'Sửa chữa', 'Bắt tội phạm', 'Đóng cửa'],
    avoidFor: ['Xuất hành', 'Cưới hỏi', 'Khai trương'],
  },
  {
    index: 6,
    name: 'Phá',
    nature: 'very_bad',
    keywords: { vi: 'Phá hoại, hủy diệt', en: 'Destroy, break' },
    goodFor: ['Phá dỡ', 'Trị bệnh', 'Phẫu thuật', 'Bắt trộm'],
    avoidFor: ['Cưới hỏi', 'Khai trương', 'Ký kết', 'Xuất hành', 'Nhập trạch'],
  },
  {
    index: 7,
    name: 'Nguy',
    nature: 'bad',
    keywords: { vi: 'Nguy hiểm, bất an', en: 'Dangerous, unstable' },
    goodFor: ['Cúng tế', 'Cầu phúc', 'An sàng'],
    avoidFor: ['Xuất hành', 'Leo cao', 'Xây dựng', 'Động thổ', 'Mọi việc lớn'],
  },
  {
    index: 8,
    name: 'Thành',
    nature: 'very_good',
    keywords: { vi: 'Thành công, hoàn thành', en: 'Success, accomplish' },
    goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Xuất hành', 'Ký kết', 'Cầu tài'],
    avoidFor: ['Kiện tụng', 'Tranh chấp'],
  },
  {
    index: 9,
    name: 'Thu',
    nature: 'neutral',
    keywords: { vi: 'Thu hoạch, cất giữ', en: 'Harvest, collect' },
    goodFor: ['Thu hoạch', 'Cất giữ', 'Mua sắm', 'Nhập kho', 'Mai táng'],
    avoidFor: ['Khai trương', 'Xuất hành', 'Cưới hỏi'],
  },
  {
    index: 10,
    name: 'Khai',
    nature: 'very_good',
    keywords: { vi: 'Mở ra, khởi đầu', en: 'Open, initiate' },
    goodFor: ['Khai trương', 'Xuất hành', 'Động thổ', 'Cưới hỏi', 'Nhập trạch', 'Cầu tài'],
    avoidFor: ['An táng', 'Phá thổ'],
  },
  {
    index: 11,
    name: 'Bế',
    nature: 'bad',
    keywords: { vi: 'Đóng cửa, bế tắc', en: 'Close, block' },
    goodFor: ['An táng', 'Chôn cất', 'Đóng cửa', 'Tu sửa mồ mả'],
    avoidFor: ['Khai trương', 'Xuất hành', 'Cưới hỏi', 'Động thổ', 'Mọi việc mới'],
  },
];

export const NHI_THAP_BAT_TU: NhiThapBatTu[] = [
  // Đông phương Thanh Long (7 sao)
  { index: 0, name: 'Giác', nameHanViet: '角', animal: 'Giao (Thuồng luồng)', nature: 'very_good', direction: 'Đông' },
  { index: 1, name: 'Cang', nameHanViet: '亢', animal: 'Long (Rồng)', nature: 'bad', direction: 'Đông' },
  { index: 2, name: 'Đê', nameHanViet: '氐', animal: 'Hạc (Chồn)', nature: 'bad', direction: 'Đông' },
  { index: 3, name: 'Phòng', nameHanViet: '房', animal: 'Thố (Thỏ)', nature: 'very_good', direction: 'Đông' },
  { index: 4, name: 'Tâm', nameHanViet: '心', animal: 'Hồ (Cáo)', nature: 'bad', direction: 'Đông' },
  { index: 5, name: 'Vĩ', nameHanViet: '尾', animal: 'Hổ (Cọp)', nature: 'very_good', direction: 'Đông' },
  { index: 6, name: 'Cơ', nameHanViet: '箕', animal: 'Báo (Beo)', nature: 'very_good', direction: 'Đông' },

  // Bắc phương Huyền Vũ (7 sao)
  { index: 7, name: 'Đẩu', nameHanViet: '斗', animal: 'Giải (Cua)', nature: 'very_good', direction: 'Bắc' },
  { index: 8, name: 'Ngưu', nameHanViet: '牛', animal: 'Ngưu (Trâu)', nature: 'bad', direction: 'Bắc' },
  { index: 9, name: 'Nữ', nameHanViet: '女', animal: 'Bức (Dơi)', nature: 'bad', direction: 'Bắc' },
  { index: 10, name: 'Hư', nameHanViet: '虛', animal: 'Thử (Chuột)', nature: 'bad', direction: 'Bắc' },
  { index: 11, name: 'Nguy', nameHanViet: '危', animal: 'Yến (Én)', nature: 'bad', direction: 'Bắc' },
  { index: 12, name: 'Thất', nameHanViet: '室', animal: 'Trư (Heo)', nature: 'very_good', direction: 'Bắc' },
  { index: 13, name: 'Bích', nameHanViet: '壁', animal: 'Du (Nhím)', nature: 'very_good', direction: 'Bắc' },

  // Tây phương Bạch Hổ (7 sao)
  { index: 14, name: 'Khuê', nameHanViet: '奎', animal: 'Lang (Sói)', nature: 'bad', direction: 'Tây' },
  { index: 15, name: 'Lâu', nameHanViet: '婁', animal: 'Cẩu (Chó)', nature: 'good', direction: 'Tây' },
  { index: 16, name: 'Vị', nameHanViet: '胃', animal: 'Trĩ (Gà lôi)', nature: 'very_good', direction: 'Tây' },
  { index: 17, name: 'Mão', nameHanViet: '昴', animal: 'Kê (Gà)', nature: 'bad', direction: 'Tây' },
  { index: 18, name: 'Tất', nameHanViet: '畢', animal: 'Ô (Quạ)', nature: 'very_good', direction: 'Tây' },
  { index: 19, name: 'Chủy', nameHanViet: '觜', animal: 'Hầu (Khỉ)', nature: 'bad', direction: 'Tây' },
  { index: 20, name: 'Sâm', nameHanViet: '參', animal: 'Viên (Vượn)', nature: 'bad', direction: 'Tây' },

  // Nam phương Chu Tước (7 sao)
  { index: 21, name: 'Tỉnh', nameHanViet: '井', animal: 'Ngạn (Chó sói)', nature: 'very_good', direction: 'Nam' },
  { index: 22, name: 'Quỷ', nameHanViet: '鬼', animal: 'Dương (Dê)', nature: 'bad', direction: 'Nam' },
  { index: 23, name: 'Liễu', nameHanViet: '柳', animal: 'Chương (Hoẵng)', nature: 'bad', direction: 'Nam' },
  { index: 24, name: 'Tinh', nameHanViet: '星', animal: 'Mã (Ngựa)', nature: 'bad', direction: 'Nam' },
  { index: 25, name: 'Trương', nameHanViet: '張', animal: 'Lộc (Nai)', nature: 'very_good', direction: 'Nam' },
  { index: 26, name: 'Dực', nameHanViet: '翼', animal: 'Xà (Rắn)', nature: 'bad', direction: 'Nam' },
  { index: 27, name: 'Chẩn', nameHanViet: '軫', animal: 'Dẫn (Giun)', nature: 'very_good', direction: 'Nam' },
];

export function getKienTruByIndex(index: number): KienTruDay {
  const normalizedIndex = ((index % 12) + 12) % 12;
  return KIEN_TRU_DAYS[normalizedIndex];
}

export function getNhiThapBatTuByIndex(index: number): NhiThapBatTu {
  const normalizedIndex = ((index % 28) + 28) % 28;
  return NHI_THAP_BAT_TU[normalizedIndex];
}
