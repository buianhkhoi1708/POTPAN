import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; // 1. Hook dịch

import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppHeader from "../components/AppHeader"; // 2. Header chung
import { useAuthStore } from "../store/useAuthStore";
import { AppLightColor } from "../styles/color";

type UserItem = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
};

const FollowScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user: currentUser } = useAuthStore();

  const targetUserId = route.params?.userId || currentUser?.id;
  const initialTab = route.params?.type || "followers";

  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    initialTab
  );
  const [dataList, setDataList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    if (!targetUserId) return;
    setLoading(true);
    try {
      let query;
      if (activeTab === "followers") {
        const { data, error } = await supabase
          .from("follows")
          .select(
            `follower_id, users:follower_id (id, full_name, username, avatar_url)`
          )
          .eq("following_id", targetUserId);
        if (error) throw error;
        setDataList(data.map((item: any) => item.users));
      } else {
        const { data, error } = await supabase
          .from("follows")
          .select(
            `following_id, users:following_id (id, full_name, username, avatar_url)`
          )
          .eq("follower_id", targetUserId);
        if (error) throw error;
        setDataList(data.map((item: any) => item.users));
      }
    } catch (err) {
      console.log("Lỗi fetch follow:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, targetUserId]);

  const handleUnfollow = async (userIdToUnfollow: string) => {
    Alert.alert(t("follow.unfollow_title"), t("follow.unfollow_msg"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("follow.yes"),
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("follows")
            .delete()
            .eq("follower_id", currentUser?.id)
            .eq("following_id", userIdToUnfollow);
          if (!error)
            setDataList((prev) =>
              prev.filter((u) => u.id !== userIdToUnfollow)
            );
        },
      },
    ]);
  };

  const handleRemoveFollower = async (userIdToRemove: string) => {
    Alert.alert(
      t("follow.remove_follower_title"),
      t("follow.remove_follower_msg"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("follow.remove"),
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("follows")
              .delete()
              .eq("follower_id", userIdToRemove)
              .eq("following_id", currentUser?.id);
            if (!error)
              setDataList((prev) =>
                prev.filter((u) => u.id !== userIdToRemove)
              );
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: UserItem }) => {
    const isMe = currentUser?.id === targetUserId;
    return (
      <TouchableOpacity
        style={styles.userRow}
        onPress={() =>
          navigation.push("ChefProfileScreen", { chefId: item.id })
        }
      >
        <Image
          source={{ uri: item.avatar_url || "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <AppText variant="bold" style={styles.userName}>
            {item.full_name}
          </AppText>
          <AppText style={styles.userHandle}>
            @{item.username || "user"}
          </AppText>
        </View>
        
        {/* Nút hành động chỉ hiện khi xem danh sách của chính mình */}
        {isMe && (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              activeTab === "following" ? styles.btnOutline : styles.btnGray,
            ]}
            onPress={() =>
              activeTab === "following"
                ? handleUnfollow(item.id)
                : handleRemoveFollower(item.id)
            }
          >
            <AppText
              style={[
                styles.actionBtnText,
                activeTab === "following"
                  ? { color: AppLightColor.primary_color }
                  : { color: "#333" },
              ]}
            >
              {activeTab === "following"
                ? t("chef.following") 
                : t("follow.remove")}  
            </AppText>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const filteredList = dataList.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <AppSafeView style={styles.container}>
      {/* HEADER CHUNG */}
      <AppHeader
        title={
          currentUser?.id === targetUserId
            ? t("follow.my_list")
            : t("follow.user_list")
        }
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showSearch={false}
      />

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "followers" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("followers")}
        >
          <AppText
            variant="bold"
            style={
              activeTab === "followers"
                ? styles.activeText
                : styles.inactiveText
            }
          >
            {t("follow.followers")}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "following" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("following")}
        >
          <AppText
            variant="bold"
            style={
              activeTab === "following"
                ? styles.activeText
                : styles.inactiveText
            }
          >
            {t("chef.following")}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder={t("search.placeholder")}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={AppLightColor.primary_color} />
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <AppText style={{ color: "#999" }}>
                {t("common.empty_list")}
              </AppText>
            </View>
          }
        />
      )}
    </AppSafeView>
  );
};

export default FollowScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: AppLightColor.primary_color,
  },
  activeText: { color: AppLightColor.primary_color, fontSize: 16 },
  inactiveText: { color: "#999", fontSize: 16 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 16 },
  listContent: { paddingBottom: 20 },
  loadingBox: { marginTop: 40 },
  emptyBox: { alignItems: "center", marginTop: 40 },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#eee" },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 16, color: "#333" },
  userHandle: { fontSize: 14, color: "#666" },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  btnGray: { backgroundColor: "#f0f0f0" },
  btnOutline: { borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" },
  actionBtnText: { fontSize: 14, fontWeight: "600" },
});