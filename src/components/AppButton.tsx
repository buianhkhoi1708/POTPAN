import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

interface AppButton {
  butName: string;
  style?: AppBut | AppBut[];
  style1?: AppBut1 | AppBut1[];
  onPress?: () => void;
}

const AppButton = ({ butName, style, style1, onPress}: AppButton) => {
  return (
    <View style={[styles.container, style]}>
      <View style = {[styles.button, style1 ]}>
        <Button title={butName} color='white' onPress={onPress}/>
      </View>
    </View>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#fc7f31ff',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
  }
});
