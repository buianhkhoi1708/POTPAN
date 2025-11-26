import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(185, 169, 169, 1)" },

  background: { flex: 1 },

  bgImage: {
    top: 80,
  },

  topFade: {
    position: "absolute",
    width: SCREEN_W + 50,
    height: 330,
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
  },

  title: {
    top: 60,
    left: 16,
    right: 16,
    fontSize: 25,
    paddingHorizontal: 16,
    fontWeight: "700",
    color: "#4B4B4B",
    lineHeight: 30,
    letterSpacing: 0.04,
    marginBottom: 4,
  },

  subtitle: {
    fontStyle: "italic",
    fontSize: 15,
    color: "#4B4B4B",
    fontWeight: "400",
    letterSpacing: 0.04,
    lineHeight: 18,
    top: 60,
    left: 16,
    right: 16,
    paddingHorizontal: 16,
  },

  dots: {
    position: "absolute",
    bottom: 52,
    left: 100,
    right: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },

  dotActive: {
    opacity: 1,
    width: 9,
    height: 9,
    backgroundColor: "#000000",
  },

  muiten: {
    position: "absolute",
    bottom: 36,
    width: 52,
    height: 52,
    borderRadius: 52,
    backgroundColor: "#FF6967",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6967",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  E1: {
    flex: 1,
    overflow: "hidden",
    position: "absolute",
    width: 318.4,
    height: 153.17,
    left: 12.4,
    top: 189.06,
    transform: [{ rotate: "2deg" }],
  },

  E2: {
    flex: 1,
    overflow: "hidden",
    position: "absolute",
    width: 295.19,
    height: 153.17,
    left: 100,
    top: 389,
  },

  E3: {
    flex: 1,
    overflow: "hidden",
    position: "absolute",
    width: 283.52,
    height: 153.17,
    left: 8.94,
    top: 581,
  },

  T1: {
    position: "absolute",
    width: 298,
    height: 68,
    left: 26,
    top: 251,
    color: "#fff",
    fontSize: 29,
    fontStyle: "italic",
    fontWeight: "900",
    lineHeight: 44,
  },

  T2: {
    position: "absolute",
    width: 200,
    height: 68,
    left: 141,
    top: 445,
    color: "#fff",
    fontSize: 30,
    fontStyle: "italic",
    fontWeight: "900",
    lineHeight: 44,
  },

  T3: {
    position: "absolute",
    width: 186,
    height: 54,
    left: 63,
    top: 639,
    color: "#fff",
    fontSize: 30,
    fontStyle: "italic",
    fontWeight: "900",
    lineHeight: 44,
  },
});
