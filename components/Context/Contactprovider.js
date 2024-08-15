import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './Authprovider';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase'

export const ContactContext = createContext();

const ContactProvider = ({ children }) => {
    const { uid } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [contact, setContact] = useState()
    const [savedContact, setSavedContact] = useState()


    useEffect(() => {
        SubscribeToContactChange()
    }, [contact])

    const AddNewContact = async (data) => {
        setLoading(true)
        const { saved_name, number } = data
        try {
            try {
                const result = await FetchByPhone(number)
                if (result && result !== null) {
                    const { data: insertData, error } = await supabase
                        .from('Savedcontact')
                        .insert([{ saved_name, number, user_id: uid, saved_id: result.id }]);
                    if (error) {
                        console.log(error)
                    }
                    setLoading(false)
                    setContact(data)
                    return data;
                }
                else Alert.alert("This phone number Does not Use Clatter")
            }
            catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.error('Error adding contact:', error.message);
            setLoading(false)
            return null;
        }
        finally {
            setLoading(false)
        }
    };

    const FetchByPhone = async (phoneNumber) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('phone', phoneNumber)
                .single();
            if (error) {
                throw error;
            }
            return data
        } catch (error) {
            console.error('Error fetching user by phone number:', error.message);
            return null;
        }
    };

    const SubscribeToContactChange = (userId) => {
        const subscription = supabase
            .channel('public:Savedcontact')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Savedcontact' }, (payload) => {
                FetchSaVedContactData()
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
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


    value = { loading, AddNewContact, savedContact, FetchByPhone, FetchSaVedContactData }

    return (
        <ContactContext.Provider value={value}>
            {children}
        </ContactContext.Provider>
    );
};

export default ContactProvider;
