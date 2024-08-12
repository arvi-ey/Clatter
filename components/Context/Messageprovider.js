import React, { createContext, useState, useEffect, useContext, useRef, } from 'react';
import { supabase } from '../../lib/supabase'
import { AuthContext } from './Authprovider';

export const MessageContext = createContext({});

export default Messageprovider = ({ children }) => {
    const { user, uid } = useContext(AuthContext);
    const [message, setMessage] = useState()

    const GetMessage = async (senderId, receiverId) => {
        try {
            let { data: messages, error } = await supabase
                .from('message')
                .select(`*`)
                .or(`and(sender.eq.${senderId},reciver.eq.${receiverId}),and(sender.eq.${receiverId},reciver.eq.${senderId})`);

            if (error) throw error;
            setMessage(messages)
        } catch (error) {
            console.log(error);
        }
    };

    const SubscribeToMessages = (senderId, receiverId) => {
        const subscription = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'message',
                    filter: `or(and(sender.eq.${senderId},reciver.eq.${receiverId}),and(sender.eq.${receiverId},reciver.eq.${senderId}))`
                },
                (payload) => {
                    // console.log('New message received:', payload.new);
                    // Fetch the latest messages whenever a new one is inserted
                    GetMessage(senderId, receiverId);
                }
            )
            .subscribe();

        return () => {
            // Unsubscribe when the component unmounts or whenever needed
            supabase.removeChannel(subscription);
        };
    };



    const SendMessage = async (mesageTeext) => {
        try {
            const { data: obj, error } = await supabase
                .from('message')
                .insert([mesageTeext]);

            if (error) {
                throw error;
            }
            console.log(obj)
        } catch (error) {
            console.error('Error inserting data:', error.message);
        }
    };

    const value = { message, SendMessage, GetMessage, setMessage, SubscribeToMessages }
    return (
        <MessageContext.Provider value={value} >
            {children}
        </MessageContext.Provider >
    )
}