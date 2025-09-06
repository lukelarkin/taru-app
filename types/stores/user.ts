stores/user.ts
// Copilot: add selectors like getArchetypeTone() once ARCHETYPE_MAP exists.

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, Archetype } from '../types/core';

type UserState = {
  profile: UserProfile;
  setArchetype: (a: Archetype) => void;
  addTokens: (n: number) => void;
  setStreak: (n: number) => void;
  touch: () => void;
  reset: () => void;
};

const initial: UserProfile = {
  id: 'local',
  archetype: undefined,
  streak: 0,
  ubuntuTokens: 0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: initial,
      setArchetype: (a) =>
        set((s) => ({ profile: { ...s.profile, archetype: a, updatedAt: Date.now() } })),
      addTokens: (n) =>
        set((s) => ({ profile: { ...s.profile, ubuntuTokens: s.profile.ubuntuTokens + n, updatedAt: Date.now() } })),
      setStreak: (n) =>
        set((s) => ({ profile: { ...s.profile, streak: n, updatedAt: Date.now() } })),
      touch: () => set((s) => ({ profile: { ...s.profile, updatedAt: Date.now() } })),
      reset: () => set({ profile: { ...initial, createdAt: Date.now(), updatedAt: Date.now() } }),
    }),
    {
      name: 'taru_user',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
