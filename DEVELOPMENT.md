# TARU Development Guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Testing
npm test
npm run test:watch
```

## 🛠 New Features & Improvements

### **Performance Optimizations**

#### **1. Performance Utilities (`lib/performance.ts`)**
```typescript
import { debounce, throttle, useExpensiveComputation } from '../lib/performance';

// Debounce expensive operations
const debouncedSearch = debounce(searchFunction, 300);

// Throttle frequent events
const throttledScroll = throttle(handleScroll, 16); // 60fps

// Memoize expensive computations
const expensiveValue = useExpensiveComputation(() => {
  return heavyCalculation(data);
}, [data]);
```

#### **2. Bundle Size Optimization**
- **Metro Config**: Optimized for tree shaking and Hermes
- **Asset Handling**: Improved image and font loading
- **Code Splitting**: Lazy loading for heavy components

#### **3. Hermes Engine**
- Enabled for both iOS and Android
- Better memory usage and startup performance
- Improved JavaScript execution speed

### **Enhanced Accessibility**

#### **1. Accessibility Utilities (`lib/accessibility.ts`)**
```typescript
import { accessibility, useAccessibilityAnnouncements } from '../lib/accessibility';

// Screen reader announcements
const { announceSuccess, announceError } = useAccessibilityAnnouncements();

// Pre-built accessibility props
<TouchableOpacity {...accessibility.props.button("Start Reset", "Begin wellness session")}>
  Start Reset
</TouchableOpacity>

// Progress indicators
<View {...accessibility.props.progress(current, total, "Session progress")} />
```

#### **2. Focus Management**
```typescript
import { useFocusList } from '../lib/accessibility';

const { focusedIndex, focusNext, focusPrevious } = useFocusList(items);
```

### **Error Handling**

#### **1. Error Boundary**
```typescript
import { ErrorBoundary } from '../lib/errorBoundary';

<ErrorBoundary onError={(error, errorInfo) => {
  // Log to analytics
  console.error('App error:', error);
}}>
  <YourComponent />
</ErrorBoundary>
```

#### **2. Error Hooks**
```typescript
import { useErrorHandler } from '../lib/errorBoundary';

const { handleError } = useErrorHandler();

try {
  // Risky operation
} catch (error) {
  handleError(error, 'ComponentName');
}
```

## 📱 Component Best Practices

### **Performance**
```typescript
// ✅ Good: Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useExpensiveComputation(() => processData(data), [data]);
  return <View>{processedData}</View>;
});

// ✅ Good: Stable callbacks
const handlePress = useStableCallback(() => {
  // Handle press
});

// ✅ Good: Lazy loading
const { Component: HeavyComponent, loading } = useLazyComponent(
  () => import('./HeavyComponent'),
  <LoadingSpinner />
);
```

### **Accessibility**
```typescript
// ✅ Good: Proper accessibility labels
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Start breathing exercise"
  accessibilityHint="Begin a 2-minute breathing session"
  accessibilityRole="button"
>
  Start Breathing
</TouchableOpacity>

// ✅ Good: Live regions for dynamic content
<Text accessibilityLiveRegion="polite">
  {currentStatus}
</Text>
```

### **Error Handling**
```typescript
// ✅ Good: Graceful error handling
const [data, setData] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
  fetchData()
    .then(setData)
    .catch((error) => {
      setError(error);
      handleError(error, 'DataFetching');
    });
}, []);
```

## 🧪 Testing

### **Unit Tests**
```typescript
// Example test for performance utilities
import { debounce } from '../lib/performance';

describe('debounce', () => {
  it('should debounce function calls', (done) => {
    let callCount = 0;
    const debouncedFn = debounce(() => callCount++, 100);
    
    debouncedFn();
    debouncedFn();
    debouncedFn();
    
    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 150);
  });
});
```

### **Component Tests**
```typescript
// Example test for accessibility
import { render, fireEvent } from '@testing-library/react-native';
import { accessibility } from '../lib/accessibility';

test('button has proper accessibility props', () => {
  const { getByRole } = render(
    <TouchableOpacity {...accessibility.props.button("Test", "Test hint")}>
      Test
    </TouchableOpacity>
  );
  
  const button = getByRole('button');
  expect(button).toHaveAccessibilityLabel('Test');
  expect(button).toHaveAccessibilityHint('Test hint');
});
```

## 📊 Performance Monitoring

### **Render Performance**
```typescript
import { useRenderTimer } from '../lib/performance';

const MyComponent = () => {
  useRenderTimer('MyComponent');
  // Component logic
};
```

### **Bundle Analysis**
```bash
# Analyze bundle size
npm run analyze
```

## 🔧 Development Tools

### **ESLint Configuration**
- TypeScript-aware linting
- React Hooks rules
- Performance best practices
- Accessibility guidelines

### **TypeScript Configuration**
- Strict type checking
- No implicit any
- Proper module resolution

### **Metro Configuration**
- Optimized for performance
- Tree shaking enabled
- Asset optimization

## 🚀 Deployment Optimizations

### **Production Build**
```bash
# iOS
npm run build:ios

# Android
npm run build:android
```

### **Bundle Optimization**
- Hermes engine enabled
- Tree shaking active
- Asset compression
- Code splitting

## 📈 Analytics & Monitoring

### **Performance Tracking**
- Render time monitoring
- Bundle size tracking
- Error boundary logging
- Accessibility usage

### **User Experience**
- Screen reader usage
- Error recovery rates
- Performance metrics
- Accessibility compliance

## 🎯 Quality Gates

### **Pre-commit Checks**
- TypeScript compilation
- ESLint validation
- Test suite passing
- Bundle size limits

### **Accessibility Standards**
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast ratios

### **Performance Targets**
- < 3s to first interaction
- < 16ms render times
- < 2MB bundle size
- 60fps animations

---

**🎉 Your TARU app is now optimized for performance, accessibility, and maintainability!**
