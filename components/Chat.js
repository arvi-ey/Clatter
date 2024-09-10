import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, ScrollView, ActivityIndicator, TextInput, Dimensions, } from 'react-native'
import React from 'react'
import { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { AuthContext } from "./Context/Authprovider"
import { colors } from './Theme'
import { MaterialIcons } from '@expo/vector-icons';
import { ContactContext } from './Context/Contactprovider';
import { Font } from '../common/font';
import { MessageContext } from './Context/Messageprovider'
import { supabase } from '../lib/supabase'
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
const { height, width } = Dimensions.get("window");
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Chat = ({data}) => {
    const { user, darkMode, savedContact, uid} = useContext(AuthContext)
    const { GetuserMessaged, messagedContact } = useContext(ContactContext)
    const [searchContact, setSearchContact] = useState("")
    const [loading, setLoading] = useState(true)

    const [latestMessage, setLatestMessage] = useState(null);
        const [time, settime] = useState()
        const [emptyMessage, setEmptyMessage] = useState(false)
        const [userImage, setuserImage] = useState()
        const [userInfo, setUserInfo] = useState()
        const previousMessageRef = useRef(null);
        const navigation = useNavigation()
        const {showdata,setShowdata,Try} = useContext(MessageContext)

        const image = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
        const GotoChat = (data) => {
            navigation.navigate('Chatbox',data );
        };
        
    function SetValue(arr, value) {
        // Check if the value is already in the array
        if (arr[0] === value) {
            return arr; // Do nothing and return the array as is
        }
        const index = arr.indexOf(value);

        if (index !== -1) {
            // If found, remove it from the current position
            arr.splice(index, 1);
        }

        // Add the value to the beginning of the array
        arr.unshift(value);

        return arr;
    }
    



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

        const fetchUserData = async (data) => {
            if (data) {
                downloadImage(data)
            }
        }

        useEffect(() => {
            fetchUserData(data.profile_pic)
        }, [data])

        useEffect(() => {
            if (!data) return;

            const subscription = supabase
                .channel('public:message')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'message' }, (payload) => {
                    const newData = payload.new;

                    if (payload.new.reciver === uid || payload.new.sender === uid) {
                        // setShowdata((prevData) => {
                        //     // Create a new array and update it with the new value
                        //     if (payload.new.reciver === uid) {
                        //         return SetValue([...prevData], payload.new.sender);
                        //     }
                        //     if (payload.new.sender === uid) {
                        //         return SetValue([...prevData], payload.new.reciver);
                        //     }
                        //     return prevData; // If no changes are needed, return the previous state
                        // });
                        Try()
                    }
                })
                .subscribe();
        }, [data, uid]);



        const GetLatestMessage = async (uid, data) => {
            if (data) {
                try {
                    let { data: messages, error } = await supabase
                        .from('message')
                        .select('*')
                        .or(`and(sender.eq.${uid},reciver.eq.${data}),and(sender.eq.${data},reciver.eq.${uid})`)
                        .order('time', { ascending: false })
                        .limit(1);

                    if (error) throw error;
                    if (messages[0]?.content !== previousMessageRef.current) {
                        setLatestMessage(messages[0]?.content);
                        settime(messages[0].time);
                        previousMessageRef.current = messages[0]?.content; // Update the ref with the new message
                    }
                } catch (error) {
                    console.log('Error fetching the latest message:', error);
                    return null;
                }
            }
            return null
        };


        const GetTime = (timestamp) => {
            const timeStampData = Number(timestamp)
            const date = new Date(timeStampData);
            const options = { hour: '2-digit', minute: '2-digit', hour12: true };
            return date.toLocaleTimeString('en-US', options);
        };

        if (!data) {
            return (
                <TouchableOpacity style={{ marginTop: 8, flexDirection: "row", height: 70, padding: 5, gap: 20, alignItems: "center", marginLeft: 10 }}
                >
                    <View style={{ padding: 5, backgroundColor: darkMode ? colors.SKELETON_BG_DARK : colors.SKELETON_BG, height: 60, width: 60, borderRadius: 30 }} >
                    </View>
                    <View style={{ flex: 1, gap: 5 }} >
                        <View style={{ width: "90%", height: 20, flexDirection: "row", justifyContent: "space-between", backgroundColor: darkMode ? colors.SKELETON_BG_DARK : colors.SKELETON_BG, borderRadius: 8 }}>
                        </View>
                        <View style={{ width: "30%", height: 20, flexDirection: "row", justifyContent: "space-between", backgroundColor: darkMode ? colors.SKELETON_BG_DARK : colors.SKELETON_BG, borderRadius: 8 }}>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
  return (
    !emptyMessage ?
        <TouchableOpacity style={{ marginTop: 8, flexDirection: "row", height: 70, padding: 5, gap: 20, alignItems: "center" }}
            onPress={() => GotoChat(userInfo, userImage)}
        >
            <View style={{ padding: 5, }} >
                <Image source={userImage ? { uri: userImage } : image}
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
        : null
)
}

export default  Chat

const styles = StyleSheet.create({})