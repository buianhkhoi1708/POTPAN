// Nhóm 9 - IE307.Q12
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  StatusBar,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppSearchModal, { SearchFilters } from "../components/AppSearchModal";
import AppRecipeCard from "../components/AppRecipeCard";
import AppChefCard, { Chef } from "../components/AppChefCard";
import AppCategoryList from "../components/AppCategoryList";
import AppHeader from "../components/AppHeader";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Recipe } from "../type/types";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - 40;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;
const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { user, profile } = useAuthStore();
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
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
  const homeCategories = useMemo(
    () => [
      { id: "1", label: t("data_map.category.Món mặn"), dbValue: "Món mặn" },
      { id: "2", label: t("data_map.category.Món canh"), dbValue: "Món canh" },
      {
        id: "3",
        label: t("data_map.category.Tráng miệng"),
        dbValue: "Tráng miệng",
      },
      {
        id: "4",
        label: t("data_map.category.Bánh ngọt"),
        dbValue: "Bánh ngọt",
      },
      { id: "5", label: t("data_map.category.Đồ uống"), dbValue: "Đồ uống" },
      { id: "6", label: t("data_map.category.Ăn vặt"), dbValue: "Ăn vặt" },
    ],
    [t]
  );

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
          supabase
            .from("recipes")
            .select("*")
            .order("rating", { ascending: false })
            .limit(5),
          supabase.from("users").select("id, full_name, avatar_url").limit(6),
          supabase
            .from("recipes")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(6),
          user
            ? supabase.from("recipes").select("*").eq("user_id", user.id)
            : Promise.resolve({ data: null }),
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
        featuredScrollRef.current.scrollTo({
          x: nextIndex * SNAP_INTERVAL,
          animated: shouldAnimate,
        });
      }, 4000);
    };
    startAutoScroll();
    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [featuredList]);

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
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
      style={[styles.fridgeBanner, { backgroundColor: theme.primary_color }]}
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
        <View style={[styles.fridgeIconCircle, { backgroundColor: "#fff" }]}>
          <Ionicons name="restaurant" size={24} color={theme.primary_color} />
        </View>
      </View>
      <Ionicons
        name="basket"
        size={80}
        color="rgba(255,255,255,0.15)"
        style={styles.fridgeBgIcon}
      />
    </Pressable>
  );

  return (
    <AppSafeView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <AppHeader userName={profile?.full_name || t("home.greeting")} />

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary_color} />
            <AppText
              variant="light"
              style={[styles.loadingText, { color: theme.placeholder_text }]}
            >
              {t("common.loading")}
            </AppText>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.primary_color}
                colors={[theme.primary_color]}
                progressBackgroundColor={theme.background_contrast}
              />
            }
          >
            <AppCategoryList
              categories={homeCategories}
              selectedId={selectedCategory}
              onSelect={(id) => {
                const cat = homeCategories.find((c) => c.id === id);
                if (cat)
                  navigation.navigate("CategoriesScreen", {
                    categoryId: cat.id,
                    initialDbValue: cat.dbValue,
                  });
                setSelectedCategory(id);
              }}
            />

            {renderFridgeBanner()}

            <View style={styles.sectionHeader}>
              <AppText
                variant="bold"
                style={[styles.sectionTitle, { color: theme.primary_text }]}
              >
                {t("home.featured_recipes")}
              </AppText>
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
                    onPress={() =>
                      navigation.navigate("RecipeDetailScreen", { item })
                    }
                    style={{
                      marginRight:
                        index === featuredList.length - 1 ? 0 : CARD_MARGIN,
                    }}
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="restaurant-outline"
                  size={48}
                  color={theme.placeholder_text}
                />
                <AppText
                  style={[styles.emptyText, { color: theme.placeholder_text }]}
                >
                  {t("profile.no_recipes")}
                </AppText>
              </View>
            )}

            {myRecipesList.length > 0 && (
              <View
                style={[
                  styles.mySectionWrapper,
                  { backgroundColor: theme.primary_color },
                ]}
              >
                <View style={styles.mySectionHeader}>
                  <View style={styles.sectionPillWrap}>
                    <View
                      style={[
                        styles.sectionPill,
                        { backgroundColor: theme.background },
                      ]}
                    >
                      <Ionicons
                        name="bookmark"
                        size={16}
                        color={theme.primary_text}
                        style={{ marginRight: 6 }}
                      />
                      <AppText
                        variant="bold"
                        style={[
                          styles.sectionPillText,
                          { color: theme.primary_text },
                        ]}
                      >
                        {t("profile.my_recipes")}
                      </AppText>
                    </View>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.mySectionList}
                >
                  {myRecipesList.map((item) => (
                    <AppRecipeCard
                      key={item.id}
                      item={item}
                      variant="small"
                      onPress={() =>
                        navigation.navigate("RecipeDetailScreen", { item })
                      }
                      style={{ marginRight: 16 }}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.sectionHeader}>
              <Pressable
                style={styles.sectionTitleRow}
                onPress={() => navigation.navigate("FamousChefsScreen")}
              >
                <AppText
                  variant="title"
                  style={[styles.sectionTitle, { color: theme.primary_text }]}
                >
                  {t("home.famous_chefs")}
                </AppText>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.primary_color}
                />
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {chefList.map((chef) => (
                <AppChefCard
                  key={chef.id}
                  item={chef}
                  style={{ marginRight: 16 }}
                />
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <AppText
                variant="bold"
                style={[styles.sectionTitle, { color: theme.primary_text }]}
              >
                {t("home.recent_recipes")}
              </AppText>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListBottom}
            >
              {recentList.map((item) => (
                <AppRecipeCard
                  key={item.id}
                  item={item}
                  variant="small"
                  onPress={() =>
                    navigation.navigate("RecipeDetailScreen", { item })
                  }
                  style={{ marginRight: 12 }}
                />
              ))}
            </ScrollView>
            <AppBottomSpace height={80} />
          </ScrollView>
        )}

        <AppSearchModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onSubmit={handleSearchSubmit}
        />

        <AppMainNavBar
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            if (tab === "profile") navigation.navigate("ProfileScreen");
            if (tab === "world") navigation.navigate("CommunityScreen");
            if (tab === "category") navigation.navigate("CategoriesScreen");
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  featuredRow: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  horizontalList: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  horizontalListBottom: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  mySectionWrapper: {
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  mySectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  mySectionList: {
    paddingHorizontal: 16,
  },
  sectionPillWrap: {
    alignItems: "center",
  },
  sectionPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sectionPillText: {
    fontSize: 16,
  },
  fridgeBanner: {
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fridgeContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  fridgeTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  fridgeTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 4,
  },
  fridgeSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
  },
  fridgeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  fridgeBgIcon: {
    position: "absolute",
    right: -10,
    bottom: -15,
    zIndex: 1,
  },
});
