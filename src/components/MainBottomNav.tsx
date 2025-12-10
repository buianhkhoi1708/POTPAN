// src/components/MainBottomNav.tsx

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { AppLightColor } from "../styles/color";
import type { SvgProps } from "react-native-svg";

// SVG mặc định
import HomeIcon from "../assets/images/home.svg";
import WorldIcon from "../assets/images/world.svg";
import CategoryIcon from "../assets/images/category.svg";
import ProfileIcon from "../assets/images/profile.svg";

// SVG khi active
import ActiveHomeIcon from "../assets/images/active-home.svg";
import ActiveWorldIcon from "../assets/images/active-world.svg";
import ActiveCategoryIcon from "../assets/images/active-category.svg";
import ActiveProfileIcon from "../assets/images/active-profile.svg";

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

const MainBottomNav: React.FC<MainBottomNavProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          const IconComponent = isActive ? tab.ActiveIcon : tab.Icon;

          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabPress && onTabPress(tab.key)}
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

export default MainBottomNav;

const styles = StyleSheet.create({
  // thu hẹp pill, canh giữa màn hình
  wrapper: {
    paddingBottom: 16,
    paddingTop: 4,
    alignItems: "center",
  },
  container: {
    width: "78%", // hẹp hơn, không chiếm full ngang
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
