import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from "expo-notifications";
import { colors } from '../ui/designSystem';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, 
    shouldPlaySound: false, 
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={colors.ink} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="intro" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="eft" />
          <Stack.Screen name="reset" />
          <Stack.Screen name="session" />
        </Stack>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
} 