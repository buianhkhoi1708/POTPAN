// Nhóm 9 - IE307.Q12
import React, { useState, memo, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  Alert,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import AppText from "./AppText";
import { useThemeStore } from "../store/useThemeStore";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import AppCollectionModal from "../components/AppCollectionModal";

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
  isLiked: boolean;
  originalItem: any;
};

type CommentType = {
  id: string;
  user: string;
  avatar: string | null;
  content: string;
  time: string;
  rating?: number;
};

interface Props {
  item: SocialPostType;
  onPress: () => void;
  onLikePress: (id: any, newStatus: boolean) => void;
  onHidePost?: (id: any) => void;
}

const AppSocialCard: React.FC<Props> = ({
  item,
  onPress,
  onLikePress,
  onHidePost,
}) => {
  const { theme, isDarkMode } = useThemeStore();
  const { t, i18n } = useTranslation();
  const { user, profile } = useAuthStore();
  const [liked, setLiked] = useState(item.isLiked);
  const [likeCount, setLikeCount] = useState(item.likesCount);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [cmtCountDisplay, setCmtCountDisplay] = useState(item.commentsCount);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const currentAvatar = useMemo(() => {
    if (profile?.avatar_url) return profile.avatar_url;
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.full_name || "User"
    )}&background=random`;
  }, [profile, user]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `id, created_at, comment, rating, users (full_name, avatar_url)`
        )
        .eq("recipe_id", item.id)
        .neq("comment", null)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data) {
        setCmtCountDisplay(data.length);
        const formattedComments: CommentType[] = data.map((review: any) => ({
          id: review.id.toString(),
          user: review.users?.full_name || "Anonymous",
          avatar: review.users?.avatar_url,
          content: review.comment || "",
          time: formatDistanceToNow(new Date(review.created_at), {
            addSuffix: true,
            locale: i18n.language === "en" ? enUS : vi,
          }),
        }));
        setComments(formattedComments);
      } else {
        setCmtCountDisplay(0);
      }
    } catch (error) {
      console.log("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = () => {
    const newStatus = !liked;
    setLiked(newStatus);
    setLikeCount(newStatus ? likeCount + 1 : likeCount - 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLikePress(item.id, newStatus);
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    if (!user) {
      Alert.alert(t("common.notification"), t("common.require_login"));
      return;
    }

    const tempId = Date.now().toString();
    const tempComment: CommentType = {
      id: tempId,
      user: profile?.full_name || user.user_metadata?.full_name || "Bạn",
      avatar: currentAvatar,
      content: commentText.trim(),
      time: t("common.just_now", "Vừa xong"),
    };

    setComments([...comments, tempComment]);
    setCommentText("");
    setCmtCountDisplay((prev) => prev + 1);
    setIsExpanded(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        recipe_id: item.id,
        rating: 5,
        comment: tempComment.content,
      });
      if (error) throw error;
    } catch (error) {
      console.log("Error posting comment:", error);
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setCmtCountDisplay((prev) => prev - 1);
    }
  };

  const handleMorePress = () => {
    const options = [
      t("social.save_post", "Lưu bài viết"),
      t("social.hide_post", "Ẩn bài viết"),
      t("common.cancel", "Hủy"),
    ];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            setShowSaveModal(true);
          } else if (buttonIndex === 1) {
            if (onHidePost) onHidePost(item.id);
            else
              Alert.alert(
                t("common.notification"),
                t("social.post_hidden", "Đã ẩn bài viết này.")
              );
          }
        }
      );
    } else {
      Alert.alert(
        t("social.post_options", "Tùy chọn bài viết"),
        undefined,
        [
          {
            text: t("social.save_post", "Lưu bài viết"),
            onPress: () => setShowSaveModal(true),
          },
          {
            text: t("social.hide_post", "Ẩn bài viết"),
            onPress: () => {
              if (onHidePost) onHidePost(item.id);
              else
                Alert.alert(
                  t("common.notification"),
                  t("social.post_hidden", "Đã ẩn bài viết này.")
                );
            },
            style: "destructive",
          },
          { text: t("common.cancel", "Hủy"), style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  const renderCommentItem = (comment: CommentType) => (
    <View style={styles.commentItem} key={comment.id}>
      <Image
        source={{
          uri:
            comment.avatar ||
            `https://ui-avatars.com/api/?name=${comment.user}`,
        }}
        style={[styles.commentAvatar, { borderColor: theme.border }]}
      />
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.commentBubble,
            { backgroundColor: isDarkMode ? theme.background : "#f0f2f5" },
          ]}
        >
          <AppText
            variant="bold"
            style={{ fontSize: 13, color: theme.primary_text }}
          >
            {comment.user}
          </AppText>
          <AppText
            style={{ fontSize: 13, color: theme.primary_text, marginTop: 2 }}
          >
            {comment.content}
          </AppText>
        </View>
        <AppText
          style={{
            fontSize: 11,
            color: theme.placeholder_text,
            marginLeft: 12,
            marginTop: 2,
          }}
        >
          {comment.time}
        </AppText>
      </View>
    </View>
  );

  const displayedComments = isExpanded ? comments : comments.slice(0, 2);

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.background_contrast,
          borderBottomColor: isDarkMode ? "#000" : "#f2f2f2",
        },
      ]}
    >
  
      <AppCollectionModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        recipeId={item.id} 
        onSaved={() => {
          Alert.alert(t("common.success"), t("recipe_detail.save_success"));
        }}
      />

  
      <View style={styles.headerRow}>
        <Image
          source={{
            uri:
              item.authorAvatar ||
              "https://ui-avatars.com/api/?name=" + item.authorName,
          }}
          style={[styles.avatar, { borderColor: theme.border }]}
        />
        <View style={styles.headerInfo}>
          <AppText
            variant="bold"
            style={{ fontSize: 15, color: theme.primary_text }}
          >
            {item.authorName}
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: theme.placeholder_text,
              marginTop: 2,
            }}
          >
            {item.time}
          </AppText>
        </View>

        <TouchableOpacity
          style={styles.moreBtn}
          onPress={handleMorePress}
          hitSlop={10}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={theme.placeholder_text}
          />
        </TouchableOpacity>
      </View>

      {/* 2. BODY */}
      <Pressable onPress={onPress}>
        <AppText
          variant="bold"
          style={[styles.title, { color: theme.primary_text }]}
          numberOfLines={2}
        >
          {item.title}
        </AppText>
        {item.desc ? (
          <AppText
            style={[styles.desc, { color: theme.primary_text }]}
            numberOfLines={3}
          >
            {item.desc}
          </AppText>
        ) : null}

        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={[
              styles.postImage,
              {
                backgroundColor: isDarkMode ? "#333" : "#eee",
                opacity: isDarkMode ? 0.9 : 1,
              },
            ]}
            resizeMode="cover"
          />
        )}
      </Pressable>


      <View style={[styles.actionRow, { borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={26}
            color={liked ? "#FF3B30" : theme.icon}
          />
          <AppText
            style={[styles.actionText, { color: theme.placeholder_text }]}
          >
            {likeCount > 0 ? likeCount : ""}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Ionicons name="chatbubble-outline" size={24} color={theme.icon} />
          <AppText
            style={[styles.actionText, { color: theme.placeholder_text }]}
          >
            {cmtCountDisplay > 0 ? cmtCountDisplay : ""}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={24} color={theme.icon} />
        </TouchableOpacity>
      </View>

      {/* 4. COMMENT SECTION */}
      <View style={[styles.commentSection, { borderTopColor: theme.border }]}>
        {loadingComments ? (
          <View style={{ height: 20 }} />
        ) : (
          <View style={styles.commentList}>
            {displayedComments.map(renderCommentItem)}

            {!isExpanded && comments.length > 2 && (
              <TouchableOpacity onPress={() => setIsExpanded(true)}>
                <AppText
                  style={{
                    color: theme.placeholder_text,
                    fontSize: 13,
                    marginLeft: 44,
                    marginBottom: 8,
                    fontWeight: "500",
                  }}
                >
                  Xem thêm {comments.length - 2} bình luận...
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputRow}>
          <Image
            source={{ uri: currentAvatar }}
            style={[styles.inputAvatar, { borderColor: theme.border }]}
          />

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.background, borderColor: theme.border },
            ]}
          >
            <TextInput
              placeholder={t("community.write_comment", "Viết bình luận...")}
              placeholderTextColor={theme.placeholder_text}
              style={[styles.input, { color: theme.primary_text }]}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            {commentText.length > 0 && (
              <TouchableOpacity onPress={handleSendComment}>
                <Ionicons name="send" size={20} color={theme.primary_color} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(AppSocialCard);

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
    paddingVertical: 12,
    borderBottomWidth: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  moreBtn: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    lineHeight: 20,
  },
  postImage: {
    width: "100%",
    height: 300,
  },
  actionRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingBottom: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
    minWidth: 60,
    justifyContent: "center",
  },
  actionText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "500",
  },
  commentSection: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  commentList: {
    marginBottom: 8,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
  },
  commentBubble: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 0,
    marginTop: 4,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 4,
    borderWidth: 1,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 36,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: 8,
    maxHeight: 80,
  },
});
