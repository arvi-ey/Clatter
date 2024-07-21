import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from './Authprovider';
import io from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [online, setOnline] = useState([]);
    const socketRef = useRef(null);
    const IP = `http://192.168.29.222:5000`;

    useEffect(() => {
        if (user && user._id) {
            socketRef.current = io(IP);

            socketRef.current.on('connect', () => {
                socketRef.current.emit('register', user._id);
            });

            const handleUserStatus = (data) => {
                console.log("User status data:", data);
                setOnline(prevOnline => {
                    const updatedOnline = prevOnline?.filter(user => user.userId !== data.userId);
                    if (data.status === 'online') {
                        updatedOnline.push(data);
                    }
                    return updatedOnline;
                });
            };

            socketRef.current.on('userStatus', handleUserStatus);

            socketRef.current.on('disconnect', () => {
                console.log('Disconnected from server');
            });

            // return () => {
            //     if (socketRef.current) {
            //         socketRef.current.off('userStatus', handleUserStatus);
            //         socketRef.current.disconnect();
            //     }
            // };
        }
    }, [user]);

    const UserOnline = () => {
        if (user && user._id && socketRef.current) {
            socketRef.current.emit('register', user._id);
        }
    };

    const value = { UserOnline, online };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
