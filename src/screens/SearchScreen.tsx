import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  BG: "#FFFFFF",
  CORAL: "#FF6B6B",
  TEXT: "#333333",
  GRAY_BG: "#F5F5F5",
  GRAY_TEXT: "#999",
};

const { width } = Dimensions.get("window");

// --- 1. DỮ LIỆU TÌM KIẾM (GỘP TẤT CẢ MÓN ĂN VÀO ĐÂY) ---
// Tech Lead Note: Trong thực tế, bạn nên import cái này từ một file data chung.
// Ở đây tôi gộp lại để bạn dễ copy chạy luôn.
const ALL_RECIPES = [
  { id: "101", name: "Gà kho gừng", image: require("../assets/images/gakhogung.png") },
  { id: "102", name: "Gà kho nghệ", image: require("../assets/images/gakhonghe.png") },
  { id: "103", name: "Cơm chiên", image: require("../assets/images/comchien.png") },
  { id: "201", name: "Phở bò", image: require("../assets/images/pho.png") },
  { id: "202", name: "Bún bò Huế", image: require("../assets/images/bunbo.png") },
  { id: "301", name: "Bò kho", image: require("../assets/images/bokho.png") },
  { id: "307", name: "Lẩu Thái", image: require("../assets/images/lauthai.png") },
  { id: "401", name: "Mì Ý", image: require("../assets/images/miy.png") },
  { id: "404", name: "Steak (Bò bít tết)", image: require("../assets/images/steak.png") },
  { id: "601", name: "Tàu hũ kho", image: require("../assets/images/tauhukho.png") },
  // ... Bạn có thể thêm tiếp các món khác vào đây
];

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState(ALL_RECIPES);

  // Logic lọc dữ liệu
  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = ALL_RECIPES.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(ALL_RECIPES); // Nếu xóa hết chữ thì hiện lại tất cả (hoặc để rỗng tùy ý)
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG} />

      {/* --- HEADER TÌM KIẾM --- */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT} />
        </Pressable>
        
        <View style={s.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.GRAY_TEXT} />
          <TextInput
            style={s.input}
            placeholder="Tìm món ăn..."
            placeholderTextColor={COLORS.GRAY_TEXT}
            value={searchText}
            onChangeText={handleSearch}
            autoFocus={true} // Tự động bật bàn phím khi vào màn hình
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.GRAY_TEXT} />
            </Pressable>
          )}
        </View>
      </View>

      {/* --- KẾT QUẢ TÌM KIẾM --- */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled" // Để bấm vào item không bị ẩn bàn phím ngay
        renderItem={({ item }) => (
          <Pressable
            style={s.itemContainer}
            onPress={() => navigation.navigate("RecipeDetail", { foodId: item.id })}
          >
            <Image source={item.image} style={s.itemImage} resizeMode="cover" />
            <View style={s.itemInfo}>
              <Text style={s.itemName}>{item.name}</Text>
              <Text style={s.itemSub}>Món ngon</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.GRAY_TEXT} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Ionicons name="search-outline" size={50} color="#ddd" />
            <Text style={{ color: "#999", marginTop: 10 }}>Không tìm thấy món ăn nào</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { padding: 5, marginRight: 10 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.GRAY_BG,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.TEXT,
  },
  // Item Styles
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    // Shadow nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  itemImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: "#eee" },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 16, fontWeight: "bold", color: COLORS.TEXT },
  itemSub: { fontSize: 13, color: COLORS.GRAY_TEXT, marginTop: 4 },
  emptyState: { alignItems: "center", marginTop: 50 },
});