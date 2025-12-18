import { useState } from 'react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useBackupImport } from '../../hooks/useBackupImport';
import type { BackupPayload } from '../../types/backup';

interface Props {
  isOpen: boolean;
  payload: BackupPayload | null;
  onClose: () => void;
  onImportComplete: () => void;
}

export function BackupImportModal({
  isOpen,
  payload,
  onClose,
  onImportComplete,
}: Props) {
  const locale = useCalendarStore((s) => s.locale);
  const { hydrateFromBackup } = useBackupImport();
  const [mode, setMode] = useState<'replace' | 'merge'>('merge');
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen || !payload) return null;

  const t = {
    title: locale === 'vi' ? 'Nhập dữ liệu backup' : 'Import Backup Data',
    exportedAt: locale === 'vi' ? 'Ngày xuất:' : 'Exported:',
    eventCount: locale === 'vi' ? 'Số sự kiện:' : 'Events:',
    profileCount: locale === 'vi' ? 'Số hồ sơ:' : 'Profiles:',
    replaceMode: locale === 'vi' ? 'Thay thế dữ liệu' : 'Replace data',
    replaceDesc:
      locale === 'vi'
        ? 'Xóa toàn bộ dữ liệu hiện tại và thay bằng dữ liệu backup'
        : 'Delete all current data and replace with backup',
    mergeMode: locale === 'vi' ? 'Gộp dữ liệu' : 'Merge data',
    mergeDesc:
      locale === 'vi'
        ? 'Giữ dữ liệu hiện tại và thêm các mục mới từ backup (bỏ qua trùng lặp)'
        : 'Keep current data and add new items from backup (skip duplicates)',
    importBtn: locale === 'vi' ? 'Nhập dữ liệu' : 'Import',
    cancelBtn: locale === 'vi' ? 'Hủy' : 'Cancel',
    importing: locale === 'vi' ? 'Đang nhập...' : 'Importing...',
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US');
    } catch {
      return isoString;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      hydrateFromBackup(payload, { merge: mode === 'merge' });
      onImportComplete();
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden dark:bg-gray-800">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {t.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 dark:bg-gray-900">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t.exportedAt}</span>
              <span className="font-medium dark:text-gray-200">
                {formatDate(payload.exportedAt)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t.eventCount}</span>
              <span className="font-medium dark:text-gray-200">
                {payload.events.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t.profileCount}</span>
              <span className="font-medium dark:text-gray-200">
                {payload.profiles.length}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="importMode"
                value="merge"
                checked={mode === 'merge'}
                onChange={() => setMode('merge')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {t.mergeMode}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t.mergeDesc}
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="importMode"
                value="replace"
                checked={mode === 'replace'}
                onChange={() => setMode('replace')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {t.replaceMode}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t.replaceDesc}
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex gap-2 dark:bg-gray-900 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isImporting}
            className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            {t.cancelBtn}
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isImporting ? t.importing : t.importBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
