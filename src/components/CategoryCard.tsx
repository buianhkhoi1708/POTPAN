// src/components/CategoryCard.tsx
import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { COLORS } from "../styles/color";
import type { CategoryItem } from "../config/categoriesData";

type Props = {
  item: CategoryItem;
  width: number;
  onPress?: (item: CategoryItem) => void;
};

export default function CategoryCard({ item, width, onPress }: Props) {
  return (
    <Pressable style={[s.wrap, { width }]} onPress={() => onPress?.(item)}>
      <View style={s.card}>
        <Image source={{ uri: item.image }} style={s.img} />
        <View style={s.pill}>
          <Text style={s.pillText}>{item.title}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 18 },
  card: {
    borderRadius: 22,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  img: {
    height: 118,
    borderRadius: 22,
    width: "100%",
  },
  pill: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: -12,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.75)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
});
