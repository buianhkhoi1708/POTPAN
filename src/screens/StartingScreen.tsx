// Nhóm 9 - IE307.Q12
import React from "react";
import { StyleSheet, View } from "react-native";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppLogo from "../components/AppLogo";
import { AppLightColor } from "../styles/color";

const StartingScreen = () => {
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
    flex: 1,
  },
  container1: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: AppLightColor.primary_text_constrast,
    fontSize: 50,
    fontWeight: "800",
    marginTop: 10,
  },
});
