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
import LottieView from 'lottie-react-native';
import Settings from './Settings';
import EntryPage from './EntryPage';
import Chat from './Chat';

export default function Initialpage() {
    const Stack = createNativeStackNavigator();
    const { firstLoad, session, GetUserOnce, user, uid, loggedIn, } = useContext(AuthContext)
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [newUser, setNewUser] = useState(false)

    useEffect(() => {
        GetUserOnce()
        setTimeout(() => {
            loadFonts()
        }, 1000)
    }, [])

    useEffect(() => {
        setNewUser(firstLoad)
    }, [firstLoad])

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
                <LottieView
                    autoPlay
                    style={{
                        width: 500,
                        height: 500,
                    }}
                    source={require('../assets/logo.json')}
                />
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <StatusBar
                    hidden={false}
                />
                <Stack.Navigator
                    screenOptions={{
                        animationTypeForReplace: 'pop',
                        animationEnabled: Platform.OS === 'android' ? true : true,
                    }}
                >
                    {newUser === false && <Stack.Screen name="Onboarding" component={Onboardingpage} options={{ headerShown: false }} />}
                    {!uid && (
                        <>
                            <Stack.Screen name="Signin" component={Signinpage} options={{ headerShown: false }} />
                            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                        </>
                    )}
                    {
                        loggedIn === false && <Stack.Screen name="Entry" component={EntryPage} options={{ headerShown: false }} />
                    }

                    <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
                    <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
                    <Stack.Screen name="Myprofile" component={Myprofile} options={{ headerShown: false }} />
                    <Stack.Screen name="Editprofile" component={Editprofile} options={{ title: "Edit profile" }} />
                    <Stack.Screen name="ContactList" component={ContactList} options={{ title: "Select contact" }} />
                    <Stack.Screen name="AddContact" component={AddContact} options={{ title: "Add contact" }} />
                    <Stack.Screen name="Chatbox" component={Chatbox} />
                    <Stack.Screen name="Settings" component={Settings} options={{ title: "Account Settings" }} />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
