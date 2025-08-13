import React from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  StyleSheet, 
  ViewStyle,
  ActivityIndicator 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, shadows, layout } from './designSystem';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'large' | 'medium' | 'small';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  style,
  children,
  onPress,
  disabled,
  ...props
}) => {
  const handlePress = (event: any) => {
    if (!disabled && !loading) {
      // Haptic feedback on press
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.(event);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? colors.white : colors.jade} 
          size="small" 
        />
      ) : (
        <Text
          variant={size === 'large' ? 'bodyLarge' : 'bodyMedium'}
          color={variant === 'primary' ? 'white' : 'textPrimary'}
          style={styles.buttonText}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    minHeight: layout.minTouchTarget,
    ...shadows.soft,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.jade,
  },
  secondary: {
    backgroundColor: colors.sand,
    borderWidth: 1,
    borderColor: colors.jade,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  large: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },
  medium: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  small: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  
  buttonText: {
    fontWeight: '600',
  },
}); 