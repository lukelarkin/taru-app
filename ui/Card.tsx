import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './designSystem';

export type CardVariant = 'surface' | 'glass';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        styles[variant],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.soft,
  },
  
  surface: {
    backgroundColor: colors.sand,
  },
  
  glass: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
}); 