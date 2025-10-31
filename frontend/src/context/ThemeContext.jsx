import { Children, createContext, useContext, useEffect, useState } from "react";

const context = createContext();

export const useTheme = () => {
    const theme = useContext(context);
    if (!theme) {
        return console.log("err");
    }

    return theme;
}

export const ThemeFunction = ({ children }) => {
    const [isDark, setIsdark] = useState(() => localStorage.getItem("theme") === "true");

    useEffect(() => {
        localStorage.setItem("theme", isDark);
    }, [isDark])

    const toggleTheme = () => {
        setIsdark(prev => !prev);
    };

    const value = {
        isDark,
        setIsdark,
        toggleTheme,
    };

    return (
        <context.Provider value={value}>
            {children}
        </context.Provider>
    )
}