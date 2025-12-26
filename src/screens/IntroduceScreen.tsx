import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next"; // 👈 Import i18n

import AppText from "../components/AppText";
import AppLogo from "../components/AppLogo";
import { AppLightColor } from "../styles/color";
import AppButton from "../components/AppButton";
import { RootStackParamList } from "../type/types";
import { AppFonts } from "../styles/fonts";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const IntroduceScreen = () => {
  const navigator = useNavigation<NavigationProp>();
  const { t } = useTranslation(); // 👈 Khởi tạo hook dịch

  return (
    <ImageBackground
      source={require("../assets/images/Page21.png")}
      style={styles.container}
    >
      <View style={styles.container1}>
        <AppLogo height={200} width={200} />
        
        {/* Tên App thường giữ nguyên không dịch */}
        <AppText variant="bold" style={styles.text}>
          POTPAN
        </AppText>

        {/* Slogan */}
        <AppText variant="medium" style={styles.text1}>
          {t("welcome.slogan")}
        </AppText>
      </View>

      <View style={styles.buttonContainer}>
        {/* Nút Đăng nhập (Dùng lại key auth) */}
        <AppButton
          butName={t("auth.login_button")}
          style={[styles.button, styles.button1]}
          style1={styles.buttext1}
          onPress={() => {
            navigator.navigate("LoginScreen");
          }}
        />

        {/* Nút Bắt đầu */}
        <AppButton
          butName={t("welcome.get_started")}
          style={[styles.button, styles.button2]}
          style1={styles.buttext2}
          onPress={() => {
            navigator.navigate("Introduce1Screen");
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default IntroduceScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 900, // Lưu ý: height cố định có thể gây lỗi trên màn hình nhỏ, nên dùng flex: 1
  },

  container1: {
    backgroundColor: "white",
    alignItems: "center",
    width: 330,
    height: 330,
    marginBottom: 40,
    borderRadius: 170, // Sửa "50%" thành số cụ thể để tránh lỗi trên một số phiên bản RN cũ
    position: "absolute",
    justifyContent: 'center' // Căn giữa nội dung trong vòng tròn
  },

  text: {
    color: AppLightColor.primary_color,
    fontSize: 44,
    marginTop: -25,
    fontFamily: AppFonts.RobotoSlabBold,
  },
  text1: {
    fontWeight: "500", // Sửa thành string
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 10
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 50,
    alignItems: "center",
  },
  button: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    height: 50, // Đổi % thành pixel cho chiều cao nút ổn định hơn
    marginBottom: 15,
    borderRadius: 12,
  },
  button1: {
    backgroundColor: "white",
    marginTop: 680,
  },
  button2: {
    backgroundColor: AppLightColor.primary_color,
  },
  buttext1: {
    fontWeight: "600", // Sửa thành string
    fontSize: 20,
    fontFamily: AppFonts.RobotoSlabBold,
    color: AppLightColor.primary_color // Thêm màu chữ cho nút trắng
  },

  buttext2: {
    color: "white",
    fontWeight: "600", // Sửa thành string
    fontSize: 20,
    fontFamily: AppFonts.RobotoSlabBold,
  },
});