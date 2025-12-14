// src/screens/ProfileScreen.tsx

import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import BottomNavSpacer from "../components/BottomNavSpacer";
import MainBottomNav, { type MainTabKey } from "../components/MainBottomNav";
import { AppLightColor } from "../styles/color";

import PlusIcon from "../assets/images/plus.svg";
import MenuIcon from "../assets/images/setting.svg";
import StarIcon from "../assets/images/star.svg";
import ClockIcon from "../assets/images/clock.svg";

type ProfileTab = "recipes" | "favorites";

type ProfileRecipe = {
  id: string;
  title: string;
  description: string;
  rating: number;
  time: string;
  thumbnail: ImageSourcePropType;
};

type CollectionCard = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};

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

  const recipes = useMemo<ProfileRecipe[]>(
    () => [
      {
        id: "p-1",
        title: "Gà kho gừng",
        description: "Món ngon mỗi ngày",
        rating: 5,
        time: "55 phút",
        thumbnail: require("../assets/images/man1.png"),
      },
      {
        id: "p-2",
        title: "Bánh mì",
        description: "Nổi tiếng mọi nơi",
        rating: 5,
        time: "10 phút",
        thumbnail: require("../assets/images/man2.png"),
      },
      {
        id: "p-3",
        title: "Bánh vòm",
        description: "Đặc sản",
        rating: 5,
        time: "14 phút",
        thumbnail: require("../assets/images/man3.png"),
      },
      {
        id: "p-4",
        title: "Canh chua cá lóc",
        description: "Đậm đà hương vị",
        rating: 5,
        time: "55 phút",
        thumbnail: require("../assets/images/man4.png"),
      },
    ],
    []
  );

  const collections = useMemo<CollectionCard[]>(
    () => [
      { id: "c-1", title: "Món mặn", image: require("../assets/images/hoso-man.png") },
      { id: "c-2", title: "Đồ chay", image: require("../assets/images/hoso-chay.png") },
    ],
    []
  );

  const renderRecipeCard = (item: ProfileRecipe) => {
    return (
      <Pressable key={item.id} style={styles.recipeCard}>
        <View style={styles.recipeImageWrap}>
          <Image source={item.thumbnail} style={styles.recipeImage} />
        </View>

        <View style={styles.recipeBody}>
          <AppText variant="medium" style={styles.recipeTitle}>
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
  };

  const renderCollectionCard = (item: CollectionCard) => {
    return (
      <Pressable key={item.id} style={styles.collectionCard}>
        <Image source={item.image} style={styles.collectionImage} />

        <View style={styles.collectionLabelWrap}>
          <View style={styles.collectionLabelPill}>
            <AppText variant="medium" style={styles.collectionLabelText}>
              {item.title}
            </AppText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TOP INFO */}
          <View style={styles.topRow}>
            <Image
              source={require("../assets/images/avt-profile.png")}
              style={styles.avatar}
            />

            <View style={styles.userInfo}>
              <AppText variant="medium" style={styles.name}>
                Bùi Anh Khôi
              </AppText>
              <AppText variant="light" style={styles.handle}>
                @KhoiABui
              </AppText>
              <AppText variant="light" style={styles.bio}>
                Nấu ăn là niềm đam mê to lớn của tôi
              </AppText>
            </View>

            <View style={styles.topActions}>
              {/* đổi nền nút + và menu theo ảnh: nền hồng nhạt, icon đỏ */}
              <Pressable style={styles.actionCircleSoft}>
                <PlusIcon width={16} height={16} />
              </Pressable>
              <Pressable style={styles.actionCircleSoft}>
                <MenuIcon width={16} height={16} />
              </Pressable>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.actionRow}>
            <Pressable
              style={styles.primaryPill}
              onPress={() => navigation.navigate("EditProfile")}
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

          {/* STATS */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <AppText variant="medium" style={styles.statValue}>
                60
              </AppText>
              <AppText variant="light" style={styles.statLabel}>
                Công thức đã lưu
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <AppText variant="medium" style={styles.statValue}>
                120
              </AppText>
              <AppText variant="light" style={styles.statLabel}>
                Lượt theo dõi
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <AppText variant="medium" style={styles.statValue}>
                250
              </AppText>
              <AppText variant="light" style={styles.statLabel}>
                Người theo dõi
              </AppText>
            </View>
          </View>

          {/* TABS */}
          <View style={styles.tabRow}>
            <Pressable style={styles.tabItem} onPress={() => setSection("recipes")}>
              <AppText
                variant="medium"
                style={section === "recipes" ? styles.tabTextActive : styles.tabText}
              >
                Công thức
              </AppText>
              {section === "recipes" ? <View style={styles.tabUnderline} /> : null}
            </Pressable>

            <Pressable style={styles.tabItem} onPress={() => setSection("favorites")}>
              <AppText
                variant="medium"
                style={section === "favorites" ? styles.tabTextActive : styles.tabText}
              >
                Yêu thích
              </AppText>
              {section === "favorites" ? <View style={styles.tabUnderline} /> : null}
            </Pressable>
          </View>

          {/* CONTENT */}
          {section === "recipes" ? (
            <View style={styles.recipeGrid}>{recipes.map(renderRecipeCard)}</View>
          ) : (
            <View style={styles.collectionList}>
              {collections.map(renderCollectionCard)}

              <Pressable style={styles.createCollectionBtn}>
                <AppText variant="medium" style={styles.createCollectionText}>
                  + Tạo bộ sưu tập
                </AppText>
              </Pressable>
            </View>
          )}

          <BottomNavSpacer height={90} />
        </ScrollView>

        {/* NAV BOTTOM */}
        <MainBottomNav activeTab={activeTab} onTabPress={setActiveTab} />
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
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  userInfo: { flex: 1, paddingLeft: 12, paddingRight: 10 },
  name: { fontSize: 18, color: AppLightColor.primary_color, fontWeight: "800" },
  handle: { marginTop: 2, color: AppLightColor.primary_color, fontWeight: "700" },
  bio: { marginTop: 6, color: "#111" },
  topActions: { flexDirection: "row", alignItems: "center", columnGap: 8 },

  actionCircleSoft: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffe3e2",
  },

  actionRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 12,
  },
  primaryPill: {
    flex: 1,
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryPillText: { fontSize: 13, color: "#fff", fontWeight: "700" },

  statsCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ffb6b5",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  statValue: { fontSize: 16, fontWeight: "800", color: "#111" },
  statLabel: { marginTop: 4, fontSize: 11, color: "#333", textAlign: "center" },
  statDivider: { width: 1, height: 34, backgroundColor: "#ffd1d0" },

  tabRow: { marginTop: 14, flexDirection: "row", alignItems: "center" },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10 },
  tabText: { fontSize: 16, fontWeight: "800", color: "#111" },
  tabTextActive: { fontSize: 16, fontWeight: "800", color: "#111" },
  tabUnderline: {
    position: "absolute",
    bottom: 2,
    width: 120,
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ffb6b5",
    backgroundColor: "#fff",
    marginBottom: 12,
    overflow: "hidden",
  },
  recipeImageWrap: { borderTopLeftRadius: 14, borderTopRightRadius: 14, overflow: "hidden" },
  recipeImage: { width: "100%", height: 110 },
  recipeBody: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 10 },
  recipeTitle: { fontSize: 13, fontWeight: "800", color: "#111" },
  recipeDesc: { marginTop: 2, fontSize: 11, color: "#333" },
  recipeMetaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaItem: { flexDirection: "row", alignItems: "center", columnGap: 6 },
  metaText: { color: AppLightColor.primary_color, fontWeight: "700", fontSize: 11 },

  collectionList: { marginTop: 10 },
  collectionCard: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ffb6b5",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  collectionImage: { width: "100%", height: 140 },
  collectionLabelWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    alignItems: "center",
  },
  collectionLabelPill: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ffb6b5",
    backgroundColor: "#fff",
  },
  collectionLabelText: { fontSize: 12, fontWeight: "800", color: "#111" },

  createCollectionBtn: {
    marginTop: 6,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#ffe3e2",
  },
  createCollectionText: { fontSize: 12, fontWeight: "800", color: "#111" },
});
