import "./src/config/i18n";
import React, { useEffect } from 'react'; 
import { View, ActivityIndicator, Alert } from 'react-native'; 
import * as Linking from 'expo-linking'; 
import { supabase } from './src/config/supabaseClient'; 
import { useAuthStore } from "./src/store/useAuthStore"; 

import { AppNavigator } from './src/navigations/AppStackNavigator';
import { 
  useFonts, 
  RobotoSlab_400Regular, 
  RobotoSlab_500Medium, 
  RobotoSlab_700Bold 
} from '@expo-google-fonts/roboto-slab';
import { 
  Roboto_300Light_Italic 
} from '@expo-google-fonts/roboto';
import { AppFonts } from './src/styles/fonts'; 

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
      
      // Bỏ qua link nội bộ của Expo Development Client
      if (url.includes('expo-development-client')) return;

      console.log("🚀 URL NHẬN VỀ:", url);

      let access_token, refresh_token;

      // --- LOGIC XỬ LÝ TOKEN MỚI (AN TOÀN CHO GOOGLE) ---
      // Lấy phần chuỗi chứa tham số (sau dấu # hoặc ?)
      const paramsString = url.includes('#') ? url.split('#')[1] : url.split('?')[1];

      if (paramsString) {
        const pairs = paramsString.split('&'); 
        
        pairs.forEach(pair => {
            // Dùng substring để lấy trọn vẹn token, kể cả có ký tự đặc biệt
            if (pair.startsWith('access_token=')) {
                access_token = pair.substring(13); // 'access_token='.length = 13
            }
            if (pair.startsWith('refresh_token=')) {
                refresh_token = pair.substring(14); // 'refresh_token='.length = 14
            }
        });

        // Giải mã URL (Phòng trường hợp Google mã hóa ký tự)
        if (access_token) access_token = decodeURIComponent(access_token);
        if (refresh_token) refresh_token = decodeURIComponent(refresh_token);
      }

      // --- NẠP VÀO SUPABASE ---
      if (access_token && refresh_token) {
        try {
          // Bước A: Set Session
          const { data, error } = await supabase.auth.setSession({
            access_token: String(access_token),
            refresh_token: String(refresh_token),
          });

          if (error) throw error;

          // Bước B: Cập nhật Store ngay lập tức để chuyển màn hình
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

    // Đăng ký lắng nghe sự kiện
    const linkSubscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      linkSubscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
      <AppNavigator/>
  );
}