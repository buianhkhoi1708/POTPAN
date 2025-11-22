import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppText from "./AppText";

interface AppButton {
  butName: string;
  style?: AppBut | AppBut[];
  style1?: AppBut1 | AppBut1[];
  onPress?: () => void;
}

const AppButton = ({ butName, style, style1, onPress}: AppButton) => {
  return (
    <Pressable style = {style} onPress={onPress}>
      <AppText variant="bold" style = {style1}> {butName}</AppText>
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
  },

});
