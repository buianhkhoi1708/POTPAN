import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AppText from "./AppText"; 
import { useThemeStore } from "../store/useThemeStore";

interface AppAdminRecipeItemProps {
  item: any;
  activeTab: "pending" | "approved" | "users";
  onPress: () => void;
  onDelete: (item: any) => void;
  onApprove: (item: any) => void;
}

const AppAdminRecipeItem: React.FC<AppAdminRecipeItemProps> = ({
  item,
  activeTab,
  onPress,
  onDelete,
  onApprove,
}) => {
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.background_contrast,
          borderColor: theme.border,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.cardBody,
          { opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <Image
          source={{ uri: item.image || item.thumbnail }}
          style={[
            styles.postImage,
            { backgroundColor: isDarkMode ? "#333" : "#f0f0f0" },
          ]}
        />
        <View style={styles.postContent}>
          <View>
            <AppText
              variant="bold"
              numberOfLines={2}
              style={[styles.postTitle, { color: theme.primary_text }]}
            >
              {item.title}
            </AppText>
            <AppText
              style={[styles.postAuthor, { color: theme.placeholder_text }]}
              numberOfLines={1}
            >
              <Ionicons
                name="person-outline"
                size={12}
                color={theme.placeholder_text}
              />{" "}
              {item.users?.full_name || t("admin.anonymous")}
            </AppText>
          </View>
          <AppText
            style={[
              styles.postDate,
              {
                color: theme.placeholder_text,
                backgroundColor: isDarkMode ? "#111" : "#F8F9FA",
              },
            ]}
          >
            {new Date(item.created_at).toLocaleDateString()}
          </AppText>
        </View>
      </Pressable>

      <View style={[styles.separator, { backgroundColor: theme.border }]} />

      <View style={styles.cardActions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: isDarkMode
                ? "rgba(255, 59, 48, 0.15)"
                : "#FFF5F5",
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={() => onDelete(item)}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          <AppText style={[styles.actionBtnText, { color: "#FF3B30" }]}>
            {t("admin.actions.delete")}
          </AppText>
        </Pressable>

        {activeTab === "pending" && (
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: isDarkMode
                  ? "rgba(76, 175, 80, 0.15)"
                  : "#F0F9F0",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={() => onApprove(item)}
          >
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <AppText style={[styles.actionBtnText, { color: "#4CAF50" }]}>
              {t("admin.actions.approve")}
            </AppText>
          </Pressable>
        )}

        {activeTab === "approved" && (
          <View style={styles.statusApproved}>
            <Ionicons name="checkmark-done-circle" size={18} color="#4CAF50" />
            <AppText style={styles.statusText}>
              {t("admin.tabs.approved")}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default AppAdminRecipeItem;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardBody: { flexDirection: "row", padding: 12 },
  postImage: { width: 100, height: 100, borderRadius: 12 },
  postContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  postTitle: { fontSize: 16, lineHeight: 22, marginBottom: 4 },
  postAuthor: { fontSize: 13 },
  postDate: {
    fontSize: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  separator: { height: 1, marginHorizontal: 12 },
  cardActions: {
    flexDirection: "row",
    padding: 8,
    justifyContent: "space-between",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionBtnText: { fontSize: 13, fontWeight: "700", marginLeft: 6 },
  statusApproved: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  statusText: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 13,
  },
});