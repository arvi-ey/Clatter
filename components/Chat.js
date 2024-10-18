import { Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { AuthContext } from "./Context/Authprovider"
import { colors } from './Theme'
import { Font } from '../common/font';
import { MessageContext } from './Context/Messageprovider'
import { supabase } from '../lib/supabase'
import { useNavigation } from '@react-navigation/native';

const Chat = ({ data }) => {
    // console.log(data)
    const { darkMode, uid } = useContext(AuthContext)
    const navigation = useNavigation()
    const { FetchChat } = useContext(MessageContext)
    const image = "https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg";

    const GotoChat = () => {
        navigation.navigate('Chatbox', {
            email: data.email,
            id: data.id,
            saved_name: data.saved_name,
            profile_pic: data.profile_pic,
            number: data.number,
            user_name: data.user_name
        });
    };

    useEffect(() => {
        if (!data) return;

        const subscription = supabase
            .channel('public:message')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'message' }, (payload) => {
                const newData = payload.new;

                if (payload.new.reciver === uid || payload.new.sender === uid) {
                    FetchChat()
                }
            })
            .subscribe();
    }, [data, uid]);


    const GetTime = (timestamp) => {
        const timeStampData = Number(timestamp)
        const date = new Date(timeStampData);
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString('en-US', options);
    };


    return (
        <TouchableOpacity style={{ marginTop: 8, flexDirection: "row", height: 70, padding: 5, gap: 20, alignItems: "center" }}
            onPress={GotoChat}
        >
            <View style={{ padding: 5, }} >
                <Image source={data.profile_image ? { uri: data.profile_image } : { uri: image }}
                    style={{ height: 55, width: 55, borderRadius: 30, resizeMode: "cover" }}
                />
            </View>
            <View style={{ flex: 1 }} >
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 19, color: darkMode ? colors.WHITE : colors.BLACK, fontFamily: Font.Regular }}  >{data?.saved_name ? data.saved_name : data?.number ? data.number : "No one"}</Text>
                    <Text style={{ marginRight: 10, color: darkMode ? colors.WHITE : colors.BLACK, fontFamily: Font.Regular, fontSize: 12 }} >{GetTime(data.time)}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 15, color: darkMode ? colors.CHARCOLE_DARK : colors.CHAT_DESC, fontFamily: darkMode ? "Ubuntu-Light" : Font.Regular }}>{data.content}</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}

export default Chat

