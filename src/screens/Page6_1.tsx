// page6.1.tsx
// Đặt file này ở: src/screens/page6.1.tsx  (hoặc nơi bạn muốn)
// Ảnh PNG đặt tại: src/assets/categories/*.png (sửa require theo đúng path thực tế)

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
import { Ionicons } from "@expo/vector-icons";
import Page6_1A from "./Page6_1a";
const COLORS = {
  BG: "#FFFFFF",
  CORAL: "#FF6B6B",
  TEXT: "#111111",
} as const;

type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Categories: undefined;
  Profile: undefined;
};

type CategoryItem = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};

const categories: CategoryItem[] = [
  { id: "1", title: "Cơm gia đình", image: require("../assets/images/com-gia-dinh.png") },
  { id: "2", title: "Đặc sản Việt", image: require("../assets/images/com-gia-dinh.png") },
  { id: "3", title: "Tiệc lễ", image: require("../assets/images/com-gia-dinh.png") },
  { id: "4", title: "Món nước ngoài", image: require("../assets/images/com-gia-dinh.png") },
  { id: "5", title: "Chữa lành", image: require("../assets/images/com-gia-dinh.png") },
  { id: "6", title: "Đồ ăn chay", image: require("../assets/images/com-gia-dinh.png") },
  { id: "7", title: "Mới hấp dẫn", image: require("../assets/images/com-gia-dinh.png") },
  { id: "8", title: "Mẹ bầu và con", image: require("../assets/images/com-gia-dinh.png") },
];

function CategoriesHeader({
  title,
  onBack,
  onSearch,
  onBell,
}: {
  title: string;
  onBack?: () => void;
  onSearch?: () => void;
  onBell?: () => void;
}) {
  return (
    <View style={h.header}>
      <Pressable onPress={onBack} style={h.backBtn} hitSlop={10}>
        <Ionicons name="chevron-back" size={18} color="#fff" />
      </Pressable>

      <Text style={h.title}>{title}</Text>

      <View style={h.right}>
        <Pressable onPress={onSearch} style={h.iconBtn} hitSlop={10}>
          <Ionicons name="search" size={16} color={COLORS.CORAL} />
        </Pressable>
        <Pressable onPress={onBell} style={h.iconBtn} hitSlop={10}>
          <Ionicons name="notifications-outline" size={16} color={COLORS.CORAL} />
        </Pressable>
      </View>
    </View>
  );
}

const h = StyleSheet.create({
  header: {
    height: 74,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.CORAL,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.CORAL,
  },
  right: { flexDirection: "row", gap: 10 },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: COLORS.CORAL,
    alignItems: "center",
    justifyContent: "center",
  },
});

function CategoryCard({
  item,
  width,
  onPress,
}: {
  item: CategoryItem;
  width: number;
  onPress?: (item: CategoryItem) => void;
}) {
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
  pillText: { fontSize: 13, fontWeight: "700", color: COLORS.TEXT },
});

function CategoriesScreen() {
  const navigation = useNavigation<any>();
  const { width } = Dimensions.get("window");

  const paddingX = 18;
  const gap = 26;
  const rowGap = 28;
  const cardW = (width - paddingX * 2 - gap) / 2;

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG} />

      <CategoriesHeader title="Phân loại" onBack={() => navigation.navigate("Home")} />

      <FlatList
        data={categories}
        keyExtractor={(it) => it.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: paddingX,
          paddingTop: 8,
          paddingBottom: 120,
        }}
        columnWrapperStyle={{ gap }}
        ItemSeparatorComponent={() => <View style={{ height: rowGap }} />}
        renderItem={({ item }) => <CategoryCard item={item} width={cardW} onPress={() => {}} />}
      />
    </SafeAreaView>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <SafeAreaView style={[s.root, { justifyContent: "center", alignItems: "center" }]}>
      <Text style={{ color: COLORS.TEXT, fontSize: 16 }}>{title}</Text>
    </SafeAreaView>
  );
}

function TabIcon({ focused, name }: { focused: boolean; name: any }) {
  if (focused) {
    return (
      <View style={t.bubble}>
        <Ionicons name={name} size={26} color={COLORS.CORAL} />
      </View>
    );
  }
  return <Ionicons name={name} size={30} color="#fff" />;
}

const t = StyleSheet.create({
  bubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 18,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.CORAL,
    borderTopWidth: 0,

    paddingHorizontal: 18,
    paddingVertical: 6,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  tabItem: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});

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
          children={() => <Placeholder title="Home" />}
          options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="home-outline" /> }}
        />
        <Tab.Screen
          name="Explore"
          children={() => <Placeholder title="Explore" />}
          options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="globe-outline" /> }}
        />
        <Tab.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="layers-outline" /> }}
        />
        <Tab.Screen
          name="Profile"
          children={() => <Placeholder title="Profile" />}
          options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="person-outline" /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG },
});