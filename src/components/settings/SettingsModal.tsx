import { useState, useEffect } from 'react';
import { useCalendarStore, type Locale, type Theme } from '../../store/useCalendarStore';
import { useEventStore } from '../../store/useEventStore';
import { getTranslations } from '../../i18n';
import { downloadICS } from '../../lib/ics/icsExporter';
import {
  requestNotificationPermission,
  getNotificationPermission,
  scheduleEventReminders,
} from '../../lib/notifications/notificationService';
import { getLunarService } from '../../services/LunarServiceImpl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: Props) {
  const { locale, setLocale, theme, setTheme } = useCalendarStore();
  const { events } = useEventStore();
  const t = getTranslations(locale);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    setNotificationStatus(getNotificationPermission());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleExportICS = () => {
    const lunarService = getLunarService();
    downloadICS(events, lunarService, 'lich-am-duong.ics');
  };

  const handleNotificationToggle = async () => {
    if (notificationStatus === 'granted') {
      return;
    }

    const permission = await requestNotificationPermission();
    setNotificationStatus(permission);

    if (permission === 'granted') {
      const lunarService = getLunarService();
      scheduleEventReminders(events, lunarService);
    }
  };

  const getNotificationButtonText = () => {
    if (notificationStatus === 'unsupported') {
      return locale === 'vi' ? 'Không hỗ trợ' : 'Not supported';
    }
    if (notificationStatus === 'granted') {
      return locale === 'vi' ? 'Đã bật' : 'Enabled';
    }
    if (notificationStatus === 'denied') {
      return locale === 'vi' ? 'Đã chặn' : 'Blocked';
    }
    return locale === 'vi' ? 'Bật thông báo' : 'Enable notifications';
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden dark:bg-gray-800">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {locale === 'vi' ? 'Cài đặt' : 'Settings'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <svg className="w-5 h-5 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {t.settings.language}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setLocale('vi')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  locale === 'vi'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  locale === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {t.settings.theme}
            </label>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    theme === themeOption
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {themeOption === 'light' && '☀️ '}
                  {themeOption === 'dark' && '🌙 '}
                  {themeOption === 'system' && '💻 '}
                  {t.settings[themeOption]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {locale === 'vi' ? 'Xuất lịch' : 'Export Calendar'}
            </label>
            <button
              onClick={handleExportICS}
              disabled={events.length === 0}
              className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
            >
              📅 {locale === 'vi' ? 'Xuất lịch (.ics)' : 'Export Calendar (.ics)'}
              {events.length > 0 && ` (${events.length})`}
            </button>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {locale === 'vi'
                ? 'Nhập vào Google Calendar, Outlook, Apple Calendar...'
                : 'Import to Google Calendar, Outlook, Apple Calendar...'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {locale === 'vi' ? 'Thông báo nhắc nhở' : 'Reminder Notifications'}
            </label>
            <button
              onClick={handleNotificationToggle}
              disabled={notificationStatus === 'unsupported' || notificationStatus === 'denied'}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                notificationStatus === 'granted'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : notificationStatus === 'denied' || notificationStatus === 'unsupported'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              🔔 {getNotificationButtonText()}
            </button>
            {notificationStatus === 'denied' && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                {locale === 'vi'
                  ? 'Vui lòng bật thông báo trong cài đặt trình duyệt'
                  : 'Please enable notifications in browser settings'}
              </p>
            )}
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            {locale === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
