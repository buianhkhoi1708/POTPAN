import React from "react";
import { View, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";
import { formatRecipeTime } from "../utils/format"; // Helper chúng ta đã viết

// Định nghĩa props
interface CommunityCardProps {
  item: {
    id: any;
    title: string;
    image: string | null;
    desc: string;
    authorName: string;
    time: string | number;
    difficulty: string;
    rating: number;
    originalItem: any;
  };
  onPress: () => void;
}

const { width: SCREEN_W } = Dimensions.get("window");
const H_PADDING = 20;
const IMAGE_W = 162;
const IMAGE_H = 162;
const OVERLAP = 64;
const CARD_W = SCREEN_W - H_PADDING * 2;
const CONTENT_W = CARD_W - IMAGE_W + OVERLAP;

const AppCommunityCard: React.FC<CommunityCardProps> = ({ item, onPress }) => {
  const { t } = useTranslation();

  // Áp dụng helper format thời gian
  const formattedTime = formatRecipeTime(item.time, t);

  const getDifficultyKey = (val: string) => {
    const value = val?.toLowerCase();
    if (value === "dễ") return "easy";
    if (value === "trung bình") return "medium";
    if (value === "khó") return "hard";
    return "medium"; // Mặc định
  };

  const diffKey = getDifficultyKey(item.difficulty);

  return (
    <Pressable style={styles.row} onPress={onPress}>
      {/* Hình ảnh bên trái */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/300" }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Nội dung bên phải (đè lên ảnh một chút) */}
      <View style={styles.contentCard}>
        <View style={styles.textContainer}>
          <AppText variant="bold" style={styles.title} numberOfLines={2}>
            {item.title}
          </AppText>

          <AppText variant="light" style={styles.desc} numberOfLines={1}>
            {item.desc}
          </AppText>

          <AppText variant="light" style={styles.author} numberOfLines={1}>
            {t("community.by")} {item.authorName}
          </AppText>
        </View>

        {/* Thông số Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={AppLightColor.primary_color} />
            <AppText variant="medium" style={styles.metaText}>
              {formattedTime}
            </AppText>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="bar-chart-outline" size={14} color={AppLightColor.primary_color} />
            <AppText variant="medium" style={styles.metaText}>
              {/* Giả sử difficulty truyền vào là 'easy', 'medium', 'hard' */}
              {t(`common1.difficulty.${diffKey}`)}
            </AppText>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <AppText variant="medium" style={styles.metaText}>
              {item.rating?.toFixed(1)}
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default AppCommunityCard;

const styles = StyleSheet.create({
  row: {
    width: CARD_W,
    height: IMAGE_H,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrap: {
    width: IMAGE_W,
    height: IMAGE_H,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#eee",
    zIndex: 3,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  image: { width: "100%", height: "100%" },
  contentCard: {
    width: CONTENT_W,
    height: 140,
    marginLeft: -OVERLAP,
    borderWidth: 1.5,
    borderColor: AppLightColor.primary_color,
    borderRadius: 26,
    paddingTop: 12,
    paddingBottom: 10,
    paddingRight: 12,
    paddingLeft: 12 + OVERLAP,
    backgroundColor: "#fff",
    zIndex: 2,
    justifyContent: "space-between",
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, color: AppLightColor.primary_text, marginBottom: 4 },
  desc: { fontSize: 12, color: "#666", marginBottom: 4 },
  author: { fontSize: 11, color: AppLightColor.primary_color, fontWeight: "600" },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, color: "#666", fontWeight: "600" },
});