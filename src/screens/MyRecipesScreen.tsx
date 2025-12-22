// src/screens/MyRecipesScreen.tsx
// CHỈ SỬA STYLE hotInfoBar (đè ít hơn + xích xuống)

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppSearchModal from "../components/AppSearchModal";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";

import BackArrow from "../assets/images/backarrow.svg";
import SearchIcon from "../assets/images/search.svg";
import NotificationIcon from "../assets/images/notification.svg";
import HotSaveIcon from "../assets/images/hot-save.svg";

import ClockIcon from "../assets/images/clock.svg";
import StarIcon from "../assets/images/star.svg";

import {
  myHotToday,
  myRecipeCards,
  type MyHotRecipe,
  type MyRecipeCard,
} from "../data/myRecipesData";

import { AppLightColor } from "../styles/color";

const { width: SCREEN_W } = Dimensions.get("window");

const H_PADDING = 20;

const GRID_GAP = 14;
const GRID_W = SCREEN_W - H_PADDING * 2;
const GRID_CARD_W = (GRID_W - GRID_GAP) / 2;

const GRID_OVERLAP = 18;

const HOT_CARD_W = 178;
const HOT_IMAGE_H = 104;

const HOT_OVERLAP = 12; // <= giảm đè (trước là 24)

const MyRecipesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<MainTabKey>("home");
  const [searchVisible, setSearchVisible] = useState(false);

  const hotList = useMemo(() => myHotToday, []);
  const gridList = useMemo(() => myRecipeCards, []);

  useEffect(() => {
    if (isFocused) setActiveTab("home");
  }, [isFocused]);

  const renderHotCard = (item: MyHotRecipe) => {
    return (
      <View key={item.id} style={styles.hotCard}>
        <View style={styles.hotImageWrap}>
          <Image source={item.image} style={styles.hotImage} />
          <Pressable style={styles.hotSaveBtn}>
            <HotSaveIcon width={18} height={18} stroke="#fff" fill="none" />
          </Pressable>
        </View>

        <View style={styles.hotInfoBar}>
          <AppText variant="subtitle" style={styles.hotTitle}>
            {item.title}
          </AppText>

          <View style={styles.hotMetaRow}>
            <View style={styles.metaItem}>
              <ClockIcon width={12} height={12} />
              <AppText variant="medium" style={styles.metaTextHot}>
                {item.timeMin} phút
              </AppText>
            </View>

            <View style={styles.metaItem}>
              <AppText variant="medium" style={styles.metaTextHot}>
                {item.rating}
              </AppText>
              <StarIcon width={12} height={12} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderGridCard = (item: MyRecipeCard) => {
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
            style={styles.headerIconCircle}
            onPress={() => navigation.goBack()}
          >
            <BackArrow width={18} height={18} />
          </Pressable>

          <AppText variant="title" style={styles.headerTitle}>
            Công thức của tôi
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
              onPress={() => navigation.navigate("NotificationScreen" as never)}
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
          <View style={styles.hotBlockFullBleed}>
            <View style={styles.hotBlock}>
              <AppText variant="bold" style={styles.hotBlockTitle}>
                Hot nhất hôm nay
              </AppText>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hotRow}
              >
                {hotList.map(renderHotCard)}
              </ScrollView>
            </View>
          </View>

          <View style={styles.gridWrap}>{gridList.map(renderGridCard)}</View>

          <AppBottomSpace height={90} />
        </ScrollView>

        <AppSearchModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
        />

        <AppMainNavBar
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            if (tab === "home") navigation.navigate("HomeScreen" as never);
            if (tab === "world") navigation.navigate("CommunityScreen" as never);
            if (tab === "profile") navigation.navigate("ProfileScreen" as never);
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default MyRecipesScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 8,
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
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 16,
  },

  hotBlockFullBleed: {
    marginTop: 10,
    marginHorizontal: -H_PADDING,
  },

  hotBlock: {
    width: SCREEN_W,
    alignSelf: "center",
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
  },

  hotBlockTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  hotRow: {
    paddingTop: 12,
    paddingRight: 8,
  },

  hotCard: {
    width: HOT_CARD_W,
    marginRight: 12,
    overflow: "visible",
    paddingBottom: 6,
  },
  hotImageWrap: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  hotImage: {
    width: "100%",
    height: HOT_IMAGE_H,
  },
  hotSaveBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  // FIX: đè ít hơn + xích xuống
  hotInfoBar: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: -HOT_OVERLAP, // trước -24
  },
  hotTitle: {
    fontSize: 16,
    color: AppLightColor.primary_text,
  },
  hotMetaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  gridWrap: {
    marginTop: 16,
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
    marginTop: 0,
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

  metaTextHot: {
    fontSize: 14,
    color: AppLightColor.primary_color,
    fontWeight: "700",
  },
  metaTextGrid: {
    fontSize: 14,
    color: AppLightColor.primary_color,
    fontWeight: "700",
  },
});
