import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader";
import AppConfirmModal from "../components/AppConfirmModal"; // Component modal đã tách
import AppSettingItem from "../components/AppSettingItem";

import { useAuthStore } from "../store/useAuthStore";
import { AppLightColor } from "../styles/color";

// Icons
import Setting1Icon from "../assets/images/setting-1.svg";
import Setting2Icon from "../assets/images/setting-2.svg";
import Setting3Icon from "../assets/images/setting-3.svg";
import Setting4Icon from "../assets/images/setting-4.svg";
import Setting5Icon from "../assets/images/setting-5.svg";
import Setting6Icon from "../assets/images/setting-6.svg";

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

  const settingsRows = useMemo(() => [
    {
      key: "noti",
      title: t("settings.notifications"),
      Icon: Setting1Icon,
      showNext: true,
      onPress: () => navigation.navigate("NotificationSettingsScreen"),
    },
    {
      key: "support",
      title: t("settings.support"),
      Icon: Setting2Icon,
      showNext: true,
      onPress: () => navigation.navigate("SupportCenterScreen"),
    },
    { 
      key: "privacy", 
      title: t("settings.privacy"), 
      Icon: Setting3Icon, 
      showNext: true 
    },
    {
      key: "language",
      title: t("settings.language"),
      Icon: Setting4Icon,
      showNext: true,
      onPress: () => navigation.navigate("LanguageScreen"),
    },
    {
      key: "logout",
      title: t("settings.logout"),
      Icon: Setting6Icon,
      showNext: false,
      onPress: () => setModalType("logout"),
    },
  ], [t, navigation]);

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
    }
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <AppHeader 
        title={t("settings.title")} 
        showBack 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.list}>
          {settingsRows.map((row) => (
            <AppSettingItem
              key={row.key}
              title={row.title}
              Icon={row.Icon}
              showNext={row.showNext}
              onPress={row.onPress}
            />
          ))}
        </View>

        <Pressable 
          style={[styles.deleteBtn, isLoading && { opacity: 0.7 }]} 
          onPress={() => setModalType("delete")}
          disabled={isLoading}
        >
          <AppText variant="bold" style={styles.deleteBtnText}>
            {t("settings.delete_account")}
          </AppText>
        </Pressable>

        <AppBottomSpace height={100} />
      </ScrollView>

      <AppConfirmModal
        visible={modalType !== null}
        title={modalType === "logout" ? t("settings.logout") : t("settings.delete_account")}
        message={modalType === "logout" ? t("settings.logout_confirm") : t("settings.delete_confirm")}
        loading={isLoading}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirm}
      />

      <AppMainNavBar activeTab={activeTab} onTabPress={setActiveTab} />
    </AppSafeView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  list: { rowGap: 22, marginTop: 10 },
  deleteBtn: {
    marginTop: 40,
    alignSelf: "center",
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 999,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  deleteBtnText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "RobotoSlab-Bold",
  },
});