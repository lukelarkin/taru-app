export default {
  expo: {
    name: "TARU",
    slug: "taru",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#171712"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    // Performance optimizations
    jsEngine: "hermes",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.taru.app",
      // Required for push; fine for local too
      entitlements: { "aps-environment": "development" },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#171712"
      },
      package: "com.taru.app",
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    scheme: "taru",
    plugins: [
      "expo-router",
      "expo-sqlite",
      "expo-notifications"
    ],
    extra: {
      AI_URL: process.env.EXPO_PUBLIC_AI_URL,
      TOOLS_ENABLED: process.env.EXPO_PUBLIC_TOOLS_ENABLED ?? "true",
      EXPO_PUBLIC_INGEST_ENDPOINT: process.env.EXPO_PUBLIC_INGEST_ENDPOINT,
      EXPO_PUBLIC_INGEST_TOKEN: process.env.EXPO_PUBLIC_INGEST_TOKEN
    }
  }
} 