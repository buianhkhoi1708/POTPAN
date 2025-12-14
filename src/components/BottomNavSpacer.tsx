// src/components/BottomNavSpacer.tsx
import React from "react";
import { View } from "react-native";

type BottomNavSpacerProps = {
  /** Chiều cao khoảng trắng. Mặc định >= chiều cao nav overlay. */
  height?: number;
};

export default function BottomNavSpacer({ height = 96 }: BottomNavSpacerProps) {
  return <View style={{ height }} />;
}
