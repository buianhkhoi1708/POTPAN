import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // 👇 1. Import Ionicons
import { AppLightColor } from "../styles/color";
// Không cần import SVG nữa

// Nếu bạn chưa có file types, có thể dùng any tạm thời hoặc import đúng đường dẫn
// import { RootStackParamList } from "../type/types"; 

export type MainTabKey = "home" | "world" | "category" | "profile";

interface MainBottomNavProps {
  activeTab: MainTabKey;
  onTabPress?: (tab: MainTabKey) => void;
}

type TabConfig = {
  key: MainTabKey;
  iconName: keyof typeof Ionicons.glyphMap;       // Tên icon khi chưa chọn
  activeIconName: keyof typeof Ionicons.glyphMap; // Tên icon khi đang chọn
};

// 👇 2. Cấu hình Icon
const TABS: TabConfig[] = [
  { 
    key: "home", 
    iconName: "home-outline", 
    activeIconName: "home" 
  },
  { 
    key: "world", 
    iconName: "earth-outline", // Hoặc dùng "people-outline" nếu muốn biểu tượng nhóm người
    activeIconName: "earth" 
  },
  { 
    key: "category", 
    iconName: "grid-outline", 
    activeIconName: "grid" 
  },
  { 
    key: "profile", 
    iconName: "person-outline", 
    activeIconName: "person" 
  },
];

const AppMainNavBar = ({ activeTab, onTabPress }: MainBottomNavProps) => {
  const navigation = useNavigation<any>(); // Dùng any để tránh lỗi type nếu chưa config kỹ

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
              {/* 👇 3. Render Ionicons */}
              <Ionicons 
                name={isActive ? tab.activeIconName : tab.iconName} 
                size={22} 
                // Logic màu: 
                // - Nếu Active (nền trắng) -> Icon màu Chính
                // - Nếu Inactive (nền màu chính) -> Icon màu Trắng
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
    // pointerEvents="box-none" ở View cha giúp bấm xuyên qua vùng trống 
    // (nhưng style này phải hỗ trợ bởi props pointerEvents ở trên)
  },
  container: {
    width: "80%", // Tăng nhẹ chiều rộng để thoáng hơn
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
    paddingHorizontal: 24,
    paddingVertical: 10, // Tăng padding dọc một chút
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, // Đậm hơn chút cho nổi
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
    // Thêm shadow nhẹ cho nút active
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});