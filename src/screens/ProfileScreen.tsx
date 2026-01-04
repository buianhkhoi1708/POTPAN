import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  Alert,
  Share,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// --- STORES & COMPONENTS ---
import { useAuthStore } from "../store/useAuthStore";
import { useRecipeStore } from "../store/useRecipeStore";
import { useCollectionStore } from "../store/useCollectionStore";
import { supabase } from "../config/supabaseClient";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar, { MainTabKey } from "../components/AppMainNavBar";
import AppRecipeCard from "../components/AppRecipeCard";
import AppCollectionModal from "../components/AppCollectionModal";

// 👇 1. Import Theme Store
import { useThemeStore } from "../store/useThemeStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, profile, fetchUserProfile } = useAuthStore();
  const { t } = useTranslation();

  // 👇 2. Lấy Theme
  const { theme, isDarkMode } = useThemeStore();

  const {
    myRecipes,
    fetchMyRecipes,
    isLoading: recipeLoading,
  } = useRecipeStore();
  
  const {
    myCollections,
    fetchMyCollections,
    isLoading: collectionLoading,
    deleteCollection,
  } = useCollectionStore();

  const [activeTab, setActiveTab] = useState<"recipes" | "favorites">("recipes");
  const [activeNavTab, setActiveNavTab] = useState<MainTabKey>("profile");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // --- LẤY DỮ LIỆU ---
  const fetchSocialCounts = async () => {
    if (!user) return;
    try {
      const [followersRes, followingRes] = await Promise.all([
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", user.id),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", user.id),
      ]);
      if (followersRes.count !== null) setFollowerCount(followersRes.count);
      if (followingRes.count !== null) setFollowingCount(followingRes.count);
    } catch (error) { console.log("Lỗi tải follow:", error); }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
      if (user) {
        fetchMyRecipes(user.id);
        fetchMyCollections(user.id);
        fetchSocialCounts();
      }
      setActiveNavTab("profile");
    }, [user])
  );

  // --- XỬ LÝ SỰ KIỆN ---
  const handleShareProfile = async () => {
    try {
      const profileUrl = `https://potpan.app/u/${profile?.username || user?.id}`;
      const message = `👨‍🍳 ${t("profile.share_msg")} ${profile?.full_name}: ${profileUrl}`;
      await Share.share({ message, title: t("profile.share_title") });
    } catch (error) { Alert.alert(t("common.error"), "Không thể chia sẻ hồ sơ"); }
  };

  const handleDeleteCollection = (collectionId: number, collectionName: string) => {
    Alert.alert(
      t("profile.delete_collection_title"),
      t("profile.delete_collection_msg", { name: collectionName }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCollection(collectionId);
              Alert.alert(t("common.success"), t("profile.delete_collection_success"));
            } catch (error) { Alert.alert(t("common.error"), t("profile.delete_collection_error")); }
          },
        },
      ]
    );
  };

  const onCreateCollectionSuccess = () => { if (user) fetchMyCollections(user.id); };

  // --- RENDER HEADER ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.profileRow}>
        <View style={[styles.avatarWrapper, { borderColor: theme.primary_color }]}>
          <Image
            source={{ uri: profile?.avatar_url || "https://vfqnjeoqxxapqqurdkoi.supabase.co/storage/v1/object/public/avatars/users/default.jpg" }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.infoCol}>
          <AppText variant="bold" style={[styles.nameText, { color: theme.primary_text }]}>
            {profile?.full_name || t("profile.new_user")}
          </AppText>
          <AppText variant="medium" style={[styles.handleText, { color: theme.primary_color }]}>
            {profile?.username ? `@${profile.username}` : t("profile.no_username")}
          </AppText>
          <AppText style={[styles.bioText, { color: theme.primary_text }]} numberOfLines={2}>
            {profile?.bio || t("profile.no_bio")}
          </AppText>
        </View>

        <View style={styles.topRightIcons}>
          <Pressable
            style={[styles.smallIconCircle, { backgroundColor: theme.background_contrast }]}
            onPress={() => navigation.navigate("CreateRecipeScreen")}
          >
            <Ionicons name="add" size={20} color={theme.primary_color} />
          </Pressable>
          {profile?.role === "admin" && (
            <Pressable
              style={[styles.smallIconCircle, { marginLeft: 8, backgroundColor: theme.background_contrast }]}
              onPress={() => navigation.navigate("AdminDashboardScreen")}
            >
              <Ionicons name="shield-checkmark" size={18} color={theme.primary_text} />
            </Pressable>
          )}
          <Pressable
            style={[styles.smallIconCircle, { marginLeft: 8, backgroundColor: theme.background_contrast }]}
            onPress={() => navigation.navigate("SettingsScreen")}
          >
            <Ionicons name="settings-outline" size={20} color={theme.primary_color} />
          </Pressable>
        </View>
      </View>

      <View style={styles.actionButtonsRow}>
        <Pressable
          style={[styles.editButton, { backgroundColor: theme.primary_color }]}
          onPress={() => navigation.navigate("EditProfileScreen")}
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <AppText variant="bold" style={styles.editButtonText}>
            {t("profile.edit_profile")}
          </AppText>
        </Pressable>
        <Pressable 
            style={[
                styles.shareButton, 
                { backgroundColor: theme.background, borderColor: theme.primary_color }
            ]} 
            onPress={handleShareProfile}
        >
          <Ionicons name="share-social-outline" size={16} color={theme.primary_color} />
          <AppText variant="bold" style={[styles.shareButtonText, { color: theme.primary_color }]}>
            {t("profile.share_profile")}
          </AppText>
        </Pressable>
      </View>

      <View style={[
          styles.statsContainer, 
          { backgroundColor: theme.background_contrast, borderColor: theme.border }
      ]}>
        <View style={styles.statItem}>
          <AppText variant="bold" style={[styles.statNumber, { color: theme.primary_text }]}>
            {myRecipes.length}
          </AppText>
          <AppText style={[styles.statLabel, { color: theme.placeholder_text }]}>
            {t("profile.recipes_saved")}
          </AppText>
        </View>
        <View style={[styles.verticalDivider, { backgroundColor: theme.border }]} />
        <Pressable
          style={styles.statItem}
          onPress={() => navigation.navigate("FollowScreen", { type: "following", userId: user?.id })}
        >
          <AppText variant="bold" style={[styles.statNumber, { color: theme.primary_text }]}>
            {followingCount}
          </AppText>
          <AppText style={[styles.statLabel, { color: theme.placeholder_text }]}>{t("profile.following")}</AppText>
        </Pressable>
        <View style={[styles.verticalDivider, { backgroundColor: theme.border }]} />
        <Pressable
          style={styles.statItem}
          onPress={() => navigation.navigate("FollowScreen", { type: "followers", userId: user?.id })}
        >
          <AppText variant="bold" style={[styles.statNumber, { color: theme.primary_text }]}>
            {followerCount}
          </AppText>
          <AppText style={[styles.statLabel, { color: theme.placeholder_text }]}>{t("profile.followers")}</AppText>
        </Pressable>
      </View>

      <View style={[styles.tabContainer, { borderBottomColor: theme.border }]}>
        <Pressable
          style={[
            styles.tabItem,
            activeTab === "recipes" && { borderBottomWidth: 2, borderBottomColor: theme.primary_color },
          ]}
          onPress={() => setActiveTab("recipes")}
        >
          <AppText
            variant="bold"
            style={[
              styles.tabText,
              { color: activeTab === "recipes" ? theme.primary_color : theme.placeholder_text }
            ]}
          >
            {t("profile.my_recipes")}
          </AppText>
        </Pressable>
        <Pressable
          style={[
            styles.tabItem,
            activeTab === "favorites" && { borderBottomWidth: 2, borderBottomColor: theme.primary_color },
          ]}
          onPress={() => setActiveTab("favorites")}
        >
          <AppText
            variant="bold"
            style={[
              styles.tabText,
              { color: activeTab === "favorites" ? theme.primary_color : theme.placeholder_text }
            ]}
          >
            {t("profile.my_collections")}
          </AppText>
        </Pressable>
      </View>
    </View>
  );

  const renderRecipeItem = ({ item }: { item: any }) => (
    <View style={{ width: CARD_WIDTH, marginBottom: 16 }}>
      <AppRecipeCard
        item={item}
        variant="small"
        onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
        style={{ width: "100%" }}
      />
      {item.status === "pending" && (
        <View style={styles.pendingBadge}>
          <Ionicons name="time-outline" size={12} color="#fff" style={{ marginRight: 4 }} />
          <AppText style={styles.pendingText}>{t("profile.pending")}</AppText>
        </View>
      )}
    </View>
  );

  const renderCollectionItem = ({ item }: { item: any }) => (
    <Pressable
      style={[
          styles.collectionCard, 
          { backgroundColor: theme.background_contrast, borderColor: theme.border }
      ]}
      onPress={() => navigation.navigate("CollectionDetailScreen", { collectionId: item.id, collectionName: item.name })}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" }}
          style={[styles.collectionImage, isDarkMode && { opacity: 0.85 }]}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
        <View style={[styles.iconBadge, { backgroundColor: theme.background }]}>
          <Ionicons name="folder-open" size={20} color={theme.primary_color} />
        </View>
        <Pressable
          style={[styles.deleteBtn, { backgroundColor: theme.background }]}
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteCollection(item.id, item.name);
          }}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
        </Pressable>
      </View>
      <View style={styles.collectionBody}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <AppText variant="bold" style={[styles.collectionName, { color: theme.primary_text }]} numberOfLines={1}>
            {item.name}
          </AppText>
          <AppText style={[styles.collectionSub, { color: theme.placeholder_text }]}>
            {t("profile.view_detail")}
          </AppText>
        </View>
        <Ionicons name="chevron-forward-circle" size={32} color={theme.primary_color} />
      </View>
    </Pressable>
  );

  return (
    // 👇 3. Background động
    <AppSafeView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppCollectionModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        recipeId={0}
        onSaved={onCreateCollectionSuccess}
      />

      <FlatList
        data={activeTab === "recipes" ? myRecipes : myCollections}
        renderItem={activeTab === "recipes" ? renderRecipeItem : renderCollectionItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={activeTab === "recipes" ? 2 : 1}
        key={activeTab} // Force re-render khi đổi tab để đổi số cột
        columnWrapperStyle={activeTab === "recipes" ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        refreshing={activeTab === "recipes" ? recipeLoading : collectionLoading}
        onRefresh={() => {
          if (user) {
            if (activeTab === "recipes") fetchMyRecipes(user.id);
            else fetchMyCollections(user.id);
          }
        }}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {activeTab === "favorites" && (
              <Pressable
                style={[styles.createCollectionBtn, { backgroundColor: theme.primary_color }]}
                onPress={() => setCreateModalVisible(true)}
              >
                <Ionicons name="add-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
                <AppText variant="bold" style={{ color: "#fff" }}>
                  {t("profile.create_collect")}
                </AppText>
              </Pressable>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Ionicons
              name={activeTab === "recipes" ? "fast-food-outline" : "heart-dislike-outline"}
              size={48}
              color={theme.border}
            />
            <AppText style={{ color: theme.placeholder_text, marginTop: 12 }}>
              {activeTab === "recipes" ? t("profile.no_recipes") : t("profile.no_collections")}
            </AppText>
          </View>
        }
      />

      <View style={styles.navBarWrapper}>
        <AppMainNavBar
          activeTab={activeNavTab}
          onTabPress={(tab) => {
            setActiveNavTab(tab);
            if (tab === "home") navigation.navigate("HomeScreen");
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerContainer: { paddingHorizontal: 16, paddingTop: 10 },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  avatarWrapper: {
    borderWidth: 2,
    borderRadius: 50,
    padding: 2,
  },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  infoCol: { flex: 1, marginLeft: 16 },
  nameText: { fontSize: 20, marginBottom: 4 },
  handleText: { fontSize: 14, marginBottom: 6 },
  bioText: { fontSize: 13, lineHeight: 18 },
  topRightIcons: {
    flexDirection: "row",
    position: "absolute",
    top: 0,
    right: 0,
  },
  smallIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  editButtonText: { color: "#fff", fontSize: 14 },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  shareButtonText: { fontSize: 14 },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 16 },
  statLabel: { fontSize: 12, marginTop: 2 },
  verticalDivider: { width: 1, height: "60%" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  tabItem: { paddingBottom: 12, flex: 1, alignItems: "center" },
  tabText: { fontSize: 16 },
  listContent: { paddingBottom: 100 },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  collectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    // Shadow cho Light mode
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
  },
  imageWrapper: { height: 140, width: "100%", position: "relative" },
  collectionImage: { width: "100%", height: "100%" },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  iconBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    padding: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  collectionBody: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  collectionName: { fontSize: 18, marginBottom: 4 },
  collectionSub: { fontSize: 13 },
  createCollectionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  navBarWrapper: { position: "absolute", bottom: 0, left: 0, right: 0 },
  pendingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF9800",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  pendingText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
});