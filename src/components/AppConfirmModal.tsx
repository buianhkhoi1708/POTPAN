import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import { AppLightColor } from "../styles/color";

// --- IMPORT STORE ---
import { useAuthStore } from "../store/useAuthStore";

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

const MODAL_TITLE_SIZE = 22;
const MODAL_MESSAGE_SIZE = 14;
const MODAL_BTN_TEXT_SIZE = 15;
type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean; // Thêm prop loading để hiện vòng quay khi đang xử lý
};

const AppConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  loading
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={loading ? undefined : onClose}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <AppText variant="bold" style={styles.modalTitle}>
            {title}
          </AppText>

          <AppText variant="light" style={styles.modalMessage}>
            {message}
          </AppText>

          <View style={styles.modalBtnRow}>
            {/* Nút Hủy */}
            <Pressable 
              style={[styles.modalBtnGhost, loading && { opacity: 0.5 }]} 
              onPress={loading ? undefined : onClose}
            >
              <AppText variant="bold" style={styles.modalBtnGhostText}>
                Quay lại
              </AppText>
            </Pressable>

            {/* Nút Xác nhận */}
            <Pressable 
              style={[styles.modalBtnPrimary, loading && { opacity: 0.5 }]} 
              onPress={loading ? undefined : onConfirm}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <AppText variant="bold" style={styles.modalBtnPrimaryText}>
                  Xác nhận
                </AppText>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AppConfirmModal;

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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  modalCard: {
    width: "96%",
    maxWidth: 520,
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 26,
    paddingTop: 22,
    paddingBottom: 20,
    minHeight: 140,
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
    paddingVertical: 12,
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
    paddingVertical: 12,
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