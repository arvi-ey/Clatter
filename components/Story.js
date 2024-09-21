import 'react-native-gesture-handler';
import React, { useRef, useState, useMemo, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, FlatList, Pressable, TouchableOpacity, Modal } from 'react-native';
import { colors } from './Theme';
import { AntDesign } from '@expo/vector-icons';
const { height, width } = Dimensions.get('window');
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import { supabase } from '../lib/supabase'

const Story = (item) => {
    const { darkMode, StatusViewed, uid, storyviewed } = useContext(AuthContext)
    const [storyView, setStoryView] = useState(false)


    const GetTime = (timestamp) => {
        const timeStampData = Number(timestamp)
        const date = new Date(timeStampData);
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString('en-US', options);
    };

    const HandleView = () => {
        setStoryView(true)
        const viewedObj = {}
        viewedObj.viewed = Date.now()
        viewedObj.viewer = uid
        viewedObj.status_id = item.data.id
        viewedObj.status_owner = item.data.uploader
        StatusViewed(viewedObj)
    }
    console.log("This ", storyviewed)

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
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: colors.BLACK }}>
                    <View style={{ width: width - 10, marginLeft: 10, alignItems: 'center', flexDirection: "row", gap: 10 }} >
                        <AntDesign name="arrowleft" size={28} color={colors.WHITE} onPress={() => setStoryView(false)} />
                        <Image source={{ uri: item.data.user_image }} style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: colors.MAIN_COLOR }} />
                        <View style={{ gap: 5 }}>
                            <Text style={{ fontFamily: Font.Regular, color: colors.WHITE, fontSize: 18 }}>{item.data.saved_name}</Text>
                            <Text style={{ fontFamily: Font.Light, color: colors.WHITE, fontSize: 14 }}>{GetTime(item.data.created_at)}</Text>
                        </View>
                    </View>
                    <View style={{ height: "90%", justifyContent: "center", alignItems: "center", }} >
                        <Image source={{ uri: item.data.image }} style={{ height: 500, width: 500 }} />
                        {item.data && item.data.content &&
                            <Text style={{ fontFamily: Font.Regular, color: colors.WHITE, fontSize: 18, marginTop: 40 }}>{item.data.content}</Text>
                        }
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <TouchableOpacity style={{ width, flexDirection: 'row', alignItems: "center", gap: 12, marginVertical: 13 }} onPress={HandleView} >
            <Image source={{ uri: item.data.user_image }} style={{ height: 60, width: 60, borderRadius: 40, marginLeft: 15, borderWidth: 1, borderColor: colors.MAIN_COLOR, padding: 5 }} />
            <View style={{ gap: 5 }} >
                <Text style={{ fontFamily: Font.Light, fontSize: 18, color: darkMode ? colors.WHITE : colors.CHARCOLE }} >{item.data.saved_name}</Text>
                <Text style={{ fontFamily: Font.Light, fontSize: 12, color: darkMode ? colors.WHITE : colors.CHARCOLE }} >{GetTime(item.data.created_at)}</Text>
            </View>
            {StoryViewMOdal()}
        </TouchableOpacity>
    )
}

export default Story

const styles = StyleSheet.create({})