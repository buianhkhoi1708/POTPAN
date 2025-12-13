// src/components/TabIcon.tsx  (active giống ảnh)
import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../styles/color";

export default function TabIcon({
  focused,
  name,
}: {
  focused: boolean;
  name: any;
}) {
  if (focused) {
    return (
      <View style={s.active}>
        <Ionicons name={name} size={22} color={COLORS.CORAL} />
      </View>
    );
  }
  return <Ionicons name={name} size={22} color="#fff" />;
}

const s = StyleSheet.create({
  active: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
