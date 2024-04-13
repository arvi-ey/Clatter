import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboardingpage from './components/Onboardingpage';
import HomeScreen from './components/HomeScreen';
import Signinpage from './components/Signinpage';
import Register from './components/Register';
export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animationTypeForReplace: 'pop',
          animationEnabled: Platform.OS == 'android' ? true : true,
        }}
      >
        <Stack.Screen name="Onboarding" component={Onboardingpage} options={{ headerShown: false }} />
        <Stack.Screen name="Signin" component={Signinpage} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
