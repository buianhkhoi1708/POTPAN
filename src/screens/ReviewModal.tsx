import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  type ImageSourcePropType,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// --- CẤU HÌNH MÀU SẮC ---
const COLORS = {
  BG: "#FFFFFF",
  CORAL: "#FF6B6B",      // Màu cam đỏ chủ đạo
  LIGHT_PINK: "#FFE5E5", // Màu nền nút Hủy
  TEXT: "#333333",
  GRAY_TEXT: "#999",
  BORDER: "#CCC",
};

const { width } = Dimensions.get("window");

// Định nghĩa kiểu dữ liệu truyền vào (Props)
type Props = {
  visible: boolean;                  // Trạng thái ẩn/hiện
  onClose: () => void;               // Hàm đóng modal
  onSubmit: (rating: number, comment: string, recommend: boolean) => void; // Hàm xử lý khi bấm Xác nhận
  foodName: string;                  // Tên món ăn
  foodImage: ImageSourcePropType;    // Ảnh món ăn
};

export default function ReviewModal({ visible, onClose, onSubmit, foodName, foodImage }: Props) {
  // State lưu trữ dữ liệu người dùng nhập
  const [rating, setRating] = useState(4);      // Mặc định 4 sao
  const [comment, setComment] = useState("");   // Nội dung đánh giá
  const [recommend, setRecommend] = useState(true); // true = Có, false = Không

  // Hàm hiển thị 5 ngôi sao
  const renderStars = () => {
    return (
      <View style={s.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"} // Sao đặc hoặc rỗng
              size={40} 
              color={COLORS.CORAL}
              style={{ marginHorizontal: 5 }}
            />
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"      // Hiệu ứng trượt từ dưới lên
      transparent={false}        // Full màn hình (nền trắng)
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={s.container}>
        
        {/* --- 1. HEADER (Nút Back & Tiêu đề) --- */}
        <View style={s.header}>
          <Pressable onPress={onClose} style={s.backBtn}>
            <View style={s.circleIcon}>
               <Ionicons name="arrow-back" size={24} color="#FFF" />
            </View>
          </Pressable>
          <Text style={s.headerTitle}>Đánh giá của bạn</Text>
          <View style={{ width: 40 }} /> {/* View rỗng để cân giữa tiêu đề */}
        </View>

        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          
          {/* --- 2. ẢNH MÓN ĂN & TÊN --- */}
          <View style={s.foodCard}>
            <Image source={foodImage} style={s.foodImage} resizeMode="cover" />
            <View style={s.foodNameBanner}>
              <Text style={s.foodNameText} numberOfLines={1}>{foodName}</Text>
            </View>
          </View>

          {/* --- 3. THANH CHẤM ĐIỂM SAO --- */}
          {renderStars()}

          {/* --- 4. Ô NHẬP NỘI DUNG --- */}
          <TextInput
            style={s.inputBox}
            placeholder="Hãy chia sẻ cảm nhận của bạn về món ăn này nhé..."
            placeholderTextColor={COLORS.GRAY_TEXT}
            multiline={true}
            numberOfLines={5}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top" // Đẩy chữ lên trên cùng
          />

          {/* --- 5. CÂU HỎI GIỚI THIỆU (RADIO BUTTONS) --- */}
          <Text style={s.questionText}>Bạn muốn giới thiệu công thức này cho người khác?</Text>
          
          <View style={s.radioGroup}>
            {/* Lựa chọn KHÔNG */}
            <Pressable style={s.radioRow} onPress={() => setRecommend(false)}>
              <Text style={s.radioLabel}>Không</Text>
              <Ionicons 
                name={!recommend ? "radio-button-on" : "radio-button-off"} 
                size={24} 
                color={!recommend ? COLORS.CORAL : COLORS.GRAY_TEXT} 
              />
            </Pressable>

            {/* Lựa chọn CÓ */}
            <Pressable style={s.radioRow} onPress={() => setRecommend(true)}>
              <Text style={s.radioLabel}>Có</Text>
              <Ionicons 
                name={recommend ? "radio-button-on" : "radio-button-off"} 
                size={24} 
                color={recommend ? COLORS.CORAL : COLORS.GRAY_TEXT} 
              />
            </Pressable>
          </View>

          {/* --- 6. CÁC NÚT BẤM (HỦY BỎ / XÁC NHẬN) --- */}
          <View style={s.btnGroup}>
            <Pressable style={s.btnCancel} onPress={onClose}>
              <Text style={s.btnCancelText}>Hủy bỏ</Text>
            </Pressable>

            <Pressable 
              style={s.btnConfirm} 
              onPress={() => {
                // Gọi hàm onSubmit để truyền dữ liệu ra ngoài
                onSubmit(rating, comment, recommend);
                // Lưu ý: Không cần gọi onClose() ở đây nếu muốn parent tự xử lý logic đóng
              }}
            >
              <Text style={s.btnConfirmText}>Xác nhận</Text>
            </Pressable>
          </View>

        </ScrollView>
      </View>
    </Modal>
  );
}

// --- STYLES ---
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50, // Khoảng cách cho tai thỏ/status bar
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backBtn: { padding: 5 },
  circleIcon: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: COLORS.CORAL, alignItems: 'center', justifyContent: 'center'
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: COLORS.CORAL },
  
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 50 },

  // Food Card Style
  foodCard: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 25,
    position: "relative",
    backgroundColor: "#f0f0f0"
  },
  foodImage: { width: "100%", height: "100%" },
  foodNameBanner: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: 45,
    backgroundColor: COLORS.CORAL,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
  },
  foodNameText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },

  // Stars
  starRow: { flexDirection: "row", justifyContent: "center", marginBottom: 25 },

  // Input
  inputBox: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 15,
    padding: 15,
    height: 120,
    fontSize: 16,
    marginBottom: 25,
    color: COLORS.TEXT,
    backgroundColor: "#FAFAFA"
  },

  // Question & Radio
  questionText: { fontSize: 16, fontWeight: "500", marginBottom: 15, textAlign: 'center', color: COLORS.TEXT },
  radioGroup: { flexDirection: "row", justifyContent: "space-evenly", marginBottom: 40 },
  radioRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  radioLabel: { fontSize: 16, fontWeight: "500", color: COLORS.TEXT },

  // Buttons
  btnGroup: { flexDirection: "row", justifyContent: "space-between", gap: 15 },
  btnCancel: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_PINK,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  btnCancelText: { color: COLORS.CORAL, fontSize: 18, fontWeight: "bold" },
  
  btnConfirm: {
    flex: 1,
    backgroundColor: COLORS.CORAL,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  btnConfirmText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});