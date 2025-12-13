// src/screens/FamousChefsScreen.tsx

import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { AppLightColor } from "../styles/color";
import MainBottomNav, { MainTabKey } from "../components/MainBottomNav";
import SearchRecipeModal from "../components/SearchRecipeModal";

import BackArrow from "../assets/images/backarrow.svg";
import SearchIcon from "../assets/images/search.svg";
import NotificationIcon from "../assets/images/notification.svg";
import StarIcon from "../assets/images/star.svg";
import ShareChefIcon from "../assets/images/share-chef.svg";

// ảnh đầu bếp 1–6
import Chef1Img from "../assets/images/chef1.png";
import Chef2Img from "../assets/images/chef2.png";
import Chef3Img from "../assets/images/chef3.png";
import Chef4Img from "../assets/images/chef4.png";
import Chef5Img from "../assets/images/chef5.png";
import Chef6Img from "../assets/images/chef6.png";

type ChefCard = {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  handle: string;
  followers: number;
};

const CHEFS: ChefCard[] = [
  {
    id: "chef1",
    name: "Gordan Ramsay",
    avatar: Chef1Img,
    handle: "@Gordon_chef",
    followers: 6687,
  },
  {
    id: "chef2",
    name: "Leslie Gilliams",
    avatar: Chef2Img,
    handle: "@Leslie Gilliams",
    followers: 5687,
  },
  {
    id: "chef3",
    name: "Micheal Ballack",
    avatar: Chef3Img,
    handle: "@ballack36",
    followers: 6687,
  },
  {
    id: "chef4",
    name: "Christine Hà",
    avatar: Chef4Img,
    handle: "@theblindcook",
    followers: 5687,
  },
  {
    id: "chef5",
    name: "Nguyễn Thị Linh",
    avatar: Chef5Img,
    handle: "@linhcute",
    followers: 6687,
  },
  {
    id: "chef6",
    name: "Trần Trung Hiếu",
    avatar: Chef6Img,
    handle: "@hieutran",
    followers: 5687,
  },
];

const topChefs = CHEFS.slice(0, 2);
const favoriteChefs = CHEFS.slice(2, 4);
const newChefs = CHEFS.slice(4);

const { width: SCREEN_W } = Dimensions.get("window");
// cùng công thức cho tất cả card
const CARD_WIDTH = (SCREEN_W - 20 * 2 - 12) / 2;

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
                style={
                  isFollowing ? styles.followTextActive : styles.followText
                }
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
              onPress={() => navigation.navigate("Notification")}
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
          {/* ĐẦU BẾP NỔI BẬT – KHỐI HỒNG, CHỈ CÓ LIST NGANG */}
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

          {/* ĐẦU BẾP ĐƯỢC YÊU THÍCH NHẤT */}
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

          {/* ĐẦU BẾP MỚI */}
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
              navigation.navigate("Home");
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

  // HEADER
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
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  // SCROLL
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // KHỐI ĐẦU BẾP NỔI BẬT
  sectionBlockTop: {
    marginHorizontal: -20,
    marginBottom: 16,
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 20,
  },
  sectionTopInner: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },

  // CÁC SECTION DƯỚI
  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: AppLightColor.primary_color,
    fontWeight: "700",
    marginBottom: 8,
  },

  horizontalList: {
    paddingRight: 20,
  },

  // CARD
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
  },
  cardImageWrap: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardInfo: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppLightColor.primary_color,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: -12,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  chefName: {
    fontSize: 13,
    color: AppLightColor.primary_text,
  },
  chefHandle: {
    fontSize: 12,
    color: AppLightColor.primary_color,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  followersRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 3,
  },
  followersText: {
    fontSize: 12,
    color: AppLightColor.primary_color,
    fontWeight: "700",
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
    fontWeight: "700",
  },

  shareBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
});
