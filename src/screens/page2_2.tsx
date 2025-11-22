import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

// CHÚ Ý: chỉnh lại path này cho đúng vị trí file thật
// nếu MIY.svg đang nằm ở src/assets/MIY.svg thì dùng "../assets/MIY.svg"
import MIY from "../assets/MIY.svg";

import E1 from "../assets/eli1.svg";
import E2 from "../assets/eli2.svg";
import E3 from "../assets/eli3.svg";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function Screen() {
  const router = useRouter();
  const { ima } = useLocalSearchParams<{ ima?: string }>();

  const urlFromParam =
    typeof ima === "string" && ima.length > 0 ? decodeURIComponent(ima) : undefined;

  const remoteBg: ImageSourcePropType | undefined = urlFromParam
    ? { uri: urlFromParam }
    : undefined;

  const renderContent = () => (
    <>
      <LinearGradient
        colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
        locations={[0.25, 0.95]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.topFade}
      />

      <Text style={styles.title}>MÓN ĂN CHÂU ÂU</Text>
      <Text style={styles.subtitle}>Tinh hoa văn hoá phương tây, sang trọng quý phái </Text>
      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
        locations={[0, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomFade}
      />

      <View style={styles.dots}>
        <View style={[styles.dot, { opacity: 1 }]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, { opacity: 1 }]} />        
        <View style={[styles.dot, { opacity: 1 }]} />
      </View>

      <Pressable style={[styles.muiten, { left: 24 }]} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </Pressable>

      <Pressable
        style={[styles.muiten, { right: 24 }]}
        onPress={() =>
          router.push({
            pathname: "/page1-2",
            params: { ima: encodeURIComponent(urlFromParam ?? "") },
          })
        }
      >
        <Ionicons name="arrow-forward" size={28} color="#fff" />
      </Pressable>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {remoteBg ? (
        <ImageBackground
          source={remoteBg}
          resizeMode="cover"
          style={styles.background}
          imageStyle={styles.bgImage}
        >
          {renderContent()}
        </ImageBackground>
      ) : (
        <View style={styles.background}>
          <MIY
            width={SCREEN_W}
            height={SCREEN_H}
            preserveAspectRatio="xMidYMid slice"
            style={styles.bgImage}
          />
          {renderContent()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(185, 169, 169, 1)" },
  background: { flex: 1 },
  bgImage: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topFade: {
    position: "absolute",
    width: SCREEN_W,
    height: 330,
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
  },
  title: {
    top: 60,
    left: 16,
    right: 16,
    fontSize: 25,
    paddingHorizontal: 16,
    fontStyle: "normal",
    fontWeight: "700",
    color: "#ff0000ff",
    lineHeight: 30,
    letterSpacing: 0.04,
    marginBottom: 4,
  },
  subtitle: {
    fontStyle: "italic",
    fontSize: 15,
    color: "#000000",
    fontWeight: "400",
    letterSpacing: 0.04,
    lineHeight: 18,
    top: 60,
    left: 16,
    right: 16,
    paddingHorizontal: 16,
  },
  ring: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.95)",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  dots: {
    position: "absolute",
    bottom: 52,
    left: 100,
    right: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#ffffffff" },
  dotActive: { opacity: 1, width: 9, height: 9, backgroundColor: "#000000ff" },
  muiten: {
    position: "absolute",
    bottom: 36,
    width: 52,
    height: 52,
    borderRadius: 52,
    backgroundColor: "#FF782C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF782C",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});