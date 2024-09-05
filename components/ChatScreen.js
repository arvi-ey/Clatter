import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, ScrollView, ActivityIndicator, TextInput, Dimensions, } from 'react-native'
import React from 'react'
import { useContext, useEffect, useState, useRef,useMemo } from 'react';
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

const ChatScreen = ({ navigation }) => {
    const { user, darkMode, savedContact, uid, downloadImage, } = useContext(AuthContext)
    const { GetuserMessaged, messagedContact, SubscribeToContactChange } = useContext(ContactContext)
    const [data, setData] = useState()
    const [searchContact,setSearchContact]= useState("")
    const [showdata,setShowdata]=useState([])

    const image = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

    useEffect(() => {
        GetuserMessaged()
        SubscribeToContactChange()
        Try()
    }, [])

    useEffect(()=>{
        const subscription = supabase
                .channel('custom-message-channel')
                .on('postgres_changes', 
                    { event: 'INSERT', schema: 'public', table: 'message' }, // Only listen for INSERT events
                    (payload) => {
                        if (payload.new.reciver === uid || payload.new.sender === uid) {
                            console.log("New message received:", payload.new);
                        }
                    }
                )
                .subscribe();
    },[uid])


    const RealtimeSubScription = async () => {
        console.log("Connection Established");
        try {
            const subscription = supabase
                .channel('custom-message-channel')
                .on('postgres_changes', 
                    { event: 'INSERT', schema: 'public', table: 'message' }, // Only listen for INSERT events
                    (payload) => {
                        if (payload.new.reciver === uid || payload.new.sender === uid) {
                            console.log("New message received:", payload.new);
                        }
                    }
                )
                .subscribe();
        } catch (error) {
            console.error('Error subscribing to channel:', error);
        }
    };
    
    const Try = async () => {
        try {
          const { data, error } = await supabase
            .from('message')
            .select('sender, reciver')
            .or(`or(sender.eq.${uid},reciver.eq.${uid})`)
            .order('time', { ascending: false })
      
          if (error) {
            throw error;
          }
      
          const arr = []
          const filteredData = data.filter(message => {
            if (message.sender === uid) {
              arr.push(message.reciver);
            } else {
                arr.push(message.sender); 
            }
          });
          const UniqueData = removeDuplicates(arr)
          if(UniqueData.length>0) setShowdata(UniqueData)
        } catch (error) {
          console.error('Error fetching messages:', error);
          return { status: 500, error: 'Failed to fetch messages' };
        }
      };

      function removeDuplicates(array) {
        const uniqueSet = new Set(array);
        return Array.from(uniqueSet);
      }

    useEffect(() => {
        setData(savedContact)
    }, [savedContact])

    

    const GotoChat = (data,userImage) => {
        navigation.navigate('Chatbox', { data, userImage });
    };


    const ChatComponent = ({data}) => {
        const [latestMessage, setLatestMessage] = useState(null);
        const [time, settime] = useState()
        const [emptyMessage, setEmptyMessage] = useState(false)
        const [userImage, setuserImage] = useState()
        const [loading,setLoading]=useState(true)
        const [userInfo,setUserInfo]= useState()


        const FetchSaVedContactData = async (userId) => {
            try {
                let { data: Savedcontact, error } = await supabase
                    .from('Savedcontact')
                    .select('user_id,saved_name,profiles(*)')
                    .match({ 
                        user_id:uid,
                        saved_id:userId
                });
                setUserInfo(Savedcontact[0])
            }
            catch (error) {
                console.log(error)
            }
        };
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

    useEffect(()=>{
        FetchSaVedContactData(data)
        setTimeout(()=>{
            setLoading(false)
        },1500)
    },[])

    useEffect(()=>{
        fetchUserData(userInfo?.profiles?.profile_pic)
    },[userInfo])

    
    useEffect(() => {
        GetLatestMessage()
        }, [data]);

        useEffect(() => {
            if (!data) return;
            const subscription= supabase
                .channel('custom-message-channel')
                .on('postgres_changes',{event: '*', schema: 'public',table: 'message',},(payload) => {
                    const newData = payload.new
                    if(newData.reciver=== uid && newData.sender===data) GetLatestMessage()
                    }
                )
                .subscribe();
        }, [data, uid]);
        

        const GetLatestMessage = async () => {
            if(data){
                try {
                    let { data: messages, error } = await supabase
                    .from('message')
                    .select('*')
                    .or(`and(sender.eq.${uid},reciver.eq.${data}),and(sender.eq.${data},reciver.eq.${uid})`)
                    .order('time', { ascending: false })
                    .limit(1);
                    
                    if (error) throw error;
                    if (!messages) setEmptyMessage(true)
                    if(messages[0]){
                        setLatestMessage(messages[0]?.content);
                    settime(messages[0].time)
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

        if (loading) {
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
                    onPress={() => GotoChat(userInfo,userImage)}
                >
                    <View style={{ padding: 5, }} >
                        <Image source={userImage ? { uri: userImage } : image}
                            style={{ height: 55, width: 55, borderRadius: 30, resizeMode: "cover" }}
                        />
                    </View>
                    <View style={{ flex: 1 }} >
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: 19, color: darkMode ? colors.WHITE : colors.BLACK, fontFamily: Font.Regular }}  >{userInfo?.saved_name ? userInfo.saved_name : userInfo?.profiles?.phone ? userInfo.profiles.phone : "No one"}</Text>
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

    const SearchContact = (text)=>{
        setSearchContact(text)
    }

    const FilteredContact = data?.filter(value =>
        value?.saved_name?.toLowerCase().includes(searchContact?.toLowerCase()) || value?.profiles?.phone?.toLowerCase().includes(searchContact?.toLowerCase())
    )

    return (
        <View style={{ backgroundColor: darkMode ? colors.BLACK : colors.WHITE, flex: 1, position: "relative" }} >
            <View style={[{width,justifyContent:'center',alignItems:'center',marginTop:5},styles.searchBarStyle]} >
                <View style={[styles.InputBox,{backgroundColor:darkMode?colors.SEARCH_BG_DARK:colors.SEARCH_BG}]}>
                <Ionicons name="search-outline" size={28} color={darkMode ? colors.CHARCOLE_DARK : colors.SEARCH_TEXT} style={{marginLeft:10}} />
                <TextInput
                placeholder="search..."
                placeholderTextColor={darkMode?colors.CHARCOLE_DARK:colors.SEARCH_TEXT}
                onChangeText={SearchContact}                
                style={[styles.InputStyle,{fontFamily:Font.Medium,fontSize:15, color:darkMode?colors.CHARCOLE_DARK:colors.SEARCH_TEXT}]}  />
                </View>
            </View>
            <FlatList
                data={showdata}
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
    },
    searchBarStyle:{
        height:52,
        borderRadius:30,
    },
    InputBox:{
        width:"95%",
        height:"100%",
        backgroundColor:"blue",
        flexDirection:'row',
        alignItems:'center',
        borderRadius:25,
        justifyContent:"space-around"
    },
    InputStyle:{
        width:"90%",
        borderRadius:25,
        height:"100%",
        paddingLeft:10
    }
})