import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Page3_2a from "../screens/page3-2a";
import Page3_2b from "../screens/page3-2b";
import Page1_1 from "../screens/page1-1";
import Page1_2 from "../screens/page1-2";
import Page2_3 from "../screens/page2-3";

import StartingScreen from "../screens/StartingScreen";
import Page2 from "../screens/Page2";
import Introduce1 from "../screens/Introduce1";

export type RootStackParamList = {
  StartingScreen: undefined;
  Page2: undefined;
  Introduce1: undefined;

  "Page3-2a": undefined;
  "Page3-2b": { name?: string } | undefined;
  "Page1-1": undefined;
  "Page1-2": undefined;
  "Page2-3": undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Page3-2a"
    >
      {/* từ AppStackNavigator cũ */}
      <Stack.Screen name="StartingScreen" component={StartingScreen} />
      <Stack.Screen name="Page2" component={Page2} />
      <Stack.Screen name="Introduce1" component={Introduce1} />

      {/* flow mới */}
      <Stack.Screen name="Page3-2a" component={Page3_2a} />
      <Stack.Screen
        name="Page3-2b"
        component={Page3_2b}
        options={{ presentation: "transparentModal" }}
      />
      <Stack.Screen name="Page1-1" component={Page1_1} />
      <Stack.Screen name="Page1-2" component={Page1_2} />
      <Stack.Screen name="Page2-3" component={Page2_3} />
    </Stack.Navigator>
  );
}
