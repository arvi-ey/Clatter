import { StyleSheet, Text, View, Dimensions, SafeAreaView, Platform, TouchableOpacity, Image } from 'react-native'
import React from 'react'
const { height, width } = Dimensions.get('window');
import { useState, useEffect, useContext } from 'react';
import { colors } from './Theme';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { ContactContext } from './Context/Contactprovider';
const ContactList = ({ navigation }) => {
    const { data } = useContext(ContactContext)
    const { user } = useContext(AuthContext)
    const image = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

    console.log(data)
    React.useLayoutEffect(() => {
        navigation.setOptions({
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
        <SafeAreaView style={[styles.contactListContainer, { backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE }]} >
            <ScrollView>
                <TouchableOpacity style={styles.addContact} onPress={() => navigation.navigate("AddContact")} activeOpacity={0.8} >
                    <View style={{ backgroundColor: colors.MAIN_COLOR, padding: 10, borderRadius: 50 }} >
                        <Ionicons name="person-add" size={24} color={user.dark_mode ? colors.BLACK : colors.WHITE} />
                    </View>
                    <Text style={{ fontFamily: Font.Medium, fontSize: 15, color: user.dark_mode ? colors.WHITE : colors.BLACK }} >
                        Add New Contact
                    </Text>
                </TouchableOpacity>
                {
                    data?.userData?.map((value, key) => {
                        return (
                            <TouchableOpacity key={key} style={styles.Contact_Container} >
                                <View >
                                    <Image source={{ uri: image }}
                                        style={{ height: 50, width: 50, borderRadius: 30, resizeMode: "cover" }}
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontFamily: Font.Medium, fontSize: 15, color: user.dark_mode ? colors.WHITE : colors.BLACK }}  >{value.saved_name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }

            </ScrollView>

        </SafeAreaView>
    )
}

export default ContactList

const styles = StyleSheet.create({
    contactListContainer: {
        flex: 1,
        backgroundColor: 'red',
        paddingTop: Platform.OS === 'android' ? 10 : 0,
        alignItems: 'center',
        gap: 20
    },
    addContact: {
        flexDirection: "row",
        width: width - 10,
        alignItems: 'center',
        gap: 20,
        paddingLeft: 10,
    },
    Contact_Container: {
        width: width - 10,
        alignItems: 'center',
        paddingLeft: 10,
        flexDirection: "row",
        marginTop: 20,
        gap: 15
    },
})