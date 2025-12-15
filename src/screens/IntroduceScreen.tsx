import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import AppText from "../components/AppText";
import AppLogo from "../components/AppLogo";
import { AppLightColor } from "../styles/color";
import AppButton from "../components/AppButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../type/types";
import { AppFonts } from "../styles/fonts";

type NavigationProp = StackNavigationProp<RootStackParamList, 'Introduce1Screen'>

const IntroduceScreen = () => {
  const navigator = useNavigation<NavigationProp>();
  return (
    <ImageBackground
      source={require("../assets/images/Page21.png")}
      style={styles.container}
    >
      <View style={styles.container1}>
        <AppLogo height={200} width={200} />
        <AppText variant="bold" style={styles.text}>
          POTPAN
        </AppText>
        <AppText variant="medium" style={styles.text1}>
          Món gì khó, có POTPAN
        </AppText>
      </View>
      <View style = {styles.buttonContainer}>
         <AppButton
        butName="Đăng nhập"
        style={[styles.button, styles.button1]}
        style1={styles.buttext1}
        onPress={()=> {navigator.navigate('')}}
      />
      <AppButton
        butName="Bắt đầu"
        style={[styles.button, styles.button2]}
        style1={styles.buttext2}
        onPress={()=> {navigator.navigate('Introduce1Screen')}}
      />
      </View>
    </ImageBackground>
  );
};

export default IntroduceScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 900,
  },

  container1: {
    backgroundColor: "white",
    alignItems: "center",
    width: 300,
    height: 300,
    marginBottom: 40,
    borderRadius: "50%",
    position: "absolute",
  },

  text: {
    color: AppLightColor.primary_color,
    fontSize: 50,
    marginTop: -25,
    fontFamily: AppFonts.RobotoSlabBold
  },
  text1: {
    fontWeight: 500,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center'
  },
  button: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    height: "6%",
    marginBottom: 15,
    borderRadius: 12,
  },
  button1: {
    backgroundColor: "white",
    marginTop: 680,
  },
  button2: {
    backgroundColor: AppLightColor.primary_color,
  },
  buttext1: {
    fontWeight: 600,
    fontSize: 18,
    fontFamily: AppFonts.RobotoSlabBold
  },

  buttext2: {
    color: "white",
    fontWeight: 600,
    fontSize: 18,
    fontFamily: AppFonts.RobotoSlabBold
  },
});
