// src/screens/Introduce1.tsx
import { ImageBackground, StyleSheet, View, Image } from "react-native";
import React, { useEffect } from "react";
import AppText from "../components/AppText";
import AppSafeView from "../components/AppSafeView";
import { RootStackParamList } from "../type/types";
import { AppLightColor } from "../styles/color";
import { AppFonts } from "../styles/fonts";
import AppIntroduceNavBar from "../components/AppIntroduceNavBar";
import Flag from "../assets/icons/flag.svg"

const Introduce1Screen = () => {


  return (
    <ImageBackground
      source={require("../assets/images/22bg.png")}
      style={styles.container}
    >
      <AppSafeView>
        <View style = {styles.textContainer}>
          <View style = {styles.text1Container}>
          <AppText variant="bold" style = {styles.text}>Món ăn Việt Nam</AppText>
          <Flag/>
          </View>
          <AppText variant = "light" style = {styles.text1}>Món ăn chuẩn Việt, đậm đà bản sắc dân tộc</AppText>
        </View>
        <AppIntroduceNavBar NavScreen="Introduce2Screen" style = {styles.navBar} activeIndex={0}/>
      </AppSafeView>
    </ImageBackground>
  );
};

export default Introduce1Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  textContainer: {
    marginTop: 12,
    marginLeft: 35,
  },
  text1Container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  text: {
    fontSize: 24,
    fontFamily: AppFonts.RobotoSlabBold,
    color: AppLightColor.primary_color
  },
  text1: {
    fontFamily: AppFonts.RobotoLightItalic,
    fontSize: 16,
  },
  navBar: {
    top: 680
  },
});
