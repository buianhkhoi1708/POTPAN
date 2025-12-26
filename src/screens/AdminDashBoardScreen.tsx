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
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; // <-- IMPORT I18N

import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppHeader from "../components/AppHeader";
import { AppLightColor } from "../styles/color";

const { width } = Dimensions.get("window");
const PRIMARY_COLOR = AppLightColor.primary_color;

const AdminDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation(); // <-- KHỞI TẠO HOOK

  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "users">(
    "pending"
  );
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // --- HÀM TẢI DỮ LIỆU ---
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

  // --- HÀM GỬI THÔNG BÁO ---
  const sendNotification = async (
    userId: string,
    title: string,
    message: string,
    type: "update" | "warn"
  ) => {
    try {
      if (!userId) return;
      await supabase.from("notifications").insert({
        user_id: userId,
        title: title,
        message: message,
        type: type,
        is_read: false,
      });
      console.log("Đã gửi thông báo cho user:", userId);
    } catch (error) {
      console.log("Lỗi gửi thông báo:", error);
    }
  };

  // --- HÀM DUYỆT BÀI ---
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

      // 👇 GỬI THÔNG BÁO (Sử dụng t() để dịch nội dung)
      const notiTitle = t("admin.notifications.approve_title");
      const notiMsg = t("admin.notifications.approve_msg", {
        title: item.title,
      }); // Truyền biến title vào chuỗi dịch

      await sendNotification(item.user_id, notiTitle, notiMsg, "update");

      Alert.alert(t("common.success"), t("admin.alerts.approve_success"));
      setDataList((prev) => prev.filter((i) => i.id !== item.id));
    } catch (error: any) {
      console.log(error);
      Alert.alert(t("common.error"), t("common.error_occurred"));
    }
  };

  // --- HÀM XÓA ---
  const handleDelete = (item: any) => {
    const confirmMsg =
      activeTab === "users"
        ? t("admin.alerts.confirm_delete_user")
        : t("admin.alerts.confirm_delete_post");

    Alert.alert(t("common.confirm"), confirmMsg, [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          const table = activeTab === "users" ? "users" : "recipes";
          const { error } = await supabase
            .from(table)
            .delete()
            .eq("id", item.id);

          if (!error) {
            setDataList((prev) => prev.filter((i) => i.id !== item.id));

            // 👇 GỬI THÔNG BÁO XÓA (Trừ khi xóa user)
            if (activeTab !== "users") {
              const notiTitle = t("admin.notifications.reject_title");
              const notiMsg = t("admin.notifications.reject_msg", {
                title: item.title,
              });

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
    // 1. GIAO DIỆN USER
    if (activeTab === "users") {
      return (
        <View style={styles.card}>
          <Image
            source={{ uri: item.avatar_url || "https://i.pravatar.cc/150" }}
            style={styles.avatar}
          />
          <View style={styles.content}>
            <AppText variant="bold">
              {item.full_name || t("admin.no_name")}
            </AppText>
            <AppText style={styles.subText}>{item.email}</AppText>
            <AppText
              style={[
                styles.subText,
                { color: item.role === "admin" ? PRIMARY_COLOR : "#666" },
              ]}
            >
              {t("admin.role")}: {item.role || "user"}
            </AppText>
          </View>
          <Pressable
            style={[styles.btnAction, { backgroundColor: "#333" }]}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="ban-outline" size={18} color="#fff" />
          </Pressable>
        </View>
      );
    }

    // 2. GIAO DIỆN BÀI VIẾT
    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <Image
            source={{ uri: item.image || item.thumbnail }}
            style={styles.postImage}
          />
        </Pressable>

        <View style={styles.content}>
          <AppText variant="bold" numberOfLines={1} style={{ fontSize: 16 }}>
            {item.title}
          </AppText>
          <AppText style={styles.subText}>
            {t("admin.by")}: {item.users?.full_name || t("admin.anonymous")}
          </AppText>
          <AppText style={styles.dateText}>
            {new Date(item.created_at).toLocaleDateString()}
          </AppText>

          <View style={styles.btnRow}>
            {/* Nút Xóa */}
            <Pressable
              style={styles.btnDelete}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <AppText style={styles.btnText}>
                {t("admin.actions.delete")}
              </AppText>
            </Pressable>

            {/* Nút Duyệt */}
            {activeTab === "pending" && (
              <Pressable
                style={styles.btnApprove}
                onPress={() => handleApprove(item)}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="#fff"
                />
                <AppText style={styles.btnText}>
                  {t("admin.actions.approve")}
                </AppText>
              </Pressable>
            )}

            {/* Nhãn Đã duyệt */}
            {activeTab === "approved" && (
              <View style={styles.badgeApproved}>
                <Ionicons name="checkmark-done" size={14} color="green" />
                <AppText
                  style={{
                    color: "green",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginLeft: 4,
                  }}
                >
                  {t("admin.tabs.approved")}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <AppSafeView style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader
        title={t("admin.dashboard")}
        showBack
        onBackPress={() => navigation.goBack()}
        showSearch={false}
      />

      {/* TABS */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <AppText
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeText,
            ]}
          >
            {t("admin.tabs.pending")}
          </AppText>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "approved" && styles.activeTab]}
          onPress={() => setActiveTab("approved")}
        >
          <AppText
            style={[
              styles.tabText,
              activeTab === "approved" && styles.activeText,
            ]}
          >
            {t("admin.tabs.approved")}
          </AppText>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <AppText
            style={[styles.tabText, activeTab === "users" && styles.activeText]}
          >
            {t("admin.tabs.users")}
          </AppText>
        </Pressable>
      </View>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={PRIMARY_COLOR}
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={dataList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Ionicons name="folder-open-outline" size={48} color="#ddd" />
              <AppText
                style={{ textAlign: "center", marginTop: 10, color: "#999" }}
              >
                {t("common.empty_list")}
              </AppText>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={PRIMARY_COLOR}
            />
          }
        />
      )}
    </AppSafeView>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#eee" },
  tab: { flex: 1, alignItems: "center", paddingVertical: 14 },
  activeTab: { borderBottomWidth: 2, borderColor: PRIMARY_COLOR },
  tabText: { color: "#999", fontWeight: "600", fontSize: 15 },
  activeText: { color: PRIMARY_COLOR },

  card: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 2,
  },
  postImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#eee" },

  content: { flex: 1, marginLeft: 12, justifyContent: "center" },
  subText: { fontSize: 13, color: "#666", marginTop: 2 },
  dateText: { fontSize: 11, color: "#999", marginTop: 4 },

  btnRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
    alignItems: "center",
  },
  btnApprove: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnDelete: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnText: { color: "#fff", fontSize: 12, fontWeight: "bold", marginLeft: 4 },

  btnAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  badgeApproved: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});