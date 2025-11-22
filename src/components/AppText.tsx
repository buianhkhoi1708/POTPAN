import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppFonts } from "../styles/fonts";

type AppTextVariant = "bold" | "medium" | "light";

interface AppTextProps {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
  variant?: AppTextVariant;
}

const AppText = ({ children, style, variant, ...rest }: AppTextProps) => {
  return <Text style={[styles[variant], style]}>{children}</Text>;
};

export default AppText;

const styles = StyleSheet.create({
  bold: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: AppFonts.RobotoBold,
    color: "#000",
  },
  medium: {
    fontSize: 18,
    fontFamily: AppFonts.RobotoMedium,
    color: "#000",
  },
  light: {
    fontSize: 16,
    fontFamily: AppFonts.RobotoLight,
    color: "#000",
  },
});
