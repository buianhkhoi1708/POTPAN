// src/screens/FamousChefsScreen.tsx

import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { AppLightColor } from "../styles/color";
import MainBottomNav, { MainTabKey } from "../components/MainBottomNav";
import SearchRecipeModal from "../components/SearchRecipeModal";

import {
  popularChefs,
  type HomeChef,
} from "../config/homeData";

import BackArrow from "../assets/images/backarrow.svg";
import SearchIcon from "../assets/images/search-active.svg";
import NotificationIcon from "../assets/images/notification.svg";
import StarIcon from "../assets/images/star.svg";
import ShareChefIcon from "../assets/images/share-chef.svg";

type ChefCard = HomeChef & {
  handle: string;
  followers: number;
};

const FOLLOWERS = [6687, 5687, 6687, 5687, 4321, 3890];
const HANDLES = [
  "@gordon_chef",
  "@leslie_gill",
  "@ballack36",
  "@theblindcook",
  "@chef_new1",
  "@chef_new2",
];

const chefCards: ChefCard[] = popularChefs.map((c, index) => ({
  ...c,
  followers: FOLLOWERS[index] ?? 0,
  handle: HANDLES[index] ?? `@chef_${index + 1}`,
}));

const topChefs = chefCards.slice(0, 2);
const favoriteChefs = chefCards.slice(2, 4);
const newChefs = chefCards.slice(4);

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_W - 20 * 2 - 12) / 2;

const FamousChefsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<MainTabKey>("world");
  const [searchVisible, setSearchVisible] = useState(false);
  const [followMap, setFollowMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string) => {
    setFollowMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderChefCard = (chef: ChefCard) => {
    const isFollowing = followMap[chef.id] ?? false;

    return (
      <View key={chef.id} style={styles.card}>
        <Image source={chef.avatar} style={styles.cardImage} />

        <View style={styles.cardInfo}>
          <AppText variant="bold" style={styles.chefName}>
            {chef.name}
          </AppText>
          <AppText variant="light" style={styles.chefHandle}>
            {chef.handle}
          </AppText>

          <View style={styles.cardBottomRow}>
            <View style={styles.followersRow}>
              <AppText variant="medium" style={styles.followersText}>
                {chef.followers}
              </AppText>
              <StarIcon width={14} height={14} />
            </View>

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
                Theo Dõi
              </AppText>
            </Pressable>

            <Pressable style={styles.shareBtn}>
              <ShareChefIcon width={16} height={16} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackArrow width={18} height={18} />
          </Pressable>

          <AppText variant="title" style={styles.headerTitle}>
            Đầu bếp nổi tiếng
          </AppText>

          <View style={styles.headerRight}>
            <Pressable
              style={styles.headerIconCircle}
              onPress={() => setSearchVisible(true)}
            >
              <SearchIcon width={18} height={18} />
            </Pressable>
            <Pressable
              style={styles.headerIconCircle}
              onPress={() => navigation.navigate("Notification" as never)}
            >
              <NotificationIcon width={18} height={18} />
            </Pressable>
          </View>
        </View>

        {/* BODY */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Đầu bếp nổi tiếng (khối hồng trên) */}
          <View style={styles.sectionBlockTop}>
            <AppText variant="medium" style={styles.sectionTitleTop}>
              Đầu bếp nổi tiếng
            </AppText>
            <View style={styles.cardsGridTop}>
              {topChefs.map(renderChefCard)}
            </View>
          </View>

          {/* Đầu bếp được yêu thích nhất */}
          <View style={styles.sectionBlock}>
            <AppText variant="medium" style={styles.sectionTitle}>
              Đầu Bếp Được Yêu Thích Nhất
            </AppText>
            <View style={styles.cardsGrid}>
              {favoriteChefs.map(renderChefCard)}
            </View>
          </View>

          {/* Đầu bếp mới */}
          {newChefs.length > 0 && (
            <View style={styles.sectionBlock}>
              <AppText variant="medium" style={styles.sectionTitle}>
                Đầu bếp mới
              </AppText>
              <View style={styles.cardsGrid}>
                {newChefs.map(renderChefCard)}
              </View>
            </View>
          )}
        </ScrollView>

        {/* MODAL TÌM KIẾM */}
        <SearchRecipeModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
        />

        {/* NAV BOTTOM */}
        <MainBottomNav
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            if (tab === "home") {
              navigation.navigate("Home" as never);
            }
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default FamousChefsScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    color: AppLightColor.primary_color,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffe3e2",
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  sectionBlockTop: {
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
    marginBottom: 16,
  },
  sectionTitleTop: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 8,
  },
  cardsGridTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    rowGap: 12,
    flexWrap: "wrap",
  },

  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: AppLightColor.primary_text,
    marginBottom: 8,
  },
  cardsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    rowGap: 12,
    flexWrap: "wrap",
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardInfo: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  chefName: {
    fontSize: 13,
    color: AppLightColor.primary_text,
  },
  chefHandle: {
    fontSize: 12,
    color: "#999",
    marginBottom: 6,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  followersRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  followersText: {
    fontSize: 12,
    color: AppLightColor.primary_color,
  },

  followBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
  },
  followBtnActive: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#ffe3e2",
  },
  followText: {
    fontSize: 11,
    color: "#ffffff",
  },
  followTextActive: {
    fontSize: 11,
    color: AppLightColor.primary_color,
  },

  shareBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
