import React, { ReactNode, useState } from "react";
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
  children?: ReactNode;
}

const AppPasswordInput = ({ style, children, ...rest }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.inputWrap}>
      <View style={styles.iconTextCon}>
        {children}
        <TextInput
          allowFontScaling={false}
          secureTextEntry={!visible}
          placeholderTextColor={AppLightColor.placeholder_text}
          {...rest}
          style={[styles.input, styles.eyeInput, style]}
        />
      </View>

      <Pressable
        style={styles.eyeBtn}
        onPress={() => setVisible(!visible)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name={visible ? "eye" : "eye-off"} size={20} color={"grey"} />
      </Pressable>
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
    justifyContent: 'center',
    width: 343

  },
  input: {
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
    width: 288,
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
  iconTextCon: {
    flexDirection: "row",
  },
});

export default AppPasswordInput;
