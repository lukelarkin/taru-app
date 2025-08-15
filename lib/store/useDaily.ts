import { create } from 'zustand';
import { Streak, DailyFocus } from '../supa/types';

interface DailyState {
  streak: Streak;
  dailyFocus: DailyFocus;
  todayProgress: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const useDaily = create<DailyState>((set) => ({
  streak: {
    user_id: 'demo-user',
    count: 7,
    updated_at: new Date().toISOString(),
  },
  dailyFocus: {
    user_id: 'demo-user',
    text: 'Focus on deep breathing and mindfulness today',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  todayProgress: 65,
  isLoading: false,
  refresh: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ 
      isLoading: false,
      todayProgress: Math.floor(Math.random() * 100),
    });
  },
}));
