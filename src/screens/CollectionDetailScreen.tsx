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

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppRecipeCard from "../components/AppRecipeCard";
import { supabase } from "../config/supabaseClient";
import { AppLightColor } from "../styles/color";
import { useAuthStore } from "../store/useAuthStore";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 16;

const CollectionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { collectionId, collectionName } = route.params as {
    collectionId: number | null;
    collectionName: string;
  };
  const { user } = useAuthStore();

  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollectionRecipes();
  }, [collectionId]);

  const fetchCollectionRecipes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Logic query:
      // 1. Vào bảng 'saved_recipes'
      // 2. Lọc theo collection_id (nếu null thì tìm các món không có collection_id)
      // 3. Join bảng 'recipes' để lấy thông tin chi tiết món ăn

      let query = supabase
        .from("saved_recipes")
        .select(
          `
          recipe:recipes (*)
        `
        )
        .eq("user_id", user.id);

      if (collectionId === null) {
        // Nếu là mục "Yêu thích chung" -> collection_id là null
        query = query.is("collection_id", null);
      } else {
        // Nếu là bộ sưu tập cụ thể
        query = query.eq("collection_id", collectionId);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // Data trả về dạng [{ recipe: {...} }, { recipe: {...} }]
        // Cần map lại thành mảng phẳng [{...}, {...}]
        const mappedRecipes = data
          .map((item: any) => item.recipe)
          .filter((r: any) => r !== null); // Lọc bỏ recipe null (phòng trường hợp món gốc bị xóa)

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
        variant="featured" // Dùng variant này để ảnh to đẹp
        onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
        style={styles.cardStyle}
      />
    </View>
  );

  return (
    <AppSafeView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <View style={styles.titleContainer}>
          <AppText variant="bold" style={styles.headerTitle} numberOfLines={1}>
            {collectionName}
          </AppText>
          <AppText style={styles.subtitle}>{recipes.length} món ăn</AppText>
        </View>
        <View style={{ width: 32 }} />
        {/* Placeholder để cân giữa title nếu cần thêm nút bên phải sau này */}
      </View>

      {/* BODY */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={AppLightColor.primary_color} />
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
              <Ionicons name="folder-open-outline" size={64} color="#ddd" />
              <AppText style={styles.emptyText}>
                Chưa có món nào trong bộ sưu tập này.
              </AppText>
              <Pressable
                style={styles.exploreBtn}
                onPress={() => navigation.navigate("HomeScreen")}
              >
                <AppText variant="bold" style={{ color: "#fff" }}>
                  Khám phá ngay
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
  container: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: { padding: 4 },
  titleContainer: { alignItems: "center", flex: 1, paddingHorizontal: 16 },
  headerTitle: { fontSize: 18, color: "#333", textAlign: "center" },
  subtitle: { fontSize: 12, color: "#888", marginTop: 2 },

  // List
  listContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  itemWrapper: { marginBottom: 20, alignItems: "center" },
  cardStyle: { width: "100%" }, // AppRecipeCard sẽ tự fill chiều ngang

  // Empty & Loading State
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    color: "#999",
    fontSize: 15,
    marginBottom: 20,
  },
  exploreBtn: {
    backgroundColor: AppLightColor.primary_color,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
});
