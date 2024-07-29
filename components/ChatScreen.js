import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert } from 'react-native'
import React from 'react'
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from "./Context/Authprovider"
import { colors } from './Theme'
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { ContactContext } from './Context/Contactprovider';
import { Font } from '../common/font';
import axios from 'axios';
// import io from 'socket.io-client';
const IP = `http://192.168.29.222:5000`;

const ChatScreen = ({ navigation }) => {
    const { user, onlineUser, GetUSerOnce, lastMessage } = useContext(AuthContext)
    const { fetchContact, data } = useContext(ContactContext);
    const [online, setOnline] = useState(null);
    // const socketRef = useRef(null);
    const previousOnlineUser = useRef({});
    // socketRef.current = io(IP);
    useEffect(() => {
        fetchContact();
        GetUSerOnce()
    }, []);

    useEffect(() => {
        let isOnlineChanged = false;
        const currentOnlineUser = {};
        if (onlineUser) {

            for (let key of Object.keys(onlineUser)) {
                if (key !== user._id) {
                    // console.log(onlineUser[key])
                    currentOnlineUser[key] = onlineUser[key];
                }
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


    const ChatComponent = ({ data }) => {
        const [messages, setMessages] = useState([]);
        const [lastmesssagetime, setlastmessagetime] = useState()
        const [newMessage, setNewMessage] = useState()

        useEffect(() => {
            if (lastMessage?.recipient === data._id) {
                console.log(lastMessage)
                setNewMessage(lastMessage)
            }
        }, [lastMessage])


        useEffect(() => {
            getMessage();
        }, []);

        const GetTime = (timestamp) => {
            const date = new Date(timestamp);
            const options = { hour: '2-digit', minute: '2-digit', hour12: true };
            return date.toLocaleTimeString('en-US', options);
        };
        const getMessage = async () => {
            console.log("THis is Hook")
            const userId1 = user._id;
            const userId2 = data._id;
            try {
                const response = await axios.get(`${IP}/massage`, {
                    params: { userId1, userId2 }
                });
                setMessages(response.data);
                if (response.data.length > 0) {
                    setlastmessagetime(response.data[response.data.length - 1].timestamp);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                throw error;
            }
        };


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
                        {
                            <Text style={{ marginRight: 10, color: user.dark_mode ? colors.WHITE : colors.BLACK, fontFamily: "Ubuntu-Regular" }} >{newMessage && newMessage?.timestamp ? GetTime(newMessage?.timestamp) : lastmesssagetime && GetTime(lastmesssagetime)}</Text>
                        }
                    </View>
                    <View>
                        <Text style={{ fontSize: 15, color: user.dark_mode ? colors.CHARCOLE_DARK : colors.CHAT_DESC, fontFamily: user.dark_mode ? Font.Light : Font.Regular }}>{newMessage?.content ? newMessage.content : messages[messages.length - 1]?.content}</Text>
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