// Nhóm 9 - IE307.Q12
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
import { useRecipeStore } from "../store/useRecipeStore";
import { useThemeStore } from "../store/useThemeStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const SearchResultScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
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
  const sortOptions = useMemo(
    () => [
      { id: "match", label: t("search.sort.match") },
      { id: "rating", label: t("search.sort.rating") },
      { id: "newest", label: t("search.sort.newest") },
      { id: "time", label: t("search.sort.time") },
    ],
    [t]
  );

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

  const getHeaderTitle = () => {
    if (customTitle) return customTitle;
    return t("search.header_title");
  };

  const getSummaryText = () => {
    if (isFridgeSearch) {
      return `${t("fridge.ingredients_label")}: ${searchQuery}`;
    }
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
    <AppSafeView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <AppHeader
        title={getHeaderTitle()}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showSearch={true}
      />

      <View style={[styles.filterBar, { borderBottomColor: theme.border }]}>
        <View style={styles.summary}>
          <AppText
            style={[styles.summaryText, { color: theme.placeholder_text }]}
            numberOfLines={1}
          >
            {getSummaryText()}
          </AppText>
        </View>

        <FlatList
          horizontal
          data={sortOptions}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginTop: 8 }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => {
            const isActive = activeSort === item.id;
            return (
              <Pressable
                style={[
                  styles.sortChip,

                  {
                    backgroundColor: isActive
                      ? theme.primary_color
                      : theme.background_contrast,
                    borderColor: isActive ? theme.primary_color : theme.border,
                  },
                ]}
                onPress={() => setActiveSort(item.id)}
              >
                <AppText
                  style={[
                    styles.sortText,

                    {
                      color: isActive ? "#fff" : theme.placeholder_text,
                      fontWeight: isActive ? "bold" : "normal",
                    },
                  ]}
                >
                  {item.label}
                </AppText>
              </Pressable>
            );
          }}
        />
      </View>

      {isLoading && !isFridgeSearch ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={theme.primary_color} />
          <AppText
            style={[styles.loadingText, { color: theme.placeholder_text }]}
          >
            {t("common.loading")}
          </AppText>
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
          <Ionicons name="search" size={60} color={theme.border} />
          <AppText
            variant="bold"
            style={[styles.emptyTitle, { color: theme.primary_text }]}
          >
            {t("search.not_found_title")}
          </AppText>
          <AppText style={[styles.emptySub, { color: theme.placeholder_text }]}>
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
  container: { 
    flex: 1 
  },
  filterBar: {
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  summary: { 
    paddingHorizontal: 20, 
    paddingTop: 8 
  },
  summaryText: { 
    fontSize: 14, 
    fontStyle: "italic" 
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  sortText: { 
    fontSize: 12 
  },
  listContent: { 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 40 
  },
  columnWrapper: { 
    justifyContent: "space-between" 
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  loadingText: { 
    marginTop: 12 
  },
  emptyTitle: { 
    marginTop: 16, 
    fontSize: 18 
  },
  emptySub: {
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
