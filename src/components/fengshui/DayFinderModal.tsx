/**
 * Modal tìm ngày tốt theo mục đích
 * Cho phép chọn loại hoạt động và tìm ngày phù hợp
 */

import { useState, useCallback, useEffect } from 'react';
import { findGoodDays, type DayEvaluationResult } from '../../services/dayEvaluator';
import { ACTIVITY_LABELS, type ActivityType } from '../../types/auspicious';
import type { SolarDate } from '../../lib/amlich/types';
import { getLunarService } from '../../services/LunarServiceImpl';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useProfileStore } from '../../store/useProfileStore';
import type { FamilyProfile } from '../../types/profile';

interface DayFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate?: (date: SolarDate) => void;
}

function formatDate(date: SolarDate): string {
  return `${date.day.toString().padStart(2, '0')}/${date.month.toString().padStart(2, '0')}/${date.year}`;
}

function formatInputDate(date: SolarDate): string {
  return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
}

function parseInputDate(value: string): SolarDate {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month, day };
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 70) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-gray-600 dark:text-gray-400';
}

function getScoreBadgeColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (score >= 70) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
}

export function DayFinderModal({ isOpen, onClose, onSelectDate }: DayFinderModalProps) {
  const { locale } = useCalendarStore();
  const { profiles, getSelectedProfile } = useProfileStore();
  const lunarService = getLunarService();

  const today = new Date();
  const defaultFromDate: SolarDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };
  const defaultToDate: SolarDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 2 > 12 ? 1 : today.getMonth() + 2,
    day: today.getDate(),
  };
  if (defaultToDate.month === 1) {
    defaultToDate.year += 1;
  }

  const [activity, setActivity] = useState<ActivityType>('general');
  const [fromDate, setFromDate] = useState<SolarDate>(defaultFromDate);
  const [toDate, setToDate] = useState<SolarDate>(defaultToDate);
  const [birthYear, setBirthYear] = useState<string>('');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [results, setResults] = useState<DayEvaluationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const globalProfile = getSelectedProfile();
    if (globalProfile && !selectedProfileId) {
      setSelectedProfileId(globalProfile.id);
      setBirthYear(globalProfile.birthYear.toString());
    }
  }, [getSelectedProfile, selectedProfileId]);

  const handleProfileChange = (profileId: string) => {
    setSelectedProfileId(profileId);
    if (profileId) {
      const profile = profiles.find(p => p.id === profileId);
      if (profile) {
        setBirthYear(profile.birthYear.toString());
      }
    } else {
      setBirthYear('');
    }
  };

  const handleSearch = useCallback(() => {
    setIsLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      const options = {
        activity,
        fromDate,
        toDate,
        birthYear: birthYear ? parseInt(birthYear, 10) : undefined,
        minScore: 50,
        limit: 30,
      };

      const goodDays = findGoodDays(options);
      setResults(goodDays);
      setIsLoading(false);
    }, 100);
  }, [activity, fromDate, toDate, birthYear]);

  const handleSelectDate = (date: SolarDate) => {
    onSelectDate?.(date);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleReset = () => {
    setActivity('general');
    setFromDate(defaultFromDate);
    setToDate(defaultToDate);
    setBirthYear('');
    setSelectedProfileId('');
    setResults([]);
    setHasSearched(false);
  };

  if (!isOpen) return null;

  const isVi = locale === 'vi';

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {isVi ? '🔍 Tìm ngày tốt theo mục đích' : '🔍 Find Good Days by Purpose'}
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

        {/* Form */}
        <div className="p-4 space-y-4 border-b dark:border-gray-700">
          {/* Profile Select (if profiles exist) */}
          {profiles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                {isVi ? 'Chọn hồ sơ' : 'Select Profile'}
              </label>
              <select
                value={selectedProfileId}
                onChange={(e) => handleProfileChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{isVi ? '-- Nhập năm sinh thủ công --' : '-- Enter birth year manually --'}</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name} ({profile.birthYear})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Activity Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {isVi ? 'Loại hoạt động' : 'Activity Type'}
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityType)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {(Object.keys(ACTIVITY_LABELS) as ActivityType[]).map((key) => (
                <option key={key} value={key}>
                  {isVi ? ACTIVITY_LABELS[key].vi : ACTIVITY_LABELS[key].en}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                {isVi ? 'Từ ngày' : 'From Date'}
              </label>
              <input
                type="date"
                value={formatInputDate(fromDate)}
                onChange={(e) => setFromDate(parseInputDate(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                {isVi ? 'Đến ngày' : 'To Date'}
              </label>
              <input
                type="date"
                value={formatInputDate(toDate)}
                onChange={(e) => setToDate(parseInputDate(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Birth Year (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {isVi ? 'Năm sinh (tùy chọn)' : 'Birth Year (optional)'}
            </label>
            <input
              type="number"
              value={birthYear}
              onChange={(e) => {
                setBirthYear(e.target.value);
                setSelectedProfileId('');
              }}
              placeholder={isVi ? 'VD: 1990' : 'e.g., 1990'}
              min="1900"
              max="2100"
              disabled={!!selectedProfileId}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${selectedProfileId ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {selectedProfileId 
                ? (isVi ? 'Đang sử dụng năm sinh từ hồ sơ đã chọn' : 'Using birth year from selected profile')
                : (isVi ? 'Nhập năm sinh để xét tuổi xung hợp' : 'Enter birth year to check age compatibility')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isVi ? 'Đang tìm...' : 'Searching...'}
                </>
              ) : (
                <>
                  🔍 {isVi ? 'Tìm ngày tốt' : 'Find Good Days'}
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {isVi ? 'Đặt lại' : 'Reset'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="animate-spin h-8 w-8 mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p>{isVi ? 'Đang tìm kiếm...' : 'Searching...'}</p>
            </div>
          ) : hasSearched && results.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                {isVi ? 'Không tìm thấy ngày phù hợp' : 'No suitable days found'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                {isVi
                  ? 'Thử mở rộng khoảng thời gian tìm kiếm hoặc chọn loại hoạt động khác'
                  : 'Try expanding the date range or selecting a different activity type'}
              </p>
            </div>
          ) : results.length > 0 ? (
            /* Results List */
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {isVi
                  ? `Tìm thấy ${results.length} ngày phù hợp cho ${ACTIVITY_LABELS[activity].vi}`
                  : `Found ${results.length} suitable days for ${ACTIVITY_LABELS[activity].en}`}
              </p>
              {results.map((result, index) => {
                const lunar = lunarService.getLunarDate(result.date);
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectDate(result.date)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                            {formatDate(result.date)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getScoreBadgeColor(result.score)}`}>
                            {result.score} {isVi ? 'điểm' : 'pts'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isVi ? 'Âm lịch: ' : 'Lunar: '}
                          {lunar.day}/{lunar.month}
                          {lunar.isLeapMonth && (isVi ? ' (nhuận)' : ' (leap)')}
                          {' - '}
                          {lunar.canChi.ngay.can} {lunar.canChi.ngay.chi}
                        </p>
                        {result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.tags.slice(0, 4).map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded dark:bg-amber-900 dark:text-amber-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score >= 80 ? '⭐' : result.score >= 70 ? '✨' : '👍'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Initial State */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-4">🗓️</div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                {isVi ? 'Tìm ngày tốt cho công việc của bạn' : 'Find good days for your activities'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                {isVi
                  ? 'Chọn loại hoạt động và khoảng thời gian, sau đó nhấn "Tìm ngày tốt"'
                  : 'Select activity type and date range, then click "Find Good Days"'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            {isVi ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
