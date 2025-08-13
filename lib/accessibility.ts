import { AccessibilityInfo, findNodeHandle } from 'react-native';
import { useState, useCallback, useEffect } from 'react';

/**
 * Accessibility utilities for better screen reader support
 */
export const accessibility = {
  /**
   * Announce a message to screen readers
   */
  announce: (message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  },

  /**
   * Check if screen reader is enabled
   */
  isScreenReaderEnabled: async (): Promise<boolean> => {
    return await AccessibilityInfo.isScreenReaderEnabled();
  },

  /**
   * Set focus to a specific component
   */
  setFocus: (ref: any) => {
    if (ref?.current) {
      const node = findNodeHandle(ref.current);
      if (node) {
        AccessibilityInfo.setAccessibilityFocus(node);
      }
    }
  },

  /**
   * Generate accessibility labels for common patterns
   */
  labels: {
    button: (action: string, context?: string) => 
      `${action}${context ? ` ${context}` : ''}`,
    
    progress: (current: number, total: number, unit: string = '') => 
      `${current} of ${total}${unit ? ` ${unit}` : ''} completed`,
    
    timer: (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} remaining`;
    },

    status: (status: string, details?: string) => 
      `${status}${details ? `. ${details}` : ''}`,
  },

  /**
   * Common accessibility props for interactive elements
   */
  props: {
    button: (label: string, hint?: string) => ({
      accessible: true,
      accessibilityLabel: label,
      accessibilityHint: hint,
      accessibilityRole: 'button',
    }),

    link: (label: string, hint?: string) => ({
      accessible: true,
      accessibilityLabel: label,
      accessibilityHint: hint,
      accessibilityRole: 'link',
    }),

    image: (description: string) => ({
      accessible: true,
      accessibilityLabel: description,
      accessibilityRole: 'image',
    }),

    progress: (value: number, max: number, label: string) => ({
      accessible: true,
      accessibilityLabel: label,
      accessibilityValue: { min: 0, max, now: value },
      accessibilityRole: 'progressbar',
    }),

    switch: (value: boolean, label: string) => ({
      accessible: true,
      accessibilityLabel: label,
      accessibilityValue: { text: value ? 'on' : 'off' },
      accessibilityRole: 'switch',
    }),
  },
};

/**
 * Hook for managing focus in a list
 */
export function useFocusList<T>(items: T[]) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const focusNext = useCallback(() => {
    setFocusedIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const focusPrevious = useCallback(() => {
    setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const focusItem = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setFocusedIndex(index);
    }
  }, [items.length]);

  return {
    focusedIndex,
    focusNext,
    focusPrevious,
    focusItem,
  };
}

/**
 * Hook for managing accessibility announcements
 */
export function useAccessibilityAnnouncements() {
  const announce = useCallback((message: string, delay: number = 0) => {
    setTimeout(() => {
      accessibility.announce(message);
    }, delay);
  }, []);

  const announceSuccess = useCallback((action: string) => {
    announce(`${action} completed successfully`);
  }, [announce]);

  const announceError = useCallback((action: string) => {
    announce(`Failed to ${action}. Please try again`);
  }, [announce]);

  const announceProgress = useCallback((current: number, total: number) => {
    announce(accessibility.labels.progress(current, total));
  }, [announce]);

  return {
    announce,
    announceSuccess,
    announceError,
    announceProgress,
  };
}

/**
 * Hook for managing screen reader state
 */
export function useScreenReader() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkScreenReader = async () => {
      try {
        const enabled = await accessibility.isScreenReaderEnabled();
        if (mounted) {
          setIsEnabled(enabled);
        }
      } catch (error) {
        console.warn('Failed to check screen reader status:', error);
      }
    };

    checkScreenReader();

    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled) => {
        if (mounted) {
          setIsEnabled(enabled);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  return isEnabled;
}
