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
import { useRecipeStore } from "../store/useRecipeStore";

// --- CẤU HÌNH LAYOUT GRID ---
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const SearchResultScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();

  // Params
  const {
    filters,
    recipes: directRecipes,
    title: customTitle,
    searchQuery,
    isFridgeSearch,
  } = route.params || {};

  const { searchResults, isLoading, searchRecipes, resetSearch } =
    useRecipeStore();
  const [displayList, setDisplayList] = useState<any[]>([]);
  const [activeSort, setActiveSort] = useState("match");

  // --- 1. ĐỊNH NGHĨA SORT OPTIONS VỚI DỊCH THUẬT ---
  // Phải dùng useMemo để danh sách tự cập nhật khi đổi ngôn ngữ
  const sortOptions = useMemo(
    () => [
      { id: "match", label: t("search.sort.match") }, // "Phù hợp"
      { id: "rating", label: t("search.sort.rating") }, // "Đánh giá cao"
      { id: "newest", label: t("search.sort.newest") }, // "Mới nhất"
      { id: "time", label: t("search.sort.time") }, // "Nấu nhanh"
    ],
    [t]
  );

  // --- 2. XỬ LÝ DỮ LIỆU ---
  useEffect(() => {
    if (isFridgeSearch && directRecipes) {
      setDisplayList(directRecipes);
    } else if (filters) {
      searchRecipes(filters);
    }
    return () => {
      if (!isFridgeSearch) resetSearch();
    };
  }, [filters, directRecipes, isFridgeSearch]);

  useEffect(() => {
    if (!isFridgeSearch && searchResults) {
      setDisplayList(searchResults);
    }
  }, [searchResults, isFridgeSearch]);

  // --- 3. XỬ LÝ SẮP XẾP ---
  const sortedList = useMemo(() => {
    let list = [...displayList];
    switch (activeSort) {
      case "rating":
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return list.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        );
      case "time":
        return list.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
      case "match":
      default:
        return list;
    }
  }, [displayList, activeSort]);

  // --- HELPER TEXT ---
  const getHeaderTitle = () => {
    if (customTitle) return customTitle;
    return t("search.header_title"); // "Kết quả tìm kiếm"
  };

  const getSummaryText = () => {
    if (isFridgeSearch) {
      return `${t("fridge.ingredients_label")}: ${searchQuery}`;
    }
    // Sử dụng interpolation của i18next: "Tìm thấy {{count}} kết quả cho {{keyword}}"
    return t("search.summary_text", {
      count: displayList.length,
      keyword: filters?.keyword || t("search.default_filter_name"),
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <AppRecipeCard
      item={item}
      style={{ width: CARD_WIDTH, marginBottom: 16 }}
      onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
    />
  );

  return (
    <AppSafeView style={styles.container}>
      <AppHeader
        title={getHeaderTitle()}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showSearch={false}
      />

      {/* FILTER BAR */}
      <View style={styles.filterBar}>
        <View style={styles.summary}>
          <AppText style={styles.summaryText} numberOfLines={1}>
            {getSummaryText()}
          </AppText>
        </View>

        {/* Sort Chips */}
        <FlatList
          horizontal
          data={sortOptions} // Sử dụng mảng đã dịch
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
                <AppText
                  style={[styles.sortText, isActive && styles.sortTextActive]}
                >
                  {item.label}
                </AppText>
              </Pressable>
            );
          }}
        />
      </View>

      {/* LIST CONTENT */}
      {isLoading && !isFridgeSearch ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={AppLightColor.primary_color} />
          <AppText style={styles.loadingText}>{t("common.loading")}</AppText>
        </View>
      ) : displayList.length > 0 ? (
        <FlatList
          data={sortedList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerBox}>
          <Ionicons name="search" size={60} color="#e0e0e0" />
          <AppText variant="bold" style={styles.emptyTitle}>
            {t("search.not_found_title")}
          </AppText>
          <AppText style={styles.emptySub}>
            {isFridgeSearch
              ? t("fridge.not_found_desc")
              : t("search.not_found_desc")}
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
  summary: { paddingHorizontal: 20, paddingTop: 8 },
  summaryText: { color: "#666", fontSize: 14, fontStyle: "italic" },
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
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  columnWrapper: { justifyContent: "space-between" },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  loadingText: { marginTop: 12, color: "#888" },
  emptyTitle: { marginTop: 16, fontSize: 18, color: "#333" },
  emptySub: {
    marginTop: 8,
    textAlign: "center",
    color: "#888",
    lineHeight: 20,
  },
});
