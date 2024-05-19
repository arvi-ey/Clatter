import { StyleSheet, Text, View, Platform, ActivityIndicator, Image } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboardingpage from './components/Onboardingpage';
import Signinpage from './components/Signinpage';
import Register from './components/Register';
import Profile from './components/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Myprofile from './components/Myprofile';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import Editprofile from './components/Editprofile';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [firstLoad, setFirstLoad] = useState(false)
  const [isloggedIn, setIsloggedIn] = useState(false)
  const [isloading, setisLoading] = useState(true)
  const [fontsLoaded, fontError] = useFonts({
    'Ubuntu-Bold': require('./assets/fonts/Ubuntu-Bold.ttf'),
    'Ubuntu-Regular': require('./assets/fonts/Ubuntu-Regular.ttf'),
    'Ubuntu-Medium': require('./assets/fonts/Ubuntu-Medium.ttf'),
    'Ubuntu-Light': require('./assets/fonts/Ubuntu-Light.ttf'),
    'Ubuntu-Regular': require('./assets/fonts/Ubuntu-Regular.ttf'),
  });

  useEffect(() => {
    AppLoaded()
    AsyncStorageData()
    setTimeout(() => {
      setisLoading(false)
    }, 3000)
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

  if (isloading && !fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <Image style={{ height: 300, width: 300, resizeMode: 'contain' }} source={require('./assets/logo.png')} />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <Stack.Screen name="Myprofile" component={Myprofile} options={{ headerShown: false }} />
          <Stack.Screen name="Editprofile" component={Editprofile} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
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
