
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { RootStackParamList } from "../navigations/RootNavigator";

import CheckIcon from "../../assets/images/check.svg";
import LogoIcon from "../../assets/images/logo.svg";

type Props = NativeStackScreenProps<RootStackParamList, "RegisterSuccess">;

const ORANGE = "#FF782C";

const CARD_W = 270;
const CARD_R = 22;
const BADGE = 69;   
const INSET_BORDER = 3; 

export default function RegisterSuccessScreen({ route, navigation }: Props) {
  const name = route.params?.name ?? "Jane Doe";

  const scale = useRef(new Animated.Value(0.92)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 12 }),
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, []);

  const close = () => navigation.goBack();

  return (
    <View style={StyleSheet.absoluteFill}>
   
      <TouchableWithoutFeedback onPress={close}>
        <Animated.View style={[styles.backdrop, { opacity: fade }]} />
      </TouchableWithoutFeedback>

    
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
       
        <View style={styles.avatar}>
          <LogoIcon width={88} height={88} />
        </View>

     
        <Text style={styles.title}>Đăng ký thành công!</Text>

        
        <View style={styles.badgeZone}>
          <View style={styles.separator} />
          <View style={styles.tickBadge}>
            <CheckIcon width={BADGE} height={BADGE} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  card: {
    position: "absolute",
    alignSelf: "center",
    top: "32%",
    width: CARD_W,
    backgroundColor: ORANGE,
    borderRadius: CARD_R,
    borderWidth: 6,
    borderColor: "#fff",
    alignItems: "center",
    paddingTop: 22,
    paddingBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
    
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#fff0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  badgeZone: {
    position: "relative",
    width: "100%",
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
 
  separator: {
    position: "absolute",
    left:0,
    right: 0,
    height: 2,
    backgroundColor: "#FFFFFF",
    opacity: 0.85,
    borderRadius: 2,
  },
 
  tickBadge: {
    position: "absolute",
    width: BADGE,
    height: BADGE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
});
