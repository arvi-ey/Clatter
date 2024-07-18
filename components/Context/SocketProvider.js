import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './Authprovider';
import { Alert } from 'react-native';
import io from 'socket.io-client';

export const SocketContext = createContext()


const SocketProvider = ({ children }) => {
    const { user, GetUSerOnce } = useContext(AuthContext);
    const { online, setOnline } = useState(false)
    const socketRef = useRef(null);
    const IP = `http://192.168.29.222:5000`
    useEffect(() => {
        UserOnline()
        return () => {
            socketRef.current.disconnect();
        };
    }, [])


    const UserOnline = () => {
        if (user && user._id) {
            socketRef.current = io(IP);
            socketRef.current.on('connect', () => {
                socketRef.current.emit('register', user._id);
            });
            socketRef.current.on('userStatus', (data) => {
                console.log("THisss", data)
            })
            socketRef.current.on('disconnect', () => {
                console.log('Disconnected from server');
            });
        }
    }

    const value = { UserOnline }
    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider