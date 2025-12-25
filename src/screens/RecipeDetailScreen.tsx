import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  type ImageSourcePropType,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// --- IMPORTS CÁC MODAL (Đảm bảo đủ 5 file này) ---
import AddToCollectionModal from "./AddToCollectionModal";
import ShareModal from "./ShareModal";
import ReviewsListModal from "./ReviewsListModal"; // Danh sách đánh giá
import ReviewModal from "./ReviewModal";           // Form viết đánh giá
import ThankYouModal from "./ThankYouModal";       // Popup cảm ơn

// --- CONSTANTS ---
const COLORS = {
  BG: "#FFFFFF",
  CORAL: "#FF6B6B",
  TEXT: "#333333",
  GRAY_TEXT: "#666666",
  BORDER: "#FF6B6B",
} as const;

const { width } = Dimensions.get("window");

// --- TYPES ---
type Step = { title: string; content: string };
type Recipe = {
  id: string;
  categoryName: string;
  name: string;
  rating: number;
  views: string;
  image: ImageSourcePropType;
  author: { name: string; username: string; avatar: ImageSourcePropType };
  time: string;
  description: string;
  ingredients: string[];
  steps: Step[];
};

// --- DATA: BASE INFO ---
const ALL_FOODS_MAP: Record<string, { name: string; image: ImageSourcePropType; cat: string }> = {
  "101": { name: "Gà kho gừng", image: require("../assets/images/gakhogung.png"), cat: "Cơm gia đình" },
  "102": { name: "Gà kho nghệ", image: require("../assets/images/gakhonghe.png"), cat: "Cơm gia đình" },
  "103": { name: "Cơm chiên", image: require("../assets/images/comchien.png"), cat: "Cơm gia đình" },
  "104": { name: "Gà chiên mắm tỏi", image: require("../assets/images/gachien.png"), cat: "Cơm gia đình" },
  "105": { name: "Vịt om sấu", image: require("../assets/images/vitom.png"), cat: "Cơm gia đình" },
  "106": { name: "Gà rô-ti", image: require("../assets/images/garoti.png"), cat: "Cơm gia đình" },
  "107": { name: "Ức gà xào nấm", image: require("../assets/images/ucgaxaonam.png"), cat: "Cơm gia đình" },
  "108": { name: "Thịt kho trứng", image: require("../assets/images/thitkhotrung.png"), cat: "Cơm gia đình" },
  "201": { name: "Phở", image: require("../assets/images/pho.png"), cat: "Đặc sản Việt" },
  "202": { name: "Bún bò", image: require("../assets/images/bunbo.png"), cat: "Đặc sản Việt" },
  // ... (Bạn thêm các món khác vào đây nếu cần)
};

// --- DATA: DETAIL INFO ---
const DETAILED_RECIPES: Record<string, Partial<Recipe>> = {
  "101": {
    time: "55 phút",
    description: "Món gà kho gừng ấm nồng, thích hợp cho những ngày mưa hoặc tiết trời se lạnh.",
    ingredients: ["500g thịt gà", "50g gừng tươi", "Hành tím, tỏi", "Gia vị: Nước mắm, đường, tiêu"],
    steps: [
        { title: "Bước 1", content: "Rửa sạch thịt gà, chặt miếng vừa ăn. Gừng cạo vỏ, thái sợi." }, 
        { title: "Bước 2", content: "Ướp gà với gừng, hành tỏi băm, nước mắm, đường trong 30 phút." },
        { title: "Bước 3", content: "Phi thơm gừng, cho gà vào xào săn. Thêm nước màu và kho lửa nhỏ đến khi sệt lại." }
    ]
  },
  "102": {
    time: "40 phút",
    description: "Gà kho nghệ vàng ươm đẹp mắt, tốt cho sức khỏe.",
    ingredients: ["500g gà", "2 củ nghệ tươi", "Sả, ớt", "Gia vị thông thường"],
    steps: [{ title: "Bước 1", content: "Sơ chế nghệ tươi, giã nát lấy nước cốt." }, { title: "Bước 2", content: "Kho gà lửa nhỏ cho thấm đều màu nghệ." }]
  },
  // ... (Các món khác)
};

