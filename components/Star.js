import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Star = ({ ratingValue = 2, maxRatingCount = 5, size = 24, selectedRatingColor = "black", unSelectedRatingColor = "black" }) => {
    const [state, setState] = useState([])

    useEffect(() => {
        const arr = []
        const rating = Math.round(ratingValue)
        for (let i = 0; i < maxRatingCount; i++) {
            const obj = {}
            obj.value = false
            arr.push(obj)
        }
        for (let i = 0; i < rating; i++) {
            arr[i].value = true
        }
        setState(arr)

    }, [ratingValue, maxRatingCount])


    return (
        <View style={{ flexDirection: "row" }} >
            {
                state && state.map((val, key) => {
                    return (
                        <View key={key}>
                            {
                                val.value === true ?
                                    <FontAwesome name="star" size={size} color={selectedRatingColor} />
                                    :
                                    <FontAwesome name="star-o" size={size} color={unSelectedRatingColor} />
                            }
                        </View>
                    )
                })
            }
        </View>
    )
}

export default Star

const styles = StyleSheet.create({})