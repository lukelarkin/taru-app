# TARU - Therapeutic Addiction Recovery Utility

A comprehensive mobile app for addiction recovery that combines immediate crisis intervention with structured long-term healing programs.

## 🎯 **Core Features**

### **Quick Relief (JIT)**
- **Instant Resets**: Physiologic sigh, alternate nostril breathing, shake-off
- **Guided EFT Mini**: Therapeutic tapping with voice guidance and haptic feedback
- **AI Chat Scenarios**: 
  - Craving Manager (urge surfing)
  - IFS Micro (parts work)
  - Shame Repair (self-compassion)
  - Relapse Triage (normalization + planning)

### **60-Day Intensive Program**
- **Daily Plans**: 15-minute structured sessions (check-in → deep work → commitment)
- **Weekly Deep Sessions**: 30-minute guided IFS, shame repair, boundaries
- **Progress Tracking**: Local-first data with milestone celebrations
- **Always-On Safety**: Craving detection routes to crisis intervention

### **Supporting Tools**
- **Domain Blocking**: Screen Time API integration for device-level protection
- **Smart Notifications**: Contextual reminders and check-ins
- **Diagnostics**: Usage analytics and progress insights
- **Offline-First**: Core functionality works without internet

## 🏗️ **Architecture**

### **Frontend**
- **Expo & React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **Expo Router**: File-based navigation
- **AsyncStorage**: Local data persistence

### **Backend**
- **Cloudflare Workers**: Serverless AI processing
- **Pinecone**: Vector database for personalization
- **Tool Calling**: AI can trigger app functions (resets, blocking, logging)

### **AI System**
- **Multi-Scenario**: Specialized agents for different recovery needs
- **Therapeutic Language**: Ericksonian + Jungian approaches
- **Safety First**: Always routes cravings to crisis intervention
- **Human Prompts**: Quick reply chips for natural interaction

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+
- Expo CLI
- iOS Simulator or physical device
- Cloudflare account (for AI backend)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taru.git
   cd taru
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Run on device**
   - Scan QR code with Expo Go app
   - Or press 'i' for iOS simulator

### **Environment Variables**
```env
EXPO_PUBLIC_AI_URL=https://your-worker.your-subdomain.workers.dev
EXPO_PUBLIC_PINECONE_API_KEY=your-pinecone-key
EXPO_PUBLIC_PINECONE_INDEX_NAME=your-index-name
```

## 📱 **App Structure**

```
app/
├── (tabs)/
│   ├── ai.tsx          # AI chat with scenarios
│   ├── resets.tsx      # Breathing and regulation tools
│   ├── block.tsx       # Domain blocking interface
│   ├── program.tsx     # 60-day intensive program
│   └── diagnostics.tsx # Usage analytics
├── eft.tsx             # Guided EFT mini sessions
├── session.tsx         # Program step runner
├── reset.tsx           # Timer-based resets
└── _layout.tsx         # Root navigation

components/
├── ChatBubble.tsx      # AI chat message component
├── QuickReplies.tsx    # Human prompt chips
├── ErrorBoundary.tsx   # Global error handling
└── MessageBubble.tsx   # Legacy chat component

content/
├── curriculum.json     # 60-day program content
├── eft.json           # EFT guidance and scripts
├── quickPrompts.json  # AI chat quick replies
└── ragCards.json      # Knowledge base cards

lib/
├── aiClient.ts        # AI communication
├── resets.ts          # Reset timer management
├── programStore.ts    # Program progress tracking
├── store.ts           # Analytics and logging
├── toolDispatcher.ts  # AI tool calling
└── notifications.ts   # Push notification handling
```

## 🎨 **Design System**

### **Color Palette**
- **Background**: `#0B0B0A` (onyx)
- **Surface**: `#121210` (ink)
- **Athena Bubble**: `#0F172A` (deep slate)
- **User Bubble**: `#1E293B` (slate)
- **Accent**: `#22C55E` (jade)

### **Typography**
- **Primary**: System font with therapeutic readability
- **Hierarchy**: Clear visual distinction between sections
- **Accessibility**: High contrast, screen reader support

## 🔧 **Development**

### **Code Quality**
- **ESLint**: Code style and best practices
- **TypeScript**: Type safety throughout
- **Error Boundaries**: Graceful crash handling
- **Performance**: FlatList optimization, memoization

### **Testing**
```bash
npm run test          # Run tests
npm run lint          # Check code style
npm run type-check    # TypeScript validation
```

### **Building**
```bash
npm run build:ios     # iOS build
npm run build:android # Android build
```

## 🚀 **Deployment**

### **Backend (Cloudflare Workers)**
1. Deploy to Cloudflare Workers
2. Configure environment variables
3. Test AI endpoints

### **Mobile App**
1. Configure app signing
2. Build production binaries
3. Submit to App Store/Play Store

## 📊 **Analytics & Privacy**

### **Data Collection**
- **Local-First**: All sensitive data stays on device
- **Anonymous**: No personal identifiers in analytics
- **Opt-In**: User controls data sharing

### **Metrics Tracked**
- Reset completions and effectiveness
- AI chat usage patterns
- Program progress and engagement
- Safety interventions (blocking, crisis routing)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

For support and questions:
- Create an issue on GitHub
- Check the [documentation](docs/)
- Review [DEVELOPMENT.md](DEVELOPMENT.md) for technical details

## 🙏 **Acknowledgments**

- **Therapeutic Approaches**: IFS, EFT, Ericksonian therapy, Jungian psychology
- **Addiction Science**: Evidence-based interventions and relapse prevention
- **Mobile Development**: Expo team for the excellent development platform
- **AI Integration**: Cloudflare Workers for serverless processing

---

**TARU** - Empowering recovery through technology and therapeutic wisdom. 💚 