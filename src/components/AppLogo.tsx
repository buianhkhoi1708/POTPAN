import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import LogoIcon from "../assets/images/logo.svg"


interface AppLogo {
  image: string;
}

const AppLogo = ({} : AppLogo) => {

  return (
    <View style={styles.container}>
  
        <LogoIcon width={200} height={200} />
    
    </View>
  );
};

export default AppLogo;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 25,
    marginTop: 20,
  },
  logo_con: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#2e2e2eff",
  },
  text: {
    fontSize: 26,
  },
});
