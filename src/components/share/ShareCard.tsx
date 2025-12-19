/**
 * ShareCard - Beautiful shareable card for a given date
 * Designed for social sharing at 600x800px
 */

import { useMemo } from 'react';
import type { SolarDate } from '../../lib/amlich/types';
import { getLunarService } from '../../services/LunarServiceImpl';
import { fengShuiService } from '../../services/FengShuiService';
import { getAuspiciousnessForDate } from '../../services/auspiciousDayService';

const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const LUNAR_MONTH_NAMES = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Một', 'Chạp'];

interface ShareCardProps {
  date: Date;
}

function StarRating({ score }: { score: number }) {
  const stars = Math.round((score / 100) * 5);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-2xl ${i <= stars ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function ShareCard({ date }: ShareCardProps) {
  const lunarService = getLunarService();
  
  const data = useMemo(() => {
    const solarDate: SolarDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    
    const lunarDate = lunarService.getLunarDate(solarDate);
    const fengShui = fengShuiService.getFengShuiForDate(solarDate);
    const auspiciousness = getAuspiciousnessForDate(date, 'general');
    
    return { solarDate, lunarDate, fengShui, auspiciousness };
  }, [date, lunarService]);
  
  const { solarDate, lunarDate, fengShui, auspiciousness } = data;
  const canChi = lunarDate.canChi;
  
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const lunarMonthName = LUNAR_MONTH_NAMES[lunarDate.month - 1] || lunarDate.month.toString();
  
  const mainTags = fengShui.tags.slice(0, 4);
  
  return (
    <div 
      className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6 flex flex-col"
      style={{ width: 600, height: 800 }}
    >
      {/* Header with branding */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium">
          <span>🗓️</span>
          <span>Lịch Âm Dương</span>
        </div>
      </div>
      
      {/* Main content card */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col">
        {/* Solar date - large display */}
        <div className="text-center mb-6">
          <div className="text-8xl font-bold text-red-600 leading-none mb-2">
            {solarDate.day}
          </div>
          <div className="text-2xl font-medium text-gray-700">
            {weekday}
          </div>
          <div className="text-lg text-gray-500">
            Tháng {solarDate.month} / {solarDate.year}
          </div>
        </div>
        
        {/* Lunar date */}
        <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-xl p-4 text-center mb-6">
          <div className="text-sm text-red-600 uppercase tracking-wide mb-1">Âm Lịch</div>
          <div className="text-xl font-semibold text-gray-800">
            Ngày {lunarDate.day} tháng {lunarMonthName}
            {lunarDate.isLeapMonth && <span className="text-red-500"> (nhuận)</span>}
          </div>
          <div className="text-lg text-gray-700">
            Năm {canChi.nam.can} {canChi.nam.chi}
          </div>
        </div>
        
        {/* Can Chi of day */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Ngày</div>
              <div className="text-2xl font-bold text-gray-800">
                {canChi.ngay.can} {canChi.ngay.chi}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Đánh giá</div>
              <StarRating score={auspiciousness.score} />
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {lunarDate.ngayHoangDao && (
            <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              ⭐ Hoàng Đạo
            </span>
          )}
          {mainTags.map((tag, i) => (
            <span 
              key={i}
              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Giờ Hoàng Đạo */}
        {fengShui.gioHoangDao.length > 0 && (
          <div className="bg-green-50 rounded-xl p-4 mb-4">
            <div className="text-sm text-green-700 uppercase tracking-wide mb-2 text-center">
              Giờ Hoàng Đạo
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {fengShui.gioHoangDao.map((gio, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-sm font-medium"
                >
                  {gio}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Day quality indicator */}
        <div className="mt-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            auspiciousness.score >= 70 
              ? 'bg-green-100 text-green-800' 
              : auspiciousness.score >= 50 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
          }`}>
            <span>
              {auspiciousness.score >= 70 ? '✓' : auspiciousness.score >= 50 ? '○' : '–'}
            </span>
            <span>
              {auspiciousness.score >= 70 
                ? 'Ngày Tốt' 
                : auspiciousness.score >= 50 
                  ? 'Ngày Bình Thường'
                  : 'Cần Thận Trọng'}
            </span>
            <span className="font-bold">{auspiciousness.score} điểm</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center mt-4 text-gray-500 text-sm">
        Chia sẻ từ ứng dụng Lịch Âm Dương
      </div>
    </div>
  );
}
