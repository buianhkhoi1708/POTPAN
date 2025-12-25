import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
  SafeAreaView,
  type ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// --- CẤU HÌNH MÀU SẮC ---
const COLORS = {
  BG: "#FFFFFF",
  CORAL: "#FF6B6B",
  TEXT: "#333",
  GRAY_TEXT: "#666",
  LIGHT_BG: "#FFF5F5",
};

// --- 1. DỮ LIỆU ĐÁNH GIÁ RIÊNG TỪNG MÓN (DATABASE) ---
const REVIEWS_DATABASE: Record<string, any[]> = {
  // ID 101: Gà kho gừng
  "101": [
    { id: "1", user: "@meYeuCom", time: "10 phút trước", rating: 5, content: "Gà kho gừng ấm bụng, ăn ngày mưa là hết sảy!", avatar: require("../assets/images/avt.png") },
    { id: "2", user: "@bepNha", time: "1 giờ trước", rating: 4, content: "Công thức dễ làm, nhưng mình thích thêm chút ớt nữa.", avatar: require("../assets/images/avt.png") },
    { id: "3", user: "@tuanHung", time: "1 ngày trước", rating: 5, content: "Vợ mình khen nức nở, cảm ơn shop!", avatar: require("../assets/images/avt.png") },
  ],
  
  // ID 102: Gà kho nghệ
  "102": [
    { id: "1", user: "@lanAnh", time: "30 phút trước", rating: 5, content: "Màu nghệ lên đẹp quá, nhìn là muốn ăn ngay.", avatar: require("../assets/images/avt.png") },
    { id: "2", user: "@cuongDev", time: "2 giờ trước", rating: 3, content: "Hơi nhạt so với khẩu vị của mình.", avatar: require("../assets/images/avt.png") },
  ],

  // ID 201: Phở
  "201": [
    { id: "1", user: "@phoLover", time: "5 phút trước", rating: 5, content: "Nước dùng trong và ngọt thanh, chuẩn vị Hà Nội.", avatar: require("../assets/images/avt.png") },
    { id: "2", user: "@duKhach", time: "1 ngày trước", rating: 5, content: "Tuyệt vời! Best Pho in town.", avatar: require("../assets/images/avt.png") },
    { id: "3", user: "@beBi", time: "2 ngày trước", rating: 4, content: "Thịt bò mềm, rất ngon.", avatar: require("../assets/images/avt.png") },
  ],

  // ID 202: Bún bò
  "202": [
    { id: "1", user: "@hueThuong", time: "1 giờ trước", rating: 5, content: "Mắm ruốc thơm lừng, đúng chất Huế.", avatar: require("../assets/images/avt.png") },
  ],

  // ... Bạn có thể thêm tiếp các ID khác (301, 401...)
};

// Dữ liệu mặc định (nếu món ăn chưa có review nào)
const DEFAULT_REVIEWS = [
  { id: "d1", user: "@nguoiDungMoi", time: "Vừa xong", rating: 5, content: "Món này nhìn hấp dẫn quá, sẽ thử làm ngay!", avatar: require("../assets/images/avt.png") },
  { id: "d2", user: "@fanCung", time: "5 phút trước", rating: 5, content: "Tuyệt vời, 10 điểm!", avatar: require("../assets/images/avt.png") },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddReviewPress: () => void;
  foodId: string; // ✅ Cần thêm ID để tìm đúng review
  foodData: {
    name: string;
    image: ImageSourcePropType;
    authorName: string;
    authorHandle: string;
    rating: number;
    totalReviews: string;
  };
};

