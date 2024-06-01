import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { useContext } from 'react';
import { ModeContext } from './Context/Modeprovider';
import { colors } from './Theme'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const ChatScreen = () => {
    const { darkMode } = useContext(ModeContext)

    const Navigation = useNavigation()
    const data = [
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
        {
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            name: "Maria Lu",
            massage: "Hey what are you doing",
            time: "10:54"
        },
    ]


    const ChatComponent = ({ data }) => {
        return (
            <TouchableOpacity style={{ marginTop: 5, flexDirection: "row", height: 85, padding: 5, gap: 20, alignItems: "center" }}
            // onPress={LogOut}
            >
                <View style={{ padding: 5, }} >
                    <Image source={{ uri: data.image }}
                        style={{ height: 60, width: 60, borderRadius: 30, resizeMode: "cover" }}
                    />
                </View>
                <View style={{ flex: 1 }} >
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 19, color: darkMode ? colors.WHITE : colors.BLACK, fontFamily: "Ubuntu-Regular" }}  >{data.name}</Text>
                        <Text style={{ marginRight: 10, color: darkMode ? colors.WHITE : colors.BLACK, fontFamily: "Ubuntu-Regular" }} >{data.time}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 15, color: darkMode ? colors.CHAT_DESC_DARK : colors.CHAT_DESC, fontFamily: darkMode ? "Ubuntu-Light" : "Ubuntu-Regular" }}>{data.massage}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }
    return (
        <View style={{ backgroundColor: darkMode ? colors.BLACK : colors.WHITE, flex: 1 }} >
            <FlatList
                data={data}
                renderItem={({ item }) => <ChatComponent data={item} />}
                keyExtractor={(item, index) => index}

            />

        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({})