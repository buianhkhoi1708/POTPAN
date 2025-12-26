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

// --- IMPORT I18N ---
import { useTranslation } from "react-i18next";

// --- IMPORT THƯ VIỆN & SCHEMA ---
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getRegisterSchema } from "../../utils/validationSchema"

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
  const { t } = useTranslation(); // Khởi tạo hook dịch
  
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  // --- SETUP FORM ---
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getRegisterSchema(t)),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // --- HÀM XỬ LÝ ĐĂNG KÝ ---
  const onSubmit = async (data: any) => {
    try {
      await register(data.email, data.password, data.fullName, data.phone);
      
      // Thông báo thành công
      Alert.alert(
        t("auth.register_success_title"), 
        t("auth.register_success_msg"), 
        [
          {
            text: t("auth.login_button"),
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ]
      );
    } catch (error: any) {
      // --- XỬ LÝ LỖI SUPABASE ---
      let msg = error.message || t("auth.errors.unknown");
      const errTitle = t("auth.errors.register_title");

      // Map lỗi Supabase sang ngôn ngữ user chọn
      if (msg.includes("User already registered")) {
        msg = t("auth.errors.user_already_exists");
      } else if (msg.includes("Password should be at least")) {
        msg = t("auth.errors.weak_password");
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
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            <AppLogo width={150} height={150} />
            <AppText variant="bold" style={styles.headerTitle}>
              {t("auth.register_title")}
            </AppText>

            <View style={styles.formContainer}>
              {/* --- HỌ TÊN --- */}
              <View style={styles.inputWrapper}>
                <AppText variant="medium" style={styles.inputLabel}>
                  {t("auth.fullname_label")}
                </AppText>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                      style={styles.inputValue}
                      placeholder={t("auth.fullname_placeholder")}
                      onBlur={onBlur}
                      onChangeText={onChange}
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

              {/* --- SĐT --- */}
              <View style={styles.inputWrapper}>
                <AppText style={[styles.inputLabel, styles.marginTop]}>
                  {t("auth.phone_label")}
                </AppText>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                      style={styles.inputValue}
                      placeholder={t("auth.phone_placeholder")}
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
                  {t("auth.password_label")}
                </AppText>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppPasswordInput
                      style={styles.inputValue}
                      placeholder={t("auth.password_placeholder")}
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
                  {t("auth.confirm_password_label")}
                </AppText>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppPasswordInput
                      style={styles.inputValue}
                      placeholder={t("auth.password_placeholder")}
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

            {/* --- NÚT ĐĂNG KÝ --- */}
            {isLoading ? (
              <View
                style={[styles.registerButton, { backgroundColor: "#ccc" }]}
              >
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <AppButton
                butName={t("auth.register_button")}
                style={styles.registerButton}
                style1={styles.registerButtonText}
                onPress={handleSubmit(onSubmit)}
              />
            )}

            <View style={styles.footerContainer}>
              <AppText variant="light" style={styles.footerText}>
                {t("auth.has_account")}
                <Text
                  style={styles.loginLink}
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  {t("auth.login_link")}
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: AppFonts.RobotoRegular,
  },
});