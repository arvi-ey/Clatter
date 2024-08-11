import React, { createContext, useState, useEffect, useContext, useRef, } from 'react';
import { supabase } from '../../lib/supabase'
import { AuthContext } from './Authprovider';

export const MessageContext = createContext({});

export default Messageprovider = ({ children }) => {
    const { user, uid } = useContext(AuthContext);
    const [message, setMessage] = useState()

    const SendMessage = async (mesageTeext) => {
        try {
            const { data, error } = await supabase
                .from('message')
                .insert([mesageTeext]);

            if (error) {
                throw error;
            }
            console.log('Inserted data:', data);
            setMessage(data)
        } catch (error) {
            console.error('Error inserting data:', error.message);
        }
    };

    const value = { message, SendMessage }
    return (
        <MessageContext.Provider value={value} >
            {children}
        </MessageContext.Provider >
    )
}