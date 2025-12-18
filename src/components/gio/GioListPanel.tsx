import { useState } from 'react';
import { useEventStore } from '../../store/useEventStore';
import { useCalendarStore } from '../../store/useCalendarStore';
import { getTranslations } from '../../i18n';
import { GioFormModal } from './GioFormModal';
import type { GioEvent } from '../../types/events';

export function GioListPanel() {
  const { getGioEvents, deleteEvent } = useEventStore();
  const { locale } = useCalendarStore();
  const t = getTranslations(locale);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<GioEvent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const gioEvents = getGioEvents();
  const isVi = locale === 'vi';

  const groupedByMonth = gioEvents.reduce((acc, event) => {
    const month = event.lunarDate?.month || 0;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {} as Record<number, GioEvent[]>);

  const sortedMonths = Object.keys(groupedByMonth)
    .map(Number)
    .sort((a, b) => a - b);

  const handleEdit = (event: GioEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    setConfirmDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🕯️</span>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {isVi ? 'Quản lý Ngày Giỗ' : 'Death Anniversary Manager'}
          </h2>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isVi ? 'Thêm ngày giỗ' : 'Add'}
        </button>
      </div>

      {gioEvents.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🕯️</div>
          <p className="text-gray-500 dark:text-gray-400">
            {isVi ? 'Chưa có ngày giỗ nào.' : 'No death anniversaries yet.'}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {isVi ? 'Nhấn "Thêm ngày giỗ" để bắt đầu.' : 'Click "Add" to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMonths.map((month) => (
            <div key={month}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center text-xs">
                  {month}
                </span>
                {t.lunarMonths[month - 1] || `${isVi ? 'Tháng' : 'Month'} ${month}`}
              </h3>
              <div className="space-y-2">
                {groupedByMonth[month]
                  .sort((a, b) => (a.lunarDate?.day || 0) - (b.lunarDate?.day || 0))
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 dark:text-gray-100 truncate">
                            {event.personName}
                          </span>
                          {event.relationship && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-full whitespace-nowrap">
                              {event.relationship}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {isVi ? 'Ngày' : 'Day'} {event.lunarDate?.day} {t.lunarMonths[(event.lunarDate?.month || 1) - 1]}
                          </span>
                          {event.yearOfDeath && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              ({isVi ? 'mất' : 'died'} {event.yearOfDeath})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          title={isVi ? 'Sửa' : 'Edit'}
                        >
                          <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {confirmDelete === event.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              {isVi ? 'Xác nhận' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-2 py-1 text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                            >
                              {isVi ? 'Hủy' : 'Cancel'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(event.id)}
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            title={isVi ? 'Xóa' : 'Delete'}
                          >
                            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <GioFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editEvent={editingEvent}
      />
    </div>
  );
}
