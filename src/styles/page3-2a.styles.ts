// src/styles/screens/page3-2a.styles.ts
import { StyleSheet } from "react-native";

const COLOR = "#FF6967";

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8, paddingHorizontal: 16 },

  title: {
    fontSize: 44,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 10,
    color: "#4B4B4B",
    justifyContent: "center",
    fontStyle: "normal",
    marginTop: 8,
  },

  form: {
    flex: 1,
  },

  label: {
    fontSize: 24,
    fontStyle: "normal",
    color: "#4B4B4B",
    fontWeight: "700",
    marginBottom: 5,
    marginTop: 10,
  },

  inputWrap: { position: "relative" },

  input: {
    height: 46,
    borderRadius: 40,
    paddingHorizontal: 20,
    backgroundColor: COLOR,
    color: "#ffffffff",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 1,
    textAlignVertical: "center",
  },

  textHolder: {
    fontSize: 18,
    fontWeight: "500",
  },

  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 11,
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  footer: { paddingTop: 8, paddingBottom: 28 },

  termsText: {
    fontSize: 18,
    color: "#4B4B4B",
    lineHeight: 22,
    fontWeight: "500",
    textAlign: "center",
  },

  primaryBtn: {
    backgroundColor: COLOR,
    height: 48,
    width: 185,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    alignSelf: "center",
  },

  primaryText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 24,
  },

  bottomText: {
    marginTop: 10,
    alignSelf: "center",
    color: "#4B4B4B",
    fontSize: 18,
  },

  link: { color: "#1C37CF", fontWeight: "800" },
});

export default styles;
