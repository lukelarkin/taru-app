// src/ui/Screen.tsx
import React from "react";
import { View, ViewProps } from "react-native";
import { useTaruTheme } from "../theme/TaruProvider";

export const Screen: React.FC<ViewProps & { padded?: boolean }> = ({ padded = true, style, ...rest }) => {
  const { colors } = useTaruTheme();
  return (
    <View
      style={[{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: padded ? 16 : 0, paddingTop: padded ? 12 : 0 }, style]}
      {...rest}
    />
  );
};
