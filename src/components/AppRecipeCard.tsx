// Nhóm 9 - IE307.Q12
import React from "react";
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  ViewStyle,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import AppText from "./AppText";
import { formatRecipeTime } from "../utils/format";
import { useAuthStore } from "../store/useAuthStore";
import { useCollectionStore } from "../store/useCollectionStore";
import { useThemeStore } from "../store/useThemeStore";

type Recipe = {
  id: any;
  title: string;
  thumbnail: string | null;
  time: string | number;
  rating: number;
  description?: string;
};

const { width: SCREEN_W } = Dimensions.get("window");
const FEATURED_WIDTH = SCREEN_W - 40;
const SMALL_WIDTH = 190;

interface RecipeCardProps {
  item: Recipe;
  onPress: () => void;
  variant?: "featured" | "small";
  style?: ViewStyle;
}

const AppRecipeCard = ({
  item,
  onPress,
  variant = "small",
  style,
}: RecipeCardProps) => {
  const isFeatured = variant === "featured";
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const { savedRecipeIds, toggleSave } = useCollectionStore();

  const isSaved = savedRecipeIds.includes(item.id);
  const formattedTime = formatRecipeTime(item.time, t);

  const handleToggleLike = async () => {
    if (!user) {
      Alert.alert(t("common.notification"), t("review.alert_login"));
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggleSave(user.id, item.id);
  };

  const HeartButton = ({ isSmall = false }) => (
    <Pressable
      style={isSmall ? styles.smallHeartButton : styles.heartButton}
      onPress={(e) => {
        e.stopPropagation();
        handleToggleLike();
      }}
    >
      <Ionicons
        name={isSaved ? "heart" : "heart-outline"}
        size={isSmall ? 20 : 24}
        color={isSaved ? "#FF3B30" : "#ffffff"}
      />
    </Pressable>
  );

  if (isFeatured) {
    return (
      <Pressable style={[styles.featuredCard, style]} onPress={onPress}>
        <View
          style={[
            styles.featuredImageWrap,
            { backgroundColor: isDarkMode ? "#333" : "#f5f5f5" },
          ]}
        >
          <Image
            source={{
              uri:
                item.thumbnail ||
                "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
            }}
            style={[styles.image, isDarkMode && { opacity: 0.9 }]}
            resizeMode="cover"
          />
          <HeartButton />
        </View>
        <View
          style={[
            styles.featuredInfo,
            {
              backgroundColor: theme.background_contrast,
              borderColor: theme.border,
              // Tắt shadow ở Dark Mode để tránh bị bẩn viền
              shadowOpacity: isDarkMode ? 0 : 0.1,
            },
          ]}
        >
          {/* 👇 Title màu động */}
          <AppText
            variant="bold"
            style={[styles.featuredTitle, { color: theme.primary_text }]}
            numberOfLines={2}
          >
            {item.title}
          </AppText>
          {/* 👇 Mô tả màu placeholder */}
          <AppText
            variant="light"
            style={[styles.featuredDesc, { color: theme.placeholder_text }]}
            numberOfLines={2}
          >
            {item.description || t("recipe_detail.no_description")}
          </AppText>

          <View style={styles.metaRow}>
            <View style={styles.metaLeft}>
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.primary_color} // Dùng màu từ theme thay vì AppLightColor
              />
              <AppText
                variant="light"
                style={[styles.metaText, { color: theme.primary_color }]}
              >
                {formattedTime}
              </AppText>
            </View>
            <View style={styles.metaRight}>
              <AppText
                variant="light"
                style={[styles.metaText, { color: theme.primary_color }]}
              >
                {item.rating?.toFixed(1)}
              </AppText>
              <Ionicons name="star" size={14} color={theme.primary_color} />
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={[styles.smallCard, style]} onPress={onPress}>
      <View
        style={[
          styles.smallImageWrap,
          { backgroundColor: isDarkMode ? "#333" : "#f5f5f5" },
        ]}
      >
        <Image
          source={{
            uri:
              item.thumbnail ||
              "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200",
          }}
          style={[styles.image, isDarkMode && { opacity: 0.9 }]}
          resizeMode="cover"
        />
        <HeartButton isSmall={true} />
      </View>

      <View
        style={[
          styles.smallInfo,
          {
            backgroundColor: theme.background_contrast,
            borderColor: theme.border,
            shadowOpacity: isDarkMode ? 0 : 0.1,
          },
        ]}
      >
        <View style={styles.smallTitlePlaceholder}>
          <AppText
            variant="bold"
            style={[styles.smallTitle, { color: theme.primary_text }]}
            numberOfLines={1}
          >
            {item.title}
          </AppText>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <Ionicons
              name="time-outline"
              size={12}
              color={theme.primary_color}
            />
            <AppText
              variant="light"
              style={[styles.metaText, { color: theme.primary_color }]}
            >
              {formattedTime}
            </AppText>
          </View>
          <View style={styles.metaRight}>
            <AppText
              variant="light"
              style={[styles.metaText, { color: theme.primary_color }]}
            >
              {item.rating?.toFixed(1) || "0.0"}
            </AppText>
            <Ionicons name="star" size={12} color={theme.primary_color} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default AppRecipeCard;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4 
  },
  metaRight: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4 
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
  },

  featuredCard: { 
    width: FEATURED_WIDTH 
  },
  featuredImageWrap: {
    borderRadius: 20,
    overflow: "hidden",
    height: 200,
  },
  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  featuredInfo: {
    borderRadius: 16,
    padding: 16,
    marginTop: -20,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    height: 140,
    justifyContent: "space-between",
  },
  featuredTitle: { 
    fontSize: 18, 
    lineHeight: 24, 
    height: 48 
  },
  featuredDesc: { 
    fontSize: 13, 
    lineHeight: 18, 
    height: 36 
  },

  smallCard: { width: SMALL_WIDTH },
  smallImageWrap: {
    borderRadius: 12,
    overflow: "hidden",
    height: 120,
  },
  smallHeartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  smallInfo: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: -12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    height: 80,
    justifyContent: "space-between",
  },
  smallTitlePlaceholder: {
    height: 22,
    justifyContent: "center",
  },
  smallTitle: {
    fontSize: 15,
    lineHeight: 22,
  },
});
