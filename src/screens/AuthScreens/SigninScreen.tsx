import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// --- IMPORT THƯ VIỆN MỚI ---
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../utils/validationSchema"

import { useAuthStore } from "../../store/useAuthStore";
import AppSafeView from "../../components/AppSafeView";
import AppText from "../../components/AppText";
import AppTextInput from "../../components/AppTextInput";
import AppPasswordInput from "../../components/AppPasswordInput";
import AppButton from "../../components/AppButton";
import AppLogo from "../../components/AppLogo";
import { AppLightColor } from "../../styles/color";
import { AppFonts } from "../../styles/fonts";

const SigninScreen = () => {
  const navigation = useNavigation<any>();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  // --- SETUP FORM ---
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema), // Gắn luật Yup vào form
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Hàm này chỉ chạy khi dữ liệu ĐÃ HỢP LỆ
  const onSubmit = async (data: any) => {
    try {
      await register(data.email, data.password, data.fullName, data.phone);
      Alert.alert("Thành công", "Tạo tài khoản thành công!", [
        {
          text: "Đăng nhập",
          onPress: () => navigation.navigate("LoginScreen"),
        },
      ]);
    } catch (error: any) {
      // Xử lý lỗi Firebase (như cũ)
      Alert.alert("Lỗi", error.message);
    }
  };

  // Component phụ để hiển thị lỗi màu đỏ
  const ErrorMsg = ({ name }: { name: string }) => {
    // @ts-ignore
    const error = errors[name];
    if (!error) return null;
    return <Text style={styles.errorText}>{error.message}</Text>;
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            <AppLogo width={150} height={150} />
            <AppText variant="bold" style={styles.headerTitle}>
              ĐĂNG KÝ
            </AppText>

            <View style={styles.formContainer}>
              {/* --- HỌ TÊN (Dùng Controller để bọc Input) --- */}
              <View style={styles.inputWrapper}>
                <AppText variant="medium" style={styles.inputLabel}>
                  Họ tên
                </AppText>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                      style={styles.inputValue}
                      placeholder="Nguyễn Văn A"
                      onBlur={onBlur}
                      onChangeText={onChange} // Quan trọng: Nối hàm onChange của thư viện
                      value={value}
                      children={
                        <Ionicons
                          name="person-outline"
                          color="grey"
                          size={25}
                          style={styles.inputIcon}
                        />
                      }
                    />
                  )}
                />
                <ErrorMsg name="fullName" />
              </View>

              {/* --- EMAIL --- */}
              <View style={styles.inputWrapper}>
                <AppText style={[styles.inputLabel, styles.marginTop]}>
                  Email
                </AppText>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                      style={styles.inputValue}
                      placeholder="example@gmail.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      children={
                        <Ionicons
                          name="mail-outline"
                          color="grey"
                          size={25}
                          style={styles.inputIcon}
                        />
                      }
                    />
                  )}
                />
                <ErrorMsg name="email" />
              </View>

              {/* --- SĐT --- */}
              <View style={styles.inputWrapper}>
                <AppText style={[styles.inputLabel, styles.marginTop]}>
                  Số điện thoại
                </AppText>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                      style={styles.inputValue}
                      placeholder="09xx..."
                      keyboardType="phone-pad"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      children={
                        <Ionicons
                          name="call-outline"
                          color="grey"
                          size={25}
                          style={styles.inputIcon}
                        />
                      }
                    />
                  )}
                />
                <ErrorMsg name="phone" />
              </View>

              {/* --- MẬT KHẨU --- */}
              <View style={styles.inputWrapper}>
                <AppText style={[styles.inputLabel, styles.marginTop]}>
                  Mật khẩu
                </AppText>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppPasswordInput
                      style={styles.inputValue}
                      placeholder="•••••••••"
                      onChangeText={onChange}
                      value={value}
                      children={
                        <Ionicons
                          name="lock-closed-outline"
                          color="grey"
                          size={25}
                          style={styles.inputIcon}
                        />
                      }
                    />
                  )}
                />
                <ErrorMsg name="password" />
              </View>

              {/* --- XÁC NHẬN --- */}
              <View style={styles.inputWrapper}>
                <AppText style={[styles.inputLabel, styles.marginTop]}>
                  Xác nhận mật khẩu
                </AppText>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppPasswordInput
                      style={styles.inputValue}
                      placeholder="•••••••••"
                      onChangeText={onChange}
                      value={value}
                      children={
                        <Ionicons
                          name="shield-checkmark-outline"
                          color="grey"
                          size={25}
                          style={styles.inputIcon}
                        />
                      }
                    />
                  )}
                />
                <ErrorMsg name="confirmPassword" />
              </View>
            </View>

            {/* --- NÚT ĐĂNG KÝ (Gọi handleSubmit) --- */}
            {isLoading ? (
              <View
                style={[styles.registerButton, { backgroundColor: "#ccc" }]}
              >
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <AppButton
                butName="Đăng ký"
                style={styles.registerButton}
                style1={styles.registerButtonText}
                onPress={handleSubmit(onSubmit)} // Thư viện tự lo validation trước khi gọi onSubmit
              />
            )}

            {/* ... Footer code giữ nguyên ... */}
            <View style={styles.footerContainer}>
              {/* Copy footer từ code cũ qua */}
              <AppText variant="light" style={styles.footerText}>
                Đã có tài khoản?
                <Text
                  style={styles.loginLink}
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  {" "}
                  Đăng nhập
                </Text>
              </AppText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  // ... Các styles cũ giữ nguyên
  safeArea: { flex: 1, backgroundColor: AppLightColor.background },
  keyboardContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  mainContent: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 30,
    fontFamily: AppFonts.RobotoSlabBold,
  },
  formContainer: { width: "100%", marginBottom: 24 },
  inputWrapper: { width: "100%", paddingHorizontal: 0 },
  marginTop: { marginTop: 16 },
  inputLabel: {
    fontSize: 17,
    fontFamily: AppFonts.RobotoMedium,
    fontWeight: "600",
    marginBottom: 4,
  },
  inputValue: { fontSize: 16, fontWeight: "400", letterSpacing: 1 },
  inputIcon: { marginRight: 10 },
  registerButton: {
    marginTop: 10,
    alignSelf: "center",
    height: 50,
    borderRadius: 10,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 400,
  },
  registerButtonText: { color: "#ffffff", fontSize: 20, fontWeight: "800" },
  footerContainer: { marginTop: 24, alignItems: "center" },
  footerText: { fontSize: 16, fontFamily: AppFonts.RobotoMedium },
  loginLink: { color: AppLightColor.primary_color, fontWeight: "800" },

  // --- THÊM STYLE CHO LỖI ---
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: AppFonts.RobotoRegular, // hoặc font thường
  },
});
