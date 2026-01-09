// Nhóm 9 - IE307.Q12
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { supabase } from "../config/supabaseClient";
import { useThemeStore } from "../store/useThemeStore";

const INGREDIENT_GROUPS = [
  {
    id: "1",
    labelKey: "fridge.group_meat",
    icon: "restaurant-outline",
    items: ["Thịt bò", "Thịt lợn", "Gà", "Vịt", "Trứng", "Xúc xích"],
  },
  {
    id: "2",
    labelKey: "fridge.group_veg",
    icon: "leaf-outline",
    items: [
      "Cà rốt",
      "Khoai tây",
      "Hành tây",
      "Cà chua",
      "Súp lơ",
      "Rau muống",
      "Cải thìa",
    ],
  },
  {
    id: "3",
    labelKey: "fridge.group_seafood",
    icon: "boat-outline",
    items: ["Tôm", "Cá hồi", "Mực", "Cua", "Nao", "Cá thu"],
  },
  {
    id: "4",
    labelKey: "fridge.group_spice",
    icon: "flask-outline",
    items: ["Đậu phụ", "Bún", "Mì", "Nấm", "Phô mai", "Hành lá", "Tỏi"],
  },
];

const IngredientChip = React.memo(
  ({ item, isSelected, onPress, theme, isDarkMode }: any) => (
    <Pressable
      onPress={() => onPress(item)}
      style={[
        styles.chip,
        {
          backgroundColor: isSelected
            ? theme.primary_color
            : theme.background_contrast,
          borderColor: isSelected ? theme.primary_color : theme.border,
        },
      ]}
    >
      <AppText
        style={[
          styles.chipText,
          {
            color: isSelected ? "#fff" : theme.primary_text,
            fontWeight: isSelected ? "bold" : "normal",
          },
        ]}
      >
        {item}
      </AppText>
      {isSelected && (
        <Ionicons
          name="checkmark-circle"
          size={16}
          color="#fff"
          style={styles.checkIcon}
        />
      )}
    </Pressable>
  )
);

const IngredientGroup = React.memo(
  ({ group, selectedItems, onToggle, title, theme, isDarkMode }: any) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons
          name={group.icon as any}
          size={20}
          color={theme.primary_color}
        />
        <AppText
          variant="bold"
          style={[styles.sectionName, { color: theme.primary_text }]}
        >
          {title}
        </AppText>
      </View>
      <View style={styles.chipContainer}>
        {group.items.map((item: string) => (
          <IngredientChip
            key={item}
            item={item}
            isSelected={selectedItems.includes(item)}
            onPress={onToggle}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        ))}
      </View>
    </View>
  )
);

const FridgeScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  // 👇 2. Lấy Theme
  const { theme, isDarkMode } = useThemeStore();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleIngredient = useCallback((name: string) => {
    setSelectedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  }, []);

  const selectedCount = useMemo(() => selectedItems.length, [selectedItems]);

  const findRecipes = async () => {
    // 1. Kiểm tra đầu vào: Nên chọn ít nhất 2 nguyên liệu
    if (selectedCount < 2) {
      Alert.alert(
        t("common.note"), 
        t("fridge.select_more_hint", "Vui lòng chọn ít nhất 2 nguyên liệu để có gợi ý chính xác hơn.")
      );
      return;
    }

    setLoading(true);
    try {
      // 2. Gọi hàm SQL mới
      const { data, error } = await supabase.rpc(
        "find_recipes_by_ingredients", 
        { selected_ingredients: selectedItems }
      );

      if (error) throw error;

      // 3. Xử lý khi không có kết quả
      if (!data || data.length === 0) {
        Alert.alert(
          t("common.no_results"), 
          // Thông báo giải thích rõ về logic 80%
          t("fridge.strict_filter_hint", "Không tìm thấy món nào đáp ứng đủ 80% nguyên liệu bạn chọn. Hãy thử chọn thêm các loại gia vị hoặc rau củ phổ biến xem sao!")
        );
        return;
      }

      // 4. Chuyển sang màn hình kết quả
      navigation.navigate("SearchResultScreen", {
        recipes: data,
        title: t("fridge.suggested_title"), // "Gợi ý từ tủ lạnh"
        searchQuery: selectedItems.join(", "),
        isFridgeSearch: true,
      });

    } catch (error: any) {
      console.log("Error finding recipes:", error);
      Alert.alert(t("common.error"), t("common.error_occurred"));
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    if (selectedCount > 0) setSelectedItems([]);
  };

  return (
    <AppSafeView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.primary_color}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.header, { backgroundColor: theme.primary_color }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <AppText variant="bold" style={styles.headerTitle}>
            {t("fridge.screen_title")}
          </AppText>
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={[
              styles.introBox,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.05)"
                  : "#FFF5F5",
              },
            ]}
          >
            <Ionicons
              name="bulb-outline"
              size={24}
              color={theme.primary_color}
            />
            <AppText
              style={[styles.introText, { color: theme.placeholder_text }]}
            >
              {t("fridge.intro_text")}
            </AppText>
          </View>

          {selectedCount > 0 && (
            <View
              style={[
                styles.selectedPreview,
                { backgroundColor: theme.background_contrast },
              ]}
            >
              <View style={styles.selectedHeader}>
                <AppText
                  variant="bold"
                  style={[styles.selectedTitle, { color: theme.primary_text }]}
                >
                  {t("fridge.selected_label")} ({selectedCount})
                </AppText>
                <Pressable onPress={handleClearAll} style={styles.clearBtn}>
                  <AppText
                    style={[styles.clearText, { color: theme.primary_color }]}
                  >
                    {t("common.clear_all")}
                  </AppText>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.selectedScroll}
              >
                {selectedItems.map((item) => (
                  <View
                    key={item}
                    style={[
                      styles.selectedTag,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.selectedTagText,
                        { color: theme.primary_text },
                      ]}
                    >
                      {item}
                    </AppText>
                    <Pressable onPress={() => toggleIngredient(item)}>
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.placeholder_text}
                      />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {INGREDIENT_GROUPS.map((group) => (
            <IngredientGroup
              key={group.id}
              group={group}
              title={t(group.labelKey)}
              selectedItems={selectedItems}
              onToggle={toggleIngredient}
              theme={theme}
              isDarkMode={isDarkMode}
            />
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { backgroundColor: theme.background, borderTopColor: theme.border },
          ]}
        >
          <View style={styles.footerContent}>
            <View style={styles.selectedCount}>
              <AppText
                style={[
                  styles.selectedLabel,
                  { color: theme.placeholder_text },
                ]}
              >
                {t("fridge.selected_short")}:{" "}
              </AppText>
              <AppText
                variant="bold"
                style={[styles.selectedNumber, { color: theme.primary_color }]}
              >
                {selectedCount}
              </AppText>
            </View>

            <Pressable
              style={[
                styles.findBtn,
                { backgroundColor: theme.primary_color },
                (loading || selectedCount === 0) && styles.findBtnDisabled,
              ]}
              onPress={findRecipes}
              disabled={loading || selectedCount === 0}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <AppText variant="bold" style={styles.findBtnText}>
                    {t("fridge.btn_find")}
                  </AppText>
                  <Ionicons
                    name="restaurant"
                    size={20}
                    color="#fff"
                    style={styles.findIcon}
                  />
                </>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default FridgeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  introBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  introText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  selectedPreview: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedTitle: {
    fontSize: 15,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 13,
  },
  selectedScroll: {
    flexGrow: 0,
  },
  selectedTag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
  },
  selectedTagText: {
    fontSize: 13,
    marginRight: 6,
  },

  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionName: {
    marginLeft: 8,
    fontSize: 17,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // Chip
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  chipText: {
    fontSize: 14,
  },
  checkIcon: {
    marginLeft: 6,
  },

  footer: {
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  selectedCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedLabel: {
    fontSize: 15,
    marginRight: 4,
  },
  selectedNumber: {
    fontSize: 16,
  },
  findBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 140,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  findBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  findBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  findIcon: {
    marginLeft: 8,
  },
});
