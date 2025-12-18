import { useMemo, useEffect, useCallback } from 'react';
import { getLunarService } from '../../services/LunarServiceImpl';
import { getAuspiciousnessForDate } from '../../services/auspiciousDayService';
import { useEventStore } from '../../store/useEventStore';
import { useWeatherStore } from '../../store/useWeatherStore';
import type { SolarDate } from '../../lib/amlich/types';
import type { CalendarEvent } from '../../types/events';
import { isGioEvent } from '../../types/events';

const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const LUNAR_MONTH_NAMES = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Một (11)', 'Chạp'];

function formatSolarDate(date: Date): string {
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${weekday}, ${day}/${month}/${year}`;
}

function formatLunarDate(lunarDay: number, lunarMonth: number, lunarYear: number, isLeapMonth: boolean): string {
  const monthName = LUNAR_MONTH_NAMES[lunarMonth - 1] || lunarMonth.toString();
  const leapStr = isLeapMonth ? ' (nhuận)' : '';
  return `${lunarDay} tháng ${monthName}${leapStr}`;
}

function StarRating({ score }: { score: number }) {
  const stars = Math.round((score / 100) * 5);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-lg ${i <= stars ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

interface TodayWidgetProps {
  className?: string;
}

export function TodayWidget({ className = '' }: TodayWidgetProps) {
  const today = useMemo(() => new Date(), []);
  const getEventsForDate = useEventStore((s) => s.getEventsForDate);
  
  const { weather, isLoading: weatherLoading, error: weatherError, locationEnabled, fetchWeather, setLocationEnabled } = useWeatherStore();

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationEnabled(true);
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setLocationEnabled(false);
      }
    );
  }, [setLocationEnabled, fetchWeather]);

  useEffect(() => {
    if (locationEnabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setLocationEnabled(false);
        }
      );
    }
  }, [locationEnabled, fetchWeather, setLocationEnabled]);

  const data = useMemo(() => {
    const lunarService = getLunarService();
    const solarDate: SolarDate = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };

    const lunarDate = lunarService.getLunarDate(solarDate);
    const moonPhase = lunarService.getMoonPhase(solarDate);
    const holidays = lunarService.getHolidaysForDate(solarDate, lunarDate);
    const auspiciousness = getAuspiciousnessForDate(today, 'general');
    const events = getEventsForDate(today);

    return { lunarDate, moonPhase, holidays, auspiciousness, events };
  }, [today, getEventsForDate]);

  const { lunarDate, moonPhase, holidays, auspiciousness, events } = data;
  const canChi = lunarDate.canChi;

  const gioEvents = events.filter(isGioEvent);
  const regularEvents = events.filter((e: CalendarEvent) => !isGioEvent(e));

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4 ${className}`}>
      {/* Date Header */}
      <div className="mb-4">
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatSolarDate(today)}
        </div>
        <div className="text-sm text-red-600 dark:text-red-400">
          {formatLunarDate(lunarDate.day, lunarDate.month, lunarDate.year, lunarDate.isLeapMonth)} năm {canChi.nam.can} {canChi.nam.chi}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Moon Phase */}
        <div className="space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pha trăng</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{moonPhase.icon}</span>
            <span className="text-gray-700 dark:text-gray-300">{moonPhase.labelVi}</span>
          </div>
        </div>

        {/* Weather */}
        <div className="space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Thời tiết</div>
          {!locationEnabled ? (
            <button
              onClick={requestLocation}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              📍 Cho phép vị trí
            </button>
          ) : weatherLoading ? (
            <div className="text-gray-500 dark:text-gray-400 text-xs">Đang tải...</div>
          ) : weatherError ? (
            <div className="text-red-500 dark:text-red-400 text-xs">Lỗi tải thời tiết</div>
          ) : weather ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{weather.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{weather.temp}°C</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {weather.condition} • Độ ẩm {weather.humidity}%
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Cập nhật {formatTime(weather.updatedAt)}
              </div>
            </div>
          ) : null}
        </div>

        {/* Can Chi */}
        <div className="space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Can Chi</div>
          <div className="text-gray-700 dark:text-gray-300">
            Ngày {canChi.ngay.can} {canChi.ngay.chi}
            {lunarDate.ngayHoangDao && (
              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Hoàng Đạo
              </span>
            )}
          </div>
        </div>

        {/* Good Hours */}
        {lunarDate.gioHoangDao && lunarDate.gioHoangDao.length > 0 && (
          <div className="col-span-2 space-y-1">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Giờ Hoàng Đạo</div>
            <div className="flex flex-wrap gap-1.5">
              {lunarDate.gioHoangDao.map((gio) => (
                <span
                  key={gio}
                  className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs font-medium"
                >
                  {gio}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Auspiciousness */}
        <div className="col-span-2 space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ngày hôm nay</div>
          <div className="flex items-center gap-3">
            <StarRating score={auspiciousness.score} />
            <span className="text-gray-600 dark:text-gray-400 text-xs">
              {auspiciousness.isGoodDay ? 'Ngày tốt' : 'Ngày bình thường'}
            </span>
          </div>
        </div>
      </div>

      {/* Holidays */}
      {holidays.length > 0 && (
        <div className="mt-4 pt-3 border-t dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Ngày lễ</div>
          <div className="space-y-1">
            {holidays.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-red-500">🎉</span>
                <span className="text-gray-700 dark:text-gray-300">{h.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events & Giỗ */}
      {(regularEvents.length > 0 || gioEvents.length > 0) && (
        <div className="mt-4 pt-3 border-t dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Sự kiện hôm nay</div>
          <div className="space-y-1">
            {gioEvents.map((e) => (
              <div key={e.id} className="flex items-center gap-2 text-sm">
                <span className="text-purple-500">🪦</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Giỗ {e.personName}
                  {e.relationship && <span className="text-gray-500"> ({e.relationship})</span>}
                </span>
              </div>
            ))}
            {regularEvents.map((e) => (
              <div key={e.id} className="flex items-center gap-2 text-sm">
                <span className="text-blue-500">📅</span>
                <span className="text-gray-700 dark:text-gray-300">{e.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
