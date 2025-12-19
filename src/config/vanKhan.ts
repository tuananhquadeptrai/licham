export type VanKhanCategory =
  | 'tet'
  | 'ram_mung_mot'
  | 'gio'
  | 'cung_ong_tao'
  | 'khai_truong'
  | 'nhap_trach'
  | 'dong_tho'
  | 'cuoi_hoi'
  | 'thanh_minh'
  | 'vu_lan';

export interface VanKhanItem {
  id: string;
  category: VanKhanCategory;
  title: string;
  occasion: string;
  content: string;
  notes?: string;
  lunarDates?: { month: number; day: number }[];
}

export const vanKhanCollection: VanKhanItem[] = [
  {
    id: 'giao-thua',
    category: 'tet',
    title: 'Văn khấn Giao Thừa',
    occasion: 'Đêm 30 Tết, trước thời khắc chuyển giao năm mới',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.
Con kính lạy các ngài Thần linh, Thổ địa cai quản trong xứ này.
Con kính lạy Tổ tiên nội ngoại họ.........

Hôm nay là ngày 30 tháng Chạp năm.........
Tín chủ (chúng) con là:....................
Ngụ tại:..................................

Nhân tiết Giao thừa năm cũ bước sang năm mới, tín chủ con lòng thành sửa biện hương hoa lễ vật, kim ngân trà quả, đốt nén tâm hương dâng lên trước án.

Cầu xin Tôn thần gia ân tác phúc, phù hộ toàn gia chúng con, già trẻ lớn bé được bình an, tài lộc hanh thông, vạn sự như ý.

Chúng con lễ bạc tâm thành, trước án kính lễ, cúi xin được phù hộ độ trì.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Chuẩn bị lễ ngoài trời hoặc trước cửa nhà. Thắp hương đúng thời khắc Giao thừa.',
    lunarDates: [{ month: 12, day: 30 }]
  },
  {
    id: 'mung-1-tet',
    category: 'tet',
    title: 'Văn khấn Mùng 1 Tết',
    occasion: 'Sáng Mùng 1 Tết Nguyên Đán',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.
Con kính lạy các ngài Thần linh, Thổ địa cai quản trong xứ này.
Con kính lạy Tổ tiên nội ngoại họ.........

Hôm nay là ngày Mùng 1 tháng Giêng năm.........
Tín chủ (chúng) con là:....................
Ngụ tại:..................................

Nhân ngày đầu xuân năm mới, tín chủ con thành tâm sửa biện hương hoa lễ vật, kim ngân trà quả dâng lên trước án.

Cầu xin chư vị Tôn thần, cùng chư vị Hương linh Gia tiên phù hộ độ trì cho toàn gia chúng con năm mới:
- Sức khỏe dồi dào, vạn sự như ý
- Công danh sự nghiệp hanh thông
- Tài lộc đầy nhà, may mắn cả năm
- Gia đình hòa thuận, con cháu thảo hiền

Chúng con lễ bạc tâm thành, cúi xin được chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Dâng lễ vào buổi sáng sớm. Nên mặc quần áo chỉnh tề, trang nghiêm.',
    lunarDates: [{ month: 1, day: 1 }]
  },
  {
    id: 'ram-thang-gieng',
    category: 'tet',
    title: 'Văn khấn Rằm tháng Giêng',
    occasion: 'Rằm tháng Giêng (Tết Nguyên Tiêu)',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.
Con kính lạy Thần linh Thổ địa cai quản xứ này.
Con kính lạy Tổ tiên nội ngoại họ.........

Hôm nay là ngày Rằm tháng Giêng năm.........
Tín chủ (chúng) con là:....................
Ngụ tại:..................................

Nhân tiết Nguyên Tiêu, ngày rằm đầu tiên của năm mới, tín chủ con thành tâm sửa biện hương hoa, trà quả, lễ nghi dâng lên trước án.

Cầu xin Tôn thần, Gia tiên phù hộ độ trì cho gia đình con được:
- Bình an vô sự, tai qua nạn khỏi
- Làm ăn phát đạt, của cải đầy nhà
- Gia đình thuận hòa, sum họp đầm ấm
- Cầu gì được nấy, ước gì được đó

Chúng con lễ bạc tâm thành, cúi xin chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Rằm tháng Giêng là "Tết cả năm không bằng Rằm tháng Giêng". Nên chuẩn bị lễ chu đáo.',
    lunarDates: [{ month: 1, day: 15 }]
  },
  {
    id: 'ram-hang-thang',
    category: 'ram_mung_mot',
    title: 'Văn khấn Rằm hàng tháng',
    occasion: 'Ngày Rằm (15) hàng tháng âm lịch',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.
Con kính lạy các ngài Thần linh bản xứ cai quản trong khu vực này.
Con kính lạy Tổ tiên nội ngoại họ.........

Hôm nay là ngày Rằm tháng......năm.........
Tín chủ (chúng) con là:....................
Ngụ tại:..................................

Nhân ngày Rằm, tín chủ con thành tâm sửa biện hương hoa lễ vật dâng lên trước án, kính mời chư vị Tôn thần, Gia tiên về chứng giám.

Cầu xin phù hộ độ trì cho toàn gia được bình an, khỏe mạnh, công việc hanh thông, vạn sự như ý.

Chúng con lễ bạc tâm thành, cúi xin chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Lễ Rằm thường cúng vào buổi chiều hoặc tối. Có thể cúng chay hoặc mặn tùy gia đình.'
  },
  {
    id: 'mung-mot-hang-thang',
    category: 'ram_mung_mot',
    title: 'Văn khấn Mùng Một hàng tháng',
    occasion: 'Ngày Mùng 1 hàng tháng âm lịch',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.
Con kính lạy Thần linh Thổ địa cai quản xứ này.
Con kính lạy Tổ tiên nội ngoại họ.........

Hôm nay là ngày Mùng 1 tháng......năm.........
Tín chủ (chúng) con là:....................
Ngụ tại:..................................

Nhân ngày đầu tháng, tín chủ con thành tâm sửa biện hương hoa trà quả dâng lên trước án.

Cầu xin chư vị Tôn thần, Gia tiên phù hộ độ trì cho cả gia đình tháng mới được:
- Bình an, mạnh khỏe
- Công việc thuận lợi
- Tài lộc hanh thông

Chúng con lễ bạc tâm thành, cúi xin chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Lễ Mùng Một thường cúng vào buổi sáng. Lễ vật đơn giản: hương, hoa, trái cây.'
  },
  {
    id: 'ong-cong-ong-tao',
    category: 'cung_ong_tao',
    title: 'Văn khấn Ông Công Ông Táo',
    occasion: 'Ngày 23 tháng Chạp - Tiễn Ông Táo về trời',
    content: `Nam mô A Di Đà Phật! (3 lần)

Kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.

Hôm nay là ngày 23 tháng Chạp năm.........
Tín chủ (chúng) con là:....................
Ngụ tại:..................................

Nhân ngày Ông Táo về chầu Ngọc Hoàng Thượng Đế, chúng con thành tâm sửa biện hương hoa, lễ vật, cá chép vàng dâng lên trước án.

Cầu xin Táo Quân về chầu Thiên Đình, tâu việc hay, giấu việc dở, phù hộ cho gia đình con được:
- Một năm mới bình an, hạnh phúc
- Làm ăn thuận lợi, tài lộc dồi dào
- Gia đình hòa thuận, con cháu ngoan hiền
- Tai qua nạn khỏi, vạn sự như ý

Kính mong Táo Quân chứng giám lòng thành, ban phúc lành cho cả gia đình.

Cẩn cáo!

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Chuẩn bị cá chép (sống hoặc giấy), mũ áo Ông Táo. Cúng trước 12h trưa ngày 23 tháng Chạp. Sau khi cúng, phóng sinh cá chép.',
    lunarDates: [{ month: 12, day: 23 }]
  },
  {
    id: 'gio-tien-nhan',
    category: 'gio',
    title: 'Văn khấn Giỗ',
    occasion: 'Ngày giỗ Ông Bà, Cha Mẹ, Người thân',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.
Con kính lạy các ngài Thần linh, Thổ địa cai quản trong xứ này.
Con kính lạy Tổ tiên nội ngoại họ.........

Hôm nay là ngày......tháng......năm.........
Là ngày húy kỵ của...........................

Tín chủ (chúng) con là:....................
Ngụ tại:..................................

Nhân ngày húy kỵ, chúng con nhớ đến công ơn sinh thành dưỡng dục, ơn đức cao dày của......., thành tâm sửa biện hương hoa, lễ vật, trà rượu dâng lên trước án.

Chúng con kính mời hương hồn........ về chứng giám lòng thành của con cháu, thụ hưởng lễ vật.

Cầu xin hương hồn........ phù hộ độ trì cho con cháu được bình an, mạnh khỏe, gia đình hòa thuận, công việc hanh thông.

Chúng con lễ bạc tâm thành, cúi xin chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Điền tên người mất và quan hệ (Ông, Bà, Cha, Mẹ...). Nên có đủ mâm cơm cúng với những món người mất yêu thích.'
  },
  {
    id: 'khai-truong',
    category: 'khai_truong',
    title: 'Văn khấn Khai trương',
    occasion: 'Khai trương cửa hàng, công ty, kinh doanh',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Bản cảnh Thành hoàng, các ngài Thổ địa, Tài thần.
Con kính lạy các ngài Ngũ phương, Ngũ thổ, Long mạch, Tôn thần.
Con kính lạy các vị Thần linh cai quản khu vực này.

Hôm nay là ngày......tháng......năm.........
Tín chủ (chúng) con là:....................
Địa chỉ kinh doanh:..................................

Nhân ngày khai trương (tên cơ sở kinh doanh)......., tín chủ con thành tâm sửa biện hương hoa, lễ vật, trà rượu dâng lên trước án.

Kính cầu chư vị Tôn thần chứng giám lòng thành, phù hộ độ trì cho:
- Việc kinh doanh thuận buồm xuôi gió
- Buôn may bán đắt, khách đến đông đúc
- Tiền tài đầy túi, của cải đầy kho
- Công việc hanh thông, vạn sự như ý
- Tránh được tiểu nhân, gặp nhiều quý nhân

Chúng con lễ bạc tâm thành, cúi xin chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Nên chọn ngày giờ tốt để khai trương. Chuẩn bị heo quay hoặc gà luộc, hoa quả, vàng mã.'
  },
  {
    id: 'nhap-trach',
    category: 'nhap_trach',
    title: 'Văn khấn Nhập trạch',
    occasion: 'Dọn về nhà mới, nhập trạch',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Bản gia Thổ Công, Thổ Địa, Long mạch Tôn thần.
Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.
Con kính lạy các ngài Thần linh cai quản trong khu vực này.
Con kính lạy Tổ tiên nội ngoại họ.........

Hôm nay là ngày......tháng......năm.........
Tín chủ (chúng) con là:....................
Dọn về cư ngụ tại địa chỉ mới:..................................

Nhân ngày lành tháng tốt, chúng con dọn về nhà mới, thành tâm sửa biện hương hoa, lễ vật dâng lên trước án.

Kính cầu chư vị Tôn thần chứng giám, cho phép gia đình chúng con được nhập trạch ngôi nhà này. Xin phù hộ độ trì cho:
- Gia đình an vui, hòa thuận
- Làm ăn phát đạt, của cải đầy nhà
- Người người khỏe mạnh, tai qua nạn khỏi
- Ở yên, ở vững, vạn sự như ý

Chúng con lễ bạc tâm thành, cúi xin chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Cần chọn ngày giờ tốt, hợp tuổi gia chủ. Mang theo bếp (hoặc bật bếp) và nước vào nhà đầu tiên, tượng trưng cho cuộc sống ấm no.'
  },
  {
    id: 'thanh-minh',
    category: 'thanh_minh',
    title: 'Văn khấn Thanh Minh',
    occasion: 'Tiết Thanh Minh - Tảo mộ',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy ngài Địa tạng Vương Bồ Tát, U minh Giáo chủ.
Con kính lạy các ngài Thần linh cai quản nghĩa trang này.
Con kính lạy Tổ tiên nội ngoại họ.........

Hôm nay là ngày......tháng......năm.........
Nhằm tiết Thanh Minh.

Tín chủ (chúng) con là:....................
Ngụ tại:..................................

Nhân tiết Thanh Minh, chúng con đến phần mộ của......., thành tâm sửa biện hương hoa, lễ vật dâng lên trước mộ.

Chúng con kính mời hương hồn........ về đây chứng giám lòng thành, thụ hưởng lễ vật.

Cầu xin hương hồn........ yên nghỉ nơi cực lạc, phù hộ độ trì cho con cháu được bình an, khỏe mạnh, gia đình hòa thuận, làm ăn phát đạt.

Chúng con lễ bạc tâm thành, cúi xin chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Tiết Thanh Minh thường vào đầu tháng 3 âm lịch. Dọn dẹp, sửa sang phần mộ trước khi khấn.'
  },
  {
    id: 'vu-lan',
    category: 'vu_lan',
    title: 'Văn khấn Vu Lan',
    occasion: 'Rằm tháng 7 - Lễ Vu Lan báo hiếu',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Đức Phật Thích Ca Mâu Ni.
Con kính lạy Đức Mục Kiền Liên Bồ Tát.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.
Con kính lạy Tổ tiên nội ngoại họ.........

Hôm nay là ngày Rằm tháng 7 năm.........
Tín chủ (chúng) con là:....................
Ngụ tại:..................................

Nhân ngày Đại lễ Vu Lan Báo hiếu, chúng con thành tâm sửa biện hương hoa, lễ vật, cơm chay dâng lên trước án.

Chúng con kính nhớ công ơn sinh thành dưỡng dục của Ông Bà, Cha Mẹ, Tổ tiên. Ơn đức cao dày như trời biển.

Kính mời hương hồn Ông Bà, Cha Mẹ, Tổ tiên nội ngoại về chứng giám lòng thành hiếu kính của con cháu.

Cầu xin chư vị Gia tiên phù hộ độ trì cho con cháu được:
- Hiếu đạo vẹn toàn, gia đình hạnh phúc
- Bình an mạnh khỏe, vạn sự như ý
- Công danh sự nghiệp hanh thông

Chúng con cũng xin bố thí cho các vong linh cô hồn không nơi nương tựa được hưởng phần lễ vật.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Ngày Vu Lan nên ăn chay, làm việc thiện, phóng sinh. Cúng cả Gia tiên và cô hồn (cô hồn cúng ngoài trời).',
    lunarDates: [{ month: 7, day: 15 }]
  },
  {
    id: 'dong-tho',
    category: 'dong_tho',
    title: 'Văn khấn Động thổ',
    occasion: 'Khởi công xây dựng, động thổ',
    content: `Nam mô A Di Đà Phật! (3 lần)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy Quan Đương niên hành khiển, Bản cảnh Thành hoàng.
Con kính lạy ngài Bản xứ Thổ địa, Long mạch, Tôn thần.
Con kính lạy các ngài Ngũ phương, Ngũ thổ, Tài thần.
Con kính lạy Tổ tiên nội ngoại họ.........

Hôm nay là ngày......tháng......năm.........
Tín chủ (chúng) con là:....................
Tại địa chỉ:..................................

Nhân ngày lành tháng tốt, chúng con khởi công xây dựng (công trình)......., thành tâm sửa biện hương hoa, lễ vật dâng lên trước án.

Kính cầu chư vị Tôn thần chứng giám lòng thành, cho phép gia đình chúng con được động thổ khởi công. Xin phù hộ độ trì cho:
- Công trình thi công thuận lợi, bình an
- Thợ thầy khỏe mạnh, không xảy ra sự cố
- Công việc hoàn thành đúng tiến độ
- Ngôi nhà vững chãi, ở yên ở vững

Chúng con lễ bạc tâm thành, cúi xin chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
    notes: 'Chọn ngày giờ hoàng đạo, hợp tuổi gia chủ. Gia chủ tự tay cuốc nhát đầu tiên sau khi cúng xong.'
  }
];

