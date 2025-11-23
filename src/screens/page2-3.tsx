import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StatusBar,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import E1 from "../../assets/images/eli1.svg";
import E2 from "../../assets/images/eli2.svg";
import E3 from "../../assets/images/eli3.svg";

import styles from "../styles/screens/page2-3.styles";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const ima = (route.params as any)?.ima as string | undefined;

  const urlFromParam =
    typeof ima === "string" && ima.length > 0 ? decodeURIComponent(ima) : undefined;

  const bgSource: ImageSourcePropType =
    urlFromParam ? { uri: urlFromParam } : require("../../assets/images/2-3.png");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ImageBackground
        source={bgSource}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.bgImage}
      >
        {/* Fade ở trên */}
        <LinearGradient
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
          locations={[0.25, 0.95]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.topFade}
        />

        <Text style={styles.title}>Các Tính Năng Chính</Text>
        <Text style={styles.subtitle}>Cung cấp cho người dùng trải nghiệm tuyệt vời</Text>

        <View>
          <Text style={styles.T1}>Tìm kiếm công thức</Text>
          <E1 style={styles.E1} />

          <Text style={styles.T2}>Gợi ý món ăn</Text>
          <E2 style={styles.E2} />

          <Text style={styles.T3}>Mạng xã hội</Text>
          <E3 style={styles.E3} />
        </View>

        {/* Fade dưới */}
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.bottomFade}
        />

        {/* Dots */}
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        {/* Nút trái */}
        <Pressable
          style={[styles.muiten, { left: 24 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </Pressable>

        {/* Nút phải */}
        <Pressable style={[styles.muiten, { right: 24 }]}>
          <Ionicons name="arrow-forward" size={28} color="#fff" />
        </Pressable>
      </ImageBackground>
    </View>
  );
}
