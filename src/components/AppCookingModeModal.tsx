// Nhóm 9 - IE307.Q12
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
  FlatList,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Svg, { Circle, G } from "react-native-svg";
import { useKeepAwake } from "expo-keep-awake";
import AppSafeView from "./AppSafeView";
import AppText from "./AppText";
import { useThemeStore } from "../store/useThemeStore";

const { width } = Dimensions.get("window");
const TIMER_RADIUS = 90;
const TIMER_STROKE = 12;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

const useManualTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("⏰ Hết giờ!", "Đã xong bước này chưa?");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => {
    if (timeLeft === 0) return;
    setIsActive(!isActive);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const addTime = (seconds: number) => {
    if (isActive) setIsActive(false);

    setTimeLeft((prev) => {
      const newVal = Math.max(0, prev + seconds);
      if (newVal > initialTime || prev === 0) {
        setInitialTime(newVal);
      }
      return newVal;
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return { timeLeft, initialTime, isActive, toggleTimer, addTime, resetTimer };
};

const ManualTimer = ({ theme, isDarkMode }: any) => {
  const { timeLeft, initialTime, isActive, toggleTimer, addTime, resetTimer } =
    useManualTimer();

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const max = initialTime > 0 ? initialTime : 1;
    const progress = timeLeft / max;
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [timeLeft, initialTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [TIMER_CIRCUMFERENCE, 0],
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
            <Circle
              cx={TIMER_RADIUS + TIMER_STROKE}
              cy={TIMER_RADIUS + TIMER_STROKE}
              r={TIMER_RADIUS}
              stroke={isDarkMode ? "#333" : "#F0F0F0"}
              strokeWidth={TIMER_STROKE}
              fill="transparent"
            />
            <AnimatedCircle
              cx={TIMER_RADIUS + TIMER_STROKE}
              cy={TIMER_RADIUS + TIMER_STROKE}
              r={TIMER_RADIUS}
              stroke={
                isActive
                  ? theme.primary_color
                  : timeLeft > 0
                  ? "#FFB74D"
                  : "transparent"
              }
              strokeWidth={TIMER_STROKE}
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={TIMER_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
            />
          </G>
        </Svg>

        <View style={styles.timerCenter}>
          <AppText
            variant="bold"
            style={[styles.timerDigits, { color: theme.primary_text }]}
          >
            {formatTime(timeLeft)}
          </AppText>
          {timeLeft === 0 ? (
            <AppText
              style={[styles.timerLabel, { color: theme.placeholder_text }]}
            >
              Cài đặt giờ
            </AppText>
          ) : (
            <TouchableOpacity onPress={resetTimer} style={{ marginTop: 4 }}>
              <AppText style={{ color: "red", fontWeight: "bold" }}>
                RESET
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.timerControls}>
        <TouchableOpacity
          style={[
            styles.controlSmallBtn,
            { backgroundColor: theme.background_contrast },
          ]}
          onPress={() => addTime(10)}
        >
          <AppText
            style={[styles.controlSmallText, { color: theme.primary_text }]}
          >
            +10s
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleTimer}
          disabled={timeLeft === 0}
          style={[
            styles.playPauseBtn,
            {
              backgroundColor:
                timeLeft === 0
                  ? theme.border
                  : isActive
                  ? "#FFB74D"
                  : theme.primary_color,
            },
          ]}
        >
          <Ionicons name={isActive ? "pause" : "play"} size={36} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlSmallBtn,
            { backgroundColor: theme.background_contrast },
          ]}
          onPress={() => addTime(60)}
        >
          <AppText
            style={[styles.controlSmallText, { color: theme.primary_text }]}
          >
            +1m
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CookingModeModal = ({
  visible,
  onClose,
  onCompleteCooking,
  item,
}: any) => {
  useKeepAwake();
  const { theme, isDarkMode } = useThemeStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [isIngredientsChecked, setIsIngredientsChecked] = useState(false);

  const flatListRef = useRef<FlatList>(null);
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

  const finishCooking = () => {
    const timeUsed = (Date.now() - startTimeRef.current) / 1000;
    onCompleteCooking(timeUsed);
  };

  const renderStepItem = ({
    item: step,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    return (
      <View style={{ width: width, padding: 20 }}>
        <View
          style={[
            styles.stepCard,
            { backgroundColor: theme.background_contrast },
          ]}
        >
          <View style={styles.stepCardHeader}>
            <View
              style={[
                styles.stepBadge,
                { backgroundColor: theme.primary_color },
              ]}
            >
              <AppText style={styles.stepBadgeText}>#{index + 1}</AppText>
            </View>
            <AppText
              variant="bold"
              style={[styles.stepName, { color: theme.primary_text }]}
            >
              {step.title || `Bước ${index + 1}`}
            </AppText>
          </View>

          <ScrollView
            style={{ maxHeight: 150 }}
            showsVerticalScrollIndicator={true}
          >
            <AppText
              style={[styles.stepDescription, { color: theme.primary_text }]}
            >
              {step.content}
            </AppText>
          </ScrollView>
        </View>

        <ManualTimer
          key={`manual-timer-${index}`}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      </View>
    );
  };

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <AppSafeView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: theme.background_contrast },
              ]}
            >
              <Ionicons name="close" size={24} color={theme.primary_text} />
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBarTrack,
                  { backgroundColor: theme.background_contrast },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${
                        isIngredientsChecked
                          ? ((currentStepIndex + 1) /
                              (item.steps?.length || 1)) *
                            100
                          : 0
                      }%`,
                      backgroundColor: theme.primary_color,
                    },
                  ]}
                />
              </View>
              <AppText
                style={[styles.progressText, { color: theme.placeholder_text }]}
              >
                {isIngredientsChecked
                  ? `Bước ${currentStepIndex + 1}/${item.steps?.length}`
                  : "Chuẩn bị"}
              </AppText>
            </View>
          </View>
        </View>

        {!isIngredientsChecked ? (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.cardContainer,
                { backgroundColor: theme.background_contrast },
              ]}
            >
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name="basket-outline"
                  size={28}
                  color={theme.primary_color}
                />
                <AppText
                  variant="bold"
                  style={[styles.cardTitle, { color: theme.primary_text }]}
                >
                  Nguyên liệu
                </AppText>
              </View>
              <AppText
                style={[styles.hintText, { color: theme.placeholder_text }]}
              >
                Kiểm tra nguyên liệu trước khi nấu
              </AppText>

              {item.ingredients?.map((ing: any, index: number) => {
                const isChecked = checkedIngredients.includes(index.toString());
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.ingredientItem,
                      { borderBottomColor: theme.border },
                      isChecked && { opacity: 0.5 },
                    ]}
                    onPress={() => toggleIngredientCheck(index.toString())}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        { borderColor: theme.border },
                        isChecked && {
                          backgroundColor: theme.primary_color,
                          borderColor: theme.primary_color,
                        },
                      ]}
                    >
                      {isChecked && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <AppText
                        style={[
                          styles.ingText,
                          { color: theme.primary_text },
                          isChecked && { textDecorationLine: "line-through" },
                        ]}
                      >
                        {ing.name}
                      </AppText>
                      <AppText
                        style={[
                          styles.ingAmount,
                          { color: theme.primary_color },
                        ]}
                      >
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
                  {
                    backgroundColor:
                      checkedIngredients.length === item.ingredients?.length
                        ? theme.primary_color
                        : theme.background,
                  },
                  checkedIngredients.length !== item.ingredients?.length && {
                    borderWidth: 1,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => {
                  if (checkedIngredients.length === item.ingredients?.length) {
                    setIsIngredientsChecked(true);
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                  } else {
                    Alert.alert(
                      "Khoan đã!",
                      "Bạn cần chuẩn bị đủ nguyên liệu trước."
                    );
                  }
                }}
              >
                <AppText
                  variant="bold"
                  style={[
                    styles.bigButtonText,
                    {
                      color:
                        checkedIngredients.length === item.ingredients?.length
                          ? "#fff"
                          : theme.placeholder_text,
                    },
                  ]}
                >
                  BẮT ĐẦU NẤU
                </AppText>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={
                    checkedIngredients.length === item.ingredients?.length
                      ? "#fff"
                      : theme.placeholder_text
                  }
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={item.steps}
              renderItem={renderStepItem}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );
                if (newIndex !== currentStepIndex) {
                  setCurrentStepIndex(newIndex);
                  Haptics.selectionAsync();
                }
              }}
            />

            <View
              style={[styles.footerControls, { borderTopColor: theme.border }]}
            >
              <View style={styles.dotsContainer}>
                {item.steps.map((_: any, i: number) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          i === currentStepIndex
                            ? theme.primary_color
                            : theme.border,
                      },
                    ]}
                  />
                ))}
              </View>

              {currentStepIndex === item.steps.length - 1 && (
                <TouchableOpacity
                  style={[
                    styles.finishBtn,
                    { backgroundColor: theme.primary_color },
                  ]}
                  onPress={finishCooking}
                >
                  <AppText variant="bold" style={{ color: "#fff" }}>
                    HOÀN THÀNH
                  </AppText>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </AppSafeView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  progressContainer: {
    flex: 1,
    marginLeft: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginRight: 10,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  content: {
    padding: 20,
  },

  // Card
  cardContainer: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    marginLeft: 8,
  },
  hintText: {
    marginBottom: 20,
    fontSize: 14,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  ingText: {
    fontSize: 16,
    flex: 1,
  },
  ingAmount: {
    fontSize: 15,
    fontWeight: "bold",
  },

  bigButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    marginTop: 10,
  },
  bigButtonText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },

  stepCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    height: "40%",
    justifyContent: "center",
  },
  stepCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  stepBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  stepName: {
    fontSize: 20,
    flex: 1,
  },
  stepDescription: {
    fontSize: 16,
    lineHeight: 26,
  },

  timerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  svgContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  timerCenter: {
    position: "absolute",
    alignItems: "center",
  },
  timerDigits: {
    fontSize: 48,
    fontVariant: ["tabular-nums"],
  },
  timerLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  timerControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 24,
  },
  playPauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  controlSmallBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  controlSmallText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  footerControls: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  finishBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
  },
});

export default CookingModeModal;
