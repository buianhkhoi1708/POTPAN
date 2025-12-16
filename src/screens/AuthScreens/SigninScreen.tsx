// src/screens/page3-2a.tsx
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,    
  SafeAreaView    // Thêm Alert để báo lỗi/thành công
} from "react-native";

// --- 1. IMPORT FIREBASE ---
// Lưu ý: Kiểm tra đường dẫn '../config/firebaseConfig' cho đúng với cấu trúc thư mục của bạn
import { auth, db } from "../../config/firebaseConfig"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type Props = NativeStackScreenProps<RootStackParamList, "Page3-2a">;

const COLOR = "#FF6967";
const PWD_PLACEHOLDER = "●".repeat(10);

const SigninScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading để tránh bấm nhiều lần

  // --- 2. HÀM XỬ LÝ ĐĂNG KÝ ---
  const handleRegister = async () => {
    // A. Validate dữ liệu đầu vào
    if (!name || !email || !phone || !password || !confirm) {
        Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ các trường bắt buộc.");
        return;
    }
    if (password !== confirm) {
        Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
        return;
    }
    if (password.length < 6) {
        Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
        return;
    }

    try {
        setLoading(true); // Bật trạng thái loading

        // B. Tạo tài khoản bên Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // C. Lưu thông tin chi tiết vào Firestore
        // Dùng user.uid làm ID cho document để dễ quản lý
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            fullName: name,
            phoneNumber: phone,
            dateOfBirth: dob,
            createdAt: new Date().toISOString(),
            role: 'user'
        });

        Alert.alert("Thành công", "Tạo tài khoản thành công!", [
            { 
                text: "OK", 
                onPress: () => {
                    // Đăng ký xong thì chuyển vào màn hình tiếp theo
                    // Hoặc quay lại màn hình Login tùy bạn chọn
                    const fallbackName = name?.trim() || "User";
                    navigation.navigate("Page3-2b", { name: fallbackName }); 
                } 
            }
        ]);

    } catch (error: any) {
        // Xử lý lỗi Firebase báo về
        console.log("Register Error:", error.code);
        if (error.code === 'auth/email-already-in-use') {
            Alert.alert("Lỗi", "Email này đã được sử dụng.");
        } else if (error.code === 'auth/invalid-email') {
            Alert.alert("Lỗi", "Email không hợp lệ.");
        } else {
            Alert.alert("Lỗi", "Đã có lỗi xảy ra: " + error.message);
        }
    } finally {
        setLoading(false); // Tắt loading dù thành công hay thất bại
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding" })}
      >
        <View style={styles.container}>
          <Text style={styles.title}>ĐĂNG KÝ</Text>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.form}>
              <Text style={styles.label}>Họ tên</Text>
              <Input
                style={styles.textHolder}
                placeholder="Nguyễn Văn A"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Email</Text>
              <Input
                style={styles.textHolder}
                placeholder="example@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>SĐT</Text>
              <Input
                style={styles.textHolder}
                placeholder="0909 xxx xxx"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <Text style={styles.label}>Ngày sinh</Text>
              <Input
                style={styles.textHolder}
                placeholder="dd/mm/yyyy"
                value={dob}
                onChangeText={setDob}
              />

              <Text style={styles.label}>Mật khẩu</Text>
              <PasswordInput
                placeholder={PWD_PLACEHOLDER}
                value={password}
                onChangeText={setPassword}
                visible={showPass}
                onToggleVisible={() => setShowPass((v) => !v)}
              />

              <Text style={styles.label}>Xác nhận mật khẩu</Text>
              <PasswordInput
                placeholder={PWD_PLACEHOLDER}
                value={confirm}
                onChangeText={setConfirm}
                visible={showConfirm}
                onToggleVisible={() => setShowConfirm((v) => !v)}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.termsText}>
              Bằng cách bấm, bạn chấp nhận điều khoản sử dụng & chính sách bảo mật
            </Text>
            
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.primaryBtn, { opacity: loading ? 0.7 : 1 }]} // Làm mờ nút khi đang loading
              onPress={handleRegister} // Gọi hàm handleRegister thay vì onSubmit
              disabled={loading} // Khóa nút khi đang xử lý
            >
              <Text style={styles.primaryText}>{loading ? "Đang xử lý..." : "Đăng ký"}</Text>
            </TouchableOpacity>

            <Text style={styles.bottomText}>
              Đã có tài khoản?
              <Text
                style={styles.link}
                onPress={() => {
                    // Điều hướng về màn hình Đăng nhập (Page3-1a)
                    // Kiểm tra lại tên màn hình trong AppStackNavigator của bạn nhé
                    navigation.navigate("Page3-1a"); 
                }}
                suppressHighlighting
              >
                {" "}
                Đăng nhập
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- GIỮ NGUYÊN PHẦN UI CỦA BẠN BÊN DƯỚI ---

const Input = (props: React.ComponentProps<typeof TextInput>) => (
  <View style={styles.inputWrap}>
    <TextInput
      allowFontScaling={false}
      {...props}
      placeholderTextColor="#e3e3e3ff"
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
      placeholderTextColor="#e3e3e3ff"
      style={[
        styles.input,
        {
          paddingRight: 44,
          paddingVertical: 0,
          textAlignVertical: "center",
          fontSize: 11,
        },
      ]}
    />
    <TouchableOpacity style={styles.eyeBtn} onPress={onToggleVisible}>
      <Ionicons name={visible ? "eye" : "eye-off"} size={20} color="#ffffffff" />
    </TouchableOpacity>
  </View>
);
export default SigninScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8, paddingHorizontal: 16 },

  title: {
    fontSize: 44,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 10,
    color: "#4B4B4B",
    justifyContent: "center",
    fontStyle: "normal",
    marginTop: 8,
  },

  form: {
    flex: 1,
  },

  label: {
    fontSize: 24,
    fontStyle: "normal",
    color: "#4B4B4B",
    fontWeight: "700",
    marginBottom: 5,
    marginTop: 10,
  },

  inputWrap: { position: "relative" },

  input: {
    height: 46,
    borderRadius: 40,
    paddingHorizontal: 20,
    backgroundColor: COLOR,
    color: "#ffffffff",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 1,
    textAlignVertical: "center",
  },

  textHolder: {
    fontSize: 18,
    fontWeight: "500",
  },

  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 11,
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  footer: { paddingTop: 8, paddingBottom: 28 },

  termsText: {
    fontSize: 18,
    color: "#4B4B4B",
    lineHeight: 22,
    fontWeight: "500",
    textAlign: "center",
  },

  primaryBtn: {
    backgroundColor: COLOR,
    height: 48,
    width: 185,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    alignSelf: "center",
  },

  primaryText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 24,
  },

  bottomText: {
    marginTop: 10,
    alignSelf: "center",
    color: "#4B4B4B",
    fontSize: 18,
  },

  link: { color: "#1C37CF", fontWeight: "800" },
});