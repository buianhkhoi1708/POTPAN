// src/screens/Introduce1.tsx
import { ImageBackground, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import AppText from "../components/AppText";
import AppSafeView from "../components/AppSafeView";
import { RootStackParamList } from "../navigations/AppStackNavigator";

type IntroduceNavProp = StackNavigationProp<RootStackParamList, "Introduce1">;

const Introduce1 = () => {
  const navigation = useNavigation<IntroduceNavProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Page2_2"); // dùng TÊN ROUTE, không dùng "Page2.2.tsx"
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
