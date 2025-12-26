import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// --- COMPONENTS & CONFIG ---
import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppRecipeCard from "../components/AppRecipeCard";
import AppBottomSpace from "../components/AppBottomSpace"; // Để tránh bị che bởi iPhone Home Indicator
import { AppLightColor } from "../styles/color";

const { width } = Dimensions.get("window");
// Tính toán kích thước card cho Grid 2 cột
const PADDING = 16;
const GAP = 12;
const CARD_WIDTH = (width - PADDING * 2 - GAP) / 2;

const CategoryDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();

  // Lấy params truyền từ màn hình Categories
  const { categoryTitle, categoryDbValue } = route.params || {};

  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipesByCategory();
  }, [categoryDbValue]);

  const fetchRecipesByCategory = async () => {
    try {
      setLoading(true);
      // Query database: lấy tất cả recipes có category trùng khớp
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("category", categoryDbValue)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.log("Lỗi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ITEM (Tái sử dụng AppRecipeCard) ---
  const renderItem = ({ item }: { item: any }) => (
    <AppRecipeCard
      item={item}
      variant="small"
      style={{ width: CARD_WIDTH, marginBottom: 16 }}
      onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
    />
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- HEADER (Có nút Back) --- */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={24} color={AppLightColor.primary_text} />
          </Pressable>
          
          <View style={styles.titleWrapper}>
            <AppText variant="bold" style={styles.headerTitle} numberOfLines={1}>
              {categoryTitle || t("common.categories")}
            </AppText>
          </View>

          {/* Dummy view để cân bằng layout header */}
          <View style={{ width: 40 }} />
        </View>

        {/* --- CONTENT --- */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={AppLightColor.primary_color} />
          </View>
        ) : recipes.length === 0 ? (
          // Empty State
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={64} color="#ddd" />
            <AppText style={styles.emptyText}>
              {t("profile.no_recipes")} {/* "Chưa có món ăn nào" */}
            </AppText>
          </View>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: PADDING,
              paddingTop: 16,
            }}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            renderItem={renderItem}
            ListFooterComponent={<AppBottomSpace height={40} />}
          />
        )}
      </View>
    </AppSafeView>
  );
};

export default CategoryDetailScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#F5F5F5", // Nền xám nhẹ cho nút back
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: AppLightColor.primary_text,
    textAlign: "center",
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40, // Đẩy lên một chút cho cân đối
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },
});