// --- COMPONENTS ---

// 1. Header
const RecipeHeader = ({ 
  title, 
  onBack, 
  onSearch, 
  isSaved, 
  onHeartPress,
  onSharePress 
}: any) => (
  <View style={h.header}>
    <Pressable onPress={onBack} style={h.circleBtn}>
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </Pressable>
    <Text style={h.title} numberOfLines={1}>{title}</Text>
    <View style={h.rightGroup}>
      {/* Search */}
      <Pressable style={h.circleBtn} onPress={onSearch}>
        <Ionicons name="search" size={20} color="#fff" />
      </Pressable>
      {/* Bookmark */}
      <Pressable style={h.circleBtn} onPress={onHeartPress}>
        <Ionicons 
          name={isSaved ? "bookmark" : "bookmark-outline"} 
          size={22} 
          color="#fff" 
        />
      </Pressable>
      {/* Share */}
      <Pressable style={h.circleBtn} onPress={onSharePress}>
        <Ionicons name="share-social-outline" size={22} color="#fff" />
      </Pressable>
    </View>
  </View>
);

const h = StyleSheet.create({
  header: {
    marginTop: 50, height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: COLORS.BG, zIndex: 10, marginBottom: 10
  },
  title: { fontSize: 30, fontWeight: '800', color: COLORS.CORAL, flex: 1, textAlign: 'center', marginHorizontal: 10 },
  rightGroup: { flexDirection: 'row', gap: 12 },
  circleBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.CORAL, alignItems: 'center', justifyContent: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3.84, elevation: 5
  }
});

// 2. Step Item
const StepItem = ({ step }: { step: Step }) => (
  <View style={st.wrapper}>
    <View style={st.headerBadge}>
      <Text style={st.headerText}>{step.title}</Text>
    </View>
    <View style={st.contentBox}>
      <Text style={st.contentText}>{step.content}</Text>
    </View>
  </View>
);

const st = StyleSheet.create({
  wrapper: { marginBottom: 25, alignItems: 'flex-start' },
  headerBadge: { backgroundColor: COLORS.CORAL, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, zIndex: 1, marginBottom: -15, marginLeft: 15 },
  headerText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  contentBox: { width: '100%', borderWidth: 1.5, borderColor: COLORS.CORAL, borderRadius: 15, paddingTop: 25, paddingHorizontal: 15, paddingBottom: 15, backgroundColor: '#fff' },
  contentText: { fontSize: 14, color: COLORS.TEXT, lineHeight: 22, textAlign: 'justify' }
});

