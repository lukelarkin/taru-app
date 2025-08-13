import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, typography } from '../../ui/designSystem';
import { haptics } from '../../lib/haptics';
import { usePinecone } from '../../lib/usePinecone';
import { testPineconeIntegration } from '../../lib/testPinecone';
import TappingSession from '../../components/TappingSession';
import AnalyticsDiagnostics from '../../components/AnalyticsDiagnostics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Design colors matching Figma
const designColors = {
  background: '#171712',
  cardBackground: '#26241c',
  textPrimary: '#ffffff',
  textSecondary: '#bab29c',
  yellow: '#f5c947',
  yellowHover: '#f0c342',
  green: '#4ade80',
  blue: '#60a5fa',
  red: '#f87171',
};

// Placeholder images - replace with actual assets
const placeholderImages = {
  hero: { uri: 'https://via.placeholder.com/400x218/171712/ffffff?text=Hero+Image' },
  nostrilBreathing: { uri: 'https://via.placeholder.com/400x201/26241c/ffffff?text=Nostril+Breathing' },
  physiologicSigh: { uri: 'https://via.placeholder.com/400x201/26241c/ffffff?text=Physiologic+Sigh' },
  eftTapping: { uri: 'https://via.placeholder.com/400x201/26241c/ffffff?text=EFT+Tapping' },
};

// EFT Session Configurations
const EFT_SESSIONS = {
  emergency_3min: {
    id: 'emergency_3min',
    durationSec: 180,
    steps: [
      { at: 0, point: 'karate_chop', line: 'Even though I feel this craving for {{vertical}}, I deeply and completely accept myself.' },
      { at: 15, point: 'eyebrow', line: 'Even though I want to {{micro_action}} right now, I choose to breathe instead.' },
      { at: 30, point: 'side_eye', line: 'Even though this feeling is intense, I can handle it with {{one_action}}.' },
      { at: 45, point: 'under_eye', line: 'Even though I feel overwhelmed, I am safe and in control.' },
      { at: 60, point: 'under_nose', line: 'Even though this urge is strong, I choose my long-term wellbeing.' },
      { at: 75, point: 'chin', line: 'Even though I want to escape, I can face this moment with courage.' },
      { at: 90, point: 'collarbone', line: 'Even though this is hard, I am stronger than my cravings.' },
      { at: 105, point: 'under_arm', line: 'Even though I feel weak, I have the power to choose differently.' },
      { at: 120, point: 'top_head', line: 'Even though this is challenging, I am growing through this experience.' },
      { at: 135, point: 'eyebrow', line: 'I release this craving and choose peace instead.' },
      { at: 150, point: 'side_eye', line: 'I am calm, centered, and in control of my choices.' },
      { at: 165, point: 'under_eye', line: 'I choose to honor my commitment to myself.' },
    ],
    chips: ['Take a walk', 'Call a friend', 'Do 10 push-ups', 'Write in journal', 'Meditate']
  },
  daily_7min: {
    id: 'daily_7min',
    durationSec: 420,
    steps: [
      { at: 0, point: 'karate_chop', line: 'Even though I have these {{vertical}} urges, I deeply and completely accept myself.' },
      { at: 30, point: 'eyebrow', line: 'Even though I want to {{micro_action}}, I choose to pause and reflect.' },
      { at: 60, point: 'side_eye', line: 'Even though this pattern is familiar, I can create new habits.' },
      { at: 90, point: 'under_eye', line: 'Even though change is uncomfortable, I am committed to growth.' },
      { at: 120, point: 'under_nose', line: 'Even though I feel vulnerable, I am building inner strength.' },
      { at: 150, point: 'chin', line: 'Even though this journey is challenging, I am worth the effort.' },
      { at: 180, point: 'collarbone', line: 'Even though I have setbacks, I am making progress every day.' },
      { at: 210, point: 'under_arm', line: 'Even though I feel uncertain, I trust my ability to heal.' },
      { at: 240, point: 'top_head', line: 'Even though this takes time, I am patient with my process.' },
      { at: 270, point: 'eyebrow', line: 'I am releasing old patterns and embracing new possibilities.' },
      { at: 300, point: 'side_eye', line: 'I am building a life that aligns with my highest values.' },
      { at: 330, point: 'under_eye', line: 'I am worthy of peace, joy, and authentic connection.' },
      { at: 360, point: 'under_nose', line: 'I am creating positive change in my life, one choice at a time.' },
      { at: 390, point: 'chin', line: 'I am grateful for this opportunity to grow and transform.' },
    ],
    chips: ['Read a book', 'Practice gratitude', 'Exercise', 'Connect with nature', 'Learn something new']
  }
};

