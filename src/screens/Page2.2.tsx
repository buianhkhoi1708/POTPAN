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
import styles from "../styles/Page2.2";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const ima = (route.params as any)?.ima as string | undefined;
  const urlFromParam =
    typeof ima === "string" && ima.length > 0 ? decodeURIComponent(ima) : undefined;

  const bgSource: ImageSourcePropType = urlFromParam
    ? { uri: urlFromParam }
    : require("../assets/images/page2_2.png"); // <-- dùng PNG

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={bgSource}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.bgImage}
      >
        <LinearGradient
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
          locations={[0.25, 0.95]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.topFade}
        />

        <Text style={styles.title}>Món Ăn Châu Âu</Text>
        <Text style={styles.subtitle}>Tinh hoa văn hoá phương tây, sang trọng quý phái </Text>
        <LinearGradient
          colors={["rgba(255, 105, 56, 0)", "rgba(255,255,255,1)"]}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.bottomFade}
        />

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Pressable
          style={[styles.muiten, { left: 24 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </Pressable>

        <Pressable style={[styles.muiten, { right: 24 }]}>
          <Ionicons name="arrow-forward" size={28} color="#fff" />
        </Pressable>
      </ImageBackground>
    </View>
  );
}