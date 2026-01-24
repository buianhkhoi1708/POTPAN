// Nhóm 9 - IE307.Q12
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import MainBottomNav, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader";
import BottomNavSpacer from "../components/AppBottomSpace";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Chef } from "../type/types";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_W - 20 * 2 - 12) / 2;

const FamousChefsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState<MainTabKey>("home");
  const [topChefs, setTopChefs] = useState<Chef[]>([]);
  const [favoriteChefs, setFavoriteChefs] = useState<Chef[]>([]);
  const [newChefs, setNewChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [followMap, setFollowMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isFocused) setActiveTab("home");
  }, [isFocused]);

  const fetchData = async () => {
    try {
      if (!refreshing) setLoading(true);

      const topQuery = supabase
        .from("users")
        .select("*")
        .order("followers", { ascending: false })
        .limit(5);
      const favQuery = supabase
        .from("users")
        .select("*")
        .order("followers", { ascending: false })
        .range(5, 10);
      const newQuery = supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      const [topRes, favRes, newRes] = await Promise.all([
        topQuery,
        favQuery,
        newQuery,
      ]);

      if (topRes.data) setTopChefs(topRes.data);
      if (favRes.data) setFavoriteChefs(favRes.data);
      if (newRes.data) setNewChefs(newRes.data);

      if (user) {
        const { data: followData } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id);
        if (followData) {
          const newMap: Record<string, boolean> = {};
          followData.forEach((f: any) => {
            newMap[f.following_id] = true;
          });
          setFollowMap(newMap);
        }
      }
    } catch (error) {
      console.log("Lỗi tải đầu bếp:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const toggleFollow = async (chefId: string) => {
    if (!user) {
      alert(t("common.require_login"));
      return;
    }
    const isFollowing = followMap[chefId];
    setFollowMap((prev) => ({ ...prev, [chefId]: !isFollowing }));
    try {
      if (isFollowing) {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", chefId);
      } else {
        await supabase
          .from("follows")
          .insert({ follower_id: user.id, following_id: chefId });
      }
    } catch (error) {
      setFollowMap((prev) => ({ ...prev, [chefId]: isFollowing }));
    }
  };

  const renderChefCard = (chef: Chef) => {
    const isFollowing = followMap[chef.id] ?? false;
    const isMe = user?.id === chef.id;

    return (
      <Pressable
        key={chef.id}
        style={[styles.card]}
        onPress={() => {
          if (isMe) navigation.navigate("ProfileScreen");
          else
            navigation.navigate("ChefProfileScreen", {
              chefId: chef.id,
              chefName: chef.full_name,
              chefAvatar: chef.avatar_url,
            });
        }}
      >
        <View
          style={[
            styles.cardImageWrap,
            { backgroundColor: isDarkMode ? "#333" : "#eee" },
          ]}
        >
          <Image
            source={{ uri: chef.avatar_url || "https://i.pravatar.cc/150" }}
            style={[styles.cardImage, isDarkMode && { opacity: 0.9 }]}
            resizeMode="cover"
          />
        </View>

        <View
          style={[
            styles.cardInfo,
            {
              backgroundColor: theme.background_contrast,
              borderColor: theme.border,
              shadowOpacity: isDarkMode ? 0 : 0.1,
            },
          ]}
        >
          <AppText
            variant="bold"
            style={[styles.chefName, { color: theme.primary_text }]}
            numberOfLines={1}
          >
            {chef.full_name || t("community.anonymous_chef")}
            {isMe ? ` (${t("common.you")})` : ""}
          </AppText>
          <AppText
            variant="light"
            style={[styles.chefHandle, { color: theme.placeholder_text }]}
            numberOfLines={1}
          >
            @{chef.username || "user"}
          </AppText>

          <View style={styles.cardBottomRow}>
            <View style={styles.followersRow}>
              <AppText
                variant="medium"
                style={[
                  styles.followersText,
                  { color: theme.placeholder_text },
                ]}
              >
                {chef.followers || 0}
              </AppText>
              <Ionicons
                name="person"
                size={12}
                color={theme.placeholder_text}
              />
            </View>

            {!isMe && (
              <Pressable
                style={[
                  isFollowing ? styles.followBtnActive : styles.followBtn,
                  isFollowing
                    ? {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      }
                    : { backgroundColor: theme.primary_color },
                ]}
                onPress={() => toggleFollow(chef.id)}
              >
                <AppText
                  variant="medium"
                  style={[
                    isFollowing ? styles.followTextActive : styles.followText,
                    isFollowing
                      ? { color: theme.placeholder_text }
                      : { color: "#fff" },
                  ]}
                >
                  {isFollowing ? t("chef.following") : t("chef.follow")}
                </AppText>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <AppSafeView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <AppHeader
          title={t("home.famous_chefs")}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />

        {loading && !refreshing ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={theme.primary_color} />
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.primary_color}
                colors={[theme.primary_color]}
                progressBackgroundColor={theme.background_contrast}
              />
            }
          >
            <View
              style={[
                styles.sectionBlockTop,
                { backgroundColor: theme.primary_color },
              ]}
            >
              <View style={styles.sectionTopInner}>
                <AppText
                  variant="bold"
                  style={[
                    styles.sectionTitle,
                    { color: "#fff", marginBottom: 12 },
                  ]}
                >
                  {t("chef.sections.top_trending")} 🔥
                </AppText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                >
                  {topChefs.map(renderChefCard)}
                </ScrollView>
              </View>
            </View>

            {favoriteChefs.length > 0 && (
              <View style={styles.sectionBlock}>
                <AppText
                  variant="title"
                  style={[styles.sectionTitle, { color: theme.primary_text }]}
                >
                  {t("chef.sections.favorites")} ❤️
                </AppText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                >
                  {favoriteChefs.map(renderChefCard)}
                </ScrollView>
              </View>
            )}

            {newChefs.length > 0 && (
              <View style={styles.sectionBlock}>
                <AppText
                  variant="title"
                  style={[styles.sectionTitle, { color: theme.primary_text }]}
                >
                  {t("chef.sections.new_faces")} ✨
                </AppText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                >
                  {newChefs.map(renderChefCard)}
                </ScrollView>
              </View>
            )}

            <BottomNavSpacer height={80} />
          </ScrollView>
        )}

        <MainBottomNav
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            if (tab === "home") navigation.navigate("HomeScreen");
            if (tab === "profile") navigation.navigate("ProfileScreen");
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default FamousChefsScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  centerLoading: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  // Section Top (Background màu chủ đạo)
  sectionBlockTop: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 10,
  },
  sectionTopInner: { paddingLeft: 20, paddingBottom: 20 },

  // Sections khác
  sectionBlock: { marginBottom: 20, paddingLeft: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  horizontalList: { paddingRight: 20 },

  // Chef Card
  card: { width: CARD_WIDTH, marginRight: 12, marginBottom: 4 },
  cardImageWrap: {
    borderRadius: 20,
    overflow: "hidden",
    height: 150,
    width: "100%",
  },
  cardImage: { width: "100%", height: "100%" },

  cardInfo: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: -20, // Hiệu ứng nổi lên trên ảnh
    marginHorizontal: 4,
    zIndex: 2,
    // Shadow mặc định
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  chefName: { fontSize: 14, marginBottom: 2 },
  chefHandle: { fontSize: 12, marginBottom: 8 },

  // Bottom Row in Card
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  followersRow: { flexDirection: "row", alignItems: "center", columnGap: 2 },
  followersText: { fontSize: 11, fontWeight: "600" },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  followBtnActive: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  followText: { fontSize: 10, fontWeight: "700" },
  followTextActive: { fontSize: 10, fontWeight: "600" },
});
