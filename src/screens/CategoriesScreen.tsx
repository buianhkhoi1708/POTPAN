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
import AppHeader from "../components/AppHeader";

// --- IMPORT I18N ---
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

// --- TYPES ---
type CategoryItem = {
  id: string;
  name: string;      // Tên hiển thị (đã dịch)
  dbValue: string;   // Giá trị trong Database (để query)
  key: string;       // Key trong file i18n JSON
  image: any;
  recipe_count: number;
};

// --- DATA ---
// Thêm trường 'key' để map với file JSON (vi.json/en.json)
const staticCategories = [
  { id: "1", dbValue: "Món mặn", key: "savory", image: require("../assets/images/c1m3.jpg") },
  { id: "2", dbValue: "Món canh", key: "soup", image: require("../assets/images/c2m3.webp") },
  { id: "3", dbValue: "Tráng miệng", key: "dessert", image: require("../assets/images/c3m4.jpeg") },
  { id: "4", dbValue: "Bánh ngọt", key: "cake", image: require("../assets/images/c3m2.jpg") },
  { id: "5", dbValue: "Nước uống", key: "drink", image: require("../assets/images/c4m1.jpg") },
  { id: "6", dbValue: "Ăn vặt", key: "snack", image: require("../assets/images/c5m1.jpg") },
];

const CategoriesScreen = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { user } = useAuthStore();
  const { t } = useTranslation(); // Khởi tạo hook dịch

  const [displayCategories, setDisplayCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTabKey>("category");

  // Layout Grid
  const paddingHorizontal = 20;
  const gap = 16;
  const itemWidth = (width - paddingHorizontal * 2 - gap) / 2;

  useEffect(() => {
    if (isFocused) setActiveTab("category");
  }, [isFocused]);

  // --- HÀM TẢI DỮ LIỆU ---
  const loadData = async () => {
    try {
      if (!refreshing) setLoading(true);
      
      const promises = staticCategories.map(async (cat) => {
        // Query đếm số lượng dựa trên dbValue (giá trị gốc trong DB)
        const { count } = await supabase
          .from("recipes")
          .select("*", { count: "exact", head: true })
          .eq("category", cat.dbValue);

        return {
          ...cat,
          // Dịch tên danh mục dựa trên key
          name: t(`category.${cat.key}`), 
          recipe_count: count || 0,
        };
      });

      const updatedCategories = await Promise.all(promises);
      setDisplayCategories(updatedCategories);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reload khi ngôn ngữ thay đổi hoặc focus lại
  useEffect(() => {
    loadData();
  }, [t, isFocused]); 

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const handleSearchSubmit = (filters: SearchFilters) => {
    setSearchVisible(false);
    navigation.navigate("SearchResultScreen", { filters });
  };

  // --- RENDER ITEM ---
  const renderItem = ({ item }: { item: CategoryItem }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width: itemWidth },
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
      onPress={() =>
        navigation.navigate("CategoryDetailScreen", {
          categoryId: item.id,
          categoryTitle: item.name, // Truyền tên đã dịch sang màn hình chi tiết
          categoryDbValue: item.dbValue, // Truyền giá trị gốc để query DB
        })
      }
    >
      {/* Ảnh */}
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </View>

      {/* Thông tin */}
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
              ? `${item.recipe_count} ${t("recipe.items_count")}`
              : t("profile.no_recipes")}
          </AppText>
        </View>
      </View>
    </Pressable>
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <AppHeader
          title={t("category.screen_title")} // Dịch tiêu đề
          showSearch={true}
          showNotifications={true}
          showBack={false}
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

        {/* MODAL SEARCH */}
        <AppSearchModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onSubmit={handleSearchSubmit}
        />

        {/* BOTTOM TAB */}
        <AppMainNavBar
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            // Logic chuyển tab nếu cần (thường AppMainNavBar tự xử lý navigate)
             if (tab !== "category") {
                // Ví dụ: navigation.navigate(...)
                // Tùy logic điều hướng của bạn
             }
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

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  imageWrap: {
    height: 130,
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