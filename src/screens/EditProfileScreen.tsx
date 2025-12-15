// src/screens/EditProfileScreen.tsx

import React, { useState } from "react";
import { Image, Pressable, ScrollView, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import BottomNavSpacer from "../components/BottomNavSpacer";
import MainBottomNav, { type MainTabKey } from "../components/MainBottomNav";
import SearchRecipeModal from "../components/SearchRecipeModal";

import BackArrow from "../assets/images/backarrow.svg";
import SearchIcon from "../assets/images/search.svg";
import NotificationIcon from "../assets/images/notification.svg";

import { styles } from "../styles/editProfileStyles";

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

          <BottomNavSpacer height={90} />
        </ScrollView>

        <SearchRecipeModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
        />

        <MainBottomNav activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </AppSafeView>
  );
};

export default EditProfileScreen;
