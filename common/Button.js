import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'

const Button = ({ title, press, loading, buttonStyle, textStyle, loaderColor, loaderSize, activeOpacity }) => {
    return (
        <TouchableOpacity style={buttonStyle} onPress={press} activeOpacity={activeOpacity} >
            {loading === true ? <ActivityIndicator size={loaderSize ? loaderSize : "small"} color={loaderColor ? loaderColor : "black"} /> :
                <Text style={textStyle} >{title ? title : "button title"}</Text>
            }
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({})