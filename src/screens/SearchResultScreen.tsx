import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next"; // 1. Import i18n
import Ionicons from "@expo/vector-icons/Ionicons";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppRecipeCard from "../components/AppRecipeCard";
import AppHeader from "../components/AppHeader"; // 2. Header chung
import { supabase } from "../config/supabaseClient";
import { AppLightColor } from "../styles/color";
import { SearchFilters } from "../components/AppSearchModal";

const SearchResultScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation(); // 3. Hook dịch
  const filters: SearchFilters = route.params?.filters || {};
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        let query = supabase.from("recipes").select("*");

        if (filters.keyword) {
          query = query.or(
            `title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`
          );
        }

        if (filters.category) {
          query = query.eq("category", filters.category);
        }

        if (filters.difficulty) {
          query = query.eq("difficulty", filters.difficulty);
        }

        if (filters.cuisine) {
          if (filters.cuisine === "Vietnam") {
            query = query.ilike("cuisine", "%Việt Nam%");
          } else {
            query = query.not("cuisine", "ilike", "%Việt Nam%");
          }
        }

        const { data, error } = await query;
        if (error) throw error;

        let result = data || [];

        // Lọc Client-side cho Time (do DB lưu dạng text hoặc phút)
        if (filters.time) {
          result = result.filter((item) => {
            const match = String(item.time).match(/(\d+)/);
            const minutes = match ? parseInt(match[0]) : 0;

            if (filters.time === "under_30") return minutes > 0 && minutes < 30;
            if (filters.time === "30_60") return minutes >= 30 && minutes <= 60;
            if (filters.time === "over_60") return minutes > 60;
            return true;
          });
        }

        setRecipes(result);
      } catch (err) {
        console.log("Lỗi query:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [filters]);

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
      {/* SỬ DỤNG HEADER CHUNG */}
      <AppHeader 
        title={t("search1.result_title")} 
        showBack={true} 
        onBackPress={() => navigation.goBack()}
        showSearch={false} // Đang ở trang kết quả thì ẩn nút search
      />

      {/* SUMMARY VỚI DỊCH THUẬT BIẾN SỐ */}
      <View style={styles.summary}>
        <AppText style={styles.summaryText}>
          {t("search1.summary", { 
            count: recipes.length, 
            keyword: filters.keyword || t("search1.all_recipes") 
          })}
        </AppText>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={AppLightColor.primary_color} />
          <AppText style={styles.loadingText}>{t("common.loading")}</AppText>
        </View>
      ) : recipes.length > 0 ? (
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerBox}>
          <Ionicons name="search" size={60} color="#e0e0e0" />
          <AppText variant="bold" style={styles.emptyTitle}>
            {t("search1.no_result")}
          </AppText>
          <AppText style={styles.emptySub}>
            {t("search1.empty_hint")}
          </AppText>
        </View>
      )}
    </AppSafeView>
  );
};

export default SearchResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  summary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
  },
  summaryText: { color: "#666", fontSize: 14 },
  listContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  itemWrapper: { marginBottom: 20, alignItems: "center" },
  cardStyle: { width: "100%" },
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