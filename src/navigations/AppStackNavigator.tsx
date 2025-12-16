import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartingScreen from "../screens/StartingScreen";
import { RootStackParamList } from "../type/types";
import IntroduceScreen from "../screens/IntroduceScreen";
import Introduce1Screen from "../screens/Introduce1Screen";
import Introduce2Screen from "../screens/Introduce2Screen";

const Stack = createStackNavigator<RootStackParamList>();

export function AppStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen name="StartingScreen" component={StartingScreen} />
      <Stack.Screen name="IntroduceScreen" component={IntroduceScreen} />
      <Stack.Screen name="Introduce1Screen" component={Introduce1Screen} />
      <Stack.Screen name="Introduce2Screen" component={Introduce2Screen} />
    </Stack.Navigator>
  );
}