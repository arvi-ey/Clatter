import React, { createContext, useState, useEffect, useContext } from 'react';


export const ModeContext = createContext({});

export default Modeprovider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false)



    value = { darkMode, setDarkMode }
    return (
        <ModeContext.Provider value={value} >
            {
                children
            }
        </ModeContext.Provider>
    )
}

