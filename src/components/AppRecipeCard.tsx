import React from "react";
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  ViewStyle,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";
import SaveIcon from "../assets/images/save.svg";
// 👇 1. Import Hook dịch
import { useTranslation } from "react-i18next";
import { formatRecipeTime } from "../utils/format";

type Recipe = {
  id: any;
  title: string;
  thumbnail: string | null;
  time: string | number; // Chấp nhận cả string hoặc number từ DB
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

  // 👇 2. Khởi tạo hàm t
  const { t } = useTranslation();

const formattedTime = formatRecipeTime(item.time, t);

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
          <Pressable style={styles.heartButton}>
            <SaveIcon width={22} height={22} stroke="#ffffff" fill="none" />
          </Pressable>
        </View>
        <View style={styles.featuredInfo}>
          <AppText
            variant="bold"
            style={styles.featuredTitle}
            numberOfLines={2}
          >
            {item.title}
          </AppText>
          <AppText
            variant="light"
            style={styles.featuredDesc}
            numberOfLines={2}
          >
            {item.description || "Món ngon hấp dẫn..."}
          </AppText>

          <View style={styles.metaRow}>
            <View style={styles.metaLeft}>
              <Ionicons
                name="time-outline"
                size={14}
                color={AppLightColor.primary_color}
              />
              {/* 👇 Hiển thị thời gian đã dịch */}
              <AppText variant="light" style={styles.metaText}>
                {formattedTime}
              </AppText>
            </View>
            <View style={styles.metaRight}>
              <AppText variant="light" style={styles.metaText}>
                {item.rating.toFixed(1)}
              </AppText>
              <Ionicons
                name="star"
                size={14}
                color={AppLightColor.primary_color}
              />
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
        <Pressable style={styles.smallHeartButton}>
          <SaveIcon width={20} height={20} stroke="#ffffff" fill="none" />
        </Pressable>
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
            {/* 👇 Hiển thị thời gian đã dịch */}
            <AppText variant="light" style={styles.metaText}>
              {formattedTime}
            </AppText>
          </View>
          <View style={styles.metaRight}>
            <AppText variant="light" style={styles.metaText}>
              {item.rating?.toFixed(1) || "0.0"}
            </AppText>
            <Ionicons
              name="star"
              size={12}
              color={AppLightColor.primary_color}
            />
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
  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 59, 48, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    height: 140, // Height cho Featured (giữ nguyên vì nó to)
    justifyContent: "space-between",
  },
  featuredTitle: { fontSize: 18, color: "#1a1a1a", lineHeight: 24, height: 48 },
  featuredDesc: { fontSize: 13, color: "#666", lineHeight: 18, height: 36 },

  // --- Small Card (Đã update cho 1 dòng) ---
  smallCard: { width: SMALL_WIDTH },
  smallImageWrap: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    height: 120,
  },
  smallHeartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 59, 48, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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

    // 👇 UPDATE QUAN TRỌNG NHẤT Ở ĐÂY
    height: 80, // Giảm từ 96 xuống 80 (đủ cho 1 dòng tên + meta)
    justifyContent: "space-between",
  },

  smallTitlePlaceholder: {
    // 👇 Chiều cao cố định đúng 1 dòng
    height: 22,
    justifyContent: "center",
  },
  smallTitle: {
    fontSize: 15,
    color: "#1a1a1a",
    // 👇 Line height khớp với placeholder
    lineHeight: 22,
  },
});
