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
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';


// "eas build -p android --profile preview"

const SignUp = ({ navigation }) => {
    const { FetchCountry, country, SignUPAccount } = useContext(AuthContext)
    const [countryData, setCountryData] = useState(null)
    const [focusEmail, setFocuEmail] = useState(false)
    const [focusNumber, setFocusNumber] = useState(false)
    const [focusName, setFocusName] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)
    const [conFirmPass, setConfirmPass] = useState("")
    const [hideConfirmPass, setHideConfirmPass] = useState(false)
    const [focusConfirmPass, setFocusConfirmPass] = useState(false)
    const [hidePassword, setHidepassword] = useState(true)
    const [loading, setLoading] = useState(false)
    const route = useRoute()
    const snapPoints = useMemo(() => ['65%'], []);
    const sheetRef = useRef(null);
    const [searchCountry, setSearchCountry] = useState("")
    const [selectCountry, setSelectCountry] = useState()
    const OpenButtomSheet = () => sheetRef?.current?.expand()
    const closeBottomSheet = () => sheetRef.current?.close();
    const renderBackdrop = (props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    );

    useEffect(() => {
        FetchCountry()
    }, [])

    const [data, setData] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: ""
    })

    useEffect(() => {
        if (route.params && route.params.phone && route.params.code) {
            setData({ ...data, phone: route.params.phone })
            setSelectCountry(route.params.code)
        }
    }, [route])



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
        const { full_name, email, password, phone } = data;
        const emailRegex = /^([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})$/;
        if (!full_name.trim()) {
            Alert.alert('Please enter your name');
        } else if (!email.trim()) {
            Alert.alert('Please enter your email');
        } else if (!password.trim()) {
            Alert.alert('Please enter your password');
        } else if (!conFirmPass) {
            Alert.alert('Please confirm your password');
        } else if (password !== conFirmPass) {
            Alert.alert('Password and Confirm Password do not match');
        } else if (!phone.trim()) {
            Alert.alert('Please enter your mobile number');
        } else if (!emailRegex.test(email)) {
            Alert.alert('Please enter a valid email address');
        } else if (phone.length < 6) {
            Alert.alert('Enter a Valid Mobile Number')
        }
        else {

            const passwordValid = validatePassword(password)
            if (!passwordValid) {
                return
            } else {
                setLoading(true)
                const uid = await SignUPAccount(data)
                if (uid) {
                    const Data_obj = {}
                    Data_obj.full_name = data.full_name
                    Data_obj.phone = data.phone
                    Data_obj.email = data.email
                    await AddUser(uid, Data_obj)
                    navigation.navigate('Login', { uid: uid })
                }
            }
        }
    }

    const AddUser = async (userId, updateData) => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({ id: userId, ...updateData }, { onConflict: ['id'] });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error adding to profile:', error.message);
            setLoading(false)
            return null;
        }
        finally {
            setLoading(false)

        }
    };

    // const HandleSignIn = async (mobileNumber) => {
    //     try {
    //         console.log("Running")
    //         const { data, error } = await supabase.auth.signInWithOtp({
    //             phone: `${selectCountry}${mobileNumber}`,
    //         })
    //         if (error) console.log(error)
    //         if (!error) navigation.navigate('Register', { phone: `${mobileNumber}`, code: `${selectCountry}` })
    //         setLoading(false)
    //     }
    //     catch (err) {
    //         console.log(err)
    //         setLoading(false)
    //     }
    //     finally {
    //         setLoading(false)
    //     }
    // }

    const SelectContryCode = (data) => {
        setSelectCountry(data)
        closeBottomSheet()
    }


    const RenderCountrylist = ({ item }) => {
        return (
            <TouchableOpacity style={{ flexDirection: "row", marginBottom: 10, marginLeft: 20, paddingVertical: 10, }} onPress={() => {
                SelectContryCode(item)
            }}  >
                <View style={{ width: "15%", }}>
                    <Image source={{ uri: item.flag }} style={{ height: 20, width: 30 }} />
                </View>
                <View style={{ width: "20%", }}>
                    <Text style={{ fontFamily: Font.Medium, fontSize: 15 }}>(+{item.code})</Text>
                </View>
                <View style={{ width: "60%" }}>
                    <Text style={{ fontFamily: Font.Medium, fontSize: 15 }}>{item.country} ({item.label.toUpperCase()})</Text>
                </View>
            </TouchableOpacity>
        )
    }
    const FilteredCountry = country?.filter(value =>
        value?.country?.toLowerCase().includes(searchCountry?.toLowerCase()) || value?.label.toLowerCase().includes(searchCountry?.toLowerCase())
    )


    const CountryListModal = () => {
        return (
            <BottomSheet
                ref={sheetRef}
                index={-1}
                backgroundStyle={{ backgroundColor: colors.WHITE }}
                enablePanDownToClose={true}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
            >
                <View >
                    <View style={styles.SearchBox}>
                        <AntDesign name="search1" size={18} color={colors.GREY} />
                        <TextInput
                            style={[{ fontFamily: Font.Medium, width: "80%", height: 50 }]}
                            placeholder="Search country code..."
                            onChangeText={(text) => setSearchCountry(text)}
                            value={searchCountry}
                        />
                    </View>
                    <FlatList
                        style={[styles.dropDown]}
                        data={FilteredCountry}
                        renderItem={({ item }) => <RenderCountrylist item={item} />}
                        keyExtractor={(item, index) => index}
                        getItemLayout={(data, index) => (
                            { length: 50, offset: 50 * index, index }
                        )}
                    />
                </View>
            </BottomSheet>
        )
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.profileContainer, { backgroundColor: colors.WHITE }]}>
                <View style={{ alignItems: 'center', gap: 25, backgroundColor: colors.WHITE }}>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontSize: 30, fontFamily: Font.Bold }} >Sign up</Text>
                    </View>
                    <View style={{ width, gap: 25, alignItems: 'center' }}>
                        <View style={[(focusName || data?.full_name?.length > 0) ? styles.FocusinputContainer : styles.inputContainer, {}]}>
                            <Ionicons name="person-outline" size={24} color={(focusName || data?.full_name?.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            <TextInput
                                onFocus={() => setFocusName(!focusName)}
                                onBlur={() => setFocusName(!focusName)}
                                style={[styles.inputBox, { color: colors.BLACK }]}
                                value={data?.full_name}
                                placeholder='Enter Name'
                                placeholderTextColor="gray"
                                onChangeText={(text) => setData({ ...data, full_name: text })}
                            />
                        </View>
                        <View style={(focusEmail || data?.email?.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                            <MaterialCommunityIcons name="email-outline" size={24} color={(focusEmail || data?.email?.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            <TextInput
                                onFocus={() => setFocuEmail(!focusEmail)}
                                onBlur={() => setFocuEmail(!focusEmail)}
                                style={[styles.inputBox, { color: colors.BLACK }]}
                                value={data?.email}
                                placeholder='Enter Email'
                                placeholderTextColor="gray"
                                onChangeText={(text) => setData({ ...data, email: text })}
                            />
                        </View>
                        <View style={(focusNumber || data?.phone?.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                            <Ionicons name="phone-portrait-outline" size={24} color={(focusNumber || data?.phone?.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            <TextInput
                                // editable={false}
                                onFocus={() => setFocusNumber(!focusNumber)}
                                onBlur={() => setFocusNumber(!focusNumber)}
                                style={[styles.inputBox, { color: colors.BLACK, }]}
                                value={data?.phone}
                                placeholder='Enter Mobile Number'
                                placeholderTextColor="gray"
                                onChangeText={(text) => setData({ ...data, phone: text })}
                                keyboardType='number-pad'
                            />
                        </View>
                        <View style={(focusPassword || data.password.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                            <Feather name="lock" size={24} color={(focusPassword || data.password.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            <TextInput
                                onFocus={() => setFocusPassword(!focusPassword)}
                                onBlur={() => setFocusPassword(!focusPassword)}
                                style={[styles.inputBox, { color: Font.Bold }]}
                                value={data?.password}
                                onChangeText={(text) => setData({ ...data, password: text })}
                                placeholder='Enter Password'
                                placeholderTextColor="gray"
                                secureTextEntry={hidePassword ? true : false}
                            />
                            <TouchableOpacity style={{ position: "absolute", right: 10, }} onPress={() => setHidepassword(!hidePassword)} >
                                <FontAwesome6 name={hidePassword ? "eye-slash" : "eye"} size={24} color={(focusPassword || data.password.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />

                            </TouchableOpacity>
                        </View>
                        <View style={(focusConfirmPass || conFirmPass.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                            <Feather name="lock" size={24} color={(focusConfirmPass || conFirmPass.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            <TextInput
                                onFocus={() => setFocusConfirmPass(!focusConfirmPass)}
                                onBlur={() => setFocusConfirmPass(!focusConfirmPass)}
                                style={[styles.inputBox, { color: Font.Bold }]}
                                value={conFirmPass}
                                onChangeText={(text) => setConfirmPass(text)}
                                placeholder='Confirm your Password'
                                placeholderTextColor="gray"
                                secureTextEntry={hideConfirmPass ? true : false}
                            />
                            <TouchableOpacity style={{ position: "absolute", right: 10, }} onPress={() => setHideConfirmPass(!hideConfirmPass)} >
                                <FontAwesome6 name={hideConfirmPass ? "eye-slash" : "eye"} size={24} color={(focusConfirmPass || conFirmPass.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />

                            </TouchableOpacity>
                        </View>
                        <Button
                            buttonStyle={[loading && loading === true ? styles.loadingButtonStyle : styles.buttonStyle]}
                            title="Create Account"
                            textStyle={styles.textStyle}
                            activeOpacity={0.8}
                            press={HandleSignUp}
                            loading={loading}
                            loaderColor={colors.MAIN_COLOR}
                            loaderSize="large"
                        />
                        <View style={{ width: width - 50, alignItems: "center", justifyContent: 'center', gap: 10, marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', }} >
                            <Text style={{ fontFamily: Font.Light, fontSize: 12, color: colors.CHAT_DESC, }}>By signing up, you agree to the Terms and Conditions.</Text>
                            <Text style={{ fontFamily: Font.Medium, fontSize: 12, color: colors.MAIN_COLOR, }}>See Terms..</Text>

                        </View>

                    </View>
                    {CountryListModal()}
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default SignUp

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