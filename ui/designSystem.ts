// TARU Design System
// Award-level craft with ruthless simplicity

export const colors = {
  // Brand Colors
  ink: '#0B0B0A',        // Primary background
  sand: '#EAE6DF',       // Card backgrounds
  aqua: '#79E2D0',       // Primary action
  salmon: '#FF8A7A',     // Secondary action
  amber: '#FFC560',      // Warning/attention
  jade: '#29CC8B',       // Success/primary button
  
  // Semantic Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Overlays
  glass: 'rgba(255, 255, 255, 0.06)',
  
  // Accessibility
  textPrimary: '#0B0B0A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  background: '#0B0B0A',
  surface: '#EAE6DF',
} as const;

export const typography = {
  // Display
  displayLarge: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  displayMedium: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  displaySmall: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  
  // Body
  bodyLarge: {
    fontSize: 17,
    lineHeight: 24, // 1.4 ratio
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 21, // 1.4 ratio
    fontWeight: '400' as const,
  },
  
  // Caption
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const shadows = {
  soft: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const animation = {
  duration: {
    fast: 180,
    normal: 240,
    slow: 300,
  },
  easing: 'ease-in-out',
} as const;

export const layout = {
  // Minimum touch target size for accessibility
  minTouchTarget: 44,
  
  // Safe area insets (will be dynamic on device)
  safeArea: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
} as const;

// Utility functions
export const getColor = (colorKey: keyof typeof colors) => colors[colorKey];
export const getSpacing = (spacingKey: keyof typeof spacing) => spacing[spacingKey];
export const getBorderRadius = (radiusKey: keyof typeof borderRadius) => borderRadius[radiusKey]; 