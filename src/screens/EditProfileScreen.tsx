// src/screens/EditProfileScreen.tsx

import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import BottomNavSpacer from "../components/BottomNavSpacer";
import MainBottomNav, { type MainTabKey } from "../components/MainBottomNav";
import { AppLightColor } from "../styles/color";

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");

  const [fullName, setFullName] = useState("Bùi Anh Khôi");
  const [nickname, setNickname] = useState("KhoiABui");
  const [bio, setBio] = useState("Nấu ăn là niềm đam mê to lớn của tôi");
  const [link, setLink] = useState("");

  const onSave = () => {
    navigation.goBack();
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Pressable
              style={styles.iconCirclePrimary}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </Pressable>

            <View style={styles.headerTitleWrap} pointerEvents="none">
              <AppText variant="title" style={styles.headerTitle}>
                Chỉnh Sửa Hồ Sơ
              </AppText>
            </View>

            <View style={styles.headerRight}>
              <Pressable style={styles.iconCirclePrimary}>
                <Ionicons name="search-outline" size={18} color="#fff" />
              </Pressable>
              <Pressable style={styles.iconCirclePrimary}>
                <Ionicons name="notifications-outline" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* AVATAR */}
          <View style={styles.avatarWrap}>
            <Image
              source={require("../assets/images/avt-profile.png")}
              style={styles.avatar}
            />
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <AppText variant="medium" style={styles.label}>
              Họ Tên
            </AppText>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.inputPill}
              placeholderTextColor="#b06c6b"
            />

            <AppText variant="medium" style={[styles.label, styles.labelGap]}>
              Biệt Danh
            </AppText>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              style={styles.inputPill}
              placeholderTextColor="#b06c6b"
            />

            <AppText variant="medium" style={[styles.label, styles.labelGap]}>
              Giới Thiệu Bản Thân
            </AppText>
            <TextInput
              value={bio}
              onChangeText={setBio}
              style={styles.inputBio}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#b06c6b"
            />

            <AppText variant="medium" style={[styles.label, styles.labelGap]}>
              Thêm Liên Kết
            </AppText>
            <TextInput
              value={link}
              onChangeText={setLink}
              style={styles.inputPill}
              placeholderTextColor="#b06c6b"
            />

            <Pressable style={styles.saveBtn} onPress={onSave}>
              <AppText variant="medium" style={styles.saveText}>
                Lưu
              </AppText>
            </Pressable>
          </View>

          <BottomNavSpacer height={90} />
        </ScrollView>

        <MainBottomNav activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </AppSafeView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 26, paddingTop: 8, paddingBottom: 10 },

  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // title overlay absolute để canh giữa theo màn hình
  headerTitleWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    color: AppLightColor.primary_color,
    fontWeight: "800",
  },

  headerRight: { flexDirection: "row", alignItems: "center", columnGap: 10 },

  iconCirclePrimary: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarWrap: { alignItems: "center", marginTop: 10, marginBottom: 8 },
  avatar: { width: 96, height: 96, borderRadius: 48 },

  form: { marginTop: 6 },

  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
    marginLeft: 2,
  },
  labelGap: { marginTop: 14 },

  inputPill: {
    marginTop: 8,
    backgroundColor: "#ffe3e2",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#222",
  },

  inputBio: {
    marginTop: 8,
    backgroundColor: "#ffe3e2",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    minHeight: 96,
    fontSize: 14,
    color: "#222",
  },

  saveBtn: {
    marginTop: 18,
    alignSelf: "center",
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 999,
    paddingHorizontal: 64,
    paddingVertical: 10,
  },
  saveText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
