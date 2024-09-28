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
import Mystory from './Mystory';

const StoryScreen = ({ navigation }) => {
    const { user, darkMode, contactStory } = useContext(AuthContext)

    return (
        <View style={{ backgroundColor: darkMode ? colors.BLACK : colors.WHITE, flex: 1, position: "relative" }} >
            <FlatList
                ListHeaderComponent={Mystory}
                data={contactStory}
                renderItem={({ item }) => <Story data={item} />}
                keyExtractor={(item, index) => index}

            />

        </View>
    )
}

export default StoryScreen

const styles = StyleSheet.create({})