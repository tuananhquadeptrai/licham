import { useState } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { WeekView } from './WeekView';
import { AgendaView } from './AgendaView';
import { DayDetailPanel } from './DayDetailPanel';
import { DateConversionForm } from './DateConversionForm';
import { GioListPanel } from '../gio';
import { TodayWidget } from '../today';
import { useCalendarStore } from '../../store/useCalendarStore';
import { DayFinderModal } from '../fengshui/DayFinderModal';
import { VanKhanModal } from '../fengshui/VanKhanModal';
import { IcsImportModal } from '../events';
import { LunarService } from '../../services';
import { ProfileSwitcher, ProfileManagerModal } from '../profile';
import { BackupModal } from '../backup';

export function CalendarPage() {
  const { selectedDate, setSelectedDate, viewMode } = useCalendarStore();
  const [isDayFinderOpen, setIsDayFinderOpen] = useState(false);
  const [isVanKhanOpen, setIsVanKhanOpen] = useState(false);
  const [isIcsImportOpen, setIsIcsImportOpen] = useState(false);
  const [isProfileManagerOpen, setIsProfileManagerOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  
  const lunarInfo = LunarService.getLunarDate(selectedDate);

  const renderCalendarView = () => {
    switch (viewMode) {
      case 'week':
        return <WeekView />;
      case 'agenda':
        return <AgendaView />;
      case 'month':
      default:
        return <CalendarGrid />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Feature Toolbar */}
      <div className="flex flex-wrap gap-2 md:gap-3 bg-white p-3 rounded-xl shadow-sm border dark:bg-gray-800 dark:border-gray-700">
        <ProfileSwitcher onOpenManager={() => setIsProfileManagerOpen(true)} />
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-600 self-center" />
        <button 
          onClick={() => setIsDayFinderOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <span>📅</span>
          <span>Xem ngày tốt</span>
        </button>
        <button 
          onClick={() => setIsVanKhanOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <span>🙏</span>
          <span>Văn khấn</span>
        </button>
        <button 
          onClick={() => setIsIcsImportOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <span>📥</span>
          <span>Nhập ICS</span>
        </button>
        <button 
          onClick={() => setIsBackupOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <span>💾</span>
          <span>Backup</span>
        </button>
      </div>

      {/* Today Widget - full width on mobile */}
      <TodayWidget className="lg:hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <CalendarHeader />
            {renderCalendarView()}
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          {/* Today Widget - sidebar on desktop */}
          <TodayWidget className="hidden lg:block" />
          <DayDetailPanel date={selectedDate} />
          <DateConversionForm />
          <GioListPanel />
        </div>
      </div>

      {/* Modals */}
      <DayFinderModal 
        isOpen={isDayFinderOpen} 
        onClose={() => setIsDayFinderOpen(false)} 
        onSelectDate={(solar) => {
           setSelectedDate(new Date(solar.year, solar.month - 1, solar.day));
           setIsDayFinderOpen(false);
        }}
      />
      
      <VanKhanModal 
        isOpen={isVanKhanOpen} 
        onClose={() => setIsVanKhanOpen(false)}
        lunarMonth={lunarInfo.month}
        lunarDay={lunarInfo.day}
      />

      <IcsImportModal
        isOpen={isIcsImportOpen}
        onClose={() => setIsIcsImportOpen(false)}
      />

      <ProfileManagerModal
        isOpen={isProfileManagerOpen}
        onClose={() => setIsProfileManagerOpen(false)}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </div>
  );
}
