import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";

import PlusIcon from "../assets/images/plus.svg";
import MenuIcon from "../assets/images/setting.svg";
import StarIcon from "../assets/images/star.svg";
import ClockIcon from "../assets/images/clock.svg";

import {
  profileRecipes,
  profileCollections,
  type ProfileRecipe,
  type CollectionCard,
} from "../data/profileData";

import { PROFILE_USER } from "../data/profileScreenData";
import { AppLightColor } from "../styles/color";

type ProfileTab = "recipes" | "favorites";

const { width: SCREEN_W } = Dimensions.get("window");
const H_PADDING = 20;
const GRID_GAP = 12;
const CARD_W = (SCREEN_W - H_PADDING * 2 - GRID_GAP) / 2;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");
  const [section, setSection] = useState<ProfileTab>("recipes");

  useEffect(() => {
    if (isFocused) {
      setActiveTab("profile");
      setSection("recipes");
    }
  }, [isFocused]);

  const renderRecipeCard = (item: ProfileRecipe) => (
    <Pressable key={item.id} style={styles.recipeCard}>
      <View style={styles.recipeImageWrap}>
        <Image source={item.thumbnail} style={styles.recipeImage} />
      </View>

      <View style={styles.recipeInfo}>
        <AppText variant="bold" style={styles.recipeTitle}>
          {item.title}
        </AppText>
        <AppText variant="light" style={styles.recipeDesc}>
          {item.description}
        </AppText>

        <View style={styles.recipeMetaRow}>
          <View style={styles.metaItem}>
            <StarIcon width={12} height={12} />
            <AppText variant="light" style={styles.metaText}>
              {item.rating}
            </AppText>
          </View>

          <View style={styles.metaItem}>
            <ClockIcon width={12} height={12} />
            <AppText variant="light" style={styles.metaText}>
              {item.time}
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderCollectionCard = (item: CollectionCard) => (
    <Pressable key={item.id} style={styles.collectionCard}>
      <Image source={item.image} style={styles.collectionImage} />
      <View style={styles.collectionFooter}>
        <AppText variant="medium" style={styles.collectionTitle}>
          {item.title}
        </AppText>
      </View>
    </Pressable>
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <Image source={PROFILE_USER.avatar} style={styles.avatar} />

            <View style={styles.userInfo}>
              <AppText variant="medium" style={styles.name}>
                {PROFILE_USER.fullName}
              </AppText>
              <AppText variant="light" style={styles.handle}>
                {PROFILE_USER.handle}
              </AppText>
              <AppText variant="light" style={styles.bio}>
                {PROFILE_USER.bio}
              </AppText>
            </View>

            <View style={styles.topActions}>
              <Pressable style={styles.actionCircleSoft}>
                <PlusIcon width={16} height={16} />
              </Pressable>

              <Pressable
                style={styles.actionCircleSoft}
                onPress={() => navigation.navigate("SettingsScreen")}
              >
                <MenuIcon width={16} height={16} />
              </Pressable>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={styles.primaryPill}
              onPress={() => navigation.navigate("EditProfileScreen")}
            >
              <AppText variant="medium" style={styles.primaryPillText}>
                Chỉnh Sửa Hồ Sơ
              </AppText>
            </Pressable>

            <Pressable style={styles.primaryPill}>
              <AppText variant="medium" style={styles.primaryPillText}>
                Chia Sẻ Hồ Sơ
              </AppText>
            </Pressable>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <AppText variant="medium" style={styles.statValue}>
                {PROFILE_USER.stats.savedRecipes}
              </AppText>
              <AppText variant="light" style={styles.statLabel}>
                Công thức đã lưu
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <AppText variant="medium" style={styles.statValue}>
                {PROFILE_USER.stats.following}
              </AppText>
              <AppText variant="light" style={styles.statLabel}>
                Lượt theo dõi
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <AppText variant="medium" style={styles.statValue}>
                {PROFILE_USER.stats.followers}
              </AppText>
              <AppText variant="light" style={styles.statLabel}>
                Người theo dõi
              </AppText>
            </View>
          </View>

          <View style={styles.tabRow}>
            <Pressable
              style={styles.tabItem}
              onPress={() => setSection("recipes")}
            >
              <AppText
                variant="medium"
                style={
                  section === "recipes" ? styles.tabTextActive : styles.tabText
                }
              >
                Công thức
              </AppText>
              {section === "recipes" && <View style={styles.tabUnderline} />}
            </Pressable>

            <Pressable
              style={styles.tabItem}
              onPress={() => setSection("favorites")}
            >
              <AppText
                variant="medium"
                style={
                  section === "favorites"
                    ? styles.tabTextActive
                    : styles.tabText
                }
              >
                Yêu thích
              </AppText>
              {section === "favorites" && <View style={styles.tabUnderline} />}
            </Pressable>
          </View>

          {section === "recipes" ? (
            <View style={styles.recipeGrid}>
              {profileRecipes.map(renderRecipeCard)}
            </View>
          ) : (
            <View style={styles.collectionList}>
              {profileCollections.map(renderCollectionCard)}
              <Pressable style={styles.createCollectionBtn}>
                <AppText variant="medium" style={styles.createCollectionText}>
                  + Tạo bộ sưu tập
                </AppText>
              </Pressable>
            </View>
          )}

          <AppBottomSpace height={90} />
        </ScrollView>

        <AppMainNavBar activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </AppSafeView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: H_PADDING, paddingTop: 10 },

  topRow: { flexDirection: "row", alignItems: "flex-start" },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  userInfo: { flex: 1, paddingLeft: 12, paddingRight: 10 },
  name: { fontSize: 20, color: AppLightColor.primary_color, fontWeight: "800" },
  handle: {
    marginTop: 2,
    color: AppLightColor.primary_color,
    fontWeight: "700",
    opacity: 0.65,
    fontSize: 13,
  },
  bio: { marginTop: 6, color: "#111", fontSize: 12, lineHeight: 16 },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    marginTop: 8,
  },

  actionCircleSoft: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffe3e2",
  },

  actionRow: { marginTop: 14, flexDirection: "row", columnGap: 12 },
  primaryPill: {
    flex: 1,
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },
  primaryPillText: { fontSize: 13, color: "#fff", fontWeight: "700" },

  statsCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ffb6b5",
    borderRadius: 14,
    flexDirection: "row",
    paddingVertical: 10,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 16, fontWeight: "800", color: "#111" },
  statLabel: { marginTop: 4, fontSize: 11, color: "#333" },
  statDivider: { width: 1, height: 34, backgroundColor: "#ffd1d0" },

  tabRow: { marginTop: 14, flexDirection: "row" },
  tabItem: { flex: 1, alignItems: "center", paddingBottom: 10 },
  tabText: { fontSize: 16, fontWeight: "800", color: "#111" },
  tabTextActive: { fontSize: 16, fontWeight: "800", color: "#111" },
  tabUnderline: {
    position: "absolute",
    bottom: 2,
    width: 140,
    height: 3,
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
  },

  recipeGrid: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  recipeCard: {
    width: CARD_W,
    marginBottom: 14,
    overflow: "visible",
    alignItems: "center",
  },
  recipeImageWrap: {
    width: "92%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  recipeImage: { width: "100%", height: 120 },
  recipeInfo: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffb6b5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: -12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
    color: "#111",
  },
  recipeDesc: { marginTop: 2, fontSize: 12, color: "#333" },
  recipeMetaRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: { flexDirection: "row", alignItems: "center", columnGap: 6 },
  metaText: {
    color: AppLightColor.primary_color,
    fontWeight: "700",
    fontSize: 12,
  },

  collectionList: { marginTop: 10, rowGap: 14 },
  collectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ffb6b5",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  collectionImage: { width: "100%", height: 150 },
  collectionFooter: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  collectionTitle: { fontSize: 16, fontWeight: "800", color: "#111" },

  createCollectionBtn: {
    marginTop: 4,
    alignSelf: "center",
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#ffe3e2",
  },
  createCollectionText: { fontSize: 13, fontWeight: "800", color: "#111" },
});