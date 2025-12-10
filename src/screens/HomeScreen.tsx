// src/screens/HomeScreen.tsx

import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { AppLightColor } from "../styles/color";
import MainBottomNav, { MainTabKey } from "../components/MainBottomNav";
import {
  featuredRecipes,
  homeCategories,
  myRecipes,
  popularChefs,
  recentRecipes,
  type HomeRecipe,
  type HomeChef,
  type HomeCategoryKey,
} from "../config/homeData";

import SearchIcon from "../assets/images/search.svg";
import NotificationIcon from "../assets/images/notification.svg";
import SaveIcon from "../assets/images/save.svg";

const { width: SCREEN_W } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<HomeCategoryKey>("family");
  const [activeTab, setActiveTab] = useState<MainTabKey>("home");

  const renderFeaturedCard = (item: HomeRecipe) => (
    <View key={item.id} style={styles.featuredCard}>
      <Image source={item.thumbnail} style={styles.featuredImage} />
      <Pressable style={styles.featuredHeart}>
        <SaveIcon width={22} height={22} stroke="#ffffff" fill="none" />
      </Pressable>
      <View style={styles.featuredInfo}>
        <AppText variant="title" style={styles.featuredTitle}>
          {item.title}
        </AppText>
        <AppText variant="light" style={styles.featuredDesc}>
          {item.description}
        </AppText>
        <View style={styles.metaRow}>
          <AppText variant="light" style={styles.metaText}>
            {item.time}
          </AppText>
          <AppText variant="light" style={styles.metaText}>
            {item.rating} ★
          </AppText>
        </View>
      </View>
    </View>
  );

  // extraStyle dùng cho card "Công thức thêm gần đây"
  const renderSmallRecipeCard = (item: HomeRecipe, extraStyle?: any) => (
    <View key={item.id} style={[styles.smallCard, extraStyle]}>
      <View style={styles.smallImageWrap}>
        <Image source={item.thumbnail} style={styles.smallImage} />
        <Pressable style={styles.smallHeart}>
          <SaveIcon width={20} height={20} stroke="#ffffff" fill="none" />
        </Pressable>
      </View>

      {/* panel trắng tách riêng, tràn ngang ra một chút */}
      <View style={styles.smallInfo}>
        <AppText variant="bold" style={styles.smallTitle}>
          {item.title}
        </AppText>

        <View style={styles.smallMetaRow}>
          <View style={styles.smallMetaLeft}>
            <Ionicons
              name="time-outline"
              size={12}
              color={AppLightColor.primary_color}
            />
            <AppText variant="light" style={styles.smallMetaText}>
              {item.time}
            </AppText>
          </View>

          <View style={styles.smallMetaRight}>
            <AppText variant="light" style={styles.smallMetaText}>
              {item.rating}
            </AppText>
            <Ionicons
              name="star"
              size={12}
              color={AppLightColor.primary_color}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderChefCard = (chef: HomeChef) => (
    <View key={chef.id} style={styles.chefCard}>
      <Image source={chef.avatar} style={styles.chefImage} />
    </View>
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <AppText variant="bold" style={styles.hello}>
              Xin chào Khôi !
            </AppText>
          </View>
          <View style={styles.headerIcons}>
            <Pressable style={styles.headerIconCircle}>
              <SearchIcon width={18} height={18} />
            </Pressable>
            <Pressable style={styles.headerIconCircle}>
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
          {/* DANH MỤC NGANG */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {homeCategories.map((cat) => {
              const isActive = cat.id === selectedCategory;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={styles.categoryItem}
                >
                  <AppText
                    variant="subtitle"
                    style={
                      isActive
                        ? [styles.categoryText, styles.categoryTextActive]
                        : styles.categoryText
                    }
                  >
                    {cat.label}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* CÔNG THỨC NỔI BẬT */}
          <View style={styles.sectionHeader}>
            <AppText
              variant="title"
              style={[styles.sectionTitle, styles.sectionTitlePrimary]}
            >
              Công thức nấu ăn nổi bật
            </AppText>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center"
            contentContainerStyle={styles.featuredRow}
          >
            {featuredRecipes.map(renderFeaturedCard)}
          </ScrollView>

          {/* CÔNG THỨC CỦA TÔI */}
          <View style={styles.mySectionWrapper}>
            <View style={styles.mySectionHeader}>
              <View style={styles.sectionPillWrap}>
                <View style={styles.sectionPillBg} />
                <View style={styles.sectionPill}>
                  <AppText variant="title" style={styles.sectionPillText}>
                    Công thức của tôi
                  </AppText>
                </View>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mySectionList}
            >
              {myRecipes.map((item) => renderSmallRecipeCard(item))}
            </ScrollView>
          </View>

          {/* CÁC ĐẦU BẾP NỔI TIẾNG */}
          <View style={styles.sectionHeader}>
            <AppText
              variant="title"
              style={[styles.sectionTitle, styles.sectionTitlePrimary]}
            >
              Các đầu bếp nổi tiếng
            </AppText>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {popularChefs.map(renderChefCard)}
          </ScrollView>

          {/* CÔNG THỨC THÊM GẦN ĐÂY – card có border để phân biệt */}
          <View style={styles.sectionHeader}>
            <AppText
              variant="title"
              style={[styles.sectionTitle, styles.sectionTitlePrimary]}
            >
              Công thức thêm gần đây
            </AppText>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListBottom}
          >
            {recentRecipes.map((item) =>
              renderSmallRecipeCard(item, styles.smallCardRecent)
            )}
          </ScrollView>
        </ScrollView>

        {/* NAV BOTTOM DÙNG CHUNG */}
        <MainBottomNav
          activeTab={activeTab}
          onTabPress={(tab) => setActiveTab(tab)}
        />
      </View>
    </AppSafeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hello: {
    fontSize: 26,
    color: AppLightColor.primary_text,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  categoryRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryItem: {
    marginRight: 16,
    paddingVertical: 4,
  },
  categoryText: {
    color: AppLightColor.primary_color,
  },
  categoryTextActive: {
    color: AppLightColor.primary_color,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  sectionTitle: {
    color: AppLightColor.primary_text,
  },
  sectionTitlePrimary: {
    color: AppLightColor.primary_color,
  },

  featuredRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  featuredCard: {
    width: SCREEN_W - 40,
    borderRadius: 18,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "#eee",
  },
  featuredImage: {
    width: "100%",
    height: 200,
  },
  featuredHeart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredInfo: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#00000055",
  },
  featuredTitle: {
    color: "#fff",
  },
  featuredDesc: {
    fontSize: 13,
    color: "#fefefe",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#fefefe",
  },

  // khối "Công thức của tôi" chạm mép màn
  mySectionWrapper: {
    marginTop: 8,
    marginHorizontal: -16,
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 8,
    paddingBottom: 14,
  },
  mySectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  mySectionList: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  sectionPillWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  sectionPillBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
  },
  sectionPill: {
    paddingHorizontal: 32,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#ffffff",
  },
  sectionPillText: {
    color: AppLightColor.primary_color,
  },

  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  horizontalListBottom: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  smallCard: {
    width: 190,
    marginRight: 16,
  },
  // border riêng cho "Công thức thêm gần đây"
  smallCardRecent: {
    
    borderRadius: 10,
    padding: 4,
    overflow: "visible",
  },

  smallImageWrap: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#eee",
    position: "relative",
  },
  smallImage: {
    width: "100%",
    height: 120,
  },
  smallHeart: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  // panel trắng tách riêng + tràn ngang
  smallInfo: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: -10,          // đè lên nhẹ phần dưới ảnh
    marginHorizontal: -6,    // tràn ra hai bên một chút
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  smallTitle: {
    fontSize: 18,
    color: "#000",
  },
  smallMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  smallMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  smallMetaRight: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  smallMetaText: {
    fontSize: 12,
    color: AppLightColor.primary_color,
  },

  chefCard: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#eee",
  },
  chefImage: {
    width: "100%",
    height: "100%",
  },
});
