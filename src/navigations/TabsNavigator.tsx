// src/navigation/TabsNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { COLORS } from "../styles/color";
import TabIcon from "../components/TabIcon";
import PlaceholderScreen from "../screens/PlaceholderScreen";
import CategoriesScreen from "../screens/CategoriesScreen";

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Categories: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: s.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        children={() => <PlaceholderScreen title="Home" />}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="home-outline" /> }}
      />
      <Tab.Screen
        name="Explore"
        children={() => <PlaceholderScreen title="Explore" />}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="globe-outline" /> }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="layers-outline" /> }}
      />
      <Tab.Screen
        name="Profile"
        children={() => <PlaceholderScreen title="Profile" />}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="person-outline" /> }}
      />
    </Tab.Navigator>
  );
}

const s = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 18,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.CORAL,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
});
