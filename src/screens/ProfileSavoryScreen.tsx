// src/screens/ProfileSavoryScreen.tsx

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
import { AppLightColor } from "../styles/color";

import BackArrowIcon from "../assets/images/backarrow.svg";
import HotSaveIcon from "../assets/images/hot-save.svg";
import StarIcon from "../assets/images/star.svg";
import ClockIcon from "../assets/images/clock.svg";

import {
  profileSavoryFavorites,
  type ProfileFavoriteItem,
} from "../data/profileFavoritesData";

const { width: SCREEN_W } = Dimensions.get("window");

const H_PADDING = 20;

const GRID_GAP = 14;
const GRID_W = SCREEN_W - H_PADDING * 2;
const GRID_CARD_W = (GRID_W - GRID_GAP) / 2;

const GRID_OVERLAP = 18;

const ProfileSavoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  const renderGridCard = (item: ProfileFavoriteItem) => {
    return (
      <View key={item.id} style={styles.gridCard}>
        <View style={styles.gridImageWrap}>
          <Image source={item.image} style={styles.gridImage} />
          <Pressable style={styles.gridSaveBtn}>
            <HotSaveIcon width={16} height={16} stroke="#fff" fill="none" />
          </Pressable>
        </View>

        <View style={styles.gridInfo}>
          <AppText variant="subtitle" style={styles.gridTitle}>
            {item.title}
          </AppText>

          <AppText variant="medium" style={styles.gridSubtitle}>
            {item.subtitle}
          </AppText>

          <View style={styles.gridMetaRow}>
            <View style={styles.metaItem}>
              <AppText variant="medium" style={styles.metaTextGrid}>
                {item.rating}
              </AppText>
              <StarIcon width={12} height={12} />
            </View>

            <View style={styles.metaItem}>
              <ClockIcon width={12} height={12} />
              <AppText variant="medium" style={styles.metaTextGrid}>
                {item.timeMin} phút
              </AppText>
            </View>
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
            style={styles.backCircle}
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <BackArrowIcon width={18} height={18} />
          </Pressable>

          <View style={styles.headerTitleWrap} pointerEvents="none">
            <AppText variant="bold" style={styles.headerTitle}>
              Đồ mặn
            </AppText>
          </View>

          <View style={styles.headerRightStub} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridWrap}>
            {profileSavoryFavorites.map(renderGridCard)}
          </View>

          <AppBottomSpace height={90} />
        </ScrollView>

        <AppMainNavBar activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </AppSafeView>
  );
};

export default ProfileSavoryScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 54,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: "RobotoSlab-Bold",
  },
  headerRightStub: { width: 32, height: 32 },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 10,
    paddingBottom: 16,
  },

  gridWrap: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: GRID_GAP,
    rowGap: GRID_GAP,
  },

  gridCard: {
    width: GRID_CARD_W,
    overflow: "visible",
    paddingBottom: 12,
  },
  gridImageWrap: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee",
    position: "relative",
    zIndex: 3,
    elevation: 3,
    marginBottom: -GRID_OVERLAP,
  },
  gridImage: {
    width: "100%",
    height: 132,
  },
  gridSaveBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  gridInfo: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: AppLightColor.primary_color,
    paddingHorizontal: 12,
    paddingTop: 12 + GRID_OVERLAP,
    paddingBottom: 12,
    marginHorizontal: 8,
    position: "relative",
    zIndex: 1,
    elevation: 1,
  },
  gridTitle: {
    fontSize: 16,
    color: AppLightColor.primary_text,
  },
  gridSubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: AppLightColor.primary_text,
    opacity: 0.75,
    maxHeight: 18,
    overflow: "hidden",
  },
  gridMetaRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  metaTextGrid: {
    fontSize: 14,
    color: AppLightColor.primary_color,
    fontWeight: "700",
  },
});
