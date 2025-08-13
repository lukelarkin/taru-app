import { 
  trackBehavior, 
  trackIntervention, 
  trackOutcome, 
  trackResetComplete,
  flushQueuedEvents,
  getQueueSize 
} from './pineconeClient';

// Test function to verify queue-based integration
export const testPineconeIntegration = async () => {
  console.log('🧪 Testing Queue-Based Integration...');
  
  try {
    const testUserId = 'test-user-123';
    
    // Test 1: Track user behavior
    console.log('📊 Testing behavior tracking...');
    await trackBehavior(testUserId, {
      emotionalState: 'craving',
      trigger: 'social-media',
      timeOfDay: 14, // 2 PM
      dayOfWeek: 2, // Tuesday
      deviceUsage: 120, // 2 hours
    });
    console.log('✅ Behavior tracking successful');
    
    // Test 2: Track intervention
    console.log('🎯 Testing intervention tracking...');
    await trackIntervention(testUserId, {
      resetType: 'alternate-nostril',
      duration: 60,
    });
    console.log('✅ Intervention tracking successful');
    
    // Test 3: Track outcome
    console.log('📈 Testing outcome tracking...');
    await trackOutcome(testUserId, {
      success: true,
      behaviorChange: 8,
      cravingReduction: 7,
      duration: 3600, // 1 hour
    });
    console.log('✅ Outcome tracking successful');
    
    // Test 4: Track reset completion
    console.log('🎉 Testing reset completion tracking...');
    await trackResetComplete(testUserId, {
      reset: 'alternate-nostril',
      duration_sec: 60,
      outcome: 8,
    });
    console.log('✅ Reset completion tracking successful');
    
    // Test 5: Check queue size
    console.log('📊 Testing queue size...');
    const queueSize = getQueueSize();
    console.log(`✅ Queue size: ${queueSize} events`);
    
    // Test 6: Flush queue (simulate sending to server)
    console.log('🔄 Testing queue flush...');
    const flushResult = await flushQueuedEvents();
    console.log(`✅ Flush result:`, flushResult);
    
    console.log('🎉 All queue-based tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Queue-based test failed:', error);
    return false;
  }
};

// Export for use in development
export default testPineconeIntegration; 