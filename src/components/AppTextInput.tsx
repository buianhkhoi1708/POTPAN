import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

interface AppTextInput {
    text: string;
    icon: string;
    style?: AppTextStyle | AppTextStyle[];
    value: string;
    type?: string;
    password?: boolean;
    onText: (text: string) => void;
}

export const AppTextInput = ({text, icon, style, value, type, password, onText} : AppTextInput) => {
  return (
    <View style = {[styles.container, style]}>
      <View style={styles.container1}>
        <Ionicons name= {icon} size={25} />
        <TextInput
        value={value}
        onChangeText={onText}
        placeholder= {text}
        style = {styles.textinput}
        keyboardType = {type}
        secureTextEntry = {password}
        />
      </View>
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  container1: {
    flexDirection: 'row',
    borderColor: '#b0b0b0ff',
    borderWidth: 1.5,
    borderRadius: 10,
    width: '80%',
    height: 55,
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  textinput: {
    width: '100%',
  }
});
