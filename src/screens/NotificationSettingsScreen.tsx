import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next"; // 👈 Import i18n

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader"; // 👈 Header chung
import { AppLightColor } from "../styles/color";

// Giữ lại icon Toggle
import ToggleOnIcon from "../assets/images/button-active.svg";
import ToggleOffIcon from "../assets/images/button-off.svg";

const ROBOTO_SLAB_BOLD = "RobotoSlab-Bold";
const LABEL_FONT_SIZE = 20;

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { t } = useTranslation(); // 👈 Init hook

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");

  // State giả lập (Trong thực tế nên lưu vào Async Storage hoặc Database)
  const [general, setGeneral] = useState(true);
  const [sound, setSound] = useState(true);
  const [sfx, setSfx] = useState(true);
  const [vibrate, setVibrate] = useState(true);

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  const Row = ({
    label,
    value,
    onToggle,
  }: {
    label: string;
    value: boolean;
    onToggle: () => void;
  }) => {
    const Icon = value ? ToggleOnIcon : ToggleOffIcon;
    return (
      <View style={styles.row}>
        <AppText variant="bold" style={styles.rowLabel}>
          {label}
        </AppText>

        <Pressable onPress={onToggle} hitSlop={10} style={styles.toggleBtn}>
          <Icon width={40} height={22} />
        </Pressable>
      </View>
    );
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER CHUNG */}
        <AppHeader
          title={t("settings.notifications")} // "Thông báo"
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showSearch={false}
          showNotifications={false}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.rowsWrap}>
            <Row
              label={t("notification_settings.general")}
              value={general}
              onToggle={() => setGeneral((v) => !v)}
            />
            <Row
              label={t("notification_settings.sound")}
              value={sound}
              onToggle={() => setSound((v) => !v)}
            />
            <Row
              label={t("notification_settings.sfx")}
              value={sfx}
              onToggle={() => setSfx((v) => !v)}
            />
            <Row
              label={t("notification_settings.vibrate")}
              value={vibrate}
              onToggle={() => setVibrate((v) => !v)}
            />
          </View>

          <AppBottomSpace height={90} />
        </ScrollView>

        {/* BOTTOM NAV */}
        <AppMainNavBar
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            if (tab === "home") navigation.navigate("HomeScreen");
            if (tab === "world") navigation.navigate("CommunityScreen");
            if (tab === "profile") navigation.navigate("ProfileScreen");
            if (tab === "category") navigation.navigate("CategoriesScreen");
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default NotificationSettingsScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },

  // Đã xóa các style header cũ (header, headerTitle...) vì dùng AppHeader

  rowsWrap: { marginTop: 6, rowGap: 22 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: LABEL_FONT_SIZE,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: ROBOTO_SLAB_BOLD,
  },
  toggleBtn: {
    width: 46,
    height: 28,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});