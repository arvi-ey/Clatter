import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { useContext } from 'react';
import { AuthContext } from "./Context/Authprovider"
import { colors } from './Theme'
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
const ChatScreen = () => {
    const { user } = useContext(AuthContext)

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
                        <Text style={{ fontSize: 19, color: user.dark_mode ? colors.WHITE : colors.BLACK, fontFamily: "Ubuntu-Regular" }}  >{data.name}</Text>
                        <Text style={{ marginRight: 10, color: user.dark_mode ? colors.WHITE : colors.BLACK, fontFamily: "Ubuntu-Regular" }} >{data.time}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 15, color: user.dark_mode ? colors.CHARCOLE_DARK : colors.CHAT_DESC, fontFamily: user.dark_mode ? "Ubuntu-Light" : "Ubuntu-Regular" }}>{data.massage}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    const AddChat = () => {

    }


    const AddContact = () => {
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.addContact} onPress={AddChat} >
                <MaterialIcons name="chat" size={30} color={colors.WHITE} />
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE, flex: 1, position: "relative" }} >
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