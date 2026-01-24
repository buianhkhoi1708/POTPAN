// Nhóm 9 - IE307.Q12
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import { navigate } from '../utils/RootNavigation';
import { AppLightColor } from '../styles/color';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalNotification = () => {
  const { user } = useAuthStore();
  const [notification, setNotification] = useState<any>(null);
  
  const translateY = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('global_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
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

  const showNotification = async (data: any) => {
    try {
      const savedSetting = await AsyncStorage.getItem('SHOW_POPUP_IN_APP');
      const isEnabled = savedSetting === 'true' || savedSetting === null;

      if (!isEnabled) {
        console.log("Global Notification bị chặn do cài đặt của User.");
        return; 
      }
    } catch (error) {
      console.log("Lỗi đọc setting notification:", error);
    }

    setNotification(data);

    Animated.spring(translateY, {
      toValue: 0, 
      useNativeDriver: true,
      speed: 12,
      bounciness: 8,
    }).start();

    setTimeout(() => {
      hideNotification();
    }, 4000);
  };

  const hideNotification = () => {
    Animated.timing(translateY, {
      toValue: -150, 
      duration: 300,
      useNativeDriver: true,
    }).start(() => setNotification(null));
  };

  const handlePress = () => {
    hideNotification();
    if (notification?.data?.recipeId) {
       navigate('RecipeDetailScreen', { item: { id: notification.data.recipeId } });
    } else if (notification?.recipe_id) {
       navigate('RecipeDetailScreen', { item: { id: notification.recipe_id } });
    } else {
       navigate('NotificationScreen');
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
    zIndex: 9999, 
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    paddingTop: Platform.OS === 'android' ? 35 : 0, 
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
    backgroundColor: AppLightColor.primary_color,
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