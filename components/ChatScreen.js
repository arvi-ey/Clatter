import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert } from 'react-native'
import React from 'react'
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from "./Context/Authprovider"
import { colors } from './Theme'
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { ContactContext } from './Context/Contactprovider';
import { Font } from '../common/font';

const ChatScreen = ({ navigation }) => {
    const { user, GetUserOnce, UpdateUser } = useContext(AuthContext)
    const [darkMode, setDarkMode] = useState()

    // useEffect(() => {
    //     GetUserOnce()
    // }, [])
    console.log(user)
    useEffect(() => {
        if (user) {
            UpdateUser(user.id, { loggedIn: true })
            // setDarkMode(user?.dark_mode)
        }

    }, [user])
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
                        <Text style={{ fontSize: 15, color: darkMode ? colors.CHARCOLE_DARK : colors.CHAT_DESC, fontFamily: user.dark_mode ? "Ubuntu-Light" : "Ubuntu-Regular" }}>{data.massage}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    const AddChat = () => {
        navigation.navigate("ContactList")
    }


    const AddContact = () => {
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.addContact} onPress={AddChat} >
                <MaterialIcons name="chat" size={30} color={colors.WHITE} />
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ backgroundColor: colors.WHITE, flex: 1, position: "relative" }} >
            <FlatList
                data={data}
                renderItem={({ item }) => <ChatComponent data={item} />}
                keyExtractor={(item, index) => index}
            />
            {AddContact()}
        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    addContact: {
        position: "absolute",
        backgroundColor: colors.MAIN_COLOR,
        padding: 20,
        right: 15,
        borderRadius: 25,
        top: 550

    }
})