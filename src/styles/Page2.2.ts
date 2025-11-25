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
    color: "#FF6967",
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

});
