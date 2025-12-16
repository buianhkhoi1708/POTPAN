import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../type/types";
import LoginScreen from "../screens/AuthScreens/LoginScreen";
import SigninScreen from "../screens/AuthScreens/SigninScreen";

const Stack = createStackNavigator<RootStackParamList>();

export function AuthStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SigninScreen" component={SigninScreen} />
    </Stack.Navigator>
  );
}