import React from "react";
import { ScrollView, Pressable, StyleSheet, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native"; // 1. Import hook navigation
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";

export type CategoryItem = {
  id: string;
  label: string;
  // 👇 Thêm dbValue (optional) để nếu dùng đa ngôn ngữ thì vẫn query đúng database
  dbValue?: string;
};

interface HomeCategoryListProps {
  categories: CategoryItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  style?: ViewStyle;
}

const AppCategoryList = ({
  categories,
  selectedId,
  onSelect,
  style,
}: HomeCategoryListProps) => {
  // 2. Khởi tạo navigation
  const navigation = useNavigation<any>();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.categoryRow, style]}
    >
      {categories.map((cat) => {
        const isActive = cat.id === selectedId;
        return (
          <Pressable
            key={cat.id}
            onPress={() => {
              onSelect(cat.id);

              // 👇 3. Điều hướng sang màn hình CategoryDetail
              navigation.navigate("CategoryDetailScreen", {
                categoryId: cat.id,
                categoryTitle: cat.label, // Dùng để hiển thị tiêu đề Header (Tiếng Anh/Việt đều được)
                categoryDbValue: cat.dbValue, //
              });
            }}
            style={[styles.categoryItem, isActive && styles.categoryItemActive]}
          >
            <AppText
              variant="bold"
              style={[
                styles.categoryText,
                isActive && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default AppCategoryList;

const styles = StyleSheet.create({
  categoryRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
  },
  categoryItemActive: {
    backgroundColor: AppLightColor.primary_color,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  categoryTextActive: {
    color: "#fff",
  },
});
