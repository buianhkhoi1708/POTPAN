// src/components/FollowToggleButton.tsx

import React from "react";
import { Pressable, StyleSheet, ViewStyle, StyleProp } from "react-native";
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";

type Props = {
  value: boolean;
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
};

const FollowToggleButton: React.FC<Props> = ({ value, onToggle, style }) => {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.base,
        value ? styles.following : styles.follow,
        pressed && { opacity: 0.8 },
        style as any,
      ]}
    >
      <AppText variant="medium" style={[styles.text, value ? styles.textOn : styles.textOff]}>
        {value ? "Đang theo dõi" : "Theo Dõi"}
      </AppText>
    </Pressable>
  );
};

export default FollowToggleButton;

const styles = StyleSheet.create({
  base: {
    height: 28,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  follow: {
    backgroundColor: AppLightColor.primary_color,
  },
  following: {
    backgroundColor: "#ffe3e2",
    borderWidth: 1,
    borderColor: AppLightColor.primary_color,
  },
  text: {
    fontSize: 12,
    fontWeight: "900",
  },
  textOff: { color: "#fff" },
  textOn: { color: AppLightColor.primary_color },
});
