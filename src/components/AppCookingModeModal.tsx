import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import AppSafeView from "./AppSafeView";
import AppText from "./AppText";

const PRIMARY_COLOR = "#F06560";

// --- SUB COMPONENT: TIMER ---
const CookingTimer = ({ initialTime, onComplete, isActive, onToggle }: any) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(
        () =>
          setTimeLeft((p: number) => {
            if (p <= 1) {
              clearInterval(timerRef.current);
              onComplete();
              return 0;
            }
            return p - 1;
          }),
        1000
      );
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.timerContainer}>
      <View style={styles.timeDisplay}>
        <MaterialCommunityIcons name="timer" size={24} color={PRIMARY_COLOR} />
        <AppText variant="bold" style={styles.timeText}>
          {formatTime(timeLeft)}
        </AppText>
      </View>
      <TouchableOpacity
        onPress={onToggle}
        style={[
          styles.toggleBtn,
          { backgroundColor: isActive ? "#FF4444" : PRIMARY_COLOR },
        ]}
      >
        <Ionicons name={isActive ? "pause" : "play"} size={20} color="#fff" />
        <AppText style={styles.toggleText}>
          {isActive ? "Tạm dừng" : "Bắt đầu"}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

// --- MAIN COMPONENT ---
type Props = {
  visible: boolean;
  onClose: () => void;
  onCompleteCooking: (timeUsed: number) => void;
  item: any;
};

const CookingModeModal = ({
  visible,
  onClose,
  onCompleteCooking,
  item,
}: Props) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isIngredientsChecked, setIsIngredientsChecked] = useState(false);
  const [stepTimerActive, setStepTimerActive] = useState(false);
  const startTimeRef = useRef<number>(0);

  // Reset state khi mở modal
  useEffect(() => {
    if (visible) {
      setCurrentStepIndex(0);
      setCheckedIngredients([]);
      setCompletedSteps([]);
      setIsIngredientsChecked(false);
      startTimeRef.current = Date.now();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  const toggleIngredientCheck = (idx: string) => {
    setCheckedIngredients((prev) => {
      if (prev.includes(idx)) return prev.filter((id) => id !== idx);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return [...prev, idx];
    });
  };

  const goToNextStep = () => {
    if (currentStepIndex < (item.steps?.length || 0) - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setStepTimerActive(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Đánh dấu bước cũ là đã xong
      if (!completedSteps.includes(currentStepIndex.toString())) {
        setCompletedSteps((prev) => [...prev, currentStepIndex.toString()]);
      }
    } else {
      // Hoàn thành
      const timeUsed = (Date.now() - startTimeRef.current) / 1000;
      onCompleteCooking(timeUsed);
    }
  };

  const parseTimeToSeconds = (timeString: string) => {
    if (!timeString) return 600;
    const match = timeString.match(/(\d+)/);
    return match ? parseInt(match[0]) * 60 : 600;
  };

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <AppSafeView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((currentStepIndex + 1) / (item.steps?.length || 1)) * 100
                    }%`,
                    backgroundColor: isIngredientsChecked ? "#fff" : "#ccc",
                  },
                ]}
              />
            </View>
            <AppText style={styles.progressText}>
              Bước {currentStepIndex + 1}/{item.steps?.length || 0}
            </AppText>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* PHẦN 1: NGUYÊN LIỆU */}
          {!isIngredientsChecked ? (
            <View style={styles.section}>
              <AppText variant="bold" style={styles.sectionTitle}>
                Chuẩn bị nguyên liệu
              </AppText>
              <View style={styles.ingredientsList}>
                {item.ingredients?.map((ing: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.ingredientItem}
                    onPress={() => toggleIngredientCheck(index.toString())}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        checkedIngredients.includes(index.toString()) &&
                          styles.checkedBox,
                      ]}
                    >
                      {checkedIngredients.includes(index.toString()) && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                    <View>
                      <AppText style={styles.ingredientName}>
                        {ing.name}
                      </AppText>
                      <AppText style={styles.ingredientAmount}>
                        {ing.amount}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  checkedIngredients.length === item.ingredients?.length &&
                    styles.continueButtonActive,
                ]}
                onPress={() => {
                  if (checkedIngredients.length === item.ingredients?.length)
                    setIsIngredientsChecked(true);
                  else
                    Alert.alert(
                      "Thông báo",
                      "Hãy chuẩn bị đủ nguyên liệu nhé!"
                    );
                }}
              >
                <AppText variant="bold" style={styles.continueButtonText}>
                  Tiếp tục
                </AppText>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            /* PHẦN 2: CÁC BƯỚC THỰC HIỆN */
            <View style={styles.section}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberBadge}>
                  <AppText style={{ color: "#fff", fontWeight: "bold" }}>
                    {currentStepIndex + 1}
                  </AppText>
                </View>
                <AppText variant="bold" style={styles.stepTitle}>
                  {item.steps[currentStepIndex]?.title}
                </AppText>
              </View>
              <View style={styles.stepContent}>
                <AppText style={styles.stepDescription}>
                  {item.steps[currentStepIndex]?.content}
                </AppText>
              </View>

              {item.steps[currentStepIndex]?.time && (
                <CookingTimer
                  initialTime={parseTimeToSeconds(
                    item.steps[currentStepIndex].time
                  )}
                  onComplete={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Warning
                    );
                    Alert.alert("Hết giờ!");
                  }}
                  isActive={stepTimerActive}
                  onToggle={() => setStepTimerActive(!stepTimerActive)}
                />
              )}

              <View style={styles.navigationButtons}>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    styles.prevButton,
                    currentStepIndex === 0 && { opacity: 0.5 },
                  ]}
                  disabled={currentStepIndex === 0}
                  onPress={() => {
                    setCurrentStepIndex((p) => p - 1);
                    setStepTimerActive(false);
                  }}
                >
                  <AppText style={styles.navButtonText}>Quay lại</AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={goToNextStep}
                >
                  <AppText style={styles.navButtonText}>
                    {currentStepIndex === (item.steps?.length || 0) - 1
                      ? "Hoàn thành"
                      : "Tiếp theo"}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </AppSafeView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: { flex: 1 },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: { height: "100%", borderRadius: 3, backgroundColor: "#fff" },
  progressText: { color: "#fff", fontSize: 12, textAlign: "center" },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, color: "#333", marginBottom: 12 },
  ingredientsList: { marginBottom: 24 },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkedBox: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
  ingredientName: { fontSize: 16, color: "#333" },
  ingredientAmount: { fontSize: 14, color: PRIMARY_COLOR, fontWeight: "600" },
  continueButton: {
    backgroundColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonActive: { backgroundColor: PRIMARY_COLOR },
  continueButtonText: { color: "#fff", fontSize: 16 },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  stepNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: { fontSize: 18, color: "#333", flex: 1 },
  stepContent: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  stepDescription: { fontSize: 16, color: "#555", lineHeight: 24 },
  navigationButtons: { flexDirection: "row", gap: 12, marginTop: 20 },
  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  prevButton: { backgroundColor: "#666" },
  nextButton: { backgroundColor: PRIMARY_COLOR },
  navButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  // Timer Styles
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  timeDisplay: { flexDirection: "row", alignItems: "center" },
  timeText: { fontSize: 20, color: "#333", marginLeft: 8 },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  toggleText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

export default CookingModeModal;
