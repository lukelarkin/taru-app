import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TaruLogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function TaruLogo({ size = 'medium', color = 'white' }: TaruLogoProps) {
  const getSize = () => {
    switch (size) {
      case 'small': return { fontSize: 24, letterSpacing: 2 };
      case 'large': return { fontSize: 48, letterSpacing: 4 };
      default: return { fontSize: 32, letterSpacing: 3 };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.logo, getSize(), { color }]}>
        TARU
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    fontWeight: '700',
    fontFamily: 'System',
  },
});
