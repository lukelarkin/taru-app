import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../../ui/designSystem';
import { Icon } from '../../ui/Icon';

export default function TabsLayout() {
  return (
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
        name="resets"
        options={{
          title: 'Resets',
          tabBarIcon: ({ color, size }) => (
            <Icon name="refresh" size={size} color="textPrimary" />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'Athena',
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubble" size={size} color="textPrimary" />
          ),
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          title: 'Program',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color="textPrimary" />
          ),
        }}
      />
      <Tabs.Screen
        name="block"
        options={{
          title: 'Block',
          tabBarIcon: ({ color, size }) => (
            <Icon name="shield" size={size} color="textPrimary" />
          ),
        }}
      />
      <Tabs.Screen
        name="diagnostics"
        options={{
          title: 'Debug',
          tabBarIcon: ({ color, size }) => (
            <Icon name="bug" size={size} color="textPrimary" />
          ),
        }}
      />
    </Tabs>
  );
}
