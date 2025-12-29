import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; // Import i18n

// --- COMPONENTS & CONFIG ---
import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { useAuthStore } from "../store/useAuthStore";
import AppRecipeCard from "../components/AppRecipeCard"; // Component thẻ món ăn

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // (Width - PaddingHorizontal * 3) / 2
const PRIMARY_COLOR = "#F06560";

// IE307.Q12_Nhom9

const ChefProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user: currentUser } = useAuthStore();
  const { t } = useTranslation(); // Khởi tạo hook dịch

  // Lấy ID đầu bếp từ params
  const { chefId, chefName, chefAvatar } = route.params || {};

  const [chefProfile, setChefProfile] = useState<any>(null);
  const [chefRecipes, setChefRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATES CHO FOLLOW ---
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // --- 1. LẤY DỮ LIỆU ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // A. Lấy thông tin user (đầu bếp)
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", chefId)
          .single();

        if (!userError) setChefProfile(userData);

        // B. Lấy danh sách món ăn của đầu bếp
        const { data: recipeData } = await supabase
          .from("recipes")
          .select("*")
          .eq("user_id", chefId)
          .order("created_at", { ascending: false });

        setChefRecipes(recipeData || []);

        // C. Đếm số lượng Follow
        const { count: followers } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", chefId);

        const { count: following } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", chefId);

        setFollowerCount(followers || 0);
        setFollowingCount(following || 0);

        // D. Kiểm tra mình đã follow chưa
        if (currentUser) {
          const { data: followCheck } = await supabase
            .from("follows")
            .select("*")
            .eq("follower_id", currentUser.id)
            .eq("following_id", chefId)
            .single();

          setIsFollowing(!!followCheck);
        }
      } catch (error) {
        console.log("Lỗi tải profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chefId) fetchData();
  }, [chefId, currentUser]);

  // --- 2. XỬ LÝ FOLLOW ---
  const handleToggleFollow = async () => {
    // Yêu cầu đăng nhập
    if (!currentUser) {
      Alert.alert(t("common.notification"), t("common.require_login"));
      return;
    }

    // Optimistic Update (Cập nhật UI trước khi gọi API)
    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    setFollowerCount((prev) => (newStatus ? prev + 1 : prev - 1));

    try {
      if (newStatus) {
        // Follow
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: currentUser.id, following_id: chefId });
        if (error) throw error;
      } else {
        // Unfollow
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUser.id)
          .eq("following_id", chefId);
        if (error) throw error;
      }
    } catch (err) {
      console.log("Lỗi follow:", err);
      // Revert lại nếu lỗi
      setIsFollowing(!newStatus);
      setFollowerCount((prev) => (!newStatus ? prev + 1 : prev - 1));
      Alert.alert(t("common.error"), t("common.error_occurred"));
    }
  };

  // --- HEADER COMPONENT ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.iconCircle}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="share-social-outline" size={22} color="#333" />
          </Pressable>
        </View>
      </View>

      {/* Info Profile */}
      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri:
                chefProfile?.avatar_url ||
                chefAvatar ||
                "https://i.pravatar.cc/300",
            }}
            style={styles.avatar}
          />
          {chefProfile?.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={10} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.infoCol}>
          <AppText variant="bold" style={styles.nameText}>
            {chefProfile?.full_name || chefName || t("chef.anonymous")}
          </AppText>
          <AppText variant="medium" style={styles.handleText}>
            @{chefProfile?.username || "chef"}
          </AppText>
          <AppText style={styles.bioText} numberOfLines={3}>
            {chefProfile?.bio || t("chef.default_bio")}
          </AppText>
        </View>
      </View>

      {/* Nút Action (Follow/Message) */}
      {currentUser?.id !== chefId && (
        <View style={styles.buttonRow}>
          <Pressable
            style={[
              styles.actionBtn,
              isFollowing ? styles.followingBtn : styles.followBtn,
            ]}
            onPress={handleToggleFollow}
          >
            <AppText
              variant="bold"
              style={[
                styles.actionBtnText,
                isFollowing ? { color: PRIMARY_COLOR } : { color: "#fff" },
              ]}
            >
              {isFollowing ? t("chef.following") : t("chef.follow")}
            </AppText>
          </Pressable>

          <Pressable style={[styles.actionBtn, styles.messageBtn]}>
            <AppText
              variant="bold"
              style={[styles.actionBtnText, { color: "#333" }]}
            >
              {t("chef.message")}
            </AppText>
          </Pressable>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <AppText variant="bold" style={styles.statNumber}>
            {chefRecipes.length}
          </AppText>
          <AppText style={styles.statLabel}>{t("profile.recipes")}</AppText>
        </View>
        <View style={styles.verticalDivider} />

        <Pressable
          style={styles.statItem}
          onPress={() =>
            navigation.navigate("FollowScreen", {
              type: "following",
              userId: chefId,
            })
          }
        >
          <AppText variant="bold" style={styles.statNumber}>
            {followingCount}
          </AppText>
          <AppText style={styles.statLabel}>{t("profile.following")}</AppText>
        </Pressable>
        <View style={styles.verticalDivider} />

        <Pressable
          style={styles.statItem}
          onPress={() =>
            navigation.navigate("FollowScreen", {
              type: "followers",
              userId: chefId,
            })
          }
        >
          <AppText variant="bold" style={styles.statNumber}>
            {followerCount}
          </AppText>
          <AppText style={styles.statLabel}>{t("profile.followers")}</AppText>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <AppText variant="bold" style={styles.sectionTitle}>
          {t("chef.recipe_list")}
        </AppText>
        <Ionicons name="restaurant-outline" size={18} color={PRIMARY_COLOR} />
      </View>
    </View>
  );

  // --- RENDER RECIPE CARD ---
  const renderItem = ({ item }: { item: any }) => (
    <AppRecipeCard
      item={item}
      onPress={() => navigation.push("RecipeDetailScreen", { item })}
      // Truyền style để đè chiều rộng cho khớp với layout 2 cột
      style={{ width: CARD_WIDTH, marginBottom: 12 }} 
    />
  );

  return (
    <AppSafeView style={styles.safeArea}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : (
        <FlatList
          data={chefRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <AppText style={{ color: "#999" }}>
                {t("chef.no_recipes")}
              </AppText>
            </View>
          }
        />
      )}
    </AppSafeView>
  );
};

export default ChefProfileScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: { paddingHorizontal: 16, paddingTop: 10 },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  avatarWrapper: { position: "relative", marginRight: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#eee",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2196F3",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  infoCol: { flex: 1, justifyContent: "center", paddingTop: 4 },
  nameText: { fontSize: 22, color: "#333", marginBottom: 2 },
  handleText: { fontSize: 14, color: "#666", marginBottom: 8 },
  bioText: { fontSize: 14, color: "#555", lineHeight: 20 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  followBtn: {
    backgroundColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  followingBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  messageBtn: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actionBtnText: { fontSize: 15 },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
    marginBottom: 16,
  },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 18, color: "#333" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 2 },
  verticalDivider: { width: 1, height: "60%", backgroundColor: "#eee" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, color: "#333" },
  listContent: { paddingBottom: 40 },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});