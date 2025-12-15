import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppText from "../components/AppText";
import AppSafeView from "../components/AppSafeView";

const Introduce1 = () => {
  return (
    <ImageBackground
      source={require("../assets/images/22bg.png")}
      style={styles.container}
    >
      <AppSafeView>
        <View>
          <AppText>Món ăn Việt Nam</AppText>
          <AppText>Món ăn chuẩn Việt, đậm đà bản sắc dân tộc</AppText>
        </View>
      </AppSafeView>
    </ImageBackground>
  );
};

export default Introduce1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
