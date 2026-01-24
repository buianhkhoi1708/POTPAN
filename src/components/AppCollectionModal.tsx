// Nhóm 9 - IE307.Q12
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
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import AppText from "./AppText";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

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
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible && user) {
      fetchCollections();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,
        stiffness: 100,
      }).start();
    }
  }, [visible, user]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
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

    if (!error && data) setCollections(data);
    setLoading(false);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("collection_modal.permission_title"),
          t("collection_modal.permission_desc")
        );
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
      const { error } = await supabase.storage
        .from("collection-images")
        .upload(fileName, decode(base64Data), {
          contentType: "image/jpeg",
          upsert: true,
        });
      if (error) throw error;
      const { data: publicData } = supabase.storage
        .from("collection-images")
        .getPublicUrl(fileName);
      return publicData.publicUrl;
    } catch (error: any) {
      Alert.alert(
        t("collection_modal.upload_error"),
        t("collection_modal.network_error")
      );
      return null;
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    setCreating(true);
    let imageUrl = null;
    try {
      if (imageBase64) imageUrl = await uploadImageToSupabase(imageBase64);
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
      Alert.alert(t("common.error"), t("collection_modal.create_error"));
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
      handleClose();
    } catch (error) {
      Alert.alert(t("common.error"), t("collection_modal.save_error"));
    }
  };

  const renderItem = ({ item }: { item: Collection }) => (
    <Pressable
      style={styles.collectionItem}
      onPress={() => handleSaveToCollection(item.id)}
    >
      <View
        style={[
          styles.folderIcon,
          { backgroundColor: theme.background_contrast },
        ]}
      >
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Ionicons name="folder-open" size={24} color={theme.primary_color} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <AppText
          variant="bold"
          style={[styles.collectionName, { color: theme.primary_text }]}
        >
          {item.name}
        </AppText>
        <AppText style={[styles.subText, { color: theme.placeholder_text }]}>
          {t("collection_modal.save_here")}
        </AppText>
      </View>
      <Ionicons
        name="add-circle-outline"
        size={24}
        color={theme.placeholder_text}
      />
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.background,
                paddingBottom: insets.bottom + 20,
                transform: [{ translateY: translateY }],
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.header}>
              <AppText
                variant="bold"
                style={[styles.title, { color: theme.primary_text }]}
              >
                {t("collection_modal.title")}
              </AppText>
              <Pressable onPress={handleClose} style={{ padding: 4 }}>
                <Ionicons name="close" size={24} color={theme.primary_text} />
              </Pressable>
            </View>

            {loading ? (
              <ActivityIndicator
                color={theme.primary_color}
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

            <View style={[styles.createArea, { borderTopColor: theme.border }]}>
              <AppText
                variant="bold"
                style={{
                  marginBottom: 8,
                  fontSize: 14,
                  color: theme.primary_text,
                }}
              >
                {t("collection_modal.create_new")}
              </AppText>

              {selectedImage && (
                <View
                  style={[
                    styles.imagePreviewContainer,
                    { borderColor: theme.border },
                  ]}
                >
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.imagePreview}
                  />
                  <Pressable
                    style={styles.removeImageBtn}
                    onPress={() => {
                      setSelectedImage(null);
                      setImageBase64(null);
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#fff" />
                  </Pressable>
                </View>
              )}

              <View style={styles.createBox}>
                <Pressable
                  style={[
                    styles.pickImageBtn,
                    {
                      backgroundColor: isDarkMode
                        ? theme.background_contrast
                        : "#FFF0F0",
                      borderColor: isDarkMode ? theme.border : "#FFD6D6",
                    },
                  ]}
                  onPress={pickImage}
                >
                  <Ionicons
                    name="image-outline"
                    size={24}
                    color={theme.primary_color}
                  />
                </Pressable>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.background_contrast,
                      borderColor: theme.border,
                      color: theme.primary_text,
                    },
                  ]}
                  placeholder={t("collection_modal.placeholder_name")}
                  placeholderTextColor={theme.placeholder_text}
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                />
                <Pressable
                  style={[
                    styles.createBtn,
                    { backgroundColor: theme.primary_color },
                  ]}
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
  },

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
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  collectionName: {
    fontSize: 16,
  },
  subText: {
    fontSize: 12,
  },
  createArea: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  createBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
  },
  createBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pickImageBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  imagePreviewContainer: {
    width: 100,
    height: 56,
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageBtn: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
  },
});
