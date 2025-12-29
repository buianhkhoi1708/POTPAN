// src/components/NotificationBadge.tsx
import React from "react";
import { View, StyleSheet, Text, ViewStyle } from "react-native";
import { useNotificationStore } from "../store/useNotificationStore";

interface Props {
  size?: number;     // Kích thước chấm đỏ (mặc định 18)
  style?: ViewStyle; // Để chỉnh vị trí (absolute, top, right...) từ bên ngoài
}

const NotificationBadge: React.FC<Props> = ({ size = 18, style }) => {
  // 👇 Tự động lấy số từ Store
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  // Nếu không có tin nhắn mới thì ẩn luôn
  if (unreadCount === 0) return null;

  // Xử lý hiển thị số lớn (99+)
  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          minWidth: size, // Để số 99+ nó tự giãn ra
        },
        style, // Style custom từ bên ngoài (quan trọng để căn chỉnh vị trí)
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
    paddingHorizontal: 2, // Đệm ngang cho trường hợp số dài
    zIndex: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NotificationBadge;