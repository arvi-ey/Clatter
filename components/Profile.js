import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react';
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
import { AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();




const Profile = () => {
    // const auth = FIREBASE_AUTH
    // console.log(auth.currentUser.uid)
    // const screenOptions = {

    // }

    const [darkMode, setdarkMode] = useState(false)


    return (
        <Tab.Navigator screenOptions={{
            headerShown: true,
            tabBarShowLabel: false,
            headerStyle: {
                backgroundColor: colors.WHITE,
                height: 80,

            },
            tabBarStyle: {
                backgroundColor: colors.TAB_HEADER,
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
                marginBottom: 3
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray'

        }} >
            <Tab.Screen name="Chat" component={ChatScreen} options={{
                title: 'Clatter',
                headerTintColor: colors.MAIN_COLOR,
                headerRight: () => (
                    <View style={{ flexDirection: "row", marginRight: 10, gap: 25 }} >
                        <Feather name="camera" size={28} color="black" />
                        <Ionicons name="search-outline" size={28} color="black" />
                        <FontAwesome name={darkMode ? "toggle-on" : "toggle-off"} size={30} color="black" onPress={() => setdarkMode(!darkMode)} />
                    </View>
                ),
                headerTitleStyle: {
                    fontSize: 30,
                    fontWeight: "900"
                },
                tabBarIcon: ({ focused }) => (

                    <View style={{ justifyContent: "center", alignItems: "center", }} >
                        <Ionicons name="chatbubbles" size={28} color={focused ? colors.MAIN_COLOR : colors.TAB_ICON} style={{ backgroundColor: focused ? colors.SECONDARY_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50, }} />
                        <Text style={{ color: focused ? colors.MAIN_COLOR : colors.TAB_ICON, fontSize: 17 }} >Chats</Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Story" component={StoryScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: "center", alignItems: "center" }} >
                        <Entypo name="circular-graph" size={28} color={focused ? colors.MAIN_COLOR : colors.TAB_ICON} style={{ backgroundColor: focused ? colors.SECONDARY_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50 }} />
                        <Text style={{ color: focused ? colors.MAIN_COLOR : colors.TAB_ICON, fontSize: 17 }} >Story</Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Calls" component={CallScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: "center", alignItems: "center" }} >
                        <MaterialIcons name="call" size={28} color={focused ? colors.MAIN_COLOR : colors.TAB_ICON} style={{ backgroundColor: focused ? colors.SECONDARY_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50 }} />
                        <Text style={{ color: focused ? colors.MAIN_COLOR : colors.TAB_ICON, fontSize: 17 }} >Calls</Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Myprofile" component={Myprofile} options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: "center", alignItems: "center" }} >
                        <FontAwesome name="user" size={28} color={focused ? colors.MAIN_COLOR : colors.TAB_ICON} style={{ backgroundColor: focused ? colors.SECONDARY_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50 }} />
                        <Text style={{ color: focused ? colors.MAIN_COLOR : colors.TAB_ICON, fontSize: 17 }} >Profile</Text>
                    </View>
                )
            }} />
        </Tab.Navigator>
    )
}

export default Profile

const styles = StyleSheet.create({})