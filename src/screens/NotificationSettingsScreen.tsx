import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import { AppLightColor } from "../styles/color";

import BackArrowIcon from "../assets/images/backarrow.svg";
import ToggleOnIcon from "../assets/images/button-active.svg";
import ToggleOffIcon from "../assets/images/button-off.svg";

const ROBOTO_SLAB_BOLD = "RobotoSlab-Bold";
const LABEL_FONT_SIZE = 20;

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");

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
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable style={styles.headerIconCircle} onPress={() => navigation.goBack()}>
              <BackArrowIcon width={18} height={18} />
            </Pressable>

            <View style={styles.headerTitleWrap} pointerEvents="none">
              <AppText variant="bold" style={styles.headerTitle}>
                Thông báo
              </AppText>
            </View>

            <View style={styles.headerRightStub} />
          </View>

          <View style={styles.rowsWrap}>
            <Row
              label="Thông báo chung"
              value={general}
              onToggle={() => setGeneral((v) => !v)}
            />
            <Row label="Âm thanh" value={sound} onToggle={() => setSound((v) => !v)} />
            <Row label="SFX" value={sfx} onToggle={() => setSfx((v) => !v)} />
            <Row label="Rung" value={vibrate} onToggle={() => setVibrate((v) => !v)} />
          </View>

          <AppBottomSpace height={90} />
        </ScrollView>

        <AppMainNavBar
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

export default NotificationSettingsScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10 },

  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitleWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: ROBOTO_SLAB_BOLD,
  },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRightStub: { width: 32, height: 32 },

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