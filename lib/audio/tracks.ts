export interface AudioTrack {
  id: string;
  title: string;
  duration: number;
  type: 'sound-bath' | 'breathing' | 'meditation';
  url?: string;
}

export const audioTracks: AudioTrack[] = [
  {
    id: 'morning-sound-bath',
    title: 'Morning Sound Bath',
    duration: 300, // 5 minutes
    type: 'sound-bath',
  },
  {
    id: 'evening-sound-bath',
    title: 'Evening Sound Bath',
    duration: 420, // 7 minutes
    type: 'sound-bath',
  },
  {
    id: 'physiologic-sigh',
    title: 'Physiologic Sigh',
    duration: 120, // 2 minutes
    type: 'breathing',
  },
  {
    id: 'alternate-nostril',
    title: 'Alternate Nostril Breathing',
    duration: 180, // 3 minutes
    type: 'breathing',
  },
  {
    id: 'shake-off',
    title: 'Shake Off Exercise',
    duration: 90, // 1.5 minutes
    type: 'meditation',
  },
];

export const getTrackByTimeOfDay = (): AudioTrack => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return audioTracks[0]; // Morning
  } else {
    return audioTracks[1]; // Evening
  }
};
