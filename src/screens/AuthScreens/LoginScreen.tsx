import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import AppSafeView from "../../components/AppSafeView";
import AppText from "../../components/AppText";
import AppTextInput from "../../components/AppTextInput";     
import AppPasswordInput from "../../components/AppPasswordInput";
import { auth } from "../../config/firebaseConfig";
import { AppLightColor } from "../../styles/color";
import { AppFonts } from "../../styles/fonts";
import AppButton from "../../components/AppButton";


const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập Email và Mật khẩu.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Đăng nhập thành công:", userCredential.user.uid);
      navigation.navigate("Page3-1b", { name: userCredential.user.email });
    } catch (error: any) {
      console.log(error.code);
      let msg = "Có lỗi xảy ra: " + error.message;
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        msg = "Email hoặc mật khẩu không chính xác.";
      } else if (error.code === "auth/invalid-email") {
        msg = "Định dạng email không hợp lệ.";
      }
      Alert.alert("Lỗi đăng nhập", msg);
    }
  };

  return (
    <AppSafeView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.select({ ios: "padding" })}
      >
        <View style={styles.container}>
          <AppText variant="bold" style={styles.title}>ĐĂNG NHẬP</AppText>

          <View style={styles.form}>
            <AppText variant="medium" style={styles.label}>Tên đăng nhập</AppText>
            
            {/* Sử dụng Component Input đã tách */}
            <AppTextInput
              style={styles.textHolder}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <AppText style={[styles.label, { marginTop: 22 }]}>Mật khẩu</AppText>
           
            <AppPasswordInput
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <AppButton butName="Đăng nhập" style = {styles.primaryBtn} style1 = {styles.primaryText} onPress={onLogin}/>

          <View style={styles.bottomBlock}>
            <Text style={styles.bottomLink}>Quên mật khẩu?</Text>

            <Text style={styles.bottomText}>
              Chưa có tài khoản?
              <Text
                style={styles.link}
                onPress={() => navigation.navigate("Register")}
                suppressHighlighting
              >
                {" "}Đăng ký
              </Text>
            </Text>

            {/* --- Phần Social Block giữ nguyên tại đây --- */}
            <Text style={styles.bottomTextSmall}>Hoặc đăng ký với</Text>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-facebook" size={20} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-instagram" size={20} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="paper-plane-outline" size={20} color="#111827"/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safe: {
    backgroundColor: AppLightColor.background
  },
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    justifyContent: 'center'
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 40,
    fontFamily: AppFonts.RobotoSlabBold,
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 20,
    fontFamily: AppFonts.RobotoSlabMedium,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 20,
  },
  textHolder: {
    fontSize: 16,
    fontWeight: "500",
  },
  primaryBtn: {
    marginTop: 8,
    alignSelf: "center",
    height: 52,
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 80,
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  bottomBlock: {
    marginTop: 24,
    alignItems: "center",
  },
  bottomLink: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 6,
  },
  bottomText: {
    color: "#111827",
    fontSize: 16,
  },
  link: {
    color: "#0040C0",
    fontWeight: "800",
  },
  // --- Style cho Social Block ---
  bottomTextSmall: {
    marginTop: 18,
    fontSize: 14,
    color: "#6B7280",
  },
  socialRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
    columnGap: 20,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});