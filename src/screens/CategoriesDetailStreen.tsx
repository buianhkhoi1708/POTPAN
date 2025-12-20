import React from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  type ImageSourcePropType,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// --- CONSTANTS ---
const COLORS = {
  BG: "#FFFFFF",
  CORAL: "#FF6B6B",
  TEXT: "#111111",
} as const;

const { width } = Dimensions.get("window");

// --- 1. KHO DỮ LIỆU MÓN ĂN (MOCK DATABASE) ---
type FoodItem = { id: string; name: string; image: ImageSourcePropType };

// ⚠️ Lưu ý quan trọng: Hãy đảm bảo tất cả các file ảnh bên dưới 
// đã thực sự tồn tại trong thư mục assets/images của bạn.
// Nếu thiếu file nào, ứng dụng sẽ báo lỗi "Unable to resolve module".
const FOOD_DATABASE: Record<string, FoodItem[]> = {
  // Menu cho ID 1: Cơm gia đình
  "1": [
    { id: "101", name: "Gà kho gừng", image: require("../assets/images/gakhogung.png") },
    { id: "102", name: "Gà kho nghệ", image: require("../assets/images/gakhonghe.png") },
    { id: "103", name: "Cơm chiên", image: require("../assets/images/comchien.png") },
    { id: "104", name: "Gà chiên mắm tỏi", image: require("../assets/images/gachien.png") },
    { id: "105", name: "Vịt om sấu", image: require("../assets/images/vitom.png") },
    { id: "106", name: "Gà rô-ti", image: require("../assets/images/garoti.png") },
    { id: "107", name: "Ức gà xào nấm", image: require("../assets/images/ucgaxaonam.png") },
    { id: "108", name: "Thịt kho trứng", image: require("../assets/images/thitkhotrung.png") },
  ],
  // Menu cho ID 2: Đặc sản Việt
  "2": [
    { id: "201", name: "Phở", image: require("../assets/images/pho.png") },
    { id: "202", name: "Bún bò", image: require("../assets/images/bunbo.png") },
    { id: "203", name: "Nem rán", image: require("../assets/images/nemran.png") },
    { id: "204", name: "Mì quảng", image: require("../assets/images/miquang.png") },
    { id: "205", name: "Bún đậu mắm tôm", image: require("../assets/images/bundaumamtom.png") },
    { id: "206", name: "Xôi gà", image: require("../assets/images/xoiga.png") },
    { id: "207", name: "Cháo lòng", image: require("../assets/images/chaolong.png") },
    { id: "208", name: "Cơm tấm", image: require("../assets/images/comtam.png") },
  ],
  // Menu cho ID 3: Tiệc lễ
  "3": [
    { id: "301", name: "Bò kho", image: require("../assets/images/bokho.png") },
    { id: "302", name: "Súp cua", image: require("../assets/images/supcua.png") },
    { id: "303", name: "Cà ri", image: require("../assets/images/cari.png") },
    { id: "304", name: "Chả giò", image: require("../assets/images/chagio.png") },
    { id: "305", name: "Bò nhúng giấm", image: require("../assets/images/bonhunggiam.png") },
    { id: "306", name: "Lẩu cua đồng", image: require("../assets/images/laucuadong.png") },
    { id: "307", name: "Lẩu Thái", image: require("../assets/images/lauthai.png") },
    { id: "308", name: "Lẩu mắm", image: require("../assets/images/laumam.png") },
  ],
  // Menu cho ID 4: Món nước ngoài
  "4": [
    { id: "401", name: "Mì Ý", image: require("../assets/images/miy.png") },
    { id: "402", name: "Hamburger", image: require("../assets/images/ham.png") },
    { id: "403", name: "Lasagna", image: require("../assets/images/lasagma.png") },
    { id: "404", name: "Steak", image: require("../assets/images/steak.png") },
    { id: "405", name: "Kimbap", image: require("../assets/images/kimbap.png") },
    { id: "406", name: "Khoai tây nghiền", image: require("../assets/images/khoaitaynghien.png") },
    { id: "407", name: "Ức vịt sốt cam", image: require("../assets/images/ucvitsotcam.png") },
    { id: "408", name: "Gà kem hành", image: require("../assets/images/gakemhanh.png") },
  ],
  // Menu cho ID 5: Chữa lành
  "5": [
    { id: "501", name: "Súp rau củ", image: require("../assets/images/tauhukho.png") }, // Check lại ảnh này
    { id: "502", name: "Giò hầm bí đỏ", image: require("../assets/images/giohambido.png") },
    { id: "503", name: "Canh bí đao", image: require("../assets/images/canhbidao.png") },
    { id: "504", name: "Súp gà", image: require("../assets/images/supga.png") },
    { id: "505", name: "Gà tiềm thuốc", image: require("../assets/images/gatiem.png") },
    { id: "506", name: "Canh bí hầm sườn", image: require("../assets/images/canhbihamsuon.png") },
    { id: "507", name: "Chân giò hầm lạc", image: require("../assets/images/changiohamlac.png") },
    { id: "508", name: "Cháo thịt băm", image: require("../assets/images/chaothitbam.png") },
  ],
  // Menu cho ID 6: Đồ ăn chay
  "6": [
    { id: "601", name: "Tàu hũ kho", image: require("../assets/images/tauhukho.png") },
    { id: "602", name: "Chả giò chay", image: require("../assets/images/chagio.png") },
    { id: "603", name: "Mít kho", image: require("../assets/images/mitkho.png") },
    { id: "604", name: "Đậu hũ sốt cà", image: require("../assets/images/dauhusocachua.png") },
    { id: "605", name: "Củ sen kho", image: require("../assets/images/cusenkho.png") },
    { id: "606", name: "Sườn non rim", image: require("../assets/images/suonnonchayrim.png") },
    { id: "607", name: "Chả chay", image: require("../assets/images/chachay.png") },
    { id: "608", name: "Bì cuốn", image: require("../assets/images/bicuon.png") },
  ],
  // Menu cho ID 7: Mồi hấp dẫn
  "7": [
    { id: "701", name: "Đậu tẩm hành", image: require("../assets/images/dautamhanh.png") },
    { id: "702", name: "Nấm rơm xào tỏi", image: require("../assets/images/namromxaotoi.png") },
    { id: "703", name: "Tóp mỡ rim", image: require("../assets/images/topmorim.png") },
    { id: "704", name: "Mực nướng", image: require("../assets/images/mucnuong.png") },
    { id: "705", name: "Nghêu xào", image: require("../assets/images/ngheuxao.png") },
    { id: "706", name: "Chả cá thác lác", image: require("../assets/images/chacathaclac.png") },
    { id: "707", name: "Mề gà xào mướp", image: require("../assets/images/megaxaomuop.png") },
    { id: "708", name: "Gà quay mật ong", image: require("../assets/images/gaquaymatong.png") },
  ],
  // Menu cho ID 8: Mẹ bầu và con
  "8": [
    { id: "801", name: "Súp gà ngô non", image: require("../assets/images/supgangonon.png") },
    { id: "802", name: "Cháo cá chép", image: require("../assets/images/chaocachep.png") },
    { id: "803", name: "Canh mọc", image: require("../assets/images/canhmoc.png") },
    { id: "804", name: "Cá hồi sốt cam", image: require("../assets/images/cahoisotcam.png") },
    { id: "805", name: "Gà hầm sen", image: require("../assets/images/gahamsen.png") },
    { id: "806", name: "Lươn xào sả ớt", image: require("../assets/images/luonxaoxaot.png") },
    { id: "807", name: "Bò xào nấm", image: require("../assets/images/boxaonam.png") },
    { id: "808", name: "Mực xào rau củ", image: require("../assets/images/mucxaoraucu.png") },
  ],
};

