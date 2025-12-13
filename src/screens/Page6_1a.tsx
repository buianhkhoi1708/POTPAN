import React from "react";
import { SafeAreaView, StatusBar, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = { BG: "#FFFFFF", CORAL: "#FF6B6B", TEXT: "#111111" } as const;

export default function Page6_1A() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.BG }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG} />

      <View
        style={{
          height: 74,
          paddingHorizontal: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: COLORS.CORAL,
            alignItems: "center",
            justifyContent: "center",
          }}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={18} color="#fff" />
        </Pressable>

        <Text style={{ fontSize: 20, fontWeight: "800", color: COLORS.CORAL }}>
          Cơm gia đình
        </Text>

        <View style={{ width: 30, height: 30 }} />
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: COLORS.TEXT, fontSize: 16 }}>page6.1a.tsx</Text>
      </View>
    </SafeAreaView>
  );
}
