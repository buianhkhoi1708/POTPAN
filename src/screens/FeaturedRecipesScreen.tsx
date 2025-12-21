// src/screens/FeaturedRecipesScreen.tsx

import React, { useMemo, useState } from "react";
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
import AppSearchModal from "../components/AppSearchModal";
import BottomNavSpacer from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";

import BackArrow from "../assets/images/backarrow.svg";
import SearchIcon from "../assets/images/search.svg";
import NotificationIcon from "../assets/images/notification.svg";
import HotSaveIcon from "../assets/images/hot-save.svg";

import ClockIcon from "../assets/images/clock.svg";
import DoKhoIcon from "../assets/images/dokho.svg";
import StarIcon from "../assets/images/star.svg";

import {
  featuredHeroRecipe,
  featuredRecipeList,
  type FeaturedRecipeItem,
} from "../data/featuredRecipeData";

import { AppLightColor } from "../styles/color";

const { width: SCREEN_W } = Dimensions.get("window");

const H_PADDING = 20;
const CARD_W = SCREEN_W - H_PADDING * 2;

// HERO (full width)
const HERO_RADIUS = 26;
const HERO_INNER_RADIUS = 22;
const HERO_IMAGE_H = Math.round(SCREEN_W * 0.52);

// KÉO KHUNG NỘI DUNG XUỐNG (giảm overlap để title + desc không bị che)
const HERO_INFO_OVERLAP = 18;

// LIST (match Community)
const LIST_IMAGE_W = 162;
const LIST_IMAGE_H = 162;
const LIST_OVERLAP = 64;
const LIST_GAP = 18;

const FeaturedRecipesScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<MainTabKey>("home");
  const [searchVisible, setSearchVisible] = useState(false);

  const list = useMemo(() => featuredRecipeList, []);

  const renderRecipeCard = (item: FeaturedRecipeItem) => {
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
            style={styles.headerIconCircle}
            onPress={() => navigation.goBack()}
          >
            <BackArrow width={18} height={18} />
          </Pressable>

          <AppText variant="title" style={styles.headerTitle}>
            Công thức nổi bật
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
          {/* HERO: full width */}
          <View style={styles.heroOuter}>
            <View style={styles.heroCard}>
              <View style={styles.heroImageWrap}>
                <Image
                  source={featuredHeroRecipe.image}
                  style={styles.heroImage}
                />

                <Pressable style={styles.heroSaveBtn}>
                  <HotSaveIcon width={18} height={18} stroke="#fff" fill="none" />
                </Pressable>
              </View>

              {/* KHUNG NỘI DUNG ĐƯỢC KÉO XUỐNG */}
              <View style={styles.heroInfo}>
                <View style={styles.heroLeft}>
                  <AppText variant="bold" style={styles.heroTitle}>
                    {featuredHeroRecipe.title}
                  </AppText>

                  <AppText variant="light" style={styles.heroDesc}>
                    {featuredHeroRecipe.desc}
                  </AppText>
                </View>

                <View style={styles.heroRight}>
                  <View style={styles.heroMetaItem}>
                    <ClockIcon width={12} height={12} />
                    <AppText variant="medium" style={styles.heroMetaText}>
                      {featuredHeroRecipe.timeMin} phút
                    </AppText>
                  </View>

                  <View style={styles.heroMetaItem}>
                    <StarIcon width={12} height={12} />
                    <AppText variant="medium" style={styles.heroMetaText}>
                      {featuredHeroRecipe.rating}
                    </AppText>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <Pressable style={styles.viewAllRow}>
            <AppText variant="subtitle" style={styles.viewAllText}>
              Xem tất cả
            </AppText>
          </Pressable>

          <View style={styles.listWrap}>{list.map(renderRecipeCard)}</View>

          <BottomNavSpacer height={110} />
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
            if (tab === "category") navigation.navigate("Page2" as never);
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default FeaturedRecipesScreen;

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
    paddingBottom: 20,
  },

  // HERO full width
  heroOuter: {
    marginTop: 6,
    marginHorizontal: -H_PADDING,
  },
  heroCard: {
    width: SCREEN_W,
    alignSelf: "center",
    borderRadius: HERO_RADIUS,
    backgroundColor: AppLightColor.primary_color,
    padding: 12,
  },
  heroImageWrap: {
    borderRadius: HERO_INNER_RADIUS,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  heroImage: {
    width: "100%",
    height: HERO_IMAGE_H,
  },
  heroSaveBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  // FIX: giảm overlap + tăng padding để nội dung không bị “lủng”/tụt
  heroInfo: {
    marginTop: -HERO_INFO_OVERLAP,
    marginHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    minHeight: 84,
    flexDirection: "row",
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  heroLeft: { flex: 1, paddingRight: 10 },
  heroTitle: { fontSize: 18, color: AppLightColor.primary_text },
  heroDesc: {
    marginTop: 6,
    fontSize: 12,
    color: AppLightColor.primary_text,
    opacity: 0.75,
    lineHeight: 16,
    maxHeight: 32,
    overflow: "hidden",
  },
  heroRight: { alignItems: "flex-end", rowGap: 10 },
  heroMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  heroMetaText: {
    fontSize: 12,
    color: AppLightColor.primary_color,
    fontWeight: "700",
  },

  viewAllRow: {
    alignItems: "flex-end",
    paddingTop: 10,
    paddingBottom: 8,
  },
  viewAllText: {
    color: AppLightColor.primary_color,
    fontSize: 16,
  },

  // LIST
  listWrap: { paddingTop: 6, rowGap: LIST_GAP },

  row: {
    width: CARD_W,
    height: LIST_IMAGE_H,
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrap: {
    width: LIST_IMAGE_W,
    height: LIST_IMAGE_H,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#eee",
    zIndex: 3,
  },
  image: { width: "100%", height: "100%" },

  contentCard: {
    flex: 1,
    marginLeft: -LIST_OVERLAP,
    borderWidth: 1.5,
    borderColor: AppLightColor.primary_color,
    borderRadius: 26,
    paddingTop: 14,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: LIST_OVERLAP + 16,
    backgroundColor: "#fff",
    zIndex: 2,
  },

  title: { fontSize: 16, color: AppLightColor.primary_text },
  desc: {
    marginTop: 6,
    fontSize: 12,
    color: AppLightColor.primary_text,
    opacity: 0.75,
    lineHeight: 16,
    maxHeight: 32,
    overflow: "hidden",
  },
  author: {
    marginTop: 8,
    fontSize: 11,
    color: AppLightColor.primary_text,
    opacity: 0.7,
    maxHeight: 16,
    overflow: "hidden",
  },

  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaItem: { flexDirection: "row", alignItems: "center", columnGap: 6 },
  metaText: {
    fontSize: 12,
    color: AppLightColor.primary_color,
    fontWeight: "700",
  },
});
