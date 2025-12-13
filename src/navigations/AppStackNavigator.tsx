// src/navigation/StartingStackNav.tsx (thêm FamousChefsScreen)

import { createStackNavigator } from "@react-navigation/stack";
import StartingScreen from "../screens/StartingScreen";
import Page2 from "../screens/Page2";
import Introduce1 from "../screens/Introduce1";
import HomeScreen from "../screens/HomeScreen";
import NotificationScreen from "../screens/NotificationScreen";
import FamousChefsScreen from "../screens/FamousChefsScreen";

const Stack = createStackNavigator();

export function StartingStackNav() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Starting" component={StartingScreen} />
      <Stack.Screen name="Page2" component={Page2} />
      <Stack.Screen name="Introduce1" component={Introduce1} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="FamousChefs" component={FamousChefsScreen} />
    </Stack.Navigator>
  );
}
