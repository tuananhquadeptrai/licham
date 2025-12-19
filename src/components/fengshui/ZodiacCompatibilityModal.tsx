/**
 * ZodiacCompatibilityModal - Xem hợp tuổi giữa 2 người
 */

import { useState, useMemo } from 'react';
import { useProfileStore } from '../../store/useProfileStore';
import { getAgeCompatibility, getPersonInfo } from '../../services/ageCompatibility';
import { getProfileWesternZodiac, getZodiacCompatibilityScore } from '../../services/westernZodiac';
import type { FamilyProfile } from '../../types/profile';
import { hasFullBirthday } from '../../types/profile';

interface ZodiacCompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfileId?: string;
}

export function ZodiacCompatibilityModal({ isOpen, onClose, initialProfileId }: ZodiacCompatibilityModalProps) {
  const { profiles } = useProfileStore();
  const [personAId, setPersonAId] = useState<string>(initialProfileId || '');
  const [personBId, setPersonBId] = useState<string>('');
  const [manualYearA, setManualYearA] = useState<string>('');
  const [manualYearB, setManualYearB] = useState<string>('');
  const [useManualA, setUseManualA] = useState(false);
  const [useManualB, setUseManualB] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getYearA = (): number | null => {
    if (useManualA) {
      const year = parseInt(manualYearA, 10);
      return isNaN(year) || year < 1900 || year > 2100 ? null : year;
    }
    const profile = profiles.find(p => p.id === personAId);
    return profile?.birthYear || null;
  };

  const getYearB = (): number | null => {
    if (useManualB) {
      const year = parseInt(manualYearB, 10);
      return isNaN(year) || year < 1900 || year > 2100 ? null : year;
    }
    const profile = profiles.find(p => p.id === personBId);
    return profile?.birthYear || null;
  };

  const getProfileA = (): FamilyProfile | null => {
    if (useManualA) return null;
    return profiles.find(p => p.id === personAId) || null;
  };

  const getProfileB = (): FamilyProfile | null => {
    if (useManualB) return null;
    return profiles.find(p => p.id === personBId) || null;
  };

  const compatibilityResult = useMemo(() => {
    const yearA = getYearA();
    const yearB = getYearB();
    
    if (!yearA || !yearB) return null;
    
    const result = getAgeCompatibility(yearA, yearB);
    const personInfoA = getPersonInfo(yearA);
    const personInfoB = getPersonInfo(yearB);
    
    const profileA = getProfileA();
    const profileB = getProfileB();
    const westernA = profileA ? getProfileWesternZodiac(profileA) : null;
    const westernB = profileB ? getProfileWesternZodiac(profileB) : null;
    
    let westernCompatibility = null;
    if (westernA && westernB) {
      westernCompatibility = getZodiacCompatibilityScore(westernA.sign, westernB.sign);
    }
    
    return {
      vietnamese: result,
      personInfoA,
      personInfoB,
      westernA,
      westernB,
      westernCompatibility,
    };
  }, [personAId, personBId, manualYearA, manualYearB, useManualA, useManualB, profiles]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  };

  const getRelationEmoji = (relation: string) => {
    switch (relation) {
      case 'tam_hop': return '💖';
      case 'luc_hop': return '💕';
      case 'binh_hoa': return '🤝';
      case 'tuong_hai': return '⚠️';
      case 'tuong_hinh': return '⛔';
      case 'tu_hanh_xung': return '💔';
      default: return '❓';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            💑 Xem Hợp Tuổi
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Person A Selection */}
          <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20">
            <label className="block text-sm font-medium text-blue-800 mb-2 dark:text-blue-300">
              Người A
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="useManualA"
                checked={useManualA}
                onChange={(e) => setUseManualA(e.target.checked)}
                className="rounded text-blue-600"
              />
              <label htmlFor="useManualA" className="text-sm text-gray-600 dark:text-gray-400">
                Nhập năm sinh thủ công
              </label>
            </div>
            {useManualA ? (
              <input
                type="number"
                value={manualYearA}
                onChange={(e) => setManualYearA(e.target.value)}
                placeholder="VD: 1990"
                min="1900"
                max="2100"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            ) : (
              <select
                value={personAId}
                onChange={(e) => setPersonAId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="">-- Chọn hồ sơ --</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.birthYear})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Person B Selection */}
          <div className="bg-pink-50 p-4 rounded-lg dark:bg-pink-900/20">
            <label className="block text-sm font-medium text-pink-800 mb-2 dark:text-pink-300">
              Người B
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="useManualB"
                checked={useManualB}
                onChange={(e) => setUseManualB(e.target.checked)}
                className="rounded text-pink-600"
              />
              <label htmlFor="useManualB" className="text-sm text-gray-600 dark:text-gray-400">
                Nhập năm sinh thủ công
              </label>
            </div>
            {useManualB ? (
              <input
                type="number"
                value={manualYearB}
                onChange={(e) => setManualYearB(e.target.value)}
                placeholder="VD: 1992"
                min="1900"
                max="2100"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            ) : (
              <select
                value={personBId}
                onChange={(e) => setPersonBId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="">-- Chọn hồ sơ --</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.birthYear})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Results */}
          {compatibilityResult && (
            <div className="space-y-4">
              {/* Vietnamese Zodiac Result */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-700">
                <h3 className="text-sm font-medium text-amber-800 mb-3 dark:text-amber-300">
                  🐉 Hợp Tuổi (12 Con Giáp)
                </h3>
                
                {/* Person Info Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/70 p-3 rounded-lg dark:bg-gray-800/50">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Người A</div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      Tuổi {compatibilityResult.personInfoA.chiName}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {compatibilityResult.personInfoA.element} • {compatibilityResult.personInfoA.birthYear}
                    </div>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg dark:bg-gray-800/50">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Người B</div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      Tuổi {compatibilityResult.personInfoB.chiName}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {compatibilityResult.personInfoB.element} • {compatibilityResult.personInfoB.birthYear}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-3xl">{getRelationEmoji(compatibilityResult.vietnamese.relation)}</span>
                  <span className={`text-2xl font-bold px-4 py-1 rounded-full ${getScoreColor(compatibilityResult.vietnamese.score)}`}>
                    {compatibilityResult.vietnamese.score > 0 ? '+' : ''}{compatibilityResult.vietnamese.score}
                  </span>
                </div>

                {/* Description */}
                <div className="text-center">
                  <div className="font-medium text-gray-800 dark:text-gray-100">
                    {compatibilityResult.vietnamese.description.vi}
                  </div>
                  {compatibilityResult.vietnamese.advice && (
                    <div className="text-sm text-gray-600 mt-2 dark:text-gray-400">
                      💡 {compatibilityResult.vietnamese.advice.vi}
                    </div>
                  )}
                </div>
              </div>

              {/* Western Zodiac Result */}
              {compatibilityResult.westernA && compatibilityResult.westernB && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200 dark:from-purple-900/20 dark:to-indigo-900/20 dark:border-purple-700">
                  <h3 className="text-sm font-medium text-purple-800 mb-3 dark:text-purple-300">
                    ⭐ Cung Hoàng Đạo Phương Tây
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/70 p-3 rounded-lg text-center dark:bg-gray-800/50">
                      <div className="text-2xl">{compatibilityResult.westernA.info.symbol}</div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {compatibilityResult.westernA.info.nameVi}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {compatibilityResult.westernA.info.element}
                      </div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg text-center dark:bg-gray-800/50">
                      <div className="text-2xl">{compatibilityResult.westernB.info.symbol}</div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {compatibilityResult.westernB.info.nameVi}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {compatibilityResult.westernB.info.element}
                      </div>
                    </div>
                  </div>

                  {compatibilityResult.westernCompatibility && (
                    <div className="text-center">
                      <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getScoreColor(compatibilityResult.westernCompatibility.score)}`}>
                        {compatibilityResult.westernCompatibility.description}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Hint for Western Zodiac */}
              {(!compatibilityResult.westernA || !compatibilityResult.westernB) && !useManualA && !useManualB && (
                <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg dark:bg-gray-700 dark:text-gray-400">
                  💡 Thêm ngày/tháng sinh vào hồ sơ để xem tương hợp cung hoàng đạo
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!compatibilityResult && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-3">💑</div>
              <p>Chọn 2 người để xem độ hợp tuổi</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
