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
const CARD_IMAGE_W = 112;
const CARD_W = SCREEN_W - 20 * 2;
const CARD_H = 122;

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
      <View key={item.id} style={styles.card}>
        <View style={styles.cardImageWrap}>
          <Image source={item.image} style={styles.cardImage} />
        </View>

        <View style={styles.cardRight}>
          <AppText variant="bold" style={styles.cardTitle}>
            {item.title}
          </AppText>

          <AppText variant="light" style={styles.cardDesc}>
            {item.desc}
          </AppText>

          <AppText variant="light" style={styles.cardAuthor}>
            {item.authorLine}
          </AppText>

          <View style={styles.cardMetaRow}>
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
          <BottomNavSpacer height={90} />
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
    width: 80,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: 8,
  },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    paddingBottom: 10,
  },
  tabBtn: {
    height: 34,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  tabBtnActive: {
    height: 34,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppLightColor.primary_color,
  },
  tabText: {
    fontSize: 14,
    color: AppLightColor.primary_color,
    fontWeight: "700",
  },
  tabTextActive: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },

  card: {
    width: CARD_W,
    height: CARD_H,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  cardImageWrap: {
    width: CARD_IMAGE_W,
    height: CARD_H,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },

  cardRight: {
    flex: 1,
    height: CARD_H - 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: AppLightColor.primary_color,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  cardTitle: {
    fontSize: 14,
    color: AppLightColor.primary_text,
  },
  cardDesc: {
    fontSize: 11,
    color: AppLightColor.primary_text,
    opacity: 0.9,
    marginTop: 2,
  },
  cardAuthor: {
    fontSize: 10,
    color: AppLightColor.primary_text,
    opacity: 0.7,
    marginTop: 2,
  },

  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  metaText: {
    fontSize: 11,
    color: AppLightColor.primary_color,
    fontWeight: "700",
  },
});
