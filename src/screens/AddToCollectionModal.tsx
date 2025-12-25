import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  type ImageSourcePropType,
} from "react-native";

// --- CẤU HÌNH MÀU SẮC ---
const COLORS = {
  CORAL: "#FF6B6B",
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  OVERLAY: "rgba(0,0,0,0.5)", // Màu nền mờ đen
};

// --- DỮ LIỆU MẪU BỘ SƯU TẬP ---
const COLLECTIONS = [
  { id: "1", name: "Đồ mặn", image: require("../assets/images/com-gia-dinh.png") },
  { id: "2", name: "Đồ chay", image: require("../assets/images/do-an-chay.png") },
  // Bạn có thể thêm các mục khác vào đây
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect?: (collectionName: string) => void;
};

export default function AddToCollectionModal({ visible, onClose, onSelect }: Props) {
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
          
          {/* 2. Hộp thoại chính (Màu trắng) */}
          <TouchableWithoutFeedback>
            <View style={s.modalView}>
              
              {/* Tiêu đề */}
              <Text style={s.headerTitle}>Thêm vào bộ sưu tập</Text>

              {/* Danh sách các mục */}
              <View style={s.listContainer}>
                {COLLECTIONS.map((item) => (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      s.itemRow,
                      pressed && { backgroundColor: "#F5F5F5" }, // Hiệu ứng khi bấm
                    ]}
                    onPress={() => {
                      if (onSelect) onSelect(item.name);
                      onClose(); // Chọn xong thì đóng modal
                    }}
                  >
                    <Image source={item.image} style={s.itemImage} resizeMode="cover" />
                    <Text style={s.itemText}>{item.name}</Text>
                  </Pressable>
                ))}
              </View>

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
    width: "80%", // Chiếm 80% chiều rộng màn hình
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    
    // Đổ bóng cho đẹp
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.CORAL, // Màu đỏ cam giống ảnh
    textAlign: "center",
    marginBottom: 20,
  },
  listContainer: {
    gap: 15, // Khoảng cách giữa các dòng
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Bo tròn ảnh
    marginRight: 15,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.BLACK,
  },
});