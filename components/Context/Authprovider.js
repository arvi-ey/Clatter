import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';



export const AuthContext = createContext({});

export default AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [user, setuser] = useState({})
    const [loggedIn, setIsloggedIn] = useState(false)
    const [firstLoad, setFirstLoad] = useState(false)
    const [imageLoading,setImageLoading] = useState(false)

    const IP = `http://192.168.29.222:5000`

    const User_image = require("../../assets/User_profile.png")

    useEffect(() => {
        AppLoaded()
        GetUSerOnce()
    }, [])


    const EditUser = async (data) => {
        const differences = Object.keys(data).filter(key => data[key] !== user[key]);
        if (differences.length > 0) {
            const changedData = {}
            differences.forEach(key => {
                changedData[key] = data[key]
            });
            setLoading(true)
            try {
                const response = await axios.patch(`${IP}/user/${user._id}`, changedData)
                if (response.data === "This email already exists") {
                    Alert.alert(response.data)
                    setLoading(false)
                    return
                }
                setuser({ ...user, ...changedData });
            }
            catch (err) {
                console.error(err)
            }
            finally {
                setLoading(false)
            }
        }
        else {
            Alert.alert("Make Changes to Update")
        }
    };

    const GetUSerOnce = async () => {
        const token = await GetToken();
        if (token) {
            try {
                const response = await axios.get(`${IP}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("GET USER ONCE CALLED")
                setuser(response.data.user);
            } catch (error) {
                if (error.response) {
                    console.log("Response data:", error.response.data);
                    console.log("Response status:", error.response.status);
                    console.log("Response headers:", error.response.headers);
                } else if (error.request) {
                    console.log("Request data:", error.request);
                } else {
                    console.log("Error message:", error.message);
                }
                console.log("Message happening", error.message);
            }
        } else {
            console.log("Token is not set yet, Go to login");
            return;
        }
    };


    const GetToken = async () => {
        try {
            const token = await SecureStore.getItemAsync("token")
            if (token) setIsloggedIn(true)
            return token ? token : null
        }
        catch (e) {
            console.error(e.message)
            return null
        }
    }




    const SignIn = async (data, Navigation) => {
        setLoading(true)
        try {
            const response = await axios.post(`${IP}/auth/signin`, data)
            if (response.data === "Email dosen't exist") Alert.alert(response.data)
            else if (response.data === "Password is incorrect") Alert.alert(response.data)
            else {
                await SecureStore.setItemAsync("token", response.data.token)
                const { name, email, _id, number } = response.data.user
                setuser({ _id, name, email, number })
                Navigation.replace("Profile")
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
    const CreateUser = async (data, Navigation) => {
        try {
            setLoading(true);
            const response = await axios.post(`${IP}/auth/signup`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data === "Email already exists") {
                Alert.alert("Email already exists")
                setLoading(false)
                return
            }
            else if (response.data === "Mobile number already exists") {
                Alert.alert("Mobile number already exists")
                setLoading(false)
                return
            } else {
                setTimeout(() => {
                    setLoading(false);
                    Navigation.goBack()
                }, 900);
            }

        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            Alert.alert('Error', 'Failed to create user');
        }
    };
    const AppLoaded = async () => {
        const value = await AsyncStorage.getItem("loaded")
        if (value !== null) setFirstLoad(true)
        else setFirstLoad(false)
    }

    const UploadProfileImage = async (image)=>{
        if(!image){
            return
        }
        setImageLoading(true)
        const formData = new FormData();
        formData.append('image', {
            uri: image,
            type: 'image/jpeg', 
            name: 'profile.jpg',
        });
            try {
                const response = await axios.post(`${IP}/image/${user._id}`,formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response) {
                    setuser({
                        ...user,
                        image:{data:response.data.data,contenType:response.data.contenType}});
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                Alert.alert('Error updating profile');
            }
            finally{
                setImageLoading(false)
            }
    }

    const value = { loading, setuser, SignIn, user, CreateUser, GetUSerOnce, EditUser, loggedIn, firstLoad,UploadProfileImage,imageLoading }
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider >
    )

}
