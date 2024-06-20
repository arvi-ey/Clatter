import { StyleSheet, Text, View, Dimensions, SafeAreaView, Platform, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import { colors } from './Theme';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { FontAwesome6 } from '@expo/vector-icons';
const { height, width } = Dimensions.get('window');


const Chatbox = ({ route, navigation }) => {
    const { user } = useContext(AuthContext)
    const ContactDetails = route.params
    const image = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
    const [messageText, setMassageText] = useState("")
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.HeaderStyle} >
                    <View>
                        <Image source={{ uri: image }}
                            style={{ height: 45, width: 45, borderRadius: 30, resizeMode: "cover" }}
                        />
                    </View>
                    <View style={{ flex: 1 }} >
                        <Text style={[styles.HeaderTextStyle, { color: user.dark_mode ? colors.WHITE : colors.BLACK }]} >{ContactDetails.saved_name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, gap: 20 }} >
                        <Ionicons name="camera-outline" size={24} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                        <MaterialIcons name="call" size={24} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                        <MaterialCommunityIcons name="dots-vertical" size={24} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                    </View>
                </View>
            ),
            headerTitleStyle: {
                fontFamily: Font.Bold,
                fontSize: 20,
                color: user.dark_mode ? colors.WHITE : colors.BLACK
            },
            headerStyle: {
                backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE,
            },
            headerTintColor: user.dark_mode ? colors.WHITE : colors.BLACK
        });
    }, [navigation]);


    const TypeMassage = (text) => {
        setMassageText(text)
    }
    return (
        <View style={[styles.ChatBackGround, { backgroundColor: user.dark_mode ? colors.CHAT_BG_DARK : colors.CHAT_BG }]} >
            <ScrollView></ScrollView>
            <View style={styles.MassageBox} >
                <TextInput
                    autoCapitalize={false}
                    autoCorrect={false}
                    autoFocus={true}
                    scrollEnabled={true}
                    placeholder="Message"
                    value={messageText}
                    multiline={true}
                    onChangeText={TypeMassage}
                    style={[styles.MassageField, { backgroundColor: user.dark_mode ? colors.MASSAGE_BOX_DARK : colors.MASSAGE_BOX, color: user?.dark_mode ? colors.WHITE : colors.BLACK }]}
                    placeholderTextColor={user.dark_mode ? colors.WHITE : colors.CHARCOLE}
                />
                <TouchableOpacity style={styles.emogiIcon}>
                    <FontAwesome6 name="smile-beam" size={24} color={user.dark_mode ? colors.WHITE : colors.CHARCOLE} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.AttachMentIcon}>
                    <MaterialIcons name="attach-file" size={24} color={user.dark_mode ? colors.WHITE : colors.CHARCOLE} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMassageText("")} style={styles.SendBox} >
                    <MaterialIcons name={messageText.length > 0 ? "send" : "keyboard-voice"} size={24} color={user.dark_mode ? colors.WHITE : colors.CHARCOLE} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Chatbox

const styles = StyleSheet.create({

    HeaderStyle: {
        width: width,
        marginRight: 100,
        height: 50,
        flexDirection: "row",
        alignItems: 'center',
        gap: 20
    },
    HeaderTextStyle: {
        fontFamily: Font.Bold,
        fontSize: 20,

    },
    ChatBackGround: {
        flex: 1
    },
    MassageBox: {
        // backgroundColor: "white",
        flexDirection: "row",
        width: width - 10,
        alignSelf: 'center',
        alignItems: "center",
        position: 'relative',
        paddingLeft: 5,
        gap: 8,
        marginBottom: 10

    },
    MassageField: {
        padding: 10,
        width: "85%",
        borderRadius: 50,
        fontFamily: Font.Medium,
        paddingLeft: 45,
        fontSize: 15,
    },
    emogiIcon: {
        position: 'absolute',
        left: 15
    },
    AttachMentIcon: {
        position: "absolute",
        right: 80
    },
    SendBox: {
        backgroundColor: colors.MAIN_COLOR,
        padding: 8,
        borderRadius: 50
    }

})