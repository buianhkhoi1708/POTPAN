// src/components/CategoryCard.tsx  (PNG)
import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { COLORS } from "../styles/color";
import type { CategoryItem } from "../config/categoriesData";

export default function CategoryCard({
  item,
  width,
  onPress,
}: {
  item: CategoryItem;
  width: number;
  onPress?: (item: CategoryItem) => void;
}) {
  return (
    <Pressable style={[s.wrap, { width }]} onPress={() => onPress?.(item)}>
      <View style={s.card}>
        <Image source={item.image} style={s.img} resizeMode="cover" />
      </View>

      <View style={s.pill}>
        <Text style={s.pillText} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: "center" },
  card: {
    width: "100%",
    height: 128,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  img: { width: "100%", height: "100%" },
  pill: {
    marginTop: 10,
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: COLORS.CORAL,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "94%",
  },
  pillText: { fontSize: 13, fontWeight: "700", color: COLORS.TEXT },
});
