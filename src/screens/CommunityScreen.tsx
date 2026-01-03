import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// COMPONENTS
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import MainBottomNav, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader";
import AppSocialCard, { SocialPostType } from "../components/AppSocialCard";
import BottomNavSpacer from "../components/AppBottomSpace";

// CONFIG
import { AppLightColor } from "../styles/color";
import { supabase } from "../config/supabaseClient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// FORMATTER
const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const CommunityScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const [activeBottomTab, setActiveBottomTab] = useState<MainTabKey>("world");
  const [posts, setPosts] = useState<SocialPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  // Animation
  const fadeAnim = useState(new Animated.Value(0))[0];
  const fabScale = useState(new Animated.Value(1))[0];

  // --- FETCH DATA ---
  const fetchPosts = async (loadMore = false) => {
    try {
      if (!loadMore) {
        if (!refreshing) setLoading(true);
      }

      const pageSize = 10;
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("recipes")
        .select(`
          id, title, thumbnail, description, created_at,
          users (full_name, avatar_url),
          rating
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        const formattedData: SocialPostType[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          image: item.thumbnail,
          desc: item.description || "",
          authorName: item.users?.full_name || "Bếp trưởng ẩn danh",
          authorAvatar: item.users?.avatar_url || null,
          time: formatTimeAgo(item.created_at),
          likesCount: Math.floor(Math.random() * 50) + (item.rating || 0),
          commentsCount: Math.floor(Math.random() * 10),
          isLiked: false,
          originalItem: item,
        }));

        if (loadMore) {
          setPosts(prev => [...prev, ...formattedData]);
        } else {
          setPosts(formattedData);
        }

        setHasMore(data.length === pageSize);
        
        // Animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } catch (err) {
      console.log("Error fetching feed:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setActiveBottomTab("world");
      fetchPosts();
    }
  }, [isFocused]);

  // --- HANDLERS ---
  const handleLikePost = async (postId: any, newStatus: boolean) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: newStatus,
              likesCount: newStatus ? post.likesCount + 1 : post.likesCount - 1,
            }
          : post
      )
    );
    console.log(`User ${newStatus ? "liked" : "unliked"} post ${postId}`);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && posts.length > 0) {
      setPage(prev => prev + 1);
      fetchPosts(true);
    }
  };

  const handleRefresh = () => {
    setPage(0);
    setRefreshing(true);
    fetchPosts();
  };

  const animateFab = () => {
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderItem = useCallback(({ item, index }: { item: SocialPostType; index: number }) => {
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20 * (index + 1), 0],
              }),
            },
          ],
        }}
      >
        <AppSocialCard
          item={item}
          onPress={() => navigation.navigate("RecipeDetailScreen", { item: item.originalItem })}
          onLikePress={handleLikePost}
          onCommentPress={() =>
            navigation.navigate("RecipeDetailScreen", {
              item: item.originalItem,
              autoFocusComment: true,
            })
          }
        />
      </Animated.View>
    );
  }, [fadeAnim]);

  const renderFooter = () => {
    if (!hasMore && posts.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Ionicons name="checkmark-circle-outline" size={24} color={AppLightColor.success} />
          <AppText style={styles.footerText}>Đã xem tất cả bài viết</AppText>
        </View>
      );
    }
    
    if (loading && posts.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={AppLightColor.primary_color} />
          <AppText style={styles.loadingMoreText}>Đang tải thêm...</AppText>
        </View>
      );
    }
    
    return null;
  };

  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIllustration}>
          <Ionicons name="newspaper-outline" size={80} color={AppLightColor.border} />
        </View>
        <AppText style={styles.emptyTitle}>Chưa có bài viết nào</AppText>
        <AppText style={styles.emptyDescription}>
          Hãy là người đầu tiên chia sẻ công thức nấu ăn của bạn!
        </AppText>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            animateFab();
            navigation.navigate("CreatePostScreen");
          }}
        >
          <Ionicons name="add" size={20} color="#fff" style={styles.createButtonIcon} />
          <AppText style={styles.createButtonText}>Tạo bài viết đầu tiên</AppText>
        </TouchableOpacity>
      </View>
    );
  };

  const memoizedList = useMemo(() => (
    <FlatList
      data={posts}
      keyExtractor={(item) => `post-${item.id}`}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.listContent,
        posts.length === 0 && styles.emptyListContent,
      ]}
      showsVerticalScrollIndicator={false}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={AppLightColor.primary_color}
          colors={[AppLightColor.primary_color]}
          progressBackgroundColor="#fff"
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyState}
    />
  ), [posts, loading, refreshing, renderItem, hasMore]);

  return (
    <AppSafeView style={styles.safeArea}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#fff" 
        animated={true}
      />
      
      <View style={styles.container}>
        {/* Header */}
        <AppHeader
          title={t("community.screen_title")}
          showBack={false}
          rightIcon={
            <TouchableOpacity 
              style={styles.searchButton}
              activeOpacity={0.7}
            >
              <Ionicons name="search-outline" size={22} color="#333" />
            </TouchableOpacity>
          }
          onRightPress={() => {}}
          style={styles.header}
        />

        {/* Feed List */}
        {loading && !refreshing && posts.length === 0 ? (
          <View style={styles.loadingContainer}>
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.skeletonCard}>
                <View style={styles.skeletonAvatar} />
                <View style={styles.skeletonContent}>
                  <View style={[styles.skeletonLine, { width: '60%' }]} />
                  <View style={[styles.skeletonLine, { width: '80%' }]} />
                  <View style={[styles.skeletonLine, { width: '40%' }]} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          memoizedList
        )}

        {/* FAB */}
        <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.7}
            onPress={() => {
              animateFab();
              navigation.navigate("CreatePostScreen");
            }}
          >
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Nav */}
        <MainBottomNav
          activeTab={activeBottomTab}
          onTabPress={(tab) => {
            setActiveBottomTab(tab);
            if (tab === "home") navigation.navigate("HomeScreen");
            if (tab === "profile") navigation.navigate("ProfileScreen");
            if (tab === "category") navigation.navigate("CategoriesScreen");
          }}
          style={styles.bottomNav}
        />
      </View>
    </AppSafeView>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    elevation: 0,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: 'center',
  },
  skeletonLine: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 8,
  },
  
  // List
  listContent: { 
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Search Button
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  
  // FAB
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 110,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: "#fff",
  },
  
  // Footer
  footerContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    gap: 8,
  },
  footerText: {
    color: AppLightColor.success,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingMoreText: {
    color: AppLightColor.text_secondary,
    fontSize: 14,
    marginLeft: 8,
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: AppLightColor.text_primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: AppLightColor.text_secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: AppLightColor.primary_color,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: AppLightColor.primary_color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createButtonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Bottom Nav
  bottomNav: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
});