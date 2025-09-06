lib/archetypeMapping.ts
// ARCHETYPE_MAP with tone, IFS order (Parts), substitutions, and grounded microcopy.

import type { Archetype, Part } from '../types/core';

type ArchetypeInfo = {
  tone: string;
  ifsOrder: Part[]; // parts to check-in with, in order
  substitutions: string[]; // 3 quick swaps to shift state
  copy: string; // sacred-but-grounded affirmation/microcopy
};

export const ARCHETYPE_MAP: Record<Archetype, ArchetypeInfo> = {
  Warrior: {
    tone: 'Firm, forward, supportive',
    ifsOrder: ['StoicMask', 'InnerCritic', 'Rebel'],
    substitutions: ['Cold water + posture reset', '10 mindful breaths', 'Text a buddy “2-min check-in?”'],
    copy:
      'You lead with brave momentum. Today, your power is steady progress over perfect outcomes. One clean rep at a time.',
  },
  Sage: {
    tone: 'Calm, clear, spacious',
    ifsOrder: ['InnerCritic', 'StoicMask', 'LonelyChild'],
    substitutions: ['Name the pattern out loud', 'Write one true sentence', 'Step outside for sky + air'],
    copy:
      'You see the pattern beneath the noise. Today, choose the kind, clear step. Clarity is relief, not pressure.',
  },
  Lover: {
    tone: 'Warm, caring, attuned',
    ifsOrder: ['LonelyChild', 'PeoplePleaser', 'InnerCritic'],
    substitutions: ['Hand on heart + slow exhale', 'Warm tea + phone a friend', 'Gratitude for one small thing'],
    copy:
      'You heal by connection. Today, receive care as easily as you give it. Softness is strength in motion.',
  },
  Seeker: {
    tone: 'Light, curious, playful',
    ifsOrder: ['Rebel', 'StoicMask', 'PeoplePleaser'],
    substitutions: ['2-minute novelty task', 'Change environment (new room)', 'Micro-walk: 200 steps'],
    copy:
      'You grow by discovery. Today, pick the smallest playful experiment. Momentum loves curiosity.',
  },
};
