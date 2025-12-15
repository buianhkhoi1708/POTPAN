import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { AppLightColor } from "../styles/color";
import AppLogo from "../components/AppLogo";
import { useNavigation } from "@react-navigation/native";

const StartingScreen = () => {
  const navigator = useNavigation();

  const timer = setTimeout(() => {navigator.navigate('Page2')}, 1000)
  return (
    <AppSafeView style={styles.container}>
      <View style={styles.container1}>
        <AppLogo width={200} height={200} />
        <AppText variant="bold" style={styles.text}>
          POTPAN
        </AppText>
      </View>
    </AppSafeView>
  );
};

export default StartingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppLightColor.primary_color,
    justifyContent: "center",
    alignItems: "center",
  },
  container1: {
    marginBottom: 20,
    width: '100%'
  },
  text: {
    color: "white",
    fontSize: 50,
    fontWeight: 800,
    marginTop: 10,
  },
});
