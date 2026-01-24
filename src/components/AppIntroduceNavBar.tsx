// Nhóm 9 - IE307.Q12
import React from "react";
import { StyleSheet, Pressable, View, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppLightColor } from "../styles/color";
import { RootStackParamList } from "../type/types";
import { useThemeStore } from "../store/useThemeStore";

interface AppIntroduceNavBarProp {
  NavScreen: keyof RootStackParamList;
  style?: StyleProp<ViewStyle>;
  activeIndex?: number;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AppIntroduceNavBar = ({
  NavScreen,
  style,
  activeIndex,
}: AppIntroduceNavBarProp) => {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDarkMode } = useThemeStore();
  const arrowBgColor = AppLightColor.primary_color; 
  const activeDotColor = theme.primary_text;
  const inactiveDotColor = isDarkMode ? "#555" : "#6f6e6eff";

  return (
    <View style={[styles.container, style]}>
      <Pressable
        style={[styles.muiten, { left: 24, backgroundColor: arrowBgColor }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={34} color="#fff" />
      </Pressable>

      <View style={styles.dots}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: inactiveDotColor }, 
              activeIndex === index && {
                ...styles.dotActive,
                backgroundColor: activeDotColor, 
              },
            ]}
          />
        ))}
      </View>

      <Pressable
        style={[styles.muiten, { right: 24, backgroundColor: arrowBgColor }]}
        onPress={() => navigation.navigate(NavScreen as any)}
      >
        <Ionicons name="arrow-forward" size={34} color="#fff" />
      </Pressable>
    </View>
  );
};

export default AppIntroduceNavBar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 90,
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
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,

  },
  muiten: {
    bottom: 36,
    width: 45,
    height: 45,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppLightColor.primary_color,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});