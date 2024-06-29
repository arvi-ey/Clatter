import { StyleSheet, Text, View, Alert, Dimensions, TextInput, Image, TouchableOpacity, } from 'react-native'
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
const { height, width } = Dimensions.get('window')

const Register = ({ navigation }) => {
    const [hidePassword, setHidepassword] = useState(true)
    const [focusEmail, setFocuEmail] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)
    const [focusNumber, setFocusNumber] = useState(false)
    const [focusConfirmPass, setFocusConfirmPass] = useState(false)
    const [conFirmPass, setConfirmPass] = useState("")
    const [hideConfirmPass, setHideConfirmPass] = useState(false)
    const [focusName, setFocusName] = useState(false)
    const textRef = useRef(null)
    const { CreateUser, loading } = useContext(AuthContext)

    useEffect(() => {
        textRef.current.focus()
    }, [])
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        number: "",
    })
    const handleEmailChange = (value) => {
        setData({ ...data, email: value })
    }
    const handlePassword = (value) => {
        setData({ ...data, password: value })
    }
    const handleNumber = (value) => {
        setData({ ...data, number: value })
    }
    const handleConfirmPas = (value) => {
        setConfirmPass(value)
    }
    const handleNameChange = (value) => {
        setData({ ...data, name: value })
    }
    const Navigation = useNavigation()

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

    const HandleSignUp = () => {
        const { name, email, password, number } = data;
        const emailRegex = /^([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})$/;
        if (!name.trim()) {
            Alert.alert('Please enter your name');
        } else if (!email.trim()) {
            Alert.alert('Please enter your email');
        } else if (!password.trim()) {
            Alert.alert('Please enter your password');
        } else if (!conFirmPass) {
            Alert.alert('Please confirm your password');
        } else if (password !== conFirmPass) {
            Alert.alert('Password and Confirm Password do not match');
        } else if (!number.trim()) {
            Alert.alert('Please enter your mobile number');
        } else if (!emailRegex.test(email)) {
            Alert.alert('Please enter a valid email address');
        } else if (number.length < 10) {
            Alert.alert('Enter a Valid Mobile Number')
        }
        else {

            const passwordValid = validatePassword(password)
            if (!passwordValid) {
                return
            } else {
                CreateUser(data, Navigation)
            }
        }
    }

    return (
        <View style={styles.container} >
            <TouchableOpacity style={{ position: "absolute", top: 10, left: 15 }} onPress={() => Navigation.goBack()} >
                <Ionicons name="chevron-back-sharp" size={44} color="black" />
            </TouchableOpacity>
            <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 30, fontFamily: Font.Bold }} >Register</Text>
            </View>
            <View style={(focusName || data.name.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                <Ionicons name="person-outline" size={24} color={(focusName || data.name.length > 0) ? colors.MAIN_COLOR : colors.BLACK} />
                <TextInput
                    ref={textRef}
                    onFocus={() => setFocusName(!focusName)}
                    onBlur={() => setFocusName(!focusName)}
                    style={[styles.inputBox, { color: Font.Bold }]}
                    value={data?.name}
                    placeholder='Enter Name'
                    placeholderTextColor="gray"
                    onChangeText={handleNameChange}
                />
            </View>
            <View style={(focusEmail || data.email.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                <MaterialCommunityIcons name="email-outline" size={24} color={(focusEmail || data.email.length > 0) ? colors.MAIN_COLOR : colors.BLACK} />
                <TextInput
                    onFocus={() => setFocuEmail(!focusEmail)}
                    onBlur={() => setFocuEmail(!focusEmail)}
                    style={[styles.inputBox, { color: Font.Bold }]}
                    value={data?.email}
                    placeholder='Enter Email'
                    placeholderTextColor="gray"
                    onChangeText={handleEmailChange}
                />
            </View>
            <View style={(focusNumber || data.number.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                <Ionicons name="phone-portrait-outline" size={24} color={(focusNumber || data.number.length > 0) ? colors.MAIN_COLOR : colors.BLACK} />
                <TextInput
                    onFocus={() => setFocusNumber(!focusNumber)}
                    onBlur={() => setFocusNumber(!focusNumber)}
                    style={[styles.inputBox, { color: Font.Bold }]}
                    value={data?.number}
                    placeholder='Enter Mobile Number'
                    placeholderTextColor="gray"
                    onChangeText={handleNumber}
                    keyboardType='number-pad'
                />
            </View>
            <View style={(focusPassword || data.password.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                <Feather name="lock" size={24} color={(focusPassword || data.password.length > 0) ? colors.MAIN_COLOR : colors.BLACK} />
                <TextInput
                    onFocus={() => setFocusPassword(!focusPassword)}
                    onBlur={() => setFocusPassword(!focusPassword)}
                    style={[styles.inputBox, { color: Font.Bold }]}
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
            <View style={(focusConfirmPass || conFirmPass.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                <Feather name="lock" size={24} color={(focusConfirmPass || conFirmPass.length > 0) ? colors.MAIN_COLOR : colors.BLACK} />
                <TextInput
                    onFocus={() => setFocusConfirmPass(!focusConfirmPass)}
                    onBlur={() => setFocusConfirmPass(!focusConfirmPass)}
                    style={[styles.inputBox, { color: Font.Bold }]}
                    value={conFirmPass}
                    onChangeText={handleConfirmPas}
                    placeholder='Confirm your Password'
                    placeholderTextColor="gray"
                    secureTextEntry={hideConfirmPass ? true : false}
                />
                <TouchableOpacity style={{ position: "absolute", right: 10, }} onPress={() => setHideConfirmPass(!hideConfirmPass)} >
                    <FontAwesome6 name={hideConfirmPass ? "eye-slash" : "eye"} size={24} color={(focusConfirmPass || conFirmPass.length > 0) ? colors.MAIN_COLOR : colors.BLACK} />

                </TouchableOpacity>
            </View>
            <Button
                buttonStyle={loading === true ? styles.loadingButtonStyle : styles.buttonStyle}
                title="Sign up"
                textStyle={styles.textStyle}
                activeOpacity={0.8}
                press={HandleSignUp}
                loading={loading}
                loaderColor={colors.MAIN_COLOR}
                loaderSize="large"
            />
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
        fontFamily: "Ubuntu-Bold",
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
export default Register