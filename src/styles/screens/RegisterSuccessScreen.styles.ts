import { StyleSheet } from "react-native";

const ORANGE = "#FF782C";
const CARD_W = 270;
const CARD_R = 22;
const BADGE = 69;
const INSET_BORDER = 3;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(15,23,42,0.50)",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_W,
    borderRadius: CARD_R,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    alignItems: "center",
  },
  logoWrapper: {
    marginBottom: 12,
  },
  checkWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 20,
  },
  highlight: {
    fontWeight: "700",
    color: ORANGE,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: ORANGE,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: INSET_BORDER,
    borderColor: "#e5e7eb",
  },
  secondaryText: {
    color: "#4b5563",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default styles;
