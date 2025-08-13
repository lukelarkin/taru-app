import React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './designSystem';

export type IconName = keyof typeof Ionicons.glyphMap;
export type IconSize = 'small' | 'medium' | 'large';

export interface IconProps {
  name: IconName;
  size?: IconSize | number;
  color?: keyof typeof colors;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'medium',
  color = 'textPrimary',
  style,
}) => {
  const iconSize = typeof size === 'number' ? size : iconSizes[size];
  
  return (
    <Ionicons
      name={name}
      size={iconSize}
      color={colors[color]}
      style={style}
    />
  );
};

const iconSizes = {
  small: 16,
  medium: 24,
  large: 32,
} as const; 