import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartingScreen from "../screens/StartingScreen";
import { RootStackParamList } from "../type/types";
import IntroduceScreen from "../screens/IntroduceScreen";
import Introduce1Screen from "../screens/Introduce1Screen";
import Introduce2Screen from "../screens/Introduce2Screen";
import Introduce3Screen from "../screens/Introduce3Screen";
import Introduce4Screen from "../screens/Introduce4Screen";
import LoginScreen from "../screens/AuthScreens/LoginScreen";
import SigninScreen from "../screens/AuthScreens/SigninScreen";

const Stack = createStackNavigator<RootStackParamList>();

export function AppStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="StartingScreen" component={StartingScreen} />
      <Stack.Screen name="IntroduceScreen" component={IntroduceScreen} />
      <Stack.Screen name="Introduce1Screen" component={Introduce1Screen} />
      <Stack.Screen name="Introduce2Screen" component={Introduce2Screen} />
      <Stack.Screen name="Introduce3Screen" component={Introduce3Screen} />
      <Stack.Screen name="Introduce4Screen" component={Introduce4Screen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SigninScreen" component={SigninScreen} />
    </Stack.Navigator>
  );
}