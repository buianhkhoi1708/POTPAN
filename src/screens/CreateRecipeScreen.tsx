import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Controller, useForm, Resolver} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { decode } from "base64-arraybuffer";
import { useTranslation } from "react-i18next"; 

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { getRecipeSchema } from "../utils/validationSchema";

// 👇 1. Import Theme Store
import { useThemeStore } from "../store/useThemeStore";

// --- TYPES ---
interface IngredientItem {
  id: string;
  quantity: string;
  name: string;
  unit?: string;
}

interface StepItem {
  id: string;
  title: string;
  content: string;
  duration?: string;
}

interface RecipeFormData {
  title: string;
  description: string;
  time: string;
  difficulty: string;
  category: string;
  thumbnail: string;
  ingredients: IngredientItem[];
  steps: StepItem[];
}

const CreateRecipeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  // 👇 2. Lấy Theme
  const { theme, isDarkMode } = useThemeStore();

  const { isEdit, recipeData } = route.params || {};

  // State
  const [imageBase64, setImageBase64] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  const DIFFICULTY_OPTIONS = [
    { value: "Dễ", labelKey: "easy" },
    { value: "Trung bình", labelKey: "medium" },
    { value: "Khó", labelKey: "hard" },
  ];

  const CATEGORY_OPTIONS = [
    { value: "Món mặn", labelKey: "Món mặn" },
    { value: "Món canh", labelKey: "Món canh" },
    { value: "Tráng miệng", labelKey: "Tráng miệng" },
    { value: "Bánh ngọt", labelKey: "Bánh ngọt" },
    { value: "Đồ uống", labelKey: "Đồ uống" },
    { value: "Ăn vặt", labelKey: "Ăn vặt" },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<RecipeFormData>({
    resolver: yupResolver(getRecipeSchema(t)) as unknown as Resolver<RecipeFormData>,
    defaultValues: {
      title: "",
      description: "",
      time: "",
      difficulty: "Trung bình",
      category: "Món mặn",
      thumbnail: "",
      ingredients: [{ id: `ing-${Date.now()}`, quantity: "", name: "" }],
      steps: [{ id: `step-${Date.now()}`, title: "", content: "" }],
    },
    mode: "onChange",
  });

  const watchIngredients = watch("ingredients");
  const watchSteps = watch("steps");
  const watchThumbnail = watch("thumbnail");

  useEffect(() => {
    if (isEdit && recipeData) {
        // ... (Logic reset form giữ nguyên)
        reset({
            title: recipeData.title || "",
            description: recipeData.description || "",
            time: recipeData.time || "",
            difficulty: recipeData.difficulty || "Trung bình",
            category: recipeData.category || "Món mặn",
            thumbnail: recipeData.thumbnail || "",
            ingredients: Array.isArray(recipeData.ingredients) ? recipeData.ingredients : [{ id: `ing-${Date.now()}`, quantity: "", name: "" }],
            steps: Array.isArray(recipeData.steps) ? recipeData.steps : [{ id: `step-${Date.now()}`, title: "", content: "" }],
        });
    }
  }, [isEdit, recipeData, reset]);

  useEffect(() => {
    const subscription = watch(() => setFormChanged(true));
    return () => subscription.unsubscribe();
  }, [watch]);

  // ... (Các hàm pickImage, uploadImageToSupabase, add/remove Ingredient/Step giữ nguyên logic)
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return Alert.alert(t("alert.permission_required"), t("alert.permission_desc_photo"));
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true,
      });
      if (!result.canceled && result.assets[0].uri) {
        setValue("thumbnail", result.assets[0].uri, { shouldValidate: true });
        setImageBase64(result.assets[0].base64);
      }
    } catch (error) { Alert.alert(t("alert.error_title"), t("alert.pick_image_error")); }
  };

  const uploadImageToSupabase = async (imageUri: string, base64Data: string | null | undefined) => {
    if (imageUri.startsWith("http")) return imageUri;
    if (!base64Data || !user) throw new Error("Missing image data");
    const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("recipe_images").upload(filePath, decode(base64Data), { contentType: `image/${fileExt}`, upsert: true });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("recipe_images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const addIngredient = () => {
    const current = getValues("ingredients");
    setValue("ingredients", [...current, { id: `ing-${Date.now()}-${Math.random()}`, quantity: "", name: "" }], { shouldValidate: true });
  };
  const removeIngredient = (id: string) => {
    const current = getValues("ingredients");
    if (current.length > 1) setValue("ingredients", current.filter((item) => item.id !== id), { shouldValidate: true });
  };
  const updateIngredient = (id: string, field: any, value: string) => {
    const current = getValues("ingredients");
    setValue("ingredients", current.map((item) => item.id === id ? { ...item, [field]: value } : item), { shouldValidate: true });
  };

  const addStep = () => {
    const current = getValues("steps");
    setValue("steps", [...current, { id: `step-${Date.now()}-${Math.random()}`, title: "", content: "" }], { shouldValidate: true });
  };
  const removeStep = (id: string) => {
    const current = getValues("steps");
    if (current.length > 1) setValue("steps", current.filter((item) => item.id !== id), { shouldValidate: true });
  };
  const updateStep = (id: string, field: any, value: string) => {
    const current = getValues("steps");
    setValue("steps", current.map((item) => item.id === id ? { ...item, [field]: value } : item), { shouldValidate: true });
  };

  // ... (Hàm onSubmit, handleGoBack giữ nguyên logic)
  const onSubmit = async (data: RecipeFormData) => {
    if (!user) return Alert.alert(t("alert.error_title"), t("alert.login_required"));
    setLoading(true);
    try {
      let finalThumbnailUrl = data.thumbnail;
      if (imageBase64) {
        setUploadingImage(true);
        finalThumbnailUrl = await uploadImageToSupabase(data.thumbnail, imageBase64);
        setUploadingImage(false);
      }
      const payload = {
        title: data.title.trim(), description: data.description.trim(), time: data.time.trim(),
        thumbnail: finalThumbnailUrl, ingredients: data.ingredients, steps: data.steps,
        category: data.category, difficulty: data.difficulty, cuisine: recipeData?.cuisine || "Việt Nam",
        updated_at: new Date().toISOString(),
      };
      let error;
      if (isEdit) {
        const { error: uErr } = await supabase.from("recipes").update({ ...payload, status: "pending" }).eq("id", recipeData.id);
        error = uErr;
      } else {
        const { error: iErr } = await supabase.from("recipes").insert({ ...payload, user_id: user.id, status: "pending", created_at: new Date().toISOString() });
        error = iErr;
      }
      if (error) throw error;
      Alert.alert(t("alert.success_title"), t("alert.recipe_submitted"), [{ text: "OK", onPress: () => { navigation.goBack(); if (route.params?.onSuccess) route.params.onSuccess(); }}]);
    } catch (error: any) { Alert.alert(t("alert.error_title"), error.message || t("alert.save_error")); } finally { setLoading(false); setUploadingImage(false); }
  };

  const handleGoBack = () => {
    if (formChanged) {
      Alert.alert(t("alert.confirm_exit_title"), t("alert.confirm_exit_desc"), [{ text: t("common.cancel"), style: "cancel" }, { text: t("common.exit"), style: "destructive", onPress: () => navigation.goBack() }]);
    } else { navigation.goBack(); }
  };

  const renderError = (field: keyof RecipeFormData) => errors[field] ? <AppText style={styles.errorText}>{errors[field]?.message}</AppText> : null;

  // --- STYLES ĐỘNG CHO INPUT ---
  const inputStyle = [
    styles.input, 
    { 
      backgroundColor: theme.background_contrast, // Nền input khác nền chính
      color: theme.primary_text, 
      borderColor: theme.border 
    }
  ];

  return (
    // 👇 3. Background động
    <AppSafeView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.primary_text} />
        </TouchableOpacity>
        <AppText variant="bold" style={[styles.headerTitle, { color: theme.primary_text }]}>
          {isEdit ? t("create_recipe.edit_title") : t("create_recipe.new_title")}
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ACTION BUTTONS */}
          <View style={styles.actionBar}>
            <TouchableOpacity
              style={[
                styles.actionBtnPost,
                { backgroundColor: theme.primary_color },
                (!isValid || loading || uploadingImage) && styles.disabledBtn,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || loading || uploadingImage}
            >
              {loading || uploadingImage ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <AppText style={styles.btnPostText}>{uploadingImage ? t("create_recipe.uploading_image") : t("create_recipe.saving")}</AppText>
                </View>
              ) : (
                <AppText style={styles.btnPostText}>{isEdit ? t("common.save_changes") : t("create_recipe.post")}</AppText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtnCancel, { backgroundColor: theme.background_contrast }]}
              onPress={handleGoBack}
              disabled={loading}
            >
              <AppText style={[styles.btnCancelText, { color: theme.placeholder_text }]}>{t("common.cancel")}</AppText>
            </TouchableOpacity>
          </View>

          {/* IMAGE UPLOAD */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <AppText variant="bold" style={[styles.label, { color: theme.primary_text }]}>{t("create_recipe.form.thumbnail")} *</AppText>
              {renderError("thumbnail")}
            </View>

            <TouchableOpacity
              style={[
                styles.uploadArea,
                { 
                    backgroundColor: theme.background_contrast, 
                    borderColor: theme.border 
                },
                errors.thumbnail && styles.uploadAreaError,
                watchThumbnail && { borderColor: theme.primary_color, borderWidth: 2 },
              ]}
              onPress={pickImage}
              disabled={uploadingImage}
            >
              {watchThumbnail ? (
                <>
                  <Image source={{ uri: watchThumbnail }} style={styles.uploadedImage} />
                  <View style={styles.imageOverlay}>
                    <MaterialIcons name="edit" size={24} color="#fff" />
                  </View>
                </>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons name="add-photo-alternate" size={48} color={theme.placeholder_text} />
                  <AppText style={[styles.uploadText, { color: theme.placeholder_text }]}>
                    {t("create_recipe.placeholder.thumbnail")}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* BASIC INFO */}
          <View style={styles.section}>
            <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary_text }]}>{t("create_recipe.section_basic")}</AppText>

            {/* Title */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.inputLabel, { color: theme.primary_text }]}>{t("create_recipe.form.name")} *</AppText>
              <Controller
                control={control} name="title"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={inputStyle}
                    placeholder={t("create_recipe.placeholder.name")}
                    placeholderTextColor={theme.placeholder_text}
                    value={value} onChangeText={onChange}
                  />
                )}
              />
              {renderError("title")}
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.inputLabel, { color: theme.primary_text }]}>{t("create_recipe.form.description")} *</AppText>
              <Controller
                control={control} name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[inputStyle, styles.textArea]}
                    placeholder={t("create_recipe.placeholder.description")}
                    placeholderTextColor={theme.placeholder_text}
                    value={value} onChangeText={onChange} multiline
                  />
                )}
              />
              {renderError("description")}
            </View>

            {/* Time & Difficulty */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <AppText style={[styles.inputLabel, { color: theme.primary_text }]}>{t("create_recipe.form.time")} *</AppText>
                <Controller
                  control={control} name="time"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={inputStyle}
                      placeholder={t("create_recipe.placeholder.time")}
                      placeholderTextColor={theme.placeholder_text}
                      value={value} onChangeText={onChange}
                    />
                  )}
                />
                {renderError("time")}
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <AppText style={[styles.inputLabel, { color: theme.primary_text }]}>{t("create_recipe.form.difficulty")} *</AppText>
                <Controller
                  control={control} name="difficulty"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.selectContainer}>
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.selectOption,
                            { backgroundColor: theme.background_contrast, borderColor: theme.border, borderWidth: 1 },
                            value === option.value && { backgroundColor: theme.primary_color, borderColor: theme.primary_color },
                          ]}
                          onPress={() => onChange(option.value)}
                        >
                          <AppText
                            style={[
                              styles.selectOptionText,
                              { color: theme.placeholder_text },
                              value === option.value && styles.selectOptionTextActive,
                            ]}
                          >
                            {t(`data_map.difficulty.${option.labelKey}`)}
                          </AppText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <AppText style={[styles.inputLabel, { color: theme.primary_text }]}>{t("create_recipe.form.category")} *</AppText>
              <Controller
                control={control} name="category"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.selectContainer}>
                    {CATEGORY_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.selectOption,
                          { width: "48%", marginBottom: 8, backgroundColor: theme.background_contrast, borderColor: theme.border, borderWidth: 1 },
                          value === option.value && { backgroundColor: theme.primary_color, borderColor: theme.primary_color },
                        ]}
                        onPress={() => onChange(option.value)}
                      >
                        <AppText
                          style={[
                            styles.selectOptionText,
                            { color: theme.placeholder_text },
                            value === option.value && styles.selectOptionTextActive,
                          ]}
                        >
                          {t(`data_map.category.${option.labelKey}`)}
                        </AppText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
          </View>

          {/* INGREDIENTS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary_text }]}>{t("create_recipe.section_ingredients")} *</AppText>
              {renderError("ingredients")}
            </View>

            {watchIngredients.map((item, index) => (
              <View key={item.id} style={[styles.itemCard, { backgroundColor: theme.background_contrast }]}>
                <View style={[styles.numberBadge, { backgroundColor: theme.primary_color }]}>
                  <AppText style={styles.numberBadgeText}>{index + 1}</AppText>
                </View>
                <View style={{ flex: 1, gap: 8 }}>
                  <TextInput
                    style={[inputStyle, { flex: 1, height: 40, paddingVertical: 0 }]}
                    placeholder={t("create_recipe.placeholder.ing_name")}
                    placeholderTextColor={theme.placeholder_text}
                    value={item.name}
                    onChangeText={(text) => updateIngredient(item.id, "name", text)}
                  />
                  <TextInput
                    style={[inputStyle, { width: 120, height: 40, paddingVertical: 0 }]}
                    placeholder={t("create_recipe.placeholder.ing_amount")}
                    placeholderTextColor={theme.placeholder_text}
                    value={item.quantity}
                    onChangeText={(text) => updateIngredient(item.id, "quantity", text)}
                  />
                </View>
                {watchIngredients.length > 1 && (
                  <TouchableOpacity style={styles.removeButton} onPress={() => removeIngredient(item.id)}>
                    <MaterialIcons name="close" size={20} color={theme.placeholder_text} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            <TouchableOpacity 
                style={[styles.addButton, { borderColor: theme.primary_color, backgroundColor: isDarkMode ? 'transparent' : '#F0F9FF' }]} 
                onPress={addIngredient}
            >
              <MaterialIcons name="add" size={20} color={theme.primary_color} />
              <AppText style={[styles.addButtonText, { color: theme.primary_color }]}>{t("create_recipe.add_ingredient")}</AppText>
            </TouchableOpacity>
          </View>

          {/* STEPS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary_text }]}>{t("create_recipe.section_steps")} *</AppText>
              {renderError("steps")}
            </View>

            {watchSteps.map((item, index) => (
              <View key={item.id} style={[styles.stepCard, { backgroundColor: theme.background_contrast, borderColor: theme.border }]}>
                <View style={styles.stepHeader}>
                  <AppText variant="bold" style={[styles.stepTitleLabel, { color: theme.primary_color }]}>
                    {t("create_recipe.step")} {index + 1}
                  </AppText>
                  {watchSteps.length > 1 && (
                    <TouchableOpacity onPress={() => removeStep(item.id)}>
                      <MaterialIcons name="delete-outline" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <TextInput
                  style={[inputStyle, { marginBottom: 8 }]}
                  placeholder={t("create_recipe.placeholder.step_title")}
                  placeholderTextColor={theme.placeholder_text}
                  value={item.title}
                  onChangeText={(text) => updateStep(item.id, "title", text)}
                />
                <TextInput
                  style={[inputStyle, styles.textArea, { height: 80, minHeight: 80 }]}
                  placeholder={t("create_recipe.placeholder.step_desc")}
                  placeholderTextColor={theme.placeholder_text}
                  value={item.content}
                  onChangeText={(text) => updateStep(item.id, "content", text)}
                  multiline
                />
              </View>
            ))}
            
            <TouchableOpacity 
                style={[styles.addButton, { borderColor: theme.primary_color, backgroundColor: isDarkMode ? 'transparent' : '#F0F9FF' }]} 
                onPress={addStep}
            >
              <MaterialIcons name="add" size={20} color={theme.primary_color} />
              <AppText style={[styles.addButtonText, { color: theme.primary_color }]}>{t("create_recipe.add_step")}</AppText>
            </TouchableOpacity>
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default CreateRecipeScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 10,
    paddingBottom: 16,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  container: { flex: 1 },
  content: { padding: 20 },
  section: { marginBottom: 30 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, marginBottom: 4 },
  actionBar: { flexDirection: "row", gap: 12, marginBottom: 24 },
  actionBtnPost: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  actionBtnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: 'transparent'
  },
  btnPostText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  btnCancelText: { fontSize: 16, fontWeight: "600" },
  disabledBtn: { opacity: 0.6 },
  
  // Form Labels
  labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  label: { fontSize: 16, fontWeight: "600" },
  inputLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  
  // Upload Area
  uploadArea: {
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  uploadAreaError: { borderColor: "#EF4444", borderWidth: 2 },
  uploadedImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imageOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", alignItems: "center", justifyContent: "center",
  },
  uploadPlaceholder: { alignItems: "center", justifyContent: "center" },
  uploadText: { fontSize: 15, marginTop: 8, fontWeight: "500" },
  
  // Inputs
  inputGroup: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: { minHeight: 120, textAlignVertical: "top" },
  row: { flexDirection: "row", marginHorizontal: -4 },
  
  // Select Chips
  selectContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20, // Rounded pills
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectOptionText: { fontSize: 14, fontWeight: "500" },
  selectOptionTextActive: { color: "#fff", fontWeight: "700" },
  
  // Ingredient Row (Optimized)
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
  },
  numberBadge: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  numberBadgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  removeButton: { padding: 8, marginLeft: 4 },
  
  // Step Card (Optimized)
  stepCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  stepHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  stepTitleLabel: { fontSize: 15, fontWeight: "700" },
  
  // Add Button
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: 4,
  },
  addButtonText: { fontSize: 15, fontWeight: "600", marginLeft: 8 },
  errorText: { color: "#EF4444", fontSize: 12, fontWeight: "500", marginTop: 4 },
});