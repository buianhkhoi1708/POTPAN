// Nhóm 9 - IE307.Q12
import React, { ReactNode } from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";

interface AppSafeViewProps extends SafeAreaViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>; 
}

const AppSafeView = ({ children, style, ...props }: AppSafeViewProps) => {
  return (
    <SafeAreaView 
      style={[styles.container, style]} 
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};

export default AppSafeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});