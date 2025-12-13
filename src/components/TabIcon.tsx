// src/components/TabIcon.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../styles/color";

type Props = {
  focused: boolean;
  name: string;
};

export default function TabIcon({ focused, name }: Props) {
  if (focused) {
    return (
      <View style={s.active}>
        <Ionicons name={name as any} size={22} color={COLORS.CORAL} />
      </View>
    );
  }
  return <Ionicons name={name as any} size={22} color="#fff" />;
}

const s = StyleSheet.create({
  active: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
