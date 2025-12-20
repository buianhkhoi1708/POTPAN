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

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import SearchScreen from "./SearchScreen";

// ✅ IMPORT CÁC MÀN HÌNH CON (Đảm bảo đường dẫn đúng)
import CategoryDetailScreen from "./CategoriesDetailStreen"; 
import RecipeDetailScreen from "./RecipeDetailScreen";

// --- CONFIG & CONSTANTS ---
const COLORS = {
  BG: "#FFFFFF",
  CORAL: "#FF6B6B",
  TEXT: "#111111",
} as const;

// --- TYPES ---
type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Categories: undefined;
  Profile: undefined;
  SearchScreen: undefined;
};

// Định nghĩa Stack bao gồm: Danh sách loại -> Chi tiết loại -> Chi tiết công thức
type CategoriesStackParamList = {
  Categories: undefined;
  CategoryDetail: { 
    categoryId: string; 
    categoryTitle: string; 
  };
  RecipeDetail: { foodId: string }; // Màn hình công thức
};

type CategoryItem = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};

// --- MOCK DATA ---
const categories: CategoryItem[] = [
  { id: "1", title: "Cơm gia đình", image: require("../assets/images/com-gia-dinh.png") },
  { id: "2", title: "Đặc sản Việt", image: require("../assets/images/dac-san-viet.png") },
  { id: "3", title: "Tiệc lễ", image: require("../assets/images/tiec-le.png") },
  { id: "4", title: "Món nước ngoài", image: require("../assets/images/mon-nuoc-ngoai.png") },
  { id: "5", title: "Chữa lành", image: require("../assets/images/chua-lanh.png") },
  { id: "6", title: "Đồ ăn chay", image: require("../assets/images/do-an-chay.png") },
  { id: "7", title: "Mới hấp dẫn", image: require("../assets/images/moi-hap-dan.png") },
  { id: "8", title: "Mẹ bầu và con", image: require("../assets/images/me-bau-va-con.png") },
];

// --- COMPONENTS ---

// 1. Header Mới (Nút Tròn Đỏ - Icon Trắng)
function CategoriesHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={h.header}>
      <Pressable onPress={onBack} style={h.circleBtn} hitSlop={10}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>

      <Text style={h.title}>{title}</Text>

      <View style={h.rightGroup}>
        <Pressable style={h.circleBtn}>
          <Ionicons name="search" size={20} color="#fff" />
        </Pressable>
        <Pressable style={h.circleBtn}>
          <Ionicons name="notifications" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const h = StyleSheet.create({
  header: {
    marginTop: 30,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.CORAL,
  },
  rightGroup: {
    flexDirection: "row",
    gap: 10,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.CORAL, // Nền đỏ
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

// 2. Category Card
function CategoryCard({ item, width, onPress }: { item: CategoryItem; width: number; onPress?: (item: CategoryItem) => void }) {
  return (
    <Pressable style={[c.wrap, { width }]} onPress={() => onPress?.(item)}>
      <View style={c.card}>
        <Image source={item.image} style={c.img} resizeMode="cover" />
      </View>
      <View style={c.pill}>
        <Text style={c.pillText} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );
}

const c = StyleSheet.create({
  wrap: { alignItems: "center" },
  card: {
    width: "100%",
    height: 128,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  img: { width: "100%", height: "100%" },
  pill: {
    marginTop: 10,
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: COLORS.CORAL,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "94%",
  },
  pillText: { fontSize: 18, fontWeight: "700", color: COLORS.TEXT },
});

// --- SCREENS ---

function CategoriesScreen() {
  const navigation = useNavigation<any>();
  const { width } = Dimensions.get("window");
  const paddingX = 18;
  const gap = 26;
  const cardW = (width - paddingX * 2 - gap) / 2;

  // Logic điều hướng thông minh
  const onPressItem = (item: CategoryItem) => {
    // Chuyển hướng sang màn hình Chi tiết Chung
    navigation.navigate("CategoryDetail", {
      categoryId: item.id,
      categoryTitle: item.title,
    });
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG} />
      
      <CategoriesHeader title="Phân loại" onBack={() => navigation.goBack()} />

      <FlatList
        data={categories}
        keyExtractor={(it) => it.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: paddingX,
          paddingTop: 8,
          paddingBottom: 120, // Padding để tránh TabBar che mất
        }}
        columnWrapperStyle={{ gap }}
        ItemSeparatorComponent={() => <View style={{ height: 28 }} />}
        renderItem={({ item }) => (
          <CategoryCard item={item} width={cardW} onPress={onPressItem} />
        )}
      />
    </SafeAreaView>
  );
}

// --- NAVIGATORS ---

// 1. Stack Navigator (Quản lý chuyển màn hình)
const CategoriesStack = createNativeStackNavigator<any>();
function CategoriesStackNavigator() {
  return (
    <CategoriesStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Màn 1: Danh sách phân loại */}
      <CategoriesStack.Screen name="Categories" component={CategoriesScreen} />
      
      {/* Màn 2: Chi tiết từng loại (List món ăn) */}
      <CategoriesStack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      
      {/* Màn 3: Chi tiết công thức nấu ăn (Fix: Đã thêm vào đây) */}
      <CategoriesStack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen} 
        options={{ animation: 'slide_from_bottom' }}
      />
      <CategoriesStack.Screen 
        name="SearchScreen"
        component={SearchScreen} 
        options={{ animation: 'fade_from_bottom' }} 
      />
    </CategoriesStack.Navigator>
  );
}

// 2. Tab Components & Styles

function Placeholder({ title }: { title: string }) {
  return (
    <SafeAreaView style={[s.root, { justifyContent: "center", alignItems: "center" }]}>
      <Text>{title}</Text>
    </SafeAreaView>
  );
}

function TabIcon({ focused, name }: { focused: boolean; name: any }) {
  if (focused) {
    return (
      <View style={t.activeBubble}>
        <Ionicons name={name} size={26} color={COLORS.CORAL} />
      </View>
    );
  }
  return <Ionicons name={name} size={30} color="#FFFFFF" />;
}

// Style Tab Bar "Compact"
const t = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    // Căn chỉnh ngắn gọn ở giữa
    left: '20%',  
    right: '20%', 
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.CORAL,
    borderTopWidth: 0,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
    paddingBottom: 0,
  },
  tabItem: {
    height: 64,
    padding: 0,
  },
  activeBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG },
});

// --- ROOT APP ---

const Tab = createBottomTabNavigator<TabParamList>();

export default function Page6_1() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: t.tabBar,
          tabBarItemStyle: t.tabItem,
        }}
      >
        <Tab.Screen
          name="Home"
          component={() => <Placeholder title="Home" />}
          options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="home-outline" /> }}
        />
        <Tab.Screen
          name="Explore"
          component={() => <Placeholder title="Explore" />}
          options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="globe-outline" /> }}
        />
        <Tab.Screen
          name="Categories"
          component={CategoriesStackNavigator}
          options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="layers-outline" /> }}
        />
        <Tab.Screen
          name="Profile"
          component={() => <Placeholder title="Profile" />}
          options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="person-outline" /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}