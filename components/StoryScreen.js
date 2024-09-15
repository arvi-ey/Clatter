import 'react-native-gesture-handler';
import React, { useRef, useState, useMemo, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, FlatList, Pressable, TouchableOpacity } from 'react-native';
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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Font } from '../common/font';
import { supabase } from '../lib/supabase'
import Story from './Story';

const StoryScreen = ({ navigation }) => {
    const { user, darkMode, image } = useContext(AuthContext)


    const Data = [
        {
            image: "https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg",
            name: "Arviey",
        }
    ]

    const MyStory = () => {
        return (
            <>
                <View style={{ width: width - 30, marginLeft: 15, marginTop: 5, flexDirection: 'row', gap: 15, borderBottomWidth: 0.5, borderColor: darkMode ? colors.CHARCOLE_DARK : colors.GREY, paddingBottom: 10 }}>
                    <View style={{ gap: 5, justifyContent: 'center', width: 80, alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => console.log("HEllo")} style={{ height: 70, width: 70, justifyContent: 'center', alignItems: 'center' }} >
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
                    <Text style={{ fontFamily: Font.Regular, fontSize: 15, color: darkMode ? colors.WHITE : colors.CHARCOLE }}  >All updates</Text>
                </View>
            </>
        )
    }

    return (
        <View style={{ backgroundColor: darkMode ? colors.BLACK : colors.WHITE, flex: 1, position: "relative" }} >
            <FlatList
                ListHeaderComponent={MyStory}
                data={Data}
                renderItem={({ item }) => <Story data={item} />}
            />

        </View>
    )
}

export default StoryScreen

const styles = StyleSheet.create({})