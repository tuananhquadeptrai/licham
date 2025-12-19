import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getWeatherByCoords, type WeatherData } from '../services/weatherService';

const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

interface WeatherState {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  locationEnabled: boolean;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
  setLocationEnabled: (enabled: boolean) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      weather: null,
      isLoading: false,
      error: null,
      locationEnabled: false,

      fetchWeather: async (lat: number, lon: number) => {
        const { weather } = get();
        
        if (weather?.updatedAt) {
          const lastUpdate = new Date(weather.updatedAt).getTime();
          const now = Date.now();
          if (now - lastUpdate < CACHE_DURATION_MS) {
            return;
          }
        }

        set({ isLoading: true, error: null });

        try {
          const weatherData = await getWeatherByCoords(lat, lon);
          set({ weather: weatherData, isLoading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Không thể tải thời tiết',
            isLoading: false,
          });
        }
      },

      setLocationEnabled: (enabled: boolean) => {
        set({ locationEnabled: enabled });
        if (!enabled) {
          set({ weather: null, error: null });
        }
      },
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({
        weather: state.weather,
        locationEnabled: state.locationEnabled,
      }),
    }
  )
);
