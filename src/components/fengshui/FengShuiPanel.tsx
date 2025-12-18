import React from 'react';
import { fengShuiService, type FengShuiDayInfo } from '../../services/FengShuiService';
import type { SolarDate } from '../../lib/amlich/types';
import { getNguHanhColor, type NguHanh } from '../../config/canChi';
import { useProfileStore } from '../../store/useProfileStore';
import type { FamilyProfile } from '../../types/profile';

interface FengShuiPanelProps {
  solarDate: SolarDate;
  className?: string;
}

export function FengShuiPanel({ solarDate, className = '' }: FengShuiPanelProps) {
  const fengShui = fengShuiService.getFengShuiForDate(solarDate);
  const { getSelectedProfile } = useProfileStore();
  const selectedProfile = getSelectedProfile();

  const personalCheck = selectedProfile 
    ? fengShuiService.checkDateForPerson(solarDate, selectedProfile.birthYear)
    : null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thông Tin Phong Thủy</h2>
        <ScoreBadge score={fengShui.overallScore} />
      </div>

      {/* Personal Feng Shui Section */}
      {selectedProfile && personalCheck && (
        <PersonalFengShuiSection 
          profile={selectedProfile} 
          check={personalCheck} 
          solarDate={solarDate}
        />
      )}

      {/* Tags */}
      <TagsSection tags={fengShui.tags} />

      {/* Can Chi Info */}
      <CanChiSection info={fengShui} />

      {/* Stars & Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StarsSection info={fengShui} />
        <SolarTermSection info={fengShui} />
      </div>

      {/* Hoang Dao Hours */}
      <HoangDaoHoursSection hours={fengShui.gioHoangDao} />
      
      {/* Recommendations */}
      {fengShui.recommendations.length > 0 && (
         <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
           <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Lời Khuyên</h3>
           <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-200">
             {fengShui.recommendations.map((rec, idx) => (
               <li key={idx}>{rec}</li>
             ))}
           </ul>
         </div>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  if (score >= 80) colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  else if (score >= 50) colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
  else colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>
      {score}/100 điểm
    </div>
  );
}

function TagsSection({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <span 
          key={idx} 
          className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function CanChiSection({ info }: { info: FengShuiDayInfo }) {
  const { canChi } = info;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Ngũ Hành Nạp Âm</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ngày</div>
          <div className="font-bold text-gray-900 dark:text-white">
            {canChi.ngay.can} {canChi.ngay.chi}
          </div>
          <div className={`text-xs ${getNguHanhColor(canChi.ngayElement)}`}>
            {canChi.ngayElement}
          </div>
        </div>
        <div className="text-center border-l border-r border-gray-100 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tháng</div>
          <div className="font-bold text-gray-900 dark:text-white">
            {canChi.thang.can} {canChi.thang.chi}
          </div>
          <div className={`text-xs ${getNguHanhColor(canChi.thangElement)}`}>
            {canChi.thangElement}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Năm</div>
          <div className="font-bold text-gray-900 dark:text-white">
            {canChi.nam.can} {canChi.nam.chi}
          </div>
          <div className={`text-xs ${getNguHanhColor(canChi.namElement)}`}>
            {canChi.namElement}
          </div>
        </div>
      </div>
      
      {/* Xung Hop Info */}
      {(canChi.ngayXungHop.xung.length > 0 || canChi.ngayXungHop.tamHop.length > 0 || canChi.ngayXungHop.lucHop) && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm">
          {canChi.ngayXungHop.tamHop.length > 0 && (
            <div className="flex gap-2 mb-1">
              <span className="text-gray-500 dark:text-gray-400">Tam Hợp:</span>
              <span className="text-green-600 dark:text-green-400">{canChi.ngayXungHop.tamHop.join(', ')}</span>
            </div>
          )}
          {canChi.ngayXungHop.lucHop && (
             <div className="flex gap-2 mb-1">
              <span className="text-gray-500 dark:text-gray-400">Lục Hợp:</span>
              <span className="text-green-600 dark:text-green-400">{canChi.ngayXungHop.lucHop}</span>
            </div>
          )}
          {canChi.ngayXungHop.xung.length > 0 && (
             <div className="flex gap-2">
              <span className="text-gray-500 dark:text-gray-400">Xung:</span>
              <span className="text-red-500 dark:text-red-400">{canChi.ngayXungHop.xung.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StarsSection({ info }: { info: FengShuiDayInfo }) {
  const { stars } = info;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Thập Nhị Kiến Trừ</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold text-gray-900 dark:text-white">{stars.kienTru.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stars.kienTru.keywords.vi}</div>
          </div>
          <StatusBadge status={stars.kienTru.nature} />
        </div>
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start">
             <div>
                <div className="font-bold text-gray-900 dark:text-white">Sao {stars.nhiThapBatTu.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stars.nhiThapBatTu.animal}</div>
             </div>
             <StatusBadge status={stars.nhiThapBatTu.nature} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SolarTermSection({ info }: { info: FengShuiDayInfo }) {
  const { tietKhi } = info;
  if (!tietKhi) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Tiết Khí</h3>
      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Hiện tại</div>
          <div className="font-bold text-gray-900 dark:text-white text-lg capitalize">{tietKhi.current}</div>
        </div>
        {tietKhi.next && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">Sắp tới</div>
            <div className="font-medium text-gray-900 dark:text-white">{tietKhi.next.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {tietKhi.next.date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long' })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HoangDaoHoursSection({ hours }: { hours: string[] }) {
  if (!hours || hours.length === 0) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Giờ Hoàng Đạo</h3>
      <div className="flex flex-wrap gap-2">
        {hours.map((hour, idx) => (
          <span 
            key={idx} 
            className="px-2.5 py-1 rounded-md text-sm bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 border border-orange-100 dark:border-orange-800"
          >
            {hour}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'very_good' | 'good' | 'neutral' | 'bad' | 'very_bad' }) {
  let classes = '';
  let label = '';

  switch (status) {
    case 'very_good':
      classes = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      label = 'Rất Tốt';
      break;
    case 'good':
      classes = 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      label = 'Tốt';
      break;
    case 'bad':
      classes = 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      label = 'Xấu';
      break;
    case 'very_bad':
      classes = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      label = 'Rất Xấu';
      break;
    default:
      classes = 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
      label = 'Bình Hòa';
  }

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${classes}`}>
      {label}
    </span>
  );
}

interface PersonalFengShuiSectionProps {
  profile: FamilyProfile;
  check: { compatible: boolean; score: number; reasons: string[] };
  solarDate: SolarDate;
}

function PersonalFengShuiSection({ profile, check, solarDate }: PersonalFengShuiSectionProps) {
  const personalFengShui = fengShuiService.getPersonalFengShui(profile.birthYear, solarDate.year);
  const currentYearHan = personalFengShui.hanTuoi.filter(h => h.year === solarDate.year);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-purple-800 dark:text-purple-300">{profile.name}</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Tuổi {personalFengShui.chiName} • Hành {personalFengShui.element}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          check.score >= 70 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : check.score >= 50
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {check.score}/100
        </div>
      </div>

      {/* Compatibility Status */}
      <div className={`flex items-center gap-2 mb-3 ${
        check.compatible ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
      }`}>
        <span className="text-lg">{check.compatible ? '✓' : '⚠'}</span>
        <span className="font-medium">
          {check.compatible ? 'Ngày hợp tuổi' : 'Ngày không hợp tuổi'}
        </span>
      </div>

      {/* Reasons */}
      {check.reasons.length > 0 && (
        <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
          {check.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Han Tuoi Warnings */}
      {currentYearHan.length > 0 && (
        <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
          <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
            ⚠ Hạn Tuổi Năm {solarDate.year}
          </h4>
          <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
            {currentYearHan.map((han, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-medium">{han.type}:</span>
                <span>{han.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
