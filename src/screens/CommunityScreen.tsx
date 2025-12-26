import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";

// 👇 1. Import hook dịch
import { useTranslation } from "react-i18next";

// --- COMPONENTS ---
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import MainBottomNav, { type MainTabKey } from "../components/AppMainNavBar";
import AppSearchModal from "../components/AppSearchModal";
import BottomNavSpacer from "../components/AppBottomSpace";
import AppHeader from "../components/AppHeader";
import AppCommunityCard from "../components/AppCommunityCard";

// --- CONFIG & STYLES ---
import { AppLightColor } from "../styles/color";
import { supabase } from "../config/supabaseClient";
import { Ionicons } from "@expo/vector-icons";

// --- TYPES ---
type CommunityTabKey = "hot" | "new" | "old";

type CommunityPost = {
  id: any;
  title: string;
  image: string | null;
  desc: string;
  authorName: string;
  time: string;
  difficulty: string;
  rating: number;
  originalItem: any;
};

// --- DIMENSIONS ---
const { width: SCREEN_W } = Dimensions.get("window");
const H_PADDING = 20;
const IMAGE_W = 162;
const IMAGE_H = 162;
const OVERLAP = 64;
const CARD_W = SCREEN_W - H_PADDING * 2;
const CONTENT_W = CARD_W - IMAGE_W + OVERLAP;
const TAB_H = 46;
const TAB_PX = 20;

const CommunityScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  // 👇 2. Khởi tạo hàm t()
  const { t } = useTranslation();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<CommunityTabKey>("hot");
  const [activeBottomTab, setActiveBottomTab] = useState<MainTabKey>("world");
  const [searchVisible, setSearchVisible] = useState(false);

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) setActiveBottomTab("world");
  }, [isFocused]);

  // --- FETCH DATA ---
  const fetchPosts = async () => {
    try {
      if (!refreshing) setLoading(true);

      let query = supabase.from("recipes").select(`
          *,
          users (full_name) 
        `);

      if (activeTab === "hot") {
        query = query.order("rating", { ascending: false });
      } else if (activeTab === "new") {
        query = query.order("created_at", { ascending: false });
      } else if (activeTab === "old") {
        query = query.order("created_at", { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const formattedData: CommunityPost[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          image: item.thumbnail,
          // 👇 3. Dịch mô tả mặc định nếu DB trống
          desc: item.description || t("community.default_desc"),
          authorName: item.users?.full_name || t("community.anonymous_chef"),
          time: item.time || "30p",
          // 👇 4. Dịch độ khó (giả sử item.difficulty lưu 'Easy', 'Hard'...)
          difficulty: t(
            `common1.difficulty.${item.difficulty?.toLowerCase() || "medium"}`
          ),
          rating: item.rating || 0,
          originalItem: item,
        }));
        setPosts(formattedData);
      }
    } catch (err) {
      console.log("Lỗi tải cộng đồng:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [activeTab]);

  // --- RENDER CARD ---
  const renderCard = ({ item }: { item: CommunityPost }) => {
  return (
    <AppCommunityCard
      item={item}
      onPress={() =>
        navigation.navigate("RecipeDetailScreen", { item: item.originalItem })
      }
    />
  );
};

  // --- RENDER TAB BUTTON ---
  const renderTab = (key: CommunityTabKey, label: string) => {
    const isActive = activeTab === key;
    return (
      <Pressable
        key={key}
        onPress={() => setActiveTab(key)}
        style={isActive ? styles.tabBtnActive : styles.tabBtn}
      >
        <AppText
          variant="medium"
          style={isActive ? styles.tabTextActive : styles.tabText}
        >
          {label}
        </AppText>
      </Pressable>
    );
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        <AppHeader 
  title= {t("community.screen_title")}
  showSearch={true}
  showNotifications={true} // Màn hình này không cần hiện chuông
  showBack={true}
  onBackPress={() => navigation.goBack()}
/>

        {/* TABS */}
        <View style={styles.tabsRow}>
          {/* 👇 7. Dịch nhãn các Tab */}
          {renderTab("hot", t("community.tabs.hot"))}
          {renderTab("new", t("community.tabs.new"))}
          {renderTab("old", t("community.tabs.old"))}
        </View>

        {/* LIST POSTS */}
        {loading && !refreshing ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator
              size="large"
              color={AppLightColor.primary_color}
            />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={AppLightColor.primary_color}
              />
            }
            ListFooterComponent={<BottomNavSpacer height={100} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="documents-outline" size={48} color="#ccc" />
                <AppText style={styles.emptyText}>
                  {/* 👇 8. Dịch thông báo danh sách trống */}
                  {t("community.empty_list")}
                </AppText>
              </View>
            }
          />
        )}

        {/* SEARCH & NAV */}
        <AppSearchModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onSubmit={() => setSearchVisible(false)}
        />

        <MainBottomNav
          activeTab={activeBottomTab}
          onTabPress={(tab) => {
            setActiveBottomTab(tab);
            if (tab === "home") navigation.navigate("HomeScreen");
            if (tab === "profile") navigation.navigate("ProfileScreen");
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  // Giữ nguyên Styles của bạn...
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  centerLoading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerLeft: { width: 40, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    color: AppLightColor.primary_color,
  },
  headerRight: {
    width: 86,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: 10,
  },
  headerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
  },
  tabBtn: {
    height: TAB_H,
    paddingHorizontal: TAB_PX,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  tabBtnActive: {
    height: TAB_H,
    paddingHorizontal: TAB_PX,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppLightColor.primary_color,
  },
  tabText: { fontSize: 14, color: "#666", fontWeight: "600" },
  tabTextActive: { fontSize: 14, color: "#fff", fontWeight: "700" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  row: {
    width: CARD_W,
    height: IMAGE_H,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrap: {
    width: IMAGE_W,
    height: IMAGE_H,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#eee",
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: { width: "100%", height: "100%" },
  contentCard: {
    width: CONTENT_W,
    height: 140,
    marginLeft: -OVERLAP,
    borderWidth: 1.5,
    borderColor: AppLightColor.primary_color,
    borderRadius: 26,
    paddingTop: 12,
    paddingBottom: 10,
    paddingRight: 12,
    paddingLeft: 12 + OVERLAP,
    backgroundColor: "#fff",
    zIndex: 2,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: { flex: 1, justifyContent: "flex-start" },
  title: {
    fontSize: 16,
    color: AppLightColor.primary_text,
    marginBottom: 4,
    lineHeight: 22,
  },
  desc: { fontSize: 12, color: "#666", marginBottom: 4, lineHeight: 16 },
  author: {
    fontSize: 11,
    color: AppLightColor.primary_color,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  metaItem: { flexDirection: "row", alignItems: "center", columnGap: 4 },
  metaText: { fontSize: 11, color: "#666", fontWeight: "600" },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#999", marginTop: 10 },
});
