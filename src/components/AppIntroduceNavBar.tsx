import { StyleSheet, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { AppLightColor } from "../styles/color";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../type/types";

interface AppIntroduceNavBar {
    NavScreen: keyof RootStackParamList;
    style?: NavStyle | NavStyle[];
    activeIndex?: number;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AppIntroduceNavBar = ({NavScreen, style, activeIndex} : AppIntroduceNavBar) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style = {[styles.container, style]}>
     
      <Pressable
        style={[styles.muiten, { left: 24 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={34} color="#fff" />
      </Pressable>

       <View style={styles.dots}>
        <View style={[styles.dot, activeIndex === 0 && styles.dotActive]} />
        <View style={[styles.dot, activeIndex === 1 && styles.dotActive]} />
        <View style={[styles.dot, activeIndex === 2 && styles.dotActive]} />
        <View style={[styles.dot, activeIndex === 3 && styles.dotActive]} />
      </View>

      <Pressable style={[styles.muiten, { right: 24 }]} onPress={() => navigation.navigate(NavScreen)}>
        <Ionicons name="arrow-forward" size={34} color="#fff" />
      </Pressable>
    </View>
  );
};

export default AppIntroduceNavBar;

const styles = StyleSheet.create({
container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 90
},
  dots: {
    flexDirection: "row",
    gap: 30,
    bottom: 15,
  },
   dotActive: {
    opacity: 1,
    width: 9,
    height: 9,
    backgroundColor: "#000000",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#6f6e6eff",
  },
  muiten: {
    bottom: 36,
    width: 45,
    height: 45,
    borderRadius: 52,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppLightColor.primary_color,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
