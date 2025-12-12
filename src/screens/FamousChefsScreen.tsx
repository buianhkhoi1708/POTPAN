// src/screens/FamousChefsScreen.tsx

import React, { useState } from "react";
import { View, ScrollView, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { AppLightColor } from "../styles/color";
import MainBottomNav, { MainTabKey } from "../components/MainBottomNav";
import {
  popularChefs,
  type HomeChef,
} from "../config/homeData";

import BackArrow from "../assets/images/backarrow.svg";
import SearchIcon from "../assets/images/search-active.svg";
import NotificationIcon from "../assets/images/notification.svg";
import StarIcon from "../assets/images/star.svg";
import ShareChefIcon from "../assets/images/share-chef.svg";
import SearchRecipeModal from "../components/SearchRecipeModal";

import styles from "./FamousChefsScreen.styles";

type ChefCard = HomeChef & {
  handle: string;
  followers: number;
};

const baseChefs: ChefCard[] = popularChefs.map((chef, index) => ({
  ...chef,
  handle:
    [
      "@gordon_chef",
      "@leslie_gill",
      "@michael_ballack",
      "@christine_ha",
      "@chef_new_1",
      "@chef_new_2",
    ][index] ?? `@chef_${index + 1}`,
  followers: [6687, 5687, 6687, 5687, 4321, 3890][index] ?? 0,
}));

const topChefs = baseChefs.slice(0, 2);
const favoriteChefs = baseChefs.slice(2, 4);
const newChefs = baseChefs.slice(4);

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
          {/* section 1 */}
          <View style={styles.sectionBlockTop}>
            <AppText variant="medium" style={styles.sectionTitleTop}>
              Đầu bếp nổi tiếng
            </AppText>
            <View style={styles.cardsGridTop}>
              {topChefs.map(renderChefCard)}
            </View>
          </View>

          {/* section 2 */}
          <View style={styles.sectionBlock}>
            <AppText variant="medium" style={styles.sectionTitle}>
              Đầu Bếp Được Yêu Thích Nhất
            </AppText>
            <View style={styles.cardsGrid}>
              {favoriteChefs.map(renderChefCard)}
            </View>
          </View>

          {/* section 3 */}
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

        {/* SEARCH MODAL */}
        <SearchRecipeModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
        />

        {/* BOTTOM NAV */}
        <MainBottomNav
          activeTab={activeTab}
          onTabPress={(tab) => setActiveTab(tab)}
        />
      </View>
    </AppSafeView>
  );
};

export default FamousChefsScreen;
