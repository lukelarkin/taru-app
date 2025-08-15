import { create } from 'zustand';
import { Challenge } from '../supa/types';

interface ChallengesState {
  challenges: Challenge[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const useChallenges = create<ChallengesState>((set) => ({
  challenges: [
    {
      id: '1',
      title: 'Mindful Breathing',
      total: 10,
      completed: 7,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    },
    {
      id: '2',
      title: 'Body Scan',
      total: 5,
      completed: 3,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    },
    {
      id: '3',
      title: 'Gratitude Practice',
      total: 7,
      completed: 5,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    },
    {
      id: '4',
      title: 'Walking Meditation',
      total: 3,
      completed: 1,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    },
  ],
  isLoading: false,
  refresh: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isLoading: false });
  },
}));
