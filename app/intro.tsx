import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Image, Animated, Platform, AccessibilityInfo } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

const INTRO_LEN_MS = 8000;        // your Veo 3 clip (~8s)
const SKIP_AVAILABLE_MS = 3000;   // Apple-friendly skip after 3s

export default function IntroVideo() {
  const videoRef = useRef<Video>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Watermark/logo anim
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.94)).current;

  // Global fade-to-black at the end
  const blackout = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);

    // Staggered logo intro
    const runLogoAnim = () => {
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: reducedMotion ? 0 : 900, useNativeDriver: true }),
        Animated.timing(logoScale, { toValue: 1, duration: reducedMotion ? 0 : 900, useNativeDriver: true }),
      ]).start();
    };
    const t = setTimeout(runLogoAnim, 450); // let video establish for a beat
    return () => clearTimeout(t);
  }, [logoOpacity, logoScale, reducedMotion]);

  const handleEnd = async () => {
    // Fade to black for a classy handoff
    await new Promise<void>((resolve) => {
      Animated.timing(blackout, { toValue: 1, duration: reducedMotion ? 0 : 300, useNativeDriver: true }).start(() => resolve());
    });
    // Navigate to onboarding
    router.replace('/onboarding');
  };

  return (
    <View style={styles.container} accessible accessibilityLabel="TARU intro video">
      {!videoError ? (
        <Video
        ref={videoRef}
        source={require('../assets/Cinematic_Logo_Animation_Generation.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        isMuted={false}
        onError={(error) => {
          console.warn('Video error:', error);
          setVideoError(true);
        }}
        onPlaybackStatusUpdate={(status) => {
          if ('positionMillis' in status) {
            if (!showSkip && status.positionMillis > SKIP_AVAILABLE_MS) setShowSkip(true);
            // Soft pre-fade before the very end
            if (!reducedMotion && status.positionMillis > INTRO_LEN_MS - 600) {
              blackout.setValue((INTRO_LEN_MS - status.positionMillis) / 600);
            }
          }
          if ('didJustFinish' in status && status.didJustFinish) handleEnd();
        }}
      />
      ) : (
        <View style={styles.fallbackContainer}>
          <Image
            source={require('../assets/brand/taru-logo.png')}
            style={styles.fallbackLogo}
            accessible
            accessibilityLabel="TARU logo"
          />
          <Text style={styles.fallbackText}>Digital Drugs. Real Recovery.</Text>
        </View>
      )}

      {/* Watermark / brand lockup */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.brandWrap,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('../assets/brand/taru-logo.png')}
          style={styles.logo}
          accessible
          accessibilityLabel="TARU logo"
        />
        <Text style={styles.tagline} accessibilityRole="text">
          Digital Drugs. Real Recovery.
        </Text>
      </Animated.View>

      {/* Skip CTA */}
      {showSkip && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            if (Platform.OS === 'ios') Haptics.selectionAsync();
            handleEnd();
          }}
          accessibilityRole="button"
          accessibilityLabel="Skip intro"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Fade to black overlay */}
      <Animated.View pointerEvents="none" style={[styles.blackout, { opacity: blackout }]} />
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  video: { 
    width, 
    height, 
    position: 'absolute',
    backgroundColor: 'black',
  },
  brandWrap: {
    position: 'absolute',
    left: 24,
    bottom: 48,
    right: 24,
    alignItems: 'flex-start',
  },
  logo: { width: 160, height: 48, resizeMode: 'contain', marginBottom: 8 },
  tagline: { color: 'rgba(255,255,255,0.92)', fontSize: 16, letterSpacing: 0.4 },
  skipButton: {
    position: 'absolute',
    top: 52,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  skipText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  blackout: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'black' },
  fallbackContainer: { 
    flex: 1, 
    backgroundColor: 'black', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 24,
  },
  fallbackLogo: { 
    width: 200, 
    height: 60, 
    resizeMode: 'contain', 
    marginBottom: 16 
  },
  fallbackText: { 
    color: 'rgba(255,255,255,0.92)', 
    fontSize: 18, 
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});
