import { StyleSheet, Text, View, AppState } from 'react-native'
import React, { useState, useEffect, useContext } from 'react';
import ChatScreen from './ChatScreen';
import CallScreen from './CallScreen';
import StoryScreen from './StoryScreen';
import Myprofile from './Myprofile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from './Theme';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';


const Profile = () => {
    const { GetUserOnce, user, uid, UpdateUser, darkMode, image } = useContext(AuthContext)
    const Tab = createBottomTabNavigator();


    useEffect(() => {
        GetUserOnce()
    }, [])

    useEffect(() => {
        if (uid) {
            UpdateUser(uid, { active: true });
        }
        const handleAppStateChange = (nextAppState) => {

            if (nextAppState === 'background') {
                UpdateUser(uid, { active: false, last_seen: Date.now() });
            }
            if (nextAppState === 'active') {
                UpdateUser(uid, { active: true });
            }
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, [uid])

    return (
        <Tab.Navigator screenOptions={{
            headerShown: true,
            tabBarShowLabel: false,
            headerStyle: {
                backgroundColor: darkMode ? colors.BLACK : colors.WHITE,
                height: 80
            },
            tabBarStyle: {
                backgroundColor: darkMode ? colors.BLACK : colors.TAB_HEADER,
                shadowColor: colors.WHITE,
                elevation: 0,
                position: 'absolute',
                alignSelf: 'center',
                left: 0,
                right: 0,
                bottom: 0,
                height: 75
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontFamily: Font.Regular,
                marginBottom: 3
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray'

        }} >
            <Tab.Screen name="Chat" component={ChatScreen} options={{
                title: 'Clatter',
                headerTintColor: darkMode ? colors.WHITE : colors.BLACK,
                headerRight: () => (
                    <View style={{ flexDirection: "row", marginRight: 30, gap: 25 }} >
                        <Feather name="camera" size={28} color={darkMode ? colors.WHITE : colors.BLACK} />
                        <MaterialIcons name="qr-code-scanner" size={28} color={darkMode ? colors.WHITE : colors.BLACK} />
                        {/* <Ionicons name="search-outline" size={28} color={darkMode ? colors.WHITE : colors.BLACK} /> */}
                    </View>
                ),
                headerTitleStyle: {
                    fontSize: 30,
                    fontFamily: Font.Medium
                },
                tabBarIcon: ({ focused }) => (

                    <View style={{ justifyContent: "center", alignItems: "center", }} >
                        <Ionicons name="chatbubbles-outline" size={30} color={darkMode ? colors.WHITE : (!darkMode && focused) ? colors.WHITE : colors.BLACK} style={{ backgroundColor: focused ? colors.MAIN_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50, }} />
                        <Text style={{ color: darkMode ? colors.WHITE : colors.TAB_ICON, fontSize: 17, fontFamily: Font.Medium }} >Chats</Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Story" component={StoryScreen} options={{
                headerTitleStyle: {
                    fontSize: 30,
                    fontFamily: Font.Regular
                },
                headerStyle: {
                    backgroundColor: darkMode ? colors.BLACK : colors.WHITE,
                    height: 60
                },
                headerTintColor: darkMode ? colors.WHITE : colors.BLACK,
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: "center", alignItems: "center" }} >
                        <Entypo name="circular-graph" size={28} color={darkMode ? colors.WHITE : (!darkMode && focused) ? colors.WHITE : colors.BLACK} style={{ backgroundColor: focused ? colors.MAIN_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50, }} />
                        <Text style={{ color: darkMode ? colors.WHITE : colors.TAB_ICON, fontSize: 17, fontFamily: Font.Medium }} >Story</Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Calls" component={CallScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: "center", alignItems: "center" }} >
                        <MaterialIcons name="call" size={28} color={darkMode ? colors.WHITE : (!darkMode && focused) ? colors.WHITE : colors.BLACK} style={{ backgroundColor: focused ? colors.MAIN_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50, }} />
                        <Text style={{ color: darkMode ? colors.WHITE : colors.TAB_ICON, fontSize: 17, fontFamily: Font.Medium }} >Calls</Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Myprofile" component={Myprofile} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: "center", alignItems: "center" }} >
                        <FontAwesome name="user" size={28} color={darkMode ? colors.WHITE : (!darkMode && focused) ? colors.WHITE : colors.BLACK} style={{ backgroundColor: focused ? colors.MAIN_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50, }} />
                        <Text style={{ color: darkMode ? colors.WHITE : colors.TAB_ICON, fontSize: 17, fontFamily: Font.Medium }} >Profile</Text>
                    </View>
                )
            }} />
        </Tab.Navigator>
    )
}

export default Profile

const styles = StyleSheet.create({})