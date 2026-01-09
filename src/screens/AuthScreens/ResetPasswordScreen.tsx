// Nhóm 9 - IE307.Q12
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AppSafeView from "../../components/AppSafeView";
import AppText from "../../components/AppText";
import AppHeader from "../../components/AppHeader";
import { supabase } from "../../config/supabaseClient";
import { useThemeStore } from "../../store/useThemeStore";

const ResetPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { email } = route.params || {};
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert(
        t("common.error"),
        t("auth.fill_all") || "Vui lòng điền đầy đủ thông tin"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(
        t("common.error"),
        t("auth.password_mismatch") || "Mật khẩu xác nhận không khớp"
      );
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(t("common.error"), "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const { data: verifyData, error: verifyError } =
        await supabase.auth.verifyOtp({
          email: email,
          token: otp,
          type: "recovery",
        });
      if (verifyError) throw verifyError;

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      Alert.alert(
        t("common.success"),
        t("auth.password_reset_success") ||
          "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
        [
          {
            text: "Đăng nhập",
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: "LoginScreen" }],
              }),
          },
        ]
      );
    } catch (error: any) {
      console.log("Reset error:", error);
      Alert.alert(
        t("common.error"),
        error.message || "Mã OTP không đúng hoặc đã hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSafeView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <AppHeader
        title={t("auth.reset_password_title") || "Đặt lại mật khẩu"}
        showBack
        onBackPress={() => navigation.goBack()}
        showNotifications={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <AppText style={[styles.subTitle, { color: theme.placeholder_text }]}>
            {t("auth.enter_otp_msg") ||
              `Nhập mã OTP đã được gửi tới ${email} và mật khẩu mới.`}
          </AppText>

          <View style={styles.inputGroup}>
            <AppText
              variant="bold"
              style={[styles.label, { color: theme.primary_text }]}
            >
              Mã OTP
            </AppText>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.background_contrast,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="keypad-outline"
                size={20}
                color={theme.placeholder_text}
              />
              <TextInput
                style={[styles.input, { color: theme.primary_text }]}
                placeholder="Nhập mã 6 số"
                placeholderTextColor={theme.placeholder_text}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={8}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <AppText
              variant="bold"
              style={[styles.label, { color: theme.primary_text }]}
            >
              {t("auth.new_password") || "Mật khẩu mới"}
            </AppText>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.background_contrast,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.placeholder_text}
              />
              <TextInput
                style={[styles.input, { color: theme.primary_text }]}
                placeholder="******"
                placeholderTextColor={theme.placeholder_text}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.placeholder_text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <AppText
              variant="bold"
              style={[styles.label, { color: theme.primary_text }]}
            >
              {t("auth.confirm_password") || "Xác nhận mật khẩu"}
            </AppText>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.background_contrast,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.placeholder_text}
              />
              <TextInput
                style={[styles.input, { color: theme.primary_text }]}
                placeholder="******"
                placeholderTextColor={theme.placeholder_text}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPass}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary_color }]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AppText variant="bold" style={styles.buttonText}>
                {t("auth.confirm_reset") || "Đổi mật khẩu"}
              </AppText>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  subTitle: {
    textAlign: "center",
    marginBottom: 32,
    fontSize: 14,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
