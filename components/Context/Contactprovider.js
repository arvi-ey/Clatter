import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './Authprovider';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase'
import { err } from 'react-native-svg';

export const ContactContext = createContext();

const ContactProvider = ({ children }) => {
    const { uid, FetchSaVedContactData, savedContact, setSavedContact } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [contact, setContact] = useState()
    const [messagedContact, SetmessagedContact] = useState()


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

    const AddChatContact = async (name, id) => {
        setLoading(true)
        try {

            const { data, error } = await supabase
                .from('Savedcontact')
                .update({ saved_name: name })
                .match({
                    user_id: uid,
                    saved_id: id,
                });
            if (error) {
                setLoading(false)
                console.log(error)
            }
            return data
        }
        catch (err) {
            setLoading(false)
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

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

                if (payload.new && payload.new.user_id === uid) {
                    FetchSaVedContactData()
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    };

    const GetuserMessaged = async () => {
        try {
            let { data: messages, error } = await supabase
                .from('message')
                .select('profiles(*)')
                .or(`reciver.eq.${uid}`);

            if (error) throw error;
            const uniqueProfiles = messages.reduce((acc, message) => {
                if (!acc.some(profile => profile.id === message.profiles.id)) {
                    acc.push(message.profiles);
                }
                return acc;
            }, []);
            SetmessagedContact(uniqueProfiles)

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };


    value = { AddChatContact, SubscribeToContactChange, loading, messagedContact, AddNewContact, FetchByPhone, GetuserMessaged }

    return (
        <ContactContext.Provider value={value}>
            {children}
        </ContactContext.Provider>
    );
};

export default ContactProvider;
