import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppLightColor } from "../styles/color";

interface PasswordInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

const AppPasswordInput = ({ style, ...rest }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.inputWrap}>
      <TextInput
        allowFontScaling={false}
        secureTextEntry={!visible}
        placeholderTextColor={AppLightColor.placeholder_text}
        {...rest}
        style={[styles.input, styles.eyeInput, style]}
      />
      <Pressable
        style={styles.eyeBtn}
        onPress={() => setVisible(!visible)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={visible ? "eye" : "eye-off"}
          size={20}
          color={AppLightColor.primary_color}
        />
      </Pressable>
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
    fontSize: 16,
    letterSpacing: 0.5,
  },
  eyeInput: {
    paddingRight: 52,
    paddingVertical: 0,
    textAlignVertical: "center",
  },
  eyeBtn: {
    position: "absolute",
    right: 16,
    top: 12,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppPasswordInput;
