// Nhóm 9 - IE307.Q12
import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AppText from "./AppText";
import { useThemeStore } from "../store/useThemeStore";

interface AppAdminUserItemProps {
  item: any;
  onDelete: (item: any) => void;
}

const AppAdminUserItem: React.FC<AppAdminUserItemProps> = ({
  item,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const isAdmin = item.role === "admin";

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
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri:
              item.avatar_url ||
              "https://vfqnjeoqxxapqqurdkoi.supabase.co/storage/v1/object/public/avatars/users/default.jpg",
          }}
          style={[styles.avatar, { borderColor: theme.border }]}
        />
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <AppText
              variant="bold"
              style={[styles.userName, { color: theme.primary_text }]}
            >
              {item.full_name || t("admin.no_name")}
            </AppText>
            {isAdmin && (
              <View
                style={[
                  styles.adminBadge,
                  { backgroundColor: theme.primary_color },
                ]}
              >
                <AppText style={styles.adminBadgeText}>ADMIN</AppText>
              </View>
            )}
          </View>
          <AppText
            style={[styles.userEmail, { color: theme.placeholder_text }]}
          >
            {item.email}
          </AppText>
          <AppText style={[styles.userDate, { color: theme.placeholder_text }]}>
            {t("common.joined")}:{" "}
            {new Date(item.created_at).toLocaleDateString()}
          </AppText>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.btnIconAction,
            {
              backgroundColor: isDarkMode ? "#3A1D1E" : "#FFF0F0",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => onDelete(item)}
        >
          <Ionicons name="ban-outline" size={20} color="#FF3B30" />
        </Pressable>
      </View>
    </View>
  );
};

export default AppAdminUserItem;

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
  cardHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
  },
  adminBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 13,
    marginBottom: 4,
  },
  userDate: {
    fontSize: 11,
  },
  btnIconAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
