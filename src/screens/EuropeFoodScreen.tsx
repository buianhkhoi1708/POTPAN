// src/screens/EuropeFoodScreen.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

import EuropeFoodImage from "./MIY.svg"; // SVG của món Âu
import styles from "../styles/EuropeFoodScreen.styles";

const EuropeFoodScreen = () => {
  return (
    <View style={styles.screen}>
      {/* status bar giả lập (MobiFone + icon) */}
      <View style={styles.statusBar}>
        <Text style={styles.carrier}>MobiFone</Text>
        <View style={styles.statusIcons}>
          <Ionicons name="cellular" size={14} color="#000" />
          <Ionicons name="wifi" size={14} color="#000" />
          <Ionicons name="battery-full" size={16} color="#000" />
        </View>
      </View>

      {/* khung card bo tròn như mockup */}
      <View style={styles.phone}>
        {/* thay ImageBackground bằng SVG + overlay */}
        <View style={styles.image}>
          {/* SVG full màn hình trong khung phone */}
          <EuropeFoodImage
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          {/* gradient trắng phía trên */}
          <LinearGradient
            colors={["#ffffff", "rgba(255,255,255,0)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.45 }}
            style={styles.topGradient}
          />

          {/* gradient trắng phía dưới */}
          <LinearGradient
            colors={["rgba(255,255,255,0)", "#ffffff"]}
            start={{ x: 0.5, y: 0.4 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.bottomGradient}
          />

          {/* tiêu đề và mô tả */}
          <View style={styles.textWrapper}>
            <Text style={styles.title}>Món Ăn Châu Âu</Text>
            <Text style={styles.subtitle}>
              Tinh hoa văn hoá phương tây, sang trọng quý phái
            </Text>
          </View>

          {/* nút chuyển slide + dots */}
          <View style={styles.bottomControls}>
            <Pressable style={styles.arrowButton}>
              <Ionicons name="arrow-back" size={22} color="#ffffff" />
            </Pressable>

            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotInactive]} />
              <View style={[styles.dot, styles.dotActive]} />
              <View style={[styles.dot, styles.dotInactive]} />
              <View style={[styles.dot, styles.dotInactive]} />
            </View>

            <Pressable style={styles.arrowButton}>
              <Ionicons name="arrow-forward" size={22} color="#ffffff" />
            </Pressable>
          </View>

          {/* home indicator */}
          <View style={styles.homeIndicatorWrapper}>
            <View style={styles.homeIndicator} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default EuropeFoodScreen;
