// Nhóm 9 - IE307.Q12
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
import { useTranslation } from "react-i18next";
import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppHeader from "../components/AppHeader";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

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
  const { theme, isDarkMode } = useThemeStore();
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
          style={[styles.avatar, { borderColor: theme.border, borderWidth: 1 }]}
        />
        <View style={styles.userInfo}>
          <AppText
            variant="bold"
            style={[styles.userName, { color: theme.primary_text }]}
          >
            {item.full_name}
          </AppText>
          <AppText
            style={[styles.userHandle, { color: theme.placeholder_text }]}
          >
            @{item.username || "user"}
          </AppText>
        </View>

        {isMe && (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              activeTab === "following"
                ? [
                    styles.btnOutline,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                    },
                  ]
                : [{ backgroundColor: theme.background_contrast }],
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
                  ? { color: theme.primary_color }
                  : { color: theme.primary_text },
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
    <AppSafeView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
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

      <View style={[styles.tabs, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "followers" && {
              borderBottomWidth: 2,
              borderBottomColor: theme.primary_color,
            },
          ]}
          onPress={() => setActiveTab("followers")}
        >
          <AppText
            variant="bold"
            style={
              activeTab === "followers"
                ? { color: theme.primary_color, fontSize: 16 }
                : { color: theme.placeholder_text, fontSize: 16 }
            }
          >
            {t("follow.followers")}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "following" && {
              borderBottomWidth: 2,
              borderBottomColor: theme.primary_color,
            },
          ]}
          onPress={() => setActiveTab("following")}
        >
          <AppText
            variant="bold"
            style={
              activeTab === "following"
                ? { color: theme.primary_color, fontSize: 16 }
                : { color: theme.placeholder_text, fontSize: 16 }
            }
          >
            {t("chef.following")}
          </AppText>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.background_contrast },
        ]}
      >
        <Ionicons name="search" size={20} color={theme.placeholder_text} />
        <TextInput
          style={[styles.searchInput, { color: theme.primary_text }]}
          placeholder={t("search.placeholderfol")}
          placeholderTextColor={theme.placeholder_text}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={theme.primary_color} />
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <AppText style={{ color: theme.placeholder_text }}>
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
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingBox: {
    marginTop: 40,
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 40,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
  },
  userHandle: {
    fontSize: 14,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  btnOutline: {
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
