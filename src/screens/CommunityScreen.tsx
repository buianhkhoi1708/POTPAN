// src/screens/CommunityScreen.tsx

import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import MainBottomNav, { type MainTabKey } from "../components/AppMainNavBar";
import AppSearchModal from "../components/AppSearchModal";
import BottomNavSpacer from "../components/AppBottomSpace";

import BackArrow from "../assets/images/backarrow.svg";
import SearchIcon from "../assets/images/search.svg";
import NotificationIcon from "../assets/images/notification.svg";

import ClockIcon from "../assets/images/clock.svg";
import DoKhoIcon from "../assets/images/dokho.svg";
import StarIcon from "../assets/images/star.svg";

import { AppLightColor } from "../styles/color";

import {
  COMMUNITY_DATA,
  COMMUNITY_TABS,
  type CommunityPost,
  type CommunityTabKey,
} from "../data/communityData";

const { width: SCREEN_W } = Dimensions.get("window");

const H_PADDING = 20;

const IMAGE_W = 162;
const IMAGE_H = 162;

const OVERLAP = 64;

const CARD_W = SCREEN_W - H_PADDING * 2;
const CONTENT_W = CARD_W - IMAGE_W + OVERLAP;

const TAB_H = 46;
const TAB_PX = 28;

const CommunityScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<CommunityTabKey>("hot");
  const [activeBottomTab, setActiveBottomTab] = useState<MainTabKey>("world");
  const [searchVisible, setSearchVisible] = useState(false);

  const suggestions = useMemo(() => {
    const all = [
      ...COMMUNITY_DATA.hot,
      ...COMMUNITY_DATA.new,
      ...COMMUNITY_DATA.old,
    ].map((x) => x.title);
    return Array.from(new Set(all));
  }, []);

  const posts = COMMUNITY_DATA[activeTab];

  const renderTab = (key: CommunityTabKey, label: string) => {
    const isActive = activeTab === key;
    return (
      <Pressable
        onPress={() => setActiveTab(key)}
        style={isActive ? styles.tabBtnActive : styles.tabBtn}
        hitSlop={10}
      >
        <AppText
          variant="medium"
          style={isActive ? styles.tabTextActive : styles.tabText}
        >
          {label}
        </AppText>
      </Pressable>
    );
  };

  const renderCard = (item: CommunityPost) => {
    return (
      <View key={item.id} style={styles.row}>
        <View style={styles.imageWrap}>
          <Image source={item.image} style={styles.image} />
        </View>

        <View style={styles.contentCard}>
          <AppText variant="bold" style={styles.title}>
            {item.title}
          </AppText>

          <AppText variant="light" style={styles.desc}>
            {item.desc}
          </AppText>

          <AppText variant="light" style={styles.author}>
            {item.authorLine}
          </AppText>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <ClockIcon width={12} height={12} />
              <AppText variant="medium" style={styles.metaText}>
                {item.timeMin} phút
              </AppText>
            </View>

            <View style={styles.metaItem}>
              <DoKhoIcon width={12} height={12} />
              <AppText variant="medium" style={styles.metaText}>
                {item.difficulty}
              </AppText>
            </View>

            <View style={styles.metaItem}>
              <StarIcon width={12} height={12} />
              <AppText variant="medium" style={styles.metaText}>
                {item.rating}
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
            style={styles.headerLeft}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.headerIconCircle}>
              <BackArrow width={18} height={18} />
            </View>
          </Pressable>

          <AppText variant="title" style={styles.headerTitle}>
            Cộng đồng
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
              onPress={() => navigation.navigate("NotificationScreen")}
            >
              <NotificationIcon width={18} height={18} />
            </Pressable>
          </View>
        </View>

        <View style={styles.tabsRow}>
          {COMMUNITY_TABS.map((t) => renderTab(t.key, t.label))}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {posts.map(renderCard)}
          <BottomNavSpacer height={120} />
        </ScrollView>

        <AppSearchModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          suggestions={suggestions}
          onSubmit={() => setSearchVisible(false)}
          onSelectSuggestion={() => setSearchVisible(false)}
        />

        <MainBottomNav
          activeTab={activeBottomTab}
          onTabPress={(tab) => setActiveBottomTab(tab)}
        />
      </View>
    </AppSafeView>
  );
};

export default CommunityScreen;

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
    paddingBottom: 10,
  },
  headerLeft: {
    width: 40,
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    color: AppLightColor.primary_color,
  },
  headerRight: {
    width: 86,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: 10,
  },
  headerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabBtn: {
    height: TAB_H,
    paddingHorizontal: TAB_PX,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  tabBtnActive: {
    height: TAB_H,
    paddingHorizontal: TAB_PX,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppLightColor.primary_color,
  },
  tabText: {
    fontSize: 16,
    color: AppLightColor.primary_color,
    fontWeight: "700",
  },
  tabTextActive: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },

  row: {
    width: CARD_W,
    height: IMAGE_H,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  imageWrap: {
    width: IMAGE_W,
    height: IMAGE_H,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#eee",
    zIndex: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  contentCard: {
    width: CONTENT_W,
    minHeight: 128,
    marginLeft: -OVERLAP,
    borderWidth: 1.5,
    borderColor: AppLightColor.primary_color,
    borderRadius: 26,
    paddingTop: 14,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 16 + OVERLAP,
    backgroundColor: "#fff",
    zIndex: 2,
  },

  title: {
    fontSize: 16,
    color: AppLightColor.primary_text,
  },
  desc: {
    fontSize: 12,
    color: AppLightColor.primary_text,
    opacity: 0.9,
    marginTop: 6,
    lineHeight: 16,
  },
  author: {
    fontSize: 11,
    color: AppLightColor.primary_text,
    opacity: 0.7,
    marginTop: 8,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  metaText: {
    fontSize: 12,
    color: AppLightColor.primary_color,
    fontWeight: "700",
  },
});
