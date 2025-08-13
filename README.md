# TARU - Digital Wellness App

TARU is an iOS wellness app that delivers just-in-time relief from digital cravings. Built with award-level craft and ruthless simplicity.

## 🎯 North Star Metrics

- **≤ 3 taps to relief** - Quick access to wellness exercises
- **≤ 3s to first interaction** - Instant app responsiveness  
- **≤ 90s to complete a reset** - Efficient wellness routines

## 🎨 Design System

### Colors
- **Ink** `#0B0B0A` - Primary background
- **Sand** `#EAE6DF` - Card backgrounds
- **Aqua** `#79E2D0` - Primary action
- **Salmon** `#FF8A7A` - Secondary action
- **Amber** `#FFC560` - Warning/attention
- **Jade** `#29CC8B` - Success/primary button

### Typography
- **Display**: 34/28/22px with tight line-height
- **Body**: 17/15px with 1.4 line-height
- **Caption**: 13px for secondary text

### Spacing & Layout
- **Spacing scale**: 4, 8, 12, 16, 20, 24, 32px
- **Border radius**: sm(8), md(12), lg(16), xl(24)
- **Minimum touch target**: 44pt for accessibility

## 🚀 Features

### 1. Resets Hub
Quick-start tiles for wellness exercises:
- **Alternate Nostril** (2min) - Balance nervous system
- **Physiologic Sigh** (1min) - Reset breathing pattern
- **EFT Tapping** (3min) - Release emotional tension
- **Box Breathing** (1.5min) - Find your center
- **Shake-off** (45s) - Release physical tension
- **Cold Splash** (30s) - Activate your system

**Big Jade Button**: One-tap access to most recent exercise

### 2. AI Recovery Agent
Chat interface with persona-specific support for:
- Resentment, Shame, Craving, Anger
- Grief, Denial, Self-deception, Lust

Each persona provides tailored, compassionate guidance.

### 3. Block & Limit
UI for setting healthy boundaries:
- **Time-based limits** - Daily usage restrictions
- **Keyword triggers** - Content filtering
- **Manual pause** - Instant 3-minute breaks
- **Pause & Reset** - Immediate intervention

## 🛠 Tech Stack

- **Framework**: Expo + React Native
- **Navigation**: Expo Router
- **Language**: TypeScript
- **State Management**: Zustand (light local state)
- **Icons**: @expo/vector-icons
- **Haptics**: expo-haptics
- **UI Components**: Custom design system

## 📱 Installation & Setup

1. **Prerequisites**
   ```bash
   # Install Node.js (if not already installed)
   brew install node
   
   # Install Expo CLI
   npm install -g @expo/cli
   ```

2. **Clone & Install**
   ```bash
   cd TARU
   npm install
   ```

3. **Run the App**
   ```bash
   # Start development server
   npm start
   
   # Run on iOS simulator
   npm run ios
   
   # Run on Android emulator
   npm run android
   ```

## 🏗 Project Structure

```
TARU/
├── app/
│   ├── (tabs)/
│   │   ├── resets.tsx      # Main wellness exercises
│   │   ├── ai.tsx          # AI recovery chat
│   │   └── block.tsx       # Block & limit settings
│   └── _layout.tsx         # Tab navigation
├── ui/
│   ├── designSystem.ts     # Design tokens
│   ├── Text.tsx           # Typography component
│   ├── Button.tsx         # Interactive buttons
│   ├── Card.tsx           # Surface components
│   └── Icon.tsx           # Icon wrapper
├── lib/
│   ├── haptics.ts         # Haptic feedback utilities
│   └── format.ts          # Formatting utilities
└── features/              # Feature-specific components
    ├── resets/
    ├── ai/
    └── block/
```

## 🎯 MVP Scope (Launch Ready)

### ✅ Completed
- 3-tab navigation with large labels and icons
- Resets Hub with 6 wellness exercises
- "Big red button" (jade/aqua) for quick start
- AI Recovery with 8 persona types
- Block & Limit UI with triggers and time limits
- Complete design system implementation
- Haptic feedback on all interactions
- Accessibility features (VoiceOver, Dynamic Type)

### 🔄 TODO (Post-Launch)
- Backend API integration for AI responses
- Device-wide MDM for blocking
- User authentication and data persistence
- Analytics and usage tracking
- Push notifications for reminders

## 🎨 Design Principles

- **Calm, competent, non-judgmental** tone
- **Short verbs, no shaming** in copy
- **Soft elevation** with iOS-equivalent shadows
- **180-240ms** ease-in-out animations
- **Micro-interactions** with haptic feedback
- **Dynamic Type** support (L-XXL)
- **Color contrast** ≥ 4.5:1 for accessibility

## 🚀 Performance

- **Instant first paint** - No blocking operations
- **Lazy loading** for heavy components
- **Optimized animations** with React Native Reanimated
- **Efficient state management** with Zustand

## 📋 Quality Gates

- ✅ 3-tab layout with clear navigation
- ✅ "Big red button" for immediate access
- ✅ Empty states are inspirational and actionable
- ✅ All components use shared design tokens
- ✅ VoiceOver reads steps clearly
- ✅ Focus order makes sense
- ✅ Dynamic Type L-XXL tested

## 🎯 Content Safety

- No explicit content included
- Supportive and brief copy throughout
- Persona prompts are therapeutic and non-triggering
- Wellness-focused language only

## 🧠 AI-Powered Personalization with Pinecone

TARU uses **Pinecone's vector database** to provide personalized wellness recommendations based on user behavior patterns.

### **How It Works:**

#### **1. Behavioral Tracking**
- **User state vectors**: Emotional state, time of day, location, device usage
- **Intervention vectors**: Reset type, AI response, duration, timing
- **Outcome vectors**: Success rate, behavior change, craving reduction

#### **2. Pattern Recognition**
- **DAG structure**: Tracks user behavior → intervention → outcome cycles
- **Similarity matching**: Finds users with similar patterns
- **Success prediction**: Recommends interventions based on historical success

#### **3. Personalized Recommendations**
- **Dynamic reset suggestions**: Based on what works for similar users
- **Optimal timing**: When users are most receptive to interventions
- **Progressive difficulty**: Adapts challenge level as users improve

### **Setup Pinecone Integration:**

1. **Get Pinecone API Key**
   ```bash
   # Sign up at https://www.pinecone.io/
   # Create a new index named "taru-user-behavior"
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Add your Pinecone API key to .env
   ```

3. **Initialize Index**
   ```bash
   # The app will automatically create the index structure
   # Vector dimensions: 128 (behavior), 64 (intervention), 32 (outcome)
   ```

### **Data Privacy:**
- **Local user IDs**: No personal information stored
- **Anonymous patterns**: Only behavioral patterns, not personal data
- **Opt-in analytics**: Users can disable tracking
- **GDPR compliant**: Full data deletion support

### **Research Potential:**
- **Clinical studies**: Partner with research institutions
- **Behavioral science**: Contribute to digital wellness research
- **Academic publications**: Publish findings on intervention effectiveness
- **Industry insights**: Understand digital craving patterns

---

**TARU** - Your digital wellness companion. Built with care for mindful technology use. 