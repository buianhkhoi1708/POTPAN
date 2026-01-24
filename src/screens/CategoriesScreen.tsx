// Nhóm 9 - IE307.Q12
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppBottomSpace from "../components/AppBottomSpace";
import AppSearchModal, { SearchFilters } from "../components/AppSearchModal";
import AppHeader from "../components/AppHeader";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../store/useThemeStore";
import AppCategoryCard from "../components/AppCategoryCard";
import { CategoryItem } from "../type/types";

const { width } = Dimensions.get("window");

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
  const { t } = useTranslation();
  const { theme } = useThemeStore(); 
  const [displayCategories, setDisplayCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTabKey>("category");
  const paddingHorizontal = 20;
  const gap = 16;
  const itemWidth = (width - paddingHorizontal * 2 - gap) / 2;

  useEffect(() => {
    if (isFocused) setActiveTab("category");
  }, [isFocused]);

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
          name: t(`category.${cat.key}`),
          recipe_count: count || 0,
        };
      });
      const updatedCategories = await Promise.all(promises);
      setDisplayCategories(updatedCategories);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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

  const renderItem = ({ item }: { item: CategoryItem }) => (
    <AppCategoryCard
      item={item}
      width={itemWidth}
      onPress={() =>
        navigation.navigate("CategoryDetailScreen", {
          categoryId: item.id,
          categoryTitle: item.name,
          categoryDbValue: item.dbValue,
        })
      }
    />
  );

  return (
    <AppSafeView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <AppHeader
          title={t("category.screen_title")}
          showSearch={true}
          showNotifications={true}
          showBack={false}
          onBackPress={() => navigation.goBack()}
        />

        {loading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.primary_color} />
          </View>
        ) : (
          <FlatList
            data={displayCategories}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{
              paddingHorizontal: paddingHorizontal,
              paddingTop: 10,
              paddingBottom: 20,
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
                tintColor={theme.primary_color}
                progressBackgroundColor={theme.background_contrast}
                colors={[theme.primary_color]}
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
});