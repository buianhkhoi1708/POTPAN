// src/screens/ProfileScreen.tsx

import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import BottomNavSpacer from "../components/BottomNavSpacer";
import MainBottomNav, { type MainTabKey } from "../components/MainBottomNav";

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
import { styles } from "../styles/profileStyles";

type ProfileTab = "recipes" | "favorites";

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
              <Pressable style={styles.actionCircleSoft}>
                <MenuIcon width={16} height={16} />
              </Pressable>
            </View>
          </View>

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

          <BottomNavSpacer height={90} />
        </ScrollView>

        <MainBottomNav activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </AppSafeView>
  );
};

export default ProfileScreen;
