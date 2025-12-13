// src/components/CategoriesHeader.tsx  (chỉnh để sát ảnh)
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
      <Pressable onPress={onBack} style={s.backBtn} hitSlop={10}>
        <Ionicons name="chevron-back" size={18} color="#fff" />
      </Pressable>

      <Text style={s.title}>{title}</Text>

      <View style={s.right}>
        <Pressable onPress={onSearch} style={s.iconBtn} hitSlop={10}>
          <Ionicons name="search" size={16} color={COLORS.CORAL} />
        </Pressable>
        <Pressable onPress={onBell} style={s.iconBtn} hitSlop={10}>
          <Ionicons name="notifications-outline" size={16} color={COLORS.CORAL} />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    height: 74,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.CORAL,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.CORAL,
  },
  right: { flexDirection: "row", gap: 10 },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: COLORS.CORAL,
    alignItems: "center",
    justifyContent: "center",
  },
});
