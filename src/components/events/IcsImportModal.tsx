import { useState, useRef } from 'react';
import { parseICSFile, convertToCalendarEvents, type ParsedEvent } from '../../services/icsImportService';
import { useEventStore } from '../../store/useEventStore';

interface IcsImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IcsImportModal({ isOpen, onClose }: IcsImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedEvents, setParsedEvents] = useState<ParsedEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ added: number; skipped: number } | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const addEventsBulk = useEventStore((s) => s.addEventsBulk);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setParsedEvents([]);
    setSelectedIds(new Set());
    setIsParsing(true);

    try {
      const events = await parseICSFile(file);
      if (events.length === 0) {
        setError('Không tìm thấy sự kiện nào trong file ICS.');
      } else {
        setParsedEvents(events);
        setSelectedIds(new Set(events.map((e) => e.uid)));
      }
    } catch (err) {
      console.error('ICS parse error:', err);
      setError('Không thể đọc file ICS. Vui lòng kiểm tra định dạng file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleToggle = (uid: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) {
        next.delete(uid);
      } else {
        next.add(uid);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(parsedEvents.map((e) => e.uid)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleImport = () => {
    const selectedEvents = parsedEvents.filter((e) => selectedIds.has(e.uid));
    const calendarEvents = convertToCalendarEvents(selectedEvents);
    const result = addEventsBulk(calendarEvents, true);
    setSuccess(result);
    setParsedEvents([]);
    setSelectedIds(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setParsedEvents([]);
    setSelectedIds(new Set());
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getRecurrenceLabel = (recurrence: string) => {
    switch (recurrence) {
      case 'yearly':
        return '🔁 Hàng năm';
      case 'monthly':
        return '🔁 Hàng tháng';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            📥 Nhập file ICS
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chọn file ICS
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".ics"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-rose-100 file:text-rose-700
                hover:file:bg-rose-200
                dark:file:bg-rose-900 dark:file:text-rose-300"
            />
          </div>

          {isParsing && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Đang phân tích file...
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg mb-4">
              ✅ Đã nhập {success.added} sự kiện.
              {success.skipped > 0 && ` (Bỏ qua ${success.skipped} sự kiện trùng lặp)`}
            </div>
          )}

          {parsedEvents.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Đã chọn {selectedIds.size}/{parsedEvents.length} sự kiện
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg dark:border-gray-700">
                {parsedEvents.map((event) => (
                  <label
                    key={event.uid}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(event.uid)}
                      onChange={() => handleToggle(event.uid)}
                      className="mt-1 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-2 flex-wrap">
                        <span>{formatDate(event.startDate)}</span>
                        {event.isAllDay && <span>• Cả ngày</span>}
                        {event.recurrence !== 'none' && (
                          <span>{getRecurrenceLabel(event.recurrence)}</span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Đóng
          </button>
          {parsedEvents.length > 0 && (
            <button
              onClick={handleImport}
              disabled={selectedIds.size === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Nhập {selectedIds.size} sự kiện
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
