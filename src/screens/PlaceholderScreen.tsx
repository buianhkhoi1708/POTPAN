// src/screens/PlaceholderScreen.tsx
import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { COLORS } from "../styles/color";

export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <SafeAreaView style={s.root}>
      <Text style={s.text}>{title}</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.BG,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "#111", fontSize: 16 },
});
