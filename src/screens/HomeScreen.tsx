import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import { AppLightColor } from "../styles/color";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import {
  featuredRecipes,
  homeCategories,
  myRecipes,
  popularChefs,
  recentRecipes,
  type HomeRecipe,
  type HomeChef,
  type HomeCategoryKey,
} from "../data/homeData";
import SearchIcon from "../assets/images/search.svg";
import NotificationIcon from "../assets/images/notification.svg";
import SaveIcon from "../assets/images/save.svg";
import AppSearchModal from "../components/AppSearchModal";
import App from "../../App";

type HomeScreenProps = {
  navigation: any;
};

const { width: SCREEN_W } = Dimensions.get("window");

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const isFocused = useIsFocused();

  const [selectedCategory, setSelectedCategory] =
    useState<HomeCategoryKey>("family");
  const [activeTab, setActiveTab] = useState<MainTabKey>("home");
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    if (isFocused) setActiveTab("home");
  }, [isFocused]);

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

          <View style={styles.sectionHeader}>
            <AppText
              variant="bold"
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

          <View style={styles.mySectionWrapper}>
            <View style={styles.mySectionHeader}>
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
              contentContainerStyle={styles.mySectionList}
            >
              {myRecipes.map((item) => renderSmallRecipeCard(item))}
            </ScrollView>
          </View>

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

          <View style={styles.sectionHeader}>
            <AppText
              variant="bold"
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

          <AppBottomSpace height={60} />
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
            if (tab === "world") navigation.navigate("FamousChefs" as never);
            if (tab === "profile") navigation.navigate("ProfileScreen" as never);
            if (tab === "category") navigation.navigate("Page2" as never);
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hello: { fontSize: 26, color: AppLightColor.primary_text },
  headerIcons: { flexDirection: "row", alignItems: "center", columnGap: 10 },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  categoryRow: { paddingHorizontal: 16, paddingBottom: 8 },
  categoryItem: { marginRight: 16, paddingVertical: 4 },
  categoryText: { color: AppLightColor.primary_color },
  categoryTextActive: { color: AppLightColor.primary_color },

  sectionHeader: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  sectionTitle: { color: AppLightColor.primary_text },
  sectionTitlePrimary: { color: AppLightColor.primary_color },

  featuredRow: { paddingHorizontal: 20, paddingBottom: 12 },
  featuredCard: { width: SCREEN_W - 40, marginRight: 16 },
  featuredImageWrap: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  featuredImage: { width: "100%", height: 200 },
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
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppLightColor.primary_color,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: -14,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  featuredTitle: { fontSize: 18, color: "#000" },
  featuredDesc: { fontSize: 13, color: "#555", marginTop: 2 },
  featuredMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  featuredMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  featuredMetaRight: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  featuredMetaText: { fontSize: 12, color: AppLightColor.primary_color },

  mySectionWrapper: {
    marginTop: 8,
    marginHorizontal: -16,
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 8,
    paddingBottom: 18,
  },
  mySectionHeader: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4 },

  // FIX: thêm paddingBottom để shadow của card không bị “cắt” ở dưới
  mySectionList: {
    paddingHorizontal: 32,
    paddingTop: 4,
    paddingBottom: 12,
  },

  sectionPillWrap: { alignItems: "center", justifyContent: "center" },
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
  sectionPillText: { color: AppLightColor.primary_color },

  horizontalList: { paddingHorizontal: 16, paddingBottom: 8 },
  horizontalListBottom: { paddingHorizontal: 16, paddingBottom: 24 },

  // FIX: overflow visible + thêm paddingBottom để bóng/đổ (shadow) không bị clip
  smallCard: {
    width: 190,
    marginRight: 16,
    overflow: "visible",
    paddingBottom: 10,
  },
  smallCardRecent: { borderRadius: 10, padding: 4, overflow: "visible" },

  smallImageWrap: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#eee",
    position: "relative",
  },
  smallImage: { width: "100%", height: 120 },
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

  // FIX: bỏ border đen + tăng shadow/elevation, bỏ marginHorizontal âm để tránh clip
  smallInfo: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppLightColor.primary_color,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: -10,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
    elevation: 3,
  },
  smallTitle: { fontSize: 18, color: "#000" },
  smallMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  smallMetaLeft: { flexDirection: "row", alignItems: "center", columnGap: 4 },
  smallMetaRight: { flexDirection: "row", alignItems: "center", columnGap: 4 },
  smallMetaText: { fontSize: 12, color: AppLightColor.primary_color },

  chefCard: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#eee",
  },
  chefImage: { width: "100%", height: "100%" },
});
