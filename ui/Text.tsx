import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography, colors } from './designSystem';

export type TextVariant = 
  | 'displayLarge'
  | 'displayMedium' 
  | 'displaySmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'caption';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: keyof typeof colors;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'bodyMedium', 
  color = 'textPrimary',
  style,
  children,
  ...props 
}) => {
  return (
    <RNText
      style={[
        styles[variant],
        { color: colors[color] },
        style,
      ]}
      allowFontScaling={true}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  displayLarge: typography.displayLarge,
  displayMedium: typography.displayMedium,
  displaySmall: typography.displaySmall,
  bodyLarge: typography.bodyLarge,
  bodyMedium: typography.bodyMedium,
  caption: typography.caption,
}); 