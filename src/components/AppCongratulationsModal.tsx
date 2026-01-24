// Nhóm 9 - IE307.Q12
import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "./AppText";

const PRIMARY_COLOR = "#F06560";

type Props = {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  recipeTitle: string;
  totalSteps: number;
  timeUsed: number;
};

const AppCongratulationsModal = ({
  visible,
  onClose,
  onShare,
  recipeTitle,
  totalSteps,
  timeUsed,
}: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="chef-hat"
              size={60}
              color={PRIMARY_COLOR}
            />
          </View>

          <AppText variant="bold" style={styles.modalTitle}>
            Chúc mừng! 🎉
          </AppText>
          <AppText style={styles.modalText}>
            Bạn đã hoàn thành món "{recipeTitle}"
          </AppText>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Feather name="clock" size={20} color="#666" />
              <AppText style={styles.statText}>
                Thời gian: {Math.floor(timeUsed / 60)} phút
              </AppText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="restaurant" size={20} color="#666" />
              <AppText style={styles.statText}>
                Đã hoàn thành: {totalSteps} bước
              </AppText>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonShare]}
              onPress={onShare}
            >
              <Ionicons name="share-social" size={20} color="#fff" />
              <AppText style={styles.buttonText}>Chia sẻ</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <AppText style={styles.buttonText}>Hoàn thành</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "85%",
    elevation: 5,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    color: PRIMARY_COLOR,
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  statsContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 24,
  },
  statItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8 
  },
  statText: { 
    fontSize: 14, 
    color: "#666", 
    marginLeft: 8, 
    flex: 1 
  },
  buttonContainer: { 
    flexDirection: "row", 
    gap: 12, 
    width: "100%" 
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonShare: { 
    backgroundColor: "#2196F3" 
  },
  buttonClose: { 
    backgroundColor: PRIMARY_COLOR 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 15, 
    fontWeight: "600" 
  },
});

export default AppCongratulationsModal;
