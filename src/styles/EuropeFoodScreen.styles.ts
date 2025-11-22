// src/styles/EuropeFoodScreen.styles.ts
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const PHONE_WIDTH = width * 0.9;
const PHONE_HEIGHT = height * 0.9;
const RADIUS = 30;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    paddingTop: 8,
  },
  statusBar: {
    width: PHONE_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  carrier: {
    fontFamily: "System",
    fontSize: 11,
    color: "#222222",
    letterSpacing: 0.3,
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  phone: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    borderRadius: RADIUS,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  image: {
    flex: 1,
    position: "relative",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: PHONE_HEIGHT * 0.35,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: PHONE_HEIGHT * 0.25,
  },
  textWrapper: {
    paddingTop: 36,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: "System",
    fontSize: 24,
    fontWeight: "700",
    color: "#ff3b30", // đỏ tươi hơn giống mock
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: "System",
    fontSize: 13,
    color: "#5a5a5a",
    fontStyle: "italic",
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  bottomControls: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ff3b30",
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff3b30",
  },
  homeIndicatorWrapper: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  homeIndicator: {
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
});

export default styles;
