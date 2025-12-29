import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Svg, { Circle, G } from "react-native-svg"; 
import { useKeepAwake } from "expo-keep-awake"; 

import AppSafeView from "./AppSafeView";
import AppText from "./AppText";

const PRIMARY_COLOR = "#FF6967";
const { width } = Dimensions.get("window");
const TIMER_RADIUS = 80;
const TIMER_STROKE = 10;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

// --- COMPONENT: CIRCULAR TIMER (Hiện đại) ---
const ModernTimer = ({ initialTime, onComplete, isActive, onToggle }: any) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Hiệu ứng vòng tròn
  useEffect(() => {
    const progress = 1 - timeLeft / (initialTime || 1);
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [timeLeft, initialTime]);

  // Logic đếm ngược
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const addTime = (seconds: number) => {
    setTimeLeft((prev: number) => prev + seconds);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Animated Circle Props
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [TIMER_CIRCUMFERENCE, 0], // Chạy ngược hoặc xuôi tùy ý
  });

  return (
    <View style={styles.timerWrapper}>
      {/* Vòng tròn SVG */}
      <View style={styles.svgContainer}>
        <Svg
          width={(TIMER_RADIUS + TIMER_STROKE) * 2}
          height={(TIMER_RADIUS + TIMER_STROKE) * 2}
        >
          <G
            rotation="-90"
            origin={`${TIMER_RADIUS + TIMER_STROKE}, ${
              TIMER_RADIUS + TIMER_STROKE
            }`}
          >
            {/* Vòng nền mờ */}
            <Circle
              cx={TIMER_RADIUS + TIMER_STROKE}
              cy={TIMER_RADIUS + TIMER_STROKE}
              r={TIMER_RADIUS}
              stroke="#FFE0E0"
              strokeWidth={TIMER_STROKE}
              fill="transparent"
            />
            {/* Vòng chạy */}
            <AnimatedCircle
              cx={TIMER_RADIUS + TIMER_STROKE}
              cy={TIMER_RADIUS + TIMER_STROKE}
              r={TIMER_RADIUS}
              stroke={PRIMARY_COLOR}
              strokeWidth={TIMER_STROKE}
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={TIMER_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
            />
          </G>
        </Svg>

        {/* Số giờ ở giữa */}
        <View style={styles.timerCenter}>
          <AppText variant="bold" style={styles.timerDigits}>
            {formatTime(timeLeft)}
          </AppText>
          <AppText style={styles.timerLabel}>phút : giây</AppText>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.timerControls}>
        <TouchableOpacity
          style={styles.controlSmallBtn}
          onPress={() => addTime(30)}
        >
          <AppText style={styles.controlSmallText}>+30s</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onToggle}
          style={[styles.playPauseBtn, isActive && styles.pauseBtn]}
        >
          <Ionicons name={isActive ? "pause" : "play"} size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlSmallBtn}
          onPress={() => addTime(60)}
        >
          <AppText style={styles.controlSmallText}>+1m</AppText>
        </TouchableOpacity>
      </View>
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

// IE307.Q12_Nhom9

