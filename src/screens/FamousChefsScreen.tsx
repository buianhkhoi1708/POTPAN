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
import { useTranslation } from "react-i18next"; // 👈 Import i18n

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import MainBottomNav, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader";
import BottomNavSpacer from "../components/AppBottomSpace";

import { AppLightColor } from "../styles/color";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";

type Chef = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  username: string | null;
  followers: number;
};

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_W - 20 * 2 - 12) / 2;

const FamousChefsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { user } = useAuthStore();
  const { t } = useTranslation(); // 👈 Init Hook

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
      // Thông báo cần đăng nhập
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
    
    // 👇 Logic: Kiểm tra xem có phải chính mình không
    const isMe = user?.id === chef.id;

    return (
      <Pressable
        key={chef.id}
        style={styles.card}
        onPress={() => {
          if (isMe) {
            navigation.navigate("ProfileScreen");
          } else {
            navigation.navigate("ChefProfileScreen", {
              chefId: chef.id,
              chefName: chef.full_name,
              chefAvatar: chef.avatar_url,
            });
          }
        }}
      >
        <View style={styles.cardImageWrap}>
          <Image
            source={{
              uri: chef.avatar_url || "https://i.pravatar.cc/150",
            }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.cardInfo}>
          <AppText variant="bold" style={styles.chefName} numberOfLines={1}>
            {chef.full_name || t("community.anonymous_chef")}
            {/* 👇 Hiển thị (Bạn) nếu là chính mình */}
            {isMe ? ` (${t("common.you")})` : ""}
          </AppText>
          <AppText variant="light" style={styles.chefHandle} numberOfLines={1}>
            @{chef.username || "user"}
          </AppText>

          <View style={styles.cardBottomRow}>
            <View style={styles.followersRow}>
              <AppText variant="medium" style={styles.followersText}>
                {chef.followers || 0}
              </AppText>
              <Ionicons name="person" size={12} color="#00000077" />
            </View>

            {/* 👇 Chỉ hiện nút Follow nếu KHÔNG phải là mình */}
            {!isMe && (
              <Pressable
                style={isFollowing ? styles.followBtnActive : styles.followBtn}
                onPress={() => toggleFollow(chef.id)}
              >
                <AppText
                  variant="medium"
                  style={
                    isFollowing ? styles.followTextActive : styles.followText
                  }
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
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        <AppHeader
          title={t("home.famous_chefs")}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />

        {loading && !refreshing ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator
              size="large"
              color={AppLightColor.primary_color}
            />
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
                tintColor={AppLightColor.primary_color}
              />
            }
          >
            {/* SECTION: TOP CHEFS */}
            <View style={styles.sectionBlockTop}>
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

            {/* SECTION: FAVORITE */}
            {favoriteChefs.length > 0 && (
              <View style={styles.sectionBlock}>
                <AppText variant="title" style={styles.sectionTitle}>
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

            {/* SECTION: NEW */}
            {newChefs.length > 0 && (
              <View style={styles.sectionBlock}>
                <AppText variant="title" style={styles.sectionTitle}>
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
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  centerLoading: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  sectionBlockTop: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: AppLightColor.primary_color,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 10,
  },
  sectionTopInner: { paddingLeft: 20, paddingBottom: 20 },
  sectionBlock: { marginBottom: 20, paddingLeft: 20 },
  sectionTitle: {
    fontSize: 18,
    color: AppLightColor.primary_text,
    fontWeight: "700",
    marginBottom: 12,
  },
  horizontalList: { paddingRight: 20 },
  card: { width: CARD_WIDTH, marginRight: 12, marginBottom: 4 },
  cardImageWrap: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#eee",
    height: 150,
    width: "100%",
  },
  cardImage: { width: "100%", height: "100%" },
  cardInfo: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: -20,
    marginHorizontal: 4,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chefName: {
    fontSize: 14,
    color: AppLightColor.primary_text,
    marginBottom: 2,
  },
  chefHandle: { fontSize: 12, color: "#888", marginBottom: 8 },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  followersRow: { flexDirection: "row", alignItems: "center", columnGap: 2 },
  followersText: { fontSize: 11, color: "#666", fontWeight: "600" },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: AppLightColor.primary_color,
  },
  followBtnActive: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  followText: { fontSize: 10, color: "#ffffff", fontWeight: "700" },
  followTextActive: { fontSize: 10, color: "#666", fontWeight: "600" },
});