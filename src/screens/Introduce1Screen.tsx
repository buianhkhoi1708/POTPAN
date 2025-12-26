// src/screens/Introduce1.tsx
import { ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next"; // 👈 Import i18n

import AppText from "../components/AppText";
import AppSafeView from "../components/AppSafeView";
import { AppLightColor } from "../styles/color";
import { AppFonts } from "../styles/fonts";
import AppIntroduceNavBar from "../components/AppIntroduceNavBar";
import Flag from "../assets/icons/flag.svg";

const Introduce1Screen = () => {
  const { t } = useTranslation(); // 👈 Khởi tạo hook

  return (
    <AppSafeView style={styles.safe}>
      <ImageBackground
        source={require("../assets/images/22bg.png")}
        style={styles.container}
      >
        <View style={styles.textContainer}>
          <View style={styles.text1Container}>
            {/* Tiêu đề */}
            <AppText variant="bold" style={styles.text}>
              {t("intro.step1.title")}
            </AppText>
            <Flag />
          </View>
          {/* Phụ đề */}
          <AppText variant="light" style={styles.text1}>
            {t("intro.step1.subtitle")}
          </AppText>
        </View>

        <AppIntroduceNavBar
          NavScreen="Introduce2Screen"
          style={styles.navBar}
          activeIndex={0}
        />
      </ImageBackground>
    </AppSafeView>
  );
};

export default Introduce1Screen;

const styles = StyleSheet.create({
  safe: {
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  textContainer: {
    marginTop: 12,
    marginRight: 28,
  },
  text1Container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  text: {
    fontSize: 26,
    fontFamily: AppFonts.RobotoSlabBold,
    color: AppLightColor.primary_color,
  },
  text1: {
    fontFamily: AppFonts.RobotoLightItalic,
    fontSize: 16,
  },
  navBar: {
    top: 760,
    position: "absolute",
  },
});