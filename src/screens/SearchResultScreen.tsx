import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppRecipeCard from "../components/AppRecipeCard";
import AppHeader from "../components/AppHeader";
import { AppLightColor } from "../styles/color";
import { SearchFilters } from "../components/AppSearchModal";
import { useRecipeStore } from "../store/useRecipeStore"; // 👈 Import Store

const SearchResultScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const filters: SearchFilters = route.params?.filters || {};
  
  // Lấy state & actions từ Store
  const { searchResults, isLoading, searchRecipes, resetSearch } = useRecipeStore();

  useEffect(() => {
    // Gọi action tìm kiếm
    searchRecipes(filters);
    
    // Clear kết quả khi component unmount
    return () => resetSearch();
  }, [filters]); // Chạy lại khi filters thay đổi

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemWrapper}>
      <AppRecipeCard
        item={item}
        variant="featured"
        onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
        style={styles.cardStyle}
      />
    </View>
  );

  return (
    <AppSafeView style={styles.container}>
      <AppHeader 
        title={t("search.results.title")} 
        showBack={true} 
        onBackPress={() => navigation.goBack()}
        showSearch={false} 
      />

      <View style={styles.summary}>
        <AppText style={styles.summaryText}>
          {t("search.results.summary", { 
            count: searchResults.length, 
            keyword: filters.keyword || t("search.results.my_filter") 
          })}
        </AppText>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={AppLightColor.primary_color} />
          <AppText style={styles.loadingText}>{t("common.loading")}</AppText>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
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
            {t("search.results.empty_hint")}
          </AppText>
        </View>
      )}
    </AppSafeView>
  );
};

export default SearchResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  summary: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: "#f9f9f9" },
  summaryText: { color: "#666", fontSize: 14 },
  listContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  itemWrapper: { marginBottom: 20, alignItems: "center" },
  cardStyle: { width: "100%" },
  centerBox: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  loadingText: { marginTop: 12, color: "#888" },
  emptyTitle: { marginTop: 16, fontSize: 18, color: "#333" },
  emptySub: { marginTop: 8, textAlign: "center", color: "#888", lineHeight: 20 },
});