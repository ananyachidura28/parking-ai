import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDark: true,
  toggleTheme: () => set((state) => {
    const nextDark = !state.isDark;
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDark: nextDark };
  }),
  initTheme: () => {
    document.documentElement.classList.add('dark');
  }
}));
