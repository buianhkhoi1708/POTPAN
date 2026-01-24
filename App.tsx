// Nhóm 9 - IE307.Q12
import "./src/config/i18n";
import React, { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import * as Linking from "expo-linking";
import { supabase } from "./src/config/supabaseClient";
import { useAuthStore } from "./src/store/useAuthStore";
import { AppNavigator } from "./src/navigations/AppStackNavigator";
import {
  useFonts,
  RobotoSlab_400Regular,
  RobotoSlab_500Medium,
  RobotoSlab_700Bold,
} from "@expo-google-fonts/roboto-slab";
import { Roboto_300Light_Italic } from "@expo-google-fonts/roboto";
import { AppFonts } from "./src/styles/fonts";

export default function App() {
  const [fontsLoaded] = useFonts({
    [AppFonts.RobotoSlabRegular]: RobotoSlab_400Regular,
    [AppFonts.RobotoSlabMedium]: RobotoSlab_500Medium,
    [AppFonts.RobotoSlabBold]: RobotoSlab_700Bold,
    [AppFonts.RobotoLightItalic]: Roboto_300Light_Italic,
  });

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      let { url } = event;

      if (url.includes("expo-development-client")) return;

      console.log("🚀 URL NHẬN VỀ:", url);

      let access_token, refresh_token;

      const paramsString = url.includes("#")
        ? url.split("#")[1]
        : url.split("?")[1];

      if (paramsString) {
        const pairs = paramsString.split("&");

        pairs.forEach((pair) => {
          if (pair.startsWith("access_token=")) {
            access_token = pair.substring(13);
          }
          if (pair.startsWith("refresh_token=")) {
            refresh_token = pair.substring(14);
          }
        });

        if (access_token) access_token = decodeURIComponent(access_token);
        if (refresh_token) refresh_token = decodeURIComponent(refresh_token);
      }

      if (access_token && refresh_token) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: String(access_token),
            refresh_token: String(refresh_token),
          });

          if (error) throw error;

          if (data.session) {
            console.log("✅ Google Login thành công! Đang vào App...");
            await useAuthStore.getState().setSession(data.session);
          }
        } catch (e: any) {
          console.log("❌ Lỗi nạp Session:", e);
          Alert.alert("Đăng nhập thất bại", "Không thể xác thực với Google.");
        }
      }
    };

    const linkSubscription = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      linkSubscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AppNavigator />;
}