// --- 2. COMMON COMPONENTS ---

// Header chung
function DetailHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const navigation = useNavigation<any>();
  return (
    <View style={h.header}>
      <Pressable onPress={onBack} style={h.circleBtn} hitSlop={10}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </Pressable>
      <Text style={h.title}>{title}</Text>
      <View style={h.rightGroup}>
        <Pressable 
          style={h.circleBtn}
        >
          <Ionicons name="search" size={30} color="#fff" />
        </Pressable>
        <Pressable style={h.circleBtn}
          onPress={() => navigation.navigate("SearchScreen")}>
          <Ionicons name="notifications" size={30} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const h = StyleSheet.create({
  header: {
    marginTop: 40,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  title: { fontSize: 30, fontWeight: "bold", color: COLORS.CORAL },
  rightGroup: { flexDirection: "row", gap: 10 },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.CORAL,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

// Card Món ăn (Updated: Có Navigation)
function FoodCard({ item, width }: { item: FoodItem; width: number }) {
  // Sử dụng hook navigation để chuyển trang
  const navigation = useNavigation<any>();

  return (
    <Pressable
      style={[c.container, { width }]}
      onPress={() => {
        // Điều hướng sang màn hình RecipeDetail và truyền ID món ăn
        navigation.navigate("RecipeDetail", { foodId: item.id });
      }}
    >
      <View style={c.imageWrapper}>
        <Image source={item.image} style={c.image} resizeMode="cover" />
      </View>
      <View style={c.pill}>
        <Text style={c.pillText} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </Pressable>
  );
}

const c = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 20 },
  imageWrapper: {
    width: "100%",
    height: 130,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: { width: "100%", height: "100%" },
  pill: {
    marginTop: -20,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.CORAL,
    maxWidth: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  pillText: { fontSize: 18, fontWeight: "700", color: "#000", textAlign: "center" },
});

// --- 3. MAIN REUSABLE SCREEN ---
export default function CategoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  // Lấy params được truyền từ màn hình danh sách
  const { categoryId, categoryTitle } = route.params || {};

  // Lấy danh sách món ăn dựa trên ID
  const foodList = FOOD_DATABASE[categoryId] || [];

  const paddingHorizontal = 18;
  const gap = 30;
  const itemWidth = (width - paddingHorizontal * 2 - gap) / 2;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.BG }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG} />

      {/* Header hiển thị Title động */}
      <DetailHeader
        title={categoryTitle || "Chi tiết"}
        onBack={() => navigation.goBack()}
      />

      {/* Hiển thị danh sách món ăn */}
      <FlatList
        data={foodList}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: 30,
          paddingBottom: 100, // Padding đáy để tránh TabBar (nếu có)
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <FoodCard item={item} width={itemWidth} />}

        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        // Hiển thị khi danh sách trống
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Ionicons name="restaurant-outline" size={50} color="#ccc" />
            <Text style={{ color: "#888", marginTop: 10 }}>
              Chưa có món ăn nào trong mục này.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}