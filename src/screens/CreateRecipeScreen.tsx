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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { decode } from "base64-arraybuffer"; // 👈 Cần cài: npm install base64-arraybuffer

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { AppLightColor } from "../styles/color";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { recipeSchema } from "../utils/validationSchema";

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

  const { isEdit, recipeData } = route.params || {};

  // State lưu dữ liệu ảnh gốc để upload
  const [imageBase64, setImageBase64] = useState<string | null | undefined>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  // --- REACT HOOK FORM ---
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<RecipeFormData>({
    resolver: yupResolver(recipeSchema),
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

  // --- EFFECT: ĐỔ DỮ LIỆU KHI CHỈNH SỬA ---
  useEffect(() => {
    if (isEdit && recipeData) {
      const {
        title,
        description,
        time,
        difficulty = "Trung bình",
        category = "Món mặn",
        thumbnail,
        ingredients = [],
        steps = [],
      } = recipeData;

      reset({
        title: title || "",
        description: description || "",
        time: time || "",
        difficulty,
        category,
        thumbnail: thumbnail || "",
        ingredients:
          Array.isArray(ingredients) && ingredients.length > 0
            ? ingredients.map((ing: any, idx: number) => ({
                ...ing,
                id: ing.id ? ing.id.toString() : `ing-${Date.now()}-${idx}`,
                quantity: ing.quantity || "",
                name: ing.name || "",
              }))
            : [{ id: `ing-${Date.now()}`, quantity: "", name: "" }],
        steps:
          Array.isArray(steps) && steps.length > 0
            ? steps.map((step: any, idx: number) => ({
                ...step,
                id: step.id ? step.id.toString() : `step-${Date.now()}-${idx}`,
                title: step.title || "",
                content: step.content || "",
              }))
            : [{ id: `step-${Date.now()}`, title: "", content: "" }],
      });
    }
  }, [isEdit, recipeData, reset]);

  // --- WATCH FORM CHANGES ---
  useEffect(() => {
    const subscription = watch(() => setFormChanged(true));
    return () => subscription.unsubscribe();
  }, [watch]);

  // --- IMAGE HANDLING ---
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Cần quyền", "Ứng dụng cần quyền truy cập ảnh để tải lên.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Giảm chất lượng để upload nhanh hơn
        base64: true, // 👈 QUAN TRỌNG: Cần lấy base64 để upload
      });

      if (!result.canceled && result.assets[0].uri) {
        // Lưu URI để hiển thị preview
        setValue("thumbnail", result.assets[0].uri, { shouldValidate: true });
        // Lưu Base64 để upload sau
        setImageBase64(result.assets[0].base64);
      }
    } catch (error) {
      console.error("Lỗi chọn ảnh:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh");
    }
  };

  // --- HÀM UPLOAD ẢNH LÊN SUPABASE ---
  const uploadImageToSupabase = async (
    imageUri: string,
    base64Data: string | null | undefined
  ) => {
    // Nếu là ảnh đã có sẵn trên mạng (link http), không cần upload lại
    if (imageUri.startsWith("http")) return imageUri;

    if (!base64Data || !user) throw new Error("Thiếu dữ liệu ảnh để tải lên.");

    const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload vào bucket 'recipe_images'
    const { error: uploadError } = await supabase.storage
      .from("recipe_images")
      .upload(filePath, decode(base64Data), {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Lấy Public URL
    const { data } = supabase.storage
      .from("recipe_images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // --- INGREDIENT ACTIONS ---
  const addIngredient = () => {
    const currentIngredients = getValues("ingredients");
    setValue(
      "ingredients",
      [
        ...currentIngredients,
        {
          id: `ing-${Date.now()}-${Math.random()}`,
          quantity: "",
          name: "",
        },
      ],
      { shouldValidate: true }
    );
  };

  const removeIngredient = (id: string) => {
    const currentIngredients = getValues("ingredients");
    if (currentIngredients.length > 1) {
      setValue(
        "ingredients",
        currentIngredients.filter((item) => item.id !== id),
        { shouldValidate: true }
      );
    }
  };

  const updateIngredient = (
    id: string,
    field: "quantity" | "name",
    value: string
  ) => {
    const currentIngredients = getValues("ingredients");
    setValue(
      "ingredients",
      currentIngredients.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
      { shouldValidate: true }
    );
  };

  // --- STEP ACTIONS ---
  const addStep = () => {
    const currentSteps = getValues("steps");
    setValue(
      "steps",
      [
        ...currentSteps,
        {
          id: `step-${Date.now()}-${Math.random()}`,
          title: "",
          content: "",
        },
      ],
      { shouldValidate: true }
    );
  };

  const removeStep = (id: string) => {
    const currentSteps = getValues("steps");
    if (currentSteps.length > 1) {
      setValue(
        "steps",
        currentSteps.filter((item) => item.id !== id),
        { shouldValidate: true }
      );
    }
  };

  const updateStep = (
    id: string,
    field: "title" | "content",
    value: string
  ) => {
    const currentSteps = getValues("steps");
    setValue(
      "steps",
      currentSteps.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
      { shouldValidate: true }
    );
  };

  // --- FORM SUBMISSION ---
  const onSubmit = async (data: RecipeFormData) => {
    if (!user) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để tạo công thức");
      return;
    }

    setLoading(true);
    try {
      let finalThumbnailUrl = data.thumbnail;

      // 1. Upload ảnh nếu có thay đổi (có base64 mới)
      if (imageBase64) {
        setUploadingImage(true); // Hiển thị trạng thái đang upload
        finalThumbnailUrl = await uploadImageToSupabase(
          data.thumbnail,
          imageBase64
        );
        setUploadingImage(false);
      }

      // 2. Chuẩn bị dữ liệu lưu DB
      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        time: data.time.trim(),
        thumbnail: finalThumbnailUrl, // Dùng URL public từ Supabase
        ingredients: data.ingredients,
        steps: data.steps,
        category: data.category,
        difficulty: data.difficulty,
        cuisine: recipeData?.cuisine || "Việt Nam",
        updated_at: new Date().toISOString(),
      };

      // 3. Thực hiện Insert hoặc Update
      let error;
      if (isEdit) {
        const { error: updateError } = await supabase
          .from("recipes")
          .update({ ...payload, status: "pending" }) // Sửa xong cũng phải chờ duyệt lại
          .eq("id", recipeData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("recipes").insert({
          ...payload,
          user_id: user.id,
          status: "pending", // Mặc định là Chờ duyệt
          created_at: new Date().toISOString(),
        });
        error = insertError;
      }

      if (error) throw error;

      Alert.alert(
        "Thành công",
        "Công thức đã được gửi và đang chờ Admin duyệt!",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
              if (route.params?.onSuccess) route.params.onSuccess();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Lỗi lưu công thức:", error);
      Alert.alert("Lỗi", error.message || "Không thể lưu công thức.");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  // --- NAVIGATION GUARD ---
  const handleGoBack = () => {
    if (formChanged) {
      Alert.alert("Thoát?", "Thay đổi chưa được lưu. Bạn có chắc muốn thoát?", [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Thoát",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  // --- HELPERS RENDER ERROR ---
  const renderError = (field: keyof RecipeFormData) =>
    errors[field] ? (
      <AppText style={styles.errorText}>{errors[field]?.message}</AppText>
    ) : null;

  return (
    <AppSafeView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <AppText variant="bold" style={styles.headerTitle}>
          {isEdit ? "Chỉnh sửa công thức" : "Tạo công thức mới"}
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
                (!isValid || loading || uploadingImage) && styles.disabledBtn,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || loading || uploadingImage}
            >
              {loading || uploadingImage ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <AppText style={styles.btnPostText}>
                    {uploadingImage ? "Đang tải ảnh..." : "Đang lưu..."}
                  </AppText>
                </View>
              ) : (
                <AppText style={styles.btnPostText}>
                  {isEdit ? "Lưu thay đổi" : "Đăng bài"}
                </AppText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnCancel}
              onPress={handleGoBack}
              disabled={loading}
            >
              <AppText style={styles.btnCancelText}>Huỷ bỏ</AppText>
            </TouchableOpacity>
          </View>

          {/* IMAGE UPLOAD */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <AppText variant="bold" style={styles.label}>
                Ảnh món ăn *
              </AppText>
              {renderError("thumbnail")}
            </View>

            <TouchableOpacity
              style={[
                styles.uploadArea,
                errors.thumbnail && styles.uploadAreaError,
                watchThumbnail && styles.uploadAreaFilled,
              ]}
              onPress={pickImage}
              disabled={uploadingImage}
            >
              {watchThumbnail ? (
                <>
                  <Image
                    source={{ uri: watchThumbnail }}
                    style={styles.uploadedImage}
                  />
                  <View style={styles.imageOverlay}>
                    <MaterialIcons name="edit" size={24} color="#fff" />
                  </View>
                </>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons name="photo-camera" size={48} color="#ccc" />
                  <AppText style={styles.uploadText}>Chạm để chọn ảnh</AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* BASIC INFO */}
          <View style={styles.section}>
            <AppText variant="bold" style={styles.sectionTitle}>
              Thông tin cơ bản
            </AppText>

            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>Tên món *</AppText>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập tên món ăn"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {renderError("title")}
            </View>

            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>Mô tả *</AppText>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.textArea}
                    placeholder="Mô tả món ăn..."
                    value={value}
                    onChangeText={onChange}
                    multiline
                  />
                )}
              />
              {renderError("description")}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <AppText style={styles.inputLabel}>Thời gian *</AppText>
                <Controller
                  control={control}
                  name="time"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="30 phút"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {renderError("time")}
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <AppText style={styles.inputLabel}>Độ khó *</AppText>
                <Controller
                  control={control}
                  name="difficulty"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.selectContainer}>
                      {["Dễ", "Trung bình", "Khó"].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={[
                            styles.selectOption,
                            value === level && styles.selectOptionActive,
                          ]}
                          onPress={() => onChange(level)}
                        >
                          <AppText
                            style={[
                              styles.selectOptionText,
                              value === level && styles.selectOptionTextActive,
                            ]}
                          >
                            {level}
                          </AppText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>Danh mục *</AppText>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.selectContainer}>
                    {[
                      "Món mặn",
                      "Món canh",
                      "Tráng miệng",
                      "Bánh ngọt",
                      "Đồ uống",
                      "Ăn vặt",
                    ].map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.selectOption,
                          value === cat && styles.selectOptionActive,
                          { width: "48%", marginBottom: 8 },
                        ]}
                        onPress={() => onChange(cat)}
                      >
                        <AppText
                          style={[
                            styles.selectOptionText,
                            value === cat && styles.selectOptionTextActive,
                          ]}
                        >
                          {cat}
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
              <AppText variant="bold" style={styles.sectionTitle}>
                Nguyên liệu *
              </AppText>
              {renderError("ingredients")}
            </View>

            {watchIngredients.map((item, index) => (
              <View key={item.id} style={styles.ingredientRow}>
                <View style={styles.ingredientNumber}>
                  <AppText style={styles.ingredientNumberText}>
                    {index + 1}
                  </AppText>
                </View>
                <View style={styles.ingredientInputs}>
                  <TextInput
                    style={styles.inputSmall}
                    placeholder="Số lượng"
                    value={item.quantity}
                    onChangeText={(text) =>
                      updateIngredient(item.id, "quantity", text)
                    }
                  />
                  <TextInput
                    style={[styles.inputSmall, { flex: 1 }]}
                    placeholder="Tên nguyên liệu"
                    value={item.name}
                    onChangeText={(text) =>
                      updateIngredient(item.id, "name", text)
                    }
                  />
                </View>
                {watchIngredients.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeIngredient(item.id)}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={20}
                      color="#ff4444"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <MaterialIcons
                name="add-circle-outline"
                size={20}
                color={AppLightColor.primary_color}
              />
              <AppText style={styles.addButtonText}>Thêm nguyên liệu</AppText>
            </TouchableOpacity>
          </View>

          {/* STEPS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="bold" style={styles.sectionTitle}>
                Các bước thực hiện *
              </AppText>
              {renderError("steps")}
            </View>

            {watchSteps.map((item, index) => (
              <View key={item.id} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumber}>
                    <AppText style={styles.stepNumberText}>
                      Bước {index + 1}
                    </AppText>
                  </View>
                  {watchSteps.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeStep(item.id)}
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={20}
                        color="#ff4444"
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={[styles.input, { marginBottom: 8 }]}
                  placeholder="Tiêu đề bước"
                  value={item.title}
                  onChangeText={(text) => updateStep(item.id, "title", text)}
                />
                <TextInput
                  style={[styles.textArea, { height: 80 }]}
                  placeholder="Mô tả cách làm..."
                  value={item.content}
                  onChangeText={(text) => updateStep(item.id, "content", text)}
                  multiline
                />
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addStep}>
              <MaterialIcons
                name="add-circle-outline"
                size={20}
                color={AppLightColor.primary_color}
              />
              <AppText style={styles.addButtonText}>Thêm bước</AppText>
            </TouchableOpacity>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default CreateRecipeScreen;

// STYLES
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 16,
    backgroundColor: AppLightColor.primary_color,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, color: "#fff", fontWeight: "700" },
  container: { flex: 1 },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, color: "#1F2937", marginBottom: 4 },
  actionBar: { flexDirection: "row", gap: 12, marginBottom: 24 },
  actionBtnPost: {
    flex: 1,
    backgroundColor: AppLightColor.primary_color,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppLightColor.primary_color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionBtnCancel: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPostText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  btnCancelText: { color: "#6B7280", fontSize: 16, fontWeight: "600" },
  disabledBtn: { opacity: 0.7 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: { fontSize: 16, color: "#1F2937", fontWeight: "600" },
  inputLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    marginBottom: 6,
  },
  uploadArea: {
    height: 200,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  uploadAreaError: { borderColor: "#EF4444", backgroundColor: "#FEF2F2" },
  uploadAreaFilled: {
    borderColor: AppLightColor.primary_color,
    backgroundColor: "#F0F9FF",
  },
  uploadedImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  uploadText: {
    color: "#6B7280",
    fontSize: 16,
    marginTop: 12,
    fontWeight: "500",
  },
  inputGroup: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#fff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#fff",
    minHeight: 120,
    textAlignVertical: "top",
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
    backgroundColor: "#fff",
  },
  row: { flexDirection: "row", marginHorizontal: -4 },
  selectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  selectOption: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectOptionActive: { backgroundColor: AppLightColor.primary_color },
  selectOptionText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  selectOptionTextActive: { color: "#fff" },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
  },
  ingredientNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  ingredientNumberText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  ingredientInputs: { flex: 1, flexDirection: "row", gap: 8 },
  stepCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    backgroundColor: AppLightColor.primary_color,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stepNumberText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  removeButton: { padding: 8 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#F0F9FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppLightColor.primary_color,
    borderStyle: "dashed",
  },
  addButtonText: {
    color: AppLightColor.primary_color,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});
