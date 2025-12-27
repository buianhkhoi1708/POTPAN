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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next"; // Import hook

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { AppLightColor } from "../styles/color";
import { supabase } from "../config/supabaseClient";

// --- DỮ LIỆU NGUYÊN LIỆU ---
// Lưu ý: 'items' là giá trị dùng để search trong DB nên giữ nguyên tiếng Việt (trừ khi DB hỗ trợ song ngữ)
// 'labelKey' dùng để hiển thị tiêu đề nhóm đa ngôn ngữ
const INGREDIENT_GROUPS = [
  { 
    id: "1", 
    labelKey: "fridge.group_meat", // Key dịch
    icon: "restaurant-outline", 
    items: ["Thịt bò", "Thịt lợn", "Gà", "Vịt", "Trứng", "Xúc xích"] 
  },
  { 
    id: "2", 
    labelKey: "fridge.group_veg", 
    icon: "leaf-outline", 
    items: ["Cà rốt", "Khoai tây", "Hành tây", "Cà chua", "Súp lơ", "Rau muống", "Cải thìa"] 
  },
  { 
    id: "3", 
    labelKey: "fridge.group_seafood", 
    icon: "boat-outline", 
    items: ["Tôm", "Cá hồi", "Mực", "Cua", "Nao", "Cá thu"] 
  },
  { 
    id: "4", 
    labelKey: "fridge.group_spice", 
    icon: "flask-outline", 
    items: ["Đậu phụ", "Bún", "Mì", "Nấm", "Phô mai", "Hành lá", "Tỏi"] 
  },
];

// --- COMPONENT CON ---
const IngredientChip = React.memo(({ item, isSelected, onPress }: {
  item: string;
  isSelected: boolean;
  onPress: (item: string) => void;
}) => (
  <Pressable
    onPress={() => onPress(item)}
    style={[styles.chip, isSelected && styles.chipActive]}
    android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
  >
    <AppText style={[styles.chipText, isSelected && styles.chipTextActive]}>
      {item}
    </AppText>
    {isSelected && (
      <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon} />
    )}
  </Pressable>
));

