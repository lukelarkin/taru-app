import { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  enqueueEvent, 
  trackBehavior as queueTrackBehavior, 
  trackIntervention as queueTrackIntervention, 
  trackOutcome as queueTrackOutcome, 
  trackResetComplete as queueTrackResetComplete,
  getQueueSize 
} from './pineconeClient';

// Generate a simple user ID (in production, use proper authentication)
const generateUserId = async () => {
  try {
    const stored = await AsyncStorage.getItem('taru_user_id');
    if (stored) return stored;
    
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await AsyncStorage.setItem('taru_user_id', newId);
    return newId;
  } catch (error) {
    // Fallback to timestamp-based ID if storage fails
    return `user_${Date.now()}`;
  }
};

export const usePinecone = () => {
  const [userId, setUserId] = useState<string>('');
  
  // Initialize user ID
  useEffect(() => {
    const initUserId = async () => {
      const id = await generateUserId();
      setUserId(id);
    };
    initUserId();
  }, []);
  
  // Track when user experiences a craving
  const trackCraving = useCallback(async (emotionalState: string, trigger: string, deviceUsage: number = 0) => {
    if (!userId) return;
    
    const behavior = {
      emotionalState,
      trigger,
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      deviceUsage,
    };
    
    await queueTrackBehavior(userId, behavior);
  }, [userId]);
  
  // Track when user attempts a reset
  const trackResetAttempt = useCallback(async (resetType: string, duration: number) => {
    if (!userId) return;
    
    const intervention = {
      resetType,
      duration,
    };
    
    await queueTrackIntervention(userId, intervention);
  }, [userId]);
  
  // Track AI interaction
  const trackAIInteraction = useCallback(async (aiPersona: string, aiResponse: string, duration: number) => {
    if (!userId) return;
    
    const intervention = {
      resetType: 'ai-recovery',
      aiPersona,
      aiResponse,
      duration,
    };
    
    await queueTrackIntervention(userId, intervention);
  }, [userId]);
  
  // Track the outcome of an intervention
  const trackOutcome = useCallback(async (success: boolean, behaviorChange: number, cravingReduction: number, duration: number) => {
    if (!userId) return;
    
    const outcome = {
      success,
      behaviorChange,
      cravingReduction,
      duration,
    };
    
    await queueTrackOutcome(userId, outcome);
  }, [userId]);
  
  // Track reset completion
  const trackResetComplete = useCallback(async (resetData: any) => {
    if (!userId) return;
    await queueTrackResetComplete(userId, resetData);
  }, [userId]);
  
  // Get personalized recommendations (mock for now)
  const getRecommendations = useCallback(async (currentState: any) => {
    if (!userId) return ['alternate-nostril', 'physiologic-sigh', 'eft-tapping'];
    
    // Mock recommendations based on time of day and emotional state
    const hour = new Date().getHours();
    const emotionalState = currentState?.emotionalState || 'neutral';
    
    if (hour < 12) {
      return ['alternate-nostril', 'physiologic-sigh', 'eft-tapping'];
    } else if (hour < 18) {
      return ['eft-tapping', 'box-breathing', 'shake-off'];
    } else {
      return ['physiologic-sigh', 'cold-splash', 'alternate-nostril'];
    }
  }, [userId]);
  
  // Get user insights (mock for now)
  const getUserInsights = useCallback(async () => {
    if (!userId) return null;
    
    // Mock insights based on queue size
    const queueSize = getQueueSize();
    
    return {
      totalInterventions: Math.floor(queueSize * 0.6),
      successRate: 0.75,
      mostEffectiveReset: 'eft-tapping',
      peakUsageTime: 14, // 2 PM
      averageCravingReduction: 7.2,
    };
  }, [userId]);
  
  return {
    userId,
    trackCraving,
    trackResetAttempt,
    trackAIInteraction,
    trackOutcome,
    trackResetComplete,
    getRecommendations,
    getUserInsights,
  };
}; 