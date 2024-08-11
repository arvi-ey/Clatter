import { StyleSheet, Text, View, Dimensions, Platform, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from './Context/Authprovider';
import { ContactContext } from './Context/Contactprovider';
import { MessageContext } from './Context/Messageprovider'
import { Font } from '../common/font';
import { colors } from './Theme';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome6, Feather } from '@expo/vector-icons';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');

const Chatbox = ({ navigation }) => {
    const route = useRoute()
    const data = route.params
    const { uid, user } = useContext(AuthContext);
    const { } = useContext(ContactContext);
    const { message, SendMessage } = useContext(MessageContext);
    const image = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
    const [messageText, setMassageText] = useState("");
    const [typing, setTyping] = useState(false)
    const scrollViewRef = useRef();

    const GetTime = (timestamp) => {
        const date = new Date(timestamp);
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString('en-US', options);
    };

    useEffect(() => {
    }, [])


    const Send = () => {
        if (messageText.length > 0) {
            const messageObj = {}
            messageObj.time = Date.now()
            messageObj.sender = uid
            messageObj.reciver = data?.profiles.id
            messageObj.content = messageText
            messageObj.status = "SENT"
            messageObj.react = false
            SendMessage(messageObj)
        }
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.HeaderStyle}>
                    <TouchableOpacity>
                        <Image source={{ uri: image }} style={{ height: 45, width: 45, borderRadius: 30, resizeMode: "cover" }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: "40%" }}>
                        <Text style={[styles.HeaderTextStyle, { color: user.dark_mode ? colors.WHITE : colors.BLACK }]}>{data.saved_name}</Text>
                        {/* <Text style={{ color: colors.MAIN_COLOR, fontFamily: Font.Medium }}>{(online && !typing) ? "Online" : (online && typing) ? "typing..." : null}</Text> */}
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', width: "30%", gap: 18, justifyContent: "center" }}>
                        <TouchableOpacity>
                            <Feather name="video" size={28} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialIcons name="call" size={28} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name="dots-vertical" size={28} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                        </TouchableOpacity>
                    </View>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: -2, width: "5%" }} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-sharp" size={24} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                </TouchableOpacity>
            ),
            headerTitleStyle: {
                fontFamily: Font.Bold,
                fontSize: 20,
                color: user.dark_mode ? colors.WHITE : colors.BLACK
            },
            headerStyle: {
                backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE,
            },
            headerTintColor: user.dark_mode ? colors.BLACK : colors.WHITE
        });
    }, [navigation, image, user, colors, Font, typing]);

    const TypeMassage = (text) => {
        setMassageText(text);
    };

    return (
        <View style={[styles.ChatBackGround, { backgroundColor: user.dark_mode ? colors.CHAT_BG_DARK : colors.CHAT_BG }]}>
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                style={{}}>
                {message?.map((data, key) => {
                    return (
                        <KeyboardAvoidingView
                            key={key}
                            enabled
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                        >
                            <View
                                style={[styles.MessageBox, {
                                    flexDirection: data.content.length < 32 ? "row" : "column",
                                    marginBottom: 5,
                                    alignSelf: data.sender === uid ? "flex-end" : "flex-start",
                                    marginHorizontal: 15,
                                    backgroundColor: (user.dark_mode && data.sender !== uid) ?
                                        colors.MASSAGE_BOX_DARK : (!user.dark_mode && data.sender !== uid) ?
                                            colors.WHITE : colors.MAIN_COLOR,
                                    width: data.content.length < 32 ? "auto" : 300, borderTopRightRadius: data.sender !== uid ? 20 : 0,
                                    borderTopLeftRadius: data.sender !== uid ? 20 : 20, borderBottomRightRadius: data.sender !== uid ? 20 : 20, borderBottomLeftRadius: data.sender !== uid ? 0 : 20
                                }]}>
                                <Text style={[styles.MessageContent, {
                                    color: (!user.dark_mode && data.sender !== uid) ? colors.BLACK : colors.WHITE,
                                }]}>{data.content.trim()}
                                </Text>
                                <Text style={[styles.TimeText, {
                                    color: (!user.dark_mode && data.sender !== uid) ?
                                        colors.CHARCOLE_DARK : colors.TIME_TEXT
                                }]}>{GetTime(data.timestamp)}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    )
                })}
            </ScrollView>
            <View style={styles.MassageBox}>
                <View style={[styles.MassageField, { backgroundColor: user.dark_mode ? colors.MASSAGE_BOX_DARK : colors.MASSAGE_BOX, }]}>
                    <TouchableOpacity style={styles.emogiIcon}>
                        <FontAwesome6 name="smile-beam" size={24} color={user.dark_mode ? colors.WHITE : colors.CHARCOLE} />
                    </TouchableOpacity>
                    <TextInput
                        autoCapitalize={false}
                        autoCorrect={false}
                        scrollEnabled={true}
                        placeholder="Message"
                        value={messageText}
                        multiline={true}
                        style={{ width: "75%", fontFamily: Font.Medium, color: user?.dark_mode ? colors.WHITE : colors.BLACK }}
                        onChangeText={TypeMassage}
                        placeholderTextColor={user.dark_mode ? colors.WHITE : colors.CHARCOLE}
                    />
                    <TouchableOpacity style={styles.AttachMentIcon}>
                        <MaterialIcons name="attach-file" size={24} color={user.dark_mode ? colors.WHITE : colors.CHARCOLE} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.SendBox} onPress={Send} >
                    <MaterialIcons name={messageText.length > 0 ? "send" : "keyboard-voice"} size={30} color={colors.WHITE} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Chatbox;

const styles = StyleSheet.create({
    HeaderStyle: {
        width: width,
        marginRight: 200,
        height: 70,
        flexDirection: "row",
        alignItems: 'center',
        gap: 8
    },
    HeaderTextStyle: {
        fontFamily: Font.Medium,
        fontSize: 18,
    },
    ChatBackGround: {
        flex: 1
    },
    MassageBox: {
        flexDirection: "row",
        width: width - 10,
        alignSelf: 'center',
        alignItems: "center",
        position: 'relative',
        paddingLeft: 5,
        gap: 8,
        marginBottom: 10,
        height: 60,
        backgroundColor: 'transparent',
    },
    MassageField: {
        width: "85%",
        borderRadius: 50,
        padding: 5,
        fontSize: 15,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        flexDirection: "row"
    },
    emogiIcon: {
        // position: 'absolute',
        // left: 15
    },
    AttachMentIcon: {
        // position: "absolute",
        // right: 80
    },
    SendBox: {
        backgroundColor: colors.MAIN_COLOR,
        padding: 8,
        borderRadius: 50
    },
    MessageBox: {
        padding: 8,
    },
    MessageContent: {
        color: colors.WHITE,
        fontFamily: Font.Regular,
        fontSize: 15,
        padding: 5,
    },
    TimeText: {
        alignSelf: "flex-end",
        marginHorizontal: 10,
        fontFamily: Font.Light,
        fontSize: 12
    }
});