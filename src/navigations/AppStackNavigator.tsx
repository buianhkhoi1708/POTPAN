import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// --- IMPORT SCREENS ---
import StartingScreen from "../screens/StartingScreen"; 
import IntroduceScreen from "../screens/IntroduceScreen";
import Introduce1Screen from "../screens/Introduce1Screen";
import Introduce2Screen from "../screens/Introduce2Screen";
import Introduce3Screen from "../screens/Introduce3Screen";
import Introduce4Screen from "../screens/Introduce4Screen";
import LoginScreen from "../screens/AuthScreens/LoginScreen";
import SigninScreen from "../screens/AuthScreens/SigninScreen";

// Main Screens
import HomeScreen from "../screens/HomeScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen";
import SupportCenterScreen from "../screens/SupportCenterScreen";
import LanguageScreen from "../screens/LanguageScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import SearchResultScreen from "../screens/SearchResultScreen";
import ChefProfileScreen from "../screens/ChefProfileScreen";
import FollowScreen from "../screens/FollowScreen";
import CreateRecipeScreen from "../screens/CreateRecipeScreen";
import ReviewScreen from "../screens/ReviewScreen";
import CollectionDetailScreen from "../screens/CollectionDetailScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import CategoryDetailScreen from "../screens/CategoryDetailScreen";
import CommunityScreen from "../screens/CommunityScreen";
import FamousChefsScreen from "../screens/FamousChefsScreen";
import AdminDashboardScreen from "../screens/AdminDashBoardScreen";

// --- IMPORT TYPES & STORE ---
import { RootStackParamList } from "../type/types";
import { useAuthStore } from "../store/useAuthStore";

const Stack = createStackNavigator<RootStackParamList>();

// --- 1. AUTH STACK ---
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="IntroduceScreen" component={IntroduceScreen} />
      <Stack.Screen name="Introduce1Screen" component={Introduce1Screen} />
      <Stack.Screen name="Introduce2Screen" component={Introduce2Screen} />
      <Stack.Screen name="Introduce3Screen" component={Introduce3Screen} />
      <Stack.Screen name="Introduce4Screen" component={Introduce4Screen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SigninScreen" component={SigninScreen} />
    </Stack.Navigator>
  );
}

// --- 2. MAIN STACK ---
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} />
      <Stack.Screen name="SupportCenterScreen" component={SupportCenterScreen} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
      <Stack.Screen name="RecipeDetailScreen" component={RecipeDetailScreen} />
      <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />
      <Stack.Screen name="ChefProfileScreen" component={ChefProfileScreen} />
      <Stack.Screen name="FollowScreen" component={FollowScreen} />
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
      <Stack.Screen name="CreateRecipeScreen" component={CreateRecipeScreen} />
      <Stack.Screen name="CollectionDetailScreen" component={CollectionDetailScreen} />
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
      <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen} />
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
      <Stack.Screen name="FamousChefsScreen" component={FamousChefsScreen} />
      <Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} />










    </Stack.Navigator>
  );
}

// --- 3. ROOT NAVIGATOR ---
export function AppNavigator() {
  const { user, checkSession } = useAuthStore();
  
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    const check = async () => {
      await checkSession();
    };
    check();


    const timer = setTimeout(() => {
      setIsShowSplash(false);
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  if (isShowSplash) {
    return <StartingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}