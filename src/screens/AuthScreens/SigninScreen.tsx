// Nhóm 9 - IE307.Q12
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Imports
import { getRegisterSchema } from "../../utils/validationSchema";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import { AppFonts } from "../../styles/fonts";

// Components
import AppSafeView from "../../components/AppSafeView";
import AppText from "../../components/AppText";
import AppTextInput from "../../components/AppTextInput";
import AppPasswordInput from "../../components/AppPasswordInput";
import AppButton from "../../components/AppButton";
import AppLogo from "../../components/AppLogo";

const SigninScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

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

  const onSubmit = async (data: any) => {
    try {
      await register(data.email, data.password, data.fullName, data.phone);

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
      let msg = error.message || t("auth.errors.unknown");
      const errTitle = t("auth.errors.register_title");
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
    <AppSafeView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >

          <View style={[styles.mainContent, { backgroundColor: theme.background }]}>
            <AppLogo width={185} height={185} />

            <AppText variant="bold" style={[styles.headerTitle, { color: theme.primary_text }]}>
              {t("auth.register_title")}
            </AppText>

            <View style={styles.formContainer}>
              {/* Họ tên */}
              <View style={styles.inputWrapper}>
                <AppText variant="medium" style={[styles.inputLabel, { color: theme.primary_text }]}>
                  {t("auth.fullname_label")}
                </AppText>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
        
                      style={[
                        styles.inputValue, 
                        { backgroundColor: theme.background_contrast, color: theme.primary_text }
                      ]}
                      placeholder={t("auth.fullname_placeholder")}
                      placeholderTextColor={theme.placeholder_text} 
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      children={
                        <Ionicons
                          name="person-outline"
                          color={theme.icon} 
                          size={25}
                          style={styles.inputIcon}
                        />
                      }
                    />
                  )}
                />
                <ErrorMsg name="fullName" />
              </View>

              {/* Email */}
              <View style={styles.inputWrapper}>
                <AppText style={[styles.inputLabel, styles.marginTop, { color: theme.primary_text }]}>
                  {t("auth.email_label")}
                </AppText>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                      style={[
                        styles.inputValue, 
                        { backgroundColor: theme.background_contrast, color: theme.primary_text }
                      ]}
                      placeholder={t("auth.email_placeholder")}
                      placeholderTextColor={theme.placeholder_text}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      children={
                        <Ionicons
                          name="mail-outline"
                          color={theme.icon}
                          size={25}
                          style={styles.inputIcon}
                        />
                      }
                    />
                  )}
                />
                <ErrorMsg name="email" />
              </View>

              {/* Mật khẩu */}
              <View style={styles.inputWrapper}>
                <AppText style={[styles.inputLabel, styles.marginTop, { color: theme.primary_text }]}>
                  {t("auth.password_label")}
                </AppText>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppPasswordInput
                      style={[
                        styles.inputValue, 
                        { backgroundColor: theme.background_contrast, color: theme.primary_text }
                      ]}
                      placeholder={t("auth.password_placeholder")}
                      placeholderTextColor={theme.placeholder_text}
                      onChangeText={onChange}
                      value={value}
                      children={
                        <Ionicons
                          name="lock-closed-outline"
                          color={theme.icon}
                          size={25}
                          style={styles.inputIcon}
                        />
                      }
                    />
                  )}
                />
                <ErrorMsg name="password" />
              </View>

              {/* Xác nhận */}
              <View style={styles.inputWrapper}>
                <AppText style={[styles.inputLabel, styles.marginTop, { color: theme.primary_text }]}>
                  {t("auth.confirm_password_label")}
                </AppText>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppPasswordInput
                      style={[
                        styles.inputValue, 
                        { backgroundColor: theme.background_contrast, color: theme.primary_text }
                      ]}
                      placeholder={t("auth.password_placeholder")}
                      placeholderTextColor={theme.placeholder_text}
                      onChangeText={onChange}
                      value={value}
                      children={
                        <Ionicons
                          name="shield-checkmark-outline"
                          color={theme.icon}
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

            {/* Nút đăng ký */}
            {isLoading ? (
              <View
                style={[styles.registerButton, { backgroundColor: "#ccc" }]}
              >
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <AppButton
                butName={t("auth.register_button")}
                style={[styles.registerButton, { backgroundColor: theme.primary_color }]}
                style1={styles.registerButtonText}
                onPress={handleSubmit(onSubmit)}
              />
            )}

            <View style={styles.footerContainer}>
              <AppText variant="light" style={[styles.footerText, { color: theme.primary_text }]}>
                {t("auth.has_account")}
                <Text
                  style={[styles.loginLink, { color: theme.primary_color }]}
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
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 30,
    fontFamily: AppFonts.RobotoSlabBold,
  },
  formContainer: {
    width: "100%",
    marginBottom: 24,
  },
  inputWrapper: {
    width: "100%",
    paddingHorizontal: 0,
  },
  marginTop: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontFamily: AppFonts.RobotoMedium,
    fontWeight: "600",
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 1,
    borderRadius: 8, 
    paddingHorizontal: 12, 
    height: 'auto',
    width: 280,
  },
  inputIcon: {
    marginLeft: 6,
    marginRight: 3,
  },
  registerButton: {
    marginTop: 10,
    alignSelf: "center",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 343,
    maxWidth: 600,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  footerContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontFamily: AppFonts.RobotoMedium,
  },
  loginLink: {
    fontWeight: "800",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: AppFonts.RobotoRegular,
  },
});