// --- MAIN SCREEN ---
export default function RecipeDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { foodId } = route.params || {};
  
  // --- QUẢN LÝ STATE CHO 5 MODAL ---
  const [collectionModalVisible, setCollectionModalVisible] = useState(false); // Modal chọn bộ sưu tập
  const [shareModalVisible, setShareModalVisible] = useState(false);           // Modal chia sẻ
  const [reviewsListVisible, setReviewsListVisible] = useState(false);         // Modal xem danh sách review
  const [reviewFormVisible, setReviewFormVisible] = useState(false);           // Modal viết review
  const [thankYouVisible, setThankYouVisible] = useState(false);               // Modal cảm ơn

  // --- STATE NGƯỜI DÙNG ---
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // --- MERGE DATA ---
  const currentRecipe = useMemo(() => {
    const baseInfo = ALL_FOODS_MAP[foodId] || ALL_FOODS_MAP["101"]; // Fallback tránh crash
    const detailInfo = DETAILED_RECIPES[foodId];
    return {
      id: foodId,
      categoryName: baseInfo?.cat || "Món Ngon",
      name: baseInfo?.name || "Tên món ăn",
      image: baseInfo?.image,
      rating: (4 + Math.random()).toFixed(1),
      views: Math.floor(Math.random() * 5000 + 500).toString(),
      author: { name: "Đầu Bếp Tài Ba", username: "@ChefViet", avatar: require("../assets/images/avt.png") },
      time: detailInfo?.time || "30 phút",
      description: detailInfo?.description || `Món ${baseInfo?.name} thơm ngon, bổ dưỡng.`,
      ingredients: detailInfo?.ingredients || ["Đang cập nhật nguyên liệu..."],
      steps: detailInfo?.steps || [{ title: "Bước 1", content: "Đang cập nhật hướng dẫn..." }]
    };
  }, [foodId]);

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG} />
      
      {/* HEADER */}
      <RecipeHeader 
        title={currentRecipe.categoryName} 
        onBack={() => navigation.goBack()} 
        onSearch={() => navigation.navigate("SearchScreen")}
        isSaved={isSaved}
        
        // Logic Lưu/Bỏ lưu
        onHeartPress={() => {
          if (isSaved) {
             setIsSaved(false);
          } else {
             setCollectionModalVisible(true);
          }
        }}
        
        // Logic Chia sẻ
        onSharePress={() => setShareModalVisible(true)}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        
        {/* HERO IMAGE */}
        <View style={s.heroContainer}>
          <Image source={currentRecipe.image} style={s.heroImage} resizeMode="cover" />
          <View style={s.playBtnOverlay}>
            <View style={s.playBtnCircle}>
               <Ionicons name="play" size={30} color={COLORS.CORAL} style={{marginLeft: 4}} />
            </View>
          </View>
          <View style={s.infoBar}>
            <Text style={s.dishName}>{currentRecipe.name}</Text>
            
            {/* ✅ LOGIC MỞ DANH SÁCH REVIEW: Bấm vào sao/rating */}
            <Pressable 
              style={s.ratingContainer}
              onPress={() => setReviewsListVisible(true)}
            >
              <Ionicons name="star" size={14} color="#fff" />
              <Text style={s.ratingText}> {currentRecipe.rating}</Text>
              <View style={{ width: 10 }} />
              <Image source={require("../assets/images/Vector.png")} style={s.smallIconStyle} resizeMode="contain" />
              <Text style={s.viewsText}>{currentRecipe.views}</Text>
            </Pressable>

          </View>
        </View>

        {/* AUTHOR */}
        <View style={s.authorSection}>
           <Image source={currentRecipe.author.avatar} style={s.avatar} />
           <View style={s.authorInfo}>
              <Text style={s.authorHandle}>{currentRecipe.author.username}</Text>
              <Text style={s.authorName}>{currentRecipe.author.name}</Text>
           </View>
           <Pressable 
              style={[s.followBtn, isFollowing && s.followingBtn]} 
              onPress={() => setIsFollowing(!isFollowing)}
           >
              <Text style={[s.followText, isFollowing && s.followingText]}>
                {isFollowing ? "Đang theo dõi" : "Theo Dõi"}
              </Text>
           </Pressable>
           <Ionicons name="ellipsis-vertical" size={20} color={COLORS.CORAL} style={{marginLeft: 10}} />
        </View>

        <View style={s.divider} />

        {/* DETAILS */}
        <View style={s.section}>
            <Text style={s.sectionTitle}>
                Chi Tiết  <Text style={s.timeText}>⏰ {currentRecipe.time}</Text>
            </Text>
            <Text style={s.descText}>{currentRecipe.description}</Text>
        </View>

        {/* INGREDIENTS */}
        <View style={s.section}>
            <Text style={s.sectionTitle}>Nguyên Liệu</Text>
            {currentRecipe.ingredients.map((ing, index) => (
                <View key={index} style={s.bulletRow}>
                    <Text style={s.bulletPoint}>•</Text>
                    <Text style={s.ingredientText}>{ing}</Text>
                </View>
            ))}
        </View>

        {/* STEPS */}
        <View style={s.section}>
            <Text style={[s.sectionTitle, { marginBottom: 20 }]}>Cách Làm</Text>
            {currentRecipe.steps.map((step, index) => (
                <StepItem key={index} step={step} />
            ))}
        </View>

      </ScrollView>

      {/* --- CÁC MODAL --- */}

      {/* 1. Modal Thêm vào bộ sưu tập */}
      <AddToCollectionModal
        visible={collectionModalVisible}
        onClose={() => setCollectionModalVisible(false)}
        onSelect={(collectionName) => {
           console.log("Đã lưu vào:", collectionName);
           setIsSaved(true); 
           setCollectionModalVisible(false);
        }}
      />

      {/* 2. Modal Chia sẻ */}
      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
      />

      {/* 3. ✅ Modal Danh sách đánh giá */}
      <ReviewsListModal
        visible={reviewsListVisible}
        onClose={() => setReviewsListVisible(false)}
        // Truyền ID để lấy đúng review
        foodId={currentRecipe.id}
        foodData={{
            name: currentRecipe.name,
            image: currentRecipe.image,
            authorName: currentRecipe.author.name,
            authorHandle: currentRecipe.author.username,
            rating: parseFloat(currentRecipe.rating.toString()),
            totalReviews: "456",
        }}
        onAddReviewPress={() => {
            // Tắt list -> Mở form
            setReviewsListVisible(false);
            setTimeout(() => setReviewFormVisible(true), 300);
        }}
      />

      {/* 4. ✅ Modal Viết đánh giá */}
      <ReviewModal
        visible={reviewFormVisible}
        onClose={() => setReviewFormVisible(false)}
        foodName={currentRecipe.name}
        foodImage={currentRecipe.image}
        onSubmit={(rating, comment, recommend) => {
           console.log("Đánh giá:", rating, comment);
           // Tắt form -> Mở Cảm ơn
           setReviewFormVisible(false);
           setTimeout(() => setThankYouVisible(true), 300);
        }}
      />

      {/* 5. ✅ Modal Cảm ơn */}
      <ThankYouModal
        visible={thankYouVisible}
        onClose={() => setThankYouVisible(false)}
      />

    </SafeAreaView>
  );
}

