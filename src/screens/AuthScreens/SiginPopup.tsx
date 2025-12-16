import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RootStackParamList } from "../navigations/AppStackNavigator";

import CheckIcon from "../assets/images/check.svg";
import styles from "../styles/page3-2b.styles";


type Props = NativeStackScreenProps<RootStackParamList, "Page3-2b">;

export default function Page3_2b({ route, navigation }: Props) {
  const name = route.params?.name ?? "Jane Doe";

  const scale = useRef(new Animated.Value(0.9)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 14,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const close = () => navigation.goBack();

  return (
    <View style={styles.fill}>
      <TouchableWithoutFeedback onPress={close}>
        <Animated.View style={[styles.backdrop, { opacity: fade }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.checkWrapper}>
          <CheckIcon width={81} height={79} />
        </View>

        <Text style={styles.title}>Đăng ký thành công</Text>
        <Text style={styles.subtitle}>Hãy khám phá ngay 🎉</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={close}>
          <Text style={styles.primaryText}>Tiếp tục</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}