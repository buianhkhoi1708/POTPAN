import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated, // 👇 1. Import Animated
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";

interface Collection {
  id: number;
  name: string;
  image?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  recipeId: number;
  onSaved: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const AppCollectionModal: React.FC<Props> = ({
  visible,
  onClose,
  recipeId,
  onSaved,
}) => {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // 👇 2. Tạo biến Animation (Vị trí Y của modal content)
  // Khởi tạo ở vị trí SCREEN_HEIGHT (nằm ngoài màn hình bên dưới)
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible && user) {
      fetchCollections();
      // 👇 3. Khi mở: Nền đen hiện ngay (do Modal visible), Content trượt lên
      Animated.spring(translateY, {
        toValue: 0, // Về vị trí gốc
        useNativeDriver: true,
        damping: 15, // Độ nảy (càng nhỏ càng nảy)
        stiffness: 100, // Độ cứng
      }).start();
    }
  }, [visible, user]);

  // 👇 4. Hàm đóng custom: Trượt xuống trước -> rồi mới tắt Modal
  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT, // Trượt xuống dưới cùng
      duration: 250, // Thời gian trượt (ms)
      useNativeDriver: true,
    }).start(() => {
      // Sau khi chạy xong animation thì mới gọi hàm tắt của cha
      onClose();
      // Reset lại vị trí cho lần mở sau (đề phòng)
      translateY.setValue(SCREEN_HEIGHT);
    });
  };

  const fetchCollections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCollections(data);
    }
    setLoading(false);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Cần quyền", "Vui lòng cho phép truy cập ảnh.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
        base64: true, 
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        setImageBase64(asset.base64 || null);
      }
    } catch (error) {
      console.log("Lỗi chọn ảnh:", error);
    }
  };

  const uploadImageToSupabase = async (base64Data: string) => {
    try {
      const fileName = `${user?.id}/${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from("collection-images") 
        .upload(fileName, decode(base64Data), {
          contentType: "image/jpeg",
          upsert: true
        });

      if (error) throw error;
      const { data: publicData } = supabase.storage
        .from("collection-images")
        .getPublicUrl(fileName);
      return publicData.publicUrl;
    } catch (error: any) {
      console.log("Upload lỗi:", error.message || error);
      Alert.alert("Lỗi Upload", "Vui lòng kiểm tra lại kết nối mạng.");
      return null;
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    setCreating(true);
    let imageUrl = null;
    try {
      if (imageBase64) {
        imageUrl = await uploadImageToSupabase(imageBase64);
      }
      const { data, error } = await supabase
        .from("collections")
        .insert({
          user_id: user?.id,
          name: newCollectionName.trim(),
          image: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCollections([data, ...collections]);
        setNewCollectionName("");
        setSelectedImage(null);
        setImageBase64(null);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Không thể tạo bộ sưu tập");
    } finally {
      setCreating(false);
    }
  };

  const handleSaveToCollection = async (collectionId: number | null) => {
    try {
      await supabase
        .from("saved_recipes")
        .delete()
        .eq("user_id", user?.id)
        .eq("recipe_id", recipeId);

      const { error } = await supabase.from("saved_recipes").insert({
        user_id: user?.id,
        recipe_id: recipeId,
        collection_id: collectionId,
      });

      if (error) throw error;
      onSaved();
      // Gọi handleClose để có animation đóng
      handleClose();
    } catch (error) {
      console.log("Lỗi lưu:", error);
      Alert.alert("Lỗi", "Không thể lưu món ăn");
    }
  };

  const renderItem = ({ item }: { item: Collection }) => (
    <Pressable
      style={styles.collectionItem}
      onPress={() => handleSaveToCollection(item.id)}
    >
      <View style={styles.folderIcon}>
        {item.image ? (
            <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
        ) : (
            <Ionicons
            name="folder-open"
            size={24}
            color={AppLightColor.primary_color}
            />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="bold" style={styles.collectionName}>
          {item.name}
        </AppText>
        <AppText style={styles.subText}>Lưu vào đây</AppText>
      </View>
      <Ionicons name="add-circle-outline" size={24} color="#ccc" />
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      transparent
      // 👇 5. Quan trọng: Tắt animation mặc định của Modal
      animationType="none" 
      statusBarTranslucent
      onRequestClose={handleClose} // Xử lý nút back Android
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* 👇 6. Backdrop: View thường -> Hiện ngay lập tức */}
        <Pressable style={styles.backdrop} onPress={handleClose}>
          
          {/* 👇 7. Content: Animated.View -> Trượt từ dưới lên */}
          <Animated.View
            style={[
              styles.modalContent,
              { 
                paddingBottom: insets.bottom + 20,
                // Gán giá trị animation vào transform
                transform: [{ translateY: translateY }] 
              },
            ]}
            // Chặn sự kiện nổi bọt để không đóng khi bấm vào content
            onStartShouldSetResponder={() => true} 
          >
            <View style={styles.header}>
              <AppText variant="bold" style={styles.title}>
                Lưu vào bộ sưu tập
              </AppText>
              <Pressable onPress={handleClose} style={{ padding: 4 }}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>


    

            {loading ? (
              <ActivityIndicator
                color={AppLightColor.primary_color}
                style={{ marginVertical: 20 }}
              />
            ) : (
              <FlatList
                data={collections}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                style={{ maxHeight: 300 }}
                showsVerticalScrollIndicator={false}
              />
            )}

            <View style={styles.createArea}>
                <AppText variant="bold" style={{ marginBottom: 8, fontSize: 14 }}>Tạo bộ sưu tập mới</AppText>
                
                {selectedImage && (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                        <Pressable style={styles.removeImageBtn} onPress={() => {
                            setSelectedImage(null);
                            setImageBase64(null);
                        }}>
                            <Ionicons name="close-circle" size={20} color="#fff" />
                        </Pressable>
                    </View>
                )}

                <View style={styles.createBox}>
                    <Pressable style={styles.pickImageBtn} onPress={pickImage}>
                         <Ionicons name="image-outline" size={24} color={AppLightColor.primary_color} />
                    </Pressable>

                    <TextInput
                        style={styles.input}
                        placeholder="Tên bộ sưu tập..."
                        value={newCollectionName}
                        onChangeText={setNewCollectionName}
                        placeholderTextColor="#999"
                    />
                    <Pressable
                        style={styles.createBtn}
                        onPress={handleCreateCollection}
                        disabled={creating || !newCollectionName.trim()}
                    >
                        {creating ? (
                        <ActivityIndicator color="#fff" size="small" />
                        ) : (
                        <Ionicons name="arrow-up" size={24} color="#fff" />
                        )}
                    </Pressable>
                </View>
            </View>

          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AppCollectionModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Màu đen mờ
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%", 
    width: '100%', // Đảm bảo full width
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 18, color: "#333" },

  collectionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  folderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    overflow: 'hidden'
  },
  collectionName: { fontSize: 16, color: "#333" },
  subText: { fontSize: 12, color: "#888" },

  divider: { height: 1, backgroundColor: "#eee", marginVertical: 12 },

  createArea: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0'
  },
  createBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#eee",
    color: "#333",
  },
  createBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  pickImageBtn: {
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    backgroundColor: '#FFF0F0', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFD6D6'
  },
  imagePreviewContainer: {
      width: 100,
      height: 56,
      marginBottom: 10,
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1,
      borderColor: '#eee'
  },
  imagePreview: {
      width: '100%',
      height: '100%'
  },
  removeImageBtn: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 10
  }
});