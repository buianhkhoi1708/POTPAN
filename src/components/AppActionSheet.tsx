// src/components/AppActionSheet.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
  sheetHeight?: number;
};

const AppActionSheet: React.FC<Props> = ({
  visible,
  onClose,
  children,
  sheetStyle,
  sheetHeight = 360,
}) => {
  const [mounted, setMounted] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const translateY = useMemo(() => {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: [sheetHeight, 0],
    });
  }, [anim, sheetHeight]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(anim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      return;
    }
    if (!mounted) return;

    Animated.timing(anim, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
      setMounted(false);
    });
  }, [visible, mounted, anim]);

  if (!mounted) return null;

  return (
    <Modal transparent animationType="none" visible={mounted} onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }, sheetStyle as any]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AppActionSheet;

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#00000055" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 22,
  },
});
