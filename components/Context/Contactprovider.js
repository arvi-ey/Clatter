import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './Authprovider';

export const ContactContext = createContext();

const ContactProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchContact = async () => {
        if (user && user.saved_contact) {
            let userData = [];
            setLoading(true);
            for (let i = 0; i < user.saved_contact.length; i++) {
                let id = user.saved_contact[i].id;
                let saved_name = user.saved_contact[i].saved_name;
                try {
                    const result = await axios.get(`http://192.168.29.222:5000/getContacts/${id}`);
                    userData.push({ ...result.data, saved_name });
                } catch (err) {
                    console.log(err);
                }
            }
            setContacts(prevData => [...prevData, ...userData]);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchContact();
        }
    }, [user]);

    value = { contacts, fetchContact, loading }

    return (
        <ContactContext.Provider value={value}>
            {children}
        </ContactContext.Provider>
    );
};

export default ContactProvider;
