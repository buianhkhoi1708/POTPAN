import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { SvgProps } from "react-native-svg";
import { AppLightColor } from "../styles/color";
import HomeIcon from "../assets/images/home.svg";
import WorldIcon from "../assets/images/world.svg";
import CategoryIcon from "../assets/images/category.svg";
import ProfileIcon from "../assets/images/profile.svg";
import ActiveHomeIcon from "../assets/images/active-home.svg";
import ActiveWorldIcon from "../assets/images/active-world.svg";
import ActiveCategoryIcon from "../assets/images/active-category.svg";
import ActiveProfileIcon from "../assets/images/active-profile.svg";
import { RootStackParamList } from "../type/types";

export type MainTabKey = "home" | "world" | "category" | "profile";

interface MainBottomNavProps {
  activeTab: MainTabKey;
  onTabPress?: (tab: MainTabKey) => void;
}

type TabConfig = {
  key: MainTabKey;
  Icon: React.ComponentType<SvgProps>;
  ActiveIcon: React.ComponentType<SvgProps>;
};

const TABS: TabConfig[] = [
  { key: "home", Icon: HomeIcon, ActiveIcon: ActiveHomeIcon },
  { key: "world", Icon: WorldIcon, ActiveIcon: ActiveWorldIcon },
  { key: "category", Icon: CategoryIcon, ActiveIcon: ActiveCategoryIcon },
  { key: "profile", Icon: ProfileIcon, ActiveIcon: ActiveProfileIcon },
];

const AppMainNavBar = ({ activeTab, onTabPress } : MainBottomNavProps) => {
  const navigation = useNavigation<RootStackParamList>();

  const ROUTE_BY_TAB: Record<MainTabKey, string> = {
    home: "HomeScreen",
    world: "FamousChefs",
    category: "Category",
    profile: "ProfileScreen",
  };

  const handlePress = (tab: MainTabKey) => {
    if (tab === activeTab) return;

    onTabPress?.(tab);

    const routeName = ROUTE_BY_TAB[tab];
    if (routeName) navigation.navigate(routeName);
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          const IconComponent = isActive ? tab.ActiveIcon : tab.Icon;

          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => handlePress(tab.key)}
              android_ripple={{ color: "#ffe0dd", borderless: true }}
            >
              <IconComponent width={20} height={20} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default AppMainNavBar;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
  },
  container: {
    width: "78%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
    paddingHorizontal: 24,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
});