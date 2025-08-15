// src/ui/Input.tsx
import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { useTaruTheme } from "../theme/TaruProvider";
import { taruRadii } from "../theme/taruTheme";

export const Input: React.FC<TextInputProps> = (props) => {
  const { colors, fonts } = useTaruTheme();
  return (
    <TextInput
      placeholderTextColor={colors.textMuted}
      {...props}
      style={[
        {
          backgroundColor: colors.surfaceAlt,
          borderRadius: taruRadii.md,
          borderWidth: 1,
          borderColor: colors.line,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: colors.textPrimary,
          fontFamily: fonts.ui,
          fontSize: 16,
        },
        props.style as any,
      ]}
    />
  );
};
