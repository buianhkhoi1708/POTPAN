import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";

// --- COMPONENTS & STORE ---
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar, { MainTabKey } from "../components/AppMainNavBar";
import { AppLightColor } from "../styles/color";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // Tính toán chiều rộng thẻ để chia 2 cột
const PRIMARY_COLOR = "#F06560"; // Màu chủ đạo (Hồng cam)

const ProfileScreen = () => {
  const navigation = useNavigation<any>();

  // Lấy dữ liệu profile từ Store
  const { user, profile, fetchUserProfile } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"recipes" | "favorites">(
    "recipes"
  );
  const [myRecipes, setMyRecipes] = useState<any[]>([]);
  const [activeNavTab, setActiveNavTab] = useState<MainTabKey>("profile");

  // --- 1. LẤY DANH SÁCH MÓN ĂN ---
  const fetchMyRecipes = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setMyRecipes(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // --- 2. TỰ ĐỘNG CẬP NHẬT KHI VÀO MÀN HÌNH ---
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile(); // Lấy lại Profile mới nhất (Tên, Bio, Avatar...)
      fetchMyRecipes(); // Lấy lại danh sách món
      setActiveNavTab("profile");
    }, [user])
  );

  // --- 3. PHẦN HEADER PROFILE ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* A. INFO ROW */}
      <View style={styles.profileRow}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: profile?.avatar_url || "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
        </View>

        {/* Info Text (ĐÃ SỬA: LẤY DỮ LIỆU THẬT) */}
        <View style={styles.infoCol}>
          <AppText variant="bold" style={styles.nameText}>
            {profile?.full_name || "Chưa đặt tên"}
          </AppText>

          <AppText variant="medium" style={styles.handleText}>
            {/* Ưu tiên hiện Username, nếu không có thì lấy email */}
            {profile?.username
              ? `@${profile.username}`
              : `@${profile?.email?.split("@")[0] || "user"}`}
          </AppText>

          <AppText style={styles.bioText} numberOfLines={2}>
            {profile?.bio || "Chưa có giới thiệu bản thân."}
          </AppText>
        </View>

        {/* Top Icons */}
        <View style={styles.topIcons}>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="add" size={20} color={PRIMARY_COLOR} />
          </Pressable>
          <Pressable
            style={[styles.iconCircle, { marginLeft: 8 }]}
            onPress={() => navigation.navigate("SettingsScreen")}
          >
            <Ionicons name="settings-outline" size={20} color={PRIMARY_COLOR} />
          </Pressable>
        </View>
      </View>

      {/* B. BUTTONS ROW */}
      <View style={styles.buttonRow}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => navigation.navigate("EditProfileScreen")}
        >
          <AppText variant="bold" style={styles.actionBtnText}>
            Chỉnh Sửa Hồ Sơ
          </AppText>
        </Pressable>
        <Pressable style={styles.actionBtn}>
          <AppText variant="bold" style={styles.actionBtnText}>
            Chia Sẻ Hồ Sơ
          </AppText>
        </Pressable>
      </View>

      {/* C. STATS ROW */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <AppText variant="bold" style={styles.statNumber}>
            {myRecipes.length}
          </AppText>
          <AppText style={styles.statLabel}>Công thức đã lưu</AppText>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statItem}>
          <AppText variant="bold" style={styles.statNumber}>
            120
          </AppText>
          <AppText style={styles.statLabel}>Lượt theo dõi</AppText>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statItem}>
          <AppText variant="bold" style={styles.statNumber}>
            250
          </AppText>
          <AppText style={styles.statLabel}>Người theo dõi</AppText>
        </View>
      </View>

      {/* D. TABS */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tabItem,
            activeTab === "recipes" && styles.tabItemActive,
          ]}
          onPress={() => setActiveTab("recipes")}
        >
          <AppText
            variant="bold"
            style={[
              styles.tabText,
              activeTab === "recipes"
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}
          >
            Công thức
          </AppText>
        </Pressable>

        <Pressable
          style={[
            styles.tabItem,
            activeTab === "favorites" && styles.tabItemActive,
          ]}
          onPress={() => setActiveTab("favorites")}
        >
          <AppText
            variant="bold"
            style={[
              styles.tabText,
              activeTab === "favorites"
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}
          >
            Yêu thích
          </AppText>
        </Pressable>
      </View>
    </View>
  );

  // --- 4. RENDER MÓN ĂN (CARD GRID) ---
  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardBody}>
        <AppText variant="bold" style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText style={styles.cardSub} numberOfLines={1}>
          {item.description || "Món ngon"}
        </AppText>

        <View style={styles.cardFooter}>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={12} color={PRIMARY_COLOR} />
            <AppText style={styles.metaText}>{item.rating || 5}</AppText>
          </View>
          <View style={styles.metaRow}>
            <Feather name="clock" size={12} color={PRIMARY_COLOR} />
            <AppText style={styles.metaText}>{item.time || "30 phút"}</AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <FlatList
        data={activeTab === "recipes" ? myRecipes : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <AppText style={{ color: "#999" }}>Chưa có món ăn nào.</AppText>
          </View>
        }
      />

      {/* NAVIGATION BAR NỔI */}
      <View style={styles.navBarWrapper}>
        <AppMainNavBar
          activeTab={activeNavTab}
          onTabPress={(tab) => {
            setActiveNavTab(tab);
            if (tab === "home") navigation.navigate("HomeScreen");
            // Xử lý các tab khác...
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  // Header Config
  headerContainer: { paddingHorizontal: 16, paddingTop: 10 },

  // 1. Profile Row
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: "#4CAF50", // Viền xanh lá
    borderRadius: 50,
    padding: 2,
  },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  infoCol: { flex: 1, marginLeft: 16, justifyContent: "center", paddingTop: 4 },
  nameText: { fontSize: 20, color: PRIMARY_COLOR, marginBottom: 2 },
  handleText: { fontSize: 14, color: PRIMARY_COLOR, marginBottom: 8 },
  bioText: { fontSize: 13, color: "#333", lineHeight: 18 },

  topIcons: { flexDirection: "row" },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFEBEA",
    alignItems: "center",
    justifyContent: "center",
  },

  // 2. Buttons Row
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  actionBtnText: { color: "#fff", fontSize: 15 },

  // 3. Stats Row
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 16, color: "#333" },
  statLabel: { fontSize: 11, color: "#666", marginTop: 2 },
  verticalDivider: { width: 1, height: "80%", backgroundColor: "#eee" },

  // 4. Tabs
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tabItem: { paddingBottom: 10, flex: 1, alignItems: "center" },
  tabItemActive: { borderBottomWidth: 3, borderBottomColor: PRIMARY_COLOR },
  tabText: { fontSize: 18 },
  tabTextActive: { color: "#333" },
  tabTextInactive: { color: "#999" },

  // List & Grid
  listContent: { paddingBottom: 100 },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  // Card Style
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 15, color: "#333", marginBottom: 4 },
  cardSub: { fontSize: 12, color: "#666", marginBottom: 8 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, color: PRIMARY_COLOR },

  // Nav Bar Wrapper
  navBarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
