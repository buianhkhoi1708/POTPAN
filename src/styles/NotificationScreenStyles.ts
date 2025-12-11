// src/styles/NotificationScreenStyles.ts

import { StyleSheet } from "react-native";
import { AppLightColor } from "../styles/color";

export const notificationStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    color: AppLightColor.primary_color,
  },
  headerSpacer: {
    width: 32,
    height: 32,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  sectionLabel: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    color: AppLightColor.primary_text,
  },

  dateGroup: {
    marginTop: 8,
  },
  dateLabel: {
    marginBottom: 8,
    fontSize: 13,
    color: AppLightColor.primary_text,
  },

  itemWrapper: {
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#ffe3e2",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  itemTextCol: {
    flexShrink: 1,
  },
  notiTitle: {
    fontSize: 14,
    color: AppLightColor.primary_color,
    fontWeight: "700",
    marginBottom: 2,
  },
  notiMessage: {
    fontSize: 13,
    color: AppLightColor.primary_text,
  },
  notiTime: {
    marginTop: 4,
    fontSize: 11,
    color: "#000000ff",
    alignSelf: "flex-end",
    marginRight: 4,
  },
});
