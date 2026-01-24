// Nhóm 9 - IE307.Q12
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Switch, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppHeader from "../components/AppHeader";
import { useThemeStore } from "../store/useThemeStore";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    const savedSetting = await AsyncStorage.getItem("SHOW_POPUP_IN_APP");
    const shouldShow = savedSetting === "true" || savedSetting === null;

    return {
      shouldShowAlert: shouldShow,
      shouldPlaySound: shouldShow,
      shouldSetBadge: false,
      shouldShowBanner: shouldShow,
      shouldShowList: shouldShow,
    };
  },
});

const NotificationSettingsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const saved = await AsyncStorage.getItem("SHOW_POPUP_IN_APP");
      setIsEnabled(saved === "true" || saved === null);
    };
    loadSettings();
  }, []);

  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);

    await AsyncStorage.setItem("SHOW_POPUP_IN_APP", String(newValue));
    console.log("Cập nhật trạng thái hiển thị Popup:", newValue);
  };

  const SettingRow = ({ title, desc, value, onToggle }: any) => (
    <View style={[styles.row, { backgroundColor: theme.background_contrast }]}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <AppText
          variant="bold"
          style={{ fontSize: 16, color: theme.primary_text, marginBottom: 4 }}
        >
          {title}
        </AppText>
        <AppText style={{ fontSize: 13, color: theme.placeholder_text }}>
          {desc}
        </AppText>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: theme.primary_color }}
        thumbColor={"#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <AppSafeView style={{ flex: 1, backgroundColor: theme.background }}>
      <AppHeader
        title={t("settings.notifications")}
        showBack
        onBackPress={() => navigation.goBack()}
        showNotifications={false}
      />

      <ScrollView contentContainerStyle={{ padding: 20 }}>

        <View style={styles.infoBox}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.background_contrast },
            ]}
          >
            <Ionicons
              name="notifications"
              size={32}
              color={theme.primary_color}
            />
          </View>
          <AppText
            style={{
              textAlign: "center",
              color: theme.placeholder_text,
              lineHeight: 22,
              marginTop: 12,
            }}
          >
            {t(
              "settings.noti_desc",
              "Tùy chỉnh cách ứng dụng hiển thị thông báo khi bạn đang sử dụng."
            )}
          </AppText>
        </View>

    
        <AppText
          style={[styles.sectionTitle, { color: theme.placeholder_text }]}
        >
          {t("settings.group_general", "Cài đặt chung")}
        </AppText>

        <SettingRow
          title={t("settings.in_app_popup", "Thông báo nổi (Popup)")}
          desc={
            isEnabled
              ? t(
                  "settings.popup_on_desc",
                  "Hiển thị banner thông báo phía trên màn hình khi có tin mới."
                )
              : t(
                  "settings.popup_off_desc",
                  "Ẩn banner thông báo để tránh làm phiền khi đang dùng ứng dụng."
                )
          }
          value={isEnabled}
          onToggle={toggleSwitch}
        />
      </ScrollView>
    </AppSafeView>
  );
};

export default NotificationSettingsScreen;

const styles = StyleSheet.create({
  infoBox: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
