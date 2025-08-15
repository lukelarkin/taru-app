import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../../theme/tokens';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  style,
  padding = 16,
}) => {
  return (
    <View style={[styles.container, { padding }, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
});
