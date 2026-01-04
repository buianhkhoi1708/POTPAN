import React, { useState, memo, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
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
}

const AppSocialCard: React.FC<Props> = ({ item, onPress, onLikePress }) => {
  // 👇 Lấy theme và biến isDarkMode
  const { theme, isDarkMode } = useThemeStore();
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();

  const [liked, setLiked] = useState(item.isLiked);
  const [likeCount, setLikeCount] = useState(item.likesCount);

  // Comment States
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [cmtCountDisplay, setCmtCountDisplay] = useState(item.commentsCount);
  const [isExpanded, setIsExpanded] = useState(false);
  const [myAvatar, setMyAvatar] = useState<string | null>(null);

  // --- 0. LẤY AVATAR USER ---
  useEffect(() => {
    const fetchMyAvatar = async () => {
      if (!user) return;
      let currentAvt = user.user_metadata?.avatar_url;
      if (!currentAvt) {
         const { data } = await supabase.from('users').select('avatar_url').eq('id', user.id).single();
         if (data?.avatar_url) currentAvt = data.avatar_url;
      }
      if (!currentAvt) {
          const name = user.user_metadata?.full_name || "Me";
          currentAvt = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
      }
      setMyAvatar(currentAvt);
    };
    fetchMyAvatar();
  }, [user]);

  // --- 1. TỰ ĐỘNG LOAD COMMENT ---
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`id, created_at, comment, rating, users (full_name, avatar_url)`)
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
    const userAvatarToUse = myAvatar || "https://ui-avatars.com/api/?name=Me";

    const tempComment: CommentType = {
      id: tempId,
      user: user.user_metadata?.full_name || "Bạn",
      avatar: userAvatarToUse,
      content: commentText.trim(),
      time: t("common.just_now", "Vừa xong"),
    };

    setComments([...comments, tempComment]);
    setCommentText("");
    setCmtCountDisplay(prev => prev + 1);
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
      setComments(prev => prev.filter(c => c.id !== tempId));
      setCmtCountDisplay(prev => prev - 1);
    }
  };

  const renderCommentItem = (comment: CommentType) => (
    <View style={styles.commentItem} key={comment.id}>
      <Image 
        source={{ uri: comment.avatar || `https://ui-avatars.com/api/?name=${comment.user}` }} 
        // 👇 Border động cho Avatar
        style={[styles.commentAvatar, { borderColor: theme.border }]} 
      />
      <View style={{ flex: 1 }}>
        {/* 👇 Bubble Chat Động: Nền sáng hơn 1 chút so với Card */}
        <View style={[styles.commentBubble, { backgroundColor: isDarkMode ? theme.background : theme.background }]}>
          <AppText variant="bold" style={{ fontSize: 13, color: theme.primary_text }}>
            {comment.user}
          </AppText>
          <AppText style={{ fontSize: 13, color: theme.primary_text, marginTop: 2 }}>
            {comment.content}
          </AppText>
        </View>
        {/* 👇 Time Text màu placeholder */}
        <AppText style={{ fontSize: 11, color: theme.placeholder_text, marginLeft: 12, marginTop: 2 }}>
            {comment.time}
        </AppText>
      </View>
    </View>
  );

  const displayedComments = isExpanded ? comments : comments.slice(0, 2);

  return (
    // 👇 Card Container: Nền xám đậm (Dark) hoặc Trắng (Light)
    <View style={[styles.cardContainer, { backgroundColor: theme.background_contrast, borderBottomColor: isDarkMode ? '#000' : '#f2f2f2' }]}>
      
      {/* 1. HEADER */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: item.authorAvatar || "https://ui-avatars.com/api/?name=" + item.authorName }}
          style={[styles.avatar, { borderColor: theme.border }]}
        />
        <View style={styles.headerInfo}>
          <AppText variant="bold" style={{ fontSize: 15, color: theme.primary_text }}>
            {item.authorName}
          </AppText>
          <AppText style={{ fontSize: 12, color: theme.placeholder_text, marginTop: 2 }}>{item.time}</AppText>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.placeholder_text} />
        </TouchableOpacity>
      </View>

      {/* 2. BODY */}
      <Pressable onPress={onPress}>
        <AppText variant="bold" style={[styles.title, { color: theme.primary_text }]} numberOfLines={2}>
          {item.title}
        </AppText>
        {item.desc ? (
          <AppText style={[styles.desc, { color: theme.primary_text }]} numberOfLines={3}>
            {item.desc}
          </AppText>
        ) : null}

        {item.image && (
          <Image
            source={{ uri: item.image }}
            // 👇 Giảm độ sáng ảnh ở Dark Mode
            style={[styles.postImage, { backgroundColor: isDarkMode ? '#333' : '#eee', opacity: isDarkMode ? 0.9 : 1 }]}
            resizeMode="cover"
          />
        )}
      </Pressable>

      {/* 3. FOOTER ACTIONS */}
      <View style={[styles.actionRow, { borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={26}
            color={liked ? "#FF3B30" : theme.icon}
          />
          <AppText style={[styles.actionText, { color: theme.placeholder_text }]}>
            {likeCount > 0 ? likeCount : ""}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setIsExpanded(!isExpanded)}>
          <Ionicons name="chatbubble-outline" size={24} color={theme.icon} />
          <AppText style={[styles.actionText, { color: theme.placeholder_text }]}>
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
                      <AppText style={{color: theme.placeholder_text, fontSize: 13, marginLeft: 44, marginBottom: 8, fontWeight: '500'}}>
                          Xem thêm {comments.length - 2} bình luận...
                      </AppText>
                  </TouchableOpacity>
              )}
            </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputRow}>
          <Image 
              source={{ uri: myAvatar || "https://ui-avatars.com/api/?name=User" }} 
              style={[styles.inputAvatar, { borderColor: theme.border }]} 
          />
          {/* 👇 Input Container: Nền khác với nền Card để nổi bật */}
          <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: isDarkMode ? theme.border : theme.border }]}>
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
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
  headerInfo: { flex: 1, marginLeft: 10 },
  moreBtn: { padding: 4 },
  title: { fontSize: 16, paddingHorizontal: 16, marginBottom: 6 },
  desc: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    lineHeight: 20,
  },
  postImage: { width: "100%", height: 300 },
  actionRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingBottom: 4
  },
  actionBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 5, 
    paddingHorizontal: 8,
    minWidth: 60,
    justifyContent: 'center'
  },
  actionText: { 
    marginLeft: 6, 
    fontSize: 16,
    fontWeight: '500' 
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
    flexDirection: 'row',
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 0,
    marginTop: 4
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
    flexDirection: 'row',
    alignItems: 'center',
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