import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { useAuthStore } from "../store/useAuthStore";
import AppRecipeCard from "../components/AppRecipeCard";
import { useThemeStore } from "../store/useThemeStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; 

const ChefProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user: currentUser } = useAuthStore();
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const { chefId, chefName, chefAvatar } = route.params || {};
  const [chefProfile, setChefProfile] = useState<any>(null);
  const [chefRecipes, setChefRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: userData, error: userError } = await supabase
          .from("users").select("*").eq("id", chefId).single();
        if (!userError) setChefProfile(userData);

        const { data: recipeData } = await supabase
          .from("recipes").select("*").eq("user_id", chefId).order("created_at", { ascending: false });
        setChefRecipes(recipeData || []);

        const { count: followers } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", chefId);
        const { count: following } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", chefId);

        setFollowerCount(followers || 0);
        setFollowingCount(following || 0);

        if (currentUser) {
          const { data: followCheck } = await supabase.from("follows").select("*").eq("follower_id", currentUser.id).eq("following_id", chefId).single();
          setIsFollowing(!!followCheck);
        }
      } catch (error) { console.log("Lỗi tải profile:", error); } 
      finally { setLoading(false); }
    };

    if (chefId) fetchData();
  }, [chefId, currentUser]);

  const handleToggleFollow = async () => {
    if (!currentUser) {
      Alert.alert(t("common.notification"), t("common.require_login"));
      return;
    }
    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    setFollowerCount((prev) => (newStatus ? prev + 1 : prev - 1));

    try {
      if (newStatus) {
        const { error } = await supabase.from("follows").insert({ follower_id: currentUser.id, following_id: chefId });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("follows").delete().eq("follower_id", currentUser.id).eq("following_id", chefId);
        if (error) throw error;
      }
    } catch (err) {
      setIsFollowing(!newStatus);
      setFollowerCount((prev) => (!newStatus ? prev + 1 : prev - 1));
      Alert.alert(t("common.error"), t("common.error_occurred"));
    }
  };


  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <Pressable
          onPress={() => navigation.goBack()}

          style={[styles.iconCircle, { backgroundColor: theme.background_contrast }]}
        >
          {/* 👇 Icon màu động */}
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </Pressable>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable style={[styles.iconCircle, { backgroundColor: theme.background_contrast }]}>
            <Ionicons name="share-social-outline" size={22} color={theme.icon} />
          </Pressable>
        </View>
      </View>

      {/* Info Profile */}
      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: chefProfile?.avatar_url || chefAvatar || "https://i.pravatar.cc/300" }}
            style={[styles.avatar, { borderColor: theme.border }]}
          />
          {chefProfile?.verified && (
            <View style={[styles.verifiedBadge, { borderColor: theme.background }]}>
              <Ionicons name="checkmark" size={10} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.infoCol}>
          <AppText variant="bold" style={[styles.nameText, { color: theme.primary_text }]}>
            {chefProfile?.full_name || chefName || t("chef.anonymous")}
          </AppText>
          <AppText variant="medium" style={[styles.handleText, { color: theme.placeholder_text }]}>
            @{chefProfile?.username || "chef"}
          </AppText>
          <AppText style={[styles.bioText, { color: theme.primary_text }]} numberOfLines={3}>
            {chefProfile?.bio || t("chef.default_bio")}
          </AppText>
        </View>
      </View>

      {/* Nút Action */}
      {currentUser?.id !== chefId && (
        <View style={styles.buttonRow}>
          <Pressable
            style={[
              styles.actionBtn,
              // 👇 Logic màu nút Follow/Following
              isFollowing 
                ? [styles.followingBtn, { backgroundColor: theme.background, borderColor: theme.primary_color }] 
                : [styles.followBtn, { backgroundColor: theme.primary_color, shadowColor: theme.primary_color }]
            ]}
            onPress={handleToggleFollow}
          >
            <AppText
              variant="bold"
              style={[
                styles.actionBtnText,
                isFollowing ? { color: theme.primary_color } : { color: "#fff" },
              ]}
            >
              {isFollowing ? t("chef.following") : t("chef.follow")}
            </AppText>
          </Pressable>

          <Pressable style={[
              styles.actionBtn, 
              styles.messageBtn, 
              { backgroundColor: theme.background_contrast, borderColor: theme.border }
          ]}>
            <AppText variant="bold" style={[styles.actionBtnText, { color: theme.primary_text }]}>
              {t("chef.message")}
            </AppText>
          </Pressable>
        </View>
      )}

      {/* Stats */}
      <View style={[
          styles.statsContainer, 
          { backgroundColor: theme.background, borderBottomColor: theme.border }
      ]}>
        <View style={styles.statItem}>
          <AppText variant="bold" style={[styles.statNumber, { color: theme.primary_text }]}>
            {chefRecipes.length}
          </AppText>
          <AppText style={[styles.statLabel, { color: theme.placeholder_text }]}>{t("profile.recipes")}</AppText>
        </View>
        
        <View style={[styles.verticalDivider, { backgroundColor: theme.border }]} />

        <Pressable
          style={styles.statItem}
          onPress={() => navigation.navigate("FollowScreen", { type: "following", userId: chefId })}
        >
          <AppText variant="bold" style={[styles.statNumber, { color: theme.primary_text }]}>
            {followingCount}
          </AppText>
          <AppText style={[styles.statLabel, { color: theme.placeholder_text }]}>{t("profile.following")}</AppText>
        </Pressable>
        
        <View style={[styles.verticalDivider, { backgroundColor: theme.border }]} />

        <Pressable
          style={styles.statItem}
          onPress={() => navigation.navigate("FollowScreen", { type: "followers", userId: chefId })}
        >
          <AppText variant="bold" style={[styles.statNumber, { color: theme.primary_text }]}>
            {followerCount}
          </AppText>
          <AppText style={[styles.statLabel, { color: theme.placeholder_text }]}>{t("profile.followers")}</AppText>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary_text }]}>
          {t("chef.recipe_list")}
        </AppText>
        <Ionicons name="restaurant-outline" size={18} color={theme.primary_color} />
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <AppRecipeCard
      item={item}
      onPress={() => navigation.push("RecipeDetailScreen", { item })}
      style={{ width: CARD_WIDTH, marginBottom: 12 }} 
    />
  );

  return (
    // 👇 3. Áp dụng Background Screen
    <AppSafeView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary_color} />
        </View>
      ) : (
        <FlatList
          data={chefRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <AppText style={{ color: theme.placeholder_text }}>
                {t("chef.no_recipes")}
              </AppText>
            </View>
          }
        />
      )}
    </AppSafeView>
  );
};

export default ChefProfileScreen;

// Style tĩnh (Layout)
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: { paddingHorizontal: 16, paddingTop: 10 },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  avatarWrapper: { position: "relative", marginRight: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2196F3",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  infoCol: { flex: 1, justifyContent: "center", paddingTop: 4 },
  nameText: { fontSize: 22, marginBottom: 2 },
  handleText: { fontSize: 14, marginBottom: 8 },
  bioText: { fontSize: 14, lineHeight: 20 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  followBtn: {
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  followingBtn: {
    borderWidth: 1,
  },
  messageBtn: {
    borderWidth: 1,
  },
  actionBtnText: { fontSize: 15 },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: 20,
    marginBottom: 16,
  },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 18 },
  statLabel: { fontSize: 12, marginTop: 2 },
  verticalDivider: { width: 1, height: "60%" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18 },
  listContent: { paddingBottom: 40 },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});