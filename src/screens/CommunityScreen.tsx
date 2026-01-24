// Nhóm 9 - IE307.Q12
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
  Platform,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import MainBottomNav, { type MainTabKey } from "../components/AppMainNavBar";
import AppHeader from "../components/AppHeader";
import AppSocialCard, { SocialPostType } from "../components/AppSocialCard";
import { supabase } from "../config/supabaseClient";
import { useThemeStore } from "../store/useThemeStore";

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
  const { theme, isDarkMode } = useThemeStore();
  const [activeBottomTab, setActiveBottomTab] = useState<MainTabKey>("world");
  const [posts, setPosts] = useState<SocialPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const fabScale = useState(new Animated.Value(1))[0];
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
        .select(
          `
          id, title, thumbnail, description, created_at,
          users (full_name, avatar_url),
          rating
        `
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        const formattedData: SocialPostType[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          image: item.thumbnail,
          desc: item.description || "",
          authorName: item.users?.full_name || t("chef.anonymous"),
          authorAvatar: item.users?.avatar_url || null,
          time: formatTimeAgo(item.created_at),
          likesCount: Math.floor(Math.random() * 50) + (item.rating || 0),
          commentsCount: Math.floor(Math.random() * 10),
          isLiked: false,
          originalItem: item,
        }));

        if (loadMore) {
          setPosts((prev) => [...prev, ...formattedData]);
        } else {
          setPosts(formattedData);
        }

        setHasMore(data.length === pageSize);

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
      if (posts.length === 0) fetchPosts();
    }
  }, [isFocused]);

  const handleLikePost = async (postId: any, newStatus: boolean) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: newStatus,
              likesCount: newStatus ? post.likesCount + 1 : post.likesCount - 1,
            }
          : post
      )
    );
  };

  const handleHidePost = (postId: any) => {
    setPosts((currentList) => currentList.filter((item) => item.id !== postId));
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && posts.length > 0) {
      setPage((prev) => prev + 1);
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
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderItem = useCallback(
    ({ item, index }: { item: SocialPostType; index: number }) => {
      return (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          }}
        >
          <AppSocialCard
            item={item}
            onPress={() =>
              navigation.navigate("RecipeDetailScreen", {
                item: item.originalItem,
              })
            }
            onLikePress={handleLikePost}
            onHidePost={handleHidePost}
          />
        </Animated.View>
      );
    },
    [fadeAnim]
  );

  const renderFooter = () => {
    if (!hasMore && posts.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={theme.placeholder_text}
          />
          <AppText
            style={[styles.footerText, { color: theme.placeholder_text }]}
          >
            {t("common.seen_all")}
          </AppText>
        </View>
      );
    }

    if (loading && posts.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={theme.primary_color} />
        </View>
      );
    }

    return <View style={{ height: 20 }} />;
  };

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <View
          style={[
            styles.emptyIllustration,
            {
              borderColor: theme.border,
              backgroundColor: theme.background_contrast,
            },
          ]}
        >
          <Ionicons
            name="newspaper-outline"
            size={60}
            color={theme.placeholder_text}
          />
        </View>
        <AppText
          variant="bold"
          style={[styles.emptyTitle, { color: theme.primary_text }]}
        >
          {t("community.empty_title")}
        </AppText>
        <AppText
          style={[styles.emptyDescription, { color: theme.placeholder_text }]}
        >
          {t("community.empty_desc")}
        </AppText>
        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: theme.primary_color },
          ]}
          onPress={() => {
            animateFab();
            navigation.navigate("CreatePostScreen");
          }}
        >
          <Ionicons
            name="add"
            size={20}
            color="#fff"
            style={styles.createButtonIcon}
          />
          <AppText variant="bold" style={styles.createButtonText}>
            {t("community.create_first")}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  const memoizedList = useMemo(
    () => (
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
        removeClippedSubviews={Platform.OS === "android"}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary_color}
            colors={[theme.primary_color]}
            progressBackgroundColor={theme.background_contrast}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
      />
    ),
    [posts, loading, refreshing, renderItem, hasMore, theme]
  );

  return (
    <AppSafeView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
        animated={true}
      />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <AppHeader title={t("community.screen_title")} showBack={false} />
        {loading && !refreshing && posts.length === 0 ? (
          <View style={styles.loadingContainer}>
            {[1, 2, 3].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.skeletonCard,
                  {
                    backgroundColor: theme.background_contrast,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.skeletonAvatar,
                    { backgroundColor: isDarkMode ? "#3A3A3C" : "#F0F0F0" },
                  ]}
                />
                <View style={styles.skeletonContent}>
                  <View
                    style={[
                      styles.skeletonLine,
                      {
                        width: "60%",
                        backgroundColor: isDarkMode ? "#3A3A3C" : "#F0F0F0",
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.skeletonLine,
                      {
                        width: "80%",
                        backgroundColor: isDarkMode ? "#3A3A3C" : "#F0F0F0",
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.skeletonLine,
                      {
                        width: "40%",
                        backgroundColor: isDarkMode ? "#3A3A3C" : "#F0F0F0",
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : (
          memoizedList
        )}

        <Animated.View
          style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}
        >
          <TouchableOpacity
            style={[
              styles.fab,
              {
                backgroundColor: theme.primary_color,
                borderColor: theme.background_contrast,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => {
              animateFab();
              navigation.navigate("CreateRecipeScreen");
            }}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Nav */}
        <MainBottomNav
          activeTab={activeBottomTab}
          onTabPress={(tab) => {
            setActiveBottomTab(tab);
          }}
        />
      </View>
    </AppSafeView>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  skeletonCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },

  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 100,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 2,
  },

  footerContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 40,
  },
  emptyIllustration: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createButtonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 15,
  },
});
