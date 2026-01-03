import React, { Children, ReactNode } from "react";
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
  children?: ReactNode;
}

const AppTextInput = ({ style, children, ...rest }: AppTextInputProps) => {
  return (
    <View style={styles.inputWrap}>
      <View style={styles.inputContainer}>
        {children}
        <TextInput
          allowFontScaling={false}
          placeholderTextColor={AppLightColor.placeholder_text}
          {...rest}
          style={[styles.input, style]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrap: {
    position: "relative",
    borderWidth: 1,
    borderColor: "grey",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row",
    width: 343

  },
  input: {
    height: 50,
    width: 300,
    borderRadius: 10,
    color: AppLightColor.primary_text,
    fontWeight: "600",
    fontSize: 20,
    letterSpacing: 0.5,
    textAlignVertical: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: 'center',

  },
});

export default AppTextInput;
