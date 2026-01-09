// Nhóm 9 - IE307.Q12
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import AppHeader from "../components/AppHeader";

interface ReviewItem {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: { full_name: string; avatar_url: string };
}

const ReviewScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { recipeId } = useRoute().params as {
    recipeId: number;
    recipeTitle: string;
  };

  const { user, profile } = useAuthStore();
  const { theme } = useThemeStore();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const dateLocale = i18n.language === "vi" ? vi : enUS;
  const currentUserAvatar = useMemo(() => {
    if (profile?.avatar_url) return profile.avatar_url;
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.full_name || "User"
    )}&background=random`;
  }, [profile, user]);

  const fetchData = useCallback(async () => {
    try {
      const [reviewsRes, ownerRes] = await Promise.all([
        supabase
          .from("reviews")
          .select(
            `id, rating, comment, created_at, user:users (full_name, avatar_url)`
          )
          .eq("recipe_id", recipeId)
          .order("created_at", { ascending: false }),

        supabase.from("recipes").select("user_id").eq("id", recipeId).single(),
      ]);

      if (reviewsRes.error) throw reviewsRes.error;

      const formattedReviews = (reviewsRes.data || []).map((item: any) => ({
        ...item,
        user: Array.isArray(item.user) ? item.user[0] : item.user,
      }));

      setReviews(formattedReviews);
      if (ownerRes.data) setOwnerId(ownerRes.data.user_id);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStarPress = (star: number) => {
    Haptics.selectionAsync();
    if (myRating === star) {
      setMyRating(star - 0.5);
    } else {
      setMyRating(star);
    }
  };

  const handleSubmit = async () => {
    if (!user) return Alert.alert(t("review.req_title"), t("review.req_login"));
    if (myRating === 0)
      return Alert.alert(t("review.missing_title"), t("review.missing_rating"));

    setSubmitting(true);
    try {
      const { error, data } = await supabase
        .from("reviews")
        .insert({
          user_id: user.id,
          recipe_id: recipeId,
          rating: myRating,
          comment: myComment.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      const newReviewItem: ReviewItem = {
        id: data.id,
        rating: myRating,
        comment: myComment.trim(),
        created_at: new Date().toISOString(),
        user: {
          full_name:
            profile?.full_name ||
            user.user_metadata?.full_name ||
            t("review.me"),
          avatar_url: currentUserAvatar,
        },
      };
      setReviews([newReviewItem, ...reviews]);

      if (ownerId && ownerId !== user.id) {
        await supabase.from("notifications").insert({
          user_id: ownerId,
          sender_id: user.id,
          recipe_id: recipeId,
          type: "star",
          title: t("review.noti_title"),
          message: `${profile?.full_name || t("review.someone")} ${t(
            "review.noti_msg_1"
          )} ${myRating} ${t("review.noti_msg_2")}`,
          is_read: false,
        });
      }

      setMyRating(0);
      setMyComment("");
      if (Platform.OS === "android")
        ToastAndroid.show(t("review.toast_sent"), ToastAndroid.SHORT);
      else Alert.alert(t("review.success_title"), t("review.success_msg"));
    } catch (err) {
      console.log(err);
      Alert.alert(t("review.error_title"), t("review.error_msg"));
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: number = 12) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = i + 1;
      let iconName: keyof typeof Ionicons.glyphMap = "star-outline";

      if (rating >= starValue) {
        iconName = "star"; // Full
      } else if (rating >= starValue - 0.5) {
        iconName = "star-half"; // 4.5
      }

      return (
        <Ionicons
          key={i}
          name={iconName}
          size={size}
          color="#FFC107"
          style={{ marginRight: 2 }}
        />
      );
    });
  };

  const renderItem = ({ item }: { item: ReviewItem }) => (
    <View style={[styles.reviewItem, { borderBottomColor: theme.border }]}>
      <Image
        source={{ uri: item.user?.avatar_url || "https://placehold.co/100" }}
        style={[styles.avatar, { backgroundColor: theme.background_contrast }]}
      />
      <View style={styles.reviewContent}>
        <AppText
          variant="bold"
          style={[styles.reviewerName, { color: theme.primary_text }]}
        >
          {item.user?.full_name || t("review.someone")}
        </AppText>

        {/* Render Sao hiển thị */}
        <View style={styles.ratingRow}>
          {renderStars(item.rating, 14)}
          <AppText style={[styles.timeText, { color: theme.placeholder_text }]}>
            •{" "}
            {formatDistanceToNow(new Date(item.created_at), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </AppText>
        </View>

        <AppText style={[styles.commentText, { color: theme.primary_text }]}>
          {item.comment}
        </AppText>
      </View>
    </View>
  );

  return (
    <AppSafeView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <AppHeader
        title={t("review.header_title")}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={reviews}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View
              style={[
                styles.myReviewBox,
                {
                  backgroundColor: theme.background_contrast,
                  borderColor: theme.border,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Image
                  source={{ uri: currentUserAvatar }}
                  style={[styles.avatarSmall, { borderColor: theme.border }]}
                />
                <AppText
                  variant="bold"
                  style={{ marginLeft: 10, color: theme.primary_text }}
                >
                  {t("review.write_review")}
                </AppText>
              </View>

              <View style={styles.starSelectRow}>
                {[1, 2, 3, 4, 5].map((star) => {
                  let iconName: keyof typeof Ionicons.glyphMap = "star-outline";
                  if (myRating >= star) iconName = "star";
                  else if (myRating >= star - 0.5) iconName = "star-half";

                  return (
                    <Pressable
                      key={star}
                      onPress={() => handleStarPress(star)}
                      style={{ padding: 4 }}
                    >
                      <Ionicons name={iconName} size={36} color="#FFC107" />
                    </Pressable>
                  );
                })}
              </View>
              <View style={{ alignItems: "center", marginBottom: 12 }}>
                <AppText
                  style={{ color: theme.placeholder_text, fontSize: 12 }}
                >
                  {myRating > 0
                    ? `${myRating}/5`
                    : t("review.tap_to_rate", "Chạm để đánh giá")}
                </AppText>
              </View>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.primary_text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder={t("review.placeholder")}
                placeholderTextColor={theme.placeholder_text}
                multiline
                value={myComment}
                onChangeText={setMyComment}
              />

              <Pressable
                style={[
                  styles.submitBtn,
                  { backgroundColor: theme.primary_color },
                  submitting && { opacity: 0.7 },
                ]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <AppText variant="bold" style={{ color: "#fff" }}>
                    {t("review.submit_btn")}
                  </AppText>
                )}
              </Pressable>
            </View>
          }
          ListEmptyComponent={
            !loading ? (
              <AppText
                style={[styles.emptyText, { color: theme.placeholder_text }]}
              >
                {t("review.empty_list")}
              </AppText>
            ) : (
              <ActivityIndicator color={theme.primary_color} />
            )
          }
        />
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  reviewItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  reviewContent: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    marginLeft: 6,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  myReviewBox: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  starSelectRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 4,
    gap: 8,
  },
  input: {
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 15,
  },
  submitBtn: {
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});
