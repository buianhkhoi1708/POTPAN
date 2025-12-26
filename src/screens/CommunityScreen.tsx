import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; 

// --- COMPONENTS ---
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import MainBottomNav, { type MainTabKey } from "../components/AppMainNavBar";
import AppSearchModal from "../components/AppSearchModal";
import BottomNavSpacer from "../components/AppBottomSpace";
import AppHeader from "../components/AppHeader";
import AppCommunityCard from "../components/AppCommunityCard"; // Component Card đã chuẩn i18n

// --- CONFIG & STYLES ---
import { AppLightColor } from "../styles/color";
import { supabase } from "../config/supabaseClient";

// --- TYPES ---
type CommunityTabKey = "hot" | "new" | "old";

type CommunityPost = {
  id: any;
  title: string;
  image: string | null;
  desc: string;
  authorName: string;
  time: string; // Dữ liệu thô từ DB
  difficulty: string; // Dữ liệu thô từ DB (VD: "Dễ")
  rating: number;
  originalItem: any;
};

// --- DIMENSIONS ---
const TAB_H = 46;
const TAB_PX = 20;

const CommunityScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
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

      // Sắp xếp theo Tab
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
          desc: item.description || "",
          authorName: item.users?.full_name || t("community.anonymous_chef"),
          // Truyền raw data để Card tự dịch
          time: item.time, 
          difficulty: item.difficulty, 
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

  // Reload khi đổi tab
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
  const renderTab = (key: CommunityTabKey, labelKey: string) => {
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
          {/* Dịch label từ key truyền vào */}
          {t(labelKey)}
        </AppText>
      </Pressable>
    );
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <AppHeader
          title={t("community.screen_title")}
          showSearch={false} // Tắt search ở header vì đã có BottomNav
          showNotifications={true}
          showBack={false} // Tắt nút back vì đây là tab chính
        />

        {/* TABS (Hot, New, Old) */}
        <View style={styles.tabsRow}>
          {renderTab("hot", "community.tabs.hot")}
          {renderTab("new", "community.tabs.new")}
          {renderTab("old", "community.tabs.old")}
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
            if (tab === "category") navigation.navigate("CategoriesScreen");
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  centerLoading: { flex: 1, justifyContent: "center", alignItems: "center" },
  
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
  
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#999", marginTop: 10 },
});