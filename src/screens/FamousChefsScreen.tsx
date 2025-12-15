// src/screens/FamousChefsScreen.tsx

import React, { useState } from "react";
import { View, ScrollView, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import MainBottomNav, { type MainTabKey } from "../components/MainBottomNav";
import SearchRecipeModal from "../components/SearchRecipeModal";
import BottomNavSpacer from "../components/BottomNavSpacer";

import BackArrow from "../assets/images/backarrow.svg";
import SearchIcon from "../assets/images/search.svg";
import NotificationIcon from "../assets/images/notification.svg";
import StarIcon from "../assets/images/star.svg";
import ShareChefIcon from "../assets/images/share-chef.svg";

import {
  type ChefCard,
  topChefs,
  favoriteChefs,
  newChefs,
} from "../data/famousChefsData";

import { styles } from "../styles/famousChefsStyles";

const FamousChefsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
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
        <View style={styles.cardImageWrap}>
          <Image source={chef.avatar} style={styles.cardImage} />
        </View>

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
                style={isFollowing ? styles.followTextActive : styles.followText}
              >
                Theo Dõi
              </AppText>
            </Pressable>

            <Pressable style={styles.shareBtn}>
              <ShareChefIcon width={14} height={14} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
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
              onPress={() => navigation.navigate("Notification")}
            >
              <NotificationIcon width={18} height={18} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionBlockTop}>
            <View style={styles.sectionTopInner}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {topChefs.map(renderChefCard)}
              </ScrollView>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <AppText variant="title" style={styles.sectionTitle}>
              Đầu Bếp Được Yêu Thích Nhất
            </AppText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {favoriteChefs.map(renderChefCard)}
            </ScrollView>
          </View>

          {newChefs.length > 0 && (
            <View style={styles.sectionBlock}>
              <AppText variant="title" style={styles.sectionTitle}>
                Đầu bếp mới
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

          <BottomNavSpacer height={60} />
        </ScrollView>

        <SearchRecipeModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
        />

        <MainBottomNav
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            if (tab === "home") {
              navigation.navigate("Home");
            }
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default FamousChefsScreen;