// --- STYLES ---
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG },
  scrollContent: { paddingBottom: 50 },
  heroContainer: { width: '100%', height: 250, position: 'relative', marginBottom: 15 },
  heroImage: { width: width -32, height: '100%', borderRadius: 10, marginHorizontal: 16 },
  playBtnOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', marginHorizontal: 16 },
  playBtnCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  smallIconStyle: { width: 14, height: 14 },
  infoBar: { position: 'absolute', bottom: 0, left: 16, right: 16, height: 50, backgroundColor: COLORS.CORAL, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  dishName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginLeft: 4 },
  viewsText: { color: '#fff', fontSize: 14, marginLeft: 5 },
  
  authorSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee' },
  authorInfo: { flex: 1, marginLeft: 10 },
  authorHandle: { color: COLORS.CORAL, fontSize: 12 },
  authorName: { color: COLORS.TEXT, fontWeight: 'bold', fontSize: 16 },
  followBtn: { backgroundColor: COLORS.CORAL, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, minWidth: 100, alignItems: 'center', justifyContent: 'center' },
  followText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  followingBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.CORAL },
  followingText: { color: COLORS.CORAL },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15, marginHorizontal: 16 },
  section: { paddingHorizontal: 16, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.CORAL, marginBottom: 10 },
  timeText: { fontSize: 14, fontWeight: 'normal', color: COLORS.CORAL },
  descText: { fontSize: 14, color: COLORS.TEXT, lineHeight: 20 },
  bulletRow: { flexDirection: 'row', marginBottom: 6 },
  bulletPoint: { fontSize: 20, marginRight: 10, lineHeight: 22, color: COLORS.TEXT },
  ingredientText: { fontSize: 14, color: COLORS.TEXT, lineHeight: 22, flex: 1 },
});