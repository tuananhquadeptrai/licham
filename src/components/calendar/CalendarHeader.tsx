import { useCalendarStore, type ViewMode } from '../../store/useCalendarStore';
import { getTranslations } from '../../i18n';

export function CalendarHeader() {
  const { 
    currentMonth, 
    currentYear, 
    locale, 
    viewMode,
    goToPrevMonth, 
    goToNextMonth, 
    goToPrevWeek,
    goToNextWeek,
    goToToday,
    setViewMode,
  } = useCalendarStore();
  const t = getTranslations(locale);

  const monthName = t.months[currentMonth];

  const handlePrev = () => {
    if (viewMode === 'week') {
      goToPrevWeek();
    } else {
      goToPrevMonth();
    }
  };

  const handleNext = () => {
    if (viewMode === 'week') {
      goToNextWeek();
    } else {
      goToNextMonth();
    }
  };

  const viewModes: ViewMode[] = ['month', 'week', 'agenda'];

  return (
    <div className="flex flex-col gap-3 p-4 border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {viewMode !== 'agenda' && (
            <>
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors dark:hover:bg-gray-600"
                aria-label={t.navigation.prev}
              >
                <svg className="w-5 h-5 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h2 className="text-lg font-semibold min-w-[180px] text-center dark:text-gray-100">
                {monthName} {currentYear}
              </h2>
              
              <button
                onClick={handleNext}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors dark:hover:bg-gray-600"
                aria-label={t.navigation.next}
              >
                <svg className="w-5 h-5 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          {viewMode === 'agenda' && (
            <h2 className="text-lg font-semibold dark:text-gray-100">
              {t.agenda.upcoming}
            </h2>
          )}
        </div>

        <button
          onClick={goToToday}
          className="btn-secondary text-sm"
        >
          {t.calendar.today}
        </button>
      </div>

      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-1">
          {viewModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${viewMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {t.views[mode]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
