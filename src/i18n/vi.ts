export const vi = {
  calendar: {
    title: 'Lịch Âm',
    today: 'Hôm nay',
    month: 'Tháng',
    year: 'Năm',
  },
  views: {
    month: 'Tháng',
    week: 'Tuần',
    agenda: 'Lịch trình',
  },
  agenda: {
    noEvents: 'Không có sự kiện trong 30 ngày tới',
    upcoming: 'Sự kiện sắp tới',
  },
  weekdays: {
    short: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    long: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'],
  },
  months: [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư',
    'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám',
    'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai',
  ],
  lunarMonths: [
    'Tháng Giêng', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư',
    'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám',
    'Tháng Chín', 'Tháng Mười', 'Tháng Một', 'Tháng Chạp',
  ],
  dayDetail: {
    solarDate: 'Ngày dương',
    lunarDate: 'Ngày âm',
    canChi: 'Can Chi',
    dayCanChi: 'Ngày',
    monthCanChi: 'Tháng',
    yearCanChi: 'Năm',
    hour: 'Giờ',
    goodHours: 'Giờ tốt',
    badHours: 'Giờ xấu',
    holiday: 'Ngày lễ',
    solarTerm: 'Tiết khí',
  },
  navigation: {
    prev: 'Trước',
    next: 'Sau',
    goToToday: 'Về hôm nay',
  },
  settings: {
    language: 'Ngôn ngữ',
    theme: 'Giao diện',
    light: 'Sáng',
    dark: 'Tối',
    system: 'Hệ thống',
  },
};

export type Translations = typeof vi;
