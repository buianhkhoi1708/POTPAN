import { Pressable, PressableProps, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import React from "react";
import AppText from "./AppText";
import { AppFonts } from "../styles/fonts";


type AppBut = StyleProp<ViewStyle>;
type AppBut1 = StyleProp<TextStyle>;

interface AppButtonProps extends PressableProps {
  butName: string;
  style?: AppBut;  
  style1?: AppBut1;
  onPress?: () => void;
  activeOpacity?: number; 
}

const AppButton = ({ 
  butName, 
  style, 
  style1, 
  onPress, 
  activeOpacity = 0.7,
  ...rest
}: AppButtonProps) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        style as ViewStyle, 
        pressed && { opacity: activeOpacity }
      ]} 
      onPress={onPress} 
      {...rest}
    >
      <AppText variant="bold" style={[style1, styles.buttext]}> {butName}</AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttext: {
    fontFamily: AppFonts.RobotoSlabBold
  }
})

export default AppButton;