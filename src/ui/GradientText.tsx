// src/ui/GradientText.tsx
import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { Text, TextProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { taruGradients } from "../theme/taruTheme";

export const GradientText: React.FC<TextProps> = ({ style, children, ...rest }) => {
  return (
    <MaskedView maskElement={<Text {...rest} style={[style]}>{children}</Text>}>
      <LinearGradient colors={taruGradients.phoenix} start={{x:0,y:0.5}} end={{x:1,y:0.5}} style={{ flex: 1 }} />
    </MaskedView>
  );
};
