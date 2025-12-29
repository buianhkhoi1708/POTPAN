import React, { useState, useEffect, useCallback } from "react";
import {
  View, StyleSheet, TextInput, Pressable, Image, Alert,
  ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, ToastAndroid
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
// 👇 Import thêm locale tiếng Anh
import { vi, enUS } from "date-fns/locale"; 
import { useTranslation } from "react-i18next"; // 👇 Import hook dịch

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { AppLightColor } from "../styles/color";
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
  const { t, i18n } = useTranslation(); // 👇 Khởi tạo hook
  const { recipeId, recipeTitle } = useRoute().params as { recipeId: number; recipeTitle: string };
  const { user } = useAuthStore();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");

  // 👇 Xác định locale cho ngày tháng dựa trên ngôn ngữ hiện tại
  const dateLocale = i18n.language === 'vi' ? vi : enUS;

  const fetchData = useCallback(async () => {
    try {
      const [reviewsRes, ownerRes] = await Promise.all([
        supabase
          .from("reviews")
          .select(`id, rating, comment, created_at, user:users (full_name, avatar_url)`)
          .eq("recipe_id", recipeId)
          .order("created_at", { ascending: false }),
        
        supabase.from('recipes').select('user_id').eq('id', recipeId).single()
      ]);

      if (reviewsRes.error) throw reviewsRes.error;
      
      const formattedReviews = (reviewsRes.data || []).map((item: any) => ({
        ...item,
        user: Array.isArray(item.user) ? item.user[0] : item.user
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

  const handleSubmit = async () => {
    if (!user) return Alert.alert(t("review.req_title"), t("review.req_login"));
    if (myRating === 0) return Alert.alert(t("review.missing_title"), t("review.missing_rating"));

    setSubmitting(true);
    try {
      // 1. Insert Review
      const { error, data } = await supabase.from("reviews").insert({
        user_id: user.id,
        recipe_id: recipeId,
        rating: myRating,
        comment: myComment.trim(),
      }).select().single();

      if (error) throw error;

      // 2. Cập nhật list local
      const newReviewItem: ReviewItem = {
        id: data.id,
        rating: myRating,
        comment: myComment.trim(),
        created_at: new Date().toISOString(),
        user: { 
            full_name: user.full_name || t("review.me"), // "Tôi"
            avatar_url: user.avatar_url || "" 
        }
      };
      setReviews([newReviewItem, ...reviews]);

      // 3. Gửi Thông Báo
      if (ownerId && ownerId !== user.id) {
        await supabase.from("notifications").insert({
          user_id: ownerId,
          sender_id: user.id,
          recipe_id: recipeId,
          type: 'star',
          title: t("review.noti_title"), // "Đánh giá mới!"
          // "Ai đó vừa đánh giá 5 sao cho bài viết..."
          message: `${user.full_name || t("review.someone")} ${t("review.noti_msg_1")} ${myRating} ${t("review.noti_msg_2")}`,
          is_read: false
        });
      }

      setMyRating(0);
      setMyComment("");
      if (Platform.OS === 'android') ToastAndroid.show(t("review.toast_sent"), ToastAndroid.SHORT);
      else Alert.alert(t("review.success_title"), t("review.success_msg"));

    } catch (err) {
      console.log(err);
      Alert.alert(t("review.error_title"), t("review.error_msg"));
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: ReviewItem }) => (
    <View style={styles.reviewItem}>
      <Image source={{ uri: item.user?.avatar_url || "https://placehold.co/100" }} style={styles.avatar} />
      <View style={styles.reviewContent}>
        <AppText variant="bold" style={styles.reviewerName}>{item.user?.full_name || t("review.someone")}</AppText>
        <View style={styles.ratingRow}>
          {Array.from({length: 5}).map((_, i) => (
            <Ionicons key={i} name={i < item.rating ? "star" : "star-outline"} size={12} color="#FFC107" />
          ))}
          <AppText style={styles.timeText}>
            • {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: dateLocale })}
          </AppText>
        </View>
        <AppText style={styles.commentText}>{item.comment}</AppText>
      </View>
    </View>
  );
  
  return (
    <AppSafeView style={styles.safeArea}>
        <AppHeader 
            title={t("review.header_title")} // "Đánh giá & Bình luận"
            showBack={true} 
            onBackPress={() => navigation.goBack()} 
        />
        
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <FlatList
                data={reviews}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.myReviewBox}>
                        <AppText variant="bold" style={{ marginBottom: 12 }}>{t("review.write_review")}</AppText>
                        <View style={styles.starSelectRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Pressable key={star} onPress={() => setMyRating(star)} style={{ padding: 4 }}>
                                    <Ionicons name={star <= myRating ? "star" : "star-outline"} size={36} color="#FFC107" />
                                </Pressable>
                            ))}
                        </View>
                        <TextInput 
                            style={styles.input} 
                            placeholder={t("review.placeholder")} // "Chia sẻ cảm nhận..."
                            multiline 
                            value={myComment} 
                            onChangeText={setMyComment} 
                        />
                        <Pressable 
                            style={[styles.submitBtn, submitting && { opacity: 0.7 }]} 
                            onPress={handleSubmit} 
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <AppText variant="bold" style={{ color: "#fff" }}>{t("review.submit_btn")}</AppText>
                            )}
                        </Pressable>
                    </View>
                }
                ListEmptyComponent={
                    !loading ? <AppText style={styles.emptyText}>{t("review.empty_list")}</AppText> : <ActivityIndicator />
                }
            />
        </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default ReviewScreen;

// ... Styles giữ nguyên ...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  reviewItem: { flexDirection: "row", gap: 12, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#f0f0f0", paddingBottom: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#eee" },
  reviewContent: { flex: 1 },
  reviewerName: { fontSize: 14, color: "#333", marginBottom: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  timeText: { fontSize: 12, color: "#999", marginLeft: 6 },
  commentText: { fontSize: 14, color: "#444", lineHeight: 20 },
  listContent: { padding: 20, paddingBottom: 40 },
  myReviewBox: { backgroundColor: "#F9F9F9", borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: "#eee" },
  starSelectRow: { flexDirection: "row", justifyContent: "center", marginBottom: 16, gap: 8 },
  input: { backgroundColor: "#fff", borderRadius: 12, padding: 12, height: 100, textAlignVertical: "top", borderWidth: 1, borderColor: "#e0e0e0", marginBottom: 16, fontSize: 15 },
  submitBtn: { backgroundColor: AppLightColor.primary_color, paddingVertical: 12, borderRadius: 24, alignItems: "center" },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});