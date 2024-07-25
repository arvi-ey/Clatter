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
    const { user, onlineUser, GetUSerOnce } = useContext(AuthContext)
    const { fetchContact, data } = useContext(ContactContext);
    const [online, setOnline] = useState(null);
    const previousOnlineUser = useRef({});
    useEffect(() => {
        fetchContact();
        GetUSerOnce()
    }, []);
    useEffect(() => {
        let isOnlineChanged = false;
        const currentOnlineUser = {};
        for (let key of Object.keys(onlineUser)) {
            if (key !== user._id) {
                // console.log(onlineUser[key])
                currentOnlineUser[key] = onlineUser[key];
            }
        }

        if (JSON.stringify(previousOnlineUser.current) !== JSON.stringify(currentOnlineUser)) {
            isOnlineChanged = true;
        }

        if (isOnlineChanged) {
            previousOnlineUser.current = currentOnlineUser;
            setOnline(currentOnlineUser);
        }
    }, [onlineUser]);

    console.log("For", user._id, online[value._id])

    const ChatComponent = ({ data }) => {
        return (
            <TouchableOpacity style={{ marginTop: 5, flexDirection: "row", height: 85, padding: 5, gap: 20, alignItems: "center" }}
            >
                <View style={{ padding: 5, }} >
                    <Image source={{ uri: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" }}
                        style={{ height: 60, width: 60, borderRadius: 30, resizeMode: "cover" }}
                    />
                </View>
                <View style={{ flex: 1 }} >
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 19, color: user.dark_mode ? colors.WHITE : colors.BLACK, fontFamily: Font.Regular }}  >{data.saved_name}</Text>
                        {
                            user.hideActiveStatusHome === true ?
                                null :
                                <Text style={{ fontFamily: Font.Medium, fontSize: 15, color: colors.MAIN_COLOR, marginRight: 10 }}>{online && online[data._id] ? "Online" : null}</Text>
                        }
                        {/* <Text style={{ marginRight: 10, color: user.dark_mode ? colors.WHITE : colors.BLACK, fontFamily: "Ubuntu-Regular" }} >{data.time}</Text> */}
                    </View>
                    <View>
                        <Text style={{ fontSize: 15, color: user.dark_mode ? colors.CHARCOLE_DARK : colors.CHAT_DESC, fontFamily: user.dark_mode ? Font.Light : Font.Regular }}>{data.massage}</Text>
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
        <View style={{ backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE, flex: 1, position: "relative" }} >
            <FlatList
                data={data?.userData}
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
        top: 500

    }
})