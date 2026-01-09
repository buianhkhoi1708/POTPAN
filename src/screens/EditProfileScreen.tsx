// Nhóm 9 - IE307.Q12
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar from "../components/AppMainNavBar";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../config/supabaseClient";
import { useThemeStore } from "../store/useThemeStore";

const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const { profile, updateProfile, isLoading, user } = useAuthStore();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setWebsite(profile.website || "");
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("alert.permission_required"),
        t("alert.permission_desc_photo")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      uploadImageToSupabase(selectedImage.base64, selectedImage.uri);
    }
  };

  const uploadImageToSupabase = async (
    base64Image: string | null | undefined,
    imageUri: string
  ) => {
    if (!base64Image || !user) return;

    try {
      setIsUploading(true);
      const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, decode(base64Image), {
          contentType: `image/${fileExt}`,
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      Alert.alert(t("alert.title_error"), t("alert.upload_error"));
      console.log("Upload Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim())
      return Alert.alert(t("alert.title_error"), t("alert.name_required"));

    try {
      await updateProfile(
        name,
        profile?.phone_number || "",
        avatarUrl,
        username,
        bio,
        website
      );
      Alert.alert(t("alert.title_success"), t("alert.update_success"));
      navigation.goBack();
    } catch (error: any) {
      console.log("Lỗi Save:", error);
      Alert.alert(
        t("alert.title_error"),
        error.message || t("alert.update_error")
      );
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.background_contrast,
      color: theme.primary_text,
      borderColor: theme.border,
    },
  ];

  return (
    <AppSafeView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, { backgroundColor: theme.primary_color }]}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <AppText
          variant="bold"
          style={[styles.headerTitle, { color: theme.primary_color }]}
        >
          {t("edit_profile.title")}
        </AppText>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarSection}>
            <Pressable onPress={pickImage} disabled={isUploading}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{
                    uri:
                      avatarUrl ||
                      "https://vfqnjeoqxxapqqurdkoi.supabase.co/storage/v1/object/public/avatars/users/default.jpg",
                  }}
                  style={[styles.avatar, { borderColor: theme.border }]}
                />

                {isUploading && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator color="#fff" />
                  </View>
                )}

                <View
                  style={[
                    styles.cameraIcon,
                    {
                      backgroundColor: theme.primary_color,
                      borderColor: theme.background,
                    },
                  ]}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                </View>
              </View>
            </Pressable>
            <AppText style={{ marginTop: 12, color: theme.placeholder_text }}>
              {t("edit_profile.change_avatar_hint")}
            </AppText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <AppText
                variant="bold"
                style={[styles.label, { color: theme.primary_text }]}
              >
                {t("edit_profile.label.name")}
              </AppText>
              <TextInput
                style={inputStyle}
                value={name}
                onChangeText={setName}
                placeholder={t("edit_profile.placeholder.name")}
                placeholderTextColor={theme.placeholder_text}
              />
            </View>

            <View style={styles.inputGroup}>
              <AppText
                variant="bold"
                style={[styles.label, { color: theme.primary_text }]}
              >
                {t("edit_profile.label.username")}
              </AppText>
              <TextInput
                style={inputStyle}
                value={username}
                onChangeText={setUsername}
                placeholder={t("edit_profile.placeholder.username")}
                placeholderTextColor={theme.placeholder_text}
              />
            </View>

            <View style={styles.inputGroup}>
              <AppText
                variant="bold"
                style={[styles.label, { color: theme.primary_text }]}
              >
                {t("edit_profile.label.bio")}
              </AppText>
              <TextInput
                style={[inputStyle, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder={t("edit_profile.placeholder.bio")}
                placeholderTextColor={theme.placeholder_text}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <AppText
                variant="bold"
                style={[styles.label, { color: theme.primary_text }]}
              >
                {t("edit_profile.label.website")}
              </AppText>
              <TextInput
                style={inputStyle}
                value={website}
                onChangeText={setWebsite}
                placeholder={t("edit_profile.placeholder.website")}
                placeholderTextColor={theme.placeholder_text}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.btnContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={theme.primary_color} />
              ) : (
                <Pressable
                  style={[
                    styles.saveBtn,
                    { backgroundColor: theme.primary_color },
                  ]}
                  onPress={handleSave}
                >
                  <AppText variant="bold" style={styles.saveBtnText}>
                    {t("edit_profile.save")}
                  </AppText>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.navBarWrapper}>
        <AppMainNavBar
          activeTab="profile"
          onTabPress={(tab) => {
            if (tab === "home") navigation.navigate("HomeScreen");
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  // Form
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    borderRadius: 16,
    paddingTop: 15,
  },
  btnContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  saveBtn: {
    width: "60%",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
  },
  navBarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
