// Nhóm 9 - IE307.Q12
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
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Linking from "expo-linking";
import { supabase } from "../../config/supabaseClient";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import { AppFonts } from "../../styles/fonts";
import AppSafeView from "../../components/AppSafeView";
import AppText from "../../components/AppText";
import AppTextInput from "../../components/AppTextInput";
import AppPasswordInput from "../../components/AppPasswordInput";
import AppButton from "../../components/AppButton";
import AppLogo from "../../components/AppLogo";
import { getLoginSchema } from "../../utils/validationSchema";

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getLoginSchema(t)),
    defaultValues: { email: "", password: "" },
  });

  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = "potpan://google-auth";

      console.log("🔗 Link Google cứng:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      if (data?.url) await Linking.openURL(data.url);
    } catch (error: any) {
      Alert.alert("Lỗi Google", error.message);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const ErrorMsg = ({ name }: { name: string }) => {
    // @ts-ignore
    const error = errors[name];
    if (!error) return null;
    return <Text style={styles.errorText}>{error.message}</Text>;
  };

  const socialButtons = [
    { icon: "logo-google", onPress: handleGoogleLogin },
    {
      icon: "logo-facebook",
      onPress: () => Alert.alert("Thông báo", "Tính năng đang phát triển"),
    },
    {
      icon: "logo-apple",
      onPress: () => Alert.alert("Thông báo", "Tính năng đang phát triển"),
    },
  ];

  return (
    <AppSafeView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
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
          <View
            style={[styles.mainContent, { backgroundColor: theme.background }]}
          >
            <AppLogo width={224} height={221} />

            <AppText
              variant="bold"
              style={[styles.headerTitle, { color: theme.primary_text }]}
            >
              {t("auth.login_title")}
            </AppText>

            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <AppText
                  variant="medium"
                  style={[styles.inputLabel, { color: theme.primary_text }]}
                >
                  {t("auth.email_label")}
                </AppText>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                      style={[
                        styles.inputValue,
                        {
                          color: theme.primary_text,
                          backgroundColor: theme.background,
                        },
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

              <View style={styles.inputWrapper}>
                <AppText
                  style={[
                    styles.inputLabel,
                    { marginTop: 22, color: theme.primary_text },
                  ]}
                >
                  {t("auth.password_label")}
                </AppText>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppPasswordInput
                      style={[
                        styles.inputValue,
                        {
                          color: theme.primary_text,
                          backgroundColor: theme.background,
                        },
                      ]}
                      placeholder={t("auth.password_placeholder")}
                      placeholderTextColor={theme.placeholder_text}
                      onBlur={onBlur}
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

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPasswordScreen")}
                >
                  <AppText style={styles.forgotPassword}>
                    {t("auth.forgot_password")}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            {isLoading ? (
              <View style={[styles.loginButton, { backgroundColor: "#ccc" }]}>
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <AppButton
                butName={t("auth.login_button")}
                style={[
                  styles.loginButton,
                  { backgroundColor: theme.primary_color },
                ]}
                style1={styles.loginButtonText}
                onPress={handleSubmit(onSubmit)}
              />
            )}

            <View style={styles.footerContainer}>
              <AppText
                variant="light"
                style={[styles.footerText, { color: theme.primary_text }]}
              >
                {t("auth.no_account")}
                <Text
                  style={[styles.signupLink, { color: theme.primary_color }]}
                  onPress={() => navigation.navigate("SigninScreen")}
                >
                  {t("auth.signup_link")}
                </Text>
              </AppText>

              <AppText
                variant="light"
                style={[styles.orText, { color: theme.placeholder_text }]}
              >
                {t("auth.or_social")}
              </AppText>

              <View style={styles.socialContainer}>
                {socialButtons.map((btn, index) => (
                  <Pressable
                    key={index}
                    onPress={btn.onPress}
                    style={({ pressed }) => [
                      styles.socialButton,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Ionicons
                      name={btn.icon as any}
                      size={24}
                      color={theme.primary_text}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  mainContent: {
    flex: 1,
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
  formContainer: {
    width: "100%",
    marginBottom: 32,
  },
  inputWrapper: {
    width: "100%",
    paddingHorizontal: 0,
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
    height: "auto",
    width: 280,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginLeft: 6,
    marginRight: 3,
  },
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
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 400,
  },
  loginButtonText: {
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
  signupLink: {
    fontWeight: "800",
  },
  orText: {
    marginTop: 18,
    fontSize: 14,
  },
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
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: AppFonts.RobotoRegular,
  },
});
