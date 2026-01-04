import React, { useEffect, useState } from "react";
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  Switch,
  TouchableOpacity 
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

// 👇 1. Import Store Theme
import { useThemeStore } from "../store/useThemeStore";

// --- COMPONENT CON: ITEM CÀI ĐẶT (ĐÃ NÂNG CẤP THEME) ---
const SettingItem = ({ 
  icon, 
  title, 
  onPress, 
  color = AppLightColor.primary_color, 
  showChevron = true,
  isDanger = false,
  // 👇 Nhận thêm props theme
  theme,
  isDarkMode,
  rightComponent // Để nhét cái Switch vào
}: any) => (
  <TouchableOpacity 
    style={styles.itemContainer} 
    onPress={onPress}
    activeOpacity={0.7}
    disabled={!!rightComponent} // Nếu có Switch thì không bấm vào row được
  >
    <View style={styles.itemLeft}>
      {/* Icon Box thay đổi màu nền theo theme */}
      <View style={[
        styles.iconBox, 
        { backgroundColor: isDanger ? (isDarkMode ? '#3A1D1E' : '#FFE5E5') : (isDarkMode ? `${color}20` : `${color}15`) }
      ]}>
        <Ionicons name={icon} size={22} color={isDanger ? '#FF4444' : color} />
      </View>
      
      {/* Title thay đổi màu theo theme */}
      <AppText style={[
        styles.itemTitle, 
        { color: isDanger ? '#FF4444' : theme.primary_text }
      ]}>
        {title}
      </AppText>
    </View>

    {/* Bên phải: Hoặc là Switch, hoặc là Mũi tên */}
    {rightComponent ? (
      rightComponent
    ) : showChevron && (
      <Ionicons name="chevron-forward" size={20} color={theme.icon} />
    )}
  </TouchableOpacity>
);

// --- COMPONENT CON: TIÊU ĐỀ NHÓM ---
const SectionTitle = ({ title, color }: { title: string, color: string }) => (
  <AppText style={[styles.sectionTitle, { color }]}>{title}</AppText>
);

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  // 👇 2. Lấy Theme & Hàm Toggle
  const { theme, isDarkMode, toggleTheme } = useThemeStore();
  const { logout, deleteAccount, isLoading } = useAuthStore();

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");
  const [modalType, setModalType] = useState<"logout" | "delete" | null>(null);

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  const handleConfirm = async () => {
    try {
      if (modalType === "logout") {
        await logout();
      } else if (modalType === "delete") {
        await deleteAccount();
        Alert.alert(t("common.success"), t("settings.delete_success"));
      }
      setModalType(null);
    } catch (error: any) {
      Alert.alert(t("common.error"), error.message || t("common.try_again"));
      setModalType(null);
    }
  };

  return (
    // 👇 3. Áp dụng Background Screen
    <AppSafeView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader 
        title={t("settings.title")} 
        showBack 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- NHÓM 1: ỨNG DỤNG --- */}
        <SectionTitle title={t("settings.group_general") || "Chung"} color={theme.placeholder_text} />
        
        {/* 👇 Card nền động */}
        <View style={[styles.sectionCard, { backgroundColor: theme.background_contrast }]}>
          
          {/* 👇 ITEM MỚI: DARK MODE SWITCH */}
          <SettingItem 
            icon={isDarkMode ? "moon" : "sunny"} // Đổi icon mặt trăng/mặt trời
            title={t("settings.dark_mode") || "Chế độ tối"}
            color={isDarkMode ? "#FFD700" : "#F57C00"} // Màu vàng/cam
            theme={theme}
            isDarkMode={isDarkMode}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme} // 👈 Kích hoạt toggle
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
            theme={theme} isDarkMode={isDarkMode}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingItem 
            icon="language-outline"
            title={t("settings.language")}
            onPress={() => navigation.navigate("LanguageScreen")}
            color="#4CAF50"
            theme={theme} isDarkMode={isDarkMode}
          />
        </View>

        {/* --- NHÓM 2: HỖ TRỢ & PHÁP LÝ --- */}
        <SectionTitle title={t("settings.group_support") || "Hỗ trợ"} color={theme.placeholder_text} />
        <View style={[styles.sectionCard, { backgroundColor: theme.background_contrast }]}>
          <SettingItem 
            icon="help-buoy-outline"
            title={t("settings.support")}
            onPress={() => navigation.navigate("SupportCenterScreen")}
            color="#2196F3"
            theme={theme} isDarkMode={isDarkMode}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingItem 
            icon="shield-checkmark-outline"
            title={t("settings.privacy")}
            onPress={() => { }}
            color="#607D8B"
            theme={theme} isDarkMode={isDarkMode}
          />
        </View>

        {/* --- NHÓM 3: TÀI KHOẢN --- */}
        <SectionTitle title={t("settings.group_account") || "Tài khoản"} color={theme.placeholder_text} />
        <View style={[styles.sectionCard, { backgroundColor: theme.background_contrast }]}>
          <SettingItem 
            icon="log-out-outline"
            title={t("settings.logout")}
            onPress={() => setModalType("logout")}
            color="#FF9800"
            theme={theme} isDarkMode={isDarkMode}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingItem 
            icon="trash-outline"
            title={t("settings.delete_account")}
            onPress={() => setModalType("delete")}
            isDanger={true}
            showChevron={false}
            theme={theme} isDarkMode={isDarkMode}
          />
        </View>

        {/* VERSION INFO */}
        <View style={styles.versionContainer}>
          <AppText style={[styles.versionText, { color: theme.placeholder_text }]}>Potpan v1.0.0</AppText>
        </View>

        <AppBottomSpace height={100} />
      </ScrollView>

      <AppConfirmModal
        visible={modalType !== null}
        title={modalType === "logout" ? t("settings.logout") : t("settings.delete_account")}
        message={modalType === "logout" ? t("settings.logout_confirm") : t("settings.delete_confirm")}
        loading={isLoading}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirm}
        isDanger={modalType === "delete"}
      />

      <AppMainNavBar activeTab={activeTab} onTabPress={(tab) => {
          setActiveTab(tab);
          if (tab === "home") navigation.navigate("HomeScreen");
          if (tab === "world") navigation.navigate("CommunityScreen");
          if (tab === "category") navigation.navigate("CategoriesScreen");
      }} />
    </AppSafeView>
  );
};

export default SettingsScreen;

// Style Tĩnh (Layout không đổi, màu sắc sẽ bị đè bởi style động inline)
const styles = StyleSheet.create({
  safeArea: { flex: 1 }, 
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
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
    marginBottom: 8
  },
  
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  divider: {
    height: 1,
    marginLeft: 50, 
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10
  },
  versionText: {
    fontSize: 12
  }
});