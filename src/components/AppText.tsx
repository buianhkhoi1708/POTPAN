// Nhóm 9 - IE307.Q12
import React, { ReactNode } from "react";
import { StyleSheet, Text, TextProps, TextStyle, StyleProp } from "react-native";
import { AppFonts } from "../styles/fonts";

type AppTextVariant = "bold" | "medium" | "light" | "title"; 


interface AppTextProps extends TextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>; 
  variant?: AppTextVariant;
}

const AppText = ({ 
  children, 
  style, 
  variant = "light", 
  ...rest 
}: AppTextProps) => {
  return (
    <Text 
      style={[styles[variant], style]} 
      {...rest} 
    >
      {children}
    </Text>
  );
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
    fontFamily: AppFonts.RobotoRegular,
    color: "#000",
  },
 
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: AppFonts.RobotoBold,
    color: "#FF6B6B",
  }
});