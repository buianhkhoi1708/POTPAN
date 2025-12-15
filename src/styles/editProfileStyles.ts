// src/styles/editProfileStyles.ts

import { StyleSheet } from "react-native";
import { AppLightColor } from "./color";

export const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: 26, paddingTop: 8 },

  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: AppLightColor.primary_color,
  },
  headerRight: { flexDirection: "row", columnGap: 10 },

  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarWrap: { alignItems: "center", marginTop: 14 },
  avatar: { width: 120, height: 120, borderRadius: 60 },

  form: { marginTop: 12 },
  label: { fontSize: 14, fontWeight: "700", marginTop: 14 },
  inputPill: {
    marginTop: 8,
    backgroundColor: "#ffe3e2",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  inputBio: {
    marginTop: 8,
    backgroundColor: "#ffe3e2",
    borderRadius: 22,
    padding: 14,
    minHeight: 96,
    fontSize: 14,
  },

  saveBtn: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 999,
    paddingHorizontal: 64,
    paddingVertical: 10,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
