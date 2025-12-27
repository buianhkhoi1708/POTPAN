import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next"; // 1. Import i18n

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppSearchModal, { SearchFilters } from "../components/AppSearchModal";

import AppRecipeCard from "../components/AppRecipeCard";
import AppChefCard, { Chef } from "../components/AppChefCard";
import AppCategoryList from "../components/AppCategoryList";
import AppHeader from "../components/AppHeader"; // Header chung

import { AppLightColor } from "../styles/color";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - 40;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

type Recipe = {
  id: any;
  title: string;
  thumbnail: string | null;
  time: string;
  rating: number;
  description?: string;
  user_id?: string;
  difficulty?: string;
};

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { user, profile } = useAuthStore();
  const { t } = useTranslation(); // 2. Hook dịch

  const [unreadCount, setUnreadCount] = useState(0);
  const featuredScrollRef = useRef<ScrollView>(null);
  const scrollIndex = useRef(0);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const [activeTab, setActiveTab] = useState<MainTabKey>("home");
  const [searchVisible, setSearchVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [featuredList, setFeaturedList] = useState<Recipe[]>([]);
  const [myRecipesList, setMyRecipesList] = useState<Recipe[]>([]);
  const [recentList, setRecentList] = useState<Recipe[]>([]);
  const [chefList, setChefList] = useState<Chef[]>([]);

  // 3. Dịch Danh mục (Sử dụng useMemo để cập nhật khi ngôn ngữ thay đổi)
  const homeCategories = useMemo(() => [
    { id: "1", label: t("data_map.category.Món mặn"), dbValue: "Món mặn" },
    { id: "2", label: t("data_map.category.Món canh"), dbValue: "Món canh" },
    { id: "3", label: t("data_map.category.Tráng miệng"), dbValue: "Tráng miệng" },
    { id: "4", label: t("data_map.category.Bánh ngọt"), dbValue: "Bánh ngọt" },
    { id: "5", label: t("data_map.category.Đồ uống"), dbValue: "Đồ uống" },
    { id: "6", label: t("data_map.category.Ăn vặt"), dbValue: "Ăn vặt" },
  ], [t]);

  useEffect(() => {
    if (isFocused) setActiveTab("home");
  }, [isFocused]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      if (!user) return;
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;
      if (count !== null) setUnreadCount(count);
    } catch (err) {
      console.log("Lỗi đếm thông báo:", err);
    }
  }, [user]);

  useEffect(() => {
    if (isFocused) fetchUnreadCount();
  }, [isFocused, fetchUnreadCount]);

  const fetchAllData = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);
      const [featuredResult, chefResult, recentResult, myResult] =
        await Promise.all([
          supabase.from("recipes").select("*").order("rating", { ascending: false }).limit(5),
          supabase.from("users").select("id, full_name, avatar_url").limit(6),
          supabase.from("recipes").select("*").order("created_at", { ascending: false }).limit(6),
          user ? supabase.from("recipes").select("*").eq("user_id", user.id) : Promise.resolve({ data: null }),
        ]);

      if (featuredResult.data) setFeaturedList(featuredResult.data);
      if (chefResult.data) setChefList(chefResult.data);
      if (recentResult.data) setRecentList(recentResult.data);
      if (myResult.data) setMyRecipesList(myResult.data);
    } catch (error) {
      console.log("Lỗi tải trang chủ:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Auto scroll logic
  useEffect(() => {
    if (featuredList.length === 0) return;
    const startAutoScroll = () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = setInterval(() => {
        if (!featuredScrollRef.current) return;
        let nextIndex = scrollIndex.current + 1;
        let shouldAnimate = true;
        if (nextIndex >= featuredList.length) {
          nextIndex = 0;
          shouldAnimate = false;
        }
        scrollIndex.current = nextIndex;
        featuredScrollRef.current.scrollTo({ x: nextIndex * SNAP_INTERVAL, animated: shouldAnimate });
      }, 4000);
    };
    startAutoScroll();
    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [featuredList]);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SNAP_INTERVAL);
    scrollIndex.current = newIndex;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const handleSearchSubmit = (filters: SearchFilters) => {
    setSearchVisible(false);
    navigation.navigate("SearchResultScreen", { filters });
  };

  const renderFridgeBanner = () => (
    <Pressable 
      style={styles.fridgeBanner} 
      onPress={() => navigation.navigate("FridgeScreen")}
    >
      <View style={styles.fridgeContent}>
        <View style={styles.fridgeTextWrap}>
          <AppText variant="bold" style={styles.fridgeTitle}>
            {t("home.fridge_title") || "Trong tủ lạnh có gì?"}
          </AppText>
          <AppText style={styles.fridgeSub}>
            {t("home.fridge_sub") || "Chọn nguyên liệu, tìm món ăn ngay!"}
          </AppText>
        </View>
        <View style={styles.fridgeIconCircle}>
            <Ionicons name="restaurant" size={24} color={AppLightColor.primary_color} />
        </View>
      </View>
      {/* Icon trang trí ẩn nhẹ ở nền */}
      <Ionicons name="basket" size={80} color="rgba(255,255,255,0.15)" style={styles.fridgeBgIcon} />
    </Pressable>
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <AppHeader 
          userName={profile?.full_name || t("home.greeting")}
        />

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AppLightColor.primary_color} />
            <AppText variant="light" style={styles.loadingText}>{t("common.loading")}</AppText>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={AppLightColor.primary_color} />
            }
          >
            {/* CATEGORY LIST */}
            <AppCategoryList
              categories={homeCategories}
              selectedId={selectedCategory}
              onSelect={(id) => {
                const cat = homeCategories.find(c => c.id === id);
                if (cat) {
                  // Điều hướng sang CategoriesScreen thay vì lọc tại chỗ
                  navigation.navigate("CategoriesScreen", { 
                    categoryId: cat.id,
                    initialDbValue: cat.dbValue 
                  });
                }
                setSelectedCategory(id);
              }}
            />

            {renderFridgeBanner()}

            {/* SECTION: NỔI BẬT */}
            <View style={styles.sectionHeader}>
              <AppText variant="bold" style={styles.sectionTitle}>{t("home.featured_recipes")}</AppText>
            </View>
            {featuredList.length > 0 ? (
              <ScrollView
                ref={featuredScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP_INTERVAL}
                decelerationRate="fast"
                contentContainerStyle={styles.featuredRow}
                onMomentumScrollEnd={onMomentumScrollEnd}
              >
                {featuredList.map((item, index) => (
                  <AppRecipeCard
                    key={item.id}
                    item={item}
                    variant="featured"
                    onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
                    style={{ marginRight: index === featuredList.length - 1 ? 0 : CARD_MARGIN }}
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="restaurant-outline" size={48} color="#ccc" />
                <AppText style={styles.emptyText}>{t("profile.no_recipes")}</AppText>
              </View>
            )}

            {/* SECTION: CÔNG THỨC CỦA TÔI */}
            {myRecipesList.length > 0 && (
              <View style={styles.mySectionWrapper}>
                <View style={styles.mySectionHeader}>
                  <View style={styles.sectionPillWrap}>
                    <View style={styles.sectionPill}>
                      <Ionicons name="bookmark" size={16} color="#fff" style={{ marginRight: 6 }} />
                      <AppText variant="bold" style={styles.sectionPillText}>{t("profile.my_recipes")}</AppText>
                    </View>
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mySectionList}>
                  {myRecipesList.map((item) => (
                    <AppRecipeCard
                      key={item.id}
                      item={item}
                      variant="small"
                      onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
                      style={{ marginRight: 16 }}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* SECTION: ĐẦU BẾP */}
            <View style={styles.sectionHeader}>
              <Pressable style={styles.sectionTitleRow} onPress={() => navigation.navigate("FamousChefsScreen")}>
                  <AppText variant="title" style={styles.sectionTitle}>👨‍🍳 {t("home.famous_chefs")}</AppText>
                  <Ionicons name="chevron-forward" size={20} color={AppLightColor.primary_color} />
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              {chefList.map((chef) => (
                <AppChefCard key={chef.id} item={chef} style={{ marginRight: 16 }} />
              ))}
            </ScrollView>

            {/* SECTION: GẦN ĐÂY */}
            <View style={styles.sectionHeader}>
              <AppText variant="bold" style={styles.sectionTitle}>⏰ {t("home.recent_recipes")}</AppText>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListBottom}>
              {recentList.map((item) => (
                <AppRecipeCard
                  key={item.id}
                  item={item}
                  variant="small"
                  onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
                  style={{ marginRight: 12 }}
                />
              ))}
            </ScrollView>
            <AppBottomSpace height={80} />
          </ScrollView>
        )}

        {/* SEARCH MODAL */}
        <AppSearchModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onSubmit={handleSearchSubmit}
        />
        
        {/* NAV BAR */}
        <AppMainNavBar activeTab={activeTab} onTabPress={(tab) => {
            setActiveTab(tab);
            if(tab === 'profile') navigation.navigate("ProfileScreen");
            if(tab === 'world') navigation.navigate("CommunityScreen");
            if(tab === 'category') navigation.navigate("CategoriesScreen");
          }} 
        />
      </View>
    </AppSafeView>
  );
};

export default HomeScreen;

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  loadingText: { marginTop: 12, color: "#666", fontSize: 14 },
  
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40, paddingHorizontal: 20 },
  emptyText: { marginTop: 12, color: "#999", fontSize: 14, textAlign: "center" },
  
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },
  
  sectionHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  sectionTitle: { fontSize: 20, color: AppLightColor.primary_text, fontWeight: "700" },
  
  featuredRow: { paddingHorizontal: 20, paddingBottom: 20 },
  horizontalList: { paddingHorizontal: 20, paddingBottom: 16 },
  horizontalListBottom: { paddingHorizontal: 20, paddingBottom: 24 },
  
  mySectionWrapper: {
    marginTop: 8, marginHorizontal: 16, backgroundColor: AppLightColor.primary_color,
    borderRadius: 16, paddingBottom: 20,
    shadowColor: AppLightColor.primary_color, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  mySectionHeader: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  mySectionList: { paddingHorizontal: 16 },
  sectionPillWrap: { alignItems: "center" },
  sectionPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: "#fff" },
  sectionPillText: { color: AppLightColor.primary_color, fontSize: 16 },
  fridgeBanner: {
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: AppLightColor.primary_color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fridgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  fridgeTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  fridgeTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 4,
  },
  fridgeSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  fridgeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fridgeBgIcon: {
    position: 'absolute',
    right: -10,
    bottom: -15,
    zIndex: 1,
  },
});