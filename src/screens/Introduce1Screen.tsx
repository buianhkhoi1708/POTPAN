// src/screens/Introduce1.tsx
import { ImageBackground, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import AppText from "../components/AppText";
import AppSafeView from "../components/AppSafeView";
import { RootStackParamList } from "../type/types";
import { AppLightColor } from "../styles/color";


type NavigationProp = StackNavigationProp<RootStackParamList, "Introduce2Screen">;

const Introduce1Screen = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Introduce2Screen"); // dùng TÊN ROUTE, không dùng "Page2.2.tsx"
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../assets/images/22bg.png")}
      style={styles.container}
    >
      <AppSafeView>
        <View>
          <AppText variant="bold" style = {styles.text}>Món ăn Việt Nam</AppText>
          <AppText variant = "light" style = {styles.text1}>Món ăn chuẩn Việt, đậm đà bản sắc dân tộc</AppText>
        </View>
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
  text: {
    fontSize: 30,
    fontFamily: 'RobotoSlab',
    color: AppLightColor.primary_color
  },
  text1: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
