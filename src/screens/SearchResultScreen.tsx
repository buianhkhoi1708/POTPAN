import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppRecipeCard from "../components/AppRecipeCard";
import AppHeader from "../components/AppHeader";
import { AppLightColor } from "../styles/color";
import { SearchFilters } from "../components/AppSearchModal";
import { useRecipeStore } from "../store/useRecipeStore";

// --- CẤU HÌNH LAYOUT GRID ---
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // (Màn hình - Padding 2 bên - Gap giữa) / 2

// --- SORT OPTIONS ---
const SORT_OPTIONS = [
  { id: "match", label: "Phù hợp" },
  { id: "rating", label: "Đánh giá cao" },
  { id: "newest", label: "Mới nhất" },
  { id: "time", label: "Nấu nhanh" },
];

const SearchResultScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  
  // 👇 1. Lấy tất cả params có thể có
  const { 
    filters,              // Dùng cho Search thường
    recipes: directRecipes, // Dùng cho Fridge (dữ liệu truyền trực tiếp)
    title: customTitle,   // Tiêu đề tùy chỉnh (VD: "Gợi ý từ tủ lạnh")
    searchQuery,          // Chuỗi hiển thị (VD: "Trứng, Thịt bò")
    isFridgeSearch        // Cờ nhận biết
  } = route.params || {};

  // Store cho search thường
  const { searchResults, isLoading, searchRecipes, resetSearch } = useRecipeStore();

  // State local để hiển thị và sắp xếp
  const [displayList, setDisplayList] = useState<any[]>([]);
  const [activeSort, setActiveSort] = useState("match");

  // --- 2. XỬ LÝ DỮ LIỆU ĐẦU VÀO ---
  useEffect(() => {
    if (isFridgeSearch && directRecipes) {
      // CASE A: Từ Tủ lạnh -> Dùng dữ liệu truyền qua params
      setDisplayList(directRecipes);
    } else if (filters) {
      // CASE B: Từ Search Bar -> Gọi Store để tìm kiếm
      searchRecipes(filters);
    }
    
    return () => {
      // Chỉ reset store nếu là search thường
      if (!isFridgeSearch) resetSearch();
    };
  }, [filters, directRecipes, isFridgeSearch]);

  // Đồng bộ dữ liệu từ Store vào State local (cho Case B)
  useEffect(() => {
    if (!isFridgeSearch && searchResults) {
      setDisplayList(searchResults);
    }
  }, [searchResults, isFridgeSearch]);

  // --- 3. XỬ LÝ SẮP XẾP (CLIENT SIDE) ---
  const sortedList = useMemo(() => {
    let list = [...displayList];
    switch (activeSort) {
      case "rating":
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      case "time":
        // Sắp xếp đơn giản chuỗi text (cần xử lý kỹ hơn nếu muốn chính xác phút)
        return list.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
      case "match":
      default:
        return list; // Giữ nguyên thứ tự gốc
    }
  }, [displayList, activeSort]);

  // --- RENDER ---

  const renderItem = ({ item }: { item: any }) => (
    <AppRecipeCard
      item={item}
      // 👇 Dùng style đè để tạo Grid, đảm bảo AppRecipeCard hỗ trợ style prop
      style={{ width: CARD_WIDTH, marginBottom: 16 }}
      variant="grid" // Hoặc "featured" nếu component chưa hỗ trợ "grid"
      onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
    />
  );

  const getHeaderTitle = () => {
    if (customTitle) return customTitle;
    return t("search.results.title"); // "Kết quả tìm kiếm"
  };

  const getSummaryText = () => {
    if (isFridgeSearch) {
      return `${t("fridge.ingredients")}: ${searchQuery}`;
    }
    return t("search.results.summary", { 
      count: displayList.length, 
      keyword: filters?.keyword || t("search.results.my_filter") 
    });
  };

  return (
    <AppSafeView style={styles.container}>
      <AppHeader 
        title={getHeaderTitle()} 
        showBack={true} 
        onBackPress={() => navigation.goBack()}
        showSearch={false} 
      />

      {/* THANH SORT & SUMMARY */}
      <View style={styles.filterBar}>
        <View style={styles.summary}>
          <AppText style={styles.summaryText} numberOfLines={1}>
            {getSummaryText()}
          </AppText>
        </View>
        
        {/* Sort Chips */}
        <FlatList
          horizontal
          data={SORT_OPTIONS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginTop: 8 }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => {
            const isActive = activeSort === item.id;
            return (
              <Pressable
                style={[styles.sortChip, isActive && styles.sortChipActive]}
                onPress={() => setActiveSort(item.id)}
              >
                <AppText style={[styles.sortText, isActive && styles.sortTextActive]}>
                  {item.label}
                </AppText>
              </Pressable>
            );
          }}
        />
      </View>

      {/* CONTENT */}
      {(isLoading && !isFridgeSearch) ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={AppLightColor.primary_color} />
          <AppText style={styles.loadingText}>{t("common.loading")}</AppText>
        </View>
      ) : displayList.length > 0 ? (
        <FlatList
          data={sortedList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          // 👇 Cấu hình Grid 2 cột
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerBox}>
          <Ionicons name="search" size={60} color="#e0e0e0" />
          <AppText variant="bold" style={styles.emptyTitle}>
            {t("search.results.not_found")}
          </AppText>
          <AppText style={styles.emptySub}>
            {isFridgeSearch 
              ? t("fridge.no_recipes") 
              : t("search.results.empty_hint")}
          </AppText>
        </View>
      )}
    </AppSafeView>
  );
};

export default SearchResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  
  filterBar: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summary: { 
    paddingHorizontal: 20, 
    paddingTop: 8, 
  },
  summaryText: { 
    color: "#666", 
    fontSize: 14,
    fontStyle: "italic" 
  },

  // Sort Styles
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  sortChipActive: {
    backgroundColor: AppLightColor.primary_color,
    borderColor: AppLightColor.primary_color,
  },
  sortText: { fontSize: 12, color: "#666" },
  sortTextActive: { color: "#fff", fontWeight: "bold" },

  // List Styles
  listContent: { 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 40 
  },
  columnWrapper: {
    justifyContent: "space-between", // Đẩy 2 thẻ ra 2 bên
  },
  
  centerBox: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  loadingText: { marginTop: 12, color: "#888" },
  emptyTitle: { marginTop: 16, fontSize: 18, color: "#333" },
  emptySub: { marginTop: 8, textAlign: "center", color: "#888", lineHeight: 20 },
});