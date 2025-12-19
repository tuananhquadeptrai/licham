import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'vi' | 'en';
export type Theme = 'light' | 'dark' | 'system';
export type ViewMode = 'month' | 'week' | 'agenda';

interface CalendarState {
  selectedDate: Date;
  currentMonth: number;
  currentYear: number;
  locale: Locale;
  theme: Theme;
  viewMode: ViewMode;
  
  setSelectedDate: (date: Date) => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToNextWeek: () => void;
  goToPrevWeek: () => void;
  goToToday: () => void;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setViewMode: (mode: ViewMode) => void;
}

const today = new Date();

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      selectedDate: today,
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
      locale: 'vi',
      theme: 'light',
      viewMode: 'month',

      setSelectedDate: (date: Date) =>
        set({
          selectedDate: date,
          currentMonth: date.getMonth(),
          currentYear: date.getFullYear(),
        }),

      setCurrentMonth: (month: number) => set({ currentMonth: month }),
      setCurrentYear: (year: number) => set({ currentYear: year }),

      goToNextMonth: () =>
        set((state) => {
          const nextMonth = state.currentMonth + 1;
          if (nextMonth > 11) {
            return { currentMonth: 0, currentYear: state.currentYear + 1 };
          }
          return { currentMonth: nextMonth };
        }),

      goToPrevMonth: () =>
        set((state) => {
          const prevMonth = state.currentMonth - 1;
          if (prevMonth < 0) {
            return { currentMonth: 11, currentYear: state.currentYear - 1 };
          }
          return { currentMonth: prevMonth };
        }),

      goToNextWeek: () =>
        set((state) => {
          const newDate = new Date(state.selectedDate);
          newDate.setDate(newDate.getDate() + 7);
          return {
            selectedDate: newDate,
            currentMonth: newDate.getMonth(),
            currentYear: newDate.getFullYear(),
          };
        }),

      goToPrevWeek: () =>
        set((state) => {
          const newDate = new Date(state.selectedDate);
          newDate.setDate(newDate.getDate() - 7);
          return {
            selectedDate: newDate,
            currentMonth: newDate.getMonth(),
            currentYear: newDate.getFullYear(),
          };
        }),

      goToToday: () => {
        const today = new Date();
        set({
          selectedDate: today,
          currentMonth: today.getMonth(),
          currentYear: today.getFullYear(),
        });
      },

      setLocale: (locale: Locale) => set({ locale }),
      setTheme: (theme: Theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      setViewMode: (viewMode: ViewMode) => set({ viewMode }),
    }),
    {
      name: 'calendar-storage',
      partialize: (state) => ({ locale: state.locale, theme: state.theme, viewMode: state.viewMode }),
    }
  )
);
