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
  extra: {
    eas: {
      projectId: 'f8be3a4b-9134-4eef-8329-adf996584305',
    },
  },
  plugins: [
    'expo-dev-client',
    // './plugins/with-taru-shield', // Temporarily disabled for Expo Go testing
    'expo-font',
  ],
};

export default config; 