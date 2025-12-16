import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppLogo from "../components/AppLogo";
import { AppLightColor } from "../styles/color";
import { RootStackParamList } from "../type/types";

type NavigationProp = StackNavigationProp<RootStackParamList, "IntroduceScreen">;

const StartingScreen = () => {
  const navigator = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigator.navigate("IntroduceScreen");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigator]);

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
