import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// --- IMPORT COMPONENT & CONFIG ---
// Đảm bảo đường dẫn import đúng với project của bạn
import AppSafeView from "../../components/AppSafeView";
import AppText from "../../components/AppText";
import AppTextInput from "../../components/AppTextInput";     
import AppPasswordInput from "../../components/AppPasswordInput";
import AppButton from "../../components/AppButton";
import { auth, db } from "../../config/firebaseConfig";
import { AppLightColor } from "../../styles/color";
import { AppFonts } from "../../styles/fonts";

const SigninScreen = () => {
  const navigation = useNavigation<any>();

  // State dữ liệu
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(""); // Có thể nâng cấp dùng DatePicker sau
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  // --- HÀM XỬ LÝ ĐĂNG KÝ ---
  const handleRegister = async () => {
    // 1. Validate
    if (!name || !email || !phone || !password || !confirm) {
        Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin.");
        return;
    }
    if (password !== confirm) {
        Alert.alert("Lỗi mật khẩu", "Mật khẩu xác nhận không khớp.");
        return;
    }
    if (password.length < 6) {
        Alert.alert("Lỗi mật khẩu", "Mật khẩu phải có ít nhất 6 ký tự.");
        return;
    }

    // 2. Bắt đầu xử lý
    Keyboard.dismiss();
    setIsLoading(true);

    try {
        // A. Tạo Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // B. Lưu Firestore
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
                text: "Đăng nhập ngay", 
                onPress: () => {
                    // Tùy logic app: Tự đăng nhập luôn hoặc bắt ra Login
                    // Ở đây mình điều hướng về Login hoặc Home tùy bạn
                    navigation.navigate("LoginScreen"); 
                } 
            }
        ]);

    } catch (error: any) {
        console.log("Register Error:", error.code);
        let msg = "Đã có lỗi xảy ra: " + error.message;
        if (error.code === 'auth/email-already-in-use') {
            msg = "Email này đã được sử dụng.";
        } else if (error.code === 'auth/invalid-email') {
            msg = "Định dạng email không hợp lệ.";
        }
        Alert.alert("Đăng ký thất bại", msg);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AppSafeView style={styles.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Thêm ScrollView vì form đăng ký dài */}
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.container}>
              <AppText variant="bold" style={styles.title}>ĐĂNG KÝ</AppText>

              <View style={styles.form}>
                {/* --- HỌ TÊN --- */}
                <AppText variant="medium" style={styles.label}>Họ tên</AppText>
                <AppTextInput
                  style={styles.textHolder}
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChangeText={setName}
                />

                {/* --- EMAIL --- */}
                <AppText style={[styles.label, styles.marginTop]}>Email</AppText>
                <AppTextInput
                  style={styles.textHolder}
                  placeholder="example@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                {/* --- SỐ ĐIỆN THOẠI --- */}
                <AppText style={[styles.label, styles.marginTop]}>Số điện thoại</AppText>
                <AppTextInput
                  style={styles.textHolder}
                  placeholder="0909 xxx xxx"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />

                 {/* --- NGÀY SINH --- */}
                 <AppText style={[styles.label, styles.marginTop]}>Ngày sinh</AppText>
                <AppTextInput
                  style={styles.textHolder}
                  placeholder="DD/MM/YYYY"
                  value={dob}
                  onChangeText={setDob}
                />

                {/* --- MẬT KHẨU --- */}
                <AppText style={[styles.label, styles.marginTop]}>Mật khẩu</AppText>
                <AppPasswordInput
                  style={styles.textHolder}
                  placeholder="•••••••••"
                  value={password}
                  onChangeText={setPassword}
                />

                {/* --- XÁC NHẬN MẬT KHẨU --- */}
                <AppText style={[styles.label, styles.marginTop]}>Xác nhận mật khẩu</AppText>
                <AppPasswordInput
                  style={styles.textHolder}
                  placeholder="•••••••••"
                  value={confirm}
                  onChangeText={setConfirm}
                />
              </View>

              {/* --- BUTTON ĐĂNG KÝ --- */}
              {isLoading ? (
                 <View style={[styles.primaryBtn, { backgroundColor: '#ccc' }]}>
                    <ActivityIndicator color="#fff" />
                 </View>
              ) : (
                <AppButton 
                    butName="Đăng ký" 
                    style={styles.primaryBtn} 
                    style1={styles.primaryText} 
                    onPress={handleRegister}
                />
              )}

              {/* --- FOOTER --- */}
              <View style={styles.bottomBlock}>
                <Text style={styles.termsText}>
                    Bằng cách đăng ký, bạn đồng ý với điều khoản sử dụng
                </Text>

                <AppText variant="light" style={styles.bottomText}>
                  Đã có tài khoản?
                  <Text
                    style={styles.link}
                    // Lưu ý: Kiểm tra đúng tên màn hình Login trong Navigation
                    onPress={() => navigation.navigate("LoginScreen")} 
                    suppressHighlighting
                  >
                    {" "}Đăng nhập
                  </Text>
                </AppText>

                {/* Social Login (Giữ cho giống Login) */}
                <View style={styles.socialRow}>
                  <Pressable style={styles.socialBtn}>
                    <Ionicons name="logo-facebook" size={20} color="#111827" />
                  </Pressable>
                  <Pressable style={styles.socialBtn}>
                    <Ionicons name="logo-instagram" size={20} color="#111827" />
                  </Pressable>
                  <Pressable style={styles.socialBtn}>
                    <Ionicons name="paper-plane-outline" size={20} color="#111827"/>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </AppSafeView>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppLightColor.background
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Để nội dung bung ra hết chiều cao nếu ít
    paddingBottom: 40, // Khoảng trống dưới cùng để cuộn không bị che
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingTop: 40, // Thêm padding top vì nằm trong ScrollView
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 30,
    fontFamily: AppFonts.RobotoSlabBold,
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 20,
    fontFamily: AppFonts.RobotoSlabMedium,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 20, // Canh lề trái label giống Login
  },
  marginTop: {
    marginTop: 16,
  },
  textHolder: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 1,
  },
  primaryBtn: {
    marginTop: 8,
    alignSelf: "center",
    height: 52,
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 60,
    minWidth: 200,
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  bottomBlock: {
    marginTop: 24,
    alignItems: "center",
  },
  termsText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 20
  },
  bottomText: {
    color: "#111827",
    fontSize: 16,
  },
  link: {
    color: "#0040C0",
    fontWeight: "800",
  },
  socialRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    columnGap: 20,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25, // Fix lỗi Android
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppLightColor.background,
  },
});