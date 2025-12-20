// src/components/AppText.tsx
import React, { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
  type StyleProp,
} from "react-native";
import { AppFonts } from "../styles/fonts";

type AppTextVariant = "bold" | "medium" | "light" | "title" | "subtitle";

interface AppTextProps extends TextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: AppTextVariant;
}

const AppText = ({ children, style, variant = "medium", ...rest }: AppTextProps) => {
  return (
    <Text {...rest} style={[styles[variant], style]}>
      {children}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  // dùng cho heading lớn: "Xin chào Khôi !"
  bold: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: AppFonts.RobotoBold,
    color: "#000",
  },

  // body text chung
  medium: {
    fontSize: 16,
    fontFamily: AppFonts.RobotoMedium,
    color: "#000",
  },

  light: {
    fontSize: 14,
    fontFamily: AppFonts.RobotoLight,
    color: "#000",
  },

  // tiêu đề & danh mục: cùng độ đậm, khác size
  // "Công thức nấu ăn nổi bật"
  title: {
    fontSize: 20,
    fontFamily: AppFonts.RobotoBold,
    fontWeight: "bold",
    color: "#000",
  },
  // các danh mục: "Cơm gia đình", "Đặc sản Việt", ...
  subtitle: {
    fontSize: 18,
    fontFamily: AppFonts.RobotoBold,
    fontWeight: "bold",
    color: "#000",
  },
});
