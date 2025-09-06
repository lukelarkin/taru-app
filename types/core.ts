```typescript name=types/core.ts
// Core app types for TARU

export type Archetype = 'Warrior' | 'Sage' | 'Lover' | 'Seeker';

export type Part =
  | 'InnerCritic'
  | 'Rebel'
  | 'PeoplePleaser'
  | 'LonelyChild'
  | 'StoicMask';

export type TriggerKind =
  | 'late_night'
  | 'porn_site'
  | 'gambling_site'
  | 'doomscroll'
  | 'step_drop'
  | 'negative_sentiment';

export interface TriggerEvent {
  id: string;
  kind: TriggerKind;
  ts: number;                // epoch ms
  meta?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  archetype?: Archetype;
  streak: number;
  ubuntuTokens: number;
  createdAt: number;
  updatedAt: number;
}

export interface DailyCheckIn {
  date: string;              // YYYY-MM-DD (local)
  dominantPart: Part;
  notes?: string;
}

export interface ArchetypeAnswer {
  qid: number;
  archetype: Archetype;
}
```
