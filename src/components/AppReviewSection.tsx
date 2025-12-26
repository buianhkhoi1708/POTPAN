import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import AppText from "./AppText";
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

interface Props {
  recipeId: number;
  onRatingUpdate?: (newRating: number) => void; // Callback để update rating trung bình lên cha
}

const AppReviewSection: React.FC<Props> = ({ recipeId, onRatingUpdate }) => {
  const { user, profile } = useAuthStore();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State cho form review mới
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

      if (data) {
        // Map dữ liệu cho đúng kiểu
        const mappedReviews = data.map((item: any) => ({
          id: item.id,
          rating: item.rating,
          comment: item.comment,
          created_at: item.created_at,
          user: item.user, // Supabase join trả về object user
        }));
        setReviews(mappedReviews);
        
        // Tính toán lại rating trung bình nếu cần
        if (mappedReviews.length > 0 && onRatingUpdate) {
             const total = mappedReviews.reduce((sum, r) => sum + r.rating, 0);
             onRatingUpdate(total / mappedReviews.length);
        }
      }
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
      Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để đánh giá.");
      return;
    }
    if (myRating === 0) {
      Alert.alert("Chưa chọn sao", "Vui lòng chọn số sao đánh giá.");
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
          if (error.code === '23505') { // Lỗi duplicate key (đã đánh giá rồi)
               Alert.alert("Thông báo", "Bạn đã đánh giá món này rồi!");
          } else {
               throw error;
          }
      } else {
          Alert.alert("Cảm ơn", "Đánh giá của bạn đã được gửi!");
          setMyRating(0);
          setMyComment("");
          fetchReviews(); // Reload lại danh sách
      }
    } catch (err) {
      console.log("Lỗi gửi đánh giá:", err);
      Alert.alert("Lỗi", "Không thể gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDER ITEM ---
  const renderReviewItem = (item: ReviewItem) => (
    <View key={item.id} style={styles.reviewItem}>
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
    <View style={styles.container}>
      <AppText variant="bold" style={styles.headerTitle}>
        Đánh giá ({reviews.length})
      </AppText>

      {/* FORM NHẬP ĐÁNH GIÁ CỦA TÔI */}
      <View style={styles.myReviewBox}>
        <AppText variant="medium" style={{ marginBottom: 8 }}>
          Đánh giá của bạn
        </AppText>
        
        {/* Chọn Sao */}
        <View style={styles.starSelectRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setMyRating(star)}>
              <Ionicons
                name={star <= myRating ? "star" : "star-outline"}
                size={32}
                color="#FFC107"
                style={{ marginRight: 8 }}
              />
            </Pressable>
          ))}
        </View>

        {/* Nhập nội dung */}
        <TextInput
          style={styles.input}
          placeholder="Viết cảm nhận của bạn về món này..."
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
            <AppText variant="bold" style={{ color: "#fff" }}>
              Gửi đánh giá
            </AppText>
          )}
        </Pressable>
      </View>

      {/* DANH SÁCH REVIEW */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} color={AppLightColor.primary_color} />
      ) : reviews.length > 0 ? (
        <View style={styles.listContainer}>
          {reviews.map(renderReviewItem)}
        </View>
      ) : (
        <AppText style={styles.emptyText}>Chưa có đánh giá nào. Hãy là người đầu tiên!</AppText>
      )}
    </View>
  );
};

export default AppReviewSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: "#333",
    marginBottom: 16,
  },
  // My Review Form
  myReviewBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  starSelectRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    height: 80,
    textAlignVertical: "top", // Cho Android
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: AppLightColor.primary_color,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "flex-end",
    paddingHorizontal: 24,
  },
  
  // List
  listContainer: {
    gap: 16,
  },
  reviewItem: {
    flexDirection: "row",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  reviewContent: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    color: "#333",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 6,
  },
  commentText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
    fontStyle: "italic",
  },
});