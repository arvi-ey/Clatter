import { StyleSheet, Text, View, Platform, Dimensions, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { colors } from './Theme'
import Button from '../common/Button'
import GoogleIcon from "../assets/google.png"
import AppleIcon from "../assets/Apple.png"
import FacebookIcon from "../assets/Facebook.png"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from './Context/Authprovider'
import { Font } from '../common/font'
const { height, width } = Dimensions.get('window')
import country from "../common/country"
import { AntDesign } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { supabase } from '../lib/supabase'


const Signinpage = () => {

    const { SignIn, loading } = useContext(AuthContext)
    const [hidePassword, setHidepassword] = useState(true)
    const [focusEmail, setFocuEmail] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [countryData, setCountryData] = useState(null)
    const Navigation = useNavigation();
    const [mobileNumber, setMobileNumber] = useState()
    const [openDropDown, setOpenDropdown] = useState(false)
    const [selectCountry, setSelectCountry] = useState({ label: "in", code: "91" })
    const [showButton, setShowButton] = useState(false)
    useEffect(() => {
        if (country) setCountryData(country)
    }, [country])

    const handleMobile = (text) => {
        // if (text.length === 10) setShowButton(!showButton)
        setMobileNumber(text)
    }

    const SelectContryCode = (data) => {
        setSelectCountry(data)
        setOpenDropdown(!openDropDown)
    }

    const RenderCountrylist = ({ item }) => {
        return (
            <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 5 }} onPress={() => SelectContryCode(item)}  >
                <View style={{ width: "40%", alignItems: 'center' }}>
                    <Image source={{ uri: `https://flagpedia.net/data/flags/h80/${item.label}.png` }} style={{ height: 15, width: 25 }} />
                </View>
                <View style={{ width: "40%" }}>
                    <Text style={{ fontFamily: Font.Bold, fontSize: 15 }}>+{item.code}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container} >

            {/* <View style={(focusEmail || data.email.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
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
                <Text style={{ color: colors.GREY, fontFamily: "Ubuntu-Light", }}>Or Login with..</Text>
            </View>
            <View style={styles.socialLogin}>
                <Image source={Platform.OS === "android" ? GoogleIcon : AppleIcon} height={60} width={60} />
                <Image source={FacebookIcon} height={60} width={60} />
            </View>
            <View style={{ width: width - 60, justifyContent: 'center', alignItems: 'center', flexDirection: "row", gap: 10 }}>
                <Text style={{ color: colors.GREY, fontFamily: "Ubuntu-Medium", }}>New User??</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={() => Navigation.navigate("Register")} >
                    <Text style={{ color: colors.MAIN_COLOR, fontFamily: "Ubuntu-Bold", }}>Register now</Text>
                </TouchableOpacity>
            </View> */}
            <View style={{ height: "10%", }} >
                <View style={{ paddingLeft: 20, }}>
                    <Text style={{ fontFamily: Font.Bold, fontSize: 25 }}>Clatter</Text>
                </View>
                <View style={{ paddingLeft: 20, }}>
                    <Text style={{ fontFamily: Font.Bold, fontSize: 25 }}>Hi! Welcome to clatter</Text>
                </View>
            </View>
            <View style={{ height: "90%", paddingTop: 70, paddingLeft: 16 }}>
                <View style={{ flexDirection: 'row', gap: 10 }} >
                    <TouchableOpacity style={[styles.CountryCode]} onPress={() => setOpenDropdown(!openDropDown)}>
                        <Image source={{ uri: `https://flagpedia.net/data/flags/h80/${selectCountry.label}.png` }} style={{ height: 15, width: 25 }} />
                        <Text style={{ fontFamily: Font.Bold, fontSize: 15 }}>+{selectCountry.code}</Text>
                        <AntDesign name="down" size={18} color="black" />
                    </TouchableOpacity>
                    <View style={(focusEmail || mobileNumber?.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                        <TextInput
                            onFocus={() => setFocuEmail(!focusEmail)}
                            onBlur={() => setFocuEmail(!focusEmail)}
                            style={styles.inputBox}
                            value={mobileNumber}
                            placeholder='Enter mobile number'
                            placeholderTextColor="gray"
                            onChangeText={handleMobile}
                            keyboardType='decimal-pad'
                        />
                    </View>
                </View>
                {openDropDown === true ?
                    <View style={[styles.countryList]}>
                        <FlatList
                            style={[styles.dropDown]}
                            data={countryData}
                            renderItem={({ item }) => <RenderCountrylist item={item} />}
                            keyExtractor={(item, index) => index}
                        />
                    </View>
                    :
                    null
                }
                {mobileNumber?.length>=10 ?

                    <Button
                        buttonStyle={loading ? styles.loadingButtonStyle : styles.buttonStyle}
                        title="Sign IN"
                        textStyle={styles.textStyle}
                        activeOpacity={0.8}
                        loading={loading}
                        loaderColor={colors.MAIN_COLOR}
                        loaderSize="large"
                    // press={HandleSignIn}
                    />

                    : null}


            </View>
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.BACKGROUND_COLOR,
        flex: 1,
        paddingTop: 60,
        // justifyContent: "center",
        // alignItems: 'center',
        gap: 10
    },
    inputContainer: {
        borderWidth: 2,
        borderColor: colors.BLACK,
        width: width - 150,
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
        width: width - 150,
        borderRadius: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    inputBox: {
        paddingLeft: 3,
        width: "100%",
        paddingVertical: 15,
        fontSize: 15,
        fontFamily: "Ubuntu-Bold",
    },
    buttonStyle: {
        width: width - 30,
        backgroundColor: colors.MAIN_COLOR,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30
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
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.MAIN_COLOR,
        marginTop: 30

    },
    CountryCode: {
        borderWidth: 2.5,
        borderColor: colors.MAIN_COLOR,
        width: 100,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        justifyContent: "space-around"
    },
    countryList: {
        width: 100,
        height: 250,
        borderRadius: 12,
        marginTop: 10,
    },
    dropDown: { width: "100%", height: "100%", borderRadius: 12, overflow: 'hidden', padding: 3, zIndex: 50 }
})
export default Signinpage

