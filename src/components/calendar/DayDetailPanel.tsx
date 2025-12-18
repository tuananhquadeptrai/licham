import { useCalendarStore } from '../../store/useCalendarStore';
import { useEventStore } from '../../store/useEventStore';
import { getTranslations } from '../../i18n';
import { LunarService } from '../../services';
import { formatDate } from '../../lib/date/dateUtils';
import { isGioEvent } from '../../types/events';
import { FengShuiPanel } from '../fengshui/FengShuiPanel';
import type { SolarDate } from '../../lib/amlich/types';

interface DayDetailPanelProps {
  date: Date;
}

export function DayDetailPanel({ date }: DayDetailPanelProps) {
  const { locale } = useCalendarStore();
  const { getEventsForDate } = useEventStore();
  const t = getTranslations(locale);
  
  const lunarInfo = LunarService.getLunarDate(date);
  const holiday = LunarService.getHolidayInfo(date);
  
  const eventsForDate = getEventsForDate(date);
  const gioEventsToday = eventsForDate.filter(isGioEvent);

  const solarDate: SolarDate = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };

  const formatLunarDate = () => {
    const monthName = t.lunarMonths[lunarInfo.month - 1] || `Tháng ${lunarInfo.month}`;
    return `${lunarInfo.day} ${monthName}${lunarInfo.isLeapMonth ? ' (Nhuận)' : ''}, ${lunarInfo.year}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 space-y-4 md:space-y-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="text-center border-b pb-3 md:pb-4 dark:border-gray-700">
        <p className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100">{date.getDate()}</p>
        <p className="text-base md:text-lg text-gray-600 mt-1 dark:text-gray-300">
          {formatDate(date, 'EEEE', locale)}
        </p>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {formatDate(date, 'MMMM yyyy', locale)}
        </p>
      </div>

      <div className="space-y-3 md:space-y-4">
        <DetailRow label={t.dayDetail.lunarDate} value={formatLunarDate()} highlight />
        
        {/* New Feng Shui Panel replacing old Can Chi, Solar Term, and Good Hours sections */}
        <div className="border-t border-b py-2 dark:border-gray-700">
          <FengShuiPanel 
            solarDate={solarDate} 
            className="!p-0 !shadow-none !bg-transparent" 
          />
        </div>

        {holiday && (
          <div className="bg-red-50 rounded-lg p-2 md:p-3 dark:bg-red-900/30">
            <p className="text-xs md:text-sm font-medium text-red-800 dark:text-red-300">{t.dayDetail.holiday}</p>
            <p className="text-red-700 text-sm md:text-base dark:text-red-400">{holiday.name}</p>
          </div>
        )}

        {gioEventsToday.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-2 md:p-3 dark:bg-purple-900/30">
            <p className="text-xs md:text-sm font-medium text-purple-800 dark:text-purple-300 flex items-center gap-1">
              <span>🕯️</span>
              {locale === 'vi' ? 'Giỗ hôm nay' : 'Death Anniversary Today'}
            </p>
            <div className="mt-2 space-y-1">
              {gioEventsToday.map((event) => (
                <div key={event.id} className="flex items-center gap-2">
                  <span className="font-medium text-purple-700 dark:text-purple-400 text-sm md:text-base">
                    {event.personName}
                  </span>
                  {event.relationship && (
                    <span className="text-xs text-purple-600 dark:text-purple-500">
                      ({event.relationship})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`${highlight ? 'bg-blue-50 p-2 md:p-3 rounded-lg dark:bg-blue-900/30' : ''}`}>
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`font-medium text-sm md:text-base ${highlight ? 'text-blue-800 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>{value}</p>
    </div>
  );
}
