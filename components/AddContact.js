import { StyleSheet, Text, View, Dimensions, SafeAreaView, Platform, TouchableOpacity, TextInput, Alert } from 'react-native'
import React from 'react'
const { height, width } = Dimensions.get('window');
import { useState, useEffect, useContext } from 'react';
import { colors } from './Theme';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../common/Button';
import { ContactContext } from './Context/Contactprovider';
const AddContact = ({ navigation }) => {
    const { user } = useContext(AuthContext)
    const { AddNewContact, loading } = useContext(ContactContext)
    const [focusNumber, setFocusNumber] = useState(false)
    const [focusName, setFocusName] = useState(false)
    const [data, setData] = useState({
        saved_name: "",
        number: "",
    })

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                fontFamily: Font.Medium,
                fontSize: 25,
                color: user.dark_mode ? colors.WHITE : colors.BLACK
            },
            headerStyle: {
                backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE,
            },
            headerTintColor: user.dark_mode ? colors.WHITE : colors.BLACK,
        });
    }, [navigation]);

    const handleNumber = (value) => {
        setData({ ...data, number: value })
    }
    const handleNameChange = (value) => {
        setData({ ...data, saved_name: value })
    }

    const SaveContact = async () => {
        if (!data.saved_name.trim()) {
            Alert.alert('Enter name');
        } else if (!data.number.trim()) {
            Alert.alert('Enter mobile number');
        } else if (data.number.length < 10) {
            Alert.alert('Enter a Valid Mobile Number')
        }
        else {
            const result = await AddNewContact(data)
            if (result) console.log(result)

        }
    }

    return (
        <SafeAreaView style={[styles.AddContactContainer, { backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE }]}>
            <View style={{ gap: 25, alignItems: 'center', }}>
                <View style={[(focusName || data.saved_name.length > 0) ? styles.FocusinputContainer : user.dark_mode ? styles.darkModeInput : styles.inputContainer, {}]}>
                    <Ionicons name="person-outline" size={24} color={(focusName || data.saved_name.length > 0) ? colors.MAIN_COLOR : user.dark_mode ? colors.WHITE : colors.CHAT_DESC} />
                    <TextInput
                        onFocus={() => setFocusName(!focusName)}
                        onBlur={() => setFocusName(!focusName)}
                        style={[styles.inputBox, { color: user.dark_mode ? colors.WHITE : colors.BLACK }]}
                        value={data?.saved_name}
                        placeholder='Enter Name'
                        placeholderTextColor="gray"
                        onChangeText={handleNameChange}
                    />
                </View>
                <View style={(focusNumber || data.number.length > 0) ? styles.FocusinputContainer : user.dark_mode ? styles.darkModeInput : styles.inputContainer} >
                    <Ionicons name="phone-portrait-outline" size={24} color={(focusNumber || data.number.length > 0) ? colors.MAIN_COLOR : user.dark_mode ? colors.WHITE : colors.CHAT_DESC} />
                    <TextInput
                        onFocus={() => setFocusNumber(!focusNumber)}
                        onBlur={() => setFocusNumber(!focusNumber)}
                        style={[styles.inputBox, { color: user.dark_mode ? colors.WHITE : colors.BLACK }]}
                        value={data?.number}
                        placeholder='Enter Mobile Number'
                        placeholderTextColor="gray"
                        onChangeText={handleNumber}
                        keyboardType='number-pad'
                    />
                </View>
                <Button
                    buttonStyle={[loading === true ? styles.loadingButtonStyle : styles.buttonStyle, { backgroundColor: (user.dark_mode && loading) ? colors.BLACK : ((user.dark_mode || !user.dark_mode) && !loading) ? colors.MAIN_COLOR : colors.WHITE }]}
                    title="Add Contact"
                    textStyle={styles.textStyle}
                    activeOpacity={0.8}
                    loading={loading}
                    press={SaveContact}
                    loaderColor={colors.MAIN_COLOR}
                    loaderSize="large"
                />
            </View>
        </SafeAreaView>
    )
}

export default AddContact

const styles = StyleSheet.create({
    AddContactContainer: {
        paddingTop: Platform.OS === 'android' ? 10 : 0,
        alignItems: 'center',
        flex: 1,
        gap: 25
    },
    inputContainer: {
        borderBottomWidth: 2,
        borderBottomColor: colors.BLACK,
        width: width - 60,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    FocusinputContainer: {
        borderBottomWidth: 2,
        borderBottomColor: colors.MAIN_COLOR,
        width: width - 60,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    darkModeInput: {
        borderBottomWidth: 2,
        borderBottomColor: colors.WHITE,
        width: width - 60,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    inputBox: {
        fontFamily: Font.Bold,
        paddingLeft: 10,
        width: "100%",
        paddingVertical: 15,
        fontSize: 15
    },
    textStyle: {
        color: colors.WHITE,
        fontFamily: Font.Bold,
        fontSize: 18
    },
    buttonStyle: {
        width: width - 90,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    loadingButtonStyle: {
        width: width - 60,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.MAIN_COLOR

    }

})