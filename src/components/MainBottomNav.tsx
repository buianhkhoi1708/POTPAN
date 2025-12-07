import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppLightColor } from "../styles/color";

export type MainTabKey = "home" | "discover" | "world" | "profile";

interface MainBottomNavProps {
  activeTab: MainTabKey;
  onTabPress?: (tab: MainTabKey) => void;
}

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: { key: MainTabKey; icon: IconName }[] = [
  { key: "home", icon: "home" as IconName },
  { key: "discover", icon: "compass-outline" as IconName },
  { key: "world", icon: "globe-outline" as IconName },
  { key: "profile", icon: "person-outline" as IconName },
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
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabPress && onTabPress(tab.key)}
              android_ripple={{ color: "#ffe0dd", borderless: true }}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={isActive ? "#fff" : "#ffffffcc"}
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
