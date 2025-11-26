// src/screens/page3-1a.tsx
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../navigations/AppStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Page3-1a">;

const PRIMARY = "#FF6967";
const BG = "#FFFFFF";
const PWD_PLACEHOLDER = "●".repeat(10);

export default function Page3_1a({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const onLogin = () => {
    // xử lý đăng nhập / điều hướng sau
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding" })}
      >
        <View style={styles.container}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>ĐĂNG NHẬP</Text>

            <View style={styles.form}>
              <Text style={styles.label}>Tên đăng nhập</Text>
              <Input
                style={styles.textHolder}
                placeholder="example@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={[styles.label, { marginTop: 22 }]}>Mật khẩu</Text>
              <PasswordInput
                placeholder={PWD_PLACEHOLDER}
                value={password}
                onChangeText={setPassword}
                visible={showPass}
                onToggleVisible={() => setShowPass((v) => !v)}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.primaryBtn}
              onPress={onLogin}
            >
              <Text style={styles.primaryText}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.bottomBlock}>
              <Text style={styles.bottomLink}>Quên mật khẩu?</Text>

              <Text style={styles.bottomText}>
                Chưa có tài khoản?
                <Text
                  style={styles.link}
                  onPress={() => {
                    // điều hướng sang đăng ký
                  }}
                  suppressHighlighting
                >
                  {" "}
                  Đăng ký
                </Text>
              </Text>

              <Text style={styles.bottomTextSmall}>Hoặc đăng ký với</Text>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Ionicons name="logo-facebook" size={20} color="#111827" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Ionicons name="logo-instagram" size={20} color="#111827" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Ionicons
                    name="paper-plane-outline"
                    size={20}
                    color="#111827"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Input = (props: React.ComponentProps<typeof TextInput>) => (
  <View style={styles.inputWrap}>
    <TextInput
      allowFontScaling={false}
      {...props}
      placeholderTextColor="#FFE0D7"
      style={[styles.input, props.style]}
    />
  </View>
);

const PasswordInput = ({
  value,
  onChangeText,
  visible,
  onToggleVisible,
  placeholder,
}: {
  value: string;
  onChangeText: (t: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  placeholder?: string;
}) => (
  <View style={styles.inputWrap}>
    <TextInput
      value={value}
      allowFontScaling={false}
      onChangeText={onChangeText}
      secureTextEntry={!visible}
      placeholder={placeholder}
      placeholderTextColor="#FFE0D7"
      style={[
        styles.input,
        {
          paddingRight: 52,
          paddingVertical: 0,
          textAlignVertical: "center",
          fontSize: 11,
        },
      ]}
    />
    <TouchableOpacity style={styles.eyeBtn} onPress={onToggleVisible}>
      <Ionicons
        name={visible ? "eye" : "eye-off"}
        size={20}
        color="#ffffff"
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 24,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 40,
    color: "#111827",
  },

  form: {
    marginBottom: 32,
  },

  label: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "700",
    marginBottom: 8,
  },

  inputWrap: { position: "relative" },

  input: {
    height: 52,
    borderRadius: 999,
    paddingHorizontal: 22,
    backgroundColor: PRIMARY,
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
    textAlignVertical: "center",
  },

  textHolder: {
    fontSize: 16,
    fontWeight: "500",
  },

  eyeBtn: {
    position: "absolute",
    right: 16,
    top: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryBtn: {
    marginTop: 8,
    alignSelf: "center",
    height: 52,
    borderRadius: 999,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 80,
  },

  primaryText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  bottomBlock: {
    marginTop: 24,
    alignItems: "center",
  },

  bottomLink: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 6,
  },

  bottomText: {
    color: "#111827",
    fontSize: 14,
  },

  link: {
    color: "#0040C0",
    fontWeight: "800",
  },

  bottomTextSmall: {
    marginTop: 18,
    fontSize: 13,
    color: "#6B7280",
  },

  socialRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
    columnGap: 20,
  },

  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
