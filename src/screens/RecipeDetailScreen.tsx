import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Share,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppBottomSpace from "../components/AppBottomSpace";

// --- MODALS ---
import AppCookingModeModal from "../components/AppCookingModeModal";
import AppCongratulationsModal from "../components/AppCongratulationsModal";
import AppCollectionModal from "../components/AppCollectionModal";

// --- STORES & UTILS ---
import { useAuthStore } from "../store/useAuthStore";
import { useRecipeStore } from "../store/useRecipeStore";
import { useCollectionStore } from "../store/useCollectionStore";
import { AppLightColor } from "../styles/color";
import { formatRecipeTime } from "../utils/format";

const PRIMARY_COLOR = AppLightColor.primary_color;


const DIFFICULTY_MAP: Record<string, string> = {
  Dễ: "easy",
  "Trung bình": "medium",
  Khó: "hard",
};

// IE307.Q12_Nhom9

const RecipeDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { t } = useTranslation();

  const { item: initialItem } = route.params as { item: any };
  const { user: currentUser } = useAuthStore();

  // Actions từ Store
  const { deleteRecipe } = useRecipeStore();
  const { savedRecipeIds, fetchSavedIds, toggleSave } = useCollectionStore();

  // Local State
  const [item, setItem] = useState(initialItem);
  const [author, setAuthor] = useState<any>(null);

  // Modal State
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);

  const [lastCookingTime, setLastCookingTime] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTabKey>("home");

  const scrollY = useRef(new Animated.Value(0)).current;

  // Derived State
  const isMe = currentUser?.id === item.user_id;
  const isBookmarked = savedRecipeIds.includes(item.id);

  // --- 1. RELOAD DATA & CHECK STATUS ---
  useEffect(() => {
    const fetchLatestData = async () => {
      // Lấy dữ liệu mới nhất (đề phòng vừa sửa xong)
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", initialItem.id)
        .single();
      if (data) setItem(data);
    };

    const unsubscribe = navigation.addListener("focus", () => {
      fetchLatestData();
      if (currentUser) fetchSavedIds(currentUser.id);
    });

    // Gọi lần đầu khi mount
    if (currentUser) fetchSavedIds(currentUser.id);

    return unsubscribe;
  }, [navigation, initialItem.id, currentUser]);

  // --- 2. LẤY INFO TÁC GIẢ ---
  useEffect(() => {
    const fetchAuthor = async () => {
      if (!item.user_id) return;
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", item.user_id)
        .single();
      if (data) setAuthor(data);
    };
    fetchAuthor();
  }, [item.user_id]);

  // --- HANDLERS ---

  const handleEditPress = () => {
    navigation.navigate("CreateRecipeScreen", {
      isEdit: true,
      recipeData: item,
    });
  };

  const handleDeletePress = () => {
    Alert.alert(t("alert.delete_recipe_title"), t("alert.delete_recipe_msg"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("alert.confirm_delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteRecipe(item.id);
            Alert.alert(t("common.success"), t("alert.delete_recipe_success"));
            navigation.goBack();
          } catch (err) {
            Alert.alert(t("common.error"), t("alert.delete_recipe_error"));
          }
        },
      },
    ]);
  };

  const handleBookmarkPress = async () => {
    if (!currentUser) {
      Alert.alert(t("common.error"), t("review.alert_login"));
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (isBookmarked) {
      // Đã lưu -> Hỏi tùy chọn
      Alert.alert(
        t("recipe_detail.options_title"),
        t("recipe_detail.already_saved_msg"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("recipe_detail.remove_save"), // Bỏ lưu
            style: "destructive",
            onPress: async () => {
              await toggleSave(currentUser.id, item.id);
              Alert.alert(
                t("common.success"),
                t("recipe_detail.remove_success")
              );
            },
          },
          {
            text: t("recipe_detail.change_collection"), // Đổi collection
            onPress: () => setCollectionModalVisible(true),
          },
        ]
      );
    } else {
      // Chưa lưu -> Mở modal chọn Collection
      setCollectionModalVisible(true);
    }
  };

  const onSavedSuccess = () => {
    if (currentUser) fetchSavedIds(currentUser.id);
    Alert.alert(t("common.success"), t("recipe_detail.save_success"));
  };

  const handleCompleteCooking = async (timeUsed: number) => {
    setIsCookingMode(false);
    setLastCookingTime(timeUsed);
    setTimeout(() => {
      setShowCongratulations(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 400);

    if (currentUser) {
      await supabase.from("cooking_history").insert({
        user_id: currentUser.id,
        recipe_id: item.id,
        recipe_title: item.title,
        completed_at: new Date().toISOString(),
        time_used: timeUsed,
      });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${item.title} - ${t("recipe_detail.share_suffix")}`,
        title: item.title,
      });
    } catch (error) {
      Alert.alert(t("common.error"), t("recipe_detail.share_error"));
    }
  };

  // --- ANIMATIONS ---
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const headerBg = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"],
    extrapolate: "clamp",
  });

  const FadingIcon = ({
    name,
    size = 24,
    colorOverride,
  }: {
    name: any;
    size?: number;
    colorOverride?: string;
  }) => (
    <View style={{ width: size, height: size }}>
      <Ionicons
        name={name}
        size={size}
        color={colorOverride || "#fff"}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: headerOpacity }]}
      >
        <Ionicons
          name={name}
          size={size}
          color={colorOverride || PRIMARY_COLOR}
        />
      </Animated.View>
    </View>
  );

  return (
    <AppSafeView style={styles.container}>
      {/* --- MODALS --- */}
      <AppCookingModeModal
        visible={isCookingMode}
        onClose={() => setIsCookingMode(false)}
        item={item}
        onCompleteCooking={handleCompleteCooking}
      />
      <AppCongratulationsModal
        visible={showCongratulations}
        onClose={() => setShowCongratulations(false)}
        onShare={handleShare}
        recipeTitle={item.title}
        totalSteps={item.steps?.length || 0}
        timeUsed={lastCookingTime}
      />

      {/* Modal Collection */}
      <AppCollectionModal
        visible={collectionModalVisible}
        onClose={() => setCollectionModalVisible(false)}
        recipeId={item.id}
        onSaved={onSavedSuccess}
      />

      {/* --- HEADER --- */}
      <Animated.View
        style={[
          styles.fixedHeader,
          {
            backgroundColor: headerBg,
            borderBottomWidth: headerOpacity,
            borderBottomColor: "#eee",
          },
        ]}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <FadingIcon name="arrow-back" />
        </Pressable>
        <Animated.Text
          style={[styles.fixedHeaderTitle, { opacity: headerOpacity }]}
          numberOfLines={1}
        >
          {item.title}
        </Animated.Text>

        <View style={styles.headerRight}>
          {isMe ? (
            <>
              <Pressable onPress={handleEditPress} style={styles.headerBtn}>
                <FadingIcon name="create-outline" />
              </Pressable>
              <Pressable onPress={handleDeletePress} style={styles.headerBtn}>
                <FadingIcon name="trash-outline" />
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={handleBookmarkPress} style={styles.headerBtn}>
                <FadingIcon
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                />
              </Pressable>
              <Pressable onPress={handleShare} style={styles.headerBtn}>
                <FadingIcon name="share-social-outline" />
              </Pressable>
            </>
          )}
        </View>
      </Animated.View>

      {/* --- CONTENT --- */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.thumbnail || "https://via.placeholder.com/400",
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <AppText variant="bold" style={styles.title}>
              {item.title}
            </AppText>
            <Pressable
              style={styles.ratingBtn}
              onPress={() =>
                navigation.navigate("ReviewScreen", {
                  recipeId: item.id,
                  recipeTitle: item.title,
                })
              }
            >
              <Ionicons name="star" size={16} color="#FFC107" />
              <AppText variant="bold" style={styles.statText}>
                {item.rating ? item.rating.toFixed(1) : "5.0"}
              </AppText>
              <AppText style={styles.ratingLinkText}>
                ({t("recipe_detail.view")})
              </AppText>
              <Ionicons name="chevron-forward" size={14} color="#666" />
            </Pressable>
          </View>

          <View style={styles.authorCard}>
            <View style={styles.authorLeft}>
              <Image
                source={{
                  uri:
                    author?.avatar_url ||
                    "https://vfqnjeoqxxapqqurdkoi.supabase.co/storage/v1/object/public/avatars/users/default.jpg",
                }}
                style={styles.authorAvatar}
              />
              <View style={styles.authorInfo}>
                <AppText style={styles.authorLabel}>
                  {t("recipe_detail.cooked_by")}
                </AppText>
                <AppText variant="bold" style={styles.authorName}>
                  {author?.full_name || t("recipe_detail.chef_default")}
                </AppText>
              </View>
            </View>
            {!isMe && (
              <Pressable
                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                onPress={() => setIsFollowing(!isFollowing)}
              >
                <AppText
                  variant="bold"
                  style={[
                    styles.followText,
                    isFollowing && styles.followingText,
                  ]}
                >
                  {isFollowing ? t("chef.following") : t("chef.follow")}
                </AppText>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="bold" style={styles.sectionTitle}>
            {t("recipe_detail.description")}
          </AppText>
          <AppText style={styles.description}>
            {item.description || t("recipe_detail.no_description")}
          </AppText>
        </View>

        {/* THÔNG TIN CHI TIẾT (Time, Difficulty, Category) */}
        <View style={styles.infoRow}>
          {/* Thời gian */}
          <View style={styles.infoBadge}>
            <Ionicons name="time-outline" size={18} color={PRIMARY_COLOR} />
            <AppText style={styles.infoText}>
              {formatRecipeTime(item.time, t)}
            </AppText>
          </View>

          {/* Độ khó (Dùng Map) */}
          <View style={styles.infoBadge}>
            <Ionicons
              name="bar-chart-outline"
              size={18}
              color={PRIMARY_COLOR}
            />
            <AppText style={styles.infoText}>
              {DIFFICULTY_MAP[item.difficulty]
                ? t(`data_map.difficulty.${DIFFICULTY_MAP[item.difficulty]}`)
                : item.difficulty}
            </AppText>
          </View>

          {/* Danh mục (Dùng trực tiếp key tiếng Việt) */}
          <View style={styles.infoBadge}>
            <Ionicons
              name="restaurant-outline"
              size={18}
              color={PRIMARY_COLOR}
            />
            <AppText style={styles.infoText}>
              {t(`data_map.category.${item.category}`, {
                defaultValue: item.category,
              })}
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="bold" style={styles.sectionTitle}>
              {t("recipe_detail.ingredients")}
            </AppText>
            <AppText style={styles.itemCount}>
              {item.ingredients?.length || 0} {t("recipe_detail.items")}
            </AppText>
          </View>
          <View style={styles.ingredientList}>
            {item.ingredients?.map((ing: any, i: number) => (
              <View key={i} style={styles.ingredientItem}>
                <View style={styles.ingredientLeft}>
                  <View style={styles.bullet} />
                  <AppText style={styles.ingredientName}>{ing.name}</AppText>
                </View>
                <AppText variant="bold" style={styles.ingredientAmount}>
                  {ing.quantity || ing.amount}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="bold" style={styles.sectionTitle}>
              {t("recipe_detail.steps")}
            </AppText>
            <AppText style={styles.itemCount}>
              {item.steps?.length || 0} {t("recipe_detail.steps_count")}
            </AppText>
          </View>
          <View style={{ gap: 16 }}>
            {item.steps?.map((step: any, i: number) => (
              <View key={i} style={styles.stepItem}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepBadge}>
                    <AppText style={styles.stepBadgeText}>{i + 1}</AppText>
                  </View>
                  <AppText variant="bold" style={styles.stepTitle}>
                    {step.title}
                  </AppText>
                </View>
                <View style={styles.stepContentBox}>
                  <AppText style={styles.stepContent}>{step.content}</AppText>
                </View>
              </View>
            ))}
          </View>
        </View>
        <AppBottomSpace />
        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      <TouchableOpacity
        style={styles.cookingFAB}
        onPress={() => setIsCookingMode(true)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="chef-hat" size={24} color="#fff" />
        <AppText variant="bold" style={styles.fabText}>
          {t("recipe_detail.start_cooking")}
        </AppText>
      </TouchableOpacity>

      <View style={styles.bottomNavWrapper}>
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

export default RecipeDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  fixedHeader: {
    position: "absolute",
    top: 25,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    zIndex: 100,
  },
  fixedHeaderTitle: {
    fontSize: 18,
    color: PRIMARY_COLOR,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: { flexDirection: "row", gap: 4 },
  scrollContent: { paddingBottom: 0 },
  imageContainer: { height: 320, width: "100%", position: "relative" },
  image: { width: "100%", height: "100%" },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  mainInfo: {
    marginTop: -30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: { fontSize: 24, color: "#333", flex: 1, lineHeight: 32 },
  ratingBtn: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFECB3",
  },
  statText: { color: "#333", fontSize: 14, marginLeft: 2 },
  ratingLinkText: { fontSize: 12, color: "#666" },
  authorCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  authorLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
  },
  authorInfo: { gap: 2 },
  authorLabel: { fontSize: 11, color: "#888" },
  authorName: { fontSize: 14, color: "#333" },
  followBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingBtn: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  followText: { color: "#fff", fontSize: 12 },
  followingText: { color: "#4CAF50" },
  section: { paddingHorizontal: 24, marginTop: 28 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, color: "#333" },
  itemCount: { fontSize: 13, color: "#888" },
  description: { fontSize: 15, color: "#555", lineHeight: 24 },
  ingredientList: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  ingredientLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY_COLOR,
    marginRight: 12,
  },
  ingredientName: { fontSize: 15, color: "#333", flex: 1 },
  ingredientAmount: { color: PRIMARY_COLOR, fontSize: 15 },
  stepItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDFDFD",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    gap: 12,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  stepTitle: { flex: 1, fontSize: 15, color: "#333" },
  stepContentBox: { padding: 16 },
  stepContent: { fontSize: 15, color: "#555", lineHeight: 24 },
  cookingFAB: {
    position: "absolute",
    bottom: 90,
    left: 24,
    right: 24,
    backgroundColor: PRIMARY_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: { color: "#fff", fontSize: 16, letterSpacing: 0.5 },
  bottomNavWrapper: { position: "absolute", bottom: 0, width: "100%" },
  infoRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 16,
    gap: 10,
    flexWrap: "wrap",
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  infoText: { fontSize: 13, color: "#555", fontWeight: "600" },
});
