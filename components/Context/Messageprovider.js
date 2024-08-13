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
        const channel = supabase
            .channel('messages-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'message' },
                (payload) => {
                    const newMessage = payload.new;
                    if (
                        (newMessage.sender === senderId && newMessage.reciver === receiverId) ||
                        (newMessage.sender === receiverId && newMessage.reciver === senderId)
                    ) {
                        GetMessage(senderId, receiverId);
                    }
                }
            )
            .subscribe();
        return channel;
    };




    const SendMessage = async (mesageTeext) => {
        try {
            const { data: obj, error } = await supabase
                .from('message')
                .insert([mesageTeext]);

            if (error) {
                throw error;
            }
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