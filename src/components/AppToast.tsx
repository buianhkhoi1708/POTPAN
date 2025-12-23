// src/components/AppToast.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import AppText from "./AppText";

type Props = {
  visible: boolean;
  message: string;
  durationMs?: number;
  bottomOffset?: number;
  onHide?: () => void;
};

const AppToast: React.FC<Props> = ({
  visible,
  message,
  durationMs = 2500,
  bottomOffset = 90,
  onHide,
}) => {
  const [mounted, setMounted] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  const hasMessage = useMemo(() => typeof message === "string" && message.length > 0, [message]);

  useEffect(() => {
    if (!visible || !hasMessage) {
      if (mounted) {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 8,
            duration: 160,
            useNativeDriver: true,
          }),
        ]).start(() => setMounted(false));
      }
      return;
    }

    setMounted(true);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => {
      onHide?.();
    }, durationMs);

    return () => clearTimeout(t);
  }, [visible, hasMessage, durationMs, mounted, onHide, opacity, translateY]);

  if (!mounted) return null;

  return (
    <View pointerEvents="none" style={[styles.wrap, { bottom: bottomOffset }]}>
      <Animated.View
        style={[
          styles.toast,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <AppText variant="medium" style={styles.text}>
          {message}
        </AppText>
      </Animated.View>
    </View>
  );
};

export default AppToast;

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    maxWidth: "86%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#000000cc",
  },
  text: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },
});
