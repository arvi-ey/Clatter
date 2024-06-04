import { StyleSheet, Text, View, Dimensions, SafeAreaView, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
const { height, width } = Dimensions.get('window');
import { useState, useEffect, useContext } from 'react';
import { colors } from './Theme';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
const ContactList = ({ navigation }) => {
    const { user } = useContext(AuthContext)
    return (
        <SafeAreaView style={[styles.contactListContainer, { backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE }]} >
            <View style={{ alignSelf: "flex-start", flexDirection: "row" }} >
                <Ionicons name="chevron-back" size={40} color={colors.MAIN_COLOR} onPress={() => navigation.goBack()} />
            </View>
            <TouchableOpacity style={styles.addContact} onPress={() => navigation.navigate("AddContact")} activeOpacity={0.8} >
                <View style={{ backgroundColor: colors.MAIN_COLOR, padding: 10, borderRadius: 50 }} >
                    <Ionicons name="person-add" size={24} color={user.dark_mode ? colors.BLACK : colors.WHITE} />
                </View>
                <Text style={{ fontFamily: Font.Medium, fontSize: 15, color: user.dark_mode ? colors.WHITE : colors.BLACK }} >
                    Add New Contact
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default ContactList

const styles = StyleSheet.create({
    contactListContainer: {
        flex: 1,
        backgroundColor: 'red',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        alignItems: 'center',
        gap: 20
    },
    addContact: {
        flexDirection: "row",
        width: width - 10,
        alignItems: 'center',
        gap: 20,
        paddingLeft: 10,
    }
})