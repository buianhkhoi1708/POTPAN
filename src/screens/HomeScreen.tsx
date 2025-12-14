// src/screens/HomeScreen.tsx  (cập nhật điều hướng tới FamousChefs + nav home)

import React, { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import BottomNavSpacer from "../components/BottomNavSpacer";
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
import SearchRecipeModal from "../components/SearchRecipeModal";

import styles from "../styles/homeScreenStyles";

type HomeScreenProps = {
  navigation: any;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] =
    useState<HomeCategoryKey>("family");
  const [activeTab, setActiveTab] = useState<MainTabKey>("home");
  const [searchVisible, setSearchVisible] = useState(false);

  const renderFeaturedCard = (item: HomeRecipe) => (
    <View key={item.id} style={styles.featuredCard}>
      <View style={styles.featuredImageWrap}>
        <Image source={item.thumbnail} style={styles.featuredImage} />
        <Pressable style={styles.featuredHeart}>
          <SaveIcon width={22} height={22} stroke="#ffffff" fill="none" />
        </Pressable>
      </View>

      <View style={styles.featuredInfo}>
        <AppText variant="bold" style={styles.featuredTitle}>
          {item.title}
        </AppText>
        <AppText variant="light" style={styles.featuredDesc}>
          {item.description}
        </AppText>

        <View style={styles.featuredMetaRow}>
          <View style={styles.featuredMetaLeft}>
            <Ionicons
              name="time-outline"
              size={12}
              color={AppLightColor.primary_color}
            />
            <AppText variant="light" style={styles.featuredMetaText}>
              {item.time}
            </AppText>
          </View>

          <View style={styles.featuredMetaRight}>
            <AppText variant="light" style={styles.featuredMetaText}>
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

  const renderSmallRecipeCard = (item: HomeRecipe, extraStyle?: any) => (
    <View key={item.id} style={[styles.smallCard, extraStyle]}>
      <View style={styles.smallImageWrap}>
        <Image source={item.thumbnail} style={styles.smallImage} />
        <Pressable style={styles.smallHeart}>
          <SaveIcon width={20} height={20} stroke="#ffffff" fill="none" />
        </Pressable>
      </View>

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
            <Pressable
              style={styles.headerIconCircle}
              onPress={() => setSearchVisible(true)}
            >
              <SearchIcon width={18} height={18} />
            </Pressable>
            <Pressable
              style={styles.headerIconCircle}
              onPress={() => navigation.navigate("Notification" as never)}
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
            <Pressable
              onPress={() => navigation.navigate("FamousChefs" as never)}
            >
              <AppText
                variant="title"
                style={[styles.sectionTitle, styles.sectionTitlePrimary]}
              >
                Các đầu bếp nổi tiếng
              </AppText>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {popularChefs.map(renderChefCard)}
          </ScrollView>

          {/* CÔNG THỨC THÊM GẦN ĐÂY */}
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
          <BottomNavSpacer height={60} />
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
              navigation.navigate("Home" as never);
            }
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default HomeScreen;
