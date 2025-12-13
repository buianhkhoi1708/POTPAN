// src/components/CategoriesHeader.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../styles/color";

type Props = {
  title: string;
  onBack?: () => void;
  onSearch?: () => void;
  onBell?: () => void;
};

export default function CategoriesHeader({ title, onBack, onSearch, onBell }: Props) {
  return (
    <View style={s.header}>
      <Pressable
        onPress={onBack}
        style={s.headerLeftBtn}
        android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
      >
        <Ionicons name="chevron-back" size={20} color="#fff" />
      </Pressable>

      <Text style={s.headerTitle}>{title}</Text>

      <View style={s.headerRight}>
        <Pressable onPress={onSearch} style={s.headerIconBtn}>
          <Ionicons name="search" size={18} color={COLORS.CORAL} />
        </Pressable>
        <Pressable onPress={onBell} style={s.headerIconBtn}>
          <Ionicons name="notifications-outline" size={18} color={COLORS.CORAL} />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeftBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.CORAL,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.CORAL,
    letterSpacing: 0.2,
  },
  headerRight: { flexDirection: "row", gap: 10 },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
});
