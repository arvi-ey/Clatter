import React, { createContext, useState, useEffect, useContext, useRef, } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase'

export const AuthContext = createContext({});
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [firstLoad, setFirstLoad] = useState(false)
    const [session, setSession] = useState(null)
    const [uid, setuid] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        AppLoaded()
        // supabase.auth.getSession().then(({ data: { session } }) => {
        //     setSession(session)
        //     setuid(session?.user?.id)
        // })
        // supabase.auth.onAuthStateChange((_event, session) => {
        //     setSession(session)
        //     setuid(session?.user?.id)
        // })
        GetUserOnce()
    }, [])

    const AddUser = async (userId, profileData, navigation) => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({ id: userId, ...profileData }, { onConflict: ['id'] }); // 'id' is the primary key

            if (error) {
                throw error;
            }
            if (!error) navigation.navigate("Profile")
            setLoading(false)
        } catch (error) {
            console.error('Error adding to profile:', error.message);
            setLoading(false)
            return null;
        }
        finally {
            setLoading(false)

        }
    };

    const UpdateUser = async (userId, updates) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId);

            if (error) {
                throw error;
            }
            return data;
        } catch (error) {
            console.error('Error updating user:', error.message);
            return null;
        }
    };

    const GetUserOnce = async () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setuid(session?.user?.id)
        })
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setuid(session?.user?.id)
        })
        if (!session?.user?.id) {
            console.log('User ID is null, cannot fetch user');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session?.user?.id)
                .single();

            if (error) {
                throw error;
            }
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error.message);
            return null;
        }
    }


    const VerifyOTP = async (phone, otp) => {
        setLoading(true);
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.verifyOtp({
                phone: phone,
                token: otp,
                type: 'sms',
            });

            if (error) {
                throw error;
            }
            if (session?.user.id) {
                setSession(session);
                setuid(session?.user.id);
                return session.user.id
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };



    const AppLoaded = async () => {
        const value = await AsyncStorage.getItem("loaded")
        if (value !== null) setFirstLoad(true)
        else setFirstLoad(false)
    }


    const value = { session, loading, VerifyOTP, firstLoad, AddUser, GetUserOnce, user, uid, UpdateUser, AppLoaded }
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider >
    )

}
