import 'react-native-gesture-handler';
import React, { useRef, useState, useMemo, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, Platform, TouchableOpacity, Alert, Linking, TextInput, ActivityIndicator } from 'react-native';
import { colors } from './Theme';
import { SimpleLineIcons, Feather, AntDesign } from '@expo/vector-icons';
import Button from '../common/Button';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const { height, width } = Dimensions.get('window');
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import { useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// "eas build -p android --profile preview"

const EntryPage = ({ navigation }) => {
    const { UpdateUser, user, GetUserOnce, downloadImage, uploadImage, imageLoading, image, darkMode } = useContext(AuthContext)
    const snapPoints = useMemo(() => ['25%'], []);
    const sheetRef = useRef(null);
    const [focusName, setFocusName] = useState(false)
    const [dataLoading, setDataLoading] = useState(true)
    const [user_nameError, SetUser_nameError] = useState()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        user_name: "",
    })

    useEffect(() => {
        GetUserOnce()
        setDataLoading(true)
    }, [])



    setTimeout(() => {
        setDataLoading(false)
    }, 1500)

    useEffect(() => {
        if (user) {
            if (user.user_name) {
                SetUser_nameError("valid")
                setData(prevData => ({
                    ...prevData,
                    user_name: user.user_name
                }));
            }
            if (user.profile_pic) downloadImage(user.profile_pic)
        }
    }, [user]);
    const User_image = require("../assets/user1.jpg")

    const openCamera = async () => {
        const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            if (!canAskAgain) {
                Alert.alert(
                    'Permission Denied',
                    'You have denied the camera permission and chosen not to be asked again. Please enable the camera permission from the settings.',
                    [{ text: 'OK', style: 'cancel' }]
                );
            }
            return;
        }
        let pickerResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            // setImage(pickerResult.assets[0].uri);
            closeBottomSheet()
        }
    };


    const openSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };


    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri
            // setImage(result.assets[0].uri);
            // setData({ ...data, profile_image: result.assets[0].uri })
            uploadImage(uri)
            closeBottomSheet()
        }
    };
    const OpenButtomSheet = () => sheetRef?.current?.expand()
    const closeBottomSheet = () => sheetRef.current?.close();
    const renderBackdrop = (props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    );


    const handleNameChange = (text) => {
        const get_Validation = validateUsername(text)
        SetUser_nameError(get_Validation)
        setData({ ...data, user_name: text })
    }

    const HandleUpdate = async () => {
        const { user_name } = data;
        if (!user_name.trim()) {
            Alert.alert('Please enter a valid user name');
        }
        else {
            setLoading(true)
            await UpdateUser(user.id, data)
            await AsyncStorage.setItem("loggedIN", "TRUE")
            navigation.replace("Profile")
            setLoading(false)
        }
    }


    function validateUsername(username) {

        const regex = /^[a-zA-Z0-9_.-]+$/;

        if (!username || username.trim().length === 0) {
            return "Username cannot be empty.";
        }

        if (username.length < 3 || username.length > 15) {
            return "Username must be between 3 and 15 characters long.";
        }

        if (username.startsWith('_') || username.startsWith('-') || username.startsWith('.') ||
            username.endsWith('_') || username.endsWith('-') || username.endsWith('.')) {
            return "Username cannot start or end with a special character (_-.).";
        }

        if (!regex.test(username)) {
            return "Username can only contain letters, numbers, underscores (_), hyphens (-), or periods (.).";
        }

        const restrictedWords = ["admin", "root", "support"];
        if (restrictedWords.some(word => username.toLowerCase().includes(word))) {
            return "Username cannot contain restricted words like 'admin', 'root', or 'support'.";
        }

        return "valid";
    }



    if (dataLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <LottieView
                    autoPlay
                    style={{
                        width: 400,
                        height: 400,
                    }}
                    source={require('../assets/otp_verified.json')}
                />
            </View>
        )
    }

    if (!data) {
        return (
            <SafeAreaView style={[styles.profileContainer, { backgroundColor: darkMode ? colors.BLACK : colors.WHITE }]}>
                <View style={{ alignItems: 'center', gap: 25, backgroundColor: darkMode ? colors.BLACK : colors.WHITE }}>
                    <View style={{ backgroundColor: darkMode ? colors.BLACK : colors.WHITE, alignItems: "center", gap: 8, }}>
                        <View style={{ position: "relative", justifyContent: 'center', backgroundColor: darkMode ? colors.SKELETON_BG_DARK : colors.SKELETON_BG, height: 180, width: 180, borderRadius: 90, alignItems: "center", }}>
                        </View>
                    </View>
                    <View style={{ gap: 25, justifyContent: "center", alignItems: 'center', height: 50, borderRadius: 25, width: width - 120, backgroundColor: darkMode ? colors.SKELETON_BG_DARK : colors.SKELETON_BG, }}>
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.profileContainer, { backgroundColor: darkMode ? colors.BLACK : colors.WHITE }]}>
                <View style={{ alignItems: 'center', gap: 25, backgroundColor: darkMode ? colors.BLACK : colors.WHITE }}>
                    <View style={{ backgroundColor: darkMode ? colors.BLACK : colors.WHITE, alignItems: "center", gap: 8, }}>
                        <View style={{ position: "relative", justifyContent: 'center', alignItems: "center", }}>
                            {imageLoading ?
                                <ActivityIndicator size="large" style={{ position: 'absolute', zIndex: 10 }} color={colors.WHITE} />
                                : null
                            }
                            <Image source={image ? { uri: image } : User_image} style={{ borderRadius: 90, height: 180, width: 180, borderWidth: 2, borderColor: colors.MAIN_COLOR }} />
                            <TouchableOpacity style={styles.editIcon} onPress={OpenButtomSheet}>
                                <SimpleLineIcons name="camera" size={20} color={colors.WHITE} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ gap: 25, justifyContent: "center", alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }} >
                            <View style={[(focusName || data?.user_name?.length > 0) ? styles.FocusinputContainer : styles.inputContainer, {}]}>
                                <Ionicons name="person-outline" size={24} color={(focusName || data?.user_name?.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                                <TextInput
                                    onFocus={() => setFocusName(!focusName)}
                                    onBlur={() => setFocusName(!focusName)}
                                    style={[styles.inputBox, { color: darkMode ? colors.WHITE : colors.BLACK }]}
                                    value={data?.user_name}
                                    placeholder='user_name'
                                    placeholderTextColor="gray"
                                    onChangeText={handleNameChange}
                                />
                            </View>
                            <View style={{ width: 30, height: 30, marginTop: 15, justifyContent: 'center', alignItems: 'center' }} >
                                {

                                    user_nameError === "valid" ?
                                        <AntDesign name="checkcircleo" size={24} color={colors.MAIN_COLOR} />
                                        : null
                                }
                            </View>
                        </View>
                        <View style={{ width: width - 160, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', }}>
                            {
                                user_nameError !== "valid" ?
                                    <Text style={{ color: "red", fontSize: 12, fontFamily: Font.Medium }} >{user_nameError}</Text>
                                    : null
                            }
                        </View>
                        {
                            user_nameError === "valid" ?
                                <Button
                                    buttonStyle={[loading && loading === true ? styles.loadingButtonStyle : styles.buttonStyle]}
                                    title="Continue"
                                    textStyle={styles.textStyle}
                                    activeOpacity={0.8}
                                    press={HandleUpdate}
                                    loading={loading}
                                    loaderColor={colors.MAIN_COLOR}
                                    loaderSize="large"
                                /> :
                                null
                        }

                    </View>
                </View>
                <BottomSheet
                    ref={sheetRef}
                    index={-1}
                    backgroundStyle={{ backgroundColor: colors.WHITE }}
                    enablePanDownToClose={true}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                >
                    <View>
                        <View style={{ marginLeft: 15, flexDirection: "row" }}>
                            <Text style={{ fontFamily: Font.Bold, fontSize: 20 }} >Select Profile Photo</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <TouchableOpacity activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} onPress={openCamera} >
                                <Feather name="camera" size={35} color={colors.MAIN_COLOR} style={styles.mediaContainer} />
                                <Text style={{ fontFamily: Font.Medium, color: colors.CHAT_DESC }}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}  >
                                <Octicons name="image" size={35} color={colors.MAIN_COLOR} style={styles.mediaContainer} />
                                <Text style={{ fontFamily: Font.Medium, color: colors.CHAT_DESC }}>Galary</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheet>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default EntryPage

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
        borderColor: colors.BLACK,
        width: width - 150,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    FocusinputContainer: {
        borderBottomWidth: 2.5,
        borderColor: colors.MAIN_COLOR,
        width: width - 150,
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