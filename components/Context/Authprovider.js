import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Alert } from 'react-native';



export const AuthContext = createContext({});

export default AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [user, setuser] = useState({})



    useEffect(() => {
        GetUSerOnce()
    }, [])




    const GetUSerOnce = async (id) => {
        const token = await GetToken()
        if (token) {
            try {
                const response = await axios.get('http://192.168.29.223:5000/getUser', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setuser(response.data.user)
            }
            catch (e) {
                console.log("Message", e.message)

            }
        }
        else if (id) {
            try {
                const response = await axios.get(`http://192.168.29.223:5000/getUser/${user._id}`)
                setuser(response.data)
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            console.log("Token is not set yet, Go to login")
            return
        }
    }

    const GetToken = async () => {
        try {
            const token = await SecureStore.getItemAsync("token")
            if (token !== null) return token
            else return null
        }
        catch (e) {
            console.error(e.message)
        }
    }




    const SignIn = async (data, Navigation) => {
        setLoading(true)
        try {
            const response = await axios.post('http://192.168.29.223:5000/signin', data)
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
            const response = await axios.post('http://192.168.29.223:5000/createuser', data);
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

    const value = { loading, setuser, SignIn, user, CreateUser, GetUSerOnce }
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider >
    )

}
