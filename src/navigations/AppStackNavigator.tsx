// src/navigations/AppStackNavigator.tsx

import { createStackNavigator } from "@react-navigation/stack";

import StartingScreen from "../screens/StartingScreen";
import Page2 from "../screens/Page2";
import Introduce1 from "../screens/Introduce1";
import HomeScreen from "../screens/HomeScreen";
import NotificationScreen from "../screens/NotificationScreen";
import FamousChefsScreen from "../screens/FamousChefsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";

import SupportCenterScreen from "../screens/SupportCenterScreen";
import LanguageScreen from "../screens/LanguageScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen";

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

      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />

      <Stack.Screen name="SupportCenter" component={SupportCenterScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
    </Stack.Navigator>
  );
}
