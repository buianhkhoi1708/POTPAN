// src/screens/ProfileVegetarianScreen.tsx

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
import StarIcon from "../assets/images/star.svg";
import ClockIcon from "../assets/images/clock.svg";

import {
  profileVegetarianFavorites,
  type ProfileFavoriteItem,
} from "../data/profileFavoritesData";

const { width: SCREEN_W } = Dimensions.get("window");
const H_PADDING = 20;
const GRID_GAP = 14;
const GRID_W = SCREEN_W - H_PADDING * 2;
const CARD_W = (GRID_W - GRID_GAP) / 2;

const ProfileVegetarianScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  const renderCard = (item: ProfileFavoriteItem) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.image} />
      </View>

      <View style={styles.info}>
        <AppText variant="bold" style={styles.title}>
          {item.title}
        </AppText>
        <AppText variant="light" style={styles.subtitle}>
          {item.subtitle}
        </AppText>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <StarIcon width={12} height={12} />
            <AppText variant="medium" style={styles.metaText}>
              {item.rating}
            </AppText>
          </View>

          <View style={styles.metaItem}>
            <ClockIcon width={12} height={12} />
            <AppText variant="medium" style={styles.metaText}>
              {item.timeMin} phút
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );

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
              Đồ chay
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
            {profileVegetarianFavorites.map(renderCard)}
          </View>
          <AppBottomSpace height={90} />
        </ScrollView>

        <AppMainNavBar activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </AppSafeView>
  );
};

export default ProfileVegetarianScreen;

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
  scrollContent: { paddingHorizontal: H_PADDING, paddingTop: 10 },

  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: GRID_GAP,
    rowGap: GRID_GAP,
  },

  card: { width: CARD_W },

  imageWrap: {
    width: "100%",
    height: 150,
    borderRadius: 18,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },

  info: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: AppLightColor.primary_color,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },

  title: { fontSize: 15, color: "#111", lineHeight: 20 },
  subtitle: { fontSize: 11, color: "#6a6a6a", marginTop: 2 },

  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 12, color: AppLightColor.primary_color },
});
