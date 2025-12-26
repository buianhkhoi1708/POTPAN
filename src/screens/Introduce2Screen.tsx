// src/screens/Introduce2.tsx
import { ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next"; // 👈 Import i18n

import AppText from "../components/AppText";
import AppSafeView from "../components/AppSafeView";
import { AppLightColor } from "../styles/color";
import { AppFonts } from "../styles/fonts";
import AppIntroduceNavBar from "../components/AppIntroduceNavBar";

const Introduce2Screen = () => {
  const { t } = useTranslation(); // 👈 Khởi tạo hook

  return (
    <AppSafeView style={styles.safe}>
      <ImageBackground
        source={require("../assets/images/bgIntro2.png")}
        style={styles.container}
      >
        <View style={styles.textContainer}>
          <View style={styles.text1Container}>
            {/* Tiêu đề */}
            <AppText variant="bold" style={styles.text}>
              {t("intro.step2.title")}
            </AppText>
          </View>
          {/* Phụ đề */}
          <AppText variant="light" style={styles.text1}>
            {t("intro.step2.subtitle")}
          </AppText>
        </View>
        
        <AppIntroduceNavBar
          NavScreen="Introduce3Screen"
          style={styles.navBar}
          activeIndex={1}
        />
      </ImageBackground>
    </AppSafeView>
  );
};

export default Introduce2Screen;

const styles = StyleSheet.create({
  safe: {
    backgroundColor: AppLightColor.background,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  textContainer: {
    marginTop: 12,
    marginRight: 120,
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