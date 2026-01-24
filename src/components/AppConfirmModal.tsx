// Nhóm 9 - IE307.Q12
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";
import { useThemeStore } from "../store/useThemeStore";

const ROBOTO_SLAB_BOLD = "RobotoSlab-Bold";
const MODAL_TITLE_SIZE = 20;
const MODAL_MESSAGE_SIZE = 15;
const MODAL_BTN_TEXT_SIZE = 16;

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

const AppConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  loading,
}) => {
  const { theme, isDarkMode } = useThemeStore();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={loading ? undefined : onClose}
      >
        <Pressable
          style={[
            styles.modalCard,
            { backgroundColor: theme.background_contrast },
          ]}
          onPress={() => {}}
        >
          <AppText
            variant="bold"
            style={[styles.modalTitle, { color: theme.primary_text }]}
          >
            {title}
          </AppText>

          <AppText
            style={[styles.modalMessage, { color: theme.placeholder_text }]}
          >
            {message}
          </AppText>

          <View style={styles.modalBtnRow}>
            <Pressable
              style={[
                styles.modalBtnGhost,

                { backgroundColor: isDarkMode ? "#333" : "#FFE5E5" },
                loading && { opacity: 0.5 },
              ]}
              onPress={loading ? undefined : onClose}
            >
              <AppText
                variant="bold"
                style={[
                  styles.modalBtnGhostText,
                  { color: isDarkMode ? "#fff" : AppLightColor.primary_color },
                ]}
              >
                Quay lại
              </AppText>
            </Pressable>

            <Pressable
              style={[
                styles.modalBtnPrimary,
                { backgroundColor: theme.primary_color },
                loading && { opacity: 0.5 },
              ]}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    textAlign: "center",
    fontSize: MODAL_TITLE_SIZE,
    marginBottom: 8,
  },
  modalMessage: {
    textAlign: "center",
    fontSize: MODAL_MESSAGE_SIZE,
    marginBottom: 24,
    lineHeight: 22,
  },
  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
  },
  modalBtnGhost: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnGhostText: {
    fontSize: MODAL_BTN_TEXT_SIZE,
    fontFamily: ROBOTO_SLAB_BOLD,
  },
  modalBtnPrimary: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnPrimaryText: {
    fontSize: MODAL_BTN_TEXT_SIZE,
    color: "#fff",
    fontFamily: ROBOTO_SLAB_BOLD,
  },
});
