import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppStackNavigator from "./src/navigations/AppStackNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AppStackNavigator />
    </NavigationContainer>
  );
}
