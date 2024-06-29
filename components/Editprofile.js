import 'react-native-gesture-handler';
import React, { useRef, useState, useMemo, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, Platform, TouchableOpacity, Alert, Linking, TextInput } from 'react-native';
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


const Editprofile = ({ navigation }) => {
    const { user, EditUser, loading } = useContext(AuthContext)
    // const Navigation = useNavigation();
    const snapPoints = useMemo(() => ['25%'], []);
    const sheetRef = useRef(null);
    const [image, setImage] = useState(null);
    const [focusEmail, setFocuEmail] = useState(false)
    const [focusNumber, setFocusNumber] = useState(false)
    const [focusName, setFocusName] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        number: "",
        profile_image: ""
    })

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
            setImage(pickerResult.assets[0].uri);
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
            setImage(result.assets[0].uri);
            setData({ ...data, profile_image: result.assets[0].uri })
            closeBottomSheet()
        }
    };
    const OpenButtomSheet = () => sheetRef?.current?.expand()
    const closeBottomSheet = () => sheetRef.current?.close();
    const renderBackdrop = (props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    );
    const handleEmailChange = (value) => {
        setData({ ...data, email: value })
    }

    const handleNumber = (value) => {
        setData({ ...data, number: value })
    }
    const handleNameChange = (value) => {
        setData({ ...data, name: value })
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
    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                email: user.email,
                number: user.number
            })
        }
    }, [user])

    const HandleUpdate = () => {
        const { name, email, number } = data;
        const emailRegex = /^([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})$/;
        if (!name.trim()) {
            Alert.alert('Please enter your name');
        } else if (!email.trim()) {
            Alert.alert('Please enter your email');
        } else if (!emailRegex.test(email)) {
            Alert.alert('Please enter a valid email address');
        } else if (!number.trim()) {
            Alert.alert('Please enter your mobile number');
        }
        else {
            EditUser(data)
        }
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.profileContainer, { backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE }]}>
                <View style={{ alignItems: 'center', gap: 25, backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE }}>

                    <View style={{ backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE, alignItems: "center", gap: 8, }}>
                        <View style={{ position: "relative" }}>
                            <Image source={{ uri: image }} height={160} width={160} style={{ borderRadius: 80 }} />
                            <TouchableOpacity style={styles.editIcon} onPress={OpenButtomSheet}>
                                <SimpleLineIcons name="camera" size={20} color={colors.WHITE} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ gap: 25 }}>
                        <View style={[(focusName || data?.name.length > 0) ? styles.FocusinputContainer : styles.inputContainer, {}]}>
                            <Ionicons name="person-outline" size={24} color={(focusName || data.name.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            <TextInput
                                onFocus={() => setFocusName(!focusName)}
                                onBlur={() => setFocusName(!focusName)}
                                style={[styles.inputBox, { color: user.dark_mode ? colors.WHITE : colors.BLACK }]}
                                value={data?.name}
                                placeholder='Enter Name'
                                placeholderTextColor="gray"
                                onChangeText={handleNameChange}
                            />
                        </View>
                        <View style={(focusEmail || data?.email.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                            <MaterialCommunityIcons name="email-outline" size={24} color={(focusEmail || data.email.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            <TextInput
                                onFocus={() => setFocuEmail(!focusEmail)}
                                onBlur={() => setFocuEmail(!focusEmail)}
                                style={[styles.inputBox, { color: user.dark_mode ? colors.WHITE : colors.BLACK }]}
                                value={data?.email}
                                placeholder='Enter Email'
                                placeholderTextColor="gray"
                                onChangeText={handleEmailChange}
                            />
                        </View>
                        <View style={(focusNumber || data?.number.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                            <Ionicons name="phone-portrait-outline" size={24} color={(focusNumber || data.number.length > 0) ? colors.MAIN_COLOR : colors.CHAT_DESC} />
                            <TextInput
                                onFocus={() => setFocusNumber(!focusNumber)}
                                onBlur={() => setFocusNumber(!focusNumber)}
                                style={[styles.inputBox, { color: user.dark_mode ? colors.WHITE : colors.BLACK }]}
                                value={data?.number}
                                placeholder='Enter Mobile Number'
                                placeholderTextColor="gray"
                                onChangeText={handleNumber}
                                keyboardType='number-pad'
                            />
                        </View>
                        <Button
                            buttonStyle={[loading === true ? styles.loadingButtonStyle : styles.buttonStyle, { backgroundColor: (user.dark_mode && loading) ? colors.BLACK : ((user.dark_mode || !user.dark_mode) && !loading) ? colors.MAIN_COLOR : colors.WHITE }]}
                            title="Edit Profile"
                            textStyle={styles.textStyle}
                            activeOpacity={0.8}
                            press={HandleUpdate}
                            loading={loading}
                            loaderColor={colors.MAIN_COLOR}
                            loaderSize="large"
                        />

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
                            <TouchableOpacity activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <AntDesign name="delete" size={35} color={colors.MAIN_COLOR} style={styles.mediaContainer} />
                                <Text style={{ fontFamily: Font.Medium, color: colors.CHAT_DESC }}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheet>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default Editprofile

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
        alignItems: "center"
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