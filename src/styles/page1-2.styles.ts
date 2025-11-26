import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topImage: {
    flex: 1,
    overflow: "hidden",
  },
  bottomImage: {
    flex: 1,
    overflow: "hidden",
  },
  overlayCenter: {
    position: "absolute",
    width: 300,
    height: 300,
    alignSelf: 'center',
    top: "33.5%",
    zIndex: 10,          
    elevation: 10,       
},

  logoContainer: {
    alignItems: "center",
    backgroundColor: "#ffff",
    borderRadius: 400,
  },
  
  text: {
    bottom: 35
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#FF6967",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    letterSpacing: -1,
    alignSelf:'center'
  },
  buttonContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  startButton: {
    backgroundColor: "#FF6967",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  startText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
