// src/navigations/AppStackNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../type/types";

import HomeScreen from "../screens/HomeScreen";
import CommunityScreen from "../screens/CommunityScreen";
import FeaturedRecipesScreen from "../screens/FeaturedRecipesScreen";
import MyRecipesScreen from "../screens/MyRecipesScreen";

import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileSavoryScreen from "../screens/ProfileSavoryScreen";
import ProfileVegetarianScreen from "../screens/ProfileVegetarianScreen";
import ProfileShareQrScreen from "../screens/ProfileShareQrScreen";
import ProfileFollowingScreen from "../screens/ProfileFollowingScreen";
import ProfileFollowersScreen from "../screens/ProfileFollowersScreen";

import EditProfileScreen from "../screens/EditProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen";
import SupportCenterScreen from "../screens/SupportCenterScreen";
import LanguageScreen from "../screens/LanguageScreen";

const Stack = createStackNavigator<RootStackParamList>();

export function AppStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
      <Stack.Screen name="FeaturedRecipesScreen" component={FeaturedRecipesScreen} />
      <Stack.Screen name="MyRecipesScreen" component={MyRecipesScreen} />

      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />

      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ProfileSavoryScreen" component={ProfileSavoryScreen} />
      <Stack.Screen name="ProfileVegetarianScreen" component={ProfileVegetarianScreen} />
      <Stack.Screen name="ProfileShareQrScreen" component={ProfileShareQrScreen} />
      <Stack.Screen name="ProfileFollowingScreen" component={ProfileFollowingScreen} />
      <Stack.Screen name="ProfileFollowersScreen" component={ProfileFollowersScreen} />

      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} />
      <Stack.Screen name="SupportCenterScreen" component={SupportCenterScreen} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
    </Stack.Navigator>
  );
}
