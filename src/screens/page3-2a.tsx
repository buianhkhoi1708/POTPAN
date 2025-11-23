import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../navigations/RootNavigator";
import styles from "../styles/screens/page3-2a.styles";

type Props = NativeStackScreenProps<RootStackParamList, "Page3-2a">;

const COLOR = "#FF782C";
const PEACH = "#FFE3D1";
const PWD_PLACEHOLDER = "●".repeat(10);

export default function Page3_2a({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = () => {
    const fallbackName = name?.trim() || "Jane Doe";
    navigation.navigate("RegisterSuccess", { name: fallbackName });
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
                placeholder="Jane Doe"
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
                placeholder="+843 620 709"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <Text style={styles.label}>Ngày sinh</Text>
              <Input
                style={styles.textHolder}
                placeholder="dd/mm/yy"
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
              Bằng cách bấm, bạn chấp nhận điều khoản sử dụng & chính sách bảo
              mật
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.primaryBtn}
              onPress={onSubmit}
            >
              <Text style={styles.primaryText}>Đăng ký</Text>
            </TouchableOpacity>

            <Text style={styles.bottomText}>
              Đã có tài khoản?
              <Text
                style={styles.link}
                onPress={() => Linking.openURL("#")}
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
<<<<<<< HEAD
=======

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8, paddingHorizontal: 16 },
  title: { 
   
    fontSize: 44, 
    fontWeight: "700", 
    textAlign: 'center', 
    letterSpacing: 1,
     marginBottom: 10, 
     color: "#4B4B4B",
     justifyContent: 'center',
     fontStyle: 'normal',
     marginTop: 8,
    
   },
  form: { flex: 1,
   },
  label: { 
  
    fontSize: 24,
    fontStyle: 'normal',
    color: '#4B4B4B', 
    fontWeight: '700',
    marginBottom: 5, 
    marginTop: 10 ,
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
     letterSpacing:1,
     textAlignVertical: "center"
     },
    textHolder:{
    
    fontSize: 18,
    fontWeight: '500',
    },
  eyeBtn: { 
    position: "absolute", 
    right: 12, 
    top: 11, 
    height: 20, 
    width: 20, 
    alignItems: "center",
     justifyContent: "center"
     },
  footer: { paddingTop: 8, paddingBottom: 28 },
  termsText: { 

    fontSize: 18, 
    color: "#4B4B4B", 
    lineHeight: 22, 
    fontWeight:'500',
    textAlign: 'center',
  },
  primaryBtn: { 
    backgroundColor: COLOR, 
    height: 48, 
    width:185,
    borderRadius: 40,
     alignItems: "center", 
     justifyContent: "center", 
     marginTop: 10 ,
     alignSelf: 'center',
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
  link: { color: '#1C37CF', fontWeight: "800" },
});
>>>>>>> 2ab2f46a07a37a9ec351668391bd08bc9339c2a3
