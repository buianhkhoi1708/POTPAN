import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Pressable,
} from "react-native";

import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../config/supabaseClient";

// --- COMPONENTS & STORE ---
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppBottomSpace from "../components/AppBottomSpace";
import AppSearchModal, { SearchFilters } from "../components/AppSearchModal";
import { useAuthStore } from "../store/useAuthStore";
import { AppLightColor } from "../styles/color";
import { useTranslation } from "react-i18next";
import AppHeader from "../components/AppHeader";

const { width } = Dimensions.get("window");


// --- TYPES ---
type CategoryItem = {
  id: string;
  name: string;
  dbValue: string;
  image: any;
  recipe_count: number;
};

// --- DATA ---
const staticCategories = [
  { id: "1", dbValue: "Món mặn", image: require("../assets/images/c1m3.jpg") },
  {
    id: "2",
    dbValue: "Món canh",
    image: require("../assets/images/c2m3.webp"),
  },
  {
    id: "3",
    dbValue: "Tráng miệng",
    image: require("../assets/images/c3m4.jpeg"),
  },
  {
    id: "4",
    dbValue: "Bánh ngọt",
    image: require("../assets/images/c3m2.jpg"),
  },
  {
    id: "5",
    dbValue: "Nước uống",
    image: require("../assets/images/c4m1.jpg"),
  },
  { id: "6", dbValue: "Ăn vặt", image: require("../assets/images/c5m1.jpg") },
];

const CategoriesScreen = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const [displayCategories, setDisplayCategories] = useState<CategoryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<MainTabKey>("category");

  // Layout Grid
  const paddingHorizontal = 20;
  const gap = 16;
  const itemWidth = (width - paddingHorizontal * 2 - gap) / 2;

  useEffect(() => {
    if (isFocused) setActiveTab("category");
  }, [isFocused]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      if (!user) return;
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      if (count !== null) setUnreadCount(count);
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  useEffect(() => {
    if (isFocused) fetchUnreadCount();
  }, [isFocused, fetchUnreadCount]);

  const loadData = async () => {
    try {
      if (!refreshing) setLoading(true);
      const promises = staticCategories.map(async (cat) => {
        const { count } = await supabase
          .from("recipes")
          .select("*", { count: "exact", head: true })
          .eq("category", cat.dbValue);

        return {
          ...cat,
          name: t(`data_map.category.${cat.dbValue}`),
          recipe_count: count || 0,
        };
      });
      const updatedCategories = await Promise.all(promises);
      setDisplayCategories(updatedCategories);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [t]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const handleSearchSubmit = (filters: SearchFilters) => {
    setSearchVisible(false);
    navigation.navigate("SearchResultScreen", { filters });
  };

  // --- RENDER CARD (Style giống AppRecipeCard của Home) ---
  const renderItem = ({ item }: { item: CategoryItem }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width: itemWidth },
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }, // Hiệu ứng nhấn nhẹ
      ]}
      onPress={() =>
        navigation.navigate("CategoryDetailScreen", {
          categoryId: item.id,
          categoryTitle: item.name,
          categoryDbValue: item.dbValue,
        })
      }
    >
      {/* Ảnh ở trên */}
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </View>

      {/* Thông tin ở dưới (Nền trắng) */}
      <View style={styles.infoWrap}>
        <AppText variant="bold" style={styles.title} numberOfLines={1}>
          {item.name}
        </AppText>

        <View style={styles.metaRow}>
          <Ionicons
            name="restaurant-outline"
            size={12}
            color={AppLightColor.primary_color}
          />
          <AppText style={styles.countText}>
            {item.recipe_count > 0
              ? `${item.recipe_count} ${t("recipe_detail.items")}`
              : t("profile.no_recipes")}
          </AppText>
        </View>
      </View>
    </Pressable>
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER (Copy style từ Home) */}
        <AppHeader
          title= {t("category.screen_title")}
          showSearch={true}
          showNotifications={true} // Màn hình này không cần hiện chuông
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />

        {/* CONTENT */}
        {loading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator
              size="large"
              color={AppLightColor.primary_color}
            />
          </View>
        ) : (
          <FlatList
            data={displayCategories}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{
              paddingHorizontal: paddingHorizontal,
              paddingTop: 16,
            }}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 16,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={AppLightColor.primary_color}
              />
            }
            renderItem={renderItem}
            ListFooterComponent={<AppBottomSpace height={90} />}
          />
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
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // --- HEADER (Giống hệt Home) ---
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 8 : 12,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerGreeting: { flex: 1 },
  headerSub: { fontSize: 14, color: "#666", marginBottom: 2 },
  headerTitle: { fontSize: 24, color: AppLightColor.primary_text },

  headerIcons: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppLightColor.primary_color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    position: "relative",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 1,
  },

  // --- CARD STYLES (Clean & Giống AppRecipeCard) ---
  card: {
    backgroundColor: "#fff",
    borderRadius: 16, // Bo góc giống card home
    marginBottom: 4,
    // Shadow nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  imageWrap: {
    height: 130, // Chiều cao ảnh
    width: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  image: { width: "100%", height: "100%" },

  infoWrap: {
    padding: 12,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  countText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
