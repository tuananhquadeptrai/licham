import { isSameDay, isToday, isWeekend } from '../../lib/date/dateUtils';
import { useCalendarStore } from '../../store/useCalendarStore';
import { LunarService } from '../../services';

interface CalendarDayCellProps {
  date: Date;
  currentMonth: number;
}

export function CalendarDayCell({ date, currentMonth }: CalendarDayCellProps) {
  const { selectedDate, setSelectedDate } = useCalendarStore();
  
  const isCurrentMonth = date.getMonth() === currentMonth;
  const isSelected = isSameDay(date, selectedDate);
  const today = isToday(date);
  const weekend = isWeekend(date);

  const lunarInfo = LunarService.getLunarDate(date);
  const holiday = LunarService.getHolidayInfo(date);

  const cellClasses = [
    'calendar-cell bg-white dark:bg-gray-800 min-h-[60px] md:min-h-[80px]',
    !isCurrentMonth && 'calendar-cell-other-month',
    isSelected && 'calendar-cell-selected',
    today && 'calendar-cell-today',
    weekend && isCurrentMonth && 'calendar-cell-weekend',
  ].filter(Boolean).join(' ');

  return (
    <button
      onClick={() => setSelectedDate(date)}
      className={cellClasses}
      aria-label={`${date.getDate()} ${lunarInfo.day}/${lunarInfo.month} âm lịch`}
    >
      <span className={`solar-date text-base md:text-lg ${weekend ? 'text-red-500 dark:text-red-400' : ''} ${today ? 'text-blue-600 dark:text-blue-400' : ''}`}>
        {date.getDate()}
      </span>
      
      <span className="lunar-date text-[10px] md:text-xs">
        {lunarInfo.day === 1 ? `${lunarInfo.day}/${lunarInfo.month}` : lunarInfo.day}
        {lunarInfo.isLeapMonth && '*'}
      </span>
      
      {holiday && (
        <span className="holiday-badge text-[8px] md:text-[10px]" title={holiday.name}>
          {holiday.name}
        </span>
      )}
    </button>
  );
}
