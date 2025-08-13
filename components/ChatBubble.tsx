import React from "react";
import { View, Text } from "react-native";

type Msg = { role: "user"|"assistant"; content: string; ctaLabel?: string; onCtaPress?: ()=>void };

const Bubble = ({ msg }: { msg: Msg }) => {
  const isUser = msg.role === "user";
  return (
    <View style={{ marginVertical: 6, alignItems: isUser ? "flex-end" : "flex-start" }}>
      {!isUser && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E", marginLeft: 6, marginBottom: 4 }} />}
      <View
        style={{
          maxWidth: "88%",
          backgroundColor: isUser ? "#1E293B" : "#0F172A",
          padding: 12, borderRadius: 14
        }}
        accessible accessibilityRole="text"
        accessibilityLabel={`${isUser ? "You" : "Athena"} says: ${msg.content}`}
      >
        <Text style={{ color: "white" }}>{msg.content}</Text>
        {msg.ctaLabel && msg.onCtaPress ? (
          <Text
            onPress={msg.onCtaPress}
            style={{ marginTop: 8, color: "#22C55E", fontWeight: "600" }}
            accessibilityRole="button"
            accessibilityLabel={msg.ctaLabel}
          >
            {msg.ctaLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default React.memo(Bubble);
