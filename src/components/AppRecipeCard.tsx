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
import * as Haptics from "expo-haptics"; // Thêm rung phản hồi

import AppText from "./AppText";
import { AppLightColor } from "../styles/color";
import { formatRecipeTime } from "../utils/format";

// 👇 1. Import Stores
import { useAuthStore } from "../store/useAuthStore";
import { useCollectionStore } from "../store/useCollectionStore";

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
  
  // 👇 2. Lấy dữ liệu từ Store
  const { user } = useAuthStore();
  const { savedRecipeIds, toggleSave } = useCollectionStore();

  // 👇 3. Kiểm tra xem món này đã được like chưa
  const isSaved = savedRecipeIds.includes(item.id);

  const formattedTime = formatRecipeTime(item.time, t);

  // 👇 4. Hàm xử lý khi bấm tim
  const handleToggleLike = async () => {
    if (!user) {
      Alert.alert(t("common.notification"), t("review.alert_login"));
      return;
    }

    // Tạo rung nhẹ để tăng trải nghiệm
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Gọi hàm toggle trong store
    await toggleSave(user.id, item.id);
  };

  // Component hiển thị nút Tim (Dùng chung cho cả 2 variant)
  const HeartButton = ({ isSmall = false }) => (
    <Pressable
      style={isSmall ? styles.smallHeartButton : styles.heartButton}
      onPress={(e) => {
        e.stopPropagation(); // Ngăn sự kiện click xuyên qua Card
        handleToggleLike();
      }}
    >
      {/* Thay SVG bằng Ionicons để dễ đổi màu */}
      <Ionicons
        name={isSaved ? "heart" : "heart-outline"}
        size={isSmall ? 20 : 24}
        color={isSaved ? "#FF3B30" : "#ffffff"} // Đỏ nếu đã like, Trắng nếu chưa
      />
    </Pressable>
  );

  if (isFeatured) {
    return (
      <Pressable style={[styles.featuredCard, style]} onPress={onPress}>
        <View style={styles.featuredImageWrap}>
          <Image
            source={{
              uri:
                item.thumbnail ||
                "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
            }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* 👇 Nhúng nút tim vào đây */}
          <HeartButton />
        </View>
        <View style={styles.featuredInfo}>
          <AppText variant="bold" style={styles.featuredTitle} numberOfLines={2}>
            {item.title}
          </AppText>
          <AppText variant="light" style={styles.featuredDesc} numberOfLines={2}>
            {item.description || t("recipe_detail.no_description")}
          </AppText>

          <View style={styles.metaRow}>
            <View style={styles.metaLeft}>
              <Ionicons
                name="time-outline"
                size={14}
                color={AppLightColor.primary_color}
              />
              <AppText variant="light" style={styles.metaText}>
                {formattedTime}
              </AppText>
            </View>
            <View style={styles.metaRight}>
              <AppText variant="light" style={styles.metaText}>
                {item.rating?.toFixed(1)}
              </AppText>
              <Ionicons name="star" size={14} color={AppLightColor.primary_color} />
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={[styles.smallCard, style]} onPress={onPress}>
      <View style={styles.smallImageWrap}>
        <Image
          source={{
            uri:
              item.thumbnail ||
              "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* 👇 Nhúng nút tim vào đây */}
        <HeartButton isSmall={true} />
      </View>

      <View style={styles.smallInfo}>
        <View style={styles.smallTitlePlaceholder}>
          <AppText variant="bold" style={styles.smallTitle} numberOfLines={1}>
            {item.title}
          </AppText>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <Ionicons
              name="time-outline"
              size={12}
              color={AppLightColor.primary_color}
            />
            <AppText variant="light" style={styles.metaText}>
              {formattedTime}
            </AppText>
          </View>
          <View style={styles.metaRight}>
            <AppText variant="light" style={styles.metaText}>
              {item.rating?.toFixed(1) || "0.0"}
            </AppText>
            <Ionicons name="star" size={12} color={AppLightColor.primary_color} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default AppRecipeCard;

const styles = StyleSheet.create({
  image: { width: "100%", height: "100%" },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: {
    fontSize: 12,
    color: AppLightColor.primary_color,
    fontWeight: "500",
  },

  // --- Featured ---
  featuredCard: { width: FEATURED_WIDTH },
  featuredImageWrap: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    height: 200,
  },
  // Nút tim lớn cho Featured Card
  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Nền mờ đen để icon trắng/đỏ nổi bật
    alignItems: "center",
    justifyContent: "center",
    // Loại bỏ shadow đỏ cũ, dùng style phẳng hiện đại hơn
  },
  featuredInfo: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: -20,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    height: 140,
    justifyContent: "space-between",
  },
  featuredTitle: { fontSize: 18, color: "#1a1a1a", lineHeight: 24, height: 48 },
  featuredDesc: { fontSize: 13, color: "#666", lineHeight: 18, height: 36 },

  // --- Small Card ---
  smallCard: { width: SMALL_WIDTH },
  smallImageWrap: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    height: 120,
  },
  // Nút tim nhỏ cho Small Card
  smallHeartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Nền mờ
    alignItems: "center",
    justifyContent: "center",
  },

  smallInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: -12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    height: 80,
    justifyContent: "space-between",
  },

  smallTitlePlaceholder: {
    height: 22,
    justifyContent: "center",
  },
  smallTitle: {
    fontSize: 15,
    color: "#1a1a1a",
    lineHeight: 22,
  },
});