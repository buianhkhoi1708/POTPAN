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
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; // 👈 Import i18n

// --- THƯ VIỆN UPLOAD ẢNH ---
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar from "../components/AppMainNavBar"; 
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../config/supabaseClient";
import { AppLightColor } from "../styles/color";

const PRIMARY_COLOR = AppLightColor.primary_color;

const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation(); // 👈 Khởi tạo hook
  const { profile, updateProfile, isLoading, user } = useAuthStore();

  // State Form
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); 
  const [bio, setBio] = useState(""); 
  const [website, setWebsite] = useState("");
  
  // State xử lý ảnh
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); 

  // Load dữ liệu cũ
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setUsername(profile.username || ""); 
      setBio(profile.bio || "");
      setWebsite(profile.website || "");
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  // --- HÀM 1: CHỌN ẢNH TỪ MÁY ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t("alert.permission_required"), t("alert.permission_desc_photo"));
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

  // --- HÀM 2: UPLOAD LÊN SUPABASE ---
  const uploadImageToSupabase = async (base64Image: string | null | undefined, imageUri: string) => {
    if (!base64Image || !user) return;

    try {
      setIsUploading(true);
      
      const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(base64Image), {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      
    } catch (error: any) {
      Alert.alert(t("alert.title_error"), t("alert.upload_error"));
      console.log("Upload Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // --- HÀM 3: LƯU THÔNG TIN ---
  const handleSave = async () => {
    if (!name.trim()) return Alert.alert(t("alert.title_error"), t("alert.name_required"));
    
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
      Alert.alert(t("alert.title_error"), error.message || t("alert.update_error"));
    }
  };

  return (
    <AppSafeView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
           <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <AppText variant="bold" style={styles.headerTitle}>
          {t("edit_profile.title")}
        </AppText>
        <View style={{width: 36}} /> 
      </View>
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- PHẦN AVATAR --- */}
          <View style={styles.avatarSection}>
            <Pressable onPress={pickImage} disabled={isUploading}>
              <View style={styles.avatarWrapper}>
                <Image 
                  source={{ uri: avatarUrl || "" }} 
                  style={styles.avatar} 
                />
                
                {isUploading && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator color="#fff" />
                  </View>
                )}
                
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </View>
              </View>
            </Pressable>
            <AppText style={{marginTop: 10, color: '#888'}}>
              {t("edit_profile.change_avatar_hint")}
            </AppText>
          </View>

          {/* Form Inputs */}
          <View style={styles.form}>
            {/* 1. HỌ TÊN */}
            <View style={styles.inputGroup}>
              <AppText variant="bold" style={styles.label}>
                {t("edit_profile.label.name")}
              </AppText>
              <TextInput 
                style={styles.input} 
                value={name} 
                onChangeText={setName} 
                placeholder={t("edit_profile.placeholder.name")}
              />
            </View>

            {/* 2. BIỆT DANH */}
            <View style={styles.inputGroup}>
              <AppText variant="bold" style={styles.label}>
                {t("edit_profile.label.username")}
              </AppText>
              <TextInput 
                style={styles.input} 
                value={username} 
                onChangeText={setUsername} 
                placeholder={t("edit_profile.placeholder.username")}
              />
            </View>

            {/* 3. GIỚI THIỆU */}
            <View style={styles.inputGroup}>
              <AppText variant="bold" style={styles.label}>
                {t("edit_profile.label.bio")}
              </AppText>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={bio} 
                onChangeText={setBio}
                placeholder={t("edit_profile.placeholder.bio")}
                multiline 
                numberOfLines={4} 
                textAlignVertical="top"
              />
            </View>

            {/* 4. WEBSITE */}
            <View style={styles.inputGroup}>
              <AppText variant="bold" style={styles.label}>
                {t("edit_profile.label.website")}
              </AppText>
              <TextInput 
                style={styles.input} 
                value={website} 
                onChangeText={setWebsite} 
                placeholder={t("edit_profile.placeholder.website")}
                autoCapitalize="none"
              />
            </View>

            {/* NÚT LƯU */}
            <View style={styles.btnContainer}>
              {isLoading ? (
                 <ActivityIndicator size="large" color={PRIMARY_COLOR} />
              ) : (
                 <Pressable style={styles.saveBtn} onPress={handleSave}>
                   <AppText variant="bold" style={styles.saveBtnText}>
                     {t("edit_profile.save")}
                   </AppText>
                 </Pressable>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Nav Bar dưới cùng */}
      <View style={styles.navBarWrapper}>
        <AppMainNavBar 
          activeTab="profile" 
          onTabPress={(tab) => { 
            if(tab === 'home') navigation.navigate('HomeScreen');
            // Thêm các case điều hướng khác nếu cần
          }} 
        />
      </View>
    </AppSafeView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // Header
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingVertical: 15,
    backgroundColor: '#fff', // Đảm bảo header có nền
    zIndex: 10
  },
  headerTitle: { fontSize: 22, color: PRIMARY_COLOR },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: PRIMARY_COLOR,
    alignItems: 'center', justifyContent: 'center'
  },
  
  scrollContent: { paddingBottom: 100 },
  
  // Avatar Styles
  avatarSection: { alignItems: 'center', marginVertical: 20 },
  avatarWrapper: { position: 'relative' },
  avatar: { 
    width: 120, height: 120, borderRadius: 60, 
    borderWidth: 3, borderColor: '#C8E6C9' 
  },
  cameraIcon: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: PRIMARY_COLOR, width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff'
  },
  uploadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 60,
    alignItems: 'center', justifyContent: 'center'
  },

  // Form
  form: { paddingHorizontal: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, color: '#333', marginBottom: 8 },
  input: { 
    borderWidth: 1, borderColor: '#999', borderRadius: 25, 
    paddingHorizontal: 20, paddingVertical: 12, fontSize: 16, backgroundColor: '#fff'
  },
  textArea: { height: 100, borderRadius: 20, paddingTop: 15 },
  
  // Button
  btnContainer: { marginTop: 10, alignItems: 'center' },
  saveBtn: {
    backgroundColor: PRIMARY_COLOR, width: '60%', height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: PRIMARY_COLOR, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4
  },
  saveBtnText: { color: '#fff', fontSize: 20 },
  
  navBarWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0 }
});