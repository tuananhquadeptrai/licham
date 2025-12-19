import { useState, useRef } from 'react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useEventStore } from '../../store/useEventStore';
import { useProfileStore } from '../../store/useProfileStore';
import {
  createBackupPayload,
  downloadBackupFile,
  readBackupFile,
} from '../../utils/backupUtils';
import { buildBackupShareUrl } from '../../utils/shareLink';
import type { BackupPayload } from '../../types/backup';

interface Props {
  onImportReady: (payload: BackupPayload) => void;
}

export function BackupSyncSection({ onImportReady }: Props) {
  const locale = useCalendarStore((s) => s.locale);
  const events = useEventStore((s) => s.events);
  const profiles = useProfileStore((s) => s.profiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [shareLink, setShareLink] = useState('');
  const [isLongUrl, setIsLongUrl] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const t = {
    title: locale === 'vi' ? 'Sao lưu & Đồng bộ' : 'Backup & Sync',
    exportBtn: locale === 'vi' ? 'Xuất backup (JSON)' : 'Export backup (JSON)',
    importBtn: locale === 'vi' ? 'Nhập backup' : 'Import backup',
    createLink: locale === 'vi' ? 'Tạo link chia sẻ' : 'Create share link',
    copyLink: locale === 'vi' ? 'Sao chép link' : 'Copy link',
    copied: locale === 'vi' ? 'Đã sao chép!' : 'Copied!',
    warning:
      locale === 'vi'
        ? '⚠️ Link chia sẻ chứa toàn bộ dữ liệu của bạn. Chỉ chia sẻ với người tin tưởng.'
        : '⚠️ Share link contains all your data. Only share with trusted people.',
    urlTooLong:
      locale === 'vi'
        ? '⚠️ URL quá dài (>2000 ký tự). Một số trình duyệt có thể không hỗ trợ. Nên dùng file JSON.'
        : '⚠️ URL is too long (>2000 chars). Some browsers may not support it. Use JSON file instead.',
    dataInfo:
      locale === 'vi'
        ? `${events.length} sự kiện, ${profiles.length} hồ sơ`
        : `${events.length} events, ${profiles.length} profiles`,
  };

  const handleExport = () => {
    const payload = createBackupPayload();
    downloadBackupFile(payload);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    try {
      const payload = await readBackupFile(file);
      onImportReady(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    }

    e.target.value = '';
  };

  const handleCreateLink = () => {
    const payload = createBackupPayload();
    const result = buildBackupShareUrl(payload);
    setShareLink(result.url);
    setIsLongUrl(result.isLong);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(locale === 'vi' ? 'Không thể sao chép' : 'Failed to copy');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t.title}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {t.dataInfo}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleExport}
          className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
        >
          💾 {t.exportBtn}
        </button>

        <button
          onClick={handleImportClick}
          className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          📂 {t.importBtn}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="border-t pt-4 dark:border-gray-700">
        <button
          onClick={handleCreateLink}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
        >
          🔗 {t.createLink}
        </button>
      </div>

      {shareLink && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 px-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {copied ? '✓' : '📋'} {copied ? t.copied : t.copyLink}
            </button>
          </div>

          {isLongUrl && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {t.urlTooLong}
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">{t.warning}</p>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
