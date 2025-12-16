// src/screens/SettingsScreen.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import BottomNavSpacer from "../components/BottomNavSpacer";
import MainBottomNav, { type MainTabKey } from "../components/MainBottomNav";
import { AppLightColor } from "../styles/color";

import BackArrowIcon from "../assets/images/backarrow.svg";

import Setting1Icon from "../assets/images/setting-1.svg";
import Setting2Icon from "../assets/images/setting-2.svg";
import Setting3Icon from "../assets/images/setting-3.svg";
import Setting4Icon from "../assets/images/setting-4.svg";
import Setting5Icon from "../assets/images/setting-5.svg";
import Setting6Icon from "../assets/images/setting-6.svg";
import NextIcon from "../assets/images/setting-next.svg";

const ROBOTO_SLAB_BOLD = "RobotoSlab-Bold";
const SETTINGS_ITEM_FONT_SIZE = 20; // chữ nội dung
const DELETE_BTN_FONT_SIZE = 20; // đồng bộ với chữ nội dung

type SettingRow = {
  key: string;
  title: string;
  Icon: React.ComponentType<any>;
  showNext: boolean;
  onPress?: () => void;
};

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  const rows = useMemo<SettingRow[]>(
    () => [
      {
        key: "noti",
        title: "Thông báo",
        Icon: Setting1Icon,
        showNext: true,
        onPress: () => navigation.navigate("Notification"),
      },
      { key: "support", title: "Trung tâm hỗ trợ", Icon: Setting2Icon, showNext: true },
      { key: "privacy", title: "Chính sách bảo mật", Icon: Setting3Icon, showNext: true },
      { key: "language", title: "Ngôn ngữ", Icon: Setting4Icon, showNext: true },
      { key: "dark", title: "Chuyển màu tối", Icon: Setting5Icon, showNext: false },
      { key: "logout", title: "Đăng xuất", Icon: Setting6Icon, showNext: false },
    ],
    [navigation]
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
              <BackArrowIcon width={22} height={22} />
            </Pressable>

            <AppText variant="bold" style={styles.headerTitle}>
              Cài đặt
            </AppText>

            <View style={styles.headerRightStub} />
          </View>

          <View style={styles.list}>
            {rows.map((r) => {
              const RowIcon = r.Icon;

              return (
                <Pressable key={r.key} style={styles.itemRow} onPress={r.onPress}>
                  <View style={styles.leftGroup}>
                    <View style={styles.iconCircle}>
                      <RowIcon width={18} height={18} />
                    </View>

                    <AppText variant="bold" style={styles.itemText}>
                      {r.title}
                    </AppText>
                  </View>

                  {r.showNext ? (
                    <View style={styles.nextWrap}>
                      <NextIcon width={16} height={16} />
                    </View>
                  ) : (
                    <View style={styles.nextWrap} />
                  )}
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.deleteBtn}>
            <AppText variant="bold" style={styles.deleteBtnText}>
              Xóa tài khoản
            </AppText>
          </Pressable>

          <BottomNavSpacer height={90} />
        </ScrollView>

        <MainBottomNav
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            if (tab === "home") navigation.navigate("Home");
            if (tab === "world") navigation.navigate("FamousChefs");
            if (tab === "profile") navigation.navigate("Profile");
            if (tab === "category") navigation.navigate("Page2");
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: ROBOTO_SLAB_BOLD,
  },
  headerRightStub: { width: 40, height: 40 },

  list: { marginTop: 6, rowGap: 18 },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftGroup: { flexDirection: "row", alignItems: "center", columnGap: 14 },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppLightColor.primary_color,
  },

  itemText: {
    fontSize: SETTINGS_ITEM_FONT_SIZE,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: ROBOTO_SLAB_BOLD,
  },

  nextWrap: { width: 24, alignItems: "flex-end" },

  // Button giống hình 2: nhỏ hơn, pill gọn, chữ to & đậm như nội dung
  deleteBtn: {
    marginTop: 26,
    alignSelf: "center",
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnText: {
    fontSize: DELETE_BTN_FONT_SIZE,
    lineHeight: 24,
    fontWeight: "900",
    color: "#fff",
    fontFamily: ROBOTO_SLAB_BOLD,
  },
});
