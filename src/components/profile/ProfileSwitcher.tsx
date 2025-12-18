import { useState, useRef, useEffect } from 'react';
import { useProfileStore } from '../../store/useProfileStore';
import type { FamilyProfile } from '../../types/profile';

interface ProfileSwitcherProps {
  onOpenManager: () => void;
}

function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-rose-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function ProfileSwitcher({ onOpenManager }: ProfileSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profiles, selectedProfileId, setSelectedProfile, getSelectedProfile } = useProfileStore();
  const selectedProfile = getSelectedProfile();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string | null) => {
    setSelectedProfile(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        {selectedProfile ? (
          <>
            <span className={`w-6 h-6 rounded-full ${getAvatarColor(selectedProfile.name)} text-white flex items-center justify-center text-xs font-bold`}>
              {getInitials(selectedProfile.name)}
            </span>
            <span className="max-w-[100px] truncate">{selectedProfile.name}</span>
          </>
        ) : (
          <>
            <span>👤</span>
            <span>Chọn hồ sơ</span>
          </>
        )}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-50">
          <div className="p-2">
            <button
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedProfileId === null
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs">
                ✕
              </span>
              <span>Không chọn</span>
            </button>

            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleSelect(profile.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedProfileId === profile.id
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`w-6 h-6 rounded-full ${getAvatarColor(profile.name)} text-white flex items-center justify-center text-xs font-bold`}>
                  {getInitials(profile.name)}
                </span>
                <span className="flex-1 text-left truncate">{profile.name}</span>
                {profile.relationship && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">{profile.relationship}</span>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenManager();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <span>+</span>
              <span>Quản lý hồ sơ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
