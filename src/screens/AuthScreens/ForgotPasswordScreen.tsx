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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AppSafeView from "../../components/AppSafeView";
import AppText from "../../components/AppText";
import AppHeader from "../../components/AppHeader";
import { supabase } from "../../config/supabaseClient";
import { useThemeStore } from "../../store/useThemeStore";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert(
        t("common.error"),
        t("auth.email_required") || "Vui lòng nhập email"
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

      if (error) throw error;

      Alert.alert(
        t("common.success"),
        t("auth.otp_sent") || "Mã xác thực đã được gửi đến email của bạn.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("ResetPasswordScreen", {
                email: email.trim(),
              }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        t("common.error"),
        error.message || "Không thể gửi mã. Vui lòng thử lại."
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
        title={t("auth.forgot_password_title") || "Quên mật khẩu"}
        showBack
        onBackPress={() => navigation.goBack()}
        showNotifications={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={80}
              color={theme.primary_color}
            />
          </View>

          <AppText style={[styles.desc, { color: theme.placeholder_text }]}>
            {t("auth.forgot_password_desc") ||
              "Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi cho bạn một mã xác thực để đặt lại mật khẩu."}
          </AppText>

          <View style={styles.inputGroup}>
            <AppText
              variant="bold"
              style={[styles.label, { color: theme.primary_text }]}
            >
              Email
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
                name="mail-outline"
                size={20}
                color={theme.placeholder_text}
              />
              <TextInput
                style={[styles.input, { color: theme.primary_text }]}
                placeholder="example@email.com"
                placeholderTextColor={theme.placeholder_text}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary_color }]}
            onPress={handleSendOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AppText variant="bold" style={styles.buttonText}>
                {t("auth.send_code") || "Gửi mã xác thực"}
              </AppText>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  desc: {
    textAlign: "center",
    marginBottom: 32,
    fontSize: 14,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 24,
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
    marginTop: 10,
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
