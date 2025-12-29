import React, { useEffect, useMemo, useState } from "react";
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Pressable, 
  Alert, 
  Switch,
  TouchableOpacity 
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next"; 
import { Ionicons } from "@expo/vector-icons"; // 👈 Import Expo Icons

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader";
import AppConfirmModal from "../components/AppConfirmModal"; 

import { useAuthStore } from "../store/useAuthStore";
import { AppLightColor } from "../styles/color";

// --- COMPONENT CON: ITEM CÀI ĐẶT ---
const SettingItem = ({ 
  icon, 
  title, 
  onPress, 
  color = AppLightColor.primary_color, 
  showChevron = true,
  isDanger = false
}: any) => (
  <TouchableOpacity 
    style={styles.itemContainer} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.itemLeft}>
      {/* Icon nền tròn */}
      <View style={[styles.iconBox, { backgroundColor: isDanger ? '#FFE5E5' : `${color}15` }]}>
        <Ionicons name={icon} size={22} color={isDanger ? '#FF4444' : color} />
      </View>
      <AppText style={[styles.itemTitle, isDanger && { color: '#FF4444' }]}>
        {title}
      </AppText>
    </View>
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    )}
  </TouchableOpacity>
);

// --- COMPONENT CON: TIÊU ĐỀ NHÓM ---
const SectionTitle = ({ title }: { title: string }) => (
  <AppText style={styles.sectionTitle}>{title}</AppText>
);

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

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
    <AppSafeView style={styles.safeArea}>
      <AppHeader 
        title={t("settings.title")} 
        showBack 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- NHÓM 1: ỨNG DỤNG --- */}
        <SectionTitle title={t("settings.group_general") || "Chung"} />
        <View style={styles.sectionCard}>
          <SettingItem 
            icon="notifications-outline"
            title={t("settings.notifications")}
            onPress={() => navigation.navigate("NotificationSettingsScreen")}
          />
          <View style={styles.divider} />
          <SettingItem 
            icon="language-outline"
            title={t("settings.language")}
            onPress={() => navigation.navigate("LanguageScreen")}
            color="#4CAF50" // Màu riêng cho Language nếu thích
          />
        </View>

        {/* --- NHÓM 2: HỖ TRỢ & PHÁP LÝ --- */}
        <SectionTitle title={t("settings.group_support") || "Hỗ trợ"} />
        <View style={styles.sectionCard}>
          <SettingItem 
            icon="help-buoy-outline"
            title={t("settings.support")}
            onPress={() => navigation.navigate("SupportCenterScreen")}
            color="#2196F3"
          />
          <View style={styles.divider} />
          <SettingItem 
            icon="shield-checkmark-outline"
            title={t("settings.privacy")}
            onPress={() => { /* Navigate to Privacy */ }}
            color="#607D8B"
          />
        </View>

        {/* --- NHÓM 3: TÀI KHOẢN --- */}
        <SectionTitle title={t("settings.group_account") || "Tài khoản"} />
        <View style={styles.sectionCard}>
          <SettingItem 
            icon="log-out-outline"
            title={t("settings.logout")}
            onPress={() => setModalType("logout")}
            color="#FF9800"
          />
          <View style={styles.divider} />
          {/* Nút Xóa Tài Khoản - Danger Style */}
          <SettingItem 
            icon="trash-outline"
            title={t("settings.delete_account")}
            onPress={() => setModalType("delete")}
            isDanger={true}
            showChevron={false}
          />
        </View>

        {/* VERSION INFO */}
        <View style={styles.versionContainer}>
          <AppText style={styles.versionText}>Potpan v1.0.0</AppText>
        </View>

        <AppBottomSpace height={100} />
      </ScrollView>

      {/* Modal Xác nhận */}
      <AppConfirmModal
        visible={modalType !== null}
        title={modalType === "logout" ? t("settings.logout") : t("settings.delete_account")}
        message={modalType === "logout" ? t("settings.logout_confirm") : t("settings.delete_confirm")}
        loading={isLoading}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirm}
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffffff" }, // Nền hơi xám nhẹ để nổi bật Card
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  
  // Section Styles
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
    // Shadow nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8
  },
  
  // Item Styles
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
    color: '#333',
    fontWeight: '500'
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 50, // Thụt vào để không cắt icon
  },

  // Footer Info
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10
  },
  versionText: {
    color: '#CCC',
    fontSize: 12
  }
});