interface BackButtonProps {
  onPress: () => void;
}

function BackButton({ onPress }: BackButtonProps) {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress}>
      <Svg width={24} height={24} viewBox="0 0 20 20" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          fill={designColors.textPrimary}
        />
      </Svg>
    </TouchableOpacity>
  );
}

interface HeaderProps {
  onBack: () => void;
}

function Header({ onBack }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerButtonContainer}>
          <BackButton onPress={onBack} />
        </View>
      </View>
    </View>
  );
}

function StatsMessage() {
  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsText}>
        💡 You've interrupted 4 cravings this week.
      </Text>
    </View>
  );
}

function HeroImage() {
  return (
    <View style={styles.heroContainer}>
      <Image source={placeholderImages.hero} style={styles.heroImage} resizeMode="cover" />
    </View>
  );
}

function MainTitle() {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.mainTitle}>Let's break this wave together.</Text>
    </View>
  );
}

function Subtitle() {
  return (
    <View style={styles.subtitleContainer}>
      <Text style={styles.subtitle}>90 seconds can change how you feel. Pick one.</Text>
    </View>
  );
}

interface ResetOptionProps {
  title: string;
  description: string;
  image: any;
  onStart: () => void;
}

function ResetOption({ title, description, image, onStart }: ResetOptionProps) {
  return (
    <View style={styles.optionContainer}>
      <View style={styles.optionCard}>
        <Image source={image} style={styles.optionImage} resizeMode="cover" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{title}</Text>
          <View style={styles.optionFooter}>
            <Text style={styles.optionDescription}>{description}</Text>
            <TouchableOpacity style={styles.startButton} onPress={onStart}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

interface SkipButtonProps {
  onPress: () => void;
}

function SkipButton({ onPress }: SkipButtonProps) {
  return (
    <View style={styles.skipContainer}>
      <TouchableOpacity style={styles.skipButton} onPress={onPress}>
        <Text style={styles.skipButtonText}>Skip for Now</Text>
      </TouchableOpacity>
    </View>
  );
}

interface AlternateNostrilBreathingProps {
  onBack: () => void;
}

function AlternateNostrilBreathing({ onBack }: AlternateNostrilBreathingProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCompleted, setIsCompleted] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const { trackOutcome } = usePinecone();

  const steps = [
    { instruction: "Place your thumb on your right nostril", nostril: "right", action: "block" },
    { instruction: "Inhale through your left nostril", nostril: "left", action: "inhale" },
    { instruction: "Block your left nostril with your ring finger", nostril: "left", action: "block" },
    { instruction: "Release your thumb and exhale through right nostril", nostril: "right", action: "exhale" },
    { instruction: "Inhale through your right nostril", nostril: "right", action: "inhale" },
    { instruction: "Block your right nostril with your thumb", nostril: "right", action: "block" },
    { instruction: "Release your ring finger and exhale through left nostril", nostril: "left", action: "exhale" },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsCompleted(true);
      haptics.success();
      
      // Track successful completion
      trackOutcome(true, 8, 7, 3600); // 1 hour effect duration
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, trackOutcome]);

  useEffect(() => {
    let stepInterval: NodeJS.Timeout;
    if (isActive) {
      stepInterval = setInterval(() => {
        setCurrentStep((step) => {
          const nextStep = (step + 1) % steps.length;
          if (nextStep === 0) {
            setCycles((c) => c + 1);
            haptics.medium();
          } else {
            haptics.light();
          }
          return nextStep;
        });
      }, 4000);
    }
    return () => clearInterval(stepInterval);
  }, [isActive, steps.length]);

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive, pulseAnim]);

  const handleStartPause = () => {
    haptics.light();
    setIsActive(!isActive);
  };

  const handleReset = () => {
    haptics.medium();
    setIsActive(false);
    setCurrentStep(0);
    setCycles(0);
    setTimeLeft(60);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    haptics.success();
    onBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIndicatorColor = (nostril: string, action: string) => {
    if (steps[currentStep]?.nostril === nostril && steps[currentStep]?.action === action) {
      switch (action) {
        case 'block': return designColors.red;
        case 'inhale': return designColors.green;
        case 'exhale': return designColors.blue;
        default: return 'transparent';
      }
    }
    return 'transparent';
  };

  const shouldPulse = (nostril: string, action: string) => {
    return steps[currentStep]?.nostril === nostril && 
           steps[currentStep]?.action === action && 
           (action === 'inhale' || action === 'exhale');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Header onBack={onBack} />
        
        <View style={styles.breathingTitleContainer}>
          <Text style={styles.breathingTitle}>Alternate Nostril Breathing</Text>
        </View>

        {isCompleted ? (
          <View style={styles.completionContainer}>
            <Text style={styles.completionTitle}>Great job! 🎉</Text>
            <Text style={styles.completionText}>
              You've completed {cycles} cycles of alternate nostril breathing.
            </Text>
            <Text style={styles.completionSubtext}>
              This should help reduce your digital cravings for the next hour.
            </Text>
            <TouchableOpacity style={styles.completionButton} onPress={handleComplete}>
              <Text style={styles.completionButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.cyclesText}>Cycles completed: {cycles}</Text>
            </View>

            <View style={styles.visualGuideContainer}>
              <View style={styles.visualGuideCard}>
                <View style={styles.noseContainer}>
                  <Text style={styles.noseEmoji}>👃</Text>
                  
                  {/* Right nostril indicator */}
                  <Animated.View 
                    style={[
                      styles.nostrilIndicator,
                      styles.rightIndicator,
                      { 
                        backgroundColor: getIndicatorColor('right', steps[currentStep]?.action),
                        transform: shouldPulse('right', steps[currentStep]?.action) ? [{ scale: pulseAnim }] : [{ scale: 1 }]
                      }
                    ]} 
                  />
                  
                  {/* Left nostril indicator */}
                  <Animated.View 
                    style={[
                      styles.nostrilIndicator,
                      styles.leftIndicator,
                      { 
                        backgroundColor: getIndicatorColor('left', steps[currentStep]?.action),
                        transform: shouldPulse('left', steps[currentStep]?.action) ? [{ scale: pulseAnim }] : [{ scale: 1 }]
                      }
                    ]} 
                  />
                </View>

                <Text style={styles.instructionText}>
                  {steps[currentStep]?.instruction}
                </Text>

                <View style={styles.actionIndicatorContainer}>
                  {steps[currentStep]?.action === 'inhale' && (
                    <Text style={[styles.actionText, { color: designColors.green }]}>↑ Inhale</Text>
                  )}
                  {steps[currentStep]?.action === 'exhale' && (
                    <Text style={[styles.actionText, { color: designColors.blue }]}>↓ Exhale</Text>
                  )}
                  {steps[currentStep]?.action === 'block' && (
                    <Text style={[styles.actionText, { color: designColors.red }]}>● Block</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                Use your right hand. Thumb blocks right nostril, ring finger blocks left nostril.
              </Text>
            </View>

            <View style={styles.controlsContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleStartPause}>
                <Text style={styles.primaryButtonText}>
                  {isActive ? 'Pause' : 'Start'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
                <Text style={styles.secondaryButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ResetsScreen() {
  const [currentScreen, setCurrentScreen] = useState<'selection' | 'nostril-breathing' | 'eft-tapping' | 'diagnostics'>('selection');
  const [selectedReset, setSelectedReset] = useState<string | null>(null);
  const [eftSession, setEftSession] = useState<typeof EFT_SESSIONS.emergency_3min | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [userInsights, setUserInsights] = useState<any>(null);
  const [testResult, setTestResult] = useState<string>('');
  
  const { 
    trackCraving, 
    trackResetAttempt, 
    trackOutcome, 
    getRecommendations, 
    getUserInsights 
  } = usePinecone();

  // Load user insights on mount
  useEffect(() => {
    const loadInsights = async () => {
      const insights = await getUserInsights();
      setUserInsights(insights);
    };
    loadInsights();
  }, [getUserInsights]);

  const handleStartReset = async (resetType: string) => {
    haptics.light();
    setSelectedReset(resetType);
    
    // Track the reset attempt
    trackResetAttempt(resetType, 60); // Default 60 seconds
    
    if (resetType === 'nostril-breathing') {
      setCurrentScreen('nostril-breathing');
    } else if (resetType === 'eft-tapping') {
      // Default to emergency 3-minute session for quick relief
      setEftSession(EFT_SESSIONS.emergency_3min);
      setCurrentScreen('eft-tapping');
    } else {
      console.log(`Starting ${resetType} session`);
      // TODO: Implement other reset types
    }
  };

  const handleSkip = () => {
    haptics.light();
    console.log("Skip for now clicked");
    
    // Track that user skipped (negative outcome)
    trackOutcome(false, 0, 0, 0);
  };

  const handleBackToSelection = () => {
    haptics.light();
    setCurrentScreen('selection');
    setSelectedReset(null);
  };

  // Test Pinecone integration
  const handleTestPinecone = async () => {
    setTestResult('Testing...');
    const result = await testPineconeIntegration();
    setTestResult(result ? '✅ Pinecone test passed!' : '❌ Pinecone test failed');
  };

  // Track craving when user opens the app
  useEffect(() => {
    if (currentScreen === 'selection') {
      // Simulate tracking a craving event
      trackCraving('craving', 'app-opened', 0);
    }
  }, [currentScreen, trackCraving]);

  const resetOptions = [
    {
      title: "Alternate Nostril Breathing",
      description: "Reset mind & body in 1 min.",
      image: placeholderImages.nostrilBreathing,
      type: "nostril-breathing"
    },
    {
      title: "Physiologic Sigh",
      description: "Release tension in 30 sec.",
      image: placeholderImages.physiologicSigh,
      type: "physiologic-sigh"
    },
    {
      title: "EFT Tapping",
      description: "Calm your nerves in 90 sec.",
      image: placeholderImages.eftTapping,
      type: "eft-tapping"
    }
  ];

  if (currentScreen === 'nostril-breathing') {
    return <AlternateNostrilBreathing onBack={handleBackToSelection} />;
  }

  if (currentScreen === 'eft-tapping' && eftSession) {
    return (
      <TappingSession
        session={eftSession}
        vertical="porn" // Default vertical, could be made dynamic
        onDone={handleBackToSelection}
        onBack={handleBackToSelection}
      />
    );
  }

  if (currentScreen === 'diagnostics') {
    return <AnalyticsDiagnostics />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Header onBack={() => console.log("Back to main app")} />
        <StatsMessage />
        <HeroImage />
        <MainTitle />
        <Subtitle />
        
        {/* Development Tools */}
        <View style={styles.testContainer}>
          <TouchableOpacity style={styles.testButton} onPress={handleTestPinecone}>
            <Text style={styles.testButtonText}>Test Queue Integration</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.testButton, { backgroundColor: designColors.green, marginTop: 8 }]} 
            onPress={() => setCurrentScreen('diagnostics')}
          >
            <Text style={styles.testButtonText}>Analytics Diagnostics</Text>
          </TouchableOpacity>
          {testResult ? (
            <Text style={styles.testResult}>{testResult}</Text>
          ) : null}
        </View>
        
        {resetOptions.map((option) => (
          <ResetOption
            key={option.type}
            title={option.title}
            description={option.description}
            image={option.image}
            onStart={() => handleStartReset(option.type)}
          />
        ))}
        
        <SkipButton onPress={handleSkip} />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designColors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: designColors.background,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerButtonContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: designColors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    fontFamily: 'System',
  },
  heroContainer: {
    width: '100%',
    height: 218,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    color: designColors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: 'System',
    fontWeight: '700',
  },
  subtitleContainer: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: designColors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'System',
  },
  optionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionCard: {
    backgroundColor: designColors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionImage: {
    width: '100%',
    height: 201,
  },
  optionContent: {
    padding: 16,
  },
  optionTitle: {
    fontSize: 18,
    color: designColors.textPrimary,
    lineHeight: 23,
    fontFamily: 'System',
    fontWeight: '700',
    marginBottom: 4,
  },
  optionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  optionDescription: {
    fontSize: 16,
    color: designColors.textSecondary,
    lineHeight: 24,
    fontFamily: 'System',
    flex: 1,
  },
  startButton: {
    backgroundColor: designColors.yellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 84,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 14,
    color: designColors.background,
    lineHeight: 21,
    fontFamily: 'System',
    fontWeight: '500',
  },
  skipContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  skipButtonText: {
    fontSize: 14,
    color: designColors.textPrimary,
    lineHeight: 21,
    fontFamily: 'System',
    fontWeight: '700',
  },
  breathingTitleContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  breathingTitle: {
    fontSize: 24,
    color: designColors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: 'System',
    fontWeight: '700',
  },
  timerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    color: designColors.yellow,
    textAlign: 'center',
    lineHeight: 58,
    fontFamily: 'System',
    fontWeight: '700',
    marginBottom: 16,
  },
  cyclesText: {
    fontSize: 16,
    color: designColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'System',
  },
  visualGuideContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  visualGuideCard: {
    backgroundColor: designColors.cardBackground,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noseContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  noseEmoji: {
    fontSize: 60,
  },
  nostrilIndicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  rightIndicator: {
    top: -8,
    right: -8,
  },
  leftIndicator: {
    top: -8,
    left: -8,
  },
  instructionText: {
    fontSize: 18,
    color: designColors.textPrimary,
    textAlign: 'center',
    lineHeight: 27,
    fontFamily: 'System',
    fontWeight: '500',
    marginBottom: 16,
  },
  actionIndicatorContainer: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'System',
  },
  instructionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: designColors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    fontFamily: 'System',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  primaryButton: {
    backgroundColor: designColors.yellow,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    color: designColors.background,
    lineHeight: 24,
    fontFamily: 'System',
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: designColors.cardBackground,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: designColors.textPrimary,
    lineHeight: 24,
    fontFamily: 'System',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 20,
  },
  completionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 32,
    color: designColors.yellow,
    textAlign: 'center',
    lineHeight: 38,
    fontFamily: 'System',
    fontWeight: '700',
    marginBottom: 16,
  },
  completionText: {
    fontSize: 18,
    color: designColors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'System',
    marginBottom: 8,
  },
  completionSubtext: {
    fontSize: 16,
    color: designColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'System',
    marginBottom: 32,
  },
  completionButton: {
    backgroundColor: designColors.yellow,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionButtonText: {
    fontSize: 18,
    color: designColors.background,
    lineHeight: 24,
    fontFamily: 'System',
    fontWeight: '600',
  },
  testContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: designColors.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  testButtonText: {
    fontSize: 14,
    color: designColors.textPrimary,
    fontFamily: 'System',
    fontWeight: '500',
  },
  testResult: {
    fontSize: 12,
    color: designColors.textSecondary,
    fontFamily: 'System',
    textAlign: 'center',
  },
}); 