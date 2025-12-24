import { Ionicons } from "@expo/vector-icons";
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
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// --- IMPORT THƯ VIỆN & SCHEMA ---
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/validationSchema"; 

// --- STORE & COMPONENTS ---
import { useAuthStore } from "../../store/useAuthStore";
import AppSafeView from "../../components/AppSafeView";
import AppText from "../../components/AppText";
import AppTextInput from "../../components/AppTextInput";
import AppPasswordInput from "../../components/AppPasswordInput";
import { AppLightColor } from "../../styles/color";
import { AppFonts } from "../../styles/fonts";
import AppButton from "../../components/AppButton";
import AppLogo from "../../components/AppLogo";

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  // Lấy hàm login và trạng thái loading từ Zustand (Store Supabase mới)
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  // --- SETUP FORM (Giữ nguyên) ---
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // --- HÀM XỬ LÝ LOGIN (ĐÃ SỬA LOGIC CHO SUPABASE) ---
  const onSubmit = async (data: any) => {
    try {
      // Gọi hàm login từ Store
      await login(data.email, data.password);

      console.log("Đăng nhập thành công");
      // QUAN TRỌNG: Tui đã bỏ dòng navigation.navigate("HomeScreen")
      // Lý do: App.tsx đang lắng nghe biến 'user', nó sẽ tự chuyển màn hình ngay lập tức.
      // Nếu navigate thủ công ở đây sẽ dễ bị lỗi hoặc warning.

    } catch (error: any) {
      // --- XỬ LÝ LỖI SUPABASE ---
      // Supabase trả về error.message chứ không trả code như Firebase
      let msg = error.message || "Có lỗi xảy ra, vui lòng thử lại.";

      // Map lỗi tiếng Anh của Supabase sang tiếng Việt
      if (msg.includes("Invalid login credentials")) {
        msg = "Email hoặc mật khẩu không chính xác.";
      } else if (msg.includes("Email not confirmed")) {
        msg = "Vui lòng xác thực email trước khi đăng nhập.";
      } else if (msg.includes("Too many requests")) {
         msg = "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau ít phút.";
      }

      Alert.alert("Lỗi đăng nhập", msg);
    }
  };

  // Component hiển thị lỗi (Giữ nguyên)
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainContent}>
            <AppLogo width={224} height={221} />

            <AppText variant="bold" style={styles.headerTitle}>
              ĐĂNG NHẬP
            </AppText>

            <View style={styles.formContainer}>
              {/* --- EMAIL --- */}
              <View style={styles.inputWrapper}>
                <AppText variant="medium" style={styles.inputLabel}>
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

              {/* --- MẬT KHẨU --- */}
              <View style={styles.inputWrapper}>
                <AppText style={[styles.inputLabel, { marginTop: 22 }]}>
                  Mật khẩu
                </AppText>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppPasswordInput
                      style={styles.inputValue}
                      placeholder="Vd: 12345"
                      onBlur={onBlur}
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

                <TouchableOpacity
                  onPress={() => {
                    /* Xử lý quên mật khẩu */
                    Alert.alert("Thông báo", "Chức năng đang phát triển");
                  }}
                >
                  <AppText style={styles.forgotPassword}>
                    Quên mật khẩu?
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            {/* --- BUTTON ĐĂNG NHẬP --- */}
            {isLoading ? (
              <View style={[styles.loginButton, { backgroundColor: "#ccc" }]}>
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <AppButton
                butName="Đăng nhập"
                style={styles.loginButton}
                style1={styles.loginButtonText}
                onPress={handleSubmit(onSubmit)}
              />
            )}

            <View style={styles.footerContainer}>
              <AppText variant="light" style={styles.footerText}>
                Chưa có tài khoản?
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate("SigninScreen")}
                >
                  {" "}
                  Đăng ký
                </Text>
              </AppText>

              <AppText variant="light" style={styles.orText}>
                Hoặc đăng ký với
              </AppText>

              <View style={styles.socialContainer}>
                <Pressable style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={20} color="#111827" />
                </Pressable>
                <Pressable style={styles.socialButton}>
                  <Ionicons name="logo-instagram" size={20} color="#111827" />
                </Pressable>
                <Pressable style={styles.socialButton}>
                  <Ionicons
                    name="paper-plane-outline"
                    size={20}
                    color="#111827"
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default LoginScreen;

// --- GIỮ NGUYÊN TOÀN BỘ STYLES CỦA BẠN (KHÔNG SỬA GÌ) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppLightColor.background },
  keyboardContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  mainContent: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 30,
    alignItems: "center",
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 30,
    fontFamily: AppFonts.RobotoSlabBold,
  },
  formContainer: { width: "100%", marginBottom: 32 },
  inputWrapper: { width: "100%", paddingHorizontal: 0 },
  inputLabel: {
    fontSize: 17,
    fontFamily: AppFonts.RobotoMedium,
    fontWeight: "600",
    marginBottom: 4,
  },
  inputValue: { fontSize: 16, fontWeight: "400", letterSpacing: 1 },
  inputIcon: { marginRight: 10 },
  forgotPassword: {
    marginTop: 8,
    textAlign: "right",
    fontFamily: AppFonts.RobotoRegular,
    color: "#484BFF",
    fontSize: 14,
  },
  loginButton: {
    marginTop: 0,
    alignSelf: "center",
    height: 50,
    borderRadius: 10,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 400,
  },
  loginButtonText: { color: "#ffffff", fontSize: 20, fontWeight: "800" },
  footerContainer: { marginTop: 24, alignItems: "center" },
  footerText: { fontSize: 16, fontFamily: AppFonts.RobotoMedium },
  signupLink: { color: AppLightColor.primary_color, fontWeight: "800" },
  orText: { marginTop: 18, fontSize: 14, color: "#6B7280" },
  socialContainer: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
    columnGap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppLightColor.background,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: AppFonts.RobotoRegular,
  },
});