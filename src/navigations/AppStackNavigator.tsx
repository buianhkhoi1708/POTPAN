import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartingScreen from "../screens/StartingScreen";
import Intro1Screen from "../screens/Intro1Screen";
import Page2Screen from "../screens/page2_2";

export type RootStackParamList = {
  StartingScreen: undefined;
  Intro1Screen: { ima?: string } | undefined;
  Page2Screen: { ima?: string } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Page2Screen"   // ← vào thẳng page 2.2
    >
      <Stack.Screen name="StartingScreen" component={StartingScreen} />
      <Stack.Screen name="Intro1Screen" component={Intro1Screen} />
      <Stack.Screen name="Page2Screen" component={Page2Screen} />
    </Stack.Navigator>
  );
}
