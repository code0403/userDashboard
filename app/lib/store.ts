// zustand store


import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  darkMode: boolean;
  toggleDarkMode: () => void;

  userId: string | null;
  setUserId: (id: string | null) => void;
}

export const useAppStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),

      userId: null,
      setUserId: (id) => set({ userId: id }),
    }),
    {
      name: "app-storage",
    }
  )
);
