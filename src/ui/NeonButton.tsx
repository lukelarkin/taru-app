// src/ui/NeonButton.tsx
import React from "react";
import { Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { taruGradients, taruRadii, taruShadow, taruOpacity } from "../theme/taruTheme";
import { useTaruTheme } from "../theme/TaruProvider";

type Props = { title: string; onPress?: () => void; disabled?: boolean; size?: "sm"|"md"|"lg" };

export const NeonButton: React.FC<Props> = ({ title, onPress, disabled, size="md" }) => {
  const { colors, fonts } = useTaruTheme();
  const height = size === "sm" ? 42 : size === "lg" ? 56 : 48;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ opacity: disabled ? taruOpacity.disabled : 1 }}>
      {({ pressed }) => (
        <LinearGradient
          colors={taruGradients.phoenix}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            height,
            borderRadius: taruRadii.pill,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.line,
            ...(taruShadow.glow(colors.neonMagenta, 24)),
            transform: [{ scale: pressed ? 0.99 : 1 }],
          }}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontFamily: fonts.weight.semibold,
              fontSize: size === "lg" ? 18 : 16,
              letterSpacing: 0.4,
            }}
          >
            {title}
          </Text>
        </LinearGradient>
      )}
    </Pressable>
  );
};
