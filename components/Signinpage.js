import { StyleSheet, Text, View, Platform, Dimensions, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { colors } from './Theme'
import Button from '../common/Button'
import GoogleIcon from "../assets/google.png"
import AppleIcon from "../assets/Apple.png"
import FacebookIcon from "../assets/Facebook.png"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { height, width } = Dimensions.get('window')


const Signinpage = () => {

    const [hidePassword, setHidepassword] = useState(true)
    const [focusEmail, setFocuEmail] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userId, setUserId] = useState(null)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const Navigation = useNavigation();
    const handleEmailChange = (value) => {
        setData({ ...data, email: value })
    }
    const handlePassword = (value) => {
        setData({ ...data, password: value })
    }









    const HandleSignIn = () => {
        const { email, password } = data
        const emailRegex = /^([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})$/;
        if (!email.trim()) Alert.alert("Enter Email id")
        else if (!emailRegex.test(email)) Alert.alert("Enter Email Correctly")
        else if (!password.trim()) Alert.alert("Enter Password")
        else {
            SignIn()
        }
    }

    const SignIn = async () => {
        setLoading(true)
        try {
            const response = await axios.post('http://192.168.29.223:5000/signin', data)
            if (response.data === "Email dosen't exist") Alert.alert(response.data)
            else if (response.data === "Password is incorrect") Alert.alert(response.data)
            else {
                await AsyncStorage.setItem("token", response.data.token)

                const { name, email, _id, number } = response.data.user
                Navigation.replace("Profile", { uid: _id, name, email, number })
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }


    }

    return (
        <View style={styles.container} >

            <View style={(focusEmail || data.email.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                <MaterialCommunityIcons name="email-outline" size={24} color={(focusEmail || data.email.length > 0) ? colors.MAIN_COLOR : colors.BLACK} />
                <TextInput
                    onFocus={() => setFocuEmail(!focusEmail)}
                    onBlur={() => setFocuEmail(!focusEmail)}
                    style={styles.inputBox}
                    value={data?.email}
                    placeholder='Enter Email'
                    placeholderTextColor="gray"
                    onChangeText={handleEmailChange}
                />
            </View>
            <View style={(focusPassword || data.password.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                <Feather name="lock" size={24} color={(focusPassword || data.password.length > 0) ? colors.MAIN_COLOR : colors.BLACK} />
                <TextInput
                    onFocus={() => setFocusPassword(!focusPassword)}
                    onBlur={() => setFocusPassword(!focusPassword)}
                    style={styles.inputBox}
                    value={data?.password}
                    onChangeText={handlePassword}
                    placeholder='Enter Password'
                    placeholderTextColor="gray"
                    secureTextEntry={hidePassword ? true : false}
                />
                <TouchableOpacity style={{ position: "absolute", right: 10, }} onPress={() => setHidepassword(!hidePassword)} >
                    <FontAwesome6 name={hidePassword ? "eye-slash" : "eye"} size={24} color={(focusPassword || data.password.length > 0) ? colors.MAIN_COLOR : colors.BLACK} />

                </TouchableOpacity>
            </View>
            <Button
                buttonStyle={loading ? styles.loadingButtonStyle : styles.buttonStyle}
                title="Sign IN"
                textStyle={styles.textStyle}
                activeOpacity={0.8}
                loading={loading}
                loaderColor={colors.MAIN_COLOR}
                loaderSize="large"
                press={HandleSignIn}
            />
            <View>
                <Text style={{ color: colors.GREY }}>Or Login with..</Text>
            </View>
            <View style={styles.socialLogin}>
                <Image source={Platform.OS === "android" ? GoogleIcon : AppleIcon} height={60} width={60} />
                <Image source={FacebookIcon} height={60} width={60} />
            </View>
            <View style={{ width: width - 60, justifyContent: 'center', alignItems: 'center', flexDirection: "row", gap: 10 }}>
                <Text style={{ color: colors.GREY }}>New User??</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={() => Navigation.navigate("Register")} >
                    <Text style={{ color: colors.MAIN_COLOR, fontWeight: "bold" }}>Register now</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.BACKGROUND_COLOR,
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        gap: 10
    },
    inputContainer: {
        borderWidth: 2,
        borderColor: colors.BLACK,
        width: width - 60,
        borderRadius: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    FocusinputContainer: {
        borderWidth: 2.5,
        borderColor: colors.MAIN_COLOR,
        width: width - 60,
        borderRadius: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    inputBox: {
        fontWeight: '900',
        paddingLeft: 10,
        width: "100%",
        paddingVertical: 15,
        fontSize: 15
    },
    buttonStyle: {
        width: width - 60,
        backgroundColor: colors.MAIN_COLOR,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    textStyle: {
        color: colors.WHITE,
        fontWeight: "900",
        fontSize: 18
    },
    socialLogin: {
        width: width - 60,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: "row",
        gap: 50
    },
    loadingButtonStyle: {
        width: width - 60,
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.MAIN_COLOR

    }
})
export default Signinpage

