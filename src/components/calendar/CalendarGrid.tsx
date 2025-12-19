import { useCalendarStore } from '../../store/useCalendarStore';
import { getCalendarDays, getWeekdayNames } from '../../lib/date/dateUtils';
import { CalendarDayCell } from './CalendarDayCell';

export function CalendarGrid() {
  const { currentMonth, currentYear, locale } = useCalendarStore();
  const days = getCalendarDays(currentYear, currentMonth);
  const weekdays = getWeekdayNames(locale);

  return (
    <div className="p-2 md:p-4">
      <div className="grid grid-cols-7 mb-1 md:mb-2">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs md:text-sm font-medium py-1 md:py-2 ${
              index >= 5 ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden dark:bg-gray-700 dark:border-gray-700">
        {days.map((date) => (
          <CalendarDayCell
            key={date.toISOString()}
            date={date}
            currentMonth={currentMonth}
          />
        ))}
      </div>
    </div>
  );
}
