// Nhóm 9 - IE307.Q12
import React from "react";
import { ScrollView, Pressable, StyleSheet, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";

export type CategoryItem = {
  id: string;
  label: string;
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
              navigation.navigate("CategoryDetailScreen", {
                categoryId: cat.id,
                categoryTitle: cat.label,
                categoryDbValue: cat.dbValue,
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
