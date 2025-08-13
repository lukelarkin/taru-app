import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../ui/designSystem';
import { Icon } from '../ui/Icon';

export default function RootLayout() {
  return (
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
            title: 'AI Recovery',
            tabBarIcon: ({ color, size }) => (
              <Icon name="chatbubble" size={size} color="textPrimary" />
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
      </Tabs>
    </SafeAreaProvider>
  );
} 