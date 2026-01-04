import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppRecipeCard from "../components/AppRecipeCard";
import AppHeader from "../components/AppHeader";
import AppBottomSpace from "../components/AppBottomSpace";
import { useThemeStore } from "../store/useThemeStore";

const { width } = Dimensions.get("window");
const PADDING = 16;
const GAP = 12;
const CARD_WIDTH = (width - PADDING * 2 - GAP) / 2;

const CategoryDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const { categoryTitle, categoryDbValue } = route.params || {};
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipesByCategory();
  }, [categoryDbValue]);

  const fetchRecipesByCategory = async () => {
    try {
      setLoading(true);
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


  const renderItem = ({ item }: { item: any }) => (
    <AppRecipeCard
      item={item}
      variant="small"
      style={{ 
        width: CARD_WIDTH, 
        marginBottom: 16,
        backgroundColor: theme.background_contrast, 
        borderColor: theme.border, 
        borderWidth: isDarkMode ? 1 : 0, 
      }}
      onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
    />
  );

  return (

    <AppSafeView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        
        {/* HEADER */}
        <AppHeader 
          title={categoryTitle || t("category.screen_title")}
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showSearch={false}
        />

        {/* CONTENT */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.primary_color} />
          </View>
        ) : recipes.length === 0 ? (
          // Empty State
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="file-tray-outline" 
              size={64} 
              color={isDarkMode ? theme.icon : "#ddd"} 
            />
            <AppText style={[styles.emptyText, { color: theme.placeholder_text }]}>
              {t("profile.no_recipes")}
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
  safeArea: { 
    flex: 1 
  },
  container: { 
    flex: 1 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
});