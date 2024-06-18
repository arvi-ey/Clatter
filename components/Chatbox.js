import { StyleSheet, Text, View, Dimensions, SafeAreaView, Platform, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import { colors } from './Theme';
const { height, width } = Dimensions.get('window');

const Chatbox = ({ route, navigation }) => {
    const { user } = useContext(AuthContext)
    const ContactDetails = route.params
    const image = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.HeaderStyle} >
                    <View>
                        <Image source={{ uri: image }}
                            style={{ height: 45, width: 45, borderRadius: 30, resizeMode: "cover" }}
                        />
                    </View>
                    <View>
                        <Text style={[styles.HeaderTextStyle, { color: user.dark_mode ? colors.WHITE : colors.BLACK }]} >{ContactDetails.saved_name}</Text>
                    </View>
                </View>
            ),
            headerTitleStyle: {
                fontFamily: Font.Bold,
                fontSize: 20,
                color: user.dark_mode ? colors.WHITE : colors.BLACK
            },
            headerStyle: {
                backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE,
            },
            headerTintColor: user.dark_mode ? colors.WHITE : colors.BLACK
        });
    }, [navigation]);
    return (
        <View>
            <Text>Chatbox</Text>
        </View>
    )
}

export default Chatbox

const styles = StyleSheet.create({

    HeaderStyle: {
        width: width,
        marginRight: 100,
        height: 50,
        flexDirection: "row",
        alignItems: 'center',
        gap: 20
    },
    HeaderTextStyle: {
        fontFamily: Font.Bold,
        fontSize: 20,

    }
})