import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { InteractionManager } from 'react-native';

/**
 * Debounce function calls to improve performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function calls to limit execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Hook for expensive computations that should be memoized
 */
export function useExpensiveComputation<T>(
  computation: () => T,
  dependencies: any[]
): T {
  return useMemo(computation, dependencies);
}

/**
 * Hook for stable callback references
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  return useCallback(callback, []);
}

/**
 * Hook for running effects after interactions complete
 */
export function useAfterInteraction(effect: () => void, deps: any[] = []) {
  const effectRef = useRef(effect);
  effectRef.current = effect;

  useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      effectRef.current();
    });
  }, deps);
}

/**
 * Hook for measuring component render performance
 */
export function useRenderTimer(componentName: string) {
  const startTime = useRef(Date.now());
  
  useCallback(() => {
    const renderTime = Date.now() - startTime.current;
    if (__DEV__ && renderTime > 16) { // 16ms = 60fps threshold
      console.warn(`⚠️ Slow render in ${componentName}: ${renderTime}ms`);
    }
    startTime.current = Date.now();
  }, [componentName]);
}

/**
 * Hook for lazy loading components
 */
export function useLazyComponent<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: T
) {
  const [Component, setComponent] = useState<T | null>(fallback || null);
  const [loading, setLoading] = useState(!fallback);

  useEffect(() => {
    if (!Component) {
      setLoading(true);
      importFn()
        .then((module) => {
          setComponent(() => module.default);
        })
        .catch((error) => {
          console.error('Failed to load lazy component:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [Component, importFn]);

  return { Component, loading };
}

/**
 * Hook for image preloading
 */
export function useImagePreload(imageUrls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImages = async () => {
      const promises = imageUrls.map((url) => {
        return new Promise<string>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(url);
          image.onerror = () => reject(url);
          image.src = url;
        });
      });

      try {
        const loadedUrls = await Promise.all(promises);
        setLoadedImages(new Set(loadedUrls));
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    preloadImages();
  }, [imageUrls]);

  return loadedImages;
}
