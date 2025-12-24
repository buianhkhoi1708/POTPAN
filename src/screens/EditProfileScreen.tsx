import React, { useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  Pressable, 
  TextInput, 
  ScrollView, 
  Image 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// --- THƯ VIỆN UPLOAD ẢNH ---
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar from "../components/AppMainNavBar"; 
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../config/supabaseClient";

const PRIMARY_COLOR = "#F06560";

const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { profile, updateProfile, isLoading, user } = useAuthStore();

  // State Form
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); 
  const [bio, setBio] = useState(""); 
  const [website, setWebsite] = useState("");
  
  // State xử lý ảnh
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Loading khi đang up ảnh

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

  // --- HÀM 1: CHỌN ẢNH TỪ MÁY (Đã sửa lỗi Warning MediaTypeOptions) ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Cần quyền", "Vui lòng cấp quyền truy cập ảnh để thay đổi avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // 👇 QUAY LẠI DÙNG CÁI NÀY ĐỂ HẾT LỖI ĐỎ
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
      
      // Tạo tên file duy nhất: user_id + thời gian
      const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file vào bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(base64Image), {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Lấy đường dẫn công khai (Public URL)
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Cập nhật state để hiển thị ảnh mới ngay lập tức
      setAvatarUrl(data.publicUrl);
      
    } catch (error: any) {
      Alert.alert("Lỗi Upload", error.message);
      console.log("Upload Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // --- HÀM 3: LƯU THÔNG TIN ---
  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Lỗi", "Họ tên không được để trống");
    
    try {
      // Gửi thông tin + URL ảnh mới nhất lên server
      await updateProfile(
        name, 
        profile?.phone_number || "", 
        avatarUrl, 
        username, 
        bio, 
        website
      );
      Alert.alert("Thành công", "Đã cập nhật hồ sơ!");
      navigation.goBack();
    } catch (error: any) {
      console.log("Lỗi Save:", error);
      Alert.alert("Lỗi", "Không thể cập nhật. " + (error.message || ""));
    }
  };

  return (
    <AppSafeView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
           <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <AppText variant="bold" style={styles.headerTitle}>Chỉnh Sửa Hồ Sơ</AppText>
        <View style={{width: 36}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- PHẦN AVATAR (Có nút bấm thay đổi) --- */}
        <View style={styles.avatarSection}>
          <Pressable onPress={pickImage} disabled={isUploading}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: avatarUrl || "https://i.pravatar.cc/300" }} 
                style={styles.avatar} 
              />
              
              {/* Lớp phủ loading khi đang upload */}
              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
              
              {/* Icon Camera */}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </View>
          </Pressable>
          <AppText style={{marginTop: 10, color: '#888'}}>Chạm để đổi ảnh đại diện</AppText>
        </View>

        {/* Form Inputs */}
        <View style={styles.form}>
          {/* 1. HỌ TÊN */}
          <View style={styles.inputGroup}>
            <AppText variant="bold" style={styles.label}>Họ Tên</AppText>
            <TextInput 
              style={styles.input} value={name} onChangeText={setName} placeholder="Nhập họ tên"
            />
          </View>

          {/* 2. BIỆT DANH */}
          <View style={styles.inputGroup}>
            <AppText variant="bold" style={styles.label}>Biệt Danh</AppText>
            <TextInput 
              style={styles.input} value={username} onChangeText={setUsername} placeholder="@nickname"
            />
          </View>

          {/* 3. GIỚI THIỆU */}
          <View style={styles.inputGroup}>
            <AppText variant="bold" style={styles.label}>Giới Thiệu</AppText>
            <TextInput 
              style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio}
              placeholder="Mô tả về bạn..." multiline numberOfLines={4} textAlignVertical="top"
            />
          </View>

          {/* 4. WEBSITE */}
          <View style={styles.inputGroup}>
            <AppText variant="bold" style={styles.label}>Website</AppText>
            <TextInput 
              style={styles.input} value={website} onChangeText={setWebsite} placeholder="https://..." autoCapitalize="none"
            />
          </View>

          {/* NÚT LƯU */}
          <View style={styles.btnContainer}>
            {isLoading ? (
               <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            ) : (
               <Pressable style={styles.saveBtn} onPress={handleSave}>
                 <AppText variant="bold" style={styles.saveBtnText}>Lưu</AppText>
               </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Nav Bar dưới cùng */}
      <View style={styles.navBarWrapper}>
        <AppMainNavBar 
          activeTab="profile" 
          onTabPress={(tab) => { if(tab === 'home') navigation.navigate('HomeScreen'); }} 
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
    paddingHorizontal: 20, paddingVertical: 15 
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