import React, { useState } from "react";
import { View, StyleSheet, Platform, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import AppText from "./AppText";
import AppSearchModal from "./AppSearchModal";

// 👇 Import component Badge độc lập
import NotificationBadge from "./AppNotificationBadge";

// 👇 Import các Store
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";
// 👇 1. Import Theme Store
import { useThemeStore } from "../store/useThemeStore";

interface AppHeaderProps {
  title?: string;
  userName?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  onBackPress?: () => void;
  showBack?: boolean;
  onNotificationPress?: () => void; 
  onSearchPress?: () => void; // Thêm props này nếu muốn xử lý search bên ngoài
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  userName,
  showSearch = true,
  showNotifications = true,
  onBackPress,
  showBack = false,
  onNotificationPress,
  onSearchPress,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [searchVisible, setSearchVisible] = useState(false);

  // 👇 2. Lấy Theme
  const { theme, isDarkMode } = useThemeStore();

  const user = useAuthStore((state) => state.user);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const handleNotificationPress = () => {
    if (user?.id) {
      markAllAsRead(user.id);
    }
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      navigation.navigate("NotificationScreen");
    }
  };
  
  const handleSearchSubmit = (filters: any) => {
    setSearchVisible(false);
    navigation.navigate("SearchResultScreen", { filters });
  };

  return (
    <>
      {/* 👇 3. Áp dụng Background và Border động */}
      <View style={[styles.header, { 
          backgroundColor: theme.background,
          borderBottomColor: theme.border 
      }]}>
        <View style={styles.leftContainer}>
          {showBack && (
            <Pressable onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={theme.primary_color} />
            </Pressable>
          )}

          <View style={styles.textWrapper}>
            {userName ? (
              <>
                {/* 👇 Text phụ màu xám */}
                <AppText variant="light" style={[styles.helloSub, { color: theme.placeholder_text }]}>
                  {t("home.greeting")}
                </AppText>
                {/* 👇 Text chính màu primary_text */}
                <AppText variant="bold" style={[styles.hello, { color: theme.primary_text }]}>
                  {userName} 👋
                </AppText>
              </>
            ) : (
              // 👇 Title màu primary
              <AppText variant="bold" style={[styles.screenTitle, { color: theme.primary_color }]}>
                {title}
              </AppText>
            )}
          </View>
        </View>

        <View style={styles.headerIcons}>
          {showSearch && (
            <Pressable 
              // 👇 Nút tròn màu primary (Giữ nguyên hoặc đổi theo theme)
              style={[styles.headerIconCircle, { backgroundColor: theme.primary_color }]} 
              onPress={onSearchPress ? onSearchPress : () => setSearchVisible(true)}
            >
              {/* Icon bên trong nút primary thường là màu trắng để tương phản */}
              <Ionicons name="search-outline" size={20} color="#fff" />
            </Pressable>
          )}

         {showNotifications && (
          <Pressable 
            style={[styles.headerIconCircle, { backgroundColor: theme.primary_color }]} 
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications-outline" size={20} color="#fff" />
            
            <NotificationBadge 
               style={{ position: "absolute", top: -4, right: -4 }} 
            />
          </Pressable>
        )}
        </View>
      </View>

      {showSearch && (
        <AppSearchModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onSubmit={handleSearchSubmit}
        />
      )}
    </>
  );
};

export default AppHeader;

// Style tĩnh (Layout)
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 8 : 12,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    // Background và BorderColor đã được xử lý inline
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  helloSub: { fontSize: 14, marginBottom: 2 },
  hello: { fontSize: 24 },
  screenTitle: { 
    fontSize: 22, 
    lineHeight: 28 
  },
  headerIcons: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});