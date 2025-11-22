// zustand store


import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "./types";

interface ActivityEntry {
  type: "add" | "edit" | "delete";
  message: string;
  timestamp: string;
}

interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  loggedInUser: User | null;
  setLoggedInUser: (user: User) => void;
  // activityLog: string[];
  // addActivity: (entry: string) => void;
  activityLog: ActivityEntry[];
  addActivity: (entry: ActivityEntry) => void;
  isActivityOpen: boolean;
  toggleActivity: () => void;
}


export const useStore = create<AppState>()(
  persist(
    (set) => ({
      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      loggedInUser: null,
      setLoggedInUser: (user) => set({ loggedInUser: user }),
      activityLog: [],
      // addActivity: (entry) =>
      //   set((state) => ({ activityLog: [...state.activityLog, entry] })),
      addActivity: (entry) =>
        set((state) => ({ activityLog: [...state.activityLog, entry] })),
      isActivityOpen: false,
      toggleActivity: () => set((state) => ({ isActivityOpen: !state.isActivityOpen })),
    }),
    { name: "app-store" }
  )
);

