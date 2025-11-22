import { createStackNavigator } from '@react-navigation/stack';
import StartingScreen from '../screens/StartingScreen';
import Intro1Screen from '../screens/Intro1Screen';

const Stack = createStackNavigator();

export function StartingStackNav() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StartingScreen" component={StartingScreen} />
      <Stack.Screen name="Intro1Screen" component={Intro1Screen} />
    </Stack.Navigator>
  );
}