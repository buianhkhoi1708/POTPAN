import React, { useState } from "react";
import { View, StyleSheet, Platform, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";
import AppSearchModal from "./AppSearchModal";

// 👇 Import component Badge độc lập
import NotificationBadge from "./AppNotificationBadge";

// 👇 1. Import các Store cần thiết cho logic "Đã đọc"
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";

interface AppHeaderProps {
  title?: string;
  userName?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  onBackPress?: () => void;
  showBack?: boolean;
  onNotificationPress?: () => void; 
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  userName,
  showSearch = true,
  showNotifications = true,
  onBackPress,
  showBack = false,
  onNotificationPress,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [searchVisible, setSearchVisible] = useState(false);

  // 👇 2. Lấy User ID và hàm đánh dấu đã đọc
  const user = useAuthStore((state) => state.user);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const handleNotificationPress = () => {
    // 👇 3. Logic: Bấm vào là reset số về 0 ngay lập tức
    if (user?.id) {
      markAllAsRead(user.id);
    }

    // Sau đó mới chuyển màn hình
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
              onPress={() => setSearchVisible(true)}
            >
              <Ionicons name="search-outline" size={20} color="#fff" />
            </Pressable>
          )}

         {showNotifications && (
          <Pressable style={styles.headerIconCircle} onPress={handleNotificationPress}>
            <Ionicons name="notifications-outline" size={20} color="#fff" />
            
            {/* Component độc lập hiển thị số (sẽ tự biến mất khi hàm markAllAsRead chạy) */}
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
});