import { NavigationContainer } from '@react-navigation/native';
import { StartingStackNav } from './src/navigations/AppStackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <StartingStackNav/>
    </NavigationContainer>
  );
}


