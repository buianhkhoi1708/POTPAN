// src/navigations/AppStackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import StartingScreen from "../screens/StartingScreen";
import Page2 from "../screens/Page2";
import Introduce1 from "../screens/Introduce1";

import Page3_1a from "../screens/page3-1a";
import Page3_1b from "../screens/page3-1b";

import Page3_2a from "../screens/page3-2a";
import Page3_2b from "../screens/page3-2b";
import Page2_3 from "../screens/page2-3";

export type RootStackParamList = {
  StartingScreen: undefined;
  Page2: undefined;
  Introduce1: undefined;

  "Page3-1a": undefined;
  "Page3-1b": { name?: string } | undefined;

  "Page3-2a": undefined;
  "Page3-2b": { name?: string } | undefined;

  "Page2-3": undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Page3-1a"
    >
      {/* flow cũ */}
      <Stack.Screen name="StartingScreen" component={StartingScreen} />
      <Stack.Screen name="Page2" component={Page2} />
      <Stack.Screen name="Introduce1" component={Introduce1} />

      {/* Đăng nhập + popup */}
      <Stack.Screen name="Page3-1a" component={Page3_1a} />
      <Stack.Screen
        name="Page3-1b"
        component={Page3_1b}
        options={{ presentation: "transparentModal" }}
      />

      {/* Đăng ký + popup */}
      <Stack.Screen name="Page3-2a" component={Page3_2a} />
      <Stack.Screen
        name="Page3-2b"
        component={Page3_2b}
        options={{ presentation: "transparentModal" }}
      />

      {/* Intro screens khác */}
      <Stack.Screen name="Page2-3" component={Page2_3} />
    </Stack.Navigator>
  );
}
