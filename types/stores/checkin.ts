stores/checkin.ts
// Copilot: implement computeStreak() (monotonic increase with 1-day gaps),
// prevent multiple logs per local date, and award tokens every N-day streak (default 3).
// Add timezone-safe helpers (e.g., date-fns-tz if needed).

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DailyCheckIn, Part } from '../types/core';
import { useUserStore } from './user';

type CheckinState = {
  checkins: DailyCheckIn[];             // newest first recommended
  todayLogged: () => boolean;
  log: (dominantPart: Part, notes?: string) => void;
  computeStreak: () => number;
  clear: () => void;
};

const dateKey = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const useCheckinStore = create<CheckinState>()(
  persist(
    (set, get) => ({
      checkins: [],
      todayLogged: () => get().checkins.some((c) => c.date === dateKey()),
      log: (dominantPart, notes) => {
        const today = dateKey();
        if (get().checkins.some((c) => c.date === today)) return; // prevent duplicates
        const next = [{ date: today, dominantPart, notes }, ...get().checkins].sort(
          (a, b) => (a.date < b.date ? 1 : -1)
        );
        set({ checkins: next });

        // update streak & tokens in user store
        const newStreak = get().computeStreak();
        const { setStreak, addTokens } = useUserStore.getState();
        const prevStreak = useUserStore.getState().profile.streak;
        setStreak(newStreak);

        // award tokens on 3-day boundaries (3, 6, 9, …)
        if (newStreak >= 3 && Math.floor(newStreak / 3) > Math.floor(prevStreak / 3)) {
          addTokens(3);
        }
      },
      computeStreak: () => {
        // contiguous-by-1-day logic from most recent date backwards
        const entries = [...get().checkins].sort((a, b) => (a.date > b.date ? -1 : 1));
        if (!entries.length) return 0;
        let streak = 0;
        let cur = new Date(entries[0].date + 'T00:00:00');
        for (const e of entries) {
          const d = new Date(e.date + 'T00:00:00');
          const diff = Math.round((cur.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
          if (streak === 0) streak = 1; // first item
          else if (diff === 1) streak += 1;
          else break;
          cur = d;
        }
        return streak;
      },
      clear: () => set({ checkins: [] }),
    }),
    {
      name: 'taru_checkins',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
