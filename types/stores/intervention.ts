stores/intervention.ts
// Copilot: add TTL/expiry for stale events (e.g., >5m), and a "snooze" handler.
// Later wire to services/bridge.ts (WebSocket) to call handleIncoming().

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TriggerEvent } from '../types/core';

type InterventionState = {
  activeEvent?: TriggerEvent;
  queue: TriggerEvent[];
  handleIncoming: (e: TriggerEvent) => void;
  dismiss: () => void;
  clearAll: () => void;
};

export const useInterventionStore = create<InterventionState>()(
  persist(
    (set, get) => ({
      activeEvent: undefined,
      queue: [],
      handleIncoming: (e) => {
        const { activeEvent, queue } = get();
        if (!activeEvent) set({ activeEvent: e });
        else set({ queue: [...queue, e] });
      },
      dismiss: () => {
        const { queue } = get();
        if (queue.length) set({ activeEvent: queue[0], queue: queue.slice(1) });
        else set({ activeEvent: undefined });
      },
      clearAll: () => set({ activeEvent: undefined, queue: [] }),
    }),
    {
      name: 'taru_intervention',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      // Copilot: blacklist activeEvent from persistence if desired (transient UI state)
      // partialize: (s) => ({ queue: s.queue }),
    }
  )
);
