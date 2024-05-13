import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react';
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
import { useRoute } from '@react-navigation/native';
const Tab = createBottomTabNavigator();




const Profile = () => {


    const route = useRoute()


    // const { uid, email, number, name } = route.params
    // console.log(uid)
    // console.log(email)
    // console.log(number)
    // console.log(name)

    const [darkMode, setdarkMode] = useState(false)


    return (
        <Tab.Navigator screenOptions={{
            headerShown: true,
            tabBarShowLabel: false,
            headerStyle: {
                backgroundColor: colors.WHITE,
                height: 80

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
                fontFamily: "Ubuntu-Regular",
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
                    fontFamily: 'Ubuntu-Medium'
                },
                tabBarIcon: ({ focused }) => (

                    <View style={{ justifyContent: "center", alignItems: "center", }} >
                        <Ionicons name="chatbubbles" size={28} color={focused ? colors.MAIN_COLOR : colors.TAB_ICON} style={{ backgroundColor: focused ? colors.SECONDARY_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50, }} />
                        <Text style={{ color: focused ? colors.MAIN_COLOR : colors.TAB_ICON, fontSize: 17, fontFamily: "Ubuntu-Medium" }} >Chats</Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Story" component={StoryScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: "center", alignItems: "center" }} >
                        <Entypo name="circular-graph" size={28} color={focused ? colors.MAIN_COLOR : colors.TAB_ICON} style={{ backgroundColor: focused ? colors.SECONDARY_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50 }} />
                        <Text style={{ color: focused ? colors.MAIN_COLOR : colors.TAB_ICON, fontSize: 17, fontFamily: "Ubuntu-Medium" }} >Story</Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Calls" component={CallScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: "center", alignItems: "center" }} >
                        <MaterialIcons name="call" size={28} color={focused ? colors.MAIN_COLOR : colors.TAB_ICON} style={{ backgroundColor: focused ? colors.SECONDARY_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50 }} />
                        <Text style={{ color: focused ? colors.MAIN_COLOR : colors.TAB_ICON, fontSize: 17, fontFamily: "Ubuntu-Medium" }} >Calls</Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Myprofile" component={Myprofile} options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: "center", alignItems: "center" }} >
                        <FontAwesome name="user" size={28} color={focused ? colors.MAIN_COLOR : colors.TAB_ICON} style={{ backgroundColor: focused ? colors.SECONDARY_COLOR : null, paddingHorizontal: 18, paddingVertical: 5, borderRadius: 50 }} />
                        <Text style={{ color: focused ? colors.MAIN_COLOR : colors.TAB_ICON, fontSize: 17, fontFamily: "Ubuntu-Medium" }} >Profile</Text>
                    </View>
                )
            }} />
        </Tab.Navigator>
    )
}

export default Profile

const styles = StyleSheet.create({})