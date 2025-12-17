// src/screens/SupportCenterScreen.tsx  (full file, giữ hiệu ứng active cho 2 nút trên; đổi màu chữ để trên/dưới đồng bộ)

import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import { AppLightColor } from "../styles/color";

import BackArrowIcon from "../assets/images/backarrow.svg";
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

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");

  // 2 nút trên có active effect
  const [topTab, setTopTab] = useState<TopTab>("faq");

  // 3 nút dưới không cần active style (chỉ đổi nội dung)
  const [section, setSection] = useState<SupportSection>("general");

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  const faqGeneral: RowItem[] = useMemo(
    () => [
      { id: "q1", title: "Tôi có thể làm gì trong mục Trợ giúp?" },
      { id: "q2", title: "Làm sao để cập nhật thông tin tài khoản?" },
      { id: "q3", title: "Tôi không nhận được mã OTP thì phải làm sao?" },
      { id: "q4", title: "Tôi có thể xóa tài khoản không?" },
      { id: "q5", title: "Làm sao để liên hệ đội ngũ hỗ trợ?" },
      { id: "q6", title: "Tôi muốn thay đổi số điện thoại đăng ký?" },
      { id: "q7", title: "Làm sao để kích hoạt bảo mật hai lớp (2FA)?" },
      { id: "q8", title: "Ứng dụng có hỗ trợ khách hàng 24/7 không?" },
      { id: "q9", title: "Làm sao để đặt lại mật khẩu?" },
    ],
    []
  );

  const faqAccount: RowItem[] = useMemo(
    () => [
      { id: "a1", title: "Quên mật khẩu thì làm thế nào?" },
      { id: "a2", title: "Đổi email/điện thoại đăng ký ở đâu?" },
      { id: "a3", title: "Tại sao tài khoản bị khóa tạm thời?" },
      { id: "a4", title: "Thiết lập bảo mật (2FA) như thế nào?" },
      { id: "a5", title: "Cập nhật ảnh đại diện không được?" },
    ],
    []
  );

  const faqService: RowItem[] = useMemo(
    () => [
      { id: "s1", title: "Tính năng lưu công thức hoạt động ra sao?" },
      { id: "s2", title: "Tạo bộ sưu tập và quản lý như thế nào?" },
      { id: "s3", title: "Chia sẻ hồ sơ/công thức cho bạn bè?" },
      { id: "s4", title: "Báo cáo nội dung vi phạm ở đâu?" },
      { id: "s5", title: "Góp ý cải thiện ứng dụng như thế nào?" },
    ],
    []
  );

  const faqList = useMemo(() => {
    if (section === "general") return faqGeneral;
    if (section === "account") return faqAccount;
    return faqService;
  }, [section, faqAccount, faqGeneral, faqService]);

  const contactList = useMemo(
    () => [
      { id: "c1", title: "Website", kind: "svg1" as const },
      { id: "c2", title: "Facebook", kind: "svg2" as const },
      { id: "c3", title: "Whatsapp", kind: "png3" as const },
      { id: "c4", title: "Instagram", kind: "png4" as const },
    ],
    []
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

  const SubPill = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <Pressable style={styles.subPill} onPress={onPress}>
      <AppText variant="bold" style={styles.subPillText}>
        {label}
      </AppText>
    </Pressable>
  );

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
                Trung Tâm Hỗ Trợ
              </AppText>
            </View>

            <View style={styles.headerRightStub} />
          </View>

          <View style={styles.topBlock}>
            <View style={styles.topRow}>
              <TopPill label="FAQ" active={topTab === "faq"} onPress={() => setTopTab("faq")} />
              <TopPill
                label="Liên hệ"
                active={topTab === "contact"}
                onPress={() => setTopTab("contact")}
              />
            </View>

            <View style={styles.subRow}>
              <SubPill label="Tổng Quát" onPress={() => setSection("general")} />
              <SubPill label="Tài Khoản" onPress={() => setSection("account")} />
              <SubPill label="Dịch Vụ" onPress={() => setSection("service")} />
            </View>

            <View style={styles.searchPill}>
              <AppText variant="light" style={styles.searchPlaceholder}>
                Tìm kiếm
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

export default SupportCenterScreen;

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
    marginBottom: 10,
  },
  headerTitleWrap: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  headerTitle: {
    fontSize: 22,
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

  topBlock: { marginTop: 4, alignItems: "center" },

  topRow: { width: "100%", flexDirection: "row", columnGap: 12, marginTop: 6 },

  // TOP: giữ active effect, nhưng màu chữ (inactive) đồng bộ với hàng dưới
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
    color: AppLightColor.primary_color, // đổi từ đen -> đỏ để giống hàng dưới
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
  subPillText: {
    fontSize: 12,
    fontWeight: "900",
    color: AppLightColor.primary_color, // đổi từ đen -> đỏ để đồng bộ với hàng trên
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