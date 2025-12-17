// src/screens/LanguageScreen.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import { AppLightColor } from "../styles/color";

import BackArrowIcon from "../assets/images/backarrow.svg";

const ROBOTO_SLAB_BOLD = "RobotoSlab-Bold";

type LangItem = { id: string; label: string };

const LanguageScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");
  const [selectedLangId, setSelectedLangId] = useState<string>("en");

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  const languages: LangItem[] = useMemo(
    () => [
      { id: "en", label: "English" },
      { id: "fr", label: "French" },
      { id: "de", label: "Germany" },
      { id: "it", label: "Italian" },
      { id: "ko", label: "Korean" },
      { id: "hi", label: "Hindi" },
      { id: "ar", label: "Arabic" },
      { id: "ru", label: "Russia" },
      { id: "es", label: "Spanish" },
      { id: "gu", label: "Gujarati" },
      { id: "bn", label: "Bengali" },
      { id: "he", label: "Hebrew" },
      { id: "ur", label: "Urdu" },
      { id: "uk", label: "Ukrainian" },
      { id: "nl", label: "Dutch" },
    ],
    []
  );

  const renderRow = (item: LangItem) => {
    const isOn = item.id === selectedLangId;

    return (
      <Pressable
        key={item.id}
        style={styles.row}
        onPress={() => setSelectedLangId(item.id)}
      >
        <Image
          source={
            isOn
              ? require("../assets/images/Check-on.png")
              : require("../assets/images/Check-off.png")
          }
          style={styles.checkIcon}
        />

        <AppText variant="medium" style={styles.rowText}>
          {item.label}
        </AppText>
      </Pressable>
    );
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER cố định */}
        <View style={styles.header}>
          <Pressable style={styles.backCircle} onPress={() => navigation.goBack()}>
            <BackArrowIcon width={18} height={18} />
          </Pressable>

          <View style={styles.headerTitleWrap} pointerEvents="none">
            <AppText variant="bold" style={styles.headerTitle}>
              Ngôn Ngữ
            </AppText>
          </View>

          <View style={styles.headerRightStub} />
        </View>

        {/* BODY cuộn dọc, header không cuộn */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {languages.map(renderRow)}
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

export default LanguageScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 54,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: ROBOTO_SLAB_BOLD,
  },
  headerRightStub: { width: 32, height: 32 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingTop: 6 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  checkIcon: { width: 18, height: 18, resizeMode: "contain", marginRight: 12 },
  rowText: { fontSize: 14, color: "#111" },
});