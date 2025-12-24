import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

// --- CONFIG & COMPONENTS ---
import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar from "../components/AppMainNavBar";
import { useAuthStore } from "../store/useAuthStore"; // Lấy user hiện tại để so sánh

const PRIMARY_COLOR = "#F06560"; // Màu hồng cam chủ đạo

const RecipeDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  // Lấy user hiện tại (Khôi) để kiểm tra có phải chính chủ không
  const { user: currentUser } = useAuthStore();

  // Dữ liệu món ăn được truyền từ màn hình trước
  const { item } = route.params as { item: any };

  const [author, setAuthor] = useState<any>(null);

  // --- 1. LẤY THÔNG TIN TÁC GIẢ (CHEF) ---
  useEffect(() => {
    const fetchAuthor = async () => {
      if (!item.user_id) return;
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", item.user_id)
          .single();

        if (data) setAuthor(data);
      } catch (error) {
        console.log("Lỗi lấy tác giả", error);
      }
    };

    fetchAuthor();
  }, [item.user_id]);

  // --- 2. XỬ LÝ NÚT THEO DÕI ---
  const isMe = currentUser?.id === item.user_id; // Kiểm tra xem có phải đang xem bài của chính mình không

  return (
    <AppSafeView style={styles.container}>
      {/* HEADER TOP */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <AppText variant="bold" style={styles.headerTitle} numberOfLines={1}>
          {item.title}
        </AppText>
        <View style={styles.rightIcons}>
          <Pressable style={[styles.iconBtn, { marginRight: 8 }]}>
            <Ionicons name="bookmark-outline" size={22} color="#fff" />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="share-social-outline" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- ẢNH/VIDEO MÓN ĂN --- */}
        <View style={styles.mediaContainer}>
          <Image
            source={{
              uri: item.thumbnail || "https://via.placeholder.com/400",
            }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
          {/* Nút Play giả lập (để trang trí cho giống Video) */}
          <View style={styles.playOverlay}>
            <View style={styles.playBtn}>
              <Ionicons
                name="play"
                size={30}
                color={PRIMARY_COLOR}
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>
        </View>

        {/* --- THANH TIÊU ĐỀ MÀU ĐỎ --- */}
        <View style={styles.redTitleBar}>
          <AppText variant="bold" style={styles.bigTitle}>
            {item.title}
          </AppText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#fff" />
              <AppText style={styles.statText}>{item.rating || "5.0"}</AppText>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="visibility" size={16} color="#fff" />
              <AppText style={styles.statText}>3.394</AppText>
            </View>
          </View>
        </View>

        {/* --- THÔNG TIN TÁC GIẢ --- */}
        <View style={styles.authorSection}>
          <View style={styles.authorRow}>
            <Image
              source={{
                uri: author?.avatar_url || "https://i.pravatar.cc/300",
              }}
              style={styles.avatar}
            />
            <View style={styles.authorInfo}>
              <AppText style={{ color: PRIMARY_COLOR, fontSize: 13 }}>
                @{author?.username || "chef"}
              </AppText>
              <AppText variant="bold" style={{ fontSize: 16 }}>
                {author?.full_name || "Đang tải..."}
              </AppText>
            </View>

            {/* Chỉ hiện nút Theo Dõi nếu KHÔNG PHẢI là chính mình */}
            {!isMe && (
              <Pressable style={styles.followBtn}>
                <AppText variant="bold" style={{ color: "#fff", fontSize: 12 }}>
                  Theo Dõi
                </AppText>
              </Pressable>
            )}

            <MaterialIcons name="more-vert" size={24} color={PRIMARY_COLOR} />
          </View>
          <View style={styles.divider} />
        </View>

        {/* --- MÔ TẢ CHI TIẾT --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="bold" style={styles.sectionTitle}>
              Chi Tiết
            </AppText>
            <View style={styles.timeTag}>
              <Feather name="clock" size={14} color={PRIMARY_COLOR} />
              <AppText
                style={{ color: PRIMARY_COLOR, marginLeft: 4, fontSize: 13 }}
              >
                {item.time || "Unknown"}
              </AppText>
            </View>
          </View>
          <AppText style={styles.descText}>
            {item.description || "Chưa có mô tả chi tiết cho món ăn này."}
          </AppText>
        </View>

        {/* --- NGUYÊN LIỆU (Render từ JSON) --- */}
        <View style={styles.section}>
          <AppText variant="bold" style={styles.sectionTitle}>
            Nguyên Liệu
          </AppText>
          <View style={styles.ingredientsList}>
            {/* Kiểm tra và map mảng ingredients */}
            {item.ingredients && Array.isArray(item.ingredients) ? (
              item.ingredients.map((ing: any, index: number) => (
                <View key={index} style={styles.ingItem}>
                  <View style={styles.bulletPoint} />
                  <AppText style={styles.ingText}>
                    <AppText variant="bold">{ing.amount}</AppText> {ing.name}
                  </AppText>
                </View>
              ))
            ) : (
              <AppText style={{ color: "#999" }}>
                Không có thông tin nguyên liệu
              </AppText>
            )}
          </View>
        </View>

        {/* --- CÁC BƯỚC THỰC HIỆN (Render từ JSON) --- */}
        <View style={styles.section}>
          <AppText variant="bold" style={styles.sectionTitle}>
            Các Bước Chế Biến
          </AppText>

          <View style={styles.stepsList}>
            {item.steps && Array.isArray(item.steps) ? (
              item.steps.map((step: any, index: number) => (
                <View key={index} style={styles.stepItem}>
                  {/* Badge tiêu đề bước (Màu đỏ) */}
                  <View style={styles.stepHeaderBadge}>
                    <AppText
                      variant="bold"
                      style={{ color: "#fff", fontSize: 14 }}
                    >
                      Bước {index + 1}: {step.title}
                    </AppText>
                  </View>

                  {/* Nội dung bước (Khung viền đỏ) */}
                  <View style={styles.stepContentBox}>
                    <AppText style={styles.stepText}>{step.content}</AppText>
                  </View>
                </View>
              ))
            ) : (
              <AppText style={{ color: "#999" }}>
                Không có hướng dẫn thực hiện
              </AppText>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Nav Bar nổi dưới đáy */}
      <View style={styles.navBarWrapper}>
        <AppMainNavBar
          activeTab="home"
          onTabPress={(tab) => {
            if (tab === "home") navigation.navigate("HomeScreen");
            if (tab === "profile") navigation.navigate("ProfileScreen");
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default RecipeDetailScreen;

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: PRIMARY_COLOR,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  rightIcons: { flexDirection: "row" },

  scrollContent: { paddingBottom: 20 },

  // Media (Image/Video)
  mediaContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
    height: 220,
    backgroundColor: "#eee",
  },
  mediaImage: { width: "100%", height: "100%" },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  // Red Title Bar
  redTitleBar: {
    backgroundColor: PRIMARY_COLOR,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bigTitle: { color: "#fff", fontSize: 18, flex: 1, fontWeight: "bold" },
  statsRow: { flexDirection: "row", gap: 12 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { color: "#fff", fontSize: 13 },

  // Author Section
  authorSection: { paddingHorizontal: 16, marginTop: 16 },
  authorRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#eee",
  },
  authorInfo: { flex: 1, marginLeft: 10 },
  followBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  divider: { height: 1, backgroundColor: "#eee", marginTop: 16 },

  // Content Sections
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, color: PRIMARY_COLOR, marginBottom: 8 },
  timeTag: {
    flexDirection: "row",
    marginLeft: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  descText: { fontSize: 14, color: "#333", lineHeight: 22 },

  // Ingredients Styles
  ingredientsList: { marginTop: 4 },
  ingItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#333",
    marginTop: 8,
    marginRight: 8,
  },
  ingText: { fontSize: 15, color: "#333", lineHeight: 22 },

  // Steps Styles
  stepsList: { marginTop: 8 },
  stepItem: { marginBottom: 20 },
  stepHeaderBadge: {
    backgroundColor: PRIMARY_COLOR,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    zIndex: 1,
    marginBottom: -2,
    marginLeft: 10,
  },
  stepContentBox: {
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
    borderRadius: 12,
    padding: 12,
    paddingTop: 16,
    backgroundColor: "#fff",
  },
  stepText: { fontSize: 14, color: "#333", lineHeight: 22 },

  navBarWrapper: { position: "absolute", bottom: 0, left: 0, right: 0 },
});
