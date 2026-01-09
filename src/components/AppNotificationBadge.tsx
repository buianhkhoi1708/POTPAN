// Nhóm 9 - IE307.Q12
import React from "react";
import { View, StyleSheet, Text, ViewStyle } from "react-native";
import { useNotificationStore } from "../store/useNotificationStore";

interface Props {
  size?: number;
  style?: ViewStyle;
}

const NotificationBadge: React.FC<Props> = ({ size = 18, style }) => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  if (unreadCount === 0) return null;

  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          minWidth: size,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.6 }]}>
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#ff3b30",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
    paddingHorizontal: 2,
    zIndex: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NotificationBadge;
