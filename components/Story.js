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

const Story = (item) => {
    const { user, darkMode, image } = useContext(AuthContext)

    return (
        <TouchableOpacity style={{ width, flexDirection: 'row', alignItems: "center", gap: 12, marginVertical: 13 }} >
            <Image source={{ uri: item.data.image }} style={{ height: 60, width: 60, borderRadius: 40, marginLeft: 15, borderWidth: 1, borderColor: colors.MAIN_COLOR }} />
            <View style={{ gap: 5 }} >
                <Text style={{ fontFamily: Font.Light, fontSize: 18, color: darkMode ? colors.WHITE : colors.CHARCOLE }} >{item.data.name}</Text>
                <Text style={{ fontFamily: Font.Light, fontSize: 12, color: darkMode ? colors.WHITE : colors.CHARCOLE }} >{item.data.time}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default Story

const styles = StyleSheet.create({})