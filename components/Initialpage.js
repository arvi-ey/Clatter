import { View, Platform, Image, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboardingpage from './Onboardingpage';
import Signinpage from './Signinpage';
import Register from './Register';
import Profile from './Profile';
import { useEffect, useState, useContext } from 'react';
import Myprofile from './Myprofile';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Editprofile from './Editprofile';
import { AuthContext } from './Context/Authprovider';
import * as Font from 'expo-font';
import AddContact from './AddContact';
import ContactList from './ContactList';
import Chatbox from './Chatbox';

export default function Initialpage() {
    const Stack = createNativeStackNavigator();
    const { GetUSerOnce, loggedIn, firstLoad } = useContext(AuthContext)
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        GetUSerOnce()
        setTimeout(() => {
            loadFonts()
        }, 1000)
    }, [])

    const loadFonts = async () => {
        await Font.loadAsync({
            'Ubuntu-Bold': require('../assets/fonts/Ubuntu-Bold.ttf'),
            'Ubuntu-Regular': require('../assets/fonts/Ubuntu-Regular.ttf'),
            'Ubuntu-Medium': require('../assets/fonts/Ubuntu-Medium.ttf'),
            'Ubuntu-Light': require('../assets/fonts/Ubuntu-Light.ttf'),
            'Ubuntu-Regular': require('../assets/fonts/Ubuntu-Regular.ttf'),
        });
        setFontsLoaded(true);
    };

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Image style={{ height: 300, width: 300, resizeMode: 'contain' }} source={require('../assets/logo.png')} />
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <StatusBar />
                <Stack.Navigator
                    screenOptions={{
                        animationTypeForReplace: 'pop',
                        animationEnabled: Platform.OS == 'android' ? true : true,
                    }}
                >
                    {firstLoad === false && <Stack.Screen name="Onboarding" component={Onboardingpage} options={{ headerShown: false }} />}
                    {loggedIn === false &&
                        <>
                            <Stack.Screen name="Signin" component={Signinpage} options={{ headerShown: false }} />
                            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                        </>
                    }
                    <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
                    <Stack.Screen name="Myprofile" component={Myprofile} options={{ headerShown: false }} />
                    <Stack.Screen name="Editprofile" component={Editprofile} options={{ title: "Edit profile" }} />
                    <Stack.Screen name="ContactList" component={ContactList} options={{ title: "Select contact" }} />
                    <Stack.Screen name="AddContact" component={AddContact} options={{ title: "Add contact" }} />
                    <Stack.Screen name="Chatbox" component={Chatbox} />

                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

