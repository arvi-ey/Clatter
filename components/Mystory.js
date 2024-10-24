import 'react-native-gesture-handler';
import React, { useRef, useState, useMemo, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Modal, TouchableOpacity, TextInput } from 'react-native';
import { colors } from './Theme';
import { SimpleLineIcons, Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
const { height, width } = Dimensions.get('window');
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import Entypo from '@expo/vector-icons/Entypo';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Mystory = () => {
    const { user, darkMode, image, UploadStory, userStory, storyContent, GetStoryInfo, Viewerinfo } = useContext(AuthContext)
    const [localImage, setLocalImage] = useState()
    const [modal, setModal] = useState(false)
    const [content, setContent] = useState()
    const [storyView, setStoryView] = useState(false)
    const snapPoints = useMemo(() => ['25%'], []);
    const sheetRef = useRef(null);

    const OpenButtomSheet = () => sheetRef?.current?.expand()
    const closeBottomSheet = () => sheetRef.current?.close();
    const handleCollapsePress = () => sheetRef.current?.collapse();
    const renderBackdrop = (props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    );

    useEffect(() => {
        GetStoryInfo()
    }, [])

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setLocalImage(uri)
            setModal(true)
        }
    };

    const HandleTextContent = (text) => {
        setContent(text)
    }
    const SendStatus = async () => {
        await UploadStory(localImage, content)
        setModal(false)
    }


    const StoryModal = () => {
        return (

            <Modal
                animationType="fade"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                    setModal(false);
                }}
            >
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: colors.BLACK }}>
                    <View style={{ height: "90%", justifyContent: "center", alignItems: "center" }} >
                        <Image source={{ uri: localImage }} style={{ height: 500, width: 500 }} />
                    </View>
                    <View style={{ width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, }} >
                        <View style={[styles.InputBox, { backgroundColor: darkMode ? colors.SEARCH_BG_DARK : colors.SEARCH_BG }]}>
                            <Entypo name="emoji-happy" size={28} color={darkMode ? colors.CHARCOLE_DARK : colors.SEARCH_TEXT} style={{ marginLeft: 10 }} />
                            <TextInput
                                placeholder="Write a caption ..."
                                placeholderTextColor={darkMode ? colors.CHARCOLE_DARK : colors.SEARCH_TEXT}
                                onChangeText={HandleTextContent}
                                style={[styles.InputStyle, { fontFamily: Font.Medium, fontSize: 15, color: darkMode ? colors.CHARCOLE_DARK : colors.SEARCH_TEXT }]} />
                        </View>
                        <TouchableOpacity
                            onPress={SendStatus}
                            style={{ backgroundColor: colors.MAIN_COLOR, justifyContent: "center", alignItems: 'center', width: 45, height: 45, borderRadius: 25 }} >
                            <Feather name="send" size={24} color={colors.WHITE} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };
    const GetTime = (timestamp) => {
        const timeStampData = Number(timestamp)
        const date = new Date(timeStampData);
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString('en-US', options);
    };

    const StoryViewMOdal = () => {
        return (

            <Modal
                animationType="fade"
                transparent={true}
                visible={storyView}
                onRequestClose={() => {
                    setStoryView(false);
                }}
            >
                <GestureHandlerRootView style={{ flex: 1 }}>

                    <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: colors.BLACK }}>
                        <View style={{ width: width - 10, marginLeft: 10, alignItems: 'center', flexDirection: "row", gap: 10 }} >
                            <AntDesign name="arrowleft" size={28} color={colors.WHITE} onPress={() => setStoryView(false)} />
                            <Image source={{ uri: image }} style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: colors.MAIN_COLOR }} />
                            <View style={{ gap: 5 }}>
                                <Text style={{ fontFamily: Font.Regular, color: colors.WHITE, fontSize: 18 }}>My story</Text>
                                <Text style={{ fontFamily: Font.Light, color: colors.WHITE, fontSize: 14 }}>{GetTime(storyContent?.created_at)}</Text>
                            </View>
                        </View>
                        <View style={{ height: "90%", justifyContent: "center", alignItems: "center", }} >
                            <Image source={{ uri: userStory }} style={{ height: 500, width: 500 }} />
                            {storyContent && storyContent.content &&
                                <Text style={{ fontFamily: Font.Regular, color: colors.WHITE, fontSize: 18, marginTop: 40 }}>{storyContent.content}</Text>
                            }
                            <TouchableOpacity activeOpacity={0.5} onPress={OpenButtomSheet} style={{ flexDirection: "row", height: "auto", marginTop: 40, alignItems: 'center', gap: 5 }} >
                                <Feather name="eye" size={30} color={colors.WHITE} />
                                <Text style={{ color: darkMode ? colors.WHITE : colors.BLACK, fontSize: 18, fontFamily: Font.Bold }}>{Viewerinfo ? Viewerinfo.length : 0}</Text>

                            </TouchableOpacity>
                        </View>
                        <BottomSheet
                            ref={sheetRef}
                            index={-1}
                            backgroundStyle={{ backgroundColor: colors.MAIN_COLOR, }}
                            enablePanDownToClose={true}
                            snapPoints={snapPoints}
                            backdropComponent={renderBackdrop}
                            style={{}}
                            handleStyle={{ backgroundColor: colors.MAIN_COLOR, height: 40, width: "97%", alignSelf: "center" }}
                            handleIndicatorStyle={{ backgroundColor: colors.WHITE }}
                        >
                            <View style={{ flex: 1, backgroundColor: darkMode ? colors.BLACK : colors.WHITE }} >
                                {Viewerinfo && Viewerinfo?.map((data, index) => {
                                    return (
                                        <View style={{ width, height: 60, flexDirection: 'row', marginLeft: 10, gap: 25, marginTop: 20, alignItems: 'center' }} key={index} >
                                            <Image source={{ uri: data.profile_pic }} style={{ height: 55, width: 55, borderRadius: 30 }} />
                                            <View>
                                                <Text style={{ fontFamily: Font.Medium, color: darkMode ? colors.WHITE : colors.BLACK, fontSize: 20 }} >{data.saved_name}</Text>
                                                <Text style={{ fontFamily: Font.Light, color: darkMode ? colors.WHITE : colors.BLACK, fontSize: 15 }} >{GetTime(data.time)}</Text>
                                            </View>

                                        </View>

                                    )
                                })}

                            </View>
                        </BottomSheet>
                    </View>
                </GestureHandlerRootView>
            </Modal >
        );
    };
    const User_image = require("../assets/user1.jpg")
    return (
        <>
            <View style={{ width: width - 30, marginLeft: 15, marginTop: 5, flexDirection: 'row', gap: 15, borderBottomWidth: 0.5, borderColor: darkMode ? colors.CHARCOLE_DARK : colors.GREY, paddingBottom: 10 }}>
                <View style={{ gap: 5, justifyContent: 'center', width: 80, alignItems: 'center', }}>
                    <View style={{ height: 70, width: 70, justifyContent: 'center', alignItems: 'center', position: 'relative', }} >
                        <Image source={image ? { uri: image } : User_image} style={{ borderRadius: 35, borderWidth: 1, borderColor: colors.BLACK, height: 70, width: 70 }} />
                        <TouchableOpacity activeOpacity={0.5} onPress={pickImage} style={{ position: 'absolute', backgroundColor: colors.MAIN_COLOR, height: 25, width: 25, borderRadius: 20, alignItems: 'center', justifyContent: 'center', bottom: -4, right: -4 }} >
                            <SimpleLineIcons name="camera" size={15} color={colors.WHITE} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontFamily: Font.Regular, fontSize: 12, color: darkMode ? colors.WHITE : colors.CHARCOLE }} >Add Story</Text>
                </View>
                {
                    userStory ?
                        <TouchableOpacity style={{ gap: 5, justifyContent: 'center', width: 80, alignItems: 'center', }} onPress={() => setStoryView(true)} >
                            <Image source={{ uri: userStory }} style={{ borderRadius: 35, borderWidth: 1, borderColor: colors.MAIN_COLOR, height: 70, width: 70 }} />
                            <Text style={{ fontFamily: Font.Regular, fontSize: 12, color: darkMode ? colors.WHITE : colors.CHARCOLE }} >My Story</Text>
                        </TouchableOpacity> : null
                }
            </View>
            <View style={{ marginLeft: 20, marginTop: 15 }}>
                <Text style={{ fontFamily: Font.Regular, fontSize: 12, color: darkMode ? colors.WHITE : colors.CHARCOLE }} >Recent Updates</Text>
            </View>
            {StoryModal()}
            {StoryViewMOdal()}
        </>
    )
}

export default Mystory

const styles = StyleSheet.create({
    InputBox: {
        width: "82%",
        height: 50,
        backgroundColor: "blue",
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        // marginLeft: ,
        justifyContent: "space-around"
    },
    InputStyle: {
        width: "90%",
        borderRadius: 25,
        height: "100%",
        paddingLeft: 10
    }
})