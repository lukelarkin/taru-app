export interface Lesson {
  id: string;
  title: string;
  goal: string;
  durationSec: number;
  youtubeId?: string;
  tags: string[];
  steps: string[];
}

export const LESSONS: Lesson[] = [
  // -- STOP Technique (DBT)
  {
    id: "stop-technique",
    title: "The STOP Technique",
    goal: "Hit the brakes on impulse—shift from reaction to intention.",
    durationSec: 90,
    youtubeId: "8ykrSYe6UMk",
    tags: ["cognitive","education"],
    steps: [
      "S — Stop: Freeze. Don't move, speak, or react.",
      "T — Take a step back: Breathe. Count to five. Zoom out.",
      "O — Observe: Body sensations, thoughts, emotions—just notice.",
      "P — Proceed mindfully: Choose a next step aligned with your values."
    ],
  },
  {
    id: "five-finger-breathing",
    title: "Five Finger Breathing",
    goal: "Ground fast with rhythm + touch—perfect for panic, cravings, or overwhelm.",
    durationSec: 90,
    youtubeId: "REPLACE_WITH_VIDEO_ID", // e.g. "d8QYxI4Z2xk"
    tags: ["breath","somatic","education"],
    steps: [
      "Star hand: hold one hand up like a star.",
      "Trace + inhale: index finger traces up the outside of your thumb as you breathe in.",
      "Trace + exhale: trace down the inside of the thumb as you breathe out.",
      "Repeat for each finger—inhale up, exhale down.",
      "Finish: pause and notice one thing that feels softer."
    ],
  },
];
