import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from "expo-notifications";
import { colors } from '../ui/designSystem';
import { Icon } from '../ui/Icon';
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
        <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.ink,
            borderTopColor: colors.glass,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 88,
          },
          tabBarActiveTintColor: colors.jade,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color="textPrimary" />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/resets"
          options={{
            title: 'Resets',
            tabBarIcon: ({ color, size }) => (
              <Icon name="refresh" size={size} color="textPrimary" />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/ai"
          options={{
            title: 'Athena',
            tabBarIcon: ({ color, size }) => (
              <Icon name="chatbubble" size={size} color="textPrimary" />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/program"
          options={{
            title: 'Program',
            tabBarIcon: ({ color, size }) => (
              <Icon name="book" size={size} color="textPrimary" />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/block"
          options={{
            title: 'Block',
            tabBarIcon: ({ color, size }) => (
              <Icon name="shield" size={size} color="textPrimary" />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/diagnostics"
          options={{
            title: 'Debug',
            tabBarIcon: ({ color, size }) => (
              <Icon name="bug" size={size} color="textPrimary" />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
    </ErrorBoundary>
  );
} 