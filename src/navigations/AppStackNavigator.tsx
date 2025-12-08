import { createStackNavigator } from '@react-navigation/stack';
import StartingScreen from '../screens/StartingScreen';

import Page2 from '../screens/Page2';
import Introduce1 from '../screens/Introduce1';
import HomeScreen from '../screens/HomeScreen'

const Stack = createStackNavigator();

export function StartingStackNav() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}