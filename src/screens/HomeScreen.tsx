// HomeScreen.tsx

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

const { width: SCREEN_W } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<HomeCategoryKey>("family");
  const [activeTab, setActiveTab] = useState<MainTabKey>("home");

  const renderFeaturedCard = (item: HomeRecipe) => (
    <View key={item.id} style={styles.featuredCard}>
      <Image source={item.thumbnail} style={styles.featuredImage} />
      <Pressable style={styles.featuredHeart}>
        <Ionicons name="heart-outline" size={18} color="#fff" />
      </Pressable>
      <View style={styles.featuredInfo}>
        <AppText variant="bold" style={styles.featuredTitle}>
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

  const renderSmallRecipeCard = (item: HomeRecipe) => (
    <View key={item.id} style={styles.smallCard}>
      <View style={styles.smallImageWrap}>
        <Image source={item.thumbnail} style={styles.smallImage} />
        <Pressable style={styles.smallHeart}>
          <Ionicons name="heart-outline" size={14} color="#fff" />
        </Pressable>
      </View>
      <AppText variant="medium" style={styles.smallTitle}>
        {item.title}
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
              <Ionicons
                name="search"
                size={18}
                color={AppLightColor.primary_text}
              />
            </Pressable>
            <Pressable style={styles.headerIconCircle}>
              <Ionicons
                name="person-circle-outline"
                size={20}
                color={AppLightColor.primary_text}
              />
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
                  style={[
                    styles.categoryChip,
                    isActive && styles.categoryChipActive,
                  ]}
                >
                  <AppText
                    variant="medium"
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
            <AppText variant="bold" style={styles.sectionTitle}>
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
          <View style={styles.sectionHeader}>
            <View style={styles.sectionPillWrap}>
              <View style={styles.sectionPillBg} />
              <View style={styles.sectionPill}>
                <AppText variant="bold" style={styles.sectionPillText}>
                  Công thức của tôi
                </AppText>
              </View>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {myRecipes.map(renderSmallRecipeCard)}
          </ScrollView>

          {/* CÁC ĐẦU BẾP NỔI TIẾNG */}
          <View style={styles.sectionHeader}>
            <AppText variant="bold" style={styles.sectionTitle}>
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

          {/* CÔNG THỨC THÊM GẦN ĐÂY */}
          <View style={styles.sectionHeader}>
            <AppText variant="bold" style={styles.sectionTitle}>
              Công thức thêm gần đây
            </AppText>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListBottom}
          >
            {recentRecipes.map(renderSmallRecipeCard)}
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
    borderWidth: 1,
    borderColor: "#ffd0cf",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // CATEGORY
  categoryRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ffd0cf",
    backgroundColor: "#ffffff",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: AppLightColor.primary_color,
    borderColor: AppLightColor.primary_color,
  },
  categoryText: {
    fontSize: 14,
    color: "#777",
  },
  categoryTextActive: {
    color: "#fff",
  },

  // SECTION HEADER
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    color: AppLightColor.primary_text,
  },

  // FEATURED
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
    backgroundColor: "#00000055",
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
    fontSize: 18,
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

  // SECTION PILL "Công thức của tôi"
  sectionPillWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  sectionPillBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 22,
    borderRadius: 12,
    backgroundColor: AppLightColor.primary_color,
    opacity: 0.4,
  },
  sectionPill: {
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
  },
  sectionPillText: {
    color: "#fff",
    fontSize: 14,
  },

  // SMALL RECIPE CARD
  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  horizontalListBottom: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  smallCard: {
    width: 150,
    marginRight: 12,
  },
  smallImageWrap: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#eee",
  },
  smallImage: {
    width: "100%",
    height: 120,
  },
  smallHeart: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
  },
  smallTitle: {
    marginTop: 6,
    fontSize: 14,
    color: AppLightColor.primary_text,
  },

  // CHEF CARD
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
