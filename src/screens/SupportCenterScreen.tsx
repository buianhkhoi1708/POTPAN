import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next"; // 👈 Import i18n

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader"; // 👈 Header chung
import { AppLightColor } from "../styles/color";

import SettingNextIcon from "../assets/images/setting-next.svg";
import Helpcenter1Icon from "../assets/images/helpcenter1.svg";
import Helpcenter2Icon from "../assets/images/helpcenter2.svg";

const ROBOTO_SLAB_BOLD = "RobotoSlab-Bold";

type TopTab = "faq" | "contact";
type SupportSection = "general" | "account" | "service";
type RowItem = { id: string; title: string };

const SupportCenterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { t } = useTranslation(); // 👈 Init Hook

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");
  const [topTab, setTopTab] = useState<TopTab>("faq");
  const [section, setSection] = useState<SupportSection>("general");

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  // Dùng useMemo với [t] để cập nhật khi đổi ngôn ngữ
  const faqGeneral: RowItem[] = useMemo(
    () => [
      { id: "q1", title: t("support.faq_general.q1") },
      { id: "q2", title: t("support.faq_general.q2") },
      { id: "q3", title: t("support.faq_general.q3") },
    ],
    [t]
  );

  const faqAccount: RowItem[] = useMemo(
    () => [
      { id: "a1", title: t("support.faq_account.q1") },
      { id: "a2", title: t("support.faq_account.q2") },
    ],
    [t]
  );

  const faqService: RowItem[] = useMemo(
    () => [
      { id: "s1", title: t("support.faq_service.q1") },
      { id: "s2", title: t("support.faq_service.q2") },
    ],
    [t]
  );

  const faqList = useMemo(() => {
    if (section === "general") return faqGeneral;
    if (section === "account") return faqAccount;
    return faqService;
  }, [section, faqAccount, faqGeneral, faqService]);

  const contactList = useMemo(
    () => [
      { id: "c1", title: t("support.contact.web"), kind: "svg1" as const },
      { id: "c2", title: t("support.contact.fb"), kind: "svg2" as const },
      { id: "c3", title: t("support.contact.wa"), kind: "png3" as const },
      { id: "c4", title: t("support.contact.ig"), kind: "png4" as const },
    ],
    [t]
  );

  const renderContactIcon = (kind: "svg1" | "svg2" | "png3" | "png4") => {
    if (kind === "svg1") return <Helpcenter1Icon width={18} height={18} />;
    if (kind === "svg2") return <Helpcenter2Icon width={18} height={18} />;
    if (kind === "png3")
      return (
        <Image
          source={require("../assets/images/helpcenter3.png")}
          style={styles.contactPngIcon}
        />
      );
    return (
      <Image
        source={require("../assets/images/helpcenter4.png")}
        style={styles.contactPngIcon}
      />
    );
  };

  const TopPill = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <Pressable style={active ? styles.topPillActive : styles.topPill} onPress={onPress}>
      <AppText
        variant="bold"
        style={active ? styles.topPillTextActive : styles.topPillText}
      >
        {label}
      </AppText>
    </Pressable>
  );

  const SubPill = ({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) => (
    <Pressable style={active ? styles.subPillActive : styles.subPill} onPress={onPress}>
      <AppText variant="bold" style={active ? styles.subPillTextActive : styles.subPillText}>
        {label}
      </AppText>
    </Pressable>
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER CHUNG */}
        <AppHeader
          title={t("support.title")}
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showSearch={false}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBlock}>
            <View style={styles.topRow}>
              <TopPill label={t("support.tabs.faq")} active={topTab === "faq"} onPress={() => setTopTab("faq")} />
              <TopPill
                label={t("support.tabs.contact")}
                active={topTab === "contact"}
                onPress={() => setTopTab("contact")}
              />
            </View>

            {topTab === "faq" && (
              <View style={styles.subRow}>
                <SubPill label={t("support.tabs.general")} active={section === "general"} onPress={() => setSection("general")} />
                <SubPill label={t("support.tabs.account")} active={section === "account"} onPress={() => setSection("account")} />
                <SubPill label={t("support.tabs.service")} active={section === "service"} onPress={() => setSection("service")} />
              </View>
            )}

            <View style={styles.searchPill}>
              <AppText variant="light" style={styles.searchPlaceholder}>
                {t("support.search_placeholder")}
              </AppText>
            </View>
          </View>

          {topTab === "faq" ? (
            <View style={styles.listWrap}>
              {faqList.map((it) => (
                <Pressable key={it.id} style={styles.faqRow} onPress={() => {}}>
                  <View style={styles.faqLeft}>
                    <AppText variant="medium" style={styles.faqText}>
                      {it.title}
                    </AppText>
                  </View>

                  <View style={styles.faqRight}>
                    <SettingNextIcon width={16} height={16} />
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.contactWrap}>
              {contactList.map((c) => (
                <Pressable key={c.id} style={styles.contactRow} onPress={() => {}}>
                  <View style={styles.contactLeft}>
                    <View style={styles.contactIconCircle}>{renderContactIcon(c.kind)}</View>
                    <AppText variant="bold" style={styles.contactText}>
                      {c.title}
                    </AppText>
                  </View>

                  <View style={styles.contactRight}>
                    <SettingNextIcon width={16} height={16} />
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          <AppBottomSpace height={90} />
        </ScrollView>

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

export default SupportCenterScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10 },

  // Đã xóa header cũ

  topBlock: { marginTop: 4, alignItems: "center" },

  topRow: { width: "100%", flexDirection: "row", columnGap: 12, marginTop: 6 },

  topPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#ffe3e2",
    alignItems: "center",
    justifyContent: "center",
  },
  topPillActive: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  topPillText: {
    fontSize: 13,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: ROBOTO_SLAB_BOLD,
  },
  topPillTextActive: {
    fontSize: 13,
    fontWeight: "900",
    color: "#fff",
    fontFamily: ROBOTO_SLAB_BOLD,
  },

  subRow: { width: "100%", flexDirection: "row", columnGap: 10, marginTop: 10 },
  subPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#ffe3e2",
    alignItems: "center",
    justifyContent: "center",
  },
  subPillActive: { // Thêm style active cho sub pill nếu cần
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  subPillText: {
    fontSize: 12,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: ROBOTO_SLAB_BOLD,
  },
  subPillTextActive: {
    fontSize: 12,
    fontWeight: "900",
    color: "#fff",
    fontFamily: ROBOTO_SLAB_BOLD,
  },

  searchPill: {
    marginTop: 12,
    width: "100%",
    backgroundColor: "#ffe3e2",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  searchPlaceholder: { fontSize: 13, color: "#111", opacity: 0.7 },

  listWrap: { marginTop: 14 },
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
  },
  faqLeft: { flex: 1, paddingRight: 10 },
  faqText: { fontSize: 13, color: "#000000ff" },
  faqRight: { width: 26, alignItems: "flex-end" },

  contactWrap: { marginTop: 16, rowGap: 12 },
  contactRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  contactLeft: { flexDirection: "row", alignItems: "center", columnGap: 12 },
  contactIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  contactPngIcon: { width: 18, height: 18, resizeMode: "contain" },
  contactText: { fontSize: 14, fontWeight: "900", color: "#000000ff", fontFamily: ROBOTO_SLAB_BOLD },
  contactRight: { width: 26, alignItems: "flex-end" },
});