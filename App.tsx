import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppStackNavigator } from './src/navigations/AppStackNavigator';
import { 
  useFonts, 
  RobotoSlab_400Regular, 
  RobotoSlab_500Medium, 
  RobotoSlab_700Bold 
} from '@expo-google-fonts/roboto-slab';

import { AppFonts } from './src/styles/fonts'; 

export default function App() {
  const [fontsLoaded] = useFonts({
    [AppFonts.RobotoSlabRegular]: RobotoSlab_400Regular,
    [AppFonts.RobotoSlabMedium]: RobotoSlab_500Medium,
    [AppFonts.RobotoSlabBold]: RobotoSlab_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppStackNavigator/>
    </NavigationContainer>
  );
}