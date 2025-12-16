import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
} from "react-native";
import { AppLightColor } from "../styles/color";

interface AppTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

const AppTextInput = ({ style, ...rest }: AppTextInputProps) => {
  return (
    <View style={styles.inputWrap}>
      <TextInput
        allowFontScaling={false}
        placeholderTextColor={AppLightColor.placeholder_text}
        {...rest}
        style={[styles.input, style]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrap: { position: "relative" },
  input: {
    height: 52,
    borderRadius: 999,
    paddingHorizontal: 22,
    backgroundColor: AppLightColor.secondary_color,
    color: AppLightColor.primary_text,
    fontWeight: "600",
    fontSize: 20,
    letterSpacing: 0.5,
    textAlignVertical: "center",
  },
});

export default AppTextInput;
