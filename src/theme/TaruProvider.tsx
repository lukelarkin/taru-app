// src/theme/TaruProvider.tsx
import React, { createContext, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts, Sora_600SemiBold, Sora_700Bold, Sora_500Medium } from "@expo-google-fonts/sora";
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import { View, ActivityIndicator } from "react-native";
import { DefaultTheme, Theme } from "@react-navigation/native";
import { taruColors } from "./taruTheme";

type TaruTheme = {
  colors: typeof taruColors;
  fonts: {
    display: string;
    ui: string;
    weight: { regular: string; medium: string; semibold: string; bold: string };
  };
};

const ThemeContext = createContext<TaruTheme | undefined>(undefined);

export const useTaruTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTaruTheme must be used within <TaruProvider>");
  return ctx;
};

export const navTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: taruColors.neonBlue,
    background: taruColors.bg,
    card: taruColors.surface,
    text: taruColors.textPrimary,
    border: taruColors.line,
    notification: taruColors.neonMagenta,
  },
};

export const TaruProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loaded] = useFonts({
    Sora_500Medium, Sora_600SemiBold, Sora_700Bold,
    Inter_400Regular, Inter_500Medium,
  });

  if (!loaded) {
    return (
      <View style={{ flex:1, backgroundColor: taruColors.bg, alignItems:"center", justifyContent:"center" }}>
        <ActivityIndicator color={taruColors.neonBlue} />
      </View>
    );
  }

  const value: TaruTheme = {
    colors: taruColors,
    fonts: {
      display: "Sora_700Bold",
      ui: "Inter_400Regular",
      weight: {
        regular: "Inter_400Regular",
        medium: "Inter_500Medium",
        semibold: "Sora_600SemiBold",
        bold: "Sora_700Bold",
      },
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style="light" />
      {children}
    </ThemeContext.Provider>
  );
};
