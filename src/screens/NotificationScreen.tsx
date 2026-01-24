// Nhóm 9 - IE307.Q12
import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar, { type MainTabKey } from "../components/AppMainNavBar";
import BottomNavSpacer from "../components/AppBottomSpace";
import AppHeader from "../components/AppHeader";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

type NotiType = "update" | "warn" | "star";

interface NotiItem {
  id: string;
  type: NotiType;
  title: string;
  message: string;
  created_at: string;
  timeLabel?: string;
  is_read: boolean;
  recipe_id?: number;
}

interface GroupedOldDay {
  dateLabel: string;
  items: NotiItem[];
}

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState<MainTabKey>("home");
  const [todayList, setTodayList] = useState<NotiItem[]>([]);
  const [yesterdayList, setYesterdayList] = useState<NotiItem[]>([]);
  const [otherDays, setOtherDays] = useState<GroupedOldDay[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getTimeAgo = (dateString: string) => {
    try {
      const currentLocale = i18n.language === "en" ? enUS : vi;
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: currentLocale,
      });
    } catch (e) {
      return t("common.just_now");
    }
  };

  const processNotifications = (rawData: any[]) => {
    const today: NotiItem[] = [];
    const yesterday: NotiItem[] = [];
    const othersMap: Record<string, NotiItem[]> = {};

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    rawData.forEach((item) => {
      const itemDate = new Date(item.created_at);
      const newItem: NotiItem = {
        ...item,
        timeLabel: getTimeAgo(item.created_at),
        type: item.type || "update",
      };

      const checkDate = new Date(
        itemDate.getFullYear(),
        itemDate.getMonth(),
        itemDate.getDate()
      );

      if (checkDate.getTime() === startOfToday.getTime()) {
        today.push(newItem);
      } else if (checkDate.getTime() === startOfYesterday.getTime()) {
        yesterday.push(newItem);
      } else {
        const dateKey = `${itemDate.getDate().toString().padStart(2, "0")}/${(
          itemDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${itemDate.getFullYear()}`;
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
  }, [user, refreshing, i18n.language]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      const markAsRead = async () => {
        if (user)
          await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user.id)
            .eq("is_read", false);
      };
      markAsRead();
    }, [fetchNotifications])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleItemPress = async (item: NotiItem) => {
    if (item.recipe_id) {
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("*, users(*)")
          .eq("id", item.recipe_id)
          .single();

        if (data && !error) {
          const shouldFocusComment =
            item.type === "update" || item.type === "star";
          navigation.navigate("RecipeDetailScreen", {
            item: data,
            autoFocusComment: shouldFocusComment,
          });
          return;
        }
      } catch (err) {
        console.log("Lỗi lấy bài viết:", err);
      }
    }
  };

  const renderIcon = (type: NotiType) => {
    let iconName: any = "notifications";
    let color = theme.primary_color;

    switch (type) {
      case "update":
        iconName = "chatbubble-ellipses";
        color = "#2196F3";
      case "warn":
        iconName = "warning";
        color = "#FF9800";
        break;
      case "star":
        iconName = "star";
        color = "#FFC107";
        break;
      default:
        iconName = "notifications";
        color = theme.primary_color;
    }

    return (
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: isDarkMode ? "#333" : "#fff" },
        ]}
      >
        <Ionicons name={iconName} size={20} color={color} />
      </View>
    );
  };

  const renderItem = (item: NotiItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.itemWrapper,
        {
          backgroundColor: item.is_read
            ? theme.background
            : isDarkMode
            ? "#3A3A3C"
            : "#E3F2FD",
          borderColor: theme.border,
        },
      ]}
      activeOpacity={0.7}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemRow}>
        <View style={styles.itemLeft}>
          {renderIcon(item.type)}
          <View style={styles.itemTextCol}>
            <AppText
              variant="bold"
              style={[styles.notiTitle, { color: theme.primary_text }]}
            >
              {item.title}
            </AppText>
            <AppText
              numberOfLines={2}
              style={[styles.notiMessage, { color: theme.placeholder_text }]}
            >
              {item.message}
            </AppText>
            <AppText
              style={[styles.notiTime, { color: theme.placeholder_text }]}
            >
              {item.timeLabel}
            </AppText>
          </View>
        </View>
        {!item.is_read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <AppSafeView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <AppHeader
          title={t("settings.notifications")}
          showBack={true}
          onBackPress={navigation.goBack}
          showNotifications={false}
        />

        {loading && !refreshing ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={theme.primary_color} />
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
                tintColor={theme.primary_color}
                colors={[theme.primary_color]} // Android
                progressBackgroundColor={theme.background_contrast}
              />
            }
          >
            {todayList.length > 0 && (
              <>
                <AppText
                  variant="bold"
                  style={[styles.sectionLabel, { color: theme.primary_text }]}
                >
                  {t("common.today")}
                </AppText>
                {todayList.map(renderItem)}
              </>
            )}
            {yesterdayList.length > 0 && (
              <>
                <AppText
                  variant="bold"
                  style={[styles.sectionLabel, { color: theme.primary_text }]}
                >
                  {t("common.yesterday")}
                </AppText>
                {yesterdayList.map(renderItem)}
              </>
            )}
            {otherDays.map((group) => (
              <View key={group.dateLabel} style={styles.dateGroup}>
                <AppText
                  variant="bold"
                  style={[styles.dateLabel, { color: theme.primary_text }]}
                >
                  {group.dateLabel}
                </AppText>
                {group.items.map(renderItem)}
              </View>
            ))}

            {todayList.length === 0 &&
              yesterdayList.length === 0 &&
              otherDays.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="notifications-off-outline"
                    size={64}
                    color={theme.placeholder_text}
                  />
                  <AppText
                    style={[
                      styles.emptyText,
                      { color: theme.placeholder_text },
                    ]}
                  >
                    {t("common.empty_notifications")}
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
            if (tab === "home") navigation.navigate("HomeScreen");
            if (tab === "profile") navigation.navigate("ProfileScreen");
          }}
        />
      </View>
    </AppSafeView>
  );
};
export default NotificationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },

  sectionLabel: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 15,
  },
  dateGroup: { marginTop: 16 },
  dateLabel: {
    marginBottom: 10,
    fontSize: 14,
  },

  itemWrapper: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  itemLeft: {
    flexDirection: "row",
    flex: 1,
    marginRight: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTextCol: {
    flex: 1,
    justifyContent: "center",
  },
  notiTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  notiMessage: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  notiTime: {
    fontSize: 11,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    marginTop: 6,
  },
});
