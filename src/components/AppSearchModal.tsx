// src/components/SearchRecipeModal.tsx

import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";
import { AppFonts } from "../styles/fonts";
import SearchActiveIcon from "../assets/images/search-active.svg";

interface SearchRecipeModalProps {
  visible: boolean;
  onClose: () => void;
  suggestions?: string[];
  onSubmit?: (keyword: string) => void;
  onSelectSuggestion?: (keyword: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  "Thịt kho tàu",
  "Bò kho",
  "Canh chua",
  "Mực xào",
  "Cá kho tộ",
  "Bánh bao thịt",
  "Gà kho gừng",
  "Kho quẹt",
  "Mì xào bò",
];

const AppSearchModal= ({
  visible,
  onClose,
  suggestions = DEFAULT_SUGGESTIONS,
  onSubmit,
  onSelectSuggestion,
} : SearchRecipeModalProps) => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = () => {
    onSubmit?.(keyword.trim());
    onClose();
  };

  const handleSelectSuggestion = (value: string) => {
    setKeyword(value);
    onSelectSuggestion?.(value);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet}>
          {/* ô search */}
          <View style={styles.searchBar}>
            <SearchActiveIcon
              width={18}
              height={18}
              stroke={AppLightColor.primary_color}
              fill="none"
            />
            <TextInput
              value={keyword}
              onChangeText={setKeyword}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#ffb6b3"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
            />
          </View>

          {/* tiêu đề gợi ý – đậm hơn */}
          <AppText variant="bold" style={styles.sectionTitle}>
            Các công thức gợi ý
          </AppText>

          {/* các chip gợi ý */}
          <ScrollView
            style={styles.chipScroll}
            contentContainerStyle={styles.chipContainer}
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((item) => (
              <Pressable
                key={item}
                style={styles.chip}
                onPress={() => handleSelectSuggestion(item)}
              >
                <AppText variant="light" style={styles.chipText}>
                  {item}
                </AppText>
              </Pressable>
            ))}
          </ScrollView>

          {/* nút Tìm kiếm */}
          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <AppText variant="bold" style={styles.submitText}>
              Tìm kiếm
            </AppText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AppSearchModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  sheet: {
    width: "94%",
    minHeight: "42%",
    borderRadius: 24,
    backgroundColor: "#ffffff",
    paddingHorizontal: 22,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe3e2",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 4,
    fontSize: 15,
    color: AppLightColor.primary_color, // chữ nhập vào màu chính
    fontFamily: AppFonts.RobotoMedium,  // đậm hơn
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: AppLightColor.primary_text,
  },
  chipScroll: {
    maxHeight: 200,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
    columnGap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#ffe3e2",
  },
  chipText: {
    fontSize: 14,
    color: AppLightColor.primary_color, // màu giữ nguyên
  },
  submitBtn: {
    marginTop: 20,
    alignSelf: "center",
    paddingHorizontal: 44,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: AppLightColor.primary_color,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 15,
  },
});