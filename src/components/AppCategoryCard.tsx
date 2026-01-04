import React from "react";
import { View, StyleSheet, Image, Pressable, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";
import { useThemeStore } from "../store/useThemeStore";
import { useTranslation } from "react-i18next";

// Định nghĩa kiểu dữ liệu cho props
interface CategoryItemProps {
  item: {
    id: string;
    name: string;
    image: any;
    recipe_count: number;
  };
  width: number; // Chiều rộng của card được tính toán từ bên ngoài
  onPress: () => void;
  style?: ViewStyle;
}

const AppCategoryCard: React.FC<CategoryItemProps> = ({ item, width, onPress, style }) => {
  const { theme, isDarkMode } = useThemeStore();
  const { t } = useTranslation();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          width: width,
          backgroundColor: theme.background_contrast,
          borderColor: theme.border,
        },
        pressed && {
          transform: [{ scale: 0.97 }],
          opacity: 0.9,
          backgroundColor: isDarkMode ? "#2d3748" : "#FAFAFA",
        },
        style,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: isDarkMode ? "#333" : "#F5F5F5" },
        ]}
      >
        <Image
          source={item.image}
          style={[styles.image, isDarkMode && { opacity: 0.85 }]}
          resizeMode="cover"
        />
      </View>

      <View style={[styles.infoWrap, { backgroundColor: theme.background_contrast }]}>
        <AppText
          variant="bold"
          style={[styles.title, { color: theme.primary_text }]}
          numberOfLines={1}
        >
          {item.name}
        </AppText>

        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <AppText style={[styles.badgeText, { color: theme.placeholder_text }]}>
              {item.recipe_count > 0
                ? `${item.recipe_count} ${t("common.items", "công thức")}`
                : t("common.empty", "0 công thức")}
            </AppText>
          </View>
          <View
            style={[
              styles.arrowBtn,
              { backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#F7F7F7" },
            ]}
          >
            <Ionicons name="arrow-forward" size={14} color={theme.placeholder_text} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default AppCategoryCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    overflow: "hidden",
  },
  imageContainer: {
    height: 140,
    width: "100%",
  },
  image: { width: "100%", height: "100%" },
  infoWrap: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "700",
    textAlign: "left",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  arrowBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});