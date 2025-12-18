import { useState, useMemo } from 'react';
import { getYearOverview } from '../../services/yearOverviewService';
import { useEventStore } from '../../store/useEventStore';
import { useCalendarStore } from '../../store/useCalendarStore';
import type { YearFestivalItem } from '../../types/yearOverview';

type ViewMode = 'timeline' | 'grid';

const TYPE_COLORS: Record<YearFestivalItem['type'], { bg: string; text: string; dot: string }> = {
  public: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
  traditional: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
  religious: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
  commemorative: { bg: 'bg-gray-100 dark:bg-gray-700/50', text: 'text-gray-700 dark:text-gray-300', dot: 'bg-gray-500' },
  personal: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  gio: { bg: 'bg-slate-100 dark:bg-slate-700/50', text: 'text-slate-700 dark:text-slate-300', dot: 'bg-slate-500' },
};

const TYPE_LABELS: Record<YearFestivalItem['type'], string> = {
  public: 'Nghỉ lễ',
  traditional: 'Truyền thống',
  religious: 'Tôn giáo',
  commemorative: 'Kỷ niệm',
  personal: 'Cá nhân',
  gio: 'Giỗ',
};

const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  );
}

export function YearOverviewPage() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const events = useEventStore((s) => s.events);
  const setSelectedDate = useCalendarStore((s) => s.setSelectedDate);

  const overview = useMemo(() => getYearOverview(year, events), [year, events]);

  const itemsByMonth = useMemo(() => {
    const grouped: Record<number, YearFestivalItem[]> = {};
    for (let m = 1; m <= 12; m++) grouped[m] = [];
    for (const item of overview.items) {
      const m = item.solarDate.month;
      if (m >= 1 && m <= 12) grouped[m].push(item);
    }
    return grouped;
  }, [overview]);

  const handleItemClick = (item: YearFestivalItem) => {
    setSelectedDate(item.date);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setYear((y) => y - 1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold min-w-[80px] text-center">{year}</span>
            <button
              onClick={() => setYear((y) => y + 1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1.5 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${TYPE_COLORS[type as YearFestivalItem['type']].dot}`} />
              <span className="text-gray-600 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {viewMode === 'timeline' ? (
        <TimelineView items={overview.items} onItemClick={handleItemClick} />
      ) : (
        <GridView itemsByMonth={itemsByMonth} year={year} onItemClick={handleItemClick} />
      )}
    </div>
  );
}

function TimelineView({
  items,
  onItemClick,
}: {
  items: YearFestivalItem[];
  onItemClick: (item: YearFestivalItem) => void;
}) {
  const groupedByMonth: Record<number, YearFestivalItem[]> = {};
  for (const item of items) {
    const m = item.solarDate.month;
    if (!groupedByMonth[m]) groupedByMonth[m] = [];
    groupedByMonth[m].push(item);
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedByMonth).map(([month, monthItems]) => (
        <div
          key={month}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden"
        >
          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b dark:border-gray-700">
            <h3 className="font-semibold">{MONTH_NAMES[Number(month) - 1]}</h3>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {monthItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onItemClick(item)}
                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              >
                <div className="flex flex-col items-center min-w-[48px]">
                  <span className="text-2xl font-bold">{item.solarDate.day}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.lunarDate.day}/{item.lunarDate.month}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${TYPE_COLORS[item.type].dot}`} />
                    <span className="font-medium truncate">{item.name}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {item.description}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${TYPE_COLORS[item.type].bg} ${TYPE_COLORS[item.type].text}`}
                >
                  {TYPE_LABELS[item.type]}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function GridView({
  itemsByMonth,
  year,
  onItemClick,
}: {
  itemsByMonth: Record<number, YearFestivalItem[]>;
  year: number;
  onItemClick: (item: YearFestivalItem) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
        <MiniMonthCalendar
          key={month}
          year={year}
          month={month}
          items={itemsByMonth[month]}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
}

function MiniMonthCalendar({
  year,
  month,
  items,
  onItemClick,
}: {
  year: number;
  month: number;
  items: YearFestivalItem[];
  onItemClick: (item: YearFestivalItem) => void;
}) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDayOfWeek = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const itemsByDay: Record<number, YearFestivalItem[]> = {};
  for (const item of items) {
    const d = item.solarDate.day;
    if (!itemsByDay[d]) itemsByDay[d] = [];
    itemsByDay[d].push(item);
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 border-b dark:border-gray-700">
        <h4 className="font-semibold text-sm">{MONTH_NAMES[month - 1]}</h4>
      </div>
      <div className="p-2">
        <div className="grid grid-cols-7 gap-0.5 text-center text-xs mb-1">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
            <span key={d} className="text-gray-400 dark:text-gray-500 py-1">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={idx} className="aspect-square" />;
            }
            const dayItems = itemsByDay[day] || [];
            const hasItems = dayItems.length > 0;
            const primaryType = dayItems[0]?.type;

            return (
              <button
                key={idx}
                onClick={() => dayItems.length > 0 && onItemClick(dayItems[0])}
                disabled={!hasItems}
                className={`aspect-square flex flex-col items-center justify-center text-xs rounded relative ${
                  hasItems
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                    : 'cursor-default'
                }`}
                title={dayItems.map((i) => i.name).join(', ')}
              >
                <span>{day}</span>
                {hasItems && (
                  <span
                    className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${
                      TYPE_COLORS[primaryType!].dot
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      {items.length > 0 && (
        <div className="border-t dark:border-gray-700 px-2 py-1.5 max-h-24 overflow-y-auto">
          {items.slice(0, 5).map((item, idx) => (
            <button
              key={idx}
              onClick={() => onItemClick(item)}
              className="w-full text-left text-xs py-0.5 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded px-1"
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${TYPE_COLORS[item.type].dot}`} />
              <span className="truncate">
                {item.solarDate.day}: {item.name}
              </span>
            </button>
          ))}
          {items.length > 5 && (
            <span className="text-xs text-gray-400 px-1">+{items.length - 5} khác</span>
          )}
        </div>
      )}
    </div>
  );
}
