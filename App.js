import { StyleSheet, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboardingpage from './components/Onboardingpage';
import Signinpage from './components/Signinpage';
import Register from './components/Register';
import Profile from './components/Profile';
import FirstScreen from './components/FirstScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [firstLoad, setFirstLoad] = useState(false)
  const [isloggedIn, setIsloggedIn] = useState(false)


  useEffect(() => {
    AppLoaded()
    AsyncStorageData()
  }, [])

  const AppLoaded = async () => {
    const value = await AsyncStorage.getItem("loaded")
    if (value !== null) setFirstLoad(true)
    else setFirstLoad(false)
  }

  const AsyncStorageData = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) setIsloggedIn(true)

    }
    catch (err) {
      console.log(err)
    }
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animationTypeForReplace: 'pop',
          animationEnabled: Platform.OS == 'android' ? true : true,
        }}
      >
        {firstLoad === false && <Stack.Screen name="Onboarding" component={Onboardingpage} options={{ headerShown: false }} />}
        {isloggedIn === false &&
          <>
            <Stack.Screen name="Signin" component={Signinpage} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </>
        }
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
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
