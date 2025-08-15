export type ID = string;

export interface Streak { 
  user_id: ID; 
  count: number; 
  updated_at: string; 
}

export interface DailyFocus { 
  user_id: ID; 
  text: string; 
  created_at: string; 
  updated_at: string; 
}

export interface Exercise { 
  id: ID; 
  title: string; 
  durationSec: number; 
  kind: 'breath' | 'somatic' | 'audio'; 
}

export interface Challenge { 
  id: ID; 
  title: string; 
  total: number; 
  completed: number; 
  image?: string; 
}

export interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
}
