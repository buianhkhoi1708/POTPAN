import React, { useState } from "react"; // Thêm useState
import { View, StyleSheet, Platform, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native"; // Thêm navigation hook
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";
import AppSearchModal from "./AppSearchModal"; // Import Modal vào đây luôn

interface AppHeaderProps {
  title?: string;
  userName?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  unreadCount?: number;
  onBackPress?: () => void;
  showBack?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  userName,
  showSearch = true,
  showNotifications = true,
  unreadCount = 0,
  onBackPress,
  showBack = false,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const onNotificationPress = () => {
    navigation.navigate("NotificationScreen")
  }
  
  // Quản lý trạng thái Search Modal ngay tại Header
  const [searchVisible, setSearchVisible] = useState(false);

  const handleSearchSubmit = (filters: any) => {
    setSearchVisible(false);
    // Khi tìm kiếm xong, tự động nhảy sang màn hình kết quả
    navigation.navigate("SearchResultScreen", { filters });
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          {showBack && (
            <Pressable onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={AppLightColor.primary_color} />
            </Pressable>
          )}

          <View style={styles.textWrapper}>
            {userName ? (
              <>
                <AppText variant="light" style={styles.helloSub}>{t("home.greeting")}</AppText>
                <AppText variant="bold" style={styles.hello}>{userName} 👋</AppText>
              </>
            ) : (
              <AppText variant="bold" style={styles.screenTitle}>{title}</AppText>
            )}
          </View>
        </View>

        <View style={styles.headerIcons}>
          {showSearch && (
            <Pressable 
              style={styles.headerIconCircle} 
              onPress={() => setSearchVisible(true)} // Mở modal tại đây
            >
              <Ionicons name="search-outline" size={20} color="#fff" />
            </Pressable>
          )}

          {showNotifications && (
            <Pressable style={styles.headerIconCircle} onPress={onNotificationPress}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                  <AppText style={styles.badgeText}>{unreadCount > 99 ? "99+" : unreadCount}</AppText>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>

      {/* MODAL NẰM TRONG HEADER: Sẽ xuất hiện ở mọi màn hình có dùng Header này */}
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

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 8 : 12,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
  helloSub: { fontSize: 14, color: "#666", marginBottom: 2 },
  hello: { fontSize: 24, color: AppLightColor.primary_text },
  screenTitle: { 
    fontSize: 22, 
    color: AppLightColor.primary_color,
    lineHeight: 28 
  },
  headerIcons: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
});