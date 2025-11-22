import React from "react";
import { StyleSheet, View } from "react-native";

// chỉnh lại path cho đúng vị trí file svg của bạn
import LogoIcon from "../assets/images/Logo.svg"; // hoặc "../assets/images/logo.svg"

const AppLogo = () => {
  return (
    <View style={styles.wrapper}>
      <LogoIcon width={160} height={160} />
    </View>
  );
};

export default AppLogo;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
