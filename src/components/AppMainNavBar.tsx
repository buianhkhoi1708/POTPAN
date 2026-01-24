// Nhóm 9 - IE307.Q12
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; //
import { AppLightColor } from "../styles/color";

export type MainTabKey = "home" | "world" | "category" | "profile";

interface MainBottomNavProps {
  activeTab: MainTabKey;
  onTabPress?: (tab: MainTabKey) => void;
}

type TabConfig = {
  key: MainTabKey;
  iconName: keyof typeof Ionicons.glyphMap;
  activeIconName: keyof typeof Ionicons.glyphMap;
};

const TABS: TabConfig[] = [
  {
    key: "home",
    iconName: "home-outline",
    activeIconName: "home",
  },
  {
    key: "world",
    iconName: "earth-outline",
    activeIconName: "earth",
  },
  {
    key: "category",
    iconName: "grid-outline",
    activeIconName: "grid",
  },
  {
    key: "profile",
    iconName: "person-outline",
    activeIconName: "person",
  },
];

const AppMainNavBar = ({ activeTab, onTabPress }: MainBottomNavProps) => {
  const navigation = useNavigation<any>();

  const ROUTE_BY_TAB: Record<MainTabKey, string> = {
    home: "HomeScreen",
    world: "CommunityScreen",
    category: "CategoriesScreen",
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

          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => handlePress(tab.key)}
              android_ripple={{ color: "#ffe0dd", borderless: true }}
            >
              <Ionicons
                name={isActive ? tab.activeIconName : tab.iconName}
                size={22}
                color={isActive ? AppLightColor.primary_color : "#ffffff"}
              />
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
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
    paddingHorizontal: 24,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});
