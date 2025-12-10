// src/components/MainBottomNav.tsx

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { AppLightColor } from "../styles/color";
import type { SvgProps } from "react-native-svg";

// SVG của bạn
import HomeIcon from "../assets/images/home.svg";
import CategoryIcon from "../assets/images/category.svg";
import WorldIcon from "../assets/images/world.svg";
import ProfileIcon from "../assets/images/profile.svg";

export type MainTabKey = "home" | "world" | "category" | "profile";

interface MainBottomNavProps {
  activeTab: MainTabKey;
  onTabPress?: (tab: MainTabKey) => void;
}

type TabConfig = {
  key: MainTabKey;
  Icon: React.ComponentType<SvgProps>;
};

const TABS: TabConfig[] = [
  { key: "home", Icon: HomeIcon },
  { key: "world", Icon: WorldIcon },
  { key: "category", Icon: CategoryIcon },
  { key: "profile", Icon: ProfileIcon },
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
          const IconComponent = tab.Icon;

          const iconColor = isActive ? "#ffffff" : "#ffffffcc";

          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabPress && onTabPress(tab.key)}
              android_ripple={{ color: "#ffe0dd", borderless: true }}
            >
              <IconComponent
                width={22}
                height={22}
                fill={iconColor}
                stroke={iconColor}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default MainBottomNav;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 4,
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
    paddingHorizontal: 24,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    borderRadius: 999,
    backgroundColor: "#ffffff33",
    paddingVertical: 4,
  },
});