export function getVanKhanByCategory(category: VanKhanCategory): VanKhanItem[] {
  return vanKhanCollection.filter((item) => item.category === category);
}

export function getVanKhanForDate(lunarMonth: number, lunarDay: number): VanKhanItem[] {
  const results: VanKhanItem[] = [];

  for (const item of vanKhanCollection) {
    if (item.lunarDates) {
      for (const date of item.lunarDates) {
        if (date.month === lunarMonth && date.day === lunarDay) {
          results.push(item);
          break;
        }
      }
    }
  }

  if (lunarDay === 1) {
    const mungMot = vanKhanCollection.find((item) => item.id === 'mung-mot-hang-thang');
    if (mungMot && !results.includes(mungMot)) {
      results.push(mungMot);
    }
  }

  if (lunarDay === 15) {
    const ram = vanKhanCollection.find((item) => item.id === 'ram-hang-thang');
    if (ram && !results.includes(ram)) {
      results.push(ram);
    }
  }

  return results;
}

export function searchVanKhan(keyword: string): VanKhanItem[] {
  const lowerKeyword = keyword.toLowerCase();

  return vanKhanCollection.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.occasion.toLowerCase().includes(lowerKeyword) ||
      item.content.toLowerCase().includes(lowerKeyword) ||
      (item.notes && item.notes.toLowerCase().includes(lowerKeyword))
  );
}
