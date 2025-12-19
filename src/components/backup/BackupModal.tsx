import { useState } from 'react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { BackupSyncSection } from './BackupSyncSection';
import { BackupImportModal } from './BackupImportModal';
import type { BackupPayload } from '../../types/backup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BackupModal({ isOpen, onClose }: Props) {
  const locale = useCalendarStore((s) => s.locale);
  const [pendingPayload, setPendingPayload] = useState<BackupPayload | null>(null);

  if (!isOpen) return null;

  const t = {
    title: locale === 'vi' ? 'Sao lưu & Đồng bộ' : 'Backup & Sync',
    close: locale === 'vi' ? 'Đóng' : 'Close',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImportReady = (payload: BackupPayload) => {
    setPendingPayload(payload);
  };

  const handleImportComplete = () => {
    setPendingPayload(null);
    onClose();
  };

  return (
    <>
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

          <div className="p-4">
            <BackupSyncSection onImportReady={handleImportReady} />
          </div>

          <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>

      <BackupImportModal
        isOpen={pendingPayload !== null}
        payload={pendingPayload}
        onClose={() => setPendingPayload(null)}
        onImportComplete={handleImportComplete}
      />
    </>
  );
}
