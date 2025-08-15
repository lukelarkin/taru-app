import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'TARU',
  slug: 'taru',
  scheme: 'taru',
  icon: './assets/brand/taru-logo.png',
  ios: {
    bundleIdentifier: 'com.taru.app',
    buildNumber: '1.0.0',
    supportsTablet: false,
  },
  plugins: [
    // 'expo-dev-client', // Temporarily disabled for Expo Go testing
    // './plugins/with-taru-shield', // Temporarily disabled for Expo Go testing
    'expo-font',
  ],
};

export default config; 