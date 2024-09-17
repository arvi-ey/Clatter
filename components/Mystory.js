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

const Mystory = () => {
    const { user, darkMode, image, UploadStory } = useContext(AuthContext)
    const [localImage, setLocalImage] = useState()
    const [modal, setModal] = useState(false)
    const [content, setContent] = useState()



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
                animationType="slide"
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


    return (
        <>
            <View style={{ width: width - 30, marginLeft: 15, marginTop: 5, flexDirection: 'row', gap: 15, borderBottomWidth: 0.5, borderColor: darkMode ? colors.CHARCOLE_DARK : colors.GREY, paddingBottom: 10 }}>
                <View style={{ gap: 5, justifyContent: 'center', width: 80, alignItems: 'center', }}>
                    <TouchableOpacity onPress={pickImage} style={{ height: 70, width: 70, justifyContent: 'center', alignItems: 'center' }} >
                        <SimpleLineIcons name="camera" size={30} color={darkMode ? colors.WHITE : colors.CHARCOLE} style={{ marginRight: 10, }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: Font.Regular, fontSize: 15, color: darkMode ? colors.WHITE : colors.CHARCOLE }} >Add Story</Text>
                </View>
                <View style={{ gap: 5, justifyContent: 'center', width: 80, alignItems: 'center', }}>
                    <Image source={image ? { uri: image } : User_image} style={{ borderRadius: 35, borderWidth: 1, borderColor: colors.MAIN_COLOR, height: 70, width: 70 }} />
                    <Text style={{ fontFamily: Font.Regular, fontSize: 15, color: darkMode ? colors.WHITE : colors.CHARCOLE }} >My Story</Text>
                </View>
            </View>
            <View style={{ marginLeft: 20, marginTop: 15 }}>
                <Text style={{ fontFamily: Font.Regular, fontSize: 15, color: darkMode ? colors.WHITE : colors.CHARCOLE }}  >Recent Updates</Text>
            </View>
            {StoryModal()}
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