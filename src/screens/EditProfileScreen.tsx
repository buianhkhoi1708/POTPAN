// src/screens/EditProfileScreen.tsx

import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppBottomSpace from "../components/AppBottomSpace";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import AppSearchModal from "../components/AppSearchModal";

import BackArrow from "../assets/images/backarrow.svg";
import SearchIcon from "../assets/images/search.svg";
import NotificationIcon from "../assets/images/notification.svg";

import { AppLightColor } from "../styles/color";

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<MainTabKey>("profile");
  const [searchVisible, setSearchVisible] = useState(false);

  const [fullName, setFullName] = useState("Bùi Anh Khôi");
  const [nickname, setNickname] = useState("KhoiABui");
  const [bio, setBio] = useState("Nấu ăn là niềm đam mê to lớn của tôi");
  const [link, setLink] = useState("");

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Pressable
              style={styles.headerIconCircle}
              onPress={() => navigation.goBack()}
            >
              <BackArrow width={18} height={18} />
            </Pressable>

            <View style={styles.headerTitleWrap} pointerEvents="none">
              <AppText variant="title" style={styles.headerTitle}>
                Chỉnh Sửa Hồ Sơ
              </AppText>
            </View>

            <View style={styles.headerRight}>
              <Pressable
                style={styles.headerIconCircle}
                onPress={() => setSearchVisible(true)}
              >
                <SearchIcon width={18} height={18} />
              </Pressable>

              <Pressable
                style={styles.headerIconCircle}
                onPress={() => navigation.navigate("Notification")}
              >
                <NotificationIcon width={18} height={18} />
              </Pressable>
            </View>
          </View>

          <View style={styles.avatarWrap}>
            <Image
              source={require("../assets/images/avt-profile.png")}
              style={styles.avatar}
            />
          </View>

          <View style={styles.form}>
            <AppText variant="medium" style={styles.label}>
              Họ Tên
            </AppText>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.inputPill}
            />

            <AppText variant="medium" style={styles.label}>
              Biệt Danh
            </AppText>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              style={styles.inputPill}
            />

            <AppText variant="medium" style={styles.label}>
              Giới Thiệu Bản Thân
            </AppText>
            <TextInput
              value={bio}
              onChangeText={setBio}
              style={styles.inputBio}
              multiline
            />

            <AppText variant="medium" style={styles.label}>
              Thêm Liên Kết
            </AppText>
            <TextInput
              value={link}
              onChangeText={setLink}
              style={styles.inputPill}
            />

            <Pressable
              style={styles.saveBtn}
              onPress={() => navigation.goBack()}
            >
              <AppText variant="medium" style={styles.saveText}>
                Lưu
              </AppText>
            </Pressable>
          </View>

          <AppBottomSpace height={90} />
        </ScrollView>

        <AppSearchModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
        />

        <AppMainNavBar activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </AppSafeView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: 26, paddingTop: 8 },

  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: AppLightColor.primary_color,
  },
  headerRight: { flexDirection: "row", columnGap: 10 },

  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarWrap: { alignItems: "center", marginTop: 14 },
  avatar: { width: 120, height: 120, borderRadius: 60 },

  form: { marginTop: 12 },
  label: { fontSize: 14, fontWeight: "700", marginTop: 14 },
  inputPill: {
    marginTop: 8,
    backgroundColor: "#ffe3e2",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  inputBio: {
    marginTop: 8,
    backgroundColor: "#ffe3e2",
    borderRadius: 22,
    padding: 14,
    minHeight: 96,
    fontSize: 14,
  },

  saveBtn: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 999,
    paddingHorizontal: 64,
    paddingVertical: 10,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});