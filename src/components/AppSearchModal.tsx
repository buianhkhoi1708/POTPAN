// Nhóm 9 - IE307.Q12
import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; 
import AppText from "./AppText";
import { AppFonts } from "../styles/fonts";
import { useThemeStore } from "../store/useThemeStore";

export interface SearchFilters {
  keyword: string;
  category: string | null;
  time: string | null;
  difficulty: string | null;
  cuisine: string | null;
}

interface SearchRecipeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (filters: SearchFilters) => void;
}

const AppSearchModal: React.FC<SearchRecipeModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const filterCategories = useMemo(() => [
    { id: "Món mặn", label: t("data_map.category.Món mặn") },
    { id: "Món canh", label: t("data_map.category.Món canh") },
    { id: "Tráng miệng", label: t("data_map.category.Tráng miệng") },
    { id: "Bánh ngọt", label: t("data_map.category.Bánh ngọt") },
    { id: "Đồ uống", label: t("data_map.category.Đồ uống") },
    { id: "Ăn vặt", label: t("data_map.category.Ăn vặt") },
  ], [t]);

  const filterCuisine = useMemo(() => [
    { id: "Vietnam", label: t("search.filters.cuisine_vn") },
    { id: "International", label: t("search.filters.cuisine_int") },
  ], [t]);

  const filterDifficulty = useMemo(() => [
    { id: "Dễ", label: t("data_map.difficulty.easy") },
    { id: "Trung bình", label: t("data_map.difficulty.medium") },
    { id: "Khó", label: t("data_map.difficulty.hard") },
  ], [t]);
 
  const filterTime = useMemo(() => [
    { id: "under_30", label: t("time.under_30") },
    { id: "30_60", label: t("time.30_60") },
    { id: "over_60", label: t("time.over_60") },
  ], [t]);

  const handleReset = () => {
    setKeyword("");
    setSelectedCategory(null);
    setSelectedTime(null);
    setSelectedDifficulty(null);
    setSelectedCuisine(null);
  };

  const handleSubmit = () => {
    const filters: SearchFilters = {
      keyword: keyword.trim(),
      category: selectedCategory,
      time: selectedTime,
      difficulty: selectedDifficulty,
      cuisine: selectedCuisine,
    };
    onSubmit(filters);
    onClose();
  };

  const renderFilterSection = (
    title: string,
    options: { id: string; label: string }[],
    selected: string | null,
    onSelect: (id: string | null) => void
  ) => (
    <View style={styles.sectionContainer}>
      <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary_text }]}>
        {title}
      </AppText>
      <View style={styles.chipContainer}>
        {options.map((item) => {
          const isActive = selected === item.id;
          return (
            <Pressable
              key={item.id}
              style={[
                styles.chip,
                { 
                    backgroundColor: isActive 
                        ? (isDarkMode ? theme.background : "#fff0f0") 
                        : theme.background_contrast 
                },
                isActive && { borderColor: theme.primary_color, borderWidth: 1 }
              ]}
              onPress={() => onSelect(isActive ? null : item.id)}
            >
              <AppText
                variant={isActive ? "bold" : "light"}
                style={[
                    styles.chipText, 
                    { color: isActive ? theme.primary_color : theme.primary_text }
                ]}
              >
                {item.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropLayer} onPress={onClose} />
          
          <View style={[styles.sheet, { backgroundColor: theme.background }]}>
            
            <View style={[
                styles.searchBar, 
                { 
                    backgroundColor: isDarkMode ? theme.background_contrast : "#fff0f0", 
                    borderColor: isDarkMode ? theme.border : "#ffe3e2" 
                }
            ]}>
              <Ionicons name="search" size={20} color={theme.primary_color} />
              <TextInput
                value={keyword}
                onChangeText={setKeyword}
                placeholder={t("search.placeholder")} 
                placeholderTextColor={theme.placeholder_text}
                style={[styles.searchInput, { color: theme.primary_text }]}
                returnKeyType="search"
                onSubmitEditing={handleSubmit}
              />
              {keyword.length > 0 && (
                <Pressable onPress={() => setKeyword("")}>
                  <Ionicons name="close-circle" size={18} color={theme.placeholder_text} />
                </Pressable>
              )}
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {renderFilterSection(t("search.sections.category"), filterCategories, selectedCategory, setSelectedCategory)}
              {renderFilterSection(t("search.sections.cuisine"), filterCuisine, selectedCuisine, setSelectedCuisine)}
              {renderFilterSection(t("search.sections.difficulty"), filterDifficulty, selectedDifficulty, setSelectedDifficulty)}
              {renderFilterSection(t("search.sections.time"), filterTime, selectedTime, setSelectedTime)}
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: theme.border }]}>
              <Pressable style={styles.resetBtn} onPress={handleReset}>
                <AppText style={[styles.resetText, { color: theme.placeholder_text }]}>{t("search.reset")}</AppText>
              </Pressable>
              <Pressable style={[styles.submitBtn, { backgroundColor: theme.primary_color }]} onPress={handleSubmit}>
                <AppText variant="bold" style={styles.submitText}>
                  {t("search.apply")}
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AppSearchModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdropLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: AppFonts.RobotoMedium,
    height: 40,
  },
  scrollContent: { marginBottom: 10 },
  sectionContainer: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "700",
  },
  chipContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 8 
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    marginRight: 8,
  },
  chipActive: {

  },
  chipText: { fontSize: 13 },
  chipTextActive: { 

  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  resetBtn: { 
    padding: 10 
  },
  resetText: { 
    fontSize: 14, 
    textDecorationLine: "underline" 
  },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  submitText: { 
    color: "#fff", 
    fontSize: 15 
  },
});