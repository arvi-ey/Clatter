import { StyleSheet, Text, View, Dimensions, SafeAreaView, Platform, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
const { height, width } = Dimensions.get('window');
import { useState, useEffect, useContext, useRef } from 'react';
import { colors } from './Theme';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import { supabase } from '../lib/supabase'


const ContactList = ({ navigation }) => {
    const { user, savedContact } = useContext(AuthContext)
    const [data, setData] = useState()
    const image = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

    useEffect(() => {
        setData(savedContact)
    }, [savedContact])

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                fontFamily: Font.Bold,
                fontSize: 20,
                color: user.dark_mode ? colors.WHITE : colors.BLACK,
            },
            headerStyle: {
                backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE,
            },
            headerTintColor: user.dark_mode ? colors.WHITE : colors.BLACK,
        });
    }, [navigation]);


    const AddContact = () => {
        return (
            <TouchableOpacity style={styles.addContact} onPress={() => navigation.navigate("AddContact")} activeOpacity={0.8}>
                <View style={{ backgroundColor: colors.MAIN_COLOR, padding: 10, borderRadius: 50 }}>
                    <Ionicons name="person-add" size={24} color={user.dark_mode ? colors.BLACK : colors.WHITE} />
                </View>
                <Text style={{ fontFamily: Font.Medium, fontSize: 15, color: user.dark_mode ? colors.WHITE : colors.BLACK }}>
                    Add New Contact
                </Text>
            </TouchableOpacity>
        )
    }

    const UserInfo = ({ data }) => {
        const [userImage, setuserImage] = useState()

        const GotoChat = (data) => {
            navigation.navigate('Chatbox', data);
        };
        useEffect(() => {
            if (value) downloadImage(data?.profiles?.profile_pic)
        }, [value])

        const downloadImage = async (filename) => {
            if (!filename) return
            try {
                const { data, error } = await supabase.storage
                    .from('avatars')
                    .download(filename);

                if (error) {
                    console.error('Error downloading image:', error.message);
                    return;
                }
                const fr = new FileReader();
                fr.readAsDataURL(data);
                fr.onload = () => {
                    setuserImage(fr.result)
                };
            } catch (error) {
                console.error('Error:', error.message);
                setImageLoading(false)
            }
        };

        return (
            <TouchableOpacity style={styles.Contact_Container} onPress={() => GotoChat(data)}>
                <View>
                    <Image source={userImage ? { uri: userImage } : { uri: image }} style={{ height: 50, width: 50, borderRadius: 30, resizeMode: "cover" }} />
                </View>
                <View>
                    <Text style={{ fontFamily: Font.Medium, fontSize: 15, color: user.dark_mode ? colors.WHITE : colors.BLACK }}>{data?.saved_name ? data.saved_name : data.profiles.phone}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={[styles.contactListContainer, { backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE }]}>

            <FlatList
                data={data}
                ListHeaderComponent={AddContact}
                renderItem={({ item }) => <UserInfo data={item} />}
                keyExtractor={(item, index) => index}


            />
        </SafeAreaView>
    );
};

export default ContactList;

const styles = StyleSheet.create({
    contactListContainer: {
        flex: 1,
        backgroundColor: 'red',
        paddingTop: Platform.OS === 'android' ? 10 : 0,
        alignItems: 'center',
        gap: 20,
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
        gap: 15,
    },
});
