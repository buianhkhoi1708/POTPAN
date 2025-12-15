import { createStackNavigator } from '@react-navigation/stack';
import StartingScreen from '../screens/StartingScreen';

import Page2 from '../screens/Page2';
import Introduce1 from '../screens/Introduce1';

const Stack = createStackNavigator();

export function StartingStackNav() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StartingScreen" component={StartingScreen} />
      <Stack.Screen name="Page2" component={Page2} />
      <Stack.Screen name="Introduce1" component={Introduce1} />
    </Stack.Navigator>
  );
}