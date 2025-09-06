stores/index.ts
// Barrel for state management stores (e.g., Zustand/Redux).
export * from './user';
export * from './archetype';
export * from './checkin';
export * from './intervention';
```

```typescript name=lib/archetypeQuestions.ts
// 5 concise quiz questions mapping answers to Warrior/Sage/Lover/Seeker.

import type { Archetype } from '../types/core';

export type QuizOption = { label: string; archetype: Archetype };
export type QuizQuestion = { qid: number; prompt: string; options: QuizOption[] };

export const QUESTIONS: QuizQuestion[] = [
  {
    qid: 1,
    prompt: 'In a tough moment, you most naturally…',
    options: [
      { label: 'Take charge and push through', archetype: 'Warrior' },
      { label: 'Step back to understand the pattern', archetype: 'Sage' },
      { label: 'Seek connection and warmth', archetype: 'Lover' },
      { label: 'Explore alternatives and try again', archetype: 'Seeker' },
    ],
  },
  {
    qid: 2,
    prompt: 'Your superpower tends to be…',
    options: [
      { label: 'Discipline and grit', archetype: 'Warrior' },
      { label: 'Clarity and insight', archetype: 'Sage' },
      { label: 'Empathy and care', archetype: 'Lover' },
      { label: 'Curiosity and growth', archetype: 'Seeker' },
    ],
  },
  {
    qid: 3,
    prompt: 'When you slip, your best reset is…',
    options: [
      { label: 'Refocus and recommit', archetype: 'Warrior' },
      { label: 'Reflect and learn one lesson', archetype: 'Sage' },
      { label: 'Lean on your people', archetype: 'Lover' },
      { label: 'Try a new path', archetype: 'Seeker' },
    ],
  },
  {
    qid: 4,
    prompt: 'People count on you for…',
    options: [
      { label: 'Follow-through', archetype: 'Warrior' },
      { label: 'Perspective', archetype: 'Sage' },
      { label: 'Support', archetype: 'Lover' },
      { label: 'Ideas', archetype: 'Seeker' },
    ],
  },
  {
    qid: 5,
    prompt: 'Your inner voice sounds most like…',
    options: [
      { label: '“You’ve got this—move.”', archetype: 'Warrior' },
      { label: '“Pause—what’s really happening?”', archetype: 'Sage' },
      { label: '“You’re not alone—breathe.”', archetype: 'Lover' },
      { label: '“Let’s try a small experiment.”', archetype: 'Seeker' },
    ],
  },
];
