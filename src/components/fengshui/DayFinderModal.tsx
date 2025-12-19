/**
 * Modal tìm ngày tốt theo mục đích
 * Cho phép chọn loại hoạt động và tìm ngày phù hợp
 * YÊU CẦU: Chọn 2 người có đầy đủ ngày tháng năm sinh
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { findGoodDays, type DayEvaluationResult } from '../../services/dayEvaluator';
import { ACTIVITY_LABELS, type ActivityType } from '../../types/auspicious';
import type { SolarDate } from '../../lib/amlich/types';
import { getLunarService } from '../../services/LunarServiceImpl';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useProfileStore } from '../../store/useProfileStore';
import type { FamilyProfile, OwnerParticipant } from '../../types/profile';
import { hasFullBirthday, profileToOwner } from '../../types/profile';

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

function formatProfileBirthday(profile: FamilyProfile): string {
  if (hasFullBirthday(profile)) {
    return `${profile.birthDay}/${profile.birthMonth}/${profile.birthYear}`;
  }
  return `${profile.birthYear} (thiếu ngày/tháng)`;
}

const ACTIVITIES_REQUIRING_TWO_OWNERS: ActivityType[] = [
  'wedding',
  'construction', 
  'move_house',
  'start_business',
  'sign_contract',
];

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
  const [owner1Id, setOwner1Id] = useState<string>('');
  const [owner2Id, setOwner2Id] = useState<string>('');
  const [results, setResults] = useState<DayEvaluationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const requiresTwoOwners = ACTIVITIES_REQUIRING_TWO_OWNERS.includes(activity);

  const validProfiles = useMemo(() => {
    return profiles.filter(p => hasFullBirthday(p));
  }, [profiles]);

  const incompleteProfiles = useMemo(() => {
    return profiles.filter(p => !hasFullBirthday(p));
  }, [profiles]);

  const owner1 = useMemo(() => {
    return profiles.find(p => p.id === owner1Id) || null;
  }, [profiles, owner1Id]);

  const owner2 = useMemo(() => {
    return profiles.find(p => p.id === owner2Id) || null;
  }, [profiles, owner2Id]);

  const ownersValid = useMemo(() => {
    if (!requiresTwoOwners) return true;
    if (!owner1 || !owner2) return false;
    if (owner1.id === owner2.id) return false;
    return hasFullBirthday(owner1) && hasFullBirthday(owner2);
  }, [requiresTwoOwners, owner1, owner2]);

  useEffect(() => {
    const globalProfile = getSelectedProfile();
    if (globalProfile && !owner1Id && hasFullBirthday(globalProfile)) {
      setOwner1Id(globalProfile.id);
    }
  }, [getSelectedProfile, owner1Id]);

  const handleSearch = useCallback(() => {
    if (requiresTwoOwners && !ownersValid) return;
    
    setIsLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      let owners: OwnerParticipant[] | undefined;
      
      if (requiresTwoOwners && owner1 && owner2) {
        const o1 = profileToOwner(owner1);
        const o2 = profileToOwner(owner2);
        if (o1 && o2) {
          owners = [o1, o2];
        }
      }

      const options = {
        activity,
        fromDate,
        toDate,
        owners,
        minScore: 50,
        limit: 30,
      };

      const goodDays = findGoodDays(options);
      setResults(goodDays);
      setIsLoading(false);
    }, 100);
  }, [activity, fromDate, toDate, requiresTwoOwners, ownersValid, owner1, owner2]);

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
    setOwner1Id('');
    setOwner2Id('');
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
        <div className="p-4 space-y-4 border-b dark:border-gray-700 overflow-y-auto">
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

          {/* Owner Selection - Show when activity requires 2 owners */}
          {requiresTwoOwners && (
            <div className="space-y-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <span className="text-lg">👥</span>
                <span className="font-medium text-sm">
                  {isVi ? 'Chọn 2 người (chủ) có đầy đủ ngày sinh' : 'Select 2 people with full birthdays'}
                </span>
              </div>
              
              {validProfiles.length < 2 && (
                <div className="text-sm text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 p-2 rounded">
                  {isVi 
                    ? `⚠️ Cần ít nhất 2 hồ sơ có đầy đủ ngày/tháng/năm sinh. Hiện có ${validProfiles.length} hồ sơ hợp lệ.`
                    : `⚠️ Need at least 2 profiles with full birthdays. Currently have ${validProfiles.length} valid.`}
                </div>
              )}

              {/* Owner 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  {isVi ? 'Chủ 1 (Người thứ nhất)' : 'Owner 1 (First person)'}
                </label>
                <select
                  value={owner1Id}
                  onChange={(e) => setOwner1Id(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{isVi ? '-- Chọn người --' : '-- Select person --'}</option>
                  {validProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id} disabled={profile.id === owner2Id}>
                      {profile.name} ({formatProfileBirthday(profile)})
                    </option>
                  ))}
                  {incompleteProfiles.length > 0 && (
                    <optgroup label={isVi ? 'Thiếu ngày sinh' : 'Missing birthday'}>
                      {incompleteProfiles.map((profile) => (
                        <option key={profile.id} value={profile.id} disabled>
                          {profile.name} ({profile.birthYear}) - {isVi ? 'thiếu ngày/tháng' : 'missing day/month'}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Owner 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  {isVi ? 'Chủ 2 (Người thứ hai)' : 'Owner 2 (Second person)'}
                </label>
                <select
                  value={owner2Id}
                  onChange={(e) => setOwner2Id(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{isVi ? '-- Chọn người --' : '-- Select person --'}</option>
                  {validProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id} disabled={profile.id === owner1Id}>
                      {profile.name} ({formatProfileBirthday(profile)})
                    </option>
                  ))}
                  {incompleteProfiles.length > 0 && (
                    <optgroup label={isVi ? 'Thiếu ngày sinh' : 'Missing birthday'}>
                      {incompleteProfiles.map((profile) => (
                        <option key={profile.id} value={profile.id} disabled>
                          {profile.name} ({profile.birthYear}) - {isVi ? 'thiếu ngày/tháng' : 'missing day/month'}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Validation message */}
              {owner1Id && owner2Id && owner1Id === owner2Id && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {isVi ? '⚠️ Vui lòng chọn 2 người khác nhau' : '⚠️ Please select 2 different people'}
                </p>
              )}
            </div>
          )}

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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={isLoading || (requiresTwoOwners && !ownersValid)}
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
                {requiresTwoOwners && owner1 && owner2 && (
                  <span className="block mt-1 text-blue-600 dark:text-blue-400">
                    👥 {owner1.name} & {owner2.name}
                  </span>
                )}
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
                {requiresTwoOwners 
                  ? (isVi
                    ? 'Chọn 2 người tham gia (có đầy đủ ngày sinh), khoảng thời gian, sau đó nhấn "Tìm ngày tốt"'
                    : 'Select 2 participants (with full birthdays), date range, then click "Find Good Days"')
                  : (isVi
                    ? 'Chọn loại hoạt động và khoảng thời gian, sau đó nhấn "Tìm ngày tốt"'
                    : 'Select activity type and date range, then click "Find Good Days"')}
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
