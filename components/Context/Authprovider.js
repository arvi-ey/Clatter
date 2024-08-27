import React, { createContext, useState, useEffect, useContext, useRef, } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase'
import country from '../../common/country';
import { err } from 'react-native-svg';

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
    const [loggedIn, setLoggedIN] = useState(false)
    const [darkMode, setDarkMode] = useState()
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false)
    const [savedContact, setSavedContact] = useState()
    const [country, setCountry] = useState()

    useEffect(() => {
        AppLoaded()
        LoggedIN()
    }, [])

    useEffect(() => {
        if (uid) {
            subscribeToUserChanges(uid)
        }
    }, [uid])

    useEffect(() => {
        GetUserOnce()
    }, [loggedIn])

    useEffect(() => {
        if (user) {
            setDarkMode(user?.dark_mode)
            // if (user.profile_pic) downloadImage(user.profile_pic)
            FetchSaVedContactData()
        }
    }, [user])

    const AddCountry = async (country) => {
        try {
            const { data, error } = await supabase
                .from('country')
                .upsert(country)
        }
        catch (error) {
            console.log(error)
        }
    }

    const FetchCountry = async () => {
        try {
            const { data, error } = await supabase
                .from('country')
                .select('*')
            if (!error) setCountry(data)
        }
        catch (error) {
            console.log(error)

        }
    }


    const AddUser = async (userId, profileData, navigation) => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({ id: userId, ...profileData }, { onConflict: ['id'] });

            if (error) {
                throw error;
            }
            if (!error) navigation.navigate("Profile")
            await AsyncStorage.setItem("loggedIN", "TRUE")
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

    const FetchSaVedContactData = async () => {
        try {
            let { data: Savedcontact, error } = await supabase
                .from('Savedcontact')
                .select(`user_id,saved_name,profiles(*)`)
                .eq('user_id', uid);
            setSavedContact(Savedcontact)
        }
        catch (error) {
            console.log(error)
        }
    };


    const subscribeToUserChanges = (userId) => {
        const subscription = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, (payload) => {
                setUser(payload.new);
            })
            .subscribe();
        return () => {
            supabase.removeChannel(subscription);
        };
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
            setUser({ ...user, ...updates })
            return data;
        } catch (error) {
            console.error('Error updating user:', error.message);
            return null;
        }
    };

    const uploadImage = async (imageUri) => {
        setImageLoading(true)
        try {
            const arraybuffer = await fetch(imageUri).then((res) => res.arrayBuffer())
            const filename = `${uid}.jpg`;
            await supabase
                .storage
                .from('avatars')
                .remove([filename]);

            const { data, error } = await supabase
                .storage
                .from('avatars')
                .upload(filename, arraybuffer, {
                    contentType: 'image/jpeg',
                    upsert: true
                });
            if (error) {
                console.log(error);
                setImageLoading(false)
                return
            }
            const { data: publicUrlData } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(filename);

            const publicURL = publicUrlData.publicUrl;

            if (!publicURL) {
                setImageLoading(false)
                throw new Error('Failed to retrieve public URL.');
            }

            console.log('Public URL:', publicURL);
            UpdateUser(uid, { profile_pic: publicURL })
            setImageLoading(false)
            // downloadImage(filename)
        } catch (error) {
            setImageLoading(false)
            console.log('Error uploading image:', error.message);
        }
        finally {
            setImageLoading(false)

        }
    };

    const downloadImage = async (filename) => {
        setImageLoading(true)
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
                setImage(fr.result)
                setImageLoading(false)
            };
        } catch (error) {
            console.error('Error:', error.message);
            setImageLoading(false)
        }
        finally {
            setImageLoading(false)

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
            // console.log('User ID is null, cannot fetch user');
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
    const LoggedIN = async () => {
        const value = await AsyncStorage.getItem("loggedIN")
        if (value !== null) setLoggedIN(true)
        else setLoggedIN(false)
    }


    const value = { FetchSaVedContactData, setSavedContact, country, FetchCountry, savedContact, image, imageLoading, setImage, downloadImage, uploadImage, loggedIn, session, loading, VerifyOTP, firstLoad, AddUser, GetUserOnce, user, uid, UpdateUser, AppLoaded, darkMode }
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider >
    )

}
