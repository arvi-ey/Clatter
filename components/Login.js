import 'react-native-gesture-handler';
import React, { useEffect, useState, useContext, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, Platform, TouchableOpacity, Alert, Linking, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { colors } from './Theme';
import { SimpleLineIcons, Feather, AntDesign } from '@expo/vector-icons';
import Button from '../common/Button';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
const { height, width } = Dimensions.get('window');
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Font } from '../common/font';
import { supabase } from '../lib/supabase'
import { FontAwesome6 } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from './Context/Authprovider'


// "eas build -p android --profile preview"

const Login = ({ navigation }) => {
    const { HandleSignIn } = useContext(AuthContext)
    const [focusEmail, setFocuEmail] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [hidePassword, setHidepassword] = useState(true)
    // const []


    const [data, setData] = useState({
        email: "",
        phone: "",
    })





    function validatePassword(password) {
        const minLength = 8;
        const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
        const uppercaseRegex = /[A-Z]/;

        if (password.length < minLength) {
            return Alert.alert("Pasword Length Must be More than 8 words");
        }

        if (!specialCharRegex.test(password)) {
            return Alert.alert("Password must contain at least one special character");
        }

        if (!uppercaseRegex.test(password)) {
            return Alert.alert("Password must contain at least one uppercase letter");
        }
        return true;
    }

    const HandleSignUp = async () => {
        const { email, password } = data;
        const emailRegex = /^([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})$/;
        if (!email.trim()) {
            Alert.alert('Please enter your email');
        } else if (!password.trim()) {
            Alert.alert('Please enter your password');
        } else if (!emailRegex.test(email)) {
            Alert.alert('Please enter a valid email address');
        }
        else {

            const passwordValid = validatePassword(password)
            if (!passwordValid) {
                return
            } else {
                setLoading(true)
                const uid = await HandleSignIn(data)
                if (uid) {
                    navigation.navigate("Entry")
                }
                setLoading(false)
            }
            setLoading(false)
        }
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.profileContainer, { backgroundColor: colors.WHITE }]}>
                <View style={{ alignItems: 'center', gap: 25, backgroundColor: colors.WHITE }}>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontSize: 30, fontFamily: Font.Bold }} >Sign in with Email</Text>
                    </View>
                    <View style={{ width, gap: 25, alignItems: 'center' }}>
                        <View style={(focusEmail || (data.email && data?.email?.length) > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                            <MaterialCommunityIcons name="email-outline" size={24} color={(focusEmail || (data.email && data?.email?.length) > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            <TextInput
                                onFocus={() => setFocuEmail(!focusEmail)}
                                onBlur={() => setFocuEmail(!focusEmail)}
                                style={[styles.inputBox, { color: colors.BLACK }]}
                                value={data?.email || ""}
                                placeholder='Enter Email'
                                placeholderTextColor="gray"
                                onChangeText={(text) => setData({ ...data, email: text })}
                            />
                        </View>
                        <View style={(focusPassword || (data.password && data.password.length) > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                            <Feather name="lock" size={24} color={(focusPassword || (data.password && data.password.length) > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            <TextInput
                                onFocus={() => setFocusPassword(!focusPassword)}
                                onBlur={() => setFocusPassword(!focusPassword)}
                                style={[styles.inputBox, { color: Font.Bold }]}
                                value={data?.password || ""}
                                onChangeText={(text) => setData({ ...data, password: text })}
                                placeholder='Enter Password'
                                placeholderTextColor="gray"
                                secureTextEntry={hidePassword ? true : false}
                            />
                            <TouchableOpacity style={{ position: "absolute", right: 10, }} onPress={() => setHidepassword(!hidePassword)} >
                                <FontAwesome6 name={hidePassword ? "eye-slash" : "eye"} size={24} color={(focusPassword || (data.password && data.password.length) > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            </TouchableOpacity>
                        </View>
                        <Button
                            buttonStyle={[loading && loading === true ? styles.loadingButtonStyle : styles.buttonStyle]}
                            title="LOG IN"
                            textStyle={styles.textStyle}
                            activeOpacity={0.8}
                            press={HandleSignUp}
                            loading={loading}
                            loaderColor={colors.MAIN_COLOR}
                            loaderSize="large"
                        />
                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default Login

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: Platform.OS === 'android' ? 50 : 0,
        position: "relative",
        gap: 20,
    },
    nameContainer: {
        width: width - 20,
        alignItems: "center"
    },
    editIcon: {
        backgroundColor: colors.MAIN_COLOR,
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    editProfileButton: {
        color: colors.WHITE,
        fontSize: 18,
        fontFamily: Font.Medium
    },
    buttonStyle: {
        backgroundColor: colors.MAIN_COLOR,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        width: "40%",
        justifyContent: "center",
        alignItems: "center"
    },
    menuContainer: {
        width: width - 20,
        height: 50,
        alignItems: "center",
        flexDirection: "row",
        gap: 20,
        marginTop: 12
    },
    contentContainer: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.WHITE,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 50
    },
    title: {
        fontSize: 24,
        fontWeight: Font.Bold
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16
    },
    mediaContainer: {
        backgroundColor: colors.SECONDARY_COLOR,
        borderRadius: 12,
        padding: 10
    },
    inputContainer: {
        borderBottomWidth: 2.5,
        borderColor: colors.CHAT_DESC,
        width: width - 60,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    FocusinputContainer: {
        borderBottomWidth: 2.5,
        borderColor: colors.MAIN_COLOR,
        width: width - 60,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    inputBox: {
        fontFamily: Font.Bold,
        paddingLeft: 10,
        width: "100%",
        paddingVertical: 15,
        fontSize: 15
    },
    textStyle: {
        color: colors.WHITE,
        fontFamily: Font.Bold,
        fontSize: 18
    },
    buttonStyle: {
        width: width - 60,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.MAIN_COLOR,
        borderWidth: 2,
        borderColor: colors.MAIN_COLOR
    },
    loadingButtonStyle: {
        width: width - 60,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.MAIN_COLOR

    }
})