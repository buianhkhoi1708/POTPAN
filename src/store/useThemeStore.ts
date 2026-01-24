// Nhóm 9 - IE307.Q12
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppLightColor, AppDarkColor, ThemeColors } from '../styles/color';

interface ThemeState {
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      theme: AppLightColor,
      
      toggleTheme: () => set((state) => {
        const newMode = !state.isDarkMode;
        return { 
          isDarkMode: newMode,
          theme: newMode ? AppDarkColor : AppLightColor
        };
      }),

      setTheme: (isDark: boolean) => set({
        isDarkMode: isDark,
        theme: isDark ? AppDarkColor : AppLightColor
      }),
    }),
    {
      name: 'app-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isDarkMode: state.isDarkMode }), 
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.theme = state.isDarkMode ? AppDarkColor : AppLightColor;
        }
      }
    }
  )
);