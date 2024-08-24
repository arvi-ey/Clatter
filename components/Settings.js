import React, { useRef, useState, useMemo, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, Platform, TouchableOpacity, Alert, Linking, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import { colors } from './Theme';
const { height, width } = Dimensions.get('window');
import Switch from '../common/Switch';

const Settings = ({ navigation }) => {
    const { user, UpdateUser, uid } = useContext(AuthContext)
    const [hideTyping, setHideTyping] = useState()
    const [hideActive, setHideActive] = useState()
    const [hideLastseen, setHideLastseen] = useState()


    useEffect(() => {
        if (user) {
            setHideActive(user.hideActive)
            setHideTyping(user.hideTyping)
            setHideLastseen(user.hideLastseen)
        }
    }, [user])

    const Info = [
        {
            name: "Hide active status",
            value: "Active",
            Desc: "Hiding your active status makes you invisible to others, and you won't see their active status either."

        },
        {
            name: "Hide typing",
            value: "Typing",
            Desc: "Hiding your typing status hides others' typing status too."
        },
        {
            name: "Hide last seen",
            value: "Lastseen",
            Desc: "Enabling this option hides your last seen and others too."
        },
    ]

    const OnSwitch = (value) => {
        if (value === "Active") {
            setHideActive(!hideActive)
            UpdateUser(uid, { hideActive: !hideActive })
        }
        if (value === "Typing") {
            setHideTyping(!hideTyping)
            UpdateUser(uid, { hideTyping: !hideTyping })
        }
        if (value === "Lastseen") {
            setHideLastseen(!hideLastseen)
            UpdateUser(uid, { hideLastseen: !hideLastseen })
        }

    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                fontFamily: Font.Medium,
                fontSize: 20,
                color: user.dark_mode ? colors.WHITE : colors.BLACK
            },
            headerStyle: {
                backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE,
            },
            headerTintColor: user.dark_mode ? colors.WHITE : colors.BLACK,
        });
    }, [navigation]);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE }} >
            {
                Info?.map((item, index) => {
                    return (
                        <View style={styles.MainView} key={index} >
                            <View style={{ width: "80%" }} >
                                <Text style={{
                                    fontFamily: Font.Medium,
                                    color: user.dark_mode ? colors.WHITE : colors.BLACK, fontSize: 15
                                }} >{item.name}</Text>
                                <Text style={{
                                    fontFamily: Font.Light,
                                    color: user.dark_mode ? colors.CHARCOLE_DARK : colors.CHAT_DESC, fontSize: 12
                                }}>
                                    {item.Desc}
                                </Text>
                            </View>
                            <Switch
                                onToggle={() => OnSwitch(item.value)}
                                size={'medium'}
                                isOn={item.value === 'Active' ? hideActive : item.value === "Typing" ? hideTyping : item.value === "Lastseen" ? hideLastseen : null}
                                onColor={colors.MAIN_COLOR}
                                offColor={colors.SWITCH_BG}
                                animationSpeed={300}
                                thumbOnStyle={{ backgroundColor: colors.WHITE }}
                            />
                        </View>
                    )
                })
            }
        </ScrollView>
    )
}

export default Settings

const styles = StyleSheet.create({
    MainView: {
        width: width - 5,
        paddingLeft: 10,
        height: 60,
        marginVertical: 5,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: "space-around"
    }
})