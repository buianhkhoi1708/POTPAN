// Nhóm 9 - IE307.Q12
import React, { useState } from "react";
import { View, StyleSheet, Platform, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import AppText from "./AppText";
import AppSearchModal from "./AppSearchModal";
import NotificationBadge from "./AppNotificationBadge";
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

interface AppHeaderProps {
  title?: string;
  userName?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  onBackPress?: () => void;
  showBack?: boolean;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
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
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.leftContainer}>
          {showBack && (
            <Pressable onPress={onBackPress} style={styles.backButton}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.primary_color}
              />
            </Pressable>
          )}

          <View style={styles.textWrapper}>
            {userName ? (
              <>
                <AppText
                  variant="light"
                  style={[styles.helloSub, { color: theme.placeholder_text }]}
                >
                  {t("home.greeting")}
                </AppText>
                <AppText
                  variant="bold"
                  style={[styles.hello, { color: theme.primary_text }]}
                >
                  {userName} 👋
                </AppText>
              </>
            ) : (
              <AppText
                variant="bold"
                style={[styles.screenTitle, { color: theme.primary_color }]}
              >
                {title}
              </AppText>
            )}
          </View>
        </View>

        <View style={styles.headerIcons}>
          {showSearch && (
            <Pressable
              style={[
                styles.headerIconCircle,
                { backgroundColor: theme.primary_color },
              ]}
              onPress={
                onSearchPress ? onSearchPress : () => setSearchVisible(true)
              }
            >
              <Ionicons name="search-outline" size={20} color="#fff" />
            </Pressable>
          )}

          {showNotifications && (
            <Pressable
              style={[
                styles.headerIconCircle,
                { backgroundColor: theme.primary_color },
              ]}
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

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 8 : 12,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
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
  helloSub: {
    fontSize: 14,
    marginBottom: 2,
  },
  hello: {
    fontSize: 24,
  },
  screenTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
