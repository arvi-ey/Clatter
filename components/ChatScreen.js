import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, ScrollView, ActivityIndicator, } from 'react-native'
import React from 'react'
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from "./Context/Authprovider"
import { colors } from './Theme'
import { MaterialIcons } from '@expo/vector-icons';
import { ContactContext } from './Context/Contactprovider';
import { Font } from '../common/font';
import { MessageContext } from './Context/Messageprovider'
import { supabase } from '../lib/supabase'
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

const ChatScreen = ({ navigation }) => {
    const { user, darkMode, savedContact, uid, downloadImage, } = useContext(AuthContext)
    const { GetuserMessaged, messagedContact, SubscribeToContactChange } = useContext(ContactContext)
    const [data, setData] = useState()
    const { GetLatestMessage } = useContext(MessageContext);

    const image = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

    useEffect(() => {
        GetuserMessaged()
        SubscribeToContactChange()
    }, [])
    useEffect(() => {
        setData(savedContact)
    }, [savedContact])

    // console.log(GetuserMessaged)

    const GotoChat = (data) => {
        navigation.navigate('Chatbox', data);
    };


    const ChatComponent = ({ data }) => {
        const [latestMessage, setLatestMessage] = useState(null);
        const [time, settime] = useState()
        const [emptyMessage, setEmptyMessage] = useState(false)
        const [userImage, setuserImage] = useState()


        const downloadImage = async (filename) => {
            if (!filename) return
            try {
                const { data, error } = await supabase.storage
                    .from('avatars')
                    .download(filename);

                if (error) {
                    console.error('Error downloading image:', error.message);
                    return;
                }
                const fr = new FileReader();
                fr.readAsDataURL(data);
                fr.onload = () => {
                    setuserImage(fr.result)
                };
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        useEffect(() => {
            const fetchLatestMessage = async () => {
                if (data && data.profiles && data.profiles.id) {
                    downloadImage(data.profiles.profile_pic)
                    const message = await GetLatestMessage(data.profiles.id);
                    // console.log(message, `For ${uid}`)
                    if (!message) setEmptyMessage(true)
                    if (message?.content) {
                        setLatestMessage(message?.content);
                        settime(message.time)
                    }
                }
            };
            fetchLatestMessage();
        }, [data]);

        const GetTime = (timestamp) => {
            const timeStampData = Number(timestamp)
            const date = new Date(timeStampData);
            const options = { hour: '2-digit', minute: '2-digit', hour12: true };
            return date.toLocaleTimeString('en-US', options);
        };

        if (!latestMessage || !time) {
            const ColorMOde = darkMode ? 'dark' : 'light'
            return (
                <MotiView
                    transition={{
                        type: 'timing',
                    }}
                    style={{ marginTop: 8, flexDirection: "row", height: 70, padding: 5, gap: 20, alignItems: "center", marginLeft: 10 }}
                >
                    <Skeleton colorMode={ColorMOde} height={60} width={60} radius={'round'} style={{ padding: 5, }} >
                    </Skeleton>
                    <Skeleton colorMode={ColorMOde} style={{ flex: 1, gap: 5 }} >
                        <Skeleton colorMode={ColorMOde} height={30} width={"85%"} style={{ flexDirection: "row", justifyContent: "space-between", borderRadius: 8 }}>
                        </Skeleton>
                        <View style={{ height: 10 }} />
                        <Skeleton colorMode={ColorMOde} height={20} width={"30%"} style={{ flexDirection: "row", justifyContent: "space-between", borderRadius: 8 }}>
                        </Skeleton>
                    </Skeleton>
                </MotiView>
            )
        }

        return (
            !emptyMessage ?
                <TouchableOpacity style={{ marginTop: 8, flexDirection: "row", height: 70, padding: 5, gap: 20, alignItems: "center" }}
                    onPress={() => GotoChat(data)}
                >
                    <View style={{ padding: 5, }} >
                        <Image source={userImage ? { uri: userImage } : image}
                            style={{ height: 55, width: 55, borderRadius: 30, resizeMode: "cover" }}
                        />
                    </View>
                    <View style={{ flex: 1 }} >
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: 19, color: darkMode ? colors.WHITE : colors.BLACK, fontFamily: Font.Regular }}  >{data?.saved_name ? data.saved_name : data?.profiles?.phone ? data.profiles.phone : "No one"}</Text>
                            <Text style={{ marginRight: 10, color: darkMode ? colors.WHITE : colors.BLACK, fontFamily: Font.Regular, fontSize: 12 }} >{time && GetTime(time)}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 15, color: darkMode ? colors.CHARCOLE_DARK : colors.CHAT_DESC, fontFamily: darkMode ? "Ubuntu-Light" : Font.Regular }}>{latestMessage && latestMessage}</Text>
                        </View>
                    </View>

                </TouchableOpacity>
                : null
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
        <View style={{ backgroundColor: darkMode ? colors.BLACK : colors.WHITE, flex: 1, position: "relative" }} >
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