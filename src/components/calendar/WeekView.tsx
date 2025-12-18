import { useMemo } from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday as isTodayFn } from 'date-fns';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useEventStore } from '../../store/useEventStore';
import { getLunarService } from '../../services/LunarServiceImpl';
import { getTranslations } from '../../i18n';
import { isGioEvent } from '../../types/events';

export function WeekView() {
  const { selectedDate, setSelectedDate, locale } = useCalendarStore();
  const getEventsForDate = useEventStore((state) => state.getEventsForDate);
  const t = getTranslations(locale);
  const lunarService = getLunarService();

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const weekdayNames = t.weekdays.short;

  return (
    <div className="p-2 md:p-4">
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {weekDays.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isTodayFn(date);
          const events = getEventsForDate(date);
          const isWeekend = index >= 5;

          const solarDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
          };
          const lunarInfo = lunarService.getLunarDate(solarDate);
          const canChi = lunarInfo.canChi;

          return (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`
                flex flex-col p-2 md:p-3 rounded-lg border transition-all min-h-[120px] md:min-h-[160px]
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
                ${isToday ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''}
                bg-white dark:bg-gray-800
              `}
            >
              <div className="text-center mb-2">
                <div className={`text-xs font-medium mb-1 ${isWeekend ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {weekdayNames[index]}
                </div>
                <div className={`text-lg md:text-xl font-bold ${isToday ? 'text-blue-600 dark:text-blue-400' : isWeekend ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {date.getDate()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {lunarInfo.day === 1
                    ? `${lunarInfo.day}/${lunarInfo.month}${lunarInfo.isLeapMonth ? '*' : ''}`
                    : lunarInfo.day
                  }
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                  {canChi.ngay.can} {canChi.ngay.chi}
                </div>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`
                      text-[10px] md:text-xs px-1.5 py-0.5 rounded truncate
                      ${isGioEvent(event)
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                      }
                    `}
                    title={event.title}
                  >
                    {isGioEvent(event) && <span className="mr-1">🙏</span>}
                    {event.title}
                  </div>
                ))}
                {events.length > 3 && (
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                    +{events.length - 3}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
