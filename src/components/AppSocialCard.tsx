import React, { useState, memo } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";

// Định nghĩa kiểu dữ liệu cho bài viết
export type SocialPostType = {
  id: any;
  title: string;
  image: string | null;
  desc: string;
  authorName: string;
  authorAvatar: string | null;
  time: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean; // Trạng thái người dùng đã like chưa
  originalItem: any;
};

interface Props {
  item: SocialPostType;
  onPress: () => void;
  onLikePress: (id: any, newStatus: boolean) => void;
  onCommentPress: () => void;
}

const AppSocialCard: React.FC<Props> = ({
  item,
  onPress,
  onLikePress,
  onCommentPress,
}) => {
  // Local state để xử lý UI "Like" ngay lập tức (Optimistic Update)
  const [liked, setLiked] = useState(item.isLiked);
  const [likeCount, setLikeCount] = useState(item.likesCount);

  const handleLike = () => {
    const newStatus = !liked;
    setLiked(newStatus);
    setLikeCount(newStatus ? likeCount + 1 : likeCount - 1);
    // Gọi hàm callback để xử lý logic API ở màn hình cha
    onLikePress(item.id, newStatus);
  };

  return (
    <View style={styles.cardContainer}>
      {/* 1. HEADER: Avatar + Tên + Thời gian */}
      <View style={styles.headerRow}>
        <Image
          source={{
            uri:
              item.authorAvatar ||
              "https://ui-avatars.com/api/?name=" + item.authorName,
          }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <AppText variant="bold" style={styles.authorName}>
            {item.authorName}
          </AppText>
          <AppText style={styles.timeText}>{item.time}</AppText>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* 2. BODY: Nội dung & Hình ảnh */}
      <Pressable onPress={onPress}>
        <AppText variant="bold" style={styles.title} numberOfLines={2}>
          {item.title}
        </AppText>
        {item.desc ? (
          <AppText style={styles.desc} numberOfLines={3}>
            {item.desc}
          </AppText>
        ) : null}

        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
      </Pressable>

      {/* 3. FOOTER: Actions (Like, Comment, Share) */}
      <View style={styles.actionRow}>
        {/* Nút Like */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? "#E91E63" : "#333"}
          />
          <AppText
            style={[
              styles.actionText,
              liked && { color: "#E91E63", fontWeight: "bold" },
            ]}
          >
            {likeCount > 0 ? likeCount : "Thích"}
          </AppText>
        </TouchableOpacity>

        {/* Nút Comment */}
        <TouchableOpacity style={styles.actionBtn} onPress={onCommentPress}>
          <Ionicons name="chatbubble-outline" size={22} color="#333" />
          <AppText style={styles.actionText}>
            {item.commentsCount > 0 ? item.commentsCount : "Bình luận"}
          </AppText>
        </TouchableOpacity>

        {/* Nút Share (Demo) */}
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Sử dụng memo để tránh render lại nếu props không đổi
export default memo(AppSocialCard);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingVertical: 12,
    borderBottomWidth: 8,
    borderBottomColor: "#f2f2f2", // Tạo khoảng cách xám giữa các bài
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#eee" },
  headerInfo: { flex: 1, marginLeft: 10 },
  authorName: { fontSize: 15, color: "#000" },
  timeText: { fontSize: 12, color: "#888", marginTop: 2 },
  moreBtn: { padding: 4 },
  title: { fontSize: 16, paddingHorizontal: 16, marginBottom: 6 },
  desc: {
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 16,
    marginBottom: 10,
    lineHeight: 20,
  },
  postImage: { width: "100%", height: 300, backgroundColor: "#eee" },
  actionRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 10,
    paddingTop: 10,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  actionBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 5 },
  actionText: { marginLeft: 6, fontSize: 14, color: "#555" },
});
