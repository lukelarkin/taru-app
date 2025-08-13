import React from "react";
import { View, Text } from "react-native";

type Msg = { role: "user" | "assistant"; content: string };

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <View
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        backgroundColor: isUser ? "#1e293b" : "#0f172a",
        padding: 10, borderRadius: 12, marginVertical: 6, maxWidth: "90%"
      }}
      accessibilityRole="text"
      accessibilityLabel={`${isUser ? "You" : "Athena"} says: ${msg.content}`}
    >
      <Text style={{ color: "white", opacity: 0.6, marginBottom: 2 }}>
        {isUser ? "You" : "Athena"}
      </Text>
      <Text style={{ color: "white" }}>{msg.content}</Text>
    </View>
  );
}

export default React.memo(Bubble);
