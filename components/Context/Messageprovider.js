import React, { createContext, useState, useEffect, useContext, useRef, } from 'react';
import { supabase } from '../../lib/supabase'
import { AuthContext } from './Authprovider';

export const MessageContext = createContext({});

export default Messageprovider = ({ children }) => {
    const { user, uid } = useContext(AuthContext);
    const [message, setMessage] = useState()
    const [typing, setTyping] = useState(false)
    const [showdata, setShowdata] = useState([])
    const [getvalue,setGetvalue]=useState()


    const GetMessage = async (senderId, receiverId) => {
        try {
            setMessage([])
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
                        setMessage((prevMessages) => [...prevMessages, newMessage]);
                    }
                }
            )
            .subscribe();
        return channel;
    };

    const UpdateTyping = async (updatedData) => {
        try {
            const { data, error } = await supabase
                .from('Typing')
                .update(updatedData)
                .eq('sender', uid);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error updating user:', error.message);
            return null;
        }
    };

    // console.log("Render",user.full_name)

    const TrackTyping = (userId) => {

        const channels = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Typing', filter: `sender=eq.${userId}` },
                (payload) => {
                    if (payload.new.reciver === uid)
                        setTyping(payload.new.typing)
                }
            )
            .subscribe()
        return channels
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


    const Try = async () => {
        console.log("TY function Calling")
        try {
            const { data, error } = await supabase
                .from('message')
                .select('sender, reciver')
                .or(`or(sender.eq.${uid},reciver.eq.${uid})`)
                .order('time', { ascending: false })

            if (error) {
                throw error;
            }

            const arr = []
            const filteredData = data.filter(message => {
                if (message.sender === uid) {
                    arr.push(message.reciver);
                } else {
                    arr.push(message.sender);
                }
            });
            const UniqueData = removeDuplicates(arr)
            if (UniqueData.length > 0) {
                setShowdata(UniqueData)
                // console.log(UniqueData)
                let DataARR = []
                let NewData = {}
                for (let i = 0; i < UniqueData.length; i++) {
                    NewData = await GetLatestMessage(uid, UniqueData[i])
                    NewData.id = UniqueData[i]
                    DataARR.push(NewData)
                }
                for (let i=0 ; i<DataARR.length; i++){
                    const newData = await FetchSaVedContact(DataARR[i].id)
                    DataARR[i].saved_name=newData[0].saved_name
                    DataARR[i].number=newData[0].number
                    DataARR[i].profile_pic=newData[0].profiles.profile_pic
                    DataARR[i].email=newData[0].profiles.email
                }
                setGetvalue(DataARR)
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            return { status: 500, error: 'Failed to fetch messages' };
        }
    };

    const FetchSaVedContact = async (userId) => {
        try {
            let { data, error } = await supabase
                .from('Savedcontact')
                .select(`number,saved_name,profiles(phone,full_name,profile_pic,email)`)
                .match({
                    user_id:uid,
                    saved_id:userId
                });
                return data
        }
        catch (error) {
            console.log(error)
        }
    };

    const GetLatestMessage = async (uid, data) => {
        if (data) {
            try {
                let { data: messages, error } = await supabase
                    .from('message')
                    .select('*')
                    .or(`and(sender.eq.${uid},reciver.eq.${data}),and(sender.eq.${data},reciver.eq.${uid})`)
                    .order('time', { ascending: false })
                    .limit(1);

                if (error) throw error;
                if (messages[0]) {
                    const content = messages[0].content
                    const time = messages[0].time

                    return { content, time }
                }
            } catch (error) {
                console.log('Error fetching the latest message:', error);
                return null;
            }
        }
        return null
    };

    function removeDuplicates(array) {
        const uniqueSet = new Set(array);
        return Array.from(uniqueSet);
    }

    function SetValue(arr, value) {
        // Check if the value is already in the array
        if (arr[0] === value) {
            return arr; // Do nothing and return the array as is
        }
        const index = arr.indexOf(value);

        if (index !== -1) {
            // If found, remove it from the current position
            arr.splice(index, 1);
        }

        // Add the value to the beginning of the array
        arr.unshift(value);

        return arr;
    }

    const value = {Try,getvalue, showdata, setShowdata, GetLatestMessage, message, SendMessage, GetMessage, setMessage, SubscribeToMessages, UpdateTyping, TrackTyping, typing }
    return (
        <MessageContext.Provider value={value} >
            {children}
        </MessageContext.Provider >
    )
}