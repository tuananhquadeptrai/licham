import { useState, useEffect } from 'react';
import { useEventStore } from '../../store/useEventStore';
import { useCalendarStore } from '../../store/useCalendarStore';
import { getTranslations } from '../../i18n';
import type { GioEvent, ReminderOffset } from '../../types/events';

interface GioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editEvent?: GioEvent | null;
}

const RELATIONSHIPS = [
  'Ông nội',
  'Bà nội',
  'Ông ngoại',
  'Bà ngoại',
  'Cha',
  'Mẹ',
  'Anh',
  'Chị',
  'Em',
  'Chú',
  'Bác',
  'Cô',
  'Dì',
  'Cậu',
  'Mợ',
  'Ông cố',
  'Bà cố',
  'Khác',
];

const REMINDER_OPTIONS: { value: ReminderOffset; label: string; labelEn: string }[] = [
  { value: 'none', label: 'Không nhắc', labelEn: 'No reminder' },
  { value: '1d', label: 'Trước 1 ngày', labelEn: '1 day before' },
  { value: '3d', label: 'Trước 3 ngày', labelEn: '3 days before' },
];

export function GioFormModal({ isOpen, onClose, editEvent }: GioFormModalProps) {
  const { addEvent, updateEvent } = useEventStore();
  const { locale } = useCalendarStore();
  const t = getTranslations(locale);

  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [yearOfDeath, setYearOfDeath] = useState<string>('');
  const [lunarMonth, setLunarMonth] = useState(1);
  const [lunarDay, setLunarDay] = useState(1);
  const [reminder, setReminder] = useState<ReminderOffset>('1d');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editEvent) {
      setPersonName(editEvent.personName);
      setRelationship(editEvent.relationship || '');
      setYearOfDeath(editEvent.yearOfDeath?.toString() || '');
      setLunarMonth(editEvent.lunarDate?.month || 1);
      setLunarDay(editEvent.lunarDate?.day || 1);
      setReminder(editEvent.reminder);
      setNotes(editEvent.notes || '');
    } else {
      resetForm();
    }
  }, [editEvent, isOpen]);

  const resetForm = () => {
    setPersonName('');
    setRelationship('');
    setYearOfDeath('');
    setLunarMonth(1);
    setLunarDay(1);
    setReminder('1d');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!personName.trim()) return;

    const title = `Giỗ ${personName.trim()}`;
    const now = new Date().toISOString();

    const eventData: GioEvent = {
      id: editEvent?.id || `gio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      personName: personName.trim(),
      relationship: relationship || undefined,
      yearOfDeath: yearOfDeath ? parseInt(yearOfDeath, 10) : undefined,
      notes: notes.trim() || undefined,
      dateType: 'lunar',
      lunarDate: {
        year: new Date().getFullYear(),
        month: lunarMonth,
        day: lunarDay,
      },
      allDay: true,
      recurrence: { frequency: 'yearly' },
      reminder,
      kind: 'gio',
      createdAt: editEvent?.createdAt || now,
      updatedAt: now,
    };

    if (editEvent) {
      updateEvent(editEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    onClose();
    resetForm();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isVi = locale === 'vi';

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto dark:bg-gray-800">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {editEvent
              ? (isVi ? 'Sửa ngày giỗ' : 'Edit Death Anniversary')
              : (isVi ? 'Thêm ngày giỗ' : 'Add Death Anniversary')}
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

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              {isVi ? 'Tên người mất' : 'Name of Deceased'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder={isVi ? 'Ví dụ: Nguyễn Văn A' : 'e.g. Nguyen Van A'}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              {isVi ? 'Tiêu đề' : 'Title'}
            </label>
            <input
              type="text"
              value={personName ? `Giỗ ${personName}` : ''}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              {isVi ? 'Mối quan hệ' : 'Relationship'}
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="">{isVi ? '-- Chọn --' : '-- Select --'}</option>
              {RELATIONSHIPS.map((rel) => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              {isVi ? 'Năm mất (dương lịch)' : 'Year of Death (solar)'}
            </label>
            <input
              type="number"
              value={yearOfDeath}
              onChange={(e) => setYearOfDeath(e.target.value)}
              placeholder={isVi ? 'Ví dụ: 1990' : 'e.g. 1990'}
              min="1800"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                {isVi ? 'Tháng âm' : 'Lunar Month'}
              </label>
              <select
                value={lunarMonth}
                onChange={(e) => setLunarMonth(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {t.lunarMonths[m - 1] || `${isVi ? 'Tháng' : 'Month'} ${m}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                {isVi ? 'Ngày âm' : 'Lunar Day'}
              </label>
              <select
                value={lunarDay}
                onChange={(e) => setLunarDay(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              {isVi ? 'Nhắc nhở' : 'Reminder'}
            </label>
            <select
              value={reminder}
              onChange={(e) => setReminder(e.target.value as ReminderOffset)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              {REMINDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {isVi ? opt.label : opt.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              {isVi ? 'Ghi chú' : 'Notes'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={isVi ? 'Ghi chú thêm...' : 'Additional notes...'}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {isVi ? 'Hủy' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {isVi ? 'Lưu' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
