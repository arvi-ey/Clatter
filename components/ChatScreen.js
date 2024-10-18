import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, ScrollView, ActivityIndicator, TextInput, Dimensions, Platform, } from 'react-native'
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
import { isLoading } from 'expo-font';
import Chat from './Chat';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});


const ChatScreen = ({ navigation }) => {
    const { darkMode, uid, UpdateUser } = useContext(AuthContext)
    const { GetuserMessaged, } = useContext(ContactContext)
    const { FetchChat, getvalue } = useContext(MessageContext)
    const [data, setData] = useState()
    const [searchContact, setSearchContact] = useState("")
    const [loading, setLoading] = useState(true)

    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState([]);
    const [notification, setNotification] = useState();
    const notificationListener = useRef();
    const responseListener = useRef();


    useEffect(() => {
        SubscribeToContactChange()
        SubscribeToMessage()
        GetuserMessaged()
        FetchChat()
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    useEffect(() => {
        const ConfigurePushNotification = async () => {
            const { status: permissionStatus } = await Notifications.getPermissionsAsync()
            if (permissionStatus !== "granted") {
                const { status: Permissionrecived } = await Notifications.requestPermissionsAsync()
                if (Permissionrecived !== "granted") {
                    Alert.alert("Permission required")
                    return
                }
            }
            try {
                const token = await Notifications.getExpoPushTokenAsync()
                if (token) setExpoPushToken(token)
                if (Platform.OS === "android") {
                    Notifications.setNotificationChannelAsync('default', {
                        name: "default",
                        importance: Notifications.AndroidImportance.DEFAULT
                    })
                }
            }
            catch (error) {

            }
        };
        ConfigurePushNotification();
    }, []);


    useEffect(() => {
        UpdateExpoToken()
    }, [expoPushToken])
    const UpdateExpoToken = async () => {
        await UpdateUser(uid, { user_token: expoPushToken.data })
    }


    const SubscribeToContactChange = () => {
        const subscription = supabase
            .channel('public:Savedcontact')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Savedcontact' }, (payload) => {

                if (payload.new && payload.new.user_id === uid) {
                    FetchChat()
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    };

    const SubscribeToMessage = () => {
        const subscription = supabase
            .channel('public:message')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'message' }, (payload) => {
                if (payload.new.reciver === uid || payload.new.sender === uid) {
                    FetchChat()
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    };

    useEffect(() => {
        setData(getvalue)
    }, [getvalue])

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

    const SearchContact = (text) => {
        setSearchContact(text)
    }

    const FilteredContact = data?.filter(value =>
        value?.saved_name?.toLowerCase().includes(searchContact?.toLowerCase()) || value?.number?.toLowerCase().includes(searchContact?.toLowerCase())
    )

    const Loading = () => {
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
        <View style={{ backgroundColor: darkMode ? colors.BLACK : colors.WHITE, flex: 1, position: "relative" }} >
            <View style={[{ width, justifyContent: 'center', alignItems: 'center', marginTop: 5 }, styles.searchBarStyle]} >
                <View style={[styles.InputBox, { backgroundColor: darkMode ? colors.SEARCH_BG_DARK : colors.SEARCH_BG }]}>
                    <Ionicons name="search-outline" size={28} color={darkMode ? colors.CHARCOLE_DARK : colors.SEARCH_TEXT} style={{ marginLeft: 10 }} />
                    <TextInput
                        placeholder="search..."
                        placeholderTextColor={darkMode ? colors.CHARCOLE_DARK : colors.SEARCH_TEXT}
                        onChangeText={SearchContact}
                        style={[styles.InputStyle, { fontFamily: Font.Medium, fontSize: 15, color: darkMode ? colors.CHARCOLE_DARK : colors.SEARCH_TEXT }]} />
                </View>
            </View>
            {
                loading ?
                    <FlatList
                        data={data}
                        renderItem={({ item }) => <Loading data={item} />}
                        keyExtractor={(item, index) => index}
                    />
                    :
                    <FlatList
                        data={FilteredContact}
                        renderItem={({ item }) => <Chat data={item} />}
                        keyExtractor={(item, index) => index}
                    />
            }
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
    },
    searchBarStyle: {
        height: 52,
        borderRadius: 30,
    },
    InputBox: {
        width: "95%",
        height: "100%",
        backgroundColor: "blue",
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        justifyContent: "space-around"
    },
    InputStyle: {
        width: "90%",
        borderRadius: 25,
        height: "100%",
        paddingLeft: 10
    }
})