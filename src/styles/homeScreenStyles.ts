// src/styles/homeScreenStyles.ts

import { Dimensions, StyleSheet } from "react-native";
import { AppLightColor } from "./color";

const { width: SCREEN_W } = Dimensions.get("window");

const homeScreenStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hello: {
    fontSize: 26,
    color: AppLightColor.primary_text,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // CATEGORY
  categoryRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryItem: {
    marginRight: 16,
    paddingVertical: 4,
  },
  categoryText: {
    color: AppLightColor.primary_color,
  },
  categoryTextActive: {
    color: AppLightColor.primary_color,
  },

  // SECTION HEADER
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  sectionTitle: {
    color: AppLightColor.primary_text,
  },
  sectionTitlePrimary: {
    color: AppLightColor.primary_color,
  },

  // FEATURED
  featuredRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  featuredCard: {
    width: SCREEN_W - 40,
    marginRight: 16,
  },
  featuredImageWrap: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  featuredImage: {
    width: "100%",
    height: 200,
  },
  featuredHeart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  // panel trắng tách riêng, thụt vào và bị đè bởi ảnh
  featuredInfo: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppLightColor.primary_color,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: -14,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  featuredTitle: {
    fontSize: 18,
    color: "#000",
  },
  featuredDesc: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  featuredMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  featuredMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  featuredMetaRight: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  featuredMetaText: {
    fontSize: 12,
    color: AppLightColor.primary_color,
  },

  // "Công thức của tôi"
  mySectionWrapper: {
    marginTop: 8,
    marginHorizontal: -16,
    backgroundColor: AppLightColor.primary_color,
    borderRadius: 8,
    paddingBottom: 14,
  },
  mySectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  mySectionList: {
    paddingHorizontal: 32,
    paddingTop: 4,
  },

  sectionPillWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  sectionPillBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
  },
  sectionPill: {
    paddingHorizontal: 32,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#ffffff",
  },
  sectionPillText: {
    color: AppLightColor.primary_color,
  },

  // LISTS
  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  horizontalListBottom: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // SMALL CARD
  smallCard: {
    width: 190,
    marginRight: 16,
  },
  smallCardRecent: {
    borderRadius: 10,
    padding: 4,
    overflow: "visible",
  },

  smallImageWrap: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#eee",
    position: "relative",
  },
  smallImage: {
    width: "100%",
    height: 120,
  },
  smallHeart: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },

  smallInfo: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: -10,
    marginHorizontal: -6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  smallTitle: {
    fontSize: 18,
    color: "#000",
  },
  smallMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  smallMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  smallMetaRight: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  smallMetaText: {
    fontSize: 12,
    color: AppLightColor.primary_color,
  },

  // CHEF CARD
  chefCard: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#eee",
  },
  chefImage: {
    width: "100%",
    height: "100%",
  },
});

export default homeScreenStyles;
