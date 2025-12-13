// src/screens/CategoriesScreen.tsx
import React from "react";
import { SafeAreaView, StatusBar, FlatList, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../styles/color";
import { categories, type CategoryItem } from "../config/categoriesData";
import CategoriesHeader from "../components/CategoriesHeader";
import CategoryCard from "../components/CategoryCard";

export default function CategoriesScreen() {
  const navigation = useNavigation<any>();
  const { width } = Dimensions.get("window");

  const gap = 16;
  const paddingX = 24;
  const cardW = (width - paddingX * 2 - gap) / 2;

  const onPressItem = (item: CategoryItem) => {
    // navigation.navigate("SomeScreen", { categoryId: item.id });
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG} />

      <CategoriesHeader title="Phân loại" onBack={() => navigation.goBack()} />

      <FlatList
        data={categories}
        keyExtractor={(it) => it.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: paddingX, paddingTop: 10, paddingBottom: 110 }}
        columnWrapperStyle={{ gap }}
        renderItem={({ item }) => (
          <CategoryCard item={item} width={cardW} onPress={onPressItem} />
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG },
});
