import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../ui/designSystem';
import { haptics } from './haptics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to analytics or error reporting service
    this.props.onError?.(error, errorInfo);
    
    // Provide haptic feedback for error
    haptics.error();
  }

  handleRetry = () => {
    haptics.light();
    this.setState({ hasError: false, error: undefined });
  };

  handleReport = () => {
    haptics.light();
    // TODO: Implement error reporting
    console.log('Error report requested for:', this.state.error);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry, but something unexpected happened. Please try again.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Info:</Text>
                <Text style={styles.debugText}>
                  {this.state.error.message}
                </Text>
                <Text style={styles.debugText}>
                  {this.state.error.stack}
                </Text>
              </View>
            )}
            
            <View style={styles.actions}>
              <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.reportButton} onPress={this.handleReport}>
                <Text style={styles.reportButtonText}>Report Issue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  content: {
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    ...typography.displayMedium,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  message: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.large,
    lineHeight: 24,
  },
  debugContainer: {
    backgroundColor: colors.glass,
    padding: spacing.medium,
    borderRadius: 12,
    marginBottom: spacing.large,
    width: '100%',
  },
  debugTitle: {
    ...typography.bodyMedium,
    color: colors.amber,
    fontWeight: '600',
    marginBottom: spacing.small,
  },
  debugText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.medium,
  },
  retryButton: {
    backgroundColor: colors.jade,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
  },
  reportButton: {
    backgroundColor: colors.glass,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.textTertiary,
  },
  reportButtonText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

// Hook for functional components to catch errors
export function useErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    console.error(`Error in ${context || 'component'}:`, error);
    
    // Log to analytics
    // TODO: Implement error logging
    
    // Provide haptic feedback
    haptics.error();
  };

  return { handleError };
}
