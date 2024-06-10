import { StyleSheet, Text, View, Dimensions, SafeAreaView, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
const { height, width } = Dimensions.get('window');
import { useState, useEffect, useContext } from 'react';
import { colors } from './Theme';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import axios from 'axios';
const ContactList = ({ navigation }) => {
    const { user } = useContext(AuthContext)
    const [savedContact, setSavedContact] = useState([])
    const [data, setData] = useState([])

    console.log(data.userData)



    useEffect(() => {
        if (user) setSavedContact(user.saved_contact)
    }, [user])

    useEffect(() => {
        fetchContact()
    }, [savedContact])

    const fetchContact = async () => {
        if (savedContact) {
            let userData = []
            for (let i = 0; i < savedContact.length; i++) {
                let id = savedContact[i].id
                try {
                    const result = await axios.get(`http://192.168.29.222:5000/getContacts/${id}`)
                    userData.push(result.data)
                }
                catch (err) {
                    console.err(err)
                }
            }
            setData({ ...data, userData })
        }
    }


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
    }
})