// src/screens/Introduce1.tsx
import { ImageBackground, StyleSheet, View, Image } from "react-native";
import React, { useEffect } from "react";
import AppText from "../components/AppText";
import AppSafeView from "../components/AppSafeView";
import { RootStackParamList } from "../type/types";
import { AppLightColor } from "../styles/color";
import { AppFonts } from "../styles/fonts";
import AppIntroduceNavBar from "../components/AppIntroduceNavBar";
import Flag from "../assets/icons/flag.svg";

const Introduce3Screen = () => {
  return (
    <AppSafeView style = {styles.safe}>
      <ImageBackground
        source={require("../assets/images/intro3Bg.png")}
        style={styles.container}
      >
        <View style={styles.textContainer}>
          <View style={styles.text1Container}>
            <AppText variant="bold" style={styles.text}>
              Các tính năng chính
            </AppText>
          </View>
          <AppText variant="light" style={styles.text1}>
            Cung cấp cho người dùng trải nghiệm tuyệt vời
          </AppText>
          <View style={styles.text2Container}>
            <View style={styles.textDisCon}>
              <AppText variant="bold" style={styles.textDis}>
                Tìm kiếm công thức
              </AppText>
            </View>
            <View style={styles.textDisCon}>
              <AppText variant="bold" style={styles.textDis}>
                Gợi ý món ăn
              </AppText>
            </View>
            <View style={styles.textDisCon}>
              <AppText variant="bold" style={styles.textDis}>
                Mạng xã hội
              </AppText>
            </View>
          </View>
        </View>
        <AppIntroduceNavBar
          NavScreen="Introduce4Screen"
          style={styles.navBar}
          activeIndex={2}
        />
      </ImageBackground>
    </AppSafeView>
  );
};

export default Introduce3Screen;

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
    marginLeft: 20,
  },
  text2Container: {
    top: 150,
    gap: 50,
    width: "100%",
    right: 10,
  },
  textDisCon: {
    width: 350,
    borderColor: AppLightColor.background,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: AppLightColor.introDis,
    height: 80,
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
  textDis: {
    color: AppLightColor.primary_text_constrast,
    fontSize: 32,
  },
});
