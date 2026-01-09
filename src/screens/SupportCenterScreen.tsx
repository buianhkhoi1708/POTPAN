// Nhóm 9 - IE307.Q12
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader";
import { useThemeStore } from "../store/useThemeStore";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type TopTab = "faq" | "contact";
type SupportSection = "general" | "account" | "service";
type RowItem = { id: string; title: string; answer?: string };

const SupportCenterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");
  const [topTab, setTopTab] = useState<TopTab>("faq");
  const [section, setSection] = useState<SupportSection>("general");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  const faqGeneral: RowItem[] = useMemo(
    () => [
      {
        id: "q1",
        title: t("support.faq_general.q1", "Làm sao để tạo công thức?"),
        answer: t(
          "support.ans_gen.q1",
          "Để tạo công thức, bạn vui lòng làm theo các bước:\n1. Vào tab 'Hồ sơ' (Profile).\n2. Bấm vào nút dấu cộng (+) ở góc trên bên phải.\n3. Điền đầy đủ thông tin và bấm 'Lưu'."
        ),
      },
      {
        id: "q2",
        title: t("support.faq_general.q2", "Làm sao để lưu công thức?"),
        answer: t(
          "support.ans_gen.q2",
          "Tại màn hình chi tiết công thức, bạn bấm vào biểu tượng 'Bookmark' ở góc trên bên phải để lưu vào bộ sưu tập."
        ),
      },
      {
        id: "q3",
        title: t("support.faq_general.q3", "Ứng dụng có miễn phí không?"),
        answer: t(
          "support.ans_gen.q3",
          "Có, Potpan hoàn toàn miễn phí cho người dùng cơ bản."
        ),
      },
    ],
    [t]
  );

  const faqAccount: RowItem[] = useMemo(
    () => [
      {
        id: "a1",
        title: t("support.faq_account.q1", "Làm sao đổi mật khẩu?"),
        answer: t(
          "support.ans_acc.q1",
          "Bạn vào Cài đặt (Settings) -> Chọn 'Đổi mật khẩu' -> Nhập mật khẩu cũ và mới."
        ),
      },
      {
        id: "a2",
        title: t("support.faq_account.q2", "Xóa tài khoản thế nào?"),
        answer: t(
          "support.ans_acc.q2",
          "Trong màn hình Cài đặt, cuộn xuống dưới cùng và chọn 'Xóa tài khoản'. Lưu ý hành động này không thể khôi phục."
        ),
      },
    ],
    [t]
  );

  const faqService: RowItem[] = useMemo(
    () => [
      {
        id: "s1",
        title: t("support.faq_service.q1", "Có hỗ trợ giao hàng không?"),
        answer: t(
          "support.ans_ser.q1",
          "Hiện tại Potpan chỉ là nền tảng chia sẻ công thức, chưa hỗ trợ đặt món hay giao hàng."
        ),
      },
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
      {
        id: "c1",
        title: t("support.contact.web", "Website"),
        icon: "globe-outline",
      },
      {
        id: "c2",
        title: t("support.contact.fb", "Facebook"),
        icon: "logo-facebook",
      },
      {
        id: "c3",
        title: t("support.contact.wa", "WhatsApp"),
        icon: "logo-whatsapp",
      },
      {
        id: "c4",
        title: t("support.contact.ig", "Instagram"),
        icon: "logo-instagram",
      },
    ],
    [t]
  );

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const TopPill = ({ label, active, onPress }: any) => (
    <Pressable
      style={[
        styles.topPill,
        {
          backgroundColor: active
            ? theme.primary_color
            : theme.background_contrast,
        },
      ]}
      onPress={onPress}
    >
      <AppText
        variant="bold"
        style={{ color: active ? "#fff" : theme.primary_text, fontSize: 13 }}
      >
        {label}
      </AppText>
    </Pressable>
  );

  const SubPill = ({ label, active, onPress }: any) => (
    <Pressable
      style={[
        styles.subPill,
        {
          backgroundColor: active
            ? theme.primary_color
            : theme.background_contrast,
          borderWidth: 1,
          borderColor: active ? theme.primary_color : theme.border,
        },
      ]}
      onPress={onPress}
    >
      <AppText
        variant="bold"
        style={{ color: active ? "#fff" : theme.primary_text, fontSize: 12 }}
      >
        {label}
      </AppText>
    </Pressable>
  );

  return (
    <AppSafeView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={styles.container}>
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
          <View style={styles.topRow}>
            <TopPill
              label={t("support.tabs.faq")}
              active={topTab === "faq"}
              onPress={() => setTopTab("faq")}
            />
            <TopPill
              label={t("support.tabs.contact")}
              active={topTab === "contact"}
              onPress={() => setTopTab("contact")}
            />
          </View>

          {topTab === "faq" && (
            <View style={styles.subRow}>
              <SubPill
                label={t("support.tabs.general")}
                active={section === "general"}
                onPress={() => setSection("general")}
              />
              <SubPill
                label={t("support.tabs.account")}
                active={section === "account"}
                onPress={() => setSection("account")}
              />
              <SubPill
                label={t("support.tabs.service")}
                active={section === "service"}
                onPress={() => setSection("service")}
              />
            </View>
          )}

          <View
            style={[
              styles.searchPill,
              { backgroundColor: theme.background_contrast },
            ]}
          >
            <Ionicons
              name="search"
              size={18}
              color={theme.placeholder_text}
              style={{ marginRight: 8 }}
            />
            <AppText variant="light" style={{ color: theme.placeholder_text }}>
              {t("support.search_placeholder")}
            </AppText>
          </View>

          {topTab === "faq" ? (
            <View style={styles.listWrap}>
              {faqList.map((it) => {
                const isExpanded = expandedId === it.id;
                return (
                  <View
                    key={it.id}
                    style={[
                      styles.faqContainer,
                      { borderBottomColor: theme.border },
                    ]}
                  >
                    <Pressable
                      style={styles.faqHeader}
                      onPress={() => toggleExpand(it.id)}
                    >
                      <View style={styles.faqLeft}>
                        <AppText
                          variant="medium"
                          style={{
                            color: isExpanded
                              ? theme.primary_color
                              : theme.primary_text,
                            fontSize: 14,
                          }}
                        >
                          {it.title}
                        </AppText>
                      </View>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={theme.placeholder_text}
                      />
                    </Pressable>

                    {isExpanded && (
                      <View
                        style={[
                          styles.faqBody,
                          { backgroundColor: theme.background_contrast },
                        ]}
                      >
                        <AppText
                          style={{
                            color: theme.primary_text,
                            lineHeight: 22,
                            fontSize: 14,
                          }}
                        >
                          {it.answer}
                        </AppText>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.contactWrap}>
              {contactList.map((c) => (
                <Pressable
                  key={c.id}
                  style={[
                    styles.contactRow,
                    { backgroundColor: theme.background_contrast },
                  ]}
                  onPress={() => {}}
                >
                  <View style={styles.contactLeft}>
                    <View
                      style={[
                        styles.contactIconCircle,
                        { backgroundColor: theme.primary_color },
                      ]}
                    >
                      <Ionicons name={c.icon as any} size={18} color="#fff" />
                    </View>
                    <AppText
                      variant="bold"
                      style={{ color: theme.primary_text, fontSize: 14 }}
                    >
                      {c.title}
                    </AppText>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.placeholder_text}
                  />
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
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default SupportCenterScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },

  topRow: {
    flexDirection: "row",
    columnGap: 12,
    marginBottom: 12,
  },
  topPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  subRow: {
    flexDirection: "row",
    columnGap: 10,
    marginBottom: 16,
  },
  subPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  searchPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  listWrap: {
    marginTop: 8,
  },

  faqContainer: {
    borderBottomWidth: 1,
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  faqBody: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  faqLeft: {
    flex: 1,
    paddingRight: 10,
  },

  contactWrap: {
    marginTop: 8,
    rowGap: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  contactIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
