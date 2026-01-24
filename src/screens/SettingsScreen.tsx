// Nhóm 9 - IE307.Q12
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader";
import AppConfirmModal from "../components/AppConfirmModal";
import { useAuthStore } from "../store/useAuthStore";
import { AppLightColor } from "../styles/color";
import { useThemeStore } from "../store/useThemeStore";

const SettingItem = ({
  icon,
  title,
  onPress,
  color = AppLightColor.primary_color,
  showChevron = true,
  isDanger = false,
  theme,
  isDarkMode,
  rightComponent,
}: any) => (
  <TouchableOpacity
    style={styles.itemContainer}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={!!rightComponent}
  >
    <View style={styles.itemLeft}>
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: isDanger
              ? isDarkMode
                ? "#3A1D1E"
                : "#FFE5E5"
              : isDarkMode
              ? `${color}20`
              : `${color}15`,
          },
        ]}
      >
        <Ionicons name={icon} size={22} color={isDanger ? "#FF4444" : color} />
      </View>

      <AppText
        style={[
          styles.itemTitle,
          { color: isDanger ? "#FF4444" : theme.primary_text },
        ]}
      >
        {title}
      </AppText>
    </View>

    {rightComponent
      ? rightComponent
      : showChevron && (
          <Ionicons name="chevron-forward" size={20} color={theme.icon} />
        )}
  </TouchableOpacity>
);

const SectionTitle = ({ title, color }: { title: string; color: string }) => (
  <AppText style={[styles.sectionTitle, { color }]}>{title}</AppText>
);

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { theme, isDarkMode, toggleTheme } = useThemeStore();
  const { logout, deleteAccount, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
    } catch (error: any) {
      Alert.alert(t("common.error"), error.message);
      setShowLogoutModal(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      Alert.alert(t("common.success"), t("settings.delete_success"));
      setShowDeleteModal(false);
    } catch (error: any) {
      Alert.alert(t("common.error"), error.message);
      setShowDeleteModal(false);
    }
  };

  return (
    <AppSafeView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <AppHeader
        title={t("settings.title")}
        showBack
        onBackPress={() => navigation.goBack()}
        showNotifications={false}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle
          title={t("settings.group_general") || "Chung"}
          color={theme.placeholder_text}
        />

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.background_contrast },
          ]}
        >
          <SettingItem
            icon={isDarkMode ? "moon" : "sunny"}
            title={t("settings.dark_mode") || "Chế độ tối"}
            color={isDarkMode ? "#FFD700" : "#F57C00"}
            theme={theme}
            isDarkMode={isDarkMode}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: theme.primary_color }}
                thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
              />
            }
          />

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <SettingItem
            icon="notifications-outline"
            title={t("settings.notifications")}
            onPress={() => navigation.navigate("NotificationSettingsScreen")}
            theme={theme}
            isDarkMode={isDarkMode}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingItem
            icon="language-outline"
            title={t("settings.language")}
            onPress={() => navigation.navigate("LanguageScreen")}
            color="#4CAF50"
            theme={theme}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* --- NHÓM 2: HỖ TRỢ --- */}
        <SectionTitle
          title={t("settings.group_support") || "Hỗ trợ"}
          color={theme.placeholder_text}
        />
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.background_contrast },
          ]}
        >
          <SettingItem
            icon="help-buoy-outline"
            title={t("settings.support")}
            onPress={() => navigation.navigate("SupportCenterScreen")}
            color="#2196F3"
            theme={theme}
            isDarkMode={isDarkMode}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingItem
            icon="shield-checkmark-outline"
            title={t("settings.privacy")}
            onPress={() => {}}
            color="#607D8B"
            theme={theme}
            isDarkMode={isDarkMode}
          />
        </View>

        <SectionTitle
          title={t("settings.group_account") || "Tài khoản"}
          color={theme.placeholder_text}
        />
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.background_contrast },
          ]}
        >
          <SettingItem
            icon="log-out-outline"
            title={t("settings.logout")}
            onPress={() => setShowLogoutModal(true)}
            color="#FF9800"
            theme={theme}
            isDarkMode={isDarkMode}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingItem
            icon="trash-outline"
            title={t("settings.delete_account")}
            onPress={() => setShowDeleteModal(true)}
            isDanger={true}
            showChevron={false}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        </View>

        <View style={styles.versionContainer}>
          <AppText
            style={[styles.versionText, { color: theme.placeholder_text }]}
          >
            Potpan v1.0.0
          </AppText>
        </View>

        <AppBottomSpace height={100} />
      </ScrollView>

      {/* 1. Modal Đăng Xuất */}
      <AppConfirmModal
        visible={showLogoutModal}
        title={t("settings.logout")}
        message={t("settings.logout_confirm")}
        loading={isLoading}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <AppConfirmModal
        visible={showDeleteModal}
        title={t("settings.delete_account")}
        message={t("settings.delete_confirm")}
        loading={isLoading}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      <View style={styles.navBarWrapper}>
        <AppMainNavBar
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            if (tab === "home") navigation.navigate("HomeScreen");
            if (tab === "world") navigation.navigate("CommunityScreen");
            if (tab === "category") navigation.navigate("CategoriesScreen");
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },

  navBarWrapper: {
    position: "absolute",
    bottom: 35,
    left: 0,
    right: 0,
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginLeft: 50,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 12,
  },
});
