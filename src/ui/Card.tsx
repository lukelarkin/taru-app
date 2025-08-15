// src/ui/Card.tsx
import React from "react";
import { View, ViewProps } from "react-native";
import { taruRadii, taruShadow } from "../theme/taruTheme";
import { useTaruTheme } from "../theme/TaruProvider";

export const Card: React.FC<ViewProps & { glow?: "pink"|"purple"|"blue"|"cyan"|"orange" }> = ({ glow, style, ...rest }) => {
  const { colors } = useTaruTheme();
  const glowMap = {
    pink: colors.neonPink, purple: colors.neonPurple, blue: colors.neonBlue, cyan: colors.neonCyan, orange: colors.neonOrange
  } as const;
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: taruRadii.lg,
          borderWidth: 1,
          borderColor: colors.line,
          padding: 16,
          ...taruShadow.card,
          ...(glow ? taruShadow.glow(glowMap[glow]) : null),
        },
        style,
      ]}
      {...rest}
    />
  );
};
