import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from './Theme'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
const FirstScreen = () => {

    const [isVisited, setisVisited] = useState(false)
    useEffect(() => {
        AsyncStorageData()
    }, [])
    const AsyncStorageData = async () => {
        try {
            const value = await AsyncStorage.getItem("visited");
            console.log(value)
            if (value) setisVisited(true)

        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: colors.WHITE }} >


        </View>
    )
}

export default FirstScreen

const styles = StyleSheet.create({})