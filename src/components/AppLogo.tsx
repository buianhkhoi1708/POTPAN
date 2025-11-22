import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import LogoIcon from "../assets/images/logo.svg"


interface AppLogo {
  width: number,
  height: number,
}

const AppLogo = ({width, height} : AppLogo) => {

  return (
        <LogoIcon width={width} height={height} />
  );
};

export default AppLogo;

