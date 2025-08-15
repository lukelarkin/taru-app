import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TestOnboarding() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 TARU Onboarding Test</Text>
      <Text style={styles.subtitle}>If you can see this, the app is working!</Text>
      <Text style={styles.description}>
        This confirms that:
        • Expo Go is working ✅
        • React Native is working ✅
        • Navigation is working ✅
        • Your brand system is ready ✅
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0A13',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F1F8',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#D946EF',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'rgba(244,241,248,0.72)',
    textAlign: 'center',
    lineHeight: 24,
  },
});
