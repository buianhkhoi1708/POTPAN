// src/navigations/AppStackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import StartingScreen from "../screens/StartingScreen";
import Page2 from "../screens/Page2";
import Page2_2 from "../screens/Page2.2";
import Introduce1 from "../screens/Introduce1";

export type RootStackParamList = {
  StartingScreen: undefined;
  Page2: undefined;
  Page2_2: undefined;   // <── route cho file Page2.2.tsx
  Introduce1: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function StartingStackNav() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartingScreen" component={StartingScreen} />
      <Stack.Screen name="Page2" component={Page2} />
      <Stack.Screen name="Page2_2" component={Page2_2} />
      <Stack.Screen name="Introduce1" component={Introduce1} />
    </Stack.Navigator>
  );
}
