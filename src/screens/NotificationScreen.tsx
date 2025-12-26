import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import BottomNavSpacer from "../components/AppBottomSpace";
import { AppLightColor } from "../styles/color";

// --- GIỮ NGUYÊN IMPORT SVG CỦA BẠN ---
import BackArrow from "../assets/images/backarrow.svg";
import UpdateIcon from "../assets/images/update.svg";
import WarnIcon from "../assets/images/warn.svg";
import StarNotiIcon from "../assets/images/star-noti.svg";

import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";

type NotiType = "update" | "warn" | "star";

interface NotiItem {
  id: string;
  type: NotiType;
  title: string;
  message: string;
  created_at: string;
  timeLabel?: string;
  is_read: boolean;
}
interface GroupedOldDay {
  dateLabel: string;
  items: NotiItem[];
}

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<MainTabKey>("home");

  const [todayList, setTodayList] = useState<NotiItem[]>([]);
  const [yesterdayList, setYesterdayList] = useState<NotiItem[]>([]);
  const [otherDays, setOtherDays] = useState<GroupedOldDay[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Hàm tính thời gian (Vd: 5 phút trước)
  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch (e) {
      return "Vừa xong";
    }
  };

  // Hàm xử lý và phân nhóm thông báo
  const processNotifications = (rawData: any[]) => {
    const today: NotiItem[] = [];
    const yesterday: NotiItem[] = [];
    const othersMap: Record<string, NotiItem[]> = {};
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    rawData.forEach((item) => {
      const itemDate = new Date(item.created_at);
      const newItem: NotiItem = {
        ...item,
        timeLabel: getTimeAgo(item.created_at),
        // Nếu DB trả về type null, mặc định là 'update' để không lỗi icon
        type: item.type || 'update', 
      };
      
      const checkDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

      if (checkDate.getTime() === startOfToday.getTime()) {
        today.push(newItem);
      } else if (checkDate.getTime() === startOfYesterday.getTime()) {
        yesterday.push(newItem);
      } else {
        const dateKey = `${itemDate.getDate().toString().padStart(2, "0")}/${(
          itemDate.getMonth() + 1
        ).toString().padStart(2, "0")}/${itemDate.getFullYear()}`;
        
        if (!othersMap[dateKey]) othersMap[dateKey] = [];
        othersMap[dateKey].push(newItem);
      }
    });

    setTodayList(today);
    setYesterdayList(yesterday);
    setOtherDays(
      Object.keys(othersMap).map((date) => ({
        dateLabel: date,
        items: othersMap[date],
      }))
    );
  };

  // Hàm tải dữ liệu từ Supabase
  const fetchNotifications = useCallback(async () => {
    try {
      if (!user) return;
      if (!refreshing) setLoading(true);
      
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) processNotifications(data);
    } catch (error) {
      console.log("Lỗi tải thông báo:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, refreshing]);

  // Tự động tải và đánh dấu đã đọc khi vào màn hình
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      
      const markAsRead = async () => {
        if (user) {
          await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user.id)
            .eq("is_read", false);
        }
      };
      markAsRead();
    }, [fetchNotifications])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Render Icon dựa trên Type (Giữ nguyên logic của bạn)
  const renderIcon = (type: NotiType) => {
    switch (type) {
      case "update":
        return <UpdateIcon width={22} height={22} />;
      case "warn":
        return <WarnIcon width={22} height={22} />;
      case "star":
        return <StarNotiIcon width={22} height={22} />;
      default:
        return <UpdateIcon width={22} height={22} />;
    }
  };

  const renderItem = (item: NotiItem) => (
    <View key={item.id} style={styles.itemWrapper}>
      <View style={[styles.itemRow, !item.is_read && styles.unreadRow]}> 
        <View style={styles.itemLeft}>
          <View style={styles.iconCircle}>{renderIcon(item.type)}</View>
          <View style={styles.itemTextCol}>
            <AppText variant="medium" style={styles.notiTitle}>
              {item.title}
            </AppText>
            <AppText variant="light" style={styles.notiMessage}>
              {item.message}
            </AppText>
          </View>
        </View>
      </View>
      <AppText variant="light" style={styles.notiTime}>
        {item.timeLabel}
      </AppText>
    </View>
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackArrow width={18} height={18} />
          </Pressable>
          <AppText variant="title" style={styles.headerTitle}>
            Thông báo
          </AppText>
          <View style={styles.headerSpacer} />
        </View>

        {loading && !refreshing ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator
              size="large"
              color={AppLightColor.primary_color}
            />
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={AppLightColor.primary_color}
              />
            }
          >
            {todayList.length > 0 && (
              <>
                <AppText variant="medium" style={styles.sectionLabel}>
                  Hôm nay
                </AppText>
                {todayList.map(renderItem)}
              </>
            )}
            {yesterdayList.length > 0 && (
              <>
                <AppText variant="medium" style={styles.sectionLabel}>
                  Hôm qua
                </AppText>
                {yesterdayList.map(renderItem)}
              </>
            )}
            {otherDays.map((group) => (
              <View key={group.dateLabel} style={styles.dateGroup}>
                <AppText variant="medium" style={styles.dateLabel}>
                  {group.dateLabel}
                </AppText>
                {group.items.map(renderItem)}
              </View>
            ))}
            {todayList.length === 0 &&
              yesterdayList.length === 0 &&
              otherDays.length === 0 && (
                <View style={styles.emptyContainer}>
                  <AppText style={styles.emptyText}>
                    Chưa có thông báo nào
                  </AppText>
                </View>
              )}
            <BottomNavSpacer height={60} />
          </ScrollView>
        )}
        <AppMainNavBar
          activeTab={activeTab}
          onTabPress={(tab) => {
             setActiveTab(tab);
             if(tab === 'home') navigation.navigate('HomeScreen');
             if(tab === 'profile') navigation.navigate('ProfileScreen');
          }}
        />
      </View>
    </AppSafeView>
  );
};
export default NotificationScreen;

// GIỮ NGUYÊN STYLE CŨ CỦA BẠN
const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    color: AppLightColor.primary_color,
  },
  headerSpacer: { width: 32, height: 32 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  centerLoading: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#999", fontSize: 14 },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    color: AppLightColor.primary_text,
    fontWeight: "700",
  },
  dateGroup: { marginTop: 8 },
  dateLabel: {
    marginBottom: 8,
    fontSize: 13,
    color: AppLightColor.primary_text,
  },
  itemWrapper: { marginBottom: 10 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#ffe3e2", // Màu nền hồng gốc của bạn
  },
  unreadRow: {
    backgroundColor: "#ffcdd2", // Đậm hơn chút nếu chưa đọc (tùy chọn)
  },
  itemLeft: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  itemTextCol: { flexShrink: 1 },
  notiTitle: {
    fontSize: 14,
    color: AppLightColor.primary_color,
    fontWeight: "700",
    marginBottom: 2,
  },
  notiMessage: { fontSize: 13, color: AppLightColor.primary_text },
  notiTime: {
    marginTop: 4,
    fontSize: 11,
    color: "#000000ff",
    alignSelf: "flex-end",
    marginRight: 4,
  },
});