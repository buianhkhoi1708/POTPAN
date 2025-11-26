// src/styles/screens/page3-1b.styles.ts
import { StyleSheet } from "react-native";

const COLOR = "#FF6967";
const CARD_W = 270;
const CARD_R = 24;

export default StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  card: {
    position: "absolute",
    alignSelf: "center",
    top: "32%",
    width: CARD_W,
    borderRadius: CARD_R,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  checkWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 16,
  },
  primaryBtn: {
    marginTop: 4,
    alignSelf: "stretch",
    height: 44,
    borderRadius: 999,
    backgroundColor: COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
