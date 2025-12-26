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

// --- IMPORT I18N ---
import { useTranslation } from "react-i18next"; // <-- THÊM DÒNG NÀY

// --- IMPORT THƯ VIỆN & SCHEMA ---
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getLoginSchema } from "../../utils/validationSchema"; 

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
  const { t } = useTranslation(); // <-- KHỞI TẠO HOOK DỊCH

  // Lấy hàm login và trạng thái loading từ Zustand
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  // --- SETUP FORM ---
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getLoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // --- HÀM XỬ LÝ LOGIN ---
  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      console.log("Đăng nhập thành công");
      // App.tsx sẽ tự động chuyển màn hình khi biến 'user' thay đổi
    } catch (error: any) {
      // --- XỬ LÝ LỖI SUPABASE & DỊCH ---
      let msg = error.message || t("common.error_occurred");
      const errTitle = t("auth.errors.login_title");

      if (msg.includes("Invalid login credentials")) {
        msg = t("auth.errors.invalid_credentials");
      } else if (msg.includes("Email not confirmed")) {
        msg = t("auth.errors.email_not_confirmed");
      } else if (msg.includes("Too many requests")) {
         msg = t("auth.errors.too_many_requests");
      }

      Alert.alert(errTitle, msg);
    }
  };

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
              {t("auth.login_title")}
            </AppText>

            <View style={styles.formContainer}>
              {/* --- EMAIL --- */}
              <View style={styles.inputWrapper}>
                <AppText variant="medium" style={styles.inputLabel}>
                  {t("auth.email_label")}
                </AppText>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                      style={styles.inputValue}
                      placeholder={t("auth.email_placeholder")}
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
                  {t("auth.password_label")}
                </AppText>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppPasswordInput
                      style={styles.inputValue}
                      placeholder={t("auth.password_placeholder")}
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
                    Alert.alert(
                      t("common.notification"),
                      t("common.feature_developing")
                    );
                  }}
                >
                  <AppText style={styles.forgotPassword}>
                    {t("auth.forgot_password")}
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
                butName={t("auth.login_button")}
                style={styles.loginButton}
                style1={styles.loginButtonText}
                onPress={handleSubmit(onSubmit)}
              />
            )}

            <View style={styles.footerContainer}>
              <AppText variant="light" style={styles.footerText}>
                {t("auth.no_account")}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate("SigninScreen")}
                >
                  {t("auth.signup_link")}
                </Text>
              </AppText>

              <AppText variant="light" style={styles.orText}>
                {t("auth.or_social")}
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

// --- STYLES GIỮ NGUYÊN ---
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