import { StyleSheet, Text, View, Alert, Dimensions, TextInput, Image, TouchableOpacity, AppState } from 'react-native'
import React from 'react'
import { colors } from './Theme'
import Button from '../common/Button'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useState, useEffect, useRef, useContext } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import { useRoute } from '@react-navigation/native';
const { height, width } = Dimensions.get('window')
import { supabase } from '../lib/supabase'

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})
const Register = ({ navigation }) => {
    const [focusNumber, setFocusNumber] = useState(false)
    const { CreateUser } = useContext(AuthContext)
    const route = useRoute()
    const { phone } = route.params
    const [data, setData] = useState({
        code1: null,
        code2: null,
        code3: null,
        code4: null

    })
    const [code1focus, setCode1Focus] = useState(false)
    const [code2focus, setCode2Focus] = useState(false)
    const [code3focus, setCode3Focus] = useState(false)
    const [code4focus, setCode4Focus] = useState(false)
    const [loading, setLoading] = useState(false)
    const [otp, setOtp] = useState(null)
    const otpRef1 = useRef()
    const otpRef2 = useRef()
    const otpRef3 = useRef()
    const otpRef4 = useRef()

    const Navigation = useNavigation()

    useEffect(() => {
        otpRef1.current.focus()
    }, [])

    const VerifyOTP = async () => {
        setLoading(true)
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.verifyOtp({
                phone: phone,
                token: otp,
                type: 'sms',
            })
            console.log(session)
            if (!error) navigation.navigate("Profile")
            setLoading(false)
        }
        catch (err) {
            console.log(err)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container} >
            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 30, fontFamily: Font.Bold }} >Enter OTP</Text>
            </View>
            <View>
                <Text style={{ fontFamily: Font.Regular, color: colors.CHAT_DESC }} >Code has been sent to {phone}</Text>
            </View>
            <View style={styles.otpContainer} >
                <View style={(code1focus || data.code1?.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                    <TextInput
                        focusable
                        ref={otpRef1}
                        onFocus={() => setCode1Focus(!code1focus)}
                        onBlur={() => setCode1Focus(!code1focus)}
                        style={[styles.inputBox, { color: Font.Bold }]}
                        value={data?.code1}
                        placeholderTextColor="gray"
                        onChangeText={(text) => {
                            setData({ ...data, code1: text })
                            if (text.length > 0) otpRef2.current.focus()
                        }}
                        keyboardType='number-pad'
                    />
                </View>
                <View style={(code2focus || data.code2?.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                    <TextInput
                        ref={otpRef2}
                        onFocus={() => setCode2Focus(!code2focus)}
                        onBlur={() => setCode2Focus(!code2focus)}
                        style={[styles.inputBox, { color: Font.Bold }]}
                        value={data?.code2}
                        placeholderTextColor="gray"
                        onChangeText={(text) => {
                            setData({ ...data, code2: text })
                            if (text.length > 0) otpRef3.current.focus()
                        }}
                        keyboardType='number-pad'
                    />
                </View>
                <View style={(code3focus || data.code3?.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                    <TextInput
                        ref={otpRef3}
                        onFocus={() => setCode3Focus(!code3focus)}
                        onBlur={() => setCode3Focus(!code3focus)}
                        style={[styles.inputBox, { color: Font.Bold }]}
                        value={data?.code3}
                        placeholderTextColor="gray"
                        onChangeText={(text) => {
                            setData({ ...data, code3: text })
                            if (text.length > 0) otpRef4.current.focus()
                        }}
                        keyboardType='number-pad'
                    />
                </View>
                <View style={(code4focus || data.code4?.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                    <TextInput
                        ref={otpRef4}
                        onFocus={() => setCode4Focus(!code4focus)}
                        onBlur={() => setCode4Focus(!code4focus)}
                        style={[styles.inputBox, { color: Font.Bold }]}
                        value={data?.code4}
                        placeholderTextColor="gray"
                        onChangeText={(text) => {
                            setData({ ...data, code4: text })
                            if (text) setOtp(`${data.code1}${data.code2}${data.code3}${text}`)
                        }}
                        keyboardType='number-pad'
                    />
                </View>

            </View>
            {otp?.length === 4 ?
                <Button
                    buttonStyle={loading === true ? styles.loadingButtonStyle : styles.buttonStyle}
                    title="Verify number"
                    textStyle={styles.textStyle}
                    activeOpacity={0.8}
                    press={VerifyOTP}
                    loading={loading}
                    loaderColor={colors.MAIN_COLOR}
                    loaderSize="large"
                />
                : null}
            <View style={{ flexDirection: 'row', gap: 5 }}>
                <Text style={{ fontFamily: Font.Regular, color: colors.CHAT_DESC }}>Didn't get OTP?</Text>
                <TouchableOpacity >
                    <Text style={{ color: colors.MAIN_COLOR, fontFamily: Font.Regular }}>
                        resend code
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
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
        borderWidth: 2.5,
        borderColor: colors.BLACK,
        width: 60,
        height: 60,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        paddingLeft: 20
    },
    FocusinputContainer: {
        borderWidth: 2.5,
        borderColor: colors.MAIN_COLOR,
        width: 60,
        height: 60,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        alignItems: 'center',
        justifyContent: "center",
        paddingLeft: 20
    },
    otpContainer: {
        flexDirection: "row",
        width: width - 60,
        justifyContent: "space-around",
    },
    inputBox: {
        width: "100%",
        fontSize: 20,
        alignItems: 'center',
        justifyContent: "center",
        height: "100%",
    },
    buttonStyle: {
        width: width - 30,
        backgroundColor: colors.MAIN_COLOR,
        borderRadius: 10,
        paddingVertical: 18,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    textStyle: {
        color: colors.WHITE,
        fontFamily: "Ubuntu-Bold",
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
        width: width - 30,
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "cent18",
        borderWidth: 2,
        borderColor: colors.MAIN_COLOR,
        marginTop: 20

    }
})
export default Register