import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

export default function QuickReplies({
  items, onPick
}: { items: string[]; onPick: (text: string)=>void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 6, gap: 8 }}>
      {items.map((t, i) => (
        <Pressable
          key={i}
          onPress={()=>onPick(t)}
          style={({pressed})=>[
            { paddingVertical:8, paddingHorizontal:12, borderRadius:16, backgroundColor:"#121210", borderWidth:1, borderColor:"#23231e" },
            pressed && { opacity: 0.9, transform:[{ scale:0.98 }]}
          ]}
          accessibilityRole="button"
          accessibilityLabel={t}
        >
          <Text style={{ color: "rgba(255,255,255,0.85)" }}>{t}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
