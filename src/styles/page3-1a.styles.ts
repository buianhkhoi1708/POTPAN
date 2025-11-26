// src/styles/page3-1a.styles.ts
import { StyleSheet } from "react-native";

const PRIMARY = "#FF6967";
const BG = "#FFFFFF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 24,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 40,
    color: "#111827",
  },

  form: {
    marginBottom: 32,
  },

  label: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "700",
    marginBottom: 8,
  },

  inputWrap: { position: "relative" },

  input: {
    height: 52,
    borderRadius: 999,
    paddingHorizontal: 22,
    backgroundColor: PRIMARY,
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
    textAlignVertical: "center",
  },

  textHolder: {
    fontSize: 16,
    fontWeight: "500",
  },

  eyeBtn: {
    position: "absolute",
    right: 16,
    top: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryBtn: {
    marginTop: 8,
    alignSelf: "center",
    height: 52,
    borderRadius: 999,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 80,
  },

  primaryText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  bottomBlock: {
    marginTop: 24,
    alignItems: "center",
  },

  bottomLink: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 6,
  },

  bottomText: {
    color: "#111827",
    fontSize: 14,
  },

  link: {
    color: "#0040C0",
    fontWeight: "800",
  },

  bottomTextSmall: {
    marginTop: 18,
    fontSize: 13,
    color: "#6B7280",
  },

  socialRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
    columnGap: 20,
  },

  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default styles;
