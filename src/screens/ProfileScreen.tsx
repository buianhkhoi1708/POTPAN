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

// --- COMPONENTS & STORE ---
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../config/supabaseClient";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppMainNavBar, { MainTabKey } from "../components/AppMainNavBar";
import { AppLightColor } from "../styles/color";
import AppRecipeCard from "../components/AppRecipeCard";
import AppCollectionModal from "../components/AppCollectionModal";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;
const PRIMARY_COLOR = AppLightColor.primary_color;

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, profile, fetchUserProfile } = useAuthStore();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"recipes" | "favorites">("recipes");
  const [activeNavTab, setActiveNavTab] = useState<MainTabKey>("profile");
  const [loading, setLoading] = useState(false);

  const [myRecipes, setMyRecipes] = useState<any[]>([]);
  const [myCollections, setMyCollections] = useState<any[]>([]); 
  
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [createModalVisible, setCreateModalVisible] = useState(false);

  // --- 1. LẤY DỮ LIỆU ---
  const fetchProfileData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [recipesRes, followersRes, followingRes, collectionsRes] = await Promise.all([
        supabase
          .from("recipes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", user.id),
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", user.id),
        supabase
          .from("collections")
          .select("*") 
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (recipesRes.data) setMyRecipes(recipesRes.data);
      if (followersRes.count !== null) setFollowerCount(followersRes.count);
      if (followingRes.count !== null) setFollowingCount(followingRes.count);
      if (collectionsRes.data) setMyCollections(collectionsRes.data);
    } catch (error) {
      console.log("Lỗi tải profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
      fetchProfileData();
      setActiveNavTab("profile");
    }, [user])
  );

  // --- 2. HÀM CHIA SẺ ---
  const handleShareProfile = async () => {
    try {
      const profileUrl = `https://potpan.app/u/${profile?.username || user?.id}`;
      const message = `👨‍🍳 ${t("profile.share_msg")} ${profile?.full_name}: ${profileUrl}`;

      await Share.share({
        message: message,
        title: t("profile.share_title"),
      });
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chia sẻ hồ sơ");
    }
  };

  // --- 3. XÓA BỘ SƯU TẬP ---
  const handleDeleteCollection = (collectionId: number, collectionName: string) => {
    Alert.alert(
      "Xóa bộ sưu tập",
      `Bạn có chắc chắn muốn xóa "${collectionName}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.from("collections").delete().eq("id", collectionId);
              if (error) throw error;
              setMyCollections((prev) => prev.filter(c => c.id !== collectionId));
              Alert.alert("Thành công", "Đã xóa bộ sưu tập.");
            } catch (error) {
              console.log(error);
              Alert.alert("Lỗi", "Không thể xóa bộ sưu tập.");
            }
          }
        }
      ]
    );
  };

  const onCreateSuccess = () => {
    fetchProfileData();
  };

  // --- 4. HEADER ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: profile?.avatar_url || "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.infoCol}>
          <AppText variant="bold" style={styles.nameText}>
            {profile?.full_name || t("profile.new_user")}
          </AppText>
          <AppText variant="medium" style={styles.handleText}>
            {profile?.username ? `@${profile.username}` : t("profile.no_username")}
          </AppText>
          <AppText style={styles.bioText} numberOfLines={2}>
            {profile?.bio || t("profile.no_bio")}
          </AppText>
        </View>

        {/* TOP RIGHT ICONS */}
        <View style={styles.topRightIcons}>
          <Pressable style={styles.smallIconCircle} onPress={() => navigation.navigate('CreateRecipeScreen')}>
            <Ionicons name="add" size={20} color={PRIMARY_COLOR} />
          </Pressable>

          {/* NÚT ADMIN: Chỉ hiện với role admin */}
          {profile?.role === 'admin' && (
            <Pressable
              style={[styles.smallIconCircle, { marginLeft: 8, backgroundColor: '#333' }]}
              onPress={() => navigation.navigate("AdminDashboardScreen")}
            >
              <Ionicons name="shield-checkmark" size={18} color="#fff" />
            </Pressable>
          )}

          <Pressable
            style={[styles.smallIconCircle, { marginLeft: 8 }]}
            onPress={() => navigation.navigate("SettingsScreen")}
          >
            <Ionicons name="settings-outline" size={20} color={PRIMARY_COLOR} />
          </Pressable>
        </View>
      </View>

      {/* ACTION BUTTONS (EDIT & SHARE) */}
      <View style={styles.actionButtonsRow}>
        <Pressable
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfileScreen")}
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <AppText variant="bold" style={styles.editButtonText}>
            {t("profile.edit_profile")}
          </AppText>
        </Pressable>

        <Pressable
          style={styles.shareButton}
          onPress={handleShareProfile}
        >
          <Ionicons name="share-social-outline" size={16} color={PRIMARY_COLOR} />
          <AppText variant="bold" style={styles.shareButtonText}>
            {t("profile.share_profile")}
          </AppText>
        </Pressable>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <AppText variant="bold" style={styles.statNumber}>
            {myRecipes.length} 
          </AppText>
          <AppText style={styles.statLabel}>{t("profile.recipes_saved")}</AppText>
        </View>
        <View style={styles.verticalDivider} />

        <Pressable
          style={styles.statItem}
          onPress={() => navigation.navigate("FollowScreen", { type: "following", userId: user?.id })}
        >
          <AppText variant="bold" style={styles.statNumber}>
            {followingCount}
          </AppText>
          <AppText style={styles.statLabel}>{t("profile.following")}</AppText>
        </Pressable>
        <View style={styles.verticalDivider} />

        <Pressable
          style={styles.statItem}
          onPress={() => navigation.navigate("FollowScreen", { type: "followers", userId: user?.id })}
        >
          <AppText variant="bold" style={styles.statNumber}>
            {followerCount}
          </AppText>
          <AppText style={styles.statLabel}>{t("profile.followers")}</AppText>
        </Pressable>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tabItem, activeTab === "recipes" && styles.tabItemActive]}
          onPress={() => setActiveTab("recipes")}
        >
          <AppText variant="bold" style={[styles.tabText, activeTab === "recipes" ? styles.tabTextActive : styles.tabTextInactive]}>
            {t("profile.my_recipes")}
          </AppText>
        </Pressable>

        <Pressable
          style={[styles.tabItem, activeTab === "favorites" && styles.tabItemActive]}
          onPress={() => setActiveTab("favorites")}
        >
          <AppText variant="bold" style={[styles.tabText, activeTab === "favorites" ? styles.tabTextActive : styles.tabTextInactive]}>
            {t("profile.my_collections")}
          </AppText>
        </Pressable>
      </View>
    </View>
  );

  // --- 5. RENDER ITEMS (Updated with Pending Badge) ---
  const renderRecipeItem = ({ item }: { item: any }) => (
    <View style={{ width: CARD_WIDTH, marginBottom: 16 }}>
      <AppRecipeCard
        item={item}
        variant="small"
        onPress={() => navigation.navigate("RecipeDetailScreen", { item })}
        style={{ width: '100%' }}
      />
      {/* NHÃN CHỜ DUYỆT */}
      {item.status === 'pending' && (
        <View style={styles.pendingBadge}>
          <Ionicons name="time-outline" size={12} color="#fff" style={{marginRight: 4}}/>
          <AppText style={styles.pendingText}>Chờ duyệt</AppText>
        </View>
      )}
    </View>
  );

  const renderCollectionItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.collectionCard}
      onPress={() => navigation.navigate("CollectionDetailScreen", { collectionId: item.id, collectionName: item.name })}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" }}
          style={styles.collectionImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
        <View style={styles.iconBadge}>
            <Ionicons name="folder-open" size={20} color={PRIMARY_COLOR} />
        </View>
        <Pressable 
          style={styles.deleteBtn} 
          onPress={(e) => { e.stopPropagation(); handleDeleteCollection(item.id, item.name); }}
        >
           <Ionicons name="trash-outline" size={18} color="#FF3B30" />
        </Pressable>
      </View>

      <View style={styles.collectionBody}>
        <View style={{flex: 1, paddingRight: 8}}>
          <AppText variant="bold" style={styles.collectionName} numberOfLines={1}>{item.name}</AppText>
          <AppText style={styles.collectionSub}>{t("profile.view_detail")}</AppText>
        </View>
        <Ionicons name="chevron-forward-circle" size={32} color={PRIMARY_COLOR} />
      </View>
    </Pressable>
  );

  const renderCreateButton = () => {
      if (activeTab !== 'favorites') return null;
      return (
          <Pressable style={styles.createCollectionBtn} onPress={() => setCreateModalVisible(true)}>
             <Ionicons name="add-circle" size={24} color="#fff" style={{marginRight: 8}}/>
             <AppText variant="bold" style={{color: '#fff'}}>{t("profile.create_collect")}</AppText>
          </Pressable>
      )
  }

  return (
    <AppSafeView style={styles.safeArea}>
      <AppCollectionModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        recipeId={0} 
        onSaved={onCreateSuccess} 
      />

      <FlatList
        data={activeTab === "recipes" ? myRecipes : myCollections}
        renderItem={activeTab === "recipes" ? renderRecipeItem : renderCollectionItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={activeTab === "recipes" ? 2 : 1}
        key={activeTab} 
        columnWrapperStyle={activeTab === "recipes" ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderCreateButton()} 
          </>
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Ionicons name={activeTab === "recipes" ? "fast-food-outline" : "heart-dislike-outline"} size={48} color="#ddd" />
            <AppText style={{ color: "#999", marginTop: 12 }}>
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
  safeArea: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { paddingHorizontal: 16, paddingTop: 10 },
  
  profileRow: { flexDirection: "row", alignItems: "center", marginBottom: 20, position: 'relative' },
  avatarWrapper: { borderWidth: 2, borderColor: PRIMARY_COLOR, borderRadius: 50, padding: 2 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  infoCol: { flex: 1, marginLeft: 16 },
  nameText: { fontSize: 20, color: PRIMARY_COLOR, marginBottom: 4 },
  handleText: { fontSize: 14, color: "#F06560", marginBottom: 6 },
  bioText: { fontSize: 13, color: "#333", lineHeight: 18 },
  
  topRightIcons: { flexDirection: "row", position: 'absolute', top: 0, right: 0 },
  smallIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFF0F0", alignItems: "center", justifyContent: "center" },

  actionButtonsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, gap: 10 },
  editButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: PRIMARY_COLOR, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, gap: 8 },
  editButtonText: { color: "#fff", fontSize: 14 },
  shareButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: PRIMARY_COLOR, gap: 8 },
  shareButtonText: { color: PRIMARY_COLOR, fontSize: 14 },

  statsContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#FFDADA", borderRadius: 16, paddingVertical: 12, marginBottom: 24, backgroundColor: '#FAFAFA' },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 16, color: "#333" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 2 },
  verticalDivider: { width: 1, height: "60%", backgroundColor: "#FFDADA" },

  tabContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tabItem: { paddingBottom: 12, flex: 1, alignItems: "center" },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: PRIMARY_COLOR },
  tabText: { fontSize: 16 },
  tabTextActive: { color: PRIMARY_COLOR },
  tabTextInactive: { color: "#999" },

  listContent: { paddingBottom: 100 },
  columnWrapper: { justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 16 },

  // Collection Card
  collectionCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: "#fff", borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, overflow: 'hidden', borderWidth: 1, borderColor: '#f5f5f5' },
  imageWrapper: { height: 140, width: '100%', position: 'relative' },
  collectionImage: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  iconBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#fff', padding: 8, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  deleteBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  collectionBody: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  collectionName: { fontSize: 18, color: '#333', marginBottom: 4 },
  collectionSub: { fontSize: 13, color: '#888' },
  
  createCollectionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: PRIMARY_COLOR, marginHorizontal: 16, marginBottom: 16, paddingVertical: 12, borderRadius: 12 },

  navBarWrapper: { position: "absolute", bottom: 0, left: 0, right: 0 },

  // Pending Badge Style
  pendingBadge: {
    position: 'absolute', top: 8, left: 8, backgroundColor: '#FF9800', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, zIndex: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3,
  },
  pendingText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});