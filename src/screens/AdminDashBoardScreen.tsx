// Nhóm 9 - IE307.Q12
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppHeader from "../components/AppHeader";
import { useThemeStore } from "../store/useThemeStore";
import AppAdminUserItem from "../components/AppAdminUserItem";
import AppAdminRecipeItem from "../components/AppAdminRecipeItem";

const AdminDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "users">("pending");
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    try {
      let data, error;
      if (activeTab === "users") {
        const res = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });
        data = res.data;
        error = res.error;
      } else {
        const res = await supabase
          .from("recipes")
          .select("*, users(full_name, email)")
          .eq("status", activeTab)
          .order("created_at", { ascending: false });
        data = res.data;
        error = res.error;
      }
      if (error) throw error;
      setDataList(data || []);
    } catch (err) {
      console.log("Admin Fetch Error:", err);
      Alert.alert(t("common.error"), t("admin.alerts.fetch_error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [activeTab])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const sendNotification = async (userId: string, title: string, message: string, type: "update" | "warn") => {
  try {
    if (!userId) return;

    await supabase.from("notifications").insert({
      user_id: userId,
      title: title,
      message: message,
      type: type,
      is_read: false,
    });

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("expo_push_token")
      .eq("id", userId)
      .single();

    if (userError || !userData?.expo_push_token) {
      console.log("User không có token hoặc lỗi lấy token");
      return; 
    }
    const messagePayload = {
      to: userData.expo_push_token,
      sound: 'default',
      title: title,
      body: message,
      data: { someData: 'goes here' }, 
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messagePayload),
    });

    console.log("Đã gửi Push Notification thành công!");

  } catch (error) {
    console.log("Lỗi quy trình thông báo:", error);
  }
};

  const handleApprove = async (item: any) => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .update({ status: "approved" })
        .eq("id", item.id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) {
        Alert.alert("Lỗi RLS", t("admin.alerts.rls_error"));
        return;
      }

      const notiTitle = t("admin.notifications.approve_title");
      const notiMsg = t("admin.notifications.approve_msg", { title: item.title });
      await sendNotification(item.user_id, notiTitle, notiMsg, "update");

      Alert.alert(t("common.success"), t("admin.alerts.approve_success"));
      setDataList((prev) => prev.filter((i) => i.id !== item.id));
    } catch (error: any) {
      console.log(error);
      Alert.alert(t("common.error"), t("common.error_occurred"));
    }
  };

  const handleDelete = (item: any) => {
    const confirmMsg = activeTab === "users"
        ? t("admin.alerts.confirm_delete_user")
        : t("admin.alerts.confirm_delete_post");
    Alert.alert(t("common.confirm"), confirmMsg, [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          const table = activeTab === "users" ? "users" : "recipes";
          const { error } = await supabase.from(table).delete().eq("id", item.id);
          if (!error) {
            setDataList((prev) => prev.filter((i) => i.id !== item.id));
            if (activeTab !== "users") {
              const notiTitle = t("admin.notifications.reject_title");
              const notiMsg = t("admin.notifications.reject_msg", { title: item.title });
              await sendNotification(item.user_id, notiTitle, notiMsg, "warn");
            }
            Alert.alert(t("common.success"), t("admin.alerts.delete_success"));
          } else {
            Alert.alert(t("common.error"), t("admin.alerts.delete_error"));
          }
        },
      },
    ]);
  };


  const renderItem = ({ item }: { item: any }) => {
    if (activeTab === "users") {
      return (
        <AppAdminUserItem 
          item={item} 
          onDelete={handleDelete} 
        />
      );
    }
    
    return (
      <AppAdminRecipeItem
        item={item}
        activeTab={activeTab}
        onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
        onDelete={handleDelete}
        onApprove={handleApprove}
      />
    );
  };

  return (
    <AppSafeView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader
        title={t("admin.dashboard")}
        showBack
        onBackPress={() => navigation.goBack()}
        showSearch={false}
      />

      <View style={[styles.tabContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <View style={[styles.tabWrapper, { backgroundColor: theme.background_contrast }]}>
          {(["pending", "approved", "users"] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tabItem,
                activeTab === tab && [styles.tabItemActive, { backgroundColor: isDarkMode ? "#333" : "#fff" }],
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <AppText
                style={[
                  styles.tabText,
                  { color: theme.placeholder_text },
                  activeTab === tab && [styles.tabTextActive, { color: theme.primary_color }],
                ]}
              >
                {t(`admin.tabs.${tab}`)}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary_color} />
        </View>
      ) : (
        <FlatList
          data={dataList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/7486/7486754.png" }}
                style={{
                  width: 100,
                  height: 100,
                  opacity: isDarkMode ? 0.3 : 0.5,
                  marginBottom: 16,
                }}
              />
              <AppText style={[styles.emptyText, { color: theme.placeholder_text }]}>
                {t("common.empty_list")}
              </AppText>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary_color} />
          }
        />
      )}
    </AppSafeView>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  tabContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 1,
  },
  tabWrapper: { 
    flexDirection: "row", 
    borderRadius: 25, 
    padding: 4 
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 22,
  },
  tabItemActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: { 
    fontWeight: "600", 
    fontSize: 13 
  },
  tabTextActive: { 
    fontWeight: "bold" 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  listContent: { 
    padding: 16, 
    paddingBottom: 80 
  },
  emptyState: { 
    alignItems: "center", 
    marginTop: 60 
  },
  emptyText: { 
    fontSize: 16, 
    fontWeight: "500" 
  },
});