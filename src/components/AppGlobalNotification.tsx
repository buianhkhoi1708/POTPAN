// components/GlobalNotification.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient'; // Đường dẫn file config của bạn
import { useAuthStore } from '../store/useAuthStore'; // Đường dẫn store auth của bạn
import { navigate } from '../utils/RootNavigation'; // File vừa tạo ở Bước 1
import { AppLightColor } from '../styles/color';

const GlobalNotification = () => {
  const { user } = useAuthStore();
  const [notification, setNotification] = useState<any>(null);
  
  // Animation: Bắt đầu ẩn ở phía trên (-150px)
  const translateY = useRef(new Animated.Value(-150)).current;

  // --- 1. LẮNG NGHE REALTIME ---
  useEffect(() => {
    if (!user) return;

    console.log("Đang lắng nghe thông báo cho user:", user.id);

    const subscription = supabase
      .channel('global_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`, // Chỉ nhận thông báo của mình
        },
        (payload) => {
          const newNoti = payload.new;
          showNotification(newNoti);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // --- 2. HIỆU ỨNG HIỂN THỊ ---
  const showNotification = (data: any) => {
    setNotification(data);

    // Trượt xuống
    Animated.spring(translateY, {
      toValue: 0, // Vị trí hiển thị (ngay dưới tai thỏ)
      useNativeDriver: true,
      speed: 12,
      bounciness: 8,
    }).start();

    // Tự động ẩn sau 4 giây
    setTimeout(() => {
      hideNotification();
    }, 4000);
  };

  const hideNotification = () => {
    Animated.timing(translateY, {
      toValue: -150, // Trượt ngược lên trên
      duration: 300,
      useNativeDriver: true,
    }).start(() => setNotification(null));
  };

  // --- 3. XỬ LÝ KHI BẤM VÀO ---
  const handlePress = () => {
    hideNotification();
    if (notification?.recipe_id) {
      // Chuyển hướng đến màn hình chi tiết món ăn
      // Đảm bảo tên màn hình 'RecipeDetailScreen' đúng với Stack của bạn
      navigate('RecipeDetailScreen', { 
        item: { id: notification.recipe_id, title: "Chi tiết món ăn" } 
      });
    }
  };

  if (!notification) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <SafeAreaView>
        <Pressable style={styles.content} onPress={handlePress}>
          <View style={styles.iconBox}>
            <Ionicons name="notifications" size={24} color="#fff" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
            <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
          </View>
          {/* Nút đóng nhỏ */}
          <Pressable onPress={hideNotification} style={{ padding: 5 }}>
            <Ionicons name="close" size={20} color="#999" />
          </Pressable>
        </Pressable>
      </SafeAreaView>
    </Animated.View>
  );
};

export default GlobalNotification;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999, // Đảm bảo luôn nằm trên cùng
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    // Shadow đẹp
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    paddingTop: Platform.OS === 'android' ? 35 : 0, // Fix tai thỏ Android
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppLightColor.primary_color, // Màu chủ đạo của app
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    color: '#666',
  },
});