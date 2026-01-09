// Nhóm 9 - IE307.Q12
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppRecipeCard from "../components/AppRecipeCard";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const CollectionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { theme, isDarkMode } = useThemeStore();
  const { collectionId, collectionName } = route.params as {
    collectionId: number | null;
    collectionName: string;
  };
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollectionRecipes();
  }, [collectionId]);

  const fetchCollectionRecipes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase
        .from("saved_recipes")
        .select(`recipe:recipes (*)`)
        .eq("user_id", user.id);

      if (collectionId === null) {
        query = query.is("collection_id", null);
      } else {
        query = query.eq("collection_id", collectionId);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) {
        const mappedRecipes = data
          .map((item: any) => item.recipe)
          .filter((r: any) => r !== null);
        setRecipes(mappedRecipes);
      }
    } catch (error) {
      console.log("Lỗi tải bộ sưu tập:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <AppSafeView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: theme.border,
            backgroundColor: theme.background,
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={24} color={theme.primary_text} />
        </Pressable>

        <View style={styles.titleContainer}>
          <AppText
            variant="bold"
            style={[styles.headerTitle, { color: theme.primary_text }]}
            numberOfLines={1}
          >
            {collectionName}
          </AppText>
          <AppText style={[styles.subtitle, { color: theme.placeholder_text }]}>
            {recipes.length} {t("collection.count_suffix")}
          </AppText>
        </View>

        <View style={{ width: 32 }} />
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={theme.primary_color} />
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerBox}>
              <Ionicons
                name="folder-open-outline"
                size={64}
                color={isDarkMode ? theme.icon : "#ddd"}
              />
              <AppText
                style={[styles.emptyText, { color: theme.placeholder_text }]}
              >
                {t("collection.empty_msg")}
              </AppText>

              <Pressable
                style={[
                  styles.exploreBtn,
                  { backgroundColor: theme.primary_color },
                ]}
                onPress={() => navigation.navigate("HomeScreen")}
              >
                <AppText variant="bold" style={{ color: "#fff" }}>
                  {t("collection.explore")}
                </AppText>
              </Pressable>
            </View>
          }
        />
      )}
    </AppSafeView>
  );
};

export default CollectionDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  titleContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  itemWrapper: {
    marginBottom: 20,
    alignItems: "center",
  },
  cardStyle: {
    width: "100%",
  },

  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    marginBottom: 20,
  },
  exploreBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
});
