import { create } from 'zustand';

interface AppStatusState {
  isOnline: boolean;
  setOnline: (online: boolean) => void;
  initListeners: () => () => void;
}

export const useAppStatusStore = create<AppStatusState>()((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

  setOnline: (online: boolean) => set({ isOnline: online }),

  initListeners: () => {
    const handleOnline = () => set({ isOnline: true });
    const handleOffline = () => set({ isOnline: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },
}));
