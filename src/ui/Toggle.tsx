// src/ui/Toggle.tsx
import React from "react";
import { Switch } from "react-native";
import { useTaruTheme } from "../theme/TaruProvider";

export const Toggle: React.FC<{ value: boolean; onValueChange: (v:boolean)=>void }> = ({ value, onValueChange }) => {
  const { colors } = useTaruTheme();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      thumbColor={value ? colors.textPrimary : "#9AA0B3"}
      trackColor={{ false: "#2A2C3D", true: colors.neonBlue }}
      ios_backgroundColor="#2A2C3D"
    />
  );
};
