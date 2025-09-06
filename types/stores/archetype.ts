stores/archetype.ts
// Copilot: add derived selectors (e.g., tally map), and hydration helpers if needed.

import { create } from 'zustand';
import { Archetype, ArchetypeAnswer } from '../types/core';

type ArchetypeState = {
  answers: ArchetypeAnswer[];
  recordAnswer: (qid: number, archetype: Archetype) => void;
  computeArchetype: () => Archetype;   // deterministic tie-breaker
  reset: () => void;
};

export const useArchetypeStore = create<ArchetypeState>((set, get) => ({
  answers: [],
  recordAnswer: (qid, archetype) =>
    set((s) => ({
      answers: [...s.answers.filter((a) => a.qid !== qid), { qid, archetype }],
    })),
  computeArchetype: () => {
    const tally = get().answers.reduce<Record<Archetype, number>>(
      (acc, a) => ({ ...acc, [a.archetype]: (acc[a.archetype] ?? 0) + 1 }),
      { Warrior: 0, Sage: 0, Lover: 0, Seeker: 0 }
    );
    // deterministic: Warrior > Sage > Lover > Seeker on ties
    const order: Archetype[] = ['Warrior', 'Sage', 'Lover', 'Seeker'];
    return order.reduce((best, cur) => (tally[cur] > tally[best] ? cur : best), order[0]);
  },
  reset: () => set({ answers: [] }),
}));
```