export default function ReviewsListModal({ visible, onClose, onAddReviewPress, foodId, foodData }: Props) {
  
  // ✅ Logic: Lấy review theo ID, nếu không có thì lấy mặc định
  const currentReviews = useMemo(() => {
    return REVIEWS_DATABASE[foodId] || DEFAULT_REVIEWS;
  }, [foodId]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={s.reviewItem}>
      <View style={s.reviewHeader}>
        <Image source={item.avatar} style={s.cmtAvatar} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.cmtUser}>{item.user}</Text>
        </View>
        <Text style={s.cmtTime}>{item.time}</Text>
      </View>
      
      <Text style={s.cmtContent}>{item.content}</Text>
      
      <View style={s.starRowSmall}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= item.rating ? "star" : "star-outline"}
            size={16}
            color={COLORS.CORAL}
          />
        ))}
      </View>
      <View style={s.divider} />
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={s.container}>
        
        {/* HEADER */}
        <View style={s.header}>
          <Pressable onPress={onClose} style={s.circleBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={s.headerTitle}>Đánh giá</Text>
          <Pressable style={s.circleBtn}>
            <Ionicons name="share-social-outline" size={24} color="#FFF" />
          </Pressable>
        </View>

        {/* LIST */}
        <FlatList
          data={currentReviews} // ✅ Dùng dữ liệu động
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          
          ListHeaderComponent={
            <>
              {/* HERO CARD */}
              <View style={s.heroCard}>
                <View style={s.heroContent}>
                  <Image source={foodData.image} style={s.foodImage} />
                  
                  <View style={s.foodInfo}>
                    <Text style={s.foodName} numberOfLines={2}>{foodData.name}</Text>
                    
                    <View style={s.starRow}>
                       {[1, 2, 3, 4, 5].map((s) => (
                          <Ionicons key={s} name="star" size={16} color="#FFF" />
                       ))}
                    </View>
                    
                    {/* Hiển thị số lượng review thực tế */}
                    <Text style={s.reviewCount}>({currentReviews.length} Đánh giá)</Text>

                    <View style={s.authorRow}>
                       <View style={s.smallAvatar} /> 
                       <View>
                          <Text style={s.authorHandle}>{foodData.authorHandle}</Text>
                          <Text style={s.authorName}>{foodData.authorName}</Text>
                       </View>
                    </View>

                    <Pressable style={s.addBtn} onPress={onAddReviewPress}>
                      <Text style={s.addBtnText}>Thêm đánh giá</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <Text style={s.listTitle}>Bình luận ({currentReviews.length})</Text>
            </>
          }
          renderItem={renderItem}
          style={s.list}
        />
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 10, marginTop: 10
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.CORAL },
  circleBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.CORAL, alignItems: "center", justifyContent: "center",
  },
  list: { paddingHorizontal: 16 },
  heroCard: {
    marginTop: 20, marginBottom: 20,
    backgroundColor: COLORS.CORAL, borderRadius: 20,
    padding: 15,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 5, elevation: 5,
  },
  heroContent: { flexDirection: "row" },
  foodImage: {
    width: 120, height: 120, borderRadius: 15, marginRight: 15,
    borderWidth: 2, borderColor: "#FFF",
  },
  foodInfo: { flex: 1, justifyContent: "space-between" },
  foodName: { fontSize: 20, fontWeight: "bold", color: "#FFF", marginBottom: 5 },
  starRow: { flexDirection: "row", marginBottom: 2 },
  reviewCount: { color: "#FFF", fontSize: 12, marginBottom: 8 },
  authorRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  smallAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: "lightblue", marginRight: 8 },
  authorHandle: { color: "#FFF", fontSize: 10 },
  authorName: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  addBtn: {
    backgroundColor: "#FFF", paddingVertical: 8, paddingHorizontal: 15,
    borderRadius: 20, alignSelf: "flex-start",
  },
  addBtnText: { color: COLORS.CORAL, fontWeight: "bold", fontSize: 14 },
  listTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.CORAL, marginBottom: 15 },
  reviewItem: { marginBottom: 20 },
  reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cmtAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  cmtUser: { fontWeight: "bold", color: COLORS.CORAL, fontSize: 16 },
  cmtTime: { color: COLORS.GRAY_TEXT, fontSize: 12, marginRight: 5 },
  cmtContent: { fontSize: 15, color: COLORS.TEXT, lineHeight: 22, marginBottom: 8 },
  starRowSmall: { flexDirection: "row" },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginTop: 15 },
});