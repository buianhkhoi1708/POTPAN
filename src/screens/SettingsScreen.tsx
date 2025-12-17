import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
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
const SETTINGS_ITEM_FONT_SIZE = 20;
const DELETE_BTN_FONT_SIZE = 20;

// modal lớn hơn
const MODAL_TITLE_SIZE = 22;
const MODAL_MESSAGE_SIZE = 14;
const MODAL_BTN_TEXT_SIZE = 15;

type SettingRow = {
  key: string;
  title: string;
  Icon: React.ComponentType<any>;
  showNext: boolean;
  onPress?: () => void;
};

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <AppText variant="bold" style={styles.modalTitle}>
            {title}
          </AppText>

          <AppText variant="light" style={styles.modalMessage}>
            {message}
          </AppText>

          <View style={styles.modalBtnRow}>
            <Pressable style={styles.modalBtnGhost} onPress={onClose}>
              <AppText variant="bold" style={styles.modalBtnGhostText}>
                Quay lại
              </AppText>
            </Pressable>

            <Pressable style={styles.modalBtnPrimary} onPress={onConfirm}>
              <AppText variant="bold" style={styles.modalBtnPrimaryText}>
                Xác nhận
              </AppText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    if (isFocused) setActiveTab("profile");
  }, [isFocused]);

  const goHomeReset = () => {
    setDeleteModalVisible(false);
    setLogoutModalVisible(false);
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  const rows = useMemo<SettingRow[]>(
    () => [
      {
        key: "noti",
        title: "Thông báo",
        Icon: Setting1Icon,
        showNext: true,
        onPress: () => navigation.navigate("NotificationSettingsScreen"),
      },
      { key: "support", 
        title: "Trung tâm hỗ trợ", 
        Icon: Setting2Icon, 
        showNext: true, 
        onPress: () => navigation.navigate("SupportCenterScreen") },
      { key: "privacy", title: "Chính sách bảo mật", Icon: Setting3Icon, showNext: true },
      {
        key: "language",
        title: "Ngôn ngữ",
        Icon: Setting4Icon,
        showNext: true,
        onPress: () => navigation.navigate("LanguageScreen"),
      },
      { key: "dark", title: "Chuyển màu tối", Icon: Setting5Icon, showNext: false },
      {
        key: "logout",
        title: "Đăng xuất",
        Icon: Setting6Icon,
        showNext: false,
        onPress: () => setLogoutModalVisible(true),
      },
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
          <View style={styles.header}>
            <Pressable style={styles.headerIconCircle} onPress={() => navigation.goBack()}>
              <BackArrowIcon width={18} height={18} />
            </Pressable>

            <View style={styles.headerTitleWrap} pointerEvents="none">
              <AppText variant="bold" style={styles.headerTitle}>
                Cài đặt
              </AppText>
            </View>

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

          <Pressable style={styles.deleteBtn} onPress={() => setDeleteModalVisible(true)}>
            <AppText variant="bold" style={styles.deleteBtnText}>
              Xóa tài khoản
            </AppText>
          </Pressable>

          <AppBottomSpace height={90} />
        </ScrollView>

        <ConfirmModal
          visible={deleteModalVisible}
          title="Xóa tài khoản"
          message="Bạn có muốn xóa tài khoản?"
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={goHomeReset}
        />

        <ConfirmModal
          visible={logoutModalVisible}
          title="Đăng xuất"
          message="Bạn có muốn đăng xuất?"
          onClose={() => setLogoutModalVisible(false)}
          onConfirm={goHomeReset}
        />

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

export default SettingsScreen;

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
    marginBottom: 18,
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

  // MODAL: rộng hơn + cao hơn
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12, // giảm padding để modal rộng hơn
  },
  modalCard: {
    width: "96%", // rộng hơn
    maxWidth: 520,
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 26,
    paddingTop: 22, // cao hơn
    paddingBottom: 20, // cao hơn
    minHeight: 140, // ép cao hơn một chút
  },
  modalTitle: {
    textAlign: "center",
    fontSize: MODAL_TITLE_SIZE,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: ROBOTO_SLAB_BOLD,
  },
  modalMessage: {
    textAlign: "center",
    marginTop: 10,
    fontSize: MODAL_MESSAGE_SIZE,
    color: "#111",
  },
  modalBtnRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 16,
  },
  modalBtnGhost: {
    flex: 1,
    backgroundColor: "#ffe3e2",
    borderRadius: 999,
    paddingVertical: 12, // nút cao hơn
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnGhostText: {
    fontSize: MODAL_BTN_TEXT_SIZE,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: ROBOTO_SLAB_BOLD,
  },
  modalBtnPrimary: {
    flex: 1,
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 999,
    paddingVertical: 12, // nút cao hơn
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnPrimaryText: {
    fontSize: MODAL_BTN_TEXT_SIZE,
    fontWeight: "900",
    color: "#fff",
    fontFamily: ROBOTO_SLAB_BOLD,
  },
});