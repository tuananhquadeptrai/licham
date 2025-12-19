import { useMemo } from 'react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useEventStore } from '../../store/useEventStore';
import { getLunarService } from '../../services/LunarServiceImpl';
import { getTranslations } from '../../i18n';
import { isGioEvent, type CalendarEvent } from '../../types/events';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

interface DayEvents {
  date: Date;
  lunarDay: number;
  lunarMonth: number;
  isLeapMonth: boolean;
  events: CalendarEvent[];
}

export function AgendaView() {
  const { locale } = useCalendarStore();
  const getEventsForDate = useEventStore((state) => state.getEventsForDate);
  const t = getTranslations(locale);
  const lunarService = getLunarService();
  const dateLocale = locale === 'vi' ? vi : enUS;

  const agendaData = useMemo(() => {
    const days: DayEvents[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const events = getEventsForDate(date);
      if (events.length > 0) {
        const solarDate = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        };
        const lunarInfo = lunarService.getLunarDate(solarDate);
        
        days.push({
          date,
          lunarDay: lunarInfo.day,
          lunarMonth: lunarInfo.month,
          isLeapMonth: lunarInfo.isLeapMonth,
          events,
        });
      }
    }

    return days;
  }, [getEventsForDate, lunarService]);

  if (agendaData.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
          {t.agenda.noEvents}
        </h3>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {t.agenda.upcoming}
      </h3>
      
      {agendaData.map(({ date, lunarDay, lunarMonth, isLeapMonth, events }) => (
        <div
          key={date.toISOString()}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {format(date, 'EEEE, d MMMM yyyy', { locale: dateLocale })}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {locale === 'vi' ? 'Âm lịch' : 'Lunar'}: {lunarDay}/{lunarMonth}
                  {isLeapMonth && <span className="text-orange-500"> (nhuận)</span>}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                {date.getDate()}
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {events.map((event) => (
              <div
                key={event.id}
                className="px-4 py-3 flex items-start gap-3"
              >
                <div className={`
                  w-3 h-3 mt-1 rounded-full flex-shrink-0
                  ${isGioEvent(event) ? 'bg-purple-500' : 'bg-green-500'}
                `} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {event.title}
                    </span>
                    {isGioEvent(event) && (
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                        🙏 {locale === 'vi' ? 'Giỗ' : 'Memorial'}
                      </span>
                    )}
                  </div>
                  
                  {!event.allDay && event.startTime && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      🕐 {event.startTime}
                      {event.endTime && ` - ${event.endTime}`}
                    </div>
                  )}
                  
                  {isGioEvent(event) && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {event.personName}
                      {event.relationship && ` (${event.relationship})`}
                    </div>
                  )}
                  
                  {event.notes && (
                    <div className="text-sm text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                      {event.notes}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-1">
                    {event.dateType === 'lunar' && (
                      <span className="text-xs text-orange-600 dark:text-orange-400">
                        📅 {locale === 'vi' ? 'Âm lịch' : 'Lunar'}
                      </span>
                    )}
                    {event.recurrence.frequency !== 'none' && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        🔄 {event.recurrence.frequency === 'yearly' 
                          ? (locale === 'vi' ? 'Hàng năm' : 'Yearly')
                          : (locale === 'vi' ? 'Hàng tháng' : 'Monthly')
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
