import { StyleSheet, Text, View, Platform, Dimensions, TextInput, Image, TouchableOpacity, Alert, Modal } from 'react-native'
import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { colors } from './Theme'
import Button from '../common/Button'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from './Context/Authprovider'
import { Font } from '../common/font'
const { height, width } = Dimensions.get('window')
import country from "../common/country"
import { AntDesign } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { supabase } from '../lib/supabase'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Signinpage = () => {

    const { SignIn, loading } = useContext(AuthContext)
    const [focusEmail, setFocuEmail] = useState(false)
    const [countryData, setCountryData] = useState(null)
    const Navigation = useNavigation();
    const [mobileNumber, setMobileNumber] = useState()
    const [selectCountry, setSelectCountry] = useState({ label: "in", code: "91" })
    const snapPoints = useMemo(() => ['65%'], []);
    const sheetRef = useRef(null);
    const [searchCountry, setSearchCountry] = useState("")

    const OpenButtomSheet = () => sheetRef?.current?.expand()
    const closeBottomSheet = () => sheetRef.current?.close();
    const renderBackdrop = (props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    );

    useEffect(() => {
        if (country) setCountryData(country)
    }, [country])

    const handleMobile = (text) => {
        setMobileNumber(text)
    }

    const SelectContryCode = (data) => {
        setSelectCountry(data)
        closeBottomSheet()
    }

    const RenderCountrylist = ({ item }) => {
        return (
            <TouchableOpacity style={{ flexDirection: "row", marginBottom: 20, marginLeft: 20 }} onPress={() => {
                SelectContryCode(item)
            }}  >
                <View style={{ width: "15%", }}>
                    <Image source={{ uri: `https://flagpedia.net/data/flags/h80/${item.label}.png` }} style={{ height: 20, width: 30 }} />
                </View>
                <View style={{ width: "20%", }}>
                    <Text style={{ fontFamily: Font.Medium, fontSize: 15 }}>(+{item.code})</Text>
                </View>
                <View style={{ width: "60%" }}>
                    <Text style={{ fontFamily: Font.Medium, fontSize: 15 }}>{item.country} ({item.label.toUpperCase()})</Text>
                </View>
            </TouchableOpacity>
        )
    }
    const FilteredCountry = countryData?.filter(value =>
        value?.country?.toLowerCase().includes(searchCountry?.toLowerCase()) || value?.label.toLowerCase().includes(searchCountry?.toLowerCase())
    )

    const CountryListModal = () => {
        return (
            <BottomSheet
                ref={sheetRef}
                index={-1}
                backgroundStyle={{ backgroundColor: colors.WHITE }}
                enablePanDownToClose={true}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
            >
                <View >
                    <View style={styles.SearchBox}>
                        <AntDesign name="search1" size={18} color={colors.GREY} />
                        <TextInput
                            style={[{ fontFamily: Font.Medium, width: "80%" }]}
                            placeholder="Search country code..."
                            onChangeText={(text) => setSearchCountry(text)}
                            value={searchCountry}
                        />
                    </View>
                    <FlatList
                        style={[styles.dropDown]}
                        data={FilteredCountry}
                        renderItem={({ item }) => <RenderCountrylist item={item} />}
                        keyExtractor={(item, index) => index}
                        getItemLayout={(data, index) => (
                            { length: 50, offset: 50 * index, index }
                          )}
                    />
                </View>
            </BottomSheet>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container} >
                <View style={{ height: "10%", }} >
                    <View style={{ paddingLeft: 20, }}>
                        <Text style={{ fontFamily: Font.Bold, fontSize: 25 }}>Clatter</Text>
                    </View>
                    <View style={{ paddingLeft: 20, }}>
                        <Text style={{ fontFamily: Font.Bold, fontSize: 25 }}>Hi! Welcome to clatter</Text>
                    </View>
                </View>
                <View style={{ height: "90%", paddingTop: 70, paddingLeft: 16 }}>
                    <View style={{ flexDirection: 'row', gap: 10 }} >
                        <TouchableOpacity style={[styles.CountryCode]} onPress={OpenButtomSheet} >
                            <Image source={{ uri: `https://flagpedia.net/data/flags/h80/${selectCountry.label}.png` }} style={{ height: 15, width: 25 }} />
                            <Text style={{ fontFamily: Font.Bold, fontSize: 15 }}>+{selectCountry.code}</Text>
                            <AntDesign name="down" size={18} color="black" />
                        </TouchableOpacity>
                        <View style={(focusEmail || mobileNumber?.length > 0) ? styles.FocusinputContainer : styles.inputContainer} >
                            <TextInput
                                onFocus={() => setFocuEmail(!focusEmail)}
                                onBlur={() => setFocuEmail(!focusEmail)}
                                style={styles.inputBox}
                                value={mobileNumber}
                                placeholder='Enter mobile number'
                                placeholderTextColor="gray"
                                onChangeText={handleMobile}
                                keyboardType='decimal-pad'
                            />
                        </View>
                    </View>
                    {mobileNumber?.length >= 10 ?
                        <Button
                            buttonStyle={loading ? styles.loadingButtonStyle : styles.buttonStyle}
                            title="Sign IN"
                            textStyle={styles.textStyle}
                            activeOpacity={0.8}
                            loading={loading}
                            loaderColor={colors.MAIN_COLOR}
                            loaderSize="large"
                        // press={HandleSignIn}
                        />

                        : null}
                </View>
                {CountryListModal()}
            </View >
        </GestureHandlerRootView>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.BACKGROUND_COLOR,
        flex: 1,
        paddingTop: 60,
        gap: 10
    },
    inputContainer: {
        borderWidth: 2,
        borderColor: colors.BLACK,
        width: width - 150,
        borderRadius: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    FocusinputContainer: {
        borderWidth: 2.5,
        borderColor: colors.MAIN_COLOR,
        width: width - 150,
        borderRadius: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    inputBox: {
        paddingLeft: 3,
        width: "100%",
        paddingVertical: 15,
        fontSize: 15,
        fontFamily: "Ubuntu-Bold",
    },
    buttonStyle: {
        width: width - 30,
        backgroundColor: colors.MAIN_COLOR,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30
    },
    textStyle: {
        color: colors.WHITE,
        fontFamily: "Ubuntu-Bold",
        fontSize: 18
    },
    socialLogin: {
        width: width - 60,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: "row",
        gap: 50
    },
    loadingButtonStyle: {
        width: width - 30,
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.MAIN_COLOR,
        marginTop: 30

    },
    CountryCode: {
        borderWidth: 2.5,
        borderColor: colors.MAIN_COLOR,
        width: 100,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        justifyContent: "space-around"
    },
    countryList: {
        width: width,
        height: height,
        borderRadius: 12,
        marginTop: 10,
    },
    SearchBox: {
        borderBottomColor: colors.BLACK,
        borderBottomWidth: 1,
        marginLeft: 10,
        marginBottom: 5,
        width: width - 20,
        flexDirection: "row",
        alignItems: 'center',
        gap:5,
        paddingLeft:10
    },
    dropDown: { width: "100%", height: "100%", borderRadius: 12, overflow: 'hidden', paddingVertical: 10, }
})
export default Signinpage

