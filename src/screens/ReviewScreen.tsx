import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { AppLightColor } from "../styles/color";

interface ReviewItem {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    full_name: string;
    avatar_url: string;
  };
}

const ReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeId, recipeTitle } = route.params as { recipeId: number; recipeTitle: string };
  const { user } = useAuthStore();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");

  // --- FETCH REVIEWS ---
  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id, rating, comment, created_at,
          user:users (full_name, avatar_url)
        `)
        .eq("recipe_id", recipeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const formattedData: ReviewItem[] = (data || []).map((item: any) => ({
        ...item,
        // Nếu user là mảng (do TS suy luận sai hoặc Supabase trả về mảng), lấy phần tử đầu tiên
        user: Array.isArray(item.user) ? item.user[0] : item.user
      }));
      setReviews(formattedData);
    } catch (err) {
      console.log("Lỗi tải đánh giá:", err);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // --- SUBMIT REVIEW ---
  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Yêu cầu", "Vui lòng đăng nhập để đánh giá.");
      return;
    }
    if (myRating === 0) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn số sao.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        recipe_id: recipeId,
        rating: myRating,
        comment: myComment.trim(),
      });

      if (error) {
        if (error.code === "23505") {
          Alert.alert("Thông báo", "Bạn đã đánh giá món này rồi!");
        } else {
          throw error;
        }
      } else {
        Alert.alert("Thành công", "Cảm ơn đánh giá của bạn!");
        setMyRating(0);
        setMyComment("");
        fetchReviews(); // Reload list
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDER ---
  const renderItem = ({ item }: { item: ReviewItem }) => (
    <View style={styles.reviewItem}>
      <Image
        source={{ uri: item.user?.avatar_url || "https://i.pravatar.cc/100" }}
        style={styles.avatar}
      />
      <View style={styles.reviewContent}>
        <AppText variant="bold" style={styles.reviewerName}>
          {item.user?.full_name || "Người dùng ẩn danh"}
        </AppText>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= item.rating ? "star" : "star-outline"}
              size={12}
              color="#FFC107"
            />
          ))}
          <AppText style={styles.timeText}>
            • {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
          </AppText>
        </View>
        <AppText style={styles.commentText}>{item.comment}</AppText>
      </View>
    </View>
  );

  return (
    <AppSafeView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <View style={{flex: 1, alignItems: 'center'}}>
            <AppText variant="bold" style={styles.headerTitle}>Đánh giá</AppText>
            <AppText style={styles.subTitle} numberOfLines={1}>{recipeTitle}</AppText>
        </View>
        <View style={{ width: 32 }} />
      </View>

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
            <View style={styles.myReviewBox}>
              <AppText variant="bold" style={{ marginBottom: 12 }}>Viết đánh giá của bạn</AppText>
              
              {/* Star Rating Input */}
              <View style={styles.starSelectRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable key={star} onPress={() => setMyRating(star)} style={{ padding: 4 }}>
                    <Ionicons
                      name={star <= myRating ? "star" : "star-outline"}
                      size={36}
                      color="#FFC107"
                    />
                  </Pressable>
                ))}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Chia sẻ cảm nhận của bạn..."
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
                  <AppText variant="bold" style={{ color: "#fff" }}>Gửi đánh giá</AppText>
                )}
              </Pressable>
            </View>
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={48} color="#ccc" />
                <AppText style={styles.emptyText}>Chưa có đánh giá nào.</AppText>
              </View>
            ) : <ActivityIndicator style={{marginTop: 20}} color={AppLightColor.primary_color}/>
          }
        />
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, color: "#333" },
  subTitle: { fontSize: 12, color: "#888", marginTop: 2 },
  
  listContent: { padding: 20, paddingBottom: 40 },

  // My Review Form
  myReviewBox: {
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#eee",
  },
  starSelectRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: AppLightColor.primary_color,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },

  // List Item
  reviewItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 20,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#eee" },
  reviewContent: { flex: 1 },
  reviewerName: { fontSize: 14, color: "#333", marginBottom: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  timeText: { fontSize: 12, color: "#999", marginLeft: 6 },
  commentText: { fontSize: 14, color: "#444", lineHeight: 20 },

  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#999", marginTop: 12 },
});