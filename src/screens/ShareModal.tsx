import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard'; // (Tuỳ chọn) Để copy link thật

// --- CẤU HÌNH MÀU SẮC ---
const COLORS = {
  CORAL: "#FF6B6B",
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  OVERLAY: "rgba(0,0,0,0.5)",
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ShareModal({ visible, onClose }: Props) {
  
  // Hàm xử lý giả lập
  const handleCopyLink = async () => {
    // await Clipboard.setStringAsync("https://potpan.vn/recipe/123"); 
    Alert.alert("Thông báo", "Đã sao chép URL vào bộ nhớ tạm!");
    onClose();
  };

  const handleShareApp = () => {
    Alert.alert("Thông báo", "Đang mở trình chia sẻ của hệ thống...");
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* 1. Lớp phủ mờ (Bấm ra ngoài để tắt) */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={s.overlay}>
          
          {/* 2. Hộp thoại chính */}
          <TouchableWithoutFeedback>
            <View style={s.modalView}>
              
              {/* Tiêu đề */}
              <Text style={s.headerTitle}>Phương thức chia sẻ</Text>

              {/* Lựa chọn 1: Sao chép URL */}
              <Pressable 
                style={({ pressed }) => [s.optionRow, pressed && s.pressedBg]}
                onPress={handleCopyLink}
              >
                <Ionicons name="link-outline" size={24} color="#333" style={{ marginRight: 15 }} />
                <Text style={s.optionText}>Sao chép URL</Text>
              </Pressable>

              {/* Lựa chọn 2: Chia sẻ qua ứng dụng */}
              <Pressable 
                style={({ pressed }) => [s.optionRow, pressed && s.pressedBg]}
                onPress={handleShareApp}
              >
                <Ionicons name="share-social-outline" size={24} color="#333" style={{ marginRight: 15 }} />
                <Text style={s.optionText}>Chia sẻ qua ứng dụng</Text>
              </Pressable>

            </View>
          </TouchableWithoutFeedback>
          
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// --- STYLE ---
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.CORAL, // Màu đỏ cam giống hình
    textAlign: "center",
    marginBottom: 25,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 18, // Chữ to rõ giống hình
    fontWeight: "500", // Đậm vừa phải
    color: COLORS.BLACK,
  },
  pressedBg: {
    backgroundColor: "#F0F0F0",
  }
});