import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FamilyProfile } from '../types/profile';

interface ProfileState {
  profiles: FamilyProfile[];
  selectedProfileId: string | null;

  addProfile: (profile: Omit<FamilyProfile, 'id' | 'createdAt'>) => void;
  updateProfile: (id: string, updates: Partial<Omit<FamilyProfile, 'id' | 'createdAt'>>) => void;
  deleteProfile: (id: string) => void;
  setSelectedProfile: (id: string | null) => void;
  getSelectedProfile: () => FamilyProfile | null;
}

function generateId(): string {
  return `profile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      selectedProfileId: null,

      addProfile: (profileData) => {
        const newProfile: FamilyProfile = {
          ...profileData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          profiles: [...state.profiles, newProfile],
        }));
      },

      updateProfile: (id, updates) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProfile: (id) => {
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          selectedProfileId: state.selectedProfileId === id ? null : state.selectedProfileId,
        }));
      },

      setSelectedProfile: (id) => {
        set({ selectedProfileId: id });
      },

      getSelectedProfile: () => {
        const state = get();
        if (!state.selectedProfileId) return null;
        return state.profiles.find((p) => p.id === state.selectedProfileId) || null;
      },
    }),
    {
      name: 'family-profiles-storage',
    }
  )
);
