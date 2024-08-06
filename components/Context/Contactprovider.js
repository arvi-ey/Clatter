import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './Authprovider';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase'

export const ContactContext = createContext();

const ContactProvider = ({ children }) => {
    const { user, uid } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)




    const AddNewContact = async (data) => {
        setLoading(true)
        const { saved_name, number } = data
        try {
            const { data, error } = await supabase
                .from('Savedcontact')
                .insert([{ saved_name, number, user_id: uid }]);

            if (error) {
                throw error;
            }
            setLoading(false)
            return data;
        } catch (error) {
            console.error('Error adding contact:', error.message);
            setLoading(false)
            return null;
        }
        finally {
            setLoading(false)
        }
    };

    value = { loading, AddNewContact }

    return (
        <ContactContext.Provider value={value}>
            {children}
        </ContactContext.Provider>
    );
};

export default ContactProvider;
