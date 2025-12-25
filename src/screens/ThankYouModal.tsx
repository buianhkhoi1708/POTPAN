import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// --- CẤU HÌNH MÀU SẮC ---
const COLORS = {
  WHITE: "#FFFFFF",
  CORAL: "#FF6B6B",
  BLACK: "#000000",
  OVERLAY: "rgba(0,0,0,0.5)",
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ThankYouModal({ visible, onClose }: Props) {
  
  // Tự động tắt sau 2 giây (Optional - Nếu bạn thích)
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={s.overlay}>
          <TouchableWithoutFeedback>
            <View style={s.modalView}>
              
              {/* Tiêu đề */}
              <Text style={s.title}>
                Cảm ơn về đánh {"\n"}giá của bạn
              </Text>

              {/* Icon Checkbox to đùng */}
              <View style={s.iconContainer}>
                 <Ionicons name="checkbox" size={80} color={COLORS.CORAL} />
              </View>

              {/* Lời nhắn */}
              <Text style={s.subText}>
                Ý kiến của bạn giúp chúng tôi {"\n"}ngày càng hoàn thiện hơn.
              </Text>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

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
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 20,
    lineHeight: 30,
  },
  iconContainer: {
    marginBottom: 20,
    // Nếu muốn viền vuông như ảnh thì dùng icon 'checkbox' là chuẩn nhất
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    lineHeight: 22,
  },
});