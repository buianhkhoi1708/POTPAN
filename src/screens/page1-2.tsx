import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

// SVG giữ nguyên theo yêu cầu
import BgImage from "../../assets/images/banhmi.svg";
import Logo from "../../assets/images/Logo2-cropped.svg";
import AgImage from "../../assets/images/thit_kho.svg";

const { width: W, height: H } = Dimensions.get("window");
const TOP_H = Math.round(H * 0.5);
const BOT_H = H - TOP_H + 10;

import styles from "../styles/screens/page1-2.styles";

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Ảnh nền trên */}
      <View style={styles.topImage}>
        <BgImage width={W} height={TOP_H} preserveAspectRatio="xMidYMid slice" />
      </View>

      {/* Ảnh nền dưới */}
      <View style={styles.bottomImage}>
        <AgImage
          width={W}
          height={BOT_H - 10}
          preserveAspectRatio="xMidYMid slice"
        />
      </View>

      {/* Logo + text giữa */}
      <View style={styles.overlayCenter}>
        <View style={styles.logoContainer}>
          <Logo width={224} height={210} />
          <View style={styles.text}>
          <Text style={styles.title}>PotPan</Text>
          <Text style={styles.subtitle}>Món gì khó, có PotPan</Text>
          </View>
        </View>
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startText}>Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
