import React, { ReactNode } from "react";
import { StyleSheet, Text, TextProps, TextStyle, StyleProp } from "react-native";
import { AppFonts } from "../styles/fonts";

type AppTextVariant = "bold" | "medium" | "light" | "title"; // Có thể thêm 'title' nếu cần

// Kế thừa TextProps để dùng được numberOfLines, onPress,...
interface AppTextProps extends TextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>; // Dùng StyleProp để hỗ trợ array style
  variant?: AppTextVariant;
}

const AppText = ({ 
  children, 
  style, 
  variant = "light", // Mặc định là light nếu không truyền
  ...rest // Các props còn lại (numberOfLines,...)
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
    fontFamily: AppFonts.RobotoRegular, // Nên thêm font regular nếu có
    color: "#000",
  },
  // Bạn có thể thêm variant 'title' nếu muốn
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: AppFonts.RobotoBold,
    color: "#FF6B6B",
  }
});