const CookingModeModal = ({
  visible,
  onClose,
  onCompleteCooking,
  item,
}: Props) => {
  useKeepAwake(); 

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [isIngredientsChecked, setIsIngredientsChecked] = useState(false);
  const [stepTimerActive, setStepTimerActive] = useState(false);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (visible) {
      setCurrentStepIndex(0);
      setCheckedIngredients([]);
      setIsIngredientsChecked(false);
      startTimeRef.current = Date.now();
    }
  }, [visible]);

  const toggleIngredientCheck = (idx: string) => {
    Haptics.selectionAsync();
    setCheckedIngredients((prev) =>
      prev.includes(idx) ? prev.filter((id) => id !== idx) : [...prev, idx]
    );
  };

  const goToNextStep = () => {
    if (currentStepIndex < (item.steps?.length || 0) - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setStepTimerActive(false); // Reset timer state cho bước mới
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      const timeUsed = (Date.now() - startTimeRef.current) / 1000;
      onCompleteCooking(timeUsed);
    }
  };

  const parseTimeToSeconds = (timeString: string) => {
    if (!timeString) return 0;
    const match = timeString.match(/(\d+)/);
    // Nếu trong string có chữ "phút" hoặc mặc định là phút -> * 60
    // Nếu muốn chính xác hơn có thể check keyword "giây"
    return match ? parseInt(match[0]) * 60 : 0;
  };

  // Tính progress bar tổng thể
  const totalSteps = item.steps?.length || 1;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <AppSafeView style={styles.container}>
        {/* Header với Progress Bar */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#333" />
            </TouchableOpacity>
            <View style={styles.headerTitleWrap}>
              <AppText
                variant="bold"
                style={styles.headerTitle}
                numberOfLines={1}
              >
                {isIngredientsChecked
                  ? `Bước ${currentStepIndex + 1}/${totalSteps}`
                  : "Chuẩn bị"}
              </AppText>
            </View>
            <View style={{ width: 32 }} />
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${isIngredientsChecked ? progressPercent : 0}%` },
              ]}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* GIAI ĐOẠN 1: CHECKLIST NGUYÊN LIỆU */}
          {!isIngredientsChecked ? (
            <View style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name="basket-outline"
                  size={28}
                  color={PRIMARY_COLOR}
                />
                <AppText variant="bold" style={styles.cardTitle}>
                  Nguyên liệu cần có
                </AppText>
              </View>

              <AppText style={styles.hintText}>
                Chạm để đánh dấu những gì bạn đã chuẩn bị
              </AppText>

              {item.ingredients?.map((ing: any, index: number) => {
                const isChecked = checkedIngredients.includes(index.toString());
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.ingredientItem,
                      isChecked && styles.ingredientItemChecked,
                    ]}
                    onPress={() => toggleIngredientCheck(index.toString())}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && styles.checkboxActive,
                      ]}
                    >
                      {isChecked && (
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <AppText
                        style={[
                          styles.ingText,
                          isChecked && styles.ingTextChecked,
                        ]}
                      >
                        {ing.name}
                      </AppText>
                      <AppText style={styles.ingAmount}>
                        {ing.amount || ing.quantity}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <View style={{ height: 20 }} />

              <TouchableOpacity
                style={[
                  styles.bigButton,
                  checkedIngredients.length === item.ingredients?.length
                    ? styles.btnPrimary
                    : styles.btnDisabled,
                ]}
                onPress={() => {
                  if (checkedIngredients.length === item.ingredients?.length) {
                    setIsIngredientsChecked(true);
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                  } else {
                    Alert.alert(
                      "Chưa xong!",
                      "Bạn cần chuẩn bị đủ nguyên liệu trước khi bắt đầu nấu."
                    );
                  }
                }}
              >
                <AppText variant="bold" style={styles.bigButtonText}>
                  BẮT ĐẦU NẤU
                </AppText>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            /* GIAI ĐOẠN 2: CÁC BƯỚC NẤU (STEP BY STEP) */
            <View>
              {/* Step Card */}
              <View style={styles.stepCard}>
                <View style={styles.stepCardHeader}>
                  <View style={styles.stepBadge}>
                    <AppText style={styles.stepBadgeText}>
                      #{currentStepIndex + 1}
                    </AppText>
                  </View>
                  <AppText variant="bold" style={styles.stepName}>
                    {item.steps[currentStepIndex]?.title ||
                      `Bước ${currentStepIndex + 1}`}
                  </AppText>
                </View>

                <AppText style={styles.stepDescription}>
                  {item.steps[currentStepIndex]?.content}
                </AppText>
              </View>

              {/* Timer (Chỉ hiện nếu bước này có thời gian) */}
              {parseTimeToSeconds(item.steps[currentStepIndex]?.time) > 0 ? (
                <ModernTimer
                  key={currentStepIndex} // Reset timer khi đổi bước
                  initialTime={parseTimeToSeconds(
                    item.steps[currentStepIndex].time
                  )}
                  onComplete={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Warning
                    );
                    Alert.alert("Hết giờ!", "Đã xong bước này chưa?");
                  }}
                  isActive={stepTimerActive}
                  onToggle={() => setStepTimerActive(!stepTimerActive)}
                />
              ) : (
                <View style={styles.noTimerPlaceholder}>
                  <Ionicons name="infinite" size={32} color="#ddd" />
                  <AppText style={{ color: "#999", marginTop: 8 }}>
                    Bước này không giới hạn thời gian
                  </AppText>
                </View>
              )}

              {/* Navigation Buttons */}
              <View style={styles.navRow}>
                <TouchableOpacity
                  style={[styles.navBtn, styles.navBtnSecondary]}
                  disabled={currentStepIndex === 0}
                  onPress={() => {
                    setCurrentStepIndex((p) => p - 1);
                    setStepTimerActive(false);
                  }}
                >
                  <Ionicons name="arrow-back" size={20} color="#666" />
                  <AppText style={styles.navBtnTextSec}>Quay lại</AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navBtn, styles.navBtnPrimary]}
                  onPress={goToNextStep}
                >
                  <AppText style={styles.navBtnTextPri}>
                    {currentStepIndex === (item.steps?.length || 0) - 1
                      ? "HOÀN THÀNH"
                      : "TIẾP THEO"}
                  </AppText>
                  <Ionicons
                    name={
                      currentStepIndex === (item.steps?.length || 0) - 1
                        ? "checkmark"
                        : "arrow-forward"
                    }
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </AppSafeView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  // Header
  header: { backgroundColor: "#fff", paddingTop: 10, paddingBottom: 0 },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 16, color: "#333" },
  progressBarTrack: { height: 4, backgroundColor: "#E0E0E0", width: "100%" },
  progressBarFill: { height: "100%", backgroundColor: PRIMARY_COLOR },

  content: { padding: 20 },

  // Card Style (Dùng chung cho Ingredients)
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 20, color: "#333", marginLeft: 8 },
  hintText: { color: "#888", marginBottom: 20, fontSize: 14 },

  // Ingredients List
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  ingredientItemChecked: { opacity: 0.6 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  checkboxActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  ingText: { fontSize: 16, color: "#333", flex: 1 },
  ingTextChecked: { textDecorationLine: "line-through", color: "#999" },
  ingAmount: { fontSize: 14, color: PRIMARY_COLOR, fontWeight: "600" },

  // Big Button
  bigButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnDisabled: { backgroundColor: "#CCC" },
  bigButtonText: { color: "#fff", fontSize: 16, letterSpacing: 0.5 },

  // Step View
  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  stepCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepBadge: {
    backgroundColor: "#FFF0F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  stepBadgeText: { color: PRIMARY_COLOR, fontWeight: "bold", fontSize: 14 },
  stepName: { fontSize: 18, color: "#333", flex: 1 },
  stepDescription: { fontSize: 17, color: "#444", lineHeight: 28 },

  // Timer
  timerWrapper: { alignItems: "center", marginBottom: 30 },
  svgContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  timerCenter: { position: "absolute", alignItems: "center" },
  timerDigits: { fontSize: 36, color: "#333", fontVariant: ["tabular-nums"] }, // tabular-nums giúp số không bị nhảy
  timerLabel: { fontSize: 12, color: "#999" },

  timerControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 20,
  },
  playPauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pauseBtn: { backgroundColor: "#FFB74D" }, // Màu cam khi pause
  controlSmallBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  controlSmallText: { fontSize: 13, fontWeight: "bold", color: "#666" },

  noTimerPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    marginBottom: 20,
    opacity: 0.5,
  },

  // Nav Buttons Row
  navRow: { flexDirection: "row", gap: 16 },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  navBtnSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  navBtnPrimary: {
    backgroundColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  navBtnTextSec: { color: "#666", fontWeight: "600", fontSize: 15 },
  navBtnTextPri: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});

export default CookingModeModal;