const IngredientGroup = React.memo(({ group, selectedItems, onToggle, title }: {
  group: typeof INGREDIENT_GROUPS[0];
  selectedItems: string[];
  onToggle: (name: string) => void;
  title: string; // Nhận title đã dịch từ cha
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={group.icon as any} size={20} color={AppLightColor.primary_color} />
      <AppText variant="bold" style={styles.sectionName}>
        {title}
      </AppText>
    </View>
    <View style={styles.chipContainer}>
      {group.items.map((item) => (
        <IngredientChip
          key={item}
          item={item}
          isSelected={selectedItems.includes(item)}
          onPress={onToggle}
        />
      ))}
    </View>
  </View>
));

// --- COMPONENT CHÍNH ---
const FridgeScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation(); // Hook dịch

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleIngredient = useCallback((name: string) => {
    setSelectedItems(prev => 
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  }, []);

  const selectedCount = useMemo(() => selectedItems.length, [selectedItems]);

  const findRecipes = async () => {
    if (selectedCount === 0) {
      // Dịch Alert
      Alert.alert(t("common.alert"), t("fridge.select_at_least_one"));
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("find_recipes_by_ingredients", {
        selected_ingredients: selectedItems,
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        Alert.alert(t("common.no_results"), t("fridge.no_recipes"));
        return;
      }

      navigation.navigate("SearchResultScreen", { 
        recipes: data, 
        title: t("fridge.suggested_title"), // Title màn hình kết quả
        searchQuery: selectedItems.join(", "),
        isFridgeSearch: true
      });
    } catch (error: any) {
      console.error("Find recipes error:", error);
      Alert.alert(t("common.error"), t("common.error_occurred"));
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    if (selectedCount > 0) setSelectedItems([]);
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <AppText variant="bold" style={styles.headerTitle}>
            {t("fridge.screen_title")}
          </AppText>
        </View>

        {/* Content */}
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Intro */}
          <View style={styles.introBox}>
            <Ionicons name="bulb-outline" size={24} color={AppLightColor.primary_color} />
            <AppText style={styles.introText}>
              {t("fridge.intro_text")}
            </AppText>
          </View>

          {/* Preview Selected */}
          {selectedCount > 0 && (
            <View style={styles.selectedPreview}>
              <View style={styles.selectedHeader}>
                <AppText variant="bold" style={styles.selectedTitle}>
                  {t("fridge.selected_label")} ({selectedCount})
                </AppText>
                <Pressable onPress={handleClearAll} style={styles.clearBtn}>
                  <AppText style={styles.clearText}>{t("common.clear_all")}</AppText>
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedScroll}>
                {selectedItems.map((item) => (
                  <View key={item} style={styles.selectedTag}>
                    <AppText style={styles.selectedTagText}>{item}</AppText>
                    <Pressable onPress={() => toggleIngredient(item)} hitSlop={5}>
                      <Ionicons name="close" size={14} color="#666" />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Ingredient Groups - Render Dynamic Title */}
          {INGREDIENT_GROUPS.map((group) => (
            <IngredientGroup 
              key={group.id} 
              group={group} 
              title={t(group.labelKey)} // Dịch tiêu đề nhóm tại đây
              selectedItems={selectedItems} 
              onToggle={toggleIngredient} 
            />
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.selectedCount}>
              <AppText style={styles.selectedLabel}>{t("fridge.selected_short")}: </AppText>
              <AppText variant="bold" style={styles.selectedNumber}>{selectedCount}</AppText>
            </View>
            
            <Pressable 
              style={[styles.findBtn, (loading || selectedCount === 0) && styles.findBtnDisabled]} 
              onPress={findRecipes}
              disabled={loading || selectedCount === 0}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <AppText variant="bold" style={styles.findBtnText}>{t("fridge.btn_find")}</AppText>
                  <Ionicons name="restaurant" size={20} color="#fff" style={styles.findIcon} />
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
  // ... (Giữ nguyên Style cũ của bạn, không cần thay đổi)
  safeArea: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  header: {
    backgroundColor: AppLightColor.primary_color,
    paddingVertical: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
  },
  backBtn: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 18, color: "#fff", flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  introBox: { flexDirection: 'row', backgroundColor: '#FFF5F5', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  introText: { flex: 1, marginLeft: 12, color: '#666', fontSize: 14, lineHeight: 20 },
  
  selectedPreview: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16, marginBottom: 24 },
  selectedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  selectedTitle: { fontSize: 15, color: '#333' },
  clearBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  clearText: { color: AppLightColor.primary_color, fontSize: 13 },
  selectedScroll: { flexGrow: 0 },
  selectedTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderWidth: 1, borderColor: '#E9ECEF' },
  selectedTagText: { fontSize: 13, color: '#333', marginRight: 6 },
  
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionName: { marginLeft: 8, fontSize: 17, color: '#333' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#E9ECEF', backgroundColor: '#F8F9FA', flexDirection: 'row', alignItems: 'center' },
  chipActive: { backgroundColor: AppLightColor.primary_color, borderColor: AppLightColor.primary_color },
  chipText: { fontSize: 14, color: '#495057' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  checkIcon: { marginLeft: 6 },
  
  footer: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F3F5', paddingBottom: Platform.OS === 'ios' ? 34 : 20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 8 },
  footerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  selectedCount: { flexDirection: 'row', alignItems: 'center' },
  selectedLabel: { fontSize: 15, color: '#666', marginRight: 4 },
  selectedNumber: { fontSize: 16, color: AppLightColor.primary_color },
  findBtn: { backgroundColor: AppLightColor.primary_color, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 25, flexDirection: 'row', alignItems: 'center', minWidth: 140, justifyContent: 'center', shadowColor: AppLightColor.primary_color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
  findBtnDisabled: { backgroundColor: '#CED4DA', shadowOpacity: 0.1 },
  findBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  findIcon: { marginLeft: 8 },
});